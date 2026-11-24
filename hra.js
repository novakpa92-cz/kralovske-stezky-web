/* Královské stezky — webová hra (r26). Čistý JavaScript bez knihoven.
   Mluví se stejným API jako mobilní aplikace: POST {op, token, lang, ...} → {ok, ...}. */
"use strict";

const API = document.documentElement.dataset.api || "/api/v1";
const $ = (sel, el = document) => el.querySelector(sel);

// ------------------------------------------------------------------ texty CZ / EN
const T = {
  app_title: ["Královské stezky", "Royal Trails"],
  app_sub: ["Tahová hra z českého středověku", "A turn-based game of medieval Bohemia"],
  login_1: ["Na Discordu napiš příkaz <b>/aplikace</b>", "On Discord, type the command <b>/aplikace</b>"],
  login_2: ["Bot ti soukromě pošle šestimístný kód", "The bot privately sends you a six-character code"],
  login_3: ["Kód opiš sem", "Enter the code here"],
  login_note: ["Hraješ se stejnou postavou jako na Discordu — co uděláš tady, uvidíš i tam.",
    "You play the same character as on Discord — whatever you do here shows up there too."],
  code: ["Kód z Discordu", "Code from Discord"],
  login: ["Přihlásit", "Log in"],
  connecting: ["Připojuji…", "Connecting…"],
  net_error: ["Nepodařilo se spojit se serverem hry. Zkus to za chvíli.", "Could not reach the game server. Try again shortly."],
  bad_reply: ["Server odpověděl nesrozumitelně.", "The server sent an unreadable reply."],
  nav_hero: ["Postava", "Hero"], nav_bag: ["Batoh", "Bag"], nav_market: ["Trh", "Market"],
  nav_inn: ["Hostinec", "Inn"], nav_more: ["Více", "More"],
  coins: ["{0} gr.", "{0} gr."], level: ["Úr. {0}", "Lvl {0}"], level_long: ["Úroveň {0}", "Level {0}"],
  xp: ["Zkušenosti", "Experience"], health: ["Životy", "Health"], satiety: ["Sytost", "Satiety"],
  hydration: ["Napitost", "Thirst"], rest: ["Odpočatost", "Rest"], needs: ["Stav postavy", "Condition"],
  attributes: ["Vlastnosti", "Attributes"],
  unspent: ["Volné body k přidělení: {0} — přiděl je na Discordu.", "Unspent points: {0} — assign them on Discord."],
  combat: ["Boj", "Combat"], armor_class: ["Obrana (OČ)", "Armour class"], attack: ["Útok", "Attack"], damage: ["Zranění", "Damage"],
  origin: ["Původ", "Origin"], time: ["Herní čas", "Game time"], refresh: ["Obnovit", "Refresh"],
  no_char: ["Ještě nemáš postavu. Vytvoř si ji na Discordu v kanálu #úvod a pak tady klikni na Obnovit.",
    "You don't have a character yet. Create one on Discord in the #úvod channel, then click Refresh here."],
  on_raid: ["Jsi na výpravě — obchod a hry v hostinci počkají, až se vrátíš. Pokračovat ve výpravě můžeš i tady: Město → Brána.", "You're on an expedition — shops and inn games will wait until you return. Continue it here: Town → Gate."],
  equipped: ["Nasazeno", "Equipped"], backpack: ["Batoh a kapsy · {0}", "Backpack & pockets · {0}"],
  empty: ["Nic tu není.", "Nothing here."], all: ["Vše", "All"], search: ["Hledat…", "Search…"],
  equip: ["Nasadit", "Equip"], unequip: ["Sundat", "Remove"], use: ["Použít", "Use"], sell: ["Prodat", "Sell"], buy: ["Koupit", "Buy"],
  sold: ["Prodáno za {0} gr.", "Sold for {0} gr."], bought: ["Koupeno za {0} gr.", "Bought for {0} gr."],
  sell_q: ["Prodat {0} za {1}?", "Sell {0} for {1}?"],
  sell_to: ["vykoupí {0}", "{0} buys it"],
  restock: ["Nové zboží za {0}", "New stock in {0}"], hm: ["{0} h {1} min", "{0} h {1} min"], m: ["{0} min", "{0} min"],
  stock_note: ["Nabídka se mění každý herní den, jako na Discordu.", "Stock changes every game day, just like on Discord."],
  from_level: ["od úr. {0}", "level {0}+"], have: ["máš {0}", "you have {0}"], buys_for: ["vykoupí za {0}", "buys for {0}"],
  done: ["Hotovo.", "Done."], card_alt: ["Karta postavy", "Character card"],
  card_note: ["Stejná karta jako v kanálu Tvá postava na Discordu.", "The same card as in your character channel on Discord."],
  inn_title: ["Hostinec · hry s hostinským", "Inn · games with the innkeeper"],
  dice: ["Kostky", "Dice"], cards: ["Oko bere", "Twenty-one"], stake: ["Sázka", "Stake"], difficulty: ["Obtížnost", "Difficulty"],
  play: ["Hrát", "Play"],
  dice_rules: ["Šest kostek. Bodují jedničky (100), pětky (50), trojice (číslo × 100, jedničky 1000) a postupka 1–6 (2000). Odlož bodující kostky a házej dál, nebo body zapiš. Když nepadne nic bodujícího, body z tahu propadnou.",
    "Six dice. Ones score 100, fives 50, three of a kind = face × 100 (ones 1000), a 1–6 straight 2000. Set aside scoring dice and roll on, or bank your points. If nothing scores, the turn's points are lost."],
  cards_rules: ["Hodnoty: 7–10 podle čísla, spodek 2, svršek 3, král 4, eso 11. Cíl je 21, přes 21 prohráváš. Dvě esa jsou oko. Hostinský bere do 17.",
    "Values: 7–10 as shown, Under 2, Over 3, King 4, Ace 11. Aim for 21; over 21 loses. Two aces are \"oko\". The innkeeper draws to 17."],
  you: ["Ty", "You"], host: ["Hostinský", "Innkeeper"], target: ["cíl {0} b.", "target {0} pts"], points: ["{0} b.", "{0} pts"],
  turn_points: ["Body v tomto tahu: {0}", "Points this turn: {0}"], roll: ["🎲 Hodit ({0})", "🎲 Roll ({0})"],
  hold: ["Odložit a házet", "Set aside & roll on"], bank: ["Odložit a zapsat", "Set aside & bank"], bankonly: ["Zapsat body", "Bank points"],
  pick_best: ["Vybrat bodující", "Pick scoring"], pick_help: ["Klikni na kostky, které chceš odložit.", "Click the dice you want to set aside."],
  draw: ["Líznout", "Draw"], stand: ["Stát", "Stand"], forfeit: ["Vzdát se", "Give up"], again: ["Hrát znovu", "Play again"],
  value: ["{0} b.", "{0} pts"], last_result: ["Poslední hra", "Last game"],
  settings: ["Nastavení", "Settings"], language: ["Jazyk", "Language"],
  logout: ["Odhlásit tento prohlížeč", "Log out this browser"],
  delete: ["Smazat účet a postavu", "Delete account and character"],
  delete_help: ["Postava i propojení se trvale smažou (i na Discordu). Pro potvrzení napiš SMAZAT.",
    "Your character and link will be permanently deleted (on Discord too). Type SMAZAT to confirm."],
  delete_ok: ["Účet je smazaný.", "Your account has been deleted."],
  privacy: ["Zásady ochrany soukromí", "Privacy policy"], about: ["O hře", "About"],
  about_text: ["Královské stezky jsou původní hra komunity Libri Civitatis z prostředí Kutnohorska 15. století. Web hraje ve stejném světě jako Discord — stejná postava, groše i batoh.",
    "Royal Trails is an original game by the Libri Civitatis community, set around Kutná Hora in the 15th century. The web plays in the same world as Discord — same character, coins and bag."],
  coming: ["Na webu jde celé město, výpravy i hry s hráči. Družinu zakládáš ve shromaždišti na Discordu, hrát ji pak můžeš i tady.",
    "The whole town, expeditions and player games are on the web. Parties are formed in the gathering channel on Discord, then playable here."],
  confirm: ["Potvrdit", "Confirm"], cancel: ["Zrušit", "Cancel"],
  nav_town: ["Město", "Town"], back_map: ["Zpět na mapu", "Back to the map"], back: ["Zpět", "Back"],
  soon: ["Sem se zatím chodí jen na Discordu. Na web to přijde brzy.", "For now this is only on Discord. It's coming to the web soon."],
  soon_short: ["Brzy", "Soon"], places: ["Místa ve městě", "Places in town"], merchants: ["Obchodníci", "Merchants"],
  map_hint: ["Klikni na místo na mapě.", "Click a place on the map."],
  rank: [{ S: "Sp", Q: "Sv", K: "K", A: "E" }, { S: "U", Q: "O", K: "K", A: "A" }],
  rank_long: [{ S: "Spodek", Q: "Svršek", K: "Král", A: "Eso" }, { S: "Under", Q: "Over", K: "King", A: "Ace" }],
  darts: ["Šipky", "Darts"],
  darts_rules: ["Cvičný hod na terč (bez sázky). Začínáš na 201 a odečítáš body, tři šipky za tah. Přehodíš-li zbytek, tah propadá. Zavírat lze od 60. Obratnost pomáhá.",
    "Practice throws (no stake). Start at 201 and count down, three darts a turn. Going below zero voids the turn. Finish from 60 or less. Agility helps."],
  aim_safe: ["🎯 Bezpečně", "🎯 Safe"], aim_risky: ["🔺 Na trojité", "🔺 For the treble"], aim_bull: ["🔴 Do středu", "🔴 Bullseye"], aim_finish: ["🏁 Zavřít", "🏁 Finish"],
  left_pts: ["Zbývá {0}", "{0} left"], turns_n: ["Tah {0}", "Turn {0}"], bust: ["Přehozeno! Tah propadá.", "Bust! The turn is void."],
  left_lbl: ["Zbývá", "Left"], turn_lbl: ["Tahů", "Turns"],
  closed: ["Zavřeno za {0} tahů!", "Finished in {0} turns!"], miss: ["mimo", "miss"], new_game: ["Nová hra", "New game"],
  figure: ["Postava", "Figure"], show_card: ["Karta z Discordu", "Discord card"], show_figure: ["Postava z vrstev", "Layered figure"],
  sound: ["Zvuk", "Sound"], sound_on: ["Zvuky zapnuté", "Sound on"], sound_amb: ["Prostředí", "Ambience"], sound_sfx: ["Akce", "Effects"],
  sound_mus: ["Hudba", "Music"], sound_master: ["Celkem", "Master"], sound_off: ["Vypnuto", "Off"], sound_on_short: ["Zapnuto", "On"], music_credit: ["Hudba: Kevin MacLeod (incompetech.com), licence CC BY 4.0.", "Music: Kevin MacLeod (incompetech.com), licensed CC BY 4.0."],
  sound_note: ["Zvuky: nahrávky z freesound.org (CC0).", "Sounds: recordings from freesound.org (CC0)."],
  weather_now: ["Počasí", "Weather"],
};

// ------------------------------------------------------------------ úložiště (může být zakázané)
const store = {
  get(k, d = "") { try { return localStorage.getItem("stezky_" + k) ?? d; } catch { return d; } },
  set(k, v) { try { v == null ? localStorage.removeItem("stezky_" + k) : localStorage.setItem("stezky_" + k, v); } catch { /* nic */ } },
};

const S = {
  lang: store.get("lang") || "cs",            // hrajeme česky; angličtina jen když si ji hráč přepne
  token: store.get("token"),
  me: null, tab: "mesto", arg: "",
  icons: {}, shops: null, shop: store.get("shop"), card: null,
  bagFilter: "", inn: null, sel: new Set(),
};
if (S.lang !== "cs" && S.lang !== "en") S.lang = "cs";

function t(key, ...args) {
  const row = T[key];
  let s = row ? row[S.lang === "en" ? 1 : 0] : key;
  if (typeof s === "string") args.forEach((a, i) => { s = s.replace("{" + i + "}", a); });
  return s;
}
const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
/** Text z Discordu (markdown **tučně**, -# drobně) → bezpečné HTML. */
function md(text) {
  return esc(text).split("\n").map((line) => {
    let small = false;
    if (line.startsWith("-# ")) { small = true; line = line.slice(3); }
    line = line.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/__(.+?)__/g, "<u>$1</u>").replace(/(^|\s)\*(\S.*?)\*/g, "$1<i>$2</i>");
    return small ? `<span class="dim small">${line}</span>` : line;
  }).join("<br>");
}
const h = (html) => { const d = document.createElement("template"); d.innerHTML = html.trim(); return d.content; };

// ------------------------------------------------------------------ API
let pending = 0;
async function call(op, data = {}, quiet = false) {
  pending++; $("#busy").hidden = false;
  try {
    let res;
    try {
      const r = await fetch(API, { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ op, token: S.token, lang: S.lang, ...data }) });
      res = await r.json();
    } catch (e) {
      throw new Error(t(e instanceof SyntaxError ? "bad_reply" : "net_error"));
    }
    if (!res.ok) {
      if (res.auth === "login" && op !== "link") { logout(true, res.error); }
      throw new Error(res.error || t("bad_reply"));
    }
    if (res.me) setMe(res.me);
    else if (op === "me") setMe(res);              // „me“ vrací postavu přímo, ne pod klíčem me
    return res;
  } catch (e) {
    if (!quiet) toast(e.message, true);
    throw e;
  } finally {
    if (--pending <= 0) { pending = 0; $("#busy").hidden = true; }
  }
}

let toastTimer;
function toast(msg, err = false) {
  const el = $("#toast");
  el.innerHTML = md(msg); el.className = "toast show" + (err ? " err" : "");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.className = "toast" + (err ? " err" : ""); }, err ? 4200 : 2600);
}

async function loadIcons(names) {
  const need = [...new Set(names)].filter((n) => n && !(n in S.icons));
  for (let i = 0; i < need.length; i += 80) {
    try {
      const res = await call("icons", { names: need.slice(i, i + 80) }, true);
      Object.assign(S.icons, res.icons || {});
    } catch { return; }
  }
  document.querySelectorAll("img.icon[data-item]").forEach((img) => {
    const src = S.icons[img.dataset.item];
    if (src && !img.src) img.src = "data:image/png;base64," + src;
  });
}
const icon = (id) => `<img class="icon" alt="" data-item="${esc(id)}"${S.icons[id] ? ` src="data:image/png;base64,${S.icons[id]}"` : ""}>`;

// ------------------------------------------------------------------ přihlášení
function applyTexts() {
  document.documentElement.lang = S.lang;
  document.querySelectorAll("[data-t]").forEach((el) => { el.innerHTML = t(el.dataset.t); });
  document.querySelectorAll("[data-lang]").forEach((b) => b.classList.toggle("on", b.dataset.lang === S.lang));
  $("#code").placeholder = "ABC123";
}

function setLang(lang) {
  S.lang = lang; store.set("lang", lang); S.shops = null; S.card = null;
  applyTexts();
  if (S.token) { call("me", {}, true).then(() => render()).catch(() => {}); }
}

function showLogin(msg = "") {
  $("#game").hidden = true; $("#login").hidden = false;
  $("#login-msg").textContent = msg;
  setTimeout(() => $("#code").focus(), 50);
}

function logout(expired = false, msg = "") {
  if (!expired && S.token) call("logout", { token: S.token }, true).catch(() => {});
  S.token = ""; store.set("token", null); S.me = null; S.card = null;
  showLogin(msg);
}

$("#login-form").addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const code = $("#code").value.trim();
  if (!code) return;
  const btn = ev.submitter || $("#login-form button");
  btn.disabled = true; $("#login-msg").textContent = t("connecting");
  try {
    const res = await call("link", { code }, true);
    S.token = res.token; store.set("token", res.token);
    $("#code").value = ""; $("#login-msg").textContent = "";
    enterGame();
  } catch (e) {
    $("#login-msg").textContent = e.message;
  } finally { btn.disabled = false; }
});
$("#code").addEventListener("input", (e) => { e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""); });
document.querySelectorAll("[data-lang]").forEach((b) => b.addEventListener("click", () => setLang(b.dataset.lang)));

// ------------------------------------------------------------------ hra
function setMe(me) {
  S.me = me;
  S.card = null;                                   // karta se překreslí při dalším zobrazení postavy
  const has = me && me.has_character;
  $("#tb-name").textContent = has ? me.name : "";
  $("#tb-level").textContent = has ? t("level", me.level) : "";
  $("#tb-coins").textContent = has ? "🪙 " + t("coins", me.coins) : "";
  $("#tb-clock").textContent = has ? me.clock || "" : "";
  if (has && (typeof Scena !== "undefined")) Scena.setWorld(me);
  const sky = $("#tb-sky");
  if (sky) sky.textContent = has && me.weather ? (me.night && me.weather === "jasno" ? "🌙" : SKY[me.weather] || "") + " " + (S.lang === "en" ? SKY_EN[me.weather] || me.weather : me.weather) : "";
  $("#tb-level").hidden = $("#tb-coins").hidden = !has;
}

async function enterGame() {
  $("#login").hidden = true; $("#game").hidden = false;
  try { await call("me"); } catch { if (!S.token) return; }
  go(store.get("tab") || "mesto");
}

const TAB_OF = { mesto: "mesto", misto: "mesto", obchod: "mesto", hra: "mesto", vyprava: "mesto", statek: "mesto", panel: "mesto", domov: "mesto", kohouti: "mesto", hraci: "mesto", hero: "hero", bag: "bag", more: "more" };

const SKY = { "jasno": "☀️", "vedro": "🔥", "déšť": "🌧️", "bouřka": "⛈️", "mlha": "🌫️", "vítr": "💨", "silný vítr": "💨", "sníh": "🌨️", "mráz": "🥶" };
const SKY_EN = { "jasno": "clear", "vedro": "heat", "déšť": "rain", "bouřka": "storm", "mlha": "fog", "vítr": "wind", "silný vítr": "gale", "sníh": "snow", "mráz": "frost" };

function go(route) {
  let [tab, ...rest] = String(route || "").split("/");
  if (!VIEWS[tab]) { tab = "mesto"; rest = []; }
  S.tab = tab; S.arg = decodeURIComponent(rest.join("/"));
  const r = S.arg ? tab + "/" + encodeURIComponent(S.arg) : tab;
  store.set("tab", r);
  if (tab === "hra") S.inn = null;
  if (tab === "vyprava") { RAID.st = null; RAID.panel = null; }                 // hostinec vždy načíst čerstvý (mohl hrát na Discordu)
  document.querySelectorAll(".tabs button").forEach((b) => b.classList.toggle("on", b.dataset.tab === TAB_OF[tab]));
  if (location.hash !== "#" + r) history.pushState(null, "", "#" + r);
  window.scrollTo(0, 0);
  if ((typeof Zvuk !== "undefined")) { Zvuk.sfx("stranka"); if (!["mesto", "misto", "obchod", "hra", "vyprava", "panel", "domov", "kohouti", "statek"].includes(tab)) { Zvuk.scene([], S.me || {}, true); Zvuk.music(townMusic()); } }
  render();
}
document.querySelectorAll(".tabs button").forEach((b) => b.addEventListener("click", () => go(b.dataset.tab)));

function render() {
  const view = $("#view");
  if (!S.me) { view.innerHTML = ""; return; }
  if (!S.me.has_character && S.tab !== "more") {
    view.replaceChildren(h(`<div class="panel notice"><p>${esc(t("no_char"))}</p>
      <button class="btn primary" id="refresh">${esc(t("refresh"))}</button></div>`));
    $("#refresh").onclick = () => call("me").then(render).catch(() => {});
    return;
  }
  view.dataset.tab = S.tab;                         // r27-4: vzhled podle záložky (Noc nad městem / Kronika)
  view.classList.toggle("wide", ["mesto", "misto", "obchod", "hra", "vyprava", "panel", "domov", "kohouti", "statek", "hraci"].includes(S.tab));
  const r = VIEWS[S.tab](view);
  const pvpNote = () => {                          // r27-3: rozehraná hra nebo výzva od jiného hráče
    if (!S.me.pvp || S.tab === "hraci" || document.getElementById("pvpnote")) return;
    view.prepend(h(`<div class="panel notice pvpnote" id="pvpnote"><span>${esc(S.me.pvp === "open" ? L(["Máš výzvu ke hře od jiného hráče.", "You have a challenge from another player."])
      : L(["Máš rozehranou hru s jiným hráčem.", "You have a game in progress with another player."]))}</span>
      <button class="btn small primary" data-go="hraci">${esc(L(["Ke hře", "Go to the game"]))}</button></div>`));
    view.querySelector("#pvpnote [data-go]").onclick = () => go("hraci");
  };
  if (r && r.then) r.then(pvpNote); else pvpNote();
}

const VIEWS = {};

