const CACHE = "abdos-66bc42be66b9", FONTS = "abdos-fonts", FILES = ["./", "assets/favicon.svg", "assets/icon-180.png", "assets/icon-192.png", "assets/icon-512.png", "assets/style.css", "assets/theme.js", "assets/timer.js", "dimanche.html", "img/dimanche-1.webp", "img/dimanche-2-arrivee.webp", "img/dimanche-2-depart.webp", "img/dimanche-3.webp", "img/dimanche-4.webp", "img/dimanche-5-1.webp", "img/dimanche-5-2.webp", "img/dimanche-5-3.webp", "img/dimanche-6.webp", "img/jeudi-1-arrivee.webp", "img/jeudi-1-depart.webp", "img/jeudi-2.webp", "img/jeudi-3-arrivee.webp", "img/jeudi-3-depart.webp", "img/jeudi-4-arrivee.webp", "img/jeudi-4-depart.webp", "img/lundi-1-arrivee.webp", "img/lundi-1-depart.webp", "img/lundi-2-arrivee.webp", "img/lundi-2-depart.webp", "img/lundi-3-arrivee.webp", "img/lundi-3-depart.webp", "img/lundi-4.webp", "img/mardi-1-arrivee.webp", "img/mardi-1-depart.webp", "img/mardi-2-arrivee.webp", "img/mardi-2-depart.webp", "img/mardi-3-arrivee.webp", "img/mardi-3-depart.webp", "img/mardi-4-arrivee.webp", "img/mardi-4-depart.webp", "img/mercredi-1-arrivee.webp", "img/mercredi-1-depart.webp", "img/mercredi-2-arrivee.webp", "img/mercredi-2-depart.webp", "img/mercredi-3-arrivee.webp", "img/mercredi-3-depart.webp", "img/mercredi-4.webp", "img/samedi-1.webp", "img/samedi-2.webp", "img/samedi-3-arrivee.webp", "img/samedi-3-depart.webp", "img/samedi-4-arrivee.webp", "img/samedi-4-depart.webp", "img/vendredi-1-arrivee.webp", "img/vendredi-1-depart.webp", "img/vendredi-2-arrivee.webp", "img/vendredi-2-depart.webp", "img/vendredi-3.webp", "img/vendredi-4-arrivee.webp", "img/vendredi-4-depart.webp", "index.html", "jeudi.html", "lundi.html", "manifest.webmanifest", "mardi.html", "mercredi.html", "samedi.html", "vendredi.html"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(k => k.startsWith("abdos-") && k !== CACHE && k !== FONTS).map(k => caches.delete(k))
  )).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET") return;
  if (url.origin === location.origin) {
    // site : d'abord le cache (hors ligne), sinon le réseau
    e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).catch(() =>
      req.mode === "navigate" ? caches.match("index.html") : Response.error())));
  } else if (url.hostname.endsWith("fonts.googleapis.com") || url.hostname.endsWith("fonts.gstatic.com")) {
    // polices : gardées après le premier chargement
    e.respondWith(caches.open(FONTS).then(c => c.match(req).then(hit => hit || fetch(req).then(res => {
      c.put(req, res.clone()); return res;
    }))));
  }
});
