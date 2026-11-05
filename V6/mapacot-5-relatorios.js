
// ─── AUDITORIA DE ATENDIMENTOS (PROTÓTIPO DE ESTUDO — não publicado) ──────────────────────────
// Só LÊ: mapas já em memória + pedidos já lidos pela janela de relatórios. Não grava nada.
// Reaproveita as contas que já existem: calcResumo (menor preço do Resumo), a mesma regra do selo
// PEDIDO/ALMOX/FALTA (pedidos não cancelados, 1ª linha do item por pedido; retiradas não estornadas).
function audEsc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
function audCent(n) { return Math.round((Number(n) || 0) * 100) / 100; }
function audDkPedido(po) {
  var raw = (po && (po.data_emissao || po.criado_em)) || "";
  if (!raw) return "";
  if (String(raw).length === 10) return String(raw);
  return almoxDataLocalKey(raw);
}
function audDkFmt(dk) { return dk ? dk.slice(8, 10) + "/" + dk.slice(5, 7) + "/" + dk.slice(0, 4) : "—"; }
function audSinal(n, casas) {
  var v = audCent(n);
  if (v === 0) return fmtMoney(0);
  return (v > 0 ? "+ " : "− ") + fmtMoney(Math.abs(v));
}
// f = { inicio, fim, base: "atendimento" | "criacao", obra, mapaNum, insumo, fornecedores: [nomes], fornecedor: "texto ainda digitado",
//       situ: ["igual","caro","abaixo","almox","nao","semcomp"] (o que o usuário MARCOU em MOSTRAR; sem a propriedade = tudo) }
function coletarAuditoria(mapas, pedidosLista, f) {
  f = f || {};
  var obraF = (f.obra || "").trim().toUpperCase();
  var insF = (f.insumo || "").trim().toUpperCase();
  var numF = String(f.mapaNum == null ? "" : f.mapaNum).trim();
  // fornecedores escolhidos (vários) + o que ainda está digitado; vazio = todos os fornecedores com pedido
  var termosForn = [].concat(Array.isArray(f.fornecedores) ? f.fornecedores : [], [f.fornecedor || ""]).map(normalizeBusca).filter(Boolean);
  var fornF = termosForn.length > 0;
  var fornOk = function (po) {
    if (!fornF) return true;
    var nf = normalizeBusca(po && po.fornecedor_nome);
    return termosForn.some(function (t) { return nf.indexOf(t) !== -1; });
  };
  // situações marcadas em MOSTRAR (sem a propriedade = tudo; lista vazia = nada)
  var situSet = Array.isArray(f.situ) ? f.situ : null;
  var situOk = function (k) { return !situSet || situSet.indexOf(k) !== -1; };
  var chaveSitu = function (mv) { return mv.tipo === "almox" ? "almox" : (mv.classe === "semPreco" || mv.classe === "semResumo" ? "semcomp" : mv.classe); };
  var porCriacao = f.base === "criacao";
  var temPeriodo = !!(f.inicio || f.fim);
  var pedidos = (pedidosLista || []).filter(function (po) { return po && po.status !== "cancelado"; });
  // índice item_id -> pedidos que o citam (só a 1ª linha do item em cada pedido, igual ao selo)
  var idx = Object.create(null);
  pedidos.forEach(function (po) {
    var visto = Object.create(null);
    (po.itens || []).forEach(function (l) {
      if (!l || l.item_id === undefined || l.item_id === null || visto[l.item_id]) return;
      visto[l.item_id] = true;
      (idx[l.item_id] = idx[l.item_id] || []).push({ po: po, l: l, ok: fornOk(po) });
    });
  });
  var conhecidos = Object.create(null);
  (mapas || []).forEach(function (m) { ((m && m.itens) || []).forEach(function (it) { conhecidos[it.id] = true; }); });
  var itens = [];
  (mapas || []).forEach(function (m) {
    if (!m) return;
    if (obraF && (m.obra || "").toUpperCase().indexOf(obraF) === -1) return;
    if (numF && String(m.numero) !== numF) return;
    var dkCriacao = almoxDataLocalKey(m.criadoEm);
    if (porCriacao) {
      if (f.inicio && (!dkCriacao || dkCriacao < f.inicio)) return;
      if (f.fim && (!dkCriacao || dkCriacao > f.fim)) return;
    }
    ((m.itens || [])).forEach(function (it) {
      if (!it) return;
      var txt = ((it.descricao || "") + " " + (it.detalhe || "")).toUpperCase();
      if (insF && txt.indexOf(insF) === -1) return;
      var qtTotal = parseNumBR(it.qt) || 0;
      var res = calcResumo(it, m.fornecedores || [], m.precos || {});
      var movs = [];
      var qtPedida = 0, qtAlmox = 0;
      (idx[it.id] || []).forEach(function (x) {
        var qt = Number(x.l.qt_pedida) || 0;
        qtPedida += qt; // a quantidade do selo (PEDIDO/FALTA) é sempre a real, com ou sem filtro de fornecedor
        if (!x.ok) return; // pedido de outro fornecedor: conta no selo, mas a linha não aparece
        var vu = Number(x.l.vl_unit);
        var vt = x.l.vl_total !== undefined && x.l.vl_total !== null && x.l.vl_total !== "" ? Number(x.l.vl_total) : vu * qt;
        var mv = { tipo: "pedido", dk: audDkPedido(x.po), numero: x.po.numero, status: x.po.status || "", qt: qt,
          vlUnit: isNaN(vu) ? 0 : vu, vlTotal: isNaN(vt) ? 0 : audCent(vt), forn: x.po.fornecedor_nome || "", obs: x.po.observacao || "",
          classe: "", difUnit: null, difTot: null, difPct: null, baseTot: null };
        if (!(mv.vlUnit > 0)) mv.classe = "semPreco";
        else if (res.vlUnit === null || res.vlUnit === undefined) mv.classe = "semResumo";
        else {
          mv.baseTot = audCent(res.vlUnit * qt); // tudo em centavos por linha: o que aparece na tela fecha com os totais
          mv.difUnit = audCent(mv.vlUnit - res.vlUnit);
          mv.difTot = audCent(mv.vlTotal - mv.baseTot);
          mv.difPct = mv.baseTot > 0 ? (mv.difTot / mv.baseTot) * 100 : null;
          mv.classe = mv.difUnit > 0 ? "caro" : (mv.difUnit < 0 ? "abaixo" : "igual");
        }
        movs.push(mv);
      });
      ((m.almox || {})[it.id] || []).forEach(function (r) {
        if (!r || r.estornado) return;
        var qt = Number(r.qt) || 0;
        qtAlmox += qt;
        if (fornF) return; // com fornecedor escolhido não se mostra almoxarifado
        movs.push({ tipo: "almox", dk: almoxDataLocalKey(r.data), qt: qt, por: r.por || "", obs: r.obs || "", classe: "almox" });
      });
      qtAlmox = Math.round(qtAlmox * 1000) / 1000;
      movs.sort(function (a, b) {
        if (a.dk !== b.dk) return (a.dk || "9") < (b.dk || "9") ? -1 : 1;
        if (a.tipo !== b.tipo) return a.tipo === "pedido" ? -1 : 1;
        return (a.numero || 0) - (b.numero || 0);
      });
      if (fornF && !movs.length) return; // filtro de fornecedor: só entra item que tem linha de pedido dele
      if (it.excluido && !movs.length) return; // riscado sem movimento some; riscado COM compra continua (o gasto não pode sumir)
      if (!porCriacao && temPeriodo) {
        var dentro = movs.some(function (mv) { return mv.dk && (!f.inicio || mv.dk >= f.inicio) && (!f.fim || mv.dk <= f.fim); });
        if (!dentro) return;
      }
      // MOSTRAR: só ficam as linhas das situações marcadas; item sem movimento = "não comprado"
      var mostradas = movs.filter(function (mv) { return situOk(chaveSitu(mv)); });
      if (movs.length ? !mostradas.length : !situOk("nao")) return;
      movs = mostradas;
      itens.push({ obra: m.obra || "", mapaNum: m.numero, mapaId: m.id, itemNum: it.num, itemId: it.id, descricao: it.descricao || "", detalhe: it.detalhe || "",
        unid: it.unid || "", riscado: !!it.excluido, qtTotal: qtTotal, qtPedida: qtPedida, qtAlmox: qtAlmox,
        falta: Math.max(0, Math.round((qtTotal - qtPedida - qtAlmox) * 1000) / 1000), criacaoDk: dkCriacao,
        resumo: { vlUnit: res.vlUnit, vlTotal: res.vlTotal, forn: res.forn || "", detalhe: res.minFornId ? ((m.detalhes || {})[it.id + "_" + res.minFornId] || "") : "" },
        movs: movs });
    });
  });
  itens.sort(function (a, b) {
    if (a.obra !== b.obra) return a.obra < b.obra ? -1 : 1;
    if ((a.mapaNum || 0) !== (b.mapaNum || 0)) return (a.mapaNum || 0) - (b.mapaNum || 0);
    return (Number(a.itemNum) || 0) - (Number(b.itemNum) || 0);
  });
  // fechamento
  var tot = { baseTot: 0, pedTot: 0, dif: 0, linhas: { igual: 0, caro: 0, abaixo: 0, semResumo: 0, semPreco: 0 }, difCaro: 0, difAbaixo: 0, naoComprados: 0, naoCompradosVal: 0, almoxRegs: 0, caros: [] };
  itens.forEach(function (it) {
    var tinhaMov = false;
    it.movs.forEach(function (mv) {
      tinhaMov = true;
      if (mv.tipo === "almox") { tot.almoxRegs++; return; }
      tot.linhas[mv.classe]++;
      if (mv.classe === "igual" || mv.classe === "caro" || mv.classe === "abaixo") {
        tot.baseTot += mv.baseTot; tot.pedTot += mv.vlTotal; tot.dif += mv.difTot;
        if (mv.classe === "caro") { tot.difCaro += mv.difTot; tot.caros.push({ mapaNum: it.mapaNum, descricao: it.descricao, numero: mv.numero, difTot: mv.difTot, difPct: mv.difPct }); }
        if (mv.classe === "abaixo") tot.difAbaixo += mv.difTot;
      }
    });
    if (!tinhaMov) { tot.naoComprados++; tot.naoCompradosVal += it.resumo.vlTotal || 0; }
  });
  ["baseTot", "pedTot", "dif", "difCaro", "difAbaixo", "naoCompradosVal"].forEach(function (k) { tot[k] = audCent(tot[k]); });
  tot.caros.sort(function (a, b) { return b.difTot - a.difTot; });
  // avisos: pedidos (não cancelados) que citam itens que não existem em nenhum mapa lido
  var orfaos = [];
  pedidos.forEach(function (po) {
    if (!fornOk(po)) return;
    var algum = (po.itens || []).some(function (l) { return l && l.item_id !== undefined && l.item_id !== null && !conhecidos[l.item_id]; });
    if (algum) orfaos.push(po.numero);
  });
  return { itens: itens, tot: tot, orfaos: orfaos, limite: (pedidosLista || []).length >= 1000 };
}
function gerarRelatorioAuditoria(res, f) {
  f = f || {};
  var esc = audEsc;
  var base = f.base === "criacao" ? "data de criação do mapa" : "data do atendimento";
  var periodoTxt = (f.inicio || f.fim) ? ((f.inicio ? almoxFmtData(f.inicio + "T12:00:00") : "início") + " a " + (f.fim ? almoxFmtData(f.fim + "T12:00:00") : "hoje") + " (" + base + ")") : "todo o período";
  var SITU_ROT = { igual: "No menor preço", caro: "Mais caro", abaixo: "Abaixo do Resumo (mais barato)", almox: "Só almox", nao: "Não comprado", semcomp: "Sem comparação" };
  var SITU_ORDEM = ["igual", "caro", "abaixo", "almox", "nao", "semcomp"];
  var marcada = function (k) { return !Array.isArray(f.situ) || f.situ.indexOf(k) !== -1; };
  var mostrarTxt = SITU_ORDEM.filter(marcada).map(function (k) { return SITU_ROT[k]; }).join(", ") || "nenhuma";
  var termosTxt = [].concat(Array.isArray(f.fornecedores) ? f.fornecedores : [], [f.fornecedor || ""]).map(function (x) { return String(x).trim().toUpperCase(); }).filter(Boolean);
  var fornTxt = termosTxt.join(" · ");
  var meta = "Período: " + periodoTxt + " · Obra: " + esc(f.obra && f.obra.trim() ? f.obra.trim().toUpperCase() : "todas") +
    " · Mapa: " + esc(f.mapaNum && String(f.mapaNum).trim() ? String(f.mapaNum).trim() : "todos") +
    " · Insumo: " + esc(f.insumo && f.insumo.trim() ? f.insumo.trim().toUpperCase() : "todos") +
    " · Fornecedor do pedido: " + esc(fornTxt || "todos") +
    " · Situações marcadas: " + esc(mostrarTxt) + " · Valores em R$ · Diferença = Pedido − Resumo · Gerado em " + new Date().toLocaleString("pt-BR");
  var css = "<style>@page{size:A4 landscape;margin:8mm}*{box-sizing:border-box}body{font-family:Arial,Helvetica,sans-serif;font-size:9px;color:#1b2333;margin:0;text-transform:uppercase}" +
    "h1{font-size:14px;color:#0f1f3d;margin:0 0 3px}.meta{color:#555;font-size:9px;margin-bottom:8px;text-transform:none}" +
    ".ob{background:#2a5298;color:#fff;padding:5px 8px;font-weight:700;font-size:10px;margin-top:10px;-webkit-print-color-adjust:exact;print-color-adjust:exact}" +
    "table{border-collapse:collapse;width:100%;table-layout:fixed;font-size:8.5px;-webkit-print-color-adjust:exact;print-color-adjust:exact}thead{display:table-header-group}tbody{page-break-inside:avoid}" +
    "th,td{border:1px solid #c9d1e3;padding:3px 4px;vertical-align:top;line-height:1.28;overflow-wrap:anywhere}th{background:#e3e9f6;font-size:8px;text-align:center;vertical-align:bottom}" +
    "th.g{color:#fff;font-size:8.5px;vertical-align:middle;letter-spacing:.04em}.g1{background:#2a5298}.g2{background:#7b5e00}.g3{background:#1a3a5c}.g4{background:#3d4350}" +
    ".n{text-align:right}.c{text-align:center}.dt{text-align:center;white-space:nowrap}.res{background:#fff8dc}.ped{background:#eef4ff}" +
    ".det{display:block;font-size:7.5px;color:#7b5e00;font-style:italic;text-transform:none;margin-top:1px}.detf{display:block;border-top:1px dotted #c0cce0;margin-top:2px;padding-top:2px;text-align:left;font-size:7.5px;line-height:1.28;color:#4a6888;font-style:normal;font-weight:400;text-transform:none}.obs{display:block;font-size:7.5px;color:#5a6579;font-style:italic;text-transform:none;margin-top:1px}" +
    ".l{display:block;font-weight:700;font-size:7.5px;white-space:nowrap}.lp{color:#186818}.la{color:#1a4aa0}.lf{color:#b34700}" +
    ".alm{background:#e1ecff;color:#1a4aa0;font-weight:700;text-align:center;vertical-align:middle}.sem{background:#ffeed9;color:#b34700;font-weight:700;text-align:center;vertical-align:middle}" +
    ".dif{text-align:center;vertical-align:middle}.dif b{display:block;font-size:9px}.dif i{display:block;font-style:normal;font-size:8px}" +
    ".d-caro{background:#fbe3e0;color:#a3231a}.d-abaixo{background:#dff1e3;color:#186818}.d-igual{background:#eef0f5;color:#3d4350}.d-almox{background:#e1ecff;color:#1a4aa0}.d-nao,.d-semResumo,.d-semPreco{background:#ffeed9;color:#b34700}" +
    ".chip{display:inline-block;font-size:7px;font-weight:800;padding:1px 5px;border-radius:8px;margin-top:2px;border:1px solid currentColor;white-space:nowrap}.rasc{display:block;width:max-content;font-size:6px;font-weight:800;color:#b34700;border:1px solid #b34700;border-radius:6px;padding:0 2px;margin:2px auto 0}" +
    ".av{background:#fff8ec;border:1px solid #f0dba0;color:#6b4a00;padding:6px 8px;margin:6px 0;font-size:9px;text-transform:none}.rod{margin-top:8px;color:#5a6579;font-size:8px;text-transform:none}" +
    ".fech{page-break-before:always}.tiles{display:flex;gap:8px;margin:8px 0}.tile{flex:1;border:1px solid #c9d1e3;padding:8px 10px;border-radius:5px}.tile .k{font-size:8px;font-weight:700;color:#5a6579}.tile .v{font-size:16px;font-weight:700}.tile.bad{background:#fbe3e0;border-color:#a3231a;color:#a3231a}.tile.ok{background:#dff1e3;border-color:#186818;color:#186818}" +
    ".mini{width:auto;min-width:300px;margin:4px 0 10px}.mini td,.mini th{text-align:left}.mini .n{text-align:right}" +
    // SÓ NA TELA (não afeta impressão/PDF): margem de 8px em qualquer tela (como padding, para a margem direita também aparecer quando a tela rola); largura mínima de 1024px (a tabela tem 861px de colunas fixas; abaixo disso a coluna da descrição era espremida a 1 letra por linha em tablet/janela estreita; nessa largura o navegador rola ou reduz o zoom em vez de espremer); a partir de 1200px, folha centralizada
    "@media screen{body{margin:0;padding:8px;min-width:1056px}}@media screen and (min-width:1200px){html{background:#e8ecf4;padding:18px}body{max-width:1560px;margin:0 auto;padding:20px 26px 30px;background:#fff;border:1px solid #d0d8ea;border-radius:6px;box-shadow:0 6px 22px rgba(15,31,61,.12)}}</style>";
  function dif(mv) {
    if (mv.tipo === "almox") return "<td class=\"dif d-almox\"><b>—</b><span class=\"chip\">só almox</span></td>";
    if (mv.classe === "semPreco") return "<td class=\"dif d-semPreco\"><b>—</b><span class=\"chip\">pedido sem preço</span></td>";
    if (mv.classe === "semResumo") return "<td class=\"dif d-semResumo\"><b>—</b><span class=\"chip\">sem resumo</span></td>";
    var rot = mv.classe === "caro" ? "mais caro" : (mv.classe === "abaixo" ? "abaixo do resumo" : "no menor preço");
    var pct = mv.difPct === null ? "" : (mv.difPct > 0 ? "+ " : (mv.difPct < 0 ? "− " : "")) + Math.abs(Math.round(mv.difPct * 10) / 10).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + "%";
    var linha1 = mv.classe === "igual" ? "0,00" : audSinal(mv.difUnit) + " / un";
    var linha2 = mv.classe === "igual" ? "" : audSinal(mv.difTot) + " · " + pct;
    return "<td class=\"dif d-" + mv.classe + "\"><b>" + linha1 + "</b>" + (linha2 ? "<i>" + linha2 + "</i>" : "") + "<span class=\"chip\">" + rot + "</span></td>";
  }
  var porObra = [], atual = null;
  res.itens.forEach(function (it) {
    if (!atual || atual.obra !== it.obra) { atual = { obra: it.obra, itens: [] }; porObra.push(atual); }
    atual.itens.push(it);
  });
  var head = "<thead><tr><th class=\"g g1\" colspan=\"6\">Item e atendimento</th><th class=\"g g2\" colspan=\"3\">Resumo · menor preço do mapa</th><th class=\"g g3\" colspan=\"5\">Pedido gerado</th><th class=\"g g4\">Diferença</th></tr>" +
    "<tr><th>Item</th><th>MP nº</th><th>Qtd. do mapa</th><th>Criação do mapa</th><th>Data do atendimento</th><th style=\"text-align:left\">Descrição do insumo / detalhe</th><th>Vl. unit.</th><th>Vl. total</th><th>Fornecedor ganhador</th><th>Pedido nº</th><th>Qt.</th><th>Vl. unit.</th><th>Vl. total</th><th>Fornecedor do pedido</th><th>Pedido − Resumo</th></tr></thead>";
  var colg = "<colgroup><col style=\"width:34px\"><col style=\"width:34px\"><col style=\"width:76px\"><col style=\"width:64px\"><col style=\"width:70px\"><col><col style=\"width:84px\"><col style=\"width:62px\"><col style=\"width:84px\"><col style=\"width:48px\"><col style=\"width:40px\"><col style=\"width:52px\"><col style=\"width:62px\"><col style=\"width:84px\"><col style=\"width:98px\"></colgroup>";
  var corpo = porObra.map(function (g) {
    var tbs = g.itens.map(function (it) {
      var movs = it.movs.length ? it.movs : [null];
      var n = movs.length;
      var qtLinhas = "<b>" + atendFmtQtd(it.qtTotal) + " " + esc(it.unid) + "</b>";
      if (it.qtPedida > 0) qtLinhas += "<span class=\"l lp\">PEDIDO " + atendFmtQtd(it.qtPedida) + "</span>";
      if (it.qtAlmox > 0) qtLinhas += "<span class=\"l la\">ALMOX " + atendFmtQtd(it.qtAlmox) + "</span>";
      if (it.qtTotal > 0 && it.qtPedida + it.qtAlmox >= it.qtTotal) qtLinhas += "<span class=\"l lp\">ATENDIDO</span>";
      else if (it.qtPedida > 0 || it.qtAlmox > 0) qtLinhas += "<span class=\"l lf\">FALTA " + atendFmtQtd(it.falta) + "</span>";
      else qtLinhas += "<span class=\"l lf\">FALTA " + atendFmtQtd(it.falta) + "</span>";
      if (it.qtPedida + it.qtAlmox > it.qtTotal && it.qtTotal > 0) qtLinhas += "<span class=\"l lf\">ACIMA DA QT.</span>";
      var rs = it.resumo;
      var esq = "<td class=\"c\" rowspan=\"" + n + "\">" + esc(it.itemNum) + "</td><td class=\"c\" rowspan=\"" + n + "\">" + esc(it.mapaNum) + "</td><td rowspan=\"" + n + "\">" + qtLinhas + "</td><td class=\"dt\" rowspan=\"" + n + "\">" + audDkFmt(it.criacaoDk) + "</td>";
      var desc = "<td rowspan=\"" + n + "\"><b>" + esc(it.descricao) + "</b>" + (it.riscado ? "<span class=\"chip\" style=\"color:#b34700\">item riscado no mapa</span>" : "") + (it.detalhe ? "<span class=\"det\">" + esc(it.detalhe) + "</span>" : "") + "</td>";
      var resCel = "<td class=\"n res\" rowspan=\"" + n + "\">" + (rs.vlUnit === null || rs.vlUnit === undefined ? "—" : fmtMoney(rs.vlUnit)) + (rs.detalhe ? "<span class=\"detf\">↳ " + esc(rs.detalhe) + "</span>" : "") + "</td><td class=\"n res\" rowspan=\"" + n + "\">" + (rs.vlTotal === null || rs.vlTotal === undefined ? "—" : fmtMoney(rs.vlTotal)) + "</td><td class=\"res\" rowspan=\"" + n + "\">" + esc(rs.forn || "—") + "</td>";
      var trs = movs.map(function (mv, k) {
        var ini = k === 0 ? esq : "";
        var dtCel, meio, fim;
        if (mv === null) {
          dtCel = "<td class=\"dt\">—</td>";
          meio = "<td class=\"sem\" colspan=\"5\">Nada comprado ainda · falta " + atendFmtQtd(it.falta) + " " + esc(it.unid) + "</td>";
          fim = "<td class=\"dif d-nao\"><b>—</b><span class=\"chip\">não comprado</span></td>";
        } else if (mv.tipo === "almox") {
          dtCel = "<td class=\"dt\">" + audDkFmt(mv.dk) + "</td>";
          meio = "<td class=\"alm\" colspan=\"5\">Saiu do almoxarifado · " + atendFmtQtd(mv.qt) + " " + esc(it.unid) + (mv.por ? " · retirado por " + esc(mv.por) : "") + (it.qtPedida === 0 ? " · sem compra" : "") + "</td>";
          fim = dif(mv);
        } else {
          dtCel = "<td class=\"dt\">" + audDkFmt(mv.dk) + "</td>";
          meio = "<td class=\"c ped\">" + esc(mv.numero) + (mv.status === "rascunho" ? "<span class=\"rasc\">RASCUNHO</span>" : "") + "</td><td class=\"n ped\">" + atendFmtQtd(mv.qt) + "</td><td class=\"n ped\">" + (mv.vlUnit > 0 ? fmtMoney(mv.vlUnit) : "—") + "</td><td class=\"n ped\">" + (mv.vlUnit > 0 ? fmtMoney(mv.vlTotal) : "—") + "</td><td class=\"ped\">" + esc(mv.forn) + (mv.obs ? "<span class=\"obs\">Obs. do pedido: " + esc(mv.obs) + "</span>" : "") + "</td>";
          fim = dif(mv);
        }
        return "<tr>" + ini + dtCel + (k === 0 ? desc + resCel : "") + meio + fim + "</tr>";
      }).join("");
      return "<tbody>" + trs + "</tbody>";
    }).join("");
    return "<div class=\"ob\">OBRA: " + esc(g.obra || "—") + "</div><table>" + colg + head + tbs + "</table>";
  }).join("");
  var t = res.tot;
  var avisos = "";
  if (res.limite) avisos += "<div class=\"av\">ATENÇÃO: foram lidos exatamente 1000 pedidos (limite da leitura). Pedidos mais antigos podem não ter entrado; itens podem aparecer como não comprados por esse motivo.</div>";
  if (res.orfaos.length) avisos += "<div class=\"av\">Pedidos que citam itens que não existem mais em nenhum mapa (fora da comparação): " + res.orfaos.map(esc).join(", ") + ".</div>";
  var temComp = marcada("igual") || marcada("caro") || marcada("abaixo") || marcada("semcomp");
  var difRot = t.dif > 0 ? "COMPROU A MAIS" : (t.dif < 0 ? "COMPROU A MENOS" : "NO MENOR PREÇO");
  var difPctT = t.baseTot > 0 ? (t.dif / t.baseTot) * 100 : 0;
  var difPctTxt = (difPctT > 0 ? "+ " : (difPctT < 0 ? "− " : "")) + Math.abs(Math.round(difPctT * 10) / 10).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + "%";
  var fech = "<div class=\"fech\"><h1>FECHAMENTO DA AUDITORIA" + (fornTxt ? " — FORNECEDOR" + (termosTxt.length > 1 ? "ES" : "") + ": " + esc(fornTxt) : "") + "</h1><div class=\"meta\">Mesmo período e filtros das páginas anteriores · Valores em R$" + (fornTxt ? " · Soma só os pedidos do fornecedor escolhido" : "") + " · Soma só as linhas mostradas (situações marcadas)" + "</div>" +
    (temComp ? (
    "<div class=\"tiles\"><div class=\"tile\"><div class=\"k\">TOTAL PELO RESUMO (MESMAS QUANTIDADES COMPRADAS)</div><div class=\"v\">" + fmtMoney(t.baseTot) + "</div></div>" +
    "<div class=\"tile\"><div class=\"k\">TOTAL DOS PEDIDOS</div><div class=\"v\">" + fmtMoney(t.pedTot) + "</div></div>" +
    "<div class=\"tile " + (t.dif > 0 ? "bad" : (t.dif < 0 ? "ok" : "")) + "\"><div class=\"k\">DIFERENÇA · " + difRot + "</div><div class=\"v\">" + audSinal(t.dif) + " (" + difPctTxt + ")</div></div></div>" +
    "<table class=\"mini\"><thead><tr><th>Situação</th><th>Linhas de pedido</th><th>Diferença</th></tr></thead><tbody>" +
    (marcada("igual") ? "<tr><td>No menor preço</td><td class=\"n\">" + t.linhas.igual + "</td><td class=\"n\">0,00</td></tr>" : "") +
    (marcada("caro") ? "<tr><td>Mais caro que o Resumo</td><td class=\"n\">" + t.linhas.caro + "</td><td class=\"n\">" + audSinal(t.difCaro) + "</td></tr>" : "") +
    (marcada("abaixo") ? "<tr><td>Abaixo do Resumo</td><td class=\"n\">" + t.linhas.abaixo + "</td><td class=\"n\">" + audSinal(t.difAbaixo) + "</td></tr>" : "") +
    (marcada("semcomp") ? "<tr><td>Sem Resumo para comparar</td><td class=\"n\">" + t.linhas.semResumo + "</td><td class=\"n\">—</td></tr><tr><td>Pedido sem preço</td><td class=\"n\">" + t.linhas.semPreco + "</td><td class=\"n\">—</td></tr>" : "") +
    "</tbody></table>"
    ) : "<div class=\"av\" style=\"background:#eef4ff;border-color:#b9c3da;color:#1a2f5a\">Nas situações marcadas não há linha de pedido, então não há valor para comparar. Abaixo, só a contagem do que você marcou.</div>") +
    ((!fornTxt && (marcada("nao") || marcada("almox"))) ? "<table class=\"mini\"><tbody>" +
      (marcada("nao") ? "<tr><td>Itens não comprados</td><td class=\"n\">" + t.naoComprados + "</td><td class=\"n\">" + fmtMoney(t.naoCompradosVal) + " pelo Resumo</td></tr>" : "") +
      (marcada("almox") ? "<tr><td>Retiradas do almoxarifado</td><td class=\"n\">" + t.almoxRegs + "</td><td class=\"n\">sem valor</td></tr>" : "") + "</tbody></table>" : "") +
    ((t.caros.length && marcada("caro")) ? "<h1 style=\"font-size:11px;margin-top:8px\">ONDE COMPREI MAIS CARO (MAIOR DIFERENÇA PRIMEIRO)</h1><table class=\"mini\"><thead><tr><th>MP</th><th>Insumo</th><th>Pedido</th><th>Diferença</th></tr></thead><tbody>" +
      t.caros.slice(0, 15).map(function (c) { return "<tr><td>" + esc(c.mapaNum) + "</td><td>" + esc(c.descricao) + "</td><td>" + esc(c.numero) + "</td><td class=\"n\">" + audSinal(c.difTot) + (c.difPct === null ? "" : " (+ " + Math.abs(Math.round(c.difPct * 10) / 10).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + "%)") + "</td></tr>"; }).join("") + "</tbody></table>" : "") +
    "<div class=\"rod\">Pedidos cancelados e retiradas estornadas ficaram de fora; item riscado só aparece se tiver compra ou retirada. Os preços unitários já trazem os percentuais aplicados no mapa (frete, impostos e outras despesas), por isso o Resumo e o Pedido são comparados direto. O fechamento soma só as linhas que aparecem, conforme as situações marcadas." + (fornTxt ? " Com fornecedor escolhido, itens não comprados e retiradas do almoxarifado não são listados." : "") + "</div></div>";
  return "<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><title>Auditoria de atendimentos</title>" + css + "</head><body><h1>AUDITORIA DE ATENDIMENTOS — CONTROLE DE MOVIMENTO</h1><div class=\"meta\">" + meta + "</div>" + avisos + corpo + fech + "</body></html>";
}
// fornecedores que realmente têm pedido (não cancelado) — são as únicas sugestões do filtro "Fornecedor do pedido"
function audFornecedoresDosPedidos(pr) {
  var visto = Object.create(null), out = [];
  ((pr && pr.ok && pr.lista) || []).forEach(function (po) {
    if (!po || po.status === "cancelado") return;
    var n = String(po.fornecedor_nome || "").trim();
    var k = normalizeBusca(n);
    if (!k || visto[k]) return;
    visto[k] = true;
    out.push(n);
  });
  return out.sort(function (a, b) { return a.localeCompare(b, "pt-BR"); });
}
var AUD_SITU = [
  ["igual", "NO MENOR PREÇO", "Pedido igual ao menor preço do Resumo", "#eef0f5", "#3d4350"],
  ["caro", "MAIS CARO", "Pedido acima do menor preço do Resumo", "#fbe3e0", "#a3231a"],
  ["abaixo", "ABAIXO DO RESUMO", "Mais barato: pedido abaixo do menor preço", "#dff1e3", "#186818"],
  ["almox", "SÓ ALMOX", "Saiu do almoxarifado (sem compra)", "#e1ecff", "#1a4aa0"],
  ["nao", "NÃO COMPRADO", "Item ainda sem pedido nem retirada", "#ffeed9", "#b34700"],
  ["semcomp", "SEM COMPARAÇÃO", "Pedido sem preço ou sem Resumo", "#ffeed9", "#b34700"]
];
function AuditoriaRelatorioForm(_refAu) {
  var cadastros = _refAu.cadastros || {}, f = _refAu.f, setF = _refAu.setF, fornecedores = _refAu.fornecedores || [];
  var upd = function (campo, valor) { setF(function (p) { var n = Object.assign({}, p); n[campo] = valor; return n; }); };
  var escolhidos = f.fornecedores || [];
  var situ = f.situ || [];
  var temForn = escolhidos.length > 0 || String(f.fornecedor || "").trim() !== "";
  // com fornecedor escolhido, "só almox" e "não comprado" não se aplicam (não têm fornecedor) e são desmarcados
  var semNaoAplicaveis = function (l) { return l.filter(function (k) { return k !== "almox" && k !== "nao"; }); };
  var pill = function (ativo) {
    return { border: "1px solid " + (ativo ? "#2a5298" : "#bbb"), background: ativo ? "#2a5298" : "#fff", color: ativo ? "#fff" : "#333", borderRadius: 14, padding: "5px 12px", fontSize: 12, cursor: "pointer" };
  };
  var addForn = function (nome) {
    nome = String(nome || "").trim().toUpperCase();
    if (!nome) return;
    setF(function (p) {
      var n = Object.assign({}, p), l = p.fornecedores || [];
      var ja = l.some(function (x) { return normalizeBusca(x) === normalizeBusca(nome); });
      n.fornecedores = ja ? l : l.concat([nome]);
      n.fornecedor = "";
      n.situ = semNaoAplicaveis(p.situ || []);
      return n;
    });
  };
  var delForn = function (nome) { setF(function (p) { var n = Object.assign({}, p); n.fornecedores = (p.fornecedores || []).filter(function (x) { return x !== nome; }); return n; }); };
  var digitaForn = function (v) { setF(function (p) { var n = Object.assign({}, p); n.fornecedor = v; if (String(v).trim()) n.situ = semNaoAplicaveis(p.situ || []); return n; }); };
  var alterna = function (k) { setF(function (p) { var l = p.situ || []; var n = Object.assign({}, p); n.situ = l.indexOf(k) >= 0 ? l.filter(function (x) { return x !== k; }) : l.concat([k]); return n; }); };
  var marcarTodas = function () { setF(function (p) { var n = Object.assign({}, p); n.situ = AUD_SITU.map(function (o) { return o[0]; }).filter(function (k) { var tf = (p.fornecedores || []).length > 0 || String(p.fornecedor || "").trim() !== ""; return !(tf && (k === "almox" || k === "nao")); }); return n; }); };
  var limpar = function () { upd("situ", []); };
  var link = { cursor: "pointer", color: "#2a5298", fontSize: 11, fontWeight: 700, textDecoration: "underline" };
  return /*#__PURE__*/React.createElement(React.Fragment, null,
    /*#__PURE__*/React.createElement("div", { style: SC.rDesc }, "Compara o que foi comprado (pedidos) com o menor preço do Resumo de cada item. Retiradas do almoxarifado aparecem sem preço."),
    /*#__PURE__*/React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", columnGap: 10, marginTop: 6 } },
      /*#__PURE__*/React.createElement("div", { style: { minWidth: 0 } },
        /*#__PURE__*/React.createElement("label", { style: SC.lbl }, "DATA INICIAL (OPCIONAL)"),
        /*#__PURE__*/React.createElement("input", { "data-aud-f": "inicio", type: "date", style: SC.inp, value: f.inicio, onChange: function (e) { upd("inicio", e.target.value); } })),
      /*#__PURE__*/React.createElement("div", { style: { minWidth: 0 } },
        /*#__PURE__*/React.createElement("label", { style: SC.lbl }, "DATA FINAL (OPCIONAL)"),
        /*#__PURE__*/React.createElement("input", { "data-aud-f": "fim", type: "date", style: SC.inp, value: f.fim, onChange: function (e) { upd("fim", e.target.value); } }))),
    /*#__PURE__*/React.createElement("label", { style: SC.lbl }, "O PERÍODO VALE PARA"),
    /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" } },
      /*#__PURE__*/React.createElement("span", { "data-aud-base": "atendimento", onClick: function () { upd("base", "atendimento"); }, style: pill(f.base !== "criacao") }, "Data do atendimento"),
      /*#__PURE__*/React.createElement("span", { "data-aud-base": "criacao", onClick: function () { upd("base", "criacao"); }, style: pill(f.base === "criacao") }, "Data de criação do mapa")),
    /*#__PURE__*/React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", columnGap: 10 } },
      /*#__PURE__*/React.createElement("div", { style: { minWidth: 0 } },
        /*#__PURE__*/React.createElement("label", { style: SC.lbl }, "OBRA (VAZIO = TODAS)"),
        /*#__PURE__*/React.createElement(AutocompleteInput, {
          value: f.obra, onChange: function (v) { upd("obra", v); }, suggestions: cadastros.obras || [], placeholder: "BUSCAR OU DIGITAR OBRA...", showOnFocus: true,
          xStyle: { marginBottom: 4 }, inputStyle: { border: "1.5px solid #dde1e9", borderRadius: 8, padding: "10px 12px", fontSize: 13, outline: "none" }
        })),
      /*#__PURE__*/React.createElement("div", { style: { minWidth: 0 } },
        /*#__PURE__*/React.createElement("label", { style: SC.lbl }, "FORNECEDOR (VAZIO = TODOS)"),
        /*#__PURE__*/React.createElement(AutocompleteInput, {
          key: "forn" + escolhidos.length, value: f.fornecedor || "", onChange: digitaForn, onCommit: addForn, suggestions: fornecedores.filter(function (n) { return !escolhidos.some(function (x) { return normalizeBusca(x) === normalizeBusca(n); }); }), placeholder: escolhidos.length ? "ADICIONAR OUTRO FORNECEDOR..." : "BUSCAR FORNECEDOR...", showOnFocus: true,
          xStyle: { marginBottom: 4 }, inputStyle: { border: "1.5px solid #dde1e9", borderRadius: 8, padding: "10px 12px", fontSize: 13, outline: "none" }
        }))),
    escolhidos.length > 0 && /*#__PURE__*/React.createElement("div", { "data-aud-forn-lista": "1", style: { display: "flex", gap: 6, flexWrap: "wrap", marginTop: 2 } },
      escolhidos.map(function (n) {
        return /*#__PURE__*/React.createElement("span", { key: n, "data-aud-forn-chip": n, style: { display: "inline-flex", alignItems: "center", gap: 6, background: "#eef4ff", border: "1px solid #2a5298", color: "#1a3a6c", borderRadius: 14, padding: "3px 6px 3px 10px", fontSize: 11, fontWeight: 700 } },
          n, /*#__PURE__*/React.createElement("span", { "data-aud-forn-del": n, onClick: function () { delForn(n); }, style: { cursor: "pointer", background: "#2a5298", color: "#fff", borderRadius: "50%", width: 16, height: 16, lineHeight: "16px", textAlign: "center", fontSize: 10 } }, "✕"));
      })),
    /*#__PURE__*/React.createElement("div", { style: { display: "grid", gridTemplateColumns: "112px minmax(0,1fr)", columnGap: 10 } },
      /*#__PURE__*/React.createElement("div", { style: { minWidth: 0 } },
        /*#__PURE__*/React.createElement("label", { style: SC.lbl }, "MAPA Nº"),
        /*#__PURE__*/React.createElement("input", { "data-aud-f": "mapaNum", style: SC.inp, value: f.mapaNum, inputMode: "numeric", placeholder: "EX.: 43", onChange: function (e) { upd("mapaNum", e.target.value.replace(/[^0-9]/g, "")); } })),
      /*#__PURE__*/React.createElement("div", { style: { minWidth: 0 } },
        /*#__PURE__*/React.createElement("label", { style: SC.lbl }, "INSUMO (VAZIO = TODOS)"),
        /*#__PURE__*/React.createElement("input", { "data-aud-f": "insumo", style: SC.inp, value: f.insumo, placeholder: "PARTE DO NOME DO INSUMO...", onChange: function (e) { upd("insumo", e.target.value.toUpperCase()); } }))),
    /*#__PURE__*/React.createElement("label", { style: SC.lbl }, "MOSTRAR (MARQUE O QUE QUER VER)"),
    /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 14, marginBottom: 6 } },
      /*#__PURE__*/React.createElement("span", { "data-aud-situ-todas": "1", onClick: marcarTodas, style: link }, "MARCAR TODAS"),
      /*#__PURE__*/React.createElement("span", { "data-aud-situ-limpar": "1", onClick: limpar, style: link }, "LIMPAR")),
    /*#__PURE__*/React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(215px,1fr))", gap: 6 } },
      AUD_SITU.map(function (o) {
        var desligada = temForn && (o[0] === "almox" || o[0] === "nao");
        var on = !desligada && situ.indexOf(o[0]) >= 0;
        return /*#__PURE__*/React.createElement("label", { key: o[0], style: { display: "flex", alignItems: "flex-start", gap: 8, border: "1.5px solid " + (on ? "#2a5298" : "#dde1e9"), background: on ? "#f3f7ff" : "#fff", borderRadius: 10, padding: "7px 9px", cursor: desligada ? "not-allowed" : "pointer", opacity: desligada ? 0.45 : 1, minWidth: 0 } },
          /*#__PURE__*/React.createElement("input", { type: "checkbox", "data-aud-situ": o[0], checked: on, disabled: desligada, onChange: function () { alterna(o[0]); }, style: { width: 18, height: 18, marginTop: 1, flex: "none", accentColor: "#2a5298" } }),
          /*#__PURE__*/React.createElement("span", { style: { display: "flex", flexDirection: "column", gap: 2, minWidth: 0 } },
            /*#__PURE__*/React.createElement("span", { style: { alignSelf: "flex-start", background: o[3], color: o[4], border: "1px solid " + o[4], borderRadius: 10, padding: "1px 8px", fontSize: 10, fontWeight: 800, letterSpacing: 0.2 } }, o[1]),
            /*#__PURE__*/React.createElement("span", { style: { fontSize: 10.5, color: "#667", lineHeight: 1.25 } }, o[2])));
      })),
    /*#__PURE__*/React.createElement("div", { style: { fontSize: 10, color: "#888", marginTop: 8 } }, "Nenhuma opção marcada = o relatório não é gerado. Com fornecedor escolhido, SÓ ALMOX e NÃO COMPRADO ficam desligados. Pedido cancelado e retirada estornada não entram, igual ao selo do mapa. Os preços já trazem os percentuais aplicados no mapa."));
}

