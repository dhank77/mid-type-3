/* app.js — SEMUA fitur dimuat di awal (tab menu, form, chart, counter) */
document.addEventListener('DOMContentLoaded', function () {
  initMenuTabs();
  initCounters();
  initChart();
  initForm();
});

function initMenuTabs() {
  var tabs = document.querySelectorAll('.tab');
  var cards = document.querySelectorAll('.menu-card');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      var cat = tab.dataset.cat;
      cards.forEach(function (c) {
        c.classList.toggle('hidden', cat !== 'all' && c.dataset.cat !== cat);
      });
    });
  });
}

function initCounters() {
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var target = +el.dataset.count, n = 0, step = Math.max(1, Math.round(target / 60));
    var id = setInterval(function () {
      n = Math.min(target, n + step);
      el.textContent = n.toLocaleString('id-ID');
      if (n >= target) clearInterval(id);
    }, 20);
  });
}

function initChart() {
  var box = document.getElementById('chart');
  var data = [
    ['Sen', 120], ['Sel', 150], ['Rab', 135], ['Kam', 190], ['Jum', 260], ['Sab', 340], ['Min', 310]
  ];
  box.innerHTML = '<canvas></canvas>';
  var c = box.firstChild, dpr = window.devicePixelRatio || 1;
  c.width = c.clientWidth * dpr; c.height = 260 * dpr;
  var g = c.getContext('2d'); g.scale(dpr, dpr);
  var w = c.clientWidth, h = 260, max = 360, bw = w / data.length;
  data.forEach(function (d, i) {
    var bh = (d[1] / max) * (h - 40);
    g.fillStyle = '#d9822b';
    g.fillRect(i * bw + bw * .2, h - 24 - bh, bw * .6, bh);
    g.fillStyle = '#5b3a29'; g.font = '12px system-ui'; g.textAlign = 'center';
    g.fillText(d[0], i * bw + bw / 2, h - 8);
    g.fillText(d[1], i * bw + bw / 2, h - 30 - bh);
  });
}

function initForm() {
  var form = document.getElementById('reserve');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    document.getElementById('form-msg').textContent =
      'Terima kasih, ' + form.elements.name.value + '! Reservasi Anda kami terima.';
    form.reset();
  });
}
