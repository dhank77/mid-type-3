/* chart.js — modul chart (di-load via dynamic import saat dibutuhkan) */
export function initChart(box) {
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
