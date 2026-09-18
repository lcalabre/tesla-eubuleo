// Il tachimetro deve funzionare in galleria e in montagna, cioe' senza rete.
// Le pagine si chiedono prima alla rete (cosi' gli aggiornamenti arrivano) e si ripiega
// sulla copia; il resto si serve dalla copia e si aggiorna in sottofondo.
const DEPOSITO = "tachimetro-v1";
const BASE = ["", "index.html", "tachimetro.html", "manifest.webmanifest",
              "icona-192.png", "icona-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(DEPOSITO).then(c => c.addAll(BASE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(chiavi => Promise.all(chiavi.filter(k => k !== DEPOSITO).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  const richiesta = e.request;
  if (richiesta.method !== "GET") return;
  const pagina = richiesta.mode === "navigate" ||
                 (richiesta.headers.get("accept") || "").includes("text/html");
  if (pagina) {
    e.respondWith(fetch(richiesta)
      .then(r => { const copia = r.clone();
                   caches.open(DEPOSITO).then(c => c.put(richiesta, copia)); return r; })
      .catch(() => caches.match(richiesta).then(r => r || caches.match("tachimetro.html"))));
    return;
  }
  e.respondWith(caches.match(richiesta).then(salvata => salvata || fetch(richiesta)
    .then(r => { if (r.ok && new URL(richiesta.url).origin === location.origin) {
                   const copia = r.clone();
                   caches.open(DEPOSITO).then(c => c.put(richiesta, copia)); }
                 return r; })
    .catch(() => salvata)));
});
