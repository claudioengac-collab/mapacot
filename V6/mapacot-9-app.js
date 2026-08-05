function MapCard(_ref16) {
  var _mapa$itens, _mapa$fornecedores;
  var mapa = _ref16.mapa,
    onOpen = _ref16.onOpen,
    onDelete = _ref16.onDelete,
    onDuplicate = _ref16.onDuplicate,
    orcamentos = _ref16.orcamentos || {},
    associacoes = _ref16.associacoes || [];
  var _useState41 = useState(false),
    _useState42 = _slicedToArray(_useState41, 2),
    confirm = _useState42[0],
    setConfirm = _useState42[1];
  var T = getTheme(mapa.corTema);
  return /*#__PURE__*/React.createElement("div", {
    style: _objectSpread(_objectSpread({}, SC.card), {}, {
      borderTop: "4px solid ".concat(T.hdr)
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: T.hdr,
      opacity: 0.8
    }
  }, /*#__PURE__*/React.createElement(IcoClip, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Syne',sans-serif",
      fontWeight: 700,
      fontSize: 15,
      color: "#0f1f3d",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, mapa.obra || "SEM OBRA"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "#7a8aaa",
      marginTop: 2,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, mapa.obra || "—")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      background: T.sub,
      color: "#444",
      borderRadius: 4,
      padding: "2px 8px",
      flexShrink: 0
    }
  }, "MP N\xBA ", mapa.numero || 1),
  mapa.duplicadoDe != null && /*#__PURE__*/React.createElement("span", {
    title: "C\u00f3pia do MP N\u00ba " + mapa.duplicadoDe,
    style: { fontSize:9, background:"#fff3cd", color:"#856404", borderRadius:4, padding:"1px 5px", marginLeft:4, fontWeight:600, cursor:"default" }
  }, "\uD83D\uDCCB c\u00f3pia")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: SC.badge
  }, ((_mapa$itens = mapa.itens) === null || _mapa$itens === void 0 ? void 0 : _mapa$itens.length) || 0, " ITENS"), /*#__PURE__*/React.createElement("span", {
    style: SC.badge
  }, ((_mapa$fornecedores = mapa.fornecedores) === null || _mapa$fornecedores === void 0 ? void 0 : _mapa$fornecedores.length) || 0, " FORN.")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#aab"
    }
  }, "CRIADO EM ", fmtDate(new Date(mapa.criadoEm)), mapa.responsavel && " \xB7 ".concat(mapa.responsavel)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 4
    }
  }, confirm ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "#e57373"
    }
  }, "EXCLUIR?"), /*#__PURE__*/React.createElement("button", {
    style: _objectSpread(_objectSpread({}, SC.btnSm), {}, {
      background: "#e57373",
      color: "#fff"
    }),
    onClick: function onClick() {
      return onDelete(mapa.id);
    }
  }, "SIM"), /*#__PURE__*/React.createElement("button", {
    style: _objectSpread(_objectSpread({}, SC.btnSm), {}, {
      background: "#eee",
      color: "#333"
    }),
    onClick: function onClick() {
      return setConfirm(false);
    }
  }, "N\xC3O")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    style: SC.btnOpen,
    onClick: function onClick() {
      return onOpen(mapa);
    }
  }, "ABRIR ", /*#__PURE__*/React.createElement(IcoChev, null)), /*#__PURE__*/React.createElement("button", {
    title: "ABRIR EM NOVA ABA",
    onClick: function onClick() {
      var url = window.location.pathname + "?mapa=" + mapa.id;
      window.open(url, "_blank");
    },
    style: {
      background: "#e8f0fe",
      border: "1.5px solid #c5d8f0",
      borderRadius: 8,
      padding: "6px 10px",
      cursor: "pointer",
      color: "#2a5298",
      fontSize: 15,
      display: "flex",
      alignItems: "center"
    }
  }, "↗"), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      logEventoDiag("PDF (\u00edcone lista) aberto: mapa " + (mapa.numero != null ? mapa.numero : "?"));
      return abrirPDF(buildMapaHTML(mapa, new Date(), orcamentos, associacoes));
    },
    style: _objectSpread(_objectSpread({}, SC.btnIco), {}, {
      background: "#fdecea",
      color: "#c0392b"
    })
  }, /*#__PURE__*/React.createElement(IcoPDF, null)), /*#__PURE__*/React.createElement("button", {
    title: "DUPLICAR MAPA",
    onClick: function onClick() { if (onDuplicate) onDuplicate(mapa); },
    style: {
      background: "#e6f4ea",
      border: "1.5px solid #a8d5b5",
      borderRadius: 8,
      padding: "6px 10px",
      cursor: "pointer",
      color: "#1a6e2e",
      display: "flex",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(IcoCopy, null)), /*#__PURE__*/React.createElement("button", {
    style: SC.btnIco,
    onClick: function onClick() {
      return setConfirm(true);
    }
  }, /*#__PURE__*/React.createElement(IcoTrash, null)))));
}

// ─── New Map Form ─────────────────────────────────────────────────────────────
function NewMapForm(_ref17) {
  var onSave = _ref17.onSave,
    onClose = _ref17.onClose,
    nextNumero = _ref17.nextNumero,
    cadastros = _ref17.cadastros,
    addCadastro = _ref17.addCadastro;
  var _useState43 = useState({
      nome: "",
      responsavel: "",
      obra: ""
    }),
    _useState44 = _slicedToArray(_useState43, 2),
    form = _useState44[0],
    setForm = _useState44[1];
  var set = function set(k, v) {
    return setForm(function (f) {
      return _objectSpread(_objectSpread({}, f), {}, _defineProperty({}, k, v));
    });
  };
  var valid = form.obra.trim().length > 0;
  var handleSave = function handleSave() {
    if (!valid) return;
    if (form.obra) addCadastro("obras", form.obra);
    onSave(_objectSpread(_objectSpread({}, emptyMap(nextNumero)), form));
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: SC.mHdr
  }, /*#__PURE__*/React.createElement("span", {
    style: SC.mTitle
  }, "NOVO MAPA DE COTA\xC7\xC3O"), /*#__PURE__*/React.createElement("button", {
    style: {
      background: "none",
      border: "none",
      color: "#999",
      cursor: "pointer"
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement(IcoClose, null))), /*#__PURE__*/React.createElement("div", {
    style: SC.mBody
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "#777",
      background: "#f5f7fb",
      borderRadius: 6,
      padding: "7px 11px",
      marginBottom: 6
    }
  }, "MP N\xBA: ", /*#__PURE__*/React.createElement("b", null, nextNumero), " \u2014 ATRIBU\xCDDO AUTOMATICAMENTE"), /*#__PURE__*/React.createElement("label", {
    style: SC.lbl
  }, "NOME DO MAPA ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#aaa",
      fontWeight: 400
    }
  }, "(OPCIONAL)")), /*#__PURE__*/React.createElement("input", {
    style: SC.inp,
    placeholder: "EX: COTA\xC7\xC3O ESTRUTURA MET\xC1LICA",
    value: form.nome,
    onChange: function onChange(e) {
      return set("nome", e.target.value.toUpperCase());
    },
    autoFocus: true
  }), /*#__PURE__*/React.createElement("label", {
    style: SC.lbl
  }, "OBRA / PROJETO ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#e57373"
    }
  }, "*")), /*#__PURE__*/React.createElement(AutocompleteInput, {
    value: form.obra,
    onChange: function onChange(v) {
      return set("obra", v);
    },
    suggestions: cadastros.obras || [],
    placeholder: "EX: COMPLEXO DA POL\xCDCIA CIVIL",
    showOnFocus: true,
    xStyle: {
      marginBottom: 2
    },
    inputStyle: {
      border: "1.5px solid #dde1e9",
      borderRadius: 8,
      padding: "10px 12px",
      fontSize: 13,
      outline: "none"
    }
  }), /*#__PURE__*/React.createElement("label", {
    style: SC.lbl
  }, "RESPONS\xC1VEL"), /*#__PURE__*/React.createElement("input", {
    style: SC.inp,
    placeholder: "NOME DO COMPRADOR",
    value: form.responsavel,
    onChange: function onChange(e) {
      return set("responsavel", e.target.value.toUpperCase());
    },
    onKeyDown: function onKeyDown(e) {
      return e.key === "Enter" && handleSave();
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: SC.mFtr
  }, /*#__PURE__*/React.createElement("button", {
    style: SC.btnSec,
    onClick: onClose
  }, "CANCELAR"), /*#__PURE__*/React.createElement("button", {
    style: _objectSpread(_objectSpread({}, SC.btnPri), {}, {
      opacity: valid ? 1 : 0.4
    }),
    onClick: handleSave,
    disabled: !valid
  }, "CRIAR MAPA")));
}

