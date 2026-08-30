(function () {
  window._Hasync = window._Hasync || [];

  // Same bootstrap pattern as yy1080: the first PV is queued together with
  // Histats.start, so the initial visit does not depend on Vue event timing.
  window._Hasync.push(['Histats.start', '1,4671415,4,0,0,0,00010000']);
  window._Hasync.push(['Histats.fasi', '1']);
  window._Hasync.push(['Histats.track_hits', '']);

  // Prevent loading the Histats library more than once.
  if (document.querySelector('script[data-histats="1"]')) {
    window.dispatchEvent(new Event('histats-ready'));
    return;
  }

  var hs = document.createElement('script');
  hs.type = 'text/javascript';
  hs.async = true;
  hs.dataset.histats = '1';
  hs.src = 'https://s10.histats.com/js15_as.js';

  hs.onload = function () {
    window.dispatchEvent(new Event('histats-ready'));
  };

  hs.onerror = function () {
    console.warn('[Histats] script load failed');
  };

  (document.head || document.body || document.documentElement).appendChild(hs);
})();
