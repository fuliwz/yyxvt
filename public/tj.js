(function () {
  if (window.__yyxvtHistatsLoaderStarted) return;
  window.__yyxvtHistatsLoaderStarted = true;

  window._Hasync = window._Hasync || [];

  // Histats 初始化参数。只初始化一次，避免 SPA 路由切换重复初始化。
  window._Hasync.push([
    'Histats.start',
    '1,4671415,4,0,0,0,00010000'
  ]);
  window._Hasync.push(['Histats.fasi', '1']);

  var readyResolve;
  window.__yyxvtHistatsReady = new Promise(function (resolve) {
    readyResolve = resolve;
  });

  function markReady() {
    if (window.__yyxvtHistatsReadyState) return;
    window.__yyxvtHistatsReadyState = true;
    readyResolve(true);
    window.dispatchEvent(new Event('histats-ready'));
  }

  var hs = document.createElement('script');
  hs.type = 'text/javascript';
  hs.async = true;
  hs.dataset.histats = '1';
  hs.src = 'https://s10.histats.com/js15_as.js';
  hs.onload = markReady;
  hs.onerror = function () {
    console.warn('[Histats] script load failed');
    // Keep the promise pending: tracking must not pretend it succeeded.
  };

  (document.head || document.body || document.documentElement).appendChild(hs);

  // One stable API for Vue. It queues PV hits only after Histats has loaded.
  window.__yyxvtTrackPage = function (url) {
    var currentUrl = String(url || (location.pathname + location.search + location.hash));
    if (!currentUrl) return false;

    var state = window.__yyxvtTrackedPages || (window.__yyxvtTrackedPages = Object.create(null));
    if (state[currentUrl]) return false;
    if (!window.__yyxvtHistatsReadyState) return false;

    // Histats' documented queue API is retained; the loaded js15_as.js
    // consumes the queued command.
    window._Hasync = window._Hasync || [];
    window._Hasync.push(['Histats.track_hits', '']);
    state[currentUrl] = true;
    return true;
  };
})();
