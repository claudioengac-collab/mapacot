function ModalPedidoStep1(_ref_po1) {
  var mapa=_ref_po1.mapa, itens=_ref_po1.itens, pedidos=_ref_po1.pedidos, itensSelecionados=_ref_po1.itensSelecionados;
  var onToggle=_ref_po1.onToggle, onToggleAll=_ref_po1.onToggleAll, onClose=_ref_po1.onClose, onContinuar=_ref_po1.onContinuar;

  // Calcular status de PO por item
  var poStatus = {};
  (itens||[]).forEach(function(item){
    var posdoItem = (pedidos||[]).filter(function(po){
      return mapa && po.mapa_id===mapa.id && (po.itens||[]).some(function(it){ return it.item_id===item.id; }) && po.status!=='cancelado';
    });
    var qtTotal = Number(item.qt)||0;
    var qtPedida = 0;
    var qtAtendida = 0;
    posdoItem.forEach(function(po){
      var it = (po.itens||[]).find(function(i){ return i.item_id===item.id; });
      if (it) {
        qtPedida += Number(it.qt_pedida)||0;
        if (po.status==='recebido') qtAtendida += Number(it.qt_pedida)||0;
      }
    });
    poStatus[item.id] = { qtTotal:qtTotal, qtPedida:qtPedida, qtAtendida:qtAtendida,
      label: qtPedida===0?'SEM PEDIDO': qtPedida>=qtTotal?'ATENDIDO':'PARCIAL',
      color: qtPedida===0?'#999': qtPedida>=qtTotal?'#3B6D11':'#185FA5',
      bg: qtPedida===0?'#f0f0f0': qtPedida>=qtTotal?'#EAF3DE':'#E6F1FB'
    };
  });

  var qtSel = itensSelecionados.length;
  var _sFiltro = useState(''), filtroStep1 = _slicedToArray(_sFiltro,2)[0], setFiltroStep1 = _slicedToArray(_sFiltro,2)[1];
  // FIX 2: trim calculado uma vez só
  var termoBusca = filtroStep1.trim().toUpperCase();
  var itensFiltrados = termoBusca
    ? (itens||[]).filter(function(item){
        return (item.descricao||'').toUpperCase().includes(termoBusca) ||
               (item.detalhe||'').toUpperCase().includes(termoBusca);
      })
    : (itens||[]);
  var ovStyle = { position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.55)',zIndex:9000,display:'flex',alignItems:'center',justifyContent:'center',padding:12,overscrollBehavior:'none' };
  var modalStyle = { background:'#fff',borderRadius:8,overflow:'hidden',width:'100%',maxWidth:700,maxHeight:'90vh',display:'flex',flexDirection:'column',boxShadow:'0 8px 32px rgba(0,0,0,0.3)' };
  var hdrStyle = { background:'#7c3aed',color:'#fff',padding:'12px 16px',display:'flex',alignItems:'center',justifyContent:'space-between' };
  var bodyStyle = { padding:14,overflowY:'auto',flex:1,overscrollBehavior:'contain' };
  var ftrStyle = { display:'flex',gap:8,padding:'12px 14px',borderTop:'1px solid #eee',alignItems:'center' };
  var infoStyle = { background:'#f0eaff',border:'1px solid #d4b8ff',borderRadius:5,padding:'8px 12px',marginBottom:12,fontSize:10,color:'#4a1a8a' };
  var thStyle = { background:'#5b21b6',color:'#fff',padding:'6px 8px',fontSize:9,textAlign:'center',whiteSpace:'nowrap' };

  return /*#__PURE__*/React.createElement('div', { style:ovStyle },
    /*#__PURE__*/React.createElement('div', { style:modalStyle },
      /*#__PURE__*/React.createElement('div', { style:hdrStyle },
        /*#__PURE__*/React.createElement('span', { style:{fontSize:12,fontWeight:'bold'} }, '\uD83D\uDED2 CRIAR PEDIDO DE COMPRA \u00B7 ' + (mapa.obra||'')),
        /*#__PURE__*/React.createElement('span', { style:{cursor:'pointer',fontSize:16,opacity:.8}, onClick:onClose }, '\u2715')
      ),
      /*#__PURE__*/React.createElement('div', { style:bodyStyle },
        /*#__PURE__*/React.createElement('div', { style:infoStyle },
          '\u2139\uFE0F Selecione os itens para o pedido. Esta sele\u00E7\u00E3o \u00E9 ',
          /*#__PURE__*/React.createElement('strong', null, 'independente'),
          ' do campo COMPRA existente no mapa.'
        ),
        /*#__PURE__*/React.createElement('div', { style:{display:'flex',alignItems:'center',gap:6,marginBottom:10,background:'#f9f6ff',border:'1px solid #d4b8ff',borderRadius:6,padding:'6px 10px'} },
          /*#__PURE__*/React.createElement('span', { style:{fontSize:13,color:'#7c3aed'} }, '\uD83D\uDD0D'),
          /*#__PURE__*/React.createElement('input', {
            type:'text',
            value: filtroStep1,
            onChange: function(e){ setFiltroStep1(e.target.value); },
            placeholder: 'Buscar insumo por descrição ou detalhe...',
            maxLength: 80,
            inputMode: 'search',
            style:{flex:1,border:'none',background:'transparent',fontSize:11,outline:'none',color:'#333'}
          }),
          termoBusca && /*#__PURE__*/React.createElement('span', {
            onClick: function(){ setFiltroStep1(''); },
            style:{cursor:'pointer',fontSize:12,color:'#aaa',padding:'4px 10px',minWidth:32,textAlign:'center'}
          }, '\u2715')
        ),
        /*#__PURE__*/React.createElement('table', { style:{width:'100%',borderCollapse:'collapse',fontSize:10} },
          /*#__PURE__*/React.createElement('thead', null,
            /*#__PURE__*/React.createElement('tr', null,
              /*#__PURE__*/React.createElement('th', { style:Object.assign({},thStyle,{width:36}) },
                /*#__PURE__*/React.createElement('input', { type:'checkbox',
                  checked: itensFiltrados.length>0 && itensFiltrados.every(function(i){ return itensSelecionados.indexOf(i.id)>=0; }),
                  onChange: function(e){
                    var ids = itensFiltrados.map(function(i){ return i.id; });
                    if(e.target.checked){
                      // Adiciona filtrados aos já selecionados sem remover outros
                      var novos = itensSelecionados.slice();
                      ids.forEach(function(id){ if(novos.indexOf(id)<0) novos.push(id); });
                      onToggleAll(novos);
                    } else {
                      // Remove só os filtrados
                      onToggleAll(itensSelecionados.filter(function(id){ return ids.indexOf(id)<0; }));
                    }
                  },
                  style:{cursor:'pointer'} })
              ),
              ['ITEM','DESCRIÇÃO / DETALHE','QT. TOTAL','JÁ PEDIDA','PENDENTE','PO STATUS'].map(function(h,i){
                return /*#__PURE__*/React.createElement('th', { key:i, style:Object.assign({},thStyle,{textAlign:i>1?'center':'left'}) }, h);
              })
            )
          ),
          /*#__PURE__*/React.createElement('tbody', null,
            itensFiltrados.length === 0
              ? /*#__PURE__*/React.createElement('tr', null,
                  /*#__PURE__*/React.createElement('td', { colSpan:7, style:{textAlign:'center',padding:24,color:'#888',fontSize:11} },
                    '\uD83D\uDD0D Nenhum insumo encontrado para "' + termoBusca + '"'
                  )
                )
              : itensFiltrados.map(function(item){
              var ps = poStatus[item.id]||{};
              var sel = itensSelecionados.indexOf(item.id)>=0;
              var qtPend = Math.max(0,(Number(item.qt)||0) - (ps.qtPedida||0));
              return /*#__PURE__*/React.createElement('tr', { key:item.id, style:{background:sel?'#f5f0ff':'transparent'} },
                /*#__PURE__*/React.createElement('td', { 
                  style:{textAlign:'center',padding:'8px 4px',borderBottom:'1px solid #eee'}
                },
                  /*#__PURE__*/React.createElement('input', { 
                    type:'checkbox', 
                    checked:sel, 
                    onChange:function(){ onToggle(item.id); },
                    style:{cursor:'pointer',accentColor:'#7c3aed',width:22,height:22,display:'block',margin:'0 auto'} 
                  })
                ),
                /*#__PURE__*/React.createElement('td', { style:{textAlign:'center',padding:'6px 8px',borderBottom:'1px solid #eee',fontWeight:'bold'} }, item.num),
                /*#__PURE__*/React.createElement('td', { style:{padding:'6px 8px',borderBottom:'1px solid #eee'} },
                  /*#__PURE__*/React.createElement('strong', null, item.descricao||''),
                  /*#__PURE__*/React.createElement('br',null),
                  /*#__PURE__*/React.createElement('span', { style:{fontSize:9,color:'#888'} }, item.detalhe||'')
                ),
                /*#__PURE__*/React.createElement('td', { style:{textAlign:'center',padding:'6px 8px',borderBottom:'1px solid #eee'} }, (item.qt||0)+' '+(item.unid||'')),
                /*#__PURE__*/React.createElement('td', { style:{textAlign:'center',padding:'6px 8px',borderBottom:'1px solid #eee',color:'#185FA5',fontWeight:'bold'} }, ps.qtPedida||0),
                /*#__PURE__*/React.createElement('td', { style:{textAlign:'center',padding:'6px 8px',borderBottom:'1px solid #eee',color:qtPend>0?'#b06000':'#3B6D11',fontWeight:'bold'} }, qtPend),
                /*#__PURE__*/React.createElement('td', { style:{padding:'6px 8px',borderBottom:'1px solid #eee'} },
                  /*#__PURE__*/React.createElement('span', { style:{background:ps.bg,color:ps.color,padding:'2px 8px',borderRadius:99,fontSize:9,fontWeight:'bold'} }, ps.label||'')
                )
              );
            })
          )
        )
      ),
      /*#__PURE__*/React.createElement('div', { style:ftrStyle },
        /*#__PURE__*/React.createElement('span', { style:{flex:1,fontSize:10,color:'#666'} },
          termoBusca
            ? /*#__PURE__*/React.createElement('span', null,
                /*#__PURE__*/React.createElement('strong', { style:{color:'#7c3aed'} }, qtSel),
                ' selecionado(s) \u00B7 ',
                /*#__PURE__*/React.createElement('span', { style:{color:'#888'} },
                  itensFiltrados.length + ' de ' + (itens||[]).length + ' itens vis\u00edveis'
                )
              )
            : /*#__PURE__*/React.createElement('span', null,
                /*#__PURE__*/React.createElement('strong', { style:{color:'#7c3aed'} }, qtSel),
                ' item(s) selecionado(s)'
              )
        ),
        /*#__PURE__*/React.createElement('button', { onClick:onClose, style:{background:'#f0f0f0',border:'none',padding:'8px 16px',borderRadius:4,fontSize:11,cursor:'pointer'} }, 'Cancelar'),
        /*#__PURE__*/React.createElement('button', {
          onClick: function(){ if(qtSel===0){alert('Selecione pelo menos 1 item.');return;} onContinuar(); },
          style:{background:'#7c3aed',color:'#fff',border:'none',padding:'8px 18px',borderRadius:4,fontSize:11,cursor:'pointer',fontWeight:'bold'}
        }, 'Continuar \u2192')
      )
    )
  );
}

