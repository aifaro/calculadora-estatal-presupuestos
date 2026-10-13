(function () {
  "use strict";
  var D = window.DATA, F = window.FUENTES;

  // ---------- Formato ----------
  function fmt(n, dec) {
    dec = dec || 0;
    var neg = n < 0; n = Math.abs(n);
    var s = n.toFixed(dec), parts = s.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return (neg ? "−" : "") + parts.join(",");
  }
  function meur(v, dec) { return fmt(v, dec || 0) + " M€"; }
  function bigEur(v) { // v en M€
    if (v >= 1e6) return fmt(v / 1e6, 2) + " billones €";
    return meur(v);
  }
  function pct(v, dec) { return fmt(v, dec === undefined ? 1 : dec) + " %"; }

  // Gasto anual en pensiones contributivas: nómina mensual × 14 pagas
  var GASTO_ANUAL = D.nomina.mensualMEUR * 14; // M€
  var GOAL1 = D.aapp2025.transferenciasEstadoASS;
  var GOAL2 = 0.038 * D.pib2025;

  function duracion(meurAmount) {
    var dias = meurAmount / GASTO_ANUAL * 365;
    var min = dias * 24 * 60;
    if (min < 90) return fmt(min, 0) + " minutos";
    var h = min / 60;
    if (h < 48) return fmt(h, h < 10 ? 1 : 0) + " horas";
    if (dias < 60) return fmt(dias, dias < 10 ? 1 : 0) + " días";
    return fmt(dias / 30.44, 1) + " meses";
  }

  // ---------- Tema ----------
  var root = document.documentElement;
  try { var saved = localStorage.getItem("tema"); if (saved) root.setAttribute("data-theme", saved); } catch (e) {}
  document.getElementById("themeToggle").addEventListener("click", function () {
    var dark = root.getAttribute("data-theme") ? root.getAttribute("data-theme") === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    var next = dark ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("tema", next); } catch (e) {}
    renderAll();
  });
  function css(name) { return getComputedStyle(root).getPropertyValue(name).trim(); }

  // ---------- Enlaces de datos ----------
  var afPorPension = D.afiliados.valor / D.nomina.pensiones;
  var binds = {
    actualizado: D.actualizado,
    nominaMensual: meur(D.nomina.mensualMEUR, 1),
    pensionesN: fmt(D.nomina.pensiones / 1e6, 2) + " M",
    afiliadosPorPension: fmt(afPorPension, 2),
    recaudacion2025: meur(D.recaudacion[D.recaudacion.length - 1].v),
    deudaTotal: bigEur(D.deuda.total),
    deudaPct: pct(D.deuda.pctPIB),
    deudaPorHab: fmt(Math.round(D.deuda.total / D.poblacion2026 / 100) * 100) + " €",
    deficit: meur(D.aapp2025.deficit),
    intereses: meur(D.aapp2025.intereses),
    ingresosAAPP: meur(D.aapp2025.ingresosNoFinancieros),
    ingresosPct: pct(D.aapp2025.ingresosPctPIB, 1),
    transfSS: meur(D.aapp2025.transferenciasEstadoASS),
    prestamosSS: meur(D.prestamosEstadoSS2023.v),
    pgePensiones: meur(190687),
    cofogPensiones: meur(165050 + 35425),
    gastoAnual: meur(GASTO_ANUAL),
    entes: fmt(D.entesAutonomicos.v),
    goal2: meur(GOAL2),
    paroEs: pct(D.paroJuvenil.es),
    paroUe: pct(D.paroJuvenil.ue),
    emanEs: fmt(D.emancipacion.es, 1),
    emanUe: fmt(D.emancipacion.ue, 1)
  };
  document.querySelectorAll("[data-bind]").forEach(function (el) {
    var k = el.getAttribute("data-bind");
    if (binds[k] !== undefined) el.textContent = binds[k];
  });

  // ---------- Contador ----------
  var eurPorSeg = GASTO_ANUAL * 1e6 / (365 * 24 * 3600);
  var t0 = performance.now(), ticker = document.getElementById("tickerHero");
  function tick() {
    var s = (performance.now() - t0) / 1000;
    ticker.textContent = fmt(s * eurPorSeg) + " €";
  }
  setInterval(tick, 100); tick();

  // ---------- Fuentes ----------
  var dlg = document.getElementById("srcDialog");
  document.addEventListener("click", function (e) {
    var b = e.target.closest(".src");
    if (!b) return;
    var s = F[b.getAttribute("data-src")];
    if (!s) return;
    document.getElementById("srcTitle").textContent = s.titulo;
    document.getElementById("srcDetail").textContent = s.detalle;
    document.getElementById("srcLink").href = s.url;
    if (dlg.showModal) dlg.showModal(); else window.open(s.url, "_blank", "noopener");
  });
  var ol = document.getElementById("sourcesList");
  Object.keys(F).forEach(function (k) {
    var s = F[k], li = document.createElement("li");
    li.id = "src-" + k;
    li.innerHTML = "<b></b><br><span></span><br><a target='_blank' rel='noopener'></a>";
    li.querySelector("b").textContent = s.titulo;
    li.querySelector("span").textContent = s.detalle;
    var a = li.querySelector("a"); a.href = s.url; a.textContent = s.url;
    ol.appendChild(li);
  });

  // ---------- Tooltip ----------
  var tip = document.getElementById("tooltip");
  function showTip(e, html) {
    tip.innerHTML = html; tip.hidden = false;
    var x = e.clientX, y = e.clientY;
    if (e.touches && e.touches[0]) { x = e.touches[0].clientX; y = e.touches[0].clientY; }
    var w = tip.offsetWidth, h = tip.offsetHeight;
    var left = Math.min(window.innerWidth - w - 8, Math.max(8, x + 14));
    var top = y - h - 12; if (top < 8) top = y + 16;
    tip.style.left = left + "px"; tip.style.top = top + "px";
  }
  function hideTip() { tip.hidden = true; }
  window.addEventListener("scroll", hideTip, { passive: true });

  // ---------- SVG helpers ----------
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function width(el) { return Math.max(280, el.clientWidth); }
  // Barra vertical con extremo superior redondeado (4px) y base recta
  function vbar(x, y, w, h, r) {
    r = Math.min(r, w / 2, h);
    return "M" + x + "," + (y + h) + "V" + (y + r) + "Q" + x + "," + y + " " + (x + r) + "," + y +
      "H" + (x + w - r) + "Q" + (x + w) + "," + y + " " + (x + w) + "," + (y + r) + "V" + (y + h) + "Z";
  }
  function hbar(x, y, w, h, r) {
    r = Math.min(r, h / 2, w);
    return "M" + x + "," + y + "H" + (x + w - r) + "Q" + (x + w) + "," + y + " " + (x + w) + "," + (y + r) +
      "V" + (y + h - r) + "Q" + (x + w) + "," + (y + h) + " " + (x + w - r) + "," + (y + h) + "H" + x + "Z";
  }
  function niceMax(v) {
    var p = Math.pow(10, Math.floor(Math.log10(v))), m = v / p;
    return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * p;
  }
  function attachHits(el, onTip) {
    el.querySelectorAll("[data-i]").forEach(function (n) {
      var i = +n.getAttribute("data-i");
      var on = function (e) { showTip(e, onTip(i)); highlight(el, i); };
      n.addEventListener("mousemove", on);
      n.addEventListener("touchstart", on, { passive: true });
      n.addEventListener("mouseleave", function () { hideTip(); highlight(el, -1); });
    });
  }
  function highlight(el, i) {
    el.querySelectorAll("[data-m]").forEach(function (m) {
      m.classList.toggle("dim", i >= 0 && +m.getAttribute("data-m") !== i);
    });
  }

  // ---------- Gráfico de barras vertical ----------
  function barChart(el, items, o) {
    var W = width(el), H = o.height || 280, m = { t: 28, r: 8, b: 30, l: o.yfmt ? 44 : 8 };
    var iw = W - m.l - m.r, ih = H - m.t - m.b;
    var max = o.max || niceMax(Math.max.apply(null, items.map(function (d) { return d.v; })) * 1.05);
    var bw = iw / items.length, gap = Math.max(2, bw * 0.28);
    var s = "<svg viewBox='0 0 " + W + " " + H + "'>";
    // rejilla
    s += "<g class='grid'>";
    for (var g = 1; g <= 4; g++) {
      var gy = m.t + ih - ih * g / 4; s += "<line x1='" + m.l + "' x2='" + (W - m.r) + "' y1='" + gy + "' y2='" + gy + "'/>";
      if (o.yfmt) s += "<text class='axis' x='" + (m.l - 6) + "' y='" + (gy + 4) + "' text-anchor='end'>" + esc(o.yfmt(max * g / 4)) + "</text>";
    }
    s += "</g>";
    items.forEach(function (d, i) {
      var h = Math.max(1, ih * d.v / max), x = m.l + i * bw + gap / 2, y = m.t + ih - h;
      s += "<path data-m='" + i + "' d='" + vbar(x, y, bw - gap, h, 4) + "' fill='" + (d.color || css("--neutral-2")) + "'/>";
      if (d.label) s += o.labelInside
        ? "<text x='" + (x + (bw - gap) / 2) + "' y='" + (y + 18) + "' text-anchor='middle' style='fill:#fff;font-weight:600'>" + esc(d.label) + "</text>"
        : "<text class='val' x='" + (x + (bw - gap) / 2) + "' y='" + (y - 8) + "' text-anchor='middle'>" + esc(d.label) + "</text>";
      s += "<text class='axis' x='" + (x + (bw - gap) / 2) + "' y='" + (H - 10) + "' text-anchor='middle'>" + esc(d.x) + "</text>";
      s += "<rect class='hit' data-i='" + i + "' x='" + (m.l + i * bw) + "' y='" + m.t + "' width='" + bw + "' height='" + ih + "'/>";
    });
    if (o.refLine) {
      var ry = m.t + ih - ih * o.refLine.v / max;
      s += "<line x1='" + m.l + "' x2='" + (W - m.r) + "' y1='" + ry + "' y2='" + ry + "' stroke='" + css("--accent") + "' stroke-width='2' stroke-dasharray='6 4'/>";
      s += "<text x='" + (W - m.r) + "' y='" + (ry - 8) + "' text-anchor='end' style='fill:" + css("--accent") + ";font-weight:600;paint-order:stroke;stroke:" + css("--surface") + ";stroke-width:5px;stroke-linejoin:round'>" + esc(o.refLine.label) + "</text>";
    }
    s += "<line class='baseline' x1='" + m.l + "' x2='" + (W - m.r) + "' y1='" + (m.t + ih) + "' y2='" + (m.t + ih) + "'/>";
    s += "</svg>";
    el.innerHTML = s;
    attachHits(el, function (i) { return o.tip(items[i], i); });
  }

  // ---------- Gráfico de líneas ----------
  function lineChart(el, o) {
    var W = width(el), H = o.height || 300, m = { t: 16, r: o.rightPad || 110, b: 30, l: 44 };
    if (W < 520) m.r = Math.min(m.r, 84);
    var iw = W - m.l - m.r, ih = H - m.t - m.b, xs = o.x, n = xs.length;
    var max = o.max || niceMax(Math.max.apply(null, o.series.map(function (sr) { return Math.max.apply(null, sr.v); })));
    var min = o.min || 0;
    function X(i) { return m.l + iw * i / (n - 1); }
    function Y(v) { return m.t + ih - ih * (v - min) / (max - min); }
    var s = "<svg viewBox='0 0 " + W + " " + H + "'><g class='grid'>";
    for (var g = 0; g <= 4; g++) {
      var val = min + (max - min) * g / 4, gy = Y(val);
      s += "<line x1='" + m.l + "' x2='" + (m.l + iw) + "' y1='" + gy + "' y2='" + gy + "'/>";
      s += "<text class='axis' x='" + (m.l - 6) + "' y='" + (gy + 4) + "' text-anchor='end'>" + esc(o.yfmt(val)) + "</text>";
    }
    s += "</g><g class='axis'>";
    var step = Math.ceil(n / (W < 520 ? 4 : 7)), st = step;
    while (st < n - 1 && (n - 1) % st) st++;
    if (st < n - 1) step = st;
    for (var i = 0; i < n; i += step) s += "<text x='" + X(i) + "' y='" + (H - 8) + "' text-anchor='middle'>" + xs[i] + "</text>";
    if ((n - 1) % step && X(n - 1) - X(n - 1 - (n - 1) % step) > 36) s += "<text x='" + X(n - 1) + "' y='" + (H - 8) + "' text-anchor='middle'>" + xs[n - 1] + "</text>";
    s += "</g>";
    // series de fondo primero, la destacada al final
    var order = o.series.map(function (sr, k) { return k; }).sort(function (a, b) { return (o.series[a].strong ? 1 : 0) - (o.series[b].strong ? 1 : 0); });
    var labels = [];
    order.forEach(function (k) {
      var sr = o.series[k], d = "";
      sr.v.forEach(function (v, i) { d += (i ? "L" : "M") + X(i).toFixed(1) + "," + Y(v).toFixed(1); });
      if (sr.area) s += "<path d='" + d + "L" + X(n - 1) + "," + Y(min) + "L" + X(0) + "," + Y(min) + "Z' fill='" + sr.color + "' opacity='.12'/>";
      s += "<path d='" + d + "' fill='none' stroke='" + sr.color + "' stroke-width='" + (sr.strong ? 3 : 2) + "' stroke-linejoin='round' stroke-linecap='round'/>";
      if (sr.name) labels.push({ y: Y(sr.v[n - 1]), text: sr.name, color: sr.color, strong: sr.strong });
    });
    // etiquetas directas sin solapes
    labels.sort(function (a, b) { return a.y - b.y; });
    for (var j = 1; j < labels.length; j++) if (labels[j].y - labels[j - 1].y < 15) labels[j].y = labels[j - 1].y + 15;
    labels.forEach(function (l) {
      s += "<text x='" + (m.l + iw + 8) + "' y='" + (l.y + 4) + "' style='fill:" + (l.strong ? css("--ink") : css("--ink-2")) + ";font-weight:" + (l.strong ? 700 : 500) + "'>" +
        "<tspan style='fill:" + l.color + "'>● </tspan>" + esc(l.text) + "</text>";
    });
    if (o.annot) o.annot.forEach(function (a) {
      var ax = X(a.i), ay = Y(a.v);
      s += "<circle cx='" + ax + "' cy='" + ay + "' r='5' fill='" + a.color + "' stroke='" + css("--surface") + "' stroke-width='2'/>";
      s += "<text class='val' x='" + (ax + (a.anchor === "end" ? -10 : a.anchor === "middle" ? 0 : 10)) + "' y='" + (a.below ? ay + 22 : ay - 10) + "' text-anchor='" + (a.anchor || "start") + "'>" + esc(a.text) + "</text>";
    });
    s += "<line id='xh' x1='0' x2='0' y1='" + m.t + "' y2='" + (m.t + ih) + "' stroke='" + css("--ink-3") + "' stroke-width='1' visibility='hidden'/>";
    s += "<rect class='hit' x='" + m.l + "' y='" + m.t + "' width='" + iw + "' height='" + ih + "'/>";
    s += "</svg>";
    el.innerHTML = s;
    var svg = el.querySelector("svg"), hit = svg.querySelector(".hit"), xh = svg.querySelector("#xh");
    function move(e) {
      var pt = e.touches ? e.touches[0] : e, r = svg.getBoundingClientRect();
      var px = (pt.clientX - r.left) * W / r.width;
      var i = Math.max(0, Math.min(n - 1, Math.round((px - m.l) / iw * (n - 1))));
      xh.setAttribute("x1", X(i)); xh.setAttribute("x2", X(i)); xh.setAttribute("visibility", "visible");
      var html = "<b>" + xs[i] + "</b>";
      o.series.slice().sort(function (a, b) { return b.v[i] - a.v[i]; }).forEach(function (sr) {
        html += "<br><span style='color:" + sr.color + "'>●</span> " + (sr.name ? esc(sr.name) + ": " : "") + o.tipfmt(sr.v[i]);
      });
      showTip(pt, html);
    }
    hit.addEventListener("mousemove", move);
    hit.addEventListener("touchstart", move, { passive: true });
    hit.addEventListener("touchmove", move, { passive: true });
    hit.addEventListener("mouseleave", function () { hideTip(); xh.setAttribute("visibility", "hidden"); });
  }

  // ---------- Barras horizontales ----------
  function hbarChart(el, items, o) {
    var W = width(el), stacked = W < 560 && !o.noStack, rowH = (o.rowH || 26) + (stacked ? 16 : 0);
    var m = { t: 6, r: o.valueW || 70, b: 6, l: stacked ? 0 : Math.min(o.labelW || 150, W * 0.42) };
    if (o.ticks && o.ticks.some(function (t) { return t.label; })) m.b = 24;
    var H = m.t + m.b + items.length * rowH, iw = W - m.l - m.r;
    var max = o.max || Math.max.apply(null, items.map(function (d) { return d.v; }));
    var scale = o.scale || function (v) { return iw * v / max; };
    var s = "<svg viewBox='0 0 " + W + " " + H + "'>";
    if (o.ticks) {
      s += "<g class='grid'>";
      o.ticks.forEach(function (t) { var tx = m.l + scale(t.v); s += "<line x1='" + tx + "' x2='" + tx + "' y1='" + m.t + "' y2='" + (H - m.b) + "'/>"; });
      s += "</g><g class='axis'>";
      o.ticks.forEach(function (t) { if (t.label) s += "<text x='" + (m.l + scale(t.v)) + "' y='" + (H - 4) + "' text-anchor='middle'>" + esc(t.label) + "</text>"; });
      s += "</g>";
    }
    items.forEach(function (d, i) {
      var y = m.t + i * rowH + (stacked ? 16 : 0), bh = rowH - 8 - (stacked ? 16 : 0), w = Math.max(2, scale(d.v));
      s += "<g data-m='" + i + "'>";
      s += stacked
        ? "<text x='0' y='" + (y - 4) + "' style='" + (d.strong ? "font-weight:700;fill:" + css("--ink") : "") + "'>" + esc(d.name) + "</text>"
        : "<text x='" + (m.l - 8) + "' y='" + (y + bh / 2 + 4) + "' text-anchor='end' style='" + (d.strong ? "font-weight:700;fill:" + css("--ink") : "") + "'>" + esc(d.name) + "</text>";
      s += "<path d='" + hbar(m.l, y, w, bh, 4) + "' fill='" + (d.color || css("--neutral-2")) + "'/>";
      if (d.label) s += "<text class='val' x='" + (m.l + w + 6) + "' y='" + (y + bh / 2 + 4) + "'>" + esc(d.label) + "</text>";
      s += "</g><rect class='hit' data-i='" + i + "' x='0' y='" + (y - (stacked ? 18 : 2)) + "' width='" + W + "' height='" + rowH + "'/>";
    });
    s += "<line class='baseline' x1='" + m.l + "' x2='" + m.l + "' y1='" + m.t + "' y2='" + (H - m.b) + "'/></svg>";
    el.innerHTML = s;
    attachHits(el, function (i) { return o.tip(items[i]); });
  }

  // =========================================================
  // 1. Recaudación
  function renderRecaudacion() {
    var r = D.recaudacion, last = r.length - 1;
    barChart(document.getElementById("chartRecaudacion"), r.map(function (d, i) {
      return { x: d.anio, v: d.v, color: i === last ? css("--accent") : css("--neutral-3"),
        label: (i === 0 || i === last) ? fmt(d.v / 1000, 1) : "" };
    }), {
      tip: function (d, i) {
        var prev = i ? r[i - 1].v : null;
        return "<b>" + d.x + "</b><br>" + meur(d.v) + (prev ? "<br>" + (d.v >= prev ? "+" : "") + pct((d.v / prev - 1) * 100) + " sobre " + r[i - 1].anio : "");
      }
    });
  }

  // =========================================================
  // 2. Explorador (treemap)
  var explorer = { dataset: "pge2023", group: null };
  var GROUP_COLORS = {
    pge2023: { basicos: "#6250d6", social: "#55606e", preferentes: "#1d8a64", economicas: "#2563b0", generales: "#7a8594" },
    cofog2024: { proteccion: "#55606e", sanidad: "#2563b0", educacion: "#1d8a64", defensa: "#6250d6" }
  };
  function leafColor(ds, g, leaf) {
    if (leaf.pension) return css("--accent");
    if (leaf.deuda) return css("--debt");
    return (GROUP_COLORS[ds][g.id]) || "#7a8594";
  }
  function squarify(items, x, y, w, h) {
    // items: [{v,...}] ordenados de mayor a menor. Devuelve rectángulos.
    var out = [], total = items.reduce(function (a, d) { return a + d.v; }, 0);
    var scale = (w * h) / total, rest = items.map(function (d) { return { d: d, a: d.v * scale }; });
    function worst(row, side) {
      var s = row.reduce(function (a, r) { return a + r.a; }, 0), mx = 0, mn = Infinity;
      row.forEach(function (r) { mx = Math.max(mx, r.a); mn = Math.min(mn, r.a); });
      return Math.max(side * side * mx / (s * s), (s * s) / (side * side * mn));
    }
    while (rest.length) {
      var side = Math.min(w, h), row = [rest[0]], i = 1;
      while (i < rest.length && worst(row.concat(rest[i]), side) <= worst(row, side)) { row.push(rest[i]); i++; }
      var s = row.reduce(function (a, r) { return a + r.a; }, 0);
      if (w >= h) { // columna a la izquierda
        var cw = s / h, cy = y;
        row.forEach(function (r) { var rh = r.a / cw; out.push({ d: r.d, x: x, y: cy, w: cw, h: rh }); cy += rh; });
        x += cw; w -= cw;
      } else {
        var rh2 = s / w, cx = x;
        row.forEach(function (r) { var rw = r.a / rh2; out.push({ d: r.d, x: cx, y: y, w: rw, h: rh2 }); cx += rw; });
        y += rh2; h -= rh2;
      }
      rest = rest.slice(row.length);
    }
    return out;
  }
  function renderExplorer() {
    var ds = D[explorer.dataset], el = document.getElementById("treemap");
    var W = el.clientWidth, H = el.clientHeight;
    var leaves = [];
    ds.grupos.forEach(function (g) {
      if (explorer.group && explorer.group !== g.id) return;
      g.hijos.forEach(function (h) { leaves.push({ v: h.v, nombre: h.nombre, g: g, leaf: h }); });
    });
    leaves.sort(function (a, b) { return b.v - a.v; });
    var sum = leaves.reduce(function (a, d) { return a + d.v; }, 0);
    var rects = squarify(leaves, 0, 0, W, H);
    el.innerHTML = "";
    rects.forEach(function (r) {
      var d = r.d, c = document.createElement("div");
      c.className = "tm-cell" + (r.w < 84 || r.h < 40 ? " tiny" : (r.h < 64 || r.w < 76 ? " novalue" : "") + (r.h < 92 || r.w < 96 ? " nopct" : ""));
      c.style.left = r.x + "px"; c.style.top = r.y + "px"; c.style.width = r.w + "px"; c.style.height = r.h + "px";
      c.style.background = leafColor(explorer.dataset, d.g, d.leaf);
      c.tabIndex = 0; c.setAttribute("role", "button");
      var share = d.v / ds.total * 100;
      c.setAttribute("aria-label", d.nombre + ": " + meur(d.v) + ", " + pct(share) + " del total");
      c.innerHTML = "<div class='n'></div><div class='v'></div><div class='p'></div>";
      c.querySelector(".n").textContent = d.nombre;
      c.querySelector(".v").textContent = meur(d.v);
      c.querySelector(".p").textContent = pct(share, share < 1 ? 2 : 1);
      var tipHtml = "<b>" + esc(d.nombre) + "</b><br>" + meur(d.v) + " · " + pct(share, 2) + " del total<br>Grupo: " + esc(d.g.nombre) +
        (d.leaf.pension ? "" : "<br>Equivale a " + duracion(d.v) + " de pensiones");
      c.addEventListener("mousemove", function (e) { showTip(e, tipHtml); });
      c.addEventListener("mouseleave", hideTip);
      function go() { hideTip(); explorer.group = explorer.group ? null : d.g.id; renderExplorer(); }
      c.addEventListener("click", go);
      c.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
      el.appendChild(c);
    });
    // migas
    var crumbs = document.getElementById("crumbs");
    crumbs.innerHTML = "";
    var b0 = document.createElement(explorer.group ? "button" : "span");
    b0.textContent = explorer.dataset === "pge2023" ? "Presupuesto del Estado 2023" : "Todas las administraciones 2024";
    if (explorer.group) {
      b0.type = "button";
      b0.addEventListener("click", function () { explorer.group = null; renderExplorer(); });
      crumbs.appendChild(b0);
      var sep = document.createElement("span"); sep.className = "sep"; sep.textContent = "›"; crumbs.appendChild(sep);
      var g = ds.grupos.filter(function (x) { return x.id === explorer.group; })[0];
      var b1 = document.createElement("span"); b1.textContent = g.nombre; crumbs.appendChild(b1);
    } else crumbs.appendChild(b0);
    document.getElementById("explorerTotal").textContent = explorer.group
      ? meur(sum) + " (" + pct(sum / ds.total * 100) + " del total). Pulsa un bloque para volver."
      : "Total: " + meur(ds.total) + ". Pulsa un bloque para ver solo su grupo.";
    // leyenda
    var lg = document.getElementById("treemapLegend"), items = [["Pensiones", css("--accent")], ["Intereses de la deuda", css("--debt")]];
    ds.grupos.forEach(function (g) {
      var col = GROUP_COLORS[explorer.dataset][g.id];
      if (col && g.hijos.some(function (h) { return !h.pension && !h.deuda; })) items.push([g.nombre + (g.hijos.some(function (h) { return h.pension; }) ? " (resto)" : ""), col]);
    });
    if (explorer.dataset === "cofog2024") items.push(["Otras funciones", "#7a8594"]);
    lg.innerHTML = items.map(function (it) { return "<span><i style='background:" + it[1] + "'></i>" + esc(it[0]) + "</span>"; }).join("");
    // tabla
    var all = [];
    ds.grupos.forEach(function (g) { g.hijos.forEach(function (h) { all.push([g.nombre, h.nombre, h.v]); }); });
    all.sort(function (a, b) { return b[2] - a[2]; });
    document.getElementById("treemapTable").innerHTML = "<table><thead><tr><th>Partida</th><th>Grupo</th><th class='num'>M€</th><th class='num'>% total</th></tr></thead><tbody>" +
      all.map(function (r) { return "<tr><td>" + esc(r[1]) + "</td><td>" + esc(r[0]) + "</td><td class='num'>" + fmt(r[2]) + "</td><td class='num'>" + pct(r[2] / ds.total * 100, 2) + "</td></tr>"; }).join("") + "</tbody></table>";
    var f = F[ds.src];
    document.getElementById("explorerFoot").innerHTML = "Fuente: " + esc(f.titulo) + ". <button class='src' data-src='" + ds.src + "'>ver</button>" +
      (explorer.dataset === "pge2023" ? " Capítulos 1 a 8, consolidado (Estado, organismos y Seguridad Social). Las transferencias a CCAA y ayuntamientos financian, entre otras cosas, su sanidad y educación." : " Pensiones = vejez + supervivencia; «vejez» incluye también servicios de atención a mayores.");
  }
  document.querySelectorAll(".seg").forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll(".seg").forEach(function (x) { x.classList.toggle("on", x === b); });
      explorer.dataset = b.getAttribute("data-dataset"); explorer.group = null; renderExplorer();
    });
  });

  // =========================================================
  // 3. Reloj
  var clockItems = D.partidas.slice().sort(function (a, b) { return a.v - b.v; });
  var sel = document.getElementById("clockSelect");
  clockItems.forEach(function (p) { var o = document.createElement("option"); o.value = p.id; o.textContent = p.nombre + " (" + meur(p.v, p.v < 100 ? 1 : 0) + ")"; sel.appendChild(o); });
  function clockText() {
    var p = D.partidas.filter(function (x) { return x.id === sel.value; })[0];
    document.getElementById("clockStatement").innerHTML = "Con todo el dinero de un año de <strong>" + esc(p.nombre) + "</strong> se pagarían las pensiones durante <em>" + duracion(p.v) + "</em>.";
  }
  sel.addEventListener("change", function () { clockText(); renderClock(); });
  function renderClock() {
    var el = document.getElementById("chartClock"), W = width(el);
    var narrow = W < 560, minLog = Math.log10(5), maxLog = Math.log10(60000), lw = narrow ? 0 : Math.min(250, W * 0.42), iw = W - lw - (narrow ? 84 : 110);
    hbarChart(el, clockItems.map(function (p) {
      return { name: p.nombre, v: p.v, label: duracion(p.v), strong: p.id === sel.value,
        color: p.id === sel.value ? css("--accent") : (p.recortable ? css("--neutral-2") : css("--neutral-1")) };
    }), {
      labelW: lw, valueW: narrow ? 84 : 110, rowH: 30,
      scale: function (v) { return iw * (Math.log10(v) - minLog) / (maxLog - minLog); },
      ticks: [10, 100, 1000, 10000].map(function (v) { return { v: v, label: narrow && (v === 100 || v === 1000) ? "" : fmt(v) + " M€" }; }),
      tip: function (d) {
        var p = clockItems.filter(function (x) { return x.nombre === d.name; })[0];
        return "<b>" + esc(p.nombre) + "</b><br>" + meur(p.v, 1) + " al año<br>" + esc(p.nota) + "<br>= " + duracion(p.v) + " de pensiones";
      }
    });
    var small = ["casareal", "partidos", "consumo", "cortes", "rtve", "igualdad", "tvauto"];
    var sumSmall = D.partidas.filter(function (p) { return small.indexOf(p.id) >= 0; }).reduce(function (a, p) { return a + p.v; }, 0);
    document.getElementById("clockSumSmall").textContent = duracion(sumSmall) + " (" + meur(sumSmall) + ")";
  }
  sel.value = "casareal"; clockText();

  // =========================================================
  // 4. Simulador
  var simParts = D.partidas.filter(function (p) { return p.recortable; });
  var simBox = document.getElementById("simSliders");
  simParts.forEach(function (p) {
    var row = document.createElement("div"); row.className = "sim-row";
    row.innerHTML = "<label for='cut-" + p.id + "'><span>" + esc(p.nombre) + "<small>" + esc(p.nota) + " · " + meur(p.v, p.v < 100 ? 1 : 0) + "</small></span><output id='out-" + p.id + "'></output></label>" +
      "<input type='range' id='cut-" + p.id + "' min='0' max='100' step='5' value='0' aria-label='Recorte en " + esc(p.nombre) + " (%)'>";
    simBox.appendChild(row);
  });
  var gap = document.getElementById("revalGap"), years = document.getElementById("revalYears");
  function updateSim() {
    var total = 0;
    simParts.forEach(function (p) {
      var c = +document.getElementById("cut-" + p.id).value, ahorro = p.v * c / 100;
      total += ahorro;
      document.getElementById("out-" + p.id).textContent = c ? "−" + c + " % · " + meur(ahorro, ahorro < 100 ? 1 : 0) : "sin recorte";
    });
    var g = +gap.value, n = +years.value;
    var ahorroPens = GASTO_ANUAL * (1 - Math.pow(1 - g / 100, n));
    total += ahorroPens;
    document.getElementById("revalGapOut").textContent = g ? fmt(g, 2) + " puntos · " + meur(ahorroPens) + "/año" : "nada (IPC completo)";
    document.getElementById("revalYearsOut").textContent = n + (n === 1 ? " año" : " años");
    document.getElementById("simTotal").textContent = meur(total);
    var p1 = total / GOAL1 * 100, p2 = total / GOAL2 * 100;
    [[p1, "goal1"], [p2, "goal2"]].forEach(function (x) {
      document.getElementById(x[1] + "Pct").textContent = pct(Math.min(x[0], 999), 0);
      var b = document.getElementById(x[1] + "Bar"); b.style.width = Math.min(100, x[0]) + "%"; b.classList.toggle("done", x[0] >= 100);
    });
    var v;
    var allSmall = simParts.filter(function (p) { return ["defensa", "cora", "aod"].indexOf(p.id) < 0; }).every(function (p) { return +document.getElementById("cut-" + p.id).value === 100; });
    if (total === 0) v = "Empieza moviendo algún control. Prueba primero a eliminar los «chiringuitos» al 100 %.";
    else if (p1 >= 100 && p2 >= 100) v = "Lo has conseguido, pero fíjate en qué has tenido que tocar para llegar: casi seguro, las pensiones o la defensa.";
    else if (p1 >= 100) v = "Cubres las transferencias actuales, pero no la subida del gasto que llega con la jubilación del baby boom.";
    else if (allSmall && g === 0) v = "Has eliminado del todo las partidas pequeñas y apenas cubres un " + pct(p1, 1) + " de lo que el Estado transfiere a la Seguridad Social.";
    else v = "Te falta " + meur(Math.max(0, GOAL1 - total)) + " para el primer objetivo y " + meur(Math.max(0, GOAL2 - total)) + " para el segundo.";
    document.getElementById("simVerdict").textContent = v;
  }
  simBox.addEventListener("input", updateSim); gap.addEventListener("input", updateSim); years.addEventListener("input", updateSim);
  document.getElementById("simReset").addEventListener("click", function () {
    simParts.forEach(function (p) { document.getElementById("cut-" + p.id).value = 0; });
    gap.value = 0; years.value = 5; updateSim();
  });
  updateSim();

  // =========================================================
  // 5. Revalorización
  var acum = D.revalorizaciones.reduce(function (a, r) { return a * (1 + r.pct / 100); }, 1);
  document.getElementById("revalAcum").textContent = pct((acum - 1) * 100);
  document.getElementById("costePunto").textContent = "≈ " + meur(Math.round(GASTO_ANUAL / 100 / 10) * 10);
  // Parte del gasto actual que se debe a la subida de un año concreto: p / (100 + p)
  function costeSubida(p) { return GASTO_ANUAL * p / (100 + p); }
  document.getElementById("coste2023").textContent = "≈ " + meur(Math.round(costeSubida(8.5) / 100) * 100);
  document.getElementById("costeAcum").textContent = "≈ " + meur(Math.round(GASTO_ANUAL * (1 - 1 / acum) / 100) * 100);
  var sj = D.salarioJoven;
  document.getElementById("salJovenCrec").textContent = pct((sj[2024] / sj[2021] - 1) * 100);
  function renderReval() {
    barChart(document.getElementById("chartReval"), D.revalorizaciones.map(function (r) {
      return { x: r.anio, v: r.pct, label: pct(r.pct), color: r.anio === 2023 ? css("--accent") : css("--neutral-2") };
    }), { max: 10, height: 260, tip: function (d) { return "<b>" + d.x + "</b><br>Subida general: " + pct(d.v) + "<br>Coste hoy: " + meur(Math.round(costeSubida(d.v) / 100) * 100) + " al año (aprox.)"; } });
  }

  // =========================================================
  // 6. Evolución y demografía
  function renderEvol() {
    var S = D.cofogSerie, k = 1000;
    lineChart(document.getElementById("chartEvol"), {
      x: S.anios, height: 360, rightPad: 120,
      series: [
        { name: "Pensiones", v: S.pensiones.map(function (v) { return v / k; }), color: css("--accent"), strong: true },
        { name: "Sanidad", v: S.sanidad.map(function (v) { return v / k; }), color: css("--series-blue") },
        { name: "Educación", v: S.educacion.map(function (v) { return v / k; }), color: css("--series-aqua") },
        { name: "Intereses", v: S.intereses.map(function (v) { return v / k; }), color: css("--debt") },
        { name: "Defensa", v: S.defensa.map(function (v) { return v / k; }), color: css("--series-violet") }
      ],
      max: 240, yfmt: function (v) { return fmt(v, 0); }, tipfmt: function (v) { return fmt(v, 1) + " mil M€"; },
      annot: [{ i: 0, v: S.pensiones[0] / k, text: fmt(S.pensiones[0] / k, 0), color: css("--accent") },
              { i: S.anios.length - 1, v: S.pensiones[S.pensiones.length - 1] / k, text: fmt(S.pensiones[S.pensiones.length - 1] / k, 0) + " (×" + fmt(S.pensiones[S.pensiones.length - 1] / S.pensiones[0], 1) + ")", color: css("--accent"), anchor: "end" }]
    });
  }
  function renderDemo() {
    var dm = D.demografia, xs = dm.ratio.map(function (v, i) { return dm.anioInicial + i; });
    var i50 = 2050 - dm.anioInicial, last = dm.ratio.length - 1;
    lineChart(document.getElementById("chartDemo"), {
      x: xs, height: 280, rightPad: 24, min: 0, max: 4,
      series: [{ name: "", v: dm.ratio, color: css("--accent"), strong: true, area: true }],
      yfmt: function (v) { return fmt(v, 0); }, tipfmt: function (v) { return fmt(v, 2) + " personas de 16-66 por cada una de 67+"; },
      annot: [{ i: 0, v: dm.ratio[0], text: fmt(dm.ratio[0], 2) + " en 2026", color: css("--accent") },
              { i: i50, v: dm.ratio[i50], text: fmt(dm.ratio[i50], 2) + " en 2050", color: css("--accent"), anchor: "middle", below: true },
              { i: last, v: dm.ratio[last], text: fmt(dm.ratio[last], 2) + " en " + xs[last], color: css("--accent"), anchor: "end" }]
    });
  }
  function renderAgeing() {
    var A = D.ageing;
    lineChart(document.getElementById("chartAgeing"), {
      x: A.anios, height: 280, rightPad: 80, min: 10, max: 18,
      series: [
        { name: "España", v: A.espana, color: css("--accent"), strong: true },
        { name: "UE-27", v: A.ue, color: css("--neutral-1") }
      ],
      yfmt: function (v) { return fmt(v, 0) + " %"; }, tipfmt: function (v) { return pct(v); },
      annot: [{ i: 0, v: A.espana[0], text: pct(A.espana[0]), color: css("--accent"), below: true },
              { i: 1, v: A.espana[1], text: pct(A.espana[1]), color: css("--accent"), anchor: "middle" }]
    });
  }

  // =========================================================
  // 7. Salarios
  function renderSalarios() {
    var pension = D.nomina.pensionMediaJubilacion * 14;
    barChart(document.getElementById("chartSalarios"), D.salarios2024.map(function (s) {
      var young = s[0] === "20-24" || s[0] === "25-29";
      return { x: s[0], v: s[1], color: young ? css("--series-blue") : css("--neutral-3"), label: young ? fmt(s[1] / 1000, 1) + " mil" : "" };
    }), {
      max: 40000, height: 300, labelInside: true, yfmt: function (v) { return fmt(v / 1000) + " mil"; },
      refLine: { v: pension, label: "Pensión media de jubilación: " + fmt(pension) + " €/año" },
      tip: function (d) { return "<b>" + d.x + " años</b><br>Salario medio bruto: " + fmt(d.v) + " €/año<br>" + (d.v < pension ? "Gana " + fmt(pension - d.v) + " € menos" : "Gana " + fmt(d.v - pension) + " € más") + " que la pensión media de jubilación"; }
    });
  }

  // =========================================================
  // 8. Europa
  function renderUE() {
    var el = document.getElementById("chartUE");
    hbarChart(el, D.ue2024.map(function (r) {
      return { name: r[0], v: r[1], label: pct(r[1]), strong: r[0] === "España" || r[0] === "UE-27",
        color: r[0] === "España" ? css("--accent") : r[0] === "UE-27" ? css("--ink-2") : css("--neutral-3") };
    }), { labelW: 110, valueW: 60, rowH: 24, max: 18, noStack: true, tip: function (d) { return "<b>" + esc(d.name) + "</b><br>" + pct(d.v) + " del PIB en pensiones (2024)"; } });
  }

  // ---------- Render ----------
  function renderAll() {
    renderRecaudacion(); renderExplorer(); renderClock(); renderReval();
    renderEvol(); renderDemo(); renderAgeing(); renderSalarios(); renderUE();
  }
  var rt;
  window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(renderAll, 150); });
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", renderAll);
  renderAll();
})();
