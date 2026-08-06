function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var _React = React,
  useState = _React.useState,
  useEffect = _React.useEffect,
  useRef = _React.useRef,
  useCallback = _React.useCallback;
var SUPABASE_URL = "https://lvlysqltdkwkvagfnbnr.supabase.co";
var SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2bHlzcWx0ZGt3a3ZhZ2ZuYm5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyODA4MDMsImV4cCI6MjA5Mzg1NjgwM30.Mv9TPEBQvvyyIZ4sN4njCb5vGmWaLOl83Qfk_oqKXKU";
var SB = {
  "apikey": SUPABASE_KEY,
  "Authorization": "Bearer " + SUPABASE_KEY,
  "Content-Type": "application/json",
  "Prefer": "resolution=merge-duplicates"
};
// ═══ DIAGNÓSTICO EMBUTIDO ═══
// Registra os eventos de salvamento/abertura/atualização desta sessão e permite consultar,
// direto do app, qual versão de aplicativo fez o último salvamento de cada mapa no servidor.
// Objetivo: quando algo der errado no uso real, um print desta tela mostra exatamente o que
// aconteceu — sem depender de suposição.
var APP_VERSAO_DIAG = "6.0 — HISTÓRICO 7 DIAS";
window.__mapacotLog = window.__mapacotLog || [];
// FIX (V5): além do log em memória (que se perde ao fechar a aba), agora cada evento também é
// gravado numa tabela própria do Supabase ("logs_diagnostico"), com data/hora, para poder ser
// consultado depois por período. Como o objetivo é só uma janela recente (não um histórico para
// sempre), a cada gravação o sistema aproveita e apaga sozinho qualquer linha com mais de 7 dias
// — sem precisar de manutenção manual nem de configuração extra no servidor.
var JANELA_HISTORICO_DIAS = 7;
function extrairCategoriaEMapa(texto) {
  var semSimbolo = String(texto || "").replace(/^[\u2714\u2716\u26a0]\s*/, "");
  var categoria = semSimbolo.split(/\s+/).slice(0, 2).join(" ");
  var mMapa = semSimbolo.match(/mapa\s+(\d+)/i);
  return { categoria: categoria, mapaNumero: mMapa ? parseInt(mMapa[1], 10) : null };
}
function sbSalvarLogDiagnostico(texto) {
  try {
    var extra = extrairCategoriaEMapa(texto);
    var corpo = {
      criado_em: new Date().toISOString().replace("Z", "+00:00"),
      categoria: extra.categoria,
      mensagem: texto,
      mapa_numero: extra.mapaNumero,
      usuario: window.__mapacotUsuario || null
    };
    fetch("".concat(SUPABASE_URL, "/rest/v1/logs_diagnostico"), {
      method: "POST",
      headers: SB,
      body: JSON.stringify(corpo)
    }).catch(function () {}); // falha de rede: não interfere no uso do sistema, só não fica salvo
    // Limpeza automática: aproveita esta gravação para apagar o que já passou de 7 dias.
    var cortes = new Date(Date.now() - JANELA_HISTORICO_DIAS * 24 * 60 * 60 * 1000).toISOString().replace("Z", "+00:00");
    fetch("".concat(SUPABASE_URL, "/rest/v1/logs_diagnostico?criado_em=lt.").concat(encodeURIComponent(cortes)), {
      method: "DELETE",
      headers: SB
    }).catch(function () {});
  } catch (e) {} // qualquer erro aqui nunca deve afetar o uso normal do sistema
}
function sbConsultarLogDiagnostico(dataDe, dataAte) {
  var de = dataDe ? (dataDe + "T00:00:00+00:00") : null;
  var ate = dataAte ? (dataAte + "T23:59:59+00:00") : null;
  var filtros = [];
  if (de) filtros.push("criado_em=gte." + encodeURIComponent(de));
  if (ate) filtros.push("criado_em=lte." + encodeURIComponent(ate));
  var query = filtros.length ? "&" + filtros.join("&") : "";
  return fetch("".concat(SUPABASE_URL, "/rest/v1/logs_diagnostico?select=*&order=criado_em.desc").concat(query), { headers: SB, cache: "no-store" })
    .then(function (r) { return r.ok ? r.json() : []; })
    .catch(function () { return []; });
}
// FIX (V5 — pedido do Claudio): gera um PDF do histórico consultado — seja de um período
// específico ou de "ver tudo" (tudo que ainda está guardado, dentro da janela de 7 dias).
// Segue o mesmo padrão visual dos demais relatórios do sistema (buildInsumosHTML).
function buildHistoricoPDF(linhas, filtroDe, filtroAte) {
  function esc(s) { return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  var agora = new Date();
  var dt = agora.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" });
  var hr = agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  var periodoTexto = (filtroDe || filtroAte)
    ? ("PER\u00cdODO: " + (filtroDe ? new Date(filtroDe + "T00:00:00").toLocaleDateString("pt-BR") : "in\u00edcio") + " a " + (filtroAte ? new Date(filtroAte + "T00:00:00").toLocaleDateString("pt-BR") : "hoje"))
    : "TODOS OS EVENTOS GUARDADOS (\u00faltimos " + JANELA_HISTORICO_DIAS + " dias)";
  var css = "<style>*{font-family:Arial,sans-serif;font-size:11px;}"
    + "body{margin:20px;} h2{font-size:13px;color:#1d3c6e;margin:0 0 4px;}"
    + ".sub{font-size:10px;color:#666;margin-bottom:12px;}"
    + "table{width:100%;border-collapse:collapse;}"
    + "th{background:#1d3c6e;color:#fff;padding:5px 8px;text-align:left;}"
    + "td{padding:5px 8px;border-bottom:0.5px solid #ddd;vertical-align:top;word-break:break-word;}"
    + "tr:nth-child(even) td{background:#f5f7fb;}"
    + ".footer{margin-top:10px;font-size:9px;color:#999;text-align:right;}"
    + "</style>";
  var rows = linhas.map(function (l, idx) {
    var quando = new Date(l.criado_em).toLocaleString("pt-BR");
    return "<tr>"
      + "<td style=\"width:34px;text-align:center;\">" + (idx + 1) + "</td>"
      + "<td style=\"width:120px;white-space:nowrap;\">" + esc(quando) + "</td>"
      + "<td style=\"width:70px;text-align:center;\">" + (l.mapa_numero != null ? esc(String(l.mapa_numero)) : "\u2014") + "</td>"
      + "<td style=\"width:70px;\">" + esc(l.usuario || "\u2014") + "</td>"
      + "<td>" + esc(l.mensagem || "") + "</td>"
      + "</tr>";
  }).join("");
  return "<!DOCTYPE html><html><head><meta charset=\"UTF-8\">" + css + "</head><body>"
    + "<h2>HIST\u00d3RICO DE EVENTOS \u2014 DIAGN\u00d3STICO MAPACOT</h2>"
    + "<div class=\"sub\">" + esc(periodoTexto) + " &nbsp;|&nbsp; GERADO EM " + dt + " \u2013 " + hr + " &nbsp;|&nbsp; " + APP_VERSAO_DIAG + "</div>"
    + "<table>"
    + "<thead><tr>"
    + "<th style=\"width:34px;text-align:center;\">#</th>"
    + "<th style=\"width:120px;\">DATA / HORA</th>"
    + "<th style=\"width:70px;text-align:center;\">MAPA</th>"
    + "<th style=\"width:70px;\">USU\u00c1RIO</th>"
    + "<th>EVENTO</th>"
    + "</tr></thead>"
    + "<tbody>" + rows + "</tbody>"
    + "</table>"
    + "<div class=\"footer\">Total de eventos: " + linhas.length + " &nbsp;|&nbsp; MAPACOT V6</div>"
    + "</body></html>";
}
function logEventoDiag(texto) {
  try {
    var hora = new Date().toLocaleTimeString("pt-BR");
    window.__mapacotLog.push(hora + "  " + texto);
    if (window.__mapacotLog.length > 80) window.__mapacotLog.shift();
  } catch (e) {}
  sbSalvarLogDiagnostico(texto); // dispara e esquece — nunca atrasa nem bloqueia a ação real
}
window.abrirDiagnosticoMapacot = function () {
  var existente = document.getElementById("diagMapacotOverlay");
  if (existente) existente.remove();
  var ov = document.createElement("div");
  ov.id = "diagMapacotOverlay";
  ov.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:99999;display:flex;align-items:center;justify-content:center;padding:14px;";
  var box = document.createElement("div");
  box.style.cssText = "background:#fff;border-radius:12px;max-width:560px;width:100%;max-height:85vh;overflow:auto;padding:16px;font-family:monospace;font-size:12px;color:#111;";
  box.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">'
    + '<b style="font-size:14px;">DIAGN\u00d3STICO MAPACOT</b>'
    + '<button id="diagFechar" style="border:none;background:#eee;border-radius:6px;padding:6px 10px;cursor:pointer;font-weight:bold;">FECHAR</button></div>'
    + '<div style="margin-bottom:8px;">Vers\u00e3o DESTE arquivo: <b style="color:#1d4ed8;">' + APP_VERSAO_DIAG + '</b></div>'
    + '<button id="diagVerificar" style="border:none;background:#1d4ed8;color:#fff;border-radius:6px;padding:9px 12px;cursor:pointer;margin-bottom:10px;font-weight:bold;">VERIFICAR SERVIDOR (quem salvou cada mapa)</button>'
    + '<div id="diagServidor" style="white-space:pre-wrap;background:#f6f8fb;border:1px solid #dde;border-radius:8px;padding:8px;margin-bottom:10px;min-height:20px;">\u2014</div>'
    + '<div style="border-top:1px solid #eee;margin:10px 0;padding-top:10px;">'
    + '<b style="font-size:13px;">HIST\u00d3RICO POR PER\u00cdODO (\u00faltimos ' + JANELA_HISTORICO_DIAS + ' dias)</b>'
    + '<div style="display:flex;gap:6px;align-items:center;margin:8px 0;flex-wrap:wrap;">'
    + '<span>De:</span><input type="date" id="diagDataDe" style="padding:5px;border:1px solid #ccc;border-radius:5px;">'
    + '<span>At\u00e9:</span><input type="date" id="diagDataAte" style="padding:5px;border:1px solid #ccc;border-radius:5px;">'
    + '<button id="diagConsultarHist" style="border:none;background:#1d4ed8;color:#fff;border-radius:6px;padding:7px 12px;cursor:pointer;font-weight:bold;">CONSULTAR</button>'
    + '<button id="diagVerTudo" style="border:none;background:#374151;color:#fff;border-radius:6px;padding:7px 12px;cursor:pointer;font-weight:bold;">VER TUDO</button>'
    + '<button id="diagGerarPDF" style="border:none;background:#c0392b;color:#fff;border-radius:6px;padding:7px 12px;cursor:pointer;font-weight:bold;">\uD83D\uDCC4 GERAR PDF</button>'
    + '</div>'
    + '<div id="diagHistorico" style="white-space:pre-wrap;background:#f6f8fb;border:1px solid #dde;border-radius:8px;padding:8px;margin-bottom:10px;min-height:20px;max-height:260px;overflow:auto;">\u2014</div>'
    + '</div>'
    + '<div style="margin-bottom:4px;"><b>Eventos desta sess\u00e3o (mais recentes primeiro):</b></div>'
    + '<div style="white-space:pre-wrap;background:#f6f8fb;border:1px solid #dde;border-radius:8px;padding:8px;">' + (window.__mapacotLog.length ? window.__mapacotLog.slice().reverse().join("\n") : "(nenhum evento ainda)") + '</div>';
  ov.appendChild(box);
  document.body.appendChild(ov);
  document.getElementById("diagFechar").onclick = function () { ov.remove(); };
  document.getElementById("diagVerificar").onclick = function () {
    var alvo = document.getElementById("diagServidor");
    alvo.textContent = "Buscando no servidor...";
    fetch(SUPABASE_URL + "/rest/v1/mapas?select=dados,atualizado_em&order=criado_em.desc", { headers: SB, cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(new Error("HTTP " + r.status)); })
      .then(function (rows) {
        if (!rows || !rows.length) { alvo.textContent = "Nenhum mapa no servidor."; return; }
        alvo.textContent = rows.map(function (x) {
          var d = x.dados || {};
          var quem = d._appVersao ? ("app " + d._appVersao) : "\u26a0 VERS\u00c3O ANTIGA (sem marca\u00e7\u00e3o)";
          return "MAPA " + (d.numero != null ? d.numero : "?") + "  \u2014  " + ((d.itens || []).length) + " itens"
            + "\n  \u00faltimo salvamento: " + (x.atualizado_em || "?")
            + "\n  salvo por: " + quem;
        }).join("\n\n");
      })
      .catch(function (e) { alvo.textContent = "Falha ao consultar: " + (e && e.message); });
  };
  document.getElementById("diagConsultarHist").onclick = function () {
    var alvoHist = document.getElementById("diagHistorico");
    var de = document.getElementById("diagDataDe").value;
    var ate = document.getElementById("diagDataAte").value;
    alvoHist.textContent = "Consultando...";
    sbConsultarLogDiagnostico(de, ate).then(function (linhas) {
      window.__mapacotHistUltimo = linhas || [];
      window.__mapacotHistUltimoFiltro = { de: de, ate: ate };
      if (!linhas || !linhas.length) { alvoHist.textContent = "Nenhum evento encontrado neste per\u00edodo."; return; }
      alvoHist.textContent = linhas.map(function (l) {
        var quando = new Date(l.criado_em).toLocaleString("pt-BR");
        return quando + "  " + l.mensagem;
      }).join("\n");
    });
  };
  document.getElementById("diagVerTudo").onclick = function () {
    var alvoHist = document.getElementById("diagHistorico");
    document.getElementById("diagDataDe").value = "";
    document.getElementById("diagDataAte").value = "";
    alvoHist.textContent = "Consultando tudo (\u00faltimos " + JANELA_HISTORICO_DIAS + " dias, que \u00e9 o que fica guardado)...";
    sbConsultarLogDiagnostico(null, null).then(function (linhas) {
      window.__mapacotHistUltimo = linhas || [];
      window.__mapacotHistUltimoFiltro = { de: null, ate: null };
      if (!linhas || !linhas.length) { alvoHist.textContent = "Nenhum evento guardado ainda."; return; }
      alvoHist.textContent = linhas.map(function (l) {
        var quando = new Date(l.criado_em).toLocaleString("pt-BR");
        return quando + "  " + l.mensagem;
      }).join("\n");
    });
  };
  document.getElementById("diagGerarPDF").onclick = function () {
    var linhas = window.__mapacotHistUltimo || [];
    if (!linhas.length) { alert("Consulte o hist\u00f3rico (CONSULTAR ou VER TUDO) antes de gerar o PDF."); return; }
    var filtro = window.__mapacotHistUltimoFiltro || {};
    abrirPDF(buildHistoricoPDF(linhas, filtro.de, filtro.ate));
  };
};
var sbGetMapasOnce = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
    var r, d;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          _context.n = 1;
          return fetch("".concat(SUPABASE_URL, "/rest/v1/mapas?select=dados,atualizado_em&order=criado_em.desc"), {
            headers: SB, cache: "no-store"
          });
        case 1:
          r = _context.v;
          if (r.ok) {
            _context.n = 2;
            break;
          }
          return _context.a(2, []);
        case 2:
          _context.n = 3;
          return r.json();
        case 3:
          d = _context.v;
          // FIX: anexa a versão do servidor (atualizado_em) a cada mapa, como campo interno
          // (_versaoServidor) — usado para detectar se outra aba/sessão salvou mudanças mais
          // recentes antes de permitir sobrescrever (ver correção do bug de múltiplas abas).
          return _context.a(2, d.map(function (x) {
            return Object.assign({}, x.dados, { _versaoServidor: x.atualizado_em });
          }));
      }
    }, _callee);
  }));
  return function sbGetMapasOnce() {
    return _ref.apply(this, arguments);
  };
}();
var sbGetMapas = function sbGetMapas() {
  return sbGetMapasOnce().then(function(res) {
    if (res && res.length) return res;
    return new Promise(function(resolve){ setTimeout(resolve, 2000); })
      .then(function(){ return sbGetMapasOnce(); })
      .then(function(res2) {
        if (res2 && res2.length) return res2;
        return new Promise(function(resolve){ setTimeout(resolve, 2000); })
          .then(function(){ return sbGetMapasOnce(); });
      });
  });
};
// FIX CRÍTICO: a verificação de versão anterior causava um NOVO bug real (relatado e
// reproduzido): ao editar vários campos rapidamente (ex: quantidade, depois unidade, depois
// descrição), cada confirmação dispara sua própria tentativa de salvamento quase imediatamente.
// Se a tentativa #1 ainda estava em andamento quando a #2 disparava, a #2 comparava com uma
// versão do servidor JÁ desatualizada por causa da #1 (que a própria aba tinha acabado de
// salvar) — detectando um "conflito" falso consigo mesma, e perdendo os dados dos campos
// seguintes. Este objeto rastreia, por mapa, uma fila (para nunca verificar/salvar em paralelo)
// e a versão mais recente conhecida DENTRO dessa fila (não a versão desatualizada que o
// componente React ainda tinha no momento da chamada).
// FIX (CAUSA RAIZ do falso conflito encontrado no log real de 03/08): o app grava a versão
// como "2026-08-03T23:58:50.768Z" (toISOString) e o Supabase devolve o MESMO instante como
// "2026-08-03T23:58:50.768+00:00". Comparar os TEXTOS fazia o sistema achar que "outra aba"
// tinha salvo — quando era a própria gravação dele — e bloqueava TODOS os salvamentos
// seguintes da sessão (as edições entravam na tela mas nunca chegavam ao servidor).
// Esta função compara o INSTANTE, aceitando qualquer formato válido dos dois lados.
function mesmaVersaoTs(a, b) {
  if (a === b) return true;
  if (!a || !b) return false;
  var ta = Date.parse(a), tb = Date.parse(b);
  return isFinite(ta) && isFinite(tb) && ta === tb;
}
var estadoSalvamentoMapa = {};
var sbSaveMapa = function sbSaveMapa(m) {
  var idMapa = m.id;
  var dadosLimpos = Object.assign({}, m);
  delete dadosLimpos._versaoServidor; // nunca persiste este campo de controle dentro dos dados do mapa
  // Diagnóstico: registra qual versão do app fez este salvamento. Se dados sumirem/regredirem,
  // este campo revela se um arquivo antigo (sem as correções) salvou por cima.
  dadosLimpos._appVersao = "6.0-histpersist";

  if (!estadoSalvamentoMapa[idMapa]) {
    estadoSalvamentoMapa[idMapa] = { fila: Promise.resolve(), ultimaVersaoConhecida: m._versaoServidor };
  }
  var estado = estadoSalvamentoMapa[idMapa];

  estado.fila = estado.fila.catch(function(){}).then(function(){
    var __resumoItens = (dadosLimpos.itens || []).slice(-2).map(function (i) {
      return "#" + i.num + "[qt=" + (i.qt || "") + " un=" + (i.unid || "") + " ds=" + String(i.descricao || "").slice(0, 12) + "]";
    }).join(" ");
    logEventoDiag("SALVANDO mapa " + (dadosLimpos.numero != null ? dadosLimpos.numero : "?") + " (" + ((dadosLimpos.itens || []).length) + " itens) " + __resumoItens);
    var versaoParaVerificar = estado.ultimaVersaoConhecida;
    var verificar = versaoParaVerificar
      ? fetch("".concat(SUPABASE_URL, "/rest/v1/mapas?id=eq.").concat(idMapa, "&select=atualizado_em"), { headers: SB, cache: "no-store" })
          .then(function(r){ return r.ok ? r.json() : []; })
          .then(function(rows){
            var versaoAtualServidor = rows[0] && rows[0].atualizado_em;
            if (versaoAtualServidor && !mesmaVersaoTs(versaoAtualServidor, versaoParaVerificar)) {
              logEventoDiag("\u26a0 CONFLITO ao salvar mapa " + (dadosLimpos.numero != null ? dadosLimpos.numero : "?") + " \u2014 servidor tem vers\u00e3o mais nova (" + versaoAtualServidor + "); salvamento bloqueado para n\u00e3o sobrescrever");
              var err = new Error('Este mapa foi modificado em outra aba ou dispositivo. Recarregue a página antes de continuar, para não sobrescrever as mudanças mais recentes.');
              err.isVersionConflict = true;
              throw err;
            }
          })
      : Promise.resolve();

    return verificar.then(function(){
      var novaVersao = new Date().toISOString().replace("Z", "+00:00");
      return fetch("".concat(SUPABASE_URL, "/rest/v1/mapas"), {
        method: "POST",
        headers: SB,
        body: JSON.stringify({
          id: idMapa,
          dados: dadosLimpos,
          atualizado_em: novaVersao
        })
      }).then(function(r) {
        if (!r.ok) {
          logEventoDiag("\u2716 ERRO ao salvar mapa " + (dadosLimpos.numero != null ? dadosLimpos.numero : "?") + " \u2014 HTTP " + r.status);
          throw new Error('Erro ao salvar mapa (' + r.status + ')');
        }
        logEventoDiag("\u2714 SALVO mapa " + (dadosLimpos.numero != null ? dadosLimpos.numero : "?") + " (" + ((dadosLimpos.itens || []).length) + " itens) \u2014 nova vers\u00e3o " + novaVersao);
        estado.ultimaVersaoConhecida = novaVersao; // propaga para a próxima save da fila usar
        return novaVersao;
      });
    });
  });

  return estado.fila;
}
var sbDeleteMapa = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(id) {
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.n) {
        case 0:
          _context3.n = 1;
          return fetch("".concat(SUPABASE_URL, "/rest/v1/mapas?id=eq.").concat(id), {
            method: "DELETE",
            headers: SB
          }).then(function(r) {
            if (!r.ok) throw new Error('Erro ao excluir mapa (' + r.status + ')');
          });
        case 1:
          return _context3.a(2);
      }
    }, _callee3);
  }));
  return function sbDeleteMapa(_x2) {
    return _ref3.apply(this, arguments);
  };
}();
var sbGetCadastros = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
    var _d$;
    var r, d;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.n) {
        case 0:
          _context4.n = 1;
          return fetch("".concat(SUPABASE_URL, "/rest/v1/cadastros?id=eq.global&select=dados,atualizado_em"), {
            headers: SB, cache: "no-store"
          });
        case 1:
          r = _context4.v;
          if (r.ok) {
            _context4.n = 2;
            break;
          }
          return _context4.a(2, null);
        case 2:
          _context4.n = 3;
          return r.json();
        case 3:
          d = _context4.v;
          if (!d[0]) return _context4.a(2, null);
          // FIX: anexa a versão do servidor, mesma proteção contra múltiplas abas já aplicada em mapas
          return _context4.a(2, Object.assign({}, d[0].dados, { _versaoServidor: d[0].atualizado_em }));
      }
    }, _callee4);
  }));
  return function sbGetCadastros() {
    return _ref4.apply(this, arguments);
  };
}();
var sbGetInsumos = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
    var _d$2;
    var r, d;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.n) {
        case 0:
          _context5.n = 1;
          return fetch("".concat(SUPABASE_URL, "/rest/v1/cadastros?id=eq.insumos&select=dados,atualizado_em"), {
            headers: SB, cache: "no-store"
          });
        case 1:
          r = _context5.v;
          if (r.ok) {
            _context5.n = 2;
            break;
          }
          return _context5.a(2, { lista: [], versao: null });
        case 2:
          _context5.n = 3;
          return r.json();
        case 3:
          d = _context5.v;
          // FIX: retorna {lista, versao} em vez de só o array, para permitir o mesmo controle
          // de versão contra múltiplas abas já aplicado em mapas/cadastros/fornecedores
          return _context5.a(2, { lista: ((_d$2 = d[0]) === null || _d$2 === void 0 || (_d$2 = _d$2.dados) === null || _d$2 === void 0 ? void 0 : _d$2.insumos) || [], versao: d[0] && d[0].atualizado_em });
      }
    }, _callee5);
  }));
  return function sbGetInsumos() {
    return _ref5.apply(this, arguments);
  };
}();
var sbSaveCadastros = function sbSaveCadastros(c) {
  var main = {
    obras: c.obras || [],
    fornecedores: c.fornecedores || [],
    unidades: c.unidades || [],
    fornecedorObs: c.fornecedorObs || {} // FIX: observações livres por fornecedor — incluído
    // explicitamente aqui porque esta função só salva os campos citados nesta lista; um
    // campo novo que não apareça aqui seria descartado silenciosamente ao salvar (mesmo
    // tipo de bug já corrigido antes no orçamento).
  };
  return verificarVersaoAntesDeSalvar("global", c._versaoServidor).then(function(){
    var novaVersao = new Date().toISOString().replace("Z", "+00:00");
    return fetch("".concat(SUPABASE_URL, "/rest/v1/cadastros"), {
      method: "POST",
      headers: SB,
      body: JSON.stringify({
        id: "global",
        dados: main,
        atualizado_em: novaVersao
      })
    }).then(function(r){
      if(!r.ok) return r.text().then(function(t){ throw new Error('Erro ao salvar cadastros ('+r.status+'): '+t); });
      return novaVersao;
    });
  });
}
var sbSaveInsumos = function sbSaveInsumos(insumos, versaoConhecida) {
  return verificarVersaoAntesDeSalvar("insumos", versaoConhecida).then(function(){
    var novaVersao = new Date().toISOString().replace("Z", "+00:00");
    return fetch("".concat(SUPABASE_URL, "/rest/v1/cadastros"), {
      method: "POST",
      headers: SB,
      body: JSON.stringify({
        id: "insumos",
        dados: {
          insumos: insumos
        },
        atualizado_em: novaVersao
      })
    }).then(function(r) {
      if (!r.ok) throw new Error('Erro ao salvar insumos (' + r.status + ')');
      return novaVersao;
    });
  });
}