function ReportsModal(_ref12) {
  var _currentMapa = _ref12.currentMapa || null;
  var open = _ref12.open,
    onClose = _ref12.onClose,
    mapas = _ref12.mapas,
    cadastros = _ref12.cadastros,
    orcamentos = _ref12.orcamentos || {},
    associacoes = _ref12.associacoes || [];
  var mapasComCurrent = _currentMapa ? mapas.map(function(m){ return m.id === _currentMapa.id ? _currentMapa : m; }) : mapas;
  var _useState19 = useState(_ref12.abaInicial || "periodo"),
    _useState20 = _slicedToArray(_useState19, 2),
    tab = _useState20[0],
    setTab = _useState20[1];
  var _useState21 = useState({
      inicio: "",
      fim: ""
    }),
    _useState22 = _slicedToArray(_useState21, 2),
    periodo = _useState22[0],
    setPeriodo = _useState22[1];
  var _useState23 = useState(""),
    _useState24 = _slicedToArray(_useState23, 2),
    obra = _useState24[0],
    setObra = _useState24[1];
  var _useState25 = useState(""),
    _useState26 = _slicedToArray(_useState25, 2),
    insumo = _useState26[0],
    setInsumo = _useState26[1];
  var _useStateBuscaInsumo = useState(""),
    _useStateBuscaInsumo2 = _slicedToArray(_useStateBuscaInsumo, 2),
    buscaInsumo = _useStateBuscaInsumo2[0],
    setBuscaInsumo = _useStateBuscaInsumo2[1];
  var _useStateInsumosMarcados = useState(function () { return new Set(); }),
    _useStateInsumosMarcados2 = _slicedToArray(_useStateInsumosMarcados, 2),
    insumosMarcados = _useStateInsumosMarcados2[0],
    setInsumosMarcados = _useStateInsumosMarcados2[1];
  // NOVO (06/10/2026 — atendimento pelo almoxarifado): filtros da aba "ALMOXARIFADO". Período vazio
  // = TODAS as retiradas (as datas são opcionais, ao contrário da aba "POR PERÍODO").
  var _almoxFPadrao = { inicio: "", fim: "", obra: "", insumo: "", visao: "detalhado", estornadas: true };
  var _useStateAlmoxF = useState(_almoxFPadrao),
    almoxF = _slicedToArray(_useStateAlmoxF, 2)[0],
    setAlmoxF = _slicedToArray(_useStateAlmoxF, 2)[1];
  var _audFPadrao = { inicio: "", fim: "", base: "atendimento", obra: "", mapaNum: "", insumo: "", fornecedor: "", fornecedores: [], situ: [] };
  var _useStateAudF = useState(function () { return _ref12.mapaNumInicial != null && String(_ref12.mapaNumInicial).trim() !== "" ? Object.assign({}, _audFPadrao, { mapaNum: String(_ref12.mapaNumInicial).trim() }) : _audFPadrao; }),
    audF = _slicedToArray(_useStateAudF, 2)[0],
    setAudF = _slicedToArray(_useStateAudF, 2)[1];
  // NOVO (09/10/2026 — atendimento nos relatórios): interruptor do relatório e leitura dos pedidos ao abrir o
  // painel (os pedidos ficam numa tabela à parte; o relatório precisa deles para saber o que já foi atendido).
  var _useStateModoRel = useState("comprar"),
    modoRel = _slicedToArray(_useStateModoRel, 2)[0],
    setModoRel = _slicedToArray(_useStateModoRel, 2)[1];
  var _useStatePedRel = useState(null),
    pedidosRel = _slicedToArray(_useStatePedRel, 2)[0],
    setPedidosRel = _slicedToArray(_useStatePedRel, 2)[1];
  useEffect(function () {
    if (!open) return undefined;
    var vivo = true;
    setPedidosRel(null);
    sbGetPedidosComStatus().then(function (r) { if (vivo) setPedidosRel(r); });
    return function () { vivo = false; };
  }, [open]);
  useEffect(function () {
    if (!open || !_ref12.abaInicial) return undefined;
    var t = setTimeout(function () {
      try { var el = document.querySelector('[data-rel-tab="' + _ref12.abaInicial + '"]'); if (el && el.scrollIntoView) el.scrollIntoView({ block: "nearest", inline: "nearest" }); } catch (e) {}
    }, 0);
    return function () { clearTimeout(t); };
  }, [open]);
  var insumosFiltrados = React.useMemo(function () {
    var b = normalizeBusca(buscaInsumo);
    if (!b) return [];
    return (cadastros.insumos || []).filter(function (x) {
      return normalizeBusca(x).includes(b);
    }).slice(0, 500);
  }, [cadastros, buscaInsumo]);
  // FIX (pedido do Claudio, 14/09 — "clico em GERAR PDF e tudo tem que ficar zerado para uma
  // nova pesquisa; e ao fechar e voltar, também"): o modal fica sempre montado, então o estado
  // dos campos sobrevivia a gerar e a fechar. Com a lista de insumos marcados isso ficou pior —
  // dezenas de caixinhas voltavam marcadas na consulta seguinte. Esta função zera TODOS os campos
  // de TODAS as abas (datas, obra, busca de insumo, marcações). A aba atual é mantida.
  var limparCampos = function limparCampos() {
    setPeriodo({ inicio: "", fim: "" });
    setObra("");
    setInsumo("");
    setBuscaInsumo("");
    setInsumosMarcados(new Set());
    setAlmoxF(_almoxFPadrao);
    setAudF(_audFPadrao);
    setModoRel("comprar");
  };
  var fecharLimpando = function fecharLimpando() { limparCampos(); onClose(); };
  var toggleInsumoMarcado = function toggleInsumoMarcado(nome) {
    setInsumosMarcados(function (prev) {
      var novo = new Set(prev);
      if (novo.has(nome)) novo.delete(nome); else novo.add(nome);
      return novo;
    });
  };
  var todosFiltradosMarcados = insumosFiltrados.length > 0 && insumosFiltrados.every(function (n) { return insumosMarcados.has(n); });
  var toggleMarcarTodosFiltrados = function toggleMarcarTodosFiltrados() {
    setInsumosMarcados(function (prev) {
      var novo = new Set(prev);
      if (todosFiltradosMarcados) {
        insumosFiltrados.forEach(function (n) { novo.delete(n); });
      } else {
        insumosFiltrados.forEach(function (n) { novo.add(n); });
      }
      return novo;
    });
  };
  // Opções de atendimento para os relatórios Período/Obra/Insumo. false = não gerar agora.
  var montarOptsRel = function montarOptsRel() {
    if (pedidosRel === null) {
      alert("AINDA CARREGANDO OS PEDIDOS. AGUARDE ALGUNS SEGUNDOS E CLIQUE DE NOVO.");
      return false;
    }
    if (!pedidosRel.ok) {
      if (!window.confirm("N\u00c3O FOI POSS\u00cdVEL LER OS PEDIDOS.\n\nO relat\u00f3rio ser\u00e1 gerado SEM o atendimento por pedidos (valores pela quantidade solicitada). Deseja continuar?")) return false;
      return null;
    }
    return { pedidos: pedidosRel.lista, modo: modoRel };
  };
  var seletorModoRel = function seletorModoRel() {
    var nota = pedidosRel === null ? "Carregando pedidos\u2026" : (!pedidosRel.ok ? "\u26a0 N\u00e3o foi poss\u00edvel ler os pedidos: o relat\u00f3rio sair\u00e1 sem o atendimento por pedidos." : "S\u00f3 muda os mapas que j\u00e1 t\u00eam pedido e/ou almoxarifado; o resto sai como sempre.");
    return /*#__PURE__*/React.createElement("div", {
      "data-rel-atend": "1",
      style: { marginTop: 12, padding: "8px 10px", background: "#f4f7ff", border: "1px solid #dbe4f8", borderRadius: 8 }
    }, /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 11, fontWeight: 700, color: "#2a5298", marginBottom: 6 }
    }, "VALORES DO RESUMO"), /*#__PURE__*/React.createElement("span", {
      "data-atend-seg": "1",
      style: { display: "inline-flex", maxWidth: "100%", borderRadius: 6, overflow: "hidden", border: "1px solid #2a5298" }
    }, [["comprar", "\uD83D\uDED2 A comprar (falta)"], ["solicitado", "\uD83D\uDCCB Solicitado (cheio)"]].map(function (o) {
      var on = modoRel === o[0];
      return /*#__PURE__*/React.createElement("button", {
        key: o[0], type: "button", "data-rel-modo": o[0], "aria-pressed": on ? "true" : "false",
        onClick: function () { setModoRel(o[0]); },
        style: { border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, padding: "6px 7px", whiteSpace: "nowrap", fontFamily: "inherit", background: on ? "#2a5298" : "#fff", color: on ? "#fff" : "#2a5298" }
      }, o[1]);
    })), /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 10, color: "#888", marginTop: 6 }
    }, nota));
  };
  return /*#__PURE__*/React.createElement(Modal, {
    open: open,
    onClose: onClose,
    maxWidth: 520
  }, /*#__PURE__*/React.createElement("div", {
    style: SC.mHdr
  }, /*#__PURE__*/React.createElement("span", {
    style: SC.mTitle
  }, "RELAT\xD3RIOS EM PDF"), /*#__PURE__*/React.createElement("button", {
    style: {
      background: "none",
      border: "none",
      color: "#999",
      cursor: "pointer"
    },
    onClick: fecharLimpando
  }, /*#__PURE__*/React.createElement(IcoClose, null))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      overflowX: "auto",
      borderBottom: "2px solid #e8eaf0",
      background: "#f8f9fb"
    }
  }, [["periodo", "POR PERÍODO"], ["obra", "POR OBRA"], ["orcamento", "OR\xC7AMENTO"], ["insumo", "POR INSUMO"], ["almox", "ALMOXARIFADO"], ["auditoria", "AUDITORIA"]].map(function (_ref13) {
    var _ref14 = _slicedToArray(_ref13, 2),
      id = _ref14[0],
      lbl = _ref14[1];
    return /*#__PURE__*/React.createElement("button", {
      key: id,
      "data-rel-tab": id,
      onClick: function onClick() {
        return setTab(id);
      },
      style: {
        flex: 1,
        border: "none",
        background: "none",
        padding: "12px 6px",
        fontSize: 12,
        fontWeight: 700,
        cursor: "pointer",
        color: tab === id ? "#2a5298" : "#888",
        borderBottom: tab === id ? "2px solid #2a5298" : "2px solid transparent",
        marginBottom: -2
      }
    }, lbl);
  })), /*#__PURE__*/React.createElement("div", {
    style: SC.mBody
  }, tab === "periodo" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: SC.rDesc
  }, "Lista todos os mapas criados no intervalo selecionado com totais."), /*#__PURE__*/React.createElement("label", {
    style: SC.lbl
  }, "DATA INICIAL"), /*#__PURE__*/React.createElement("input", {
    type: "date",
    style: SC.inp,
    value: periodo.inicio,
    onChange: function onChange(e) {
      return setPeriodo(function (p) {
        return _objectSpread(_objectSpread({}, p), {}, {
          inicio: e.target.value
        });
      });
    }
  }), /*#__PURE__*/React.createElement("label", {
    style: SC.lbl
  }, "DATA FINAL"), /*#__PURE__*/React.createElement("input", {
    type: "date",
    style: SC.inp,
    value: periodo.fim,
    onChange: function onChange(e) {
      return setPeriodo(function (p) {
        return _objectSpread(_objectSpread({}, p), {}, {
          fim: e.target.value
        });
      });
    }
  }), periodo.inicio && periodo.fim && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#888",
      marginTop: 4
    }
  }, mapas.filter(function (m) {
    var d = new Date(m.criadoEm);
    return d >= new Date(periodo.inicio + "T00:00:00") && d <= new Date(periodo.fim + "T23:59:59");
  }).length, " MAPA(S) NO PER\xCDODO"), seletorModoRel()), tab === "obra" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: SC.rDesc
  }, "Exibe todos os mapas de uma obra espec\xEDfica, um por p\xE1gina."), /*#__PURE__*/React.createElement("label", {
    style: SC.lbl
  }, "OBRA"), /*#__PURE__*/React.createElement(AutocompleteInput, {
    value: obra,
    onChange: setObra,
    suggestions: cadastros.obras || [],
    placeholder: "BUSCAR OU DIGITAR OBRA...",
    showOnFocus: true,
    xStyle: {
      marginBottom: 4
    },
    inputStyle: {
      border: "1.5px solid #dde1e9",
      borderRadius: 8,
      padding: "10px 12px",
      fontSize: 13,
      outline: "none"
    }
  }), obra && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#888",
      marginTop: 4
    }
  }, mapas.filter(function (m) {
    return (m.obra || "").toUpperCase().includes(obra.toUpperCase());
  }).length, " MAPA(S)"), seletorModoRel()), tab === "orcamento" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {style: SC.rDesc}, "Gera o relatório de orçamento de uma obra."), /*#__PURE__*/React.createElement("label", {style: SC.lbl}, "OBRA"), /*#__PURE__*/React.createElement(AutocompleteInput, {value: obra, onChange: setObra, suggestions: Object.keys(orcamentos), placeholder: "BUSCAR OU DIGITAR OBRA...", showOnFocus: true, xStyle: {marginBottom: 4}, inputStyle: {border: "1.5px solid #dde1e9", borderRadius: 8, padding: "10px 12px", fontSize: 13, outline: "none"}}), obra && /*#__PURE__*/React.createElement("div", {style: {fontSize: 11, color: "#888", marginTop: 4}}, orcamentos[obra] ? (orcamentos[obra].itens||orcamentos[obra]||[]).length + " ITEM(S)" : "SEM ORÇAMENTO")), tab === "insumo" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: SC.rDesc
  }, "Compara pre\xE7os de um ou mais insumos em todos os mapas."), /*#__PURE__*/React.createElement("label", {
    style: SC.lbl
  }, "BUSCAR INSUMO"), /*#__PURE__*/React.createElement("input", {
    value: buscaInsumo,
    // FIX (pedido do Claudio, depois de ver na prática — a marcação ficando acumulada entre
    // buscas diferentes causava confusão, mesmo tendo sido o comportamento pedido e testado
    // antes: "220 MARCADO(S)" numa busca que só tinha 16 resultados visíveis, vindo de uma busca
    // anterior completamente diferente): agora cada busca nova começa do zero — trocar o texto
    // da busca limpa a marcação automaticamente. Efeito colateral direto, e esperado: o PDF de
    // cada vez cobre só os insumos marcados NA BUSCA ATUAL, não mais o acumulado de buscas
    // anteriores.
    onChange: function (e) { setBuscaInsumo(e.target.value); setInsumosMarcados(new Set()); },
    placeholder: "EX: TIJOLO, CIMENTO, DISCO...",
    style: {
      width: "100%",
      border: "1.5px solid #dde1e9",
      borderRadius: 8,
      padding: "10px 12px",
      fontSize: 13,
      outline: "none",
      marginBottom: 8,
      boxSizing: "border-box"
    }
  }), insumosFiltrados.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: "#f5f0ff",
      borderRadius: 6,
      padding: "8px 10px",
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontSize: 11.5,
      fontWeight: 700,
      color: "#5b21b6",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: todosFiltradosMarcados,
    onChange: toggleMarcarTodosFiltrados
  }), "MARCAR TODOS OS " + insumosFiltrados.length + " DA BUSCA"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: "#5b21b6",
      fontWeight: 700
    }
  }, insumosMarcados.size + " MARCADO(S)")), insumosFiltrados.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight: 220,
      overflowY: "auto",
      border: "1px solid #e4e8f4",
      borderRadius: 8
    }
  }, insumosFiltrados.map(function (nome) {
    var marcado = insumosMarcados.has(nome);
    return /*#__PURE__*/React.createElement("label", {
      key: nome,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 9,
        padding: "8px 12px",
        borderBottom: "1px solid #f0f2f7",
        fontSize: 12,
        cursor: "pointer",
        background: marcado ? "#f0faf4" : "transparent"
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      checked: marcado,
      onChange: function () { toggleInsumoMarcado(nome); }
    }), /*#__PURE__*/React.createElement("span", {
      style: { flex: 1 }
    }, nome));
  })), !buscaInsumo.trim() && /*#__PURE__*/React.createElement("div", {
    style: { fontSize: 11, color: "#999", marginTop: 4 }
  }, "Digite para buscar os insumos cadastrados."), buscaInsumo.trim() && insumosFiltrados.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: { fontSize: 11, color: "#999", marginTop: 4 }
  }, "Nenhum insumo encontrado para esta busca.")), tab === "almox" && /*#__PURE__*/React.createElement(AlmoxRelatorioForm, {
    cadastros: cadastros,
    f: almoxF,
    setF: setAlmoxF
  }), tab === "auditoria" && /*#__PURE__*/React.createElement(AuditoriaRelatorioForm, {
    cadastros: cadastros,
    f: audF,
    setF: setAudF,
    fornecedores: audFornecedoresDosPedidos(pedidosRel)
  })), /*#__PURE__*/React.createElement("div", {
    style: tab === "auditoria" ? Object.assign({}, SC.mFtr, { position: "sticky", bottom: 0, zIndex: 3, background: "#fff", boxShadow: "0 -8px 12px -10px rgba(15,31,61,0.35)", paddingBottom: "max(14px, env(safe-area-inset-bottom))" }) : SC.mFtr
  }, /*#__PURE__*/React.createElement("button", {
    style: SC.btnSec,
    onClick: fecharLimpando
  }, "FECHAR"), /*#__PURE__*/React.createElement("button", {
    style: SC.btnPri,
    onClick: function onClick() {
      if (tab === "periodo") {
        if (!periodo.inicio || !periodo.fim) {
          alert("SELECIONE O PERÍODO.");
          return;
        }
        var _optsPer = montarOptsRel();
        if (_optsPer === false) return;
        logEventoDiag("RELAT\u00d3RIO gerado: por PER\u00cdODO (" + periodo.inicio + " a " + periodo.fim + ")");
        gerarRelatorioPeriodo(mapasComCurrent, periodo.inicio, periodo.fim, orcamentos, associacoes, _optsPer);
        limparCampos();
      }
      if (tab === "obra") {
        if (!obra.trim()) {
          // FIX (pedido do Claudio): campo vazio agora é permitido — gera um PDF com TODOS os
          // mapas de TODAS as obras, um por página, em vez de bloquear com "INFORME A OBRA."
          // Como isso pode virar um documento muito grande (proporcional ao total de mapas do
          // sistema), confirma explicitamente antes, mostrando quantos mapas vão entrar — para
          // não gerar isso sem querer por só ter esquecido de preencher o campo.
          var totalTodosMapas = mapasComCurrent.length;
          var confirmouTodasObras = window.confirm(
            "NENHUMA OBRA SELECIONADA.\n\nIsso vai gerar um PDF com TODOS os " + totalTodosMapas + " MAPA(S) do sistema, um por página. Pode ser um arquivo grande e demorar para carregar.\n\nDeseja continuar mesmo assim?"
          );
          if (!confirmouTodasObras) return;
        }
        var _optsObra = montarOptsRel();
        if (_optsObra === false) return;
        logEventoDiag("RELAT\u00d3RIO gerado: por OBRA (" + (obra.trim() || "TODAS AS OBRAS") + ")");
        gerarRelatorioObra(mapasComCurrent, obra, orcamentos, associacoes, _optsObra);
        limparCampos();
      }
      if (tab === "orcamento") {
        if (!obra.trim()) { alert("INFORME A OBRA."); return; }
        // FIX: qualquer erro dentro da geração do relatório agora aparece na tela, em vez de falhar
        // em silêncio (o que fazia parecer que "nada acontece" quando clicava em GERAR PDF).
        try {
          logEventoDiag("RELAT\u00d3RIO gerado: OR\u00c7AMENTO x REALIZADO (obra " + obra + ")");
          var htmlRelOrc = gerarRelatorioOrcamento(mapasComCurrent, obra, orcamentos, associacoes);
          if (!htmlRelOrc) { alert("Não foi possível montar o relatório para esta obra (resultado veio vazio)."); return; }
          abrirPDF(htmlRelOrc);
          limparCampos();
        } catch (erroRelOrc) {
          alert("ERRO ao gerar o relatório de orçamento:\n" + (erroRelOrc && erroRelOrc.message ? erroRelOrc.message : String(erroRelOrc)));
        }
      }
      if (tab === "almox") {
        // Datas opcionais: vazio = tudo. Só valida se as duas vierem preenchidas ao contrário.
        if (almoxF.inicio && almoxF.fim && almoxF.inicio > almoxF.fim) {
          alert("A DATA INICIAL N\u00c3O PODE SER MAIOR QUE A DATA FINAL.");
          return;
        }
        try {
          var _regsAlmox = coletarRetiradasAlmox(mapasComCurrent, almoxF);
          if (!_regsAlmox.length) {
            alert("NENHUMA RETIRADA DO ALMOXARIFADO ENCONTRADA COM ESSES FILTROS.");
            return;
          }
          if (!almoxF.inicio && !almoxF.fim && !almoxF.obra.trim() && !almoxF.insumo.trim()) {
            if (!window.confirm("NENHUM FILTRO INFORMADO.\n\nO relat\u00f3rio vai trazer TODAS as retiradas do almoxarifado (" + _regsAlmox.length + " registro(s)) de TODAS as obras.\n\nDeseja continuar?")) return;
          }
          logEventoDiag("RELAT\u00d3RIO gerado: ALMOXARIFADO (" + _regsAlmox.length + " registro(s), " + almoxF.visao + ")");
          abrirPDF(gerarRelatorioAlmox(_regsAlmox, almoxF));
          limparCampos();
        } catch (erroRelAlmox) {
          alert("ERRO ao gerar o relat\u00f3rio do almoxarifado:\n" + (erroRelAlmox && erroRelAlmox.message ? erroRelAlmox.message : String(erroRelAlmox)));
        }
      }
      if (tab === "auditoria") {
        if (audF.inicio && audF.fim && audF.inicio > audF.fim) {
          alert("A DATA INICIAL N\u00c3O PODE SER MAIOR QUE A DATA FINAL.");
          return;
        }
        if (!audF.situ || !audF.situ.length) {
          alert("MARQUE PELO MENOS UMA OPÇÃO EM MOSTRAR.");
          return;
        }
        if (pedidosRel === null) {
          alert("AINDA CARREGANDO OS PEDIDOS. AGUARDE ALGUNS SEGUNDOS E CLIQUE DE NOVO.");
          return;
        }
        if (!pedidosRel.ok) {
          alert("N\u00c3O FOI POSS\u00cdVEL LER OS PEDIDOS. A AUDITORIA PRECISA DELES. TENTE DE NOVO EM ALGUNS SEGUNDOS.");
          return;
        }
        try {
          var _resAud = coletarAuditoria(mapasComCurrent, pedidosRel.lista, audF);
          if (!_resAud.itens.length) {
            alert("NENHUM ITEM ENCONTRADO COM ESSES FILTROS.");
            return;
          }
          if (_resAud.limite && !window.confirm("ATEN\u00c7\u00c3O: FORAM LIDOS 1000 PEDIDOS (LIMITE DA LEITURA).\n\nPedidos mais antigos podem n\u00e3o ter entrado e itens podem aparecer como n\u00e3o comprados por isso.\n\nDeseja continuar?")) return;
          logEventoDiag("RELAT\u00d3RIO gerado: AUDITORIA (" + _resAud.itens.length + " item(ns))");
          abrirPDF(gerarRelatorioAuditoria(_resAud, audF));
          limparCampos();
        } catch (erroRelAud) {
          alert("ERRO ao gerar a auditoria:\n" + (erroRelAud && erroRelAud.message ? erroRelAud.message : String(erroRelAud)));
        }
      }
        if (tab === "insumo") {
        if (insumosMarcados.size === 0) {
          alert("MARQUE PELO MENOS UM INSUMO.");
          return;
        }
        var _listaInsumosMarcados = Array.from(insumosMarcados);
        var _optsIns = montarOptsRel();
        if (_optsIns === false) return;
        logEventoDiag("RELAT\u00d3RIO gerado: por INSUMO (" + _listaInsumosMarcados.length + " marcado(s): " + _listaInsumosMarcados.join(", ") + ")");
        gerarRelatorioInsumo(mapasComCurrent, _listaInsumosMarcados, _optsIns);
        limparCampos();
      }
    }
  }, /*#__PURE__*/React.createElement(IcoPDF, null), " GERAR PDF")));
}

