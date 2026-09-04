function selectedMetrics(){return [...document.querySelectorAll('#metricChecks input:checked')].map(x=>x.value)}
function metricMap(format){return {
  city:{title:'Город',value:p=>p.city||'—'},followers:{title:'Подписчики',value:p=>p.followers?fmt(p.followers):'—'},views:{title:'Прогноз просмотров',value:p=>p.avgViews?fmt(p.avgViews):'—'},er:{title:'ER',value:p=>p.er?percent(p.er):'—'},cpm:{title:'CPM',value:p=>{const e=economyFor(p,format);return e.cpm?money(e.cpm):'—'}},cost:{title:'Себестоимость',value:p=>money(economyFor(p,format).cost)},baseSale:{title:'Цена продажи',value:p=>money(economyFor(p,format).sale)},clientPrice:{title:'Цена клиенту',value:p=>money(economyFor(p,format).clientPrice)},charges:{title:'Налоги/комиссии',value:p=>money(economyFor(p,format).charges)},margin:{title:'Чистая маржа',value:p=>money(economyFor(p,format).margin)},marginPct:{title:'Маржинальность',value:p=>percent(economyFor(p,format).marginPct)},risk:{title:'Authenticity Risk',value:p=>p.riskLabel||'Нет данных'}
}}
function exportSelectionPdf(){
  const ps=state.publishers.filter(p=>state.selected.has(p.id)), status=document.querySelector('#pdfStatus'); if(!ps.length){status.textContent='Сначала выберите хотя бы один паблик.';return}
  const metrics=selectedMetrics(); if(!metrics.length){status.textContent='Выберите хотя бы один столбец.';return}
  const format=document.querySelector('#selectionFormat').value, map=metricMap(format), title=document.querySelector('#selectionName').value.trim()||'Подборка пабликов', client=document.querySelector('#clientName').value.trim(), a=aggregate(ps,format), mp=a.clientPrice?a.margin/a.clientPrice*100:0;
  if(typeof pdfMake==='undefined'){status.textContent='PDF-модуль не загрузился. Проверьте интернет-соединение.';return}
  const body=[['Паблик',...metrics.map(k=>map[k].title)],...ps.map(p=>[`@${p.username}`,...metrics.map(k=>map[k].value(p))])];
  const doc={pageSize:'A4',pageOrientation:'landscape',pageMargins:[24,26,24,26],content:[
    {text:'Pabliki Intelligence',fontSize:10,bold:true,color:'#16875d'},
    {text:title,fontSize:20,bold:true,margin:[0,4,0,4]},
    {text:`${client?`Клиент: ${client} · `:''}${formatLabel(format)} · ${new Date().toLocaleDateString('ru-RU')}`,fontSize:9,color:'#70807c',margin:[0,0,0,12]},
    {text:`Итоговая цена клиенту: ${money(a.clientPrice)}   |   Себестоимость: ${money(a.cost)}   |   Расходы: ${money(a.charges)}   |   Чистая маржа: ${money(a.margin)} (${percent(mp)})`,fontSize:9,bold:true,margin:[0,0,0,12]},
    {text:`Учитывается: ${chargeBreakdown()}. Режим: ${state.economics.grossUp?'расходы добавляются сверху':'расходы вычитаются из цены продажи'}.`,fontSize:8,color:'#70807c',margin:[0,0,0,12]},
    {table:{headerRows:1,widths:Array(body[0].length).fill('*'),body},layout:'lightHorizontalLines',fontSize:7},
    {text:'Управленческий расчёт. Налоговую базу и обязательства для бухгалтерского и налогового учёта необходимо подтверждать у бухгалтера.',fontSize:7,color:'#70807c',margin:[0,12,0,0]}
  ],defaultStyle:{font:'Roboto'}};
  const safe=title.replace(/[^a-zA-Zа-яА-Я0-9_-]+/g,'_').slice(0,60)||'pabliki_selection';pdfMake.createPdf(doc).download(`${safe}.pdf`); status.textContent='PDF сформирован.';
}
