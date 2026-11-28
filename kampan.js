// 1.0-3: Dobrodružství — příběhová kampaň „Falešné stříbro“ (server kampan.py). Načítá se před hra.js;
// používá jeho pomocníky (h, esc, call, go, IMG_BASE, chatRebuild, chatHtml, wireChat, Zvuk, toast) až při běhu.
"use strict";
const KAMP = { st: null, timer: null, v: -1, busy: false, pick: { vahy: null, cil: 0, kus: null }, anim: null, posledniLog: 0, zvuk: {} };

function kmd(t) {          // **tučně**, *kurzíva*, odstavce; 1.0-3-30: přímá řeč „…“ zvýrazněná
  return esc(t || "").replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/\*(.+?)\*/g, "<i>$1</i>")
    .replace(/„([^“]{1,400})“/g, '<q class="kp-rec">$1</q>')
    .split(/\n{2,}/).map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`).join("");
}

// 1.0-3-30: pergamen — deník scény rozdělený na kroky (každá volba začíná nový). Poslední krok je nahoře a celý,
// starší jsou sbalené pod ním, ať se nemusí rolovat.
function kpDenik(log) {
  const kroky = [[]];
  let pred = null;
  for (const x of log || []) {
    const novy = x.volba || (!x.hod && pred && !pred.volba && !pred.hod);   // volba, nebo další vyprávění po minihře / boji
    if (novy && kroky[kroky.length - 1].length) kroky.push([]);
    kroky[kroky.length - 1].push(x);
    pred = x;
  }
  const radek = (x) => x.hod ? `<div class="kp-hod">${esc(x.t)}</div>` : x.volba ? `<div class="kp-txt volba">${esc(x.t)}</div>`
    : `<div class="kp-txt">${kmd(x.t)}</div>`;
  const posl = kroky.pop();
  const novy = `<div class="kp-krok novy">${posl.map(radek).join("")}</div>`;
  const stare = kroky.length ? `<details class="kp-drive"><summary>📜 Dříve v této scéně (${kroky.length})</summary>${kroky.map((k) => `<div class="kp-krok">${k.map(radek).join("")}</div>`).join("")}</details>` : "";
  return novy + stare;
}
function kobr(o) { return o ? `${IMG_BASE}${o}.webp` : ""; }

async function kampanView(view) {
  clearInterval(KAMP.timer); KAMP.v = -1; cancelAnimationFrame(KAMP.anim || 0);
  view.replaceChildren(h(`<div class="kp" id="kp"><div class="empty">…</div></div>`));
  await kampanNacti();
  KAMP.timer = setInterval(() => { if (S.tab !== "kampan") { clearInterval(KAMP.timer); cancelAnimationFrame(KAMP.anim || 0); return; } if (!KAMP.busy) kampanNacti(true); }, 1500);
}

async function kampanNacti(quiet = false) {
  try { KAMP.st = (await call("kampan", {}, quiet)).kampan; } catch { return; }
  if (S.tab === "kampan") kampanKresli();
}

async function kampanAkce(op, data = {}) {
  if (KAMP.busy) return;
  KAMP.busy = true;
  try {
    const r = await call(op, data);
    KAMP.st = r.kampan;
    if (r.info) toast(r.info);
  } catch { /* toast už ukázal chybu */ } finally { KAMP.busy = false; }
  kampanKresli();
}

function kampanKresli() {
  const box = document.getElementById("kp"), s = KAMP.st;
  if (!box || !s) return;
  if (!s.smi) { box.replaceChildren(h(`<div class="panel"><h2>Dobrodružství</h2><p>Příběhová kampaň se ještě dokončuje. Brzy!</p><p><button class="btn" data-zpet>← Zpět</button></p></div>`)); wireKp(box); return; }
  const R = s.rel;
  let html;
  if (!R) html = kpUvod(s);
  else if (R.stav === "lobby") html = kpLobby(s, R);
  else if (R.stav === "konec") html = kpKonec(s, R);
  else html = kpHra(s, R);
  if (!chatRebuild(box, html, R && R.chat ? { ["kampan:" + R.id]: R.chat } : {})) return;
  wireKp(box);
  if (R && R.chat) wireChat(box, () => kampanNacti(true));
  if (R && R.mini) kpMiniPo(box, R.mini);
  const log = box.querySelector(".kp-log");
  if (log && R && R.v !== KAMP.v) { log.scrollTop = 0; }
  if (R && R.v !== KAMP.v) { kpZvuky(R); KAMP.v = R.v; }
}

function kpZvuky(R) {
  const n = (R.log || []).length, last = (R.log || [])[n - 1];
  if (KAMP.posledniScena !== R.scena) { KAMP.posledniScena = R.scena; Zvuk.sfx("stranka"); }
  else if (last && last.hod && KAMP.posledniLog !== n) Zvuk.sfx("kostky");
  KAMP.posledniLog = n;
}

// ------------------------------------------------------------------ úvod (bez relace)
function kpUvod(s) {
  const poz = (s.pozvanky || []).map((p) => `<div class="kp-pozvanka"><span>📜 <b>${esc(p.vudce)}</b> tě zve do skupiny${p.clenove.length > 1 ? " (" + esc(p.clenove.join(", ")) + ")" : ""}.</span>
    <span class="row"><button class="btn small primary" data-kp="kampan_odpoved" data-rid="${esc(p.id)}" data-ano="1">Přidat se</button><button class="btn small" data-kp="kampan_odpoved" data-rid="${esc(p.id)}" data-ano="0">Odmítnout</button></span></div>`).join("");
  const kron = (s.kroniky || []).map((k) => `<div class="panel kp-kronika"><h3>📖 Tvoje kronika — kapitola ${k.faze}: ${esc(k.nazev)}</h3><ul>${k.kronika.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>`).join("");
  const nf = s.dalsi_faze;
  const kap = (s.kapitoly || []).map((k) => `<li class="kp-kap${k.hotovo ? " hotovo" : ""}${k.odemceno ? "" : " zamceno"}"><b>Kapitola ${k.n}</b> — ${esc(k.nazev)}
      <small>${k.hotovo ? "✔ odehráno" : k.odemceno ? (nf && nf.faze === k.n ? "▶ na řadě" : "odemčeno") : "🔒 odemkne se " + esc(k.kdy)}</small></li>`).join("")
    + `<li class="kp-kap zamceno"><b>Další kapitoly</b> <small>připravují se — každý den jedna</small></li>`;
  const admin = s.admin ? `<div class="panel kp-admin"><h3>⚙ Testeři dobrodružství</h3><p class="muted small">Dokud není dobrodružství pro všechny, vidí ho jen správce, zkušební postava a tihle testeři: <b>${esc((s.testeri || []).join(", ") || "nikdo")}</b></p>
    <form class="row" data-tester><input name="jm" placeholder="jméno postavy" required><button class="btn small" name="p" value="1">Přidat</button><button class="btn small" name="p" value="0">Odebrat</button></form></div>` : "";
  return `<div class="kp-uvod" style="--obr:url('${kobr("pribehy/pribeh-klaster")}')"><div class="kp-uvod-text"><small>Dobrodružství 1</small><h2>${esc(s.dil || "Falešné stříbro")}</h2>
      <p>V Kutné Hoře se objevují groše, které nezvoní — měď pod tenkou vrstvou stříbra. A jeden z nich máš i ty v měšci.</p>
      <p class="muted small">Příběh na pokračování: rozhovory, hádanky, minihry a volby s následky pro tvou postavu (vztahy ve městě, pověst, ceny). Hraje se sám, nebo ve skupině — o všem se hlasuje, rozhoduje vůdce. Od ${s.min_uroven}. úrovně, každá kapitola jednou za postavu a navazuje na předchozí.</p>
      <ol class="kp-kapitoly">${kap}</ol>
      ${!nf ? `<p><b>Všechny připravené kapitoly máš odehrané.</b> Další přibude brzy.</p>` : !nf.odemceno ? `<p><b>Kapitola ${nf.faze} — ${esc(nf.nazev)}</b> se odemkne ${esc(nf.kdy)}.</p>`
        : `${nf.faze > 1 ? `<p><b>Kapitola ${nf.faze}: ${esc(nf.nazev)}</b> — navazuje na tvoje rozhodnutí z minulé kapitoly. Do skupiny můžeš pozvat ty, kdo mají odehranou kapitolu ${nf.faze - 1}.</p>` : ""}
        <p class="row"><button class="btn primary" data-kp="kampan_zalozit" data-solo="1">▶ Hrát sám — kapitola ${nf.faze}</button><button class="btn" data-kp="kampan_zalozit" data-solo="0">👥 Založit skupinu</button></p>`}
    </div></div>${poz}${kron}${admin}<p><button class="btn" data-zpet>← Na bránu</button></p>`;
}

// ------------------------------------------------------------------ předsíň skupiny
function kpClenove(R) {
  return `<div class="kp-clenove">${R.clenove.map((c) => `<span class="kp-clen${c.ja ? " ja" : ""}" style="--b:${c.barva}"><i></i>${c.vudce ? "👑 " : ""}${esc(c.jm)}</span>`).join("")}</div>`;
}
function kpLobby(s, R) {
  const kand = (s.kandidati || []).map((n) => `<option value="${esc(n)}">`).join("");
  return `<div class="panel kp-lobby"><h2>👥 Skupina se schází</h2>${kpClenove(R)}
    ${R.pozvani && R.pozvani.length ? `<p class="muted small">⏳ Pozvaní: ${esc(R.pozvani.join(", "))}</p>` : ""}
    ${R.vudce ? `<form class="row kp-pozvat" data-pozvat><input name="jm" list="kp-kand" placeholder="jméno postavy" required><datalist id="kp-kand">${kand}</datalist><button class="btn small">Pozvat</button></form>
      <p class="muted small">Po vyražení už se nikdo nepřidá. O každé volbě se hlasuje, rozhoduje vůdce. Každý má svou barvu.</p>
      <p class="row"><button class="btn primary" data-kp="kampan_vyrazit">▶ Vyrazit${R.clenove.length === 1 ? " (sám)" : ""}</button><button class="btn" data-kp="kampan_odejit">Rozpustit</button></p>`
      : `<p class="muted">Čeká se, až vůdce vyrazí.</p><p><button class="btn" data-kp="kampan_odejit">Odejít ze skupiny</button></p>`}
    ${R.chat ? chatHtml("kampan:" + R.id, R.chat) : ""}</div>`;
}

// ------------------------------------------------------------------ konec kapitoly
function kpKonec(s, R) {
  const o = R.odmena || {};
  return `<div class="kp-hra">${kpHlava(R)}<div class="panel kp-konec"><div class="kp-log">${R.log.slice(-3).map((x) => `<div class="kp-txt">${kmd(x.t)}</div>`).join("")}</div>
    <h3>📖 Kronika kapitoly</h3><ul>${(R.kronika || []).map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
    <p class="kp-odmena">Odměna: <b>${o.zk || 0} ZK</b> a <b>${o.gr || 0} gr.</b> pro každého.${R.dalsi ? "" : " Další kapitola se připravuje."}</p>
    <p class="row">${R.dalsi ? (!R.dalsi.odemceno ? `<span class="muted">Kapitola ${R.dalsi.faze} — ${esc(R.dalsi.nazev)} se odemkne ${esc(R.dalsi.kdy)}.</span>`
      : R.vudce ? `<button class="btn primary" data-kp="kampan_pokracovat">▶ Pokračovat: kapitola ${R.dalsi.faze} — ${esc(R.dalsi.nazev)}</button>` : `<span class="muted">Na pokračování kapitolou ${R.dalsi.faze} rozhoduje vůdce.</span>`) : ""}
      <button class="btn${R.dalsi && R.dalsi.odemceno ? "" : " primary"}" data-kp="kampan_ukoncit">${R.dalsi && R.dalsi.odemceno ? "Teď ne, dohraju později" : "Zavřít kroniku"}</button></p></div></div>`;
}

// ------------------------------------------------------------------ hra
function kpHlava(R) {
  return `<div class="kp-hlava" style="--obr:url('${kobr(R.obr)}')"><div><small>Dobrodružství 1: ${esc(R.dil)} · kapitola ${R.faze}: ${esc(R.faze_nazev)}</small>
    <h2>${R.scena_c ? R.scena_c + "/" + R.scen + " · " : ""}${esc(R.scena_nazev || "")}</h2></div>${R.solo ? "" : kpClenove(R)}</div>`;
}

function kpHra(s, R) {
  const log = kpDenik(R.log);
  let akce = "";
  if (R.mini) akce = kpMini(R, R.mini);
  else if (R.boj) akce = kpBoj(R, R.boj);
  else akce = kpVolby(R);
  const nal = (R.nalezy || []).length ? `<div class="kp-nalezy">${R.nalezy.map((n) => `<span>${esc(n)}</span>`).join("")}</div>` : "";
  return `<div class="kp-hra">${kpHlava(R)}${R.zprava ? `<p class="kp-zprava">${esc(R.zprava)}</p>` : ""}
    <div class="kp-telo${R.mini || R.boj ? " s-mini" : ""}"><div class="kp-log">${log}</div><div class="kp-akce">${akce}</div></div>
    ${nal}${R.chat ? chatHtml("kampan:" + R.id, R.chat) : ""}
    <p class="row kp-paticka"><button class="btn small" data-zpet>← Na bránu</button><button class="btn small" data-kp="kampan_odejit" data-potvrd="${R.solo ? "Opravdu skončit? Rozehrané dobrodružství se zahodí." : "Odejít ze skupiny? Zpátky se už nepřidáš."}">${R.solo ? "Skončit" : "Odejít ze skupiny"}</button></p></div>`;
}

function kpVolby(R) {
  const vudce = R.clenove.find((c) => c.vudce);
  const tecky = (i) => R.clenove.filter((c) => c.hlas === i).map((c) => `<i class="kp-hlas" style="--b:${c.barva}" title="${esc(c.jm)}"></i>`).join("");
  const btn = (v) => `<button class="kp-volba${v.ok ? "" : " sedy"}" data-volba="${v.i}"${v.ok ? "" : " disabled"}>
      <span>${esc(v.t)}</span>${v.hod ? `<small>🎲 ${esc(v.hod.attr)} · ${esc(v.hod.obtiznost || "")}</small>` : ""}${v.cena ? `<small>🪙 ${v.cena} gr.</small>` : ""}${v.proc ? `<small>${esc(v.proc)}</small>` : ""}
      <span class="kp-tecky">${R.solo ? "" : tecky(v.i)}</span></button>`;
  return `<div class="kp-volby">${(R.volby || []).map(btn).join("")}</div>
    ${!R.solo ? `<p class="muted small">${R.vudce ? "👑 Rozhoduješ ty — ostatní vidíš podle barevných teček." : `Tvůj klik je hlas — rozhoduje ${esc(vudce ? vudce.jm : "vůdce")}.`}</p>` : ""}`;
}

// ------------------------------------------------------------------ minihry
function kpCas(M) { return M.zbyva != null ? `<span class="kp-cas${M.zbyva < 15 ? " malo" : ""}">⏳ ${M.zbyva} s</span>` : ""; }

function kpMini(R, M) {
  const hl = `<div class="kp-mini-hl"><b>${esc(M.nazev)}</b>${kpCas(M)}</div><p class="kp-navod">${esc(M.navod)}</p>`;
  const log = M.log && M.log.length ? `<ul class="kp-mini-log">${M.log.slice(-4).map((x) => `<li>${kmd(x).replace(/<\/?p>/g, "")}</li>`).join("")}</ul>` : "";
  const f = { zvoneni: kpZvoneni, vahy: kpVahy, paceni: kpPaceni, prohledavani: kpPokoj, vyhen: kpVyhen, ulice: kpUlice, stavidla: kpStavidla, skladacka: kpSkladacka, vyslech: kpVyslech, sifra: kpSifra, plizeni: kpPlizeni }[M.typ];
  return `<div class="kp-mini kp-${M.typ}">${hl}${f ? f(R, M) : ""}${log}</div>`;
}

function kpZvoneni(R, M) {
  const g = M["groše"].map((z, i) => `<button class="kp-gros${z ? " " + z : ""}" data-mini='{"gros":${i}}'${M.nasel ? " disabled" : ""}>
      <img alt="" src="${kobr("predmety/ikony/sberatelsky-gros")}"><span>${z === "tupe" ? "ťuk…" : z === "jasne" ? "cink!" : ""}</span></button>`).join("");
  const ost = (M.ostatni || []).map((o) => `<span class="kp-ost${o.nasel ? " ok" : ""}">${esc(o.jm)} ${o.nasel ? "✔" : "…"}</span>`).join("");
  return `<div class="kp-grose">${g}</div><p class="muted small">${M.nasel ? (M.minul ? "Kupec ti mince sebral — falešný jsi nenašel." : "Ten tvůj je měděný.") + " Čeká se na ostatní." : `Zbývá klepnutí: <b>${M.klep}</b> — víc ti jich nedovolí.`}</p>`
    + `${ost ? `<div class="kp-ostatni">${ost}</div>` : ""}`;
}

function kpVahy(R, M) {
  const naMisce = (s) => M.misky[s] || [];
  const posledni = M.vazeni[M.vazeni.length - 1];
  const naklon = M.misky.l.length || M.misky.r.length ? 0 : posledni ? -posledni.vys * 9 : 0;   // levá těžší → levá dolů
  const mince = (i, mala) => `<img class="kp-m${mala ? " mala" : ""}" alt="" src="${kobr("predmety/ikony/sberatelsky-gros")}"><b>${i + 1}</b>`;
  const misku = (s) => `<div class="kp-miska ${s}">${naMisce(s).map((i) => `<button class="kp-mince" data-vg="${i}">${mince(i, true)}</button>`).join("")}</div>`;
  const tray = [...Array(M.grosu).keys()].filter((i) => !M.misky.l.includes(i) && !M.misky.r.includes(i)).map((i) => {
    const zn = (M.znacky[i] || []).map((z) => `<i class="kp-zn ${z.s}" title="${z.k + 1}. vážení: ${z.s === "l" ? "levá" : "pravá"}"></i>`).join("");
    return `<button class="kp-mince${KAMP.pick.vahy === i ? " vybrana" : ""}" data-vg="${i}">${mince(i)}<span class="kp-zns">${zn}</span></button>`;
  }).join("");
  const hist = M.vazeni.map((v, k) => `<li>${k + 1}. ${v.l.map((x) => x + 1).join(",")} ⚖ ${v.r.map((x) => x + 1).join(",")} — ${v.vys === 1 ? "levá klesla" : v.vys === -1 ? "pravá klesla" : "rovnováha"}</li>`).join("");
  const ja = M.tah;
  return `<div class="kp-vahy-scena"><svg class="kp-vahy-svg" viewBox="0 0 400 210">
      <rect x="190" y="40" width="20" height="150" rx="4" fill="#7a5a2a"/><rect x="140" y="186" width="120" height="16" rx="4" fill="#5b3e1c"/>
      <g style="transform:rotate(${naklon}deg);transform-origin:200px 44px;transition:transform .8s cubic-bezier(.3,1.6,.5,1)">
        <rect x="40" y="38" width="320" height="10" rx="5" fill="#c9a24a"/><circle cx="200" cy="43" r="10" fill="#e0bd62"/>
        <line x1="60" y1="46" x2="40" y2="120" stroke="#8a7240" stroke-width="2"/><line x1="60" y1="46" x2="80" y2="120" stroke="#8a7240" stroke-width="2"/>
        <line x1="340" y1="46" x2="320" y2="120" stroke="#8a7240" stroke-width="2"/><line x1="340" y1="46" x2="360" y2="120" stroke="#8a7240" stroke-width="2"/>
        <ellipse cx="60" cy="122" rx="40" ry="9" fill="#b8913c"/><ellipse cx="340" cy="122" rx="40" ry="9" fill="#b8913c"/>
      </g></svg>
      <div class="kp-misky" style="--nl:${naklon}deg">${misku("l")}${misku("r")}</div></div>
    <div class="kp-tray">${tray}</div>
    <p class="kp-vahy-stav">${ja ? `<b>Jsi na tahu.</b> Klepni na groš a pak na misku (nebo ho přetáhni). ` : `Na tahu je <b>${esc(M.tah_jm)}</b>. `}Vážení ${M.vazeni.length}/${M.max}. Falešný může být lehčí i těžší.${M.napoveda ? ` <span class="muted">Nápověda: ${esc(M.napoveda)}</span>` : ""}</p>
    ${ja ? `<p class="row"><button class="btn small" data-vmis="l">← Na levou</button><button class="btn small" data-vmis="r">Na pravou →</button><button class="btn small" data-vmis="x">Zpět na pult</button>
      <button class="btn small primary" data-mini='{"vazit":1}'${M.misky.l.length && M.misky.r.length && M.vazeni.length < M.max ? "" : " disabled"}>⚖ Vážit</button>
      <button class="btn small" data-vukaz${M.vazeni.length && KAMP.pick.vahy != null && !M.misky.l.includes(KAMP.pick.vahy) && !M.misky.r.includes(KAMP.pick.vahy) ? "" : " disabled"}>👉 Falešný a lehčí${KAMP.pick.vahy != null ? " (č. " + (KAMP.pick.vahy + 1) + ")" : ""}</button>
      <button class="btn small" data-vukaz="tezsi"${M.vazeni.length && KAMP.pick.vahy != null && !M.misky.l.includes(KAMP.pick.vahy) && !M.misky.r.includes(KAMP.pick.vahy) ? "" : " disabled"}>👉 Falešný a těžší</button></p>` : ""}
    ${hist ? `<ol class="kp-hist">${hist}</ol>` : ""}`;
}

function kpPaceni(R, M) {
  const volny = M.koliky.findIndex((x) => !x.drzi);
  const k = M.koliky.map((x, i) => `<div class="kp-kolik${x.drzi ? " drzi" : ""}${i === volny ? " aktivni" : ""}" data-kol="${i}"><div class="kp-dra"><i class="kp-uchyt" style="left:${x.a}%;width:${x.b - x.a}%"></i>${i === volny ? `<i class="kp-jaz"></i>` : `<i class="kp-jaz klid" style="left:${x.drzi ? (x.a + x.b) / 2 : 0}%"></i>`}</div>
      <small>kolík ${i + 1} ${x.drzi ? "✔ drží" : ""}</small></div>`).join("");
  const ticho = [...Array(M.ticho_max || 3).keys()].map((i) => `<i class="${i < M.ticho ? "on" : ""}"></i>`).join("");
  return `<div class="kp-zamek" style="--obr:url('${kobr("kampan/kp-chodba-noc")}')"><div class="kp-ticho">Ticho ${ticho}</div>${k}</div>
    <p>${M.tah ? `<b>Jsi na tahu.</b> Zvedni kolík ${volny + 1} — klepni na <b>Pustit</b>, když je jazýček ve světlém úchytu.` : `Kolík zvedá <b>${esc(M.tah_jm)}</b>…`}</p>
    ${M.tah ? `<p><button class="btn primary kp-pustit" data-pustit="${volny}">🔓 Pustit</button></p>` : ""}`;
}

function kpPokoj(R, M) {
  const m = M.mista.map((x) => `<button class="kp-misto${x.prohledano ? " hotovo" : ""}${x.moje ? "" : " cizi"}" style="left:${x.x}%;top:${x.y}%" data-mini='{"misto":"${x.id}"}'${x.prohledano || !x.moje || !M.tahy ? " disabled" : ""}><i></i><span>${esc(x.jm)}</span></button>`).join("");
  const ost = (M.ostatni || []).map((o) => `<span class="kp-ost">${esc(o.jm)}: ${o.tahy} tahy</span>`).join("");
  return `<div class="kp-pokoj${M.kroky ? " kroky" : ""}" style="--obr:url('${kobr(M.obr || "kampan/kp-pokoj-ulrich")}')">${m}${M.kroky ? `<div class="kp-kroky">👣 Kroky na schodech!</div>` : ""}</div>
    <p class="row">Zbývá tahů: <b>${M.tahy}</b>${M.schovan ? " · 🫣 schovaný" : ""}
      <button class="btn small" data-mini='{"schovat":1}'${M.tahy && !M.schovan ? "" : " disabled"}>🫣 Schovat se (1 tah)</button>
      <button class="btn small" data-mini='{"hotovo":1}'${M.tahy ? "" : " disabled"}>Dost hledání</button></p>${ost ? `<div class="kp-ostatni">${ost}</div>` : ""}`;
}

function kpVyhen(R, M) {
  const role = M.role || [];
  const barva = (p) => p == null ? "#333" : p < 35 ? "#5a1a10" : p < 58 ? "#b2321a" : p <= 82 ? "#f3c232" : "#fff6d8";
  const zar = M.zar == null ? `<div class="kp-skryto">žár vidí ${esc(M.kdo.mech || "")}</div>` : `<div class="kp-zar"><i class="pas"></i><i class="hod" style="height:${M.zar}%"></i></div><small>žár ${M.zar}</small>`;
  const pruh = M.pruh == null ? `<div class="kp-skryto">železo vidí ${esc(M.kdo.kladivo || "")}</div>` : `<div class="kp-pruh" style="--c:${barva(M.pruh)}"></div><small>${M.pruh < (M.od || 62) ? "studené" : M.pruh <= (M.do || 78) ? "žluté — bij!" : "přehřáté"}</small>`;
  const tl = [];
  if (role.includes("mech")) tl.push(`<span class="row">Měch${M.zvoleno.mech ? " ✔" : ""}: <button class="btn small" data-mini='{"mech":"silne"}'>💨 Silně</button><button class="btn small" data-mini='{"mech":"slabe"}'>Slabě</button><button class="btn small" data-mini='{"mech":"nic"}'>Nechat</button></span>`);
  if (role.includes("kladivo")) tl.push(`<span class="row">Kladivo${M.zvoleno.kladivo ? " ✔" : ""}: <button class="btn small primary" data-mini='{"kladivo":"uder"}'>🔨 Udeřit</button><button class="btn small" data-mini='{"kladivo":"cekat"}'>Počkat</button></span>`);
  if (role.includes("uhli")) tl.push(`<span class="row">Uhlí: <button class="btn small" data-mini='{"uhli":1}'>⚫ Přiložit</button></span>`);
  return `<div class="kp-vyhen-scena" style="--obr:url('${kobr("kampan/kp-vyhen")}')"><div class="kp-vy-sl">${zar}</div><div class="kp-vy-kov">${pruh}</div>
      <div class="kp-vy-stav">Kolo ${M.kolo + 1}/${M.max_kol} · dobré rány <b>${M.dobre}/5</b> · uhlí ${M.uhli}</div></div>
    ${tl.length ? `<div class="kp-vy-tl">${tl.join("")}</div>` : `<p class="muted">Měch: ${esc(M.kdo.mech || "")} · kladivo: ${esc(M.kdo.kladivo || "")}</p>`}`;
}

function kpUlice(R, M) {
  const ja = (M.hraci || []).find((x) => x.ja) || { p: [0, 0] };
  const vidi = new Set((M.vidi || []).map((p) => p.join(",")));
  const H = M.mapa.length, W = M.mapa[0].length;
  const dosah = (x, y) => Math.abs(x - ja.p[0]) + Math.abs(y - ja.p[1]) <= 2;
  let cells = "";
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const c = M.mapa[y][x], k = x + "," + y;
    const kdo = M.hraci.filter((p) => p.p[0] === x && p.p[1] === y).map((p) => `<i class="kp-fig" style="--b:${p.barva}" title="${esc(p.jm)}"></i>`).join("");
    const vojta = M.vojta && M.vojta[0] === x && M.vojta[1] === y ? `<i class="kp-vojta${M.otoceny ? " otoceny" : ""}" title="Vojta">V</i>` : "";
    const muj = M.muj_tah && M.muj_tah[0] === x && M.muj_tah[1] === y;
    const lze = c !== "#" && dosah(x, y);
    cells += `<button class="kp-pole p-${c === "#" ? "dum" : c === "u" ? "ukryt" : c === "B" ? "brana" : "ulice"}${vidi.has(k) ? " videno" : ""}${M.cil && M.cil[0] === x && M.cil[1] === y ? " cil" : ""}${muj ? " muj" : ""}${lze ? " lze" : ""}" data-pole="${x},${y}"${lze ? "" : " disabled"}>${c === "u" ? "<s class=\"sud\"></s>" : c === "B" ? "<s class=\"brana\">brána</s>" : ""}${vojta}${kdo}</button>`;
  }
  const vedle = M.vojta && M.hraci.some((p) => Math.abs(p.p[0] - M.vojta[0]) + Math.abs(p.p[1] - M.vojta[1]) <= 1);
  const oko = `<span class="kp-oko">${[0, 1].map((i) => `<i class="${i < M.oko ? "on" : ""}"></i>`).join("")}</span>`;
  return `<div class="kp-mesto" style="--w:${W};--obr:url('${kobr("kampan/kp-ctvrt-mapa")}')">${cells}</div>
    <p class="row">Podezření ${oko} ${M.muj_tah ? "· tah zadán, čeká se na ostatní" : "· klepni na pole, kam jdeš (nejvýš 2 po ulici)"}
      ${vedle ? `<button class="btn small primary" data-mini='{"chytit":1}'>✋ Chytit ho!</button>` : ""}</p>
    ${!M.vojta ? `<p class="muted small">Vojtu teď nevidíš — je moc daleko!</p>` : ""}`;
}

