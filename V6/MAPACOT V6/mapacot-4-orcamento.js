function ModalGerenciarOrcamento(_ref_ger) {
  var open = _ref_ger.open, onClose = _ref_ger.onClose, obra = _ref_ger.obra,
    orcamentoAtual = _ref_ger.orcamentoAtual, associacoes = _ref_ger.associacoes, onSalvar = _ref_ger.onSalvar, mapas = _ref_ger.mapas || [];
  var _sI = React.useState([]), itens = _sI[0], setItens = _sI[1];
  var itensRef = React.useRef([]);
  var _sF = React.useState("TODOS"), filtro = _sF[0], setFiltro = _sF[1];
  var _sB = React.useState(""), busca = _sB[0], setBusca = _sB[1];
  var _sPI = React.useState(null), popupInativar = _sPI[0], setPopupInativar = _sPI[1];
  var _sPF = React.useState(null), popupForm = _sPF[0], setPopupForm = _sPF[1];
  var _sSv = React.useState(false), salvando = _sSv[0], setSalvando = _sSv[1];

  React.useEffect(function() {
    if (!open || !orcamentoAtual) return;
    var base = Array.isArray(orcamentoAtual) ? orcamentoAtual : (orcamentoAtual.itens || []);
    var lista = base.map(function(it, i) { return Object.assign({}, it, { _idx: i, ativo: it.ativo !== false }); });
    itensRef.current = lista;
    setItens(lista);
    setBusca(""); setFiltro("TODOS");
  }, [open, orcamentoAtual]);

  if (!open) return null;

  var upd = function(novos) { itensRef.current = novos; setItens(novos); };
  // FIX: pré-computa IDs dos mapas desta obra para evitar ASSOC. cruzado entre obras diferentes
  var mapasDaObra = (mapas||[]).filter(function(m){ return (m.obra||'') === (obra||''); }).map(function(m){ return m.id; });
  var temAssoc = function(idx) {
    if (!associacoes || !mapasDaObra.length) return false;
    return associacoes.some(function(a){ return a.orcItemIndex === idx && mapasDaObra.indexOf(a.mapaId) >= 0; });
  };
  var calcSaldo = function(it) { return (parseFloat(it.quantidade)||0) - (parseFloat(it.consumido)||0); };
  var fmtN = function(v) { return (parseFloat(String(v||0).replace(",","."))||0).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2}); };

  var itensFilt = itensRef.current.filter(function(it) {
    var bOk = !busca || (it.descricao||"").toUpperCase().indexOf(busca.toUpperCase()) >= 0 || (it.codigo||"").indexOf(busca) >= 0;
    var assoc = temAssoc(it._idx);
    if (filtro === "ATIVOS" && !it.ativo) return false;
    if (filtro === "INATIVOS" && it.ativo) return false;
    if (filtro === "COM ASSOCIACAO" && !assoc) return false;
    if (filtro === "SEM ASSOCIACAO" && assoc) return false;
    return bOk;
  });

  var handleInativar = function(it) {
    if (calcSaldo(it) > 0) { setPopupInativar(it); }
    else { upd(itensRef.current.map(function(x){ return x._idx===it._idx ? Object.assign({},x,{ativo:false}) : x; })); }
  };
  var confirmarInativar = function(criar) {
    var it = popupInativar;
    var novos = itensRef.current.map(function(x){ return x._idx===it._idx ? Object.assign({},x,{ativo:false}) : x; });
    if (criar) novos = novos.concat([{_idx:novos.length,codigo:it.codigo||"",descricao:(it.descricao||"")+" - SALDO COMPLEMENTAR",unidade:it.unidade||"",quantidade:calcSaldo(it),valorUnitario:it.valorUnitario||0,consumido:0,ativo:true,observacao:""}]);
    upd(novos); setPopupInativar(null);
  };
  var handleReativar = function(it) { upd(itensRef.current.map(function(x){ return x._idx===it._idx ? Object.assign({},x,{ativo:true}) : x; })); };
  var handleExcluir = function(it) {
    if (!window.confirm("EXCLUIR \"" + (it.descricao||"") + "\"?")) return;
    upd(itensRef.current.filter(function(x){ return x._idx!==it._idx; }).map(function(x,i){ return Object.assign({},x,{_idx:i}); }));
  };
  var handleSalvarForm = function(dados) {
    var novoItens;
    if (popupForm.modo === "editar") {
      novoItens = itensRef.current.map(function(x){ return x._idx===popupForm.it._idx ? Object.assign({},x,{codigo:dados.codigo,descricao:dados.descricao,unidade:dados.unidade,quantidade:parseFloat(dados.quantidade)||0,valorUnitario:parseFloat(dados.valorUnitario)||0,observacao:dados.observacao||""}) : x; });
    } else {
      var novoItem = {_idx:itensRef.current.length,codigo:dados.codigo||"",descricao:dados.descricao||"",unidade:dados.unidade||"",quantidade:parseFloat(dados.quantidade)||0,valorUnitario:parseFloat(dados.valorUnitario)||0,consumido:0,ativo:true,observacao:dados.observacao||""};
      novoItens = itensRef.current.concat([novoItem]);
    }
    upd(novoItens);
    setPopupForm(null);
  };
  var handleSalvar = function() {
    var lista = itensRef.current;
    if (!lista || lista.length === 0) { alert("Erro: nenhum item carregado."); return; }
    setSalvando(true);
    var itensFinal = lista.map(function(it){ var cp=Object.assign({},it); delete cp._idx; return cp; });
    var dadosSalvar = Array.isArray(orcamentoAtual) ? itensFinal : Object.assign({}, orcamentoAtual, { itens: itensFinal });
    onSalvar(dadosSalvar);
    setTimeout(function(){ setSalvando(false); }, 1000);
  };

  var totAt = itensRef.current.filter(function(x){ return x.ativo!==false; }).length;
  var totIn = itensRef.current.filter(function(x){ return x.ativo===false; }).length;
  var totAs = itensRef.current.filter(function(x){ return temAssoc(x._idx); }).length;
  var E = React.createElement;

  return E("div", { style:{position:"fixed",top:0,left:0,width:"100%",height:"100%",background:"rgba(0,0,0,0.55)",zIndex:3000,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"20px",boxSizing:"border-box",overflowY:"auto"} },
    E("div", { style:{background:"#fff",borderRadius:10,width:"100%",maxWidth:1200,boxShadow:"0 4px 32px rgba(0,0,0,0.18)",overflow:"hidden",marginBottom:20} },
      E("div", { style:{background:"#0f1f3d",color:"#fff",padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"} },
        E("span", { style:{fontWeight:700,fontSize:13,letterSpacing:1} }, "GERENCIAMENTO DE ORÇAMENTO — " + (obra||"").toUpperCase()),
        E("button", { onClick:function(){ setPopupForm({modo:"adicionar",it:{codigo:"",descricao:"",unidade:"",quantidade:"",valorUnitario:"",observacao:""}}); }, style:{background:"#1a56db",color:"#fff",border:"none",borderRadius:6,padding:"7px 14px",fontWeight:700,fontSize:12,cursor:"pointer"} }, "+ ADICIONAR ITEM")
      ),
      E("div", { style:{padding:"10px 20px",background:"#f8f9fb",borderBottom:"1px solid #e0e4ec",display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"} },
        E("input", { type:"text", placeholder:"BUSCAR POR DESCRICAO OU CODIGO...", value:busca, onChange:function(e){setBusca(e.target.value);}, style:{padding:"7px 12px",border:"1px solid #d1d5db",borderRadius:6,fontSize:12,width:280} }),
        E("div", { style:{display:"flex",gap:6,flexWrap:"wrap"} },
          ["TODOS","ATIVOS","INATIVOS","COM ASSOCIACAO","SEM ASSOCIACAO"].map(function(f) {
            return E("button", { key:f, onClick:function(){ setFiltro(f); }, style:{padding:"5px 12px",borderRadius:20,border:"2px solid #1a56db",background:filtro===f?"#1a56db":"#fff",color:filtro===f?"#fff":"#1a56db",fontSize:11,fontWeight:700,cursor:"pointer"} }, f);
          })
        )
      ),
      E("div", { style:{background:"#fffbe6",borderLeft:"4px solid #f59e0b",padding:"8px 16px",margin:"10px 20px",borderRadius:4,fontSize:11,color:"#92400e"} },
        "Itens COM ASSOCIACAO estao bloqueados para edicao e exclusao."
      ),
      E("div", { style:{overflowX:"auto",maxHeight:420,overflowY:"auto"} },
        E("table", { style:{width:"100%",borderCollapse:"collapse"} },
          E("thead", null, E("tr", null,
            [["CODIGO","80px"],["DESCRICAO","auto"],["UNID.","55px"],["QT.PREV","90px"],["QT.CONS","90px"],["SALDO","85px"],["VL.UNIT","100px"],["STATUS","70px"],["VINCULO","75px"],["ACOES","175px"]].map(function(h) {
              return E("th", { key:h[0], style:{background:"#1e3a5f",color:"#fff",padding:"9px 10px",textAlign:"left",fontSize:11,whiteSpace:"nowrap",position:"sticky",top:0,zIndex:1,width:h[1]} }, h[0]);
            })
          )),
          E("tbody", null,
            itensFilt.length === 0
              ? E("tr", null, E("td", { colSpan:10, style:{textAlign:"center",padding:24,color:"#888",fontSize:13} }, "Nenhum item encontrado."))
              : itensFilt.map(function(it) {
                  var ativo = it.ativo !== false;
                  var assoc = temAssoc(it._idx);
                  var saldo = calcSaldo(it);
                  return E("tr", { key:it._idx, style:{borderBottom:"1px solid #e5e7eb",background:!ativo?"#f9f9f9":assoc?"#f0fff4":"#fff",opacity:!ativo?0.6:1} },
                    E("td", { style:{padding:"7px 10px",fontSize:11} }, it.codigo||"-"),
                    E("td", { style:{padding:"7px 10px",fontSize:11} }, it.descricao||""),
                    E("td", { style:{padding:"7px 10px",fontSize:11,textAlign:"center"} }, it.unidade||""),
                    E("td", { style:{padding:"7px 10px",fontSize:11,textAlign:"right"} }, fmtN(it.quantidade)),
                    E("td", { style:{padding:"7px 10px",fontSize:11,textAlign:"right"} }, fmtN(it.consumido||0)),
                    E("td", { style:{padding:"7px 10px",fontSize:11,fontWeight:700,textAlign:"right",color:saldo>0?"#057a55":"#6b7280"} }, fmtN(saldo)),
                    E("td", { style:{padding:"7px 10px",fontSize:11,textAlign:"right"} }, "R$ "+fmtN(it.valorUnitario||0)),
                    E("td", null, E("span", { style:{display:"inline-block",padding:"2px 8px",borderRadius:10,fontSize:10,fontWeight:700,background:ativo?"#def7ec":"#fde8e8",color:ativo?"#057a55":"#c81e1e",margin:"7px 10px"} }, ativo?"ATIVO":"INATIVO")),
                    E("td", null, E("span", { style:{display:"inline-block",padding:"2px 8px",borderRadius:10,fontSize:10,fontWeight:700,background:assoc?"#e1effe":"#f3f4f6",color:assoc?"#1a56db":"#6b7280",margin:"7px 10px"} }, assoc?"ASSOC.":"LIVRE")),
                    E("td", { style:{padding:"5px 10px",whiteSpace:"nowrap"} },
                      ativo && !assoc && E("button", { onClick:function(){ setPopupForm({modo:"editar",it:it}); }, style:{padding:"3px 7px",borderRadius:4,border:"none",cursor:"pointer",fontSize:11,fontWeight:600,background:"#e1effe",color:"#1a56db",marginRight:3} }, "EDITAR"),
                      ativo && E("button", { onClick:function(){ handleInativar(it); }, style:{padding:"3px 7px",borderRadius:4,border:"none",cursor:"pointer",fontSize:11,fontWeight:600,background:"#fde8e8",color:"#c81e1e",marginRight:3} }, "INATIVAR"),
                      !ativo && E("button", { onClick:function(){ handleReativar(it); }, style:{padding:"3px 7px",borderRadius:4,border:"none",cursor:"pointer",fontSize:11,fontWeight:600,background:"#def7ec",color:"#057a55",marginRight:3} }, "REATIVAR"),
                      !assoc && E("button", { onClick:function(){ handleExcluir(it); }, style:{padding:"3px 7px",borderRadius:4,border:"none",cursor:"pointer",fontSize:11,fontWeight:600,background:"#fde8e8",color:"#c81e1e"} }, "EXCLUIR")
                    )
                  );
                })
          )
        )
      ),
      E("div", { style:{padding:"10px 20px",background:"#f8f9fb",borderTop:"1px solid #e0e4ec",display:"flex",justifyContent:"space-between",alignItems:"center"} },
        E("span", { style:{fontSize:11,color:"#6b7280"} }, "Total: "+itensRef.current.length+" | "+totAt+" ativos | "+totIn+" inativos | "+totAs+" com assoc."),
        E("div", { style:{display:"flex",gap:8} },
          E("button", { onClick:onClose, style:{background:"#e5e7eb",color:"#374151",border:"none",borderRadius:6,padding:"7px 16px",fontWeight:700,fontSize:12,cursor:"pointer"} }, "FECHAR"),
          E("button", { onClick:handleSalvar, disabled:salvando, style:{background:"#057a55",color:"#fff",border:"none",borderRadius:6,padding:"7px 16px",fontWeight:700,fontSize:12,cursor:"pointer"} }, salvando?"SALVANDO...":"SALVAR ALTERACOES")
        )
      ),
      popupInativar && E("div", { style:{position:"fixed",top:0,left:0,width:"100%",height:"100%",background:"rgba(0,0,0,0.5)",zIndex:4000,display:"flex",alignItems:"center",justifyContent:"center"} },
        E("div", { style:{background:"#fff",borderRadius:10,padding:28,maxWidth:420,width:"90%",boxShadow:"0 8px 32px rgba(0,0,0,0.2)",textAlign:"center"} },
          E("h4", { style:{fontSize:15,color:"#0f1f3d",marginBottom:8} }, "INATIVAR ITEM"),
          E("p", { style:{fontSize:13,color:"#374151",margin:"10px 0",fontWeight:700} }, popupInativar.descricao),
          E("p", { style:{fontSize:12,color:"#6b7280"} }, "Saldo: "+fmtN(calcSaldo(popupInativar))+" "+(popupInativar.unidade||"")),
          E("p", { style:{fontSize:13,color:"#6b7280",margin:"10px 0"} }, "Deseja criar novo item com o saldo restante?"),
          E("div", { style:{display:"flex",gap:12,justifyContent:"center",marginTop:16} },
            E("button", { onClick:function(){ confirmarInativar(true); }, style:{background:"#057a55",color:"#fff",padding:"10px 24px",border:"none",borderRadius:6,fontSize:13,fontWeight:700,cursor:"pointer"} }, "SIM, CRIAR ITEM"),
            E("button", { onClick:function(){ confirmarInativar(false); }, style:{background:"#e5e7eb",color:"#374151",padding:"10px 24px",border:"none",borderRadius:6,fontSize:13,fontWeight:700,cursor:"pointer"} }, "NAO")
          )
        )
      ),
      popupForm && E("div", { style:{position:"fixed",top:0,left:0,width:"100%",height:"100%",background:"rgba(0,0,0,0.5)",zIndex:4000,display:"flex",alignItems:"center",justifyContent:"center"} },
        E(FormItemOrcamento, { modo:popupForm.modo, item:popupForm.it, onSalvar:handleSalvarForm, onCancelar:function(){ setPopupForm(null); } })
      )
    )
  );
}

function FormItemOrcamento(_ref_form) {
  var modo = _ref_form.modo, item = _ref_form.item, onSalvar = _ref_form.onSalvar, onCancelar = _ref_form.onCancelar;
  var _sC = React.useState(item.codigo||""), vC = _sC[0], setC = _sC[1];
  var _sD = React.useState(item.descricao||""), vD = _sD[0], setD = _sD[1];
  var _sU = React.useState(item.unidade||""), vU = _sU[0], setU = _sU[1];
  var _sQ = React.useState(String(item.quantidade||"")), vQ = _sQ[0], setQ = _sQ[1];
  var _sV = React.useState(String(item.valorUnitario||"")), vV = _sV[0], setV = _sV[1];
  var _sO = React.useState(item.observacao||""), vO = _sO[0], setO = _sO[1];
  var inp = {width:"100%",padding:"8px 10px",border:"1px solid #d1d5db",borderRadius:6,fontSize:13,boxSizing:"border-box"};
  var lbl = {display:"block",fontSize:11,fontWeight:700,color:"#374151",marginBottom:4};
  var E = React.createElement;
  return E("div", { style:{background:"#fff",borderRadius:10,padding:24,maxWidth:500,width:"90%",boxShadow:"0 8px 32px rgba(0,0,0,0.2)"} },
    E("h4", { style:{fontSize:14,color:"#0f1f3d",marginBottom:16,fontWeight:700} }, modo==="editar"?"EDITAR ITEM":"ADICIONAR ITEM AO ORCAMENTO"),
    E("div", { style:{marginBottom:10} }, E("label", { style:lbl }, "CODIGO"), E("input", { type:"text", value:vC, onChange:function(e){setC(e.target.value.replace(/[^0-9]/g,""));}, style:inp })),
    E("div", { style:{marginBottom:10} }, E("label", { style:lbl }, "DESCRICAO *"), E("input", { type:"text", value:vD, onChange:function(e){setD(e.target.value);}, style:inp })),
    E("div", { style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:10} },
      E("div", null, E("label", { style:lbl }, "UNIDADE *"), E("input", { type:"text", value:vU, onChange:function(e){setU(e.target.value);}, style:inp })),
      E("div", null, E("label", { style:lbl }, "QT. PREVISTA *"), E("input", { type:"number", value:vQ, onChange:function(e){setQ(e.target.value);}, style:inp }))
    ),
    E("div", { style:{marginBottom:10} }, E("label", { style:lbl }, "VALOR UNITARIO (R$)"), E("input", { type:"number", value:vV, onChange:function(e){setV(e.target.value);}, style:inp })),
    E("div", { style:{marginBottom:14} }, E("label", { style:lbl }, "OBSERVACAO (MOTIVO)"),
      E("textarea", { value:vO, onChange:function(e){setO(e.target.value);}, rows:3, style:Object.assign({},inp,{resize:"vertical",textTransform:"uppercase"}) })
    ),
    E("div", { style:{display:"flex",gap:10,justifyContent:"flex-end"} },
      E("button", { onClick:onCancelar, style:{background:"#e5e7eb",color:"#374151",border:"none",borderRadius:6,padding:"8px 18px",fontWeight:700,fontSize:12,cursor:"pointer"} }, "CANCELAR"),
      E("button", { onClick:function(){
        // FIX: UNIDADE e QT. PREVISTA já eram marcadas com "*" (obrigatório) na interface, mas só
        // a Descrição era validada de verdade — permitia salvar um item de orçamento incompleto
        // sem nenhum aviso, mesmo a tela sugerindo visualmente que esses campos eram obrigatórios.
        if(!vD.trim()){ alert("DESCRICAO OBRIGATORIA!"); return; }
        if(!vU.trim()){ alert("UNIDADE OBRIGATORIA!"); return; }
        if(!vQ || Number(String(vQ).replace(",",".")) <= 0){ alert("QUANTIDADE PREVISTA DEVE SER MAIOR QUE ZERO!"); return; }
        onSalvar({codigo:vC,descricao:vD,unidade:vU,quantidade:vQ,valorUnitario:vV,observacao:vO});
      }, style:{background:"#1a56db",color:"#fff",border:"none",borderRadius:6,padding:"8px 18px",fontWeight:700,fontSize:12,cursor:"pointer"} }, "SALVAR")
    )
  );
}

function ModalImportarOrcamento(_ref_orc) {
  var open = _ref_orc.open,
    onClose = _ref_orc.onClose,
    obra = _ref_orc.obra,
    orcamentoAtual = _ref_orc.orcamentoAtual,
    onSalvar = _ref_orc.onSalvar;
  var _s1 = React.useState([]), preview = _slicedToArray(_s1,2)[0], setPreview = _slicedToArray(_s1,2)[1];
  var _s2 = React.useState(""), erro = _slicedToArray(_s2,2)[0], setErro = _slicedToArray(_s2,2)[1];
  var _s3 = React.useState(false), proc = _slicedToArray(_s3,2)[0], setProc = _slicedToArray(_s3,2)[1];

  var handleArquivo = function(e) {
    var file = e.target.files[0]; if (!file) return;
    setProc(true); setErro(""); setPreview([]);
    var reader = new FileReader();
    reader.onload = function(ev) {
      try {
        var wb = XLSX.read(new Uint8Array(ev.target.result), { type: "array" });
        var sheet = wb.Sheets[wb.SheetNames[0]];
        var rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
        var hi=-1, cd=-1, cu=-1, cq=-1, cv=-1, cc=-1;
        for (var i=0; i<Math.min(10,rows.length); i++) {
          var row = rows[i].map(function(c){ return String(c).toUpperCase().trim(); });
          var di = row.findIndex(function(c){ return c.includes("DESCRI"); });
          if (di >= 0) {
            hi=i; cd=di;
            cc = row.findIndex(function(c){ return c.includes("C\xD3D")||c==="CODIGO"||c==="C\xD3DIGO"; });
            cu = row.findIndex(function(c){ return c==="UND"||c==="UN"||c.includes("UNID"); });
            cq = row.findIndex(function(c){ return c.includes("QUANT"); });
            cv = row.findIndex(function(c){ return c.includes("UNIT"); });
            break;
          }
        }
        if (hi < 0) { setErro("N\xe3o foi poss\xedvel identificar as colunas."); setProc(false); return; }
        var itens = [];
        for (var j=hi+1; j<rows.length; j++) {
          var r = rows[j];
          var desc = String(r[cd]||"").trim().toUpperCase();
          if (!desc) continue;
          itens.push({
            codigo: cc>=0 ? String(r[cc]||"").trim() : String(j),
            descricao: desc,
            unidade: cu>=0 ? String(r[cu]||"UN").trim().toUpperCase() : "UN",
            quantidade: parseFloat(String(r[cq]||"0").replace(",","."))||0,
            valorUnitario: parseFloat(String(r[cv]||"0").replace(",","."))||0,
            consumido: 0
          });
        }
        if (!itens.length) { setErro("Nenhum item encontrado."); setProc(false); return; }
        setPreview(itens); setProc(false);
      } catch(err) { setErro("Erro: "+err.message); setProc(false); }
    };
    reader.readAsArrayBuffer(file);
  };

  var handleSalvar = function() {
    if (!preview.length) return;
    var antigos = (orcamentoAtual && orcamentoAtual.itens) || [];
    var itensFinais = preview.map(function(novo) {
      var ant = antigos.find(function(a){ return a.codigo === novo.codigo; });
      if (!ant) return novo;
      // FIX (decisão confirmada com o Claudio): reimportar preservava o "consumido" por código,
      // mas não preservava se o item tinha sido inativado manualmente antes — a planilha nova
      // reativava esse item sem aviso. Inativar é uma ação deliberada; reimportar não deveria
      // desfazer isso silenciosamente. Segue a mesma lógica (buscar por código) já usada acima
      // para o consumido.
      var camposPreservados = { consumido: ant.consumido||0 };
      if (ant.ativo === false) camposPreservados.ativo = false;
      return Object.assign({}, novo, camposPreservados);
    });
    onSalvar({ obra: obra, itens: itensFinais, importadoEm: new Date().toISOString() });
    setPreview([]); onClose();
  };

  if (!open) return null;
  return /*#__PURE__*/React.createElement(Modal, { open: open, onClose: onClose, maxWidth: 680 },
    /*#__PURE__*/React.createElement("div", { style: SC.mHdr },
      /*#__PURE__*/React.createElement("span", { style: SC.mTitle }, "\ud83d\udcce IMPORTAR OR\xc7AMENTO \u2014 ", obra),
      /*#__PURE__*/React.createElement("button", { style:{background:"none",border:"none",color:"#999",cursor:"pointer"}, onClick: onClose },
        /*#__PURE__*/React.createElement(IcoClose, null))),
    /*#__PURE__*/React.createElement("div", { style:{padding:"16px 22px 20px",display:"flex",flexDirection:"column",gap:14} },
      orcamentoAtual && /*#__PURE__*/React.createElement("div", { style:{background:"#e8f6ee",border:"1px solid #8ecba8",borderRadius:7,padding:"8px 12px",fontSize:12,color:"#1a5030"} },
        "\u2705 Or\xe7amento existente com ", (orcamentoAtual.itens||[]).length, " itens. Reimportar preserva saldos."),
      /*#__PURE__*/React.createElement("div", { style:{background:"#f5f8ff",border:"2px dashed #b0c4e8",borderRadius:8,padding:"20px",textAlign:"center"} },
        /*#__PURE__*/React.createElement("div", { style:{fontSize:13,color:"#2a5298",fontWeight:700,marginBottom:8} }, "\ud83d\udcc2 SELECIONAR ARQUIVO EXCEL DO OR\xc7AMENTO"),
        /*#__PURE__*/React.createElement("div", { style:{fontSize:11,color:"#888",marginBottom:12} }, "Formatos aceitos: .xlsx \u2014 O sistema detecta automaticamente as colunas de Descri\xe7\xe3o, Unidade, Quantidade e Valor Unit\xe1rio"),
        /*#__PURE__*/React.createElement("input", { type:"file", accept:".xlsx,.xls", onChange:handleArquivo, style:{fontSize:12} })),
      proc && /*#__PURE__*/React.createElement("div", { style:{textAlign:"center",color:"#2a5298",fontSize:13} }, "\u23f3 Processando arquivo..."),
      erro && /*#__PURE__*/React.createElement("div", { style:{background:"#fdeaea",border:"1px solid #e8a0a0",borderRadius:7,padding:"8px 12px",fontSize:12,color:"#b82222"} }, "\u274c ", erro),
      preview.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null,
        /*#__PURE__*/React.createElement("div", { style:{background:"#e8f0ff",borderRadius:7,padding:"8px 12px",fontSize:12,color:"#1a3a8e",fontWeight:700} },
          "\u2705 ", preview.length, " itens identificados. Confira e clique em SALVAR."),
        /*#__PURE__*/React.createElement("div", { style:{maxHeight:220,overflowY:"auto",border:"1px solid #e4e8f0",borderRadius:8} },
          /*#__PURE__*/React.createElement("table", { style:{borderCollapse:"collapse",width:"100%",fontSize:11} },
            /*#__PURE__*/React.createElement("thead", null,
              /*#__PURE__*/React.createElement("tr", null,
                /*#__PURE__*/React.createElement("th", { style:{background:"#2a5298",color:"#fff",padding:"6px 8px",textAlign:"left"} }, "DESCRI\xc7\xc3O"),
                /*#__PURE__*/React.createElement("th", { style:{background:"#2a5298",color:"#fff",padding:"6px 8px",width:50} }, "UND"),
                /*#__PURE__*/React.createElement("th", { style:{background:"#2a5298",color:"#fff",padding:"6px 8px",width:90,textAlign:"right"} }, "QUANTIDADE"),
                /*#__PURE__*/React.createElement("th", { style:{background:"#2a5298",color:"#fff",padding:"6px 8px",width:90,textAlign:"right"} }, "VL. UNIT."))),
            /*#__PURE__*/React.createElement("tbody", null,
              preview.slice(0,50).map(function(it,i) {
                return /*#__PURE__*/React.createElement("tr", { key:i, style:{background:i%2===0?"#fff":"#f5f8ff"} },
                  /*#__PURE__*/React.createElement("td", { style:{padding:"5px 8px",borderBottom:"1px solid #eee"} }, it.descricao),
                  /*#__PURE__*/React.createElement("td", { style:{padding:"5px 8px",borderBottom:"1px solid #eee",textAlign:"center"} }, it.unidade),
                  /*#__PURE__*/React.createElement("td", { style:{padding:"5px 8px",borderBottom:"1px solid #eee",textAlign:"right"} }, it.quantidade.toLocaleString("pt-BR",{maximumFractionDigits:3})),
                  /*#__PURE__*/React.createElement("td", { style:{padding:"5px 8px",borderBottom:"1px solid #eee",textAlign:"right"} }, it.valorUnitario.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})));
              }),
              preview.length > 50 && /*#__PURE__*/React.createElement("tr", null,
                /*#__PURE__*/React.createElement("td", { colSpan:4, style:{padding:"8px",textAlign:"center",color:"#888"} }, "... e mais ", preview.length-50, " itens"))
            ))),
        /*#__PURE__*/React.createElement("button", {
          onClick: handleSalvar,
          style: Object.assign({}, SC.btnPri, {fontSize:13,padding:"10px 24px",alignSelf:"flex-end"})
        }, "\ud83d\udcbe SALVAR OR\xc7AMENTO \u2014 ", preview.length, " ITENS"))));
}

// ─── Reports Modal ────────────────────────────────────────────────────────────
