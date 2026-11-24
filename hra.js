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
  nav_hero: ["Postava", "Hero"], nav_bag: ["Batoh", "Bag"], nav_pet: ["Mazlíček", "Companion"], nav_admin: ["Admin", "Admin"], nav_denik: ["Deník", "Journal"], nav_market: ["Trh", "Market"],
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
  coming: ["Na webu jde celé město, výpravy i hry s hráči. Družinu založíš nebo se k ní přidáš u Brány — tady i na Discordu ve shromaždišti.",
    "The whole town, expeditions and player games are on the web. Found or join a party at the Town gate — here or on Discord."],
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
if (!["cs", "en", "pl", "sk"].includes(S.lang)) S.lang = "cs";

function t(key, ...args) {
  const row = T[key];
  // r27-4: polština a slovenština (jazyky.js); co chybí: slovensky → česky, polsky → anglicky
  const extra = (S.lang === "pl" || S.lang === "sk") && typeof T2 !== "undefined" ? T2[S.lang][key] : undefined;
  let s = extra !== undefined ? extra : row ? row[S.lang === "en" || S.lang === "pl" ? 1 : 0] : key;
  if (typeof s === "string") args.forEach((a, i) => { s = s.replace("{" + i + "}", a); });
  return s;
}
const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
/** Text z Discordu (markdown **tučně**, -# drobně) → bezpečné HTML. */
function md(text) {
  if (typeof obsahJazyk === "function") text = obsahJazyk(text);   // r27-5: obsah ze serveru slovensky / polsky
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
        body: JSON.stringify({ op, token: S.token, lang: S.lang === "pl" ? "en" : S.lang === "sk" ? "cs" : S.lang, ...data }) });
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
    if (src && !img.getAttribute("src")) img.src = "data:image/png;base64," + src;
  });
}
// r27-4: malované ikony předmětů (repo grafiky img/predmety/ikony/<slug>.webp); kde malba chybí, zůstane ikona ze serveru
const icon = (id) => `<img class="icon malovana" alt="" data-item="${esc(id)}" src="${IMG_BASE}predmety/ikony/${Postava.slug(id)}.webp" onerror="ikonaZaloha(this)">`;
function ikonaZaloha(img) {
  img.onerror = null; img.classList.remove("malovana"); img.dataset.zaloha = "1";
  const s = S.icons[img.dataset.item];
  if (s) img.src = "data:image/png;base64," + s; else img.removeAttribute("src");
}

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
  if (sky) sky.textContent = has && me.weather ? (me.night && me.weather === "jasno" ? "🌙" : SKY[me.weather] || "") + " " + (S.lang === "en" || S.lang === "pl" ? SKY_EN[me.weather] || me.weather : me.weather) : "";
  $("#tb-level").hidden = $("#tb-coins").hidden = !has;
}

// r27-4: povinné načítání (aspoň chvilku) — stav, rady, přednačtení mapy města
const RADY = [
  ["Na výpravu se vyplatí vzít louč a obvazy.", "Take a torch and bandages on an expedition."],
  ["Groše uložené ve směnárně na cestě neztratíš.", "Coins left at the money changer are safe on the road."],
  ["V noci se v hostinci dá vloupat do truhel — pokud máš odvahu.", "At night you can break into chests at the inn — if you dare."],
  ["Kovář ti opraví i zušlechtí zbraň.", "The smith repairs and enhances weapons."],
  ["Kněz uděluje jedno požehnání denně.", "The priest grants one blessing a day."],
  ["Kliknutím do mapy města vstoupíš na dané místo.", "Click the town map to enter a place."],
];
async function nacitani(uloha) {
  const box = $("#nacitani"), linka = box.querySelector(".n-linka i"), znak = box.querySelector(".n-znak"),
    stav = box.querySelector(".n-stav"), proc = box.querySelector(".n-proc"), zast = box.querySelectorAll(".n-zastavky li");
  const kroky = L([["Otevírá se městská brána…", "Strážní kontrolují glejt…", "Vyvolávač čte vyhlášky…", "Vítej v Kutné Hoře."],
                   ["The town gate opens…", "Guards check your writ…", "The crier reads the notices…", "Welcome to Kutná Hora."]]);
  const jmena = L([["Brána", "Glejt", "Vyhlášky", "Město"], ["Gate", "Writ", "Notices", "Town"]]);
  zast.forEach((z, i) => { z.textContent = jmena[i]; });
  box.querySelector(".n-rada").textContent = L(RADY[Math.floor(Math.random() * RADY.length)]);
  box.querySelector(".n-rok").textContent = L(["Kutnohorsko · Léta Páně 1403", "Kutná Hora region · Anno Domini 1403"]);
  box.querySelector(".n-rada-h").textContent = L(["Rada pro cestu", "Advice for the road"]);
  box.querySelector(".n-drobne").textContent = L(["Stájník ještě čistí latrínu po noční změně…", "The stable boy is still sweeping up after the night shift…"]);
  box.hidden = false; box.classList.remove("pryc");
  const mapa = new Promise((ok) => { const i = new Image(); i.onload = i.onerror = ok; i.src = IMG_BASE + (innerWidth <= 760 ? "mesto-mapa-m.webp" : "mesto-mapa.webp"); setTimeout(ok, 4000); });
  let hotovo = false, p = 0;
  const kresli = () => {
    const k = Math.min(3, Math.floor(p / 25.01));
    linka.style.width = znak.style.left = p + "%"; proc.textContent = Math.round(p) + " %"; stav.textContent = kroky[hotovo ? 3 : Math.min(k, 2)];
    zast.forEach((z, i) => z.classList.toggle("on", p >= i * 33.3));
  };
  const tik = setInterval(() => { p = Math.min(hotovo ? 100 : 88, p + (hotovo ? 9 : Math.max(0.6, (88 - p) / 22))); kresli(); }, 60);
  kresli();
  const min = new Promise((ok) => setTimeout(ok, 2400));
  try { await Promise.all([uloha, mapa, min]); } finally {
    hotovo = true;
    await new Promise((ok) => { const w = setInterval(() => { if (p >= 100) { clearInterval(w); ok(); } }, 50); });
    clearInterval(tik); kresli();
    await new Promise((ok) => setTimeout(ok, 500));
    box.classList.add("pryc"); setTimeout(() => { box.hidden = true; }, 600);
  }
}
async function enterGame() {
  $("#login").hidden = true;
  let ok = true;
  await nacitani(call("me").catch(() => { ok = !!S.token; }));
  if (!ok) return;
  $("#game").hidden = false;
  call("admin_check", {}, true).then((r) => { const b = document.querySelector('[data-tab="admin"]'); if (b) b.hidden = !r.admin; }).catch(() => {});   // r27-4: jen pro správce
  go(store.get("tab") === "admin" ? "mesto" : store.get("tab") || "mesto");
}

const TAB_OF = { mesto: "mesto", misto: "mesto", obchod: "mesto", hra: "mesto", vyprava: "mesto", statek: "mesto", panel: "mesto", domov: "mesto", kohouti: "mesto", hraci: "mesto", aukce: "mesto", souboje: "mesto", hrbitov: "mesto", kroniky: "mesto", truhla: "mesto", napoje: "mesto", zverinec: "mesto", dilna: "mesto", hero: "hero", bag: "bag", more: "more", pet: "pet", denik: "denik", admin: "admin", prirucka: "more" };

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
  if ((typeof Zvuk !== "undefined")) { if (!["mesto", "misto", "obchod", "hra", "vyprava", "panel", "domov", "kohouti", "statek"].includes(tab)) { Zvuk.scene([], S.me || {}, true); Zvuk.music(townMusic()); } }
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
  view.dataset.tab = S.tab; view.classList.toggle("kniha", ["hero", "bag", "more", "pet", "denik", "admin"].includes(S.tab));   // příručka má vlastní knihu                         // r27-4: vzhled podle záložky (Noc nad městem / Kronika)
  view.classList.toggle("wide", ["mesto", "misto", "obchod", "hra", "vyprava", "panel", "domov", "kohouti", "statek", "hraci", "aukce", "souboje", "hrbitov"].includes(S.tab));
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
const HERO = { karta: "schop" };
VIEWS.hero = (view) => {
  const m = S.me, P = m.profil || {};
  const bar = (label, val, max, cls) => {
    const pct = Math.max(0, Math.min(100, max ? (100 * val) / max : 0));
    return `<div class="bar"><div class="spread"><span>${esc(label)}</span><span class="muted">${esc(val)} / ${esc(max)}</span></div>
      <div class="track"><div class="fill ${cls}" style="width:${pct}%"></div></div></div>`;
  };
  const sg = (n) => (n >= 0 ? "+" : "") + n;
  // r27-4: mazlíček vedle postavy (malované zvíře podle stupně růstu)
  const pet = P.pet ? `<figure class="hero-pet${P.pet.hungry ? " hlad" : ""}" style="--vel:${[0.62, 0.8, 1, 1.06][P.pet.stage]}">
      ${IMG("bytosti/zvire-" + (ZVIRE_SLUG[P.pet.kind] || Postava.slug(P.pet.kind)) + "-" + P.pet.stage)}</figure>` : "";   // jen pro efekt; podrobnosti má záložka Mazlíček
  const schop = (P.abilities || []).map((a) => `<li class="${a.known ? "" : "zamceno"}"><div class="spread"><b>${esc(a.name)}</b>
      <span class="pill">${esc(a.known ? (a.cost ? L(["výdrž ", "stamina "]) + a.cost + (a.per ? " · " + a.per + L(["× za boj", "× per fight"]) : "") : L(["stálá", "passive"])) : L(["od úrovně ", "from level "]) + a.lvl)}</span></div>
      <p>${esc(a.desc)}</p></li>`).join("");
  const dov = (P.skills || []).map((k) => `<div class="dovednost${k.craft && !k.has ? " zamceno" : ""}">
      <div class="spread"><span><b>${esc(k.name)}</b>${k.craft ? `<small>${esc(k.has ? L([" · řemeslo z podniku", " · craft"]) : L([" · až s vlastním podnikem", " · needs your business"]))}</small>` : ""}</span><b class="lvl">${esc(k.lvl)} / ${esc(k.max)}</b></div>
      <div class="body10">${Array.from({ length: k.max }, (_, i) => `<i class="${i < k.lvl ? "on" : ""}"></i>`).join("")}</div>
      <div class="muted small" title="${esc(k.what || "")}">${esc(L(["praxe ", "practice "]) + k.xp + " / " + k.need)}</div></div>`).join("");
  const U = P.ucinky || [];
  const ucinky = U.length ? ["bonus", "postih"].map((kind) => {
      const z = U.filter((x) => x.kind === kind); if (!z.length) return "";
      return `<div class="uc-sk ${kind}"><small>${esc(kind === "bonus" ? L(["Bonusy", "Bonuses"]) : L(["Postihy", "Penalties"]))}</small>${z.map((x) => `<div class="ucinek ${kind}">
        <span class="uc-znak">${kind === "bonus" ? "+" : "−"}</span><div><b>${esc(x.name)}</b><p>${esc(noEmoji(x.text))}</p>${x.src ? `<small>${esc(x.src)}</small>` : ""}</div></div>`).join("")}</div>`;
    }).join("") : `<div class="empty">${esc(L(["Na postavu teď nic zvláštního nepůsobí. Požehnání v chrámu, odvary nebo mazlíček přidají bonusy; hlad, únava a zima ubírají.", "Nothing special affects you now."]))}</div>`;
  const HK = [["stav", L(["Stav a boj", "Condition & combat"])], ["vlast", L(["Vlastnosti", "Attributes"])],
    ["schop", L(["Schopnosti", "Abilities"])], ["dov", L(["Dovednosti", "Skills"])],
    ["uc", L(["Účinky", "Effects"]) + (U.length ? ` <i class="hk-pocet${U.some((x) => x.kind === "postih") ? " zle" : ""}">${U.length}</i>` : "")]];
  if (!HK.some(([k]) => k === HERO.karta)) HERO.karta = "stav";   // (záložka „boj“ je teď součástí „stav“)
  const obsah = {
    stav: () => {   // r27-4: stav a boj dohromady — kruhy potřeb a erbovní znaky boje
      // r27-5: znaky boje jako jednotné kulaté pečeti — malá ikona nahoře, hodnota přesně uprostřed
      const IKO = {
        stit: `<path d="M0 -11 L9 -8 V-1 C9 6 4 10 0 12 C-4 10 -9 6 -9 -1 V-8 Z"/>`,
        mec: `<path d="M0 -13 L2 -10 V5 H-2 V-10 Z"/><path d="M-6 5 H6 M0 5 V11"/>`,
        hvezda: `<path d="M-9 4 C-9 -6 -3 -11 0 -12 C3 -11 9 -6 9 4 M-9 4 C-6 1 -3 1 0 4 C3 1 6 1 9 4"/>`,
        kostka: `<rect x="-8" y="-8" width="16" height="16" rx="3"/><circle cx="-3.5" cy="-3.5" r="1.3" fill="#3a1610"/><circle cx="3.5" cy="3.5" r="1.3" fill="#3a1610"/><circle cx="0" cy="0" r="1.3" fill="#3a1610"/>`,
      };
      const ZNAK = Object.fromEntries(Object.entries(IKO).map(([k, ik]) => [k, `<svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="46" fill="url(#zg2)" stroke="#c9a55a" stroke-width="4"/><circle cx="50" cy="50" r="38" fill="none" stroke="#f0d79a" stroke-width="1.2" opacity=".55"/>
        <g transform="translate(50 22) scale(.9)" fill="none" stroke="#f0d79a" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">${ik}</g></svg>`]));
      const znak = (z, val, nazev, pop) => `<div class="znak"><div class="znak-obr">${ZNAK[z]}<b>${esc(val)}</b></div><span>${esc(nazev)}</span><small>${esc(pop)}</small></div>`;
      const hp = Math.round(100 * m.health / Math.max(1, m.max_health));
      return `<svg width="0" height="0" style="position:absolute"><defs>
          <radialGradient id="zg1" cx="40%" cy="30%"><stop offset="0" stop-color="#f0d79a"/><stop offset=".55" stop-color="#c9a55a"/><stop offset="1" stop-color="#8a5a1c"/></radialGradient>
          <radialGradient id="zg2" cx="40%" cy="30%"><stop offset="0" stop-color="#c04a36"/><stop offset=".6" stop-color="#8e1b14"/><stop offset="1" stop-color="#5a0f0a"/></radialGradient></defs></svg>
        <div class="sb-sekce"><small>${esc(L(["Tělo a potřeby", "Body and needs"]))}</small></div>
        <div class="potreby velke">${potreby.map(([n, v, mx, c]) => `<div class="potreba ${c}" style="--p:${Math.max(0, Math.min(100, 100 * v / mx))}"><div class="kruh"><b>${esc(v)}</b><small>/ ${esc(mx)}</small></div><span>${esc(n)}</span></div>`).join("")}</div>
        ${OP.value || OP.nasoska ? `<p class="opilost-txt${OP.other < 0 ? " zle" : ""}">${OP.stage ? `<b>${esc(OP.stage.charAt(0).toUpperCase() + OP.stage.slice(1))}</b> · ${esc(L(["Výřečnost ", "Speech "]) + sg(OP.speech) + (OP.other ? L([" · útok a zkoušky ", " · attack & checks "]) + sg(OP.other) : "") + (OP.def ? L([" · obrana ", " · defence "]) + sg(OP.def) : ""))} · ${esc(L([`vyprchá o ${OP.decay} za hodinu`, `fades ${OP.decay}/hour`]))}` : ""}
          ${OP.nasoska ? `<span class="tag nasoska">${esc(L(["Násoska", "Drunkard"]))}</span> ${esc(L(["snese víc, ale střízlivému se třesou ruce (−1). Zbavíš se toho týdnem bez kapky.", "tolerates more, but shakes when sober (−1). A dry week cures it."]))}` : ""}</p>` : ""}
        ${hp < 35 ? `<p class="upozorneni ne">${esc(L(["Jsi těžce raněný — ošetři se u apatykáře, obvazem nebo noclehem.", "Badly wounded."]))}</p>` : ""}
        <div class="sb-sekce"><small>${esc(L(["Do boje", "In battle"]))}</small></div>
        <div class="znaky">
          ${znak("stit", m.armor_class, t("armor_class"), L(["čím víc, tím hůř tě zasáhnou", "harder to hit"]))}
          ${znak("mec", sg(P.attack_base ?? m.attack), t("attack"), L(["k hodu na zásah", "to hit"]))}
          ${znak("hvezda", sg(P.proficiency || 0), L(["Zdatnost", "Proficiency"]), L(["k útoku i zkouškám", "attack and checks"]))}
          ${znak("kostka", m.damage, t("damage"), L(["kostky zbraně + bonus", "weapon dice + bonus"]))}
        </div>
        <p class="muted hk-pozn">${esc(L(["Zásah = k20 + útok + zdatnost proti obraně nepřítele; 20 je kritický zásah. Hlad a žízeň pod 20 ubírají útok, únava i obranu.", "Hit = d20 + attack + proficiency vs defence."]))}</p>`;
    },
    vlast: () => `<div class="vlastnosti velke">${m.stats.map((st) => `<div class="vlastnost"><b>${esc(st.value)}</b><span>${esc(st.name)}</span><small>${esc(L(["bonus ", "bonus "]) + sg(Math.floor(st.value / 2)))}</small></div>`).join("")}</div>
      ${m.unspent ? `<p class="upozorneni">${esc(t("unspent", m.unspent))}</p>` : ""}<p class="muted hk-pozn">${esc(L(["Každé 2 body ve vlastnosti = +1 k hodům. Za každou novou úroveň dostaneš 1 bod.", "Every 2 points = +1 to rolls."]))}</p>`,
    schop: () => `${P.passive ? `<div class="hk-vlastnost"><small>${esc(L(["Speciální vlastnost původu", "Origin trait"]))}</small><p>${esc(noEmoji(P.passive))}</p></div>` : ""}<ul class="schopnosti">${schop}</ul>`,
    dov: () => `<div class="dovednosti">${dov}</div><p class="muted hk-pozn">${esc(L(["Bod přibude, až je praxe plná. Body 1–3 potvrdí lekce u mistra, dál rostou samy — nejvýš o bod za herní den.", "A point comes when practice is full."]))}</p>`,
    uc: () => ucinky,
  };
  const xpPct = Math.max(0, Math.min(100, m.xp_next ? 100 * m.xp / m.xp_next : 0));
  const OP = m.opilost || { value: 0 };
  const potreby = [[t("health"), m.health, m.max_health, "hp"], [t("satiety"), m.satiety, 100, "food"], [t("hydration"), m.hydration, 100, "water"], [t("rest"), m.rest, 100, "rest"],
    [L(["Opilost", "Drunkenness"]), OP.value || 0, 100, "drunk"]];
  view.replaceChildren(h(`
    ${m.on_raid ? `<div class="panel notice" style="margin-bottom:16px">🗺️ ${esc(t("on_raid"))}</div>` : ""}
    <header class="hero-hlava">
      <div class="hh-uroven" title="${esc(t("level_long", m.level))}"><small>${esc(L(["úroveň", "level"]))}</small><b>${esc(m.level)}</b></div>
      <div class="hh-jmeno"><h1>${esc(m.name)}</h1>
        <p>${esc(m.origin_name)}${P.role ? " · " + esc(noEmoji(P.role)) : ""}${P.titles && P.titles.length ? " · " + esc(P.titles.join(" · ")) : ""}</p>
        <div class="hh-zk"><i style="width:${xpPct}%"></i><span>${esc(t("xp"))} ${esc(m.xp)} / ${esc(m.xp_next)}</span></div></div>
      <div class="hh-cas">${esc(m.clock)}</div>
    </header>
    ${m.unspent ? `<p class="upozorneni">${esc(t("unspent", m.unspent))}</p>` : ""}
    ${P.wanted ? `<p class="upozorneni ne">${esc(L(["Hledaný! Odměna ", "Wanted! Bounty "]) + P.wanted.bounty + L([" gr. · pokuta u rychtáře ", " gr. · fine "]) + P.wanted.fine + " gr.")}</p>` : ""}
    ${P.bills_debt ? `<p class="upozorneni">${esc(L(["Dluh na výdajích: ", "Unpaid bills: "]) + P.bills_debt + L([" gr. (Radnice → Rychtář → Výdaje)", " gr."]))}</p>` : ""}
    ${P.debt ? `<p class="upozorneni">${esc(L(["Dluh u apatykáře: ", "Apothecary debt: "]) + P.debt + " gr.")}</p>` : ""}
    <div class="hero-sheet">
      <div class="hero-left">
        <div class="hero-fig live" data-img="mesto-pokoj" data-key="pokoj">${Postava.html(m, IMG_BASE)}${pet}</div>
      </div>
      <div class="panel hero-karty">
        <nav class="hk-zalozky">${HK.map(([k, n]) => `<button class="${HERO.karta === k ? "on" : ""}" data-karta="${k}">${n}</button>`).join("")}</nav>
        <div class="hk-obsah hk-${HERO.karta}">${obsah[HERO.karta] ? obsah[HERO.karta]() : ""}</div>
      </div>
    </div>`));
  mountLive(view, { still: true });
  view.querySelectorAll("[data-karta]").forEach((b) => b.onclick = () => { HERO.karta = b.dataset.karta; render(); });
};

