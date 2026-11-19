/*
Projet : Monnaie XP  ·  Version : 2.1.0  ·  Date : 19/11/2026
Auteur : Tom Rougeaud  ·  Licence : CC BY-NC 4.0
Réalisé avec l’aide de l’IA : Claude Sonnet 5.5 (Anthropic)
*/

/* ===== SECTION : Cache hors ligne ===== */
/* Le nom du cache change à chaque version : sinon les anciens fichiers resteraient servis. */
var CACHE="monnaiexp-v2.1.0";
var FICHIERS=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./icon-512-maskable.png"];

/* installation : met les fichiers en cache (chemins relatifs : fonctionne dans un sous-dossier GitHub Pages) */
self.addEventListener("install",function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(FICHIERS);}));
});
/* activation : supprime les caches des anciennes versions (les données du joueur, dans localStorage, ne sont pas touchées) */
self.addEventListener("activate",function(e){
  e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));
});
/* l’appli demande la mise à jour quand la personne appuie sur « Mettre à jour » */
self.addEventListener("message",function(e){if(e.data==="skipWaiting")self.skipWaiting();});
/* réseau d’abord pour la page (nouvelle version dès qu’il y a du réseau), cache sinon ; cache d’abord pour le reste */
self.addEventListener("fetch",function(e){
  if(e.request.method!=="GET")return;
  var nav=e.request.mode==="navigate";
  e.respondWith(nav
    ?fetch(e.request).then(function(r){var cp=r.clone();caches.open(CACHE).then(function(c){c.put("./index.html",cp);});return r;}).catch(function(){return caches.match("./index.html");})
    :caches.match(e.request).then(function(r){return r||fetch(e.request);}));
});
