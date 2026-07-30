/* ============================================================
   PROJECT DATA - drives project.html.
   To edit a project write-up, edit only this file.
   Order controls prev/next navigation.
   ============================================================ */
window.PROJECTS = {
  order: ['trickster','gzd','shuttlescore','choresync','shuttleup'],

  gzd:{
    num:'02', title:'GZD Badminton Club', role:'Client work', roleClass:'',
    tagline:'A ten page website, a custom domain, built, delivered and handed over.',
    meta:[['Role','Developer & club member'],['Client','Manchester community club'],['Live','gzdbadminton.club'],['Year','2026']],
    intro:'GZD is a Manchester community badminton club, run by one organiser, that wanted a website. As a developer and a member of the club, I built it: one place for members to find tournaments and announcements, and a proper front door to show prospective sponsors and partners.',
    sections:[
      {h:'The organiser’s choice, not mine',
       p:'I laid out two honest routes. A content management system the organiser could edit through an admin panel, or a fully static site that costs nothing to run and has nothing to log into or break. Neither is simply better; they trade editing convenience against simplicity and cost, so I explained both and left the decision where it belonged. The organiser weighed it up and chose static, so static is what I built, with plain comments in the markup so future edits are easy to find.'},
      {h:'Ten pages, one identity',
       p:'Home, About, Announcements, Memberships, Tournaments, Leagues, Sponsors, Partnerships, Location and Contact, all sharing a bold sporty visual language. Court Indigo, Volt Yellow and Smash Orange, with Anton, Manrope and Space Mono carrying the type. A vanilla JavaScript photo carousel runs the tournament highlights, and the memberships page carries the season pricing, the fixed schedule and a sign up form.'},
      {h:'Writing the site, not just the code',
       p:'The club story, the mission, the organiser bio, seven play grade descriptions from E and D minus up to A plus, past tournament records and the launch announcement copy were all written as part of the work. A separate Play Grades guide was generated programmatically as a PDF, and a full domain setup guide as a Word document so the organiser could point the custom domain themselves.'},
      {h:'Removing a cost the club should not have had',
       p:'The Instagram feed had been running through a third party widget that hit its view limit. I replaced it with a native embed grid, which removed the recurring charge entirely.'},
      {h:'Handing it over properly',
       p:'The repository was transferred to a dedicated club account, with my access retained for maintenance. Rather than hand it over and walk away, I stayed on for three months to support the handover as the organiser took it on, alongside a written domain setup guide and a README for whoever maintains it next.'}
    ],
    callout:'A good build is not the one with the cleverest stack. It is the one the client chose with full information, and can still run long after you have gone.',
    tags:['HTML','CSS','Vanilla JS','GitHub Pages','Custom domain / DNS','ReportLab','docx','Responsive','Copywriting'],
    link:'https://gzdbadminton.club',
    demo:'gzd'
  },

  shuttlescore:{
    num:'03', title:'ShuttleScore', role:'Full-stack app', roleClass:'alt',
    tagline:'Tournament management for a community of roughly 110 players, with a live spectator view.',
    meta:[['Role','Sole architect + developer'],['Scale','~110 players'],['Stack','React 19 + Supabase'],['Type','Passion project']],
    intro:'An apartment community ran a badminton tournament for around 110 residents across five age categories and three event types. Draws lived on paper, scores lived on WhatsApp, and nobody watching could tell you what was happening on court three. I built the whole thing solo, front to back.',
    sections:[
      {h:'Draws that generate themselves',
       p:'Round robin groups with configurable size and advancement, knockout brackets with automatic bye handling, and multi stage group to knockout events. Before play starts an admin can drag players between groups or swap two seeds in a bracket, scoped correctly to per match status so an in progress round is never disturbed.'},
      {h:'Scoring built for a phone in one hand',
       p:'Volunteer referees score with large tap targets, full multi game support, per game undo and delete, and an auto lock five minutes after a match finishes. An admin override is protected by a hashed password and writes a full audit trail into the match record.'},
      {h:'Spectators see it as it happens',
       p:'Scores, results, status changes and announcements all push live to everyone watching through Supabase Realtime, with no refresh. The public view carries an SVG bracket tree with dynamically drawn connectors, group standings with tiebreaker indicators, searchable player profiles with match history and medals, and a QR code for sharing the URL.'},
      {h:'Ties resolved the way the rules actually say',
       p:'Wins first, then point difference, then head to head, then an admin decision using up and down arrows that are constrained strictly to within a genuine tie cluster, so the manual override can never reorder players who are not actually tied.'},
      {h:'History protected by design',
       p:'A player who appears in any match cannot be deleted. Referees are archived rather than removed so past attribution survives. A referee to player link locks the moment that referee officiates a match. And the bulk CSV import deliberately reads only name, date of birth and gender, ignoring the apartment numbers, phone numbers and emails that sit in the same file.'}
    ],
    callout:'The interesting work was never the scoring. It was making sure that once a tournament had happened, nothing anyone did afterwards could quietly rewrite what happened.',
    tags:['React 19','Supabase','PostgreSQL','Realtime','Row Level Security','Custom auth','Postgres triggers','Hand-written CSS'],
    link:null,
    demo:'shuttlescore'
  },

  choresync:{
    num:'04', title:'ChoreSync', role:'Installable app', roleClass:'alt',
    tagline:'A shared house chore rotation with push notifications, on iPhone and Android, running at zero cost.',
    meta:[['Role','Full-stack developer'],['Household','Three people, mixed devices'],['Cost','£0 per month'],['Year','2026']],
    intro:'Three housemates, a mixed iPhone and Android household, and the usual argument about whose turn it was. Splitting chores evenly by count does not work, because one person ends up with the bathroom while another gets the bins. The job was to make it fair, automatic and free.',
    sections:[
      {h:'Balanced by time, not by task',
       p:'Every chore was individually timed, then grouped into three zones that land within a single minute of each other: hoover and living areas at 37 minutes, the upstairs washroom at 37, the kitchen at 38. A one minute spread, and far easier to remember than mixed bundles.'},
      {h:'Free was the hardest constraint',
       p:'A native app would have meant a 79 pound a year Apple developer account just to get onto an iPhone. An installable web app got the same result, a real icon on the home screen of both platforms, with push notifications, at no cost. That single constraint drove the entire architecture toward a PWA backed by Supabase.'},
      {h:'Rotates on its own, forever',
       p:'The week assignment is derived from the date using (person plus week) mod three, so every zone is done exactly once per three weeks and there is no schedule stored anywhere to maintain or fall out of sync. Reminders for chore day, bins out, bins in and an overdue nudge are each configurable and evaluated in the household own timezone.'},
      {h:'Changing the rules without breaking history',
       p:'When the zones were restructured, mutating the definitions in place would have retroactively rewritten history and corrupted the XP and streak totals. Instead the bundles are effective dated, so past weeks are always interpreted with the rules that were live at the time, and the change was scheduled to land on a week boundary so nobody in progress week was disrupted.'},
      {h:'A real bug, found and fixed',
       p:'A cron job fires every five minutes to send reminders, and it must never send duplicates. The de-dupe row was originally written before the push was sent, which meant any send failure marked the reminder as delivered and silently blocked all retries for the rest of the day. Changing it to record only after a confirmed successful send fixed a failure that would otherwise never have surfaced.'}
    ],
    callout:'Carry over, at risk status and missed weeks are all computed from the tick data that already exists rather than stored in new tables. No migration was needed, and the system self corrects if someone ticks something late.',
    tags:['PWA','Service Worker','Web Push','Supabase','Postgres + RLS','Edge Functions','pg_cron','pg_net','Vanilla JS'],
    link:null,
    demo:'choresync'
  },

  shuttleup:{
    num:'05', title:'Shuttle Up!', role:'Small tool', roleClass:'ghost',
    tagline:'A local first session manager for drop in badminton. One file, no backend.',
    meta:[['Role','Solo build'],['Size','994 lines, one file'],['Backend','None'],['Year','2026']],
    intro:'At casual badminton sessions somebody always ends up managing a paper list of who has played and who is waiting. People get skipped, and the person holding the pen never gets a game. This replaces the paper.',
    sections:[
      {h:'Fairness as the default',
       p:'Courts fill automatically with the four waiting players who have had the fewest games, then shuffle them into teams. Scores go in per court, with live win, loss and win percentage stats and a match history.'},
      {h:'Overridable, because real sessions are not tidy',
       p:'Swap any player within a court, or swap someone in from the waiting queue. The app copes with late arrivals and with courts being added or lost partway through a session.'},
      {h:'Zero infrastructure',
       p:'The entire app is a single 994 line index.html with no dependencies, no build step and no server. It is hosted free on GitHub Pages and installs to a phone home screen through its PWA manifest. Recent player names are remembered so regulars are one tap to re-add.'},
      {h:'What I would change',
       p:'There is no offline service worker and no skill based matchmaking yet, and both are on the roadmap alongside ELO style ratings and QR based session sharing. The session data being throwaway, though, was deliberate: a session ends when you leave the court.'}
    ],
    callout:'Deliberate scoping is a feature. Knowing that the session data should be ephemeral kept the whole thing to one file with nothing to host.',
    tags:['Vanilla JS','PWA','Zero dependencies','Mobile-first','GitHub Pages'],
    link:null,
    demo:'shuttleup'
  },

  trickster:{
    num:'01', title:"Trickster's Hand", role:'Multiplayer game', roleClass:'ghost',
    tagline:'A real time online card game for two to six players, plus unlimited spectators, on an authoritative server.',
    meta:[['Role','Solo build'],['Players','2 to 6, plus spectators'],['Stack','Node + Socket.IO'],['Live','tricksters-hand.onrender.com']],
    intro:'A card game we used to play in person, rebuilt so I could keep playing it with friends now scattered across different countries. It grew into a finished, deployed product. The rules are simple but ruthless: empty your hand, and try not to be the last one left holding cards. The interesting part is not the cards, it is that no player browser can be trusted, so every rule has to be enforced somewhere they cannot reach, and a table played across the world has to survive people on flaky connections refreshing, dropping out, and wandering in to watch.',
    sections:[
      {h:'How the game actually plays',
       p:'The player holding the Ace of Spades leads the first trick and may play anything. Cards rank Ace high down to two low, and everyone must follow the lead suit if they can. The highest card of the lead suit loses the trick and leads the next one. If everybody follows suit the pile is simply discarded, but the moment anyone plays off suit the trick ends at once and the losing player picks up the whole pile as a penalty. Empty your hand and you are out. The last player still holding cards is the only loser.'},
      {h:'Identity decoupled from the connection',
       p:'This is the piece that makes everything else possible. Each browser tab holds its own random token, and all game and lobby state is keyed by that token rather than by the socket connection. A refresh or a dropped connection maps straight back to the same seat with the exact same hand, and it is also what lets spectators join a game already in progress and watch without ever being dealt in.'},
      {h:'One voting engine, three flows',
       p:'When a seated player disconnects mid game the whole table pauses and votes, by unanimous consent, whether to keep waiting or carry on without them. The same consensus engine drives two more flows, restarting the current hand and returning everyone to the lobby, so three quite different situations all run through one well tested piece of logic.'},
      {h:'The server owns the truth',
       p:'All rules, turn order and trick resolution live server side and the deck is dealt from a Fisher Yates shuffle. Clients only ever render state and send intents, so no amount of tinkering in a browser lets anyone play out of turn, ignore follow suit, or peek at another hand. Only names and card counts are ever broadcast, never the cards themselves.'},
      {h:'Finished to the last detail',
       p:'An illustrated dark occult deck with four painted court figures and four colour suits for readability on an oxblood felt table. Win and loss celebrations with rotating messages and chime and toll sound effects synthesised at runtime through the Web Audio API, so there are no audio files to serve. A guided interactive tutorial on the lobby, a mobile first responsive layout, and a PWA manifest so it installs to a phone home screen.'}
    ],
    callout:'The hard problem was never the card rules. It was making a live table that shrugs off a refresh, pauses gracefully when someone drops, and lets a latecomer pull up a chair to watch, all keyed off one stable identity token.',
    tags:['Node.js','Express 5','Socket.IO 4','WebSockets','Vanilla JS','Web Audio API','PWA','Reconnect resilience','Consensus voting'],
    link:'https://tricksters-hand.onrender.com/',
    linkLabel:'Play the live game ↗',
    demo:'trickster'
  }
};