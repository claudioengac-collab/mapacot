function CadastrosModal(_ref11) {
  var _tabs$find;
  var open = _ref11.open,
    onClose = _ref11.onClose,
    cadastros = _ref11.cadastros,
    onAdd = _ref11.onAdd,
    onRemove = _ref11.onRemove,
    onEdit = _ref11.onEdit,
    onSetObs = _ref11.onSetObs || function(){},
    onSetSinonimos = _ref11.onSetSinonimos || function(){},
    orcamentos = _ref11.orcamentos || {},
    onImportarOrcamento = _ref11.onImportarOrcamento || null,
    onLimparOrcamento = _ref11.onLimparOrcamento || null,
    onGerenciarOrcamento = _ref11.onGerenciarOrcamento || null,
    mapas = _ref11.mapas || [];
  var _useState9 = useState("fornecedores"),
    _useState0 = _slicedToArray(_useState9, 2),
    tab = _useState0[0],
    setTab = _useState0[1];
  // FIX: estado local para o campo livre de observação por fornecedor (até 5000 caracteres)
  var _useStateObs = useState(null), obsAbertaPara = _slicedToArray(_useStateObs, 2)[0], setObsAbertaPara = _slicedToArray(_useStateObs, 2)[1];
  var _useStateObsTxt = useState(""), obsTextoEditando = _slicedToArray(_useStateObsTxt, 2)[0], setObsTextoEditando = _slicedToArray(_useStateObsTxt, 2)[1];
  // FIX: estado local para sinônimos por insumo — mesmo padrão da observação do fornecedor
  // acima (buffer local, só salva de verdade quando clica em SALVAR).
  var _useStateSin = useState(null), sinAbertoPara = _slicedToArray(_useStateSin, 2)[0], setSinAbertoPara = _slicedToArray(_useStateSin, 2)[1];
  var _useStateSinLista = useState([]), sinListaEditando = _slicedToArray(_useStateSinLista, 2)[0], setSinListaEditando = _slicedToArray(_useStateSinLista, 2)[1];
  var _useStateSinNovo = useState(""), sinNovoTexto = _slicedToArray(_useStateSinNovo, 2)[0], setSinNovoTexto = _slicedToArray(_useStateSinNovo, 2)[1];
  var _useState1 = useState(""),
    _useState10 = _slicedToArray(_useState1, 2),
    novo = _useState10[0],
    setNovo = _useState10[1];
  var _useState11 = useState(""),
    _useState12 = _slicedToArray(_useState11, 2),
    busca = _useState12[0],
    setBusca = _useState12[1];
  var _useState13 = useState(""),
    _useState14 = _slicedToArray(_useState13, 2),
    buscaDelay = _useState14[0],
    setBuscaDelay = _useState14[1];
  var _useState15 = useState(null),
    _useState16 = _slicedToArray(_useState15, 2),
    editIdx = _useState16[0],
    setEditIdx = _useState16[1];
  var _useState17 = useState(""),
    _useState18 = _slicedToArray(_useState17, 2),
    editVal = _useState18[0],
    setEditVal = _useState18[1];
  var editRef = useRef();
  var debRef = useRef();
  var handleBusca = function handleBusca(v) {
    setBusca(v);
    clearTimeout(debRef.current);
    debRef.current = setTimeout(function () {
      return setBuscaDelay(v);
    }, tab === "insumos" ? 300 : 0);
  };
  var startEdit = function startEdit(item, idx) {
    setEditIdx(idx);
    setEditVal(item);
    setTimeout(function () {
      var _editRef$current;
      return (_editRef$current = editRef.current) === null || _editRef$current === void 0 ? void 0 : _editRef$current.select();
    }, 0);
  };
  var cancelEdit = function cancelEdit() {
    setEditIdx(null);
    setEditVal("");
  };
  var confirmEdit = function confirmEdit(oldVal) {
    var v = normalize(editVal);
    if (v && v !== normalize(oldVal)){ if(estaEmUso(tab, oldVal, mapas)){ alert("NAO E POSSIVEL EDITAR: este item esta em uso em um ou mais mapas de cotacao."); cancelEdit(); return; } onEdit(tab, oldVal, v); }
    cancelEdit();
  };
  var tabs = [{
    id: "fornecedores",
    label: "FORNECEDORES",
    icon: "🏢"
  }, {
    id: "insumos",
    label: "INSUMOS",
    icon: "🧱"
  }, {
    id: "unidades",
    label: "UNIDADES",
    icon: "📐"
  }, {
    id: "obras",
    label: "OBRAS",
    icon: "🏗️"
  }];
  var lista = React.useMemo(function () {
    var b = normalize(buscaDelay);
    if (tab === "insumos" && !b) return [];
    return (cadastros[tab] || []).filter(function (x) {
      return normalize(x).includes(b);
    }).slice(0, 500);
  }, [cadastros, tab, buscaDelay]);
  var handleAdd = function handleAdd() {
    var v = normalize(novo);
    if (!v) return;
    onAdd(tab, v);
    setNovo("");
  };
  return /*#__PURE__*/React.createElement(Modal, {
    open: open,
    onClose: onClose,
    maxWidth: 560
  }, /*#__PURE__*/React.createElement("div", {
    style: SC.mHdr
  }, /*#__PURE__*/React.createElement("span", {
    style: SC.mTitle
  }, "BANCO DE CADASTROS"), /*#__PURE__*/React.createElement("button", {
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
      background: "#f5f7fb",
      borderBottom: "2px solid #e4e8f0"
    }
  }, tabs.map(function (t) {
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      onClick: function onClick() {
        setTab(t.id);
        setBusca("");
        setBuscaDelay("");
        setNovo("");
        cancelEdit();
      },
      style: {
        flex: 1,
        border: "none",
        background: "none",
        padding: "11px 6px",
        fontSize: 11,
        fontWeight: 700,
        cursor: "pointer",
        color: tab === t.id ? "#2a5298" : "#888",
        borderBottom: tab === t.id ? "2px solid #2a5298" : "2px solid transparent",
        marginBottom: -2,
        letterSpacing: 0.3
      }
    }, t.icon, " ", t.label, " ", /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        color: "#aaa"
      }
    }, "(", (cadastros[t.id] || []).length, ")"));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 22px 20px",
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(AutocompleteInput, {
    value: novo,
    onChange: setNovo,
    onCommit: handleAdd,
    suggestions: cadastros[tab] || [],
    placeholder: "ADICIONAR ".concat((_tabs$find = tabs.find(function (t) {
      return t.id === tab;
    })) === null || _tabs$find === void 0 ? void 0 : _tabs$find.label, "..."),
    xStyle: {
      flex: 1
    },
    inputStyle: {
      border: "1.5px solid #dde1e9",
      borderRadius: 8,
      padding: "9px 12px",
      fontSize: 13,
      outline: "none"
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: handleAdd,
    style: _objectSpread(_objectSpread({}, SC.btnPri), {}, {
      padding: "9px 16px",
      fontSize: 13
    })
  }, /*#__PURE__*/React.createElement(IcoPlus, {
    w: 14
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      background: "#f5f7fb",
      border: "1px solid #e4e8f0",
      borderRadius: 7,
      padding: "7px 11px",
      color: "#888"
    }
  }, /*#__PURE__*/React.createElement(IcoSearch, null), /*#__PURE__*/React.createElement("input", {
    value: busca,
    onChange: function onChange(e) {
      return handleBusca(e.target.value);
    },
    placeholder: "BUSCAR...",
    style: {
      border: "none",
      background: "transparent",
      fontSize: 13,
      fontFamily: "inherit",
      textTransform: "uppercase",
      outline: "none",
      flex: 1
    }
  }), busca && /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      setBusca("");
      setBuscaDelay("");
    },
    style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "#aaa",
      display: "flex"
    }
  }, /*#__PURE__*/React.createElement(IcoClose, null))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight: 320,
      overflowY: "auto",
      border: "1px solid #e4e8f0",
      borderRadius: 8,
      background: "#fff"
    }
  }, tab === "insumos" && !busca ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: 32,
      color: "#aaa",
      fontSize: 13
    }
  }, "\u270F\uFE0F DIGITE PARA BUSCAR INSUMOS") : lista.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: 32,
      color: "#aaa",
      fontSize: 13
    }
  }, "NENHUM CADASTRO", busca ? " ENCONTRADO" : "") : lista.map(function (item, i) {
    return /*#__PURE__*/React.createElement(React.Fragment, { key: i },
    /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "7px 12px",
        borderBottom: (i < lista.length - 1 && obsAbertaPara !== item && sinAbertoPara !== item) ? "1px solid #f0f2f6" : undefined,
        background: editIdx === i ? "#f0f4ff" : i % 2 === 0 ? "#fff" : "#fafbfd"
      }
    }, editIdx === i ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("input", {
      ref: editRef,
      value: editVal,
      onChange: function onChange(e) {
        var el=e.target, ss=el.selectionStart, se=el.selectionEnd;
        setEditVal(el.value.toUpperCase());
        requestAnimationFrame(function(){ el.selectionStart=ss; el.selectionEnd=se; });
      },
      onKeyDown: function onKeyDown(e) {
        if (e.key === "Enter") confirmEdit(item);
        if (e.key === "Escape") cancelEdit();
      },
      style: {
        flex: 1,
        border: "2px solid #2a5298",
        borderRadius: 6,
        padding: "5px 9px",
        fontSize: 13,
        fontFamily: "inherit",
        textTransform: "uppercase",
        outline: "none",
        background: "#fff"
      }
    }), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return confirmEdit(item);
      },
      style: {
        background: "#e8f5e9",
        border: "none",
        borderRadius: 5,
        padding: "5px 10px",
        color: "#2e7d32",
        cursor: "pointer",
        fontWeight: 700,
        fontSize: 12,
        whiteSpace: "nowrap"
      }
    }, "SALVAR"), /*#__PURE__*/React.createElement("button", {
      onClick: cancelEdit,
      style: {
        background: "#f5f5f5",
        border: "none",
        borderRadius: 5,
        padding: "5px 10px",
        color: "#888",
        cursor: "pointer",
        fontWeight: 700,
        fontSize: 12
      }
    }, "X")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        fontSize: 13,
        fontWeight: 500,
        color: "#1a1a2e"
      }
    }, item), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return startEdit(item, i);
      },
      title: "EDITAR",
      style: {
        background: "#eef2fb",
        border: "none",
        borderRadius: 5,
        padding: "4px 7px",
        color: "#2a5298",
        cursor: "pointer",
        display: "flex",
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement(IcoPencil, null)), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        if (window.confirm("EXCLUIR \"" + item + "\"?")){ if(estaEmUso(tab, item, mapas)){ alert("NAO E POSSIVEL EXCLUIR: este item esta em uso em um ou mais mapas de cotacao."); return; } onRemove(tab, item); }
      },
      title: "EXCLUIR",
      style: {
        background: "#fdecea",
        border: "none",
        borderRadius: 5,
        padding: "4px 7px",
        color: "#c0392b",
        cursor: "pointer",
        display: "flex",
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement(IcoTrash, null)),
    tab === "obras" && /*#__PURE__*/React.createElement("button", {
      onClick: function() { if (onImportarOrcamento) onImportarOrcamento(item); },
      title: orcamentos[item] ? "REIMPORTAR OR\xc7AMENTO" : "IMPORTAR OR\xc7AMENTO",
      style: { background: orcamentos[item] ? "#e8f6ee" : "#fff8e8", border: "none", borderRadius: 5, padding: "4px 7px", color: orcamentos[item] ? "#1a7843" : "#b87800", cursor: "pointer", fontSize: 10, fontWeight: 700, whiteSpace: "nowrap" }
    }, orcamentos[item] ? "\u2705 ORC." : "\ud83d\udcce ORC."),
    tab === "obras" && orcamentos[item] && /*#__PURE__*/React.createElement("button", {
      onClick: function() { if (window.confirm("REMOVER OR\xc7AMENTO DE \"" + item + "\"?")) { if (onLimparOrcamento) onLimparOrcamento(item); } },
      title: "REMOVER OR\xc7AMENTO",
      style: { background: "#fdeaea", border: "none", borderRadius: 5, padding: "4px 7px", color: "#c0392b", cursor: "pointer", fontSize: 10, fontWeight: 700, whiteSpace: "nowrap" }
    }, "\ud83d\uddd1 ORC."),
    tab === "obras" && orcamentos[item] && /*#__PURE__*/React.createElement("button", {
      onClick: function() { if (onGerenciarOrcamento) onGerenciarOrcamento(item); },
      style: { background: "#e8f0fe", border: "none", borderRadius: 5, padding: "4px 7px", color: "#1a56db", cursor: "pointer", fontSize: 10, fontWeight: 700, whiteSpace: "nowrap" }
    }, "\ud83d\udccb GER."),
    tab === "fornecedores" && /*#__PURE__*/React.createElement("button", {
      onClick: function() {
        if (obsAbertaPara === item) { setObsAbertaPara(null); return; }
        setObsAbertaPara(item);
        setObsTextoEditando((cadastros.fornecedorObs || {})[normalize(item)] || "");
      },
      title: (cadastros.fornecedorObs || {})[normalize(item)] ? "TEM OBSERVA\xc7\xc3O — CLIQUE PARA VER/EDITAR" : "ADICIONAR OBSERVA\xc7\xc3O",
      style: {
        background: (cadastros.fornecedorObs || {})[normalize(item)] ? "#fff4d6" : "#f5f5f5",
        border: "none", borderRadius: 5, padding: "4px 7px",
        color: (cadastros.fornecedorObs || {})[normalize(item)] ? "#b87800" : "#999",
        cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center"
      }
    }, "\ud83d\udcdd"),
    tab === "insumos" && (function() {
      var qtdSin = ((cadastros.insumoSinonimos || {})[normalize(item)] || []).length;
      return /*#__PURE__*/React.createElement("button", {
        onClick: function() {
          if (sinAbertoPara === item) { setSinAbertoPara(null); return; }
          setSinAbertoPara(item);
          setSinListaEditando(((cadastros.insumoSinonimos || {})[normalize(item)] || []).slice());
          setSinNovoTexto("");
        },
        title: qtdSin ? "TEM " + qtdSin + " SIN\xd4NIMO(S) — CLIQUE PARA VER/EDITAR" : "ENSINAR FORMAS ALTERNATIVAS DESSE INSUMO (SIN\xd4NIMOS)",
        style: {
          background: qtdSin ? "#e6f4ea" : "#f0eaff",
          border: "none", borderRadius: 5, padding: "4px 7px",
          color: qtdSin ? "#186818" : "#6b3fa0",
          cursor: "pointer", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 3, whiteSpace: "nowrap"
        }
      }, "\ud83d\udd17", qtdSin ? " " + qtdSin : "");
    })())),
    obsAbertaPara === item && /*#__PURE__*/React.createElement("div", {
      style: { padding: "10px 14px 14px", background: "#fffbf0", borderBottom: i < lista.length - 1 ? "1px solid #f0f2f6" : undefined, display: "flex", flexDirection: "column", gap: 6 }
    },
      /*#__PURE__*/React.createElement("textarea", {
        value: obsTextoEditando,
        onChange: function(e){ setObsTextoEditando(e.target.value.slice(0, 5000)); },
        maxLength: 5000,
        placeholder: "OBSERVA\xc7\xd5ES LIVRES SOBRE ESTE FORNECEDOR (AT\xc9 5000 CARACTERES)...",
        style: { width: "100%", minHeight: 90, resize: "vertical", border: "1px solid #e0d5b0", borderRadius: 6, padding: "8px 10px", fontSize: 12.5, fontFamily: "inherit", textTransform: "none", outline: "none" }
      }),
      /*#__PURE__*/React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
        /*#__PURE__*/React.createElement("span", { style: { fontSize: 10, color: "#aaa" } }, obsTextoEditando.length, " / 5000"),
        /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 6 } },
          /*#__PURE__*/React.createElement("button", {
            onClick: function(){ setObsAbertaPara(null); },
            style: { background: "#f5f5f5", border: "none", borderRadius: 5, padding: "5px 12px", color: "#888", cursor: "pointer", fontWeight: 700, fontSize: 11 }
          }, "CANCELAR"),
          /*#__PURE__*/React.createElement("button", {
            onClick: function(){ onSetObs(item, obsTextoEditando); setObsAbertaPara(null); },
            style: { background: "#e8f5e9", border: "none", borderRadius: 5, padding: "5px 12px", color: "#2e7d32", cursor: "pointer", fontWeight: 700, fontSize: 11 }
          }, "SALVAR OBSERVA\xc7\xc3O")
        )
      )
    ),
    sinAbertoPara === item && /*#__PURE__*/React.createElement("div", {
      style: { padding: "10px 14px 14px", background: "#faf9ff", borderBottom: i < lista.length - 1 ? "1px solid #f0f2f6" : undefined, display: "flex", flexDirection: "column", gap: 8 }
    },
      /*#__PURE__*/React.createElement("div", { style: { fontSize: 10.5, color: "#888" } },
        "Formas alternativas que este insumo j\xe1 apareceu em or\xe7amentos de fornecedores. Cole a frase exata, como veio."
      ),
      /*#__PURE__*/React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 } },
        sinListaEditando.length === 0
          ? /*#__PURE__*/React.createElement("span", { style: { fontSize: 11, color: "#bbb" } }, "Nenhum sin\xf4nimo cadastrado ainda.")
          : sinListaEditando.map(function(sin, si) {
              return /*#__PURE__*/React.createElement("span", {
                key: si,
                style: { background: "#fff", border: "1px solid #d0d0e0", borderRadius: 20, padding: "5px 8px 5px 12px", fontSize: 11.5, display: "flex", alignItems: "center", gap: 6 }
              },
                sin,
                /*#__PURE__*/React.createElement("button", {
                  onClick: function() { setSinListaEditando(sinListaEditando.filter(function(_, k) { return k !== si; })); },
                  style: { border: "none", background: "#eee", borderRadius: "50%", width: 16, height: 16, fontSize: 9, cursor: "pointer", lineHeight: 1, color: "#888" }
                }, "\u2715")
              );
            })
      ),
      /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 6 } },
        /*#__PURE__*/React.createElement("input", {
          value: sinNovoTexto,
          onChange: function(e) { setSinNovoTexto(e.target.value); },
          onKeyDown: function(e) {
            if (e.key === "Enter" && sinNovoTexto.trim()) {
              setSinListaEditando(sinListaEditando.concat([sinNovoTexto.trim().toUpperCase()]));
              setSinNovoTexto("");
            }
          },
          placeholder: "Digite outra forma que esse item pode aparecer...",
          style: { flex: 1, border: "1px solid #ccc", borderRadius: 6, padding: "6px 9px", fontSize: 12, fontFamily: "inherit", textTransform: "none", outline: "none" }
        }),
        /*#__PURE__*/React.createElement("button", {
          onClick: function() {
            if (!sinNovoTexto.trim()) return;
            setSinListaEditando(sinListaEditando.concat([sinNovoTexto.trim().toUpperCase()]));
            setSinNovoTexto("");
          },
          style: { background: "#f5a623", border: "none", borderRadius: 6, padding: "6px 12px", color: "#fff", fontWeight: 700, fontSize: 11, cursor: "pointer", whiteSpace: "nowrap" }
        }, "+ ADICIONAR")
      ),
      /*#__PURE__*/React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", gap: 6 } },
        /*#__PURE__*/React.createElement("button", {
          onClick: function() { setSinAbertoPara(null); },
          style: { background: "#f5f5f5", border: "none", borderRadius: 5, padding: "5px 12px", color: "#888", cursor: "pointer", fontWeight: 700, fontSize: 11 }
        }, "CANCELAR"),
        /*#__PURE__*/React.createElement("button", {
          onClick: function() { onSetSinonimos(item, sinListaEditando); setSinAbertoPara(null); },
          style: { background: "#e8f5e9", border: "none", borderRadius: 5, padding: "5px 12px", color: "#2e7d32", cursor: "pointer", fontWeight: 700, fontSize: 11 }
        }, "SALVAR SIN\xd4NIMOS")
      )
    ));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#aaa",
      textAlign: "right"
    }
  }, (cadastros[tab] || []).length, " CADASTRO(S) NO TOTAL")));
}