// --- postava
VIEWS.hero = (view) => {
  const m = S.me;
  const bar = (label, val, max, cls) => {
    const pct = Math.max(0, Math.min(100, max ? (100 * val) / max : 0));
    return `<div class="bar"><div class="spread"><span>${esc(label)}</span><span class="muted">${esc(val)} / ${esc(max)}</span></div>
      <div class="track"><div class="fill ${cls}" style="width:${pct}%"></div></div></div>`;
  };
  view.replaceChildren(h(`
    ${m.on_raid ? `<div class="panel notice" style="margin-bottom:16px">🗺️ ${esc(t("on_raid"))}</div>` : ""}
    <div class="grid hero-grid">
      <div class="hero-left">
        <div class="hero-fig live" data-img="mesto-pokoj" data-key="pokoj">${Postava.html(m, IMG_BASE)}</div>
        <img class="card-img loading" id="card" alt="${esc(t("card_alt"))}" width="1400" height="780" hidden>
        <div class="row"><button class="chip" id="cardtgl">🪪 ${esc(t("show_card"))}</button></div>
      </div>
      <div class="grid">
        <div class="panel">
          <div class="spread"><h2>${esc(m.name)}</h2><span class="pill gold">${esc(t("level_long", m.level))}</span></div>
          <dl class="kv"><dt>${esc(t("origin"))}</dt><dd>${esc(m.origin_name)}</dd><dt>${esc(t("time"))}</dt><dd>${esc(m.clock)}</dd></dl>
          ${bar(t("xp"), m.xp, m.xp_next, "xp")}
        </div>
        <div class="panel"><h3>${esc(t("needs"))}</h3>
          ${bar("❤️ " + t("health"), m.health, m.max_health, "hp")}
          ${bar("🍖 " + t("satiety"), m.satiety, 100, "food")}
          ${bar("💧 " + t("hydration"), m.hydration, 100, "water")}
          ${bar("💤 " + t("rest"), m.rest, 100, "rest")}
        </div>
        <div class="panel"><h3>${esc(t("attributes"))}</h3>
          <div class="stats">${m.stats.map((s) => `<div class="stat"><span>${esc(s.name)}</span><b>${esc(s.value)}</b></div>`).join("")}</div>
          ${m.unspent ? `<p class="muted small">${esc(t("unspent", m.unspent))}</p>` : ""}
        </div>
        <div class="panel"><h3>⚔️ ${esc(t("combat"))}</h3>
          <dl class="kv"><dt>${esc(t("armor_class"))}</dt><dd>${esc(m.armor_class)}</dd>
          <dt>${esc(t("attack"))}</dt><dd>${m.attack >= 0 ? "+" : ""}${esc(m.attack)}</dd>
          <dt>${esc(t("damage"))}</dt><dd>${esc(m.damage)}</dd></dl>
        </div>
      </div>
    </div>`));
  mountLive(view, { still: true });
  const img = $("#card"), fig = view.querySelector(".hero-fig"), tgl = $("#cardtgl");
  const show = (b64) => { img.src = "data:image/png;base64," + b64; img.classList.remove("loading"); };
  tgl.onclick = () => {
    const card = img.hidden;
    img.hidden = !card; fig.hidden = card;
    tgl.textContent = (card ? "🧍 " + t("show_figure") : "🪪 " + t("show_card"));
    if (card && !S.card) call("card", {}, true).then((r) => { if (r.image) { S.card = r.image; if (img.isConnected) show(r.image); } }).catch(() => {});
    else if (card) show(S.card);
  };
};

// --- batoh
VIEWS.bag = (view) => {
  const m = S.me;
  const slots = [...new Set(m.inventory.map((i) => i.slot_name))].sort((a, b) => a.localeCompare(b, S.lang));
  const f = S.bagFilter;
  const inv = m.inventory.filter((i) => !f || i.slot_name === f);
  view.replaceChildren(h(`
    ${m.on_raid ? `<div class="panel notice" style="margin-bottom:16px">🗺️ ${esc(t("on_raid"))}</div>` : ""}
    <div class="grid g2" style="align-items:start">
      <div class="panel"><h3>${esc(t("equipped"))}</h3><div class="items">
        ${m.equipped.length ? m.equipped.map((e) => `<div class="item eq">${icon(e.id)}
          <div><div class="nm">${esc(e.name)}</div><div class="meta">${esc(e.slot_name)}</div></div>
          <div class="acts"><button class="btn small" data-unequip="${esc(e.slot)}">${esc(t("unequip"))}</button></div></div>`).join("")
        : `<div class="empty">${esc(t("empty"))}</div>`}
      </div></div>
      <div class="panel"><h3>${esc(t("backpack", m.bag))}</h3>
        <div class="filter"><button class="chip${f ? "" : " on"}" data-f="">${esc(t("all"))}</button>
          ${slots.map((s) => `<button class="chip${f === s ? " on" : ""}" data-f="${esc(s)}">${esc(s)}</button>`).join("")}</div>
        <div class="items">
        ${inv.length ? inv.map((i) => `<div class="item${i.equipped ? " eq" : ""}">${icon(i.id)}
          <div><div class="nm">${esc(i.name)}${i.count > 1 ? ` <span class="muted">× ${esc(i.count)}</span>` : ""}${i.equipped ? `<span class="tag">${esc(t("equipped"))}</span>` : ""}</div>
          <div class="meta">${esc(i.slot_name)}${i.merchant_name ? " · " + esc(t("sell_to", i.merchant_name)) : ""}</div></div>
          <div class="acts">
            ${i.use ? `<button class="btn small" data-use="${esc(i.id)}">${esc(t("use"))}</button>` : ""}
            ${i.equip && !i.equipped ? `<button class="btn small" data-equip="${esc(i.id)}">${esc(t("equip"))}</button>` : ""}
            ${i.sell ? `<button class="btn small" data-sell="${esc(i.id)}" data-name="${esc(i.name)}" data-shop="${esc(i.merchant)}" data-price="${esc(i.sell)}">${esc(t("sell"))} · ${esc(t("coins", i.sell))}</button>` : ""}
          </div></div>`).join("") : `<div class="empty">${esc(t("empty"))}</div>`}
        </div></div>
    </div>`));
  view.querySelectorAll("[data-f]").forEach((b) => b.onclick = () => { S.bagFilter = b.dataset.f; render(); });
  const act = (op, data, msg) => call(op, data).then((r) => { toast(msg ? msg(r) : t("done")); render(); }).catch(() => {});
  view.querySelectorAll("[data-unequip]").forEach((b) => b.onclick = () => act("unequip", { slot: b.dataset.unequip }));
  view.querySelectorAll("[data-equip]").forEach((b) => b.onclick = () => act("equip", { item: b.dataset.equip }));
  view.querySelectorAll("[data-use]").forEach((b) => b.onclick = () => act("use", { item: b.dataset.use }));
  view.querySelectorAll("[data-sell]").forEach((b) => b.onclick = () => {
    if (confirm(t("sell_q", b.dataset.name, t("coins", b.dataset.price)))) act("sell", { item: b.dataset.sell, shop: b.dataset.shop }, (r) => t("sold", r.price));
  });
  loadIcons([...m.inventory.map((i) => i.id), ...m.equipped.map((e) => e.id)]);
};

// --- město: mapa, místa, obchody
const L = (pair) => pair[S.lang === "en" ? 1 : 0];
// Obrázky leží ve vlastním repozitáři na GitHub Pages (bot je nestahuje s každou aktualizací).
// data-img v index.html = adresa úložiště; prázdné = složka img/ vedle stránky (vývoj).
const IMG_BASE = (document.documentElement.dataset.img || "img/").replace(/\/?$/, "/");
document.documentElement.style.setProperty("--uvod", `url("${IMG_BASE}mesto-brana.webp")`);   // r27-4: přihlášení na pozadí brány
document.documentElement.style.setProperty("--pecet-img", `url("${IMG_BASE}rozhrani/pecet.webp")`);   // r27-4: pečeť hry (rytířská přilba ve štítu)
{ const fav = document.querySelector("link[rel=icon]"); if (fav) fav.href = IMG_BASE + "rozhrani/pecet-m.webp"; }
const IMG = (name) => `<picture><source media="(max-width: 760px)" srcset="${IMG_BASE}${name}-m.webp"><img src="${IMG_BASE}${name}.webp" alt="" loading="lazy" decoding="async"></picture>`;

const SPOTS = [   // klikací místa na mapě (% šířky a výšky obrázku mesto-mapa)
  { id: "hostinec", x: 21.5, y: 45.9, n: ["Hostinec", "Inn"] },
  { id: "kovar", x: 20.2, y: 63.5, n: ["Kovárna", "Smithy"] },
  { id: "trziste", x: 41.7, y: 57.1, n: ["Tržiště", "Market"] },
  { id: "radnice", x: 43.6, y: 37.1, n: ["Radnice", "Town hall"] },
  { id: "banka", x: 59.6, y: 44.9, n: ["Směnárna", "Money changer"] },
  { id: "chram", x: 84.6, y: 32.2, n: ["Chrám", "Church"] },
  { id: "lazne", x: 74.9, y: 57.6, n: ["Lazebník", "Bathhouse"] },
  { id: "mlyn", x: 84.0, y: 71.3, n: ["Mlýn", "Mill"] },
  { id: "zverinec", x: 64.1, y: 80.1, n: ["Zvěřinec", "Menagerie"] },
  { id: "kolbiste", x: 47.9, y: 80.1, n: ["Kolbiště", "Arena"] },
  { id: "brana", x: 15.0, y: 81.1, n: ["Brána", "Town gate"] },
  { id: "dum", x: 37.3, y: 72.9, n: ["Měšťanský dům", "Burgher house"] },
];
const SHOPS_UI = {   // obchodník: obrázek, ikona, věta
  "Kovář": { img: "mesto-kovar", ic: "⚒️", say: ["Kovář: „Ostří, co vydrží i lapkovu lebku.“", "Smith: \"Edges that will outlast a bandit's skull.\""] },
  "Střelmistr": { img: "mesto-strelmistr", ic: "🏹", say: ["Střelmistr: „Tis z Křivoklátska, tětivy z lnu.“", "Bowyer: \"Yew from the royal woods, flax strings.\""] },
  "Zbrojíř": { img: "mesto-zbrojir", ic: "🛡️", say: ["Zbrojíř: „Dobrá zbroj je levnější než pohřeb.“", "Armourer: \"Good armour is cheaper than a funeral.\""] },
  "Apatykář": { img: "mesto-apatykar", ic: "🧪", say: ["Apatykář: „Na každou ránu jedna bylinka.“", "Apothecary: \"A herb for every wound.\""] },
  "Krejčí": { img: "mesto-krejci", ic: "🧵", say: ["Krejčí: „V zimě vás zahřeje, v létě nezpotí.“", "Tailor: \"Warm in winter, cool in summer.\""] },
  "Písař": { img: "mesto-pisar", ic: "📜", say: ["Písař: „Mapy, knihy, recepty — vše psáno pečlivě.“", "Scribe: \"Maps, books, recipes — all carefully written.\""] },
  "Vetešník": { img: "mesto-vetesnik", ic: "🧺", say: ["Vetešník: „Co jinej vyhodí, já prodám.“", "Junk dealer: \"What others throw away, I sell.\""] },
  "Mlynář": { img: "mesto-mlyn", ic: "🌾", say: ["Mlynář: „Obilí sem, mouka tam. Groš za pytel.“", "Miller: \"Grain in, flour out. A groschen a sack.\""] },
  "Hostinský": { img: "mesto-hostinec", ic: "🍺", say: ["Hostinský: „Pivo, chleba, a něco na cestu?“", "Innkeeper: \"Beer, bread, and something for the road?\""] },
};
const PLACES = {
  // r27-3: všechno jako na Discordu — panel: = okno místa (stejný kód), cid: = rovnou tlačítko z Discordu, when: = jen někomu
  hostinec: { img: "mesto-hostinec", n: ["Hostinec U Zlatého groše", "The Golden Groschen Inn"],
    say: ["Hostinský: „Co to bude, poutníku?“", "Innkeeper: \"What will it be, traveller?\""],
    opts: [
      { go: "hra/dice", ic: "🎲", n: ["Kostky", "Dice"], d: ["Hra s hostinským o groše", "Play the innkeeper for coins"] },
      { go: "hra/cards", ic: "🃏", n: ["Oko bere", "Twenty-one"], d: ["Karetní hra s hostinským", "Card game with the innkeeper"] },
      { go: "hra/darts", ic: "🎯", n: ["Šipky", "Darts"], d: ["Cvičný hod na terč", "Practice at the board"] },
      { go: "kohouti", ic: "🐓", n: ["Kohoutí zápas", "Cockfight"], d: ["Sázky na kohouty v jámě", "Bet on the cocks in the pit"] },
      { panel: "inn", ic: "🎭", n: ["Hry s hráči a další", "Games with players and more"], d: ["Lhář, mlýn, kostky, karty proti hráčům", "Liar's dice, mill, dice and cards against players"] },
      { go: "obchod/Hostinský", ic: "🍺", n: ["Občerstvení a zásoby", "Food and supplies"], d: ["Jídlo, pití, suroviny", "Food, drink and goods"] },
      { panel: "lodging", ic: "🛏️", n: ["Nocleh", "Lodging"], d: ["Vyspat se do sytosti", "Sleep until rested"] },
      { panel: "board", ic: "📋", n: ["Nástěnka", "Notice board"], d: ["Zakázky a výzvy", "Jobs and challenges"] },
      { panel: "innchest", ic: "🗝️", n: ["Truhla v hostinci", "Chest at the inn"], d: ["Úschova pro ty bez domu", "Storage for the homeless"] },
      { panel: "learn", ic: "🍳", n: ["Lekce u mistrů", "Lessons"], d: ["Vaření a rybaření", "Cooking and fishing"] },
      { panel: "burgle", ic: "🌙", n: ["Vloupání do truhel", "Break into chests"], d: ["Jen v noci, šperhákem", "Night only, with a lockpick"] },
    ] },
  trziste: { img: "mesto-trziste", n: ["Tržiště", "Market square"], say: ["Kupci vyvolávají své zboží.", "Merchants call out their wares."],
    opts: [...["Kovář", "Střelmistr", "Zbrojíř", "Apatykář", "Krejčí", "Písař", "Vetešník", "Hostinský", "Mlynář"].map((sh) => ({ go: "obchod/" + sh, shop: sh })),
      { panel: "carpenter", ic: "🪚", n: ["Truhlář", "Carpenter"], d: ["Nábytek do domu", "Furniture for your home"] },
      { panel: "market", ic: "🔨", n: ["Aukce a nabídky hráčů", "Auctions and player offers"], d: ["Nabídnout, vydražit, vyzvednout", "Offer, bid, collect"] },
      { panel: "biz", ic: "🧪", n: ["Tvá apatyka", "Your apothecary"], d: ["Výroba a truhla podniku", "Crafting and the workshop chest"], when: (m) => m.origin === "apatykar" && m.business },
      { panel: "biz", ic: "🏹", n: ["Tvá střelmistrova dílna", "Your bowyer's workshop"], d: ["Výroba a truhla podniku", "Crafting and the workshop chest"], when: (m) => m.origin === "lovci" && m.business },
      { go: "misto/paserak", ic: "🌙", n: ["Pašerák", "Smuggler"], d: ["Jen v noci", "Night only"] }] },
  kovar: { img: "mesto-kovar", n: ["Kovárna", "Smithy"], say: ["Kovář: „Ostří, co vydrží i lapkovu lebku.“", "Smith: \"Edges that will outlast a bandit's skull.\""],
    opts: [
      { go: "obchod/Kovář", shop: "Kovář" },
      { panel: "biz", ic: "⚒️", n: ["Tvá kovárna", "Your smithy"], d: ["Výroba a truhla podniku", "Crafting and the workshop chest"], when: (m) => m.origin === "kovar" && m.business },
    ] },
  mlyn: { redirect: "obchod/Mlynář" },                      // r27-3: mlynář vykupuje obilí a mele mouku
  radnice: { img: "mesto-radnice", n: ["Radnice", "Town hall"], say: ["Purkmistr: „Co vás přivádí před radu, poutníku?“", "Burgomaster: \"What brings you before the council, traveller?\""],
    opts: [
      { panel: "bank", ic: "🏦", n: ["Banka", "Bank"], d: ["Uložit, vybrat, půjčka", "Deposit, withdraw, loans"] },
      { panel: "bills", ic: "🧾", n: ["Výdaje", "Bills"], d: ["Týdenní platby a dluhy", "Weekly payments and debts"] },
      { cid: "ks:hall:shop", ic: "🏠", n: ["Koupit podnik", "Buy a business"], d: ["Vlastní dílna podle původu", "Your own workshop"] },
      { panel: "houses", ic: "🏡", n: ["Koupit dům", "Buy a house"], d: ["Chalupa nebo měšťanský dům", "Cottage or burgher house"] },
      { panel: "people", ic: "👥", n: ["Obyvatelé", "Townsfolk"], d: ["Kdo ve městě žije", "Who lives in town"] },
      { panel: "titles", ic: "🏛️", n: ["Měšťanské právo a erb", "Citizenship and arms"], d: ["Staň se měšťanem", "Become a burgher"] },
      { panel: "week", ic: "📜", n: ["Pořadí týdne", "Weekly ranking"], d: ["Nejlepší hrdinové", "Best heroes"] },
      { panel: "fine", ic: "⚖️", n: ["Rychtář", "Reeve"], d: ["Pokuty a hledanost", "Fines and bounties"] },
      { panel: "donate_town", ic: "🎁", n: ["Dar městu", "Gift to the town"], d: ["Pro dobrou pověst", "For your reputation"] },
    ] },
  chram: { img: "mesto-chram", n: ["Chrám svaté Barbory", "Church of St Barbara"], say: ["Kněz: „Pokoj s tebou. Modlit se můžeš jednou za den.“", "Priest: \"Peace be with you. You may pray once a day.\""],
    opts: [
      { act: "pray:sila", ic: "💪", n: ["Požehnání síly", "Blessing of strength"], d: ["+1 k útoku na výpravu", "+1 attack next expedition"] },
      { act: "pray:ochrana", ic: "🛡️", n: ["Požehnání ochrany", "Blessing of protection"], d: ["+1 k obraně na výpravu", "+1 defence next expedition"] },
      { act: "pray:moudrost", ic: "📖", n: ["Požehnání moudrosti", "Blessing of wisdom"], d: ["+1 ke zkouškám", "+1 to checks"] },
      { act: "pray:uzdraveni", ic: "❤️", n: ["Uzdravení", "Healing"], d: ["+25 % životů hned", "+25% health now"] },
      { panel: "donate_church", ic: "🎁", n: ["Dar kostelu", "Gift to the church"], d: ["Pro dobrou pověst", "For your reputation"] },
    ] },
  lazne: { img: "mesto-lazebnik", n: ["Lazebník", "Barber and bathhouse"], say: ["Lazebník: „Oholit, ostříhat, nebo rovnou do škopku?“", "Barber: \"A shave, a haircut, or straight into the tub?\""],
    opts: [
      { cid: "ks:barber:vlasy", ic: "✂️", n: ["Účes", "Haircut"], d: ["Nový střih", "A new cut"] },
      { cid: "ks:barber:barva vlasů", ic: "🎨", n: ["Barva vlasů", "Hair colour"], d: ["Odbarvit nebo obarvit", "Change the colour"] },
      { cid: "ks:barber:vousy", ic: "🪒", n: ["Vousy", "Beard"], d: ["Oholit nebo zastřihnout", "Shave or trim"] },
      { cid: "ks:barber:barva vousů", ic: "🎨", n: ["Barva vousů", "Beard colour"], d: ["Obarvit vousy", "Dye the beard"] },
    ] },
  banka: { img: "mesto-banka", n: ["Směnárna a banka", "Money changer and bank"], say: ["Směnárník: „Co uložíte u mě, to na výpravě neztratíte.“", "Changer: \"What you leave with me, you won't lose on the road.\""],
    opts: [
      { panel: "bank", ic: "🏦", n: ["Uložit, vybrat, půjčit", "Deposit, withdraw, borrow"], d: ["Groše v bance jsou v bezpečí", "Coins in the bank are safe"] },
      { panel: "bills", ic: "🧾", n: ["Výdaje a dluhy", "Bills and debts"], d: ["Co se strhává každý týden", "What is paid every week"] },
    ] },
  kolbiste: { img: "mesto-kolbiste", n: ["Kolbiště", "Arena"], say: ["Mistr kolbiště: „Kdo si troufne?“", "Arena master: \"Who dares?\""],
    opts: [
      { cid: "ks:duel:menu", ic: "⚔️", n: ["Vyzvat na souboj", "Challenge to a duel"], d: ["Souboj 1 na 1 o hodnost", "One on one for rank"] },
      { cid: "ks:duel:ladder", ic: "🏆", n: ["Žebříček", "Ladder"], d: ["Hodnosti a pořadí", "Ranks and standings"] },
    ] },
  zverinec: { img: "mesto-zverinec", n: ["Zvěřinec", "Menagerie"], say: ["Zvěřinec: „Každé zvíře si najde svého pána.“", "Keeper: \"Every animal finds its master.\""],
    opts: [ { panel: "pets", ic: "🐾", n: ["Zvířata a povoz", "Animals and cart"], d: ["Mláďata, krmení, povoz", "Young animals, feeding, cart"] } ] },
  brana: { img: "mesto-brana", n: ["Městská brána", "Town gate"], say: ["Strážný: „Kam to bude, na stezky?“", "Guard: \"Off to the trails, then?\""],
    opts: [
      { go: "vyprava", ic: "🗺️", n: ["Vyrazit na výpravu", "Set out on an expedition"], d: ["Lesy, doly, ležení, hrad", "Woods, mines, camp, castle"] },
      { panel: "trails", ic: "🗡️", n: ["Na stezkách", "On the trails"], d: ["Jít po stopách cizí výpravy", "Follow another expedition"] },
      { go: "statek", ic: "🌾", n: ["Usedlost za hradbami", "Farmstead outside the walls"], d: ["Statek sedláka: pole, chlév, dvůr", "The peasant's farm: fields, barn, yard"], when: (m) => m.origin === "sedlak" },
      { go: "domov", ic: "🛖", n: ["Tvá chalupa", "Your cottage"], d: ["Roubená chalupa za hradbami", "Log cottage outside the walls"], when: (m) => m.house === "chalupa" },
      { panel: "biz", ic: "🗡️", n: ["Doupě", "The den"], d: ["Skrýš za hradbami", "Hideout outside the walls"], when: (m) => m.origin === "lapka" && m.business },
      { cid: "ks:gate:steal", ic: "🕵️", n: ["Věci u brány", "Things at the gate"], d: ["Lapka se prohrabe zapomenutým", "A bandit rummages through left goods"], when: (m) => m.origin === "lapka" },
    ] },
  dum: { img: "mesto-dum", n: ["Měšťanský dům", "Burgher house"], say: ["Tvůj vlastní kout v Kutné Hoře.", "Your own corner of Kutná Hora."],
    opts: [
      { go: "domov", ic: "🏡", n: ["Domov", "Home"], d: ["Spánek, jídlo, truhla, vaření, nábytek", "Sleep, food, chest, cooking, furniture"], when: (m) => m.house === "dum" },
      { panel: "houses", ic: "🏡", n: ["Koupit dům", "Buy a house"], d: ["Chalupa za hradbami nebo dům ve městě", "Cottage or town house"], when: (m) => m.house !== "dum" },
    ] },
  paserak: { img: "mesto-paserak", n: ["Pašerák", "Smuggler"], say: ["Pašerák: „Nikdo nás neviděl, jasný?“", "Smuggler: \"Nobody saw us, right?\""],
    opts: [ { panel: "smuggler", ic: "🌙", n: ["Černý trh", "Black market"], d: ["Jen v noci 21–5", "Night only, 9 pm–5 am"] } ] },

};

