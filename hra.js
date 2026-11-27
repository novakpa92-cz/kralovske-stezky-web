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
  login_2: ["V kanálu <b>úvod</b> klikni na tlačítko <b>🔑 Aktivační kód</b>.", "In the <b>úvod</b> channel click the <b>🔑 Activation code</b> button."],
  login_3: ["Bot ti odpoví zprávou, kterou <b>vidíš jen ty</b>. Je v ní kód ze 6 znaků, třeba <b>ABC123</b>. Opiš ho sem dolů. Platí 10 minut.", "The bot replies with a message <b>only you can see</b> containing a 6-character code like <b>ABC123</b>. Enter it below. Valid 10 minutes."],
  home_icon: ["Přidat ikonu hry na plochu", "Add the game icon to your home screen"],
  home_safe_login: ["Ikona jen otevře tuto stránku, nic se neinstaluje. Kód platí 10 minut a jen jednou — nikomu ho nedávej.", "The icon only opens this page, nothing gets installed. The code works once, for 10 minutes — never share it."],
  login_note: ["Postava patří k tvému Discord účtu. Kód dostaneš v kanálu úvod tlačítkem 🔑 Aktivační kód.",
    "Your character belongs to your Discord account. Get the code in the úvod channel with the 🔑 button."],
  code: ["Kód z Discordu", "Code from Discord"],
  login: ["Přihlásit", "Log in"],
  connecting: ["Připojuji…", "Connecting…"],
  net_error: ["Nepodařilo se spojit se serverem hry. Zkus to za chvíli.", "Could not reach the game server. Try again shortly."],
  bad_reply: ["Server odpověděl nesrozumitelně.", "The server sent an unreadable reply."],
  nav_hero: ["Postava", "Hero"], nav_bag: ["Výbava", "Gear"], nav_pet: ["Mazlíček", "Companion"], nav_admin: ["Admin", "Admin"], nav_denik: ["Deník", "Journal"], nav_market: ["Trh", "Market"],
  nav_inn: ["Hostinec", "Inn"], nav_more: ["Ostatní", "More"],
  coins: ["{0} gr.", "{0} gr."], level: ["Úr. {0}", "Lvl {0}"], level_long: ["Úroveň {0}", "Level {0}"],
  xp: ["Zkušenosti", "Experience"], health: ["Životy", "Health"], satiety: ["Hlad", "Hunger"],
  hydration: ["Žízeň", "Thirst"], rest: ["Odpočatost", "Rest"], needs: ["Stav postavy", "Condition"],
  attributes: ["Vlastnosti", "Attributes"],
  unspent: ["Volné body k přidělení: {0} — přiděl je v Postavě u Vlastností (tlačítko +).", "Unspent points: {0} — assign them under Attributes (+)."],
  combat: ["Boj", "Combat"], armor_class: ["Obrana (OČ)", "Armour class"], attack: ["Útok", "Attack"], damage: ["Zranění", "Damage"],
  origin: ["Původ", "Origin"], time: ["Herní čas", "Game time"], refresh: ["Obnovit", "Refresh"],
  no_char: ["Ještě nemáš postavu. Klikni na Obnovit a založ si ji.",
    "You don't have a character yet. Click Refresh and create one."],
  on_raid: ["Jsi na výpravě — obchod a hry v hostinci počkají, až se vrátíš. Pokračovat ve výpravě můžeš i tady: Město → Brána.", "You're on an expedition — shops and inn games will wait until you return. Continue it here: Town → Gate."],
  equipped: ["Vybaveno", "Equipped"], backpack: ["Batoh a kapsy · {0}", "Backpack & pockets · {0}"],
  empty: ["Nic tu není.", "Nothing here."], all: ["Vše", "All"], search: ["Hledat…", "Search…"],
  equip: ["Nasadit", "Equip"], unequip: ["Sundat", "Remove"], use: ["Použít", "Use"], sell: ["Prodat", "Sell"], buy: ["Koupit", "Buy"],
  sold: ["Prodáno za {0} gr.", "Sold for {0} gr."], bought: ["Koupeno za {0} gr.", "Bought for {0} gr."],
  sell_q: ["Prodat {0} za {1}?", "Sell {0} for {1}?"],
  sell_to: ["vykoupí {0}", "{0} buys it"],
  restock: ["Nové zboží za {0}", "New stock in {0}"], hm: ["{0} h {1} min", "{0} h {1} min"], m: ["{0} min", "{0} min"],
  stock_note: ["Nabídka se mění každý herní den.", "Stock changes every game day."],
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
  delete_help: ["Postava se trvale smaže. Pro potvrzení napiš SMAZAT.",
    "Your character will be permanently deleted. Type SMAZAT to confirm."],
  delete_ok: ["Účet je smazaný.", "Your account has been deleted."],
  privacy: ["Zásady ochrany soukromí", "Privacy policy"], about: ["O hře", "About"],
  about_text: ["Královské stezky jsou původní hra komunity Libri Civitatis z prostředí Kutnohorska 15. století. Hraje se v prohlížeči na počítači i v mobilu; na Discordu se potkáváme v hostinci a U krbu.",
    "Royal Trails is an original game by the Libri Civitatis community, set around Kutná Hora in the 15th century. Play in your browser on PC or mobile."],
  coming: ["Družinu založíš nebo se k ní přidáš u Brány.",
    "Found or join a party at the Town gate."],
  confirm: ["Potvrdit", "Confirm"], cancel: ["Zrušit", "Cancel"],
  nav_town: ["Město", "Town"], back_map: ["Zpět", "Back"], back: ["Zpět", "Back"],
  soon: ["Připravuje se.", "Coming soon."],
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
/** 1.0-1-14: časové značky z Discordu (<t:…:R>, <t:…:t>) → „za 12 min“ / „14:05“ (dřív se ukazovaly syrové). */
function dcCas(text) {
  return String(text ?? "").replace(/<t:(\d+)(?::(\w))?>/g, (m, ts, st) => {
    const ms = Number(ts) * 1000;
    if (st === "R") { const min = Math.round((ms - Date.now()) / 60000);
      return min > 0 ? L(["za ", "in "]) + (min >= 60 ? Math.floor(min / 60) + " h " + (min % 60) + " min" : min + " min") : min === 0 ? L(["teď", "now"]) : L(["před ", ""]) + (-min >= 60 ? Math.floor(-min / 60) + " h" : -min + " min") + L(["", " ago"]); }
    const d = new Date(ms);
    return st === "d" || st === "D" ? d.toLocaleDateString("cs-CZ") : d.toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit" });
  });
}
function md(text) {
  if (typeof obsahJazyk === "function") text = obsahJazyk(text);   // r27-5: obsah ze serveru slovensky / polsky
  text = dcCas(text);
  return esc(text).split("\n").map((line) => {
    let small = false;
    if (line.startsWith("-# ")) { small = true; line = line.slice(3); }
    line = line.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/__(.+?)__/g, "<u>$1</u>").replace(/(^|\s)\*(\S.*?)\*/g, "$1<i>$2</i>");
    return small ? `<span class="dim small">${line}</span>` : line;
  }).join("<br>");
}
const h = (html) => { const d = document.createElement("template"); d.innerHTML = html.trim(); return d.content; };
/** 1.0-1-14: výbava po kusech — řádek s konkrétním kusem (stupeň zušlechtění; 0 = obyčejný). Kliknutí v řádku si kus zapamatuje
 *  a další dotaz na server ho pošle („kus“), takže se prodá / uloží / vezme přesně ten. */
const kusAttr = (i) => i && i.kus != null ? ` data-kus="${esc(String(i.kus))}"${i.count ? ` data-q="${Number(i.count)}"` : ""}` : "";
/** Počet pro řádek bez posuvníku: u konkrétního kusu jen jeho počet (jinak by šel celý stoh). */
const kolikRadek = (b) => { const it = b.closest(".item"), r = it && it.querySelector("[data-kolik]"); return r ? +r.value : (it && it.dataset.q ? +it.dataset.q : null); };
const kusTag = (i) => i && i.kus != null ? (Number(i.enh) ? ` <span class="kus-st">+${Number(i.enh)}</span>`
    : (!i.color || i.color === "Přírodní") && !(i.wear < 100) ? ` <span class="kus-st obyc">${esc(L(["obyčejná", "plain"]))}</span>` : "")
  + (i.color && i.color !== "Přírodní" ? barvaStitek(i.color, i.hex || "") : "")
  + (i.wear != null && i.wear < 100 ? ` <span class="kus-st ${i.wear <= 0 ? "rozb" : "opotr"}">${esc(i.wear <= 0 ? L(["rozbitá", "broken"]) : i.wear + " %")}</span>` : "") : "";
const KUS = { pristi: null };
document.addEventListener("click", (e) => { const k = e.target && e.target.closest ? e.target.closest("[data-kus]") : null; KUS.pristi = k ? k.dataset.kus : null; }, true);

// ------------------------------------------------------------------ API
let pending = 0;
// r27-24: spolehlivější spojení na telefonu — každý dotaz má časový limit (zaseklé spojení po přepnutí sítě nebo z pozadí
// už neblokuje hru), stejné souběžné dotazy (obnovy na pozadí) se slučují, čtení se při výpadku jednou zopakuje
// a točící se ukazatel se ukáže jen u akcí hráče, které trvají déle než chvilku.
const SPOJ = { letici: new Map(), ovladace: new Set(), busyT: 0 };
const CTENI = new Set(["me", "vyzvy", "raid", "mini", "chat", "cas", "place", "shop", "icons", "card", "mapa_obr", "vyhlasky", "denik", "zverinec", "napoje", "hraci", "cock",
  "kampan", "auctions", "duels", "people", "poradi", "kroniky", "farm", "truhla", "domov", "uloziste", "tapety", "dum_predat_info", "domy", "vareni", "podnik", "zakazky_hracu", "admin_check", "status"]);
const LIMIT = (op) => (["card", "mapa_obr", "icons"].includes(op) ? 45000 : op === "raid_click" ? 30000 : 15000);
function busyUkaz(zap) {
  clearTimeout(SPOJ.busyT);
  if (zap) SPOJ.busyT = setTimeout(() => { if (pending > 0) $("#busy").hidden = false; }, 350);
  else $("#busy").hidden = true;
}
async function fetchApi(op, data) {
  const ac = new AbortController(); SPOJ.ovladace.add(ac);
  const tm = setTimeout(() => ac.abort(), LIMIT(op));
  try {
    const r = await fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, signal: ac.signal, cache: "no-store",
      body: JSON.stringify({ op, token: S.token, lang: S.lang === "pl" ? "en" : S.lang === "sk" ? "cs" : S.lang, ...(KUS.pristi != null && !CTENI.has(op) ? { kus: KUS.pristi } : {}), ...data }) });
    return await r.json();
  } finally { clearTimeout(tm); SPOJ.ovladace.delete(ac); }
}
async function call(op, data = {}, quiet = false) {
  const klic = quiet && CTENI.has(op) ? op + JSON.stringify(data) : null;
  if (klic && SPOJ.letici.has(klic)) return SPOJ.letici.get(klic);          // obnova na pozadí už běží — počkat na ni
  const prace = (async () => {
    pending++; if (!quiet) busyUkaz(true);
    try {
      let res;
      let poslany = S.token;                       // 1.0-1-10: odpověď na starší přihlášení nesmí odhlásit nové
      for (let pokus = 0; ; pokus++) {
        try { poslany = S.token; res = await fetchApi(op, data); break; }
        catch (e) {
          if (pokus === 0 && CTENI.has(op) && !(e instanceof SyntaxError)) { await new Promise((r) => setTimeout(r, 600)); continue; }
          throw new Error(t(e instanceof SyntaxError ? "bad_reply" : "net_error"));
        }
      }
      if (!res.ok) {
        if (res.auth === "login" && op !== "link" && poslany === S.token) { logout(true, res.error); }
        throw new Error(res.error || t("bad_reply"));
      }
      if (res.token && (op === "link" || op === "login_pw")) { S.token = res.token; store.set("token", res.token); }   // 1.0-1-10: nový klíč dřív, než setMe pošle další požadavky (vzkazy)
      if (res.me) setMe(res.me);
      else if (op === "me") setMe(res);              // „me“ vrací postavu přímo, ne pod klíčem me
      return res;
    } catch (e) {
      if (!quiet) toast(e.message, true);
      throw e;
    } finally {
      if (--pending <= 0) { pending = 0; busyUkaz(false); }
      if (klic) SPOJ.letici.delete(klic);
    }
  })();
  if (klic) SPOJ.letici.set(klic, prace);
  return prace;
}
/** Po návratu aplikace z pozadí: zrušit visící dotazy a uvolnit zámky tlačítek (jinak by hra zůstala „načítat“). */
function spojeniObnov() {
  SPOJ.ovladace.forEach((a) => { try { a.abort(); } catch {} });
  SPOJ.ovladace.clear(); SPOJ.letici.clear();
  pending = 0; busyUkaz(false);
  try { RAID.busy = false; } catch {}
  try { MINI.busy = false; MINI.inAct = false; } catch {}
  try { HRACI.busy = false; } catch {}
  try { FARM.busy = false; } catch {}
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
// 1.0-1-6: barevný rámeček podle vzácnosti — legenda (zlatá), +1 (zelená), +2 (modrá), +3 (fialová)
const vzacnost = (id, lvl) => { const V = (S.me && S.me.vzacnost) || {};
  if ((V.legendy || []).includes(id)) return " vz-legenda";
  const l = lvl != null ? lvl : (V.vylepseni || {})[id] || 0; return l ? " vz-" + Math.min(3, l) : ""; };
const icon = (id, lvl) => `<img class="icon malovana${vzacnost(id, lvl)}" alt="" data-item="${esc(id)}" src="${IMG_BASE}predmety/ikony/${Postava.slug(id)}.webp">`;
function ikonaZaloha(img) {
  img.onerror = null; img.classList.remove("malovana"); img.dataset.zaloha = "1";
  const s = S.icons[img.dataset.item];
  if (s) { img.src = "data:image/png;base64," + s; return; }
  img.style.visibility = "hidden";                                // 1.0-3-14: žádná rozbitá ikona — schovat a dotáhnout ikonu ze serveru
  if (img.dataset.item && !(img.dataset.item in S.icons)) loadIcons([img.dataset.item]).then(() => {
    const t = S.icons[img.dataset.item]; if (t) { img.src = "data:image/png;base64," + t; img.style.visibility = ""; } });
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
  try { if (pl && pl.checked && !$("#plocha-login").hidden) nabidniPlochu(); } catch { /* 1.0-1-8: ikona na plochu nesmí zastavit přihlášení */ }    // r27-5: ještě v rámci kliknutí
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
call("status", {}, true).then((r) => { if (r) novaVerze(r.build); if (r && r.discord) { $("#login-discord-a").href = r.discord; $("#login-discord").hidden = false; } }).catch(() => {});
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
{ const z = $("#tb-zvuk");                                   // 1.0-1-11: ztlumit / zapnout zvuk jedním klikem (i klávesou M)
  const tl = [z, $("#login-zvuk")].filter(Boolean);           // i na přihlašovací obrazovce (hraje tam hudba)
  const ukaz = () => tl.forEach((b) => { b.classList.toggle("ztlumeno", !Zvuk.V.on); b.title = Zvuk.V.on ? "Ztlumit zvuk (M)" : "Zapnout zvuk (M)"; });
  const prepni = () => { Zvuk.set("on", !Zvuk.V.on); if (Zvuk.V.on) Zvuk.sfx("klik"); ukaz(); const c = $("#snd-on"); if (c) c.checked = Zvuk.V.on; };
  tl.forEach((b) => { b.onclick = prepni; }); ukaz();
  document.addEventListener("keydown", (e) => { if ((e.key === "m" || e.key === "M") && !e.ctrlKey && !e.metaKey && !e.altKey && !/INPUT|TEXTAREA|SELECT/.test((e.target || {}).tagName || "") && !e.target.isContentEditable && !document.querySelector(".mh")) prepni(); });
}
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

/** r27-36: pozvání na pití — host ho musí přijmout (okénko s Přijmout / Odmítnout). */
const POZV = { videno: new Set() };
// r27-40: nový projev náklonnosti nebo žádost o ruku — upozornění a číslo u záložky Deník
const VZTU = { videno: 0 };
function vztahUkaz() {
  const n = (S.me && S.me.vztah_ceka) || 0;
  document.querySelectorAll('[data-tab="denik"]').forEach((b) => { b.classList.toggle("ma-novinku", n > 0); if (n) b.dataset.pocet = n; else delete b.dataset.pocet; });
  if (n > VZTU.videno) toast(L(["💞 Někdo ti projevil náklonnost — Deník → Vztahy.", "💞 Someone is courting you — Journal → Relationships."]));
  VZTU.videno = n;
}
function pozvankyUkaz() {
  const p = ((S.me && S.me.pozvanky) || []).find((x) => !POZV.videno.has(x.id));
  if (!p || document.querySelector(".pozv-obal")) return;
  POZV.videno.add(p.id);
  const o = document.createElement("div");
  o.className = "rekap-obal vysv-obal pozv-obal";
  o.innerHTML = `<div class="rekap vyp-pergamen vysv"><h2>${esc(L(["Pozvání na pití", "A drink invitation"]))}</h2>
    <p>${esc(L([`${p.od} tě zve na ${p.napoj.toLowerCase()}. Platí ${p.od}.`, `${p.od} invites you for ${p.napoj}. They pay.`]))}</p>
    <div class="row" style="justify-content:center;margin-top:12px"><button class="btn primary" data-pz="1">${esc(L(["Přijmout", "Accept"]))}</button>
      <button class="btn" data-pz="0">${esc(L(["Odmítnout", "Decline"]))}</button></div></div>`;
  o.querySelectorAll("[data-pz]").forEach((b) => b.onclick = async () => {
    o.remove();
    try { await call("pozvani_odpoved", { id: p.id, ano: b.dataset.pz === "1" }); toast(b.dataset.pz === "1" ? L([`Na zdraví, ${p.od}!`, "Cheers!"]) : L(["Pozvání jsi odmítl(a).", "Declined."])); if (S.tab === "napoje") render(); }
    catch { /* chyba se ukázala */ }
    setTimeout(pozvankyUkaz, 300);
  });
  document.body.appendChild(o);
}

// r27-39: odpočet časového limitu výpravy (pod 10 minut zčervená, pod 3 bliká)
setInterval(() => {
  document.querySelectorAll(".vcas[data-deadline]").forEach((el) => {
    const s = Math.max(0, Math.round(Number(el.dataset.deadline) - Date.now() / 1000));
    el.querySelector("b").textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
    el.classList.toggle("malo", s <= 600); el.classList.toggle("kriticky", s <= 180);
  });
}, 1000);

// r27-16: herní hodiny nahoře běží samy (1 h reálně = 6 h ve hře); datum, doba dne a počasí se doptají serveru každou minutu
const HODINY = { min: null, t: 0, rychlost: 6 };
setInterval(() => {
  const el = document.querySelector("#tb-clock .tb-hod");
  if (!el || HODINY.min == null || document.visibilityState !== "visible") return;
  const m = Math.floor(HODINY.min + (Date.now() - HODINY.t) / 60000 * HODINY.rychlost) % 1440;
  el.textContent = String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0");
}, 5000);
/** 1.0-1-11: server běží na nové verzi → pruh nahoře „obnov okno“ (stránka má ještě starý kód). */
const VERZE = { moje: null };
function novaVerze(b) {
  if (!b) return;
  if (!VERZE.moje) { VERZE.moje = b; return; }
  if (b === VERZE.moje || document.getElementById("nova-verze")) return;
  const el = document.createElement("div"); el.id = "nova-verze";
  el.innerHTML = `<span>${esc(L(["⬆️ Vyšla nová verze hry. Obnov okno, ať máš všechny opravy.", "⬆️ A new version of the game is out. Reload to get it."]))}</span>
    <button class="btn small primary">${esc(L(["Obnovit", "Reload"]))}</button><button class="btn small" data-pozdeji>${esc(L(["Později", "Later"]))}</button>`;
  el.querySelector(".primary").onclick = () => location.reload();
  el.querySelector("[data-pozdeji]").onclick = () => { el.remove(); VERZE.moje = b; };
  document.body.appendChild(el);
}
setInterval(async () => {
  if (!S.token || !S.me || !S.me.has_character || document.visibilityState !== "visible") return;
  try {
    const r = await call("cas", {}, true);
    if (r.speed) HODINY.rychlost = r.speed;
    novaVerze(r.build);
    const zmena = (S.me.kalendar || {}).doba !== r.kalendar.doba || S.me.weather !== r.weather || S.me.night !== r.night;
    S.me.kalendar = { ...(S.me.kalendar || {}), ...r.kalendar }; S.me.weather = r.weather; S.me.night = r.night;
    if (r.pozvanky) { S.me.pozvanky = r.pozvanky; pozvankyUkaz(); }   // r27-36
    if (r.vzkazy && r.vzkazy.length) vzkazyUkaz(r.vzkazy);              // 1.0-2-3: oznámení (např. někdo našel tvé tělo) do minuty
    const K = S.me.kalendar;
    $("#tb-clock").innerHTML = `<b class="tb-hod">${esc(K.hodina)}</b> <span class="tb-doba">${esc(K.doba)}</span><span class="tb-datum">${esc(K.text)} · ${esc(K.season)}</span>`;
    const [hh, mm] = K.hodina.split(":").map(Number); HODINY.min = hh * 60 + mm; HODINY.t = Date.now();
    const sky = $("#tb-sky");
    if (sky && zmena) sky.textContent = (r.night && r.weather === "jasno" ? "🌙" : SKY[r.weather] || "") + " " + (S.lang === "en" || S.lang === "pl" ? SKY_EN[r.weather] || r.weather : r.weather);
    if (zmena && typeof Scena !== "undefined") Scena.setWorld(S.me);   // noc / den, déšť v obrázcích
  } catch { /* nic */ }
}, 60000);

/** 1.0-3-1: výzvy (škopek, pěsti, hry, kolbiště) — stálý panel s tlačítky a odpočtem; obnova každých 10 s.
 *  Dřív výzva přišla jen jako krátké upozornění se zprávami (jednou za minutu) a hned zmizela. */
const VYZ = { st: { prichozi: [], odchozi: [] }, t: 0, busy: false, tik: null };
async function vyzvyNacti() {
  if (!S.token || !S.me || !S.me.has_character || document.visibilityState !== "visible" || VYZ.busy) return;
  try { const r = await call("vyzvy", {}, true); VYZ.st = { prichozi: r.prichozi || [], odchozi: r.odchozi || [] }; VYZ.t = Date.now();
    if (r.zmena && r.zmena !== VYZ.zmena) {   // 1.0-3-14: správce změnil postavu (groše, předmět…) → načíst profil bez obnovení stránky
      const prvni = VYZ.zmena == null; VYZ.zmena = r.zmena;
      if (!prvni) { await call("me", {}, true).catch(() => {}); if (!document.querySelector(".rekap-obal, .vmodal input:focus, input:focus, textarea:focus")) render(); }
    } else if (VYZ.zmena == null) VYZ.zmena = r.zmena || 0;
  } catch { return; }
  vyzvyKresli();
}
function vyzvyKresli() {
  let el = document.getElementById("vyzvy-panel");
  const { prichozi, odchozi } = VYZ.st;
  if (!prichozi.length && !odchozi.length) { if (el) el.remove(); clearInterval(VYZ.tik); VYZ.tik = null; return; }
  if (!el) { el = document.createElement("div"); el.id = "vyzvy-panel"; document.body.appendChild(el); }
  const ub = Math.floor((Date.now() - VYZ.t) / 1000);
  const cas = (z) => { const s = Math.max(0, z - ub); return `<small class="vyz-cas${s < 40 ? " malo" : ""}">⏳ ${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}</small>`; };
  const nove = prichozi.some((v) => !VYZ.videno || !VYZ.videno.has(v.druh + v.id));
  el.innerHTML = prichozi.map((v) => `<div class="vyz vyz-pri"><span>⚔️ <b>${esc(v.od)}</b> ${esc(L(["tě vyzývá:", "challenges you:"]))} <b>${esc(v.co)}</b>${v.vklad ? ` ${esc(L(["o", "for"]))} <b>${v.vklad} gr.</b>` : ""} ${cas(v.zbyva)}</span>
      <span class="row"><button class="btn small primary" data-vyz="ano" data-d="${esc(v.druh)}" data-id="${esc(v.id)}">${esc(L(["Přijmout", "Accept"]))}</button><button class="btn small" data-vyz="ne" data-d="${esc(v.druh)}" data-id="${esc(v.id)}">${esc(L(["Odmítnout", "Decline"]))}</button></span></div>`).join("")
    + odchozi.map((v) => `<div class="vyz vyz-odch"><span>⏳ ${esc(L(["Tvoje výzva", "Your challenge"]))} → <b>${esc(v.k)}</b>: ${esc(v.co)}${v.vklad ? ` ${v.vklad} gr.` : ""} ${cas(v.zbyva)}</span>
      <button class="btn small" data-vyz="zrus" data-d="${esc(v.druh)}" data-id="${esc(v.id)}">${esc(L(["Zrušit výzvu", "Cancel"]))}</button></div>`).join("");
  if (nove && prichozi.length) { VYZ.videno = new Set(prichozi.map((v) => v.druh + v.id)); if (typeof Zvuk !== "undefined") Zvuk.sfx("zvon"); }
  el.querySelectorAll("[data-vyz]").forEach((b) => b.onclick = () => vyzvaAkce(b.dataset.vyz, b.dataset.d, b.dataset.id));
  if (!VYZ.tik) VYZ.tik = setInterval(vyzvyKresli, 1000);
}
async function vyzvaAkce(co, druh, id) {
  if (VYZ.busy) return;
  VYZ.busy = true;
  try {
    let r;
    if (druh === "hra") r = await call("raid_click", { id: `ks:pvp:${co === "ano" ? "accept" : "decline"}:${id}` });
    else r = await call(`${druh}_${co === "zrus" ? "zrusit" : "odpoved"}`, co === "zrus" ? { id } : { id, ano: co === "ano" });
    if (r && r.text) toast(r.text);
    if (co === "ano") go(druh === "hra" ? "hra" : druh);
  } catch { /* toast ukázal chybu */ } finally { VYZ.busy = false; }
  VYZ.t = 0; await vyzvyNacti();
}
setInterval(vyzvyNacti, 10000);
setTimeout(vyzvyNacti, 2500);

/** v1.0 + 1.0-2-3: zprávy hráči. Běžné jako krátké upozornění, důležité (s nadpisem — třeba někdo našel tvé tělo) jako okno k potvrzení. */
const VZK = { videno: new Set(), fronta: [] };
function vzkazyUkaz(seznam) {
  const nove = (seznam || []).filter((v) => !VZK.videno.has(v.t + "|" + v.text));
  if (!nove.length) return;
  nove.forEach((v) => VZK.videno.add(v.t + "|" + v.text));
  call("vzkazy_precteno", {}, true).catch(() => {});
  nove.filter((v) => !v.nadpis).forEach((v, i) => setTimeout(() => toast(noEmoji(v.text)), 400 + i * 4200));
  VZK.fronta.push(...nove.filter((v) => v.nadpis));
  vzkazOkno();
}
function vzkazOkno() {
  if (!VZK.fronta.length || document.querySelector(".vzk-obal")) return;
  const v = VZK.fronta.shift();
  const o = document.createElement("div");
  o.className = "rekap-obal vysv-obal vzk-obal";
  o.innerHTML = `<div class="rekap vyp-pergamen vysv"><h2>${esc(v.nadpis)}</h2>
    <div class="vzk-text">${String(v.text).split("\n").map((r) => `<p>${dmdInline(r)}</p>`).join("")}</div>
    <div class="row" style="justify-content:center;margin-top:12px"><button class="btn primary" data-vzk-ok>${esc(L(["Rozumím", "OK"]))}</button></div></div>`;
  o.querySelector("[data-vzk-ok]").onclick = () => { o.remove(); setTimeout(vzkazOkno, 250); };
  document.body.appendChild(o);
  if (typeof Zvuk !== "undefined") Zvuk.sfx("klik");
}

function setMe(me) {
  if (me && me.vzkazy && me.vzkazy.length) vzkazyUkaz(me.vzkazy);   // v1.0: zprávy hráči (dřív do vlákna na Discordu)
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
  { const zkus = (n) => call("admin_check", {}, true).then((r) => { const b = document.querySelector('[data-tab="admin"]'); if (b) b.hidden = !r.admin; if (r.admin && S.tab === "misto" && S.arg === "brana") render(); if (!r.admin && n) setTimeout(() => zkus(n - 1), 4000); })
      .catch(() => { if (n) setTimeout(() => zkus(n - 1), 4000); });
    zkus(1); }   // r27-4: jen pro správce; r27-6: při chybě nebo pomalém Discordu zkusí ještě jednou
  { const z = store.get("tab") || "mesto"; go(z === "admin" || z.startsWith("panel/=") ? "mesto" : z); }   // r27-5: po načtení nic samo nemačkat
}

const LEVA_RUKA = ["Dýka", "Rondel", "Tesák", "Lovecký tesák", "Krysařův tesák"];        // 1.0-1-6: boj dvěma zbraněmi (game.LEVA_RUKA)
const PRAVA_S_LEVOU = [...LEVA_RUKA, "Šavle", "Krátký meč", "Sekyrka"];
const TAB_OF = { skopek: "mesto", sazky: "mesto", pesti: "mesto", mesto: "mesto", misto: "mesto", lichvar: "mesto", vykresy: "mesto", mincovna: "mesto", obchod: "mesto", hra: "mesto", vyprava: "mesto", statek: "mesto", panel: "mesto", povoz: "mesto", domov: "mesto", kohouti: "mesto", hraci: "mesto", aukce: "mesto", souboje: "mesto", hrbitov: "mesto", vydaje: "mesto", obyvatele: "mesto", dar: "mesto", poradi: "mesto", kroniky: "mesto", truhla: "mesto", napoje: "mesto", zverinec: "mesto", dilna: "mesto", erb: "mesto", uloziste: "mesto", domy: "mesto", vareni: "mesto", dilnadoma: "mesto", podnik: "mesto", podnikprace: "mesto", podnikuloziste: "mesto", podnikstav: "mesto", zakazkyhracu: "mesto", stavdomu: "mesto", calounik: "mesto", prodejdomu: "mesto", hero: "hero", bag: "bag", more: "more", pet: "pet", denik: "denik", admin: "admin", prirucka: "more", novy: "novy" };

const SKY = { "jasno": "☀️", "vedro": "🔥", "déšť": "🌧️", "bouřka": "⛈️", "mlha": "🌫️", "vítr": "💨", "silný vítr": "💨", "sníh": "🌨️", "mráz": "🥶" };
const SKY_EN = { "jasno": "clear", "vedro": "heat", "déšť": "rain", "bouřka": "storm", "mlha": "fog", "vítr": "wind", "silný vítr": "gale", "sníh": "snow", "mráz": "frost" };

// 1.0-1: každé „← Zpět“ vrací o jeden krok — tam, odkud jsi přišel (ne na pevně dané místo)
const NAV = { stack: [], cur: "", klik: 0 };
const jeZpet = (b) => b && !b.closest(".zl-nav") && (b.id === "back" || b.id === "pback" || b.hasAttribute("data-zpet")
  || /^\s*←/.test(b.textContent) || /^\s*(\S+\s+)?(Zpět|Back)\b/.test(b.textContent));
document.addEventListener("click", (e) => { if (jeZpet(e.target.closest("button, a, .sz-karta, [data-go]"))) NAV.klik = performance.now(); }, true);
// přesměrování z mezikroku (panel → vlastní stránka): mezikrok se do historie nezapíše, ať Zpět nevede zpátky na přesměrování
function presmeruj(route) { if (NAV.cur && /^panel\//.test(NAV.cur)) NAV.cur = NAV.stack.pop() || ""; go(route); }
function goZpet(fallback) { NAV.klik = performance.now(); go(fallback); }
function go(route, zHistorie = false) {
  let zpet = zHistorie;
  if (!zHistorie && NAV.klik && performance.now() - NAV.klik < 400) {   // klik na Zpět: o krok zpátky, pevný cíl jen když není kam
    NAV.klik = 0; zpet = true;
    while (NAV.stack.length && NAV.stack[NAV.stack.length - 1] === NAV.cur) NAV.stack.pop();
    if (NAV.stack.length) route = NAV.stack.pop();
  } else if (zHistorie) {
    NAV.stack.pop();
  }
  let [tab, ...rest] = String(route || "").split("/");
  if (!VIEWS[tab]) { tab = "mesto"; rest = []; }
  S.tab = tab; S.arg = decodeURIComponent(rest.join("/"));
  const r = S.arg ? tab + "/" + encodeURIComponent(S.arg) : tab;
  if (!zpet && NAV.cur && NAV.cur !== r && !NAV.cur.startsWith("panel/=")) { NAV.stack.push(NAV.cur); if (NAV.stack.length > 40) NAV.stack.shift(); }
  NAV.cur = r;
  store.set("tab", r);
  if (tab === "hra") S.inn = null;
  if (tab === "vyprava") { RAID.st = null; RAID.panel = null; }                 // hostinec vždy načíst čerstvý (mohl hrát na Discordu)
  document.querySelectorAll(".tabs button").forEach((b) => b.classList.toggle("on", b.dataset.tab === TAB_OF[tab]));
  if (location.hash !== "#" + r) { if (zpet) history.replaceState(null, "", "#" + r); else history.pushState(null, "", "#" + r); }
  skrolNa(0);
  if ((typeof Zvuk !== "undefined")) { if (!["mesto", "misto", "obchod", "hra", "vyprava", "panel", "domov", "kohouti", "statek", "sazky", "pesti", "skopek"].includes(tab)) { Zvuk.scene([], S.me || {}, true); Zvuk.music(townMusic()); } }
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
  pozvankyUkaz();                                                    // r27-36: čekající pozvání na pití
  vztahUkaz();                                                       // r27-40: dvoření, dárky, žádost o ruku
  if ((S.me.pet_umrti || []).length) { const mrtva = S.me.pet_umrti; S.me.pet_umrti = []; setTimeout(() => alert(L(["Smutná zpráva z domova:\n\n", "Sad news:\n\n"]) + mrtva.map((x) => "🕯️ " + (String(x).includes(" — ") ? x : x + L([" — zemřelo hladem a bez péče.", " — died of neglect."]))).join("\n") + L(["\n\nNajdeš ho na hřbitově zvířátek.", "\n\nSee the pet cemetery."])), 300); }   // r27-14: vždy s důvodem   // r27-6: zkušební režim správce — výrazný pruh nahoře
  view.dataset.tab = S.tab; view.classList.toggle("kniha", ["hero", "bag", "more", "pet", "denik"].includes(S.tab));   // příručka má vlastní knihu                         // r27-4: vzhled podle záložky (Noc nad městem / Kronika)
  view.classList.toggle("wide", ["kroniky", "skopek", "sazky", "pesti", "bag", "mesto", "misto", "obchod", "hra", "vyprava", "panel", "domov", "kohouti", "statek", "hraci", "aukce", "souboje", "hrbitov"].includes(S.tab));
  view.classList.toggle("rozdel", ["misto", "panel", "obchod", "aukce", "truhla", "napoje", "vydaje", "obyvatele", "dar", "poradi", "zverinec", "dilna", "erb", "povoz", "vyhlasky", "hrbitov", "domov", "uloziste", "stavdomu", "calounik", "prodejdomu", "domy", "vareni", "dilnadoma", "podnik", "podnikprace", "podnikuloziste", "podnikstav", "zakazkyhracu", "lichvar", "mincovna", "vykresy"].includes(S.tab));   // r27-12: na PC obraz vlevo, volby vpravo — bez scrollování
  const stejna = S._lastRoute === S.tab + "/" + (S.arg || ""), y = skrolY();   // r27-11: po akci zůstaň, kde jsi byl
  S._lastRoute = S.tab + "/" + (S.arg || "");
  if (stejna && y > 0) view.style.minHeight = view.offsetHeight + "px";
  const r = VIEWS[S.tab](view);
  const vrat = () => { if (stejna && y > 0) { skrolNa(y); requestAnimationFrame(() => skrolNa(y)); } view.style.minHeight = ""; };
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
VIEWS.kampan = (view) => kampanView(view);                 // 1.0-3: Dobrodružství (kampan.js)
VIEWS.novy = (view) => { if (S.me && S.me.has_character) { go("mesto"); return; } zalozitPostavu(view); };

// --- postava
const HERO = { karta: "schop" };
// r27-40: PC — prvek (karta postavy, batoh, mazlíček) vyplní zbytek okna pod hlavičkou; posouvá se jen obsah panelů, ne stránka
function vejdiDoOkna(sel, min = 420) {
  const v = $("#view"), el = v && v.querySelector(sel);
  if (!el || jeMobil() || innerWidth <= 1100) { if (el) el.style.height = ""; return; }
  const run = () => {
    if (!el.isConnected) return;
    const top = el.getBoundingClientRect().top - v.getBoundingClientRect().top + v.scrollTop;
    const pad = parseFloat(getComputedStyle(v).paddingBottom) || 0;
    let pod = 0; for (let x = el; x && x !== v; x = x.parentElement) { const cs = getComputedStyle(x); pod += (parseFloat(cs.paddingBottom) || 0) + (parseFloat(cs.borderBottomWidth) || 0) + (x === el ? 0 : parseFloat(cs.marginBottom) || 0); }
    const pred = parseFloat(el.style.height) || 0;
    el.style.setProperty("height", Math.max(min, v.clientHeight - top - pad - pod - 6) + "px", "important");
    el.style.setProperty("min-height", "0", "important");
    const navic = v.scrollHeight - v.clientHeight;                 // r27-41: co je pod prvkem (tlačítko Zpět…), se taky musí vejít
    if (navic > 0) el.style.setProperty("height", Math.max(min, el.getBoundingClientRect().height - navic - 2) + "px", "important");
    if (pred && Math.abs((parseFloat(el.style.height) || 0) - pred) < 6) el.style.setProperty("height", pred + "px", "important");   // 1.0-1: drobné rozdíly nepřepočítávat — list neposkakuje
    v.scrollTop = 0;
  };
  run(); requestAnimationFrame(run); setTimeout(run, 300);
}
function vejdiKartu() {
  { const tip = $("#uc-tip"); if (tip) tip.hidden = true; }
  vejdiDoOkna(".hero-sheet");
  const fit = () => {   // r27-42: karta Postava — kruhy a znaky se zmenší, dokud se obsah nevejde (žádné posouvání)
    const el = $("#view .hk-obsah.hk-stav"); if (!el || jeMobil() || innerWidth <= 1100) return;
    for (let k = 104; k >= 44; k -= 4) { el.style.setProperty("--kz", k + "px"); if (el.scrollHeight <= el.clientHeight + 1) break; }
  };
  [60, 380, 980].forEach((t) => setTimeout(fit, t));
}
addEventListener("resize", () => { if (S.tab === "hero") vejdiKartu(); else if (S.tab === "bag") vejdiDoOkna(".batoh-pc", 360); else if (S.tab === "pet") vejdiDoOkna(".pet-pc", 420); else if (S.tab === "denik") { clearTimeout(DENIK.rsz); DENIK.rsz = setTimeout(render, 300); } });
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
  const stromU = P.strom || [];   // r27-42: úrovně jako záložky pod speciální vlastností, pod nimi schopnosti vybrané úrovně
  const cekaU = stromU.find((u) => u.dosazeno && !u.pevna && !u.potvrzeno);
  if (HERO.skUr == null || !stromU.some((u) => u.lvl === HERO.skUr)) HERO.skUr = cekaU ? cekaU.lvl : (stromU[0] || {}).lvl;
  const skZal = stromU.length ? `<div class="sk-zal">${stromU.map((u) => { const ceka = u.dosazeno && !u.pevna && !u.potvrzeno;
    return `<button type="button" class="chip${u.lvl === HERO.skUr ? " on" : ""}${ceka ? " ceka" : ""}${u.dosazeno ? "" : " zamek"}" data-skur="${u.lvl}"><span class="sk-dl">${esc(L(["Úroveň ", "Level "]))}</span><span class="sk-kr">${esc(L(["Úr. ", "Lv "]))}</span>${u.lvl}${ceka ? " !" : u.dosazeno ? "" : " 🔒"}</button>`; }).join("")}</div>` : "";
  const strom = skZal + stromU.filter((u) => u.lvl === HERO.skUr).map((u) => {
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
  // r27-40: účinky jako mřížka výstižných ikon — popis v okénku po najetí myší / kliknutí (bez posouvání)
  const UC_EMO = [[/hladové zvíře/i, "🦴", "hladove-zvire"], [/mazlíček/i, "🐾", "mazlicek"], [/požehnání|chrám/i, "🙏", "pozehnani"], [/plný sil/i, "💪", "plny-sil"], [/hlad/i, "🍖", "hlad"],
    [/žízeň|žízniv/i, "💧", "zizen"], [/opil|napil|kocovin|násosk|opilost/i, "🍺", "opilost"], [/odpoč|únav|vyčerp|ospal/i, "😴", "unava"], [/počasí|chlad|zima|prochl|mrz/i, "❄️", "zima"],
    [/zbroj zatěž/i, "🏋️", "zbroj-zatezuje"], [/hledaný/i, "⚖️", "hledany"], [/dluh/i, "📜", "dluh"], [/zraněn|krvác/i, "🩸", ""]];
  const ucIk = (x) => {
    const pred = x.src === "vypitý odvar" ? x.name : /^Zušlechtěn/.test(x.name) ? (/\(([^)]+)\)/.exec(x.text) || [])[1] : "";
    if (pred) return `<span class="uc-ik">${icon(pred)}</span>`;
    const f = /^Opotřebená/.test(x.name) ? ["🗡️", "opotrebena"] : /^Příliš těžké/.test(x.name) ? ["🪨", "prilis-tezke"] : null;
    const [, em, sl] = f ? [0, ...f] : (UC_EMO.find(([re]) => re.test(x.name + " " + x.src + " " + x.text)) || [0, x.kind === "bonus" ? "✦" : "✕", ""]);
    return sl ? `<span class="uc-ik em" data-em="${em}"><img class="uc-obr" alt="" src="${IMG_BASE}ucinky/${sl}.webp"></span>` : `<span class="uc-ik em">${em}</span>`;
  };
  const ucHod = (x) => x.name === "Boj dvěma zbraněmi" ? "×2" : (/[+−-]\s?\d+\s?%?/.exec(x.text) || [""])[0].replace(/\s/g, "");   // 1.0-3-2
  const ucinky = U.length ? ["bonus", "postih"].map((kind) => {
      const z = U.filter((x) => x.kind === kind);
      if (!z.length) return `<div class="uc-sk ${kind}"><small>${esc(kind === "bonus" ? L(["Bonusy", "Bonuses"]) : L(["Postihy", "Penalties"]))}</small><p class="muted small">${esc(kind === "bonus" ? L(["Teď žádné.", "None now."]) : L(["Nic tě netrápí.", "Nothing troubles you."]))}</p></div>`;
      return `<div class="uc-sk ${kind}"><small>${esc(kind === "bonus" ? L(["Bonusy", "Bonuses"]) : L(["Postihy", "Penalties"]))}</small><div class="uc-mriz">${z.map((x) =>
        `<button type="button" class="uc-dl ${kind}" data-uc-n="${esc(x.name)}" data-uc-t="${esc(noEmoji(x.text))}" data-uc-s="${esc(x.src || "")}">${ucIk(x)}${ucHod(x) ? `<i class="uc-hod">${esc(ucHod(x))}</i>` : ""}<span class="uc-jm">${esc(x.name)}</span></button>`).join("")}</div></div>`;
    }).join("") : `<div class="empty">${esc(L(["Na postavu teď nic zvláštního nepůsobí. Požehnání v chrámu, odvary nebo mazlíček přidají bonusy; hlad, únava a zima ubírají.", "Nothing special affects you now."]))}</div>`;
  const HK = [["stav", L(["Postava", "Character"])],   // r27-5: záložka „Postava“ (dřív Stav a boj) — tělo, boj a pod Do boje i vlastnosti
    ["schop", L(["Schopnosti", "Abilities"]) + ((P.ceka || []).length ? ` <i class="hk-pocet">${P.ceka.length}</i>` : "")],   // r27-17: čeká volba
    ["dov", L(["Dovednosti", "Skills"])], ["cesta", L(["Cesta", "Path"])],   // 1.0-3-8: záložky Dovednosti a Cesta byly omylem v komentáři
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
        ${hp < 35 ? `<p class="upozorneni ne">${esc(L(["Jsi těžce raněný — ošetři se u apatykáře, obvazem nebo noclehem.", "Badly wounded."]))}</p>` : ""}
        <div class="sb-sekce" data-vysv="boj" title="${esc(L(["Zásah = k20 + útok + zdatnost proti obraně nepřítele; 20 je kritický zásah.", "Hit = d20 + attack + proficiency vs defence."]))}"><small>${esc(L(["Do boje", "In battle"]))} ⓘ</small></div>
        <div class="znaky">
          ${znak("stit", m.armor_class, t("armor_class"), m.tlumeni ? L([`zbroj tlumí ${m.tlumeni} z každé rány`, `armour soaks ${m.tlumeni} per hit`]) : L(["čím víc, tím hůř tě zasáhnou", "harder to hit"]))}
          ${znak("mec", sg(m.attack), t("attack") + (m.attack_leva != null ? " · " + L(["levou ", "left "]) + sg(m.attack_leva) : ""), L(["k hodu na zásah", "to hit"]) + (m.attack_leva != null ? L([" · druhá rána levou rukou má postih", " · off-hand strike has a penalty"]) : ""))}
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
  vejdiKartu();   // r27-40: PC — karta postavy přesně do okna, bez posouvání stránky
  if (jeMobil() && HERO.karta !== "vzhled") {          // 1.0-1: mobil — obsah záložky se posouvá uvnitř karty, stránka stojí
    const o = view.querySelector(".hk-obsah");
    const fit = () => { if (!o || !o.isConnected) return; const nav = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--dole")) || 64;
      const h = innerHeight - o.getBoundingClientRect().top - nav - 34; if (h > 160) { o.style.maxHeight = h + "px"; o.style.overflowY = "auto"; } };
    requestAnimationFrame(fit); setTimeout(fit, 300);
  }
  setTimeout(() => tipy(view), 0);
  view.querySelectorAll("img.uc-obr").forEach((im) => { const nahrad = () => { const s = im.parentElement; if (s) s.textContent = s.dataset.em || ""; };   // bez malby zůstane symbol
    im.addEventListener("error", nahrad); if (im.complete && !im.naturalWidth) nahrad(); });
  view.querySelectorAll(".uc-dl").forEach((b) => { b.dataset.tipN = b.dataset.ucN; b.dataset.tipT = b.dataset.ucT; b.dataset.tipS = b.dataset.ucS; });
  if (false) view.querySelectorAll(".uc-dl").forEach((b) => {   // r27-40: okénko s popisem účinku
    const ukaz = () => {
      let tip = $("#uc-tip"); if (!tip) { tip = document.createElement("div"); tip.id = "uc-tip"; document.body.appendChild(tip); }
      tip.className = b.classList.contains("postih") ? "postih" : "bonus";
      tip.innerHTML = `<b>${esc(b.dataset.ucN)}</b><p>${esc(b.dataset.ucT)}</p>${b.dataset.ucS ? `<small>${esc(b.dataset.ucS)}</small>` : ""}`;
      const r = b.getBoundingClientRect(); tip.hidden = false;
      const w = tip.offsetWidth, hh = tip.offsetHeight;
      tip.style.left = Math.max(8, Math.min(innerWidth - w - 8, r.left + r.width / 2 - w / 2)) + "px";
      tip.style.top = (r.bottom + hh + 12 > innerHeight ? r.top - hh - 8 : r.bottom + 8) + "px";
    };
    const skryj = () => { const tip = $("#uc-tip"); if (tip) tip.hidden = true; };
    b.addEventListener("mouseenter", ukaz); b.addEventListener("focus", ukaz);
    b.addEventListener("mouseleave", skryj); b.addEventListener("blur", skryj);
    b.addEventListener("click", (e) => { e.stopPropagation(); ukaz(); });
  });
  view.querySelectorAll("[data-karta]").forEach((b) => b.onclick = () => { HERO.karta = b.dataset.karta; render(); });
  view.querySelectorAll("[data-skur]").forEach((b) => b.onclick = () => { HERO.skUr = Number(b.dataset.skur); Zvuk.sfx("klik"); render(); });
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
/** 1.0-3-3: admin — náhled vzhledu postavy hráče (klik v seznamu hráčů). */
async function admPostava(uid) {
  let r; try { r = await call("admin", { action: "postava", data: { uid } }); } catch { return; }
  const p = r.postava; if (!p) return;
  document.querySelector(".adm-post-obal")?.remove();
  const eq = (p.equipped || []).map((e) => `<li><small>${esc(e.slot)}</small> ${esc(e.name || e.id)}</li>`).join("") || `<li class="muted">nic nenasazeno</li>`;
  const st = Object.entries(p.stats || {}).map(([k, v]) => `${esc(k.slice(0, 3))} ${v}`).join(" · ");
  const o = document.createElement("div");
  o.className = "rekap-obal vysv-obal adm-post-obal";
  o.innerHTML = `<div class="rekap vyp-pergamen adm-post"><button class="adm-post-x" data-x aria-label="Zavřít">✕</button>
    <div class="adm-post-fig">${Postava.html(p, IMG_BASE)}</div>
    <div class="adm-post-t"><h2>${esc(p.name)}</h2><p class="muted">${esc((p.origin_name || "") + " · úr. " + p.level + " · " + p.coins + " gr.")}<br>Discord: ${esc(p.discord || "—")}</p>
      <p>Životy ${p.health}/${p.max_health}<br><small>${st}</small></p>
      <p><small>Vzhled: ${esc(Object.entries(p.looks || {}).map(([k, v]) => k + " " + v).join(", "))}</small></p>
      <ul class="adm-post-eq">${eq}</ul>
      <p class="row"><button class="btn primary" data-sprav>Spravovat hráče</button><button class="btn" data-x>Zavřít</button></p></div></div>`;
  o.querySelectorAll("[data-x]").forEach((b) => b.onclick = () => o.remove());
  o.onclick = (ev) => { if (ev.target === o) o.remove(); };
  o.querySelector("[data-sprav]").onclick = () => { o.remove(); ADM.hrac = uid; ADM.sekce = "sprava"; render(); };
  document.body.appendChild(o);
  if (typeof Postava.paint === "function") Postava.paint(o);
}
VIEWS.admin = async (view) => {
  view.innerHTML = `<div class="velin"><div class="panel empty">…</div></div>`;
  let r; try { r = await call("admin", { action: "stav" }); } catch { go("mesto"); return; }
  const S_ = [["prehled", "Přehled"], ["hraci", "Hráči"], ["sprava", "Správa hráče"], ["cas", "Datum a čas"], ["pocasi", "Počasí"], ["udalosti", "Události"], ["zk", "Zkušební režim"], ["spravci", "Správci"], ["verze", "Verze a nasazení"], ["hosp", "Hospodářství"]];
  const K = r.kalendar || {}, Pc = r.pocasi || {}, U = r.udalosti || {};
  const msg = (x) => toast(noEmoji(x.text || "").replace(/\*\*/g, ""));
  const obnov = async () => { await call("me").catch(() => {}); render(); };
  const sek = {
    prehled: () => {   // 1.0-1: přehled po skupinách — Hra · Hráči · Dění · Svět
      const onl = (r.hraci || []).filter((x) => x.stav === "online").length;
      const skup = (nadpis, polozky) => `<section class="vl-skup"><h4>${esc(nadpis)}</h4><div class="vl-dlazdice">${polozky.map(([n, v, pozn, tr]) =>
        `<div class="${tr || ""}"><small>${esc(n)}</small><b>${esc(v)}</b>${pozn ? `<span>${esc(pozn)}</span>` : ""}</div>`).join("")}</div></section>`;
      return `<div class="vl-prehled">
        ${skup("Hra", [["Verze", (r.build || "").replace(/^\d{4}-\d\d-\d\d-/, ""), (r.build || "").slice(0, 10)], ["Zkušební režim", r.zkusebni ? "zapnutý" : "vypnutý", "", r.zkusebni ? "on" : ""]])}
        ${skup("Hráči", [["Online", onl, "aktivní do 5 minut", onl ? "on" : ""], ["Postavy", r.players], ["Přihlášení na webu", r.web], ["Hroby", r.graves ?? r.hroby ?? 0]])}
        ${skup("Dění", [["Výpravy", r.missions], ["Družiny čekají", r.lobbies], ["Hry a souboje", r.games]])}
        ${skup("Svět", [["Datum", noEmoji(r.cas ? r.cas.text : ""), r.cas ? r.cas.obdobi : ""], ["Počasí", Pc.ted || "", Pc.vlastni ? "nastavené ručně" : "podle období"],
          ["Událost", (U.kategorie || []).flatMap((k) => k.e).find((e) => e.k === U.ted)?.t || "klid"]])}
      </div>`; },
    hraci: () => `<div class="adm-hraci">${(r.hraci || []).map((x) => {   // 1.0-1: postava · hráč na Discordu · původ, úroveň, groše · online/offline
      const pred = x.ago == null ? "nikdy" : x.ago < 60 ? "teď" : x.ago < 3600 ? Math.floor(x.ago / 60) + " min" : x.ago < 86400 ? Math.floor(x.ago / 3600) + " h" : Math.floor(x.ago / 86400) + " dní";
      return `<div class="adm-hrac ${x.stav}${x.uid ? " klik" : ""}"${x.uid ? ` data-adm-post="${esc(x.uid)}" role="button" tabindex="0" title="Náhled postavy"` : ""}><i class="tecka"></i><div class="adm-hrac-t"><b>${esc(x.name)}</b><span class="adm-dc">Discord: ${esc(x.discord || "—")}</span>
          <small>${esc(x.origin + " · úr. " + x.level + " · " + x.coins + " gr.")}${x.vyprava ? " · na výpravě" : ""}</small></div>
        <span class="adm-kde"><b>${esc(x.stav === "online" ? "online" : "offline")}</b>${x.stav !== "online" ? `<small>${esc(x.ago == null ? "nikdy" : "před " + pred)}</small>` : ""}</span></div>`; }).join("")}</div>`,
    cas: () => `<p class="vl-ted">Teď: <b>${esc(noEmoji(r.cas ? r.cas.text : ""))}</b> · ${esc(r.cas ? r.cas.obdobi : "")}</p>
      <div class="vl-form">
        <label>Den <input type="number" id="a-den" min="1" max="31" value="${K.day || 1}"></label>
        <label>Měsíc <select id="a-mes">${(K.mesice || []).map((m, i) => `<option value="${i + 1}"${i + 1 === K.mesic_i ? " selected" : ""}>${esc(m)}</option>`).join("")}</select></label>
        <label>Rok <input type="number" id="a-rok" min="1300" max="1600" value="${K.year || 1403}"></label>
        <label>Hodina <input type="number" id="a-hod" min="0" max="23" value="${r.cas ? r.cas.hodina : 8}"></label>
        <label>Minuta <input type="number" id="a-min" min="0" max="59" value="${r.cas ? r.cas.minuta : 0}"></label>
        <button class="btn primary" id="a-datum">Nastavit datum a čas</button></div>
      <div class="vl-box adm-rych"><small>Rychlost času</small><p>Teď běží <b>${esc(String(r.rychlost))}×</b> rychleji než skutečný čas (výchozí ${esc(String(r.rychlost_vychozi))}× = 1 skutečná hodina je ${esc(String(r.rychlost_vychozi))} herních hodin).</p>
        <div class="vl-form">${[[1, "Zpomalit na 1×"], [3, "3×"], [r.rychlost_vychozi, "Výchozí " + r.rychlost_vychozi + "×"], [12, "12×"], [24, "24×"], [60, "Zrychlit na 60×"]].map(([v, n]) =>
          `<button class="btn${Number(r.rychlost) === Number(v) ? " primary" : ""}" data-rychlost="${v}">${esc(n)}</button>`).join("")}
          <label>Vlastní <input type="number" id="a-rych" min="0.5" max="120" step="0.5" value="${esc(String(r.rychlost))}"></label><button class="btn" data-rychlost="">Nastavit</button></div>
        <span>Zrychlení zkrátí noci, výroby i lhůty ve skutečném čase. Herní čas při změně neposkočí.</span></div>
      <p class="muted small">Roční období se řídí měsícem (zima prosinec–únor, jaro březen–květen, léto červen–srpen, podzim září–listopad). Herní den běží dál — mění se jen datum a hodina, věk postav ani lhůty se neposunou.</p>`,
    pocasi: () => `<p class="vl-ted">Teď: <b>${esc(Pc.ted || "")}</b> ${Pc.vlastni ? "(nastavené ručně)" : "(podle ročního období)"}</p>
      <div class="vl-mriz">${(Pc.moznosti || []).map((w) => `<button class="vl-volba${w === Pc.ted ? " on" : ""}" data-pocasi="${esc(w)}">${esc(w)}</button>`).join("")}</div>
      <div class="vl-form"><label>Na kolik herních hodin <input type="number" id="a-poc-h" min="1" max="72" value="4"></label>
        <button class="btn" data-pocasi="">Vrátit počasí podle období</button></div>`,
    udalosti: () => (U.kategorie || []).map((k) => `<h4 class="vl-kat">${esc(k.n)}</h4><div class="vl-ud">${k.e.map((e) => `<button class="vl-udalost${e.k === U.ted ? " on" : ""}" data-ud="${esc(e.k)}"><b>${esc(e.t)}</b><em class="vl-sez">${esc(e.s ? e.s.join(", ") : "celý rok")}</em><small>${dmd(e.d).replace(/^<p>|<\/p>$/g, "")}</small></button>`).join("")}</div>`).join("")
      + `<div class="vl-form"><label>Délka (herní hodiny) <input type="number" id="a-ud-h" min="1" max="48" value="12"></label><button class="btn" data-ud="">Ukončit událost (klid)</button></div>
      <p class="muted small">Vyhlášení se zapíše i do kanálu dění na Discordu. Samy od sebe přicházejí jen události, které sedí k ročnímu období (u každé je napsáno kdy); ručně jde vyhlásit kterákoli.</p>`,
    zk: () => `<p class="muted">Hraješ za kopii své postavy bez omezení: milion grošů, úroveň 30, měšťan, pověst, vlastnosti 20, zboží bez ohledu na sklad. Nic se nepropíše do skutečné postavy ani do hospodářství. Výpravy, aukce, sázky, dary a hry s hráči jsou vypnuté.</p>
      <div class="vl-form"><label class="prepinac${r.zkusebni ? " on" : ""}"><input type="checkbox" role="switch" id="adm-zk"${r.zkusebni ? " checked" : ""}><span class="prep-draha"><i></i></span>
          <span class="prep-stav"><b>${r.zkusebni ? "Zapnuto" : "Vypnuto"}</b><small>${r.zkusebni ? "hraješ za zkušební kopii — kliknutím se vrátíš ke skutečné postavě" : "hraješ za skutečnou postavu — kliknutím zapneš zkušební režim"}</small></span></label>
        ${r.zkusebni ? `<button class="btn" id="adm-zk-znovu">Začít znovu (čerstvá kopie)</button>` : ""}</div>
      ${r.zkusebni ? `<h4 class="vl-kat">Testování podniků</h4><p class="muted small">Zkušební postava dostane vybraný podnik: řemeslo 15, všechny výkresy, truhlu plnou surovin a opotřebenou výbavu na opravy a vylepšení. Změní se jí i původ.</p>
        <div class="vl-mriz">${[["kovar", "Kovárna"], ["lovci", "Střelmistrova dílna"], ["apatykar", "Apatyka"], ["lapka", "Doupě"], ["sedlak", "Usedlost"]].map(([k, n]) => `<button class="vl-volba" data-zkpodnik="${k}">${esc(n)}</button>`).join("")}</div>
        <h4 class="vl-kat">Vidět vše</h4><p class="muted small">Nic nezůstane zamčené ani schované: všechna místa na mapě, kterýkoli podnik (kliknutím na něj se zkušební postava přepne),
          měšťanský dům se vším nábytkem, mapy všech oblastí, všechny výkresy a u obchodníků celý sortiment včetně kusů, které jinak padají jen z kořisti.</p>
        <div class="vl-form"><label class="prepinac${S.me.zk_vse ? " on" : ""}"><input type="checkbox" role="switch" id="adm-zkvse"${S.me.zk_vse ? " checked" : ""}><span class="prep-draha"><i></i></span>
          <span class="prep-stav"><b>${S.me.zk_vse ? "Zapnuto" : "Vypnuto"}</b><small>${S.me.zk_vse ? "vše odemčené" : "kliknutím odemkneš vše"}</small></span></label></div>
        <h4 class="vl-kat">Testování domova</h4><p class="muted small">Zkušební postava se přestěhuje do vybraného domu se vším nábytkem, co se vejde, a plnými zásobami.</p>
        <div class="vl-mriz">${[["chalupa", "Chalupa"], ["dum", "Měšťanský dům"]].map(([k, n]) => `<button class="vl-volba" data-zkdum="${k}">${esc(n)}</button>`).join("")}</div>` : ""}`,
    verze: () => `<div class="vl-form"><button class="btn" data-adm="info">Zjistit verzi na GitHubu</button>
        <button class="btn primary" data-adm="nova" data-q="Nasadit novou verzi z GitHubu a restartovat bota?">Nasadit novou verzi</button>
        <button class="btn" data-adm="restart" data-q="Restartovat bota? Hráči budou chvíli offline.">Restartovat bota</button>
        <button class="btn danger" data-adm="zpet" data-q="Vrátit předchozí verzi a restartovat?">Vrátit předchozí verzi</button></div><div id="adm-vysl" class="dtext"></div>`,
    hosp: () => { const E = r.hosp; if (!E) return `<div class="dtext adm-zprava">${dmd(r.economy || "")}</div>`;   // r27-6: přehledně
      const f = (n) => Number(n || 0).toLocaleString("cs-CZ");
      const pruhy = (rows, cls) => { const mx = Math.max(1, ...rows.map((x) => x[1])); return rows.length ? `<ul class="hs-pruhy ${cls}">${rows.map(([k, v]) =>
        `<li><span class="hs-k">${esc(String(k).replace(/^banka\b/, "směnárna"))}</span><span class="hs-p"><i style="width:${Math.max(2, 100 * v / mx)}%"></i></span><b>${f(v)}</b></li>`).join("")}</ul>` : `<p class="muted">—</p>`; };
      const sp = E.prijmy.reduce((s, x) => s + x[1], 0), sv = E.vydaje.reduce((s, x) => s + x[1], 0);
      const HZ = [["souhrn", "Souhrn"], ["toky", "Příjmy a výdaje"], ["obchod", "Obchod"], ["tyden", "Týden a úrovně"], ["bohati", "Nejbohatší"]];   // 1.0-1: po kartách, bez posouvání
      const z = HZ.some(([k]) => k === ADM.hosZal) ? ADM.hosZal : "souhrn";
      const obsah = {
        souhrn: () => `<div class="vl-radek hs-dl">
          <div class="vl-box"><small>Hrdinů</small><b>${E.hracu}</b></div>
          <div class="vl-box"><small>Groše celkem</small><b>${f(E.celkem)}</b><em>kapsy ${f(E.kapsy)} · směnárna ${f(E.banky)}</em></div>
          <div class="vl-box"><small>Na hrdinu</small><b>${f(E.median)}</b><em>medián · průměr ${f(E.prumer)}</em></div>
          <div class="vl-box"><small>Kasa světa</small><b>${f(E.kasa)}</b><em>vrací se nálezy a zakázkami</em></div>
          <div class="vl-box"><small>Od posl. snímku</small><b>${E.vyprav}</b><em>výprav · padlých ${E.padlych}${E.zasah != null ? " · zásah " + E.zasah + " %" : ""}</em></div>
          <div class="vl-box"><small>Příjmy / výdaje</small><b>${f(sp)} / ${f(sv)}</b><em>grošů celkem od zavedení knihy</em></div></div>`,
        toky: () => `<div class="hs-sloupce">
          <section class="vl-box"><h4>Příjmy hráčů <span>${f(sp)} gr.</span></h4>${pruhy(E.prijmy, "plus")}</section>
          <section class="vl-box"><h4>Výdaje hráčů <span>${f(sv)} gr.</span></h4>${pruhy(E.vydaje, "minus")}</section></div>`,
        tyden: () => `<div class="hs-sloupce">
          <section class="vl-box"><h4>Za tento týden odteklo</h4>${pruhy(E.tyden_odteklo, "minus")}</section>
          <section class="vl-box"><h4>Podle úrovní</h4><table class="hs-tab"><tr><th>Úrovně</th><th>Hráčů</th><th>Medián grošů</th></tr>
            ${E.urovne.map((u) => `<tr><td>${esc(u.pasmo)}</td><td>${u.hracu}</td><td>${f(u.median)}</td></tr>`).join("")}</table></section></div>`,
        obchod: () => { const ob = (E.obchod || {})[ADM.obObd || "7"] || {}, OBD = [["7", "7 dní"], ["30", "30 dní"], ["vse", "Celkem"]];   // 1.0-3-9
          const tab = (rows) => rows && rows.length ? `<table class="hs-tab"><tr><th>#</th><th>Předmět</th><th>Kusů</th><th>Grošů</th><th>Nejvíc u</th></tr>
            ${rows.map((x, i) => `<tr><td>${i + 1}.</td><td>${esc(x.name)}</td><td>${f(x.ks)}</td><td>${f(x.gr)}</td><td>${esc(x.kde || "—")}</td></tr>`).join("")}</table>` : `<p class="muted">Zatím nic.</p>`;
          return `<div class="vz-druh hs-zal">${OBD.map(([k, n]) => `<button type="button" class="chip${(ADM.obObd || "7") === k ? " on" : ""}" data-obobd="${k}">${esc(n)}</button>`).join("")}</div>
          <div class="hs-sloupce">
          <section class="vl-box"><h4>Hráči nejčastěji kupují <span>${f(ob.nakup_ks)} ks · ${f(ob.nakup_gr)} gr.</span></h4>${tab(ob.nakup)}</section>
          <section class="vl-box"><h4>Hráči nejčastěji prodávají <span>${f(ob.prodej_ks)} ks · ${f(ob.prodej_gr)} gr.</span></h4>${tab(ob.prodej)}</section></div>
          <p class="muted small">Nákupy u obchodníků, pašeráka a přes posla; prodeje obchodníkům a pašerákovi. Počítá se od ${ob.od ? new Date(ob.od * 1000).toLocaleDateString("cs-CZ") : "teď"} (zkušební postavy ne).</p>`; },
        bohati: () => `<section class="vl-box"><h4>Nejbohatší (kapsa + směnárna)</h4><table class="hs-tab"><tr><th>#</th><th>Hrdina</th><th>Úr.</th><th>Groše</th><th>Domy a podniky</th></tr>
          ${E.nejbohatsi.map((x, i) => `<tr><td>${i + 1}.</td><td>${esc(x.name)}</td><td>${x.level}</td><td>${f(x.penize)}</td><td>${x.majetek ? f(x.majetek) : "—"}</td></tr>`).join("")}</table></section>`,
      };
      return `<div class="hs"><div class="vz-druh hs-zal">${HZ.map(([k, n]) => `<button type="button" class="chip${z === k ? " on" : ""}" data-hz="${k}">${esc(n)}</button>`).join("")}</div>
        <div class="hs-karta">${obsah[z]()}</div>
        <p class="muted small">Příjmy a výdaje od zavedení účetní knihy. Statistiky se každých 6 h ukládají do větve „${esc(E.vetev)}“ na GitHubu.</p></div>`; },
    sprava: () => { const P_ = r.postavy || [], vy = P_.find((p) => p.uid === ADM.hrac) || P_[0]; if (vy) ADM.hrac = vy.uid;
      return P_.length ? `<div class="vl-form"><label>Hráč <select id="a-hrac">${P_.map((p) => `<option value="${esc(p.uid)}"${p.uid === ADM.hrac ? " selected" : ""}>${esc(p.name)} · úr. ${p.level} · ${p.coins} gr.</option>`).join("")}</select></label></div>
      <div class="vl-radek">
        <div class="vl-box"><small>Groše</small><div class="vl-form"><label>Počet (záporný ubere) <input type="number" id="a-gr" value="100"></label><button class="btn primary" data-hr="penize">Připsat</button></div></div>
        <div class="vl-box adm-it-box"><small>Předmět</small><div class="vl-form"><label>Předmět <input id="a-it" autocomplete="off" placeholder="začni psát…"></label>
          <label>Kusů <input type="number" id="a-it-n" min="1" max="99" value="1"></label><button class="btn primary" data-hr="predmet">Dát</button></div></div>
        <div class="vl-box"><small>Původ</small><div class="vl-form"><label>Původ <select id="a-pv">${Object.entries(r.puvody || {}).map(([k, n]) => `<option value="${k}"${vy && vy.origin === k ? " selected" : ""}>${esc(n)}</option>`).join("")}</select></label><button class="btn primary" data-hr="puvod">Nastavit</button></div></div>
        <div class="vl-box"><small>Úroveň</small><div class="vl-form"><label>Úroveň (1–${r.max_uroven}) <input type="number" id="a-lv" min="1" max="${r.max_uroven}" value="${vy ? vy.level : 1}"></label><button class="btn primary" data-hr="uroven">Nastavit</button></div>
          <span>Při zvýšení dostane volné body a rozdělí si je sám.</span></div>
        <div class="vl-box"><small>Zkušenosti</small><div class="vl-form"><label>Přidat XP (má ${vy ? vy.xp : 0} / ${vy ? vy.level * 100 : 100}) <input type="number" id="a-xp" min="1" value="50"></label><button class="btn primary" data-hr="xp">Přidat</button></div>
          <span>Když přeleze hranici, postoupí na další úroveň.</span></div></div>
      <div class="vl-box adm-schop"><small>Vybrané schopnosti</small>${vy && vy.strom && vy.strom.length ? `<div class="adm-schop-r">${vy.strom.filter((u) => !u.pevna).map((u) =>
        `<label>Úroveň ${u.lvl}${u.dosazeno ? "" : " (nedosáhl)"} <select data-schop="${u.lvl}"><option value="">— ať si vybere sám —</option>${u.moznosti.map((a) => `<option value="${esc(a.key)}"${u.potvrzeno && u.vybrano === a.key ? " selected" : ""}>${esc(a.name)}</option>`).join("")}</select></label>`).join("")}</div>
        <div class="vl-form"><button class="btn primary" id="a-schop-ok">Uložit schopnosti</button></div>` : `<p class="muted">Bez původu nejsou schopnosti.</p>`}</div>
      <div class="vl-radek">
        <div class="vl-box adm-kick"><small>Vyhodit ze hry na čas</small><div class="vl-form"><label>Na kolik hodin <input type="number" id="a-kick-h" min="0.25" step="0.25" value="24"></label>
          <label class="siroky">Důvod <input id="a-kick-d" placeholder="např. urážky v chatu"></label><button class="btn" id="a-kick">Vyhodit</button></div>
          <span>Odhlásí se a do hry se nedostane, dokud čas nevyprší. Uvidí důvod.</span></div>
        <div class="vl-box adm-ban"><small>Smazat účet a zakázat (BAN)</small><div class="vl-form"><label class="siroky">Důvod <input id="a-ban-d" placeholder="důvod zákazu"></label>
          <button class="btn danger" id="a-ban">Smazat a zakázat</button></div><span>Postava zmizí úplně (bez hrobu) a hráč si už nezaloží novou.</span></div></div>
      ${(r.bany || []).length ? `<div class="vl-box"><small>Platné zákazy</small><div class="adm-hraci">${r.bany.map((b) => `<div class="adm-hrac"><div class="adm-hrac-t"><b>${esc(b.name)}</b>
        <small>${esc((b.do ? "vyhozen do " + new Date(b.do * 1000).toLocaleString("cs-CZ") : "účet smazán · trvalý zákaz") + " · " + (b.duvod || ""))}</small></div>
        <button class="btn small" data-unban="${esc(b.uid)}">Zrušit zákaz</button></div>`).join("")}</div></div>` : ""}` : `<p class="muted">Zatím žádné postavy.</p>`; },
    spravci: () => `<p class="muted">Admin panel vidí jen hlavní správce a ti, které sem přidá. Přidávat a odebírat může jen hlavní správce.</p>
      <div class="adm-hraci">${(r.spravci || []).map((s) => `<div class="adm-hrac"><div><b>${esc(s.name)}</b></div>${r.hlavni ? `<button class="btn small danger" data-spr-pryc="${esc(s.uid)}">Odebrat</button>` : ""}</div>`).join("") || `<p class="muted">Žádní další správci.</p>`}</div>
      ${r.hlavni ? `<div class="vl-form"><label>Přidat správce <select id="a-spr">${(r.postavy || []).map((p) => `<option value="${esc(p.uid)}">${esc(p.name)}</option>`).join("")}</select></label>
        <button class="btn primary" id="a-spr-ok">Přidat</button></div>` : ""}`,
  };
  view.innerHTML = `<div class="velin"><aside class="vl-menu"><div class="vl-logo"><small>Královské stezky</small><b>Velín správce</b></div>
      ${S_.map(([k, n]) => `<button class="${ADM.sekce === k ? "on" : ""}" data-sek="${k}">${esc(n)}</button>`).join("")}</aside>
    <section class="vl-obsah"><h2>${esc(S_.find(([k]) => k === ADM.sekce)[1])}</h2>${sek[ADM.sekce]()}</section></div>`;
  view.querySelectorAll("[data-sek]").forEach((b) => b.onclick = () => { ADM.sekce = b.dataset.sek; render(); });
  view.querySelectorAll("[data-hz]").forEach((b) => b.onclick = () => { ADM.hosZal = b.dataset.hz; render(); });
  view.querySelectorAll("[data-obobd]").forEach((b) => b.onclick = () => { ADM.obObd = b.dataset.obobd; render(); });   // 1.0-3-9
  const zk = async (on, znovu) => { try { msg(await call("admin", { action: "zkusebni", data: { on, znovu } })); await obnov(); } catch {} };
  document.querySelectorAll("[data-zkpodnik]").forEach((b) => b.onclick = async () => { b.disabled = true;   // 1.0-1-5: testování podniků
    try { const x = await call("admin", { action: "zk_podnik", data: { typ: b.dataset.zkpodnik } }); toast(noEmoji(x.text || "")); const me = await call("me", {}, true); if (me && me.name) S.me = me; go("podnik"); } catch { b.disabled = false; } });
  const z1 = $("#adm-zk"); if (z1) z1.onchange = (e) => zk(e.target.checked, false);
  const zkMe = async () => { const me = await call("me", {}, true); if (me && me.name) S.me = me; };   // 1.0-1-6: vidět vše, domov
  const zv = $("#adm-zkvse"); if (zv) zv.onchange = async (e) => { try { msg(await call("admin", { action: "zk_vse", data: { on: e.target.checked } })); await zkMe(); render(); } catch {} };
  document.querySelectorAll("[data-zkdum]").forEach((b) => b.onclick = async () => { b.disabled = true;
    try { const x = await call("admin", { action: "zk_dum", data: { typ: b.dataset.zkdum } }); toast(noEmoji(x.text || "")); await zkMe(); go("domov"); } catch { b.disabled = false; } });
  const z2 = $("#adm-zk-znovu"); if (z2) z2.onclick = () => confirm("Zahodit zkušební postavu a začít s novou kopií?") && zk(true, true);
  const dt = $("#a-datum"); if (dt) dt.onclick = async () => {
    const data = { den: $("#a-den").value, mesic: $("#a-mes").value, rok: $("#a-rok").value, hodina: $("#a-hod").value, minuta: $("#a-min").value };
    if (!confirm(`Nastavit ${data.den}. ${$("#a-mes").selectedOptions[0].text} ${data.rok}, ${String(data.hodina).padStart(2, "0")}:${String(data.minuta).padStart(2, "0")}?`)) return;
    try { msg(await call("admin", { action: "datum", data })); await obnov(); } catch {}
  };
  const ah = $("#a-hrac"); if (ah) ah.onchange = () => { ADM.hrac = ah.value; render(); };
  view.querySelectorAll("[data-adm-post]").forEach((b) => b.onclick = () => admPostava(b.dataset.admPost));   // 1.0-3-3
  view.querySelectorAll("[data-hr]").forEach((b) => b.onclick = async () => {
    const co = b.dataset.hr, data = { uid: $("#a-hrac").value, co };
    if (co === "penize") data.pocet = $("#a-gr").value;
    if (co === "predmet") { data.predmet = $("#a-it").value; data.pocet = $("#a-it-n").value; }
    if (co === "puvod") data.puvod = $("#a-pv").value;
    if (co === "uroven") data.uroven = $("#a-lv").value;
    if (co === "xp") data.pocet = $("#a-xp").value;
    if (!confirm(`Opravdu upravit hráče ${$("#a-hrac").selectedOptions[0].text.split(" · ")[0]}?`)) return;
    try { msg(await call("admin", { action: "hrac", data })); await call("me", {}, true).catch(() => {}); render(); } catch {}   // 1.0-3-14: i vlastní groše hned
  });
  // 1.0-1: schopnosti, vyhození, BAN, rychlost času, náhledy předmětů
  const so = $("#a-schop-ok"); if (so) so.onclick = async () => {
    if (!confirm("Uložit vybrané schopnosti?")) return;
    for (const sel of view.querySelectorAll("[data-schop]")) {
      try { await call("admin", { action: "hrac", data: { uid: $("#a-hrac").value, co: "schopnost", lvl: sel.dataset.schop, klic: sel.value } }); } catch { return; }
    }
    toast("Schopnosti uloženy."); render(); };
  const kk = $("#a-kick"); if (kk) kk.onclick = async () => { const jm = $("#a-hrac").selectedOptions[0].text.split(" · ")[0];
    if (!confirm(`Vyhodit ${jm} na ${$("#a-kick-h").value} h?`)) return;
    try { msg(await call("admin", { action: "kick", data: { uid: $("#a-hrac").value, hodiny: $("#a-kick-h").value, duvod: $("#a-kick-d").value } })); render(); } catch {} };
  const bn = $("#a-ban"); if (bn) bn.onclick = async () => { const jm = $("#a-hrac").selectedOptions[0].text.split(" · ")[0];
    if (!confirm(`Opravdu SMAZAT účet ${jm} a zakázat mu hru? Tohle nejde vrátit — postava zmizí úplně.`)) return;
    if (prompt(`Pro potvrzení napiš jméno postavy: ${jm}`) !== jm) { toast("Jméno nesouhlasí — nic se nestalo."); return; }
    try { msg(await call("admin", { action: "ban", data: { uid: $("#a-hrac").value, duvod: $("#a-ban-d").value } })); ADM.hrac = null; render(); } catch {} };
  view.querySelectorAll("[data-unban]").forEach((b) => b.onclick = async () => { try { msg(await call("admin", { action: "unban", data: { uid: b.dataset.unban } })); render(); } catch {} });
  view.querySelectorAll("[data-rychlost]").forEach((b) => b.onclick = async () => { const v = b.dataset.rychlost || $("#a-rych").value;
    try { msg(await call("admin", { action: "rychlost", data: { rychlost: v } })); await obnov(); } catch {} });
  const ait = $("#a-it"); if (ait) {
    const box = document.createElement("div"); box.className = "adm-it-nab"; ait.closest("label").after(box);
    const DR = r.predmety_druh || {};
    const ukaz = () => { const q = ait.value.trim().toLowerCase(); if (!q) { box.innerHTML = ""; return; }
      const nal = (r.predmety || []).filter((n) => n.toLowerCase().includes(q)).slice(0, 12);
      box.innerHTML = nal.map((n) => `<button type="button" class="adm-it-k" data-itn="${esc(n)}">${icon(n)}<span><b>${esc(n)}</b><small>${esc(DR[n] || "")}</small></span></button>`).join("") || `<p class="muted small">Nic takového.</p>`;
      box.querySelectorAll("[data-itn]").forEach((k) => k.onclick = () => { ait.value = k.dataset.itn; box.innerHTML = ""; });
      loadIcons(nal); };
    ait.oninput = ukaz;
  }
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
  view.querySelectorAll("[data-pk]").forEach((b) => b.onclick = () => { PRIR.k = Number(b.dataset.pk); render(); skrolNa(0); });
  const qi = $("#pr-q"); let tm;
  qi.oninput = () => { clearTimeout(tm); tm = setTimeout(() => { PRIR.q = qi.value; render(); const n = $("#pr-q"); if (n) { n.focus(); n.setSelectionRange(n.value.length, n.value.length); } }, 350); };
};

// r27-11: barevný štítek kusu (aby šlo poznat, který kus nasazuješ / prodáváš)
const barvaStitek = (barva, hx) => barva ? ` <span class="barva-kus" title="${esc(barva)}"><i${hx ? ` style="--b:${hx}"` : ` class="prirodni"`}></i>${esc(barva.toLowerCase())}</span>` : "";

// --- batoh
// r27-41: Zdroj světla — lucerna (palivo: svíce) nebo louč (svítí míň, dohoří za výpravu)
function svetloPanel(m) {
  const SV = m.svetlo || {}, eq = m.equipped || [];
  const luc = eq.find((e) => e.slot === "světlo"), louc = eq.find((e) => e.slot === "štít" && e.id === "Louč");
  const vlozit = Object.entries(SV.svice || {}).map(([n, q]) => `<button class="btn small" data-use="${esc(n)}"${q && SV.palivo + (SV.svice_vydrz[n] || 0) <= SV.max ? "" : " disabled"}>${esc("+ " + n.split(" ")[0].toLowerCase() + " (" + q + ")")}</button>`).join("");   // r27-42: kratší, ať se světlo vejde do jednoho řádku
  let obsah = "";
  if (luc) obsah += `<div class="item eq svetlo">${icon(luc.id)}<div><div class="nm">${esc(luc.name)} <span class="muted small">${esc(L(["· svítí nejlíp", "· brightest"]))}</span></div>
      <div class="palivo"><i style="width:${Math.min(100, 100 * SV.palivo / (SV.max || 5))}%"></i><span>${esc(SV.palivo ? L(["palivo ", "fuel "]) + SV.palivo + " / " + SV.max : L(["prázdná — vlož svíci", "empty — insert a candle"]))}</span></div>
      <div class="acts">${vlozit}<button class="btn small" data-unequip="${esc(luc.slot)}">${esc(t("unequip"))}</button></div></div></div>`;
  if (louc) obsah += `<div class="item eq svetlo">${icon(louc.id)}<div><div class="nm">${esc(louc.name)}${SV.louci > 1 ? ` <span class="muted">× ${SV.louci}</span>` : ""}</div>
      <div class="meta">${esc(L(["v ruce místo štítu · svítí míň (v podzemí −1) · dohoří za jednu výpravu · palivo nepotřebuje", "in hand · dimmer · burns out in one run"]))}</div>
      <div class="acts"><button class="btn small" data-unequip="štít">${esc(t("unequip"))}</button></div></div></div>`;
  if (!luc && !louc) {
    const muze = (m.inventory || []).filter((i) => i.id === "Lucerna" || i.id === "Louč");
    obsah = `<div class="empty">${esc(L(["Nesvítíš si. V noci a v podzemí bez světla hůř zasahuješ i hledáš.", "No light source."]))}</div>
      ${muze.map((i) => `<div class="row">${icon(i.id)} <button class="btn small" data-equip="${esc(i.id)}">${esc(L(["Nasadit ", "Equip "]) + i.name)}</button></div>`).join("")}`;
  }
  if (!luc && SV.ma_lucernu) obsah += `<p class="muted small">${esc(L(["Lucerna v batohu: palivo na ", "Lantern in pack: fuel "]) + SV.palivo + L([" výprav.", " runs."]))}</p>`;
  return `<div class="panel svetlo-panel"><div class="spread"><h3>${esc(L(["Zdroj světla", "Light source"]))}</h3></div><div class="items">${obsah}</div></div>`;
}
// r27-42: filtr v kapsách a batohu — Vše · Jídlo a lektvary · Nářadí a výbava · Zbraně a zbroj · Ostatní
const BF = { kapsy: "vse", batoh: "vse" };
const BF_DRUH = [["vse", ["Vše", "All"]], ["jidlo", ["Jídlo", "Food"]], ["naradi", ["Nářadí", "Tools"]], ["vystroj", ["Výzbroj", "Arms"]], ["jine", ["Ostatní", "Other"]]];
function druhVeci(i) {
  const sl = (i && i.slot) || "";
  if (/spotřební|jídlo|nápoj|lektvar/.test(sl)) return "jidlo";
  if (/nářadí|výbava|střelivo|světlo/.test(sl)) return "naradi";
  if (/zbraň|zbroj|hlava|štít|oděv|plášť/.test(sl)) return "vystroj";
  return "jine";
}
// volná místa jedním řádkem (ne deset prázdných řádků pod sebou)
const volnaMista = (n) => n > 0 ? `<div class="item volno souhrn"><span class="icon prazdne"></span><div class="muted">${esc(n === 1 ? L(["1 volné místo", "1 free slot"]) : n < 5 ? L([n + " volná místa", n + " free slots"]) : L([n + " volných míst", n + " free slots"]))}</div></div>` : "";
const filtruj = (k, seznam, row) => BF[k] === "vse" ? seznam : seznam.filter((x) => druhVeci(row[x[0]]) === BF[k]);
function filtrVeci(k, seznam, row) {
  if (!seznam.length) return "";
  const pocet = (d) => mist(d === "vse" ? seznam : seznam.filter((x) => druhVeci(row[x[0]]) === d));
  return `<div class="bf-filtr">${BF_DRUH.filter(([d]) => pocet(d)).map(([d, jm]) => `<button type="button" class="chip${BF[k] === d ? " on" : ""}" data-bf="${k}:${d}">${esc(L(jm))} <small>${pocet(d)}</small></button>`).join("")}</div>`;
}
// r27-42: opasek po pouzdrech — každé místo na opasku je záložka (Pouzdro 1, 2, 3…) s jednou věcí
function opasekZalozky(N, vec, prazdne, blok) {
  const max = Math.max(N.belt_max || 0, N.belt.length);
  if (!max) return blok(L(["Na opasku", "On the belt"]), "", `<div class="empty">${esc(L(["Nemáš opasek — kup ho u krejčího nebo vetešníka.", "No belt yet."]))}</div>`);
  const z = Math.min(S.opasekZal || 0, max - 1);
  const x = N.belt[z];
  const chips = Array.from({ length: max }, (_, i) => { const v = N.belt[i];
    return `<button type="button" class="chip${i === z ? " on" : ""}${v ? " ma" : ""}" data-opz="${i}">${esc(L(["Pouzdro ", "Holster "]) + (i + 1))}${v ? `<small>${esc((v[0] || "").split(" ")[0])}</small>` : ""}</button>`; }).join("");
  return `<div class="panel opasek-panel"><div class="spread"><h3>${esc(L(["Na opasku", "On the belt"]) + (N.belt_name ? " · " + N.belt_name : ""))}</h3><span class="pill">${N.belt.length} / ${N.belt_max}</span></div>
    <div class="vyb-zal opz" style="grid-template-columns:repeat(${max},1fr)">${chips}</div>
    <div class="items">${x ? vec(x, true) : prazdne(1)}</div></div>`;
}
// r27-42: Vybaveno po záložkách — Zbraň · Štít · Oblečení · Zbroj · Helma · Plášť; u každé to, co máš na sobě, a co z batohu jde nasadit
const VYB_SLOTY = [["zbraň", ["Zbraň", "Weapon"]], ["štít", ["Štít", "Shield"]], ["oděv", ["Oblečení", "Clothes"]], ["zbroj", ["Zbroj", "Armour"]], ["hlava", ["Helma", "Helmet"]], ["plášť", ["Plášť", "Cloak"]]];
function vybavenoZalozky(m, N, row, eqBez, vec) {
  const Z = S.vybZal || "zbraň";
  const na = (sl) => eqBez.find((e) => e.slot === sl);
  const e = na(Z);
  const nosene = e ? `<div class="item eq">${icon(e.id)}
      <div><div class="nm">${esc(e.name)}${e.enh ? ` <span class="muted">+${e.enh}</span>` : ""}${barvaStitek(e.color_name, e.color)}</div><div class="meta">${esc(e.slot_name)}</div>${statyHtml(e)}${opotrebeni(e)}</div>
      <div class="acts"><button class="btn small" data-unequip="${esc(e.slot)}">${esc(t("unequip"))}</button></div></div>`
    : `<div class="empty">${esc(L([{ "zbraň": "Bojuješ pěstmi.", "oděv": "Jen obyčejný oděv." }[Z] || "Nic nemáš nasazeno.", "Nothing equipped."]))}</div>`;
  const vBatohu = [...N.belt, ...N.pockets, ...N.backpack].filter((x) => row[x[0]] && row[x[0]].equip && row[x[0]].slot === Z && x[0] !== "Louč");
  return `<div class="panel vyb-panel"><div class="spread"><h3>${esc(t("equipped"))}</h3></div>
    <div class="vyb-zal">${VYB_SLOTY.map(([sl, jm]) => `<button type="button" class="chip${sl === Z ? " on" : ""}${na(sl) ? " ma" : ""}" data-vyb="${esc(sl)}">${esc(L(jm))}</button>`).join("")}</div>
    <div class="items">${nosene}
      ${vBatohu.length ? `<div class="sect vyb-sect">${esc(L(["V batohu — můžeš nasadit", "In your pack — can equip"]))}</div>${vBatohu.map((x) => vec(x)).join("")}` : ""}</div></div>`;
}
// 1.0-1: Batoh jako „panenka“ — postava s výbavou kolem, opasek, kapsy a batoh jako mřížky, vpravo (v mobilu zespodu) detail vybrané věci. Vše na jedné obrazovce.
/** 1.0-1-14: kolik míst zabírá seznam — kusy téže věci (lišící se jen zušlechtěním) leží na jednom místě. */
const mist = (seznam) => new Set((seznam || []).map((x) => x[0] + "|" + (x[2] || ""))).size;
const PAN_L = [["hlava", ["Helma", "Helmet"]], ["plášť", ["Plášť", "Cloak"]], ["zbroj", ["Zbroj", "Armour"]], ["oděv", ["Oděv", "Clothes"]]];
const PAN_P = [["zbraň", ["Zbraň", "Weapon"]], ["štít", ["Štít", "Shield"]], ["světlo", ["Světlo", "Light"]], ["opasek", ["Opasek", "Belt"]]];
VIEWS.bag = (view) => {
  const m = S.me, N = m.nosim || { pockets: [], backpack: [], belt: [], pockets_max: 5, backpack_max: 0, belt_max: 2 };
  const mob = jeMobil();
  const row = {}; m.inventory.forEach((i) => { row[i.id] = i; });
  const eq = {}; m.equipped.forEach((e) => { eq[e.slot] = e; });
  const louc = eq["štít"] && eq["štít"].id === "Louč";
  // výběr: {k: "eq"|"belt"|"pockets"|"backpack", i: index nebo slot}
  const najdi = (V) => {
    if (!V) return null;
    if (V.k === "eq") return eq[V.i] ? { k: "eq", e: eq[V.i] } : null;
    const x = (N[V.k] || [])[V.i]; return x && x[0] === V.id ? { k: V.k, x, i: row[x[0]] || { id: x[0], name: x[0], slot_name: "" } } : null;
  };
  let V = najdi(S.bagSel);
  if (!V && !mob) V = najdi({ k: "eq", i: "zbraň" }) || (N.pockets[0] && najdi({ k: "pockets", i: 0, id: N.pockets[0][0] })) || null;
  const jeVyb = (k, i) => V && V.k === k && (k === "eq" ? V.e.slot === i : V.x === (N[k] || [])[i]);
  const dl = (id, k, i, { q, wear, enh, prazdne, lbl, kus } = {}) => {
    const w = wear == null ? "" : `<i class="pn-stav ${wear <= 30 ? "zle" : wear <= 60 ? "stredni" : "dobre"}"><b style="width:${Math.max(0, wear)}%"></b></i>`;
    return id ? `<button type="button" class="pn-dl${jeVyb(k, i) ? " vyb" : ""}"${kusAttr({ kus })} data-pk="${k}" data-pi="${esc(String(i))}" data-pid="${esc(id)}" title="${esc((row[id] || {}).name || id)}">${icon(id)}${q > 1 ? `<span class="pn-q">${q}</span>` : ""}${enh ? `<span class="pn-enh">+${enh}</span>` : ""}${w}</button>`
      : `<span class="pn-dl prazdne">${lbl ? `<small>${esc(lbl)}</small>` : ""}</span>`;
  };
  const eqDl = ([sl, jm]) => {
    if (sl === "opasek") return `<div class="pn-slot">${N.belt_name ? `<span class="pn-dl jen">${icon(N.belt_name)}</span>` : `<span class="pn-dl prazdne"></span>`}<span class="pn-jm">${esc(L(jm))}</span></div>`;
    const e = sl === "světlo" ? (eq["světlo"] || (louc ? eq["štít"] : null)) : (sl === "štít" && louc ? null : eq[sl]);
    const jm2 = sl === "štít" && e && LEVA_RUKA.includes(e.id) ? ["Levá ruka", "Off hand"] : jm;   // 1.0-1-6: druhá dýka
    return `<div class="pn-slot">${e ? dl(e.id, "eq", e.slot, { wear: e.wear, enh: e.enh }) : `<span class="pn-dl prazdne"></span>`}<span class="pn-jm">${esc(L(jm2))}</span></div>`;
  };
  const opasek = N.belt_max ? Array.from({ length: Math.max(N.belt_max, N.belt.length) }, (_, i) => { const x = N.belt[i];
    return x ? dl(x[0], "belt", i, { q: x[1], wear: (row[x[0]] || {}).wear }) : dl(null, "", 0, { lbl: L(["Pouzdro ", "Holster "]) + (i + 1) }); }).join("")
    : `<span class="muted small">${esc(L(["Nemáš opasek — kup ho u krejčího nebo vetešníka.", "No belt yet."]))}</span>`;
  const mriz = (k, seznam, max) => {
    const vidim = k === "backpack" ? seznam.map((x, i) => [x, i]).filter(([x]) => BF.batoh === "vse" || druhVeci(row[x[0]]) === BF.batoh) : seznam.map((x, i) => [x, i]);
    const volno = (k !== "backpack" || BF.batoh === "vse") ? Math.max(0, max - mist(seznam)) : 0;
    return vidim.map(([x, i]) => dl(x[0], k, i, { q: x[1], wear: x[4] != null ? x[6] : (row[x[0]] || {}).wear, enh: x[5], kus: x[4] })).join("") + Array.from({ length: volno }, () => dl(null)).join("");
  };
  const batohF = N.backpack.length ? filtrVeci("batoh", N.backpack, row) : "";
  // detail vybrané věci
  let detail = `<p class="muted pn-nic">${esc(L(["Klepni na věc — tady uvidíš, co umí, a co s ní můžeš dělat.", "Tap an item to see details."]))}</p>`;
  if (V) {
    const it0 = V.k === "eq" ? V.e : V.i, id = it0.id;
    const it = V.x && V.x[4] != null ? { ...it0, enh: V.x[5], wear: V.x[6], enh_kusy: null } : it0;   // 1.0-1-14: vybraný konkrétní kus
    const x = V.x, q = x ? x[1] : 1, barva = x ? x[2] : it.color_name, hx = x ? x[3] : it.color;
    const tl = [];
    if (V.k === "eq") tl.push(`<button class="btn primary" data-unequip="${esc(V.e.slot)}">${esc(t("unequip"))}</button>`);
    else {
      if (it.use) tl.push(`<button class="btn primary" data-use="${esc(id)}">${esc(t("use"))}</button>`);
      if (it.equip) tl.push(`<button class="btn${it.use ? "" : " primary"}" data-equip="${esc(id)}"${barva ? ` data-barva="${esc(barva)}"` : ""}>${esc(t("equip"))}</button>`);
      { const hl = (eq["zbraň"] || {}).id;   // 1.0-1-6: boj dvěma zbraněmi — druhá do levé ruky
        if (LEVA_RUKA.includes(id) && PRAVA_S_LEVOU.includes(hl) && (hl !== id || q > 1 || (it.count || 0) > 1))
          tl.push(`<button class="btn" data-leva="${esc(id)}">${esc(L(["Do levé ruky", "Off hand"]))}</button>`); }
      if (V.k === "belt") tl.push(`<button class="btn" data-opasek="${esc(id)}" data-sundat="1">${esc(L(["Sundat do batohu", "To the backpack"]))}</button>`);
      if ((N.v_batohu || []).includes(id) && V.k !== "belt") tl.push(`<button class="btn" data-opasek="${esc(id)}" data-sundat="">${esc(L(["Na opasek", "Onto the belt"]))}</button>`);
    }
    const nas = V.k !== "eq" && it.equip && eq[it.slot] && eq[it.slot].id !== id ? eq[it.slot] : null;   // porovnání s tím, co máš na sobě
    const kde = { eq: L(["Máš na sobě", "Equipped"]), belt: L(["Na opasku", "On the belt"]), pockets: L(["V kapsách", "In pockets"]), backpack: L(["V batohu", "In the backpack"]) }[V.k];
    detail = `<div class="pn-det-kus"${V.x && V.x[4] != null ? kusAttr({ kus: V.x[4] }) : ""}><div class="pn-det-hl">${icon(id)}<div><div class="nm">${esc(it.name)}${q > 1 ? ` <span class="muted">× ${q}</span>` : ""}${it.enh ? ` <span class="muted">+${it.enh}${q > 1 && it.enh_kusy && it.enh_kusy.length < q ? L([` (zušlechtěno ${it.enh_kusy.length} z ${q})`, ` (${it.enh_kusy.length} of ${q} improved)`]) : ""}</span>` : ""}${barvaStitek(barva, hx)}</div>
        <div class="meta">${esc([it.slot_name, kde, it.merchant_name ? t("sell_to", it.merchant_name) : ""].filter(Boolean).join(" · "))}</div>${it.fx ? `<div class="meta"><b class="fx">${esc(it.fx)}</b></div>` : ""}</div></div>
      ${it.popis ? `<p class="pn-popis">${esc(it.popis)}</p>` : ""}
      ${it.k_cemu && it.k_cemu !== it.slot && it.k_cemu !== it.fx ? `<p class="pn-kcemu"><b>${esc(L(["K čemu je: ", "Use: "]))}</b>${esc(it.k_cemu)}</p>` : ""}
      ${statyHtml(it)}${opotrebeni(it)}
      ${tl.length ? `<div class="pn-tl">${tl.join("")}</div>` : ""}
      ${nas ? `<div class="pn-por"><span class="pn-por-t">${esc(L(["Teď máš na sobě", "Currently equipped"]))}</span><div class="pn-por-r">${icon(nas.id)}<b>${esc(nas.name)}</b></div>${statyHtml(nas)}</div>` : ""}
      ${(V.k === "eq" && (V.e.slot === "světlo" || id === "Louč")) ? svetloPanel(m) : ""}</div>`;
  }
  const zal = S.batohZal === "batoh" ? "batoh" : "kapsy";
  const figura = `<div class="pn-fig hero-fig live" data-img="mesto-pokoj" data-key="pokoj">${Postava.html(m, IMG_BASE)}</div>`;
  view.replaceChildren(h(`
    ${m.on_raid ? `<div class="panel notice pn-vyprava">🗺️ ${esc(t("on_raid"))}</div>` : ""}
    <div class="panenka${mob ? " pn-mob" : ""}${V && mob ? " s-detailem" : ""}">
      <section class="panel pn-vyb">
        <div class="pn-hl"><h3>${esc(L(["Vybaveno", "Equipped"]))}</h3><span class="pn-souhrn">${esc(L(["OČ ", "AC "]))}<b>${esc(m.armor_class)}</b> · ${esc(L(["Útok ", "Attack "]))}<b>${esc(m.damage || "")}</b></span></div>
        <div class="pn-panenka"><div class="pn-sl">${PAN_L.map(eqDl).join("")}</div>${figura}<div class="pn-sl">${PAN_P.map(eqDl).join("")}</div></div>
        <div class="pn-opasek"><span class="pn-lbl">${esc(L(["Opasek", "Belt"]))}${N.belt_max ? ` <small>${N.belt.length}/${N.belt_max}</small>` : ""}</span>${opasek}</div>
      </section>
      <section class="panel pn-nes">
        ${mob ? `<div class="m-zalozky pn-zal"><button class="${zal === "kapsy" ? "on" : ""}" data-bz="kapsy">${esc(L(["Kapsy", "Pockets"]))}<small>${mist(N.pockets)}/${N.pockets_max}</small></button><button class="${zal === "batoh" ? "on" : ""}" data-bz="batoh">${esc(N.bag_name || L(["Batoh", "Backpack"]))}<small>${mist(N.backpack)}/${N.backpack_max}</small></button></div>` : ""}
        <div class="pn-kont${mob && zal !== "kapsy" ? " skryt" : ""}"><div class="pn-hl"><h3>${esc(L(["Kapsy", "Pockets"]))}</h3><span class="pill">${mist(N.pockets)} / ${N.pockets_max}</span></div>
          <div class="pn-mriz">${mriz("pockets", N.pockets, N.pockets_max)}</div></div>
        <div class="pn-kont pn-batoh${mob && zal !== "batoh" ? " skryt" : ""}"><div class="pn-hl"><h3>${esc(N.bag_name || L(["Batoh", "Backpack"]))}</h3>${N.backpack_max ? `<span class="pill">${mist(N.backpack)} / ${N.backpack_max}</span>` : ""}</div>
          ${N.backpack_max ? `${batohF}<div class="pn-mriz">${mriz("backpack", N.backpack, N.backpack_max)}</div>` : `<div class="empty">${esc(L(["Nemáš batoh — kup ho u krejčího nebo vetešníka.", "No backpack yet."]))}</div>`}</div>
        ${mob ? "" : `<p class="pn-rada">${esc(L(["Klepni na věc · dvojklikem ji nasadíš nebo použiješ", "Click to select · double-click to equip or use"]))}</p>`}
      </section>
      <section class="panel pn-det${mob && S.pnSheet === "peek" ? " peek" : ""}">${mob ? `<div class="pn-uchop" aria-hidden="true"><i></i></div><button type="button" class="pn-zavrit" data-pzav aria-label="${esc(L(["Zavřít", "Close"]))}">✕</button>` : `<div class="pn-hl"><h3>${esc(L(["Vybraná věc", "Selected item"]))}</h3></div>`}${detail}</section>
    </div>`));
  vejdiDoOkna(".panenka", 420);
  view.querySelectorAll("[data-pk]").forEach((b) => {
    b.onclick = () => { const k = b.dataset.pk; S.bagSel = { k, i: k === "eq" ? b.dataset.pi : Number(b.dataset.pi), id: b.dataset.pid }; S.pnSheet = "full"; Zvuk.sfx("klik"); render(); };
    b.ondblclick = () => { const it = row[b.dataset.pid];
      if (b.dataset.pk === "eq") act("unequip", { slot: b.dataset.pi });
      else if (it && it.equip) act("equip", { item: it.id, color: "" });
      else if (it && it.use) act("use", { item: it.id }); };
  });
  view.querySelectorAll("[data-pzav]").forEach((b) => b.onclick = () => { S.bagSel = null; render(); });
  // 1.0-1: mobil — karta detailu se tahá prstem: nahoru celá, dolů jen hlavička, úplně dolů zmizí
  const sh = mob && view.querySelector(".pn-mob.s-detailem .pn-det");
  if (sh) {
    const PEEK = 118;
    let y0 = null, base = 0, dy = 0;
    const posun = (v) => { sh.style.transform = `translateY(${Math.max(0, v)}px)`; };
    const start = (e) => { if (e.target.closest("button, a, input")) return; y0 = e.clientY; dy = 0; base = sh.classList.contains("peek") ? sh.offsetHeight - PEEK : 0;
      sh.style.transition = "none"; sh.setPointerCapture && sh.setPointerCapture(e.pointerId); };
    const tah = (e) => { if (y0 == null) return; dy = e.clientY - y0; posun(base + dy); if (Math.abs(dy) > 4) e.preventDefault(); };
    const konec = () => { if (y0 == null) return; y0 = null; sh.style.transition = "";
      const v = base + dy, h = sh.offsetHeight;
      if (Math.abs(dy) < 6) { if (sh.classList.contains("peek")) { S.pnSheet = "full"; sh.classList.remove("peek"); } sh.style.transform = ""; return; }
      if (v > h - PEEK / 2) { sh.style.transform = `translateY(${h}px)`; setTimeout(() => { S.bagSel = null; S.pnSheet = "full"; render(); }, 180); return; }
      const peek = v > (h - PEEK) / 2; S.pnSheet = peek ? "peek" : "full"; sh.classList.toggle("peek", peek); sh.style.transform = ""; };
    sh.addEventListener("dragstart", (e) => e.preventDefault());
    sh.addEventListener("pointerdown", start); sh.addEventListener("pointermove", tah); sh.addEventListener("pointerup", konec); sh.addEventListener("pointercancel", konec);
  }
  view.querySelectorAll("[data-bz]").forEach((b) => b.onclick = () => { S.batohZal = b.dataset.bz; Zvuk.sfx("klik"); render(); });
  view.querySelectorAll("[data-bf]").forEach((b) => b.onclick = () => { const [k, d] = b.dataset.bf.split(":"); BF[k] = d; Zvuk.sfx("klik"); render(); });
  const act = (op, data, msg) => call(op, data).then((r) => { toast(msg ? msg(r) : t("done")); render(); }).catch(() => {});
  view.querySelectorAll("[data-unequip]").forEach((b) => b.onclick = () => act("unequip", { slot: b.dataset.unequip }));
  view.querySelectorAll("[data-equip]").forEach((b) => b.onclick = () => act("equip", { item: b.dataset.equip, color: b.dataset.barva || "" }));
  view.querySelectorAll("[data-leva]").forEach((b) => b.onclick = () => act("equip", { item: b.dataset.leva, color: "", leva: true }));
  view.querySelectorAll("[data-use]").forEach((b) => b.onclick = () => act("use", { item: b.dataset.use }));
  view.querySelectorAll("[data-opasek]").forEach((b) => b.onclick = () => act("opasek", { item: b.dataset.opasek, sundat: !!b.dataset.sundat },
    () => b.dataset.sundat ? L(["Sundáno do batohu.", "Moved to the backpack."]) : L(["Zpátky na opasku.", "Back on the belt."])));
  loadIcons([...m.inventory.map((i) => i.id), ...m.equipped.map((e) => e.id), ...(N.belt_name ? [N.belt_name] : [])]);
  mountLive(view, { still: true });
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
  listujDenik(box, "kron-" + KRON.sekce, "#kron-obsah");   // r27-41: i kroniky se listují po stranách
};

// r27-4: truhla v hostinci — vlevo co máš u sebe (Vložit), vpravo co je v truhle (Vzít); nájem a služby nahoře
VIEWS.truhla = async (view) => {
  let T; try { T = (await call("truhla", {}, true)).truhla; } catch { return; }
  const C = T.chest;
  // r27-35: u víc kusů posuvník — kolik přesunout (výchozí vše)
  const vec = (i, act, lbl, off) => `<div class="item"${kusAttr(i)}>${icon(i.id)}<div><div class="nm">${esc(i.name)}${kusTag(i)}${i.count > 1 ? ` <span class="muted">× ${i.count}</span>` : ""}</div>
      ${i.count > 1 && !off ? `<label class="kolik"><input type="range" min="1" max="${i.count}" value="${i.count}" data-kolik><b>${i.count}</b></label>` : ""}</div>
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
          ${truhlaFiltr(T.carried)}<div class="items">${T.carried.length ? T.carried.filter((i) => !BF.truhla || BF.truhla === "vse" || druhVeci(i) === BF.truhla).map((i) => vec(i, "put", L(["Vložit", "Put in"]), C.debt || (plno && !C.items.some((x) => x.id === i.id)))).join("") : `<div class="empty">${esc(L(["Nic u sebe nemáš.", "Nothing carried."]))}</div>`}</div></div>
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
  view.querySelectorAll("[data-kolik]").forEach((r) => r.oninput = () => { r.nextElementSibling.textContent = r.value; });
  view.querySelectorAll("[data-tr]").forEach((b) => b.onclick = () => { const r = b.closest(".item").querySelector("[data-kolik]");
    const q = kolikRadek(b); klik("ks:innchest:" + b.dataset.tr, r || q ? [b.dataset.v, String(q)] : [b.dataset.v], b); });
  view.querySelectorAll("[data-cid]").forEach((b) => b.onclick = () => klik(b.dataset.cid, [], b));
  loadIcons([...T.carried, ...(C ? C.items : [])].map((i) => i.id));
  view.querySelectorAll("[data-tf]").forEach((b) => b.onclick = () => { BF.truhla = b.dataset.tf; Zvuk.sfx("klik"); render(); });
  vejdiObchod(".truhla-sloupce .items");                // 1.0-1: bez posouvání stránky — posouvá se jen seznam
};
// 1.0-1: filtr věcí u sebe (truhla v hostinci)
function truhlaFiltr(seznam) {
  if (seznam.length < 5) return "";
  const n = (d) => d === "vse" ? seznam.length : seznam.filter((i) => druhVeci(i) === d).length;
  const akt = BF.truhla && n(BF.truhla) ? BF.truhla : "vse";
  return `<div class="bf-filtr">${BF_DRUH.filter(([d]) => n(d)).map(([d, jm]) => `<button type="button" class="chip${akt === d ? " on" : ""}" data-tf="${d}">${esc(L(jm))} <small>${n(d)}</small></button>`).join("")}</div>`;
}

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
  // 1.0-2: obnova (každé 2–3 s) přepíše jen to, co se opravdu změnilo — obrázky a postavy zůstanou (na telefonu blikaly)
  const tpl = document.createElement("template"); tpl.innerHTML = html;
  if (box._ksSrc && box.childNodes.length === box._ksSrc.childNodes.length) morphDom(box, box._ksSrc, tpl.content);
  else box.replaceChildren(tpl.content.cloneNode(true));
  box._ksSrc = tpl.content;
  return true;
}
/** Zarovná živé DOM (postavené ze staré předlohy) na novou předlohu; nezměněné uzly nechá být (i s tím, co do nich dokreslil skript). */
function morphDom(live, stary, novy) {
  const L = [...live.childNodes], O = [...stary.childNodes], N = [...novy.childNodes];
  if (L.length !== O.length || O.length !== N.length) { live.replaceChildren(...N.map((n) => n.cloneNode(true))); return; }
  for (let i = 0; i < N.length; i++) {
    const o = O[i], n = N[i], l = L[i];
    if (o.isEqualNode(n)) continue;
    // plátno postavy má při každém vykreslení nové id — když se vrstvy (sourozenec .pas) nezměnily, nakreslená postava zůstane
    if (o.nodeName === "CANVAS" && n.nodeName === "CANVAS" && n.classList.contains("figura-platno") && l.nodeName === "CANVAS"
        && o.previousElementSibling && n.previousElementSibling && o.previousElementSibling.isEqualNode(n.previousElementSibling)) continue;
    if (o.nodeType === 3 && n.nodeType === 3) { l.nodeValue = n.nodeValue; continue; }
    if (o.nodeType === 1 && n.nodeType === 1 && o.tagName === n.tagName && l.nodeType === 1 && l.tagName === o.tagName
        && !["INPUT", "SELECT", "TEXTAREA", "CANVAS", "IMG"].includes(n.tagName)) {
      for (const at of [...o.attributes]) if (!n.hasAttribute(at.name)) l.removeAttribute(at.name);
      for (const at of [...n.attributes]) if (o.getAttribute(at.name) !== at.value) l.setAttribute(at.name, at.value);
      morphDom(l, o, n);
      continue;
    }
    if (n.nodeName === "CANVAS" && n.classList.contains("figura-platno") && l.previousElementSibling) l.previousElementSibling.style.visibility = "";   // vrstvy znovu vidět, než se plátno překreslí
    l.replaceWith(n.cloneNode(true));
  }
}
/** r27-28: seznam hráčů ve hře v pravé části hospodských řečí — stejná výška jako zprávy, posouvá se svisle. */
function onlineHtml(lidi) {
  if (!lidi) return "";
  const jm = lidi.map((p) => `<li class="${p.ja ? "ja" : ""}" title="${esc(L(["úroveň", "level"]))} ${p.level}">${esc(p.name)}</li>`).join("");
  return `<div class="chat-online"><b>● ${esc(L(["Ve hře", "Online"]))} ${lidi.length}</b><ul>${jm}</ul></div>`;
}
function chatHtml(room, msgs, online) {
  const hospoda = room === "hostinec", druzina = room.startsWith("kampan:");   // 1.0-3: domluva skupiny v dobrodružství
  return `<div class="chat${hospoda ? " hospoda" : ""}${druzina ? " druzina" : ""}" data-room="${esc(room)}"><div class="chat-h">${esc(hospoda ? L(["Hospodské řeči", "Tavern talk"]) : druzina ? L(["Domluva skupiny", "Party talk"]) : L(["Pokřik z hlediště", "Shouts from the stands"]))}<small>${esc(L(["zprávy po hodině zmizí", "messages vanish after an hour"]))}</small></div>
    ${hospoda ? `<div class="chat-telo"><ul class="chat-list">${chatListHtml(room, msgs)}</ul>${onlineHtml(online)}</div>` : `<ul class="chat-list">${chatListHtml(room, msgs)}</ul>`}
    <form class="chat-form"><input maxlength="200" placeholder="${esc(hospoda ? L(["Řekni něco ke stolu…", "Say something…"]) : druzina ? L(["Domluvte se — kdo co vidí, kdo kam jde…", "Talk to your party…"]) : L(["Fanděj, hecuj, sázej…", "Cheer, jeer, bet…"]))}" value="${esc(CHAT.draft[room] || "")}"><button class="btn small primary">${esc(hospoda ? L(["Říct", "Say"]) : druzina ? L(["Říct", "Say"]) : L(["Zakřičet", "Shout"]))}</button></form></div>`;
}
// hospodské řeči: obnova každé 4 s, jen dokud je hráč v lokálu
const HOSPODA = { timer: null };
async function hospodaKresli() {
  const box = document.getElementById("hospoda-reci");
  if (!box || S.tab !== "misto" || S.arg !== "hostinec") { clearInterval(HOSPODA.timer); return; }
  let r; try { r = await call("chat", { room: "hostinec" }, true); } catch { return; }
  if (!chatRebuild(box, chatHtml("hostinec", r.chat, r.online), { hostinec: r.chat })) {
    const ol = box.querySelector(".chat-online"), nove = onlineHtml(r.online);   // píše se — obnoví se aspoň řádek „ve hře“
    if (ol && nove && ol.outerHTML !== nove) { const top = ol.querySelector("ul").scrollTop; ol.outerHTML = nove; box.querySelector(".chat-online ul").scrollTop = top; }
    hospodaVyska(); return;
  }
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
  const ol = box.querySelector(".chat-online");                  // r27-28: sloupec „ve hře“ nesmí okno natáhnout
  if (ol) ol.style.height = ol.style.maxHeight = v + "px";
  const view = $("#view"), navic = view ? view.scrollHeight - view.clientHeight : 0;   // r27-41: stránka se neposouvá — řeči ustoupí
  if (navic > 0 && !document.documentElement.classList.contains("mobil")) {
    const v2 = Math.max(40, v - navic - 2);
    list.style.height = list.style.maxHeight = list.style.minHeight = v2 + "px";
    if (ol) ol.style.height = ol.style.maxHeight = v2 + "px";
    view.scrollTop = 0;
  }
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
          <div class="items">${r.repair.length ? r.repair.map((i) => `<div class="item"${kusAttr(i)}>${icon(i.id)}
            <div><div class="nm">${esc(i.name)}${i.equipped ? `<span class="tag ok">${esc(L(["nasazené", "worn"]))}</span>` : ""}${i.wear <= 0 ? `<span class="tag zle" title="${esc(L(["Rozbitá věc — oprava stojí trojnásobek její ceny.", "Broken — repair costs 3× the price."]))}">${esc(L(["3× cena", "3× price"]))}</span>` : ""}</div>${opotrebeni(i)}</div>
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
      toast(x.povedlo ? L([`Povedlo se: +${x.level}!`, `Success: +${x.level}!`]) : L(["Nepovedlo se, groše propadly.", "Failed, the coins are gone."])); po(x); }).catch(() => { b.disabled = false; }); });
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
const ZVER_ZAL = { k: "" };
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
  // 1.0-1: záložky podle velikosti — bez posouvání stránky
  const ZDRUH = [["male", L(["Malé", "Small"]), ["Myš", "Kočka", "Fretka", "Ochočená liška"]], ["stredni", L(["Střední", "Medium"]), ["Pes", "Honicí pes", "Válečný pes"]],
    ["velke", L(["Velké", "Large"]), ["Cvičený medvěd", "Mula"]], ["ptaci", L(["Ptáci", "Birds"]), ["Havran", "Sokol", "Sova"]]];
  const druhOf = (k) => (ZDRUH.find((d) => d[2].includes(k)) || ZDRUH[0])[0];
  const kresli = () => {
    const zal = ZVER_ZAL.k || "male";
    const vidim = r.zvirata.filter((z) => druhOf(z.kind) === zal);
    box.innerHTML = `<div class="vz-druh zver-zal">${ZDRUH.map(([k, n]) => `<button type="button" class="chip${zal === k ? " on" : ""}" data-zz="${k}">${esc(n)}</button>`).join("")}</div>
    <div class="zver-mriz">${vidim.map((z) => {
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
    box.querySelectorAll("[data-zz]").forEach((b) => b.onclick = () => { ZVER_ZAL.k = b.dataset.zz; Zvuk.sfx("stranka"); kresli(); });
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
    <p class="muted small">${esc(L([`„Ve hře“ = hrál v posledních ${D.online_min} minutách.`, `"In game" = played in the last ${D.online_min} minutes.`]))}</p></div>`;
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
          <footer>${esc(L(["Strhává se každý herní týden (≈ 28 hodin) z kapsy, a když nestačí, ze směnárny.", "Taken every game week (≈ 28 h) from your purse, then from the bank."]))}</footer>
        </section>
        <aside class="vyd-bok">
          <div class="vyd-karta"><small>${esc(L(["Příští platba", "Next payment"]))}</small><b>${esc(L(["za ", "in "]) + za(V.next))}</b>
            <p class="${dost ? "" : "vyd-pozor"}">${esc(L(["Kapsa ", "Purse "]) + V.coins + L([" gr. · směnárna ", " gr. · bank "]) + V.bank + " gr.")}${dost ? "" : `<br>${esc(L(["Na platbu ti nezbývá — vznikne dluh.", "Not enough — a debt will arise."]))}`}</p></div>
          <div class="vyd-karta"><small>${esc(L(["Desátek za roční období", "Seasonal tithe"]))}</small><b>${V.tithe} gr.</b>
            <p>${esc(L(["Podle úrovně a majetku, vybírá se za ", "By level and wealth, collected in "]) + za(V.tithe_at) + L([". Úschovné ve směnárně ", ". Bank fee "]) + V.bank_fee + " %.")}</p></div>
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
    vejdiObchod(".napoje .truhla-sloupce .items, .napoje .hoste");   // r27-41: stránka se neposouvá, jen seznam nápojů
    box.querySelectorAll("[data-host]").forEach((b) => b.onclick = () => { host = b.dataset.host; kresli(); });
    box.querySelectorAll("[data-pij]").forEach((b) => b.onclick = () => {
      b.disabled = true;
      call("napit", { drink: b.dataset.pij, target: host || null }).then((x) => {
        Zvuk.sfx("mince");
        toast(x.pending ? L([`Pozvání pro ${x.guest} odešlo — zaplatíš, až ho přijme.`, `Invitation sent to ${x.guest}.`]) : x.treat ? L([`${x.guest} si připíjí ${x.drink.toLowerCase()} na tvůj účet.`, `${x.guest} drinks on you.`]) : L([`Na zdraví! Opilost ${x.level} %`, `Cheers! Drunkenness ${x.level} %`]) + (x.stage && !x.treat ? " · " + x.stage : ""));
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
        ${d.betting && d.fighting ? `<p class="muted small">${esc(L(["Bojuješ v tomhle souboji — sám na sebe nesázíš.", "You are fighting in this duel."]))}</p>` : ""}
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
/** r27-31: mazlíček na PC — jeden panel na zvíře (obraz vlevo, vše o něm vpravo) a dole přepínač mezi vlastními zvířaty. Bez posouvání stránky. */
// r27-41: okénko s popisem (účinky, schopnosti mazlíčka…) — prvky s data-tip-n / data-tip-t / data-tip-s
function tipy(root) {
  root.querySelectorAll("[data-tip-n]").forEach((b) => {
    if (b._tip) return; b._tip = true;
    const ukaz = () => {
      let tip = $("#uc-tip"); if (!tip) { tip = document.createElement("div"); tip.id = "uc-tip"; document.body.appendChild(tip); }
      tip.className = b.classList.contains("postih") ? "postih" : "bonus";
      tip.innerHTML = `<b>${esc(b.dataset.tipN)}</b>${b.dataset.tipT ? `<p>${esc(b.dataset.tipT)}</p>` : ""}${b.dataset.tipS ? `<small>${esc(b.dataset.tipS)}</small>` : ""}`;
      const r = b.getBoundingClientRect(); tip.hidden = false;
      const w = tip.offsetWidth, hh = tip.offsetHeight;
      tip.style.left = Math.max(8, Math.min(innerWidth - w - 8, r.left + r.width / 2 - w / 2)) + "px";
      tip.style.top = (r.bottom + hh + 12 > innerHeight ? r.top - hh - 8 : r.bottom + 8) + "px";
    };
    const skryj = () => { const tip = $("#uc-tip"); if (tip) tip.hidden = true; };
    b.addEventListener("mouseenter", ukaz); b.addEventListener("focus", ukaz);
    b.addEventListener("mouseleave", skryj); b.addEventListener("blur", skryj);
    b.addEventListener("click", (e) => { e.stopPropagation(); ukaz(); });
  });
}
document.addEventListener("click", (e) => { const tip = $("#uc-tip"); if (tip && !tip.hidden && !e.target.closest("[data-tip-n]")) tip.hidden = true; });   // 1.0-3-15: klepnutí jinam popisek zavře
const PETV = { kind: null };
function petPc(view, Z, A, obr) {
  const Zs = Z.filter((z) => !z.druhy || z === A).concat(Z.filter((z) => z.druhy && z !== A));
  const V = Z.find((z) => z.kind === PETV.kind) || A;
  const s = (V.rank || 0), RANKY = ["nezkušený", "učenlivý", "ostřílený", "zkušený"];
  const sSebou = V.active || V.druhy;
  const ne = V === A || V.druhy ? "" : petNeSpolu(A.kind, V.kind);
  const pruh = (n, v, c, obracene) => `<div class="pp-bar"><span>${esc(n)}</span><div class="track"><div class="fill ${c}${(obracene ? v > 80 : v < 20) ? " nizko" : ""}" style="width:${v}%"></div></div><b>${v}</b></div>`;
  const ihelp = (t) => `<button type="button" class="pet-i" data-pethelp="${esc(t)}" title="${esc(t)}">ⓘ</button>`;
  setTimeout(() => postavNaZem(view.querySelector(".pet-zvire")), 0);
  setTimeout(() => vejdiDoOkna(".pet-pc", 420), 0);   // r27-40
  view.replaceChildren(h(`<div class="pet-pc">
    <div class="pet-pc-karta">
      <div class="pet-fig live" data-img="mesto-zverinec"><div class="pet-zvire${V.hungry ? " hlad" : ""}">${obr(V)}</div>
        ${V.vek ? `<div class="pet-vek${V.stary ? " stary" : ""}"><small>${esc(L(["Věk", "Age"]))}</small><b>${esc(V.vek)}</b></div>` : ""}</div>
      <div class="pet-pc-info panel">
        <div class="pp-hlava"><div><h2>${esc(V.name)}</h2><p>${esc(V.kind)} · ${esc(V.stage_name)}${V.vek ? " · " + esc(V.vek) : ""} · ${esc(L(["výpravy ", "runs "]) + (V.runs || 0))}</p></div>
          <span class="pill gold">${esc(V.rank_name || V.stage_name)}</span></div>
        ${V.active ? `<div class="nast-seg pet-doma maly"><button class="${V.doma ? "" : "on"}" data-doma="0">${esc(L(["Na výpravy", "Takes along"]))}</button><button class="${V.doma ? "on" : ""}" data-doma="1">${esc(L(["Nechá doma", "Leaves home"]))}</button></div>`
          : V.druhy ? `<div class="row"><span class="pill">${esc(L(["jde s tebou (druhé zvíře)", "with you (second)"]))}</span><button class="btn small" data-solo="1">${esc(L(["Nechat doma", "Leave home"]))}</button></div>`
          : `<div class="row"><button class="btn primary" data-vzit="${esc(V.kind)}">${esc(ne ? L(["Vzít místo ", "Take instead of "]) + A.name : L(["Vzít s sebou", "Take along"]))}</button>${ne ? `<small class="muted">${esc(ne)}</small>` : ""}</div>`}
        ${V.hungry ? `<p class="upozorneni ne">${esc(L(["Hladoví — nezaplacené krmení (Rychtář → Výdaje).", "Hungry — unpaid feed."]))}</p>` : ""}
        <div class="pp-sekce"><h3>${esc(L(["Zkušenost", "Experience"]))}${ihelp(L(["Vzhled se mění s věkem. Zkušenost roste jen výpravami, na které ho vezmeš: nezkušený (bonus z poloviny), učenlivý po 5 výpravách (70 %), ostřílený po 15 (celý bonus), zkušený po 30 (ještě víc).", "Experience grows only on expeditions."]))}</h3>
          <div class="stupne">${RANKY.map((w, i) => `<span class="${i <= s ? "on" : ""}${i === s ? " ted" : ""}">${esc(w)}</span>`).join("")}</div>
          ${V.rank_dalsi ? `<div class="pp-bar"><span>${esc(L(["do stupně ", "to "]) + RANKY[s + 1])}</span><div class="track"><div class="fill xp" style="width:${Math.min(100, 100 * Math.max(0, V.rank_dalsi[0]) / V.rank_dalsi[1])}%"></div></div><b>${Math.max(0, V.rank_dalsi[0])}/${V.rank_dalsi[1]}</b></div>` : ""}</div>
        <div class="pp-sekce"><h3>${esc(L(["Jak se má", "How it's doing"]))}${ihelp(L(["Hlad roste o 1 a spokojenost opadá o půl bodu za hodinu hraní. Když nehraješ, čas pro zvíře stojí. Hladové (hlad nad 80) nebo smutné zvíře (spokojenost pod 20) nedává bonusy a ubývá mu zdraví; když zdraví dojde, uhyne. Opečovanému se zdraví vrací.", "Needs drop only while you play."]))}</h3>
          ${pruh(L(["Zdraví", "Health"]), V.zdravi ?? 100, "hp")}${pruh(L(["Hlad", "Hunger"]), Math.max(0, 100 - V.sytost), "food", true)}${pruh(L(["Spokojenost", "Content"]), V.spokojenost, "mood")}
          ${V.napul ? `<p class="upozorneni ne">${esc(L(["Hladové nebo smutné zvíře nedává bonusy.", "A hungry or sad animal gives no bonuses."]))}</p>` : ""}
          ${V.umira != null ? `<p class="upozorneni ne"><b>${esc(L([`Strádá — bez péče uhyne asi za ${V.umira} h hraní.`, `Will die in about ${V.umira} h.`]))}</b></p>` : ""}
          <div class="row pet-akce"><button class="btn primary" data-krmit="">${esc(L(["Nakrmit (3 gr.)", "Feed (3 gr.)"]))}</button>
            ${(V.foods || []).map(([f, n]) => `<button class="btn" data-krmit="${esc(f)}">${esc(L(["Dát: ", "Give: "]) + f)} <small>×${n}</small></button>`).join("")}
            <button class="btn" data-mazlit>${esc(L(["Pomazlit se", "Cuddle"]))}</button>
            <button class="btn danger" data-prodat>${esc(L(["Prodat · ", "Sell · "]) + (V.prodej || 0) + " gr.")}</button></div></div>
        <div class="pp-sekce"><h3>${esc(L(["Schopnosti", "Abilities"]))}</h3>
          <div class="pet-schopnosti">
            <button type="button" class="pet-sch hlavni" data-tip-n="${esc(V.bonus)}" data-tip-t="${esc(V.desc + (s < 3 ? " " + L(["Jako zkušený: ", "As veteran: "]) + V.full_bonus + "." : ""))}" data-tip-s="${esc(L(["schopnost druhu · roste se zkušeností", "species ability"]))}">★ ${esc(V.bonus)}</button>
            ${(V.vlastnosti || []).map((v) => { const mm = /^(.*?)\s*\((.*)\)\s*$/.exec(v) || [0, v, ""]; return `<button type="button" class="pet-sch" data-tip-n="${esc(mm[1])}" data-tip-t="${esc(mm[2])}" data-tip-s="${esc(L(["naučil se na výpravách", "learned on expeditions"]))}">${esc(mm[1])}</button>`; }).join("")}
            ${s < 3 ? `<span class="pet-sch zamceno" data-tip-n="${esc(L(["Další vlastnost", "Next trait"]))}" data-tip-t="${esc(L(["Na každém stupni zkušenosti se naučí jednu náhodnou vlastnost svého druhu.", "Learns a random trait at each stage."]))}" tabindex="0">+ ?</span>` : ""}
          </div></div>
      </div>
    </div>
    ${Z.length > 1 ? `<nav class="pet-prepinac">${Zs.map((z) => `<button type="button" class="${z === V ? "on" : ""}" data-ukaz="${esc(z.kind)}">${obr(z)}<span><b>${esc(z.name)}</b><small>${esc(z.kind)}${z.active || z.druhy ? " · " + esc(L(["s tebou", "with you"])) : ""}</small></span></button>`).join("")}</nav>` : ""}
  </div>`));
  mountLive(view, { still: true });
  tipy(view);                                                   // r27-41: popisky schopností v okénku
  const zv = (data, msg) => call("zvire", { kind: V.kind, ...data }).then(() => { Zvuk.sfx("klik"); toast(msg); render(); }).catch(() => {});
  view.querySelectorAll("[data-ukaz]").forEach((b) => b.onclick = () => { PETV.kind = b.dataset.ukaz; render(); });
  view.querySelectorAll("[data-doma]").forEach((b) => b.onclick = () => zv({ act: "doma", doma: b.dataset.doma === "1" }, b.dataset.doma === "1" ? L(["Zůstane doma.", "Stays home."]) : L(["Půjde s tebou na výpravy.", "Joins your expeditions."])));
  const pr = view.querySelector("[data-prodat]");
  if (pr) pr.onclick = () => { if (confirm(L([`Opravdu prodat ${V.name} do zvěřince za ${V.prodej} gr.? Zvíře už nevrátíš.`, `Sell ${V.name} for ${V.prodej} gr.?`]))) call("zvire", { kind: V.kind, act: "prodat" }).then((r) => { Zvuk.sfx("mince"); toast(L([`Prodáno za ${r.price} gr.`, `Sold for ${r.price} gr.`])); PETV.kind = null; render(); }).catch(() => {}); };
  view.querySelectorAll("[data-krmit]").forEach((b) => b.onclick = () => { b.disabled = true; zv({ act: "krmit", food: b.dataset.krmit || null }, L([`${V.name} se pustil(a) do jídla.`, `${V.name} eats.`])); });
  const mz = view.querySelector("[data-mazlit]");
  if (mz) mz.onclick = () => { mz.disabled = true; zv({ act: "pomazlit" }, L([`${V.name} spokojeně vrní.`, `${V.name} is pleased.`])); };
  const so = view.querySelector("[data-solo]");
  if (so) so.onclick = async () => { so.disabled = true; try { await call("raid_click", { id: "ks:pet:solo" }); await call("me"); toast(L(["Zůstane doma.", "Stays home."])); render(); } catch { so.disabled = false; } };
  view.querySelectorAll("[data-vzit]").forEach((b) => b.onclick = async () => {
    b.disabled = true;
    try { await call("raid_click", { id: "ks:pet:set", values: [b.dataset.vzit] }); await call("me"); toast(L(["Vzal sis ", "Now with you: "]) + b.dataset.vzit); render(); }
    catch { b.disabled = false; }
  });
  view.querySelectorAll("[data-pethelp]").forEach((b) => b.onclick = (e) => {
    e.stopPropagation();
    const o = document.createElement("div");
    o.className = "rekap-obal vysv-obal";
    o.innerHTML = `<div class="rekap vyp-pergamen vysv"><p>${esc(b.dataset.pethelp)}</p><div class="row" style="justify-content:center;margin-top:12px"><button class="btn primary" data-ok>${esc(L(["Zavřít", "Close"]))}</button></div></div>`;
    o.onclick = (ev) => { if (ev.target === o || ev.target.closest("[data-ok]")) o.remove(); };
    document.body.appendChild(o);
  });
}
VIEWS.pet = (view) => {
  const Z = S.me.zvirata || [], A = Z.find((z) => z.active) || Z[0];
  const obr = (z) => IMG("bytosti/zvire-" + (ZVIRE_SLUG[z.kind] || Postava.slug(z.kind)) + "-" + z.stage);
  const PRAH = [7, 21];
  if (A && !jeMobil() && innerWidth >= 1100) return petPc(view, Z, A, obr);
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
  const ihelp = (t) => `<button type="button" class="pet-i" data-pethelp="${esc(t)}" title="${esc(t)}">ⓘ</button>`;   // r27-31: na PC nápověda v okénku
  const H_POTR = L(["Hlad roste o 1 a spokojenost opadá o půl bodu za hodinu hraní. Když nehraješ, čas pro zvíře stojí. Hladové (hlad nad 80) nebo smutné zvíře (spokojenost pod 20) nedává bonusy a ubývá mu zdraví; když zdraví dojde, uhyne a pohřbí se na hřbitově zvířátek. Opečovanému se zdraví vrací.", "Needs drop only while you play. A neglected animal gives no bonus and may die."]);
  const H_STAT = L(["Vzhled se mění s věkem zvířete. Zkušenost roste jen výpravami, na které ho vezmeš: nezkušený (bonus z poloviny), učenlivý po 5 výpravách (70 %), ostřílený po 15 (celý bonus), zkušený po 30 (ještě o kus víc).", "Looks change with age. Experience grows only on expeditions."]);
  const H_DALSI = L(["S sebou smíš mít nejvýš dvě zvířata, každé z jiné třídy (ptáci, psovité, kočka, fretka, myš, medvěd, mula). Myš nejde s ptákem, kočkou, fretkou ani liškou, medvěd ne s mulou.", "Up to two companions, each of a different class."]);
  view.replaceChildren(h(`<div class="pet-rozlozeni">
    <div class="grid pet-grid">
      <div class="pet-fig-obal"><div class="pet-fig live" data-img="mesto-zverinec"><div class="pet-zvire${A.hungry ? " hlad" : ""}">${obr(A)}</div></div>
        ${A.vek ? `<div class="pet-vek${A.stary ? " stary" : ""}"><small>${esc(L(["Věk", "Age"]))}</small><b>${esc(A.vek)}</b>${A.stary ? `<em>${esc(L(["v letech", "old"]))}</em>` : ""}</div>` : ""}</div>
      <div class="grid pet-panely">
        <div class="panel pet-hlava">
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
        <div class="panel pet-potreby"><h3>${esc(L(["Jak se má", "How it's doing"]))}${ihelp(H_POTR)}</h3>
          ${[[L(["Zdraví", "Health"]), A.zdravi ?? 100, "hp"], [L(["Hlad", "Hunger"]), Math.max(0, 100 - A.sytost), "food", true], [L(["Spokojenost", "Content"]), A.spokojenost, "mood"]].map(([n, v, c, obr]) => `<div class="bar"><div class="spread"><span>${esc(n)}</span><span class="muted">${v} / 100</span></div>
            <div class="track"><div class="fill ${c}${(obr ? v > 80 : v < 20) ? " nizko" : ""}" style="width:${v}%"></div></div></div>`).join("")}
          ${A.napul ? `<p class="upozorneni ne">${esc(L(["Hladové nebo smutné zvíře nedává žádné bonusy. Nakrm ho a pomazli se s ním.", "A hungry or sad animal gives no bonuses."]))}</p>` : ""}
          ${A.pece < 1 ? `<p class="upozorneni">${esc(A.pece ? L(["Zvíře roste napůl rychle — chce víc jídla a mazlení (obojí aspoň 50).", "Grows at half speed — feed and cuddle it more."]) : L(["Zanedbané zvíře neroste.", "A neglected animal doesn't grow."]))}</p>` : ""}
          ${A.umira != null ? `<p class="upozorneni ne"><b>${esc(L([`Zvíře strádá — bez péče uhyne asi za ${A.umira} h hraní.`, `Neglected — it will die in about ${A.umira} h of play.`]))}</b></p>` : ""}
          <div class="row pet-akce"><button class="btn primary" data-krmit="">${esc(L(["Nakrmit (3 gr.)", "Feed (3 gr.)"]))}</button>
            ${(A.foods || []).map(([f, n]) => `<button class="btn" data-krmit="${esc(f)}">${esc(L(["Dát: ", "Give: "]) + f)} <small>×${n}</small></button>`).join("")}
            <button class="btn" data-mazlit>${esc(L(["Pomazlit se", "Cuddle"]))}</button>
            <button class="btn danger" data-prodat>${esc(L(["Prodat do zvěřince · ", "Sell · "]) + (A.prodej || 0) + " gr.")}</button></div>
          <p class="muted small pet-help">${esc(H_POTR)}</p>
        </div>
        <div class="panel pet-schop"><h3>${esc(L(["Schopnost", "Ability"]))}</h3>
          <p class="pet-bonus">${esc(A.bonus)}</p>
          <p>${esc(A.desc)}</p>
          ${(A.vlastnosti || []).length ? `<div class="pet-vlastnosti"><small>${esc(L(["Naučil se na výpravách", "Learned on expeditions"]))}</small>${A.vlastnosti.map((v) => `<span>${esc(v)}</span>`).join("")}</div>` : `<p class="muted small">${esc(L(["Na každém stupni zkušenosti se naučí jednu náhodnou vlastnost svého druhu.", "Learns a random trait at each experience stage."]))}</p>`}
          ${(A.rank || 0) < 3 ? `<p class="muted small">${esc(L(["Jako zkušený: ", "As veteran: "]) + A.full_bonus)}</p>` : ""}
        </div>
        <div class="panel pet-staty"><h3>${esc(L(["Staty", "Stats"]))}${ihelp(H_STAT)}</h3>
          <div class="bojstaty">
            <div><small>${esc(L(["Vzhled", "Look"]))}</small><b>${esc(A.stage_name)}</b></div>
            <div><small>${esc(L(["Věk", "Age"]))}</small><b>${esc(A.vek || "—")}</b></div>
            <div><small>${esc(L(["Zkušenost", "Experience"]))}</small><b>${esc(A.rank_name || "")}</b></div>
            <div><small>${esc(L(["Výpravy", "Runs"]))}</small><b>${esc(A.runs)}</b></div>
          </div>
          <p class="muted small pet-help">${esc(H_STAT)}</p>
        </div>
      </div>
    </div>
    ${Z.length > 1 ? `<div class="panel pet-dalsi" style="margin-top:18px"><h3>${esc(L(["Tvá další zvířata", "Your other animals"]))}${ihelp(H_DALSI)}</h3>
      <p class="muted small pet-help">${esc(H_DALSI)}</p>
      <div class="zvirata">${Z.filter((z) => z !== A).map((z) => { const ne = petNeSpolu(A.kind, z.kind);
        return z.druhy ? `<div class="zvire vybrano">${obr(z)}<b>${esc(z.name)}</b><small>${esc(z.kind + " · " + z.stage_name + " · " + z.bonus)}</small>
          <small class="vzit">${esc(L(["jde s tebou", "with you"]))}</small><span class="zv-tl"><button type="button" class="btn small" data-vzit="${esc(z.kind)}">${esc(L(["Pečovat", "Care"]))}</button><button type="button" class="btn small" data-solo="1">${esc(L(["Nechat doma", "Leave home"]))}</button></span></div>`
        : `<button type="button" class="zvire" data-vzit="${esc(z.kind)}">${obr(z)}<b>${esc(z.name)}</b>
        <small>${esc(z.kind + " · " + z.stage_name + " · " + z.bonus)}</small><small class="vzit">${esc(ne ? L(["Vzít místo ", "Take instead of "]) + A.name : L(["Vzít s sebou", "Take along"]))}</small>${ne ? `<small class="dim">${esc(ne)}</small>` : ""}</button>`; }).join("")}</div></div>` : ""}</div>`));
  view.querySelectorAll("[data-pethelp]").forEach((b) => b.onclick = (e) => {   // r27-31: nápověda v okénku
    e.stopPropagation();
    const o = document.createElement("div");
    o.className = "rekap-obal vysv-obal";
    o.innerHTML = `<div class="rekap vyp-pergamen vysv"><p>${esc(b.dataset.pethelp)}</p><div class="row" style="justify-content:center;margin-top:12px"><button class="btn primary" data-ok>${esc(L(["Zavřít", "Close"]))}</button></div></div>`;
    o.onclick = (ev) => { if (ev.target === o || ev.target.closest("[data-ok]")) o.remove(); };
    document.body.appendChild(o);
  });
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
  // r27-37: nové odznaky
  "Svazek před oltářem": ["kruh", "zlato", "#8e1b14", `<circle cx="-3" cy="1" r="5"/><circle cx="3" cy="1" r="5"/><path d="M-1 -7 L1 -7 L0 -5 Z"/>`],
  "Knihomol": ["stit", "bronz", "#5a3a1a", `<path d="M-8 -6 H-1 V7 H-8 Z M8 -6 H1 V7 H8 Z M-1 -6 V7"/>`],
  "Strážce příběhů": ["kosoctverec", "stribro", "#3b2a5a", `<path d="M-2 8 H2 V-2 H-2 Z M0 -2 C-3 -5 -1 -8 0 -9 C1 -8 3 -5 0 -2"/>`],
  "Vážený měšťan": ["stit", "stribro", "#7a1f14", `<path d="M0 -8 L2 -3 L7 -3 L3 0 L5 6 L0 3 L-5 6 L-3 0 L-7 -3 L-2 -3 Z"/>`],
  "Slavný v kraji": ["hvezda", "zlato", "#7a5a12", `<circle r="4"/><path d="M0 -9 V-6 M0 6 V9 M-9 0 H-6 M6 0 H9"/>`],
  "Spořivá ruka": ["kruh", "zlato", "#4f6a3a", `<path d="M-7 7 H7 M-6 7 V-1 M6 7 V-1 M-2 7 V-1 M2 7 V-1 M-8 -1 H8 L0 -8 Z"/>`],
  "Štědrý hostitel": ["kruh", "bronz", "#7a5a12", `<path d="M-6 -6 H2 V6 H-6 Z M2 -3 H5 V3 H2"/>`],
  "Pravá ruka hostinského": ["kruh", "zelezo", "#5a3a1a", `<path d="M-7 7 L5 -5 M2 -8 L8 -2 L5 1 L-1 -5 Z"/>`],
  "Poutník k oltáři": ["kosoctverec", "stribro", "#3b4f68", `<path d="M0 -9 V9 M-5 -3 H5"/>`],
  "Neúnavný najatec": ["stit", "zlato", "#4f6a3a", `<path d="M-6 -7 H6 V8 H-6 Z M-3 -3 H3 M-3 1 H3 M-3 5 H1"/>`],
  "Veterán stezek": ["hvezda", "stribro", "#4f6a3a", `<circle r="7"/><path d="M0 -5 L2 0 L0 5 L-2 0 Z"/>`],
  "Krvavá čepel": ["stit", "zelezo", "#7a1f14", `<path d="M-6 7 L6 -7 M3 -7 H6 V-4 M-8 4 L-4 8"/>`],
  "Poctivý plátce": ["kruh", "stribro", "#5a3a1a", `<circle r="6"/><path d="M-3 0 L-1 3 L4 -3"/>`],
  "Ctěný dlužník": ["kruh", "zlato", "#3b4f68", `<path d="M-8 1 L-3 -3 L0 0 L3 -3 L8 1 L2 6 L-2 6 Z"/>`],
  "Šampion kolbiště": ["hvezda", "zlato", "#7a1f14", `<path d="M-6 -7 H6 V-2 C6 3 2 5 0 5 C-2 5 -6 3 -6 -2 Z M0 5 V8 M-4 9 H4"/>`],
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
// 1.0-1: odznaky v deníku po záložkách podle druhu
const ODZ_DRUH = [
  ["boj", ["Boj a kolbiště", "Combat"], ["Lovec příšer", "Krvavá čepel", "Postrach pánů míst", "Pán kraje", "Bez škrábnutí", "Mistr kolbiště", "Vítěz turnaje", "Šampion kolbiště"]],
  ["vypravy", ["Výpravy", "Expeditions"], ["Matador stezek", "Veterán stezek", "Hledač pokladů", "Sběratel", "Milosrdný samaritán", "Mrchožrout"]],
  ["mesto", ["Město a víra", "Town and faith"], ["Spolehlivý najatec", "Neúnavný najatec", "Vážený měšťan", "Slavný v kraji", "Zbožná duše", "Poutník k oltáři", "Štědrý hostitel", "Pravá ruka hostinského", "Svazek před oltářem"]],
  ["majetek", ["Majetek a řemeslo", "Wealth and craft"], ["Zbohatlík", "Spořivá ruka", "Ctěný dlužník", "Poctivý plátce", "Mistr podniku", "Vlastníma rukama", "Mistr řemesla"]],
  ["zivot", ["Život a příběhy", "Life and lore"], ["Legenda", "Usedlík", "Pamětník", "Stařešina", "Knihomol", "Strážce příběhů", "Přítel zvířat"]],
];
// r27-40: malovaný odznak z ComfyUI (img/odznaky/<slug>.webp); dokud malba chybí, zůstane kreslený
function odznakSvg(name, got) {
  return `<img class="odz-mal${got ? "" : " neni"}" alt="" src="${IMG_BASE}odznaky/${Postava.slug(name)}.webp">` + odznakKresba(name, got);
}
function odznakyObr(box) {
  box.querySelectorAll("img.odz-mal").forEach((im) => {
    const ok = () => im.parentElement && im.parentElement.classList.add("ma-obr"), pryc = () => im.remove();
    im.addEventListener("load", ok); im.addEventListener("error", pryc);
    if (im.complete) (im.naturalWidth ? ok : pryc)();
  });
}
function odznakKresba(name, got) {
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

// r27-40: deník → Vztahy — dvořit se, dávat dárky, přijímat / odmítat a nakonec požádat o ruku (sňatek se uzavře v chrámu)
// r27-42: Vztahy v deníku na dvě záložky — Lidé ve městě (obchodníci, rychtář, farář…) · Milostné vztahy (mezi hráči)
const vzDruhHtml = () => `<div class="vz-druh">${[["lide", L(["Lidé ve městě", "Townsfolk"])], ["srdce", L(["Milostné vztahy", "Romance"])]].map(([k, n]) => `<button type="button" class="chip${(DENIK.vzZal || "lide") === k ? " on" : ""}" data-vzdruh="${k}">${esc(n)}</button>`).join("")}</div>`;
const vzDruhWire = (box) => box.querySelectorAll("[data-vzdruh]").forEach((b) => b.onclick = () => { DENIK.vzZal = b.dataset.vzdruh; DENIK.list = DENIK.list || {}; DENIK.list.vztahy = 0; Zvuk.sfx("stranka"); render(); });
const LIDE_OBR = { "Vetešník": "mesto-vetesnik", "Směnárník": "mesto-banka", "Hostinský": "mesto-hostinec", "Kovář": "mesto-kovar", "Střelmistr": "mesto-strelmistr", "Zbrojíř": "mesto-zbrojir",
  "Krejčí": "mesto-krejci", "Písař": "mesto-pisar", "Truhlář": "mesto-trziste", "Mlynář": "mesto-mlyn", "Apatykář": "mesto-apatykar", "Lazebník": "mesto-lazebnik", "Zvěřinec": "mesto-zverinec",
  "Rychtář": "mesto-radnice", "Farář": "mesto-chram", "Pašerák": "mesto-paserak", "Lichvář": "mesto-lichvar" };
const LIDE = { vyb: "" };
/** 1.0-3-12: stupnice vztahu −100…+100 s pásmy (Nepřítel … Spojenec), značkou, kde jsi, a kolik chybí do dalšího stupně. */
const VZ_PASMA = [[-100, -60, "nepritel", ["Nepřítel", "Enemy"], ["neprodá, nevykoupí, nepomůže", "won't trade or help"]],
  [-60, -25, "neduvera", ["Nedůvěra", "Distrust"], ["ceny +20 %, výkup −10 %, odmítá služby", "prices +20 %, refuses services"]],
  [-25, 25, "neutral", ["Neutrál", "Neutral"], ["běžné jednání", "normal dealings"]],
  [25, 60, "prizen", ["Přízeň", "Favour"], ["ceny −10 %, výkup +5 %", "prices −10 %, sells +5 %"]],
  [60, 101, "spojenec", ["Spojenec", "Ally"], ["ceny −20 %, výkup +10 %, přimluví se", "prices −20 %, sells +10 %, vouches"]]];
function vztahInfo(x) {
  const b = Math.max(-100, Math.min(100, x.b || 0)), i = VZ_PASMA.findIndex(([od, do_]) => b >= od && b < do_);
  const dal = VZ_PASMA[i + 1], hor = VZ_PASMA[i - 1];
  return { b, dal: x.zap ? null : dal ? { jm: L(dal[3]), co: L(dal[4]), chybi: dal[0] - b } : null,
    hor: hor ? { jm: L(hor[3]), rezerva: b - VZ_PASMA[i][0] + 1 } : null };
}
function vztahStupnice(x, velka) {
  const I = vztahInfo(x), pos = (I.b + 100) / 2;
  const tip = `${L(["Vztah ", "Relation "])}${I.b > 0 ? "+" : ""}${I.b} ${L(["z ±100", "of ±100"])} · ${x.st_jm}${x.popis ? ": " + x.popis : ""}`
    + (x.zap ? L([" · zapečetěno, už se nespraví", " · sealed"]) : I.dal ? ` · ${L(["do stupně ", "to "])}${I.dal.jm} (${I.dal.co}) ${L(["chybí ", "need "])}${I.dal.chybi} ${L(["bodů", "pts"])}` : L([" · nejlepší možný vztah", " · best possible"]))
    + (I.hor ? ` · ${L(["pád na ", "drop to "])}${I.hor.jm} ${L(["za ", "after "])}−${I.hor.rezerva}` : "");
  return `<span class="vz-stup${velka ? " velka" : ""}" title="${esc(tip)}">
    <span class="vz-pasma">${VZ_PASMA.map(([od, do_, k]) => `<i class="${k}${k === x.st ? " on" : ""}" style="left:${(od + 100) / 2}%;width:${(Math.min(100, do_) - od) / 2}%"></i>`).join("")}<b class="vz-znacka" style="left:${pos}%"></b></span>
    <small class="vz-cislo">${I.b > 0 ? "+" : ""}${I.b}${x.zap ? " 🔒" : I.dal ? ` · ${esc(I.dal.jm)} ${L(["za", "in"])} +${I.dal.chybi}` : ""}</small>
    ${velka ? `<span class="vz-legenda">${VZ_PASMA.map(([od, do_, k, jm]) => `<em class="${k}" style="left:${(od + 100) / 2}%;width:${(Math.min(100, do_) - od) / 2}%">${esc(L(jm))}</em>`).join("")}</span>` : ""}</span>`;
}
function lideKresli(box, P) {
  const vyb = P.find((x) => x.id === LIDE.vyb);
  const tvar = (x) => `<span class="li-tvar"><img alt="" src="${IMG_BASE}${LIDE_OBR[x.id] || "mesto-hostinec"}-m.webp"></span>`;
  const body = (x, velka) => vztahStupnice(x, velka);   // 1.0-3-12: stupnice s pásmy, značkou a popiskem
  const hlava = `<p class="kapitola">${esc(L(["Kapitola IX", "Chapter IX"]))}</p>${vzDruhHtml()}`;
  box.innerHTML = vyb ? `${hlava}<div class="li-detail ${vyb.st}">${tvar(vyb)}<div><h4>${esc(vyb.jm)}${vyb.zap ? " 🔒" : ""} <small>${esc(vyb.misto)}</small></h4>
      <p><b class="li-st">${esc(vyb.st_jm)}</b> · ${esc(vyb.popis)}</p>${body(vyb, true)}
      ${vyb.proc.length ? `<ul>${vyb.proc.map((p) => `<li><span class="${p.z >= 0 ? "plus" : "minus"}">${p.z >= 0 ? "+" : ""}${p.z}</span> ${esc(p.t)}</li>`).join("")}</ul>` : `<p class="muted small">${esc(L(["Zatím mezi vámi nic zvláštního.", "Nothing between you yet."]))}</p>`}
      <p class="muted small">${esc(vyb.naprava)}</p>${smirHtml(vyb)}<button type="button" class="btn small" data-lid="">← ${esc(L(["Všichni lidé", "All people"]))}</button></div></div>`
    : `${hlava}<p class="muted small li-uvod">${esc(L(["Pověst = jak tě vidí celé město. Vztah = co si o tobě myslí jeden člověk. Ztratit ho jde hned, získat zpátky jen pomalu (nejvýš +3 za den). Klepni na člověka a uvidíš proč.", "What individual townsfolk think of you."]))}</p>
    <div class="lide-mriz">${P.map((x) => `<button type="button" class="li-osoba ${x.st}" data-lid="${esc(x.id)}">${tvar(x)}<span class="li-txt">
      <b>${esc(x.jm)}${x.zap ? " 🔒" : ""}</b><small class="li-st">${esc(x.st_jm)}</small>${body(x)}</span></button>`).join("")}</div>`;
  vzDruhWire(box);
  box.querySelectorAll("[data-lid]").forEach((b) => b.onclick = () => { LIDE.vyb = b.dataset.lid; Zvuk.sfx("stranka"); lideKresli(box, P); });
  box.querySelectorAll("[data-smir]").forEach((b) => b.onclick = async () => {   // 1.0-1: smíření
    b.disabled = true;
    try { const r = await call(b.dataset.smir, { npc: b.dataset.npc }); toast(r.text); Zvuk.sfx("mince"); lideKresli(box, r.lide); }
    catch { b.disabled = false; }
  });
}
// 1.0-1: cesta k nápravě u Nepřítele — přímluva spojence nebo smírčí smlouva u faráře
function smirHtml(x) {
  const s = x.smir; if (!s) return "";
  const id = esc(x.id), npc = `data-npc="${id}"`;
  if (s.ukol) return `<div class="li-smir"><b>${esc(L(["Smírčí úkol", "Reconciliation task"]))}</b> · ${esc(s.ukol.od)}: ${s.ukol.n} / ${s.ukol.z} ${esc(L(["splněných zakázek (nástěnka nebo radnice)", "jobs done"]))}</div>`;
  if (s.pokani) return `<div class="li-smir"><b>${esc(L(["Pokání", "Penance"]))}</b> · ${s.pokani.n} / ${s.pokani.z} ${esc(L(["dnů modlitby (−10 výdrže, jednou za herní den)", "days of prayer"]))}
    <button type="button" class="btn small primary" data-smir="smir_pokani" ${npc}>🙏 ${esc(L(["Pomodlit se", "Pray"]))}</button></div>`;
  const b = [];
  if (s.primluvci.length) b.push(`<button type="button" class="btn small" data-smir="smir_primluva" ${npc} title="${esc(L(["Spojenec ti dá smírčí úkol: tři zakázky.", "An ally gives you a task."]))}">🤝 ${esc(L(["Přímluva", "Intercession"]))}: ${esc(s.primluvci[0])}</button>`);
  if (s.farar) b.push(`<button type="button" class="btn small" data-smir="smir_smlouva" ${npc} title="${esc(L(["Dar kostelu a tři dny pokání.", "Gift and penance."]))}">⛪ ${esc(L(["Smírčí smlouva", "Reconciliation pact"]))} · ${s.dar} gr.</button>`);
  if (!b.length) return `<div class="li-smir muted small">${esc(L(["Smířit se zatím nejde: potřebuješ spojence, který ho zná, nebo faráře, který tě snese.", "No way to reconcile yet."]))}</div>`;
  return `<div class="li-smir">${b.join("")}</div>`;
}
const VZT = { novy: "", pohl: "" };
const portret = (k) => k && k.fig ? `<span class="vz-portret"><span class="skop-postava">${Postava.html(k.fig, IMG_BASE)}</span></span>` : `<span class="vz-portret prazdny"></span>`;
function vztahyKresli(box, V) {
  const tl = (n) => `<div class="vz-bar"><i style="width:${Math.min(100, n)}%"></i><span>${n} / ${V.plna}</span></div>`;
  const dvor = (cil, za, ceka) => `<div class="vz-akce">${V.dvoreni.map((a) => `<button type="button" class="btn small vz-dvbtn" data-vz-dv="${esc(cil)}:${esc(a.k)}"${za || ceka ? " disabled" : ""} title="${esc(L(["náklonnost +", "affection +"]) + a.body)}"><img class="vz-ikona" alt="" src="${IMG_BASE}ucinky/dv-${esc(a.k)}.webp">${esc(a.n)}${a.cena ? " · " + a.cena + " gr." : ""}</button>`).join("")}</div>
    ${za ? `<p class="muted small">${esc(L(["Další dvoření za ", "Next courting in "]) + (Math.floor(za / 60) + 1) + " min.")}</p>` : ceka ? `<p class="muted small">${esc(L(["Čekáš na odpověď.", "Waiting for an answer."]))}</p>` : ""}
    ${V.dary.length ? `<div class="vz-dar"><select data-vz-darsel="${esc(cil)}"><option value="">${esc(L(["Vyber dárek…", "Choose a gift…"]))}</option>${V.dary.map((d) => `<option value="${esc(d.kus != null ? d.n + "§" + d.kus : d.n)}">${esc(d.n + (d.kus != null ? (d.enh ? " +" + d.enh : " " + L(["(obyčejná)", "(plain)"])) + (d.wear < 100 ? " · " + d.wear + " %" : "") : "") + (d.q > 1 ? " ×" + d.q : "") + " · až +" + d.body)}</option>`).join("")}</select>
      <button type="button" class="btn small primary" data-vz-dar="${esc(cil)}">${esc(L(["Darovat", "Give"]))}</button></div>` : ""}`;
  box.innerHTML = `<p class="kapitola">${esc(L(["Kapitola IX", "Chapter IX"]))}</p>${vzDruhHtml()}<h3 class="dk-nadpis">${esc(L(["Milostné vztahy a namlouvání", "Romance and courtship"]))}</h3>
    <p class="vz-stav">${esc(L(["Rodinný stav: ", "Status: "]))}<b>${esc(V.stav)}</b></p>
    <p class="muted small">${esc(L([`Dvoř se a dávej dárky — druhá postava sama rozhodne, jestli projev přijme. Při náklonnosti ${V.plna} a aspoň dvou přijatých projevech z každé strany se v chrámu otevře sňatek. Obřad stojí ${V.cena} gr.: církvi ${V.rozdeleni[0]}, městu za ohlášky ${V.rozdeleni[1]}, nevěstě věno ${V.rozdeleni[2]}.`, "Court and give gifts; the other decides."]))}</p>
    ${V.cekaji.length || V.zadosti.length ? `<h4>${esc(L(["Čeká na tvou odpověď", "Awaiting your answer"]))}</h4>
      ${V.zadosti.map((z) => `<div class="vz-ceka zadost"><span>💍 <b>${esc(z.jm)}</b> ${esc(L(["tě žádá o ruku!", "asks for your hand!"]))}</span>
        <span class="row"><button type="button" class="btn small primary" data-vz-sn="${esc(z.od)}:1">${esc(L(["Ano, ber mě", "Yes"]))}</button><button type="button" class="btn small" data-vz-sn="${esc(z.od)}:0">${esc(L(["Odmítnout", "Decline"]))}</button></span></div>`).join("")}
      ${V.cekaji.map((x) => `<div class="vz-ceka">${x.druh === "dar" ? icon(x.co) : `<img class="vz-ikona velka" alt="" src="${IMG_BASE}ucinky/dv-${esc(x.co)}.webp">`}<span>${esc(x.text)} <small class="muted">(+${x.body})</small></span>
        <span class="row"><button type="button" class="btn small primary" data-vz-odp="${esc(x.id)}:1">${esc(L(["Přijmout", "Accept"]))}</button><button type="button" class="btn small" data-vz-odp="${esc(x.id)}:0">${esc(L(["Odmítnout", "Decline"]))}</button></span></div>`).join("")}` : ""}
    ${V.moje_zadosti.length ? `<p class="muted">⏳ ${esc(L(["Čekáš na odpověď na žádost o ruku: ", "Waiting for: "]) + V.moje_zadosti.join(", "))}</p>` : ""}
    ${V.vztahy.map((v) => `<div class="vz-karta${v.manzel ? " manzel" : ""}"><div class="vz-hlava">${portret(v)}<div style="flex:1"><div class="spread"><b class="vz-jm">${esc(v.name)} <small class="muted">${esc(L(["úr. ", "lvl "]) + v.level)}</small></b><span class="pill">${esc(v.manzel ? "💍 " + L(["manželský svazek", "married"]) : v.stupen)}</span></div>
      ${v.manzel ? "" : tl(v.n)}
      ${v.manzel ? "" : `<p class="muted small">${esc(L(["Tvé přijaté projevy ", "Your accepted gestures "]) + v.prijato_ja + "/" + v.min_prijato + " · " + L(["jeho/její ", "theirs "]) + v.prijato_on + "/" + v.min_prijato)}</p>`}
      ${v.manzel ? "" : v.snatek ? `<p><button type="button" class="btn primary" data-vz-ruka="${esc(v.uid)}">💍 ${esc(L(["Požádat o ruku · ", "Propose · "]) + V.cena + " gr.")}</button></p>` : V.manzel ? "" : dvor(v.uid, v.dvorit_za, v.ceka_ja)}
      ${v.log.length ? `<details class="vz-log"><summary>${esc(L(["Co se mezi vámi stalo", "History"]))}</summary>${v.log.map((x) => `<p class="small">${esc(x.text)}</p>`).join("")}</details>` : ""}</div></div></div>`).join("")}
    ${V.manzel ? "" : (() => {   // r27-41: kandidáti s portréty, filtr muž / žena; stránkuje deník (bez posouvání)
      const volni = V.kandidati.filter((k) => !V.vztahy.some((v) => v.uid === k.uid));
      const fil = volni.filter((k) => VZT.pohl === "m" ? !k.zena : VZT.pohl === "z" ? k.zena : true);
      const vyb = volni.find((k) => k.uid === VZT.novy);
      return `<h4>${esc(L(["Začít se dvořit", "Start courting"]))}</h4>
      ${vyb ? `<div class="vz-karta vz-vybrany"><div class="vz-hlava">${portret(vyb)}<div><b class="vz-jm">${esc(vyb.name)} <small class="muted">${esc(L(["úr. ", "lvl "]) + vyb.level)}</small></b>${dvor(vyb.uid, 0, false)}</div></div></div>` : ""}
      ${volni.length ? `<div class="vz-filtr">${[["", L(["Všichni", "All"])], ["m", L(["Muži", "Men"])], ["z", L(["Ženy", "Women"])]].map(([k, n]) => `<button class="chip${(VZT.pohl || "") === k ? " on" : ""}" data-vz-pohl="${k}">${esc(n)}</button>`).join("")}</div>
        <div class="vz-kand">${fil.map((k) => `<button type="button" class="vz-kk${VZT.novy === k.uid ? " on" : ""}" data-vz-kand="${esc(k.uid)}">${portret(k)}<b>${esc(k.name)}</b><small>${esc(L(["úr. ", "lvl "]) + k.level)}</small></button>`).join("") || `<p class="muted">${esc(L(["Nikdo takový.", "Nobody."]))}</p>`}</div>`
        : `<p class="muted">${esc(L([`Zatím tu není nikdo, komu by ses mohl(a) dvořit (opačné pohlaví, svobodní, od ${V.uroven}. úrovně).`, "Nobody to court yet."]))}</p>`}`; })()}`;
  loadIcons(V.cekaji.filter((x) => x.druh === "dar").map((x) => x.co));
  box.querySelectorAll("img.vz-ikona").forEach((im) => { const pryc = () => im.remove(); im.addEventListener("error", pryc); if (im.complete && !im.naturalWidth) pryc(); });
  const proved = async (op, data) => {
    try { const r = await call(op, data); if (r.text) toast(r.text); if (r.vztahy) { V = r.vztahy; VZT.novy = ""; box._atomy = false; box.classList.remove("listuje"); vztahyKresli(box, V); listujDenik(box); } Zvuk.sfx("stranka"); }
    catch {}
  };
  const znovu = () => { box._atomy = false; box.classList.remove("listuje"); vztahyKresli(box, V); listujDenik(box); };
  vzDruhWire(box);
  box.querySelectorAll("[data-vz-kand]").forEach((b) => b.onclick = () => { VZT.novy = VZT.novy === b.dataset.vzKand ? "" : b.dataset.vzKand; DENIK.list = DENIK.list || {}; DENIK.list.vztahy = 0; znovu(); });
  box.querySelectorAll("[data-vz-pohl]").forEach((b) => b.onclick = () => { VZT.pohl = b.dataset.vzPohl; DENIK.list = DENIK.list || {}; DENIK.list.vztahy = 0; znovu(); });
  box.querySelectorAll("[data-vz-dv]").forEach((b) => b.onclick = () => { b.disabled = true; const [cil, akce] = b.dataset.vzDv.split(":"); proved("vztah_dvorit", { cil, akce }); });
  box.querySelectorAll("[data-vz-dar]").forEach((b) => b.onclick = () => { const sel = box.querySelector(`[data-vz-darsel="${b.dataset.vzDar}"]`); if (!sel || !sel.value) { toast(L(["Vyber dárek.", "Pick a gift."]), true); return; } b.disabled = true; proved("vztah_dar", { cil: b.dataset.vzDar, predmet: sel.value }); });
  box.querySelectorAll("[data-vz-odp]").forEach((b) => b.onclick = () => { const [id, a] = b.dataset.vzOdp.split(":"); proved("vztah_odpoved", { id, ano: a === "1" }); });
  box.querySelectorAll("[data-vz-sn]").forEach((b) => b.onclick = () => { const [od, a] = b.dataset.vzSn.split(":"); if (a === "1" && !confirm(L(["Opravdu? Sňatek platí, dokud ho nezruší biskupská rada.", "Sure?"]))) return; proved("vztah_snatek_odpoved", { od, ano: a === "1" }); });
  box.querySelectorAll("[data-vz-ruka]").forEach((b) => b.onclick = () => { if (!confirm(L([`Požádat o ruku? Když druhá strana řekne ano, zaplatíš ${V.cena} gr. (církev, město, věno).`, "Propose?"]))) return; proved("vztah_snatek", { cil: b.dataset.vzRuka }); });
}
// r27-40: deník na PC — obsah kapitoly se rozdělí na listy podle výšky okna a listuje se tlačítky (jako v knize), bez posouvání stránky
// 1.0-1: deník po kategoriích — každý list je jedna kategorie (s nadpisem); úvod kapitoly je na prvním listu, co se nevejde, posouvá se uvnitř listu
function listujKategorie(box, klic) {
  box._atomy = true;
  const kat = [...box.querySelectorAll(":scope > .dk-kat")];
  const uvod = [...box.children].filter((x) => !x.classList.contains("dk-kat"));
  if (kat.length < 2 && !uvod.length) return;
  const stran = kat.map((k, i) => { const d = document.createElement("div"); d.className = "dk-list dk-list-kat";
    if (i === 0) uvod.forEach((u) => d.appendChild(u));
    d.appendChild(k); return d; });
  DENIK.list = DENIK.list || {};
  let n = Math.min(DENIK.list[klic] || 0, stran.length - 1);
  const nav = document.createElement("div"); nav.className = "dk-listovani";
  nav.innerHTML = `<button type="button" class="btn small" data-l="-1">← ${esc(L(["Předchozí list", "Previous page"]))}</button><span></span><button type="button" class="btn small" data-l="1">${esc(L(["Další list", "Next page"]))} →</button>`;
  const ukaz = () => { stran.forEach((x, i) => { x.hidden = i !== n; });
    const nad = stran[n].querySelector(".dk-kat > h4");
    nav.querySelector("span").textContent = L(["List ", "Page "]) + (n + 1) + " / " + stran.length + (nad ? " · " + nad.textContent : "");
    nav.querySelector('[data-l="-1"]').disabled = n === 0; nav.querySelector('[data-l="1"]').disabled = n === stran.length - 1; DENIK.list[klic] = n;
    stran[n].dispatchEvent(new Event("dk-ukaz")); };
  nav.querySelectorAll("[data-l]").forEach((b) => b.onclick = () => { n = Math.max(0, Math.min(stran.length - 1, n + Number(b.dataset.l))); Zvuk.sfx("stranka"); ukaz(); });
  box.replaceChildren(...stran, nav); box.classList.add("listuje"); ukaz();
}
function listujDenik(box, klic = DENIK.sekce, okno = ".dk-strana") {
  if (!box || jeMobil() || innerWidth <= 1100) return;
  const v = $("#view");
  vejdiDoOkna(okno, 360);                                   // 1.0-1: všechny kapitoly mají stejně velký list
  if (["zapisky"].includes(klic)) return;
  box.classList.add("dk-pripravuje");                        // 1.0-1: neukazovat nerozdělený obsah (problikávalo staré zobrazení)
  const odkryj = () => box.classList.remove("dk-pripravuje");
  setTimeout(odkryj, 1500);                                  // pojistka: obsah se ukáže vždy
  const run0 = () => { try { run(); } finally { odkryj(); } };
  const run = () => {
    if (!box.isConnected) return;
    if (box._atomy) return;
    if (box.querySelector(":scope > .dk-kat")) { listujKategorie(box, klic); return; }   // 1.0-1: list = jedna kategorie s nadpisem
    box._puvodni = [...box.childNodes];
    const cs = getComputedStyle(box);
    const avail = box.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - 52;
    const vyska = (el) => { const r = el.getBoundingClientRect(), s = getComputedStyle(el); return r.height + (parseFloat(s.marginTop) || 0) + (parseFloat(s.marginBottom) || 0); };
    const atomy = [];
    [...box.children].forEach((ch) => {
      if (vyska(ch) > avail * 0.45 && ch.children.length > 1) {
        const s = getComputedStyle(ch), obal = (parseFloat(s.paddingTop) || 0) + (parseFloat(s.paddingBottom) || 0) + (parseFloat(s.marginTop) || 0) + (parseFloat(s.marginBottom) || 0);
        const grid = /grid|flex/.test(s.display) && ch.children.length > 1 && Math.abs(ch.children[0].getBoundingClientRect().top - ch.children[1].getBoundingClientRect().top) < 2;
        let radek = -1, top = null;
        [...ch.children].forEach((g) => { const t = Math.round(g.getBoundingClientRect().top); const novy = !grid || t !== top; if (novy) { radek++; top = t; }
          atomy.push({ el: g, obal: ch, obalH: obal, h: novy ? vyska(g) + (grid ? parseFloat(s.rowGap) || 0 : 0) : 0 }); });
      } else atomy.push({ el: ch, h: vyska(ch) });
    });
    const listy = [[]]; let sum = 0, obalNa = null;
    atomy.forEach((a) => {
      const pridej = a.h + (a.obal && obalNa !== a.obal ? a.obalH : 0);
      if (sum + pridej > avail && listy[listy.length - 1].length) { listy.push([]); sum = 0; obalNa = null; }
      listy[listy.length - 1].push(a); sum += a.h + (a.obal && obalNa !== a.obal ? a.obalH : 0); obalNa = a.obal || null;
    });
    for (let i = 0; i < listy.length - 1; i++) {   // nadpis nezůstane sám na konci listu
      const l = listy[i], posl = l[l.length - 1];
      if (l.length > 1 && posl && !posl.obal && /^H[1-5]$/.test(posl.el.tagName)) listy[i + 1].unshift(l.pop());
    }
    box._atomy = true;
    if (listy.length < 2) { box.replaceChildren(...box._puvodni); return; }
    const stran = listy.map((l) => { const d = document.createElement("div"); d.className = "dk-list"; let akt = null, klon = null;
      l.forEach((a) => { if (a.obal) { if (akt !== a.obal) { klon = a.obal.cloneNode(false); akt = a.obal; d.appendChild(klon); } klon.appendChild(a.el); } else { akt = null; d.appendChild(a.el); } });
      return d; });
    DENIK.list = DENIK.list || {};
    let n = Math.min(DENIK.list[klic] || 0, stran.length - 1);
    const nav = document.createElement("div"); nav.className = "dk-listovani";
    nav.innerHTML = `<button type="button" class="btn small" data-l="-1">← ${esc(L(["Předchozí list", "Previous page"]))}</button><span></span><button type="button" class="btn small" data-l="1">${esc(L(["Další list", "Next page"]))} →</button>`;
    const ukaz = () => { stran.forEach((s, i) => { s.hidden = i !== n; }); nav.querySelector("span").textContent = L(["List ", "Page "]) + (n + 1) + " / " + stran.length;
      nav.querySelector('[data-l="-1"]').disabled = n === 0; nav.querySelector('[data-l="1"]').disabled = n === stran.length - 1; DENIK.list[klic] = n; };
    nav.querySelectorAll("[data-l]").forEach((b) => b.onclick = () => { n = Math.max(0, Math.min(stran.length - 1, n + Number(b.dataset.l))); Zvuk.sfx("stranka"); ukaz(); });
    box.replaceChildren(...stran, nav); box.classList.add("listuje"); ukaz();
    v.scrollTop = 0;
  };
  // 1.0-1: listy se počítají až po tom, co se stránka deníku roztáhne na celé okno (vejdiDoOkna dobíhá do 900 ms) — jinak je na listu méně řádků
  Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise((r) => setTimeout(r, 250))]).then(() => requestAnimationFrame(run0));
}
VIEWS.denik = async (view) => {
  const SEK = [["vypravy", ["Výpravy", "Expeditions"]], ["zakazky", ["Zakázky", "Jobs"]], ["pocty", ["Počty a bilance", "Tally and ledger"]], ["majetek", ["Majetek", "Property"]],
    ["mapy", ["Mapy", "Maps"]], ["zapisky", ["Zápisky", "Notes"]], ["pisemnosti", ["Písemnosti", "Writings"]], ["odznaky", ["Odznaky", "Badges"]], ["vztahy", ["Vztahy", "Relationships"]]];   // r27-40
  const RIM = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];
  view.replaceChildren(h(`<div class="denik-kniha">
    <header class="dk-hlava"><span class="pecet" aria-hidden="true">KS</span><div><small>${esc(L(["Královské stezky · Kutnohorsko · Léta Páně 1403", "Royal Trails · Anno Domini 1403"]))}</small>
      <h2>${esc(L(["Deník — ", "Journal — "]) + S.me.name)}</h2></div></header>
    <div class="dk-telo"><div class="dk-strana" id="denik-obsah"><div class="empty">…</div></div>
      <nav class="dk-zalozky">${SEK.map(([k, n], i) => `<button class="${DENIK.sekce === k ? "on" : ""}" data-sek="${k}"><i>${RIM[i]}</i>${esc(L(n))}</button>`).join("")}</nav></div></div>`));
  view.querySelectorAll("[data-sek]").forEach((b) => b.onclick = () => { DENIK.sekce = b.dataset.sek; render(); });
  vejdiDoOkna(".dk-strana", 360);
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
  } else if (DENIK.sekce === "zakazky") {   // r27-35: přijaté zakázky z nástěnky a co se s nimi stalo
    const Z = D.zakazky || { aktivni: [], log: [] };
    const STAV = { "přijata": ["Přijata", "Taken"], "splněna": ["Splněna", "Done"], "vzdána": ["Vzdána", "Dropped"], "propadla": ["Propadla", "Expired"] };
    box.innerHTML = `<h3 class="dk-nadpis">${esc(L(["Zakázky", "Jobs"]))}</h3>
      <p class="muted">${esc(L([`Splněno celkem: ${Z.hotovo}. Nástěnka se obnoví za ${Math.floor((Z.konci_min || 0) / 60)} h ${String(Math.round((Z.konci_min || 0) % 60)).padStart(2, "0")} min herního času — nesplněné zakázky pak propadnou.`, `Completed: ${Z.hotovo}.`]))}</p>
      <section class="dk-kat"><h4>${esc(L(["Rozpracované", "In progress"]))}</h4>
      ${Z.aktivni.length ? `<ul class="dk-zakazky">${Z.aktivni.map((q) => `<li class="${q.ready ? "hotova" : ""}"><b>${esc(q.title)}</b>
        <span>${esc(q.text)}</span>
        <small>${esc(L(["Odměna ", "Reward "]) + q.coins + " gr. · " + q.xp + " ZK")}${q.mam != null ? esc(L([" · máš ", " · have "]) + q.mam + " / " + q.qty) : ""}${q.ready ? " · <em>" + esc(L(["připravena k odevzdání na nástěnce", "ready to turn in"])) + "</em>" : ""}</small></li>`).join("")}</ul>`
        : `<p class="empty">${esc(L(["Teď nemáš žádnou zakázku. Vezmi si ji v hostinci na nástěnce.", "No jobs taken."]))}</p>`}
      </section>
      ${[["splněna", L(["Splněné", "Completed"])], ["jine", L(["Vzdané a propadlé", "Dropped and expired"])]].map(([k, nad]) => { const lg = Z.log.filter((x) => k === "splněna" ? x.stav === "splněna" : x.stav !== "splněna" && x.stav !== "přijata");
        return `<section class="dk-kat"><h4>${esc(nad)}</h4>${lg.length ? `<ul class="dk-zaznamy">${lg.map((x) => `<li><span class="dz-cas">${esc(datum(x.t))}</span> <b>${esc(L(STAV[x.stav] || [x.stav, x.stav]))}:</b> ${esc(x.title)}${x.stav === "splněna" ? esc(" · +" + x.coins + " gr., +" + x.xp + " ZK") : ""}</li>`).join("")}</ul>`
          : `<p class="empty">${esc(L(["Zatím nic.", "Nothing yet."]))}</p>`}</section>`; }).join("")}`;
  } else if (DENIK.sekce === "vztahy") {   // r27-40: dvoření, dárky, náklonnost a cesta k oltáři; r27-42: + lidé ve městě (dvě záložky)
    if ((DENIK.vzZal || "lide") === "srdce") {
      let V; try { V = (await call("vztahy", {}, true)).vztahy; } catch { return; }
      if (!$("#denik-obsah")) return;
      vztahyKresli(box, V);
    } else {
      let P; try { P = (await call("vztahy_mesto", {}, true)).lide; } catch { return; }
      if (!$("#denik-obsah")) return;
      lideKresli(box, P);
    }
  } else if (DENIK.sekce === "pocty") {   // r27-6: kniha počtů — co postava dokázala a kam tekly groše
    const K = D.kniha || {}, gr = (n) => n.toLocaleString("cs-CZ") + " gr.";
    const max = Math.max(1, ...(K.bilance || []).map((r) => Math.max(r.in, r.out)));
    box.innerHTML = `<p class="kapitola">${esc(L(["Kapitola II", "Chapter II"]))}</p><h3 class="dk-nadpis">${esc(L(["Kniha počtů", "Book of tallies"]))}</h3>
      <section class="dk-kat"><h4>${esc(L(["Co jsem dokázal", "Deeds"]))}</h4><div class="kp-pocty">${(K.pocty || []).map((p) => `<div><b>${p.v.toLocaleString("cs-CZ")}</b><small>${esc(p.n)}</small></div>`).join("")}</div></section>
      <section class="dk-kat"><h4>${esc(L(["Poražení nepřátelé", "Foes slain"]))}</h4>
        ${(K.nepratele || []).length ? `<ol class="kp-seznam">${K.nepratele.map((r) => `<li><span>${esc(r.n)}</span><b>${r.v}×</b></li>`).join("")}</ol>` : `<p class="muted small">${esc(L(["Zatím nikdo — nebo padli dřív, než se začalo počítat.", "None yet."]))}</p>`}</section>
      <section class="dk-kat"><h4>${esc(L(["Páni míst", "Lords of the land"]))}</h4>
        ${(K.pani || []).length ? `<ol class="kp-seznam pani">${K.pani.map((r) => `<li><span>${esc(r.n)}</span><b>${r.v}×</b></li>`).join("")}</ol>` : `<p class="muted small">${esc(L(["Žádný pán místa zatím nepadl tvou rukou.", "No lord has fallen to you yet."]))}</p>`}</section></div>
      <section class="dk-kat"><h4>${esc(L(["Hospodářská bilance", "Ledger"]))}</h4>
      <div class="kp-souhrn"><div><small>${esc(L(["Příjmy", "Income"]))}</small><b class="plus">+${gr(K.prijem || 0)}</b></div>
        <div><small>${esc(L(["Výdaje", "Spending"]))}</small><b class="minus">−${gr(K.vydaj || 0)}</b></div>
        <div><small>${esc(L(["Rozdíl", "Net"]))}</small><b class="${(K.prijem || 0) >= (K.vydaj || 0) ? "plus" : "minus"}">${gr((K.prijem || 0) - (K.vydaj || 0))}</b></div>
        <div><small>${esc(L(["V měšci", "In purse"]))}</small><b>${gr(K.grose || 0)}</b></div>
        <div><small>${esc(L(["Ve směnárně", "In bank"]))}</small><b>${gr(K.banka || 0)}</b></div>${K.dluh ? `<div><small>${esc(L(["Dluh", "Loan"]))}</small><b class="minus">${gr(K.dluh)}</b></div>` : ""}</div>
      ${(K.bilance || []).length ? `<table class="kp-bil"><thead><tr><th>${esc(L(["Oblast", "Area"]))}</th><th>${esc(L(["Příjmy", "Income"]))}</th><th>${esc(L(["Výdaje", "Spending"]))}</th></tr></thead><tbody>
        ${K.bilance.map((r) => `<tr><td>${esc(r.name)}</td><td><span class="kp-bar plus" style="--w:${(100 * r.in / max).toFixed(1)}%"></span>${r.in ? "+" + gr(r.in) : "—"}</td>
          <td><span class="kp-bar minus" style="--w:${(100 * r.out / max).toFixed(1)}%"></span>${r.out ? "−" + gr(r.out) : "—"}</td></tr>`).join("")}</tbody></table>`
        : `<p class="muted small">${esc(L(["Bilance se začíná psát od této verze — každý další groš se sem zapíše.", "The ledger starts with this version."]))}</p>`}</section>`;
  } else if (DENIK.sekce === "majetek") {
    const M = (D.kniha || {}).majetek || [];
    const veci = (o) => Object.entries(o || {}).map(([n, q]) => `<span class="kp-vec">${esc(n)}${q > 1 ? ` <b>×${q}</b>` : ""}</span>`).join("") || `<span class="muted small">${esc(L(["prázdné", "empty"]))}</span>`;
    const IK = { dum: "🏠", podnik: "⚒️", truhla: "🧰", povoz: "🐎" };
    box.innerHTML = `<p class="kapitola">${esc(L(["Kapitola III", "Chapter III"]))}</p><h3 class="dk-nadpis">${esc(L(["Majetek", "Property"]))}</h3>
      ${M.length ? [["dum", L(["Domy", "Houses"])], ["podnik", L(["Podniky", "Businesses"])], ["truhla", L(["Truhly", "Chests"])], ["povoz", L(["Povozy", "Carts"])]].filter(([k]) => M.some((x) => (IK[x.kind] ? x.kind : "truhla") === k)).map(([k, nad]) =>
        `<section class="dk-kat"><h4>${esc(nad)}</h4>${M.filter((x) => (IK[x.kind] ? x.kind : "truhla") === k).map((x, i) => `<details class="kp-majetek"${i ? "" : " open"}><summary><span class="ic">${IK[x.kind] || "•"}</span><b>${esc(x.name)}</b>
          <small>${esc(x.kind === "podnik" ? L(["řemeslo ", "craft "]) + x.skill : x.kind === "dum" ? L(["místnosti: ", "rooms: "]) + x.rooms.length : "")}</small></summary>
        <div class="telo">
          ${x.rooms ? x.rooms.map((r) => `<p><b>${esc(r.name)}</b> <span class="muted small">(${r.items.length}/${r.slots})</span><br>${r.items.map((f) => `<span class="kp-vec">${esc(f)}</span>`).join("") || `<span class="muted small">${esc(L(["bez vybavení", "unfurnished"]))}</span>`}</p>`).join("") : ""}
          ${x.farm ? `<p><b>${esc(L(["Statek", "Farm"]))}</b>: ${esc(L(["polí ", "fields "]) + x.farm.fields)} · ${esc(L(["zvířata: ", "animals: "]) + (x.farm.animals.join(", ") || "—"))}<br>${esc(L(["Stavby: ", "Buildings: "]) + (x.farm.buildings.join(", ") || "—"))}</p>` : ""}
          ${x.kind !== "povoz" ? `<p><b>${esc(x.kind === "dum" ? L(["Truhla", "Chest"]) : x.kind === "podnik" ? L(["Truhla podniku", "Workshop chest"]) : L(["Obsah", "Contents"]))}</b><br>${veci(x.chest)}</p>` : `<p class="muted small">${esc(L(["Uveze víc kořisti z výprav.", "Carries more loot."]))}</p>`}
          ${x.pantry && Object.keys(x.pantry).length ? `<p><b>${esc(L(["Spižírna", "Pantry"]))}</b><br>${veci(x.pantry)}</p>` : ""}
        </div></details>`).join("")}</section>`).join("")
      : `<div class="empty">${esc(L(["Zatím nic nevlastníš. Chalupu prodá radnice od 3. úrovně, podnik od 5.", "You own nothing yet."]))}</div>`}`;
  } else if (DENIK.sekce === "mapy") {
    const M = D.mapy || [];
    box.innerHTML = `<p class="kapitola">${esc(L(["Kapitola IV", "Chapter IV"]))}</p><h3 class="dk-nadpis">${esc(L(["Mapy", "Maps"]))}</h3>
      <p class="muted small">${esc(L(["Mapy oblastí koupíš u písaře. Každá oblast má svoje útržky mapy (4–6 kusů). Až je máš všechny, slož si je tady do mapy pokladu. Po vykopání pokladu mapa zmizí.", "Buy area maps from the scribe. Each area has its own map scraps; three scraps of an area make its treasure map."]))}</p>
      ${roztrhaneMapy(D)}
      ${(D.utrzky_oblasti || []).length ? `<div class="dk-utrzky">${D.utrzky_oblasti.map((u) => `<div class="dk-utrzek${u.n >= (u.treba || 6) ? " plno" : ""}${u.poklad ? " poklad" : ""}"><img alt="" src="${IMG_BASE}predmety/ikony/${Postava.slug(u.item)}.webp" data-nahrada="${IMG_BASE}predmety/ikony/utrzek-mapy-k-pokladu.webp"><span><b>${esc(u.name)}</b><small>${esc(u.poklad ? L(["mapa pokladu hotová", "treasure map ready"]) : L(["útržky ", "scraps "]) + Math.min(u.n, (u.treba || 6)) + " / " + (u.treba || 6))}${u.n > (u.treba || 6) && !u.poklad ? esc(L([" (+" + (u.n - (u.treba || 6)) + " navíc)", ""])) : ""}</small></span></div>`).join("")}</div>` : ""}
      ${M.length ? [...new Set(M.map((m) => m.name))].map((loc) => `<section class="dk-kat dk-mapa-kat"><h4>${esc(loc)}</h4><div class="mapy">${M.filter((m) => m.name === loc).map((m) => `<button class="mapa-karta${m.kind === "poklad" ? " poklad" : ""}" data-mapa="${esc(m.key)}" data-poklad="${m.kind === "poklad" ? 1 : ""}">
          <b>${esc(m.kind === "poklad" ? L(["Mapa pokladu", "Treasure map"]) : L(["Mapa oblasti", "Area map"]))}</b>
          <small>${esc(m.kind === "poklad" ? L(["poklad leží u: ", "buried at: "]) + m.spot + L([" · vezmi lopatu", " · bring a shovel"]) : m.name)}</small></button>`).join("")}</div>
        <div class="mapa-obr"></div></section>`).join("")
      : `<div class="empty">${esc(L(["Zatím nemáš žádnou mapu.", "No maps yet."]))}</div>`}`;
    const ukaz = async (b) => {   // 1.0-1: mapa se rozloží na listu své lokality
      const sec = b.closest(".dk-kat") || box;
      sec.querySelectorAll(".mapa-karta").forEach((x) => x.classList.toggle("on", x === b));
      const o = sec.querySelector(".mapa-obr"); o.innerHTML = `<div class="empty">${esc(L(["Rozkládám mapu…", "Unfolding the map…"]))}</div>`;
      try { const r = await call("mapa_obr", { key: b.dataset.mapa, poklad: !!b.dataset.poklad }, true); o.innerHTML = r.mapa ? malovanaMapa(r.mapa) : `<img alt="" src="data:image/png;base64,${r.image}">`; }
      catch (e) { o.innerHTML = `<div class="empty">${esc(e.message || "")}</div>`; }
    };
    box.querySelectorAll(".dk-mapa-kat").forEach((sec) => { const k = sec.querySelector(".mapa-karta"); if (k) ukaz(k); });
    box.querySelectorAll(".mapa-karta").forEach((b) => b.onclick = () => ukaz(b));
    box.querySelectorAll("[data-sloz]").forEach((b) => b.onclick = () => {   // 1.0-3-11: skládačka z útržků
      const u = (D.utrzky_oblasti || []).find((x) => x.key === b.dataset.sloz); if (!u) return;
      const hotovo = async (o) => {
        try {
          const r = await call("mapa_slozit", { key: u.key });
          o.querySelector(".skl").innerHTML = `<h2>${esc(L(["Mapa pokladu je celá!", "The treasure map is complete!"]))}</h2>
            <p>${esc(L(["Poklad je zakopaný u místa ", "The treasure lies at "]))}<b>${esc(r.misto)}</b> (${esc(r.oblast)}). ${esc(L(["Vezmi lopatu.", "Bring a shovel."]))}</p>
            ${r.mapa ? malovanaMapa(r.mapa) : ""}<p class="row" style="justify-content:center"><button class="btn primary" data-ok>${esc(L(["Rozumím", "Got it"]))}</button></p>`;
          Zvuk.sfx("vyhra");
          o.querySelector("[data-ok]").onclick = () => { o.remove(); render(); };
        } catch { o.remove(); }
      };
      skladacka(u, hotovo);
    });

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
      ${D.pisemnosti.length ? [...new Set(D.pisemnosti.map((w) => w.kind))].map((k) => `<section class="dk-kat"><h4>${esc(k)}</h4>${D.pisemnosti.filter((w) => w.kind === k).map((w) => `<details class="pisemnost"${DENIK.otevrena === w.name ? " open" : ""} data-n="${esc(w.name)}"><summary>${icon(w.name)}
          <span><b>${esc(w.name)}</b><small>${esc(w.kind + (w.have ? "" : L([" · už ji u sebe nemáš", " · no longer carried"])))}</small></span></summary>
        <div class="pergamen">${dmd(w.text)}</div></details>`).join("")}</section>`).join("")
      : `<div class="empty">${esc(L(["Zatím žádná kniha ani list. Najdeš je na výpravách, u písaře a vetešníka — sem se zapíšou samy.", "No writings yet."]))}</div>`}`;
    box.querySelectorAll("details").forEach((d) => d.addEventListener("toggle", () => { if (d.open) DENIK.otevrena = d.dataset.n; }));
    loadIcons(D.pisemnosti.map((w) => w.name));
  } else {
    const mam = D.odznaky.filter((o) => o.got).length;
    const druh = (o) => (ODZ_DRUH.find(([, , jm]) => jm.includes(o.name)) || [/Daruj/.test(o.desc) ? "mesto" : "zivot"])[0];
    const zal = ODZ_DRUH.some(([k]) => k === DENIK.odzZal) ? DENIK.odzZal : "boj";
    const vidim = D.odznaky.filter((o) => druh(o) === zal);
    box.innerHTML = `<p class="kapitola">${esc(L(["Kapitola VII", "Chapter VII"]))}</p><div class="spread"><h3 class="dk-nadpis">${esc(L(["Odznaky a ocenění", "Badges and honours"]))}</h3><span class="pill gold">${mam} / ${D.odznaky.length}</span></div>
      <div class="vz-druh odz-zal">${ODZ_DRUH.map(([k, n]) => { const v = D.odznaky.filter((o) => druh(o) === k); return `<button type="button" class="chip${zal === k ? " on" : ""}" data-odzz="${k}">${esc(L(n))} <small>${v.filter((o) => o.got).length}/${v.length}</small></button>`; }).join("")}</div>
      <div class="odznaky">${vidim.map((o) => `<div class="odznak${o.got ? " ma" : ""}" title="${esc(o.desc)}">${odznakSvg(o.name, o.got)}
        <b>${esc(o.name)}</b><small>${esc(o.desc)}</small></div>`).join("")}</div>`;
    box.querySelectorAll("[data-odzz]").forEach((b) => b.onclick = () => { DENIK.odzZal = b.dataset.odzz; Zvuk.sfx("stranka"); render(); });
    odznakyObr(box);
    if (!jeMobil() && innerWidth > 1100) {               // 1.0-1: jedna karta — odznaky záložky se posouvají uvnitř, žádné listování
      vejdiDoOkna(".dk-strana", 360);
      const g = box.querySelector(".odznaky");
      const fit = () => { if (!g.isConnected) return; const h = box.getBoundingClientRect().bottom - g.getBoundingClientRect().top - 24;
        if (h > 120) { g.style.maxHeight = h + "px"; g.style.overflowY = "auto"; } };
      requestAnimationFrame(fit); setTimeout(fit, 300);
    }
    return;
  }
  listujDenik(box);   // r27-40: na PC se v kapitole listuje po stranách, stránka se neposouvá
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
  else if (im.dataset.nahrada && !im.dataset.nahradaUzita) {   // 1.0-3-14: náhradní obrázek (inline onerror CSP blokuje)
    im.dataset.nahradaUzita = "1"; if (im.dataset.nahradaTrida) im.parentNode?.classList.add(im.dataset.nahradaTrida); im.src = im.dataset.nahrada;
  }
  else if (im.hasAttribute("data-pryc-pri-chybe")) im.remove();
  else if (im.hasAttribute("data-skryt-pri-chybe")) im.style.visibility = "hidden";
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

/** r27-31: na PC se neposouvá stránka, ale jen obsah pod lištou (#view) — lišta a záložky zůstanou nahoře. */
function skrolEl() { const v = document.getElementById("view"); return v && getComputedStyle(v).overflowY === "auto" ? v : null; }
function skrolY() { const s = skrolEl(); return s ? s.scrollTop : window.scrollY; }
function skrolNa(y) { const s = skrolEl(); if (s) s.scrollTop = y; else window.scrollTo(0, y); }
const SPOTS = [   // klikací místa na mapě (% šířky a výšky obrázku mesto-mapa)
  { id: "hostinec", x: 22.2, y: 54.7, n: ["Hostinec", "Inn"], nad: true },   // r27-42 (příští verze): popisek nad budovou, ať se nepřekrývá se Střelmistrovou dílnou
  { id: "kovar", x: 19.8, y: 66.6, n: ["Kovárna", "Smithy"], nad: true },   // 1.0-1-5: bod u výhně, popisek nad střechou; 1.0-1-9: bod i popisek o půl cm níž (Pavel)
  { id: "trziste", x: 37.5, y: 60.5, n: ["Tržiště", "Market"], nad: true },
  { id: "radnice", x: 43.9, y: 49.9, n: ["Radnice", "Town hall"], nad: true },
  { id: "banka", x: 58.9, y: 49.9, n: ["Směnárna", "Money changer"], nad: true },
  { id: "mincovna", x: 34.3, y: 27.9, n: ["Mincovna", "Royal mint"], nad: true, nadY: 26 },   // 1.0-1-6: Vlašský dvůr (Pavel: bod u domu, popisek nad hradbou)
  { id: "lichvar", x: 53.4, y: 33.8, n: ["Lichvář", "Usurer"], nad: true },      // 1.0-1-5: lichvář jako samostatné místo (dřív záložka ve směnárně)
  { id: "chram", x: 81.5, y: 45.5, n: ["Chrám", "Church"], nad: true },
  { id: "lazne", x: 73.7, y: 62.3, n: ["Lazebník", "Bathhouse"], nad: true },
  { id: "mlyn", x: 81.6, y: 77.6, n: ["Mlýn", "Mill"], nad: true },
  { id: "zverinec", x: 65.4, y: 82.2, n: ["Zvěřinec", "Menagerie"], nad: true },
  { id: "kolbiste", x: 48.5, y: 84.5, n: ["Kolbiště", "Arena"], nad: true },
  { id: "brana", x: 14.7, y: 87.7, n: ["Brána", "Town gate"], nad: true },
  { id: "dum", x: 31.5, y: 83.1, n: ["Měšťanský dům", "Burgher house"], nad: true },   // 1.0-1-5: bod u dveří, popisek nad domem
  { id: "hrbitov", x: 93.6, y: 52.6, n: ["Hřbitov", "Graveyard"], nad: true },                    // r27-4: hřbitov u kostela
  { id: "apatyka", x: 54.9, y: 67.2, n: ["Apatyka", "Apothecary"], nad: true },                 // r27-4: podniky — zamčené do koupě
  { id: "dilna", x: 9.0, y: 36.0, n: ["Střelmistrova dílna", "Bowyer's workshop"], nad: true },   // 1.0-1: bod níž, popisek nad ním
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
// 1.0-1: každý podnik má tři části s náhledy — Pracovní prostor (výroba a práce přes minihry), Úložiště (truhla) a Stav (údržba)
const PODNIK_K = { kovar: "kovarna", lovci: "dilna", apatykar: "apatyka", lapka: "doupe", sedlak: "usedlost" };
const podnikObr = (co) => () => co === "prace" ? (BIZ_IMG[S.me.origin] || "mesto-trziste") : "domov/nahled-podnik-" + (PODNIK_K[S.me.origin] || "kovarna") + "-" + co;
const PODNIK_KARTY = [
  { go: "podnikprace", ic: "⚒️", obr: podnikObr("prace"), n: ["Pracovní prostor", "Workspace"], d: ["Výroba z výkresů, vylepšení a opravy — řemeslné postupy", "Crafting, upgrades and repairs"] },
  { go: "podnikuloziste", ic: "📦", obr: podnikObr("uloziste"), n: ["Úložiště", "Storage"], d: ["Truhla podniku a suroviny", "Workshop chest and materials"] },
  { go: "podnikstav", ic: "🧹", obr: podnikObr("stav"), n: ["Správa podniku", "Management"], d: ["Jméno podniku, denní produkce tovaryše, úklid a opravy", "Name, journeyman's output, upkeep"] },
];
const PLACES = {
  // r27-3: všechno jako na Discordu — panel: = okno místa (stejný kód), cid: = rovnou tlačítko z Discordu, when: = jen někomu
  hostinec: { img: "mesto-hostinec", n: ["Hostinec U Zlatého groše", "The Golden Groschen Inn"],
    say: ["Hostinský: „Co to bude, poutníku?“", "Innkeeper: \"What will it be, traveller?\""],
    opts: [   // r27-4: rozložení podle Pavla
      { sect: ["Hry a sázky", "Games and betting"] },
      { go: "misto/hostinec-hry", ic: "🎲", n: ["Hry s hostinským", "Games with the innkeeper"], d: ["Kostky, oko bere, šipky", "Dice, twenty-one, darts"] },
      { go: "misto/hostinec-hraci", ic: "🤝", n: ["Hry s hráči", "Games with players"], d: ["Lhář, mlýn, kostky, karty, souboj", "Liar's dice, mill, dice, cards, duel"] },
      { go: "sazky", ic: "🎲", n: ["Sázky", "Betting"], d: ["Kohoutí jáma · U soudku · Na pěsti", "Cockpit · Drinking contest · Fist fights"] },   // r27-41
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
      { go: "hra/dice", ic: "🎲", obr: "domov/hra-nahled-kostky", n: ["Kostky", "Dice"], d: ["Hra s hostinským o groše", "Play the innkeeper for coins"] },
      { go: "hra/cards", ic: "🃏", obr: "domov/hra-nahled-oko", n: ["Oko bere", "Twenty-one"], d: ["Karetní hra s hostinským", "Card game with the innkeeper"] },
      { go: "hra/prsi", ic: "🂠", obr: "domov/hra-nahled-prsi", n: ["Prší", "Prší"], d: ["Karetní hra s hostinským", "Card game with the innkeeper"] },
      { go: "hra/darts", ic: "🎯", obr: "domov/hra-nahled-sipky", n: ["Šipky", "Darts"], d: ["Cvičný hod na terč", "Practice at the board"] },
    ] },
  "hostinec-hraci": { img: "mesto-hostinec", n: ["Vyzvat hráče", "Challenge a player"],   // r27-6: výzva jako karty (dřív holá tlačítka)
    say: ["Oba vsadíte stejnou částku a vítěz bere vše. Soupeř výzvu potvrdí, pak se střídáte v tazích.", "Both stake the same amount; the winner takes all. The opponent accepts, then you take turns."],
    opts: [
      { cid: "ks:pvp:kind:dice", ic: "🎲", obr: "domov/hra-nahled-kostky", n: ["Kostky", "Dice"], d: ["Po kolech na cílový počet bodů", "Rounds up to a target score"] },
      { cid: "ks:pvp:kind:cards", ic: "🃏", obr: "domov/hra-nahled-oko", n: ["Oko bere", "Twenty-one"], d: ["Karty ze společného balíčku", "Cards from a shared deck"] },
      { cid: "ks:pvp:kind:prsi", ic: "🂠", obr: "domov/hra-nahled-prsi", n: ["Prší", "Prší"], d: ["Karetní hra dvou hráčů", "Card game for two"] },
      { cid: "ks:pvp:kind:liar", ic: "🤥", obr: "domov/hra-nahled-lhar", n: ["Lhář", "Liar's dice"], d: ["Kostky pod pohárem a blafování", "Dice under the cup and bluffing"] },
      { cid: "ks:pvp:kind:darts", ic: "🎯", obr: "domov/hra-nahled-sipky", n: ["Šipky", "Darts"], d: ["Kdo hodí víc na terč", "Who scores more on the board"] },
      { cid: "ks:pvp:kind:morris", ic: "⚪", obr: "domov/hra-nahled-mlyn", n: ["Mlýn", "Nine men's morris"], d: ["Desková hra s kameny", "Board game with stones"] },
    ] },
  trziste: { img: "mesto-trziste", n: ["Tržiště", "Market square"], say: ["Kupci vyvolávají své zboží.", "Merchants call out their wares."],
    opts: [   // 1.0-1: každý obchod s náhledem
      { go: "obchod/Kovář", obr: "mesto-kovar", n: ["Kovář", "Smith"], d: ["Zbraně, nářadí, opravy", "Weapons, tools, repairs"] },
      { go: "obchod/Střelmistr", obr: "mesto-strelmistr", n: ["Střelmistr", "Bowyer"], d: ["Luky, kuše, šípy", "Bows, crossbows, arrows"] },
      { go: "obchod/Zbrojíř", obr: "mesto-zbrojir", n: ["Zbrojíř", "Armourer"], d: ["Zbroje, přilby, štíty", "Armour, helmets, shields"] },
      { go: "obchod/Apatykář", obr: "mesto-apatykar", n: ["Apatykář", "Apothecary"], d: ["Odvary, léčení ran", "Potions, healing"] },
      { go: "obchod/Krejčí", obr: "mesto-krejci", n: ["Krejčí", "Tailor"], d: ["Oděvy, pláště, barvení", "Clothes, cloaks, dyeing"] },
      { go: "obchod/Písař", obr: "mesto-pisar", n: ["Písař", "Scribe"], d: ["Mapy, knihy, recepty", "Maps, books, recipes"] },
      { go: "obchod/Vetešník", obr: "mesto-vetesnik", n: ["Vetešník", "Junk dealer"], d: ["Všechno možné, výkup", "Odds and ends"] },
      { go: "obchod/Mlynář", obr: "mesto-mlyn", n: ["Mlynář", "Miller"], d: ["Obilí a mouka", "Grain and flour"] },
      { panel: "carpenter", obr: "mesto-truhlar", n: ["Truhlář", "Carpenter"], d: ["Nábytek do domu", "Furniture for your home"] },
      { go: "calounik", obr: "mesto-calounik", n: ["Čalouník", "Tapestry maker"], d: ["Tapety, čalouny a malby stěn", "Wall hangings and paintings"] },
      { go: "aukce", obr: "mesto-aukce", n: ["Aukce hráčů", "Player auctions"], d: ["Rozklikni dražbu a přihoď", "Open an auction and bid"] },
      { go: "obchod/Pašerák", obr: "mesto-paserak", n: ["Pašerák", "Smuggler"], d: ["Jen v noci", "Night only"] }] },
  apatyka: { img: "domov/podnik-apatyka", n: ["Tvá apatyka", "Your apothecary"], say: ["Křivule, hmoždíře a bylinková zahrádka — tvoje dílna.", "Alembics, mortars and a herb garden — your workshop."],
    opts: PODNIK_KARTY },
  dilna: { img: "domov/podnik-strelmistrova-dilna", n: ["Tvá střelmistrova dílna", "Your bowyer's workshop"], say: ["Ponk, napínací stolice a sudy s pery — tvoje dílna.", "Bench, bending stool and barrels of feathers."],
    opts: PODNIK_KARTY },
  // r27-4: Kovárna na mapě je podnik kováře — zamčená, dokud si ji nekoupí; kovář prodává na tržišti
  kovar: { img: "domov/podnik-kovarna", n: ["Tvá kovárna", "Your smithy"], say: ["Výheň, kovadlina a měchy — tvoje dílna.", "Forge, anvil and bellows — your workshop."],
    opts: PODNIK_KARTY.map((o) => ({ ...o, when: (m) => m.origin === "kovar" && m.business })) },
  mlyn: { redirect: "obchod/Mlynář" },
  hrbitov: { redirect: "hrbitov" },                      // r27-3: mlynář vykupuje obilí a mele mouku
  lichvar: { img: "mesto-lichvar", n: ["Lichvář", "Usurer"], say: ["Lichvář: „Groše jsou groše. Odkud jsou, mě nezajímá.“", "Usurer: \"Coin is coin. I don't ask where it's from.\""],   // 1.0-1-5: samostatné místo u hradeb
    opts: [
      { go: "lichvar/uschova", ic: "🔒", obr: "domov/nahled-lichvar-uschova", n: ["Úschova", "Safekeeping"], d: ["Uložit a vybrat groše · úschovné, ale bez otázek", "Deposit and withdraw · a fee, no questions"] },
      { go: "lichvar/pujcka", ic: "🪙", obr: "domov/nahled-lichvar-pujcka", n: ["Půjčka", "Loan"], d: ["Půjčí i tomu, komu směnárník ne · vysoký úrok", "Lends even when the changer won't · high interest"] },
    ] },
  mincovna: { img: "mesto-mincovna", n: ["Mincovna · Vlašský dvůr", "Royal mint · Italian Court"], say: ["Mincmistr: „Stříbro přines, groše odneseš. Ražebné si král bere vždycky.“", "Mint master: \"Bring silver, take groschen. The king always takes his cut.\""],   // 1.0-1-6: F3 živé ekonomiky
    opts: [{ go: "mincovna", ic: "🪙", obr: "domov/nahled-mincovna-razba", n: ["Prodat stříbro", "Sell silver"], d: ["Mincmistr vykoupí stříbrnou rudu a vyrazí z ní nové groše", "The mint master buys silver ore and strikes new groschen"] }] },
  radnice: { male: true, img: "mesto-radnice", n: ["Radnice", "Town hall"], say: ["Purkmistr: „Co vás přivádí před radu, poutníku?“", "Burgomaster: \"What brings you before the council, traveller?\""],
    opts: [   // r27-4: Nemovitosti / Rychtář / Přehledy; banka je ve Směnárně
      { sect: ["Nemovitosti", "Property"] },
      { cid: "ks:hall:shop", ic: "🏠", obr: "domov/nahled-radnice-podnik", n: ["Koupit podnik", "Buy a business"], d: ["Vlastní dílna podle původu", "Your own workshop"] },
      { go: "domy", ic: "🏡", obr: "mesto-dum", n: ["Koupit dům", "Buy a house"], d: ["Chalupa nebo měšťanský dům", "Cottage or burgher house"] },
      { sect: ["Úřad", "Office"] },
      { go: "vyhlasky", ic: "📯", obr: "domov/nahled-radnice-vyhlasky", n: ["Vyhlášky radnice", "Town proclamations"], d: ["Úkoly za groše, předměty a pověst", "Tasks for coin, items and renown"] },
      { go: "zakazkyhracu", ic: "📜", obr: "domov/nahled-radnice-zakazky", n: ["Zakázky měšťanů", "Burghers' orders"], d: ["Co poptávají majitelé podniků a kolik platí", "What business owners need and pay"] },
      { go: "misto/radnice-rychtar", ic: "⚖️", obr: "domov/nahled-rychtar-pravo", n: ["Rychtář", "Reeve"], d: ["Pokuty, výdaje, právo a erb", "Fines, bills, citizenship and arms"] },
      { go: "dar/mesto", ic: "🎁", obr: "domov/nahled-radnice-dar", n: ["Dar městu", "Gift to the town"], d: ["Pro dobrou pověst", "For your reputation"] },
      { sect: ["Přehledy", "Overviews"] },
      { go: "kroniky", ic: "📖", obr: "domov/nahled-radnice-kroniky", n: ["Kroniky", "Chronicles"], d: ["Události, slavní, žijící hrdinové, výsledky her", "Events, fame, heroes, results"] },
      { go: "obyvatele", ic: "👥", obr: "domov/nahled-radnice-obyvatele", n: ["Obyvatelé", "Townsfolk"], d: ["Kdo ve městě žije", "Who lives in town"] },
      { go: "poradi", ic: "📜", obr: "domov/nahled-radnice-poradi", n: ["Pořadí týdne", "Weekly ranking"], d: ["Nejlepší hrdinové", "Best heroes"] },
    ] },
  "radnice-rychtar": { img: "mesto-radnice", n: ["Rychtář", "Reeve"], say: ["Rychtář: „Pokuty se platí, daně taky. A kdo chce být měšťanem, ať se ukáže.“", "Reeve: \"Fines get paid, and so do taxes. Want to be a burgher? Show yourself.\""],
    opts: [
      { panel: "fine", ic: "⚖️", obr: "domov/nahled-rychtar-pokuty", n: ["Pokuty a hledanost", "Fines and bounties"], d: ["Zaplatit pokutu, kdo je hledaný", "Pay fines, who is wanted"] },
      { panel: "listiny", ic: "📜", obr: "domov/nahled-rychtar-listiny", n: ["Listiny a důkazy", "Documents"], d: ["Rychtář zaplatí za vzkazy lapků, rozkazy, účty i odznaky", "The reeve pays for evidence and badges"] },
      { go: "vydaje", ic: "🧾", obr: "domov/nahled-rychtar-vydaje", n: ["Výdaje a dluhy", "Bills and debts"], d: ["Co se strhává každý týden", "What is paid every week"] },
      { panel: "titles", ic: "🏛️", obr: "domov/nahled-rychtar-pravo", n: ["Měšťanské právo", "Citizenship"], d: ["Staň se měšťanem", "Become a burgher"] },
      { go: "erb", ic: "🛡️", obr: "domov/nahled-rychtar-erb", n: ["Erb", "Coat of arms"], d: ["Navrhni si vlastní erb", "Design your own arms"],
        lock: (m) => !m.citizen && !m.has_arms, why: () => ["Erb dostane jen měšťan — nejdřív získej měšťanské právo.", "Only burghers get arms — gain citizenship first."] },
    ] },
  chram: { img: "mesto-chram", n: ["Chrám svaté Barbory", "Church of St Barbara"], say: ["Kněz: „Pokoj s tebou. Modlit se můžeš jednou za den.“", "Priest: \"Peace be with you. You may pray once a day.\""],
    opts: [
      { go: "misto/chram-pozehnani", ic: "🙏", obr: "domov/nahled-chram-pozehnani", n: ["Požehnání", "Blessings"], d: ["Síla, ochrana, moudrost", "Strength, protection, wisdom"] },
      { act: "pray:uzdraveni", ic: "❤️", obr: "domov/nahled-chram-uzdraveni", n: ["Uzdravení", "Healing"], d: ["+25 % životů hned", "+25% health now"] },
      { go: "dar/chram", ic: "🎁", obr: "domov/nahled-chram-dar", n: ["Dar kostelu", "Gift to the church"], d: ["Pro dobrou pověst", "For your reputation"] },
      { panel: "svatba", ic: "💍", obr: "domov/nahled-chram-snatek", n: ["Sňatek", "Wedding"], d: ["Muž a žena před oltářem, oba musí souhlasit", "A man and a woman, both must agree"] },   // r27-37
    ] },
  "chram-pozehnani": { img: "mesto-chram", n: ["Požehnání", "Blessings"], say: ["Kněz: „Pomodli se, synu. O jedno požehnání denně smíš prosit.“", "Priest: \"Pray, my child. One blessing a day.\""],
    opts: [
      { act: "pray:sila", ic: "💪", obr: "domov/nahled-pozehnani-sily", n: ["Požehnání síly", "Blessing of strength"], d: ["+1 k útoku na výpravu", "+1 attack next expedition"] },
      { act: "pray:ochrana", ic: "🛡️", obr: "domov/nahled-pozehnani-ochrany", n: ["Požehnání ochrany", "Blessing of protection"], d: ["+1 k obraně na výpravu", "+1 defence next expedition"] },
      { act: "pray:moudrost", ic: "📖", obr: "domov/nahled-pozehnani-moudrosti", n: ["Požehnání moudrosti", "Blessing of wisdom"], d: ["+1 ke zkouškám", "+1 to checks"] },
    ] },
  lazne: { img: "mesto-lazebnik", n: ["Lazebník", "Barber and bathhouse"], say: ["Lazebník: „Oholit, ostříhat, nebo rovnou do škopku?“", "Barber: \"A shave, a haircut, or straight into the tub?\""],
    opts: [
      { cid: "ks:barber:vlasy", ic: "✂️", obr: "domov/nahled-lazne-uces", n: ["Účes", "Haircut"], d: ["Nový střih", "A new cut"] },
      { cid: "ks:barber:barva vlasů", ic: "🎨", obr: "domov/nahled-lazne-barva-vlasu", n: ["Barva vlasů", "Hair colour"], d: ["Odbarvit nebo obarvit", "Change the colour"] },
      { cid: "ks:barber:vousy", ic: "🪒", obr: "domov/nahled-lazne-vousy", n: ["Vousy", "Beard"], d: ["Oholit nebo zastřihnout", "Shave or trim"] },
      { cid: "ks:barber:barva vousů", ic: "🎨", obr: "domov/nahled-lazne-barva-vousu", n: ["Barva vousů", "Beard colour"], d: ["Obarvit vousy", "Dye the beard"] },
    ] },
  banka: { redirect: "panel/bank", img: "mesto-banka", n: ["Směnárna", "Money changer"], say: ["Směnárník: „Co uložíte u mě, to na výpravě neztratíte.“", "Changer: \"What you leave with me, you won't lose on the road.\""],
    opts: [
      { panel: "bank", ic: "🏦", n: ["Uložit, vybrat, půjčit", "Deposit, withdraw, borrow"], d: ["Groše ve směnárně jsou v bezpečí", "Coins in the bank are safe"] },
    ] },
  kolbiste: { img: "mesto-kolbiste", n: ["Kolbiště", "Arena"], say: ["Mistr kolbiště: „Kdo si troufne?“", "Arena master: \"Who dares?\""],
    opts: [
      { go: "souboje", ic: "👁️", obr: "domov/nahled-kolbiste-souboje", n: ["Probíhající souboje", "Duels in progress"], d: ["Dívej se a vsaď si", "Watch and place bets"] },
      { cid: "ks:duel:menu", ic: "⚔️", obr: "domov/nahled-kolbiste-vyzva", n: ["Vyzvat na souboj", "Challenge to a duel"], d: ["Souboj 1 na 1 o hodnost", "One on one for rank"] },
      { cid: "ks:duel:ladder", ic: "🏆", obr: "domov/nahled-kolbiste-zebricek", n: ["Žebříček", "Ladder"], d: ["Hodnosti a pořadí", "Ranks and standings"] },
    ] },
  zverinec: { img: "mesto-zverinec", n: ["Zvěřinec", "Menagerie"], say: ["Zvěřinec: „Každé zvíře si najde svého pána.“", "Keeper: \"Every animal finds its master.\""],
    opts: [ { go: "zverinec", ic: "🐾", n: ["Mláďata na prodej", "Young animals for sale"], d: ["Prohlédni si zvířata a kup mládě", "See the animals, buy a young one"] },
      { go: "povoz", ic: "🐴", n: ["Povoz s koněm", "Horse and cart"], d: ["Odveze z výpravy, co se nevejde do batohu", "Hauls home what your pack can't hold"] } ] },   // r27-6: mazlíčci jsou v záložce Mazlíček
  brana: { img: "mesto-brana", n: ["Městská brána", "Town gate"], say: ["Strážný: „Kam to bude, na stezky?“", "Guard: \"Off to the trails, then?\""],
    opts: [
      { sect: ["Ven z města · Stezky", "Out of town · Trails"] },                 // r27-41: dlaždice s náhledem a krátkým popisem
      { go: "vyprava", ic: "🗺️", obr: "vypravy/rataje-01", n: ["Výprava", "Expedition"], d: ["Sám nebo s družinou do lesů, dolů a na hrad. Boje, truhly, kořist — vrať se, než vyprší čas.", "Solo or with a party into woods, mines, camps and castles."] },
      { soon: true, ic: "📜", obr: "pribehy/pribeh-klaster", n: ["Dobrodružství", "Adventure"], d: ["Příběhová kampaň na pokračování — rozhovory, hádanky, volby s následky pro celé město. Už brzy.", "A story campaign with choices and consequences. Coming soon."] },
      { panel: "trails", ic: "🗡️", obr: "situace/sit-setkani", oddel: true, n: ["Na stezkách", "On the trails"], d: ["Po stopách cizí výpravy: přepadnout, obchodovat, nebo minout. Od 4. úrovně.", "Follow another expedition: ambush, trade or pass by."] },
      { sect: ["Za hradbami", "Outside the walls"] },          // r27-4: vidět jsou vždy, otevřít jdou až po koupi
      ...PODNIK_KARTY.map((o) => ({ ...o, n: { podnikprace: ["Výroba na usedlosti", "Farm crafting"], podnikuloziste: ["Komora usedlosti", "Farm storage"], podnikstav: ["Stav usedlosti", "Farm upkeep"] }[o.go], when: (m) => m.origin === "sedlak" && m.business })),
      { go: "statek", ic: "🌾", obr: "domov/podnik-usedlost", n: ["Usedlost", "Farmstead"], d: ["Statek sedláka: pole, chlév, dvůr a výroba.", "The peasant's farm: fields, barn, yard"],
        lock: (m) => !(m.origin === "sedlak" && m.business), why: (m) => m.origin === "sedlak" ? ["Usedlost si koupíš na radnici (Nemovitosti → Koupit podnik).", "Buy the farmstead at the town hall."] : ["Usedlost je podnik pro sedláky.", "The farmstead belongs to peasants."] },
      { go: "domov", ic: "🛖", obr: "domov/chalupa-venku", n: ["Chalupa", "Cottage"], d: ["Roubená chalupa: spánek, jídlo ze spíže, vaření a truhla.", "Log cottage outside the walls"],
        lock: (m) => m.house !== "chalupa", why: () => ["Chalupu si koupíš na radnici (Nemovitosti → Koupit dům).", "Buy the cottage at the town hall."] },
      { go: "uloziste", ic: "📦", obr: "domov/nahled-dum-uloziste", n: ["Komora chalupy", "Cottage storage"], d: ["Truhly a spíž s obsahem", "Chests and pantry"], when: (m) => m.house === "chalupa" },
      { go: "stavdomu", ic: "🧹", obr: "domov/nahled-dum-stav", n: ["Stav chalupy", "Cottage upkeep"], d: ["Úklid a spravování střechy", "Cleaning and roof repairs"], when: (m) => m.house === "chalupa" },
      { go: "prodejdomu", ic: "📜", obr: "domov/nahled-dum-prodej", n: ["Prodat či darovat chalupu", "Sell or give away"], d: ["Radnici, městu nebo jinému hráči", "To the town hall, the town or a player"], when: (m) => m.house === "chalupa" },
      { go: "podnik", ic: "🗡️", obr: "domov/podnik-doupe", n: ["Doupě", "The den"], d: ["Lapkovská skrýš: kořist, šperháky a výroba.", "Hideout outside the walls"],
        lock: (m) => !(m.origin === "lapka" && m.business), why: (m) => m.origin === "lapka" ? ["Doupě si koupíš na radnici (Nemovitosti → Koupit podnik).", "Buy the den at the town hall."] : ["Doupě patří lapkům.", "The den belongs to bandits."] },
      { cid: "ks:porter:menu", ic: "📦", n: ["Kořist u brány", "Loot at the gate"], d: ["Co se po výpravě nevešlo — vzít, prodat nebo nechat odnést", "What didn't fit after the expedition"], when: (m) => m.nosic > 0 },
      { cid: "ks:gate:steal", ic: "🕵️", n: ["Věci u brány", "Things at the gate"], d: ["Lapka se prohrabe zapomenutým", "A bandit rummages through left goods"], when: (m) => m.origin === "lapka" },
    ] },
  dum: { img: "mesto-dum", n: ["Měšťanský dům", "Burgher house"], say: ["Tvůj vlastní kout v Kutné Hoře.", "Your own corner of Kutná Hora."],
    opts: [
      { go: "domov", ic: "🏡", obr: "domov/dum-svetnice", n: ["Domov", "Home"], d: ["Spánek, jídlo, truhla, vaření, nábytek", "Sleep, food, chest, cooking, furniture"], when: (m) => m.house === "dum" },
      { go: "uloziste", ic: "📦", obr: "domov/nahled-dum-uloziste", n: ["Úložný prostor", "Storage"], d: ["Truhly, skříně a spíž s obsahem", "Chests, wardrobes and pantry"], when: (m) => m.house === "dum" },
      { go: "stavdomu", ic: "🧹", obr: "domov/nahled-dum-stav", n: ["Stav domu", "House upkeep"], d: ["Čistota a opravy — bonusy i postihy", "Cleanliness and repairs"], when: (m) => m.house === "dum" },
      { go: "prodejdomu", ic: "📜", obr: "domov/nahled-dum-prodej", n: ["Prodat či darovat", "Sell or give away"], d: ["Radnici, městu nebo jinému hráči", "To the town hall, the town or a player"], when: (m) => m.house === "dum" },
    ] },
  paserak: { redirect: "obchod/Pašerák", img: "mesto-paserak", n: ["Pašerák", "Smuggler"], say: ["Pašerák: „Nikdo nás neviděl, jasný?“", "Smuggler: \"Nobody saw us, right?\""],
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
  if (!innerWidth) return document.documentElement.classList.contains("mobil");   // 1.0-2-3: okno se šířkou 0 (minimalizované, na pozadí) nerozhoduje
  return matchMedia("(max-width:760px)").matches || (matchMedia("(pointer:coarse)").matches && Math.min(screen.width, screen.height) <= 540);
}
function nastavZobrazeni() {
  // 1.0-2-3: minimalizované / skryté okno nebo karta otevřená na pozadí má chvíli šířku 0 — podle toho se rozložení nemění
  if (ZOBR.pref === "auto" && (!innerWidth || document.visibilityState === "hidden")) return false;
  const m = jeMobil(), byl = document.documentElement.classList.contains("mobil");
  document.documentElement.classList.toggle("mobil", m);
  document.documentElement.classList.toggle("mobil-vynucen", m && ZOBR.pref === "tel");
  const nav = document.querySelector(".tabs");
  if (nav) document.documentElement.style.setProperty("--nav-h", (m ? nav.offsetHeight : 0) + "px");
  return m !== byl;
}
nastavZobrazeni();
/* 1.0-2-3: na PC se občas zůstalo v mobilním rozložení (okno bylo při načtení na chvíli úzké nebo skryté
   a po návratu se už nepřekreslilo). Rozložení se teď ověří i po načtení, návratu na kartu a obnově z historie. */
let zobrCas = 0;
function hlidejZobrazeni() {
  clearTimeout(zobrCas);
  zobrCas = setTimeout(() => { if (nastavZobrazeni() && typeof render === "function" && S.me) render(); }, 120);
}
addEventListener("resize", hlidejZobrazeni);
addEventListener("load", hlidejZobrazeni);
addEventListener("pageshow", hlidejZobrazeni);
addEventListener("focus", hlidejZobrazeni);
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") hlidejZobrazeni(); });

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
  const zamceno = (id) => !S.me.zk_vse && !!(ZAMEK[id] && ZAMEK[id]());   // 1.0-1-6: zkušební „vidět vše“ — nic zamčeného
  const ZAMEK_TXT = { dum: ["Zamčeno. Měšťanský dům si můžeš koupit na radnici.", "Locked. You can buy the burgher house at the town hall."],
    ...Object.fromEntries(Object.entries(PODNIK_MISTA).map(([id, [o, jm]]) => [id, S.me.origin === o
      ? ["Zamčeno. " + jm[0] + " si koupíš na radnici (Nemovitosti → Koupit podnik).", "Locked. Buy the " + jm[1] + " at the town hall."]
      : [jm[2] + " je podnik pro jiný původ postavy." + (id === "kovar" ? " Kováře a jeho zboží najdeš na tržišti." : ""), "This business belongs to another origin."]])) };
  sc.pic.insertAdjacentHTML("beforeend", SPOTS.map((p) => `<button class="spot${PLACES[p.id] ? "" : " later"}${zamceno(p.id) ? " zamceno" : ""}" data-spot="${p.id}" data-kraj="${p.x < 13 ? "l" : p.x > 87 ? "r" : ""}"${p.nad ? " data-nad" : ""} style="left:${p.x}%;top:${p.y}%"><span${p.nadY ? ` style="--nadY:${p.nadY}px"` : ""}>${esc(L(p.n))}</span></button>`).join(""));
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
    const pm = PODNIK_MISTA[b.dataset.spot];                // 1.0-1-6: zkušební „vidět vše“ — cizí podnik: zkušební postava se na něj přepne
    if (S.me.zk_vse && pm && !(S.me.origin === pm[0] && S.me.business)) {
      (async () => { try { const x = await call("admin", { action: "zk_podnik", data: { typ: pm[0] } }); toast(noEmoji(x.text || ""));
        const me = await call("me", {}, true); if (me && me.name) S.me = me; go("misto/" + b.dataset.spot); } catch {} })();
      return;
    }
    go(p.redirect || "misto/" + b.dataset.spot);
  });
};

/** r27-31: cesta pověsti na radnici — kde hráč je mezi stupni Neznámý → Slavný a kolik chybí do dalšího. */
function povestHtml() {
  const P = (S.me.profil || {}).povest;
  if (!P) return "";
  const st = P.stupne, b = P.body, n = st.length - 1;
  let i = st.findIndex(([p]) => p > b); if (i < 0) i = n + 1;      // stupně stejně daleko od sebe, výplň uvnitř úseku podle bodů
  const pct = i > n ? 100 : i === 0 ? 0 : 100 * ((i - 1) + (b - st[i - 1][0]) / (st[i][0] - st[i - 1][0])) / n;
  const ted = i > 0 ? st[Math.min(i, n + 1) - 1] : null, dalsi = st[i];
  const rozpis = [L(["Pověst roste zakázkami z nástěnky, výpravami, pány míst, souboji na kolbišti, dary, modlitbami, prací v hostinci, včas zaplaceným desátkem, dražbami, úkoly radnice a pomocí padlým. Zločiny a dluhy ji kazí.", "Renown grows with jobs, expeditions, bosses and donations."])]
    .concat((P.rozpis || []).map(([d, v]) => `${d}: ${v > 0 ? "+" : ""}${v}`)).join("\n");
  return `<div class="povest panel" title="${esc(rozpis)}">
    <div class="spread"><b>${esc(L(["Pověst ve městě", "Renown"]))}: ${esc(ted ? ted[1] : L(["Pochybná", "Dubious"]))} · ${b} ${esc(L(["b.", "pts"]))}</b>
      <small class="muted">${esc(dalsi ? L([`do stupně ${dalsi[1]} chybí ${dalsi[0] - b} b.`, `${dalsi[0] - b} pts to ${dalsi[1]}`]) : L(["nejvyšší stupeň", "top rank"]))}</small></div>
    <div class="pv-cesta"><div class="pv-fill" style="width:${pct.toFixed(1)}%"></div>
      ${st.map(([p, nm], k) => `<span class="pv-stupen${b >= p ? " on" : ""}" style="left:${(100 * k / n).toFixed(1)}%" title="${esc(nm + ": " + ((P.stupne_vyhody || [])[k] || ""))}"><i></i><em>${esc(nm)} <small>${p}</small></em></span>`).join("")}</div>
    ${P.vyhody ? `<div class="pv-vyhody"><b>${esc(L(["Výhody ve městě:", "Town perks:"]))}</b> ${esc(P.vyhody)}${dalsi && (P.stupne_vyhody || [])[i] ? ` <span class="muted">· ${esc(L([`jako ${dalsi[1]}: `, `as ${dalsi[1]}: `]) + P.stupne_vyhody[i])}</span>` : ""}</div>` : ""}</div>`;
}

VIEWS.misto = (view) => {
  const p0 = PLACES[S.arg];
  const p = p0 && S.me.podnik_jmeno && BIZ_BACK[S.me.origin] === "misto/" + S.arg && S.arg !== "brana" ? { ...p0, n: [S.me.podnik_jmeno, S.me.podnik_jmeno] } : p0;   // 1.0-1: vlastní jméno podniku
  if (!p || (S.arg === "dum" && S.me.house !== "dum") || (PODNIK_ZAMEK[S.arg] && PODNIK_ZAMEK[S.arg]())) { go("mesto"); return; }
  if (p.redirect) { go(p.redirect); return; }
  if (typeof DOMOV !== "undefined") DOMOV.zpet = S.arg === "dum" || S.arg === "brana" ? "misto/" + S.arg : "";   // 1.0-1-5: kam vede Zpět z podstránek domova
  const card = (o) => {
    if (o.shop) {
      const u = SHOPS_UI[o.shop] || {};
      const nm = (S.shops || []).find((x) => x.id === o.shop)?.name || o.shop;
      return `<button class="opt" data-go="${esc(o.go)}"><span class="ic">${u.ic || "⚖️"}</span><b>${esc(nm)}</b></button>`;
    }
    if (o.obr) {                                              // r27-41: dlaždice s malovaným náhledem a krátkým popisem
      const zam = o.lock && o.lock(S.me), pozdeji = o.soon;
      const target = zam ? `data-zamek="${esc(L(o.why(S.me)))}"` : pozdeji ? "data-soon" : o.act ? `data-act="${esc(o.act)}"` : o.panel ? `data-panel="${esc(o.panel)}"` : o.cid ? `data-pcid="${esc(o.cid)}"` : `data-go="${esc(o.go)}"`;
      return `<button class="opt obr-karta${zam ? " zamceno" : ""}${pozdeji ? " vyvoj" : ""}${o.oddel ? " oddel" : ""}" ${target}><span class="ok-obr">${IMG(typeof o.obr === "function" ? o.obr() : o.obr)}${zam || pozdeji ? `<i class="ok-zamek">🔒 ${esc(pozdeji ? L(["Už brzy", "Coming soon"]) : L(["Zamčeno", "Locked"]))}</i>` : ""}</span>
        <span class="ok-txt"><b>${esc(L(o.n))}</b><small>${esc(L(o.d))}</small></span></button>`;
    }
    if (o.lock && o.lock(S.me)) return `<button class="opt zamceno" data-zamek="${esc(L(o.why(S.me)))}"><span class="ic">${o.ic}</span><b>${esc(L(o.n))}</b><small>${esc(L(["Zamčeno — ", "Locked — "]) + L(o.d))}</small></button>`;
    const target = o.soon ? "data-soon" : o.act ? `data-act="${esc(o.act)}"` : o.panel ? `data-panel="${esc(o.panel)}"` : o.cid ? `data-pcid="${esc(o.cid)}"` : `data-go="${esc(o.go)}"`;
    return `<button class="opt${o.soon ? " later" : ""}" ${target}><span class="ic">${o.ic}</span><b>${esc(L(o.n))}</b><small>${esc(o.soon ? t("soon_short") : L(o.d))}</small></button>`;
  };
  const opts = p.opts.filter((o) => !o.when || o.when(S.me));
  let mriz = "", skup = [];                                   // r27-4: volby po oddílech (sect)
  const vylij = () => { if (skup.length) mriz += `<div class="opts${skup.length > 9 && skup.every((o) => o.obr) ? " husta" : ""}${p.male ? " male" : ""}">${skup.map(card).join("")}</div>`; skup = []; };   // 1.0-1: hodně dlaždic (tržiště) = 4 vedle sebe
  opts.forEach((o) => { if (o.sect) { vylij(); mriz += `<div class="sect">${esc(L(o.sect))}</div>`; } else skup.push(o); });
  vylij();
  view.replaceChildren(h(`${sceneHead(p.img, L(p.n), L(p.say))}
    ${S.me.on_raid ? `<div class="panel notice" style="margin:14px 0">🗺️ ${esc(t("on_raid"))}</div>` : ""}
    ${S.arg === "radnice" ? povestHtml() : ""}
    <div class="misto-obal"><div class="misto-volby">${mriz}</div></div>
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
  vejdiObchod(".misto-volby");   // 1.0-1: hodně voleb (radnice) — posouvá se jen seznam, ne stránka
  if (!S.shops && p.opts.some((o) => o.shop)) call("shops", {}, true).then((r) => { S.shops = r.shops; if (S.tab === "misto") render(); }).catch(() => {});
};

// --- r27-3: všechno jako na Discordu — panel místa nebo osobní věci, ovládaný stejným kódem jako na Discordu
const PANEL = { back: "", arg: "" };
const PANEL_IMG = { svatba: "mesto-chram", townhall: "mesto-radnice", inn: "mesto-hostinec", market: "mesto-trziste", menagerie: "mesto-zverinec", pets: "mesto-zverinec",
  arena: "mesto-kolbiste", temple: "mesto-chram", donate_church: "mesto-chram", barber: "mesto-lazebnik", trails: "mesto-brana",
  bank: "mesto-banka", bills: "mesto-radnice", board: "mesto-hostinec", lodging: "mesto-pokoj", innchest: "mesto-hostinec", burgle: "mesto-hostinec",
  learn: "mesto-hostinec", smuggler: "mesto-paserak", carpenter: "mesto-trziste", titles: "mesto-radnice", fine: "mesto-radnice",
  week: "mesto-radnice", people: "mesto-radnice", donate_town: "mesto-radnice", houses: "mesto-radnice" };
const PANEL_BACK = { inn: "misto/hostinec", lodging: "misto/hostinec", board: "misto/hostinec", innchest: "misto/hostinec", learn: "misto/hostinec",
  burgle: "misto/hostinec", market: "misto/trziste", carpenter: "misto/trziste", bank: "misto/banka", bills: "misto/radnice-rychtar", fine: "misto/radnice-rychtar", titles: "misto/radnice-rychtar", temple: "misto/chram",
  donate_church: "misto/chram", barber: "misto/lazne", pets: "misto/zverinec", menagerie: "misto/zverinec", arena: "misto/kolbiste",
  trails: "misto/brana", smuggler: "obchod/Pašerák", home: "domov" };
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
  if (r.mission && r.mission.status === "active" && !S.me.on_raid) { toast(L(["Výprava začala — jdeš na bránu.", "The expedition has started."])); presmeruj("vyprava"); return; }
  if (r.modal) { showForm(r.modal, key); return; }
  if (r.panel && /^#\s*🧾\s*Výdaje/.test(r.panel.content || "")) { presmeruj("vydaje"); return; }
  if (r.panel && /^#\s*\S*\s*Domy na prodej/.test(r.panel.content || "")) { presmeruj("domy"); return; }   // 1.0-1: domy jako karty s náhledem   // r27-6: výdaje mají vlastní zobrazení
  { const c0 = (r.panel && r.panel.content) || "";
    if (/^#\s*\S*\s*Obyvatelé Kutné Hory/.test(c0)) { presmeruj("obyvatele"); return; }
    if (/^#\s*\S*\s*Pořadí tohoto týdne/.test(c0)) { presmeruj("poradi"); return; }
    if (/^#\s*\S*\s*Vztahy\s*$/m.test(c0.split("\n")[0])) { DENIK.sekce = "vztahy"; presmeruj("denik"); return; }   // r27-40: vztahy mají na webu kapitolu v deníku
    if (/^#\s*\S*\s*Dar (městu|kostelu)/.test(c0) && !/✅|Děkuj/.test(c0)) { presmeruj(/kostelu/.test(c0.split("\n")[0]) ? "dar/chram" : "dar/mesto"); return; } }
  if (key === "domovsub" && S.tab === "domov" && !r.modal && !/^#/.test((r.panel && r.panel.content) || "")) {   // 1.0-1: hotovo → zpět na přehled domova
    const c = (r.panel && r.panel.content) || ""; if (c) toast(noEmoji(c).replace(/\*\*/g, ""));
    domovPrehled(); return;
  }
  if (r.panel && /^#\s*\S*\s*Truhlář/.test(r.panel.content || "")) {   // 1.0-1: po koupi nábytku jen krátká zpráva, okno zůstane stejné
    const ok = (r.panel.content.split("\n").find((x) => /^✅/.test(x.trim())) || "");
    if (ok) { toast(noEmoji(ok).replace(/\*\*/g, "").trim()); Zvuk.sfx("mince"); }
    r = { ...r, panel: { ...r.panel, content: r.panel.content.split("\n").filter((x) => !/^✅/.test(x.trim())).join("\n") } };
  }
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
  noclehObr(box);   // r27-41
  listinyVzhled(box);   // r27-42: listiny pro rychtáře jako karty
  stezkyZalozky(box);   // r27-42: Na stezkách na záložky
  setTimeout(() => { if ($("#view.rozdel")) vejdiObchod("#view.rozdel .dpanel .dtext"); }, 50);   // r27-41: stránka se neposouvá — dlouhé okno se posouvá uvnitř
  wireLazebna(box);
  truhlarNabidka(box);   // r27-40: truhlář — karty s náhledem nábytku, místností a účinkem
  setTimeout(() => vejdiObchod(".volby-blok .vp-volby"), 60);   // r27-40/42: každá nabídka (i krátká, např. Vydražit předmět) se posouvá uvnitř, ne celá stránka: dlouhé nabídky se posouvají uvnitř, ne celá stránka
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
// r27-41: nocleh v hostinci — každé místo spaní s malovaným náhledem
const NOCLEH_OBR = [[/za hostincem/i, "domov/nocleh-za-hostincem"], [/stáj/i, "domov/nocleh-staj"], [/luxusní/i, "domov/nocleh-luxus"], [/pronajmout pokoj|^pokoj/i, "domov/nocleh-pokoj"]];
// r27-42: nocleh na záložky podle kapsy — Chudina (za hostincem, stáj) · Měšťané (pokoj) · Panstvo (luxus); karty s náhledem jako u koupě domu
const NOCLEH_VRSTVY = [["chudina", ["Chudina", "The poor"], /za hostincem|stáj/i], ["mestane", ["Měšťané", "Burghers"], /pronajmout pokoj|^pokoj/i], ["panstvo", ["Panstvo", "Nobility"], /luxusní/i]];
let NOCLEH_ZAL = "chudina";
// r27-42: Na stezkách — panel na záložky (Na cestě · Hledaní · Jak to chodí)
let STEZKY_ZAL = 0;
function stezkyZalozky(box) {
  const dt = box.querySelector(".dtext"); if (!dt || box.querySelector(".pz-zal")) return;
  const h3 = [...dt.querySelectorAll(":scope > h3")];
  if (!h3.some((h) => /Právě na cestě|On the road/i.test(h.textContent))) return;
  const uvod = []; for (let n = dt.firstChild; n && n !== h3[0]; n = n.nextSibling) uvod.push(n);
  const casti = h3.map((h, i) => { const obs = []; for (let n = h.nextSibling; n && n !== h3[i + 1]; n = n.nextSibling) obs.push(n); return [h.textContent.replace(/\s*—.*$/, "").trim(), obs]; });
  casti.push([L(["Jak to chodí", "How it works"]), uvod]);
  const zal = document.createElement("div"); zal.className = "pz-zal";
  const str = casti.map(([jm, obs], i) => { const d = document.createElement("div"); d.className = "pz-strana"; d.append(...obs); return d; });
  zal.innerHTML = casti.map(([jm], i) => `<button type="button" class="chip" data-pz="${i}">${esc(jm)}</button>`).join("");
  dt.replaceChildren(zal, ...str);
  const ukaz = (i) => { STEZKY_ZAL = i; zal.querySelectorAll("[data-pz]").forEach((b) => b.classList.toggle("on", +b.dataset.pz === i)); str.forEach((d, k) => { d.hidden = k !== i; }); };
  zal.querySelectorAll("[data-pz]").forEach((b) => b.onclick = () => { Zvuk.sfx("klik"); ukaz(+b.dataset.pz); });
  ukaz(Math.min(STEZKY_ZAL, str.length - 1));
}
// r27-42: Listiny pro rychtáře — rychtář s citátem, co vykupuje, a listiny jako karty s cenou
function listinyVzhled(box) {
  const dt = box.querySelector(".dtext"); if (!dt || !/Co víš o lapcích/.test(dt.textContent)) return;
  if (box.querySelector(".listiny")) return;
  const tl = [...box.querySelectorAll("button.vbtn")].filter((b) => /odevzdat za/i.test(b.textContent));
  const karty = tl.map((b) => { const m = /^\s*(?:📜\s*)?(.+?)(?:\s*×(\d+))?\s*·\s*odevzdat za\s*(\d+)\s*gr/i.exec(noEmoji(b.textContent)) || [];
    const jm = (m[1] || b.textContent).trim();
    return `<div class="li-karta"><img class="li-ik" alt="" src="${IMG_BASE}predmety/ikony/${Postava.slug(jm)}.webp" data-skryt-pri-chybe>
      <div><b>${esc(jm)}</b>${m[2] ? ` <span class="muted">× ${m[2]}</span>` : ""}<small>${esc(L(["rychtář dá ", "the reeve pays "]) + (m[3] || "?") + " gr. · +1 pověst")}</small></div><span class="li-tl"></span></div>`; });
  const pozn = [...dt.querySelectorAll("p, .radek")].find((x) => /^(✅|Odevzdáno|Rychtář si)/.test(x.textContent.trim()));
  const w = document.createElement("div"); w.className = "listiny";
  w.innerHTML = `<div class="li-hlava"><div class="li-obr">${IMG("domov/nahled-rychtar-listiny")}</div>
      <div class="li-citat"><p>„Co víš o lapcích, žoldnéřích a falešné minci, to mi přines. Za dobrý papír zaplatím a město si to zapamatuje.“</p><small>— rychtář</small>
        <div class="li-chips"><span>📜 ${esc(L(["listina zůstane u rychtáře", "the document stays"]))}</span><span>🪙 ${esc(L(["groše za každou", "coins for each"]))}</span><span>⭐ ${esc(L(["+1 pověst", "+1 renown"]))}</span></div></div></div>
    ${karty.length ? `<div class="sect">${esc(L(["Co u sebe máš", "What you carry"]))}</div><div class="li-seznam">${karty.join("")}</div>`
      : `<div class="li-prazdno"><b>${esc(L(["Teď u sebe nemáš nic, co by ho zajímalo.", "You carry nothing of interest."]))}</b>
         <p>${esc(L(["Hledej na výpravách:", "Look on expeditions for:"]))}</p><div class="li-chips">${["Vzkaz lapků", "Rozkaz", "Účet z mincovny", "Deník"].map((x) => `<span>${esc(x)}</span>`).join("")}</div></div>`}`;
  if (pozn) w.prepend(pozn);
  dt.replaceChildren(w);
  const sloty = w.querySelectorAll(".li-tl");
  tl.forEach((b, i) => { b.textContent = L(["Odevzdat", "Hand over"]); b.classList.add("primary"); if (sloty[i]) sloty[i].append(b); });
  box.querySelectorAll(".vctl .vrow").forEach((r) => { if (!r.children.length) r.remove(); });
  box.classList.add("listiny-box");
}
function noclehObr(box) {
  const dt = box.querySelector(".dtext"); if (!dt) return;
  const z = [...dt.querySelectorAll(".zaznam")];
  if (!z.some((el) => /za hostincem/i.test(el.textContent)) || !z.some((el) => /stáj/i.test(el.textContent))) return;
  box.classList.add("nocleh", "nocleh2");
  const titul = (el) => ((el.querySelector(".z-hl b") || el.querySelector(".z-hl") || el).textContent || "").trim();
  const zal = document.createElement("div"); zal.className = "nocleh-zal";
  const obsah = document.createElement("div"); obsah.className = "nocleh-obsah";
  z[0].before(zal, obsah);
  for (const [id, jm, re] of NOCLEH_VRSTVY) {
    const moje = z.filter((el) => re.test(titul(el)));
    if (!moje.length) continue;
    const bt = document.createElement("button"); bt.type = "button"; bt.className = "chip"; bt.dataset.nz = id; bt.textContent = L(jm); zal.append(bt);
    const str = document.createElement("div"); str.className = "nocleh-strana" + (moje.length > 1 ? " dve" : ""); str.dataset.nz = id;
    for (const el of moje) {
      const o = NOCLEH_OBR.find(([r]) => r.test(titul(el)));
      const k = document.createElement("div"); k.className = moje.length > 1 ? "nabidka-karta" : "nabidka-jedna";
      k.innerHTML = `<div class="nk-obr">${o ? IMG(o[1]) : ""}</div><div class="nk-text"></div>`;
      const im = k.querySelector("img"); if (im) im.addEventListener("error", () => { im.src = IMG_BASE + "mesto-pokoj.webp"; }, { once: true });
      const akce = el.querySelector(".z-akce"); el.querySelectorAll(".nocleh-obr").forEach((x) => x.remove());
      k.querySelector(".nk-text").append(...[...el.childNodes].filter((n) => n !== akce));
      if (akce) { akce.querySelectorAll("button").forEach((x) => { x.classList.remove("small"); x.classList.add("primary"); }); k.querySelector(".nk-text").append(akce); }
      str.append(k); el.remove();
    }
    obsah.append(str);
  }
  obsah.querySelectorAll(".nk-text > *").forEach((x) => { if (/nenajíš|won't eat/i.test(x.textContent) && !x.querySelector("button")) { const kam = obsah.querySelector('.nocleh-strana[data-nz="chudina"]'); x.classList.add("nocleh-pozn"); (kam || obsah).append(x); } });
  const ukaz = (id) => { NOCLEH_ZAL = id; zal.querySelectorAll("[data-nz]").forEach((x) => x.classList.toggle("on", x.dataset.nz === id)); obsah.querySelectorAll(".nocleh-strana").forEach((x) => { x.hidden = x.dataset.nz !== id; }); };
  zal.querySelectorAll("[data-nz]").forEach((x) => x.onclick = () => { Zvuk.sfx("klik"); ukaz(x.dataset.nz); });
  ukaz(zal.querySelector(`[data-nz="${NOCLEH_ZAL}"]`) ? NOCLEH_ZAL : "chudina");
}
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
// r27-40: truhlář — každý kus nábytku jako karta: malovaný náhled (domov/nabytek-01/02, mřížka 3×3), cena, místnost a co dělá
const NABYTEK = ["Malá truhla", "Truhla", "Okovaná truhla", "Slamník", "Lůžko", "Lůžko s nebesy", "Pec s plotnou", "Spíž", "Stůl s lavicí",
  "Stojan na zbroj", "Stojan na zbraně", "Police na trofeje", "Vitrína odznaků", "Svícen", "Koberec"];
let TRUHLAR_ZAL = "světnice";
function truhlarNabidka(box) {
  const bloky = [...box.querySelectorAll('select[data-sel^="ks:house:furn"]')].map((sel) => truhlarBlok(sel)).filter(Boolean);
  if (!bloky.length) return;
  // 1.0-1: jedna nabídka na záložky podle místnosti (bez dvou posouvacích seznamů pod sebou)
  const hl = bloky[0], seznam = hl.querySelector(".vp-volby");
  bloky.slice(1).forEach((b) => { b.querySelectorAll("[data-volba]").forEach((x) => seznam.appendChild(x)); b.remove(); });
  hl.querySelector(".vv-hledat")?.remove();
  const sect = hl.querySelector(".sect"); if (sect) sect.textContent = L(["Co vyrobit a dovézt?", "What shall I make?"]);
  const tl = [...seznam.querySelectorAll("[data-volba]")];
  const mist = [...new Set(tl.map((b) => b.dataset.mist))];
  const zal = document.createElement("div"); zal.className = "bf-filtr tr-zal";
  zal.innerHTML = mist.map((m) => `<button type="button" class="chip" data-tz="${esc(m)}">${esc(L(ROOM_NAZ[m] || [m, m]))} <small>${tl.filter((b) => b.dataset.mist === m).length}</small></button>`).join("");
  const ukaz = (m) => { TRUHLAR_ZAL = m; tl.forEach((b) => { b.hidden = b.dataset.mist !== m; }); zal.querySelectorAll("[data-tz]").forEach((c) => c.classList.toggle("on", c.dataset.tz === m)); seznam.scrollTop = 0; };
  zal.querySelectorAll("[data-tz]").forEach((c) => c.onclick = () => { Zvuk.sfx("klik"); ukaz(c.dataset.tz); });
  (sect || hl.firstChild).after(zal);
  ukaz(mist.includes(TRUHLAR_ZAL) ? TRUHLAR_ZAL : mist[0]);
}
function truhlarBlok(sel) {   // 1.0-1: náhled = malovaný kus nábytku (domov/nab/…)
  const blok = (sel.closest(".vrow") || sel).nextElementSibling;
  if (!blok || !blok.classList.contains("volby-blok")) return null;
  blok.classList.add("truhlar");
  const info = {};
  [...sel.options].forEach((o) => { const [n, cena, rest = ""] = o.textContent.split(" — "); const [mist, ...u] = rest.split(" · "); info[o.value] = { n, cena, mist, u: u.join(" · ") }; });
  blok.querySelectorAll("[data-volba]").forEach((b) => {
    const f = info[b.dataset.volba]; if (!f) return;
    const i = NABYTEK.indexOf(b.dataset.volba);
    const nah = NAB_OBR[b.dataset.volba] ? `<span class="tr-nah tr-kus" style="background-image:url('${nabSrc(b.dataset.volba)}')"></span>`
      : i < 0 ? "" : `<span class="tr-nah" style="background-image:url('${IMG_BASE}domov/nabytek-0${i < 9 ? 1 : 2}.webp');background-position:${(i % 9) % 3 * 50}% ${Math.floor((i % 9) / 3) * 50}%"></span>`;
    b.dataset.mist = (f.mist || "").trim();
    b.innerHTML = `${nah}<span class="tr-txt"><b>${esc(f.n)}</b><small>${esc(f.u)}</small></span>
      <span class="tr-kup"><b>${esc(f.cena || "")}</b><em class="vv-akce">${esc(L(["Vyrobit", "Craft"]))}</em></span>`;
  });
  return blok;
}

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
      const T = [[/vzdát|vzdej/, "Vzdát se"], [/vydraž/, "Vydražit"], [/prod/, "Prodat"], [/použi/, "Použít"], [/kou[pk]/, "Koupit"], [/vyrob/, "Vyrobit"], [/ulož/, "Uložit"],
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
      `<button type="button" class="vp-volba" data-volba="${esc(o.value)}" data-q="${esc(noEmoji(lab + " " + desc).toLowerCase())}"${o.disabled ? " disabled" : ""}>${ik(lab)}<span><b>${esc(noEmoji(lab).trim())}</b>${desc && noEmoji(desc).trim() !== noEmoji(lab).trim() ? `<small>${esc(noEmoji(desc).trim())}</small>` : ""}</span><em class="vv-akce">${esc(sloveso)}</em></button>`).join("")}</div>`;   // r27-22: každá volba s ikonou (když ji věc má) a slovesem vpravo — jako řádky v obchodě
    wrap.querySelectorAll("[data-volba]").forEach((b) => b.onclick = () => { b.disabled = true; vyber(b.dataset.volba); });
    wrap.querySelectorAll(".vv-ik").forEach((im) => { const pryc = () => { im.remove(); };
      im.addEventListener("load", () => wrap.classList.add("s-ikonami")); im.addEventListener("error", pryc); if (im.complete && !im.naturalWidth) pryc(); });
    if (/vydraž|auction/i.test(ph)) {                    // 1.0-1: Vydražit předmět — filtr jako v batohu (Jídlo · Nářadí · Výzbroj · Ostatní)
      const inv = {}; ((S.me && S.me.inventory) || []).forEach((i) => { inv[i.id] = i; });
      const jm = (b) => noEmoji(b.querySelector("b")?.textContent || "").replace(/\s*[×x]\s*\d+.*$/, "").trim();
      const tl = [...wrap.querySelectorAll("[data-volba]")];
      tl.forEach((b) => { b.dataset.druh = druhVeci(inv[jm(b)]); });
      const pocet = (d) => d === "vse" ? tl.length : tl.filter((b) => b.dataset.druh === d).length;
      const f = document.createElement("div"); f.className = "bf-filtr vv-filtr";
      const ukaz = (d) => { BF.aukce = d; tl.forEach((b) => { b.hidden = d !== "vse" && b.dataset.druh !== d; });
        f.querySelectorAll("[data-vf]").forEach((c) => c.classList.toggle("on", c.dataset.vf === d)); };
      f.innerHTML = BF_DRUH.filter(([d]) => pocet(d)).map(([d, n]) => `<button type="button" class="chip" data-vf="${d}">${esc(L(n))} <small>${pocet(d)}</small></button>`).join("");
      f.querySelectorAll("[data-vf]").forEach((c) => c.onclick = () => ukaz(c.dataset.vf));
      wrap.querySelector(".sect").after(f);
      ukaz(pocet(BF.aukce || "vse") ? BF.aukce || "vse" : "vse");
    }
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
  const nadpis = dtext.querySelector("h3")?.textContent || document.querySelector(".scene-cap h2")?.textContent || "";   // r27-41: nadpis už bývá v obrázku nahoře
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
const BANKA_ZAL = { k: "ucet" };
// 1.0-1: zboží přes prostředníka (posel z hostince / pašerák v noci) od obchodníka, který s tebou nemluví
async function presKresli(box, shopId, kdo) {
  let r; try { r = await call("pres_nabidka", { shop: shopId, kdo }); } catch { return; }
  const kresli = (items) => {
    box.innerHTML = `<div class="panel vz-pres-list"><h4>${esc(kdo === "posel" ? L(["Posel z hostince", "Inn runner"]) : L(["Pašerák", "Smuggler"]))}</h4>
      ${items.length ? `<div class="vz-pres-mriz">${items.map((i) => `<button type="button" class="vz-pres-pol" data-pk="${esc(i.id)}">${icon(i.id)}<span>${esc(i.name)}</span><b>${i.price} gr.</b></button>`).join("")}</div>`
        : `<p class="muted">${esc(kdo === "paserak" && !r.noc ? L(["Pašerák chodí jen v noci (21:00–5:00).", "Night only."]) : L(["Dnes nic neobstará.", "Nothing today."]))}</p>`}</div>`;
    box.querySelectorAll("[data-pk]").forEach((b) => b.onclick = async () => {
      b.disabled = true;
      try { const x = await call("pres_koupit", { shop: shopId, kdo, item: b.dataset.pk }); toast(x.text); Zvuk.sfx("mince"); kresli(x.items); }
      catch { b.disabled = false; }
    });
  };
  kresli(r.items);
}

// 1.0-1: lichvář u hradeb — náhrada banky (záložka ve směnárně)
async function lichvarKresli(el, mod = "") {
  let r; try { r = await call("lichvar", {}, true); } catch { return; }
  const kresli = (x, text) => {
    const radek = (co, jm, max) => `<div class="bk-radek ${co}"><span class="bk-co">${esc(jm)}</span><div class="bk-castky">${[10, 50, 100, 500].filter((n) => n <= max).map((n) =>
      `<button class="btn small bk-castka ${co}" data-lv="${co}" data-c="${n}">${n}</button>`).join("")}${max > 0 ? `<button class="btn small bk-castka ${co}" data-lv="${co}" data-c="${max}">${esc(L(["vše", "all"]))}</button>` : ""}</div></div>`;
    const dl = (k, v) => `<div><small>${esc(L(k))}</small><b>${v} gr.</b></div>`;
    const U = mod !== "pujcka", P = mod !== "uschova";
    const pozn = [U ? L([`Úschovné ${x.uschovne} % za období. Asi ${x.riziko} % šance za období, že lichvář na čas zmizí i se čtvrtinou úschovy.`, `Fee ${x.uschovne} % per period; about ${x.riziko} % chance he vanishes for a while with a quarter of it.`]) : "",
      P ? L([`Úrok z půjčky ${x.urok} % za období. Dvě období bez splátky — pacholci si pro dluh přijdou sami.`, `Interest ${x.urok} % per period. Two periods unpaid and his thugs come for it.`]) : ""].filter(Boolean).join(" ");
    const prazdny = (jm) => `<div class="bk-radek"><span class="bk-co">${esc(jm)}</span><span class="muted small">${esc(L(["není co", "nothing"]))}</span></div>`;
    const rd = (co, jm, max) => max > 0 ? radek(co, jm, max) : prazdny(jm);
    el.innerHTML = `<div class="bk-t"><p>${esc(L(["Dům u hradeb. Lichvář se neptá, odkud groše máš — ale bere si víc a není jistý.", "The usurer by the walls. He doesn't ask where your coin comes from — but takes more and isn't safe."]))}</p>
      ${x.odmita ? `<p class="vz-odmita">${esc(x.odmita)}</p>` : ""}
      <div class="bk-dlazdice">${dl(["U sebe", "On hand"], x.coins)}${U ? dl(["V úschově", "Kept"], x.uschova) : ""}${P ? dl(["Dluh", "Debt"], x.dluh) + dl(["Půjčí až", "Lends up to"], x.limit) : ""}</div>
      <p class="muted small">${esc(pozn)}</p>
      ${text ? `<p><b>${esc(text)}</b></p>` : ""}</div>
      <div class="bk-b">${U ? rd("vlozit", L(["Uložit", "Deposit"]), x.coins) + rd("vybrat", L(["Vybrat", "Withdraw"]), x.uschova) : ""}
      ${!P ? "" : x.dluh ? rd("splatit", L(["Splatit", "Repay"]), Math.min(x.dluh, x.coins)) : rd("pujcit", L(["Půjčit", "Borrow"]), x.limit)}</div>`;
    const CO = { vlozit: "ulozit", vybrat: "vybrat", pujcit: "pujcit", splatit: "splatit" };
    el.querySelectorAll("[data-lv]").forEach((b) => b.onclick = async () => {
      b.disabled = true;
      try { const y = await call("lichvar_akce", { co: CO[b.dataset.lv], castka: Number(b.dataset.c) }); Zvuk.sfx("mince"); kresli(y.lichvar, y.text); }
      catch { b.disabled = false; }
    });
  };
  kresli(r.lichvar, "");
}
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
  wrap.querySelectorAll('[data-cid="ks:bank:jina"]').forEach((b) => b.remove());   // r27-39: na webu je políčko přímo v řádku
  // r27-37: v každém řádku i vlastní částka (políčko + OK) — nejen pevné 10 / 50 / 100 / 500
  Object.entries(radky).forEach(([k, r]) => {
    const prvni = r.querySelector("button[data-cid]"); if (!prvni) return;
    const pref = prvni.dataset.cid.replace(/:[^:]+$/, ":");
    const box2 = document.createElement("span"); box2.className = "bk-vlastni";
    box2.innerHTML = `<input type="number" min="1" step="1" inputmode="numeric" placeholder="${esc(L(["částka", "amount"]))}"><button class="btn small bk-castka ${k}" data-cid="${pref}0" disabled>OK</button>`;
    const inp = box2.querySelector("input"), ok = box2.querySelector("button");
    inp.oninput = () => { const v = Math.floor(Number(inp.value)); ok.disabled = !(v > 0); ok.dataset.cid = pref + (v > 0 ? v : 0); };
    inp.onkeydown = (e) => { if (e.key === "Enter" && !ok.disabled) ok.click(); };
    r.querySelector(".bk-castky").append(box2);
  });
  // r27-40: záložky Účet · Půjčka · Výhody a pravidla · Ostatní — bez posouvání, pole se nepřekrývají
  const vyh = document.createElement("section"); vyh.dataset.s = "vyhody"; vyh.innerHTML = `<h5>${esc(L(["Výhody a pravidla", "Perks and rules"]))}</h5><div class="bk-t"></div><div class="bk-b"></div>`;
  wrap.querySelectorAll('[data-s="ucet"] .bk-t > *, [data-s="pujcka"] .bk-t > *, [data-s="jine"] .bk-t > *').forEach((n) => {
    if (/Spoření|Splácení|Ještě \d|Každá včas|Upomínk|Desátek|Groše na účtu|Saving|Repay|Reminder|Tithe/i.test(n.textContent)) vyh.querySelector(".bk-t").append(n);
  });
  wrap.append(vyh);
  wrap.querySelectorAll("section").forEach((s) => { if (!s.querySelector(".bk-t").children.length && !s.querySelector(".bk-b").children.length) s.remove(); });
  const sekce = [...wrap.querySelectorAll("section")];
  const JM = { ucet: L(["Účet", "Account"]), pujcka: L(["Půjčka", "Loan"]), vyhody: L(["Výhody", "Perks"]), jine: L(["Ostatní", "Other"]), lichvar: L(["Lichvář", "Usurer"]) };
  if (sekce.length > 1) {
    const nav = document.createElement("nav"); nav.className = "bk-zalozky";
    nav.innerHTML = sekce.map((s) => `<button type="button" data-bkz="${s.dataset.s}">${esc(JM[s.dataset.s] || s.dataset.s)}</button>`).join("");
    const telo = document.createElement("div"); telo.className = "bk-telo"; telo.append(...sekce);
    wrap.querySelector(".bk-mriz")?.remove();
    wrap.append(nav, telo);
    const ukaz = (k) => { BANKA_ZAL.k = k; sekce.forEach((s) => { s.hidden = s.dataset.s !== k; }); nav.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.dataset.bkz === k));
      vejdiObchod(".dpanel .banka .bk-telo > section:not([hidden]) .bk-t"); };
    nav.querySelectorAll("button").forEach((b) => b.onclick = () => ukaz(b.dataset.bkz));
    ukaz(sekce.some((s) => s.dataset.s === BANKA_ZAL.k) ? BANKA_ZAL.k : sekce[0].dataset.s);
  }
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
  view.querySelector("[data-go]").onclick = () => { clearInterval(KOHOUT.timer); go("sazky"); };
  await cockLoad();
  KOHOUT.timer = setInterval(() => { if (S.tab !== "kohouti") { clearInterval(KOHOUT.timer); return; } cockLoad(true); }, 3000);
};

// r27-41: výzva hráče — vždy viditelný blok; vyzvat jde jen hráče, kteří jsou právě ve hře (web nebo Discord)
function vyzvaHraceHtml(pfx, hoste, vklad, co) {
  return `<div class="vyzva-hrace"><b>${esc(L(["Vyzvat hráče", "Challenge a player"]))}</b>
    ${hoste.length ? `<div class="row"><select id="${pfx}-hrac"><option value="">${esc(L(["Vyber soupeře…", "Pick an opponent…"]))}</option>${hoste.map((x) => `<option value="${esc(x.id)}">${esc(x.name + " · úr. " + x.level)}</option>`).join("")}</select>
      <button class="btn primary" id="${pfx}-vyzvi">${esc(L([`Vyzvat na ${co} o ${vklad} gr.`, `Challenge for ${vklad} gr.`]))}</button></div>
      <small class="muted">${esc(L(["Soupeř musí výzvu do 3 minut přijmout — přijde mu sem i do vlákna na Discordu.", "The opponent has 3 minutes to accept."]))}</small>`
    : `<small class="muted">${esc(L(["Teď není ve hře nikdo další. Vyzvat jde hráče, kteří jsou právě online (na webu nebo na Discordu v posledních 5 minutách) — seznam se sám obnovuje.", "Nobody else is online right now."]))}</small>`}</div>`;
}
// r27-41: Sázky — rozcestník tří aktivit s náhledy (kohoutí jáma, u soudku, na pěsti); každá má vlastní arénu
const SAZKY = [
  { go: "kohouti", obr: () => pitImg(S.me.night), n: ["Kohoutí jáma", "The cockpit"], d: ["Dva kohouti, tři minuty sázek a celé město kolem jámy. Rozhoduje rychlost, zuřivost a síla.", "Two cocks, three minutes of betting."], st: "cock" },
  { go: "skopek", obr: () => artReady("domov/sazky-soudek") ? "domov/sazky-soudek" : "domov/skopek-stul", n: ["U soudku", "At the barrel"], d: ["Pitná soutěž u dlouhého stolu — s hráčem nebo s násoskou Sudkem. Odolnost, návyk a kostky.", "Drinking contest — Endurance, habit and dice."], st: "skopek" },
  { go: "pesti", obr: () => artReady("domov/sazky-pesti") ? "domov/sazky-pesti" : "mesto-hostinec", n: ["Na pěsti", "Fist fight"], d: ["Pěstní souboj na dvoře za hostincem — s hráčem nebo s rváčem Medvědem. Obratnost trefuje, Síla bolí, Odolnost drží.", "Bare-knuckle fight — Agility hits, Strength hurts, Endurance holds."], st: "pesti" },
];
["domov/sazky-soudek", "domov/sazky-pesti", "bytosti/pesti-rvac-medved"].forEach((n) => setTimeout(() => artReady(n), 1500));
VIEWS.sazky = async (view) => {
  const src = (o) => o.startsWith("domov/") || o.startsWith("bytosti/") ? IMG_BASE + o + "-m.webp" : IMG_BASE + o + ".webp";
  view.replaceChildren(h(`<div class="sz-hub"><div class="skop-hlava" style="--obr:url('${IMG_BASE}mesto-hostinec.webp')"><h2>${esc(L(["Sázky", "Betting"]))}</h2><p>${esc(L(["Za hostincem se sází na všechno, co se hýbe.", "Behind the inn they bet on anything that moves."]))}</p></div>
    <div class="sz-karty">${SAZKY.map((a) => `<button class="sz-karta" data-go="${a.go}"><span class="sz-obr" style="background-image:url('${src(a.obr())}')"><i class="sz-stav" data-st="${a.st}"></i></span>
      <b>${esc(L(a.n))}</b><small>${esc(L(a.d))}</small></button>`).join("")}</div>
    <p><button class="btn" data-zpet>← ${esc(t("back"))}</button></p></div>`));
  view.querySelectorAll(".sz-karta").forEach((b) => b.onclick = () => { Zvuk.sfx("klik"); go(b.dataset.go); });
  view.querySelector("[data-zpet]").onclick = () => go("misto/hostinec");
  const stav = (el, txt) => { if (el && txt) { el.textContent = txt; el.classList.add("on"); } };
  call("cock", {}, true).then((r) => { const c = r.cock; stav(view.querySelector('[data-st="cock"]'), c && c.status === "betting" ? L(["sází se!", "betting!"]) : c && c.status === "fighting" ? L(["právě bojují", "fighting"]) : ""); }).catch(() => {});
  [["skopek", "skopek", "drinking", ["právě se pije", "drinking"]], ["pesti", "pesti", "fighting", ["právě se bije", "fighting"]]].forEach(([op, k, bez, txt]) =>
    call(op, {}, true).then((r) => { const x = r[k]; stav(view.querySelector(`[data-st="${k}"]`), x.vyzvy && x.vyzvy.length ? L(["výzva pro tebe!", "you are challenged!"]) : x.status === "betting" ? L(["sází se!", "betting!"]) : x.status === bez ? L(txt) : ""); }).catch(() => {}));
};

// r27-41: Na pěsti — pěstní souboj o sázku; aréna stejná jako kohoutí jáma (výdrž, kurzy, výměny, chat)
const PEST = { st: null, timer: null, shown: -1, vklad: 25, hoste: [] };
VIEWS.pesti = async (view) => {
  clearInterval(PEST.timer); PEST.shown = -1;
  const obr = artReady("domov/sazky-pesti") ? "domov/sazky-pesti" : "mesto-hostinec";
  view.replaceChildren(h(`<div class="skop-hlava" style="--obr:url('${IMG_BASE}${obr}.webp')"><h2>${esc(L(["Na pěsti", "Fist fight"]))}</h2><p>${esc(L(["Na dvoře za hostincem se dělá kruh. Kdo zůstane stát, bere.", "A ring forms in the yard. Last one standing wins."]))}</p></div>
    <div class="panel kjama pest" id="pest"><div class="empty">…</div></div>
    <p><button class="btn" data-zpet>← ${esc(t("back"))}</button></p>`));
  view.querySelector("[data-zpet]").onclick = () => { clearInterval(PEST.timer); go("sazky"); };
  call("napoje", {}, true).then((r) => { PEST.hoste = r.hoste || []; if (S.tab === "pesti") pestKresli(); }).catch(() => {});
  await pestNacti();
  PEST.timer = setInterval(() => { if (S.tab !== "pesti") { clearInterval(PEST.timer); return; } pestNacti(true); }, 2000);
};
async function pestNacti(quiet = false) {
  if (Date.now() - (PEST.hosteT || 0) > 10000) { PEST.hosteT = Date.now(); call("napoje", {}, true).then((r) => { PEST.hoste = r.hoste || []; }).catch(() => {}); }
  try { PEST.st = (await call("pesti", {}, quiet)).pesti; } catch { return; }
  if (S.tab === "pesti") pestKresli();
}
function pestKresli() {
  const s = PEST.st, box = $("#pest"); if (!box || !s) return;
  const N = s.npc;
  const vyzvy = s.vyzvy.map((v) => `<div class="skop-vyzva"><span>👊 <b>${esc(v.od)}</b> ${esc(L(["tě vyzývá na pěstní souboj o", "challenges you to a fist fight for"]))} <b>${v.vklad} gr.</b></span>
      <span class="row"><button class="btn small primary" data-pe-odp="${esc(v.id)}:1">${esc(L(["Přijmout", "Accept"]))}</button><button class="btn small" data-pe-odp="${esc(v.id)}:0">${esc(L(["Odmítnout", "Decline"]))}</button></span></div>`).join("");
  const volno = s.status === "none" || s.status === "done";
  const st = (S.me && S.me.stats) || {};
  let html;
  if (volno && !(s.status === "done" && s.rounds && s.rounds.length && s.fight_for * 1000 < (s.rounds.length + 3) * s.kolo_ms)) {
    html = `${vyzvy}
      <div class="skop-npc"><img class="skop-portret" alt="" src="${IMG_BASE}${artReady(N.img) ? N.img + "-m" : "bytosti/skopek-nasoska-sudek-m"}.webp"><div><h3>${esc(N.name)} <small>${esc(L(["řečený ", "called "]) + N.prezdivka)}</small></h3>
        <p class="skop-pribeh">${esc(N.pribeh)}</p><p class="muted small">Síla ${s.npc_stats.Síla} · Obratnost ${s.npc_stats.Obratnost} · Odolnost ${s.npc_stats.Odolnost}</p></div></div>
      <p class="muted small">${esc(L(["Obratnost trefuje, Síla bolí, Odolnost drží na nohou. Opilost ruku zpomalí, modřiny chvíli zůstanou.", "Agility hits, Strength hurts, Endurance keeps you standing."]))}</p>
      <div class="skop-vklady">${esc(L(["Vklad: ", "Stake: "]))}${s.vklady.map((v) => `<button class="chip${PEST.vklad === v ? " on" : ""}" data-pe-vklad="${v}">${v} gr.</button>`).join("")}</div>
      <div class="vyzvy-2"><div class="vyzva-hrace"><b>${esc(L(["Místní", "Local"]))}</b><div class="row"><button class="btn primary" id="pe-npc">👊 ${esc(L([`Vyzvat Medvěda o ${PEST.vklad} gr.`, `Challenge Medvěd for ${PEST.vklad} gr.`]))}</button>
</div></div>${vyzvaHraceHtml("pe", PEST.hoste, PEST.vklad, L(["pěsti", "fists"]))}</div>
      ${s.moje_vyzvy.length ? `<p class="muted small">⏳ ${esc(L(["Čekáš na: ", "Waiting for: "]))}${s.moje_vyzvy.map((x) => `${esc(x.k + " (" + x.vklad + " gr.)")} <button class="btn small" data-pe-zrus="${esc(x.id)}">${esc(L(["Zrušit", "Cancel"]))}</button>`).join(" ")}</p>` : ""}
      ${s.free_in ? `<p class="muted small">${esc(L([`Dvůr se uklízí, další souboj asi za ${Math.ceil(s.free_in / 60)} min.`, "Next fight soon."]))}</p>` : ""}`;
    if (!chatRebuild(box, html, {})) return;
  } else {
    const idx = s.status === "betting" ? -1 : Math.min(s.rounds.length - 1, Math.floor(s.fight_for * 1000 / s.kolo_ms));
    const r = idx >= 0 ? s.rounds[idx] : null;
    const hp = r ? r.hp : [100, 100];
    const fin = s.status === "done" || (r && r.last && s.fight_for * 1000 > (idx + 1) * s.kolo_ms - 1200);
    const side = (b, i) => `<div class="kh kh${i}${fin && s.winner !== i ? " pad" : ""}" id="pe${i}">
        <div class="kh-name"><span class="kh-dot d${i}"></span>${esc(b.name)}</div>
        <div class="kh-hp"><i style="width:${hp[i]}%"></i><span>${esc(L(["výdrž ", "stamina "]))}${hp[i]} %</span></div>
        <div class="kh-img pest-fig">${b.npc ? `<img alt="" src="${IMG_BASE}${artReady(N.img) ? N.img : "bytosti/skopek-nasoska-sudek"}.webp">` : `<div class="skop-postava">${Postava.html(b.fig, IMG_BASE)}</div>`}</div>
        <div class="kh-stat">Síla ${b.stats.Síla} · Obr. ${b.stats.Obratnost} · Odol. ${b.stats.Odolnost}${b.opilost >= 25 ? " · 🍺 " + b.opilost + " %" : ""}</div>
        <div class="kh-kurz"><span>${esc(L(["šance", "chance"]))} ${Math.round(s.chance[i] * 100)} %</span><b>${s.odds[i].toFixed(2)}×</b></div></div>`;
    const head = s.status === "betting"
      ? `${esc(L(["Sázky běží, bije se za", "Betting open, fight starts in"]))} <b>${s.starts_in} s</b> · ${esc(L(["sázejících", "bettors"]))} ${s.bettors} · ${esc(s.bs[0].name)} ${s.totals[0]} gr. · ${esc(s.bs[1].name)} ${s.totals[1]} gr.`
      : fin ? `🏆 ${esc(L(["Vítěz", "Winner"]))}: <b>${esc(s.bs[s.winner].name)}</b>` : esc(L(["Sázky uzavřeny — bije se!", "Bets closed — fight!"]));
    const sazet = s.status === "betting" && s.ja == null ? `<div class="skop-sazky">${s.bs.map((b, i) => `<div><span>${esc(L(["Vsadit na ", "Bet on "]) + b.name)}</span>${[5, 10, 20, 50, 100, 200].map((a) => `<button class="chip" data-pe-bet="${i}:${a}">${a}</button>`).join("")}</div>`).join("")}</div>` : "";
    const moje = s.my_bet ? `<p class="dim small">${esc(L(["Tvá sázka: ", "Your bet: "]) + s.my_bet.amount + " gr. → " + s.bs[s.my_bet.side].name)}</p>` : "";
    const log = s.rounds.slice(0, idx + 1).map((x) => `<li>${esc(x.text)}</li>`).join("");
    html = `<div class="skop-hra"><div class="kh-arena">${side(s.bs[0], 0)}<div class="kh-vs">${r ? `<small>${esc(L(["výměna ", "exchange "]) + r.n)}</small>` : ""}VS</div>${side(s.bs[1], 1)}</div>
      <div class="skop-bok"><p class="kh-head">${head}</p>${moje}${sazet}${log ? `<ol class="kh-log skop-log">${log}</ol>` : ""}${chatHtml("pesti:" + s.id, s.chat)}</div></div>`;
    if (!chatRebuild(box, html, { ["pesti:" + s.id]: s.chat })) return;
    wireChat(box, () => pestNacti(true));
    if (idx !== PEST.shown && r) {
      PEST.shown = idx;
      const a = $("#pe" + r.att), d = $("#pe" + (1 - r.att));
      if (a) { a.classList.remove("utok"); void a.offsetWidth; a.classList.add("utok"); }
      Zvuk.sfx("zaber");
      if (d && r.hit) setTimeout(() => { d.classList.remove("zasah"); void d.offsetWidth; d.classList.add("zasah"); Zvuk.sfx(r.krit || r.ko ? "pest-tvrda" : "pest"); if (r.ko || r.krit) setTimeout(() => Zvuk.sfx("bolest"), 250); }, 350);
      else setTimeout(() => Zvuk.sfx("uhyb"), 300);
      if (r.last) setTimeout(() => Zvuk.sfx("smich"), 1400);
    }
  }
  box.querySelectorAll("[data-pe-vklad]").forEach((b) => b.onclick = () => { PEST.vklad = Number(b.dataset.peVklad); pestKresli(); });
  const npc = $("#pe-npc"); if (npc) npc.onclick = () => pestAkce("pesti_vyzvat", { cil: N.id, vklad: PEST.vklad });
  const vy = $("#pe-vyzvi"); if (vy) vy.onclick = () => { const v = $("#pe-hrac").value; if (!v) { toast(L(["Vyber soupeře.", "Pick an opponent."]), true); return; } pestAkce("pesti_vyzvat", { cil: v, vklad: PEST.vklad }); };
  box.querySelectorAll("[data-pe-odp]").forEach((b) => b.onclick = () => { const [id, a] = b.dataset.peOdp.split(":"); pestAkce("pesti_odpoved", { id, ano: a === "1" }); });
  box.querySelectorAll("[data-pe-zrus]").forEach((b) => b.onclick = () => pestAkce("pesti_zrusit", { id: b.dataset.peZrus }));   // 1.0-3-1
  box.querySelectorAll("[data-pe-bet]").forEach((b) => b.onclick = () => { const [side, amount] = b.dataset.peBet.split(":").map(Number); pestAkce("pesti_vsadit", { side, amount }); });
}
async function pestAkce(op, data) {
  try { const r = await call(op, data); if (r.text) toast(r.text); if (r.pesti) { PEST.st = r.pesti; pestKresli(); } Zvuk.sfx("mince"); } catch {}
}

// r27-40: Škopek — pitná soutěž. Rozhodují staty (Odolnost, Síla), snášenlivost a kostky (k20 + polovina Odolnosti proti rostoucí obtížnosti).
const SKOP = { st: null, timer: null, shown: -1, vklad: 25, hoste: [] };
VIEWS.skopek = async (view) => {
  clearInterval(SKOP.timer); SKOP.shown = -1;
  const obr = artReady("domov/sazky-soudek") ? "domov/sazky-soudek" : artReady("domov/skopek-stul") ? "domov/skopek-stul" : "mesto-hostinec";
  view.replaceChildren(h(`<div class="skop-hlava" style="--obr:url('${IMG_BASE}${obr}.webp')"><h2>${esc(L(["U soudku", "At the barrel"]))}</h2><p>${esc(L(["U dlouhého stolu se sází, kdo dřív sjede pod lavici.", "At the long table they bet who slides under the bench first."]))}</p></div>
    <div class="panel skop" id="skop" style="--obr:url('${IMG_BASE}${obr}.webp')"><div class="empty">…</div></div>
    <p><button class="btn" data-go="misto/hostinec">← ${esc(t("back"))}</button></p>`));
  mountLive(view);
  view.querySelector("[data-go]").onclick = () => { clearInterval(SKOP.timer); go("sazky"); };
  call("napoje", {}, true).then((r) => { SKOP.hoste = r.hoste || []; if (S.tab === "skopek") skopKresli(); }).catch(() => {});
  await skopNacti();
  SKOP.timer = setInterval(() => { if (S.tab !== "skopek") { clearInterval(SKOP.timer); return; } skopNacti(true); }, 2000);
};
async function skopNacti(quiet = false) {
  if (Date.now() - (SKOP.hosteT || 0) > 10000) { SKOP.hosteT = Date.now(); call("napoje", {}, true).then((r) => { SKOP.hoste = r.hoste || []; }).catch(() => {}); }
  try { SKOP.st = (await call("skopek", {}, quiet)).skopek; } catch { return; }
  if (S.tab === "skopek") skopKresli();
}
const skopIkon = (n) => `<img class="skop-napoj" alt="" src="${IMG_BASE}predmety/ikony/${Postava.slug(n)}.webp">`;
function skopK20(hod, bonus, dc, ok, delay) {
  return `<div class="k20${ok ? " ok" : " ne"}" style="--d:${delay}ms"><svg viewBox="0 0 60 60" aria-hidden="true"><polygon points="30,3 55,17 55,43 30,57 5,43 5,17"/><polygon class="vnitr" points="30,12 47,40 13,40"/></svg>
    <b>${hod}</b><small>+${bonus} = ${hod + bonus} / ${dc}</small></div>`;
}
function skopKresli() {
  const s = SKOP.st, box = $("#skop"); if (!box || !s) return;
  const N = s.npc;
  const vyzvy = s.vyzvy.map((v) => `<div class="skop-vyzva"><span>🍺 <b>${esc(v.od)}</b> ${esc(L(["tě vyzývá na škopek o", "challenges you for"]))} <b>${v.vklad} gr.</b></span>
      <span class="row"><button class="btn small primary" data-sk-odp="${esc(v.id)}:1">${esc(L(["Přijmout", "Accept"]))}</button><button class="btn small" data-sk-odp="${esc(v.id)}:0">${esc(L(["Odmítnout", "Decline"]))}</button></span></div>`).join("");
  const volno = s.status === "none" || s.status === "done";
  let html = "";
  if (volno && !(s.status === "done" && s.rounds && s.rounds.length && s.drink_for * 1000 < (s.rounds.length + 3) * s.kolo_ms)) {
    const hoste = SKOP.hoste;
    html = `${vyzvy}
      <div class="skop-npc"><img class="skop-portret" alt="" src="${IMG_BASE}${N.img}.webp"><div><h3>${esc(N.name)} <small>${esc(L(["řečený ", "called "]) + N.prezdivka)}</small></h3>
        <p class="skop-pribeh">${esc(N.pribeh)}</p></div></div>
      <p class="muted small">${esc(L(["Tvá snášenlivost: ", "Your tolerance: "]))}<b>${esc((S.me.opilost && S.me.opilost.snasi_text) || "")}</b>${esc(L([" · rozhoduje Odolnost, Síla, návyk a kostky. Opilost ti po soutěži zůstane.", ""]))}</p>
      <div class="skop-vklady">${esc(L(["Vklad: ", "Stake: "]))}${s.vklady.map((v) => `<button class="chip${SKOP.vklad === v ? " on" : ""}" data-sk-vklad="${v}">${v} gr.</button>`).join("")}</div>
      <div class="vyzvy-2"><div class="vyzva-hrace"><b>${esc(L(["Místní", "Local"]))}</b><div class="row"><button class="btn primary" id="sk-npc">🍺 ${esc(L([`Vyzvat Sudka o ${SKOP.vklad} gr.`, `Challenge Sudek for ${SKOP.vklad} gr.`]))}</button>
</div></div>${vyzvaHraceHtml("sk", hoste, SKOP.vklad, L(["škopek", "a drink-off"]))}</div>
      ${s.moje_vyzvy.length ? `<p class="muted small">⏳ ${esc(L(["Čekáš na: ", "Waiting for: "]))}${s.moje_vyzvy.map((x) => `${esc(x.k + " (" + x.vklad + " gr.)")} <button class="btn small" data-sk-zrus="${esc(x.id)}">${esc(L(["Zrušit", "Cancel"]))}</button>`).join(" ")}</p>` : ""}
      ${s.free_in ? `<p class="muted small">${esc(L([`Hostinský utírá stůl, další škopek asi za ${Math.ceil(s.free_in / 60)} min.`, "Next contest soon."]))}</p>` : ""}`;
    if (!chatRebuild(box, html, {})) return;
  } else {
    const idx = s.status === "betting" ? -1 : Math.min(s.rounds.length - 1, Math.floor(s.drink_for * 1000 / s.kolo_ms));
    const r = idx >= 0 ? s.rounds[idx] : null;
    const lv = r ? r.lv : s.bs.map((b) => b.start);
    const konec = s.status === "done" || (r && r.last && s.drink_for * 1000 > (idx + 1) * s.kolo_ms - 800);
    const strana = (b, i) => `<div class="skop-hrac s${i}${konec && s.winner !== i ? " pod-stolem" : ""}${konec && s.winner === i ? " vitez" : ""}" id="skh${i}">
        <div class="skop-jm"><span class="kh-dot d${i}"></span>${esc(b.name)}</div>
        <div class="skop-fig">${b.npc ? `<img class="skop-portret velky" alt="" src="${IMG_BASE}${N.img}.webp">` : `<div class="skop-postava">${Postava.html(b.fig, IMG_BASE)}</div>`}</div>
        <div class="skop-opil"><i style="width:${Math.min(100, lv[i])}%"></i><span>${esc(L(["opilost ", "drunk "]))}${Math.min(100, lv[i])} %</span></div>
        <div class="skop-kostka" id="skk${i}">${r && r.hody[i] ? skopK20(...r.hody[i], 600 + i * 250) : ""}</div>
        <div class="kh-kurz"><span>${esc(L(["šance", "chance"]))} ${Math.round(s.chance[i] * 100)} % · Odol. ${b.odolnost}</span><b>${s.odds[i].toFixed(2)}×</b></div></div>`;
    const stred = r ? `<div class="skop-stred">${skopIkon(r.napoj)}<b>${esc(L(["Kolo ", "Round "]) + r.n)}</b><small>${esc(r.napoj)}</small></div>` : `<div class="skop-stred"><b>VS</b><small>${s.vklad} gr.</small></div>`;
    const head = s.status === "betting"
      ? `${esc(L(["Sázky běží, pije se za", "Bets open, drinking starts in"]))} <b>${s.starts_in} s</b> · ${esc(L(["sázejících", "bettors"]))} ${s.bettors}`
      : konec ? `🏆 ${esc(L(["Vítěz", "Winner"]))}: <b>${esc(s.bs[s.winner].name)}</b>` : esc(L(["Hostinský nalévá — pije se!", "Drinking!"]));
    const sazet = s.status === "betting" && s.ja == null ? `<div class="skop-sazky">${s.bs.map((b, i) => `<div><span>${esc(L(["Vsadit na ", "Bet on "]) + b.name)}</span>${[5, 10, 20, 50, 100, 200].map((a) => `<button class="chip" data-sk-bet="${i}:${a}">${a}</button>`).join("")}</div>`).join("")}</div>` : "";
    const moje = s.my_bet ? `<p class="dim small">${esc(L(["Tvá sázka: ", "Your bet: "]) + s.my_bet.amount + " gr. → " + s.bs[s.my_bet.side].name)}</p>` : "";
    const log = s.rounds.slice(0, idx + 1).map((x) => `<li><b>${x.n}.</b> ${esc(x.napoj)} — ${x.lv[0]} % / ${x.lv[1]} %${x.text ? " · " + esc(x.text) : ""}</li>`).reverse().join("");
    html = `<div class="skop-hra"><div class="skop-stul">${strana(s.bs[0], 0)}${stred}${strana(s.bs[1], 1)}</div>
      <div class="skop-bok"><p class="kh-head">${head}</p>${moje}${sazet}${log ? `<ul class="skop-log">${log}</ul>` : ""}${chatHtml("skopek:" + s.id, s.chat)}</div></div>`;
    if (!chatRebuild(box, html, { ["skopek:" + s.id]: s.chat })) return;
    wireChat(box, () => skopNacti(true));
    if (idx !== SKOP.shown && r) {
      SKOP.shown = idx;
      [0, 1].forEach((i) => { const el = $("#skh" + i); if (el) { el.classList.remove("pije"); void el.offsetWidth; el.classList.add("pije"); } });
      Zvuk.sfx("nalevani"); setTimeout(() => Zvuk.sfx(r.hody.some(Boolean) ? "kostky" : "kalisek"), 1200);   // r27-41: nalévá se, pak hod
      if (r.last) setTimeout(() => Zvuk.sfx("smich"), 2000); else if (Math.random() < .35) setTimeout(() => Zvuk.sfx("rihnuti"), 2200);
    }
  }
  box.querySelectorAll("[data-sk-vklad]").forEach((b) => b.onclick = () => { SKOP.vklad = Number(b.dataset.skVklad); skopKresli(); });
  const npc = $("#sk-npc"); if (npc) npc.onclick = () => skopAkce("skopek_vyzvat", { cil: N.id, vklad: SKOP.vklad });
  const vy = $("#sk-vyzvi"); if (vy) vy.onclick = () => { const v = $("#sk-hrac").value; if (!v) { toast(L(["Vyber soupeře.", "Pick an opponent."]), true); return; } skopAkce("skopek_vyzvat", { cil: v, vklad: SKOP.vklad }); };
  box.querySelectorAll("[data-sk-odp]").forEach((b) => b.onclick = () => { const [id, a] = b.dataset.skOdp.split(":"); skopAkce("skopek_odpoved", { id, ano: a === "1" }); });
  box.querySelectorAll("[data-sk-zrus]").forEach((b) => b.onclick = () => skopAkce("skopek_zrusit", { id: b.dataset.skZrus }));   // 1.0-3-1
  box.querySelectorAll("[data-sk-bet]").forEach((b) => b.onclick = () => { const [side, amount] = b.dataset.skBet.split(":").map(Number); skopAkce("skopek_vsadit", { side, amount }); });
}
async function skopAkce(op, data) {
  try { const r = await call(op, data); if (r.text) toast(r.text); if (r.skopek) { SKOP.st = r.skopek; skopKresli(); } Zvuk.sfx("mince"); } catch {}
}

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
    if (idx === 0) Zvuk.sfx("kokrhani");                                   // r27-41: kohouti do jámy
    if (d && r.hit) setTimeout(() => { d.classList.remove("zasah"); void d.offsetWidth; d.classList.add("zasah"); Zvuk.sfx("kdakani"); }, 350);
    else Zvuk.sfx("uhyb");
    if (r.last) setTimeout(() => Zvuk.sfx("kokrhani"), 1600);              // vítěz zakokrhá
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
      ${pick ? T_.dice.map((f, i) => dieImg(f, i, lay[i], (HRACI.sel.has(i) ? "sel" : "") + (fresh ? " pada" : "") + (mine ? "" : " cizi"), (T_.typy || [])[i])).join("") : ""}
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
// 1.0-1: domov na webu — místnosti s náhledy, akce zamčené bez potřebného nábytku, ve světnici se nábytek rozmisťuje myší
const NAB_OBR = { "Malá truhla": "mala-truhla", "Truhla": "truhla", "Okovaná truhla": "okovana-truhla", "Slamník": "slamnik", "Lůžko": "luzko",
  "Lůžko s nebesy": "luzko-s-nebesy", "Pec s plotnou": "pec", "Spíž": "spiz", "Stůl s lavicí": "stul", "Svícen": "svicen", "Koberec": "koberec",
  "Skříň": "skrin", "Truhlová lavice": "lavice", "Police s nádobím": "police-nadobi", "Sušák bylin": "susak", "Džber s vodou": "dzber", "Sud piva": "sud",
  "Medvědí kožešina": "kozesina", "Věšák na plášť": "vesak", "Kolovrat": "kolovrat", "Obraz sv. Václava": "obraz",
  "Stojan na zbroj": "stojan-zbroj", "Stojan na zbraně": "stojan-zbrane", "Police na trofeje": "police-trofeje", "Vitrína odznaků": "vitrina",
  "Brusný kámen": "brus", "Zbrojířský ponk": "ponk", "Truhla na zbroj": "truhla-zbroj", "Stojan na luky": "stojan-luky", "Cvičná figurína": "figurina",
  "Velká police na trofeje": "velka-police", "Jelení paroží": "parozi", "Kančí hlava": "kanci-hlava", "Krb s erbem": "krb", "Psací pult": "pult",
  "Truhlička na listiny": "truhlicka", "Erbovní štít": "erb" };
// šířka v % obrázku světnice (u zadní stěny se zmenší), výchozí místo [x, y paty v %], plochý = leží na zemi (vždy vespod)
const NAB_ROZ = { "Malá truhla": [11, 62, 80], "Truhla": [14, 70, 82], "Okovaná truhla": [17, 40, 84], "Slamník": [31, 20, 90], "Lůžko": [35, 20, 96],
  "Lůžko s nebesy": [38, 20, 88], "Pec s plotnou": [21, 86, 72], "Spíž": [17, 94, 74], "Stůl s lavicí": [35, 52, 99], "Svícen": [7, 36, 74],
  "Koberec": [42, 50, 99, 1], "Skříň": [20, 8, 76], "Truhlová lavice": [24, 70, 96], "Police s nádobím": [20, 78, 44], "Sušák bylin": [15, 64, 60],
  "Džber s vodou": [11, 92, 92], "Sud piva": [18, 80, 92], "Medvědí kožešina": [36, 26, 99, 1], "Věšák na plášť": [10, 4, 82], "Kolovrat": [17, 64, 76],
  "Obraz sv. Václava": [8, 28, 36],
  "Stojan na zbroj": [17, 12, 80], "Stojan na zbraně": [15, 30, 78], "Police na trofeje": [21, 50, 40], "Vitrína odznaků": [17, 46, 78],
  "Brusný kámen": [17, 58, 86], "Zbrojířský ponk": [28, 74, 88], "Truhla na zbroj": [22, 40, 88], "Stojan na luky": [15, 88, 80], "Cvičná figurína": [14, 22, 84],
  "Velká police na trofeje": [25, 30, 76], "Jelení paroží": [17, 50, 30], "Kančí hlava": [13, 70, 34], "Krb s erbem": [31, 50, 78], "Psací pult": [15, 30, 84],
  "Truhlička na listiny": [10, 60, 82], "Erbovní štít": [11, 75, 38] };
const DOMOV = { sub: false, st: null };
const nabSrc = (n) => IMG_BASE + "domov/nab/" + (NAB_OBR[n] || "truhla") + ".webp";
const ROOM_NAZ = { "světnice": ["Světnice", "Living room"], "zbrojnice": ["Zbrojnice", "Armoury"], "síň trofejí": ["Síň trofejí", "Trophy hall"], "komnata odznaků": ["Komnata odznaků", "Badge chamber"] };
// 1.0-1-5: Domov — vpravo nahoře přepínače místností, pod nimi tři dlaždice (Přehled vybavení · Funkce domu · Úprava místnosti);
// každá otevře svou část. Zpět vždy o jeden krok a zarovnané se spodkem náhledu místnosti.
const DOMOV_SEKCE = {
  prehled: { obr: "domov/nahled-dum-vybaveni", n: ["Přehled vybavení", "Furnishings"], d: ["Co v místnosti stojí a k čemu to je", "What stands in the room and what it does"] },
  funkce: { obr: "domov/nahled-dum-funkce", n: ["Funkce domu", "House functions"], d: ["Spánek, jídlo, vaření, oheň, dílna — podle místnosti", "Sleep, food, cooking, fire, workshop"] },
  uprava: { obr: "domov/nahled-dum-uprava", n: ["Úprava místnosti", "Arrange the room"], d: ["Koupit, posunout, otočit, přenést či vynést nábytek; stěny", "Buy, move, rotate, carry or remove furniture; walls"] },
};
// funkce domu: [klíč, druhy nábytku, domovské místnosti, název, popis]
const DOMOV_FUNKCE = [
  ["rest", ["bed"], ["světnice"], ["Vyspat se", "Sleep"], ["Zdraví a odpočatost; ráno se najíš ze spíže", "Health and rest"]],
  ["eat", ["chest", "pantry"], ["světnice"], ["Najíst se", "Eat"], ["Z jídla uloženého doma", "From food stored at home"]],
  ["cook", ["oven"], ["světnice"], ["Vařit", "Cook"], ["Recepty u zapálené pece — minihra", "Recipes at a lit stove"]],
  ["ohen:oven", ["oven"], ["světnice"], ["Zapálit v peci", "Light the stove"], ["Teplo a vaření na celý herní den", "Warmth for a game day"]],
  ["ohen:hearth", ["hearth"], ["síň trofejí"], ["Zapálit krb", "Light the hearth"], ["Teplo na celý herní den", "Warmth for a game day"]],
  ["uloziste", ["chest", "pantry"], ["světnice", "zbrojnice", "komnata odznaků"], ["Úložný prostor", "Storage"], ["Truhly, skříně a spíž — uložit a vzít věci", "Chests and pantry"]],
  ["dilna:brus", ["grind"], ["zbrojnice"], ["Nabrousit zbraň", "Sharpen a weapon"], ["Brusný kámen — minihra", "Grindstone"]],
  ["dilna:ponk", ["mend"], ["zbrojnice"], ["Spravit zbroj, štít a tupou zbraň", "Mend armour and blunt weapons"], ["Zbrojířský ponk — minihra", "Armourer's bench"]],
  ["dilna:figurina", ["drill"], ["zbrojnice"], ["Cvičit u figuríny", "Train at the dummy"], ["Až +20 zkušeností denně", "Up to +20 XP a day"]],
];
const DRUH_NAZ = { bed: "postel (slamník, lůžko)", chest: "truhla nebo skříň", pantry: "spíž", oven: "pec s plotnou", hearth: "krb", grind: "brusný kámen", mend: "zbrojířský ponk", drill: "cvičná figurína",
  armor: "stojan na zbroj", weapons: "stojan na zbraně", trophies: "police na trofeje", badges: "vitrína odznaků" };
const DOMOV_ED = { vyber: "", vynest: "" };
VIEWS.domov = async (view) => {
  const m = S.me;
  if (!m.house) { go("domy"); return; }
  DOMOV.sub = false;
  const sekce = DOMOV_SEKCE[S.arg] ? S.arg : "";
  let D; try { D = (await call("domov", {}, true)).domov; } catch { return; }
  if (S.tab !== "domov") return;
  DOMOV.st = D;
  if (D.zatopeno && D.zatopeno.length) toast(L(["Ze zásob dříví se zatopilo: ", "Heated from the woodpile: "]) + D.zatopeno.map((k) => k === "oven" ? L(["pec", "stove"]) : L(["krb", "hearth"])).join(", "));
  const chal = D.type === "chalupa";
  {  // vzhled stěn od čalouníka: jakmile se obrázek načte, domov se jednou překreslí
    const cekam = Object.entries(D.steny || {}).map(([r, st]) => "domov/steny/" + ((chal ? "chalupa-" : "dum-") + ({ "světnice": "svetnice", "zbrojnice": "zbrojnice", "síň trofejí": "sin-trofeji", "komnata odznaků": "komnata-odznaku" }[r] || "svetnice")) + "-" + st).filter((n) => !artReady(n));
    if (cekam.length && !DOMOV.cekal) { DOMOV.cekal = 1; setTimeout(() => { DOMOV.cekal = 0; if (S.tab === "domov" && cekam.some((n) => artReady(n))) render(); }, 1200); }
  }
  const room = D.room in ROOM_IMG || chal ? D.room : "světnice";
  const pokojImg = (r) => chal ? (artReady("domov/chalupa-svetnice") ? "domov/chalupa-svetnice" : "domov/dum-svetnice") : ROOM_IMG[r] || "domov/dum-svetnice";
  const prazdna = chal ? "domov/chalupa-svetnice" : "domov/dum-svetnice";   // malované světnice jsou prázdné — nábytek se kreslí navrch
  const svetnice = room === "světnice";
  const A = D.akce;
  const R = D.rooms.find((r) => r.key === room) || { kusy: [] };
  const kusyMist = R.kusy;
  const druhy = new Set(kusyMist.map((k) => k.kind));
  const vys = domovVystaveni(D);
  const bgImg = domovStena(D, room, svetnice ? prazdna : pokojImg(room));
  const tah = sekce === "uprava";   // 1.0-1-7: v Úpravě se dá táhnout vždy (zámek zrušen)
  if (!kusyMist.some((k) => k.klic === DOMOV_ED.vyber)) DOMOV_ED.vyber = "";
  if (DOMOV_ED.vynest !== DOMOV_ED.vyber) DOMOV_ED.vynest = "";
  const ohenKus = (k) => k.kind === "oven" || k.kind === "hearth";
  const tip = !kusyMist.length ? L(["Místnost je prázdná. Nábytek ti udělá truhlář — Úprava místnosti.", "The room is empty. Buy furniture in Arrange the room."])
    : sekce !== "uprava" || DOMOV_ED.vyber ? "" : L(["Klikni na kus nábytku — vpravo ho otočíš, přeneseš nebo vyneseš. Tažením ho posuneš.", "Click a piece to rotate, carry or remove it. Drag to move it."]);
  const dlazdice = (k) => { const X = DOMOV_SEKCE[k], o = chal && k === "prehled" ? "domov/chalupa-svetnice" : X.obr;
    return `<button class="opt obr-karta dm-dl" data-sekce="${k}"><span class="ok-obr"><img src="${ART_SRC(o)}" alt="" data-nahrada="${ART_SRC("domov/dum-svetnice")}"></span>
      <span class="ok-txt"><b>${esc(L(X.n))}</b><small>${esc(L(X.d))}</small></span></button>`; };
  view.replaceChildren(h(`<div class="scene dm-scena${tah ? " zarizuje" : ""}" style="--dm-bg:url('${IMG_BASE}${bgImg}-m.webp')"><div class="dm-pokoj" style="background-image:url('${IMG_BASE}${bgImg}.webp')">
        ${kusyMist.map((k, i) => `<div class="dm-kus${(NAB_ROZ[k.name] || [])[3] ? " plochy" : ""}${tah ? "" : " zamceno"}${k.klic === DOMOV_ED.vyber && sekce === "uprava" ? " vybrany" : ""}${ohenKus(k) ? ((D.ohen[k.kind] || {}).hori ? " hori" : " studena") : ""}" data-klic="${esc(k.klic)}" data-i="${i}" title="${esc(k.name + " — " + k.popis)}">
          <img src="${ohenKus(k) && !(D.ohen[k.kind] || {}).hori ? IMG_BASE + "domov/nab/" + (k.kind === "oven" ? "pec-studena" : "krb-studeny") + ".webp" : nabSrc(k.name)}" alt="${esc(k.name)}" draggable="false"${ohenKus(k) ? ` data-nahrada="${nabSrc(k.name)}"` : ""}>${vys(k.klic, k.name)}</div>`).join("")}
        ${tip ? `<div class="dm-tip">${esc(tip)}</div>` : ""}
        <h2 class="dm-nazev">${esc(L(ROOM_NAZ[room] || ["Domov", "Home"]))}</h2>
        <span class="dm-teplo" title="${esc(L(["Teplota a útulnost domu", "Warmth and cosiness"]))}">${esc(D.teplota + " °C · " + D.teplota_slovem + " · " + L(["útulnost ", "cosy "]) + D.utulnost + " %")}</span></div></div>
    <div class="dm-pravy">
    <div class="panel dm-panel" id="dmprehled"><div class="dm-vnitr">
      <div class="dm-hlava"><h3>${esc(D.name)}${sekce ? ` <small class="muted">· ${esc(L(DOMOV_SEKCE[sekce].n))}</small>` : ""}</h3>
        ${D.decayed ? `<p class="notice">${esc(L(["Dům chátrá (nezaplacená údržba) — spí se tu jako na slamníku a pec je studená.", "The house is decaying."]))}</p>` : ""}</div>
      ${D.rooms.length > 1 || !sekce ? `<div class="dm-mistnosti">${D.rooms.map((r) => `<button class="dm-mist${r.key === room ? " on" : ""}" data-room="${esc(r.key)}">
          <span class="dm-nah" style="background-image:url('${ART_SRC(domovStena(D, r.key, r.key === "světnice" ? prazdna : pokojImg(r.key)))}')"></span>
          <span class="dm-mtxt"><b>${esc(L(ROOM_NAZ[r.key] || [r.key, r.key]))}</b><small>${esc(r.used + " / " + r.slots + L([" míst", " slots"]))}</small>
          <em>${esc(r.kusy.map((x) => x.name).join(", ") || L(["prázdná", "empty"]))}</em></span></button>`).join("")}</div>` : ""}
      ${!sekce ? domovStavHtml(D) + `<div class="opts dm-dlazdice">${Object.keys(DOMOV_SEKCE).map(dlazdice).join("")}</div>`
        : sekce === "prehled" ? domovPrehledHtml(D, room, R)
        : sekce === "funkce" ? domovFunkceHtml(D, room, druhy, chal)
        : domovUpravaHtml(D, room, R, chal)}
    </div></div>
    <div class="panel dpanel" id="dpanel" hidden></div>
    <p class="dm-zpet"><button class="btn" id="pback">← ${esc(t("back"))}</button></p></div>`));

  $("#pback").onclick = () => { if (DOMOV.sub) { NAV.klik = 0; domovPrehled(); return; } DOMOV_ED.vyber = ""; if (!sekce) DOMOV.zpet = ""; go(sekce ? "domov" : chal ? "misto/brana" : "misto/dum"); };
  view.querySelectorAll("[data-sekce]").forEach((b) => b.onclick = () => { Zvuk.sfx("klik"); go("domov/" + b.dataset.sekce); });
  view.querySelectorAll("[data-room]").forEach((b) => b.onclick = async () => {
    if (b.classList.contains("on")) return;
    Zvuk.sfx("klik"); DOMOV_ED.vyber = "";
    try { await call("domov_mistnost", { room: b.dataset.room }); S.me.house_room = b.dataset.room; } catch { return; }
    render();
  });
  view.querySelectorAll("[data-dcid]").forEach((b) => b.onclick = async () => {
    if (b.dataset.dcid === "ks:home:cook") { Zvuk.sfx("klik"); go("vareni"); return; }   // vaření má vlastní stránku s minihrou
    b.disabled = true; Zvuk.sfx("klik");
    let r; try { r = await call("raid_click", { id: b.dataset.dcid, values: [] }); } catch { b.disabled = false; return; }
    const c = (r.panel && r.panel.content) || "";
    if (/^#/.test(c) || r.modal) { domovPodokno(r); return; }
    if (c) toast(noEmoji(c).replace(/\*\*/g, ""));
    render();
  });
  view.querySelectorAll("[data-dgo]").forEach((b) => b.onclick = () => { Zvuk.sfx("klik"); DOMOV.zpet = "domov/" + sekce; go(b.dataset.dgo); });
  view.querySelectorAll("[data-truhlar]").forEach((b) => b.onclick = () => { PANEL.back = "domov/uprava"; go("panel/carpenter"); });
  view.querySelectorAll("[data-ohen]").forEach((b) => b.onclick = async () => { b.disabled = true;
    try { const x = await call("domov_ohen", { kind: b.dataset.ohen, uhasit: !!b.dataset.uhasit }); toast(x.zprava); Zvuk.sfx("klik"); } catch { b.disabled = false; return; } render(); });
  view.querySelectorAll("[data-dilna]").forEach((b) => b.onclick = () => { Zvuk.sfx("klik"); go("dilnadoma/" + b.dataset.dilna); });
  view.querySelectorAll("[data-zas]").forEach((b) => b.onclick = async () => { b.disabled = true;
    try { const x = await call("domov_zasoby", { co: b.dataset.zas, qty: +b.dataset.q }); toast(x.zprava); Zvuk.sfx("klik"); } catch { b.disabled = false; return; } render(); });
  view.querySelectorAll("[data-ds]").forEach((b) => b.onclick = () => { Zvuk.sfx("klik"); go("domov/" + b.dataset.ds); });
  view.querySelectorAll("[data-prenest]").forEach((b) => b.onclick = async () => {   // 1.0-1-7: označený kus do jiné místnosti
    b.disabled = true; Zvuk.sfx("klik");
    try { const x = await call("domov_presun_klic", { klic: DOMOV_ED.vyber, room: b.dataset.prenest }); toast(x.zprava); } catch { b.disabled = false; return; }
    DOMOV_ED.vyber = ""; render(); });
  view.querySelectorAll("[data-vynest]").forEach((b) => b.onclick = async () => {    // 1.0-1-7: vynést označený kus (napoprvé se zeptá)
    Zvuk.sfx("klik");
    if (DOMOV_ED.vynest !== DOMOV_ED.vyber) { DOMOV_ED.vynest = DOMOV_ED.vyber; render(); return; }
    if (b.dataset.vynest === "ne") { DOMOV_ED.vynest = ""; render(); return; }
    b.disabled = true;
    try { const x = await call("domov_vynest", { klic: DOMOV_ED.vyber }); toast(x.zprava); } catch { b.disabled = false; return; }
    DOMOV_ED.vyber = DOMOV_ED.vynest = ""; render(); });
  view.querySelectorAll("[data-tf]").forEach((b) => b.onclick = async () => {   // otočit / překlopit / velikost vybraného kusu
    const k = kusyMist.find((x) => x.klic === DOMOV_ED.vyber); if (!k) return;
    const t0 = { r: 0, f: false, s: 1, ...(k.tf || {}) }, co = b.dataset.tf;
    const t1 = co === "vlevo" ? { ...t0, r: t0.r - 15 } : co === "vpravo" ? { ...t0, r: t0.r + 15 } : co === "preklop" ? { ...t0, f: !t0.f }
      : co === "vetsi" ? { ...t0, s: Math.min(1.8, +(t0.s + 0.1).toFixed(2)) } : co === "mensi" ? { ...t0, s: Math.max(0.5, +(t0.s - 0.1).toFixed(2)) } : { r: 0, f: false, s: 1 };
    Zvuk.sfx("klik");
    try { await call("domov_pos", { klic: k.klic, tf: t1 }, true); } catch { return; }
    render(); });
  domovRozmisti(view, D, kusyMist, tah, svetnice);
  if (tah) view.querySelectorAll(".dm-kus").forEach((el) => el.addEventListener("click", () => {
    if (el.dataset.posunul) { delete el.dataset.posunul; if (DOMOV_ED.vyber === el.dataset.klic) return; }
    DOMOV_ED.vyber = DOMOV_ED.vyber === el.dataset.klic ? "" : el.dataset.klic; render(); }));
  const sc = view.querySelector(".dm-scena"), pr = view.querySelector(".dm-pravy");   // Zpět dole zarovnané se spodkem náhledu
  const srovnej = () => { if (jeMobil()) { pr.style.height = ""; return; } pr.style.height = sc.getBoundingClientRect().height + "px"; };
  srovnej(); new ResizeObserver(srovnej).observe(sc);
};
// 1.0-1-7 (Pavel): stav domu na hlavní obrazovce Domova; dlaždice vedou rovnou tam, kde se to řeší
function domovStavHtml(D) {
  const st = D.stav, z = D.zasoby || {};
  const tile = (k, v, ok, kam, tit) => `<button class="${ok ? "" : "ne"}" ${kam.startsWith("@") ? `data-dgo="${kam.slice(1)}"` : `data-ds="${kam}"`} title="${esc(tit)}"><small>${esc(k)}</small><b>${esc(v)}</b></button>`;
  const sp = ["žádná postel", "slamník", "lůžko", "lůžko s nebesy"][D.bed] || "";
  return `<div class="dm-stav">${tile(L(["Spaní", "Bed"]), sp, D.bed > 0, "funkce", L(["Funkce domu", "House functions"]))}${tile(L(["Truhly", "Chests"]), D.chest[0] + " / " + D.chest[1], D.chest[1] > 0, "@uloziste", L(["Úložný prostor", "Storage"]))}
      ${tile(L(["Spíž", "Pantry"]), D.pantry[0] + " / " + D.pantry[1], D.pantry[1] > 0, "@uloziste", L(["Úložný prostor", "Storage"]))}${tile(L(["Vaření", "Cooking"]), D.cook[0] + " / " + D.cook[1], D.oven, "funkce", L(["Funkce domu", "House functions"]))}
      ${tile(L(["Teplota", "Warmth"]), D.teplota + " °C · " + D.teplota_slovem, D.teplota >= 14, "funkce", L(["Oheň v peci a krbu", "Stove and hearth"]))}${tile(L(["Útulnost", "Cosiness"]), D.utulnost + " %", D.utulnost >= 40, "uprava", L(["Nábytek a stěny", "Furniture and walls"]))}
      ${tile(L(["Stav", "Upkeep"]), st.cistota + " / " + st.opravy + " %", st.cistota >= 40 && st.opravy >= 40, "@stavdomu", L(["Stav domu — úklid a opravy", "Upkeep"]))}${tile(L(["Dříví v zásobě", "Firewood stored"]), (z["Palivové dříví"] || 0) + " / " + D.zasoby_max, (z["Palivové dříví"] || 0) > 0, "funkce", L(["Zásoba dříví u pece", "Firewood store"]))}</div>
    <p class="dm-odkazy"><button class="btn small" data-dgo="prodejdomu">${esc(L(["Prodat či darovat dům", "Sell or give away"]))}</button></p>`;
}
// 1.0-1-7: přehled vybavení jen vybrané místnosti
function domovPrehledHtml(D, room, R) {
  const sk = {};
  R.kusy.forEach((k) => { (sk[k.name] = sk[k.name] || { ...k, pocet: 0 }).pocet++; });
  const v = Object.values(sk);
  return `<div class="sect">${esc(L(ROOM_NAZ[room] || [room, room]) + " · " + R.used + " / " + R.slots + L([" míst", " slots"]))}</div>
    <div class="dm-vybaveni">${v.map((k) => `<div class="dm-vb"><img src="${nabSrc(k.name)}" alt="" data-skryt-pri-chybe>
        <span><b>${esc(k.name + (k.pocet > 1 ? " ×" + k.pocet : ""))}</b><small>${esc(k.popis)}</small>
        ${k.domov !== room ? `<em>${esc(L(["patří do místnosti ", "belongs to "]) + L(ROOM_NAZ[k.domov] || [k.domov, k.domov]))}</em>` : ""}</span></div>`).join("")
      || `<div class="empty">${esc(L(["V místnosti zatím nic nestojí. Nábytek koupíš v Úpravě místnosti.", "Nothing here yet."]))}</div>`}</div>`;
}
function domovFunkceHtml(D, room, druhy, chal) {
  const A = D.akce;
  const vRoom = (kinds) => kinds.some((k) => druhy.has(k));
  const chybi = (kinds) => L(["Chybí tu ", "Missing here: "]) + kinds.map((k) => DRUH_NAZ[k] || k).join(L([" nebo ", " or "])) + L([" (truhlář).", " (carpenter)."]);
  const chalNe = ["hearth", "mend", "drill"];   // do chalupy se krb, ponk ani figurína nevejdou
  const tl = DOMOV_FUNKCE.filter(([, kinds, rooms]) => vRoom(kinds) || (chal ? !kinds.every((k) => chalNe.includes(k)) : rooms.includes(room))).map(([k, kinds, , n, d]) => {
    let ok = vRoom(kinds) || (chal && false), proc = ok ? "" : chybi(kinds), attr = "", extra = "";
    if (k.startsWith("ohen:")) { const kind = k.slice(5), O = D.ohen[kind];
      if (ok && O.hori) return `<button class="btn dm-hori" data-ohen="${kind}" data-uhasit="1"><span>${esc(L(kind === "oven" ? ["V peci hoří — uhasit", "Stove lit — put out"] : ["V krbu hoří — uhasit", "Hearth lit — put out"]))}</span><small>${esc(L(["hoří celý herní den; uhašený se sám nezapálí", "burning; once put out it won't relight by itself"]))}</small></button>`;
      const dr = D.drivi + ((D.zasoby || {})["Palivové dříví"] || 0);
      if (ok && dr < 1) { ok = false; proc = L(["Chybí palivové dříví (vetešník, hostinský).", "No firewood."]); }
      attr = `data-ohen="${kind}"`; }
    else if (k.startsWith("dilna:")) attr = `data-dilna="${k.slice(6)}"`;
    else if (k === "uloziste") attr = `data-dgo="uloziste"`;
    else { attr = `data-dcid="ks:home:${k}"`; if (ok && !A[k].ok) { ok = false; proc = A[k].proc; } }
    return `<button class="btn${ok ? (k === "rest" ? " primary" : "") : " zamc"}" ${attr}${ok ? "" : " disabled"} title="${esc(proc || L(d))}"><span>${esc(L(n))}</span><small>${esc(ok ? L(d) : proc)}</small></button>${extra}`; });
  // 1.0-1-6 (Pavel): zásoba dříví přímo u pece a krbu (dřív jen ve Stavu domu)
  const ohenTu = DOMOV_FUNKCE.some(([k, kinds]) => k.startsWith("ohen:") && vRoom(kinds));
  const zq = (D.zasoby || {})["Palivové dříví"] || 0, zu = D.drivi || 0, zmax = D.zasoby_max || 0, zvol = Math.max(0, zmax - zq);
  const drivi = ohenTu ? `<div class="dm-drivi"><b>${esc(L(["Zásoba dříví", "Firewood store"]))}</b>
      <small>${esc(L(["V zásobě ", "Stored "]) + zq + " / " + zmax + L([" · u sebe ", " · carried "]) + zu + L([" · z ní se pec a krb mimo léto zatápějí samy", " · heats the stove and hearth outside summer"]))}</small>
      <div class="dm-drivi-tl">${[1, 5].filter((k) => k <= Math.min(zu, zvol)).map((k) => `<button class="btn small" data-zas="ulozit" data-q="${k}">${esc(L(["Uložit ", "Store "]) + k)}</button>`).join("")}
        ${zu > 0 && zvol > 0 ? `<button class="btn small primary" data-zas="ulozit" data-q="${Math.min(zu, zvol)}">${esc(L(["Uložit vše", "Store all"]))}</button>` : ""}
        ${zq > 0 ? `<button class="btn small" data-zas="vzit" data-q="1">${esc(L(["Vzít 1", "Take 1"]))}</button>` : ""}
        ${!zu && !zq ? `<span class="muted small">${esc(L(["Dříví prodává vetešník a hostinský.", "Firewood: junk dealer and innkeeper."]))}</span>` : ""}</div></div>` : "";
  return tl.length ? `<div class="dm-akce dm-funkce">${tl.join("")}</div>${drivi}
      <p class="muted small">${esc(L(["Zobrazují se funkce nábytku v této místnosti. Teplo: ", "Functions of the furniture in this room. Warmth: "]) + D.teplota + " °C (" + D.teplota_slovem + ")" + L([" · dříví u sebe ", " · firewood carried "]) + D.drivi + L([", v zásobě ", ", stored "]) + ((D.zasoby || {})["Palivové dříví"] || 0))}</p>`
    : `<p class="muted">${esc(L(["V této místnosti zatím není nic, co by se dalo použít. Nábytek koupíš v Úpravě místnosti.", "Nothing to use in this room yet."]))}</p>`;
}
function domovUpravaHtml(D, room, R, chal) {
  const A = D.akce, vyb = R.kusy.find((k) => k.klic === DOMOV_ED.vyber);
  const tf = { r: 0, f: false, s: 1, ...((vyb || {}).tf || {}) };
  const vystava = R.kusy.some((k) => ["armor", "weapons", "trophies"].includes(k.kind));
  const b = (ok, attr, n, proc = "") => `<button class="btn${ok ? "" : " zamc"}" ${attr}${ok ? "" : " disabled"}><span>${esc(L(n))}</span>${proc ? `<small>${esc(proc)}</small>` : ""}</button>`;
  // kam smí označený kus: do světnice nebo do své vlastní místnosti (ne tam, kde už je)
  const kam = !vyb || chal ? [] : D.rooms.filter((r) => r.key !== room && (r.key === "světnice" || r.key === vyb.domov));
  const pta = vyb && DOMOV_ED.vynest === vyb.klic;
  const nastroje = vyb ? `<div class="dm-ed-nastroje"><div class="dm-ed-nazev"><img src="${nabSrc(vyb.name)}" alt=""><b>${esc(vyb.name)}</b>
        <small class="muted">${esc(L(["otočení ", "rotation "]) + tf.r + "° · " + L(["velikost ", "size "]) + Math.round(tf.s * 100) + " %" + (tf.f ? L([" · překlopeno", " · flipped"]) : ""))}</small></div>
      <div class="dm-ed-tl">
        <button class="btn small" data-tf="vlevo" title="${esc(L(["Otočit doleva", "Rotate left"]))}">⟲ 15°</button><button class="btn small" data-tf="vpravo" title="${esc(L(["Otočit doprava", "Rotate right"]))}">⟳ 15°</button>
        <button class="btn small${tf.f ? " on" : ""}" data-tf="preklop">⇋ ${esc(L(["Překlopit", "Flip"]))}</button>
        <button class="btn small" data-tf="mensi">− ${esc(L(["Zmenšit", "Smaller"]))}</button><button class="btn small" data-tf="vetsi">+ ${esc(L(["Zvětšit", "Bigger"]))}</button>
        <button class="btn small" data-tf="zpet">${esc(L(["Původní", "Reset"]))}</button></div>
      ${kam.length ? `<div class="dm-ed-tl"><small class="muted">${esc(L(["Přenést do:", "Carry to:"]))}</small>${kam.map((r) => `<button class="btn small" data-prenest="${esc(r.key)}"${r.used >= r.slots ? ` disabled title="${esc(L(["plno", "full"]))}"` : ""}>${esc(L(ROOM_NAZ[r.key] || [r.key, r.key]) + " (" + r.used + "/" + r.slots + ")")}</button>`).join("")}</div>` : ""}
      <div class="dm-ed-tl">${pta
        ? `<span class="dm-pta">${esc(L(["Opravdu vynést? Truhlář vrátí ", "Really remove? You get "]) + vyb.vratka + " gr.")}</span><button class="btn small dm-vynest" data-vynest="ano">${esc(L(["Ano, vynést", "Yes, remove"]))}</button><button class="btn small" data-vynest="ne">${esc(L(["Ne", "No"]))}</button>`
        : `<button class="btn small dm-vynest" data-vynest="1">${esc(L(["Vynést z domu", "Remove from the house"]))} <small>+${vyb.vratka} gr</small></button>`}</div></div>`
    : `<div class="dm-ed-nastroje prazdne"><b>${esc(L(["Klikni na kus nábytku v náhledu", "Click a piece of furniture"]))}</b><small class="muted">${esc(L(["Pak ho tu otočíš, zvětšíš, přeneseš do jiné místnosti nebo vyneseš. Tažením myší ho posuneš.", "Then rotate, resize, carry or remove it here. Drag to move."]))}</small></div>`;
  return `${nastroje}
    <div class="sect">${esc(L(ROOM_NAZ[room] || [room, room]) + " · " + R.used + " / " + R.slots + L([" míst", " slots"]))}</div>
    <div class="dm-akce">
      ${b(true, "data-truhlar", ["Koupit nábytek", "Buy furniture"], L(["u truhláře", "from the carpenter"]))}
      ${vystava || A.show.ok ? b(A.show.ok, `data-dcid="ks:home:show"`, ["Vystavit předmět", "Display an item"], A.show.ok ? L(["zbroj, zbraně, trofeje", "armour, weapons, trophies"]) : A.show.proc) : ""}
      ${vystava || A.unshow.ok ? b(A.unshow.ok, `data-dcid="ks:home:unshow"`, ["Sundat předmět", "Take an item down"], A.unshow.ok ? "" : A.unshow.proc) : ""}
      ${b(true, `data-dgo="calounik"`, ["Vzhled stěn", "Walls"], L(["čalouník a malíř", "tapestries and paint"]))}</div>`;
}
function domovPodokno(r) {
  DOMOV.sub = true;
  $("#dmprehled").hidden = true;
  const box = $("#dpanel"); box.hidden = false;
  showPanelResult(r, "domovsub");
}
function domovPrehled() { DOMOV.sub = false; render(); }
// 1.0-1: vzhled stěn od čalouníka (domov/steny/<místnost>-<styl>), jinak původní obraz
function domovStena(D, room, zaklad) {
  const st = (D.steny || {})[room];
  if (!st) return zaklad;
  const n = "domov/steny/" + zaklad.split("/").pop() + "-" + st;
  return artReady(n) ? n : zaklad;
}
// 1.0-1: co je vystavené, je vidět na nábytku — zbroj na stojanu, zbraně v držácích, trofeje na policích, odznaky ve vitríně, jídlo ve spíži
const VYS_MISTA = {
  "Stojan na zbroj": { armor: { "hlava": [50, 12, 36], "zbroj": [50, 42, 72], "štít": [78, 62, 46] } },
  "Stojan na zbraně": { seq: "weapons", mista: [[28, 42, 40], [50, 42, 40], [72, 42, 40]] },
  "Stojan na luky": { seq: "weapons", mista: [[35, 45, 44], [65, 45, 44]] },
  "Police na trofeje": { seq: "trophies", mista: [[18, -45, 20], [39, -45, 20], [61, -45, 20], [82, -45, 20]] },
  "Velká police na trofeje": { seq: "trophies", mista: [[25, 28, 22], [50, 28, 22], [75, 28, 22], [25, 62, 22], [50, 62, 22], [75, 62, 22]] },
  "Spíž": { seq: "spiz", mista: [[30, 38, 18], [50, 38, 18], [70, 38, 18], [30, 62, 18], [50, 62, 18], [70, 62, 18]] },
  "Vitrína odznaků": { odznaky: [[25, 45], [42, 45], [58, 45], [75, 45], [25, 62], [42, 62], [58, 62], [75, 62]] },
};
function domovVystaveni(D) {
  const V = D.vystaveno || {}, fronty = { weapons: [...(V.weapons || [])], trophies: [...(V.trophies || [])], spiz: [...(V.spiz || [])] };
  const pridel = {};   // pořadí jako na serveru: místnosti a kusy postupně
  D.rooms.forEach((r) => r.kusy.forEach((k, i) => {
    const M = VYS_MISTA[k.name]; if (!M || !M.seq) return;
    const klic = r.key === "světnice" ? (D.svetnice.find((x) => x.name === k.name && !pridel[x.klic]) || {}).klic : k.name + "#" + i;
    pridel[klic] = fronty[M.seq].splice(0, M.mista.length);
  }));
  const ik = (n, [x, y, w]) => `<span class="dm-vys" style="left:${x}%;top:${y}%;width:${w}%"><img src="${IMG_BASE}predmety/ikony/${Postava.slug(n)}.webp" alt="" title="${esc(n)}"></span>`;
  return (klic, name) => {
    const M = VYS_MISTA[name]; if (!M) return "";
    if (M.armor) return Object.entries(M.armor).map(([sl, m]) => (V.armor || {})[sl] ? ik(V.armor[sl], m) : "").join("");
    if (M.odznaky) return M.odznaky.slice(0, V.odznaky || 0).map(([x, y]) => `<span class="dm-odznak" style="left:${x}%;top:${y}%"></span>`).join("");
    return (pridel[klic] || []).map((n, i) => ik(n, M.mista[i])).join("");
  };
}
// rozmístění nábytku ve světnici: obrázek pokoje se vejde celý (poměr 1216 × 832), kus se táhne myší nebo prstem
function domovRozmisti(view, D, kusy, tah, svetnice) {
  const sc = view.querySelector(".dm-scena"), box = view.querySelector(".dm-pokoj");
  const fit = () => { if (jeMobil()) { box.style.width = ""; box.style.height = ""; return; } const W = sc.clientWidth, H = sc.clientHeight || W * 832 / 1216; let w = W, hh = W * 832 / 1216;
    if (hh > H && H > 50) { hh = H; w = H * 1216 / 832; } box.style.width = w + "px"; box.style.height = hh + "px"; };
  fit(); new ResizeObserver(fit).observe(sc);
  const poz = {};
  const kresli = (el) => { const k = kusy[+el.dataset.i], R = NAB_ROZ[k.name] || [10, 50, 85], [x, y] = poz[k.klic];
    const hloubka = R[3] || R[2] < 50 ? 1 : 0.6 + 0.4 * Math.max(0, Math.min(1, (y - 55) / 43));   // na zdi se nezmenšuje
    const tf = { r: 0, f: false, s: 1, ...(k.tf || {}) };                                          // 1.0-1-5: otočení, překlopení, velikost
    el.style.left = x + "%"; el.style.top = y + "%"; el.style.width = (R[0] * hloubka * tf.s) + "%";
    const im = el.querySelector("img"); if (im) im.style.transform = (tf.r ? `rotate(${tf.r}deg) ` : "") + (tf.f ? "scaleX(-1)" : "");
    el.style.zIndex = R[3] ? 1 : 10 + Math.round(y * 10); };
  box.querySelectorAll(".dm-kus").forEach((el) => {
    const k = kusy[+el.dataset.i], R = NAB_ROZ[k.name] || [10, 50, 85];
    const dalsi = kusy.slice(0, +el.dataset.i).filter((x) => x.name === k.name).length;   // stejný kus víckrát: kousek vedle
    const rozlozeni = svetnice ? null : [Math.round((+el.dataset.i + 1) / (kusy.length + 1) * 100), R[2] < 50 ? R[2] : 86 + (+el.dataset.i % 2) * 8];   // ostatní místnosti: rovnoměrně vedle sebe
    poz[k.klic] = k.pos || rozlozeni || [Math.min(96, R[1] + dalsi * 6), R[2]];
    kresli(el);
    el.querySelector("img").onerror = (e) => { const im = e.target; if (im.dataset.zaloha) { im.src = im.dataset.zaloha; delete im.dataset.zaloha; } else el.classList.add("chybi"); };
    el.querySelectorAll(".dm-vys img").forEach((im) => { im.onerror = () => im.parentElement.remove(); });
    if (!tah) return;
    el.addEventListener("pointerdown", (e) => {
      e.preventDefault(); el.setPointerCapture(e.pointerId); el.classList.add("tahne");
      const rb = box.getBoundingClientRect(), [x0, y0] = poz[k.klic], sx = e.clientX, sy = e.clientY;
      const mv = (ev) => { poz[k.klic] = [Math.max(2, Math.min(98, x0 + (ev.clientX - sx) / rb.width * 100)), Math.max(8, Math.min(100, y0 + (ev.clientY - sy) / rb.height * 100))]; kresli(el); };
      const up = async () => { el.removeEventListener("pointermove", mv); el.classList.remove("tahne");
        const [x, y] = poz[k.klic];
        if (Math.abs(x - x0) + Math.abs(y - y0) < 0.3) return;
        el.dataset.posunul = "1";
        try { await call("domov_pos", { klic: k.klic, x, y }, true); k.pos = [x, y]; } catch { /* toast */ } };
      el.addEventListener("pointermove", mv);
      el.addEventListener("pointerup", up, { once: true });
      el.addEventListener("pointercancel", up, { once: true });
    });
  });
}

// 1.0-1: úložný prostor — každá truhla, skříň a spíž zvlášť s obsahem; vlevo co neseš (Uložit)
const ULOZ = { strana: "vzit" };
const domovZpet = () => DOMOV.zpet || "domov";   // 1.0-1-5: podstránky domova vrací o krok zpět do části, odkud se přišlo
VIEWS.uloziste = async (view) => {
  if (!S.me.house) { go("mesto"); return; }
  let U; try { U = (await call("uloziste", {}, true)).uloziste; } catch { return; }
  if (S.tab !== "uloziste") return;
  const vec = (i, act, lbl) => `<div class="item"${kusAttr(i)}>${icon(i.id)}<div><div class="nm">${esc(i.name)}${kusTag(i)}${i.count > 1 ? ` <span class="muted">× ${i.count}</span>` : ""}</div>
      ${i.count > 1 ? `<label class="kolik"><input type="range" min="1" max="${i.count}" value="${i.count}" data-kolik><b>${i.count}</b></label>` : ""}</div>
    <div class="acts"><button class="btn small${act === "vezmi_doma" ? " primary" : ""}" data-ul="${act}" data-v="${esc(i.id)}">${esc(lbl)}</button></div></div>`;
  const nic = !U.kusy.length;
  if (!(ULOZ.kus >= 0 && ULOZ.kus < U.kusy.length)) ULOZ.kus = 0;   // 1.0-1-5: nahoře panel truhel, pod ním klasický inventář otevřené truhly
  const K = U.kusy[ULOZ.kus];
  view.replaceChildren(h(`${sceneHead(artReady("domov/nahled-dum-uloziste") ? "domov/nahled-dum-uloziste" : "domov/dum-svetnice", L(["Úložný prostor", "Storage"]), L(["Truhly: ", "Chests: "]) + U.chest[0] + " / " + U.chest[1] + L([" druhů · Spíž: ", " kinds · Pantry: "]) + U.pantry[0] + " / " + U.pantry[1], true)}
    ${nic ? `<div class="panel notice">${esc(L(["Nemáš žádnou truhlu, skříň ani spíž. Nábytek na ukládání prodává truhlář (Domov → Úprava místnosti).", "You have no chest, wardrobe or pantry."]))}</div>` : `<div class="ul-obal">
    <div class="ul-truhly">${U.kusy.map((k, i) => `<button class="ul-truhla${i === ULOZ.kus ? " on" : ""}" data-ultruhla="${i}"><img src="${nabSrc(k.name)}" alt="" data-skryt-pri-chybe>
        <b>${esc(k.name)}</b><small>${esc(L(ROOM_NAZ[k.room] || [k.room, k.room]) + " · " + k.items.length + " / " + k.slots)}</small></button>`).join("")}</div>
    <div class="m-zalozky truhla-zal"><button class="${ULOZ.strana === "ulozit" ? "on" : ""}" data-us="ulozit">${esc(L(["Uložit", "Store"]))}<small>${esc(L(["u sebe ", "carried "]) + U.carried.length)}</small></button>
      <button class="${ULOZ.strana !== "ulozit" ? "on" : ""}" data-us="vzit">${esc(L(["Vzít", "Take"]))}<small>${esc(L(["v truhle ", "inside "]) + K.items.length)}</small></button></div>
    <div class="grid g2 truhla-sloupce ul-sloupce strana-${ULOZ.strana === "ulozit" ? "ulozit" : "vzit"}" style="align-items:start">
      <div class="panel"><div class="spread"><h3>${esc(L(["U sebe", "Carried"]))}</h3><span class="pill">${U.carried.length}</span></div>
        <div class="items ul-items">${U.carried.filter((i) => K.kind !== "pantry" || U.jidlo.includes(i.id)).map((i) => vec(i, "uloz_doma", L(["Uložit", "Store"]))).join("")
          || `<div class="empty">${esc(K.kind === "pantry" ? L(["Nemáš u sebe nic k jídlu ani pití.", "No food carried."]) : L(["Nic u sebe nemáš.", "Nothing carried."]))}</div>`}</div></div>
      <div class="panel"><div class="spread"><h3>${esc(K.name)}</h3><span class="pill">${K.items.length} / ${K.slots}</span></div>
        <div class="items ul-items">${K.items.map((i) => vec(i, "vezmi_doma", L(["Vzít", "Take"]))).join("") || `<div class="empty">${esc(L(["Prázdná.", "Empty."]))}</div>`}</div></div>
    </div></div>`}
    <p><button class="btn" id="pback">← ${esc(t("back"))}</button></p>`));
  view.querySelectorAll("[data-ultruhla]").forEach((b) => b.onclick = () => { ULOZ.kus = +b.dataset.ultruhla; ULOZ.strana = "vzit"; Zvuk.sfx("klik"); render(); });
  mountLive(view);
  $("#pback").onclick = () => go(domovZpet());
  view.querySelectorAll("[data-us]").forEach((b) => b.onclick = () => { ULOZ.strana = b.dataset.us; Zvuk.sfx("klik"); render(); });
  view.querySelectorAll("[data-kolik]").forEach((r) => r.oninput = () => { r.nextElementSibling.textContent = r.value; });
  view.querySelectorAll("[data-ul]").forEach((b) => b.onclick = async () => {
    b.disabled = true; const r = b.closest(".item").querySelector("[data-kolik]");
    try { const x = await call(b.dataset.ul, { name: b.dataset.v, qty: kolikRadek(b) }); toast(x.zprava); Zvuk.sfx("klik"); } catch { b.disabled = false; return; }
    render(); });
  loadIcons([...U.carried, ...U.kusy.flatMap((k) => k.items)].map((i) => i.id));
  vejdiObchod(".ul-sloupce .ul-items");
};

// 1.0-1: stav domu — čistota a opravy ubývají; čistý a opravený dům dá bonus, zanedbaný postihy
VIEWS.stavdomu = async (view) => {
  if (!S.me.house) { go("mesto"); return; }
  let D; try { D = (await call("domov", {}, true)).domov; } catch { return; }
  if (S.tab !== "stavdomu") return;
  const st = D.stav;
  const pruh = (n, v, ub) => { const tr = v >= 80 ? "dobre" : v >= 40 ? "stredni" : v >= 15 ? "zle" : "rozbite";
    return `<div class="sd-pruh"><div class="spread"><b>${esc(n)}</b><span>${v} %</span></div><div class="opotreb ${tr}"><i style="width:${v}%"></i></div><small class="muted">${esc(L(["ubývá ", "drops "]) + ub + L([" % za herní den", " % per game day"]))}</small></div>`; };
  const PR = [["uklid", ["Uklidit sám", "Clean up"], ["Zdarma, jednou za herní den: čistota +35 %.", "Free, once a game day: +35 %."], st.uklid, L(["Dnes už jsi uklízel.", "Already cleaned today."])],
    ["devecka", ["Zaplatit děvečku", "Hire a maid"], [`Čistota na 100 % za ${st.devecka} gr.`, `Cleanliness to 100 % for ${st.devecka} gr.`], st.cistota < 99 && S.me.coins >= st.devecka, st.cistota >= 99 ? L(["Dům je čistý.", "Clean."]) : L(["Nemáš dost grošů.", "Not enough coins."])],
    ["spravit", ["Spravit sám", "Mend it yourself"], ["Zdarma, jednou za herní den: opravy +15 %.", "Free, once a game day: +15 %."], st.spravit && st.opravy < 100, st.opravy >= 100 ? L(["Není co spravovat.", "Nothing to mend."]) : L(["Dnes už jsi spravoval.", "Already mended today."])],
    ["oprava", ["Zavolat tesaře a pokrývače", "Call the carpenter"], [`Opravy na 100 % za ${st.oprava} gr.`, `Repairs to 100 % for ${st.oprava} gr.`], st.oprava > 0 && S.me.coins >= st.oprava, !st.oprava ? L(["Dům je v pořádku.", "All repaired."]) : L(["Nemáš dost grošů.", "Not enough coins."])]];
  view.replaceChildren(h(`${sceneHead(artReady("domov/nahled-dum-stav") ? "domov/nahled-dum-stav" : "domov/dum-svetnice", L(["Stav domu", "House upkeep"]), D.name, true)}
    <div class="panel sd-panel"><div class="sd-vnitr">${pruh(L(["Čistota", "Cleanliness"]), st.cistota, st.ubytek.cistota)}${pruh(L(["Opravy", "Repairs"]), st.opravy, st.ubytek.opravy)}
      <div class="sd-ucinky">${st.ucinky.length ? st.ucinky.map((x) => `<p>${esc(noEmoji(x))}</p>`).join("") : `<p class="muted">${esc(L(["Dům je v běžném stavu — bez bonusu i postihu.", "No bonus or penalty."]))}</p>`}
        ${st.kuchar ? `<p>${esc(L(["Ve špinavé kuchyni se hůř vaří: −1 ke kuchařské zkoušce.", "Dirty kitchen: −1 to cooking."]))}</p>` : ""}</div>
      <div class="dm-akce sd-akce">${PR.map(([k, n, d, ok, proc]) => `<button class="btn${ok ? (k === "uklid" || k === "spravit" ? " primary" : "") : " zamc"}" data-sd="${k}"${ok ? "" : " disabled"}><span>${esc(L(n))}</span><small>${esc(ok ? L(d) : proc)}</small></button>`).join("")}</div>
      <div class="sect">${esc(L(["Teplo a útulnost", "Warmth and cosiness"]))}</div>
      <div class="sd-teplo"><div class="sd-pruh"><div class="spread"><b>${esc(L(["Teplota v domě", "Indoor temperature"]))}</b><span>${esc(st.teplota + " °C · " + st.teplota_slovem)}</span></div>
          <div class="opotreb ${st.teplota >= 14 ? "dobre" : st.teplota >= 8 ? "stredni" : "zle"}"><i style="width:${Math.max(4, Math.min(100, (st.teplota + 5) * 3.4))}%"></i></div>
          <small class="muted">${esc(L(["Venku ", "Outside: "]) + st.obdobi + " · " + (st.ohen.oven.hori || st.ohen.hearth.hori ? L(["topí se", "heated"]) : L(["netopí se", "not heated"])))}</small></div>
        <div class="sd-pruh"><div class="spread"><b>${esc(L(["Útulnost", "Cosiness"]))}</b><span>${st.utulnost} %</span></div><div class="opotreb ${st.utulnost >= 60 ? "dobre" : st.utulnost >= 30 ? "stredni" : "zle"}"><i style="width:${st.utulnost}%"></i></div>
          <small class="muted">${esc(L(["Ozdoby, oheň, čistota a teplo", "Decorations, fire, cleanliness, warmth"]))}</small></div></div>
      <p class="muted small">${esc(st.teplota < 8 ? L(["V domě je zima: po spánku odpočatost −20 a ráno budeš promrzlý. Zatop v peci nebo v krbu.", "Cold house: rest −20 and you wake up chilled."])
        : st.teplota < 14 ? L(["V domě je chladno: po spánku odpočatost −8.", "Chilly: rest −8."]) : L(["V domě je teplo — vyspíš se dobře a zahřeješ se.", "Warm house — good sleep."]))}</p>
      <div class="sect">${esc(L(["Zásoby pro chod domu", "Household supplies"]))}</div>
      ${Object.entries(st.zasoby).map(([n, q]) => { const u = st.u_sebe[n] || 0, volno = st.zasoby_max - q;
        return `<div class="sd-zasoba"><img class="sd-zas-obr" src="${ART_SRC("domov/nahled-chalupa-zasoby")}" alt="" data-nahrada="${IMG_BASE}predmety/ikony/${Postava.slug(n)}.webp"><div><b>${esc(n)}</b>
          <small>${esc(L(["V zásobě ", "Stored "]) + q + " / " + st.zasoby_max + L([" · u sebe ", " · carried "]) + u)}</small>
          <small class="muted">${esc(L(["Když venku není léto, pec a krb se ze zásob zatopí samy (otep na herní den).", "Outside summer the stove and hearth light themselves from the woodpile."]))}</small></div>
          <div class="sd-zas-tl">${[1, 5].filter((k) => k <= Math.min(u, volno)).map((k) => `<button class="btn small" data-zas="ulozit" data-q="${k}">${esc(L(["Uložit ", "Store "]) + k)}</button>`).join("")}
            ${u > 0 && volno > 0 ? `<button class="btn small primary" data-zas="ulozit" data-q="${Math.min(u, volno)}">${esc(L(["Uložit vše", "Store all"]))}</button>` : ""}
            ${q > 0 ? `<button class="btn small" data-zas="vzit" data-q="1">${esc(L(["Vzít 1", "Take 1"]))}</button>` : ""}</div></div>`; }).join("")}
      <details class="sd-pravidla"><summary>${esc(L(["Jak to funguje", "How it works"]))}</summary>
        <p>${esc(L(["Čistota i opravy 80 % a víc: po spánku doma odpočatost +5. Čistota pod 40 %: odpočatost −15, pod 25 % hůř vaříš, pod 15 % se hůř léčíš. Opravy pod 40 %: odpočatost −10, pod 15 % se hůř léčíš.", "Both 80 %+: rest +5. Low cleanliness or repairs bring penalties."]))}</p>
        <p>${esc(L(["Teplota: pod 8 °C se doma nevyspíš (odpočatost −20) a promrzneš, pod 14 °C je chladno (−8). Od 16 °C se ohřeješ a oblečení uschne. Pec přidá 8 °C, krb 10 °C, koberec a kožešina trochu. Rozbitý dům táhne (−3 °C). Chalupa je o 2 °C chladnější.", "Below 8 °C you sleep badly and get chilled; stove +8 °C, hearth +10 °C."]))}</p></details>
    </div></div>
    <p><button class="btn" id="pback">← ${esc(t("back"))}</button></p>`));
  mountLive(view);
  $("#pback").onclick = () => go(domovZpet());
  view.querySelectorAll("[data-sd]").forEach((b) => b.onclick = async () => {
    b.disabled = true; Zvuk.sfx("klik");
    try { const x = await call("domov_stav", { co: b.dataset.sd }); toast(x.zprava); } catch { b.disabled = false; return; }
    render(); });
  view.querySelectorAll("[data-zas]").forEach((b) => b.onclick = async () => { b.disabled = true;   // 1.0-1-5: zásoby dříví
    try { const x = await call("domov_zasoby", { co: b.dataset.zas, qty: +b.dataset.q }); toast(x.zprava); Zvuk.sfx("klik"); } catch { b.disabled = false; return; } render(); });
  vejdiObchod(".sd-vnitr");
};

// 1.0-1: Čalouník na tržišti — tapety (čalouny) a malby stěn pro každou místnost; náhled místnosti v novém vzhledu
const CAL = { room: "" };
VIEWS.calounik = async (view) => {
  let T; try { T = (await call("tapety", {}, true)).tapety; } catch { return; }
  if (S.tab !== "calounik") return;
  const obr = artReady("mesto-calounik") ? "mesto-calounik" : "mesto-trziste";
  if (!T.house) {
    view.replaceChildren(h(`${sceneHead(obr, L(["Čalouník", "Tapestry maker"]), L(["Čalouník: „Bez domu nemám co vyzdobit.“", "No house, nothing to decorate."]), true)}
      <div class="panel notice">${esc(L(["Nejdřív si kup dům nebo chalupu na radnici.", "Buy a house first."]))}</div><p><button class="btn" id="pback">← ${esc(t("back"))}</button></p>`));
    mountLive(view); $("#pback").onclick = () => go("misto/trziste"); return;
  }
  const chal = T.house === "chalupa";
  const room = T.rooms.find((r) => r.key === CAL.room) ? CAL.room : T.rooms[0].key;
  const R = T.rooms.find((r) => r.key === room);
  const zaklad = "domov/" + (chal ? "chalupa" : "dum") + "-" + R.img;
  // 1.0-3-8: náhled se načte rovnou (dřív čekal na artReady a bez překreslení se nikdy neukázal); chybí-li malba chalupy, ukáže se stejný styl z domu
  const nah = (st) => st === "puvodni" ? zaklad : "domov/steny/" + zaklad.split("/").pop() + "-" + st;
  const nahZaloha = (st) => st === "puvodni" || !chal ? "" : "domov/steny/dum-" + R.img + "-" + st;
  view.replaceChildren(h(`${sceneHead(obr, L(["Čalouník", "Tapestry maker"]), L(["Čalouník: „Čalouny z Flander, malby jako v kostele. Vyber si.“", "\"Flemish tapestries, church-style paintings. Choose.\""]), true)}
    <div class="panel cal-panel">
      <div class="bf-filtr">${T.rooms.map((r) => `<button type="button" class="chip${r.key === room ? " on" : ""}" data-cr="${esc(r.key)}">${esc(L(ROOM_NAZ[r.key] || [r.key, r.key]))}</button>`).join("")}</div>
      <div class="cal-styly">${T.styly.map((st) => { const ma = R.styl === st.key, n = nah(st.key), cena = R.ceny[st.key];
        const z = nahZaloha(st.key);
        return `<div class="cal-styl${ma ? " on" : ""}"><span class="cal-nah"><i>${esc(L(["náhled se maluje", "preview pending"]))}</i><img class="cal-img" alt="" src="${ART_SRC(n)}"${z ? ` data-nahrada="${ART_SRC(z)}" data-nahrada-trida="ukazka"` : " data-pryc-pri-chybe"}></span>
          <b>${esc(st.name)}</b><small>${esc(st.popis)}</small>
          ${ma ? `<em class="cal-ma">${esc(L(["Máš", "Current"]))}</em>` : `<button class="btn small primary" data-cs="${esc(st.key)}"${T.coins < cena ? " disabled" : ""}>${esc((st.key === "puvodni" ? L(["Vrátit · ", "Restore · "]) : L(["Koupit · ", "Buy · "])) + cena + " gr.")}</button>`}</div>`; }).join("")}</div>
    </div>
    <p><button class="btn" id="pback">← ${esc(t("back"))}</button></p>`));
  mountLive(view);
  $("#pback").onclick = () => go(DOMOV.zpet && S.me.house ? DOMOV.zpet : "misto/trziste");   // 1.0-1-5: z domova zpět do Úpravy místnosti
  view.querySelectorAll("[data-cr]").forEach((b) => b.onclick = () => { CAL.room = b.dataset.cr; Zvuk.sfx("klik"); render(); });
  view.querySelectorAll("[data-cs]").forEach((b) => b.onclick = async () => {
    b.disabled = true;
    try { const x = await call("tapeta", { room, styl: b.dataset.cs }); toast(x.zprava); Zvuk.sfx("mince"); } catch { b.disabled = false; return; }
    render(); });
  vejdiObchod(".cal-styly");
};

// 1.0-1: prodat dům radnici, darovat městu (pověst) nebo jinému hráči (bez domu)
VIEWS.prodejdomu = async (view) => {
  if (!S.me.house) { go("mesto"); return; }
  let P; try { P = (await call("dum_predat_info", {}, true)).predat; } catch { return; }
  if (S.tab !== "prodejdomu") return;
  view.replaceChildren(h(`${sceneHead(artReady("domov/nahled-dum-prodej") ? "domov/nahled-dum-prodej" : "mesto-radnice", L(["Prodat či darovat", "Sell or give away"]), P.name, true)}
    <div class="panel pd-panel">
      ${P.plno ? `<p class="notice">${esc(L(["Nejdřív si vyber věci z truhel a spíže a sundej vystavené věci — dům se předává prázdný.", "Empty the storage and displays first."]))}</p>` : ""}
      <div class="pd-volby">
        <div class="pd-v"><b>${esc(L(["Prodat radnici", "Sell to the town hall"]))}</b><small>${esc(L(["Radnice vyplatí 75 % pořizovací ceny domu i nábytku.", "The town hall pays 75 % of what you paid for the house and furniture."]))}</small>
          <button class="btn primary" data-pd="prodat"${P.plno ? " disabled" : ""}>${esc(L(["Prodat za ", "Sell for "]) + P.cena + " gr.")}</button></div>
        <div class="pd-v"><b>${esc(L(["Darovat městu", "Give to the town"]))}</b><small>${esc(L(["Dům připadne městu na chudobinec. Nic nedostaneš, ale dar se počítá do pověsti (hodnota ", "No money, but it counts towards your renown (value "]) + P.cena + " gr.).")}</small>
          <button class="btn" data-pd="mesto"${P.plno ? " disabled" : ""}>${esc(L(["Darovat městu", "Give to the town"]))}</button></div>
        <div class="pd-v"><b>${esc(L(["Darovat hráči", "Give to a player"]))}</b><small>${esc(L(["Dům i s nábytkem dostane hráč, který zatím žádný dům nemá.", "The house with its furniture goes to a player without a house."]))}</small>
          ${P.hraci.length ? `<div class="row"><select id="pdkomu"><option value="">${esc(L(["Vyber hráče…", "Choose a player…"]))}</option>${P.hraci.map((x) => `<option value="${esc(x.id)}">${esc(x.name + " · úr. " + x.level)}</option>`).join("")}</select>
            <button class="btn" data-pd="hrac"${P.plno ? " disabled" : ""}>${esc(L(["Darovat", "Give"]))}</button></div>` : `<p class="muted">${esc(L(["Žádný hráč bez domu tu teď není.", "No player without a house."]))}</p>`}</div>
      </div>
    </div>
    <p><button class="btn" id="pback">← ${esc(t("back"))}</button></p>`));
  mountLive(view);
  $("#pback").onclick = () => go(domovZpet());
  view.querySelectorAll("[data-pd]").forEach((b) => b.onclick = async () => {
    const co = b.dataset.pd, komu = co === "hrac" ? ($("#pdkomu") || {}).value : "";
    if (co === "hrac" && !komu) { toast(L(["Vyber hráče.", "Choose a player."]), true); return; }
    const kdo = co === "hrac" ? $("#pdkomu").selectedOptions[0].textContent : "";
    const otazka = co === "prodat" ? L([`Opravdu prodat ${P.name} za ${P.cena} gr.? Nejde to vrátit.`, "Really sell?"]) : co === "mesto" ? L([`Opravdu darovat ${P.name} městu? Nejde to vrátit.`, "Really give to the town?"]) : L([`Opravdu darovat ${P.name} hráči ${kdo}? Nejde to vrátit.`, "Really give it away?"]);
    if (!confirm(otazka)) return;
    b.disabled = true;
    try { const x = await call("dum_predat", { co, komu }); toast(x.zprava); if (x.me) S.me = x.me; } catch { b.disabled = false; return; }
    go("mesto"); });
};

// 1.0-1: minihra „trefa do pole“ — ručička jezdí po liště, klik (nebo mezerník) ve zlatém poli = zásah; pole se s koly zužuje
function miniTrefa(box, { kola = 3, nazvy = [], zona = 22, rychlost = 1.1, uz = 0.8, ikona = "" } = {}) {
  return new Promise((hotovo) => {
    let kolo = 0, zasahy = 0, t0 = performance.now(), x = 0, z0 = 0, bezi = true, raf = 0;
    box.innerHTML = `<div class="mt">${ikona ? `<img class="mt-ik" src="${ikona}" alt="">` : ""}<p class="mt-nazev"></p>
      <div class="mt-lista"><span class="mt-pole"></span><span class="mt-ruc"></span></div>
      <div class="mt-kola">${Array.from({ length: kola }, () => "<i></i>").join("")}</div>
      <button class="btn primary mt-ted">${esc(L(["Teď!", "Now!"]))}</button><small class="muted">${esc(L(["Klikni nebo zmáčkni mezerník, když je ručička ve zlatém poli.", "Click or press space when the marker is in the gold zone."]))}</small></div>`;
    const pole = box.querySelector(".mt-pole"), ruc = box.querySelector(".mt-ruc"), nz = box.querySelector(".mt-nazev"), kk = box.querySelectorAll(".mt-kola i");
    const nove = () => { const w = Math.max(8, zona * Math.pow(uz, kolo)); z0 = 6 + Math.random() * (88 - w); pole.style.left = z0 + "%"; pole.style.width = w + "%"; pole.dataset.w = w;
      nz.textContent = nazvy[kolo] || L(["Kolo ", "Round "]) + (kolo + 1); t0 = performance.now(); };
    // 1.0-1-6 (Pavel): pomalejší ručička a zásah přesně v okamžiku stisku (ne až při puštění tlačítka — to ručička mezitím ujela)
    const poloha = (t) => 50 + 48 * Math.sin((t - t0) / 1000 * rychlost * 0.6 * (1 + kolo * 0.1) * Math.PI);
    const krok = (t) => { if (!bezi) return; x = poloha(t); ruc.style.left = x + "%"; raf = requestAnimationFrame(krok); };
    const klik = (e) => { if (!bezi) return; const tc = e && e.timeStamp ? e.timeStamp : performance.now(); x = poloha(tc); ruc.style.left = x + "%";
      const w = +pole.dataset.w, hit = x >= z0 && x <= z0 + w;
      if (hit) zasahy++; kk[kolo].className = hit ? "ok" : "ne"; Zvuk.sfx(hit ? "mince" : "klik");
      box.querySelector(".mt-lista").classList.add(hit ? "zasah" : "vedle"); setTimeout(() => box.querySelector(".mt-lista")?.classList.remove("zasah", "vedle"), 260);
      kolo++; if (kolo >= kola) { bezi = false; cancelAnimationFrame(raf); removeEventListener("keydown", kl); setTimeout(() => hotovo(zasahy), 450); } else nove(); };
    const kl = (e) => { if (e.code === "Space" && !e.repeat) { e.preventDefault(); klik(e); } };
    const ted = box.querySelector(".mt-ted"), lista = box.querySelector(".mt-lista");
    ted.onpointerdown = (e) => { e.preventDefault(); klik(e); }; ted.onclick = (e) => e.preventDefault();
    lista.onpointerdown = (e) => { e.preventDefault(); klik(e); }; addEventListener("keydown", kl);
    nove(); raf = requestAnimationFrame(krok);
  });
}

// 1.0-1-5: řemeslná minihra „postup“ — několik kroků jako při skutečné práci (rozžhavit, kovat, kalit; roztočit kolo, brousit s náklonem;
// vyklepávat…). Každý krok má vlastní interakci; výsledek 0–5 rozhodne o výrobku, vylepšení nebo opravě. t = obtížnost 0–1.
function miniPostup(box, { nazev = "", ikona = "", faze = [], t = 0.5 } = {}) {
  return new Promise((hotovo) => {
    const sk = [], tt = Math.max(0, Math.min(1, t));
    let i = 0, stop = null;
    const klavesy = new Set();
    const kd = (e) => { if (e.code === "Space") { e.preventDefault(); if (!klavesy.has("sp")) { klavesy.add("sp"); box.dispatchEvent(new CustomEvent("mp-dolu")); } } };
    const ku = (e) => { if (e.code === "Space") { klavesy.delete("sp"); box.dispatchEvent(new CustomEvent("mp-nahoru")); } };
    addEventListener("keydown", kd); addEventListener("keyup", ku);
    const konec = () => { removeEventListener("keydown", kd); removeEventListener("keyup", ku);
      const sc = Math.round(5 * sk.reduce((a, b) => a + b, 0) / Math.max(1, sk.length));
      box.querySelector(".mp-scena").innerHTML = `<div class="mp-vysl"><b>${esc(L(["Hotovo", "Done"]))}: ${sc} / 5</b><small>${sk.map((x, k) => esc(L(faze[k].n)) + " " + Math.round(x * 100) + " %").join(" · ")}</small></div>`;
      box.querySelector(".mp-ovl").innerHTML = "";
      setTimeout(() => hotovo(sc), 900); };
    box.innerHTML = `<div class="mp">${ikona ? `<img class="mp-ik" src="${ikona}" alt="">` : ""}<p class="mp-nazev">${esc(nazev)}</p>
      <ol class="mp-kroky">${faze.map((f, k) => `<li data-k="${k}">${esc(L(f.n))}</li>`).join("")}</ol>
      <p class="mp-pokyn"></p><div class="mp-scena"></div><div class="mp-ovl"></div></div>`;
    const sc = box.querySelector(".mp-scena"), pok = box.querySelector(".mp-pokyn"), ovl = box.querySelector(".mp-ovl");
    const dalsi = (v) => { sk.push(Math.max(0, Math.min(1, v))); const li = box.querySelector(`.mp-kroky li[data-k="${i}"]`); if (li) { li.classList.remove("ted"); li.classList.add(v >= 0.6 ? "ok" : v >= 0.3 ? "napul" : "ne"); }
      Zvuk.sfx(v >= 0.6 ? "mince" : "klik"); i++; if (stop) { stop(); stop = null; } setTimeout(() => i < faze.length ? zacni() : konec(), 450); };
    const zacni = () => { const f = faze[i]; box.querySelector(`.mp-kroky li[data-k="${i}"]`)?.classList.add("ted"); pok.textContent = L(f.p || ["", ""]); ovl.innerHTML = ""; sc.className = "mp-scena " + f.typ; MP_TYPY[f.typ](sc, ovl, tt, f, dalsi, (fn) => { stop = fn; }, box); };
    zacni();
  });
}
const MP_TYPY = {
  // drž v pásmu: drž tlačítko (nebo mezerník) — hodnota stoupá, pustíš — klesá; drž ji v zlatém pásmu
  drz(sc, ovl, t, f, dalsi, setStop, box) {
    const W = 26 - t * 12, dur = 6500; let v = 10, drzi = false, cil = 55 + Math.random() * 20, t0 = performance.now(), last = t0, uvnitr = 0, raf;
    sc.innerHTML = `<div class="mp-teplo"><i class="mp-pasmo"></i><i class="mp-hodn"></i></div><div class="mp-zar"><span></span></div><div class="mp-cas"><i></i></div>`;
    ovl.innerHTML = `<button class="btn primary mp-drz">${esc(L(f.b || ["Drž", "Hold"]))}</button><small class="muted">${esc(L(["Drž tlačítko nebo mezerník, pusť, když přetahuješ.", "Hold the button or space; release when too high."]))}</small>`;
    const pas = sc.querySelector(".mp-pasmo"), hod = sc.querySelector(".mp-hodn"), zar = sc.querySelector(".mp-zar span"), cas = sc.querySelector(".mp-cas i"), b = ovl.querySelector(".mp-drz");
    const dolu = (e) => { e && e.preventDefault(); drzi = true; b.classList.add("on"); }, nahoru = () => { drzi = false; b.classList.remove("on"); };
    b.addEventListener("pointerdown", dolu); addEventListener("pointerup", nahoru); box.addEventListener("mp-dolu", dolu); box.addEventListener("mp-nahoru", nahoru);
    const krok = (now) => { const dt = Math.min(50, now - last) / 1000; last = now;
      v = Math.max(0, Math.min(100, v + (drzi ? 34 + t * 18 : -(24 + t * 14)) * dt));
      cil = Math.max(W / 2 + 5, Math.min(95 - W / 2, cil + Math.sin(now / (900 - t * 300)) * (4 + t * 10) * dt));
      const lo = cil - W / 2, hi = cil + W / 2, ok = v >= lo && v <= hi; if (ok) uvnitr += dt;
      pas.style.bottom = lo + "%"; pas.style.height = W + "%"; hod.style.bottom = v + "%"; hod.classList.toggle("ok", ok);
      zar.style.opacity = (0.15 + v / 110).toFixed(2); zar.style.filter = `hue-rotate(${(-v * 0.25).toFixed(0)}deg) brightness(${(0.6 + v / 90).toFixed(2)})`;
      const pr = (now - t0) / dur; cas.style.width = Math.min(100, pr * 100) + "%";
      if (pr >= 1) { dalsi(Math.min(1, uvnitr / (dur / 1000) * 1.25)); return; } raf = requestAnimationFrame(krok); };
    raf = requestAnimationFrame(krok);
    setStop(() => { cancelAnimationFrame(raf); removeEventListener("pointerup", nahoru); box.removeEventListener("mp-dolu", dolu); box.removeEventListener("mp-nahoru", nahoru); });
  },
  // terče: na rozžhaveném plátu (promáčklé zbroji, v hmoždíři…) se objevují místa — klikni na ně, než zmizí
  terce(sc, ovl, t, f, dalsi, setStop) {
    const N = 7, ttl = 1300 - t * 650; let n = 0, tref = 0, vedle = 0, tim, ziva = null;
    sc.innerHTML = `<div class="mp-plocha ${f.vzhled || ""}"></div>`;
    ovl.innerHTML = `<small class="muted">${esc(L(["Klikej na zářící místa. Rána vedle se počítá proti tobě.", "Click the glowing spots; misses count against you."]))}</small><div class="mp-pocit"></div>`;
    const pl = sc.querySelector(".mp-plocha"), poc = ovl.querySelector(".mp-pocit");
    const ukaz = () => { poc.textContent = L(["Zásahy ", "Hits "]) + tref + " / " + N;
      if (n >= N) { dalsi(Math.max(0, (tref - vedle * 0.5) / N)); return; }
      n++; const el = document.createElement("button"); el.type = "button"; el.className = "mp-terc"; el.style.left = (8 + Math.random() * 84) + "%"; el.style.top = (12 + Math.random() * 76) + "%";
      el.style.setProperty("--ttl", ttl + "ms"); pl.append(el); ziva = el;
      el.onpointerdown = (e) => { e.stopPropagation(); if (ziva !== el) return; ziva = null; tref++; el.classList.add("trefa"); Zvuk.sfx(f.zvuk || "kovadlina"); clearTimeout(tim); setTimeout(() => el.remove(), 180); tim = setTimeout(ukaz, 160 + Math.random() * 220); };
      tim = setTimeout(() => { if (ziva === el) { ziva = null; el.classList.add("pryc"); setTimeout(() => el.remove(), 200); ukaz(); } }, ttl); };
    pl.onpointerdown = () => { vedle++; pl.classList.add("vedle"); setTimeout(() => pl.classList.remove("vedle"), 150); };
    tim = setTimeout(ukaz, 500);
    setStop(() => clearTimeout(tim));
  },
  // okamžik: barva kovu (nebo síla tahu) se mění — klikni, když je ve správném pásmu
  okamzik(sc, ovl, t, f, dalsi, setStop) {
    const W = 15 - t * 7, z0 = 35 + Math.random() * 35, rych = 0.32 + t * 0.22; let x = 0, smer = 1, raf, last = performance.now(), hotov = false;
    sc.innerHTML = `<div class="mp-pruh ${f.vzhled || ""}"><i class="mp-zona" style="left:${z0}%;width:${W}%"></i><i class="mp-jezdec"></i></div>`;
    ovl.innerHTML = `<button class="btn primary mp-ted">${esc(L(f.b || ["Teď!", "Now!"]))}</button><small class="muted">${esc(L(["Klikni nebo mezerník, když je jezdec ve zlatém poli.", "Click or press space in the gold zone."]))}</small>`;
    const j = sc.querySelector(".mp-jezdec");
    const krok = (now) => { const dt = Math.min(50, now - last) / 1000; last = now; x += smer * rych * 100 * dt; if (x >= 100) { x = 100; smer = -1; } if (x <= 0) { x = 0; smer = 1; }
      j.style.left = x + "%"; raf = requestAnimationFrame(krok); };
    const klik = () => { if (hotov) return; hotov = true; cancelAnimationFrame(raf); const stred = z0 + W / 2, d = Math.abs(x - stred);
      dalsi(d <= W / 2 ? 1 - (d / (W / 2)) * 0.25 : Math.max(0, 0.6 - (d - W / 2) / 25)); };
    ovl.querySelector(".mp-ted").onclick = klik; const kl = (e) => { if (e.code === "Space") { e.preventDefault(); klik(); } }; addEventListener("keydown", kl);
    raf = requestAnimationFrame(krok);
    setStop(() => { cancelAnimationFrame(raf); removeEventListener("keydown", kl); });
  },
  // kolo: roztoč brusné kolo klikáním a drž otáčky v pásmu
  kolo(sc, ovl, t, f, dalsi, setStop) {
    const dur = 5500, lo = 55 + t * 8, hi = 80 - t * 4; let v = 0, uhel = 0, t0 = performance.now(), last = t0, uvnitr = 0, raf;
    sc.innerHTML = `<div class="mp-kolo-obal"><svg class="mp-kolo" viewBox="-50 -50 100 100"><circle r="44" fill="#7d7468" stroke="#3d342a" stroke-width="4"/><circle r="30" fill="#958b7c"/>
      ${Array.from({ length: 8 }, (_, k) => `<line x1="0" y1="0" x2="${(40 * Math.cos(k * Math.PI / 4)).toFixed(1)}" y2="${(40 * Math.sin(k * Math.PI / 4)).toFixed(1)}" stroke="#5b5146" stroke-width="2.5"/>`).join("")}
      <circle r="7" fill="#3d2a17"/></svg><div class="mp-otacky"><i class="mp-pasmo" style="bottom:${lo}%;height:${hi - lo}%"></i><i class="mp-hodn"></i></div></div><div class="mp-cas"><i></i></div>`;
    ovl.innerHTML = `<button class="btn primary mp-tl">${esc(L(f.b || ["Šlápnout na šlapku", "Pump the treadle"]))}</button><small class="muted">${esc(L(["Klikej (nebo mezerník) — otáčky musí zůstat v pásmu.", "Click (or space) to keep the speed in the band."]))}</small>`;
    const k = sc.querySelector(".mp-kolo"), hod = sc.querySelector(".mp-hodn"), cas = sc.querySelector(".mp-cas i");
    const slap = () => { v = Math.min(100, v + 9 - t * 2); };
    ovl.querySelector(".mp-tl").onclick = slap; const kl = (e) => { if (e.code === "Space") { e.preventDefault(); slap(); } }; addEventListener("keydown", kl);
    const krok = (now) => { const dt = Math.min(50, now - last) / 1000; last = now; v = Math.max(0, v - (14 + t * 10) * dt); uhel += v * 9 * dt; k.style.transform = `rotate(${uhel}deg)`;
      const ok = v >= lo && v <= hi; if (ok) uvnitr += dt; hod.style.bottom = v + "%"; hod.classList.toggle("ok", ok);
      const pr = (now - t0) / dur; cas.style.width = Math.min(100, pr * 100) + "%";
      if (pr >= 1) { dalsi(Math.min(1, uvnitr / (dur / 1000) * 1.35)); return; } raf = requestAnimationFrame(krok); };
    raf = requestAnimationFrame(krok);
    setStop(() => { cancelAnimationFrame(raf); removeEventListener("keydown", kl); });
  },
  // náklon: myší (prstem) nakláněj ostří/luk/pilník — drž úhel u čárkované čáry, která se pomalu stáčí
  naklon(sc, ovl, t, f, dalsi, setStop) {
    const dur = 6500, tol = 9 - t * 4; let a = 0, cil = 20, t0 = performance.now(), last = t0, uvnitr = 0, raf;
    sc.innerHTML = `<div class="mp-naklon-plocha"><div class="mp-cil"></div><div class="mp-cepel ${f.vzhled || ""}"><span></span></div><div class="mp-jiskry"></div></div><div class="mp-cas"><i></i></div>`;
    ovl.innerHTML = `<small class="muted">${esc(L(["Pohybuj myší nahoru a dolů nad obrázkem — drž čepel podél čárkované čáry.", "Move the mouse up and down to follow the dashed line."]))}</small>`;
    const pl = sc.querySelector(".mp-naklon-plocha"), ce = sc.querySelector(".mp-cepel"), ci = sc.querySelector(".mp-cil"), jis = sc.querySelector(".mp-jiskry"), cas = sc.querySelector(".mp-cas i");
    const mv = (e) => { const r = pl.getBoundingClientRect(); a = Math.max(-45, Math.min(45, ((e.clientY - r.top) / r.height - 0.5) * 100)); };
    pl.addEventListener("pointermove", mv); pl.addEventListener("pointerdown", mv);
    const krok = (now) => { const dt = Math.min(50, now - last) / 1000; last = now; const tt = (now - t0) / 1000;
      cil = 28 * Math.sin(tt * (0.7 + t * 0.6)) + 10 * Math.sin(tt * (1.9 + t));
      ci.style.transform = `rotate(${cil}deg)`; ce.style.transform = `rotate(${a}deg)`;
      const ok = Math.abs(a - cil) <= tol; if (ok) uvnitr += dt; jis.classList.toggle("on", ok); ce.classList.toggle("ok", ok);
      const pr = (now - t0) / dur; cas.style.width = Math.min(100, pr * 100) + "%";
      if (pr >= 1) { dalsi(Math.min(1, uvnitr / (dur / 1000) * 1.3)); return; } raf = requestAnimationFrame(krok); };
    raf = requestAnimationFrame(krok);
    setStop(() => cancelAnimationFrame(raf));
  },
};
// kroky řemesel: výroba, vylepšení a oprava podle podniku
const MPF = (typ, n, p, extra = {}) => ({ typ, n, p, ...extra });
const POSTUPY = {
  vyroba: {
    kovar: [MPF("drz", ["Rozžhavit", "Heat"], ["Dmýchej měchy a drž kov v bílém žáru — ne moc, ne málo.", "Work the bellows; keep the iron at white heat."], { b: ["Dmýchat měchy", "Work the bellows"] }),
      MPF("terce", ["Kovat", "Forge"], ["Buš kladivem do žhavých míst, než vychladnou.", "Strike the glowing spots before they cool."], { vzhled: "zhavy" }),
      MPF("okamzik", ["Kalit", "Quench"], ["Ponoř do vody, až kov zčervená jako třešeň.", "Quench when it glows cherry red."], { vzhled: "kaleni", b: ["Ponořit do vody", "Quench"] })],
    lovci: [MPF("drz", ["Napařit dřevo", "Steam"], ["Drž dřevo nad párou, ať je poddajné, ale nepraskne.", "Keep the wood over steam."], { b: ["Držet nad párou", "Hold over steam"] }),
      MPF("naklon", ["Ohnout luk", "Bend"], ["Ohýbej luk podle šablony — drž čáru.", "Bend the stave along the template."], { vzhled: "luk" }),
      MPF("okamzik", ["Napnout tětivu", "String"], ["Zaklesni tětivu, když je napětí akorát.", "Hook the string at the right tension."], { vzhled: "napeti", b: ["Zaklesnout", "Hook"] })],
    apatykar: [MPF("terce", ["Rozdrtit", "Grind"], ["Drť byliny v hmoždíři — trefuj lístky.", "Grind the herbs — hit the leaves."], { vzhled: "hmozdir", zvuk: "klik" }),
      MPF("drz", ["Zahřát", "Warm"], ["Drž baňku nad kahanem — var nesmí překypět.", "Keep it warm, don't let it boil over."], { b: ["Přiblížit ke kahanu", "Hold over the flame"] }),
      MPF("okamzik", ["Sejmout", "Take off"], ["Sejmi z ohně, až se směs zbarví.", "Take it off when the colour turns."], { vzhled: "odvar", b: ["Sejmout z ohně", "Take off"] })],
    lapka: [MPF("drz", ["Rozžhavit drát", "Heat wire"], ["Nažhav drát v kovářské peci.", "Heat the wire."], { b: ["Dmýchat", "Blow"] }),
      MPF("naklon", ["Pilovat", "File"], ["Pilníkem veď zub podle čáry.", "File the tooth along the line."], { vzhled: "pilnik" }),
      MPF("okamzik", ["Zkusit v zámku", "Test"], ["Otoč, až zub zapadne.", "Turn when the ward catches."], { b: ["Otočit", "Turn"] })],
    sedlak: [MPF("terce", ["Připravit", "Prepare"], ["Prohněť a připrav suroviny — trefuj, co je třeba.", "Prepare the ingredients."], { vzhled: "testo", zvuk: "klik" }),
      MPF("drz", ["Udržet žár", "Keep the heat"], ["Přikládej pod pec, ať je žár stálý.", "Keep the oven heat steady."], { b: ["Přiložit", "Stoke"] }),
      MPF("okamzik", ["Vytáhnout včas", "Take out"], ["Vytáhni, až je hotovo, ne spálené.", "Take it out in time."], { vzhled: "peceni", b: ["Vytáhnout", "Take out"] })],
  },
  vylepseni: {
    kovar: [MPF("kolo", ["Roztočit kolo", "Spin the wheel"], ["Šlapkou roztoč brusné kolo a drž otáčky.", "Spin the grindstone and keep the speed."]),
      MPF("naklon", ["Brousit ostří", "Grind the edge"], ["Nakláněj čepel podle čáry — špatný úhel ostří zkazí.", "Tilt the blade along the line."], { vzhled: "cepel" }),
      MPF("drz", ["Popustit", "Temper"], ["Opatrně prohřej ostří, ať nezkřehne.", "Gently temper the edge."], { b: ["Prohřívat", "Heat gently"] }),
      MPF("okamzik", ["Zakalit", "Quench"], ["Zakal v oleji ve správné barvě.", "Quench in oil at the right colour."], { vzhled: "kaleni", b: ["Do oleje", "Into the oil"] })],
    lovci: [MPF("naklon", ["Vyvážit", "Balance"], ["Vyvaž luk na prstu — drž ho v rovině s čárou.", "Balance the bow along the line."], { vzhled: "luk" }),
      MPF("drz", ["Napnout tětivu", "Tension"], ["Natahuj novou tětivu — akorát.", "Tension the new string."], { b: ["Natahovat", "Pull"] }),
      MPF("terce", ["Navoskovat", "Wax"], ["Navoskuj tětivu po celé délce.", "Wax the whole string."], { vzhled: "tetiva", zvuk: "klik" }),
      MPF("okamzik", ["Zkušební výstřel", "Test shot"], ["Pusť šíp ve správné chvíli.", "Loose at the right moment."], { vzhled: "napeti", b: ["Vystřelit", "Loose"] })],
    lapka: [MPF("kolo", ["Roztočit kolo", "Spin the wheel"], ["Roztoč malé brousek a drž otáčky.", "Spin the whetstone."]),
      MPF("naklon", ["Nabrousit", "Hone"], ["Veď čepel podle čáry.", "Follow the line."], { vzhled: "cepel" }),
      MPF("okamzik", ["Zkouška ostří", "Edge test"], ["Přejeď ostřím po vlasu ve správnou chvíli.", "Test the edge."], { b: ["Zkusit", "Test"] })],
  },
  oprava: {
    kovar: [MPF("drz", ["Prohřát", "Heat"], ["Prohřej poškozené místo ve výhni.", "Heat the damaged spot."], { b: ["Dmýchat měchy", "Work the bellows"] }),
      MPF("terce", ["Vyklepat", "Hammer out"], ["Vyklepej promáčkliny a otřepy — trefuj je přesně.", "Hammer out the dents."], { vzhled: "plech" }),
      MPF("naklon", ["Srovnat", "Straighten"], ["Srovnej ostří či násadu podle čáry.", "Straighten it along the line."], { vzhled: "cepel" })],
    lovci: [MPF("terce", ["Vyhladit třísky", "Smooth"], ["Obruš roztřepená místa.", "Sand the splinters."], { vzhled: "drevo", zvuk: "klik" }),
      MPF("naklon", ["Srovnat", "Straighten"], ["Srovnej zkroucené rameno podle čáry.", "Straighten the limb."], { vzhled: "luk" })],
    lapka: [MPF("terce", ["Stehovat", "Stitch"], ["Steh za stehem — trefuj dírky.", "Stitch — hit the holes."], { vzhled: "latka", zvuk: "klik" }),
      MPF("okamzik", ["Utáhnout", "Tighten"], ["Utáhni nit akorát.", "Tighten the thread."], { b: ["Utáhnout", "Tighten"] })],
    sedlak: [MPF("terce", ["Přitlouct", "Nail"], ["Přitluč uvolněné kování.", "Nail the loose fittings."], { vzhled: "drevo" }),
      MPF("naklon", ["Srovnat násadu", "Straighten"], ["Srovnej násadu podle čáry.", "Straighten the handle."])],
  },
};

// 1.0-1: vaření — pec musí hořet; recept se vaří přes minihru u plotny (míchání, oheň, dochucení). Ne vše se povede.
VIEWS.vareni = async (view) => {
  if (!S.me.house) { go("mesto"); return; }
  let V; try { V = (await call("vareni", {}, true)).vareni; } catch { return; }
  if (S.tab !== "vareni") return;
  const chal = S.me.house === "chalupa";
  view.replaceChildren(h(`${sceneHead(chal ? "domov/chalupa-svetnice" : "domov/dum-svetnice", L(["Vaření", "Cooking"]), L(["Dovednost ", "Skill "]) + V.skill + " / " + V.max + " · " + (V.hori ? L(["v peci hoří", "stove lit"]) : L(["pec je studená", "stove is cold"])), true)}
    <div class="panel var-panel" id="varbox">
      ${!V.pec ? `<p class="notice">${esc(L(["Bez pece s plotnou se doma nevaří. Prodává ji truhlář.", "You need a stove (carpenter)."]))}</p>`
        : !V.hori ? `<div class="notice var-ohen"><span>${esc(L(["Pec je studená. Zapal ji palivovým dřívím (máš ", "The stove is cold. Light it with firewood (you have "]) + V.drivi + ")." )}</span>
          <button class="btn primary" id="varzapal"${V.drivi ? "" : " disabled"}>${esc(L(["Zapálit v peci", "Light the stove"]))}</button></div>` : ""}
      ${V.recepty.length ? `<div class="var-recepty">${V.recepty.map((r) => `<div class="var-r${r.lze ? "" : " chybi"}"><div class="spread"><b>${esc(r.name)}</b><span>${esc(r.chance + " %")}</span></div>
          <small>${r.parts.map((p) => `<span class="${p.have >= p.q ? "ma" : "nema"}">${esc(p.name + " " + p.have + "/" + p.q)}</span>`).join(" · ")}</small>
          <button class="btn small${r.lze && V.hori ? " primary" : ""}" data-var="${esc(r.name)}"${r.lze && V.hori ? "" : " disabled"}>${esc(L(["Vařit (", "Cook ("]) + r.porci + L([" porce)", " portions)"]))}</button></div>`).join("")}</div>`
        : `<p class="muted">${esc(L(["Neznáš žádný recept. Recepty prodává písař na tržišti.", "No recipes known (scribe at the market)."]))}</p>`}
    </div>
    <p><button class="btn" id="pback">← ${esc(t("back"))}</button></p>`));
  mountLive(view);
  $("#pback").onclick = () => go("domov/funkce");
  const zp = $("#varzapal"); if (zp) zp.onclick = async () => { zp.disabled = true; try { toast((await call("domov_ohen", { kind: "oven" })).zprava); } catch { zp.disabled = false; return; } render(); };
  view.querySelectorAll("[data-var]").forEach((b) => b.onclick = async () => {
    const box = $("#varbox"), rec = b.dataset.var;
    const skore = await miniTrefa(box, { kola: 3, nazvy: [L(["Rozpal plotnu", "Heat the plate"]), L(["Zamíchej, ať se nepřipálí", "Stir it"]), L(["Dochuť a sundej včas", "Season and take it off"])],
      zona: 24, ikona: IMG_BASE + "domov/nab/pec.webp" });
    try { const x = await call("varit", { recept: rec, skore }); toast(x.zprava, !x.povedlo); } catch { /* toast */ }
    render();
  });
  vejdiObchod(".var-recepty");
};

// 1.0-1: domácí dílna — brus (zbraně), ponk (zbroj, přilba, štít), figurína (cvičení); výsledek dělá minihra
VIEWS.dilnadoma = async (view) => {
  if (!S.me.house) { go("mesto"); return; }
  const co = S.arg;
  let Dd; try { Dd = (await call("dilna_doma", { co }, true)).dilna; } catch { go("domov"); return; }
  if (S.tab !== "dilnadoma") return;
  const SPR = { brus: "brus", ponk: "ponk", figurina: "figurina" }[co];
  const TXT = { brus: [["Brusný kámen", "Grindstone"], ["Nabrus ostří — pět tahů po kameni.", "Five strokes on the stone."]],
    ponk: [["Zbrojířský ponk", "Armourer's bench"], ["Vyklepej promáčkliny — pět přesných úderů.", "Five precise blows."]],
    figurina: [["Cvičná figurína", "Training dummy"], ["Pět výpadů na figurínu.", "Five strikes at the dummy."]] }[co];
  view.replaceChildren(h(`${sceneHead(S.me.house === "chalupa" ? "domov/chalupa-svetnice" : "domov/dum-zbrojnice", L(TXT[0]), L(TXT[1]), true)}
    <div class="panel dl-panel" id="dlbox">
      ${!Dd.ma ? `<p class="notice">${esc(L(["Tohle doma nemáš — koupíš u truhláře.", "You don't own this (carpenter)."]))}</p>`
        : co === "figurina" ? (Dd.dnes ? `<p class="muted">${esc(L(["Dnes už jsi cvičil. Zítra zase.", "Already trained today."]))}</p>` : `<button class="btn primary" id="dlstart">${esc(L(["Začít cvičit", "Start training"]))}</button>`)
        : (Dd.veci.length ? `<div class="items">${Dd.veci.map((v) => `<div class="item">${icon(v.name)}<div><div class="nm">${esc(v.name)}</div>${opotrebeni({ wear: v.wear })}</div>
            <div class="acts"><button class="btn small primary" data-dl="${esc(v.name)}"${v.dnes || v.wear >= 100 ? " disabled" : ""}>${esc(v.dnes ? L(["dnes hotovo", "done today"]) : v.wear >= 100 ? L(["jako nová", "like new"]) : co === "brus" ? L(["Brousit", "Sharpen"]) : L(["Spravit", "Mend"]))}</button></div></div>`).join("")}</div>`
          : `<p class="muted">${esc(co === "brus" ? L(["Nemáš u sebe žádnou zbraň.", "No weapon carried."]) : L(["Nemáš u sebe zbroj, přilbu ani štít.", "No armour carried."]))}</p>`)}
    </div>
    <p><button class="btn" id="pback">← ${esc(t("back"))}</button></p>`));
  mountLive(view);
  $("#pback").onclick = () => go("domov/funkce");
  const hraj = async (item) => {
    const skore = await miniTrefa($("#dlbox"), { kola: 5, zona: 20, uz: 0.88, rychlost: 1.2, ikona: IMG_BASE + "domov/nab/" + SPR + ".webp",
      nazvy: Array.from({ length: 5 }, (_, i) => (co === "brus" ? L(["Tah ", "Stroke "]) : co === "ponk" ? L(["Úder ", "Blow "]) : L(["Výpad ", "Strike "])) + (i + 1) + " / 5") });
    try { toast((await call("dilna_doma", { co, item, skore })).zprava); } catch { /* toast */ }
    render();
  };
  const st = $("#dlstart"); if (st) st.onclick = () => hraj("");
  view.querySelectorAll("[data-dl]").forEach((b) => b.onclick = () => hraj(b.dataset.dl));
  loadIcons((Dd.veci || []).map((v) => v.name));
};

// 1.0-1: podnik — rozcestník (doupě u brány), pracovní prostor, úložiště a stav
const podnikZpet = () => BIZ_BACK[S.me.origin] || "mesto";
VIEWS.podnik = (view) => {
  if (!S.me.business) { go("mesto"); return; }
  const src = (o) => { const n = typeof o.obr === "function" ? o.obr() : o.obr; return IMG_BASE + n + (n.startsWith("domov/") ? "-m.webp" : ".webp"); };
  view.replaceChildren(h(`${sceneHead(BIZ_IMG[S.me.origin] || "mesto-trziste", L(["Tvůj podnik", "Your business"]), "", true)}
    <div class="opts">${PODNIK_KARTY.map((o) => `<button class="opt obr-karta" data-go="${o.go}"><span class="ok-obr"><img src="${src(o)}" alt="" data-nahrada="${IMG_BASE}${BIZ_IMG[S.me.origin] || "mesto-trziste"}-m.webp"></span><b>${esc(L(o.n))}</b><small>${esc(L(o.d))}</small></button>`).join("")}</div>
    <p><button class="btn" id="pback">← ${esc(t("back"))}</button></p>`));
  mountLive(view);
  view.querySelectorAll("[data-go]").forEach((b) => b.onclick = () => { Zvuk.sfx("klik"); go(b.dataset.go); });
  $("#pback").onclick = () => go(podnikZpet());
};
const PODNIK_MINI = { kovar: [["Rozpal výheň", "Heat the forge"], ["Úder ", "Blow "]], lovci: [["Vyber dřevo", "Choose the wood"], ["Tah nožem ", "Stroke "]],
  apatykar: [["Odměř byliny", "Measure the herbs"], ["Míchání ", "Stir "]], lapka: [["Připrav nářadí", "Ready your tools"], ["Tah ", "Stroke "]], sedlak: [["Připrav dílo", "Get ready"], ["Krok ", "Step "]] };
const PZAL = { z: "vyroba", smes: [] };
const ICON_SRC = (id) => `${IMG_BASE}predmety/ikony/${Postava.slug(id)}.webp`;
VIEWS.podnikprace = async (view) => {
  if (!S.me.business) { go("mesto"); return; }
  let P; try { P = (await call("podnik", {}, true)).podnik; } catch { return; }
  if (S.tab !== "podnikprace") return;
  // 1.0-1-5: hlavní panely nahoře — Výroba · Vylepšení · Oprava (+ Vlastní směs u apatykáře)
  const zal = [["vyroba", ["Výroba", "Crafting"], "⚒"], ...(P.vylepseni ? [["vylepseni", ["Vylepšení", "Upgrades"], "✦"]] : []),
    ...P.prace.map((p) => [p.co, [p.co === "oprava" ? "Oprava" : p.nazev, p.co === "oprava" ? "Repairs" : p.nazev], "⚙"]), ...(P.pokus ? [["smes", ["Vlastní směs", "Own mixture"], "⚗"]] : [])];
  if (!zal.some(([k]) => k === PZAL.z)) PZAL.z = "vyroba";
  const mat = (m) => m.map((x) => `<span class="${x.have >= x.q ? "ma" : "nema"}">${esc(x.name + " " + x.have + "/" + x.q)}</span>`).join(" · ");
  const pr = P.prace.find((p) => p.co === PZAL.z);
  const druh = P.vykres_druh, druhy = { "Výkres": ["výkresy", "výkresů"], "Receptura": ["receptury", "receptur"], "Náčrt": ["náčrty", "náčrtů"], "Selský zápis": ["selské zápisy", "zápisů"] }[druh] || ["výkresy", "výkresů"];
  const V = P.vylepseni;
  view.replaceChildren(h(`${sceneHead(BIZ_IMG[S.me.origin] || "mesto-trziste", L(["Pracovní prostor", "Workspace"]), P.name + " · " + L(["řemeslo ", "craft "]) + P.skill + " (" + P.skill_xp + "/" + P.xp_need + ")", true)}
    <div class="panel pp-panel" id="ppbox"><div class="pp-vnitr">
      <div class="pp-hlavni">${zal.map(([k, n, ic]) => `<button type="button" class="pp-hl-tl${PZAL.z === k ? " on" : ""}" data-pz2="${k}"><i>${ic}</i><b>${esc(L(n))}</b></button>`).join("")}</div>
      ${P.stav.ucinky.length ? `<p class="muted small pp-stav">${esc(P.stav.ucinky.join(" "))}</p>` : ""}
      ${S.me.origin === "sedlak" ? `<p class="row"><button class="btn small" data-go2="statek">${esc(L(["Pole, chlév a dvůr", "Fields and barn"]))}</button></p>` : ""}
      ${PZAL.z === "smes" ? `<p class="muted">${esc(L(["Nedrž se receptů: vyber dvě nebo tři suroviny a zkus, co z nich vznikne. Některé kombinace dají masti, dryáky a odvary, které nikde neprodávají. Neznámá směs skončí jako kalný odvar.", "Pick two or three ingredients and experiment."]))}</p>
        <div class="pk-sur">${P.pokus.suroviny.map((x) => `<button type="button" class="pk-s${PZAL.smes.includes(x.name) ? " on" : ""}" data-sm="${esc(x.name)}"${x.have ? "" : " disabled"}>${icon(x.name)}<b>${esc(x.name)}</b><small>${x.have}</small></button>`).join("")}</div>
        <div class="row"><button class="btn primary" id="pkmichat"${PZAL.smes.length >= 2 ? "" : " disabled"}>${esc(L(["Míchat: ", "Mix: "]) + (PZAL.smes.join(" + ") || "…"))}</button></div>
        <div class="sect">${esc(L(["Zápisník objevů", "Discoveries"]) + " · " + L(["zbývá objevit ", "left to find "]) + P.pokus.zbyva)}</div>
        <div class="pk-objevy">${P.pokus.objevy.map((o) => `<span>${icon(o.name)}<b>${esc(o.name)}</b><small>${esc(o.z.join(" + "))}</small></span>`).join("") || `<small class="muted">${esc(L(["Zatím nic — zkoušej.", "Nothing yet — experiment."]))}</small>`}</div>`
      : PZAL.z === "vyroba" ? `<div class="pp-vykresy"><span>${esc(L(["Umíš ", "You know "]) + P.recepty.length + L([" výrobků. Další ", " items. "]) + druhy[0] + L([" (zbývá ", " left: "]) + P.neznam + L([") prodává písař na tržišti.", " — sold by the scribe."]))}</span>
          ${P.neznam ? `<button class="btn small" data-go2="vykresy">${esc(L(["Koupit u písaře", "Buy from the scribe"]))}</button>` : ""}</div>
        <div class="var-recepty pp-list">${P.recepty.map((r) => `<div class="var-r${r.ok ? "" : " chybi"}">
          <div class="pp-hl">${icon(r.name)}<div><b>${esc(r.name + (r.qty > 1 ? " ×" + r.qty : ""))}</b><small class="muted">${esc(L(["řemeslo ", "craft "]) + r.need + (r.chance ? " · " + L(["šance ~", "chance ~"]) + r.chance + " %" : ""))}</small></div></div>
          <small>${mat(r.mats)}</small>${!r.ok ? `<small class="nema">${esc(r.why)}</small>` : ""}
          <button class="btn small${r.ok ? " primary" : ""}" data-vyrob="${esc(r.name)}" data-need="${r.need}"${r.ok ? "" : " disabled"}>${esc(L(["Vyrobit", "Craft"]))}</button></div>`).join("")}</div>`
      : PZAL.z === "vylepseni" ? `<p class="muted small">${esc(V.popis + L([" Na +1 potřebuješ řemeslo 3, na +2 řemeslo 7, na +3 řemeslo 11. Nezdar spotřebuje suroviny a na +2 a +3 předmět poškodí. Jednou za herní den u každé věci.", " +1 needs craft 3, +2 craft 7, +3 craft 11."]))}</p>
        <div class="items pp-list">${V.veci.map((v) => `<div class="item pp-vyl">${icon(v.name)}<div><div class="nm">${esc(v.name)}${v.stupen ? ` <span class="pp-stupen">+${v.stupen}</span>` : ""}</div>
            ${v.dalsi ? `<small>${esc(L(["Na +", "To +"]) + v.dalsi + " · " + L(["řemeslo ", "craft "]) + v.dovednost + " · " + L(["šance ~", "chance ~"]) + v.sance + " %")}</small><small>${mat(v.suroviny)}</small>` : `<small class="muted">${esc(L(["Nejvyšší stupeň.", "Maxed."]))}</small>`}</div>
            <div class="acts"><button class="btn small primary" data-vyl="${esc(v.name)}" data-st="${v.dalsi || 0}" data-dov="${v.dovednost || 0}"${!v.dalsi || v.dnes || P.skill < v.dovednost || v.suroviny.some((x) => x.have < x.q) ? " disabled" : ""}>${esc(v.dnes ? L(["dnes hotovo", "done today"]) : !v.dalsi ? "+3" : P.skill < v.dovednost ? L(["řemeslo ", "craft "]) + v.dovednost : L(["Vylepšit", "Upgrade"]))}</button></div></div>`).join("")
          || `<div class="empty">${esc(L(["Nemáš u sebe nic, co by se tu dalo vylepšit.", "Nothing to upgrade."]))}</div>`}</div>`
      : `<p class="muted small">${esc(L(["Spotřebuje: ", "Uses: "]))}${mat(pr.mats)}${esc(L([" · Oprava je těžká — s vyšším řemeslem opravíš víc. Jednou za herní den u každé věci.", " · Higher craft repairs more."]))}</p><div class="items pp-list">${pr.veci.map((v) => `<div class="item">${icon(v.name)}<div><div class="nm">${esc(v.name)}</div>${opotrebeni({ wear: v.wear })}</div>
            <div class="acts"><button class="btn small primary" data-prace="${esc(v.name)}"${v.dnes || v.wear >= 100 ? " disabled" : ""}>${esc(v.dnes ? L(["dnes hotovo", "done today"]) : v.wear >= 100 ? L(["jako nová", "like new"]) : L(["Opravit", "Repair"]))}</button></div></div>`).join("") || `<div class="empty">${esc(L(["Nemáš u sebe nic, co by se tu dalo opravit.", "Nothing to repair."]))}</div>`}</div>`}
    </div></div>
    <p><button class="btn" id="pback">← ${esc(t("back"))}</button></p>`));
  mountLive(view);
  $("#pback").onclick = () => go(S.me.origin === "lapka" ? "podnik" : podnikZpet());
  view.querySelectorAll("[data-go2]").forEach((b) => b.onclick = () => { if (b.dataset.go2 === "vykresy") VYK.zpet = "podnikprace"; go(b.dataset.go2); });
  view.querySelectorAll("[data-pz2]").forEach((b) => b.onclick = () => { PZAL.z = b.dataset.pz2; Zvuk.sfx("klik"); render(); });
  const orig = S.me.origin, box = () => $("#ppbox");
  const postup = (druh) => POSTUPY[druh][orig] || POSTUPY[druh].kovar;
  view.querySelectorAll("[data-vyrob]").forEach((b) => b.onclick = async () => {
    const need = +b.dataset.need, tt = 0.25 + need * 0.035 - Math.max(0, P.skill - need) * 0.04;
    const skore = await miniPostup(box(), { nazev: b.dataset.vyrob, ikona: ICON_SRC(b.dataset.vyrob), faze: postup("vyroba"), t: tt });
    try { const x = await call("podnik_vyrob", { product: b.dataset.vyrob, skore }); toast(x.zprava, !x.povedlo); Zvuk.sfx(x.povedlo ? "vyhra" : "odrazeno"); } catch { /* toast */ }
    render(); });
  view.querySelectorAll("[data-vyl]").forEach((b) => b.onclick = async () => {
    const st = +b.dataset.st, tt = 0.45 + st * 0.14 - Math.max(0, P.skill - +b.dataset.dov) * 0.03;
    const skore = await miniPostup(box(), { nazev: b.dataset.vyl + " → +" + st, ikona: ICON_SRC(b.dataset.vyl), faze: postup("vylepseni"), t: tt });
    try { const x = await call("podnik_vylepsit", { item: b.dataset.vyl, skore }); toast(x.zprava, /Nepovedlo/.test(x.zprava)); Zvuk.sfx(/Povedlo/.test(x.zprava) ? "vyhra" : "odrazeno"); } catch { /* toast */ }
    render(); });
  view.querySelectorAll("[data-sm]").forEach((b) => b.onclick = () => { const n = b.dataset.sm, i = PZAL.smes.indexOf(n);
    if (i >= 0) PZAL.smes.splice(i, 1); else if (PZAL.smes.length < 3) PZAL.smes.push(n); Zvuk.sfx("klik"); render(); });
  const pm = $("#pkmichat"); if (pm) pm.onclick = async () => {
    const skore = await miniPostup(box(), { nazev: PZAL.smes.join(" + "), ikona: ICON_SRC("Byliny"), faze: POSTUPY.vyroba.apatykar, t: 0.45 });
    try { toast((await call("apatyka_pokus", { suroviny: PZAL.smes, skore })).zprava); } catch { /* toast */ }
    PZAL.smes = []; render(); };
  if (P.pokus) loadIcons([...P.pokus.suroviny.map((x) => x.name), ...P.pokus.objevy.map((o) => o.name)]);
  view.querySelectorAll("[data-prace]").forEach((b) => b.onclick = async () => {
    const tt = Math.max(0.2, Math.min(0.85, 0.8 - P.skill * 0.05));
    const skore = await miniPostup(box(), { nazev: b.dataset.prace, ikona: ICON_SRC(b.dataset.prace), faze: postup("oprava"), t: tt });
    try { toast((await call("podnik_prace", { co: PZAL.z, item: b.dataset.prace, skore })).zprava); } catch { /* toast */ }
    render(); });
  loadIcons([...P.recepty.map((r) => r.name), ...(pr ? pr.veci.map((v) => v.name) : []), ...(V ? V.veci.map((v) => v.name) : [])]);
  vejdiObchod(".pp-vnitr");
};
// 1.0-1-5: písař — výkresy, receptury a náčrty pro řemeslníky (učí se, nenosí)
const VYK = { zpet: "" };
VIEWS.vykresy = async (view) => {
  let X; try { X = (await call("vykresy", {}, true)).vykresy; } catch { return; }
  if (S.tab !== "vykresy") return;
  const zpet = VYK.zpet || "obchod/Písař";
  view.replaceChildren(h(`${sceneHead("mesto-pisar", L(["Výkresy pro řemeslníky", "Plans for craftsmen"]), L(["Písař: „Každý mistr začínal opisem cizího výkresu.“", "Scribe: \"Every master began by copying someone else's plan.\""]), true)}
    <div class="panel vyk-panel"><div class="vyk-vnitr">${!X.podnik ? `<p class="notice">${esc(L(["Výkresy, receptury a náčrty prodávám jen majitelům podniků. Podnik si koupíš na radnici.", "Only for business owners."]))}</p>`
      : `<p class="muted">${esc(X.nazev + " · " + L(["řemeslo ", "craft "]) + X.skill + " · " + L(["máš ", "you have "]) + X.coins + " gr. · " + X.druh + L([" se naučíš hned — nenosíš ho.", " is learnt at once."]))}</p>
        <div class="var-recepty vyk-list">${X.seznam.map((r) => `<div class="var-r${r.zna ? " zna" : ""}"><div class="pp-hl">${icon(r.name)}<div><b>${esc(r.name + (r.qty > 1 ? " ×" + r.qty : ""))}</b>
            <small class="muted">${esc(L(["řemeslo ", "craft "]) + r.need + " · " + r.mats.map((m) => m.name + " " + m.q).join(", "))}</small></div></div>
          ${r.zna ? `<small class="ma">${esc(L(["Umíš", "Known"]))}</small>` : `<button class="btn small primary" data-vyk="${esc(r.name)}"${X.coins < r.cena ? " disabled" : ""}>${esc(X.druh + " · " + r.cena + " gr.")}</button>`}</div>`).join("")}</div>`}
    </div></div>
    <p><button class="btn" id="pback">← ${esc(t("back"))}</button></p>`));
  mountLive(view);
  $("#pback").onclick = () => { VYK.zpet = ""; go(zpet); };
  view.querySelectorAll("[data-vyk]").forEach((b) => b.onclick = async () => { b.disabled = true;
    try { toast((await call("vykres_koupit", { product: b.dataset.vyk })).zprava); Zvuk.sfx("stranka"); const me = await call("me", {}, true); if (me && me.name) S.me = me; } catch { b.disabled = false; return; } render(); });
  if (X.podnik) loadIcons(X.seznam.map((r) => r.name));
  vejdiObchod(".vyk-vnitr");
};
VIEWS.podnikuloziste = async (view) => {
  if (!S.me.business) { go("mesto"); return; }
  let P; try { P = (await call("podnik", {}, true)).podnik; } catch { return; }
  if (S.tab !== "podnikuloziste") return;
  const vec = (i, act, lbl) => `<div class="item"${kusAttr(i)}>${icon(i.id)}<div><div class="nm">${esc(i.name)}${kusTag(i)}${i.count > 1 ? ` <span class="muted">× ${i.count}</span>` : ""}</div>
      ${i.count > 1 ? `<label class="kolik"><input type="range" min="1" max="${i.count}" value="${i.count}" data-kolik><b>${i.count}</b></label>` : ""}</div>
    <div class="acts"><button class="btn small${act === "podnik_vezmi" ? " primary" : ""}" data-pu="${act}" data-v="${esc(i.id)}">${esc(lbl)}</button></div></div>`;
  const truhla = { kovar: "Okovaná truhla", lovci: "Truhla", apatykar: "Truhla", lapka: "Truhla", sedlak: "Truhla" }[S.me.origin] || "Truhla";
  // 1.0-1-5: stejně jako u domova — nahoře truhla podniku s obrázkem, pod ní klasický inventář (u sebe · v truhle)
  view.replaceChildren(h(`${sceneHead(podnikObr("uloziste")(), L(["Úložiště", "Storage"]), P.name + " · " + L(["truhla ", "chest "]) + P.chest.length + " / " + P.slots + L([" druhů", " kinds"]), true)}
    <div class="ul-obal"><div class="ul-truhly"><button class="ul-truhla on"><img src="${nabSrc(truhla)}" alt=""><b>${esc(L(["Truhla podniku", "Workshop chest"]))}</b><small>${P.chest.length} / ${P.slots}</small></button></div>
    <div class="m-zalozky truhla-zal"><button class="${ULOZ.strana === "ulozit" ? "on" : ""}" data-us="ulozit">${esc(L(["Uložit", "Store"]))}<small>${esc(L(["u sebe ", "carried "]) + P.carried.length)}</small></button>
      <button class="${ULOZ.strana !== "ulozit" ? "on" : ""}" data-us="vzit">${esc(L(["Vzít", "Take"]))}<small>${P.chest.length}</small></button></div>
    <div class="grid g2 truhla-sloupce ul-sloupce strana-${ULOZ.strana === "ulozit" ? "ulozit" : "vzit"}" style="align-items:start">
      <div class="panel"><div class="spread"><h3>${esc(L(["U sebe", "Carried"]))}</h3><span class="pill">${P.carried.length}</span></div>
        <div class="items ul-items">${P.carried.map((i) => vec(i, "podnik_uloz", L(["Uložit", "Store"]))).join("") || `<div class="empty">${esc(L(["Nic u sebe nemáš.", "Nothing carried."]))}</div>`}</div></div>
      <div class="panel"><div class="spread"><h3>${esc(L(["Truhla podniku", "Workshop chest"]))}</h3><span class="pill">${P.chest.length} / ${P.slots}</span></div>
        <div class="items ul-items">${P.chest.map((i) => vec(i, "podnik_vezmi", L(["Vzít", "Take"]))).join("") || `<div class="empty">${esc(L(["Prázdná.", "Empty."]))}</div>`}</div></div>
    </div></div>
    <p><button class="btn" id="pback">← ${esc(t("back"))}</button></p>`));
  const sc = view.querySelector(".scene"); if (sc) { sc.dataset.img = artReady(sc.dataset.img) ? sc.dataset.img : (BIZ_IMG[S.me.origin] || "mesto-trziste"); }
  mountLive(view);
  $("#pback").onclick = () => go(S.me.origin === "lapka" ? "podnik" : podnikZpet());
  view.querySelectorAll("[data-us]").forEach((b) => b.onclick = () => { ULOZ.strana = b.dataset.us; Zvuk.sfx("klik"); render(); });
  view.querySelectorAll("[data-kolik]").forEach((r) => r.oninput = () => { r.nextElementSibling.textContent = r.value; });
  view.querySelectorAll("[data-pu]").forEach((b) => b.onclick = async () => { b.disabled = true; const r = b.closest(".item").querySelector("[data-kolik]");
    try { toast((await call(b.dataset.pu, { name: b.dataset.v, qty: kolikRadek(b) })).zprava); } catch { b.disabled = false; return; } render(); });
  loadIcons([...P.chest, ...P.carried].map((i) => i.id));
  vejdiObchod(".ul-sloupce .ul-items");
};
VIEWS.podnikstav = async (view) => {
  if (!S.me.business) { go("mesto"); return; }
  let P; try { P = (await call("podnik", {}, true)).podnik; } catch { return; }
  if (S.tab !== "podnikstav") return;
  const st = P.stav;
  const pruh = (n, v, ub) => { const tr = v >= 80 ? "dobre" : v >= 40 ? "stredni" : v >= 15 ? "zle" : "rozbite";
    return `<div class="sd-pruh"><div class="spread"><b>${esc(n)}</b><span>${v} %</span></div><div class="opotreb ${tr}"><i style="width:${v}%"></i></div><small class="muted">${esc(L(["ubývá ", "drops "]) + ub + L([" % za herní den", " % per game day"]))}</small></div>`; };
  const PR = [["uklid", ["Uklidit sám", "Clean up"], ["Zdarma, jednou za herní den: čistota +35 %.", "Free, once a day."], st.uklid, L(["Dnes už jsi uklízel.", "Done today."])],
    ["ucen", ["Zaplatit učedníka", "Pay an apprentice"], [`Čistota na 100 % za ${st.ucen} gr.`, `To 100 % for ${st.ucen} gr.`], st.cistota < 99 && S.me.coins >= st.ucen, st.cistota >= 99 ? L(["Dílna je čistá.", "Clean."]) : L(["Nemáš dost grošů.", "Not enough coins."])],
    ["spravit", ["Spravit sám", "Mend it yourself"], ["Zdarma, jednou za herní den: opravy +15 %.", "Free, once a day."], st.spravit && st.opravy < 100, st.opravy >= 100 ? L(["Není co spravovat.", "Nothing to mend."]) : L(["Dnes už jsi spravoval.", "Done today."])],
    ["oprava", ["Zavolat tesaře", "Call the carpenter"], [`Opravy na 100 % za ${st.oprava} gr.`, `To 100 % for ${st.oprava} gr.`], st.oprava > 0 && S.me.coins >= st.oprava, !st.oprava ? L(["Dílna je v pořádku.", "All good."]) : L(["Nemáš dost grošů.", "Not enough coins."])]];
  view.replaceChildren(h(`${sceneHead(podnikObr("stav")(), L(["Správa podniku", "Management"]), P.name, true)}
    <div class="panel sd-panel"><div class="sd-vnitr">
      <div class="sect">${esc(L(["Jméno podniku", "Business name"]))}</div>
      <form class="sp-jmeno" id="spjmeno"><input name="jmeno" maxlength="32" value="${esc(P.vlastni ? P.name : "")}" placeholder="${esc(P.druh)}">
        <button class="btn primary" type="submit">${esc(P.vlastni ? L(["Přejmenovat", "Rename"]) : L(["Pojmenovat", "Name it"]))}</button></form>
      <small class="muted">${esc(L(["Jméno uvidí ostatní u dražeb, obchodů a zakázek: „vyrobeno v …“. Prázdné = původní název.", "Shown as \"made in …\" on auctions and trades."]))}</small>
      <div class="sect">${esc(L(["Tovaryš", "Journeyman"]))}</div>
      <div class="sp-tovarys"><div><b>${esc(L(["Denní produkce", "Daily output"]))}: ${esc(P.produkce.map((x) => x.name + " ×" + x.q).join(", ") || "—")}</b>
        <small class="muted">${esc(L(["Nashromáždí se nejvýš za 3 dny · teď čeká ", "Accumulates up to 3 days · waiting: "]) + P.produkce_dni + L([" dní", " days"]))}${P.job ? esc(L([" · rozdělaná práce: ", " · job: "]) + P.job.item + (P.job.hotovo ? L([" (hotovo)", " (done)"]) : "")) : ""}</small></div>
        <button class="btn primary" id="spcollect"${P.produkce_dni || (P.job && P.job.hotovo) ? "" : " disabled"}>${esc(L(["Vyzvednout", "Collect"]))}</button></div>
      <div class="sect">${esc(L(["Stav dílny", "Workshop upkeep"]))}</div>
      ${pruh(L(["Čistota", "Cleanliness"]), st.cistota, st.ubytek.cistota)}${pruh(L(["Opravy", "Repairs"]), st.opravy, st.ubytek.opravy)}
      <div class="sd-ucinky">${st.ucinky.length ? st.ucinky.map((x) => `<p>${esc(x)}</p>`).join("") : `<p class="muted">${esc(L(["Dílna je v běžném stavu.", "Normal state."]))}</p>`}</div>
      <div class="dm-akce sd-akce">${PR.map(([k, n, d, ok, proc]) => `<button class="btn${ok ? (k === "uklid" || k === "spravit" ? " primary" : "") : " zamc"}" data-ps="${k}"${ok ? "" : " disabled"}><span>${esc(L(n))}</span><small>${esc(ok ? L(d) : proc)}</small></button>`).join("")}</div>
      <details class="sd-pravidla"><summary>${esc(L(["Jak to funguje", "How it works"]))}</summary><p>${esc(L(["Čistota i opravy 80 % a víc: výroba se daří o 5 % lépe. Pod 40 %: o 10 % hůř. Pod 15 %: o 25 % hůř.", "Both 80 %+: +5 % crafting; below 40 %: −10 %; below 15 %: −25 %."]))}</p></details></div></div>
    <p><button class="btn" id="pback">← ${esc(t("back"))}</button></p>`));
  const sc = view.querySelector(".scene"); if (sc) { sc.dataset.img = artReady(sc.dataset.img) ? sc.dataset.img : (BIZ_IMG[S.me.origin] || "mesto-trziste"); }
  mountLive(view);
  $("#pback").onclick = () => go(S.me.origin === "lapka" ? "podnik" : podnikZpet());
  view.querySelectorAll("[data-ps]").forEach((b) => b.onclick = async () => { b.disabled = true; try { toast((await call("podnik_stav", { co: b.dataset.ps })).zprava); } catch { b.disabled = false; return; } render(); });
  $("#spjmeno").onsubmit = async (e) => { e.preventDefault(); const j = e.target.jmeno.value.trim();
    try { const x = await call("podnik_jmeno", { jmeno: j }); toast(x.zprava); S.me.podnik_jmeno = x.podnik.vlastni ? x.podnik.name : ""; Zvuk.sfx("stranka"); } catch { return; } render(); };
  $("#spcollect").onclick = async (e) => { e.target.disabled = true; try { const r = await call("raid_click", { id: "ks:biz:collect", values: [] }); const c = noEmoji((r.panel && r.panel.content) || "").replace(/\*\*/g, "").split("\n").filter((x) => /Hotovo|produkce|zakázky|nepracoval/i.test(x)).join(" · "); toast(c || L(["Zatím nic nového.", "Nothing new yet."])); Zvuk.sfx("mince"); } catch { /* toast */ } render(); };
  vejdiObchod(".sd-vnitr");
};

// 1.0-1: Zakázky měšťanů — majitelé podniků poptávají věci za odměnu složenou předem u radnice; krátký text, ať pergamen nebobtná
const ZAKH = { form: false };
VIEWS.zakazkyhracu = async (view) => {
  let Z; try { Z = (await call("zakazky_hracu", {}, true)).zakazky; } catch { return; }
  if (S.tab !== "zakazkyhracu") return;
  const zbyva = (ts) => { const h_ = Math.max(0, Math.round((ts - Date.now() / 1000) / 3600)); return h_ >= 48 ? Math.round(h_ / 24) + L([" dní", " days"]) : h_ + " h"; };
  const moje = Z.zakazky.filter((z) => z.moje).length;
  view.replaceChildren(h(`${sceneHead(artReady("domov/nahled-radnice-zakazky") ? "domov/nahled-radnice-zakazky" : "mesto-radnice", L(["Zakázky měšťanů", "Burghers' orders"]), L(["Písař: „Kdo zakázku splní, dostane složenou odměnu hned.“", "Scribe: \"Fulfil an order and the reward is yours at once.\""]), true)}
    ${Z.muze ? `<div class="row zh-hlava"><button class="btn${ZAKH.form ? "" : " primary"}" id="zhnova"${moje >= Z.max ? " disabled" : ""}>${esc(ZAKH.form ? L(["Zavřít formulář", "Close"]) : L(["Vystavit zakázku", "Post an order"]) + " (" + moje + "/" + Z.max + ")")}</button></div>` : ""}
    ${ZAKH.form ? `<form class="panel zh-form" id="zhform"><label>${esc(L(["Co chceš", "Item"]))}<input name="item" list="zhveci" required placeholder="${esc(L(["např. Uhlí", "e.g. Coal"]))}"></label>
        <datalist id="zhveci">${Z.veci.map((n) => `<option value="${esc(n)}">`).join("")}</datalist>
        <label>${esc(L(["Kolik kusů", "How many"]))}<input name="qty" type="number" min="1" max="99" value="1" required></label>
        <label>${esc(L(["Odměna (gr.)", "Reward (gr.)"]))}<input name="odmena" type="number" min="1" max="20000" value="20" required></label>
        <label class="zh-txt">${esc(L(["Krátká poznámka", "Short note"]))} <small>(${esc(L(["nejvýš ", "max "]) + Z.text_max + L([" znaků", " chars"]))})</small><input name="text" maxlength="${Z.text_max}" placeholder="${esc(L(["např. do výhně, spěchá", "e.g. for the forge, urgent"]))}"></label>
        <button class="btn primary" type="submit">${esc(L(["Vyvěsit na radnici", "Post at the town hall"]))}</button><small class="muted">${esc(L(["Odměna se hned složí u radnice. Za 7 dní zakázka propadne a groše se vrátí.", "The reward is deposited now; returned after 7 days if unfulfilled."]))}</small></form>` : ""}
    <div class="zh-obal"><div class="zh-listy">${Z.zakazky.map((z) => `<div class="zh-list${z.moje ? " moje" : ""}">${icon(z.item)}
        <div class="zh-t"><b>${esc(z.item + " ×" + z.qty)}</b><span class="zh-odm">${esc(z.odmena + " gr.")}</span>
          ${z.text ? `<em>„${esc(z.text)}“</em>` : ""}<small>${esc(z.jmeno + " · " + z.podnik + " · " + L(["platí ještě ", "valid "]) + zbyva(z.do))}</small></div>
        ${z.moje ? `<button class="btn small" data-zzr="${esc(z.id)}">${esc(L(["Stáhnout", "Withdraw"]))}</button>`
          : `<button class="btn small${z.mam >= z.qty ? " primary" : ""}" data-zsp="${esc(z.id)}"${z.mam >= z.qty ? "" : " disabled"} title="${esc(L(["Máš u sebe ", "You carry "]) + z.mam)}">${esc(z.mam >= z.qty ? L(["Splnit", "Fulfil"]) : L(["Máš ", "Have "]) + z.mam + "/" + z.qty)}</button>`}</div>`).join("")
      || `<div class="empty">${esc(L(["Na radnici teď žádná zakázka nevisí.", "No orders right now."]))}</div>`}</div></div>
    <p><button class="btn" id="pback">← ${esc(t("back"))}</button></p>`));
  mountLive(view);
  $("#pback").onclick = () => go("misto/radnice");
  const nb = $("#zhnova"); if (nb) nb.onclick = () => { ZAKH.form = !ZAKH.form; Zvuk.sfx("klik"); render(); };
  const f = $("#zhform"); if (f) f.onsubmit = async (e) => { e.preventDefault(); const d = Object.fromEntries(new FormData(f).entries());
    try { toast((await call("zakazka_vystavit", { item: d.item, qty: +d.qty, odmena: +d.odmena, text: d.text })).zprava); Zvuk.sfx("mince"); ZAKH.form = false; } catch { return; } render(); };
  view.querySelectorAll("[data-zsp]").forEach((b) => b.onclick = async () => { b.disabled = true; try { toast((await call("zakazka_splnit", { id: b.dataset.zsp })).zprava); Zvuk.sfx("mince"); } catch { b.disabled = false; return; } render(); });
  view.querySelectorAll("[data-zzr]").forEach((b) => b.onclick = async () => { if (!confirm(L(["Stáhnout zakázku a vrátit si odměnu?", "Withdraw the order?"]))) return; try { toast((await call("zakazka_zrusit", { id: b.dataset.zzr })).zprava); } catch { return; } render(); });
  loadIcons(Z.zakazky.map((z) => z.item));
  vejdiObchod(".zh-listy");
};

// 1.0-1-5: lichvář — samostatné místo na mapě (dům u hradeb)
VIEWS.lichvar = async (view) => {
  const mod = S.arg === "pujcka" ? "pujcka" : "uschova";
  const obr = "domov/nahled-lichvar-" + mod;
  view.replaceChildren(h(`${sceneHead(artReady(obr) ? obr : "mesto-lichvar", L(mod === "pujcka" ? ["Lichvář · Půjčka", "Usurer · Loan"] : ["Lichvář · Úschova", "Usurer · Safekeeping"]), L(["Lichvář: „Groše jsou groše. Odkud jsou, mě nezajímá.“", "Usurer: \"Coin is coin. I don't ask where it's from.\""]), true)}
    <div class="dpanel lv-misto"><div class="banka"><section data-s="lichvar"><div class="bk-t"><p class="muted">…</p></div><div class="bk-b"></div></section></div></div>
    <p><button class="btn" id="pback">← ${esc(t("back"))}</button></p>`));
  mountLive(view);
  $("#pback").onclick = () => go("misto/lichvar");
  await lichvarKresli(view.querySelector('[data-s="lichvar"]'), mod);
};

// 1.0-1-6: mincovna ve Vlašském dvoře — jediný zdroj nových grošů; ražebné podle peněz v oběhu
VIEWS.mincovna = async (view) => {
  const obr = artReady("domov/nahled-mincovna-razba") ? "domov/nahled-mincovna-razba" : "mesto-mincovna";
  const kresli = (d) => { const box = view.querySelector(".mc-box"); if (!box) return;
    box.innerHTML = `<p>${esc(L(["Ražebné dnes: ", "Seigniorage today: "]))}<b>${Math.round(d.razebne * 100)} %</b> · ${esc(L(["za jednu stříbrnou rudu ", "per silver ore "]))}<b>${esc(t("coins", d.za_rudu))}</b></p>
      <p class="muted small">${esc(L([`Dnes může mincovna vyrazit ještě ${d.zbyva} z ${d.strop} gr. Ražebné stoupá, když mají lidé ve městě hodně peněz (teď ${d.M} gr. na hlavu, cíl ${d.M_cil}).`, `Today the mint can still strike ${d.zbyva} of ${d.strop} gr.`]))}</p>
      <div class="vl-form"><label>${esc(L(["Kolik rudy (máš ", "How much ore (you have "]) + d.ruda + ")")} <input type="number" id="mc-q" min="1" max="${Math.max(1, d.ruda)}" value="${Math.max(1, d.ruda)}"></label>
        <button class="btn primary" id="mc-prodat"${d.ruda ? "" : " disabled"}>${esc(L(["Prodat mincmistrovi", "Sell to the mint master"]))}</button></div>`;
    const b = $("#mc-prodat"); if (b) b.onclick = async () => { try { const x = await call("mincovna_prodat", { qty: +$("#mc-q").value }); toast(x.text); kresli(x);
      const me = await call("me", {}, true); if (me && me.name) S.me = me; } catch {} }; };
  view.replaceChildren(h(`${sceneHead(obr, L(["Mincovna · Vlašský dvůr", "Royal mint"]), L(["Mincmistr: „Stříbro přines, groše odneseš.“", "Mint master: \"Bring silver, take groschen.\""]))}
    <div class="dpanel"><div class="mc-box"><p class="muted">…</p></div></div>
    <p><button class="btn" id="pback">← ${esc(t("back"))}</button></p>`));
  mountLive(view);
  $("#pback").onclick = () => go("misto/mincovna");
  try { kresli(await call("mincovna", {})); } catch {}
};

// 1.0-1: Domy na prodej (radnice) — karta s malovaným náhledem, popisem, místnostmi a podmínkami
VIEWS.domy = async (view) => {
  let D; try { D = (await call("domy", {}, true)).domy; } catch { return; }
  if (S.tab !== "domy") return;
  const RN = (r) => L(ROOM_NAZ[r] || [r, r]);
  view.replaceChildren(h(`${sceneHead("mesto-radnice", L(["Domy na prodej", "Houses for sale"]), L(["Písař radnice: „Pozemek, klíče a zápis do městské knihy.“", "Town scribe: \"Land, keys and an entry in the town book.\""]), true)}
    <div class="domy-karty">${D.domy.map((d) => `<div class="domy-k${d.mam ? " mam" : ""}">
      <span class="domy-obr" style="background-image:url('${ART_SRC(d.img)}')">${d.mam ? `<i>${esc(L(["Tvůj domov", "Your home"]))}</i>` : ""}</span>
      <div class="domy-telo"><div class="spread"><b>${esc(d.name)}</b><span class="domy-cena">${esc(d.price + " gr.")}</span></div>
        <p>${esc(d.text)}</p>
        <ul>${d.body.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
        <small class="muted">${esc(L(["Místnosti: ", "Rooms: "]) + Object.entries(d.rooms).map(([r, n]) => RN(r) + " (" + n + ")").join(", "))}</small>
        ${d.lock.length ? `<p class="domy-zamek">${esc(L(["Prodá se ti ", "Available "]) + d.lock.join(" a "))}</p>` : ""}
        <div class="domy-akce">${d.mam ? `<button class="btn" data-dgo2="domov">${esc(L(["Jít domů", "Go home"]))}</button>`
          : d.horsi ? `<span class="muted">${esc(L(["Máš lepší měšťanský dům.", "You own the better house."]))}</span>`
          : `<button class="btn primary" data-koupit="${esc(d.key)}"${d.muze ? "" : " disabled"}>${esc(L(["Koupit za ", "Buy for "]) + d.pay + " gr.")}</button>
             ${d.vymena ? `<small class="muted">${esc(L(["Chalupu radnice vykoupí za polovinu a nábytek se přestěhuje.", "The town buys back your cottage; furniture moves along."]))}</small>` : ""}`}</div></div></div>`).join("")}</div>
    <p><button class="btn" id="pback">← ${esc(t("back"))}</button></p>`));
  mountLive(view);
  $("#pback").onclick = () => go("misto/radnice");
  view.querySelectorAll("[data-dgo2]").forEach((b) => b.onclick = () => go(b.dataset.dgo2));
  view.querySelectorAll("[data-koupit]").forEach((b) => b.onclick = async () => {
    const d = D.domy.find((x) => x.key === b.dataset.koupit);
    if (!confirm(L([`Koupit ${d.name} za ${d.pay} gr.?`, `Buy ${d.name} for ${d.pay} gr.?`]))) return;
    b.disabled = true;
    try { await call("raid_click", { id: "ks:house:buy:" + d.key, values: [] }); toast(L([`${d.name} je tvůj. Vítej doma!`, "Welcome home!"])); Zvuk.sfx("mince");
      const me = await call("me", {}, true); if (me && me.name) S.me = me; } catch { b.disabled = false; return; }
    go("domov"); });
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
        <summary>${icon(a.item)}<span class="a-nm"><b>${esc(a.item)}</b>${a.vyrobeno ? `<em class="a-vyr">${esc(L(["vyrobeno v ", "made at "]) + a.vyrobeno)}</em>` : ""}<small>${esc(L(["prodává ", "seller "]) + (a.seller || ""))}</small></span>
          <span class="a-cena"><b>${esc(String(a.bid || a.start))} gr.</b><small>${esc(stav)}</small></span><span class="a-cas">${esc(cas(a.ends))}</span></summary>
        <div class="a-telo">${a.mine || a.lead ? `<p class="muted">${esc(a.mine ? L(["Na vlastní aukci nepřihazuješ.", "You can't bid on your own auction."]) : L(["Nejvyšší nabídku máš ty. Když tě někdo přehodí, groše se ti vrátí.", "You hold the top bid."]))}</p>`
          : `<p class="muted">${esc(L(["Máš ", "You have "]) + r.coins + " gr. · " + L(["přihoz v posledních 60 s prodlouží aukci o minutu", "a bid in the last 60 s adds a minute"]))}</p>
          <div class="row">${kroky.map(([st, sum]) => `<button class="btn${st === kroky[0][0] ? " primary" : ""}" data-bid="${esc(a.id)}:${st}"${sum > r.coins ? " disabled" : ""}>${esc(st ? "+" + st + " → " + sum + " gr." : L(["Nabídnout ", "Bid "]) + sum + " gr.")}</button>`).join("")}</div>`}</div></details>`;
    }).join("") : `<div class="empty">${esc(L(["Teď se nic nedraží. Vydraž něco svého.", "Nothing is up for auction right now."]))}</div>`;
    loadIcons(r.auctions.map((a) => a.item));
    if (!AUK.vesel) { AUK.vesel = 1; vejdiObchod("#auclist"); }
    box.querySelectorAll("details").forEach((d) => d.addEventListener("toggle", () => { d.open ? AUK.open.add(d.dataset.id) : AUK.open.delete(d.dataset.id); }));
    box.querySelectorAll("[data-bid]").forEach((b) => b.onclick = async () => {
      b.disabled = true;
      try { const x = await call("raid_click", { id: "ks:aucbid:" + b.dataset.bid, values: [] }); Zvuk.sfx("mince"); toast(noEmoji((x.panel && x.panel.content) || L(["Přihozeno.", "Bid placed."])).replace(/\*\*/g, "")); }
      catch { b.disabled = false; }
      kresli();
    });
  };
  clearInterval(AUK.timer); AUK.timer = setInterval(kresli, 10000); AUK.vesel = 0;
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

// r27-40: PC — seznam zboží se zkrátí tak, aby se celý obchod i s tlačítkem Zpět vešel bez posouvání stránky
function vejdiObchod(sel = ".obchod-sloupce .items") {
  const pevne = sel === ".obchod-sloupce .items";
  const view = $("#view");
  if (!view || document.documentElement.classList.contains("mobil") || innerWidth < 1100) return;
  const lists = [...view.querySelectorAll(sel)].filter((x) => x.offsetParent);
  if (!lists.length) return;
  lists.forEach((l) => { l.style.maxHeight = ""; l.style.height = ""; });
  const run = () => {
    const navic = view.scrollHeight - view.clientHeight;
    if (navic > 0) lists.forEach((l) => { l.style.maxHeight = Math.max(140, l.clientHeight - navic - 4) + "px"; l.style.overflowY = "auto"; });
    if (pevne) {                                          // 1.0-1-9 (Pavel): prostor zboží pevný — tlačítko Zpět dole v rovině s obrázkem vlevo
      const sc = view.querySelector(".scene"), bk = view.querySelector("#back");
      if (sc && bk) {
        const vr = view.getBoundingClientRect(), pb = parseFloat(getComputedStyle(view).paddingBottom) || 0;
        const cil = Math.min(sc.getBoundingClientRect().bottom, vr.top + view.clientHeight - pb - 2);   // nikdy pod okraj okna (žádné posouvání)
        const d = cil - bk.getBoundingClientRect().bottom;
        lists.forEach((l) => { l.style.height = l.style.maxHeight = Math.max(140, l.clientHeight + d) + "px"; l.style.overflowY = "auto"; });
        const zbyva = view.scrollHeight - view.clientHeight;                // pojistka: kdyby se stránka i tak posouvala, zkrátit
        if (zbyva > 0) lists.forEach((l) => { l.style.height = l.style.maxHeight = Math.max(140, l.clientHeight - zbyva - 2) + "px"; });
      }
    }
    view.scrollTop = 0;
  };
  requestAnimationFrame(run); setTimeout(run, 300); setTimeout(run, 900); setTimeout(run, 2000);
  document.fonts?.ready.then(run);
  if (pevne && typeof ResizeObserver !== "undefined") {    // 1.0-1-12: když se hlavička obchodu nebo obrázek dodatečně přeskládá, dorovnat znovu
    vejdiObchod._ro?.disconnect();
    let cek = 0;
    const ro = new ResizeObserver(() => { cancelAnimationFrame(cek); cek = requestAnimationFrame(run); });
    [view.querySelector(".scene"), view.querySelector(".obchod-stav"), view.querySelector(".obchod-prepinac")].forEach((el) => el && ro.observe(el));
    vejdiObchod._ro = ro;
  }
}
addEventListener("hashchange", () => { const tip = $("#uc-tip"); if (tip) tip.hidden = true; });
addEventListener("resize", () => { if (S.tab === "obchod") vejdiObchod(); else if (S.tab === "misto") vejdiObchod(".misto-volby"); else if (S.tab === "panel") vejdiObchod(".volby-blok .vp-volby"); else if (S.tab === "aukce") vejdiObchod("#auclist"); });
VIEWS.obchod = async (view) => {
  const shopId = S.arg;
  const u = SHOPS_UI[shopId] || { img: "mesto-trziste", say: ["", ""] };
  const back = shopId === "Hostinský" ? "misto/hostinec" : "misto/trziste";   // 1.0-1: Mlynář i Pašerák zpět na tržiště (s historií vždy o krok)
  view.replaceChildren(h(`${sceneHead(u.img, shopId, L(u.say), true)}
    ${S.me.on_raid ? `<div class="panel notice" style="margin:14px 0">🗺️ ${esc(t("on_raid"))}</div>` : ""}
    <div class="shoppanel" id="shop"><div class="panel empty">…</div></div>
    <p class="row"><button class="btn" id="back">← ${esc(t("back"))}</button>${shopId === "Písař" ? `<button class="btn" id="vykr">${esc(L(["Výkresy pro řemeslníky", "Plans for craftsmen"]))}</button>` : ""}</p>`));
  mountLive(view);
  $("#back").onclick = () => go(back);
  const vk = $("#vykr"); if (vk) vk.onclick = () => { VYK.zpet = "obchod/Písař"; go("vykresy"); };   // 1.0-1-5
  let data;
  try { data = await call("shop", { shop: shopId }); } catch { return; }
  const box = $("#shop");
  if (!box || S.arg !== shopId) return;
  view.querySelector(".scene-cap h2").textContent = data.name;
  if (data.vztah) {   // r27-42: vztah s obchodníkem — proč je cena jiná (nebo proč s tebou nemluví)
    const V = data.vztah, cap = view.querySelector(".scene-cap");
    // 1.0-1: vztah obchodníka k tobě je v hlavičce obchodu (mezi měšcem a hledáním)
    if (V.st === "nepritel") {
      box.insertAdjacentHTML("beforebegin", `<div class="panel notice vz-odmita">${esc(V.veta)}${(V.pres || []).length ? `<div class="vz-pres">${V.pres.map((p) =>
        `<button type="button" class="btn small" data-pres="${esc(p.k)}" title="${esc(p.popis)}">${p.k === "posel" ? "🏃" : "🌙"} ${esc(p.jm)} · +${p.pct} %</button>`).join("")}</div>` : ""}</div>`);
      view.querySelectorAll("[data-pres]").forEach((b) => b.onclick = () => presKresli(box, shopId, b.dataset.pres));
    }
  }
  const lvl = S.me.level;
  // r27-4: obchod jako truhla — vlevo zboží obchodníka (Koupit, po kategoriích), vpravo věci, které neseš (Prodat)
  const OST = L(["ostatní", "other"]);
  // 1.0-1: když má obchodník všechno v jedné kategorii (apatykář: samé „spotřební“), dělí se zboží podle druhu
  const PODKAT = [[/obvaz|náplast|dlaha/i, ["Obvazy", "Bandages"]], [/odvar|elixír|lektvar|tinktur|nápoj/i, ["Odvary", "Potions"]], [/mast|čaj|bylin|olej|balzám/i, ["Byliny a masti", "Herbs and salves"]]];
  const slotKat = (i) => i.slot_name || OST;
  const jednaKat = new Set(data.items.map(slotKat)).size < 2;
  // 1.0-1-11 (Pavel): jemnější filtry — zbraně podle druhu, zbroje podle materiálu, u apatykáře obvazy / masti / odvary
  const DRUH_ZBR = { "sečné": ["Sečné", "Edged"], "tupé": ["Tupé", "Blunt"], "bodné": ["Bodné", "Piercing"], "střelné": ["Střelné", "Ranged"], "palné": ["Palné", "Firearms"] };
  const ZBROJ_KAT = [[/kroužk/i, ["Kroužková", "Mail"]], [/plát|kyrys|milán/i, ["Plátová", "Plate"]], [/brigantin|šupin/i, ["Brigantiny a šupiny", "Brigandine and scale"]], [/kožen|vycpáv|prošív|kazajk|kabát/i, ["Kožená a prošívaná", "Leather and padded"]]];
  const APAT_KAT = [[/obvaz|náplast|dlaha/i, ["Obvazy", "Bandages"]], [/mast|čaj|balzám|olej/i, ["Masti a čaje", "Salves and teas"]]];
  const katOf = (i) => {
    if (i.slot === "zbraň" && i.druh && DRUH_ZBR[i.druh]) return L(DRUH_ZBR[i.druh]);
    if (i.slot === "zbroj") { const h = ZBROJ_KAT.find(([re]) => re.test(i.id)); if (h) return L(h[1]); }
    if (shopId === "Apatykář" && i.slot === "spotřební") { const h = APAT_KAT.find(([re]) => re.test(i.id)); return h ? L(h[1]) : L(["Odvary a lektvary", "Potions"]); }
    if (!jednaKat) return slotKat(i); const h = PODKAT.find(([re]) => re.test(i.name)); return h ? L(h[1]) : slotKat(i); };
  const kats = [...new Set(data.items.map(katOf))];
  let kat = "", q = "", barvi = "";                    // r27-6: u oděvu, pláště, zbroje a štítu se při nákupu vybírá barva
  const zvol = {};                                     // zvolená barva u zboží (rozklikávací výběr)
  const cena = (i) => i.price + (i.colors ? (i.dye_fees || {})[zvol[i.id] || "Přírodní"] || 0 : 0);   // obarvení za příplatek podle barviva
  const sedi = (i) => !q || i.name.toLowerCase().includes(q.toLowerCase());
  // r27-5: víc kusů posuvníkem (u jídla, střeliva, surovin…), cena se přepočítá
  const mnoz = (max, cena) => max > 1 ? `<label class="mnoz" title="${esc(L(["Kolik kusů", "How many"]))}"><input type="range" min="1" max="${max}" value="1" data-mn data-cena="${cena}"><b>×1</b></label>` : "";
  // 1.0-3-15: popisek zboží po najetí nebo klepnutí na ikonu (dobový popis, k čemu je, staty)
  const obTip = (i, inner) => { const st = (i.staty || []).map((x) => x[0]).join(" · ");
    const s2 = [i.k_cemu, st].filter(Boolean).join(" · ");
    return i.popis || s2 ? `<span class="ob-ik" tabindex="0" role="button" data-tip-n="${esc(i.name)}" data-tip-t="${esc(i.popis || "")}" data-tip-s="${esc(s2)}">${inner}</span>` : inner; };
  const koupit = (i) => { const mx = i.level <= lvl ? Math.max(1, Math.min(20, Math.floor(S.me.coins / Math.max(1, cena(i))))) : 1;   // r27-6: posuvník u všeho zboží
    const hxv = i.colors ? i.colors[zvol[i.id] || "Přírodní"] : "";   // r27-6: zvolená barva je vidět i na ikoně zboží
    const ik = hxv ? `<span class="ikona-barva${/zbroj|štít|stit/i.test(i.slot_name || "") ? " kov" : ""}" style="--b:${hxv};--m:url('${IMG_BASE}predmety/ikony/${Postava.slug(i.id)}.webp')">${icon(i.id)}<i></i></span>` : icon(i.id);
    return `<div class="item">${obTip(i, ik)}
      <div><div class="nm">${esc(i.name)}${i.level > lvl ? `<span class="tag lock">${esc(t("from_level", i.level))}</span>` : ""}${i.vyprodano ? `<span class="tag lock">${esc(L(["vyprodáno", "sold out"]))}</span>` : ""}</div>
      <div class="meta">${esc(i.slot_name)}${i.fx ? ` · <b class="fx">${esc(i.fx)}</b>` : ""}${i.count ? " · " + esc(t("have", i.count)) : ""}${i.sklad != null && !i.vyprodano ? " · " + esc(L(["skladem ", "in stock "]) + i.sklad) : ""}</div>${statyHtml(i)}</div>
      <div class="acts">${i.vyprodano ? "" : mnoz(Math.min(mx, i.sklad != null ? i.sklad : mx), cena(i))}<span class="price" data-cena-txt>${esc(t("coins", cena(i)))}</span>${i.sipka ? `<span class="cena-sipka ${i.sipka === "▲" ? "nahoru" : "dolu"}" title="${esc(i.sipka_proc || "")}">${i.sipka}</span>` : ""}
        <button class="btn small primary" data-buy="${esc(i.id)}"${i.colors ? ` data-barva="${esc(zvol[i.id] || "Přírodní")}"` : ""}${i.vyprodano || i.level > lvl || cena(i) > S.me.coins ? " disabled" : ""}>${esc(t("buy"))}</button></div>
      ${i.colors ? (() => { const c = zvol[i.id] || "Přírodní", hx = i.colors[c];
        return `<button class="kup-vyber${barvi === i.id ? " on" : ""}" data-barvit="${esc(i.id)}"><i${hx ? ` style="--b:${hx}"` : ` class="prirodni"`}></i>${esc(L(["Barva: ", "Colour: "]) + c)}${hx ? ` <b>+${(i.dye_fees || {})[c] || 0} gr.</b>` : ""} <span>${barvi === i.id ? "▴" : "▾ " + esc(L(["vybrat barvu", "choose"]))}</span></button>
        ${barvi === i.id ? `<div class="kup-barva">${Object.entries(i.colors).sort(([a], [b]) => ((i.dye_fees || {})[a] || 0) - ((i.dye_fees || {})[b] || 0)).map(([cc, h2]) =>
          `<button class="kb${cc === c ? " on" : ""}" data-zvol="${esc(i.id)}" data-barva="${esc(cc)}" title="${esc(cc)}"><i${h2 ? ` style="--b:${h2}"` : ` class="prirodni"`}></i><small>${esc(cc)}</small><em>${(i.dye_fees || {})[cc] ? "+" + i.dye_fees[cc] + " gr." : L(["zdarma", "free"])}</em></button>`).join("")}</div>` : ""}`; })() : ""}</div>`; };
  const prodat = (i) => `<div class="item${i.sell ? "" : " nechce"}"${kusAttr(i)}>${obTip(i, icon(i.id))}
      <div><div class="nm">${esc(i.name)}${kusTag(i)}${i.count > 1 ? ` <span class="muted">× ${i.count}</span>` : ""}${i.kus == null ? barvaStitek(i.color, i.hex) : ""}${i.sell && i.best ? `<span class="tag ok">${esc(L(["nejlepší výkup", "best price"]))}</span>` : ""}</div>
      <div class="meta">${esc(i.sell ? (i.best_shop ? L(["víc dá ", "more at "]) + i.best_shop + " (" + t("coins", i.best_price) + ")" : i.slot_name) : L(["tohle nevykupuje", "won't buy this"]))}</div>${opotrebeni(i)}</div>
      <div class="acts">${i.sell ? `${mnoz(i.count, i.sell)}<span class="price" data-cena-txt>${esc(t("coins", i.sell))}</span>
        <button class="btn small" data-sell="${esc(i.id)}"${i.color ? ` data-barva="${esc(i.color)}"` : ""}>${esc(t("sell"))}</button>` : ""}</div></div>`;
  const drawShop = () => {
    const vse = data.items.filter(sedi);
    const rows = vse.filter((i) => !kat || katOf(i) === kat);
    const fk = $("#shop-kat");
    if (fk) {
      fk.innerHTML = kats.length > 1 ? [["", L(["Vše", "All"]) + " · " + vse.length], ...kats.map((k) => [k, k + " · " + vse.filter((i) => katOf(i) === k).length])]
        .map(([k, n]) => `<button class="chip${kat === k ? " on" : ""}" data-kat="${esc(k)}">${esc(n.charAt(0).toUpperCase() + n.slice(1))}</button>`).join("") : "";
      fk.querySelectorAll("[data-kat]").forEach((b) => b.onclick = () => { kat = b.dataset.kat; drawShop(); });
      if (!fk._kolo) { fk._kolo = true; fk.addEventListener("wheel", (e) => { if (fk.scrollWidth > fk.clientWidth && Math.abs(e.deltaY) > Math.abs(e.deltaX)) { fk.scrollLeft += e.deltaY; e.preventDefault(); } }, { passive: false }); }
    }
    const skup = kat || kats.length < 2 ? [[kat, rows]] : kats.map((k) => [k, rows.filter((i) => katOf(i) === k)]).filter(([, r]) => r.length);
    const mistr = (data.mistrovske || []).filter((x) => (!q || x.name.toLowerCase().includes(q.toLowerCase())) && (!kat || !x.slot_name || katOf(x) === kat)).map((x) => `<div class="item mistr-radek">${obTip(x, icon(x.id))}
      <div><div class="nm">${esc(x.name)} <i class="pp-stupen">+1</i><span class="tag ok">${esc(L(["mistrovský kus · jen dnes", "masterwork · today only"]))}</span>${x.level > lvl ? `<span class="tag lock">${esc(t("from_level", x.level))}</span>` : ""}</div>
      <div class="meta">${esc(L(["Už zušlechtěný na +1, jediný kus", "Already improved to +1, one piece only"]))}</div></div>
      <div class="acts"><span class="price">${esc(t("coins", x.price))}</span><button class="btn small primary" data-mistr="${esc(x.id)}"${S.me.coins < x.price || lvl < x.level ? " disabled" : ""}>${esc(t("buy"))}</button></div></div>`).join("");   // 1.0-1-9 (Pavel): žádná přehlídka, běžný řádek nahoře v seznamu
    $("#shop-items").innerHTML = mistr + (rows.length ? skup.map(([k, r]) => (!kat && kats.length > 1 ? `<div class="sect kat-nadpis">${esc(k)}</div>` : "") + r.map(koupit).join("")).join("")
      : mistr ? "" : `<div class="empty">${esc(t("empty"))}</div>`);
    box.querySelectorAll("[data-mistr]").forEach((b) => b.onclick = () => { b.disabled = true;   // 1.0-1-5: mistrovský kus +1
      call("buy_mistrovske", { item: b.dataset.mistr, shop: shopId }).then((r) => { Zvuk.sfx("mince"); toast(L([`Mistrovský kus je tvůj za ${r.price} gr.`, `Masterwork bought for ${r.price} gr.`])); render(); }).catch(() => { b.disabled = false; }); });
    const mine = (data.mine || []).filter(sedi).sort((x, y) => (y.sell ? 1 : 0) - (x.sell ? 1 : 0) || (y.best ? 1 : 0) - (x.best ? 1 : 0));
    $("#shop-mine").innerHTML = mine.length ? mine.map(prodat).join("") : `<div class="empty">${esc(L(["Nic u sebe nemáš.", "Nothing carried."]))}</div>`;
    $("#mine-n").textContent = (data.mine || []).filter((i) => i.sell).length;
    { const n2 = $("#mine-n2"); if (n2) n2.textContent = "· " + (data.mine || []).filter((i) => i.sell).length; }
    wireMnoz(box);
    vejdiObchod();
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
    tipy(box);                                            // 1.0-3-15: popisky zboží
    mobilniSeznam(box);
  };
  const mins = data.restock_min || 0;
  const left = mins >= 60 ? t("hm", Math.floor(mins / 60), mins % 60) : t("m", mins);
  if (data.smuggler && !data.night) {                 // 1.0-1: ve dne jen zpráva — pašerák se ukáže až po setmění
    const za = data.opens_min || 0;
    box.innerHTML = `<div class="panel paserak-den"><h3>${esc(L(["Pašerák tu není", "The smuggler isn't here"]))}</h3>
      <p>${esc(L(["Za denního světla se tu neukáže — příliš mnoho očí a biřiců. Vrať se po setmění: na tržišti bývá od devíti večer do pěti ráno.", "He never shows by daylight. Come back after dark: 9 pm to 5 am."]))}</p>
      <p class="muted">🌙 ${esc(L([`Setmí se asi za ${Math.floor(za / 60)} h ${za % 60} min.`, `Nightfall in about ${Math.floor(za / 60)} h ${za % 60} min.`]))}</p></div>`;
    return;
  }
  const grain = shopId === "Mlynář" ? ((data.mine || []).find((i) => i.id === "Obilí") || {}).count || 0 : 0;
  box.replaceChildren(h(`${shopId === "Mlynář" ? `<div class="panel notice" style="margin-bottom:12px">⚙️ ${esc(L(["Mlynář ti semele obilí na mouku za 1 groš za pytel.", "The miller grinds your grain into flour for 1 groschen a sack."]))}
      <button class="btn small primary" id="mill"${grain ? "" : " disabled"}>${esc(L(["Semlít obilí", "Grind grain"]))}${grain ? ` (${grain}×)` : ""}</button></div>` : ""}
    <div class="panel truhla-stav obchod-stav"><div class="ts-info"><b>${esc(data.name)}</b>
      <span>${esc(L(["Měšec: ", "Purse: "]) + t("coins", S.me.coins))}</span>${data.pokladna != null ? `<span class="dim">${esc(L(["Na výkup má ", "Buying budget "]) + t("coins", data.pokladna))}</span>` : ""}${data.smuggler ? `<span class="dim">${esc(data.night ? L(["Každou noc jiné zboží · vykupuje jen cennosti a trofeje", "New goods every night · buys only valuables and trophies"]) : L([`Pašerák tu není — přijde v noci (21–5), asi za ${Math.floor(data.opens_min / 60)} h ${data.opens_min % 60} min.`, "The smuggler comes at night (9 pm–5 am)."]))}</span>` : `<span class="dim">🔄 ${esc(t("restock", left))}</span>`}</div>
      ${data.vztah ? `<div class="ob-vztah ${esc(data.vztah.st)}" title="${esc(L(["Deník → Vztahy → Lidé ve městě", "Journal → Relationships"]))}"><small>${esc(L(["Vztah k tobě", "Attitude to you"]))}</small>
        <b>${esc(data.vztah.jm + (data.vztah.zap ? " 🔒" : ""))}</b><span class="li-body ${esc(data.vztah.st)}"><i style="left:50%;width:${Math.abs(data.vztah.b || 0) / 2}%;${(data.vztah.b || 0) < 0 ? "transform:translateX(-100%)" : ""}"></i></span><em>${esc(data.vztah.txt)}</em></div>` : ""}
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
    vejdiObchod();
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
  loadIcons((data.mistrovske || []).map((x) => x.id));
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
const dieImg = (face, i, p, cls = "", typ = "") => `<button class="kostka ${cls}${typ ? " cinknuta" : ""}" data-i="${i}" style="left:${p.x}%;top:${p.y}%;--rot:${p.rot}deg;--i:${i}" aria-label="${face}"${typ ? ` title="${esc(typ)}"` : ""}>
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
      ${kind === "dice" && (st.kostky || []).length ? `<div class="cink-volba"><b>${esc(L(["Cinknuté kostky", "Loaded dice"]))}</b>
        <span class="dim small">${esc(L(["Každá vybraná nahradí jednu obyčejnou kostku.", "Each replaces one normal die."]))}</span>
        ${st.kostky.map((k) => `<label class="cink-k" title="${esc(k.popis)}"><input type="checkbox" data-kostka="${esc(k.name)}"${k.on ? " checked" : ""}>
          <img alt="" src="${IMG_BASE}predmety/ikony/${Postava.slug(k.name)}.webp" data-skryt-pri-chybe><span>${esc(k.name)}<small>${esc(k.popis)}</small></span></label>`).join("")}</div>` : ""}
      <div class="row"><button class="btn primary big" style="max-width:240px" data-start="${kind}">${esc(t("play"))}</button>
      <button class="btn" data-go="misto/hostinec">← ${esc(t("back"))}</button></div></div>`)));
    mountLive(view, { still: true });
    view.querySelectorAll("[data-go]").forEach((b) => b.onclick = () => go(b.dataset.go));
    view.querySelectorAll("[data-start]").forEach((b) => b.onclick = () => {
      const data = { kind: b.dataset.start, stake: Number($("#stake").value) };
      store.set("stake", data.stake);
      if (data.kind === "dice" && $("#diff")) { data.diff = $("#diff").value; store.set("diff", data.diff); }
      if (data.kind === "dice" && view.querySelector("[data-kostka]")) data.kostky = [...view.querySelectorAll("[data-kostka]:checked")].map((x) => x.dataset.kostka);   // 1.0-3-8
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
      ${g.phase === "pick" ? g.dice.map((f, i) => dieImg(f, i, lay[i], (S.sel.has(i) ? "sel" : "") + (fresh ? " pada" : ""), (g.typy || [])[i])).join("") : ""}
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
  view.classList.remove("rozdel");   // 1.0-2-6: příprava výpravy dává na PC rozložení „obraz vlevo“ — rozjetá výprava ho mít nesmí (byla úzká vpravo, dokud se neobnovila stránka)
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
  // 1.0-1-14 (Pavel): během tahu zůstanou tlačítka boje na místě (zašedlá) — pergamen se nesmí roztáhnout
  if (!combat) RAID.posledniOvl = null; else if ((m.controls || []).length) RAID.posledniOvl = m.controls;
  const ovl = combat && !(m.controls || []).length && RAID.posledniOvl ? RAID.posledniOvl : m.controls;
  const hud = !combat && vp.info.prozkoumano ? `<div class="vhud">${vp.info.prozkoumano ? `<span title="${esc(L(["Prozkoumáno", "Explored"]))}">${esc(L(["prozkoumáno ", "explored "]) + vp.info.prozkoumano)}</span>` : ""}${vp.info.nalez ? `<span>${esc(L(["nálezy ", "finds "]) + vp.info.nalez)}</span>` : ""}</div>` : "";
  const sit = !combat && m.situation && SIT_ART[m.situation] ? `<div class="vsit">${IMG("situace/" + SIT_ART[m.situation])}</div>` : "";
  view.replaceChildren(h(`<div class="vyp v2${combat ? " boj" : ""}">
    <div class="vscene live${combat ? " fight" : ""}" data-img="${esc(sc.img)}" data-key="${esc(sc.key)}">
      <div class="vtitle"><h2>${esc(m.node || m.location)}</h2><small>${esc(m.location)}${m.weather ? " · " + esc(m.weather) : ""}</small></div>
      ${m.deadline ? `<div class="vcas" data-deadline="${m.deadline}" title="${esc(L(["Do té doby se musíš vrátit do města, jinak přijdeš o groše u sebe a o všechno, co neseš.", "Return to town before this, or lose what you carry."]))}">⌛ <b></b></div>` : ""}
      ${foe}${sit}${hud}<div class="vparty">${members}</div>
      ${combat ? `<div class="vturn${myTurn && !busy ? " moje" : ""}">${busy ? esc(L(["Probíhá tah…", "Turn in progress…"])) : myTurn ? esc(L(["Jsi na tahu", "Your turn"])) : esc(L(["Na tahu je jiný člen družiny", "Another member's turn"]))}</div>` : ""}
    </div>
    <div class="vyp-telo">
      ${vp.text ? `<article class="vyp-pergamen"><div class="vtext">${dmd(vp.text)}</div></article>` : ""}
      <div class="vyp-akce">${raidControlsHtml(ovl, busy || ovl !== m.controls, combat, m.exit_dirs || [])}</div>
    </div></div><div id="vpanel"></div>`));
  vypPergamen(view.querySelector(".vyp-pergamen"), m);
  { // 1.0-2-7: v boji bez tlačítek (tah nepřítele hned na začátku souboje, obnova stránky uprostřed tahu) drží místo po tlačítkách — pergamen se neroztáhne
    const ak = view.querySelector(".vyp-akce");
    if (ak && combat) {
      if ((ovl || []).length) { const v = ak.offsetHeight; if (v > 40) { RAID.ctlH = v; try { store.set("vyp-ctl-h", String(v)); } catch { /* bez úložiště */ } } }
      else ak.style.minHeight = (RAID.ctlH || +(store.get("vyp-ctl-h") || 0) || (jeMobil() ? 0 : 290)) + "px";
    }
  }
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
    if (/=\s*\d+\s+proti\s+\d+/.test(l)) return;                     // r27-25: zkouška vlastnosti („14 +2 = 16 proti 17 (Učenost) → neúspěch“)
    let x;
    if ((x = /prozkoumáno\s+(\d+\/\d+)(?:.*?nalezeno\s+(\d+))?/.exec(l)) && /^📍/.test(l)) { info.prozkoumano = x[1]; info.nalez = x[2] || ""; return; }
    if (/❤️\s*\d+\/\d+\s*·\s*💤/.test(l)) {                       // řádek potřeb — jen varování, když je zle
      [["odpočatost", L(["únava", "tired"])], ["hlad", L(["hlad", "hungry"])], ["žízeň", L(["žízeň", "thirst"])]].forEach(([k, n]) => {
        const r = new RegExp(k + "\\s+\\d+\\s*(🔴|🟠)").exec(l); if (r) info.varovani.push(n); });
      return;
    }
    if (/^✨/.test(l) || /^🔥 Svítí|^🌑/.test(l)) return;
    if (pryc.some((r) => r.test(l))) return;
    if (/^-#/.test(l) && !/🍖|gr\.|získ|našel|našla|zkušenost|kořist|ztratil|ztratila|zraněn|odměn|\+\d/i.test(l)) return;   // drobné písmo: hody, nápovědy
    if (/^##\s/.test(l) && noEmoji(l.replace(/^##\s*/, "")).trim().toLowerCase() === uzel) return;   // název místa je v obraze
    if (/^>\s?/.test(l)) { ven.push("*" + noEmoji(l.replace(/^>\s?/, "")).trim().replace(/^\*+|\*+$/g, "") + "*"); return; }   // r27-25: citace (hádanka) kurzívou, bez „>“
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
// r27-41: náhledy a krátké popisy výprav
const VYP_OBR = { rataje: "rataje", kutna_hora: "kanek", nebakov: "lezeni", trosky: "malesov", sedlec: "sedlec", posazavi: "posazavi" };
const VYP_POPIS = {
  rataje: ["Lesy plné zvěře a lapků. Lov, byliny a zbojnický tábor — ideální první výprava.", "Woods full of game and bandits."],
  kutna_hora: ["Opuštěné štoly pod Kaňkem. Tma, závaly, krysy a havířské poklady — vezmi si světlo.", "Abandoned mine shafts."],
  nebakov: ["Ležení žoldnéřů. Hlídky, stany s kořistí a ozbrojení nepřátelé.", "A mercenary camp."],
  trosky: ["Hrad Malešov a podhradí. Stráže, sklepení a purkrabí Ješek.", "Malešov castle."],
  sedlec: ["Velká výprava přes celé panství: tábořiště, stopy a příběh o ukradeném stříbře.", "A great expedition across the estate."],
  posazavi: ["Rozsáhlá výprava ke Sázavskému klášteru: hádanky, šifry a hlaholská kniha.", "A vast expedition to Sázava monastery."],
};
function drawRaidSetup(view, st) {
  const locs = [...(st.locations || [])];   // r27-6: tábořiště se vybírají až u velké výpravy (ne jako zvláštní lokace)
  const camps = st.camps || [];
  const diffs = st.difficulties || [], gp = st.guard_price || {}, pp = st.porter_price || {};
  const cena = (tab) => VYP.diff ? (tab[VYP.diff] || 0) : null;
  const lob = st.lobbies || [];
  // 1.0-1-6: doporučené pásmo úrovní oblasti — zelená pod tebou, zlatá pro tebe, červená nad tebe
  const pasmoHtml = (dif) => { const l = locs.find((x) => x.id === String(VYP.loc || "").split("@")[0]); const p = l && l.pasma && l.pasma[dif]; if (!p) return "";
    const lv = st.level || 1, cl = lv > p[1] ? "pod" : lv < p[0] ? "nad" : "pro";
    return `<em class="vp-pasmo ${cl}">${esc(L(["úrovně ", "levels "]) + p[0] + "–" + p[1] + " · " + (cl === "pod" ? L(["pod tebe — menší odměny", "below you — smaller rewards"]) : cl === "nad" ? L(["nad tebe — nebezpečné", "above you — dangerous"]) : L(["pro tebe", "for you"])))}</em>`; };
  // 1.0-1-14: průměr družiny, doporučené úrovně a varování, kdyby ses přidal(a) moc slabý(á)
  const druzinaInfo = (di) => { if (!di) return ""; const [lo, hi] = di.pasmo, lv = (S.me && S.me.level) || 1;
    const cl = di.prumer > hi ? "pod" : di.prumer < lo ? "nad" : "pro";
    return `<span class="vp-pasmo-obl ${cl}"><b>${esc(L(["průměr úr. ", "avg lvl "]) + di.prumer)}</b>${esc(L(["doporučeno ", "recommended "]) + lo + "–" + hi)}</span>`
      + (lv + 5 < lo ? `<small class="vp-smrt">⚠️ ${esc(L(["Pro tebe (úr. " + lv + ") je to smrtelně nebezpečné.", "Deadly for you (lvl " + lv + ")."]))}</small>` : ""); };
  // 1.0-1-14 (Pavel): doporučené úrovně i u oblasti — od lehké po těžkou, zvýrazněné podle tvé úrovně
  const pasmoOblasti = (l) => { const P = l.pasma && Object.values(l.pasma); if (!P || !P.length) return "";
    const lo = Math.min(...P.map((p) => p[0])), hi = Math.max(...P.map((p) => p[1])), lv = (S.me && S.me.level) || st.level || 1;
    const cl = lv > hi ? "pod" : lv < lo ? "nad" : "pro";
    return `<span class="vp-pasmo-obl ${cl}"><b>${esc(L(["úr. ", "lvl "]) + lo + "–" + hi)}</b>${esc(cl === "pod" ? L(["pod tebe", "below you"]) : cl === "nad" ? L(["nad tebe", "above you"]) : L(["pro tebe", "for you"]))}</span>`; };
  view.replaceChildren(h(`${sceneHead("mesto-brana", L(["Městská brána", "Town gate"]), L(["Strážný: „Kam to bude, na stezky?“", "Guard: \"Off to the trails, then?\""]))}
    ${lob.length ? `<div class="panel vyp-druziny"><h3>${esc(L(["Družiny, které čekají na společníky", "Parties looking for members"]))}</h3>
      <div class="druziny">${lob.map((d) => `<div class="druzina"><div><b>${esc(d.location)}</b><small>${esc(d.difficulty)}${d.guard ? " · " + L(["s glejtem", "with writ"]) : ""}${d.hunt ? " · " + L(["po stopách", "tracking"]) : ""}</small>
        <p>${esc(d.members.join(", "))} <span class="muted">(${d.members.length}/${d.cap})</span></p>${druzinaInfo(d.druzina)}</div>
        <button class="btn primary" data-cid="ks:lobby:${esc(d.id)}:join"${d.members.length >= d.cap ? " disabled" : ""}>${esc(L(["Přidat se", "Join"]))}</button></div>`).join("")}</div></div>` : ""}
    <div class="panel vyp-priprava"><h3>${esc(L(["Příprava výpravy", "Prepare an expedition"]))}</h3>
      <div class="vp-krok"><span class="vp-c">1</span><b>${esc(L(["Kdo jde", "Who goes"]))}</b></div>
      <div class="vp-volby">
        <button class="vp-volba vp-lok vp-nahled${VYP.mode === "solo" ? " on" : ""}" data-mode="solo"><span class="vl-obr">${IMG("vypravy/vyber-solo")}</span><span class="vl-txt"><b>${esc(L(["Sólo", "Solo"]))}</b><small>${esc(L(["vyrazíš hned sám", "set out alone right away"]))}</small></span></button>
        <button class="vp-volba vp-lok vp-nahled${VYP.mode === "group" ? " on" : ""}" data-mode="group"><span class="vl-obr">${IMG("vypravy/vyber-druzina")}</span><span class="vl-txt"><b>${esc(L(["Družina 2–4 hráčů", "Party of 2–4"]))}</b><small>${esc(L(["založíš ji a počkáš na společníky", "found it and wait for companions"]))}</small></span></button>
      </div>
      <div class="vp-krok"><span class="vp-c">2</span><b>${esc(L(["Kam", "Where"]))}</b><small class="muted">${esc(L(["Mapu oblasti si kup u písaře — na cestě se hodí.", "Buy the area map from the scribe."]))}</small></div>
      ${(() => {   // r27-6: lokace po skupinách — Nováček na stezce / Zkušený na stezce
        const karta = (l) => `<button class="vp-volba vp-lok${String(VYP.loc || "").split("@")[0] === l.id ? " on" : ""}${st.level && l.level > st.level ? " tezke" : ""}" data-loc="${esc(l.id)}">
          ${VYP_OBR[l.id] ? `<span class="vl-obr">${IMG("vypravy/" + VYP_OBR[l.id] + "-01")}</span>` : ""}
          <span class="vl-txt"><b>${esc(l.name)}</b>${pasmoOblasti(l)}<small>${esc(l.biome)}${l.camp ? "" : " · " + L(["od úrovně ", "level "]) + l.level}${l.places ? " · " + l.places + L([" míst", " places"]) : ""}</small>
          ${VYP_POPIS[l.id] ? `<em class="vl-popis">${esc(L(VYP_POPIS[l.id]))}</em>` : ""}</span></button>`;
        const T = st.tiers || [{ id: "vse", name: "", desc: "", keys: locs.map((l) => l.id) }];
        const kde = (l) => (T.find((t) => t.keys.includes(String(l.id).split("@")[0])) || T[0]).id;
        const Tn = T.filter((t) => locs.some((l) => kde(l) === t.id));   // r27-41: skupiny jako podzáložky (bez posouvání)
        const vybLoc = locs.find((l) => l.id === String(VYP.loc || "").split("@")[0]);
        if (!Tn.some((t) => t.id === VYP.tier)) VYP.tier = vybLoc ? kde(vybLoc) : (Tn[0] || {}).id;
        const pod = Tn.length > 1 ? `<div class="vp-tiery">${Tn.map((t) => `<button type="button" class="chip${VYP.tier === t.id ? " on" : ""}" data-tier="${esc(t.id)}">${esc(t.name || t.id)}</button>`).join("")}</div>` : "";
        return pod + Tn.filter((t) => Tn.length < 2 || t.id === VYP.tier).map((t) => { const L_ = locs.filter((l) => kde(l) === t.id); if (!L_.length) return "";
          const vybrana = L_.find((l) => String(VYP.loc || "").split("@")[0] === l.id);
          const start = vybrana && camps.some((c) => c.id.split("@")[0] === vybrana.id) ? `<div class="vp-tabor"><span>${esc(L(["Odkud vyrazit:", "Start from:"]))}</span>
            <button class="vp-mini${VYP.loc === vybrana.id ? " on" : ""}" data-loc="${esc(vybrana.id)}">${esc(L(["Od začátku", "From the start"]))}</button>
            ${camps.filter((c) => c.id.split("@")[0] === vybrana.id).map((c) => `<button class="vp-mini${VYP.loc === c.id ? " on" : ""}" data-loc="${esc(c.id)}">⛺ ${esc(c.name.split(" — ").pop())}</button>`).join("")}
            <small class="muted">${esc(L(["Tábořiště musí znát celá družina.", "The whole party must know the camp."]))}</small></div>` : "";
          return `<div class="vp-skupina ${t.id}">${t.name ? `<div class="vp-sk-hl"><b>${esc(L([t.name, t.id === "zkuseny" ? "Seasoned on the trail" : "Novice on the trail"]))}</b><small>${esc(t.desc)}</small></div>` : ""}
            <div class="vp-volby lok">${L_.map(karta).join("")}</div>${start}</div>`; }).join(""); })()}
      <div class="vp-krok"><span class="vp-c">3</span><b>${esc(L(["Obtížnost", "Difficulty"]))}</b></div>
      <div class="vp-volby">${diffs.map((d) => `<button class="vp-volba vp-lok vp-nahled${VYP.diff === d.id ? " on" : ""}" data-diff="${esc(d.id)}"><span class="vl-obr">${IMG("vypravy/vyber-" + d.id)}</span><span class="vl-txt"><b>${esc(noEmoji(d.name))}</b>
        <small>${esc(L(["glejt ", "writ "]) + (gp[d.id] || 0) + " gr. · " + L(["nosič ", "porter "]) + (pp[d.id] || 0) + " gr.")}</small>${pasmoHtml(d.id)}</span></button>`).join("")}</div>
      <div class="vp-krok"><span class="vp-c">4</span><b>${esc(L(["Služby u brány", "Services at the gate"]))}</b></div>
      <div class="vp-volby vp-sluzby">
        <button class="vp-volba vp-lok vp-nahled prepinac${VYP.guard ? " on" : ""}" data-tgl="guard"><span class="vl-obr">${IMG("vypravy/vyber-glejt")}</span><span class="vl-txt"><b>${esc(L(["Glejt", "Writ of passage"]))}${cena(gp) != null ? " · " + cena(gp) + " gr." : ""}</b>
          <small>${esc(L(["S glejtem výprava není v seznamu Na stezkách — nikdo cizí nepůjde po vašich stopách.", "Nobody can follow your tracks."]))}</small></span></button>
        <button class="vp-volba vp-lok vp-nahled prepinac${VYP.porter ? " on" : ""}" data-tgl="porter"><span class="vl-obr">${IMG("vypravy/vyber-nosic")}</span><span class="vl-txt"><b>${esc(L(["Nosič", "Porter"]))}${cena(pp) != null ? " · " + cena(pp) + " gr." : ""}</b>
          <small>${esc(L(["Po výpravě sám odnese, co se nevejde do batohu — domů, do podniku nebo do truhly v hostinci. Bez něj to jde jen prodat u brány.", "Carries home what does not fit."]))}</small></span></button>
      </div>
      <div class="row vp-start"><button class="btn primary big" id="vp-go"${VYP.loc && VYP.diff ? "" : " disabled"}>${esc(VYP.mode === "group" ? L(["Založit družinu", "Found the party"]) : L(["Vyrazit na výpravu", "Set out"]))}</button>
        <span class="muted small">${esc(VYP.loc && VYP.diff ? (VYP.guard || VYP.porter ? L(["Platí se při vyražení, za každého člena.", "Paid on departure, per member."]) : "") : L(["Vyber, kam a jak těžkou výpravu.", "Pick a place and a difficulty."]))}</span></div>
      <p class="dim small">${esc(L(["Stejnou výpravu můžeš kdykoli hrát i na Discordu.", "You can switch to Discord any time."]))}</p>
    </div>
    <p><button class="btn" data-go="misto/brana">← ${esc(t("back"))}</button></p><div id="vpanel"></div>`));
  mountLive(view);
  Zvuk.music(townMusic());
  if (!jeMobil() && innerWidth > 1100) view.classList.add("rozdel");   // r27-41: obraz vlevo, příprava vpravo
  vypListy(view);   // r27-12 telefon, r27-41 i PC: příprava po listech (Kdo · Kam · Obtížnost · Služby), bez scrollování
  vejdiObchod(".vyp-priprava .vp-list.on");   // r27-41: stránka se neposouvá — dlouhý list se posouvá jen uvnitř okna: na telefonu příprava po listech (Kdo · Kam · Obtížnost · Služby), bez scrollování
  const dal = (k) => { if (VYP.krok === k) VYP.krok = k + 1; };
  view.querySelectorAll("[data-mode]").forEach((b) => b.onclick = () => { VYP.mode = b.dataset.mode; dal(0); drawRaid(view); });
  view.querySelectorAll("[data-loc]").forEach((b) => b.onclick = () => { const camp = String(b.dataset.loc).includes("@"); VYP.loc = b.dataset.loc;
    const ma_tabory = (st.camps || []).some((c) => c.id.split("@")[0] === String(VYP.loc).split("@")[0]); if (camp || !ma_tabory) dal(1); drawRaid(view); });
  view.querySelectorAll("[data-diff]").forEach((b) => b.onclick = () => { VYP.diff = b.dataset.diff; dal(2); drawRaid(view); });
  view.querySelectorAll("[data-tier]").forEach((b) => b.onclick = () => { VYP.tier = b.dataset.tier; drawRaid(view); });
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
      if (!r.mission && r.panel) {   // 1.0-3-5: skutečný důvod (řádek ⚠️), ne informační řádek „Glejt: ne · 15 gr.“
        const rad = String(r.panel.content || "").split("\n"), varov = rad.find((x) => x.includes("⚠️")) || rad.find((x) => /Nemáš|nemáš|Nemá na/.test(x));
        toast(varov ? noEmoji(varov).replace(/\*\*/g, "").trim() : L(["Výpravu se nepodařilo spustit.", "Could not start."]));
      }
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
const VL_POPIS = { "Síla": ["útok a zranění zbraní na blízko, nošení těžké výbavy, výdrž v boji (půl bonusu)"], "Obratnost": ["útok a zranění střelbou, obrana (ne v těžké zbroji), uhýbání, iniciativa"],
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

/** 1.0-3-12: dílky roztrhané mapy — mřížka sloupce × řádky s roztřepenými trhlinami (stejné v deníku i ve skládačce). */
function dilkyMapy(key, cols, rows) {
  const seed = [...key].reduce((a, c) => a + c.charCodeAt(0), 7);
  const rnd = (() => { let s = seed * 7 + 3; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; })();
  const cara = (x0, n) => { const b = []; let vlna = 0;   // roztřepená hrana: velké zuby + drobná vlákna papíru
    for (let i = 0; i <= n; i++) { if (i % 6 === 0) vlna = (rnd() - 0.5) * 8; b.push(x0 + vlna + (rnd() - 0.5) * 2.6 + (i % 2 ? 0.9 : -0.9) * rnd()); } return b; };
  const V = [null], H = [null];
  for (let c = 1; c < cols; c++) V.push(cara(100 * c / cols, 60)); V.push(null);
  for (let r = 1; r < rows; r++) H.push(cara(100 * r / rows, 60)); H.push(null);
  const interp = (arr, t) => { const f = t / 100 * (arr.length - 1), i = Math.min(arr.length - 2, Math.max(0, Math.floor(f))); return arr[i] + (arr[i + 1] - arr[i]) * (f - i); };
  const Vx = (c, y) => c === 0 ? 0 : c === cols ? 100 : interp(V[c], y), Hy = (r, x) => r === 0 ? 0 : r === rows ? 100 : interp(H[r], x);
  const roh = (c, r) => { let y = Hy(r, Vx(c, 50)), x = 0; for (let k = 0; k < 6; k++) { x = Vx(c, y); y = Hy(r, x); } return [x, y]; };
  const kus = (c, r) => {
    const pts = [], N = 40, [ax, ay] = roh(c, r), [bx, by] = roh(c + 1, r), [cx, cy] = roh(c + 1, r + 1), [dx, dy] = roh(c, r + 1);
    for (let i = 0; i <= N; i++) { const x = ax + (bx - ax) * i / N; pts.push([x, Hy(r, x)]); }
    for (let i = 1; i <= N; i++) { const y = by + (cy - by) * i / N; pts.push([Vx(c + 1, y), y]); }
    for (let i = 1; i <= N; i++) { const x = cx + (dx - cx) * i / N; pts.push([x, Hy(r + 1, x)]); }
    for (let i = 1; i < N; i++) { const y = dy + (ay - dy) * i / N; pts.push([Vx(c, y), y]); }
    const sx = pts.reduce((a, p) => a + p[0], 0) / pts.length, sy = pts.reduce((a, p) => a + p[1], 0) / pts.length;
    return { cp: `polygon(${pts.map(([x, y]) => x.toFixed(2) + "% " + y.toFixed(2) + "%").join(",")})`, sx, sy };
  };
  const out = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) out.push(kus(c, r));
  return { dilky: out, rnd };
}
// 1.0-3-12: inkoustový křížek pokladu — je na tom útržku, kam padne (clip-path ho ořízne s dílkem)
const krizek = (u) => u.x ? `<i class="mapa-x" style="left:${u.x[0]}%;top:${u.x[1]}%">✕</i>` : "";
/** 1.0-3-10: útržky mapy jako skutečně roztrhaná malovaná mapa — co máš, je vidět, co chybí, je jen obrys. */
function roztrhanaMapa(u) {
  const treba = u.treba || 6, cols = u.sloupce || 3, rows = Math.ceil(treba / cols);
  const { dilky } = dilkyMapy(u.key, cols, rows);
  const ma = u.poklad ? treba : Math.min(u.n, treba);
  return `<div class="trh-mapa${u.poklad ? " cela" : ""}" style="aspect-ratio:${u.pomer}" title="${esc(u.name)}">${dilky.map((d, i) => {
    const je = i < ma, dx = ((i * 37) % 5 - 2) * 0.5, dy = ((i * 53) % 5 - 2) * 0.4, rot = ((i * 29) % 7 - 3) * 0.5;
    return `<div class="trh-kus${je ? " ma" : ""}" style="${je && !u.poklad && ma < treba ? `transform:translate(${dx}%,${dy}%) rotate(${rot}deg);transform-origin:${d.sx}% ${d.sy}%` : ""}"><div class="trh-vnitr" style="clip-path:${d.cp}"><img alt="" loading="lazy" src="${IMG_BASE}${u.obr}-m.webp">${krizek(u)}</div></div>`; }).join("")}</div>`;
}
function roztrhaneMapy(D) {
  const U = (D.utrzky_oblasti || []).filter((u) => u.obr && (u.n > 0 || u.poklad));
  if (!U.length) return "";
  return `<div class="trh-mapy">${U.map((u) => { const treba = u.treba || 6; return `<figure class="trh-karta">${roztrhanaMapa(u)}<figcaption><b>${esc(u.name)}</b><small>${esc(u.poklad
    ? L(["mapa pokladu je celá — místo je vyznačené na mapě oblasti", "treasure map complete"])
    : u.n >= treba ? L(["máš všechny útržky — slož si je dohromady", "all scraps — put them together"])
    : L(["útržky ", "scraps "]) + u.n + " / " + treba)}</small>${!u.poklad && u.n >= treba ? `<button class="btn primary small" data-sloz="${esc(u.key)}">${esc(L(["Složit mapu", "Assemble the map"]))}</button>` : ""}</figcaption></figure>`; }).join("")}</div>`;
}
/** 1.0-3-11: skládačka — útržky mapy se přetahují a otáčejí (klepnutím o 90°), dokud do sebe nezapadnou. */
function skladacka(u, hotovo) {
  const treba = u.treba || 6, cols = u.sloupce || 3, rows = Math.ceil(treba / cols);
  const { dilky, rnd } = dilkyMapy(u.key, cols, rows);
  const K = dilky.map((k) => {
    let dx = 0, dy = 0;
    for (let t = 0; t < 20 && Math.hypot(dx, dy) < 22; t++) { dx = 8 + 84 * rnd() - k.sx; dy = 12 + 76 * rnd() - k.sy; }   // rozházené po stole, ne na svém místě
    return { ...k, dx, dy, rot: [90, 180, 270, 0][Math.floor(rnd() * 4)], fix: false };
  });
  const o = document.createElement("div");
  o.className = "rekap-obal skl-obal";
  o.innerHTML = `<div class="rekap vyp-pergamen skl"><h2>${esc(L(["Slož mapu: ", "Assemble: "]) + u.name)}</h2>
    <p class="muted small">${esc(L(["Přetáhni útržky na místo, klepnutím je otočíš. Až do sebe všechny zapadnou, ukáže se poklad.", "Drag the scraps into place, tap to rotate."]))}</p>
    <div class="skl-plocha"><div class="skl-deska" style="aspect-ratio:${u.pomer}">${K.map((k, i) => `<div class="skl-kus" data-k="${i}" style="clip-path:${k.cp};transform-origin:${k.sx}% ${k.sy}%"><img alt="" draggable="false" src="${IMG_BASE}${u.obr}-m.webp">${krizek(u)}</div>`).join("")}</div></div>
    <p class="row" style="justify-content:center"><button class="btn" data-x>${esc(L(["Zavřít", "Close"]))}</button></p></div>`;
  document.body.appendChild(o);
  o.querySelector("[data-x]").onclick = () => o.remove();
  const deska = o.querySelector(".skl-deska"), els = [...o.querySelectorAll(".skl-kus")];
  o._K = K;
  let z = 10;
  const kresli = (i) => { const k = K[i], el = els[i]; el.style.transform = `translate(${k.dx}%,${k.dy}%) rotate(${k.rot}deg)`; el.classList.toggle("fix", k.fix); };
  K.forEach((_, i) => kresli(i));
  const zkus = (i) => { const k = K[i]; if (k.rot % 360 === 0 && Math.abs(k.dx) < 3.5 && Math.abs(k.dy) < 4.5) { k.dx = k.dy = 0; k.fix = true; Zvuk.sfx("klik"); } kresli(i);
    if (K.every((x) => x.fix)) { deska.classList.add("hotovo"); setTimeout(() => hotovo(o), 650); } };
  els.forEach((el, i) => {
    el.addEventListener("pointerdown", (ev) => {
      const k = K[i]; if (k.fix) return;
      ev.preventDefault(); el.setPointerCapture(ev.pointerId); el.style.zIndex = ++z;
      const r = deska.getBoundingClientRect(), x0 = ev.clientX, y0 = ev.clientY, dx0 = k.dx, dy0 = k.dy; let posun = false;
      const mv = (e) => { const ddx = e.clientX - x0, ddy = e.clientY - y0; if (Math.abs(ddx) + Math.abs(ddy) > 5) posun = true;
        k.dx = dx0 + 100 * ddx / r.width; k.dy = dy0 + 100 * ddy / r.height; kresli(i); };
      const up = () => { el.removeEventListener("pointermove", mv); el.removeEventListener("pointerup", up); el.removeEventListener("pointercancel", up);
        if (!posun) k.rot = (k.rot + 90) % 360; zkus(i); };
      el.addEventListener("pointermove", mv); el.addEventListener("pointerup", up); el.addEventListener("pointercancel", up);
    });
  });
}
/** 1.0-3-7: malovaná mapa oblasti s popisky míst, polohou družiny (●) a pokladem (✕). */
function malovanaMapa(mm, cela) {
  const mala = !cela && window.innerWidth < 760;
  const misto = (x) => `<span class="mm-misto mm-${x.kde}${x.tu ? " tu" : ""}${x.poklad ? " poklad" : ""}" style="left:${x.x}%;top:${x.y}%">`
    + `${x.tu ? `<i class="mm-tu" aria-label="${esc(L(["Jsi tady", "You are here"]))}"></i>` : ""}${x.poklad ? `<i class="mm-x">✕</i>` : ""}<b>${esc(x.name)}</b></span>`;
  return `<div class="mmapa${cela ? " cela" : ""}" style="aspect-ratio:${mm.pomer}"><img alt="${esc(mm.titul)}" src="${IMG_BASE}${mm.obr}${mala ? "-m" : ""}.webp">`
    + `<span class="mm-titul">${esc(mm.titul)}</span>${(mm.mista || []).map(misto).join("")}</div>`;
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
  box.innerHTML = `<div class="vmodal"><div class="panel${p.image || p.mapa ? " s-mapou" : ""}">${dmd(p.content)}${p.mapa ? `<div class="vmapa-nahled mm-nahled" title="${esc(L(["Klepni pro celou obrazovku", "Tap for full screen"]))}">${malovanaMapa(p.mapa)}</div>` : p.image ? `<img class="vmapa-nahled" src="${p.image}" alt="${esc(L(["Mapa oblasti", "Area map"]))}" title="${esc(L(["Klepni pro celou obrazovku", "Tap for full screen"]))}">` : ""}${controlsHtml(p.controls)}
    <div class="row" style="margin-top:10px"><button class="btn small" id="vclose">${esc(L(["Zavřít", "Close"]))}</button></div></div></div>`;
  $("#vclose").onclick = () => { RAID.panel = null; box.innerHTML = ""; };
  const mp = box.querySelector(".vmapa-nahled");
  if (mp) mp.onclick = () => { const o = document.createElement("div"); o.className = "vmapa-cela"; o.innerHTML = p.mapa ? malovanaMapa(p.mapa, true) : `<img src="${p.image}" alt="">`; o.onclick = () => o.remove(); document.body.appendChild(o); };
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
    <p class="row"><button class="btn" data-go="misto/brana">← ${esc(t("back"))}</button>
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
// r27-40: Ostatní na PC jako kniha se záložkami (jako deník) — vždy jeden list, bez posouvání stránky
const OSTATNI = { k: 0 };
function knihaOstatni(view) {
  if (jeMobil() || innerWidth <= 1100) return;
  const mriz = view.querySelector(".ostatni-mrizka"); if (!mriz) return;
  const napad = mriz.querySelector(".napad");
  if (napad) { const p = document.createElement("div"); p.className = "panel napad-panel"; const h3 = document.createElement("h3"); h3.textContent = L(["Nápad nebo chyba", "Idea or bug"]);
    napad.querySelector("h4")?.remove(); p.append(h3, napad); mriz.appendChild(p); }
  const listy = [...mriz.children].filter((x) => x.classList.contains("panel"));
  const RIM = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];
  const nazev = (p) => noEmoji(p.querySelector("h3")?.textContent || "").trim();
  const kniha = h(`<div class="denik-kniha ostatni-kniha">
    <header class="dk-hlava"><span class="pecet" aria-hidden="true">KS</span><div><small>${esc(L(["Královské stezky · nastavení a vše ostatní", "Royal Trails · settings and more"]))}</small><h2>${esc(L(["Ostatní", "More"]))}</h2></div></header>
    <div class="dk-telo"><div class="dk-strana ost-strana"></div><nav class="dk-zalozky">${listy.map((p, i) => `<button type="button" data-ost="${i}"><i>${RIM[i] || ""}</i>${esc(nazev(p))}</button>`).join("")}</nav></div></div>`).firstElementChild;
  const strana = kniha.querySelector(".ost-strana");
  listy.forEach((p) => { p.classList.add("ost-list"); strana.appendChild(p); });
  const ukaz = () => { OSTATNI.k = Math.min(OSTATNI.k, listy.length - 1); listy.forEach((p, i) => { p.hidden = i !== OSTATNI.k; });
    kniha.querySelectorAll("[data-ost]").forEach((b) => b.classList.toggle("on", Number(b.dataset.ost) === OSTATNI.k)); };
  kniha.querySelectorAll("[data-ost]").forEach((b) => b.onclick = () => { OSTATNI.k = Number(b.dataset.ost); Zvuk.sfx("stranka"); ukaz(); });
  mriz.replaceWith(kniha); ukaz();
  vejdiDoOkna(".ost-strana", 360);
}
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
      <label class="row"><input type="checkbox" id="snd-pozadi"${Zvuk.V.ztlumit_mimo ? " checked" : ""}> ${esc(L(["Ztlumit, když hra není vidět (jiný program, plocha, jiná karta)", "Mute when the game is in the background"]))}</label>
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
  $("#snd-pozadi").onchange = (e) => Zvuk.set("ztlumit_mimo", e.target.checked);   // r27-25
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
  knihaOstatni(view);   // r27-40: na PC jako kniha se záložkami
};

// ------------------------------------------------------------------ start
applyTexts();
// r27-5: bezpečnost — z odkazu (adresy) se jen otevře stránka; „panel/=…“ by rovnou zmáčklo tlačítko ve hře, to z odkazu nejde
if (location.hash.length > 1) { const z = decodeURIComponent(location.hash.slice(1)); if (!z.startsWith("panel/=")) store.set("tab", z); else history.replaceState(null, "", location.pathname + location.search); }
window.addEventListener("popstate", () => { if (S.token && S.me) go(decodeURIComponent(location.hash.slice(1)) || "mesto", true); });
let skrytoOd = 0;
document.addEventListener("visibilitychange", () => { if (document.visibilityState !== "visible") skrytoOd = Date.now(); });
window.addEventListener("online", () => { spojeniObnov(); if (S.token && S.me) call("me", {}, true).then(() => render()).catch(() => {}); });
window.addEventListener("pageshow", (e) => { if (e.persisted) { spojeniObnov(); if (S.token && S.me) call("me", {}, true).then(() => render()).catch(() => {}); } });
document.addEventListener("visibilitychange", () => {      // po návratu na kartu načíst čerstvý stav (mohl hrát na Discordu)
  if (document.visibilityState === "visible" && skrytoOd && Date.now() - skrytoOd > 3000) spojeniObnov();   // r27-24: z pozadí — visící dotazy pryč
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
    if (f.stage === "fight" && /^[1-3]$/.test(k)) { clearTimeout(MINI.ryCas); miniAct(f.actions[+k - 1].cid); }
    const sip = { ArrowLeft: "povolit", ArrowUp: "pritahnout", ArrowDown: "drzet" }[k];
    if (f.stage === "fight" && sip) { e.preventDefault(); const b = MINI.el.querySelector(`.mh-ryba.boj [data-k="${sip}"]`); if (b) b.click(); }
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
  const pick = MINI.el.querySelector(".zk-valec"); if (pick) { pick.classList.remove("tlak"); void pick.getBoundingClientRect(); pick.classList.add("tlak"); }
  Zvuk.sfx("klik");
  setTimeout(() => miniAct(L_.prefix + n), 260);
}

// 1.0-1: páčení ve stylu KCD — paklíč vedeš myší (nebo šipkami) po obvodu zámku, podržením / mezerníkem otočíš zámkem.
// Sektor 1–9 = poloha kolíku; zámek ukáže, jak blízko jsi byl (žhne / hřeje / studí). Pravidla počítá server jako dřív.
const ZK_SEKT = 9, ZK_OD = 200, ZK_ROZ = 140;          // sektory v horním oblouku zámku: od 200° po 340° (ve stupních SVG)
const zkUhel = (n) => ZK_OD + (n - 0.5) * ZK_ROZ / ZK_SEKT;
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
  const otoceni = idx / Math.max(1, Z.pins) * 90;
  const bod = (deg, r) => [150 + r * Math.cos(deg * Math.PI / 180), 150 + r * Math.sin(deg * Math.PI / 180)];
  const sektor = (n) => { const a0 = ZK_OD + (n - 1) * ZK_ROZ / ZK_SEKT + 1, a1 = ZK_OD + n * ZK_ROZ / ZK_SEKT - 1;
    const [x0, y0] = bod(a0, 136), [x1, y1] = bod(a1, 136), [x2, y2] = bod(a1, 112), [x3, y3] = bod(a0, 112);
    const f = tried[n], ne = !f && filtr && !Z.cands.includes(n), hint = Z.hint && n >= Z.hint[0] && n <= Z.hint[1];
    return `<path class="zk-sek${f ? " " + f : ""}${ne ? " ne" : ""}${hint ? " tip" : ""}" data-n="${n}" d="M${x0},${y0} A136,136 0 0 1 ${x1},${y1} L${x2},${y2} A112,112 0 0 0 ${x3},${y3} Z"/>`; };
  const posl = Z.last === "hit" ? `<p class="zk-zprava ok">${esc(L([`Cvak! Kolík ${idx} zapadl.`, `Click! Pin ${idx} set.`]))}</p>`
    : Z.last ? `<p class="zk-zprava ${Z.last}">${esc(L(FEEL_TXT[Z.last]))}</p>` : `<p class="zk-zprava">${esc(L(["Veď paklíč po oblouku a hledej místo, kde zámek povolí.", "Guide the pick along the arc."]))}</p>`;
  MINI.el.innerHTML = `<div class="mh mh-zamek kcd${novyKolik ? " cvak" : ""}">${miniBg(Z.src === "burgle" ? "vloupani" : "zamek")}
    <header class="mh-hlava"><h2>${esc(Z.src === "burgle" ? L(["Cizí truhla", "Someone's chest"]) : L(["Zamčená truhla", "Locked chest"]))}</h2>
      <div class="mh-cisla"><span title="${esc(L(["Pokusy", "Tries"]))}">${esc(L(["pokusy ", "tries "]))}<b>${Z.left}</b></span><span title="${esc(L(["Šperháky", "Lockpicks"]))}">${esc(L(["paklíče ", "picks "]))}<b>${Z.picks}</b></span></div></header>
    <div class="zk-kcd">
      <svg class="zk-kruh${chyba ? " trhl" : ""}" viewBox="0 0 300 300" aria-hidden="true">
        <defs><radialGradient id="zkMosaz" cx="40%" cy="35%"><stop offset="0" stop-color="#e9cf8a"/><stop offset=".55" stop-color="#9c7a3a"/><stop offset="1" stop-color="#4a3416"/></radialGradient>
          <radialGradient id="zkZelezo" cx="45%" cy="40%"><stop offset="0" stop-color="#6b6f76"/><stop offset="1" stop-color="#1e2024"/></radialGradient></defs>
        <circle cx="150" cy="150" r="146" fill="url(#zkZelezo)" stroke="#0c0c0e" stroke-width="4"/>
        ${Array.from({ length: 12 }, (_, i) => { const [x, y] = bod(i * 30 + 15, 128); return `<circle cx="${x}" cy="${y}" r="4" fill="#9aa0a8" stroke="#202226"/>`; }).join("")}
        ${Array.from({ length: ZK_SEKT }, (_, i) => sektor(i + 1)).join("")}
        <g class="zk-valec" style="transform:rotate(${otoceni}deg)">
          <circle cx="150" cy="150" r="98" fill="url(#zkMosaz)" stroke="#3a2a10" stroke-width="3"/>
          <circle cx="150" cy="150" r="80" fill="none" stroke="#6b5226" stroke-width="2" stroke-dasharray="4 6"/>
          <path d="M150 104 a18 18 0 0 1 10 33 l7 46 h-34 l7 -46 a18 18 0 0 1 10 -33z" fill="#120c06" stroke="#3a2a10" stroke-width="2"/>
        </g>
        <g class="zk-pak${zlomil ? " zlom" : ""}" style="transform:rotate(${zkUhel(MINI.sel) - 270}deg)">
          <rect x="146" y="20" width="8" height="122" rx="2" fill="url(#zkZelezo)" stroke="#b9bec5" stroke-width="1"/>
          <path d="M146 20 h8 v-10 h10 v6 h-4 v8 h-14z" fill="#4b4f55" stroke="#b9bec5" stroke-width="1"/>
        </g>
      </svg>
      <div class="zk-koliky">${Array.from({ length: Z.pins }, (_, i) => `<i class="${i < idx ? "ok" : i === idx ? "ted" : ""}"></i>`).join("")}</div>
      <div class="zk-napeti"><i style="width:${Math.max(0, Math.min(100, 100 * Z.left / Math.max(Z.left, (P && P.left) || Z.left, 6)))}%"></i><small>${esc(L(["vydrž paklíče", "pick strain"]))}</small></div>
    </div>
    ${posl}${zlomil ? `<p class="zk-zprava zlom">${esc(L(["Paklíč praskl!", "The lockpick snapped!"]))}</p>` : ""}
    ${Z.hint ? `<p class="mh-pozn">${esc(L([`Všímavost: kolík je v úseku ${Z.hint[0]}–${Z.hint[1]} (zvýrazněno).`, `Perception: the pin is in ${Z.hint[0]}–${Z.hint[1]}.`]))}</p>` : ""}
    <div class="mh-ovl"><button class="btn primary big" data-zkus>${esc(L(["Otočit zámkem", "Turn the lock"]))}</button>
      <button class="btn" data-pryc>${esc(Z.src === "burgle" ? L(["Utéct", "Run"]) : L(["Nechat truhlu být", "Leave the chest"]))}</button></div>
    <p class="mh-leg">${esc(L(["Myš nebo šipky vedou paklíč po oblouku, klik na zámek nebo mezerník otočí. Žhavé = hned vedle · teplé = blízko · studené = daleko · zašedlé už nedává smysl.",
      "Mouse or arrows guide the pick, click the lock or press space to turn. Hot = next to it · warm = close · cold = far."]))}${Z.src === "burgle" ? " " + esc(L(["Každá chyba dělá hluk.", "Every miss makes noise."])) : ""}</p></div>`;
  const svg = MINI.el.querySelector(".zk-kruh"), pak = MINI.el.querySelector(".zk-pak");
  const nastav = (n) => { if (n < 1 || n > ZK_SEKT || tried[n] || (filtr && !Z.cands.includes(n))) return; MINI.sel = n; pak.style.transform = `rotate(${zkUhel(n) - 270}deg)`;
    MINI.el.querySelectorAll(".zk-sek").forEach((p) => p.classList.toggle("vyb", +p.dataset.n === n)); };
  nastav(MINI.sel);
  svg.addEventListener("pointermove", (e) => { const r = svg.getBoundingClientRect(); let a = Math.atan2(e.clientY - r.top - r.height / 2, e.clientX - r.left - r.width / 2) * 180 / Math.PI; if (a < 0) a += 360;
    if (a < ZK_OD - 20 && a > 90) a = ZK_OD; if (a <= 90) a = ZK_OD + ZK_ROZ;   // pod zámkem: k bližšímu konci oblouku
    nastav(Math.max(1, Math.min(ZK_SEKT, Math.floor((a - ZK_OD) / (ZK_ROZ / ZK_SEKT)) + 1))); });
  svg.addEventListener("click", () => miniZkus(MINI.sel));
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
    <div class="ry-cas" title="${esc(L(["Čas na reakci", "Time to react"]))}"><i></i></div>
    <div class="mh-volby tri">${f.actions.map((a, i) => `<button class="mh-volba" data-cid="${esc(a.cid)}" data-k="${a.k}"><span class="ic">${ikona[a.k]}</span><b>${esc(a.n)}</b><small>${{ povolit: "←", pritahnout: "↑", drzet: "↓" }[a.k] || i + 1}</small></button>`).join("")}</div>
    <p class="mh-leg">${esc(L(["Na rozhodnutí máš chvilku — když nestihneš, prostě držíš. Šipky: ← povolit · ↑ přitáhnout · ↓ držet. ", "React in time or you just hold. "]))}${esc(L(["Utíká nebo skáče → povol. Je unavená nebo u dna → přitáhni. Míří ke kořenům nebo k tobě → drž.", "Runs or jumps → let out. Tired or deep → reel in. Heads for roots or to you → hold."]))}</p></div>`;
  MINI.el.querySelectorAll("[data-cid]").forEach((b) => b.onclick = () => { clearTimeout(MINI.ryCas); miniAct(b.dataset.cid, b); });
  clearTimeout(MINI.ryCas);                     // 1.0-1: odpočet — kdo nestihne, drží prut (a ryba se může utrhnout)
  const tC = Math.max(2600, 4200 - f.round * 300);
  const pr = MINI.el.querySelector(".ry-cas i"); if (pr) { pr.style.animationDuration = tC + "ms"; }
  MINI.ryCas = setTimeout(() => { const d = MINI.el && MINI.el.querySelector('.mh-ryba.boj [data-k="drzet"]'); if (d && MINI.kind === "fish") d.click(); }, tC);
  if (chyba) Zvuk.sfx("odrazeno");
}

// ---------------------------------------------------------------- lov
function miniStrel(e) {
  const sc = MINI.el && MINI.el.querySelector(".lv-scena");
  const zam = sc && sc.querySelector(".lv-zamer"), zv = sc && sc.querySelector(".lv-zvire");
  if (zam && zv && zam.dataset.kyv) {            // 1.0-1: zaměřovač se chvěje — střílí se, jen když míří na zvíře
    const a = zam.getBoundingClientRect(), b = zv.getBoundingClientRect(), cx = a.left + a.width / 2, cy = a.top + a.height / 2;
    const vnitr = cx > b.left + b.width * 0.22 && cx < b.right - b.width * 0.22 && cy > b.top + b.height * 0.2 && cy < b.bottom - b.height * 0.25;
    if (!vnitr) { sc.classList.remove("vedle"); void sc.offsetWidth; sc.classList.add("vedle"); toast(L(["Ruka se třese — míříš vedle. Počkej, až zaměřovač sedne na zvíře.", "Your aim is off — wait for the sight to settle on the animal."])); return; }
    cancelAnimationFrame(MINI.kyv);
  }
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
  const zm = MINI.el.querySelector(".lv-zamer");
  cancelAnimationFrame(MINI.kyv);
  if (zm) {                                      // chvění zaměřovače (Lissajous), s dovedností se zklidní
    zm.dataset.kyv = "1"; const t0 = performance.now(), amp = 22;
    const krok = (t) => { if (!zm.isConnected) return; const u = (t - t0) / 1000;
      zm.style.left = (50 + amp * Math.sin(u * 1.7) * Math.cos(u * 0.6)) + "%"; zm.style.top = (50 + amp * 0.7 * Math.sin(u * 2.3 + 1)) + "%";
      MINI.kyv = requestAnimationFrame(krok); };
    MINI.kyv = requestAnimationFrame(krok);
  }
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

// r27-24: na telefonu přejetí prstem do strany = další / předchozí záložka spodní lišty (Město · Postava · Batoh · Mazlíček · Deník · Ostatní)
(() => {
  let x0 = 0, y0 = 0, t0 = 0, ok = false;
  const PORADI = () => [...document.querySelectorAll(".tabs button[data-tab]")].filter((b) => !b.hidden && b.dataset.tab !== "admin").map((b) => b.dataset.tab);
  const zakaz = (el) => !el || el.closest("input,textarea,select,.vmodal,.minihra,.rekap-obal,.vmapa-cela,.m-zalozky,.obchod-prepinac,.vp-zal,.hk-zalozky,.vyp-lista,#erb-cv,.tahni,canvas,[data-noswipe]")
    || [...(function* () { let e = el; while (e && e !== document.body) { yield e; e = e.parentElement; } })()].some((e) => e.scrollWidth > e.clientWidth + 4 && /(auto|scroll)/.test(getComputedStyle(e).overflowX));
  document.addEventListener("touchstart", (e) => {
    ok = jeMobil() && e.touches.length === 1 && !document.documentElement.classList.contains("bez-menu") && !zakaz(e.target);
    if (!ok) return;
    x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; t0 = Date.now();
  }, { passive: true });
  document.addEventListener("touchend", (e) => {
    if (!ok) return; ok = false;
    const t = e.changedTouches[0], dx = t.clientX - x0, dy = t.clientY - y0;
    if (Date.now() - t0 > 700 || Math.abs(dx) < 70 || Math.abs(dx) < Math.abs(dy) * 1.8) return;
    const p = PORADI(), hlavni = TAB_OF[S.tab] || S.tab, i = p.indexOf(hlavni);
    if (i < 0) return;
    const n = p[i + (dx < 0 ? 1 : -1)];
    if (!n) return;
    Zvuk.sfx("stranka");
    go(n);
  }, { passive: true });
})();
