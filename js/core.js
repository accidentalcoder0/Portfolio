/* ============================================================
   CORE - shared behaviour for every page:
   load sequence, nav, rail, reveal, counters, decode,
   parallax, tilt, magnetic buttons, cursor glow,
   court-wipe page transitions.
   ============================================================ */
(function(){
'use strict';
var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var fine = window.matchMedia('(pointer:fine)').matches;
var html = document.documentElement;

/* smooth scrolling only where motion is allowed */
if(!reduce) html.classList.add('smooth');

/* ---------- LOAD SEQUENCE ---------- */
window.addEventListener('load', function(){
  requestAnimationFrame(function(){ document.body.classList.add('loaded'); });
});
/* fallback so content never stays hidden if load is slow */
setTimeout(function(){ document.body.classList.add('loaded'); }, 1200);

/* ---------- NAV + PROGRESS + RAIL VISIBILITY ---------- */
var nav=document.getElementById('nav'),
    rail=document.getElementById('rail'),
    bar=document.getElementById('progress');
function onScroll(){
  var y=window.scrollY;
  var docH=document.documentElement.scrollHeight-window.innerHeight;
  if(nav) nav.classList.toggle('stuck', y>40);
  if(rail) rail.classList.toggle('show', y>window.innerHeight*0.6);
  if(bar) bar.style.width=(docH>0 ? (y/docH*100) : 0)+'%';
}
window.addEventListener('scroll', onScroll, {passive:true});
onScroll();

/* ---------- REVEAL ---------- */
var io=new IntersectionObserver(function(es){
  es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }});
},{threshold:.14, rootMargin:'0px 0px -8% 0px'});
document.querySelectorAll('.reveal,.rise,.divider').forEach(function(el){ io.observe(el); });

/* ---------- ACTIVE SECTION (nav + rail) ---------- */
var railLinks = rail ? Array.prototype.slice.call(rail.querySelectorAll('a')) : [];
var navLinks  = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
if(railLinks.length || navLinks.length){
  var secIO=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(!e.isIntersecting) return;
      var id='#'+e.target.id;
      railLinks.forEach(function(a){ a.classList.toggle('on', a.getAttribute('href')===id); });
      navLinks.forEach(function(a){ a.classList.toggle('on', a.getAttribute('href')===id); });
    });
  },{threshold:.28});
  ['work','p1','p2','p3','p4','p5','approach','contact'].forEach(function(id){
    var el=document.getElementById(id); if(el) secIO.observe(el);
  });
}

/* ---------- COUNTERS ---------- */
var cIO=new IntersectionObserver(function(es){
  es.forEach(function(e){
    if(!e.isIntersecting) return;
    var el=e.target, target=+el.dataset.count, pre=el.dataset.prefix||'', suf=el.dataset.suffix||'';
    if(reduce || target===0){ el.textContent=pre+target+suf; cIO.unobserve(el); return; }
    var t0=performance.now(), dur=1100;
    (function tick(now){
      var p=Math.min((now-t0)/dur,1), eased=1-Math.pow(1-p,3);
      el.textContent=pre+Math.round(target*eased)+suf;
      if(p<1) requestAnimationFrame(tick);
    })(t0);
    cIO.unobserve(el);
  });
},{threshold:.5});
document.querySelectorAll('[data-count]').forEach(function(el){ cIO.observe(el); });

/* ---------- DECODE HEADINGS ---------- */
(function decode(){
  if(reduce) return;
  var GLYPHS='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>#*';
  function scramble(el){
    var text=el.getAttribute('data-decode') || el.textContent;
    el.textContent='';
    var spans=[];
    for(var i=0;i<text.length;i++){
      var s=document.createElement('span'); s.className='ch';
      s.textContent = text[i]===' ' ? ' ' : GLYPHS[Math.floor(Math.random()*GLYPHS.length)];
      el.appendChild(s); spans.push({el:s, ch:text[i], delay:i*2});
    }
    var frame=0;
    (function run(){
      var done=true;
      spans.forEach(function(o){
        if(o.ch===' '){ o.el.textContent=' '; return; }
        if(frame>=o.delay+6){ o.el.textContent=o.ch; o.el.style.color=''; }
        else if(frame>=o.delay){
          o.el.textContent=GLYPHS[Math.floor(Math.random()*GLYPHS.length)];
          o.el.style.color='var(--volt)'; done=false;
        } else { done=false; }
      });
      frame++;
      if(!done) requestAnimationFrame(run);
    })();
  }
  var dIO=new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ scramble(e.target); dIO.unobserve(e.target); }});
  },{threshold:.6});
  document.querySelectorAll('.decode').forEach(function(el){ dIO.observe(el); });
})();

