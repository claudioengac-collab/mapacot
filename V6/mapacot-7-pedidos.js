function ModalPedidoStep1(_ref_po1) {
  var mapa=_ref_po1.mapa, itens=_ref_po1.itens, pedidos=_ref_po1.pedidos, itensSelecionados=_ref_po1.itensSelecionados;
  var onToggle=_ref_po1.onToggle, onToggleAll=_ref_po1.onToggleAll, onClose=_ref_po1.onClose, onContinuar=_ref_po1.onContinuar;
  // FIX (implementação alinhada com layout aprovado pelo Claudio — situação 1, opção C): mapas
  // da mesma obra disponíveis para trazer itens, e os que já foram adicionados à seleção atual.
  var mapasDaMesmaObra = _ref_po1.mapasDaMesmaObra||[];
  var mapasAdicionaisPO = _ref_po1.mapasAdicionaisPO||[];
  var onAdicionarMapa = _ref_po1.onAdicionarMapa||function(){};
  var onRemoverMapa = _ref_po1.onRemoverMapa||function(){};
  var _sMostrarSeletor = useState(false), mostrarSeletorMapa = _slicedToArray(_sMostrarSeletor,2)[0], setMostrarSeletorMapa = _slicedToArray(_sMostrarSeletor,2)[1];

  // Calcular status de PO por item
  var poStatus = {};
  (itens||[]).forEach(function(item){
    // FIX (implementação alinhada com layout aprovado): removida a exigência de
    // "po.mapa_id===mapa.id" — antes disso fazia sentido porque cada item só podia vir do mapa
    // aberto, mas agora um item pode ter sido incluído num pedido cujo mapa ÂNCORA é outro. Como
    // "item.id" já é um identificador único gerado por mapa (nunca colide entre mapas
    // diferentes), buscar só por ele é suficiente e correto — sem essa mudança, pedidos de itens
    // trazidos de outro mapa apareceriam incorretamente como "sem pedido".
    var posdoItem = (pedidos||[]).filter(function(po){
      return (po.itens||[]).some(function(it){ return it.item_id===item.id; }) && po.status!=='cancelado';
    });
    var qtTotal = parseNumBR(item.qt)||0;
    var qtPedida = 0;
    var qtAtendida = 0;
    posdoItem.forEach(function(po){
      var it = (po.itens||[]).find(function(i){ return i.item_id===item.id; });
      if (it) {
        qtPedida += Number(it.qt_pedida)||0;
        if (po.status==='recebido') qtAtendida += Number(it.qt_pedida)||0;
      }
    });
    // Almoxarifado (derivado, só leitura): cobre o total junto com os pedidos.
    var qtAlmox = Number(item._qtAlmox)||0;
    var cob = qtPedida + qtAlmox;
    poStatus[item.id] = { qtTotal:qtTotal, qtPedida:qtPedida, qtAtendida:qtAtendida, qtAlmox:qtAlmox,
      label: cob===0?'SEM PEDIDO': cob>=qtTotal?'ATENDIDO':'PARCIAL',
      color: cob===0?'#999': cob>=qtTotal?'#3B6D11':'#185FA5',
      bg: cob===0?'#f0f0f0': cob>=qtTotal?'#EAF3DE':'#E6F1FB'
    };
  });

  // Disponível para pedir = total − já pedido − almoxarifado (nunca negativo). Item com disponível 0
  // não pode entrar em um novo pedido (a caixinha fica desabilitada).
  function pendDe(item){
    var ps0 = poStatus[item.id]||{};
    return Math.max(0, Math.round(((parseNumBR(item.qt)||0) - (ps0.qtPedida||0) - (ps0.qtAlmox||0))*1000)/1000);
  }
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
  // FIX (implementação alinhada com layout aprovado — situação 1, opção C): agrupa os itens
  // filtrados por mapa de origem, com o mapa aberto agora sempre em primeiro lugar (é o caso
  // mais comum e o que o usuário já está olhando), seguido dos demais em ordem de número.
  // Quando não há nenhum mapa adicional selecionado (o caso mais comum, um só mapa), este
  // agrupamento resulta em um único grupo — visualmente quase idêntico ao comportamento antigo.
  var gruposPorMapa = {};
  itensFiltrados.forEach(function(item){
    var k = item._mapaOrigemId || (mapa && mapa.id) || 'sem-mapa';
    if (!gruposPorMapa[k]) gruposPorMapa[k] = { mapaId:k, numero: item._mapaOrigemNumero, itens: [] };
    gruposPorMapa[k].itens.push(item);
  });
  var listaGrupos = Object.values(gruposPorMapa).sort(function(a,b){
    if (mapa && a.mapaId===mapa.id) return -1;
    if (mapa && b.mapaId===mapa.id) return 1;
    return (a.numero||0) - (b.numero||0);
  });
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
                  checked: itensFiltrados.filter(function(i){ return pendDe(i)>0; }).length>0 && itensFiltrados.filter(function(i){ return pendDe(i)>0; }).every(function(i){ return itensSelecionados.indexOf(i.id)>=0; }),
                  onChange: function(e){
                    var ids = itensFiltrados.filter(function(i){ return pendDe(i)>0; }).map(function(i){ return i.id; });
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
              ['ITEM','DESCRIÇÃO / DETALHE','QT. TOTAL','JÁ PEDIDA','ALMOX.','PENDENTE','PO STATUS'].map(function(h,i){
                return /*#__PURE__*/React.createElement('th', { key:i, style:Object.assign({},thStyle,{textAlign:i>1?'center':'left'}) }, h);
              })
            )
          ),
          /*#__PURE__*/React.createElement('tbody', null,
            itensFiltrados.length === 0
              ? /*#__PURE__*/React.createElement('tr', null,
                  /*#__PURE__*/React.createElement('td', { colSpan:8, style:{textAlign:'center',padding:24,color:'#888',fontSize:11} },
                    '\uD83D\uDD0D Nenhum insumo encontrado para "' + termoBusca + '"'
                  )
                )
              : listaGrupos.map(function(grupo){
              // FIX (implementação alinhada com layout aprovado — situação 1, opção C): título
              // separando cada grupo de mapa. Só aparece de fato como "grupo visível" quando há
              // mais de 1 mapa envolvido — com um só mapa (o caso mais comum), o título ainda
              // aparece, mas como não há nada pra "separar", o efeito visual é discreto.
              var ehMapaAtual = mapa && grupo.mapaId === mapa.id;
              return /*#__PURE__*/React.createElement(React.Fragment, { key:grupo.mapaId },
                /*#__PURE__*/React.createElement('tr', null,
                  /*#__PURE__*/React.createElement('td', { colSpan:8, style:{padding:'8px 6px 4px',fontWeight:800,fontSize:10.5,color:'#5b21b6',background:'#faf8ff',borderTop: '2px solid #e4d6ff'} },
                    '\u25BE MAPA ' + (grupo.numero!=null?grupo.numero:'?') + (ehMapaAtual ? ' (este que voc\u00ea abriu)' : '')
                  )
                ),
                grupo.itens.map(function(item){
                  var ps = poStatus[item.id]||{};
                  var sel = itensSelecionados.indexOf(item.id)>=0;
                  var qtPend = pendDe(item);
                  return /*#__PURE__*/React.createElement('tr', { key:item.id, style:{background:sel?'#f5f0ff':'transparent',opacity:qtPend<=0?0.6:1} },
                    /*#__PURE__*/React.createElement('td', {
                      style:{textAlign:'center',padding:'8px 4px',borderBottom:'1px solid #eee'}
                    },
                      /*#__PURE__*/React.createElement('input', {
                        type:'checkbox',
                        checked:sel && qtPend>0,
                        disabled:qtPend<=0,
                        title: qtPend<=0 ? 'J\u00e1 totalmente atendido (pedido + almoxarifado) \u2014 n\u00e3o h\u00e1 quantidade dispon\u00edvel para pedir' : '',
                        onChange:function(){ if(qtPend>0) onToggle(item.id); },
                        style:{cursor:qtPend<=0?'not-allowed':'pointer',accentColor:'#7c3aed',width:22,height:22,display:'block',margin:'0 auto'}
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
                    /*#__PURE__*/React.createElement('td', { style:{textAlign:'center',padding:'6px 8px',borderBottom:'1px solid #eee',color:(ps.qtAlmox>0?'#7c3aed':'#bbb'),fontWeight:'bold'} }, ps.qtAlmox>0 ? '\uD83D\uDCE6 '+ps.qtAlmox : '\u2014'),
                    /*#__PURE__*/React.createElement('td', { style:{textAlign:'center',padding:'6px 8px',borderBottom:'1px solid #eee',color:qtPend>0?'#b06000':'#3B6D11',fontWeight:'bold'} }, qtPend),
                    /*#__PURE__*/React.createElement('td', { style:{padding:'6px 8px',borderBottom:'1px solid #eee'} },
                      /*#__PURE__*/React.createElement('span', { style:{background:ps.bg,color:ps.color,padding:'2px 8px',borderRadius:99,fontSize:9,fontWeight:'bold'} }, ps.label||'')
                    )
                  );
                })
              );
            })
          )
        ),
        // FIX (implementação alinhada com layout aprovado — situação 1): seção para trazer itens
        // de outros mapas da mesma obra. Só aparece quando existe pelo menos 1 mapa elegível
        // (mesma obra, diferente do aberto) — se não houver nenhum, a seção nem é exibida.
        mapasDaMesmaObra.length > 0 && /*#__PURE__*/React.createElement('div', { style:{marginTop:10} },
          !mostrarSeletorMapa
            ? /*#__PURE__*/React.createElement('div', {
                onClick: function(){ setMostrarSeletorMapa(true); },
                style:{display:'flex',alignItems:'center',justifyContent:'center',gap:8,background:'#f9f6ff',border:'2px dashed #b794f6',borderRadius:8,padding:'10px 12px',cursor:'pointer',color:'#7c3aed',fontWeight:700,fontSize:11}
              }, '\u2795 Adicionar itens de outro mapa desta obra')
            : /*#__PURE__*/React.createElement('div', { style:{background:'#faf8ff',border:'1px solid #d4b8ff',borderRadius:8,padding:10} },
                /*#__PURE__*/React.createElement('label', { style:{fontSize:9,fontWeight:700,color:'#666',display:'block',marginBottom:5} }, 'ESCOLHA O MAPA (s\u00f3 aparecem mapas da mesma obra):'),
                /*#__PURE__*/React.createElement('select', {
                  value: '',
                  onChange: function(e){ if(e.target.value){ onAdicionarMapa(e.target.value); setMostrarSeletorMapa(false); } },
                  style:{width:'100%',padding:7,border:'1px solid #ccc',borderRadius:5,fontSize:11}
                },
                  /*#__PURE__*/React.createElement('option', { value:'' }, '\u2014 selecione \u2014'),
                  mapasDaMesmaObra.filter(function(m){ return mapasAdicionaisPO.indexOf(m.id)<0; }).map(function(m){
                    return /*#__PURE__*/React.createElement('option', { key:m.id, value:m.id }, 'MP ' + m.numero + ' \u00b7 ' + (m.obra||''));
                  })
                ),
                /*#__PURE__*/React.createElement('div', {
                  onClick: function(){ setMostrarSeletorMapa(false); },
                  style:{fontSize:9,color:'#888',marginTop:6,cursor:'pointer',textAlign:'right'}
                }, 'cancelar')
              )
        ),
        mapasAdicionaisPO.length > 0 && /*#__PURE__*/React.createElement('div', { style:{display:'flex',flexWrap:'wrap',gap:6,marginTop:8,paddingTop:8,borderTop:'1px dashed #ddd',alignItems:'center'} },
          /*#__PURE__*/React.createElement('span', { style:{fontSize:9,color:'#888'} }, 'Mapas inclu\u00eddos:'),
          mapasAdicionaisPO.map(function(mapaId){
            var m = mapasDaMesmaObra.find(function(mm){ return mm.id===mapaId; });
            if (!m) return null;
            return /*#__PURE__*/React.createElement('span', { key:mapaId, style:{background:'#e8eeff',color:'#2a5298',borderRadius:10,padding:'2px 6px 2px 9px',fontSize:9,fontWeight:700,display:'flex',alignItems:'center',gap:5} },
              'MP ' + m.numero,
              /*#__PURE__*/React.createElement('span', {
                onClick: function(){ onRemoverMapa(mapaId); },
                title: 'Remover este mapa da sele\u00e7\u00e3o',
                style:{cursor:'pointer',background:'rgba(255,255,255,.6)',borderRadius:'50%',width:14,height:14,display:'flex',alignItems:'center',justifyContent:'center',fontSize:8}
              }, '\u2715')
            );
          })
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
  // NOVO (09/10/2026 — adicionar itens esquecidos a um pedido já criado): só existem na EDIÇÃO.
  // Ao CRIAR um pedido, o pai não envia nada disso e a tela fica idêntica à de sempre.
  var poEdicao = _ref_po2.poEdicao || null;
  var onAdicionarItens = _ref_po2.onAdicionarItens || null;
  var itensNovosIds = _ref_po2.itensNovosIds || [];
  // FIX (implementação alinhada com layout aprovado — itens de outros mapas dentro do mesmo
  // pedido): lista completa de mapas, necessária para resolver os fornecedores/preços corretos
  // de um item que veio de um mapa DIFERENTE do que está aberto agora.
  var mapasTodos = _ref_po2.mapas||[];
  // Dado um item (que pode ter vindo do mapa aberto ou de outro, incluído na seleção), resolve
  // o MAPA CORRETO de onde puxar fornecedores/preços — nesta ordem de prioridade:
  // 1) "_mapaOrigemId" — vem da lista combinada montada no Step1, é o caminho normal ao CRIAR
  //    um pedido novo com itens de vários mapas.
  // 2) "mapa_id" — o item já vem com essa informação gravada quando se está REABRINDO/editando
  //    um pedido cujos itens foram salvos com a origem (implementação atual em diante).
  // 3) o mapa aberto agora — reserva de segurança para o caso mais comum (um só mapa, sem
  //    nenhuma das informações acima), preservando o comportamento de sempre sem nenhuma mudança.
  function resolverMapaDoItem(item) {
    var idOrigem = (item && (item._mapaOrigemId || item.mapa_id)) || null;
    if (idOrigem) {
      var achado = mapasTodos.find(function(m){ return m && m.id === idOrigem; });
      if (achado) return achado;
    }
    return mapa;
  }
  var _sFP=useState(_ref_po2.formaPagamentoInicial||''),formaPagamento=_slicedToArray(_sFP,2)[0],setFormaPagamento=_slicedToArray(_sFP,2)[1];
  var _sGer=useState(false),gerando=_slicedToArray(_sGer,2)[0],setGerando=_slicedToArray(_sGer,2)[1];
  // FIX 4 (Claudio, 05/08): a observação é uma coisa só do pedido — nunca fez sentido ter
  // várias caixas de digitar (uma por item) representando um único texto. Isso foi a raiz de
  // toda a série de bugs anteriores (esquecer de salvar, mostrar só num item, duplicar ao
  // corrigir, não conseguir apagar de propósito). Agora existe UM campo só, sempre, em criar
  // e em editar — sem nenhuma lógica de juntar/sincronizar cópias, porque não existem cópias.
  var _sObsPedido=useState(_ref_po2.observacaoInicial||''),obsPedido=_slicedToArray(_sObsPedido,2)[0],setObsPedido=_slicedToArray(_sObsPedido,2)[1];

  var itemIds = Object.keys(config||{});
  var novosAtivos = itensNovosIds.filter(function(id){ return itemIds.indexOf(id) >= 0; });


  // Calcular poStatus por item
  var poStatus = {};
  (itens||[]).forEach(function(item){
    var qtTotal = parseNumBR(item.qt)||0;
    var qtPedida = 0;
    var qtAtendida = 0;
    // FIX (mesma causa raiz corrigida em ModalPedidoStep1 e no "cadeado" da tela do mapa —
    // achado ao testar mais um cenário da função de pedido multi-mapa): remove a exigência de
    // "po.mapa_id===mapa.id" — um item pode ter sido incluído num pedido cujo mapa ÂNCORA é
    // outro, e mesmo assim precisa contar aqui. "item.id" já é globalmente único, então buscar
    // só por ele é suficiente e correto.
    (pedidos||[]).filter(function(po){ return po.status!=='cancelado'; }).forEach(function(po){
      var it=(po.itens||[]).find(function(i){ return i.item_id===item.id; });
      if(it){ qtPedida+=Number(it.qt_pedida)||0; if(po.status==='recebido') qtAtendida+=Number(it.qt_pedida)||0; }
    });
    var qtAlmox=Number(item._qtAlmox)||0;
    poStatus[item.id]={qtTotal:qtTotal,qtPedida:qtPedida,qtAtendida:qtAtendida,qtAlmox:qtAlmox,qtPend:Math.max(0,Math.round((qtTotal-qtPedida-qtAlmox)*1000)/1000)};
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
    // Cálculo EXATO (substitui a aproximação) quando o item de origem é encontrado em algum mapa
    // conhecido: total do mapa dele − pedidos dos OUTROS POs − almoxarifado dele. Se não achar,
    // mantém a aproximação acima e o item fica sem limite rígido (nunca trava um pedido legítimo).
    var mOrigFb = mapasTodos.find(function(mm){ return mm && itOrig.mapa_id && mm.id===itOrig.mapa_id && (mm.itens||[]).some(function(i){ return i.id===itemId; }); })
               || mapasTodos.find(function(mm){ return mm && (mm.itens||[]).some(function(i){ return i.id===itemId; }); });
    if (mOrigFb) {
      var itMapaFb = (mOrigFb.itens||[]).find(function(i){ return i.id===itemId; });
      var totFb = parseNumBR(itMapaFb.qt)||0, pedFb = 0, recFb = 0, almFb = 0;
      (pedidos||[]).filter(function(po){ return po.status!=='cancelado'; }).forEach(function(po){
        var x=(po.itens||[]).find(function(i){ return i.item_id===itemId; });
        if(x){ pedFb+=Number(x.qt_pedida)||0; if(po.status==='recebido') recFb+=Number(x.qt_pedida)||0; }
      });
      ((mOrigFb.almox||{})[itemId]||[]).forEach(function(r){ if(r && !r.estornado) almFb += Number(r.qt)||0; });
      almFb = Math.round(almFb*1000)/1000;
      poStatus[itemId]={qtTotal:totFb,qtPedida:pedFb,qtAtendida:recFb,qtAlmox:almFb,qtPend:Math.max(0,Math.round((totFb-pedFb-almFb)*1000)/1000),limiteExato:true};
    }
  });

  // LIMITE RÍGIDO por item: o pedido só pode ser gerado até o disponível (total − já pedido −
  // almoxarifado). Item sem limite conhecido (null) não bloqueia. Ao EDITAR, uma quantidade que o
  // pedido já tinha salva nunca é forçada a diminuir (pedidos antigos continuam editáveis) — só
  // não pode AUMENTAR além do limite.
  var arred3 = function(v){ return Math.round((Number(v)||0)*1000)/1000; };
  var limiteMax = {};
  itemIds.forEach(function(itemId){
    var p0 = poStatus[itemId]; var lim = null;
    if (p0) {
      if ((itens||[]).some(function(i){ return i.id===itemId; }) || p0.limiteExato) lim = p0.qtPend;
    }
    if (lim!==null && modoEdicao) {
      var o0 = itensPedidoOriginal.find(function(i){ return i.item_id===itemId; });
      lim = Math.max(lim, o0 ? (Number(o0.qt_pedida)||0) : 0);
    }
    limiteMax[itemId] = lim;
  });
  function excessoDe(itemId){
    var lim = limiteMax[itemId];
    if (lim===null || lim===undefined) return null;
    var q = arred3((config[itemId]||[]).reduce(function(sm,l){ return sm+(Number(l.qt)||0); },0));
    return q > arred3(lim) ? { qt:q, lim:arred3(lim) } : null;
  }
  function rotuloItem(itemId){
    var it = (itens||[]).find(function(i){ return i.id===itemId; });
    var o1 = itensPedidoOriginal.find(function(i){ return i.item_id===itemId; });
    var d = it ? ('ITEM '+it.num+' \u2014 '+(it.descricao||'')) : (o1 ? (o1.descricao||'') : String(itemId));
    return d;
  }
  var itensEmExcesso = itemIds.filter(function(id){ return !!excessoDe(id); });

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
        var item = (itens||[]).find(function(i){ return i.id===itemId; });
        // FIX (implementação alinhada com layout aprovado): resolve fornecedor/preço no mapa de
        // ORIGEM do item, não necessariamente o mapa aberto agora — essencial quando o item veio
        // de outro mapa incluído na seleção.
        var mapaDoItem = resolverMapaDoItem(item);
        var forn = ((mapaDoItem && mapaDoItem.fornecedores)||[]).find(function(f){ return f.id===val; });
        if (forn && item) {
          var preco = ((mapaDoItem && mapaDoItem.precos)||{})[item.id+'_'+val] || '';
          // FIX CRÍTICO: usar parseMoney() — a MESMA função que a tela do mapa usa pra ler
          // esse preço — em vez da lógica manual anterior (Number(String(preco).replace(',','.'))).
          // A lógica antiga só trocava vírgula por ponto, sem remover o ponto de MILHAR. Preços
          // acima de R$ 999 são salvos no formato brasileiro "2.029,04" (ponto=milhar,
          // vírgula=decimal); a troca ingênua transformava isso em "2.029.04" — dois pontos, que
          // o Number() do JavaScript não consegue interpretar (retorna NaN). Como todo cálculo
          // seguinte usa "Number(vlUnit)||0", o NaN silenciosamente virava 0, e o pedido inteiro
          // saía com subtotal e total final R$ 0,00 mesmo com o fornecedor e a quantidade corretos.
          var vlUnit = parseMoney(preco) || 0;
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
        // NOVO: faixa com o pedido que está sendo editado (só na edição)
        (modoEdicao && onAdicionarItens && poEdicao) && /*#__PURE__*/React.createElement('div', { 'data-edit-po-strip':'1', style:{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap',marginBottom:12} },
          /*#__PURE__*/React.createElement('span', { style:{background:'#7c3aed',color:'#fff',padding:'3px 10px',borderRadius:99,fontSize:11,fontWeight:'bold'} }, 'PO-'+String(poEdicao.numero).padStart(3,'0')),
          /*#__PURE__*/React.createElement('span', { style:{fontSize:12,fontWeight:'bold',color:'#333'} }, poEdicao.fornecedor_nome||''),
          /*#__PURE__*/React.createElement('span', { style:{background:poEdicao.status==='emitido'?'#E6F1FB':'#f0f0f0',color:poEdicao.status==='emitido'?'#185FA5':'#555',padding:'3px 10px',borderRadius:99,fontSize:10,fontWeight:'bold'} }, poEdicao.status==='emitido'?'Emitido':'Rascunho'),
          /*#__PURE__*/React.createElement('span', { style:{fontSize:10,color:'#666'} }, 'Fornecedor travado \u2014 o pedido pertence a um \u00fanico fornecedor')
        ),
        // KPIs
        /*#__PURE__*/React.createElement('div', { style:kpiRowStyle },
          [['Itens no pedido', itemIds.length, '#2a5298'],['Qt. pendente total', itemIds.reduce(function(s,id){ return s+(poStatus[id]?poStatus[id].qtPend:0); },0)+' un','#b06000'],['POs a gerar', nPOs,'#7c3aed'],['Valor estimado','R$ '+fmtBRL(valorTotal),'#3B6D11']].map(function(k,i){
            return /*#__PURE__*/React.createElement('div', { key:i, style:kpiCardStyle },
              /*#__PURE__*/React.createElement('div', { style:{fontSize:8,color:'#888',textTransform:'uppercase',marginBottom:3} }, k[0]),
              /*#__PURE__*/React.createElement('div', { style:{fontSize:15,fontWeight:'bold',color:k[2]} }, k[1])
            );
          })
        ),
        // NOVO: aviso dos itens novos ainda não gravados + botão de adicionar (só na edição)
        (modoEdicao && onAdicionarItens && novosAtivos.length>0) && /*#__PURE__*/React.createElement('div', { 'data-edit-novos-banner':'1', style:{background:'#fff8e6',border:'1px solid #f0a500',borderRadius:6,padding:'9px 12px',fontSize:11,color:'#6b4d00',lineHeight:1.45,marginBottom:12} },
          /*#__PURE__*/React.createElement('strong', null, novosAtivos.length+(novosAtivos.length===1?' item novo ainda n\u00e3o foi gravado.':' itens novos ainda n\u00e3o foram gravados.')),
          ' Confira as quantidades e clique em ',
          /*#__PURE__*/React.createElement('strong', null, 'Gerar Pedidos'),
          ' para salvar. Se fechar esta tela sem salvar, nada muda.'
        ),
        (modoEdicao && onAdicionarItens) && /*#__PURE__*/React.createElement('div', { style:{display:'flex',alignItems:'center',justifyContent:'space-between',gap:10,borderTop:'1px solid #eee',paddingTop:10,marginBottom:10} },
          /*#__PURE__*/React.createElement('span', { style:{fontSize:11,fontWeight:'bold',color:'#5b21b6'} }, 'ITENS DESTE PEDIDO ('+itemIds.length+')'),
          /*#__PURE__*/React.createElement('button', { type:'button', 'data-edit-add-itens':'1', onClick:function(){ onAdicionarItens(); }, style:{display:'flex',alignItems:'center',gap:6,background:'#fff',color:'#7c3aed',border:'2px dashed #b794f6',borderRadius:8,padding:'8px 14px',fontSize:11,fontWeight:'bold',cursor:'pointer',minHeight:40} }, '\u2795 Adicionar itens a este pedido')
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
              // FIX (implementação alinhada com layout aprovado): inclui mapa_id/mapa_numero
              // (se o pedido já os tiver salvo) no item reconstruído — sem isso, a resolução de
              // fornecedor/preço certo (função "resolverMapaDoItem") não saberia de qual mapa
              // este item específico veio, e cairia incorretamente no mapa aberto agora.
              item = { id: itemId, num: '—', descricao: itOrig.descricao||'', detalhe: itOrig.detalhe||'', unid: itOrig.unid||'', qt: itOrig.qt_total||0, mapa_id: itOrig.mapa_id, mapa_numero: itOrig.mapa_numero };
            }
          }
          if (!item) return /*#__PURE__*/React.createElement('div', { key:itemId, style:{border:'1px solid #f0a500',background:'#fff8e6',borderRadius:6,padding:'10px 12px',marginBottom:10,fontSize:10,color:'#7a5c00'} },
            '\u26A0\uFE0F Este insumo foi removido do mapa e não pode mais ser editado aqui, mas continua incluído neste pedido.'
          );
          var ps = poStatus[itemId]||{};
          // FIX (implementação alinhada com layout aprovado): resolve o mapa de origem UMA vez
          // por item (usado logo abaixo, tanto no fornecedor já selecionado quanto na lista de
          // opções do select) — evita repetir a mesma busca várias vezes.
          var mapaDoItem = resolverMapaDoItem(item);
          var linhas = config[itemId]||[{ fornId:'', fornNome:'', vlUnit:0, qt:'', obs:'' }];
          var qtDistrib = linhas.reduce(function(s,l){ return s+(Number(l.qt)||0); },0);
          var qtOk = qtDistrib > 0 && arred3(qtDistrib) === arred3(ps.qtPend);
          var excItem = excessoDe(itemId);
          var qtBloq = !!excItem;
          var qtOver = !qtBloq && qtDistrib > ps.qtPend; // só aviso (limite desconhecido ou quantidade antiga do próprio pedido)
          var isNovo = novosAtivos.indexOf(itemId) >= 0;

          return /*#__PURE__*/React.createElement('div', Object.assign({ key:itemId, style:{border:isNovo?'2px solid #b06000':'1px solid #e0e0e0',borderRadius:6,overflow:'hidden',marginBottom:10} }, isNovo?{'data-item-novo':itemId}:{}),
            // Header do item
            /*#__PURE__*/React.createElement('div', { style:{background:isNovo?'#fff3e0':'#f5f0ff',padding:'8px 12px',display:'flex',alignItems:'center',gap:8,borderBottom:'1px solid #e0e0e0'} },
              /*#__PURE__*/React.createElement('span', { style:{background:'#7c3aed',color:'#fff',padding:'2px 8px',borderRadius:99,fontSize:9,fontWeight:'bold'} }, 'ITEM '+item.num),
              isNovo && /*#__PURE__*/React.createElement('span', { style:{background:'#b06000',color:'#fff',padding:'2px 8px',borderRadius:99,fontSize:9,fontWeight:'bold'} }, 'NOVO'),
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
              [['Qt. Inicial',ps.qtTotal,'#2a5298']].concat(ps.qtAlmox>0?[['Qt. Almox.','\uD83D\uDCE6 '+ps.qtAlmox,'#7c3aed']]:[]).concat([['Qt. Atendida',ps.qtAtendida,'#3B6D11'],['Qt. Pendente',ps.qtPend,'#b06000'],['Tot. Atendida?',ps.qtPend===0?'✅ SIM':'NÃO',ps.qtPend===0?'#3B6D11':'#b06000']]).map(function(b,i,arr){
                return /*#__PURE__*/React.createElement('div', { key:i, style:{padding:'6px 10px',textAlign:'center',borderRight:i<arr.length-1?'1px solid #eee':'none'} },
                  /*#__PURE__*/React.createElement('div', { style:{fontSize:8,color:'#888',textTransform:'uppercase',marginBottom:2} }, b[0]),
                  /*#__PURE__*/React.createElement('div', { style:{fontSize:14,fontWeight:'bold',color:b[2]} }, b[1])
                );
              })
            ),
            // Linhas de fornecedor
            /*#__PURE__*/React.createElement('div', { style:{padding:'10px 12px'} },
              linhas.map(function(linha, idx){
                var forn = ((mapaDoItem && mapaDoItem.fornecedores)||[]).find(function(f){ return f.id===linha.fornId; });
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
                    (mapaDoItem.fornecedores||[]).map(function(f){
                      var preco = (mapaDoItem.precos||{})[item.id+'_'+f.id];
                      var label = f.nome + (preco ? ' — R$ '+String(preco).replace('.',',') : '');
                      return /*#__PURE__*/React.createElement('option', { key:f.id, value:f.id }, label);
                    }),
                    (modoEdicao && linha.fornId && !(mapaDoItem.fornecedores||[]).some(function(f){ return f.id===linha.fornId; })) && /*#__PURE__*/React.createElement('option', { key:'__forn_pedido', value:linha.fornId }, (linha.fornNome||'') + (linha.vlUnit ? ' \u2014 R$ '+fmtBRL(linha.vlUnit) : ''))
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
              qtBloq && /*#__PURE__*/React.createElement('div', { 'data-excesso':'1', style:{fontSize:9,color:'#fff',marginTop:4,background:'#c0392b',padding:'5px 8px',borderRadius:3,fontWeight:'bold'} },
                excItem.lim>0
                  ? '\u26D4 Qt. distribu\u00edda: '+excItem.qt+' \u2014 acima do dispon\u00edvel ('+excItem.lim+'). Reduza para no m\u00e1ximo '+excItem.lim+'. N\u00e3o \u00e9 poss\u00edvel gerar com essa quantidade.'
                  : '\u26D4 Qt. distribu\u00edda: '+excItem.qt+' \u2014 este item n\u00e3o tem quantidade dispon\u00edvel (dispon\u00edvel 0). Zere a quantidade ou remova o item.'
              ),
              qtOver && /*#__PURE__*/React.createElement('div', { style:{fontSize:9,color:'#c0392b',marginTop:4,background:'#FCEBEB',padding:'4px 8px',borderRadius:3} },
                '\u26A0 Qt. distribuída: '+qtDistrib+' — maior que a pendente ('+ps.qtPend+'). Verifique.'
              ),
              qtOk && /*#__PURE__*/React.createElement('div', { style:{fontSize:9,color:'#3B6D11',marginTop:4,background:'#EAF3DE',padding:'4px 8px',borderRadius:3} },
                '\u2714 Qt. distribuída: '+qtDistrib+' de '+ps.qtPend+' pendentes — OK'
              ),
              ps.qtPend===0 && /*#__PURE__*/React.createElement('div', { style:{fontSize:9,color:'#185FA5',marginTop:4,background:'#E6F1FB',padding:'4px 8px',borderRadius:3} },
                '\u2139 Este item j\u00e1 est\u00e1 totalmente atendido (Qt. Pendente = 0). N\u00e3o \u00e9 poss\u00edvel gerar pedido deste item.'
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
          // FIX: mesma causa raiz do bug do vlUnit acima — usa parseMoney() em vez de um
          // replace manual que não removia o ponto de milhar (quebrava com valores ≥ 1.000).
          function parseVal(v){ var n = parseMoney(v); return n === null ? 0 : n; }
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
          itensEmExcesso.length>0
            ? /*#__PURE__*/React.createElement('strong', { 'data-excesso-rodape':'1', style:{color:'#c0392b'} }, '\u26D4 '+itensEmExcesso.length+' item(ns) acima do dispon\u00edvel')
            : (nPOs>0 && /*#__PURE__*/React.createElement(React.Fragment, null, 'Ser\u00E3o gerados ', /*#__PURE__*/React.createElement('strong', {style:{color:'#7c3aed'}}, nPOs), ' pedido(s)'))
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
          onClick: function(){
            if(gerando) return;
            // Trava dupla (além do botão desabilitado): recalcula na hora do clique.
            if(itensEmExcesso.length>0){
              alert('N\u00e3o \u00e9 poss\u00edvel gerar o pedido: quantidade acima do dispon\u00edvel.\n\n' + itensEmExcesso.map(function(id){ var e=excessoDe(id); return '\u2022 '+rotuloItem(id)+': digitado '+e.qt+', m\u00e1ximo dispon\u00edvel '+e.lim; }).join('\n') + '\n\nCorrija as quantidades e tente novamente.');
              return;
            }
            setGerando(true); onGerar(config, poFinanceiro, function(){ setGerando(false); }, formaPagamento, obsPedido);
          },
          disabled: gerando || itensEmExcesso.length>0,
          title: itensEmExcesso.length>0 ? 'H\u00e1 item com quantidade acima do dispon\u00edvel \u2014 corrija para gerar' : '',
          style:{background: (gerando || itensEmExcesso.length>0) ? '#9d6fe8' : '#7c3aed',color:'#fff',border:'none',padding:'8px 18px',borderRadius:4,fontSize:11,cursor: (gerando || itensEmExcesso.length>0) ? 'not-allowed' : 'pointer',fontWeight:'bold',opacity: (gerando || itensEmExcesso.length>0) ? 0.5 : 1}
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
  // NOVO (pedido do Claudio, 08/10/2026 — opção A aprovada no layout "Ver Pedidos só do mapa"): esta
  // tela abre mostrando só os pedidos DESTE mapa; um botão mostra a lista geral (todos os pedidos
  // do sistema), igual era antes. A escolha NÃO é lembrada: toda vez que a tela abre, começa em
  // "mapa" (o estado nasce junto com a tela). Só muda o que aparece na lista e nos 5 quadros — os
  // PDFs ("Relatorio PDF" e "Imprimir Pedidos Completos") continuam usando os próprios filtros.
  var _sMD=useState('mapa'),modoLista=_slicedToArray(_sMD,2)[0],setModoLista=_slicedToArray(_sMD,2)[1];
  var _sRM=useState(false),showRelModal=_slicedToArray(_sRM,2)[0],setShowRelModal=_slicedToArray(_sRM,2)[1];
  var _sRF=useState({obra:[],de:'',ate:'',insumo:[],status:[]}),relFiltros=_slicedToArray(_sRF,2)[0],setRelFiltros=_slicedToArray(_sRF,2)[1];
  // FIX (pedido do Claudio — imprimir vários pedidos completos, filtrados por obra e período,
  // sem preencher nada = todos os pedidos do sistema): estado próprio, separado do "Relatorio
  // PDF" que já existia (aquele é um resumo em tabela; este é cada pedido completo, um atrás do
  // outro, com quebra de página). Obra é um único valor (não multi-seleção), igual pedido pelo
  // Claudio no layout aprovado.
  var _sIC=useState(false),showImprimirCompletos=_slicedToArray(_sIC,2)[0],setShowImprimirCompletos=_slicedToArray(_sIC,2)[1];
  var _sFIC=useState({obra:'',de:'',ate:''}),filtrosImprimirCompletos=_slicedToArray(_sFIC,2)[0],setFiltrosImprimirCompletos=_slicedToArray(_sFIC,2)[1];

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

  // "Pedido deste mapa" = foi gerado a partir deste mapa (po.mapa_id) OU tem algum item deste mapa
  // (item_id — único no sistema, o mesmo vínculo que o "cadeado" de item atendido já usa). Vale
  // para pedidos antigos e para pedidos com itens de mais de um mapa. Sem mapa aberto, comporta-se
  // como antes (lista geral, sem o botão).
  var temMapaAberto = !!(mapa && mapa.id);
  var idsItensDoMapa = {};
  (itensDoMapa||[]).forEach(function(i){ if (i && i.id) idsItensDoMapa[i.id] = true; });
  ((mapa && mapa.itens)||[]).forEach(function(i){ if (i && i.id) idsItensDoMapa[i.id] = true; });
  function origemPO(po){
    var itensPO = (po && po.itens) || [];
    var doMapa = temMapaAberto && (po.mapa_id === mapa.id || itensPO.some(function(it){ return !!idsItensDoMapa[it.item_id]; }));
    var numeros = [], temOutro = false;
    itensPO.forEach(function(it){
      var meu = !!idsItensDoMapa[it.item_id] || (temMapaAberto && it.mapa_id === mapa.id);
      if (meu) return;
      temOutro = true;
      if (it.mapa_numero != null && numeros.indexOf(it.mapa_numero) < 0) numeros.push(it.mapa_numero);
    });
    return { doMapa: doMapa, temOutro: temOutro, numeros: numeros };
  }
  var pedidosDoMapaN = temMapaAberto ? (pedidos||[]).filter(function(po){ return origemPO(po).doMapa; }).length : 0;
  var pedidosBase = (temMapaAberto && modoLista==='mapa') ? (pedidos||[]).filter(function(po){ return origemPO(po).doMapa; }) : (pedidos||[]);

  var pedidosFiltrados = pedidosBase.filter(function(po){
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
          /*#__PURE__*/React.createElement('button', { onClick:function(){ setRelFiltros({obra:[],de:'',ate:'',insumo:[],status:[]}); setShowRelModal(true); }, style:{background:'rgba(255,255,255,.2)',border:'none',color:'#fff',padding:'5px 12px',borderRadius:4,fontSize:10,cursor:'pointer'} }, 'Relatorio PDF'),
          /*#__PURE__*/React.createElement('button', { onClick:function(){ setFiltrosImprimirCompletos({obra:'',de:'',ate:''}); setShowImprimirCompletos(true); }, style:{background:'rgba(255,255,255,.2)',border:'none',color:'#fff',padding:'5px 12px',borderRadius:4,fontSize:10,cursor:'pointer'} }, '\uD83D\uDDA8\uFE0F Imprimir Pedidos Completos'),
          /*#__PURE__*/React.createElement('button', { onClick:onRefresh, style:{background:'rgba(255,255,255,.2)',border:'none',color:'#fff',padding:'5px 12px',borderRadius:4,fontSize:10,cursor:'pointer'} }, '\uD83D\uDD04 Atualizar'),
          /*#__PURE__*/React.createElement('span', { onClick:onClose, style:{cursor:'pointer',fontSize:18,opacity:.8} }, '\u2715')
        )
      ),
      // Filtros
      /*#__PURE__*/React.createElement('div', { style:{display:'flex',gap:8,padding:'10px 14px',background:'#f5f5f5',borderBottom:'1px solid #eee',flexWrap:'wrap',alignItems:'flex-start'} },
        temMapaAberto && /*#__PURE__*/React.createElement('div', { 'data-ped-seg':'1', style:{display:'flex',flexDirection:'column',gap:3} },
          /*#__PURE__*/React.createElement('label', { style:{fontSize:8,color:'#888',textTransform:'uppercase',fontWeight:'bold'} }, 'Mostrar'),
          /*#__PURE__*/React.createElement('div', { style:{display:'flex',border:'1px solid #7c3aed',borderRadius:6,overflow:'hidden',background:'#fff'} },
            [['mapa','\uD83D\uDCCD S\u00F3 deste mapa (MP '+(mapa.numero!=null?mapa.numero:'?')+')'],['todos','\uD83C\uDF10 Todos os pedidos']].map(function(b){
              var ativo = modoLista===b[0];
              return /*#__PURE__*/React.createElement('button', { key:b[0], 'data-ped-modo':b[0], 'aria-pressed':ativo?'true':'false',
                onClick:function(){ setModoLista(b[0]); setDropdownAberto(null); },
                style:{border:'none',background:ativo?'#7c3aed':'#fff',color:ativo?'#fff':'#7c3aed',padding:'6px 11px',fontSize:10,fontWeight:'bold',cursor:'pointer',whiteSpace:'nowrap'} }, b[1]);
            })
          )
        ),
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
          ? ((temMapaAberto && modoLista==='mapa' && pedidosDoMapaN===0)
            ? /*#__PURE__*/React.createElement('div', { 'data-ped-vazio-mapa':'1', style:{padding:'34px 16px',textAlign:'center',color:'#666',fontSize:12} },
                /*#__PURE__*/React.createElement('div', { style:{fontSize:13,fontWeight:'bold',color:'#333',marginBottom:6} }, 'Nenhum pedido foi gerado neste mapa (MP N\u00BA '+(mapa.numero!=null?mapa.numero:'?')+') ainda.'),
                /*#__PURE__*/React.createElement('div', null, 'Quando voc\u00EA usar "Criar Pedido" aqui, ele aparece nesta lista.'),
                (pedidos||[]).length>0 && /*#__PURE__*/React.createElement('div', { style:{marginTop:12} },
                  (pedidos||[]).length===1 ? 'Existe 1 pedido de outro mapa no sistema \u2014 ' : 'Existem '+(pedidos||[]).length+' pedidos de outros mapas no sistema \u2014 ',
                  /*#__PURE__*/React.createElement('span', { 'data-ped-ver-todos':'1', onClick:function(){ setModoLista('todos'); }, style:{color:'#7c3aed',textDecoration:'underline',cursor:'pointer',fontWeight:'bold'} }, 'ver todos os pedidos'), '.'))
            : /*#__PURE__*/React.createElement('div', { style:{padding:40,textAlign:'center',color:'#888',fontSize:12} }, 'Nenhum pedido encontrado.'))
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
                  /*#__PURE__*/React.createElement('td', { style:{padding:'6px 8px',textAlign:'center',fontWeight:'bold',color:'#7c3aed',borderBottom:'1px solid #eee'} }, num,
                    (function(){
                      if (!temMapaAberto) return null;
                      var og = origemPO(po), txt = '', verde = false;
                      var outros = og.numeros.length ? og.numeros.map(function(n){ return 'MP '+n; }).join(' + ') : 'outro mapa';
                      if (modoLista==='todos') {
                        if (og.doMapa) { txt = 'deste mapa (MP '+(mapa.numero!=null?mapa.numero:'?')+')'+(og.temOutro?' + '+outros:''); verde = true; }
                        else txt = outros;
                      } else if (og.temOutro) { txt = 'inclui itens de '+outros; verde = true; }
                      if (!txt) return null;
                      return /*#__PURE__*/React.createElement('div', { 'data-ped-origem':og.doMapa?'mapa':'outro', style:{fontSize:8,fontWeight:600,marginTop:2,color:verde?'#3b6d11':'#777',lineHeight:1.2} }, txt);
                    })()),
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
  ),
  // FIX (pedido do Claudio — imprimir vários pedidos completos): modal novo, mais simples que o
  // "Relatorio PDF" (só obra + período, obra é seleção única). Reaproveita a mesma lógica de
  // filtro de data (com a correção de fuso horário) já usada no modal de relatório acima.
  showImprimirCompletos && /*#__PURE__*/React.createElement('div', {
    style:{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.6)',zIndex:10000,display:'flex',alignItems:'center',justifyContent:'center',padding:12,overscrollBehavior:'none'}
  },
    /*#__PURE__*/React.createElement('div', {
      style:{background:'#fff',borderRadius:8,overflow:'hidden',width:'100%',maxWidth:460,boxShadow:'0 8px 32px rgba(0,0,0,0.3)',maxHeight:'90vh',display:'flex',flexDirection:'column'}
    },
      /*#__PURE__*/React.createElement('div', { style:{background:'#7c3aed',color:'#fff',padding:'12px 16px',display:'flex',justifyContent:'space-between',alignItems:'center',flexShrink:0} },
        /*#__PURE__*/React.createElement('div', null,
          /*#__PURE__*/React.createElement('div', { style:{fontWeight:'bold',fontSize:13} }, '\uD83D\uDDA8\uFE0F IMPRIMIR PEDIDOS COMPLETOS'),
          /*#__PURE__*/React.createElement('div', { style:{fontSize:9,opacity:.85,marginTop:2} }, 'Cada pedido sai por inteiro, um atr\u00e1s do outro')
        ),
        /*#__PURE__*/React.createElement('span', { onClick:function(){ setShowImprimirCompletos(false); }, style:{cursor:'pointer',fontSize:18,opacity:.8} }, 'X')
      ),
      /*#__PURE__*/React.createElement('div', { style:{padding:16,display:'flex',flexDirection:'column',gap:12,overflowY:'auto',flex:1,overscrollBehavior:'contain'} },
        /*#__PURE__*/React.createElement('div', { style:{background:'#f0eaff',border:'1px solid #d4b8ff',borderRadius:6,padding:'8px 10px',fontSize:10,color:'#5b21b6'} }, '\uD83D\uDCA1 N\u00e3o preencher nenhum campo abaixo = todos os pedidos do sistema entram.'),
        /*#__PURE__*/React.createElement('div', { style:{display:'flex',flexDirection:'column',gap:4} },
          /*#__PURE__*/React.createElement('label', { style:{fontSize:9,color:'#5b21b6',textTransform:'uppercase',fontWeight:'bold'} }, 'Obra (opcional)'),
          /*#__PURE__*/React.createElement('select', {
            value: filtrosImprimirCompletos.obra,
            onChange: function(e){ setFiltrosImprimirCompletos(function(p){ return Object.assign({},p,{obra:e.target.value}); }); },
            style:{padding:'8px 10px',border:'1px solid #d4b8ff',borderRadius:5,fontSize:11,width:'100%',minHeight:40}
          },
            /*#__PURE__*/React.createElement('option', {value:''}, 'Todas as obras'),
            obrasComPedido.map(function(o){ return /*#__PURE__*/React.createElement('option', {key:o, value:o}, o); })
          )
        ),
        /*#__PURE__*/React.createElement('div', { style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8} },
          /*#__PURE__*/React.createElement('div', { style:{display:'flex',flexDirection:'column',gap:4} },
            /*#__PURE__*/React.createElement('label', { style:{fontSize:9,color:'#5b21b6',textTransform:'uppercase',fontWeight:'bold'} }, 'Data inicial (opcional)'),
            /*#__PURE__*/React.createElement('input', { type:'date',value:filtrosImprimirCompletos.de||'', onChange:function(e){ setFiltrosImprimirCompletos(function(p){ return Object.assign({},p,{de:e.target.value}); }); }, style:{padding:'8px 10px',border:'1px solid #d4b8ff',borderRadius:5,fontSize:11,width:'100%',minHeight:40} })
          ),
          /*#__PURE__*/React.createElement('div', { style:{display:'flex',flexDirection:'column',gap:4} },
            /*#__PURE__*/React.createElement('label', { style:{fontSize:9,color:'#5b21b6',textTransform:'uppercase',fontWeight:'bold'} }, 'Data final (opcional)'),
            /*#__PURE__*/React.createElement('input', { type:'date',value:filtrosImprimirCompletos.ate||'', onChange:function(e){ setFiltrosImprimirCompletos(function(p){ return Object.assign({},p,{ate:e.target.value}); }); }, style:{padding:'8px 10px',border:'1px solid #d4b8ff',borderRadius:5,fontSize:11,width:'100%',minHeight:40} })
          )
        )
      ),
      /*#__PURE__*/React.createElement('div', { style:{padding:'12px 16px',borderTop:'1px solid #eee',display:'flex',gap:8,justifyContent:'flex-end',flexShrink:0} },
        /*#__PURE__*/React.createElement('button', { onClick:function(){ setShowImprimirCompletos(false); }, style:{background:'#f0f0f0',border:'none',padding:'8px 16px',borderRadius:4,fontSize:11,cursor:'pointer'} },'Cancelar'),
        /*#__PURE__*/React.createElement('button', {
          onClick:function(){
            var ped=(pedidos||[]).filter(function(po){
              if(filtrosImprimirCompletos.obra && po.obra !== filtrosImprimirCompletos.obra) return false;
              if(filtrosImprimirCompletos.de||filtrosImprimirCompletos.ate){
                // Mesma corre\u00e7\u00e3o de fuso hor\u00e1rio j\u00e1 usada no filtro de "Relatorio PDF" acima
                var dataBrutaPO = po.data_emissao||po.criado_em||'';
                var dt=new Date(dataBrutaPO.length===10 ? dataBrutaPO+'T12:00:00' : dataBrutaPO);
                if(isNaN(dt.getTime())) return false;
                if(filtrosImprimirCompletos.de && dt<new Date(filtrosImprimirCompletos.de+'T00:00:00')) return false;
                if(filtrosImprimirCompletos.ate && dt>new Date(filtrosImprimirCompletos.ate+'T23:59:59')) return false;
              }
              return true;
            });
            setShowImprimirCompletos(false);
            logEventoDiag("IMPRESS\u00c3O DE PEDIDOS COMPLETOS: " + ped.length + " pedido(s)" + (filtrosImprimirCompletos.obra ? " \u2014 obra: " + filtrosImprimirCompletos.obra : ""));
            abrirPDF(buildRelatorioPedidosCompletosPDF(ped, filtrosImprimirCompletos));
          },
          style:{background:'#0e7a3f',color:'#fff',border:'none',padding:'8px 18px',borderRadius:4,fontSize:11,cursor:'pointer',fontWeight:'bold'}
        },'Gerar PDF')
      )
    )
  )
  );
}

// ─── Modal Casar Insumos ────────────────────────────────────────────────────


// ═══════════════════════════════════════════════════════════════════════════════════════════════
// NOVO (pedido do Claudio, 09/10/2026): ADICIONAR ITENS ESQUECIDOS A UM PEDIDO JÁ CRIADO
// Tudo aqui é ADITIVO: nada do que já existia foi alterado de lugar. As funções "ap*" são puras
// (só leem os dados que recebem) e são usadas tanto pela janela de escolha quanto pela conferência
// feita na hora de gravar — a MESMA conta nos dois lugares, para nunca divergirem.
// Regras acordadas com o Claudio:
//  • o fornecedor do pedido NÃO muda (um pedido pertence a um único fornecedor);
//  • o preço vem da cotação desse fornecedor no mapa do PRÓPRIO item;
//  • só entram itens do mapa do pedido, dos mapas que já estão no pedido e de outros mapas da
//    MESMA obra (nunca de outra obra);
//  • item já no pedido, 100% atendido (pedidos + almoxarifado) ou sem preço desse fornecedor
//    não pode ser marcado;
//  • disponível = total − já pedido (qualquer pedido não cancelado, EXCETO este) − almoxarifado.
// ═══════════════════════════════════════════════════════════════════════════════════════════════
function apNormNome(s) {
  var t = String(s == null ? '' : s);
  try { t = t.normalize('NFD').replace(/[̀-ͯ]/g, ''); } catch (e) {}
  return t.toUpperCase().replace(/\s+/g, ' ').trim();
}
function apArred3(v) { return Math.round((Number(v) || 0) * 1000) / 1000; }
// Fornecedores do MAPA que representam o fornecedor do pedido: primeiro o MESMO cadastro (mesmo id —
// caso de mapa duplicado), depois os de nome igual (sem diferenciar maiúscula, acento e espaços).
function apFornCandidatos(mapa, po) {
  var fs = (mapa && mapa.fornecedores) || [];
  var out = [];
  var id = po && po.fornecedor_id;
  if (id) fs.forEach(function (f) { if (f && f.id === id) out.push(f); });
  var nome = apNormNome(po && po.fornecedor_nome);
  if (nome) fs.forEach(function (f) { if (f && out.indexOf(f) < 0 && apNormNome(f.nome) === nome) out.push(f); });
  return out;
}
// Preço (maior que zero) do item para o fornecedor do pedido, no mapa do próprio item.
function apPrecoDoItem(mapa, item, cands) {
  for (var i = 0; i < cands.length; i++) {
    var p = parseMoney(((mapa && mapa.precos) || {})[item.id + '_' + cands[i].id]);
    if (p !== null && p > 0) return { preco: p, forn: cands[i] };
  }
  return null;
}
// Quantidades do item, SEM contar o pedido que está sendo editado (a lista recebida já vem sem ele).
function apDisponivel(mapa, item, pedidosSemEste) {
  var total = parseNumBR(item.qt) || 0;
  var ped = 0;
  (pedidosSemEste || []).forEach(function (p) {
    if (!p || p.status === 'cancelado') return;
    var it = (p.itens || []).find(function (i) { return i.item_id === item.id; });
    if (it) ped += Number(it.qt_pedida) || 0;
  });
  var alm = almoxSomaAtivas(((mapa && mapa.almox) || {})[item.id]);
  return { total: total, pedida: apArred3(ped), almox: alm, disp: Math.max(0, Math.round((total - ped - alm) * 1000) / 1000) };
}
// Mapas que já fazem parte do pedido: o mapa-âncora e os mapas de onde vieram os itens.
function apMapasBase(po, mapas) {
  var ids = [];
  if (po && po.mapa_id) ids.push(po.mapa_id);
  ((po && po.itens) || []).forEach(function (i) { if (i && i.mapa_id && ids.indexOf(i.mapa_id) < 0) ids.push(i.mapa_id); });
  return ids.map(function (id) { return (mapas || []).find(function (m) { return m && m.id === id; }); }).filter(Boolean);
}
// Outros mapas da MESMA obra do pedido que ainda não estão na lista (nunca de outra obra).
function apMapasDaObra(po, mapas, jaNaLista) {
  var ancora = (mapas || []).find(function (m) { return m && po && m.id === po.mapa_id; });
  var obra = ancora ? (ancora.obra || '') : ((po && po.obra) || '');
  var ids = (jaNaLista || []).map(function (m) { return m.id; });
  return (mapas || []).filter(function (m) { return m && ids.indexOf(m.id) < 0 && (m.obra || '') === obra; });
}
// Itens de UM mapa como candidatos, cada um com o motivo de estar bloqueado (ou null = pode marcar).
function apCandidatosDoMapa(mapa, po, pedidosSemEste, idsNoPedido) {
  var cands = apFornCandidatos(mapa, po);
  return ((mapa && mapa.itens) || []).filter(function (it) { return it && !it.excluido; }).map(function (it) {
    var d = apDisponivel(mapa, it, pedidosSemEste);
    var pr = apPrecoDoItem(mapa, it, cands);
    var motivo = null;
    if ((idsNoPedido || []).indexOf(it.id) >= 0) motivo = 'no-pedido';
    else if (d.disp <= 0) motivo = 'atendido';
    else if (!cands.length) motivo = 'sem-fornecedor';
    else if (!pr) motivo = 'sem-preco';
    return { key: mapa.id + '|' + it.id, item: it, mapa: mapa, total: d.total, pedida: d.pedida, almox: d.almox, disp: d.disp, preco: pr ? pr.preco : null, motivo: motivo };
  });
}

function ModalAdicionarItensPedido(_ref_ai) {
  var po = _ref_ai.po || {};
  var mapas = _ref_ai.mapas || [];
  var pedidosSemEste = _ref_ai.pedidosSemEste || [];
  var noPedido = _ref_ai.noPedido || {};
  var onClose = _ref_ai.onClose || function () {};
  var onConfirmar = _ref_ai.onConfirmar || function () {};
  var _sF = useState(''), filtro = _sF[0], setFiltro = _sF[1];
  var _sSel = useState([]), sel = _sSel[0], setSel = _sSel[1];
  var _sEx = useState([]), extras = _sEx[0], setExtras = _sEx[1];
  var _sSeletor = useState(false), mostrarSeletor = _sSeletor[0], setMostrarSeletor = _sSeletor[1];
  // Celular: abaixo de 600 px a tabela de 8 colunas não cabe — cada insumo vira um cartão (mesmos dados, mesmas travas).
  var _sLarg = useState(typeof window !== 'undefined' ? window.innerWidth : 1024), larguraTela = _sLarg[0], setLarguraTela = _sLarg[1];
  useEffect(function () { function aoRedimensionar() { setLarguraTela(window.innerWidth); } window.addEventListener('resize', aoRedimensionar); return function () { window.removeEventListener('resize', aoRedimensionar); }; }, []);
  var compacto = larguraTela < 600;

  var idsNoPedido = Object.keys(noPedido);
  var baseMapas = apMapasBase(po, mapas);
  var extraMapas = extras.map(function (id) { return mapas.find(function (m) { return m && m.id === id; }); }).filter(Boolean);
  var todosMapas = baseMapas.concat(extraMapas);
  var outrosDaObra = apMapasDaObra(po, mapas, todosMapas);
  var termo = filtro.trim().toUpperCase();
  var grupos = todosMapas.map(function (m) {
    var linhas = apCandidatosDoMapa(m, po, pedidosSemEste, idsNoPedido).filter(function (l) {
      if (!termo) return true;
      return (l.item.descricao || '').toUpperCase().indexOf(termo) >= 0 || (l.item.detalhe || '').toUpperCase().indexOf(termo) >= 0;
    });
    return { mapa: m, linhas: linhas, ehBase: baseMapas.indexOf(m) >= 0 };
  });
  var selecionaveis = [];
  grupos.forEach(function (g) { g.linhas.forEach(function (l) { if (!l.motivo) selecionaveis.push(l); }); });
  var todasLinhas = [];
  todosMapas.forEach(function (m) { apCandidatosDoMapa(m, po, pedidosSemEste, idsNoPedido).forEach(function (l) { if (!l.motivo) todasLinhas.push(l); }); });
  var selValidas = todasLinhas.filter(function (l) { return sel.indexOf(l.key) >= 0; });
  var todosMarcados = selecionaveis.length > 0 && selecionaveis.every(function (l) { return sel.indexOf(l.key) >= 0; });

  function alterna(key) { setSel(function (prev) { var i = prev.indexOf(key); return i >= 0 ? prev.filter(function (k) { return k !== key; }) : prev.concat([key]); }); }
  function marcaTodos(marcar) {
    var keys = selecionaveis.map(function (l) { return l.key; });
    setSel(function (prev) { return marcar ? prev.concat(keys.filter(function (k) { return prev.indexOf(k) < 0; })) : prev.filter(function (k) { return keys.indexOf(k) < 0; }); });
  }
  function situacao(l) {
    if (l.motivo === 'no-pedido') return { t: 'JÁ NESTE PEDIDO (' + (noPedido[l.item.id] || 0) + ')', bg: '#e6e6f5', c: '#3a3a7a' };
    if (l.motivo === 'atendido') return { t: 'TOTALMENTE ATENDIDO', bg: '#EAF3DE', c: '#2d5a0b' };
    if (l.motivo === 'sem-fornecedor') return { t: 'FORNECEDOR NÃO ESTÁ NESTE MAPA', bg: '#FCEBEB', c: '#a32d2d' };
    if (l.motivo === 'sem-preco') return { t: 'SEM PREÇO DE ' + (po.fornecedor_nome || 'ESTE FORNECEDOR'), bg: '#FCEBEB', c: '#a32d2d' };
    if (l.pedida > 0 || l.almox > 0) return { t: 'PARCIAL', bg: '#E6F1FB', c: '#185FA5' };
    return { t: 'SEM PEDIDO', bg: '#E6F1FB', c: '#185FA5' };
  }
  var COLS = '36px 30px minmax(0,1fr) 56px 58px 56px 78px 84px';
  var ovStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.55)', zIndex: 9100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12, overscrollBehavior: 'none' };
  var modalStyle = { background: '#fff', borderRadius: 8, overflow: 'hidden', width: '100%', maxWidth: 740, maxHeight: '92vh', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' };
  var cel = { padding: '6px 4px', textAlign: 'center' };
  var h = React.createElement;

  return h('div', { style: ovStyle, 'data-add-modal': '1' },
    h('div', { style: modalStyle },
      h('div', { style: { background: '#7c3aed', color: '#fff', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' } },
        h('span', { style: { fontSize: 12, fontWeight: 'bold' } }, 'ADICIONAR ITENS AO PO-' + String(po.numero).padStart(3, '0') + ' · ' + (po.fornecedor_nome || '')),
        h('span', { style: { cursor: 'pointer', fontSize: 16, opacity: .8, padding: '6px 10px' }, onClick: onClose, title: 'Fechar' }, '✕')
      ),
      h('div', { style: { padding: 14, overflowY: 'auto', flex: 1, overscrollBehavior: 'contain' } },
        h('div', { style: { background: '#f0eaff', border: '1px solid #d4b8ff', borderRadius: 5, padding: '8px 12px', marginBottom: 12, fontSize: 10, color: '#4a1a8a', lineHeight: 1.45 } },
          'ℹ️ Só aparecem os insumos desta obra. O ',
          h('strong', null, 'preço vem da cotação de ' + (po.fornecedor_nome || 'este fornecedor')),
          ' no mapa de cada item. Item que já está neste pedido, que já está totalmente atendido ou que esse fornecedor não cotou ',
          h('strong', null, 'não pode ser marcado'), '.'
        ),
        h('div', { style: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, background: '#f9f6ff', border: '1px solid #d4b8ff', borderRadius: 6, padding: '6px 10px' } },
          h('span', { style: { fontSize: 13, color: '#7c3aed' } }, '🔍'),
          h('input', { type: 'text', value: filtro, onChange: function (e) { setFiltro(e.target.value); }, placeholder: 'Buscar insumo por descrição ou detalhe...', maxLength: 80, inputMode: 'search', 'data-add-busca': '1', style: { flex: 1, border: 'none', background: 'transparent', fontSize: 11, outline: 'none', color: '#333' } }),
          termo && h('span', { onClick: function () { setFiltro(''); }, style: { cursor: 'pointer', fontSize: 12, color: '#aaa', padding: '4px 10px' } }, '✕')
        ),
        h('div', { style: { border: '1px solid #eee', borderRadius: 6, overflow: 'hidden' } },
          compacto ? h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, background: '#5b21b6', color: '#fff', fontSize: 10, fontWeight: 'bold', padding: '8px 10px' } },
            h('input', { type: 'checkbox', checked: todosMarcados, disabled: selecionaveis.length === 0, 'data-add-todos': '1', onChange: function (e) { marcaTodos(e.target.checked); }, style: { cursor: 'pointer', accentColor: '#7c3aed', width: 22, height: 22 } }),
            h('span', null, 'MARCAR TODOS OS LIBERADOS')
          ) : h('div', { style: { display: 'grid', gridTemplateColumns: COLS, background: '#5b21b6', color: '#fff', fontSize: 9, fontWeight: 'bold', alignItems: 'center' } },
            h('div', { style: cel }, h('input', { type: 'checkbox', checked: todosMarcados, disabled: selecionaveis.length === 0, 'data-add-todos': '1', onChange: function (e) { marcaTodos(e.target.checked); }, style: { cursor: 'pointer' } })),
            h('div', { style: cel }, 'ITEM'),
            h('div', { style: Object.assign({}, cel, { textAlign: 'left' }) }, 'DESCRIÇÃO'),
            h('div', { style: cel }, 'TOTAL'), h('div', { style: cel }, 'JÁ PEDIDA'), h('div', { style: cel }, 'ALMOX.'), h('div', { style: cel }, 'DISPONÍVEL'), h('div', { style: cel }, 'PREÇO')
          ),
          grupos.length === 0
            ? h('div', { style: { textAlign: 'center', padding: 24, color: '#888', fontSize: 11 } }, 'Nenhum mapa disponível para este pedido.')
            : grupos.map(function (g) {
                return h(React.Fragment, { key: g.mapa.id },
                  h('div', { style: { padding: '7px 8px 5px', fontWeight: 800, fontSize: 10.5, color: '#5b21b6', background: '#faf8ff', borderTop: '2px solid #e4d6ff', display: 'flex', alignItems: 'center', gap: 8 } },
                    h('span', null, '▾ MAPA ' + (g.mapa.numero != null ? g.mapa.numero : '?') + (g.mapa.id === po.mapa_id ? ' (mapa deste pedido)' : '')),
                    !g.ehBase && h('span', { onClick: function () { setExtras(function (p) { return p.filter(function (x) { return x !== g.mapa.id; }); }); setSel(function (p) { return p.filter(function (k) { return k.indexOf(g.mapa.id + '|') !== 0; }); }); }, title: 'Tirar este mapa da lista', 'data-add-tirar-mapa': g.mapa.id, style: { cursor: 'pointer', background: '#e8eeff', color: '#2a5298', borderRadius: 10, padding: '1px 8px', fontSize: 9 } }, 'tirar ✕')
                  ),
                  g.linhas.length === 0 && h('div', { style: { padding: '10px 8px', fontSize: 11, color: '#888' } }, termo ? 'Nenhum insumo encontrado neste mapa para "' + termo + '"' : 'Este mapa não tem insumos.'),
                  g.linhas.map(function (l) {
                    var s = situacao(l); var bloq = !!l.motivo; var marcado = sel.indexOf(l.key) >= 0 && !bloq;
                    if (compacto) {
                      var vlr = function (rot, val, cor) { return h('span', null, rot + ' ', h('b', { style: { color: cor || '#333' } }, val)); };
                      return h('div', { key: l.key, 'data-add-row': l.item.id, 'data-add-motivo': l.motivo || 'ok', style: { display: 'grid', gridTemplateColumns: '42px minmax(0,1fr)', alignItems: 'start', borderBottom: '1px solid #eee', fontSize: 11, background: marcado ? '#f5f0ff' : 'transparent', opacity: bloq ? 0.6 : 1 } },
                        h('div', { style: { padding: '10px 4px' } },
                          h('input', { type: 'checkbox', checked: marcado, disabled: bloq, 'data-add-check': l.item.id, title: bloq ? s.t : '', onChange: function () { if (!bloq) alterna(l.key); }, style: { cursor: bloq ? 'not-allowed' : 'pointer', accentColor: '#7c3aed', width: 22, height: 22, display: 'block', margin: '0 auto' } })
                        ),
                        h('div', { style: { padding: '8px 8px 8px 2px', textAlign: 'left', minWidth: 0 } },
                          h('div', { style: { wordBreak: 'break-word' } }, h('strong', null, l.item.num + '. ' + (l.item.descricao || '')), l.item.detalhe ? h('span', { style: { fontSize: 9, color: '#666' } }, ' \u2014 ' + l.item.detalhe) : null),
                          h('div', { style: { margin: '3px 0 5px' } }, h('span', { style: { background: s.bg, color: s.c, padding: '1px 7px', borderRadius: 99, fontSize: 9, fontWeight: 'bold' } }, s.t)),
                          h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '3px 12px', fontSize: 10, color: '#555' } },
                            vlr('Total', (l.total || 0) + (l.item.unid ? ' ' + l.item.unid : '')),
                            vlr('J\u00e1 pedida', l.pedida || 0, '#185FA5'),
                            vlr('Almox.', l.almox > 0 ? l.almox : '\u2014', l.almox > 0 ? '#7c3aed' : '#888'),
                            vlr('Dispon\u00edvel', l.motivo === 'no-pedido' ? '\u2014' : l.disp, l.motivo === 'no-pedido' ? '#888' : (l.disp > 0 ? '#b06000' : '#2d5a0b')),
                            vlr('Pre\u00e7o', l.preco ? 'R$ ' + fmtBRL(l.preco) : '\u2014', l.preco ? '#2d5a0b' : '#888')
                          )
                        )
                      );
                    }
                    return h('div', { key: l.key, 'data-add-row': l.item.id, 'data-add-motivo': l.motivo || 'ok', style: { display: 'grid', gridTemplateColumns: COLS, alignItems: 'center', borderBottom: '1px solid #eee', fontSize: 11, textAlign: 'center', background: marcado ? '#f5f0ff' : 'transparent', opacity: bloq ? 0.6 : 1 } },
                      h('div', { style: { padding: '8px 4px' } },
                        h('input', { type: 'checkbox', checked: marcado, disabled: bloq, 'data-add-check': l.item.id, title: bloq ? s.t : '', onChange: function () { if (!bloq) alterna(l.key); }, style: { cursor: bloq ? 'not-allowed' : 'pointer', accentColor: '#7c3aed', width: 22, height: 22, display: 'block', margin: '0 auto' } })
                      ),
                      h('div', { style: { fontWeight: 'bold' } }, l.item.num),
                      h('div', { style: { padding: '6px', textAlign: 'left' } },
                        h('strong', null, l.item.descricao || ''),
                        l.item.detalhe ? h('span', { style: { fontSize: 9, color: '#666' } }, ' — ' + l.item.detalhe) : null,
                        h('br', null),
                        h('span', { style: { background: s.bg, color: s.c, padding: '1px 7px', borderRadius: 99, fontSize: 9, fontWeight: 'bold' } }, s.t)
                      ),
                      h('div', null, (l.total || 0) + (l.item.unid ? ' ' + l.item.unid : '')),
                      h('div', { style: { color: '#185FA5', fontWeight: 'bold' } }, l.pedida || 0),
                      h('div', { style: { color: l.almox > 0 ? '#7c3aed' : '#888', fontWeight: 'bold' } }, l.almox > 0 ? l.almox : '—'),
                      h('div', { style: { color: l.motivo === 'no-pedido' ? '#888' : (l.disp > 0 ? '#b06000' : '#2d5a0b'), fontWeight: 'bold' } }, l.motivo === 'no-pedido' ? '—' : l.disp),
                      h('div', { style: { fontWeight: 'bold', color: l.preco ? '#2d5a0b' : '#888' } }, l.preco ? 'R$ ' + fmtBRL(l.preco) : '—')
                    );
                  })
                );
              })
        ),
        outrosDaObra.length > 0 && h('div', { style: { marginTop: 10 } },
          !mostrarSeletor
            ? h('div', { onClick: function () { setMostrarSeletor(true); }, 'data-add-outro-mapa': '1', style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#f9f6ff', border: '2px dashed #b794f6', borderRadius: 8, padding: '10px 12px', cursor: 'pointer', color: '#7c3aed', fontWeight: 700, fontSize: 11 } }, '➕ Trazer itens de outro mapa desta obra')
            : h('div', { style: { background: '#faf8ff', border: '1px solid #d4b8ff', borderRadius: 8, padding: 10 } },
                h('label', { style: { fontSize: 9, fontWeight: 700, color: '#666', display: 'block', marginBottom: 5 } }, 'ESCOLHA O MAPA (só aparecem mapas da mesma obra):'),
                h('select', { value: '', 'data-add-select-mapa': '1', onChange: function (e) { var v = e.target.value; if (v) { setExtras(function (p) { return p.indexOf(v) >= 0 ? p : p.concat([v]); }); setMostrarSeletor(false); } }, style: { width: '100%', padding: 7, border: '1px solid #ccc', borderRadius: 5, fontSize: 11 } },
                  h('option', { value: '' }, '— selecione —'),
                  outrosDaObra.map(function (m) { return h('option', { key: m.id, value: m.id }, 'MP ' + m.numero + ' · ' + (m.obra || '')); })
                ),
                h('div', { onClick: function () { setMostrarSeletor(false); }, style: { fontSize: 9, color: '#888', marginTop: 6, cursor: 'pointer', textAlign: 'right' } }, 'cancelar')
              )
        )
      ),
      h('div', { style: { display: 'flex', gap: 8, padding: '12px 14px', borderTop: '1px solid #eee', alignItems: 'center' } },
        h('span', { style: { flex: 1, fontSize: 10, color: '#666' }, 'data-add-contagem': '1' }, h('strong', { style: { color: '#7c3aed' } }, selValidas.length), ' item(ns) selecionado(s)'),
        h('button', { onClick: onClose, style: { background: '#f0f0f0', border: 'none', padding: '8px 16px', borderRadius: 4, fontSize: 11, cursor: 'pointer', minHeight: 40 } }, 'Cancelar'),
        h('button', {
          onClick: function () {
            if (selValidas.length === 0) { alert('Selecione pelo menos 1 item.'); return; }
            var vistos = {}; var lista = [];
            selValidas.forEach(function (l) { if (vistos[l.item.id]) return; vistos[l.item.id] = 1; lista.push({ item: l.item, mapa: l.mapa, preco: l.preco, disp: l.disp }); });
            onConfirmar(lista);
          },
          'data-add-confirmar': '1',
          style: { background: '#7c3aed', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 4, fontSize: 11, cursor: 'pointer', fontWeight: 'bold', minHeight: 40 }
        }, 'Adicionar ao pedido →')
      )
    )
  );
}
