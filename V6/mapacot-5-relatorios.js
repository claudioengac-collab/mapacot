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
    onClick: onClose
  }, /*#__PURE__*/React.createElement(IcoClose, null))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      borderBottom: "2px solid #e8eaf0",
      background: "#f8f9fb"
    }
  }, [["periodo", "POR PERÍODO"], ["obra", "POR OBRA"], ["orcamento", "OR\xC7AMENTO"], ["insumo", "POR INSUMO"]].map(function (_ref13) {
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
  }).length, " MAPA(S) NO PER\xCDODO")), tab === "obra" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
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
  }).length, " MAPA(S)")), tab === "orcamento" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {style: SC.rDesc}, "Gera o relatório de orçamento de uma obra."), /*#__PURE__*/React.createElement("label", {style: SC.lbl}, "OBRA"), /*#__PURE__*/React.createElement(AutocompleteInput, {value: obra, onChange: setObra, suggestions: Object.keys(orcamentos), placeholder: "BUSCAR OU DIGITAR OBRA...", showOnFocus: true, xStyle: {marginBottom: 4}, inputStyle: {border: "1.5px solid #dde1e9", borderRadius: 8, padding: "10px 12px", fontSize: 13, outline: "none"}}), obra && /*#__PURE__*/React.createElement("div", {style: {fontSize: 11, color: "#888", marginTop: 4}}, orcamentos[obra] ? (orcamentos[obra].itens||orcamentos[obra]||[]).length + " ITEM(S)" : "SEM ORÇAMENTO")), tab === "insumo" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: SC.rDesc
  }, "Compara pre\xE7os de um insumo em todos os mapas."), /*#__PURE__*/React.createElement("label", {
    style: SC.lbl
  }, "INSUMO"), /*#__PURE__*/React.createElement(AutocompleteInput, {
    value: insumo,
    onChange: setInsumo,
    suggestions: cadastros.insumos || [],
    placeholder: "EX: TIJOLO, CIMENTO...",
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
  }), insumo && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#888",
      marginTop: 4
    }
  }, mapas.flatMap(function (m) {
    return (m.itens || []).filter(function (i) {
      return (i.descricao || "").toUpperCase().includes(insumo.toUpperCase());
    });
  }).length, " OCORR\xCANCIA(S)"))), /*#__PURE__*/React.createElement("div", {
    style: SC.mFtr
  }, /*#__PURE__*/React.createElement("button", {
    style: SC.btnSec,
    onClick: onClose
  }, "FECHAR"), /*#__PURE__*/React.createElement("button", {
    style: SC.btnPri,
    onClick: function onClick() {
      if (tab === "periodo") {
        if (!periodo.inicio || !periodo.fim) {
          alert("SELECIONE O PERÍODO.");
          return;
        }
        logEventoDiag("RELAT\u00d3RIO gerado: por PER\u00cdODO (" + periodo.inicio + " a " + periodo.fim + ")");
        gerarRelatorioPeriodo(mapasComCurrent, periodo.inicio, periodo.fim, orcamentos, associacoes);
      }
      if (tab === "obra") {
        if (!obra.trim()) {
          alert("INFORME A OBRA.");
          return;
        }
        logEventoDiag("RELAT\u00d3RIO gerado: por OBRA (" + obra + ")");
        gerarRelatorioObra(mapasComCurrent, obra, orcamentos, associacoes);
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
        } catch (erroRelOrc) {
          alert("ERRO ao gerar o relatório de orçamento:\n" + (erroRelOrc && erroRelOrc.message ? erroRelOrc.message : String(erroRelOrc)));
        }
      }
        if (tab === "insumo") {
        if (!insumo.trim()) {
          alert("INFORME O INSUMO.");
          return;
        }
        logEventoDiag("RELAT\u00d3RIO gerado: por INSUMO (" + insumo + ")");
        gerarRelatorioInsumo(mapasComCurrent, insumo);
      }
    }
  }, /*#__PURE__*/React.createElement(IcoPDF, null), " GERAR PDF")));
}

// ─── Map Editor ───────────────────────────────────────────────────────────────
