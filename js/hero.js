/* ============================================================
   HERO CANVAS - perspective court + shuttle trajectories
   Mounts only if #court exists. Respects reduced motion.
   ============================================================ */
(function heroCanvas(){
  'use strict';
  var c = document.getElementById('court');
  if(!c) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ctx = c.getContext('2d'), w=0, h=0, dpr=Math.min(window.devicePixelRatio||1, 2);

  function size(){
    w = c.clientWidth; h = c.clientHeight;
    c.width = w*dpr; c.height = h*dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  window.addEventListener('resize', size);
  size();

  function drawCourt(){
    var vx = w*0.5, vy = h*0.30, base = h*1.02, i;
    ctx.strokeStyle = 'rgba(120,132,160,0.13)';
    ctx.lineWidth = 1;
    for(i=-7;i<=7;i++){
      var bx = vx + i*(w*0.20);
      ctx.beginPath(); ctx.moveTo(bx, base); ctx.lineTo(vx + i*(w*0.012), vy); ctx.stroke();
    }
    for(i=1;i<=11;i++){
      var t = i/12, y = vy + (base-vy)*Math.pow(t, 2.35);
      ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke();
    }
    ctx.strokeStyle='rgba(200,255,77,0.10)'; ctx.lineWidth=1.4;
    var ny = vy + (base-vy)*Math.pow(4/12,2.35);
    ctx.beginPath(); ctx.moveTo(0,ny); ctx.lineTo(w,ny); ctx.stroke();
  }

  function Shuttle(){ this.reset(true); }
  Shuttle.prototype.reset = function(initial){
    var leftStart = Math.random()<0.5;
    this.x0 = leftStart ? -w*0.08 : w*1.08;
    this.y0 = h*(0.55 + Math.random()*0.35);
    this.x2 = leftStart ? w*(0.75+Math.random()*0.35) : w*(-0.1+Math.random()*0.35);
    this.y2 = h*(0.50 + Math.random()*0.40);
    this.x1 = (this.x0+this.x2)/2;
    this.y1 = h*(-0.15 + Math.random()*0.35);
    this.t  = initial ? Math.random() : 0;
    this.sp = 0.0022 + Math.random()*0.0026;
    this.hue = Math.random()<0.22 ? 'indigo' : 'volt';
  };
  Shuttle.prototype.pt = function(t){
    var mt=1-t;
    return [ mt*mt*this.x0 + 2*mt*t*this.x1 + t*t*this.x2,
             mt*mt*this.y0 + 2*mt*t*this.y1 + t*t*this.y2 ];
  };
  Shuttle.prototype.draw = function(){
    var steps = 34, i, p, alpha;
    var col = this.hue==='volt' ? '200,255,77' : '124,107,255';
    for(i=steps;i>0;i--){
      var tt = this.t - (i/steps)*0.30;
      if(tt<0) continue;
      p = this.pt(tt);
      alpha = (1 - i/steps) * 0.30 * Math.sin(Math.min(this.t,1)*Math.PI);
      ctx.fillStyle='rgba('+col+','+alpha.toFixed(3)+')';
      ctx.beginPath(); ctx.arc(p[0],p[1], 1.5*(1-i/steps)+0.4, 0, 6.283); ctx.fill();
    }
    if(this.t<=1){
      p = this.pt(this.t);
      ctx.save();
      ctx.shadowBlur=16; ctx.shadowColor='rgba('+col+',0.85)';
      ctx.fillStyle='rgba('+col+',0.95)';
      ctx.beginPath(); ctx.arc(p[0],p[1],2.3,0,6.283); ctx.fill();
      ctx.restore();
    }
    this.t += this.sp;
    if(this.t > 1.34) this.reset(false);
  };

  var flock=[], n=0;
  for(n=0;n<7;n++) flock.push(new Shuttle());

  function frame(){
    ctx.clearRect(0,0,w,h);
    drawCourt();
    for(var i=0;i<flock.length;i++) flock[i].draw();
    requestAnimationFrame(frame);
  }
  if(reduce){ ctx.clearRect(0,0,w,h); drawCourt(); }
  else frame();
})();
