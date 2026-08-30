(function () {
  function currentUrl() {
    return location.pathname + location.search + location.hash;
  }

  // Keep one global Histats queue/loader for the lifetime of the SPA.
  window._Hasync = window._Hasync || [];

  if (window.__yyxvtTrackPage) {
    if (window.__yyxvtHistatsReadyState) {
      setTimeout(function () {
        window.__yyxvtTrackPage(currentUrl());
      }, 0);
    }
    return;
  }

  window.__yyxvtTrackedPages = window.__yyxvtTrackedPages || Object.create(null);
  window.__yyxvtTrackPage = function (url) {
    var current = String(url || currentUrl());
    if (!current || !window.__yyxvtHistatsReadyState) return false;
    if (window.__yyxvtTrackedPages[current]) return false;

    window.__yyxvtTrackedPages[current] = true;
    window._Hasync.push(['Histats.track_hits', '']);
    return true;
  };

  if (window.__yyxvtHistatsReadyState) {
    setTimeout(function () {
      window.__yyxvtTrackPage(currentUrl());
    }, 0);
    return;
  }

  if (window.__yyxvtHistatsLoaderStarted) return;

  var existing = document.querySelector('script[data-histats="1"]');
  if (existing) {
    window.__yyxvtHistatsLoaderStarted = true;
    return;
  }

  window.__yyxvtHistatsLoaderStarted = true;

  window._Hasync.push([
    'Histats.start',
    '1,4671415,4,0,0,0,00010000'
  ]);
  window._Hasync.push(['Histats.fasi', '1']);

  var hs = document.createElement('script');
  hs.type = 'text/javascript';
  hs.async = true;
  hs.dataset.histats = '1';
  hs.src = 'https://s10.histats.com/js15_as.js';

  hs.onload = function () {
    window.__yyxvtHistatsReadyState = true;
    window.__yyxvtHistatsLoaderStarted = false;
    window.dispatchEvent(new Event('histats-ready'));
    setTimeout(function () {
      window.__yyxvtTrackPage(currentUrl());
    }, 0);
  };

  hs.onerror = function () {
    window.__yyxvtHistatsReadyState = false;
    window.__yyxvtHistatsLoaderStarted = false;
    console.warn('[Histats] script load failed');
  };

  (document.head || document.body || document.documentElement).appendChild(hs);
})();