// ─── Relatório do ALMOXARIFADO (06/10/2026) ──────────────────────────────────
// Lê só o que já está dentro de cada mapa (mapa.almox[item.id]) — não consulta pedidos nem banco,
// não grava nada. Estornadas continuam registradas (riscadas) para conferência.
function almoxDataLocalKey(iso) {
  var d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
}
function almoxFmtNum(n) {
  var v = Math.round((Number(n) || 0) * 1000) / 1000;
  return v.toLocaleString("pt-BR", { maximumFractionDigits: 3 });
}
function almoxFmtData(iso) {
  var k = almoxDataLocalKey(iso);
  return k ? k.slice(8, 10) + "/" + k.slice(5, 7) + "/" + k.slice(0, 4) : "";
}
function coletarRetiradasAlmox(mapas, f) {
  f = f || {};
  var obraF = (f.obra || "").trim().toUpperCase();
  var insF = (f.insumo || "").trim().toUpperCase();
  var out = [];
  (mapas || []).forEach(function (m) {
    if (!m) return;
    if (obraF && (m.obra || "").toUpperCase().indexOf(obraF) === -1) return;
    var almox = m.almox || {};
    (m.itens || []).forEach(function (it) {
      var regs = almox[it.id];
      if (!regs || !regs.length) return;
      var txtItem = ((it.descricao || "") + " " + (it.detalhe || "")).toUpperCase();
      if (insF && txtItem.indexOf(insF) === -1) return;
      // PENDENTE (só almoxarifado): acumulado, retirada por retirada, de TODAS as retiradas do item
      // (calculado ANTES dos filtros de período/obra/insumo/estornadas, senão o número sairia errado).
      // Estornadas nunca entram na soma. Não consulta pedidos.
      var _qtSolicItem = parseNumBR(it.qt) || 0;
      var _ordem = [];
      regs.forEach(function (r, ix) { if (r) _ordem.push({ r: r, ix: ix }); });
      _ordem.sort(function (a, b) {
        var da = a.r.data || "", db = b.r.data || "";
        if (da !== db) return da < db ? -1 : 1;
        return a.ix - b.ix;
      });
      var _acum = 0, _acumPorReg = {};
      _ordem.forEach(function (o) {
        if (!o.r.estornado) _acum = Math.round((_acum + (Number(o.r.qt) || 0)) * 1000) / 1000;
        _acumPorReg[o.ix] = o.r.estornado ? null : _acum;
      });
      regs.forEach(function (r, ix) {
        if (!r) return;
        if (r.estornado && f.estornadas === false) return;
        var dk = almoxDataLocalKey(r.data);
        if (f.inicio && (!dk || dk < f.inicio)) return;
        if (f.fim && (!dk || dk > f.fim)) return;
        var _at = _acumPorReg[ix];
        out.push({
          obra: m.obra || "", mapaNum: m.numero, itemNum: it.num, descricao: it.descricao || "", detalhe: it.detalhe || "",
          unid: it.unid || "", qtSolic: _qtSolicItem, qt: Number(r.qt) || 0, data: r.data, dk: dk,
          por: r.por || "", obs: r.obs || "", estornado: !!r.estornado,
          chave: String(m.id || m.numero) + "|" + String(it.id),
          itemExcluido: !!it.excluido,
          atend: (_at === null || _at === undefined) ? null : _at,
          pend: (_at === null || _at === undefined) ? null : Math.max(0, Math.round((_qtSolicItem - _at) * 1000) / 1000),
          excede: (_at === null || _at === undefined) ? 0 : Math.max(0, Math.round((_at - _qtSolicItem) * 1000) / 1000)
        });
      });
    });
  });
  out.sort(function (a, b) {
    if (a.obra !== b.obra) return a.obra < b.obra ? -1 : 1;
    if (a.dk !== b.dk) return a.dk < b.dk ? -1 : 1;
    if ((a.data || "") !== (b.data || "")) return (a.data || "") < (b.data || "") ? -1 : 1;
    if ((a.mapaNum || 0) !== (b.mapaNum || 0)) return (a.mapaNum || 0) - (b.mapaNum || 0);
    return (Number(a.itemNum) || 0) - (Number(b.itemNum) || 0);
  });
  return out;
}
function gerarRelatorioAlmox(regs, f) {
  f = f || {};
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  var periodoTxt = (f.inicio || f.fim)
    ? ((f.inicio ? almoxFmtData(f.inicio + "T12:00:00") : "início") + " a " + (f.fim ? almoxFmtData(f.fim + "T12:00:00") : "hoje"))
    : "todo o período";
  var meta = "Período: " + periodoTxt + " · Obra: " + esc(f.obra && f.obra.trim() ? f.obra.trim().toUpperCase() : "todas") +
    " · Insumo: " + esc(f.insumo && f.insumo.trim() ? f.insumo.trim().toUpperCase() : "todos") +
    " · Estornadas: " + (f.estornadas === false ? "não incluídas" : "incluídas (riscadas)") +
    " · Gerado em " + new Date().toLocaleString("pt-BR");
  var css = "<style>@page{size:A4 landscape;margin:12mm}*{box-sizing:border-box}body{font-family:Arial,Helvetica,sans-serif;font-size:10.5px;color:#222;margin:0}" +
    "h1{font-size:15px;color:#0f1f3d;margin:0 0 3px}.meta{color:#555;font-size:10px;margin-bottom:10px}" +
    ".ob{background:#2a5298;color:#fff;padding:5px 8px;font-weight:700;font-size:11px;margin-top:12px;-webkit-print-color-adjust:exact;print-color-adjust:exact}" +
    "table{border-collapse:collapse;width:100%;font-size:10px}th{background:#e4e9f5;border:1px solid #c8d0e4;padding:4px 5px;text-align:left;font-size:9px;text-transform:uppercase;-webkit-print-color-adjust:exact;print-color-adjust:exact}" +
    "td{border:1px solid #d6dbe8;padding:4px 5px;vertical-align:top}.n{text-align:right}tr{page-break-inside:avoid}" +
    "tr.est td{color:#999;text-decoration:line-through;background:#fafafa}tr.tot td{background:#f2f5fb;font-weight:700;-webkit-print-color-adjust:exact;print-color-adjust:exact}" +
    ".tg{font-size:8px;background:#fdecea;color:#a32d2d;border-radius:8px;padding:0 5px;text-decoration:none;display:inline-block}.rod{margin-top:10px;color:#777;font-size:9px}" +
    ".dia{background:#2a5298;color:#fff;padding:5px 8px;font-weight:700;font-size:11px;margin-top:12px;display:flex;justify-content:space-between;-webkit-print-color-adjust:exact;print-color-adjust:exact}" +
    ".dia.geral{background:#5b6f99}tr.mult td{background:#fffbe6;-webkit-print-color-adjust:exact;print-color-adjust:exact}table.fx{table-layout:fixed}table.fx td,table.fx th{overflow-wrap:anywhere}@media screen{html{background:#e9edf5}body{max-width:1240px;margin:18px auto;padding:22px 30px 30px;background:#fff;box-shadow:0 2px 14px rgba(0,0,0,.18);font-size:12px}table{font-size:11.5px}th{font-size:10px}.meta{font-size:11px}.rod{font-size:10.5px}.sec{margin-top:40px;padding-top:22px;border-top:4px solid #2a5298}}" +
    ".pp{color:#b34700;font-weight:700}.pz{color:#3b6d11;font-weight:700}.exc{font-size:8px;background:#e3f0ff;color:#0b5fa5;border-radius:8px;padding:0 5px;display:inline-block;margin-left:3px}.tg2{font-size:8px;background:#fff3c4;color:#7a5a00;border-radius:8px;padding:0 5px;display:inline-block;margin-left:4px}.ac{color:#555}.dia-wrap{page-break-inside:avoid}</style>";
  function totaisPorUnid(lista) {
    var t = {}, ordem = [];
    lista.forEach(function (r) {
      if (r.estornado) return;
      var u = r.unid || "—";
      if (!(u in t)) { t[u] = 0; ordem.push(u); }
      t[u] += r.qt;
    });
    return ordem.map(function (u) { return almoxFmtNum(t[u]) + " " + esc(u); }).join(" · ") || "0";
  }
  function celulaPend(r) {
    if (r.estornado) return "<td class=\"n\">\u2014</td>";
    if (r.itemExcluido) return "<td class=\"n\">\u2014 <span class=\"tg2\">ITEM EXCLU\u00cdDO</span></td>";
    if (r.pend === null || r.pend === undefined) return "<td class=\"n\">\u2014</td>";
    if (r.pend > 0) return "<td class=\"n\"><span class=\"pp\">" + almoxFmtNum(r.pend) + "</span></td>";
    return "<td class=\"n\"><span class=\"pz\">\u2714 0</span>" + (r.excede > 0 ? "<span class=\"exc\">EXCEDE +" + almoxFmtNum(r.excede) + "</span>" : "") + "</td>";
  }
  // Total do pendente da obra: posição FINAL de cada item (última retirada não estornada), por unidade.
  function pendentesPorUnid(lista) {
    var ult = {}, ordemK = [];
    lista.forEach(function (r) {
      if (r.estornado || r.itemExcluido || r.pend === null || r.pend === undefined) return;
      if (!(r.chave in ult)) ordemK.push(r.chave);
      ult[r.chave] = r;
    });
    var t = {}, ordemU = [];
    ordemK.forEach(function (k) {
      var r = ult[k], u = r.unid || "\u2014";
      if (!(u in t)) { t[u] = 0; ordemU.push(u); }
      t[u] = Math.round((t[u] + r.pend) * 1000) / 1000;
    });
    return ordemU.map(function (u) { return almoxFmtNum(t[u]) + " " + esc(u); }).join(" \u00b7 ") || "0";
  }
  // Monta o corpo de UMA visão. A opção "todas" chama esta função 3 vezes e junta (cada uma em página nova).
  // Larguras fixas: as tabelas de obras/dias diferentes ficam com as colunas alinhadas entre si.
  var cgDia = "<colgroup><col style=\"width:38%\"><col style=\"width:6%\"><col style=\"width:10%\"><col style=\"width:16%\"><col style=\"width:30%\"></colgroup>";
  var cgDet = "<colgroup><col style=\"width:8%\"><col style=\"width:6%\"><col style=\"width:5%\"><col style=\"width:26%\"><col style=\"width:5%\"><col style=\"width:8%\"><col style=\"width:10%\"><col style=\"width:15%\"><col style=\"width:8%\"><col style=\"width:9%\"></colgroup>";
  function montarCorpo(visao) {
  var corpo = "";
  if (visao === "resumo") {
    var grupos = {}, ordemG = [];
    regs.forEach(function (r) {
      var nome = (r.descricao + (r.detalhe ? " — " + r.detalhe : "")).toUpperCase();
      var k = nome + "|||" + (r.unid || "").toUpperCase();
      if (!grupos[k]) { grupos[k] = { nome: nome, unid: r.unid || "", n: 0, est: 0, total: 0, obras: [] }; ordemG.push(k); }
      var g = grupos[k];
      if (r.estornado) { g.est++; return; }
      g.n++; g.total += r.qt;
      if (r.obra && g.obras.indexOf(r.obra) === -1) g.obras.push(r.obra);
    });
    ordemG.sort(function (a, b) { return grupos[a].nome < grupos[b].nome ? -1 : (grupos[a].nome > grupos[b].nome ? 1 : 0); });
    var mostrarEst = f.estornadas !== false;
    var linhasR = ordemG.map(function (k) {
      var g = grupos[k];
      return "<tr><td>" + esc(g.nome) + "</td><td>" + esc(g.unid) + "</td><td class=\"n\">" + g.n + "</td><td class=\"n\"><b>" + almoxFmtNum(g.total) + "</b></td>" +
        (mostrarEst ? "<td class=\"n\">" + g.est + "</td>" : "") + "<td>" + esc(g.obras.join(" | ")) + "</td></tr>";
    }).join("");
    corpo = "<h1>RESUMO DO ALMOXARIFADO POR INSUMO</h1><div class=\"meta\">" + meta + "</div><table><tr><th>Insumo</th><th>Un.</th><th class=\"n\">Retiradas</th><th class=\"n\">Total retirado</th>" +
      (mostrarEst ? "<th class=\"n\">Estornadas</th>" : "") + "<th>Obras</th></tr>" + linhasR + "</table>" +
      "<div class=\"rod\">Unidades diferentes nunca são somadas entre si. Retiradas estornadas não entram nos totais.</div>";
  } else if (visao === "dia") {
    // RESUMO POR DIA: um bloco por data (dia local do lançamento); dentro, uma linha por insumo+unidade.
    // "Acumulado" = soma, por insumo+unidade, do primeiro dia do relatório até aquele dia (sem estornadas).
    var diasMap = {}, ordemD = [];
    regs.forEach(function (r) {
      var dk = r.dk || "sem-data";
      if (!diasMap[dk]) { diasMap[dk] = { regs: [] }; ordemD.push(dk); }
      diasMap[dk].regs.push(r);
    });
    ordemD.sort(function (a, b) { return a < b ? -1 : (a > b ? 1 : 0); });
    var SEMANA = ["DOMINGO", "SEGUNDA-FEIRA", "TERÇA-FEIRA", "QUARTA-FEIRA", "QUINTA-FEIRA", "SEXTA-FEIRA", "SÁBADO"];
    var acumPor = {};
    var blocosDia = ordemD.map(function (dk) {
      var lista = diasMap[dk].regs;
      var gr = {}, ordG = [], ests = [], nLanc = 0;
      lista.forEach(function (r) {
        var nome = (r.descricao + (r.detalhe ? " — " + r.detalhe : "")).toUpperCase();
        var k = nome + "|||" + (r.unid || "").toUpperCase();
        if (r.estornado) { ests.push({ nome: nome, r: r }); return; }
        if (!gr[k]) { gr[k] = { nome: nome, unid: r.unid || "", n: 0, total: 0, obras: [] }; ordG.push(k); }
        var g = gr[k];
        g.n++; g.total += r.qt; nLanc++;
        if (r.obra && g.obras.indexOf(r.obra) === -1) g.obras.push(r.obra);
      });
      ordG.sort(function (a, b) { return gr[a].nome < gr[b].nome ? -1 : (gr[a].nome > gr[b].nome ? 1 : (a < b ? -1 : (a > b ? 1 : 0))); });
      ests.sort(function (a, b) { return a.nome < b.nome ? -1 : (a.nome > b.nome ? 1 : 0); });
      var linhasD = ordG.map(function (k) {
        var g = gr[k];
        var antes = acumPor[k] || 0;
        var depois = antes + g.total;
        acumPor[k] = depois;
        var acTxt = antes > 0 ? "<b>" + almoxFmtNum(depois) + "</b> <span style=\"color:#888\">(" + almoxFmtNum(antes) + " + " + almoxFmtNum(g.total) + ")</span>" : almoxFmtNum(depois);
        return "<tr" + (g.n > 1 ? " class=\"mult\"" : "") + "><td>" + esc(g.nome) + (g.n > 1 ? " <span class=\"tg2\">" + g.n + " lançamentos</span>" : "") + "</td><td>" + esc(g.unid) +
          "</td><td class=\"n\"><b>" + almoxFmtNum(g.total) + "</b></td><td class=\"n ac\">" + acTxt + "</td><td>" + esc(g.obras.join(" | ")) + "</td></tr>";
      }).join("");
      var linhasE = ests.map(function (e) {
        return "<tr class=\"est\"><td>" + esc(e.nome) + " <span class=\"tg\">ESTORNADA</span></td><td>" + esc(e.r.unid) + "</td><td class=\"n\">" + almoxFmtNum(e.r.qt) +
          "</td><td class=\"n\">—</td><td>" + esc(e.r.obra) + "</td></tr>";
      }).join("");
      var cab, dataTxt;
      if (dk === "sem-data") { dataTxt = "SEM DATA"; }
      else {
        var dd = new Date(Number(dk.slice(0, 4)), Number(dk.slice(5, 7)) - 1, Number(dk.slice(8, 10)));
        dataTxt = dk.slice(8, 10) + "/" + dk.slice(5, 7) + "/" + dk.slice(0, 4) + " — " + SEMANA[dd.getDay()];
      }
      cab = "<div class=\"dia\"><span>" + dataTxt + "</span><span>" + ordG.length + " insumo" + (ordG.length === 1 ? "" : "s") + " · " + nLanc + " lançamento" + (nLanc === 1 ? "" : "s") + "</span></div>";
      return "<div class=\"dia-wrap\">" + cab + "<table class=\"fx\">" + cgDia + "<tr><th>Insumo</th><th>Un.</th><th class=\"n\">Total do dia</th><th class=\"n\">Acumulado até este dia</th><th>Obras</th></tr>" + linhasD + linhasE +
        "<tr class=\"tot\"><td colspan=\"2\">TOTAL DO DIA " + dataTxt.split(" ")[0] + " (sem estornadas)</td><td colspan=\"3\" style=\"text-align:right\">" + totaisPorUnid(lista) + "</td></tr></table></div>";
    }).join("");
    corpo = "<h1>RESUMO DO ALMOXARIFADO POR DIA</h1><div class=\"meta\">" + meta + "</div>" + blocosDia +
      "<div class=\"dia geral\"><span>TOTAL GERAL DO PERÍODO (sem estornadas)</span><span>" + totaisPorUnid(regs) + "</span></div>" +
      "<div class=\"rod\">Cada dia mostra só o que saiu naquele dia. “Acumulado” soma, por insumo, do primeiro dia do relatório até aquele dia. Unidades diferentes nunca são somadas entre si. Retiradas estornadas não entram nos totais.</div>";
  } else {
    var porObra = {}, ordemO = [];
    regs.forEach(function (r) { var o = r.obra || "(sem obra)"; if (!porObra[o]) { porObra[o] = []; ordemO.push(o); } porObra[o].push(r); });
    var blocos = ordemO.map(function (o) {
      var lista = porObra[o];
      var linhas = lista.map(function (r) {
        return "<tr" + (r.estornado ? " class=\"est\"" : "") + "><td>" + almoxFmtData(r.data) + "</td><td>MP " + esc(r.mapaNum) + "</td><td>" + esc(r.itemNum) + "</td><td>" +
          esc(r.descricao + (r.detalhe ? " — " + r.detalhe : "")) + "</td><td>" + esc(r.unid) + "</td><td class=\"n\">" + (r.estornado ? "" : "<b>") + almoxFmtNum(r.qt) + (r.estornado ? "" : "</b>") +
          "</td><td>" + esc(r.por) + "</td><td>" + esc(r.obs) + (r.estornado ? " <span class=\"tg\">ESTORNADA</span>" : "") + "</td><td class=\"n\">" + almoxFmtNum(r.qtSolic) + "</td>" + celulaPend(r) + "</tr>";
      }).join("");
      return "<div class=\"ob\">OBRA: " + esc(o) + "</div><table class=\"fx\">" + cgDet + "<tr><th>Data</th><th>Mapa</th><th>Item</th><th>Insumo</th><th>Un.</th><th class=\"n\">Qtd. retirada</th><th>Retirado por</th><th>Observação</th><th class=\"n\">Solicitado</th><th class=\"n\">Pendente</th></tr>" +
        linhas + "<tr class=\"tot\"><td colspan=\"5\">TOTAL DA OBRA (sem estornadas)</td><td class=\"n\" colspan=\"5\" style=\"text-align:left\">Retirado: " + totaisPorUnid(lista) + " &nbsp;|&nbsp; Pendente: " + pendentesPorUnid(lista) + "</td></tr></table>";
    }).join("");
    corpo = "<h1>RELATÓRIO DE ATENDIMENTO PELO ALMOXARIFADO</h1><div class=\"meta\">" + meta + "</div>" + blocos +
      "<div class=\"rod\">Totais por unidade: unidades diferentes nunca são somadas entre si.<br>Pendente = Solicitado \u2212 total j\u00e1 retirado do item no almoxarifado (acumulado at\u00e9 esta retirada; estornadas n\u00e3o contam). N\u00e3o considera pedidos de compra.</div>";
  }
  return corpo;
  }
  var corpoFinal;
  if (f.visao === "todas") {
    corpoFinal = montarCorpo("detalhado") +
      "<div class=\"sec\" style=\"page-break-before:always\">" + montarCorpo("resumo") + "</div>" +
      "<div class=\"sec\" style=\"page-break-before:always\">" + montarCorpo("dia") + "</div>";
  } else {
    corpoFinal = montarCorpo(f.visao);
  }
  return "<!DOCTYPE html><html><head><meta charset=\"utf-8\"><title>Relatório do Almoxarifado</title>" + css + "</head><body>" + corpoFinal + "</body></html>";
}
function AlmoxRelatorioForm(_refAf) {
  var cadastros = _refAf.cadastros || {}, f = _refAf.f, setF = _refAf.setF;
  var upd = function (campo, valor) { setF(function (p) { var n = Object.assign({}, p); n[campo] = valor; return n; }); };
  var pill = function (ativo) {
    return { border: "1px solid " + (ativo ? "#2a5298" : "#bbb"), background: ativo ? "#2a5298" : "#fff", color: ativo ? "#fff" : "#333", borderRadius: 14, padding: "5px 12px", fontSize: 12, cursor: "pointer" };
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null,
    /*#__PURE__*/React.createElement("div", { style: SC.rDesc }, "Confere as retiradas do almoxarifado. Período vazio = traz TUDO."),
    /*#__PURE__*/React.createElement("label", { style: SC.lbl }, "DATA INICIAL DAS RETIRADAS (OPCIONAL)"),
    /*#__PURE__*/React.createElement("input", { "data-almox-f": "inicio", type: "date", style: SC.inp, value: f.inicio, onChange: function (e) { upd("inicio", e.target.value); } }),
    /*#__PURE__*/React.createElement("label", { style: SC.lbl }, "DATA FINAL DAS RETIRADAS (OPCIONAL)"),
    /*#__PURE__*/React.createElement("input", { "data-almox-f": "fim", type: "date", style: SC.inp, value: f.fim, onChange: function (e) { upd("fim", e.target.value); } }),
    /*#__PURE__*/React.createElement("label", { style: SC.lbl }, "OBRA (VAZIO = TODAS)"),
    /*#__PURE__*/React.createElement(AutocompleteInput, {
      value: f.obra,
      onChange: function (v) { upd("obra", v); },
      suggestions: cadastros.obras || [],
      placeholder: "BUSCAR OU DIGITAR OBRA...",
      showOnFocus: true,
      xStyle: { marginBottom: 4 },
      inputStyle: { border: "1.5px solid #dde1e9", borderRadius: 8, padding: "10px 12px", fontSize: 13, outline: "none" }
    }),
    /*#__PURE__*/React.createElement("label", { style: SC.lbl }, "INSUMO (VAZIO = TODOS)"),
    /*#__PURE__*/React.createElement("input", { "data-almox-f": "insumo", style: SC.inp, value: f.insumo, placeholder: "DIGITE PARTE DO NOME DO INSUMO...", onChange: function (e) { upd("insumo", e.target.value.toUpperCase()); } }),
    /*#__PURE__*/React.createElement("label", { style: SC.lbl }, "COMO MOSTRAR"),
    /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" } },
      /*#__PURE__*/React.createElement("span", { "data-almox-visao": "detalhado", onClick: function () { upd("visao", "detalhado"); }, style: pill(f.visao !== "resumo" && f.visao !== "dia" && f.visao !== "todas") }, "Detalhado (cada retirada)"),
      /*#__PURE__*/React.createElement("span", { "data-almox-visao": "resumo", onClick: function () { upd("visao", "resumo"); }, style: pill(f.visao === "resumo") }, "Resumo por insumo"),
      /*#__PURE__*/React.createElement("span", { "data-almox-visao": "dia", onClick: function () { upd("visao", "dia"); }, style: pill(f.visao === "dia") }, "Resumo por dia"),
      /*#__PURE__*/React.createElement("span", { "data-almox-visao": "todas", onClick: function () { upd("visao", "todas"); }, style: pill(f.visao === "todas") }, "Todas as vis\u00f5es (3 em 1)")),
    /*#__PURE__*/React.createElement("label", { style: SC.lbl }, "INCLUIR ESTORNADAS?"),
    /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" } },
      /*#__PURE__*/React.createElement("span", { "data-almox-est": "sim", onClick: function () { upd("estornadas", true); }, style: pill(f.estornadas !== false) }, "Sim, riscadas"),
      /*#__PURE__*/React.createElement("span", { "data-almox-est": "nao", onClick: function () { upd("estornadas", false); }, style: pill(f.estornadas === false) }, "Não")));
}

// ─── Map Editor ───────────────────────────────────────────────────────────────
