function selectionMetricMap(){return {
  city:{title:'Город',value:p=>p.city},followers:{title:'Подписчики',value:p=>fmt(p.followers)},score:{title:'Quality Score',value:p=>`${p.score}/100`},views:{title:'Expected Views',value:p=>`${fmt(p.lowViews)}–${fmt(p.highViews)} (~${fmt(p.likelyViews)})`},er:{title:'ER',value:p=>`${p.er.toFixed(1)}%`},cpm:{title:'CPM',value:p=>p.cpm?money(p.cpm):'—'},price:{title:'Цена',value:p=>p.price?money(p.price):'—'},risk:{title:'Риск активности',value:p=>`${riskText[p.risk]} (${p.riskScore}/100)`},confidence:{title:'Confidence',value:p=>`${p.confidence}%`},consistency:{title:'Consistency',value:p=>`${p.consistency}/100`},viral:{title:'Viral Dependency',value:p=>`${p.viral}/100`},retention:{title:'Advertising Retention',value:p=>`${p.adRetention}%`}
}}
function fallbackPrintSelection(ps,metrics,title,client){
  const map=selectionMetricMap();
  const rows=ps.map(p=>`<tr><td>@${p.username}</td>${metrics.map(k=>`<td>${map[k].value(p)}</td>`).join('')}</tr>`).join('');
  const win=window.open('','_blank');if(!win)return;
  win.document.write(`<html><head><meta charset="utf-8"><title>${title}</title><style>body{font-family:Arial,sans-serif;padding:28px;color:#17211f}h1{margin-bottom:5px}p{color:#6c7b76}table{border-collapse:collapse;width:100%;font-size:11px}th,td{border:1px solid #dce3e0;padding:7px;text-align:left}th{background:#eef6f2}</style></head><body><h1>${title}</h1><p>${client?`Клиент: ${client} · `:''}Pabliki Intelligence · ${new Date().toLocaleDateString('ru-RU')}</p><table><thead><tr><th>Паблик</th>${metrics.map(k=>`<th>${map[k].title}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table><p>Прогнозные показатели являются оценочными и не гарантируют фактический результат размещения.</p></body></html>`);win.document.close();win.focus();setTimeout(()=>win.print(),250);
}
function exportSelectionPdf(){
  const ps=state.publishers.filter(p=>state.selected.has(p.id));const status=document.querySelector('#pdfStatus');
  if(!ps.length){status.textContent='Сначала выберите хотя бы один паблик.';status.style.color='#b73f3f';return}
  const metrics=[...document.querySelectorAll('#metricChecks input:checked')].map(x=>x.value);if(!metrics.length){status.textContent='Выберите хотя бы один показатель для PDF.';status.style.color='#b73f3f';return}
  const title=document.querySelector('#selectionName').value.trim()||'Подборка пабликов';const client=document.querySelector('#clientName').value.trim();const map=selectionMetricMap();
  const budget=ps.reduce((a,p)=>a+(p.price||0),0),views=ps.reduce((a,p)=>a+p.likelyViews,0),engagements=ps.reduce((a,p)=>a+p.likelyViews*p.er/100,0),avgConf=Math.round(ps.reduce((a,p)=>a+p.confidence,0)/ps.length);
  if(typeof pdfMake==='undefined'){status.textContent='PDF-модуль не загрузился. Открываю версию для печати / сохранения в PDF.';status.style.color='#a26b08';fallbackPrintSelection(ps,metrics,title,client);return}
  const header=['Паблик',...metrics.map(k=>map[k].title)];const body=[header,...ps.map(p=>[`@${p.username}`,...metrics.map(k=>map[k].value(p))])];
  const doc={pageSize:'A4',pageOrientation:'landscape',pageMargins:[28,30,28,30],content:[
    {text:'Pabliki Intelligence',fontSize:10,bold:true,color:'#16875d',margin:[0,0,0,4]},
    {text:title,fontSize:20,bold:true,margin:[0,0,0,4]},
    {text:`${client?`Клиент: ${client} · `:''}${new Date().toLocaleDateString('ru-RU')} · ${ps.length} пабликов`,fontSize:9,color:'#70807c',margin:[0,0,0,16]},
    {columns:[{text:`Ожидаемые просмотры\n${fmt(views)}`,bold:true},{text:`Бюджет\n${money(budget)}`,bold:true},{text:`CPM подборки\n${views&&budget?money(budget/views*1000):'—'}`,bold:true},{text:`Ожидаемые взаимодействия\n${fmt(engagements)}`,bold:true},{text:`Надёжность прогноза\n${avgConf}%`,bold:true}],columnGap:10,margin:[0,0,0,16],fontSize:9},
    {table:{headerRows:1,widths:Array(header.length).fill('*'),body},layout:{fillColor:(row)=>row===0?'#EAF5F0':null,hLineColor:()=> '#DDE6E2',vLineColor:()=> '#DDE6E2',paddingLeft:()=>5,paddingRight:()=>5,paddingTop:()=>5,paddingBottom:()=>5},fontSize:7},
    {text:'Прогнозные показатели являются оценочными и не гарантируют фактический результат размещения. Суммарные просмотры не равны уникальному охвату.',fontSize:7,color:'#70807c',margin:[0,14,0,0]}
  ],defaultStyle:{font:'Roboto'}};
  const safe=title.replace(/[^a-zA-Zа-яА-Я0-9_-]+/g,'_').slice(0,60)||'pabliki_selection';pdfMake.createPdf(doc).download(`${safe}.pdf`);status.textContent=`PDF сформирован: ${ps.length} пабликов, ${metrics.length} показателей.`;status.style.color='#128155';
}
function hashUsername(str){let h=2166136261;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function demoPublisherForAudit(username){const h=hashUsername(username);const followers=50000+(h%1450000),score=48+(h%43),likely=Math.max(4000,Math.round(followers*(.025+((h>>5)%60)/1000))),spread=.28+((h>>8)%25)/100,er=.8+((h>>11)%35)/10,riskScore=20+((h>>15)%66),risk=riskScore>=60?'high':riskScore>=40?'medium':'low',confidence=42+((h>>19)%34);return {id:-Number(h||1),username,city:'Не определён',category:'Публичный анализ',followers,score,lowViews:Math.round(likely*(1-spread)),likelyViews:likely,highViews:Math.round(likely*(1+spread)),er,cpm:0,price:0,risk,riskScore,confidence,consistency:35+((h>>7)%60),viral:20+((h>>10)%75),adRetention:30+((h>>13)%55),source:'demo'}}
function runAudit(){
  const raw=document.querySelector('#auditInput').value;const names=[...new Set(raw.split(/[\s,;]+/).map(x=>x.trim().replace(/^@/,'').replace(/^https?:\/\/(www\.)?instagram\.com\//i,'').replace(/\/$/,'').toLowerCase()).filter(Boolean))].slice(0,30);
  const status=document.querySelector('#auditStatus');if(!names.length){status.textContent='Введите хотя бы один @username.';return}
  state.checkResults=names.map(username=>{const found=state.publishers.find(p=>p.username.toLowerCase()===username);return found?{...found,source:'base'}:demoPublisherForAudit(username)});renderAuditResults();status.textContent=`Проверено: ${state.checkResults.length}. В рабочей версии неизвестные аккаунты будут автоматически запрашиваться у источников данных.`;
}
function renderAuditResults(){
  const wrap=document.querySelector('#auditResults');if(!wrap)return;if(!state.checkResults.length){wrap.innerHTML='<div class="audit-empty">Результаты проверки появятся здесь.</div>';return}
  wrap.innerHTML=state.checkResults.map(p=>`<article class="audit-card"><div class="audit-card-head"><div><h3>@${p.username}</h3><div class="sub">${p.city} · ${p.category}</div></div><span class="source-badge ${p.source==='demo'?'demo':''}">${p.source==='base'?'Из базы':'Демо-расчёт'}</span></div><div class="audit-score-row"><div class="audit-score"><span>Quality Score</span><strong>${p.score}<small>/100</small></strong></div><div class="audit-mini-grid"><div class="audit-mini"><span>Expected Views</span><b>~${fmt(p.likelyViews)}</b></div><div class="audit-mini"><span>ER</span><b>${p.er.toFixed(1)}%</b></div><div class="audit-mini"><span>CPM</span><b>${p.cpm?money(p.cpm):'нет цены'}</b></div><div class="audit-mini"><span>Risk</span><b class="risk ${riskClass(p.risk)}">${riskText[p.risk]}</b></div></div></div><div class="audit-card-actions"><small>${p.source==='demo'?'Тестовые цифры для проверки интерфейса. Не являются оценкой реального аккаунта.':`Confidence ${p.confidence}% · ${fmt(p.followers)} подписчиков`}</small><button class="details-button audit-details" data-id="${p.id}">Полный анализ</button></div></article>`).join('');
  wrap.querySelectorAll('.audit-details').forEach(b=>b.addEventListener('click',()=>openDrawer(Number(b.dataset.id))));
}

function openDrawer(id){
  const p=state.publishers.find(x=>x.id===id)||state.checkResults.find(x=>x.id===id); if(!p)return;
  document.querySelector('#drawerContent').innerHTML=`
    <div class="drawer-title"><span class="handle">@${p.username}</span><h2>${p.city}</h2><p>${p.category} · ${fmt(p.followers)} подписчиков</p></div>
    <div class="drawer-score"><div class="score-hero"><span>Quality Score</span><strong>${p.score}<small>/100</small></strong><small>Общая оценка паблика</small></div><div class="drawer-metrics">
      <div class="metric-box"><span>Authenticity Risk</span><b class="risk ${riskClass(p.risk)}">${riskText[p.risk]} · ${p.riskScore}/100</b></div>
      <div class="metric-box"><span>Confidence</span><b>${p.confidence}%</b></div>
      <div class="metric-box"><span>Consistency</span><b>${p.consistency}/100</b></div>
      <div class="metric-box"><span>Viral Dependency</span><b>${p.viral}/100</b></div>
    </div></div>
    <div class="forecast-card"><h3>Expected Views — прогноз рекламного Reels</h3><p>Диапазон вместо псевдоточного одного числа</p><div class="range"><div><span>Нижняя граница</span><b>${fmt(p.lowViews)}</b></div><div><span>Most likely</span><b>~${fmt(p.likelyViews)}</b></div><div><span>Верхняя граница</span><b>${fmt(p.highViews)}</b></div></div></div>
    <div class="forecast-card"><h3>Экономика размещения</h3><div class="forecast-lines"><div><span>Цена размещения</span><b>${p.price?money(p.price):'Не указана'}</b></div><div><span>CPM — 1 000 просмотров</span><b>${p.cpm?money(p.cpm):'—'}</b></div><div><span>ER — вовлечённость</span><b>${p.er.toFixed(1)}%</b></div><div><span>Advertising Retention</span><b>${p.adRetention}%</b></div></div></div>
    <div class="drawer-section"><h3>Что видит система</h3>
      <div class="analysis-note"><b>${p.riskScore>=60?'⚠ Требуется проверка активности':'✓ Критичных сигналов не обнаружено'}</b><span>${p.riskScore>=60?'Соотношение просмотров и взаимодействий может содержать искусственные или нетипичные всплески. Это сигнал риска, а не утверждение о накрутке.':'Тестовые показатели не показывают сильного рассогласования между просмотрами и взаимодействиями.'}</span></div>
      <div class="analysis-note"><b>${p.viral>55?'⚠ Сильная зависимость от вирусных публикаций':'✓ Просмотры распределены сравнительно стабильно'}</b><span>Viral Dependency: ${p.viral}/100. Чем выше показатель, тем опаснее ориентироваться на среднее число просмотров.</span></div>
      <div class="analysis-note"><b>Прогноз использовать с надёжностью ${p.confidence}%</b><span>После реальных размещений Forecast vs Fact будет сохраняться и персонально корректировать прогноз для этого паблика.</span></div>
    </div>`;
  document.querySelector('#publisherDrawer').classList.add('open');
  document.querySelector('#drawerBackdrop').classList.add('open');
  document.querySelector('#publisherDrawer').setAttribute('aria-hidden','false');
}
function closeDrawer(){document.querySelector('#publisherDrawer').classList.remove('open');document.querySelector('#drawerBackdrop').classList.remove('open');document.querySelector('#publisherDrawer').setAttribute('aria-hidden','true')}

function switchView(view){
  state.view=view; document.querySelectorAll('.view').forEach(v=>v.classList.remove('active-view')); document.querySelector(`#${view}View`).classList.add('active-view');
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.toggle('active',n.dataset.view===view));
  const titles={dashboard:'Обзор базы',publishers:'Анализ пабликов',campaigns:'Подборки для клиентов',audit:'Проверка пабликов',imports:'Импорт базы',methodology:'Методика оценки'};document.querySelector('#pageTitle').textContent=titles[view];
  if(view==='publishers')renderPublishers(); if(view==='campaigns')renderCampaign(); if(view==='audit')renderAuditResults();
}

