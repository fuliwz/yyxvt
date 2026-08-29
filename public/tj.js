(function () {
  window._Hasync = window._Hasync || [];

  // Histats 初始化参数
  window._Hasync.push([
    'Histats.start',
    '1,4657865,4,0,0,0,00010000'
  ]);

  window._Hasync.push([
    'Histats.fasi',
    '1'
  ]);

  // 防止重复加载 Histats 主脚本
  if (document.querySelector('script[data-histats="1"]')) {
    return;
  }

  var hs = document.createElement('script');

  hs.type = 'text/javascript';
  hs.async = true;
  hs.dataset.histats = '1';
  hs.src = 'https://s10.histats.com/js15_as.js';

  hs.onload = function () {
    // 通知 Vue：Histats 已完成初始化，可以开始统计 SPA PV
    window.dispatchEvent(new Event('histats-ready'));
  };

  hs.onerror = function () {
    console.warn('[Histats] script load failed');
  };

  (document.head || document.body).appendChild(hs);
})();