// 1.0-3-19: stavidla — šachta, odvodní štola, potok; každý tah jedno ovládání
function kpStavidla(R, M) {
  const hlad = (v, max) => `<i class="kp-voda" style="height:${Math.min(100, Math.round(100 * v / max))}%"></i>`;
  const brana = (k, x) => `<div class="kp-st-brana ${M.otevreno[k] ? "otev" : "zav"}" style="left:${x}%"><b>${M.otevreno[k] ? "▲" : "▬"}</b><small>${esc({ nahon: "náhon", sachta: "šachta", potok: "potok" }[k])}</small></div>`;
  const jm = { nahon: "Náhon", sachta: "Šachta → štola", potok: "Štola → potok", rumpal: "Rumpál" };
  const tl = (M.moje || []).map((o) => o === "rumpal" ? `<button class="btn small" data-mini='{"akce":"rumpal"}'>⚙ Točit rumpálem</button>`
    : `<button class="btn small${M.otevreno[o] ? "" : " primary"}" data-mini='{"akce":"${o}"}'>${M.otevreno[o] ? "Zavřít" : "Otevřít"}: ${esc(jm[o])}</button>`).join("");
  return `<div class="kp-stavidla" style="--obr:url('${kobr("vypravy/kanek-04")}')">
      <div class="kp-st-nadrz sachta"><span>Šachta</span>${hlad(M.S, 10)}<b>${M.S}</b></div>
      <div class="kp-st-nadrz stola${M.O >= M.O_max ? " plna" : ""}"><span>Odvodní štola (havíři)</span>${hlad(M.O, M.O_max)}<b>${M.O}/${M.O_max}</b></div>
      ${brana("nahon", 8)}${brana("sachta", 40)}${brana("potok", 74)}</div>
    <p class="row">Tah ${M.kolo + 1}/${M.max} · přetečení k havířům: <b>${M.pretekl}</b>${M.pretekl ? " ⚠" : ""}</p>
    ${M.zvolil ? `<p class="muted">Tah zadán${M.ceka.length ? " — čeká se na: " + esc(M.ceka.join(", ")) : ""}.</p>`
      : tl ? `<p class="row">${tl}<button class="btn small" data-mini='{"akce":"nic"}'>Počkat</button></p>` : ""}
    ${R.solo ? "" : `<p class="muted small">${Object.entries(M.kdo).map(([o, j]) => esc(jm[o]) + ": " + esc(j)).join(" · ")}</p>`}`;
}

