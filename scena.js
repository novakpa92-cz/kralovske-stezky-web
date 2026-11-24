/* Královské stezky — živé scény (r26-2).
   Malovaný obrázek + efekty kódem: mihotání světel, jiskry, kouř, pára, mlha, prach, paprsky, ptáci, listí,
   noc, déšť, bouřka, sníh, vítr. Denní doba, roční období a počasí přicházejí ze serveru (stejné jako na Discordu).
   Převzato z náhledu v repozitáři grafiky (nahled/index.html) a rozšířeno. */
"use strict";

const Scena = (() => {
  const R = Math.random;
  // Souřadnice světel a zdrojů částic jsou v % obrázku. lights: [x, y, velikost % šířky, oheň 0/1]
  const CFG = {
    mapa: { emit: [{ t: "smoke", x: 17, y: 26, rate: .05, s: .6 }, { t: "smoke", x: 39, y: 22, rate: .05, s: .6 },
      { t: "smoke", x: 72, y: 48, rate: .05, s: .6 }, { t: "smoke", x: 22, y: 60, rate: .05, s: .6 }], clouds: true, still: true },
    hostinec: { lights: [[11, 50, 26, 1], [57.4, 9.5, 5], [60.4, 8.6, 5], [66.5, 8.3, 5], [72.2, 9, 5], [75, 10.2, 5], [40.1, 22.5, 5], [82.4, 53, 7], [56, 33.5, 4], [26.5, 28, 4]],
      emit: [{ t: "sparks", x: 10.5, y: 52, w: 4, rate: .35 }, { t: "smoke", x: 15, y: 33, rate: .06, s: 1 }, { t: "dust", rate: .15, area: [50, 15, 95, 85] }], indoor: true },
    kovar: { lights: [[65, 34, 30, 1], [43, 53, 10, 1], [30, 8, 6]],
      emit: [{ t: "sparks", x: 63, y: 40, w: 8, rate: .4 }, { t: "anvil", x: 43, y: 52, rate: .03 }, { t: "smoke", x: 64, y: 22, rate: .09, s: 1.2 }, { t: "steam", x: 75, y: 58, w: 8, rate: .08 }], indoor: true },
    chram: { lights: [[45, 47, 6], [49, 46, 5], [54, 47, 6], [9, 53, 5], [12, 53, 5], [14, 52, 4]],
      rays: [[33, 0, 10, 95, 14], [50, 4, 9, 90, 12], [44, 0, 7, 80, 10]],
      emit: [{ t: "incense", x: 47, y: 42, rate: .12 }, { t: "dust", rate: .25, area: [25, 10, 70, 80], warm: 1 }], indoor: true },
    lazne: { lights: [[92, 12, 7]], emit: [{ t: "steam", x: 18, y: 50, w: 30, rate: .5 }, { t: "steam", x: 6, y: 60, w: 12, rate: .15 }, { t: "dust", rate: .12, area: [60, 10, 85, 50], warm: 1 }], indoor: true },
    trziste: { emit: [{ t: "birds", rate: .006 }, { t: "dust", rate: .2, area: [0, 30, 100, 95], warm: 1 }, { t: "smoke", x: 29, y: 12, rate: .03, s: .8 }], night: "zima-noc/mesto-trziste-noc", winter: "zima-noc/mesto-trziste-zima" },
    brana: { lights: [[93, 40, 7, 1]], emit: [{ t: "sparks", x: 93, y: 41, w: 1.5, rate: .12 }, { t: "mist", area: [30, 45, 85, 62], rate: .05 }, { t: "birds", rate: .004 }],
      night: "zima-noc/mesto-brana-noc", winter: "zima-noc/mesto-brana-zima" },
    kolbiste: { emit: [{ t: "dust", rate: .25, area: [10, 50, 90, 95], warm: 1 }, { t: "birds", rate: .004 }], winter: "zima-noc/mesto-kolbiste-zima" },
    radnice: { emit: [{ t: "dust", rate: .15, area: [10, 10, 90, 90], warm: 1 }], indoor: true },
    banka: { emit: [{ t: "dust", rate: .15, area: [10, 10, 90, 90], warm: 1 }], indoor: true },
    zverinec: { emit: [{ t: "dust", rate: .15, area: [0, 40, 100, 95], warm: 1 }, { t: "birds", rate: .004 }] },
    dum: { emit: [{ t: "dust", rate: .12, area: [10, 10, 90, 90], warm: 1 }], indoor: true },
    paserak: { emit: [{ t: "mist", area: [0, 60, 100, 95], rate: .06 }], indoor: true, dark: true },
    vyprava: { emit: [{ t: "mist", area: [0, 55, 100, 85], rate: .08 }, { t: "leaves", rate: .05 }, { t: "dust", rate: .15, area: [30, 0, 70, 70], warm: 1 }] },
    boj: { emit: [{ t: "mist", area: [0, 60, 100, 90], rate: .1 }, { t: "leaves", rate: .03 }], dark: true },
    podzemi: { emit: [{ t: "dust", rate: .2, area: [0, 0, 100, 100] }, { t: "mist", area: [0, 70, 100, 100], rate: .04 }], indoor: true, dark: true },
  };
  ["zbrojir", "strelmistr", "apatykar", "krejci", "pisar", "vetesnik", "pokoj"].forEach((k) => {
    CFG[k] = { emit: [{ t: "dust", rate: .15, area: [10, 10, 90, 90], warm: 1 }], indoor: true };
  });
  // r27: statek za hradbami (kouř z komína, ptáci, prach na dvoře; obrázky v img/statek/)
  CFG.statek = { emit: [{ t: "smoke", x: 30, y: 18, rate: .05, s: .8 }, { t: "birds", rate: .006 }, { t: "dust", rate: .15, area: [10, 55, 90, 95], warm: 1 }],
    night: "statek/statek-dvur-noc", winter: "statek/statek-dvur-zima" };
  // Hostinec má noční verzi okna.
  CFG.hostinec.night = "zima-noc/mesto-hostinec-noc";
  // obchodníci mají vlastní obrázky; efekty berou z nejbližšího místa
  const ALIAS = { "mesto-kovar": "kovar", "mesto-hostinec": "hostinec", "mesto-chram": "chram", "mesto-lazebnik": "lazne",
    "mesto-trziste": "trziste", "mesto-brana": "brana", "mesto-kolbiste": "kolbiste", "mesto-radnice": "radnice",
    "mesto-banka": "banka", "mesto-zverinec": "zverinec", "mesto-dum": "dum", "mesto-paserak": "paserak", "mesto-mapa": "mapa",
    "mesto-zbrojir": "zbrojir", "mesto-strelmistr": "strelmistr", "mesto-apatykar": "apatykar", "mesto-krejci": "krejci",
    "mesto-pisar": "pisar", "mesto-vetesnik": "vetesnik", "mesto-pokoj": "pokoj", "statek/statek-dvur": "statek" };

  const W = { night: false, eve: false, season: "léto", weather: "jasno", forced: null };
  const live = new Set();
  let base = "img/";
  const mobile = () => innerWidth < 800;
  const url = (name) => base + name + (mobile() ? "-m" : "") + ".webp";

  /** Aktuální svět (ze serveru). */
  function setWorld(w) {
    if (!w) return;
    W.night = !!w.night; W.eve = ["svítání", "soumrak", "večer"].includes(w.phase);
    W.season = w.season || W.season; W.weather = w.weather || W.weather;
    live.forEach((s) => s.apply());
  }
  const weather = () => W.forced || W.weather;

  function pickImage(img, cfg, indoor) {
    if (!indoor && W.season === "zima" && cfg.winter) return cfg.winter;
    if (W.night && cfg.night) return cfg.night;
    return img;
  }

  /** Vytvoří živou scénu v elementu `host`. img = název obrázku bez přípony. */
  function mount(host, img, key, opts = {}) {
    const cfg = CFG[key || ALIAS[img]] || { emit: [{ t: "dust", rate: .12, area: [0, 0, 100, 100], warm: 1 }] };
    const indoor = !!(cfg.indoor || opts.indoor);
    const el = document.createElement("div");
    el.className = "stage" + (cfg.still || opts.still ? " still" : "") + (cfg.dark ? " dark" : "");
    let h = `<div class="cam"><div class="pic"><img class="bg" alt="" decoding="async">`;
    (cfg.lights || []).forEach((l) => { h += `<div class="glow" data-f="${l[3] || 0}" style="left:${l[0]}%;top:${l[1]}%;width:${l[2]}%"></div>`; });
    (cfg.rays || []).forEach((r) => { h += `<div class="rays" style="left:${r[0]}%;top:${r[1]}%;width:${r[2]}%;height:${r[3]}%;transform:rotate(-${r[4]}deg)"></div>`; });
    h += `<canvas class="fx"></canvas><div class="overlay"></div></div><div class="night"></div><div class="frost"></div><div class="flash"></div></div><div class="vig"></div>`;
    el.innerHTML = h;
    host.prepend(el);
    const s = { el, cfg, indoor, img, P: [], sized: 0, cam: el.querySelector(".cam"), pic: el.querySelector(".pic"),
      bg: el.querySelector("img.bg"), cv: el.querySelector("canvas.fx"),
      glows: [...el.querySelectorAll(".glow")].map((g) => ({ g, f: g.dataset.f === "1", ph: R() * 9 })) };
    s.cx = s.cv.getContext("2d");
    const fit = () => {
      if (!el.isConnected) return;
      const cw = s.cam.clientWidth, ch = s.cam.clientHeight, iw = s.bg.naturalWidth || 1536, ih = s.bg.naturalHeight || 1024;
      const k = opts.contain ? Math.min(cw / iw, ch / ih) : Math.max(cw / iw, ch / ih), w = iw * k, hh = ih * k;
      Object.assign(s.pic.style, { left: (cw - w) / 2 + "px", top: (ch - hh) / 2 + "px", width: w + "px", height: hh + "px" });
      s.sized = 0;
    };
    s.fit = fit;
    s.apply = () => {
      const want = url(pickImage(img, cfg, indoor));
      if (s.bg.getAttribute("src") !== want) {
        s.bg.onerror = () => { if (s.bg.getAttribute("src") !== url(img)) s.bg.src = url(img); };
        s.bg.src = want;
      }
      const usesNightImg = W.night && cfg.night && !(W.season === "zima" && cfg.winter && !indoor);
      el.classList.toggle("is-night", W.night && !usesNightImg);
      el.classList.toggle("is-night-img", !!usesNightImg);
      el.classList.toggle("is-eve", W.eve && !W.night);
      el.classList.toggle("is-winter", W.season === "zima" && !indoor && !(cfg.winter));
      el.classList.toggle("is-rain", !indoor && ["déšť", "bouřka"].includes(weather()));
      el.classList.toggle("is-fog", !indoor && weather() === "mlha");
      el.classList.toggle("is-frost", !indoor && weather() === "mráz");
      el.classList.toggle("is-hot", !indoor && weather() === "vedro");
    };
    s.bg.onload = fit;
    s.apply();
    setTimeout(fit, 60);
    if (!opts.still && !cfg.still) {
      el.addEventListener("pointermove", (e) => {
        if (e.pointerType !== "mouse") return;
        const r = el.getBoundingClientRect(), dx = (e.clientX - r.left) / r.width - .5, dy = (e.clientY - r.top) / r.height - .5;
        s.cam.style.transform = `translate(${-dx * 2}%,${-dy * 1.6}%)`;
      });
    }
    s.burst = (x, y, n = 30, color) => { for (let i = 0; i < n; i++) s.P.push({ k: "spark", x, y, vx: (R() - .5) * .012, vy: -R() * .012, g: .0003, l: 1, c: color }); };
    s.shake = () => { el.classList.remove("shake"); void el.offsetWidth; el.classList.add("shake"); };
    s.destroy = () => { live.delete(s); el.remove(); };
    live.add(s);
    return s;
  }

  // ---------------------------------------------------------------- částice
  function spawn(s, e) {
    const a = e.area || [0, 0, 100, 100];
    switch (e.t) {
      case "sparks": s.P.push({ k: "spark", x: (e.x + (R() - .5) * e.w) / 100, y: e.y / 100, vx: (R() - .5) * .0012, vy: -(.002 + R() * .003), l: 1 }); break;
      case "anvil": for (let i = 0; i < 14; i++) s.P.push({ k: "spark", x: e.x / 100, y: e.y / 100, vx: (R() - .5) * .01, vy: -R() * .008, g: .0004, l: 1 });
        if ((typeof Zvuk !== "undefined")) Zvuk.sfx("kovadlina"); break;
      case "smoke": s.P.push({ k: "smoke", x: e.x / 100 + (R() - .5) * .02, y: e.y / 100, r: .012 * (e.s || 1), vx: .0002 + R() * .0002 + wind() * .002, vy: -.0005, a: .22, c: "190,180,170" }); break;
      case "incense": s.P.push({ k: "smoke", x: e.x / 100 + (R() - .5) * .01, y: e.y / 100, r: .006, vx: Math.sin(Date.now() / 900) * .0003, vy: -.0007, a: .18, c: "235,225,210", grow: .00018 }); break;
      case "steam": s.P.push({ k: "smoke", x: (e.x + (R() - .5) * e.w) / 100, y: e.y / 100, r: .02, vx: (R() - .5) * .0003, vy: -.0006 - R() * .0004, a: .2, c: "240,240,236", grow: .0005 }); break;
      case "dust": s.P.push({ k: "dust", x: (a[0] + R() * (a[2] - a[0])) / 100, y: (a[1] + R() * (a[3] - a[1])) / 100, vx: (R() - .5) * .0002, vy: (R() - .5) * .00015, l: 1, warm: e.warm }); break;
      case "mist": s.P.push({ k: "smoke", x: (a[0] + R() * (a[2] - a[0])) / 100, y: (a[1] + R() * (a[3] - a[1])) / 100, r: .08 + R() * .06, vx: .0002 + R() * .0002, vy: 0, a: .16, c: "215,222,228", grow: .0001, dec: .0004 }); break;
      case "leaves": s.P.push({ k: "leaf", x: R() * 1.1 - .05, y: -.03, vx: .0006 + R() * .0006 + wind() * .004, vy: .0012 + R() * .001, rot: R() * 6, vr: (R() - .5) * .08, p: R() * 6,
        c: (W.season === "jaro" || W.season === "léto" ? ["#6b7d2a", "#8a9a3a", "#55691f"] : ["#b5651d", "#c9a227", "#8b3a1a", "#a0522d"])[R() * 3 | 0], l: 1 }); break;
      case "birds": if (!W.night && weather() !== "bouřka") s.P.push({ k: "bird", x: -.05, y: .08 + R() * .25, vx: .0018 + R() * .001, p: R() * 6, n: 3 + (R() * 4 | 0), l: 1 }); break;
    }
  }
  const wind = () => (weather() === "silný vítr" ? 1 : weather() === "vítr" ? .5 : weather() === "bouřka" ? .7 : 0);

  let flashT = 0;
  function frame(t) {
    live.forEach((s) => {
      if (!s.el.isConnected) { live.delete(s); return; }
      const cv = s.cv, cx = s.cx;
      if (!s.sized) { const r = cv.getBoundingClientRect(); cv.width = Math.max(1, r.width); cv.height = Math.max(1, r.height); s.sized = 1; }
      const w = cv.width, h = cv.height, out = !s.indoor, wx = weather();
      cx.clearRect(0, 0, w, h);
      (s.cfg.emit || []).forEach((e) => { if (R() < e.rate) spawn(s, e); });
      if (out) {
        if (wx === "déšť") for (let i = 0; i < 6; i++) s.P.push({ k: "rain", x: R() * 1.2 - .1, y: -.05, l: 1, v: 1 });
        if (wx === "bouřka") {
          for (let i = 0; i < 11; i++) s.P.push({ k: "rain", x: R() * 1.3 - .15, y: -.05, l: 1, v: 1.4 });
          if (R() < .0025 && t - flashT > 4000) { flashT = t; s.el.classList.remove("lightning"); void s.el.offsetWidth; s.el.classList.add("lightning"); if ((typeof Zvuk !== "undefined")) setTimeout(() => Zvuk.sfx("hrom"), 400 + R() * 1400); }
        }
        if ((wx === "sníh" || (W.season === "zima" && wx !== "jasno" && wx !== "mráz")) && R() < .75) s.P.push({ k: "snow", x: R() * 1.1 - .05, y: -.02, z: R(), p: R() * 6, l: 1 });
        if (wx === "mlha" && R() < .12) s.P.push({ k: "smoke", x: -.1, y: .2 + R() * .75, r: .12 + R() * .1, vx: .0006 + R() * .0005, vy: 0, a: .2, c: "210,216,222", grow: .0001, dec: .00025 });
        if (wind() && R() < .03 * wind() && W.season !== "zima") spawn(s, { t: "leaves" });
        if (wind() && R() < .05) s.P.push({ k: "streak", x: -.1, y: R(), l: 1, v: .01 + R() * .01 });
        if (wx === "vedro" && R() < .05) s.P.push({ k: "dust", x: R(), y: .4 + R() * .6, vx: .0002, vy: -.0002, l: 1, warm: 1 });
        if (W.night && R() < .02 && W.season !== "zima") s.P.push({ k: "fly", x: R(), y: .55 + R() * .4, p: R() * 6, l: 1 });
      }
      if (s.cfg.clouds && R() < .004) s.P.push({ k: "cloud", x: -.3, y: R() * .8, r: .25 + R() * .2, vx: .0003 + wind() * .0006, l: 1 });
      for (let i = s.P.length - 1; i >= 0; i--) {
        const p = s.P[i];
        switch (p.k) {
          case "spark": p.x += p.vx; p.y += p.vy; p.vy += p.g || 0; p.vx += Math.sin(t / 200 + i) * .00005; p.l -= .014;
            cx.fillStyle = p.c ? `rgba(${p.c},${p.l})` : `rgba(255,${150 + 90 * p.l | 0},60,${p.l})`; cx.beginPath(); cx.arc(p.x * w, p.y * h, 1 + 1.4 * p.l, 0, 7); cx.fill(); break;
          case "smoke": p.x += p.vx; p.y += p.vy; p.r += p.grow || .00025; p.a -= p.dec || .0009; if (p.a <= 0) { p.l = 0; break; }
            { const g = cx.createRadialGradient(p.x * w, p.y * h, 0, p.x * w, p.y * h, p.r * w); g.addColorStop(0, `rgba(${p.c},${p.a})`); g.addColorStop(1, `rgba(${p.c},0)`); cx.fillStyle = g; cx.beginPath(); cx.arc(p.x * w, p.y * h, p.r * w, 0, 7); cx.fill(); } break;
          case "dust": p.x += p.vx; p.y += p.vy; p.l -= .003; { const a = Math.sin(p.l * 3.14) * .5; cx.fillStyle = p.warm ? `rgba(255,230,180,${a})` : `rgba(255,255,255,${a})`; cx.beginPath(); cx.arc(p.x * w, p.y * h, 1.2, 0, 7); cx.fill(); } break;
          case "leaf": p.x += p.vx + Math.sin(t / 700 + p.p) * .0008; p.y += p.vy; p.rot += p.vr; if (p.y > 1.05 || p.x > 1.1) p.l = 0;
            cx.save(); cx.translate(p.x * w, p.y * h); cx.rotate(p.rot); cx.scale(1, Math.abs(Math.sin(t / 300 + p.p)) + .2); cx.fillStyle = p.c; cx.beginPath(); cx.ellipse(0, 0, 6, 3, 0, 0, 7); cx.fill(); cx.restore(); break;
          case "bird": p.x += p.vx; p.p += .25; if (p.x > 1.1) p.l = 0; cx.strokeStyle = "rgba(30,25,20,.7)"; cx.lineWidth = 1.4;
            for (let b = 0; b < p.n; b++) { const bx = (p.x - b * .025) * w, by = (p.y + (b % 2) * .02 + Math.sin(p.p + b) * .004) * h, wy = Math.sin(p.p * 1.3 + b) * 4; cx.beginPath(); cx.moveTo(bx - 6, by - wy); cx.quadraticCurveTo(bx - 3, by - 2, bx, by); cx.quadraticCurveTo(bx + 3, by - 2, bx + 6, by - wy); cx.stroke(); } break;
          case "rain": p.x -= .003 * p.v + wind() * .004; p.y += .03 * p.v; if (p.y > 1.05) p.l = 0; cx.strokeStyle = "rgba(200,212,230,.4)"; cx.lineWidth = 1; cx.beginPath(); cx.moveTo(p.x * w, p.y * h); cx.lineTo(p.x * w + 4 + wind() * 6, p.y * h - 14); cx.stroke(); break;
          case "snow": p.y += .0011 * (.4 + p.z); p.x += Math.sin(t / 900 + p.p) * .0006 + wind() * .002; if (p.y > 1.02) p.l = 0;
            { const r = .6 + 1.3 * p.z * p.z, a = .25 + .4 * p.z, g = cx.createRadialGradient(p.x * w, p.y * h, 0, p.x * w, p.y * h, r * 1.8); g.addColorStop(0, `rgba(236,240,248,${a})`); g.addColorStop(1, "rgba(236,240,248,0)"); cx.fillStyle = g; cx.beginPath(); cx.arc(p.x * w, p.y * h, r * 1.8, 0, 7); cx.fill(); } break;
          case "streak": p.x += p.v; if (p.x > 1.2) p.l = 0; cx.strokeStyle = "rgba(230,230,220,.07)"; cx.lineWidth = 1; cx.beginPath(); cx.moveTo(p.x * w, p.y * h); cx.lineTo(p.x * w - 120, p.y * h + 4); cx.stroke(); break;
          case "fly": p.p += .05; p.x += Math.sin(p.p) * .0008; p.y += Math.cos(p.p * .7) * .0005; p.l -= .004;
            { const a = Math.max(0, Math.sin(p.p * 2)) * p.l; cx.fillStyle = `rgba(220,255,140,${a})`; cx.beginPath(); cx.arc(p.x * w, p.y * h, 1.6, 0, 7); cx.fill(); } break;
          case "cloud": p.x += p.vx; if (p.x > 1.3) p.l = 0; { const g = cx.createRadialGradient(p.x * w, p.y * h, 0, p.x * w, p.y * h, p.r * w); g.addColorStop(0, "rgba(40,30,20,.13)"); g.addColorStop(1, "rgba(40,30,20,0)"); cx.fillStyle = g; cx.beginPath(); cx.arc(p.x * w, p.y * h, p.r * w, 0, 7); cx.fill(); } break;
        }
        if (p.l <= 0 || p.y < -.2) s.P.splice(i, 1);
      }
      if (s.P.length > 900) s.P.splice(0, s.P.length - 900);
      const dim = out && ["déšť", "bouřka"].includes(wx);
      s.glows.forEach((o) => {
        const k = o.f ? .75 + .15 * Math.sin(t / 90 + o.ph) + .1 * Math.sin(t / 37 + o.ph * 2) + (R() - .5) * .1 : .65 + .12 * Math.sin(t / 150 + o.ph) + (R() - .5) * .14;
        o.g.style.opacity = (dim && !o.f ? k * .7 : k) * (W.night ? 1.25 : 1);
        o.g.style.transform = `translate(-50%,-50%) scale(${.94 + k * .1})`;
      });
    });
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  addEventListener("resize", () => live.forEach((s) => s.fit()));

  const indoor = (img) => !!(CFG[ALIAS[img] || img] || {}).indoor;
  return { mount, setWorld, indoor, W, setBase: (b) => { base = b; }, force: (w) => { W.forced = w || null; live.forEach((s) => s.apply()); } };
})();
