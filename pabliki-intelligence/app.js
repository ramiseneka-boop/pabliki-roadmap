const publishers = [
  {id:1, username:'almaty.suntimes', city:'Алматы', category:'Городские новости', followers:1628000, score:58, lowViews:32000, likelyViews:46000, highViews:67000, er:1.8, cpm:3260, price:150000, risk:'high', riskScore:68, confidence:73, consistency:38, viral:77, adRetention:34},
  {id:2, username:'typical.almaty', city:'Алматы', category:'Городской паблик', followers:742000, score:82, lowViews:52000, likelyViews:71000, highViews:96000, er:2.9, cpm:1480, price:105000, risk:'low', riskScore:22, confidence:86, consistency:84, viral:29, adRetention:63},
  {id:3, username:'astana.life.demo', city:'Астана', category:'Городской паблик', followers:515000, score:76, lowViews:36000, likelyViews:54000, highViews:74000, er:2.4, cpm:1660, price:90000, risk:'medium', riskScore:41, confidence:79, consistency:72, viral:44, adRetention:58},
  {id:4, username:'kazakhstan.media.demo', city:'Казахстан', category:'Новости', followers:980000, score:67, lowViews:41000, likelyViews:62000, highViews:103000, er:1.6, cpm:2180, price:135000, risk:'medium', riskScore:52, confidence:70, consistency:55, viral:61, adRetention:42},
  {id:5, username:'shymkent.today.demo', city:'Шымкент', category:'Городские новости', followers:338000, score:88, lowViews:43000, likelyViews:59000, highViews:79000, er:3.6, cpm:1190, price:70000, risk:'low', riskScore:17, confidence:90, consistency:89, viral:20, adRetention:71},
  {id:6, username:'karaganda.city.demo', city:'Караганда', category:'Городской паблик', followers:241000, score:71, lowViews:19000, likelyViews:31000, highViews:47000, er:2.2, cpm:1450, price:45000, risk:'medium', riskScore:46, confidence:76, consistency:68, viral:48, adRetention:54},
];

const state = {publishers:[...publishers], selected:new Set([2,5,6]), checkResults:[], view:'dashboard'};
const fmt = n => new Intl.NumberFormat('ru-RU').format(Math.round(n));
const money = n => `${fmt(n)} ₸`;
const riskText = {low:'Низкий',medium:'Средний',high:'Высокий'};
const scoreClass = s => s>=75?'score-good':s>=60?'score-mid':'score-bad';
const riskClass = r => `risk-${r}`;

function publisherCell(p){return `<div class="publisher-cell"><div class="avatar">${p.username[0].toUpperCase()}</div><div><b>@${p.username}</b><small>${p.city} · ${p.category}</small></div></div>`}
function scoreCell(p){return `<div class="score"><span class="score-badge ${scoreClass(p.score)}">${p.score}</span><span>${p.score>=75?'Сильный':p.score>=60?'Средний':'Проверить'}</span></div>`}

function renderDashboard(){
  const ps=state.publishers;
  document.querySelector('#totalPublishers').textContent=fmt(ps.length);
  document.querySelector('#strongPublishers').textContent=fmt(ps.filter(p=>p.score>=75).length);
  document.querySelector('#riskyPublishers').textContent=fmt(ps.filter(p=>p.risk==='high').length);
  document.querySelector('#avgCpm').textContent=money(ps.reduce((a,p)=>a+p.cpm,0)/Math.max(ps.length,1));
  document.querySelector('#dashboardTable').innerHTML=ps.slice().sort((a,b)=>b.score-a.score).slice(0,5).map(p=>`<tr data-id="${p.id}"><td>${publisherCell(p)}</td><td>${scoreCell(p)}</td><td><b>${fmt(p.lowViews)}–${fmt(p.highViews)}</b><br><small>вероятно ~${fmt(p.likelyViews)}</small></td><td>${p.er.toFixed(1)}%</td><td>${money(p.cpm)}</td><td class="risk ${riskClass(p.risk)}">${riskText[p.risk]}</td></tr>`).join('');
  document.querySelectorAll('#dashboardTable tr').forEach(r=>r.addEventListener('click',()=>openDrawer(Number(r.dataset.id))));
  const risky=ps.slice().sort((a,b)=>b.riskScore-a.riskScore).slice(0,4);
  document.querySelector('#riskSignals').innerHTML=risky.map(p=>`<div class="signal"><span class="tag">${riskText[p.risk]} риск</span><b>@${p.username}</b><span>${p.riskScore>=60?'Есть несоответствие между масштабом просмотров и вовлечением. Нужна ручная проверка выбросов.':p.viral>55?'Высокая зависимость от отдельных вирусных публикаций.':'Показатели нестабильны, прогноз лучше использовать диапазоном.'}</span></div>`).join('');
}

function getFiltered(){
  let ps=[...state.publishers];
  const q=document.querySelector('#searchInput').value.trim().toLowerCase();
  const rf=document.querySelector('#riskFilter').value;
  const sort=document.querySelector('#sortSelect').value;
  if(q) ps=ps.filter(p=>`${p.username} ${p.city} ${p.category}`.toLowerCase().includes(q));
  if(rf!=='all') ps=ps.filter(p=>p.risk===rf);
  if(sort==='score-desc') ps.sort((a,b)=>b.score-a.score);
  if(sort==='views-desc') ps.sort((a,b)=>b.likelyViews-a.likelyViews);
  if(sort==='cpm-asc') ps.sort((a,b)=>a.cpm-b.cpm);
  if(sort==='risk-desc') ps.sort((a,b)=>b.riskScore-a.riskScore);
  return ps;
}
function renderPublishers(){
  document.querySelector('#publishersTable').innerHTML=getFiltered().map(p=>`<tr><td>${publisherCell(p)}</td><td>${fmt(p.followers)}</td><td>${scoreCell(p)}</td><td><b>${fmt(p.lowViews)}–${fmt(p.highViews)}</b><br><small>~${fmt(p.likelyViews)} наиболее вероятно</small></td><td>${p.er.toFixed(1)}%</td><td>${money(p.cpm)}</td><td class="confidence">${p.confidence}%</td><td><button class="details-button" data-id="${p.id}">Анализ</button></td></tr>`).join('') || '<tr><td colspan="8">Ничего не найдено</td></tr>';
  document.querySelectorAll('.details-button').forEach(b=>b.addEventListener('click',()=>openDrawer(Number(b.dataset.id))));
}

