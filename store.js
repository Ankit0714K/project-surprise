/* Tiny storage layer. MVP uses the browser's localStorage so everything works
   offline in VS Code. Swap these functions for API calls when you add a backend. */
(function () {
  const KEY = "ps_sites_v1";

  const read = () => {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
  };
  const write = (list) => localStorage.setItem(KEY, JSON.stringify(list));

  const uid = () => Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-3);

  const store = {
    all: read,
    get: (id) => read().find((s) => s.id === id),
    save(site) {
      const list = read();
      const i = list.findIndex((s) => s.id === site.id);
      if (i >= 0) list[i] = site; else list.unshift(site);
      try { write(list); return true; }
      catch (e) { alert("Browser storage is full. Use fewer/smaller photos or delete old sites in Admin."); return false; }
    },
    remove(id) { write(read().filter((s) => s.id !== id)); },
    replaceAll(list) { write(list); },
    uid,
    linkFor(id) {
      const base = location.href.replace(/[^/]*$/, "");
      return base + "view.html?id=" + encodeURIComponent(id);
    },
    /* Text-only sites can also travel inside the URL itself (works on another device). */
    toHash(data) {
      const slim = { ...data, photos: [] };
      return btoa(unescape(encodeURIComponent(JSON.stringify(slim))));
    },
    fromHash(h) {
      try { return JSON.parse(decodeURIComponent(escape(atob(h)))); } catch { return null; }
    },
  };
  window.Store = store;
})();
