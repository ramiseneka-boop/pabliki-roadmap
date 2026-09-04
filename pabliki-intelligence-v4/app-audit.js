function runAudit(){
  const names=[...new Set((document.querySelector('#auditInput').value||'').split(/[\s,;]+/).map(cleanUsername).filter(Boolean))].slice(0,50); const status=document.querySelector('#auditStatus');
  if(!names.length){status.textContent='Введите хотя бы один аккаунт.';return}
  state.checkResults=names.map(username=>state.publishers.find(p=>p.username===username)||{username,notFound:true}); renderAuditResults(); status.textContent=`Проверено: ${names.length}`;
}
function renderAuditResults(){
  const wrap=document.querySelector('#auditResults'); if(!state.checkResults.length){wrap.innerHTML='<div class="audit-empty">Результаты проверки появятся здесь.</div>';return}
  wrap.innerHTML=state.checkResults.map(p=>p.notFound?`<article class="audit-card"><h3>@${p.username}</h3><p class="sub">Аккаунта нет в загруженной базе. Автоматический внешний анализ подключается следующим серверным этапом.</p></article>`:`<article class="audit-card"><div class="audit-card-head"><div><h3>@${p.username}</h3><div class="sub">${p.city||'—'} · ${p.category||'—'}</div></div><span class="source-badge">Из базы</span></div><div class="audit-mini-grid"><div class="audit-mini"><span>Подписчики</span><b>${p.followers?fmt(p.followers):'—'}</b></div><div class="audit-mini"><span>Просмотры</span><b>${p.avgViews?fmt(p.avgViews):'Нет данных'}</b></div><div class="audit-mini"><span>ER</span><b>${p.er?percent(p.er):'—'}</b></div><div class="audit-mini"><span>Authenticity Risk</span><b>${p.riskLabel||'Нет данных'}</b></div></div><button class="details-button audit-details" data-id="${p.id}">Полный анализ</button></article>`).join('');
  wrap.querySelectorAll('.audit-details').forEach(b=>b.onclick=()=>openDrawer(Number(b.dataset.id)));
}
function openDrawer(id){
  const p=state.publishers.find(x=>x.id===id); if(!p)return; const format=document.querySelector('#formatFilter')?.value||'reels', e=economyFor(p,format);
  document.querySelector('#drawerContent').innerHTML=`<div class="drawer-title"><span class="handle">@${p.username}</span><h2>${p.city||'—'}</h2><p>${p.category||'—'} · ${p.followers?fmt(p.followers):'—'} подписчиков</p></div><div class="forecast-card"><h3>Экономика ${formatLabel(format)}</h3><div class="forecast-lines"><div><span>Себестоимость</span><b>${money(e.cost)}</b></div><div><span>Цена продажи</span><b>${money(e.sale)}</b></div><div><span>Цена клиенту</span><b>${money(e.clientPrice)}</b></div><div><span>Налоги и комиссии</span><b>${money(e.charges)}</b></div><div><span>Чистая маржа</span><b>${money(e.margin)}</b></div><div><span>Маржинальность</span><b>${percent(e.marginPct)}</b></div><div><span>CPM</span><b>${e.cpm?money(e.cpm):'Нет данных'}</b></div></div></div><div class="forecast-card"><h3>Аналитика</h3><div class="forecast-lines"><div><span>Средние просмотры Reels</span><b>${p.avgViews?fmt(p.avgViews):'Нет данных'}</b></div><div><span>ER</span><b>${p.er?percent(p.er):'Нет данных'}</b></div><div><span>Authenticity Risk</span><b>${p.riskLabel||'Нет данных'}</b></div></div></div>`;
  document.querySelector('#publisherDrawer').classList.add('open');document.querySelector('#drawerBackdrop').classList.add('open');
}
function closeDrawer(){document.querySelector('#publisherDrawer').classList.remove('open');document.querySelector('#drawerBackdrop').classList.remove('open')}
function switchView(view){
  state.view=view;document.querySelectorAll('.view').forEach(v=>v.classList.remove('active-view'));document.querySelector(`#${view}View`).classList.add('active-view');document.querySelectorAll('.nav-item').forEach(n=>n.classList.toggle('active',n.dataset.view===view));
  const titles={dashboard:'Обзор базы',publishers:'Паблики',campaigns:'Подборки для клиентов',audit:'Проверка пабликов',imports:'Импорт базы',methodology:'Методика'};document.querySelector('#pageTitle').textContent=titles[view]; if(view==='publishers')renderPublishers();if(view==='campaigns')renderCampaign();if(view==='audit')renderAuditResults();
}
function escapeHtml(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function renderAll(){renderDashboard();renderPublishers();renderCampaign();renderAuditResults()}
function syncEconomicsControls(){
  [['ipnToggle','ipn'],['kpnToggle','kpn'],['agentToggle','agent'],['counterpartyToggle','counterparty'],['grossUpToggle','grossUp']].forEach(([id,key])=>{const el=document.querySelector('#'+id);if(el)el.checked=!!state.economics[key]});
}
function setEconomics(key,value){
  if(key==='ipn'&&value)state.economics.kpn=false;if(key==='kpn'&&value)state.economics.ipn=false;state.economics[key]=value;syncEconomicsControls();saveState();renderAll();
}
