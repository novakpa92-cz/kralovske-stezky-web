/* Královské stezky — webová hra (r26). Čistý JavaScript bez knihoven.
   Mluví se stejným API jako mobilní aplikace: POST {op, token, lang, ...} → {ok, ...}. */
"use strict";

const API = document.documentElement.dataset.api || "/api/v1";
const $ = (sel, el = document) => el.querySelector(sel);

// ------------------------------------------------------------------ texty CZ / EN
const T = {
  app_title: ["Královské stezky", "Royal Trails"],
  app_sub: ["Tahová hra z českého středověku", "A turn-based game of medieval Bohemia"],
  login_1: ["Otevři <b>náš Discord server</b> Královské stezky (v aplikaci Discord nebo v prohlížeči).", "Open <b>our Discord server</b> Royal Trails."],
  login_2: ["Do pole pro zprávu napiš <b>lomítko /</b>, pak <b>aplikace</b> a v nabídce, která vyskočí, klikni na příkaz <b>/aplikace</b>. Odešli Enterem.<span class=\"krok-pozor\">Nestačí napsat slovo „aplikace“ jako zprávu — musí to být příkaz z nabídky. Když se nabídka neukáže, otevři kanál <b>#webové-stránky</b> a klikni na tlačítko <b>Kód pro přihlášení do hry</b>.</span>", "In the message box type <b>/</b>, then <b>aplikace</b>, and click the <b>/aplikace</b> command in the menu that pops up. Press Enter.<span class=\"krok-pozor\">Typing the word as a normal message won't work — pick the command from the menu. If no menu appears, open <b>#webové-stránky</b> and click <b>Kód pro přihlášení do hry</b>.</span>"],
  login_3: ["Bot ti odpoví zprávou, kterou <b>vidíš jen ty</b>. Je v ní kód ze 6 znaků, třeba <b>ABC123</b>. Opiš ho sem dolů. Platí 10 minut.", "The bot replies with a message <b>only you can see</b> containing a 6-character code like <b>ABC123</b>. Enter it below. Valid 10 minutes."],
  home_icon: ["Přidat ikonu hry na plochu", "Add the game icon to your home screen"],
  home_safe_login: ["Ikona jen otevře tuto stránku, nic se neinstaluje. Kód platí 10 minut a jen jednou — nikomu ho nedávej.", "The icon only opens this page, nothing gets installed. The code works once, for 10 minutes — never share it."],
  login_note: ["Hraješ se stejnou postavou jako na Discordu — co uděláš tady, uvidíš i tam.",
    "You play the same character as on Discord — whatever you do here shows up there too."],
  code: ["Kód z Discordu", "Code from Discord"],
  login: ["Přihlásit", "Log in"],
  connecting: ["Připojuji…", "Connecting…"],
  net_error: ["Nepodařilo se spojit se serverem hry. Zkus to za chvíli.", "Could not reach the game server. Try again shortly."],
  bad_reply: ["Server odpověděl nesrozumitelně.", "The server sent an unreadable reply."],
  nav_hero: ["Postava", "Hero"], nav_bag: ["Batoh", "Bag"], nav_pet: ["Mazlíček", "Companion"], nav_admin: ["Admin", "Admin"], nav_denik: ["Deník", "Journal"], nav_market: ["Trh", "Market"],
  nav_inn: ["Hostinec", "Inn"], nav_more: ["Ostatní", "More"],
  coins: ["{0} gr.", "{0} gr."], level: ["Úr. {0}", "Lvl {0}"], level_long: ["Úroveň {0}", "Level {0}"],
  xp: ["Zkušenosti", "Experience"], health: ["Životy", "Health"], satiety: ["Hlad", "Hunger"],
  hydration: ["Žízeň", "Thirst"], rest: ["Odpočatost", "Rest"], needs: ["Stav postavy", "Condition"],
  attributes: ["Vlastnosti", "Attributes"],
  unspent: ["Volné body k přidělení: {0} — přiděl je v Postavě u Vlastností (tlačítko +).", "Unspent points: {0} — assign them under Attributes (+)."],
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
// r27-6: zbývající čas — týdny, pak dny, hodiny a minuty (vždy jen ty, které dávají smysl)
function odpocet(ts) {
  let m = Math.max(0, Math.round((ts * 1000 - Date.now()) / 60000));
  const t = Math.floor(m / 10080); m -= t * 10080; const d = Math.floor(m / 1440); m -= d * 1440; const h = Math.floor(m / 60); m -= h * 60;
  const cs = S.lang !== "en", p = [];
  if (t) p.push(t + (cs ? " týd." : " wk")); if (d) p.push(d + (cs ? " d." : " d")); if (h) p.push(h + " h"); if (m) p.push(m + " min");
  return p.join(" ") || (cs ? "méně než minuta" : "under a minute");
}
const icon = (id) => `<img class="icon malovana" alt="" data-item="${esc(id)}" src="${IMG_BASE}predmety/ikony/${Postava.slug(id)}.webp">`;
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
  const pl = $("#plocha-chk-login");
  if (pl && pl.checked && !$("#plocha-login").hidden) nabidniPlochu();    // r27-5: ještě v rámci kliknutí
  btn.disabled = true; $("#login-msg").textContent = t("connecting");
  try {
    const res = await call("link", { code }, true);
    S.token = res.token; store.set("token", res.token);
    $("#code").value = ""; $("#login-msg").textContent = "";
    enterGame();
  } catch (e) {
    $("#login-msg").textContent = e.message;
    { const d = $("#login-discord"); if (d && $("#login-discord-a").getAttribute("href") !== "#") { d.hidden = false; d.classList.add("zvyrazni"); } }   // r27-6: nerozpoznaný → náš Discord
  } finally { btn.disabled = false; }
});
{ // r27-6: přihlášení heslem jen pro správce — ukáže se na adrese …/?spravce (a pak už na tom zařízení zůstane)
  const sp = /[?&#]spravce\b/.test(location.search + location.hash);
  try { if (sp) localStorage.setItem("ks_spravce", "1"); } catch {}
  let zn = sp; try { zn = zn || localStorage.getItem("ks_spravce") === "1"; } catch {}
  $("#login-heslo").hidden = !zn;
}
$("#login-pw").addEventListener("submit", async (ev) => {   // r27-6: přihlášení jménem a heslem
  ev.preventDefault();
  const btn = ev.submitter || $("#login-pw button"); btn.disabled = true; $("#pw-msg").textContent = t("connecting");
  try {
    const res = await call("login_pw", { name: $("#pw-name").value.trim(), password: $("#pw-pass").value }, true);
    $("#pw-pass").value = ""; S.token = res.token; store.set("token", res.token); $("#pw-msg").textContent = ""; enterGame();
  } catch (e) { $("#pw-msg").textContent = e.message; $("#pw-pass").value = ""; }
  finally { btn.disabled = false; }
});
// r27-6: odkaz na náš Discord pro ty, koho hra nezná
call("status", {}, true).then((r) => { if (r && r.discord) { $("#login-discord-a").href = r.discord; $("#login-discord").hidden = false; } }).catch(() => {});
// r27-6: celá obrazovka — bez lišty prohlížeče, kurzor hry až k okrajům
const CelaObr = {
  umi: () => !!(document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen),
  je: () => !!(document.fullscreenElement || document.webkitFullscreenElement),
  prepni: async () => {
    try {
      if (CelaObr.je()) await (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      else { const el = document.documentElement; await (el.requestFullscreen ? el.requestFullscreen({ navigationUI: "hide" }) : el.webkitRequestFullscreen());
        try { if (navigator.keyboard && navigator.keyboard.lock) await navigator.keyboard.lock(["Escape"]); } catch {} }   // r27-8: Chrome pak nevysouvá lištu u horního okraje (ven podržením Esc nebo tlačítkem)
    } catch { CelaObr.nejde(); return; }
    setTimeout(() => { if (!CelaObr.je() && !matchMedia("(display-mode: fullscreen)").matches) CelaObr.nejde(); }, 700);   // r27-12: okno z Discordu požadavek tiše ignoruje
  },
  /** r27-12: v okně otevřeném z Discordu (nebo jiné aplikace) celá obrazovka nejde — nabídni cestu, která funguje. */
  nejde: () => {
    if (typeof plochaNavod !== "function") { toast(L(["Celou obrazovku tady prohlížeč nepovolil.", "Fullscreen is blocked here."])); return; }
    const el = document.createElement("div");
    el.className = "m-list plocha-navod";
    el.innerHTML = `<div class="m-list-pozadi"></div><div class="m-list-okno" role="dialog"><span class="m-list-uchyt"></span>
      <div class="pn-hlava"><img src="ikona-192.png" alt=""><div><b>${esc(L(["Celá obrazovka tady nejde", "Fullscreen isn't available here"]))}</b>
      <small>${esc(L(["Hra je otevřená v okně z Discordu (nahoře křížek a šipka) — to celou obrazovku nepovolí.", "The game is open in Discord's browser window, which blocks fullscreen."]))}</small></div></div>
      <ol class="pn-kroky"><li>${L(["Nejlepší: <b>ikona hry na ploše</b> — spustí hru na celý displej, bez lišty prohlížeče.", "Best: a <b>home screen icon</b> starts the game without the browser bar."])}</li>
      <li>${L(["Nebo vpravo nahoře klepni na <b>⋮</b> → <b>Otevřít v Chrome</b> a tam tlačítko celé obrazovky.", "Or tap <b>⋮</b> → <b>Open in Chrome</b> and use the button there."])}</li></ol>
      <button class="plocha-tl" data-pn-plocha><img src="ikona-192.png" alt=""><span><b>${esc(L(["Přidat ikonu hry na plochu", "Add the game icon"]))}</b></span></button>
      <button class="btn m-list-zavrit">${esc(L(["Zavřít", "Close"]))}</button></div>`;
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add("otevreno"));
    const zavri = () => el.remove();
    el.querySelector(".m-list-pozadi").onclick = zavri; el.querySelector(".m-list-zavrit").onclick = zavri;
    el.querySelector("[data-pn-plocha]").onclick = () => { zavri(); nabidniPlochu(); };
  },
};
{ const b = $("#tb-full");
  if (b) { b.hidden = !CelaObr.umi() || /iPhone|iPad/.test(navigator.userAgent) || matchMedia("(display-mode: standalone)").matches; b.onclick = CelaObr.prepni; }   // z ikony na ploše už hra běží bez lišty
  const zmena = () => { document.body.classList.toggle("cela", CelaObr.je()); if (b) b.title = CelaObr.je() ? L(["Ukončit celou obrazovku (F)", "Exit fullscreen (F)"]) : L(["Celá obrazovka (F)", "Fullscreen (F)"]); };
  document.addEventListener("fullscreenchange", zmena); document.addEventListener("webkitfullscreenchange", zmena);
  document.addEventListener("keydown", (e) => { if ((e.key === "f" || e.key === "F") && !e.ctrlKey && !e.metaKey && !e.altKey && !/INPUT|TEXTAREA|SELECT/.test((e.target || {}).tagName || "") && !e.target.isContentEditable && !document.querySelector(".mh")) CelaObr.prepni(); });
}
$("#code").addEventListener("input", (e) => { e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""); });
document.querySelectorAll("[data-lang]").forEach((b) => b.addEventListener("click", () => setLang(b.dataset.lang)));

// ------------------------------------------------------------------ hra
// r27-6: vlastní erb na štítu postavy — erb se vykreslí stejně jako v editoru a pole štítu se předá figuře
const ERBSTIT = { klic: "", url: "", bezi: false };
async function erbNaStit() {
  if (!S.me || !S.me.has_arms || ERBSTIT.bezi) return;
  ERBSTIT.bezi = true;
  try {
    const r = await call("erb", {}, true);
    const klic = JSON.stringify(r.design);
    if (klic !== ERBSTIT.klic) {
      const cv = document.createElement("canvas");
      if (await erbKresli(cv, { ...r, d: r.design }, true)) {
        const A = await erbPodklad(), [bx, by, bw, bh] = A.box;
        const c = document.createElement("canvas"); c.width = bw; c.height = bh;
        c.getContext("2d").drawImage(cv, bx, by, bw, bh, 0, 0, bw, bh);
        ERBSTIT.url = c.toDataURL("image/png"); ERBSTIT.klic = klic;
      }
    }
    if (ERBSTIT.url && S.me.erbStit !== ERBSTIT.url) { S.me.erbStit = ERBSTIT.url; if (S.tab === "hero") render(); }
  } catch { /* bez erbu */ } finally { ERBSTIT.bezi = false; }
}

// r27-16: herní hodiny nahoře běží samy (1 h reálně = 6 h ve hře); datum, doba dne a počasí se doptají serveru každou minutu
const HODINY = { min: null, t: 0, rychlost: 6 };
setInterval(() => {
  const el = document.querySelector("#tb-clock .tb-hod");
  if (!el || HODINY.min == null || document.visibilityState !== "visible") return;
  const m = Math.floor(HODINY.min + (Date.now() - HODINY.t) / 60000 * HODINY.rychlost) % 1440;
  el.textContent = String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0");
}, 5000);
setInterval(async () => {
  if (!S.token || !S.me || !S.me.has_character || document.visibilityState !== "visible") return;
  try {
    const r = await call("cas", {}, true);
    if (r.speed) HODINY.rychlost = r.speed;
    const zmena = (S.me.kalendar || {}).doba !== r.kalendar.doba || S.me.weather !== r.weather || S.me.night !== r.night;
    S.me.kalendar = { ...(S.me.kalendar || {}), ...r.kalendar }; S.me.weather = r.weather; S.me.night = r.night;
    const K = S.me.kalendar;
    $("#tb-clock").innerHTML = `<b class="tb-hod">${esc(K.hodina)}</b> <span class="tb-doba">${esc(K.doba)}</span><span class="tb-datum">${esc(K.text)} · ${esc(K.season)}</span>`;
    const [hh, mm] = K.hodina.split(":").map(Number); HODINY.min = hh * 60 + mm; HODINY.t = Date.now();
    const sky = $("#tb-sky");
    if (sky && zmena) sky.textContent = (r.night && r.weather === "jasno" ? "🌙" : SKY[r.weather] || "") + " " + (S.lang === "en" || S.lang === "pl" ? SKY_EN[r.weather] || r.weather : r.weather);
    if (zmena && typeof Scena !== "undefined") Scena.setWorld(S.me);   // noc / den, déšť v obrázcích
  } catch { /* nic */ }
}, 60000);

function setMe(me) {
  if (me && me.has_arms && ERBSTIT.url) me.erbStit = ERBSTIT.url;   // r27-6: erb na štítu zůstane i po obnově profilu
  S.me = me;
  if (me && me.has_arms && !ERBSTIT.url) setTimeout(erbNaStit, 300);
  S.card = null;                                   // karta se překreslí při dalším zobrazení postavy
  const has = me && me.has_character;
  $("#tb-name").textContent = has ? me.name : "";
  $("#tb-level").textContent = has ? t("level", me.level) : "";
  $("#tb-coins").textContent = has ? "🪙 " + t("coins", me.coins) : "";
  const K = me && me.kalendar;   // r27-6: kalendář Léta Páně a roční období nahoře vpravo
  $("#tb-clock").innerHTML = has ? (K ? `<b class="tb-hod">${esc(K.hodina)}</b> <span class="tb-doba">${esc(K.doba)}</span><span class="tb-datum">${esc(K.text)} · ${esc(K.season)}</span>` : esc(me.clock || "")) : "";
  if (K && K.hodina) { const [hh, mm] = K.hodina.split(":").map(Number); HODINY.min = hh * 60 + mm; HODINY.t = Date.now(); }
  { const ceka = (me && me.profil && me.profil.ceka) || [], tb = document.querySelector('.tabs [data-tab="hero"]');   // r27-17: čeká volba schopnosti
    if (tb) tb.classList.toggle("ma-volbu", ceka.length > 0 || !!(me && me.unspent));
    if (ceka.length && !S._cekaHlaseno) { S._cekaHlaseno = true; setTimeout(() => toast(L([`Můžeš si vybrat schopnost (úroveň ${ceka.join(", ")}) — Postava → Schopnosti.`, "You can choose an ability — Hero → Abilities."])), 1500); } }
  if (me && me.profil && me.profil.rekap && !me.on_raid) ukazRekap(me.profil.rekap);   // r27-22: pergamen po návratu z výpravy
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
  // r27-6: pečeť jede po zastávkách — dojede na bod, chvilku postojí (zastávka se rozsvítí) a jede dál; do cíle až po načtení
  let p = 0, stanice = 0;
  const BODY = [0, 33.3, 66.7, 100];
  const kresli = () => {
    linka.style.width = znak.style.left = p + "%"; proc.textContent = Math.round(p) + " %"; stav.textContent = kroky[Math.min(stanice, 3)];
    zast.forEach((z, i) => z.classList.toggle("on", i <= stanice));
  };
  const jed = (od, kam, ms) => new Promise((ok) => {
    const t0 = performance.now();
    const krok = (t) => { const x = Math.min(1, (t - t0) / ms), e = x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;   // rozjezd a dojezd
      p = od + (kam - od) * e; kresli(); x < 1 ? requestAnimationFrame(krok) : ok(); };
    requestAnimationFrame(krok);
  });
  const stuj = (ms) => new Promise((ok) => setTimeout(ok, ms));
  zast.forEach((z, i) => { z.style.left = BODY[i] + "%"; });   // zastávky přesně tam, kde pečeť staví
  box.classList.add("n-body");
  kresli();
  let nacteno = false;
  const hotovo = Promise.all([uloha, mapa]).catch(() => {}).then(() => { nacteno = true; });
  try {
    await stuj(250);
    for (let i = 1; i < BODY.length; i++) {
      if (i === BODY.length - 1 && !nacteno) { znak.classList.add("ceka"); await hotovo; znak.classList.remove("ceka"); }   // poslední úsek až je načteno
      await jed(BODY[i - 1], BODY[i], 620);
      stanice = i; kresli();
      znak.classList.remove("dojel"); void znak.offsetWidth; znak.classList.add("dojel");     // malé „ťuknutí“ pečeti na zastávce
      await stuj(i === BODY.length - 1 ? 450 : 380);
    }
  } finally {
    await hotovo;
    p = 100; stanice = 3; kresli();
    box.classList.add("pryc"); setTimeout(() => { box.hidden = true; }, 600);
  }
}
async function enterGame() {
  $("#login").hidden = true;
  let ok = true;
  await nacitani(call("me").catch(() => { ok = !!S.token; }));
  if (!ok) return;
  $("#game").hidden = false;
  { const zkus = (n) => call("admin_check", {}, true).then((r) => { const b = document.querySelector('[data-tab="admin"]'); if (b) b.hidden = !r.admin; if (!r.admin && n) setTimeout(() => zkus(n - 1), 4000); })
      .catch(() => { if (n) setTimeout(() => zkus(n - 1), 4000); });
    zkus(1); }   // r27-4: jen pro správce; r27-6: při chybě nebo pomalém Discordu zkusí ještě jednou
  { const z = store.get("tab") || "mesto"; go(z === "admin" || z.startsWith("panel/=") ? "mesto" : z); }   // r27-5: po načtení nic samo nemačkat
}

const TAB_OF = { mesto: "mesto", misto: "mesto", obchod: "mesto", hra: "mesto", vyprava: "mesto", statek: "mesto", panel: "mesto", povoz: "mesto", domov: "mesto", kohouti: "mesto", hraci: "mesto", aukce: "mesto", souboje: "mesto", hrbitov: "mesto", vydaje: "mesto", obyvatele: "mesto", dar: "mesto", poradi: "mesto", kroniky: "mesto", truhla: "mesto", napoje: "mesto", zverinec: "mesto", dilna: "mesto", erb: "mesto", hero: "hero", bag: "bag", more: "more", pet: "pet", denik: "denik", admin: "admin", prirucka: "more", novy: "novy" };

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

// r27-6: tvorba postavy na webu — stejná pravidla jako v #úvod; postava se zapíše pod Discord účet a ukáže se i na Discordu
const ZAL = { info: null, d: null, krok: 0 };
async function zalozitPostavu(view) {
  if (!ZAL.info) {
    view.innerHTML = `<div class="panel empty">…</div>`;
    try { ZAL.info = await call("zalozit_info", {}, true); } catch (e) { view.innerHTML = `<div class="panel notice">${esc(e.message || "")}</div>`; return; }
    const V = ZAL.info.vzhled;
    ZAL.d = { "jméno": "", "původ": "", body: {}, ...Object.fromEntries(Object.entries(V).map(([k, o]) => [k, o.includes("Normální") ? "Normální" : k === "vousy" ? "Bez vousů" : k === "vlasy" ? "Krátké" : k.startsWith("barva") ? "Hnědá" : o[0]])) };
  }
  const I = ZAL.info, d = ZAL.d, V = I.vzhled;
  const P = I.puvody.find((p) => p.key === d["původ"]);
  const volne = I.volne - Object.values(d.body).reduce((a, b) => a + b, 0);
  const kroky = [L(["Původ", "Origin"]), L(["Vzhled", "Looks"]), L(["Vlastnosti a jméno", "Attributes and name"])];
  const volba = (k) => `<div class="zl-volba"><span>${esc(k.charAt(0).toUpperCase() + k.slice(1))}</span><div>${V[k].filter((o) => !(k === "vousy" && d["pohlaví"] === "Žena") && !(k === "barva vousů" && (d["pohlaví"] === "Žena" || d.vousy === "Bez vousů")) && !(k === "barva vlasů" && d.vlasy === "Bez vlasů"))
      .map((o) => `<button class="chip${d[k] === o ? " on" : ""}" data-v="${esc(k)}" data-o="${esc(o)}">${esc(o)}</button>`).join("")}</div>
      ${(I.ucinky[k] || {})[d[k]] ? `<small>${esc(I.ucinky[k][d[k]])}</small>` : ""}</div>`;
  let obsah = "";
  if (ZAL.krok === 0) obsah = `<div class="zl-puvody">${I.puvody.map((p) => `<button class="zl-puvod${d["původ"] === p.key ? " on" : ""}" data-puvod="${p.key}">
      <b>${esc(p.name)}</b><span class="zl-role">${esc(noEmoji(p.role))}</span><small>${esc(noEmoji(p.pasiv))}</small>
      <span class="zl-st">${Object.entries(p.stats).map(([n, v]) => `<i title="${esc(n)}">${esc(n.slice(0, 3))} <b>${v}</b></i>`).join("")}</span></button>`).join("")}</div>
    ${P ? `<div class="panel zl-detail"><h3>${esc(P.name)} — ${esc(L(["schopnosti", "abilities"]))}</h3><ul>${P.schop.map((s) => `<li><b>${esc(s.name)}</b> <small>(${esc(L(["úr. ", "lvl "]) + s.lvl)})</small> — ${esc(s.desc)}</li>`).join("")}</ul></div>` : ""}`;
  else if (ZAL.krok === 1) obsah = Object.keys(V).filter((k) => !(k === "vousy" && d["pohlaví"] === "Žena") && !(k === "barva vousů" && (d["pohlaví"] === "Žena" || d.vousy === "Bez vousů")) && !(k === "barva vlasů" && d.vlasy === "Bez vlasů")).map(volba).join("");
  else obsah = `<label class="lbl">${esc(L(["Jméno postavy", "Character name"]))}</label><input id="zl-jmeno" maxlength="32" value="${esc(d["jméno"])}" placeholder="${esc(L(["např. Hanuš z Ratají", "e.g. Hanuš of Rataje"]))}">
      <p class="muted small">${esc(L([`Rozděl ${I.volne} volný bod (nejvýš ${I.max} na začátku). Zbývá: ${volne}.`, `Assign ${I.volne} free point. Left: ${volne}.`]))}</p>
      <div class="zl-staty">${Object.entries(P ? P.stats : {}).map(([n, v]) => { const b = d.body[n] || 0;
        return `<div class="zl-stat"><span>${esc(n)}</span><b>${v + b}</b><button class="btn small" data-plus="${esc(n)}"${volne <= 0 || v + b >= I.max ? " disabled" : ""}>+</button><button class="btn small" data-minus="${esc(n)}"${b ? "" : " disabled"}>−</button></div>`; }).join("")}</div>`;
  const lze = ZAL.krok === 0 ? !!P : ZAL.krok === 1 ? true : d["jméno"].trim().length >= 2 && volne === 0;
  view.replaceChildren(h(`<div class="zalozit">
    <div class="panel zl-hlava"><h2>${esc(L(["Nový dobrodruh", "A new adventurer"]))}</h2><p class="muted">${esc(L(["Tvůj Discord účet zatím nemá postavu. Vytvoř si ji tady — bude stejná na webu i na Discordu.", "Create your character here — it will be the same on Discord."]))}</p>
      <ol class="zl-kroky">${kroky.map((k, i) => `<li class="${i === ZAL.krok ? "on" : i < ZAL.krok ? "hotovo" : ""}">${i + 1}. ${esc(k)}</li>`).join("")}</ol></div>
    <div class="zl-telo"><div class="zl-fig hero-fig">${Postava.html({ looks: d, equipped: [{ slot: "oděv", id: d["pohlaví"] === "Žena" ? "Lněná košilka" : "Lněná košile" }], gear: {} }, IMG_BASE)}</div>
      <div class="panel zl-obsah">${obsah}
        <div class="row zl-nav">${ZAL.krok ? `<button class="btn" id="zl-zpet">← ${esc(L(["Zpět", "Back"]))}</button>` : "<span></span>"}
          <button class="btn primary" id="zl-dal"${lze ? "" : " disabled"}>${esc(ZAL.krok < 2 ? L(["Dál", "Next"]) + " →" : L(["Vytvořit postavu", "Create character"]))}</button></div>
        <p id="zl-chyba" class="msg"></p></div></div></div>`));
  const znovu = () => zalozitPostavu(view);
  view.querySelectorAll("[data-puvod]").forEach((b) => b.onclick = () => { d["původ"] = b.dataset.puvod; d.body = {}; znovu(); });
  view.querySelectorAll("[data-v]").forEach((b) => b.onclick = () => { d[b.dataset.v] = b.dataset.o; if (d["pohlaví"] === "Žena") d.vousy = "Bez vousů"; znovu(); });
  view.querySelectorAll("[data-plus]").forEach((b) => b.onclick = () => { d.body[b.dataset.plus] = (d.body[b.dataset.plus] || 0) + 1; znovu(); });
  view.querySelectorAll("[data-minus]").forEach((b) => b.onclick = () => { d.body[b.dataset.minus] -= 1; if (!d.body[b.dataset.minus]) delete d.body[b.dataset.minus]; znovu(); });
  const jm = $("#zl-jmeno"); if (jm) jm.oninput = () => { d["jméno"] = jm.value; $("#zl-dal").disabled = !(jm.value.trim().length >= 2 && volne === 0); };
  const zp = $("#zl-zpet"); if (zp) zp.onclick = () => { ZAL.krok--; znovu(); };
  $("#zl-dal").onclick = async (e) => {
    if (ZAL.krok < 2) { ZAL.krok++; znovu(); return; }
    e.target.disabled = true;
    try { const r = await call("zalozit", { draft: d }); ZAL.info = null; Zvuk.sfx("zvon"); setMe(r.me); go("hero"); }
    catch (ex) { $("#zl-chyba").textContent = ex.message || ""; e.target.disabled = false; }
  };
}

function render() {
  if (typeof zavriList === "function") zavriList();
  document.documentElement.classList.remove("bez-menu");   // r27-12: spodní menu se skryje jen na probíhající výpravě
  const view = $("#view");
  if (!S.me) { view.innerHTML = ""; return; }
  { const nb = document.querySelector('[data-tab="novy"]'); if (nb) nb.hidden = !!S.me.has_character;   // r27-6: záložka jen bez postavy
    document.querySelectorAll('.tabs button[data-tab]:not([data-tab="novy"]):not([data-tab="more"]):not([data-tab="admin"])').forEach((b) => { b.hidden = !S.me.has_character; }); }
  if (S.me.has_character && S.tab === "novy") { go("mesto"); return; }
  if (!S.me.has_character && S.tab !== "more" && S.tab !== "admin") {
    if (S.tab !== "novy") { S.tab = "novy"; document.querySelectorAll(".tabs button[data-tab]").forEach((b) => b.classList.toggle("on", b.dataset.tab === "novy")); }
    zalozitPostavu(view); return; }   // r27-6: postavu si založíš přímo na webu
  document.body.classList.toggle("zkusebni", !!S.me.zkusebni);
  if ((S.me.pet_umrti || []).length) { const mrtva = S.me.pet_umrti; S.me.pet_umrti = []; setTimeout(() => alert(L(["Smutná zpráva z domova:\n\n", "Sad news:\n\n"]) + mrtva.map((x) => "🕯️ " + (String(x).includes(" — ") ? x : x + L([" — zemřelo hladem a bez péče.", " — died of neglect."]))).join("\n") + L(["\n\nNajdeš ho na hřbitově zvířátek.", "\n\nSee the pet cemetery."])), 300); }   // r27-14: vždy s důvodem   // r27-6: zkušební režim správce — výrazný pruh nahoře
  view.dataset.tab = S.tab; view.classList.toggle("kniha", ["hero", "bag", "more", "pet", "denik"].includes(S.tab));   // příručka má vlastní knihu                         // r27-4: vzhled podle záložky (Noc nad městem / Kronika)
  view.classList.toggle("wide", ["mesto", "misto", "obchod", "hra", "vyprava", "panel", "domov", "kohouti", "statek", "hraci", "aukce", "souboje", "hrbitov"].includes(S.tab));
  view.classList.toggle("rozdel", ["misto", "panel", "obchod", "truhla", "napoje", "vydaje", "obyvatele", "dar", "poradi", "zverinec", "dilna", "erb", "povoz", "vyhlasky", "hrbitov", "kroniky", "domov"].includes(S.tab));   // r27-12: na PC obraz vlevo, volby vpravo — bez scrollování
  const stejna = S._lastRoute === S.tab + "/" + (S.arg || ""), y = window.scrollY;   // r27-11: po akci zůstaň, kde jsi byl
  S._lastRoute = S.tab + "/" + (S.arg || "");
  if (stejna && y > 0) view.style.minHeight = view.offsetHeight + "px";
  const r = VIEWS[S.tab](view);
  const vrat = () => { if (stejna && y > 0) { window.scrollTo(0, y); requestAnimationFrame(() => window.scrollTo(0, y)); } view.style.minHeight = ""; };
  if (r && r.then) r.then(() => setTimeout(vrat, 30)); else vrat();
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
VIEWS.novy = (view) => { if (S.me && S.me.has_character) { go("mesto"); return; } zalozitPostavu(view); };

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
  // r27-19: s postavou až dva mazlíčci — zvíře na zemi (vedle nohou / velké vpravo) a pták na rameni
  const petsS = [P.pet, P.pet2].filter(Boolean);
  const pet = petsS.map((pp) => { const sl = ZVIRE_SLUG[pp.kind] || Postava.slug(pp.kind), poz = PET_POZ[sl] || PET_POZ.pes;
    if (poz.typ === "ptak") return "";
    const vel = [0.74, 0.87, 1, 1.04][pp.stage] || 1, h = poz.h * vel, y = 4 - poz.pod * h;
    return `<figure class="hero-pet pet-${poz.typ}${poz.za ? " za" : ""}${pp.hungry ? " hlad" : ""}" style="--h:${h.toFixed(1)};--y:${y.toFixed(1)};--x:${poz.x}">`
      + IMG("bytosti/zvire-" + sl + "-" + pp.stage) + `</figure>`; }).join("");
  // pták na rameni — sova a sokol na levém rameni (z pohledu postavy, hledí k hlavě), havran na pravém; bidýlko pod nohama skryté
  const ptak = petsS.map((pp) => { const sl = ZVIRE_SLUG[pp.kind] || Postava.slug(pp.kind), poz = PET_POZ[sl];
    if (!poz || poz.typ !== "ptak") return "";
    const vel = [0.74, 0.87, 1, 1.04][pp.stage] || 1, h = poz.h * vel, w = h * 2 / 3;
    const eqs = new Set((m.equipped || []).map((e) => e.slot + ":" + e.id));
    const ramenoVys = [...eqs].some((s) => s.startsWith("plášť:") || s === "zbroj:Zbroj z medvědí kůže");   // plášť a kožich zvednou rameno
    const sed = poz.strana === "leve" && !ramenoVys ? poz.sed + 2 : poz.sed;
    return `<figure class="hero-pet pet-ptak na-rameni-${poz.strana}${pp.hungry ? " hlad" : ""}" style="--h:${h.toFixed(1)};--w:${w.toFixed(1)};--cx:${poz.cx};--sed:${sed};--orez:${poz.orez}">`
      + IMG("bytosti/zvire-" + sl + "-" + pp.stage) + `</figure>`; }).join("");
  // (r27-12: velikost podle skutečné výšky zvířete vůči postavě, místo podle druhu: zem vlevo / pták u ramene / velké zvíře za postavou vpravo)   // jen pro efekt; podrobnosti má záložka Mazlíček
  const ZN = (d) => `<svg viewBox="-12 -12 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const ZNAKY = {
    mec: ZN(`<path d="M-7 7 L6 -6 M3 -7 L7 -7 L7 -3 M-8 4 L-4 8 M-9 9 L-6 6"/>`),
    hvezda: ZN(`<path d="M0 -9 L2.6 -3 L9 -2.6 L4 1.6 L5.6 8 L0 4.6 L-5.6 8 L-4 1.6 L-9 -2.6 L-2.6 -3 Z"/>`),
    panev: ZN(`<circle cx="-2" cy="1" r="6"/><path d="M4 -3 L10 -8"/>`),
    prut: ZN(`<path d="M-9 9 L7 -9 M7 -9 C9 -2 6 4 4 7"/><circle cx="4" cy="8" r="1.4"/>`),
    zamek: ZN(`<rect x="-7" y="-1" width="14" height="10" rx="2"/><path d="M-4 -1 V-5 A4 4 0 0 1 4 -5"/>`),
    kladivo: ZN(`<path d="M-8 -6 L0 -6 L0 -2 L-8 -2 Z M-4 -2 L6 8"/>`),
    luk: ZN(`<path d="M-4 -10 C6 -6 6 6 -4 10 M-4 -10 L-4 10 M-9 0 L8 0 M5 -3 L8 0 L5 3"/>`),
    banka: ZN(`<path d="M-5 -9 H5 L3 -4 H-3 Z M-3 -4 C-8 0 -8 9 0 9 C8 9 8 0 3 -4"/>`),
    klas: ZN(`<path d="M0 10 V-9 M0 -6 L-4 -9 M0 -6 L4 -9 M0 -1 L-4 -4 M0 -1 L4 -4 M0 4 L-4 1 M0 4 L4 1"/>`),
    klic: ZN(`<circle cx="-4" cy="-4" r="4"/><path d="M-1 -1 L8 8 M5 5 L7 3 M3 3 L5 1"/>`),
  };
  // r27-6: schopnosti — na první pohled, jestli je stálá, nebo na použití, a co dělá
  // r27-17: strom schopností — na úrovních 4, 8, 12, 18 a 24 volba jedné ze tří (napořád)
  const karta = (a, lvl, stav) => { const akt = !a.stala;
    return `<li class="schop-karta ${akt ? "aktivni" : "stala"}${stav === "zamceno" ? " zamceno" : ""}${stav === "vybrano" ? " vybrano" : ""}${stav === "nevybrano" ? " nevybrano" : ""}">
      <div class="sk-ikona" aria-hidden="true">${akt ? ZNAKY.mec : ZNAKY.hvezda}</div>
      <div class="sk-telo"><div class="sk-hl"><b>${esc(a.name)}</b><span class="sk-druh">${esc(akt ? L(["Na použití", "Active"]) : L(["Stálá", "Passive"]))}</span></div>
        <p>${esc((a.desc || "").charAt(0).toUpperCase() + (a.desc || "").slice(1))}</p>
        <div class="sk-cena">${akt ? `<span>⚡ ${a.cost} ${esc(L(["výdrže", "stamina"]))}</span>${a.per ? `<span>${a.per}× ${esc(L(["za boj", "per fight"]))}</span>` : ""}` : `<span>${esc(L(["působí pořád", "always on"]))}</span>`}
          ${stav === "volba" ? `<button class="btn small primary sk-vybrat" data-vyber-lvl="${lvl}" data-vyber-key="${esc(a.key)}" data-vyber-jm="${esc(a.name)}">${esc(L(["Vybrat", "Choose"]))}</button>` : ""}</div></div></li>`; };
  const strom = (P.strom || []).map((u) => {
    const volba = u.dosazeno && !u.pevna && !u.potvrzeno;
    const hl = u.pevna ? L(["Úroveň 1 · základ původu", "Level 1"]) : L(["Úroveň ", "Level "]) + u.lvl + (volba ? L([" · vyber si jednu", " · choose one"]) : u.dosazeno ? "" : L([" · zatím zamčeno", " · locked"]));
    const pozn = volba && u.vybrano ? `<p class="sk-pozn">${esc(L(["Teď máš předvybranou: ", "Pre-selected: "]) + (u.moznosti.find((x) => x.key === u.vybrano) || {}).name + L([". Vyber si jednu — volba platí napořád.", ". Choose one — it's permanent."]))}</p>`
      : volba ? `<p class="sk-pozn">${esc(L(["Vyber si jednu — volba platí napořád.", "Choose one — permanent."]))}</p>` : "";
    const ukaz = u.potvrzeno || u.pevna ? u.moznosti.filter((x) => x.key === u.vybrano) : u.moznosti;
    return `<div class="sk-uroven${volba ? " ceka" : ""}${u.dosazeno ? "" : " budouci"}"><div class="sk-uroven-hl"><b>${esc(hl)}</b>${u.potvrzeno && !u.pevna ? `<small>${esc(L(["vybráno napořád", "chosen"]))}</small>` : ""}</div>${pozn}
      <ul class="schopnosti">${ukaz.map((a) => karta(a, u.lvl, volba ? "volba" : !u.dosazeno ? "zamceno" : "vybrano")).join("")}</ul></div>`;
  }).join("");
  const schop = (P.abilities || []).map((a) => { const akt = !!a.cost;
    return `<li class="schop-karta ${akt ? "aktivni" : "stala"}${a.known ? "" : " zamceno"}">
      <div class="sk-ikona" aria-hidden="true">${akt ? ZNAKY.mec : ZNAKY.hvezda}</div>
      <div class="sk-telo"><div class="sk-hl"><b>${esc(a.name)}</b><span class="sk-druh">${esc(akt ? L(["Na použití", "Active"]) : L(["Stálá", "Passive"]))}</span></div>
        <p>${esc(a.desc)}</p>
        <div class="sk-cena">${a.known ? (akt ? `<span>⚡ ${a.cost} ${esc(L(["výdrže", "stamina"]))}</span>${a.per ? `<span>${a.per}× ${esc(L(["za boj", "per fight"]))}</span>` : ""}` : `<span>${esc(L(["působí pořád", "always on"]))}</span>`)
          : `<span class="sk-zamek">🔒 ${esc(L(["od úrovně ", "from level "]) + a.lvl)}</span>`}</div></div></li>`; }).join("");
  // r27-6: dovednosti — karta s ikonou, kruh úrovně a praxe do dalšího bodu
  const DOV_IK = { "Vaření": "panev", "Rybaření": "prut", "Páčení zámků": "zamek", "Kovářství": "kladivo", "Střelmistrovství": "luk", "Lékárnictví": "banka", "Hospodaření": "klas", "Zlodějina": "klic" };
  const dov = (P.skills || []).map((k) => { const zam = k.craft && !k.has, pr = k.need ? Math.min(100, 100 * k.xp / k.need) : 100;
    return `<div class="dov-karta${zam ? " zamceno" : ""}" style="--p:${(100 * k.lvl / Math.max(1, k.max)).toFixed(1)}">
      <div class="dv-kruh"><span>${ZNAKY[DOV_IK[k.name]] || (k.craft ? ZNAKY.kladivo : ZNAKY.hvezda)}</span></div>
      <div class="dv-telo"><div class="dv-hl"><b>${esc(k.name)}</b><span class="dv-lvl">${esc(k.lvl)}<small>/${esc(k.max)}</small></span></div>
        <div class="dv-body">${Array.from({ length: k.max }, (_, i) => `<i class="${i < k.lvl ? "on" : ""}"></i>`).join("")}</div>
        <div class="dv-praxe"><i style="width:${pr.toFixed(1)}%"></i></div>
        <small class="dv-pozn">${esc(zam ? L(["Řemeslo z podniku — až s vlastním podnikem.", "Needs your own business."]) : (k.what ? k.what + " · " : "") + L(["praxe ", "practice "]) + k.xp + " / " + k.need + (k.craft ? L([" · řemeslo z podniku", " · craft"]) : ""))}</small></div></div>`; }).join("");
  const U = P.ucinky || [];
  const ucinky = U.length ? ["bonus", "postih"].map((kind) => {
      const z = U.filter((x) => x.kind === kind); if (!z.length) return "";
      return `<div class="uc-sk ${kind}"><small>${esc(kind === "bonus" ? L(["Bonusy", "Bonuses"]) : L(["Postihy", "Penalties"]))}</small>${z.map((x) => `<div class="ucinek ${kind}">
        <span class="uc-znak">${kind === "bonus" ? "+" : "−"}</span><div><b>${esc(x.name)}</b><p>${esc(noEmoji(x.text))}</p>${x.src ? `<small>${esc(x.src)}</small>` : ""}</div></div>`).join("")}</div>`;
    }).join("") : `<div class="empty">${esc(L(["Na postavu teď nic zvláštního nepůsobí. Požehnání v chrámu, odvary nebo mazlíček přidají bonusy; hlad, únava a zima ubírají.", "Nothing special affects you now."]))}</div>`;
  const HK = [["stav", L(["Postava", "Character"])],   // r27-5: záložka „Postava“ (dřív Stav a boj) — tělo, boj a pod Do boje i vlastnosti
    ["schop", L(["Schopnosti", "Abilities"]) + ((P.ceka || []).length ? ` <i class="hk-pocet">${P.ceka.length}</i>` : "")],   // r27-17: čeká volba ["dov", L(["Dovednosti", "Skills"])], ["cesta", L(["Cesta", "Path"])],
    ["uc", L(["Účinky", "Effects"]) + (U.length ? ` <i class="hk-pocet${U.some((x) => x.kind === "postih") ? " zle" : ""}">${U.length}</i>` : "")]];
  if (!HK.some(([k]) => k === HERO.karta) && !(HERO.karta === "vzhled" && jeMobil())) HERO.karta = "stav";   // (záložka „boj“ je teď součástí „stav“)
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
      const znak = (z, val, nazev, pop) => `<button type="button" class="znak" data-vysv="${z}" title="${esc(pop)}"><div class="znak-obr">${ZNAK[z]}<b>${esc(val)}</b></div><span>${esc(nazev)}</span></button>`;   // r27-23: klepnutí = rozpis v okénku   // r27-6: popis jen v nápovědě (vejde se bez posouvání)
      const hp = Math.round(100 * m.health / Math.max(1, m.max_health));
      return `<svg width="0" height="0" style="position:absolute"><defs>
          <radialGradient id="zg1" cx="40%" cy="30%"><stop offset="0" stop-color="#f0d79a"/><stop offset=".55" stop-color="#c9a55a"/><stop offset="1" stop-color="#8a5a1c"/></radialGradient>
          <radialGradient id="zg2" cx="40%" cy="30%"><stop offset="0" stop-color="#c04a36"/><stop offset=".6" stop-color="#8e1b14"/><stop offset="1" stop-color="#5a0f0a"/></radialGradient></defs></svg>
        <div class="sb-sekce" data-vysv="potreby" title="${esc(L(["Odpočatost: čím víc, tím líp. Hlad a žízeň: čím víc, tím hůř. Odpočatost pod 25, hlad či žízeň nad 75 = postih −1. Odpočatost od 80, hlad i žízeň do 20 = plný sil +1. Přejedení a přepití dá postih, dokud neopadne.", "Body and needs"]))}"><small>${esc(L(["Tělo a potřeby", "Body and needs"]))} ⓘ</small></div>
        <div class="potreby velke">${potreby.map(([n, v, mx, c]) => `<div class="potreba ${c}" data-vysv="potreby" role="button" tabindex="0" style="--p:${Math.max(0, Math.min(100, 100 * v / mx))}"><div class="kruh"><b>${esc(v)}</b><small>/ ${esc(mx)}</small></div><span>${esc(n)}</span></div>`).join("")}</div>
        <div class="stav-ucinky">${(m.stav_ucinky || []).map((u) => `<span class="su ${u.kind}">${u.kind === "bonus" ? "+" : "−"} ${esc(u.text)}</span>`).join("") || `<span class="su nic">${esc(L(["Bez bonusů a postihů ze stavu.", "No effects from your condition."]))}</span>`}</div>
        <p class="muted hk-pozn" hidden>${esc(L(["Odpočatost: čím víc, tím líp. Hlad a žízeň: čím víc, tím hůř. Odpočatost pod 25, nebo hlad či žízeň nad 75 = −1 k útoku (odpočatost i k obraně); na 100 hladu nebo žízně (a na nule odpočatosti) ztrácíš životy. Odpočatost od 80, hlad i žízeň do 20 = plný sil, +1 k útoku a zkouškám. Kdo se přejí nebo přepije, je těžkopádný — postih, dokud to za pár hodin neopadne.", "Rest: higher is better. Hunger and thirst: higher is worse."]))}</p>
        ${OP.value || OP.nasoska ? `<p class="opilost-txt${OP.other < 0 ? " zle" : ""}">${OP.stage ? `<b>${esc(OP.stage.charAt(0).toUpperCase() + OP.stage.slice(1))}</b> · ${esc(L(["Výřečnost ", "Speech "]) + sg(OP.speech) + (OP.other ? L([" · útok a zkoušky ", " · attack & checks "]) + sg(OP.other) : "") + (OP.def ? L([" · obrana ", " · defence "]) + sg(OP.def) : ""))} · ${esc(L([`vyprchá o ${OP.decay} za hodinu`, `fades ${OP.decay}/hour`]))}` : ""}
          ${OP.nasoska ? `<span class="tag nasoska">${esc(L(["Násoska", "Drunkard"]))}</span> ${esc(L(["snese víc, ale střízlivému se třesou ruce (−1). Zbavíš se toho týdnem bez kapky.", "tolerates more, but shakes when sober (−1). A dry week cures it."]))}` : ""}</p>` : ""}
        ${hp < 35 ? `<p class="upozorneni ne">${esc(L(["Jsi těžce raněný — ošetři se u apatykáře, obvazem nebo noclehem.", "Badly wounded."]))}</p>` : ""}
        <div class="sb-sekce" data-vysv="boj" title="${esc(L(["Zásah = k20 + útok + zdatnost proti obraně nepřítele; 20 je kritický zásah.", "Hit = d20 + attack + proficiency vs defence."]))}"><small>${esc(L(["Do boje", "In battle"]))} ⓘ</small></div>
        <div class="znaky">
          ${znak("stit", m.armor_class, t("armor_class"), L(["čím víc, tím hůř tě zasáhnou", "harder to hit"]))}
          ${znak("mec", sg(P.attack_base ?? m.attack), t("attack"), L(["k hodu na zásah", "to hit"]))}
          ${znak("hvezda", sg(P.proficiency || 0), L(["Zdatnost", "Proficiency"]), L(["k útoku i zkouškám", "attack and checks"]))}
          ${znak("kostka", m.damage, t("damage"), L(["kostky zbraně + bonus", "weapon dice + bonus"]))}
        </div>
        <p class="muted hk-pozn" hidden>${esc(L(["Zásah = k20 + útok + zdatnost proti obraně nepřítele; 20 je kritický zásah. Hlad a žízeň pod 20 ubírají útok, únava i obranu.", "Hit = d20 + attack + proficiency vs defence."]))}</p>
        <div class="sb-sekce" data-vysv="vl" title="${esc(L(["Každé 2 body ve vlastnosti = +1 k hodům. Za každou novou úroveň dostaneš 1 bod; strop roste s úrovní.", "Every 2 points = +1 to rolls."]))}"><small>${esc(L(["Vlastnosti", "Attributes"]))} ⓘ</small></div>
        ${obsah.vlast()}`;
    },
    vlast: () => `${m.unspent ? `<p class="upozorneni body-volne">${esc(L([`Volné body: ${m.unspent} — klepni na + u vlastnosti, kterou chceš zvednout (strop teď ${m.stat_cap}).`, `Unspent points: ${m.unspent} — tap + on an attribute (cap ${m.stat_cap}).`]))}</p>` : ""}
      <div class="vlastnosti velke">${m.stats.map((st) => `<div class="vlastnost${st.muze ? " lze" : ""}" data-vysv="vl:${esc(st.id)}" role="button" tabindex="0"><b>${esc(st.value)}</b><span>${esc(st.name)}</span><small>${esc(L(["bonus ", "bonus "]) + sg(Math.floor(st.value / 2)))}</small>
        ${st.muze ? `<button class="vl-plus" data-bod="${esc(st.id)}" title="${esc(L(["Přidat bod", "Add a point"]))}">+</button>` : ""}</div>`).join("")}</div>`,   // r27-22: body se přidělují tady
    cesta: () => { const C = m.cesta || [], lv = m.level;
      const dalsi = C.find((c) => c.lvl > lv);
      return `<p class="muted hk-pozn">${esc(L(["Postava roste až do 30. úrovně. Každých pár úrovní se odemkne něco nového — schopnosti, výbava, majetek.", "Your character grows up to level 30."]))}</p>
        ${dalsi ? `<p class="upozorneni">${esc(L([`Další na úrovni ${dalsi.lvl}: ${dalsi.text}`, `Next at level ${dalsi.lvl}: ${dalsi.text}`]))}</p>` : ""}
        <ol class="cesta">${[...new Set(C.map((c) => c.lvl))].map((l) => `<li class="${l <= lv ? "hotovo" : l === dalsi?.lvl ? "dalsi" : ""}"><b>${l}</b><div>${C.filter((c) => c.lvl === l).map((c) => `<span class="ck ${c.kind}">${esc(c.text)}</span>`).join("")}</div></li>`).join("")}</ol>`; },
    schop: () => `${P.passive ? `<div class="hk-vlastnost"><span class="hkv-pecet" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 2l2.6 6.3 6.8.5-5.2 4.4 1.6 6.6L12 16.3 6.2 19.8l1.6-6.6L2.6 8.8l6.8-.5z"/></svg></span><div><small>${esc(L(["Speciální vlastnost původu", "Origin trait"]))}${S.me.origin_name ? " · " + esc(S.me.origin_name) : ""}</small><p>${esc(noEmoji(P.passive))}</p></div></div>` : ""}${strom || `<ul class="schopnosti">${schop}</ul>`}`,
    dov: () => `<div class="dovednosti dov-mriz">${dov}</div><p class="muted hk-pozn">${esc(L(["Bod přibude, až je praxe plná. Body 1–3 potvrdí lekce u mistra, dál rostou samy — nejvýš o bod za herní den.", "A point comes when practice is full."]))}</p>`,
    uc: () => ucinky,
  };
  const xpPct = Math.max(0, Math.min(100, m.xp_next ? 100 * m.xp / m.xp_next : 0));
  const OP = m.opilost || { value: 0 };
  const potreby = [[t("health"), m.health, m.max_health, "hp"], [t("satiety"), Math.max(0, 100 - m.satiety), 100, "food zizen"], [t("hydration"), Math.max(0, 100 - m.hydration), 100, "water zizen"], [t("rest"), m.rest, 100, "rest"],
    [L(["Opilost", "Drunkenness"]), OP.value || 0, 100, "drunk"]];
  view.replaceChildren(h(`
    ${m.on_raid ? `<div class="panel notice" style="margin-bottom:16px">🗺️ ${esc(t("on_raid"))}</div>` : ""}
    <header class="hero-hlava">
      <div class="hh-uroven" title="${esc(t("level_long", m.level))}"><small>${esc(L(["úroveň", "level"]))}</small><b>${esc(m.level)}</b></div>
      <div class="hh-jmeno"><h1>${esc(m.name)}</h1>
        <p>${esc(m.origin_name)}${P.role ? " · " + esc(noEmoji(P.role)) : ""}${P.titles && P.titles.length ? " · " + esc(P.titles.join(" · ")) : ""}</p>
        <div class="hh-zk"><i style="width:${xpPct}%"></i><span>${esc(t("xp"))} ${esc(m.xp)} / ${esc(m.xp_next)}</span></div>
        ${m.na_kutnohorsku ? `<p class="hh-pobyt">${esc(L(["Na Kutnohorsku ", "In the Kutná Hora region for "]) + m.na_kutnohorsku)}</p>` : ""}</div>
      <div class="hh-cas">${esc(m.clock)}</div>
    </header>
    ${m.unspent ? `<p class="upozorneni">${esc(L([`Volné body k přidělení: ${m.unspent} — přiděl je níž ve Vlastnostech (tlačítko +).`, `Unspent points: ${m.unspent} — assign them below.`]))}</p>` : ""}
    ${P.wanted ? `<p class="upozorneni ne">${esc(L(["Hledaný! Odměna ", "Wanted! Bounty "]) + P.wanted.bounty + L([" gr. · pokuta u rychtáře ", " gr. · fine "]) + P.wanted.fine + " gr.")}</p>` : ""}
    ${P.bills_debt ? `<p class="upozorneni">${esc(L(["Dluh na výdajích: ", "Unpaid bills: "]) + P.bills_debt + L([" gr. (Radnice → Rychtář → Výdaje)", " gr."]))}</p>` : ""}
    ${P.debt ? `<p class="upozorneni">${esc(L(["Dluh u apatykáře: ", "Apothecary debt: "]) + P.debt + " gr.")}</p>` : ""}
    <div class="hero-sheet${jeMobil() ? (HERO.karta === "vzhled" ? " m-vzhled" : " m-bez-figury") : ""}">
      <div class="hero-left">
        <div class="hero-fig live" data-img="mesto-pokoj" data-key="pokoj">${Postava.html(m, IMG_BASE, ptak)}${pet}</div>
      </div>
      <div class="panel hero-karty">
        <nav class="hk-zalozky">${(jeMobil() ? [["vzhled", L(["Vzhled", "Look"])], ...HK] : HK).map(([k, n]) => `<button class="${HERO.karta === k ? "on" : ""}" data-karta="${k}">${n}</button>`).join("")}</nav>
        <div class="hk-obsah hk-${HERO.karta}">${obsah[HERO.karta] ? obsah[HERO.karta]() : ""}</div>
      </div>
    </div>`));
  mountLive(view, { still: true });
  view.querySelectorAll("[data-karta]").forEach((b) => b.onclick = () => { HERO.karta = b.dataset.karta; render(); });
  view.querySelectorAll("[data-vysv]").forEach((el) => el.onclick = (e) => { if (e.target.closest("[data-bod]")) return; vysvetli(el.dataset.vysv, m, P); });
  view.querySelectorAll("[data-bod]").forEach((b) => b.onclick = async () => {   // r27-22: přidělení bodu na webu
    b.disabled = true;
    try { await call("pridel_bod", { attr: b.dataset.bod }); Zvuk.sfx("stranka"); toast(L(["+1 ", "+1 "]) + b.dataset.bod); render(); }
    catch { b.disabled = false; }
  });
  view.querySelectorAll("[data-vyber-lvl]").forEach((b) => b.onclick = async () => {   // r27-17: volba schopnosti
    if (!confirm(L([`Vybrat „${b.dataset.vyberJm}“ na úrovni ${b.dataset.vyberLvl}? Volba platí napořád.`, `Choose "${b.dataset.vyberJm}"? This is permanent.`]))) return;
    b.disabled = true;
    try { await call("schopnost_vybrat", { lvl: Number(b.dataset.vyberLvl), key: b.dataset.vyberKey }); Zvuk.sfx("stranka"); toast(L(["Vybráno: ", "Chosen: "]) + b.dataset.vyberJm); render(); }
    catch { b.disabled = false; }
  });
};

// r27-4: admin panel — vidí ho jen správce (ověřuje server podle Discord účtu)
// r27-6: admin — vlastní rozhraní (velín): přehled, hráči, čas a datum, počasí, události, zkušební režim, verze, hospodářství
const ADM = { sekce: "prehled" };
VIEWS.admin = async (view) => {
  view.innerHTML = `<div class="velin"><div class="panel empty">…</div></div>`;
  let r; try { r = await call("admin", { action: "stav" }); } catch { go("mesto"); return; }
  const S_ = [["prehled", "Přehled"], ["hraci", "Hráči"], ["sprava", "Správa hráče"], ["cas", "Datum a čas"], ["pocasi", "Počasí"], ["udalosti", "Události"], ["zk", "Zkušební režim"], ["spravci", "Správci"], ["verze", "Verze a nasazení"], ["hosp", "Hospodářství"]];
  const K = r.kalendar || {}, Pc = r.pocasi || {}, U = r.udalosti || {};
  const msg = (x) => toast(noEmoji(x.text || "").replace(/\*\*/g, ""));
  const obnov = async () => { await call("me").catch(() => {}); render(); };
  const sek = {
    prehled: () => `<div class="vl-dlazdice">
        ${[["Verze", r.build], ["Postavy", r.players], ["Online", (r.hraci || []).filter((x) => x.stav === "online").length], ["Výpravy", r.missions], ["Družiny čekají", r.lobbies], ["Hry a souboje", r.games], ["Přihlášení na webu", r.web], ["Hroby", r.graves]]
          .map(([n, v]) => `<div><small>${esc(n)}</small><b>${esc(v)}</b></div>`).join("")}</div>
      <div class="vl-radek"><div class="vl-box"><small>Datum</small><b>${esc(noEmoji(r.cas ? r.cas.text : ""))}</b><span>${esc(r.cas ? r.cas.obdobi : "")}</span></div>
        <div class="vl-box"><small>Počasí</small><b>${esc(Pc.ted || "")}</b><span>${Pc.vlastni ? "nastavené ručně" : "podle období"}</span></div>
        <div class="vl-box"><small>Událost</small><b>${esc((U.kategorie || []).flatMap((k) => k.e).find((e) => e.k === U.ted)?.t || "klid")}</b></div>
        <div class="vl-box${r.zkusebni ? " on" : ""}"><small>Zkušební režim</small><b>${r.zkusebni ? "zapnutý" : "vypnutý"}</b></div></div>`,
    hraci: () => `<div class="adm-hraci">${(r.hraci || []).map((x) => {
      const pred = x.ago == null ? "nikdy" : x.ago < 60 ? "teď" : x.ago < 3600 ? Math.floor(x.ago / 60) + " min" : x.ago < 86400 ? Math.floor(x.ago / 3600) + " h" : Math.floor(x.ago / 86400) + " dní";
      return `<div class="adm-hrac ${x.stav}"><i class="tecka"></i><div><b>${esc(x.name)}</b><small>${esc(x.discord + " · " + x.origin + " · úr. " + x.level + " · " + x.coins + " gr.")}</small></div>
        <span class="adm-kde">${esc(x.stav === "online" ? "online" : x.stav === "nedavno" ? "před " + pred : "offline · " + pred)}
          ${x.kde ? `<i class="adm-plat">${esc((x.stav === "online" ? "hraje: " : "naposledy: ") + x.kde)}</i>` : ""}${x.vyprava ? `<i class="adm-plat">na výpravě</i>` : ""}</span></div>`; }).join("")}</div>`,
    cas: () => `<p class="vl-ted">Teď: <b>${esc(noEmoji(r.cas ? r.cas.text : ""))}</b> · ${esc(r.cas ? r.cas.obdobi : "")}</p>
      <div class="vl-form">
        <label>Den <input type="number" id="a-den" min="1" max="31" value="${K.day || 1}"></label>
        <label>Měsíc <select id="a-mes">${(K.mesice || []).map((m, i) => `<option value="${i + 1}"${i + 1 === K.mesic_i ? " selected" : ""}>${esc(m)}</option>`).join("")}</select></label>
        <label>Rok <input type="number" id="a-rok" min="1300" max="1600" value="${K.year || 1403}"></label>
        <label>Hodina <input type="number" id="a-hod" min="0" max="23" value="${r.cas ? r.cas.hodina : 8}"></label>
        <label>Minuta <input type="number" id="a-min" min="0" max="59" value="${r.cas ? r.cas.minuta : 0}"></label>
        <button class="btn primary" id="a-datum">Nastavit datum a čas</button></div>
      <p class="muted small">Roční období se řídí měsícem (zima prosinec–únor, jaro březen–květen, léto červen–srpen, podzim září–listopad). Herní den běží dál — mění se jen datum a hodina, věk postav ani lhůty se neposunou.</p>`,
    pocasi: () => `<p class="vl-ted">Teď: <b>${esc(Pc.ted || "")}</b> ${Pc.vlastni ? "(nastavené ručně)" : "(podle ročního období)"}</p>
      <div class="vl-mriz">${(Pc.moznosti || []).map((w) => `<button class="vl-volba${w === Pc.ted ? " on" : ""}" data-pocasi="${esc(w)}">${esc(w)}</button>`).join("")}</div>
      <div class="vl-form"><label>Na kolik herních hodin <input type="number" id="a-poc-h" min="1" max="72" value="4"></label>
        <button class="btn" data-pocasi="">Vrátit počasí podle období</button></div>`,
    udalosti: () => (U.kategorie || []).map((k) => `<h4 class="vl-kat">${esc(k.n)}</h4><div class="vl-ud">${k.e.map((e) => `<button class="vl-udalost${e.k === U.ted ? " on" : ""}" data-ud="${esc(e.k)}"><b>${esc(e.t)}</b><em class="vl-sez">${esc(e.s ? e.s.join(", ") : "celý rok")}</em><small>${dmd(e.d).replace(/^<p>|<\/p>$/g, "")}</small></button>`).join("")}</div>`).join("")
      + `<div class="vl-form"><label>Délka (herní hodiny) <input type="number" id="a-ud-h" min="1" max="48" value="12"></label><button class="btn" data-ud="">Ukončit událost (klid)</button></div>
      <p class="muted small">Vyhlášení se zapíše i do kroniky na Discordu. Samy od sebe přicházejí jen události, které sedí k ročnímu období (u každé je napsáno kdy); ručně jde vyhlásit kterákoli.</p>`,
    zk: () => `<p class="muted">Hraješ za kopii své postavy bez omezení: milion grošů, úroveň 30, měšťan, pověst, vlastnosti 20, zboží bez ohledu na sklad. Nic se nepropíše do skutečné postavy ani do hospodářství. Výpravy, aukce, sázky, dary a hry s hráči jsou vypnuté.</p>
      <div class="vl-form"><label class="prepinac${r.zkusebni ? " on" : ""}"><input type="checkbox" role="switch" id="adm-zk"${r.zkusebni ? " checked" : ""}><span class="prep-draha"><i></i></span>
          <span class="prep-stav"><b>${r.zkusebni ? "Zapnuto" : "Vypnuto"}</b><small>${r.zkusebni ? "hraješ za zkušební kopii — kliknutím se vrátíš ke skutečné postavě" : "hraješ za skutečnou postavu — kliknutím zapneš zkušební režim"}</small></span></label>
        ${r.zkusebni ? `<button class="btn" id="adm-zk-znovu">Začít znovu (čerstvá kopie)</button>` : ""}</div>`,
    verze: () => `<div class="vl-form"><button class="btn" data-adm="info">Zjistit verzi na GitHubu</button>
        <button class="btn primary" data-adm="nova" data-q="Nasadit novou verzi z GitHubu a restartovat bota?">Nasadit novou verzi</button>
        <button class="btn" data-adm="restart" data-q="Restartovat bota? Hráči budou chvíli offline.">Restartovat bota</button>
        <button class="btn danger" data-adm="zpet" data-q="Vrátit předchozí verzi a restartovat?">Vrátit předchozí verzi</button></div><div id="adm-vysl" class="dtext"></div>`,
    hosp: () => { const E = r.hosp; if (!E) return `<div class="dtext adm-zprava">${dmd(r.economy || "")}</div>`;   // r27-6: přehledně
      const f = (n) => Number(n || 0).toLocaleString("cs-CZ");
      const pruhy = (rows, cls) => { const mx = Math.max(1, ...rows.map((x) => x[1])); return rows.length ? `<ul class="hs-pruhy ${cls}">${rows.map(([k, v]) =>
        `<li><span class="hs-k">${esc(k)}</span><span class="hs-p"><i style="width:${Math.max(2, 100 * v / mx)}%"></i></span><b>${f(v)}</b></li>`).join("")}</ul>` : `<p class="muted">—</p>`; };
      const sp = E.prijmy.reduce((s, x) => s + x[1], 0), sv = E.vydaje.reduce((s, x) => s + x[1], 0);
      return `<div class="hs">
        <div class="vl-radek hs-dl">
          <div class="vl-box"><small>Hrdinů</small><b>${E.hracu}</b></div>
          <div class="vl-box"><small>Groše celkem</small><b>${f(E.celkem)}</b><em>kapsy ${f(E.kapsy)} · banky ${f(E.banky)}</em></div>
          <div class="vl-box"><small>Na hrdinu</small><b>${f(E.median)}</b><em>medián · průměr ${f(E.prumer)}</em></div>
          <div class="vl-box"><small>Kasa světa</small><b>${f(E.kasa)}</b><em>vrací se nálezy a zakázkami</em></div>
          <div class="vl-box"><small>Od posl. snímku</small><b>${E.vyprav}</b><em>výprav · padlých ${E.padlych}${E.zasah != null ? " · zásah " + E.zasah + " %" : ""}</em></div></div>
        <div class="hs-sloupce">
          <section class="vl-box"><h4>Příjmy hráčů <span>${f(sp)} gr.</span></h4>${pruhy(E.prijmy, "plus")}</section>
          <section class="vl-box"><h4>Výdaje hráčů <span>${f(sv)} gr.</span></h4>${pruhy(E.vydaje, "minus")}</section></div>
        <div class="hs-sloupce">
          <section class="vl-box"><h4>Za tento týden odteklo</h4>${pruhy(E.tyden_odteklo, "minus")}</section>
          <section class="vl-box"><h4>Podle úrovní</h4><table class="hs-tab"><tr><th>Úrovně</th><th>Hráčů</th><th>Medián grošů</th></tr>
            ${E.urovne.map((u) => `<tr><td>${esc(u.pasmo)}</td><td>${u.hracu}</td><td>${f(u.median)}</td></tr>`).join("")}</table></section></div>
        <section class="vl-box"><h4>Nejbohatší (kapsa + banka)</h4><table class="hs-tab"><tr><th>#</th><th>Hrdina</th><th>Úr.</th><th>Groše</th><th>Domy a podniky</th></tr>
          ${E.nejbohatsi.map((x, i) => `<tr><td>${i + 1}.</td><td>${esc(x.name)}</td><td>${x.level}</td><td>${f(x.penize)}</td><td>${x.majetek ? f(x.majetek) : "—"}</td></tr>`).join("")}</table></section>
        <p class="muted small">Příjmy a výdaje od zavedení účetní knihy. Statistiky se každých 6 h ukládají do větve „${esc(E.vetev)}“ na GitHubu.</p></div>`; },
    sprava: () => { const P_ = r.postavy || [], vy = P_.find((p) => p.uid === ADM.hrac) || P_[0]; if (vy) ADM.hrac = vy.uid;
      return P_.length ? `<div class="vl-form"><label>Hráč <select id="a-hrac">${P_.map((p) => `<option value="${esc(p.uid)}"${p.uid === ADM.hrac ? " selected" : ""}>${esc(p.name)} · úr. ${p.level} · ${p.coins} gr.</option>`).join("")}</select></label></div>
      <div class="vl-radek">
        <div class="vl-box"><small>Groše</small><div class="vl-form"><label>Počet (záporný ubere) <input type="number" id="a-gr" value="100"></label><button class="btn primary" data-hr="penize">Připsat</button></div></div>
        <div class="vl-box"><small>Předmět</small><div class="vl-form"><label>Předmět <input id="a-it" list="a-it-l" placeholder="začni psát…"></label><datalist id="a-it-l">${(r.predmety || []).map((n) => `<option value="${esc(n)}">`).join("")}</datalist>
          <label>Kusů <input type="number" id="a-it-n" min="1" max="99" value="1"></label><button class="btn primary" data-hr="predmet">Dát</button></div></div>
        <div class="vl-box"><small>Původ</small><div class="vl-form"><label>Původ <select id="a-pv">${Object.entries(r.puvody || {}).map(([k, n]) => `<option value="${k}"${vy && vy.origin === k ? " selected" : ""}>${esc(n)}</option>`).join("")}</select></label><button class="btn primary" data-hr="puvod">Nastavit</button></div></div>
        <div class="vl-box"><small>Úroveň</small><div class="vl-form"><label>Úroveň (1–${r.max_uroven}) <input type="number" id="a-lv" min="1" max="${r.max_uroven}" value="${vy ? vy.level : 1}"></label><button class="btn primary" data-hr="uroven">Nastavit</button></div>
          <span>Při zvýšení dostane volné body a rozdělí si je sám.</span></div></div>` : `<p class="muted">Zatím žádné postavy.</p>`; },
    spravci: () => `<p class="muted">Admin panel vidí jen hlavní správce a ti, které sem přidá. Přidávat a odebírat může jen hlavní správce.</p>
      <div class="adm-hraci">${(r.spravci || []).map((s) => `<div class="adm-hrac"><div><b>${esc(s.name)}</b></div>${r.hlavni ? `<button class="btn small danger" data-spr-pryc="${esc(s.uid)}">Odebrat</button>` : ""}</div>`).join("") || `<p class="muted">Žádní další správci.</p>`}</div>
      ${r.hlavni ? `<div class="vl-form"><label>Přidat správce <select id="a-spr">${(r.postavy || []).map((p) => `<option value="${esc(p.uid)}">${esc(p.name)}</option>`).join("")}</select></label>
        <button class="btn primary" id="a-spr-ok">Přidat</button></div>` : ""}`,
  };
  view.innerHTML = `<div class="velin"><aside class="vl-menu"><div class="vl-logo"><small>Královské stezky</small><b>Velín správce</b></div>
      ${S_.map(([k, n]) => `<button class="${ADM.sekce === k ? "on" : ""}" data-sek="${k}">${esc(n)}</button>`).join("")}</aside>
    <section class="vl-obsah"><h2>${esc(S_.find(([k]) => k === ADM.sekce)[1])}</h2>${sek[ADM.sekce]()}</section></div>`;
  view.querySelectorAll("[data-sek]").forEach((b) => b.onclick = () => { ADM.sekce = b.dataset.sek; render(); });
  const zk = async (on, znovu) => { try { msg(await call("admin", { action: "zkusebni", data: { on, znovu } })); await obnov(); } catch {} };
  const z1 = $("#adm-zk"); if (z1) z1.onchange = (e) => zk(e.target.checked, false);
  const z2 = $("#adm-zk-znovu"); if (z2) z2.onclick = () => confirm("Zahodit zkušební postavu a začít s novou kopií?") && zk(true, true);
  const dt = $("#a-datum"); if (dt) dt.onclick = async () => {
    const data = { den: $("#a-den").value, mesic: $("#a-mes").value, rok: $("#a-rok").value, hodina: $("#a-hod").value, minuta: $("#a-min").value };
    if (!confirm(`Nastavit ${data.den}. ${$("#a-mes").selectedOptions[0].text} ${data.rok}, ${String(data.hodina).padStart(2, "0")}:${String(data.minuta).padStart(2, "0")}?`)) return;
    try { msg(await call("admin", { action: "datum", data })); await obnov(); } catch {}
  };
  const ah = $("#a-hrac"); if (ah) ah.onchange = () => { ADM.hrac = ah.value; render(); };
  view.querySelectorAll("[data-hr]").forEach((b) => b.onclick = async () => {
    const co = b.dataset.hr, data = { uid: $("#a-hrac").value, co };
    if (co === "penize") data.pocet = $("#a-gr").value;
    if (co === "predmet") { data.predmet = $("#a-it").value; data.pocet = $("#a-it-n").value; }
    if (co === "puvod") data.puvod = $("#a-pv").value;
    if (co === "uroven") data.uroven = $("#a-lv").value;
    if (!confirm(`Opravdu upravit hráče ${$("#a-hrac").selectedOptions[0].text.split(" · ")[0]}?`)) return;
    try { msg(await call("admin", { action: "hrac", data })); render(); } catch {}
  });
  const sp = $("#a-spr-ok"); if (sp) sp.onclick = async () => { const s = $("#a-spr"); if (!confirm(`Udělat správcem: ${s.selectedOptions[0].text}? Uvidí celý admin panel.`)) return;
    try { msg(await call("admin", { action: "admin_pridat", data: { uid: s.value } })); render(); } catch {} };
  view.querySelectorAll("[data-spr-pryc]").forEach((b) => b.onclick = async () => { try { msg(await call("admin", { action: "admin_odebrat", data: { uid: b.dataset.sprPryc } })); render(); } catch {} });
  view.querySelectorAll("[data-pocasi]").forEach((b) => b.onclick = async () => { try { msg(await call("admin", { action: "pocasi", data: { pocasi: b.dataset.pocasi, hodin: $("#a-poc-h")?.value } })); await obnov(); } catch {} });
  view.querySelectorAll("[data-ud]").forEach((b) => b.onclick = async () => { try { msg(await call("admin", { action: "udalost", data: { klic: b.dataset.ud, hodin: $("#a-ud-h")?.value } })); await obnov(); } catch {} });
  view.querySelectorAll("[data-adm]").forEach((b) => b.onclick = async () => {
    if (b.dataset.q && !confirm(b.dataset.q)) return;
    b.disabled = true;
    try { const x = await call("admin", { action: b.dataset.adm }); $("#adm-vysl").innerHTML = dmd(x.text || ""); } catch {}
    b.disabled = false;
  });
};

// r27-4: příručka hráče — kniha s kapitolami (jako příručka na serveru), hledání v textu
const PRIR = { k: 0, data: null, q: "" };
const RIMSKE = (n) => ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI"][n] || String(n + 1);
/** r27-6: text kapitoly → přehledné bloky. Řádek „ikona **Pojem** — výklad“ je karta pojmu; dlouhý výklad s „·“ se rozpadne
 *  na odrážky; „• …“ je seznam; „-# …“ poznámka; ostatní odstavec. */
function prirKrasne(text) {
  const out = []; let seznam = [];
  const inl = (s) => dmd(s).replace(/^<p>|<\/p>$/g, "");
  const flush = () => { if (!seznam.length) return;
    const ul = `<ul class="pr-seznam">${seznam.map((x) => `<li>${inl(x)}</li>`).join("")}</ul>`;
    const last = out[out.length - 1];
    if (last && last.startsWith('<div class="pr-pojem">')) out[out.length - 1] = last.replace(/<\/div><\/div>$/, ul + "</div></div>");
    else out.push(ul);
    seznam = []; };
  const ikona = (s) => { const m = /^(\p{Extended_Pictographic}[\u{FE0F}\u{200D}\p{Extended_Pictographic}]*)\s*/u.exec(s); return m ? [m[1], s.slice(m[0].length)] : ["", s]; };
  for (let line of String(text || "").split("\n")) {
    line = line.trim(); if (!line) { flush(); continue; }
    if (/^[•\-–] /.test(line)) { seznam.push(line.replace(/^[•\-–] /, "")); continue; }
    flush();
    if (/^-# /.test(line)) { out.push(`<p class="pr-pozn">${inl(noEmoji(line.slice(3)))}</p>`); continue; }
    if (/^#{1,3} /.test(line)) { out.push(`<h4 class="pr-pod">${esc(noEmoji(line.replace(/^#+ /, "").replace(/\*\*/g, "")))}</h4>`); continue; }
    const [ic, rest] = ikona(line);
    const m = /^\*\*([^*]{1,60})\*\*\s*(\([^)]{0,40}\))?\s*(?:—|–|=|:)?\s*([\s\S]*)$/.exec(rest);
    if (m && !m[3]) { out.push(`<div class="pr-pojem"><div class="pr-hl">${ic ? `<span class="pr-ic">${ic}</span>` : ""}<b>${esc(m[1].replace(/:$/, ""))}</b></div><div class="pr-vyklad"></div></div>`); continue; }
    if (m && m[3]) {
      const dily = m[3].split(" · ");
      const vyklad = dily.length >= 3 && dily.every((d) => d.length < 110) ? `<ul class="pr-body">${dily.map((d) => `<li>${inl(d)}</li>`).join("")}</ul>` : `<p>${inl(m[3])}</p>`;
      out.push(`<div class="pr-pojem"><div class="pr-hl">${ic ? `<span class="pr-ic">${ic}</span>` : ""}<b>${esc(m[1].replace(/:$/, ""))}</b>${m[2] ? `<small>${esc(m[2])}</small>` : ""}</div><div class="pr-vyklad">${vyklad}</div></div>`);
    } else out.push(`<p class="pr-odst">${ic ? `<span class="pr-ic">${ic}</span> ` : ""}${inl(rest)}</p>`);
  }
  flush();
  return out.join("");
}

VIEWS.prirucka = async (view) => {
  if (!PRIR.data) { view.innerHTML = `<div class="panel empty">…</div>`; try { PRIR.data = (await call("prirucka", {}, true)).kapitoly; } catch { return; } if (S.tab !== "prirucka") return; }
  const K = PRIR.data, q = PRIR.q.trim().toLowerCase();
  const shoda = (k) => !q || (k.title + " " + k.text).toLowerCase().includes(q);
  if (!shoda(K[PRIR.k])) { const f = K.findIndex(shoda); if (f >= 0) PRIR.k = f; }
  const kap = K[PRIR.k] || K[0];
  const cisty = (t_) => String(t_ || "").replace(/^#\s+.*\n?/, "");    // první nadpis kapitoly ukazujeme zvlášť
  let html = prirKrasne(cisty(kap.text));   // r27-6: přehledné rozvržení (pojmy vlevo, výklad vpravo, výčty jako seznam)
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

// r27-11: barevný štítek kusu (aby šlo poznat, který kus nasazuješ / prodáváš)
const barvaStitek = (barva, hx) => barva ? ` <span class="barva-kus" title="${esc(barva)}"><i${hx ? ` style="--b:${hx}"` : ` class="prirodni"`}></i>${esc(barva.toLowerCase())}</span>` : "";

// --- batoh
VIEWS.bag = (view) => {
  // r27-4: vlevo Nasazeno a Na opasku, vpravo Kapsy a Batoh (jen to, co je v nich — ne co má postava na sobě)
  const m = S.me, N = m.nosim || { pockets: [], backpack: [], belt: [], pockets_max: 5, backpack_max: 0, belt_max: 2 };
  const row = {}; m.inventory.forEach((i) => { row[i.id] = i; });
  const vec = ([id, q, barva, hx], naOpasku = false) => {
    const i = row[id] || { id, name: id, slot_name: "" };
    const db = barva ? ` data-barva="${esc(barva)}"` : "";
    return `<div class="item">${icon(id)}
      <div><div class="nm">${esc(i.name)}${q > 1 ? ` <span class="muted">× ${esc(q)}</span>` : ""}${barvaStitek(barva, hx)}</div>
      <div class="meta">${esc(i.slot_name)}${i.fx ? ` · <b class="fx">${esc(i.fx)}</b>` : ""}${i.merchant_name ? " · " + esc(t("sell_to", i.merchant_name)) : ""}</div>${statyHtml(i)}${opotrebeni(i)}</div>
      <div class="acts">
        ${i.use ? `<button class="btn small" data-use="${esc(id)}">${esc(t("use"))}</button>` : ""}
        ${i.equip ? `<button class="btn small" data-equip="${esc(id)}"${db}>${esc(t("equip"))}</button>` : ""}
        ${naOpasku ? `<button class="btn small" data-opasek="${esc(id)}" data-sundat="1">${esc(L(["Sundat do batohu", "Take off the belt"]))}</button>` : ""}
        ${(N.v_batohu || []).includes(id) ? `<button class="btn small" data-opasek="${esc(id)}" data-sundat="">${esc(L(["Na opasek", "Onto the belt"]))}</button>` : ""}
      </div></div>`;
  };   // r27-22: prodej jen na tržišti a u obchodníků (u hostinského), ne v batohu
  const prazdne = (n) => Array.from({ length: Math.max(0, n) }, () => `<div class="item volno"><span class="icon prazdne"></span><div class="muted">${esc(L(["volné místo", "empty slot"]))}</div></div>`).join("");
  const blok = (nadpis, pocet, obsah) => `<div class="panel"><div class="spread"><h3>${esc(nadpis)}</h3>${pocet ? `<span class="pill">${esc(pocet)}</span>` : ""}</div><div class="items">${obsah}</div></div>`;
  const BZ = S.batohZal || "kapsy";   // r27-12: na telefonu jen jeden oddíl naráz (bez dlouhého scrollování)
  const zal = [["nasazeno", L(["Na sobě", "Worn"]), m.equipped.length], ["opasek", L(["Opasek", "Belt"]), N.belt.length], ["kapsy", L(["Kapsy", "Pockets"]), N.pockets.length], ["batoh", L(["Batoh", "Backpack"]), N.backpack.length]];
  view.replaceChildren(h(`
    ${m.on_raid ? `<div class="panel notice" style="margin-bottom:16px">🗺️ ${esc(t("on_raid"))}</div>` : ""}
    ${jeMobil() ? `<div class="m-zalozky batoh-zal">${zal.map(([k, n, c]) => `<button class="${BZ === k ? "on" : ""}" data-bz="${k}">${esc(n)}<small>${c}</small></button>`).join("")}</div>` : ""}
    <div class="grid g2 batoh${jeMobil() ? " m-jen-" + BZ : ""}" style="align-items:start">
      <div class="grid">
        ${blok(t("equipped"), "", m.equipped.length ? m.equipped.map((e) => `<div class="item eq">${icon(e.id)}
          <div><div class="nm">${esc(e.name)}${e.enh ? ` <span class="muted">+${e.enh}</span>` : ""}${barvaStitek(e.color_name, e.color)}</div><div class="meta">${esc(e.slot_name)}</div>${statyHtml(e)}${opotrebeni(e)}</div>
          <div class="acts"><button class="btn small" data-unequip="${esc(e.slot)}">${esc(t("unequip"))}</button></div></div>`).join("")
          : `<div class="empty">${esc(L(["Pěsti a obyčejný oděv.", "Fists and plain clothes."]))}</div>`)}
        ${blok(L(["Na opasku", "On the belt"]) + (N.belt_name ? " · " + N.belt_name : ""), N.belt.length + " / " + N.belt_max,
          N.belt.map((x) => vec(x, true)).join("") + prazdne(N.belt_max - N.belt.length))}
      </div>
      <div class="grid">
        ${blok(L(["Kapsy", "Pockets"]), N.pockets.length + " / " + N.pockets_max, N.pockets.map((x) => vec(x)).join("") + prazdne(N.pockets_max - N.pockets.length))}
        ${N.backpack_max ? blok(N.bag_name || L(["Batoh", "Backpack"]), N.backpack.length + " / " + N.backpack_max, N.backpack.map((x) => vec(x)).join("") + prazdne(N.backpack_max - N.backpack.length))
          : blok(L(["Batoh", "Backpack"]), "", `<div class="empty">${esc(L(["Nemáš batoh — kup ho u krejčího nebo vetešníka.", "No backpack yet."]))}</div>`)}
      </div>
    </div>`));
  view.querySelectorAll("[data-f]").forEach((b) => b.onclick = () => { S.bagFilter = b.dataset.f; render(); });
  view.querySelectorAll("[data-bz]").forEach((b) => b.onclick = () => { S.batohZal = b.dataset.bz; Zvuk.sfx("klik"); render(); });
  const act = (op, data, msg) => call(op, data).then((r) => { toast(msg ? msg(r) : t("done")); render(); }).catch(() => {});
  view.querySelectorAll("[data-unequip]").forEach((b) => b.onclick = () => act("unequip", { slot: b.dataset.unequip }));
  view.querySelectorAll("[data-equip]").forEach((b) => b.onclick = () => act("equip", { item: b.dataset.equip, color: b.dataset.barva || "" }));
  view.querySelectorAll("[data-use]").forEach((b) => b.onclick = () => act("use", { item: b.dataset.use }));
  view.querySelectorAll("[data-opasek]").forEach((b) => b.onclick = () => act("opasek", { item: b.dataset.opasek, sundat: !!b.dataset.sundat },
    () => b.dataset.sundat ? L(["Sundáno do batohu.", "Moved to the backpack."]) : L(["Zpátky na opasku.", "Back on the belt."])));
  loadIcons([...m.inventory.map((i) => i.id), ...m.equipped.map((e) => e.id)]);
  mobilniSeznam(view.querySelector(".batoh"));
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
          <span class="${C.debt ? "ne" : ""}">${esc(C.debt ? L(["Zamčeno — dluh ", "Locked — debt "]) + C.debt + L([" gr. (Rychtář → Výdaje)", " gr."]) : (C.ends ? L(["Předplaceno ještě ", "Paid for another "]) + odpocet(C.ends) : L(["Nepředplaceno", "Not prepaid"])) + L([" (předplatit jde nejvýš ", " (prepay max "]) + T.prepay_max + L([" týd.)", " wk)"]))}</span></div>
        <div class="row ts-akce">
          <button class="btn" data-cid="ks:innchest:rent:${C.size}:1"${C.debt || C.weeks >= T.prepay_max || T.coins < C.rent ? " disabled" : ""}>${esc(L(["Předplatit týden · ", "Prepay a week · "]) + C.rent + " gr.")}</button>
          ${C.iron ? "" : `<button class="btn" data-cid="ks:innchest:iron"${T.coins < C.iron_price ? " disabled" : ""} title="${esc(L(["Těžší zámek proti vloupání v noci", "Harder lock against night thieves"]))}">${esc(L(["Okovat · ", "Iron-bind · "]) + C.iron_price + " gr.")}</button>`}
          ${C.size === "mala" && T.level >= (T.nabidka.find((x) => x.key === "velka") || {}).level ? `<button class="btn" data-cid="ks:innchest:rent:velka:1"${C.debt ? " disabled" : ""}>${esc(L(["Vylepšit na velkou truhlu", "Upgrade to a large chest"]))}</button>` : ""}
          ${T.house ? `<button class="btn" data-cid="ks:innchest:move"${C.debt ? " disabled" : ""}>${esc(L(["Přestěhovat domů", "Move home"]))}</button>` : ""}
          ${T.porter ? `<button class="btn primary" data-cid="ks:porter:pay">${esc(L(["Nosič: uložit kořist (", "Porter: store loot ("]) + T.porter + ")")}</button>` : ""}
        </div></div>
      <div class="m-zalozky truhla-zal"><button class="${S.truhlaStrana !== "vzit" ? "on" : ""}" data-tstrana="ulozit">${esc(L(["Uložit", "Store"]))}<small>${esc(L(["u sebe ", "carried "]) + T.carried.length)}</small></button>
        <button class="${S.truhlaStrana === "vzit" ? "on" : ""}" data-tstrana="vzit">${esc(L(["Vzít", "Take"]))}<small>${esc(L(["v truhle ", "in chest "]) + C.used)}</small></button></div>
      <div class="grid g2 truhla-sloupce strana-${S.truhlaStrana === "vzit" ? "vzit" : "ulozit"}" style="align-items:start">
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
  view.querySelectorAll("[data-tstrana]").forEach((b) => b.onclick = () => { S.truhlaStrana = b.dataset.tstrana; Zvuk.sfx("klik"); render(); });   // r27-14: telefon — Uložit / Vzít
  mountLive(view);
  view.querySelector("[data-go]").onclick = () => go("misto/hostinec");
  const klik = async (id, values, el) => {
    if (el) el.disabled = true;
    try { const r = await call("raid_click", { id, values }); if (r.panel && r.panel.content) { const m = noEmoji(r.panel.content).replace(/\*\*/g, "").split("\n").find((x) => /^(Zaplaceno|Uložen|Vzato|Vzal|Truhla je okovaná|Obsah \()/.test(x.trim())); if (m) toast(m.trim()); } Zvuk.sfx("klik"); }
    catch {}
    render();
  };
  view.querySelectorAll("[data-tr]").forEach((b) => b.onclick = () => klik("ks:innchest:" + b.dataset.tr, [b.dataset.v], b));
  view.querySelectorAll("[data-cid]").forEach((b) => b.onclick = () => klik(b.dataset.cid, [], b));
  loadIcons([...T.carried, ...(C ? C.items : [])].map((i) => i.id));
};

// r27-4: hřbitov u Sedlce — postavy, jejichž hráči příběh ukončili (jako fórum Hřbitov na Discordu)
const HRB = { sekce: "lide" };
VIEWS.hrbitov = async (view) => {
  view.replaceChildren(h(`${sceneHead("mesto-chram", L(["Hřbitov u Sedlce", "Sedlec graveyard"]), L(["Hrobník: „Každý tu má svůj kámen. I ti, na které se zapomnělo.“", "Gravedigger: \"Everyone gets a stone here.\""]), true)}
    <div id="hroby" class="hroby"><div class="empty">…</div></div>
    <p><button class="btn" data-go="mesto">← ${esc(t("back_map"))}</button></p>`));
  mountLive(view);
  view.querySelector("[data-go]").onclick = () => go("mesto");
  let r; try { r = await call("hrbitov", {}, true); } catch { return; }
  const box = $("#hroby"); if (!box) return;
  const ZV = r.zviratka || [];
  HRB.sekce = HRB.sekce || "lide";
  const tab = `<div class="hrb-zal"><button class="chip${HRB.sekce === "lide" ? " on" : ""}" data-hs="lide">${esc(L(["Dobrodruzi", "Adventurers"]))} · ${r.hroby.length}</button>
    <button class="chip${HRB.sekce === "zvirata" ? " on" : ""}" data-hs="zvirata">${esc(L(["Hřbitov zvířátek", "Pet cemetery"]))} · ${ZV.length}</button></div>`;
  if (HRB.sekce === "zvirata") {
    box.innerHTML = tab + (ZV.length ? `<div class="hroby-zv">${ZV.map((z) => `<article class="hrob zv"><div class="tlapka"></div><h3>${esc(z.name)}</h3>
        <p class="h-puvod">${esc(z.kind + (z.stage ? " · " + z.stage : "") + (z.age ? " · " + L(["věk ", "age "]) + z.age : ""))}</p><p class="h-napis">${esc(z.line)}</p>
        <p class="h-data">${esc(L(["Pán: ", "Owner: "]) + z.owner)}${z.died ? "<br>" + esc(z.died) : ""}</p><p class="h-cisla">${esc(z.runs + L([" výprav", " expeditions"]))}</p></article>`).join("")}</div>`
      : `<div class="panel empty">${esc(L(["Pod lípou za kostelem zatím žádný hrobeček není.", "No little graves yet."]))}</div>`);
    box.querySelectorAll("[data-hs]").forEach((b) => b.onclick = () => { HRB.sekce = b.dataset.hs; VIEWS.hrbitov(view); });
    return;
  }
  box.innerHTML = tab + (r.hroby.length ? r.hroby.map((g) => `<article class="hrob"><div class="kriz"></div>
      <h3>${esc(g.name)}</h3><p class="h-puvod">${esc(g.origin + " · " + L(["úroveň ", "level "]) + g.level)}</p>
      <p class="h-napis">${esc(noEmoji(g.line))}</p>
      <p class="h-data">${esc((g.female ? L(["Žila ", "Lived "]) : L(["Žil ", "Lived "])) + g.lived)}<br>${esc((g.female ? L(["Odešla ", "Passed "]) : L(["Odešel ", "Passed "])) + g.died)}</p>
      <p class="h-cisla">${esc(g.runs + L([" výprav · ", " expeditions · "]) + g.kills + L([" poražených", " slain"]))}</p></article>`).join("")
    : `<div class="panel empty">${esc(L(["Hřbitov je zatím prázdný. Ať to tak dlouho zůstane.", "The graveyard is empty."]))}</div>`);
  box.querySelectorAll("[data-hs]").forEach((b) => b.onclick = () => { HRB.sekce = b.dataset.hs; VIEWS.hrbitov(view); });
  // r27-5: klik na náhrobek = přiblížit (čitelné písmo), zavře se klikem vedle, křížkem nebo Esc
  box.querySelectorAll(".hrob").forEach((a) => { a.tabIndex = 0; a.title = L(["Přiblížit náhrobek", "Zoom in"]);
    const otevri = () => {
      const pop = document.createElement("div"); pop.className = "hrob-zoom";
      pop.innerHTML = `<button class="hz-zavrit" aria-label="${esc(L(["Zavřít", "Close"]))}">✕</button>`;
      const k = a.cloneNode(true); k.removeAttribute("title"); k.removeAttribute("tabindex"); pop.append(k);
      const zavri = () => { pop.remove(); document.removeEventListener("keydown", esc_); a.focus(); };
      const esc_ = (e) => { if (e.key === "Escape") zavri(); };
      pop.addEventListener("click", (e) => { if (!k.contains(e.target) || e.target.closest(".hz-zavrit")) zavri(); });
      pop.querySelector(".hz-zavrit").onclick = zavri;
      document.addEventListener("keydown", esc_);
      document.body.append(pop); Zvuk.sfx("klik");
    };
    a.addEventListener("click", otevri);
    a.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); otevri(); } });
  });
};

// r27-4: chat diváků (souboje, kohoutí zápasy) — rozepsaná zpráva přežije obnovení stránky zápasu
const CHAT = { draft: {}, focus: "" };
function chatListHtml(room, msgs) {
  const cas = (ts) => new Date(ts * 1000).toLocaleTimeString(({ en: "en-GB", pl: "pl-PL", sk: "sk-SK" }[S.lang] || "cs-CZ"), { hour: "2-digit", minute: "2-digit" });
  return (msgs || []).length ? msgs.map((m) => `<li${m.dc ? ' class="z-dc" title="z Discordu"' : ""}><span class="kdy">${cas(m.t)}</span><b>${esc(m.name)}</b> ${esc(m.text)}</li>`).join("")
    : `<li class="muted">${esc(room === "hostinec" ? L(["U stolů je zatím ticho. Prolomíš ho?", "Quiet at the tables."]) : L(["Zatím ticho. Zakřič první…", "Quiet so far."]))}</li>`;
}
/** r27-5: dokud hráč píše do řečí, obnova stránky nepřestaví pole (na mobilu by zavřela klávesnici) — jen doplní nové zprávy.
 *  Vrací true, když se smí box přestavět celý. */
function chatRebuild(box, html, rooms) {
  const a = document.activeElement;
  if (a && box.contains(a) && a.closest(".chat-form")) {
    box.querySelectorAll(".chat[data-room]").forEach((c) => {
      const msgs = rooms[c.dataset.room]; if (!msgs) return;
      const list = c.querySelector(".chat-list"), dole = list.scrollHeight - list.scrollTop - list.clientHeight < 40;
      const nove = chatListHtml(c.dataset.room, msgs);
      if (list.innerHTML !== nove) { list.innerHTML = nove; if (dole) list.scrollTop = list.scrollHeight; }
    });
    return false;
  }
  box.innerHTML = html;
  return true;
}
function chatHtml(room, msgs) {
  const hospoda = room === "hostinec";
  return `<div class="chat${hospoda ? " hospoda" : ""}" data-room="${esc(room)}"><div class="chat-h">${esc(hospoda ? L(["Hospodské řeči", "Tavern talk"]) : L(["Pokřik z hlediště", "Shouts from the stands"]))}<small>${esc(hospoda ? L(["propojeno s #na-rynku na Discordu", "linked with #na-rynku on Discord"]) : L(["propojeno s vláknem zápasu na Discordu", "linked with the match thread on Discord"]))}</small></div>
    <ul class="chat-list">${chatListHtml(room, msgs)}</ul>
    <form class="chat-form"><input maxlength="200" placeholder="${esc(hospoda ? L(["Řekni něco ke stolu…", "Say something…"]) : L(["Fanděj, hecuj, sázej…", "Cheer, jeer, bet…"]))}" value="${esc(CHAT.draft[room] || "")}"><button class="btn small primary">${esc(hospoda ? L(["Říct", "Say"]) : L(["Zakřičet", "Shout"]))}</button></form></div>`;
}
// hospodské řeči: obnova každé 4 s, jen dokud je hráč v lokálu
const HOSPODA = { timer: null };
async function hospodaKresli() {
  const box = document.getElementById("hospoda-reci");
  if (!box || S.tab !== "misto" || S.arg !== "hostinec") { clearInterval(HOSPODA.timer); return; }
  let r; try { r = await call("chat", { room: "hostinec" }, true); } catch { return; }
  if (!chatRebuild(box, chatHtml("hostinec", r.chat), { hostinec: r.chat })) { hospodaVyska(); return; }
  hospodaVyska();
  wireChat(box, hospodaKresli);
}
/** r27-21: hospodské řeči mají pevnou výšku — spodek okna lícuje se spodkem obrazu hostince, zprávy se posouvají uvnitř. */
function hospodaVyska() {
  const box = document.getElementById("hospoda-reci"), list = box && box.querySelector(".chat-list");
  if (!list) return;
  const sc = document.querySelector("#view .scene"), chat = box.querySelector(".chat");
  const vedle = sc && window.innerWidth >= 1100 && !document.documentElement.classList.contains("mobil")
    && sc.getBoundingClientRect().right <= chat.getBoundingClientRect().left + 2;   // obraz vlevo, volby a řeči vpravo
  let v = Math.min(240, Math.round(window.innerHeight * 0.3));   // telefon a úzké okno: pevně, bez natahování
  if (vedle) {
    const spodek = sc.getBoundingClientRect().bottom, top = list.getBoundingClientRect().top;
    const zbytek = chat.getBoundingClientRect().bottom - list.getBoundingClientRect().bottom;   // formulář a okraj pod seznamem
    v = Math.round(spodek - top - zbytek);
  }
  v = Math.max(120, v);
  if (list.style.height !== v + "px") { const dole = list.scrollHeight - list.scrollTop - list.clientHeight < 40;
    list.style.height = list.style.maxHeight = list.style.minHeight = v + "px"; if (dole) list.scrollTop = list.scrollHeight; }
}
window.addEventListener("resize", () => { if (S.tab === "misto" && S.arg === "hostinec") hospodaVyska(); });
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

// r27-6: editor vlastního erbu na radnici — dělení na pole, až tři barvy, vrstvy figur do vybraných polí, heslo na pásce či svitku.
// Malovaný štít a figury (stříbrnobílé malby) se obarví na plátně; geometrie polí přichází ze serveru (heraldry.DELENI).
const ERB = { img: null, fig: {} };
const ERB_STIT = "M10 8H190V110Q190 196 100 232Q10 196 10 110Z";
const erbObr = (n) => new Promise((ok, ko) => { const i = new Image(); i.crossOrigin = "anonymous"; i.onload = () => ok(i); i.onerror = ko; i.src = IMG_BASE + "erb/" + n + ".webp"; });
async function erbPodklad() {
  if (ERB.img !== null) return ERB.img;
  try {
    const [stit, pole] = await Promise.all([erbObr("stit"), erbObr("stit-pole")]);
    const c = document.createElement("canvas"); c.width = pole.width; c.height = pole.height;
    const x = c.getContext("2d"); x.drawImage(pole, 0, 0);
    const d = x.getImageData(0, 0, c.width, c.height).data;
    let x0 = c.width, y0 = c.height, x1 = 0, y1 = 0;
    for (let y = 0; y < c.height; y += 2) for (let xx = 0; xx < c.width; xx += 2) if (d[(y * c.width + xx) * 4 + 3] > 128) { x0 = Math.min(x0, xx); x1 = Math.max(x1, xx); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    ERB.img = { stit, pole, box: [x0, y0, x1 - x0, y1 - y0] };
  } catch { ERB.img = false; }
  return ERB.img;
}
async function erbMaska(k) {     // maska částí figury (R, G, B = 1.–3. část), nemusí existovat
  const kk = k + "-casti";
  if (!(kk in ERB.fig)) { try { ERB.fig[kk] = await erbObr("figura-" + kk); } catch { ERB.fig[kk] = null; } }
  return ERB.fig[kk];
}
const erbRgb = (hx) => [1, 3, 5].map((i) => parseInt(hx.slice(i, i + 2), 16));
// figura obarvená podle barvy vrstvy a barev jednotlivých částí: šedá malba × barva (výsledek se drží v mezipaměti)
async function erbObarvi(v, R) {
  const key = JSON.stringify([v.figura, v.barva, v.casti || {}]);
  ERB.tint = ERB.tint || new Map();
  if (ERB.tint.has(key)) return ERB.tint.get(key);
  const fig = await erbFigura(v.figura);
  if (!fig) return null;
  const sez = (R.casti || {})[v.figura] || [];
  const cols = sez.map(([p]) => (v.casti || {})[p] ? erbRgb(R.tinktury[v.casti[p]][1]) : null);
  const mask = cols.some(Boolean) ? await erbMaska(v.figura) : null;
  const c = document.createElement("canvas"); c.width = fig.width; c.height = fig.height;
  const x = c.getContext("2d", { willReadFrequently: true }); x.drawImage(fig, 0, 0);
  const id = x.getImageData(0, 0, c.width, c.height), px = id.data;
  let md = null;
  if (mask) { const m = document.createElement("canvas"); m.width = c.width; m.height = c.height; const mx = m.getContext("2d", { willReadFrequently: true }); mx.drawImage(mask, 0, 0, c.width, c.height); md = mx.getImageData(0, 0, c.width, c.height).data; }
  const base = erbRgb(R.tinktury[v.barva][1]);
  for (let i = 0; i < px.length; i += 4) {
    if (!px[i + 3]) continue;
    let r = base[0], g = base[1], b = base[2];
    if (md) for (let j = 0; j < 3; j++) { const col = cols[j], w = md[i + j] / 255; if (col && w > 0) { r += (col[0] - r) * w; g += (col[1] - g) * w; b += (col[2] - b) * w; } }
    const k = px[i] / 255;
    px[i] = r * k; px[i + 1] = g * k; px[i + 2] = b * k;
  }
  x.putImageData(id, 0, 0);
  if (ERB.tint.size > 40) ERB.tint.clear();
  ERB.tint.set(key, c);
  return c;
}
async function erbFigura(k) {
  if (!(k in ERB.fig)) { try { ERB.fig[k] = await erbObr("figura-" + k); } catch { ERB.fig[k] = false; } }
  return ERB.fig[k];
}
// místa figur jedné vrstvy na mřížce 200 × 240: [[x, y, velikost], …] (stejný výpočet jako heraldry._layer_mask)
function erbMista(v, R) {
  const dil = R.deleni[R.d.deleni] || R.deleni.prosty;
  const cile = v.pole.length ? v.pole.map((i) => dil.parts[i]?.a).filter(Boolean) : [R.deleni.prosty.parts[0].a];
  const [, pos, sx, sy] = R.rozlozeni[v.rozlozeni] || R.rozlozeni.jedna;
  const k = (R.velikosti[v.velikost] || R.velikosti.velka)[1];
  const out = [];
  cile.forEach(([cx, cy, aw, ah, uhel = 0]) => {          // kotva může být natočená (kosmé břevno); x, y = volný posun hráče
    const s = Math.min(aw * sx, ah * sy) * k * (v.meritko || 1), ca = Math.cos(uhel * Math.PI / 180), sa = Math.sin(uhel * Math.PI / 180);
    if (s >= 1) pos.forEach(([dx, dy]) => { const ox = dx * aw, oy = dy * ah; out.push([cx + ox * ca - oy * sa + (v.x || 0), cy + ox * sa + oy * ca + (v.y || 0), s]); });
  });
  return out;
}
async function erbKresli(cv, R, jenObsah = false) {   // r27-6: jenObsah = jen barvy polí a figury (bez tvaru a rámu štítu)
  const A = await erbPodklad();
  if (!A) return false;
  const d = R.d, T = R.tinktury;
  const figs = await Promise.all(d.vrstvy.map((v) => erbFigura(v.figura)));
  if (figs.some((f) => !f)) return false;                // některá malba ještě chybí → náhled od serveru
  const W = A.stit.width, H = A.stit.height, [bx, by, bw, bh] = A.box;
  cv.width = W; cv.height = H;
  const ctx = cv.getContext("2d");
  const f = document.createElement("canvas"); f.width = W; f.height = H;
  const g = f.getContext("2d");
  const P = ([x, y]) => [bx + (x - 10) / 180 * bw, by + (y - 8) / 224 * bh];   // mřížka štítu → malovaný štít
  const sc = bw / 180;
  g.fillStyle = T[d.barvy[0]][1]; g.fillRect(0, 0, W, H);
  (R.deleni[d.deleni] || R.deleni.prosty).parts.forEach((p) => {
    g.fillStyle = T[d.barvy[p.c]][1];
    p.p.forEach((poly) => { g.beginPath(); poly.map(P).forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.fill(); });
  });
  const tinty = await Promise.all(d.vrstvy.map((v) => erbObarvi(v, R)));
  d.vrstvy.forEach((v, i) => {   // obarvená figura s tmavým stínem, aby byla vidět i na stejné barvě
    g.save(); g.shadowColor = "rgba(30,20,12,.85)"; g.shadowBlur = W / 160;
    erbMista(v, R).forEach(([gx, gy, s]) => {
      const [cx, cy] = P([gx, gy]), S = s * sc;
      g.save(); g.translate(cx, cy); if (v.otoceni) g.rotate(v.otoceni * Math.PI / 180); if (v.zrcadlit) g.scale(-1, 1); g.drawImage(tinty[i], -S / 2, -S / 2, S, S); g.restore();
    });
    g.restore();
  });
  if (jenObsah) { ctx.clearRect(0, 0, W, H); ctx.drawImage(f, 0, 0); return true; }
  g.globalCompositeOperation = "multiply"; g.drawImage(A.stit, 0, 0);          // malovaná textura štítu
  g.globalCompositeOperation = "destination-in"; g.drawImage(A.pole, 0, 0);    // jen plocha štítu
  ctx.clearRect(0, 0, W, H); ctx.drawImage(A.stit, 0, 0); ctx.drawImage(f, 0, 0);
  cv.dataset.mrizka = sc;                                   // px plátna na jednotku mřížky (pro přetahování figur)
  return true;
}
// malý štít jako SVG (dlaždice dělení, výběr polí, rozložení)
function erbSvg(R, div, opt = {}) {
  const dil = R.deleni[div] || R.deleni.prosty;
  const barvy = opt.barvy || ["#e8dcc0", "#8e1b14", "#3b4f68"];
  const poly = (p, extra = "") => p.p.map((q) => `<polygon points="${q.map((z) => z.join(",")).join(" ")}" ${extra}/>`).join("");
  const casti = dil.parts.map((p, i) => opt.vyber ? `<g class="erb-cast${opt.vyber.includes(i) ? " on" : ""}" data-cast="${i}" fill="${barvy[p.c]}">${poly(p)}<title>${esc(p.n)}</title></g>`
    : `<g fill="${barvy[p.c]}">${poly(p)}</g>`).join("");
  const body = (opt.body || []).map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#c9a55a" stroke="#3a2a18" stroke-width="3"/>`).join("");
  const id = "ec" + Math.random().toString(36).slice(2, 8);
  return `<svg viewBox="0 0 200 240"><clipPath id="${id}"><path d="${ERB_STIT}"/></clipPath><g clip-path="url(#${id})"><rect width="200" height="240" fill="${barvy[0]}"/>${casti}${body}</g><path d="${ERB_STIT}" fill="none" stroke="#3a2a18" stroke-width="9"/></svg>`;
}
VIEWS.erb = async (view) => {
  view.replaceChildren(h(`${sceneHead("mesto-radnice", L(["Erb", "Coat of arms"]), L(["Písař heroldů: „Barva, dělení, figura — a heslo, které tě přežije.“", "Herald's clerk: \"Tincture, division, charge — and a motto to outlive you.\""]), true)}
    <div id="erb" class="erb-editor"><div class="panel empty">…</div></div>
    <p><button class="btn" data-go="misto/radnice-rychtar">← ${esc(t("back"))}</button></p>`));
  mountLive(view);
  view.querySelector("[data-go]").onclick = () => go("misto/radnice-rychtar");
  let r; try { r = await call("erb"); } catch { return; }
  const box = $("#erb"); if (!box) return;
  const R = { ...r, d: JSON.parse(JSON.stringify(r.design)) }, d = R.d, T = r.tinktury;
  const zam = r.has ? " disabled" : "";
  let karta = "stit", vyb = 0, ulozit = null;
  const pocetBarev = () => Math.max(...(r.deleni[d.deleni] || r.deleni.prosty).parts.map((p) => p.c)) + 1;
  const hex = (i) => T[d.barvy[i]][1];
  const sw = (cur, attr) => `<div class="erb-barvy">${Object.entries(T).map(([k, [n, hx]]) => `<button class="erb-barva${k === cur ? " on" : ""}" ${attr}="${k}" title="${esc(n)}" style="--b:${hx}"${zam}><i></i><small>${esc(n)}</small></button>`).join("")}</div>`;
  const nova = () => ({ figura: Object.keys(r.figury)[0], barva: d.barvy[0] === "zlata" ? "stribrna" : "zlata", pole: [], rozlozeni: "jedna", velikost: "velka", zrcadlit: false, casti: {}, x: 0, y: 0, meritko: 1, otoceni: 0 });
  const stitKarta = () => `
    <div class="sect">${esc(L(["Dělení štítu", "Division"]))}</div>
    <div class="erb-mriz">${Object.entries(r.deleni).map(([k, x]) => `<button class="erb-dlazdice${k === d.deleni ? " on" : ""}" data-deleni="${k}"${zam}>${erbSvg(R, k, { barvy: [0, 1, 2].map(hex) })}<small>${esc(x.n)}</small></button>`).join("")}</div>
    ${Array.from({ length: pocetBarev() }, (_, i) => `<div class="sect">${esc(pocetBarev() === 1 ? L(["Barva štítu", "Field"]) : L([`Barva ${i + 1}. pole`, `Tincture ${i + 1}`]))}</div>${sw(d.barvy[i], `data-slot="${i}" data-tin`)}`).join("")}`;
  const vrstvaKarta = () => {
    const v = d.vrstvy[vyb];
    const seznam = `<div class="erb-vrstvy">${d.vrstvy.map((x, i) => `<div class="erb-vrstva${i === vyb ? " on" : ""}">
        <button class="ev-vyber" data-vyb="${i}"><img alt="" src="${IMG_BASE}erb/figura-${x.figura}-m.webp" data-pryc-pri-chybe><span>${esc(r.figury[x.figura] || x.figura)}</span>
          <small>${esc(x.pole.length ? x.pole.map((p) => (r.deleni[d.deleni].parts[p] || {}).n).join(", ") : L(["přes celý štít", "whole shield"]))}</small></button>
        ${r.has ? "" : `<span class="ev-tl"><button data-nahoru="${i}" title="${esc(L(["Dopředu", "Forward"]))}"${i === d.vrstvy.length - 1 ? " disabled" : ""}>▲</button><button data-dolu="${i}" title="${esc(L(["Dozadu", "Back"]))}"${i ? "" : " disabled"}>▼</button><button data-pryc="${i}" title="${esc(L(["Odebrat", "Remove"]))}">✕</button></span>`}</div>`).join("")}
      ${r.has || d.vrstvy.length >= r.max_vrstev ? "" : `<button class="btn small" id="ev-pridat">+ ${esc(L(["Přidat figuru", "Add a charge"]))}</button>`}</div>`;
    if (!v) return seznam + `<p class="muted small">${esc(L(["Štít je zatím bez figur. Přidej první.", "No charges yet."]))}</p>`;
    const dil = r.deleni[d.deleni];
    return seznam + `
      <div class="sect">${esc(L(["Figura", "Charge"]))}</div>
      <div class="erb-mriz fig">${Object.entries(r.figury).map(([k, n]) => `<button class="erb-dlazdice fig${k === v.figura ? " on" : ""}" data-fig="${k}"${zam}><img alt="" src="${IMG_BASE}erb/figura-${k}-m.webp" data-pryc-pri-chybe><small>${esc(n)}</small></button>`).join("")}</div>
      <div class="sect">${esc(L(["Barva figury", "Charge tincture"]))}</div>${sw(v.barva, "data-fbarva")}
      ${(r.casti[v.figura] || []).map(([p, n]) => `<div class="sect">${esc(n)} <small class="muted">${esc(L(["— jinou barvou", "— own tincture"]))}</small></div>
        <div class="erb-barvy"><button class="erb-barva${(v.casti || {})[p] ? "" : " on"}" data-cast-barva="${p}" data-v=""${zam}><i class="jako"></i><small>${esc(L(["jako figura", "same"]))}</small></button>${Object.entries(T).map(([k, [nn, hx]]) => `<button class="erb-barva${(v.casti || {})[p] === k ? " on" : ""}" data-cast-barva="${p}" data-v="${k}" title="${esc(nn)}" style="--b:${hx}"${zam}><i></i><small>${esc(nn)}</small></button>`).join("")}</div>`).join("")}
      <div class="sect">${esc(L(["Kam ji umístit", "Where"]))} <small class="muted">${esc(L(["— klikni na pole ve štítu (může jich být víc)", "— click fields (several allowed)"]))}</small></div>
      <div class="erb-kam">
        <div class="erb-pole-vyber">${erbSvg(R, d.deleni, { barvy: [0, 1, 2].map(hex), vyber: v.pole })}</div>
        <div><button class="erb-dlazdice${v.pole.length ? "" : " on"}" data-cely${zam}>${esc(L(["Přes celý štít", "Whole shield"]))}</button>
          ${dil.parts.length > 1 ? `<div class="erb-pole-sez">${dil.parts.map((p, i) => `<button class="erb-chip${v.pole.includes(i) ? " on" : ""}" data-cast="${i}"${zam}>${esc(p.n)}</button>`).join("")}</div>` : ""}</div>
      </div>
      <div class="sect">${esc(L(["Rozložení", "Arrangement"]))}</div>
      <div class="erb-mriz">${Object.entries(r.rozlozeni).map(([k, [n, pos, sx, sy]]) => {
        const s = Math.min(150 * sx, 172 * sy) * .42;
        return `<button class="erb-dlazdice${k === v.rozlozeni ? " on" : ""}" data-rozl="${k}"${zam}>${erbSvg(R, "prosty", { barvy: ["#e8dcc0"], body: pos.map(([dx, dy]) => [100 + dx * 150, 114 + dy * 172, s]) })}<small>${esc(n)}</small></button>`; }).join("")}</div>
      <div class="sect">${esc(L(["Velikost a natočení", "Size and facing"]))}</div>
      <div class="erb-pole-sez">${Object.entries(r.velikosti).map(([k, [n]]) => `<button class="erb-chip${k === v.velikost ? " on" : ""}" data-vel="${k}"${zam}>${esc(n)}</button>`).join("")}
        <button class="erb-chip${v.zrcadlit ? " on" : ""}" data-zrc${zam}>⇋ ${esc(L(["Zrcadlit", "Mirror"]))}</button></div>
      <div class="erb-jemne">
        <label>${esc(L(["Velikost", "Size"]))} <input type="range" min="30" max="160" value="${Math.round((v.meritko || 1) * 100)}" data-jemne="meritko"${zam}><b>${Math.round((v.meritko || 1) * 100)} %</b></label>
        <label>${esc(L(["Natočení", "Rotation"]))} <input type="range" min="-180" max="180" step="5" value="${v.otoceni || 0}" data-jemne="otoceni"${zam}><b>${v.otoceni || 0}°</b></label>
      </div>
      <p class="muted small erb-tip">✥ ${esc(L(["Figuru přetáhneš myší nebo prstem přímo na štítě.", "Drag the charge on the shield to move it."]))}
        ${v.x || v.y || (v.meritko || 1) !== 1 || v.otoceni ? `<button class="erb-chip" data-nastred${zam}>${esc(L(["Na výchozí místo", "Reset"]))}</button>` : ""}</p>`;
  };
  const hesloKarta = () => `
    <div class="sect">${esc(L(["Heslo", "Motto"]))}</div>
    <input class="search erb-heslo" id="erb-heslo" maxlength="${r.heslo_max}" value="${esc(d.heslo || "")}" placeholder="${esc(L(["Třeba: Věrně a statečně", "e.g. Faithful and brave"]))}"${zam}>
    <div class="sect">${esc(L(["Na čem je napsané", "Scroll"]))}</div>
    <div class="erb-pole-sez">${Object.entries(r.stuhy).map(([k, n]) => `<button class="erb-chip${k === d.stuha ? " on" : ""}" data-stuha="${k}"${zam}>${esc(n)}</button>`).join("")}</div>`;
  const pergamen = () => d.heslo ? `<div class="erb-stuha ${d.stuha}"><img alt="" src="${IMG_BASE}erb/${d.stuha}.webp" data-pryc-pri-chybe><span>${esc(d.heslo)}</span></div>` : "";
  const kresli = () => {
    box.innerHTML = `<div class="erb-plocha">
      <div class="panel erb-nahled">${d.stuha === "svitek" ? `<div id="erb-perg">${pergamen()}</div>` : ""}
        <canvas id="erb-cv" aria-label="${esc(L(["Náhled erbu", "Preview"]))}"></canvas><img id="erb-img" alt="" hidden>
        ${d.stuha !== "svitek" ? `<div id="erb-perg">${pergamen()}</div>` : ""}
        <p class="erb-popis" id="erb-popis">${esc(r.popis)}</p></div>
      <div class="panel erb-volby">
        ${r.has ? `<p class="upozorneni ok">${esc(L(["Tenhle erb ti byl udělen. Je vidět na kartě postavy a v kronice.", "These arms are yours."]))}</p>` : ""}
        <div class="erb-karty">${[["stit", L(["Štít a barvy", "Field"])], ["figury", L([`Figury (${d.vrstvy.length})`, `Charges (${d.vrstvy.length})`])], ["heslo", L(["Heslo", "Motto"])]].map(([k, n]) => `<button class="erb-karta${k === karta ? " on" : ""}" data-karta="${k}">${esc(n)}</button>`).join("")}</div>
        <div class="erb-obsah">${karta === "stit" ? stitKarta() : karta === "figury" ? vrstvaKarta() : hesloKarta()}</div>
        ${r.has ? "" : r.why.length ? `<div class="erb-podminky">${r.why.map((w) => `<p class="upozorneni ne">${esc(w)}</p>`).join("")}</div>`
          : `<button class="btn primary big" id="erb-udelit">${esc(L(["Udělit erb", "Grant the arms"]))} · ${esc(t("coins", r.price))}</button>`}
        ${r.has ? "" : `<p class="muted small">${esc(L(["Návrh se ukládá průběžně. Erb se uděluje jednou — potom už ho nezměníš.", "Your draft is saved. Arms are granted once."]))}</p>`}
      </div></div>`;
    nahled();
    const zmena = () => { Zvuk.sfx("klik"); kresli(); uloz(); };
    const v = d.vrstvy[vyb];
    const on = (sel, fn) => box.querySelectorAll(sel).forEach((b) => b.onclick = () => fn(b));
    on("[data-karta]", (b) => { karta = b.dataset.karta; kresli(); });
    if (r.has) return;
    on("[data-deleni]", (b) => { if (d.deleni !== b.dataset.deleni) d.vrstvy.forEach((x) => { x.pole = []; }); d.deleni = b.dataset.deleni; zmena(); });
    on("[data-tin]", (b) => { d.barvy[+b.dataset.slot] = b.dataset.tin; zmena(); });
    on("[data-vyb]", (b) => { vyb = +b.dataset.vyb; kresli(); });
    on("#ev-pridat", () => { d.vrstvy.push(nova()); vyb = d.vrstvy.length - 1; zmena(); });
    on("[data-pryc]", (b) => { d.vrstvy.splice(+b.dataset.pryc, 1); vyb = Math.max(0, Math.min(vyb, d.vrstvy.length - 1)); zmena(); });
    on("[data-nahoru]", (b) => { const i = +b.dataset.nahoru; [d.vrstvy[i], d.vrstvy[i + 1]] = [d.vrstvy[i + 1], d.vrstvy[i]]; vyb = i + 1; zmena(); });
    on("[data-dolu]", (b) => { const i = +b.dataset.dolu; [d.vrstvy[i], d.vrstvy[i - 1]] = [d.vrstvy[i - 1], d.vrstvy[i]]; vyb = i - 1; zmena(); });
    on("[data-stuha]", (b) => { d.stuha = b.dataset.stuha; zmena(); });
    if (v) {
      on("[data-fig]", (b) => { if (v.figura !== b.dataset.fig) v.casti = {}; v.figura = b.dataset.fig; zmena(); });
      on("[data-fbarva]", (b) => { v.barva = b.dataset.fbarva; zmena(); });
      on("[data-cast-barva]", (b) => { v.casti = { ...(v.casti || {}) }; if (b.dataset.v) v.casti[b.dataset.castBarva] = b.dataset.v; else delete v.casti[b.dataset.castBarva]; zmena(); });
      on("[data-cely]", () => { v.pole = []; zmena(); });
      box.querySelectorAll("[data-cast]").forEach((b) => b.addEventListener("click", () => { const i = +b.dataset.cast;
        v.pole = v.pole.includes(i) ? v.pole.filter((x) => x !== i) : [...v.pole, i].sort((a, c) => a - c); zmena(); }));
      on("[data-rozl]", (b) => { v.rozlozeni = b.dataset.rozl; zmena(); });
      on("[data-vel]", (b) => { v.velikost = b.dataset.vel; zmena(); });
      on("[data-zrc]", () => { v.zrcadlit = !v.zrcadlit; zmena(); });
      on("[data-nastred]", () => { Object.assign(v, { x: 0, y: 0, meritko: 1, otoceni: 0 }); zmena(); });
      box.querySelectorAll("[data-jemne]").forEach((r) => {
        r.oninput = () => { const k = r.dataset.jemne; v[k] = k === "meritko" ? r.value / 100 : +r.value;
          r.nextElementSibling.textContent = k === "meritko" ? r.value + " %" : r.value + "°"; nahled(); uloz(); };
        r.onchange = () => kresli();
      });
      // přetahování vybrané figury na náhledu (myš i prst)
      const cv = $("#erb-cv");
      if (cv && karta === "figury") {
        cv.classList.add("tahni");
        let tah = null;
        cv.onpointerdown = (e) => { tah = { x: e.clientX, y: e.clientY, vx: v.x || 0, vy: v.y || 0 }; cv.setPointerCapture(e.pointerId); e.preventDefault(); };
        cv.onpointermove = (e) => {
          if (!tah) return;
          const k = cv.width / cv.clientWidth / (+cv.dataset.mrizka || 1);
          v.x = Math.max(-120, Math.min(120, Math.round(tah.vx + (e.clientX - tah.x) * k)));
          v.y = Math.max(-130, Math.min(130, Math.round(tah.vy + (e.clientY - tah.y) * k)));
          if (!tah.raf) tah.raf = requestAnimationFrame(() => { if (tah) tah.raf = 0; nahled(); });
        };
        cv.onpointerup = cv.onpointercancel = () => { if (!tah) return; tah = null; uloz(); kresli(); };
      }
    }
    const hs = $("#erb-heslo");
    if (hs) hs.oninput = () => { d.heslo = hs.value; const p = $("#erb-perg"); if (p) p.innerHTML = pergamen(); uloz(); };
    const ud = $("#erb-udelit"); if (ud) ud.onclick = () => { if (!confirm(L(["Udělit erb takhle? Potom už ho nezměníš.", "Grant these arms? They cannot be changed later."]))) return;
      ud.disabled = true; call("erb_udelit", { design: d }).then(() => { Zvuk.sfx("mince"); toast(L(["Erb ti byl udělen!", "Your arms have been granted!"])); render(); }).catch(() => { ud.disabled = false; }); };
  };
  const uloz = () => { if (r.has) return; clearTimeout(ulozit); ulozit = setTimeout(() => call("erb", { design: d }, true).then((x) => { r.popis = x.popis; const p = $("#erb-popis"); if (p && x.popis) p.textContent = x.popis; }).catch(() => {}), 500); };
  let poradi = 0;
  const nahled = async () => {
    const cv = $("#erb-cv"), im = $("#erb-img"); if (!cv) return;
    const moje = ++poradi;
    if (await erbKresli(cv, R)) { cv.hidden = false; im.hidden = true; return; }
    cv.hidden = true;            // malby ještě nejsou → náhled od serveru
    try { const x = await call("erb_nahled", { design: { ...d, heslo: "" } }, true); if (moje === poradi && $("#erb-img") === im) { im.src = "data:image/png;base64," + x.image; im.hidden = false; } } catch { /* nic */ }
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
        <h3>${esc(z.kind)}</h3><p class="zk-pop">${esc(z.desc)}</p>${z.zivot ? `<p class="zk-zivot">${esc(z.zivot)}</p>` : ""}
        <p class="zk-bonus"><small>${esc(L(["mládě", "young"]))}</small> ${esc(z.bonus_young)} <span>→</span> <small>${esc(L(["zkušený", "veteran"]))}</small> ${esc(z.bonus_full)}</p>
        <div class="zk-dole">${z.owned ? `<span class="tag ok">${esc(L(["už ho máš", "owned"]))}</span>` : zam ? `<span class="dim">${esc(L(["od úrovně ", "from level "]) + z.level)}</span>`
          : vybr === z.kind ? `<form class="zk-jmeno" data-jm="${esc(z.kind)}"><input maxlength="20" required placeholder="${esc(L(["Jméno mláděte", "Name"]))}"><button class="btn small primary">${esc(L(["Koupit", "Buy"]))} · ${z.price} gr.</button></form>`
          : `<span class="price">${esc(t("coins", z.price))}</span><button class="btn small primary" data-vyber="${esc(z.kind)}"${z.price > r.coins ? " disabled" : ""}>${esc(L(["Vybrat", "Choose"]))}</button>`}</div></article>`;
    }).join("")}</div>
`;
    box.querySelectorAll("[data-vyber]").forEach((b) => b.onclick = () => { vybr = b.dataset.vyber; kresli(); box.querySelector(".zk-jmeno input")?.focus(); });
    box.querySelectorAll("form[data-jm]").forEach((f) => f.onsubmit = (ev) => {
      ev.preventDefault();
      const name = f.querySelector("input").value.trim(); if (!name) return;
      call("pet_buy", { kind: f.dataset.jm, name }).then(() => { Zvuk.sfx("mince"); toast(L([`${name} je tvůj!`, `${name} is yours!`])); go("pet"); }).catch(() => {});
    });
  };
  kresli();
};

// r27-6: povoz s koněm — vlastní stránka ve zvěřinci (obrázek, k čemu je, cena, nákup)
VIEWS.povoz = async (view) => {
  view.replaceChildren(h(`${sceneHead("mesto-zverinec", L(["Povoz s koněm", "Horse and cart"]), L(["Podkoní: „Kobyla je klidná, vůz pevný. Uveze víc než deset batohů.“", "Groom: \"Steady mare, sturdy cart.\""]), true)}
    <div id="povoz-box"><div class="panel empty">…</div></div>
    <p><button class="btn" data-go="misto/zverinec">← ${esc(t("back"))}</button></p>`));
  mountLive(view);
  view.querySelector("[data-go]").onclick = () => go("misto/zverinec");
  let r; try { r = await call("zverinec"); } catch { return; }
  const box = $("#povoz-box"); if (!box) return;
  const kresli = () => {
    const nelze = r.level < r.cart_level ? L([`Prodává se až od úrovně ${r.cart_level}.`, `Sold from level ${r.cart_level}.`]) : r.coins < r.cart_price ? L(["Nemáš dost grošů.", "Not enough coin."]) : "";
    box.innerHTML = `<article class="panel povoz-karta${r.cart ? " mas" : ""}">
      <div class="pv-obr">${IMG("mini/povoz")}</div>
      <div class="pv-text"><h3>${esc(L(["Povoz s koněm", "Horse and cart"]))}</h3>
        <ul class="pv-vyhody"><li>${esc(L(["Po výpravě sám odveze domů nebo do podniku, co se nevešlo do batohu.", "After an expedition it hauls home what didn't fit in your pack."]))}</li>
          <li>${esc(L(["Nemusíš prodávat kořist za babku u brány.", "No more selling loot cheap at the gate."]))}</li>
          <li>${esc(L(["Ustájení stojí každý týden pár grošů (výdaje u rychtáře).", "Stabling costs a few coins weekly."]))}</li></ul>
        ${r.cart ? `<p class="tag ok">${esc(L(["Povoz je tvůj.", "The cart is yours."]))}</p>`
          : `<div class="pv-koupit"><span class="price">${esc(t("coins", r.cart_price))}</span><button class="btn primary" id="povoz"${nelze ? " disabled" : ""}>${esc(L(["Koupit povoz", "Buy the cart"]))}</button>
            ${nelze ? `<small class="muted">${esc(nelze)}</small>` : ""}</div>`}</div></article>`;
    const pv = $("#povoz");
    if (pv) pv.onclick = () => call("cart_buy").then(() => { Zvuk.sfx("mince"); toast(L(["Povoz je tvůj.", "The cart is yours."])); r.cart = true; kresli(); }).catch(() => {});
  };
  kresli();
};

// r27-5: nalévárna — napít se u stolu, nebo pozvat jiného hráče na žejdlík (platí ten, kdo zve)
// r27-6: vyhlášky radnice — úkoly s příběhem (pán místa, havěť, průzkum, nález) jako přibité listiny
VIEWS.vyhlasky = async (view) => {
  view.replaceChildren(h(`${sceneHead("mesto-radnice", L(["Vyhlášky radnice", "Town proclamations"]), L(["Písař: „Konšelé hledají odvážné. Odměna je slušná a jméno ve městě ještě lepší.“", "Clerk: \"The council seeks the brave.\""]), true)}
    <div id="vyh" class="vyh"><div class="panel empty">…</div></div>
    <p><button class="btn" data-go="misto/radnice">← ${esc(t("back"))}</button></p>`));
  mountLive(view);
  view.querySelector("[data-go]").onclick = () => go("misto/radnice");
  const IK = { pan: "👑", havet: "⚔️", pruzkum: "🧭", nalez: "🔎" };
  const DR = { pan: ["Odměna za hlavu", "Bounty"], havet: ["Vyčistit kraj", "Clear the land"], pruzkum: ["Průzkum", "Scouting"], nalez: ["Hledá se", "Wanted item"] };
  const kdy = odpocet;
  const kresli = (r, note = "") => {
    const box = $("#vyh"); if (!box) return;
    const moje = Object.fromEntries(r.moje.map((x) => [x.id, x]));
    box.innerHTML = `${note ? `<div class="panel notice">${dmd(note)}</div>` : ""}
      <div class="vyh-info muted small">${esc(L([`Nabídka se mění — další vyhlášky možná za ${kdy(r.next)} · rozpracované nejvýš ${r.max} · splněno celkem ${r.done}`, `Offers change — maybe more in ${kdy(r.next)} · max ${r.max} at once · done ${r.done}`]))}</div>
      ${r.vyhlasky.length ? "" : `<div class="panel vyh-prazdno"><b>${esc(L(["Dveře radnice jsou teď prázdné.", "The town hall door is bare."]))}</b><p class="muted">${esc(L(["Konšelé zrovna nic nevyvěsili. Zkus to později.", "Nothing posted right now. Try later."]))}</p></div>`}
      <div class="vyh-desky">${r.vyhlasky.map((v) => { const m = moje[v.id];
        if (v.zamceno) return `<article class="vyh-list ${v.kind} drzi-jiny"><i class="vyh-hreb"></i>
          <header><span class="vyh-druh">🔒 ${esc(L(["Zamčeno", "Taken"]))}</span><span class="vyh-lvl">${esc(L(["od úr. ", "lvl "]) + v.level)}</span></header>
          <h3>${esc(v.title)}</h3><p class="vyh-kde">${esc(L(["Zakázku si vzal ", "Taken by "]) + v.kdo + L([". Když ji vzdá, znovu se uvolní.", ". It frees up if they drop it."]))}</p></article>`;
        return `<article class="vyh-list ${v.kind}${m ? " moje" : ""}${v.smi ? "" : " zamceno"}"><i class="vyh-hreb"></i>
          <header><span class="vyh-druh">${IK[v.kind]} ${esc(L(DR[v.kind]))}</span><span class="vyh-lvl">${esc(L(["od úr. ", "lvl "]) + v.level)}</span></header>
          <h3>${esc(v.title)}</h3>${(() => { const [pr, ...po] = String(v.text).split("\n-# ");
            return `<p class="vyh-pribeh">${dmd(pr).replace(/^<p>|<\/p>$/g, "")}</p>${po.length ? `<p class="vyh-kde">${dmd(po.join(" ")).replace(/^<p>|<\/p>$/g, "")}</p>` : ""}`; })()}
          <div class="vyh-odmena"><span>🪙 ${v.coins} gr.</span><span>✨ ${v.xp} ZK</span><span>📜 ${esc(L(["pověst +", "renown +"]) + v.renown)}</span>${v.item ? `<span>🎁 ${esc(v.item)}</span>` : ""}</div>
          ${m ? `<div class="vyh-postup"><span class="vbar"><i style="width:${Math.min(100, 100 * m.prog / m.need)}%"></i></span><b>${Math.min(m.prog, m.need)} / ${m.need}</b></div>` : ""}
          <footer><small>${esc(L(["visí ještě ", "expires in "]) + kdy(v.ends))}</small>
            ${m ? (m.ready ? `<button class="btn primary" data-cid="ks:vyh:give:${v.id}">${esc(L(["Odevzdat a vybrat odměnu", "Turn in"]))}</button>` : `<button class="btn small" data-cid="ks:vyh:drop:${v.id}">${esc(L(["Vzdát", "Drop"]))}</button>`)
              : `<button class="btn primary" data-cid="ks:vyh:take:${v.id}"${v.smi && r.moje.length < r.max ? "" : " disabled"}>${esc(v.smi ? L(["Přijmout úkol", "Accept"]) : L(["Zatím nízká úroveň", "Level too low"]))}</button>`}</footer></article>`; }).join("")}</div>`;
    box.querySelectorAll("[data-cid]").forEach((b) => b.onclick = async () => {
      b.disabled = true; Zvuk.sfx("stranka");
      try { const x = await call("raid_click", { id: b.dataset.cid, values: [] }); const rr = await call("vyhlasky", {}, true);
        const n = x.panel && x.panel.content ? (/^(✅|💰|Úkol).*$/m.exec(x.panel.content) || [""])[0] : ""; kresli(rr.vyhlasky, n); if (/^💰/.test(n)) Zvuk.sfx("mince"); }
      catch { b.disabled = false; }
    });
  };
  try { kresli((await call("vyhlasky")).vyhlasky); } catch { /* chyba v toastu */ }
};

// r27-6: obyvatelé — přehledná kniha s hledáním, filtry a řazením (i pro stovky hráčů)
const OBY = { q: "", stav: "vse", puvod: "", razeni: "stav", strana: 0 };
VIEWS.obyvatele = async (view) => {
  view.replaceChildren(h(`${sceneHead("mesto-radnice", L(["Obyvatelé Kutné Hory", "Townsfolk of Kutná Hora"]), L(["Písař: „Kdo tu žije, toho mám v knize. Hledej po jméně.“", "Clerk: \"Everyone who lives here is in my book.\""]), true)}
    <div id="oby"><div class="panel empty">…</div></div>
    <p><button class="btn" data-go="misto/radnice">← ${esc(t("back"))}</button></p>`));
  mountLive(view);
  view.querySelector("[data-go]").onclick = () => go("misto/radnice");
  let D; try { D = (await call("obyvatele")).obyvatele; } catch { return; }
  const box = $("#oby"); if (!box) return;
  const NA_STR = 25;
  const STAV = [["vse", ["Všichni", "All"]], ["0", ["Ve hře", "In game"]], ["1", ["Na výpravě", "On expedition"]], ["2", ["Mimo hru", "Away"]]];
  const puvody = [...new Set(D.lide.map((x) => x.origin).filter(Boolean))].sort();
  const pocet = (s) => s === "vse" ? D.lide.length : D.lide.filter((x) => String(x.stav) === s).length;
  const kdy = (ts) => { if (!ts) return "—"; const m = Math.round((Date.now() - ts * 1000) / 60000);
    return m < 60 ? L(["před ", ""]) + m + " min" + L(["", " ago"]) : m < 1440 ? L(["před ", ""]) + Math.round(m / 60) + " h" + L(["", " ago"]) : L(["před ", ""]) + Math.round(m / 1440) + L([" d.", " d ago"]); };
  const nm = (s) => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const kresli = () => {
    let r = D.lide.filter((x) => (OBY.stav === "vse" || String(x.stav) === OBY.stav) && (!OBY.puvod || x.origin === OBY.puvod) && (!OBY.q || nm(x.name).includes(nm(OBY.q))));
    const S2 = { stav: (a, b) => a.stav - b.stav || b.renown - a.renown, povest: (a, b) => b.renown - a.renown, uroven: (a, b) => b.level - a.level || b.renown - a.renown, jmeno: (a, b) => a.name.localeCompare(b.name, "cs") };
    r = r.slice().sort(S2[OBY.razeni] || S2.stav);
    const stran = Math.max(1, Math.ceil(r.length / NA_STR)); OBY.strana = Math.min(OBY.strana, stran - 1);
    const kus = r.slice(OBY.strana * NA_STR, (OBY.strana + 1) * NA_STR);
    box.querySelector(".oby-pocet").textContent = L([`Nalezeno ${r.length} z ${D.lide.length}`, `${r.length} of ${D.lide.length}`]);
    box.querySelector(".oby-telo").innerHTML = kus.length ? kus.map((x) => `<div class="oby-radek s${x.stav}${x.ja ? " ja" : ""}">
        <span class="oby-tecka" title="${esc(L(STAV[x.stav + 1][1]))}"></span>
        <span class="oby-jmeno"><b>${esc(x.name)}</b>${x.ja ? `<em>${esc(L(["ty", "you"]))}</em>` : ""}${x.citizen ? `<i class="oby-zn">${esc(L(["měšťan", "burgher"]))}</i>` : ""}${x.arms ? `<i class="oby-zn">${esc(L(["erb", "arms"]))}</i>` : ""}${x.wanted ? `<i class="oby-zn hl">${esc(L(["hledaný", "wanted"]))}</i>` : ""}</span>
        <span class="oby-ur">${x.level}</span>
        <span class="oby-puv">${esc(x.origin)}</span>
        <span class="oby-pov">${esc(x.renown_label)} <small>${x.renown}</small></span>
        <span class="oby-maj">${esc(x.own.join(" · ") || "—")}</span>
        <span class="oby-kde">${x.stav === 1 ? esc(x.kde) : x.stav === 0 ? esc(L(["ve městě", "in town"])) : esc(kdy(x.seen))}</span></div>`).join("")
      : `<p class="oby-nic">${esc(L(["Nikoho takového písař v knize nemá.", "Nobody like that in the book."]))}</p>`;
    box.querySelector(".oby-strany").innerHTML = stran > 1 ? `<button class="btn small" data-str="-1"${OBY.strana ? "" : " disabled"}>‹</button><span>${OBY.strana + 1} / ${stran}</span><button class="btn small" data-str="1"${OBY.strana < stran - 1 ? "" : " disabled"}>›</button>` : "";
    box.querySelectorAll("[data-str]").forEach((b) => b.onclick = () => { OBY.strana += +b.dataset.str; kresli(); });
    box.querySelectorAll("[data-stav]").forEach((b) => b.classList.toggle("on", b.dataset.stav === OBY.stav));
  };
  box.innerHTML = `<div class="oby">
    <div class="oby-souhrn">${STAV.slice(1).map(([k, n]) => `<div class="oby-dl s${k}"><b>${pocet(k)}</b><small>${esc(L(n))}</small></div>`).join("")}<div class="oby-dl"><b>${D.lide.length}</b><small>${esc(L(["v knize celkem", "in the book"]))}</small></div></div>
    <div class="oby-nastroje">
      <input class="search" id="oby-q" placeholder="${esc(L(["Hledat jméno…", "Search name…"]))}" value="${esc(OBY.q)}">
      <div class="oby-stavy">${STAV.map(([k, n]) => `<button class="chip" data-stav="${k}">${esc(L(n))} · ${pocet(k)}</button>`).join("")}</div>
      <select id="oby-puv"><option value="">${esc(L(["Všechny původy", "All origins"]))}</option>${puvody.map((p) => `<option${p === OBY.puvod ? " selected" : ""}>${esc(p)}</option>`).join("")}</select>
      <select id="oby-raz">${[["stav", ["Kdo je ve hře", "Who is in game"]], ["povest", ["Podle pověsti", "By renown"]], ["uroven", ["Podle úrovně", "By level"]], ["jmeno", ["Podle jména", "By name"]]].map(([k, n]) => `<option value="${k}"${k === OBY.razeni ? " selected" : ""}>${esc(L(n))}</option>`).join("")}</select>
    </div>
    <div class="oby-tabulka"><div class="oby-radek hlava"><span></span><span>${esc(L(["Jméno", "Name"]))}</span><span>${esc(L(["Úr.", "Lv"]))}</span><span>${esc(L(["Původ", "Origin"]))}</span><span>${esc(L(["Pověst", "Renown"]))}</span><span>${esc(L(["Majetek", "Property"]))}</span><span>${esc(L(["Kde / naposledy", "Where / last seen"]))}</span></div>
      <div class="oby-telo"></div></div>
    <div class="oby-pata"><small class="oby-pocet"></small><div class="oby-strany"></div></div>
    <p class="muted small">${esc(L([`„Ve hře“ = hrál na webu nebo na Discordu v posledních ${D.online_min} minutách.`, `"In game" = played in the last ${D.online_min} minutes.`]))}</p></div>`;
  box.querySelector("#oby-q").oninput = (e) => { OBY.q = e.target.value; OBY.strana = 0; kresli(); };
  box.querySelector("#oby-puv").onchange = (e) => { OBY.puvod = e.target.value; OBY.strana = 0; kresli(); };
  box.querySelector("#oby-raz").onchange = (e) => { OBY.razeni = e.target.value; kresli(); };
  box.querySelectorAll("[data-stav]").forEach((b) => b.onclick = () => { OBY.stav = b.dataset.stav; OBY.strana = 0; kresli(); });
  kresli();
};

// r27-6: pořadí týdne — kategorie v záložkách, stupně vítězů, celé pořadí a tvoje místo
const PORADI = { kat: "coins" };
VIEWS.poradi = async (view) => {
  view.replaceChildren(h(`${sceneHead("mesto-radnice", L(["Pořadí tohoto týdne", "This week's ranking"]), L(["Hlasatel: „Slyšte, slyšte! Kdo se tento týden nejvíc proslavil?“", "Crier: \"Hear ye! Who earned the most fame this week?\""]), true)}
    <div id="por"><div class="panel empty">…</div></div>
    <p><button class="btn" data-go="misto/radnice">← ${esc(t("back"))}</button></p>`));
  mountLive(view);
  view.querySelector("[data-go]").onclick = () => go("misto/radnice");
  let D; try { D = (await call("poradi")).poradi; } catch { return; }
  const box = $("#por"); if (!box) return;
  const TV = { "gr.": ["gr.", "gr.", "gr."], "pánů míst": ["pán místa", "páni místa", "pánů míst"], "výher": ["výhra", "výhry", "výher"], "výprav": ["výprava", "výpravy", "výprav"], "b.": ["b.", "b.", "b."] };
  const kolik = (v, u) => { const t2 = TV[u] || [u, u, u]; return v + " " + (v === 1 ? t2[0] : v >= 2 && v <= 4 ? t2[1] : t2[2]); };
  const kresli = () => {
    const K = D.kategorie.find((k) => k.key === PORADI.kat) || D.kategorie[0];
    const r = K.rows, top = [r[1], r[0], r[2]];
    box.innerHTML = `<div class="por">
      <div class="por-hlava"><div class="por-kat">${D.kategorie.map((k) => `<button class="chip${k.key === K.key ? " on" : ""}" data-kat="${k.key}">${esc(k.name)}</button>`).join("")}</div>
        <small>${esc(L(["Nuluje se v pondělí — za ", "Resets on Monday — in "]) + odpocet(D.reset))}</small></div>
      ${r.length ? `<div class="por-stupne">${top.map((x, i) => x ? `<div class="por-st m${x.place}${x.ja ? " ja" : ""}"><span class="por-medaile">${x.place}</span><b>${esc(x.name)}</b><small>${esc(kolik(x.value, K.unit))}</small><div class="por-podest"></div></div>` : `<div class="por-st prazdny"></div>`).join("")}</div>
        ${r.length > 3 ? `<ol class="por-seznam" start="4">${r.slice(3).map((x) => `<li class="${x.ja ? "ja" : ""}"><span class="por-m">${x.place}.</span><span>${esc(x.name)}</span><b>${esc(kolik(x.value, K.unit))}</b></li>`).join("")}</ol>` : ""}`
        : `<p class="por-nic">${esc(L(["Tento týden tu zatím nikdo nebodoval. Buď první!", "Nobody has scored yet this week. Be the first!"]))}</p>`}
      <div class="por-ja">${K.me ? esc(L(["Tvoje místo: ", "Your place: "]) + K.me.place + ". z " + K.count + " · " + kolik(K.me.value, K.unit)) : esc(L(["V této kategorii jsi tento týden ještě nebodoval.", "You haven't scored here this week."]))}</div></div>`;
    box.querySelectorAll("[data-kat]").forEach((b) => b.onclick = () => { PORADI.kat = b.dataset.kat; kresli(); });
  };
  kresli();
};

// r27-6: dar městu nebo kostelu — pokladnice, postup k odznakům, vlastní částka
VIEWS.dar = async (view) => {
  const kde = S.arg === "chram" ? "chram" : "mesto";
  const zpet = kde === "chram" ? "misto/chram" : "misto/radnice";
  view.replaceChildren(h(`${sceneHead(kde === "chram" ? "mesto-chram" : "mesto-radnice", L(kde === "chram" ? ["Dar kostelu svaté Barbory", "Gift to St Barbara's"] : ["Dar městu Kutná Hora", "Gift to the town"]),
      L(kde === "chram" ? ["Kostelník: „Každý groš na opravu střechy se počítá. Bůh vidí.“", "Sexton: \"Every coin for the roof counts.\""] : ["Konšel: „Město nezapomíná na ty, kdo mu pomohou.“", "Councillor: \"The town remembers its benefactors.\""]), true)}
    <div id="dar"><div class="panel empty">…</div></div>
    <p><button class="btn" data-go="${zpet}">← ${esc(t("back"))}</button></p>`));
  mountLive(view);
  view.querySelector("[data-go]").onclick = () => go(zpet);
  const kresli = (note = "") => {
    const box = $("#dar"); if (!box) return;
    const D = S.me.donated || 0, mam = S.me.coins || 0, ODZ = [[1000, ["Dobrodinec", "Benefactor"]], [10000, ["Velký dobrodinec", "Great benefactor"]]];
    const dalsi = ODZ.find(([n]) => D < n), od = dalsi ? (ODZ[ODZ.indexOf(dalsi) - 1] || [0])[0] : 10000;
    let castka = Math.min(mam, 100);
    box.innerHTML = `${note ? `<div class="panel notice">${dmd(note)}</div>` : ""}<div class="dar">
      <section class="dar-pokladnice">
        <small>${esc(L(["Zatím jsi daroval", "Given so far"]))}</small><b class="dar-suma">${D} gr.</b>
        <div class="dar-odznaky">${ODZ.map(([n, nz]) => `<div class="dar-odz${D >= n ? " ma" : ""}"><span>${D >= n ? "✦" : n}</span><small>${esc(L(nz))}${D >= n ? "" : " · " + n + " gr."}</small></div>`).join("")}</div>
        ${dalsi ? `<div class="dar-postup"><span class="vbar"><i style="width:${Math.min(100, 100 * (D - od) / (dalsi[0] - od))}%"></i></span>
          <small>${esc(L([`Do odznaku ${L(dalsi[1])} chybí ${dalsi[0] - D} gr.`, `${dalsi[0] - D} gr. to ${L(dalsi[1])}`]))}</small></div>` : `<p>${esc(L(["Máš oba odznaky dobrodince.", "You hold both benefactor badges."]))}</p>`}
        <p class="dar-proc">${esc(L(["Dary jdou na opravy, chudé a stavby — do kasy světa, odkud se vracejí do hry. Dárci se zapisují do Kroniky slavných (Dobrodinci). Každých 50 gr. = +1 pověst.", "Gifts go to repairs, the poor and building — back into the world. Every 50 gr. = +1 renown."]))}</p>
      </section>
      <section class="dar-volba">
        <h3>${esc(L(["Kolik daruješ?", "How much?"]))}</h3>
        <p class="muted">${esc(L(["Máš u sebe ", "In your purse: "]) + mam + " gr.")}</p>
        ${mam >= 50 ? `<div class="dar-rychle">${[50, 100, 500, 1000, 5000].filter((n) => n <= mam).map((n) => `<button class="chip" data-c="${n}">${n} gr.</button>`).join("")}</div>
          <div class="dar-vlastni"><input type="range" id="dar-r" min="50" max="${mam}" step="10" value="${Math.max(50, castka)}"><input type="number" id="dar-n" min="50" max="${mam}" value="${Math.max(50, castka)}"></div>
          <p class="dar-pov" id="dar-pov"></p>
          <button class="btn primary big" id="dar-ok"></button>`
          : `<p class="vyd-pozor">${esc(L(["Nejmenší dar je 50 gr.", "The smallest gift is 50 gr."]))}</p>`}
      </section></div>`;
    const r = box.querySelector("#dar-r"), n = box.querySelector("#dar-n"), ok = box.querySelector("#dar-ok");
    if (!ok) return;
    const nastav = (v) => { castka = Math.max(50, Math.min(mam, Math.round(+v || 50))); r.value = n.value = castka;
      ok.textContent = L(["Darovat ", "Give "]) + castka + " gr."; box.querySelector("#dar-pov").textContent = L(["pověst +", "renown +"]) + Math.floor((D + castka) / 50 - Math.floor(D / 50));
      box.querySelectorAll("[data-c]").forEach((b) => b.classList.toggle("on", +b.dataset.c === castka)); };
    r.oninput = () => nastav(r.value); n.onchange = () => nastav(n.value);
    box.querySelectorAll("[data-c]").forEach((b) => b.onclick = () => nastav(b.dataset.c));
    nastav(castka);
    ok.onclick = async () => { ok.disabled = true;
      try { const x = await call("raid_click", { id: `ks:donate:${kde}:${castka}`, values: [] }); await call("me", {}, true).catch(() => {});
        const t2 = x.panel && x.panel.content ? (/^(✅|🎁|Děkuj|Dar).*$/m.exec(x.panel.content.split("\n").slice(-3).join("\n")) || [""])[0] : "";
        if (typeof Zvuk !== "undefined") Zvuk.sfx("mince"); kresli(t2 || L([`Darováno ${castka} gr. Děkujeme.`, `Gave ${castka} gr. Thank you.`])); }
      catch { ok.disabled = false; } };
  };
  kresli();
};

// r27-6: výdaje a dluhy jako účet od rychtáře (místo starého textového panelu)
VIEWS.vydaje = async (view) => {
  view.replaceChildren(h(`${sceneHead("mesto-radnice", L(["Výdaje a dluhy", "Bills and debts"]), L(["Rychtář: „Co se jednou zapíše, to se platí. Každý týden.“", "Reeve: \"What is written gets paid. Every week.\""]), true)}
    <div id="vydaje"><div class="panel empty">…</div></div>
    <p><button class="btn" data-go="misto/radnice-rychtar">← ${esc(t("back"))}</button></p>`));
  mountLive(view);
  view.querySelector("[data-go]").onclick = () => go("misto/radnice-rychtar");
  const sv = (d) => `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const IK = { house: sv('<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>'),
    business: sv('<path d="M4 20h16"/><path d="M6 20v-5h12v5"/><path d="M9 15V9l3-4 3 4v6"/>'),
    pet: sv('<circle cx="7" cy="9" r="2"/><circle cx="12" cy="6" r="2"/><circle cx="17" cy="9" r="2"/><path d="M8 17c0-3 2-5 4-5s4 2 4 5c0 2-2 2-4 2s-4 0-4-2z"/>'),
    cart: sv('<path d="M3 8h13l-2 8H5z"/><circle cx="7" cy="19" r="2"/><circle cx="14" cy="19" r="2"/><path d="M16 10h5"/>'),
    inn_chest: sv('<rect x="3" y="8" width="18" height="11" rx="1"/><path d="M3 12h18"/><path d="M5 8a7 4 0 0 1 14 0"/><rect x="10.5" y="11" width="3" height="3"/>') };
  const za = odpocet;
  const kresli = (V, note = "") => {
    const box = $("#vydaje"); if (!box) return;
    const dost = V.coins + V.bank >= V.total;
    box.innerHTML = `${note ? `<div class="panel notice">${dmd(note)}</div>` : ""}
      <div class="vyd">
        <section class="vyd-ucet">
          <header><small>${esc(L(["Účet u rychtáře", "The reeve's ledger"]))}</small><h3>${esc(L(["Týdenní platby", "Weekly payments"]))}</h3></header>
          ${V.rows.length ? `<ul class="vyd-polozky">${V.rows.map((r) => `<li${r.prepaid ? ' class="predpl"' : ""}><span class="vyd-ik">${IK[r.kind] || "•"}</span>
              <span class="vyd-co">${esc(r.label)}${r.extra ? `<small>${esc(r.extra)}</small>` : ""}</span>
              <b class="vyd-kolik">${r.amount} gr.</b></li>`).join("")}</ul>
            <div class="vyd-soucet"><span>${esc(L(["K platbě za týden", "Due per week"]))}</span><b>${V.total} gr.</b></div>`
            : `<p class="vyd-nic">${esc(L(["Žádné pravidelné platby nemáš.", "You have no regular payments."]))}</p>`}
          <footer>${esc(L(["Strhává se každý herní týden (≈ 28 hodin) z kapsy, a když nestačí, z banky.", "Taken every game week (≈ 28 h) from your purse, then from the bank."]))}</footer>
        </section>
        <aside class="vyd-bok">
          <div class="vyd-karta"><small>${esc(L(["Příští platba", "Next payment"]))}</small><b>${esc(L(["za ", "in "]) + za(V.next))}</b>
            <p class="${dost ? "" : "vyd-pozor"}">${esc(L(["Kapsa ", "Purse "]) + V.coins + L([" gr. · banka ", " gr. · bank "]) + V.bank + " gr.")}${dost ? "" : `<br>${esc(L(["Na platbu ti nezbývá — vznikne dluh.", "Not enough — a debt will arise."]))}`}</p></div>
          <div class="vyd-karta"><small>${esc(L(["Desátek za roční období", "Seasonal tithe"]))}</small><b>${V.tithe} gr.</b>
            <p>${esc(L(["Podle úrovně a majetku, vybírá se za ", "By level and wealth, collected in "]) + za(V.tithe_at) + L([". Úschovné v bance ", ". Bank fee "]) + V.bank_fee + " %.")}</p></div>
        </aside>
        ${V.debts.length ? `<section class="vyd-dluhy"><header><h3>${esc(L(["Dluhy", "Debts"]))}</h3><b>${V.debt_total} gr.</b></header>
          <ul>${V.debts.map((d) => `<li><span class="vyd-ik">${IK[d.kind] || "•"}</span><span>${esc(d.label)}</span><b>${d.amount} gr.</b></li>`).join("")}</ul>
          ${V.seize ? `<p class="vyd-pozor">${esc(L(["Truhlu v hostinci hostinský zabaví za ", "The innkeeper seizes your chest in "]) + za(V.seize) + L([", pokud dluh nezaplatíš.", " unless you pay."]))}</p>` : ""}
          <button class="btn primary" data-cid="ks:bank:paydebt:0"${V.coins + V.bank > 0 ? "" : " disabled"}>${esc(L(["Zaplatit dluhy · ", "Pay debts · "]) + V.debt_total + " gr.")}</button></section>` : ""}
      </div>`;
    box.querySelectorAll("[data-cid]").forEach((b) => b.onclick = async () => {
      b.disabled = true;
      try { const x = await call("raid_click", { id: b.dataset.cid, values: [] }); const rr = await call("vydaje", {}, true);
        const n = x.panel && x.panel.content ? (/^✅.*$/m.exec(x.panel.content) || [""])[0] : ""; kresli(rr.vydaje, n); if (n && typeof Zvuk !== "undefined") Zvuk.sfx("mince"); call("me", {}, true).catch(() => {}); }
      catch { b.disabled = false; }
    });
  };
  try { kresli((await call("vydaje")).vydaje); } catch { /* chyba v toastu */ }
};

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
            <div><div class="nm">${esc(n.name)}</div><div class="meta">${n.fx ? `<b class="fx">${esc(n.fx)}</b>` : esc(L(["síla ", "strength "]) + "+" + n.sila + " %")}</div></div>
            <div class="acts"><span class="price">${esc(t("coins", n.price))}</span>
              <button class="btn small primary" data-pij="${esc(n.id)}"${n.price > r.coins ? " disabled" : ""}>${esc(host ? L(["Pozvat", "Treat"]) : L(["Vypít", "Drink"]))}</button></div></div>`).join("")}</div></div>
        <div class="panel"><h3>${esc(L(["Pozvat na žejdlík", "Treat a player"]))}</h3>
          <p class="muted small">${esc(L(["Vyber hosta a pak nápoj vlevo. Platíš ty, pije on — a v hospodských řečech se to ozve.", "Pick a guest, then a drink. You pay, they drink."]))}</p>
          <div class="hoste"><button class="chip${host ? "" : " on"}" data-host="">${esc(L(["Nikoho — piju sám", "Nobody — for me"]))}</button>
          ${r.hoste.map((x) => `<button class="chip${host === x.id ? " on" : ""}" data-host="${esc(x.id)}"><i class="tecka-on"></i>${esc(x.name)} <small>${x.level}</small></button>`).join("")}</div>
          ${r.hoste.length ? "" : `<p class="muted small">${esc(L(["Nikdo další teď ve hře není — pozvat jde jen hráče, kteří jsou zrovna ve hře.", "Nobody else is in the game right now."]))}</p>`}
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
    if (!chatRebuild(box, r.souboje.map((d) => {
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
    }).join("") + `<p class="muted small">${esc(L(["Kurz se mění podle sázek — čím víc lidí sází na jednoho, tím méně se na něm vydělá. Na jeden souboj nejvýš ", "Odds follow the bets. Max per duel: "]) + r.max + " gr.")}</p>`,
      Object.fromEntries(r.souboje.map((d) => ["souboj:" + d.id, d.chat])))) return;
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
// r27-6: zvíře stojí nohama na zemi náhledu — změří se prázdné místo pod nohama v obrázku (každé zvíře má jiné)
function postavNaZem(wrap) {
  const img = wrap && wrap.querySelector("img"); if (!img) return;
  const mer = () => {
    const i = new Image(); i.crossOrigin = "anonymous";
    i.onload = () => {
      try {
        const c = document.createElement("canvas"); c.width = 64; c.height = 96;
        const x = c.getContext("2d", { willReadFrequently: true }); x.drawImage(i, 0, 0, 64, 96);
        const d = x.getImageData(0, 0, 64, 96).data;
        let dno = 95;
        for (; dno > 0; dno--) { let plno = false; for (let k = 0; k < 64; k++) if (d[(dno * 64 + k) * 4 + 3] > 60) { plno = true; break; } if (plno) break; }
        const prazdno = (95 - dno) / 96;                       // kolik obrázku je pod nohama prázdné
        wrap.style.transform = `translateY(calc(${(prazdno * img.clientHeight / Math.max(1, wrap.clientHeight) * 100).toFixed(2)}% - 4%))`;
        wrap.style.setProperty("--pod-px", Math.round(prazdno * img.clientHeight - 6) + "px");
      } catch { /* bez měření zůstane výchozí posun */ }
    };
    i.src = img.currentSrc || img.src;
  };
  if (img.complete && img.naturalWidth) mer(); else img.addEventListener("load", mer, { once: true });
}
/** r27-20: staty výbavy (zbraně, zbroje, přilby, štíty, oblečení) jako štítky pod názvem. */
function statyHtml(i) {
  const s = (i && i.staty) || [];
  if (!s.length) return "";
  const tr = (x) => /^OČ \+|^zranění/.test(x) ? " hl" : /\d\+$/.test(x) ? " pozor" : /^hřeje/.test(x) ? " teplo" : "";
  return `<div class="staty">${s.map(([x, d]) => `<span class="stat${tr(x)}" title="${esc(d || "")}">${esc(x)}</span>`).join("")}</div>`;
}
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
  // r27-17: vzhled podle věku (jen obrázek) a zvlášť zkušenost z výprav (bonus)
  const RANKY = ["nezkušený", "učenlivý", "ostřílený", "zkušený"];
  const rust = A.rank_dalsi ? { a: A.rank_dalsi[0], b: A.rank_dalsi[1], co: L(["výpravy do stupně ", "runs to "]) + RANKY[(A.rank || 0) + 1] } : null;
  const stupne = RANKY;
  setTimeout(() => postavNaZem(view.querySelector(".pet-zvire")), 0);
  view.replaceChildren(h(`
    <div class="grid pet-grid">
      <div class="pet-fig-obal"><div class="pet-fig live" data-img="mesto-zverinec"><div class="pet-zvire${A.hungry ? " hlad" : ""}">${obr(A)}</div></div>
        ${A.vek ? `<div class="pet-vek${A.stary ? " stary" : ""}"><small>${esc(L(["Věk", "Age"]))}</small><b>${esc(A.vek)}</b>${A.stary ? `<em>${esc(L(["v letech", "old"]))}</em>` : ""}</div>` : ""}</div>
      <div class="grid">
        <div class="panel">
          <div class="spread"><h2>${esc(A.name)}</h2><span class="pill gold">${esc(A.rank_name || A.stage_name)}</span></div>
          <p class="muted">${esc(A.kind)} · ${esc(A.stage_name)}${A.vek ? " · " + esc(A.vek) : ""}</p>
          ${A.active ? `<div class="nast-seg pet-doma"><button class="${A.doma ? "" : "on"}" data-doma="0">${esc(L(["Bere ho na výpravy", "Takes it along"]))}</button><button class="${A.doma ? "on" : ""}" data-doma="1">${esc(L(["Nechá ho doma", "Leaves it home"]))}</button></div>
            <p class="muted small">${esc(A.doma ? L(["Doma je v bezpečí, ale na výpravě nepomáhá a neroste z výprav.", "Safe at home, but no bonus on expeditions."]) : L(["Na výpravě pomáhá a roste — ale když v boji padneš, může zahynout s tebou.", "Helps and grows on expeditions — but may die if you fall."]))}</p>` : ""}
          ${A.hungry ? `<p class="upozorneni ne">${esc(L(["Hladoví — nezaplacené krmení. Nepomáhá a neroste (Rychtář → Výdaje).", "Hungry — unpaid feed."]))}</p>` : ""}
          <div class="stupne">${stupne.map((w, i) => `<span class="${i <= (A.rank || 0) ? "on" : ""}${i === (A.rank || 0) ? " ted" : ""}">${esc(w)}</span>`).join("")}</div>
          ${rust ? `<div class="bar"><div class="spread"><span>${esc(rust.co)}</span><span class="muted">${esc(Math.max(0, rust.a))} / ${esc(rust.b)}</span></div>
            <div class="track"><div class="fill xp" style="width:${Math.min(100, 100 * Math.max(0, rust.a) / rust.b)}%"></div></div></div>` : ""}
          <p class="muted small">${esc(A.progress)}</p>
        </div>
        <div class="panel pet-potreby"><h3>${esc(L(["Jak se má", "How it's doing"]))}</h3>
          ${[[L(["Zdraví", "Health"]), A.zdravi ?? 100, "hp"], [L(["Hlad", "Hunger"]), Math.max(0, 100 - A.sytost), "food", true], [L(["Spokojenost", "Content"]), A.spokojenost, "mood"]].map(([n, v, c, obr]) => `<div class="bar"><div class="spread"><span>${esc(n)}</span><span class="muted">${v} / 100</span></div>
            <div class="track"><div class="fill ${c}${(obr ? v > 80 : v < 20) ? " nizko" : ""}" style="width:${v}%"></div></div></div>`).join("")}
          ${A.napul ? `<p class="upozorneni ne">${esc(L(["Hladové nebo smutné zvíře nedává žádné bonusy. Nakrm ho a pomazli se s ním.", "A hungry or sad animal gives no bonuses."]))}</p>` : ""}
          ${A.pece < 1 ? `<p class="upozorneni">${esc(A.pece ? L(["Zvíře roste napůl rychle — chce víc jídla a mazlení (obojí aspoň 50).", "Grows at half speed — feed and cuddle it more."]) : L(["Zanedbané zvíře neroste.", "A neglected animal doesn't grow."]))}</p>` : ""}
          ${A.umira != null ? `<p class="upozorneni ne"><b>${esc(L([`Zvíře strádá — bez péče uhyne asi za ${A.umira} h hraní.`, `Neglected — it will die in about ${A.umira} h of play.`]))}</b></p>` : ""}
          <div class="row pet-akce"><button class="btn primary" data-krmit="">${esc(L(["Nakrmit (3 gr.)", "Feed (3 gr.)"]))}</button>
            ${(A.foods || []).map(([f, n]) => `<button class="btn" data-krmit="${esc(f)}">${esc(L(["Dát: ", "Give: "]) + f)} <small>×${n}</small></button>`).join("")}
            <button class="btn" data-mazlit>${esc(L(["Pomazlit se", "Cuddle"]))}</button>
            <button class="btn danger" data-prodat>${esc(L(["Prodat do zvěřince · ", "Sell · "]) + (A.prodej || 0) + " gr.")}</button></div>
          <p class="muted small">${esc(L(["Hlad roste o 1 a spokojenost opadá o půl bodu za hodinu hraní. Když nehraješ, čas pro zvíře stojí. Hladové (hlad nad 80) nebo smutné zvíře (spokojenost pod 20) nedává bonusy a ubývá mu zdraví; když zdraví dojde, uhyne a pohřbí se na hřbitově zvířátek. Opečovanému se zdraví vrací.", "Needs drop only while you play. A neglected animal gives no bonus and may die."]))}</p>
        </div>
        <div class="panel"><h3>${esc(L(["Schopnost", "Ability"]))}</h3>
          <p class="pet-bonus">${esc(A.bonus)}</p>
          <p>${esc(A.desc)}</p>
          ${(A.vlastnosti || []).length ? `<div class="pet-vlastnosti"><small>${esc(L(["Naučil se na výpravách", "Learned on expeditions"]))}</small>${A.vlastnosti.map((v) => `<span>${esc(v)}</span>`).join("")}</div>` : `<p class="muted small">${esc(L(["Na každém stupni zkušenosti se naučí jednu náhodnou vlastnost svého druhu.", "Learns a random trait at each experience stage."]))}</p>`}
          ${(A.rank || 0) < 3 ? `<p class="muted small">${esc(L(["Jako zkušený: ", "As veteran: "]) + A.full_bonus)}</p>` : ""}
        </div>
        <div class="panel"><h3>${esc(L(["Staty", "Stats"]))}</h3>
          <div class="bojstaty">
            <div><small>${esc(L(["Vzhled", "Look"]))}</small><b>${esc(A.stage_name)}</b></div>
            <div><small>${esc(L(["Věk", "Age"]))}</small><b>${esc(A.vek || "—")}</b></div>
            <div><small>${esc(L(["Zkušenost", "Experience"]))}</small><b>${esc(A.rank_name || "")}</b></div>
            <div><small>${esc(L(["Výpravy", "Runs"]))}</small><b>${esc(A.runs)}</b></div>
          </div>
          <p class="muted small">${esc(L(["Vzhled se mění s věkem zvířete. Zkušenost roste jen výpravami, na které ho vezmeš: nezkušený (bonus z poloviny), učenlivý po 5 výpravách (70 %), ostřílený po 15 (celý bonus), zkušený po 30 (ještě o kus víc).", "Looks change with age. Experience grows only on expeditions."]))}</p>
        </div>
      </div>
    </div>
    ${Z.length > 1 ? `<div class="panel" style="margin-top:18px"><h3>${esc(L(["Tvá další zvířata", "Your other animals"]))}</h3>
      <p class="muted small">${esc(L(["S sebou smíš mít nejvýš dvě zvířata, každé z jiné třídy (ptáci, psovité, kočka, fretka, myš, medvěd, mula). Myš nejde s ptákem, kočkou, fretkou ani liškou, medvěd ne s mulou.", "Up to two companions, each of a different class."]))}</p>
      <div class="zvirata">${Z.filter((z) => z !== A).map((z) => { const ne = petNeSpolu(A.kind, z.kind);
        return z.druhy ? `<div class="zvire vybrano">${obr(z)}<b>${esc(z.name)}</b><small>${esc(z.kind + " · " + z.stage_name + " · " + z.bonus)}</small>
          <small class="vzit">${esc(L(["jde s tebou", "with you"]))}</small><span class="zv-tl"><button type="button" class="btn small" data-vzit="${esc(z.kind)}">${esc(L(["Pečovat", "Care"]))}</button><button type="button" class="btn small" data-solo="1">${esc(L(["Nechat doma", "Leave home"]))}</button></span></div>`
        : `<button type="button" class="zvire" data-vzit="${esc(z.kind)}">${obr(z)}<b>${esc(z.name)}</b>
        <small>${esc(z.kind + " · " + z.stage_name + " · " + z.bonus)}</small><small class="vzit">${esc(ne ? L(["Vzít místo ", "Take instead of "]) + A.name : L(["Vzít s sebou", "Take along"]))}</small>${ne ? `<small class="dim">${esc(ne)}</small>` : ""}</button>`; }).join("")}</div></div>` : ""}`));
  mountLive(view, { still: true });
  const zv = (data, msg) => call("zvire", { kind: A.kind, ...data }).then(() => { Zvuk.sfx("klik"); toast(msg); render(); }).catch(() => {});
  view.querySelectorAll("[data-doma]").forEach((b) => b.onclick = () => zv({ act: "doma", doma: b.dataset.doma === "1" }, b.dataset.doma === "1" ? L(["Zůstane doma.", "Stays home."]) : L(["Půjde s tebou na výpravy.", "Joins your expeditions."])));
  const pr = view.querySelector("[data-prodat]");
  if (pr) pr.onclick = () => { if (confirm(L([`Opravdu prodat ${A.name} do zvěřince za ${A.prodej} gr.? Zvíře už nevrátíš.`, `Sell ${A.name} for ${A.prodej} gr.?`]))) call("zvire", { kind: A.kind, act: "prodat" }).then((r) => { Zvuk.sfx("mince"); toast(L([`Prodáno za ${r.price} gr.`, `Sold for ${r.price} gr.`])); render(); }).catch(() => {}); };
  view.querySelectorAll("[data-krmit]").forEach((b) => b.onclick = () => { b.disabled = true; zv({ act: "krmit", food: b.dataset.krmit || null }, L([`${A.name} se pustil(a) do jídla.`, `${A.name} eats.`])); });
  const mz = view.querySelector("[data-mazlit]");
  if (mz) mz.onclick = () => { mz.disabled = true; zv({ act: "pomazlit" }, L([`${A.name} spokojeně vrní.`, `${A.name} is pleased.`])); };
  const so = view.querySelector("[data-solo]");
  if (so) so.onclick = async () => { so.disabled = true; try { await call("raid_click", { id: "ks:pet:solo" }); await call("me"); toast(L(["Zůstane doma.", "Stays home."])); render(); } catch { so.disabled = false; } };
  view.querySelectorAll("[data-vzit]").forEach((b) => b.onclick = async () => {
    b.disabled = true;
    try { await call("raid_click", { id: "ks:pet:set", values: [b.dataset.vzit] }); await call("me"); toast(L(["Vzal sis ", "Now with you: "]) + b.dataset.vzit); render(); }
    catch { b.disabled = false; }
  });
};

// r27-4: záložka Deník — výpravy, zápisky, písemnosti, odznaky
const DENIK = { sekce: "vypravy", data: null, otevrena: null };
// r27-6: odznaky — vlastní kovaný znak pro každý (tvar, kov, stužka a symbol podle tématu)
const ODZNAKY = {
  "Lovec příšer": ["stit", "stribro", "#7a1f14", `<circle cx="0" cy="-2" r="7"/><path d="M-3 -3 h0.1 M3 -3 h0.1 M-3 4 L-2 7 L0 5 L2 7 L3 4"/>`],
  "Legenda": ["hvezda", "zlato", "#3b4f68", `<path d="M0 -9 L2.4 -2.8 L9 -2.6 L3.8 1.6 L5.6 8 L0 4.4 L-5.6 8 L-3.8 1.6 L-9 -2.6 L-2.4 -2.8 Z"/>`],
  "Postrach pánů míst": ["stit", "zlato", "#7a1f14", `<path d="M-8 6 L-2 -8 L1 -2 L4 -7 L8 6 Z M-4 6 V9 M4 6 V9"/>`],
  "Matador stezek": ["kruh", "bronz", "#4f6a3a", `<path d="M-8 6 C-4 -2 0 6 4 -2 C6 -6 8 -6 8 -6 M-8 6 h0.1 M5 -8 L8 -6 L6 -3"/>`],
  "Zbohatlík": ["kruh", "zlato", "#7a5a12", `<circle r="7"/><circle r="4"/><path d="M0 -2 V2"/>`],
  "Přítel zvířat": ["kruh", "bronz", "#4f6a3a", `<circle cx="-4" cy="-5" r="1.8"/><circle cx="0" cy="-7" r="1.8"/><circle cx="4" cy="-5" r="1.8"/><path d="M-5 4 C-5 -2 5 -2 5 4 C5 7 -5 7 -5 4 Z"/>`],
  "Sběratel": ["kosoctverec", "stribro", "#5a3a7a", `<path d="M0 -8 L6 -1 L0 8 L-6 -1 Z M-6 -1 H6 M-2 -1 L0 8 L2 -1"/>`],
  "Spolehlivý najatec": ["stit", "bronz", "#3b4f68", `<rect x="-6" y="-8" width="12" height="15" rx="1"/><path d="M-3 -4 H3 M-3 0 H3 M-3 4 H1"/>`],
  "Hledač pokladů": ["kruh", "zlato", "#5a3a1a", `<path d="M-7 -2 H7 V7 H-7 Z M-7 -2 C-7 -8 7 -8 7 -2 M-1 1 H1 V4 H-1 Z"/>`],
  "Pán kraje": ["hvezda", "zlato", "#7a1f14", `<path d="M-8 4 L-8 -5 L-4 -1 L0 -7 L4 -1 L8 -5 L8 4 Z M-8 7 H8"/>`],
  "Mistr kolbiště": ["stit", "stribro", "#7a1f14", `<path d="M-7 7 L6 -6 M7 7 L-6 -6 M-8 4 L-4 8 M8 4 L4 8"/>`],
  "Vítěz turnaje": ["hvezda", "zlato", "#3b4f68", `<path d="M-6 -8 H6 V-3 C6 2 -6 2 -6 -3 Z M0 1 V5 M-4 8 H4 M-6 -6 C-10 -6 -9 -1 -5 -1 M6 -6 C10 -6 9 -1 5 -1"/>`],
  "Bez škrábnutí": ["stit", "stribro", "#4f6a3a", `<path d="M0 -8 L7 -5 V0 C7 5 3 8 0 9 C-3 8 -7 5 -7 0 V-5 Z M-3 0 L-1 3 L4 -3"/>`],
  "Zbožná duše": ["kruh", "zlato", "#5a3a7a", `<path d="M0 -9 V9 M-6 -3 H6"/>`],
  "Mistr podniku": ["kosoctverec", "bronz", "#5a3a1a", `<path d="M-7 0 L0 -7 L7 0 M-5 -2 V7 H5 V-2 M-1 7 V3 H1 V7"/>`],
  "Vlastníma rukama": ["kruh", "bronz", "#5a3a1a", `<path d="M-8 -5 L0 -5 L0 -1 L-8 -1 Z M-4 -1 L6 8"/>`],
  "Mistr řemesla": ["hvezda", "stribro", "#5a3a1a", `<path d="M-7 7 L3 -3 M1 -7 H7 V-2 H3 Z M7 7 L-3 -3 M-1 -7 H-7 V-2 H-3 Z"/>`],
  "Milosrdný samaritán": ["kruh", "stribro", "#7a1f14", `<path d="M0 7 C-9 0 -8 -7 -3 -7 C-1 -7 0 -5 0 -4 C0 -5 1 -7 3 -7 C8 -7 9 0 0 7 Z"/>`],
  "Mrchožrout": ["kosoctverec", "zelezo", "#2a2a2a", `<path d="M-9 0 C-5 -3 -2 -2 0 0 C2 -2 5 -3 9 0 C5 -1 2 1 0 4 C-2 1 -5 -1 -9 0 Z M0 -6 h0.1"/>`],
  "Usedlík": ["kruh", "bronz", "#4f6a3a", `<path d="M-7 1 L0 -6 L7 1 M-5 -1 V7 H5 V-1"/>`],
  "Pamětník": ["stit", "stribro", "#3b4f68", `<path d="M-6 -7 H5 C7 -7 7 -4 5 -4 M-6 -7 C-8 -7 -8 -4 -6 -4 V6 C-6 8 -4 8 -4 6 H6 V-4 M-3 -1 H3 M-3 2 H3"/>`],
  "Stařešina": ["hvezda", "zlato", "#5a3a7a", `<path d="M-4 9 V-2 C-4 -8 4 -8 4 -2 V9 M-6 9 H6 M-1 -5 h0.1 M1 -5 h0.1"/>`],
  "Velký dobrodinec": ["hvezda", "zlato", "#7a1f14", `<path d="M-8 4 L-8 -5 L-4 -1 L0 -7 L4 -1 L8 -5 L8 4 Z M-8 7 H8"/>`],
  "Dobrodinec": ["kruh", "zlato", "#7a5a12", `<path d="M0 -9 C2 -6 2 -4 0 -3 C-2 -4 -2 -6 0 -9 Z M-2 -3 H2 V8 H-2 Z"/>`],
};
const ODZ_KOV = { zlato: ["#fff0b0", "#d9a53a", "#7a5212"], stribro: ["#ffffff", "#b8bcc4", "#5a5e66"], bronz: ["#f6c89a", "#b0703a", "#5a3416"], zelezo: ["#c8c8c8", "#6a6a6a", "#2a2a2a"] };
function odznakSvg(name, got) {
  const [tvar, kov, stuha, ikona] = ODZNAKY[name] || ["kruh", "bronz", "#5a3a1a", `<circle r="5"/>`];
  const [l, m, d] = ODZ_KOV[kov], id = "oz" + Math.abs([...name].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7));
  const tvary = {
    kruh: `<circle r="27"/>`,
    stit: `<path d="M0 -28 L24 -20 V0 C24 16 10 26 0 30 C-10 26 -24 16 -24 0 V-20 Z"/>`,
    hvezda: `<path d="${Array.from({ length: 16 }, (_, i) => { const r = i % 2 ? 22 : 30, a = Math.PI * i / 8 - Math.PI / 2; return (i ? "L" : "M") + (r * Math.cos(a)).toFixed(1) + " " + (r * Math.sin(a)).toFixed(1); }).join(" ")} Z"/>`,
    kosoctverec: `<path d="M0 -30 L26 0 L0 30 L-26 0 Z"/>`,
  };
  return `<svg class="odz-svg${got ? "" : " neni"}" viewBox="-40 -40 80 92" aria-hidden="true"><defs>
    <radialGradient id="${id}" cx="35%" cy="30%"><stop offset="0" stop-color="${l}"/><stop offset=".55" stop-color="${m}"/><stop offset="1" stop-color="${d}"/></radialGradient></defs>
    <path d="M-14 18 L-18 50 L-9 44 L-4 52 L0 22 Z" fill="${stuha}"/><path d="M14 18 L18 50 L9 44 L4 52 L0 22 Z" fill="${stuha}" opacity=".85"/>
    <g fill="url(#${id})" stroke="${d}" stroke-width="2.2">${tvary[tvar]}</g>
    <g transform="scale(.86)" fill="none" stroke="${d}" stroke-width="5" opacity=".18">${tvary[tvar]}</g>
    <g transform="scale(1.7)" fill="none" stroke="${d}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${ikona}</g></svg>`;
}

VIEWS.denik = async (view) => {
  const SEK = [["vypravy", ["Výpravy", "Expeditions"]], ["pocty", ["Počty a bilance", "Tally and ledger"]], ["majetek", ["Majetek", "Property"]],
    ["mapy", ["Mapy", "Maps"]], ["zapisky", ["Zápisky", "Notes"]], ["pisemnosti", ["Písemnosti", "Writings"]], ["odznaky", ["Odznaky", "Badges"]]];
  const RIM = ["I", "II", "III", "IV", "V", "VI", "VII"];
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
        <div><small>${esc(L(["Poražení", "Slain"]))}</small><b>${p.zabito}</b></div><div><small>${esc(L(["Páni míst", "Bosses"]))}</small><b>${p.bossove}</b></div></div>
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
  } else if (DENIK.sekce === "pocty") {   // r27-6: kniha počtů — co postava dokázala a kam tekly groše
    const K = D.kniha || {}, gr = (n) => n.toLocaleString("cs-CZ") + " gr.";
    const max = Math.max(1, ...(K.bilance || []).map((r) => Math.max(r.in, r.out)));
    box.innerHTML = `<p class="kapitola">${esc(L(["Kapitola II", "Chapter II"]))}</p><h3 class="dk-nadpis">${esc(L(["Kniha počtů", "Book of tallies"]))}</h3>
      <div class="kp-pocty">${(K.pocty || []).map((p) => `<div><b>${p.v.toLocaleString("cs-CZ")}</b><small>${esc(p.n)}</small></div>`).join("")}</div>
      <div class="kp-dva"><section><h4>${esc(L(["Poražení nepřátelé", "Foes slain"]))}</h4>
        ${(K.nepratele || []).length ? `<ol class="kp-seznam">${K.nepratele.map((r) => `<li><span>${esc(r.n)}</span><b>${r.v}×</b></li>`).join("")}</ol>` : `<p class="muted small">${esc(L(["Zatím nikdo — nebo padli dřív, než se začalo počítat.", "None yet."]))}</p>`}</section>
      <section><h4>${esc(L(["Páni míst", "Lords of the land"]))}</h4>
        ${(K.pani || []).length ? `<ol class="kp-seznam pani">${K.pani.map((r) => `<li><span>${esc(r.n)}</span><b>${r.v}×</b></li>`).join("")}</ol>` : `<p class="muted small">${esc(L(["Žádný pán místa zatím nepadl tvou rukou.", "No lord has fallen to you yet."]))}</p>`}</section></div>
      <h4 class="kp-h">${esc(L(["Hospodářská bilance", "Ledger"]))}</h4>
      <div class="kp-souhrn"><div><small>${esc(L(["Příjmy", "Income"]))}</small><b class="plus">+${gr(K.prijem || 0)}</b></div>
        <div><small>${esc(L(["Výdaje", "Spending"]))}</small><b class="minus">−${gr(K.vydaj || 0)}</b></div>
        <div><small>${esc(L(["Rozdíl", "Net"]))}</small><b class="${(K.prijem || 0) >= (K.vydaj || 0) ? "plus" : "minus"}">${gr((K.prijem || 0) - (K.vydaj || 0))}</b></div>
        <div><small>${esc(L(["V měšci", "In purse"]))}</small><b>${gr(K.grose || 0)}</b></div>
        <div><small>${esc(L(["V bance", "In bank"]))}</small><b>${gr(K.banka || 0)}</b></div>${K.dluh ? `<div><small>${esc(L(["Dluh", "Loan"]))}</small><b class="minus">${gr(K.dluh)}</b></div>` : ""}</div>
      ${(K.bilance || []).length ? `<table class="kp-bil"><thead><tr><th>${esc(L(["Oblast", "Area"]))}</th><th>${esc(L(["Příjmy", "Income"]))}</th><th>${esc(L(["Výdaje", "Spending"]))}</th></tr></thead><tbody>
        ${K.bilance.map((r) => `<tr><td>${esc(r.name)}</td><td><span class="kp-bar plus" style="--w:${(100 * r.in / max).toFixed(1)}%"></span>${r.in ? "+" + gr(r.in) : "—"}</td>
          <td><span class="kp-bar minus" style="--w:${(100 * r.out / max).toFixed(1)}%"></span>${r.out ? "−" + gr(r.out) : "—"}</td></tr>`).join("")}</tbody></table>`
        : `<p class="muted small">${esc(L(["Bilance se začíná psát od této verze — každý další groš se sem zapíše.", "The ledger starts with this version."]))}</p>`}`;
  } else if (DENIK.sekce === "majetek") {
    const M = (D.kniha || {}).majetek || [];
    const veci = (o) => Object.entries(o || {}).map(([n, q]) => `<span class="kp-vec">${esc(n)}${q > 1 ? ` <b>×${q}</b>` : ""}</span>`).join("") || `<span class="muted small">${esc(L(["prázdné", "empty"]))}</span>`;
    const IK = { dum: "🏠", podnik: "⚒️", truhla: "🧰", povoz: "🐎" };
    box.innerHTML = `<p class="kapitola">${esc(L(["Kapitola III", "Chapter III"]))}</p><h3 class="dk-nadpis">${esc(L(["Majetek", "Property"]))}</h3>
      ${M.length ? M.map((x, i) => `<details class="kp-majetek"${i ? "" : " open"}><summary><span class="ic">${IK[x.kind] || "•"}</span><b>${esc(x.name)}</b>
          <small>${esc(x.kind === "podnik" ? L(["řemeslo ", "craft "]) + x.skill : x.kind === "dum" ? L(["místnosti: ", "rooms: "]) + x.rooms.length : "")}</small></summary>
        <div class="telo">
          ${x.rooms ? x.rooms.map((r) => `<p><b>${esc(r.name)}</b> <span class="muted small">(${r.items.length}/${r.slots})</span><br>${r.items.map((f) => `<span class="kp-vec">${esc(f)}</span>`).join("") || `<span class="muted small">${esc(L(["bez vybavení", "unfurnished"]))}</span>`}</p>`).join("") : ""}
          ${x.farm ? `<p><b>${esc(L(["Statek", "Farm"]))}</b>: ${esc(L(["polí ", "fields "]) + x.farm.fields)} · ${esc(L(["zvířata: ", "animals: "]) + (x.farm.animals.join(", ") || "—"))}<br>${esc(L(["Stavby: ", "Buildings: "]) + (x.farm.buildings.join(", ") || "—"))}</p>` : ""}
          ${x.kind !== "povoz" ? `<p><b>${esc(x.kind === "dum" ? L(["Truhla", "Chest"]) : x.kind === "podnik" ? L(["Truhla podniku", "Workshop chest"]) : L(["Obsah", "Contents"]))}</b><br>${veci(x.chest)}</p>` : `<p class="muted small">${esc(L(["Uveze víc kořisti z výprav.", "Carries more loot."]))}</p>`}
          ${x.pantry && Object.keys(x.pantry).length ? `<p><b>${esc(L(["Spižírna", "Pantry"]))}</b><br>${veci(x.pantry)}</p>` : ""}
        </div></details>`).join("")
      : `<div class="empty">${esc(L(["Zatím nic nevlastníš. Chalupu prodá radnice od 3. úrovně, podnik od 5.", "You own nothing yet."]))}</div>`}`;
  } else if (DENIK.sekce === "mapy") {
    const M = D.mapy || [];
    box.innerHTML = `<p class="kapitola">${esc(L(["Kapitola IV", "Chapter IV"]))}</p><h3 class="dk-nadpis">${esc(L(["Mapy", "Maps"]))}</h3>
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
    box.innerHTML = `<p class="kapitola">${esc(L(["Kapitola V", "Chapter V"]))}</p><h3 class="dk-nadpis">${esc(L(["Osobní zápisky", "Personal notes"]))}</h3>
      <p class="muted small">${esc(L(["Co si chceš pamatovat — kdo ti dluží, kde jsi viděl poklad, co koupit. Vidíš je jen ty.", "Only you can see these."]))}</p>
      <textarea id="zapisky" class="zapisky" maxlength="8000" placeholder="${esc(L(["Léta Páně 1403…", "Anno Domini 1403…"]))}">${esc(D.zapisky || "")}</textarea>
      <div class="row"><button class="btn primary" id="zap-ulozit">${esc(L(["Uložit zápisky", "Save notes"]))}</button><span class="muted small" id="zap-stav"></span></div>`;
    const ta = $("#zapisky"), st = $("#zap-stav");
    const uloz = async () => { try { await call("zapisky", { text: ta.value }, true); st.textContent = L(["Uloženo.", "Saved."]); } catch {} };
    $("#zap-ulozit").onclick = uloz;
    let tm; ta.oninput = () => { st.textContent = L(["Neuloženo…", "Unsaved…"]); clearTimeout(tm); tm = setTimeout(uloz, 2500); };
  } else if (DENIK.sekce === "pisemnosti") {
    box.innerHTML = `<p class="kapitola">${esc(L(["Kapitola VI", "Chapter VI"]))}</p><h3 class="dk-nadpis">${esc(L(["Knihy a písemnosti", "Books and writings"]))}</h3>
      ${D.pisemnosti.length ? D.pisemnosti.map((w) => `<details class="pisemnost"${DENIK.otevrena === w.name ? " open" : ""} data-n="${esc(w.name)}"><summary>${icon(w.name)}
          <span><b>${esc(w.name)}</b><small>${esc(w.kind + (w.have ? "" : L([" · už ji u sebe nemáš", " · no longer carried"])))}</small></span></summary>
        <div class="pergamen">${dmd(w.text)}</div></details>`).join("")
      : `<div class="empty">${esc(L(["Zatím žádná kniha ani list. Najdeš je na výpravách, u písaře a vetešníka — sem se zapíšou samy.", "No writings yet."]))}</div>`}`;
    box.querySelectorAll("details").forEach((d) => d.addEventListener("toggle", () => { if (d.open) DENIK.otevrena = d.dataset.n; }));
    loadIcons(D.pisemnosti.map((w) => w.name));
  } else {
    const mam = D.odznaky.filter((o) => o.got).length;
    box.innerHTML = `<p class="kapitola">${esc(L(["Kapitola VII", "Chapter VII"]))}</p><div class="spread"><h3 class="dk-nadpis">${esc(L(["Odznaky a ocenění", "Badges and honours"]))}</h3><span class="pill gold">${mam} / ${D.odznaky.length}</span></div>
      <div class="odznaky">${D.odznaky.map((o) => `<div class="odznak${o.got ? " ma" : ""}" title="${esc(o.desc)}">${odznakSvg(o.name, o.got)}
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
// r27-5: bezpečnost — žádné vložené obsluhy událostí (onerror="…"); chybějící obrázky řeší jeden posluchač
document.addEventListener("error", (e) => {
  const im = e.target;
  if (!im || im.tagName !== "IMG") return;
  if (im.classList.contains("malovana") && typeof ikonaZaloha === "function") ikonaZaloha(im);
  else if (im.hasAttribute("data-pryc-pri-chybe")) im.remove();
}, true);
// r27-5: ikona hry na ploše telefonu (zástupce webu, PWA). Nic se neinstaluje odjinud — ikona jen otevře tuto stránku.
const PLOCHA = { e: null };
const plochaMobil = () => matchMedia("(pointer:coarse)").matches || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const plochaIos = () => /iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const plochaMa = () => matchMedia("(display-mode: standalone)").matches || navigator.standalone === true || store.get("plocha") === "1";
if ("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("sw.js").catch(() => {});
addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); PLOCHA.e = e; });
addEventListener("appinstalled", () => { store.set("plocha", "1"); PLOCHA.e = null; });
/** Nabídne přidání ikony na plochu. Musí běžet přímo z kliknutí (prohlížeč to jinak nedovolí). */
function nabidniPlochu() {
  if (plochaMa()) { toast(L(["Ikona hry už na ploše je.", "The icon is already on your home screen."])); return; }
  if (PLOCHA.e) {
    const e = PLOCHA.e; PLOCHA.e = null;
    e.prompt();
    e.userChoice.then((r) => { if (r && r.outcome === "accepted") store.set("plocha", "1"); }).catch(() => {});
    return;
  }
  plochaNavod();
}
/** r27-12: když prohlížeč sám okno „Přidat na plochu“ nenabídne, ukáže se jasný návod přesně pro ten prohlížeč. */
function plochaNavod() {
  const ua = navigator.userAgent;
  const vApce = /; wv\)|Discord|FBAN|FBAV|Instagram|Messenger/i.test(ua);     // vestavěný prohlížeč (např. odkaz otevřený z Discordu)
  const samsung = /SamsungBrowser/i.test(ua), firefox = /Firefox/i.test(ua);
  const kroky = plochaIos() ? [["Dole klepni na <b>Sdílet</b> (čtvereček se šipkou nahoru).", "Tap <b>Share</b> at the bottom."], ["Vyber <b>Přidat na plochu</b>.", "Choose <b>Add to Home Screen</b>."], ["Potvrď <b>Přidat</b>.", "Confirm <b>Add</b>."]]
    : vApce ? [["Tahle stránka je otevřená <b>uvnitř Discordu</b> — odtud ikona na plochu nejde.", "This page is open <b>inside Discord</b> — no home icon from here."],
               ["Vpravo nahoře klepni na <b>⋮</b> a zvol <b>Otevřít v prohlížeči</b> (Chrome nebo Samsung Internet).", "Tap <b>⋮</b> top right → <b>Open in browser</b>."], ["Tam se přihlas a znovu klepni na <b>Ikona hry na ploše</b>.", "Log in there and tap the home icon option again."]]
    : samsung ? [["Dole vpravo klepni na <b>≡</b> (tři čárky).", "Tap <b>≡</b> bottom right."], ["Zvol <b>Přidat stránku na</b> → <b>Domovská obrazovka</b>.", "Choose <b>Add page to</b> → <b>Home screen</b>."], ["Potvrď <b>Přidat</b>.", "Confirm <b>Add</b>."]]
    : firefox ? [["Klepni na <b>⋮</b> (tři tečky).", "Tap <b>⋮</b>."], ["Zvol <b>Přidat na domovskou obrazovku</b>.", "Choose <b>Add to Home screen</b>."], ["Potvrď <b>Přidat</b>.", "Confirm <b>Add</b>."]]
    : [["Vpravo nahoře klepni na <b>⋮</b> (tři tečky).", "Tap <b>⋮</b> top right."], ["Zvol <b>Přidat na plochu</b> nebo <b>Instalovat aplikaci</b>.", "Choose <b>Add to Home screen</b> or <b>Install app</b>."], ["Potvrď <b>Přidat</b> / <b>Instalovat</b>.", "Confirm <b>Add</b> / <b>Install</b>."]];
  const el = document.createElement("div");
  el.className = "m-list plocha-navod";
  el.innerHTML = `<div class="m-list-pozadi"></div><div class="m-list-okno" role="dialog"><span class="m-list-uchyt"></span>
    <div class="pn-hlava"><img src="ikona-192.png" alt=""><div><b>${esc(L(["Ikona hry na ploše", "Game icon on home screen"]))}</b><small>${esc(L(["Ikona jen otevře tuto stránku. Nic se neinstaluje, přihlášení zůstane.", "The icon only opens this page."]))}</small></div></div>
    <ol class="pn-kroky">${kroky.map((k) => `<li>${L(k)}</li>`).join("")}</ol>
    <button class="btn m-list-zavrit">${esc(L(["Rozumím", "Got it"]))}</button></div>`;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add("otevreno"));
  const zavri = () => el.remove();
  el.querySelector(".m-list-pozadi").onclick = zavri; el.querySelector(".m-list-zavrit").onclick = zavri;
}
if (plochaMobil() && !plochaMa()) { const b = document.getElementById("plocha-login"); if (b) b.hidden = false; }
const IMG = (name) => `<picture><source media="(max-width: 760px)" srcset="${IMG_BASE}${name}-m.webp"><img src="${IMG_BASE}${name}.webp" alt="" loading="lazy" decoding="async"></picture>`;

const SPOTS = [   // klikací místa na mapě (% šířky a výšky obrázku mesto-mapa)
  { id: "hostinec", x: 21.8, y: 53.6, n: ["Hostinec", "Inn"] },
  { id: "kovar", x: 20.8, y: 66.5, n: ["Kovárna", "Smithy"] },
  { id: "trziste", x: 38.0, y: 59.6, n: ["Tržiště", "Market"] },
  { id: "radnice", x: 42.9, y: 47.7, n: ["Radnice", "Town hall"] },
  { id: "banka", x: 58.1, y: 52.3, n: ["Směnárna", "Money changer"] },
  { id: "chram", x: 83.6, y: 43.7, n: ["Chrám", "Church"] },
  { id: "lazne", x: 73.8, y: 61.6, n: ["Lazebník", "Bathhouse"] },
  { id: "mlyn", x: 85.4, y: 75.5, n: ["Mlýn", "Mill"] },
  { id: "zverinec", x: 64.4, y: 82.4, n: ["Zvěřinec", "Menagerie"] },
  { id: "kolbiste", x: 47.8, y: 83.4, n: ["Kolbiště", "Arena"] },
  { id: "brana", x: 14.7, y: 83.7, n: ["Brána", "Town gate"] },
  { id: "dum", x: 37.1, y: 74.4, n: ["Měšťanský dům", "Burgher house"] },
  { id: "hrbitov", x: 93.9, y: 51.7, n: ["Hřbitov", "Graveyard"] },                    // r27-4: hřbitov u kostela
  { id: "apatyka", x: 57.8, y: 64.5, n: ["Apatyka", "Apothecary"] },                 // r27-4: podniky — zamčené do koupě
  { id: "dilna", x: 7.5, y: 56.7, n: ["Střelmistrova dílna", "Bowyer's workshop"] },
];
const SHOPS_UI = {   // obchodník: obrázek, ikona, věta
  "Pašerák": { img: "mesto-paserak", ic: "🌙", say: ["Pašerák: „Nikdo nás neviděl, jasný?“", "Smuggler: \"Nobody saw us, right?\""] },
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
      { go: "misto/hostinec-hraci", ic: "🤝", n: ["Hry s hráči", "Games with players"], d: ["Lhář, mlýn, kostky, karty, souboj", "Liar's dice, mill, dice, cards, duel"] },
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
  "hostinec-hraci": { img: "mesto-hostinec", n: ["Vyzvat hráče", "Challenge a player"],   // r27-6: výzva jako karty (dřív holá tlačítka)
    say: ["Oba vsadíte stejnou částku a vítěz bere vše. Soupeř výzvu potvrdí, pak se střídáte v tazích.", "Both stake the same amount; the winner takes all. The opponent accepts, then you take turns."],
    opts: [
      { cid: "ks:pvp:kind:dice", ic: "🎲", n: ["Kostky", "Dice"], d: ["Po kolech na cílový počet bodů", "Rounds up to a target score"] },
      { cid: "ks:pvp:kind:cards", ic: "🃏", n: ["Oko bere", "Twenty-one"], d: ["Karty ze společného balíčku", "Cards from a shared deck"] },
      { cid: "ks:pvp:kind:prsi", ic: "🂠", n: ["Prší", "Prší"], d: ["Karetní hra dvou hráčů", "Card game for two"] },
      { cid: "ks:pvp:kind:liar", ic: "🤥", n: ["Lhář", "Liar's dice"], d: ["Kostky pod pohárem a blafování", "Dice under the cup and bluffing"] },
      { cid: "ks:pvp:kind:darts", ic: "🎯", n: ["Šipky", "Darts"], d: ["Kdo hodí víc na terč", "Who scores more on the board"] },
      { cid: "ks:pvp:kind:morris", ic: "⚪", n: ["Mlýn", "Nine men's morris"], d: ["Desková hra s kameny", "Board game with stones"] },
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
      { go: "vyhlasky", ic: "📯", n: ["Vyhlášky radnice", "Town proclamations"], d: ["Úkoly za groše, předměty a pověst", "Tasks for coin, items and renown"] },
      { go: "misto/radnice-rychtar", ic: "⚖️", n: ["Rychtář", "Reeve"], d: ["Pokuty, výdaje, právo a erb", "Fines, bills, citizenship and arms"] },
      { go: "dar/mesto", ic: "🎁", n: ["Dar městu", "Gift to the town"], d: ["Pro dobrou pověst", "For your reputation"] },
      { sect: ["Přehledy", "Overviews"] },
      { go: "kroniky", ic: "📖", n: ["Kroniky", "Chronicles"], d: ["Události, slavní, žijící hrdinové, výsledky her", "Events, fame, heroes, results"] },
      { go: "obyvatele", ic: "👥", n: ["Obyvatelé", "Townsfolk"], d: ["Kdo ve městě žije", "Who lives in town"] },
      { go: "poradi", ic: "📜", n: ["Pořadí týdne", "Weekly ranking"], d: ["Nejlepší hrdinové", "Best heroes"] },
    ] },
  "radnice-rychtar": { img: "mesto-radnice", n: ["Rychtář", "Reeve"], say: ["Rychtář: „Pokuty se platí, daně taky. A kdo chce být měšťanem, ať se ukáže.“", "Reeve: \"Fines get paid, and so do taxes. Want to be a burgher? Show yourself.\""],
    opts: [
      { panel: "fine", ic: "⚖️", n: ["Pokuty a hledanost", "Fines and bounties"], d: ["Zaplatit pokutu, kdo je hledaný", "Pay fines, who is wanted"] },
      { panel: "listiny", ic: "📜", n: ["Listiny a důkazy", "Documents"], d: ["Rychtář zaplatí za vzkazy lapků, rozkazy, účty", "The reeve pays for evidence"] },
      { go: "vydaje", ic: "🧾", n: ["Výdaje a dluhy", "Bills and debts"], d: ["Co se strhává každý týden", "What is paid every week"] },
      { panel: "titles", ic: "🏛️", n: ["Měšťanské právo", "Citizenship"], d: ["Staň se měšťanem", "Become a burgher"] },
      { go: "erb", ic: "🛡️", n: ["Erb", "Coat of arms"], d: ["Navrhni si vlastní erb", "Design your own arms"],
        lock: (m) => !m.citizen && !m.has_arms, why: () => ["Erb dostane jen měšťan — nejdřív získej měšťanské právo.", "Only burghers get arms — gain citizenship first."] },
      { go: "misto/radnice", ic: "🏛️", n: ["Zpět do radnice", "Back to the town hall"], d: ["Purkmistr a rada", "Burgomaster and council"] },
    ] },
  chram: { img: "mesto-chram", n: ["Chrám svaté Barbory", "Church of St Barbara"], say: ["Kněz: „Pokoj s tebou. Modlit se můžeš jednou za den.“", "Priest: \"Peace be with you. You may pray once a day.\""],
    opts: [
      { go: "misto/chram-pozehnani", ic: "🙏", n: ["Požehnání", "Blessings"], d: ["Síla, ochrana, moudrost", "Strength, protection, wisdom"] },
      { act: "pray:uzdraveni", ic: "❤️", n: ["Uzdravení", "Healing"], d: ["+25 % životů hned", "+25% health now"] },
      { go: "dar/chram", ic: "🎁", n: ["Dar kostelu", "Gift to the church"], d: ["Pro dobrou pověst", "For your reputation"] },
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
      { go: "povoz", ic: "🐴", n: ["Povoz s koněm", "Horse and cart"], d: ["Odveze z výpravy, co se nevejde do batohu", "Hauls home what your pack can't hold"] } ] },   // r27-6: mazlíčci jsou v záložce Mazlíček
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
    opts: [ { go: "obchod/Pašerák", ic: "🌙", n: ["Černý trh", "Black market"], d: ["Nákup i prodej · jen v noci 21–5", "Buy and sell · night only, 9 pm–5 am"] } ] },

};

function sceneHead(img, title, say, small = false) {
  return `<div class="scene live${small ? " short" : ""}" data-img="${esc(img)}">
    <div class="scene-cap"><h2>${esc(title)}</h2>${say ? `<p>${esc(say)}</p>` : ""}</div></div>`;
}
// ------------------------------------------------------------------ r27-12: mobilní režim (zvláštní rozložení pro telefon)
const ZOBR = { pref: (typeof store !== "undefined" && store.get("zobrazeni")) || "auto" };
function jeMobil() {
  if (ZOBR.pref === "pc") return false;
  if (ZOBR.pref === "tel") return true;
  return matchMedia("(max-width:760px)").matches || (matchMedia("(pointer:coarse)").matches && Math.min(screen.width, screen.height) <= 540);
}
function nastavZobrazeni() {
  const m = jeMobil(), byl = document.documentElement.classList.contains("mobil");
  document.documentElement.classList.toggle("mobil", m);
  document.documentElement.classList.toggle("mobil-vynucen", m && ZOBR.pref === "tel");
  const nav = document.querySelector(".tabs");
  if (nav) document.documentElement.style.setProperty("--nav-h", (m ? nav.offsetHeight : 0) + "px");
  return m !== byl;
}
nastavZobrazeni();
addEventListener("resize", () => { if (nastavZobrazeni() && typeof render === "function" && S.me) render(); });
addEventListener("load", nastavZobrazeni);

/** r27-12: spodní okno (na telefonu) — podrobnosti věci a akce na dosah palce. Akce se do okna přesunou i s obsluhou. */
const LIST = { el: null, zpet: null };
function zavriList() {
  if (!LIST.el) return;
  if (LIST.zpet) LIST.zpet.forEach(([uzel, kam]) => { if (kam && kam.isConnected) kam.appendChild(uzel); });
  LIST.el.remove(); LIST.el = null; LIST.zpet = null;
}
function otevriList(item) {
  zavriList();
  const acts = item.querySelector(".acts"); if (!acts) return;
  const hlava = item.cloneNode(true);
  hlava.querySelectorAll(".acts,.kup-vyber,.kup-barva,.m-sipka,.m-cena").forEach((x) => x.remove());
  hlava.className = "item list-hlava";
  const el = document.createElement("div");
  el.className = "m-list";
  el.innerHTML = `<div class="m-list-pozadi"></div><div class="m-list-okno" role="dialog"><span class="m-list-uchyt"></span><div class="m-list-telo"></div>
    <button class="btn m-list-zavrit">${esc(L(["Zavřít", "Close"]))}</button></div>`;
  el.querySelector(".m-list-telo").appendChild(hlava);
  const kam = el.querySelector(".m-list-telo");
  const zpet = [[acts, item]];
  kam.appendChild(acts);
  document.body.appendChild(el);
  LIST.el = el; LIST.zpet = zpet;
  if (typeof Zvuk !== "undefined") Zvuk.sfx("klik");
  requestAnimationFrame(() => el.classList.add("otevreno"));
  el.querySelector(".m-list-pozadi").onclick = zavriList;
  el.querySelector(".m-list-zavrit").onclick = zavriList;
  acts.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => setTimeout(zavriList, 0)));
}
/** Na telefonu: řádky věcí bez tlačítek — klepnutím se otevře spodní okno s akcemi. */
function mobilniSeznam(root) {
  if (!jeMobil() || !root) return;
  root.querySelectorAll(".item").forEach((it) => {
    const acts = it.querySelector(".acts");
    if (!acts || !acts.querySelector("button") || it.classList.contains("m-radek")) return;
    it.classList.add("m-radek");
    const cena = acts.querySelector(".price");
    it.insertAdjacentHTML("beforeend", `${cena ? `<span class="m-cena">${esc(cena.textContent)}</span>` : ""}<span class="m-sipka" aria-hidden="true"></span>`);
    it.addEventListener("click", (e) => { if (e.target.closest("button,input,select,label,a")) return; otevriList(it); });
  });
}

// r27-11: na telefonu se horní lišta při scrollování dolů schová a při pohybu nahoru zase ukáže
{ let posl = 0;
  addEventListener("scroll", () => {
    const y = window.scrollY, g = document.getElementById("game"); if (!g) return;
    const mobil = matchMedia("(max-width:760px)").matches;
    if (!mobil || y < 60) g.classList.remove("tb-skryt");
    else if (y > posl + 8) g.classList.add("tb-skryt");
    else if (y < posl - 8) g.classList.remove("tb-skryt");
    posl = y;
  }, { passive: true }); }
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
  const MP = store.get("mestoPohled") || "mapa";   // r27-12: telefon — Mapa nebo Místa (každé na jednu obrazovku)
  view.replaceChildren(h(`
    ${S.me.on_raid ? `<div class="panel notice" style="margin-bottom:16px">🗺️ ${esc(t("on_raid"))}</div>` : ""}
    ${jeMobil() ? `<div class="m-zalozky mesto-zal"><button class="${MP === "mapa" ? "on" : ""}" data-mp="mapa">${esc(L(["Mapa", "Map"]))}</button><button class="${MP === "mista" ? "on" : ""}" data-mp="mista">${esc(L(["Místa", "Places"]))}</button><button class="${MP === "zpravy" ? "on" : ""}" data-mp="zpravy">${esc(L(["Kronika", "Chronicle"]))}</button></div>` : ""}
    <div class="mesto-plocha${jeMobil() ? " m-pohled-" + MP : ""}"><div class="mesto-mapa"><div class="townmap live" data-img="mesto-mapa"></div></div>
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
  sc.pic.insertAdjacentHTML("beforeend", SPOTS.map((p) => `<button class="spot${PLACES[p.id] ? "" : " later"}${zamceno(p.id) ? " zamceno" : ""}" data-spot="${p.id}" data-kraj="${p.x < 13 ? "l" : p.x > 87 ? "r" : ""}" style="left:${p.x}%;top:${p.y}%"><span>${esc(L(p.n))}</span></button>`).join(""));
  { // r27-11: na mobilu seznam míst pod mapou (mapa se dá posouvat prstem do stran)
    const mm = view.querySelector(".mesto-mapa");
    const mista = SPOTS.filter((p) => PLACES[p.id]).sort((a, b) => zamceno(a.id) - zamceno(b.id));
    mm.insertAdjacentHTML("afterend", jeMobil()   // r27-12: na telefonu dlaždice s obrázkem místa
      ? `<div class="sect m-mista-nadpis">${esc(L(["Kam ve městě", "Where to go"]))}</div><div class="m-mista">${mista.map((p) => { const pl = PLACES[p.id];
          return `<button class="m-misto${zamceno(p.id) ? " zamceno" : ""}" data-spot="${p.id}"><span class="m-misto-obr" style="background-image:url('${IMG_BASE}${pl.img || "mesto-trziste"}-m.webp')"></span>
            <b>${esc(L(p.n))}</b>${zamceno(p.id) ? `<small>${esc(L(["zamčeno", "locked"]))}</small>` : ""}</button>`; }).join("")}</div>`
      : `<div class="mesto-mista">${mista.map((p) => `<button class="chip${zamceno(p.id) ? " zamceno" : ""}" data-spot="${p.id}">${esc(L(p.n))}</button>`).join("")}</div>`);
    if (innerWidth <= 760) requestAnimationFrame(() => { mm.scrollLeft = (mm.scrollWidth - mm.clientWidth) / 2; });
  }
  view.querySelectorAll("[data-mp]").forEach((b) => b.onclick = () => { store.set("mestoPohled", b.dataset.mp); Zvuk.sfx("klik"); render(); });
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
    (m, ts, st) => st === ":R" ? (Number(ts) * 1000 > Date.now() ? L(["za ", "in "]) + odpocet(Number(ts)) : L(["před chvílí", "a moment ago"]))   // r27-6: zbývající čas
      : new Date(Number(ts) * 1000).toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit" }))).split("\n");
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
      // r27-6: dlouhý doplněk pod název (nepřetéká), text bez „—“ celý v jednom bloku (ne rozházený po řádku)
      out += `<div class="zaznam"><p class="z-hl">${m ? (m[2].length > 42 ? `<span>${inl(m[1])}</span></p><p class="z-pod">${inl(m[2])}` : `<span>${inl(m[1])}</span><span class="z-meta">${inl(m[2])}</span>`) : `<span class="z-cely">${inl(l)}</span>`}</p>`;
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
  if (r.panel && /^#\s*🧾\s*Výdaje/.test(r.panel.content || "")) { go("vydaje"); return; }   // r27-6: výdaje mají vlastní zobrazení
  { const c0 = (r.panel && r.panel.content) || "";
    if (/^#\s*\S*\s*Obyvatelé Kutné Hory/.test(c0)) { go("obyvatele"); return; }
    if (/^#\s*\S*\s*Pořadí tohoto týdne/.test(c0)) { go("poradi"); return; }
    if (/^#\s*\S*\s*Dar (městu|kostelu)/.test(c0) && !/✅|Děkuj/.test(c0)) { go(/kostelu/.test(c0.split("\n")[0]) ? "dar/chram" : "dar/mesto"); return; } }
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
  if (/^#\s*\S*\s*Žebříček kolbiště/m.test(p.content || "")) zebricekKolbiste(box);   // r27-6: přehledný žebříček
  { const h3 = box.querySelector(".dtext > h3:first-child"), cap2 = document.querySelector(".scene-cap h2");   // r27-6: nadpis už je v obrázku nahoře
    if (h3 && cap2 && h3.textContent.trim() === cap2.textContent.trim()) h3.remove(); }
  nahledyNabidky(box);   // r27-5: domy a podniky na prodej s obrázkem
  bankaRozvrzeni(box);   // r27-5: banka přehledně — dlaždice se stavem, účet a půjčka zvlášť
  sekceKarty(box);   // r27-5: víc nadpisů v jednom okně = úvod nahoře a oddíly jako karty vedle sebe
  poradiTabulky(box);   // r27-5: žebříčky jako přehledné tabulky s pořadím
  wirePanel(box, key);
  spojVolby(box);
  noveZobrazeni(box);   // r27-6: staré textové okno v novém stylu — záznamy jako listy, tlačítka přímo u nich
  wireLazebna(box);
  box.querySelectorAll("[data-zvire]").forEach((b) => b.addEventListener("click", () => {   // r27-4: klik na malované zvíře = volba v nabídce
    const sel = box.querySelector(`select[data-sel="${b.dataset.sel}"]`);
    if (sel) { sel.value = b.dataset.zvire; sel.dispatchEvent(new Event("change", { bubbles: true })); }
  }));  if (!MINI.inAct) {   // r27-6: vloupání — kreslený zámek
    if (r.mini && miniKind(r.mini)) miniSync(r.mini, p, key);
    else if ((p.controls || []).some((c) => /^ks:burgle:p:/.test(c.id || ""))) call("mini", {}, true).then((x) => miniSync(x.mini, p, key)).catch(() => {});
  }
}

/** r27-6: „nové zobrazení“ pro všechna okna z Discordu.
 *  • tlačítko, které patří k záznamu (stejné jméno), se přesune přímo do jeho listu
 *  • po sobě jdoucí záznamy se složí do mřížky listů, úvodní text do hlavičky
 *  • „3/10“ v názvu a „praxe 3/16“ v poznámce dostanou ukazatel */
function noveZobrazeni(box) {
  const dt = box.querySelector(".dtext"); if (!dt) return;
  box.classList.add("nove");
  const norm = (x) => noEmoji(String(x || "")).toLowerCase().replace(/[*_`„“"'()·:.,!?]/g, " ").replace(/\d+\s*\/\s*\d+/g, " ").replace(/\s+/g, " ").trim();
  const zazn = [...dt.querySelectorAll(".zaznam")];
  const tituly = zazn.map((el) => norm((el.querySelector(".z-hl b") || el.querySelector(".z-hl") || el).textContent));
  const prvni = tituly.map((t) => t.split(" ")[0]);
  box.querySelectorAll(".vctl button.vbtn[data-cid]").forEach((b) => {
    const n = norm(b.textContent); if (n.length < 3) return;
    const n2 = n.replace(/^(koupit|vzít|přijmout|zaplatit|získat|zapsat se|naučit se|vybrat|otevřít)\s+/, "");   // „Koupit měšťanské právo“ → měšťanské právo
    let i = tituly.findIndex((t) => t && [n, n2].some((x) => x.length > 2 && (t === x || t.startsWith(x) || x.startsWith(t))));
    if (i < 0) { const w = n.split(" ")[0]; if (w.length >= 4 && prvni.filter((p) => p === w).length === 1) i = prvni.indexOf(w); }
    if (i < 0) return;
    const el = zazn[i];
    el.classList.add("s-akci");
    let a = el.querySelector(".z-akce");
    if (!a) { a = document.createElement("div"); a.className = "z-akce"; el.appendChild(a); }
    b.classList.add("small"); a.appendChild(b);
  });
  box.querySelectorAll(".vctl .vrow").forEach((r) => { if (!r.children.length) r.remove(); });
  box.querySelectorAll(".vctl").forEach((v) => { if (!v.querySelector("button,select,fieldset")) v.remove(); });
  zazn.forEach((el) => {                                   // ukazatele: „Vaření 3/10“, „praxe 0/32“
    const hl = el.querySelector(".z-hl");
    const m = hl && /(\d+)\s*\/\s*(\d+)/.exec(hl.textContent);
    const px = /praxe\s+(\d+)\s*\/\s*(\d+)/i.exec(el.textContent);
    const bar = (a, b, cls) => `<span class="nz-bar ${cls}"><i style="width:${Math.min(100, Math.round(100 * a / Math.max(1, b)))}%"></i></span>`;
    if (m && +m[2] <= 100) hl.insertAdjacentHTML("afterend", bar(+m[1], +m[2], "uroven"));
    if (px) el.querySelector(".z-akce, :scope > p:last-of-type")?.insertAdjacentHTML("beforebegin", bar(+px[1], +px[2], "praxe"));
  });
  let skup = [];                                           // po sobě jdoucí záznamy = mřížka listů
  const zabal = () => { if (skup.length >= 2) { const w = document.createElement("div"); w.className = "nz-listy" + (skup.length === 2 ? " dva" : ""); skup[0].before(w); skup.forEach((x) => w.appendChild(x)); } skup = []; };
  [...dt.children].forEach((c) => { if (c.classList.contains("zaznam")) skup.push(c); else zabal(); });
  zabal();
  const uvod = [];                                         // úvodní odstavce před prvním listem = hlavička
  for (const c of dt.children) { if (c.tagName === "P" && !c.classList.contains("radek")) uvod.push(c); else break; }
  if (uvod.length && dt.querySelector(".nz-listy, .zaznam")) { const u = document.createElement("div"); u.className = "nz-uvod"; uvod[0].before(u); uvod.forEach((x) => u.appendChild(x)); }
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
    const sloveso = (() => {   // r27-22: tlačítko vždy sloveso (ne „Co“ z otázky „Co vydražíš?“)
      const p = ph.toLowerCase(), w = ph.split(/\s+/)[0] || "";
      const T = [[/vydraž/, "Vydražit"], [/prod/, "Prodat"], [/použi/, "Použít"], [/kou[pk]/, "Koupit"], [/vyrob/, "Vyrobit"], [/ulož/, "Uložit"],
        [/vzít|vezm/, "Vzít"], [/odevzd/, "Odevzdat"], [/nauč|lekc/, "Učit se"], [/vypi|nalít/, "Vypít"], [/sněz|najíst/, "Sníst"], [/naslad|nasad/, "Nasadit"]];
      const hit = T.find(([re]) => re.test(p));
      if (hit) return L([hit[1], hit[1]]);
      return /(it|at|et|ět|out|ít)$/i.test(w) && !/^(co|kam|koho|komu|kter|jak)/i.test(w) ? w : L(["Vybrat", "Choose"]);
    })();
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
    const dlouhy = zbyle.length > VOLBY_MAX;                // r27-6: dlouhý seznam = mřížka s hledáním místo rolety
    sel.hidden = true;
    if (!zbyle.length) return;
    const wrap = document.createElement("div");
    wrap.className = "volby-blok" + (dlouhy ? " dlouhy" : "");
    const ik = (lab) => { const n = noEmoji(lab).replace(/\s*[×x]\s*\d+.*$/, "").replace(/\s*·.*$/, "").trim(); return `<img class="vv-ik" alt="" src="${IMG_BASE}predmety/ikony/${Postava.slug(n)}.webp">`; };
    wrap.innerHTML = `<div class="sect">${esc(ph)}</div>${dlouhy ? `<input class="search vv-hledat" placeholder="${esc(L(["Hledat…", "Search…"]))}">` : ""}<div class="vp-volby">${zbyle.map(([o, lab, desc]) =>
      `<button type="button" class="vp-volba" data-volba="${esc(o.value)}" data-q="${esc(noEmoji(lab + " " + desc).toLowerCase())}"${o.disabled ? " disabled" : ""}>${ik(lab)}<span><b>${esc(noEmoji(lab).trim())}</b>${desc ? `<small>${esc(noEmoji(desc).trim())}</small>` : ""}</span><em class="vv-akce">${esc(sloveso)}</em></button>`).join("")}</div>`;   // r27-22: každá volba s ikonou (když ji věc má) a slovesem vpravo — jako řádky v obchodě
    wrap.querySelectorAll("[data-volba]").forEach((b) => b.onclick = () => { b.disabled = true; vyber(b.dataset.volba); });
    wrap.querySelectorAll(".vv-ik").forEach((im) => { const pryc = () => { im.remove(); };
      im.addEventListener("load", () => wrap.classList.add("s-ikonami")); im.addEventListener("error", pryc); if (im.complete && !im.naturalWidth) pryc(); });
    const hl = wrap.querySelector(".vv-hledat");
    if (hl) hl.oninput = () => { const q = hl.value.trim().toLowerCase(); wrap.querySelectorAll("[data-volba]").forEach((b) => { b.hidden = !!q && !b.dataset.q.includes(q); }); };
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
/** r27-12: mazlíček u postavy — h = výška obrázku v % výšky rámu (podle skutečné velikosti, postava ≈ 1,8 m),
 *  pod = prázdné místo pod zvířetem v obrázku, x = odsazení od kraje v %, typ = zem (vlevo u nohou) / ptak (u ramene) / velky (za postavou vpravo). */
// r27-19: dvojice společníků — každý z jiné třídy, myš ne s lovcem myší (stejné jako pets.proc_ne_spolu)
const PET_TRIDA = { "Myš": "myš", "Fretka": "fretka", "Kočka": "kočka", "Ochočená liška": "psovité", "Pes": "psovité", "Honicí pes": "psovité",
  "Válečný pes": "psovité", "Havran": "ptáci", "Sova": "ptáci", "Sokol": "ptáci", "Cvičený medvěd": "medvěd", "Mula": "mula" };
function petNeSpolu(a, b) {
  const ta = PET_TRIDA[a] || a, tb = PET_TRIDA[b] || b;
  if (ta === tb) return L(["stejná třída (" + ta + ")", "same class"]);
  const lovi = (k) => ["ptáci", "kočka", "fretka"].includes(PET_TRIDA[k]) || k === "Ochočená liška";
  if ((a === "Myš" && lovi(b)) || (b === "Myš" && lovi(a))) return L(["myš by to nepřežila", "the mouse wouldn't survive"]);
  if ([a, b].includes("Cvičený medvěd") && [a, b].includes("Mula")) return L(["mula se medvěda bojí", "the mule fears the bear"]);
  return "";
}
const PET_POZ = {   // r27-18: celé zvíře vždy uvnitř rámu (žádné záporné odsazení)
  mys: { h: 17, pod: 0, x: 4, typ: "zem" }, fretka: { h: 28, pod: .267, x: 2, typ: "zem" }, kocka: { h: 21, pod: .025, x: 2, typ: "zem" },
  liska: { h: 30, pod: .124, x: 1, typ: "zem" }, pes: { h: 32, pod: .036, x: 1, typ: "zem" }, "honici-pes": { h: 40, pod: .095, x: 1, typ: "zem" },
  "valecny-pes": { h: 42, pod: .1, x: 1, typ: "zem" }, havran: { h: 19, typ: "ptak", strana: "prave", cx: 37, sed: 23, orez: 6 },
  sova: { h: 21, typ: "ptak", strana: "leve", cx: 65, sed: 22.5, orez: 29 },
  sokol: { h: 23, typ: "ptak", strana: "leve", cx: 65, sed: 22.5, orez: 31.5 },   // cx = střed na šířce figury v %, sed = výška ramene od shora v %, orez = spodek obrázku skrytý (bidýlko) v %
  medved: { h: 58, pod: .115, x: 1, typ: "velky" }, mula: { h: 60, pod: 0, x: 1, typ: "velky" },
};
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
          <small>${esc(noEmoji(buy ? ((o.label || "").split("—")[1] || "").replace(/🔒\s*(\d+)/, (m, n) => L(["· od úrovně ", "· level "]) + n).trim() : (o.desc || "")))}</small>
          ${buy && /Dožívá se/.test(o.desc || "") ? `<small class="zv-zivot">${esc((/Dožívá se[^.]*/.exec(o.desc) || [""])[0])}</small>` : ""}</button>`;
      }).join("")}</div>`;
  }).join("");
}

// r27-5: nabídka domů a podniku — místo holého textu karta s malovaným náhledem, tlačítko „Koupit“ přímo v kartě
const DUM_IMG = [[/chalup|cottage/i, "domov/chalupa-venku"], [/měšťan|dům|house/i, "domov/dum-venku"]];
const PODNIK_IMG = [[/kovárn|smithy/i, "domov/podnik-kovarna"], [/střelmistr|bowyer/i, "domov/podnik-strelmistrova-dilna"],
  [/apatyk|apothec/i, "domov/podnik-apatyka"], [/usedlost|farm/i, "domov/podnik-usedlost"], [/doupě|den\b/i, "domov/podnik-doupe"]];
const najdiObr = (tab, text) => (tab.find(([re]) => re.test(text)) || [])[1];
function nahledyNabidky(box) {
  const dtext = box.querySelector(".dtext"); if (!dtext) return;
  const tlacitka = [...box.querySelectorAll(".vctl button.vbtn")];
  const koupit = tlacitka.filter((b) => /^\s*(Koupit|Buy)\b/i.test(b.textContent));
  if (!koupit.length) return;
  const uklid = () => box.querySelectorAll(".vctl .vrow").forEach((r) => { if (!r.children.length) r.remove(); });
  // více nabídek (domy): každý záznam = karta s obrázkem a svým tlačítkem
  const zaznamy = [...dtext.querySelectorAll(".zaznam")].filter((z) => najdiObr(DUM_IMG, z.querySelector(".z-hl b")?.textContent || ""));
  if (zaznamy.length && (koupit.length > 1 || zaznamy.length > 1)) {   // r27-6: i když jeden dům už máš
    const mriz = document.createElement("div"); mriz.className = "nabidka-mriz";
    zaznamy[0].before(mriz);
    for (const z of zaznamy) {
      const jm = (z.querySelector(".z-hl b")?.textContent || "").trim();
      const karta = document.createElement("div"); karta.className = "nabidka-karta";
      karta.innerHTML = `<div class="nk-obr">${IMG(najdiObr(DUM_IMG, jm))}</div><div class="nk-text"></div>`;
      karta.querySelector(".nk-text").append(...z.childNodes);
      const b = koupit.find((x) => x.textContent.replace(/^\s*(Koupit|Buy)\s*:?\s*/i, "").trim() === jm);
      if (b) { b.textContent = b.disabled ? L(["Zatím nelze koupit", "Not available yet"]) : b.textContent; karta.append(b); }
      if (b && b.disabled) karta.classList.add("zamceno");
      mriz.append(karta); z.remove();
    }
    uklid(); return;
  }
  // jedna nabídka (podnik): obrázek vlevo, popis a tlačítko vpravo
  const nadpis = dtext.querySelector("h3")?.textContent || "";
  const obr = najdiObr(PODNIK_IMG, nadpis) || (/podnik|dílna|usedlost|doupě|kovárn|apatyk/i.test(dtext.textContent.slice(0, 300) + koupit.map((b) => b.textContent).join(" ")) && typeof BIZ_IMG !== "undefined" && BIZ_IMG[S.me?.origin]);   // r27-6: obrázek podniku jen u podniku (ne u domu nebo práva)
  if (!obr || koupit.length !== 1) return;
  const h3 = dtext.querySelector("h3");
  const karta = document.createElement("div"); karta.className = "nabidka-jedna" + (koupit[0].disabled ? " zamceno" : "");
  karta.innerHTML = `<div class="nk-obr">${IMG(obr)}</div><div class="nk-text"></div>`;
  const txt = karta.querySelector(".nk-text");
  [...dtext.childNodes].filter((n) => n !== h3).forEach((n) => txt.append(n));
  txt.append(koupit[0]);
  dtext.append(karta);
  uklid();
}

// r27-5: žebříčky (pořadí týdne apod.) — každá kategorie jako karta s očíslovaným pořadím, medaile pro první tři, tvoje jméno zvýrazněné
function poradiTabulky(box) {
  const dtext = box.querySelector(".dtext"); if (!dtext) return;
  const h4s = [...dtext.querySelectorAll(":scope > h4")];
  if (h4s.length < 2 || !dtext.querySelector(":scope > .radek")) return;
  const ja = (S.me?.name || "").trim();
  const mriz = document.createElement("div"); mriz.className = "poradi-mriz";
  h4s[0].before(mriz);
  for (const h of h4s) {
    const karta = document.createElement("section"); karta.className = "poradi-karta";
    const nad = document.createElement("h5"); nad.textContent = h.textContent.replace(/:\s*$/, ""); karta.append(nad);
    const ol = document.createElement("ol"); let n = 0, n2 = h.nextElementSibling;
    const zbytek = [];
    while (n2 && n2.tagName !== "H4" && n2.tagName !== "H3") {
      const dalsi = n2.nextElementSibling;
      if (n2.classList.contains("radek")) {
        n++;
        const [jm, hod] = n2.children;
        const li = document.createElement("li");
        if (n <= 3) li.className = "m" + n;
        if (ja && jm && jm.textContent.trim() === ja) li.classList.add("ja");
        li.innerHTML = `<span class="p-c">${n}</span><span class="p-j"></span><span class="p-h"></span>`;
        li.querySelector(".p-j").append(...(jm ? jm.childNodes : []));
        li.querySelector(".p-h").append(...(hod ? hod.childNodes : []));
        ol.append(li); n2.remove();
      } else if (n2.tagName === "P") { zbytek.push(n2); }
      n2 = dalsi;
    }
    if (n) karta.append(ol);
    else { const p = document.createElement("p"); p.className = "p-nikdo"; p.textContent = zbytek.map((z) => z.textContent).join(" ") || "—"; karta.append(p); }
    zbytek.forEach((z) => z.remove());
    mriz.append(karta); h.remove();
  }
}

// r27-6: žebříček kolbiště — tvoje hodnost s ukazatelem, stupnice hodností a tabulka
async function zebricekKolbiste(box) {
  const dt = box.querySelector(".dtext"); if (!dt) return;
  let Z; try { Z = (await call("zebricek", {}, true)).zebricek; } catch { return; }
  const R = Z.ranks, ja = Z.ja;
  const ikon = (n) => (/^(\S+)\s/.exec(n) || ["", ""])[1], bez = (n) => n.replace(/^\S+\s/, "");
  let moje = "";
  if (ja) {
    const i = R.findIndex((r) => bez(r.name) === bez(ja.rank));
    const od = R[i] ? R[i].from : 0, doo = ja.next ? ja.next.at : od;
    const pct = ja.next ? Math.max(0, Math.min(100, 100 * (ja.rating - od) / Math.max(1, doo - od))) : 100;
    moje = `<div class="zb-ja"><div class="zb-odznak">${ikon(ja.rank)}</div><div class="zb-info"><small>${esc(L(["Tvoje hodnost", "Your rank"]))}</small>
      <b>${esc(bez(ja.rank))}</b><span>${ja.rating} ${esc(L(["bodů", "points"]))} · ${ja.wins} ${esc(L(["výher", "wins"]))} / ${ja.losses} ${esc(L(["proher", "losses"]))}</span>
      <div class="zb-pruh"><i style="width:${pct.toFixed(1)}%"></i></div>
      <small>${ja.next ? esc(L([`Do hodnosti ${bez(ja.next.rank)} zbývá ${ja.next.need} b.`, `${ja.next.need} pts to ${bez(ja.next.rank)}`])) : esc(L(["Nejvyšší hodnost!", "Highest rank!"]))}</small></div></div>`;
  }
  const stupne = `<ol class="zb-stupne">${R.map((r) => `<li class="${ja && r.from <= ja.rating ? "ma" : ""}${ja && bez(r.name) === bez(ja.rank) ? " ted" : ""}"><span>${ikon(r.name)}</span><b>${esc(bez(r.name))}</b><small>${r.from}+</small></li>`).join("")}</ol>`;
  const tab = Z.rows.length ? `<table class="zb-tab"><thead><tr><th>#</th><th>${esc(L(["Bojovník", "Fighter"]))}</th><th>${esc(L(["Hodnost", "Rank"]))}</th><th>${esc(L(["Body", "Pts"]))}</th><th>${esc(L(["V / P", "W / L"]))}</th></tr></thead><tbody>
    ${Z.rows.map((r, i) => `<tr class="${i < 3 ? "m" + (i + 1) : ""}${r.ja ? " ja" : ""}"><td>${i + 1}</td><td>${esc(r.name)}</td><td>${ikon(r.rank)} ${esc(bez(r.rank))}</td><td><b>${r.rating}</b></td><td>${r.wins} / ${r.losses}</td></tr>`).join("")}</tbody></table>`
    : `<p class="zb-nikdo">${esc(L(["Zatím nikdo nebojoval. Buď první!", "Nobody has fought yet. Be the first!"]))}</p>`;
  dt.innerHTML = `<h3>${esc(L(["Žebříček kolbiště", "Arena ladder"]))}</h3>${moje}${stupne}${tab}
    <p class="pozn">${esc(L([`Výhra nad silnějším dá víc bodů. Se stejným soupeřem se denně počítají nejvýš ${Z.pair_limit} souboje.`, `Beating a stronger foe gives more. Max ${Z.pair_limit} counted duels per day with the same opponent.`]))}</p>`;
}

// r27-5: banka — nahoře dlaždice (u sebe, na účtu, lze půjčit), pod tím karta Účet a karta Půjčka, každá se svými tlačítky
function bankaRozvrzeni(box) {
  const dtext = box.querySelector(".dtext"); if (!dtext) return;
  const ctl = [...box.querySelectorAll(".vctl button.vbtn, .vctl select")];
  const popis = (el) => el.tagName === "SELECT" ? el.options[0]?.textContent || "" : el.textContent;
  if (!ctl.some((b) => /^\s*(Vložit|Vybrat|Půjčit|Splatit|Deposit|Withdraw|Borrow|Repay)/i.test(popis(b)))) return;   // r27-22: i s prázdnou kapsou
  const stav = [...dtext.querySelectorAll(":scope > p")].find((p) => /U sebe|On hand|At hand/i.test(p.textContent));
  if (!stav) return;
  const b = [...stav.querySelectorAll("b")].map((x) => x.textContent);
  const pujc = [...dtext.querySelectorAll(":scope > p")].find((p) => /Půjčit si můžeš|You can borrow/i.test(p.textContent));
  const dl = [[L(["U sebe", "On hand"]), b[0]], [L(["Na účtu", "In the bank"]), b[1]]];
  if (pujc) dl.push([L(["Lze půjčit", "Can borrow"]), pujc.querySelector("b")?.textContent]);
  const wrap = document.createElement("div"); wrap.className = "banka";
  wrap.innerHTML = `<div class="bk-dlazdice">${dl.filter(([, v]) => v).map(([k, v]) => `<div><small>${esc(k)}</small><b>${esc(v)}</b></div>`).join("")}</div>
    <div class="bk-mriz"><section data-s="ucet"><h5>${esc(L(["Účet", "Account"]))}</h5><div class="bk-t"></div><div class="bk-b"></div></section>
    <section data-s="pujcka"><h5>${esc(L(["Půjčka", "Loan"]))}</h5><div class="bk-t"></div><div class="bk-b"></div></section></div>
    <section data-s="jine" class="bk-jine"><div class="bk-t"></div><div class="bk-b"></div></section>`;
  const sek = (k) => wrap.querySelector(`[data-s="${k}"]`);
  const kam = (t) => /půjč|důvěryhod|splát|splat|úrok|dluh|upomín|borrow|loan|repay|interest/i.test(t) ? "pujcka"
    : /úschov|účet|vklad|vlož|výběr|vybrat|deposit|withdraw|account/i.test(t) ? "ucet" : "jine";
  stav.remove();
  [...dtext.children].filter((n) => n.tagName !== "H3").forEach((n) => sek(kam(n.textContent)).querySelector(".bk-t").append(n));
  // r27-23: tlačítka po řádcích podle akce — „Vložit: 10 · 50 · 100 · 500 · vše“, „Vybrat: …“, „Půjčit: …“, „Splatit: …“; každá akce svou barvou
  const AKCE = [["vlozit", /^\s*(Vložit|Deposit)/i], ["vybrat", /^\s*(Vybrat|Withdraw)/i], ["pujcit", /^\s*(Půjčit|Borrow)/i], ["splatit", /^\s*(Splatit|Repay)/i]];
  const radky = {};
  ctl.forEach((c) => {
    const t = popis(c), ak = AKCE.find(([, re]) => re.test(t));
    if (!ak || c.tagName === "SELECT") { c.classList.add("small"); sek(kam(t)).querySelector(".bk-b").append(c); return; }
    const k = ak[0];
    if (!radky[k]) { const r = document.createElement("div"); r.className = "bk-radek " + k;
      r.innerHTML = `<span class="bk-co">${esc(t.trim().split(/\s+/)[0])}</span><div class="bk-castky"></div>`; radky[k] = r; sek(kam(t)).querySelector(".bk-b").append(r); }
    c.className = "btn small bk-castka " + k;
    c.textContent = t.trim().replace(/^\S+\s*/, "").replace(/\s*gr\.?$/, "") || t;
    radky[k].querySelector(".bk-castky").append(c);
  });
  wrap.querySelectorAll("section").forEach((s) => { if (!s.querySelector(".bk-t").children.length && !s.querySelector(".bk-b").children.length) s.remove(); });
  dtext.append(wrap);
  box.querySelectorAll(".vctl .vrow").forEach((r) => { if (!r.children.length) r.remove(); });
  box.querySelectorAll(".vctl").forEach((v) => { if (!v.children.length) v.remove(); });
}

// r27-5: okno s více nadpisy (např. Na stezkách) — první nadpis zůstane, úvodní poznámky v rámečku pravidel, další oddíly jako karty
function sekceKarty(box) {
  const dtext = box.querySelector(".dtext"); if (!dtext) return;
  const h3s = [...dtext.querySelectorAll(":scope > h3")];
  if (h3s.length < 3) return;
  let n = h3s[0].nextElementSibling;
  const pozn = [];
  while (n && n.tagName !== "H3") { const d = n.nextElementSibling; if (n.classList.contains("pozn")) pozn.push(n); n = d; }
  if (pozn.length) {
    const r = document.createElement("div"); r.className = "pravidla";
    r.innerHTML = `<span class="pr-ik">ⓘ</span><div></div>`;
    pozn[0].before(r); r.querySelector("div").append(...pozn);
  }
  const mriz = document.createElement("div"); mriz.className = "sekce-mriz";
  h3s[1].before(mriz);
  for (const h of h3s.slice(1)) {
    const k = document.createElement("section"); k.className = "sekce-karta";
    const t = document.createElement("h5"); t.append(...h.childNodes); k.append(t);
    let x = h.nextElementSibling;
    while (x && x.tagName !== "H3") { const d = x.nextElementSibling; k.append(x); x = d; }
    mriz.append(k); h.remove();
  }
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
  if (!chatRebuild(box, `<div class="kh-arena">${side(c.cocks[0], 0)}<div class="kh-vs">VS</div>${side(c.cocks[1], 1)}</div>
    <p class="kh-head">${head}</p>${mine}${bets}${again}${log ? `<ol class="kh-log">${log}</ol>` : ""}${c.id ? chatHtml("kohout:" + c.id, c.chat) : ""}`, c.id ? { ["kohout:" + c.id]: c.chat } : {})) return;
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
      <div class="row"><button class="btn primary" data-go="misto/hostinec-hraci">${esc(L(["Vyzvat hráče", "Challenge a player"]))}</button>
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
    <div class="row hspodek">${T_.done ? `<button class="btn primary" data-go="misto/hostinec-hraci">${esc(L(["Nová výzva", "New challenge"]))}</button>`
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
    const it = r.closest(".acts") || r.closest(".item"), n = Number(r.value);   // r27-14: posuvník může být i ve spodním okně (telefon)
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
  const back = shopId === "Hostinský" ? "misto/hostinec" : shopId === "Mlynář" || shopId === "Pašerák" ? "mesto" : "misto/trziste";
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
  let kat = "", q = "", barvi = "";                    // r27-6: u oděvu, pláště, zbroje a štítu se při nákupu vybírá barva
  const zvol = {};                                     // zvolená barva u zboží (rozklikávací výběr)
  const cena = (i) => i.price + (i.colors ? (i.dye_fees || {})[zvol[i.id] || "Přírodní"] || 0 : 0);   // obarvení za příplatek podle barviva
  const sedi = (i) => !q || i.name.toLowerCase().includes(q.toLowerCase());
  // r27-5: víc kusů posuvníkem (u jídla, střeliva, surovin…), cena se přepočítá
  const mnoz = (max, cena) => max > 1 ? `<label class="mnoz" title="${esc(L(["Kolik kusů", "How many"]))}"><input type="range" min="1" max="${max}" value="1" data-mn data-cena="${cena}"><b>×1</b></label>` : "";
  const koupit = (i) => { const mx = i.level <= lvl ? Math.max(1, Math.min(20, Math.floor(S.me.coins / Math.max(1, cena(i))))) : 1;   // r27-6: posuvník u všeho zboží
    const hxv = i.colors ? i.colors[zvol[i.id] || "Přírodní"] : "";   // r27-6: zvolená barva je vidět i na ikoně zboží
    const ik = hxv ? `<span class="ikona-barva${/zbroj|štít|stit/i.test(i.slot_name || "") ? " kov" : ""}" style="--b:${hxv};--m:url('${IMG_BASE}predmety/ikony/${Postava.slug(i.id)}.webp')">${icon(i.id)}<i></i></span>` : icon(i.id);
    return `<div class="item">${ik}
      <div><div class="nm">${esc(i.name)}${i.level > lvl ? `<span class="tag lock">${esc(t("from_level", i.level))}</span>` : ""}</div>
      <div class="meta">${esc(i.slot_name)}${i.fx ? ` · <b class="fx">${esc(i.fx)}</b>` : ""}${i.count ? " · " + esc(t("have", i.count)) : ""}</div>${statyHtml(i)}</div>
      <div class="acts">${mnoz(mx, cena(i))}<span class="price" data-cena-txt>${esc(t("coins", cena(i)))}</span>
        <button class="btn small primary" data-buy="${esc(i.id)}"${i.colors ? ` data-barva="${esc(zvol[i.id] || "Přírodní")}"` : ""}${i.level > lvl || cena(i) > S.me.coins ? " disabled" : ""}>${esc(t("buy"))}</button></div>
      ${i.colors ? (() => { const c = zvol[i.id] || "Přírodní", hx = i.colors[c];
        return `<button class="kup-vyber${barvi === i.id ? " on" : ""}" data-barvit="${esc(i.id)}"><i${hx ? ` style="--b:${hx}"` : ` class="prirodni"`}></i>${esc(L(["Barva: ", "Colour: "]) + c)}${hx ? ` <b>+${(i.dye_fees || {})[c] || 0} gr.</b>` : ""} <span>${barvi === i.id ? "▴" : "▾ " + esc(L(["vybrat barvu", "choose"]))}</span></button>
        ${barvi === i.id ? `<div class="kup-barva">${Object.entries(i.colors).sort(([a], [b]) => ((i.dye_fees || {})[a] || 0) - ((i.dye_fees || {})[b] || 0)).map(([cc, h2]) =>
          `<button class="kb${cc === c ? " on" : ""}" data-zvol="${esc(i.id)}" data-barva="${esc(cc)}" title="${esc(cc)}"><i${h2 ? ` style="--b:${h2}"` : ` class="prirodni"`}></i><small>${esc(cc)}</small><em>${(i.dye_fees || {})[cc] ? "+" + i.dye_fees[cc] + " gr." : L(["zdarma", "free"])}</em></button>`).join("")}</div>` : ""}`; })() : ""}</div>`; };
  const prodat = (i) => `<div class="item${i.sell ? "" : " nechce"}">${icon(i.id)}
      <div><div class="nm">${esc(i.name)}${i.count > 1 ? ` <span class="muted">× ${i.count}</span>` : ""}${barvaStitek(i.color, i.hex)}${i.sell && i.best ? `<span class="tag ok">${esc(L(["nejlepší výkup", "best price"]))}</span>` : ""}</div>
      <div class="meta">${esc(i.sell ? (i.best_shop ? L(["víc dá ", "more at "]) + i.best_shop + " (" + t("coins", i.best_price) + ")" : i.slot_name) : L(["tohle nevykupuje", "won't buy this"]))}</div>${opotrebeni(i)}</div>
      <div class="acts">${i.sell ? `${mnoz(i.count, i.sell)}<span class="price" data-cena-txt>${esc(t("coins", i.sell))}</span>
        <button class="btn small" data-sell="${esc(i.id)}"${i.color ? ` data-barva="${esc(i.color)}"` : ""}>${esc(t("sell"))}</button>` : ""}</div></div>`;
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
    { const n2 = $("#mine-n2"); if (n2) n2.textContent = "· " + (data.mine || []).filter((i) => i.sell).length; }
    wireMnoz(box);
    const kolik = (b) => Number((b.closest(".acts") || b.closest(".item"))?.querySelector("[data-mn]")?.value || 1);   // r27-14: ve spodním okně telefonu
    box.querySelectorAll("[data-barvit]").forEach((b) => b.onclick = () => { barvi = barvi === b.dataset.barvit ? "" : b.dataset.barvit; drawShop(); });
    box.querySelectorAll("[data-zvol]").forEach((b) => b.onclick = () => { zvol[b.dataset.zvol] = b.dataset.barva; barvi = ""; drawShop(); });
    box.querySelectorAll("[data-buy]").forEach((b) => b.onclick = () => { b.disabled = true; call("buy", { item: b.dataset.buy, count: kolik(b), shop: shopId, color: b.dataset.barva || "" })
      .then((r) => { Zvuk.sfx("mince"); toast(t("bought", r.price) + (r.count > 1 ? ` (${r.count}×)` : "")); render(); }).catch(() => { b.disabled = false; }); });
    box.querySelectorAll("[data-sell]").forEach((b) => b.onclick = () => {
      const n = kolik(b);
      b.disabled = true;
      call("sell", { item: b.dataset.sell, shop: shopId, count: n, color: b.dataset.barva || "" }).then((r) => { Zvuk.sfx("mince"); toast(t("sold", r.price)); render(); }).catch(() => { b.disabled = false; });
    });
    loadIcons([...rows, ...mine].map((i) => i.id));
    mobilniSeznam(box);
  };
  const mins = data.restock_min || 0;
  const left = mins >= 60 ? t("hm", Math.floor(mins / 60), mins % 60) : t("m", mins);
  const grain = shopId === "Mlynář" ? ((data.mine || []).find((i) => i.id === "Obilí") || {}).count || 0 : 0;
  box.replaceChildren(h(`${shopId === "Mlynář" ? `<div class="panel notice" style="margin-bottom:12px">⚙️ ${esc(L(["Mlynář ti semele obilí na mouku za 1 groš za pytel.", "The miller grinds your grain into flour for 1 groschen a sack."]))}
      <button class="btn small primary" id="mill"${grain ? "" : " disabled"}>${esc(L(["Semlít obilí", "Grind grain"]))}${grain ? ` (${grain}×)` : ""}</button></div>` : ""}
    <div class="panel truhla-stav obchod-stav"><div class="ts-info"><b>${esc(data.name)}</b>
      <span>${esc(L(["Měšec: ", "Purse: "]) + t("coins", S.me.coins))}</span>${data.smuggler ? `<span class="dim">${esc(data.night ? L(["Každou noc jiné zboží · vykupuje jen cennosti a trofeje", "New goods every night · buys only valuables and trophies"]) : L([`Pašerák tu není — přijde v noci (21–5), asi za ${Math.floor(data.opens_min / 60)} h ${data.opens_min % 60} min.`, "The smuggler comes at night (9 pm–5 am)."]))}</span>` : `<span class="dim">🔄 ${esc(t("restock", left))}</span>`}</div>
      <div class="row">${DILNA[shopId] !== undefined ? `<button class="btn" id="oprava" title="${esc(L(["Opotřebená výbava zpět na 100 %, zušlechtění nasazené", "Worn gear back to 100 %, improve what you wear"]))}">${esc(L(["Opravit a zušlechtit", "Repair and improve"]))}</button>` : ""}
      <input class="search" id="shop-q" type="search" placeholder="${esc(t("search"))}"></div></div>
    <div class="obchod-prepinac${data.prebarvit || data.lecba ? " tri" : ""}" role="tablist">
      <button class="${S.shopStrana !== "prodat" && !((data.prebarvit || data.lecba) && S.shopStrana === "barvit") ? "on" : ""}" data-strana="koupit">${esc(L(["Koupit", "Buy"]))}</button>
      <button class="${S.shopStrana === "prodat" ? "on" : ""}" data-strana="prodat">${esc(L(["Prodat", "Sell"]))} <span id="mine-n2"></span></button>
      ${data.prebarvit ? `<button class="${S.shopStrana === "barvit" ? "on" : ""}" data-strana="barvit">${esc(L(["Přebarvit", "Recolor"]))}</button>` : ""}
      ${data.lecba ? `<button class="${S.shopStrana === "barvit" ? "on" : ""}" data-strana="barvit">${esc(L(["Vyléčit", "Heal"]))}</button>` : ""}</div>
    ${data.prebarvit || data.lecba ? `<div class="panel prebarvit"${S.shopStrana === "barvit" ? "" : " hidden"} id="prebarvit"></div>` : ""}
    <div class="grid g2 truhla-sloupce obchod-sloupce strana-${S.shopStrana === "prodat" ? "prodat" : "koupit"}" style="align-items:start"${(data.prebarvit || data.lecba) && S.shopStrana === "barvit" ? " hidden" : ""}>
      <div class="panel"><div class="spread"><h3>${esc(L(["Zboží", "For sale"]))}</h3><span class="pill">${data.items.length}</span></div>
        <div class="filter shop-kat" id="shop-kat"></div><div class="items" id="shop-items"></div></div>
      <div class="panel"><div class="spread"><h3>${esc(L(["Tvoje věci — prodej", "Your things — sell"]))}</h3><span class="pill" id="mine-n"></span></div>
        <p class="muted small">${esc(L(["Každý obchodník dá nejvíc za své zboží, jinde jen polovic.", "Each merchant pays most for his own trade."]))}</p>
        <div class="items" id="shop-mine"></div></div>
    </div>`));
  box.querySelectorAll("[data-strana]").forEach((b) => b.onclick = () => {   // r27-11: na mobilu Koupit / Prodat přepínačem (bez dlouhého scrollování)
    S.shopStrana = b.dataset.strana;
    box.querySelectorAll("[data-strana]").forEach((x) => x.classList.toggle("on", x === b));
    const sl = box.querySelector(".obchod-sloupce"); sl.classList.toggle("strana-prodat", S.shopStrana === "prodat"); sl.classList.toggle("strana-koupit", S.shopStrana !== "prodat");
    const pb = $("#prebarvit"); if (pb) { pb.hidden = S.shopStrana !== "barvit"; sl.hidden = S.shopStrana === "barvit"; }
  });
  // r27-20: krejčí přebarví nasazené oblečení, pláště, kožené zbroje a štíty — poplatek podle barviva, nejméně 20 gr.
  const PB = { vyb: {} };
  const drawPrebarvit = () => {
    const el = $("#prebarvit"); if (!el) return;
    if (data.lecba) {                                     // r27-22: apatykář — služba Vyléčit
      const lb = data.lecba;
      el.innerHTML = `<div class="spread"><h3>${esc(L(["Ošetření u apatykáře", "Treatment"]))}</h3></div>
        <p class="muted small">${esc(L(["Apatykář vyčistí a obváže rány a zahřeje tě odvarem — vrátí ti všechny životy a zažene prochladnutí. Cena podle ran, 15 gr. za stupeň prochladnutí, nejméně 10 gr.", "Restores all health and cures chill."]))}</p>
        <div class="pb-vec"><div><div class="nm">❤ ${lb.zivot} / ${lb.max}${lb.prochlad ? ` · 🥶 ${esc(lb.prochlad)}` : ""}</div>
          <div class="meta">${esc(lb.cena ? (lb.chybi ? L(["Chybí ", "Missing "]) + lb.chybi + L([" životů", " HP"]) : "") + (lb.chybi && lb.prochlad ? " · " : "") + (lb.prochlad ? L(["prochladnutí", "chill"]) : "") : L(["Jsi zdráv, není co léčit.", "You're healthy."]))}</div></div>
          <div class="acts"><button class="btn small primary" id="lecit"${lb.cena && lb.cena <= S.me.coins ? "" : " disabled"}>${esc(L(["Vyléčit", "Heal"]))}${lb.cena ? " · " + lb.cena + " gr." : ""}</button></div></div>`;
      const b = $("#lecit"); if (b) b.onclick = () => { b.disabled = true;
        call("vylecit", {}).then((r) => { Zvuk.sfx("mince"); toast(L([`Ošetřeno za ${r.price} gr.`, `Healed for ${r.price} gr.`])); render(); }).catch(() => { b.disabled = false; }); };
      return;
    }
    const P2 = data.prebarvit || [];
    el.innerHTML = `<div class="spread"><h3>${esc(L(["Přebarvit, co máš na sobě", "Recolor what you wear"]))}</h3></div>
      <p class="muted small">${esc(data.shop === "Zbrojíř" ? L(["Zbrojíř přebarví kov — přilby, plechy, kroužky. Cena podle úpravy, nejméně 20 gr.", "The armourer refinishes metal. At least 20 gr."]) : L(["Krejčí přebarví látku, kůži i dřevo. Cena podle barviva, nejméně 20 gr. Kov přebarví zbrojíř.", "The tailor dyes cloth and leather. At least 20 gr."]))}</p>
      ${P2.length ? P2.map((it) => { const v = PB.vyb[it.id], o = it.options.find((x) => x.color === v);
        return `<div class="pb-vec"><div><div class="nm">${esc(it.name)}${barvaStitek(it.color, it.hex)}</div>
          <div class="pb-barvy">${it.options.map((x) => `<button type="button" class="pb-barva${x.color === v ? " on" : ""}" data-pbi="${esc(it.id)}" data-pbc="${esc(x.color)}" title="${esc(x.color + " · " + x.price + " gr.")}"><i${x.hex ? ` style="--b:${x.hex}"` : ` class="prirodni"`}></i></button>`).join("")}</div>
          <div class="meta">${o ? esc(L(["Nová barva: ", "New color: "]) + o.color.toLowerCase()) : esc(L(["Vyber barvu", "Pick a color"]))}</div></div>
          <div class="acts"><button class="btn small primary" data-pbgo="${esc(it.id)}"${o && o.price <= S.me.coins ? "" : " disabled"}>${esc(L(["Přebarvit", "Recolor"]))}${o ? " · " + o.price + " gr." : ""}</button></div></div>`; }).join("")
      : `<div class="empty">${esc(data.shop === "Zbrojíř" ? L(["Nemáš na sobě nic kovového, co by šlo přebarvit.", "Nothing to refinish."]) : L(["Nemáš na sobě nic, co by krejčí přebarvil.", "Nothing to recolor."]))}</div>`}`;
    el.querySelectorAll("[data-pbc]").forEach((b) => b.onclick = () => { PB.vyb[b.dataset.pbi] = b.dataset.pbc; drawPrebarvit(); });
    el.querySelectorAll("[data-pbgo]").forEach((b) => b.onclick = () => { const id = b.dataset.pbgo; b.disabled = true;
      call("prebarvit", { item: id, color: PB.vyb[id], shop: data.shop }).then((r) => { Zvuk.sfx("mince"); toast(L([`Přebarveno za ${r.price} gr.`, `Recolored for ${r.price} gr.`])); delete PB.vyb[id]; render(); }).catch(() => { b.disabled = false; }); });
  };
  drawPrebarvit();
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
        <div class="prsi-vrch">${g.top ? pcard(g.top, -1) : ""}${g.suit && g.top && g.top[0] === "Q" ? `<span class="prsi-barva">${suitSvg(g.suit, "mala")}${esc(g.suit_name)}</span>` : ""}</div></div>
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
      `<button class="btn prsi-su" data-su="${su}" title="${esc(SUIT[su]?.n[0] || su)}">${suitSvg(su, "stredni")}<small>${esc(SUIT[su]?.n[0] || su)}</small></button>`).join("")}</div>`;
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
const AREA_ART = { rataje: "rataje", kutna_hora: "kanek", nebakov: "lezeni", trosky: "malesov", sedlec: "sedlec", posazavi: "posazavi" };
const SIT_ART = { CORPSE: "sit-mrtvy-poutnik", B: "sit-prepadeni", C: "sit-past", D: "sit-hadanka", E: "sit-odpocinek", F: "sit-odpocinek",
  G: "sit-zaval", FORD: "sit-brod", H: "sit-zaval", I: "sit-noc", J: "sit-truhla-zavrena", K: "sit-obchodnik", A: "sit-truhla-otevrena",
  ROPE: "sit-brod", FERRY: "sit-brod", N: "sit-zaval", O: "sit-noc", P: "sit-obchodnik",
  XKUPEC: "sit-obchodnik", XRANENY: "sit-mrtvy-poutnik", XVYTI: "sit-noc", XSTUDNA: "sit-truhla-zavrena", XMED: "sit-odpocinek", XHROB: "sit-hadanka",   // r27-6
  XDEZERTER: "sit-prepadeni", XOTRESY: "sit-zaval", XHOUBY: "sit-odpocinek", XVUZ: "sit-truhla-otevrena", XOLTAR: "sit-hadanka", XMLHA: "sit-noc",
  Z_ALKUIN: "sit-alkuin", Z_ZVONY: "sit-zvony", Z_SIFRA: "sit-sifra", Z_VAHY: "sit-vahy", Z_OPAT: "sit-vahy", Z_BLUDISTE: "sit-bludiste",   // r27-10: Posázaví
  Z_RELIKVIAR: "sit-relikviar", Z_STIN: "sit-stin", Z_POUSTEVNIK: "sit-hadanka", Z_DVUR: "sit-truhla-otevrena", Z_KAPLE: "sit-setkani",
  Z_UHLIR: "sit-setkani", Z_MLYN: "sit-setkani", Z_LEZENI: "sit-prepadeni", Z_BRANA: "sit-prepadeni", Z_FINALE: "sit-vitezstvi" };
const ENEMY_ART = [[/Setník Benedek/, "boss-setnik-benedek"], [/Rybí oko/, "boss-simon-rybi-oko"], [/Odpadlý písař/, "boss-odpadly-pisar"],
  [/Hejtman Imre/, "boss-hejtman-imre"], [/Uherský žoldnéř/, "nepritel-uhersky-zoldner"], [/Černý rytíř/, "boss-cerny-rytir"], [/Dutohlav/, "boss-dutohlav"], [/Falešný kat/, "boss-falesny-kat"], [/hejtman/i, "boss-hejtman"],
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
/** r27-12: tlačítka výpravy po kategoriích — každá má svůj vzhled a znak:
 *  mimo boj: Cesta (se šipkou směru) · Akce · Dovednost · Výzva (pán místa) · drobnosti · Odejít do města
 *  v boji:  Útok · Obrana · Podpora · Ústup */
const VYP_DRUH = (id, boj) => {
  const a = String(id || "").split(":").pop();
  if (boj) {
    if (/^(attack|heavy|quick|counter|flee_no)$/.test(a)) return "utok";
    if (/^(defend|dodge|guard)$/.test(a)) return "obrana";
    if (/^(flee|withdraw)$/.test(a)) return "ustup";
    return "drobne";
  }
  if (/^go\d+$/.test(a)) return "cesta";
  if (/^sc-(skip|back|leave|ustup)$/.test(a)) return "ustup";      // r27-15: situace — odejít / vrátit se
  if (/^sc-(fight|attack|boss)$/.test(a)) return "vyzva";            // situace — boj
  if (/^(extract|return)$/.test(a)) return "domu";
  if (a === "withdraw" || a === "lpgive") return "ustup";
  if (/^na-boss$|^boss$/.test(a)) return "vyzva";
  if (/^na-(hunt|stalk|skin|gather|fish|dig)$|^lp\d+$/.test(a)) return "dovednost";
  if (/^(useitem|gift|journal|abilities|panel)$/.test(a) || /^ks:party:/.test(id)) return "drobne";
  return "akce";
};
const VYP_ZNAK = {
  akce: '<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/></svg>',
  dovednost: '<svg viewBox="0 0 24 24"><path d="M5 19l9-9"/><path d="M14 4l6 6-3 1-4-4z"/><path d="M4 20l2-2"/></svg>',
  vyzva: '<svg viewBox="0 0 24 24"><path d="M4 20L18 6M18 6h-5M18 6v5"/><path d="M20 20L6 6M6 6h5M6 6v5"/></svg>',
  domu: '<svg viewBox="0 0 24 24"><path d="M4 11l8-7 8 7"/><path d="M6 10v10h12V10"/><path d="M10 20v-6h4v6"/></svg>',
  utok: '<svg viewBox="0 0 24 24"><path d="M5 19L19 5M19 5h-5M19 5v5"/><path d="M4 16l4 4"/></svg>',
  obrana: '<svg viewBox="0 0 24 24"><path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z"/></svg>',
  ustup: '<svg viewBox="0 0 24 24"><path d="M10 6l-6 6 6 6"/><path d="M4 12h16"/></svg>',
};
const SIPKA = (d) => `<svg viewBox="0 0 24 24" style="transform:rotate(${(d || 0) * 45}deg)"><path d="M12 4v16"/><path d="M6 10l6-6 6 6"/></svg>`;
const SVET = [["S", "N"], ["SV", "NE"], ["V", "E"], ["JV", "SE"], ["J", "S"], ["JZ", "SW"], ["Z", "W"], ["SZ", "NW"]];

function raidControlsHtml(list, busy, boj = false, dirs = []) {
  if (!list || !list.length) return "";
  const tl = list.filter((c) => c.t !== "select");
  const sk = { cesta: [], akce: [], dovednost: [], vyzva: [], utok: [], obrana: [], drobne: [], ustup: [], domu: [] };
  tl.forEach((c) => sk[VYP_DRUH(c.id, boj)].push(c));
  const cena = (raw) => { const x = /⚡\s*(\+?\d+)/.exec(raw || ""); return x ? `<em class="vb-vydrz" title="${esc(L(["výdrž", "stamina"]))}">${x[1].startsWith("+") ? x[1] : "−" + x[1]}</em>` : ""; };
  const text = (c) => esc(noEmoji(String(c.label).replace(/⚡\s*\+?\d+/, "")).replace(/^[↩\s]+/, "").trim());
  const btn = (c, druh) => {
    let znak = VYP_ZNAK[druh] || "";
    if (druh === "cesta") {
      const i = Number((/go(\d+)$/.exec(c.id) || [])[1]), d = dirs[i];
      const zpet = /^\s*↩|Zpět:/.test(c.label);
      znak = zpet ? VYP_ZNAK.ustup : d == null ? SIPKA(0) : SIPKA(d);
      return `<button class="btn vbtn vb vb-cesta${zpet ? " zpet" : ""}" data-cid="${esc(c.id)}"${c.disabled ? " disabled" : ""}><i class="vb-znak">${znak}</i>`
        + `<span>${text(c)}</span>${d != null && !zpet ? `<small class="vb-svet">${esc(L(SVET[d]))}</small>` : ""}</button>`;
    }
    return `<button class="btn vbtn vb vb-${druh}" data-cid="${esc(c.id)}"${c.disabled ? " disabled" : ""}>${znak ? `<i class="vb-znak">${znak}</i>` : ""}<span>${text(c)}</span>${cena(c.label)}</button>`;
  };
  const rada = (druh, cls = "") => sk[druh].length ? `<div class="vb-rada vb-r-${druh}${cls}">${sk[druh].map((c) => btn(c, druh)).join("")}</div>` : "";
  return `<div class="vctl vyp-ctl vb-ctl${busy ? " busy" : ""}${boj ? " vb-boj" : ""}">
    ${boj ? rada("utok") + rada("obrana") + rada("drobne") + rada("ustup")
          : rada("vyzva") + rada("cesta") + rada("akce") + rada("dovednost") + rada("ustup") + rada("drobne") + rada("domu")}
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
  document.documentElement.classList.toggle("bez-menu", !!m && m.status !== "lobby" && S.tab === "vyprava");   // r27-12: na výpravě a v boji bez spodního menu
  if (!m && !(st.locations || []).length && !RAID.dociti && !st._docteno) {   // r27-22: po návratu z výpravy (odpověď bez seznamu míst) načíst čerstvou přípravu
    RAID.dociti = true;
    raidLoad().then((x) => { RAID.st = { ...(x || st), _docteno: true }; }).catch(() => {}).finally(() => { RAID.dociti = false; if (S.tab === "vyprava") drawRaid($("#view")); });
  }
  if (!m) { drawRaidSetup(view, st); return; }
  if (m.status === "lobby") { drawLobby(view, m); return; }
  const e = m.enemy, combat = m.phase === "combat" && e;
  const busy = m.busy_until && m.busy_until * 1000 > Date.now();
  const myTurn = !combat || !m.turn || m.turn === m.me;
  // r27-12: v obraze malé kruhové ukazatele — v boji životy a energie, mimo boj životy, sytost a žízeň (r27-22: jako u postavy)
  const kruh = (nazev, v, max, cls, txt) => { const p = Math.max(0, Math.min(100, Math.round(100 * v / Math.max(1, max))));
    return `<div class="vk ${cls}${(cls.includes("zizen") ? p >= 75 : p <= 25) ? " malo" : ""}" style="--p:${p}" title="${esc(nazev)}: ${esc(txt)}"><i><b>${esc(txt)}</b></i><small>${esc(nazev)}</small></div>`; };
  const members = (m.members || []).map((p) => `<div class="vmem${combat && m.turn === p.id ? " turn" : ""}"><b>${esc(p.name.split(" ")[0])}</b><div class="vk-rada">
    ${kruh(L(["Životy", "Health"]), p.health, p.max_health, "hp", String(p.health))}
    ${combat ? (p.stamina ? kruh(L(["Energie", "Energy"]), p.stamina[0], p.stamina[1], "st", String(p.stamina[0])) : "")
      : `${p.satiety != null ? kruh(L(["Hlad", "Hunger"]), 100 - p.satiety, 100, "jidlo zizen", Math.max(0, 100 - p.satiety) + "%") : ""}${p.hydration != null ? kruh(L(["Žízeň", "Thirst"]), 100 - p.hydration, 100, "voda zizen" + (p.hydration <= 25 ? " vysoka" : ""), Math.max(0, 100 - p.hydration) + "%") : ""}`}</div></div>`).join("");
  const foe = combat ? `<div class="vfoe${e.boss ? " boss" : ""}">${IMG("bytosti/" + enemyArt(e.name))}</div>
    <div class="vfoehud"><b>${e.boss ? "👑 " : ""}${esc(e.name.split(" — ")[0])}</b>${bar(e.health, e.max_health, "hp big")}<span class="vval">${e.health}/${e.max_health}</span>
      ${e.intent ? `<div class="vintent">${esc(e.intent)}</div>` : ""}
      ${e.pack && e.pack.length ? `<div class="vpack">${e.pack.map((p) => `<span>${esc(p.name.split(" — ")[0])}${p.health != null ? " · ❤️ " + p.health : ""}</span>`).join("")}</div>` : ""}</div>` : "";
  const vp = vypJenPribeh(m.content, m);   // r27-12: jen příběh; počítadla a varování do obrazu
  const hud = !combat && vp.info.prozkoumano ? `<div class="vhud">${vp.info.prozkoumano ? `<span title="${esc(L(["Prozkoumáno", "Explored"]))}">${esc(L(["prozkoumáno ", "explored "]) + vp.info.prozkoumano)}</span>` : ""}${vp.info.nalez ? `<span>${esc(L(["nálezy ", "finds "]) + vp.info.nalez)}</span>` : ""}</div>` : "";
  const sit = !combat && m.situation && SIT_ART[m.situation] ? `<div class="vsit">${IMG("situace/" + SIT_ART[m.situation])}</div>` : "";
  view.replaceChildren(h(`<div class="vyp v2${combat ? " boj" : ""}">
    <div class="vscene live${combat ? " fight" : ""}" data-img="${esc(sc.img)}" data-key="${esc(sc.key)}">
      <div class="vtitle"><h2>${esc(m.node || m.location)}</h2><small>${esc(m.location)}${m.weather ? " · " + esc(m.weather) : ""}</small></div>
      ${foe}${sit}${hud}<div class="vparty">${members}</div>
      ${combat ? `<div class="vturn${myTurn && !busy ? " moje" : ""}">${busy ? esc(L(["Probíhá tah…", "Turn in progress…"])) : myTurn ? esc(L(["Jsi na tahu", "Your turn"])) : esc(L(["Na tahu je jiný člen družiny", "Another member's turn"]))}</div>` : ""}
    </div>
    <div class="vyp-telo">
      ${vp.text ? `<article class="vyp-pergamen"><div class="vtext">${dmd(vp.text)}</div></article>` : ""}
      <div class="vyp-akce">${raidControlsHtml(m.controls, busy, combat, m.exit_dirs || [])}</div>
    </div></div><div id="vpanel"></div>`));
  vypPergamen(view.querySelector(".vyp-pergamen"), m);
  const s = mountLive(view, { still: m.phase === "combat" });
  if (s && m.under) s.el.classList.add("is-night");
  Zvuk.scene(m.under ? ["fire"] : ["forest"], { ...(S.me || {}), weather: m.weather || (S.me || {}).weather }, !!m.under);
  Zvuk.music(combat ? (e.boss ? "boss" : "boj") : "vyprava");
  if (RAID.panel) showRaidPanel(RAID.panel);
  wireRaid(view);
  if (!MINI.inAct && !RAID.busy) miniSync(st.mini, RAID.panel, "raid");
  if (busy) setTimeout(async () => { if (S.tab === "vyprava") { const r = await raidLoad(); if (r) { animateDiff(RAID.st, r); RAID.st = r; drawRaid($("#view")); } } }, Math.max(500, m.busy_until * 1000 - Date.now() + 300));
}

/** r27-12: z textu výpravy (stejného jako na Discordu) nechá jen příběh a to, co se právě stalo.
 *  Hlavičku, počítadla, hody kostkou, nápovědy a pokyny „vyber tlačítkem“ vynechá — co je důležité, ukáže obraz (HUD). */
function vypJenPribeh(content, m) {
  const info = { prozkoumano: "", nalez: "", varovani: [] };
  const uzel = noEmoji(m.node || "").trim().toLowerCase();
  const pryc = [
    /^#\s/, /výprava\*\*\s*·/, /^\S*\s*\*\*[^*]+výprava\*\*/i,
    /^🥾/, /^👥/, /👉/, /^🎲 Pořadí/, /^✔️ Už jednali/, /^⚡ Výdrž/, /^❤️ Nepřítel/, /^🧭 \*\*Úsek/,
    /^\*Hádanka:/, /^\*?Vyrážíte/, /^\*\*(Kudy dál\?|Co uděláš\?|Tvůj tah:|Na tahu:)\*\*/, /^🌦️/, /^-# V družině/, /^-# Tvůj postoj/, /^-# Pán tohoto místa/,
  ];
  const ven = [];
  // r27-12: blok „co se stalo“ (### nadpis…) z jiného místa po přesunu nezobrazovat — patří k místu, kde se stal
  const bloky = [];
  let blok = null;
  String(content || "").split("\n").forEach((raw, i) => {
    const l = raw.trim();
    if (/^###\s/.test(l)) { blok = { od: i, klic: noEmoji(l).trim() }; bloky.push(blok); }
    else if (blok && (/^##\s/.test(l) || /^🥾/.test(l))) { blok.do = i; blok = null; }
  });
  const skryt = new Set();
  bloky.forEach((b) => {
    const k = b.klic + "|" + (m.id || "");
    RAID.videno = RAID.videno || {};
    if (RAID.videno[k] == null) RAID.videno[k] = m.node_id;
    if (RAID.videno[k] !== m.node_id && m.phase !== "combat") for (let i = b.od; i < (b.do ?? 1e9); i++) skryt.add(i);
  });
  String(content || "").split("\n").forEach((raw, i) => {
    const l = raw.trim();
    if (skryt.has(i)) return;
    if (!l) { ven.push(""); return; }
    if (/počasí:|vzduch\s*[+−-]?\d+\s*°C/i.test(l)) return;                      // počasí je v obraze
    if (/^\S*\s*\*{0,2}(plný sil|hladov|žízniv|unaven|vyčerpan|prochladl|zmrzl|přehřát|opil)/i.test(noEmoji(l))) return;   // stav postavy je v barech
    if (/\d+\s*[+−-]\s*\d+\s*=\s*\d+|\b\d*k\d+\b|proti\s+OČ/.test(l) && !/[a-zá-ž]{4,}.*[a-zá-ž]{4,}.*[a-zá-ž]{4,}/i.test(l.replace(/proti\s+OČ|zásah|vedle|kritick\S*/gi, ""))) return;   // hody kostkou
    let x;
    if ((x = /prozkoumáno\s+(\d+\/\d+)(?:.*?nalezeno\s+(\d+))?/.exec(l)) && /^📍/.test(l)) { info.prozkoumano = x[1]; info.nalez = x[2] || ""; return; }
    if (/❤️\s*\d+\/\d+\s*·\s*💤/.test(l)) {                       // řádek potřeb — jen varování, když je zle
      [["odpočatost", L(["únava", "tired"])], ["nasycení", L(["hlad", "hungry"])], ["žízeň", L(["žízeň", "thirst"])]].forEach(([k, n]) => {
        const r = new RegExp(k + "\\s+\\d+\\s*(🔴|🟠)").exec(l); if (r) info.varovani.push(n); });
      return;
    }
    if (/^✨/.test(l) || /^🔥 Svítí|^🌑/.test(l)) return;
    if (pryc.some((r) => r.test(l))) return;
    if (/^-#/.test(l) && !/🍖|gr\.|získ|našel|našla|zkušenost|kořist|ztratil|ztratila|zraněn|odměn|\+\d/i.test(l)) return;   // drobné písmo: hody, nápovědy
    if (/^##\s/.test(l) && noEmoji(l.replace(/^##\s*/, "")).trim().toLowerCase() === uzel) return;   // název místa je v obraze
    ven.push(noEmoji(l.replace(/^-#\s*/, "")).replace(/^(#{1,3})\s*/, "$1 "));
  });
  const text = ven.join("\n").replace(/\n{3,}/g, "\n\n").trim();
  return { text, info };
}

/** r27-11: text výpravy jako list pergamenu — bez opakovaného názvu místa, údaje o výpravě jako štítky. */
function vypPergamen(el, m) {
  if (!el) return;
  const vt = el.querySelector(".vtext"); if (!vt) return;
  const cist = (x) => noEmoji(x || "").replace(/\s+/g, " ").trim().toLowerCase();
  const jmena = [m.location, m.node].filter(Boolean).map(cist);
  const tmp = document.createElement("div");
  // md() dává řádky oddělené <br> — rozdělit na odstavce (prázdný řádek) a řádky
  const odst = vt.innerHTML.split(/(?:<br\s*\/?>\s*){2,}/i).map((o) => o.replace(/^(\s*<br\s*\/?>)+|(<br\s*\/?>\s*)+$/gi, "").trim()).filter(Boolean);
  const out = [];
  let stitky = "";
  odst.forEach((o) => {
    const radky = o.split(/<br\s*\/?>/i).filter((r) => {
      tmp.innerHTML = r; const t = cist(tmp.textContent);
      if (!t || jmena.includes(t)) return false;                  // název místa je už v obrázku
      if (!stitky && /výprava|expedition/.test(t) && t.includes(" · ") && t.length < 160) {   // „Lehká výprava · 41. den · 18:38 · Počasí: déšť“
        stitky = " ";   // r27-12: obtížnost, den, čas a počasí jsou v horní liště — tady nic
        return false;
      }
      return true;
    });
    if (radky.length) out.push(`<p>${radky.join("<br>")}</p>`);
  });
  vt.innerHTML = out.join("");
  const p1 = vt.querySelector("p");
  if (p1) { tmp.innerHTML = p1.innerHTML.split(/<br/i)[0]; const b = tmp.querySelector("b");
    if (b && cist(b.textContent) === cist(tmp.textContent) && cist(b.textContent).length < 70) p1.innerHTML = p1.innerHTML.replace(/^\s*<b>(.*?)<\/b>\s*(<br\s*\/?>)?/i, '<span class="vyp-nadpis">$1</span>'); }
}

// r27-4: příprava výpravy na webu — sólo i družina, lokace bez map (mapu si koupíš u písaře), obtížnost, glejt a nosič
const VYP = { mode: "solo", loc: null, diff: null, guard: false, porter: false };
function drawRaidSetup(view, st) {
  const locs = [...(st.locations || [])];   // r27-6: tábořiště se vybírají až u velké výpravy (ne jako zvláštní lokace)
  const camps = st.camps || [];
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
      ${(() => {   // r27-6: lokace po skupinách — Nováček na stezce / Zkušený na stezce
        const karta = (l) => `<button class="vp-volba${String(VYP.loc || "").split("@")[0] === l.id ? " on" : ""}${st.level && l.level > st.level ? " tezke" : ""}" data-loc="${esc(l.id)}">
          <b>${esc(l.name)}</b><small>${esc(l.biome)}${l.camp ? "" : " · " + L(["od úrovně ", "level "]) + l.level}${l.places ? " · " + l.places + L([" míst", " places"]) : ""}</small></button>`;
        const T = st.tiers || [{ id: "vse", name: "", desc: "", keys: locs.map((l) => l.id) }];
        const kde = (l) => (T.find((t) => t.keys.includes(String(l.id).split("@")[0])) || T[0]).id;
        return T.map((t) => { const L_ = locs.filter((l) => kde(l) === t.id); if (!L_.length) return "";
          const vybrana = L_.find((l) => String(VYP.loc || "").split("@")[0] === l.id);
          const start = vybrana && camps.some((c) => c.id.split("@")[0] === vybrana.id) ? `<div class="vp-tabor"><span>${esc(L(["Odkud vyrazit:", "Start from:"]))}</span>
            <button class="vp-mini${VYP.loc === vybrana.id ? " on" : ""}" data-loc="${esc(vybrana.id)}">${esc(L(["Od začátku", "From the start"]))}</button>
            ${camps.filter((c) => c.id.split("@")[0] === vybrana.id).map((c) => `<button class="vp-mini${VYP.loc === c.id ? " on" : ""}" data-loc="${esc(c.id)}">⛺ ${esc(c.name.split(" — ").pop())}</button>`).join("")}
            <small class="muted">${esc(L(["Tábořiště musí znát celá družina.", "The whole party must know the camp."]))}</small></div>` : "";
          return `<div class="vp-skupina ${t.id}">${t.name ? `<div class="vp-sk-hl"><b>${esc(L([t.name, t.id === "zkuseny" ? "Seasoned on the trail" : "Novice on the trail"]))}</b><small>${esc(t.desc)}</small></div>` : ""}
            <div class="vp-volby lok">${L_.map(karta).join("")}</div>${start}</div>`; }).join(""); })()}
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
  if (jeMobil()) vypListy(view);   // r27-12: na telefonu příprava po listech (Kdo · Kam · Obtížnost · Služby), bez scrollování
  const dal = (k) => { if (jeMobil() && VYP.krok === k) VYP.krok = k + 1; };
  view.querySelectorAll("[data-mode]").forEach((b) => b.onclick = () => { VYP.mode = b.dataset.mode; dal(0); drawRaid(view); });
  view.querySelectorAll("[data-loc]").forEach((b) => b.onclick = () => { const camp = String(b.dataset.loc).includes("@"); VYP.loc = b.dataset.loc;
    const ma_tabory = (st.camps || []).some((c) => c.id.split("@")[0] === String(VYP.loc).split("@")[0]); if (camp || !ma_tabory) dal(1); drawRaid(view); });
  view.querySelectorAll("[data-diff]").forEach((b) => b.onclick = () => { VYP.diff = b.dataset.diff; dal(2); drawRaid(view); });
  view.querySelectorAll("[data-tgl]").forEach((b) => b.onclick = () => { VYP[b.dataset.tgl] = !VYP[b.dataset.tgl]; drawRaid(view); });
  if ($("#vp-go")) $("#vp-go").onclick = async (ev) => {
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

/** r27-12: příprava výpravy na telefonu jako listy — nahoře záložky kroků, vidět je jen jeden krok, dole Zpět / Dál / Vyrazit. */
function vypListy(view) {
  const box = view.querySelector(".vyp-priprava"); if (!box) return;
  VYP.krok = Math.max(0, Math.min(3, VYP.krok || 0));
  const kroky = [...box.querySelectorAll(".vp-krok")];
  if (kroky.length < 4) return;
  const listy = kroky.map((k, i) => {                      // vše od nadpisu kroku po další nadpis = jeden list
    const l = document.createElement("div"); l.className = "vp-list" + (i === VYP.krok ? " on" : "");
    k.before(l);
    let n = k; const stop = kroky[i + 1];
    while (n && n !== stop && !n.classList.contains("vp-start")) { const dalsi = n.nextElementSibling; l.appendChild(n); n = dalsi; }
    return l;
  });
  const hotovo = [true, !!VYP.loc, !!VYP.diff, true];
  const nazvy = [L(["Kdo", "Who"]), L(["Kam", "Where"]), L(["Obtížnost", "Difficulty"]), L(["Služby", "Services"])];
  const zal = document.createElement("div");
  zal.className = "m-zalozky vp-zal";
  zal.innerHTML = nazvy.map((n, i) => `<button class="${i === VYP.krok ? "on" : ""}${(i === 1 && VYP.loc) || (i === 2 && VYP.diff) ? " hotovo" : ""}" data-vkrok="${i}"><i>${["I", "II", "III", "IV"][i]}.</i><span>${esc(n)}</span></button>`).join("");
  box.prepend(zal);
  box.querySelector("h3")?.remove();
  const start = box.querySelector(".vp-start");
  if (start && VYP.krok < 3) {
    const go = start.querySelector("#vp-go");
    const d = document.createElement("button");
    d.className = "btn primary big vp-dal"; d.textContent = L(["Dál →", "Next →"]);
    d.disabled = !hotovo[VYP.krok];
    d.onclick = () => { VYP.krok++; drawRaid(view); };
    if (go && !(VYP.loc && VYP.diff)) go.replaceWith(d); else if (go) start.prepend(d);
  }
  box.querySelectorAll("[data-vkrok]").forEach((b) => b.onclick = () => { VYP.krok = Number(b.dataset.vkrok); drawRaid(view); });
}

// r27-4: družina před vyražením — nastavení, role, pozvání hráče, vyrazit
function drawLobby(view, m) {
  view.replaceChildren(h(`${sceneHead("mesto-brana", L(["Družina #", "Party #"]) + m.id + " · " + m.location, m.difficulty || "")}
    <div class="panel vyp-lobby"><article class="vyp-pergamen"><div class="vtext">${dmd(m.content)}</div></article>
      ${controlsHtml(m.controls)}
      ${m.member && (m.players || []).length ? `<div class="row pozvat"><select id="lob-pozvat"><option value="">${esc(L(["Pozvat hráče…", "Invite a player…"]))}</option>
        ${m.players.map((p) => `<option value="${esc(p.id)}">${esc(p.name)}</option>`).join("")}</select>
        <button class="btn" id="lob-poslat">${esc(L(["Poslat pozvánku", "Send invite"]))}</button></div>` : ""}
      <p class="dim small">${esc(L(["Pozvánka přijde hráči do jeho vlákna na Discordu; přidat se může i tady na webu u Brány.", "The invite goes to the player's Discord thread; they can also join here."]))}</p>
    </div><p><button class="btn" data-go="misto/brana">← ${esc(t("back"))}</button></p><div id="vpanel"></div>`));
  mountLive(view);
  vypPergamen(view.querySelector(".vyp-pergamen"), { location: m.location });
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
    miniSync(r.mini, r.panel, "raid");   // r27-6: minihry (páčení, rybaření, lov) v kresleném okně
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

/** r27-22: obchod na výpravě ve stejném rozložení jako ve městě — Koupit / Prodat, řádky s ikonou, cenou a tlačítkem. */
const RSHOP = { strana: "koupit" };
function raidShopHtml(p) {
  const buy = (p.controls || []).find((c) => /^ks:raidbuy:/.test(c.id)), sell = (p.controls || []).find((c) => /^ks:raidsell:/.test(c.id));
  if (!buy && !sell) return "";
  const lines = noEmoji(p.content || "").split("\n").map((x) => x.trim()).filter(Boolean);
  const nazev = (lines[0] || "").replace(/^#+\s*/, ""), info = lines.slice(1).join(" ").replace(/\*\*/g, "");
  const kapsa = (info.match(/Máš ([\d\s]+) gr\./) || [])[1], pozn = lines.slice(2).join(" ").replace(/\*\*/g, "");
  const cena = (o) => (String(o.label).match(/—\s*(\d+)\s*gr\./) || [])[1] || "";
  const jm = (o) => String(o.label).replace(/\s*—\s*\d+\s*gr\..*$/, "");
  const strana = RSHOP.strana === "prodat" && sell ? "prodat" : buy ? "koupit" : "prodat";
  const rada = (c, o, kup) => `<div class="item rs-item">${icon(o.value)}<div><div class="nm">${esc(jm(o))}</div>
      ${o.desc && kup ? `<div class="meta">${esc(o.desc)}</div>` : o.desc ? `<div class="meta">${esc(o.desc)}</div>` : ""}</div>
      <div class="acts"><button class="btn small ${kup ? "primary" : ""}" data-rs="${esc(c.id)}" data-rsv="${esc(o.value)}">${esc(kup ? L(["Koupit", "Buy"]) : L(["Prodat", "Sell"]))} · ${esc(cena(o))} gr.</button></div></div>`;
  return `<div class="rs"><div class="spread"><h3>${esc(nazev)}</h3>${kapsa ? `<span class="pill">${esc(L(["Měšec: ", "Purse: "]) + kapsa.trim() + " gr.")}</span>` : ""}</div>
    <p class="muted small">${esc(L(["Zboží je tu o polovinu dražší, ale vykoupí cokoli za 70 %.", "Goods cost half again as much; buys anything at 70 %."]))}</p>
    ${pozn && !/polovinu dražší/.test(pozn) ? `<p class="small">${esc(pozn)}</p>` : ""}
    <div class="obchod-prepinac tri rs-tabs" style="grid-template-columns:1fr 1fr!important">
      <button class="${strana === "koupit" ? "on" : ""}" data-rss="koupit"${buy ? "" : " disabled"}>${esc(L(["Koupit", "Buy"]))}${buy ? " · " + buy.options.length : ""}</button>
      <button class="${strana === "prodat" ? "on" : ""}" data-rss="prodat"${sell ? "" : " disabled"}>${esc(L(["Prodat", "Sell"]))}${sell ? " · " + sell.options.length : ""}</button></div>
    <div class="items rs-list">${strana === "koupit" ? buy.options.map((o) => rada(buy, o, true)).join("") : sell.options.map((o) => rada(sell, o, false)).join("")}</div></div>`;
}

/** r27-23: vysvětlivky v okénku po klepnutí (rozpis OČ a útoku, potřeby, vlastnosti) — na stránce nezabírají místo. */
const VL_POPIS = { "Síla": ["útok a zranění zbraní na blízko, nošení těžké výbavy"], "Obratnost": ["útok a zranění střelbou, obrana (ne v těžké zbroji), uhýbání, iniciativa"],
  "Odolnost": ["životy, výdrž v boji, pomalejší únava, hlad a žízeň, zima"], "Všímavost": ["všimnout si pastí, stop a skrytých věcí na výpravě"],
  "Učenost": ["čtení, léčení druhů, řemesla a dovednosti"], "Výřečnost": ["vyjednávání, ceny u obchodníků, situace na výpravě"] };
function vysvetli(k, m, P) {
  const R = (P && P.rozpis) || m.rozpis || {}, sg2 = (v) => (v > 0 ? "+" : v < 0 ? "−" : "±") + Math.abs(v);
  const tab = (rows, soucet, nazev) => `<table class="rozpis">${rows.map(([n, v]) => `<tr><td>${esc(noEmoji(n))}</td><td class="${v < 0 ? "minus" : ""}">${esc(sg2(v))}</td></tr>`).join("")}
    <tr class="celkem"><td>${esc(nazev)}</td><td>${esc(String(soucet))}</td></tr></table>`;
  let h1 = "", obsah = "";
  if (k === "stit") { h1 = L(["Obrana (OČ)", "Defence"]); obsah = `<p>${esc(L(["Nepřítel tě zasáhne, když hodí k20 + svůj útok aspoň tolik.", "Enemies must roll this to hit you."]))}</p>${tab(R.oc || [], m.armor_class, L(["Obrana celkem", "Total"]))}`; }
  else if (k === "mec") { h1 = L(["Útok", "Attack"]); obsah = `<p>${esc(L(["Zásah = k20 + útok proti obraně nepřítele. Hozená 20 je kritický zásah.", "Hit = d20 + attack vs defence."]))}</p>${tab(R.utok || [], sg2(m.attack ?? 0), L(["Útok celkem", "Total"]))}`; }
  else if (k === "hvezda") { h1 = L(["Zdatnost", "Proficiency"]); obsah = `<p>${esc(L(["Roste s úrovní (+2 až +6). Přičítá se k útoku i ke zkouškám vlastností na výpravě.", "Grows with level; adds to attack and checks."]))}</p>`; }
  else if (k === "kostka") { h1 = L(["Zranění", "Damage"]); obsah = `<p>${esc(L(["Kostka podle zbraně + bonus Síly (zblízka) nebo Obratnosti (střelba) + zušlechtění zbraně. Kritický zásah hází kostky dvakrát.", "Weapon dice + Strength/Dexterity bonus + enhancement. Crits roll dice twice."]))}</p><p class="rk-velke">${esc(m.damage || "")}</p>`; }
  else if (k === "potreby") { h1 = L(["Tělo a potřeby", "Body and needs"]); obsah = `<p>${esc(L(["Odpočatost: čím víc, tím líp. Hlad a žízeň: čím víc, tím hůř.", "Rest: higher is better. Hunger and thirst: higher is worse."]))}</p>
      <ul><li>${esc(L(["Odpočatost pod 25, hlad či žízeň nad 75 = −1 k útoku (odpočatost i k obraně).", "Below 25 rest / above 75 hunger or thirst = −1."]))}</li>
      <li>${esc(L(["Hlad či žízeň 100, nebo odpočatost 0 = ztrácíš životy.", "At 100 hunger/thirst or 0 rest you lose health."]))}</li>
      <li>${esc(L(["Odpočatost od 80, hlad i žízeň do 20 = plný sil, +1 k útoku a zkouškám.", "Well rested and fed = +1."]))}</li>
      <li>${esc(L(["Přejedení a přepití dá postih, dokud za pár hodin neopadne.", "Overeating gives a penalty for a few hours."]))}</li></ul>`; }
  else if (k === "boj") { return vysvetli("mec", m, P); }
  else if (k === "vl" || k.startsWith("vl:")) { const a = k.slice(3); const s = (m.stats || []).find((x) => x.id === a);
    h1 = a ? a : L(["Vlastnosti", "Attributes"]);
    obsah = (s ? `<p class="rk-velke">${esc(s.value)} · ${esc(L(["bonus ", "bonus "]) + sg2(Math.floor(s.value / 2)))}</p><p>${esc(L(["K čemu: ", "Used for: "]) + ((VL_POPIS[a] || [""])[0]))}</p>` : "")
      + `<p class="muted">${esc(L([`Každé 2 body = +1 k hodům. Za každou úroveň 1 bod; strop teď ${m.stat_cap ?? ""} (roste s úrovní).`, "Every 2 points = +1. One point per level."]))}</p>`; }
  const o = document.createElement("div");
  o.className = "rekap-obal vysv-obal";
  o.innerHTML = `<div class="rekap vyp-pergamen vysv"><h2>${esc(h1)}</h2>${obsah}<div class="row" style="justify-content:center;margin-top:12px"><button class="btn primary" data-ok>${esc(L(["Zavřít", "Close"]))}</button></div></div>`;
  const zavri = () => o.remove();
  o.onclick = (e) => { if (e.target === o || e.target.closest("[data-ok]")) zavri(); };
  document.body.appendChild(o);
}

/** r27-22: po návratu z výpravy pergamen s rekapitulací — kde jste byli, co kdo získal a ztratil. */
function ukazRekap(r) {
  if (!r || document.querySelector(".rekap-obal") || S._rekapId === r.id + ":" + r.t) return;
  S._rekapId = r.id + ":" + r.t;
  const sez = (nad, a, cls = "") => a && a.length ? `<div class="rk-r${cls}"><b>${esc(nad)}</b><span>${a.map((x) => esc(noEmoji(String(x)))).join(" · ")}</span></div>` : "";
  const o = document.createElement("div");
  o.className = "rekap-obal";
  o.innerHTML = `<div class="rekap vyp-pergamen${r.uspech ? "" : " pad"}">
    <h2>${esc(noEmoji(r.hlava || L(["Návrat z výpravy", "Back from the expedition"])))}</h2>
    <p class="rk-kde">${esc([r.oblast, r.obtiznost].filter(Boolean).join(" · "))}${r.prozkoumano ? " · " + esc(L(["prozkoumáno ", "explored "]) + r.prozkoumano) : ""}</p>
    ${r.uvod ? `<p class="rk-uvod">${esc(noEmoji(r.uvod).replace(/\*\*/g, ""))}</p>` : ""}
    ${(r.druzina || []).length > 1 ? `<p class="rk-druzina">${esc(L(["Družina: ", "Party: "]) + r.druzina.join(", "))}</p>` : ""}
    <div class="rk-zisk"><span><i>${esc(String(r.grose || 0))}</i>${esc(L(["grošů", "groschen"]))}</span><span><i>${esc(String(r.zk || 0))}</i>${esc(L(["zkušeností", "XP"]))}</span>${(r.loot || []).length ? `<span><i>${r.loot.length}</i>${esc(L(["věcí", "items"]))}</span>` : ""}</div>
    ${sez(L(["Odnášíš", "Loot"]), r.loot)}${sez(L(["Nosič odnesl domů", "Porter took home"]), r.nosic)}${sez(L(["Nevešlo se (rozhodni na Discordu)", "Didn't fit"]), r["nevešlo"], " pozor")}
    ${sez(L(["Ztráty", "Lost"]), r.ztraty, " pozor")}${sez(L(["Zakázky ke splnění", "Quests done"]), r.zakazky)}${r.poklad ? sez(L(["Mapa pokladu", "Treasure map"]), [r.poklad]) : ""}
    ${sez(L(["Nové úrovně", "Levels"]), r.urovne)}${sez(L(["Odznaky", "Badges"]), r.odznaky)}${sez(L(["Mazlíček", "Pet"]), r.mazlicek)}
    ${r.poplatek ? `<div class="rk-r pozor"><b>${esc(L(["Ošetření u apatykáře", "Treatment"]))}</b><span>−${r.poplatek} gr.</span></div>` : ""}
    <div class="row" style="justify-content:center;margin-top:14px"><button class="btn primary" data-rk-ok>${esc(L(["Rozumím", "Got it"]))}</button></div></div>`;
  document.body.appendChild(o);
  Zvuk.sfx("stranka");
  o.querySelector("[data-rk-ok]").onclick = () => { o.remove(); if (S.me && S.me.profil) S.me.profil.rekap = null; call("rekap_videno", {}).catch(() => {}); };
}
/** r27-22: Použít předmět na výpravě — řádky s ikonou, počtem, účinkem a tlačítkem (místo starého seznamu). */
function raidItemHtml(p) {
  const c = (p.controls || []).find((x) => /^ks:raiditem:/.test(x.id));
  if (!c) return "";
  const lines = noEmoji(p.content || "").split("\n").map((x) => x.trim()).filter(Boolean);
  const pozn = lines.slice(1).join(" ").replace(/\*\*/g, "").replace(/^Vyber, co použiješ\.\s*/, "");
  const rada = (o) => { const spec = /^__/.test(o.value), m = String(o.label).match(/^(.*?)\s*×\s*(\d+)$/);
    const jm = noEmoji(m ? m[1] : o.label).trim(), n = m ? m[2] : "";
    return `<div class="item rs-item">${spec ? `<span class="icon rs-ic">${esc((o.emoji || (String(o.label).match(/^\p{Extended_Pictographic}/u) || ["✦"])[0]))}</span>` : icon(o.value)}
      <div><div class="nm">${esc(jm)}${n ? ` <span class="muted">× ${esc(n)}</span>` : ""}</div>${o.desc ? `<div class="meta">${esc(o.desc)}</div>` : ""}</div>
      <div class="acts"><button class="btn small primary" data-rs="${esc(c.id)}" data-rsv="${esc(o.value)}">${esc(L(["Použít", "Use"]))}</button></div></div>`; };
  return `<div class="rs"><div class="spread"><h3>${esc(L(["Použít předmět", "Use an item"]))}</h3></div>
    ${pozn ? `<p class="muted small">${esc(pozn)}</p>` : ""}
    <div class="items rs-list">${c.options.map(rada).join("")}</div></div>`;
}

function showRaidPanel(p) {
  const box = $("#vpanel"); if (!box) return;
  const rs = raidShopHtml(p) || raidItemHtml(p);
  if (rs) {
    box.innerHTML = `<div class="vmodal"><div class="panel rs-panel">${rs}
      <div class="row" style="margin-top:10px"><button class="btn small" id="vclose">${esc(L(["Zavřít", "Close"]))}</button></div></div></div>`;
    $("#vclose").onclick = () => { RAID.panel = null; box.innerHTML = ""; };
    box.querySelectorAll("[data-rss]").forEach((b) => b.onclick = () => { RSHOP.strana = b.dataset.rss; showRaidPanel(p); });
    box.querySelectorAll("[data-rs]").forEach((b) => b.onclick = () => raidClick(b.dataset.rs, [b.dataset.rsv], b));
    loadIcons([...box.querySelectorAll("[data-rsv]")].map((b) => b.dataset.rsv).filter((v) => !/^__/.test(v)));
    return;
  }
  // r27-22: Rozhlédnout se (a jiné panely s obrázkem) — náhled mapy přímo v okně, klepnutím na celou obrazovku
  box.innerHTML = `<div class="vmodal"><div class="panel${p.image ? " s-mapou" : ""}">${dmd(p.content)}${p.image ? `<img class="vmapa-nahled" src="${p.image}" alt="${esc(L(["Mapa oblasti", "Area map"]))}" title="${esc(L(["Klepni pro celou obrazovku", "Tap for full screen"]))}">` : ""}${controlsHtml(p.controls)}
    <div class="row" style="margin-top:10px"><button class="btn small" id="vclose">${esc(L(["Zavřít", "Close"]))}</button></div></div></div>`;
  $("#vclose").onclick = () => { RAID.panel = null; box.innerHTML = ""; };
  const mp = box.querySelector(".vmapa-nahled");
  if (mp) mp.onclick = () => { const o = document.createElement("div"); o.className = "vmapa-cela"; o.innerHTML = `<img src="${p.image}" alt="">`; o.onclick = () => o.remove(); document.body.appendChild(o); };
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
const FIMG = (name, ic) => `<span class="fimg"><img src="${IMG_BASE}statek/${name}.webp" alt="" loading="lazy" data-pryc-pri-chybe><i>${ic}</i></span>`;
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
  const jeAdmin = !(document.querySelector('.tabs [data-tab="admin"]') || {}).hidden;   // r27-11: na mobilu je Admin tady (ne ve spodním menu)
  view.replaceChildren(h(`${jeAdmin ? `<p class="more-admin"><button class="btn primary" data-go-admin>⚙ ${esc(L(["Správa hry (admin)", "Game admin"]))}</button></p>` : ""}<div class="grid g2 ostatni-mrizka" style="align-items:start">
    <div class="panel nastaveni-panel"><h3>${esc(t("settings"))}</h3>
      <div class="nast-skup"><span class="nast-hl">${esc(L(["Zobrazení", "Layout"]))}</span>
        <div class="nast-seg tri">${[["auto", ["Automaticky", "Automatic"]], ["pc", ["Počítač", "Computer"]], ["tel", ["Telefon", "Phone"]]].map(([k, n]) =>
          `<button class="${ZOBR.pref === k ? "on" : ""}" data-zobr="${k}">${esc(L(n))}</button>`).join("")}</div></div>
      <div class="nast-skup"><span class="nast-hl">${esc(t("language"))}</span>
        <div class="nast-seg ctyri">${[["cs", "Čeština"], ["en", "English"], ["sk", "Slovenčina"], ["pl", "Polski"]].map(([k, n]) =>
          `<button class="${S.lang === k ? "on" : ""}" data-l="${k}">${n}</button>`).join("")}</div></div>
      <div class="nast-skup"><span class="nast-hl">${esc(L(["Účet", "Account"]))}</span>
        <div class="nast-ucet"><button class="btn" id="out">${esc(t("logout"))}</button>
          <button class="btn" id="out-vse" title="${esc(L(["Ztratil jsi telefon? Odhlásí web i aplikaci na všech zařízeních.", "Lost a phone? Signs out every device."]))}">${esc(L(["Odhlásit všechna zařízení", "Sign out everywhere"]))}</button></div>
        <details class="nast-smazat"><summary>${esc(L(["Smazat účet a postavu…", "Delete account…"]))}</summary>
          <p class="muted small">${esc(t("delete_help"))}</p>
          <div class="row"><input class="search" id="del" placeholder="SMAZAT" autocomplete="off" style="max-width:180px">
            <button class="btn danger" id="delbtn">${esc(t("delete"))}</button></div></details></div>
    </div>
    ${plochaMobil() ? `<div class="panel plocha-panel"><h3>${esc(L(["Zástupce na ploše", "Home screen shortcut"]))}</h3>
      <button class="plocha-tl" id="plocha-tl"${plochaMa() ? " disabled" : ""}><img src="ikona-192.png" alt="">
        <span><b>${esc(plochaMa() ? L(["Zástupce už na ploše máš", "Shortcut already added"]) : L(["Přidat Královské stezky na plochu", "Add Royal Trails to home screen"]))}</b>
        <small>${esc(L(["Ikona s pečetí hru spustí přímo, bez hledání odkazu.", "The seal icon starts the game directly."]))}</small></span></button>
      <p class="plocha-zamek"><svg class="zamek-ik" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg> ${esc(L(["Jen zástupce této stránky. Přihlášení zůstává v tomto zařízení.", "Just a shortcut to this page. Your login stays on this device."]))}</p></div>` : ""}
    <div class="panel"><h3>🔊 ${esc(t("sound"))}</h3>
      <label class="row"><input type="checkbox" id="snd-on"${Zvuk.V.on ? " checked" : ""}> ${esc(t("sound_on"))}</label>
      ${[["master", "sound_master"], ["mus", "sound_mus"], ["amb", "sound_amb"], ["sfx", "sound_sfx"]].map(([k, l]) =>
        `<div class="row slider"><span class="muted">${esc(t(l))}</span><input type="range" min="0" max="1" step="0.05" value="${Zvuk.V[k]}" data-vol="${k}" aria-label="${esc(t(l))}">
        ${k === "master" ? "<span></span>" : `<button class="chip${Zvuk.V["off_" + k] ? "" : " on"}" data-mute="${k}">${esc(t(Zvuk.V["off_" + k] ? "sound_off" : "sound_on_short"))}</button>`}</div>`).join("")}
      <p class="dim small">${esc(t("sound_note"))} ${esc(t("music_credit"))}</p>
    </div>
    ${S.me.has_character ? `<div class="panel smazat-postavu"><h3>${esc(L(["Smazat postavu", "Delete character"]))}</h3>
      <p class="muted small">${esc(L(["Postava odejde na hřbitov a nelze ji obnovit (i na Discordu). Pak si můžeš založit novou.", "The character goes to the graveyard for good. You can then create a new one."]))}</p>
      <button class="btn danger" id="smaz-post">${esc(L(["Smazat postavu…", "Delete character…"]))}</button></div>` : ""}
    <div class="panel prirucka-odkaz"><h3>${esc(L(["Příručka hráče", "Player's handbook"]))}</h3>
      <p>${esc(L(["Jak co funguje: původy, vlastnosti, boj, výbava, výpravy, domov, peníze, dovednosti, družina i knihy.", "How everything works."]))}</p>
      <button class="btn primary" data-go="prirucka">${esc(L(["Otevřít příručku", "Open the handbook"]))}</button></div>
    <div class="panel"><h3>${esc(t("about"))}</h3><p>${esc(t("about_text"))}</p>
      <p class="o-projektu-pozn">${esc(L(["Libri Civitatis a Královské stezky jsou nezávislý fanouškovský projekt. Nejsou oficiálně spojeny s Warhorse Studios, PLAION / Deep Silver, týmem KCDS ani se společností Discord a nemají s nimi partnerský ani sponzorský vztah. Hraní je zdarma. Případné příspěvky jsou dobrovolné dary na provoz projektu — dárce za ně nezískává přístup, obsah ani žádné herní výhody.",
        "Libri Civitatis and Royal Trails are an independent fan project, not affiliated with, endorsed or sponsored by Warhorse Studios, PLAION / Deep Silver, the KCDS team or Discord. Playing is free. Any contributions are voluntary donations towards running the project and grant no access, content or in-game advantage."]))}</p>
      <div class="autor"><small>${esc(L(["Autor projektu", "Created by"]))}</small><b>Algheir</b></div>
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
  { const ab = view.querySelector("[data-go-admin]"); if (ab) ab.onclick = () => go("admin"); }
  view.querySelectorAll("[data-zobr]").forEach((b) => b.onclick = () => { ZOBR.pref = b.dataset.zobr; store.set("zobrazeni", ZOBR.pref); nastavZobrazeni(); render(); });
  { const pt = $("#plocha-tl"); if (pt) pt.onclick = () => nabidniPlochu(); }   // r27-12: zástupce s logem jedním klepnutím
  $("#out-vse").onclick = () => { if (confirm(L(["Odhlásit web i aplikaci na všech zařízeních? Přihlásíš se znovu kódem z /aplikace.", "Sign out on all devices?"])))
    call("logout_all").then(() => logout(true)).catch(() => {}); };
  const sp = $("#smaz-post");   // r27-6: smazat postavu — ano/ne, pak nabídka nové postavy
  if (sp) sp.onclick = async () => {
    if (!confirm(L([`Opravdu smazat postavu ${S.me.name}? Odejde na hřbitov a nelze ji obnovit.`, `Really delete ${S.me.name}?`]))) return;
    const jm = prompt(L(["Pro potvrzení napiš jméno své postavy:", "Type your character's name to confirm:"]), "");
    if (jm === null) return;
    try {
      const r = await call("smazat_postavu", { jmeno: jm });
      setMe(r.me); toast(L(["Postava odešla na hřbitov.", "Your character rests in the graveyard."]));
      ZAL.info = null; ZAL.krok = 0;
      go("novy");                                          // rovnou do tvorby nové postavy
    } catch { /* chyba v toastu */ }
  };
  $("#delbtn").onclick = () => {
    const v = $("#del").value.trim();
    if (v !== "SMAZAT") { toast(t("delete_help"), true); return; }
    call("delete_account", { confirm: v }).then(() => { toast(t("delete_ok")); logout(); }).catch(() => {});
  };
};

// ------------------------------------------------------------------ start
applyTexts();
// r27-5: bezpečnost — z odkazu (adresy) se jen otevře stránka; „panel/=…“ by rovnou zmáčklo tlačítko ve hře, to z odkazu nejde
if (location.hash.length > 1) { const z = decodeURIComponent(location.hash.slice(1)); if (!z.startsWith("panel/=")) store.set("tab", z); else history.replaceState(null, "", location.pathname + location.search); }
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

// ===================================================================== r27-6: minihry na webu
// Páčení zámků, rybaření a lov — kreslené a animované. Stav posílá server (op "mini"), akce jdou stejnými tlačítky jako na Discordu,
// takže pravidla i výsledky jsou všude stejné; web jen nemusí čekat na tlačítka a zprávy.
const MINI = { st: null, kind: null, ctx: null, el: null, poll: 0, busy: false, sel: 5, inAct: false, prev: null, last: 0 };
const MINI_ANIMAL = { "Zajíc": "zajic", "Liška": "liska", "Srnec": "srnec", "Divočák": "divocak", "Jelen": "jelen", "Vlk": "vlk" };
const FEEL_TXT = { hot: ["horko — hned vedle", "hot — right next to it"], warm: ["teplo — blízko (2–3)", "warm — close (2–3)"], cold: ["zima — daleko (4+)", "cold — far (4+)"] };

function miniKind(mini, panel) {
  if (mini && mini.lock) return "lock";
  if (mini && mini.fish) return "fish";
  if (mini && mini.hunt) return "hunt";
  const ids = ((panel && panel.controls) || []).map((c) => c.id || "");
  if (ids.some((x) => x.startsWith("ks:fish:cast:"))) return "fishpre";
  return null;
}

/** Zavolá se s každou odpovědí serveru: otevře, obnoví nebo ukončí minihru. */
function miniSync(mini, panel, ctx) {
  if (MINI.inAct) return;
  const kind = miniKind(mini, panel);
  if (!kind) {
    if (MINI.el && MINI.kind && MINI.kind !== "vysledek") miniVysledek(panel);
    return;
  }
  MINI.ctx = ctx || MINI.ctx || "raid";
  MINI.prev = MINI.st; MINI.st = mini || {}; MINI.panel = panel;
  if (MINI.kind !== kind) MINI.sel = 5;
  MINI.kind = kind;
  miniOtevri();
  miniKresli();
}

function miniOtevri() {
  if (MINI.el && document.body.contains(MINI.el)) return;
  MINI.el = document.createElement("div");
  MINI.el.className = "minihra";
  MINI.el.setAttribute("role", "dialog");
  document.body.append(MINI.el);
  document.addEventListener("keydown", miniKlavesa);
  document.body.classList.add("mh-otevreno");
}

function miniZavri() {
  clearTimeout(MINI.poll); MINI.poll = 0;
  if (MINI.el) MINI.el.remove();
  MINI.el = null; MINI.kind = null; MINI.st = null; MINI.prev = null;
  document.removeEventListener("keydown", miniKlavesa);
  document.body.classList.remove("mh-otevreno");
  if (MINI.ctx === "raid" && S.tab === "vyprava") { RAID.panel = (RAID.panel && (RAID.panel.controls || []).length) ? RAID.panel : null; drawRaid($("#view")); }
}

const miniBg = (n) => `<div class="mh-bg" style="background-image:url('${IMG_BASE}mini/${n}.webp')"></div>`;

async function miniAct(cid, el) {
  if (MINI.busy) return;
  MINI.busy = true; if (el) el.disabled = true;
  MINI.inAct = true;
  let r = null;
  try {
    r = await call("raid_click", { id: cid, values: [] });
  } catch { MINI.inAct = false; MINI.busy = false; if (el) el.disabled = false; miniObnov(); return; }
  try {
    if (MINI.ctx === "raid") {
      const before = RAID.st;
      RAID.st = { ...r, panel: undefined };
      RAID.panel = r.panel && (r.panel.content || (r.panel.controls || []).length) ? r.panel : null;
      if (S.tab === "vyprava") { animateDiff(before, RAID.st); drawRaid($("#view")); }
    } else if ($("#dpanel")) showPanelResult(r, MINI.ctx);
  } finally { MINI.inAct = false; MINI.busy = false; }
  miniSync(r.mini, r.panel, MINI.ctx);
}

async function miniObnov() {
  try { const r = await call("mini", {}, true); miniSync(r.mini, null, MINI.ctx); } catch { /* další pokus při dalším tiku */ }
}

/** Rybaření a lov běží v reálném čase — stav se dotazuje rychle, dokud se čeká na záběr nebo na výstřel. */
function miniHlidej(ms = 220) {
  clearTimeout(MINI.poll);
  MINI.poll = setTimeout(async () => {
    if (!MINI.el) return;
    try {
      const r = await call("mini", {}, true);
      if (!miniKind(r.mini)) { miniVysledek(null, MINI.kind === "fish" ? "pozde-ryba" : "pozde-lov"); return; }
      miniSync(r.mini, null, MINI.ctx);
    } catch { miniHlidej(600); }
  }, ms);
}

function miniKlavesa(e) {
  if (!MINI.el || e.target.closest("input,textarea,select")) return;
  const k = e.key;
  if (MINI.kind === "lock") {
    const L_ = MINI.st.lock; if (!L_) return;
    if (k === "ArrowUp" || k === "ArrowRight") { MINI.sel = Math.min(9, MINI.sel + 1); miniKresli(); e.preventDefault(); }
    else if (k === "ArrowDown" || k === "ArrowLeft") { MINI.sel = Math.max(1, MINI.sel - 1); miniKresli(); e.preventDefault(); }
    else if (/^[1-9]$/.test(k)) { MINI.sel = +k; miniKresli(); }
    else if (k === "Enter" || k === " ") { e.preventDefault(); miniZkus(MINI.sel); }
  } else if (MINI.kind === "fish") {
    const f = MINI.st.fish;
    if (f.stage === "wait" && (k === " " || k === "Enter")) { e.preventDefault(); miniAct("ks:fish:hook"); }
    if (f.stage === "fight" && /^[1-3]$/.test(k)) miniAct(f.actions[+k - 1].cid);
  } else if (MINI.kind === "hunt") {
    const a = MINI.st.hunt;
    if (a.stage === "aim" && (k === " " || k === "Enter")) { e.preventDefault(); miniStrel(); }
    const list = a.stage === "approach" ? a.paths : a.stage === "freeze" ? a.opts : null;
    if (list && /^[1-3]$/.test(k) && list[+k - 1]) miniAct(list[+k - 1].cid);
  }
  if (k === "Escape" && MINI.kind === "vysledek") miniZavri();
}

function miniKresli() {
  if (!MINI.el) return;
  const k = MINI.kind;
  if (k === "lock") miniZamek();
  else if (k === "fish") miniRyba();
  else if (k === "fishpre") miniNavnada();
  else if (k === "hunt") miniLov();
}

// ---------------------------------------------------------------- páčení zámku
function miniZkus(n) {
  const L_ = MINI.st.lock; if (!L_ || MINI.busy) return;
  if (!L_.cands.includes(n) && (L_.tries.length || L_.hint)) { toast(L(["Tahle poloha už nedává smysl.", "That position makes no sense any more."])); return; }
  if (L_.tries.some((t) => t.g === n)) return;
  MINI.sel = n;
  const pick = MINI.el.querySelector(".zk-sperhak"); if (pick) { pick.classList.remove("tlak"); void pick.offsetWidth; pick.classList.add("tlak"); }
  Zvuk.sfx("klik");
  setTimeout(() => miniAct(L_.prefix + n), 260);
}

function miniZamek() {
  const Z = MINI.st.lock, P = MINI.prev && MINI.prev.lock;
  const idx = Z.done.length;
  const novyKolik = P && Z.done.length > P.done.length;
  const chyba = P && Z.tries.length > (P.tries.length || 0) && !novyKolik;
  const zlomil = Z.broke && P && !P.broke;
  const tried = Object.fromEntries(Z.tries.map((t) => [t.g, t.f]));
  const filtr = Z.tries.length || Z.hint;
  if (!Z.cands.includes(MINI.sel) && Z.cands.length && filtr) MINI.sel = Z.cands[Math.floor(Z.cands.length / 2)];
  if (tried[MINI.sel]) MINI.sel = Z.cands[0] || MINI.sel;
  const sloupec = (i) => {
    if (i < idx) return `<div class="zk-kolik hotovo" style="--v:${Z.done[i]}"><div class="zk-sachta"><i class="zk-tyc"></i></div><b>${Z.done[i]}</b></div>`;
    if (i > idx) return `<div class="zk-kolik ceka"><div class="zk-sachta"><i class="zk-tyc"></i></div><b>?</b></div>`;
    const zuby = [9, 8, 7, 6, 5, 4, 3, 2, 1].map((n) => {
      const f = tried[n];
      const ne = !f && filtr && !Z.cands.includes(n);
      const hint = Z.hint && n >= Z.hint[0] && n <= Z.hint[1];
      return `<button class="zk-zub${f ? " " + f : ""}${ne ? " ne" : ""}${hint ? " tip" : ""}${n === MINI.sel ? " vyb" : ""}" data-n="${n}"${f || ne ? " disabled" : ""}
        title="${f ? esc(L(FEEL_TXT[f])) : ""}"><span>${n}</span>${f ? `<em>${f === "hot" ? "🔥" : f === "warm" ? "🌡️" : "❄️"}</em>` : ""}</button>`;
    }).join("");
    return `<div class="zk-kolik ted${chyba ? " trhl" : ""}"><div class="zk-sachta zk-stupnice">${zuby}
      <i class="zk-sperhak${zlomil ? " zlom" : ""}" style="--v:${MINI.sel}"></i></div><b>${esc(L(["páčíš", "picking"]))}</b></div>`;
  };
  const posl = Z.last === "hit" ? `<p class="zk-zprava ok">✅ ${esc(L([`Cvak! Kolík ${idx} zapadl.`, `Click! Pin ${idx} set.`]))}</p>`
    : Z.last ? `<p class="zk-zprava ${Z.last}">${Z.last === "hot" ? "🔥" : Z.last === "warm" ? "🌡️" : "❄️"} ${esc(L(FEEL_TXT[Z.last]))}</p>` : `<p class="zk-zprava">${esc(L(["Vyber polohu a zatlač šperhákem.", "Pick a position and press."]))}</p>`;
  MINI.el.innerHTML = `<div class="mh mh-zamek${novyKolik ? " cvak" : ""}">${miniBg(Z.src === "burgle" ? "vloupani" : "zamek")}
    <header class="mh-hlava"><h2>${esc(Z.src === "burgle" ? L(["Cizí truhla", "Someone's chest"]) : L(["Zamčená truhla", "Locked chest"]))}</h2>
      <div class="mh-cisla"><span title="${esc(L(["Pokusy", "Tries"]))}">🎯 ${Z.left}</span><span title="${esc(L(["Šperháky", "Lockpicks"]))}">🗝️ ${Z.picks}</span></div></header>
    <div class="zk-zamek">${Array.from({ length: Z.pins }, (_, i) => sloupec(i)).join("")}</div>
    ${posl}${zlomil ? `<p class="zk-zprava zlom">💥 ${esc(L(["Šperhák praskl!", "The lockpick snapped!"]))}</p>` : ""}
    ${Z.hint ? `<p class="mh-pozn">👁️ ${esc(L([`Všímavost: kolík je mezi ${Z.hint[0]} a ${Z.hint[1]}.`, `Perception: the pin is between ${Z.hint[0]} and ${Z.hint[1]}.`]))}</p>` : ""}
    <div class="mh-ovl"><button class="btn primary big" data-zkus>${esc(L([`Zatlačit na ${MINI.sel}`, `Press at ${MINI.sel}`]))}</button>
      <button class="btn" data-pryc>${esc(Z.src === "burgle" ? L(["Utéct", "Run"]) : L(["Nechat truhlu být", "Leave the chest"]))}</button></div>
    <p class="mh-leg">${esc(L(["Šipky nebo čísla 1–9 vybírají, Enter zatlačí. 🔥 hned vedle · 🌡️ blízko · ❄️ daleko · zašedlé už nedává smysl.",
      "Arrows or 1–9 choose, Enter presses. 🔥 next to it · 🌡️ close · ❄️ far · greyed out makes no sense."]))}${Z.src === "burgle" ? " " + esc(L(["Každá chyba dělá hluk.", "Every miss makes noise."])) : ""}</p></div>`;
  MINI.el.querySelectorAll(".zk-zub").forEach((b) => {
    b.onmouseenter = () => { if (!b.disabled) { MINI.sel = +b.dataset.n; const p = MINI.el.querySelector(".zk-sperhak"); if (p) p.style.setProperty("--v", MINI.sel);
      const z = MINI.el.querySelector("[data-zkus]"); if (z) z.textContent = L([`Zatlačit na ${MINI.sel}`, `Press at ${MINI.sel}`]); } };
    b.onclick = () => miniZkus(+b.dataset.n);
  });
  MINI.el.querySelector("[data-zkus]").onclick = () => miniZkus(MINI.sel);
  MINI.el.querySelector("[data-pryc]").onclick = (e) => miniAct(Z.give, e.target);
  if (novyKolik) Zvuk.sfx("kovadlina"); else if (chyba) Zvuk.sfx("odrazeno");
}

// ---------------------------------------------------------------- rybaření
function miniNavnada() {
  const c = (MINI.panel.controls || []).filter((x) => x.id.startsWith("ks:fish:cast:"));
  MINI.el.innerHTML = `<div class="mh mh-ryba">${miniBg("rybnik")}<div class="ry-voda"><i class="ry-kruh"></i><i class="ry-kruh d2"></i></div>
    <header class="mh-hlava"><h2>${esc(L(["Rybaření", "Fishing"]))}</h2></header>
    <p class="mh-text">${esc(L(["Vyber návnadu a nahoď. Lepší návnada láká větší ryby.", "Choose bait and cast. Better bait draws bigger fish."]))}</p>
    <div class="mh-volby">${c.map((x) => `<button class="mh-volba" data-cid="${esc(x.id)}"><span class="ic">🪱</span><b>${esc(noEmoji(x.label).replace(/^Nahodit:\s*/, ""))}</b><small>${esc(L(["nahodit", "cast"]))}</small></button>`).join("")
      || `<p class="mh-text">${esc(L(["Nemáš návnadu nebo tu už nejde nahodit.", "No bait, or no more casts here."]))}</p>`}</div>
    <div class="mh-ovl"><button class="btn" data-konec>${esc(L(["Zpět", "Back"]))}</button></div></div>`;
  MINI.el.querySelectorAll("[data-cid]").forEach((b) => b.onclick = () => { Zvuk.sfx("voda"); miniAct(b.dataset.cid, b); });
  MINI.el.querySelector("[data-konec]").onclick = () => { if (MINI.ctx === "raid") RAID.panel = null; miniZavri(); };
}

function miniRyba() {
  const f = MINI.st.fish, P = MINI.prev && MINI.prev.fish;
  if (f.stage === "wait") {
    const zaber = !!f.bite;
    if (zaber && !(P && P.bite)) { Zvuk.sfx("voda"); if (navigator.vibrate) navigator.vibrate(120); }
    // r27-22: při čekání se okno nepřekresluje celé (obraz blikal) — jen se přepne záběr
    const ted = MINI.el.querySelector(".mh-ryba:not(.boj)");
    if (ted && ted.dataset.zaber === String(zaber)) { miniHlidej(zaber ? 300 : 200); return; }
    MINI.el.innerHTML = `<div class="mh mh-ryba${zaber ? " zaber" : ""}" data-zaber="${zaber}">${miniBg("rybnik")}
      <div class="ry-voda" data-hook><i class="ry-kruh"></i><i class="ry-kruh d2"></i>${zaber ? `<i class="ry-strik"></i><i class="ry-strik s2"></i>` : ""}
        <i class="ry-vlasec"></i><i class="ry-splavek"></i></div>
      <header class="mh-hlava"><h2>${esc(zaber ? L(["ZÁBĚR!", "A BITE!"]) : L(["Čekáš na záběr…", "Waiting for a bite…"]))}</h2>
        <div class="mh-cisla"><span>🪱 ${esc(f.bait)}</span></div></header>
      <p class="mh-text">${esc(zaber ? L(["Splávek je pod vodou — zasekni!", "The float went under — strike!"]) : L(["Sleduj splávek. Až se ponoří, hned zasekni. Moc brzy ryby vyplaší.", "Watch the float. Strike the moment it dips — too early scares the fish."]))}</p>
      <div class="mh-ovl"><button class="btn big ${zaber ? "danger pulz" : ""}" data-hook>${esc(zaber ? L(["ZASEKNOUT!", "STRIKE!"]) : L(["Zaseknout", "Strike"]))}</button></div>
      <p class="mh-leg">${esc(L(["Mezerník nebo klik na vodu = zaseknout.", "Space or click the water = strike."]))}</p></div>`;
    MINI.el.querySelectorAll("[data-hook]").forEach((b) => b.onclick = (e) => { e.stopPropagation(); Zvuk.sfx("voda"); miniAct("ks:fish:hook"); });
    miniHlidej(zaber ? 300 : 200);
    return;
  }
  clearTimeout(MINI.poll);
  const pohyb = ["utika", "skok", "unava", "dno", "koreny", "kmne"][f.move] || "utika";
  const chyba = P && P.stage === "fight" && f.slack > P.slack, dobre = P && P.stage === "fight" && f.round > P.round && !chyba;
  const napeti = Array.from({ length: f.allowed + 1 }, (_, i) => `<i class="${i < f.slack ? "plne" : ""}"></i>`).join("");
  const ikona = { povolit: "↶", pritahnout: "⇡", drzet: "✊" };
  MINI.el.innerHTML = `<div class="mh mh-ryba boj${chyba ? " trhl" : ""}">${miniBg("rybnik")}
    <div class="ry-voda"><i class="ry-vlasec napnuty ${pohyb}"></i><i class="ry-ryba ${pohyb}"></i><i class="ry-kruh"></i>${pohyb === "skok" ? `<i class="ry-strik"></i>` : ""}</div>
    <header class="mh-hlava"><h2>${esc(L([`Zdolávání ${f.round + 1}/${f.rounds}`, `Reeling ${f.round + 1}/${f.rounds}`]))}</h2>
      <div class="mh-cisla"><span class="ry-napeti" title="${esc(L(["Napětí vlasce", "Line tension"]))}">${napeti}</span></div></header>
    ${chyba ? `<p class="zk-zprava cold">⚠️ ${esc(L(["Vlasec se napnul k prasknutí!", "The line nearly snapped!"]))}</p>` : dobre ? `<p class="zk-zprava ok">✅ ${esc(L(["Správně!", "Right!"]))}</p>` : ""}
    <p class="mh-text velky">${esc(f.text)}</p>
    ${f.hint ? `<p class="mh-pozn">🧠 ${esc(L(["Rybářský cit: ", "Angler's feel: "]) + f.hint)}</p>` : ""}
    <div class="mh-volby tri">${f.actions.map((a, i) => `<button class="mh-volba" data-cid="${esc(a.cid)}"><span class="ic">${ikona[a.k]}</span><b>${esc(a.n)}</b><small>${i + 1}</small></button>`).join("")}</div>
    <p class="mh-leg">${esc(L(["Utíká nebo skáče → povol. Je unavená nebo u dna → přitáhni. Míří ke kořenům nebo k tobě → drž.", "Runs or jumps → let out. Tired or deep → reel in. Heads for roots or to you → hold."]))}</p></div>`;
  MINI.el.querySelectorAll("[data-cid]").forEach((b) => b.onclick = () => miniAct(b.dataset.cid, b));
  if (chyba) Zvuk.sfx("odrazeno");
}

// ---------------------------------------------------------------- lov
function miniStrel() {
  const sc = MINI.el && MINI.el.querySelector(".lv-scena");
  if (sc) sc.classList.add("vystrel");
  Zvuk.sfx("zasah");
  setTimeout(() => miniAct("ks:hunt:shoot"), 180);
}

function miniLov() {
  const a = MINI.st.hunt, P = MINI.prev && MINI.prev.hunt;
  const img = `${IMG_BASE}bytosti/lov-${MINI_ANIMAL[a.animal] || "srnec"}.webp`;
  const vitr = { "od severu": 180, "od jihu": 0, "od východu": 270, "od západu": 90 }[a.wind] ?? 0;
  const stav = a.stage === "aim" ? (a.side ? "bokem" : "zady") : a.stage === "freeze" ? "vetri" : "pase";
  let dole = "";
  if (a.stage === "approach") {
    dole = `<p class="mh-text">${esc(L(["Kudy se připlížíš? Jdi proti větru a potichu.", "Which way do you sneak? Upwind and quietly."]))}</p>
      <div class="mh-volby tri">${a.paths.map((p, i) => {
        const zada = /zad/.test(p.text), listi = /list/.test(p.text);
        return `<button class="mh-volba cesta" data-cid="${esc(p.cid)}"><span class="ic">${listi ? "🍂" : "🌿"}</span><b>${esc(L(["Cesta ", "Path "]) + "ABC"[i])}</b>
          <small>${esc(p.text)}</small><em class="vitr-sip${zada ? " zada" : ""}">${zada ? "⇢ " + L(["vítr do zad", "wind at back"]) : "⇠ " + L(["vítr do tváře", "wind in face"])}</em></button>`;
      }).join("")}</div>`;
  } else if (a.stage === "freeze") {
    const ic = (n) => /Ztuhnout/.test(n) ? "🧍" : /přikrčit/.test(n) ? "⬇️" : "➡️";
    dole = `<p class="mh-text velky">${esc(L(["Zvíře zvedlo hlavu a větří!", "The animal raised its head!"]))}</p>
      <div class="mh-volby tri">${a.opts.map((o, i) => `<button class="mh-volba" data-cid="${esc(o.cid)}"><span class="ic">${ic(o.n)}</span><b>${esc(noEmoji(o.n))}</b><small>${i + 1}</small></button>`).join("")}</div>`;
  } else {
    dole = `<p class="mh-text velky">${esc(a.side ? L(["Stojí bokem — STŘÍLEJ!", "Broadside — SHOOT!"]) : L(["Míříš… čekej, až se natočí bokem.", "Aiming… wait for it to turn broadside."]))}</p>
      <div class="mh-ovl"><button class="btn big ${a.side ? "danger pulz" : ""}" data-strel>${esc(L(["Vystřelit", "Shoot"]))}</button></div>
      <p class="mh-leg">${esc(L(["Mezerník nebo klik na zvíře = výstřel. Moc brzy zvíře vyplaší.", "Space or click the animal = shoot. Too early scares it."]))}</p>`;
  }
  if (a.stage === "aim" && a.side && !(P && P.side)) { if (navigator.vibrate) navigator.vibrate(80); }
  { const ted = MINI.el.querySelector(".mh-lov");   // r27-22: při míření se nepřekresluje celé okno (blikalo) — jen když se změní stav
    const klic = [a.stage, a.side ? 1 : 0, a.animal, a.alert || 0].join("|");
    if (ted && ted.dataset.klic === klic) { if (a.stage === "aim") miniHlidej(a.side ? 300 : 200); return; } }
  MINI.el.innerHTML = `<div class="mh mh-lov" data-klic="${esc([a.stage, a.side ? 1 : 0, a.animal, a.alert || 0].join("|"))}">${miniBg("lov")}
    <div class="lv-scena ${a.stage}"><img class="lv-zvire ${stav}" src="${img}" alt="">${a.stage === "freeze" ? `<i class="lv-pozor">!</i>` : ""}
      ${a.stage === "aim" ? `<i class="lv-zamer${a.side ? " cerveny" : ""}"></i>` : ""}<i class="lv-listi"></i></div>
    <header class="mh-hlava"><h2>${esc(L(["Lov", "Hunt"]) + " · " + a.animal)}</h2>
      <div class="mh-cisla"><span class="lv-vitr" title="${esc(L(["Vítr ", "Wind "]) + a.wind)}"><i style="--r:${vitr}deg">➤</i> ${esc(a.wind || "")}</span>
      ${a.alert ? `<span title="${esc(L(["Zvíře je ostražité", "The animal is wary"]))}">👂 ${a.alert}</span>` : ""}</div></header>
    ${dole}</div>`;
  MINI.el.querySelectorAll("[data-cid]").forEach((b) => b.onclick = () => miniAct(b.dataset.cid, b));
  const s = MINI.el.querySelector("[data-strel]"); if (s) s.onclick = miniStrel;
  const z = MINI.el.querySelector(".lv-scena.aim"); if (z) z.onclick = miniStrel;
  if (a.stage === "aim") miniHlidej(a.side ? 300 : 200); else clearTimeout(MINI.poll);
}

// ---------------------------------------------------------------- výsledek
function miniVysledek(panel, kod) {
  clearTimeout(MINI.poll);
  const byl = MINI.kind;
  MINI.kind = "vysledek";
  let nadpis = "", text = "", dobre = false;
  if (panel && panel.content) {
    const m = /^#{1,3}\s+(.+)$/m.exec(panel.content);
    nadpis = m ? noEmoji(m[1].replace(/\*\*/g, "")).trim() : "";
    text = panel.content.replace(/^#{1,3}\s+.+$/m, "").trim();
    dobre = /Úlovek|zásah|otevřel|povolilo|Kořist|Vytáhl/i.test(panel.content);
  } else if (kod === "pozde-ryba") { nadpis = L(["Pozdě!", "Too late!"]); text = L(["Ryba stáhla návnadu z háčku a zmizela.", "The fish stole the bait and vanished."]); }
  else if (kod === "pozde-lov") { nadpis = L(["Pozdě", "Too late"]); text = L(["Zaváhal jsi — zvíře poodešlo do houští.", "You hesitated — the animal slipped into the thicket."]); }
  else { miniZavri(); return; }
  const dalsi = ((panel && panel.controls) || []).filter((c) => c.t !== "select" && /^ks:(fish|hunt|mission:.*:(skin|loot))/.test(c.id));
  const bg = byl === "lock" ? ((MINI.st && MINI.st.lock && MINI.st.lock.src === "burgle") ? "vloupani" : "zamek") : byl === "hunt" ? "lov" : "rybnik";
  MINI.el.innerHTML = `<div class="mh mh-vysledek ${dobre ? "dobre" : "zle"}">${miniBg(bg)}
    <div class="mh-karta"><h2>${esc(nadpis)}</h2><div class="mh-text">${dmd(text)}</div>
    <div class="mh-ovl">${dalsi.map((c) => `<button class="btn primary" data-cid="${esc(c.id)}">${esc(noEmoji(c.label))}</button>`).join("")}
      <button class="btn" data-konec>${esc(L(["Pokračovat", "Continue"]))}</button></div></div>
    ${dobre ? `<div class="mh-jiskry">${"<i></i>".repeat(14)}</div>` : ""}</div>`;
  Zvuk.sfx(dobre ? "vyhra" : "odrazeno");
  MINI.el.querySelectorAll("[data-cid]").forEach((b) => b.onclick = () => { MINI.kind = null; miniAct(b.dataset.cid, b); });
  MINI.el.querySelector("[data-konec]").onclick = () => { if (MINI.ctx === "raid") RAID.panel = null; miniZavri(); };
  if (MINI.ctx === "raid" && MINI.st && byl !== "fishpre") { /* stav výpravy se obnovil v miniAct */ }
}