function sceneHead(img, title, say, small = false) {
  return `<div class="scene live${small ? " short" : ""}" data-img="${esc(img)}">
    <div class="scene-cap"><h2>${esc(title)}</h2>${say ? `<p>${esc(say)}</p>` : ""}</div></div>`;
}
Scena.setBase(IMG_BASE);
Zvuk.setBase(document.documentElement.dataset.zvuk || IMG_BASE.replace(/img\/$/, "zvuk/"));
// Hudba podle místa; jinde město ve dne nebo v noci.
const MUSIC_OF = { "mesto-hostinec": "hostinec", "mesto-chram": "kostel", "mesto-pokoj": "" };
const townMusic = () => (S.me && S.me.night ? "mesto-noc" : "mesto-den");
// Zvuky prostředí podle místa (k nim se přidá počasí a noc).
const AMB = { "mesto-mapa": ["birds"], "mesto-hostinec": ["fire", "murmur"], "mesto-kovar": ["fire", "forge"], "mesto-chram": ["church"],
  "mesto-lazebnik": ["water"], "mesto-trziste": ["crowd", "birds"], "mesto-brana": ["birds", "street"], "mesto-kolbiste": ["crowd", "birds"],
  "mesto-zverinec": ["birds"], "mesto-paserak": ["fire"], "mesto-dum": ["fire"], "mesto-pokoj": ["fire"], "mesto-zbrojir": ["forge"] };
/** Oživí všechny .live[data-img] v pohledu (efekty, počasí, noc) a pustí zvuky místa. */
function mountLive(view, opts = {}) {
  let first = null;
  view.querySelectorAll(".live[data-img]").forEach((el) => {
    const s = Scena.mount(el, el.dataset.img, el.dataset.key, opts);
    first = first || el.dataset.img;
    el._scene = s;
  });
  if (first && (typeof Zvuk !== "undefined")) {
    Zvuk.scene(AMB[first] || [], S.me || {}, Scena.indoor(first));
    Zvuk.music(first in MUSIC_OF ? MUSIC_OF[first] || townMusic() : townMusic());
  }
  return view.querySelector(".live")?._scene;
}

VIEWS.mesto = (view) => {
  view.replaceChildren(h(`
    ${S.me.on_raid ? `<div class="panel notice" style="margin-bottom:16px">🗺️ ${esc(t("on_raid"))}</div>` : ""}
    <div class="townmap live" data-img="mesto-mapa"></div>
    <h3 class="sect">${esc(t("places"))}</h3>
    <div class="placelist">${SPOTS.map((p) => `<button class="place${PLACES[p.id] ? "" : " later"}" data-spot="${p.id}">${esc(L(p.n))}${PLACES[p.id] ? "" : `<small>${esc(t("soon_short"))}</small>`}</button>`).join("")}</div>`));
  const sc = mountLive(view, { still: true, contain: true });
  sc.pic.insertAdjacentHTML("beforeend", SPOTS.map((p) => `<button class="spot${PLACES[p.id] ? "" : " later"}" data-spot="${p.id}" style="left:${p.x}%;top:${p.y}%"><span>${esc(L(p.n))}</span></button>`).join(""));
  view.querySelectorAll("[data-spot]").forEach((b) => b.onclick = () => {
    const p = PLACES[b.dataset.spot];
    if ((typeof Zvuk !== "undefined")) Zvuk.sfx(p ? "dvere" : "klik");
    if (!p) { toast(t("soon")); return; }
    go(p.redirect || "misto/" + b.dataset.spot);
  });
};

VIEWS.misto = (view) => {
  const p = PLACES[S.arg];
  if (!p) { go("mesto"); return; }
  if (p.redirect) { go(p.redirect); return; }
  const card = (o) => {
    if (o.shop) {
      const u = SHOPS_UI[o.shop] || {};
      const nm = (S.shops || []).find((x) => x.id === o.shop)?.name || o.shop;
      return `<button class="opt" data-go="${esc(o.go)}"><span class="ic">${u.ic || "⚖️"}</span><b>${esc(nm)}</b></button>`;
    }
    const target = o.soon ? "data-soon" : o.act ? `data-act="${esc(o.act)}"` : o.panel ? `data-panel="${esc(o.panel)}"` : o.cid ? `data-pcid="${esc(o.cid)}"` : `data-go="${esc(o.go)}"`;
    return `<button class="opt${o.soon ? " later" : ""}" ${target}><span class="ic">${o.ic}</span><b>${esc(L(o.n))}</b><small>${esc(o.soon ? t("soon_short") : L(o.d))}</small></button>`;
  };
  const opts = p.opts.filter((o) => !o.when || o.when(S.me));
  view.replaceChildren(h(`${sceneHead(p.img, L(p.n), L(p.say))}
    ${S.me.on_raid ? `<div class="panel notice" style="margin:14px 0">🗺️ ${esc(t("on_raid"))}</div>` : ""}
    <div class="opts">${opts.map(card).join("")}</div>
    <p><button class="btn" data-go="mesto">← ${esc(t("back_map"))}</button></p>`));
  mountLive(view);
  view.querySelectorAll("[data-go]").forEach((b) => b.onclick = () => go(b.dataset.go));
  view.querySelectorAll("[data-soon]").forEach((b) => b.onclick = () => toast(t("soon")));
  view.querySelectorAll("[data-panel]").forEach((b) => b.onclick = () => go("panel/" + b.dataset.panel));
  view.querySelectorAll("[data-pcid]").forEach((b) => b.onclick = () => { PANEL.back = "misto/" + S.arg; go("panel/=" + b.dataset.pcid); });
  view.querySelectorAll("[data-act]").forEach((b) => b.onclick = () => {
    const [op, key] = b.dataset.act.split(":");
    if (op === "pray") Zvuk.sfx("zvon"), call("pray", { key }).then((r) => toast((r.morning ? "🔔 " : "🙏 ") + r.text)).catch(() => {});
  });
  if (!S.shops && p.opts.some((o) => o.shop)) call("shops", {}, true).then((r) => { S.shops = r.shops; if (S.tab === "misto") render(); }).catch(() => {});
};

// --- r27-3: všechno jako na Discordu — panel místa nebo osobní věci, ovládaný stejným kódem jako na Discordu
const PANEL = { back: "", arg: "" };
const PANEL_IMG = { townhall: "mesto-radnice", inn: "mesto-hostinec", market: "mesto-trziste", menagerie: "mesto-zverinec", pets: "mesto-zverinec",
  arena: "mesto-kolbiste", temple: "mesto-chram", donate_church: "mesto-chram", barber: "mesto-lazebnik", trails: "mesto-brana",
  bank: "mesto-banka", bills: "mesto-banka", board: "mesto-hostinec", lodging: "mesto-pokoj", innchest: "mesto-hostinec", burgle: "mesto-hostinec",
  learn: "mesto-hostinec", smuggler: "mesto-paserak", carpenter: "mesto-trziste", titles: "mesto-radnice", fine: "mesto-radnice",
  week: "mesto-radnice", people: "mesto-radnice", donate_town: "mesto-radnice", houses: "mesto-radnice" };
const PANEL_BACK = { inn: "misto/hostinec", lodging: "misto/hostinec", board: "misto/hostinec", innchest: "misto/hostinec", learn: "misto/hostinec",
  burgle: "misto/hostinec", market: "misto/trziste", carpenter: "misto/trziste", bank: "misto/banka", bills: "misto/banka", temple: "misto/chram",
  donate_church: "misto/chram", barber: "misto/lazne", pets: "misto/zverinec", menagerie: "misto/zverinec", arena: "misto/kolbiste",
  trails: "misto/brana", smuggler: "misto/paserak", home: "domov" };
const BIZ_IMG = { kovar: "domov/podnik-kovarna", lovci: "domov/podnik-strelmistrova-dilna", apatykar: "domov/podnik-apatyka",
  sedlak: "domov/podnik-usedlost", lapka: "domov/podnik-doupe" };
const BIZ_BACK = { kovar: "misto/kovar", lovci: "misto/trziste", apatykar: "misto/trziste", sedlak: "misto/brana", lapka: "misto/brana" };
const panelBack = (key) => PANEL.back || (key === "biz" ? BIZ_BACK[S.me.origin] : PANEL_BACK[key]) || "misto/radnice";

VIEWS.panel = async (view) => {
  const arg = S.arg, isCid = arg.startsWith("="), key = isCid ? "" : arg;
  const img = key === "biz" ? BIZ_IMG[S.me.origin] || "mesto-trziste" : PANEL_IMG[key]
    || (PANEL.back && PLACES[PANEL.back.split("/")[1]]?.img) || "mesto-trziste";
  if (PANEL.arg !== arg) { PANEL.arg = arg; }
  view.replaceChildren(h(`${sceneHead(img, "", "", true)}<div class="panel dpanel" id="dpanel"><div class="empty">…</div></div>
    <p><button class="btn" id="pback">← ${esc(t("back"))}</button></p>`));
  mountLive(view);
  const back = panelBack(key);
  $("#pback").onclick = () => { PANEL.back = ""; go(back); };
  try {
    const r = isCid ? await call("raid_click", { id: arg.slice(1), values: [] }) : await call("place", { key });
    if (S.arg === arg && S.tab === "panel") showPanelResult(r, key);
  } catch { const b = $("#dpanel"); if (b) b.innerHTML = `<div class="empty">${esc(L(["Tohle teď nejde.", "Not available right now."]))}</div>`; }
};

/** r27-3: web bez emoji a bez vzhledu Discordu — čisté písmo. */
const noEmoji = (t) => String(t || "").replace(/(\p{Extended_Pictographic}|\p{Emoji_Modifier}|[\uFE0F\u200D\u20E3])+/gu, "")
  .replace(/[ \t]{2,}/g, " ").replace(/^[ \t]+/gm, "").replace(/\(\s+/g, "(").replace(/\s+([,.:;)])/g, "$1");
/** Celé HTML bez emoji (jen znaky, tagy a atributy zůstanou). */
const bezEmoji = (html) => String(html).replace(/(\p{Extended_Pictographic}|\p{Emoji_Modifier}|[\uFE0F\u200D\u20E3])+\s?/gu, "");
/** Text okna jako stránka knihy: nadpisy, odstavce, odrážky, drobné poznámky (z Discord markdownu, bez emoji). */
function panelHtml(text) {
  const lines = noEmoji(String(text || "").replace(/<@!?\d+>/g, "").replace(/<#\d+>/g, "").replace(/<a?:\w+:\d+>/g, "").replace(/<t:(\d+)(:\w)?>/g,
    (m, ts) => new Date(Number(ts) * 1000).toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit" }))).split("\n");
  let out = "", list = false;
  const inl = (l) => esc(l).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/__(.+?)__/g, "$1").replace(/(^|\s)\*(\S.*?)\*/g, "$1<i>$2</i>").replace(/`([^`]+)`/g, "<code>$1</code>");
  for (let l of lines) {
    const bullet = /^\s*(?:[-•·]|\d+\.)\s+(.*)$/.exec(l);
    if (bullet && !l.startsWith("-# ")) { if (!list) { out += "<ul>"; list = true; } out += `<li>${inl(bullet[1])}</li>`; continue; }
    if (list) { out += "</ul>"; list = false; }
    if (!l.trim()) continue;
    const hd = /^#{1,3}\s+(.*)$/.exec(l);
    if (hd) out += `<h3>${inl(hd[1])}</h3>`;
    else if (l.startsWith("-# ")) out += `<p class="pozn">${inl(l.slice(3))}</p>`;
    else out += `<p>${inl(l)}</p>`;
  }
  return out + (list ? "</ul>" : "");
}
const cleanControls = (list) => (list || []).map((c) => c.t === "select"
  ? { ...c, placeholder: noEmoji(c.placeholder), options: c.options.map((o) => ({ ...o, emoji: "", label: noEmoji(o.label), desc: noEmoji(o.desc) })) }
  : { ...c, label: noEmoji(c.label) });   // vícenásobný výběr si emoji nechá jen u kostek (⚀–⚅ nejsou emoji)

/** Odpověď ze serveru: okno (text, obrázek, tlačítka), nebo formulář. */
function showPanelResult(r, key = "") {
  const box = $("#dpanel"); if (!box) return;
  if (r.mission && r.mission.status === "active" && !S.me.on_raid) { toast(L(["Výprava začala — jdeš na bránu.", "The expedition has started."])); go("vyprava"); return; }
  if (r.modal) { showForm(r.modal, key); return; }
  const p = r.panel;
  if (!p || (!p.content && !(p.controls || []).length)) {
    toast(L(["Hotovo.", "Done."]));
    if (key) call("place", { key }, true).then((x) => showPanelResult(x, key)).catch(() => {});
    return;
  }
  const cap = document.querySelector(".scene-cap h2");
  const head = /^#{1,3}\s+(.+)$/m.exec(p.content || "");
  if (cap && head) cap.textContent = noEmoji(head[1].replace(/\*\*/g, "")).trim();
  box.innerHTML = `${p.image ? `<img class="dpanel-img" src="${p.image}" alt="">` : ""}<div class="dtext">${panelHtml(p.content)}</div>${controlsHtml(cleanControls(p.controls), "ciste")}`;
  wirePanel(box, key);
}

function wirePanel(box, key) {
  const click = async (id, values, el) => {
    if (el) el.disabled = true;
    Zvuk.sfx("klik");
    try { showPanelResult(await call("raid_click", { id, values }), key); }
    catch { if (el) el.disabled = false; }
  };
  box.querySelectorAll("[data-cid]").forEach((b) => b.onclick = () => click(b.dataset.cid, [], b));
  box.querySelectorAll("[data-sel]").forEach((sel) => sel.onchange = () => { if (sel.value) click(sel.dataset.sel, [sel.value], sel); });
  box.querySelectorAll("[data-multi]").forEach((f) => f.querySelector("[data-multigo]").onclick = () => {
    const v = [...f.querySelectorAll("input:checked")].map((i) => i.value);
    if (v.length >= Number(f.dataset.min || 1)) click(f.dataset.multi, v, f.querySelector("[data-multigo]"));
  });
}

/** Formulář (na Discordu „modal“): políčka a Odeslat. */
function showForm(m, key) {
  const box = $("#dpanel"); if (!box) return;
  box.innerHTML = `<div class="dtext"><h3>${esc(noEmoji(m.title))}</h3></div><form id="dform" class="dform">${m.fields.map((f) => `<label class="lbl">${esc(noEmoji(f.label))}</label>
    ${f.long ? `<textarea name="${esc(f.id)}" maxlength="${f.max}" placeholder="${esc(f.placeholder)}"${f.required ? " required" : ""}>${esc(f.default)}</textarea>`
      : `<input name="${esc(f.id)}" maxlength="${f.max}" placeholder="${esc(f.placeholder)}" value="${esc(f.default)}"${f.required ? " required" : ""}>`}`).join("")}
    <div class="row" style="margin-top:10px"><button class="btn primary" type="submit">${esc(L(["Odeslat", "Send"]))}</button></div></form>`;
  $("#dform").onsubmit = async (e) => {
    e.preventDefault();
    const values = Object.fromEntries(new FormData(e.target).entries());
    try { showPanelResult(await call("modal_submit", { values }), key); } catch { /* chyba už je v toastu */ }
  };
}

// r27-3: kohoutí zápas na webu — stejný zápas jako ve vlákně na Discordu, s malovanou jámou a kohouty (až budou nakreslení)
const KOHOUT = { st: null, timer: null, shown: -1, anim: null };
const ROUND_MS = 5500;                       // tempo jako na Discordu (animace výměny + pauza)
const slugCZ = (t) => String(t || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
function cockArt(c, i) {
  const f = "domov/kohout-" + slugCZ(c.color);
  return artReady(f) ? `<img src="${ART_SRC(f)}" alt="">` : `<svg class="kh-sil" viewBox="0 0 120 120" aria-hidden="true"><path d="M70 18c8-6 18-2 20 6l10 4-9 5c2 10-2 20-9 26l14 22c3 6-1 12-8 12H44c-14 0-26-12-26-27 0-12 8-22 20-25l-10-16c10 0 18 4 24 10 2-9 9-15 18-17z" fill="${i ? "#c9b48a" : "#9c4a2a"}" stroke="#2a1a10" stroke-width="3"/><path d="M68 92v14m14-14v14" stroke="#2a1a10" stroke-width="4"/></svg>`;
}
const pitImg = (night) => artReady("domov/hra-kohouti-jama" + (night ? "-noc" : "")) ? "domov/hra-kohouti-jama" + (night ? "-noc" : "")
  : artReady("domov/hra-kohouti-jama") ? "domov/hra-kohouti-jama" : "mesto-hostinec";
["domov/hra-kohouti-jama", "domov/hra-kohouti-jama-noc", ...["zrzavy", "cerny", "bily", "kropenaty", "zlatavy", "pestry"].map((c) => "domov/kohout-" + c)].forEach((n) => setTimeout(() => artReady(n), 1600));

VIEWS.kohouti = async (view) => {
  clearInterval(KOHOUT.timer); KOHOUT.shown = -1;
  view.replaceChildren(h(`${sceneHead(pitImg(S.me.night), L(["Kohoutí jáma", "The cockpit"]), L(["Za hostincem se sázky hrnou jako pivo.", "Behind the inn the bets flow like beer."]), true)}
    <div class="panel kjama" id="kjama"><div class="empty">…</div></div><div id="kpop"></div>
    <p><button class="btn" data-go="misto/hostinec">← ${esc(t("back"))}</button></p>`));
  mountLive(view);
  view.querySelector("[data-go]").onclick = () => { clearInterval(KOHOUT.timer); go("misto/hostinec"); };
  await cockLoad();
  KOHOUT.timer = setInterval(() => { if (S.tab !== "kohouti") { clearInterval(KOHOUT.timer); return; } cockLoad(true); }, 3000);
};

async function cockLoad(quiet = false) {
  try { KOHOUT.st = (await call("cock", {}, quiet)).cock; } catch { return; }
  if (S.tab === "kohouti") drawCock();
}

