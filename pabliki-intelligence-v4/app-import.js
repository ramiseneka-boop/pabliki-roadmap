function normalizeHeader(h){return String(h||'').toLowerCase().replace(/ё/g,'е').replace(/₸/g,' ').replace(/\bтг\b/g,' ').replace(/[.,:;()]/g,' ').replace(/[_\-]+/g,' ').replace(/\s+/g,' ').trim()}
const headerAliases={
  username:['instagram / username','instagram username','username','instagram','паблик','аккаунт','ссылка instagram','инстаграм'],
  region:['регион','область'],city:['город','населенный пункт','нп'],category:['тематика','категория','тема'],language:['язык'],followers:['подписчики','количество подписчиков','followers'],note:['примечание','комментарий'],
  reelsCost:['себестоимость reels','reels себестоимость','себестоимость рилс'],reelsSale:['цена продажи reels','reels цена продажи','продажа reels','цена reels'],
  postCost:['себестоимость post','post себестоимость','себестоимость пост'],postSale:['цена продажи post','post цена продажи','продажа post','цена post','цена пост'],
  storiesCost:['себестоимость stories','stories себестоимость','себестоимость сторис'],storiesSale:['цена продажи stories','stories цена продажи','продажа stories','цена stories','цена сторис'],
  avgViews:['средние просмотры reels','средние просмотры','просмотры reels','просмотры'],avgLikes:['средние лайки','лайки'],avgComments:['средние комментарии','комментарии']
};
function headerIndex(headers,key){const aliases=headerAliases[key].map(normalizeHeader);return headers.findIndex(h=>aliases.includes(normalizeHeader(h)))}
function rowVal(row,headers,key){const i=headerIndex(headers,key);return i>=0?row[i]:''}
function recordsFromRows(rows){
  if(!rows.length)return {items:[],error:'Файл пустой'}; const headers=rows[0]; if(headerIndex(headers,'username')<0)return {items:[],error:'Не найден обязательный столбец «Instagram / username»'};
  const items=[];
  for(let r=1;r<rows.length;r++){
    const row=rows[r]; const username=cleanUsername(rowVal(row,headers,'username')); if(!username)continue;
    const followers=num(rowVal(row,headers,'followers')), avgViews=num(rowVal(row,headers,'avgViews')), avgLikes=num(rowVal(row,headers,'avgLikes')), avgComments=num(rowVal(row,headers,'avgComments'));
    const er=followers>0?(avgLikes+avgComments)/followers*100:0;
    items.push({username,region:text(rowVal(row,headers,'region')),city:text(rowVal(row,headers,'city')),category:text(rowVal(row,headers,'category')),language:text(rowVal(row,headers,'language')),followers,avgViews,avgLikes,avgComments,er,note:text(rowVal(row,headers,'note')),formats:{reels:{cost:num(rowVal(row,headers,'reelsCost')),sale:num(rowVal(row,headers,'reelsSale'))},post:{cost:num(rowVal(row,headers,'postCost')),sale:num(rowVal(row,headers,'postSale'))},stories:{cost:num(rowVal(row,headers,'storiesCost')),sale:num(rowVal(row,headers,'storiesSale'))}},riskLabel:'Нет данных'});
  }
  return {items,error:''};
}
function upsertPublishers(items){
  let added=0,updated=0; const by=new Map(state.publishers.map(p=>[p.username,p]));
  items.forEach(x=>{const old=by.get(x.username);if(old){Object.assign(old,x);updated++}else{const p={...x,id:Date.now()+Math.floor(Math.random()*1e9)};state.publishers.push(p);by.set(x.username,p);added++}});
  saveState(); return {added,updated};
}
async function importFile(file){
  const status=document.querySelector('#importStatus'); status.textContent='Читаю файл…';
  try{
    const ext=(file.name.split('.').pop()||'').toLowerCase(); let rows=[];
    if(ext==='csv'){
      const s=await file.text(); const sep=(s.split(/\r?\n/)[0]||'').includes(';')?';':','; rows=s.split(/\r?\n/).filter(x=>x.trim()).map(line=>parseDelimitedLine(line,sep));
    }else{
      if(typeof XLSX==='undefined')throw new Error('Модуль Excel не загрузился. Проверьте интернет и повторите.');
      const buf=await file.arrayBuffer(), wb=XLSX.read(buf,{type:'array'}), ws=wb.Sheets[wb.SheetNames[0]]; rows=XLSX.utils.sheet_to_json(ws,{header:1,defval:'',raw:true});
    }
    const {items,error}=recordsFromRows(rows); if(error)throw new Error(error); if(!items.length)throw new Error('В файле нет строк с Instagram / username.');
    const r=upsertPublishers(items); status.textContent=`Готово: добавлено ${r.added}, обновлено ${r.updated}. Всего в базе: ${state.publishers.length}.`; status.style.color='#128155'; renderAll(); switchView('publishers');
  }catch(err){status.textContent=`Ошибка импорта: ${err.message}`;status.style.color='#b73f3f'}
}
function parseDelimitedLine(line,sep){let out=[],cur='',q=false;for(let i=0;i<line.length;i++){const c=line[i];if(c==='"'){if(q&&line[i+1]==='"'){cur+='"';i++}else q=!q}else if(c===sep&&!q){out.push(cur);cur=''}else cur+=c}out.push(cur);return out}
function downloadTemplate(){
  const headers=['Instagram / username','Регион','Город','Тематика','Язык','Подписчики','Себестоимость Reels, ₸','Цена продажи Reels, ₸','Себестоимость Post, ₸','Цена продажи Post, ₸','Себестоимость Stories, ₸','Цена продажи Stories, ₸','Средние просмотры Reels','Средние лайки','Средние комментарии','Примечание'];
  const sample=['almaty.example','Алматинская область','Алматы','Новости','Русский',150000,40000,65000,35000,55000,20000,35000,28000,1200,85,'пример — удалить перед загрузкой'];
  if(typeof XLSX==='undefined'){alert('Модуль Excel не загрузился.');return}
  const ws=XLSX.utils.aoa_to_sheet([headers,sample]); ws['!cols']=headers.map((h,i)=>({wch:Math.max(14,Math.min(28,h.length+3))})); const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Паблики');XLSX.writeFile(wb,'Шаблон_импорта_Pabliki_Intelligence.xlsx');
}