/* ---------- PARALLAX ---------- */
(function parallax(){
  if(reduce) return;
  var items=Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  if(!items.length) return;
  var ticking=false;
  function update(){
    var vh=window.innerHeight;
    items.forEach(function(el){
      var r=el.getBoundingClientRect();
      var speed=parseFloat(el.dataset.parallax)||0.1;
      var offset=(r.top+r.height/2 - vh/2)*speed*-1;
      el.style.transform='translate3d(0,'+offset.toFixed(1)+'px,0)';
    });
    ticking=false;
  }
  window.addEventListener('scroll', function(){ if(!ticking){ requestAnimationFrame(update); ticking=true; }},{passive:true});
  update();
})();

/* ---------- 3D TILT ---------- */
(function tilt(){
  if(reduce || !fine) return;
  document.querySelectorAll('.tilt').forEach(function(el){
    el.addEventListener('mousemove', function(ev){
      var r=el.getBoundingClientRect();
      var px=(ev.clientX-r.left)/r.width - .5;
      var py=(ev.clientY-r.top)/r.height - .5;
      el.style.transform='perspective(900px) rotateX('+(py*-4).toFixed(2)+'deg) rotateY('+(px*5).toFixed(2)+'deg) translateY(-3px)';
    });
    el.addEventListener('mouseleave', function(){ el.style.transform=''; });
  });
})();

/* ---------- MAGNETIC BUTTONS ---------- */
(function magnetic(){
  if(reduce || !fine) return;
  document.querySelectorAll('.magnet').forEach(function(el){
    el.addEventListener('mousemove', function(ev){
      var r=el.getBoundingClientRect();
      var mx=ev.clientX-(r.left+r.width/2);
      var my=ev.clientY-(r.top+r.height/2);
      el.style.transform='translate('+(mx*.25).toFixed(1)+'px,'+(my*.35).toFixed(1)+'px)';
    });
    el.addEventListener('mouseleave', function(){ el.style.transform=''; });
  });
})();

/* ---------- CURSOR GLOW ---------- */
(function glow(){
  if(reduce || !fine) return;
  var g=document.createElement('div'); g.className='glow'; document.body.appendChild(g);
  var tx=0,ty=0,cx=0,cy=0,active=false;
  window.addEventListener('mousemove', function(e){ tx=e.clientX; ty=e.clientY; if(!active){ active=true; g.classList.add('on'); }});
  (function loop(){
    cx+=(tx-cx)*.12; cy+=(ty-cy)*.12;
    g.style.transform='translate('+cx+'px,'+cy+'px) translate(-50%,-50%)';
    requestAnimationFrame(loop);
  })();
})();

/* ---------- COURT-WIPE PAGE TRANSITION ---------- */
(function pageTransition(){
  var wipe=document.getElementById('wipe');
  if(!wipe) return;
  /* reveal in on entry */
  if(!reduce){
    wipe.classList.add('cover');
    requestAnimationFrame(function(){
      wipe.classList.remove('cover'); wipe.classList.add('reveal');
    });
    setTimeout(function(){ wipe.className='wipe'; }, 900);
  }
  /* intercept internal links flagged for transition */
  document.querySelectorAll('a[data-transition]').forEach(function(a){
    a.addEventListener('click', function(ev){
      if(reduce) return; /* let it navigate normally */
      var href=a.getAttribute('href');
      if(!href || href.charAt(0)==='#') return;
      ev.preventDefault();
      wipe.className='wipe cover';
      setTimeout(function(){ window.location.href=href; }, 560);
    });
  });
})();

})();