// ─── Supabase — Orçamento ────────────────────────────────────────────────────
var orcObraId = function(nomeObra) {
  // ID seguro: só letras e números, máx 40 chars
  return 'orc' + String(nomeObra || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 40);
};
// FIX: mesma proteção contra múltiplas abas já aplicada em sbSaveMapa (bug real relatado e
// reproduzido) — reutilizável aqui para os outros registros únicos/globais da tabela cadastros
// (orçamento, cadastros gerais, associações), que têm o MESMO risco: se duas abas carregarem o
// mesmo registro e uma delas salvar por cima com uma versão antiga, a outra perde o trabalho
// silenciosamente.
var verificarVersaoAntesDeSalvar = function(idRegistro, versaoConhecida) {
  if (!versaoConhecida) return Promise.resolve(); // sem versão conhecida (registro novo) — nada a checar
  return fetch(SUPABASE_URL + "/rest/v1/cadastros?id=eq." + encodeURIComponent(idRegistro) + "&select=atualizado_em", { headers: SB, cache: "no-store" })
    .then(function(r){ return r.ok ? r.json() : []; })
    .then(function(rows){
      var versaoAtualServidor = rows[0] && rows[0].atualizado_em;
      if (versaoAtualServidor && versaoAtualServidor !== versaoConhecida) {
        var err = new Error('Estes dados foram modificados em outra aba ou dispositivo. Recarregue a página antes de continuar, para não sobrescrever as mudanças mais recentes.');
        err.isVersionConflict = true;
        throw err;
      }
    });
};
var orcSaldoDisponivel = function(item, associacoes, obraOrcItens) {
  var previsto = parseFloat(item.quantidade)||0;
  if (associacoes && obraOrcItens) {
    var idxItem = obraOrcItens.indexOf(item);
    var consumido = associacoes.filter(function(a){
      if (a.referencia) return false; // associação de mapa duplicado — não conta no saldo
      var codOk = a.orcItemCodigo===item.codigo || a.orcItemCodigo===String(parseInt(item.codigo||"0",10)) || item.codigo===String(parseInt(a.orcItemCodigo||"0",10));
      var indexOk = (a.orcItemIndex != null && a.orcItemIndex >= 0) ? a.orcItemIndex === idxItem : true;
      return codOk && indexOk;
    }).reduce(function(ac, a) {
      return ac + (parseFloat(String(a.qtCompra).replace(",","."))||0) * (parseFloat(a.fator)||1);
    }, 0);
    return Math.max(0, previsto - consumido);
  }
  return Math.max(0, previsto - (parseFloat(item.consumido)||0));
};
var zerarConsumido = function(dados) {
  if (!dados) return dados;
  var itens = (dados.itens || dados);
  var novosItens = itens.map(function(it) { return Object.assign({}, it, { consumido: 0 }); });
  if (dados.itens) return Object.assign({}, dados, { itens: novosItens });
  return novosItens;
};
var sbSaveOrcamento = function(obraId, dados, versaoConhecida) {
  var id = orcObraId(obraId);
  // FIX: nunca persiste o campo de controle de versão dentro dos dados reais do orçamento
  var dadosLimpos = Object.assign({}, dados);
  delete dadosLimpos._versaoServidor;
  var body = JSON.stringify({ dados: dadosLimpos, atualizado_em: new Date().toISOString() });
  var criarViaPost = function() {
    return fetch(SUPABASE_URL + "/rest/v1/cadastros", {
      method: "POST", headers: SB,
      body: JSON.stringify({ id: id, dados: dadosLimpos, atualizado_em: new Date().toISOString() })
    });
  };
  var doPatch = function() {
    // FIX: o PostgREST retorna 200 OK (r.ok === true) mesmo quando o PATCH não encontra
    // NENHUMA linha para atualizar (registro ainda não existe) — sem esse header e checagem,
    // o código achava que tinha "dado certo" e nunca criava o registro pela primeira vez,
    // perdendo o orçamento inteiro silenciosamente. Agora: pede para o PATCH devolver as
    // linhas afetadas (return=representation) e confirma que pelo menos 1 linha voltou —
    // só aí considera sucesso; senão, cria via POST.
    return fetch(SUPABASE_URL + "/rest/v1/cadastros?id=eq." + encodeURIComponent(id), {
      method: "PATCH",
      headers: Object.assign({}, SB, { "Prefer": SB["Prefer"] + ",return=representation" }),
      body: body
    }).then(function(r) {
      if (!r.ok) return criarViaPost();
      return r.json().then(function(linhasAfetadas) {
        if (!linhasAfetadas || linhasAfetadas.length === 0) return criarViaPost();
        return r;
      }).catch(function() {
        // Resposta sem corpo interpretável — por segurança, garante que o registro existe
        return criarViaPost();
      });
    });
  };
  var novaVersao = JSON.parse(body).atualizado_em;
  return verificarVersaoAntesDeSalvar(id, versaoConhecida).then(function(){
    return doPatch().catch(function() {
      return new Promise(function(res){ setTimeout(res,1500); }).then(doPatch);
    }).then(function(){ return novaVersao; });
  });
};
var sbDeleteOrcamento = function(obraId) {
  return fetch(SUPABASE_URL + "/rest/v1/cadastros?id=eq." + orcObraId(obraId), {
    method: "DELETE", headers: SB
  }).then(function(r){
    if (!r.ok) throw new Error('Erro ao excluir orçamento (' + r.status + ')');
  });
};
// ─── PEDIDOS DE COMPRA — SUPABASE ─────────────────────────────────────────────
var sbGetPedidos = function() {
  return fetch(SUPABASE_URL + '/rest/v1/pedidos?select=*&order=numero.desc&limit=1000', { headers: SB, cache: 'no-store' })
    .then(function(r){
      if (!r.ok) { window.avisarErroSalvamento('Não foi possível carregar os pedidos. Verifique sua conexão.'); return []; }
      return r.json();
    })
    .then(function(d){
      if(d && d.length === 1000){
        window.avisarErroSalvamento('Limite de 1000 pedidos atingido — os mais antigos podem não aparecer.');
      }
      return d||[];
    })
    .catch(function(){ window.avisarErroSalvamento('Não foi possível carregar os pedidos. Verifique sua conexão.'); return []; });
};
var sbSavePedido = function(po) {
  return fetch(SUPABASE_URL + '/rest/v1/pedidos', {
    method: 'POST', headers: SB, body: JSON.stringify(po)
  }).then(function(r){
    if (!r.ok) return r.text().then(function(t){ throw new Error('Erro ao salvar pedido ('+r.status+'): '+t); });
    return po;
  });
};
var sbUpdatePedido = function(id, fields) {
  return fetch(SUPABASE_URL + '/rest/v1/pedidos?id=eq.' + id, {
    method: 'PATCH', headers: SB, body: JSON.stringify(fields)
  }).then(function(r){
    if (!r.ok) return r.text().then(function(t){ throw new Error('Erro ao atualizar pedido ('+r.status+'): '+t); });
  }).catch(function(e){
    // FIX (achado por Claudio, 04/08): antes esta função "engolia" o erro aqui e não o repassava
    // adiante — o código que chamava via .then() continuava normalmente, achando que tinha dado
    // certo, e chegava a mostrar "✅ atualizado com sucesso!" mesmo quando a gravação tinha
    // falhado de verdade. Agora o erro é relançado, para quem chamou saber que realmente falhou
    // e mostrar o aviso correto (e registrar no diagnóstico) em vez do falso sucesso.
    window.avisarErroSalvamento('Não foi possível atualizar o pedido. Verifique sua conexão.');
    throw e;
  });
};
var sbGetNextNumeroPO = function() {
  return fetch(SUPABASE_URL + '/rest/v1/pedidos?select=numero&order=numero.desc&limit=1', { headers: SB, cache: 'no-store' })
    .then(function(r){ return r.ok ? r.json() : []; })
    .then(function(d){
      var ultimo = (d && d.length && d[0].numero) ? d[0].numero : 0;
      return ultimo + 1;
    })
    .catch(function(){
      // Fallback: usa timestamp para evitar duplicação
      return Math.floor(Date.now() / 1000) % 100000;
    });
};
// ──────────────────────────────────────────────────────────────────────────────

var sbCarregarOrcamento = function(obraId) {
  var id = orcObraId(obraId);
  return fetch(SUPABASE_URL + "/rest/v1/cadastros?id=eq." + encodeURIComponent(id) + "&select=dados,atualizado_em", { headers: SB, cache: "no-store" })
    .then(function(r){
      if (!r.ok) { window.avisarErroSalvamento('Não foi possível carregar o orçamento. Verifique sua conexão.'); return []; }
      return r.json();
    })
    .then(function(rows){
      if (!rows || !rows[0] || !rows[0].dados) return null;
      // FIX: anexa a versão do servidor, mesma proteção contra múltiplas abas já aplicada em mapas
      return Object.assign({}, rows[0].dados, { _versaoServidor: rows[0].atualizado_em });
    })
    .catch(function(){ window.avisarErroSalvamento('Não foi possível carregar o orçamento. Verifique sua conexão.'); return null; });
};
var sbSaveAssociacoes = function(lista, versaoConhecida) {
  var novaVersao = new Date().toISOString().replace("Z", "+00:00");
  var payload = JSON.stringify({ id: "assocv2", dados: { lista: lista }, atualizado_em: novaVersao });
  var doSave = function() {
    return fetch(SUPABASE_URL + "/rest/v1/cadastros", { method: "POST", headers: SB, body: payload })
      .then(function(r){ if (!r.ok) throw new Error("save failed "+r.status); return r; });
  };
  return verificarVersaoAntesDeSalvar("assocv2", versaoConhecida).then(function(){
    return doSave().catch(function(){ return new Promise(function(res){ setTimeout(res,1000); }).then(doSave); })
      .then(function(){ return novaVersao; });
  });
};
var sbCarregarAssociacoes = function() {
  return fetch(SUPABASE_URL + "/rest/v1/cadastros?id=eq.assocv2&select=dados", { headers: SB, cache: "no-store" })
    .then(function(r){
      if (!r.ok) { window.avisarErroSalvamento('Não foi possível carregar as associações. Verifique sua conexão.'); return []; }
      return r.json();
    })
    .then(function(rows){ return (rows && rows[0] && rows[0].dados && rows[0].dados.lista) ? rows[0].dados.lista : []; })
    .catch(function(){ window.avisarErroSalvamento('Não foi possível carregar as associações. Verifique sua conexão.'); return []; });
};
// ─── IA Uso — funções Supabase ────────────────────────────────────────────────
var sbSaveIaUso = function(dados) {
  return fetch(SUPABASE_URL + "/rest/v1/ia_uso", {
    method: "POST", headers: SB, body: JSON.stringify(dados)
  }).catch(function(){});
};
var sbSalvarAprendizado = function(textoOriginal, insumoDescricao) {
  var texto = String(textoOriginal||'').trim().toUpperCase();
  if(!texto || !insumoDescricao) return Promise.resolve();
  return fetch(SUPABASE_URL + "/rest/v1/insumo_aprendizado", {
    method: "POST", headers: SB,
    body: JSON.stringify({ texto_original: texto, insumo_descricao: insumoDescricao, atualizado_em: new Date().toISOString() })
  }).then(function(r){
    // FIX: fetch só rejeita a Promise em falha de REDE — um erro do servidor (ex: 400/500)
    // retorna r.ok=false sem rejeitar nada, então sem esta checagem o erro ficava
    // completamente invisível (nem a função nem quem chama percebiam).
    if (!r.ok) throw new Error('Erro ao salvar aprendizado (' + r.status + ')');
  });
};
var sbBuscarAprendizados = function() {
  return fetch(SUPABASE_URL + "/rest/v1/insumo_aprendizado?select=texto_original,insumo_descricao", { headers: SB, cache: "no-store" })
    .then(function(r){
      if (!r.ok) { window.avisarErroSalvamento('Não foi possível carregar a memória de aprendizados. Verifique sua conexão.'); return []; }
      return r.json();
    })
    .then(function(rows){
      var mapa = {};
      (rows||[]).forEach(function(r){ mapa[r.texto_original] = r.insumo_descricao; });
      return mapa;
    })
    .catch(function(){ window.avisarErroSalvamento('Não foi possível carregar a memória de aprendizados. Verifique sua conexão.'); return {}; });
};
var sbExcluirAprendizado = function(textoOriginal) {
  var texto = String(textoOriginal||'').trim().toUpperCase();
  if(!texto) return Promise.resolve(false);
  return fetch(SUPABASE_URL + "/rest/v1/insumo_aprendizado?texto_original=eq." + encodeURIComponent(texto), {
    method: "DELETE", headers: SB
  }).then(function(r){ return r.ok; }).catch(function(){ return false; });
};
var sbGetIaUsoDia = function() {
  var hoje = new Date().toISOString().slice(0,10);
  return fetch(SUPABASE_URL + "/rest/v1/ia_uso?select=custo_brl,itens_lidos&created_at=gte." + hoje + "T00:00:00", { headers: SB, cache: "no-store" })
    .then(function(r){
      if (!r.ok) { window.avisarErroSalvamento('Não foi possível carregar o uso diário da IA. Verifique sua conexão.'); return []; }
      return r.json();
    })
    .then(function(rows){
      var total = rows.reduce(function(a,r){ return a + (parseFloat(r.custo_brl)||0); }, 0);
      return { leituras: rows.length, custo: total };
    }).catch(function(){ window.avisarErroSalvamento('Não foi possível carregar o uso diário da IA. Verifique sua conexão.'); return { leituras:0, custo:0 }; });
};

var CHUNK_SIZE = 4;
var DEFAULT_UNIDADES = ["BD", "CX", "FD", "FX", "GL", "JG", "KG", "L", "M", "M²", "M³", "ML", "PAR", "PC", "PR", "RL", "SC", "T", "UN", "VB"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
var uid = function uid() {
  return crypto.randomUUID();
};
var fmtDate = function fmtDate(d) {
  if (d === null || d === undefined || d === "") return "—"; // FIX: null/undefined/vazio -> "—" (new Date(null) viraria 1970, não NaN)
  var dt = d instanceof Date ? d : new Date(d);
  if (isNaN(dt.getTime())) return "—"; // FIX: texto inválido mostra "—" em vez de "Invalid Date"
  return dt.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
};
var fmtHora = function fmtHora(d) {
  return (d instanceof Date ? d : new Date(d)).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  });
};
var fmtMoney = function fmtMoney(v) {
  if (v === null || v === undefined || v === "" || isNaN(v)) return "";
  return Number(v).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};
var parseMoney = function parseMoney(s) {
  if (s === null || s === undefined || s === "") return null;
  var n = parseFloat(String(s).replace(/\./g, "").replace(",", "."));
  return isNaN(n) ? null : n;
};
var normalize = function normalize(s) {
  return (s || "").trim().toUpperCase();
};
var addToList = function addToList(list, val) {
  var v = normalize(val);
  if (!v) return list;
  return list.some(function (x) {
    return normalize(x) === v;
  }) ? list : [].concat(_toConsumableArray(list), [v]).sort();
};
var emptyMap = function emptyMap() {
  var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
  return {
    id: uid(),
    nome: "",
    responsavel: "",
    obra: "",
    numero: n,
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
    itens: [],
    fornecedores: [],
    precos: {},
    detalhes: {},
    rodape: {},
    corTema: "blue"
  };
};
var emptyItem = function emptyItem(n) {
  return {
    id: uid(),
    num: n,
    descricao: "",
    detalhe: "",
    qt: "",
    unid: ""
  };
};
var emptyForn = function emptyForn() {
  return {
    id: uid(),
    nome: ""
  };
};
var calcResumo = function calcResumo(item, fns, precos) {
  if (!fns.length) return {
    vlUnit: null,
    vlTotal: null,
    forn: null
  };
  var minVal = null,
    minForn = null,
    minFornId = null;
  fns.forEach(function (f) {
    var v = parseMoney(precos["".concat(item.id, "_").concat(f.id)]);
    if (v !== null && v > 0 && (minVal === null || v < minVal)) {
      minVal = v;
      minForn = f.nome || "—";
      minFornId = f.id;
    }
  });
  var qt = parseFloat(String(item.qt).replace(",", "."));
  return {
    vlUnit: minVal,
    vlTotal: minVal !== null && !isNaN(qt) && qt > 0 ? minVal * qt : null,
    forn: minForn,
    minFornId: minFornId
  };
};

// ─── Themes ───────────────────────────────────────────────────────────────────
var THEMES = [{
  id: "blue",
  name: "AZUL",
  hdr: "#2a5298",
  sub: "#c5d8f0",
  best: "#b0e8b8"
}, {
  id: "salmon",
  name: "SALMÃO",
  hdr: "#c0392b",
  sub: "#fce4e2",
  best: "#a8e6b8"
}, {
  id: "green",
  name: "VERDE",
  hdr: "#1a7a44",
  sub: "#d0f0e0",
  best: "#f0e060"
}, {
  id: "amber",
  name: "ÂMBAR",
  hdr: "#b06000",
  sub: "#fdf0c8",
  best: "#a8e0a8"
}, {
  id: "purple",
  name: "ROXO",
  hdr: "#5b2d8e",
  sub: "#ead8f8",
  best: "#a0e8b0"
}, {
  id: "gray",
  name: "CINZA",
  hdr: "#445566",
  sub: "#e8ecf2",
  best: "#a8e6b8"
}];
var getTheme = function getTheme(id) {
  return THEMES.find(function (t) {
    return t.id === id;
  }) || THEMES[0];
};

