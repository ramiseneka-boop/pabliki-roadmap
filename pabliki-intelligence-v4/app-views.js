function publisherCell(p){return `<div class="publisher-cell"><div class="avatar">${(p.username[0]||'P').toUpperCase()}</div><div><b>@${p.username}</b><small>${p.city||'—'} · ${p.category||'Без тематики'}</small></div></div>`}
function renderDashboard(){
  const ps = state.selected.size ? state.publishers.filter(p=>state.selected.has(p.id)) : state.publishers;
  const a = aggregate(ps, document.querySelector('#formatFilter')?.value || 'reels');
  document.querySelector('#totalPublishers').textContent=fmt(state.publishers.length);
  document.querySelector('#dashCost').textContent=ps.length?money(a.cost):'—';
  document.querySelector('#dashSale').textContent=ps.length?money(a.sale):'—';
  document.querySelector('#dashMargin').textContent=ps.length?money(a.margin):'—';
  document.querySelector('#emptyNotice').classList.toggle('hidden', state.publishers.length>0);
  const rows=state.publishers.slice(0,8).map(p=>{const e=economyFor(p,'reels');return `<tr><td>${publisherCell(p)}</td><td>${p.followers?fmt(p.followers):'—'}</td><td>${money(e.cost)}</td><td>${money(e.sale)}</td><td>${money(e.clientPrice)}</td><td class="${e.margin<0?'risk-high':'risk-low'}"><b>${money(e.margin)}</b></td></tr>`}).join('');
  document.querySelector('#dashboardTable').innerHTML=rows||'<tr><td colspan="6">База пока пустая — импортируйте Excel.</td></tr>';
  document.querySelector('#economicsSummary').innerHTML=`
    <div class="signal"><b>Выбранные расходы</b><span>${chargeBreakdown()}</span></div>
    <div class="signal"><b>Общая ставка</b><span>${percent(chargeRate()*100,0)}</span></div>
    <div class="signal"><b>Режим цены</b><span>${state.economics.grossUp?'Расходы добавляются сверху':'Расходы вычитаются из цены продажи'}</span></div>`;
}

