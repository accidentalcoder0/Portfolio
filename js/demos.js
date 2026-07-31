/* ============================================================
   DEMOS - five self-contained modules.
   Each checks for its root element and no-ops if absent,
   so the same file runs on the home page and on any detail
   page that embeds one demo.
   ============================================================ */
(function(){
'use strict';
var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- 1. GZD live-site embed ----------
   Poster-first: a screenshot shows immediately; the live iframe is lazy
   loaded once the card scrolls into view and fades in over the poster on
   success. Cross-origin pages can't be reliably probed for failure, so a
   timeout keeps the poster and reveals a fallback link if the site does not
   load (down, slow, or blocked from framing). */
(function gzdEmbed(){
  var root=document.getElementById('gzdEmbed');
  if(!root) return;
  var frame=root.querySelector('iframe');
  if(!frame) return;
  var view=frame.parentNode;                     /* .sf-view */
  var BASE=1280;                                 /* the logical desktop width the site is rendered at */
  function scale(){ if(view){ var s=view.clientWidth/BASE; frame.style.transform='scale('+s+')'; } }
  scale();
  window.addEventListener('resize', scale, {passive:true});
  var started=false, loaded=false;
  function start(){
    scale();
    if(started) return; started=true;
    var timer=setTimeout(function(){ if(!loaded) root.classList.add('failed'); }, 8000);
    frame.addEventListener('load', function(){
      loaded=true; clearTimeout(timer); root.classList.remove('failed'); frame.classList.add('ready');
    });
    frame.src=frame.getAttribute('data-src');
  }
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ start(); io.unobserve(e.target); }});
  },{threshold:.2});
  io.observe(root);
})();

