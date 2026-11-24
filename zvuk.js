/* Královské stezky — zvuky a hudba (r26-2).
   Tři vrstvy, každá s vlastní hlasitostí a vypínačem: hudba, prostředí, efekty (+ hlavní hlasitost).
   - Hudba podle situace (město ve dne / v noci, hostinec, kostel, výprava, boj, boss, smutek) s prolínáním.
     Skladby: Kevin MacLeod (incompetech.com), CC BY 4.0 — autor je uveden v Ostatní.
   - Prostředí a efekty: skutečné nahrávky CC0 z freesound.org (repo grafiky, složka zvuk/).
     Když se soubor nenačte, zahraje se náhrada vytvořená přímo v prohlížeči (Web Audio). */
"use strict";

const Zvuk = (() => {
  const store = {
    get(k, d) { try { const v = localStorage.getItem("stezky_zvuk_" + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem("stezky_zvuk_" + k, JSON.stringify(v)); } catch { /* nic */ } },
  };
  const V = { on: store.get("on", true), master: store.get("master", .8), amb: store.get("amb", .55), sfx: store.get("sfx", .7), mus: store.get("mus", .35),
    off_amb: store.get("off_amb", false), off_sfx: store.get("off_sfx", false), off_mus: store.get("off_mus", false) };
  let ac = null, out, busAmb, busSfx, busMus, noiseBuf, base = "zvuk/";
  const lvl = (k) => (V["off_" + k] ? 0 : V[k]);
  let want = { amb: [], weather: "", night: false };
  const running = new Map();            // název smyčky → {stop()}
  const R = Math.random;

  function init() {
    if (ac) { if (ac.state === "suspended") ac.resume(); return true; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ac = new AC();
    out = ac.createGain(); out.gain.value = V.on ? V.master : 0;
    const comp = ac.createDynamicsCompressor(); comp.threshold.value = -16; comp.ratio.value = 4;
    out.connect(comp).connect(ac.destination);
    busAmb = ac.createGain(); busAmb.gain.value = lvl("amb"); busAmb.connect(out);
    busSfx = ac.createGain(); busSfx.gain.value = lvl("sfx"); busSfx.connect(out);
    busMus = ac.createGain(); busMus.gain.value = lvl("mus"); busMus.connect(out);
    noiseBuf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = R() * 2 - 1;
    sync();
    startMusic();
    Object.values(FILE_SFX).flat().forEach(load);           // efekty jsou malé — načtou se hned, ať první hod nezní uměle
    return true;
  }
  // Prohlížeč pustí zvuk až po prvním kliknutí.
  ["pointerdown", "keydown", "touchstart"].forEach((ev) => addEventListener(ev, () => { if (V.on) init(); }, { passive: true }));

  // ---------------------------------------------------------------- stavebnice
  const now = () => ac.currentTime;
  function noise(loop = true) { const s = ac.createBufferSource(); s.buffer = noiseBuf; s.loop = loop; return s; }
  function filt(type, f, q = 1) { const b = ac.createBiquadFilter(); b.type = type; b.frequency.value = f; b.Q.value = q; return b; }
  function gain(v) { const g = ac.createGain(); g.gain.value = v; return g; }
  function env(g, t, a, peak, d, end = .0001) { g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(end, t + a + d); }
  function burst(bus, { t = now(), type = "bandpass", f = 1000, q = 1, a = .002, d = .08, v = .5, fEnd } = {}) {
    const s = noise(false), b = filt(type, f, q), g = gain(0);
    if (fEnd) b.frequency.exponentialRampToValueAtTime(fEnd, t + a + d);
    env(g, t, a, v, d);
    s.connect(b).connect(g).connect(bus); s.start(t, R() * 1.5); s.stop(t + a + d + .05);
  }
  function tone(bus, { t = now(), f = 440, type = "sine", a = .005, d = .4, v = .3, fEnd, detune = 0 } = {}) {
    const o = ac.createOscillator(), g = gain(0);
    o.type = type; o.frequency.setValueAtTime(f, t); o.detune.value = detune;
    if (fEnd) o.frequency.exponentialRampToValueAtTime(fEnd, t + a + d);
    env(g, t, a, v, d);
    o.connect(g).connect(bus); o.start(t); o.stop(t + a + d + .05);
  }
  /** Kov: několik neharmonických tónů (zvon, kovadlina, mince, čepel). */
  function metal(bus, { t = now(), f = 800, d = 1.2, v = .25, parts = [1, 2.76, 5.4, 8.93] } = {}) {
    parts.forEach((p, i) => tone(bus, { t, f: f * p, type: "sine", a: .002, d: d / (1 + i * .7), v: v / (1 + i * .8) }));
  }

  // ---------------------------------------------------------------- smyčky prostředí
  function loopNode(bus, vol) { const g = gain(0); g.connect(bus); g.gain.linearRampToValueAtTime(vol, now() + 2.5); return g; }
  function timer(fn, min, max) { let id; const tick = () => { fn(); id = setTimeout(tick, min + R() * (max - min)); }; id = setTimeout(tick, R() * max); return () => clearTimeout(id); }
  const LOOPS = {
    fire(g) {   // praskání ohně a hučení plamenů
      const s = noise(), lp = filt("lowpass", 380, .7), rg = gain(.35); s.connect(lp).connect(rg).connect(g); s.start();
      const stop = timer(() => burst(g, { f: 1800 + R() * 2600, q: 2, d: .015 + R() * .03, v: .15 + R() * .35 }), 60, 380);
      return () => { stop(); s.stop(); };
    },
    murmur(g) { // hlasy v hostinci: pásmový šum s pomalým kolísáním
      const s = noise(), b = filt("bandpass", 420, 1.8), b2 = filt("lowpass", 900), m = gain(.4); s.connect(b).connect(b2).connect(m).connect(g); s.start();
      const lfo = ac.createOscillator(), lg = gain(.18); lfo.frequency.value = .35; lfo.connect(lg).connect(m.gain); lfo.start();
      const stop = timer(() => { // tu a tam cinkne korbel nebo zasměje host
        if (R() < .5) metal(g, { f: 1300 + R() * 500, d: .25, v: .05, parts: [1, 2.3] });
        else burst(g, { f: 300 + R() * 300, q: 3, a: .03, d: .25, v: .25 });
      }, 1200, 4200);
      return () => { stop(); s.stop(); lfo.stop(); };
    },
    wind(g, k = 1) {
      const s = noise(), b = filt("bandpass", 500, .6), m = gain(.5 * k); s.connect(b).connect(m).connect(g); s.start();
      const lfo = ac.createOscillator(), lg = gain(350); lfo.frequency.value = .08 + R() * .05; lfo.connect(lg).connect(b.frequency); lfo.start();
      const lfo2 = ac.createOscillator(), lg2 = gain(.3 * k); lfo2.frequency.value = .13; lfo2.connect(lg2).connect(m.gain); lfo2.start();
      return () => { s.stop(); lfo.stop(); lfo2.stop(); };
    },
    rain(g, k = 1) {
      const s = noise(), hp = filt("highpass", 900), lp = filt("lowpass", 7000), m = gain(.35 * k); s.connect(hp).connect(lp).connect(m).connect(g); s.start();
      const stop = timer(() => burst(g, { type: "highpass", f: 2500 + R() * 3000, d: .02, v: .12 * k }), 20, 120);
      return () => { stop(); s.stop(); };
    },
    birds(g) {
      const stop = timer(() => {
        const t = now(), f = 2400 + R() * 1800, n = 2 + (R() * 4 | 0);
        for (let i = 0; i < n; i++) tone(g, { t: t + i * .11, f, fEnd: f * (R() < .5 ? 1.35 : .75), d: .07, v: .05 });
      }, 1500, 5000);
      return stop;
    },
    crickets(g) {
      const stop = timer(() => {
        const t = now(), f = 4200 + R() * 500;
        for (let i = 0; i < 4; i++) tone(g, { t: t + i * .045, f, type: "triangle", d: .025, v: .03 });
      }, 300, 900);
      return stop;
    },
    church(g) { // tichý dozvuk varhan a občas zvon
      const fs = [110, 164.8, 220];
      const os = fs.map((f) => { const o = ac.createOscillator(); o.type = "triangle"; o.frequency.value = f; const og = gain(.03); o.connect(og).connect(g); o.start(); return o; });
      const stop = timer(() => metal(g, { f: 196, d: 4, v: .12, parts: [1, 2.0, 2.4, 3.0, 4.2] }), 9000, 18000);
      return () => { stop(); os.forEach((o) => o.stop()); };
    },
    forge(g) {
      const stop = timer(() => { const t = now(); for (let i = 0; i < 2 + (R() * 2 | 0); i++) metal(g, { t: t + i * .38, f: 820 + R() * 60, d: .9, v: .12 }); }, 2500, 6000);
      const s = noise(), lp = filt("lowpass", 250), m = gain(.25); s.connect(lp).connect(m).connect(g); s.start();
      return () => { stop(); s.stop(); };
    },
    water(g) { // pára a voda v lázni
      const s = noise(), b = filt("bandpass", 1600, .8), m = gain(.12); s.connect(b).connect(m).connect(g); s.start();
      const stop = timer(() => tone(g, { f: 600 + R() * 900, fEnd: 1400 + R() * 600, d: .06, v: .05 }), 300, 1400);
      return () => { stop(); s.stop(); };
    },
    crowd(g) { // tržiště venku
      const s = noise(), b = filt("bandpass", 600, 1.2), m = gain(.22); s.connect(b).connect(m).connect(g); s.start();
      const stop = timer(() => { if (R() < .3) metal(g, { f: 2000 + R() * 600, d: .2, v: .04, parts: [1, 2.7] }); else burst(g, { f: 250 + R() * 250, q: 4, a: .04, d: .3, v: .18 }); }, 700, 2500);
      return () => { stop(); s.stop(); };
    },
    forest(g) { const a = LOOPS.wind(g, .5), b = LOOPS.birds(g); return () => { a(); b(); }; },
    field(g) { // r27: pole — vítr v obilí a cvrčci v trávě
      const a = LOOPS.wind(g, .35);
      const stop = timer(() => { const t = now(), f = 5200 + R() * 600; for (let i = 0; i < 6; i++) tone(g, { t: t + i * .03, f, type: "triangle", d: .02, v: .015 }); }, 400, 1600);
      return () => { a(); stop(); };
    },
    hens(g) { // kdákání slepic
      const stop = timer(() => { const t = now(), f = 520 + R() * 180, n = 2 + (R() * 4 | 0);
        for (let i = 0; i < n; i++) tone(g, { t: t + i * .13, f: f * (i === n - 1 ? 1.3 : 1), fEnd: f * .8, type: "square", a: .005, d: .07, v: .03 }); }, 900, 3500);
      return stop;
    },
    barn(g) { // chlév: tlumené dupání, sláma, občas zabučí kráva
      const s = noise(), lp = filt("lowpass", 300), m = gain(.12); s.connect(lp).connect(m).connect(g); s.start();
      const stop = timer(() => { if (R() < .35) tone(g, { f: 140, fEnd: 110, type: "sawtooth", a: .15, d: 1.1, v: .05 });
        else burst(g, { f: 400 + R() * 300, q: 2, a: .01, d: .12, v: .2 }); }, 1500, 5000);
      return () => { stop(); s.stop(); };
    },
    night(g) { return LOOPS.crickets(g); },
  };
  const VOL = { field: .6, hens: .6, barn: .6, fire: .7, murmur: .6, wind: .5, rain: .6, birds: .7, crickets: .6, church: .8, forge: .8, water: .7, crowd: .6, forest: .7, night: .6, storm: .9, gale: .7 };
  LOOPS.storm = (g) => { const a = LOOPS.rain(g, 1.6), b = LOOPS.wind(g, .8); return () => { a(); b(); }; };
  LOOPS.gale = (g) => LOOPS.wind(g, 1.6);

  // ---------------------------------------------------------------- nahrávky (repo grafiky: zvuk/prostredi, zvuk/efekty)
  const FILE_LOOP = {
    fire: ["prostredi/krb-1", "prostredi/krb-2"], murmur: ["prostredi/hostinec-hlasy", "prostredi/hostinec-hostina"],
    crowd: ["prostredi/trh-slavnost", "prostredi/mesto-vesnice", "prostredi/trh-1"], church: ["prostredi/kostel-uvnitr", "prostredi/kostel-katedrala"],
    forge: ["prostredi/kovarna"], rain: ["prostredi/dest-venku"], rain_in: ["prostredi/dest-uvnitr"], storm: ["prostredi/bourka"],
    wind: ["prostredi/vitr-stromy"], gale: ["prostredi/vitr-stromy"], wind_winter: ["prostredi/vitr-zima"], birds: ["prostredi/les-ptaci-1", "prostredi/les-ptaci-2"],
    night: ["prostredi/noc-cvrcci"], forest: ["prostredi/les-ptaci-1"], street: ["prostredi/kun-vuz"],
    field: ["prostredi/pole"], hens: ["prostredi/kurnik"], barn: ["prostredi/chlev"],      // r27: statek
  };
  const FILE_SFX = {
    kalisek: ["efekty/kalisek-1", "efekty/kalisek-2"], kostky: ["efekty/kostky-stul-1", "efekty/kostky-stul-2"],
    karta: ["efekty/karta-1", "efekty/karta-2"], michani: ["efekty/karty-michani"], mince: ["efekty/mince-1", "efekty/mince-2"],
    zasah: ["efekty/sipky-1", "efekty/sipky-2", "efekty/sip-drevo"], voda: ["efekty/voda"], mec: ["efekty/mec-svih-1", "efekty/mec-svih-2"],
    odrazeno: ["efekty/mec-stret-1", "efekty/mec-stret-2"], uder: ["efekty/stit", "efekty/mec-stit"], hrom: ["efekty/hrom-1"],
    zvon: ["efekty/zvon-1", "efekty/zvon-2"], kovadlina: ["efekty/kovadlina"], dvere: ["efekty/dvere"],
    kosa: ["efekty/kosa"], seti: ["efekty/seti"], kladivo: ["efekty/kladivo-drevo"],                 // r27: statek
    "zvire-slepice": ["efekty/slepice"], "zvire-koza": ["efekty/koza"], "zvire-ovce": ["efekty/ovce"],
    "zvire-prase": ["efekty/prase"], "zvire-krava": ["efekty/krava"],
  };
  const bufs = new Map();                 // název souboru → AudioBuffer | Promise | null (chyba)
  function load(name) {
    if (bufs.has(name)) return bufs.get(name);
    const p = fetch(base + name + ".mp3").then((r) => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
      .then((a) => new Promise((ok, ko) => ac.decodeAudioData(a, ok, ko)))
      .then((b) => { bufs.set(name, b); return b; }).catch(() => { bufs.set(name, null); return null; });
    bufs.set(name, p);
    return p;
  }
  const pick = (a) => a[R() * a.length | 0];
  /** Smyčka z nahrávky; když se nenačte, použije se náhrada z prohlížeče. */
  function fileLoop(n, g) {
    let src = null, alt = null, stopped = false;
    const files = FILE_LOOP[n];
    const start = (b) => {
      if (stopped) return;
      if (!b) { alt = LOOPS[{ rain_in: "rain", wind_winter: "wind" }[n] || n]?.(g) || null; return; }
      src = ac.createBufferSource(); src.buffer = b; src.loop = true;
      src.loopStart = .05; src.loopEnd = b.duration - .05;      // soubory jsou připravené jako smyčky (konec prolnutý se začátkem)
      src.connect(g); src.start(0, R() * b.duration * .8);
    };
    Promise.resolve(load(pick(files))).then(start);
    return () => { stopped = true; try { src && src.stop(); } catch { /* nic */ } if (alt) alt(); };
  }

  function sync() {
    if (!ac) return;
    const names = new Set(want.amb);
    const w = want.weather, inside = want.inside;
    if (!inside) {
      if (w === "déšť") names.add("rain");
      if (w === "bouřka") names.add("storm");
      if (w === "vítr" || w === "sníh" || w === "mráz") names.add(want.season === "zima" ? "wind_winter" : "wind");
      if (w === "silný vítr") names.add("gale");
      if (want.night && !["zima"].includes(want.season) && !["déšť", "bouřka"].includes(w)) names.add("night");
      if (want.night || ["déšť", "bouřka", "sníh"].includes(w)) names.delete("birds");
    } else if (["déšť", "bouřka"].includes(w)) names.add("rain_in");   // déšť je slyšet i uvnitř, tišeji
    running.forEach((r, n) => { if (!names.has(n)) { r.g.gain.linearRampToValueAtTime(0, now() + 1.5); setTimeout(r.stop, 1700); running.delete(n); } });
    names.forEach((n) => {
      if (running.has(n) || (!LOOPS[n] && !FILE_LOOP[n])) return;
      const g = loopNode(busAmb, VOL[n] || (n === "rain_in" ? .45 : .6));
      running.set(n, { g, stop: FILE_LOOP[n] ? fileLoop(n, g) : LOOPS[n](g) });
    });
  }

  /** Prostředí scény: smyčky (oheň, hlasy…), počasí a noc. */
  function scene(amb, world = {}, inside = false) {
    want = { amb: amb || [], weather: world.weather || "", night: !!world.night, season: world.season, inside };
    sync();
  }

  // ---------------------------------------------------------------- jednorázové zvuky
  const SFX = {
    klik() { burst(busSfx, { f: 2400, q: 3, d: .02, v: .25 }); },
    stranka() { burst(busSfx, { type: "highpass", f: 1500, a: .02, d: .18, v: .2, fEnd: 4000 }); },
    mince() { const t = now(); [0, .07, .15].forEach((dt, i) => metal(busSfx, { t: t + dt, f: 2600 + i * 180 + R() * 100, d: .35, v: .12, parts: [1, 2.4, 3.9] })); },
    kalisek() { // kostky chrastí v kalíšku
      const t = now(); for (let i = 0; i < 14; i++) burst(busSfx, { t: t + i * .045 + R() * .02, f: 1400 + R() * 1800, q: 4, d: .02, v: .3 });
      burst(busSfx, { t: t + .7, f: 180, q: 1, a: .005, d: .18, v: .6 });
    },
    kostky() { // dopad kostek na stůl
      const t = now(); for (let i = 0; i < 10; i++) burst(busSfx, { t: t + .05 * i + R() * .05, f: 900 + R() * 1400, q: 5, d: .03, v: .35 * (1 - i / 12) });
    },
    karta() { burst(busSfx, { type: "highpass", f: 2500, a: .01, d: .09, v: .25, fEnd: 6000 }); },
    michani() { const t = now(); for (let i = 0; i < 9; i++) burst(busSfx, { t: t + i * .06, type: "highpass", f: 3000, d: .04, v: .15 }); },
    sipka() { burst(busSfx, { f: 900, q: .8, a: .05, d: .18, v: .25, fEnd: 2600 }); },
    zasah() { burst(busSfx, { f: 260, q: 2, a: .001, d: .09, v: .7 }); tone(busSfx, { f: 160, fEnd: 90, d: .12, v: .3 }); },
    mimo() { burst(busSfx, { f: 600, q: 1, a: .001, d: .05, v: .3 }); },
    mec() { burst(busSfx, { type: "highpass", f: 1800, a: .03, d: .15, v: .3, fEnd: 5000 }); metal(busSfx, { t: now() + .14, f: 1700, d: .5, v: .1 }); },
    uder() { burst(busSfx, { f: 180, q: 1.4, a: .001, d: .16, v: .8 }); tone(busSfx, { f: 110, fEnd: 50, d: .2, v: .5 }); },
    odrazeno() { metal(busSfx, { f: 1100, d: .7, v: .2 }); burst(busSfx, { f: 3000, q: 2, d: .04, v: .3 }); },
    uhyb() { burst(busSfx, { f: 700, q: .7, a: .08, d: .22, v: .3, fEnd: 300 }); },
    rev() { tone(busSfx, { f: 120, fEnd: 70, type: "sawtooth", a: .08, d: .9, v: .2 }); burst(busSfx, { type: "lowpass", f: 500, a: .1, d: .9, v: .5 }); },
    hrom() { burst(busAmb, { type: "lowpass", f: 140, a: .02, d: 2.5, v: 1 }); burst(busAmb, { type: "lowpass", f: 400, a: .005, d: .5, v: .5 }); },
    kovadlina() { metal(busSfx, { f: 830 + R() * 40, d: .8, v: .06 }); },
    zvon() { metal(busSfx, { f: 392, d: 3.5, v: .2, parts: [1, 2.0, 2.4, 3.0, 4.2] }); },
    vyhra() { const t = now(); [523, 659, 784, 1046].forEach((f, i) => tone(busSfx, { t: t + i * .12, f, type: "triangle", d: .5, v: .12 })); },
    prohra() { const t = now(); [392, 330, 262].forEach((f, i) => tone(busSfx, { t: t + i * .18, f, type: "triangle", d: .6, v: .1 })); },
    dvere() { burst(busSfx, { f: 200, q: 2, a: .05, d: .5, v: .4, fEnd: 120 }); burst(busSfx, { t: now() + .5, f: 150, q: 1, d: .12, v: .5 }); },
    kosa() { burst(busSfx, { type: "highpass", f: 2200, a: .06, d: .3, v: .25, fEnd: 4200 }); },
    seti() { const t = now(); for (let i = 0; i < 12; i++) burst(busSfx, { t: t + i * .03 + R() * .03, f: 3000 + R() * 2500, q: 5, d: .015, v: .12 }); },
    kladivo() { const t = now(); [0, .32].forEach((dt) => { burst(busSfx, { t: t + dt, f: 500, q: 2, a: .001, d: .08, v: .6 }); tone(busSfx, { t: t + dt, f: 220, fEnd: 120, d: .1, v: .2 }); }); },
    "zvire-slepice"() { const t = now(); for (let i = 0; i < 4; i++) tone(busSfx, { t: t + i * .12, f: 600, fEnd: 480, type: "square", d: .07, v: .05 }); },
    "zvire-koza"() { tone(busSfx, { f: 420, fEnd: 380, type: "sawtooth", a: .02, d: .5, v: .06 }); },
    "zvire-ovce"() { tone(busSfx, { f: 330, fEnd: 300, type: "sawtooth", a: .03, d: .6, v: .06 }); },
    "zvire-prase"() { burst(busSfx, { f: 450, q: 3, a: .01, d: .25, v: .35, fEnd: 300 }); },
    "zvire-krava"() { tone(busSfx, { f: 150, fEnd: 115, type: "sawtooth", a: .1, d: 1.2, v: .08 }); },
  };
  const SFX_VOL = { hrom: 1, zvon: .6, kovadlina: .35, dvere: .5, kostky: .8, kalisek: .8 };
  function sfx(name) {
    if (!V.on || !init()) return;
    const files = FILE_SFX[name];
    const b = files && bufs.get(files[0]) !== undefined ? bufs.get(pick(files)) : null;
    if (files) files.forEach(load);                           // načte se na příště
    if (b && !(b instanceof Promise)) {
      const s = ac.createBufferSource(), g = gain(SFX_VOL[name] || .8);
      s.buffer = b; s.playbackRate.value = .94 + R() * .12;   // malá změna výšky, ať se zvuk neopakuje stejně
      s.connect(g).connect(name === "hrom" ? busAmb : busSfx); s.start();
      return;
    }
    try { SFX[name] && SFX[name](); } catch { /* nic */ }
  }

  // ---------------------------------------------------------------- hudba podle situace
  const MUSIC = { "mesto-den": 3, "mesto-noc": 3, "hostinec": 3, "kostel": 2, "vyprava": 2, "boj": 3, "boss": 2, "smutek": 1 };
  const decks = [];                       // dva přehrávače pro prolínání
  let mctx = "", deckIdx = 0, lastTrack = "";
  function deck(i) {
    if (decks[i]) return decks[i];
    const a = new Audio(); a.crossOrigin = "anonymous"; a.preload = "auto";
    const g = ac.createGain(); g.gain.value = 0;
    ac.createMediaElementSource(a).connect(g).connect(busMus);
    a.onended = () => { if (decks[deckIdx] && decks[deckIdx].a === a) playTrack(mctx, true); };
    a.onerror = () => { /* chybí soubor — hudba prostě nehraje */ };
    return (decks[i] = { a, g });
  }
  function playTrack(ctx, next = false) {
    const n = MUSIC[ctx];
    if (!n || !ac) return;
    let k = 1 + (R() * n | 0);
    if (n > 1 && ctx + k === lastTrack) k = k % n + 1;
    lastTrack = ctx + k;
    const fade = next ? 1.5 : 3, old = decks[deckIdx];
    deckIdx = 1 - deckIdx;
    const d = deck(deckIdx);
    d.a.src = base + "hudba/" + ctx + "-" + k + ".mp3";
    d.a.currentTime = 0;
    d.g.gain.cancelScheduledValues(now()); d.g.gain.setValueAtTime(0, now()); d.g.gain.linearRampToValueAtTime(1, now() + fade);
    if (lvl("mus") > 0 && V.on) d.a.play().catch(() => {});
    if (old) { old.g.gain.cancelScheduledValues(now()); old.g.gain.setValueAtTime(old.g.gain.value, now()); old.g.gain.linearRampToValueAtTime(0, now() + fade);
      const oa = old.a; setTimeout(() => { if (decks[deckIdx].a !== oa) oa.pause(); }, fade * 1000 + 200); }
  }
  /** Přepne hudbu na situaci (např. "hostinec", "mesto-noc", "boj"). Stejná situace hraje dál. */
  function music(ctx) {
    if (ctx === mctx) return;
    mctx = ctx;
    if (!ac) return;                      // spustí se po prvním kliknutí (init)
    if (!ctx) { decks.forEach((d) => { d.g.gain.linearRampToValueAtTime(0, now() + 2); setTimeout(() => d.a.pause(), 2100); }); return; }
    playTrack(ctx);
  }
  function startMusic() { if (mctx && !decks.length) playTrack(mctx); }

  function apply() {
    if (!ac) return;
    out.gain.linearRampToValueAtTime(V.on ? V.master : 0, now() + .3);
    busAmb.gain.value = lvl("amb"); busSfx.gain.value = lvl("sfx"); busMus.gain.value = lvl("mus");
    const d = decks[deckIdx];
    if (d) { if (V.on && lvl("mus") > 0) { if (d.a.paused && d.a.src) d.a.play().catch(() => {}); } else d.a.pause(); }
  }
  /** Nastavení: on, master, amb, sfx, mus (0–1) a off_amb, off_sfx, off_mus (vypnuto). */
  function set(key, val) {
    V[key] = val; store.set(key, val);
    if (!ac) { if (key === "on" && val) init(); return; }
    apply();
  }
  const setBase = (b) => { base = b.replace(/\/?$/, "/"); };
  const state = () => ({ ctx: mctx, deck: decks[deckIdx] && { src: decks[deckIdx].a.src, paused: decks[deckIdx].a.paused, t: decks[deckIdx].a.currentTime }, loops: [...running.keys()], bufs: [...bufs.entries()].filter(([, b]) => b && !(b instanceof Promise)).map(([k]) => k) });
  return { scene, sfx, music, set, setBase, V, state };
})();
