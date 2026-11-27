/* r27-5: Královské stezky jako aplikace na ploše (PWA).
   Stránky a skripty se berou vždy čerstvé ze sítě (hra se často aktualizuje); uložená kopie se použije jen bez signálu.
   Dotazy na herní server (API) se nikdy neukládají. */
const CACHE = "stezky-v1";
const ZAKLAD = ["./", "index.html", "hra.css", "hra.js", "kampan.js", "jazyky.js", "obsah-jazyky.js", "postava.js", "scena.js", "zvuk.js", "ikona-192.png"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ZAKLAD)).catch(() => {})); self.skipWaiting(); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((k) => Promise.all(k.filter((x) => x !== CACHE).map((x) => caches.delete(x))))); self.clients.claim(); });
self.addEventListener("fetch", (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;     // API, obrázky a písma jdou mimo
  e.respondWith(fetch(e.request).then((r) => {
    if (r.ok) { const k = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, k)); }
    return r;
  }).catch(() => caches.match(e.request).then((r) => r || caches.match("index.html"))));
});
