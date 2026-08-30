(function () {
  function currentUrl() {
    return location.pathname + location.search + location.hash;
  }

  if (window.__yyxvtHistatsScriptLoaded) return;

  window._Hasync = window._Hasync || [];
  window.__yyxvtTrackedPages = window.__yyxvtTrackedPages || Object.create(null);
  window.__yyxvtHistatsReadyState = !!window.__yyxvtHistatsReadyState;
  window.__yyxvtHistatsScriptLoaded = true;

  window.__yyxvtTrackPage = function (url) {
    var current = String(url || currentUrl());
    if (!current || !window.__yyxvtHistatsReadyState) return false;
    if (window.__yyxvtLastTrackedUrl === current) return false;

    window.__yyxvtLastTrackedUrl = current;
    window._Hasync.push(['Histats.track_hits', '']);
    return true;
  };

  window._Hasync.push([
    'Histats.start',
    '1,4671415,4,0,0,0,00010000'
  ]);
  window._Hasync.push(['Histats.fasi', '1']);

  var existing = document.querySelector('script[data-histats="1"]');
  if (existing) {
    if (existing.dataset.loaded === '1') {
      window.__yyxvtHistatsReadyState = true;
      setTimeout(function () { window.__yyxvtTrackPage(currentUrl()); }, 0);
    }
    return;
  }

  var hs = document.createElement('script');
  hs.type = 'text/javascript';
  hs.async = true;
  hs.dataset.histats = '1';
  hs.src = 'https://s10.histats.com/js15_as.js';
  hs.onload = function () {
    hs.dataset.loaded = '1';
    window.__yyxvtHistatsReadyState = true;
    window.__yyxvtHistatsLoaderStarted = false;
    window.dispatchEvent(new Event('histats-ready'));
    setTimeout(function () { window.__yyxvtTrackPage(currentUrl()); }, 0);
  };
  hs.onerror = function () {
    window.__yyxvtHistatsReadyState = false;
    window.__yyxvtHistatsLoaderStarted = false;
    window.__yyxvtHistatsScriptLoaded = false;
    console.warn('[Histats] script load failed');
  };

  window.__yyxvtHistatsLoaderStarted = true;
  (document.head || document.body || document.documentElement).appendChild(hs);
})();