// ─── V4 CSS — Modal Pedido Step 2 ───────────────────────────────────────────
function ModalPedidoStep2(_ref_po2) {
  var mapa=_ref_po2.mapa, itens=_ref_po2.itens, pedidos=_ref_po2.pedidos;
  var config=_ref_po2.config, onConfig=_ref_po2.onConfig;
  var poFinanceiro=_ref_po2.poFinanceiro||{}, onFinanceiro=_ref_po2.onFinanceiro;
  var onVoltar=_ref_po2.onVoltar, onClose=_ref_po2.onClose, onGerar=_ref_po2.onGerar;
  var modoEdicao=_ref_po2.modoEdicao||false;
  // FIX (bug real, relatado pelo Claudio): ao editar um pedido, se o mapa aberto no momento
  // não for o mesmo mapa de onde o pedido foi originalmente criado, os itens do pedido não
  // eram encontrados na lista do mapa aberto — e a tela mostrava "este insumo foi removido do
  // mapa", uma mensagem enganosa (o item não sumiu, só é de outro mapa). Esta prop nova carrega
  // os dados que o PRÓPRIO pedido já guarda de cada item (descrição, unidade, quantidade) — usada
  // só como reserva, exclusivamente quando o item não é achado no mapa aberto no momento.
  var itensPedidoOriginal = _ref_po2.itensPedidoOriginal||[];
  var _sFP=useState(_ref_po2.formaPagamentoInicial||''),formaPagamento=_slicedToArray(_sFP,2)[0],setFormaPagamento=_slicedToArray(_sFP,2)[1];
  var _sGer=useState(false),gerando=_slicedToArray(_sGer,2)[0],setGerando=_slicedToArray(_sGer,2)[1];
  // FIX 4 (Claudio, 05/08): a observação é uma coisa só do pedido — nunca fez sentido ter
  // várias caixas de digitar (uma por item) representando um único texto. Isso foi a raiz de
  // toda a série de bugs anteriores (esquecer de salvar, mostrar só num item, duplicar ao
  // corrigir, não conseguir apagar de propósito). Agora existe UM campo só, sempre, em criar
  // e em editar — sem nenhuma lógica de juntar/sincronizar cópias, porque não existem cópias.
  var _sObsPedido=useState(_ref_po2.observacaoInicial||''),obsPedido=_slicedToArray(_sObsPedido,2)[0],setObsPedido=_slicedToArray(_sObsPedido,2)[1];

  var itemIds = Object.keys(config||{});


  // Calcular poStatus por item
  var poStatus = {};
  (itens||[]).forEach(function(item){
    var qtTotal = Number(item.qt)||0;
    var qtPedida = 0;
    var qtAtendida = 0;
    (pedidos||[]).filter(function(po){ return po.mapa_id===mapa.id && po.status!=='cancelado'; }).forEach(function(po){
      var it=(po.itens||[]).find(function(i){ return i.item_id===item.id; });
      if(it){ qtPedida+=Number(it.qt_pedida)||0; if(po.status==='recebido') qtAtendida+=Number(it.qt_pedida)||0; }
    });
    poStatus[item.id]={qtTotal:qtTotal,qtPedida:qtPedida,qtAtendida:qtAtendida,qtPend:Math.max(0,qtTotal-qtPedida)};
  });
  // FIX (mesmo bug do item "removido do mapa"): pros itens do pedido que vieram de OUTRO mapa
  // (não cobertos pelo loop acima, que só percorre o mapa aberto agora), calcula um status
  // aproximado usando os dados que o próprio pedido já tem salvos — evita que os números apareçam
  // em branco na tela. Não é tão preciso quanto o cálculo normal (não enxerga outros pedidos que
  // porventura existam para esse item vindos daquele outro mapa), mas é uma aproximação razoável
  // e nunca fica pior do que "em branco".
  itemIds.forEach(function(itemId){
    if (poStatus[itemId]) return; // já calculado normalmente acima, não sobrescreve
    var itOrig = itensPedidoOriginal.find(function(i){ return i.item_id===itemId; });
    if (!itOrig) return;
    var qtTotal = Number(itOrig.qt_total)||0;
    var qtPedida = Number(itOrig.qt_pedida)||0;
    var qtAtendida = modoEdicao ? 0 : qtPedida; // status "recebido" desse pedido específico não é visível aqui; aproximação conservadora
    poStatus[itemId]={qtTotal:qtTotal,qtPedida:qtPedida,qtAtendida:qtAtendida,qtPend:Math.max(0,qtTotal-qtPedida)};
  });

  // Calcular número de POs a gerar (por fornecedor único)
  var fornIds = new Set();
  itemIds.forEach(function(id){ (config[id]||[]).forEach(function(l){ if(l.fornId) fornIds.add(l.fornId); }); });
  var nPOs = fornIds.size;

  // Calcular valor estimado
  var valorTotal = 0;
  itemIds.forEach(function(id){ (config[id]||[]).forEach(function(l){ valorTotal += (Number(l.vlUnit)||0)*(Number(l.qt)||0); }); });

  var ovStyle = { position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.55)',zIndex:9000,display:'flex',alignItems:'center',justifyContent:'center',padding:12,overscrollBehavior:'none' };
  var modalStyle = { background:'#fff',borderRadius:8,overflow:'hidden',width:'100%',maxWidth:740,maxHeight:'92vh',display:'flex',flexDirection:'column',boxShadow:'0 8px 32px rgba(0,0,0,0.3)' };
  var hdrStyle = { background:'#7c3aed',color:'#fff',padding:'12px 16px',display:'flex',alignItems:'center',justifyContent:'space-between' };
  var bodyStyle = { padding:14,overflowY:'auto',flex:1,overscrollBehavior:'contain' };
  var ftrStyle = { display:'flex',gap:8,padding:'12px 14px',borderTop:'1px solid #eee',alignItems:'center' };
  var kpiRowStyle = { display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:8,marginBottom:14 };
  var kpiCardStyle = { background:'#f9f9f9',border:'1px solid #e0e0e0',borderRadius:5,padding:'8px 10px',textAlign:'center' };

  function updateLinha(itemId, idx, field, val) {
    onConfig(function(prev){
      var n = Object.assign({}, prev);
      n[itemId] = (n[itemId]||[]).slice();
      n[itemId][idx] = Object.assign({}, n[itemId][idx], _defineProperty({}, field, val));
      // Atualizar preço quando muda fornecedor
      if (field==='fornId') {
        var forn = (mapa.fornecedores||[]).find(function(f){ return f.id===val; });
        var item = (itens||[]).find(function(i){ return i.id===itemId; });
        if (forn && item) {
          var preco = (mapa.precos||{})[item.id+'_'+val] || '';
          var vlUnit = preco ? Number(String(preco).replace(',','.')) : 0;
          n[itemId][idx] = Object.assign({}, n[itemId][idx], { fornNome: forn.nome, vlUnit: vlUnit, fornId: val });
        }
      }
      return n;
    });
  }

  function addLinha(itemId) {
    onConfig(function(prev){
      var n = Object.assign({}, prev);
      n[itemId] = (n[itemId]||[]).concat([{ fornId:'', fornNome:'', vlUnit:0, qt:'', obs:'' }]);
      return n;
    });
  }

  return /*#__PURE__*/React.createElement('div', { style:ovStyle },
    /*#__PURE__*/React.createElement('div', { style:modalStyle },
      /*#__PURE__*/React.createElement('div', { style:hdrStyle },
        /*#__PURE__*/React.createElement('span', { style:{fontSize:12,fontWeight:'bold'} }, (modoEdicao ? '\u270F\uFE0F EDITAR PEDIDO DE COMPRA \u00B7 ' : '\uD83D\uDED2 CONFIGURAR PEDIDO \u00B7 ') + (mapa.obra||'')),
        /*#__PURE__*/React.createElement('span', { style:{cursor:'pointer',fontSize:16,opacity:.8}, onClick:onClose }, '\u2715')
      ),
      /*#__PURE__*/React.createElement('div', { style:bodyStyle },
        // KPIs
        /*#__PURE__*/React.createElement('div', { style:kpiRowStyle },
          [['Itens no pedido', itemIds.length, '#2a5298'],['Qt. pendente total', itemIds.reduce(function(s,id){ return s+(poStatus[id]?poStatus[id].qtPend:0); },0)+' un','#b06000'],['POs a gerar', nPOs,'#7c3aed'],['Valor estimado','R$ '+fmtBRL(valorTotal),'#3B6D11']].map(function(k,i){
            return /*#__PURE__*/React.createElement('div', { key:i, style:kpiCardStyle },
              /*#__PURE__*/React.createElement('div', { style:{fontSize:8,color:'#888',textTransform:'uppercase',marginBottom:3} }, k[0]),
              /*#__PURE__*/React.createElement('div', { style:{fontSize:15,fontWeight:'bold',color:k[2]} }, k[1])
            );
          })
        ),
        // Cards por item
        itemIds.map(function(itemId){
          var item = (itens||[]).find(function(i){ return i.id===itemId; });
          if (!item) {
            // FIX: item não achado no mapa aberto no momento — antes de desistir e mostrar o
            // aviso de "removido", tenta montar o item a partir dos dados que o PRÓPRIO pedido
            // já guarda (salvos quando o pedido foi criado, sempre disponíveis independente de
            // qual mapa está aberto agora). Só mostra o aviso se REALMENTE não achar em lugar
            // nenhum — caso, na prática, quase impossível, já que esses dados são sempre salvos.
            var itOrig = itensPedidoOriginal.find(function(i){ return i.item_id===itemId; });
            if (itOrig) {
              item = { id: itemId, num: '—', descricao: itOrig.descricao||'', detalhe: itOrig.detalhe||'', unid: itOrig.unid||'', qt: itOrig.qt_total||0 };
            }
          }
          if (!item) return /*#__PURE__*/React.createElement('div', { key:itemId, style:{border:'1px solid #f0a500',background:'#fff8e6',borderRadius:6,padding:'10px 12px',marginBottom:10,fontSize:10,color:'#7a5c00'} },
            '\u26A0\uFE0F Este insumo foi removido do mapa e não pode mais ser editado aqui, mas continua incluído neste pedido.'
          );
          var ps = poStatus[itemId]||{};
          var linhas = config[itemId]||[{ fornId:'', fornNome:'', vlUnit:0, qt:'', obs:'' }];
          var qtDistrib = linhas.reduce(function(s,l){ return s+(Number(l.qt)||0); },0);
          var qtOk = qtDistrib > 0 && qtDistrib === ps.qtPend;
          var qtOver = qtDistrib > ps.qtPend;

          return /*#__PURE__*/React.createElement('div', { key:itemId, style:{border:'1px solid #e0e0e0',borderRadius:6,overflow:'hidden',marginBottom:10} },
            // Header do item
            /*#__PURE__*/React.createElement('div', { style:{background:'#f5f0ff',padding:'8px 12px',display:'flex',alignItems:'center',gap:8,borderBottom:'1px solid #e0e0e0'} },
              /*#__PURE__*/React.createElement('span', { style:{background:'#7c3aed',color:'#fff',padding:'2px 8px',borderRadius:99,fontSize:9,fontWeight:'bold'} }, 'ITEM '+item.num),
              /*#__PURE__*/React.createElement('span', { style:{fontWeight:'bold',fontSize:11,flex:1} }, (item.descricao||'') + (item.detalhe?' \u2014 '+item.detalhe:'')),
              modoEdicao && /*#__PURE__*/React.createElement('button', {
                onClick: function(){
                  if(!confirm('Remover "'+item.descricao+'" deste pedido?\n\nA quantidade voltará como pendente no mapa.')) return;
                  onConfig(function(prev){ var n=Object.assign({},prev); delete n[itemId]; return n; });
                },
                title: 'Remover item do pedido',
                style:{background:'#c0392b',color:'#fff',border:'none',borderRadius:4,padding:'2px 8px',cursor:'pointer',fontSize:10,fontWeight:'bold'}
              }, '\u2715 Remover'),
              /*#__PURE__*/React.createElement('span', { style:{background:'#eee',padding:'2px 6px',borderRadius:3,fontSize:9,color:'#666'} }, item.unid||'')
            ),
            // Qt boxes
            /*#__PURE__*/React.createElement('div', { style:{display:'grid',gridTemplateColumns:'repeat(2,1fr)',borderBottom:'1px solid #eee'} },
              [['Qt. Inicial',ps.qtTotal,'#2a5298'],['Qt. Atendida',ps.qtAtendida,'#3B6D11'],['Qt. Pendente',ps.qtPend,'#b06000'],['Tot. Atendida?',ps.qtPend===0?'✅ SIM':'NÃO',ps.qtPend===0?'#3B6D11':'#b06000']].map(function(b,i){
                return /*#__PURE__*/React.createElement('div', { key:i, style:{padding:'6px 10px',textAlign:'center',borderRight:i<3?'1px solid #eee':'none'} },
                  /*#__PURE__*/React.createElement('div', { style:{fontSize:8,color:'#888',textTransform:'uppercase',marginBottom:2} }, b[0]),
                  /*#__PURE__*/React.createElement('div', { style:{fontSize:14,fontWeight:'bold',color:b[2]} }, b[1])
                );
              })
            ),
            // Linhas de fornecedor
            /*#__PURE__*/React.createElement('div', { style:{padding:'10px 12px'} },
              linhas.map(function(linha, idx){
                var forn = (mapa.fornecedores||[]).find(function(f){ return f.id===linha.fornId; });
                var vlFmt = linha.vlUnit ? 'R$ '+fmtBRL(linha.vlUnit) : '—';
                var vlTotal = (Number(linha.vlUnit)||0)*(Number(linha.qt)||0);
                var vlTotalFmt = vlTotal>0 ? '= R$ '+fmtBRL(vlTotal) : '';
                return /*#__PURE__*/React.createElement('div', { key:idx, style:{display:'grid',gridTemplateColumns:'1fr auto auto auto',gap:8,alignItems:'center',marginBottom:6} },
                  /*#__PURE__*/React.createElement('select', {
                    value: linha.fornId||'',
                    onChange: function(e){ updateLinha(itemId, idx, 'fornId', e.target.value); },
                    disabled: modoEdicao,
                    title: modoEdicao ? 'Fornecedor travado durante edição — o pedido pertence a um único fornecedor' : '',
                    style:{padding:'5px 8px',border:'1px solid #ddd',borderRadius:4,fontSize:10,width:'100%',background: modoEdicao ? '#f0f0f0' : '#fff',cursor: modoEdicao ? 'not-allowed' : 'pointer'}
                  },
                    /*#__PURE__*/React.createElement('option', { value:'' }, '— Selecionar fornecedor —'),
                    (mapa.fornecedores||[]).map(function(f){
                      var preco = (mapa.precos||{})[item.id+'_'+f.id];
                      var label = f.nome + (preco ? ' — R$ '+String(preco).replace('.',',') : '');
                      return /*#__PURE__*/React.createElement('option', { key:f.id, value:f.id }, label);
                    })
                  ),
                  /*#__PURE__*/React.createElement('span', { style:{background:'#EAF3DE',color:'#3B6D11',padding:'4px 10px',borderRadius:4,fontSize:10,whiteSpace:'nowrap',fontWeight:'bold',minWidth:80,textAlign:'center'} }, vlFmt),
                  /*#__PURE__*/React.createElement('input', {
                    type:'number', value:linha.qt||'', placeholder:'Qt.',
                    onChange: function(e){ updateLinha(itemId, idx, 'qt', e.target.value); },
                    style:{width:75,padding:'5px 8px',border:'1px solid #7c3aed',borderRadius:4,fontSize:11,textAlign:'center',fontWeight:'bold',color:'#7c3aed'}
                  }),
                  /*#__PURE__*/React.createElement('span', { style:{fontSize:11,fontWeight:'bold',color:'#2a5298',whiteSpace:'nowrap',minWidth:90,textAlign:'right'} }, vlTotalFmt)
                );
              }),
              // Botão add fornecedor
              !modoEdicao && /*#__PURE__*/React.createElement('button', {
                onClick: function(){ addLinha(itemId); },
                style:{background:'#f5f5f5',border:'1px dashed #bbb',color:'#888',padding:'5px 12px',borderRadius:4,fontSize:10,cursor:'pointer',width:'100%',marginTop:4,textAlign:'center'}
              }, '+ adicionar outro fornecedor para este item'),
              // Alerta de quantidade
              qtOver && /*#__PURE__*/React.createElement('div', { style:{fontSize:9,color:'#c0392b',marginTop:4,background:'#FCEBEB',padding:'4px 8px',borderRadius:3} },
                '\u26A0 Qt. distribuída: '+qtDistrib+' — maior que a pendente ('+ps.qtPend+'). Verifique.'
              ),
              qtOk && /*#__PURE__*/React.createElement('div', { style:{fontSize:9,color:'#3B6D11',marginTop:4,background:'#EAF3DE',padding:'4px 8px',borderRadius:3} },
                '\u2714 Qt. distribuída: '+qtDistrib+' de '+ps.qtPend+' pendentes — OK'
              ),
              ps.qtPend===0 && /*#__PURE__*/React.createElement('div', { style:{fontSize:9,color:'#185FA5',marginTop:4,background:'#E6F1FB',padding:'4px 8px',borderRadius:3} },
                '\u2139 Este item já está totalmente atendido (Qt. Pendente = 0). Pedido extra será gerado assim mesmo se configurado.'
              )
            )
          );
        }),
      // ── Observação do Pedido (campo único — Claudio, 05/08) ──────────────
      /*#__PURE__*/React.createElement('div', { style:{border:'1px solid #86efac',borderRadius:6,background:'#f0fdf4',padding:'10px 12px',marginBottom:10} },
        /*#__PURE__*/React.createElement('label', { style:{fontSize:10,color:'#15803d',fontWeight:'bold',textTransform:'uppercase',display:'block',marginBottom:5} },
          '\uD83D\uDCDD Observa\u00E7\u00E3o deste pedido'
        ),
        /*#__PURE__*/React.createElement('textarea', {
          value: obsPedido,
          onChange: function(e){ setObsPedido(e.target.value.toUpperCase()); },
          placeholder:'EX: CONFIRMAR DISPONIBILIDADE ANTES DA ENTREGA...',
          style:{width:'100%',padding:'7px 10px',border:'1px solid #86efac',borderRadius:4,fontSize:10,color:'#333',resize:'vertical',minHeight:48,fontFamily:'Arial,sans-serif',background:'#fff',textTransform:'uppercase'}
        })
      ),
      // ── Seção Financeira por Fornecedor ──────────────────────────────────
      nPOs > 0 && /*#__PURE__*/React.createElement('div', { style:{border:'1px solid #d4b8ff',borderRadius:6,overflow:'hidden',marginBottom:10,background:'#faf7ff'} },
        /*#__PURE__*/React.createElement('div', { style:{background:'#7c3aed',color:'#fff',padding:'8px 12px',fontSize:10,fontWeight:'bold'} },
          '\uD83D\uDCB0 AJUSTES FINANCEIROS POR FORNECEDOR'
        ),
        Array.from(fornIds).map(function(fid){
          var gNome = '';
          Object.keys(config).forEach(function(iid){
            (config[iid]||[]).forEach(function(l){ if(l.fornId===fid && l.fornNome) gNome=l.fornNome; });
          });
          var subtotal = 0;
          Object.keys(config).forEach(function(iid){
            (config[iid]||[]).forEach(function(l){ if(l.fornId===fid) subtotal += (Number(l.vlUnit)||0)*(Number(l.qt)||0); });
          });
          var fin = poFinanceiro[fid]||{};
          var descVal  = parseVal(fin.desconto);  var descMode  = fin.desconto_mode||'%';
          var acrVal   = parseVal(fin.acrescimo); var acrMode   = fin.acrescimo_mode||'%';
          var freteVal = parseVal(fin.frete);     var freteMode = fin.frete_mode||'R$';
          var impVal   = parseVal(fin.impostos);  var impMode   = fin.impostos_mode||'%';
          // FIX: mesmo problema já corrigido antes em calcVL (mapa) — um desconto/acréscimo/frete/
          // imposto digitado com sinal negativo por engano invertia a conta (aumentava o total em
          // vez de diminuir). Math.max(0,...) protege sem mudar o resultado de valores já corretos.
          var vlDesc   = Math.max(0, descMode==='%' ? subtotal*descVal/100 : descVal);
          var vlAcr    = Math.max(0, acrMode==='%'  ? subtotal*acrVal/100  : acrVal);
          var baseImp  = Math.max(0, subtotal - vlDesc + vlAcr); // FIX: nunca deixa a base negativa
          var vlFrete  = Math.max(0, freteMode==='%' ? subtotal*freteVal/100 : freteVal);
          var vlImp    = Math.max(0, impMode==='%'  ? baseImp*impVal/100   : impVal);
          var totalFin = baseImp + vlImp + vlFrete;
          function parseVal(v){ var s=String(v||'').trim().replace(',','.'); var n=parseFloat(s); return isNaN(n)?0:n; }
          function updateFin(field, val){
            onFinanceiro(function(prev){
              var n = Object.assign({}, prev);
              n[fid] = Object.assign({}, n[fid]||{}, _defineProperty({},field,val));
              return n;
            });
          }
          function updateFinMode(field, mode){
            onFinanceiro(function(prev){
              var n = Object.assign({}, prev);
              n[fid] = Object.assign({}, n[fid]||{}, _defineProperty({},field+'_mode',mode));
              return n;
            });
          }
          function fmtR(v){ return 'R$ '+fmtBRL(v); }
          function finInput(label, field, defaultMode){
            var curMode = (poFinanceiro[fid]||{})[field+'_mode']||defaultMode;
            var curVal  = (poFinanceiro[fid]||{})[field]||'';
            return /*#__PURE__*/React.createElement('div', { style:{display:'flex',flexDirection:'column',gap:6,background:'#fff',border:'1px solid #e0d0ff',borderRadius:6,padding:'8px 10px'} },
              /*#__PURE__*/React.createElement('label', { style:{fontSize:9,color:'#5b21b6',textTransform:'uppercase',fontWeight:'bold'} }, label),
              /*#__PURE__*/React.createElement('div', { style:{display:'flex',borderRadius:5,overflow:'hidden',border:'1px solid #7c3aed',marginBottom:4} },
                ['%','R$'].map(function(m){
                  return /*#__PURE__*/React.createElement('button', {
                    key:m,
                    onClick: function(e){ e.preventDefault(); updateFinMode(field,m); },
                    style:{
                      flex:1, padding:'8px 4px', fontSize:11, border:'none',
                      cursor:'pointer', fontWeight:'bold', minHeight:36,
                      background: curMode===m ? '#7c3aed' : '#f5f0ff',
                      color: curMode===m ? '#fff' : '#7c3aed'
                    }
                  }, m);
                })
              ),
              /*#__PURE__*/React.createElement('input', {
                type:'text', inputMode:'decimal',
                value: curVal,
                onChange: function(e){ updateFin(field, e.target.value); },
                placeholder: curMode==='%' ? 'Ex: 10,5' : 'Ex: 14,4564',
                style:{
                  width:'100%', padding:'8px 10px',
                  border:'1px solid #d4b8ff', borderRadius:5,
                  fontSize:14, textAlign:'center', boxSizing:'border-box',
                  minHeight:40
                }
              }),
              curVal && !isNaN(Number(curVal)) && Number(curVal) > 0 && /*#__PURE__*/React.createElement('div', { style:{fontSize:9,color:'#3B6D11',textAlign:'center',fontWeight:'bold'} },
                curMode==='%'
                  ? '= ' + fmtR(subtotal*Number(curVal)/100)
                  : fmtR(Number(curVal))
              )
            );
          }
          return /*#__PURE__*/React.createElement('div', { key:fid, style:{padding:'10px 12px',borderTop:'1px solid #e8e0ff'} },
            /*#__PURE__*/React.createElement('div', { style:{fontWeight:'bold',fontSize:10,color:'#5b21b6',marginBottom:8} },
              gNome + ' — Subtotal: ' + fmtR(subtotal)
            ),
            /*#__PURE__*/React.createElement('div', { style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10} },
              finInput('Desconto','desconto','%'),
              finInput('Acréscimo','acrescimo','%'),
              finInput('Frete','frete','R$'),
              finInput('Impostos','impostos','%')
            ),
            (vlDesc>0||vlAcr>0||vlFrete>0||vlImp>0) && /*#__PURE__*/React.createElement('div', { style:{display:'flex',flexWrap:'wrap',gap:6,fontSize:10,color:'#666',background:'#f0eaff',padding:'8px 10px',borderRadius:5,marginBottom:8} },
              vlDesc>0 && /*#__PURE__*/React.createElement('span', null, '\u2212 Desc: ' + fmtR(vlDesc)),
              vlAcr>0 && /*#__PURE__*/React.createElement('span', null, '+ Acr: ' + fmtR(vlAcr)),
              vlFrete>0 && /*#__PURE__*/React.createElement('span', null, '+ Frete: ' + fmtR(vlFrete)),
              vlImp>0 && /*#__PURE__*/React.createElement('span', null, '+ Imp: ' + fmtR(vlImp))
            ),
            /*#__PURE__*/React.createElement('div', { style:{textAlign:'right',fontWeight:'bold',color:'#2a5298',fontSize:12,marginTop:6} },
              'TOTAL FINAL: ' + fmtR(totalFin)
            )
          );
        })
      )
      ),
      // ─────────────────────────────────────────────────────────────────────
      /*#__PURE__*/React.createElement('div', { style:ftrStyle },
        /*#__PURE__*/React.createElement('span', { style:{flex:1,fontSize:10,color:'#666'} },
          nPOs>0 && /*#__PURE__*/React.createElement(React.Fragment, null, 'Ser\u00E3o gerados ', /*#__PURE__*/React.createElement('strong', {style:{color:'#7c3aed'}}, nPOs), ' pedido(s)')
        ),
                /*#__PURE__*/React.createElement('div', { style:{display:'flex',alignItems:'center',gap:6,background:'#f9f6ff',border:'1px solid #d4b8ff',borderRadius:6,padding:'6px 10px',minWidth:200} },
          /*#__PURE__*/React.createElement('span', { style:{fontSize:10,color:'#7c3aed',whiteSpace:'nowrap',fontWeight:600} }, 'Pgto:'),
          /*#__PURE__*/React.createElement('input', {
            type:'text', value:formaPagamento,
            onChange:function(e){ setFormaPagamento(e.target.value.toUpperCase()); },
            placeholder:'À VISTA, PIX, 30 DIAS...',
            maxLength:80,
            style:{flex:1,border:'none',background:'transparent',fontSize:11,outline:'none',color:'#333',textTransform:'uppercase'}
          })
        ),
        !modoEdicao && /*#__PURE__*/React.createElement('button', { onClick:onVoltar, style:{background:'#2a5298',color:'#fff',border:'none',padding:'8px 16px',borderRadius:4,fontSize:11,cursor:'pointer'} }, '\u2190 Voltar'),
        /*#__PURE__*/React.createElement('button', { onClick:onClose, style:{background:'#f0f0f0',border:'none',padding:'8px 16px',borderRadius:4,fontSize:11,cursor:'pointer'} }, 'Cancelar'),
        /*#__PURE__*/React.createElement('button', {
          onClick: function(){ if(gerando) return; setGerando(true); onGerar(config, poFinanceiro, function(){ setGerando(false); }, formaPagamento, obsPedido); },
          disabled: gerando,
          style:{background: gerando ? '#9d6fe8' : '#7c3aed',color:'#fff',border:'none',padding:'8px 18px',borderRadius:4,fontSize:11,cursor: gerando ? 'not-allowed' : 'pointer',fontWeight:'bold',opacity: gerando ? 0.7 : 1}
        }, gerando ? '\u23F3 Gerando...' : '\uD83D\uDED2 Gerar Pedidos')
      )
    )
  );
}