// 1.0-3-19: skládačka — kusy dopisu na pult a do mřížky
function kpSkladacka(R, M) {
  const kus = (k, kde) => k.shoreno ? `<span class="kp-kus shoreno">— spáleno —</span>`
    : `<button class="kp-kus${k.moje ? "" : " cizi"}${KAMP.pick.kus === k.i ? " vybrany" : ""}" data-kus="${k.i}" data-kde="${kde}"${k.moje ? "" : " disabled"}>${k.t ? esc(k.t) : `<i>kus drží ${esc(k.kdo)}</i>`}</button>`;
  const sloty = M.sloty.map((k, j) => `<div class="kp-slot${k ? "" : " prazdny"}" data-slot="${j}">${k ? kus(k, "slot") : `<span>${j + 1}</span>`}</div>`).join("");
  return `<div class="kp-skladacka" style="--sl:${M.sloupcu}">${sloty}</div>
    <div class="kp-pult">${M.pult.map((k) => kus(k, "pult")).join("") || `<span class="muted small">Všechny kusy leží na stole.</span>`}</div>
    <p class="row">Kontroly: <b>${M.kontroly}</b>${M.posledni != null ? ` · naposledy sedělo <b>${M.posledni}</b>` : ""}
      <button class="btn small primary" data-mini='{"kontrola":1}'${M.plno ? "" : " disabled"}>📜 Přečíst dopis</button></p>`;
}