// ─── Main App ─────────────────────────────────────────────────────────────────
function Login(_ref18) {
  var onLogin = _ref18.onLogin;
  var _useState45 = useState(""),
    _useState46 = _slicedToArray(_useState45, 2),
    user = _useState46[0],
    setUser = _useState46[1];
  var _useState47 = useState(""),
    _useState48 = _slicedToArray(_useState47, 2),
    pass = _useState48[0],
    setPass = _useState48[1];
  var _useState49 = useState(false),
    _useState50 = _slicedToArray(_useState49, 2),
    err = _useState50[0],
    setErr = _useState50[1];
  var submit = function submit() {
    if (user.trim().toUpperCase() === "CLAUDIO" && pass === "7952") {
      sessionStorage.setItem("mapacot_auth", "1");
      window.__mapacotUsuario = "CLAUDIO";
      onLogin();
    } else {
      setErr(true);
      setTimeout(function () {
        return setErr(false);
      }, 2500);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100vh",
      background: "#0f1f3d",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#fff",
      borderRadius: 18,
      padding: "40px 32px",
      maxWidth: 360,
      width: "100%",
      boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#f0a500",
      color: "#0f1f3d",
      width: 64,
      height: 64,
      borderRadius: 16,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 22,
      fontWeight: 900,
      margin: "0 auto 20px",
      fontFamily: "'Syne',sans-serif"
    }
  }, "MC"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Syne',sans-serif",
      fontWeight: 800,
      fontSize: 20,
      color: "#0f1f3d",
      marginBottom: 4
    }
  }, "MAPACOT"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "#888",
      marginBottom: 6,
      letterSpacing: 0.5
    }
  }, "SISTEMA DE COTA\xC7\xC3O"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: "#1d4ed8",
      background: "#eff6ff",
      border: "1px solid #bfdbfe",
      borderRadius: 6,
      padding: "3px 10px",
      display: "inline-block",
      marginBottom: 22,
      letterSpacing: 0.5
    }
  }, "VERS\xC3O 5.0 \u2014 HIST\xD3RICO 7 DIAS"), /*#__PURE__*/React.createElement("div", {
    onClick: function () { window.abrirDiagnosticoMapacot(); },
    style: {
      fontSize: 10,
      color: "#6b7280",
      textDecoration: "underline",
      cursor: "pointer",
      marginBottom: 18
    }
  }, "DIAGN\xD3STICO"), /*#__PURE__*/React.createElement("input", {
    value: user,
    onChange: function onChange(e) {
      return setUser(e.target.value.toUpperCase());
    },
    onKeyDown: function onKeyDown(e) {
      return e.key === "Enter" && submit();
    },
    placeholder: "USU\xC1RIO",
    style: {
      width: "100%",
      padding: "12px 16px",
      borderRadius: 10,
      border: "1.5px solid #dde",
      fontSize: 14,
      marginBottom: 12,
      outline: "none",
      fontFamily: "inherit",
      textTransform: "uppercase",
      boxSizing: "border-box"
    }
  }), /*#__PURE__*/React.createElement("input", {
    type: "password",
    value: pass,
    onChange: function onChange(e) {
      return setPass(e.target.value);
    },
    onKeyDown: function onKeyDown(e) {
      return e.key === "Enter" && submit();
    },
    placeholder: "SENHA",
    style: {
      width: "100%",
      padding: "12px 16px",
      borderRadius: 10,
      border: "1.5px solid #dde",
      fontSize: 14,
      marginBottom: 16,
      outline: "none",
      fontFamily: "inherit",
      boxSizing: "border-box"
    }
  }), err && /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#c0392b",
      fontSize: 13,
      marginBottom: 12,
      fontWeight: 600
    }
  }, "USU\xC1RIO OU SENHA INCORRETOS"), /*#__PURE__*/React.createElement("button", {
    onClick: submit,
    style: {
      width: "100%",
      padding: "13px",
      borderRadius: 10,
      background: "#2a5298",
      color: "#fff",
      border: "none",
      fontSize: 15,
      fontWeight: 700,
      cursor: "pointer",
      fontFamily: "inherit",
      letterSpacing: 0.5
    }
  }, "ENTRAR")));
}
var estaEmUso = function(tipo, valor, mapas) {
  var v = normalize(valor);
  for(var _i=0;_i<mapas.length;_i++){
    var _m=mapas[_i];
    if(tipo==="obras" && normalize(_m.obra||"")===v) return true;
    if(tipo==="unidades"){
      var _its=_m.itens||[];
      for(var _j=0;_j<_its.length;_j++){ if(normalize(_its[_j].unid||"")===v) return true; }
    }
    if(tipo==="fornecedores"){
      var _fns=_m.fornecedores||[];
      for(var _j=0;_j<_fns.length;_j++){ if(normalize(_fns[_j].nome||"")===v) return true; }
    }
    if(tipo==="insumos"){
      var _its2=_m.itens||[];
      for(var _j=0;_j<_its2.length;_j++){ if(normalize(_its2[_j].descricao||"")===v) return true; }
    }
  }
  return false;
};
var calcOrcComConsumo = function(orc, obra, assocs, mpas) {
  if(!orc) return orc;
  var base = Array.isArray(orc) ? orc : (orc.itens||[]);
  var novos = [];
  for(var _i=0;_i<base.length;_i++){
    var _it=base[_i]; var _total=0;
    for(var _j=0;_j<assocs.length;_j++){
      var _a=assocs[_j];
      // FIX: mesmo padrão já usado em outras funções (ex: calcResMulti) — tenta o índice
      // primeiro, mas só aceita se o código também bater; senão, procura pelo código em
      // qualquer posição. Sem isso, depois de reimportar um orçamento (mudando a ordem dos
      // itens), o "consumido" ficava atribuído ao item errado.
      var indexBate = _a.orcItemIndex === _i && _a.orcItemCodigo === _it.codigo;
      var codigoBateEmOutraPosicao = _a.orcItemIndex !== _i && _a.orcItemCodigo === _it.codigo;
      if (!indexBate && !codigoBateEmOutraPosicao) continue;
      var _m=null;
      for(var _k=0;_k<mpas.length;_k++){ if(mpas[_k].id===_a.mapaId){ _m=mpas[_k]; break; } }
      if(!_m||_m.obra!==obra) continue;
      var _itm=null; var _its=_m.itens||[];
      for(var _l=0;_l<_its.length;_l++){ if(_its[_l].id===_a.itemMapaId){ _itm=_its[_l]; break; } }
      if(!_itm||!_itm.comprado) continue;
      var _qS=parseFloat(String(_a.qtCompra).replace(",","."))||0;
      var _qM=parseFloat(String(_itm.qt).replace(",","."))||0;
      var _qA=(_qS>0&&_qS<_qM)?_qS:(_qM||_qS);
      _total+=_qA*(parseFloat(_a.fator)||1);
    }
    novos.push(Object.assign({},_it,{consumido:_total}));
  }
  if(Array.isArray(orc)) return novos;
  return Object.assign({},orc,{itens:novos});
};
function App() {
  var _useState51 = useState([]),
    _useState52 = _slicedToArray(_useState51, 2),
    mapas = _useState52[0],
    setMapas = _useState52[1];
  var _useState53 = useState({
      obras: [],
      insumos: [],
      unidades: DEFAULT_UNIDADES,
      fornecedores: []
    }),
    _useState54 = _slicedToArray(_useState53, 2),
    cadastros = _useState54[0],
    setCadastros = _useState54[1];
  // FIX: versão conhecida dos cadastros, guardada num ref (não um state) DE PROPÓSITO — usar
  // state aqui disparia o useEffect de auto-save de cadastros a cada atualização de versão,
  // criando um ciclo (salva → atualiza versão → dispara salvar de novo → ...). Um ref atualiza
  // sem re-render nem disparar efeitos, evitando esse problema.
  var versaoCadastrosRef = useRef(null);
  // FIX: mesma proteção contra múltiplas abas, agora para Insumos (que usa uma função de
  // salvamento separada, sbSaveInsumos, diferente da usada por obras/fornecedores/unidades)
  var versaoInsumosRef = useRef(null);
  var _useState55 = useState(true),
    _useState56 = _slicedToArray(_useState55, 2),
    loading = _useState56[0],
    setLoading = _useState56[1];
  var _useState57 = useState(false),
    _useState58 = _slicedToArray(_useState57, 2),
    showNew = _useState58[0],
    setShowNew = _useState58[1];
  var _useState59 = useState(false),
    _useState60 = _slicedToArray(_useState59, 2),
    showRep = _useState60[0],
    setShowRep = _useState60[1];
  var _useState61 = useState(false),
    _useState62 = _slicedToArray(_useState61, 2),
    showCad = _useState62[0],
    setShowCad = _useState62[1];
  var _useState63 = useState(null),
    _useState64 = _slicedToArray(_useState63, 2),
    current = _useState64[0],
    setCurrent = _useState64[1];
  var _useState65 = useState(""),
    _useState66 = _slicedToArray(_useState65, 2),
    search = _useState66[0],
    setSearch = _useState66[1];
  var _useStateInsumo = useState(""),
    _useStateInsumo2 = _slicedToArray(_useStateInsumo, 2),
    searchInsumo = _useStateInsumo2[0],
    setSearchInsumo = _useStateInsumo2[1];
  var _useStateCadOk = useState(false),
    cadastrosOk = _slicedToArray(_useStateCadOk, 2)[0],
    setCadastrosOk = _slicedToArray(_useStateCadOk, 2)[1];
  var _useStateOrc = React.useState({}),
    orcamentos = _slicedToArray(_useStateOrc, 2)[0],
    setOrcamentos = _slicedToArray(_useStateOrc, 2)[1];
  var _useStateAssoc = React.useState([]),
    associacoes = _slicedToArray(_useStateAssoc, 2)[0],
    setAssociacoes = _slicedToArray(_useStateAssoc, 2)[1];
  var _useStateShowImp = React.useState(false),
    showImportOrc = _slicedToArray(_useStateShowImp, 2)[0],
    setShowImportOrc = _slicedToArray(_useStateShowImp, 2)[1];
  var _useStateObraImp = React.useState(null),
    obraImportando = _slicedToArray(_useStateObraImp, 2)[0],
    setObraImportando = _slicedToArray(_useStateObraImp, 2)[1];
  var _useStateShowGer = React.useState(false),
    showGerenciarOrc = _slicedToArray(_useStateShowGer, 2)[0],
    setShowGerenciarOrc = _slicedToArray(_useStateShowGer, 2)[1];
  var _useStateObraGer = React.useState(null),
    obraGerenciando = _slicedToArray(_useStateObraGer, 2)[0],
    setObraGerenciando = _slicedToArray(_useStateObraGer, 2)[1];

  // Load all data
  useEffect(function () {
    _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8() {
      var mapasData, cad, insumos, _t, _t2, _t3;
      return _regenerator().w(function (_context8) {
        while (1) switch (_context8.p = _context8.n) {
          case 0:
            _context8.p = 0;
            _context8.n = 1;
            return sbGetMapas();
          case 1:
            mapasData = _context8.v;
            if (mapasData.length) {
              setMapas(mapasData);
              var urlParams = new URLSearchParams(window.location.search);
              var mapaId = urlParams.get("mapa");
              if (mapaId) {
                var mapaAlvo = mapasData.find(function(m){ return m.id === mapaId; });
                if (mapaAlvo) setCurrent(mapaAlvo);
              }
            }
            _context8.n = 3;
            break;
          case 2:
            _context8.p = 2;
            _t = _context8.v;
            window.avisarErroSalvamento('Não foi possível carregar os mapas. Verifique sua conexão.');
          case 3:
            _context8.p = 3;
            _context8.n = 4;
            return sbGetCadastros();
          case 4:
            cad = _context8.v;
            if (cad) {
              setCadastros(function (prev) {
                return {
                  obras: cad.obras || [],
                  insumos: [],
                  unidades: cad.unidades || DEFAULT_UNIDADES,
                  fornecedores: cad.fornecedores || [],
                  fornecedorObs: cad.fornecedorObs || {} // FIX: mesmo bug de sbSaveCadastros — o
                  // carregamento também reconstruía o objeto só com campos citados aqui,
                  // descartando fornecedorObs vindo do servidor
                };
              });
              versaoCadastrosRef.current = cad._versaoServidor; // FIX: guarda a versão no ref (ver declaração)
              setCadastrosOk(true);
            }
            _context8.n = 6;
            break;
          case 5:
            _context8.p = 5;
            _t2 = _context8.v;
          case 6:
            setLoading(false);
            // Load insumos in background (separate row, large data)
            _context8.p = 7;
            _context8.n = 8;
            return sbGetInsumos();
          case 8:
            insumos = _context8.v;
            versaoInsumosRef.current = insumos.versao; // FIX: guarda a versão para o controle de múltiplas abas
            if (insumos.lista.length) setCadastros(function (prev) {
              return _objectSpread(_objectSpread({}, prev), {}, {
                insumos: insumos.lista
              });
            });
            _context8.n = 10;
            break;
          case 9:
            _context8.p = 9;
            _t3 = _context8.v;
          case 10:
            return _context8.a(2);
        }
      }, _callee8, null, [[7, 9], [3, 5], [0, 2]]);
    }))();
  }, []);

  // Carregar associações em background
  React.useEffect(function() {
    sbCarregarAssociacoes().then(function(lista){ if(lista.length) setAssociacoes(lista); }).catch(function(){});
  }, []);
  // Carregar orçamentos de todas as obras
  React.useEffect(function() {
    if (!cadastros.obras || !cadastros.obras.length) return;
    cadastros.obras.forEach(function(obra) {
      sbCarregarOrcamento(obra).then(function(dados) {
        if (dados) setOrcamentos(function(prev) {
          return Object.assign({}, prev, _defineProperty({}, obra, zerarConsumido(dados)));
        });
      }).catch(function(){ window.avisarErroSalvamento('Não foi possível salvar o cadastro. Verifique sua conexão.'); });
    });
  }, [cadastros.obras]);

  // Persist cadastros
  useEffect(function () {
    if (!loading && cadastrosOk) {
      sbSaveCadastros(Object.assign({}, cadastros, { _versaoServidor: versaoCadastrosRef.current }))
        .then(function(novaVersao){ versaoCadastrosRef.current = novaVersao; }) // FIX: atualiza via
        // ref (não state) para não disparar este mesmo useEffect de novo — evita loop
        .catch(function(e){
          if (e && e.isVersionConflict) window.avisarConflitoVersaoUmaVez('cadastros', e.message);
          else window.avisarErroSalvamento('Não foi possível salvar os cadastros. Verifique sua conexão.');
        });
    }
  }, [cadastros, loading, cadastrosOk]);

  // ── Funções de orçamento ──────────────────────────────────────────────────
  var saveOrcamento = React.useCallback(function(obraId, dados) {
    logEventoDiag("OR\u00c7AMENTO salvo: obra " + obraId + " (" + ((dados && dados.itens) ? dados.itens.length : 0) + " itens)");
    setOrcamentos(function(prev){ return Object.assign({}, prev, _defineProperty({}, obraId, dados)); });
    return sbSaveOrcamento(obraId, dados).catch(function(){ window.avisarErroSalvamento('Não foi possível salvar o orçamento. Verifique sua conexão.'); });
  }, []);

  var limparOrcamento = React.useCallback(function(obraId) {
    logEventoDiag("OR\u00c7AMENTO exclu\u00eddo: obra " + obraId);
    setOrcamentos(function(prev){ var n = Object.assign({}, prev); delete n[obraId]; return n; });
    // FIX: sem isto, as associações feitas entre itens do mapa e itens deste orçamento ficavam
    // órfãs no banco depois de remover o orçamento. Se a mesma obra recebesse um orçamento NOVO
    // depois, essas associações antigas podiam se conectar por engano a itens completamente
    // diferentes do orçamento novo (mesmo tipo de problema já corrigido em calcOrcComConsumo).
    var idsMapasDaObra = mapas.filter(function(m){ return m.obra === obraId; }).map(function(m){ return m.id; });
    if (idsMapasDaObra.length) {
      setAssociacoes(function(prevAssoc){
        var lista = prevAssoc.filter(function(a){ return idsMapasDaObra.indexOf(a.mapaId) < 0; });
        sbSaveAssociacoes(lista).catch(function(){ window.avisarErroSalvamento('Não foi possível salvar as associações. Verifique sua conexão.'); });
        return lista;
      });
    }
    sbDeleteOrcamento(obraId).catch(function(){ window.avisarErroSalvamento('Não foi possível excluir o orçamento. Verifique sua conexão.'); });
  }, [mapas]);

  var criarAssociacao = React.useCallback(function(assoc) {
    setAssociacoes(function(prev) {
      var nova = Object.assign({}, assoc, { criadoEm: new Date().toISOString() });
      var lista = [].concat(prev.filter(function(a){ return a.id !== nova.id; }), [nova]);
      sbSaveAssociacoes(lista).catch(function(){ window.avisarErroSalvamento('Não foi possível salvar a associação. Verifique sua conexão.'); });
      return lista;
    });
  }, []);

  var removerAssociacao = React.useCallback(function(assocId) {
    setAssociacoes(function(prev) {
      var lista = prev.filter(function(a){ return a.id !== assocId; });
      sbSaveAssociacoes(lista).catch(function(){ window.avisarErroSalvamento('Não foi possível salvar a associação. Verifique sua conexão.'); });
      return lista;
    });
  }, []);

  var substituirAssociacoes = React.useCallback(function(idsRemover, novasAssocs) {
    setAssociacoes(function(prev) {
      var lista = prev.filter(function(a){ return idsRemover.indexOf(a.id) < 0; });
      novasAssocs.forEach(function(assoc) {
        var nova = Object.assign({}, assoc, { criadoEm: new Date().toISOString() });
        lista = lista.filter(function(a){ return a.id !== nova.id; }).concat([nova]);
      });
      sbSaveAssociacoes(lista).catch(function(){ window.avisarErroSalvamento('Não foi possível salvar a associação. Verifique sua conexão.'); });
      return lista;
    });
  }, []);

  var addCadastro = useCallback(function (tipo, valor) {
    var v = normalize(valor);
    if (!v) return;
    logEventoDiag("CADASTRO adicionado (" + tipo + "): " + v);
    setCadastros(function (prev) {
      var lista = prev[tipo] || [];
      if (lista.some(function (x) {
        return normalize(x) === v;
      })) return prev;
      var updated = _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, tipo, [].concat(_toConsumableArray(lista), [v]).sort()));
      if (tipo === "insumos") sbSaveInsumos(updated.insumos, versaoInsumosRef.current).then(function(novaVersao){
        versaoInsumosRef.current = novaVersao;
      }).catch(function (e) {
        if (e && e.isVersionConflict) window.avisarConflitoVersaoUmaVez('insumos', e.message);
        else window.avisarErroSalvamento('Não foi possível salvar o insumo. Verifique sua conexão.');
      });
      else sbSaveCadastros(Object.assign({}, updated, { _versaoServidor: versaoCadastrosRef.current })).then(function(novaVersao){
        versaoCadastrosRef.current = novaVersao;
      }).catch(function (e) {
        if (e && e.isVersionConflict) window.avisarConflitoVersaoUmaVez('cadastros', e.message);
        else window.avisarErroSalvamento('Não foi possível salvar o cadastro no servidor. Verifique sua conexão e tente novamente.');
      });
      return updated;
    });
  }, []);
  var removeCadastro = useCallback(function (tipo, valor) {
    if(estaEmUso(tipo, valor, mapas)){ alert("NAO E POSSIVEL EXCLUIR: este item esta em uso em um ou mais mapas de cotacao."); return; }
    logEventoDiag("CADASTRO removido (" + tipo + "): " + valor);
    setCadastros(function (prev) {
      var updated = _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, tipo, (prev[tipo] || []).filter(function (x) {
        return normalize(x) !== normalize(valor);
      })));
      // FIX: ao excluir um FORNECEDOR, remove também a observação salva dele — senão fica
      // como dado órfão no banco, sem nenhum fornecedor visível para acessá-la.
      if (tipo === 'fornecedores' && prev.fornecedorObs && prev.fornecedorObs[normalize(valor)]) {
        var novoObs = _objectSpread({}, prev.fornecedorObs);
        delete novoObs[normalize(valor)];
        updated.fornecedorObs = novoObs;
      }
      if (tipo === 'insumos') sbSaveInsumos(updated.insumos, versaoInsumosRef.current).then(function(novaVersao){
        versaoInsumosRef.current = novaVersao;
      }).catch(function(e){
        if (e && e.isVersionConflict) window.avisarConflitoVersaoUmaVez('insumos', e.message);
        else window.avisarErroSalvamento('Não foi possível salvar os insumos. Verifique sua conexão.');
      });
      else sbSaveCadastros(Object.assign({}, updated, { _versaoServidor: versaoCadastrosRef.current })).then(function(novaVersao){
        versaoCadastrosRef.current = novaVersao;
      }).catch(function(e){
        if (e && e.isVersionConflict) window.avisarConflitoVersaoUmaVez('cadastros', e.message);
        else window.avisarErroSalvamento('Não foi possível salvar o cadastro. Verifique sua conexão.');
      });
      return updated;
    });
  }, [mapas]);
  var editCadastro = useCallback(function (tipo, oldVal, newVal) {
    if(estaEmUso(tipo, oldVal, mapas)){ alert("NAO E POSSIVEL EDITAR: este item esta em uso em um ou mais mapas de cotacao."); return; }
    var vOld = normalize(oldVal),
      vNew = normalize(newVal);
    if (!vNew || vOld === vNew) return;
    setCadastros(function (prev) {
      var lista = (prev[tipo] || []).map(function (x) {
        return normalize(x) === vOld ? vNew : x;
      });
      var updated = _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, tipo, _toConsumableArray(new Set(lista)).sort()));
      // FIX: ao renomear um FORNECEDOR, migra a observação salva (se houver) do nome antigo
      // para o novo — senão ela ficaria "presa" no nome antigo, inacessível.
      if (tipo === 'fornecedores' && prev.fornecedorObs && prev.fornecedorObs[vOld]) {
        var novoObs = _objectSpread({}, prev.fornecedorObs);
        novoObs[vNew] = novoObs[vOld];
        delete novoObs[vOld];
        updated.fornecedorObs = novoObs;
      }
      if (tipo === 'insumos') sbSaveInsumos(updated.insumos, versaoInsumosRef.current).then(function(novaVersao){
        versaoInsumosRef.current = novaVersao;
      }).catch(function(e){
        if (e && e.isVersionConflict) window.avisarConflitoVersaoUmaVez('insumos', e.message);
        else window.avisarErroSalvamento('Não foi possível salvar os insumos. Verifique sua conexão.');
      });
      else sbSaveCadastros(Object.assign({}, updated, { _versaoServidor: versaoCadastrosRef.current })).then(function(novaVersao){
        versaoCadastrosRef.current = novaVersao;
      }).catch(function(e){
        if (e && e.isVersionConflict) window.avisarConflitoVersaoUmaVez('cadastros', e.message);
        else window.avisarErroSalvamento('Não foi possível salvar o cadastro. Verifique sua conexão.');
      });
      return updated;
    });
  }, [mapas]);
  // FIX: observação livre por fornecedor (até 5000 caracteres) — guardada à parte da lista de
  // nomes já existente, sem alterar nada da estrutura atual. Usa o mesmo sbSaveCadastros (já
  // ajustado acima para incluir este campo).
  var setObsFornecedor = useCallback(function (nomeFornecedor, texto) {
    var nome = normalize(nomeFornecedor);
    if (!nome) return;
    var textoLimitado = String(texto || '').slice(0, 5000);
    setCadastros(function (prev) {
      var obsAtual = prev.fornecedorObs || {};
      var novoObs = _objectSpread({}, obsAtual);
      if (textoLimitado.trim()) novoObs[nome] = textoLimitado;
      else delete novoObs[nome]; // texto vazio remove a observação, não deixa lixo salvo
      var updated = _objectSpread(_objectSpread({}, prev), {}, { fornecedorObs: novoObs });
      sbSaveCadastros(Object.assign({}, updated, { _versaoServidor: versaoCadastrosRef.current })).then(function(novaVersao){
        versaoCadastrosRef.current = novaVersao;
      }).catch(function(e){
        if (e && e.isVersionConflict) window.avisarConflitoVersaoUmaVez('cadastros', e.message);
        else window.avisarErroSalvamento('Não foi possível salvar a observação. Verifique sua conexão.');
      });
      return updated;
    });
  }, []);
  var handleCreate = /*#__PURE__*/function () {
    var _ref20 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(m) {
      return _regenerator().w(function (_context9) {
        while (1) switch (_context9.n) {
          case 0:
            logEventoDiag("NOVO MAPA criado: MP " + (m.numero != null ? m.numero : "?") + " — obra: " + (m.obra || "(sem obra)"));
            setMapas(function (prev) {
              return [m].concat(_toConsumableArray(prev));
            });
            sbSaveMapa(m).then(function(novaVersao){
              var comVersao = Object.assign({}, m, { _versaoServidor: novaVersao });
              setMapas(function(prev){ return prev.map(function(x){ return x.id === m.id ? comVersao : x; }); });
              setCurrent(function(c){ return (c && c.id === m.id) ? comVersao : c; });
            }).catch(function(){ window.avisarErroSalvamento('Não foi possível salvar o mapa. Verifique sua conexão.'); });
            setShowNew(false);
            setCurrent(m);
          case 1:
            return _context9.a(2);
        }
      }, _callee9);
    }));
    return function handleCreate(_x5) {
      return _ref20.apply(this, arguments);
    };
  }();
  var handleDelete = function handleDelete(id) {
    // ── V4 CSS — Verificar pedidos vinculados antes de excluir ──────────────
    // BUG4 FIX: indicador visual de verificação
    var mapaEl = document.querySelector('[data-mapa-id="'+id+'"]');
    if(mapaEl) mapaEl.style.opacity = '0.5';
    var __mapaAlvoExclusao = mapas.find(function(x){ return x.id === id; });
    logEventoDiag("EXCLUIR solicitado: mapa " + (__mapaAlvoExclusao ? __mapaAlvoExclusao.numero : id));

    fetch(SUPABASE_URL + '/rest/v1/pedidos?select=numero,status&mapa_id=eq.' + id + '&status=neq.cancelado', { headers: SB, cache: 'no-store' })
      .then(function(r){
        // BUG5 FIX: Supabase pode retornar status OK mas JSON inválido
        if(!r.ok) throw new Error('HTTP ' + r.status);
        return r.json().catch(function(){ throw new Error('Resposta inválida do servidor'); });
      })
      .then(function(pedidosVinc){
        if(mapaEl) mapaEl.style.opacity = '';
        if (pedidosVinc && pedidosVinc.length > 0) {
          alert('\u274C Este mapa n\u00e3o pode ser exclu\u00eddo!\n\nExistem ' + pedidosVinc.length + ' pedido(s) de compra vinculado(s).\n\nCancele ou exclua os pedidos antes de excluir o mapa.\n\nPedidos: ' + pedidosVinc.map(function(p){ return 'PO-'+String(p.numero).padStart(3,'0')+' ('+p.status+')'; }).join(', '));
          return;
        }
        // BUG2+3 FIX: deletar no banco PRIMEIRO, só depois atualizar a tela
        sbDeleteMapa(id)
          .then(function(){
            logEventoDiag("\u2714 EXCLU\u00cdDO mapa " + (__mapaAlvoExclusao ? __mapaAlvoExclusao.numero : id));
            setMapas(function(prev){ return prev.filter(function(m){ return m.id !== id; }); });
          })
          .catch(function(){
            if(mapaEl) mapaEl.style.opacity = '';
            alert('\u274C Erro ao excluir o mapa. Verifique sua conex\u00e3o e tente novamente.');
          });
      })
      .catch(function(){
        // BUG1 FIX: falha de rede → BLOQUEAR por segurança, nunca permitir
        if(mapaEl) mapaEl.style.opacity = '';
        alert('\u26A0\uFE0F N\u00e3o foi poss\u00edvel verificar os pedidos vinculados.\n\nVerifique sua conex\u00e3o e tente novamente.\n\nA exclus\u00e3o foi cancelada por seguran\u00e7a.');
      });
  };
  var handleSave = function handleSave(updated) {
    setMapas(function (prev) {
      return prev.map(function (m) {
        return m.id === updated.id ? updated : m;
      });
    });
    setCurrent(updated);
    // FIX: agora RETORNA a Promise do salvamento (em vez de só disparar e esquecer) — necessário
    // para o mecanismo de "flush" ao sair do mapa poder ESPERAR o salvamento de verdade completar
    // antes de navegar para fora, garantindo que os dados mais recentes não se percam.
    return sbSaveMapa(updated).then(function(novaVersao){
      // FIX: propaga a nova versão salva de volta ao estado local — sem isso, a proteção
      // contra múltiplas abas ficaria "presa" comparando sempre com a versão original do
      // carregamento, rejeitando salvamentos legítimos subsequentes da mesma aba.
      var comVersao = Object.assign({}, updated, { _versaoServidor: novaVersao });
      setMapas(function (prev) { return prev.map(function (m) { return m.id === updated.id ? comVersao : m; }); });
      setCurrent(function(c){ return (c && c.id === updated.id) ? comVersao : c; });
      return comVersao;
    }).catch(function (e) {
      console.error('MAPACOT: Falha ao salvar mapa no servidor:', e && e.message || e);
      if (e && e.isVersionConflict) {
        window.avisarConflitoVersaoUmaVez('mapa-' + updated.id, e.message);
      } else {
        window.avisarErroSalvamento('Não foi possível salvar o mapa. Verifique sua conexão.');
      }
      throw e; // propaga o erro para quem chamou saber que falhou
    });
  };
  var filtered = mapas.filter(function (m) {
    var passaSearch = ((m.nome||"") + (m.obra||"") + (m.responsavel||"")).toLowerCase().includes(search.toLowerCase());
    var passaInsumo = !searchInsumo.trim() || (m.itens || []).some(function (i) {
      return (i.descricao || "").toLowerCase().includes(searchInsumo.toLowerCase());
    });
    return passaSearch && passaInsumo;
  });
  if (current) return /*#__PURE__*/React.createElement(MapEditor, {
    mapa: current,
    onBack: function onBack(mapaAtual) {
      // FIX: removida a chamada duplicada de sbSaveMapa aqui — o MapEditor agora GARANTE (via
      // flushSalvar) que o mapa já foi salvo com sucesso ANTES de chamar onBack. Salvar de novo
      // aqui era redundante e podia gerar confusão (duas requisições de rede para a mesma ação).
      if (mapaAtual) {
        setMapas(function(prev){ return prev.map(function(m){ return m.id===mapaAtual.id ? mapaAtual : m; }); });
      }
      setCurrent(null);
    },
    onSave: handleSave,
    cadastros: cadastros,
    addCadastro: addCadastro,
    removeCadastro: removeCadastro,
    editCadastro: editCadastro,
    setObsFornecedor: setObsFornecedor,
    orcamentos: orcamentos,
    associacoes: associacoes,
    onSaveOrcamento: saveOrcamento,
    onLimparOrcamento: limparOrcamento,
    onGerenciarOrcamento: function(obra){ setObraGerenciando(obra); setShowGerenciarOrc(true); },
    onCriarAssociacao: criarAssociacao,
    onRemoverAssociacao: removerAssociacao,
    onSubstituirAssociacoes: substituirAssociacoes,
    mapas: mapas
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100vh",
      fontFamily: "'DM Sans',sans-serif",
      background: "#f0f2f5"
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: SC.header
  }, /*#__PURE__*/React.createElement("div", {
    style: SC.headerIn
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: SC.logoMk
  }, "MC"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Syne',sans-serif",
      fontWeight: 700,
      fontSize: 20,
      color: "#fff",
      lineHeight: 1.1
    }
  }, "MAPACOT"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: "#7a9cc8",
      letterSpacing: 1
    }
  }, "SISTEMA DE COTA\xC7\xC3O \xB7 V5.0 \u2014 HIST\xD3RICO 7 DIAS \xB7 ", /*#__PURE__*/React.createElement("span", {
    onClick: function () { window.abrirDiagnosticoMapacot(); },
    style: { textDecoration: "underline", cursor: "pointer" }
  }, "DIAGN\xD3STICO")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    },
    className: "hdr-nav"
  }, /*#__PURE__*/React.createElement("button", {
    style: _objectSpread(_objectSpread({}, SC.btnPri), {}, {
      background: "rgba(255,255,255,0.1)",
      color: "#fff"
    }),
    onClick: function onClick() {
      return setShowCad(true);
    }
  }, /*#__PURE__*/React.createElement(IcoDb, null),
     /*#__PURE__*/React.createElement("span",{className:"hdr-lbl"}," CADASTROS")), /*#__PURE__*/React.createElement("button", {
    style: _objectSpread(_objectSpread({}, SC.btnPri), {}, {
      background: "rgba(255,255,255,0.1)",
      color: "#fff"
    }),
    onClick: function onClick() {
      return setShowRep(true);
    }
  }, /*#__PURE__*/React.createElement(IcoReport, null),
     /*#__PURE__*/React.createElement("span",{className:"hdr-lbl"}," RELAT\xD3RIOS")), /*#__PURE__*/React.createElement("button", {
    style: SC.btnPri,
    onClick: function onClick() {
      return setShowNew(true);
    }
  }, /*#__PURE__*/React.createElement(IcoPlus, null), " NOVO MAPA")))), /*#__PURE__*/React.createElement("main", {
    style: {
      maxWidth: 1100,
      margin: "0 auto",
      padding: "26px 20px 60px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      gap: 9,
      background: "#fff",
      border: "1.5px solid #dde1e9",
      borderRadius: 10,
      padding: "10px 14px",
      color: "#888"
    }
  }, /*#__PURE__*/React.createElement(IcoSearch, null), /*#__PURE__*/React.createElement("input", {
    style: {
      flex: 1,
      border: "none",
      background: "transparent",
      fontSize: 14,
      color: "#1a1a2e",
      fontFamily: "inherit",
      textTransform: "uppercase"
    },
    placeholder: "BUSCAR MAPAS...",
    value: search,
    onChange: function onChange(e) {
      return setSearch(e.target.value);
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "#888"
    }
  }, filtered.length, " ", filtered.length === 1 ? "MAPA" : "MAPAS")),
  /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 9,
      background: "#fff",
      border: "1.5px solid " + (searchInsumo.trim() ? "#2a5298" : "#dde1e9"),
      borderRadius: 10,
      padding: "10px 14px",
      color: "#888",
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement(IcoSearch, null),
  /*#__PURE__*/React.createElement("input", {
    style: {
      flex: 1,
      border: "none",
      background: "transparent",
      fontSize: 14,
      color: "#1a1a2e",
      fontFamily: "inherit",
      textTransform: "uppercase"
    },
    placeholder: "FILTRAR MAPAS POR INSUMO...",
    value: searchInsumo,
    onChange: function onChange(e) { return setSearchInsumo(e.target.value); }
  }), searchInsumo.trim() ? /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() { return setSearchInsumo(""); },
    style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "#888",
      fontSize: 16,
      lineHeight: 1,
      padding: "0 2px"
    }
  }, "✕") : null),
  /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      marginBottom: 20,
      flexWrap: "wrap"
    }
  }, [["🏢", "FORNECEDORES", "fornecedores"], ["🧱", "INSUMOS", "insumos"], ["📐", "UNIDADES", "unidades"], ["🏗️", "OBRAS", "obras"]].map(function (_ref23) {
    var _ref24 = _slicedToArray(_ref23, 3),
      ico = _ref24[0],
      lbl = _ref24[1],
      key = _ref24[2];
    return /*#__PURE__*/React.createElement("button", {
      key: key,
      onClick: function onClick() {
        return setShowCad(true);
      },
      style: {
        display: "flex",
        alignItems: "center",
        gap: 7,
        background: "#fff",
        border: "1.5px solid #e4e8f0",
        borderRadius: 8,
        padding: "7px 14px",
        fontSize: 12,
        fontWeight: 600,
        color: "#555",
        cursor: "pointer"
      }
    }, ico, " ", lbl, ": ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#2a5298",
        fontWeight: 700
      }
    }, (cadastros[key] || []).length));
  })), loading ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      padding: 80
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: SC.spinner
  })) : filtered.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "60px 20px",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 46
    }
  }, "\uD83D\uDCCB"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Syne',sans-serif",
      fontWeight: 700,
      fontSize: 20,
      color: "#0f1f3d"
    }
  }, mapas.length === 0 ? "NENHUM MAPA AINDA" : "NENHUM RESULTADO"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: "#7a8aaa",
      textAlign: "center"
    }
  }, mapas.length === 0 ? 'CLIQUE EM "NOVO MAPA" PARA COMEÇAR.' : "TENTE OUTRO TERMO."), mapas.length === 0 && /*#__PURE__*/React.createElement("div", {style:{display:'flex',gap:10,marginTop:16}}, /*#__PURE__*/React.createElement("button", {
    style: _objectSpread(_objectSpread({}, SC.btnPri), {}, {
      background:'#2563eb'
    }),
    onClick: function onClick() {
      sbGetMapas().then(function(d){ if(d&&d.length) setMapas(d); });
    }
  }, "↺ RECARREGAR MAPAS"), /*#__PURE__*/React.createElement("button", {
    style: _objectSpread(_objectSpread({}, SC.btnPri), {}, {
      marginTop: 0
    }),
    onClick: function onClick() {
      return setShowNew(true);
    }
  }, /*#__PURE__*/React.createElement(IcoPlus, null), " CRIAR PRIMEIRO MAPA"))) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
      gap: 16
    }
  }, filtered.map(function (m) {
    return /*#__PURE__*/React.createElement(MapCard, {
      key: m.id,
      mapa: m,
      onOpen: function(mapaEmMemoria) {
        // FIX: relatado e reproduzido pelo Claudio — abrir um mapa usava só a cópia já
        // carregada em memória nesta aba, que podia estar desatualizada se o mesmo mapa tivesse
        // sido editado em outro lugar (outra aba, outro dispositivo) depois que esta lista
        // carregou. Isso fazia o mapa abrir mostrando MENOS itens/dados do que realmente
        // existiam no servidor.
        // IMPORTANTE: MapEditor usa useState(init) internamente — ele só considera a prop
        // "mapa" na primeira montagem e IGNORA atualizações posteriores dela. Por isso não dá
        // para mostrar a versão antiga primeiro e "trocar" depois; é preciso esperar a
        // verificação terminar antes de montar o MapEditor pela primeira vez.
        fetch("".concat(SUPABASE_URL, "/rest/v1/mapas?id=eq.").concat(mapaEmMemoria.id, "&select=dados,atualizado_em"), { headers: SB, cache: "no-store" })
          .then(function(r){ return r.ok ? r.json() : null; })
          .then(function(rows){
            var maisRecente = (rows && rows[0] && rows[0].dados)
              ? Object.assign({}, rows[0].dados, { _versaoServidor: rows[0].atualizado_em })
              : mapaEmMemoria; // falha ao verificar: usa o que já tinha em memória, não bloqueia o usuário
            logEventoDiag("ABRIU mapa " + (maisRecente.numero != null ? maisRecente.numero : "?") + " (" + ((maisRecente.itens || []).length) + " itens) \u2014 vers\u00e3o " + (maisRecente._versaoServidor || "?") + " \u2014 \u00faltimo salvamento feito por: " + (maisRecente._appVersao ? ("app " + maisRecente._appVersao) : "VERS\u00c3O ANTIGA"));
            setCurrent(maisRecente);
            setMapas(function(prev){ return prev.map(function(m){ return m.id === maisRecente.id ? maisRecente : m; }); });
          })
          .catch(function(){ setCurrent(mapaEmMemoria); }); // falha de rede: abre com o que já tinha, não bloqueia
      },
      onDelete: handleDelete,
      onDuplicate: function(mapaOrigem) {
        var nextNum = mapas.length > 0 ? Math.max.apply(null, mapas.map(function(x){ return x.numero || 0; })) + 1 : 1;
        var clone = JSON.parse(JSON.stringify(mapaOrigem));
        clone.id = uid();
        clone.numero = nextNum;
        clone.criadoEm = new Date().toISOString();
        clone.atualizadoEm = new Date().toISOString();
        clone.duplicadoDe = mapaOrigem.numero; // identificador discreto
        logEventoDiag("DUPLICAR: mapa " + mapaOrigem.numero + " \u2192 novo mapa " + nextNum);
        setMapas(function(prev){ return [clone].concat(prev); });
        sbSaveMapa(clone).then(function(novaVersao){
          var comVersao = Object.assign({}, clone, { _versaoServidor: novaVersao });
          setMapas(function(prev){ return prev.map(function(x){ return x.id === clone.id ? comVersao : x; }); });
        }).catch(function(){ window.avisarErroSalvamento('Não foi possível salvar o mapa. Verifique sua conexão.'); });
        // Copiar associações com flag referencia:true (não desconta do saldo do orçamento)
        var assocsOrigem = associacoes.filter(function(a){ return a.mapaId === mapaOrigem.id; });
        if (assocsOrigem.length > 0) {
          var novasAssocs = assocsOrigem.map(function(a){
            return Object.assign({}, a, { id: uid(), mapaId: clone.id, referencia: true });
          });
          var listaAtual = associacoes.concat(novasAssocs);
          setAssociacoes(listaAtual);
          sbSaveAssociacoes(listaAtual).catch(function(){ window.avisarErroSalvamento('Não foi possível salvar a associação. Verifique sua conexão.'); });
        }
      },
      orcamentos: orcamentos,
      associacoes: associacoes
    });
  }))), /*#__PURE__*/React.createElement(Modal, {
    open: showNew,
    onClose: function onClose() {
      return setShowNew(false);
    }
  }, /*#__PURE__*/React.createElement(NewMapForm, {
    onSave: handleCreate,
    onClose: function onClose() {
      return setShowNew(false);
    },
    nextNumero: mapas.length + 1,
    cadastros: cadastros,
    addCadastro: addCadastro
  })), /*#__PURE__*/React.createElement(ReportsModal, {
    open: showRep,
    onClose: function onClose() {
      return setShowRep(false);
    },
    mapas: mapas,
    currentMapa: current,
    cadastros: cadastros,
    orcamentos: orcamentos,
    associacoes: associacoes
  }),
  showImportOrc && /*#__PURE__*/React.createElement(ModalImportarOrcamento, {
    open: showImportOrc,
    onClose: function(){ setShowImportOrc(false); setObraImportando(null); },
    obra: obraImportando,
    orcamentoAtual: obraImportando ? (orcamentos[obraImportando]||null) : null,
    onSalvar: function(dados){ saveOrcamento(obraImportando, zerarConsumido(dados)); setShowImportOrc(false); setObraImportando(null); }
  }),
  showGerenciarOrc && /*#__PURE__*/React.createElement(ModalGerenciarOrcamento, {
    open: showGerenciarOrc,
    onClose: function(){ setShowGerenciarOrc(false); setObraGerenciando(null); },
    obra: obraGerenciando,
    orcamentoAtual: obraGerenciando ? calcOrcComConsumo(orcamentos[obraGerenciando]||null, obraGerenciando, associacoes, mapas) : null,
    associacoes: associacoes,
    mapas: mapas,
    onSalvar: function(dados){ var ob=obraGerenciando; saveOrcamento(ob,dados).catch(function(){ window.avisarErroSalvamento('Não foi possível salvar o orçamento. Verifique sua conexão.'); }); }
  }),
  /*#__PURE__*/React.createElement(CadastrosModal, {
    open: showCad,
    onClose: function onClose() { return setShowCad(false); },
    cadastros: cadastros,
    onAdd: addCadastro,
    onRemove: removeCadastro,
    onEdit: editCadastro,
    onSetObs: setObsFornecedor,
    mapas: mapas,
    orcamentos: orcamentos,
    onImportarOrcamento: function(obra){ setShowCad(false); setTimeout(function(){ setObraImportando(obra); setShowImportOrc(true); }, 200); },
    onLimparOrcamento: limparOrcamento,
    onGerenciarOrcamento: function(obra){ setShowCad(false); setTimeout(function(){ setObraGerenciando(obra); setShowGerenciarOrc(true); }, 200); }
  }), /*#__PURE__*/React.createElement("style", null, "\n        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');\n        *{box-sizing:border-box;margin:0;padding:0;}\n        body{background:#f0f2f5;font-family:'DM Sans',sans-serif;}\n        input,textarea,button{text-transform:uppercase;font-family:inherit;}\n        input[type=date]{text-transform:none;}\n        input::placeholder{color:#bbb;text-transform:uppercase;}\n        input:focus{outline:none;}\n        button{cursor:pointer;}\n        @keyframes spin{to{transform:rotate(360deg)}}\n        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}\n        .scroll-ensinar{scrollbar-width:thin;scrollbar-color:#f0a500 #fff8e6;}\n        .scroll-ensinar::-webkit-scrollbar{width:10px;}\n        .scroll-ensinar::-webkit-scrollbar-track{background:#fff8e6;border-radius:8px;}\n        .scroll-ensinar::-webkit-scrollbar-thumb{background:#f0a500;border-radius:8px;}\n      "));
}

