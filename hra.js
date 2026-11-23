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
  coming: ["Na webu hraješ i výpravy a boj (Město → Brána). Družinu zakládáš ve shromaždišti na Discordu, hrát ji pak můžeš i tady. Kolbiště, dům a podniky zatím jen na Discordu.",
    "Expeditions and combat are on the web too (Town → Gate). Parties are formed in the gathering channel on Discord, then playable here. Arena, house and businesses are still Discord-only."],
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

const TAB_OF = { mesto: "mesto", misto: "mesto", obchod: "mesto", hra: "mesto", vyprava: "mesto", hero: "hero", bag: "bag", more: "more" };

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
  if ((typeof Zvuk !== "undefined")) { Zvuk.sfx("stranka"); if (!["mesto", "misto", "obchod", "hra", "vyprava"].includes(tab)) { Zvuk.scene([], S.me || {}, true); Zvuk.music(townMusic()); } }
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
  view.classList.toggle("wide", ["mesto", "misto", "obchod", "hra", "vyprava"].includes(S.tab));
  VIEWS[S.tab](view);
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
  { id: "doly", x: 26.0, y: 12.7, n: ["Doly", "Mines"] },
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
  "Hostinský": { img: "mesto-hostinec", ic: "🍺", say: ["Hostinský: „Pivo, chleba, a něco na cestu?“", "Innkeeper: \"Beer, bread, and something for the road?\""] },
};
const PLACES = {
  hostinec: { img: "mesto-hostinec", n: ["Hostinec U Zlatého groše", "The Golden Groschen Inn"],
    say: ["Hostinský: „Co to bude, poutníku?“", "Innkeeper: \"What will it be, traveller?\""],
    opts: [
      { go: "hra/dice", ic: "🎲", n: ["Kostky", "Dice"], d: ["Hra s hostinským o groše", "Play the innkeeper for coins"] },
      { go: "hra/cards", ic: "🃏", n: ["Oko bere", "Twenty-one"], d: ["Karetní hra s hostinským", "Card game with the innkeeper"] },
      { go: "hra/darts", ic: "🎯", n: ["Šipky", "Darts"], d: ["Cvičný hod na terč", "Practice at the board"] },
      { go: "obchod/Hostinský", ic: "🍺", n: ["Občerstvení a zásoby", "Food and supplies"], d: ["Jídlo, pití, suroviny", "Food, drink and goods"] },
      { soon: true, ic: "🛏️", n: ["Pokoj na noc", "Room for the night"], d: ["Vyspat se do sytosti", "Sleep until rested"] },
      { soon: true, ic: "📋", n: ["Nástěnka", "Notice board"], d: ["Zakázky a výzvy hráčů", "Jobs and challenges"] },
    ] },
  trziste: { img: "mesto-trziste", n: ["Tržiště", "Market square"], say: ["Kupci vyvolávají své zboží.", "Merchants call out their wares."],
    opts: [...["Kovář", "Střelmistr", "Zbrojíř", "Apatykář", "Krejčí", "Písař", "Vetešník", "Hostinský"].map((sh) => ({ go: "obchod/" + sh, shop: sh })),
      { go: "misto/paserak", ic: "🌙", n: ["Pašerák", "Smuggler"], d: ["Jen v noci", "Night only"] }] },
  kovar: { redirect: "obchod/Kovář" },
  radnice: { img: "mesto-radnice", n: ["Radnice", "Town hall"], say: ["Purkmistr: „Co vás přivádí před radu, poutníku?“", "Burgomaster: \"What brings you before the council, traveller?\""],
    opts: [
      { go: "misto/banka", ic: "🏦", n: ["Banka", "Bank"], d: ["Uložit a vybrat groše", "Deposit and withdraw"] },
      { soon: true, ic: "👥", n: ["Obyvatelé", "Townsfolk"], d: ["Kdo ve městě žije", "Who lives in town"] },
      { soon: true, ic: "🏛️", n: ["Měšťanské právo a erb", "Citizenship and arms"], d: ["Staň se měšťanem", "Become a burgher"] },
      { soon: true, ic: "📜", n: ["Pořadí týdne", "Weekly ranking"], d: ["Nejlepší hrdinové", "Best heroes"] },
      { soon: true, ic: "⚖️", n: ["Rychtář", "Reeve"], d: ["Pokuty a hledanost", "Fines and bounties"] },
      { soon: true, ic: "🏠", n: ["Koupit podnik", "Buy a business"], d: ["Vlastní dílna", "Your own workshop"] },
    ] },
  chram: { img: "mesto-chram", n: ["Chrám svaté Barbory", "Church of St Barbara"], say: ["Kněz: „Pokoj s tebou. Modlit se můžeš jednou za den.“", "Priest: \"Peace be with you. You may pray once a day.\""],
    opts: [
      { act: "pray:sila", ic: "💪", n: ["Požehnání síly", "Blessing of strength"], d: ["+1 k útoku na výpravu", "+1 attack next expedition"] },
      { act: "pray:ochrana", ic: "🛡️", n: ["Požehnání ochrany", "Blessing of protection"], d: ["+1 k obraně na výpravu", "+1 defence next expedition"] },
      { act: "pray:moudrost", ic: "📖", n: ["Požehnání moudrosti", "Blessing of wisdom"], d: ["+1 ke zkouškám", "+1 to checks"] },
      { act: "pray:uzdraveni", ic: "❤️", n: ["Uzdravení", "Healing"], d: ["+25 % životů hned", "+25% health now"] },
      { soon: true, ic: "🎁", n: ["Dar kostelu", "Gift to the church"], d: ["Pro dobrou pověst", "For your reputation"] },
    ] },
  lazne: { img: "mesto-lazebnik", n: ["Lazebník", "Barber and bathhouse"], say: ["Lazebník: „Oholit, ostříhat, nebo rovnou do škopku?“", "Barber: \"A shave, a haircut, or straight into the tub?\""],
    opts: [
      { soon: true, ic: "✂️", n: ["Účes", "Haircut"], d: ["Nový střih", "A new cut"] },
      { soon: true, ic: "🎨", n: ["Barva vlasů", "Hair colour"], d: ["Odbarvit nebo obarvit", "Change the colour"] },
      { soon: true, ic: "🪒", n: ["Vousy", "Beard"], d: ["Oholit nebo zastřihnout", "Shave or trim"] },
      { soon: true, ic: "🎨", n: ["Barva vousů", "Beard colour"], d: ["Obarvit vousy", "Dye the beard"] },
    ] },
  banka: { img: "mesto-banka", n: ["Směnárna a banka", "Money changer and bank"], say: ["Směnárník: „Co uložíte u mě, to na výpravě neztratíte.“", "Changer: \"What you leave with me, you won't lose on the road.\""],
    opts: [
      { soon: true, ic: "📥", n: ["Vložit groše", "Deposit"], d: ["Uschovat bezpečně", "Keep them safe"] },
      { soon: true, ic: "📤", n: ["Vybrat groše", "Withdraw"], d: ["Vzít si na cestu", "Take some for the road"] },
    ] },
  kolbiste: { img: "mesto-kolbiste", n: ["Kolbiště", "Arena"], say: ["Mistr kolbiště: „Kdo si troufne?“", "Arena master: \"Who dares?\""],
    opts: [
      { soon: true, ic: "⚔️", n: ["Vyzvat na souboj", "Challenge to a duel"], d: ["Souboj 1 na 1", "One on one"] },
      { soon: true, ic: "🏆", n: ["Týdenní turnaj", "Weekly tournament"], d: ["Pořadí a ceny", "Ranking and prizes"] },
    ] },
  zverinec: { img: "mesto-zverinec", n: ["Zvěřinec", "Menagerie"], say: ["Zvěřinec: „Každé zvíře si najde svého pána.“", "Keeper: \"Every animal finds its master.\""],
    opts: [ { soon: true, ic: "🐾", n: ["Koupit zvíře", "Buy an animal"], d: ["Pes, sokol, medvěd…", "Dog, falcon, bear…"] } ] },
  brana: { img: "mesto-brana", n: ["Městská brána", "Town gate"], say: ["Strážný: „Kam to bude, na stezky?“", "Guard: \"Off to the trails, then?\""],
    opts: [
      { go: "vyprava", ic: "🗺️", n: ["Vyrazit na výpravu", "Set out on an expedition"], d: ["Lesy, doly, ležení, hrad", "Woods, mines, camp, castle"] },
      { soon: true, ic: "📦", n: ["Věci u brány", "Things at the gate"], d: ["Co přinesl nosič", "What the porter brought"] },
    ] },
  dum: { img: "mesto-dum", n: ["Měšťanský dům", "Burgher house"], say: ["Tvůj vlastní kout v Kutné Hoře.", "Your own corner of Kutná Hora."],
    opts: [
      { soon: true, ic: "🛏️", n: ["Odpočinek", "Rest"], d: ["Vyspat se doma", "Sleep at home"] },
      { soon: true, ic: "🧰", n: ["Truhla", "Chest"], d: ["Uložené věci", "Stored items"] },
      { soon: true, ic: "🪑", n: ["Nábytek", "Furniture"], d: ["Vybavit dům", "Furnish the house"] },
    ] },
  paserak: { img: "mesto-paserak", n: ["Pašerák", "Smuggler"], say: ["Pašerák: „Nikdo nás neviděl, jasný?“", "Smuggler: \"Nobody saw us, right?\""],
    opts: [ { soon: true, ic: "🌙", n: ["Černý trh", "Black market"], d: ["Jen v noci 21–5", "Night only, 9 pm–5 am"] } ] },

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
    return `<button class="opt${o.soon ? " later" : ""}" ${o.soon ? "data-soon" : o.act ? `data-act="${esc(o.act)}"` : `data-go="${esc(o.go)}"`}><span class="ic">${o.ic}</span><b>${esc(L(o.n))}</b><small>${esc(o.soon ? t("soon_short") : L(o.d))}</small></button>`;
  };
  view.replaceChildren(h(`${sceneHead(p.img, L(p.n), L(p.say))}
    ${S.me.on_raid ? `<div class="panel notice" style="margin:14px 0">🗺️ ${esc(t("on_raid"))}</div>` : ""}
    <div class="opts">${p.opts.map(card).join("")}</div>
    <p><button class="btn" data-go="mesto">← ${esc(t("back_map"))}</button></p>`));
  mountLive(view);
  view.querySelectorAll("[data-go]").forEach((b) => b.onclick = () => go(b.dataset.go));
  view.querySelectorAll("[data-soon]").forEach((b) => b.onclick = () => toast(t("soon")));
  view.querySelectorAll("[data-act]").forEach((b) => b.onclick = () => {
    const [op, key] = b.dataset.act.split(":");
    if (op === "pray") Zvuk.sfx("zvon"), call("pray", { key }).then((r) => toast((r.morning ? "🔔 " : "🙏 ") + r.text)).catch(() => {});
  });
  if (!S.shops && p.opts.some((o) => o.shop)) call("shops", {}, true).then((r) => { S.shops = r.shops; if (S.tab === "misto") render(); }).catch(() => {});
};

