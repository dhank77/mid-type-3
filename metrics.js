/* metrics.js — alat ukur untuk demo (bukan bagian dari optimasi).
   Menampilkan FCP, DOMContentLoaded, dan load di pojok halaman. */
(function () {
  var m = {};
  new PerformanceObserver(function (list) {
    list.getEntries().forEach(function (e) {
      if (e.name === 'first-contentful-paint') { m.fcp = Math.round(e.startTime); render(); }
    });
  }).observe({ type: 'paint', buffered: true });

  document.addEventListener('DOMContentLoaded', function () {
    m.dcl = Math.round(performance.now()); render();
  });
  window.addEventListener('load', function () {
    m.load = Math.round(performance.now()); render();
  });

  var box;
  function render() {
    if (!document.body) return;
    if (!box) {
      box = document.createElement('div');
      box.className = 'badge-metrics';
      document.body.appendChild(box);
    }
    box.innerHTML =
      'FCP ' + (m.fcp != null ? m.fcp + ' ms' : '…') + '<br>' +
      'DOMContentLoaded ' + (m.dcl != null ? m.dcl + ' ms' : '…') + '<br>' +
      'load ' + (m.load != null ? m.load + ' ms' : '…');
    window.parent !== window && window.parent.postMessage({ metrics: m, page: location.pathname, search: location.search }, '*');
  }
})();
