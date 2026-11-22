
(function(){
"use strict";
var SKELETON_HEAD='<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1,viewport-fit=cover"><style>:root{color-scheme:light;box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}html{scroll-padding-top:env(safe-area-inset-top,0px)}body{margin:0;padding:0;font:14px -apple-system,BlinkMacSystemFont,sans-serif;background:#fff;color:#000}img{max-width:100%}[hidden]:not([hidden=until-found i]){display:none!important}</style></head><body>\n';
var state={};
try{state=JSON.parse(document.getElementById('state').textContent)||{};}catch(e){state={};}
var app=document.getElementById('app');
var timer=null;

function el(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e;}
function digits(s){return String(s||'').replace(/[^\d]/g,'').replace(/^00/,'');}
var giftSvg='<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#f07e06" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="8" width="18" height="4" rx="1" fill="none"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" fill="none"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5" fill="none"/></svg>';
var waSvg='<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="#fff" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1 2.7.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.6-.3z"/></svg>';

function render(){
  if(timer){clearInterval(timer);timer=null;}
  app.textContent='';
  var wrap=el('div','wrap');
  var brand=el('div','logo');brand.setAttribute('role','img');brand.setAttribute('aria-label',state.storeName||'');
  wrap.appendChild(brand);
  var card=el('article','card');
  if(!state.active){
    var em=el('div','empty');
    em.appendChild(el('h1',null,state.comingTitle||'قريبًا'));
    em.appendChild(el('p','desc',state.comingText||'انتظرونا مع أجمل المفاجآت والمسابقات'));
    card.appendChild(em);
  }else{
    if(state.image){var im=el('img','hero-img');im.src=state.image;im.alt=state.title||'';card.appendChild(im);}
    var inner=el('div','inner');
    if(state.badge)inner.appendChild(el('span','badge',state.badge));
    inner.appendChild(el('h1',null,state.title||''));
    if(state.prize){
      var pz=el('div','prize');pz.innerHTML=giftSvg;var t=el('div');t.appendChild(el('div','lbl','الجائزة'));t.appendChild(el('div','val',state.prize));pz.appendChild(t);inner.appendChild(pz);
    }
    if(state.description)inner.appendChild(el('p','desc',state.description));
    var steps=String(state.steps||'').split('\n').map(function(s){return s.trim();}).filter(Boolean);
    if(steps.length){
      inner.appendChild(el('h2','h2','طريقة المشاركة'));
      var ol=el('ol','steps');steps.forEach(function(s){ol.appendChild(el('li',null,s));});inner.appendChild(ol);
    }
    var end=state.endDate?new Date(state.endDate):null;
    var isEnded=false;
    if(end&&!isNaN(end)){
      var cd=el('div','count');var ends=el('div','ends');
      var fmt;try{fmt=end.toLocaleDateString('ar',{weekday:'long',day:'numeric',month:'long',year:'numeric'});}catch(e){fmt=state.endDate;}
      ends.textContent='تنتهي المسابقة: '+fmt;
      var cells=['يوم','ساعة','دقيقة','ثانية'].map(function(u){var d=el('div');var b=el('b',null,'0');d.appendChild(b);d.appendChild(el('span',null,u));cd.appendChild(d);return b;});
      var tick=function(){var ms=end-new Date();if(ms<=0){cd.replaceWith(el('div','ended','انتهت المسابقة، شكرًا لمشاركتكم'));if(timer)clearInterval(timer);timer=null;return true;}
        var s=Math.floor(ms/1000);var v=[Math.floor(s/86400),Math.floor(s%86400/3600),Math.floor(s%3600/60),s%60];cells.forEach(function(c,i){c.textContent=v[i];});return false;};
      inner.appendChild(cd);inner.appendChild(ends);
      isEnded=tick(); if(!isEnded)timer=setInterval(tick,1000);
    }
    var num=digits(state.whatsapp);
    if(num&&!isEnded){
      var a=el('a','cta');a.href='https://wa.me/'+num+(state.ctaMessage?'?text='+encodeURIComponent(state.ctaMessage):'');a.target='_blank';a.rel='noopener';
      a.innerHTML=waSvg;a.appendChild(el('span',null,state.ctaText||'شارك الآن'));inner.appendChild(a);
      var shown=el('div','ends','أو راسلنا على الرقم: ');var n=el('span');n.dir='ltr';n.textContent='+'+num;shown.appendChild(n);inner.appendChild(shown);
    }
    if(state.terms)inner.appendChild(el('p','terms',state.terms));
    card.appendChild(inner);
  }
  wrap.appendChild(card);
  wrap.appendChild(el('div','foot','شكرًا لاختياركم '+(state.storeName||'')));
  app.appendChild(wrap);
  if(canEdit)addEditButton();
}

/* ---------- owner editor ---------- */
var canEdit=false, artifactApi=null;
function addEditButton(){
  var b=el('button','edit-btn','تعديل المسابقة');b.type='button';b.onclick=openEditor;app.appendChild(b);
}
function field(panel,label,key,type,hint){
  var l=el('label');l.appendChild(document.createTextNode(label));
  if(hint)l.appendChild(el('small',null,hint));
  var i;
  if(type==='textarea'){i=el('textarea');}else{i=el('input');i.type=type||'text';}
  i.id='f-'+key;i.value=state[key]||'';l.appendChild(i);panel.appendChild(l);return i;
}
function shrinkImage(file){
  return new Promise(function(res,rej){
    var r=new FileReader();r.onerror=rej;r.onload=function(){var img=new Image();img.onerror=rej;img.onload=function(){
      var max=1100,w=img.width,h=img.height,k=Math.min(1,max/Math.max(w,h));var c=document.createElement('canvas');c.width=Math.round(w*k);c.height=Math.round(h*k);
      c.getContext('2d').drawImage(img,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',0.8));};img.src=r.result;};r.readAsDataURL(file);
  });
}
function openEditor(){
  var draft=Object.assign({},state);
  var sheet=el('div','sheet');var p=el('div','panel');sheet.appendChild(p);
  p.appendChild(el('h2',null,'تعديل المسابقة'));
  p.appendChild(el('small',null,'هذه الشاشة تظهر لك أنت فقط. الزبائن يشوفون الصفحة فقط. الباركود ما بيتغير.'));
  var act=el('label','toggle');var cb=el('input');cb.type='checkbox';cb.id='f-active';cb.checked=!!state.active;act.appendChild(cb);act.appendChild(document.createTextNode('في مسابقة شغّالة الآن'));p.appendChild(act);
  var f={};
  f.title=field(p,'عنوان المسابقة','title');
  f.badge=field(p,'شارة صغيرة فوق العنوان','badge','text','مثال: مسابقة رمضان');
  f.prize=field(p,'الجائزة','prize');
  f.description=field(p,'وصف قصير','description','textarea');
  f.steps=field(p,'طريقة المشاركة','steps','textarea','كل خطوة في سطر');
  f.endDate=field(p,'تاريخ ووقت الانتهاء','endDate','datetime-local','اتركه فاضي إذا ما في موعد');
  f.whatsapp=field(p,'رقم واتساب لاستقبال المشاركات','whatsapp','tel','مع رمز الدولة، مثال: 9665xxxxxxxx');
  f.ctaText=field(p,'نص زر المشاركة','ctaText');
  f.ctaMessage=field(p,'الرسالة الجاهزة اللي توصلك','ctaMessage');
  f.terms=field(p,'الشروط','terms','textarea');
  f.storeName=field(p,'اسم المحل','storeName');
  var il=el('label');il.appendChild(document.createTextNode('صورة الجائزة'));var row=el('div','row');
  var th=el('img','thumb');th.alt='';th.hidden=!draft.image;if(draft.image)th.src=draft.image;
  var fi=el('input');fi.type='file';fi.accept='image/*';fi.id='f-image';
  var rm=el('button','btn ghost small','إزالة الصورة');rm.type='button';rm.hidden=!draft.image;
  rm.onclick=function(){draft.image='';th.hidden=true;rm.hidden=true;fi.value='';};
  fi.onchange=function(){var file=fi.files&&fi.files[0];if(!file)return;shrinkImage(file).then(function(d){draft.image=d;th.src=d;th.hidden=false;rm.hidden=false;}).catch(function(){st.className='status err';st.textContent='ما قدرنا نقرأ الصورة، جرّب صورة ثانية.';});};
  row.appendChild(th);row.appendChild(fi);row.appendChild(rm);il.appendChild(row);p.appendChild(il);
  var st=el('div','status');
  var btns=el('div','row');var save=el('button','btn primary','حفظ ونشر');save.type='button';var cancel=el('button','btn ghost','إلغاء');cancel.type='button';
  btns.appendChild(save);btns.appendChild(cancel);p.appendChild(btns);p.appendChild(st);
  cancel.onclick=function(){sheet.remove();};
  save.onclick=function(){
    Object.keys(f).forEach(function(k){draft[k]=f[k].value.trim();});draft.active=cb.checked;
    save.disabled=true;st.className='status';st.textContent='جاري النشر...';
    if(!artifactApi){st.className='status err';st.textContent='الحفظ غير متاح من هنا. افتح الصفحة من حسابك على claude.ai.';save.disabled=false;return;}
    artifactApi.publish(buildDoc(draft)).then(function(){st.className='status ok';st.textContent='تم النشر. الزبائن يشوفون المسابقة الجديدة الآن.';})
    .catch(function(e){save.disabled=false;var c=e&&e.code;
      st.className='status err';
      st.textContent=c==='conflict'?'في نسخة أحدث، الصفحة بتتحدث الآن. افتح التعديل مرة ثانية.':(c==='not_writer'||c==='not_granted')?'ما عندك صلاحية تعديل هذه الصفحة.':c==='too_large'?'الصورة كبيرة جدًا، جرّب صورة أصغر.':'صار خطأ أثناء النشر، جرّب مرة ثانية.';});
  };
  app.appendChild(sheet);
}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function buildDoc(s){
  var json=JSON.stringify(s).replace(/</g,'\\u003c');
  var t='مسابقة '+(s.storeName||'');
  return SKELETON_HEAD+'<title>'+esc(t)+'</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n'+
    '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Reem+Kufi:wght@500;700&amp;family=Tajawal:wght@400;500;700&amp;display=swap">\n'+
    '<style id="css">'+document.getElementById('css').textContent+'</style>\n<div id="app"></div>\n'+
    '<script type="application/json" id="state">'+json+'<\/script>\n<script id="main">'+document.getElementById('main').textContent+'<\/script></body></html>';
}

render();
function hook(){
  if(!(window.claude&&window.claude.use))return false;
  Promise.all([window.claude.use('user'),window.claude.use('artifact')]).then(function(r){
    var user=r[0];artifactApi=r[1];
    if(!user||!artifactApi)return;
    return user.canEdit().then(function(ok){if(ok){canEdit=true;render();}});
  }).catch(function(){});
  return true;
}

})();
