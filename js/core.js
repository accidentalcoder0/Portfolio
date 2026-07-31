/* ============================================================
   CORE - shared behaviour: load sequence, nav, progress,
   scroll reveal, counters, accent-follow, cursor dot,
   colour-wipe page transitions.
   ============================================================ */
(function(){
'use strict';
var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
var fine = matchMedia('(pointer:fine)').matches;
var root = document.documentElement;
if(!reduce) root.classList.add('smooth');

/* load sequence */
addEventListener('load', function(){ requestAnimationFrame(function(){ document.body.classList.add('loaded'); }); });
setTimeout(function(){ document.body.classList.add('loaded'); }, 1200);

/* nav + progress */
var nav = document.getElementById('nav'), bar = document.getElementById('progress');
function onScroll(){
  var y = scrollY, docH = document.documentElement.scrollHeight - innerHeight;
  if(nav) nav.classList.toggle('stuck', y > 20);
  if(bar) bar.style.width = (docH > 0 ? (y/docH*100) : 0) + '%';
}
addEventListener('scroll', onScroll, {passive:true}); onScroll();

/* scroll reveal (covers .reveal and .proj cards) */
var io = new IntersectionObserver(function(es){
  es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }});
},{threshold:.14, rootMargin:'0px 0px -6% 0px'});
document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });

/* counters */
var cio = new IntersectionObserver(function(es){
  es.forEach(function(e){
    if(!e.isIntersecting) return;
    var el = e.target, target = +el.dataset.count, pre = el.dataset.prefix||'', suf = el.dataset.suffix||'';
    if(reduce || target===0){ el.textContent = pre+target+suf; cio.unobserve(el); return; }
    var t0 = performance.now();
    (function tick(n){
      var p = Math.min((n-t0)/900, 1), eased = 1-Math.pow(1-p,3);
      el.textContent = pre + Math.round(target*eased) + suf;
      if(p<1) requestAnimationFrame(tick);
    })(t0);
    cio.unobserve(el);
  });
},{threshold:.6});
document.querySelectorAll('[data-count]').forEach(function(el){ cio.observe(el); });

/* accent-follow: the live --accent shifts to the project in view */
var aio = new IntersectionObserver(function(es){
  es.forEach(function(e){ if(e.isIntersecting) root.style.setProperty('--accent', e.target.dataset.accent); });
},{threshold:.45});
document.querySelectorAll('[data-accent]').forEach(function(el){ aio.observe(el); });

/* cursor dot (desktop only) */
if(!reduce && fine){
  var d = document.getElementById('dot');
  if(d){
    var tx=0,ty=0,cx=0,cy=0,on=false;
    addEventListener('mousemove', function(e){ tx=e.clientX; ty=e.clientY; if(!on){ on=true; d.style.opacity=.5; }});
    (function loop(){ cx+=(tx-cx)*.18; cy+=(ty-cy)*.18; d.style.transform='translate('+cx+'px,'+cy+'px) translate(-50%,-50%)'; requestAnimationFrame(loop); })();
  }
}

/* colour-wipe page transition */
(function pageTransition(){
  var wipe = document.getElementById('wipe');
  var links = document.querySelectorAll('a[data-transition]');
  if(wipe && !reduce){
    wipe.classList.add('hold');                 /* instantly covering */
    requestAnimationFrame(function(){ wipe.classList.remove('hold'); wipe.classList.add('drop'); });  /* then drop down to reveal */
    setTimeout(function(){ wipe.className='wipe'; }, 1000);
  }
  links.forEach(function(a){
    a.addEventListener('click', function(ev){
      /* flag internal navigation so the home page can skip its intro on return */
      try{ sessionStorage.setItem('internalNav','1'); }catch(e){}
      if(reduce || !wipe) return;
      var href = a.getAttribute('href');
      if(!href || href.charAt(0)==='#') return;
      ev.preventDefault();
      wipe.className='wipe cover';
      setTimeout(function(){ location.href = href; }, 700);
    });
  });
})();

/* intro splash: project names flash by, then settle into the page.
   Plays on a real load/refresh, but skips when arriving back from a project. */
(function intro(){
  var intro = document.getElementById('intro');
  if(!intro) return;
  /* play on a real load/refresh, skip when returning from within the site.
     Uses navigation type + a session flag, which works locally and deployed. */
  var navType = 'navigate';
  try{
    var nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
    if(nav) navType = nav.type;
    else if(performance.navigation) navType = ['navigate','reload','back_forward'][performance.navigation.type] || 'navigate';
  }catch(e){}
  var internal = false;
  try{ internal = sessionStorage.getItem('internalNav')==='1'; sessionStorage.removeItem('internalNav'); }catch(e){}
  var playIntro = !reduce && navType!=='back_forward' && (navType==='reload' || !internal);
  if(!playIntro){ intro.style.display='none'; return; }
  var projects = Array.prototype.slice.call(document.querySelectorAll('.proj'));
  if(!projects.length){ intro.style.display='none'; return; }
  var items = projects.map(function(p){
    var h3 = p.querySelector('h3');
    return { c: p.getAttribute('data-accent'), t: h3 ? h3.textContent : '' };
  });
  document.body.style.overflow = 'hidden';
  var per = 700, i = 0;
  function show(idx){
    var it = items[idx];
    var panel = document.createElement('div');
    panel.className = 'panel';
    panel.style.background = it.c;
    panel.innerHTML = '<h2>'+it.t+'</h2>';
    intro.appendChild(panel);
    panel.style.animation = 'introIn '+per+'ms ease forwards';
    setTimeout(function(){ if(panel.parentNode) panel.parentNode.removeChild(panel); }, per);
  }
  (function step(){
    if(i >= items.length){ finish(); return; }
    show(i++); setTimeout(step, per*0.6);
  })();
  function finish(){
    intro.classList.add('done');
    document.body.style.overflow = '';
    setTimeout(function(){ intro.style.display='none'; }, 520);
  }
  /* hard fallback so nobody is ever stuck on the splash */
  setTimeout(function(){ intro.classList.add('done'); document.body.style.overflow=''; setTimeout(function(){ intro.style.display='none'; }, 520); }, 4500);
})();

/* magnetic buttons */
if(!reduce && fine){
  document.querySelectorAll('.magnet').forEach(function(el){
    el.addEventListener('mousemove', function(ev){
      var r = el.getBoundingClientRect();
      var mx = ev.clientX-(r.left+r.width/2), my = ev.clientY-(r.top+r.height/2);
      el.style.transform = 'translate('+(mx*.25).toFixed(1)+'px,'+(my*.4).toFixed(1)+'px)';
    });
    el.addEventListener('mouseleave', function(){ el.style.transform=''; });
  });
}

})();