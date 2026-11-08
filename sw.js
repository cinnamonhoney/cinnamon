// cinnamon: guarda la app en el celular para que abra sin internet.
// Primero intenta internet (así siempre ves la versión más nueva) y, si no hay, usa lo guardado.
const CACHE = "cinnamon-v2";
const CORE = ["./", "index.html", "manifest.webmanifest", "favicon.png", "icon-180.png", "icon-192.png", "icon-512.png",
  "img/acc-collar.webp","img/acc-gorrito.webp","img/acc-lacito.webp","img/acc-panuelo.webp","img/bb-abierto.webp","img/bb-bano.webp","img/bb-cerrado.webp","img/bb-comiendo.webp","img/bb-durmiendo.webp","img/bb-escuchando.webp","img/bb-hablando.webp","img/bb-pelota.webp","img/bb-triste.webp","img/cerezo-1.webp","img/cerezo-2.webp","img/cerezo-3.webp","img/cerezo-4.webp","img/cerezo-5.webp","img/ciudad-amsterdam.webp","img/ciudad-barcelona.webp","img/ciudad-florencia.webp","img/ciudad-granada.webp","img/ciudad-londres.webp","img/ciudad-madrid.webp","img/ciudad-milan.webp","img/ciudad-paris.webp","img/ciudad-roma.webp","img/ciudad-venecia.webp","img/conejito.webp","img/fondo-cocina.webp","img/fondo-colina.webp","img/fondo-jardin.webp","img/fondo-mapa.webp","img/fondo-noche.webp","img/munai-abierto.webp","img/munai-bano.webp","img/munai-cerrado.webp","img/munai-comiendo.webp","img/munai-durmiendo.webp","img/munai-escuchando.webp","img/munai-hablando.webp","img/munai-pelota.webp","img/munai-triste.webp","img/obj-croquetas.webp","img/obj-galletita.webp","img/obj-huesito.webp","img/obj-moneda.webp","img/obj-pelota.webp","img/ovejita.webp","img/paleta.webp","img/papel.webp","img/petalo-1.webp","img/petalo-2.webp","img/petalo-3.webp","img/pin-corazon.webp","img/pincel.webp"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  e.respondWith(
    fetch(req)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        return res;
      })
      .catch(() =>
        caches.match(req, { ignoreSearch: true })
          .then(hit => hit || (req.mode === "navigate" ? caches.match("index.html") : null))
          .then(hit => hit || Response.error())
      )
  );
});