// ─── ANÁLISE DE PREÇOS ────────────────────────────────────────────────────────
var buildAnaliseHTML = function buildAnaliseHTML(mapa, now, orcamentos, associacoes) {
  // FIX: esc() local para evitar XSS/quebra de layout com nomes/descrições contendo < > & "
  function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  now = now || new Date(); orcamentos = orcamentos || {}; associacoes = associacoes || [];
  // FIX: data de criação do mapa, validada — para mostrar "CRIADO EM" separado de "IMPRESSO EM"
  var dataCriacaoValidaAnalise = (function () {
    if (!mapa.criadoEm) return now;
    var d = new Date(mapa.criadoEm);
    return isNaN(d.getTime()) ? now : d;
  })();
  var T = getTheme(mapa.corTema); var hdrColor = T.hdr;
  var fns = mapa.fornecedores || []; var itens = mapa.itens || []; var precos = mapa.precos || {};
  var fmtR = function(v){ return 'R$\u00a0' + fmtMoney(v); };
  var obraOrc = mapa.obra && orcamentos[mapa.obra] ? orcamentos[mapa.obra] : null;
  var obraOrcItens = obraOrc ? (Array.isArray(obraOrc) ? obraOrc : (obraOrc.itens||[])) : [];
  var mapaAssocs = associacoes.filter(function(a){ return a.mapaId === mapa.id; });

  // ── Totais COM orçado (fórmula: vlOrc×fator − melhorPreço) × qt ──
  var totEco=0, totPrej=0, ctEco=0, ctPrej=0, ctComOrc=0, ctSemOrc=0, ctSemCot=0, ctSemCotOrc=0;

  // ── Gera HTML de cada item ──
  var itensHTML = itens.map(function(item, idx){
    var qt = parseFloat(String(item.qt).replace(',','.')) || 0;
    // Orçado
    var assoc = mapaAssocs.find(function(a){ return a.itemMapaId === item.id; });
    var orcItem = assoc ? obraOrcItens.find(function(o,i){
      return assoc.orcItemIndex != null ? i === assoc.orcItemIndex : o.codigo === assoc.orcItemCodigo;
    }) : null;
    var vlOrcUnit = orcItem ? (parseFloat(orcItem.valorUnitario||orcItem.vl_unitario)||0) : 0;
    var fatorA = assoc ? (parseFloat(assoc.fator)||1) : 1;
    var vlOrc = vlOrcUnit * fatorA; // preço orçado por unidade do mapa
    var temOrc = vlOrc > 0;
    // Rankings
    var rkgs = [];
    fns.forEach(function(f){
      var v = parseMoney(precos[item.id+'_'+f.id]);
      if (v !== null && v > 0) rkgs.push({ forn:esc((f.nome||'—').toUpperCase()), preco:v });
    });
    rkgs.sort(function(a,b){ return a.preco-b.preco; });
    // Contadores
    if (temOrc) {
      ctComOrc++;
      if (rkgs.length === 0) { ctSemCotOrc++; }
      else {
        var diff = (vlOrc - rkgs[0].preco) * qt;
        if (diff >= 0) { totEco += diff; ctEco++; } else { totPrej += Math.abs(diff); ctPrej++; }
      }
    } else {
      if (rkgs.length === 0) ctSemCot++; else ctSemOrc++;
    }
    // Badge
    var badge = '';
    if (rkgs.length === 0) {
      badge = '<span class="albg al-sem">\u2014 SEM COTA\u00c7\u00c3O</span>';
    } else if (temOrc) {
      badge = rkgs[0].preco <= vlOrc
        ? '<span class="albg al-eco">\u2713 ECONOMIA</span>'
        : '<span class="albg al-prej">\u2717 ACIMA DO OR\u00c7ADO</span>';
    } else {
      badge = '<span class="albg al-men">\u2605 MENOR: '+rkgs[0].forn+'</span>';
    }
    // Linhas
    var rows = '';
    if (rkgs.length === 0) {
      rows = '<div class="alr al-sem-cot">NENHUM FORNECEDOR ENVIOU PRE\u00c7O PARA ESTE ITEM</div>';
    } else {
      var maxBar = Math.max(rkgs[rkgs.length-1].preco, temOrc ? vlOrc : 0) || 1;
      // Linha ORÇADO (só se tiver)
      if (temOrc) {
        var bwOrc = Math.max(10, Math.round(vlOrc / maxBar * 100));
        rows += '<div class="alr al-orc">'
          +'<div class="all"><div class="alt">OR\u00c7ADO</div><div class="alf">REFER\u00caNCIA BASE</div></div>'
          +'<div class="albo"><div class="albi al-orc-b" style="width:'+bwOrc+'%;">'+fmtR(vlOrc)+'</div></div>'
          +'<div class="alv al-ref">'+fmtR(vlOrc)+'</div>'
          +'<div class="ald"><span class="al-dref">REFER\u00caNCIA \u2014 SEM COMPARA\u00c7\u00c3O</span></div>'
          +'</div>';
      }
      // Linhas de ranking — dinâmico, todos os fornecedores, comparações cumulativas
      var rankBarCls = ['al-r1-b','al-r2-b','al-r3-b','al-r4-b','al-r5-b','al-r6-b','al-r7p-b'];
      rkgs.forEach(function(rk, i){
        var bw = Math.max(10, Math.round(rk.preco / maxBar * 100));
        var barCls = rankBarCls[Math.min(i, rankBarCls.length-1)];
        var dlts = '';
        if (temOrc) {
          var dO = rk.preco - vlOrc, pO = dO/vlOrc*100;
          dlts += dO<=0
            ? '<span class="al-doec">\u25bc VS OR\u00c7ADO: \u2212 '+fmtR(Math.abs(dO))+' (\u2212'+Math.abs(pO).toFixed(1)+'%)</span>'
            : '<span class="al-dopj">\u25b2 VS OR\u00c7ADO: + '+fmtR(dO)+' (+'+pO.toFixed(1)+'%)</span>';
        } else if (i===0) {
          dlts = '<span class="al-dmen">\u2605 MENOR PRE\u00c7O DA COTA\u00c7\u00c3O</span>';
        }
        for (var j=0; j<i; j++) {
          var dj=rk.preco-rkgs[j].preco, pj=dj/rkgs[j].preco*100;
          dlts+='<span class="al-dr1">\u25b2 VS '+(j+1)+'\u00ba RANK: + '+fmtR(dj)+' (+'+pj.toFixed(1)+'%)</span>';
        }
        var alt = i%2===0?' alalt':'';
        rows += '<div class="alr'+alt+'">'
          +'<div class="all"><div class="alt">'+(i+1)+'\u00ba RANKING</div><div class="alf">'+rk.forn+'</div></div>'
          +'<div class="albo"><div class="albi '+barCls+'" style="width:'+bw+'%;">'+fmtR(rk.preco)+'</div></div>'
          +'<div class="alv al-rx-v">'+fmtR(rk.preco)+'</div>'
          +'<div class="ald">'+dlts+'</div>'
          +'</div>';
      });
    }
    return '<div class="alb"><div class="aln" style="background:'+hdrColor+';">'
      +'<span>'+(idx+1)+' \u2014 '+esc((item.descricao||'').toUpperCase())+' \u00b7 QT: '+item.qt+' '+(item.unid||'')+'</span>'
      +badge+'</div>'+rows+'</div>';
  }).join('');

  // ── CARDS ──
  var resultado = totEco - totPrej;
  var cardsComOrc = ctComOrc > 0
    ? '<div class="al-sec-title">\ud83d\udcca ITENS COM OR\u00c7AMENTO DE REFER\u00caNCIA ('+ctComOrc+' ITENS)</div>'
      +'<div class="al-cards">'
      +'<div class="al-card"><div class="al-cl">\u25cf ECONOMIA</div>'
      +'<div class="al-cn" style="color:#186818;font-size:16px;">'+ctEco+' ITENS</div>'
      +'<div class="al-cn" style="color:#186818;font-size:18px;margin:2px 0;">\u2212 '+fmtR(totEco)+'</div>'
      +'<div class="al-cs" style="color:#186818;">ABAIXO DO OR\u00c7ADO</div></div>'
      +'<div class="al-card"><div class="al-cl">\u25cf PREJU\u00cdZO</div>'
      +'<div class="al-cn" style="color:#c0392b;font-size:16px;">'+ctPrej+' ITENS</div>'
      +'<div class="al-cn" style="color:#c0392b;font-size:18px;margin:2px 0;">+ '+fmtR(totPrej)+'</div>'
      +'<div class="al-cs" style="color:#c0392b;">ACIMA DO OR\u00c7ADO</div></div>'
      +'<div class="al-card"><div class="al-cl">RESULTADO L\u00cdQUIDO</div>'
      +'<div class="al-cn" style="color:'+(resultado>=0?'#186818':'#c0392b')+';font-size:20px;margin:3px 0;">'+(resultado>=0?'+ ':'\u2212 ')+fmtR(Math.abs(resultado))+'</div>'
      +'<div class="al-cs" style="color:#555;">ECONOMIA \u2212 PREJU\u00cdZO</div></div>'
      +'</div>' : '';

  var totMenorSemOrc = itens.reduce(function(ac,item){
    var r=calcResumo(item,fns,precos);
    var assocI=mapaAssocs.find(function(a){return a.itemMapaId===item.id;});
    var orcI=assocI?obraOrcItens.find(function(o,i){ return assocI.orcItemIndex!=null?i===assocI.orcItemIndex:o.codigo===assocI.orcItemCodigo; }):null;
    var vlOI=orcI?(parseFloat(orcI.valorUnitario||orcI.vl_unitario)||0)*(parseFloat(assocI.fator)||1):0;
    if (vlOI>0) return ac;
    return ac+(r.vlTotal||0);
  },0);

  var cardsSemOrc = (ctSemOrc > 0 || ctSemCot > 0)
    ? '<div class="al-sec-title" style="background:#888;">\ud83d\udcc5 ITENS SEM OR\u00c7AMENTO DE REFER\u00caNCIA ('+(ctSemOrc+ctSemCot)+' ITENS)</div>'
      +'<div class="al-cards">'
      +'<div class="al-card"><div class="al-cl">ITENS COM COTA\u00c7\u00c3O</div>'
      +'<div class="al-cn" style="color:#2a5298;font-size:22px;">'+ctSemOrc+'</div>'
      +'<div class="al-cs" style="color:#555;">DE '+(ctSemOrc+ctSemCot)+' ITENS SEM OR\u00c7ADO</div></div>'
      +'<div class="al-card"><div class="al-cl">MENOR PRE\u00c7O TOTAL</div>'
      +'<div class="al-cn" style="color:#186818;font-size:18px;margin:3px 0;">'+fmtR(totMenorSemOrc)+'</div>'
      +'<div class="al-cs" style="color:#555;">SOMA DOS MENORES PRE\u00c7OS</div></div>'
      +'<div class="al-card"><div class="al-cl">SEM OR\u00c7AMENTO</div>'
      +'<div class="al-cn" style="color:#b8730a;font-size:14px;margin:3px 0;">RANKING APENAS POR PRE\u00c7O</div>'
      +'<div class="al-cs" style="color:#b8730a;">ASSOCIE O OR\u00c7AMENTO PARA COMPARAR</div></div>'
      +'</div>' : '';

  // ── CSS ──
  var css = '<style>'
    +'.al-sec-title{background:#2a5298;color:#fff;font-size:11px;font-weight:700;padding:6px 12px;margin-bottom:8px;border-radius:4px;letter-spacing:.3px;}'
    +'.al-cards{display:flex;gap:10px;margin-bottom:14px;}'
    +'.al-card{flex:1;border:1px solid #ccd8eb;border-radius:4px;padding:8px 12px;text-align:center;background:#f0f5ff;}'
    +'.al-cl{font-size:8px;color:#666;font-weight:600;letter-spacing:.3px;text-transform:uppercase;}'
    +'.al-cn{font-weight:800;} .al-cs{font-size:9px;font-weight:600;}'
    +'.al-leg{display:flex;gap:12px;margin-bottom:10px;font-size:10px;color:#444;align-items:center;flex-wrap:wrap;padding:6px 0;border-top:1px solid #e8edf5;border-bottom:1px solid #e8edf5;}'
    +'.al-li{display:flex;align-items:center;gap:5px;} .al-lb{width:14px;height:14px;border-radius:2px;flex-shrink:0;}'
    +'.alb{margin-bottom:8px;border:1px solid #d0dcea;border-radius:4px;overflow:hidden;}'
    +'.aln{color:#fff;font-size:11px;font-weight:700;padding:6px 10px;display:flex;justify-content:space-between;align-items:center;}'
    +'.albg{border-radius:3px;padding:2px 8px;font-size:9px;font-weight:700;white-space:nowrap;}'
    +'.al-eco{background:#1baf7a;color:#fff;} .al-prej{background:#e34948;color:#fff;} .al-men{background:#1baf7a;color:#fff;} .al-sem{background:#888;color:#fff;}'
    +'.alr{display:flex;align-items:center;gap:10px;padding:5px 10px;border-bottom:1px solid #edf0f8;min-height:34px;}'
    +'.alr:last-child{border-bottom:none;} .alalt{background:#f8faff;}'
    +'.al-orc{background:#eeeff3;} .al-sem-cot{justify-content:center;color:#999;font-size:10px;font-weight:600;background:#f5f5f5;}'
    +'.all{width:140px;flex-shrink:0;} .alt{font-size:10px;font-weight:700;color:#333;} .alf{font-size:9px;color:#888;display:block;margin-top:1px;}'
    +'.albo{flex:1;background:#e8ecf4;border-radius:3px;height:20px;overflow:hidden;}'
    +'.albi{height:20px;border-radius:3px;display:flex;align-items:center;justify-content:flex-end;padding-right:8px;font-size:10px;color:#fff;font-weight:800;white-space:nowrap;}'
    +'.al-orc-b{background:#888780;} .al-r1-b{background:#1baf7a;} .al-r2-b{background:#eb6834;} .al-r3-b{background:#e34948;} .al-r4-b{background:#9b59b6;} .al-r5-b{background:#2980b9;} .al-r6-b{background:#1abc9c;} .al-r7p-b{background:#e67e22;}'
    +'.alv{width:75px;text-align:right;font-weight:800;font-size:11px;flex-shrink:0;}'
    +'.al-eco-v{color:#186818;} .al-prej-v{color:#c0392b;} .al-ref{color:#777;} .al-rx-v{color:#444;}'
    +'.ald{width:270px;flex-shrink:0;display:flex;flex-direction:column;gap:3px;font-size:10px;}'
    +'.al-doec{color:#186818;font-weight:700;} .al-dopj{color:#c0392b;font-weight:700;}'
    +'.al-dr1{color:#888;font-size:9px;font-weight:600;} .al-dr2{color:#b8730a;font-weight:700;}'
    +'.al-dmen{color:#186818;font-weight:700;} .al-dref{color:#aaa;font-size:9px;}'
    +'</style>';

  // ── HEADER ──
  var hdr = '<div style="background:#1a3a78;padding:9px 14px;border-radius:4px 4px 0 0;display:flex;align-items:center;gap:14px;">'
    +'<span style="font-size:13px;font-weight:bold;color:#fff;white-space:nowrap;">\uD83D\uDCCA AN\u00c1LISE DE PRE\u00c7OS POR INSUMO</span>'
    +'<span style="font-size:11px;color:rgba(255,255,255,.95);font-weight:700;border-left:1px solid rgba(255,255,255,.35);padding-left:14px;white-space:nowrap;">MP N\u00ba: '+(mapa.numero||'')+'</span>'
    +'<span style="font-size:11px;color:rgba(255,255,255,.9);font-weight:600;flex:1;border-left:1px solid rgba(255,255,255,.35);padding-left:14px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;">OBRA: '+esc((mapa.obra||'').toUpperCase())+'</span>'
    +'<span style="font-size:9.5px;color:rgba(255,255,255,.65);border-left:1px solid rgba(255,255,255,.35);padding-left:14px;white-space:nowrap;margin-left:auto;display:flex;flex-direction:column;gap:1px;align-items:flex-end;">'
      +'<span>CRIADO EM <b style="color:#fff;">'+fmtDate(dataCriacaoValidaAnalise)+' '+fmtHora(dataCriacaoValidaAnalise)+'</b></span>'
      +'<span>IMPRESSO EM <b style="color:#fff;">'+fmtDate(now)+' '+fmtHora(now)+'</b></span>'
    +'</span>'
    +'</div>';

  // ── LEGENDA ──
  var leg = '<div class="al-leg">'
    +'<b style="color:#555;font-size:9px;">LEGENDA:</b>'
    +'<div class="al-li"><div class="al-lb" style="background:#888780;"></div> OR\u00c7ADO</div>'
    +'<div class="al-li"><div class="al-lb" style="background:#1baf7a;"></div> 1\u00ba RANKING</div>'
    +'<div class="al-li"><div class="al-lb" style="background:#eb6834;"></div> 2\u00ba RANKING</div>'
    +'<div class="al-li"><div class="al-lb" style="background:#e34948;"></div> 3\u00ba RANKING</div>'
    +'<div class="al-li"><div class="al-lb" style="background:#9b59b6;"></div> 4\u00ba+ RANKING</div>'
    +'</div>';

  var body = '<div style="border:1px solid #c0ccdd;border-top:none;padding:10px 12px;background:#fff;">'
    +leg+itensHTML
    +'<div style="margin-top:6px;font-size:9px;color:#999;text-align:right;">GERADO EM '+(now instanceof Date?now:new Date(now)).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit",year:"2-digit"})+' \u2013 '+fmtHora(now)+' \u2013 MAPACOT V6 CSS</div>'
    +'</div>';
  return css + hdr + body;
};