function drawCock() {
  const c = KOHOUT.st, box = $("#kjama"); if (!box || !c) return;
  if (c.status === "none" || (c.status === "done" && c.free_in === 0 && !c.rounds.length)) {
    box.innerHTML = `<p>${esc(L(["Jáma je prázdná. Vyvolej zápas — za 3 minuty se kohouti utkají a celé město může sázet.", "The pit is empty. Call a fight."]))}</p>
      <button class="btn primary" id="knew">${esc(L(["Vyvolat kohoutí zápas", "Call a cockfight"]))}</button>`;
    $("#knew").onclick = cockNew; return;
  }
  const idx = c.status === "betting" ? -1 : Math.min(c.rounds.length - 1, Math.floor(c.fight_for * 1000 / ROUND_MS));
  const r = idx >= 0 ? c.rounds[idx] : null;
  const hp = r ? r.hp : [100, 100];
  const fin = c.status === "done" || (r && r.last && c.fight_for * 1000 > (idx + 1) * ROUND_MS - 1500);
  const statLine = (k) => `${esc(L(["Rychlost", "Speed"]))} ${k.stats.Rychlost ?? "?"} · ${esc(L(["Zuřivost", "Fury"]))} ${k.stats.Zuřivost ?? "?"} · ${esc(L(["Síla", "Strength"]))} ${k.stats.Síla ?? "?"}`;
  const side = (k, i) => `<div class="kh kh${i}${fin && c.winner !== i ? " pad" : ""}" id="kh${i}">
      <div class="kh-name"><span class="kh-dot d${i}"></span>${esc(k.name)}</div>
      <div class="kh-hp"><i style="width:${hp[i]}%"></i><span>${hp[i]} / 100</span></div>
      <div class="kh-img">${cockArt(k, i)}</div>
      <div class="kh-stat">${statLine(k)}</div>
      <div class="kh-kurz"><span>${esc(L(["šance", "chance"]))} ${Math.round(c.chance[i] * 100)} %</span><b>${c.odds[i].toFixed(2)}×</b></div>
    </div>`;
  const head = c.status === "betting"
    ? `${esc(L(["Sázky běží, zápas začne za", "Betting open, fight starts in"]))} <b>${c.starts_in} s</b> · ${esc(L(["sázejících", "bettors"]))} ${c.bettors} · ${esc(c.cocks[0].name)} ${c.totals[0]} gr. · ${esc(c.cocks[1].name)} ${c.totals[1]} gr.`
    : fin ? `${esc(L(["Vítěz", "Winner"]))}: <b>${esc(c.cocks[c.winner].name)}</b>${c.report ? " · " + dmdInline(noEmoji(c.report.replace(/^-#\s*/, ""))) : ""}`
    : esc(L(["Sázky uzavřeny — kohouti jsou v jámě!", "Bets closed — the cocks are in the pit!"]));
  const mine = c.my_bet ? `<p class="dim small">${esc(L(["Tvá sázka", "Your bet"]))}: ${c.my_bet.amount} gr. ${esc(L(["na", "on"]))} ${esc(c.cocks[c.my_bet.side].name)}</p>` : "";
  const log = c.rounds.slice(0, idx + 1).map((x) => `<li>${esc(noEmoji(x.text))}</li>`).join("");
  const bets = c.status === "betting" ? `<div class="row">${c.cocks.map((k, i) => `<button class="btn primary" data-kbet="${i}">${esc(L(["Vsadit na", "Bet on"]))} ${esc(k.name)}</button>`).join("")}</div>` : "";
  const again = c.status === "done" ? (c.free_in > 0 ? `<p class="dim small">${esc(L([`Další zápas půjde vyvolat asi za ${Math.ceil(c.free_in / 60)} min.`, `Next fight in about ${Math.ceil(c.free_in / 60)} min.`]))}</p>`
    : `<button class="btn primary" id="knew">${esc(L(["Vyvolat další zápas", "Call another fight"]))}</button>`) : "";
  box.innerHTML = `<div class="kh-arena">${side(c.cocks[0], 0)}<div class="kh-vs">VS</div>${side(c.cocks[1], 1)}</div>
    <p class="kh-head">${head}</p>${mine}${bets}${again}${log ? `<ol class="kh-log">${log}</ol>` : ""}`;
  box.querySelectorAll("[data-kbet]").forEach((b) => b.onclick = () => cockBet(Number(b.dataset.kbet)));
  const nb = $("#knew"); if (nb) nb.onclick = cockNew;
  if (idx !== KOHOUT.shown && r) {                // nová výměna → animace
    KOHOUT.shown = idx;
    const a = $("#kh" + r.att), d = $("#kh" + (1 - r.att));
    if (a) { a.classList.remove("utok"); void a.offsetWidth; a.classList.add("utok"); }
    if (d && r.hit) setTimeout(() => { d.classList.remove("zasah"); void d.offsetWidth; d.classList.add("zasah"); Zvuk.sfx("uder"); }, 350);
    else Zvuk.sfx("uhyb");
  }
}

async function cockNew() {
  try { await call("raid_click", { id: "ks:cock:new", values: [] }); toast(L(["Zápas vyhlášen — za 3 minuty se kohouti utkají. Sázet může celé město.", "Fight called — it starts in 3 minutes."])); }
  catch { /* toast */ }
  cockLoad(true);
}

async function cockBet(i) {
  const pop = $("#kpop"); if (!pop) return;
  try {
    const r = await call("raid_click", { id: "ks:cockbet:" + i, values: [] });
    pop.innerHTML = `<div class="vmodal"><div class="panel"><div id="dpanel"></div><div class="row" style="margin-top:10px"><button class="btn small" id="kclose">${esc(L(["Zavřít", "Close"]))}</button></div></div></div>`;
    $("#kclose").onclick = () => { pop.innerHTML = ""; cockLoad(true); };
    showPanelResult(r, "");
  } catch { /* toast */ }
}

// r27-3: hry proti hráčům a souboje na kolbišti — stejná hra jako ve vlákně na Discordu, obnovuje se sama
const HRACI = { timer: null, last: "", sel: new Set(), busy: false };
VIEWS.hraci = async (view) => {
  clearInterval(HRACI.timer); HRACI.last = ""; HRACI.sel = new Set(); HRACI.bid = null;
  view.innerHTML = `<div id="hstul"><div class="panel"><div class="empty">…</div></div></div>`;
  await hraciLoad();
  HRACI.timer = setInterval(() => { if (S.tab !== "hraci") { clearInterval(HRACI.timer); return; } if (!HRACI.busy) hraciLoad(true); }, 2500);
};
const GAME_TITLE = { cards: ["Oko bere", "Twenty-one"], dice: ["Kostky", "Dice"], liar: ["Lhář", "Liar's dice"], morris: ["Mlýn", "Nine men's morris"],
  darts: ["Šipky", "Darts"], duel: ["Souboj na kolbišti", "Arena duel"] };
const GAME_BG = { cards: "hra-stul-karty", dice: "hra-stul-kostky", liar: "hra-stul-kostky" };
const dieFace = (f, cls = "", attrs = "") => `<span class="kmini ${cls}" ${attrs}><img src="${DOM("hra-kostka-" + f)}" alt="${f}" draggable="false"></span>`;
async function hraciAct(steps, el) {
  if (HRACI.busy) return;
  HRACI.busy = true; if (el) el.disabled = true;
  try { for (const [act, vals] of steps) await call("raid_click", { id: act.startsWith("ks:") ? act : `ks:lv:${act}:${HRACI.gid}`, values: vals || [] }); }
  catch { /* chyba se ukáže sama */ }
  HRACI.busy = false; HRACI.last = ""; await hraciLoad(true);
}
async function hraciLoad(quiet = false) {
  let r;
  try { r = (await call("place", { key: "game" }, quiet)).panel; } catch { return; }
  const box = $("#hstul"); if (!box || S.tab !== "hraci") return;
  box.style.setProperty("--kameny", `url('${DOM("hra-mlyn-kameny-m")}')`);
  if (!r.game) {
    box.innerHTML = `${sceneHead("mesto-hostinec", L(["Hra s hráčem", "Game with a player"]), L(["Vyzvi někoho v hostinci nebo na kolbišti.", "Challenge someone at the inn or the arena."]), true)}
      <div class="panel dpanel"><div class="dtext"><h3>${esc(L(["Žádná rozehraná hra", "No game in progress"]))}</h3>
      <p>${esc(L(["Hráče vyzveš v hostinci (Hry s hráči) nebo na kolbišti (Vyzvat na souboj). Až výzvu přijme, hraje se tady.", "Challenge players at the inn or the arena; once accepted, you play here."]))}</p>
      ${r.last ? `<p class="pozn">${esc(L(["Poslední hra", "Last game"]))}: ${esc(r.last.opponent)} — ${esc(L(["dohráno.", "finished."]))}</p>` : ""}</div>
      <div class="row"><button class="btn primary" data-go="panel/=ks:pvp:menu">${esc(L(["Vyzvat hráče", "Challenge a player"]))}</button>
      <button class="btn" data-go="misto/hostinec">← ${esc(t("back"))}</button></div></div>`;
    box.querySelectorAll("[data-go]").forEach((b) => b.onclick = () => { clearInterval(HRACI.timer); go(b.dataset.go); });
    clearInterval(HRACI.timer); return;
  }
  const sig = JSON.stringify([r.game, r.game.table ? null : r.panel]) + (r.game.kind === "duel" ? (r.panel.image || "").length : "");
  if (sig === HRACI.last) return;                 // nic nového — neblikat a nerušit výběr
  const wasMine = HRACI.myTurn;
  HRACI.last = sig; HRACI.gid = r.game.id; HRACI.myTurn = r.game.my_turn;
  if (r.game.my_turn && !wasMine && r.game.status === "playing") Zvuk.sfx("klik");
  const g = r.game, T_ = g.table;
  const title = L(GAME_TITLE[g.kind] || [g.kind, g.kind]);
  if (g.status === "open" || !T_) {          // výzva: krátká karta s Přijmout / Odmítnout
    box.innerHTML = `${sceneHead("mesto-hostinec", title, L(["Výzva od hráče", "A challenge"]), true)}
      <div class="panel dpanel"><div class="dtext">${panelHtml(r.panel.content)}</div>${controlsHtml(cleanControls(r.panel.controls), "ciste")}
      <p><button class="btn" data-go="misto/hostinec">← ${esc(t("back"))}</button></p></div>`;
    box.querySelectorAll("[data-cid]").forEach((b) => b.onclick = () => hraciAct([[b.dataset.cid]], b));
    box.querySelector("[data-go]").onclick = () => { clearInterval(HRACI.timer); go("misto/hostinec"); };
    return;
  }
  const mine = !T_.done && T_.turn === "me";
  const who = T_.done ? "" : mine ? L(["Jsi na tahu", "Your turn"]) : L(["Hraje", "Playing:"]) + " " + T_.foe;
  const board = { cards: hCards, dice: hDice, liar: hLiar, morris: hMorris, darts: hDarts, duel: hDuel }[g.kind](T_, mine, r);
  const side = `<div class="tablepanel panel hside">
    <h2>${esc(title)}</h2>
    <p class="muted">${esc(T_.me)} <span class="dim">vs</span> ${esc(T_.foe)}${g.stake ? ` · ${esc(L(["sázka", "stake"]))} ${esc(t("coins", g.stake))}` : ""}</p>
    ${who ? `<p class="hkdo${mine ? " ja" : ""}">${esc(who)}</p>` : ""}
    ${board.info || ""}
    ${T_.log && !T_.done ? `<p class="log">${md(noEmoji(T_.log))}</p>` : ""}
    ${T_.done ? `<p class="result">${md(noEmoji(T_.result || L(["Hra skončila.", "Game over."])))}</p>` : board.ctl || ""}
    <div class="row hspodek">${T_.done ? `<button class="btn primary" data-go="panel/=ks:pvp:menu">${esc(L(["Nová výzva", "New challenge"]))}</button>`
      : `<button class="btn small danger" data-h="quit">${esc(t("forfeit"))}</button>${!mine ? `<button class="btn small" data-h="timeout"${T_.timeout_in > 0 ? ` title="${esc(L(["Soupeř má na tah ještě", "Opponent still has"]))} ${Math.ceil(T_.timeout_in / 60)} min"` : ""}>${esc(L(["Soupeř nereaguje", "Opponent idle"]))}</button>` : ""}`}
      <button class="btn small" data-go="misto/hostinec">← ${esc(t("back"))}</button></div></div>`;
  box.innerHTML = `<div class="stul-scena live hry-${g.kind}" data-img="mesto-hostinec" data-key="hostinec">
    <div class="stul${GAME_BG[g.kind] ? "" : " bezpozadi"}"${GAME_BG[g.kind] ? ` style="background-image:url('${DOM(GAME_BG[g.kind])}')"` : ""}>${board.table}</div>${side}</div>`;
  mountLive(box, { still: true });
  box.querySelectorAll("[data-go]").forEach((b) => b.onclick = () => { clearInterval(HRACI.timer); go(b.dataset.go); });
  box.querySelectorAll("[data-h]").forEach((b) => b.onclick = () => hraciAct([[b.dataset.h]], b));
  board.wire?.(box);
}

// --- oko bere proti hráči: tvoje karty vidíš, soupeřovi jen první
function hCards(T_, mine) {
  const seen = HRACI.cards && HRACI.cards.gid === T_.gid ? HRACI.cards : { gid: T_.gid, me: 0, foe: 0 };
  let d = 0;
  const my = T_.hand.map((c, i) => pcard(c, i >= seen.me ? d++ : -1)).join("");
  const foeAll = [...T_.foe_hand, ...Array(Math.max(0, T_.foe_count - T_.foe_hand.length)).fill(null)];
  const his = foeAll.map((c, i) => pcard(c, i >= seen.foe ? d++ : -1)).join("");
  for (let k = 0; k < d; k++) setTimeout(() => Zvuk.sfx("karta"), 120 + k * 180);
  HRACI.cards = { gid: T_.gid, me: T_.hand.length, foe: T_.foe_count };
  return {
    table: `<div class="karty-plocha">
      <div class="ruka hostinsky"><span class="kdo">${esc(T_.foe)}${T_.foe_value != null ? " · " + esc(t("value", T_.foe_value)) : ""}${T_.foe_stand && !T_.done ? " · " + esc(L(["stojí", "stands"])) : ""}</span>${his}</div>
      <div class="balicek">${pcard(null)}${pcard(null)}</div>
      <div class="ruka hrac"><span class="kdo">${esc(T_.me)} · ${esc(t("value", T_.value))}${T_.stand && !T_.done ? " · " + esc(L(["stojíš", "you stand"])) : ""}</span>${my}</div></div>`,
    info: `<p class="muted small">${esc(L(["7–10 podle čísla, spodek 2, svršek 3, král 4, eso 11. Cíl je 21, přes 21 prohráváš, dvě esa jsou oko. Soupeřovi vidíš jen první kartu.", "7–10 by number, under-knave 2, over-knave 3, king 4, ace 11. Aim for 21; over loses; two aces win. You see only the opponent's first card."]))}</p>`,
    ctl: mine && !T_.stand ? `<div class="row"><button class="btn primary" data-a="draw">${esc(t("draw"))}</button><button class="btn" data-a="stand">${esc(t("stand"))}</button></div>` : "",
    wire: (box) => box.querySelectorAll("[data-a]").forEach((b) => b.onclick = () => hraciAct([[b.dataset.a]], b)),
  };
}

// --- kostky (závod na body) proti hráči: hází ten, kdo je na tahu; ty vybíráš kostky kliknutím
function hDice(T_, mine) {
  const key = T_.gid + ":" + T_.dice.join("") + ":" + T_.turn + ":" + T_.turn_points + ":" + T_.kept + ":" + T_.score + ":" + T_.foe_score;
  const fresh = T_.phase === "pick" && HRACI.diceKey !== key;
  if (HRACI.diceKey !== key) HRACI.sel = new Set();
  HRACI.diceKey = key;
  const lay = diceLayout(T_.dice.length, key);
  if (fresh) { Zvuk.sfx("kalisek"); setTimeout(() => Zvuk.sfx("kostky"), 750); }
  const pick = T_.phase === "pick";
  let ctl = "";
  if (mine && pick) ctl = `<p class="dim small">${esc(t("pick_help"))}</p><div class="row"><button class="btn" data-best>${esc(t("pick_best"))}</button>
      <button class="btn primary" data-keep="hold">${esc(t("hold"))}</button><button class="btn" data-keep="bank">${esc(t("bank"))}</button></div>`;
  else if (mine) ctl = `${T_.last ? `<p>${md(noEmoji(T_.last))}</p>` : ""}<div class="row"><button class="btn primary big" style="max-width:260px" data-a="roll">${esc(noEmoji(t("roll", 6 - T_.kept)))}</button>
      ${T_.turn_points ? `<button class="btn" data-a="bankonly">${esc(t("bankonly"))}</button>` : ""}</div>`;
  return {
    table: `<div class="kostky-plocha${fresh ? " hod" : ""}">
      ${pick ? T_.dice.map((f, i) => dieImg(f, i, lay[i], (HRACI.sel.has(i) ? "sel" : "") + (fresh ? " pada" : "") + (mine ? "" : " cizi"))).join("") : ""}
      ${fresh ? lay.map((p, i) => `<img class="letici" src="${DOM("hra-kostka-let-" + (1 + i % 3))}" style="--x:${p.x}%;--y:${p.y}%;--i:${i}" alt="">`).join("") : ""}
      <img class="kalisek ${fresh ? "vysypat" : pick ? "odlozeny" : "stoji"}" src="${DOM("hra-kalisek-m")}" alt=""></div>`,
    info: `<p class="muted small">${esc(t("target", T_.target))} · ${esc(T_.diff)}</p>
      <div class="scores"><div class="score">${esc(T_.me)}<b>${T_.score}</b></div><div class="score">${esc(T_.foe)}<b>${T_.foe_score}</b></div></div>
      ${!T_.done && T_.turn_points ? `<p><b>${esc(t("turn_points", T_.turn_points))}</b></p>` : ""}`,
    ctl,
    wire: (box) => {
      if (mine && pick) box.querySelectorAll(".kostka").forEach((d) => d.onclick = () => {
        const i = Number(d.dataset.i); HRACI.sel.has(i) ? HRACI.sel.delete(i) : HRACI.sel.add(i);
        d.classList.toggle("sel"); d.classList.remove("pada"); Zvuk.sfx("klik");
      });
      const best = box.querySelector("[data-best]");
      if (best) best.onclick = () => { HRACI.sel = new Set(T_.best); box.querySelectorAll(".kostka").forEach((d) => d.classList.toggle("sel", HRACI.sel.has(Number(d.dataset.i)))); Zvuk.sfx("klik"); };
      box.querySelectorAll("[data-keep]").forEach((b) => b.onclick = () => {
        if (!HRACI.sel.size) return;
        Zvuk.sfx("kalisek");
        hraciAct([["sel", [...HRACI.sel].map(String)], [b.dataset.keep]], b);
      });
      box.querySelectorAll("[data-a]").forEach((b) => b.onclick = () => { box.querySelector(".kalisek")?.classList.add("trese"); Zvuk.sfx("kalisek"); hraciAct([[b.dataset.a]], b); });
    },
  };
}

