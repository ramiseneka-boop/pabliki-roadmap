loadState();
document.addEventListener('DOMContentLoaded',()=>{
  syncEconomicsControls();
  document.querySelectorAll('.nav-item').forEach(b=>b.onclick=()=>switchView(b.dataset.view));document.querySelectorAll('[data-jump]').forEach(b=>b.onclick=()=>switchView(b.dataset.jump));
  document.querySelector('#importBtn').onclick=()=>switchView('imports');document.querySelector('#recalcBtn').onclick=()=>renderAll();
  ['searchInput','cityFilter','formatFilter','sortSelect'].forEach(id=>document.querySelector('#'+id)?.addEventListener(id==='searchInput'?'input':'change',()=>{renderPublishers();renderDashboard()}));
  ['selectionSearch','selectionMaxCpm','selectionMinViews','selectionMaxPrice','selectionMinMargin'].forEach(id=>document.querySelector('#'+id)?.addEventListener('input',renderCampaign));
  ['selectionCity','selectionCategory','selectionFormat'].forEach(id=>document.querySelector('#'+id)?.addEventListener('change',()=>{if(id==='selectionFormat')document.querySelector('#formatFilter').value=document.querySelector('#selectionFormat').value;renderCampaign();renderPublishers();renderDashboard()}));
  document.querySelector('#selectFilteredBtn').onclick=()=>{getSelectionFiltered().forEach(p=>state.selected.add(p.id));renderCampaign();renderDashboard()};document.querySelector('#clearSelectionBtn').onclick=()=>{state.selected.clear();renderCampaign();renderDashboard()};
  [['ipnToggle','ipn'],['kpnToggle','kpn'],['agentToggle','agent'],['counterpartyToggle','counterparty'],['grossUpToggle','grossUp']].forEach(([id,key])=>document.querySelector('#'+id).onchange=e=>setEconomics(key,e.target.checked));
  document.querySelector('#downloadPdfBtn').onclick=exportSelectionPdf;document.querySelector('#fileInput').onchange=e=>{const f=e.target.files?.[0];if(f)importFile(f);e.target.value=''};document.querySelector('#downloadTemplateBtn').onclick=downloadTemplate;
  document.querySelector('#clearBaseBtn').onclick=()=>{if(confirm('Очистить всю загруженную локальную базу в этом браузере?')){state.publishers=[];state.selected.clear();saveState();renderAll()}};
  document.querySelector('#runAuditBtn').onclick=runAudit;document.querySelector('#clearAuditBtn').onclick=()=>{document.querySelector('#auditInput').value='';state.checkResults=[];renderAuditResults();document.querySelector('#auditStatus').textContent='Введите один или несколько аккаунтов'};
  document.querySelector('#closeDrawer').onclick=closeDrawer;document.querySelector('#drawerBackdrop').onclick=closeDrawer;
  renderAll();
});