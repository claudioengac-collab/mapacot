function ModalCasarInsumos(_ref_cas) {
  var mapa=_ref_cas.mapa, itens=_ref_cas.itens, onClose=_ref_cas.onClose, onConfirm=_ref_cas.onConfirm;
  var onAprendizadoSalvo=_ref_cas.onAprendizadoSalvo||function(){};
  var _sF=useState(""),   fornId=_slicedToArray(_sF,2)[0],    setFornId=_slicedToArray(_sF,2)[1];
  var _sCarr=useState(false),carregando=_slicedToArray(_sCarr,2)[0],setCarregando=_slicedToArray(_sCarr,2)[1];
  var _sI=useState([]),   itemsOrc=_slicedToArray(_sI,2)[0],  setItemsOrc=_slicedToArray(_sI,2)[1];
  var _sL=useState(null), selMId=_slicedToArray(_sL,2)[0],    setSelMId=_slicedToArray(_sL,2)[1];
  var _sR=useState(null), selOIdx=_slicedToArray(_sR,2)[0],   setSelOIdx=_slicedToArray(_sR,2)[1];
  var _sLig=useState({}), ligs=_slicedToArray(_sLig,2)[0],    setLigs=_slicedToArray(_sLig,2)[1];
  var _sB1=useState(""),  busca1=_slicedToArray(_sB1,2)[0],   setBusca1=_slicedToArray(_sB1,2)[1];
  var _sB2=useState(""),  busca2=_slicedToArray(_sB2,2)[0],   setBusca2=_slicedToArray(_sB2,2)[1];
  var forns = mapa.fornecedores || [];
  var fornNome = (forns.find(function(f){return f.id===fornId;})||{}).nome || "";
  var parsearTexto = function(txt) {
    var parsed = [];
    txt.split("\n").forEach(function(linha) {
      linha = linha.trim(); if (linha.length < 4) return;
      var nums = linha.match(/(\d{1,3}(?:\.\d{3})*,\d{2}|\d+,\d{2})/g);
      if (!nums || !nums.length) return;
      var lastNum = nums[nums.length-1];
      var preco = parseFloat(lastNum.replace(/\./g,"").replace(",","."));
      if (preco <= 0 || preco > 9999999) return;
      var desc = linha.slice(0,linha.lastIndexOf(lastNum)).replace(/^\d+\s*/,"").replace(/\s{2,}/g," ").trim().toUpperCase();
      if (desc.length > 3) parsed.push({desc:desc,preco:preco});
    });
    return parsed;
  };
  // parsearPDFTexto: casa descricao+total com qtd*unit via pdfjsLib
  // parsearPDFTexto v2: aceita Title Case E MAIÚSCULAS, 2 estratégias
  var parsearPDFTexto = function(textos) {
    var PRECO=/^([\d]{1,3}(?:\.[\d]{3})*,[\d]{2})$/;
    // ESTRATEGIA 3 (Corr Plastik): preco unitario com 3-4 casas decimais (ex: "124,5000", "85,8000")
    var PRECO4=/^([\d]{1,3}(?:\.[\d]{3})*,[\d]{3,4})$/;
    var ehCab=function(s){
      var st=s.trim();
      // Palavras-chave únicas (match exato)
      if(/^(ITEM|C[O\u00D3]D\.?|AMAR|QTDE?\.?|QT\.?|UN\.?|UNID\.?|UNIT[A\u00C1]RIO|UNITARIO|TOTAL|DESCRI[C\u00C7][A\u00C3]O|DESCR\.?|VALOR|VLR\.?|PRE[C\u00C7]O|FRETE|IMPOSTO|SUB[\s-]?TOTAL|PESO|OBS\.?|OBSERV|BANCO|CONTA|PIX|CNPJ|CPF|CEP|TELEFONE|FONE|E-?MAIL|CONTATO|ESTADO|CIDADE|ENDERE|BAIRRO|VENC|PRAZO|VALIDADE|CONDI|REPRESENT|VENDEDOR|CLIENTE|TIPO|FORMA|SITUA|NF|NOTA|DATA|PEDIDO|OR[C\u00C7]AMENTO)$/i.test(st)) return true;
      // Cabeçalhos compostos: filtrar linhas de totais/rodapé (ex: "VALOR TOTAL DAS MERCADORIAS:")
      if(/^(VALOR TOTAL|TOTAL GERAL|TOTAL BRUTO|TOTAL L[I\u00CD]QUIDO|PESO TOTAL|PESO L[I\u00CD]QUIDO|VALOR DO IPI|TOTAL DO IPI|VALOR TOTAL DO|DEMAIS CONDI)/i.test(st)) return true;
      return false;
    };
    var descTotais=[],unitPrecos=[],items=[],usados=[];
    for (var i=0;i<textos.length;i++) {
      var t=textos[i].trim(), prox=(textos[i+1]||"").trim();
      // Preco unitario: XX,XX seguido de R$ (coluna esquerda — Luperplas)
      var pu=t.match(PRECO);
      if (pu && prox==="R$") {
        var unit=parseFloat(pu[1].replace(/\./g,"").replace(",","."));
        var qty=parseFloat((textos[i-1]||"").trim());
        if (qty>0&&unit>0) unitPrecos.push({qty:qty,unit:unit});
      }
      // Descricao: aceita Title Case E MAIUSCULAS, filtra cabecalhos
      var ehDesc=t.length>7&&/^[A-Z\u00C0-\u00D6\u00D8-\u00DE]/.test(t)&&/[a-zA-Z\u00C0-\u00FF]{3,}/.test(t)&&/\s/.test(t)&&!ehCab(t)&&!/^\d+$/.test(t)&&!/^[\d\.\,\-\/\s]+$/.test(t);
      if (ehDesc) {
        // Janela de 6 posicoes para encontrar o preco
        // NOVO: detecta preco unitario com 3-4 decimais antes do total com 2 decimais
        var prevUnit4=null;
        for (var j=i+1;j<=i+6&&j<textos.length;j++) {
          var tj=(textos[j]||"").trim();
          // Preco unitario com 3-4 decimais (Corr Plastik): armazena e continua buscando o total
          if (PRECO4.test(tj)&&!PRECO.test(tj)) { prevUnit4=parseFloat(tj.replace(/\./g,"").replace(",","."));continue; }
          var pm=tj.match(PRECO);
          if (pm) {
            var tot=parseFloat(pm[1].replace(/\./g,"").replace(",","."));
            if(tot>0&&tot<9999999) {
              // Tenta validar: se prevUnit4 existe, verifica se alguma qty * prevUnit4 ≈ total
              if (prevUnit4&&prevUnit4>0) {
                var validado=false;
                for(var k=i+1;k<j;k++){
                  var vq=parseFloat((textos[k]||"").trim().replace(",","."));
                  if(vq>0&&Math.abs(vq*prevUnit4-tot)/Math.max(tot,1)<0.03){
                    descTotais.push({desc:t.toUpperCase(),total:prevUnit4,idx:i}); validado=true; break;
                  }
                }
                if(!validado) descTotais.push({desc:t.toUpperCase(),total:tot,idx:i});
              } else {
                descTotais.push({desc:t.toUpperCase(),total:tot,idx:i});
              }
              break;
            }
          }
          if (tj.length>10&&/[a-zA-Z]{4,}/.test(tj)&&/\s/.test(tj)&&!ehCab(tj)&&!/^\d+$/.test(tj)) break;
          if (!PRECO4.test(tj)) prevUnit4=null; // reset se token nao e PRECO4
        }
      }
    }
    // Estrategia 1 (Luperplas): casar desc+total com qtd×unit
    if (unitPrecos.length>0) {
      descTotais.forEach(function(dt){
        for(var i=0;i<unitPrecos.length;i++){
          if(usados.indexOf(i)>=0) continue;
          var exp=unitPrecos[i].qty*unitPrecos[i].unit;
          if(exp>0&&Math.abs(exp-dt.total)/Math.max(dt.total,1)<0.02){
            items.push({desc:dt.desc,preco:unitPrecos[i].unit}); usados.push(i); return;
          }
        }
      });
      if(items.length>0) return items;
    }
    // Estrategia 2 (generica): usar o preco encontrado diretamente
    var usedIdx=[];
    descTotais.forEach(function(dt){
      if(usedIdx.indexOf(dt.idx)<0){items.push({desc:dt.desc,preco:dt.total});usedIdx.push(dt.idx);}
    });
    return items;
  };

  var parsearPDF = function(file, cb) {
    if (typeof pdfjsLib === "undefined") { cb([], new Error("PDF.js nao carregado")); return; }
    pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";
    var rd = new FileReader();
    rd.onload = function(e) {
      pdfjsLib.getDocument({data: new Uint8Array(e.target.result)}).promise
        .then(function(pdf) { return pdf.getPage(1).then(function(pg){ return pg.getTextContent(); }); })
        .then(function(content) {
          var txts = (content.items||[]).map(function(it){ return it.str||""; }).filter(function(s){ return s.trim()!==""; });
          cb(txts, null);
        })
        .catch(function(err){ cb([], err); });
    };
    rd.onerror = function(){ cb([], new Error("Erro")); };
    rd.readAsArrayBuffer(file);
  };
  var parsearXLSX = function(file, cb) {
    var rd = new FileReader();
    rd.onload = function(e) {
      try {
        var wb = XLSX.read(new Uint8Array(e.target.result), {type:"array"});
        var ws = wb.Sheets[wb.SheetNames[0]];
        var aoa = XLSX.utils.sheet_to_json(ws, {header:1, defval:""});
        var items = [];
        aoa.forEach(function(row) {
          var numCols = [];
          row.forEach(function(cell, i) {
            var n = typeof cell === "number" ? cell : parseFloat(String(cell).replace(/\./g,"").replace(",","."));
            if (!isNaN(n) && n > 0 && n < 9999999) numCols.push({val:n, idx:i});
          });
          if (!numCols.length) return;
          var lastN = numCols[numCols.length-1];
          var desc = row.slice(0, lastN.idx).map(function(v){return String(v).trim();}).filter(function(v){return v&&isNaN(parseFloat(v));}).join(" ").trim().toUpperCase();
          if (desc.length > 3) items.push({desc:desc, preco:lastN.val});
        });
        cb(items, null);
      } catch(err) { cb([], err); }
    };
    rd.onerror = function(){ cb([], new Error("Erro")); };
    rd.readAsArrayBuffer(file);
  };
  var handleFile = function(ev) {
    var file = ev.target.files[0]; ev.target.value=""; if (!file) return;
    var ext = file.name.split(".").pop().toLowerCase();
    setCarregando(true);
    if (ext === "pdf") {
      parsearPDF(file, function(textos, err) {
        setCarregando(false);
        if (err) { alert("ERRO AO LER PDF: " + (err.message||err)); return; }
        if (!textos.length) { alert("N\xC3O FOI POSS\xCDVEL EXTRAIR TEXTO DO PDF.\nVerifique se o PDF tem texto selecion\xE1vel (n\xE3o pode ser imagem escaneada)."); return; }
        var items = parsearPDFTexto(textos);
        if (!items.length) { alert("NENHUM ITEM COM PRE\xC7O ENCONTRADO NO PDF.\nTente converter o PDF em Excel ou CSV."); return; }
        setItemsOrc(items);
      });
    } else if (ext === "xlsx" || ext === "xls") {
      parsearXLSX(file, function(items, err) {
        setCarregando(false);
        if (err || !items.length) { alert("NENHUM ITEM ENCONTRADO. VERIFIQUE SE O EXCEL CONT\xC9M COLUNAS DE DESCRI\xC7\xC3O E PRE\xC7O."); return; }
        setItemsOrc(items);
      });
    } else {
      var rd2 = new FileReader();
      rd2.onload = function(e2){ setCarregando(false); var items=parsearTexto(e2.target.result); if(!items.length){alert("NENHUM ITEM ENCONTRADO NO ARQUIVO.");return;} setItemsOrc(items); };
      rd2.onerror = function(){ setCarregando(false); alert("ERRO AO LER O ARQUIVO."); };
      rd2.readAsText(file, "UTF-8");
    }
  };
  var ligar = function() {
    if (!fornId) { alert("SELECIONE O FORNECEDOR ANTES DE LIGAR."); return; }
    if (!selMId || selOIdx === null) return;
    var orc = itemsOrc[selOIdx]; if (!orc) return;
    var novo = Object.assign({},ligs);
    novo[selMId]={descPDF:orc.desc,preco:orc.preco,fornId:fornId,orcIdx:selOIdx};
    setLigs(novo); setSelMId(null); setSelOIdx(null);
  };
  var desligar = function(mid){var n=Object.assign({},ligs);delete n[mid];setLigs(n);};
  var confirmar = function(){
    if(!Object.keys(ligs).length){alert("NENHUMA LIGA\xC7\xC3O CRIADA.");return;}
    // Alimenta a memória: cada "ligação" ensina que aquele texto do orçamento é aquele insumo do mapa
    Object.keys(ligs).forEach(function(mid){
      var itemMapa = itens.find(function(i){ return i.id === mid; });
      if(itemMapa && itemMapa.descricao) onAprendizadoSalvo(ligs[mid].descPDF, itemMapa.descricao);
    });
    onConfirm(ligs);
  };
  var nLig=Object.keys(ligs).length;
  var podeLinkar=!!(fornId&&selMId&&selOIdx!==null);
  var filtM=itens.filter(function(it){return !busca1||(it.descricao||"").toUpperCase().includes(busca1.toUpperCase());});
  var filtO=itemsOrc.map(function(it,i){return{it:it,i:i};}).filter(function(x){return !busca2||x.it.desc.includes(busca2.toUpperCase());});
  var CE=React.createElement;
  var stOvl={position:"fixed",inset:0,background:"rgba(10,20,50,0.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200};
  var stMod={background:"#fff",borderRadius:14,width:"96vw",maxWidth:900,maxHeight:"92vh",display:"flex",flexDirection:"column",overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,0.3)"};
  var stHdr={background:"#2a5298",color:"#fff",padding:"14px 20px",display:"flex",alignItems:"center",gap:10};
  var stFBar={background:"#f0f4ff",borderBottom:"1px solid #dde4f5",padding:"10px 20px",display:"flex",alignItems:"center",gap:10,fontSize:12};
  var stSel={border:"1.5px solid #c5d8f0",borderRadius:6,padding:"5px 10px",fontSize:12,color:"#2a5298",fontWeight:700,background:"#fff",outline:"none",cursor:"pointer"};
  var stPan={flex:1,display:"flex",flexDirection:"column",overflow:"hidden",borderRight:"2px solid #e4e8f5"};
  var stPanR={flex:1,display:"flex",flexDirection:"column",overflow:"hidden"};
  var stPHdr={padding:"10px 14px 8px",borderBottom:"1px solid #eef0f8",display:"flex",alignItems:"center",gap:8};
  var stPTit={fontSize:11,fontWeight:800,color:"#2a5298",flex:1,letterSpacing:0.5};
  var stCnt={background:"#e8f0fe",color:"#2a5298",borderRadius:10,padding:"1px 8px",fontSize:10,fontWeight:700};
  var stSrch={margin:"6px 10px",border:"1.5px solid #dde4f5",borderRadius:6,padding:"4px 9px",fontSize:11,outline:"none",fontFamily:"inherit"};
  var stInst={background:"#fffbe8",border:"1px solid #f0d060",borderRadius:6,padding:"5px 10px",fontSize:10,color:"#7a6010",textAlign:"center",margin:"0 10px 6px",lineHeight:1.4};
  var stList={overflowY:"auto",flex:1,padding:"2px 0"};
  var stLnkZ={display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",width:56,flexShrink:0,background:"#f8f9ff",borderLeft:"1px solid #e4e8f5",borderRight:"1px solid #e4e8f5",gap:12};
  var stBtnL={background:podeLinkar?"#2a5298":"#bbb",color:"#fff",border:"none",borderRadius:8,padding:"10px 6px",cursor:podeLinkar?"pointer":"not-allowed",display:"flex",flexDirection:"column",alignItems:"center",gap:3,width:40};
  var stLoad={margin:"8px 10px",border:"2px dashed #c5d8f0",borderRadius:8,padding:"14px 10px",textAlign:"center",cursor:"pointer",color:"#7a9abf",fontSize:11,background:"#f8faff"};
  var stFtr={padding:"12px 20px",borderTop:"1px solid #eef0f8",background:"#fafbff",display:"flex",alignItems:"center",gap:10};
  var stSalv={background:nLig>0?"#186818":"#bbb",color:"#fff",border:"none",borderRadius:8,padding:"9px 18px",fontSize:12,fontWeight:800,cursor:nLig>0?"pointer":"not-allowed",marginLeft:"auto",display:"flex",alignItems:"center",gap:6};
  return CE("div",{style:stOvl},
    CE("div",{style:stMod},
      CE("div",{style:stHdr},
        CE("span",{style:{fontSize:18}},"\uD83D\uDD17"),
        CE("h2",{style:{fontSize:14,fontWeight:800,flex:1,margin:0}},"CASAR INSUMOS COM OR\xC7AMENTO"),
        CE("span",{style:{background:"rgba(255,255,255,0.18)",borderRadius:5,padding:"3px 10px",fontSize:11,fontWeight:600}},"MP N\xBA "+mapa.numero),
        CE("button",{style:{background:"none",border:"none",color:"#fff",fontSize:22,cursor:"pointer",lineHeight:1},onClick:onClose},"\xD7")
      ),
      CE("div",{style:stFBar},
        CE("span",{style:{fontWeight:700,color:"#2a5298"}},"FORNECEDOR:"),
        CE("select",{value:fornId,onChange:function(e){setFornId(e.target.value);},style:stSel},
          CE("option",{value:""},"\u2014 SELECIONE \u2014"),
          forns.map(function(f){return CE("option",{key:f.id,value:f.id},f.nome);})
        ),
        CE("span",{style:{color:"#888",marginLeft:6,fontSize:11}},"Selecione e carregue o or\xE7amento \u2192")
      ),
      CE("div",{style:{display:"flex",flex:1,overflow:"hidden"}},
        CE("div",{style:stPan},
          CE("div",{style:stPHdr},CE("span",{style:stPTit},"\uD83D\uDCCB INSUMOS DO MAPA"),CE("span",{style:stCnt},itens.length+" ITENS")),
          CE("input",{value:busca1,onChange:function(e){setBusca1(e.target.value);},placeholder:"\uD83D\uDD0D Buscar insumo...",style:stSrch}),
          CE("div",{style:stInst},"\u2460 Clique em um insumo do mapa"),
          CE("div",{style:stList},filtM.map(function(it){
            var lig=ligs[it.id],isSel=selMId===it.id;
            return CE("div",{key:it.id,onClick:function(){if(!lig)setSelMId(isSel?null:it.id);},style:{padding:"8px 14px",borderBottom:"1px solid #f0f2f8",cursor:lig?"default":"pointer",background:lig?"#e6f4ea":isSel?"#dbeafe":"transparent",borderLeft:lig?"3px solid #186818":isSel?"3px solid #2a5298":"3px solid transparent",display:"flex",alignItems:"center",gap:8}},
              CE("div",{style:{width:8,height:8,borderRadius:"50%",background:lig?"#186818":isSel?"#2a5298":"#d0d8e8",flexShrink:0}}),
              CE("div",{style:{flex:1}},
                CE("div",{style:{fontSize:11,fontWeight:600,color:lig?"#186818":isSel?"#1a3a78":"#1a2a4a"}},it.descricao),
                CE("div",{style:{fontSize:10,color:"#888",marginTop:1}},it.qt+" "+(it.unid||""))
              ),
              lig?CE("div",{style:{display:"flex",alignItems:"center",gap:4}},
                CE("span",{style:{fontSize:9,background:"#186818",color:"#fff",borderRadius:3,padding:"1px 5px"}},"\u2713 CASADO"),
                CE("button",{onClick:function(e){e.stopPropagation();desligar(it.id);},style:{background:"#fdecea",border:"none",borderRadius:3,padding:"1px 6px",fontSize:10,color:"#c0392b",cursor:"pointer",fontWeight:700}},"\u2702")
              ):null
            );
          }))
        ),
        CE("div",{style:stLnkZ},
          CE("button",{onClick:ligar,disabled:!podeLinkar,title:"LIGAR",style:stBtnL},CE("span",{style:{fontSize:16}},"\uD83D\uDD17"),CE("small",{style:{fontSize:8,fontWeight:800}},"LIGAR")),
          CE("span",{style:{fontSize:14,color:"#bbb"}},"\u2194"),
          CE("button",{onClick:function(){if(selMId&&ligs[selMId])desligar(selMId);},title:"REMOVER",style:{background:"#fdecea",color:"#c0392b",border:"1px solid #f5c6c2",borderRadius:8,padding:"8px 6px",cursor:"pointer",fontSize:10,fontWeight:700,width:40,textAlign:"center"}},"\u2702 DEL")
        ),
        CE("div",{style:stPanR},
          CE("div",{style:stPHdr},CE("span",{style:stPTit},"\uD83D\uDCC4 OR\xC7AMENTO"+(fornNome?" \u2014 "+fornNome:"")),CE("span",{style:stCnt},itemsOrc.length+" ITENS")),
          CE("input",{value:busca2,onChange:function(e){setBusca2(e.target.value.toUpperCase());},placeholder:"\uD83D\uDD0D Buscar...",style:stSrch}),
          CE("div",{style:stInst},"\u2461 Clique no item e pressione LIGAR"),
          CE("label",{style:Object.assign({},stLoad,{display:"flex",flexDirection:"column",alignItems:"center",margin:"8px 10px",opacity:carregando?0.6:1})},
            CE("input",{type:"file",accept:".pdf,.xlsx,.xls,.csv,.txt",style:{display:"none"},onChange:handleFile}),
            carregando
              ?CE("div",{style:{fontSize:11,color:"#2a5298",fontWeight:700}},"Lendo arquivo...")
              :itemsOrc.length>0
                ?CE("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:3}},
                    CE("div",{style:{fontSize:20}},"\uD83D\uDCC2"),
                    CE("div",{style:{fontWeight:700,color:"#2a5298",fontSize:11}},"Alterar arquivo"),
                    CE("div",{style:{fontSize:10,color:"#888",marginTop:1}},itemsOrc.length+" itens carregados")
                  )
                :CE("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:3}},
                    CE("div",{style:{fontSize:22,marginBottom:2}},"\uD83D\uDCC2"),
                    CE("div",{style:{fontWeight:700,color:"#2a5298"}},"Carregar arquivo"),
                    CE("div",{style:{marginTop:2,color:"#888",fontSize:10}},"PDF, Excel (.xlsx), CSV ou TXT")
                  )
          ),
          CE("div",{style:stList},filtO.map(function(x){
            var it=x.it,idx=x.i,isSel=selOIdx===idx;
            var isLig=Object.values(ligs).some(function(l){return l.orcIdx===idx;});
            return CE("div",{key:idx,onClick:function(){if(!isLig)setSelOIdx(isSel?null:idx);},style:{padding:"8px 14px",borderBottom:"1px solid #f0f2f8",cursor:isLig?"default":"pointer",background:isLig?"#e6f4ea":isSel?"#fef3c7":"transparent",borderLeft:isLig?"3px solid #186818":isSel?"3px solid #f0a500":"3px solid transparent",display:"flex",alignItems:"center",gap:8}},
              CE("div",{style:{flex:1}},
                CE("div",{style:{fontSize:11,fontWeight:600,color:isLig?"#186818":isSel?"#92400e":"#1a2a4a"}},it.desc),
                CE("div",{style:{fontSize:11,fontWeight:800,color:"#186818",marginTop:2}},"R$ "+it.preco.toLocaleString("pt-BR",{minimumFractionDigits:2}))
              ),
              isLig?CE("span",{style:{fontSize:9,background:"#186818",color:"#fff",borderRadius:3,padding:"1px 5px"}},"\u2713"):null
            );
          }))
        )
      ),
      CE("div",{style:stFtr},
        CE("span",{style:{fontSize:12,color:"#555"}},"Liga\xE7\xF5es:"),
        CE("span",{style:{background:nLig>0?"#186818":"#ccc",color:"#fff",borderRadius:20,padding:"4px 12px",fontSize:11,fontWeight:700}},nLig+" "+(nLig===1?"CASADA":"CASADAS")),
        CE("button",{style:{background:"none",border:"1.5px solid #dde4f5",borderRadius:8,padding:"9px 16px",fontSize:12,fontWeight:600,color:"#666",cursor:"pointer"},onClick:onClose},"CANCELAR"),
        CE("button",{style:stSalv,disabled:nLig===0,onClick:confirmar},"\u2705 SALVAR E PREENCHER PRE\xC7OS")
      )
    )
  );
}

// ─── Modal Ensinar Sistema (Associar Insumos em Lote) ────────────────────────
function ModalEnsinarSistema(_ref_ens) {
  var cadastrosInsumos = _ref_ens.cadastrosInsumos || [];
  var aprendizados = _ref_ens.aprendizados || {};
  var onAprendizadoSalvo = _ref_ens.onAprendizadoSalvo || function(){};
  var onAprendizadoRemovido = _ref_ens.onAprendizadoRemovido || function(){ return Promise.resolve(false); };
  var onClose = _ref_ens.onClose;

  // FIX: trava a rolagem da p\u00e1gina de fundo (o mapa) enquanto este modal estiver aberto,
  // e devolve ao normal quando fechar - evita o scroll "vazar" pro mapa por tr\u00e1s
  useEffect(function(){
    var overflowOriginal = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return function(){ document.body.style.overflow = overflowOriginal; };
  }, []);

  var _sAba = useState('associar'), abaAtiva = _slicedToArray(_sAba,2)[0], setAbaAtiva = _slicedToArray(_sAba,2)[1];
  var _sBuscaConf = useState(''), buscaConferir = _slicedToArray(_sBuscaConf,2)[0], setBuscaConferir = _slicedToArray(_sBuscaConf,2)[1];
  var _sExcluindo = useState(null), excluindoChave = _slicedToArray(_sExcluindo,2)[0], setExcluindoChave = _slicedToArray(_sExcluindo,2)[1];
  var _sErroConf = useState(''), erroConferir = _slicedToArray(_sErroConf,2)[0], setErroConferir = _slicedToArray(_sErroConf,2)[1];

  var _sItens = useState([]), itensCarregados = _slicedToArray(_sItens,2)[0], setItensCarregados = _slicedToArray(_sItens,2)[1];
  var _sNumMapa = useState(''), numeroMapaBusca = _slicedToArray(_sNumMapa,2)[0], setNumeroMapaBusca = _slicedToArray(_sNumMapa,2)[1];
  var _sBuscMapa = useState(false), buscandoMapa = _slicedToArray(_sBuscMapa,2)[0], setBuscandoMapa = _slicedToArray(_sBuscMapa,2)[1];
  var _sFiltroMapa = useState(null), filtroInsumosMapa = _slicedToArray(_sFiltroMapa,2)[0], setFiltroInsumosMapa = _slicedToArray(_sFiltroMapa,2)[1];
  var _sCarr = useState(false), carregando = _slicedToArray(_sCarr,2)[0], setCarregando = _slicedToArray(_sCarr,2)[1];
  var _sBusca = useState(''), buscaDireita = _slicedToArray(_sBusca,2)[0], setBuscaDireita = _slicedToArray(_sBusca,2)[1];
  var _sBuscaEsq = useState(''), buscaEsquerda = _slicedToArray(_sBuscaEsq,2)[0], setBuscaEsquerda = _slicedToArray(_sBuscaEsq,2)[1];
  var _sSelEsq = useState(null), selecionadoEsquerda = _slicedToArray(_sSelEsq,2)[0], setSelecionadoEsquerda = _slicedToArray(_sSelEsq,2)[1];
  var _sMarcados = useState({}), marcadosParaExcluir = _slicedToArray(_sMarcados,2)[0], setMarcadosParaExcluir = _slicedToArray(_sMarcados,2)[1];
  var _sToast = useState(''), toast = _slicedToArray(_sToast,2)[0], setToast = _slicedToArray(_sToast,2)[1];
  var _sErroEns = useState(''), erro = _slicedToArray(_sErroEns,2)[0], setErro = _slicedToArray(_sErroEns,2)[1];

  // FIX: novos estados para "Importar Planilha de Sinônimos" (3ª forma de ensinar o sistema)
  var _sPrevPlan = useState(null), previewPlanilha = _slicedToArray(_sPrevPlan,2)[0], setPreviewPlanilha = _slicedToArray(_sPrevPlan,2)[1];
  var _sProcPlan = useState(false), processandoPlanilha = _slicedToArray(_sProcPlan,2)[0], setProcessandoPlanilha = _slicedToArray(_sProcPlan,2)[1];
  var _sErroPlan = useState(''), erroPlanilha = _slicedToArray(_sErroPlan,2)[0], setErroPlanilha = _slicedToArray(_sErroPlan,2)[1];

  // Leitura de arquivos (mesmo padrão já usado no Casar Insumos - aqui só a descrição interessa)
  var parsearPDFTextoEnsinar = function(textosOriginaisEntradaEns) {
    // FIX: alguns fornecedores (ex: Gerdau) colam um sufixo de unidade/moeda no final do número
    // (ex: "6,000 RL", "1.666,80 BRL/RL"). Normaliza isso ANTES de qualquer lógica, removendo o
    // sufixo quando o token for só número + sufixo conhecido — mesma estratégia já validada na
    // função irmã (Ler com IA).
    var temAssinaturaGerdauEns = textosOriginaisEntradaEns.some(function(tk){ return /BRL/i.test(tk||""); });
    var textos = textosOriginaisEntradaEns.map(function(tok){
      var t = (tok||"");
      var mPrefixo = t.match(/^R\$\s*([\d.,]+)$/);
      if (mPrefixo) return mPrefixo[1];
      var m = t.match(/^([\d.,]+)\s*(RL|KG|BRL\/RL|BRL|UN|PC|MT|M2|M3)$/);
      return m ? m[1] : t;
    });
    // FIX (3ª parte do mesmo bug real, Agroboi): esses padrões só reconheciam preços grandes
    // (1.000 ou mais) quando escritos COM ponto de milhar (ex: "1.625,00"). Esse orçamento
    // específico escreve sem ponto (ex: "1625,00") — um número igualmente válido, só sem
    // separador. Sem essa forma alternativa, números assim eram completamente ignorados (nem
    // entravam na lista de candidatos a preço/total), impedindo a "trinca" de ser validada.
    // Aceita as duas formas agora, sem alterar o reconhecimento do formato original.
    var PRECO=/^([\d]{1,3}(?:\.[\d]{3})*,[\d]{2}|[\d]{4,},[\d]{2}|,[\d]{2})$/;
    var PRECO4=/^([\d]{1,3}(?:\.[\d]{3})*,[\d]{3,4}|[\d]{4,},[\d]{3,4}|,[\d]{3,4})$/;
    var ehCab=function(s){
      var st=s.trim();
      if(/^(ITEM|C[O\u00D3]D\.?|AMAR|QTDE?\.?|QT\.?|UN\.?|UNID\.?|UNIT[A\u00C1]RIO|UNITARIO|TOTAL|DESCRI[C\u00C7][A\u00C3]O|DESCR\.?|VALOR|VLR\.?|PRE[C\u00C7]O|FRETE|IMPOSTO|SUB[\s-]?TOTAL|PESO|OBS[\.:]?|OBSERV|BANCO|CONTA|PIX|CNPJ|CPF|CEP|TELEFONE|FONE|E-?MAIL|CONTATO|ESTADO|CIDADE|ENDERE|BAIRRO|VENC|PRAZO|VALIDADE|CONDI|REPRESENT|VENDEDOR|CLIENTE|TIPO|FORMA|SITUA|NF|NOTA|DATA|PEDIDO|OR[C\u00C7]AMENTO)$/i.test(st)) return true;
      if(/^(VALOR TOTAL|TOTAL GERAL|TOTAL BRUTO|TOTAL L[I\u00CD]QUIDO|PESO TOTAL|PESO L[I\u00CD]QUIDO|VALOR DO IPI|TOTAL DO IPI|VALOR TOTAL DO|DEMAIS CONDI)/i.test(st)) return true;
      // FIX: cabeçalhos compostos (frase inteira em um só token), comum quando o PDF junta a linha de cabeçalho
      if(/DESCRI[C\u00C7][A\u00C3]O DO PRODUTO|TOTAL (ACRESCIMO|DESCONTO|L[I\u00CD]QUIDO|GERAL|BRUTO)|VALOR (UNIT|TOTAL)|C[O\u00D3]DIGO PRODUTO/i.test(st)) return true;
      if(/^(TOTAL|VALOR|VENDEDOR|CLIENTE|ENDERE[C\u00C7]O)[\s:]/i.test(st)) return true;
      // FIX: documentos tipo "nota/orçamento avulso" (cabeçalho de estabelecimento, endereço, nome de empresa, cidade-UF)
      if(/^(N[\u00C3A]O [\u00C9E] DOCUMENTO|DOCUMENTO AUXILIAR|IDENTIFICA[C\u00C7][\u00C3A]O DO|RAZ[\u00C3A]O SOCIAL|EMISS[\u00C3A]O|VALIDADE|FANTASIA|COMPLEM|PAGAMENTO|SUBTOTAL|ACR[E\u00C9]SCIMO|VENCIMENTO)/i.test(st)) return true;
      if(/^(AV\.|AVENIDA|RUA|R\s)/i.test(st)) return true;
      if(/LTDA|EIRELI|\bS\/A\b|\bME\b|\bEPP\b/i.test(st)) return true;
      if(/^[A-Z\u00C0-\u0178\s]+\s-\s[A-Z]{2}(\s|$)/.test(st)) return true; // "CIDADE - UF"
      if(/^VL\.?\s*UNIT/i.test(st)) return true;
      if(/^Vendedor\(es\)/i.test(st)) return true;
      if(/^MERCADORIA\s*-\s*N[\u00C3A]O\s*COMPROVA/i.test(st)) return true; // FIX: continuação de "...GARANTIA DE MERCADORIA - NÃO COMPROVA PAGAMENTO" (rodapé fixo dividido em 2 tokens)
      if(/^PEDIDO\s*DE\s*VENDA$/i.test(st)) return true; // FIX: continuação de "DOCUMENTO AUXILIAR DE VENDA - PEDIDO DE VENDA" (cabeçalho fixo dividido em 2 tokens)
      if(/^CE-/i.test(st)) return true; // cabe\u00e7alho de se\u00e7\u00e3o (local de retirada), n\u00e3o \u00e9 produto
      if(/^(PR\.?\s*UNIT|PRE[C\u00C7]O\s*TOTAL|PRE[C\u00C7]O\s*UNIT)/i.test(st)) return true; // cabe\u00e7alho de coluna abreviado
      // FIX: mais padr\u00f5es de rodap\u00e9/cabe\u00e7alho encontrados em outros formatos (Gerdau, Ferracre, Ferrosul, Acreferro)
      if(/^(AMBIENTE|CD RETIRA|PROPOSTA V[A\u00C1]LIDA|DADOS DO FATURAMENTO|DADOS DO PARCEIRO|ORCAMENTO \/|OR[C\u00C7]AMENTO \/|PARCELA [U\u00DA]NICA|V\.?\s*DESC|V\.?\s*BRUTO|VLR\.?\s*TOTAL|C[O\u00D3]D\.?\s*F[A\u00C1]BRICA|C[O\u00D3]D\.?\s*REF|C[O\u00D3]D\.?\s*DE ORIGEM|PESO L[I\u00CD]Q|CONTAS BANC[A\u00C1]RIAS|N[A\u00C3]O VALE COMO|N[A\u00C3]O [E\u00C9] DOCUMENTO|ESTOU DE ACORDO|NOME FANT|DATA DE VENCIMENTO|DESC\.?\s*DESTACADO|SERVI[C\u00C7]O DESCRITO|OUTROS SERVI[C\u00C7]OS|OUTRAS DESP)/i.test(st)) return true;
      if(/^(TRV|TRAV\.|TRAVESSA)\s/i.test(st)) return true; // endere\u00e7o (travessa), al\u00e9m de RUA/AV j\u00e1 cobertos
      if(/^Prazo\s*(de\s*)?Entrega/i.test(st)) return true;
      if(/^Prazo\s*de\s*Pagamento\s*:/i.test(st)) return true; // FIX: "Prazo de Pagamento:" (formato Gerdau)
      if(/^\d+\s*\/\s*\d+\s*\/\s*\d+\s*dias/i.test(st) || /trademaster/i.test(st)) return true; // FIX: condição de pagamento "30/60/90 dias" ou Trademaster
      if(/^Descarga\s*por\s*conta/i.test(st)) return true; // FIX: "Descarga por conta do cliente" (rodapé)
      if(/^Material\s*sujeito/i.test(st)) return true; // FIX: "Material sujeito a confirmação de estoque" (rodapé)
      if(/^Data\s*(Emiss[a\u00E3]o|Previs[a\u00E3]o)\s*:/i.test(st)) return true; // FIX: "Data Emissão:"/"Data Previsão:" (formato Acretec)
      if(/^Classif\.?\s*IPI\s*:/i.test(st)) return true; // FIX: "Classif. IPI:" (formato Acretec)
      if(/^Desconto\s*Total\s*:/i.test(st)) return true; // FIX: "Desconto Total:" (formato Acretec)
      if(/^CONJ\s/i.test(st)) return true; // FIX: "CONJ [nome]" (conjunto habitacional, endereço/bairro)
      if(/^N[U\u00DA]MERO\s*DE\s*ITENS\s*:/i.test(st)) return true; // FIX: "Número de Itens:" do rodapé (formato Mexichem/Amanco)
      if(/^OR[C\u00C7]AMENTO\s*EM\s*NEGOCIA[C\u00C7][A\u00C3]O$/i.test(st)) return true; // FIX: "ORCAMENTO EM NEGOCIACAO" (status, formato Paranorte)
      if(/^Cota[C\u00E7\u00C7][a\u00E3\u00C3]o\s*com\s*validade/i.test(st)) return true; // FIX: texto longo de rodapé legal (formato Mexichem/Amanco)
      if(/^Com\s*o\s*aceite\s*da\s*presente/i.test(st)) return true; // FIX: outro texto de rodapé legal (formato Mexichem/Amanco)
      // FIX: mais padr\u00f5es que escapavam (forma de pagamento, valor unit\u00e1rio, observa\u00e7\u00e3o com espa\u00e7o, frete)
      if(/^(FORMA\s*DE\s*PAGAMENTO|V\.?\s*UNIT[A\u00C1]RIO|OBSERVA[C\u00C7][A\u00C3]O|FRETE\s*\(|DESCONTO\s*ITENS)/i.test(st)) return true;
      // FIX: estes padr\u00f5es j\u00e1 existiam em outra fun\u00e7\u00e3o irm\u00e3 (Ler com IA) mas faltavam aqui
      if(/^(PESO (BRUTO|L[I\u00CD]QUIDO)|QTD\.?\s*TOTAL|QUANTIDADE TOTAL)[\s:]/i.test(st)) return true;
      if(/^(ASSINATURA DO|[E\u00C9] VEDADA A AUTENTICA[C\u00C7][A\u00C3]O|TELE-?VENDAS)/i.test(st)) return true;
      if(/^\d+\s*-\s*Mexichem/i.test(st)) return true; // nome de filial espec\u00edfico deste fornecedor
      if(/IND[U\u00DA]STRIA E COM[E\u00C9]RCIO|IND\s*E\s*COM\s*DE|IMP\.?\s*(E\s*)?EXP\b|IMPORTA[C\u00C7][A\u00C3]O E EXPORTA[C\u00C7][A\u00C3]O/i.test(st)) return true;
      return false;
    };
    var items=[];
    for (var i=0;i<textos.length;i++) {
      var t=(textos[i]||"").trim();
      // FIX: aceita tamb\u00e9m descri\u00e7\u00f5es no formato "C\u00d3DIGO - TEXTO" (come\u00e7am com n\u00famero, n\u00e3o letra) -
      // esse formato \u00e9 usado por alguns fornecedores (ex: notas/or\u00e7amentos avulsos tipo Agroboi)
      var comecaComLetra=/^[A-Z\u00C0-\u00D6\u00D8-\u00DE]/.test(t);
      var comecaComCodigoHifen=/^\d+\s*-\s*[A-Za-z\u00C0-\u00FF]/.test(t);
      // FIX: aceita também "CÓDIGO DESCRIÇÃO" sem hífen (ex: "31529 TORN LAV BANC..."), protegido
      // contra confundir com abreviação de unidade solta (ex: "5 UN")
      var UNIDADE_RE_PREFIXO_ENS = /^(UN|UND|PC|PÇ|KG|MT|M|CX|L|LT|PCT|CJ)$/i;
      var comecaComCodigoEspaco = /^\d+\s+[A-Za-z\u00C0-\u00DE]/.test(t) && !UNIDADE_RE_PREFIXO_ENS.test((t.split(/\s+/)[1]||""));
      // FIX: mesmo batendo no formato "c\u00f3digo - texto", rejeita se for forma de pagamento (boleto/pix/
      // transfer\u00eancia/contra entrega) ou nome de vendedor seguido de telefone - esses N\u00c3O s\u00e3o produtos
      var pareceFormaPagamento = /BOLETO|PIX|TRANSFEREN|CONTRA ENTREGA|FORMA DE PAGAMENTO|CART[A\u00C3]O|CHEQUE|DINHEIRO|VENDA A RECEBER/i.test(t);
      // FIX: a detecção antiga só olhava se HAVIA um padrão de telefone no fim, o que confundia descrições
      // de produto terminadas em código de referência (ex: "...JET 30 26010600") com nome+telefone.
      // Agora conta quantos GRUPOS de dígitos existem no restante do texto: nome de pessoa só tem o
      // telefone (0 grupos restantes); descrição de produto tem outros números espalhados (medidas, códigos).
      var temPadraoTelefoneNoFim = /\d{4,5}[\s-]?\d{4}\s*$/.test(t) && !/\d+[.,]\d{2}\s*$/.test(t);
      var pareceVendedorComTelefone = false;
      if (temPadraoTelefoneNoFim) {
        var semTelefoneNoFim = t.replace(/[\d\s-]{4,}$/, "").trim();
        var gruposDeDigitosRestantes = (semTelefoneNoFim.match(/\d+/g) || []).length;
        pareceVendedorComTelefone = gruposDeDigitosRestantes === 0;
      }
      if (comecaComCodigoHifen && (pareceFormaPagamento || pareceVendedorComTelefone)) comecaComCodigoHifen = false;
      // FIX: se o token ANTERIOR for um r\u00f3tulo de pessoa (Vendedor:, Cliente:, Comprador:, etc.), o
      // token atual \u00e9 o NOME dessa pessoa, n\u00e3o um produto - rejeita independente do formato do texto
      var rotuloPessoaRegex = /^(Vendedor(\(es\))?|Cliente|Comprador|Respons[a\u00E1]vel|Atendente|Representante|Solicitante|Atenciosamente|Tele-?Vendas|Fone\s*Vendedor)\s*:?\s*$/i;
      var anteriorEhRotuloPessoa = false;
      for (var distRotulo=1; distRotulo<=4; distRotulo++) {
        if (i-distRotulo>=0 && rotuloPessoaRegex.test((textos[i-distRotulo]||"").trim())) { anteriorEhRotuloPessoa = true; break; }
      }
      // FIX: se o item anterior j\u00e1 foi identificado como nome de empresa/cabe\u00e7alho (ex: "...LTDA"),
      // o token atual costuma ser a assinatura da pessoa (rodap\u00e9 tipo "Atenciosamente, Empresa, Nome") - rejeita tamb\u00e9m
      var anteriorEhEmpresa = i>0 && /LTDA|EIRELI|IMP\.?\s*(E\s*)?EXP\b/i.test((textos[i-1]||"").trim());
      // FIX: forma de pagamento agora rejeitada em QUALQUER formato de texto, n\u00e3o s\u00f3 c\u00f3digo-h\u00edfen
      var temTresMaisLetrasSeguidasEns = /[a-zA-Z\u00C0-\u00FF]{3,}/.test(t);
      var temDuasMaisLetrasEQuantidadeDePalavrasEns = /[a-zA-Z\u00C0-\u00FF]{2,}/.test(t) && t.split(/\s+/).filter(function(w){return w.length>0;}).length>=3;
      var proxEhSiglaUF = i+1<textos.length && /^-\s*[A-Z]{2}\s*$/.test((textos[i+1]||"").trim());
      var ehSoOrcamentoNumero = /^OR[\u00c7C]AMENTO\s*N[\u00ba\u00b0o]?\.?\s*$/i.test(t);
      var ehDesc=!anteriorEhRotuloPessoa&&!anteriorEhEmpresa&&!pareceFormaPagamento&&!proxEhSiglaUF&&!ehSoOrcamentoNumero&&t.length>7&&(comecaComLetra||comecaComCodigoHifen||comecaComCodigoEspaco)&&(temTresMaisLetrasSeguidasEns||temDuasMaisLetrasEQuantidadeDePalavrasEns)&&/\s/.test(t)&&!ehCab(t)&&!/^\d+$/.test(t)&&!/^[\d\.\,\-\/\s]+$/.test(t)&&!/^C[\u00F3o]d\.?\s*Barras/i.test(t);
      if (!ehDesc) continue;
      // FIX: se logo depois desse candidato vier um código numérico puro seguido de OUTRA descrição
      // válida, o candidato atual era só o nome da MARCA (ex: "TIGRE PINCEIS"), não uma descrição de
      // produto real — a descrição de verdade vem depois do código.
      if (i+2 < textos.length && /^\d+$/.test((textos[i+1]||"").trim())) {
        var possivelProxDesc = (textos[i+2]||"").trim();
        var proxComecaComLetraM = /^[A-Z\u00C0-\u00D6\u00D8-\u00DE]/.test(possivelProxDesc);
        var proxTemLetrasM = /[a-zA-Z\u00C0-\u00FF]{2,}/.test(possivelProxDesc);
        if (possivelProxDesc.length>7 && proxComecaComLetraM && proxTemLetrasM && /\s/.test(possivelProxDesc) && !ehCab(possivelProxDesc)) continue;
      }
      // FIX: quando a MARCA vem DIRETAMENTE seguida da descrição real (sem número entre elas, ex:
      // "TIGRE / AMANCO" seguida de "CURVA 90 P/ ELETRODUTO..."), e o candidato atual é curto/simples
      // o suficiente para ser uma marca (poucas palavras, sem dígitos), trata como marca também.
      if (i+1 < textos.length && t.length<=20 && !/\d/.test(t) && t.split(/\s+/).length<=4) {
        var possivelProxDesc2 = (textos[i+1]||"").trim();
        var proxComecaComLetraM2 = /^[A-Z\u00C0-\u00D6\u00D8-\u00DE]/.test(possivelProxDesc2);
        var proxTemLetrasM2 = /[a-zA-Z\u00C0-\u00FF]{2,}/.test(possivelProxDesc2);
        if (possivelProxDesc2.length>7 && proxComecaComLetraM2 && proxTemLetrasM2 && /\s/.test(possivelProxDesc2) && !ehCab(possivelProxDesc2) && /\d/.test(possivelProxDesc2)) continue;
      }
      // FIX: quando a MARCA é seguida de [qtd][unidade][código][total] (vários tokens numéricos/curtos)
      // antes de chegar na próxima descrição válida (ex: "OTTO BAUMGART" seguido de "2,000","LTA",
      // "10267","471,90" antes de "ALVENARIT 18 LTS..."), busca numa janela maior (até 5 tokens).
      if (t.length<=20 && !/\d/.test(t) && t.split(/\s+/).length<=3) {
        for (var jMarca=i+1; jMarca<Math.min(i+6, textos.length); jMarca++) {
          var possivelProxDesc3 = (textos[jMarca]||"").trim();
          if (possivelProxDesc3.length>7 && /^[A-Z\u00C0-\u00D6\u00D8-\u00DE]/.test(possivelProxDesc3) && /[a-zA-Z\u00C0-\u00FF]{2,}/.test(possivelProxDesc3) && /\s/.test(possivelProxDesc3) && !ehCab(possivelProxDesc3)) {
            break; // achou a próxima descrição real dentro da janela — o candidato atual é marca
          }
        }
        if (jMarca<Math.min(i+6, textos.length) && (textos[jMarca]||"").trim().length>7) continue;
      }
      // FIX: quando a descri\u00e7\u00e3o vem quebrada em 2 partes (comum nesse formato), concatena com o
      // pr\u00f3ximo token se ele parecer ser a continua\u00e7\u00e3o (n\u00e3o \u00e9 c\u00f3digo de barras, pre\u00e7o, cabe\u00e7alho, ou outro item)
      var descParaUsar = t;
      // FIX: a concatena\u00e7\u00e3o s\u00f3 acontece quando a descri\u00e7\u00e3o atual est\u00e1 no formato "C\u00d3DIGO - TEXTO"
      // (onde sabemos que pode vir quebrada em 2 partes, ex: Agroboi) - em formatos onde a descri\u00e7\u00e3o
      // j\u00e1 come\u00e7a com letra normal (Costa, Paranorte, etc), ela j\u00e1 vem completa e N\u00c3O deve ser
      // concatenada com o pr\u00f3ximo token (que normalmente \u00e9 um C\u00d3DIGO/REFER\u00caNCIA do produto, n\u00e3o texto)
      if (comecaComCodigoHifen && i+1 < textos.length && !/^CE-/i.test(t)) {
        var prox=(textos[i+1]||"").trim();
        var proxEhContinuacao = prox.length>2 && !/^C[\u00F3o]d\.?\s*Barras/i.test(prox) && !PRECO.test(prox) && !PRECO4.test(prox) && !ehCab(prox) && !/^\d+$/.test(prox) && /[A-Za-z\u00C0-\u00FF]/.test(prox) && !/^\d+\s*-\s*[A-Za-z\u00C0-\u00FF]/.test(prox);
        if (proxEhContinuacao) descParaUsar = t + ' ' + prox;
      }
      // FIX: busca o preço em AMBAS as direções (antes e depois) — alguns PDFs (ex.: gerados por certos
      // ERPs) colocam o valor ANTES da descrição na ordem interna do texto, não depois.
      var precoAchado = null;
      var candidatosNum = [], candidatosTxt = [];
      // FIX: função auxiliar simplificada para reconhecer se um token parece ser OUTRO item (limite
      // de busca, evita vazar números do item vizinho para dentro do item atual)
      var pareceOutroItemEns = function(tok){
        var tk = (tok||"").trim();
        if (tk.length<=7) return false;
        if (/^C[\u00F3o]d\.?\s*Barras/i.test(tk)) return false; // FIX: "Cód. Barras: XXX" não é outro item
        if (/^Obs\s*:?\s*$/i.test(tk)) return false; // FIX: "Obs:" sozinho não é outro item
        var tkComecaComLetra=/^[A-Z\u00C0-\u00D6\u00D8-\u00DE]/.test(tk);
        var tkComecaComCodHifen=/^\d+\s*-\s*[A-Za-z\u00C0-\u00FF]/.test(tk);
        var tkComecaComCodEspaco=/^\d+\s+[A-Za-z\u00C0-\u00DE]/.test(tk) && !UNIDADE_RE_PREFIXO_ENS.test((tk.split(/\s+/)[1]||""));
        return (tkComecaComLetra||tkComecaComCodHifen||tkComecaComCodEspaco) && /[a-zA-Z\u00C0-\u00FF]{3,}/.test(tk) && /\s/.test(tk) && !ehCab(tk);
      };
      var limiteFrenteEns = textos.length, limiteTrasEns = -1;
      for (var lfe=i+1; lfe<textos.length; lfe++) { if (pareceOutroItemEns(textos[lfe])) { limiteFrenteEns=lfe; break; } }
      // FIX: quando a descrição já tem o código embutido nela (formato "CÓDIGO DESCRIÇÃO", ex:
      // "31529 TORN LAV..."), os números desse item SEMPRE vêm depois dela, nunca antes — desabilita
      // a busca "pra trás" completamente para esses casos, evitando vazar pro item anterior.
      if (!comecaComCodigoEspaco && !comecaComCodigoHifen) {
        for (var lte=i-1; lte>=0; lte--) {
          var tokTrasEns = (textos[lte]||"").trim();
          // FIX: se esse token parece ser uma MARCA (palavra curta, 1-2 palavras, sem número) e o
          // token logo DEPOIS dela (mais perto da descrição) é um código adjacente à descrição, essa
          // marca faz parte do MESMO item — pula ela ANTES de testar pareceOutroItemEns (que a
          // classificaria erroneamente como "outro item", já que marcas com 2 palavras longas passam
          // nos critérios gerais de "parece outro item").
          var proxTokenDaMarcaEns = (textos[lte+1]||"").trim();
          var ehMarcaAntesDeCodigoEns = lte < i-1 && /^\d{4,7}$/.test(proxTokenDaMarcaEns) &&
            tokTrasEns.length>0 && tokTrasEns.length<=15 && /^[A-Z\u00C0-\u00D6\u00D8-\u00DE]/.test(tokTrasEns) && tokTrasEns.split(/\s+/).length<=2 && !/\d/.test(tokTrasEns);
          if (ehMarcaAntesDeCodigoEns) continue;
          // FIX: se esse token é a MARCA diretamente adjacente à descrição atual (ex: "TIGRE / AMANCO"
          // logo antes de "CURVA 90 P/..."), sem código entre elas — também pula, não trata como
          // "outro item". Critério: curta, sem dígito, poucas "palavras" (a barra "/" conta como
          // separador válido de marca composta, ex: "TIGRE / AMANCO").
          var ehMarcaAdjacenteEns = lte === i-1 && tokTrasEns.length>0 && tokTrasEns.length<=20 && /^[A-Z\u00C0-\u00D6\u00D8-\u00DE]/.test(tokTrasEns) && !/\d/.test(tokTrasEns) && tokTrasEns.replace(/\s*\/\s*/g," ").split(/\s+/).length<=3;
          if (ehMarcaAdjacenteEns) continue;
          if (pareceOutroItemEns(tokTrasEns)) { limiteTrasEns=lte; break; }
          // FIX: só considera código solto como limite se ele estiver DIRETAMENTE adjacente à
          // descrição E não tiver uma MARCA (palavra curta, 1-2 palavras, sem número) logo antes dele
          // — em formatos com "número...marca-código-DESCRIÇÃO" (ex: Acre Parafusos), essa marca
          // indica que o código faz parte do MESMO item, e os números reais ficam mais além, antes
          // da marca. Sem essa checagem, a regra bloquearia a busca antes de alcançá-los.
          if (lte === i-1 && /^\d{4,7}$/.test(tokTrasEns)) {
            var tokAntesDoCodigoEns = (textos[lte-1]||"").trim();
            var pareceMarcaEns = tokAntesDoCodigoEns.length>0 && tokAntesDoCodigoEns.length<=15 && /^[A-Z\u00C0-\u00D6\u00D8-\u00DE]/.test(tokAntesDoCodigoEns) && tokAntesDoCodigoEns.split(/\s+/).length<=2 && !/\d/.test(tokAntesDoCodigoEns);
            if (pareceMarcaEns) continue;
            limiteTrasEns=lte; break;
          }
        }
      } else {
        limiteTrasEns = i-1;
      }
      // FIX: testa AMBAS as direções separadamente (só "pra frente" e só "pra trás"), e usa a que
      // formar uma trinca matemática válida com a MENOR distância total até a descrição — evita
      // misturar direções, que pode vazar números de outro item em formatos ambíguos (ex: quando um
      // código fica adjacente à descrição tanto no sentido "limite correto" quanto "início do próprio
      // item"). Também evita sempre preferir "pra frente", já que em alguns formatos (ex: Acre
      // Parafusos) os números reais ficam ANTES da descrição, não depois.
      var testarDirecaoEns = function(inicio, fim, passo) {
        var nums=[], txts=[], distTotal=0;
        for (var jj=inicio; jj!==fim && jj>=0 && jj<textos.length && nums.length<8; jj+=passo) {
          var tjj=(textos[jj]||"").trim();
          if (PRECO.test(tjj)||PRECO4.test(tjj)) { nums.push(parseFloat(tjj.replace(/\./g,"").replace(",","."))); txts.push(tjj); distTotal += Math.abs(jj-i); }
        }
        var temTrinca=false;
        for (var xd=0; xd<nums.length && !temTrinca; xd++) {
          for (var yd=0; yd<nums.length && !temTrinca; yd++) {
            if (xd===yd) continue;
            for (var zd=0; zd<nums.length && !temTrinca; zd++) {
              if (zd===xd||zd===yd) continue;
              if (nums[xd]>=1 && nums[yd]>0 && Math.abs(nums[xd]*nums[yd]-nums[zd])/Math.max(nums[zd],1)<0.015) temTrinca=true;
            }
          }
        }
        return {nums:nums, txts:txts, temTrinca:temTrinca, distTotal:distTotal};
      };
      // FIX (bug real, reproduzido com o orçamento da Agroboi): quando existem 2 linhas de
      // metadado entre a descrição e os números (ex: "Cód. Barras:" e "Obs:"), o TOTAL fica na
      // 8ª posição de distância — 1 posição além do alcance antigo (+7). Sem alcançar o total,
      // a "trinca" (qtd×preço=total) nunca validava PRA FRENTE, e o item caía num modo de
      // emergência que pega o primeiro número que aparecer (nesse formato, sempre um "0,00" de
      // desconto, sem relação com o preço real). Amplia só a busca PRA FRENTE (a direção onde
      // esse padrão específico acontece) — a busca pra trás continua exatamente como estava,
      // para não alterar nenhum outro formato que já funciona corretamente com o alcance atual.
      var resultFrenteEns = testarDirecaoEns(i+1, Math.min(i+9, limiteFrenteEns), 1);
      var resultTrasEns = testarDirecaoEns(i-1, Math.max(i-7, limiteTrasEns), -1);
      var usarFrenteEns = resultFrenteEns.nums.length>=3 && resultFrenteEns.temTrinca;
      var usarTrasEns = resultTrasEns.nums.length>=3 && resultTrasEns.temTrinca;
      // FIX: quando AMBAS direções têm trinca válida (ambíguo), usa o formato da descrição como
      // desempate — se o código já vem embutido nela (ex: "31529 TORN LAV..."), os números tendem a
      // vir DEPOIS; se o código vem solto e separado (ex: Acre Parafusos), os números reais tendem a
      // vir ANTES (a busca "pra frente" nesses casos costuma vazar pro próximo item, que fica mais
      // próximo por coincidência de estrutura).
      if (usarFrenteEns && usarTrasEns) {
        if (comecaComCodigoEspaco || comecaComCodigoHifen) {
          candidatosNum = resultFrenteEns.nums; candidatosTxt = resultFrenteEns.txts;
          precoAchado = resultFrenteEns.txts[0];
        } else {
          candidatosNum = resultTrasEns.nums; candidatosTxt = resultTrasEns.txts;
          precoAchado = resultTrasEns.txts[0];
        }
      } else if (usarFrenteEns) {
        candidatosNum = resultFrenteEns.nums; candidatosTxt = resultFrenteEns.txts;
        precoAchado = resultFrenteEns.txts[0];
      } else if (usarTrasEns) {
        candidatosNum = resultTrasEns.nums; candidatosTxt = resultTrasEns.txts;
        precoAchado = resultTrasEns.txts[0];
      } else {
      for (var dist=1; dist<=6; dist++) {
        var jDepois=i+dist, jAntes=i-dist;
        if (jDepois<limiteFrenteEns) {
          var tjD=(textos[jDepois]||"").trim();
          if (PRECO.test(tjD)||PRECO4.test(tjD)) {
            if (precoAchado===null) precoAchado=tjD;
            candidatosTxt.push(tjD); candidatosNum.push(parseFloat(tjD.replace(/\./g,"").replace(",",".")));
          }
        }
        if (jAntes>limiteTrasEns) {
          var tjA=(textos[jAntes]||"").trim();
          if (PRECO.test(tjA)||PRECO4.test(tjA)) {
            if (precoAchado===null) precoAchado=tjA;
            candidatosTxt.push(tjA); candidatosNum.push(parseFloat(tjA.replace(/\./g,"").replace(",",".")));
          }
        }
      }
      }
      // FIX: quando há múltiplos números candidatos próximos (comum em formatos com qtd+total+preço
      // juntos, ex: "código descrição" seguido de "12,00 943,44 78,62"), o primeiro encontrado pode
      // ser a QUANTIDADE, não o preço. Testa se alguma combinação bate matematicamente (qtd×unit≈total)
      // para escolher o preço correto — sem isso, mantém o comportamento antigo (primeiro encontrado).
      if (candidatosNum.length>=3) {
        var achouTrincaEns = false;
        // FIX (bug real, reproduzido e confirmado com os 11 itens do orçamento da Agroboi):
        // quando o PRIMEIRO número da lista é exatamente 0,00 (coluna de desconto zerada, comum
        // em vários fornecedores), os 3 números seguintes vêm sempre nesta ordem específica:
        // PREÇO, QUANTIDADE, TOTAL. Sem essa regra, a busca genérica abaixo (que testa todas as
        // combinações matemáticas possíveis) não sabe diferenciar qual dos dois primeiros é preço
        // e qual é quantidade — já que multiplicação é comutativa (2,50×20 e 20×2,50 dão o mesmo
        // total), e podia escolher a quantidade por engano. Essa regra só age quando o padrão
        // exato (zero à frente + trinca válida logo depois) é confirmado — não interfere em
        // nenhum outro formato que não comece com esse zero.
        if (!achouTrincaEns && candidatosNum.length>=4 && candidatosNum[0]===0) {
          var precoZ=candidatosNum[1], qtdZ=candidatosNum[2], totalZ=candidatosNum[3];
          if (qtdZ>=1 && precoZ>0 && Math.abs(precoZ*qtdZ-totalZ)/Math.max(totalZ,1)<0.015) {
            precoAchado = candidatosTxt[1];
            achouTrincaEns = true;
          }
        }
        // FIX: tenta primeiro a ordem POSICIONAL típica desse formato (qtd, total, preço_unit, nessa
        // ordem de aparição no texto) — mais confiável que testar todas as permutações genéricas,
        // que podem escolher a combinação comutativa errada quando os números são "invertíveis".
        for (var pi=0; pi<candidatosNum.length-2 && !achouTrincaEns; pi++) {
          var qtdPos=candidatosNum[pi], totalPos=candidatosNum[pi+1], unitPos=candidatosNum[pi+2];
          if (qtdPos>=1 && unitPos>0 && Math.abs(qtdPos*unitPos-totalPos)/Math.max(totalPos,1)<0.015) {
            precoAchado = candidatosTxt[pi+2];
            achouTrincaEns = true;
          }
        }
        // Fallback: testa todas as permutações genéricas se a ordem posicional não bateu
        if (!achouTrincaEns) {
          for (var xp=0; xp<candidatosNum.length && !achouTrincaEns; xp++) {
            for (var yp=0; yp<candidatosNum.length && !achouTrincaEns; yp++) {
              if (xp===yp) continue;
              for (var zp=0; zp<candidatosNum.length && !achouTrincaEns; zp++) {
                if (zp===xp||zp===yp) continue;
                var qtdP=candidatosNum[xp], unitP=candidatosNum[yp], totalP=candidatosNum[zp];
                if (qtdP>=1 && unitP>0 && Math.abs(qtdP*unitP-totalP)/Math.max(totalP,1)<0.015) {
                  precoAchado = candidatosTxt[yp];
                  achouTrincaEns = true;
                }
              }
            }
          }
        }
        // FIX: se nem a validação matemática funcionou (ex: quando o "total" real não está entre os
        // candidatos, como no formato Gerdau: qtd, peso, preço — sem uma trinca multiplicativa válida),
        // usa o candidato de POSIÇÃO 2 (3º valor coletado) como fallback, já que o preço unitário
        // tende a vir nessa posição na maioria dos formatos observados (mais confiável que o 1º valor,
        // que costuma ser a quantidade).
        if (!achouTrincaEns && candidatosNum.length>=3 && temAssinaturaGerdauEns) {
          precoAchado = candidatosTxt[2];
        }
      }
      if (precoAchado) {
        var preco=parseFloat(precoAchado.replace(/\./g,"").replace(",","."));
        items.push({desc:descParaUsar.toUpperCase(), preco:preco});
      }
    }

    // FIX: fallback para formato onde a descrição vem fragmentada PALAVRA POR PALAVRA entre um
    // CÓDIGO (com ou sem ponto) e um marcador de UNIDADE (ex: "UN") — formato Multilit. A lógica
    // principal não reconhece palavras soltas curtas como descrição válida. Ativa só se a lógica
    // principal não achou nada.
    if (items.length === 0) {
      var CODIGO_MULTILIT = /^(\d{1,3}\.\d{3,}|\d{5,7})$/;
      var UNIDADE_EXATA_ENS = /^(UN|UND|PC|PÇ|KG|MT|M|CX|L|LT|PCT|CJ)$/i;
      var NUM_ENS = /^([\d]{1,3}(?:\.[\d]{3})*,[\d]{2,5}|[\d]{4,},[\d]{2,5}|,[\d]{2,5}|\d+\.\d{1,5})$/;
      for (var ci=0; ci<textos.length; ci++) {
        var possCodigo = (textos[ci]||"").trim();
        if (!CODIGO_MULTILIT.test(possCodigo)) continue;
        var palavras = [];
        var ui = ci+1;
        while (ui < textos.length && ui < ci+13 && !UNIDADE_EXATA_ENS.test((textos[ui]||"").trim())) {
          var palavra = (textos[ui]||"").trim();
          var proxTokenM = (textos[ui+1]||"").trim();
          if (palavra.length===0 || palavra==="R$" || (NUM_ENS.test(palavra) && proxTokenM==="R$")) { palavras = []; break; }
          palavras.push(palavra);
          ui++;
        }
        // Tentativa 2: código já vem seguido DIRETO da unidade — a descrição está ANTES do código
        if (palavras.length===0 && UNIDADE_EXATA_ENS.test((textos[ci+1]||"").trim())) {
          ui = ci+1;
          var palavrasTras = [];
          var ct = ci-1;
          while (ct>=0 && ct>ci-13) {
            var palavraTras = (textos[ct]||"").trim();
            if (palavraTras.length===0 || NUM_ENS.test(palavraTras) || palavraTras==="R$" || CODIGO_MULTILIT.test(palavraTras) || UNIDADE_EXATA_ENS.test(palavraTras)) break;
            palavrasTras.unshift(palavraTras);
            ct--;
          }
          if (palavrasTras.length>0) palavras = palavrasTras;
        }
        if (palavras.length===0 || ui>=textos.length || !UNIDADE_EXATA_ENS.test((textos[ui]||"").trim())) continue;
        // Depois da unidade: quantidade, "R$", preço unitário
        var possQtdM = (textos[ui+1]||"").trim();
        var possRSM = (textos[ui+2]||"").trim();
        var possUnitM = (textos[ui+3]||"").trim();
        if (NUM_ENS.test(possQtdM) && possRSM==="R$" && NUM_ENS.test(possUnitM)) {
          var precoM = /^\d+\.\d{1,5}$/.test(possUnitM) ? parseFloat(possUnitM) : parseFloat(possUnitM.replace(/\./g,"").replace(",","."));
          if (precoM>0) items.push({desc:palavras.join(" ").toUpperCase(), preco:precoM});
        }
      }
    }

    // FIX: fallback dedicado para o padrão "Pr Unit Brut" com estrutura [desconto][preço][MARCA]
    // [qtd][UN][código][total] DESCRIÇÃO (ex: Paranorte) — os 7 elementos vêm ANTES da descrição,
    // mas logo APÓS a descrição anterior. Busca posicionalmente pra trás a partir de cada descrição:
    // total, código (número puro), UN (texto curto, pula), qtd, MARCA (texto, pula), preço.
    // Corrige itens onde a lógica genérica não achou o preço certo (ex: preco<=0).
    var pareceDescricaoValidaEns = function(txx){
      var stt = (txx||"").trim();
      var comLetraE = /^[A-Z\u00C0-\u00D6\u00D8-\u00DE]/.test(stt);
      var comCodE = /^\d+\s*-\s*[A-Za-z\u00C0-\u00FF]/.test(stt);
      return stt.length>7 && (comLetraE||comCodE) && /[a-zA-Z\u00C0-\u00FF]{2,}/.test(stt) && /\s/.test(stt) && !ehCab(stt) && !/^\d+$/.test(stt) && !/^[\d\.\,\-\/\s]+$/.test(stt);
    };
    // FIX: detecção estrutural (não depende do texto do cabeçalho "Pr Unit Brut", que pode não se
    // repetir em páginas seguintes do mesmo documento, ex: "Página 2 de 2"). Testa se o padrão
    // posicional [total, código] (2 posições antes) bate para pelo menos 2 descrições diferentes.
    var contagemPadraoParanorteEns = 0;
    for (var cppi=0; cppi<textos.length; cppi++) {
      var possDcp = (textos[cppi]||"").trim();
      if (!pareceDescricaoValidaEns(possDcp)) continue;
      var tokTotalCp = (textos[cppi-1]||"").trim();
      var tokCodCp = (textos[cppi-2]||"").trim();
      if ((PRECO.test(tokTotalCp)||PRECO4.test(tokTotalCp)) && /^\d{4,7}$/.test(tokCodCp)) contagemPadraoParanorteEns++;
    }
    var temAssinaturaParanorteEns = contagemPadraoParanorteEns >= 2;
    if (temAssinaturaParanorteEns && items.length>0) {
      var UNIDADES_CURTAS_ENS = /^(UN|UND|PC|PÇ|KG|MT|M|CX|L|LT|PCT|CJ|PAR|JG|FL|LTA)$/i;
      var idxDescricoes = {};
      for (var idi=0; idi<textos.length; idi++) {
        var possD = (textos[idi]||"").trim();
        if (pareceDescricaoValidaEns(possD) && !idxDescricoes[possD]) idxDescricoes[possD] = idi;
      }
      items = items.map(function(it){
        var idxD = idxDescricoes[it.desc];
        if (idxD===undefined) return it;
        var pos = idxD-1;
        var totalTok = (textos[pos]||"").trim();
        if (!(PRECO.test(totalTok)||PRECO4.test(totalTok))) return it;
        pos--;
        var codigoTok = (textos[pos]||"").trim();
        if (!/^\d{4,7}$/.test(codigoTok)) return it;
        pos--;
        if (UNIDADES_CURTAS_ENS.test((textos[pos]||"").trim())) pos--;
        var qtdTok = (textos[pos]||"").trim();
        if (!(PRECO.test(qtdTok)||PRECO4.test(qtdTok))) return it;
        pos--;
        if (pos>=0 && !(PRECO.test((textos[pos]||"").trim())||PRECO4.test((textos[pos]||"").trim()))) pos--;
        var precoTok = (textos[pos]||"").trim();
        if (!(PRECO.test(precoTok)||PRECO4.test(precoTok))) return it;
        var qtdNum = parseFloat(qtdTok.replace(/\./g,"").replace(",","."));
        var precoNum = parseFloat(precoTok.replace(/\./g,"").replace(",","."));
        var totalNum = parseFloat(totalTok.replace(/\./g,"").replace(",","."));
        if (qtdNum>=1 && precoNum>0 && Math.abs(qtdNum*precoNum-totalNum)/Math.max(totalNum,1)<0.015) {
          return {desc:it.desc, preco:precoNum};
        }
        return it;
      });
    }

    // FIX: fallback para formato onde os NÚMEROS de cada item (qtd, unitário) ficam numa seção
    // separada das DESCRIÇÕES (ex: Holanda Holanda e Torres) — cada descrição tem seu próprio TOTAL
    // logo depois dela (seguido de "R$"), mas o PREÇO UNITÁRIO real está em outra parte do documento.
    // Usa o total para encontrar, entre grupos [qtd, unit, "R$"] espalhados, qual combinação bate
    // matematicamente, e usa esse unit como preço (não o total).
    if (items.length>0) {
      var contagemPadraoRS = 0;
      for (var cpi=0; cpi<textos.length-1; cpi++) {
        if ((PRECO.test((textos[cpi]||"").trim())||PRECO4.test((textos[cpi]||"").trim())) && (textos[cpi+1]||"").trim()==="R$") contagemPadraoRS++;
      }
      var pareceSerTotalNaoUnitario = contagemPadraoRS >= 3;
      if (pareceSerTotalNaoUnitario) {
        var gruposNumericosEns = [];
        for (var gie=0; gie<textos.length-2; gie++) {
          var possQtdG = (textos[gie]||"").trim();
          var possUnitG = (textos[gie+1]||"").trim();
          var possRSG = (textos[gie+2]||"").trim();
          if (/^\d+$/.test(possQtdG) && (PRECO.test(possUnitG)||PRECO4.test(possUnitG)) && possRSG==="R$") {
            var qtdNumG = parseFloat(possQtdG);
            var unitNumG = parseFloat(possUnitG.replace(/\./g,"").replace(",","."));
            if (qtdNumG>=1 && unitNumG>0) gruposNumericosEns.push({qtd:qtdNumG, unit:unitNumG});
          }
        }
        if (gruposNumericosEns.length>0) {
          items = items.map(function(it){
            var totalIt = it.preco;
            var melhorG = null, melhorDif = 0.01;
            gruposNumericosEns.forEach(function(g){
              var dif = Math.abs(g.qtd*g.unit-totalIt)/Math.max(totalIt,1);
              if (dif<melhorDif) { melhorDif=dif; melhorG=g; }
            });
            return melhorG ? {desc:it.desc, preco:melhorG.unit} : it;
          });
        }
      }
    }
    return items;
  };
  var parsearPDFDesc = function(file, cb) {
    if (typeof pdfjsLib === "undefined") { cb([], new Error("PDF.js n\u00e3o carregado")); return; }
    pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";
    var rd = new FileReader();
    rd.onload = function(e) {
      pdfjsLib.getDocument({data: new Uint8Array(e.target.result)}).promise
        .then(function(pdf) {
          // FIX: ler TODAS as páginas, não só a primeira (evita perder itens que começam na página 2+)
          var promessasPaginas = [];
          for (var p = 1; p <= pdf.numPages; p++) {
            promessasPaginas.push(pdf.getPage(p).then(function(pg){ return pg.getTextContent(); }));
          }
          return Promise.all(promessasPaginas);
        })
        .then(function(conteudosPorPagina) {
          var txts = [];
          conteudosPorPagina.forEach(function(content){
            (content.items||[]).forEach(function(it){
              var s = it.str||"";
              if (s.trim()!=="") txts.push(s);
            });
          });
          var itens = parsearPDFTextoEnsinar(txts); // FIX: exige preço próximo, evita cabeçalho/marca solta
          var descs = itens.map(function(it){ return it.desc; });
          cb(descs, null);
        })
        .catch(function(err){ cb([], err); });
    };
    rd.onerror = function(){ cb([], new Error("Erro")); };
    rd.readAsArrayBuffer(file);
  };
  var parsearXLSXDesc = function(file, cb) {
    var rd = new FileReader();
    rd.onload = function(e) {
      try {
        var wb = XLSX.read(new Uint8Array(e.target.result), {type:"array"});
        var ws = wb.Sheets[wb.SheetNames[0]];
        var aoa = XLSX.utils.sheet_to_json(ws, {header:1, defval:""});
        var descs = [];
        aoa.forEach(function(row) {
          var numCols = [];
          row.forEach(function(cell, i) {
            var n = typeof cell === "number" ? cell : parseFloat(String(cell).replace(/\./g,"").replace(",","."));
            if (!isNaN(n) && n > 0 && n < 9999999) numCols.push({val:n, idx:i});
          });
          if (!numCols.length) return; // FIX: sem preço na linha, não é item de verdade (cabeçalho/marca solta)
          var lastN = numCols[numCols.length-1];
          var desc = row.slice(0, lastN.idx).map(function(v){return String(v).trim();}).filter(function(v){return v&&isNaN(parseFloat(v));}).join(" ").trim().toUpperCase();
          if (desc.length > 3) descs.push(desc);
        });
        cb(descs, null);
      } catch(err) { cb([], err); }
    };
    rd.onerror = function(){ cb([], new Error("Erro")); };
    rd.readAsArrayBuffer(file);
  };
  var parsearTextoDesc = function(txt) {
    var NUM_BR = /\d{1,3}(?:\.\d{3})*,\d{2,4}/;
    var NUM_US = /\d{1,3}(?:,\d{3})*\.\d{2,4}/;
    var CABECALHOS = /^(C[o\u00f3]d\.?|Item|Seq\.?|It|DES|Qtd|Qtde|Quantidade|UN|UND|Unid|Marca|Pre[\u00e7c]o|Valor|Vlr|Total|Desconto|Descri[\u00e7c][\u00e3a]o|Produto|Tipo|Refer[\u00ea e]ncia|NCM|Lote|Fantasia|Endere[\u00e7c]o|Bairro|Cidade|Munic[\u00ed i]pio|CEP|CNPJ|CPF|Telefone|Fone|Vendedor|Data|Status|Cliente|Fax|E-?Mail|Impresso|Obs|Entrada|Frete|ST|Rep|Compl|Inscr|Raz[\u00e3a]o|Contato|Bruto|L[\u00ed i]quido|Acr[\u00e9e]scimo|Volumes|Servi[\u00e7c]o|Servi[\u00e7c]os|Substitui|IPI|ICMS|COFINS|PIS|FCP|Classif|Ordem|Parcela|Parcelas|Cota[\u00e7c][\u00e3a]o|Or[\u00e7c]amento|Emiss[\u00e3a]o|Prazo|Validade|F[\u00e1a]brica|Peso|Subtotal|Detalhe|Outras?|Desp\.?|Subst\.?|Trib\.?|Serv\.?)/i;
    var EMPRESA = /(LTDA|EIRELI|\bS\/A\b|\bME\b|\bEPP\b|COMERCIO|IND[U\u00da]STRIA|ENGENHARIA)/i;
    var ehLinhaCabecalho = function(linha){
      if (linha.length < 8) return true;
      if (EMPRESA.test(linha)) return true; // nome de empresa/raz\u00e3o social, n\u00e3o \u00e9 insumo
      var palavras = linha.split(/\s+/).filter(function(w){ return w.length > 1; });
      if (!palavras.length) return true;
      var cabCount = 0;
      palavras.forEach(function(p){ if (CABECALHOS.test(p.replace(/[.:;,]/g,''))) cabCount++; });
      if (cabCount / palavras.length > 0.4) return true;
      return false;
    };
    var descs = [];
    String(txt||'').split(/\r\n|\r|\n/).forEach(function(linhaRaw) {
      var linha = linhaRaw.trim();
      if (linha.length < 10) return;
      if (ehLinhaCabecalho(linha)) return;
      // FIX: aceita formato de pre\u00e7o BR (1.234,56) OU US (1,234.56) - fornecedores diferentes usam formatos diferentes
      var temPreco = NUM_BR.test(linha) || NUM_US.test(linha);
      if (!temPreco) return;
      var desc = linha
        .replace(new RegExp(NUM_BR, 'g'), ' ')
        .replace(new RegExp(NUM_US, 'g'), ' ')
        .replace(/\b\d+[.,]?\d*\b/g, ' ')
        .replace(/R\$/g, ' ')
        .replace(/^\.\s*/, '')
        .replace(/\s{2,}/g, ' ')
        .trim();
      if (desc.length > 8 && /[a-zA-Z\u00c0-\u00ff]{4,}/.test(desc)) descs.push(desc.toUpperCase());
    });
    return descs;
  };

  var adicionarItens = function(descs){
    // Remove duplicado e o que já está na memória (não faz sentido reensinar)
    var vistos = {};
    itensCarregados.forEach(function(d){ vistos[d]=true; });
    var novos = [];
    descs.forEach(function(d){
      var chave = String(d||'').trim().toUpperCase();
      if(!chave || vistos[chave]) return;
      if(aprendizados[chave]) return;
      vistos[chave] = true;
      novos.push(chave);
    });
    if(!novos.length && descs.length){
      setErro('Todos os itens dessas planilhas j\u00e1 estavam na mem\u00f3ria do sistema.');
    } else {
      setErro('');
    }
    setItensCarregados(function(prev){ return prev.concat(novos); });
  };

  var buscarMapaPorNumero = function(){
    var numDigitado = String(numeroMapaBusca||'').trim().replace(/^0+(?=\d)/, '');
    if(!numDigitado){ setFiltroInsumosMapa(null); setErro(''); return; }
    setBuscandoMapa(true); setErro('');
    sbGetMapasOnce().then(function(mapas){
      var encontrado = (mapas||[]).find(function(m){ return String(m.numero||'').trim() === numDigitado; });
      setBuscandoMapa(false);
      if(!encontrado){ setErro('Mapa n\u00b0 '+numDigitado+' n\u00e3o encontrado.'); setFiltroInsumosMapa(null); return; }
      var itensDoMapa = encontrado.itens||[];
      if(!itensDoMapa.length){ setErro('O mapa n\u00b0 '+numDigitado+' n\u00e3o tem itens.'); setFiltroInsumosMapa(null); return; }
      var descsUnicas = {};
      itensDoMapa.forEach(function(it){ if(it.descricao) descsUnicas[it.descricao]=true; });
      if(!Object.keys(descsUnicas).length){ setErro('O mapa n\u00b0 '+numDigitado+' n\u00e3o tem insumos com descri\u00e7\u00e3o preenchida.'); setFiltroInsumosMapa(null); return; }
      setFiltroInsumosMapa(descsUnicas);
    }).catch(function(){
      setBuscandoMapa(false);
      setErro('Erro ao buscar o mapa. Verifique sua conex\u00e3o.');
    });
  };
  var limparFiltroMapa = function(){ setNumeroMapaBusca(''); setFiltroInsumosMapa(null); setErro(''); };

  // FIX: leitura da planilha de sinônimos (3ª forma de ensinar) — trata células mescladas na coluna A
  var handleArquivoPlanilha = function(e){
    var file = e.target.files[0]; e.target.value=''; if(!file) return;
    setProcessandoPlanilha(true); setErroPlanilha(''); setPreviewPlanilha(null);
    var reader = new FileReader();
    reader.onload = function(ev){
      try {
        var wb = XLSX.read(new Uint8Array(ev.target.result), {type:'array'});
        var ws = wb.Sheets[wb.SheetNames[0]];
        var merges = ws['!merges'] || [];
        var aoa = XLSX.utils.sheet_to_json(ws, {header:1, defval:''});

        // Acha o valor "efetivo" da coluna A para uma linha, considerando merge de células
        var valorColunaA = function(linhaIdx){
          var direto = String((aoa[linhaIdx] && aoa[linhaIdx][0]) || '').trim();
          if (direto) return direto;
          for (var i=0; i<merges.length; i++){
            var m = merges[i];
            if (m.s.c === 0 && m.e.c === 0 && linhaIdx >= m.s.r && linhaIdx <= m.e.r){
              var linhaBase = aoa[m.s.r];
              return String((linhaBase && linhaBase[0]) || '').trim();
            }
          }
          return '';
        };

        var catalogoUpper = cadastrosInsumos.map(function(s){ return String(s||'').toUpperCase(); });
        var pares = [];
        for (var i=0; i<aoa.length; i++){
          var oficial = valorColunaA(i).toUpperCase();
          var sinonimo = String((aoa[i] && aoa[i][1]) || '').trim().toUpperCase();
          if (!oficial || !sinonimo) continue; // linha incompleta - pula
          if (oficial === sinonimo) continue; // não faz sentido ensinar X=X
          var existeNoCatalogo = catalogoUpper.indexOf(oficial) >= 0;
          var status;
          if (!existeNoCatalogo) status = 'nao_encontrado';
          else if (aprendizados[sinonimo] === oficial) status = 'ja_existe';
          else if (aprendizados[sinonimo] && aprendizados[sinonimo] !== oficial) status = 'atualizado';
          else status = 'novo';
          pares.push({ oficial: oficial, sinonimo: sinonimo, status: status });
        }

        if (!pares.length){
          setErroPlanilha('Nenhum par válido encontrado na planilha. Confira se a coluna A tem o insumo oficial e a coluna B tem o apelido.');
          setProcessandoPlanilha(false);
          return;
        }
        setPreviewPlanilha(pares);
        setProcessandoPlanilha(false);
      } catch(err){
        setErroPlanilha('Não foi possível ler o arquivo. Confira se é um .xlsx válido.');
        setProcessandoPlanilha(false);
      }
    };
    reader.onerror = function(){ setErroPlanilha('Erro ao ler o arquivo.'); setProcessandoPlanilha(false); };
    reader.readAsArrayBuffer(file);
  };

  var confirmarImportacaoPlanilha = function(){
    if (!previewPlanilha) return;
    var paraEnsinar = previewPlanilha.filter(function(p){ return p.status === 'novo' || p.status === 'atualizado'; });
    paraEnsinar.forEach(function(p){ onAprendizadoSalvo(p.sinonimo, p.oficial); });
    setPreviewPlanilha(null);
    setToast(paraEnsinar.length + ' aprendizado' + (paraEnsinar.length===1?'':'s') + ' adicionado' + (paraEnsinar.length===1?'':'s') + ' com sucesso!');
    setTimeout(function(){ setToast(''); }, 3500);
    setAbaAtiva('conferir');
  };

  var handleArquivos = function(e){
    var files = Array.prototype.slice.call(e.target.files||[]);
    e.target.value = "";
    if(!files.length) return;
    setCarregando(true); setErro('');
    var todasDescs = [];
    var pendentes = files.length;
    var finalizar = function(){
      pendentes--;
      if(pendentes <= 0){ setCarregando(false); adicionarItens(todasDescs); }
    };
    files.forEach(function(file){
      var ext = (file.name.split(".").pop()||"").toLowerCase();
      if(ext === "pdf"){
        parsearPDFDesc(file, function(descs, err){
          if(!err){ todasDescs = todasDescs.concat(descs); finalizar(); return; }
          // FIX: arquivo tem extensão .pdf mas não é um PDF de verdade (ex: texto exportado de um ERP) -
          // tenta ler como texto puro antes de desistir, em vez de descartar silenciosamente
          var rd2 = new FileReader();
          rd2.onload = function(ev){ todasDescs = todasDescs.concat(parsearTextoDesc(ev.target.result)); finalizar(); };
          rd2.onerror = function(){ finalizar(); };
          rd2.readAsText(file, "UTF-8");
        });
      } else if(ext === "xlsx" || ext === "xls"){
        parsearXLSXDesc(file, function(descs, err){ if(!err) todasDescs = todasDescs.concat(descs); finalizar(); });
      } else {
        var rd = new FileReader();
        rd.onload = function(ev){ todasDescs = todasDescs.concat(parsearTextoDesc(ev.target.result)); finalizar(); };
        rd.onerror = function(){ finalizar(); };
        rd.readAsText(file, "UTF-8");
      }
    });
  };

  var handleAssociar = function(itemDesc, insumoDescricao){
    onAprendizadoSalvo(itemDesc, insumoDescricao);
    setItensCarregados(function(prev){ return prev.filter(function(d){ return d !== itemDesc; }); });
    setSelecionadoEsquerda(null);
    setMarcadosParaExcluir({}); // FIX: evita marcação apontar pro índice errado após a lista mudar
    setToast('\u2705 "'+itemDesc+'" associado com sucesso!');
    setTimeout(function(){ setToast(''); }, 2500);
  };

  var toggleMarcado = function(idx){
    setMarcadosParaExcluir(function(prev){ var n = Object.assign({}, prev); n[idx] = !n[idx]; return n; });
  };
  var totalMarcados = Object.keys(marcadosParaExcluir).filter(function(k){ return marcadosParaExcluir[k]; }).length;
  var excluirMarcados = function(){
    if(!totalMarcados) return;
    if(window.confirm(totalMarcados+' item(ns) ser\u00e3o exclu\u00eddo(s) da lista, sem criar associa\u00e7\u00e3o nenhuma.\nVoc\u00ea pode carregar os or\u00e7amentos de novo depois, se precisar.\n\nConfirma?')){
      setItensCarregados(function(prev){ return prev.filter(function(x, i){ return !marcadosParaExcluir[i]; }); });
      setMarcadosParaExcluir({});
      setSelecionadoEsquerda(null);
    }
  };
  var cancelarSelecao = function(){ setMarcadosParaExcluir({}); };

  var clicarEsquerda = function(itemDesc){
    setSelecionadoEsquerda(function(prev){ return prev === itemDesc ? null : itemDesc; });
  };
  var clicarDireita = function(insumoDescricao){
    if(!selecionadoEsquerda) return;
    handleAssociar(selecionadoEsquerda, insumoDescricao);
  };
  var arrastarInicio = function(e, itemDesc){ e.dataTransfer.setData('text/plain', itemDesc); };
  var soltarDireita = function(e, insumoDescricao){
    e.preventDefault();
    var itemDesc = e.dataTransfer.getData('text/plain');
    if(itemDesc) handleAssociar(itemDesc, insumoDescricao);
  };

  // Contagem de associações pré-calculada de uma vez (evita recalcular por item, mais rápido)
  var contagemPorInsumo = {};
  Object.keys(aprendizados).forEach(function(k){
    var v = aprendizados[k];
    contagemPorInsumo[v] = (contagemPorInsumo[v]||0) + 1;
  });

  var listaDireitaFiltrada = cadastrosInsumos.filter(function(ins){
    var passaFiltroMapa = !filtroInsumosMapa || filtroInsumosMapa[ins];
    var passaBusca = !buscaDireita || ins.toUpperCase().indexOf(buscaDireita.toUpperCase()) >= 0;
    return passaFiltroMapa && passaBusca;
  });

  // Agrupamento da mem\u00f3ria por insumo (calculado aqui fora, simples, sem fun\u00e7\u00e3o aninhada no meio do HTML)
  var porInsumo = {};
  Object.keys(aprendizados).forEach(function(chave){
    var insumo = aprendizados[chave];
    if(!porInsumo[insumo]) porInsumo[insumo] = [];
    porInsumo[insumo].push(chave);
  });
  var totalInsumosConferir = Object.keys(porInsumo).length;
  var buscaConferirUpper = buscaConferir.toUpperCase();
  var insumosFiltrados = Object.keys(porInsumo).filter(function(insumo){
    if(!buscaConferir) return true;
    if(insumo.toUpperCase().indexOf(buscaConferirUpper) >= 0) return true;
    return porInsumo[insumo].some(function(txt){ return txt.indexOf(buscaConferirUpper) >= 0; });
  }).sort();

  var ovStyle = { position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.55)',zIndex:9600,display:'flex',alignItems:'center',justifyContent:'center' };
  var modalStyle = { background:'#fff',borderRadius:8,width:'min(920px,96vw)',maxHeight:'92vh',display:'flex',flexDirection:'column',overflow:'hidden',minHeight:0 };

  return /*#__PURE__*/React.createElement('div', { style:ovStyle },
    /*#__PURE__*/React.createElement('div', { style:modalStyle },
      /*#__PURE__*/React.createElement('div', { style:{background:'#5b3fa0',color:'#fff',padding:'12px 16px',display:'flex',alignItems:'center',justifyContent:'space-between'} },
        /*#__PURE__*/React.createElement('span', { style:{fontSize:12,fontWeight:'bold'} }, '\uD83E\uDDE0 ENSINAR O SISTEMA \u00B7 Associar Insumos'),
        /*#__PURE__*/React.createElement('div', { style:{display:'flex',alignItems:'center',gap:10} },
          /*#__PURE__*/React.createElement('label', { style:{background:'#185FA5',color:'#fff',padding:'6px 12px',borderRadius:6,fontSize:11,fontWeight:'bold',cursor:'pointer',display:'flex',alignItems:'center',gap:6} },
            '\uD83D\uDCC2 Carregar Or\u00e7amentos',
            /*#__PURE__*/React.createElement('input', { type:'file', accept:'.pdf,.xlsx,.xls,.csv,.txt', multiple:true, style:{display:'none'}, onChange:handleArquivos })
          ),
          /*#__PURE__*/React.createElement('span', { style:{cursor:'pointer',fontSize:16,opacity:.8}, onClick:onClose }, '\u2715')
        )
      ),
      /*#__PURE__*/React.createElement('div', { style:{display:'flex',gap:8,padding:'8px 16px',background:'#f3f0ff',borderBottom:'1px solid #e0d5f5'} },
        /*#__PURE__*/React.createElement('button', {
          onClick: function(){ setAbaAtiva('associar'); },
          style:{background: abaAtiva==='associar' ? '#5b3fa0' : 'rgba(91,63,160,.12)', color: abaAtiva==='associar' ? '#fff' : '#5b3fa0', border:'none', borderRadius:6, padding:'6px 12px', fontSize:11, fontWeight:'bold', cursor:'pointer'}
        }, '\u2795 Associar Novos'),
        /*#__PURE__*/React.createElement('button', {
          onClick: function(){ setAbaAtiva('conferir'); },
          style:{background: abaAtiva==='conferir' ? '#5b3fa0' : 'rgba(91,63,160,.12)', color: abaAtiva==='conferir' ? '#fff' : '#5b3fa0', border:'none', borderRadius:6, padding:'6px 12px', fontSize:11, fontWeight:'bold', cursor:'pointer'}
        }, '\uD83D\uDCCB Conferir Associa\u00e7\u00f5es ('+Object.keys(aprendizados).length+')'),
        /*#__PURE__*/React.createElement('button', {
          onClick: function(){ setAbaAtiva('importarPlanilha'); },
          style:{background: abaAtiva==='importarPlanilha' ? '#5b3fa0' : 'rgba(91,63,160,.12)', color: abaAtiva==='importarPlanilha' ? '#fff' : '#5b3fa0', border:'none', borderRadius:6, padding:'6px 12px', fontSize:11, fontWeight:'bold', cursor:'pointer'}
        }, '\uD83D\uDCCA Importar Planilha')
      ),
      abaAtiva === 'associar' && /*#__PURE__*/React.createElement(React.Fragment, null,
      carregando && /*#__PURE__*/React.createElement('div', { style:{padding:'8px 16px',fontSize:11,color:'#5b3fa0',background:'#f3f0ff'} }, 'Lendo arquivos...'),
      erro && /*#__PURE__*/React.createElement('div', { style:{padding:'8px 16px',fontSize:11,color:'#a32d2d',background:'#fdecea'} }, erro),
      /*#__PURE__*/React.createElement('div', { style:{display:'flex',flex:1,overflow:'hidden',minHeight:0,background:'#fff'} },
        /*#__PURE__*/React.createElement('div', { style:{flex:1,display:'flex',flexDirection:'column',borderRight:'1px solid #eee',background:'#fffdf5'} },
          /*#__PURE__*/React.createElement('div', { style:{padding:'10px 14px',borderBottom:'1px solid #eee',display:'flex',justifyContent:'space-between',alignItems:'center',background:'#fffdf5'} },
            /*#__PURE__*/React.createElement('b', { style:{fontSize:11,color:'#333'} }, '\uD83D\uDCC4 INSUMOS DOS OR\u00c7AMENTOS'),
            /*#__PURE__*/React.createElement('span', { style:{background:itensCarregados.length?'#c0392b':'#aaa',color:'#fff',borderRadius:20,padding:'2px 10px',fontSize:10,fontWeight:'bold'} }, itensCarregados.length+' pendente'+(itensCarregados.length===1?'':'s'))
          ),
          itensCarregados.length>0 && /*#__PURE__*/React.createElement('div', { style:{margin:'8px 12px 0',padding:'7px 10px',border:'1px solid #ccc',borderRadius:6,fontSize:12,display:'flex',alignItems:'center',gap:6,background:'#fff'} },
            '\uD83D\uDD0D',
            /*#__PURE__*/React.createElement('input', {
              value: buscaEsquerda, onChange: function(e){ setBuscaEsquerda(e.target.value); },
              placeholder: 'Buscar nos itens carregados...', style:{border:'none',outline:'none',fontSize:12,flex:1}
            })
          ),
          itensCarregados.length===0 && !carregando && /*#__PURE__*/React.createElement('div', { style:{padding:20,fontSize:11,color:'#888',textAlign:'center'} }, 'Carregue um ou mais or\u00e7amentos acima para come\u00e7ar.'),
          itensCarregados.length>0 && /*#__PURE__*/React.createElement('div', { style:{background:'#fff8e6',border:'1px solid #f0d080',borderRadius:6,margin:'8px 12px 0',padding:'6px 10px',fontSize:10,color:'#7a6010'} },
            '\uD83D\uDCF1 Toque num item aqui e depois toque no insumo certo \u00e0 direita para associar. Tamb\u00e9m d\u00e1 pra arrastar no computador. Marque a caixinha pra excluir v\u00e1rios de uma vez.'
          ),
          totalMarcados > 0 && /*#__PURE__*/React.createElement('div', { style:{background:'#fdecea',border:'1px solid #f5b8b8',borderRadius:6,margin:'8px 12px 0',padding:'8px 10px',display:'flex',alignItems:'center',gap:8} },
            /*#__PURE__*/React.createElement('span', { style:{fontSize:11,color:'#a32d2d',fontWeight:'bold',flex:1} }, totalMarcados+' selecionado'+(totalMarcados===1?'':'s')),
            /*#__PURE__*/React.createElement('button', { onClick:excluirMarcados, style:{background:'#c0392b',color:'#fff',border:'none',borderRadius:6,padding:'6px 12px',fontSize:10,fontWeight:'bold',cursor:'pointer'} }, '\uD83D\uDDD1\uFE0F Excluir Selecionados'),
            /*#__PURE__*/React.createElement('button', { onClick:cancelarSelecao, style:{background:'#f0f0f0',color:'#555',border:'none',borderRadius:6,padding:'6px 12px',fontSize:10,cursor:'pointer'} }, 'Cancelar')
          ),
          /*#__PURE__*/React.createElement('div', { className:'scroll-ensinar', style:{flex:1,minHeight:0,overflowY:'scroll',padding:'8px 12px',width:'100%',boxSizing:'border-box',overscrollBehavior:'contain'} },
            itensCarregados.map(function(d, idx){ return {texto:d, idxOriginal:idx}; }).filter(function(item){
              return !buscaEsquerda || String(item.texto||'').toUpperCase().indexOf(buscaEsquerda.toUpperCase()) >= 0;
            }).map(function(item){
              var d = item.texto, idx = item.idxOriginal;
              var sel = selecionadoEsquerda === d;
              return /*#__PURE__*/React.createElement('div', {
                key: idx,
                draggable: true,
                onDragStart: function(e){ arrastarInicio(e, d); },
                onClick: function(){ clicarEsquerda(d); },
                style:{background:sel?'#fde6b8':'#fff',border:'2px dashed '+(sel?'#c0392b':'#f0a500'),borderRadius:8,padding:'9px 12px',marginBottom:7,fontSize:11,color:'#333',cursor:'pointer',display:'flex',alignItems:'center',gap:8}
              },
                /*#__PURE__*/React.createElement('input', {
                  type: 'checkbox',
                  checked: !!marcadosParaExcluir[idx],
                  onClick: function(e){ e.stopPropagation(); },
                  onChange: function(){ toggleMarcado(idx); },
                  style:{flexShrink:0,width:16,height:16,cursor:'pointer'}
                }),
                /*#__PURE__*/React.createElement('span', { style:{flex:1} }, d),
                /*#__PURE__*/React.createElement('span', {
                  onClick: function(e){
                    e.stopPropagation();
                    if(window.confirm('Excluir "'+d+'" da lista?\nVoc\u00ea pode carregar o or\u00e7amento de novo depois, se precisar.')){
                      setItensCarregados(function(prev){ return prev.filter(function(x, i){ return i !== idx; }); });
                      if(selecionadoEsquerda === d) setSelecionadoEsquerda(null);
                      setMarcadosParaExcluir({}); // FIX: evita marcação apontar pro índice errado após a lista mudar
                    }
                  },
                  title: 'Excluir sem associar',
                  style:{flexShrink:0,width:22,height:22,borderRadius:'50%',background:'#fdecea',color:'#c0392b',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'bold',fontSize:12,cursor:'pointer'}
                }, '\u2715')
              );
            })
          )
        ),
        /*#__PURE__*/React.createElement('div', { style:{flex:1,display:'flex',flexDirection:'column',background:'#f9fbff'} },
          /*#__PURE__*/React.createElement('div', { style:{padding:'10px 14px',borderBottom:'1px solid #eee',display:'flex',justifyContent:'space-between',alignItems:'center',background:'#f9fbff'} },
            /*#__PURE__*/React.createElement('b', { style:{fontSize:11,color:'#333'} }, '\uD83D\uDCCB CADASTRO DE INSUMOS'),
            /*#__PURE__*/React.createElement('span', { style:{background:'#0f1f3d',color:'#fff',borderRadius:20,padding:'2px 10px',fontSize:10,fontWeight:'bold'} }, (filtroInsumosMapa ? Object.keys(filtroInsumosMapa).length : cadastrosInsumos.length)+(filtroInsumosMapa ? ' do mapa' : ' no total'))
          ),
          /*#__PURE__*/React.createElement('div', { style:{margin:'8px 12px 0',display:'flex',gap:6,alignItems:'center'} },
            /*#__PURE__*/React.createElement('input', {
              value: numeroMapaBusca,
              onChange: function(e){ setNumeroMapaBusca(e.target.value); },
              onKeyDown: function(e){ if(e.key==='Enter') buscarMapaPorNumero(); },
              placeholder: 'N\u00b0 do mapa (opcional)',
              style:{flex:1,padding:'5px 8px',border:'1px solid #c5b3e8',borderRadius:5,fontSize:11}
            }),
            /*#__PURE__*/React.createElement('button', {
              onClick: buscarMapaPorNumero,
              disabled: buscandoMapa,
              style:{background:'#5b3fa0',color:'#fff',border:'none',borderRadius:5,padding:'5px 10px',fontSize:10,fontWeight:'bold',cursor: buscandoMapa?'not-allowed':'pointer',whiteSpace:'nowrap'}
            }, buscandoMapa ? '...' : '\uD83D\uDD0D Filtrar'),
            filtroInsumosMapa && /*#__PURE__*/React.createElement('button', {
              onClick: limparFiltroMapa,
              title: 'Voltar a mostrar todos os insumos',
              style:{background:'#f0f0f0',color:'#555',border:'none',borderRadius:5,padding:'5px 10px',fontSize:10,cursor:'pointer',whiteSpace:'nowrap'}
            }, '\u2715 Ver todos')
          ),
          /*#__PURE__*/React.createElement('div', { style:{margin:'8px 12px',padding:'6px 10px',border:'1px solid #ccc',borderRadius:6,fontSize:12,display:'flex',alignItems:'center',gap:6,background:'#fff'} },
            '\uD83D\uDD0D',
            /*#__PURE__*/React.createElement('input', {
              value: buscaDireita, onChange: function(e){ setBuscaDireita(e.target.value); },
              placeholder: 'Buscar insumo do cadastro...', style:{border:'none',outline:'none',fontSize:12,flex:1}
            })
          ),
          cadastrosInsumos.length===0 && /*#__PURE__*/React.createElement('div', { style:{padding:20,fontSize:11,color:'#888',textAlign:'center'} }, 'Nenhum insumo cadastrado ainda. Cadastre primeiro em CADASTROS.'),
          /*#__PURE__*/React.createElement('div', { style:{flex:1,overflowY:'auto',padding:'8px 12px'} },
            listaDireitaFiltrada.map(function(ins, idx){
              var nAssoc = contagemPorInsumo[ins]||0;
              return /*#__PURE__*/React.createElement('div', {
                key: idx,
                onDragOver: function(e){ e.preventDefault(); },
                onDrop: function(e){ soltarDireita(e, ins); },
                onClick: function(){ clicarDireita(ins); },
                style:{background:selecionadoEsquerda?'#eafaf0':'#fff',border:'1px solid '+(selecionadoEsquerda?'#0e7a5f':'#d5dceb'),borderRadius:8,padding:'9px 12px',marginBottom:7,fontSize:11,color:'#333',display:'flex',justifyContent:'space-between',alignItems:'center',cursor:selecionadoEsquerda?'pointer':'default'}
              },
                /*#__PURE__*/React.createElement('span', null, ins),
                /*#__PURE__*/React.createElement('span', { style:{background:'#e8f0fe',color:'#185FA5',borderRadius:20,padding:'2px 8px',fontSize:9,fontWeight:'bold',whiteSpace:'nowrap',marginLeft:8} }, nAssoc+' associa\u00e7\u00e3o'+(nAssoc===1?'':'\u00f5es'))
              );
            })
          )
        )
      )
      ),
      abaAtiva === 'conferir' && /*#__PURE__*/React.createElement('div', { style:{flex:1,display:'flex',flexDirection:'column',overflow:'hidden',minHeight:0,background:'#fff'} },
        erroConferir && /*#__PURE__*/React.createElement('div', { style:{margin:'10px 16px 0',padding:'10px 14px',background:'#fdecea',border:'1px solid #f5b8b8',borderRadius:6,fontSize:12,color:'#a32d2d'} }, erroConferir),
        /*#__PURE__*/React.createElement('div', { style:{margin:'10px 16px',padding:'9px 12px',border:'1px solid #ccc',borderRadius:6,fontSize:14,display:'flex',alignItems:'center',gap:8,background:'#fff',flexShrink:0} },
          '\uD83D\uDD0D',
          /*#__PURE__*/React.createElement('input', {
            value: buscaConferir, onChange: function(e){ setBuscaConferir(e.target.value); },
            placeholder: 'Buscar insumo ou texto...', style:{border:'none',outline:'none',fontSize:14,flex:1}
          })
        ),
        /*#__PURE__*/React.createElement('div', { style:{padding:'0 16px',fontSize:11,color:'#777',flexShrink:0} }, Object.keys(aprendizados).length+' associa\u00e7\u00f5es \u00b7 '+totalInsumosConferir+' insumos'),
        /*#__PURE__*/React.createElement('div', { style:{flex:1,minHeight:0,overflowY:'auto',padding:'8px 16px 16px',background:'#fff'} },
          totalInsumosConferir===0 && /*#__PURE__*/React.createElement('div', { style:{padding:30,fontSize:14,color:'#888',textAlign:'center'} }, 'Nenhuma associa\u00e7\u00e3o ensinada ainda.'),
          insumosFiltrados.map(function(insumo){
            var textos = porInsumo[insumo];
            return /*#__PURE__*/React.createElement('div', {
              key: insumo,
              style:{border:'1px solid #e0e0e0',borderRadius:8,marginBottom:10,background:'#fff'}
            },
              /*#__PURE__*/React.createElement('div', { style:{background:'#eef0ff',padding:'10px 12px',display:'flex',justifyContent:'space-between',alignItems:'center',gap:8} },
                /*#__PURE__*/React.createElement('b', { style:{fontSize:13,color:'#0f1f3d',wordBreak:'break-word'} }, insumo),
                /*#__PURE__*/React.createElement('span', { style:{background:'#5b3fa0',color:'#fff',borderRadius:20,padding:'2px 9px',fontSize:10,fontWeight:'bold',whiteSpace:'nowrap'} }, textos.length+' texto'+(textos.length===1?'':'s'))
              ),
              textos.map(function(chave){
                var estaExcluindo = excluindoChave === chave;
                return /*#__PURE__*/React.createElement('div', {
                  key: chave,
                  style:{display:'flex',alignItems:'center',gap:8,padding:'9px 12px',borderTop:'1px solid #f0f0f0',fontSize:12,background:'#fff'}
                },
                  /*#__PURE__*/React.createElement('span', { style:{flex:1,color:'#555',wordBreak:'break-word'} }, '"'+chave+'"'),
                  /*#__PURE__*/React.createElement('button', {
                    disabled: estaExcluindo,
                    onClick: function(){
                      if(!window.confirm('Desfazer a associa\u00e7\u00e3o de "'+chave+'"?\nDa pr\u00f3xima vez que esse texto aparecer, o sistema vai precisar reconhecer de novo.')) return;
                      setExcluindoChave(chave); setErroConferir('');
                      onAprendizadoRemovido(chave).then(function(ok){
                        setExcluindoChave(null);
                        if(!ok) setErroConferir('N\u00e3o foi poss\u00edvel desfazer agora. Verifique sua conex\u00e3o e tente de novo.');
                      });
                    },
                    style:{background:'#fdecea',color:'#c0392b',border:'none',borderRadius:5,padding:'5px 9px',fontSize:10,fontWeight:'bold',cursor: estaExcluindo?'not-allowed':'pointer',whiteSpace:'nowrap'}
                  }, estaExcluindo ? '...' : '\u2715 Desfazer')
                );
              })
            );
          })
        )
      ),
      abaAtiva === 'importarPlanilha' && /*#__PURE__*/React.createElement('div', { style:{flex:1,display:'flex',flexDirection:'column',overflow:'hidden',minHeight:0,background:'#fff',padding:'16px'} },
        !previewPlanilha && /*#__PURE__*/React.createElement(React.Fragment, null,
          /*#__PURE__*/React.createElement('div', { style:{fontSize:12,color:'#555',lineHeight:1.6,marginBottom:14} },
            /*#__PURE__*/React.createElement('b', null, 'Como montar a planilha:'), /*#__PURE__*/React.createElement('br'),
            '\u2022 Coluna A: nome do insumo já cadastrado no sistema.', /*#__PURE__*/React.createElement('br'),
            '\u2022 Coluna B: apelidos/variações que significam o mesmo insumo — uma linha por apelido.', /*#__PURE__*/React.createElement('br'),
            '\u2022 Mescle as células da coluna A quando o mesmo insumo tiver vários apelidos.'
          ),
          erroPlanilha && /*#__PURE__*/React.createElement('div', { style:{padding:'10px 14px',background:'#fdecea',border:'1px solid #f5b8b8',borderRadius:6,fontSize:12,color:'#a32d2d',marginBottom:12} }, erroPlanilha),
          processandoPlanilha && /*#__PURE__*/React.createElement('div', { style:{padding:'10px 14px',fontSize:12,color:'#5b3fa0'} }, 'Lendo planilha...'),
          /*#__PURE__*/React.createElement('label', {
            style:{display:'flex',flexDirection:'column',alignItems:'center',gap:8,border:'2px dashed #c5d0e0',borderRadius:10,padding:'32px 16px',cursor:'pointer',color:'#8a9bb0',fontSize:13}
          },
            /*#__PURE__*/React.createElement('span', {style:{fontSize:28}}, '\uD83D\uDCC1'),
            'Toque para escolher o arquivo .xlsx',
            /*#__PURE__*/React.createElement('input', { type:'file', accept:'.xlsx,.xls', style:{display:'none'}, onChange:handleArquivoPlanilha })
          )
        ),
        previewPlanilha && /*#__PURE__*/React.createElement(React.Fragment, null,
          (function(){
            var novos = previewPlanilha.filter(function(p){ return p.status==='novo'; }).length;
            var atualizados = previewPlanilha.filter(function(p){ return p.status==='atualizado'; }).length;
            var jaExiste = previewPlanilha.filter(function(p){ return p.status==='ja_existe'; }).length;
            var naoEncontrado = previewPlanilha.filter(function(p){ return p.status==='nao_encontrado'; }).length;
            var porOficial = {};
            previewPlanilha.forEach(function(p){
              var chave = p.status === 'nao_encontrado' ? ('\u26A0\uFE0F ' + p.oficial + ' (não cadastrado)') : p.oficial;
              if (!porOficial[chave]) porOficial[chave] = [];
              porOficial[chave].push(p);
            });
            return /*#__PURE__*/React.createElement('div', { style:{flex:1,display:'flex',flexDirection:'column',overflow:'hidden',minHeight:0} },
              naoEncontrado > 0 && /*#__PURE__*/React.createElement('div', { style:{padding:'10px 14px',background:'#fdecea',border:'1px solid #f5b8b8',borderRadius:6,fontSize:12,color:'#a32d2d',marginBottom:10,flexShrink:0} },
                '\u26A0\uFE0F ' + naoEncontrado + ' linha(s) ignorada(s): o nome da coluna A não foi encontrado no seu cadastro de insumos.'
              ),
              /*#__PURE__*/React.createElement('div', { style:{display:'flex',gap:10,marginBottom:12,flexShrink:0} },
                /*#__PURE__*/React.createElement('div', { style:{flex:1,background:'#f0fdf4',borderRadius:8,padding:'10px 12px',textAlign:'center'} },
                  /*#__PURE__*/React.createElement('div', { style:{fontSize:20,fontWeight:800,color:'#1a7a44'} }, novos + atualizados),
                  /*#__PURE__*/React.createElement('div', { style:{fontSize:10,color:'#777',marginTop:2} }, 'Novos aprendizados')
                ),
                /*#__PURE__*/React.createElement('div', { style:{flex:1,background:'#f5f5f5',borderRadius:8,padding:'10px 12px',textAlign:'center'} },
                  /*#__PURE__*/React.createElement('div', { style:{fontSize:20,fontWeight:800,color:'#888'} }, jaExiste),
                  /*#__PURE__*/React.createElement('div', { style:{fontSize:10,color:'#777',marginTop:2} }, 'Já conhecidos (ignorados)')
                )
              ),
              /*#__PURE__*/React.createElement('div', { style:{flex:1,minHeight:0,overflowY:'auto'} },
                Object.keys(porOficial).map(function(chaveOficial){
                  var itens = porOficial[chaveOficial];
                  var ehErro = chaveOficial.indexOf('\u26A0\uFE0F') === 0;
                  return /*#__PURE__*/React.createElement('div', { key:chaveOficial, style:{border:'1px solid '+(ehErro?'#f5b8b8':'#e0e0e0'),borderRadius:8,marginBottom:10} },
                    /*#__PURE__*/React.createElement('div', { style:{background: ehErro?'#a32d2d':'#0f1f3d',color:'#fff',padding:'8px 12px',fontSize:11,fontWeight:700} }, '\uD83D\uDCE6 ' + chaveOficial),
                    /*#__PURE__*/React.createElement('div', { style:{padding:'2px 12px'} },
                      itens.map(function(p, idx){
                        var pulado = p.status === 'ja_existe' || p.status === 'nao_encontrado';
                        return /*#__PURE__*/React.createElement('div', { key:idx, style:{display:'flex',alignItems:'center',gap:8,padding:'5px 0',fontSize:12,color: pulado?'#aaa':'#333',textDecoration: pulado?'line-through':'none',borderBottom: idx<itens.length-1 ? '1px solid #f5f5f5' : 'none'} },
                          /*#__PURE__*/React.createElement('span', {style:{color:'#f0a500'}}, '\u21B3'),
                          p.sinonimo,
                          p.status === 'ja_existe' && /*#__PURE__*/React.createElement('span', {style:{fontSize:9,background:'#eee',color:'#888',padding:'1px 6px',borderRadius:3,marginLeft:'auto'}}, 'já existe'),
                          p.status === 'atualizado' && /*#__PURE__*/React.createElement('span', {style:{fontSize:9,background:'#fff3c0',color:'#8a6d00',padding:'1px 6px',borderRadius:3,marginLeft:'auto'}}, 'atualiza')
                        );
                      })
                    )
                  );
                })
              ),
              /*#__PURE__*/React.createElement('div', { style:{display:'flex',justifyContent:'flex-end',gap:9,paddingTop:12,flexShrink:0} },
                /*#__PURE__*/React.createElement('button', { onClick:function(){ setPreviewPlanilha(null); }, style:{background:'#f0f2f5',color:'#555',border:'none',borderRadius:9,padding:'10px 18px',fontSize:12,fontWeight:600,cursor:'pointer'} }, 'Cancelar'),
                /*#__PURE__*/React.createElement('button', {
                  onClick: confirmarImportacaoPlanilha,
                  disabled: (novos+atualizados) === 0,
                  style:{background: (novos+atualizados)===0 ? '#ccc' : '#f0a500',color:'#0f1f3d',border:'none',borderRadius:9,padding:'10px 18px',fontSize:12,fontWeight:700,cursor: (novos+atualizados)===0?'not-allowed':'pointer'}
                }, '\u2713 Confirmar e Aprender ' + (novos+atualizados) + ' itens')
              )
            );
          })()
        )
      )
      ),
    toast && /*#__PURE__*/React.createElement('div', { style:{position:'fixed',bottom:24,left:'50%',transform:'translateX(-50%)',background:'#0e7a5f',color:'#fff',padding:'10px 20px',borderRadius:30,fontSize:12,fontWeight:'bold',boxShadow:'0 4px 14px rgba(0,0,0,.25)',zIndex:9999} }, toast)
  );
}

// ─── Modal Ler Com IA ─────────────────────────────────────────────────────────
// ─── Modal Importar Excel para o Mapa (Qt./Unid./Descrição) ─────────────────
// Colunas fixas SEM cabeçalho: A=Quantidade, B=Unidade, C=Descrição, dados começam na linha 1
function ModalImportarExcelMapa(_ref_imp) {
  var cadastrosInsumos = _ref_imp.cadastrosInsumos || [];
  var aprendizados = _ref_imp.aprendizados || {};
  var onAprendizadoSalvo = _ref_imp.onAprendizadoSalvo || function(){};
  var onClose = _ref_imp.onClose, onConfirmar = _ref_imp.onConfirmar;
  var _sLinhas = useState([]), linhas = _slicedToArray(_sLinhas,2)[0], setLinhas = _slicedToArray(_sLinhas,2)[1];
  var _sErro = useState(""), erro = _slicedToArray(_sErro,2)[0], setErro = _slicedToArray(_sErro,2)[1];
  var _sProc = useState(false), processando = _slicedToArray(_sProc,2)[0], setProcessando = _slicedToArray(_sProc,2)[1];
  var _sEnviando = useState(false), enviando = _slicedToArray(_sEnviando,2)[0], setEnviando = _slicedToArray(_sEnviando,2)[1];
  var _sModo = useState(""), modoEscolhido = _slicedToArray(_sModo,2)[0], setModoEscolhido = _slicedToArray(_sModo,2)[1];
  var _sCustoIA = useState(null), custoIA = _slicedToArray(_sCustoIA,2)[0], setCustoIA = _slicedToArray(_sCustoIA,2)[1];
  var _sProcIA = useState(false), processandoIA = _slicedToArray(_sProcIA,2)[0], setProcessandoIA = _slicedToArray(_sProcIA,2)[1];
  var _sEditando = useState({}), linhasEditando = _slicedToArray(_sEditando,2)[0], setLinhasEditando = _slicedToArray(_sEditando,2)[1];
  var _sTexto = useState({}), textoDigitado = _slicedToArray(_sTexto,2)[0], setTextoDigitado = _slicedToArray(_sTexto,2)[1];
  var _sOrigem = useState(null), resultadoOrigem = _slicedToArray(_sOrigem,2)[0], setResultadoOrigem = _slicedToArray(_sOrigem,2)[1];

  // Comparação de semelhança de texto (sem IA, sem custo, sem internet) ------
  var normalizarTexto = function(s){ return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toUpperCase().replace(/\s+/g,' '); };
  var encontrarMelhorMatch = function(textoImportado, catalogo){
    var alvo = normalizarTexto(textoImportado);
    if(!alvo) return { match:null, score:0 };
    var temDigito = function(w){ return /\d/.test(w); };
    var todasAlvo = alvo.split(' ').filter(function(w){ return w.length > 2 || /^\d+$/.test(w); }); // FIX: mantém números curtos (ex: ângulo 45/90)
    var palavrasAlvo = todasAlvo.filter(function(w){ return !temDigito(w); });
    var medidasAlvo = todasAlvo.filter(temDigito);
    var categoriaAlvo = palavrasAlvo[0] || ''; // FIX: primeira palavra de nome = categoria da peça (LUVA, JOELHO, CURVA, TUBO...)
    var melhor = null, melhorScore = 0;
    catalogo.forEach(function(itemCadastro){
      var itemNorm = normalizarTexto(itemCadastro);
      if(!itemNorm) return;
      if(itemNorm === alvo){ melhor = itemCadastro; melhorScore = 1; return; }
      var todasItem = itemNorm.split(' ').filter(function(w){ return w.length > 2 || /^\d+$/.test(w); }); // FIX: mantém números curtos
      var palavrasItem = todasItem.filter(function(w){ return !temDigito(w); });
      var medidasItem = todasItem.filter(temDigito);
      var categoriaItem = palavrasItem[0] || ''; // FIX: categoria do item do catálogo
      // FIX B: palavras de NOME (produto) valem o peso principal — medida sozinha nunca decide o match
      var scoreNome = 0;
      if(palavrasAlvo.length && palavrasItem.length){
        var interNome = palavrasAlvo.filter(function(p){ return palavrasItem.indexOf(p) >= 0; }).length;
        scoreNome = interNome / Math.max(palavrasAlvo.length, palavrasItem.length);
      }
      var bonusMedida = 0;
      if(medidasAlvo.length && medidasItem.length){
        var interMedida = medidasAlvo.filter(function(p){ return medidasItem.indexOf(p) >= 0; }).length;
        if(interMedida > 0) bonusMedida = 0.15; // reforço pequeno, nunca decide sozinho
      }
      var score = Math.min(1, scoreNome + bonusMedida);
      // FIX: a regra de substring (um texto contido no outro) só vale se a categoria bater também —
      // senão "TUBO SOLDAVEL" casava com "ADAPTADOR TUBO SOLDAVEL..." só por conter a mesma frase,
      // mesmo sendo peças diferentes (adaptador não é tubo).
      if((itemNorm.indexOf(alvo) >= 0 || alvo.indexOf(itemNorm) >= 0) && categoriaAlvo === categoriaItem) score = Math.max(score, 0.8);
      // FIX: categoria diferente (LUVA vs JOELHO, TUBO vs ADAPTADOR...) derruba o score — mesmo
      // compartilhando muitas palavras de contexto, provavelmente são peças diferentes.
      if(categoriaAlvo && categoriaItem && categoriaAlvo !== categoriaItem) score = score * 0.15;
      if(score > melhorScore){ melhorScore = score; melhor = itemCadastro; }
    });
    return { match: melhor, score: melhorScore };
  };

  // Casamento via IA (Supabase Edge Function -> Anthropic) --------------------
  var casarComIA = function(linhasBrutas){
    // FIX 6: cadastro vazio - avisa sem gastar uma chamada de rede
    if(!cadastrosInsumos.length){
      setErro("Seu cadastro de insumos est\u00e1 vazio. Cadastre os insumos primeiro em CADASTROS antes de importar.");
      setProcessandoIA(false);
      return;
    }
    // FIX 4: planilha muito grande - avisa e não deixa prosseguir sem confirmação de custo maior
    if(linhasBrutas.length > 200){
      setErro("Esta planilha tem "+linhasBrutas.length+" itens. Por seguran\u00e7a, importa\u00e7\u00f5es com IA ficam limitadas a 200 itens por vez. Divida em partes menores ou use a compara\u00e7\u00e3o gr\u00e1tis.");
      setProcessandoIA(false);
      return;
    }
    // MEM\u00d3RIA: separa o que j\u00e1 foi ensinado do que realmente precisa da IA (economiza custo)
    var indicesParaIA = [];
    var linhasComMemoria = linhasBrutas.map(function(l, origIdx){
      var chave = String(l.descricaoRaw||'').trim().toUpperCase();
      var jaSabido = aprendizados[chave];
      if(!jaSabido) indicesParaIA.push(origIdx);
      return Object.assign({}, l, { _origIdx: origIdx, _daMemoria: !!jaSabido, _descMemoria: jaSabido||"" });
    });
    if(!indicesParaIA.length){
      // Tudo já estava na memória - não gasta IA nenhuma
      var resultadoMemoria = linhasComMemoria.map(function(l){
        return Object.assign({}, l, { descricaoFinal: l._descMemoria, status: "auto", scoreMatch: 1 });
      });
      setLinhas(resultadoMemoria);
      setResultadoOrigem('memoria');
      setProcessandoIA(false);
      return;
    }
    var linhasParaIA = indicesParaIA.map(function(origIdx){ return linhasBrutas[origIdx]; });
    var itensExcel = linhasParaIA.map(function(l){ return l.descricaoRaw; });
    var controladorTempo = new AbortController();
    var alarmeTempo = setTimeout(function(){ controladorTempo.abort(); }, 30000); // FIX: máx 30s de espera pela IA
    fetch(SUPABASE_URL+"/functions/v1/match-insumos-ia", {
      method: "POST",
      headers: { "apikey": SUPABASE_KEY, "Authorization": "Bearer " + SUPABASE_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ itensExcel: itensExcel, catalogoInsumos: cadastrosInsumos }),
      signal: controladorTempo.signal
    })
    .then(function(r){
      // FIX 5: função ainda não publicada no Supabase
      if(r.status === 404) throw new Error("A fun\u00e7\u00e3o de IA ainda n\u00e3o foi publicada no Supabase.");
      return r.json();
    })
    .then(function(data){
      clearTimeout(alarmeTempo); // FIX 3: desliga o cronômetro — resposta já chegou
      if(data.error) throw new Error(data.error.message||"Erro na IA");
      // FIX 2: resposta que não é JSON válido cai no catch abaixo (JSON já foi parseado no servidor,
      // mas se data.matches vier ausente/corrompido, tratamos aqui também)
      var matches = Array.isArray(data.matches) ? data.matches : [];
      var usage = data.usage || {};
      var inp = usage.input_tokens||0, out = usage.output_tokens||0;
      var custoBRL = ((inp*3+out*15)/1e6)*6;
      setCustoIA({ inp:inp, out:out, brl:custoBRL, itens:linhasParaIA.length });
      sbSaveIaUso({
        fornecedor:"", arquivo:"importar-excel-mapa",
        tokens_input:inp, tokens_output:out, custo_brl:custoBRL,
        itens_lidos:linhasParaIA.length, obra_id:""
      }).catch(function(e){
        // FIX: essa chamada só registra o custo/uso da IA para controle interno — uma falha aqui
        // NÃO afeta a importação do mapa em si (que já aconteceu normalmente). A mensagem antiga
        // ("não foi possível salvar o mapa importado") era enganosa e faria o usuário pensar, sem
        // motivo, que precisava reimportar tudo de novo. Loga no console para debug, sem alarmar
        // visualmente o usuário por algo que não afeta o resultado dele.
        console.error('MAPACOT: falha ao registrar uso de IA (importar-excel-mapa):', e && e.message || e);
      });
      var resultado = linhasComMemoria.map(function(l){
        if(l._daMemoria){
          return Object.assign({}, l, { descricaoFinal: l._descMemoria, status: "auto", scoreMatch: 1 });
        }
        var posicaoNaIA = indicesParaIA.indexOf(l._origIdx);
        var m = matches.find(function(x){ return Number(x.indicePlanilha) === posicaoNaIA; });
        // FIX 3: valida se o índice retornado pela IA realmente existe na lista do cadastro
        var indiceValido = m && m.indiceCadastro !== null && m.indiceCadastro !== undefined
          && m.indiceCadastro >= 0 && m.indiceCadastro < cadastrosInsumos.length;
        var confiancaIA = (m && m.confianca) || 0;
        // FIX 7: só aceita automaticamente se a própria IA estiver razoavelmente confiante (>=50%)
        var descFinal = (indiceValido && confiancaIA >= 0.5) ? cadastrosInsumos[m.indiceCadastro] : "";
        return Object.assign({}, l, {
          descricaoFinal: descFinal,
          status: descFinal ? "auto" : "manual",
          scoreMatch: confiancaIA
        });
      });
      setLinhas(resultado);
      setResultadoOrigem('ia');
      setProcessandoIA(false);
    })
    .catch(function(err){
      clearTimeout(alarmeTempo); // FIX 3: desliga o cronômetro — já caiu no erro/fallback
      // FIX 1: internet caiu / erro qualquer -> cai automaticamente para comparação grátis
      var resultadoFallback = linhasComMemoria.map(function(l){
        if(l._daMemoria){
          return Object.assign({}, l, { descricaoFinal: l._descMemoria, status: "auto", scoreMatch: 1 });
        }
        var resMatch = encontrarMelhorMatch(l.descricaoRaw, cadastrosInsumos);
        var status = resMatch.score >= 0.35 ? "auto" : "manual";
        return Object.assign({}, l, { descricaoFinal: status==="auto"?resMatch.match:"", status:status, scoreMatch:resMatch.score });
      });
      setLinhas(resultadoFallback);
      setResultadoOrigem('fallback');
      setErro("\u26A0\uFE0F N\u00e3o foi poss\u00edvel usar a IA agora ("+(err.message||"erro de conex\u00e3o")+"). Usamos a compara\u00e7\u00e3o gr\u00e1tis como alternativa.");
      setProcessandoIA(false);
    });
  };

  var handleArquivo = function(e){
    var file = e.target.files[0]; if(!file) return;
    setProcessando(true); setErro(""); setLinhas([]); setCustoIA(null); setResultadoOrigem(null);
    var reader = new FileReader();
    reader.onload = function(ev){
      try{
        var wb = XLSX.read(new Uint8Array(ev.target.result), { type:"array" });
        var sheet = wb.Sheets[wb.SheetNames[0]];
        var rows = XLSX.utils.sheet_to_json(sheet, { header:1, defval:"" });
        var linhasBrutas = [];
        for(var i=0; i<rows.length; i++){
          var r = rows[i];
          var descRaw = String((r[2]!==undefined && r[2]!==null) ? r[2] : "").trim();
          if(!descRaw) continue; // FIX: pula linha em branco (sem descrição = sem item)
          var qtRaw = String((r[0]!==undefined && r[0]!==null) ? r[0] : "0").replace(",", ".");
          var qt = parseFloat(qtRaw) || 0; // FIX: vírgula decimal tratada, texto inválido vira 0
          var unidBruto = (r[1]!==undefined && r[1]!==null) ? String(r[1]).trim() : "";
          var unidRaw = (unidBruto || "UN").toUpperCase(); // FIX: célula vazia também cai no padrão "UN"
          linhasBrutas.push({ linhaOriginal: i+1, qt: qt, unid: unidRaw, descricaoRaw: descRaw.toUpperCase() });
        }
        if(!linhasBrutas.length){ setErro("Nenhuma linha com descri\u00e7\u00e3o foi encontrada na planilha."); setProcessando(false); return; }
        setProcessando(false);
        if(modoEscolhido === "ia"){
          setProcessandoIA(true);
          casarComIA(linhasBrutas);
        } else {
          var resultado = linhasBrutas.map(function(l){
            var chave = String(l.descricaoRaw||'').trim().toUpperCase();
            var jaSabido = aprendizados[chave];
            if(jaSabido){
              return Object.assign({}, l, { descricaoFinal: jaSabido, status: "auto", scoreMatch: 1 });
            }
            var resMatch = encontrarMelhorMatch(l.descricaoRaw, cadastrosInsumos);
            var status = resMatch.score >= 0.35 ? "auto" : "manual"; // FIX: mesmo limite já aprovado no Orçamento
            return Object.assign({}, l, {
              descricaoFinal: status==="auto" ? resMatch.match : "",
              status: status,
              scoreMatch: resMatch.score
            });
          });
          setLinhas(resultado);
          setResultadoOrigem('local');
        }
      }catch(err){
        setErro("N\u00e3o foi poss\u00edvel ler o arquivo. Confira se \u00e9 uma planilha Excel v\u00e1lida (.xlsx). Detalhe: "+(err.message||""));
        setProcessando(false);
      }
    };
    reader.onerror = function(){ setErro("Erro ao abrir o arquivo."); setProcessando(false); };
    reader.readAsArrayBuffer(file);
  };

  var atualizarDescricaoManual = function(idx, valor){
    setLinhas(function(prev){
      var n = prev.slice();
      var achado = valor && cadastrosInsumos.find(function(x){ return x.toUpperCase()===valor.toUpperCase(); });
      n[idx] = Object.assign({}, n[idx], { descricaoFinal: achado || "" });
      return n;
    });
    setLinhasEditando(function(prev){ var n = Object.assign({}, prev); n[idx] = false; return n; });
    setTextoDigitado(function(prev){ var n = Object.assign({}, prev); n[idx] = ""; return n; });
  };

  var totalPendente = linhas.filter(function(l){ return !l.descricaoFinal; }).length;
  var totalResolvido = linhas.filter(function(l){ return l.descricaoFinal; }).length;
  var algumaLinhaEditando = Object.keys(linhasEditando).some(function(k){ return linhasEditando[k]; });
  // FIX: importação parcial permitida - basta ter ao menos 1 item resolvido
  var podeConfirmar = totalResolvido > 0 && !algumaLinhaEditando;

  var handleConfirmar = function(){
    if(!podeConfirmar) return;
    // Aviso extra se algum item ficará de fora, para não passar despercebido
    if(totalPendente > 0){
      var confirma = window.confirm(totalPendente+' item(ns) sem insumo reconhecido N\u00c3O ser\u00e3o importados agora.\nVoc\u00ea poder\u00e1 adicion\u00e1-los depois direto no mapa.\n\nDeseja continuar mesmo assim?');
      if(!confirma) return;
    }
    setEnviando(true);
    var resolvidos = linhas.filter(function(l){ return l.descricaoFinal; });
    // Alimenta a memória com tudo que foi resolvido nesta importação (não repete o que já veio de lá)
    resolvidos.forEach(function(l){
      if(!l._daMemoria) onAprendizadoSalvo(l.descricaoRaw, l.descricaoFinal);
    });
    var itensParaImportar = resolvidos.map(function(l){ return { qt:l.qt, unid:l.unid, descricaoFinal:l.descricaoFinal }; });
    onConfirmar(itensParaImportar);
  };

  var ovStyle = { position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.55)',zIndex:9500,display:'flex',alignItems:'center',justifyContent:'center' };
  var modalStyle = { background:'#fff',borderRadius:8,width:'min(720px,94vw)',maxHeight:'88vh',display:'flex',flexDirection:'column',overflow:'hidden' };

  return /*#__PURE__*/React.createElement('div', { style:ovStyle },
    /*#__PURE__*/React.createElement('div', { style:modalStyle },
      /*#__PURE__*/React.createElement('div', { style:{background:'#0e7a5f',color:'#fff',padding:'12px 16px',display:'flex',alignItems:'center',justifyContent:'space-between'} },
        /*#__PURE__*/React.createElement('span', { style:{fontSize:12,fontWeight:'bold'} }, '\uD83D\uDCE5 IMPORTAR EXCEL \u00B7 Quantidade, Unidade e Descri\u00e7\u00e3o'),
        /*#__PURE__*/React.createElement('span', { style:{cursor:'pointer',fontSize:16,opacity:.8}, onClick:onClose }, '\u2715')
      ),
      /*#__PURE__*/React.createElement('div', { style:{padding:14,overflowY:'auto',flex:1} },
        linhas.length === 0 && /*#__PURE__*/React.createElement('div', { style:{fontSize:11,color:'#555',lineHeight:1.6} },
          /*#__PURE__*/React.createElement('p', null, 'Selecione uma planilha Excel (.xlsx) com as colunas, ', /*#__PURE__*/React.createElement('strong',null,'sem cabe\u00e7alho'), ', come\u00e7ando na linha 1:'),
          /*#__PURE__*/React.createElement('p', null, /*#__PURE__*/React.createElement('strong',null,'Coluna A:'), ' Quantidade \u00B7 ', /*#__PURE__*/React.createElement('strong',null,'Coluna B:'), ' Unidade \u00B7 ', /*#__PURE__*/React.createElement('strong',null,'Coluna C:'), ' Descri\u00e7\u00e3o'),
          /*#__PURE__*/React.createElement('p', { style:{fontWeight:'bold',marginTop:12,marginBottom:6} }, 'Como casar as descri\u00e7\u00f5es com seu cadastro?'),
          /*#__PURE__*/React.createElement('div', {
            onClick: function(){ setModoEscolhido('local'); setLinhas([]); setErro(""); setCustoIA(null); setResultadoOrigem(null); },
            style:{border:'2px solid '+(modoEscolhido==='local'?'#0e7a5f':'#e0e0e0'),background:modoEscolhido==='local'?'#eafaf0':'#fff',borderRadius:6,padding:10,marginBottom:8,cursor:'pointer',display:'flex',gap:8,alignItems:'center'}
          },
            /*#__PURE__*/React.createElement('span',{style:{fontSize:18}},'\u26A1'),
            /*#__PURE__*/React.createElement('div',null,
              /*#__PURE__*/React.createElement('strong',{style:{display:'block',fontSize:11}},'Compara\u00e7\u00e3o autom\u00e1tica (gr\u00e1tis)'),
              /*#__PURE__*/React.createElement('span',{style:{fontSize:9,color:'#777'}},'Sem internet, sem custo, instant\u00e2neo')
            )
          ),
          /*#__PURE__*/React.createElement('div', {
            onClick: function(){ setModoEscolhido('ia'); setLinhas([]); setErro(""); setCustoIA(null); setResultadoOrigem(null); },
            style:{border:'2px solid '+(modoEscolhido==='ia'?'#0e7a5f':'#e0e0e0'),background:modoEscolhido==='ia'?'#eafaf0':'#fff',borderRadius:6,padding:10,marginBottom:8,cursor:'pointer',display:'flex',gap:8,alignItems:'center'}
          },
            /*#__PURE__*/React.createElement('span',{style:{fontSize:18}},'\uD83E\uDD16'),
            /*#__PURE__*/React.createElement('div',null,
              /*#__PURE__*/React.createElement('strong',{style:{display:'block',fontSize:11}},'Casar com Intelig\u00eancia Artificial'),
              /*#__PURE__*/React.createElement('span',{style:{fontSize:9,color:'#777'}},'Mais preciso em casos dif\u00edceis \u00B7 custo pequeno por uso \u00B7 at\u00e9 200 itens')
            )
          ),
          modoEscolhido && /*#__PURE__*/React.createElement('input', { type:'file', accept:'.xlsx,.xls', onChange:handleArquivo, disabled: processando||processandoIA, style:{marginTop:6, opacity:(processando||processandoIA)?0.5:1} }),
          processando && /*#__PURE__*/React.createElement('p', { style:{color:'#0e7a5f',marginTop:10} }, 'Lendo planilha...'),
          processandoIA && /*#__PURE__*/React.createElement('p', { style:{color:'#0e7a5f',marginTop:10} }, '\uD83E\uDD16 IA comparando os insumos... isso pode levar alguns segundos.'),
          erro && /*#__PURE__*/React.createElement('p', { style:{color:'#c0392b',marginTop:10,background:'#fdecea',padding:'8px 10px',borderRadius:4} }, erro)
        ),
        linhas.length > 0 && /*#__PURE__*/React.createElement('div', null,
          /*#__PURE__*/React.createElement('p', { style:{fontSize:11,color:'#333',marginBottom:10} },
            linhas.length + ' item(ns) lido(s) da planilha \u00B7 ' + (linhas.length-totalPendente) + ' reconhecido(s) automaticamente \u00B7 ' + totalPendente + ' precisam de confer\u00eancia'
          ),
          resultadoOrigem === 'ia' && custoIA && /*#__PURE__*/React.createElement('div', { style:{background:'#eafaf0',border:'1px solid #b8e0c8',borderRadius:6,padding:'8px 10px',fontSize:10,color:'#1a7a44',marginBottom:10,fontWeight:'bold'} },
            '\uD83E\uDD16 Resultado gerado pela Intelig\u00eancia Artificial \u00B7 Custo real cobrado: R$ '+custoIA.brl.toFixed(4).replace('.',',')+' \u00B7 '+custoIA.itens+' itens processados'
          ),
          resultadoOrigem === 'fallback' && /*#__PURE__*/React.createElement('div', { style:{background:'#fdecea',border:'1px solid #f5b8b8',borderRadius:6,padding:'8px 10px',fontSize:10,color:'#a32d2d',marginBottom:10,fontWeight:'bold'} },
            '\u26A0\uFE0F A IA FALHOU \u2014 este resultado veio da compara\u00e7\u00e3o gr\u00e1tis (sem custo, sem IA de verdade). Revise com aten\u00e7\u00e3o extra.',
            erro && /*#__PURE__*/React.createElement('div', { style:{fontSize:9,color:'#7a1f1f',marginTop:4,fontWeight:'normal'} }, 'Motivo t\u00e9cnico: '+erro)
          ),
          resultadoOrigem === 'local' && /*#__PURE__*/React.createElement('div', { style:{background:'#f0f0f0',border:'1px solid #ddd',borderRadius:6,padding:'8px 10px',fontSize:10,color:'#555',marginBottom:10,fontWeight:'bold'} },
            '\u26A1 Resultado gerado por compara\u00e7\u00e3o gr\u00e1tis (sem IA, sem custo)'
          ),
          resultadoOrigem === 'memoria' && /*#__PURE__*/React.createElement('div', { style:{background:'#eef0ff',border:'1px solid #c5cdf5',borderRadius:6,padding:'8px 10px',fontSize:10,color:'#3a3aa0',marginBottom:10,fontWeight:'bold'} },
            '\uD83E\uDDE0 Todos os itens j\u00e1 estavam na mem\u00f3ria do sistema \u2014 nenhum custo de IA foi gerado desta vez!'
          ),
          linhas.map(function(l, idx){
            var corFundo = l.descricaoFinal ? '#eafaf0' : '#fff8e6';
            var corBorda = l.descricaoFinal ? '#b8e0c8' : '#f0d080';
            return /*#__PURE__*/React.createElement('div', { key:idx, style:{background:corFundo,border:'1px solid '+corBorda,borderRadius:6,padding:'8px 10px',marginBottom:6} },
              /*#__PURE__*/React.createElement('div', { style:{fontSize:10,color:'#555',marginBottom:4} },
                'Linha '+l.linhaOriginal+' da planilha \u2014 Qt: '+l.qt+' \u00B7 Unid: '+l.unid+' \u00B7 Texto original: "'+l.descricaoRaw+'"'
              ),
              (l.descricaoFinal && !linhasEditando[idx])
                ? /*#__PURE__*/React.createElement('div', { style:{display:'flex',alignItems:'center',gap:8} },
                    /*#__PURE__*/React.createElement('div', { style:{fontSize:11,fontWeight:'bold',color:'#1a7a44',flex:1} }, '\u2705 '+l.descricaoFinal),
                    /*#__PURE__*/React.createElement('span', {
                      onClick: function(){ setLinhasEditando(function(prev){ var n=Object.assign({},prev); n[idx]=true; return n; }); setTextoDigitado(function(prev){ var n=Object.assign({},prev); n[idx]=l.descricaoFinal; return n; }); },
                      style:{fontSize:10,color:'#185FA5',cursor:'pointer',textDecoration:'underline',flexShrink:0}
                    }, '\u270F\uFE0F Trocar')
                  )
                : /*#__PURE__*/React.createElement(AutocompleteInput, {
                    value: textoDigitado[idx] || '',
                    onChange: function(v){ setTextoDigitado(function(prev){ var n=Object.assign({},prev); n[idx]=v; return n; }); },
                    onCommit: function(v){ atualizarDescricaoManual(idx, v); },
                    suggestions: cadastrosInsumos,
                    strictMatch: true,
                    placeholder: '\u26A0\uFE0F N\u00e3o reconhecido \u2014 selecione o insumo correto...',
                    inputStyle: { width:'100%',padding:'6px 8px',border:'1px solid #f0a500',borderRadius:4,fontSize:11 }
                  })
            );
          })
        )
      ),
      /*#__PURE__*/React.createElement('div', { style:{display:'flex',gap:8,padding:'12px 14px',borderTop:'1px solid #eee',justifyContent:'flex-end'} },
        /*#__PURE__*/React.createElement('button', { onClick:onClose, style:{background:'#f0f0f0',border:'none',padding:'8px 16px',borderRadius:4,fontSize:11,cursor:'pointer'} }, 'Cancelar'),
        linhas.length > 0 && /*#__PURE__*/React.createElement('button', {
          onClick: handleConfirmar,
          disabled: !podeConfirmar || enviando,
          style:{background: podeConfirmar ? '#0e7a5f' : '#bbb',color:'#fff',border:'none',padding:'8px 16px',borderRadius:4,fontSize:11,cursor: podeConfirmar ? 'pointer' : 'not-allowed',fontWeight:'bold'}
        }, enviando ? 'Importando...' : (totalPendente > 0 ? ('Confirmar Importa\u00e7\u00e3o ('+totalResolvido+' de '+linhas.length+')') : ('Confirmar Importa\u00e7\u00e3o ('+linhas.length+')')))
      )
    )
  );
}

// FIX: busca a cotação real do dólar para o custo estimado da IA ficar mais próximo do valor
// real cobrado. Guarda em cache (só busca 1x por sessão da página) e tem prazo curto (5s) com
// valor de reserva seguro (6,00) caso a busca falhe — nunca trava a tela por causa disso.
var cacheCotacaoDolarIA = null;
function buscarCotacaoDolarIA() {
  if (cacheCotacaoDolarIA !== null) return Promise.resolve(cacheCotacaoDolarIA);
  var COTACAO_RESERVA = 6.00;
  var controladorCotacao = new AbortController();
  var alarmeCotacao = setTimeout(function(){ controladorCotacao.abort(); }, 5000);
  return fetch("https://economia.awesomeapi.com.br/json/last/USD-BRL", { signal: controladorCotacao.signal })
    .then(function(r){
      clearTimeout(alarmeCotacao);
      if (!r.ok) throw new Error("cotação indisponível");
      return r.json();
    })
    .then(function(data){
      var valor = data && data.USDBRL && parseFloat(data.USDBRL.bid);
      var cotacaoFinal = (valor && !isNaN(valor) && valor > 0) ? valor : COTACAO_RESERVA;
      cacheCotacaoDolarIA = cotacaoFinal;
      return cotacaoFinal;
    })
    .catch(function(){
      clearTimeout(alarmeCotacao);
      cacheCotacaoDolarIA = COTACAO_RESERVA; // FIX: guarda a reserva no cache também, evita tentar de novo repetidamente na mesma sessão
      return COTACAO_RESERVA;
    });
}

function ModalLerComIA(_ref_ia) {
  var mapa=_ref_ia.mapa, itens=_ref_ia.itens, onClose=_ref_ia.onClose, onConfirm=_ref_ia.onConfirm, onIaUso=_ref_ia.onIaUso, onAprendizadoSalvo=_ref_ia.onAprendizadoSalvo||function(){};
  var aprendizados=_ref_ia.aprendizados||{};
  var CE=React.createElement;
  var _sStep=useState(1),step=_slicedToArray(_sStep,2)[0],setStep=_slicedToArray(_sStep,2)[1];
  var _sArq=useState(null),arquivo=_slicedToArray(_sArq,2)[0],setArquivo=_slicedToArray(_sArq,2)[1];
  var _sForn=useState(""),fornId=_slicedToArray(_sForn,2)[0],setFornId=_slicedToArray(_sForn,2)[1];
  var _sRes=useState(null),resultado=_slicedToArray(_sRes,2)[0],setResultado=_slicedToArray(_sRes,2)[1];
  var _sMatch=useState({}),matchs=_slicedToArray(_sMatch,2)[0],setMatchs=_slicedToArray(_sMatch,2)[1];
  var _sErro=useState(""),erro=_slicedToArray(_sErro,2)[0],setErro=_slicedToArray(_sErro,2)[1];
  var _sCusto=useState(null),custo=_slicedToArray(_sCusto,2)[0],setCusto=_slicedToArray(_sCusto,2)[1];
  var _sMsg=useState("Preparando..."),msg=_slicedToArray(_sMsg,2)[0],setMsg=_slicedToArray(_sMsg,2)[1];
  var _sB3=useState(""),busca3=_slicedToArray(_sB3,2)[0],setBusca3=_slicedToArray(_sB3,2)[1];
  var _sFiltro=useState("todos"),filtroTipo=_slicedToArray(_sFiltro,2)[0],setFiltroTipo=_slicedToArray(_sFiltro,2)[1];
  var _sMD=useState({}),matchDesc=_slicedToArray(_sMD,2)[0],setMatchDesc=_slicedToArray(_sMD,2)[1];
  var _sSA=useState(null),seletorAberto=_slicedToArray(_sSA,2)[0],setSeletorAberto=_slicedToArray(_sSA,2)[1];
  var _sSB=useState(""),seletorBusca=_slicedToArray(_sSB,2)[0],setSeletorBusca=_slicedToArray(_sSB,2)[1];
  var getItemDesc=function(id){ var f=(itens||[]).find(function(m){return m.id===id;}); return f?(f.descricao||""):""; };
  var forns=mapa.fornecedores||[];
  // FIX: (1) a versão anterior removia letras acentuadas (Ç,Ã,Õ etc.) transformando-as em ESPAÇO,
  // o que quebrava palavras portuguesas ao meio (ex: "AÇO" virava "A O", "TUBULAÇÃO" virava "TUBULA
  // O") — perdendo a palavra inteira no casamento, já que fragmentos de 1 letra são descartados.
  // Agora converte o acento para sua forma sem acento (Ç->C, Ã->A) via normalize('NFD'), preservando
  // a palavra inteira. (2) usa String(s||"") em vez de (s||"") para nunca quebrar com erro fatal caso
  // a descrição venha como número/objeto (ex: dado corrompido ou resposta malformada da IA).
  var normalizar=function(s){
    var t = String(s||"").toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
    t = t.replace(/[^A-Z0-9\s]/g," ").replace(/\s+/g," ").trim();
    // FIX: encontrado através de relato real do usuário — "orçamento de 15 itens, a IA só
    // reconhece 2 a 5". Causa raiz: a proteção contra confundir medidas diferentes (ex: 100MM
    // vs 50MM) era ATIVADA MESMO quando a medida era A MESMA, só escrita de forma diferente —
    // muito comum comparando um cadastro manual do mapa com texto extraído de PDF de fornecedor.
    // "GRAUS"/"GRAU" por extenso vira sufixo "G" colado (ex: "90 GRAUS" e "90G" ficam idênticos).
    t = t.replace(/(\d+)\s+GRAUS?\b/g, '$1G');
    // Número e unidade separados por espaço viram a forma colada, que é como cadastros manuais
    // tipicamente escrevem (ex: "100 MM" e "100MM" ficam idênticos após normalizar). Sem isso,
    // a mesma medida escrita com espaço (comum em texto extraído de PDF) e sem espaço (comum em
    // cadastro manual) eram tratadas como números DIFERENTES pela lógica de bloqueio de "número
    // sem par", rejeitando o match mesmo sendo exatamente a mesma peça.
    t = t.replace(/(\d+)\s+(MM|CM|M2|M3|KG|ML|L|UN|PC|CJ|MT|M|A|V|W)\b/g, '$1$2');
    return t;
  };
  var wordScore=function(a,b){
    var EXCECOES_PALAVRA_CURTA = {"TE":1}; // FIX: "TÊ" (peça de tubulação em T) tem só 2 letras e
    // era descartado pelo filtro de tamanho mínimo — igual ao caso dos números curtos de ângulo já
    // tratado abaixo, mas para nomes de peça. Lista pequena e específica, não abre o filtro geral
    // (que continuaria deixando passar preposições como "DE"/"DO"/"DA" se apenas baixássemos o
    // limite de tamanho para todas as palavras).
    var wa=normalizar(a).split(" ").filter(function(w){return w.length>2 || /^\d+$/.test(w) || EXCECOES_PALAVRA_CURTA[w];}); // FIX: mantém números curtos (ex: "45","90" de ângulo) que antes eram descartados por serem <=2 caracteres
    var wb=normalizar(b).split(" ").filter(function(w){return w.length>2 || /^\d+$/.test(w) || EXCECOES_PALAVRA_CURTA[w];});
    if(!wa.length||!wb.length)return 0;
    // FIX: identifica a CATEGORIA do produto (LUVA, JOELHO, CURVA, TUBO, TÊ, CAP, ADAPTADOR...) —
    // a primeira palavra que não é um código numérico isolado (pula "229272", "4010" no início).
    // Essa palavra define O QUE a peça É, e pesa muito mais que atributos secundários (material,
    // marca, medida). Sem isso, "LUVA 25MM SOLDAVEL MULTILIT" e "JOELHO 25MM SOLDAVEL MULTILIT"
    // batiam quase igual (só a palavra central diferia), causando casamento errado.
    var pegarCategoria=function(palavras){
      for(var pi=0;pi<palavras.length;pi++){ if(!/^\d+$/.test(palavras[pi])) return palavras[pi]; }
      return palavras[0]||"";
    };
    var categoriaA=pegarCategoria(wa), categoriaB=pegarCategoria(wb);
    // FIX: tokens com dígito (medidas, códigos, gramaturas — ex: "100MM", "CP2", "4KG") costumam
    // ser o que diferencia produtos da MESMA família mas de especificação DIFERENTE (ex: "TUBO PVC
    // 100MM" vs "TUBO PVC 50MM", "CIMENTO CP2" vs "CIMENTO CP4"). Se AMBAS as descrições têm algum
    // token numérico que NÃO tem correspondente exato na outra, isso indica uma SUBSTITUIÇÃO de
    // especificação (não apenas informação a mais) — bloqueia o casamento (score=0) mesmo que as
    // demais palavras coincidam. Só bloqueia quando os DOIS lados têm token sem par (não quando um
    // lado só tem uma medida A MAIS que o outro não menciona, o que ainda pode ser o mesmo item).
    var numRe=/\d/;
    var numsA=wa.filter(function(w){return numRe.test(w);});
    var numsB=wb.filter(function(w){return numRe.test(w);});
    var numsASemPar=numsA.filter(function(w){return numsB.indexOf(w)<0;});
    var numsBSemPar=numsB.filter(function(w){return numsA.indexOf(w)<0;});
    if(numsASemPar.length && numsBSemPar.length) return 0;
    var m=wa.filter(function(w){return wb.indexOf(w)>=0;}).length;
    var score=m/Math.max(wa.length,wb.length);
    if(categoriaA!==categoriaB) score=score*0.15; // FIX: categoria diferente = provavelmente peça diferente, mesmo com o resto parecido
    return score;
  };
  var fazerMatchs=function(orcItens){
    var result={};
    orcItens.forEach(function(oi,idx){
      if(!oi) return; // FIX: protege contra item null/malformado (ex: resposta inesperada da IA)
      // FIX: consulta a mem\u00f3ria primeiro - se esse texto j\u00e1 foi ensinado, acha o item do mapa com essa descri\u00e7\u00e3o exata
      var chave = String(oi.descricao||'').trim().toUpperCase();
      var descConhecida = aprendizados[chave];
      if (descConhecida) {
        var itemConhecido = itens.find(function(mi){ return mi.descricao === descConhecida; });
        if (itemConhecido) { result[idx] = itemConhecido.id; return; }
      }
      var best=0,bestId="";
      itens.forEach(function(mi){var sc=wordScore(oi.descricao,mi.descricao);if(sc>best){best=sc;bestId=mi.id;}});
      result[idx]=best>=0.35?bestId:"";
    });
    return result;
  };
  var _sModoLer=useState(''),modoLer=_slicedToArray(_sModoLer,2)[0],setModoLer=_slicedToArray(_sModoLer,2)[1];
  var parsearPDFTextoLerIA = function(textosOriginaisEntrada) {
    // FIX: alguns fornecedores (ex: Mexichem) colam o prefixo "R$" junto com o número no MESMO token
    // (ex: "R$ 86,75"), ao invés de "R$" e o número virem em tokens separados. Outros (ex: Gerdau)
    // colam um SUFIXO de unidade/moeda no final (ex: "6,000 RL", "1.666,80 BRL/RL", "10.000,81 BRL").
    // Normaliza ambos ANTES de qualquer lógica — assim toda a lógica existente (já testada e aprovada
    // com outros fornecedores) funciona sem precisar de mudança.
    var textos = textosOriginaisEntrada.map(function(tok){
      var t = (tok||"");
      var mPrefixo = t.match(/^R\$\s*([\d.,]+)$/);
      if (mPrefixo) return mPrefixo[1];
      var mSufixo = t.match(/^([\d.,]+)\s*(RL|KG|BRL\/RL|BRL|UN|PC|MT|M2|M3)$/);
      if (mSufixo) return mSufixo[1];
      return t;
    });
    var NUM=/^([\d]{1,3}(?:\.[\d]{3})*,[\d]{2,5}|[\d]{4,},[\d]{2,5}|,[\d]{2,5})$/; // aceita também 4+ dígitos sem ponto de milhar (ex: "2300,00"), valores sem zero antes da vírgula (ex: ",87" = R$0,87), e até 5 casas decimais (ex: "26,00000")
    var ehCabLerIA=function(s){
      var st=s.trim();
      if(/^(ITEM|C[O\u00D3]D\.?|AMAR|QTDE?\.?|QT\.?|UN\.?|UNID\.?|UNIT[A\u00C1]RIO|UNITARIO|TOTAL|DESCRI[C\u00C7][A\u00C3]O|DESCR\.?|VALOR|VLR\.?|PRE[C\u00C7]O|FRETE|IMPOSTO|SUB[\s-]?TOTAL|PESO|OBS[\.:]?|OBSERV|BANCO|CONTA|PIX|CNPJ|CPF|CEP|TELEFONE|FONE|E-?MAIL|CONTATO|ESTADO|CIDADE|ENDERE|BAIRRO|VENC|PRAZO|VALIDADE|CONDI|REPRESENT|VENDEDOR|CLIENTE|TIPO|FORMA|SITUA|NF|NOTA|DATA|PEDIDO|OR[C\u00C7]AMENTO|MARCA|SEQ\.?|REF\.?)$/i.test(st)) return true;
      if(/DESCRI[C\u00C7][A\u00C3]O DO PRODUTO|TOTAL (ACRESCIMO|DESCONTO|L[I\u00CD]QUIDO|GERAL|BRUTO)|VALOR (UNIT|TOTAL)|C[O\u00D3]DIGO PRODUTO/i.test(st)) return true;
      if(/^C[\u00F3o]d\.?\s*Barras/i.test(st)) return true; // FIX: rejeita "Cód. Barras: XXXXX" como não-descrição (formato Agroboi)
      if(/^C[\u00F3o]d\.?\s*Ref/i.test(st)) return true; // FIX: rejeita "Cód. Ref: XXXXX" como não-descrição (formato Cimec DAV)
      if(/^(TOTAL|VALOR|VENDEDOR|CLIENTE|ENDERE[C\u00C7]O)[\s:]/i.test(st)) return true;
      if(/^(PESO (BRUTO|L[I\u00CD]QUIDO)|QTD\.? TOTAL|QUANTIDADE TOTAL)[\s:]/i.test(st)) return true;
      if(/^VL\.?\s*UNIT/i.test(st)) return true; // FIX: "VL. UNIT" como cabeçalho de coluna abreviado
      if(/^Sub[\s-]?[Tt]otal\s*:/i.test(st)) return true; // FIX: "Subtotal:" com dois pontos, não bate na exclusão de palavra isolada
      if(/^PRE[C\u00C7]O\s*FINAL$/i.test(st)) return true; // FIX: "Preço Final" como cabeçalho de coluna (formato Mexichem)
      if(/^Prazo\s*de\s*Pagamento\s*:/i.test(st)) return true; // FIX: "Prazo de Pagamento:" não é produto (formato Gerdau)
      if(/^\d+\s*\/\s*\d+\s*\/\s*\d+\s*dias/i.test(st) || /trademaster/i.test(st)) return true; // FIX: condição de pagamento tipo "30/60/90 dias" ou representante Trademaster, não é produto
      if(/^N[U\u00DA]MERO\s*DE\s*ITENS\s*:/i.test(st)) return true; // FIX: "Número de Itens:" do rodapé, não é produto
      if(/^Fone\s*Vendedor\s*:/i.test(st)) return true; // FIX: "Fone Vendedor:" do rodapé, não é produto
      if(/^CE-/i.test(st)) return true; // FIX: cabeçalho de seção (local de retirada), não é produto
      return false;
    };
    var UNIDADE_RE_PREFIXO = /^(UN|UND|PC|PÇ|KG|MT|M|CX|L|LT|PCT|CJ)$/i;
    var pareceDescricaoValida = function(texto){
      var tx = (texto||"").trim();
      var txComecaComLetra=/^[A-Z\u00C0-\u00D6\u00D8-\u00DE]/.test(tx);
      var txComecaComCodigoHifen=/^\d+\s*-\s*[A-Za-z\u00C0-\u00FF]/.test(tx);
      var txComecaComNumeroEspaco=/^\d+\s+[A-Za-z\u00C0-\u00DE]/.test(tx) && !UNIDADE_RE_PREFIXO.test((tx.split(/\s+/)[1]||""));
      return tx.length>7&&(txComecaComLetra||txComecaComCodigoHifen||txComecaComNumeroEspaco)&&/[a-zA-Z\u00C0-\u00FF]{2,}/.test(tx)&&/\s/.test(tx)&&!ehCabLerIA(tx)&&!/^\d+$/.test(tx)&&!/^[\d\.\,\-\/\s]+$/.test(tx);
    };
    var items=[];
    for (var i=0;i<textos.length;i++) {
      var t=(textos[i]||"").trim();
      var comecaComLetra=/^[A-Z\u00C0-\u00D6\u00D8-\u00DE]/.test(t);
      var comecaComCodigoHifen=/^\d+\s*-\s*[A-Za-z\u00C0-\u00FF]/.test(t); // FIX: aceita formato "CÓDIGO - TEXTO" (ex: Agroboi)
      // FIX: aceita também descrições que começam com número SEM hífen (ex: "3 INT SIMPLES C/PL MIL."
      // - o "3" é parte do nome do produto, tipo "3 vias"). Protegido contra confundir com uma
      // abreviação de unidade solta (ex: "5 UN"), exigindo que a segunda palavra não seja uma unidade.
      var comecaComNumeroEspaco = /^\d+\s+[A-Za-z\u00C0-\u00DE]/.test(t) && !UNIDADE_RE_PREFIXO.test((t.split(/\s+/)[1]||""));
      var proxEhSiglaUFIa = i+1<textos.length && /^-\s*[A-Z]{2}\s*$/.test((textos[i+1]||"").trim());
      var ehSoOrcamentoNumeroIa = /^OR[\u00c7C]AMENTO\s*N[\u00ba\u00b0o]?\.?\s*$/i.test(t);
      var ehDesc=!proxEhSiglaUFIa&&!ehSoOrcamentoNumeroIa&&t.length>7&&(comecaComLetra||comecaComCodigoHifen||comecaComNumeroEspaco)&&/[a-zA-Z\u00C0-\u00FF]{2,}/.test(t)&&/\s/.test(t)&&!ehCabLerIA(t)&&!/^\d+$/.test(t)&&!/^[\d\.\,\-\/\s]+$/.test(t);
      if (!ehDesc) continue;

      // FIX: se o token seguinte for um CÓDIGO puro (número sem vírgula) e o token DEPOIS DELE também
      // for uma descrição válida, o candidato atual era só o nome da MARCA (ex: "TIGRE PINCEIS"),
      // não uma descrição de produto real — a descrição de verdade vem depois do código. Pula.
      if (i+2 < textos.length && /^\d+$/.test((textos[i+1]||"").trim()) && pareceDescricaoValida(textos[i+2])) continue;

      // FIX: a descrição pode vir quebrada em 2 tokens pelo PDF, tanto no formato "CÓDIGO - TEXTO"
      // (ex: Agroboi) quanto em descrições comuns muito longas que continuam na linha seguinte
      // (ex: Costa: "GARFO DE PINTURA GAIOLA S/ ROSCA AÇO" + "23CM"). Concatena com o próximo token
      // se ele parecer continuação (curto, sem número solto, sem ser outro item), e ajusta o índice
      // de busca de números para começar DEPOIS da descrição completa (não só do 1º token).
      var descCompleta = t;
      var indiceBase = i;
      if (i+1 < textos.length && !/^CE-/i.test(t)) {
        var proxTok = (textos[i+1]||"").trim();
        var proxEhContinuacao = proxTok.length>2 && proxTok.length<=25 && !/^C[\u00F3o]d\.?\s*Barras/i.test(proxTok) && !NUM.test(proxTok) && !ehCabLerIA(proxTok) && !/^\d+$/.test(proxTok) && /[A-Za-z\u00C0-\u00FF]/.test(proxTok) && !/^\d+\s*-\s*[A-Za-z\u00C0-\u00FF]/.test(proxTok);
        if (proxEhContinuacao) { descCompleta = t + ' ' + proxTok; indiceBase = i+1; }
      }

      // FIX: se a descrição COMPLETA (já concatenada) for uma SUBSTRING de uma descrição já aceita
      // na linha imediatamente anterior, é uma referência de produto repetindo parte do texto (ex:
      // "PA FL PH AA PB" depois de "PA FL PH AA PB 4,2X19"), não uma nova descrição — pula. Mas só
      // quando for MENOR e DIFERENTE da anterior (uma referência parcial), nunca quando for IDÊNTICA
      // (que é um item duplicado legítimo, ex: o mesmo produto pedido 2 vezes no mesmo orçamento).
      if (i>0 && items.length>0) {
        var ultimaDescAceita = items[items.length-1].descricao;
        var descCompletaMaiuscula = descCompleta.toUpperCase();
        if (descCompletaMaiuscula !== ultimaDescAceita && descCompletaMaiuscula.length < ultimaDescAceita.length && ultimaDescAceita.indexOf(descCompletaMaiuscula) >= 0) continue;
      }

      // FIX: função auxiliar que verifica se um token parece ser o INÍCIO de outro item (para não
      // deixar a busca de números "vazar" para dentro do item vizinho, ex: pegar o total do item anterior)
      var pareceOutroItem = function(tok){
        var tk = (tok||"").trim();
        if (tk.length<=7) return false;
        // FIX: nomes de marca compostos (ex: "UNIAO MUNDIAL", "OTTO BAUMGART") têm só 2 palavras e
        // podem passar nos outros critérios por acidente — descrições de produto reais quase sempre
        // têm 3+ palavras. Essa exigência evita confundir marca solta com início de outro item.
        if (tk.split(/\s+/).length<3) return false;
        var tkComecaComLetra=/^[A-Z\u00C0-\u00D6\u00D8-\u00DE]/.test(tk);
        var tkComecaComCodigo=/^\d+\s*-\s*[A-Za-z\u00C0-\u00FF]/.test(tk);
        var tkComecaComNumeroEspaco=/^\d+\s+[A-Za-z\u00C0-\u00DE]/.test(tk) && !UNIDADE_RE_PREFIXO.test((tk.split(/\s+/)[1]||""));
        return (tkComecaComLetra||tkComecaComCodigo||tkComecaComNumeroEspaco) && /[a-zA-Z\u00C0-\u00FF]{3,}/.test(tk) && /\s/.test(tk) && !ehCabLerIA(tk);
      };
      // Limita a busca até o próximo/anterior token que pareça ser outro item (evita vazamento entre itens vizinhos)
      var limiteFrente = textos.length;
      var ehTerminadorDeSecao = function(tok){ return /^(Sub[\s-]?[Tt]otal\s*:|TOTAL\s*:)/i.test((tok||"").trim()); };
      for (var lf=indiceBase+1; lf<textos.length; lf++) { if (pareceOutroItem(textos[lf]) || ehTerminadorDeSecao(textos[lf])) { limiteFrente=lf; break; } }
      // FIX: em formatos onde os números vêm ANTES da descrição (ex: Rêmolo Jarude, Costa & Monteiro),
      // um número inteiro puro (sem vírgula) logo depois da descrição atual é sempre um CÓDIGO de
      // produto ou SEQUÊNCIA do próximo item (nunca um valor monetário real, que sempre tem vírgula
      // nesse tipo de documento). Se encontrado, usa esse ponto como limite (mais restritivo),
      // evitando pegar números do item seguinte.
      for (var lfSeq=indiceBase+1; lfSeq<limiteFrente; lfSeq++) {
        var tkSeq = (textos[lfSeq]||"").trim();
        if (/^\d+$/.test(tkSeq)) { limiteFrente = Math.min(limiteFrente, lfSeq); break; }
      }
      var limiteTras = -1;
      if (comecaComCodigoHifen) {
        // FIX: no formato "CÓDIGO - TEXTO" (Agroboi), os números do item vêm SEMPRE depois da descrição,
        // nunca antes. Por isso, o limite "para trás" é o início do PRÓPRIO item, não o item anterior
        // (senão a busca pega os números do item anterior, que ficam mais próximos que os do item atual).
        limiteTras = i - 1;
      } else {
        for (var lt=i-1; lt>=0; lt--) {
          if (pareceOutroItem(textos[lt])) {
            // FIX: se o "outro item" detectado está bem colado (1 posição antes) da descrição atual
            // E não tem nenhum dígito, é muito provável que seja o nome da MARCA do produto (ex:
            // "TIGRE / AMANCO"), não um item anterior de verdade — descrições de produto real quase
            // sempre têm alguma medida/código numérico, marcas raramente têm dígitos.
            if (lt === i-1 && !/\d/.test(textos[lt])) continue;
            limiteTras=lt; break;
          }
        }
      }

      // FIX (nova estratégia): em vez de "adivinhar pela posição", coleta os números próximos (em ambas
      // direções, mas sem ultrapassar os limites de item vizinho acima) e testa qual TRINCA
      // (quantidade, unitário, total) bate matematicamente (qtd × unit ≈ total).
      // Guarda também a POSIÇÃO de origem de cada número, para poder desambiguar qtd vs unit quando
      // ambas as combinações batem matematicamente (ex: 20×115=2300 e 115×20=2300 batem igual).
      // FIX: coleta também o texto ORIGINAL de cada número (não só o valor numérico), para poder
      // detectar o formato de casas decimais (quantidade tem 3 casas: "1,000"; preço tem 2: "36,97")
      // FIX: busca primeiro SÓ "pra frente" (o padrão mais comum: números vêm depois da descrição).
      // Se isso já encontrar 3+ números válidos, usa SOMENTE esses — não mistura com "pra trás",
      // porque isso vazaria números do item ANTERIOR (que ficam entre a descrição anterior e a atual).
      // Só busca "pra trás" como complemento se a busca "pra frente" sozinha não for suficiente
      // (formato onde os números vêm antes da descrição, ex: Rêmolo Jarude).
      var numerosFrente=[], posicoesFrente=[], textosFrente=[];
      for (var distF=1; distF<=9 && numerosFrente.length<8; distF++) {
        var jDf=indiceBase+distF;
        if (jDf<limiteFrente) { var tjDf=(textos[jDf]||"").trim(); if(NUM.test(tjDf)) { numerosFrente.push(parseFloat(tjDf.replace(/\./g,"").replace(",","."))); posicoesFrente.push(jDf); textosFrente.push(tjDf); } }
      }
      var numeros=[], posicoes=[], textosOriginais=[];
      // FIX: não basta ter 3+ números "pra frente" — preciso confirmar que ALGUMA combinação deles
      // realmente forma uma trinca válida (qtd×unit≈total). Sem essa checagem, um item no FINAL da
      // lista pode capturar por engano o "Total Líquido" do orçamento inteiro como se fosse seu
      // próprio total, e isso conta como um 3º número "válido" sem realmente ser do item.
      var temTrincaValidaFrente = false;
      for (var xt=0; xt<numerosFrente.length && !temTrincaValidaFrente; xt++) {
        for (var yt=0; yt<numerosFrente.length && !temTrincaValidaFrente; yt++) {
          if (xt===yt) continue;
          for (var zt=0; zt<numerosFrente.length && !temTrincaValidaFrente; zt++) {
            if (zt===xt||zt===yt) continue;
            var qtdT=numerosFrente[xt], unitT=numerosFrente[yt], totalT=numerosFrente[zt];
            if (qtdT>=1 && unitT>0 && Math.abs(qtdT*unitT-totalT)/Math.max(totalT,1)<0.015) temTrincaValidaFrente = true;
          }
        }
      }
      if (numerosFrente.length>=3 && temTrincaValidaFrente) {
        numeros = numerosFrente; posicoes = posicoesFrente; textosOriginais = textosFrente;
      } else {
        for (var dist=1; dist<=9 && numeros.length<8; dist++) {
          var jD=indiceBase+dist, jA=indiceBase-dist;
          if (jD<limiteFrente) { var tjD=(textos[jD]||"").trim(); if(NUM.test(tjD)) { numeros.push(parseFloat(tjD.replace(/\./g,"").replace(",","."))); posicoes.push(jD); textosOriginais.push(tjD); } }
          if (jA>limiteTras) { var tjA=(textos[jA]||"").trim(); if(NUM.test(tjA)) { numeros.push(parseFloat(tjA.replace(/\./g,"").replace(",","."))); posicoes.push(jA); textosOriginais.push(tjA); } }
        }
      }
      if (numeros.length<3) continue;

      var UNIDADE_RE = /^(UN|UND|PC|PÇ|KG|MT|M|CX|L|LT|PCT|CJ)$/i;
      var FORMATO_QTD_RE = /,\d{3}$|,\d{5}$/; // ex: "1,000", "15,000" (3 casas) ou "26,00000" (5 casas) — sempre quantidade nesses padrões
      var unitValidado=null, qtdValidada=null, melhorDiferenca=Infinity, melhorBonus=-1, melhorPrioridade=-1;
      for (var xi=0; xi<numeros.length; xi++) {
        for (var yi=0; yi<numeros.length; yi++) {
          if (xi===yi) continue;
          for (var zi=0; zi<numeros.length; zi++) {
            if (zi===xi||zi===yi) continue;
            var qtd=numeros[xi], unit=numeros[yi], total=numeros[zi];
            if (qtd>=1 && unit>0) {
              var diferenca=Math.abs(qtd*unit-total)/Math.max(total,1);
              if (diferenca<0.015) { // FIX: tolerância aumentada de 1% para 1,5% para cobrir arredondamento real de alguns documentos (ex: Acreferro)
                // FIX: prioridade 2 (máxima) quando o candidato a quantidade TEM o formato de 3 casas
                // decimais (pista mais confiável que existe); prioridade 1 quando qtd>1 (heurística
                // antiga, evita ambiguidade); prioridade 0 (fallback) quando só bate com qtd=1 "seco".
                var prioridade = FORMATO_QTD_RE.test(textosOriginais[xi]) ? 2 : (qtd>1 ? 1 : 0);
                var proxTokenDaQtd = (textos[posicoes[xi]+1]||"").trim();
                var bonus = UNIDADE_RE.test(proxTokenDaQtd) ? 1 : 0;
                if (prioridade>melhorPrioridade || (prioridade===melhorPrioridade && (diferenca<melhorDiferenca || (diferenca===melhorDiferenca && bonus>melhorBonus)))) {
                  melhorDiferenca=diferenca; melhorBonus=bonus; melhorPrioridade=prioridade; unitValidado=unit; qtdValidada=qtd;
                }
              }
            }
          }
        }
      }
      // FIX: quando nenhuma trinca simples bate (qtd x unit = total), tenta uma QUADRA com desconto:
      // qtd x unit - desconto = total. Cobre documentos onde o total ja vem liquido de um desconto em
      // R$ (nao percentual), o que faz a trinca simples ultrapassar a margem de erro (ex: Cimec DAV).
      if (unitValidado===null && numeros.length>=4) {
        var melhorDifQuadra = Infinity;
        for (var xi2=0; xi2<numeros.length; xi2++) {
          for (var yi2=0; yi2<numeros.length; yi2++) {
            if (yi2===xi2) continue;
            for (var zi2=0; zi2<numeros.length; zi2++) {
              if (zi2===xi2||zi2===yi2) continue;
              for (var wi2=0; wi2<numeros.length; wi2++) {
                if (wi2===xi2||wi2===yi2||wi2===zi2) continue;
                var qtd2=numeros[xi2], unit2=numeros[yi2], desconto2=numeros[zi2], total2=numeros[wi2];
                if (qtd2>=1 && unit2>0 && total2>0 && desconto2>=0 && desconto2<(qtd2*unit2)) { // FIX: rejeita combinações onde o "desconto" seria maior que o valor bruto (fisicamente impossível)
                  var difQuadra=Math.abs(qtd2*unit2-desconto2-total2)/Math.max(total2,1);
                  if (difQuadra<0.015) {
                    var proxTokenDaQtd2 = (textos[posicoes[xi2]+1]||"").trim();
                    var bonusQuadra = UNIDADE_RE.test(proxTokenDaQtd2) ? 1 : 0;
                    var scoreQuadra = difQuadra - (bonusQuadra*0.02);
                    if (scoreQuadra<melhorDifQuadra) {
                      melhorDifQuadra=scoreQuadra; unitValidado=unit2; qtdValidada=qtd2;
                    }
                  }
                }
              }
            }
          }
        }
      }
      if (unitValidado!==null && unitValidado>0) {
        items.push({descricao:descCompleta.toUpperCase(), preco:unitValidado, qtd:qtdValidada});
      }
    }

    // FIX: fallback para formato onde os NÚMEROS de cada item (qtd, unitário) ficam numa seção
    // completamente separada das DESCRIÇÕES (ex: Holanda Holanda e Torres) — a ordem de extração
    // do PDF não corresponde à ordem lógica da tabela. Só ativa se a lógica principal não encontrou
    // nada. Estratégia: cada descrição tem seu próprio TOTAL logo depois dela (seguido de "R$"); usa
    // esse total para encontrar, entre os grupos de números [qtd, unit, "R$"] espalhados no documento,
    // qual combinação bate matematicamente (qtd × unit ≈ total). Isso correlaciona pelo VALOR, não
    // pela posição, resolvendo a ordem embaralhada.
    if (items.length === 0) {
      var gruposNumericos = [];
      for (var gi=0; gi<textos.length-2; gi++) {
        var possQtd = (textos[gi]||"").trim();
        var possUnit = (textos[gi+1]||"").trim();
        var possRS = (textos[gi+2]||"").trim();
        if (/^\d+$/.test(possQtd) && NUM.test(possUnit) && possRS === "R$") {
          var qtdNum = parseFloat(possQtd);
          var unitNum = parseFloat(possUnit.replace(/\./g,"").replace(",","."));
          if (qtdNum>=1 && unitNum>0) gruposNumericos.push({qtd:qtdNum, unit:unitNum});
        }
      }
      if (gruposNumericos.length>0) {
        for (var di=0; di<textos.length-2; di++) {
          var possDesc = (textos[di]||"").trim();
          if (pareceDescricaoValida(possDesc)) {
            var possTotal = (textos[di+1]||"").trim();
            var possRS2 = (textos[di+2]||"").trim();
            if (NUM.test(possTotal) && possRS2==="R$") {
              var totalNum = parseFloat(possTotal.replace(/\./g,"").replace(",","."));
              var melhorGrupo = null, melhorDif = 0.01;
              gruposNumericos.forEach(function(g){
                var dif = Math.abs(g.qtd*g.unit-totalNum)/Math.max(totalNum,1);
                if (dif<melhorDif) { melhorDif=dif; melhorGrupo=g; }
              });
              if (melhorGrupo) items.push({descricao:possDesc.toUpperCase(), preco:melhorGrupo.unit, qtd:melhorGrupo.qtd});
            }
          }
        }
      }
    }

    // FIX: fallback para formato onde a descrição vem fragmentada PALAVRA POR PALAVRA entre um
    // CÓDIGO (formato "11.795", com ponto) e um marcador de UNIDADE (ex: "UN"), ao invés de vir como
    // frase inteira (ex: Multilit). Estratégia: detecta o código, junta todas as palavras soltas até
    // encontrar a unidade, forma a descrição, e captura [quantidade] "R$" [preço unitário] logo depois.
    if (items.length === 0) {
      var CODIGO_COM_PONTO = /^(\d{1,3}\.\d{3,}|\d{5,7})$/; // aceita "11.795" (com ponto) ou "002050" (6 dígitos, sem ponto)
      var UNIDADE_EXATA = /^(UN|UND|PC|PÇ|KG|MT|M|CX|L|LT|PCT|CJ)$/i;
      // FIX: esse fornecedor às vezes usa PONTO como separador decimal por engano (ex: "4.23" em vez
      // de "4,23"), inconsistência do próprio documento original. Aceita ambos os formatos aqui,
      // detectando qual foi usado antes de converter (não afeta a lógica principal do sistema).
      var NUM_OU_PONTO_DECIMAL = /^([\d]{1,3}(?:\.[\d]{3})*,[\d]{2,5}|[\d]{4,},[\d]{2,5}|,[\d]{2,5}|\d+\.\d{1,5})$/;
      var converterNumeroMultilit = function(txt){
        if (/^\d+\.\d{1,5}$/.test(txt)) return parseFloat(txt); // formato "4.34" ou "150.000" já é decimal nativo
        return parseFloat(txt.replace(/\./g,"").replace(",","."));
      };
      for (var ci=0; ci<textos.length; ci++) {
        var possCodigo = (textos[ci]||"").trim();
        if (!CODIGO_COM_PONTO.test(possCodigo)) continue;
        var palavras = [];
        var ui = ci+1;
        // Tentativa 1: código seguido de palavras soltas, depois a unidade (ordem normal)
        while (ui < textos.length && ui < ci+13 && !UNIDADE_EXATA.test((textos[ui]||"").trim())) {
          var palavra = (textos[ui]||"").trim();
          var proxToken = (textos[ui+1]||"").trim();
          if (palavra.length===0 || palavra==="R$" || (NUM_OU_PONTO_DECIMAL.test(palavra) && proxToken==="R$")) { palavras = []; break; } // não é esse padrão
          palavras.push(palavra);
          ui++;
        }
        // Tentativa 2: código já vem seguido DIRETO da unidade — nesse caso, a descrição está
        // ANTES do código (ordem invertida, ex: quando o item ocupa 2 linhas visuais no PDF original
        // e a extração captura a descrição de cima antes do código+dados de baixo).
        if (palavras.length===0 && UNIDADE_EXATA.test((textos[ci+1]||"").trim())) {
          ui = ci+1;
          var palavrasTras = [];
          var ct = ci-1;
          while (ct>=0 && ct>ci-13) {
            var palavraTras = (textos[ct]||"").trim();
            if (palavraTras.length===0 || NUM_OU_PONTO_DECIMAL.test(palavraTras) || palavraTras==="R$" || CODIGO_COM_PONTO.test(palavraTras) || UNIDADE_EXATA.test(palavraTras)) break;
            palavrasTras.unshift(palavraTras);
            ct--;
          }
          if (palavrasTras.length>0) palavras = palavrasTras;
        }
        if (palavras.length===0 || ui>=textos.length || !UNIDADE_EXATA.test((textos[ui]||"").trim())) continue;
        // Depois da unidade: quantidade, "R$", preço unitário
        var possQtdMultilit = (textos[ui+1]||"").trim();
        var possRSMultilit = (textos[ui+2]||"").trim();
        var possUnitMultilit = (textos[ui+3]||"").trim();
        if (NUM_OU_PONTO_DECIMAL.test(possQtdMultilit) && possRSMultilit==="R$" && NUM_OU_PONTO_DECIMAL.test(possUnitMultilit)) {
          var qtdM = converterNumeroMultilit(possQtdMultilit);
          var unitM = converterNumeroMultilit(possUnitMultilit);
          if (qtdM>=1 && unitM>0) {
            items.push({descricao:palavras.join(" ").toUpperCase(), preco:unitM, qtd:qtdM});
          }
        }
      }
    }

    // FIX: fallback para formato onde a QUANTIDADE é um número inteiro PURO, sem vírgula (ex:
    // Mexichem: "230" ao invés de "230,00"), diferente de todos os outros formatos já tratados.
    // Busca descrições válidas seguidas (numa janela pequena, pra frente) por um inteiro puro (qtd),
    // um valor decimal (preço unit.) e outro valor decimal (total), validando que qtd×unit≈total.
    if (items.length === 0) {
      var posicoesTotalJaUsadas = {};
      for (var mi=0; mi<textos.length; mi++) {
        var possDescMex = (textos[mi]||"").trim();
        if (!pareceDescricaoValida(possDescMex)) continue;
        for (var distMex=1; distMex<=6; distMex++) {
          var idxQtd = mi+distMex;
          var tokQtd = (textos[idxQtd]||"").trim();
          if (!/^\d+$/.test(tokQtd)) continue;
          var qtdMex = parseFloat(tokQtd);
          if (qtdMex<1) continue;
          // procura, logo depois da qtd, um preço unit. e um total que batam matematicamente
          var achou = false;
          for (var offU=1; offU<=3 && !achou; offU++) {
            var tokUnit = (textos[idxQtd+offU]||"").trim();
            if (!NUM.test(tokUnit)) continue;
            var unitMex = parseFloat(tokUnit.replace(/\./g,"").replace(",","."));
            for (var offT=1; offT<=3 && !achou; offT++) {
              var idxTotalMex = idxQtd+offU+offT;
              if (posicoesTotalJaUsadas[idxTotalMex]) continue; // já usado por outra descrição candidata — é duplicata
              var tokTotal = (textos[idxTotalMex]||"").trim();
              if (!NUM.test(tokTotal)) continue;
              var totalMex = parseFloat(tokTotal.replace(/\./g,"").replace(",","."));
              var difMex = Math.abs(qtdMex*unitMex-totalMex)/Math.max(totalMex,1);
              if (difMex<0.01 && unitMex>0) {
                items.push({descricao:possDescMex.toUpperCase(), preco:unitMex, qtd:qtdMex});
                posicoesTotalJaUsadas[idxTotalMex] = true;
                achou = true;
              }
            }
          }
          if (achou) break;
        }
      }
    }

    // FIX: fallback para formato com MUITAS colunas numéricas antes da descrição (ex: Ferracre:
    // código, unidade, qtd, peso, v.bruto, v.desconto, vlr.total, v.unitário, DESCRIÇÃO). A trinca
    // matemática (qtd×unit≈bruto) confirma quais números são qtd/unit, mas o "Vlr.Total" real (já
    // com desconto aplicado) não bate com qtd×unit — por isso calcula um PREÇO EFETIVO (total÷qtd),
    // que é o valor unitário já considerando o desconto.
    // Ativa quando a lógica principal não achou nada OU quando o documento tem a assinatura de
    // cabeçalho específica desse formato ("V. Bruto" E "V. Desc." juntos, únicos desse fornecedor
    // — não aparecem em nenhum outro formato já validado), o que indica com segurança que os preços
    // brutos capturados pela lógica principal não são os valores reais com desconto.
    var temAssinaturaFerracre = textos.some(function(tk){ return /V\.\s*Bruto/i.test(tk||""); }) && textos.some(function(tk){ return /V\.\s*Desc/i.test(tk||""); });
    if (items.length === 0 || temAssinaturaFerracre) {
      var itemsFerracre = [];
      for (var fi=0; fi<textos.length; fi++) {
        var possDescFer = (textos[fi]||"").trim();
        if (!pareceDescricaoValida(possDescFer)) continue;
        // Coleta números nas 10 posições anteriores (onde ficam qtd, peso, bruto, desc, total, unit)
        var numsFer=[], posFer=[];
        for (var distFer=1; distFer<=10; distFer++) {
          var idxFer = fi-distFer;
          if (idxFer<0) break;
          var tokFer = (textos[idxFer]||"").trim();
          if (pareceDescricaoValida(tokFer)) break; // chegou na descrição do item anterior
          if (NUM.test(tokFer)) { numsFer.unshift(parseFloat(tokFer.replace(/\./g,"").replace(",","."))); posFer.unshift(idxFer); }
        }
        if (numsFer.length<4) continue;
        // Procura a trinca qtd×unit≈bruto entre os números coletados
        var achouFer = false;
        for (var xf=0; xf<numsFer.length && !achouFer; xf++) {
          for (var yf=0; yf<numsFer.length && !achouFer; yf++) {
            if (xf===yf) continue;
            var qtdF=numsFer[xf], unitF=numsFer[yf];
            if (qtdF<1 || unitF<=0) continue;
            var brutoCalc = qtdF*unitF;
            for (var zf=0; zf<numsFer.length && !achouFer; zf++) {
              if (zf===xf||zf===yf) continue;
              var brutoF = numsFer[zf];
              if (Math.abs(brutoCalc-brutoF)/Math.max(brutoF,1) >= 0.015) continue;
              // Achou qtd/unit/bruto — agora procura o "total" (valor <= bruto, mais próximo do fim, antes da descrição)
              for (var wf=numsFer.length-1; wf>=0; wf--) {
                if (wf===xf||wf===yf||wf===zf) continue;
                var totalF = numsFer[wf];
                if (totalF>0 && totalF<=brutoF*1.001) {
                  itemsFerracre.push({descricao:possDescFer.toUpperCase(), preco: totalF/qtdF, qtd: qtdF});
                  achouFer = true;
                  break;
                }
              }
            }
          }
        }
      }
      if (itemsFerracre.length>items.length) items = itemsFerracre;
    }

    // FIX: fallback para formato com números ANTES da descrição, em ordem fixa (ex: Ferrosul:
    // Desc.Unit, Pr.Unit.Brut, Qtd, UN, Código, Total, DESCRIÇÃO). Similar ao Ferracre (bruto vs
    // desconto), mas com os números na ordem INVERSA (antes, não depois da descrição). Ativa pela
    // assinatura de cabeçalho específica "Pr Unit Brut" (única desse formato).
    var temAssinaturaFerrosul = textos.some(function(tk){ return /Pr\s*Unit\s*Brut/i.test(tk||""); });
    if (items.length === 0 || temAssinaturaFerrosul) {
      var itemsFerrosul = [];
      for (var fsi=0; fsi<textos.length; fsi++) {
        var possDescFs = (textos[fsi]||"").trim();
        if (!pareceDescricaoValida(possDescFs)) continue;
        // Coleta números nas 8 posições anteriores
        var numsFs=[];
        for (var distFs=1; distFs<=8; distFs++) {
          var idxFs = fsi-distFs;
          if (idxFs<0) break;
          var tokFs = (textos[idxFs]||"").trim();
          if (pareceDescricaoValida(tokFs)) break;
          if (NUM.test(tokFs)) numsFs.unshift(parseFloat(tokFs.replace(/\./g,"").replace(",",".")));
        }
        if (numsFs.length<4) continue;
        var achouFs = false;
        // Testa combinações onde (unitBrutoFs - descUnitFs) x qtdFs ≈ totalFs (fórmula do desconto real)
        for (var xfs=0; xfs<numsFs.length && !achouFs; xfs++) {
          for (var yfs=0; yfs<numsFs.length && !achouFs; yfs++) {
            if (xfs===yfs) continue;
            var qtdFs=numsFs[xfs], unitBrutoFs=numsFs[yfs];
            if (qtdFs<1 || unitBrutoFs<=0) continue;
            for (var kfs=0; kfs<numsFs.length && !achouFs; kfs++) {
              if (kfs===xfs||kfs===yfs) continue;
              var descUnitFs = numsFs[kfs];
              if (descUnitFs<0 || descUnitFs>=unitBrutoFs) continue;
              var precoEfetivoFs = unitBrutoFs - descUnitFs;
              var totalCalcFs = qtdFs*precoEfetivoFs;
              for (var wfs=0; wfs<numsFs.length && !achouFs; wfs++) {
                if (wfs===xfs||wfs===yfs||wfs===kfs) continue;
                var totalRealFs = numsFs[wfs];
                if (Math.abs(totalCalcFs-totalRealFs)/Math.max(totalRealFs,1) < 0.015) {
                  itemsFerrosul.push({descricao:possDescFs.toUpperCase(), preco: precoEfetivoFs, qtd: qtdFs});
                  achouFs = true;
                }
              }
            }
          }
        }
      }
      if (itemsFerrosul.length>items.length) items = itemsFerrosul;
    }
    return items;
  };

  var lerGratis=function(){
    if(!arquivo){setErro("Selecione um PDF primeiro.");return;}
    if(!fornId){setErro("Selecione o fornecedor.");return;}
    if (typeof pdfjsLib === "undefined") { setErro("PDF.js n\u00e3o carregado."); return; }
    setErro("");setStep(2);setMsg("Lendo o PDF (sem IA, sem custo)...");
    pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";
    var reader=new FileReader();
    reader.onload=function(e){
      pdfjsLib.getDocument({data: new Uint8Array(e.target.result)}).promise
        .then(function(pdf){
          var promessas=[];
          for (var p=1;p<=pdf.numPages;p++) promessas.push(pdf.getPage(p).then(function(pg){return pg.getTextContent();}));
          return Promise.all(promessas);
        })
        .then(function(paginas){
          var txts=[];
          paginas.forEach(function(content){
            (content.items||[]).forEach(function(it){ var s=it.str||""; if(s.trim()!=="") txts.push(s); });
          });
          var itensExtraidos=parsearPDFTextoLerIA(txts);
          if(!itensExtraidos.length){
            setErro("N\u00e3o foi poss\u00edvel identificar itens com pre\u00e7o neste PDF sem IA. Tente a op\u00e7\u00e3o \uD83E\uDD16 IA, que consegue ler documentos mais dif\u00edceis.");
            setStep(1); return;
          }
          var parsed={ fornecedor:"", itens: itensExtraidos };
          var ms=fazerMatchs(parsed.itens);
          // FIX: a extração agora j\u00e1 traz o valor UNIT\u00c1RIO direto (validado matematicamente contra
          // quantidade e total encontrados no pr\u00f3prio documento), n\u00e3o precisa mais dividir por nada aqui.
          setCusto(null);
          setResultado(parsed);
          setMatchs(ms); setStep(3);
        })
        .catch(function(err){ setErro("Erro ao ler o PDF: "+(err.message||"")); setStep(1); });
    };
    reader.onerror=function(){ setErro("Erro ao ler o arquivo."); setStep(1); };
    reader.readAsArrayBuffer(arquivo);
  };
  var lerComIA=function(){
    if(!arquivo){setErro("Selecione um PDF primeiro.");return;}
    if(!fornId){setErro("Selecione o fornecedor.");return;}
    setErro("");setStep(2);setMsg("Convertendo PDF...");
    var reader=new FileReader();
    reader.onload=function(){
      var b64=reader.result.split(",")[1];
      setMsg("IA lendo o or\xE7amento...");
      // FIX: timeout de 30s (mesmo padr\xE3o j\xE1 usado no casamento via IA do Excel) — sem isso, se a
      // Edge Function travar, o usu\xE1rio ficava esperando indefinidamente sem chance de cancelar.
      var controladorTempoIA=new AbortController();
      var alarmeTempoIA=setTimeout(function(){controladorTempoIA.abort();},30000);
      fetch(SUPABASE_URL+"/functions/v1/parse-orcamento",{
        method:"POST",
        headers:Object.assign({},SB,{"Content-Type":"application/json"}),
        body:JSON.stringify({pdf_base64:b64,filename:arquivo.name}),
        signal:controladorTempoIA.signal
      })
      .then(function(r){
        clearTimeout(alarmeTempoIA); // FIX: resposta chegou, desliga o cron\xF4metro
        // FIX: fetch n\xE3o rejeita em erro HTTP (404,500...) sozinho — sem isso, r.json() tentava
        // interpretar uma resposta de erro (\xE0s vezes HTML) como JSON, gerando mensagem confusa.
        if(!r.ok) throw new Error("O servidor respondeu com erro ("+r.status+"). Tente novamente em instantes.");
        return r.json();
      })
      .then(function(data){
        if(data.error)throw new Error(data.error.message||"Erro na IA");
        var txt=(data.content||[]).filter(function(b){return b.type==="text";}).map(function(b){return b.text;}).join("");
        var clean=txt.replace(/```json|```/g,"").trim();
        var parsed=JSON.parse(clean);
        var usage=data.usage||{};
        var inp=usage.input_tokens||0,out=usage.output_tokens||0;
        // FIX: busca a cotação real do dólar (com reserva segura se falhar) antes de calcular o
        // custo final, para o valor exibido ficar o mais próximo possível do que é cobrado de verdade.
        return buscarCotacaoDolarIA().then(function(cotacaoUSD){
          var custoBRL=((inp*3+out*15)/1e6)*cotacaoUSD;
          setCusto({inp:inp,out:out,brl:custoBRL});
          sbSaveIaUso({
            fornecedor:parsed.fornecedor||"",arquivo:arquivo.name,
            tokens_input:inp,tokens_output:out,custo_brl:custoBRL,
            itens_lidos:(parsed.itens||[]).length,obra_id:mapa.obra||""
          }).then(function(){if(onIaUso)onIaUso({custo:custoBRL});});
          setResultado(parsed);
          var ms=fazerMatchs(parsed.itens||[]);
          setMatchs(ms);setStep(3);
        });
      })
      .catch(function(e){
        clearTimeout(alarmeTempoIA);
        // FIX: erro de abort (timeout de 30s) tem mensagem t\xE9cnica gen\xE9rica ("The user aborted...");
        // troca por uma mensagem que explica o que aconteceu de verdade.
        var msgErro = (e && e.name === "AbortError") ? "A IA demorou demais para responder (mais de 30s). Tente novamente ou use a op\xE7\xE3o gr\xE1tis." : "Erro: "+(e.message||"Verifique se a Edge Function est\xE1 ativa no Supabase.");
        setErro(msgErro);setStep(1);
      });
    };
    reader.onerror=function(){setErro("Erro ao ler o arquivo.");setStep(1);};
    reader.readAsDataURL(arquivo);
  };
  var confirmar=function(){
    if(!resultado)return;
    var ligs={};
    (resultado.itens||[]).forEach(function(oi,idx){
      var mapaItemId=matchs[idx];
      if(!mapaItemId) return;
      ligs[mapaItemId]={descPDF:oi.descricao,preco:oi.preco,fornId:fornId,orcIdx:idx};
    });
    if(!Object.keys(ligs).length){setErro("Nenhum item casado para salvar.");return;}
    // FIX: alimenta a memória (aprendizados) — cada casamento confirmado aqui ensina que aquele
    // texto do orçamento corresponde àquele insumo do mapa, igual já acontece no Casar Insumos.
    // Assim, da próxima vez que o mesmo fornecedor/descrição aparecer, o casamento automático já
    // funciona sem precisar repetir o trabalho manual.
    Object.keys(ligs).forEach(function(mid){
      var itemMapa = itens.find(function(i){ return i.id === mid; });
      if(itemMapa && itemMapa.descricao) onAprendizadoSalvo(ligs[mid].descPDF, itemMapa.descricao);
    });
    onConfirm(ligs);
  };
  var stOvl={position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(10,20,50,0.65)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"};
  var stMod={background:"#fff",borderRadius:12,width:"92%",maxWidth:720,maxHeight:"90vh",display:"flex",flexDirection:"column",overflow:"hidden"};
  var stHdr={background:"#1a3a78",color:"#fff",padding:"12px 18px",display:"flex",alignItems:"center",gap:10};
  var stFtr={padding:"12px 18px",borderTop:"1px solid #eef0f8",background:"#fafbff",display:"flex",alignItems:"center",gap:10};
  var qtCasados=Object.values(matchs).filter(function(v){return !!v;}).length;
  var qtSem=resultado?((resultado.itens||[]).length-qtCasados):0;
  return CE("div",{style:stOvl},
    CE("div",{style:stMod},
      CE("div",{style:stHdr},
        CE("span",{style:{fontSize:18}},"\uD83E\uDD16"),
        CE("h2",{style:{fontSize:14,fontWeight:800,flex:1,margin:0}},"LER OR\xC7AMENTO COM IA"),
        CE("span",{style:{background:"rgba(255,255,255,0.18)",borderRadius:5,padding:"3px 10px",fontSize:11,fontWeight:600}},"MP N\xBA "+mapa.numero),
        CE("button",{style:{background:"none",border:"none",color:"#fff",fontSize:22,cursor:"pointer",lineHeight:1},onClick:onClose},"\xD7")
      ),
      CE("div",{style:{padding:"8px 18px",background:"#f5f7ff",borderBottom:"1px solid #e0e4f0",display:"flex",alignItems:"center",gap:6}},
        [{l:"1",t:"Upload"},{l:"2",t:"Lendo"},{l:"3",t:"Casamento"}].map(function(s,i){
          var done=i+1<step,active=i+1===step;
          return CE(React.Fragment,{key:i},
            i>0&&CE("div",{style:{height:1,flex:1,background:done?"#2a5298":"#d0d8f0"}}),
            CE("div",{style:{width:22,height:22,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,flexShrink:0,background:done?"#2a5298":active?"#1a3a78":"#e0e4f0",color:done||active?"#fff":"#888"}},done?"\u2713":s.l),
            CE("span",{style:{fontSize:9,color:active?"#1a3a78":"#aaa",fontWeight:active?700:400,marginRight:4}},s.t)
          );
        })
      ),
      step===1&&CE("div",{style:{padding:"18px",flex:1,overflow:"auto"}},
        erro&&CE("div",{style:{background:"#fdecea",border:"1px solid #f5c6c2",borderRadius:8,padding:"10px 14px",marginBottom:12,fontSize:12,color:"#c0392b"}},erro),
        CE("div",{style:{marginBottom:14}},
          CE("label",{style:{fontSize:11,fontWeight:700,color:"#555",display:"block",marginBottom:6}},"COMO CASAR OS ITENS COM O MAPA?"),
          CE("div",{
            onClick:function(){setModoLer('gratis');},
            style:{border:"2px solid "+(modoLer==='gratis'?"#0e7a5f":"#e0e0e0"),background:modoLer==='gratis'?"#eafaf0":"#fff",borderRadius:6,padding:10,marginBottom:8,cursor:"pointer",display:"flex",gap:8,alignItems:"center"}
          },
            CE("span",{style:{fontSize:18}},"\u26A1"),
            CE("div",null,
              CE("strong",{style:{display:"block",fontSize:11}},"Compara\u00e7\u00e3o autom\u00e1tica (gr\u00e1tis)"),
              CE("span",{style:{fontSize:9,color:"#777"}},"Sem custo \u00B7 usa a mem\u00f3ria do sistema + compara\u00e7\u00e3o de palavras")
            )
          ),
          CE("div",{
            onClick:function(){setModoLer('ia');},
            style:{border:"2px solid "+(modoLer==='ia'?"#534AB7":"#e0e0e0"),background:modoLer==='ia'?"#f3f0ff":"#fff",borderRadius:6,padding:10,cursor:"pointer",display:"flex",gap:8,alignItems:"center"}
          },
            CE("span",{style:{fontSize:18}},"\uD83E\uDD16"),
            CE("div",null,
              CE("strong",{style:{display:"block",fontSize:11}},"Casar com Intelig\u00eancia Artificial"),
              CE("span",{style:{fontSize:9,color:"#777"}},"Mais preciso em PDFs dif\u00edceis \u00B7 custo pequeno por uso")
            )
          )
        ),
        CE("div",{style:{marginBottom:14}},
          CE("label",{style:{fontSize:11,fontWeight:700,color:"#555",display:"block",marginBottom:6}},"FORNECEDOR"),
          CE("select",{value:fornId,onChange:function(e){setFornId(e.target.value);},style:{width:"100%",padding:"8px 10px",borderRadius:7,border:"1px solid #d0d8f0",background:"#f8faff",fontSize:13}},
            CE("option",{value:""},"\u2014 SELECIONE O FORNECEDOR \u2014"),
            forns.map(function(f){return CE("option",{key:f.id,value:f.id},f.nome);})
          )
        ),
        CE("div",{
          style:{border:"2px dashed "+(arquivo?"#2a5298":"#b0c4e8"),borderRadius:10,padding:"28px 16px",textAlign:"center",cursor:"pointer",background:arquivo?"#f0f8ff":"#f0f5ff"},
          onClick:function(){document.getElementById("ia-pdf-inp").click();}
        },
          CE("input",{id:"ia-pdf-inp",type:"file",accept:".pdf",style:{display:"none"},onChange:function(e){if(e.target.files[0]){setArquivo(e.target.files[0]);setErro("");}e.target.value="";}}),
          CE("div",{style:{fontSize:28,marginBottom:8}},"\uD83D\uDCC4"),
          CE("div",{style:{fontSize:13,fontWeight:700,color:"#2a5298"}},arquivo?arquivo.name:"Clique ou arraste o PDF do or\xE7amento"),
          CE("div",{style:{fontSize:11,color:"#888",marginTop:4}},arquivo?"PDF selecionado \u2713 \u2014 clique para trocar":"Aceita PDF com texto e PDF escaneado")
        ),
        custo&&CE("div",{style:{marginTop:12,background:"#f0f8f0",border:"1px solid #c0e0c0",borderRadius:8,padding:"8px 14px",fontSize:11,display:"flex",gap:16,flexWrap:"wrap"}},
          CE("span",null,"Tokens: ",CE("b",null,(custo.inp||0)+(custo.out||0))),
          CE("span",null,"Custo: ",CE("b",{style:{color:"#186818"}},"R$ "+custo.brl.toFixed(3).replace(".",",")))
        )
      ),
      step===2&&CE("div",{style:{padding:"44px 18px",textAlign:"center",flex:1}},
        CE("div",{style:{fontSize:36,marginBottom:12}},"\u23F3"),
        CE("div",{style:{fontSize:14,fontWeight:800,color:"#1a3a78"}},msg),
        CE("div",{style:{fontSize:11,color:"#888",marginTop:6}},arquivo?arquivo.name:"")
      ),
      step===3&&resultado&&CE("div",{style:{flex:1,overflow:"auto",padding:"12px 18px"}},
        erro&&CE("div",{style:{background:"#fdecea",border:"1px solid #f5c6c2",borderRadius:8,padding:"10px 14px",marginBottom:10,fontSize:12,color:"#c0392b"}},erro),
        CE("div",{style:{display:"flex",gap:8,marginBottom:10,fontSize:11,flexWrap:"wrap"}},
          resultado.fornecedor&&CE("div",{style:{background:"#e6f0ff",borderRadius:6,padding:"4px 12px",color:"#2a5298",fontWeight:700}},"Fornecedor: "+resultado.fornecedor),
          CE("div",{style:{background:"#e6f4ea",borderRadius:6,padding:"4px 12px",color:"#186818",fontWeight:700}},qtCasados+" casados automaticamente"),
          qtSem>0&&CE("div",{style:{background:"#fff3e0",borderRadius:6,padding:"4px 12px",color:"#e65100",fontWeight:700}},qtSem+" sem correspond\xEAncia")
        ),
        CE("div",{style:{display:"flex",gap:8,marginBottom:10,alignItems:"center",flexWrap:"wrap"}},
          CE("input",{
            value:busca3,
            onChange:function(e){setBusca3(e.target.value);},
            placeholder:"\uD83D\uDD0D Buscar item do or\xE7amento...",
            style:{flex:1,minWidth:180,padding:"7px 10px",borderRadius:7,border:"1px solid #d0d8f0",fontSize:12,background:"#f8faff"}
          }),
          CE("select",{
            value:filtroTipo,
            onChange:function(e){setFiltroTipo(e.target.value);},
            style:{padding:"7px 10px",borderRadius:7,border:"1px solid #d0d8f0",fontSize:11,background:"#f8faff",color:"#555"}
          },
            CE("option",{value:"todos"},"Todos ("+((resultado.itens||[]).length)+")"),
            CE("option",{value:"casados"},"Casados ("+qtCasados+")"),
            CE("option",{value:"sem"},"Sem correspond\xEAncia ("+qtSem+")")
          ),
          busca3&&CE("button",{
            onClick:function(){setBusca3("");},
            style:{padding:"7px 10px",borderRadius:7,border:"1px solid #d0d8f0",fontSize:11,cursor:"pointer",background:"#fff",color:"#888"}
          },"\u2715 Limpar")
        ),
        CE("table",{style:{width:"100%",borderCollapse:"collapse",fontSize:11}},
          CE("colgroup",null,CE("col",{style:{width:"48%"}}),CE("col",{style:{width:"88px"}}),CE("col",null)),
          CE("thead",null,CE("tr",{style:{background:"#eef1fa"}},
            CE("th",{style:{padding:"7px 10px",textAlign:"left"}},"Item do or\xE7amento"),
            CE("th",{style:{padding:"7px 10px",textAlign:"right"}},"Pre\xE7o unit."),
            CE("th",{style:{padding:"7px 10px",textAlign:"left"}},"Insumo no mapa")
          )),
          CE("tbody",null,(resultado.itens||[]).map(function(oi,originalIdx){return {oi:oi,originalIdx:originalIdx};}).filter(function(item){
            var buscaOk=!busca3||normalizar(item.oi.descricao).indexOf(normalizar(busca3))>=0;
            var tipoOk=filtroTipo==="todos"||(filtroTipo==="casados"&&!!matchs[item.originalIdx])||(filtroTipo==="sem"&&!matchs[item.originalIdx]);
            return buscaOk&&tipoOk;
          }).map(function(item){
            var oi=item.oi, idx=item.originalIdx;
            var matched=matchs[idx];
            return CE("tr",{key:idx,style:{borderBottom:"1px solid #f0f2f8",background:idx%2?"#f8faff":"#fff"}},
              CE("td",{style:{padding:"7px 10px",color:"#222"}},oi.descricao),
              CE("td",{style:{padding:"7px 10px",textAlign:"right",fontWeight:700,color:"#186818",whiteSpace:"nowrap"}},"R$ "+fmtBRL(oi.preco)),
              CE("td",{style:{padding:"6px 8px"}},
                CE("div",{
                  onClick:function(){setSeletorAberto(idx);setSeletorBusca("");},
                  style:{
                    padding:"6px 10px",borderRadius:5,cursor:"pointer",fontSize:10,
                    border:"1.5px solid "+(matchs[idx]?"#b0d0b0":"#f0b080"),
                    background:matchs[idx]?"#f0f8f0":"#fff8f0",
                    display:"flex",alignItems:"center",gap:4,minHeight:28
                  }
                },
                  CE("span",{style:{flex:1,color:matchs[idx]?"#186818":"#aaa",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}},
                    matchs[idx] ? getItemDesc(matchs[idx]) : "toque para selecionar..."
                  ),
                  CE("span",{style:{color:"#aaa",fontSize:9,flexShrink:0}},"\u25BC")
                )
              )
            );
          }))
        )
      ),
      CE("div",{style:stFtr},
        step===1&&CE(React.Fragment,null,
          CE("span",{style:{fontSize:10,color:"#888"}},modoLer==='ia'?"Claude Haiku 4.5 \u00B7 ~R$ 0,01/or\xE7amento":"Sem custo"),
          CE("div",{style:{flex:1}}),
          CE("button",{style:{background:"none",border:"1px solid #d0d8e8",borderRadius:7,padding:"7px 16px",fontSize:12,cursor:"pointer"},onClick:onClose},"CANCELAR"),
          CE("button",{
            style:{background:arquivo&&fornId&&modoLer?"#534AB7":"#bbb",color:"#fff",border:"none",borderRadius:7,padding:"8px 18px",fontSize:12,fontWeight:800,cursor:arquivo&&fornId&&modoLer?"pointer":"not-allowed"},
            onClick:function(){ if(modoLer==='gratis') lerGratis(); else if(modoLer==='ia') lerComIA(); },
            disabled:!arquivo||!fornId||!modoLer
          },modoLer==='gratis'?"\u26A1 LER GR\xC1TIS \u2192":"\uD83E\uDD16 LER COM IA \u2192")
        ),
        step===2&&CE(React.Fragment,null,
          CE("span",{style:{fontSize:11,color:"#888"}},"Aguarde, a IA est\xE1 lendo o or\xE7amento..."),
          CE("div",{style:{flex:1}}),
          CE("button",{style:{background:"none",border:"1px solid #d0d8e8",borderRadius:7,padding:"7px 16px",fontSize:12,cursor:"pointer"},onClick:onClose},"CANCELAR")
        ),
        step===3&&CE(React.Fragment,null,
          custo&&CE("span",{style:{fontSize:10,color:"#888"}},"Custo: R$ "+custo.brl.toFixed(3).replace(".",",")),
          CE("div",{style:{flex:1}}),
          CE("button",{style:{background:"none",border:"1px solid #d0d8e8",borderRadius:7,padding:"7px 16px",fontSize:12,cursor:"pointer"},onClick:function(){setStep(1);}}, "VOLTAR"),
          CE("button",{
            style:{background:"#186818",color:"#fff",border:"none",borderRadius:7,padding:"8px 18px",fontSize:12,fontWeight:800,cursor:"pointer"},
            onClick:confirmar
          },"\u2705 PREENCHER MAPA")
        )
      ),
      seletorAberto!==null&&CE("div",{style:{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.92)",zIndex:2000,display:"flex",flexDirection:"column"}},
        CE("div",{style:{background:"#1a1a2e",padding:"12px 16px",borderBottom:"1px solid #333",flexShrink:0}},
          CE("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:10}},
            CE("span",{style:{color:"#aaa",fontSize:11,flex:1}},
              seletorAberto!==null&&resultado&&resultado.itens&&resultado.itens[seletorAberto]
                ? resultado.itens[seletorAberto].descricao.slice(0,40)+"..."
                : "Selecionar insumo"
            ),
            CE("button",{
              onClick:function(){setSeletorAberto(null);setSeletorBusca("");},
              style:{background:"none",border:"none",color:"#fff",fontSize:22,cursor:"pointer",lineHeight:1,padding:"0 4px"}
            },"\xD7")
          ),
          CE("input",{
            type:"text",
            value:seletorBusca,
            onChange:function(e){setSeletorBusca(e.target.value);},
            placeholder:"\uD83D\uDD0D Digitar para filtrar a lista...",
            style:{width:"100%",padding:"10px 14px",borderRadius:8,border:"none",background:"#fff",fontSize:13,boxSizing:"border-box"}
          })
        ),
        CE("div",{style:{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch"}},
          CE("div",{
            onClick:function(){
              var idx=seletorAberto;
              setMatchs(function(prev){var n=Object.assign({},prev);n[idx]="";return n;});
              setSeletorAberto(null);setSeletorBusca("");
            },
            style:{padding:"14px 16px",borderBottom:"1px solid #222",color:"#888",fontSize:12,cursor:"pointer"}
          },"\u2014 n\xE3o usar \u2014"),
          (itens||[]).filter(function(mi){
            return !seletorBusca||normalizar(mi.descricao).indexOf(normalizar(seletorBusca))>=0;
          }).map(function(mi){
            var isSelected=seletorAberto!==null&&matchs[seletorAberto]===mi.id;
            return CE("div",{
              key:mi.id,
              onClick:function(){
                var idx=seletorAberto;
                setMatchs(function(prev){var n=Object.assign({},prev);n[idx]=mi.id;return n;});
                setSeletorAberto(null);setSeletorBusca("");
              },
              style:{
                padding:"14px 16px",borderBottom:"1px solid #222",
                color:isSelected?"#3ECF8E":"#fff",fontSize:12,cursor:"pointer",
                background:isSelected?"rgba(62,207,142,0.1)":"transparent"
              }
            },mi.descricao);
          })
        )
      )
    )
  );
}


// ─── Map Card ─────────────────────────────────────────────────────────────────