// ─── Styles ───────────────────────────────────────────────────────────────────
var SC = {
  header: {
    background: "#0f1f3d",
    borderBottom: "3px solid #f0a500",
    position: "sticky",
    top: 0,
    zIndex: 20
  },
  headerIn: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "13px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  logoMk: {
    width: 40,
    height: 40,
    background: "#f0a500",
    borderRadius: 9,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Syne',sans-serif",
    fontWeight: 800,
    fontSize: 15,
    color: "#0f1f3d",
    letterSpacing: 1
  },
  card: {
    background: "#fff",
    borderRadius: 12,
    padding: "18px 18px 14px",
    border: "1.5px solid #e8eaf0",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    animation: "fadeUp 0.3s ease"
  },
  badge: {
    background: "#eef2fb",
    color: "#1a56b0",
    fontSize: 11,
    fontWeight: 600,
    padding: "3px 9px",
    borderRadius: 20
  },
  btnOpen: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    background: "#0f1f3d",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "9px 14px",
    fontSize: 13,
    fontWeight: 700
  },
  btnIco: {
    background: "#f5f5f7",
    border: "none",
    borderRadius: 8,
    padding: "9px 10px",
    color: "#666",
    display: "flex",
    alignItems: "center"
  },
  btnSm: {
    border: "none",
    borderRadius: 5,
    padding: "5px 10px",
    fontSize: 11,
    fontWeight: 700,
    cursor: "pointer"
  },
  btnPri: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "#f0a500",
    color: "#0f1f3d",
    border: "none",
    borderRadius: 9,
    padding: "10px 18px",
    fontSize: 13,
    fontWeight: 700
  },
  btnSec: {
    background: "#f0f2f5",
    color: "#555",
    border: "none",
    borderRadius: 9,
    padding: "10px 18px",
    fontSize: 13,
    fontWeight: 600
  },
  spinner: {
    width: 32,
    height: 32,
    border: "3px solid #e0e4ed",
    borderTop: "3px solid #1a56b0",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite"
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(10,20,40,0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
    padding: 20,
    backdropFilter: "blur(2px)"
  },
  modal: {
    background: "#fff",
    borderRadius: 14,
    width: "100%",
    maxWidth: 480,
    overflow: "hidden",
    maxHeight: "90vh",
    overflowY: "auto",
    animation: "fadeUp 0.25s ease"
  },
  mHdr: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px 22px 14px",
    borderBottom: "1px solid #eee"
  },
  mTitle: {
    fontFamily: "'Syne',sans-serif",
    fontWeight: 700,
    fontSize: 16,
    color: "#0f1f3d"
  },
  mBody: {
    padding: "18px 22px",
    display: "flex",
    flexDirection: "column",
    gap: 4
  },
  mFtr: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 9,
    padding: "14px 22px",
    borderTop: "1px solid #eee"
  },
  lbl: {
    fontSize: 11,
    fontWeight: 700,
    color: "#555",
    marginTop: 10,
    marginBottom: 4,
    letterSpacing: 0.4
  },
  inp: {
    width: "100%",
    border: "1.5px solid #dde1e9",
    borderRadius: 8,
    padding: "10px 12px",
    fontSize: 13,
    color: "#1a1a2e",
    textTransform: "uppercase"
  },
  rDesc: {
    fontSize: 12,
    color: "#666",
    background: "#f5f7fb",
    borderRadius: 6,
    padding: "8px 11px",
    lineHeight: 1.6
  },
  appBar: {
    background: "#0f1f3d",
    borderBottom: "3px solid #f0a500",
    padding: "11px 12px",
    display: "flex",
    alignItems: "center",
    gap: 8,
    position: "sticky",
    top: 0,
    zIndex: 30,
    width: "100%",
    boxSizing: "border-box",
    overflowX: "auto",
    overflowY: "visible", // FIX: sem isso, o overflowX sozinho corta o dropdown de CONFIGURAÇÕES que se estende para baixo da barra
    WebkitOverflowScrolling: "touch"
  },
  backBtn: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    whiteSpace: "nowrap",
    flexShrink: 0,
    background: "rgba(255,255,255,0.1)",
    border: "none",
    color: "#fff",
    borderRadius: 7,
    padding: "7px 13px",
    fontSize: 12,
    fontWeight: 700
  },
  tableScroll: {
    overflowX: "auto",
    border: "1px solid #c8ccd8",
    borderTop: "none",
    display: "inline-block",
    maxWidth: "100%"
  },
  table: {
    borderCollapse: "collapse",
    width: "100%",
    minWidth: 680,
    fontSize: 12
  },
  th: {
    padding: "7px 9px",
    fontFamily: "'DM Sans',sans-serif",
    fontWeight: 700,
    fontSize: 11,
    letterSpacing: 0.4,
    textTransform: "uppercase",
    border: "1px solid #b0b8cc",
    whiteSpace: "nowrap"
  },
  td: {
    padding: "6px 9px",
    border: "1px solid #c8ccd8",
    color: "#1a1a2e",
    fontSize: 12,
    verticalAlign: "middle"
  },
  btnAddItem: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "#0f1f3d",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "9px 18px",
    fontSize: 12,
    fontWeight: 700
  }
};
// FIX: pequeno aviso global e discreto, para avisar quando salvar/excluir falhar
// de verdade (ex: sem internet) - não bloqueia a tela, desaparece sozinho.
// Qualquer parte do sistema pode chamar window.avisarErroSalvamento(mensagem).
window.avisarErroSalvamento = function(mensagem) {
  logEventoDiag("\u2716 ERRO DE SALVAMENTO: " + mensagem);
  window.dispatchEvent(new CustomEvent('mapacot-erro-salvamento', { detail: mensagem }));
};

