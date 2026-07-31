/* ============================================================
   PROJECT DATA - drives project.html.
   Edit a project's write-up here. Order controls prev/next.
   ============================================================ */
window.PROJECTS = {
  order: ['trickster','gzd','shuttlescore','choresync','shuttleup'],

  trickster:{
    num:'01', title:"Trickster's Hand", role:'Multiplayer game', pa:'#9B1C2E',
    tagline:'A real-time card game for two to six players, plus spectators, deployed and live.',
    meta:[['Role','Solo build'],['Players','2 to 6, plus spectators'],['Stack','Node + Socket.IO'],['Live','tricksters-hand.onrender.com']],
    intro:'A card game we play in person, rebuilt so it works with friends now spread across countries. It grew into a finished, deployed product.',
    sections:[
      {h:'How it plays',
       p:'You hold the Ace of Spades and lead. Everyone follows the lead suit if they can, and the highest card of the lead suit loses the trick. Play off-suit and the trick ends at once, and the loser picks up the whole pile. Empty your hand to get out; the last player still holding cards loses.'},
      {h:'Nobody can cheat',
       p:'Every rule, turn and trick lives on an authoritative server. Clients only render and send intents, so no browser can play out of turn, ignore follow suit, or peek at another hand.'},
      {h:'Survives a real table',
       p:'Each browser tab holds its own token, and all state is keyed to it rather than the connection. A refresh or a dropped signal lands you back in your exact seat, and it is what lets spectators join and watch a game in progress.'},
      {h:'One voting engine, three flows',
       p:'A disconnect pauses the table for a unanimous vote to wait or carry on. The same consensus engine also drives restarting the hand and returning everyone to the lobby.'},
      {h:'Finished to the last detail',
       p:'An illustrated dark occult deck with four colour suits, win and loss chimes synthesised at runtime with the Web Audio API, a lobby tutorial, and an installable PWA.'}
    ],
    callout:'The hard problem was never the card rules. It was a live table that shrugs off a refresh, pauses when someone drops, and lets a latecomer pull up a chair to watch.',
    tags:['Node.js','Express 5','Socket.IO 4','WebSockets','Vanilla JS','Web Audio API','PWA','Reconnect resilience','Consensus voting'],
    link:'https://tricksters-hand.onrender.com/',
    linkLabel:'Play the live game ↗',
    demo:'trickster'
  },

  gzd:{
    num:'02', title:'GZD Badminton Club', role:'Community build', pa:'#2B50E6',
    tagline:'A ten page website for a Manchester badminton club, built to brief and handed over.',
    meta:[['Role','Developer & club member'],['Client','Manchester community club'],['Live','gzdbadminton.club'],['Year','2026']],
    intro:'GZD is a Manchester community badminton club that wanted a website. As a developer and a member of the club, I built it: one place for members to find tournaments and announcements, and a front door for prospective sponsors.',
    sections:[
      {h:'Built to the club’s brief',
       p:'I laid out two honest routes, a CMS the organiser could edit and a fully static site, with the trade-offs of each. The organiser chose static, so static is what I built: nothing to log into, no hosting to pay for beyond the domain, and plain comments in the markup so future edits are easy to find.'},
      {h:'Ten pages, one identity',
       p:'Home, About, Announcements, Memberships, Tournaments, Leagues, Sponsors, Partnerships, Location and Contact, sharing one bold identity. The memberships page carries the season pricing, the fixed schedule and a sign up form.'},
      {h:'Wrote the site, not just the code',
       p:'The club story, the play grade descriptions, tournament records and launch copy, plus a Play Grades guide as a PDF and a domain setup guide as a Word document, were all produced as part of the work.'},
      {h:'Handed over properly',
       p:'The repository moved to a dedicated club account with my access kept for maintenance. Rather than walk away, I stayed on for three months to support the handover, alongside a README for whoever maintains it next.'}
    ],
    callout:'A good build is not the one with the cleverest stack. It is the one the client chose with full information, and can still run long after you have gone.',
    tags:['HTML','CSS','Vanilla JS','GitHub Pages','Custom domain / DNS','ReportLab','docx','Copywriting'],
    link:'https://gzdbadminton.club',
    demo:'gzd'
  },

  shuttlescore:{
    num:'03', title:'ShuttleScore', role:'Full-stack app', pa:'#FF5A36',
    tagline:'A full tournament system for a community of roughly 110 players, with a live spectator view.',
    meta:[['Role','Sole architect + developer'],['Scale','~110 players'],['Stack','React 19 + Supabase'],['Type','Passion project']],
    intro:'An apartment community ran a badminton tournament for around 110 residents across five age categories and three event types. I built the whole thing solo, front to back.',
    sections:[
      {h:'Draws that generate themselves',
       p:'Round robin groups, knockout brackets with automatic byes, and multi stage group to knockout events, with manual drag and drop overrides to move players or swap seeds before a round starts.'},
      {h:'Scoring in one hand, live to all',
       p:'Volunteer referees score on a phone with big tap targets, and scores, results and announcements push live to every spectator through Supabase Realtime, with no refresh.'},
      {h:'History protected by design',
       p:'A player who appears in any match cannot be deleted, referees are archived rather than removed, and the bulk import reads only name, date of birth and gender, ignoring everything else in the file.'}
    ],
    callout:'The interesting work was never the scoring. It was making sure that once a tournament had happened, nothing anyone did afterwards could quietly rewrite it.',
    tags:['React 19','Supabase','PostgreSQL','Realtime','Row Level Security','Custom auth','Hand-written CSS'],
    link:null,
    demo:'shuttlescore'
  },

  choresync:{
    num:'04', title:'ChoreSync', role:'Installable app', pa:'#0FB07A',
    tagline:'A shared house chore rotation with push notifications, on any phone, running free.',
    meta:[['Role','Full-stack developer'],['Household','Three people, mixed devices'],['Cost','£0 per month'],['Year','2026']],
    intro:'Three housemates, a mixed iPhone and Android household, and the usual argument about whose turn it was. Splitting by task count is not fair, so the job was to make it fair, automatic and free.',
    sections:[
      {h:'Balanced by time, not by task',
       p:'Every chore was individually timed and grouped into three zones that land within a minute of each other, so nobody quietly ends up with the heavy end.'},
      {h:'Free was the hardest constraint',
       p:'A native app meant a 79 pound a year Apple account just to reach an iPhone. An installable web app got the same home screen icon and push notifications on both platforms at no cost, and that constraint drove the whole architecture.'},
      {h:'Rotates itself, keeps history',
       p:'The week is derived from the date, so there is nothing to maintain. When the zones were later restructured, past weeks kept being scored by the rules that were live at the time, so no XP or streaks were corrupted.'}
    ],
    callout:'Carry over, at risk status and missed weeks are all computed from the tick data that already exists, so no migration was needed and it self corrects if someone ticks late.',
    tags:['PWA','Service Worker','Web Push','Supabase','Postgres + RLS','Edge Functions','pg_cron','Vanilla JS'],
    link:null,
    demo:'choresync'
  },

  shuttleup:{
    num:'05', title:'Shuttle Up!', role:'Small tool', pa:'#E0850F',
    tagline:'A local-first session manager for drop-in badminton. One file, no backend.',
    meta:[['Role','Solo build'],['Size','994 lines, one file'],['Backend','None'],['Year','2026']],
    intro:'At casual badminton, someone always ends up managing a paper list of who has played and who is waiting, and people get skipped. This replaces the paper.',
    sections:[
      {h:'Fair by default',
       p:'Courts fill with the four waiting players who have had the fewest games, then shuffle them into teams. Scores go in per court, with live win, loss and win percentage stats.'},
      {h:'Overridable, because sessions are messy',
       p:'Tap any player to swap them, sub someone in from the queue, or swap two on court to repartner the teams. It copes with late arrivals and with courts appearing or vanishing mid session.'},
      {h:'Zero infrastructure',
       p:'The whole app is a single 994 line file with no dependencies, no server and nothing to pay for, and it installs to a phone home screen.'}
    ],
    callout:'Knowing the session data should be throwaway is what kept it to one file with nothing to host. A session ends when you leave the court.',
    tags:['Vanilla JS','PWA','Zero dependencies','Mobile-first','GitHub Pages'],
    link:null,
    demo:'shuttleup'
  }
};