// --- Lhář: tvoje kostky pod kelímkem vidíš jen ty; sázíš počet a hodnotu, nebo voláš „Lžeš!“
function hLiar(T_, mine) {
  if (!HRACI.bid || HRACI.bid.key !== T_.gid + ":" + T_.round + ":" + JSON.stringify(T_.bid)) {
    const lo = T_.min_bid || [1, 2];
    HRACI.bid = { key: T_.gid + ":" + T_.round + ":" + JSON.stringify(T_.bid), c: lo[0], f: lo[1] };
  }
  const B = HRACI.bid, bid = T_.bid;
  const valid = (c, f) => c >= 1 && c <= T_.total && f >= 1 && f <= 6 && (!bid || c > bid.count || (c === bid.count && f > bid.face));
  const rv = T_.reveal && (T_.done || T_.reveal.round === T_.round - 1) ? T_.reveal : null;
  const myDice = T_.dice.map((f, i) => dieFace(f, "moje", `style="--i:${i}"`)).join("") + Array(Math.max(0, T_.max_dice - T_.n)).fill(`<span class="kmini prazdna"></span>`).join("");
  const table = `<div class="lhar-plocha">
    <div class="lhar-soupe"><span class="kdo">${esc(T_.foe)} · ${T_.foe_n} ${esc(L(["kostek", "dice"]))}</span>
      ${rv ? `<div class="lhar-odkryto">${rv.foe.map((f) => dieFace(f, f === rv.face ? "trefa" : "")).join("")}</div>` : `<img class="kalisek-sklopeny" src="${DOM("hra-kalisek-sklopeny-m")}" alt="">`}</div>
    <div class="lhar-sazka">${bid ? `<span>${esc(bid.mine ? L(["Tvoje sázka", "Your bid"]) : L(["Soupeř tvrdí", "Opponent claims"]))}:</span> <b>${bid.count}×</b> ${dieFace(bid.face, "velka")}`
      : `<span class="dim">${esc(L(["Kolo začíná, zatím nikdo nevsadil.", "New round, no bid yet."]))}</span>`}</div>
    <div class="lhar-ja"><span class="kdo">${esc(T_.me)} · ${esc(L(["tvoje kostky", "your dice"]))}</span><div class="lhar-moje">${rv ? rv.mine.map((f) => dieFace(f, f === rv.face ? "trefa" : "")).join("") : myDice}</div></div></div>`;
  const info = `<p class="muted small">${esc(L(["Kolo", "Round"]))} ${T_.round} · ${esc(L(["na stole celkem", "dice in play"]))} ${T_.total}</p>
    ${rv ? `<p class="pozn">${esc(L(["Odkryto", "Revealed"]))}: ${rv.actual}× ${esc(L(["hodnota", "face"]))} ${rv.face} (${esc(L(["sázka byla", "bid was"]))} ${rv.count}×) — ${esc(rv.i_lost ? L(["ztrácíš kostku", "you lose a die"]) : L(["soupeř ztrácí kostku", "opponent loses a die"]))}.</p>` : ""}
    <p class="muted small">${esc(L(["Tvrď, kolik kostek dané hodnoty je pod oběma kelímky dohromady, nebo zvol Lžeš!. Kdo se plete, ztrácí kostku.", "Claim how many dice of a face lie under both cups, or call Liar!. Whoever is wrong loses a die."]))}</p>`;
  const ctl = mine ? `<div class="lhar-volba">
      <div class="row"><span class="muted">${esc(L(["Počet", "Count"]))}</span><button class="btn small" data-c="-1">−</button><b class="lhar-c">${B.c}×</b><button class="btn small" data-c="1">+</button></div>
      <div class="lhar-tvare">${[1, 2, 3, 4, 5, 6].map((f) => `<button class="tvar${f === B.f ? " sel" : ""}" data-f="${f}">${dieFace(f)}</button>`).join("")}</div>
      <div class="row"><button class="btn primary" data-bid${valid(B.c, B.f) ? "" : " disabled"}>${esc(L(["Vsadit", "Bid"]))} ${B.c}× ${B.f}</button>
      <button class="btn danger" data-a="liar"${bid && !bid.mine ? "" : " disabled"}>${esc(L(["Lžeš!", "Liar!"]))}</button></div></div>` : "";
  return { table, info, ctl, wire: (box) => {
    box.querySelectorAll("[data-c]").forEach((b) => b.onclick = () => { B.c = Math.max(1, Math.min(T_.total, B.c + Number(b.dataset.c))); HRACI.last = ""; hraciRedraw(); });
    box.querySelectorAll("[data-f]").forEach((b) => b.onclick = () => { B.f = Number(b.dataset.f); HRACI.last = ""; hraciRedraw(); });
    const bb = box.querySelector("[data-bid]");
    if (bb) bb.onclick = () => { Zvuk.sfx("kalisek"); hraciAct([["bc", [String(B.c)]], ["bf", [String(B.f)]], ["bid"]], bb); };
    box.querySelectorAll("[data-a]").forEach((b) => b.onclick = () => hraciAct([[b.dataset.a]], b));
  } };
}
function hraciRedraw() { hraciLoad(true); }

// --- mlýn: malovaná deska, kameny klikem
const MILL_G = [15.2, 27.9, 39.1, 50.2, 61.4, 72.9, 85.3], MILL_GY = [11.2, 22.6, 34.1, 46.1, 57.7, 68.6, 81.0];
function millXY(i) {
  const r = Math.floor(i / 8), k = i % 8, lo = r, hi = 6 - r, mid = 3;
  const [gx, gy] = [[lo, lo], [mid, lo], [hi, lo], [hi, mid], [hi, hi], [mid, hi], [lo, hi], [lo, mid]][k];
  return [MILL_G[gx], MILL_GY[gy]];
}
function hMorris(T_, mine) {
  const targets = new Set(mine ? T_.targets || [] : []);
  const myCol = T_.gold ? "svetly" : "tmavy", foeCol = T_.gold ? "tmavy" : "svetly";
  const pts = T_.board.map((x, i) => {
    const [px, py] = millXY(i);
    const tg = targets.has(i) ? ` cil cil-${T_.act}` : "";
    const st = x ? `<span class="kamen ${x === "me" ? myCol : foeCol}${T_.sel === i ? " vybrany" : ""}"></span>` : "";
    return `<button class="bod${tg}" data-p="${i}" style="left:${px}%;top:${py}%"${tg ? "" : " tabindex=-1"}>${st}</button>`;
  }).join("");
  const stack = (n, col) => Array(n).fill(`<span class="kamen ${col}"></span>`).join("");
  const help = !mine ? "" : { mp: L(["Polož kámen na volné místo.", "Place a stone."]), mf: L(["Vyber kámen, kterým táhneš.", "Pick a stone to move."]),
    mt: L(["Kam s ním? (nebo vyber jiný kámen)", "Where to? (or pick another stone)"]), mx: L(["Mlýn! Odeber soupeřův kámen.", "A mill! Take an opponent's stone."]) }[T_.act] || "";
  return {
    table: `<div class="mlyn-plocha"><img class="mlyn-deska" src="${DOM("hra-mlyn")}" alt="">${pts}</div>`,
    info: `<div class="mlyn-ruce"><div><span class="muted small">${esc(T_.me)}</span><div class="zasoba">${stack(T_.hand, myCol)}</div></div>
      <div><span class="muted small">${esc(T_.foe)}</span><div class="zasoba">${stack(T_.foe_hand, foeCol)}</div></div></div>
      <p class="muted small">${esc(L(["Tři kameny v řadě jsou mlýn a odebereš soupeři kámen. Prohrává, kdo má méně než tři kameny nebo se nemůže hnout.", "Three in a row make a mill — take an opponent's stone. Fewer than three stones or no move loses."]))}</p>`,
    ctl: mine ? `<p class="hkdo ja">${esc(help)}</p>${T_.act === "mt" ? `<div class="row"><button class="btn small" data-a="mb">${esc(L(["Jiný kámen", "Another stone"]))}</button></div>` : ""}` : "",
    wire: (box) => {
      box.querySelectorAll(".bod.cil").forEach((b) => b.onclick = () => { Zvuk.sfx("klik"); hraciAct([[T_.act, [b.dataset.p]]], b); });
      if (mine && T_.act === "mt") box.querySelectorAll(".bod").forEach((b) => { if (T_.board[b.dataset.p] === "me" && !b.classList.contains("cil")) b.onclick = () => hraciAct([["mb"], ["mf", [b.dataset.p]]], b); });
      box.querySelectorAll("[data-a]").forEach((b) => b.onclick = () => hraciAct([[b.dataset.a]], b));
    },
  };
}

// --- šipky proti hráči: terč, poslední tři šipky a zbytky obou hráčů
function hDarts(T_, mine) {
  const r = rnd(T_.throws_key || "x");
  const spots = (T_.throws || []).map((p) => ({ ...dartSpot(p, r), pts: p }));
  const fresh = T_.throws_key && HRACI.dartsKey !== T_.throws_key && HRACI.dartsKey !== undefined;
  HRACI.dartsKey = T_.throws_key;
  return {
    table: `<div class="terc-plocha"><div class="terc"><img src="${DOM("hra-terc")}" alt="">
      ${spots.map((s, i) => `<span class="zabodnuta${dartCls()}${s.miss ? " mimo" : ""}${fresh ? " letí" : ""}" data-i="${i}" style="left:${s.x}%;top:${s.y}%">${dartHtml()}</span>`).join("")}</div></div>`,
    info: `<div class="scores"><div class="score">${esc(T_.me)}<b>${T_.left}</b></div><div class="score">${esc(T_.foe)}<b>${T_.foe_left}</b></div></div>
      <p class="muted small">${esc(L(["Oba od 201 dolů přesně na nulu, tři šipky za tah. Přehodíš-li zbytek, tah propadá. Zavírat lze od 60, Obratnost pomáhá.", "Both start at 201 and go down to exactly zero, three darts a turn. Overshoot voids the turn. Finish from 60; Dexterity helps."]))}</p>`,
    ctl: mine ? `<div class="row">${["safe", "risky", "bull", "finish"].map((a) => `<button class="btn${a === "safe" ? " primary" : ""}" data-a="${a}"${a === "finish" && T_.left > 60 ? " disabled" : ""}>${esc(noEmoji(t("aim_" + a)))}</button>`).join("")}</div>` : "",
    wire: (box) => {
      if (fresh) box.querySelectorAll(".zabodnuta.letí").forEach((el, i) => setTimeout(() => { Zvuk.sfx("sipka"); setTimeout(() => { el.classList.remove("letí"); Zvuk.sfx(el.classList.contains("mimo") ? "mimo" : "zasah"); }, 330); }, i * 650));
      box.querySelectorAll("[data-a]").forEach((b) => b.onclick = () => hraciAct([[b.dataset.a]], b));
    },
  };
}

// --- souboj: malované kolbiště, obě postavy složené z vrstev jako v kartě postavy, tahy v čistých tlačítkách
function hDuel(T_, mine, r) {
  const ctl = (r.panel.controls || []).filter((c) => !/:(quit|timeout):/.test(c.id));
  const hpKey = T_.mefig.hp + ":" + T_.foefig.hp;
  const hitMe = HRACI.duelHp && HRACI.duelHp.gid === T_.gid && T_.mefig.hp < HRACI.duelHp.me;
  const hitFoe = HRACI.duelHp && HRACI.duelHp.gid === T_.gid && T_.foefig.hp < HRACI.duelHp.foe;
  const dmgMe = hitMe ? HRACI.duelHp.me - T_.mefig.hp : 0, dmgFoe = hitFoe ? HRACI.duelHp.foe - T_.foefig.hp : 0;
  HRACI.duelHp = { gid: T_.gid, me: T_.mefig.hp, foe: T_.foefig.hp };
  if (hitMe || hitFoe) Zvuk.sfx("mec");
  const fighter = (f, side, hit, dmg) => `<div class="bojovnik ${side}${hit ? " zasazen" : ""}${(side === "ja") === (T_.turn === "me") && !T_.done ? " natahu" : ""}">
    <div class="bojovnik-fig">${Postava.html(f, IMG_BASE)}</div>
    ${dmg ? `<b class="body-tag rana">−${dmg}</b>` : ""}
    <div class="bojovnik-hud"><b>${esc(f.name)}</b> <span class="dim small">${esc(L(["úr.", "lv."]))} ${f.level}${f.origin ? " · " + esc(f.origin) : ""}</span>
      <span class="vval">${esc(L(["Zdraví", "Health"]))} ${f.hp}/${f.max}</span>${bar(f.hp, f.max, "hp big")}
      <span class="vval">${esc(L(["Výdrž", "Stamina"]))} ${f.st}/${f.st_max}</span>${bar(f.st, f.st_max, "st")}
      ${f.weapon ? `<span class="dim small">${esc(f.weapon)}</span>` : ""}</div></div>`;
  return {
    table: `<div class="kolbiste-plocha"><div class="pozadi" style="background-image:url('${IMG_BASE}mesto-kolbiste-m.webp')"></div>${fighter(T_.mefig, "ja", hitMe, dmgMe)}${fighter(T_.foefig, "on", hitFoe, dmgFoe)}</div>`,
    info: T_.stance ? `<p class="pozn">${esc(L(["Tvůj postoj na soupeřův příští útok", "Your stance for the next attack"]))}: ${esc({ guard: L(["krytí", "guard"]), dodge: L(["úhyb", "dodge"]), counter: L(["protiútok", "counter"]) }[T_.stance] || T_.stance)}</p>` : "",
    ctl: mine ? controlsHtml(cleanControls(ctl), "ciste") : "",
    wire: (box) => box.querySelectorAll(".hside [data-cid]").forEach((b) => b.onclick = () => hraciAct([[b.dataset.cid]], b)),
  };
}

// Domov: dům ve městě nebo chalupa za hradbami — malovaná místnost a ovládání jako na Discordu
const ROOM_IMG = { "světnice": "domov/dum-svetnice", "zbrojnice": "domov/dum-zbrojnice", "síň trofejí": "domov/dum-sin-trofeji", "komnata odznaků": "domov/dum-komnata-odznaku" };
VIEWS.domov = async (view) => {
  const m = S.me;
  if (!m.house) { go("panel/houses"); return; }
  const chal = m.house === "chalupa";
  const img = chal ? (artReady("domov/chalupa-svetnice") ? "domov/chalupa-svetnice" : "domov/dum-svetnice") : ROOM_IMG[m.house_room] || "domov/dum-svetnice";
  view.replaceChildren(h(`${sceneHead(img, chal ? L(["Tvá chalupa", "Your cottage"]) : L(["Tvůj dům", "Your house"]),
      chal ? L(["Roubená chalupa za hradbami.", "A log cottage outside the walls."]) : L(["Měšťanský dům pod Vlašským dvorem.", "A burgher house below the Italian Court."]))}
    <div class="panel dpanel" id="dpanel"><div class="empty">…</div></div>
    <p><button class="btn" id="pback">← ${esc(t("back"))}</button></p>`));
  mountLive(view);
  $("#pback").onclick = () => go(chal ? "misto/brana" : "misto/dum");
  try {
    const r = await call("place", { key: "home" });
    if (S.tab !== "domov") return;
    showPanelResult(r, "home");
    const room = document.querySelector("[data-sel='ks:home:room']");
    if (room) room.addEventListener("change", () => setTimeout(() => { if (S.tab === "domov") render(); }, 900));
  } catch { /* toast */ }
};

VIEWS.obchod = async (view) => {
  const shopId = S.arg;
  const u = SHOPS_UI[shopId] || { img: "mesto-trziste", say: ["", ""] };
  const back = shopId === "Hostinský" ? "misto/hostinec" : shopId === "Kovář" || shopId === "Mlynář" ? "mesto" : "misto/trziste";
  view.replaceChildren(h(`${sceneHead(u.img, shopId, L(u.say), true)}
    ${S.me.on_raid ? `<div class="panel notice" style="margin:14px 0">🗺️ ${esc(t("on_raid"))}</div>` : ""}
    <div class="panel shoppanel" id="shop"><div class="empty">…</div></div>
    <p><button class="btn" id="back">← ${esc(t("back"))}</button></p>`));
  mountLive(view);
  $("#back").onclick = () => go(back);
  let data;
  try { data = await call("shop", { shop: shopId }); } catch { return; }
  const box = $("#shop");
  if (!box || S.arg !== shopId) return;
  view.querySelector(".scene-cap h2").textContent = data.name;
  const lvl = S.me.level;
  const drawShop = (q = "") => {
    const rows = data.items.filter((i) => !q || i.name.toLowerCase().includes(q.toLowerCase()));
    $("#shop-items").innerHTML = rows.length ? rows.map((i) => `<div class="item">${icon(i.id)}
      <div><div class="nm">${esc(i.name)}${i.level > lvl ? `<span class="tag lock">${esc(t("from_level", i.level))}</span>` : ""}</div>
      <div class="meta">${esc(i.slot_name)}${i.count ? " · " + esc(t("have", i.count)) : ""}${i.count && i.sell ? " · " + esc(t("buys_for", t("coins", i.sell))) : ""}</div></div>
      <div class="acts"><span class="price">${esc(t("coins", i.price))}</span>
        <button class="btn small primary" data-buy="${esc(i.id)}"${i.level > lvl || i.price > S.me.coins ? " disabled" : ""}>${esc(t("buy"))}</button>
        ${i.count && i.sell ? `<button class="btn small" data-sell="${esc(i.id)}" data-name="${esc(i.name)}" data-price="${esc(i.sell)}">${esc(t("sell"))}</button>` : ""}
      </div></div>`).join("") : `<div class="empty">${esc(t("empty"))}</div>`;
    box.querySelectorAll("[data-buy]").forEach((b) => b.onclick = () => call("buy", { item: b.dataset.buy })
      .then((r) => { Zvuk.sfx("mince"); toast(t("bought", r.price)); render(); }).catch(() => {}));
    box.querySelectorAll("[data-sell]").forEach((b) => b.onclick = () => {
      if (confirm(t("sell_q", b.dataset.name, t("coins", b.dataset.price)))) call("sell", { item: b.dataset.sell, shop: shopId }).then((r) => { Zvuk.sfx("mince"); toast(t("sold", r.price)); render(); }).catch(() => {});
    });
    loadIcons(rows.map((i) => i.id));
  };
  const mins = data.restock_min || 0;
  const left = mins >= 60 ? t("hm", Math.floor(mins / 60), mins % 60) : t("m", mins);
  const grain = shopId === "Mlynář" ? (data.items.find((i) => i.id === "Obilí") || {}).count || 0 : 0;
  box.replaceChildren(h(`${shopId === "Mlynář" ? `<div class="panel notice" style="margin-bottom:12px">⚙️ ${esc(L(["Mlynář ti semele obilí na mouku za 1 groš za pytel.", "The miller grinds your grain into flour for 1 groschen a sack."]))}
      <button class="btn small primary" id="mill"${grain ? "" : " disabled"}>${esc(L(["Semlít obilí", "Grind grain"]))}${grain ? ` (${grain}×)` : ""}</button></div>` : ""}
    <div class="spread"><span class="dim small">🔄 ${esc(t("restock", left))}</span><input class="search" id="shop-q" type="search" placeholder="${esc(t("search"))}"></div>
    <div class="items" id="shop-items"></div>`));
  const millBtn = $("#mill");
  if (millBtn) millBtn.onclick = () => call("mill").then((r) => { Zvuk.sfx("mince"); toast(L([`Semleto: ${r.milled}× mouka za ${r.paid} gr.`, `Ground: ${r.milled}× flour for ${r.paid} gr.`])); render(); }).catch(() => {});
  $("#shop-q").oninput = (e) => drawShop(e.target.value.trim());
  drawShop();
};

// --- hostinec: kostky, oko bere a šipky s animacemi (r26-2)
// Kostky: malované kostky shora (img/domov/hra-kostka-1..6), letící kostky (hra-kostka-let-1..3) a kožený kalíšek.
// Měřítko jako ve skutečnosti: kalíšek asi 9 cm, kostka 1,6 cm → kalíšek je zhruba 5× vyšší než kostka.
const DOM = (n) => IMG_BASE + "domov/" + n + ".webp";
// r27-2: grafika, která se teprve kreslí. Dokud obrázek v repu grafiky není, zůstává kreslená náhrada (SVG);
// jakmile se obrázek nahraje, web ho použije sám — v kódu se nic nemění. Stav se zjišťuje jednou za načtení stránky.
const ART = new Map();
function artReady(name) {             // name = cesta v img/ bez .webp, např. "domov/karta-eso-srdce"
  let a = ART.get(name);
  if (!a) {
    a = { st: "wait" };
    const im = new Image();
    im.onload = () => { a.st = "ok"; };
    im.onerror = () => { a.st = "no"; };
    im.src = IMG_BASE + name + "-m.webp";
    ART.set(name, a);
  }
  return a.st === "ok";                 // ještě se načítá → zatím náhrada (nepřekreslujeme, ať se nepřeruší animace hry)
}
const ART_SRC = (name) => IMG_BASE + name + "-m.webp";
const SUIT_FILE = { "♥": "srdce", "♦": "kule", "♠": "list", "♣": "zalud" };
const FIG_FILE = { S: "spodek", Q: "svrsek", K: "kral" };
// Dopředu zjistit, co už je nakreslené (karty, šipky), ať je to připravené, než hráč otevře hru.
setTimeout(() => {
  for (const f of Object.values(SUIT_FILE)) {
    artReady("domov/karta-symbol-" + f); artReady("domov/karta-eso-" + f);
    for (const k of Object.values(FIG_FILE)) artReady(`domov/karta-${k}-${f}`);
  }
  ["domov/hra-sipka-zabodnuta", "domov/hra-sipky-sada"].forEach(artReady);
}, 1500);
const rnd = (seed) => { let x = 0; for (const c of String(seed)) x = (x * 31 + c.charCodeAt(0)) >>> 0; return () => ((x = (x * 1664525 + 1013904223) >>> 0) / 4294967296); };
/** Rozmístění kostek na stole: mřížka 3 × 2 s náhodným posunem a natočením (stejné pro stejný hod). */
function diceLayout(n, seed) {
  const r = rnd(seed), out = [], cols = Math.min(3, n), rows = Math.ceil(n / 3);
  for (let i = 0; i < n; i++) {
    const c = i % 3, w = i < (rows - 1) * 3 ? cols : n - (rows - 1) * 3, row = Math.floor(i / 3);
    out.push({ x: 50 + (c - (w - 1) / 2) * 17 + (r() - .5) * 7, y: 50 + (row - (rows - 1) / 2) * 24 + (r() - .5) * 8, rot: (r() - .5) * 70 });
  }
  return out;
}
const dieImg = (face, i, p, cls = "") => `<button class="kostka ${cls}" data-i="${i}" style="left:${p.x}%;top:${p.y}%;--rot:${p.rot}deg;--i:${i}" aria-label="${face}">
  <img src="${DOM("hra-kostka-" + face)}" alt="${face}" draggable="false"></button>`;