// === V4 CSS - Relatorio Consolidado de Pedidos PDF ===
var buildRelatorioPDF = function(pedidosFilt, rf, itensDoMapa, itensAtendMap) {
  // Fonte 1: itensAtendidosMap (tem qtTotal já calculado, keyed por item.id)
  itensAtendMap = itensAtendMap||{};
  // Fonte 2: mapa.itens via descricao (fallback)
  var itensMapById = {};
  var itensMapByDesc = {};
  (itensDoMapa||[]).forEach(function(item){
    var qtN = Number(item.qt)||0;
    var data = { qtTotal: qtN, unid: item.unid||'' };
    if(item.id) itensMapById[item.id] = data;
    var dk = String(item.descricao||'').trim().toUpperCase()+'|||'+String(item.detalhe||'').trim().toUpperCase();
    itensMapByDesc[dk] = data;
  });
  var dtG = new Date().toLocaleDateString('pt-BR');
  // FIX 1: Escapar HTML para evitar layout quebrado no PDF
  function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  // FIX 2: Data segura com T12:00:00 para evitar problema de fuso horário
  function fD(s){ if(!s) return '-'; var d=new Date(s.length===10?s+'T12:00:00':s); return isNaN(d.getTime())?'-':d.toLocaleDateString('pt-BR'); }
  function fR(v){ return 'R$ '+fmtBRL(v); }
  var sL={rascunho:'Rascunho',emitido:'Emitido',recebido:'Recebido',cancelado:'Cancelado'};
  var sC={rascunho:'#666',emitido:'#185FA5',recebido:'#3B6D11',cancelado:'#A32D2D'};
  var fi=[];
  if(rf.obra && rf.obra.length)   fi.push('Obra: <b>'+rf.obra.map(esc).join(', ')+'</b>');
  if(rf.de)     fi.push('De: <b>'+fD(rf.de)+'</b>');
  if(rf.ate)    fi.push('Ate: <b>'+fD(rf.ate)+'</b>');
  if(rf.insumo && rf.insumo.length) fi.push('Insumo: <b>'+rf.insumo.map(esc).join(', ')+'</b>');
  if(rf.status && rf.status.length) fi.push('Status: <b>'+rf.status.map(function(s){ return sL[s]||esc(s); }).join(', ')+'</b>');
  if(!fi.length) fi.push('<b>Todos os pedidos (sem filtros)</b>');
  var vT=pedidosFilt.reduce(function(s,p){ return s+Number(p.total||0); },0);
  var nR=pedidosFilt.filter(function(p){ return p.status==='recebido'; }).length;
  var nRasc=pedidosFilt.filter(function(p){ return p.status==='rascunho'; }).length;
  var nEmit=pedidosFilt.filter(function(p){ return p.status==='emitido'; }).length;
  var nC=pedidosFilt.filter(function(p){ return p.status==='cancelado'; }).length;
  var pR=pedidosFilt.map(function(po,i){
    var sc=sC[po.status]||'#666'; var sl=sL[po.status]||po.status;
    var il=(po.itens||[]).map(function(it){ return esc(it.descricao)+(it.detalhe?' ('+esc(it.detalhe)+')':''); }).join(', ');
    return '<tr style="background:'+(i%2===0?'#fff':'#f9f9f9')+'">'
      +'<td style="font-weight:bold;color:#7c3aed">PO-'+String(po.numero).padStart(3,'0')+'</td>'
      +'<td>'+fD(po.data_emissao||po.criado_em)+'</td>'
      +'<td>'+esc(po.obra)+'</td><td>'+esc(po.fornecedor_nome)+'</td>'
      +'<td style="font-size:8px">'+il+'</td>'
      +'<td style="text-align:right">'+fR(po.total)+'</td>'
      +'<td style="color:'+sc+';font-weight:bold;font-size:9px">'+sl+'</td></tr>';
  }).join('');
  var iM={};
  pedidosFilt.forEach(function(po){
    (po.itens||[]).forEach(function(it){
      var k=(it.descricao||'')+'|||'+(it.detalhe||'');
      if(!iM[k]){
        // Fonte 1: qt_total salvo no próprio item do PO (mais confiável)
        var qtDoItem = (it.qt_total!==undefined && it.qt_total!==null) ? Number(it.qt_total)||0 : null;
        // Fonte 2: triplo lookup no mapa atual (fallback)
        if(qtDoItem===null){
          var descKey = String(it.descricao||'').trim().toUpperCase()+'|||'+String(it.detalhe||'').trim().toUpperCase();
          var fromAtend = itensAtendMap[it.item_id];
          var fromId    = itensMapById[it.item_id];
          var fromDesc  = itensMapByDesc[descKey];
          var dadosMapa = fromAtend || fromId || fromDesc || {};
          qtDoItem = (dadosMapa.qtTotal!==undefined && dadosMapa.qtTotal!==null) ? Number(dadosMapa.qtTotal)||0 : null;
        }
        iM[k]={desc:it.descricao||'',det:it.detalhe||'',unid:it.unid||'',qT:qtDoItem,qP:0,qA:0,vl:0,fn:{}};
      }
      var q=Number(it.qt_pedida)||0;
      iM[k].qP+=q; iM[k].vl+=Number(it.vl_total)||0;
      if(po.status!=='cancelado') iM[k].qA+=q; // Comprometida = qualquer PO ativo
      if(po.status==='recebido') iM[k].qR=(iM[k].qR||0)+q; // Recebida = apenas recebido
      iM[k].fn[po.fornecedor_nome]=(iM[k].fn[po.fornecedor_nome]||0)+q;
    });
  });
  var iR=Object.values(iM).sort(function(a,b){ return a.desc.localeCompare(b.desc); }).map(function(ins,i){
    var qd=ins.qA-(ins.qR||0); var pc=ins.qA>0?Math.round((ins.qR||0)/ins.qA*100):0; // qd = comprometida mas nao recebida
    var qTotalStr = (ins.qT!==null && ins.qT!==undefined) ? String(ins.qT) : '\u2014';
    var qPend = (ins.qT!==null && ins.qT!==undefined) ? Math.max(0, ins.qT - ins.qA) : null;
    var qPendStr = qPend!==null ? String(qPend) : '\u2014';
    var qPendColor = qPend===null ? '#888' : qPend>0 ? '#c0392b' : '#3B6D11';
    // FIX 5: Sem espaço quando unidade está vazia
    var fl=Object.keys(ins.fn).map(function(f){ return esc(f)+' ('+ins.fn[f]+(ins.unid?' '+esc(ins.unid):'')+')'; }).join(', ');
    return '<tr style="background:'+(i%2===0?'#fff':'#f9f9f9')+'">'
      +'<td><b>'+esc(ins.desc)+'</b>'+(ins.det?'<br><span style="font-size:8px;color:#888">'+esc(ins.det)+'</span>':'')+'</td>'
      +'<td style="text-align:center">'+esc(ins.unid)+'</td>'
      +'<td style="text-align:center;font-weight:bold;color:#2a5298">'+qTotalStr+'</td>'
      +'<td style="text-align:center;font-weight:bold;color:#3B6D11">'+ins.qA+'</td>'
      +'<td style="text-align:center;font-weight:bold;color:'+qPendColor+'">'+qPendStr+'</td>'
      +'<td style="text-align:center;font-weight:bold;color:#3B6D11">'+(ins.qR||0)+'</td>'
      +'<td style="text-align:center;font-weight:bold;color:'+(qd>0?'#185FA5':'#3B6D11')+'">'+qd+'</td>'
      +'<td style="text-align:center"><span style="background:'+(pc>=100?'#EAF3DE':'#FEF3CD')+';color:'+(pc>=100?'#3B6D11':'#856404')+';padding:2px 6px;border-radius:99px;font-size:8px">'+pc+'%</span></td>'
      +'<td style="text-align:right;font-weight:bold">'+fR(ins.vl)+'</td>'
      +'<td style="font-size:8px;color:#555">'+fl+'</td></tr>';
  }).join('');
  var css='<style>*{font-family:Arial,sans-serif;font-size:10px;box-sizing:border-box;}'
    +'body{margin:20px;} h2{margin:0;font-size:16px;} h3{font-size:12px;margin:16px 0 8px;padding-bottom:4px;}'
    +'.hdr{background:#7c3aed;color:#fff;padding:14px 18px;}'
    +'.kpi{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:10px 0;}'
    +'.kc{background:#f9f9f9;border:1px solid #eee;border-radius:4px;padding:8px;text-align:center;}'
    +'.kl{font-size:8px;color:#888;text-transform:uppercase;display:block;margin-bottom:2px;}'
    +'.kv{font-size:14px;font-weight:bold;}'
    +'.fb{background:#f0eaff;border:1px solid #d4b8ff;border-radius:4px;padding:8px 12px;margin:8px 0;font-size:9px;}'
    +'table{width:100%;border-collapse:collapse;margin-bottom:10px;}'
    +'th{background:#2a5298;color:#fff;padding:6px 8px;font-size:9px;text-align:left;}'
    +'th.p{background:#7c3aed;} td{padding:5px 8px;font-size:9px;border-bottom:1px solid #eee;}'
    +'.tf{background:#f0eaff;font-weight:bold;}'
    +'.rod{text-align:center;font-size:8px;color:#bbb;margin-top:14px;border-top:1px solid #eee;padding-top:8px;}'
    +'</style>';
  return '<!DOCTYPE html><html><head><meta charset="UTF-8">'+css+'</head><body>'
    +'<div class="hdr"><h2>RELATORIO DE PEDIDOS DE COMPRA</h2>'
    +'<p style="font-size:9px;opacity:.85;margin:3px 0 0">MAPACOT V6 CSS - Gerado em '+dtG+'</p></div>'
    +'<div class="fb">Filtros: '+fi.join(' | ')+'</div>'
    +'<div class="kpi">'
    +'<div class="kc"><span class="kl">Total POs</span><span class="kv" style="color:#2a5298">'+pedidosFilt.length+'</span></div>'
    +'<div class="kc"><span class="kl">Valor Total</span><span class="kv" style="color:#7c3aed;font-size:11px">'+fR(vT)+'</span></div>'
    +'<div class="kc"><span class="kl">Recebidos</span><span class="kv" style="color:#3B6D11">'+nR+'</span></div>'
    +'<div class="kc"><span class="kl">Emitidos</span><span class="kv" style="color:#185FA5">'+nEmit+'</span></div>'
    +'<div class="kc"><span class="kl">Rascunhos</span><span class="kv" style="color:#b06000">'+nRasc+'</span></div>'
    +'<div class="kc"><span class="kl">Cancelados</span><span class="kv" style="color:#c0392b">'+nC+'</span></div>'
    +'</div>'
    +'<h3 style="color:#2a5298;border-bottom:2px solid #2a5298">PEDIDOS</h3>'
    +(pedidosFilt.length===0?'<p style="color:#888;text-align:center;padding:20px">Nenhum pedido encontrado para os filtros selecionados.</p>'
      :'<table><thead><tr><th>No PO</th><th>Data</th><th>Obra</th><th>Fornecedor</th><th>Insumos</th><th style="text-align:right">Total</th><th>Status</th></tr></thead><tbody>'
      +pR+'<tr class="tf"><td colspan="5" style="text-align:right">TOTAL GERAL</td><td style="text-align:right">'+fR(vT)+'</td><td></td></tr></tbody></table>')
    +'<h3 style="color:#7c3aed;border-bottom:2px solid #7c3aed">CONSOLIDADO POR INSUMO</h3>'
    +(Object.keys(iM).length===0?'<p style="color:#888;text-align:center;padding:20px">Sem insumos para exibir.</p>'
      :'<table><thead><tr><th class="p">Insumo / Detalhe</th><th class="p" style="text-align:center">Un.</th>'
      +'<th class="p" style="text-align:center">Qt.Total</th><th class="p" style="text-align:center">Qt.Atendida</th><th class="p" style="text-align:center;background:#5b21b6">Qt.Pendente</th>'
      +'<th class="p" style="text-align:center">Qt.Recebida</th><th class="p" style="text-align:center">Qt.A Receber</th><th class="p" style="text-align:center">% Recebido</th>'
      +'<th class="p" style="text-align:right">Vl.Total</th><th class="p">Fornecedores</th>'
      +'</tr></thead><tbody>'+iR+'</tbody></table>')
    +'<div class="rod">MAPACOT V6 CSS - '+dtG+'</div></body></html>';
}
// ===========================================================================
// ─── RELAÇÃO DE INSUMOS ───────────────────────────────────────────────────────
// Helper: converte valor financeiro aceitando vírgula e ponto decimal
var fmtBRL = function fmtBRL(v) {
  var n = Number(v||0); if(isNaN(n)) n=0;
  if (Math.abs(n) < 0.005) n = 0; // FIX: evita mostrar "-0,00" quando o valor é praticamente zero
  var s = n.toFixed(2); var parts = s.split('.');
  parts[0] = parts[0].replace(/(\d)(?=(\d{3})+$)/g, '$1.');
  return parts[0] + ',' + parts[1];
};
var parsePOVal = function(v){ var s=String(v||'').trim().replace(',','.'); var n=parseFloat(s); return isNaN(n)?0:n; };
var buildPedidoPDF = function buildPedidoPDF(po) {
  // FIX 1: esc() local para evitar XSS/layout quebrado no PDF
  function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  var num = 'PO-' + String(po.numero).padStart(3,'0');
  var dtRaw = po.data_emissao || po.criado_em;
  var dtObj = dtRaw ? new Date(dtRaw) : new Date();
  var dt = isNaN(dtObj.getTime()) ? new Date().toLocaleDateString('pt-BR') : dtObj.toLocaleDateString('pt-BR');
  var css = '<style>*{font-family:Arial,sans-serif;font-size:11px;box-sizing:border-box;}'
    + 'body{margin:24px;} h2{margin:0;font-size:16px;} '
    + '.hdr{background:#7c3aed;color:#fff;padding:14px 18px;border-radius:6px 6px 0 0;}'
    + '.body{padding:14px 18px;border:1px solid #ddd;border-top:none;border-radius:0 0 6px 6px;}'
    + '.grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px;}'
    + '.box{background:#f9f9f9;border:1px solid #eee;border-radius:4px;padding:8px 10px;}'
    + '.box label{font-size:8px;color:#888;text-transform:uppercase;display:block;margin-bottom:3px;}'
    + '.box span{font-size:11px;font-weight:bold;}'
    + 'table{width:100%;border-collapse:collapse;margin-bottom:12px;}'
    + 'th{background:#7c3aed;color:#fff;padding:7px 9px;font-size:9px;text-align:left;}'
    + 'td{padding:7px 9px;font-size:10px;border-bottom:1px solid #eee;}'
    + '.tr{background:#f0eaff;font-weight:bold;color:#7c3aed;}'
    + '.obs{background:#f9f9f9;border:1px solid #eee;border-radius:4px;padding:8px 10px;font-size:9px;color:#555;margin-bottom:14px;}'
    + '.sign{display:flex;justify-content:space-between;padding-top:14px;border-top:1px solid #eee;margin-top:12px;}'
    + '.sbox{text-align:center;} .sline{border-top:1px solid #333;margin-top:32px;padding-top:4px;font-size:9px;color:#888;min-width:160px;}'
    + '.rodape{text-align:center;font-size:8px;color:#bbb;margin-top:16px;}'
    + '</style>';
  var itensHTML = (po.itens||[]).map(function(it, i){
    return '<tr>'
      + '<td>' + (i+1) + '</td>'
      + '<td><strong>' + (it.descricao||'') + '</strong></td>'
      + '<td style="font-size:9px;color:#555;">' + (it.detalhe||'') + '</td>'
      + '<td style="text-align:center;">' + (it.unid||'') + '</td>'
      + '<td style="text-align:right;">' + (it.qt_pedida||0) + '</td>'
      + '<td style="text-align:right;">R$ ' + fmtBRL(it.vl_unit) + '</td>'
      + '<td style="text-align:right;">R$ ' + fmtBRL(it.vl_total) + '</td>'
      + '</tr>';
  }).join('');
  var subtotal = (po.itens||[]).reduce(function(s,i){ return s+Number(i.vl_total||0); },0);
  var fin = po.financeiro||{};
  var descVal=parsePOVal(fin.desconto),  descMode=fin.desconto_mode||'%';
  var acrVal=parsePOVal(fin.acrescimo),  acrMode=fin.acrescimo_mode||'%';
  var freteVal=parsePOVal(fin.frete),    freteMode=fin.frete_mode||'R$';
  var impVal=parsePOVal(fin.impostos),   impMode=fin.impostos_mode||'%';
  // FIX: mesma proteção aplicada na tela — sem isso, um desconto negativo digitado por engano
  // faria o PDF OFICIAL enviado ao fornecedor mostrar um valor total maior (ou negativo) do que
  // deveria, já que a conta ficava invertida.
  var vlDesc  = Math.max(0, descMode==='%'  ? subtotal*descVal/100  : descVal);
  var vlAcr   = Math.max(0, acrMode==='%'   ? subtotal*acrVal/100   : acrVal);
  var baseImp = Math.max(0, subtotal-vlDesc+vlAcr);
  var vlFrete = Math.max(0, freteMode==='%' ? subtotal*freteVal/100 : freteVal);
  var vlImp   = Math.max(0, impMode==='%'   ? baseImp*impVal/100    : impVal);
  function fR(v){ return 'R$ '+fmtBRL(v); }
  var finHTML = '';
  if(descVal||acrVal||freteVal||impVal){
    finHTML = '<tr style="background:#f9f9f9"><td colspan="5" style="text-align:right;font-size:9px;color:#666;">Subtotal</td><td style="text-align:right;font-size:9px;">'+fR(subtotal)+'</td></tr>';
    if(descVal) finHTML += '<tr style="background:#f9f9f9"><td colspan="5" style="text-align:right;font-size:9px;color:#c0392b;">Desconto ('+(descMode==='%'?descVal+'%':fR(descVal))+')</td><td style="text-align:right;font-size:9px;color:#c0392b;">- '+fR(vlDesc)+'</td></tr>';
    if(acrVal)  finHTML += '<tr style="background:#f9f9f9"><td colspan="5" style="text-align:right;font-size:9px;color:#3B6D11;">Acréscimo ('+(acrMode==='%'?acrVal+'%':fR(acrVal))+')</td><td style="text-align:right;font-size:9px;color:#3B6D11;">+ '+fR(vlAcr)+'</td></tr>';
    if(impVal)  finHTML += '<tr style="background:#f9f9f9"><td colspan="5" style="text-align:right;font-size:9px;color:#b06000;">Impostos ('+(impMode==='%'?impVal+'%':fR(impVal))+')</td><td style="text-align:right;font-size:9px;color:#b06000;">+ '+fR(vlImp)+'</td></tr>';
    if(freteVal) finHTML += '<tr style="background:#f9f9f9"><td colspan="5" style="text-align:right;font-size:9px;color:#185FA5;">Frete '+(freteMode==='%'?'('+freteVal+'%)':'')+' </td><td style="text-align:right;font-size:9px;color:#185FA5;">+ '+fR(vlFrete)+'</td></tr>';
  }
  var totalFmt = fR(po.total||0);
  var obsHTML = po.observacao ? '<div class="obs"><strong>Observações:</strong> ' + po.observacao + '</div>' : '';
  return '<!DOCTYPE html><html><head><meta charset="UTF-8">' + css + '</head><body>'
    + '<div class="hdr">'
    + '<h2>🛒 PEDIDO DE COMPRA &nbsp; ' + num + '</h2>'
    + '<p style="margin:3px 0 0;font-size:9px;opacity:.85;">' + esc(po.obra||'') + ' &nbsp;·&nbsp; Emitido em ' + dt + '</p>'
    + '</div>'
    + '<div class="body">'
    + '<div class="grid">'
    + '<div class="box"><label>Fornecedor</label><span>' + esc(po.fornecedor_nome||'') + '</span></div>'
    + '<div class="box"><label>Número do Pedido</label><span style="color:#7c3aed;font-size:16px;">' + num + '</span></div>'
    + '<div class="box"><label>Obra / Projeto</label><span>' + esc(po.obra||'') + '</span></div>'
    + '<div class="box"><label>Data de Emissão</label><span>' + dt + '</span></div>'
    + (po.forma_pagamento ? '<div class="box"><label>Forma de Pagamento</label><span>' + esc(po.forma_pagamento) + '</span></div>' : '')
    + '</div>'
    + '<table>'
    + '<thead><tr><th>#</th><th>Descrição</th><th>Detalhe</th><th>Unid.</th><th style="text-align:right">Qt.</th><th style="text-align:right">Vl. Unit.</th><th style="text-align:right">Vl. Total</th></tr></thead>'
    + '<tbody>' + itensHTML + finHTML
    + '<tr class="tr"><td colspan="6" style="text-align:right;">TOTAL DO PEDIDO</td><td style="text-align:right;font-size:13px;">' + totalFmt + '</td></tr>'
    + '</tbody></table>'
    + obsHTML
    + '<div class="sign">'
    + '<div class="sbox"><div class="sline">Solicitante / Responsável</div></div>'
    + '<div style="text-align:center;font-size:8px;color:#bbb;align-self:flex-end;">MAPACOT V6 CSS &nbsp;·&nbsp; ' + dt + '</div>'
    + '<div class="sbox"><div class="sline">Aprovação / Visto</div></div>'
    + '</div>'
    + '</div>'
    + '</body></html>';
};
// ──────────────────────────────────────────────────────────────────────────────

buildInsumosHTML = function buildInsumosHTML(obraName, now, itens) {
  // FIX: esc() local para evitar XSS/quebra de layout com nomes/descrições contendo < > & "
  function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  var dt = (now instanceof Date ? now : new Date(now))
    .toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit',year:'2-digit'});
  var hr = (now instanceof Date ? now : new Date(now))
    .toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
  var css = '<style>*{font-family:Arial,sans-serif;font-size:11px;}'
    + 'body{margin:20px;} h2{font-size:13px;color:#1d3c6e;margin:0 0 4px;}'
    + '.sub{font-size:10px;color:#666;margin-bottom:12px;}'
    + 'table{width:100%;border-collapse:collapse;}'
    + 'th{background:#1d3c6e;color:#fff;padding:5px 8px;text-align:left;}'
    + 'td{padding:5px 8px;border-bottom:0.5px solid #ddd;vertical-align:top;}'
    + 'tr:nth-child(even) td{background:#f5f7fb;}'
    + '.footer{margin-top:10px;font-size:9px;color:#999;text-align:right;}'
    + '</style>';
  var rows = itens.map(function(item, idx){
    return '<tr>'
      + '<td style="width:40px;text-align:center;">'+(idx+1)+'</td>'
      + '<td>'+esc((item.descricao||'').toUpperCase())+(item.detalhe?'<div style="font-size:9px;color:#4a6888;margin-top:2px;word-break:break-word;">\u21b3 '+esc(item.detalhe)+'</div>':'')+'</td>'
      + '<td style="width:80px;text-align:right;">'+(item.qt||'')+'</td>'
      + '<td style="width:60px;text-align:center;">'+(item.unidade||item.und||'UN')+'</td>'
      + '</tr>';
  }).join('');
  return '<!DOCTYPE html><html><head><meta charset="UTF-8">'+css+'</head><body>'
    + '<h2>RELAÇÃO DE INSUMOS — MAPA DE COTAÇÃO</h2>'
    + '<div class="sub">'+esc((obraName||'').toUpperCase())+' &nbsp;|&nbsp; GERADO EM '+dt+' – '+hr+' – MAPACOT V6 CSS</div>'
    + '<table>'
    + '<thead><tr>'
    + '<th style="width:40px;text-align:center;">#</th>'
    + '<th>DESCRIÇÃO DO INSUMO</th>'
    + '<th style="width:80px;text-align:right;">QUANTIDADE</th>'
    + '<th style="width:60px;text-align:center;">UNID.</th>'
    + '</tr></thead>'
    + '<tbody>'+rows+'</tbody>'
    + '</table>'
    + '<div class="footer">Total de insumos: '+itens.length+' &nbsp;|&nbsp; MAPACOT V6 CSS</div>'
    + '</body></html>';
};