// r27-4: admin panel — vidí ho jen správce (ověřuje server podle Discord účtu)
VIEWS.admin = async (view) => {
  view.replaceChildren(h(`<div class="panel"><h3>${esc(L(["Admin panel", "Admin panel"]))}</h3><div id="adm"><div class="empty">…</div></div></div>`));
  let r; try { r = await call("admin", { action: "stav" }); } catch { go("mesto"); return; }
  const box = $("#adm"); if (!box) return;
  box.innerHTML = `<div class="bojstaty adm-cisla">
      <div><small>${esc(L(["Verze", "Build"]))}</small><b>${esc(r.build)}</b></div><div><small>${esc(L(["Postavy", "Characters"]))}</small><b>${r.players}</b></div>
      <div><small>${esc(L(["Výpravy", "Expeditions"]))}</small><b>${r.missions}</b></div><div><small>${esc(L(["Družiny čekají", "Lobbies"]))}</small><b>${r.lobbies}</b></div>
      <div><small>${esc(L(["Hry a souboje", "Games"]))}</small><b>${r.games}</b></div><div><small>${esc(L(["Přihlášení na webu", "Web logins"]))}</small><b>${r.web}</b></div></div>
    <h4>${esc(L(["Hráči", "Players"]))} · ${(r.hraci || []).filter((x) => x.stav === "online").length} online</h4>
    <div class="adm-hraci">${(r.hraci || []).map((x) => {
      const pred = x.ago == null ? L(["nikdy", "never"]) : x.ago < 60 ? L(["teď", "now"]) : x.ago < 3600 ? Math.floor(x.ago / 60) + " min" : x.ago < 86400 ? Math.floor(x.ago / 3600) + " h" : Math.floor(x.ago / 86400) + L([" dní", " days"]);
      return `<div class="adm-hrac ${x.stav}"><i class="tecka"></i><div><b>${esc(x.name)}</b><small>${esc(x.discord + " · " + x.origin + " · " + L(["úr. ", "lv. "]) + x.level + " · " + x.coins + " gr.")}</small></div>
        <span class="adm-kde">${esc(x.stav === "online" ? "online" : x.stav === "nedavno" ? L(["před ", ""]) + pred : "offline · " + pred)}
          ${x.kde ? `<i class="adm-plat${/Discord/.test(x.kde) ? " dc" : ""}${/web/.test(x.kde) ? " web" : ""}">${esc(x.stav === "online" ? L(["hraje: ", "playing: "]) + x.kde : L(["naposledy: ", "last: "]) + x.kde)}</i>` : ""}
          ${x.vyprava ? `<i class="adm-plat">${esc(L(["na výpravě", "on expedition"]))}</i>` : ""}</span></div>`;
    }).join("")}</div>
    <h4>${esc(L(["Herní čas a datum", "Game time and date"]))}</h4>
    <div class="adm-cas"><span>${esc(L(["Teď: ", "Now: "]) + noEmoji(r.cas ? r.cas.text : "") + (r.cas ? " · " + r.cas.obdobi : ""))}</span>
      <label>${esc(L(["Den", "Day"]))} <input type="number" min="1" id="adm-den" value="${r.cas ? r.cas.den : 1}"></label>
      <label>${esc(L(["Hodina", "Hour"]))} <input type="number" min="0" max="23" id="adm-hod" value="${r.cas ? r.cas.hodina : 8}"></label>
      <label>${esc(L(["Minuta", "Minute"]))} <input type="number" min="0" max="59" id="adm-min" value="${r.cas ? r.cas.minuta : 0}"></label>
      <button class="btn primary" id="adm-cas-ok">${esc(L(["Nastavit čas", "Set time"]))}</button></div>
    <p class="muted small">${esc(L(["Posun dopředu spustí, co se za ty dny má stát (výdaje, růst zvířat, úroda). Posun zpět může zmást věk postav a lhůty — používej opatrně. Roční období se řídí skutečným kalendářem (každých 7 dní další), herním časem se nemění.", "Moving forward triggers daily ticks; moving back may confuse ages and deadlines."]))}</p>
    <div class="adm-akce"><h4>${esc(L(["Verze a nasazení", "Version and deploy"]))}</h4>
      <div class="row"><button class="btn" data-adm="info">${esc(L(["Zjistit verzi na GitHubu", "Check GitHub version"]))}</button>
        <button class="btn primary" data-adm="nova" data-q="${esc(L(["Nasadit novou verzi z GitHubu a restartovat bota?", "Deploy and restart?"]))}">${esc(L(["Nasadit novou verzi", "Deploy new version"]))}</button>
        <button class="btn" data-adm="restart" data-q="${esc(L(["Restartovat bota? Hráči budou chvíli offline.", "Restart the bot?"]))}">${esc(L(["Restartovat bota", "Restart bot"]))}</button>
        <button class="btn danger" data-adm="zpet" data-q="${esc(L(["Vrátit předchozí verzi a restartovat?", "Roll back and restart?"]))}">${esc(L(["Vrátit předchozí verzi", "Roll back"]))}</button></div>
      <div id="adm-vysl" class="dtext"></div></div>
    <h4>${esc(L(["Hospodářská zpráva", "Economy report"]))}</h4><div class="dtext adm-zprava">${dmd(r.economy || "")}</div>`;
  $("#adm-cas-ok").onclick = async () => {
    const data = { den: $("#adm-den").value, hodina: $("#adm-hod").value, minuta: $("#adm-min").value };
    if (!confirm(L(["Nastavit herní čas na ", "Set game time to "]) + data.den + ". den " + String(data.hodina).padStart(2, "0") + ":" + String(data.minuta).padStart(2, "0") + "?")) return;
    try { const x = await call("admin", { action: "cas", data }); toast(noEmoji(x.text || "").replace(/\*\*/g, "")); await call("me"); render(); } catch {}
  };
  box.querySelectorAll("[data-adm]").forEach((b) => b.onclick = async () => {
    if (b.dataset.q && !confirm(b.dataset.q)) return;
    b.disabled = true;
    try { const x = await call("admin", { action: b.dataset.adm }); $("#adm-vysl").innerHTML = dmd(x.text || ""); } catch {}
    b.disabled = false;
  });
};