/* ---------- 2. ShuttleScore bracket ---------- */
(function bracket(){
  var svg=document.getElementById('bracket');
  if(!svg) return;
  var status=document.getElementById('bkStatus'), replay=document.getElementById('bkReplay');
  var NS='http://www.w3.org/2000/svg';

  var R1=[['A. Mehta','R. Okonkwo'],['J. Lindqvist','P. Silva'],['D. Achterberg','H. Nakamura'],['S. Farooqi','L. Bruhn']];
  var W1=[0,1,0,1], S1=[['21-17','21-14'],['19-21','21-18','21-16'],['21-9','21-12'],['21-19','22-20']];
  var W2=[1,0], S2=[['21-15','18-21','21-13'],['21-16','21-19']];
  var WF=0, SF=['21-18','19-21','21-17'];

  var COLS=[8,264,520], BW=200, RH=30;
  var Y1=[18,118,224,324], Y2=[68,274], YF=[171];

  function box(x,y,names,winner,scores,cls){
    var g=document.createElementNS(NS,'g'); g.setAttribute('class','bk-slot '+(cls||''));
    var r=document.createElementNS(NS,'rect');
    r.setAttribute('x',x); r.setAttribute('y',y); r.setAttribute('width',BW);
    r.setAttribute('height',RH*2); r.setAttribute('rx',4); r.setAttribute('class','bk-box');
    g.appendChild(r);
    var mid=document.createElementNS(NS,'line');
    mid.setAttribute('x1',x); mid.setAttribute('x2',x+BW);
    mid.setAttribute('y1',y+RH); mid.setAttribute('y2',y+RH);
    mid.setAttribute('class','bk-link'); g.appendChild(mid);
    names.forEach(function(nm,i){
      var t=document.createElementNS(NS,'text');
      t.setAttribute('x',x+11); t.setAttribute('y',y+RH*i+19);
      t.setAttribute('class','bk-name '+(winner===i?'win':'lose'));
      t.textContent=nm; g.appendChild(t);
      if(scores){
        var s=document.createElementNS(NS,'text');
        s.setAttribute('x',x+BW-11); s.setAttribute('y',y+RH*i+19);
        s.setAttribute('class','bk-score '+(winner===i?'win':''));
        s.textContent = scores.map(function(sc){ return i===winner ? sc.split('-')[0] : sc.split('-')[1]; }).join('  ');
        g.appendChild(s);
      }
    });
    svg.appendChild(g); return g;
  }
  function link(x1,y1,x2,y2){
    var p=document.createElementNS(NS,'path');
    var mx=(x1+x2)/2;
    p.setAttribute('d','M'+x1+' '+y1+' H'+mx+' V'+y2+' H'+x2);
    p.setAttribute('class','bk-link');
    var len=Math.abs(mx-x1)+Math.abs(y2-y1)+Math.abs(x2-mx);
    p.style.strokeDasharray=len; p.style.strokeDashoffset=reduce?0:len;
    p.style.transition='stroke-dashoffset .7s cubic-bezier(.22,1,.36,1)';
    svg.appendChild(p); return p;
  }

  var timers=[];
  function run(){
    timers.forEach(clearTimeout); timers=[]; svg.innerHTML='';
    var g1=R1.map(function(pair,i){ return box(COLS[0],Y1[i],pair,W1[i],S1[i]); });
    var links=[];
    [0,1].forEach(function(k){
      links.push(link(COLS[0]+BW, Y1[k*2]+RH, COLS[1], Y2[k]+RH));
      links.push(link(COLS[0]+BW, Y1[k*2+1]+RH, COLS[1], Y2[k]+RH));
    });
    var sfNames=[[R1[0][W1[0]],R1[1][W1[1]]],[R1[2][W1[2]],R1[3][W1[3]]]];
    var g2=[0,1].map(function(i){ return box(COLS[1],Y2[i],sfNames[i],W2[i],S2[i]); });
    links.push(link(COLS[1]+BW, Y2[0]+RH, COLS[2], YF[0]+RH));
    links.push(link(COLS[1]+BW, Y2[1]+RH, COLS[2], YF[0]+RH));
    var fNames=[sfNames[0][W2[0]], sfNames[1][W2[1]]];
    var gF=box(COLS[2],YF[0],fNames,WF,SF);

    var champG=document.createElementNS(NS,'g'); champG.setAttribute('class','bk-slot bk-champ');
    var cr=document.createElementNS(NS,'rect');
    cr.setAttribute('x',COLS[2]); cr.setAttribute('y',YF[0]+80); cr.setAttribute('width',BW);
    cr.setAttribute('height',32); cr.setAttribute('rx',4); champG.appendChild(cr);
    var ct=document.createElementNS(NS,'text');
    ct.setAttribute('x',COLS[2]+12); ct.setAttribute('y',YF[0]+101);
    ct.textContent='◆ '+fNames[WF]; champG.appendChild(ct);
    svg.appendChild(champG);

    var seq=[
      {d:0,   f:function(){ g1.forEach(function(g){ g.classList.add('in'); }); status.textContent='Quarter-finals drawn'; }},
      {d:700, f:function(){ links.slice(0,4).forEach(function(p){ p.style.strokeDashoffset=0; }); }},
      {d:1300,f:function(){ g2.forEach(function(g){ g.classList.add('in'); }); status.textContent='Winners advanced automatically'; }},
      {d:2000,f:function(){ links.slice(4).forEach(function(p){ p.style.strokeDashoffset=0; }); }},
      {d:2600,f:function(){ gF.classList.add('in'); status.textContent='Final'; }},
      {d:3400,f:function(){ champG.classList.add('in'); status.textContent='Champion, bracket complete'; }}
    ];
    seq.forEach(function(s){ timers.push(setTimeout(s.f, reduce?0:s.d)); });
  }
  if(replay) replay.addEventListener('click', run);
  var bIO=new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ run(); bIO.unobserve(e.target); }});
  },{threshold:.3});
  bIO.observe(svg);
})();

