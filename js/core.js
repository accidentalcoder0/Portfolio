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
  var wipeTimer;
  /* if we arrived already covered (head script set .wipe-in), drop the bars away */
  if(wipe && !reduce && root.classList.contains('wipe-in')){
    requestAnimationFrame(function(){ root.classList.remove('wipe-in'); wipe.classList.add('drop'); });
    wipeTimer = setTimeout(function(){ wipe.className='wipe'; root.classList.remove('wipe-in'); }, 1000);
  }
  links.forEach(function(a){
    a.addEventListener('click', function(ev){
      if(reduce || !wipe) return;
      var href = a.getAttribute('href');
      if(!href || href.charAt(0)==='#') return;
      ev.preventDefault();
      /* cancel any pending arrival-cleanup so it can't reset the wipe mid-rise */
      clearTimeout(wipeTimer);
      /* colour the bars with the DESTINATION's accent, both leaving and arriving */
      var card = a.closest ? a.closest('.proj') : null;
      var destCol = a.getAttribute('data-accent') || (card && card.getAttribute('data-accent')) || '#FF5A36';
      root.style.setProperty('--wipe-col', destCol);
      /* reset to a clean hidden state, commit it, then animate the rise, so the
         up-animation always plays no matter what the wipe was doing before */
      root.classList.remove('wipe-in');
      wipe.className='wipe';
      void wipe.offsetWidth;
      wipe.className='wipe cover';
      try{ sessionStorage.setItem('internalNav','1'); sessionStorage.setItem('wipeIn','1'); sessionStorage.setItem('wipeCol',destCol); }catch(e){}
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
  /* white line/suit motif per project, in project order (Trickster..Shuttle Up) */
  var SHAPES = [
    '<svg class="shape" viewBox="0 0 100 100"><text class="f" x="50" y="48" text-anchor="middle" font-size="48">♠</text><text class="f" x="26" y="76" text-anchor="middle" font-size="24">♥</text><text class="f" x="74" y="76" text-anchor="middle" font-size="24">♣</text></svg>',
    '<svg class="shape" viewBox="0 0 100 100"><path d="M34 30 H66 L58 60 H42 Z"/><line x1="43" y1="32" x2="46" y2="58"/><line x1="50" y1="31" x2="50" y2="59"/><line x1="57" y1="32" x2="54" y2="58"/><circle class="f" cx="50" cy="68" r="9"/></svg>',
    '<svg class="shape" viewBox="0 0 100 100"><path d="M15 25 H35 V50 M15 75 H35 V50 M35 50 H50 M85 25 H65 V50 M85 75 H65 V50 M65 50 H50"/></svg>',
    '<svg class="shape" viewBox="0 0 100 100"><path d="M50 24 A26 26 0 1 1 26 42"/><path class="f" d="M26 42 l-10 -2 l4 11 Z"/></svg>',
    '<svg class="shape" viewBox="0 0 100 100"><rect x="20" y="18" width="60" height="64" rx="2"/><line x1="20" y1="50" x2="80" y2="50"/><line x1="50" y1="18" x2="50" y2="82"/><circle class="f" cx="35" cy="34" r="4"/><circle class="f" cx="65" cy="34" r="4"/><circle class="f" cx="35" cy="66" r="4"/><circle class="f" cx="65" cy="66" r="4"/></svg>'
  ];
  var items = projects.map(function(p, ix){
    var h3 = p.querySelector('h3');
    return { c: p.getAttribute('data-accent'), t: h3 ? h3.textContent : '', s: SHAPES[ix] || '' };
  });
  document.body.style.overflow = 'hidden';
  intro.style.background = items[0].c;          /* opaque base, so the page never shows through */
  var fade = 520, gap = 560, i = 0;
  function show(idx){
    var it = items[idx];
    var panel = document.createElement('div');
    panel.className = 'panel';
    panel.style.background = it.c;
    panel.innerHTML = it.s + '<h2>'+it.t+'</h2>';
    intro.appendChild(panel);                    /* stacks on top, opaque underneath = no bleed */
    panel.style.animation = 'introIn '+fade+'ms var(--ease) forwards';
    var h2 = panel.querySelector('h2');
    if(h2) h2.style.animation = 'introTitle '+fade+'ms var(--ease) forwards';
  }
  (function step(){
    if(i >= items.length){ finish(); return; }
    show(i++); setTimeout(step, gap);
  })();
  function finish(){
    intro.classList.add('done');
    document.body.style.overflow = '';
    setTimeout(function(){ intro.style.display='none'; }, 520);
  }
  /* hard fallback so nobody is ever stuck on the splash */
  setTimeout(function(){ intro.classList.add('done'); document.body.style.overflow=''; setTimeout(function(){ intro.style.display='none'; }, 520); }, 5000);
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