// r27-4: příručka hráče — kniha s kapitolami (jako příručka na serveru), hledání v textu
const PRIR = { k: 0, data: null, q: "" };
const RIMSKE = (n) => ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI"][n] || String(n + 1);
VIEWS.prirucka = async (view) => {
  if (!PRIR.data) { view.innerHTML = `<div class="panel empty">…</div>`; try { PRIR.data = (await call("prirucka", {}, true)).kapitoly; } catch { return; } if (S.tab !== "prirucka") return; }
  const K = PRIR.data, q = PRIR.q.trim().toLowerCase();
  const shoda = (k) => !q || (k.title + " " + k.text).toLowerCase().includes(q);
  if (!shoda(K[PRIR.k])) { const f = K.findIndex(shoda); if (f >= 0) PRIR.k = f; }
  const kap = K[PRIR.k] || K[0];
  const cisty = (t_) => String(t_ || "").replace(/^#\s+.*\n?/, "");    // první nadpis kapitoly ukazujeme zvlášť
  let html = dmd(noEmoji(cisty(kap.text)));
  if (q) html = html.replace(new RegExp("(" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")(?![^<]*>)", "gi"), "<mark>$1</mark>");
  view.replaceChildren(h(`<div class="denik-kniha prirucka">
    <header class="dk-hlava"><span class="pecet" aria-hidden="true">KS</span><div><small>${esc(L(["Královské stezky · Kutnohorsko · Léta Páně 1403", "Royal Trails"]))}</small>
      <h2>${esc(L(["Příručka hráče", "Player's handbook"]))}</h2></div>
      <input class="search pr-hledat" id="pr-q" type="search" placeholder="${esc(L(["Hledat v příručce…", "Search…"]))}" value="${esc(PRIR.q)}"></header>
    <div class="dk-telo"><div class="dk-strana pr-strana"><p class="kapitola">${esc(L(["Kapitola ", "Chapter "]) + RIMSKE(PRIR.k))}</p>
        <h3 class="dk-nadpis">${esc(noEmoji(kap.title))}</h3><div class="dtext pr-text">${html}</div>
        <div class="row pr-dalsi">${PRIR.k > 0 ? `<button class="btn small" data-pk="${PRIR.k - 1}">← ${esc(noEmoji(K[PRIR.k - 1].title))}</button>` : "<span></span>"}
          ${PRIR.k < K.length - 1 ? `<button class="btn small" data-pk="${PRIR.k + 1}">${esc(noEmoji(K[PRIR.k + 1].title))} →</button>` : ""}</div></div>
      <nav class="dk-zalozky pr-zalozky">${K.map((k, i) => `<button class="${i === PRIR.k ? "on" : ""}${shoda(k) ? "" : " mimo"}" data-pk="${i}"><i>${RIMSKE(i)}</i>${esc(noEmoji(k.title))}</button>`).join("")}</nav></div></div>
    <p><button class="btn" data-go="more">← ${esc(t("back"))}</button></p>`));
  view.querySelector("[data-go]").onclick = () => go("more");
  view.querySelectorAll("[data-pk]").forEach((b) => b.onclick = () => { PRIR.k = Number(b.dataset.pk); render(); window.scrollTo(0, 0); });
  const qi = $("#pr-q"); let tm;
  qi.oninput = () => { clearTimeout(tm); tm = setTimeout(() => { PRIR.q = qi.value; render(); const n = $("#pr-q"); if (n) { n.focus(); n.setSelectionRange(n.value.length, n.value.length); } }, 350); };
};

// --- batoh
VIEWS.bag = (view) => {
  // r27-4: vlevo Nasazeno a Na opasku, vpravo Kapsy a Batoh (jen to, co je v nich — ne co má postava na sobě)
  const m = S.me, N = m.nosim || { pockets: [], backpack: [], belt: [], pockets_max: 5, backpack_max: 0, belt_max: 2 };
  const row = {}; m.inventory.forEach((i) => { row[i.id] = i; });
  const vec = ([id, q]) => {
    const i = row[id] || { id, name: id, slot_name: "" };
    return `<div class="item">${icon(id)}
      <div><div class="nm">${esc(i.name)}${q > 1 ? ` <span class="muted">× ${esc(q)}</span>` : ""}</div>
      <div class="meta">${esc(i.slot_name)}${i.merchant_name ? " · " + esc(t("sell_to", i.merchant_name)) : ""}</div>${opotrebeni(i)}</div>
      <div class="acts">
        ${i.use ? `<button class="btn small" data-use="${esc(id)}">${esc(t("use"))}</button>` : ""}
        ${i.equip ? `<button class="btn small" data-equip="${esc(id)}">${esc(t("equip"))}</button>` : ""}
        ${i.sell ? `<button class="btn small" data-sell="${esc(id)}" data-name="${esc(i.name)}" data-shop="${esc(i.merchant)}" data-price="${esc(i.sell)}">${esc(t("sell"))} · ${esc(t("coins", i.sell))}</button>` : ""}
      </div></div>`;
  };
  const prazdne = (n) => Array.from({ length: Math.max(0, n) }, () => `<div class="item volno"><span class="icon prazdne"></span><div class="muted">${esc(L(["volné místo", "empty slot"]))}</div></div>`).join("");
  const blok = (nadpis, pocet, obsah) => `<div class="panel"><div class="spread"><h3>${esc(nadpis)}</h3>${pocet ? `<span class="pill">${esc(pocet)}</span>` : ""}</div><div class="items">${obsah}</div></div>`;
  view.replaceChildren(h(`
    ${m.on_raid ? `<div class="panel notice" style="margin-bottom:16px">🗺️ ${esc(t("on_raid"))}</div>` : ""}
    <div class="grid g2 batoh" style="align-items:start">
      <div class="grid">
        ${blok(t("equipped"), "", m.equipped.length ? m.equipped.map((e) => `<div class="item eq">${icon(e.id)}
          <div><div class="nm">${esc(e.name)}${e.enh ? ` <span class="muted">+${e.enh}</span>` : ""}</div><div class="meta">${esc(e.slot_name)}</div>${opotrebeni(e)}</div>
          <div class="acts"><button class="btn small" data-unequip="${esc(e.slot)}">${esc(t("unequip"))}</button></div></div>`).join("")
          : `<div class="empty">${esc(L(["Pěsti a obyčejný oděv.", "Fists and plain clothes."]))}</div>`)}
        ${blok(L(["Na opasku", "On the belt"]) + (N.belt_name ? " · " + N.belt_name : ""), N.belt.length + " / " + N.belt_max,
          N.belt.map(vec).join("") + prazdne(N.belt_max - N.belt.length))}
      </div>
      <div class="grid">
        ${blok(L(["Kapsy", "Pockets"]), N.pockets.length + " / " + N.pockets_max, N.pockets.map(vec).join("") + prazdne(N.pockets_max - N.pockets.length))}
        ${N.backpack_max ? blok(N.bag_name || L(["Batoh", "Backpack"]), N.backpack.length + " / " + N.backpack_max, N.backpack.map(vec).join("") + prazdne(N.backpack_max - N.backpack.length))
          : blok(L(["Batoh", "Backpack"]), "", `<div class="empty">${esc(L(["Nemáš batoh — kup ho u krejčího nebo vetešníka.", "No backpack yet."]))}</div>`)}
      </div>
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

// r27-4: kroniky z Discordu na radnici — kniha se záložkami (jako deník)
const KRON = { sekce: "udalosti" };
VIEWS.kroniky = async (view) => {
  const SEK = [["udalosti", ["Kronika událostí", "Events"]], ["slavni", ["Kronika slavných", "Hall of fame"]], ["zijici", ["Žijící hrdinové", "Living heroes"]], ["vysledky", ["Výsledky her", "Game results"]]];
  const RIM = ["I", "II", "III", "IV"];
  view.replaceChildren(h(`<div class="denik-kniha kroniky">
    <header class="dk-hlava"><span class="pecet" aria-hidden="true">KS</span><div><small>${esc(L(["Radnice Kutné Hory · Léta Páně 1403", "Kutná Hora town hall"]))}</small>
      <h2>${esc(L(["Městské kroniky", "Town chronicles"]))}</h2></div></header>
    <div class="dk-telo"><div class="dk-strana" id="kron-obsah"><div class="empty">…</div></div>
      <nav class="dk-zalozky">${SEK.map(([k, n], i) => `<button class="${KRON.sekce === k ? "on" : ""}" data-sek="${k}"><i>${RIM[i]}</i>${esc(L(n))}</button>`).join("")}</nav></div></div>
    <p><button class="btn" data-go="misto/radnice">← ${esc(t("back"))}</button></p>`));
  view.querySelector("[data-go]").onclick = () => go("misto/radnice");
  view.querySelectorAll("[data-sek]").forEach((b) => b.onclick = () => { KRON.sekce = b.dataset.sek; render(); });
  let D; try { D = await call("kroniky", {}, true); } catch { return; }
  const box = $("#kron-obsah"); if (!box) return;
  const i = SEK.findIndex(([k]) => k === KRON.sekce), hl = `<p class="kapitola">${esc(L(["Kapitola ", "Chapter "]) + RIM[i])}</p><h3 class="dk-nadpis">${esc(L(SEK[i][1]))}</h3>`;
  const kdy = (ts) => new Date(ts * 1000).toLocaleString(({ en: "en-GB", pl: "pl-PL", sk: "sk-SK" }[S.lang] || "cs-CZ"), { day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit" });
  const zapisy = (list, prazdno) => list.length ? `<ul class="kron-zapisy">${list.map((z) => `<li><span class="kdy">${esc(kdy(z.t))}</span><span>${dmdInline(noEmoji(z.text))}</span></li>`).join("")}</ul>`
    : `<div class="empty">${esc(L(prazdno))}</div>`;
  if (KRON.sekce === "udalosti") box.innerHTML = hl + zapisy(D.udalosti, ["Kronikář zatím nemá co zapsat.", "Nothing yet."]);
  else if (KRON.sekce === "vysledky") box.innerHTML = hl + zapisy(D.vysledky, ["Zatím se nic nedohrálo — výsledky her a zápasů se sem zapisují od tohoto vydání.", "No results yet."]);
  else if (KRON.sekce === "slavni") box.innerHTML = hl + `<div class="slavni">${D.slavni.map((m) => `<section><h4>${esc(m.title)}</h4><ol>${m.rows.map((r, j) =>
      `<li class="${j < 3 ? "m" + j : ""}"><b>${esc(r.name)}</b><span>${esc(r.value + " " + m.unit)}</span></li>`).join("") || `<li class="muted">—</li>`}</ol></section>`).join("")}</div>`;
  else box.innerHTML = hl + `<div class="zijici">${D.zijici.map((z) => `<div class="zijici-k"><b>${esc(z.name)}</b><small>${esc(z.origin + " · " + L(["úroveň ", "level "]) + z.level)}</small>
      <span>${esc((z.age ? L(["žije ", "alive "]) + z.age + " · " : "") + z.runs + L([" výprav", " runs"]))}</span></div>`).join("")}</div>`;
};

// r27-4: truhla v hostinci — vlevo co máš u sebe (Vložit), vpravo co je v truhle (Vzít); nájem a služby nahoře
VIEWS.truhla = async (view) => {
  let T; try { T = (await call("truhla", {}, true)).truhla; } catch { return; }
  const C = T.chest;
  const vec = (i, act, lbl, off) => `<div class="item">${icon(i.id)}<div><div class="nm">${esc(i.name)}${i.count > 1 ? ` <span class="muted">× ${i.count}</span>` : ""}</div></div>
    <div class="acts"><button class="btn small${act === "take" ? " primary" : ""}" data-tr="${act}" data-v="${esc(i.id)}"${off ? " disabled" : ""}>${esc(lbl)}</button></div></div>`;
  const plno = C && C.used >= C.slots;
  view.replaceChildren(h(`${sceneHead("mesto-hostinec", L(["Truhla u hostinského", "Chest at the inn"]), L(["Hostinský: „Co sem dáš, to tu najdeš. Pokud platíš.“", "Innkeeper: \"What you put in, you'll find. If you pay.\""]), true)}
    ${C ? `<div class="panel truhla-stav">
        <div class="ts-info"><b>${esc(C.name)}${C.iron ? " · " + L(["okovaná", "iron-bound"]) : ""}</b>
          <span>${esc(L(["Místa: ", "Slots: "]) + C.used + " / " + C.slots + L([" druhů věcí", " kinds"]))}</span>
          <span class="${C.debt ? "ne" : ""}">${esc(C.debt ? L(["Zamčeno — dluh ", "Locked — debt "]) + C.debt + L([" gr. (Rychtář → Výdaje)", " gr."]) : L(["Předplaceno na ", "Paid for "]) + C.weeks + L([" týd. (nejvýš ", " wk (max "]) + T.prepay_max + ")")}</span></div>
        <div class="row ts-akce">
          <button class="btn" data-cid="ks:innchest:rent:${C.size}:1"${C.debt || C.weeks >= T.prepay_max || T.coins < C.rent ? " disabled" : ""}>${esc(L(["Předplatit týden · ", "Prepay a week · "]) + C.rent + " gr.")}</button>
          ${C.iron ? "" : `<button class="btn" data-cid="ks:innchest:iron"${T.coins < C.iron_price ? " disabled" : ""} title="${esc(L(["Těžší zámek proti vloupání v noci", "Harder lock against night thieves"]))}">${esc(L(["Okovat · ", "Iron-bind · "]) + C.iron_price + " gr.")}</button>`}
          ${C.size === "mala" && T.level >= (T.nabidka.find((x) => x.key === "velka") || {}).level ? `<button class="btn" data-cid="ks:innchest:rent:velka:1"${C.debt ? " disabled" : ""}>${esc(L(["Vylepšit na velkou truhlu", "Upgrade to a large chest"]))}</button>` : ""}
          ${T.house ? `<button class="btn" data-cid="ks:innchest:move"${C.debt ? " disabled" : ""}>${esc(L(["Přestěhovat domů", "Move home"]))}</button>` : ""}
          ${T.porter ? `<button class="btn primary" data-cid="ks:porter:pay">${esc(L(["Nosič: uložit kořist (", "Porter: store loot ("]) + T.porter + ")")}</button>` : ""}
        </div></div>
      <div class="grid g2 truhla-sloupce" style="align-items:start">
        <div class="panel"><div class="spread"><h3>${esc(L(["U sebe", "Carried"]))}</h3><span class="pill">${T.carried.length}</span></div>
          <div class="items">${T.carried.length ? T.carried.map((i) => vec(i, "put", L(["Vložit", "Put in"]), C.debt || (plno && !C.items.some((x) => x.id === i.id)))).join("") : `<div class="empty">${esc(L(["Nic u sebe nemáš.", "Nothing carried."]))}</div>`}</div></div>
        <div class="panel"><div class="spread"><h3>${esc(L(["V truhle", "In the chest"]))}</h3><span class="pill">${C.used} / ${C.slots}</span></div>
          <div class="items">${C.items.length ? C.items.map((i) => vec(i, "take", L(["Vzít", "Take"]), C.debt)).join("") : `<div class="empty">${esc(L(["Truhla je prázdná.", "The chest is empty."]))}</div>`}</div></div>
      </div>`
    : `<div class="panel"><h3>${esc(L(["Pronájem truhly", "Rent a chest"]))}</h3>
        <p class="muted">${esc(L(["Truhla na věci (groše do ní nedáš). Nájem se platí na herní týdny dopředu. V noci se do truhel můžou vloupat jiní hráči — okovaná má těžší zámek.", "Item storage, paid weekly in advance."]))}</p>
        <div class="vp-volby">${T.nabidka.map((n) => [1, 4].map((wk) => `<button class="vp-volba" data-cid="ks:innchest:rent:${n.key}:${wk}"${T.level < n.level || T.coins < n.rent * wk ? " disabled" : ""}>
          <b>${esc(n.name + " · " + wk + L([" týd.", " wk"]))}</b><small>${esc(n.slots + L([" druhů věcí · ", " kinds · "]) + n.rent * wk + " gr." + (n.level > 1 ? L([" · od úrovně ", " · level "]) + n.level : ""))}</small></button>`).join("")).join("")}</div></div>`}
    <p><button class="btn" data-go="misto/hostinec">← ${esc(t("back"))}</button></p>`));
  mountLive(view);
  view.querySelector("[data-go]").onclick = () => go("misto/hostinec");
  const klik = async (id, values, el) => {
    if (el) el.disabled = true;
    try { const r = await call("raid_click", { id, values }); if (r.panel && r.panel.content) { const m = noEmoji(r.panel.content).replace(/\*\*/g, "").split("\n").find((x) => /^✅|^📥|^📤|Uložen|Vzal|Okov|Předplac|nájem/i.test(x.trim())); if (m) toast(m.trim()); } Zvuk.sfx("klik"); }
    catch {}
    render();
  };
  view.querySelectorAll("[data-tr]").forEach((b) => b.onclick = () => klik("ks:innchest:" + b.dataset.tr, [b.dataset.v], b));
  view.querySelectorAll("[data-cid]").forEach((b) => b.onclick = () => klik(b.dataset.cid, [], b));
  loadIcons([...T.carried, ...(C ? C.items : [])].map((i) => i.id));
};

// r27-4: hřbitov u Sedlce — postavy, jejichž hráči příběh ukončili (jako fórum Hřbitov na Discordu)
VIEWS.hrbitov = async (view) => {
  view.replaceChildren(h(`${sceneHead("mesto-chram", L(["Hřbitov u Sedlce", "Sedlec graveyard"]), L(["Hrobník: „Každý tu má svůj kámen. I ti, na které se zapomnělo.“", "Gravedigger: \"Everyone gets a stone here.\""]), true)}
    <div id="hroby" class="hroby"><div class="empty">…</div></div>
    <p><button class="btn" data-go="mesto">← ${esc(t("back_map"))}</button></p>`));
  mountLive(view);
  view.querySelector("[data-go]").onclick = () => go("mesto");
  let r; try { r = await call("hrbitov", {}, true); } catch { return; }
  const box = $("#hroby"); if (!box) return;
  box.innerHTML = r.hroby.length ? r.hroby.map((g) => `<article class="hrob"><div class="kriz"></div>
      <h3>${esc(g.name)}</h3><p class="h-puvod">${esc(g.origin + " · " + L(["úroveň ", "level "]) + g.level)}</p>
      <p class="h-napis">${esc(noEmoji(g.line))}</p>
      <p class="h-data">${esc((g.female ? L(["Žila ", "Lived "]) : L(["Žil ", "Lived "])) + g.lived)}<br>${esc((g.female ? L(["Odešla ", "Passed "]) : L(["Odešel ", "Passed "])) + g.died)}</p>
      <p class="h-cisla">${esc(g.runs + L([" výprav · ", " expeditions · "]) + g.kills + L([" poražených", " slain"]))}</p></article>`).join("")
    : `<div class="panel empty">${esc(L(["Hřbitov je zatím prázdný. Ať to tak dlouho zůstane.", "The graveyard is empty."]))}</div>`;
};

// r27-4: chat diváků (souboje, kohoutí zápasy) — rozepsaná zpráva přežije obnovení stránky zápasu
const CHAT = { draft: {}, focus: "" };
function chatHtml(room, msgs) {
  const cas = (ts) => new Date(ts * 1000).toLocaleTimeString(({ en: "en-GB", pl: "pl-PL", sk: "sk-SK" }[S.lang] || "cs-CZ"), { hour: "2-digit", minute: "2-digit" });
  const hospoda = room === "hostinec";
  return `<div class="chat${hospoda ? " hospoda" : ""}" data-room="${esc(room)}"><div class="chat-h">${esc(hospoda ? L(["Hospodské řeči", "Tavern talk"]) : L(["Pokřik z hlediště", "Shouts from the stands"]))}<small>${esc(hospoda ? L(["propojeno s #na-rynku na Discordu", "linked with #na-rynku on Discord"]) : L(["propojeno s vláknem zápasu na Discordu", "linked with the match thread on Discord"]))}</small></div>
    <ul class="chat-list">${(msgs || []).length ? msgs.map((m) => `<li${m.dc ? ' class="z-dc" title="z Discordu"' : ""}><span class="kdy">${cas(m.t)}</span><b>${esc(m.name)}</b> ${esc(m.text)}</li>`).join("")
      : `<li class="muted">${esc(hospoda ? L(["U stolů je zatím ticho. Prolomíš ho?", "Quiet at the tables."]) : L(["Zatím ticho. Zakřič první…", "Quiet so far."]))}</li>`}</ul>
    <form class="chat-form"><input maxlength="200" placeholder="${esc(hospoda ? L(["Řekni něco ke stolu…", "Say something…"]) : L(["Fanděj, hecuj, sázej…", "Cheer, jeer, bet…"]))}" value="${esc(CHAT.draft[room] || "")}"><button class="btn small primary">${esc(hospoda ? L(["Říct", "Say"]) : L(["Zakřičet", "Shout"]))}</button></form></div>`;
}
// hospodské řeči: obnova každé 4 s, jen dokud je hráč v lokálu
const HOSPODA = { timer: null };
async function hospodaKresli() {
  const box = document.getElementById("hospoda-reci");
  if (!box || S.tab !== "misto" || S.arg !== "hostinec") { clearInterval(HOSPODA.timer); return; }
  let r; try { r = await call("chat", { room: "hostinec" }, true); } catch { return; }
  box.innerHTML = chatHtml("hostinec", r.chat);
  wireChat(box, hospodaKresli);
}
function wireChat(box, after) {
  box.querySelectorAll(".chat").forEach((c) => {
    const room = c.dataset.room, inp = c.querySelector("input"), list = c.querySelector(".chat-list");
    list.scrollTop = list.scrollHeight;
    inp.oninput = () => { CHAT.draft[room] = inp.value; };
    // r27-5: obnova seznamu zpráv překreslí i pole — opravdové opuštění pole (klik jinam) se pozná až po chvilce;
    // když pole zmizelo kvůli překreslení, psaní pokračuje v novém poli (dřív Enter „vyhodil“ z rozhovoru)
    inp.onfocus = () => { CHAT.focus = room; };
    inp.onblur = () => setTimeout(() => { if (inp.isConnected && CHAT.focus === room && document.activeElement !== inp) CHAT.focus = ""; }, 0);
    if (CHAT.focus === room) { inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); }
    c.querySelector("form").onsubmit = async (ev) => {
      ev.preventDefault();
      const text = inp.value.trim(); if (!text) return;
      CHAT.focus = room;
      try { await call("chat_send", { room, text }); CHAT.draft[room] = ""; inp.value = ""; if (after) after(); } catch {}
    };
  });
}

// r27-5: oprava a zušlechtění jako obchod — vlevo opotřebená výbava (Opravit / Opravit vše), vpravo zušlechtění
VIEWS.dilna = async (view) => {
  const shop = decodeURIComponent(S.arg || "");
  const MIST = { "Kovář": ["mesto-kovar", "Kovář: „Ukaž, co jsi zase zohýbal.“"], "Střelmistr": ["mesto-strelmistr", "Střelmistr: „Tětiva se nenapne sama.“"],
    "Zbrojíř": ["mesto-zbrojir", "Zbrojíř: „Každý kroužek drží život.“"], "Krejčí": ["mesto-krejci", "Krejčí: „Záplata na záplatě, ale drží.“"] }[shop] || ["mesto-trziste", ""];
  view.replaceChildren(h(`${sceneHead(MIST[0], L(["Dílna: ", "Workshop: "]) + shop, MIST[1], true)}
    <div id="dilna"><div class="panel empty">…</div></div>
    <p><button class="btn" data-go="obchod/${esc(encodeURIComponent(shop))}">← ${esc(t("back"))}</button></p>`));
  mountLive(view);
  view.querySelector("[data-go]").onclick = () => go("obchod/" + encodeURIComponent(shop));
  let r; try { r = await call("dilna", { shop }); } catch { return; }
  const kresli = () => {
    const box = $("#dilna"); if (!box) return;
    box.innerHTML = `<div class="panel truhla-stav"><div class="ts-info"><b>${esc(shop)}</b><span>${esc(L(["Měšec: ", "Purse: "]) + t("coins", r.coins))}</span></div>
      ${r.repair.length > 1 ? `<button class="btn primary" id="opr-vse"${r.repair_all > r.coins ? " disabled" : ""}>${esc(L(["Opravit vše", "Repair all"]))} · ${esc(t("coins", r.repair_all))}</button>` : ""}</div>
      <div class="grid g2 truhla-sloupce" style="align-items:start">
        <div class="panel"><div class="spread"><h3>${esc(L(["Opravit", "Repair"]))}</h3><span class="pill">${r.repair.length}</span></div>
          <div class="items">${r.repair.length ? r.repair.map((i) => `<div class="item">${icon(i.id)}
            <div><div class="nm">${esc(i.name)}${i.equipped ? `<span class="tag ok">${esc(L(["nasazené", "worn"]))}</span>` : ""}</div>${opotrebeni(i)}</div>
            <div class="acts"><span class="price">${esc(t("coins", i.price))}</span><button class="btn small primary" data-opr="${esc(i.id)}"${i.price > r.coins ? " disabled" : ""}>${esc(L(["Opravit", "Repair"]))}</button></div></div>`).join("")
            : `<div class="empty">${esc(L(["Nic opotřebeného, co by tu spravili.", "Nothing worn that they fix here."]))}</div>`}</div></div>
        <div class="panel"><div class="spread"><h3>${esc(L(["Zušlechtit", "Improve"]))}</h3><span class="pill">${r.enhance.length}</span></div>
          <p class="muted small">${esc(r.can_enhance ? L(["Jen nasazená výbava. +1 a +2 se povede vždy, +3 jen napůl — při nezdaru groše propadnou. Zušlechtěné se dráž opravuje.", "Worn gear only. +3 succeeds half the time."]) : L(["Tenhle mistr nezušlechťuje.", "This master doesn't improve gear."]))}</p>
          <div class="items">${r.enhance.map((i) => `<div class="item">${icon(i.id)}
            <div><div class="nm">${esc(i.name)} ${i.enh ? `<span class="muted">+${i.enh}</span>` : ""} → <b>+${i.next}</b></div><div class="meta">${esc(i.risk ? L([`šance ${100 - i.risk} %`, `${100 - i.risk} % chance`]) : L(["jistě se povede", "sure to succeed"]))}</div></div>
            <div class="acts"><span class="price">${esc(t("coins", i.price))}</span><button class="btn small" data-zus="${esc(i.id)}"${i.price > r.coins ? " disabled" : ""}>${esc(L(["Zušlechtit", "Improve"]))}</button></div></div>`).join("")
            || (r.can_enhance ? `<div class="empty">${esc(L(["Nic nasazeného, co by šlo zušlechtit.", "Nothing worn to improve."]))}</div>` : "")}</div></div></div>`;
    loadIcons([...r.repair, ...r.enhance].map((i) => i.id));
    const po = (x) => { r = x; Zvuk.sfx("kovadlina"); kresli(); };
    box.querySelectorAll("[data-opr]").forEach((b) => b.onclick = () => { b.disabled = true; call("opravit", { shop, item: b.dataset.opr }).then((x) => { toast(L(["Opraveno za ", "Repaired for "]) + t("coins", x.price)); po(x); }).catch(() => { b.disabled = false; }); });
    const vse = $("#opr-vse"); if (vse) vse.onclick = () => { vse.disabled = true; call("opravit", { shop, all: true }).then((x) => { toast(L(["Vše opraveno za ", "All repaired for "]) + t("coins", x.price)); po(x); }).catch(() => { vse.disabled = false; }); };
    box.querySelectorAll("[data-zus]").forEach((b) => b.onclick = () => { b.disabled = true; call("zuslechtit", { shop, item: b.dataset.zus }).then((x) => {
      toast(x.ok ? L([`Povedlo se: +${x.level}!`, `Success: +${x.level}!`]) : L(["Nepovedlo se, groše propadly.", "Failed, the coins are gone."])); po(x); }).catch(() => { b.disabled = false; }); });
  };
  kresli();
};

// r27-5: zvěřinec — mláďata na prodej s náhledem zvířete, nákup s pojmenováním přímo v kartě
VIEWS.zverinec = async (view) => {
  view.replaceChildren(h(`${sceneHead("mesto-zverinec", L(["Zvěřinec", "Menagerie"]), L(["Zvěřinec: „Každé zvíře si najde svého pána.“", "Keeper: \"Every animal finds its master.\""]), true)}
    <div id="zver" class="zver-nabidka"><div class="panel empty">…</div></div>
    <p><button class="btn" data-go="misto/zverinec">← ${esc(t("back"))}</button></p>`));
  mountLive(view);
  view.querySelector("[data-go]").onclick = () => go("misto/zverinec");
  let r; try { r = await call("zverinec"); } catch { return; }
  const box = $("#zver"); if (!box) return;
  const slug = (k) => ZVIRE_SLUG[k] || Postava.slug(k);
  let vybr = null;
  const kresli = () => {
    box.innerHTML = `<div class="zver-mriz">${r.zvirata.map((z) => {
      const zam = z.level > r.level;
      return `<article class="zver-karta${z.owned ? " mas" : ""}${zam ? " zamceno" : ""}${vybr === z.kind ? " vybrane" : ""}">
        <div class="zk-obr">${IMG("bytosti/zvire-" + slug(z.kind) + "-0")}</div>
        <h3>${esc(z.kind)}</h3><p class="zk-pop">${esc(z.desc)}</p>
        <p class="zk-bonus"><small>${esc(L(["mládě", "young"]))}</small> ${esc(z.bonus_young)} <span>→</span> <small>${esc(L(["zkušený", "veteran"]))}</small> ${esc(z.bonus_full)}</p>
        <div class="zk-dole">${z.owned ? `<span class="tag ok">${esc(L(["už ho máš", "owned"]))}</span>` : zam ? `<span class="dim">${esc(L(["od úrovně ", "from level "]) + z.level)}</span>`
          : vybr === z.kind ? `<form class="zk-jmeno" data-jm="${esc(z.kind)}"><input maxlength="20" required placeholder="${esc(L(["Jméno mláděte", "Name"]))}"><button class="btn small primary">${esc(L(["Koupit", "Buy"]))} · ${z.price} gr.</button></form>`
          : `<span class="price">${esc(t("coins", z.price))}</span><button class="btn small primary" data-vyber="${esc(z.kind)}"${z.price > r.coins ? " disabled" : ""}>${esc(L(["Vybrat", "Choose"]))}</button>`}</div></article>`;
    }).join("")}</div>
    ${r.cart ? "" : `<div class="panel zk-povoz"><b>${esc(L(["Povoz s koněm", "Horse and cart"]))}</b> <span class="muted">${esc(L(["víc místa na kořist, od úrovně ", "more loot space, from level "]) + r.cart_level)}</span>
      <button class="btn small" id="povoz"${r.level < r.cart_level || r.coins < r.cart_price ? " disabled" : ""}>${esc(t("coins", r.cart_price))}</button></div>`}`;
    box.querySelectorAll("[data-vyber]").forEach((b) => b.onclick = () => { vybr = b.dataset.vyber; kresli(); box.querySelector(".zk-jmeno input")?.focus(); });
    box.querySelectorAll("form[data-jm]").forEach((f) => f.onsubmit = (ev) => {
      ev.preventDefault();
      const name = f.querySelector("input").value.trim(); if (!name) return;
      call("pet_buy", { kind: f.dataset.jm, name }).then(() => { Zvuk.sfx("mince"); toast(L([`${name} je tvůj!`, `${name} is yours!`])); go("pet"); }).catch(() => {});
    });
    const pv = $("#povoz");
    if (pv) pv.onclick = () => call("cart_buy").then(() => { Zvuk.sfx("mince"); toast(L(["Povoz je tvůj.", "The cart is yours."])); r.cart = true; kresli(); }).catch(() => {});
  };
  kresli();
};

// r27-5: nalévárna — napít se u stolu, nebo pozvat jiného hráče na žejdlík (platí ten, kdo zve)
VIEWS.napoje = async (view) => {
  view.replaceChildren(h(`${sceneHead("mesto-hostinec", L(["Nalévárna", "The taproom"]), L(["Hostinský: „Co to bude? A pro koho?“", "Innkeeper: \"What'll it be? And for whom?\""]), true)}
    <div id="napoje" class="napoje"><div class="panel empty">…</div></div>
    <p><button class="btn" data-go="misto/hostinec">← ${esc(t("back"))}</button></p>`));
  mountLive(view);
  view.querySelector("[data-go]").onclick = () => go("misto/hostinec");
  let r; try { r = await call("napoje"); } catch { return; }
  const box = $("#napoje"); if (!box) return;
  const O = r.opilost || { value: 0 };
  let host = "";
  const kresli = () => {
    box.innerHTML = `<div class="panel truhla-stav"><div class="ts-info"><b>${esc(L(["Tvoje opilost", "Your drunkenness"]))}: ${O.value} %</b>
        <span>${esc(O.stage ? O.stage + " · " + L(["Výřečnost ", "Speech "]) + sg(O.speech) + (O.other ? L([" · útok a zkoušky ", " · attack & checks "]) + sg(O.other) : "") : L(["střízlivý", "sober"]))}</span>
        ${O.nasoska ? `<span class="tag nasoska">${esc(L(["Násoska", "Drunkard"]))}</span>` : `<span class="dim">${esc(L([`dny s opicí: ${O.dny}/${O.need} za dva týdny`, `drunk days: ${O.dny}/${O.need}`]))}</span>`}</div>
        <div class="opil-bar"><i style="width:${O.value}%"></i><s style="left:30%"></s><s style="left:55%"></s><s style="left:80%"></s></div></div>
      <div class="grid g2 truhla-sloupce" style="align-items:start">
        <div class="panel"><h3>${esc(L(["Co nalít", "What to pour"]))}</h3>
          <div class="items">${r.napoje.map((n) => `<div class="item">${icon(n.id)}
            <div><div class="nm">${esc(n.name)}</div><div class="meta">${esc(L(["síla ", "strength "]) + "+" + n.sila + " % · " + L(["napojí ", "quench "]) + n.napoji)}</div></div>
            <div class="acts"><span class="price">${esc(t("coins", n.price))}</span>
              <button class="btn small primary" data-pij="${esc(n.id)}"${n.price > r.coins ? " disabled" : ""}>${esc(host ? L(["Pozvat", "Treat"]) : L(["Vypít", "Drink"]))}</button></div></div>`).join("")}</div></div>
        <div class="panel"><h3>${esc(L(["Pozvat na žejdlík", "Treat a player"]))}</h3>
          <p class="muted small">${esc(L(["Vyber hosta a pak nápoj vlevo. Platíš ty, pije on — a v hospodských řečech se to ozve.", "Pick a guest, then a drink. You pay, they drink."]))}</p>
          <div class="hoste"><button class="chip${host ? "" : " on"}" data-host="">${esc(L(["Nikoho — piju sám", "Nobody — for me"]))}</button>
          ${r.hoste.map((x) => `<button class="chip${host === x.id ? " on" : ""}" data-host="${esc(x.id)}">${x.online ? "● " : ""}${esc(x.name)} <small>${x.level}</small></button>`).join("")}</div>
          ${r.pozvani.length ? `<div class="sect">${esc(L(["Naposledy tě pozvali", "Recently treated by"]))}</div><ul class="pozvani">${r.pozvani.map((p) => `<li><b>${esc(p.od)}</b> — ${esc(p.napoj)}</li>`).join("")}</ul>` : ""}
        </div></div>`;
    loadIcons(r.napoje.map((n) => n.id));
    box.querySelectorAll("[data-host]").forEach((b) => b.onclick = () => { host = b.dataset.host; kresli(); });
    box.querySelectorAll("[data-pij]").forEach((b) => b.onclick = () => {
      b.disabled = true;
      call("napit", { drink: b.dataset.pij, target: host || null }).then((x) => {
        Zvuk.sfx("mince");
        toast(x.treat ? L([`${x.guest} si připíjí ${x.drink.toLowerCase()} na tvůj účet.`, `${x.guest} drinks on you.`]) : L([`Na zdraví! Opilost ${x.level} %`, `Cheers! Drunkenness ${x.level} %`]) + (x.stage && !x.treat ? " · " + x.stage : ""));
        Object.assign(O, x.opilost); r.coins -= x.price; kresli();
      }).catch(() => { b.disabled = false; });
    });
  };
  kresli();
};

// r27-4: kolbiště — veřejné souboje: diváci vidí oba bojovníky, kurz a sázky, během boje živě zdraví a průběh
const SOUB = { timer: null, open: null, hp: {} };
VIEWS.souboje = async (view) => {
  view.replaceChildren(h(`${sceneHead("mesto-kolbiste", L(["Probíhající souboje", "Duels in progress"]), L(["Mistr kolbiště: „Sázky přijímám, dokud nezazní roh.“", "Arena master: \"Bets until the horn sounds.\""]), true)}
    <div id="soub" class="souboje"><div class="empty">…</div></div>
    <p><button class="btn" data-go="misto/kolbiste">← ${esc(t("back"))}</button></p>`));
  mountLive(view);
  view.querySelector("[data-go]").onclick = () => go("misto/kolbiste");
  const kresli = async (data) => {
    if (S.tab !== "souboje") { clearInterval(SOUB.timer); return; }
    let r = data; if (!r) { try { r = await call("souboje", {}, true); } catch { return; } }
    const box = $("#soub"); if (!box) return;
    if (!r.souboje.length) { box.innerHTML = `<div class="panel empty">${esc(L(["Teď se na kolbišti nebojuje. Vyzvi někoho na souboj — přijatý souboj se vyhlásí a dvě minuty se na něj sází.", "No duels right now."]))}</div>`; return; }
    box.innerHTML = r.souboje.map((d) => {
      const zbyva = Math.max(0, d.until - Math.floor(Date.now() / 1000));
      const stav = d.done ? L(["Dobojováno", "Finished"]) : d.betting ? L(["Sázky otevřené · boj za ", "Bets open · fight in "]) + Math.floor(zbyva / 60) + ":" + String(zbyva % 60).padStart(2, "0") : L(["Boj probíhá", "Fighting"]);
      const bojovnik = (side) => {
        const f = d[side], key = d.id + side, rana = SOUB.hp[key] != null && f.hp < SOUB.hp[key] ? SOUB.hp[key] - f.hp : 0;
        SOUB.hp[key] = f.hp;
        if (rana) Zvuk.sfx("mec");
        return `<div class="sb-bojovnik ${side}${d.turn === side && !d.done && !d.betting ? " natahu" : ""}${d.winner === side ? " vitez" : ""}${rana ? " zasazen" : ""}">
          <div class="sb-fig">${Postava.html(f, IMG_BASE)}</div>${rana ? `<b class="body-tag rana">−${rana}</b>` : ""}
          <div class="sb-hud"><b>${esc(f.name)}</b><small>${esc(L(["úr. ", "lv. "]) + f.level + " · " + f.origin + " · " + noEmoji(f.rank))}</small>
            ${d.betting ? "" : `<span class="vval">${esc(L(["Zdraví ", "Health "]) + f.hp + "/" + f.max)}</span>${bar(f.hp, f.max, "hp big")}`}
            <div class="sb-kurz"><span>${esc(L(["kurz", "odds"]))}</span><b>${(d.odds[side] || 0).toFixed(2)}×</b><small>${esc(L(["vsazeno ", "staked "]) + d.totals[side] + " gr.")}</small></div>
            ${d.betting && !d.fighting ? `<div class="sb-sazky">${r.amounts.map((a) => `<button class="btn small" data-vsad="${d.id}:${side}:${a}"${a > r.coins || (d.my_bet && d.my_bet.side !== side) ? " disabled" : ""}>${a} gr.</button>`).join("")}</div>` : ""}
          </div></div>`;
      };
      return `<article class="panel sb-souboj${d.done ? " konec" : ""}">
        <header class="spread"><b>${esc(d.owner.name)} <span class="muted">vs</span> ${esc(d.target.name)}</b><span class="pill${d.betting ? " gold" : ""}">${esc(stav)}</span></header>
        <div class="sb-plocha"><div class="pozadi" style="background-image:url('${IMG_BASE}mesto-kolbiste-m.webp')"></div>${bojovnik("owner")}${bojovnik("target")}</div>
        <p class="sb-info">${esc((d.stake ? L(["Hrají o ", "Stake "]) + d.stake + " gr. · " : L(["Bojují o čest · ", "For honour · "])) + d.bettors + L([" sázkařů", " bettors"]))}
          ${d.my_bet ? " · <b>" + esc(L(["tvá sázka: ", "your bet: "]) + d.my_bet.amount + " gr. " + L(["na ", "on "]) + d[d.my_bet.side].name) + "</b>" : ""}</p>
        ${d.log || d.result ? `<div class="sb-log">${dmd(d.result || d.log)}</div>` : ""}
        ${chatHtml("souboj:" + d.id, d.chat)}
        ${d.betting && d.fighting ? `<p class="muted small">${esc(L(["Bojuješ v tomhle souboji — vsadit můžeš jen sám na sebe (na Discordu).", "You are fighting in this duel."]))}</p>` : ""}
      </article>`;
    }).join("") + `<p class="muted small">${esc(L(["Kurz se mění podle sázek — čím víc lidí sází na jednoho, tím méně se na něm vydělá. Na jeden souboj nejvýš ", "Odds follow the bets. Max per duel: "]) + r.max + " gr.")}</p>`;
    wireChat(box, () => kresli());
    box.querySelectorAll("[data-vsad]").forEach((b) => b.onclick = async () => {
      const [gid, side, amount] = b.dataset.vsad.split(":");
      b.disabled = true;
      try { const x = await call("vsadit", { gid, side, amount: Number(amount) }); Zvuk.sfx("mince"); toast(L(["Vsazeno ", "Bet "]) + amount + " gr. · " + L(["kurz ", "odds "]) + x.kurz.toFixed(2) + "×"); kresli(x); }
      catch { b.disabled = false; }
    });
  };
  clearInterval(SOUB.timer); SOUB.timer = setInterval(() => kresli(), 3000);
  kresli();
};

// r27-4: záložka Mazlíček — náhled zvířete, jeho stupeň, bonus a schopnost; ostatní zvířata pod tím
VIEWS.pet = (view) => {
  const Z = S.me.zvirata || [], A = Z.find((z) => z.active) || Z[0];
  const obr = (z) => IMG("bytosti/zvire-" + (ZVIRE_SLUG[z.kind] || Postava.slug(z.kind)) + "-" + z.stage);
  const PRAH = [7, 21];
  if (!A) {
    view.replaceChildren(h(`<div class="panel pet-zadny"><h2>${esc(L(["Zatím nemáš žádné zvíře", "No companion yet"]))}</h2>
      <p>${esc(L(["Mládě koupíš ve Zvěřinci. Roste každým herním dnem a každou výpravou, na kterou ho vezmeš — a s ním i jeho bonus.", "Buy a young animal at the menagerie."]))}</p>
      <button class="btn primary" data-go="misto/zverinec">${esc(L(["Do zvěřince", "To the menagerie"]))}</button></div>`));
    view.querySelector("[data-go]").onclick = () => go("misto/zverinec");
    return;
  }
  const rust = A.stage < 2 ? { a: A.growth - [0, 7][A.stage], b: PRAH[A.stage] - [0, 7][A.stage], co: L(["růst do dalšího stupně", "growth"]) }
    : A.stage === 2 ? { a: A.adult_runs, b: 20, co: L(["výpravy do stupně zkušený", "runs to veteran"]) } : null;
  const stupne = ["mládě", "dospívající", "dospělý", "zkušený"];
  view.replaceChildren(h(`
    <div class="grid pet-grid">
      <div class="pet-fig live" data-img="mesto-zverinec"><div class="pet-zvire${A.hungry ? " hlad" : ""}">${obr(A)}</div></div>
      <div class="grid">
        <div class="panel">
          <div class="spread"><h2>${esc(A.name)}</h2><span class="pill gold">${esc(A.stage_name)}</span></div>
          <p class="muted">${esc(A.kind)}${A.active ? " · " + L(["chodí s tebou na výpravy", "joins your expeditions"]) : ""}</p>
          ${A.hungry ? `<p class="upozorneni ne">${esc(L(["Hladoví — nezaplacené krmení. Nepomáhá a neroste (Rychtář → Výdaje).", "Hungry — unpaid feed."]))}</p>` : ""}
          <div class="stupne">${stupne.map((w, i) => `<span class="${i <= A.stage ? "on" : ""}${i === A.stage ? " ted" : ""}">${esc(w)}</span>`).join("")}</div>
          ${rust ? `<div class="bar"><div class="spread"><span>${esc(rust.co)}</span><span class="muted">${esc(Math.max(0, rust.a))} / ${esc(rust.b)}</span></div>
            <div class="track"><div class="fill xp" style="width:${Math.min(100, 100 * Math.max(0, rust.a) / rust.b)}%"></div></div></div>` : ""}
          <p class="muted small">${esc(A.progress)}</p>
        </div>
        <div class="panel pet-potreby"><h3>${esc(L(["Jak se má", "How it's doing"]))}</h3>
          ${[[L(["Sytost", "Fed"]), A.sytost, "food"], [L(["Spokojenost", "Content"]), A.spokojenost, "mood"]].map(([n, v, c]) => `<div class="bar"><div class="spread"><span>${esc(n)}</span><span class="muted">${v} / 100</span></div>
            <div class="track"><div class="fill ${c}${v < 20 ? " nizko" : ""}" style="width:${v}%"></div></div></div>`).join("")}
          ${A.napul ? `<p class="upozorneni ne">${esc(L(["Hladové nebo smutné zvíře pomáhá jen napůl.", "A hungry or sad animal helps only half as much."]))}</p>` : ""}
          <div class="row pet-akce"><button class="btn primary" data-krmit="">${esc(L(["Nakrmit (3 gr.)", "Feed (3 gr.)"]))}</button>
            ${(A.foods || []).map(([f, n]) => `<button class="btn" data-krmit="${esc(f)}">${esc(L(["Dát: ", "Give: "]) + f)} <small>×${n}</small></button>`).join("")}
            <button class="btn" data-mazlit>${esc(L(["Pomazlit se", "Cuddle"]))}</button></div>
          <p class="muted small">${esc(L(["Sytost opadá asi o 24 za den, spokojenost o 12 (hladovému rychleji). Výprava zvíře potěší, ale vyhladoví.", "Fed drops ~24 a day, content ~12. Outings please it but make it hungry."]))}</p>
        </div>
        <div class="panel"><h3>${esc(L(["Schopnost", "Ability"]))}</h3>
          <p class="pet-bonus">${esc(A.bonus)}</p>
          <p>${esc(A.desc)}</p>
          ${A.stage < 3 ? `<p class="muted small">${esc(L(["Jako zkušený: ", "As veteran: "]) + A.full_bonus)}</p>` : ""}
        </div>
        <div class="panel"><h3>${esc(L(["Staty", "Stats"]))}</h3>
          <div class="bojstaty">
            <div><small>${esc(L(["Stupeň", "Stage"]))}</small><b>${esc(A.stage + 1)}/4</b></div>
            <div><small>${esc(L(["Body růstu", "Growth"]))}</small><b>${esc(A.growth)}</b></div>
            <div><small>${esc(L(["Výpravy", "Runs"]))}</small><b>${esc(A.runs)}</b></div>
            <div><small>${esc(L(["Jako dospělý", "As adult"]))}</small><b>${esc(A.adult_runs)}</b></div>
          </div>
          <p class="muted small">${esc(L(["Roste o bod za každý herní den, kdy nehladoví, a za každou výpravu, na kterou ho vezmeš. Mládě dává asi polovinu bonusu, dospívající 70 %, dospělý celý, zkušený ještě víc.", "Grows each day and each expedition."]))}</p>
        </div>
      </div>
    </div>
    ${Z.length > 1 ? `<div class="panel" style="margin-top:18px"><h3>${esc(L(["Tvá další zvířata", "Your other animals"]))}</h3>
      <div class="zvirata">${Z.filter((z) => z !== A).map((z) => `<button type="button" class="zvire" data-vzit="${esc(z.kind)}">${obr(z)}<b>${esc(z.name)}</b>
        <small>${esc(z.kind + " · " + z.stage_name + " · " + z.bonus)}</small><small class="vzit">${esc(L(["Vzít s sebou", "Take along"]))}</small></button>`).join("")}</div></div>` : ""}`));
  mountLive(view, { still: true });
  const zv = (data, msg) => call("zvire", { kind: A.kind, ...data }).then(() => { Zvuk.sfx("klik"); toast(msg); render(); }).catch(() => {});
  view.querySelectorAll("[data-krmit]").forEach((b) => b.onclick = () => { b.disabled = true; zv({ act: "krmit", food: b.dataset.krmit || null }, L([`${A.name} se pustil(a) do jídla.`, `${A.name} eats.`])); });
  const mz = view.querySelector("[data-mazlit]");
  if (mz) mz.onclick = () => { mz.disabled = true; zv({ act: "pomazlit" }, L([`${A.name} spokojeně vrní.`, `${A.name} is pleased.`])); };
  view.querySelectorAll("[data-vzit]").forEach((b) => b.onclick = async () => {
    b.disabled = true;
    try { await call("raid_click", { id: "ks:pet:set", values: [b.dataset.vzit] }); await call("me"); toast(L(["Vzal sis ", "Now with you: "]) + b.dataset.vzit); render(); }
    catch { b.disabled = false; }
  });
};

// r27-4: záložka Deník — výpravy, zápisky, písemnosti, odznaky
const DENIK = { sekce: "vypravy", data: null, otevrena: null };
VIEWS.denik = async (view) => {
  const SEK = [["vypravy", ["Výpravy", "Expeditions"]], ["mapy", ["Mapy", "Maps"]], ["zapisky", ["Zápisky", "Notes"]], ["pisemnosti", ["Písemnosti", "Writings"]], ["odznaky", ["Odznaky", "Badges"]]];
  const RIM = ["I", "II", "III", "IV", "V"];
  view.replaceChildren(h(`<div class="denik-kniha">
    <header class="dk-hlava"><span class="pecet" aria-hidden="true">KS</span><div><small>${esc(L(["Královské stezky · Kutnohorsko · Léta Páně 1403", "Royal Trails · Anno Domini 1403"]))}</small>
      <h2>${esc(L(["Deník — ", "Journal — "]) + S.me.name)}</h2></div></header>
    <div class="dk-telo"><div class="dk-strana" id="denik-obsah"><div class="empty">…</div></div>
      <nav class="dk-zalozky">${SEK.map(([k, n], i) => `<button class="${DENIK.sekce === k ? "on" : ""}" data-sek="${k}"><i>${RIM[i]}</i>${esc(L(n))}</button>`).join("")}</nav></div></div>`));
  view.querySelectorAll("[data-sek]").forEach((b) => b.onclick = () => { DENIK.sekce = b.dataset.sek; render(); });
  try { DENIK.data = (await call("denik", {}, true)).denik; } catch { return; }
  const D = DENIK.data, box = $("#denik-obsah"); if (!box) return;
  const datum = (ts) => new Date(ts * 1000).toLocaleString(({ en: "en-GB", pl: "pl-PL", sk: "sk-SK" }[S.lang] || "cs-CZ"), { day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit" });
  if (DENIK.sekce === "vypravy") {
    const p = D.pocty;
    box.innerHTML = `<p class="kapitola">${esc(L(["Kapitola I", "Chapter I"]))}</p><h3 class="dk-nadpis">${esc(L(["Záznamy z výprav", "Expedition records"]))}</h3>
      <div class="bojstaty"><div><small>${esc(L(["Výpravy", "Runs"]))}</small><b>${p.vypravy}</b></div><div><small>${esc(L(["Úspěšné", "Won"]))}</small><b>${p.vitezne}</b></div>
        <div><small>${esc(L(["Poražení", "Slain"]))}</small><b>${p.zabito}</b></div><div><small>${esc(L(["Bossové", "Bosses"]))}</small><b>${p.bossove}</b></div></div>
      ${D.vypravy.length ? D.vypravy.map((v) => `<details class="zaznam-vypravy${v.uspech ? "" : " pad"}"><summary>
          <span class="kdy">${esc(datum(v.t))}</span><b>${esc(v.kde)}</b><span class="muted">${esc(v.obtiznost)}</span>
          <span class="vysl">${esc(v.uspech ? (v.odchod ? L(["odešel včas", "left early"]) : L(["návrat", "returned"])) : L(["padl", "fell"]))}</span>
          <span class="zisk">${esc((v.grose ? "+" + v.grose + " gr. · " : "") + "+" + v.zk + " ZK")}</span></summary>
        <div class="telo">
          ${v.druzina.length ? `<p><b>${esc(L(["Družina: ", "Party: "]))}</b>${esc(v.druzina.join(", "))}</p>` : `<p class="muted">${esc(L(["Šel sám.", "Went alone."]))}</p>`}
          ${v.porazeni.length ? `<p><b>${esc(L(["Poraženi: ", "Slain: "]))}</b>${esc(v.porazeni.join(", "))}${v.boss ? " · " + esc(L(["pán místa padl", "boss slain"])) : ""}</p>` : ""}
          ${v.korist.length ? `<p><b>${esc(L(["Kořist: ", "Loot: "]))}</b>${esc(v.korist.join(", "))}</p>` : ""}
          ${v.ztraty.length ? `<p class="ztraty"><b>${esc(L(["Ztráty: ", "Lost: "]))}</b>${esc(v.ztraty.join(", "))}</p>` : ""}
          ${v.hloubka ? `<p class="muted small">${esc(L(["Prošlých míst: ", "Places visited: "]) + v.hloubka)}</p>` : ""}
        </div></details>`).join("")
      : `<div class="empty">${esc(L(["Zatím žádný záznam. Každá další výprava se sem zapíše.", "No records yet."]))}</div>`}`;
  } else if (DENIK.sekce === "mapy") {
    const M = D.mapy || [];
    box.innerHTML = `<p class="kapitola">${esc(L(["Kapitola II", "Chapter II"]))}</p><h3 class="dk-nadpis">${esc(L(["Mapy", "Maps"]))}</h3>
      <p class="muted small">${esc(L(["Mapy oblastí koupíš u písaře. Tři útržky mapy k pokladu se zcelí v mapu pokladu — po vykopání pokladu zmizí.", "Buy area maps from the scribe; three fragments make a treasure map."]))}
        ${esc(L([" Útržky u sebe: ", " Fragments: "]) + D.utrzky + " / " + D.utrzku_treba)}</p>
      ${M.length ? `<div class="mapy">${M.map((m) => `<button class="mapa-karta${m.kind === "poklad" ? " poklad" : ""}" data-mapa="${esc(m.key)}" data-poklad="${m.kind === "poklad" ? 1 : ""}">
          <b>${esc(m.kind === "poklad" ? L(["Mapa pokladu · ", "Treasure map · "]) + m.name : m.name)}</b>
          <small>${esc(m.kind === "poklad" ? L(["poklad leží u: ", "buried at: "]) + m.spot + L([" · vezmi lopatu", " · bring a shovel"]) : L(["mapa oblasti", "area map"]))}</small></button>`).join("")}</div>
        <div id="mapa-obr" class="mapa-obr"></div>`
      : `<div class="empty">${esc(L(["Zatím nemáš žádnou mapu.", "No maps yet."]))}</div>`}`;
    const ukaz = async (b) => {
      box.querySelectorAll(".mapa-karta").forEach((x) => x.classList.toggle("on", x === b));
      const o = $("#mapa-obr"); o.innerHTML = `<div class="empty">${esc(L(["Rozkládám mapu…", "Unfolding the map…"]))}</div>`;
      try { const r = await call("mapa_obr", { key: b.dataset.mapa, poklad: !!b.dataset.poklad }, true); o.innerHTML = `<img alt="" src="data:image/png;base64,${r.image}">`; }
      catch (e) { o.innerHTML = `<div class="empty">${esc(e.message || "")}</div>`; }
    };
    box.querySelectorAll(".mapa-karta").forEach((b) => b.onclick = () => ukaz(b));
    const prvni = box.querySelector(".mapa-karta"); if (prvni) ukaz(prvni);
  } else if (DENIK.sekce === "zapisky") {
    box.innerHTML = `<p class="kapitola">${esc(L(["Kapitola III", "Chapter III"]))}</p><h3 class="dk-nadpis">${esc(L(["Osobní zápisky", "Personal notes"]))}</h3>
      <p class="muted small">${esc(L(["Co si chceš pamatovat — kdo ti dluží, kde jsi viděl poklad, co koupit. Vidíš je jen ty.", "Only you can see these."]))}</p>
      <textarea id="zapisky" class="zapisky" maxlength="8000" placeholder="${esc(L(["Léta Páně 1403…", "Anno Domini 1403…"]))}">${esc(D.zapisky || "")}</textarea>
      <div class="row"><button class="btn primary" id="zap-ulozit">${esc(L(["Uložit zápisky", "Save notes"]))}</button><span class="muted small" id="zap-stav"></span></div>`;
    const ta = $("#zapisky"), st = $("#zap-stav");
    const uloz = async () => { try { await call("zapisky", { text: ta.value }, true); st.textContent = L(["Uloženo.", "Saved."]); } catch {} };
    $("#zap-ulozit").onclick = uloz;
    let tm; ta.oninput = () => { st.textContent = L(["Neuloženo…", "Unsaved…"]); clearTimeout(tm); tm = setTimeout(uloz, 2500); };
  } else if (DENIK.sekce === "pisemnosti") {
    box.innerHTML = `<p class="kapitola">${esc(L(["Kapitola IV", "Chapter IV"]))}</p><h3 class="dk-nadpis">${esc(L(["Knihy a písemnosti", "Books and writings"]))}</h3>
      ${D.pisemnosti.length ? D.pisemnosti.map((w) => `<details class="pisemnost"${DENIK.otevrena === w.name ? " open" : ""} data-n="${esc(w.name)}"><summary>${icon(w.name)}
          <span><b>${esc(w.name)}</b><small>${esc(w.kind + (w.have ? "" : L([" · už ji u sebe nemáš", " · no longer carried"])))}</small></span></summary>
        <div class="pergamen">${dmd(w.text)}</div></details>`).join("")
      : `<div class="empty">${esc(L(["Zatím žádná kniha ani list. Najdeš je na výpravách, u písaře a vetešníka — sem se zapíšou samy.", "No writings yet."]))}</div>`}`;
    box.querySelectorAll("details").forEach((d) => d.addEventListener("toggle", () => { if (d.open) DENIK.otevrena = d.dataset.n; }));
    loadIcons(D.pisemnosti.map((w) => w.name));
  } else {
    const mam = D.odznaky.filter((o) => o.got).length;
    box.innerHTML = `<p class="kapitola">${esc(L(["Kapitola V", "Chapter V"]))}</p><div class="spread"><h3 class="dk-nadpis">${esc(L(["Odznaky a ocenění", "Badges and honours"]))}</h3><span class="pill gold">${mam} / ${D.odznaky.length}</span></div>
      <div class="odznaky">${D.odznaky.map((o) => `<div class="odznak${o.got ? " ma" : ""}"><span class="o-ikona">${esc(o.got ? o.name.charAt(0) : "?")}</span>
        <b>${esc(o.name)}</b><small>${esc(o.desc)}</small></div>`).join("")}</div>`;
  }
};

// --- město: mapa, místa, obchody
const L = (pair) => {   // r27-4: [cs, en] — pro SK a PL přeloží časté věty z FR (jazyky.js), jinak SK → cs, PL → en
  if ((S.lang === "pl" || S.lang === "sk") && typeof FR !== "undefined") {
    const x = FR[S.lang][pair[0]];
    if (x !== undefined) return x;
    return S.lang === "sk" && typeof obsahJazyk === "function" ? obsahJazyk(pair[0]) : pair[S.lang === "pl" ? 1 : 0];
  }
  return pair[S.lang === "en" ? 1 : 0];
};
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
  { id: "hrbitov", x: 92.5, y: 47.5, n: ["Hřbitov", "Graveyard"] },                    // r27-4: hřbitov u kostela
  { id: "apatyka", x: 56.4, y: 61.5, n: ["Apatyka", "Apothecary"] },                 // r27-4: podniky — zamčené do koupě
  { id: "dilna", x: 8.0, y: 54.5, n: ["Střelmistrova dílna", "Bowyer's workshop"] },
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
    opts: [   // r27-4: rozložení podle Pavla
      { sect: ["Hry a sázky", "Games and betting"] },
      { go: "misto/hostinec-hry", ic: "🎲", n: ["Hry s hostinským", "Games with the innkeeper"], d: ["Kostky, oko bere, šipky", "Dice, twenty-one, darts"] },
      { cid: "ks:pvp:menu", ic: "🤝", n: ["Hry s hráči", "Games with players"], d: ["Lhář, mlýn, kostky, karty, souboj", "Liar's dice, mill, dice, cards, duel"] },
      { go: "kohouti", ic: "🐓", n: ["Sázky", "Betting"], d: ["Kohoutí zápas v jámě za hostincem", "Cockfight in the pit behind the inn"] },
      { sect: ["Práce a služby", "Work and services"] },
      { panel: "board", ic: "📋", n: ["Nástěnka", "Notice board"], d: ["Zakázky a výzvy", "Jobs and challenges"] },
      { panel: "lodging", ic: "🛏️", n: ["Nocleh", "Lodging"], d: ["Vyspat se do sytosti", "Sleep until rested"] },
      { go: "obchod/Hostinský", ic: "🍺", n: ["Občerstvení a zásoby", "Food and supplies"], d: ["Jídlo, pití, suroviny", "Food, drink and goods"] },
      { go: "napoje", ic: "🍻", n: ["Nalít si", "Have a drink"], d: ["Pivo, víno, medovina, pálenka · pozvat hráče na žejdlík", "Beer, wine, mead · treat a player"] },
      { go: "truhla", ic: "🗝️", n: ["Truhla v hostinci", "Chest at the inn"], d: ["Úschova pro ty bez domu", "Storage for the homeless"] },
      { panel: "learn", ic: "🍳", n: ["Lekce u hostinského", "Lessons with the innkeeper"], d: ["Vaření a rybaření", "Cooking and fishing"] },
      { panel: "burgle", ic: "🌙", n: ["Vloupání do truhel", "Break into chests"], d: ["Teď v noci, šperhákem", "Now at night, with a lockpick"], when: (m) => m.night },
    ] },
  "hostinec-hry": { img: "mesto-hostinec", n: ["Hry s hostinským", "Games with the innkeeper"],
    say: ["Hostinský: „O groš, nebo o dva? Kostky jsou poctivé, přísahám.“", "Innkeeper: \"A groschen or two? The dice are honest, I swear.\""],
    opts: [
      { go: "hra/dice", ic: "🎲", n: ["Kostky", "Dice"], d: ["Hra s hostinským o groše", "Play the innkeeper for coins"] },
      { go: "hra/cards", ic: "🃏", n: ["Oko bere", "Twenty-one"], d: ["Karetní hra s hostinským", "Card game with the innkeeper"] },
      { go: "hra/prsi", ic: "🂠", n: ["Prší", "Prší"], d: ["Karetní hra s hostinským", "Card game with the innkeeper"] },
      { go: "hra/darts", ic: "🎯", n: ["Šipky", "Darts"], d: ["Cvičný hod na terč", "Practice at the board"] },
      { go: "misto/hostinec", ic: "🍺", n: ["Zpět do lokálu", "Back to the taproom"], d: ["Hostinec U Zlatého groše", "The Golden Groschen Inn"] },
    ] },
  trziste: { img: "mesto-trziste", n: ["Tržiště", "Market square"], say: ["Kupci vyvolávají své zboží.", "Merchants call out their wares."],
    opts: [...["Kovář", "Střelmistr", "Zbrojíř", "Apatykář", "Krejčí", "Písař", "Vetešník", "Mlynář"].map((sh) => ({ go: "obchod/" + sh, shop: sh })),
      { panel: "carpenter", ic: "🪚", n: ["Truhlář", "Carpenter"], d: ["Nábytek do domu", "Furniture for your home"] },
      { go: "aukce", ic: "🔨", n: ["Aukce hráčů", "Player auctions"], d: ["Rozklikni dražbu a přihoď", "Open an auction and bid"] },
      { go: "misto/paserak", ic: "🌙", n: ["Pašerák", "Smuggler"], d: ["Jen v noci", "Night only"] }] },
  apatyka: { img: "domov/podnik-apatyka", n: ["Tvá apatyka", "Your apothecary"], say: ["Křivule, hmoždíře a bylinková zahrádka — tvoje dílna.", "Alembics, mortars and a herb garden — your workshop."],
    opts: [ { panel: "biz", ic: "🧪", n: ["Tvá apatyka", "Your apothecary"], d: ["Výroba a truhla podniku", "Crafting and the workshop chest"] } ] },
  dilna: { img: "domov/podnik-strelmistrova-dilna", n: ["Tvá střelmistrova dílna", "Your bowyer's workshop"], say: ["Ponk, napínací stolice a sudy s pery — tvoje dílna.", "Bench, bending stool and barrels of feathers."],
    opts: [ { panel: "biz", ic: "🏹", n: ["Tvá střelmistrova dílna", "Your bowyer's workshop"], d: ["Výroba a truhla podniku", "Crafting and the workshop chest"] } ] },
  // r27-4: Kovárna na mapě je podnik kováře — zamčená, dokud si ji nekoupí; kovář prodává na tržišti
  kovar: { img: "domov/podnik-kovarna", n: ["Tvá kovárna", "Your smithy"], say: ["Výheň, kovadlina a měchy — tvoje dílna.", "Forge, anvil and bellows — your workshop."],
    opts: [
      { panel: "biz", ic: "⚒️", n: ["Tvá kovárna", "Your smithy"], d: ["Výroba a truhla podniku", "Crafting and the workshop chest"], when: (m) => m.origin === "kovar" && m.business },
    ] },
  mlyn: { redirect: "obchod/Mlynář" },
  hrbitov: { redirect: "hrbitov" },                      // r27-3: mlynář vykupuje obilí a mele mouku
  radnice: { img: "mesto-radnice", n: ["Radnice", "Town hall"], say: ["Purkmistr: „Co vás přivádí před radu, poutníku?“", "Burgomaster: \"What brings you before the council, traveller?\""],
    opts: [   // r27-4: Nemovitosti / Rychtář / Přehledy; banka je ve Směnárně
      { sect: ["Nemovitosti", "Property"] },
      { cid: "ks:hall:shop", ic: "🏠", n: ["Koupit podnik", "Buy a business"], d: ["Vlastní dílna podle původu", "Your own workshop"] },
      { panel: "houses", ic: "🏡", n: ["Koupit dům", "Buy a house"], d: ["Chalupa nebo měšťanský dům", "Cottage or burgher house"] },
      { sect: ["Úřad", "Office"] },
      { go: "misto/radnice-rychtar", ic: "⚖️", n: ["Rychtář", "Reeve"], d: ["Pokuty, výdaje, právo a erb", "Fines, bills, citizenship and arms"] },
      { panel: "donate_town", ic: "🎁", n: ["Dar městu", "Gift to the town"], d: ["Pro dobrou pověst", "For your reputation"] },
      { sect: ["Přehledy", "Overviews"] },
      { go: "kroniky", ic: "📖", n: ["Kroniky", "Chronicles"], d: ["Události, slavní, žijící hrdinové, výsledky her", "Events, fame, heroes, results"] },
      { panel: "people", ic: "👥", n: ["Obyvatelé", "Townsfolk"], d: ["Kdo ve městě žije", "Who lives in town"] },
      { panel: "week", ic: "📜", n: ["Pořadí týdne", "Weekly ranking"], d: ["Nejlepší hrdinové", "Best heroes"] },
    ] },
  "radnice-rychtar": { img: "mesto-radnice", n: ["Rychtář", "Reeve"], say: ["Rychtář: „Pokuty se platí, daně taky. A kdo chce být měšťanem, ať se ukáže.“", "Reeve: \"Fines get paid, and so do taxes. Want to be a burgher? Show yourself.\""],
    opts: [
      { panel: "fine", ic: "⚖️", n: ["Pokuty a hledanost", "Fines and bounties"], d: ["Zaplatit pokutu, kdo je hledaný", "Pay fines, who is wanted"] },
      { panel: "bills", ic: "🧾", n: ["Výdaje a dluhy", "Bills and debts"], d: ["Co se strhává každý týden", "What is paid every week"] },
      { panel: "titles", ic: "🏛️", n: ["Měšťanské právo a erb", "Citizenship and arms"], d: ["Staň se měšťanem", "Become a burgher"] },
      { go: "misto/radnice", ic: "🏛️", n: ["Zpět do radnice", "Back to the town hall"], d: ["Purkmistr a rada", "Burgomaster and council"] },
    ] },
  chram: { img: "mesto-chram", n: ["Chrám svaté Barbory", "Church of St Barbara"], say: ["Kněz: „Pokoj s tebou. Modlit se můžeš jednou za den.“", "Priest: \"Peace be with you. You may pray once a day.\""],
    opts: [
      { go: "misto/chram-pozehnani", ic: "🙏", n: ["Požehnání", "Blessings"], d: ["Síla, ochrana, moudrost", "Strength, protection, wisdom"] },
      { act: "pray:uzdraveni", ic: "❤️", n: ["Uzdravení", "Healing"], d: ["+25 % životů hned", "+25% health now"] },
      { panel: "donate_church", ic: "🎁", n: ["Dar kostelu", "Gift to the church"], d: ["Pro dobrou pověst", "For your reputation"] },
    ] },
  "chram-pozehnani": { img: "mesto-chram", n: ["Požehnání", "Blessings"], say: ["Kněz: „Pomodli se, synu. O jedno požehnání denně smíš prosit.“", "Priest: \"Pray, my child. One blessing a day.\""],
    opts: [
      { act: "pray:sila", ic: "💪", n: ["Požehnání síly", "Blessing of strength"], d: ["+1 k útoku na výpravu", "+1 attack next expedition"] },
      { act: "pray:ochrana", ic: "🛡️", n: ["Požehnání ochrany", "Blessing of protection"], d: ["+1 k obraně na výpravu", "+1 defence next expedition"] },
      { act: "pray:moudrost", ic: "📖", n: ["Požehnání moudrosti", "Blessing of wisdom"], d: ["+1 ke zkouškám", "+1 to checks"] },
      { go: "misto/chram", ic: "⛪", n: ["Zpět do chrámu", "Back to the church"], d: ["Chrám svaté Barbory", "Church of St Barbara"] },
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
    ] },
  kolbiste: { img: "mesto-kolbiste", n: ["Kolbiště", "Arena"], say: ["Mistr kolbiště: „Kdo si troufne?“", "Arena master: \"Who dares?\""],
    opts: [
      { go: "souboje", ic: "👁️", n: ["Probíhající souboje", "Duels in progress"], d: ["Dívej se a vsaď si", "Watch and place bets"] },
      { cid: "ks:duel:menu", ic: "⚔️", n: ["Vyzvat na souboj", "Challenge to a duel"], d: ["Souboj 1 na 1 o hodnost", "One on one for rank"] },
      { cid: "ks:duel:ladder", ic: "🏆", n: ["Žebříček", "Ladder"], d: ["Hodnosti a pořadí", "Ranks and standings"] },
    ] },
  zverinec: { img: "mesto-zverinec", n: ["Zvěřinec", "Menagerie"], say: ["Zvěřinec: „Každé zvíře si najde svého pána.“", "Keeper: \"Every animal finds its master.\""],
    opts: [ { go: "zverinec", ic: "🐾", n: ["Mláďata na prodej", "Young animals for sale"], d: ["Prohlédni si zvířata a kup mládě", "See the animals, buy a young one"] },
      { go: "pet", ic: "🍖", n: ["Tvá zvířata", "Your animals"], d: ["Nakrmit, pomazlit, vzít s sebou", "Feed, cuddle, take along"] },
      { panel: "pets", ic: "🐴", n: ["Povoz a ostatní", "Cart and more"], d: ["Povoz s koněm, přejmenování", "Cart with a horse, renaming"] } ] },
  brana: { img: "mesto-brana", n: ["Městská brána", "Town gate"], say: ["Strážný: „Kam to bude, na stezky?“", "Guard: \"Off to the trails, then?\""],
    opts: [
      { go: "vyprava", ic: "🗺️", n: ["Vyrazit na výpravu", "Set out on an expedition"], d: ["Lesy, doly, ležení, hrad", "Woods, mines, camp, castle"] },
      { panel: "trails", ic: "🗡️", n: ["Na stezkách", "On the trails"], d: ["Jít po stopách cizí výpravy", "Follow another expedition"] },
      { sect: ["Za hradbami", "Outside the walls"] },          // r27-4: vidět jsou vždy, otevřít jdou až po koupi
      { go: "statek", ic: "🌾", n: ["Usedlost", "Farmstead"], d: ["Statek sedláka: pole, chlév, dvůr", "The peasant's farm: fields, barn, yard"],
        lock: (m) => !(m.origin === "sedlak" && m.business), why: (m) => m.origin === "sedlak" ? ["Usedlost si koupíš na radnici (Nemovitosti → Koupit podnik).", "Buy the farmstead at the town hall."] : ["Usedlost je podnik pro sedláky.", "The farmstead belongs to peasants."] },
      { go: "domov", ic: "🛖", n: ["Chalupa", "Cottage"], d: ["Roubená chalupa za hradbami", "Log cottage outside the walls"],
        lock: (m) => m.house !== "chalupa", why: () => ["Chalupu si koupíš na radnici (Nemovitosti → Koupit dům).", "Buy the cottage at the town hall."] },
      { panel: "biz", ic: "🗡️", n: ["Doupě", "The den"], d: ["Skrýš za hradbami", "Hideout outside the walls"],
        lock: (m) => !(m.origin === "lapka" && m.business), why: (m) => m.origin === "lapka" ? ["Doupě si koupíš na radnici (Nemovitosti → Koupit podnik).", "Buy the den at the town hall."] : ["Doupě patří lapkům.", "The den belongs to bandits."] },
      { cid: "ks:gate:steal", ic: "🕵️", n: ["Věci u brány", "Things at the gate"], d: ["Lapka se prohrabe zapomenutým", "A bandit rummages through left goods"], when: (m) => m.origin === "lapka" },
    ] },
  dum: { img: "mesto-dum", n: ["Měšťanský dům", "Burgher house"], say: ["Tvůj vlastní kout v Kutné Hoře.", "Your own corner of Kutná Hora."],
    opts: [
      { go: "domov", ic: "🏡", n: ["Domov", "Home"], d: ["Spánek, jídlo, truhla, vaření, nábytek", "Sleep, food, chest, cooking, furniture"], when: (m) => m.house === "dum" },
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

/** r27-4: vyhláška radnice a Kronika událostí (jako kanály na Discordu) nad mapou města. */
function zpravyHtml(m) {
  const ev = m && m.event, kr = (m && m.kronika) || [];
  if (!ev && !kr.length) return "";
  const cas = (ts) => new Date(ts * 1000).toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit" });
  return `<div class="zpravy">
    ${ev ? `<section class="vyhlaska"><div class="sect">${esc(L(["Vyhláška radnice", "Town proclamation"]))}</div>
      <h3>${esc(noEmoji(ev.title))}</h3><div class="dtext">${panelHtml(ev.text)}</div>
      <p class="pozn">${esc(L(["Platí do ", "Until "]))}${cas(ev.ends)}</p></section>` : ""}
    ${kr.length ? `<section class="kronika"><div class="sect">${esc(L(["Kronika událostí", "Chronicle of events"]))}</div>
      <ul>${kr.slice(0, 8).map((z) => `<li><span class="kdy">${cas(z.t)}</span><span>${dmdInline(noEmoji(z.text))}</span></li>`).join("")}</ul></section>` : ""}
  </div>`;
}
// r27-4: podniky na mapě (místo → původ, jméno); zamčené, dokud si je hráč toho původu nekoupí
const PODNIK_MISTA = { kovar: ["kovar", ["Kovárnu", "smithy", "Kovárna"]], apatyka: ["apatykar", ["Apatyku", "apothecary", "Apatyka"]], dilna: ["lovci", ["Střelmistrovu dílnu", "bowyer's workshop", "Střelmistrova dílna"]] };
const PODNIK_ZAMEK = Object.fromEntries(Object.entries(PODNIK_MISTA).map(([id, [o]]) => [id, () => !(S.me.origin === o && S.me.business)]));
VIEWS.mesto = (view) => {
  view.replaceChildren(h(`
    ${S.me.on_raid ? `<div class="panel notice" style="margin-bottom:16px">🗺️ ${esc(t("on_raid"))}</div>` : ""}
    <div class="mesto-plocha"><div class="mesto-mapa"><div class="townmap live" data-img="mesto-mapa"></div></div>
      <aside class="mesto-zpravy">${zpravyHtml(S.me) || `<div class="zpravy"><section class="kronika"><div class="sect">${esc(L(["Kronika událostí", "Chronicle of events"]))}</div><p class="muted">${esc(L(["Ve městě je zatím klid.", "All quiet in town."]))}</p></section></div>`}</aside></div>`));
  const sc = mountLive(view, { still: true, contain: true });
  view.querySelector(".townmap").style.setProperty("--maska", `url('${IMG_BASE}${innerWidth <= 760 ? "mesto-mapa-m" : "mesto-mapa"}.webp')`);
  // r27-4: dům a kovárna jsou zamčené, dokud si je hráč nekoupí na radnici
  const ZAMEK = { dum: () => S.me.house !== "dum", ...PODNIK_ZAMEK };
  const zamceno = (id) => !!(ZAMEK[id] && ZAMEK[id]());
  const ZAMEK_TXT = { dum: ["Zamčeno. Měšťanský dům si můžeš koupit na radnici.", "Locked. You can buy the burgher house at the town hall."],
    ...Object.fromEntries(Object.entries(PODNIK_MISTA).map(([id, [o, jm]]) => [id, S.me.origin === o
      ? ["Zamčeno. " + jm[0] + " si koupíš na radnici (Nemovitosti → Koupit podnik).", "Locked. Buy the " + jm[1] + " at the town hall."]
      : [jm[2] + " je podnik pro jiný původ postavy." + (id === "kovar" ? " Kováře a jeho zboží najdeš na tržišti." : ""), "This business belongs to another origin."]])) };
  sc.pic.insertAdjacentHTML("beforeend", SPOTS.map((p) => `<button class="spot${PLACES[p.id] ? "" : " later"}${zamceno(p.id) ? " zamceno" : ""}" data-spot="${p.id}" style="left:${p.x}%;top:${p.y}%"><span>${esc(L(p.n))}</span></button>`).join(""));
  view.querySelectorAll("[data-spot]").forEach((b) => b.onclick = () => {
    if (zamceno(b.dataset.spot)) { if (typeof Zvuk !== "undefined") Zvuk.sfx("klik"); toast(L(ZAMEK_TXT[b.dataset.spot])); return; }
    const p = PLACES[b.dataset.spot];
    if ((typeof Zvuk !== "undefined")) Zvuk.sfx("klik");
    if (!p) { toast(t("soon")); return; }
    go(p.redirect || "misto/" + b.dataset.spot);
  });
};

VIEWS.misto = (view) => {
  const p = PLACES[S.arg];
  if (!p || (S.arg === "dum" && S.me.house !== "dum") || (PODNIK_ZAMEK[S.arg] && PODNIK_ZAMEK[S.arg]())) { go("mesto"); return; }
  if (p.redirect) { go(p.redirect); return; }
  const card = (o) => {
    if (o.shop) {
      const u = SHOPS_UI[o.shop] || {};
      const nm = (S.shops || []).find((x) => x.id === o.shop)?.name || o.shop;
      return `<button class="opt" data-go="${esc(o.go)}"><span class="ic">${u.ic || "⚖️"}</span><b>${esc(nm)}</b></button>`;
    }
    if (o.lock && o.lock(S.me)) return `<button class="opt zamceno" data-zamek="${esc(L(o.why(S.me)))}"><span class="ic">${o.ic}</span><b>${esc(L(o.n))}</b><small>${esc(L(["Zamčeno — ", "Locked — "]) + L(o.d))}</small></button>`;
    const target = o.soon ? "data-soon" : o.act ? `data-act="${esc(o.act)}"` : o.panel ? `data-panel="${esc(o.panel)}"` : o.cid ? `data-pcid="${esc(o.cid)}"` : `data-go="${esc(o.go)}"`;
    return `<button class="opt${o.soon ? " later" : ""}" ${target}><span class="ic">${o.ic}</span><b>${esc(L(o.n))}</b><small>${esc(o.soon ? t("soon_short") : L(o.d))}</small></button>`;
  };
  const opts = p.opts.filter((o) => !o.when || o.when(S.me));
  let mriz = "", skup = [];                                   // r27-4: volby po oddílech (sect)
  const vylij = () => { if (skup.length) mriz += `<div class="opts">${skup.map(card).join("")}</div>`; skup = []; };
  opts.forEach((o) => { if (o.sect) { vylij(); mriz += `<div class="sect">${esc(L(o.sect))}</div>`; } else skup.push(o); });
  vylij();
  view.replaceChildren(h(`${sceneHead(p.img, L(p.n), L(p.say))}
    ${S.me.on_raid ? `<div class="panel notice" style="margin:14px 0">🗺️ ${esc(t("on_raid"))}</div>` : ""}
    ${mriz}
    ${S.arg === "hostinec" ? `<div id="hospoda-reci" class="hospoda-reci"></div>` : ""}
    <p><button class="btn" data-go="mesto">← ${esc(t("back_map"))}</button></p>`));
  if (S.arg === "hostinec") { clearInterval(HOSPODA.timer); hospodaKresli(); HOSPODA.timer = setInterval(hospodaKresli, 4000); }
  mountLive(view);
  view.querySelectorAll("[data-go]").forEach((b) => b.onclick = () => go(b.dataset.go));
  view.querySelectorAll("[data-soon]").forEach((b) => b.onclick = () => toast(t("soon")));
  view.querySelectorAll("[data-zamek]").forEach((b) => b.onclick = () => { Zvuk.sfx("klik"); toast(b.dataset.zamek); });
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
  bank: "mesto-banka", bills: "mesto-radnice", board: "mesto-hostinec", lodging: "mesto-pokoj", innchest: "mesto-hostinec", burgle: "mesto-hostinec",
  learn: "mesto-hostinec", smuggler: "mesto-paserak", carpenter: "mesto-trziste", titles: "mesto-radnice", fine: "mesto-radnice",
  week: "mesto-radnice", people: "mesto-radnice", donate_town: "mesto-radnice", houses: "mesto-radnice" };
const PANEL_BACK = { inn: "misto/hostinec", lodging: "misto/hostinec", board: "misto/hostinec", innchest: "misto/hostinec", learn: "misto/hostinec",
  burgle: "misto/hostinec", market: "misto/trziste", carpenter: "misto/trziste", bank: "misto/banka", bills: "misto/radnice-rychtar", fine: "misto/radnice-rychtar", titles: "misto/radnice-rychtar", temple: "misto/chram",
  donate_church: "misto/chram", barber: "misto/lazne", pets: "misto/zverinec", menagerie: "misto/zverinec", arena: "misto/kolbiste",
  trails: "misto/brana", smuggler: "misto/paserak", home: "domov" };
const BIZ_IMG = { kovar: "domov/podnik-kovarna", lovci: "domov/podnik-strelmistrova-dilna", apatykar: "domov/podnik-apatyka",
  sedlak: "domov/podnik-usedlost", lapka: "domov/podnik-doupe" };
const BIZ_BACK = { kovar: "misto/kovar", lovci: "misto/dilna", apatykar: "misto/apatyka", sedlak: "misto/brana", lapka: "misto/brana" };
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
  if (typeof obsahJazyk === "function") text = obsahJazyk(text);
  const lines = noEmoji(String(text || "").replace(/<@!?\d+>/g, "").replace(/<#\d+>/g, "").replace(/<a?:\w+:\d+>/g, "").replace(/<t:(\d+)(:\w)?>/g,
    (m, ts) => new Date(Number(ts) * 1000).toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit" }))).split("\n");
  let out = "", list = false, zaz = false;   // r27-4: řádek začínající tučně = záznam (karta), poznámky pod ním patří k němu
  const zavri = () => { if (zaz) { out += "</div>"; zaz = false; } };
  const inl = (l) => esc(l).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/__(.+?)__/g, "$1").replace(/(^|\s)\*(\S.*?)\*/g, "$1<i>$2</i>").replace(/`([^`]+)`/g, "<code>$1</code>");
  for (let l of lines) {
    const bullet = /^\s*(?:[-•·]|\d+\.)\s+(.*)$/.exec(l);
    if (bullet && !l.startsWith("-# ")) { if (!list) { out += "<ul>"; list = true; } out += `<li>${inl(bullet[1])}</li>`; continue; }
    if (list) { out += "</ul>"; list = false; }
    if (!l.trim()) continue;
    const hd = /^#{1,3}\s+(.*)$/.exec(l);
    if (hd) { zavri(); out += `<h3>${inl(hd[1])}</h3>`; }
    else if (l.startsWith("-# ")) out += `<p class="pozn">${inl(l.slice(3))}</p>`;
    else if (/^\s*\*\*[^*]+\*\*:?\s*$/.test(l)) { zavri(); out += `<h4>${inl(l.replace(/:\s*$/, ""))}</h4>`; }   // r27-4: celý tučný řádek = podnadpis
    else if (!/^\s*\*\*/.test(l) && /\s—\s/.test(l) && l.length < 140) {                                          // „jméno — hodnota“ = řádek tabulky
      const i = l.lastIndexOf(" — ");
      out += `<p class="radek"><span>${inl(l.slice(0, i))}</span><span class="z-meta">${inl(l.slice(i + 3))}</span></p>`;
    }
    else if (/^\s*\*\*/.test(l)) {
      zavri(); zaz = true;
      const m = /^(.*?\*\*.*?\*\*.*?)\s+—\s+(.+)$/.exec(l);
      out += `<div class="zaznam"><p class="z-hl">${m ? `<span>${inl(m[1])}</span><span class="z-meta">${inl(m[2])}</span>` : inl(l)}</p>`;
    }
    else { zavri(); out += `<p>${inl(l)}</p>`; }
  }
  zavri();
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
  box.innerHTML = `${p.image ? `<img class="dpanel-img" src="${p.image}" alt="">` : ""}<div class="dtext">${panelHtml(p.content)}</div>${zverinecHtml(p.controls)}${lazebnaHtml(p)}${controlsHtml(cleanControls(p.controls), "ciste")}`;
  wirePanel(box, key);
  spojVolby(box);
  wireLazebna(box);
  box.querySelectorAll("[data-zvire]").forEach((b) => b.addEventListener("click", () => {   // r27-4: klik na malované zvíře = volba v nabídce
    const sel = box.querySelector(`select[data-sel="${b.dataset.sel}"]`);
    if (sel) { sel.value = b.dataset.zvire; sel.dispatchEvent(new Event("change", { bubbles: true })); }
  }));
}

/** r27-4: nabídky bez rolet. Volba z nabídky, která odpovídá záznamu v textu (zakázka, zboží, úkol…), se stane tlačítkem
 *  přímo u toho záznamu; krátké nabídky bez záznamů se rozloží na karty s popisem. Roleta zůstane jen u dlouhých seznamů. */
const VOLBY_MAX = 14;
function spojVolby(box) {
  const norm = (x) => noEmoji(String(x || "")).toLowerCase().replace(/[*_`„“"'()·:.,!?]/g, " ").replace(/\s+/g, " ").trim();
  const zazn = [...box.querySelectorAll(".dtext .zaznam, .dtext p.radek")].map((el) => ({ el, t: norm((el.querySelector("b") || el.querySelector("span") || el).textContent) }));
  box.querySelectorAll("select.vsel[data-sel]").forEach((sel) => {
    const id = sel.dataset.sel;
    if (/^ks:(pet:|barbset:)/.test(id) || box.querySelector(`[data-zvire][data-sel="${id}"]`)) return;
    const opts = [...sel.options].filter((o) => o.value);
    if (!opts.length) return;
    const ph = noEmoji(sel.options[0].textContent).replace(/[…:.]+$/, "").trim();
    const sloveso = ph.split(/\s+/)[0] || L(["Vybrat", "Choose"]);
    const vyber = (v) => { sel.value = v; sel.dispatchEvent(new Event("change", { bubbles: true })); };
    const zbyle = [];
    opts.forEach((o) => {
      const [lab, desc = ""] = o.textContent.split(" — ");
      const n = norm(lab);
      const z = n.length > 2 && zazn.find((x) => x.t && (x.t === n || (x.t.length > 3 && (x.t.includes(n) || n.includes(x.t)))));
      if (!z) { zbyle.push([o, lab, desc]); return; }
      z.el.classList.add("s-akci");
      let a = z.el.querySelector(".z-akce");
      if (!a) { a = document.createElement("div"); a.className = "z-akce"; z.el.appendChild(a); }
      const b = document.createElement("button");
      b.type = "button"; b.className = "btn small" + (a.children.length ? "" : " primary");
      b.textContent = sloveso; b.title = ph;
      b.onclick = () => { b.disabled = true; vyber(o.value); };
      a.appendChild(b);
    });
    if (zbyle.length === opts.length && opts.length > VOLBY_MAX) return;     // dlouhý seznam bez záznamů — roleta zůstane
    sel.hidden = true;
    if (!zbyle.length) return;
    const wrap = document.createElement("div");
    wrap.className = "volby-blok";
    wrap.innerHTML = `<div class="sect">${esc(ph)}</div><div class="vp-volby">${zbyle.map(([o, lab, desc]) =>
      `<button type="button" class="vp-volba" data-volba="${esc(o.value)}"${o.disabled ? " disabled" : ""}><b>${esc(noEmoji(lab).trim())}</b>${desc ? `<small>${esc(noEmoji(desc).trim())}</small>` : ""}</button>`).join("")}</div>`;
    wrap.querySelectorAll("[data-volba]").forEach((b) => b.onclick = () => { b.disabled = true; vyber(b.dataset.volba); });
    (sel.closest(".vrow") || sel).after(wrap);
  });
}

/** r27-4: lazebna — postava naživo; volba se nejdřív jen ukáže na postavě, zaplatí se až tlačítkem. */
function lazebnaHtml(p) {
  const ctl = p.controls || [];
  const sel = ctl.find((c) => c.t === "select" && String(c.id).startsWith("ks:barbset:"));
  const menu = ctl.some((c) => String(c.id).startsWith("ks:barber:"));
  if (!sel && !menu) return "";
  const fig = `<div class="hero-fig laz-fig" id="lazfig">${Postava.html(S.me, IMG_BASE)}</div>`;
  if (!sel) return `<div class="lazebna">${fig}</div>`;
  const attr = sel.id.slice("ks:barbset:".length), cena = (/cena \*\*(\d+)\s*gr/.exec(p.content || "") || [])[1] || "";
  return `<div class="lazebna" data-attr="${esc(attr)}" data-sel="${esc(sel.id)}" data-cena="${esc(cena)}">${fig}
    <div class="laz-volby"><div class="laz-moznosti">${sel.options.map((o) => `<button type="button" class="chip laz-o" data-v="${esc(o.value)}">${esc(noEmoji(o.label))}</button>`).join("")}</div>
      <button type="button" class="btn primary big" id="lazok" disabled>${esc(L(["Vyber, co ti lazebník udělá", "Pick a style"]))}</button></div></div>`;
}
function wireLazebna(box) {
  const lz = box.querySelector(".lazebna[data-sel]");
  if (!lz) return;
  box.classList.add("s-lazebnou");
  const ok = lz.querySelector("#lazok");
  lz.querySelectorAll(".laz-o").forEach((b) => b.addEventListener("click", () => {
    lz.querySelectorAll(".laz-o").forEach((x) => x.classList.toggle("on", x === b));
    const looks = { ...(S.me.looks || {}), [lz.dataset.attr]: b.dataset.v };
    lz.querySelector("#lazfig").innerHTML = Postava.html({ ...S.me, looks }, IMG_BASE);
    ok.disabled = false; ok.dataset.v = b.dataset.v;
    ok.textContent = L(["Zaplatit ", "Pay "]) + (lz.dataset.cena ? lz.dataset.cena + " gr. · " : "") + b.dataset.v;
  }));
  ok.addEventListener("click", () => {
    const sel = box.querySelector(`select[data-sel="${lz.dataset.sel}"]`);
    if (sel && ok.dataset.v) { sel.value = ok.dataset.v; sel.dispatchEvent(new Event("change", { bubbles: true })); }
  });
}

/** r27-4: zvěřinec — malovaná zvířata (img/bytosti/zvire-<druh>-<stupeň>) místo holého seznamu. */
const ZVIRE_SLUG = { "Cvičený medvěd": "medved", "Ochočená liška": "liska" };
const ZVIRE_STUPEN = [["zkušen", 3], ["dospěl", 2], ["dospívaj", 1], ["mládě", 0]];
function zverinecHtml(controls) {
  const sels = (controls || []).filter((c) => c.t === "select" && (c.id === "ks:pet:buy" || c.id === "ks:pet:set"));
  if (!sels.length) return "";
  return sels.map((c) => {
    const buy = c.id === "ks:pet:buy";
    return `<div class="sect">${esc(buy ? L(["Mláďata na prodej", "Young animals for sale"]) : L(["Tvá zvířata", "Your animals"]))}</div>
      <div class="zvirata">${c.options.map((o) => {
        const stage = buy ? 0 : (ZVIRE_STUPEN.find(([w]) => (o.label || "").includes(w)) || [0, 2])[1];
        const f = "bytosti/zvire-" + (ZVIRE_SLUG[o.value] || Postava.slug(o.value)) + "-" + stage;
        const lock = /🔒/.test(o.label || "");
        return `<button type="button" class="zvire${lock ? " zamceno" : ""}${o.default ? " vybrano" : ""}" data-sel="${esc(c.id)}" data-zvire="${esc(o.value)}"${lock ? " disabled" : ""}>
          ${IMG(f)}<b>${esc(noEmoji(o.label || o.value).replace(/\s*—.*$/, "").trim())}</b>
          <small>${esc(noEmoji(buy ? ((o.label || "").split("—")[1] || "").replace(/🔒\s*(\d+)/, (m, n) => L(["· od úrovně ", "· level "]) + n).trim() : (o.desc || "")))}</small></button>`;
      }).join("")}</div>`;
  }).join("");
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
    <p class="kh-head">${head}</p>${mine}${bets}${again}${log ? `<ol class="kh-log">${log}</ol>` : ""}${c.id ? chatHtml("kohout:" + c.id, c.chat) : ""}`;
  wireChat(box, () => cockLoad(true));
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
const GAME_TITLE = { cards: ["Oko bere", "Twenty-one"], prsi: ["Prší", "Prší"], dice: ["Kostky", "Dice"], liar: ["Lhář", "Liar's dice"], morris: ["Mlýn", "Nine men's morris"],
  darts: ["Šipky", "Darts"], duel: ["Souboj na kolbišti", "Arena duel"] };
const GAME_BG = { cards: "hra-stul-karty", prsi: "hra-stul-karty", dice: "hra-stul-kostky", liar: "hra-stul-kostky" };
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
  const board = { cards: hCards, prsi: hPrsi, dice: hDice, liar: hLiar, morris: hMorris, darts: hDarts, duel: hDuel }[g.kind](T_, mine, r);
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
// r27-4: prší proti hráči — soupeřovy karty jen rubem a počtem
function hPrsi(T_, mine) {
  const g = { ...T_, my_turn: mine && T_.my_turn, stake: T_.stake || 0, log: "" };
  const { table, side } = prsiStul(g, !!T_.done, T_.foe || L(["Soupeř", "Opponent"]));
  const ctl = side.split('<p class="dim small">')[1] ? '<p class="dim small">' + side.split('<p class="dim small">')[1].replace(/<\/div>\s*$/, "") : "";
  return {
    table,
    info: `<p class="muted small">${esc(PRSI_PRAVIDLA())}</p>`,
    ctl: g.my_turn && !T_.done ? ctl : "",
    wire: (box) => wirePrsi(box, (act, card, suit) => hraciAct(act === "play" ? [["pp", [card + (suit ? ">" + suit : "")]]] : [["pd"]], box.querySelector(".tablepanel") || box)),
  };
}

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
    table: `<div class="terc-plocha"><div class="terc"><img src="${DOM("hra-terc")}" alt="">${tercZony(mine && T_.turn === "me" && !T_.done)}
      ${spots.map((s, i) => `<span class="zabodnuta${dartCls()}${s.miss ? " mimo" : ""}${fresh ? " letí" : ""}" data-i="${i}" style="left:${s.x}%;top:${s.y}%">${dartHtml()}</span>`).join("")}</div></div>`,
    info: `<div class="scores"><div class="score">${esc(T_.me)}<b>${T_.left}</b></div><div class="score">${esc(T_.foe)}<b>${T_.foe_left}</b></div></div>
      <p class="muted small">${esc(L(["Oba od 201 dolů přesně na nulu, tři šipky za tah. Přehodíš-li zbytek, tah propadá.", "Both start at 201 and go down to exactly zero, three darts a turn. Overshoot voids the turn."]))}</p>
      ${(T_.rolls || []).length ? `<div class="hod">${T_.rolls.map((r_) => `<p>${hodTxt(r_)}</p>`).join("")}</div>` : mine && T_.turn === "me" ? dartsHint() : ""}`,
    ctl: dartsLegenda(),
    wire: (box) => {
      if (fresh) box.querySelectorAll(".zabodnuta.letí").forEach((el, i) => setTimeout(() => { Zvuk.sfx("sipka"); setTimeout(() => { el.classList.remove("letí"); Zvuk.sfx(el.classList.contains("mimo") ? "mimo" : "zasah"); }, 330); }, i * 650));
      box.querySelectorAll(".terc-zony.klik [data-z]").forEach((z) => z.addEventListener("click", () => hraciAct([[z.dataset.z]], null)));
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

// r27-4: aukce hráčů — každá dražba jako rozklikávací karta s přihazováním
const AUK = { timer: null, open: new Set() };
VIEWS.aukce = async (view) => {
  view.replaceChildren(h(`${sceneHead("mesto-trziste", L(["Aukce hráčů", "Player auctions"]), L(["Vyvolávač: „Kdo dá víc? Poprvé, podruhé…“", "Crier: \"Who bids more? Going once, going twice…\""]), true)}
    <div class="row aukce-akce"><button class="btn primary" id="aucnew">${esc(L(["Vydražit svůj předmět", "Auction your item"]))}</button>
      <button class="btn" id="aucpar">${esc(L(["Vyzvednout zásilky", "Collect parcels"]))}</button></div>
    <div id="auclist" class="aukce"><div class="empty">…</div></div>
    <p><button class="btn" data-go="misto/trziste">← ${esc(t("back"))}</button></p>`));
  mountLive(view);
  view.querySelector("[data-go]").onclick = () => go("misto/trziste");
  $("#aucnew").onclick = () => { PANEL.back = "aukce"; go("panel/=ks:auc:new"); };
  $("#aucpar").onclick = () => { PANEL.back = "aukce"; go("panel/=ks:auc:parcels"); };
  const cas = (ts) => { const s = Math.max(0, Math.round(ts - Date.now() / 1000)); return s >= 3600 ? Math.floor(s / 3600) + " h " + Math.floor(s % 3600 / 60) + " min" : s >= 60 ? Math.floor(s / 60) + " min" : s + " s"; };
  const kresli = async () => {
    if (S.tab !== "aukce") { clearInterval(AUK.timer); return; }
    let r; try { r = await call("auctions", {}, true); } catch { return; }
    const box = $("#auclist"); if (!box) return;
    if (r.parcels) $("#aucpar").textContent = L(["Vyzvednout zásilky (", "Collect parcels ("]) + r.parcels + ")";
    box.innerHTML = r.auctions.length ? r.auctions.map((a) => {
      const stav = a.mine ? L(["tvá aukce", "your auction"]) : a.lead ? L(["vedeš", "you lead"]) : a.bidder ? L(["nejvyšší: ", "top: "]) + a.bidder : L(["bez nabídky", "no bids"]);
      const kroky = a.bidder ? a.steps.map((st) => [st, a.bid + st]) : [[0, a.start], ...a.steps.slice(0, 3).map((st) => [st, a.start + st])];
      return `<details class="aukce-karta${a.lead ? " vedu" : ""}" data-id="${esc(a.id)}"${AUK.open.has(a.id) ? " open" : ""}>
        <summary>${icon(a.item)}<span class="a-nm"><b>${esc(a.item)}</b><small>${esc(L(["prodává ", "seller "]) + (a.seller || ""))}</small></span>
          <span class="a-cena"><b>${esc(String(a.bid || a.start))} gr.</b><small>${esc(stav)}</small></span><span class="a-cas">${esc(cas(a.ends))}</span></summary>
        <div class="a-telo">${a.mine || a.lead ? `<p class="muted">${esc(a.mine ? L(["Na vlastní aukci nepřihazuješ.", "You can't bid on your own auction."]) : L(["Nejvyšší nabídku máš ty. Když tě někdo přehodí, groše se ti vrátí.", "You hold the top bid."]))}</p>`
          : `<p class="muted">${esc(L(["Máš ", "You have "]) + r.coins + " gr. · " + L(["přihoz v posledních 60 s prodlouží aukci o minutu", "a bid in the last 60 s adds a minute"]))}</p>
          <div class="row">${kroky.map(([st, sum]) => `<button class="btn${st === kroky[0][0] ? " primary" : ""}" data-bid="${esc(a.id)}:${st}"${sum > r.coins ? " disabled" : ""}>${esc(st ? "+" + st + " → " + sum + " gr." : L(["Nabídnout ", "Bid "]) + sum + " gr.")}</button>`).join("")}</div>`}</div></details>`;
    }).join("") : `<div class="empty">${esc(L(["Teď se nic nedraží. Vydraž něco svého.", "Nothing is up for auction right now."]))}</div>`;
    loadIcons(r.auctions.map((a) => a.item));
    box.querySelectorAll("details").forEach((d) => d.addEventListener("toggle", () => { d.open ? AUK.open.add(d.dataset.id) : AUK.open.delete(d.dataset.id); }));
    box.querySelectorAll("[data-bid]").forEach((b) => b.onclick = async () => {
      b.disabled = true;
      try { const x = await call("raid_click", { id: "ks:aucbid:" + b.dataset.bid, values: [] }); Zvuk.sfx("mince"); toast(noEmoji((x.panel && x.panel.content) || L(["Přihozeno.", "Bid placed."])).replace(/\*\*/g, "")); }
      catch { b.disabled = false; }
      kresli();
    });
  };
  clearInterval(AUK.timer); AUK.timer = setInterval(kresli, 10000);
  kresli();
};

// r27-4: obchodníci, kteří opravují a zušlechťují (číslo = pořadí v game.SHOPS pro panel ks:shop:N)
const DILNA = { "Kovář": 0, "Střelmistr": 1, "Zbrojíř": 2, "Krejčí": 6 };
// r27-5: posuvník množství a stav opotřebení (sdílené obchodem, dílnou i batohem)
function wireMnoz(box) {
  box.querySelectorAll("[data-mn]").forEach((r) => r.oninput = () => {
    const it = r.closest(".item"), n = Number(r.value);
    r.nextElementSibling.textContent = "×" + n;
    const c = it.querySelector("[data-cena-txt]"); if (c) c.textContent = t("coins", Number(r.dataset.cena) * n);
  });
}
function opotrebeni(i) {
  if (i.wear == null) return "";
  const w = i.wear, tr = w <= 0 ? "rozbite" : w <= 30 ? "zle" : w <= 60 ? "stredni" : "dobre";
  return `<div class="opotreb ${tr}" title="${esc(L(["Stav výbavy", "Condition"]))}"><i style="width:${w}%"></i><span>${esc(w <= 0 ? L(["rozbité", "broken"]) : L(["stav ", "condition "]) + w + " %")}${i.enh ? " · +" + i.enh : ""}</span></div>`;
}

VIEWS.obchod = async (view) => {
  const shopId = S.arg;
  const u = SHOPS_UI[shopId] || { img: "mesto-trziste", say: ["", ""] };
  const back = shopId === "Hostinský" ? "misto/hostinec" : shopId === "Mlynář" ? "mesto" : "misto/trziste";
  view.replaceChildren(h(`${sceneHead(u.img, shopId, L(u.say), true)}
    ${S.me.on_raid ? `<div class="panel notice" style="margin:14px 0">🗺️ ${esc(t("on_raid"))}</div>` : ""}
    <div class="shoppanel" id="shop"><div class="panel empty">…</div></div>
    <p><button class="btn" id="back">← ${esc(t("back"))}</button></p>`));
  mountLive(view);
  $("#back").onclick = () => go(back);
  let data;
  try { data = await call("shop", { shop: shopId }); } catch { return; }
  const box = $("#shop");
  if (!box || S.arg !== shopId) return;
  view.querySelector(".scene-cap h2").textContent = data.name;
  const lvl = S.me.level;
  // r27-4: obchod jako truhla — vlevo zboží obchodníka (Koupit, po kategoriích), vpravo věci, které neseš (Prodat)
  const OST = L(["ostatní", "other"]);
  const kats = [...new Set(data.items.map((i) => i.slot_name || OST))];
  let kat = "", q = "";
  const sedi = (i) => !q || i.name.toLowerCase().includes(q.toLowerCase());
  // r27-5: víc kusů posuvníkem (u jídla, střeliva, surovin…), cena se přepočítá
  const mnoz = (max, cena) => max > 1 ? `<label class="mnoz" title="${esc(L(["Kolik kusů", "How many"]))}"><input type="range" min="1" max="${max}" value="1" data-mn data-cena="${cena}"><b>×1</b></label>` : "";
  const koupit = (i) => { const mx = i.stack && i.level <= lvl ? Math.max(1, Math.min(20, Math.floor(S.me.coins / Math.max(1, i.price)))) : 1;
    return `<div class="item">${icon(i.id)}
      <div><div class="nm">${esc(i.name)}${i.level > lvl ? `<span class="tag lock">${esc(t("from_level", i.level))}</span>` : ""}</div>
      <div class="meta">${esc(i.slot_name)}${i.count ? " · " + esc(t("have", i.count)) : ""}</div></div>
      <div class="acts">${mnoz(mx, i.price)}<span class="price" data-cena-txt>${esc(t("coins", i.price))}</span>
        <button class="btn small primary" data-buy="${esc(i.id)}"${i.level > lvl || i.price > S.me.coins ? " disabled" : ""}>${esc(t("buy"))}</button></div></div>`; };
  const prodat = (i) => `<div class="item${i.sell ? "" : " nechce"}">${icon(i.id)}
      <div><div class="nm">${esc(i.name)}${i.count > 1 ? ` <span class="muted">× ${i.count}</span>` : ""}${i.sell && i.best ? `<span class="tag ok">${esc(L(["nejlepší výkup", "best price"]))}</span>` : ""}</div>
      <div class="meta">${esc(i.sell ? (i.best_shop ? L(["víc dá ", "more at "]) + i.best_shop + " (" + t("coins", i.best_price) + ")" : i.slot_name) : L(["tohle nevykupuje", "won't buy this"]))}</div>${opotrebeni(i)}</div>
      <div class="acts">${i.sell ? `${mnoz(i.count, i.sell)}<span class="price" data-cena-txt>${esc(t("coins", i.sell))}</span>
        <button class="btn small" data-sell="${esc(i.id)}">${esc(t("sell"))}</button>` : ""}</div></div>`;
  const drawShop = () => {
    const vse = data.items.filter(sedi);
    const rows = vse.filter((i) => !kat || (i.slot_name || OST) === kat);
    const fk = $("#shop-kat");
    if (fk) {
      fk.innerHTML = kats.length > 1 ? [["", L(["Vše", "All"]) + " · " + vse.length], ...kats.map((k) => [k, k + " · " + vse.filter((i) => (i.slot_name || OST) === k).length])]
        .map(([k, n]) => `<button class="chip${kat === k ? " on" : ""}" data-kat="${esc(k)}">${esc(n.charAt(0).toUpperCase() + n.slice(1))}</button>`).join("") : "";
      fk.querySelectorAll("[data-kat]").forEach((b) => b.onclick = () => { kat = b.dataset.kat; drawShop(); });
    }
    const skup = kat || kats.length < 2 ? [[kat, rows]] : kats.map((k) => [k, rows.filter((i) => (i.slot_name || OST) === k)]).filter(([, r]) => r.length);
    $("#shop-items").innerHTML = rows.length ? skup.map(([k, r]) => (!kat && kats.length > 1 ? `<div class="sect kat-nadpis">${esc(k)}</div>` : "") + r.map(koupit).join("")).join("")
      : `<div class="empty">${esc(t("empty"))}</div>`;
    const mine = (data.mine || []).filter(sedi).sort((x, y) => (y.sell ? 1 : 0) - (x.sell ? 1 : 0) || (y.best ? 1 : 0) - (x.best ? 1 : 0));
    $("#shop-mine").innerHTML = mine.length ? mine.map(prodat).join("") : `<div class="empty">${esc(L(["Nic u sebe nemáš.", "Nothing carried."]))}</div>`;
    $("#mine-n").textContent = (data.mine || []).filter((i) => i.sell).length;
    wireMnoz(box);
    const kolik = (b) => Number(b.closest(".item")?.querySelector("[data-mn]")?.value || 1);
    box.querySelectorAll("[data-buy]").forEach((b) => b.onclick = () => { b.disabled = true; call("buy", { item: b.dataset.buy, count: kolik(b) })
      .then((r) => { Zvuk.sfx("mince"); toast(t("bought", r.price) + (r.count > 1 ? ` (${r.count}×)` : "")); render(); }).catch(() => { b.disabled = false; }); });
    box.querySelectorAll("[data-sell]").forEach((b) => b.onclick = () => {
      const n = kolik(b);
      b.disabled = true;
      call("sell", { item: b.dataset.sell, shop: shopId, count: n }).then((r) => { Zvuk.sfx("mince"); toast(t("sold", r.price)); render(); }).catch(() => { b.disabled = false; });
    });
    loadIcons([...rows, ...mine].map((i) => i.id));
  };
  const mins = data.restock_min || 0;
  const left = mins >= 60 ? t("hm", Math.floor(mins / 60), mins % 60) : t("m", mins);
  const grain = shopId === "Mlynář" ? ((data.mine || []).find((i) => i.id === "Obilí") || {}).count || 0 : 0;
  box.replaceChildren(h(`${shopId === "Mlynář" ? `<div class="panel notice" style="margin-bottom:12px">⚙️ ${esc(L(["Mlynář ti semele obilí na mouku za 1 groš za pytel.", "The miller grinds your grain into flour for 1 groschen a sack."]))}
      <button class="btn small primary" id="mill"${grain ? "" : " disabled"}>${esc(L(["Semlít obilí", "Grind grain"]))}${grain ? ` (${grain}×)` : ""}</button></div>` : ""}
    <div class="panel truhla-stav obchod-stav"><div class="ts-info"><b>${esc(data.name)}</b>
      <span>${esc(L(["Měšec: ", "Purse: "]) + t("coins", S.me.coins))}</span><span class="dim">🔄 ${esc(t("restock", left))}</span></div>
      <div class="row">${DILNA[shopId] !== undefined ? `<button class="btn" id="oprava" title="${esc(L(["Opotřebená výbava zpět na 100 %, zušlechtění nasazené", "Worn gear back to 100 %, improve what you wear"]))}">${esc(L(["Opravit a zušlechtit", "Repair and improve"]))}</button>` : ""}
      <input class="search" id="shop-q" type="search" placeholder="${esc(t("search"))}"></div></div>
    <div class="grid g2 truhla-sloupce obchod-sloupce" style="align-items:start">
      <div class="panel"><div class="spread"><h3>${esc(L(["Zboží", "For sale"]))}</h3><span class="pill">${data.items.length}</span></div>
        <div class="filter shop-kat" id="shop-kat"></div><div class="items" id="shop-items"></div></div>
      <div class="panel"><div class="spread"><h3>${esc(L(["Tvoje věci — prodej", "Your things — sell"]))}</h3><span class="pill" id="mine-n"></span></div>
        <p class="muted small">${esc(L(["Každý obchodník dá nejvíc za své zboží, jinde jen polovic.", "Each merchant pays most for his own trade."]))}</p>
        <div class="items" id="shop-mine"></div></div>
    </div>`));
  const millBtn = $("#mill");
  if (millBtn) millBtn.onclick = () => call("mill").then((r) => { Zvuk.sfx("mince"); toast(L([`Semleto: ${r.milled}× mouka za ${r.paid} gr.`, `Ground: ${r.milled}× flour for ${r.paid} gr.`])); render(); }).catch(() => {});
  const opr = $("#oprava");   // r27-4: oprava a zušlechtění = panel obchodníka jako na Discordu (výběr „Opravit výbavu“ a „Zušlechtit“)
  if (opr) opr.onclick = () => go("dilna/" + encodeURIComponent(shopId));
  $("#shop-q").oninput = (e) => { q = e.target.value.trim(); drawShop(); };
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

// r27-4: prší — vlastní ruka lícem (hratelné karty se dají kliknout), soupeř vždy jen rubem a počtem
const PRSI_PRAVIDLA = () => L(["Každý má 4 karty. Přikládáš stejnou barvu nebo hodnotu. Sedma: další bere 2 (sedmy se sčítají, přebiješ sedmou). Eso: další stojí (přebiješ esem). Svršek jde na cokoli a mění barvu. Kdo se první zbaví karet, vyhrává.",
  "Four cards each. Match the suit or the rank. Seven: next player draws 2 (sevens stack). Ace: next player skips. Queen goes on anything and changes the suit. First to empty the hand wins."]);
function prsiStul(g, over, foeName) {
  const ok = new Set(g.playable || []);
  const mine = (g.hand || []).map(([r, su, code]) => `<button type="button" class="prsi-karta${ok.has(code) ? " hratelna" : ""}" data-pk="${esc(code)}"${ok.has(code) && !over ? "" : " disabled"}>${pcard([r, su], -1)}</button>`).join("");
  const his = Array(g.foe_count || 0).fill(0).map(() => pcard(null, -1)).join("");
  const hint = !over && g.my_turn ? (g.ace ? L(["Leží eso — přebij esem, nebo stůj.", "An ace is down — play an ace or skip."])
    : g.seven ? L([`Leží sedma — přebij sedmou, nebo ber ${g.seven}.`, `A seven is down — play a seven or draw ${g.seven}.`])
    : ok.size ? L(["Vyber kartu, kterou přiložíš.", "Pick a card to play."]) : L(["Nemáš co přiložit — lízni si.", "Nothing to play — draw."])) : "";
  const pass = g.ace ? L(["Stát", "Skip"]) : g.seven ? L([`Brát ${g.seven}`, `Draw ${g.seven}`]) : L(["Líznout", "Draw"]);
  const table = `<div class="karty-plocha prsi">
      <div class="ruka hostinsky"><span class="kdo">${esc(foeName)} · ${esc(L([`${g.foe_count} karet`, `${g.foe_count} cards`]))}</span>${his}</div>
      <div class="prsi-stred"><div class="balicek">${pcard(null)}${pcard(null)}<span class="prsi-pocet">${g.deck}</span></div>
        <div class="prsi-vrch">${g.top ? pcard(g.top, -1) : ""}${g.suit && g.top && g.top[0] === "Q" ? `<span class="prsi-barva">${esc(g.suit_name)} ${esc(g.suit)}</span>` : ""}</div></div>
      <div class="ruka hrac"><span class="kdo">${esc(t("you"))}</span>${mine}</div></div>`;
  let side = `<div class="tablepanel panel"><h2>${esc(L(["Prší", "Prší"]))}</h2><p class="muted">${esc(t("stake"))}: ${esc(t("coins", g.stake))}</p>
      ${g.log ? `<p class="log">${md(g.log)}</p>` : ""}`;
  if (!over) side += g.my_turn ? `<p class="dim small">${esc(hint)}</p><div class="row"><button class="btn${ok.size ? "" : " primary"}" data-prsi="pass">${esc(pass)}</button></div>`
    : `<p class="dim">${esc(L(["Hraje soupeř…", "Opponent's turn…"]))}</p>`;
  return { table, side };
}
function wirePrsi(root, act) {
  root.querySelectorAll("[data-pk]").forEach((b) => b.onclick = () => {
    const code = b.dataset.pk;
    if (!code.startsWith("Q")) { Zvuk.sfx("karta"); return act("play", code); }
    const old = root.querySelector(".prsi-volba");
    if (old) old.remove();
    const v = document.createElement("div");
    v.className = "prsi-volba panel";
    v.innerHTML = `<b>${esc(L(["Svršek mění barvu na:", "Queen changes the suit to:"]))}</b><div class="row">${["♥", "♦", "♣", "♠"].map((su) =>
      `<button class="btn${su === "♥" || su === "♦" ? " cervena" : ""}" data-su="${su}">${su}</button>`).join("")}</div>`;
    v.querySelectorAll("[data-su]").forEach((x) => x.onclick = () => { Zvuk.sfx("karta"); act("play", code, x.dataset.su); });
    (root.querySelector(".tablepanel") || root).appendChild(v);
  });
  root.querySelectorAll("[data-prsi]").forEach((b) => b.onclick = () => { b.disabled = true; Zvuk.sfx("karta"); act(b.dataset.prsi); });
}

VIEWS.hra = async (view) => {
  const kind = ["cards", "darts", "prsi"].includes(S.arg) ? S.arg : "dice";
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
      <h2>${kind === "dice" ? "🎲 " + esc(t("dice")) : kind === "prsi" ? esc(L(["Prší", "Prší (Czech crazy eights)"])) : "🃏 " + esc(t("cards"))}</h2>
      ${S.me.on_raid ? `<div class="panel notice" style="margin-bottom:12px">🗺️ ${esc(t("on_raid"))}</div>` : ""}
      ${st.last_result ? `<p class="muted"><span>${esc(t("last_result"))}:</span> ${md(st.last_result)}</p>` : ""}
      <p class="muted small">${esc(kind === "prsi" ? PRSI_PRAVIDLA() : t(kind === "dice" ? "dice_rules" : "cards_rules"))}</p>
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
  } else if (g.kind === "prsi") {
    ({ table, side } = prsiStul(g, over, t("host")));
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
  wirePrsi(view, (act, card, suit) => send("prsi", { act, card, suit }));
  const ff = $("#forfeit");
  if (ff) ff.onclick = () => send("forfeit");
  const again = $("#again");
  if (again) again.onclick = () => { S.inn = null; go("hra/" + (["cards", "prsi"].includes(g.kind) ? g.kind : "dice")); };
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
// r27-4: bodové zóny na terči — hráč vidí, za kolik je která oblast (střed 50, kruh 25, trojitý kruh 60, pole 20 → 1)
const ZONY = [   // r27-4: zóny terče (vnější poloměr jako podíl terče), stejné jako na serveru (tavern.DARTS_ZONES)
  ["z5", .92, ["Vnější pole", "Outer field"], "1–7", 3], ["z12", .73, ["Střední pole", "Middle field"], "12", 6],
  ["z20", .50, ["Vnitřní pole", "Inner field"], "20", 10], ["z60", .29, ["Trojitý kruh", "Treble ring"], "60", 19],
  ["z25", .24, ["Vnitřní kruh", "Inner ring"], "25", 15], ["z50", .07, ["Střed", "Bull"], "50", 20]];
function tercZony(klik = false) {
  const R = (f) => (TERC.r * f).toFixed(2), C = `cx="${TERC.cx}" cy="${TERC.cy}"`;
  const lab = (f, txt, cls = "") => { const a = -Math.PI / 4, x = TERC.cx + Math.cos(a) * TERC.r * f, y = TERC.cy + Math.sin(a) * TERC.r * f;
    return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" class="tz-t ${cls}">${txt}</text>`; };
  return `<svg class="terc-zony${klik ? " klik" : ""}" viewBox="0 0 100 100" preserveAspectRatio="none">
    ${ZONY.map(([z, f, n, body, dc]) => `<circle ${C} r="${R(f)}" class="tz-z${z === "z60" ? " tz-tri" : z === "z50" ? " tz-bull" : ""}" data-z="${z}"><title>${esc(L(n) + " · " + body + L([" b. · šance ", " pts · chance "]) + dartsSance(dc) + " %")}</title></circle>`).join("")}
    <text x="${TERC.cx}" y="${(TERC.cy + 1.3).toFixed(1)}" class="tz-t tz-s">50</text>
    ${lab(.155, "25")}${lab(.265, "60", "tz-3")}${lab(.40, "20")}${lab(.615, "12")}${lab(.83, "1–7")}</svg>`;
}
const dartsHint = () => `<p class="muted small sipky-navod">${esc(L(["Klikni do zóny na terči, kam chceš mířit. Hodí se k20 + bonus Obratnosti proti obtížnosti zóny — těsně vedle spadne šipka do zóny dál od středu, hodně vedle mimo. Tři šipky za tah.", "Click the zone you aim at: d20 + Agility bonus vs the zone's difficulty."]))}</p>`;
function hodTxt(r) {
  const kam = (z) => z ? L((ZONY.find((x) => x[0] === z) || [0, 0, ["?", "?"]])[2]) : L(["mimo terč", "off the board"]);
  return `${L(["Mířil jsi: ", "Aimed: "])}<b>${esc(r.aim_name)}</b> · k20 <b>${r.roll}</b> + ${r.bonus} = <b>${r.roll + r.bonus}</b> / ${r.dc}
    → ${r.hit ? `<span class="hod-ok">${esc(L(["zásah! ", "hit! "]))}${r.pts} b.</span>` : `<span class="hod-ne">${esc(L(["vedle — ", "missed — "]) + kam(r.landed))}${r.pts ? " · " + r.pts + " b." : ""}</span>`}`;
}
// r27-5: šance na zásah zóny v % (k20 + polovina Obratnosti proti obtížnosti; 20 vždy zasáhne, 1 vždy mine)
const dartsSance = (dc) => { const st = (S.me?.stats || []).find((x) => x.id === "Obratnost"), b = Math.floor((st ? st.value : 10) / 2);
  let n = 0; for (let r = 1; r <= 20; r++) if (r === 20 || (r !== 1 && r + b >= dc)) n++; return n * 5; };
const dartsLegenda = () => `<div class="sipky-legenda">${ZONY.slice().reverse().map(([z, f, n, body, dc]) =>
  `<div><b>${esc(L(n))}</b><span>${body} ${esc(L(["b.", "pts"]))}</span><em class="sance">${dartsSance(dc)} %</em><small>${esc(L(["šance na zásah · potřeba ", "hit chance · need "]) + dc)}</small></div>`).join("")}</div>`;
const DART = `<svg viewBox="0 0 40 160" class="sipka-svg" aria-hidden="true"><path d="M20 0l3 22h-6z" fill="#cfd3d6" stroke="#555" stroke-width="1"/>
  <rect x="17" y="21" width="6" height="88" rx="2" fill="#8a5a2b"/><rect x="16" y="40" width="8" height="4" fill="#3a2410"/>
  <path d="M20 104L6 150l14-12 14 12z" fill="#e8dcc0" stroke="#6b5631"/><path d="M20 104v46" stroke="#6b5631"/></svg>`;
// r27-2: malovaná šipka zabodnutá v terči (pohled zepředu), dokud není, kreslená SVG
const dartArt = () => artReady("domov/hra-sipka-zabodnuta");
const dartHtml = () => dartArt() ? `<img class="sipka-obr" src="${ART_SRC("domov/hra-sipka-zabodnuta")}" alt="" draggable="false">` : DART;
const dartCls = () => dartArt() ? " obr" : "";

function darts(view) {   // r27-4: trénink — po jedné šipce do zvolené zóny, tah = 3 šipky
  const D = S.darts || (S.darts = { left: 201, turns: 0, log: [], stuck: [], n: 0, start: 201, last: null });
  view.replaceChildren(h(`<div class="stul-scena live" data-img="mesto-hostinec" data-key="hostinec">
    <div class="terc-plocha"><div class="terc"><img src="${DOM("hra-terc")}" alt="">${tercZony(D.left > 0)}${D.stuck.map((s_) => `<span class="zabodnuta${dartCls()}" style="left:${s_.x}%;top:${s_.y}%">${dartHtml()}</span>`).join("")}</div></div>
    <div class="tablepanel panel"><h2>${artReady("domov/hra-sipky-sada") ? `<img class="h2-ikona" src="${ART_SRC("domov/hra-sipky-sada")}" alt="">` : "🎯"} ${esc(t("darts"))}</h2>
      <p class="muted small">${esc(L(["Trénink bez sázky. Začínáš na 201 a odečítáš body až přesně na nulu. Přehodíš-li zbytek, tah propadá.", "Practice. Start at 201, count down to exactly zero; going below zero voids the turn."]))}</p>
      <div class="scores"><div class="score">${esc(t("left_lbl"))}<b>${D.left}</b></div><div class="score">${esc(t("turn_lbl"))}<b>${D.turns}</b></div>
        <div class="score">${esc(L(["Šipka", "Dart"]))}<b>${D.left ? Math.min(3, D.n + 1) : "–"}/3</b></div></div>
      ${D.last ? `<p class="hod">${hodTxt(D.last)}</p>` : dartsHint()}
      <p class="log">${D.log.slice(-3).map(esc).join("<br>")}</p>
      ${dartsLegenda()}
      <div class="row" style="margin-top:12px"><button class="btn small" id="dnew">${esc(t("new_game"))}</button>
      <button class="btn" data-go="misto/hostinec">← ${esc(t("back"))}</button></div></div></div>`));
  mountLive(view, { still: true });
  view.querySelector("[data-go]").onclick = () => go("misto/hostinec");
  $("#dnew").onclick = () => { S.darts = null; render(); };
  const board = view.querySelector(".terc");
  let busy = false;
  view.querySelectorAll(".terc-zony.klik [data-z]").forEach((z) => z.addEventListener("click", async (ev) => {
    ev.stopPropagation(); if (busy) return; busy = true;
    let r; try { r = await call("darts_throw", { aim: z.dataset.z, left: D.left }); } catch { busy = false; return; }
    const d = r.dart, spot = dartSpot(d.pts);
    if (D.n === 0) { board.querySelectorAll(".zabodnuta").forEach((x) => x.remove()); D.stuck = []; D.start = D.left; }
    Zvuk.sfx("sipka");
    const el = document.createElement("span");
    el.className = "zabodnuta letí" + dartCls() + (spot.miss ? " mimo" : "");
    el.style.left = spot.x + "%"; el.style.top = spot.y + "%"; el.innerHTML = dartHtml();
    board.appendChild(el);
    await new Promise((ok) => setTimeout(ok, 330));
    Zvuk.sfx(spot.miss ? "mimo" : "zasah"); el.classList.remove("letí");
    const tag = document.createElement("b"); tag.className = "body-tag" + (d.hit ? "" : " vedle"); tag.textContent = d.pts ? "+" + d.pts : t("miss");
    tag.style.left = spot.x + "%"; tag.style.top = spot.y + "%"; board.appendChild(tag);
    if (!spot.miss) D.stuck.push(spot);
    D.last = d; D.n++;
    const left = D.left - d.pts;
    if (left < 0) { D.turns++; D.log.push(`${t("turns_n", D.turns)}: ${t("bust")}`); D.left = D.start; D.n = 0; }
    else if (left === 0) { D.turns++; D.left = 0; D.log.push(t("closed", D.turns)); Zvuk.sfx("vyhra"); }
    else { D.left = left; if (D.n >= 3) { D.turns++; D.log.push(`${t("turns_n", D.turns)} → ${t("left_pts", left)}`); D.n = 0; } }
    await new Promise((ok) => setTimeout(ok, 700));
    busy = false; render();
  }));
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

// r27-5: tlačítka výpravy — hlavní volby (cesty, boj) jako velké karty, pomocné akce jako lišta pod nimi
function raidControlsHtml(list, busy) {
  if (!list || !list.length) return "";
  const tl = list.filter((c) => c.t !== "select");
  const hl = tl.filter((c) => c.style !== "secondary"), ved = tl.filter((c) => c.style === "secondary");
  if (!hl.length) { hl.push(...ved.splice(0, Math.min(ved.length, 2))); }
  const btn = (c, cls) => `<button class="btn vbtn ${esc(c.style)} ${cls}" data-cid="${esc(c.id)}"${c.disabled ? " disabled" : ""}><span>${esc(noEmoji(c.label).trim())}</span></button>`;
  return `<div class="vctl vyp-ctl${busy ? " busy" : ""}">
    <div class="vyp-hlavni${hl.length === 1 ? " jedna" : ""}">${hl.map((c) => btn(c, "vyp-karta")).join("")}</div>
    ${ved.length ? `<div class="vyp-lista">${ved.map((c) => btn(c, "vyp-mala")).join("")}</div>` : ""}
    ${controlsHtml(list.filter((c) => c.t === "select"))}</div>`;
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
  if (!m) { drawRaidSetup(view, st); return; }
  if (m.status === "lobby") { drawLobby(view, m); return; }
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
      ${raidControlsHtml(m.controls, busy)}
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

// r27-4: příprava výpravy na webu — sólo i družina, lokace bez map (mapu si koupíš u písaře), obtížnost, glejt a nosič
const VYP = { mode: "solo", loc: null, diff: null, guard: false, porter: false };
function drawRaidSetup(view, st) {
  const locs = [...(st.locations || []), ...(st.camps || []).map((c) => ({ id: c.id, name: c.name, biome: L(["tábořiště", "camp"]), level: 1, camp: true }))];
  const diffs = st.difficulties || [], gp = st.guard_price || {}, pp = st.porter_price || {};
  const cena = (tab) => VYP.diff ? (tab[VYP.diff] || 0) : null;
  const lob = st.lobbies || [];
  view.replaceChildren(h(`${sceneHead("mesto-brana", L(["Městská brána", "Town gate"]), L(["Strážný: „Kam to bude, na stezky?“", "Guard: \"Off to the trails, then?\""]))}
    ${lob.length ? `<div class="panel vyp-druziny"><h3>${esc(L(["Družiny, které čekají na společníky", "Parties looking for members"]))}</h3>
      <div class="druziny">${lob.map((d) => `<div class="druzina"><div><b>${esc(d.location)}</b><small>${esc(d.difficulty)}${d.guard ? " · " + L(["s glejtem", "with writ"]) : ""}${d.hunt ? " · " + L(["po stopách", "tracking"]) : ""}</small>
        <p>${esc(d.members.join(", "))} <span class="muted">(${d.members.length}/${d.cap})</span></p></div>
        <button class="btn primary" data-cid="ks:lobby:${esc(d.id)}:join"${d.members.length >= d.cap ? " disabled" : ""}>${esc(L(["Přidat se", "Join"]))}</button></div>`).join("")}</div></div>` : ""}
    <div class="panel vyp-priprava"><h3>${esc(L(["Příprava výpravy", "Prepare an expedition"]))}</h3>
      <div class="vp-krok"><span class="vp-c">1</span><b>${esc(L(["Kdo jde", "Who goes"]))}</b></div>
      <div class="vp-volby">
        <button class="vp-volba${VYP.mode === "solo" ? " on" : ""}" data-mode="solo"><b>${esc(L(["Sólo", "Solo"]))}</b><small>${esc(L(["vyrazíš hned sám", "set out alone right away"]))}</small></button>
        <button class="vp-volba${VYP.mode === "group" ? " on" : ""}" data-mode="group"><b>${esc(L(["Družina 2–4 hráčů", "Party of 2–4"]))}</b><small>${esc(L(["založíš ji a počkáš na společníky", "found it and wait for companions"]))}</small></button>
      </div>
      <div class="vp-krok"><span class="vp-c">2</span><b>${esc(L(["Kam", "Where"]))}</b><small class="muted">${esc(L(["Mapu oblasti si kup u písaře — na cestě se hodí.", "Buy the area map from the scribe."]))}</small></div>
      <div class="vp-volby lok">${locs.map((l) => `<button class="vp-volba${VYP.loc === l.id ? " on" : ""}${st.level && l.level > st.level ? " tezke" : ""}" data-loc="${esc(l.id)}">
        <b>${esc(l.name)}</b><small>${esc(l.biome)}${l.camp ? "" : " · " + L(["od úrovně ", "level "]) + l.level}${l.places ? " · " + l.places + L([" míst", " places"]) : ""}</small></button>`).join("")}</div>
      <div class="vp-krok"><span class="vp-c">3</span><b>${esc(L(["Obtížnost", "Difficulty"]))}</b></div>
      <div class="vp-volby">${diffs.map((d) => `<button class="vp-volba${VYP.diff === d.id ? " on" : ""}" data-diff="${esc(d.id)}"><b>${esc(noEmoji(d.name))}</b>
        <small>${esc(L(["glejt ", "writ "]) + (gp[d.id] || 0) + " gr. · " + L(["nosič ", "porter "]) + (pp[d.id] || 0) + " gr.")}</small></button>`).join("")}</div>
      <div class="vp-krok"><span class="vp-c">4</span><b>${esc(L(["Služby u brány", "Services at the gate"]))}</b></div>
      <div class="vp-volby">
        <button class="vp-volba prepinac${VYP.guard ? " on" : ""}" data-tgl="guard"><b>${esc(L(["Glejt", "Writ of passage"]))}${cena(gp) != null ? " · " + cena(gp) + " gr." : ""}</b>
          <small>${esc(L(["S glejtem výprava není v seznamu Na stezkách — nikdo cizí nepůjde po vašich stopách.", "Nobody can follow your tracks."]))}</small></button>
        <button class="vp-volba prepinac${VYP.porter ? " on" : ""}" data-tgl="porter"><b>${esc(L(["Nosič", "Porter"]))}${cena(pp) != null ? " · " + cena(pp) + " gr." : ""}</b>
          <small>${esc(L(["Po výpravě sám odnese, co se nevejde do batohu — domů, do podniku nebo do truhly v hostinci. Bez něj to jde jen prodat u brány.", "Carries home what does not fit."]))}</small></button>
      </div>
      <div class="row vp-start"><button class="btn primary big" id="vp-go"${VYP.loc && VYP.diff ? "" : " disabled"}>${esc(VYP.mode === "group" ? L(["Založit družinu", "Found the party"]) : L(["Vyrazit na výpravu", "Set out"]))}</button>
        <span class="muted small">${esc(VYP.loc && VYP.diff ? (VYP.guard || VYP.porter ? L(["Platí se při vyražení, za každého člena.", "Paid on departure, per member."]) : "") : L(["Vyber, kam a jak těžkou výpravu.", "Pick a place and a difficulty."]))}</span></div>
      <p class="dim small">${esc(L(["Stejnou výpravu můžeš kdykoli hrát i na Discordu.", "You can switch to Discord any time."]))}</p>
    </div>
    <p><button class="btn" data-go="misto/brana">← ${esc(t("back"))}</button></p><div id="vpanel"></div>`));
  mountLive(view);
  Zvuk.music(townMusic());
  view.querySelectorAll("[data-mode]").forEach((b) => b.onclick = () => { VYP.mode = b.dataset.mode; drawRaid(view); });
  view.querySelectorAll("[data-loc]").forEach((b) => b.onclick = () => { VYP.loc = b.dataset.loc; drawRaid(view); });
  view.querySelectorAll("[data-diff]").forEach((b) => b.onclick = () => { VYP.diff = b.dataset.diff; drawRaid(view); });
  view.querySelectorAll("[data-tgl]").forEach((b) => b.onclick = () => { VYP[b.dataset.tgl] = !VYP[b.dataset.tgl]; drawRaid(view); });
  $("#vp-go").onclick = async (ev) => {
    const btn = ev.currentTarget; if (RAID.busy) return;
    RAID.busy = true; btn.disabled = true; Zvuk.sfx("klik");
    try {   // stejné kroky jako tlačítka ve shromaždišti na Discordu
      await call("raid_click", { id: "ks:mission:new:" + VYP.mode, values: [] }, true);
      await call("raid_click", { id: "ks:setup:setlocation", values: [VYP.loc] }, true);
      await call("raid_click", { id: "ks:setup:setdifficulty", values: [VYP.diff] }, true);
      if (VYP.guard) await call("raid_click", { id: "ks:setup:guard", values: [] }, true);
      if (VYP.porter) await call("raid_click", { id: "ks:setup:porter", values: [] }, true);
      const r = await call("raid_click", { id: "ks:setup:launch", values: [] });
      RAID.st = { mission: r.mission, locations: r.locations, difficulties: r.difficulties, ...r };
      if (!r.mission && r.panel) toast(noEmoji(r.panel.content || "").replace(/\*\*/g, "").split("\n").filter((x) => /⚠️|Nemáš|nemáš|gr\./.test(x))[0] || L(["Výpravu se nepodařilo spustit.", "Could not start."]));
      else Zvuk.sfx("dvere");
    } catch { RAID.st = await raidLoad(); }
    finally { RAID.busy = false; drawRaid($("#view")); }
  };
  wireRaid(view);
}

// r27-4: družina před vyražením — nastavení, role, pozvání hráče, vyrazit
function drawLobby(view, m) {
  view.replaceChildren(h(`${sceneHead("mesto-brana", L(["Družina #", "Party #"]) + m.id + " · " + m.location, m.difficulty || "")}
    <div class="panel vyp-lobby"><div class="vtext">${dmd(m.content)}</div>
      ${controlsHtml(m.controls)}
      ${m.member && (m.players || []).length ? `<div class="row pozvat"><select id="lob-pozvat"><option value="">${esc(L(["Pozvat hráče…", "Invite a player…"]))}</option>
        ${m.players.map((p) => `<option value="${esc(p.id)}">${esc(p.name)}</option>`).join("")}</select>
        <button class="btn" id="lob-poslat">${esc(L(["Poslat pozvánku", "Send invite"]))}</button></div>` : ""}
      <p class="dim small">${esc(L(["Pozvánka přijde hráči do jeho vlákna na Discordu; přidat se může i tady na webu u Brány.", "The invite goes to the player's Discord thread; they can also join here."]))}</p>
    </div><p><button class="btn" data-go="misto/brana">← ${esc(t("back"))}</button></p><div id="vpanel"></div>`));
  mountLive(view);
  const pb = $("#lob-poslat");
  if (pb) pb.onclick = () => { const v = $("#lob-pozvat").value; if (v) raidClick("ks:lobby:" + m.id + ":send", [v], pb); };
  if (RAID.panel) showRaidPanel(RAID.panel);
  wireRaid(view);
}

function wireRaid(root) {
  root.querySelectorAll("[data-go]").forEach((b) => b.onclick = () => go(b.dataset.go));
  root.querySelectorAll("[data-cid]").forEach((b) => b.onclick = () => raidClick(b.dataset.cid, [], b));
  root.querySelectorAll("[data-sel]").forEach((s) => s.onchange = () => { if (s.value) raidClick(s.dataset.sel, [s.value], s); });
  spojVolby(root);
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
    RAID.st = { ...r, panel: undefined };
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

function dmdInline(t) { if (typeof obsahJazyk === "function") t = obsahJazyk(t); return esc(t).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>"); }

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
        <button class="chip${S.lang === "en" ? " on" : ""}" data-l="en">English</button>
        <button class="chip${S.lang === "sk" ? " on" : ""}" data-l="sk">Slovenčina</button>
        <button class="chip${S.lang === "pl" ? " on" : ""}" data-l="pl">Polski</button></div>
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
    <div class="panel prirucka-odkaz"><h3>${esc(L(["Příručka hráče", "Player's handbook"]))}</h3>
      <p>${esc(L(["Jak co funguje: původy, vlastnosti, boj, výbava, výpravy, domov, peníze, dovednosti, družina i knihy.", "How everything works."]))}</p>
      <button class="btn primary" data-go="prirucka">${esc(L(["Otevřít příručku", "Open the handbook"]))}</button></div>
    <div class="panel"><h3>${esc(t("about"))}</h3><p>${esc(t("about_text"))}</p>
      <p class="muted">${esc(t("coming"))}</p>
      <p><a href="soukromi.html" target="_blank" rel="noopener">${esc(t("privacy"))}</a></p>
      <div class="napad"><h4>${esc(L(["Nápad nebo chyba?", "Idea or bug?"]))}</h4>
        <div class="row"><button class="chip on" data-nk="napad">${esc(L(["Nápad", "Idea"]))}</button><button class="chip" data-nk="chyba">${esc(L(["Chyba", "Bug"]))}</button></div>
        <textarea id="napad-text" rows="6" placeholder="${esc(L(["Co by ve hře mělo být, nebo co nefunguje (kde, co jsi dělal, co se stalo)…", "Your idea, or what went wrong…"]))}"></textarea>
        <div class="row"><button class="btn primary" id="napad-ok">${esc(L(["Odeslat na Discord", "Send to Discord"]))}</button><span class="muted small" id="napad-stav"></span></div></div></div>
  </div>`));
  view.querySelectorAll("[data-l]").forEach((b) => b.onclick = () => setLang(b.dataset.l));
  view.querySelectorAll("[data-go]").forEach((b) => b.onclick = () => go(b.dataset.go));
  let napadDruh = "napad";
  view.querySelectorAll("[data-nk]").forEach((b) => b.onclick = () => { napadDruh = b.dataset.nk; view.querySelectorAll("[data-nk]").forEach((x) => x.classList.toggle("on", x === b)); });
  $("#napad-ok").onclick = async (ev) => {
    const ta = $("#napad-text"), st = $("#napad-stav"); ev.currentTarget.disabled = true;
    try { const r = await call("napad", { kind: napadDruh, text: ta.value }); ta.value = ""; st.textContent = r.text; } catch {}
    ev.currentTarget.disabled = false;
  };
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

// r27-4: červená jen pro nesouhlas, odchod a ukončení — podle textu tlačítka
(() => {
  const NE = /^\s*(←\s*)?(zpět|zavřít|odejít|ukončit|vzdát|zrušit|odmítnout|ne\b|odstoupit|utéct|back|close|leave|quit|cancel|decline|forfeit|flee)/i;
  const mark = (root) => root.querySelectorAll && root.querySelectorAll("button,a.btn").forEach((b) => { if (NE.test(b.textContent || "")) b.classList.add("ne"); });
  const start = () => { mark(document.body); new MutationObserver((ms) => ms.forEach((m) => m.addedNodes.forEach((n) => { if (n.nodeType === 1) { mark(n); if (n.matches && n.matches("button,a.btn") && NE.test(n.textContent || "")) n.classList.add("ne"); } }))).observe(document.body, { childList: true, subtree: true }); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();

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