// 1.0-3-22: výslech — otázky, odpovědi, tiky (vidí pozorovatel), soud „Lže / Věřím“
function kpVyslech(R, M) {
  const kola = M.kola.map((k) => `<li class="kp-vs-kolo"><b>„${esc(k.t)}“</b><span>${esc(M.kdo)}: „${esc(k.a)}“</span>
      ${k.tik ? `<em class="kp-tik">👁 ${esc(M.kdo)} ${esc(k.tik)}.</em>` : M.vidi_tik ? `<em class="kp-tik klid">👁 Klidný.</em>` : ""}
      ${k.soud ? `<small class="kp-soud ${k.soud}">${k.soud === "lez" ? "✋ Lže!" : "✔ Věříte"}</small>` : ""}</li>`).join("");
  const duv = [0, 1].map((i) => `<i class="${i < M.duvera ? "on" : ""}"></i>`).join("");
  let tl = "";
  if (M.tazatel && M.ceka_soud) tl = `<p class="row"><b>Lže?</b><button class="btn small primary" data-mini='{"soud":"lez"}'>✋ Lže!</button><button class="btn small" data-mini='{"soud":"pravda"}'>✔ Věřím</button></p>`;
  else if (M.tazatel) tl = `<div class="kp-vs-otazky">${M.otazky.map((q) => `<button class="kp-volba" data-mini='{"otazka":${q.i}}'><span>„${esc(q.t)}“</span></button>`).join("")}</div>`;
  else tl = `<p class="muted">Ptá se <b>${esc(M.role.tazatel)}</b>${M.vidi_tik ? " — ty sleduj tvář a řekni mu, kdy lže." : "."}</p>`;
  return `<div class="kp-vyslech"><div class="kp-vs-hl">${esc(M.kdo)} · otázka ${Math.min(M.kola.length + (M.ceka_soud ? 0 : 1), M.max)}/${M.max} · trpělivost <span class="kp-oko">${duv}</span></div>
    <ol class="kp-vs-kola">${kola}</ol>${tl}
    ${R.solo ? "" : `<p class="muted small">Ptá se ${esc(M.role.tazatel)}, tvář sleduje ${esc(M.role.pozorovatel)}.</p>`}</div>`;
}