// ─── PDF ──────────────────────────────────────────────────────────────────────
var buildMapaHTML = function buildMapaHTML(mapa) {
  // FIX: esc() local para evitar XSS/quebra de layout com nomes/descrições contendo < > & "
  function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  var now = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Date();
  // FIX: data de criação do mapa, validada (cai para "now" se ausente ou corrompida) — usada para
  // mostrar "CRIADO EM" separado de "IMPRESSO EM" no cabeçalho, em vez de mostrar sempre a hora
  // atual como se o mapa tivesse sido criado agora mesmo.
  var dataCriacaoValida0 = (function () {
    if (!mapa.criadoEm) return now; // FIX: new Date(null/undefined/"") viraria 1970 (data "válida" mas errada)
    var d = new Date(mapa.criadoEm);
    return isNaN(d.getTime()) ? now : d;
  })();
  var orcamentos = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var associacoes = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  var T = getTheme(mapa.corTema);
  var fns = mapa.fornecedores || [];
  var itens = mapa.itens || [];
  var precos = mapa.precos || {};
  var detalhes = mapa.detalhes || {};
  var rodape = mapa.rodape || {};
  var totalBruto = function totalBruto(fid) {
    return itens.reduce(function (acc, item) {
      var v = parseMoney(precos["".concat(item.id, "_").concat(fid)]);
      var qt = parseFloat(String(item.qt).replace(",", "."));
      return acc + (v !== null && !isNaN(qt) && qt > 0 ? v * qt : 0);
    }, 0);
  };
  var calcVL = function calcVL(fid) {
    var r = rodape[fid] || {};
    return totalBruto(fid) - Math.max(0, parseMoney(r.desconto) || 0) + Math.max(0, parseMoney(r.impostos) || 0) + Math.max(0, parseMoney(r.frete) || 0); // FIX: protege contra valor negativo digitado por engano, que inverteria a conta
  };
  var bestFornId = function () {
    var minVal = null,
      minId = null;
    fns.forEach(function (f) {
      var vl = calcVL(f.id);
      if (vl > 0 && (minVal === null || vl < minVal)) {
        minVal = vl;
        minId = f.id;
      }
    });
    return minId;
  }();
  var resumoTotal = itens.reduce(function (acc, item) {
    var r = calcResumo(item, fns, precos);
    return acc + (r.vlTotal || 0);
  }, 0);
  // ── Página 0 ──────────────────────────────────────────────────────────
  var obraOrc = mapa.obra && orcamentos[mapa.obra] ? orcamentos[mapa.obra] : null;
  var obraOrcItens = obraOrc ? (Array.isArray(obraOrc) ? obraOrc : (obraOrc.itens||[])) : [];
  var mapaAssocs = associacoes.filter(function(a){ return a.mapaId === mapa.id; });
  var temPagina0 = obraOrcItens.length > 0;
  var showOrcPdf = !mapa.orcOculto; // quando oculto na tela, não aparece no PDF
  var pagina0HTML = '';
  if (temPagina0 && showOrcPdf) {
    var hC0=T.hdr,sC0=T.sub,oeS0='background:#fffbee;',reS0='background:#eef2ff;';
    var rowsP0 = itens.map(function(item,ix) {
      var bg0=ix%2===0?'':'background:#f7f9fc;';
      var r0=calcResumo(item,fns,precos);
      var a0=mapaAssocs.find(function(a){return a.itemMapaId===item.id;});
      var oi0=a0?obraOrcItens.find(function(o){return o.codigo===a0.orcItemCodigo;}):null;
      var vo0=oi0?(parseFloat(oi0.valorUnitario||oi0.vl_unitario)||0)*(parseFloat(a0&&a0.fator)||1):null;
      var qt0=parseFloat(String(item.qt).replace(',','.'))||0;
      var vt0=r0.vlUnit!==null?r0.vlUnit*qt0:0;
      var res0=vo0&&vt0>0?(vo0*qt0)-vt0:null;
      var semA0=!a0||!oi0;
      var desc0=esc(item.descricao)+(item.detalhe?'<div style="font-size:8px;color:#4a6888;border-top:1px dotted #c0cce0;margin-top:2px;padding-top:2px;word-break:break-word;">\u21b3 '+esc(item.detalhe)+'</div>':'');
      var orcC0=semA0
        ?'<td style="border:1px solid #ccc;border-left:2px solid #e0bf30;'+oeS0+'text-align:center;"><span style="font-size:9px;color:#ccc;">SEM ASSOC.</span></td>'
         +'<td style="border:1px solid #ccc;border-right:2px solid #e0bf30;'+oeS0+'text-align:center;color:#ccc;">\u2014</td>'
        :'<td style="border:1px solid #ccc;border-left:2px solid #e0bf30;'+oeS0+'text-align:right;padding:5px 8px;">'
           +'<div style="font-size:12px;font-weight:700;color:#7a4400;">R$ '+fmtMoney(vo0)+'</div>'
           +'<div style="font-size:9px;color:#aaa;">'+(item.unid===(oi0&&oi0.unidade)?'mesma unidade':item.unid+' \u2192 '+(oi0&&oi0.unidade||''))+'</div></td>'
         +'<td style="border:1px solid #ccc;border-right:2px solid #e0bf30;'+oeS0+'text-align:center;padding:5px 8px;">'
           +(res0!==null
             ?'<div style="font-size:10px;font-weight:700;color:'+(res0>=0?'#186818':'#aa1c1c')+';">\u25cf '+(res0>=0?'LUCRO':'PREJ.')+'</div>'
              +'<div style="font-size:9px;color:'+(res0>=0?'#186818':'#aa1c1c')+';">'+(res0>=0?'+':'\u2212')+Math.abs(Math.round(res0/(vo0*qt0)*1000)/10).toFixed(1)+'% \u00b7 R$ '+fmtMoney(Math.abs(res0)/qt0)+'/UN</div>'
              +'<div style="font-size:9px;font-weight:700;color:'+(res0>=0?'#186818':'#aa1c1c')+';margin-top:2px;border-top:1px dotted '+(res0>=0?'#8ecba8':'#e8a0a0')+';padding-top:2px;">'+(res0>=0?'+ ':'\u2212 ')+'R$ '+fmtMoney(Math.abs(res0))+' TOTAL</div>'
             :'\u2014')+'</td>';
      var resC0=r0.vlUnit!==null
        ?'<td style="border:1px solid #ccc;'+reS0+'text-align:right;">R$ '+fmtMoney(r0.vlUnit)+'</td>'
         +'<td style="border:1px solid #ccc;'+reS0+'text-align:right;font-weight:bold;">R$ '+fmtMoney(r0.vlTotal||0)+'</td>'
         +'<td style="border:1px solid #ccc;'+reS0+'font-size:9px;">'+(r0.forn||'')+'</td>'
        :'<td style="border:1px solid #ccc;'+reS0+'"></td><td style="border:1px solid #ccc;'+reS0+'"></td><td style="border:1px solid #ccc;'+reS0+'font-size:9px;"></td>';
      return '<tr style="'+bg0+'">'
        +'<td style="border:1px solid #ccc;text-align:center;color:#666;">'+item.num+'</td>'
        +'<td style="border:1px solid #ccc;text-align:center;">'+(item.qt||'')+'</td>'
        +'<td style="border:1px solid #ccc;text-align:center;">'+(item.unid||'')+'</td>'
        +'<td style="border:1px solid #ccc;">'+desc0+'</td>'
        +orcC0+resC0+'</tr>';
    }).join('');
    var rTot0=itens.reduce(function(ac,it){var r=calcResumo(it,fns,precos);return ac+(r.vlTotal||0);},0);
    var orcRes0=itens.reduce(function(ac,it){
      var r=calcResumo(it,fns,precos);
      var qt=parseFloat(String(it.qt).replace(',','.'))||0;
      var vt=r.vlUnit!==null?r.vlUnit*qt:0;
      // Somar TODAS as associações do item (igual à tela)
      var assocsIt=mapaAssocs.filter(function(x){return x.itemMapaId===it.id;});
      if(!assocsIt.length||!vt) return ac;
      var vlOrc=assocsIt.reduce(function(s,a){
        // Lookup robusto para todos os casos:
        // 1) index válido E código confere → usa index (distingue itens com mesmo código)
        // 2) código não confere no index → busca por código (orçamento reimportado)
        var oi = null;
        var idx = a.orcItemIndex;
        if (idx != null && idx >= 0 && idx < obraOrcItens.length) {
          var byIdx = obraOrcItens[idx];
          if (byIdx && byIdx.codigo === a.orcItemCodigo) oi = byIdx;
        }
        if (!oi) oi = obraOrcItens.find(function(o){ return o.codigo===a.orcItemCodigo; });
        if(!oi) return s;
        // qtCompra já em unidades do orçamento — correto para fator 3M, 6M ou N associações
        var qtC=parseFloat(String(a.qtCompra).replace(",","."))||0;
        return s+(parseFloat(oi.valorUnitario||oi.vl_unitario)||0)*qtC;
      },0);
      return ac+(vlOrc>0?vlOrc-vt:0);
    },0);
    var rC0=orcRes0>=0?'#186818':'#aa1c1c';
    var rL0=orcRes0>=0?'\u25cf LUCRO':'\u25cf PREJ.';
    var rod0=mapa.rodape||{},rSum0=rod0['__resumo__']||{};
    var vlLiq0=rTot0-(parseMoney(rSum0.desconto)||0)+(parseMoney(rSum0.impostos)||0)+(parseMoney(rSum0.frete)||0);
    var rodP0=''
      +'<tr style="background:#c5d8f0;"><td colspan="4" style="border:1px solid #ccc;font-weight:700;">TOTAL</td>'
        +'<td style="border:1px solid #ccc;border-left:2px solid #e0bf30;'+oeS0+'text-align:center;color:#ccc;">\u2014</td>'
        +'<td style="border:1px solid #ccc;border-right:2px solid #e0bf30;'+oeS0+'text-align:center;font-weight:700;color:'+rC0+';">'
          +'<div style="font-size:9px;">'+rL0+'</div><div style="font-size:10px;font-weight:800;">'+(orcRes0>=0?'+ ':'\u2212 ')+'R$ '+fmtMoney(Math.abs(orcRes0))+'</div></td>'
        +'<td style="border:1px solid #ccc;border-right:none;'+reS0+'"></td>'
        +'<td style="border:1px solid #ccc;border-left:none;border-right:none;'+reS0+'text-align:right;font-weight:bold;">R$ '+fmtMoney(rTot0)+'</td>'
        +'<td style="border:1px solid #ccc;border-left:none;'+reS0+'"></td></tr>'
      +'<tr><td colspan="4" style="border:1px solid #ccc;font-weight:700;font-size:10px;">DESCONTO</td>'
        +'<td style="border:1px solid #ccc;border-left:2px solid #e0bf30;'+oeS0+'text-align:center;color:#ccc;">\u2014</td>'
        +'<td style="border:1px solid #ccc;border-right:2px solid #e0bf30;'+oeS0+'text-align:center;color:#ccc;">\u2014</td>'
        +'<td style="border:1px solid #ccc;border-right:none;'+reS0+'"></td><td style="border:1px solid #ccc;border-left:none;border-right:none;'+reS0+'"></td><td style="border:1px solid #ccc;border-left:none;'+reS0+'"></td></tr>'
      +'<tr style="background:#f7f9fc;"><td colspan="4" style="border:1px solid #ccc;font-weight:700;font-size:10px;">IMPOSTOS</td>'
        +'<td style="border:1px solid #ccc;border-left:2px solid #e0bf30;'+oeS0+'text-align:center;color:#ccc;">\u2014</td>'
        +'<td style="border:1px solid #ccc;border-right:2px solid #e0bf30;'+oeS0+'text-align:center;color:#ccc;">\u2014</td>'
        +'<td style="border:1px solid #ccc;border-right:none;'+reS0+'"></td><td style="border:1px solid #ccc;border-left:none;border-right:none;'+reS0+'"></td><td style="border:1px solid #ccc;border-left:none;'+reS0+'"></td></tr>'
      +'<tr><td colspan="4" style="border:1px solid #ccc;font-weight:700;font-size:10px;">FRETE</td>'
        +'<td style="border:1px solid #ccc;border-left:2px solid #e0bf30;'+oeS0+'text-align:center;color:#ccc;">\u2014</td>'
        +'<td style="border:1px solid #ccc;border-right:2px solid #e0bf30;'+oeS0+'text-align:center;color:#ccc;">\u2014</td>'
        +'<td style="border:1px solid #ccc;border-right:none;'+reS0+'"></td><td style="border:1px solid #ccc;border-left:none;border-right:none;'+reS0+'"></td><td style="border:1px solid #ccc;border-left:none;'+reS0+'"></td></tr>'
      +'<tr style="background:#f7f9fc;"><td colspan="4" style="border:1px solid #ccc;font-weight:700;font-size:10px;">VALOR L\u00cdQUIDO</td>'
        +'<td style="border:1px solid #ccc;border-left:2px solid #e0bf30;'+oeS0+'text-align:center;color:#ccc;">\u2014</td>'
        +'<td style="border:1px solid #ccc;border-right:2px solid #e0bf30;'+oeS0+'text-align:center;color:#ccc;">\u2014</td>'
        +'<td style="border:1px solid #ccc;border-right:none;'+reS0+'"></td>'
        +'<td style="border:1px solid #ccc;border-left:none;border-right:none;'+reS0+'text-align:right;font-weight:700;color:#1a56b0;">'+(vlLiq0>0?'R$ '+fmtMoney(vlLiq0):'\u2014')+'</td>'
        +'<td style="border:1px solid #ccc;border-left:none;'+reS0+'"></td></tr>'
      +'<tr><td colspan="4" style="border:1px solid #ccc;font-weight:700;font-size:10px;">CONTATO</td>'
        +'<td style="border:1px solid #ccc;border-left:2px solid #e0bf30;'+oeS0+'text-align:center;color:#ccc;">\u2014</td>'
        +'<td style="border:1px solid #ccc;border-right:2px solid #e0bf30;'+oeS0+'text-align:center;color:#ccc;">\u2014</td>'
        +'<td colspan="3" style="border:1px solid #ccc;'+reS0+'font-size:9px;">'+(rSum0.contato||'\u2014')+'</td></tr>'
      +'<tr style="background:#f7f9fc;"><td colspan="4" style="border:1px solid #ccc;font-weight:700;font-size:10px;">OBSERVA\u00c7\u00d5ES</td>'
        +'<td style="border:1px solid #ccc;border-left:2px solid #e0bf30;'+oeS0+'text-align:center;color:#ccc;">\u2014</td>'
        +'<td style="border:1px solid #ccc;border-right:2px solid #e0bf30;'+oeS0+'text-align:center;color:#ccc;">\u2014</td>'
        +'<td colspan="3" style="border:1px solid #ccc;'+reS0+'font-size:9px;word-wrap:break-word;white-space:normal;">'+(rSum0.observacao||'\u2014')+'</td></tr>';
    pagina0HTML='<div style="margin-bottom:20px;page-break-after:always;">'
      +'<div style="background:'+hC0+';padding:9px 14px;border-radius:4px 4px 0 0;display:flex;align-items:center;gap:14px;">'
        +'<div style="font-size:13px;font-weight:bold;color:#fff;white-space:nowrap;">MAPA DE COTA\u00c7\u00c3O</div>'
        +'<div style="font-size:11px;color:rgba(255,255,255,0.95);font-weight:700;border-left:1px solid rgba(255,255,255,0.35);padding-left:14px;white-space:nowrap;">MP N\u00ba: '+(mapa.numero||1)+'</div>'
        +(mapa.obra?'<div style="font-size:11px;color:#fff;font-weight:600;flex:1;border-left:1px solid rgba(255,255,255,0.35);padding-left:14px;">OBRA: '+esc((mapa.obra||'').toUpperCase())+'</div>':'')
        +'<div style="display:flex;flex-direction:column;gap:1px;align-items:flex-end;margin-left:auto;">'
          +'<div style="font-size:9.5px;color:rgba(255,255,255,0.65);white-space:nowrap;">CRIADO EM <span style="color:#fff;font-weight:600;">'+fmtDate(dataCriacaoValida0)+' '+fmtHora(dataCriacaoValida0)+'</span></div>'
          +'<div style="font-size:9.5px;color:rgba(255,255,255,0.65);white-space:nowrap;">IMPRESSO EM <span style="color:#fff;font-weight:600;">'+fmtDate(now)+' '+fmtHora(now)+'</span></div>'
        +'</div>'
      +'</div>'
      +'<table style="border-collapse:collapse;width:100%;table-layout:fixed;font-size:10px;">'
        +'<colgroup><col style="width:3%"><col style="width:8%"><col style="width:5%"><col style="width:21%">'
        +'<col style="width:11%"><col style="width:12%"><col style="width:9%"><col style="width:10%"><col style="width:21%"></colgroup>'
        +'<thead><tr>'
          +'<th rowspan="2" style="border:1px solid #999;padding:4px 5px;text-align:center;background:'+hC0+';color:#fff;">ITEM</th>'
          +'<th rowspan="2" style="border:1px solid #999;padding:4px 5px;text-align:center;background:'+hC0+';color:#fff;">QT.</th>'
          +'<th rowspan="2" style="border:1px solid #999;padding:4px 5px;text-align:center;background:'+hC0+';color:#fff;">UNID.</th>'
          +'<th rowspan="2" style="border:1px solid #999;padding:4px 5px;text-align:left;background:'+hC0+';color:#fff;">DESCRI\u00c7\u00c3O</th>'
          +'<th colspan="2" style="border:1px solid #999;padding:4px 5px;text-align:center;background:#b87800;color:#fff;font-weight:700;">OR\u00c7AMENTO</th>'
          +'<th colspan="3" style="border:1px solid #999;padding:4px 5px;text-align:center;background:'+hC0+';color:#fff;font-weight:700;">RESUMO \u2014 FORNECEDOR SELECIONADO</th>'
        +'</tr><tr>'
          +'<th style="border:1px solid #999;padding:4px 5px;text-align:center;background:#d48800;color:#fff;font-size:9px;">VL. OR\u00c7ADO<br><span style=\'font-weight:400;\'>por unid. compra</span></th>'
          +'<th style="border:1px solid #999;padding:4px 5px;text-align:center;background:#d48800;color:#fff;font-size:9px;">RESULTADO<br><span style=\'font-weight:400;\'>vs. melhor pre\u00e7o</span></th>'
          +'<th style="border:1px solid #999;padding:4px 5px;text-align:right;background:'+sC0+';font-size:9px;">VL. UNIT.</th>'
          +'<th style="border:1px solid #999;padding:4px 5px;text-align:right;background:'+sC0+';font-size:9px;">VL. TOTAL</th>'
          +'<th style="border:1px solid #999;padding:4px 5px;background:'+sC0+';font-size:9px;">FORNECEDOR</th>'
        +'</tr></thead>'
        +'<tbody>'+rowsP0+rodP0+'</tbody>'
      +'</table></div>';
  }
  var chunks = [];
  for (var i = 0; i < Math.max(fns.length, 1); i += CHUNK_SIZE) chunks.push(fns.slice(i, i + CHUNK_SIZE));
  var hdrColor = T.hdr;
  var subColor = T.sub;
  var bestColor = T.best;
  var RODAPE_ROWS = [{
    key: "desconto",
    label: "DESCONTO",
    money: true
  }, {
    key: "impostos",
    label: "IMPOSTOS",
    money: true
  }, {
    key: "frete",
    label: "FRETE",
    money: true
  }, {
    key: "valorLiquido",
    label: "VALOR LÍQUIDO",
    computed: true
  }, {
    key: "contato",
    label: "CONTATO",
    maxLen: 1000
  }, {
    key: "observacao",
    label: "OBSERVAÇÕES",
    maxLen: 2000
  }];
  var th = function th(txt) {
    var ex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
    return "<th style=\"border:1px solid #999;padding:5px 7px;text-align:center;font-size:10px;letter-spacing:0.3px;".concat(ex, "\">").concat(txt, "</th>");
  };
  var renderChunk = function renderChunk(chunk, ci) {
    var isFirst = ci === 0 && (!temPagina0 || !showOrcPdf);
    var emptyChunk = chunk.length === 0;
    var itemRows = itens.map(function (item, idx) {
      var r = calcResumo(item, fns, precos);
      var bg = idx % 2 === 0 ? "#fff" : "#f7f9fc";
      var _pdfPrices = [];
      fns.forEach(function(f) { var _v = parseMoney(precos[item.id + "_" + f.id]); if (_v !== null && _v > 0) _pdfPrices.push(_v); });
      var _pdfUniq = _pdfPrices.filter(function(v, i, arr) { return arr.indexOf(v) === i; }).sort(function(a, b) { return a - b; });
      var _pdfRank2 = _pdfUniq.length > 1 ? _pdfUniq[1] : null;
      var _pdfRank3 = _pdfUniq.length > 2 ? _pdfUniq[2] : null;
      var fornCells = chunk.map(function (f) {
        var key = "".concat(item.id, "_").concat(f.id);
        var unit = parseMoney(precos[key]);
        var isMin = r.vlUnit !== null && unit !== null && unit > 0 && unit === r.vlUnit;
        var isPdfRank2 = !isMin && _pdfRank2 !== null && unit !== null && unit > 0 && unit === _pdfRank2;
        var isPdfRank3 = !isMin && !isPdfRank2 && _pdfRank3 !== null && unit !== null && unit > 0 && unit === _pdfRank3;
        return "<td style=\"border:1px solid #ccc;padding:4px 6px;text-align:right;background:".concat(isMin ? bestColor : isPdfRank2 ? "#ffe4b0" : isPdfRank3 ? "#ffcece" : bg, ";font-weight:").concat(isMin ? "bold" : isPdfRank2 ? "bold" : isPdfRank3 ? "bold" : "normal", ";color:").concat(isMin ? "#1a5a1a" : isPdfRank2 ? "#a05000" : isPdfRank3 ? "#a01010" : "#222", ";\">").concat(unit !== null ? fmtMoney(unit) : "").concat(detalhes[key] ? "<div style=\"font-size:8px;color:#4a6888;border-top:1px dotted #c0cce0;margin-top:2px;padding-top:2px;text-align:left;word-break:break-word;\">\u21b3 " + detalhes[key] + "</div>" : "", "</td>");
      }).join("");
      var resumoCells = isFirst ? "<td style=\"border:1px solid #ccc;padding:4px 6px;text-align:right;background:#eef2ff;\">".concat(r.vlUnit !== null ? fmtMoney(r.vlUnit) : "").concat(r.minFornId && detalhes[item.id + "_" + r.minFornId] ? "<div style=\"font-size:8px;color:#4a6888;border-top:1px dotted #c0cce0;margin-top:2px;padding-top:2px;text-align:left;word-break:break-word;\">\u21b3 " + detalhes[item.id + "_" + r.minFornId] + "</div>" : "", "</td><td style=\"border:1px solid #ccc;padding:4px 6px;text-align:right;font-weight:bold;background:#eef2ff;\">").concat(r.vlTotal !== null ? fmtMoney(r.vlTotal) : "", "</td><td style=\"border:1px solid #ccc;padding:4px 6px;font-size:9px;background:#eef2ff;\">").concat(r.forn || "", "</td>") : "";
      return "<tr style=\"background:".concat(bg, ";\"><td style=\"border:1px solid #ccc;padding:4px 6px;text-align:center;color:#666;\">").concat(item.num, "</td><td style=\"border:1px solid #ccc;padding:4px 6px;text-align:center;\">").concat(item.qt || "", "</td><td style=\"border:1px solid #ccc;padding:4px 6px;text-align:center;\">").concat(item.unid || "", "</td><td style=\"border:1px solid #ccc;padding:4px 6px;\">").concat(esc(item.descricao) || "", (item.detalhe ? "<div style=\"margin-top:3px;font-size:8px;color:#4a6888;border-top:1px dotted #c0cce0;padding-top:2px;word-break:break-word;\">\u21b3 " + esc(item.detalhe) + "</div>" : ""), "</td>").concat(resumoCells).concat(fornCells, "</tr>");
    }).join("");
    var rodapeRows = RODAPE_ROWS.map(function (row) {
      var resumoCell = isFirst ? function () {
        var rr = rodape["__resumo__"] || {};
        var val = "";
        if (row.computed) {
          var desc = parseMoney(rr.desconto) || 0;
          var imp = parseMoney(rr.impostos) || 0;
          var fret = parseMoney(rr.frete) || 0;
          var vl = resumoTotal - desc + imp + fret;
          val = vl > 0 ? fmtMoney(vl) : "—";
        } else {
          var raw = rr[row.key] || "";
          val = row.money ? raw ? fmtMoney(parseMoney(raw)) || raw : "" : raw;
        }
        if (!row.money && !row.computed) {
          return "<td colspan=\"3\" style=\"border:1px solid #ccc;padding:4px 6px;text-align:left;word-wrap:break-word;overflow-wrap:break-word;white-space:normal;font-size:9px;background:#eef2ff;color:#555;\">".concat(val, "</td>");
        }
        var vs = row.money || row.computed ? "text-align:right;" : "text-align:left;";
        return "<td style=\"border:1px solid #ccc;padding:4px 6px;background:#eef2ff;\"></td><td style=\"border:1px solid #ccc;padding:4px 6px;".concat(vs, "background:#eef2ff;color:#555;\">").concat(val, "</td><td style=\"border:1px solid #ccc;padding:4px 6px;background:#eef2ff;\"></td>");
      }() : "";
      var fornCells = chunk.map(function (f) {
        var r2 = rodape[f.id] || {};
        if (row.computed) {
          var vl = calcVL(f.id);
          return "<td style=\"border:1px solid #ccc;padding:4px 6px;text-align:right;font-weight:bold;color:#1a56b0;\">".concat(vl > 0 ? fmtMoney(vl) : "—", "</td>");
        }
        var cellStyle = row.money ? "border:1px solid #ccc;padding:4px 6px;text-align:right;" : "border:1px solid #ccc;padding:4px 6px;text-align:left;word-wrap:break-word;overflow-wrap:break-word;white-space:normal;font-size:9px;";
        return "<td style=\"".concat(cellStyle, "\">").concat(r2[row.key] || "", "</td>");
      }).join("");
      return "<tr><td colspan=\"4\" style=\"border:1px solid #ccc;padding:4px 10px;font-weight:700;font-size:10px;\">".concat(row.label, "</td>").concat(resumoCell).concat(fornCells, "</tr>");
    }).join("");
    var totalFornCells = chunk.map(function (f) {
      var t = totalBruto(f.id);
      return "<td style=\"border:1px solid #ccc;padding:4px 6px;text-align:right;font-weight:bold;background:#f0f2f8;\">".concat(t > 0 ? fmtMoney(t) : "—", "</td>");
    }).join("");
    var fornHdrs = emptyChunk ? th("—", "background:".concat(hdrColor, ";color:#fff;")) : chunk.map(function (f) {
      return th(esc(f.nome) || "FORNECEDOR", "background:".concat(hdrColor, ";color:#fff;"));
    }).join("");
    var fornSubHdrs = emptyChunk ? th("VL. UNIT.", "background:".concat(subColor, ";text-align:right;")) : chunk.map(function () {
      return th("VL. UNIT.", "background:".concat(subColor, ";text-align:right;"));
    }).join("");
    var resumaTotCells = isFirst ? "<td style=\"border:1px solid #ccc;padding:4px 6px;background:#eef2ff;\"></td><td style=\"border:1px solid #ccc;padding:4px 6px;text-align:right;font-weight:bold;background:#eef2ff;\">".concat(resumoTotal > 0 ? fmtMoney(resumoTotal) : "—", "</td><td style=\"border:1px solid #ccc;padding:4px 6px;background:#eef2ff;\"></td>") : "";
    // LAYOUT APROVADO: 3%(IT) 8%(QT) 5%(UN) — % uniformes em todos os cenários
    var colsBase = isFirst
      ? "<col style=\"width:3%\"/><col style=\"width:8%\"/><col style=\"width:5%\"/><col style=\"width:18%\"//>" 
      : "<col style=\"width:3%\"/><col style=\"width:8%\"/><col style=\"width:5%\"/><col style=\"width:24%\"//>";
    return "<table style=\"border-collapse:collapse;width:100%;table-layout:fixed;font-size:10px;margin-bottom:0;\"><colgroup>".concat(colsBase).concat(isFirst ? "<col style=\"width:7%\"/><col style=\"width:9%\"/><col style=\"width:11%\"/>" : "", " ").concat(chunk.map(function () {
      return "<col style=\"width:".concat(isFirst ? emptyChunk ? 39 : Math.floor(39 / Math.max(chunk.length, 1)) : Math.floor(60 / Math.max(chunk.length, 1)), "%\"/>");
    }).join(""), "</colgroup><thead><tr><th rowspan=\"2\" style=\"border:1px solid #999;padding:4px 5px;text-align:center;background:").concat(hdrColor, ";color:#fff;\">ITEM</th><th rowspan=\"2\" style=\"border:1px solid #999;padding:4px 5px;text-align:center;background:").concat(hdrColor, ";color:#fff;\">QT.</th><th rowspan=\"2\" style=\"border:1px solid #999;padding:4px 5px;text-align:center;background:").concat(hdrColor, ";color:#fff;\">UNID.</th><th rowspan=\"2\" style=\"border:1px solid #999;padding:4px 5px;text-align:left;background:").concat(hdrColor, ";color:#fff;overflow:hidden;\">DESCRI\xC7\xC3O</th>").concat(isFirst ? "<th colspan=\"3\" style=\"border:1px solid #999;padding:4px 5px;text-align:center;font-weight:bold;background:".concat(hdrColor, ";color:#fff;\">RESUMO \u2014 FORNECEDOR SELECIONADO</th>") : "").concat(fornHdrs, "</tr><tr>").concat(isFirst ? "".concat(th("VL. UNIT.", "background:".concat(subColor, ";text-align:right;"))).concat(th("VL. TOTAL", "background:".concat(subColor, ";text-align:right;"))).concat(th("FORNECEDOR", "background:".concat(subColor, ";font-size:9px;"))) : "", " ").concat(fornSubHdrs, "</tr></thead><tbody>").concat(itemRows, "<tr style=\"background:").concat(subColor, ";\"><td colspan=\"4\" style=\"border:1px solid #ccc;padding:4px 10px;font-weight:700;\">TOTAL</td>").concat(resumaTotCells).concat(totalFornCells, "</tr>").concat(rodapeRows, "</tbody></table>");
  };
  var obsGeralHTML = mapa.obsGeral ? "<div style=\"margin-top:14px;border:1.5px solid ".concat(hdrColor, ";border-radius:4px;overflow:hidden;\"><div style=\"background:").concat(hdrColor, ";color:#fff;padding:7px 12px;font-weight:700;font-size:11px;letter-spacing:0.4px;\">OBSERVACAO GERAL DO MAPA</div><div style=\"padding:10px 12px;font-size:11px;white-space:pre-wrap;background:#fff;\">").concat(esc((mapa.obsGeral || "").toUpperCase()), "</div></div>") : "";
  var pagesHTML = chunks.map(function (chunk, ci) {
    return "<div style=\"margin-bottom:20px;".concat(ci > 0 ? "page-break-before:always;" : "", "\"><div style=\"background:").concat(hdrColor, ";padding:9px 14px;border-radius:4px 4px 0 0;display:flex;align-items:center;gap:14px;\"><div style=\"font-size:13px;font-weight:bold;color:#fff;white-space:nowrap;\">MAPA DE COTA\xC7\xC3O</div><div style=\"font-size:11px;color:rgba(255,255,255,0.95);font-weight:700;border-left:1px solid rgba(255,255,255,0.35);padding-left:14px;white-space:nowrap;\">MP N\xBA: ").concat(mapa.numero || 1, "</div>").concat(mapa.obra ? "<div style=\"font-size:11px;color:rgba(255,255,255,0.95);font-weight:600;flex:1;border-left:1px solid rgba(255,255,255,0.35);padding-left:14px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;\">OBRA: ".concat(esc((mapa.obra || "").toUpperCase()), "</div>") : "", "<div style=\"display:flex;flex-direction:column;gap:1px;align-items:flex-end;margin-left:auto;\"><div style=\"font-size:9.5px;color:rgba(255,255,255,0.65);white-space:nowrap;\">CRIADO EM <span style=\"color:#fff;font-weight:600;\">").concat(fmtDate(dataCriacaoValida0), " ", fmtHora(dataCriacaoValida0), "</span></div><div style=\"font-size:9.5px;color:rgba(255,255,255,0.65);white-space:nowrap;\">IMPRESSO EM <span style=\"color:#fff;font-weight:600;\">").concat(fmtDate(now), " ", fmtHora(now), "</span></div></div></div>").concat(renderChunk(chunk, ci), "</div>").concat(ci === chunks.length - 1 ? obsGeralHTML : "");
  }).join("");
  var pdfTitle = "MAPA DE COTACAO - MP N".concat(mapa.numero || 1).concat(mapa.obra ? " - " + (mapa.obra || "").replace(/[^a-zA-Z0-9 ÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜàáâãäåçèéêëìíîïòóôõöùúûü]/g, "").trim().slice(0, 40) : "", " - ").concat(fmtDate(now));
  return "<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><title>".concat(pdfTitle, "</title><style>@page{size:A4 landscape;margin:8mm;}*{box-sizing:border-box;}body{font-family:Arial,sans-serif;font-size:11px;color:#222;text-transform:uppercase;margin:0;padding:6px;background:#fff;}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}</style></head><body>").concat(pagina0HTML + pagesHTML, "</body></html>");
};
var gerarRelatorioOrcamento = function gerarRelatorioOrcamento(mapasComCurrent, obra, orcamentos, associacoes) {
  // FIX: esc() local para evitar XSS/quebra de layout com descrições/justificativas contendo < > & "
  function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  var obraUp = (obra||"").toUpperCase();
  var obraOrc = orcamentos[obra] ? (orcamentos[obra].itens || orcamentos[obra]) : null;
  if (!obraOrc) { alert("OBRA SEM OR\xC7AMENTO IMPORTADO."); return; }
  var mapasFiltrados = mapasComCurrent.filter(function(m){ return (m.obra||"").toUpperCase().includes(obraUp); });
  var now = new Date();
  var css = [
    "@page{size:A4 landscape;margin:8mm;}",
    "body{font-family:Arial,sans-serif;font-size:10px;text-transform:uppercase;margin:0;padding:6px;background:#fff;}",
    "@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}",
    "table{border-collapse:collapse;width:100%;font-size:10px;}",
    "th,td{border:1px solid #ccc;padding:5px 7px;}",
    ".ok{background:#f0fff4;} .over{background:#fff0f0;} .warn{background:#fffbe6;} .add{background:#f0f4ff;}",
    ".tot{background:#c5d8f0;font-weight:700;}",
    ".tag{display:inline-block;padding:2px 6px;border-radius:3px;font-size:9px;font-weight:700;}"
  ].join("");

  // Para cada item do orçamento, calcular consumido e associações
  var itensProcesados = obraOrc.map(function(orcItem, idxOrcItem) {
    // Filtrar associações: usar mapaId dos mapas da obra (mais confiável que comparar nome da obra)
    var mapaIdsObra = mapasFiltrados.map(function(m){ return m.id; });
    var codigoNorm = String(parseInt(orcItem.codigo||"0",10));
    var assocItem = associacoes.filter(function(a){
      if (a.referencia) return false; // associação de mapa duplicado — não conta no consumo
      var mapaOk = mapaIdsObra.indexOf(a.mapaId) >= 0;
      var codOk = a.orcItemCodigo===orcItem.codigo
        || a.orcItemCodigo===codigoNorm
        || orcItem.codigo===String(parseInt(a.orcItemCodigo||"0",10));
      var indexOk = (a.orcItemIndex != null && a.orcItemIndex >= 0)
        ? a.orcItemIndex === idxOrcItem
        : true;
      return mapaOk && codOk && indexOk;
    });
    // Apenas associações cujo item no mapa está marcado como comprado
    assocItem = assocItem.filter(function(a){
      var mapa = mapasFiltrados.find(function(m){ return m.id === a.mapaId; });
      var itemMapa = mapa ? (mapa.itens||[]).find(function(it){ return it.id === a.itemMapaId; }) : null;
      return itemMapa ? !!itemMapa.comprado : false;
    });
    // Recalcular consumido usando quantidade ATUAL do item no mapa (não a salva na associação)
    var consumidoCalc = assocItem.reduce(function(ac,a){
      var mapa = mapasFiltrados.find(function(m){ return m.id === a.mapaId; });
      var itemMapa = mapa ? (mapa.itens||[]).find(function(it){ return it.id === a.itemMapaId; }) : null;
      var qtMapa = itemMapa ? (parseFloat(String(itemMapa.qt).replace(",","."))||0) : 0;
      var qtSalva = parseFloat(String(a.qtCompra).replace(",","."))||0;
      var qtAtual = (qtSalva > 0 && qtSalva < qtMapa) ? qtSalva : (qtMapa || qtSalva);
      return ac + qtAtual * (parseFloat(a.fator)||1);
    }, 0);
    var consumido = consumidoCalc > 0 ? consumidoCalc : (parseFloat(orcItem.consumido)||0);
    var previsto = parseFloat(orcItem.quantidade)||0;
    var saldo = previsto - consumido;
    var excedentes = assocItem.filter(function(a){ return (parseFloat(a.excedente)||0)>0; });
    // Melhor cotação associada
    var vlCotado = null;
    var vlTotalCotado = 0;
    assocItem.forEach(function(a) {
      var mapa = mapasComCurrent.find(function(m){ return m.id===a.mapaId; });
      if (!mapa) return;
      var item = (mapa.itens||[]).find(function(i){ return i.id===a.itemMapaId; });
      if (!item) return;
      var r = calcResumo(item, mapa.fornecedores||[], mapa.precos||{});
      if (r.vlUnit !== null) {
        var fator = parseFloat(a.fator)||1;
        vlCotado = r.vlUnit / fator;
        var qtCompraAssoc = parseFloat(String(a.qtCompra).replace(",","."))||0;
        var qtMapa = parseFloat(String(item.qt).replace(",","."))||0;
        var qtUsar = (qtCompraAssoc > 0 && qtCompraAssoc < qtMapa) ? qtCompraAssoc : qtMapa;
        vlTotalCotado += (r.vlUnit / fator) * qtUsar * fator;
      }
    });
    var vlOrc = parseFloat(orcItem.valorUnitario||orcItem.vl_unitario)||0;
    var resultado = vlTotalCotado > 0 ? (vlOrc * consumido) - vlTotalCotado : null;
    return { orcItem:orcItem, consumido:consumido, previsto:previsto, saldo:saldo, excedentes:excedentes, vlCotado:vlCotado, vlTotalCotado:vlTotalCotado, resultado:resultado, vlOrc:vlOrc, adicionado:false };
  });

  // Itens adicionados nos mapas sem associação ao orçamento
  var itensAdicionados = [];
  mapasFiltrados.forEach(function(mapa) {
    (mapa.itens||[]).forEach(function(item) {
      if (!item.comprado) return;
      var assocDoItem = associacoes.filter(function(a){ return a.mapaId===mapa.id && a.itemMapaId===item.id; });
      var temAssoc = assocDoItem.length > 0;
      if (!temAssoc) {
        var r = calcResumo(item, mapa.fornecedores||[], mapa.precos||{});
        itensAdicionados.push({ item:item, mapa:mapa, resumo:r });
      }
    });
  });

  // Totais
  var totalOrcado     = itensProcesados.reduce(function(ac,x){ return ac + x.vlOrc*(x.previsto||0); }, 0);
  var totalCotadoOrc  = itensProcesados.reduce(function(ac,x){ return ac + x.vlTotalCotado; }, 0);
  var totalAdicionado = itensAdicionados.reduce(function(ac,x){ return ac + (x.resumo.vlTotal||0); }, 0);
  var totalCotado     = totalCotadoOrc + totalAdicionado;
  var totalResultadoOrc = itensProcesados.reduce(function(ac,x){ return ac + (x.resultado||0); }, 0);
  var totalResultado  = totalResultadoOrc - totalAdicionado;
  var saldoDisponivel = totalOrcado - totalAdicionado - totalCotadoOrc;
  var resLucro  = totalResultado >= 0;
  var resBrd    = resLucro ? "#186818" : "#cc2222";
  var resBg     = resLucro ? "#f0fff4" : "#fff0f0";
  var resSit    = resLucro ? "LUCRO" : "PREJU\xcdZO";
  var resVal    = (resLucro ? "+" : "\u2212") + fmtMoney(Math.abs(totalResultado));
  var resSub    = resLucro ? "economia vs. or\xE7ado" : (totalAdicionado > 0 ? "incl. \u2212" + fmtMoney(totalAdicionado) + " adicionados" : "custo acima do previsto");
  var saldoCor  = saldoDisponivel >= 0 ? "#186818" : "#aa1c1c";
  var sCot      = totalCotadoOrc > 0 ? "#186818" : "#1a2a4a";
  var sTotCot   = totalCotado > 0 ? "#186818" : "#1a2a4a";

  // Cabeçalho topo
  var cabTopoHTML = "<div style=\"background:#2a5298;padding:10px 16px;border-radius:4px 4px 0 0;display:flex;align-items:center;justify-content:space-between;gap:12px;\">"
    + "<div>"
    + "<div style=\"color:#fff;font-size:13px;font-weight:800;letter-spacing:0.5px;\">RELAT\xD3RIO DE OR\xC7AMENTO POR OBRA</div>"
    + "<div style=\"color:rgba(255,255,255,0.78);font-size:10px;margin-top:3px;\">" + esc(obra) + " &nbsp;|&nbsp; " + fmtDate(now) + "</div>"
    + "</div>"
    + "<div style=\"display:flex;gap:8px;\">"
    + "<div style=\"background:rgba(255,255,255,0.15);border-radius:6px;padding:5px 12px;color:#fff;text-align:center;min-width:56px;\">"
    + "<div style=\"font-size:16px;font-weight:900;line-height:1.1;\">" + mapasFiltrados.length + "</div>"
    + "<div style=\"font-size:8px;opacity:0.80;\">MAPAS</div></div>"
    + "<div style=\"background:rgba(255,255,255,0.15);border-radius:6px;padding:5px 12px;color:#fff;text-align:center;min-width:56px;\">"
    + "<div style=\"font-size:16px;font-weight:900;line-height:1.1;\">" + obraOrc.length + "</div>"
    + "<div style=\"font-size:8px;opacity:0.80;\">ITENS</div></div>"
    + "</div></div>";

  // Faixa financeira — cabeçalho
  var cfS = "flex:1;padding:10px 16px;border-right:1px solid #eef0f5;";
  var cabFaixaHTML = "<div style=\"display:flex;align-items:stretch;border-bottom:3px solid #2a5298;\">"
    + "<div style=\"" + cfS + "\">"
    + "<div style=\"font-size:8px;color:#999;font-weight:700;margin-bottom:4px;\">VL. TOTAL OR\xC7ADO</div>"
    + "<div style=\"font-size:15px;font-weight:800;color:#2a5298;\">" + fmtMoney(totalOrcado) + "</div>"
    + "<div style=\"font-size:8px;color:#aaa;margin-top:2px;\">valor previsto SINAPI</div></div>"
    + "<div style=\"" + cfS + "background:#fff8f8;border-left:3px solid #cc2222;\">"
    + "<div style=\"font-size:8px;color:#cc2222;font-weight:800;margin-bottom:4px;\">\u26a0 ADICIONADO (\u2212)</div>"
    + "<div style=\"font-size:15px;font-weight:800;color:#cc2222;\">" + fmtMoney(totalAdicionado) + "</div>"
    + "<div style=\"font-size:8px;color:#cc2222;opacity:0.7;margin-top:2px;\">custo extra n\xE3o previsto</div></div>"
    + "<div style=\"" + cfS + "\">"
    + "<div style=\"font-size:8px;color:#999;font-weight:700;margin-bottom:4px;\">VL. COTADO</div>"
    + "<div style=\"font-size:15px;font-weight:800;color:" + sCot + ";\">" + fmtMoney(totalCotadoOrc) + "</div>"
    + "<div style=\"font-size:8px;color:#aaa;margin-top:2px;\">compras realizadas</div></div>"
    + "<div style=\"" + cfS + (saldoDisponivel < 0 ? "background:#fff8f8;" : "") + "\">"
    + "<div style=\"font-size:8px;color:#999;font-weight:700;margin-bottom:4px;\">SALDO DISPON\xcdVEL</div>"
    + "<div style=\"font-size:15px;font-weight:800;color:" + saldoCor + ";\">" + fmtMoney(saldoDisponivel) + "</div>"
    + "<div style=\"font-size:8px;color:#aaa;margin-top:2px;\">or\xE7ado \u2212 adicionado \u2212 cotado</div></div>"
    + "<div style=\"padding:10px 18px;min-width:185px;display:flex;flex-direction:column;justify-content:center;background:" + resBg + ";border-left:4px solid " + resBrd + ";\">"
    + "<div style=\"font-size:8px;font-weight:800;color:" + resBrd + ";margin-bottom:4px;\">\u25cf RESULTADO GERAL</div>"
    + "<div style=\"font-size:11px;font-weight:800;color:" + resBrd + ";\">" + resSit + "</div>"
    + "<div style=\"font-size:19px;font-weight:900;color:" + resBrd + ";line-height:1.1;\">" + resVal + "</div>"
    + "<div style=\"font-size:8px;color:" + resBrd + ";opacity:0.75;margin-top:3px;\">" + resSub + "</div>"
    + "</div></div>";

  // Linhas dos itens do orçamento
  var rows = itensProcesados.map(function(x) {
    var oi = x.orcItem;
    var ativoItem = x.orcItem.ativo !== false;
    var cls = !ativoItem ? "" : (x.saldo < 0 ? "over" : (x.vlCotado===null ? "warn" : "ok"));
    var sitTag = !ativoItem
      ? "<span class=\"tag\" style=\"background:#e9ecef;color:#6c757d;\">\u23f8 INATIVO</span>"
      : (x.saldo < 0
        ? "<span class=\"tag\" style=\"background:#f8d7da;color:#721c24;\">\u26a0 EXCEDENTE</span>"
        : (x.vlCotado===null
          ? "<span class=\"tag\" style=\"background:#fff3cd;color:#856404;\">\u23f3 PENDENTE</span>"
          : "<span class=\"tag\" style=\"background:#d4edda;color:#155724;\">\u2713 OK</span>"));
    // FIX: divisão por zero — se vlOrc ou consumido forem 0, a fórmula original gerava
    // "Infinity%" na tela (era possível reproduzir isso de verdade, não só em teoria).
    var baseCalculo = (x.vlOrc || 0) * (x.consumido || 0);
    var pctResultado = baseCalculo > 0 ? (Math.abs(x.resultado / baseCalculo * 100) || 0) : 0;
    var resTag = x.resultado !== null
      ? (x.resultado>=0
        ? "<span class=\"tag\" style=\"background:#d4edda;color:#155724;\">\u25cf LUCRO +"+pctResultado.toFixed(1)+"%</span><div style=\"font-size:9px;color:#186818;\">+ "+fmtMoney(x.resultado)+"</div>"
        : "<span class=\"tag\" style=\"background:#f8d7da;color:#721c24;\">\u25cf PREJU\xcdZO \u2212"+pctResultado.toFixed(1)+"%</span><div style=\"font-size:9px;color:#aa1c1c;\">\u2212 "+fmtMoney(Math.abs(x.resultado))+"</div>")
      : "<span style=\"color:#aaa;font-size:9px;\">SEM COTA\xc7\xc3O</span>";
    var row = "<tr class=\""+cls+"\">"
      + "<td style=\"font-size:9px;color:#555;\">"+(oi.codigo||"\u2014")+"</td>"
      + "<td style=\"text-align:left;\">"+esc(oi.descricao||"")+"</td>"
      + "<td style=\"text-align:center;\">"+(oi.unidade||"")+"</td>"
      + "<td style=\"text-align:right;\">"+(x.previsto||0)+"</td>"
      + "<td style=\"text-align:right;"+(x.saldo<0?"font-weight:700;color:#aa1c1c;":"")+"\">"+(x.consumido||0)+"</td>"
      + "<td style=\"text-align:right;font-weight:700;color:"+(x.saldo<0?"#aa1c1c":x.saldo===0?"#888":"#186818")+";\">"+x.saldo+"</td>"
      + "<td style=\"text-align:right;\">"+fmtMoney(x.vlOrc)+"</td>"
      + "<td style=\"text-align:right;"+(x.vlCotado!==null?(x.vlCotado<x.vlOrc?"color:#186818;font-weight:700;":"color:#aa1c1c;font-weight:700;"):"color:#aaa;")+"\">"+(x.vlCotado!==null?fmtMoney(x.vlCotado):"\u2014")+"</td>"
      + "<td style=\"text-align:right;font-weight:700;\">"+(x.vlTotalCotado>0?fmtMoney(x.vlTotalCotado):"\u2014")+"</td>"
      + "<td style=\"text-align:center;\">"+resTag+"</td>"
      + "<td style=\"text-align:center;\">"+sitTag+"</td>"
      + "</tr>";
    if (x.excedentes.length) {
      row += "<tr style=\"background:#fff5f5;\"><td colspan=\"11\" style=\"font-size:9px;color:#aa1c1c;padding:3px 14px;border-top:none;\">"
        + x.excedentes.map(function(e){ return "\u21b3 <strong>JUSTIFICATIVA EXCEDENTE (+"+(parseFloat(e.excedente)||0)+" "+(oi.unidade||"")+"): </strong>"+esc(e.justificativa||"S/J")+" \u2014 MP N\xBA "+(mapasFiltrados.find(function(m){return m.id===e.mapaId;})||{}).numero; }).join(" | ")
        + "</td></tr>";
    }
    return row;
  }).join("");

  // Itens adicionados
  var rowsAdd = itensAdicionados.map(function(x) {
    return "<tr class=\"add\">"
      + "<td style=\"font-size:9px;color:#888;\">\u2014</td>"
      + "<td style=\"text-align:left;\">"+esc(x.item.descricao)+"<div style=\"font-size:8px;color:#4a6888;margin-top:2px;\">\u21b3 ITEM ADICIONADO \u2014 MP N\xBA "+x.mapa.numero+"</div></td>"
      + "<td style=\"text-align:center;\">"+(x.item.unid||"")+"</td>"
      + "<td style=\"text-align:right;color:#888;\">\u2014</td>"
      + "<td style=\"text-align:right;\">"+(x.item.qt||"")+"</td>"
      + "<td style=\"text-align:right;color:#888;\">\u2014</td>"
      + "<td style=\"text-align:right;color:#888;\">\u2014</td>"
      + "<td style=\"text-align:right;\">"+(x.resumo.vlUnit!==null?fmtMoney(x.resumo.vlUnit):"\u2014")+"</td>"
      + "<td style=\"text-align:right;font-weight:700;\">"+(x.resumo.vlTotal!==null?fmtMoney(x.resumo.vlTotal):"\u2014")+"</td>"
      + "<td style=\"text-align:center;color:#888;font-size:9px;\">N/A</td>"
      + "<td style=\"text-align:center;\"><span class=\"tag\" style=\"background:#cce5ff;color:#004085;\">+ ADICIONADO</span></td>"
      + "</tr>";
  }).join("");

  // Subtotal dentro da tabela
  var rowSubOrc = "<tr style=\"background:#e8f0fb;font-weight:700;color:#2a5298;border-top:2px solid #2a5298;\">"
    + "<td colspan=\"6\" style=\"text-align:right;\">SUBTOTAL ITENS OR\xC7AMENTO</td>"
    + "<td style=\"text-align:right;\">" + fmtMoney(totalOrcado) + "</td>"
    + "<td style=\"text-align:right;\">\u2014</td>"
    + "<td style=\"text-align:right;\">" + fmtMoney(totalCotadoOrc) + "</td>"
    + "<td style=\"text-align:center;color:" + (totalResultadoOrc >= 0 ? "#186818" : "#aa1c1c") + ";font-size:9px;\">"
    + (totalResultadoOrc !== 0 ? (totalResultadoOrc >= 0 ? "\u25cf LUCRO +" : "\u25cf PREJU\xcdZO \u2212") + fmtMoney(Math.abs(totalResultadoOrc)) : "SEM COTA\xc7\xc3O")
    + "</td><td></td></tr>";

  // Rodapé espelho
  var rfS = "flex:1;padding:10px 16px;border-right:1px solid #e0e6f0;background:#f8faff;";
  var rodapeHTML = "<div style=\"display:flex;align-items:stretch;border-top:3px solid #2a5298;\">"
    + "<div style=\"" + rfS + "\">"
    + "<div style=\"font-size:8px;color:#999;font-weight:700;margin-bottom:4px;\">VL. TOTAL OR\xC7ADO</div>"
    + "<div style=\"font-size:14px;font-weight:800;color:#2a5298;\">" + fmtMoney(totalOrcado) + "</div></div>"
    + "<div style=\"flex:1;padding:10px 16px;border-right:1px solid #e0e6f0;background:#fff8f8;border-left:3px solid #cc2222;\">"
    + "<div style=\"font-size:8px;color:#cc2222;font-weight:800;margin-bottom:4px;\">\u26a0 ADICIONADO (\u2212)</div>"
    + "<div style=\"font-size:14px;font-weight:800;color:#cc2222;\">" + fmtMoney(totalAdicionado) + "</div></div>"
    + "<div style=\"" + rfS + "\">"
    + "<div style=\"font-size:8px;color:#999;font-weight:700;margin-bottom:4px;\">VL. TOTAL COTADO</div>"
    + "<div style=\"font-size:14px;font-weight:800;color:" + sTotCot + ";\">" + fmtMoney(totalCotado) + "</div></div>"
    + "<div style=\"" + rfS + (saldoDisponivel < 0 ? "background:#fff8f8;" : "") + "\">"
    + "<div style=\"font-size:8px;color:#999;font-weight:700;margin-bottom:4px;\">SALDO DISPON\xcdVEL</div>"
    + "<div style=\"font-size:14px;font-weight:800;color:" + saldoCor + ";\">" + fmtMoney(saldoDisponivel) + "</div></div>"
    + "<div style=\"padding:10px 18px;min-width:185px;display:flex;flex-direction:column;justify-content:center;background:" + resBrd + ";\">"
    + "<div style=\"font-size:8px;color:rgba(255,255,255,0.85);margin-bottom:3px;\">\u25cf RESULTADO FINAL</div>"
    + "<div style=\"font-size:10px;font-weight:800;color:#fff;\">" + resSit + "</div>"
    + "<div style=\"font-size:18px;font-weight:900;color:#fff;line-height:1.1;\">" + resVal + "</div>"
    + "<div style=\"font-size:8px;color:rgba(255,255,255,0.75);margin-top:3px;\">" + resSub + "</div>"
    + "</div></div>";

  // Legenda
  var legenda = "<div style=\"display:flex;gap:10px;padding:7px 14px;background:#f0f3fa;border-top:1px solid #e0e6f0;flex-wrap:wrap;font-size:9px;color:#777;align-items:center;\">"
    + "<strong style=\"color:#555;\">LEGENDA:</strong>"
    + "<span class=\"tag\" style=\"background:#d4edda;color:#155724;\">\u2713 OK</span> dentro do previsto &nbsp;"
    + "<span class=\"tag\" style=\"background:#f8d7da;color:#721c24;\">\u26a0 EXCEDENTE</span> ultrapassou quantidade &nbsp;"
    + "<span class=\"tag\" style=\"background:#fff3cd;color:#856404;\">\u23f3 PENDENTE</span> sem cota\xE7\xE3o &nbsp;"
    + "<span class=\"tag\" style=\"background:#cce5ff;color:#004085;\">+ ADICIONADO</span> sem previs\xE3o no or\xE7amento"
    + "</div>";

  // Montagem final
  var html = "<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><style>"+css+"</style></head><body>"
    + cabTopoHTML
    + cabFaixaHTML
    + "<table><thead><tr>"
    + "<th style=\"width:8%;\">C\xD3DIGO</th>"
    + "<th style=\"text-align:left;\">DESCRI\xC7\xC3O DO ITEM</th>"
    + "<th style=\"width:5%;\">UNID.</th>"
    + "<th style=\"width:7%;text-align:right;\">QT. PREVISTA</th>"
    + "<th style=\"width:7%;text-align:right;\">QT. CONSUMIDA</th>"
    + "<th style=\"width:6%;text-align:right;\">SALDO</th>"
    + "<th style=\"width:9%;text-align:right;\">VL. UNIT. ORC.</th>"
    + "<th style=\"width:9%;text-align:right;\">VL. UNIT. COTADO</th>"
    + "<th style=\"width:9%;text-align:right;\">VL. TOTAL COTADO</th>"
    + "<th style=\"width:10%;text-align:center;\">RESULTADO</th>"
    + "<th style=\"width:8%;text-align:center;\">SITUA\xC7\xC3O</th>"
    + "</tr></thead><tbody>"+rows+rowsAdd+rowSubOrc+"</tbody></table>"
    + rodapeHTML
    + legenda
    + "</body></html>";

  return html;
};