// ─── V4 CSS — Tela Pedidos ──────────────────────────────────────────────────
function TelaPedidos(_ref_tp) {
  var pedidos=_ref_tp.pedidos, mapa=_ref_tp.mapa, obras=_ref_tp.obras||[], itensDoMapa=_ref_tp.itensDoMapa||[], itensAtendidosMap=_ref_tp.itensAtendidosMap||{}, onClose=_ref_tp.onClose, onRefresh=_ref_tp.onRefresh;
  var onUpdateStatus=_ref_tp.onUpdateStatus, onPDF=_ref_tp.onPDF, onEditarPedido=_ref_tp.onEditarPedido||function(){};

  var _sF=useState({obra:[],de:'',ate:'',insumo:[],fornecedor:[],status:[]}),filtros=_slicedToArray(_sF,2)[0],setFiltros=_slicedToArray(_sF,2)[1];
  var _sRM=useState(false),showRelModal=_slicedToArray(_sRM,2)[0],setShowRelModal=_slicedToArray(_sRM,2)[1];
  var _sRF=useState({obra:[],de:'',ate:'',insumo:[],status:[]}),relFiltros=_slicedToArray(_sRF,2)[0],setRelFiltros=_slicedToArray(_sRF,2)[1];

  var statusCores = { rascunho:{bg:'#f0f0f0',c:'#666'}, emitido:{bg:'#E6F1FB',c:'#185FA5'}, recebido:{bg:'#EAF3DE',c:'#3B6D11'}, cancelado:{bg:'#FCEBEB',c:'#A32D2D'} };
  var statusLabel = { rascunho:'Rascunho', emitido:'Emitido', recebido:'Recebido', cancelado:'Cancelado' };
  var statusOpcoes = ['rascunho','emitido','recebido','cancelado'];

  // FIX: listas \u00danicas derivadas dos PEDIDOS de verdade (n\u00e3o de todo o cadastro do sistema)
  var obrasComPedido = Array.from(new Set((pedidos||[]).map(function(p){ return p.obra; }).filter(Boolean))).sort();
  var fornecedoresComPedido = Array.from(new Set((pedidos||[]).map(function(p){ return p.fornecedor_nome; }).filter(Boolean))).sort();
  var insumosComPedido = Array.from(new Set((pedidos||[]).reduce(function(acc,p){
    (p.itens||[]).forEach(function(it){ if(it.descricao) acc.push(it.descricao); });
    return acc;
  }, []))).sort();

  var _sDrop = useState(null), dropdownAberto = _slicedToArray(_sDrop,2)[0], setDropdownAberto = _slicedToArray(_sDrop,2)[1];
  var _sBuscaDrop = useState({}), buscaDropdown = _slicedToArray(_sBuscaDrop,2)[0], setBuscaDropdown = _slicedToArray(_sBuscaDrop,2)[1];
  var dropRefAtual = useRef(null);

  // FIX: fecha o painel aberto ao clicar fora dele (em qualquer lugar da tela)
  useEffect(function(){
    function aoClicarFora(e){
      if (dropRefAtual.current && !dropRefAtual.current.contains(e.target)) {
        setDropdownAberto(null);
      }
    }
    document.addEventListener('mousedown', aoClicarFora);
    return function(){ document.removeEventListener('mousedown', aoClicarFora); };
  }, []);

  // Componente reutiliz\u00e1vel: bot\u00e3o + painel de m\u00faltipla sele\u00e7\u00e3o, usado nos dois lugares (barra principal e modal de relat\u00f3rio)
  function multiSelect(config) {
    var chave = config.chave, opcoes = config.opcoes||[], selecionados = config.selecionados||[], aoMudar = config.aoMudar, comBusca = config.comBusca, labelPlural = config.labelPlural||'os';
    var aberto = dropdownAberto === chave;
    var termoBusca = buscaDropdown[chave]||'';
    var opcoesFiltradas = (comBusca && termoBusca) ? opcoes.filter(function(o){ return o.toUpperCase().indexOf(termoBusca.toUpperCase())>=0; }) : opcoes;
    var qtd = selecionados.filter(function(s){ return opcoes.indexOf(s) >= 0; }).length;
    var textoBotao = qtd===0 ? 'Todos' : (qtd+' selecionado'+(qtd===1?'':'s'));
    return /*#__PURE__*/React.createElement('div', {
      style:{display:'flex',flexDirection:'column',gap:3,position:'relative'},
      ref: function(el){ if(aberto) dropRefAtual.current = el; }
    },
      /*#__PURE__*/React.createElement('label', { style:{fontSize:8,color:'#888',textTransform:'uppercase',fontWeight:'bold'} }, config.label),
      /*#__PURE__*/React.createElement('div', {
        onClick: function(){ setDropdownAberto(aberto ? null : chave); },
        style:{padding:'5px 8px',border:'1px solid #ddd',borderRadius:4,fontSize:10,minWidth:config.minWidth||140,background:'#fff',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center',gap:6,whiteSpace:'nowrap'}
      }, textoBotao, /*#__PURE__*/React.createElement('span',null,'\u25be')),
      aberto && /*#__PURE__*/React.createElement('div', {
        onClick: function(e){ e.stopPropagation(); },
        style:{position:'absolute',top:'calc(100% + 4px)',left:0,background:'#fff',border:'1px solid #ccc',borderRadius:6,boxShadow:'0 4px 14px rgba(0,0,0,.15)',padding:8,zIndex:50,minWidth:200,maxHeight:230,overflowY:'auto'}
      },
        comBusca && /*#__PURE__*/React.createElement('input', {
          value: termoBusca,
          onChange: function(e){ setBuscaDropdown(function(prev){ return Object.assign({},prev,_defineProperty({},chave,e.target.value)); }); },
          placeholder: 'Buscar...',
          style:{padding:'5px 6px',border:'1px solid #ddd',borderRadius:4,fontSize:10,width:'100%',boxSizing:'border-box',marginBottom:6}
        }),
        opcoesFiltradas.length===0 && /*#__PURE__*/React.createElement('div', { style:{fontSize:10,color:'#999',padding:'4px 6px'} }, 'Nenhuma op\u00e7\u00e3o encontrada.'),
        opcoesFiltradas.map(function(op){
          var marcado = selecionados.indexOf(op) >= 0;
          return /*#__PURE__*/React.createElement('div', {
            key: op,
            onClick: function(e){
              e.stopPropagation();
              var novo = marcado ? selecionados.filter(function(x){ return x!==op; }) : selecionados.concat([op]);
              aoMudar(novo);
            },
            style:{display:'flex',alignItems:'center',gap:7,padding:'5px 6px',fontSize:11,borderRadius:4,cursor:'pointer'}
          },
            /*#__PURE__*/React.createElement('input',{type:'checkbox',checked:marcado,readOnly:true}),
            config.rotulos ? (config.rotulos[op]||op) : op
          );
        }),
        opcoes.length>0 && /*#__PURE__*/React.createElement('div', {
          onClick: function(e){
            e.stopPropagation();
            var todasFiltradasJaMarcadas = opcoesFiltradas.length>0 && opcoesFiltradas.every(function(o){ return selecionados.indexOf(o)>=0; });
            if (todasFiltradasJaMarcadas) {
              aoMudar(selecionados.filter(function(s){ return opcoesFiltradas.indexOf(s)<0; }));
            } else {
              var novoSet = selecionados.slice();
              opcoesFiltradas.forEach(function(o){ if(novoSet.indexOf(o)<0) novoSet.push(o); });
              aoMudar(novoSet);
            }
          },
          style:{display:'flex',alignItems:'center',gap:7,padding:'5px 6px',fontSize:11,borderRadius:4,cursor:'pointer',borderTop:'1px solid #eee',marginTop:4,paddingTop:4,color:'#5b3fa0',fontWeight:'bold'}
        },
          /*#__PURE__*/React.createElement('input',{type:'checkbox',checked:opcoesFiltradas.length>0 && opcoesFiltradas.every(function(o){ return selecionados.indexOf(o)>=0; }),readOnly:true}),
          'Marcar tod'+labelPlural
        ),
        /*#__PURE__*/React.createElement('button', {
          onClick: function(){ setDropdownAberto(null); },
          style:{width:'100%',marginTop:6,padding:6,background:'#0e7a5f',color:'#fff',border:'none',borderRadius:4,fontSize:10,fontWeight:'bold',cursor:'pointer'}
        }, '\u2713 Conclu\u00eddo')
      )
    );
  }

  var pedidosFiltrados = (pedidos||[]).filter(function(po){
    if (filtros.status.length && filtros.status.indexOf(po.status) < 0) return false;
    if (filtros.obra.length && filtros.obra.indexOf(po.obra) < 0) return false;
    if (filtros.fornecedor.length && filtros.fornecedor.indexOf(po.fornecedor_nome) < 0) return false;
    if (filtros.insumo.length) {
      var hasInsumo = (po.itens||[]).some(function(it){ return filtros.insumo.indexOf(it.descricao) >= 0; });
      if (!hasInsumo) return false;
    }
    if (filtros.de || filtros.ate) {
      var dtPO = new Date((po.data_emissao||po.criado_em||'').length===10?(po.data_emissao||po.criado_em)+'T12:00:00':(po.data_emissao||po.criado_em));
      if (isNaN(dtPO.getTime())) return false;
      if (filtros.de && dtPO < new Date(filtros.de+'T00:00:00')) return false;
      if (filtros.ate && dtPO > new Date(filtros.ate+'T23:59:59')) return false;
    }
    return true;
  });

  // KPIs refletem SOMENTE os pedidos filtrados atualmente visíveis na tabela
  var kpis = {
    total: pedidosFiltrados.length,
    valor: pedidosFiltrados.filter(function(p){ return p.status!=='cancelado'; }).reduce(function(s,p){ return s+Number(p.total||0); },0),
    recebidos: pedidosFiltrados.filter(function(p){ return p.status==='recebido'; }).length,
    pendentes: pedidosFiltrados.filter(function(p){ return p.status==='rascunho'||p.status==='emitido'; }).length,
    cancelados: pedidosFiltrados.filter(function(p){ return p.status==='cancelado'; }).length
  };

  var ovStyle = { position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.55)',zIndex:9000,display:'flex',alignItems:'center',justifyContent:'center',padding:12,overscrollBehavior:'none' };
  var modalStyle = { background:'#fff',borderRadius:8,overflow:'hidden',width:'100%',maxWidth:900,maxHeight:'94vh',display:'flex',flexDirection:'column',boxShadow:'0 8px 32px rgba(0,0,0,0.3)' };

  function fInput(label, field) {
    return /*#__PURE__*/React.createElement('div', { style:{display:'flex',flexDirection:'column',gap:3} },
      /*#__PURE__*/React.createElement('label', { style:{fontSize:8,color:'#888',textTransform:'uppercase',fontWeight:'bold'} }, label),
      /*#__PURE__*/React.createElement('input', { type:'text', value:filtros[field]||'', placeholder:'Todos',
        onChange: function(e){ setFiltros(function(prev){ return Object.assign({},prev,_defineProperty({},field,e.target.value)); }); },
        style:{padding:'5px 8px',border:'1px solid #ddd',borderRadius:4,fontSize:10,minWidth:110} })
    );
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null,
  /*#__PURE__*/React.createElement('div', { style:ovStyle },
    /*#__PURE__*/React.createElement('div', { style:modalStyle },
      // Header
      /*#__PURE__*/React.createElement('div', { style:{background:'#7c3aed',color:'#fff',padding:'10px 14px',display:'flex',alignItems:'center',justifyContent:'space-between'} },
        /*#__PURE__*/React.createElement('div', null,
          /*#__PURE__*/React.createElement('div', { style:{fontSize:13,fontWeight:'bold'} }, '\uD83D\uDED2 PEDIDOS DE COMPRA — MAPACOT V4 CSS'),
          /*#__PURE__*/React.createElement('div', { style:{fontSize:9,opacity:.85,marginTop:2} }, 'Controle completo \u00B7 Por obra \u00B7 Por per\u00EDodo \u00B7 Por insumo')
        ),
        /*#__PURE__*/React.createElement('div', { style:{display:'flex',gap:8,alignItems:'center'} },
          /*#__PURE__*/React.createElement('button', { onClick:function(){ setRelFiltros({obra:[],de:'',ate:'',insumo:[],status:[]}); setShowRelModal(true); }, style:{background:'rgba(255,255,255,.2)',border:'none',color:'#fff',padding:'5px 12px',borderRadius:4,fontSize:10,cursor:'pointer'} }, 'Relatorio PDF'), /*#__PURE__*/React.createElement('button', { onClick:onRefresh, style:{background:'rgba(255,255,255,.2)',border:'none',color:'#fff',padding:'5px 12px',borderRadius:4,fontSize:10,cursor:'pointer'} }, '\uD83D\uDD04 Atualizar'),
          /*#__PURE__*/React.createElement('span', { onClick:onClose, style:{cursor:'pointer',fontSize:18,opacity:.8} }, '\u2715')
        )
      ),
      // Filtros
      /*#__PURE__*/React.createElement('div', { style:{display:'flex',gap:8,padding:'10px 14px',background:'#f5f5f5',borderBottom:'1px solid #eee',flexWrap:'wrap',alignItems:'flex-start'} },
        multiSelect({ chave:'principal_obra', label:'Obra', opcoes:obrasComPedido, selecionados:filtros.obra, comBusca:obrasComPedido.length>8, minWidth:150, labelPlural:'as',
          aoMudar:function(novo){ setFiltros(function(prev){ return Object.assign({},prev,{obra:novo}); }); } }),
        multiSelect({ chave:'principal_insumo', label:'Insumo', opcoes:insumosComPedido, selecionados:filtros.insumo, comBusca:true, labelPlural:'os',
          aoMudar:function(novo){ setFiltros(function(prev){ return Object.assign({},prev,{insumo:novo}); }); } }),
        multiSelect({ chave:'principal_fornecedor', label:'Fornecedor', opcoes:fornecedoresComPedido, selecionados:filtros.fornecedor, comBusca:fornecedoresComPedido.length>8, labelPlural:'os',
          aoMudar:function(novo){ setFiltros(function(prev){ return Object.assign({},prev,{fornecedor:novo}); }); } }),
        /*#__PURE__*/React.createElement('div', { style:{display:'flex',flexDirection:'column',gap:3} },
          /*#__PURE__*/React.createElement('label', { style:{fontSize:8,color:'#888',textTransform:'uppercase',fontWeight:'bold'} }, 'Per\u00EDodo De'),
          /*#__PURE__*/React.createElement('input', { type:'date', value:filtros.de||'',
            onChange:function(e){ setFiltros(function(prev){ return Object.assign({},prev,{de:e.target.value}); }); },
            style:{padding:'5px 8px',border:'1px solid #ddd',borderRadius:4,fontSize:10,minWidth:110} })
        ),
        /*#__PURE__*/React.createElement('div', { style:{display:'flex',flexDirection:'column',gap:3} },
          /*#__PURE__*/React.createElement('label', { style:{fontSize:8,color:'#888',textTransform:'uppercase',fontWeight:'bold'} }, 'At\u00E9'),
          /*#__PURE__*/React.createElement('input', { type:'date', value:filtros.ate||'',
            onChange:function(e){ setFiltros(function(prev){ return Object.assign({},prev,{ate:e.target.value}); }); },
            style:{padding:'5px 8px',border:'1px solid #ddd',borderRadius:4,fontSize:10,minWidth:110} })
        ),
        multiSelect({ chave:'principal_status', label:'Status', opcoes:statusOpcoes, selecionados:filtros.status, rotulos:statusLabel, labelPlural:'os',
          aoMudar:function(novo){ setFiltros(function(prev){ return Object.assign({},prev,{status:novo}); }); } })
      ),
      // KPIs
      /*#__PURE__*/React.createElement('div', { style:{display:'grid',gridTemplateColumns:'repeat(5,1fr)',borderBottom:'1px solid #eee'} },
        [['Total POs',kpis.total,'#2a5298'],['Valor total','R$ '+fmtBRL(kpis.valor),'#7c3aed'],['Recebidos',kpis.recebidos,'#3B6D11'],['Pendentes',kpis.pendentes,'#b06000'],['Cancelados',kpis.cancelados,'#c0392b']].map(function(k,i){
          return /*#__PURE__*/React.createElement('div', { key:i, style:{padding:'8px 10px',textAlign:'center',borderRight:i<4?'1px solid #eee':'none',background:'#f9f9f9'} },
            /*#__PURE__*/React.createElement('div', { style:{fontSize:8,color:'#888',textTransform:'uppercase',marginBottom:3} }, k[0]),
            /*#__PURE__*/React.createElement('div', { style:{fontSize:15,fontWeight:'bold',color:k[2]} }, k[1])
          );
        })
      ),
      // Tabela
      /*#__PURE__*/React.createElement('div', { style:{overflowY:'auto',flex:1} },
        pedidosFiltrados.length===0
          ? /*#__PURE__*/React.createElement('div', { style:{padding:40,textAlign:'center',color:'#888',fontSize:12} }, 'Nenhum pedido encontrado.')
          : /*#__PURE__*/React.createElement('table', { style:{width:'100%',borderCollapse:'collapse',fontSize:10} },
            /*#__PURE__*/React.createElement('thead', null,
              /*#__PURE__*/React.createElement('tr', null,
                ['Nº PO','Obra','Fornecedor','Insumo / Detalhe','Qt.Ini','Qt.Atend','Qt.Pend','Tot.Atend','Valor','Status','Pgto','Ações'].map(function(h,i){
                  return /*#__PURE__*/React.createElement('th', { key:i, style:{background:'#7c3aed',color:'#fff',padding:'6px 8px',fontSize:9,textAlign:i>3&&i<8?'center':i>7&&i<10?'right':'left',whiteSpace:'nowrap'} }, h);
                })
              )
            ),
            /*#__PURE__*/React.createElement('tbody', null,
              pedidosFiltrados.map(function(po, ri){
                var num = 'PO-'+String(po.numero).padStart(3,'0');
                var sc = statusCores[po.status]||statusCores.rascunho;
                var itensPO = po.itens||[];
                // Qt por item — sumar tudo do PO
                var qtPedida = itensPO.reduce(function(s,i){ return s+Number(i.qt_pedida||0); },0);
                var qtIni = qtPedida;
                var descPrincipal = itensPO.length>0?itensPO[0].descricao:po.fornecedor_nome;
                var detPrincipal = itensPO.length>0?itensPO[0].detalhe:'';
                var totalFmt = 'R$ '+fmtBRL(po.total);
                return /*#__PURE__*/React.createElement('tr', { key:po.id, style:{background:ri%2===0?'#fff':'#f9f9f9',opacity:po.status==='cancelado'?.55:1} },
                  /*#__PURE__*/React.createElement('td', { style:{padding:'6px 8px',textAlign:'center',fontWeight:'bold',color:'#7c3aed',borderBottom:'1px solid #eee'} }, num),
                  /*#__PURE__*/React.createElement('td', { style:{padding:'6px 8px',fontSize:9,borderBottom:'1px solid #eee'} }, po.obra||''),
                  /*#__PURE__*/React.createElement('td', { style:{padding:'6px 8px',fontSize:9,borderBottom:'1px solid #eee'} }, po.fornecedor_nome||''),
                  /*#__PURE__*/React.createElement('td', { style:{padding:'6px 8px',borderBottom:'1px solid #eee'} },
                    /*#__PURE__*/React.createElement('strong', { style:{fontSize:10} }, descPrincipal),
                    detPrincipal&&/*#__PURE__*/React.createElement('div', { style:{fontSize:8,color:'#888'} }, detPrincipal)
                  ),
                  /*#__PURE__*/React.createElement('td', { style:{padding:'6px 8px',textAlign:'center',borderBottom:'1px solid #eee'} }, itensPO.length),
                  /*#__PURE__*/React.createElement('td', { style:{padding:'6px 8px',textAlign:'center',color:'#3B6D11',fontWeight:'bold',borderBottom:'1px solid #eee'} }, po.status==='recebido'?qtPedida:0),
                  /*#__PURE__*/React.createElement('td', { style:{padding:'6px 8px',textAlign:'center',color:po.status==='recebido'?'#3B6D11':'#b06000',fontWeight:'bold',borderBottom:'1px solid #eee'} }, po.status==='recebido'?0:qtPedida),
                  /*#__PURE__*/React.createElement('td', { style:{padding:'6px 8px',textAlign:'center',borderBottom:'1px solid #eee'} },
                    /*#__PURE__*/React.createElement('span', { style:{fontSize:10,color:po.status==='recebido'?'#3B6D11':'#b06000',fontWeight:'bold'} }, po.status==='recebido'?'✅ SIM':'NÃO')
                  ),
                  /*#__PURE__*/React.createElement('td', { style:{padding:'6px 8px',textAlign:'right',borderBottom:'1px solid #eee'} },
                    totalFmt,
                    po.observacao&&/*#__PURE__*/React.createElement('span', { title:po.observacao, style:{background:'#f0eaff',color:'#7c3aed',padding:'1px 6px',borderRadius:99,fontSize:8,fontWeight:'bold',marginLeft:4,cursor:'help'} }, '\uD83D\uDCDD')
                  ),
                  /*#__PURE__*/React.createElement('td', { style:{padding:'6px 8px',borderBottom:'1px solid #eee'} },
                    /*#__PURE__*/React.createElement('span', { style:{background:sc.bg,color:sc.c,padding:'2px 8px',borderRadius:99,fontSize:9,fontWeight:'bold'} }, statusLabel[po.status]||po.status)
                  ),
                  /*#__PURE__*/React.createElement('td', { style:{padding:'6px 8px',fontSize:9,color:'#5b21b6',borderBottom:'1px solid #eee',maxWidth:80,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'} }, po.forma_pagamento||''),
                  /*#__PURE__*/React.createElement('td', { style:{padding:'6px 8px',borderBottom:'1px solid #eee'} },
                    /*#__PURE__*/React.createElement('div', { style:{display:'flex',gap:4} },
                      /*#__PURE__*/React.createElement('button', { onClick:function(){ onPDF(po); }, style:{background:'#c0392b',color:'#fff',border:'none',padding:'3px 8px',borderRadius:3,fontSize:9,cursor:'pointer',fontWeight:'bold'} }, 'PDF'),
                      (po.status==='rascunho'||po.status==='emitido')&&/*#__PURE__*/React.createElement('button', { onClick:function(){ onEditarPedido(po); }, style:{background:'#7c3aed',color:'#fff',border:'none',padding:'3px 8px',borderRadius:3,fontSize:9,cursor:'pointer',fontWeight:'bold'} }, 'Editar'),
                      po.status==='rascunho'&&/*#__PURE__*/React.createElement('button', { onClick:function(){ onUpdateStatus(po.id,'emitido',po.status); }, style:{background:'#185FA5',color:'#fff',border:'none',padding:'3px 8px',borderRadius:3,fontSize:9,cursor:'pointer'} }, 'Emitir'),
                      po.status==='emitido'&&/*#__PURE__*/React.createElement('button', { onClick:function(){ onUpdateStatus(po.id,'recebido',po.status); }, style:{background:'#3B6D11',color:'#fff',border:'none',padding:'3px 8px',borderRadius:3,fontSize:9,cursor:'pointer'} }, 'Receber'),
                      po.status==='recebido'&&/*#__PURE__*/React.createElement('button', { onClick:function(){ if(confirm('Desfazer recebimento de PO-'+String(po.numero).padStart(3,'0')+'?\nO pedido voltará para status Emitido.')) onUpdateStatus(po.id,'emitido',po.status); }, style:{background:'#b06000',color:'#fff',border:'none',padding:'3px 8px',borderRadius:3,fontSize:9,cursor:'pointer'} }, '\u21A9 Desfazer'),
                      (po.status==='rascunho'||po.status==='emitido')&&/*#__PURE__*/React.createElement('button', { onClick:function(){ if(confirm('Cancelar PO-'+String(po.numero).padStart(3,'0')+'?')) onUpdateStatus(po.id,'cancelado'); }, style:{background:'#f0f0f0',color:'#666',border:'none',padding:'3px 8px',borderRadius:3,fontSize:9,cursor:'pointer'} }, '\u2715')
                    )
                  )
                );
              })
            )
          )
      )
    )
  ),
  showRelModal && /*#__PURE__*/React.createElement('div', {
    style:{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.6)',zIndex:10000,display:'flex',alignItems:'center',justifyContent:'center',padding:12,overscrollBehavior:'none'}
  },
    /*#__PURE__*/React.createElement('div', {
      style:{background:'#fff',borderRadius:8,overflow:'hidden',width:'100%',maxWidth:500,boxShadow:'0 8px 32px rgba(0,0,0,0.3)',maxHeight:'90vh',display:'flex',flexDirection:'column'}
    },
      /*#__PURE__*/React.createElement('div', { style:{background:'#7c3aed',color:'#fff',padding:'12px 16px',display:'flex',justifyContent:'space-between',alignItems:'center',flexShrink:0} },
        /*#__PURE__*/React.createElement('div', null,
          /*#__PURE__*/React.createElement('div', { style:{fontWeight:'bold',fontSize:13} }, 'GERAR RELATORIO PDF'),
          /*#__PURE__*/React.createElement('div', { style:{fontSize:9,opacity:.85,marginTop:2} }, 'Escolha os filtros - deixe em branco para incluir tudo')
        ),
        /*#__PURE__*/React.createElement('span', { onClick:function(){ setShowRelModal(false); }, style:{cursor:'pointer',fontSize:18,opacity:.8} }, 'X')
      ),
      /*#__PURE__*/React.createElement('div', { style:{padding:16,display:'flex',flexDirection:'column',gap:12,overflowY:'auto',flex:1,overscrollBehavior:'contain'} },
        /*#__PURE__*/React.createElement('div', { style:{display:'flex',flexDirection:'column',gap:4} },
          /*#__PURE__*/React.createElement('label', { style:{fontSize:9,color:'#5b21b6',textTransform:'uppercase',fontWeight:'bold'} }, 'Obra'),
          multiSelect({ chave:'rel_obra', label:'', opcoes:obrasComPedido, selecionados:relFiltros.obra, comBusca:obrasComPedido.length>8, minWidth:'100%', labelPlural:'as',
            aoMudar:function(novo){ setRelFiltros(function(p){ return Object.assign({},p,{obra:novo}); }); } })
        ),
        /*#__PURE__*/React.createElement('div', { style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8} },
          /*#__PURE__*/React.createElement('div', { style:{display:'flex',flexDirection:'column',gap:4} },
            /*#__PURE__*/React.createElement('label', { style:{fontSize:9,color:'#5b21b6',textTransform:'uppercase',fontWeight:'bold'} }, 'Periodo De'),
            /*#__PURE__*/React.createElement('input', { type:'date',value:relFiltros.de||'', onChange:function(e){ setRelFiltros(function(p){ return Object.assign({},p,{de:e.target.value}); }); }, style:{padding:'8px 10px',border:'1px solid #d4b8ff',borderRadius:5,fontSize:11,width:'100%',minHeight:40} })
          ),
          /*#__PURE__*/React.createElement('div', { style:{display:'flex',flexDirection:'column',gap:4} },
            /*#__PURE__*/React.createElement('label', { style:{fontSize:9,color:'#5b21b6',textTransform:'uppercase',fontWeight:'bold'} }, 'Ate'),
            /*#__PURE__*/React.createElement('input', { type:'date',value:relFiltros.ate||'', onChange:function(e){ setRelFiltros(function(p){ return Object.assign({},p,{ate:e.target.value}); }); }, style:{padding:'8px 10px',border:'1px solid #d4b8ff',borderRadius:5,fontSize:11,width:'100%',minHeight:40} })
          )
        ),
        /*#__PURE__*/React.createElement('div', { style:{display:'flex',flexDirection:'column',gap:4} },
          /*#__PURE__*/React.createElement('label', { style:{fontSize:9,color:'#5b21b6',textTransform:'uppercase',fontWeight:'bold'} }, 'Insumo'),
          multiSelect({ chave:'rel_insumo', label:'', opcoes:insumosComPedido, selecionados:relFiltros.insumo, comBusca:true, minWidth:'100%', labelPlural:'os',
            aoMudar:function(novo){ setRelFiltros(function(p){ return Object.assign({},p,{insumo:novo}); }); } })
        ),
        /*#__PURE__*/React.createElement('div', { style:{display:'flex',flexDirection:'column',gap:4} },
          /*#__PURE__*/React.createElement('label', { style:{fontSize:9,color:'#5b21b6',textTransform:'uppercase',fontWeight:'bold'} }, 'Status'),
          multiSelect({ chave:'rel_status', label:'', opcoes:statusOpcoes, selecionados:relFiltros.status, rotulos:statusLabel, minWidth:'100%', labelPlural:'os',
            aoMudar:function(novo){ setRelFiltros(function(p){ return Object.assign({},p,{status:novo}); }); } })
        )
      ),
      /*#__PURE__*/React.createElement('div', { style:{padding:'12px 16px',borderTop:'1px solid #eee',display:'flex',gap:8,justifyContent:'flex-end',flexShrink:0} },
        /*#__PURE__*/React.createElement('button', { onClick:function(){ setShowRelModal(false); }, style:{background:'#f0f0f0',border:'none',padding:'8px 16px',borderRadius:4,fontSize:11,cursor:'pointer'} },'Cancelar'),
        /*#__PURE__*/React.createElement('button', {
          onClick:function(){
            var ped=(pedidos||[]).filter(function(po){
              if(relFiltros.obra.length && relFiltros.obra.indexOf(po.obra) < 0) return false;
              if(relFiltros.status.length && relFiltros.status.indexOf(po.status) < 0) return false;
              if(relFiltros.insumo.length){ var has=(po.itens||[]).some(function(it){ return relFiltros.insumo.indexOf(it.descricao) >= 0; }); if(!has) return false; }
              if(relFiltros.de||relFiltros.ate){
                // FIX: mesmo bug de fuso horário já corrigido no filtro principal da tela — sem isso,
                // uma data salva só como "AAAA-MM-DD" virava meia-noite UTC, que em fusos negativos
                // (ex: Acre, UTC-5) aparecia como o DIA ANTERIOR, incluindo/excluindo pedidos errados
                // do relatório filtrado por período.
                var dataBrutaPO = po.data_emissao||po.criado_em||'';
                var dt=new Date(dataBrutaPO.length===10 ? dataBrutaPO+'T12:00:00' : dataBrutaPO);
                if(isNaN(dt.getTime())) return false; if(relFiltros.de && dt<new Date(relFiltros.de+'T00:00:00')) return false; if(relFiltros.ate && dt>new Date(relFiltros.ate+'T23:59:59')) return false;
              }
              return true;
            });
            setShowRelModal(false);
            logEventoDiag("RELAT\u00d3RIO DE PEDIDOS gerado: " + ped.length + " pedido(s)" + (relFiltros.obra.length ? " \u2014 obra(s): " + relFiltros.obra.join(", ") : "") + (relFiltros.status.length ? " \u2014 status: " + relFiltros.status.join(", ") : ""));
            abrirPDF(buildRelatorioPDF(ped, relFiltros, itensDoMapa, itensAtendidosMap));
          },
          style:{background:'#7c3aed',color:'#fff',border:'none',padding:'8px 18px',borderRadius:4,fontSize:11,cursor:'pointer',fontWeight:'bold'}
        },'Gerar Relatorio PDF')
      )
    )
  )
  );
}

// ─── Modal Casar Insumos ────────────────────────────────────────────────────
