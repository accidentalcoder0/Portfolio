/* ============================================================
   PAGE-PROJECT - renders project.html from window.PROJECTS.
   Runs before demos.js so the injected demo DOM exists.
   ============================================================ */
(function(){
'use strict';
function qs(name){ var m=new RegExp('[?&]'+name+'=([^&]+)').exec(location.search); return m?decodeURIComponent(m[1]):null; }
var P = window.PROJECTS || {order:[]};
var slug = qs('p'); if(!slug || !P[slug]) slug = P.order[0];
var d = P[slug];

document.title = d.title + ' · Shil';
if(d.pa) document.documentElement.style.setProperty('--accent', d.pa);

var idx = P.order.indexOf(slug);
var next = P.order[(idx+1) % P.order.length], nd = P[next];

var meta = d.meta.map(function(m){ return '<span>'+m[0]+' <b>'+m[1]+'</b></span>'; }).join('');
var sections = d.sections.map(function(s){ return '<h4>'+s.h+'</h4><p>'+s.p+'</p>'; }).join('');
var tags = d.tags.map(function(t){ return '<span class="tg">'+t+'</span>'; }).join('');

var linkHtml;
if(d.link){
  var domain = d.link.replace(/^https?:\/\//,'').replace(/\/$/,'');
  var label = d.linkLabel || ('Visit '+domain+' ↗');
  linkHtml = '<p style="margin-top:26px"><a class="link-accent" href="'+d.link+'" target="_blank" rel="noopener">'+label+'</a></p>';
} else {
  linkHtml = '<p class="mono-note" style="margin-top:26px">Source kept private. The demo on the right runs the real logic.</p>';
}

var html =
  '<article class="detail-hero"><div class="wrap">'+
    '<a class="back-link" href="index.html#work" data-transition><span>←</span> All work</a>'+
    '<div class="kicker" style="margin-top:22px">'+d.num+' <span style="opacity:.55">·</span> '+d.role+'</div>'+
    '<h1>'+d.title+'</h1>'+
    '<p class="sub">'+d.tagline+'</p>'+
    '<div class="detail-meta">'+meta+'</div>'+
  '</div></article>'+

  '<section class="wrap"><div class="detail-grid">'+
    '<div class="detail-copy">'+
      '<p class="lead" style="margin-bottom:8px">'+d.intro+'</p>'+
      sections+
      '<div class="callout"><em>Note.</em> '+d.callout+'</div>'+
      '<div class="tags">'+tags+'</div>'+
      linkHtml+
    '</div>'+
    '<div class="detail-sticky"><div class="proj-demo-wrap" style="border:1.5px solid var(--hair);border-radius:18px">'+ window.buildDemo(d.demo) +'</div></div>'+
  '</div></section>'+

  '<div class="wrap"><div class="next-proj">'+
    '<span class="mono-note">Next project</span>'+
    '<a href="project.html?p='+next+'" data-transition data-accent="'+nd.pa+'" style="color:'+nd.pa+'">'+nd.title+' <span>→</span></a>'+
  '</div></div>';

document.getElementById('app').innerHTML = html;
})();