function setupFilterOptions(){
  const cities=[...new Set(state.publishers.map(p=>p.city).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'ru'));
  const cats=[...new Set(state.publishers.map(p=>p.category).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'ru'));
  [['cityFilter',cities,'Все города'],['selectionCity',cities,'Все города'],['selectionCategory',cats,'Все тематики']].forEach(([id,arr,label])=>{
    const el=document.querySelector('#'+id); if(!el)return; const current=el.value;
    el.innerHTML=`<option value="all">${label}</option>`+arr.map(v=>`<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join('');
    if([...el.options].some(o=>o.value===current))el.value=current;
  });
}
function getPublishersFiltered(){
  let ps=[...state.publishers];
  const q=(document.querySelector('#searchInput')?.value||'').toLowerCase().trim(), city=document.querySelector('#cityFilter')?.value||'all';
  if(q)ps=ps.filter(p=>[p.username,p.city,p.category,p.region].some(x=>String(x||'').toLowerCase().includes(q)));
  if(city!=='all')ps=ps.filter(p=>p.city===city);
  const format=document.querySelector('#formatFilter')?.value||'reels';
  const sort=document.querySelector('#sortSelect')?.value||'username';
  ps.sort((a,b)=>{
    if(sort==='followers-desc')return num(b.followers)-num(a.followers);
    if(sort==='margin-desc')return economyFor(b,format).margin-economyFor(a,format).margin;
    if(sort==='cpm-asc'){const ac=economyFor(a,format).cpm||Infinity,bc=economyFor(b,format).cpm||Infinity;return ac-bc}
    return a.username.localeCompare(b.username);
  });
  return ps;
}
function renderPublishers(){
  setupFilterOptions(); const format=document.querySelector('#formatFilter')?.value||'reels';
  const ps=getPublishersFiltered();
  document.querySelector('#publishersTable').innerHTML=ps.map(p=>{const e=economyFor(p,format);return `<tr><td>${publisherCell(p)}</td><td>${p.followers?fmt(p.followers):'—'}</td><td>${p.avgViews?fmt(p.avgViews):'<span class="muted">Нет данных</span>'}</td><td>${p.er?percent(p.er):'—'}</td><td>${e.cpm?money(e.cpm):'—'}</td><td>${money(e.cost)}</td><td>${money(e.sale)}</td><td><b>${money(e.clientPrice)}</b></td><td class="${e.margin<0?'risk-high':'risk-low'}"><b>${money(e.margin)}</b><br><small>${percent(e.marginPct)}</small></td><td><button class="details-button" data-id="${p.id}">Открыть</button></td></tr>`}).join('')||'<tr><td colspan="10">Паблики не найдены</td></tr>';
  document.querySelectorAll('#publishersTable .details-button').forEach(b=>b.onclick=()=>openDrawer(Number(b.dataset.id)));
}

function getSelectionFiltered(){
  let ps=[...state.publishers];
  const q=(document.querySelector('#selectionSearch')?.value||'').toLowerCase().trim();
  const city=document.querySelector('#selectionCity')?.value||'all', cat=document.querySelector('#selectionCategory')?.value||'all', format=document.querySelector('#selectionFormat')?.value||'reels';
  const maxCpm=num(document.querySelector('#selectionMaxCpm')?.value), minViews=num(document.querySelector('#selectionMinViews')?.value), maxPrice=num(document.querySelector('#selectionMaxPrice')?.value), minMargin=num(document.querySelector('#selectionMinMargin')?.value);
  if(q)ps=ps.filter(p=>[p.username,p.city,p.category,p.region].some(x=>String(x||'').toLowerCase().includes(q)));
  if(city!=='all')ps=ps.filter(p=>p.city===city); if(cat!=='all')ps=ps.filter(p=>p.category===cat);
  if(maxCpm)ps=ps.filter(p=>{const x=economyFor(p,format).cpm;return x>0&&x<=maxCpm});
  if(minViews)ps=ps.filter(p=>num(p.avgViews)>=minViews);
  if(maxPrice)ps=ps.filter(p=>economyFor(p,format).clientPrice<=maxPrice);
  if(minMargin)ps=ps.filter(p=>economyFor(p,format).margin>=minMargin);
  return ps.sort((a,b)=>economyFor(b,format).margin-economyFor(a,format).margin);
}
function renderCampaign(){
  setupFilterOptions(); const ps=getSelectionFiltered(), format=document.querySelector('#selectionFormat')?.value||'reels';
  document.querySelector('#selectionTable').innerHTML=ps.map(p=>{const e=economyFor(p,format);return `<tr class="${state.selected.has(p.id)?'selected-row':''}"><td>${publisherCell(p)}</td><td>${p.avgViews?fmt(p.avgViews):'—'}</td><td>${e.cpm?money(e.cpm):'—'}</td><td>${money(e.cost)}</td><td>${money(e.sale)}</td><td><b>${money(e.clientPrice)}</b></td><td class="${e.margin<0?'risk-high':'risk-low'}"><b>${money(e.margin)}</b></td><td><input class="selection-check" type="checkbox" value="${p.id}" ${state.selected.has(p.id)?'checked':''}></td></tr>`}).join('')||'<tr><td colspan="8">По этим критериям паблики не найдены</td></tr>';
  document.querySelectorAll('.selection-check').forEach(i=>i.onchange=e=>{const id=Number(e.target.value);e.target.checked?state.selected.add(id):state.selected.delete(id);renderCampaign();renderDashboard()});
  document.querySelector('#selectionCount').innerHTML=`<span>Найдено: <b>${fmt(ps.length)}</b></span><span>•</span><span>Выбрано: <b>${fmt(state.selected.size)}</b></span>`;
  updateCampaignForecast();
}
function updateCampaignForecast(){
  const format=document.querySelector('#selectionFormat')?.value||'reels', ps=state.publishers.filter(p=>state.selected.has(p.id)), a=aggregate(ps,format);
  const marginPct=a.clientPrice?a.margin/a.clientPrice*100:0, cpm=a.views&&a.clientPrice?a.clientPrice/a.views*1000:0;
  document.querySelector('#campaignClientPrice').textContent=ps.length?money(a.clientPrice):'—';
  document.querySelector('#campaignPublishers').textContent=ps.length||'—';
  document.querySelector('#campaignCost').textContent=ps.length?money(a.cost):'—';
  document.querySelector('#campaignBaseSale').textContent=ps.length?money(a.sale):'—';
  document.querySelector('#campaignCharges').textContent=ps.length?money(a.charges):'—';
  document.querySelector('#campaignMargin').textContent=ps.length?money(a.margin):'—';
  document.querySelector('#campaignMarginPct').textContent=ps.length?percent(marginPct):'—';
  document.querySelector('#campaignViews').textContent=a.views?fmt(a.views):'Нет данных';
  document.querySelector('#campaignCpm').textContent=cpm?money(cpm):'—';
}