// ─── DASHBOARD GLOBAL POR FORNECEDOR ──────────────────────────────────────────

var buildDashboardHTML = function buildDashboardHTML(mapa, now, orcamentos, associacoes) {
  // FIX: esc() local para evitar quebra de layout com nomes/descrições contendo < > &
  function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  now = now || new Date(); orcamentos = orcamentos || {}; associacoes = associacoes || [];
  // FIX: data de criação do mapa, validada — para mostrar "CRIADO EM" separado de "IMPRESSO EM"
  var dataCriacaoValidaDash = (function () {
    if (!mapa.criadoEm) return now;
    var d = new Date(mapa.criadoEm);
    return isNaN(d.getTime()) ? now : d;
  })();
  var T = getTheme(mapa.corTema); var hC = T.hdr;
  var fns = mapa.fornecedores || []; var itens = mapa.itens || []; var precos = mapa.precos || {};
  var fmtR = function(v){ return 'R$\u00a0' + fmtMoney(v); };
  var obraOrc = mapa.obra && orcamentos[mapa.obra] ? orcamentos[mapa.obra] : null;
  var obraOrcItens = obraOrc ? (Array.isArray(obraOrc) ? obraOrc : (obraOrc.itens||[])) : [];
  var mapaAssocs = associacoes.filter(function(a){ return a.mapaId === mapa.id; });

  var itemResults = itens.map(function(item) {
    var qt = parseFloat(String(item.qt||0).replace(',','.')) || 0;
    var assoc = mapaAssocs.find(function(a){ return a.itemMapaId === item.id; });
    var orcItem = assoc ? obraOrcItens.find(function(o,i){
      return assoc.orcItemIndex != null ? i === assoc.orcItemIndex : o.codigo === assoc.orcItemCodigo;
    }) : null;
    var vlOrcUnit = orcItem ? (parseFloat(orcItem.valorUnitario||orcItem.vl_unitario)||0) : 0;
    var fatorA = assoc ? (parseFloat(assoc.fator)||1) : 1;
    var vlOrc = vlOrcUnit * fatorA;
    var temOrc = vlOrc > 0;
    var rkgs = [];
    fns.forEach(function(f){
      var v = parseMoney(precos[item.id+'_'+f.id]);
      if (v !== null && v > 0) rkgs.push({ fid:f.id, fname:esc((f.nome||'\u2014').toUpperCase()), preco:v });
    });
    rkgs.sort(function(a,b){ return a.preco-b.preco; });
    var winner = rkgs[0] || null;
    var economy = (temOrc && winner) ? (vlOrc - winner.preco) * qt : null;
    return { item:item, qt:qt, vlOrc:vlOrc, temOrc:temOrc, rkgs:rkgs, winner:winner, economy:economy };
  });

  var temOrcamento = itemResults.some(function(r){ return r.temOrc; });
  var totalOrcado = itemResults.reduce(function(s,r){ return s+(r.temOrc?r.vlOrc*r.qt:0); },0);
  var totalMelhor = itemResults.reduce(function(s,r){ return s+(r.winner?r.winner.preco*r.qt:0); },0);
  var totalEco = itemResults.reduce(function(s,r){ return s+(r.economy!==null&&r.economy>0?r.economy:0); },0);
  var totalEstouro = itemResults.reduce(function(s,r){ return s+(r.economy!==null&&r.economy<0?Math.abs(r.economy):0); },0);
  var ctEco = itemResults.filter(function(r){ return r.economy!==null&&r.economy>0; }).length;
  var ctEstouro = itemResults.filter(function(r){ return r.economy!==null&&r.economy<0; }).length;
  var ctComCot = itemResults.filter(function(r){ return r.rkgs.length>0; }).length;
  var n = itens.length || 1;
  var fmtPct = function(a,b){ return b>0?((a/b)*100).toFixed(0)+'%':'0%'; };
  var BAR_COLORS = ['#2a5298','#1a7a44','#b06000','#5b2d8e','#c0392b','#445566','#0f766e','#7c3aed'];

  var fnStats = fns.map(function(f) {
    var itemsWon = itemResults.filter(function(r){ return r.winner&&r.winner.fid===f.id; });
    var itemsQuoted = itemResults.filter(function(r){ return r.rkgs.some(function(p){ return p.fid===f.id; }); });
    var ecoGen = itemsWon.reduce(function(s,r){ return s+(r.economy!==null&&r.economy>0?r.economy:0); },0);
    var totalQ = itemsQuoted.reduce(function(s,r){
      var p = r.rkgs.find(function(p){ return p.fid===f.id; });
      return s+(p?p.preco*r.qt:0);
    },0);
    var aboveCt = itemResults.filter(function(r){
      var idx = r.rkgs.findIndex(function(p){ return p.fid===f.id; });
      return idx>=0 && r.temOrc && r.rkgs[idx].preco > r.vlOrc;
    }).length;
    var score = Math.round((itemsWon.length/n)*50 + (itemsQuoted.length/n)*30 + (itemsWon.length>0?20:0) - aboveCt*5);
    score = Math.max(0, score);
    return { f:f, itemsWon:itemsWon, itemsQuoted:itemsQuoted, ecoGen:ecoGen, totalQ:totalQ, score:score };
  }).sort(function(a,b){ return b.itemsWon.length-a.itemsWon.length||b.ecoGen-a.ecoGen; });

  var maxEcoItem = itemResults.reduce(function(m,r){ return Math.max(m, r.economy!==null&&r.economy>0?r.economy:0); },1);
  var maxTotalQ = fnStats.reduce(function(m,s){ return Math.max(m,s.totalQ); },1);

  // ── KPI CARDS ──────────────────────────────────────────────────────────────
  var kpiCols = temOrcamento ? 5 : 3;
  var kS = 'background:#f0f6ff;border:1px solid #b5d4f4;border-radius:5px;padding:9px 12px;';
  var kpi = '';
  if(temOrcamento) kpi += '<div style="'+kS+'"><div style="font-size:9px;color:#5f7a9a;text-transform:uppercase;letter-spacing:.3px">Total or\u00e7ado</div><div style="font-size:16px;font-weight:bold;color:#185FA5;margin-top:2px">'+fmtR(totalOrcado)+'</div><div style="font-size:8px;color:#888">refer\u00eancia base</div></div>';
  kpi += '<div style="'+kS+'"><div style="font-size:9px;color:#5f7a9a;text-transform:uppercase;letter-spacing:.3px">Melhor cota\u00e7\u00e3o</div><div style="font-size:16px;font-weight:bold;color:#185FA5;margin-top:2px">'+fmtR(totalMelhor)+'</div><div style="font-size:8px;color:#888">soma dos menores pre\u00e7os</div></div>';
  if(temOrcamento){
    kpi += '<div style="background:#f0fdf4;border:1px solid #bbddb8;border-radius:5px;padding:9px 12px;"><div style="font-size:9px;color:#2d6e3a;text-transform:uppercase;letter-spacing:.3px">Economia l\u00edquida</div><div style="font-size:16px;font-weight:bold;color:#3B6D11;margin-top:2px">'+fmtR(totalEco)+'</div><div style="font-size:8px;color:#555">\u2193 '+fmtPct(totalEco,totalOrcado)+' abaixo do or\u00e7ado</div></div>';
    var estBg=totalEstouro>0?'#fef2f2':'#f9f9f9'; var estBr=totalEstouro>0?'1px solid #f9c1c1':'1px solid #e0e0e0';
    kpi += '<div style="background:'+estBg+';border:'+estBr+';border-radius:5px;padding:9px 12px;"><div style="font-size:9px;color:'+(totalEstouro>0?'#a32d2d':'#888')+';text-transform:uppercase;letter-spacing:.3px">Itens com economia</div><div style="font-size:16px;font-weight:bold;color:'+(totalEstouro>0?'#a32d2d':'#333')+';margin-top:2px">'+ctEco+' / '+n+'</div><div style="font-size:8px;color:#888">'+ctEstouro+' acima do or\u00e7ado</div></div>';
  }
  kpi += '<div style="background:#f9f9f9;border:1px solid #e0e0e0;border-radius:5px;padding:9px 12px;"><div style="font-size:9px;color:#888;text-transform:uppercase;letter-spacing:.3px">Itens cotados</div><div style="font-size:16px;font-weight:bold;color:#333;margin-top:2px">'+ctComCot+' / '+n+'</div><div style="font-size:8px;color:#888">'+fns.length+' fornecedores consultados</div></div>';

  // ── DONUT: distribuição itens ganhos ───────────────────────────────────────
  var totalWon = fnStats.reduce(function(s,f){ return s+f.itemsWon.length; },0);
  var donutHTML = '';
  if(totalWon > 0){
    var cumul = 0;
    var conicParts = fnStats.filter(function(s){ return s.itemsWon.length>0; }).map(function(s,i){
      var pct = (s.itemsWon.length/totalWon)*100;
      var from = cumul; cumul += pct;
      return BAR_COLORS[i%BAR_COLORS.length]+' '+from.toFixed(1)+'% '+cumul.toFixed(1)+'%';
    }).join(', ');
    donutHTML = '<div style="position:relative;width:100px;height:100px;margin:0 auto 10px;">'
      +'<div style="width:100px;height:100px;border-radius:50%;background:conic-gradient('+conicParts+');"></div>'
      +'<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:54px;height:54px;background:#f9f9f9;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-direction:column;">'
        +'<div style="font-size:16px;font-weight:bold;color:#333;">'+totalWon+'</div>'
        +'<div style="font-size:7px;color:#888;">ganhos</div>'
      +'</div></div>';
    donutHTML += '<div style="display:flex;flex-wrap:wrap;gap:3px 8px;justify-content:center;">';
    fnStats.filter(function(s){ return s.itemsWon.length>0; }).forEach(function(s,i){
      donutHTML += '<div style="display:flex;align-items:center;gap:3px;font-size:8px;color:#555;">'
        +'<span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:'+BAR_COLORS[i%BAR_COLORS.length]+';flex-shrink:0;"></span>'
        +esc((s.f.nome||'').substring(0,12))+' '+Math.round(s.itemsWon.length/totalWon*100)+'%'
        +'</div>';
    });
    donutHTML += '</div>';
  } else {
    donutHTML = '<div style="text-align:center;color:#bbb;font-size:10px;padding:20px">Nenhum item ganho</div>';
  }

  // ── BARRAS: economia por item (colorido pelo vencedor) ─────────────────────
  var ecoByItem = itemResults.filter(function(r){ return r.winner; }).map(function(r,i){
    var winnerIdx = fnStats.findIndex(function(s){ return s.f.id===r.winner.fid; });
    var col = BAR_COLORS[Math.max(0,winnerIdx)%BAR_COLORS.length];
    var ecoVal = temOrcamento ? (r.economy!==null&&r.economy>0?r.economy:0) : (r.winner?r.winner.preco*r.qt:0);
    var pct = Math.max(2, Math.round(ecoVal/maxEcoItem*100));
    var desc = esc((r.item.descricao||'').substring(0,18)||('Item '+r.item.num));
    return '<div style="display:flex;align-items:center;gap:5px;margin-bottom:3px;">'
      +'<div style="width:100px;text-align:right;font-size:8px;color:#555;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex-shrink:0">'+desc+'</div>'
      +'<div style="flex:1;background:#e8e8e8;border-radius:2px;height:14px;overflow:hidden;">'
        +(ecoVal>0?'<div style="width:'+pct+'%;height:100%;background:'+col+';border-radius:2px;display:flex;align-items:center;padding-left:4px;"><span style="font-size:8px;color:#fff;font-weight:bold">'+fmtR(ecoVal)+'</span></div>':'<div style="width:2%;height:100%;background:#ddd;border-radius:2px;"></div>')
      +'</div>'
      +'</div>';
  }).join('');
  if(!ecoByItem) ecoByItem = '<div style="font-size:9px;color:#bbb;text-align:center;padding:10px">Sem dados de economia</div>';

  // ── COMPARATIVO TOTAIS POR FORNECEDOR (barras verticais CSS) ──────────────
  // +15% de margem para linha de referência sempre aparecer dentro do gráfico
  var maxBar = Math.max(maxTotalQ, totalMelhor) * 1.15 || 1;
  var refLinePct = Math.min(92, Math.round(totalMelhor/maxBar*100));
  var barChart = '<div style="display:flex;align-items:flex-end;gap:4px;height:100px;padding-bottom:2px;border-bottom:2px solid #e0e0e0;position:relative;margin-bottom:4px;">';
  // linha de referência (melhor cotação)
  barChart += '<div style="position:absolute;bottom:'+refLinePct+'%;left:0;right:0;border-top:2px dashed #c0392b;z-index:1;"></div>';
  fnStats.forEach(function(s,i){
    var hPct = s.totalQ>0 ? Math.round(s.totalQ/maxBar*100) : 2;
    var col = BAR_COLORS[i%BAR_COLORS.length];
    barChart += '<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;">'
      +'<div style="font-size:7px;color:#555;text-align:center;white-space:nowrap;overflow:hidden;width:100%;">'+(s.totalQ>0?fmtR(s.totalQ):'—')+'</div>'
      +'<div style="width:100%;height:'+hPct+'%;background:'+col+';border-radius:3px 3px 0 0;min-height:3px;"></div>'
      +'</div>';
  });
  barChart += '</div>';
  barChart += '<div style="display:flex;gap:4px;">';
  fnStats.forEach(function(s,i){
    var col = BAR_COLORS[i%BAR_COLORS.length];
    barChart += '<div style="flex:1;text-align:center;font-size:7px;color:#555;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;border-top:2px solid '+col+';">'+esc((s.f.nome||'').substring(0,8))+'</div>';
  });
  barChart += '</div>';
  barChart += '<div style="font-size:8px;color:#c0392b;margin-top:4px;">--- Melhor cota\u00e7\u00e3o: '+fmtR(totalMelhor)+'</div>';

  // ── HEATMAP ────────────────────────────────────────────────────────────────
  var hmGrid = 'display:grid;grid-template-columns:90px repeat('+itens.length+',1fr);gap:2px;font-size:8px;';
  var hmHeader = '<div style="padding:3px;"></div>';
  itens.forEach(function(item){
    hmHeader += '<div style="padding:2px 1px;background:#e8ecf2;border-radius:2px;text-align:center;color:#555;font-size:7px;line-height:1.3;overflow:hidden;"><strong>It.'+item.num+'</strong><br>'+esc((item.descricao||'').substring(0,7))+'</div>';
  });
  var hmBody = '';
  fnStats.forEach(function(s,si){
    var fnCol = BAR_COLORS[si%BAR_COLORS.length];
    hmBody += '<div style="padding:3px 5px;font-size:7px;color:#333;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;border-right:2px solid '+fnCol+';text-align:right;">'+esc((s.f.nome||'').substring(0,14))+'</div>';
    itemResults.forEach(function(r){
      var idx = r.rkgs.findIndex(function(p){ return p.fid===s.f.id; });
      var st, txt;
      if(idx<0){ st='background:#f5f5f5;color:#ccc;'; txt='\u2014'; }
      else {
        var pr=r.rkgs[idx].preco; var rank=idx+1;
        var above=r.temOrc&&pr>r.vlOrc;
        if(above){ st='background:#FCEBEB;color:#A32D2D;'; txt='ACIMA'; }
        else if(rank===1){ st='background:#3B6D11;color:#fff;'; txt='1\u00b0'; }
        else if(rank===2){ st='background:#639922;color:#fff;'; txt='2\u00b0'; }
        else if(rank===3){ st='background:#97C459;color:#27500A;'; txt='3\u00b0'; }
        else { st='background:#EAF3DE;color:#3B6D11;'; txt=rank+'\u00b0'; }
      }
      hmBody += '<div style="'+st+'padding:4px 2px;border-radius:2px;text-align:center;font-weight:bold;font-size:8px;">'+txt+'</div>';
    });
  });
  var hmLegenda = '<span><span style="display:inline-block;width:9px;height:9px;background:#3B6D11;border-radius:1px;vertical-align:middle;margin-right:2px"></span>1\u00b0</span> '
    +'<span><span style="display:inline-block;width:9px;height:9px;background:#639922;border-radius:1px;vertical-align:middle;margin-right:2px"></span>2\u00b0</span> '
    +'<span><span style="display:inline-block;width:9px;height:9px;background:#97C459;border-radius:1px;vertical-align:middle;margin-right:2px"></span>3\u00b0</span> '
    +'<span><span style="display:inline-block;width:9px;height:9px;background:#EAF3DE;border:1px solid #97C459;border-radius:1px;vertical-align:middle;margin-right:2px"></span>4\u00b0+</span> '
    +(temOrcamento?'<span><span style="display:inline-block;width:9px;height:9px;background:#FCEBEB;border-radius:1px;vertical-align:middle;margin-right:2px"></span>Acima or\u00e7ado</span> ':'')
    +'<span><span style="display:inline-block;width:9px;height:9px;background:#f5f5f5;border:1px solid #ddd;border-radius:1px;vertical-align:middle;margin-right:2px"></span>Sem cota\u00e7\u00e3o</span>';

  // ── TABELA SCORE ───────────────────────────────────────────────────────────
  var tblEcoTh = temOrcamento ? '<th style="padding:5px 7px;text-align:right;white-space:nowrap">Economia gerada</th>' : '';
  var tblRows = fnStats.map(function(s,i){
    var rank = i+1;
    var bg = i%2===0?'#fff':'#f7f9fc';
    var sit, sitC, sitB;
    if(s.itemsWon.length>=Math.max(1,Math.ceil(n/2))){ sit='Vencedor'; sitC='#3B6D11'; sitB='#EAF3DE'; }
    else if(s.itemsWon.length>0){ sit='Competitivo'; sitC='#185FA5'; sitB='#E6F1FB'; }
    else if(s.itemsQuoted.length>0){ sit='Fora'; sitC='#888'; sitB='#f0f0f0'; }
    else { sit='Sem cota\u00e7\u00e3o'; sitC='#bbb'; sitB='#f5f5f5'; }
    var scoreW = Math.round(s.score/100*50);
    var scoreCol = s.score>=70?'#3B6D11':s.score>=40?'#b06000':'#c0392b';
    var row = '<tr style="background:'+bg+';">'
      +'<td style="padding:5px 7px;text-align:center;font-weight:bold;color:'+(rank<=3?hC:'#ccc')+'">'+rank+'\u00b0</td>'
      +'<td style="padding:5px 7px;font-weight:'+(rank===1?'bold':'normal')+'"><div style="display:flex;align-items:center;gap:5px;"><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:'+BAR_COLORS[i%BAR_COLORS.length]+';flex-shrink:0;"></span>'+esc((s.f.nome||'\u2014').toUpperCase())+'</div></td>'
      +'<td style="padding:5px 7px;text-align:center;font-size:9px;white-space:nowrap;">'+s.itemsQuoted.length+'/'+n+' ('+fmtPct(s.itemsQuoted.length,n)+')<div style="background:#e0e0e0;border-radius:2px;height:3px;margin-top:2px;overflow:hidden;"><div style="width:'+fmtPct(s.itemsQuoted.length,n)+';height:100%;background:'+BAR_COLORS[i%BAR_COLORS.length]+';border-radius:2px;"></div></div></td>'
      +'<td style="padding:5px 7px;text-align:center;"><span style="background:'+sitB+';color:'+sitC+';padding:1px 7px;border-radius:99px;font-size:8px;font-weight:bold">'+s.itemsWon.length+' item(ns)</span></td>'
      +(temOrcamento?'<td style="padding:5px 7px;text-align:right;color:'+(s.ecoGen>0?'#3B6D11':'#bbb')+';font-weight:'+(s.ecoGen>0?'bold':'normal')+';font-size:9px;">'+(s.ecoGen>0?'\u2193 '+fmtR(s.ecoGen):'\u2014')+'</td>':'')
      +'<td style="padding:5px 7px;text-align:center;"><div style="display:flex;align-items:center;gap:4px;justify-content:center;"><div style="background:#e0e0e0;border-radius:2px;height:6px;width:50px;overflow:hidden;"><div style="width:'+scoreW+'px;height:100%;background:'+scoreCol+';border-radius:2px;"></div></div><span style="font-size:9px;font-weight:bold;color:'+scoreCol+'">'+s.score+'</span></div></td>'
      +'<td style="padding:5px 7px;text-align:center;"><span style="background:'+sitB+';color:'+sitC+';padding:1px 7px;border-radius:99px;font-size:8px;">'+sit+'</span></td>'
      +'</tr>';
    return row;
  }).join('');

  // ── RESUMO ────────────────────────────────────────────────────────────────
  var destaque = (function(){
    var top=fnStats[0];
    if(!top||top.itemsWon.length===0) return 'Nenhum fornecedor venceu itens.';
    var empate=fnStats.filter(function(s){ return s.itemsWon.length===top.itemsWon.length; });
    if(empate.length>1) return 'Empate t\u00e9cnico: '+empate.length+' fornecedores venceram '+top.itemsWon.length+' item(ns) cada. Avalie a cobertura antes de decidir.';
    var cobPct=Math.round(top.itemsQuoted.length/n*100);
    var aviso=cobPct<70?' (ATEN\u00c7\u00c3O: cobre apenas '+top.itemsQuoted.length+'/'+n+' itens)':' (cobertura: '+top.itemsQuoted.length+'/'+n+' itens)';
    return (temOrcamento?'Fornecedor destaque: ':'Menor pre\u00e7o: ')+esc((top.f.nome||'').toUpperCase())+' \u2014 '+top.itemsWon.length+' item(ns)'+aviso+'.';
  })();
  var resumoBg = temOrcamento ? '#EAF3DE' : '#E6F1FB';
  var resumoBr = temOrcamento ? '3px solid #3B6D11' : '3px solid #185FA5';
  var resumoTxt = temOrcamento ? '#27500A' : '#0C447C';
  var resumoBody = temOrcamento
    ? 'Economia l\u00edquida de <strong>'+fmtR(totalEco-totalEstouro)+'</strong> ('+fmtPct(totalEco-totalEstouro,totalOrcado)+' do or\u00e7ado). '+ctEco+' item(ns) abaixo do or\u00e7ado \u00b7 '+ctEstouro+' acima. '+destaque
    : 'Mapa sem or\u00e7amento de refer\u00eancia. Melhor cota\u00e7\u00e3o total: <strong>'+fmtR(totalMelhor)+'</strong>. '+destaque;

  // ── MONTAGEM FINAL ─────────────────────────────────────────────────────────
  return '<div style="font-family:Arial,sans-serif;font-size:11px;color:#1a1a1a;padding:12px;">'
    // Header
    +'<div style="background:'+hC+';color:#fff;padding:10px 14px;border-radius:4px 4px 0 0;margin-bottom:12px;">'
      +'<div style="font-size:14px;font-weight:bold">DASHBOARD GLOBAL \u2014 AVALIA\u00c7\u00c3O POR FORNECEDOR</div>'
      +'<div style="font-size:10px;opacity:.85;margin-top:2px">'+(mapa.obra||'SEM OBRA').toUpperCase()+' &nbsp;|\u00a0 MP N\u00ba '+(mapa.numero||'\u2014')+' &nbsp;|\u00a0 CRIADO EM '+fmtDate(dataCriacaoValidaDash)+' '+fmtHora(dataCriacaoValidaDash)+' &nbsp;|\u00a0 IMPRESSO EM '+fmtDate(now)+' '+fmtHora(now)+' &nbsp;|\u00a0 '+itens.length+' ITENS &nbsp;|\u00a0 '+fns.length+' FORNECEDORES'+(temOrcamento?' \u2714 Com or\u00e7amento base':'')+'</div>'
    +'</div>'
    // KPIs
    +'<div style="display:grid;grid-template-columns:repeat('+kpiCols+',1fr);gap:7px;margin-bottom:12px;">'+kpi+'</div>'
    // Donut + Economia por item
    +'<div style="display:grid;grid-template-columns:200px 1fr;gap:10px;margin-bottom:12px;">'
      +'<div style="background:#f9f9f9;border:1px solid #e0e0e0;border-radius:6px;padding:10px;">'
        +'<div style="font-size:9px;font-weight:bold;color:#888;text-transform:uppercase;letter-spacing:.4px;margin-bottom:8px">Distribui\u00e7\u00e3o \u2014 itens ganhos</div>'
        +donutHTML
      +'</div>'
      +'<div style="background:#f9f9f9;border:1px solid #e0e0e0;border-radius:6px;padding:10px;">'
        +'<div style="font-size:9px;font-weight:bold;color:#888;text-transform:uppercase;letter-spacing:.4px;margin-bottom:8px">'+(temOrcamento?'Economia gerada por item (R$) \u2014 colorido pelo vencedor':'Menor pre\u00e7o por item (R$) \u2014 colorido pelo vencedor')+'</div>'
        +ecoByItem
      +'</div>'
    +'</div>'
    // Heatmap
    +'<div style="background:#f9f9f9;border:1px solid #e0e0e0;border-radius:6px;padding:10px;margin-bottom:12px;overflow-x:auto;">'
      +'<div style="font-size:9px;font-weight:bold;color:#888;text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px">Mapa de calor \u2014 desempenho por fornecedor \u00d7 item</div>'
      +'<div style="display:flex;gap:10px;flex-wrap:wrap;font-size:8px;color:#555;margin-bottom:8px">'+hmLegenda+'</div>'
      +'<div style="'+hmGrid+'">'+hmHeader+hmBody+'</div>'
    +'</div>'
    // Comparativo totais
    +'<div style="background:#f9f9f9;border:1px solid #e0e0e0;border-radius:6px;padding:10px;margin-bottom:12px;">'
      +'<div style="font-size:9px;font-weight:bold;color:#888;text-transform:uppercase;letter-spacing:.4px;margin-bottom:8px">Comparativo de totais por fornecedor vs melhor cota\u00e7\u00e3o ('+fmtR(totalMelhor)+')</div>'
      +barChart
    +'</div>'
    // Score table
    +'<div style="font-size:9px;font-weight:bold;color:#888;text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px">Score global por fornecedor</div>'
    +'<table style="width:100%;border-collapse:collapse;font-size:10px;">'
      +'<thead><tr style="background:'+hC+';color:#fff;">'
        +'<th style="padding:5px 7px;width:22px">#</th>'
        +'<th style="padding:5px 7px;text-align:left">Fornecedor</th>'
        +'<th style="padding:5px 7px;text-align:center;white-space:nowrap">Cobertura</th>'
        +'<th style="padding:5px 7px;text-align:center;white-space:nowrap">Itens ganhos</th>'
        +tblEcoTh
        +'<th style="padding:5px 7px;text-align:center">Score</th>'
        +'<th style="padding:5px 7px;text-align:center">Situa\u00e7\u00e3o</th>'
      +'</tr></thead>'
      +'<tbody>'+tblRows+'</tbody>'
    +'</table>'
    // Resumo
    +'<div style="background:'+resumoBg+';border-left:'+resumoBr+';padding:8px 12px;margin-top:10px;border-radius:0 4px 4px 0;font-size:10px;color:'+resumoTxt+';line-height:1.6">'
      +'<strong>Resumo executivo:</strong> '+resumoBody
    +'</div>'
    +'</div>';
};