// ─── Modal Importar Orçamento ─────────────────────────────────────────────────
// --- Modal Gerenciar Orcamento ---
var calcConsumidoGer = function(idx, assocs, mpas, orcItens) {
  // FIX (preventivo — esta função não é chamada em nenhum lugar do sistema hoje, mas
  // corrigida por consistência): mesmo problema já encontrado e corrigido em
  // calcOrcComConsumo — comparava só por índice (quebra ao reimportar orçamento) e usava
  // qtCompra fixo em vez do menor valor entre qtCompra e a quantidade atual do item no mapa.
  var itemAtual = (orcItens && orcItens[idx]) || null;
  var total = 0;
  for(var _i=0;_i<assocs.length;_i++){
    var _a=assocs[_i];
    var indexBate = _a.orcItemIndex === idx && (!itemAtual || _a.orcItemCodigo === itemAtual.codigo);
    var codigoBateEmOutraPosicao = _a.orcItemIndex !== idx && itemAtual && _a.orcItemCodigo === itemAtual.codigo;
    if (!indexBate && !codigoBateEmOutraPosicao) continue;
    var _m=null;
    for(var _j=0;_j<mpas.length;_j++){ if(mpas[_j].id===_a.mapaId){ _m=mpas[_j]; break; } }
    if(!_m) continue;
    var _it=null; var _its=_m.itens||[];
    for(var _k=0;_k<_its.length;_k++){ if(_its[_k].id===_a.itemMapaId){ _it=_its[_k]; break; } }
    if(!_it||!_it.comprado) continue;
    var _qS=parseFloat(String(_a.qtCompra).replace(",","."))||0;
    var _qM=parseFloat(String(_it.qt).replace(",","."))||0;
    var _qA=(_qS>0&&_qS<_qM)?_qS:(_qM||_qS);
    total+=_qA*(parseFloat(_a.fator)||1);
  }
  return total;
};
