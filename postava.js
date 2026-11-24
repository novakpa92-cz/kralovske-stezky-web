/* Královské stezky — postava složená z vrstev (r26-2).
   Všechny vrstvy mají stejné plátno 1024 × 1536 a sedí na tělo muže nebo ženy (repo grafiky img/postava/).
   Pořadí: tělo → oděv → zbroj → opasek → zbraň a pěst → plášť → batoh → vlasy → helma → vousy → štít (vždy navrch). */
"use strict";

const Postava = (() => {
  const BATOH_HOTOVY = true;    // r27-3: brašna přes rameno (dřívější batoh vypadal jako šle)
  const slug = (s) => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const ODEV = { "Lněná košile": ["muz", "lnena-kosile"], "Suknice": ["muz", "suknice"], "Vlněný kabátec": ["muz", "vlneny-kabatec"], "Kožich": ["muz", "kozich"],
    "Lněná košilka": ["zena", "lnena-kosilka"], "Šaty": ["zena", "saty"], "Vlněné šaty": ["zena", "vlnene-saty"], "Kožíšek": ["zena", "kozisek"] };
  const PAIR = { "lnena-kosile": "lnena-kosilka", "suknice": "saty", "vlneny-kabatec": "vlnene-saty", "kozich": "kozisek" };
  const ZBROJ = { "Brigantina": "brigantina", "Gotický plát": "goticky-plat", "Kapitánova brigantina": "kapitanova-brigantina", "Kožená zbroj": "kozena",
    "Kroužková zbroj": "krouzkova", "Plát Černého rytíře": "cerny-plat", "Plátová zbroj": "platova", "Plátový kyrys": "platovy-kyrys",
    "Prošívaná zbroj": "prosivana", "Purkrabího brigantina": "purkrabiho-brigantina", "Zbroj z medvědí kůže": "medvedi" };
  const HELMA = { "Batvat": "batvat", "Havířská helma": "havirska", "Kroužková kukla": "krouzkova-kukla", "Helmice": "helmice", "Kapalín": "kapalin",
    "Rytířský helm": "rytirsky-helm", "Nosová přilba": "nosova", "Bascinet": "bascinet", "Velká přilba": "velka" };
  const HELMA_JEN_MUZ = new Set(["batvat", "havirska"]);           // ženská verze zatím není — použije se mužská
  const SKRYJE_VLASY = new Set(["krouzkova-kukla", "bascinet", "velka", "rytirsky-helm"]);
  const SKRYJE_VOUSY = new Set(["velka", "rytirsky-helm"]);
  // Pod otevřenou helmou se vlasy nad okrajem helmy schovají (jinak by trčely nad kovem). Hodnota = řádek okraje na plátně 1536.
  const OKRAJ = { "kapalin": 185, "helmice": 185, "nosova": 185, "batvat": 172, "havirska": 172 };
  const PLAST = { "Cestovní plášť": "cestovni", "Lehký plášť": "lehky", "Vlněný plášť s kápí": "vlneny-s-kapi" };
  const SVETLO = { "Louč": "louc", "Lucerna": "lucerna" };
  const VLASY = { "Krátké": "kratke", "Střední": "stredni", "Dlouhé": "dlouhe", "Ofina": "ofina", "Kudrnaté": "kudrnate", "Copánek": "copanek", "Tonzura": "tonzura" };
  const VOUSY = { "Strniště": "strniste", "Knírek": "knirek", "Bradka": "bradka", "Knír s bradkou": "knir-s-bradkou", "Plnovous": "plnovous",
    "Dlouhý vous": "dlouhy", "Rozdvojený vous": "rozdvojeny" };
  // Vrstvy vlasů a vousů jsou malované hnědě; ostatní barvy dělá filtr.
  const BARVA = { "Černá": "brightness(.42) saturate(.55) contrast(1.15)", "Hnědá": "none", "Světlá": "sepia(.35) saturate(.9) brightness(1.75) contrast(.92)",
    "Zrzavá": "sepia(.4) saturate(1.9) hue-rotate(-14deg) brightness(1.08)", "Šedá": "grayscale(1) brightness(1.55) contrast(.9)" };
  const STAVBA = { "Hubená": .94, "Normální": 1, "Široká": 1.07, "Svalnatá": 1.04 };
  const VYSKA = { "Nízká": .95, "Normální": 1, "Vysoká": 1.04 };
  const STIT = { "Lehký dřevěný štít": "stit-lehky-dreveny", "Těžký dřevěný štít": "stit-tezky-dreveny", "Pavéza": "stit-paveza",
    "Okovaný štít": "stit-okovany", "Rytířský štít": "stit-rytirsky" };
  // r27-4: zbraně, které postava drží v ruce (vrstvy zbran-ruka-<slug>-<sx>); luk drží levá, ostatní pravá
  const ZBRAN_RUKA = Object.fromEntries(["dlouhy-mec", "kratky-mec", "jeskuv-mec", "cepel-cerneho-rytire", "bastard", "dvourucni-mec", "savle", "tesak",
    "krysaruv-tesak", "dyka", "palcat", "hejtmanuv-palcat", "sekyrka", "valecne-kladivo", "dutohlavova-sekera", "prak", "halapartna", "kopi", "sudlice",
    "vidle", "kosa", "cep", "obourucni-sekera", "obourucni-kladivo", "lehka-kuse", "tezka-kuse", "arbalest", "hakovnice", "pistala"].map((k) => [k, "prava"])
    .concat(["dlouhy-luk", "kratky-luk", "kompozitni-luk"].map((k) => [k, "luk"])));

  /** Seznam vrstev [{src, filter, cls}] pro postavu z API (me). */
  function layers(me, base) {
    const L = me.looks || {}, fem = L["pohlaví"] === "Žena", sx = fem ? "zena" : "muz";
    const eq = {}, bar = {};
    (me.equipped || []).forEach((e) => { eq[e.slot] = e.id; bar[e.slot] = e.color || ""; });   // r27-6: barva látky vybraná při nákupu
    const P = (n) => base + "postava/" + n + ".webp";
    // r27-6: nářadí, které hráč nese — lopata a krumpáč křížem na zádech (za tělem), nůž a sekera za opaskem
    const nese = (n) => ((me.inventory || {})[n] || 0) > 0;
    const zada = [nese("Krumpáč") && "krumpac", nese("Lopata") && "lopata"].filter(Boolean).join("-");
    const out = [...(zada ? [{ src: P("naradi-zada-" + zada), cls: "zada" }] : []), { src: P("postava-telo-" + sx), cls: "telo" }];
    const od = ODEV[eq["oděv"]];
    let odKey = od ? (od[0] === sx ? od[1] : fem ? PAIR[od[1]] || od[1] : Object.keys(PAIR).find((k) => PAIR[k] === od[1]) || od[1]) : "";
    // r27-3: ženský kožíšek (kabátek se širokou sukní) pod plátem a kyrysem nesedí — pod nimi je vidět jen sukně, tak se kreslí vlněné šaty
    if (fem && odKey === "kozisek" && ["platova", "goticky-plat", "cerny-plat", "platovy-kyrys"].includes(ZBROJ[eq.zbroj])) odKey = "vlnene-saty";
    if (odKey) out.push({ src: P("odev-" + sx + "-" + odKey), cls: "odev", bar: bar["oděv"] });
    if (fem && ZBROJ[eq.zbroj]) out.push({ src: P("nohy-zena-" + (odKey || "bez")), cls: "nohy" });   // r27-3: žena ve zbroji má nohavice a boty
    // r27-6: pod kožešinou (zbroj z medvědí kůže) vede popruh brašny pod ní, ne přes ni
    const batohPodZbroji = me.gear?.batoh && BATOH_HOTOVY && ZBROJ[eq.zbroj] === "medvedi" && !PLAST[eq["plášť"]];
    if (batohPodZbroji) out.push({ src: P((me.gear.batoh === "Velký batoh" ? "batoh-velky" : "batoh") + (fem ? "-zena" : "")), cls: "batoh" });
    if (ZBROJ[eq.zbroj]) out.push({ src: P("zbroj-" + sx + "-" + ZBROJ[eq.zbroj]), cls: "zbroj", pod: odKey ? sx + "-" + odKey : "" });
    if (nese("Lovecký nůž")) out.push({ src: P("naradi-pas-nuz"), cls: "naradi" });   // r27-6: nůž za lucernou a opaskem, šikmo
    if (nese("Sekera")) out.push({ src: P("naradi-pas-sekera"), cls: "naradi" });     // topůrko za opaskem a brašnou
    if (eq["světlo"] === "Lucerna") out.push({ src: P("svetlo-lucerna-pas"), cls: "svetlo" });   // r27-6: úchyt lucerny je pod opaskem — visí na něm
    if (me.gear?.opasek) out.push({ src: P("opasek-kozeny"), cls: "opasek" });
    // r27-6: sekera — hlavice přes opasek a malou brašnu, topůrko za nimi (velký batoh, plášť a štít ji zakryjí)
    const sekeraHlava = () => { if (nese("Sekera")) out.push({ src: P("naradi-pas-sekera-hlava"), cls: "naradi" }); };
    if (!me.gear?.batoh || !BATOH_HOTOVY) sekeraHlava();
    // r27-4: zbraň, štít a louč v rukou — sevřená pěst přes rukojeť; otevřenou dlaň těla (a kovovou rukavici zbroje) schová maska „ruka-dlan“
    const zb = ZBRAN_RUKA[slug(eq["zbraň"] || "")], st = STIT[eq["štít"]];
    const pravaZb = zb && zb !== "luk", levaZb = zb === "luk", louc = eq["světlo"] === "Louč" && !st && !levaZb;
    const kov = !fem && ["platova", "goticky-plat", "cerny-plat"].includes(ZBROJ[eq.zbroj]);
    const pest = (strana) => ({ src: P((kov ? "rukavice" : "ruka") + "-pest-" + strana + (kov ? "-muz" : "-" + sx)), cls: "pest",
      filter: kov && ZBROJ[eq.zbroj] === "cerny-plat" ? "brightness(.32) saturate(.4)" : "none" });
    if (pravaZb) out.push({ src: P("ruka-dlan-prava-" + sx), cls: "dlan" }, { src: P("zbran-ruka-" + slug(eq["zbraň"]) + "-" + sx), cls: "zbran" }, pest("prava"));
    if (levaZb || st || louc) out.push({ src: P("ruka-dlan-leva-" + sx), cls: "dlan" });
    if (levaZb) out.push({ src: P("zbran-ruka-" + slug(eq["zbraň"]) + "-" + sx), cls: "zbran" }, pest("leva"));
    if (louc) out.push({ src: P("svetlo-louc-ruka-" + sx), cls: "svetlo ohen" }, pest("leva"));
    const helm = HELMA[eq.hlava];
    const hair = L.vlasy === "Bez vlasů" ? null : (VLASY[L.vlasy] || "kratke");   // r27-6: tělo je holé, vlasy nese jen vrstva účesu
    const kape = PLAST[eq["plášť"]] === "vlneny-s-kapi";          // r27-3: v kápi je hlava uvnitř — vlasy pod kápí, ne přes ni
    const vlasy = () => { if (hair && !helm) out.push({ src: P("vlasy-" + sx + "-" + hair), filter: BARVA[L["barva vlasů"]] || "none", cls: "vlasy",
      clip: OKRAJ[helm] ? `inset(${((OKRAJ[helm] + (fem ? 3 : 0)) / 15.36).toFixed(2)}% 0 0 0)` : "", maskIn: kape ? P("plast-vlneny-s-kapi-vlasy") : "" });
      if (hair === "tonzura" && !fem && !helm) out.push({ src: P("vlasy-muz-tonzura-kuze"), cls: "kuze", maskIn: kape ? P("plast-vlneny-s-kapi-vlasy") : "" }); };   // r27-6: lysina se nebarví s vlasy
    const helma = () => { if (helm) out.push({ src: P("helma-" + helm + (fem && !HELMA_JEN_MUZ.has(helm) ? "-zena" : "")), cls: "helma",
      maskIn: kape ? P(helm === "kapalin" ? "plast-vlneny-s-kapi-vlasy" : "plast-vlneny-s-kapi-helma") : PLAST[eq["plášť"]] ? P("plast-muz-" + PLAST[eq["plášť"]] + "-helma") : "" }); };   // r27-3: bez kápě se helma (závěs) schová pod plášť   // r27-3: helma v kápi — co trčí z kápě ven, se nekreslí
    // r27-3: pravidlo vnoření — co je pod pláštěm, je pod ním: brašna (řemen), helma i vlasy v kápi
    const brasna = () => { const velky = me.gear.batoh === "Velký batoh"; if (velky) sekeraHlava();
      out.push({ src: P((velky ? "batoh-velky" : "batoh") + (fem ? "-zena" : "")), cls: "batoh" }); if (!velky) sekeraHlava(); };
    if (me.gear?.batoh && BATOH_HOTOVY && PLAST[eq["plášť"]]) brasna();
    if (kape) vlasy();
    if (kape) helma();                                             // r27-3: v kápi je helma pod pláštěm, jinak přes něj (plášť má výřez krku)
    if (PLAST[eq["plášť"]]) out.push({ src: P("plast-muz-" + PLAST[eq["plášť"]]), cls: "plast", bar: bar["plášť"] });   // ženské pláště nekryly ruce — mužské sedí na obě těla
    if (me.gear?.batoh && BATOH_HOTOVY && !PLAST[eq["plášť"]] && !batohPodZbroji) brasna();
    if (batohPodZbroji) sekeraHlava();
    if (!kape) vlasy();
    if (!kape) helma();
    const beard = !fem && VOUSY[L.vousy];
    if (beard && !SKRYJE_VOUSY.has(helm)) out.push({ src: P("vousy-" + beard), filter: BARVA[L["barva vousů"]] || "none", cls: "vousy" });
    if (st) out.push({ src: P("stit-ruka-" + st.replace(/^stit-/, "") + "-" + sx), cls: "stit" });   // r27-4: štít vždy navrch přes všechny vrstvy (i plášť, brašnu a vousy)
    return out;
  }

  /* Stavba a výška bez deformace hlavy. Vrstvy se složí na plátno a pak se překreslí po řádcích:
     hlava zůstane, pod krkem se tělo plynule roztáhne do šířky (kx) a do výšky od chodidel (ky),
     hlava se posune přesně o změnu výšky těla. Řádky v px plátna 1024 × 1536. Dokud se plátno
     nevykreslí (nebo kdyby obrázek nešel načíst), ukazují se vrstvy prostě zvětšené. */
  const W = 1024, H = 1536, KRK_OD = 250, KRK_DO = 330;
  const fronta = new Map(), hotove = new Map();
  let fid = 0;
  function stavba(me, base, imgs, kx, ky) {
    const id = "fig" + (++fid);
    fronta.set(id, { list: layers(me, base), kx, ky, base });
    setTimeout(() => malovat(id), 0);
    return `<div class="pas"${kx !== 1 || ky !== 1 ? ` style="transform:scale(${kx},${ky})"` : ""}>${imgs}</div><canvas class="figura-platno" id="${id}" width="${W}" height="${H}" hidden></canvas>`;
  }
  let skryvaP = null;
  const skryva = (base) => skryvaP || (skryvaP = fetch(base + "postava/skryva.json", { cache: "no-cache" })
    .then((r) => r.ok ? r.json() : {}).then((a) => ({ o: new Set(a.obleceni || []), t: new Set(a.telo || []) }))
    .catch(() => ({ o: new Set(), t: new Set() })));
  let barvyP = null;
  const barvyJson = (base) => barvyP || (barvyP = fetch(base + "postava/barvy.json", { cache: "no-cache" }).then((r) => r.ok ? r.json() : {}).catch(() => ({})));
  function obarvi(im, maska, hex, jas) {
    const c = document.createElement("canvas"); c.width = W; c.height = H;
    const x = c.getContext("2d", { willReadFrequently: true }); x.drawImage(im, 0, 0, W, H);
    const d = x.getImageData(0, 0, W, H), p = d.data;
    const m = document.createElement("canvas"); m.width = W; m.height = H;
    const mx = m.getContext("2d", { willReadFrequently: true }); mx.drawImage(maska, 0, 0, W, H);
    const md = mx.getImageData(0, 0, W, H).data;
    const D = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
    for (let i = 0; i < p.length; i += 4) {
      const w = md[i] / 255;
      if (w <= 0 || !p[i + 3]) continue;
      const t = (p[i] * .299 + p[i + 1] * .587 + p[i + 2] * .114) / 255 / jas;
      for (let k = 0; k < 3; k++) {
        const cil = t <= 1 ? D[k] * t : D[k] + (1 - D[k]) * Math.min(t - 1, 1) * .35;
        p[i + k] = p[i + k] * (1 - w) + Math.min(1, cil) * 255 * w;
      }
    }
    x.putImageData(d, 0, 0);
    return c;
  }
  function vlasyBezZare(im, filtr) {
    const c = document.createElement("canvas"); c.width = W; c.height = H;
    const x = c.getContext("2d", { willReadFrequently: true }); x.filter = filtr; x.drawImage(im, 0, 0, W, H); x.filter = "none";
    const d = x.getImageData(0, 0, W, H), p = d.data;
    for (let i = 3; i < p.length; i += 4) { const a = p[i]; if (a && a < 250) p[i] = Math.round(255 * Math.pow(a / 255, 2.4)); }
    x.putImageData(d, 0, 0);
    c.predbarveno = true;
    return c;
  }
  const nacti = (src) => new Promise((ok, chyba) => { const i = new Image(); i.crossOrigin = "anonymous"; i.decoding = "async"; i.onload = () => ok(i); i.onerror = chyba; i.src = src; });
  async function malovat(id) {
    const job = fronta.get(id); fronta.delete(id);
    const cv = document.getElementById(id);
    if (!job || !cv) return;
    const klic = JSON.stringify([job.list, job.kx, job.ky]);
    const hotovo = () => { cv.hidden = false; const p = cv.previousElementSibling; if (p) p.style.visibility = "hidden"; };
    if (hotove.has(klic)) { cv.getContext("2d").drawImage(hotove.get(klic), 0, 0); hotovo(); return; }
    // masky „schová pod sebou“ (seznam v img/postava/skryva.json, maska <díl>-skryva.webp)
    const sez = await skryva(job.base);
    const jmeno = (src) => src.split("/").pop().replace(/\.webp$/, "");
    // r27-3: zbroj může mít masku přímo pro oděv pod ní (<zbroj>__<oděv>-skryva.webp), jinak obecnou
    const jm = (l) => l.pod && sez.o.has(jmeno(l.src) + "__" + l.pod) ? jmeno(l.src) + "__" + l.pod : jmeno(l.src);
    const cesta = (l, suf) => l.src.replace(/[^/]+\.webp$/, jm(l) + suf);
    const masky = job.list.map((l, i) => i > 0 && l.cls !== "telo" && sez.o.has(jm(l)) ? cesta(l, "-skryva.webp") : null);
    const maskyT = job.list.map((l, i) => i > 0 && l.cls !== "telo" && sez.t.has(jm(l)) ? cesta(l, "-skryva-telo.webp") : null);
    const barvit = job.list.map((l) => l.bar ? l.src.replace(/\.webp$/, "-barva.webp") : null);
    const barveneVlasy = job.list.map((l) => !!(l.filter && l.filter !== "none" && /vlasy|vousy/.test(l.cls || "")));
    if (job.kx === 1 && job.ky === 1 && !masky.some(Boolean) && !maskyT.some(Boolean) && !barvit.some(Boolean) && !barveneVlasy.some(Boolean)) return;   // nic k úpravě: zůstanou obyčejné vrstvy
    let obr, mobr, tobr;
    try {
      obr = await Promise.all(job.list.map((l) => nacti(l.src)));
      mobr = await Promise.all(masky.map((m) => m ? nacti(m).catch(() => null) : null));
      tobr = await Promise.all(maskyT.map((m) => m ? nacti(m).catch(() => null) : null));
      var vobr = await Promise.all(job.list.map((l) => l.maskIn ? nacti(l.maskIn).catch(() => null) : null));
      var bobr = await Promise.all(barvit.map((m) => m ? nacti(m).catch(() => null) : null));
      var jasy = barvit.some(Boolean) ? (await barvyJson(job.base)).vrstvy || {} : {};
    } catch (e) { return; }
    // r27-6: obarvená látka (maska <vrstva>-barva.webp, R = látka): jas malby / medián jasu látky × barvivo
    obr = obr.map((im, i) => bobr[i] && jasy[jmeno(job.list[i].src)]?.latka ? obarvi(im, bobr[i], job.list[i].bar, jasy[jmeno(job.list[i].src)].latka) : im);
    // r27-6: obarvené vlasy a vousy bez světlé záře — poloprůhledný okraj by se přebarvil do zářivého lemu, tak se zúží
    obr = obr.map((im, i) => barveneVlasy[i] ? vlasyBezZare(im, job.list[i].filter) : im);
    if (!cv.isConnected) return;
    const off = document.createElement("canvas"); off.width = W; off.height = H;
    const o = off.getContext("2d");
    const sat = document.createElement("canvas"); sat.width = W; sat.height = H;   // oblečení zvlášť, ať maska nesmaže tělo
    const so = sat.getContext("2d");
    job.list.forEach((l, i) => {
      const g = i === 0 || l.cls === "zada" || l.cls === "telo" ? o : so;   // záda a tělo dole, oblečení zvlášť
      if (mobr[i]) { g.save(); g.globalCompositeOperation = "destination-out"; g.drawImage(mobr[i], 0, 0, W, H); g.restore(); }
      g.save();
      const m = /inset\(([\d.]+)%/.exec(l.clip || "");
      if (m) { g.beginPath(); g.rect(0, H * m[1] / 100, W, H); g.clip(); }
      if (l.filter && l.filter !== "none" && !obr[i].predbarveno) g.filter = l.filter;
      if (vobr[i]) {                                   // vrstva jen uvnitř masky (vlasy v kápi)
        const t = document.createElement("canvas"); t.width = W; t.height = H;
        const tg = t.getContext("2d"); tg.filter = g.filter; tg.drawImage(obr[i], 0, 0, W, H);
        tg.filter = "none"; tg.globalCompositeOperation = "destination-in"; tg.drawImage(vobr[i], 0, 0, W, H);
        g.filter = "none"; g.drawImage(t, 0, 0);
      } else g.drawImage(obr[i], 0, 0, W, H);
      g.restore();
    });
    // díly s maskou „i tělo“ zakryjí vyčuhující prsty, kůži…
    tobr.forEach((m) => { if (m) { o.save(); o.globalCompositeOperation = "destination-out"; o.drawImage(m, 0, 0, W, H); o.restore(); } });
    o.drawImage(sat, 0, 0);
    const { kx, ky } = job, dy = -(H - KRK_DO) * (ky - 1);
    const hladke = (t) => t * t * (3 - 2 * t);
    // hlava a krk se jen posunou o dy, tělo pod krkem se roztáhne od chodidel
    const sirka = (y) => y <= KRK_OD ? 1 : y >= KRK_DO ? kx : 1 + (kx - 1) * hladke((y - KRK_OD) / (KRK_DO - KRK_OD));
    const c = cv.getContext("2d");
    c.clearRect(0, 0, W, H);
    for (let yo = 0; yo < H; yo++) {
      const top = KRK_DO + dy;                             // kde začíná tělo v cíli
      const ys = yo < top ? yo - dy : H - (H - yo) / ky;     // inverze kam()
      if (ys < 0 || ys >= H) continue;
      const k = sirka(ys), w = W * k;
      c.drawImage(off, 0, Math.floor(ys), W, 1, (W - w) / 2, yo, w, 1);
    }
    if (hotove.size > 6) hotove.clear();
    const kopie = document.createElement("canvas"); kopie.width = W; kopie.height = H; kopie.getContext("2d").drawImage(cv, 0, 0);
    hotove.set(klic, kopie);
    hotovo();
  }

  /** HTML figury. base = adresa složky img/ (končí lomítkem). */
  function html(me, base) {
    const L = me.looks || {};
    const kx = STAVBA[L.postava] || 1, ky = VYSKA[L["výška"]] || 1;
    const eq = {};
    (me.equipped || []).forEach((e) => { eq[e.slot] = e; });
    const inHand = eq["zbraň"] && ZBRAN_RUKA[slug(eq["zbraň"].id)];
    const weapon = inHand ? null : eq["zbraň"], shield = eq["štít"] && STIT[eq["štít"].id] ? null : eq["štít"];
    const torch = eq["světlo"]?.id === "Louč" && (eq["štít"] || inHand === "luk") ? eq["světlo"] : null;   // r27-4: v ruce, jinak vedle postavy
    const imgs = layers(me, base).map((l) => { const st = (l.filter && l.filter !== "none" ? `filter:${l.filter};` : "") + (l.clip ? `clip-path:${l.clip};` : "")
      + (l.maskIn ? `-webkit-mask-image:url('${l.maskIn}');mask-image:url('${l.maskIn}');-webkit-mask-size:100% 100%;mask-size:100% 100%;` : "");
      return `<img class="vrstva ${l.cls}" src="${l.src}" alt="" decoding="async"${st ? ` style="${st}"` : ""}>`; }).join("");
    const side = (e, src) => e ? `<figure class="vyzbroj"><img src="${src}" alt="" loading="lazy"><figcaption>${escH(e.name)}</figcaption></figure>` : "";
    return `<div class="figura">
      <div class="figura-plocha"><div class="figura-telo">${stavba(me, base, imgs, kx, ky)}</div><div class="figura-stin"></div></div>
      <div class="figura-zbrane">${side(weapon, weapon ? base + "predmety/zbrane/zbran-" + slug(weapon.id) + ".webp" : "")}
        ${side(shield, shield ? base + "predmety/zbrane/" + (STIT[shield.id] || "stit-" + slug(shield.id)) + ".webp" : "")}
        ${side(torch, base + "predmety/zbrane/svetlo-louc.webp")}</div>
    </div>`;
  }
  const escH = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  return { html, layers, slug };
})();
