function ReportsModal(_ref12) {
  var _currentMapa = _ref12.currentMapa || null;
  var open = _ref12.open,
    onClose = _ref12.onClose,
    mapas = _ref12.mapas,
    cadastros = _ref12.cadastros,
    orcamentos = _ref12.orcamentos || {},
    associacoes = _ref12.associacoes || [];
  var mapasComCurrent = _currentMapa ? mapas.map(function(m){ return m.id === _currentMapa.id ? _currentMapa : m; }) : mapas;
  var _useState19 = useState("periodo"),
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
      borderBottom: "2px solid #e8eaf0",
      background: "#f8f9fb"
    }
  }, [["periodo", "POR PERÍODO"], ["obra", "POR OBRA"], ["orcamento", "OR\xC7AMENTO"], ["insumo", "POR INSUMO"], ["almox", "ALMOXARIFADO"]].map(function (_ref13) {
    var _ref14 = _slicedToArray(_ref13, 2),
      id = _ref14[0],
      lbl = _ref14[1];
    return /*#__PURE__*/React.createElement("button", {
      key: id,
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
  })), /*#__PURE__*/React.createElement("div", {
    style: SC.mFtr
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