// FIX: quando há um conflito de versão real (outra aba/dispositivo editou o mesmo dado), o
// usuário pode continuar tentando editar sem recarregar — sem esta proteção, CADA nova
// tentativa mostraria o mesmo aviso de novo, o que fica repetitivo e confuso. Agora o aviso
// aparece só uma vez por item em conflito nesta aba; reseta ao recarregar a página.
var conflitosJaAvisados = {};
window.avisarConflitoVersaoUmaVez = function(chave, mensagem) {
  if (conflitosJaAvisados[chave]) return;
  conflitosJaAvisados[chave] = true;
  window.avisarErroSalvamento(mensagem);
};

function ToastErroSalvamento() {
  var _sT = useState(null), toast = _slicedToArray(_sT,2)[0], setToast = _slicedToArray(_sT,2)[1];
  var timerRef = useRef(null);
  useEffect(function(){
    function aoReceberErro(e){
      if (timerRef.current) clearTimeout(timerRef.current); // FIX: cancela o timer anterior, evita que ele limpe um aviso mais novo antes da hora
      setToast(e.detail || 'Não foi possível salvar. Verifique sua conexão.');
      timerRef.current = setTimeout(function(){ setToast(null); timerRef.current = null; }, 5000);
    }
    window.addEventListener('mapacot-erro-salvamento', aoReceberErro);
    return function(){
      window.removeEventListener('mapacot-erro-salvamento', aoReceberErro);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
  if (!toast) return null;
  return /*#__PURE__*/React.createElement('div', {
    style:{position:'fixed',bottom:20,left:'50%',transform:'translateX(-50%)',background:'#A32D2D',color:'#fff',padding:'10px 20px',borderRadius:6,fontSize:13,fontWeight:'bold',zIndex:99999,boxShadow:'0 4px 14px rgba(0,0,0,.3)',maxWidth:'90vw',textAlign:'center'}
  }, '⚠ ' + toast);
}

function Root() {
  var _React$useState = React.useState(function () {
      return sessionStorage.getItem("mapacot_auth") === "1";
    }),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    auth = _React$useState2[0],
    setAuth = _React$useState2[1];
  if (!auth) return /*#__PURE__*/React.createElement(React.Fragment, null,
    /*#__PURE__*/React.createElement(Login, {
      onLogin: function onLogin() {
        return setAuth(true);
      }
    }),
    /*#__PURE__*/React.createElement(ToastErroSalvamento, null)
  );
  return /*#__PURE__*/React.createElement(React.Fragment, null,
    /*#__PURE__*/React.createElement(App, null),
    /*#__PURE__*/React.createElement(ToastErroSalvamento, null)
  );
}
// Sincronizar barras de rolagem duplas para TODOS os mapas
setInterval(function() {
  var mirrors = document.querySelectorAll('.scroll-mirror');
  mirrors.forEach(function(mirror) {
    if (mirror._sync) return;
    var table = mirror.nextElementSibling;
    if (!table) return;
    mirror._sync = true;
    var inner = mirror.querySelector('.scroll-mirror-inner');
    mirror.addEventListener('scroll', function() { table.scrollLeft = mirror.scrollLeft; });
    table.addEventListener('scroll', function() { mirror.scrollLeft = table.scrollLeft; });
  });
  // Atualizar largura dos inner divs
  document.querySelectorAll('.scroll-mirror').forEach(function(mirror) {
    var table = mirror.nextElementSibling;
    var inner = mirror.querySelector('.scroll-mirror-inner');
    if (table && inner) inner.style.width = table.scrollWidth + 'px';
  });
}, 300);

ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(Root, null));