/* ---------- 3. ChoreSync rotation ---------- */
(function rotation(){
  var grid=document.getElementById('rotGrid');
  if(!grid) return;
  var slider=document.getElementById('wkSlider'), label=document.getElementById('wkLabel');
  var carryBtn=document.getElementById('rotCarry');
  var people=['Alex','Sam','Jo'];
  var zones=[{n:'Hoover & living areas',m:37},{n:'Upstairs washroom',m:37},{n:'Kitchen',m:38}];
  var carryWeek=null, carryPerson=1;

  function render(){
    var wk=+slider.value;
    label.textContent='Week '+(wk+1);
    grid.innerHTML='';
    people.forEach(function(name,i){
      var z=zones[(i+wk)%3];
      var xp=0, j;
      for(j=0;j<=wk;j++){
        var mins=zones[(i+j)%3].m;
        if(carryWeek!==null && i===carryPerson && j===carryWeek) xp += Math.round(mins/2);
        else xp += mins;
      }
      var missed = (carryWeek!==null && i===carryPerson && wk>=carryWeek);
      var lvl=Math.floor(xp/100)+1, into=xp%100;
      var d=document.createElement('div');
      d.className='person'+(missed && wk===carryWeek ? ' carry':'');
      d.innerHTML=
        '<div class="who">'+
          '<svg class="ring" viewBox="0 0 36 36" aria-hidden="true">'+
            '<circle class="bg" cx="18" cy="18" r="15"></circle>'+
            '<circle class="fg" cx="18" cy="18" r="15" stroke-dasharray="94.2" stroke-dashoffset="'+(94.2-94.2*into/100).toFixed(1)+'"></circle>'+
          '</svg>'+ name +
        '</div>'+
        '<div class="zone">'+z.n+'<br><span class="zone-min">'+z.m+' min</span></div>'+
        '<div class="xp"><span>LVL '+lvl+' · '+xp+' XP</span>'+
        (missed ? '<span class="flag">carry-over</span>' : '<span>on track</span>')+'</div>';
      grid.appendChild(d);
    });
  }
  slider.addEventListener('input', render);
  carryBtn.addEventListener('click', function(){
    if(carryWeek===null){ carryWeek=+slider.value; carryBtn.textContent='Clear missed week'; }
    else { carryWeek=null; carryBtn.textContent='Simulate a missed week'; }
    render();
  });
  render();
})();

/* ---------- 4. Shuttle Up! fairness fill + manual swap ---------- */
(function shuttleUp(){
  var teamsEl=document.getElementById('courtTeams');
  if(!teamsEl) return;
  var queueEl=document.getElementById('queueList');
  var fillBtn=document.getElementById('suFill'), doneBtn=document.getElementById('suDone');
  var statusEl=document.getElementById('suStatus');
  var players=[
    {n:'Priya',g:3},{n:'Marcus',g:1},{n:'Wei',g:2},{n:'Tomas',g:4},
    {n:'Amara',g:1},{n:'Ben',g:3},{n:'Ines',g:2},{n:'Kofi',g:0}
  ];
  var onCourt=[];   // slots 0,1 = Team A ; 2,3 = Team B
  var sel=null;     // null | {loc:'court',slot} | {loc:'bench',p}

  function nextFour(){ return players.slice().sort(function(a,b){ return a.g-b.g; }).slice(0,4); }
  function same(a,b){ return a&&b&&a.loc===b.loc && (a.loc==='court'? a.slot===b.slot : a.p===b.p); }
  function status(t){ statusEl.textContent=t; }

  function swap(a,b){
    if(a.loc==='court' && b.loc==='court'){
      var t=onCourt[a.slot]; onCourt[a.slot]=onCourt[b.slot]; onCourt[b.slot]=t;
      status('Swapped the two on court, teams repartnered');
    } else {
      var courtSel=a.loc==='court'?a:b, benchSel=a.loc==='bench'?a:b;
      onCourt[courtSel.slot]=benchSel.p;   // the player they replaced drops to the queue automatically
      status('Subbed '+benchSel.p.n+' onto court');
    }
  }
  function pick(next){
    if(!onCourt.length) return;                       // swapping only once the court is filled
    if(!sel){ sel=next; render(); return; }
    if(same(sel,next)){ sel=null; render(); return; } // tap the same player again to deselect
    if(sel.loc==='bench' && next.loc==='bench'){ sel=next; render(); return; }
    swap(sel,next); sel=null; render();
  }

  function render(){
    var preview = onCourt.length ? [] : nextFour();
    teamsEl.innerHTML='';
    [0,1].forEach(function(t){
      var d=document.createElement('div'); d.className='team';
      var e=document.createElement('em'); e.textContent = t===0 ? 'Team A' : 'Team B';
      d.appendChild(e);
      for(var k=0;k<2;k++){
        var slot=t*2+k, p=onCourt[slot];
        var c=document.createElement('div');
        if(p){
          c.className='chip'+(sel&&sel.loc==='court'&&sel.slot===slot?' sel':'');
          c.style.animationDelay=(slot*70)+'ms';
          c.innerHTML='<span>'+p.n+'</span><u>'+p.g+' played</u>';
          (function(s){ c.addEventListener('click', function(){ pick({loc:'court',slot:s}); }); })(slot);
        } else { c.className='chip empty'; c.textContent='open'; }
        d.appendChild(c);
      }
      teamsEl.appendChild(d);
    });
    queueEl.innerHTML='';
    players.filter(function(p){ return onCourt.indexOf(p)<0; })
      .sort(function(a,b){ return a.g-b.g || a.n.localeCompare(b.n); })
      .forEach(function(p){
        var s=document.createElement('span');
        var isSel = sel&&sel.loc==='bench'&&sel.p===p;
        s.className='qchip'+(preview.indexOf(p)>=0?' next':'')+(isSel?' sel':'');
        s.innerHTML=p.n+'<u>'+p.g+'</u>';
        if(onCourt.length){ (function(pp){ s.addEventListener('click', function(){ pick({loc:'bench',p:pp}); }); })(p); }
        queueEl.appendChild(s);
      });
  }

  fillBtn.addEventListener('click', function(){
    var four=nextFour();
    for(var i=four.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=four[i]; four[i]=four[j]; four[j]=t; }
    onCourt=four; sel=null;
    fillBtn.disabled=true; doneBtn.disabled=false;
    status('Fewest games play. Tap a player, then tap another to swap them.');
    render();
  });
  doneBtn.addEventListener('click', function(){
    onCourt.forEach(function(p){ p.g++; });
    onCourt=[]; sel=null;
    fillBtn.disabled=false; doneBtn.disabled=true;
    status('Counts updated, the queue reorders itself');
    render();
  });
  render();
})();

