function AutocompleteInput(_ref9) {
  var value = _ref9.value,
    _onChange = _ref9.onChange,
    onCommit = _ref9.onCommit,
    _ref9$suggestions = _ref9.suggestions,
    suggestions = _ref9$suggestions === void 0 ? [] : _ref9$suggestions,
    placeholder = _ref9.placeholder,
    _ref9$style = _ref9.style,
    xStyle = _ref9$style === void 0 ? {} : _ref9$style,
    maxLen = _ref9.maxLen,
    _ref9$inputStyle = _ref9.inputStyle,
    inputStyle = _ref9$inputStyle === void 0 ? {} : _ref9$inputStyle,
    autoFocus = _ref9.autoFocus,
    _ref9$showOnFocus = _ref9.showOnFocus,
    showOnFocus = _ref9$showOnFocus === void 0 ? false : _ref9$showOnFocus,
    strictMatch = _ref9.strictMatch;
  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    open = _useState2[0],
    setOpen = _useState2[1];
  var _useState3 = useState(-1),
    _useState4 = _slicedToArray(_useState3, 2),
    hi = _useState4[0],
    setHi = _useState4[1];
  var ref = useRef();
  var nv = normalize(value);
  var filtered = nv.length > 0 ? (suggestions || []).filter(function (s) {
    return normalize(s).includes(nv) && normalize(s) !== nv;
  }).sort(function (a, b) {
    var as = normalize(a).startsWith(nv);
    var bs = normalize(b).startsWith(nv);
    return as && !bs ? -1 : !as && bs ? 1 : 0;
  }).slice(0, 500) : showOnFocus && open ? (suggestions || []).slice(0, 500) : [];
  var dropRef = useRef();
  var select = function select(s) {
    _onChange(s);
    onCommit && onCommit(s);
    setOpen(false);
    setHi(-1);
  };
  useEffect(function () {
    if (hi >= 0 && dropRef.current) {
      var container = dropRef.current;
      var item = container.children[hi];
      if (item) {
        var itemTop = item.offsetTop;
        var itemBottom = itemTop + item.offsetHeight;
        if (itemBottom > container.scrollTop + container.clientHeight) {
          container.scrollTop = itemBottom - container.clientHeight;
        } else if (itemTop < container.scrollTop) {
          container.scrollTop = itemTop;
        }
      }
    }
  }, [hi]);
  var handleKey = function handleKey(e) {
    if (!open || !filtered.length) {
      if (e.key === "Enter" || e.key === "Tab") {
        if (strictMatch) {
          // FIX: causa raiz real de descrições/unidades salvas vazias mesmo com o texto certo
          // digitado — se a lista de cadastros válidos (suggestions) ainda está vazia nesse
          // momento (ainda carregando do servidor, ex: conexão mais lenta), rejeitar o valor
          // digitado como se fosse inválido causa perda de dados reais. Enquanto a lista ainda
          // não carregou, aceita o valor digitado sem rejeitar.
          var _aindaCarregando = !suggestions || suggestions.length === 0;
          var _match = _aindaCarregando || (value && suggestions.some(function (s) {
            return s.toUpperCase() === value.toUpperCase();
          }));
          _onChange(_match ? value : "");
          onCommit && onCommit(_match ? value : "");
        } else {
          onCommit && onCommit(value);
        }
        setOpen(false);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHi(function (h) {
        return Math.min(h + 1, filtered.length - 1);
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHi(function (h) {
        return Math.max(h - 1, -1);
      });
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      if (hi >= 0) select(filtered[hi]);else {
        // FIX: quando o dropdown está aberto mas o usuário não navegou com as setas (aperta
        // Enter/Tab direto após digitar), o valor era aceito sem validar strictMatch — diferente
        // do caminho de dropdown fechado, que já validava. O onBlur corrigia isso ~180ms depois,
        // mas o onCommit já tinha rodado uma vez com o valor não validado nesse meio-tempo,
        // podendo disparar efeitos colaterais indevidos (ex: popup de observação de fornecedor
        // abrindo para um texto que não corresponde a nenhum fornecedor real).
        if (strictMatch) {
          // FIX: mesma proteção contra cadastros ainda carregando - ver comentário completo
          // no primeiro ponto de validação strictMatch, acima.
          var _aindaCarregandoEnter = !suggestions || suggestions.length === 0;
          var matchEnter = _aindaCarregandoEnter || (value && suggestions.some(function (s) {
            return s.toUpperCase() === value.toUpperCase();
          }));
          _onChange(matchEnter ? value : "");
          onCommit && onCommit(matchEnter ? value : "");
        } else {
          onCommit && onCommit(value);
        }
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setHi(-1);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    style: _objectSpread({
      position: "relative"
    }, xStyle)
  }, /*#__PURE__*/React.createElement("input", {
    ref: ref,
    value: value,
    autoFocus: autoFocus,
    onChange: function onChange(e) {
      var v = (maxLen ? e.target.value.slice(0, maxLen) : e.target.value).toUpperCase();
      _onChange(v);
      setOpen(true);
      setHi(-1);
    },
    onFocus: function onFocus() {
      return setOpen(true);
    },
    onBlur: function onBlur() {
      var _blurVal = value;
      // FIX: causa raiz real de dados perdidos ao preencher campos rapidamente (confirmado com
      // testes). Este onBlur tinha um delay de 180ms antes de confirmar o valor — pensado para
      // dar tempo de um clique numa sugestão do dropdown ser registrado antes do blur "fechar"
      // tudo. Mas essa proteção já existe de outra forma: cada opção do dropdown usa
      // preventDefault() no onMouseDown (ver função "select" logo abaixo), o que IMPEDE o blur
      // de disparar nesse caso — o delay aqui era redundante. Só que, quando o usuário passava
      // para o próximo campo em menos de 180ms (comum ao preencher vários itens seguidos), o
      // commit deste campo ainda estava pendente e podia se perder na transição. Confirmando o
      // valor imediatamente (sem esperar) resolve isso sem quebrar a seleção por clique.
      setOpen(false);
      setHi(-1);
      if (strictMatch) {
        var _aindaCarregandoBlur = !suggestions || suggestions.length === 0;
        var match = _aindaCarregandoBlur || (_blurVal && suggestions.some(function (s) {
          return s.toUpperCase() === _blurVal.toUpperCase();
        }));
        _onChange(match ? _blurVal : "");
        if (onCommit) onCommit(match ? _blurVal : "");
      }
    },
    onKeyDown: handleKey,
    placeholder: placeholder,
    maxLength: maxLen,
    style: _objectSpread({
      width: "100%",
      textTransform: "uppercase",
      fontFamily: "inherit"
    }, inputStyle)
  }), open && filtered.length > 0 && /*#__PURE__*/React.createElement("div", {
    ref: dropRef,
    style: {
      position: "absolute",
      top: "100%",
      left: 0,
      right: 0,
      background: "#fff",
      border: "1.5px solid #2a5298",
      borderTop: "none",
      borderRadius: "0 0 7px 7px",
      zIndex: 9999,
      boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
      maxHeight: 220,
      overflowY: "auto"
    }
  }, filtered.map(function (s, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      onMouseDown: function onMouseDown(e) {
        e.preventDefault();
        select(s);
      },
      style: {
        padding: "7px 11px",
        cursor: "pointer",
        fontSize: 12,
        textTransform: "uppercase",
        background: hi === i ? "#eef2ff" : "#fff",
        color: hi === i ? "#2a5298" : "#1a1a2e",
        borderBottom: "1px solid #f0f2f8",
        fontWeight: hi === i ? 600 : 400
      }
    }, s);
  })));
}

// ─── Editable Cell (with optional autocomplete) ───────────────────────────────
function DetalheBtn(_ref_det) {
  var value = _ref_det.value, onChange = _ref_det.onChange;
  var _useStateD = useState(false),
    _useStateD2 = _slicedToArray(_useStateD, 2),
    ed = _useStateD2[0], setEd = _useStateD2[1];
  var _useStateDraft = useState(""),
    _useStateDraft2 = _slicedToArray(_useStateDraft, 2),
    draft = _useStateDraft2[0], setDraft = _useStateDraft2[1];
  var _useStateDGR = useState(false),
    detGuardReady = _slicedToArray(_useStateDGR, 2)[0],
    setDetGuardReady = _slicedToArray(_useStateDGR, 2)[1];
  var taRef = useRef();
  // FIX: sem isto, o destaque laranja do "1º clique" (esperando confirmação) ficava preso na tela
  // para sempre se o usuário clicasse em qualquer OUTRO lugar em vez de clicar de novo no campo —
  // mesmo padrão já usado no popup de observação de fornecedor.
  useEffect(function () {
    if (!detGuardReady) return;
    var fechar = function () { setDetGuardReady(false); };
    var t = setTimeout(function () { document.addEventListener("click", fechar); }, 0);
    return function () { clearTimeout(t); document.removeEventListener("click", fechar); };
  }, [detGuardReady]);
  var openEdit = function openEdit() {
    if (value && !detGuardReady) {
      setDetGuardReady(true); // 1º clique: destaca campo com borda laranja
      return;                 // 2º clique: abre editor
    }
    setDetGuardReady(false);
    setDraft((value || "").toUpperCase());
    setEd(true);
  };
  if (ed) return /*#__PURE__*/React.createElement("textarea", {
    ref: taRef,
    value: draft,
    autoFocus: true,
    onChange: function(e){
      e.stopPropagation();
      var el = e.target;
      var ss = el.selectionStart, se = el.selectionEnd;
      el.style.height="auto";
      el.style.height=el.scrollHeight+"px";
      setDraft(el.value.toUpperCase());
      requestAnimationFrame(function(){ el.selectionStart=ss; el.selectionEnd=se; });
    },
    onClick: function(e){ e.stopPropagation(); },
    onFocus: function(e){ e.stopPropagation(); },
    onBlur: function(e){ e.stopPropagation(); e.target.scrollTop=0; if(onChange) onChange(draft); setEd(false); },
    placeholder: "DETALHE (FABRICANTE, MARCA...)",
    rows: 1,
    style: {
      width:"100%", marginTop:3, border:"1px dashed #a0b4d0", borderRadius:4,
      padding:"2px 5px", fontSize:12, color:"#4a6080", background:"#f0f6ff",
      fontFamily:"inherit", resize:"none", overflow:"hidden", minHeight:60,
      whiteSpace:"pre-wrap", wordBreak:"break-word", textTransform:"uppercase",
      cursor:"text", display:"block", outline:"none", fontWeight:"bold"
    }
  });
  if (value) return /*#__PURE__*/React.createElement("div", {
    onClick: function(e){ e.stopPropagation(); openEdit(); },
    title: detGuardReady ? "Clique novamente para editar" : undefined,
    style:{marginTop:3, padding:"2px 5px", fontSize:12, color:"#4a6080",
      background: detGuardReady ? "#fffbee" : "#f0f6ff",
      border: detGuardReady ? "2px solid #f0a500" : "1px dashed #a0b4d0",
      borderRadius:4, fontWeight:"bold", wordBreak:"break-word", whiteSpace:"pre-wrap",
      textTransform:"uppercase", cursor:"text", minHeight:22}
  }, value);
  return /*#__PURE__*/React.createElement("span", {
    onClick: function(e){ e.stopPropagation(); openEdit(); },
    style:{display:"inline-flex", alignItems:"center", gap:4, marginTop:3,
      padding:"2px 7px", fontSize:11, color:"#8a9bb0", background:"#f5f8ff",
      border:"1px dashed #c0cce0", borderRadius:4, cursor:"pointer"}
  }, "✏ + DETALHE");
}
function EC(_ref0) {
  var value = _ref0.value,
    onChange = _ref0.onChange,
    _ref0$placeholder = _ref0.placeholder,
    placeholder = _ref0$placeholder === void 0 ? "" : _ref0$placeholder,
    _ref0$align = _ref0.align,
    align = _ref0$align === void 0 ? "left" : _ref0$align,
    _ref0$tdSt = _ref0.tdSt,
    tdSt = _ref0$tdSt === void 0 ? {} : _ref0$tdSt,
    maxLen = _ref0.maxLen,
    _ref0$suggestions = _ref0.suggestions,
    suggestions = _ref0$suggestions === void 0 ? [] : _ref0$suggestions,
    colSpan = _ref0.colSpan,
    numericOnly = _ref0.numericOnly,
    strictMatch = _ref0.strictMatch,
    detailValue = _ref0.detailValue,
    onDetailChange = _ref0.onDetailChange,
    wrapText = _ref0.wrapText,
    guardEdit = _ref0.guardEdit;
  var _useState5 = useState(false),
    _useState6 = _slicedToArray(_useState5, 2),
    ed = _useState6[0],
    setEd = _useState6[1];
  var _useState7 = useState(""),
    _useState8 = _slicedToArray(_useState7, 2),
    raw = _useState8[0],
    setRaw = _useState8[1];
  var _useStateGR = useState(false),
    guardReady = _slicedToArray(_useStateGR, 2)[0],
    setGuardReady = _slicedToArray(_useStateGR, 2)[1];
  var ref = useRef();
  var hasSugg = suggestions.length > 0;
  var start = function start() {
    if (guardEdit && value !== null && value !== undefined && value !== "") {
      if (!guardReady) {
        setGuardReady(true); // 1º clique: destaca campo com borda laranja
        return;              // 2º clique: abre editor
      }
    }
    setGuardReady(false);
    setRaw(value !== null && value !== void 0 ? value : "");
    setEd(true);
    setTimeout(function () {
      var _ref$current;
      return (_ref$current = ref.current) === null || _ref$current === void 0 ? void 0 : _ref$current.focus();
    }, 0);
  };
  var commit = function commit(v) {
    setGuardReady(false);
    setEd(false);
    onChange(v !== null && v !== void 0 ? v : raw);
  };
  if (ed) return /*#__PURE__*/React.createElement("td", {
    style: _objectSpread(_objectSpread(_objectSpread({}, SC.td), tdSt), {}, {
      padding: 0
    }),
    colSpan: colSpan
  }, hasSugg ? /*#__PURE__*/React.createElement(AutocompleteInput, {
    ref: ref,
    value: raw,
    onChange: setRaw,
    onCommit: commit,
    suggestions: suggestions,
    strictMatch: strictMatch,
    maxLen: maxLen,
    autoFocus: true,
    inputStyle: {
      border: "2px solid #f0a500",
      background: "#fffbee",
      padding: "5px 7px",
      fontSize: 12,
      textAlign: align,
      outline: "none"
    }
  }) : /*#__PURE__*/React.createElement("input", {
    ref: ref,
    value: raw,
    onChange: function onChange(e) {
      var el=e.target; var ss=el.selectionStart; var se=el.selectionEnd;
      var v = (maxLen ? el.value.slice(0, maxLen) : el.value).toUpperCase();
      if (numericOnly) v = v.replace(/[^0-9.,]/g, "");
      setRaw(v);
      requestAnimationFrame(function(){ el.selectionStart=ss; el.selectionEnd=se; });
    },
    onBlur: function onBlur() {
      return commit(raw);
    },
    onKeyDown: function onKeyDown(e) {
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        commit(raw);
      }
      if (e.key === "Escape") setEd(false);
    },
    style: {
      width: "100%",
      border: "2px solid #f0a500",
      background: "#fffbee",
      padding: "5px 7px",
      fontSize: 12,
      fontFamily: "inherit",
      textTransform: "uppercase",
      textAlign: align,
      outline: "none"
    },
    autoFocus: true,
    maxLength: maxLen
  }));
  return /*#__PURE__*/React.createElement("td", {
    style: _objectSpread(_objectSpread(_objectSpread({}, SC.td), tdSt), {}, {
      textAlign: align,
      cursor: "text",
      outline: guardReady ? "2px solid #f0a500" : undefined,
      background: guardReady ? "#fffbee" : (tdSt.background || undefined)
    }),
    colSpan: colSpan,
    title: guardReady ? "Clique novamente para editar" : undefined,
    onClick: start
  }, value !== "" && value !== null && value !== undefined ? (wrapText ? /*#__PURE__*/React.createElement("span", {style:{wordBreak:"break-word",whiteSpace:"pre-wrap",display:"block"}}, value) : value) : /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#ccc"
    }
  }, placeholder), detailValue !== undefined && detailValue !== null && /*#__PURE__*/React.createElement(DetalheBtn, {
    key: "det",
    value: detailValue,
    onChange: onDetailChange
  }));
}