function parseCsv(text){
  const lines=text.split(/\r?\n/).filter(Boolean); if(lines.length<2)return [];
  const sep=lines[0].includes(';')?';':','; const headers=lines[0].split(sep).map(x=>x.trim().toLowerCase());
  const find=(row,names)=>{for(const n of names){const i=headers.indexOf(n); if(i>=0)return row[i]?.trim()}return ''};
  return lines.slice(1).map((line,idx)=>{const row=line.split(sep); const username=(find(row,['username','instagram','паблик','аккаунт'])||`imported.${Date.now()}.${idx}`).replace(/^@/,'').toLowerCase(); const price=Number((find(row,['цена reels','reels','цена','price'])||'0').replace(/\s/g,''))||50000; const followers=Number((find(row,['подписчики','followers'])||'0').replace(/\s/g,''))||100000; const base=Math.max(5000,Math.round(followers*.07)); return {id:Date.now()+idx,username,city:find(row,['город','city'])||'Не указан',category:find(row,['тематика','category'])||'Не указана',followers,score:65,lowViews:Math.round(base*.65),likelyViews:base,highViews:Math.round(base*1.45),er:2.0,cpm:Math.round(price/base*1000),price,risk:'medium',riskScore:45,confidence:35,consistency:60,viral:50,adRetention:50}}).filter(p=>p.username);
}