// 1.0-3-22: šifra — značky, známý klíč, doplnit neznámé
function kpSifra(R, M) {
  const pis = "AÁBCČDĎEÉĚFGHIÍJKLMNŇOÓPRŘSŠTŤUÚŮVYÝZŽ".split("");
  const zn = M.znaky.map((x) => x.mezera ? `<span class="kp-si-mezera">${x.c === " " ? "" : esc(x.c)}</span>`
    : `<span class="kp-si-z${x.neznama ? " nez" : ""}"><i>${esc(x.z)}</i><b>${esc(x.c || x.tip || "·")}</b></span>`).join("");
  const nez = M.nezname.map((z) => `<label class="kp-si-vol"><i>${esc(z)}</i><select data-sifra="${esc(z)}"><option value="">?</option>${pis.map((c) => `<option${(M.znaky.find((x) => x.z === z) || {}).tip === c ? " selected" : ""}>${c}</option>`).join("")}</select></label>`).join("");
  const klic = M.muj_klic.map(([c, z]) => `<span><i>${esc(z)}</i>=${esc(c)}</span>`).join("");
  return `<div class="kp-sifra">${zn}</div>
    <p class="muted small">${R.solo ? "Klíč znáš skoro celý — doplň písmena k neznámým značkám podle slov, která už dávají smysl." : "Každý zná jen kus klíče (vidíš jen svá písmena). Řekněte si, co víte, a doplňte neznámé značky."}</p>
    ${R.solo ? "" : `<div class="kp-si-klic">Tvůj kus klíče: ${klic || "—"}</div>`}
    <div class="kp-si-nez">${nez}</div>
    <p class="row">Kontroly: <b>${M.kontroly}</b>${M.posledni != null ? ` · naposledy sedělo <b>${M.posledni}</b>` : ""}
      <button class="btn small primary" data-mini='{"kontrola":1}'${M.plno ? "" : " disabled"}>📜 Přečíst</button></p>`;
}