// Karty: české (německé) barvy — srdce, kule, listy, žaludy; ♥ srdce, ♦ kule, ♠ listy, ♣ žaludy.
// r27-2: dobový vzhled podle karet 15. století — dřevořez (černá kresba) kolorovaný přes šablonu, barva trochu
// „ujetá“ vedle obrysu, ruční papír, římské číslice v páscích nahoře a dole, horní půlka obrazu zrcadlená dolů.
const INK = "#1d140b";
const SUIT = {
  "♥": { n: ["srdce", "hearts"], c: "#b8432c",
    f: '<path d="M50 90C20 66 8 48 8 31 8 17 18 8 31 8c9 0 15 5 19 12 4-7 10-12 19-12 13 0 23 9 23 23 0 17-12 35-42 59z"/>',
    d: '<path d="M30 20c-8 2-12 8-12 15M66 20c5 1 9 5 10 10" stroke-width="2.5"/><path d="M50 30v40M42 46l8 8 8-8" stroke-width="1.6" opacity=".55"/>' },
  "♦": { n: ["kule", "bells"], c: "#d2962e",
    f: '<circle cx="50" cy="56" r="33"/>',
    d: '<path d="M17 52h66M18 60h64" stroke-width="2.5"/><circle cx="50" cy="76" r="6" fill="' + INK + '"/><path d="M50 76v12" stroke-width="3"/>' +
       '<path d="M40 14c0-7 20-7 20 0v9H40z" fill="#9a6a24"/><path d="M30 36c4-7 11-11 18-12" stroke-width="2"/><path d="M28 70l6 6M66 76l6-6M72 66l6-4" stroke-width="1.6" opacity=".6"/>' },
  "♠": { n: ["listy", "leaves"], c: "#5d8a45",
    f: '<path d="M50 6C80 28 92 52 76 72c-8 10-18 9-24 4h-4c-6 5-16 6-24-4C8 52 20 28 50 6z"/>',
    d: '<path d="M50 14v80" stroke-width="3.2"/><path d="M50 34l-15-9M50 34l15-9M50 50l-19-10M50 50l19-10M50 64l-14-8M50 64l14-8" stroke-width="2"/>' },
  "♣": { n: ["žaludy", "acorns"], c: "#8c5a2c",
    f: '<ellipse cx="50" cy="63" rx="21" ry="27"/>',
    d: '<path d="M25 46c0-15 11-23 25-23s25 8 25 23c-9 5-41 5-50 0z" fill="#c9a24a"/><path d="M29 36l42 0M27 42h46M33 30h34" stroke-width="1.6"/>' +
       '<path d="M38 30l4 14M46 26l2 18M54 26l-2 18M62 30l-4 14" stroke-width="1.4" opacity=".8"/><path d="M50 23V12" stroke-width="5" stroke-linecap="round"/>' +
       '<path d="M41 58c0 10 3 18 8 22" stroke-width="1.8" opacity=".55"/>' },
};
/** Barva jako dřevořez: barevná skvrna o kousek vedle (šablona) a přes ni černý obrys a šrafy. */
const suitWood = (s) => { const k = SUIT[s]; if (!k) return "";
  return `<g transform="translate(2.6 2.2)" fill="${k.c}" opacity=".92">${k.f}</g><g fill="none" stroke="${INK}" stroke-width="3.6" stroke-linejoin="round">${k.f}</g>` +
         `<g fill="none" stroke="${INK}" stroke-linecap="round">${k.d}</g>`; };
const suitSvg = (s, cls = "") => SUIT_FILE[s] && artReady("domov/karta-symbol-" + SUIT_FILE[s])
  ? `<img class="barva ${cls}" src="${ART_SRC("domov/karta-symbol-" + SUIT_FILE[s])}" alt="" draggable="false">`
  : `<svg class="barva ${cls}" viewBox="0 0 100 100" aria-hidden="true">${suitWood(s)}</svg>`;
const ROMAN = { 7: "VII", 8: "VIII", 9: "IX", 10: "X" };
// Rozložení „ok“ na kartě jako na starých listech: dva sloupce, dolní polovina obrácená (x, y v % plochy).
const PIPS = {
  7: [[28, 10], [72, 10], [50, 30], [28, 50], [72, 50], [28, 90], [72, 90]],
  8: [[28, 12], [72, 12], [28, 37], [72, 37], [28, 63], [72, 63], [28, 88], [72, 88]],
  9: [[28, 12], [72, 12], [28, 37], [72, 37], [50, 50], [28, 63], [72, 63], [28, 88], [72, 88]],
  10: [[26, 10], [74, 10], [50, 23], [26, 37], [74, 37], [26, 63], [74, 63], [50, 77], [26, 90], [74, 90]],
};
const FIG_SIGN = { S: "✦", Q: "⚜", K: "♛" };   // náhrada, dokud nejsou malované figury
function pcard(c, deal = -1) {
  const st = deal >= 0 ? ` style="--d:${deal * .18}s"` : "", dc = deal >= 0 ? " deal" : "";
  if (!c) return `<div class="karta rub${dc}"${st}><img src="${DOM("hra-rub-karty-m")}" alt=""></div>`;
  const [r, s] = c, en = 0;   // české karty mají vždy české názvy (spodek, svršek, král, eso)
  const fig = ["S", "Q", "K"].includes(r), num = !!PIPS[r];
  const label = num ? ROMAN[r] : (T.rank[en][r] || r);
  let mid;
  const art = SUIT_FILE[s] && (r === "A" ? "domov/karta-eso-" + SUIT_FILE[s] : fig ? `domov/karta-${FIG_FILE[r]}-${SUIT_FILE[s]}` : "");
  if (art && artReady(art)) mid = `<div class="obraz-k${r === "A" ? " eso-obr" : ""}"><img src="${ART_SRC(art)}" alt="" draggable="false"></div>`;   // r27-2: malovaná figura / eso
  else if (r === "A") mid = `<div class="eso">${suitSvg(s, "velka")}</div>`;
  else if (fig) mid = `<div class="figura-k${r === "Q" ? " nahore" : r === "S" ? " dole" : ""}"><span class="znak">${FIG_SIGN[r]}</span>${suitSvg(s, "stredni")}</div>`;
  else mid = `<div class="pipy">${PIPS[r].map(([x, y]) => `<span class="oko${y > 52 ? " obr" : ""}" style="left:${x}%;top:${y}%">${suitSvg(s)}</span>`).join("")}</div>`;
  return `<div class="karta dobova${dc}"${st} aria-label="${esc(T.rank_long[en][r] || r)} ${esc(SUIT[s]?.n[en] || s)}">
    <span class="pasek">${esc(label)}</span>${mid}<span class="pasek dole">${esc(label)}</span></div>`;
}

const tableShell = (bg, body, side = "") => `<div class="stul-scena live" data-img="mesto-hostinec" data-key="hostinec">
  <div class="stul" style="background-image:url('${DOM(bg)}')">${body}</div>${side}</div>`;

VIEWS.hra = async (view) => {
  const kind = ["cards", "darts"].includes(S.arg) ? S.arg : "dice";
  if (kind === "darts") return darts(view);
  if (!S.inn) {
    view.innerHTML = "";
    try { S.inn = await call("inn"); } catch { return; }
    if (S.tab !== "hra") return;
  }
  const st = S.inn;
  const send = (op, data = {}) => call(op, data).then((r) => {
    if (r.game) { S.inn = { ...S.inn, game: r.game }; S.sel.clear(); }
    if (op === "inn_start" || r.game?.status !== "playing") call("me", {}, true).catch(() => {});
    if (r.game?.status === "done") setTimeout(() => Zvuk.sfx(/vyhr|won|win/i.test(r.game.result) ? "vyhra" : "prohra"), 900);
    render();
  }).catch(() => { S.inn = null; render(); });
  const g = st.game;
  if (!g || g.kind !== kind && g.status !== "playing") {
    const stake = Number(store.get("stake", st.stakes[0])) || st.stakes[0];
    const diff = store.get("diff", st.difficulty?.[0]?.id);
    view.replaceChildren(h(tableShell(kind === "dice" ? "hra-stul-kostky" : "hra-stul-karty",
      kind === "dice" ? `<img class="kalisek stoji" src="${DOM("hra-kalisek-m")}" alt="">` : `<div class="balicek">${pcard(null)}${pcard(null)}${pcard(null)}</div>`,
      `<div class="tablepanel panel">
      <h2>${kind === "dice" ? "🎲 " + esc(t("dice")) : "🃏 " + esc(t("cards"))}</h2>
      ${S.me.on_raid ? `<div class="panel notice" style="margin-bottom:12px">🗺️ ${esc(t("on_raid"))}</div>` : ""}
      ${st.last_result ? `<p class="muted"><span>${esc(t("last_result"))}:</span> ${md(st.last_result)}</p>` : ""}
      <p class="muted small">${esc(t(kind === "dice" ? "dice_rules" : "cards_rules"))}</p>
      <div class="row" style="margin:12px 0"><label for="stake" class="muted">${esc(t("stake"))}</label>
        <select id="stake">${st.stakes.map((s) => `<option value="${s}"${s === stake ? " selected" : ""}>${esc(t("coins", s))}</option>`).join("")}</select>
        ${kind === "dice" ? `<label for="diff" class="muted">${esc(t("difficulty"))}</label>
        <select id="diff">${(st.difficulty || []).map((d) => `<option value="${esc(d.id)}"${d.id === diff ? " selected" : ""}>${esc(d.name)} · ${esc(t("target", d.target))}</option>`).join("")}</select>` : ""}
        <span class="dim small">🪙 ${esc(t("coins", S.me.coins))}</span></div>
      <div class="row"><button class="btn primary big" style="max-width:240px" data-start="${kind}">${esc(t("play"))}</button>
      <button class="btn" data-go="misto/hostinec">← ${esc(t("back"))}</button></div></div>`)));
    mountLive(view, { still: true });
    view.querySelectorAll("[data-go]").forEach((b) => b.onclick = () => go(b.dataset.go));
    view.querySelectorAll("[data-start]").forEach((b) => b.onclick = () => {
      const data = { kind: b.dataset.start, stake: Number($("#stake").value) };
      store.set("stake", data.stake);
      if (data.kind === "dice" && $("#diff")) { data.diff = $("#diff").value; store.set("diff", data.diff); }
      Zvuk.sfx(data.kind === "dice" ? "kalisek" : "michani");
      S.anim = { new: true };
      send("inn_start", data);
    });
    return;
  }
  const over = g.status !== "playing";
  let table = "", side = "";
  if (g.kind === "dice") {
    const key = g.id + ":" + g.dice.join("") + ":" + g.score + ":" + g.turn_points + ":" + g.left;
    const fresh = g.phase === "pick" && S.diceKey !== key;
    S.diceKey = key;
    const lay = diceLayout(g.dice.length, key);
    table = `<div class="kostky-plocha${fresh ? " hod" : ""}">
      ${g.phase === "pick" ? g.dice.map((f, i) => dieImg(f, i, lay[i], (S.sel.has(i) ? "sel" : "") + (fresh ? " pada" : ""))).join("") : ""}
      ${fresh ? lay.map((p, i) => `<img class="letici" src="${DOM("hra-kostka-let-" + (1 + i % 3))}" style="--x:${p.x}%;--y:${p.y}%;--i:${i}" alt="">`).join("") : ""}
      <img class="kalisek ${fresh ? "vysypat" : g.phase === "pick" ? "odlozeny" : "stoji"}" src="${DOM("hra-kalisek-m")}" alt="">
    </div>`;
    side = `<div class="tablepanel panel"><h2>🎲 ${esc(t("dice"))} · ${esc(t("target", g.target))}</h2>
      <p class="muted">${esc(t("stake"))}: ${esc(t("coins", g.stake))}</p>
      <div class="scores"><div class="score">${esc(t("you"))}<b>${esc(g.score)}</b></div><div class="score">${esc(t("host"))}<b>${esc(g.host_score)}</b></div></div>
      ${g.log ? `<p class="log">${md(g.log)}</p>` : ""}
      ${!over && g.turn_points ? `<p><b>${esc(t("turn_points", g.turn_points))}</b></p>` : ""}`;
    if (!over && g.phase === "pick") {
      side += `<p class="dim small">${esc(t("pick_help"))}</p>
        <div class="row"><button class="btn" id="best">${esc(t("pick_best"))}</button>
        <button class="btn primary" data-dice="hold">${esc(t("hold"))}</button>
        <button class="btn" data-dice="bank">${esc(t("bank"))}</button></div>`;
    } else if (!over) {
      side += `${g.last ? `<p>${md(g.last)}</p>` : ""}
        <div class="row"><button class="btn primary big" style="max-width:260px" data-dice="roll">${esc(t("roll", g.left))}</button>
        ${g.turn_points ? `<button class="btn" data-dice="bankonly">${esc(t("bankonly"))}</button>` : ""}</div>`;
    }
    if (fresh) { Zvuk.sfx("kalisek"); setTimeout(() => Zvuk.sfx("kostky"), 750); }
  } else {
    const prev = S.cardsSeen && S.cardsSeen.id === g.id ? S.cardsSeen : { id: g.id, me: 0, host: 0 };
    const hostAll = [...g.host_hand, ...Array(g.host_hidden || 0).fill(null)];
    let d = 0;
    const mine = g.hand.map((c, i) => pcard(c, i >= prev.me ? d++ : -1)).join("");
    const his = hostAll.map((c, i) => pcard(c, i >= prev.host || (c && prev.hidden && i >= prev.host - prev.hidden) ? d++ : -1)).join("");
    if (d) { for (let k = 0; k < d; k++) setTimeout(() => Zvuk.sfx("karta"), 120 + k * 180); }
    S.cardsSeen = { id: g.id, me: g.hand.length, host: hostAll.length, hidden: g.host_hidden || 0 };
    table = `<div class="karty-plocha">
      <div class="ruka hostinsky"><span class="kdo">${esc(t("host"))}${g.host_value != null ? " · " + esc(t("value", g.host_value)) : ""}</span>${his}</div>
      <div class="balicek">${pcard(null)}${pcard(null)}</div>
      <div class="ruka hrac"><span class="kdo">${esc(t("you"))} · ${esc(t("value", g.value))}</span>${mine}</div></div>`;
    side = `<div class="tablepanel panel"><h2>🃏 ${esc(t("cards"))}</h2><p class="muted">${esc(t("stake"))}: ${esc(t("coins", g.stake))}</p>
      ${g.log ? `<p class="log">${md(g.log)}</p>` : ""}
      ${!over && !g.stand ? `<div class="row"><button class="btn primary" data-cards="draw">${esc(t("draw"))}</button>
        <button class="btn" data-cards="stand">${esc(t("stand"))}</button></div>` : ""}`;
  }
  if (over) side += `<p class="result">${md(g.result)}</p><div class="row"><button class="btn primary" id="again">${esc(t("again"))}</button>
      <button class="btn" data-go="misto/hostinec">← ${esc(t("back"))}</button></div>`;
  else side += `<p style="margin-top:18px"><button class="btn small danger" id="forfeit">${esc(t("forfeit"))}</button></p>`;
  side += "</div>";
  view.replaceChildren(h(tableShell(g.kind === "dice" ? "hra-stul-kostky" : "hra-stul-karty", table, side)));
  mountLive(view, { still: true });
  view.querySelectorAll("[data-go]").forEach((b) => b.onclick = () => go(b.dataset.go));
  view.querySelectorAll(".kostka").forEach((d) => d.onclick = () => {
    const i = Number(d.dataset.i); S.sel.has(i) ? S.sel.delete(i) : S.sel.add(i);
    d.classList.toggle("sel"); d.classList.remove("pada"); Zvuk.sfx("klik");
  });
  const best = $("#best");
  if (best) best.onclick = () => { S.sel = new Set(g.best); view.querySelectorAll(".kostka").forEach((d) => d.classList.toggle("sel", S.sel.has(Number(d.dataset.i)))); Zvuk.sfx("klik"); };
  view.querySelectorAll("[data-dice]").forEach((b) => b.onclick = () => {
    const action = b.dataset.dice;
    if (action === "roll" || action === "hold") view.querySelector(".kalisek")?.classList.add("trese");
    if (action === "roll" || action === "hold") Zvuk.sfx("kalisek");
    send("dice", action === "hold" || action === "bank" ? { action, idxs: [...S.sel] } : { action });
  });
  view.querySelectorAll("[data-cards]").forEach((b) => b.onclick = () => send("cards", { action: b.dataset.cards }));
  const ff = $("#forfeit");
  if (ff) ff.onclick = () => send("forfeit");
  const again = $("#again");
  if (again) again.onclick = () => { S.inn = null; go("hra/" + (g.kind === "cards" ? "cards" : "dice")); };
};

// --- šipky: cvičný hod na slaměný terč (výsledek losuje server podle Obratnosti, jako na Discordu)
// Terč je soustředný: střed = 50, tmavý kruh kolem = 25, první žlutý = trojité (60), dál menší body.
const TERC = { cx: 49.4, cy: 50.6, r: 45.5 };          // střed a poloměr slaměného terče v % obrázku
function dartSpot(pts, rnd = Math.random) {
  let rr;
  if (pts === 50) rr = .02 + rnd() * .05;
  else if (pts === 25) rr = .12 + rnd() * .06;
  else if (pts === 60) rr = .24 + rnd() * .05;
  else if (pts <= 0) rr = 1.06 + rnd() * .12;
  else rr = .34 + (20 - Math.min(20, pts)) / 19 * .55 + rnd() * .04;
  const a = rnd() * Math.PI * 2;
  return { x: TERC.cx + Math.cos(a) * rr * TERC.r, y: TERC.cy + Math.sin(a) * rr * TERC.r, miss: pts <= 0 };
}
const DART = `<svg viewBox="0 0 40 160" class="sipka-svg" aria-hidden="true"><path d="M20 0l3 22h-6z" fill="#cfd3d6" stroke="#555" stroke-width="1"/>
  <rect x="17" y="21" width="6" height="88" rx="2" fill="#8a5a2b"/><rect x="16" y="40" width="8" height="4" fill="#3a2410"/>
  <path d="M20 104L6 150l14-12 14 12z" fill="#e8dcc0" stroke="#6b5631"/><path d="M20 104v46" stroke="#6b5631"/></svg>`;
// r27-2: malovaná šipka zabodnutá v terči (pohled zepředu), dokud není, kreslená SVG
const dartArt = () => artReady("domov/hra-sipka-zabodnuta");
const dartHtml = () => dartArt() ? `<img class="sipka-obr" src="${ART_SRC("domov/hra-sipka-zabodnuta")}" alt="" draggable="false">` : DART;
const dartCls = () => dartArt() ? " obr" : "";

function darts(view) {
  const D = S.darts || (S.darts = { left: 201, turns: 0, log: [], stuck: [] });
  const aims = ["safe", "risky", "bull", "finish"];
  view.replaceChildren(h(`<div class="stul-scena live" data-img="mesto-hostinec" data-key="hostinec">
    <div class="terc-plocha"><div class="terc"><img src="${DOM("hra-terc")}" alt="">${D.stuck.map((s) => `<span class="zabodnuta${dartCls()}" style="left:${s.x}%;top:${s.y}%">${dartHtml()}</span>`).join("")}</div></div>
    <div class="tablepanel panel"><h2>${artReady("domov/hra-sipky-sada") ? `<img class="h2-ikona" src="${ART_SRC("domov/hra-sipky-sada")}" alt="">` : "🎯"} ${esc(t("darts"))}</h2>
      <p class="muted small">${esc(t("darts_rules"))}</p>
      <div class="scores"><div class="score">${esc(t("left_lbl"))}<b id="dleft">${D.left}</b></div><div class="score">${esc(t("turn_lbl"))}<b>${D.turns}</b></div></div>
      <p class="log" id="dlog">${D.log.slice(-3).map(esc).join("<br>")}</p>
      <div class="row" id="aims">${D.left === 0 ? "" : aims.map((a) => `<button class="btn${a === "safe" ? " primary" : ""}" data-aim="${a}"${a === "finish" && D.left > 60 ? " disabled" : ""}>${esc(t("aim_" + a))}</button>`).join("")}</div>
      <div class="row" style="margin-top:12px"><button class="btn small" id="dnew">${esc(t("new_game"))}</button>
      <button class="btn" data-go="misto/hostinec">← ${esc(t("back"))}</button></div></div></div>`));
  mountLive(view, { still: true });
  view.querySelector("[data-go]").onclick = () => go("misto/hostinec");
  $("#dnew").onclick = () => { S.darts = null; render(); };
  const board = view.querySelector(".terc");
  view.querySelectorAll("[data-aim]").forEach((b) => b.onclick = async () => {
    view.querySelectorAll("[data-aim]").forEach((x) => { x.disabled = true; });
    let r;
    try { r = await call("darts_throw", { aim: b.dataset.aim, left: D.left }); } catch { render(); return; }
    board.querySelectorAll(".zabodnuta").forEach((x) => x.remove());
    D.stuck = [];
    for (let i = 0; i < r.throws.length; i++) {
      const pts = r.throws[i], spot = dartSpot(pts);
      await new Promise((ok) => setTimeout(ok, i ? 650 : 50));
      Zvuk.sfx("sipka");
      const el = document.createElement("span");
      el.className = "zabodnuta letí" + dartCls() + (spot.miss ? " mimo" : "");
      el.style.left = spot.x + "%"; el.style.top = spot.y + "%"; el.innerHTML = dartHtml();
      board.appendChild(el);
      setTimeout(() => {
        Zvuk.sfx(spot.miss ? "mimo" : "zasah");
        el.classList.remove("letí");
        const tag = document.createElement("b");
        tag.className = "body-tag"; tag.textContent = pts ? "+" + pts : t("miss");
        tag.style.left = spot.x + "%"; tag.style.top = spot.y + "%";
        board.appendChild(tag); setTimeout(() => tag.remove(), 1300);
      }, 330);
      if (!spot.miss) D.stuck.push(spot);
    }
    await new Promise((ok) => setTimeout(ok, 900));
    D.turns++;
    const shown = r.throws.map((p) => p || t("miss")).join(" + ");
    if (r.bust) D.log.push(`${t("turns_n", D.turns)}: ${shown} — ${t("bust")}`);
    else D.log.push(`${t("turns_n", D.turns)}: ${shown} → ${t("left_pts", r.left)}`);
    D.left = r.left;
    if (r.closed) { D.log.push(t("closed", D.turns)); Zvuk.sfx("vyhra"); }
    render();
  });
}