function importCsv(file){
  const status=document.querySelector('#importStatus');
  if(!file)return; const ext=file.name.split('.').pop().toLowerCase();
  if(ext!=='csv'){status.textContent='XLS/XLSX выбран. В прототипе интерфейс готов, а серверный Excel-парсер подключим на следующем шаге.';status.style.color='#a26b08';return}
  const reader=new FileReader();reader.onload=()=>{const rows=parseCsv(reader.result); let added=0,updated=0; rows.forEach(n=>{const old=state.publishers.find(p=>p.username===n.username);if(old){Object.assign(old,{...n,id:old.id});updated++}else{state.publishers.push(n);added++}});status.textContent=`Импорт завершён: добавлено ${added}, обновлено ${updated}. Для новых строк выставлена низкая надёжность прогноза до сбора данных.`;status.style.color='#128155';renderDashboard();setupSelectionFilters();};reader.readAsText(file,'utf-8');
}

document.querySelectorAll('.nav-item').forEach(b=>b.addEventListener('click',()=>switchView(b.dataset.view)));
document.querySelectorAll('[data-jump]').forEach(b=>b.addEventListener('click',()=>switchView(b.dataset.jump)));
document.querySelector('#importBtn').addEventListener('click',()=>switchView('imports'));
document.querySelector('#refreshBtn').addEventListener('click',e=>{e.target.textContent='Оценки обновлены ✓';setTimeout(()=>e.target.textContent='Обновить оценки',1200)});
document.querySelector('#searchInput').addEventListener('input',renderPublishers);document.querySelector('#riskFilter').addEventListener('change',renderPublishers);document.querySelector('#sortSelect').addEventListener('change',renderPublishers);
['selectionSearch','selectionCity','selectionCategory','selectionRisk','selectionScore','selectionMaxCpm','selectionMinViews','selectionMaxPrice'].forEach(id=>{const el=document.querySelector('#'+id);if(el)el.addEventListener(el.tagName==='INPUT'?'input':'change',renderCampaign)});
document.querySelector('#selectFilteredBtn').addEventListener('click',()=>{getSelectionFiltered().forEach(p=>state.selected.add(p.id));renderCampaign()});
document.querySelector('#clearSelectionBtn').addEventListener('click',()=>{state.selected.clear();renderCampaign()});
document.querySelector('#downloadPdfBtn').addEventListener('click',exportSelectionPdf);
document.querySelector('#runAuditBtn').addEventListener('click',runAudit);document.querySelector('#clearAuditBtn').addEventListener('click',()=>{document.querySelector('#auditInput').value='';state.checkResults=[];renderAuditResults();document.querySelector('#auditStatus').textContent='Введите один или несколько @username'});

document.querySelector('#closeDrawer').addEventListener('click',closeDrawer);document.querySelector('#drawerBackdrop').addEventListener('click',closeDrawer);document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDrawer()});
document.querySelector('#fileInput').addEventListener('change',e=>importCsv(e.target.files[0]));
renderDashboard();setupSelectionFilters();
