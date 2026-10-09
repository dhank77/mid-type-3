/* analytics.js — pelacakan pengunjung sederhana (tidak dibutuhkan untuk menampilkan konten) */
window.dataLayer = window.dataLayer || [];
function track(event, data) {
  window.dataLayer.push({ event: event, data: data || {}, t: Date.now() });
}
track('page_view', { path: location.pathname, ref: document.referrer });
window.addEventListener('load', function () {
  track('page_loaded', { ms: Math.round(performance.now()) });
});
document.addEventListener('click', function (e) {
  var el = e.target.closest('[data-track]');
  if (el) track('click', { id: el.getAttribute('data-track') });
});