/* ---------- 5. Trickster's Hand ----------
   A full playable hand faithful to the deployed engine:
   - Ace high down to 2 low; you hold the Ace of Spades so you lead first
   - highest card of the lead suit loses the trick and leads the next
   - the moment anyone plays off-suit the trick ends and the loser picks up the pile
   - empty your hand and you are out (safe); the last player still holding cards loses
*/
(function trickster(){
  var handEl=document.getElementById('hand');
  if(!handEl) return;
  var pileEl=document.getElementById('pile'), logEl=document.getElementById('tLog'),
      dealBtn=document.getElementById('tDeal'), seatsEl=document.getElementById('tSeats'),
      hintEl=document.getElementById('tHint');
  var SUITS=[{s:'♠',cls:'s-spade'},{s:'♥',cls:'s-heart'},{s:'♦',cls:'s-diamond'},{s:'♣',cls:'s-club'}];
  var RANKS=['A','K','Q','J','10','9','8','7','6','5','4','3','2']; // Ace high
  var NAME={'♠':'spades','♥':'hearts','♦':'diamonds','♣':'clubs'};
  var players, leader, lead, plays, order, pos, over, gid=0, tricks=0;

  function rankIdx(c){ return RANKS.indexOf(c.r); }
  function suitCls(s){ for(var i=0;i<SUITS.length;i++) if(SUITS[i].s===s) return SUITS[i].cls; return ''; }
  function faces(c){ return '<span>'+c.r+'<b>'+c.s+'</b></span><small>'+c.r+'<b>'+c.s+'</b></small>'; }
  function cardEl(c,tag){ var el=document.createElement('div'); el.className='card '+suitCls(c.s);
    el.innerHTML=faces(c)+(tag?'<span class="lbl">'+tag+'</span>':''); return el; }
  function newDeck(){ var d=[],i,j; for(i=0;i<SUITS.length;i++) for(j=0;j<RANKS.length;j++) d.push({s:SUITS[i].s,r:RANKS[j]});
    for(i=d.length-1;i>0;i--){ var k=Math.floor(Math.random()*(i+1)); var t=d[i]; d[i]=d[k]; d[k]=t; } return d; }
  // second-person grammar helpers so "You" agrees ("You are / you lose / you pick up")
  function Subj(p){ return p.human?'You':p.name; }   // sentence start
  function subj(p){ return p.human?'you':p.name; }   // mid sentence
  function poss(p){ return p.human?'your':'their'; }
  function v(p,sing,plur){ return p.human?plur:sing; }
  // gid-guarded timeout: any pending step is cancelled the instant a new hand is dealt
  function later(fn,ms){ var g=gid; setTimeout(function(){ if(g===gid && !over) fn(); }, reduce?0:ms); }

  function burstConfetti(){
    if(reduce) return;
    var host = pileEl.closest ? pileEl.closest('.demo') : null;
    if(!host) return;
    var cols=['#9B1C2E','#FFC22E','#2B50E6','#0FB07A','#FF5A36','#6C4BE0'], N=42, parts=[];
    for(var i=0;i<N;i++){
      var el=document.createElement('div');
      el.style.cssText='position:absolute;top:34%;left:50%;width:8px;height:12px;border-radius:2px;pointer-events:none;z-index:5;background:'+cols[i%cols.length];
      host.appendChild(el);
      parts.push({el:el,x:0,y:0,vx:(Math.random()-.5)*7,vy:-(4+Math.random()*6),r:Math.random()*360,vr:(Math.random()-.5)*20,life:0});
    }
    var t0=performance.now();
    (function tick(now){
      var live=false;
      parts.forEach(function(p){
        p.vy+=0.28; p.x+=p.vx; p.y+=p.vy; p.r+=p.vr; p.life++;
        var op=Math.max(0,1-p.life/70);
        p.el.style.transform='translate('+p.x.toFixed(1)+'px,'+p.y.toFixed(1)+'px) rotate('+p.r.toFixed(0)+'deg)';
        p.el.style.opacity=op; if(op>0) live=true;
      });
      if(live && now-t0<1500) requestAnimationFrame(tick);
      else parts.forEach(function(p){ if(p.el.parentNode) p.el.parentNode.removeChild(p.el); });
    })(t0);
  }
  function deal(){
    gid++; over=false; tricks=0; leader=0;
    var d=newDeck();
    players=[
      {name:'You',human:true,hand:d.splice(0,5),out:false},
      {name:'Ravi',human:false,hand:d.splice(0,5),out:false},
      {name:'Nina',human:false,hand:d.splice(0,5),out:false},
      {name:'Theo',human:false,hand:d.splice(0,5),out:false}
    ];
    if(!players[0].hand.some(function(c){return c.r==='A'&&c.s==='♠';})){
      for(var pi=1;pi<4;pi++){
        var ix=players[pi].hand.findIndex(function(c){return c.r==='A'&&c.s==='♠';});
        if(ix>=0){ var sw=players[0].hand[0]; players[0].hand[0]=players[pi].hand[ix]; players[pi].hand[ix]=sw; break; }
      }
    }
    logEl.innerHTML='The aim is to empty your hand. Follow the lead suit if you can; the <b>highest card of the lead suit loses the trick</b>. Play off-suit and the trick ends at once, and the loser picks up the whole pile. You hold the Ace of Spades, so you lead.';
    startTrick();
  }

  function activeOrder(start){
    var o=[]; for(var i=0;i<4;i++){ var idx=(start+i)%4; if(!players[idx].out && players[idx].hand.length) o.push(idx); } return o;
  }
  function nextActive(from){ for(var i=1;i<4;i++){ var idx=(from+i)%4; if(!players[idx].out) return idx; } return from; }

  function renderSeats(){
    if(!seatsEl) return;
    seatsEl.innerHTML='';
    players.forEach(function(p,i){
      var el=document.createElement('span');
      el.className='seat'+(p.out?' out':'')+(!over&&order&&order[pos]===i?' turn':'');
      el.innerHTML=p.name+'<u>'+(p.out?'safe':p.hand.length+' left')+'</u>';
      seatsEl.appendChild(el);
    });
  }

  function startTrick(){
    plays=[]; lead=null; pos=0; order=activeOrder(leader);
    if(order.length<=1 || (tricks++ > 60)){ endGame(); return; }
    var who=players[order[0]];
    pileEl.innerHTML='<span class="ph">'+(who.human?'Your lead. Play any card.':who.name+' leads the trick.')+'</span>';
    renderSeats(); renderHand();
    step();
  }
  function step(){
    if(over) return;
    renderSeats();
    var p=players[order[pos]];
    if(p.human){
      if(hintEl) hintEl.textContent = plays.length===0 ? 'Your lead, play any card'
        : 'Your turn, follow '+NAME[lead]+' if you can';
      renderHand();
      return;                 // wait for a click
    }
    if(hintEl) hintEl.textContent = p.name+' is playing…';
    later(function(){ botPlay(order[pos]); }, 640);
  }
  function botPlay(idx){
    var p=players[idx], card;
    if(plays.length===0){ card=p.hand.slice().sort(function(a,b){return rankIdx(b)-rankIdx(a);})[0]; } // lead low
    else {
      var follow=p.hand.filter(function(c){return c.s===lead;});
      card = follow.length ? follow.sort(function(a,b){return rankIdx(b)-rankIdx(a);})[0]  // lowest of the suit
                           : p.hand.slice().sort(function(a,b){return rankIdx(a)-rankIdx(b);})[0]; // dump highest off-suit
    }
    commit(idx,card);
  }
  function humanPlay(i){
    if(over) return;
    var p=players[order[pos]];
    if(!p.human) return;
    commit(order[pos], p.hand[i]);
  }
  function commit(idx,card){
    var p=players[idx];
    p.hand.splice(p.hand.indexOf(card),1);
    if(plays.length===0){ lead=card.s; pileEl.innerHTML=''; }
    plays.push({idx:idx, c:card});
    pileEl.appendChild(cardEl(card,p.name));
    renderSeats();
    var offSuit = card.s!==lead;
    if(offSuit || pos+1>=order.length){ later(resolve,520); return; }
    pos++; step();
  }
  function resolve(){
    var onSuit=plays.filter(function(x){return x.c.s===lead;});
    var loser=onSuit.reduce(function(a,b){ return rankIdx(a.c)<=rankIdx(b.c)?a:b; });
    var off=plays.length-onSuit.length, lp=players[loser.idx];
    Array.prototype.forEach.call(pileEl.children,function(el,i){ if(plays[i]===loser) el.classList.add('loser'); });
    var msg='<b>'+Subj(lp)+'</b> played the highest '+NAME[lead]+' ('+loser.c.r+lead+') and '+v(lp,'loses','lose')+' the trick. ';
    if(off>0){ plays.forEach(function(x){ lp.hand.push(x.c); });
      msg+='An off-suit card ended it early, so '+subj(lp)+' '+v(lp,'picks up','pick up')+' '+plays.length+' card'+(plays.length>1?'s':'')+'.'; }
    else { msg+='Everyone followed suit, so the pile is discarded.'; }
    var safe=[];
    players.forEach(function(p){ if(!p.out && p.hand.length===0){ p.out=true; safe.push(p); } });
    if(safe.length===1){
      var sp=safe[0];
      msg+=' '+Subj(sp)+' '+v(sp,'empties','empty')+' '+poss(sp)+' hand and '+v(sp,'is','are')+' out, safe.';
    } else if(safe.length>1){
      msg+=' '+safe.map(Subj).join(' and ')+' empty their hands and are out, safe.';
    }
    logEl.innerHTML=msg;
    renderSeats();
    if(players.filter(function(p){return !p.out;}).length<=1){ later(endGame,900); return; }
    leader = lp.out ? nextActive(loser.idx) : loser.idx;
    later(startTrick, 2000);
  }
  function endGame(){
    over=true;
    if(hintEl) hintEl.textContent='Hand over';
    pileEl.innerHTML=''; renderSeats();
    var left=players.filter(function(p){return !p.out;});
    if(left.length===1){
      var lo=left[0];
      logEl.innerHTML='<b>'+Subj(lo)+'</b> '+v(lo,'is','are')+' the last one holding cards, so '+subj(lo)+' '+v(lo,'loses','lose')+' the hand. '+
        (lo.human?'Unlucky, deal again to get even.':'You got out in time. Deal again to replay.');
    } else {
      logEl.innerHTML='The hand is over. Deal again to replay.';
    }
    if(players[0] && players[0].out) burstConfetti();
    renderHand();
  }
  function renderHand(){
    handEl.innerHTML='';
    if(!players) return;
    var you=players[0];
    var yourTurn = !over && order && players[order[pos]] && players[order[pos]].human;
    var canFollow = lead ? you.hand.some(function(c){return c.s===lead;}) : true;
    you.hand.forEach(function(c,i){
      var b=document.createElement('button'); b.type='button';
      b.className='card '+suitCls(c.s);
      b.setAttribute('aria-label', c.r+' of '+NAME[c.s]);
      b.innerHTML=faces(c);
      var legal = !lead || !canFollow || c.s===lead;
      b.disabled = !yourTurn || !legal;
      b.addEventListener('click', function(){ humanPlay(i); });
      handEl.appendChild(b);
    });
  }
  dealBtn.addEventListener('click', deal);
  deal();
})();

})();