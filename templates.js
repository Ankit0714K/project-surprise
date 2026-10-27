
(function () {
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const nl2br = (s) => esc(s).replace(/\n/g, "<br>");

  const OCCASIONS = [
    { id: "love", label: "Love & Relationship", emoji: "💌" },
    { id: "birthday", label: "Birthday", emoji: "🎂" },
    { id: "friendship", label: "Best Friend", emoji: "🤝" },
    { id: "anniversary", label: "Anniversary", emoji: "💍" },
    { id: "apology", label: "Apology & Appreciation", emoji: "🌷" },
    { id: "custom", label: "Custom Personal Page", emoji: "✨" },
  ];

  const TEMPLATES = [
    { id: "love-letter", name: "Love Letter", occasion: ["love", "anniversary", "apology"], desc: "A romantic handwritten-letter mood with soft rose tones.", accent: "#e11d48", emoji: "💌", preview: "linear-gradient(145deg,#fff1f2,#fda4af)" },
    { id: "midnight-stars", name: "Midnight Stars", occasion: ["love", "anniversary", "apology", "custom"], desc: "A dreamy night sky with glowing, cinematic text.", accent: "#a78bfa", emoji: "🌌", preview: "radial-gradient(circle at 50% 20%,#4338ca,#100b25 75%)" },
    { id: "velvet-rose", name: "Velvet Rose", occasion: ["love", "anniversary"], desc: "Deep burgundy, elegant typography and a luxe feel.", accent: "#fb7185", emoji: "🌹", preview: "linear-gradient(145deg,#450a1c,#9f1239)" },
    { id: "sunset-love", name: "Sunset Promise", occasion: ["love", "anniversary", "custom"], desc: "Warm sunset gradients for a dreamy love story.", accent: "#f97316", emoji: "🌅", preview: "linear-gradient(145deg,#fed7aa,#fb7185,#7c3aed)" },
    { id: "party-pop", name: "Party Pop", occasion: ["birthday", "custom"], desc: "Bright confetti energy with a playful gift reveal.", accent: "#f59e0b", emoji: "🎉", preview: "linear-gradient(145deg,#fff7ed,#fde047)" },
    { id: "birthday-cinema", name: "Birthday Cinema", occasion: ["birthday"], desc: "A bold midnight celebration with spotlight styling.", accent: "#fbbf24", emoji: "🎬", preview: "linear-gradient(145deg,#111827,#581c87)" },
    { id: "confetti-cake", name: "Confetti Cake", occasion: ["birthday", "custom"], desc: "Pastel colors, cheerful shapes and a cute celebration.", accent: "#ec4899", emoji: "🧁", preview: "linear-gradient(145deg,#fce7f3,#dbeafe,#fef3c7)" },
    { id: "polaroid-pals", name: "Polaroid Pals", occasion: ["friendship", "birthday", "custom"], desc: "A photo-first scrapbook full of shared memories.", accent: "#14b8a6", emoji: "📸", preview: "linear-gradient(145deg,#ccfbf1,#f0fdfa)" },
    { id: "bestie-scrapbook", name: "Bestie Scrapbook", occasion: ["friendship"], desc: "Playful sticker-book energy for your favourite human.", accent: "#0d9488", emoji: "🫶", preview: "linear-gradient(145deg,#d1fae5,#fef3c7)" },
    { id: "anniversary-timeline", name: "Our Timeline", occasion: ["anniversary", "love"], desc: "A meaningful, elegant look for your shared journey.", accent: "#c084fc", emoji: "🗓️", preview: "linear-gradient(145deg,#f3e8ff,#e9d5ff)" },
    { id: "golden-hour", name: "Golden Hour", occasion: ["anniversary", "love"], desc: "Warm champagne tones for a timeless celebration.", accent: "#b45309", emoji: "🥂", preview: "linear-gradient(145deg,#fef3c7,#d6a756)" },
    { id: "gentle-bloom", name: "Gentle Bloom", occasion: ["apology"], desc: "Calm botanical colors for a thoughtful message.", accent: "#65a30d", emoji: "🌿", preview: "linear-gradient(145deg,#ecfccb,#d1fae5)" },
    { id: "soft-words", name: "Soft Words", occasion: ["apology"], desc: "A quiet, minimal letter that puts your words first.", accent: "#64748b", emoji: "🕊️", preview: "linear-gradient(145deg,#f8fafc,#cbd5e1)" },
    { id: "custom-minimal", name: "Modern Minimal", occasion: ["custom"], desc: "Clean lines, generous space and a modern editorial look.", accent: "#6366f1", emoji: "✦", preview: "linear-gradient(145deg,#e0e7ff,#f8fafc)" },
  ];

  const BASE_CSS = `
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'Poppins',system-ui,sans-serif;min-height:100vh;overflow-x:hidden;color:var(--ink);background:var(--bg);line-height:1.6}
section{padding:64px 20px;max-width:760px;margin:0 auto;text-align:center;position:relative;z-index:2}
h1,h2{font-family:var(--head);line-height:1.15}
h1{font-size:clamp(2.2rem,8vw,4rem)}
h2{font-size:clamp(1.5rem,5vw,2.2rem);margin-bottom:18px}
.eyebrow{letter-spacing:.2em;text-transform:uppercase;font-size:.75rem;color:var(--accent);margin-bottom:12px}
.hero{min-height:92vh;display:flex;flex-direction:column;justify-content:center;align-items:center}
.hero p.sub{margin-top:14px;opacity:.8}
.scroll{margin-top:36px;animation:bob 1.6s ease-in-out infinite;font-size:1.6rem}
@keyframes bob{50%{transform:translateY(8px)}}
.letter{padding:28px 24px;border-radius:16px;text-align:left;font-size:1.05rem;white-space:normal;background:var(--card);box-shadow:0 10px 40px rgba(0,0,0,.12)}
.sign{margin-top:22px;text-align:right;font-family:var(--head);font-size:1.3rem;color:var(--accent)}
.gallery{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:18px}
.ph{background:var(--card);padding:10px;border-radius:6px;box-shadow:0 8px 24px rgba(0,0,0,.2);transform:rotate(var(--r));transition:transform .3s}
.ph:hover{transform:rotate(0) scale(1.04)}
.ph img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:3px;display:block}
.count{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.count div{background:var(--card);border-radius:14px;padding:14px 16px;min-width:76px;box-shadow:0 6px 20px rgba(0,0,0,.12)}
.count b{display:block;font-size:1.8rem;color:var(--accent)}
.count small{opacity:.7;font-size:.7rem;text-transform:uppercase;letter-spacing:.1em}
.btn{border:0;cursor:pointer;font:600 1rem 'Poppins',sans-serif;padding:14px 30px;border-radius:999px;background:var(--accent);color:#fff;box-shadow:0 8px 24px rgba(0,0,0,.25);transition:transform .2s}
.btn:hover{transform:scale(1.06)}
.modal{position:fixed;inset:0;background:rgba(0,0,0,.6);display:none;align-items:center;justify-content:center;padding:20px;z-index:50}
.modal.open{display:flex}
.modal .box{background:var(--card);color:var(--ink);max-width:460px;width:100%;padding:32px 26px;border-radius:20px;text-align:center;animation:pop .4s}
@keyframes pop{from{transform:scale(.6);opacity:0}}
.modal .box p{margin:14px 0 22px}
.float{position:fixed;bottom:-40px;z-index:1;pointer-events:none;animation:rise linear forwards}
@keyframes rise{to{transform:translateY(-115vh) rotate(40deg);opacity:0}}
footer{padding:40px 20px;text-align:center;font-size:.8rem;opacity:.6;position:relative;z-index:2}
.reveal{opacity:0;transform:translateY(30px);transition:all .9s}
.reveal.in{opacity:1;transform:none}
canvas#confetti{position:fixed;inset:0;pointer-events:none;z-index:60}
`;

  const THEME_CSS = {
    "love-letter": `
:root{--bg:linear-gradient(160deg,#fff1f2,#fecdd3);--ink:#4c0519;--card:#fffaf5;--head:'Playfair Display',serif}
.letter{border:1px solid #fecdd3;background-image:repeating-linear-gradient(transparent,transparent 31px,#fde6e8 32px);line-height:32px}
.ph{--r:0deg}`,
    "midnight-stars": `
:root{--bg:radial-gradient(ellipse at top,#1e1b4b,#0b0820 70%);--ink:#ede9fe;--card:rgba(255,255,255,.07);--head:'Playfair Display',serif}
h1{text-shadow:0 0 24px var(--accent)}
.letter,.count div{backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.12)}
.modal .box{background:#1e1b4b}
.ph{background:rgba(255,255,255,.1)}`,
    "party-pop": `
:root{--bg:linear-gradient(135deg,#fff7ed,#fde68a);--ink:#431407;--card:#fff;--head:'Fredoka',sans-serif}
h1{background:linear-gradient(90deg,#f59e0b,#ef4444,#ec4899);-webkit-background-clip:text;background-clip:text;color:transparent}
.gift{font-size:5rem;cursor:pointer;display:inline-block;animation:shake 1.4s infinite}
@keyframes shake{10%,30%{transform:rotate(-8deg)}20%,40%{transform:rotate(8deg)}50%{transform:none}}`,
    "polaroid-pals": `
:root{--bg:#f0fdfa;--ink:#134e4a;--card:#fff;--head:'Caveat',cursive}
body{background-image:radial-gradient(#99f6e4 1.5px,transparent 1.5px);background-size:22px 22px;background-color:#f0fdfa}
h1{font-size:clamp(2.8rem,10vw,5rem)}
.letter{transform:rotate(-1deg);border-left:6px solid var(--accent)}
.ph{padding:10px 10px 36px}`,
    "velvet-rose": `
:root{--bg:radial-gradient(ellipse at top,#881337,#240712 75%);--ink:#fff1f2;--card:rgba(255,255,255,.08);--head:'Playfair Display',serif}
body{background-image:radial-gradient(circle at 15% 20%,rgba(251,113,133,.18),transparent 28%)}
.letter,.count div{border:1px solid rgba(255,255,255,.15);backdrop-filter:blur(10px)}
`,
    "sunset-love": `
:root{--bg:linear-gradient(160deg,#ffedd5,#fda4af 48%,#7c3aed);--ink:#431407;--card:rgba(255,255,255,.72);--head:'Playfair Display',serif}
.hero h1{text-shadow:0 4px 24px rgba(124,58,237,.15)}
.letter{border:1px solid rgba(255,255,255,.65);backdrop-filter:blur(8px)}
`,
    "birthday-cinema": `
:root{--bg:radial-gradient(ellipse at 50% 0%,#581c87,#111827 68%);--ink:#fef3c7;--card:rgba(255,255,255,.08);--head:'Fredoka',sans-serif}
.hero{background:radial-gradient(ellipse at 50% 35%,rgba(251,191,36,.12),transparent 48%)}
h1{text-shadow:0 0 34px rgba(251,191,36,.3)}
.letter,.count div{border:1px solid rgba(251,191,36,.2)}
`,
    "confetti-cake": `
:root{--bg:linear-gradient(135deg,#fce7f3,#dbeafe 52%,#fef3c7);--ink:#4a044e;--card:rgba(255,255,255,.78);--head:'Fredoka',sans-serif}
body{background-image:radial-gradient(#f9a8d4 1.5px,transparent 1.5px),radial-gradient(#93c5fd 1.5px,transparent 1.5px);background-size:28px 28px;background-position:0 0,14px 14px}
.letter{border:2px dashed #f9a8d4}
`,
    "bestie-scrapbook": `
:root{--bg:#ecfdf5;--ink:#134e4a;--card:#fffdf5;--head:'Caveat',cursive}
body{background-image:radial-gradient(#5eead4 1.5px,transparent 1.5px);background-size:24px 24px}
.letter{border-radius:26px;border:2px solid #99f6e4;transform:rotate(-1deg)}
.ph{padding:10px 10px 36px;border-radius:3px}
`,
    "anniversary-timeline": `
:root{--bg:linear-gradient(150deg,#faf5ff,#e9d5ff);--ink:#3b0764;--card:rgba(255,255,255,.78);--head:'Playfair Display',serif}
.letter{border-left:4px solid var(--accent);border-radius:4px 18px 18px 4px}
.count div{border:1px solid #ddd6fe}
`,
    "golden-hour": `
:root{--bg:linear-gradient(145deg,#fffbeb,#f5d58a);--ink:#422006;--card:rgba(255,255,255,.72);--head:'Playfair Display',serif}
.letter{border:1px solid #e7c878;box-shadow:0 14px 35px rgba(120,53,15,.12)}
.count div{border:1px solid #f0dba2}
`,
    "gentle-bloom": `
:root{--bg:linear-gradient(145deg,#f7fee7,#ecfccb 48%,#d1fae5);--ink:#365314;--card:rgba(255,255,255,.8);--head:'Playfair Display',serif}
body{background-image:radial-gradient(circle at 8% 18%,rgba(101,163,13,.12),transparent 22%),radial-gradient(circle at 90% 80%,rgba(5,150,105,.12),transparent 24%)}
.letter{border:1px solid #bef264;border-radius:24px}
`,
    "soft-words": `
:root{--bg:linear-gradient(145deg,#f8fafc,#e2e8f0);--ink:#1e293b;--card:#fff;--head:'Playfair Display',serif}
.letter{border:1px solid #cbd5e1;box-shadow:0 14px 38px rgba(15,23,42,.07)}
.eyebrow{letter-spacing:.28em}
`,
    "custom-minimal": `
:root{--bg:#f8fafc;--ink:#111827;--card:#fff;--head:'Poppins',sans-serif}
body{background-image:linear-gradient(rgba(99,102,241,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,.035) 1px,transparent 1px);background-size:28px 28px}
.hero h1{letter-spacing:-.045em}
.letter{border:1px solid #e0e7ff;box-shadow:0 18px 45px rgba(30,41,59,.06)}
`,
  };

  const FLOATERS = {
    "love-letter": ["💗", "💖", "🌸"],
    "midnight-stars": ["✨", "⭐", "🌙"],
    "party-pop": ["🎈", "🎉", "🎊"],
    "polaroid-pals": ["📸", "⭐", "🌿"],
    "velvet-rose": ["🌹", "💗", "✨"],
    "sunset-love": ["🌅", "💖", "✨"],
    "birthday-cinema": ["⭐", "🎬", "✨"],
    "confetti-cake": ["🎂", "🎉", "🎈"],
    "bestie-scrapbook": ["🫶", "📸", "🌿"],
    "anniversary-timeline": ["💜", "✨", "🌙"],
    "golden-hour": ["✨", "🥂", "🌼"],
    "gentle-bloom": ["🌿", "🌷", "🍃"],
    "soft-words": ["🕊️", "🌸", "✨"],
    "custom-minimal": ["✦", "✨", "·"],
  };

  function renderSite(d) {
    const t = TEMPLATES.find((x) => x.id === d.templateId) || TEMPLATES[0];
    const accent = /^#[0-9a-f]{6}$/i.test(d.accent || "") ? d.accent : t.accent;
    const photos = (d.photos || [])
      .map((p, i) => `<figure class="ph" style="--r:${(i % 2 ? 1 : -1) * (1 + (i % 3))}deg"><img src="${esc(p)}" alt="Memory ${i + 1}"></figure>`)
      .join("");
    const to = esc(d.to || "You");
    const from = esc(d.from || "");
    const title = esc(d.title || `For ${d.to || "You"}`);
    const hasDate = !!d.date;
    const settings = JSON.stringify({
      date: d.date || "",
      label: d.dateLabel || "",
      floaters: FLOATERS[t.id],
      stars: t.id === "midnight-stars",
    }).replace(/</g, "\\u003c");

    return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600&family=Fredoka:wght@500;600&family=Playfair+Display:ital,wght@0,600;1,500&family=Poppins:wght@400;600&display=swap" rel="stylesheet">
<style>:root{--accent:${accent}}${BASE_CSS}${THEME_CSS[t.id]}</style></head>
<body>
<section class="hero">
  <p class="eyebrow">${esc(d.eyebrow || "A little something for")}</p>
  <h1>${to}</h1>
  <p class="sub">${title}</p>
  <div class="scroll">↓</div>
</section>
<section class="reveal"><h2>A message for you</h2>
  <div class="letter">${nl2br(d.message || "Write your message here…")}</div>
  ${from ? `<div class="sign">— ${from}</div>` : ""}
</section>
${photos ? `<section class="reveal"><h2>Our memories</h2><div class="gallery">${photos}</div></section>` : ""}
${hasDate ? `<section class="reveal"><h2 id="cdLabel"></h2><div class="count" id="cd"></div></section>` : ""}
${d.surprise ? `<section class="reveal"><h2>One more thing…</h2>
  ${t.id === "party-pop" ? `<div class="gift" id="open" role="button" aria-label="Open gift">🎁</div>` : `<button class="btn" id="open">Open your surprise</button>`}
</section>
<div class="modal" id="modal"><div class="box"><h2>🎉 Surprise!</h2><p>${nl2br(d.surprise)}</p><button class="btn" id="close">Close</button></div></div>` : ""}
<footer>Made with love${from ? " by " + from : ""} • Project Surprise</footer>
<canvas id="confetti"></canvas>
<script>
(function(){
var S=${settings};
// reveal on scroll
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)e.target.classList.add('in')})},{threshold:.15});
document.querySelectorAll('.reveal').forEach(function(el){io.observe(el)});
// floating emojis
setInterval(function(){
  var f=document.createElement('div');f.className='float';
  f.textContent=S.floaters[Math.floor(Math.random()*S.floaters.length)];
  f.style.left=Math.random()*100+'vw';f.style.fontSize=(14+Math.random()*22)+'px';
  f.style.animationDuration=(6+Math.random()*6)+'s';
  document.body.appendChild(f);setTimeout(function(){f.remove()},12000);
},700);
// countdown / days together
if(S.date){
  var el=document.getElementById('cd'),lb=document.getElementById('cdLabel');
  var target=new Date(S.date+'T00:00:00');
  function tick(){
    var diff=target-new Date(),past=diff<0;diff=Math.abs(diff);
    var d=Math.floor(diff/864e5),h=Math.floor(diff/36e5)%24,m=Math.floor(diff/6e4)%60,s=Math.floor(diff/1e3)%60;
    lb.textContent=(S.label||(past?'Time since our special day':'Counting down'))+(past?' ⏳':' ⏳');
    el.innerHTML=[[d,'days'],[h,'hours'],[m,'mins'],[s,'secs']].map(function(x){return '<div><b>'+x[0]+'</b><small>'+x[1]+'</small></div>'}).join('');
  }
  tick();setInterval(tick,1000);
}
// confetti
var cv=document.getElementById('confetti'),cx=cv.getContext('2d'),parts=[];
function size(){cv.width=innerWidth;cv.height=innerHeight}size();addEventListener('resize',size);
function boom(){
  for(var i=0;i<140;i++)parts.push({x:innerWidth/2,y:innerHeight/2,vx:(Math.random()-.5)*16,vy:Math.random()*-14-4,c:'hsl('+Math.random()*360+',90%,60%)',r:4+Math.random()*5,l:120});
  (function loop(){
    cx.clearRect(0,0,cv.width,cv.height);
    parts=parts.filter(function(p){return p.l-->0});
    parts.forEach(function(p){p.x+=p.vx;p.y+=p.vy;p.vy+=.35;cx.fillStyle=p.c;cx.fillRect(p.x,p.y,p.r,p.r*1.6)});
    if(parts.length)requestAnimationFrame(loop);
  })();
}
var op=document.getElementById('open'),md=document.getElementById('modal');
if(op){op.onclick=function(){md.classList.add('open');boom()};document.getElementById('close').onclick=function(){md.classList.remove('open')}}
})();
</script>
</body></html>`;
  }

  window.PS = { esc, OCCASIONS, TEMPLATES, renderSite };
})();