// 1.0-3-22: plížení — mřížka se strážemi a jejich pohledem v příštím kole
function kpPlizeni(R, M) {
  const ja = (M.hraci || []).find((x) => x.ja) || { p: [0, 0] };
  const vidi = new Set(M.vidi.map((p) => p.join(",")));
  const H = M.mapa.length, W = M.mapa[0].length;
  const sipka = { l: "◀", p: "▶", n: "▲", d: "▼" };
  let cells = "";
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const c = M.mapa[y][x], k = x + "," + y;
    const st = M.straze.find((s) => s.p[0] === x && s.p[1] === y);
    const kdo = M.hraci.filter((p) => p.p[0] === x && p.p[1] === y).map((p) => `<i class="kp-fig" style="--b:${p.barva}" title="${esc(p.jm)}"></i>`).join("");
    const lze = !M.doma && !M.muj_tah && c !== "#" && !st && Math.abs(x - ja.p[0]) + Math.abs(y - ja.p[1]) <= 1;
    const muj = M.muj_tah && M.muj_tah[0] === x && M.muj_tah[1] === y;
    cells += `<button class="kp-pole p-${c === "#" ? "dum" : c === "u" ? "ukryt" : "ulice"}${vidi.has(k) ? " videno" : ""}${M.cil[0] === x && M.cil[1] === y ? " cil" : ""}${muj ? " muj" : ""}${lze ? " lze" : ""}" data-pole="${x},${y}"${lze ? "" : " disabled"}>${c === "u" ? "<s class=\"sud\"></s>" : ""}${st ? `<i class="kp-straz">${sipka[st.smer]}</i>` : ""}${kdo}</button>`;
  }
  const pop = `<span class="kp-oko">${[0, 1].map((i) => `<i class="${i < M.poplach ? "on" : ""}"></i>`).join("")}</span>`;
  return `<div class="kp-mesto kp-tvrz" style="--w:${W}">${cells}</div>
    <p class="row">Poplach ${pop} · kolo ${M.kolo + 1}/${M.max} ${M.doma ? "· jsi u cíle, čekáš na ostatní" : M.muj_tah ? "· tah zadán" : "· šipky ukazují, kam se stráže dívají teď — po tahu se otočí podle své obchůzky"}</p>
    <p class="muted small">Červeně je, kam se stráže podívají po vašem tahu (šipka = směr). Ve stínu za sudy (▢) tě neuvidí.</p>`;
}