// ─── Icons ────────────────────────────────────────────────────────────────────
var IcoPlus = function IcoPlus(_ref1) {
  var _ref1$w = _ref1.w,
    w = _ref1$w === void 0 ? 16 : _ref1$w;
  return /*#__PURE__*/React.createElement("svg", {
    width: w,
    height: w,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "5",
    x2: "12",
    y2: "19"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "5",
    y1: "12",
    x2: "19",
    y2: "12"
  }));
};
var IcoTrash = function IcoTrash() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "3 6 5 6 21 6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M19 6l-1 14H6L5 6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10 11v6M14 11v6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 6V4h6v2"
  }));
};
var IcoSearch = function IcoSearch() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "8"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "21",
    y1: "21",
    x2: "16.65",
    y2: "16.65"
  }));
};
var IcoBack = function IcoBack() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "15 18 9 12 15 6"
  }));
};
var IcoClose = function IcoClose() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  }));
};
var IcoClip = function IcoClip() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "32",
    height: "32",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "8",
    y: "2",
    width: "8",
    height: "4",
    rx: "1"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "9",
    y1: "12",
    x2: "15",
    y2: "12"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "9",
    y1: "16",
    x2: "13",
    y2: "16"
  }));
};
var IcoChev = function IcoChev() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "9 18 15 12 9 6"
  }));
};
var IcoCopy = function IcoCopy() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "14", height: "14", viewBox: "0 0 24 24",
    fill: "none", stroke: "currentColor",
    strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round"
  },
    /*#__PURE__*/React.createElement("rect", {x:"9",y:"9",width:"13",height:"13",rx:"2",ry:"2"}),
    /*#__PURE__*/React.createElement("path", {d:"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"})
  );
};
var IcoPDF = function IcoPDF() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "14 2 14 8 20 8"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "16",
    y1: "13",
    x2: "8",
    y2: "13"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "16",
    y1: "17",
    x2: "8",
    y2: "17"
  }));
};
var IcoReport = function IcoReport() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "3",
    width: "18",
    height: "18",
    rx: "2"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "9",
    y1: "9",
    x2: "15",
    y2: "9"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "9",
    y1: "13",
    x2: "15",
    y2: "13"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "9",
    y1: "17",
    x2: "12",
    y2: "17"
  }));
};
var IcoDb = function IcoDb() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("ellipse", {
    cx: "12",
    cy: "5",
    rx: "9",
    ry: "3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"
  }));
};
var IcoPencil = function IcoPencil() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
  }));
};

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal(_ref10) {
  var open = _ref10.open,
    onClose = _ref10.onClose,
    children = _ref10.children,
    _ref10$maxWidth = _ref10.maxWidth,
    maxWidth = _ref10$maxWidth === void 0 ? 480 : _ref10$maxWidth;
  useEffect(function () {
    document.body.style.overflow = open ? "hidden" : "";
    return function () {
      document.body.style.overflow = "";
    };
  }, [open]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: SC.overlay
  }, /*#__PURE__*/React.createElement("div", {
    style: _objectSpread(_objectSpread({}, SC.modal), {}, {
      maxWidth: maxWidth
    })
  }, children));
}

// ─── Cadastros Modal ──────────────────────────────────────────────────────────
var estaEmUso=function(tp,vl,mp){var v=normalize(vl);for(var i=0;i<mp.length;i++){var m=mp[i];if(tp==="obras"&&normalize(m.obra||"")===v)return true;if(tp==="unidades"){var u=m.itens||[];for(var j=0;j<u.length;j++){if(normalize(u[j].unid||"")===v)return true;}}if(tp==="fornecedores"){var f=m.fornecedores||[];for(var j=0;j<f.length;j++){if(normalize(f[j].nome||"")===v)return true;}}if(tp==="insumos"){var s=m.itens||[];for(var j=0;j<s.length;j++){if(normalize(s[j].descricao||"")===v)return true;}}}return false;};
