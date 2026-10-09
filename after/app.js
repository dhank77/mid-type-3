/* app.js — hanya fitur ringan yang jalan di awal; chart dimuat lazy (code splitting) */
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

function initForm() {
  var form = document.getElementById('reserve');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    document.getElementById('form-msg').textContent =
      'Terima kasih, ' + form.elements.name.value + '! Reservasi Anda kami terima.';
    form.reset();
  });
}

/* Chart: modul terpisah, hanya diunduh saat section mendekati viewport */
function lazyChart() {
  var box = document.getElementById('chart');
  var io = new IntersectionObserver(function (entries) {
    if (!entries[0].isIntersecting) return;
    io.disconnect();
    import('./chart.min.js').then(function (m) { m.initChart(box); });
  }, { rootMargin: '300px' });
  io.observe(box);
}

/* defer menjamin DOM sudah siap — tidak perlu DOMContentLoaded */
initMenuTabs();
initCounters();
initForm();
lazyChart();