function kpBoj(R, B) {
  const nep = B.nep.map((e) => `<button class="kp-nep${e.hp <= 0 ? " padl" : ""}${KAMP.pick.cil === e.i ? " cil" : ""}" data-cil="${e.i}"${e.hp <= 0 ? " disabled" : ""}>${e.img ? `<span class="kp-nep-obr">${IMG(e.img)}</span>` : ""}<b>${e.boss ? "👑 " : ""}${esc(e.jm)}</b>${e.chysta ? `<em class="kp-chysta">⚠️ napřahuje se!</em>` : ""}
      <span class="kp-hp"><i style="width:${Math.round(100 * e.hp / e.max)}%"></i></span><small>${e.hp}/${e.max}</small></button>`).join("");
  const hr = B.hraci.map((p) => `<div class="kp-bh${p.hp <= 0 ? " padl" : ""}" style="--b:${p.barva}"><b>${esc(p.jm)}${p.zvolil ? " ✔" : ""}</b><span class="kp-hp ja"><i style="width:${Math.round(100 * p.hp / p.max)}%"></i></span><small>${p.hp <= 0 ? "omráčený" : p.hp + "/" + p.max}</small></div>`).join("");
  const padli = B.hraci.filter((p) => p.hp <= 0 && !p.ja);
  const tl = !B.stojim ? `<p class="muted">Jsi omráčený — někdo tě musí ošetřit.</p>` : B.zvolil ? `<p class="muted">Čeká se na ostatní…</p>` :
    `<p class="row"><button class="btn primary" data-boj="utok">⚔️ Útok</button><button class="btn" data-boj="silny">💥 Silný úder</button><button class="btn${B.nep.some((e) => e.chysta) ? " primary" : ""}" data-boj="kryti">🛡️ Krytí</button>${B.lek ? `<button class="btn" data-boj="lek" title="Použít z batohu">🧴 ${esc(B.lek)}</button>` : ""}
      ${padli.map((p) => `<button class="btn" data-boj="osetrit" data-komu="${esc(p.id)}">🩹 Ošetřit ${esc(p.jm)}</button>`).join("")}</p>`;
  return `<div class="kp-boj"><div class="kp-mini-hl"><b>⚔️ ${esc(B.nazev)} · kolo ${B.kolo}</b>${kpCas(B)}</div><div class="kp-nepratele">${nep}</div><div class="kp-hraci">${hr}</div>
    ${tl}<ul class="kp-mini-log">${B.log.slice(-5).map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>`;
}