// --- výprava a boj (r26-2): stejná výprava jako na Discordu — text, volby i tah jdou přes server stejnou cestou
const AREA_ART = { rataje: "rataje", kutna_hora: "kanek", nebakov: "lezeni", trosky: "malesov", sedlec: "sedlec" };
const SIT_ART = { CORPSE: "sit-mrtvy-poutnik", B: "sit-prepadeni", C: "sit-past", D: "sit-hadanka", E: "sit-odpocinek", F: "sit-odpocinek",
  G: "sit-zaval", FORD: "sit-brod", H: "sit-zaval", I: "sit-noc", J: "sit-truhla-zavrena", K: "sit-obchodnik", A: "sit-truhla-otevrena",
  ROPE: "sit-brod", FERRY: "sit-brod", N: "sit-zaval", O: "sit-noc", P: "sit-obchodnik" };
const ENEMY_ART = [[/Černý rytíř/, "boss-cerny-rytir"], [/Dutohlav/, "boss-dutohlav"], [/Falešný kat/, "boss-falesny-kat"], [/hejtman/i, "boss-hejtman"],
  [/Krvavý kapitán/, "boss-krvavy-kapitan"], [/Krysař/, "boss-krysar"], [/Odpadlý mnich/, "boss-odpadly-mnich"], [/Polníškůdce/, "boss-polniskudce"],
  [/Přerostlá krysa/, "boss-prerostla-krysa"], [/Kuba|Převozník/, "boss-prevoznik-kuba"], [/Ješek|Purkrabí/, "boss-purkrabi-jesek"],
  [/Rozzuřený medvěd/, "boss-rozzureny-medved"], [/Vlk zabiják/, "boss-vlk-zabijak"], [/Vzteklý vlk/, "boss-vztekly-vlk"],
  [/Divočák|Kanec/, "nepritel-divocak"], [/Hlídka/, "nepritel-hlidka"], [/Krysa/, "nepritel-krysa"], [/Lapka/, "nepritel-lapka"],
  [/Medvěd/, "nepritel-medved"], [/Netopýr/, "nepritel-netopyr"], [/Ničema/, "nepritel-nicema"], [/Opilec/, "nepritel-opilec"],
  [/Pacholek/, "nepritel-pacholek"], [/Pašerák/, "nepritel-paserak"], [/Strážný/, "nepritel-strazny"], [/Vlk/, "nepritel-vlk"],
  [/Zbojník/, "nepritel-zbojnik"], [/Zbrojnoš/, "nepritel-zbrojnos"], [/Zloděj/, "nepritel-zlodej"],
  [/Jelen/, "lov-jelen"], [/Srnec/, "lov-srnec"], [/Zajíc/, "lov-zajic"], [/Liška/, "lov-liska"]];