function setupSelectionFilters(){
  const city=document.querySelector('#selectionCity'), cat=document.querySelector('#selectionCategory');
  if(!city||!cat)return;
  const currentCity=city.value,currentCat=cat.value;
  const cities=[...new Set(state.publishers.map(p=>p.city).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'ru'));
  const cats=[...new Set(state.publishers.map(p=>p.category).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'ru'));
  city.innerHTML='<option value="all">Все города</option>'+cities.map(x=>`<option value="${x}">${x}</option>`).join('');
  cat.innerHTML='<option value="all">Все тематики</option>'+cats.map(x=>`<option value="${x}">${x}</option>`).join('');
  if(cities.includes(currentCity))city.value=currentCity;if(cats.includes(currentCat))cat.value=currentCat;
}
function getSelectionFiltered(){
  let ps=[...state.publishers];
  const q=document.querySelector('#selectionSearch')?.value.trim().toLowerCase()||'';
  const city=document.querySelector('#selectionCity')?.value||'all';
  const category=document.querySelector('#selectionCategory')?.value||'all';
  const risk=document.querySelector('#selectionRisk')?.value||'all';
  const minScore=Number(document.querySelector('#selectionScore')?.value||0);
  const maxCpm=Number(document.querySelector('#selectionMaxCpm')?.value||0);
  const minViews=Number(document.querySelector('#selectionMinViews')?.value||0);
  const maxPrice=Number(document.querySelector('#selectionMaxPrice')?.value||0);
  if(q)ps=ps.filter(p=>`${p.username} ${p.city} ${p.category}`.toLowerCase().includes(q));
  if(city!=='all')ps=ps.filter(p=>p.city===city);
  if(category!=='all')ps=ps.filter(p=>p.category===category);
  if(risk!=='all')ps=ps.filter(p=>p.risk===risk);
  if(minScore)ps=ps.filter(p=>p.score>=minScore);
  if(maxCpm)ps=ps.filter(p=>p.cpm&&p.cpm<=maxCpm);
  if(minViews)ps=ps.filter(p=>p.likelyViews>=minViews);
  if(maxPrice)ps=ps.filter(p=>p.price<=maxPrice);
  return ps.sort((a,b)=>b.score-a.score||a.cpm-b.cpm);
}
function renderCampaign(){
  setupSelectionFilters();
  const ps=getSelectionFiltered();
  const table=document.querySelector('#selectionTable');if(!table)return;
  table.innerHTML=ps.map(p=>`<tr class="${state.selected.has(p.id)?'selected-row':''}"><td>${publisherCell(p)}</td><td>${scoreCell(p)}</td><td><b>${fmt(p.lowViews)}–${fmt(p.highViews)}</b><br><small>~${fmt(p.likelyViews)}</small></td><td>${p.er.toFixed(1)}%</td><td>${p.cpm?money(p.cpm):'—'}</td><td>${p.price?money(p.price):'—'}</td><td class="risk ${riskClass(p.risk)}">${riskText[p.risk]}</td><td><input class="selection-check" type="checkbox" value="${p.id}" ${state.selected.has(p.id)?'checked':''}></td></tr>`).join('')||'<tr><td colspan="8">По этим критериям паблики не найдены</td></tr>';
  table.querySelectorAll('.selection-check').forEach(i=>i.addEventListener('change',e=>{const id=Number(e.target.value);e.target.checked?state.selected.add(id):state.selected.delete(id);renderCampaign()}));
  document.querySelector('#selectionCount').innerHTML=`<span class="count-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 18V11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 18V7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18 18V4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></span><span>Найдено: <b>${ps.length}</b></span><span class="count-divider">•</span><span>Выбрано: <b>${state.selected.size}</b></span>`;
  updateCampaignForecast();
}
function updateCampaignForecast(){
  const ps=state.publishers.filter(p=>state.selected.has(p.id));
  const budget=ps.reduce((a,p)=>a+(p.price||0),0), views=ps.reduce((a,p)=>a+p.likelyViews,0), engagements=ps.reduce((a,p)=>a+p.likelyViews*p.er/100,0), conf=ps.reduce((a,p)=>a+p.confidence,0)/Math.max(ps.length,1);
  document.querySelector('#campaignViews').textContent=views?fmt(views):'—';
  document.querySelector('#campaignPublishers').textContent=ps.length?fmt(ps.length):'—';
  document.querySelector('#campaignBudget').textContent=budget?money(budget):'—';
  document.querySelector('#campaignCpm').textContent=views&&budget?money(budget/views*1000):'—';
  document.querySelector('#campaignEngagement').textContent=engagements?fmt(engagements):'—';
  document.querySelector('#campaignConfidence').textContent=ps.length?`${Math.round(conf)}%`:'—';
}

const uiScript=document.createElement("script");uiScript.src="./app-ui.js";document.body.appendChild(uiScript);