// ------------------------------------------------------------------ obsluha
function wireKp(box) {
  box.querySelectorAll("[data-zpet]").forEach((b) => b.onclick = () => go("misto/brana"));
  box.querySelectorAll("[data-kp]").forEach((b) => b.onclick = () => {
    if (b.dataset.potvrd && !confirm(b.dataset.potvrd)) return;
    const d = {};
    if (b.dataset.solo != null) d.solo = b.dataset.solo === "1";
    if (b.dataset.rid) { d.rid = b.dataset.rid; d.ano = b.dataset.ano === "1"; }
    if (b.dataset.kp === "kampan_zalozit") Zvuk.sfx("dvere");
    kampanAkce(b.dataset.kp, d);
  });
  const fp = box.querySelector("[data-pozvat]");
  if (fp) fp.onsubmit = (ev) => { ev.preventDefault(); kampanAkce("kampan_pozvat", { jmeno: fp.jm.value }); };
  const ft = box.querySelector("[data-tester]");
  if (ft) ft.onsubmit = (ev) => { ev.preventDefault(); kampanAkce("kampan_tester", { jmeno: ft.jm.value, pridat: (ev.submitter || {}).value !== "0" }); };
  box.querySelectorAll("[data-volba]").forEach((b) => b.onclick = () => { Zvuk.sfx("klik"); kampanAkce("kampan_volba", { i: Number(b.dataset.volba) }); });
  box.querySelectorAll("[data-mini]").forEach((b) => b.onclick = () => {
    const d = JSON.parse(b.dataset.mini);
    if (d.gros != null) Zvuk.sfx("mince");
    if (d.kladivo === "uder") Zvuk.sfx("kovadlina");
    kampanAkce("kampan_mini", { data: d });
  });
  // váhy: výběr groše a miska
  box.querySelectorAll("[data-vg]").forEach((b) => b.onclick = () => { const i = Number(b.dataset.vg); KAMP.pick.vahy = KAMP.pick.vahy === i ? null : i; kampanKresli(); });
  box.querySelectorAll("[data-vmis]").forEach((b) => b.onclick = () => {
    if (KAMP.pick.vahy == null) { toast("Nejdřív klepni na groš."); return; }
    const i = KAMP.pick.vahy; KAMP.pick.vahy = null; Zvuk.sfx("mince");
    kampanAkce("kampan_mini", { data: { miska: b.dataset.vmis === "x" ? null : b.dataset.vmis, gros: i } });
  });
  box.querySelectorAll("[data-vukaz]").forEach((vuk) => vuk.onclick = () => { const i = KAMP.pick.vahy; KAMP.pick.vahy = null; kampanAkce("kampan_mini", { data: { ukazat: i, smer: vuk.dataset.vukaz === "tezsi" ? "tezsi" : "lehci" } }); });
  box.querySelectorAll("[data-pole]").forEach((b) => b.onclick = () => { const [x, y] = b.dataset.pole.split(",").map(Number); Zvuk.sfx("klik"); kampanAkce("kampan_mini", { data: { x, y } }); });
  box.querySelectorAll("[data-cil]").forEach((b) => b.onclick = () => { KAMP.pick.cil = Number(b.dataset.cil); kampanKresli(); });
  box.querySelectorAll("[data-boj]").forEach((b) => b.onclick = () => {
    const a = b.dataset.boj; Zvuk.sfx(a === "kryti" ? "odrazeno" : a === "osetrit" ? "klik" : "mec");
    kampanAkce("kampan_boj", { data: { akce: a, cil: a === "osetrit" ? b.dataset.komu : KAMP.pick.cil } });
  });
  // skládačka: klepnout na kus, pak na místo (klepnutí na položený kus ho vybere; druhé klepnutí na místo ho vrátí)
  box.querySelectorAll("[data-kus]").forEach((b) => b.onclick = (ev) => {
    ev.stopPropagation();
    const i = Number(b.dataset.kus);
    KAMP.pick.kus = KAMP.pick.kus === i ? null : i; Zvuk.sfx("stranka"); kampanKresli();
  });
  box.querySelectorAll("[data-slot]").forEach((sl) => sl.onclick = () => {
    const j = Number(sl.dataset.slot);
    if (KAMP.pick.kus == null) { if (!sl.classList.contains("prazdny")) kampanAkce("kampan_mini", { data: { zpet: j } }); return; }
    const i = KAMP.pick.kus; KAMP.pick.kus = null; Zvuk.sfx("klik");
    kampanAkce("kampan_mini", { data: { kus: i, slot: j } });
  });
  box.querySelectorAll("[data-sifra]").forEach((sel) => sel.onchange = () => kampanAkce("kampan_mini", { data: { znak: sel.dataset.sifra, pismeno: sel.value } }));
  const pus = box.querySelector("[data-pustit]");
  if (pus) pus.onclick = () => { const i = Number(pus.dataset.pustit); Zvuk.sfx("klik"); kampanAkce("kampan_mini", { data: { kolik: i, pos: kpJazPoz() } }); };
}

// páčení: jazýček jezdí tam a zpět (trojúhelníková vlna 2,4 s); pozice se čte při stisku
function kpJazPoz() { const t = (performance.now() % 2400) / 2400; return Math.round((t < 0.5 ? t * 2 : 2 - t * 2) * 1000) / 10; }
function kpMiniPo(box, M) {
  cancelAnimationFrame(KAMP.anim || 0);
  if (M.typ !== "paceni") return;
  const krok = () => {
    const p = kpJazPoz();
    box.querySelectorAll(".kp-jaz:not(.klid)").forEach((j) => { j.style.left = p + "%"; });
    KAMP.anim = requestAnimationFrame(krok);
  };
  krok();
}

function kpJeAdmin() { const el = document.querySelector('.tabs [data-tab="admin"]'); return !!el && !el.hidden; }
