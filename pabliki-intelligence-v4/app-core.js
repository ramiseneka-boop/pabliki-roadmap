const STORAGE_KEY = 'pabliki_intelligence_publishers_v4';
const SETTINGS_KEY = 'pabliki_intelligence_economics_v4';

const state = {
  publishers: [],
  selected: new Set(),
  view: 'dashboard',
  checkResults: [],
  economics: { ipn:false, kpn:false, agent:false, counterparty:false, grossUp:true }
};

const fmt = n => Number(n || 0).toLocaleString('ru-RU');
const money = n => `${Math.round(Number(n || 0)).toLocaleString('ru-RU')} ₸`;
const num = v => {
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0;
  if (v == null || v === '') return 0;
  const s = String(v).replace(/\s/g,'').replace(/₸/g,'').replace(/,/g,'.').replace(/[^0-9.\-]/g,'');
  const x = Number(s); return Number.isFinite(x) ? x : 0;
};
const cleanUsername = v => String(v||'').trim().replace(/^@/,'').replace(/^https?:\/\/(www\.)?instagram\.com\//i,'').replace(/[/?#].*$/,'').toLowerCase();
const text = v => String(v ?? '').trim();
const percent = (v, digits=1) => `${Number(v||0).toFixed(digits)}%`;

function saveState(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.publishers));
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.economics));
}
function loadState(){
  try { state.publishers = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') || []; } catch { state.publishers=[]; }
  try { state.economics = {...state.economics, ...(JSON.parse(localStorage.getItem(SETTINGS_KEY)||'{}')||{})}; } catch {}
}

function getFormat(){ return document.querySelector('#selectionFormat')?.value || document.querySelector('#formatFilter')?.value || 'reels'; }
function formatLabel(f){ return f==='post' ? 'Post' : f==='stories' ? 'Stories' : 'Reels'; }
function formatData(p, format=getFormat()){
  const f = p.formats?.[format] || {};
  return { cost:num(f.cost), sale:num(f.sale) };
}
function chargeRate(){
  return (state.economics.ipn ? .10 : 0) + (state.economics.kpn ? .20 : 0) + (state.economics.agent ? .10 : 0) + (state.economics.counterparty ? .08 : 0);
}
function economyFor(p, format=getFormat()){
  const {cost,sale} = formatData(p, format);
  const r = chargeRate();
  let clientPrice = sale, charges = sale*r;
  if(state.economics.grossUp && sale > 0 && r < 1){ clientPrice = sale/(1-r); charges = clientPrice*r; }
  const margin = clientPrice - charges - cost;
  const marginPct = clientPrice > 0 ? margin/clientPrice*100 : 0;
  const views = num(p.avgViews);
  const cpm = views > 0 && clientPrice > 0 ? clientPrice/views*1000 : 0;
  return {cost,sale,clientPrice,charges,margin,marginPct,views,cpm,rate:r};
}
function aggregate(ps, format=getFormat()){
  return ps.reduce((a,p)=>{const e=economyFor(p,format);a.cost+=e.cost;a.sale+=e.sale;a.clientPrice+=e.clientPrice;a.charges+=e.charges;a.margin+=e.margin;a.views+=e.views;return a},{cost:0,sale:0,clientPrice:0,charges:0,margin:0,views:0});
}
function chargeBreakdown(){
  const parts=[];
  if(state.economics.ipn) parts.push('ИПН 10%');
  if(state.economics.kpn) parts.push('КПН 20%');
  if(state.economics.agent) parts.push('Агентская 10%');
  if(state.economics.counterparty) parts.push('Контрагент 8%');
  return parts.length ? parts.join(' + ') : 'Не выбраны';
}
