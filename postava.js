/* Královské stezky — postava složená z vrstev (r26-2).
   Všechny vrstvy mají stejné plátno 1024 × 1536 a sedí na tělo muže nebo ženy (repo grafiky img/postava/).
   Pořadí: tělo → oděv → zbroj → opasek → zbraň a pěst → plášť → batoh → vlasy → helma → vousy → štít (vždy navrch). */
"use strict";

const Postava = (() => {
  const BATOH_HOTOVY = true;    // r27-3: brašna přes rameno (dřívější batoh vypadal jako šle)
  const slug = (s) => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const ODEV = { "Lněná košile": ["muz", "lnena-kosile"], "Suknice": ["muz", "suknice"], "Vlněný kabátec": ["muz", "vlneny-kabatec"], "Kožich": ["muz", "kozich"],
    "Lněná košilka": ["zena", "lnena-kosilka"], "Šaty": ["zena", "saty"], "Vlněné šaty": ["zena", "vlnene-saty"], "Kožíšek": ["zena", "kozisek"],
    // 1.0-1-15: nové oděvy (zatím za NOVINKY_VYBAVA); ženské šaty bez mužského protějšku nosí muž jako měšťanský kabát
    "Krátký kabátec": ["muz", "kratky-kabatec"], "Měšťanský kabát": ["muz", "mestansky-kabat"], "Živůtek se sukní": ["zena", "zivutek-se-sukni"],
    "Měšťanské šaty": ["zena", "mestanske-saty"], "Sváteční šaty se zlatým lemem": ["zena", "svatecni-saty-se-zlatym-lemem"],
    "Šaty s vlečkou a kožešinou": ["zena", "saty-s-vleckou-a-kozesinou"] };
  const PAIR = { "lnena-kosile": "lnena-kosilka", "suknice": "saty", "vlneny-kabatec": "vlnene-saty", "kozich": "kozisek",
    "kratky-kabatec": "zivutek-se-sukni", "mestansky-kabat": "mestanske-saty" };
  const JEN_ZENSKE = { "svatecni-saty-se-zlatym-lemem": "mestansky-kabat", "saty-s-vleckou-a-kozesinou": "mestansky-kabat" };   // muž místo nich
  const ZBROJ = { "Brigantina": "brigantina", "Gotický plát": "goticky-plat", "Kapitánova brigantina": "kapitanova-brigantina", "Kožená zbroj": "kozena",
    "Kroužková zbroj": "krouzkova", "Plát Černého rytíře": "cerny-plat", "Plátová zbroj": "platova", "Plátový kyrys": "platovy-kyrys",
    "Prošívaná zbroj": "prosivana", "Purkrabího brigantina": "purkrabiho-brigantina", "Uherská brigantina": "purkrabiho-brigantina", "Zbroj z medvědí kůže": "medvedi",
    // 1.0-1-15: nové zbroje (zatím za NOVINKY_VYBAVA)
    "Lovecký kabátec": "lovecky-kabatec", "Vycpávaná kazajka": "vycpavana-kazajka", "Kroužková košile": "krouzkova-kosile", "Šupinová zbroj": "supinova-zbroj",
    "Brigantina s plátovými rameny": "brigantina-s-platovymi-rameny", "Milánská zbroj": "milanska-zbroj" };
  const HELMA = { "Batvat": "batvat", "Havířská helma": "havirska", "Kroužková kukla": "krouzkova-kukla", "Helmice": "helmice", "Kapalín": "kapalin",
    "Rytířský helm": "rytirsky-helm", "Nosová přilba": "nosova", "Bascinet": "bascinet", "Velká přilba": "velka",
    // 1.0-1-15: čepice a nové helmy (zatím za NOVINKY_VYBAVA) — samostatná vrstva přes vlasy podle postavy
    "Železná čepice": "zelezna-cepice", "Barbuta": "barbuta", "Bascinet s psí kuklou": "bascinet-s-psi-kuklou", "Kožená čepice": "kozena-cepice",
    "Plátěná čepice": "platena-cepice", "Vyšívaná čepice": "vysivana-cepice", "Sametový baret": "sametovy-baret", "Měkká čepice s pérem": "mekka-cepice-s-perem",
    "Černý baret s pérem": "cerny-baret-s-perem", "Brokátová čepice": "brokatova-cepice", "Baret s chocholem": "baret-s-chocholem", "Věneček": "venecek",
    "Perlový čepec": "perlovy-cepec" };
  const HELMA_JEN_MUZ = new Set(["batvat", "havirska"]);
  const NOSNIK = new Set(["nosova"]);                               // 1.0-3-12: helmy s nosníkem (vrstva helma-<x>-nos přes vousy)           // ženská verze zatím není — použije se mužská
  const HELMA_JEN_ZENA = new Set(["venecek", "perlovy-cepec"]);   // 1.0-1-15: mužská verze není — použije se ženská
  // 1.0-1-15 (Pavel): holá hlava + vlasy podle postavy + čepice navrch. Vlasy se nekreslí jen pod helmou, která zakryje celou hlavu;
  // jinak je kryje maska helma-<x>-skryva.webp (vlasy pod čepicí a nad jejím okrajem), věneček sedí na vlasech bez masky.
  const SKRYJE_VLASY = new Set(["krouzkova-kukla", "bascinet", "velka", "rytirsky-helm", "barbuta", "bascinet-s-psi-kuklou", "batvat", "havirska"]);
  const SKRYJE_VOUSY = new Set(["velka", "rytirsky-helm"]);
  const PLAST = { "Cestovní plášť": "cestovni", "Lehký plášť": "lehky", "Vlněný plášť s kápí": "vlneny-s-kapi", "Kožešinový plášť": "kozesinovy", "Plášť s kápí a lemem": "s-kapi-a-lemem" };
  const STIN_CLS = new Set(["odev", "zbroj", "plast", "helma"]);
  const DLOUHY_PLAST = new Set(["vlneny-s-kapi", "cestovni", "kozesinovy"]);   // 1.0-2-2: zavřené pláště po kotníky — ruce pod nimi
  const VNITR_STIN = new Set(["bascinet", "krouzkova-kukla", "havirska", "batvat"]);   // 1.0-2-2 (Pavel): v otvoru helmy u spánků stín
  const PLAST_ZADA = new Set(["s-kapi-a-lemem"]);   // 1.0-2-2 (Pavel): mezi tělem a pláštěm nesmí prosvítat pozadí
  const PLAST_BEZ_HELMY = new Set(["s-kapi-a-lemem"]);              // 1.0-1-15: plášť bez masky „helma pod pláštěm“
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
    "Okovaný štít": "stit-okovany", "Rytířský štít": "stit-rytirsky",
    "Pěstní štít": "stit-pestni", "Jezdecký štít": "stit-jezdecky", "Malovaná pavéza": "stit-malovana-paveza", "Mistrovský štít": "stit-mistrovsky" };   // 1.0-1-15
  // r27-4: zbraně, které postava drží v ruce (vrstvy zbran-ruka-<slug>-<sx>); luk drží levá, ostatní pravá
  const ZBRAN_RUKA = Object.fromEntries(["dlouhy-mec", "kratky-mec", "jeskuv-mec", "cepel-cerneho-rytire", "bastard", "dvourucni-mec", "savle", "tesak",
    "krysaruv-tesak", "dyka", "palcat", "hejtmanuv-palcat", "sekyrka", "valecne-kladivo", "dutohlavova-sekera", "prak", "halapartna", "kopi", "sudlice",
    "vidle", "kosa", "cep", "obourucni-sekera", "obourucni-kladivo", "lehka-kuse", "tezka-kuse", "arbalest", "hakovnice", "pistala",
    "rondel", "lovecky-tesak", "jezdecky-mec", "remdih", "bojova-sekera", "cakan", "rytirsky-mec", "kropac", "partyzana", "dvourucni-cakan",
    "kuse-s-heverem"].map((k) => [k, "prava"])
    .concat(["dlouhy-luk", "kratky-luk", "kompozitni-luk", "valecny-luk"].map((k) => [k, "luk"])));
  // 1.0-1-15 (Pavel 27. 11.): pěst natočená se zbraní — úhel podle druhu (vrstvy ruka-pest-prava-<sx>-<m51…>, zbraň se štítem zbran-ruka-<slug>-<sx>-stit)
  const DYKY = new Set(["dyka", "rondel", "tesak", "krysaruv-tesak", "lovecky-tesak"]);
  const HLAVICE = new Set(["sekyrka", "palcat", "hejtmanuv-palcat", "valecne-kladivo", "remdih", "bojova-sekera", "cakan"]);
  const ROVNE = new Set(["dlouhy-mec", "jeskuv-mec", "cepel-cerneho-rytire", "dvourucni-mec", "prak", "dutohlavova-sekera", "halapartna", "kopi", "sudlice",
    "vidle", "kosa", "cep", "obourucni-sekera", "obourucni-kladivo", "kropac", "partyzana", "dvourucni-cakan"]);   // hrotem na zemi / svisle — pěst rovně
  const KUSE = new Set(["lehka-kuse", "tezka-kuse", "arbalest", "hakovnice", "pistala", "kuse-s-heverem"]);
  // 1.0-2-2 (Pavel 27. 11.): dlouhé zbraně (luky, ratišťové) se s nasazeným pláštěm nekreslí vůbec
  const SKRYT_V_PLASTI = new Set(["halapartna", "kopi", "sudlice", "partyzana", "vidle", "kosa", "cep", "kropac", "dvourucni-cakan",
    "dlouhy-luk", "kratky-luk", "kompozitni-luk", "valecny-luk"]);
  const SE_STITEM = (z) => !DYKY.has(z) && !ROVNE.has(z) && !KUSE.has(z);
  const UHEL = (z, stit) => ROVNE.has(z) ? "" : KUSE.has(z) ? "-p35" : DYKY.has(z) ? "-m60" : HLAVICE.has(z) ? "-m67" : stit ? "-m61" : "-m51";
  const LEVA = { "Dýka": "dyka", "Rondel": "rondel", "Tesák": "tesak", "Lovecký tesák": "lovecky-tesak", "Krysařův tesák": "krysaruv-tesak" };   // druhá zbraň v levé ruce

  const ZBRAN_ALIAS = { "imrovo-valecne-kladivo": "valecne-kladivo" };   // r27-10: legendy kreslené jako běžná zbraň
  /** Seznam vrstev [{src, filter, cls}] pro postavu z API (me). */
  function layers(me, base) {
    const L = me.looks || {}, fem = L["pohlaví"] === "Žena", sx = fem ? "zena" : "muz";
    const eq = {}, bar = {};
    (me.equipped || []).forEach((e) => { eq[e.slot] = e.id; bar[e.slot] = e.color || ""; });   // r27-6: barva látky vybraná při nákupu
    const P = (n) => base + "postava/" + n + ".webp";
    // r27-6: nářadí, které hráč nese — lopata a krumpáč křížem na zádech (za tělem), nůž a sekera za opaskem
    const nese = (n) => ((me.inventory || {})[n] || 0) > 0;
    const zada = [nese("Krumpáč") && "krumpac", nese("Lopata") && "lopata"].filter(Boolean).join("-");
    const plastZada = PLAST_ZADA.has(PLAST[eq["plášť"]]) ? [{ src: P("plast-muz-" + PLAST[eq["plášť"]] + "-zada"), cls: "zada" }] : [];   // 1.0-2-2: zadní díl pláště za tělem
    const out = [...plastZada, ...(zada ? [{ src: P("naradi-zada-" + zada), cls: "zada" }] : []), { src: P("postava-telo-" + sx), cls: "telo" }];
    const od = ODEV[eq["oděv"]];
    let odKey = od ? (od[0] === sx ? od[1] : fem ? PAIR[od[1]] || od[1] : JEN_ZENSKE[od[1]] || Object.keys(PAIR).find((k) => PAIR[k] === od[1]) || od[1]) : "";
    // r27-3: ženský kožíšek (kabátek se širokou sukní) pod plátem a kyrysem nesedí — pod nimi je vidět jen sukně, tak se kreslí vlněné šaty
    if (fem && odKey === "kozisek" && ["platova", "goticky-plat", "cerny-plat", "platovy-kyrys"].includes(ZBROJ[eq.zbroj])) odKey = "vlnene-saty";
    if (odKey) out.push({ src: P("odev-" + sx + "-" + odKey), cls: "odev", bar: bar["oděv"] });
    if (fem && ZBROJ[eq.zbroj]) out.push({ src: P("nohy-zena-" + (odKey || "bez")), cls: "nohy" });   // r27-3: žena ve zbroji má nohavice a boty
    // r27-19: zbroj z medvědí kůže — brašna i popruh přes kůži a opasek, jen na ramenou pod kožichem (vrstva <zbroj>-kozich navrch)
    const kozich = ZBROJ[eq.zbroj] === "medvedi";
    if (ZBROJ[eq.zbroj]) out.push({ src: P("zbroj-" + sx + "-" + ZBROJ[eq.zbroj]), cls: "zbroj", pod: odKey ? sx + "-" + odKey : "" });
    if (nese("Lovecký nůž")) out.push({ src: P("naradi-pas-nuz"), cls: "naradi" });   // r27-6: nůž za lucernou a opaskem, šikmo
    if (nese("Sekera")) out.push({ src: P("naradi-pas-sekera"), cls: "naradi" });     // topůrko za opaskem a brašnou
    if (eq["světlo"] === "Lucerna") out.push({ src: P("svetlo-lucerna-pas"), cls: "svetlo" });   // r27-6: úchyt lucerny je pod opaskem — visí na něm
    if (me.gear?.opasek) out.push({ src: P("opasek-kozeny"), cls: "opasek" });
    // r27-6: sekera — hlavice přes opasek a malou brašnu, topůrko za nimi (velký batoh, plášť a štít ji zakryjí)
    const sekeraHlava = () => { if (nese("Sekera")) out.push({ src: P("naradi-pas-sekera-hlava"), cls: "naradi" }); };
    if (!me.gear?.batoh || !BATOH_HOTOVY) sekeraHlava();
    // r27-4: zbraň, štít a louč v rukou — sevřená pěst přes rukojeť; otevřenou dlaň těla (a kovovou rukavici zbroje) schová maska „ruka-dlan“
    const zbSlug = ZBRAN_ALIAS[slug(eq["zbraň"] || "")] || slug(eq["zbraň"] || "");
    const zb = PLAST[eq["plášť"]] && SKRYT_V_PLASTI.has(zbSlug) ? null : ZBRAN_RUKA[zbSlug], st = STIT[eq["štít"]];
    const pravaZb = zb && zb !== "luk", levaZb = zb === "luk", louc = (eq["světlo"] === "Louč" || eq["štít"] === "Louč") && !st && !levaZb && !LEVA[eq["štít"]];   // 1.0-3-14: louč i v ruce místo štítu
    const kov = !fem && ["platova", "goticky-plat", "cerny-plat", "milanska-zbroj"].includes(ZBROJ[eq.zbroj]);   // 1.0-1-15: milánská má plátové rukavice
    const levaDyka = LEVA[eq["štít"]] && !st ? LEVA[eq["štít"]] : null;      // 1.0-1-15: druhá dýka v levé pěsti
    const pest = (strana, uhel = "") => ({ src: P((kov ? "rukavice" : "ruka") + "-pest-" + strana + (kov ? "-muz" : "-" + sx) + uhel), cls: "pest",
      filter: kov && ZBROJ[eq.zbroj] === "cerny-plat" ? "brightness(.32) saturate(.4)" : "none" });
    const sStitem = !!st && SE_STITEM(zbSlug);
    // 1.0-2-2 (Pavel 27. 11.): v dlouhém zavřeném plášti je ruka pod pláštěm — pěst se nekreslí, zbraň jde přes plášť a u ruky měkce mizí pod látku
    const dlouhyPlast = DLOUHY_PLAST.has(PLAST[eq["plášť"]]);
    const zaPlastem = [];
    const vRuce = (zbr, pst) => { if (dlouhyPlast) { zaPlastem.push(Object.assign(zbr, { ukryj: pst.src, plast: P("plast-muz-" + PLAST[eq["plášť"]]) })); return [zbr]; }
      if (st) zaPlastem.push(zbr, pst);                            // se štítem: zbraň i pěst přes štít
      return [zbr, pst]; };
    if (pravaZb) out.push({ src: P("ruka-dlan-prava-" + sx), cls: "dlan" }, ...vRuce({ src: P("zbran-ruka-" + zbSlug + "-" + sx + (sStitem ? "-stit" : "")), cls: "zbran" },
      pest("prava", UHEL(zbSlug, sStitem))));
    if (levaZb || st || louc || levaDyka) out.push({ src: P("ruka-dlan-leva-" + sx), cls: "dlan" });
    if (levaDyka) out.push(...vRuce({ src: P("zbran-leva-" + levaDyka + "-" + sx), cls: "zbran" }, pest("leva", "-p20")));
    if (levaZb) out.push(...vRuce({ src: P("zbran-ruka-" + zbSlug + "-" + sx), cls: "zbran" }, pest("leva")));
    if (louc && !dlouhyPlast) out.push(...vRuce({ src: P("svetlo-louc-ruka-" + sx), cls: "svetlo ohen" }, pest("leva")));   // 1.0-3-15 (Pavel): louč za pláštěm vůbec není vidět
    zaPlastem.forEach((l) => out.splice(out.indexOf(l), 1));        // přesune se až za plášť
    const helm = HELMA[eq.hlava];
    const hair = L.vlasy === "Bez vlasů" ? null : (VLASY[L.vlasy] || "kratke");   // r27-6: tělo je holé, vlasy nese jen vrstva účesu
    const kape = PLAST[eq["plášť"]] === "vlneny-s-kapi";          // r27-3: v kápi je hlava uvnitř — vlasy pod kápí, ne přes ni
    const sVlasy = hair && !SKRYJE_VLASY.has(helm);                  // 1.0-1-15: pod čepicí a otevřenou helmou vlasy zůstanou
    const vlasy = () => { if (sVlasy) out.push({ src: P("vlasy-" + sx + "-" + hair), filter: BARVA[L["barva vlasů"]] || "none", cls: "vlasy",
      maskIn: kape ? P("plast-vlneny-s-kapi-vlasy") : "" });
      if (sVlasy && hair === "tonzura" && !fem) out.push({ src: P("vlasy-muz-tonzura-kuze"), cls: "kuze", maskIn: kape ? P("plast-vlneny-s-kapi-vlasy") : "" }); };   // r27-6: lysina se nebarví s vlasy
    const helmaSrc = helm ? "helma-" + helm + (HELMA_JEN_ZENA.has(helm) || (fem && !HELMA_JEN_MUZ.has(helm)) ? "-zena" : "") : "";
    const helma = () => { if (helm) out.push({ src: P(helmaSrc), cls: "helma",
      maskIn: kape ? P(helm === "kapalin" ? "plast-vlneny-s-kapi-vlasy" : "plast-vlneny-s-kapi-helma") : PLAST[eq["plášť"]] && !PLAST_BEZ_HELMY.has(PLAST[eq["plášť"]]) ? P("plast-muz-" + PLAST[eq["plášť"]] + "-helma") : "" }); if (helm && VNITR_STIN.has(helm)) out.push({ src: P(helmaSrc + "-vnitr"), cls: "stin" }); };   // r27-3: bez kápě se helma (závěs) schová pod plášť   // r27-3: helma v kápi — co trčí z kápě ven, se nekreslí
    // r27-3: pravidlo vnoření — co je pod pláštěm, je pod ním: brašna (řemen), helma i vlasy v kápi
    const brasna = () => { const velky = me.gear.batoh === "Velký batoh"; if (velky) sekeraHlava();
      out.push({ src: P((velky ? "batoh-velky" : "batoh") + (fem ? "-zena" : "")), cls: "batoh" }); if (!velky) sekeraHlava();
      if (kozich) out.push({ src: P("zbroj-" + sx + "-medvedi-kozich"), cls: "zbroj kozich" }); };
    if (me.gear?.batoh && BATOH_HOTOVY && PLAST[eq["plášť"]]) brasna();
    if (kape) vlasy();
    if (kape) helma();                                             // r27-3: v kápi je helma pod pláštěm, jinak přes něj (plášť má výřez krku)
    if (PLAST[eq["plášť"]]) out.push({ src: P("plast-muz-" + PLAST[eq["plášť"]]), cls: "plast", bar: bar["plášť"] });
    if (kape) out.push({ src: P("plast-muz-vlneny-s-kapi-kape"), cls: "stin" });   // 1.0-2-2 (Pavel): v kápi je stín — tváře a spánky u okraje kápě ztmavené   // ženské pláště nekryly ruce — mužské sedí na obě těla
    if (me.gear?.batoh && BATOH_HOTOVY && !PLAST[eq["plášť"]]) brasna();
    if (!kape) vlasy();
    if (!kape) helma();
    const beard = !fem && VOUSY[L.vousy];
    if (beard && !SKRYJE_VOUSY.has(helm)) out.push({ src: P("vousy-" + beard), filter: BARVA[L["barva vousů"]] || "none", cls: "vousy" });
    if (beard && NOSNIK.has(helm)) out.push({ src: P(helmaSrc + "-nos"), cls: "helma-nos" });   // 1.0-3-12: nosník helmy jde přes knír a vousy
    if (st) out.push({ src: P("stit-ruka-" + st.replace(/^stit-/, "") + "-" + sx), cls: "stit", erb: me.erbStit || "" });   // r27-6: vlastní erb na štítu   // r27-4: štít vždy navrch přes všechny vrstvy (i plášť, brašnu a vousy)
    out.push(...zaPlastem);                                        // 1.0-2-2 (Pavel): zbraň v pravé ruce jde přes štít (v plášti jen to, co z pláště kouká)
    // 1.0-1-15 (Pavel: vrstvy plynule navazují): za oděvem, zbrojí, pláštěm a pokrývkou hlavy jemný kontaktní stín <díl>-stin.webp
    return out.flatMap((l) => STIN_CLS.has((l.cls || "").split(" ")[0]) && !(l.cls === "helma" && kape) ? [l, { src: l.src.replace(/\.webp$/, "-stin.webp"), cls: "stin" }] : [l]);
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
  /** r27-6: erb namalovaný na plochu štítu — uvnitř okraje, textura dřeva a kování prosvítá. */
  function stitSErbem(stit, erb) {
    const c = document.createElement("canvas"); c.width = W; c.height = H;
    const x = c.getContext("2d", { willReadFrequently: true }); x.drawImage(stit, 0, 0, W, H);
    const d = x.getImageData(0, 0, W, H).data;
    let x0 = W, y0 = H, x1 = 0, y1 = 0;
    for (let y = 0; y < H; y += 3) for (let xx = 0; xx < W; xx += 3) if (d[(y * W + xx) * 4 + 3] > 200) { if (xx < x0) x0 = xx; if (xx > x1) x1 = xx; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    if (x1 <= x0) return stit;
    const bw = x1 - x0, bh = y1 - y0, m = Math.max(bw, bh) * 0.07;     // okraj (kování) zůstane vidět
    const pole = document.createElement("canvas"); pole.width = W; pole.height = H;
    const p = pole.getContext("2d");
    p.drawImage(erb, x0 + m, y0 + m, bw - 2 * m, bh - 2 * m);
    p.globalCompositeOperation = "destination-in";                 // jen kde je štít (kulatý štít ořízne erb do kruhu)
    // vnitřní plocha = obrys štítu zmenšený o okraj (kování zůstane vidět)
    const vnit = document.createElement("canvas"); vnit.width = W; vnit.height = H;
    const vg = vnit.getContext("2d");
    const sx = (bw - 2 * m) / bw, sy = (bh - 2 * m) / bh, cx = x0 + bw / 2, cy = y0 + bh / 2;
    vg.translate(cx, cy); vg.scale(sx, sy); vg.translate(-cx, -cy); vg.drawImage(stit, 0, 0, W, H);
    p.drawImage(vnit, 0, 0);
    // textura dřeva a stíny přes barvy erbu — jen jas štítu (barva původní malby se nepromítne)
    const jas = document.createElement("canvas"); jas.width = W; jas.height = H;
    const jg = jas.getContext("2d"); jg.filter = "grayscale(1) brightness(1.45) contrast(1.15)"; jg.drawImage(stit, 0, 0, W, H);
    p.globalCompositeOperation = "multiply"; p.globalAlpha = 0.75; p.drawImage(jas, 0, 0);
    p.globalCompositeOperation = "destination-in"; p.globalAlpha = 1; p.drawImage(vnit, 0, 0);
    x.drawImage(pole, 0, 0);
    return c;
  }
  // 1.0-2-2: zbraň v ruce pod pláštěm — co plášť zakrývá, zmizí; kolem těžiště pěsti (ruka pod pláštěm) zbraň měkce zmizí
  // 1.0-2-2: smaže malé osamocené kousky (mapa 1/4, plocha pod 50 bodů ≈ 800 px) a bledé zbytky (nikde neprůhlednější než 150)
  function drobky(tg) {
    const w = W / 4 | 0, h = H / 4 | 0, m = document.createElement("canvas"); m.width = w; m.height = h;
    const mg = m.getContext("2d"); mg.drawImage(tg.canvas, 0, 0, w, h);
    const d = mg.getImageData(0, 0, w, h), a = d.data, lab = new Int32Array(w * h), st = [];
    const pryc = mg.createImageData(w, h); let nic = true; const kusy = [];
    for (let i = 0, id = 0; i < w * h; i++) {
      if (lab[i] || a[i * 4 + 3] < 5) continue;
      const kus = []; let max = 0; lab[i] = ++id; st.push(i);
      while (st.length) { const j = st.pop(); kus.push(j); max = Math.max(max, a[j * 4 + 3]); const x = j % w;
        for (const k of [j - 1, j + 1, j - w, j + w]) if (k >= 0 && k < w * h && !lab[k] && a[k * 4 + 3] >= 5 && Math.abs((k % w) - x) <= 1) { lab[k] = id; st.push(k); } }
      kusy.push([kus, max]);
    }
    // 1.0-3-18 (Pavel): hlavice/konec rukojeti vedle pláště — zůstane jen hlavní kus zbraně, malé odtržené kousky (< 30 % největšího) pryč
    const nej = Math.max(0, ...kusy.map((k) => k[0].length));
    for (const [kus, max] of kusy) if (kus.length < 50 || max < 150 || kus.length < nej * .3) { nic = false; for (const j of kus) pryc.data[j * 4 + 3] = 255; }
    if (nic) return;
    mg.clearRect(0, 0, w, h); mg.putImageData(pryc, 0, 0);
    tg.save(); tg.globalCompositeOperation = "destination-out"; tg.filter = "blur(2px)";
    for (let r = 0; r < 2; r++) tg.drawImage(m, -4, -4, W + 8, H + 8);   // trochu přes okraj, ať nezůstane lem
    tg.restore();
  }
  function bezUchopu(zbr, pst, pl) {
    const m = document.createElement("canvas"); m.width = 128; m.height = 192;
    const mg = m.getContext("2d"); mg.drawImage(pst, 0, 0, 128, 192);
    const d = mg.getImageData(0, 0, 128, 192).data; let sx = 0, sy = 0, n = 0;
    for (let i = 3; i < d.length; i += 4) if (d[i] > 40) { const p = (i - 3) / 4; sx += p % 128; sy += (p / 128) | 0; n++; }
    const t = document.createElement("canvas"); t.width = W; t.height = H;
    const tg = t.getContext("2d"); tg.drawImage(zbr, 0, 0, W, H);
    const k = W / 128, cx = n ? sx / n * k : W / 2, cy = n ? sy / n * k : H / 2;
    if (pl) {   // plášť kryje zbraň jen na straně ruky — přes druhou půlku pláště (za rozparkem) zbraň přesahuje navrch
      tg.save(); tg.beginPath(); if (!n) tg.rect(0, 0, W, H); else if (cx < W / 2) tg.rect(0, 0, W / 2, H); else tg.rect(W / 2, 0, W / 2, H); tg.clip();
      tg.globalCompositeOperation = "destination-out"; tg.drawImage(pl, 0, 0, W, H);
      // 1.0-3-18 (Pavel): na straně ruky je ze zbraně vidět jen to, co visí pod lemem pláště — nic vedle pláště (hlavice, konec rukojeti)
      if (n) { const lw = 128, lh = 192, lc = document.createElement("canvas"); lc.width = lw; lc.height = lh;
        const lg = lc.getContext("2d"); lg.drawImage(pl, 0, 0, lw, lh); const la = lg.getImageData(0, 0, lw, lh).data;
        let lem = lh; const x0 = cx < W / 2 ? 0 : lw / 2, x1 = cx < W / 2 ? lw / 2 : lw;
        for (let x = x0; x < x1; x++) { let dno = -1; for (let y = 0; y < lh; y++) if (la[(y * lw + x) * 4 + 3] > 40) dno = y; if (dno > lh * .5) lem = Math.min(lem, dno); }
        if (lem < lh) tg.fillRect(cx < W / 2 ? 0 : W / 2, 0, W / 2, (lem - 2) * H / lh); }
      tg.restore();
    }
    if (!n) { if (pl) drobky(tg); return t; }
    const r0 = 62 * W / 1024, r1 = 118 * W / 1024;
    const gr = tg.createRadialGradient(cx, cy, r0, cx, cy, r1);
    gr.addColorStop(0, "rgba(0,0,0,1)"); gr.addColorStop(1, "rgba(0,0,0,0)");
    tg.globalCompositeOperation = "destination-out"; tg.fillStyle = gr; tg.fillRect(0, 0, W, H);
    tg.globalCompositeOperation = "source-over";
    if (pl) drobky(tg);                                   // 1.0-2-2: osamocené a bledé kousky zbraně (záštita přes okraj pláště, konec rukojeti) pryč
    return t;
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
    if (job.kx === 1 && job.ky === 1 && !masky.some(Boolean) && !maskyT.some(Boolean) && !barvit.some(Boolean) && !barveneVlasy.some(Boolean) && !job.list.some((l) => l.erb || l.cls === "stin" || l.ukryj)) return;   // nic k úpravě: zůstanou obyčejné vrstvy
    let obr, mobr, tobr;
    try {
      obr = await Promise.all(job.list.map((l) => l.cls === "stin" ? nacti(l.src).catch(() => null) : nacti(l.src)));   // chybějící stín nevadí
      mobr = await Promise.all(masky.map((m) => m ? nacti(m).catch(() => null) : null));
      tobr = await Promise.all(maskyT.map((m) => m ? nacti(m).catch(() => null) : null));
      var vobr = await Promise.all(job.list.map((l) => l.maskIn ? nacti(l.maskIn).catch(() => null) : null));
      var uobr = await Promise.all(job.list.map((l) => l.ukryj ? nacti(l.ukryj).catch(() => null) : null));
      var pobr = await Promise.all(job.list.map((l) => l.plast ? nacti(l.plast).catch(() => null) : null));
      var bobr = await Promise.all(barvit.map((m) => m ? nacti(m).catch(() => null) : null));
      var jasy = barvit.some(Boolean) ? (await barvyJson(job.base)).vrstvy || {} : {};
    } catch (e) { return; }
    // r27-6: obarvená látka (maska <vrstva>-barva.webp, R = látka): jas malby / medián jasu látky × barvivo
    obr = obr.map((im, i) => bobr[i] && jasy[jmeno(job.list[i].src)]?.latka ? obarvi(im, bobr[i], job.list[i].bar, jasy[jmeno(job.list[i].src)].latka) : im);
    // r27-6: obarvené vlasy a vousy bez světlé záře — poloprůhledný okraj by se přebarvil do zářivého lemu, tak se zúží
    obr = obr.map((im, i) => barveneVlasy[i] ? vlasyBezZare(im, job.list[i].filter) : im);
    for (let i = 0; i < obr.length; i++) if (job.list[i].erb) { try { obr[i] = stitSErbem(obr[i], await nacti(job.list[i].erb)); } catch (e) { /* bez erbu */ } }
    if (!cv.isConnected) return;
    const off = document.createElement("canvas"); off.width = W; off.height = H;
    const o = off.getContext("2d");
    const sat = document.createElement("canvas"); sat.width = W; sat.height = H;   // oblečení zvlášť, ať maska nesmaže tělo
    const so = sat.getContext("2d");
    const zad = document.createElement("canvas"); zad.width = W; zad.height = H;   // 1.0-2-2: záda (plášť, nářadí) — masky „schovej tělo“ je nemažou
    const zg = zad.getContext("2d");
    job.list.forEach((l, i) => {
      if (l.cls === "stin") {                       // 1.0-1-15: kontaktní stín jen na to, co už je pod ním (tělo i oblečení)
        if (obr[i]) for (const c of [o, so]) { c.save(); c.globalCompositeOperation = "source-atop"; c.drawImage(obr[i], 0, 0, W, H); c.restore(); }
        return;
      }
      const g = l.cls === "zada" ? zg : i === 0 || l.cls === "telo" ? o : so;   // záda zvlášť (pod vším), tělo dole, oblečení zvlášť
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
      } else if (uobr[i]) g.drawImage(bezUchopu(obr[i], uobr[i], pobr[i]), 0, 0, W, H);   // 1.0-2-2: zbraň pod pláštěm, vidět jen co plášť nezakryje
      else g.drawImage(obr[i], 0, 0, W, H);
      g.restore();
    });
    // díly s maskou „i tělo“ zakryjí vyčuhující prsty, kůži…
    tobr.forEach((m) => { if (m) { o.save(); o.globalCompositeOperation = "destination-out"; o.drawImage(m, 0, 0, W, H); o.restore(); } });
    o.drawImage(sat, 0, 0);
    o.save(); o.globalCompositeOperation = "destination-over"; o.drawImage(zad, 0, 0); o.restore();   // záda pod celou postavu
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
  function html(me, base, naRameni) {   // r27-19: naRameni = pták na rameni (html), roste a dýchá s postavou
    const L = me.looks || {};
    const kx = STAVBA[L.postava] || 1, ky = VYSKA[L["výška"]] || 1;
    const eq = {};
    (me.equipped || []).forEach((e) => { eq[e.slot] = e; });
    const inHand = eq["zbraň"] && ZBRAN_RUKA[slug(eq["zbraň"].id)];
    const weapon = inHand ? null : eq["zbraň"], shield = eq["štít"] && (STIT[eq["štít"].id] || LEVA[eq["štít"].id] || eq["štít"].id === "Louč") ? null : eq["štít"];   // 1.0-3-14: louč v ruce není štít (dřív rozbitý obrázek vedle postavy)
    const torch = eq["světlo"]?.id === "Louč" && (eq["štít"] || inHand === "luk") ? eq["světlo"] : null;   // r27-4: v ruce, jinak vedle postavy
    const imgs = layers(me, base).filter((l) => l.cls !== "stin").map((l) => { const st = (l.filter && l.filter !== "none" ? `filter:${l.filter};` : "") + (l.clip ? `clip-path:${l.clip};` : "")
      + (l.maskIn ? `-webkit-mask-image:url('${l.maskIn}');mask-image:url('${l.maskIn}');-webkit-mask-size:100% 100%;mask-size:100% 100%;` : "");
      return `<img class="vrstva ${l.cls}" src="${l.src}" alt="" decoding="async"${st ? ` style="${st}"` : ""}>`; }).join("");
    const side = (e, src) => e ? `<figure class="vyzbroj"><img src="${src}" alt="" loading="lazy"><figcaption>${escH(e.name)}</figcaption></figure>` : "";
    return `<div class="figura">
      <div class="figura-plocha"><div class="figura-telo">${stavba(me, base, imgs, kx, ky)}${naRameni ? `<div class="na-rameni"${kx !== 1 || ky !== 1 ? ` style="transform:scale(${kx},${ky})"` : ""}>${naRameni}</div>` : ""}</div><div class="figura-stin"></div></div>
      <div class="figura-zbrane">${side(weapon, weapon ? base + "predmety/zbrane/zbran-" + slug(weapon.id) + ".webp" : "")}
        ${side(shield, shield ? base + "predmety/zbrane/" + (STIT[shield.id] || "stit-" + slug(shield.id)) + ".webp" : "")}
        ${side(torch, base + "predmety/zbrane/svetlo-louc.webp")}</div>
    </div>`;
  }
  const escH = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  return { html, layers, slug };
})();
