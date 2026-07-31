/* ============================================================
   DEMO MARKUP - single source of truth for each demo's HTML.
   Used by the home page (via data-demo mounts) and by
   project.html (injected before demos.js runs).
   The IDs here must match what js/demos.js looks for.
   ============================================================ */
window.DEMO_MARKUP = {
  gzd:{
    bar:'The live site, embedded',
    body:
      '<div class="siteframe" id="gzdEmbed">'+
        '<div class="sf-bar"><span class="sf-tl"><i></i><i></i><i></i></span><span class="sf-url">gzdbadminton.club</span></div>'+
        '<div class="sf-view">'+
          '<div class="sf-poster" style="background-image:url(assets/gzd-poster.jpg)"></div>'+
          '<iframe title="GZD Badminton Club, live site" loading="lazy" data-src="https://gzdbadminton.club/"></iframe>'+
          '<div class="sf-fallback">'+
            '<span class="mono-note">Live preview unavailable right now</span>'+
            '<a class="ext" href="https://gzdbadminton.club/" target="_blank" rel="noopener">Open the live site ↗</a>'+
          '</div>'+
        '</div>'+
      '</div>',
    foot:'<span>The real site, live on GitHub Pages, embedded below</span>'
  },
  shuttlescore:{
    bar:'Knockout bracket, auto-advancement',
    body:'<div class="bracket-scroll"><svg class="bracket" id="bracket" viewBox="0 0 760 400" role="img" aria-label="Animated eight-player knockout bracket filling in round by round"></svg></div>',
    foot:'<span id="bkStatus">Waiting…</span><button class="btn" id="bkReplay">Replay draw</button>'
  },
  choresync:{
    bar:'Rotation engine, drag the week',
    body:
      '<div class="rot-grid" id="rotGrid"></div>'+
      '<div class="slider-row">'+
        '<label for="wkSlider">Week</label>'+
        '<input type="range" id="wkSlider" min="0" max="8" value="0" step="1" aria-label="Week number">'+
        '<span class="wk" id="wkLabel">Week 1</span>'+
      '</div>',
    foot:'<span>Assignment = <span style="color:var(--volt)">(person + week) mod 3</span>, every zone once per 3 weeks</span><button class="btn" id="rotCarry">Simulate a missed week</button>'
  },
  shuttleup:{
    bar:'Fairness rule, fewest games play next',
    body:'<div class="court"><div class="teams" id="courtTeams"></div></div><div class="queue" id="queueList" aria-label="Waiting queue"></div>',
    foot:'<span id="suStatus">Tap to fill the court</span><span style="display:flex;gap:8px"><button class="btn" id="suFill">Fill court</button><button class="btn" id="suDone" disabled>Finish game</button></span>'
  },
  trickster:{
    bar:'Rules engine, play a trick',
    body:
      '<div class="table-top">'+
        '<div class="seats" id="tSeats"></div>'+
        '<div class="pile felt" id="pile"><span class="ph">You hold the Ace of Spades, so you lead. Pick a card.</span></div>'+
        '<p class="log" id="tLog">Highest card of the lead suit loses the trick. The moment someone plays off-suit, the trick ends and the loser picks up the whole pile.</p>'+
        '<div class="hand" id="hand"></div>'+
      '</div>',
    foot:'<span id="tHint">Follow suit where you can, invalid cards are disabled</span><button class="btn" id="tDeal">New hand</button>'
  }
};

/* build the full framed demo block for a given key */
window.buildDemo = function(key){
  var d = window.DEMO_MARKUP[key];
  if(!d) return '';
  return ''+
    '<div class="demo">'+
      '<div class="demo-bar"><em>'+d.bar+'</em><div class="dots"><i></i><i></i><i></i></div></div>'+
      '<div class="demo-body">'+d.body+'</div>'+
      '<div class="demo-foot">'+d.foot+'</div>'+
    '</div>';
};