VIEWS.obchod = async (view) => {
  const shopId = S.arg;
  const u = SHOPS_UI[shopId] || { img: "mesto-trziste", say: ["", ""] };
  const back = shopId === "Hostinský" ? "misto/hostinec" : shopId === "Kovář" ? "mesto" : "misto/trziste";
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
  box.replaceChildren(h(`<div class="spread"><span class="dim small">🔄 ${esc(t("restock", left))}</span><input class="search" id="shop-q" type="search" placeholder="${esc(t("search"))}"></div>
    <div class="items" id="shop-items"></div>`));
  $("#shop-q").oninput = (e) => drawShop(e.target.value.trim());
  drawShop();
};

// --- hostinec: kostky, oko bere a šipky s animacemi (r26-2)
// Kostky: malované kostky shora (img/domov/hra-kostka-1..6), letící kostky (hra-kostka-let-1..3) a kožený kalíšek.
// Měřítko jako ve skutečnosti: kalíšek asi 9 cm, kostka 1,6 cm → kalíšek je zhruba 5× vyšší než kostka.
const DOM = (n) => IMG_BASE + "domov/" + n + ".webp";
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

// Karty: české barvy (srdce, kule, listy, žaludy) kreslené kódem; ♥ srdce, ♦ kule, ♠ listy, ♣ žaludy.
const SUIT = {
  "♥": { n: ["srdce", "hearts"], svg: '<path d="M50 88C18 64 6 46 6 30 6 16 17 6 30 6c9 0 16 5 20 12C54 11 61 6 70 6c13 0 24 10 24 24 0 16-12 34-44 58z" fill="#b3261e" stroke="#5c120d" stroke-width="3"/><path d="M28 18c-8 2-12 9-11 16" stroke="#f0a090" stroke-width="5" fill="none" stroke-linecap="round"/>' },
  "♦": { n: ["kule", "bells"], svg: '<circle cx="50" cy="52" r="34" fill="#d4731f" stroke="#6b3509" stroke-width="3"/><path d="M18 52h64" stroke="#6b3509" stroke-width="4"/><circle cx="50" cy="70" r="6" fill="#6b3509"/><path d="M38 14h24l-4 8H42z" fill="#8a5a1a"/><circle cx="38" cy="38" r="7" fill="#f5c27a" opacity=".8"/>' },
  "♠": { n: ["listy", "leaves"], svg: '<path d="M50 6C78 30 90 52 74 72 66 82 56 80 52 76V94h-4V76c-4 4-14 6-22-4C10 52 22 30 50 6z" fill="#3f7a2a" stroke="#1d3d12" stroke-width="3"/><path d="M50 16v58M50 40l-14-8M50 54l16-10M50 66l-12-6" stroke="#9cc46a" stroke-width="3" fill="none"/>' },
  "♣": { n: ["žaludy", "acorns"], svg: '<ellipse cx="50" cy="62" rx="22" ry="28" fill="#a8742c" stroke="#4e3210" stroke-width="3"/><path d="M24 44c0-14 12-22 26-22s26 8 26 22c-8 4-44 4-52 0z" fill="#6b4a1e" stroke="#3a250b" stroke-width="3"/><path d="M50 22V8" stroke="#3a250b" stroke-width="5" stroke-linecap="round"/><path d="M30 38h40M34 32h32" stroke="#8a6630" stroke-width="2"/><ellipse cx="42" cy="62" rx="5" ry="10" fill="#e0b070" opacity=".6"/>' },
};
const suitSvg = (s, cls = "") => `<svg class="barva ${cls}" viewBox="0 0 100 100" aria-hidden="true">${SUIT[s]?.svg || ""}</svg>`;
function pcard(c, deal = -1) {
  const st = deal >= 0 ? ` style="--d:${deal * .18}s"` : "", dc = deal >= 0 ? " deal" : "";
  if (!c) return `<div class="karta rub${dc}"${st}><img src="${DOM("hra-rub-karty-m")}" alt=""></div>`;
  const [r, s] = c, en = 0;   // české karty mají vždy české názvy (spodek, svršek, král, eso)
  const rk = T.rank[en][r] || r, fig = ["S", "Q", "K"].includes(r);
  let mid;
  if (r === "A") mid = `<div class="eso">${suitSvg(s, "velka")}</div>`;                     // bez nápisů — označení je v rozích
  else if (fig) mid = `<div class="figura-k">${suitSvg(s, "stredni")}<span class="koruna">${r === "K" ? "♛" : r === "Q" ? "⚜" : "✦"}</span></div>`;
  else mid = `<div class="pipy n${r}">${Array.from({ length: Number(r) }, () => suitSvg(s)).join("")}</div>`;
  return `<div class="karta${dc}"${st} aria-label="${esc(T.rank_long[en][r] || r)} ${esc(SUIT[s]?.n[en] || s)}">
    <span class="roh">${esc(rk)}${suitSvg(s, "mala")}</span>${mid}<span class="roh dole">${esc(rk)}${suitSvg(s, "mala")}</span></div>`;
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

function darts(view) {
  const D = S.darts || (S.darts = { left: 201, turns: 0, log: [], stuck: [] });
  const aims = ["safe", "risky", "bull", "finish"];
  view.replaceChildren(h(`<div class="stul-scena live" data-img="mesto-hostinec" data-key="hostinec">
    <div class="terc-plocha"><div class="terc"><img src="${DOM("hra-terc")}" alt="">${D.stuck.map((s) => `<span class="zabodnuta" style="left:${s.x}%;top:${s.y}%">${DART}</span>`).join("")}</div></div>
    <div class="tablepanel panel"><h2>🎯 ${esc(t("darts"))}</h2>
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
      el.className = "zabodnuta letí" + (spot.miss ? " mimo" : "");
      el.style.left = spot.x + "%"; el.style.top = spot.y + "%"; el.innerHTML = DART;
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
  return `<div class="vctl ${cls}">${Object.keys(rows).sort((a, b) => a - b).map((r) => `<div class="vrow">${rows[r].map((c) => c.t === "select"
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