var abrirPDF = function abrirPDF(html) {
  var win = window.open("", "_blank");
  if (!win) {
    alert("PERMITA POPUPS PARA GERAR O PDF.");
    return;
  }
  win.document.write(html);
  win.document.close();
  setTimeout(function () {
    try {
      win.focus();
      win.print();
    } catch (_) {}
  }, 800);
};

// ─── Report PDFs ──────────────────────────────────────────────────────────────
var gerarRelatorioPeriodo = function gerarRelatorioPeriodo(mapas, inicio, fim, orcamentos, associacoes) {
  // FIX: esc() local para evitar XSS/quebra de layout com nomes contendo < > & "
  function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  var de = new Date(inicio + "T00:00:00"),
    ate = new Date(fim + "T23:59:59");
  var filtrados = mapas.filter(function (m) {
    var d = new Date(m.criadoEm);
    return d >= de && d <= ate;
  });
  if (!filtrados.length) {
    alert("NENHUM MAPA NO PERÍODO.");
    return;
  }
  var rows = filtrados.map(function (m, i) {
    var _m$itens;
    var bg = i % 2 === 0 ? "#fff" : "#f5f7fc";
    var rt = (m.itens || []).reduce(function (a, item) {
      var r = calcResumo(item, m.fornecedores || [], m.precos || {});
      return a + (r.vlTotal || 0);
    }, 0);
    return "<tr style=\"background:".concat(bg, ";\"><td style=\"border:1px solid #ddd;padding:5px 7px;text-align:center;\">").concat(m.numero || "—", "</td><td style=\"border:1px solid #ddd;padding:5px 7px;\">").concat(esc((m.nome || "").toUpperCase()), "</td><td style=\"border:1px solid #ddd;padding:5px 7px;\">").concat(esc((m.obra || "—").toUpperCase()), "</td><td style=\"border:1px solid #ddd;padding:5px 7px;\">").concat(esc((m.responsavel || "—").toUpperCase()), "</td><td style=\"border:1px solid #ddd;padding:5px 7px;text-align:center;\">").concat(fmtDate(new Date(m.criadoEm)), "</td><td style=\"border:1px solid #ddd;padding:5px 7px;text-align:center;\">").concat(((_m$itens = m.itens) === null || _m$itens === void 0 ? void 0 : _m$itens.length) || 0, "</td><td style=\"border:1px solid #ddd;padding:5px 7px;text-align:right;font-weight:bold;\">").concat(rt > 0 ? fmtMoney(rt) : "—", "</td></tr>");
  }).join("");
  abrirPDF("<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><style>@page{size:A4 landscape;margin:10mm;}body{font-family:Arial,sans-serif;font-size:11px;text-transform:uppercase;}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}</style></head><body><div style=\"background:#2a5298;padding:10px 14px;border-radius:4px 4px 0 0;\"><div style=\"font-size:14px;font-weight:bold;color:#fff;\">RELAT\xD3RIO DE MAPAS POR PER\xCDODO</div><div style=\"font-size:10px;color:rgba(255,255,255,0.85);margin-top:2px;\">PER\xCDODO: ".concat(fmtDate(de), " A ").concat(fmtDate(ate), " \u2014 ").concat(filtrados.length, " MAPA(S)</div></div><table style=\"border-collapse:collapse;width:100%;font-size:11px;\"><thead><tr style=\"background:#c5d8f0;\"><th style=\"border:1px solid #999;padding:5px 7px;width:46px;\">MP N\xBA</th><th style=\"border:1px solid #999;padding:5px 7px;text-align:left;\">NOME</th><th style=\"border:1px solid #999;padding:5px 7px;text-align:left;\">OBRA</th><th style=\"border:1px solid #999;padding:5px 7px;text-align:left;\">RESPONS\xC1VEL</th><th style=\"border:1px solid #999;padding:5px 7px;width:80px;\">DATA</th><th style=\"border:1px solid #999;padding:5px 7px;width:55px;\">ITENS</th><th style=\"border:1px solid #999;padding:5px 7px;width:100px;text-align:right;\">TOTAL RESUMO</th></tr></thead><tbody>").concat(rows, "</tbody></table></body></html>"));
};
var gerarRelatorioObra = function gerarRelatorioObra(mapasComCurrent, obra, orcamentos, associacoes) {
  var filtrados = mapasComCurrent.filter(function (m) {
    return (m.obra || "").toUpperCase().includes(obra.toUpperCase());
  });
  if (!filtrados.length) {
    alert("NENHUM MAPA ENCONTRADO.");
    return;
  }
  var now = new Date();
  abrirPDF("<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><style>@page{size:A4 landscape;margin:8mm;}body{font-family:Arial,sans-serif;font-size:11px;text-transform:uppercase;}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}</style></head><body>".concat(filtrados.map(function (m, i) {
    var body = buildMapaHTML(m, now, orcamentos, associacoes).replace(/[\s\S]*<body>/, "").replace(/<\/body>[\s\S]*/, "");
    return "<div style=\"".concat(i > 0 ? "page-break-before:always;" : "", "\">").concat(body, "</div>");
  }).join(""), "</body></html>"));
};
var gerarRelatorioInsumo = function gerarRelatorioInsumo(mapasComCurrent, insumo) {
  // FIX: esc() local para evitar XSS/quebra de layout com nomes/descrições contendo < > & "
  function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  var resultados = [];
  mapasComCurrent.forEach(function (mapa) {
    (mapa.itens || []).forEach(function (item) {
      if ((item.descricao || "").toUpperCase().includes(insumo.toUpperCase()))
        resultados.push({ mapa: mapa, item: item });
    });
  });
  if (!resultados.length) { alert("NENHUM INSUMO ENCONTRADO."); return; }

  // Collect all unique supplier names across all results (max 12)
  var allForns = Array.from(new Set(
    resultados.flatMap(function(r) {
      return (r.mapa.fornecedores || [])
        .map(function(f){ return (f.nome||"").toUpperCase(); })
        .filter(Boolean);
    })
  )).slice(0, 12);

  // --- CSS ---
  var css = [
    "@page{size:A4 landscape;margin:4mm;}",
    "body{font-family:Arial,sans-serif;font-size:10px;text-transform:uppercase;margin:0;}",
    "@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}",
    "table{border-collapse:collapse;width:100%;table-layout:fixed;}",
    "th,td{border:1px solid #bbb;padding:3px 4px;overflow:hidden;word-break:break-word;line-height:1.2;}",
    "th{background:#2a5298;color:#fff;text-align:center;font-size:9px;line-height:1.3;vertical-align:bottom;}",
    "th.menor-h{background:#7b5e00;}",
    "td.num{text-align:right;}",
    "td.menor-cell{background:#fff8dc;text-align:center;border:2px solid #b8860b !important;}",
    "td.menor-val{font-weight:bold;color:#7b5e00;font-size:11px;}",
    "td.menor-forn{font-size:8px;color:#555;line-height:1.3;margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}",
    "td.winner{background:#c8ecd2;font-weight:bold;text-align:right;}",
    "tr.even td{background:#f5f7fc;}",
    "tr.even td.menor-cell{background:#fff3c0;}",
    "tr.even td.winner{background:#b8e6c4;}"
  ].join("");

  // --- Header row ---
  var fornHdrs = allForns.map(function(f) {
    return "<th style=\"width:65px;\">" + esc(f) + "</th>";
  }).join("");

  // --- Data rows ---
  var rows = resultados.map(function(r2, i) {
    var mapa = r2.mapa, item = r2.item;
    var rowCls = i % 2 === 1 ? " class=\"even\"" : "";
    var resumo = calcResumo(item, mapa.fornecedores || [], mapa.precos || {});
    var menorForn = (resumo.forn || "").toUpperCase();

    var fornCells = allForns.map(function(fname) {
      var f = (mapa.fornecedores || []).find(function(x){
        return (x.nome||"").toUpperCase() === fname;
      });
      if (!f) return "<td style=\"text-align:center;color:#ccc;width:65px;\">\u2014</td>";
      var v = parseMoney((mapa.precos||{})[""+item.id+"_"+f.id]);
      var isMin = resumo.vlUnit !== null && v !== null && v > 0 && v === resumo.vlUnit;
      return "<td class=\"" + (isMin ? "winner" : "num") + "\" style=\"width:65px;\">"
           + (v !== null && v > 0 ? fmtMoney(v) : "<span style=\"color:#ccc;\">\u2014</span>")
           + "</td>";
    }).join("");

    return "<tr" + rowCls + ">"
      + "<td style=\"text-align:center;width:28px;\">"  + esc(mapa.numero||"\u2014") + "</td>"
      + "<td style=\"width:95px;font-size:9px;line-height:1.3;\">" + esc((mapa.obra||"\u2014").toUpperCase()) + "</td>"
      + "<td style=\"text-align:center;width:58px;\">" + fmtDate(new Date(mapa.criadoEm)) + "</td>"
      + "<td style=\"font-size:9px;line-height:1.4;min-width:130px;\">" + esc((item.descricao||"").toUpperCase()) + "</td>"
      + "<td class=\"num\" style=\"width:34px;\">" + (item.qt||"") + "</td>"
      + "<td style=\"text-align:center;width:28px;\">" + (item.unid||"") + "</td>"
      + "<td class=\"menor-cell\" style=\"width:80px;\">"
        + "<div class=\"menor-val\">" + (resumo.vlUnit !== null ? fmtMoney(resumo.vlUnit) : "\u2014") + "</div>"
        + (menorForn ? "<div class=\"menor-forn\">" + esc(menorForn) + "</div>" : "")
      + "</td>"
      + fornCells
      + "</tr>";
  }).join("");

  // --- Build HTML ---
  var html = "<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><style>" + css + "</style></head><body>"
    + "<div style=\"background:#1a3a5c;padding:9px 14px;border-radius:4px 4px 0 0;margin-bottom:0;\">"
    + "<div style=\"font-size:13px;font-weight:bold;color:#fff;\">RELAT\xD3RIO POR INSUMO</div>"
    + "<div style=\"font-size:10px;color:rgba(255,255,255,0.8);margin-top:2px;\">BUSCA: &ldquo;"
    + esc(insumo.toUpperCase()) + "&rdquo; \u2014 " + resultados.length + " OCORR\xCANCIA(S)</div>"
    + "</div>"
    + "<table><thead><tr>"
    + "<th style=\"width:28px;\">MP<br>N\xBA</th>"
    + "<th style=\"width:95px;text-align:left;\">OBRA</th>"
    + "<th style=\"width:58px;\">DATA</th>"
    + "<th style=\"text-align:left;min-width:130px;\">DESCRI\xC7\xC3O</th>"
    + "<th style=\"width:34px;\">QT</th>"
    + "<th style=\"width:28px;\">UN</th>"
    + "<th class=\"menor-h\" style=\"width:80px;\">MENOR<br><span style=\"font-size:8px;font-weight:400;opacity:.85;\">FORNECEDOR</span></th>"
    + fornHdrs
    + "</tr></thead><tbody>" + rows + "</tbody></table></body></html>";

  abrirPDF(html);
};
// ─── AutocompleteInput ────────────────────────────────────────────────────────
