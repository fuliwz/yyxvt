(function () {
  function currentUrl() {
    return location.pathname + location.search + location.hash;
  }

  window._Hasync = window._Hasync || [];
  window.__yyxvtTrackedPages = window.__yyxvtTrackedPages || Object.create(null);

  // Expose the tracking API before loading Histats so App.vue can safely
  // call it as soon as the ready state becomes true.
  window.__yyxvtTrackPage = function (url) {
    var current = String(url || currentUrl());
    if (!current || window.__yyxvtTrackedPages[current]) return false;
    if (!window.__yyxvtHistatsReadyState) return false;

    window._Hasync.push(['Histats.track_hits', '']);
    window.__yyxvtTrackedPages[current] = true;
    return true;
  };

  if (window.__yyxvtHistatsLoaderStarted || window.__yyxvtHistatsReadyState) {
    if (window.__yyxvtHistatsReadyState) {
      setTimeout(function () { window.__yyxvtTrackPage(currentUrl()); }, 0);
    }
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
    window.dispatchEvent(new Event('histats-ready'));
    setTimeout(function () {
      window.__yyxvtTrackPage(currentUrl());
    }, 0);
  };

  hs.onerror = function () {
    window.__yyxvtHistatsLoaderStarted = false;
    console.warn('[Histats] script load failed');
  };

  (document.head || document.body || document.documentElement).appendChild(hs);
})();