const enemyArt = (n) => (ENEMY_ART.find(([re]) => re.test(n || "")) || [0, "nepritel-zbojnik"])[1];
/** Discord markdown → HTML (nadpisy, tučné, drobné, zmínky pryč). */
function dmd(text) {
  return md(String(text || "").replace(/<@!?\d+>/g, "").replace(/<#\d+>/g, "").replace(/<a?:\w+:\d+>/g, "")
    .split("\n").map((l) => l.replace(/^#{1,3}\s+(.*)$/, "**$1**")).join("\n"));
}
const RAID = { st: null, key: "", timer: null, panel: null, busy: false };

function raidScene(m) {
  if (!m) return { img: "mesto-brana", key: "brana" };
  const pre = AREA_ART[m.location_id];
  const img = pre && m.node_id ? `vypravy/${pre}-${String(m.node_id).padStart(2, "0")}` : "mesto-brana";
  return { img, key: m.phase === "combat" ? "boj" : m.under ? "podzemi" : "vyprava" };
}

function controlsHtml(list, cls = "") {
  if (!list || !list.length) return "";
  const rows = {};
  list.forEach((c) => { (rows[c.row] = rows[c.row] || []).push(c); });
  return `<div class="vctl ${cls}">${Object.keys(rows).sort((a, b) => a - b).map((r) => `<div class="vrow">${rows[r].map((c) => c.t === "select" && (c.max || 1) > 1
    ? `<fieldset class="vmulti" data-multi="${esc(c.id)}" data-min="${c.min || 1}"><legend>${esc(c.placeholder || "Vyber…")}</legend>${c.options.map((o) =>
      `<label class="vchk"><input type="checkbox" value="${esc(o.value)}"> ${esc((o.emoji ? o.emoji + " " : "") + o.label)}</label>`).join("")}
      <button type="button" class="btn small primary" data-multigo>${esc(L(["Potvrdit", "Confirm"]))}</button></fieldset>`
    : c.t === "select"
    ? `<select class="vsel" data-sel="${esc(c.id)}"><option value="">${esc(c.placeholder || "Vyber…")}</option>${c.options.map((o) =>
      `<option value="${esc(o.value)}">${esc((o.emoji ? o.emoji + " " : "") + o.label)}${o.desc ? " — " + esc(o.desc) : ""}</option>`).join("")}</select>`
    : `<button class="btn vbtn ${esc(c.style)}" data-cid="${esc(c.id)}"${c.disabled ? " disabled" : ""}>${esc(c.label)}</button>`).join("")}</div>`).join("")}</div>`;
}

function bar(v, max, cls) {
  const p = Math.max(0, Math.min(100, max ? 100 * v / max : 0));
  return `<span class="vbar ${cls}"><i style="width:${p}%"></i></span>`;
}

async function raidLoad(quiet = true) {
  try {
    const r = await call("raid", {}, quiet);
    return r;
  } catch { return null; }
}

VIEWS.vyprava = async (view) => {
  if (!RAID.st) {
    view.innerHTML = `<div class="panel notice">…</div>`;
    RAID.st = await raidLoad(false);
    if (S.tab !== "vyprava") return;
  }
  drawRaid(view);
  clearInterval(RAID.timer);
  RAID.timer = setInterval(async () => {                 // družina může hrát z Discordu — stav se obnovuje
    if (S.tab !== "vyprava") { clearInterval(RAID.timer); return; }
    if (document.visibilityState !== "visible" || RAID.busy) return;
    const r = await raidLoad();
    if (r && JSON.stringify(r.mission) !== JSON.stringify(RAID.st && RAID.st.mission)) { animateDiff(RAID.st, r); RAID.st = r; drawRaid($("#view")); }
  }, 3000);
};

function drawRaid(view) {
  const st = RAID.st || {}, m = st.mission;
  const sc = raidScene(m);
  if (!m) {                                              // žádná výprava: výběr jako ve shromaždišti
    view.replaceChildren(h(`${sceneHead("mesto-brana", L(["Městská brána", "Town gate"]), L(["Strážný: „Kam to bude, na stezky?“", "Guard: \"Off to the trails, then?\""]))}
      <div class="panel" style="margin-top:14px"><h3>🗺️ ${esc(L(["Výprava", "Expedition"]))}</h3>
      <p class="muted">${esc(L(["Sólo výpravu založíš tady. Družina (2–4 hráči) se zakládá ve shromaždišti na Discordu — když se k ní přidáš, hraješ ji i tady.",
        "Start a solo expedition here. Parties (2–4 players) are formed in the gathering channel on Discord — once you join, you can play it here too."]))}</p>
      <div class="row"><button class="btn primary" data-cid="ks:mission:new:solo">🗺️ ${esc(L(["Připravit sólo výpravu", "Prepare a solo expedition"]))}</button>
      <button class="btn" data-go="misto/brana">← ${esc(t("back"))}</button></div>
      <div class="vlocs">${(st.locations || []).map((l) => `<figure class="vloc">${IMG("mapa-" + (AREA_ART[l.id] || l.id))}<figcaption><b>${esc(l.name)}</b><small>${esc(l.biome)} · ${esc(L(["od úrovně", "level"]))} ${l.level}</small></figcaption></figure>`).join("")}</div>
      </div><div id="vpanel"></div>`));
    mountLive(view);
    Zvuk.music(townMusic());
    wireRaid(view);
    return;
  }
  const e = m.enemy, combat = m.phase === "combat" && e;
  const busy = m.busy_until && m.busy_until * 1000 > Date.now();
  const myTurn = !combat || !m.turn || m.turn === m.me;
  const members = (m.members || []).map((p) => `<div class="vmem${combat && m.turn === p.id ? " turn" : ""}"><b>${esc(p.name)}</b>
    <span class="vval">❤️ ${p.health}/${p.max_health}</span>${bar(p.health, p.max_health, "hp")}
    ${p.stamina ? `<span class="vval">⚡ ${p.stamina[0]}/${p.stamina[1]}</span>${bar(p.stamina[0], p.stamina[1], "st")}` : ""}</div>`).join("");
  const foe = combat ? `<div class="vfoe${e.boss ? " boss" : ""}">${IMG("bytosti/" + enemyArt(e.name))}</div>
    <div class="vfoehud"><b>${e.boss ? "👑 " : ""}${esc(e.name.split(" — ")[0])}</b>${bar(e.health, e.max_health, "hp big")}<span class="vval">${e.health}/${e.max_health}</span>
      ${e.intent ? `<div class="vintent">${esc(e.intent)}</div>` : ""}
      ${e.pack && e.pack.length ? `<div class="vpack">${e.pack.map((p) => `<span>${esc(p.name.split(" — ")[0])}${p.health != null ? " · ❤️ " + p.health : ""}</span>`).join("")}</div>` : ""}</div>` : "";
  const sit = !combat && m.situation && SIT_ART[m.situation] ? `<div class="vsit">${IMG("situace/" + SIT_ART[m.situation])}</div>` : "";
  view.replaceChildren(h(`<div class="vyp">
    <div class="vscene live${combat ? " fight" : ""}" data-img="${esc(sc.img)}" data-key="${esc(sc.key)}">
      <div class="vtitle"><h2>${esc(m.node || m.location)}</h2><small>${esc(m.location)}${m.weather ? " · " + esc(m.weather) : ""}</small></div>
      ${foe}${sit}<div class="vparty">${members}</div>
      ${combat ? `<div class="vturn">${busy ? "⏳ " + esc(L(["Probíhá tah…", "Turn in progress…"])) : myTurn ? "⚔️ " + esc(L(["Jsi na tahu", "Your turn"])) : "⏳ " + esc(L(["Na tahu je jiný člen družiny", "Another member's turn"]))}</div>` : ""}
    </div>
    <div class="vside panel">
      <div class="vtext">${dmd(m.content)}</div>
      ${combat && e.log && e.log.length ? "" : ""}
      ${controlsHtml(m.controls, busy ? "busy" : "")}
      <p class="dim small" style="margin-top:10px">${esc(L(["Stejná výprava běží i v tvém kanálu na Discordu — můžeš kdykoli přejít.", "The same expedition runs in your Discord channel — switch any time."]))}</p>
    </div></div><div id="vpanel"></div>`));
  const s = mountLive(view, { still: m.phase === "combat" });
  if (s && m.under) s.el.classList.add("is-night");
  Zvuk.scene(m.under ? ["fire"] : ["forest"], { ...(S.me || {}), weather: m.weather || (S.me || {}).weather }, !!m.under);
  Zvuk.music(combat ? (e.boss ? "boss" : "boj") : "vyprava");
  if (RAID.panel) showRaidPanel(RAID.panel);
  wireRaid(view);
  if (busy) setTimeout(async () => { if (S.tab === "vyprava") { const r = await raidLoad(); if (r) { animateDiff(RAID.st, r); RAID.st = r; drawRaid($("#view")); } } }, Math.max(500, m.busy_until * 1000 - Date.now() + 300));
}

function wireRaid(root) {
  root.querySelectorAll("[data-go]").forEach((b) => b.onclick = () => go(b.dataset.go));
  root.querySelectorAll("[data-cid]").forEach((b) => b.onclick = () => raidClick(b.dataset.cid, [], b));
  root.querySelectorAll("[data-sel]").forEach((s) => s.onchange = () => { if (s.value) raidClick(s.dataset.sel, [s.value], s); });
  root.querySelectorAll("[data-multi]").forEach((f) => f.querySelector("[data-multigo]").onclick = () => {
    const v = [...f.querySelectorAll("input:checked")].map((i) => i.value);
    if (v.length >= Number(f.dataset.min || 1)) raidClick(f.dataset.multi, v, f.querySelector("[data-multigo]"));
  });
}

const ACT_SFX = { attack: "mec", heavy: "mec", quick: "mec", defend: "odrazeno", dodge: "uhyb", counter: "mec", flee: "uhyb" };
async function raidClick(id, values = [], el = null) {
  if (RAID.busy) return;
  RAID.busy = true;
  if (el) el.disabled = true;
  const act = id.split(":").pop();
  if (ACT_SFX[act]) Zvuk.sfx(ACT_SFX[act]); else Zvuk.sfx("klik");
  try {
    const r = await call("raid_click", { id, values });
    const before = RAID.st;
    RAID.st = { mission: r.mission, locations: r.locations, difficulties: r.difficulties };
    RAID.panel = r.panel && (r.panel.content || (r.panel.controls || []).length) ? r.panel : null;
    animateDiff(before, RAID.st);
    drawRaid($("#view"));
    if (!r.mission && before && before.mission) toast(L(["Výprava skončila. Kořist a zkušenosti máš u sebe.", "The expedition is over."]));
  } catch { RAID.st = await raidLoad(); drawRaid($("#view")); }
  finally { RAID.busy = false; }
}

/** Animace podle změny stavu: zásah do nepřítele, zranění družiny, konec boje. */
function animateDiff(a, b) {
  const ea = a && a.mission && a.mission.enemy, eb = b && b.mission && b.mission.enemy;
  const pop = (txt, cls, x) => setTimeout(() => {
    const host = document.querySelector(".vscene"); if (!host) return;
    const d = document.createElement("div"); d.className = "vdmg " + cls; d.textContent = txt; d.style.left = x + "%"; host.appendChild(d);
    setTimeout(() => d.remove(), 1300);
  }, 120);
  if (ea && eb && eb.health < ea.health) {
    pop("−" + (ea.health - eb.health), "foe", 44 + Math.random() * 12);
    Zvuk.sfx("uder");
    setTimeout(() => { const f = document.querySelector(".vfoe"); if (f) { f.classList.remove("hit"); void f.offsetWidth; f.classList.add("hit"); } }, 60);
  }
  if (ea && !eb && a.mission.phase === "combat") { Zvuk.sfx("vyhra"); }
  const ma = a && a.mission && a.mission.members, mb = b && b.mission && b.mission.members;
  if (ma && mb) mb.forEach((p) => {
    const old = ma.find((q) => q.id === p.id);
    if (old && p.health < old.health) {
      pop("−" + (old.health - p.health), "me", 12 + Math.random() * 10);
      Zvuk.sfx("uder");
      setTimeout(() => { const s = document.querySelector(".vscene .stage"); if (s) { s.classList.remove("shake"); void s.offsetWidth; s.classList.add("shake"); } }, 60);
    }
  });
}

function showRaidPanel(p) {
  const box = $("#vpanel"); if (!box) return;
  box.innerHTML = `<div class="vmodal"><div class="panel">${dmd(p.content)}${controlsHtml(p.controls)}
    <div class="row" style="margin-top:10px"><button class="btn small" id="vclose">${esc(L(["Zavřít", "Close"]))}</button></div></div></div>`;
  $("#vclose").onclick = () => { RAID.panel = null; box.innerHTML = ""; };
  wireRaid(box);
}

// --- r27: statek sedláka
const FARM = { st: null, tab: store.get("farmtab") || "pole", busy: false };
const CROP_IC = { obili: "🌾", zito: "🌾", hrach: "🫛", zeli: "🥬", repa: "🟣", cibule: "🧅", len: "🌸", chmel: "🍃" };
const ANIMAL_IC = { slepice: "🐔", koza: "🐐", ovce: "🐑", prase: "🐖", krava: "🐄" };
const BUILD_IC = { kurnik: "🐓", chlev: "🛖", udirna: "🔥", vcelin: "🐝", sklep: "🍺", stodola: "🏚️", mlyn: "🪨", studna: "🪣" };
const GOOD_IC = { "Obilí": "🌾", "Hrách": "🫛", "Zelí": "🥬", "Řepa": "🟣", "Cibule": "🧅", "Len": "🌸", "Chmel": "🍃", "Vejce": "🥚", "Mléko": "🥛",
  "Vlna": "🧶", "Med": "🍯", "Vosk": "🕯️", "Sádlo": "🥓", "Syrové maso": "🥩", "Mouka": "🌫️", "Sýr": "🧀", "Klobása": "🌭", "Uzené maso": "🍖",
  "Uzený sýr": "🧀", "Kysané zelí": "🥬", "Chléb": "🍞", "Koláč": "🥧", "Pivo": "🍺", "Hrachová kaše": "🥣", "Zelňačka": "🍲", "Selská výslužka": "🧺", "Svíce": "🕯️", "Voda": "💧" };
/** Obrázek ze složky statek/, a dokud není nakreslený, ikona. */
const FIMG = (name, ic) => `<span class="fimg"><img src="${IMG_BASE}statek/${name}.webp" alt="" loading="lazy" onerror="this.remove()"><i>${ic}</i></span>`;
function fieldArt(f) {
  if (!f.crop) return FIMG("pole-ladem", "🟫");
  if (f.dead) return FIMG("pole-zmrzle", "❄️");
  const st = f.ripe ? "zrale-" + f.crop : f.progress < 0.3 ? "klici" : "roste";
  return FIMG("pole-" + st, CROP_IC[f.crop] || "🌱");
}

VIEWS.statek = async (view) => {
  if (FARM.st) drawFarm(view);                     // nejdřív hned to, co známe, pak čerstvý stav (dny mezitím uběhly)
  else view.innerHTML = `<div class="panel notice">…</div>`;
  try { FARM.st = (await call("farm", {}, true)).farm; } catch { FARM.st = FARM.st || { none: "error" }; }
  if (S.tab !== "statek") return;
  farmNote(FARM.st.news);
  drawFarm($("#view"));
};

function farmNote(lines) {
  if (lines && lines.length) toast(lines.slice(-3).join(" · "));
}

function drawFarm(view) {
  const f = FARM.st || {};
  const head = sceneHead("statek/statek-dvur", L(["Usedlost za hradbami", "Farmstead outside the walls"]),
    f.season ? L([`Hospodaření ${f.skill} · ${f.season} · ${f.clock || ""}`, `Husbandry ${f.skill} · ${f.season}`]) : L(["Pole, chlév a dvůr za městskou branou.", "Fields, barn and yard outside the gate."]));
  if (f.none) {
    const why = f.none === "origin" ? L(["Statek má jen postava s původem **sedlák**. Ostatní původy mají své podniky (kovárna, apatyka, dílna, doupě).",
      "Only a character of **peasant** origin has a farm."])
      : f.none === "business" ? L([`Usedlost si sedlák koupí na radnici (Discord: radnice → podnik) za **${f.price} gr.**\n${f.desc}`, `Buy the farmstead at the town hall for **${f.price} gr.**`])
      : L(["Statek se teď nepodařilo načíst.", "Could not load the farm."]);
    view.replaceChildren(h(`${head}<div class="panel" style="margin-top:14px">${dmd(why)}<p><button class="btn" data-go="misto/brana">← ${esc(t("back"))}</button></p></div>`));
    mountLive(view); wireFarm(view); return;
  }
  const tabs = [["pole", "🌾", ["Pole", "Fields"]], ["chlev", "🐄", ["Chlév", "Barn"]], ["dvur", "🏗️", ["Dvůr", "Yard"]],
    ["vyroba", "⚒️", ["Výroba", "Crafting"]], ["trh", "🛒", ["Trh a desátek", "Market & tithe"]]];
  const ev = f.event ? `<div class="panel fevent"><h3>${esc(f.event.title)}</h3><p>${esc(f.event.text)}</p>
    <div class="row">${f.event.choices.map(([k, lab], i) => `<button class="btn ${i ? "" : "primary"}" data-cid="ks:farm:ev:${esc(k)}">${esc(lab)}</button>`).join("")}</div></div>` : "";
  view.replaceChildren(h(bezEmoji(`${head}${ev}
    <div class="ftabs">${tabs.map(([k, ic, n]) => `<button class="ftab${FARM.tab === k ? " on" : ""}" data-ftab="${k}">${ic} ${esc(L(n))}</button>`).join("")}</div>
    <div class="fbody">${FARM_TABS[FARM.tab](f)}</div>
    ${f.log && f.log.length ? `<details class="panel flog"><summary>📜 ${esc(L(["Co se na statku dělo", "Farm log"]))}</summary>${f.log.map((l) => `<p class="small">${esc(l)}</p>`).join("")}</details>` : ""}
    <p class="row"><button class="btn" data-go="misto/brana">← ${esc(L(["Zpět k bráně", "Back to the gate"]))}</button>
      <button class="btn" data-frefresh>🔄 ${esc(L(["Obnovit", "Refresh"]))}</button></p>
    <div id="vpanel"></div>`)));
  const sc = mountLive(view);
  Zvuk.scene(FARM_AMB[FARM.tab] || ["birds"], S.me || {}, false);
  Zvuk.music(S.me && S.me.night ? "mesto-noc" : "mesto-den");      // venkovská hudba (Village Consort, Thatched Villagers…)
  wireFarm(view);
}

const FARM_AMB = { pole: ["field", "birds"], chlev: ["barn", "hens"], dvur: ["hens", "birds"], vyroba: ["fire"], trh: ["crowd"] };

const FARM_TABS = {
  pole(f) {
    const can = f.sow.filter((c) => !c.why);
    const cards = f.fields.map((x) => {
      const acts = [];
      if (x.dead) acts.push(["harvest", "🧹 " + L(["Vyčistit", "Clear"])]);
      else if (x.ripe) acts.push(["harvest", "🧺 " + L(["Sklidit", "Harvest"])]);
      else if (x.crop) { if (x.can_weed) acts.push(["weed", "🌿 " + L(["Vyplít", "Weed"])]); acts.push(["water", "💧 " + L(["Zalít", "Water"])]); }
      const btns = acts.map(([a, lab]) => `<button class="btn small${a === "harvest" ? " primary" : ""}" data-cid="ks:farm:act" data-val="${a === "harvest" && x.dead ? "clear" : a}|${x.i}">${esc(lab)}</button>`).join("");
      const sow = !x.crop && can.length ? `<select class="vsel" data-sel="ks:farm:sow"><option value="">🌱 ${esc(L(["Zasít…", "Sow…"]))}</option>${can.map((c) =>
        `<option value="${x.i}|${c.key}">${CROP_IC[c.key] || ""} ${esc(c.name)} · ${c.days} ${esc(L(["dní", "days"]))}</option>`).join("")}</select>` : "";
      return `<div class="fcard${x.ripe ? " ripe" : ""}${x.dead ? " dead" : ""}">${fieldArt(x)}
        <b>${esc(L(["Pole", "Field"]))} ${x.i + 1}${x.name ? " · " + esc(x.name) : ""}</b>
        ${x.crop && !x.dead ? bar(x.progress, 1, "grow") : ""}
        <small>${dmdInline(x.state)}</small>
        ${x.crop && !x.dead ? `<small class="dim">${esc(L(["Čekej", "Expect"]))} ~${x.expect}× ${esc(x.item)}</small>` : ""}
        <div class="row">${btns}${sow}</div></div>`;
    }).join("");
    const plan = f.sow.map((c) => `<li class="${c.why ? "dim" : ""}">${CROP_IC[c.key] || ""} <b>${esc(c.name)}</b> — ${esc(c.desc)} <small>${esc(c.why || L(["teď se seje", "sow now"]))} · ${c.days} ${esc(L(["dní", "days"]))}</small></li>`).join("");
    return `<div class="fgrid">${cards}</div>
      ${f.field_price ? `<p><button class="btn" data-cid="ks:farm:buyfield">➕ ${esc(L(["Pronajmout další pole", "Rent another field"]))} (${f.field_price} gr.)</button></p>` : ""}
      <p><button class="btn small" data-cid="ks:farm:remind">${f.remind ? "🔔 " + esc(L(["Připomínky do Discordu: zapnuté", "Discord reminders: on"])) : "🔕 " + esc(L(["Připomínky do Discordu: vypnuté", "Discord reminders: off"]))}</button></p>
      <details class="panel"><summary>🌱 ${esc(L(["Co a kdy sít", "What to sow and when"]))}</summary><ul class="flist">${plan}</ul>
      <p class="small dim">${esc(L(["Plít jde mezi třetinou a čtyřmi pětinami růstu (bez plení 70 % úrody). Ve vedru zalévej. Zralé pole skliď do 2 dní. Jarní plodiny v zimě zmrznou, ozimé žito přezimuje.",
        "Weed between a third and four fifths of growth. Water in heat. Harvest within 2 days. Spring crops freeze in winter; winter rye survives."]))}</p></details>`;
  },
  chlev(f) {
    const cards = f.animals.map((a) => `<div class="fcard${a.hungry ? " dead" : ""}">${FIMG("zvire-" + a.kind, ANIMAL_IC[a.kind] || "🐾")}
      <b>${esc(a.name)}</b><small>${esc(a.state)}</small>
      <div class="row">${a.fat ? `<button class="btn small primary" data-cid="ks:farm:animal" data-val="slaughter|${a.id}">🔪 ${esc(L(["Zabijačka", "Slaughter"]))}</button>` : ""}
      <button class="btn small" data-cid="ks:farm:animal" data-val="sell|${a.id}">🪙 ${esc(L(["Prodat", "Sell"]))}</button></div></div>`).join("")
      || `<p class="dim">${esc(L(["Zatím žádná zvířata.", "No animals yet."]))}</p>`;
    const shop = f.shop.map((a) => `<div class="fcard shop${f.skill < a.skill ? " locked" : ""}">${FIMG("zvire-" + a.kind, ANIMAL_IC[a.kind] || "🐾")}
      <b>${esc(a.name)} · ${a.price} gr.</b><small>${esc(a.desc)}</small>${a.skill ? `<small class="dim">${esc(L(["Hospodaření", "Husbandry"]))} ${a.skill}</small>` : ""}
      <button class="btn small" data-cid="ks:farm:buyanimal" data-val="${a.kind}"${f.skill < a.skill ? " disabled" : ""}>🛒 ${esc(L(["Koupit", "Buy"]))}</button></div>`).join("");
    return `<p>${esc(L(["Kurník", "Coop"]))} <b>${f.coop[0]}/${f.coop[1]}</b> · ${esc(L(["chlév", "stalls"]))} <b>${f.stall[0]}/${f.stall[1]}</b>
      · ${esc(L(["krmivo bere z truhly (řepa, zelí, hrách, obilí); mimo zimu se kozy, ovce a krávy pasou", "feed comes from the chest; outside winter goats, sheep and cows graze"]))}</p>
      <div class="fgrid">${cards}</div><h3 class="sect">🛒 ${esc(L(["Dobytčí trh", "Livestock market"]))}</h3><div class="fgrid">${shop}</div>
      <div class="panel"><b>🧑‍🌾 ${esc(L(["Čeledín", "Farmhand"]))}</b> — ${esc(L([`${f.wage} gr. denně, plení a sklízí za tebe (od Hospodaření 2).`, `${f.wage} gr./day, weeds and harvests for you.`]))}
      <button class="btn small${f.farmhand ? "" : " primary"}" data-cid="ks:farm:hand">${esc(f.farmhand ? L(["Propustit", "Dismiss"]) : L(["Najmout", "Hire"]))}</button></div>`;
  },
  dvur(f) {
    return `<div class="fgrid">${f.buildings.map((b) => `<div class="fcard${b.level ? " built" : ""}">${FIMG("stav-" + b.key, BUILD_IC[b.key] || "🏠")}
      <b>${esc(b.name)}${b.max > 1 && b.level ? " " + b.level : ""}</b>
      <small>${esc(b.level ? b.has : b.desc)}</small>
      ${b.next ? `<small class="dim">${esc(b.level ? L(["Další stupeň: ", "Next: "]) + b.desc : "")}</small>
        <button class="btn small${b.level ? "" : " primary"}" data-cid="ks:farm:build" data-val="${b.key}"${f.skill < b.next[1] ? " disabled" : ""}>🔨 ${b.next[0]} gr.${b.next[1] ? " · " + L(["Hosp.", "Husb."]) + " " + b.next[1] : ""}</button>` : `<small>✅ ${esc(L(["hotovo", "complete"]))}</small>`}</div>`).join("")}</div>`;
  },
  vyroba(f) {
    const job = f.job ? (f.job.done ? `<div class="panel">✅ <b>${esc(f.job.item)} ×${f.job.qty}</b> ${esc(L(["je hotové.", "is ready."]))}</div>`
      : `<div class="panel">⚒️ ${esc(L(["Vyrábí se", "Making"]))} <b>${esc(f.job.item)} ×${f.job.qty}</b> · ${esc(L(["hotovo", "ready"]))} ${new Date(f.job.ready * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>`) : "";
    const recs = f.recipes.map((r) => `<div class="frec${r.ok ? "" : " no"}"><span class="ic">${GOOD_IC[r.item] || "⚒️"}</span>
      <div><b>${esc(r.item)}${r.qty > 1 ? " ×" + r.qty : ""}</b><small>${Object.entries(r.mats).map(([n, q]) => esc(n) + " " + q).join(", ")} · ${Math.floor(r.minutes / 60)}:${String(r.minutes % 60).padStart(2, "0")} h${r.why ? " · " + esc(r.why) : ""}</small></div>
      ${r.ok && !f.job ? `<button class="btn small primary" data-cid="ks:biz:craft" data-val="${esc(r.item)}">⚒️</button>` : ""}</div>`).join("");
    const chest = Object.entries(f.chest).filter(([, q]) => q > 0).sort();
    const carried = Object.entries(f.carried || {}).filter(([, q]) => q > 0).sort();
    return `${job}<p><button class="btn primary" data-cid="ks:biz:collect">📦 ${esc(L(["Vyzvednout výrobu a produkci", "Collect production"]))}</button>
      <span class="dim small">${esc(L(["Hospodaření", "Husbandry"]))} ${f.skill} · ${f.xp[0]}/${f.xp[1]}</span></p>
      <div class="frecs">${recs}</div>
      <h3 class="sect">📦 ${esc(L(["Truhla usedlosti", "Farm chest"]))} ${f.store[0]}/${f.store[1]}</h3>
      <div class="fchips">${chest.map(([n, q]) => `<button class="chip" data-cid="ks:biz:take" data-val="${esc(n)}" title="${esc(L(["vzít s sebou", "take"]))}">${GOOD_IC[n] || "▫️"} ${esc(n)} ×${q}</button>`).join("") || `<span class="dim">${esc(L(["prázdná", "empty"]))}</span>`}</div>
      ${carried.length ? `<select class="vsel" data-sel="ks:biz:put"><option value="">📥 ${esc(L(["Uložit do truhly…", "Store in chest…"]))}</option>${carried.map(([n, q]) => `<option value="${esc(n)}">${esc(n)} ×${q}</option>`).join("")}</select>` : ""}
      <p class="small dim">🧺 ${esc(L(["Selská výslužka (chléb, sýr, uzené): když ji sedlák nese na výpravu, celá družina má +1 výdrž v boji a pomaleji se unaví.",
        "Peasant provisions: carried by the peasant, the whole party gets +1 stamina and tires slower."]))} ${f.provision ? `· ${esc(L(["Máš u sebe", "You carry"]))} ${f.provision}` : ""}</p>`;
  },
  trh(f) {
    const goods = Object.entries(f.chest).filter(([n, q]) => q > 0 && n in f.market).sort();
    return `<p>${esc(L([`Trh vykoupí za cenu podle sezóny (${f.season}), nejvýš 300 gr. za den.`, `The market pays by season, at most 300 gr. a day.`]))}
      ${f.credit ? `⛪ ${esc(L(["Desátek předplacený úrodou:", "Tithe prepaid in kind:"]))} <b>${f.credit} gr.</b>` : ""}</p>
      <div class="fgoods">${goods.map(([n, q]) => `<div class="fgood"><span class="ic">${GOOD_IC[n] || "▫️"}</span><b>${esc(n)} ×${q}</b>
        <small>${f.market[n]} gr./ks</small>
        <div class="row"><button class="btn small primary" data-cid="ks:farm:sell" data-val="${esc(n)}">🪙 ${esc(L(["Prodat za", "Sell for"]))} ${f.market[n] * q} gr.</button>
        <button class="btn small" data-cid="ks:farm:tithe" data-val="${esc(n)}">⛪ ${esc(L(["Desátek", "Tithe"]))}</button></div></div>`).join("")
        || `<p class="dim">${esc(L(["V truhle usedlosti nic ze statku.", "Nothing from the farm in the chest."]))}</p>`}</div>
      <p class="small dim">${esc(L(["Desátek v naturáliích: farář započte hodnotu úrody do desátku na konci období a počítá ji jako dar (pověst).",
        "Tithe in kind counts against your seasonal tithe and as a gift (reputation)."]))}</p>`;
  },
};

function dmdInline(t) { return esc(t).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>"); }

function wireFarm(root) {
  root.querySelectorAll("[data-go]").forEach((b) => b.onclick = () => go(b.dataset.go));
  root.querySelectorAll("[data-ftab]").forEach((b) => b.onclick = () => { FARM.tab = b.dataset.ftab; store.set("farmtab", FARM.tab); Zvuk.sfx("klik"); drawFarm($("#view")); });
  root.querySelectorAll("[data-frefresh]").forEach((b) => b.onclick = async () => { FARM.st = (await call("farm", {})).farm; farmNote(FARM.st.news); drawFarm($("#view")); });
  root.querySelectorAll("[data-cid]").forEach((b) => b.onclick = () => farmClick(b.dataset.cid, b.dataset.val ? [b.dataset.val] : [], b));
  root.querySelectorAll("[data-sel]").forEach((s) => s.onchange = () => { if (s.value) farmClick(s.dataset.sel, [s.value], s); });
}

const FARM_SFX = { harvest: "kosa", weed: "kosa", water: "voda", sow: "seti", buyanimal: "mince", sell: "mince", tithe: "zvon", build: "kladivo",
  slaughter: "uder", craft: "kladivo", collect: "mince", hand: "klik" };
async function farmClick(id, values = [], el = null) {
  if (FARM.busy) return;
  FARM.busy = true;
  if (el) el.disabled = true;
  const parts = id.split(":"), act = parts[2] === "act" || parts[2] === "animal" ? (values[0] || "").split("|")[0] : parts[2];
  Zvuk.sfx(FARM_SFX[act] || "klik");
  if (ANIMAL_IC && act === "buyanimal") setTimeout(() => Zvuk.sfx("zvire-" + values[0]), 350);
  try {
    const r = await call("raid_click", { id, values });
    if (r.farm) FARM.st = r.farm;
    if (r.panel && r.panel.content) {
      const parts = r.panel.content.split("\n\n");          // výsledek akce je poslední odstavec panelu
      const line = parts.length > 1 ? parts[parts.length - 1].split("\n").slice(-2).join(" · ") : "";
      if (line) toast(line.replace(/\*\*/g, "").replace(/^#+ /, "").replace(/<t:\d+:\w>/g, ""));
    }
    farmNote(FARM.st && FARM.st.news);
    drawFarm($("#view"));
  } catch { try { FARM.st = (await call("farm", {}, true)).farm; } catch {} drawFarm($("#view")); }
  finally { FARM.busy = false; }
}

// --- více
VIEWS.more = (view) => {
  view.replaceChildren(h(`<div class="grid g2" style="align-items:start">
    <div class="panel"><h3>${esc(t("settings"))}</h3>
      <div class="row"><span class="muted">${esc(t("language"))}</span>
        <button class="chip${S.lang === "cs" ? " on" : ""}" data-l="cs">Čeština</button>
        <button class="chip${S.lang === "en" ? " on" : ""}" data-l="en">English</button></div>
      <p style="margin-top:16px"><button class="btn" id="out">${esc(t("logout"))}</button></p>
      <hr style="border:0;border-top:1px solid var(--line);margin:18px 0">
      <p class="muted small">${esc(t("delete_help"))}</p>
      <div class="row"><input class="search" id="del" placeholder="SMAZAT" autocomplete="off" style="max-width:180px">
        <button class="btn danger" id="delbtn">${esc(t("delete"))}</button></div>
    </div>
    <div class="panel"><h3>🔊 ${esc(t("sound"))}</h3>
      <label class="row"><input type="checkbox" id="snd-on"${Zvuk.V.on ? " checked" : ""}> ${esc(t("sound_on"))}</label>
      ${[["master", "sound_master"], ["mus", "sound_mus"], ["amb", "sound_amb"], ["sfx", "sound_sfx"]].map(([k, l]) =>
        `<div class="row slider"><span class="muted">${esc(t(l))}</span><input type="range" min="0" max="1" step="0.05" value="${Zvuk.V[k]}" data-vol="${k}" aria-label="${esc(t(l))}">
        ${k === "master" ? "<span></span>" : `<button class="chip${Zvuk.V["off_" + k] ? "" : " on"}" data-mute="${k}">${esc(t(Zvuk.V["off_" + k] ? "sound_off" : "sound_on_short"))}</button>`}</div>`).join("")}
      <p class="dim small">${esc(t("sound_note"))} ${esc(t("music_credit"))}</p>
    </div>
    <div class="panel"><h3>${esc(t("about"))}</h3><p>${esc(t("about_text"))}</p>
      <p class="muted">${esc(t("coming"))}</p>
      <p><a href="soukromi.html" target="_blank" rel="noopener">${esc(t("privacy"))}</a></p></div>
  </div>`));
  view.querySelectorAll("[data-l]").forEach((b) => b.onclick = () => setLang(b.dataset.l));
  $("#snd-on").onchange = (e) => { Zvuk.set("on", e.target.checked); if (e.target.checked) Zvuk.sfx("zvon"); };
  view.querySelectorAll("[data-vol]").forEach((r) => r.oninput = () => { Zvuk.set(r.dataset.vol, Number(r.value)); if (r.dataset.vol === "sfx") Zvuk.sfx("mince"); });
  view.querySelectorAll("[data-mute]").forEach((b) => b.onclick = () => {
    const k = b.dataset.mute, off = !Zvuk.V["off_" + k];
    Zvuk.set("off_" + k, off);
    b.classList.toggle("on", !off); b.textContent = t(off ? "sound_off" : "sound_on_short");
  });
  $("#out").onclick = () => logout();
  $("#delbtn").onclick = () => {
    const v = $("#del").value.trim();
    if (v !== "SMAZAT") { toast(t("delete_help"), true); return; }
    call("delete_account", { confirm: v }).then(() => { toast(t("delete_ok")); logout(); }).catch(() => {});
  };
};

// ------------------------------------------------------------------ start
applyTexts();
if (location.hash.length > 1) store.set("tab", decodeURIComponent(location.hash.slice(1)));
window.addEventListener("popstate", () => { if (S.token && S.me) go(decodeURIComponent(location.hash.slice(1)) || "mesto"); });
document.addEventListener("visibilitychange", () => {      // po návratu na kartu načíst čerstvý stav (mohl hrát na Discordu)
  if (document.visibilityState === "visible" && S.token && S.me) {
    S.inn = null;
    call("me", {}, true).then(() => { if (!["obchod"].includes(S.tab)) render(); }).catch(() => {});
  }
});
if (S.token) enterGame(); else showLogin();

// r27-3: web bez emoji — čisté písmo a dobové UI. Z textů na stránce emoji průběžně mizí (atributy, obrázky a SVG se nemění).
(() => {
  const RE = /(\p{Extended_Pictographic}|\p{Emoji_Modifier}|[️‍⃣])+\s?/gu;
  const HAS = /\p{Extended_Pictographic}|\uFE0F|\u20E3/u;
  const clean = (root) => {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: (n) =>
      n.parentElement && !n.parentElement.closest("script,style,textarea,input,.emoji-ok") && HAS.test(n.data) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP });
    const list = []; while (w.nextNode()) list.push(w.currentNode);
    list.forEach((n) => { const v = n.data.replace(RE, ""); if (v !== n.data) n.data = v; });
  };
  const start = () => {
    clean(document.body);
    new MutationObserver((ms) => ms.forEach((m) => {
      if (m.type === "characterData") { if (m.target.parentElement) clean(m.target.parentElement); }
      else m.addedNodes.forEach((n) => { if (n.nodeType === 1) clean(n); else if (n.nodeType === 3 && n.parentElement) clean(n.parentElement); });
    })).observe(document.body, { childList: true, subtree: true, characterData: true });
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
