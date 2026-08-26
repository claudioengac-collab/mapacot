function MapEditor(_ref15) {
  var init = _ref15.mapa,
    onBack = _ref15.onBack,
    onSave = _ref15.onSave,
    cadastros = _ref15.cadastros,
    addCadastro = _ref15.addCadastro,
    removeCadastro = _ref15.removeCadastro,
    editCadastro = _ref15.editCadastro,
    setObsFornecedor = _ref15.setObsFornecedor || function(){},
    orcamentos = _ref15.orcamentos || {},
    associacoes = _ref15.associacoes || [],
    onSaveOrcamento = _ref15.onSaveOrcamento || null,
    onLimparOrcamento = _ref15.onLimparOrcamento || null,
    onGerenciarOrcamento = _ref15.onGerenciarOrcamento || null,
    onCriarAssociacao = _ref15.onCriarAssociacao || null,
    onRemoverAssociacao = _ref15.onRemoverAssociacao || null,
    onSubstituirAssociacoes = _ref15.onSubstituirAssociacoes || null,
    mapas = _ref15.mapas || [];
var gerOrcMapEditor = onGerenciarOrcamento;
  var _useStateGerEd = useState(false);
var showGerEd = _slicedToArray(_useStateGerEd,2)[0], setShowGerEd = _slicedToArray(_useStateGerEd,2)[1];
var _useStateObraGerEd = useState(null);
var obraGerEd = _slicedToArray(_useStateObraGerEd,2)[0], setObraGerEd = _slicedToArray(_useStateObraGerEd,2)[1];
var _useState27 = useState(init),
    _useState28 = _slicedToArray(_useState27, 2),
    mapa = _useState28[0],
    setMapa = _useState28[1];
  var _useState29 = useState(true),
    _useState30 = _slicedToArray(_useState29, 2),
    saved = _useState30[0],
    setSaved = _useState30[1];
  var _useState31 = useState(""),
    _useState32 = _slicedToArray(_useState31, 2),
    filter = _useState32[0],
    setFilter = _useState32[1];
  var _useStateOcultos = useState(new Set()),
    ocultos = _slicedToArray(_useStateOcultos, 2)[0],
    setOcultos = _slicedToArray(_useStateOcultos, 2)[1];
  var toggleOculto = function(id) {
    setOcultos(function(prev) {
      var next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  var toggleExcluido = function(id) {
    var item = itens.find(function(i){ return i.id === id; });
    if (item) updItem(id, 'excluido', !item.excluido);
  };
  var _useStateFornOcultos = useState(new Set()),
    fornOcultos = _slicedToArray(_useStateFornOcultos, 2)[0],
    setFornOcultos = _slicedToArray(_useStateFornOcultos, 2)[1];
  var toggleFornOculto = function(id) {
    setFornOcultos(function(prev) {
      var next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  var _useState33 = useState(false),
    _useState34 = _slicedToArray(_useState33, 2),
    showTheme = _useState34[0],
    setShowTheme = _useState34[1];
  var _useStateCasar=useState(false),showCasar=_slicedToArray(_useStateCasar,2)[0],setShowCasar=_slicedToArray(_useStateCasar,2)[1];
  var _useStateIA=useState(false),showLerIA=_slicedToArray(_useStateIA,2)[0],setShowLerIA=_slicedToArray(_useStateIA,2)[1];
  var _useStateAnal=useState(false),inclAnalise=_slicedToArray(_useStateAnal,2)[0],setInclAnalise=_slicedToArray(_useStateAnal,2)[1];
  var _useStateDash=useState(false),showDashboard=_slicedToArray(_useStateDash,2)[0],setShowDashboard=_slicedToArray(_useStateDash,2)[1];
  // ── V4 CSS — Estados de Pedidos de Compra ──────────────────────────────────
  var _useStatePOM=useState(false),showPedidoModal=_slicedToArray(_useStatePOM,2)[0],setShowPedidoModal=_slicedToArray(_useStatePOM,2)[1];
  var _useStatePOC=useState(false),showPedidoConfig=_slicedToArray(_useStatePOC,2)[0],setShowPedidoConfig=_slicedToArray(_useStatePOC,2)[1];
  var _useStatePOS=useState(false),showPedidos=_slicedToArray(_useStatePOS,2)[0],setShowPedidos=_slicedToArray(_useStatePOS,2)[1];
  // Estados para edição de pedido existente
  var _useStatePOEdit=useState(null),poEmEdicao=_slicedToArray(_useStatePOEdit,2)[0],setPoEmEdicao=_slicedToArray(_useStatePOEdit,2)[1];
  var _useStatePOEShow=useState(false),showPedidoEdicao=_slicedToArray(_useStatePOEShow,2)[0],setShowPedidoEdicao=_slicedToArray(_useStatePOEShow,2)[1];
  var _useStateCfgEd=useState({}),configEdicao=_slicedToArray(_useStateCfgEd,2)[0],setConfigEdicao=_slicedToArray(_useStateCfgEd,2)[1];
  // FIX (pedido do Claudio, implementação alinhada com layout aprovado): rastreia quais OUTROS
  // mapas (da mesma obra) foram incluídos na seleção de itens do pedido em andamento. Fica vazio
  // ([]) na maior parte do tempo — só é usado enquanto o modal de criar pedido está aberto, e é
  // limpo ao fechar. Puramente aditivo: não interfere em nada do fluxo de um único mapa (o caso
  // mais comum), que continua funcionando exatamente igual quando esta lista está vazia.
  var _useStateMapasAdic=useState([]),mapasAdicionaisPO=_slicedToArray(_useStateMapasAdic,2)[0],setMapasAdicionaisPO=_slicedToArray(_useStateMapasAdic,2)[1];
  var _useStateImpExcel=useState(false),showImportExcel=_slicedToArray(_useStateImpExcel,2)[0],setShowImportExcel=_slicedToArray(_useStateImpExcel,2)[1];
  var _useStateSIP=useState([]),itensSelecionadosPO=_slicedToArray(_useStateSIP,2)[0],setItensSelecionadosPO=_slicedToArray(_useStateSIP,2)[1];
  var _useStatePOCfg=useState({}),pedidoConfig=_slicedToArray(_useStatePOCfg,2)[0],setPedidoConfig=_slicedToArray(_useStatePOCfg,2)[1];
  var _useStatePOFin=useState({}),poFinanceiro=_slicedToArray(_useStatePOFin,2)[0],setPoFinanceiro=_slicedToArray(_useStatePOFin,2)[1];
  var _useStatePedidos=useState([]),pedidos=_slicedToArray(_useStatePedidos,2)[0],setPedidos=_slicedToArray(_useStatePedidos,2)[1];
  var _useStatePOFiltros=useState({obra:'',periodo:'',insumo:'',fornecedor:'',status:''}),pedidoFiltros=_slicedToArray(_useStatePOFiltros,2)[0],setPedidoFiltros=_slicedToArray(_useStatePOFiltros,2)[1];
  var _useStateTooltip=useState(null),tooltipItemId=_slicedToArray(_useStateTooltip,2)[0],setTooltipItemId=_slicedToArray(_useStateTooltip,2)[1];
  // ───────────────────────────────────────────────────────────────────────────
  var _useStateIAD=useState({leituras:0,custo:0}),iaUsoDia=_slicedToArray(_useStateIAD,2)[0],setIaUsoDia=_slicedToArray(_useStateIAD,2)[1];
  useEffect(function(){ sbGetIaUsoDia().then(function(d){ setIaUsoDia(d); }); },[]);
  var _useStateApr=useState({}),aprendizados=_slicedToArray(_useStateApr,2)[0],setAprendizados=_slicedToArray(_useStateApr,2)[1];
  useEffect(function(){ sbBuscarAprendizados().then(function(m){ setAprendizados(m); }); },[]);
  var registrarAprendizado = function(textoOriginal, insumoDescricao){
    logEventoDiag("ENSINAR SISTEMA: \"" + String(textoOriginal||'').slice(0,40) + "\" \u2192 " + insumoDescricao);
    sbSalvarAprendizado(textoOriginal, insumoDescricao).catch(function(){
      window.avisarErroSalvamento('Não foi possível salvar o aprendizado. Verifique sua conexão.');
    });
    var chave = String(textoOriginal||'').trim().toUpperCase();
    setAprendizados(function(prev){ var n = Object.assign({}, prev); n[chave] = insumoDescricao; return n; });
  };
  var desfazerAprendizado = function(textoOriginal){
    var chave = String(textoOriginal||'').trim().toUpperCase();
    logEventoDiag("ENSINAR SISTEMA (desfazer): \"" + chave.slice(0,40) + "\"");
    return sbExcluirAprendizado(chave).then(function(ok){
      if(ok){
        setAprendizados(function(prev){ var n = Object.assign({}, prev); delete n[chave]; return n; });
      }
      return ok;
    });
  };
  var _useStateEns=useState(false),showEnsinarSistema=_slicedToArray(_useStateEns,2)[0],setShowEnsinarSistema=_slicedToArray(_useStateEns,2)[1];
  useEffect(function(){ sbGetPedidos().then(function(d){ setPedidos(d||[]); }); },[]);
  useEffect(function(){
    if(mapa && mapa.id){ sbGetPedidos().then(function(d){ setPedidos(d||[]); }); }
  },[mapa && mapa.id]);
  var _useState35 = useState(new Date()),
    _useState36 = _slicedToArray(_useState35, 2),
    clock = _useState36[0],
    setClock = _useState36[1];
  // FIX: data de criação do mapa, validada (cai para "clock" se ausente ou corrompida) — usada
  // para mostrar "CRIADO EM" separado de "VISUALIZADO EM" no cabeçalho da tela.
  var dataCriacaoMapaValida = (function () {
    if (!mapa.criadoEm) return clock; // FIX: new Date(null/undefined/"") viraria 1970 (data "válida" mas errada)
    var d = new Date(mapa.criadoEm);
    return isNaN(d.getTime()) ? clock : d;
  })();
  var saveTimer = useRef();
  // FIX: ref que sempre aponta para o valor MAIS RECENTE de "mapa" — necessária porque a
  // variável "mapa" capturada dentro de um onClick (closure) fica presa no valor de QUANDO o
  // clique aconteceu; se atrasarmos a ação com setTimeout (para esperar um campo confirmar),
  // usar a variável direta ainda pegaria o valor ANTIGO. A ref sempre reflete o estado atual.
  var mapaRef = useRef(mapa);
  // FIX: rastreia, de forma síncrona (sem depender de re-render), se há uma edição feita mas
  // ainda não enviada para salvar — necessária para flushSalvar decidir corretamente mesmo
  // quando chamada imediatamente após uma edição, antes do React atualizar o state "saved".
  var pendenteRef = useRef(false);
  useEffect(function(){ mapaRef.current = mapa; }, [mapa]);
  // FIX: popup de observação do fornecedor — aparece ao escolher um fornecedor que tem
  // observação salva, e só fecha quando o usuário clicar em qualquer outro lugar da tela.
  var _useStateObsPopup = useState(null),
    obsPopupFornecedor = _slicedToArray(_useStateObsPopup, 2)[0],
    setObsPopupFornecedor = _slicedToArray(_useStateObsPopup, 2)[1];
  // FIX: fecha o popup de observação assim que o usuário clicar em qualquer lugar da tela
  // (o próprio popup também tem um X, mas o pedido era "só sumir ao clicar em outro campo").
  useEffect(function () {
    if (!obsPopupFornecedor) return;
    var fechar = function () { setObsPopupFornecedor(null); };
    // setTimeout(0) evita que o MESMO clique que abriu o popup (o commit do nome) já o feche
    var t = setTimeout(function () { document.addEventListener("click", fechar); }, 0);
    return function () { clearTimeout(t); document.removeEventListener("click", fechar); };
  }, [obsPopupFornecedor]);
  var mapContainerRef = useRef();
  var tableRef = useRef();
  // Estados do modal de associação
  var _sIA = React.useState(null), itemAssociando = _slicedToArray(_sIA,2)[0], setItemAssociando = _slicedToArray(_sIA,2)[1];
  var _sBu = React.useState(""), assocBusca = _slicedToArray(_sBu,2)[0], setAssocBusca = _slicedToArray(_sBu,2)[1];
  var _sSug = React.useState(null), assocSug = _slicedToArray(_sSug,2)[0], setAssocSug = _slicedToArray(_sSug,2)[1];
  var _sSel = React.useState({}), assocSelecionados = _slicedToArray(_sSel,2)[0], setAssocSelecionados = _slicedToArray(_sSel,2)[1];
  // Estados modal importação dentro do editor
  var _sIE = React.useState(false), showImpEd = _slicedToArray(_sIE,2)[0], setShowImpEd = _slicedToArray(_sIE,2)[1];
  var _sOE = React.useState(null), obraImpEd = _slicedToArray(_sOE,2)[0], setObraImpEd = _slicedToArray(_sOE,2)[1];
  // Carregar orçamento desta obra ao montar
  React.useEffect(function() {
    if (!init.obra || !onSaveOrcamento) return;
    sbCarregarOrcamento(init.obra).then(function(dados) {
      if (dados) onSaveOrcamento(init.obra, zerarConsumido(dados));
    }).catch(function(){ window.avisarErroSalvamento('Não foi possível salvar as alterações do mapa. Verifique sua conexão.'); });
  }, []);
  var _useState37 = useState(false),
    _useState38 = _slicedToArray(_useState37, 2),
    showColPanel = _useState38[0],
    setShowColPanel = _useState38[1];
  var _useStateConfigMenu = useState(false),
    _useStateConfigMenu2 = _slicedToArray(_useStateConfigMenu, 2),
    showConfigMenu = _useStateConfigMenu2[0],
    setShowConfigMenu = _useStateConfigMenu2[1];
  var configBtnRef = useRef(null); // FIX: ref do botão, para calcular a posição do portal
  var configPortalRef = useRef(null); // FIX: ref do conteúdo do menu (agora fora da árvore original)
  var _useStateConfigPos = useState(null),
    _useStateConfigPos2 = _slicedToArray(_useStateConfigPos, 2),
    configMenuPos = _useStateConfigPos2[0],
    setConfigMenuPos = _useStateConfigPos2[1];
  useEffect(function(){
    function aoClicarForaConfig(e){
      var cliqueNoBotao = configBtnRef.current && configBtnRef.current.contains(e.target);
      var cliqueNoPortal = configPortalRef.current && configPortalRef.current.contains(e.target);
      if (!cliqueNoBotao && !cliqueNoPortal) {
        setShowConfigMenu(false);
      }
    }
    document.addEventListener('mousedown', aoClicarForaConfig);
    // FIX: fecha o menu se a página rolar, para evitar posição desatualizada (menu via portal usa position:fixed)
    function aoRolar(){ setShowConfigMenu(false); }
    window.addEventListener('scroll', aoRolar, true);
    window.addEventListener('resize', aoRolar);
    return function(){
      document.removeEventListener('mousedown', aoClicarForaConfig);
      window.removeEventListener('scroll', aoRolar, true);
      window.removeEventListener('resize', aoRolar);
    };
  }, []);
  var _useStateCad = useState(false),
    _useStateCad2 = _slicedToArray(_useStateCad, 2),
    showCadEditor = _useStateCad2[0],
    setShowCadEditor = _useStateCad2[1];
  var _useState39 = useState({
      resumo: false,
      orcamento: false
    }),
    _useState40 = _slicedToArray(_useState39, 2),
    hiddenCols = _useState40[0],
    setHiddenCols = _useState40[1];

  var toggleCol = function toggleCol(key) {
    return setHiddenCols(function (prev) {
      logEventoDiag((prev[key] ? "MOSTRAR" : "OCULTAR") + " coluna: " + key + " (mapa " + (mapa && mapa.numero != null ? mapa.numero : "?") + ", local)");
      return _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, key, !prev[key]));
    });
  };
  // Estado para ocultar coluna ORÇADO (fica visível riscada, igual a fornecedores/linhas)
  var _useStateOrcOculto = useState(false),
    orcOculto = _slicedToArray(_useStateOrcOculto, 2)[0],
    setOrcOculto = _slicedToArray(_useStateOrcOculto, 2)[1];
  useEffect(function () {
    var t = setInterval(function () {
      return setClock(new Date());
    }, 30000);
    return function () {
      return clearInterval(t);
    };
  }, []);
  var update = useCallback(function (fn) {
    setMapa(function (prev) {
      return fn(_objectSpread(_objectSpread({}, prev), {}, {
        precos: _objectSpread({}, prev.precos),
        rodape: _objectSpread({}, prev.rodape),
        atualizadoEm: new Date().toISOString()
      }));
    });
    pendenteRef.current = true; // FIX: marca IMEDIATAMENTE (síncrono) que há uma edição não
    // salva ainda — ver explicação completa abaixo, junto de flushSalvar.
    setSaved(false);
  }, []);
  var updateUI = function updateUI(fn) {
    setMapa(function (prev) {
      return fn(_objectSpread(_objectSpread({}, prev), {}, {
        precos: _objectSpread({}, prev.precos),
        rodape: _objectSpread({}, prev.rodape)
      }));
    });
  };
  // FIX: reescrita completa do mecanismo de salvamento (debounce real), motivada por relatos
  // reais de dados perdidos que persistiam mesmo após várias correções pontuais. ANTES: cada
  // edição disparava uma requisição de salvamento quase imediata, exigindo uma fila complexa de
  // versionamento no servidor para lidar com múltiplas chamadas simultâneas — essa complexidade
  // se mostrou frágil. AGORA: só existe UM salvamento pendente por vez; uma nova edição CANCELA
  // e SUBSTITUI o anterior (debounce de verdade, só salva depois de uma pausa real na digitação);
  // e ao sair do mapa, um "flush" explícito FORÇA o salvamento imediato e AGUARDA ele completar
  // antes de navegar, sempre usando o valor mais recente (via mapaRef, não a variável capturada).
  //
  // FIX ADICIONAL (encontrado numa releitura cuidadosa, sem esperar por outro relato): usar a
  // variável "saved" (state do React) para decidir se há algo pendente era uma falha real —
  // "saved" só reflete o valor mais recente DEPOIS que o React termina de re-renderizar. Se o
  // usuário editar um campo e clicar em "voltar" muito rapidamente (antes desse re-render
  // acontecer), flushSalvar podia enxergar o "saved" ANTIGO (ainda true, de antes da edição) e
  // concluir — errado — que não havia nada para salvar. pendenteRef resolve isso: é atualizada
  // de forma síncrona e imediata dentro de update(), sem depender do ciclo de render do React.
  var dispararSalvamento = function() {
    pendenteRef.current = false;
    return onSave(mapaRef.current).then(function(){ setSaved(true); }).catch(function(){ setSaved(true); });
  };
  useEffect(function () {
    if (saved) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(dispararSalvamento, 900);
    return function(){ clearTimeout(saveTimer.current); };
  }, [mapa, saved]);
  var flushSalvar = function() {
    clearTimeout(saveTimer.current);
    if (!pendenteRef.current) return Promise.resolve();
    return dispararSalvamento();
  };
  // FIX (multi-abas, causa real do "editei e não salvou / voltou ao valor anterior"): quando o
  // usuário mantém o MESMO mapa aberto em duas abas e alterna entre elas, a aba que ficou em
  // segundo plano continua com dados VELHOS. Antes, qualquer edição feita nela era bloqueada
  // pela proteção de conflito (para não sobrescrever o servidor) — correto, mas o trabalho do
  // usuário era descartado após o aviso, parecendo que "não salvou nada". Agora: sempre que a
  // aba volta a ficar visível/em foco, se NÃO há edição local pendente, buscamos a versão do
  // servidor; se houver algo mais novo (salvo pela outra aba), recarregamos os dados
  // automaticamente. Assim o usuário sempre edita em cima da versão mais recente e o
  // salvamento seguinte funciona normalmente, sem conflito e sem perda.
  var verificandoVersaoRef = useRef(false);
  useEffect(function () {
    var aoGanharFoco = function () {
      if (document.visibilityState && document.visibilityState !== "visible") return;
      if (verificandoVersaoRef.current) return;         // já tem uma verificação em andamento
      if (pendenteRef.current) return;                   // há edição local ainda não enviada
      if (saveTimer.current) { /* timer de debounce pode estar ativo */ }
      if (!saved) return;                                // salvamento em andamento/pendente
      var idMapa = mapaRef.current && mapaRef.current.id;
      if (!idMapa) return;
      verificandoVersaoRef.current = true;
      var estadoSv = (typeof estadoSalvamentoMapa !== "undefined" && estadoSalvamentoMapa[idMapa]) || null;
      var versaoLocal = (estadoSv && estadoSv.ultimaVersaoConhecida) || mapaRef.current._versaoServidor || null;
      fetch("".concat(SUPABASE_URL, "/rest/v1/mapas?id=eq.").concat(idMapa, "&select=dados,atualizado_em"), { headers: SB, cache: "no-store" })
        .then(function(r){ return r.ok ? r.json() : null; })
        .then(function(rows){
          var linha = rows && rows[0];
          if (!linha || !linha.dados) return;
          if (versaoLocal && mesmaVersaoTs(linha.atualizado_em, versaoLocal)) return; // nada mudou
          // Outra aba/dispositivo salvou algo mais novo: recarrega silenciosamente.
          if (pendenteRef.current) { logEventoDiag("FOCO: servidor mais novo, mas h\u00e1 edi\u00e7\u00e3o local pendente \u2014 atualiza\u00e7\u00e3o adiada (dados locais preservados)"); return; } // re-checa: usuário pode ter editado durante o fetch
          logEventoDiag("FOCO: servidor mais novo \u2014 mapa recarregado automaticamente (vers\u00e3o " + linha.atualizado_em + ", " + (((linha.dados||{}).itens||[]).length) + " itens)");
          var atualizado = Object.assign({}, linha.dados, { _versaoServidor: linha.atualizado_em });
          setMapa(atualizado);
          setSaved(true);
          if (estadoSv) estadoSv.ultimaVersaoConhecida = linha.atualizado_em;
          else if (typeof estadoSalvamentoMapa !== "undefined") {
            estadoSalvamentoMapa[idMapa] = { fila: Promise.resolve(), ultimaVersaoConhecida: linha.atualizado_em };
          }
        })
        .catch(function(){ /* falha de rede: mantém o que está na tela, sem bloquear */ })
        .then(function(){ verificandoVersaoRef.current = false; });
    };
    document.addEventListener("visibilitychange", aoGanharFoco);
    window.addEventListener("focus", aoGanharFoco);
    return function () {
      document.removeEventListener("visibilitychange", aoGanharFoco);
      window.removeEventListener("focus", aoGanharFoco);
    };
  }, [saved]);
  var addItem = function addItem() {
    try { logEventoDiag("ADD item " + (((mapaRef.current && mapaRef.current.itens) || []).length + 1)); } catch (e) {}
    return update(function (m) {
      return _objectSpread(_objectSpread({}, m), {}, {
        itens: [].concat(_toConsumableArray(m.itens), [emptyItem(m.itens.length + 1)])
      });
    });
  };
  var removeItem = function removeItem(id) {
    return update(function (m) {
      var itens = m.itens.filter(function (i) {
        return i.id !== id;
      }).map(function (x, i) {
        return _objectSpread(_objectSpread({}, x), {}, {
          num: i + 1
        });
      });
      var precos = _objectSpread({}, m.precos);
      Object.keys(precos).forEach(function (k) {
        if (k.startsWith(id)) delete precos[k];
      });
      return _objectSpread(_objectSpread({}, m), {}, {
        itens: itens,
        precos: precos
      });
    });
  };
  var updItem = function updItem(id, f, v) {
    // DIAGNÓSTICO: registra cada edição de campo que ENTRA no estado. Se uma digitação não
    // aparecer aqui, ela nunca chegou ao estado (problema no commit do campo); se aparecer
    // aqui mas não no servidor, o problema está no salvamento/sobrescrita.
    try {
      var itemDiag = (mapaRef.current && mapaRef.current.itens || []).find(function (x) { return x.id === id; });
      logEventoDiag("EDIT item " + (itemDiag ? itemDiag.num : "?") + " " + f + " = \"" + (v === null || v === undefined ? "" : String(v)) + "\"");
    } catch (e) {}
    update(function (m) {
      return _objectSpread(_objectSpread({}, m), {}, {
        itens: m.itens.map(function (i) {
          return i.id === id ? _objectSpread(_objectSpread({}, i), {}, _defineProperty({}, f, v)) : i;
        })
      });
    });
  };
  var addForn = function addForn() {
    return update(function (m) {
      return _objectSpread(_objectSpread({}, m), {}, {
        fornecedores: [].concat(_toConsumableArray(m.fornecedores), [emptyForn()])
      });
    });
  };
  var removeForn = function removeForn(id) {
    return update(function (m) {
      var fornecedores = m.fornecedores.filter(function (f) {
        return f.id !== id;
      });
      var precos = _objectSpread({}, m.precos);
      Object.keys(precos).forEach(function (k) {
        if (k.endsWith("_".concat(id))) delete precos[k];
      });
      var rodape = _objectSpread({}, m.rodape);
      delete rodape[id];
      return _objectSpread(_objectSpread({}, m), {}, {
        fornecedores: fornecedores,
        precos: precos,
        rodape: rodape
      });
    });
  };
  var updForn = function updForn(id, f, v, skipSave) {
    (skipSave ? updateUI : update)(function (m) {
      return _objectSpread(_objectSpread({}, m), {}, {
        fornecedores: m.fornecedores.map(function (x) {
          return x.id === id ? _objectSpread(_objectSpread({}, x), {}, _defineProperty({}, f, v)) : x;
        })
      });
    });
  };
  var setPreco = function setPreco(iid, fid, v) {
    return update(function (m) {
      return _objectSpread(_objectSpread({}, m), {}, {
        precos: _objectSpread(_objectSpread({}, m.precos), {}, _defineProperty({}, "".concat(iid, "_").concat(fid), v))
      });
    });
  };
  var setDetalheForn = function setDetalheForn(iid, fid, v) {
    return update(function (m) {
      return _objectSpread(_objectSpread({}, m), {}, {
        detalhes: _objectSpread(_objectSpread({}, m.detalhes || {}), {}, _defineProperty({}, "".concat(iid, "_").concat(fid), v))
      });
    });
  };
  var setRodape = function setRodape(fid, f, v) {
    return update(function (m) {
      return _objectSpread(_objectSpread({}, m), {}, {
        rodape: _objectSpread(_objectSpread({}, m.rodape), {}, _defineProperty({}, fid, _objectSpread(_objectSpread({}, m.rodape[fid] || {}), {}, _defineProperty({}, f, v))))
      });
    });
  };
  var setRodapeResumo = function setRodapeResumo(f, v) {
    return setRodape("__resumo__", f, v);
  };
  var setObsGeral = function setObsGeral(v) {
    return update(function (m) {
      return _objectSpread(_objectSpread({}, m), {}, {
        obsGeral: v
      });
    });
  };
  // ── Helpers de orçamento ──────────────────────────────────────────────────
  var obraOrc = mapa.obra ? (orcamentos[mapa.obra]||null) : null;
  var obraOrcItens = obraOrc ? (Array.isArray(obraOrc) ? obraOrc : (obraOrc.itens||[])) : [];
  var temOrcamento = obraOrcItens.length > 0;
  var getAssocItem = function(iid) {
    return associacoes.find(function(a){ return a.mapaId===mapa.id && a.itemMapaId===iid; })||null;
  };
  var getAssocItens = function(iid) {
    return associacoes.filter(function(a){ return a.mapaId===mapa.id && a.itemMapaId===iid; });
  };
  var calcVlOrc = function(assoc) {
    if (!assoc) return null;
    var oi = obraOrcItens.find(function(it){ return it.codigo===assoc.orcItemCodigo; });
    return oi ? (parseFloat(oi.valorUnitario)||0) * (parseFloat(assoc.fator)||1) : null;
  };
  var calcRes = function(item, assoc) {
    if (!assoc) return null;
    var vlo = calcVlOrc(assoc); if (!vlo) return null;
    var res = calcResumo(item, mapa.fornecedores, mapa.precos);
    if (res.vlUnit === null) return null;
    var diff = vlo - res.vlUnit;
    var qt = parseFloat(String(item.qt).replace(",","."))||0;
    return { diff: diff, pct: (diff/vlo)*100, lucro: diff>=0, total: diff*qt };
  };
  var abrirAssoc = function(item) {
    if (!temOrcamento) return;
    var aes = getAssocItens(item.id);
    setItemAssociando(item);
    setAssocBusca(item.descricao||"");
    var selInicial = {};
    aes.forEach(function(ae) {
      var idx = ae.orcItemIndex != null ? ae.orcItemIndex : obraOrcItens.findIndex(function(it){ return it.codigo===ae.orcItemCodigo; });
      if (idx >= 0) selInicial[idx] = { qt: String(ae.qtCompra||""), fator: String(ae.fator||"1") };
    });
    setAssocSelecionados(selInicial);
  };
  var confirmarAssoc = function() {
    if (!itemAssociando || !onCriarAssociacao) return;
    var indices = Object.keys(assocSelecionados);
    if (indices.length === 0) return;
    var aesExistentes = getAssocItens(itemAssociando.id);
    var idsRemover = aesExistentes.map(function(ae){ return ae.id; });
    var novasAssocs = [];
    indices.forEach(function(idxStr) {
      var idx = parseInt(idxStr, 10);
      var orcItem = obraOrcItens[idx];
      if (!orcItem) return;
      var sel = assocSelecionados[idxStr];
      var fator = parseFloat(sel.fator)||1;
      var qt = parseFloat(String(sel.qt).replace(",","."))||0;
      if (qt <= 0) return;
      novasAssocs.push({
        id: uid(), mapaId: mapa.id, itemMapaId: itemAssociando.id,
        obraId: mapa.obra, orcItemCodigo: orcItem.codigo,
        orcItemIndex: idx,
        orcItemDesc: orcItem.descricao, fator: fator,
        unidMapa: itemAssociando.unid, unidOrc: orcItem.unidade,
        qtCompra: qt, excedente: 0, justificativa: ""
      });
    });
    if (onSubstituirAssociacoes) onSubstituirAssociacoes(idsRemover, novasAssocs);
    setItemAssociando(null);
  };

  var itens = mapa.itens,
    fornecedores = mapa.fornecedores,
    precos = mapa.precos,
    detalhes = mapa.detalhes || {},
    rodape = mapa.rodape;
  var rodapeResumo = rodape["__resumo__"] || {};
  var T = getTheme(mapa.corTema);
  // filteredItens e itensVisiveis ANTES de totalBruto e bestFornId (que os usam)
  var filteredItens = filter ? itens.filter(function (i) {
    var termo = filter.trim().toUpperCase();
    if (!termo) return true;
    return (i.descricao||'').toUpperCase().includes(termo) ||
           (i.detalhe||'').toUpperCase().includes(termo);
  }) : itens;
  var itensVisiveis = filteredItens.filter(function(i) { return !ocultos.has(i.id); });
  var fornecedoresVisiveis = fornecedores.filter(function(f) { return !fornOcultos.has(f.id); });
  var itensAtivos = itensVisiveis.filter(function(i) { return !i.excluido; });
  // FIX (implementação alinhada com layout aprovado pelo Claudio): mapas da MESMA obra que o
  // mapa aberto agora, disponíveis para trazer itens ao pedido em andamento — nunca de outra
  // obra, por segurança. Recalculado a cada render (lista pequena, sem custo perceptível),
  // seguindo o mesmo padrão já usado para "itensAtivos" logo acima.
  var mapasDaMesmaObra = (mapas||[]).filter(function(m){ return m && m.id !== mapa.id && (m.obra||'') === (mapa.obra||''); });
  // Lista combinada: itens do mapa aberto agora + itens dos mapas adicionados à seleção (se
  // houver). Cada item ganha 2 campos novos (_mapaOrigemId, _mapaOrigemNumero) que não existiam
  // antes — são só informativos, não interferem em nenhum campo já usado pelo resto do sistema.
  // Quando "mapasAdicionaisPO" está vazio (o caso mais comum, um só mapa), esta lista é
  // idêntica a "itensAtivos" — o fluxo de um único mapa continua funcionando exatamente igual.
  var itensCombinadosPO = itensAtivos.map(function(it){
    return Object.assign({}, it, { _mapaOrigemId: mapa.id, _mapaOrigemNumero: mapa.numero });
  });
  mapasAdicionaisPO.forEach(function(mapaId){
    var m = (mapas||[]).find(function(mm){ return mm && mm.id === mapaId; });
    if (!m) return;
    (m.itens||[]).filter(function(it){ return !it.excluido; }).forEach(function(it){
      itensCombinadosPO.push(Object.assign({}, it, { _mapaOrigemId: m.id, _mapaOrigemNumero: m.numero }));
    });
  });
  // ── V4 CSS — Mapa de itens totalmente atendidos por pedidos ───────────────
  var itensAtendidosMap = {};
  // Usa mapa.itens (lista completa) em vez de itensAtivos (filtra ocultos/excluídos)
  var _itensParaAtend = (mapa && mapa.itens)||[];
  _itensParaAtend.forEach(function(item){
    var qtTotal = Number(item.qt)||0;
    var qtPedida = 0;
    var pedidosVinculados = [];
    // FIX (mesma causa raiz já corrigida em ModalPedidoStep1 — achado ao testar mais um
    // cenário da função de pedido multi-mapa): antes disso, só contava pedidos cujo mapa
    // ÂNCORA era exatamente este mapa aberto agora. Se um item deste mapa foi incluído num
    // pedido criado a partir de OUTRO mapa (a função nova permite isso), o "cadeado" de item
    // atendido nunca aparecia aqui, mesmo o item já tendo sido pedido de verdade. Como
    // "item.id" já é globalmente único, basta procurar por ele — sem precisar também bater o
    // mapa_id do pedido.
    (pedidos||[]).filter(function(po){ return po.status!=='cancelado'; }).forEach(function(po){
      var it = (po.itens||[]).find(function(i){ return i.item_id===item.id; });
      if(it){
        qtPedida += Number(it.qt_pedida)||0;
        pedidosVinculados.push({ num:'PO-'+String(po.numero).padStart(3,'0'), forn:po.fornecedor_nome, qt:it.qt_pedida, status:po.status });
      }
    });
    itensAtendidosMap[item.id] = {
      atendido: qtTotal > 0 && qtPedida >= qtTotal,
      qtTotal: qtTotal,
      qtPedida: qtPedida,
      pedidos: pedidosVinculados
    };
  });
  // ─────────────────────────────────────────────────────────────────────────
  var totalBruto = function totalBruto(fid) {
    return itensAtivos.reduce(function (acc, item) {
      var v = parseMoney(precos["".concat(item.id, "_").concat(fid)]);
      var qt = parseFloat(String(item.qt).replace(",", "."));
      return acc + (v !== null && !isNaN(qt) && qt > 0 ? v * qt : 0);
    }, 0);
  };
  var calcVL = function calcVL(fid) {
    var r = rodape[fid] || {};
    return totalBruto(fid) - Math.max(0, parseMoney(r.desconto) || 0) + Math.max(0, parseMoney(r.impostos) || 0) + Math.max(0, parseMoney(r.frete) || 0) + Math.max(0, parseMoney(r.outros) || 0); // FIX: protege contra valor negativo digitado por engano, que inverteria a conta
  };
  var bestFornId = function () {
    var minVal = null,
      minId = null;
    fornecedoresVisiveis.forEach(function (f) {
      var vl = calcVL(f.id);
      if (vl > 0 && (minVal === null || vl < minVal)) {
        minVal = vl;
        minId = f.id;
      }
    });
    return minId;
  }();
  var resumoTotal = itensAtivos.reduce(function (acc, item) {
    var r = calcResumo(item, fornecedoresVisiveis, precos);
    return acc + (r.vlTotal || 0);
  }, 0);
  var calcVLResumo = function calcVLResumo() {
    return resumoTotal - Math.max(0, parseMoney(rodapeResumo.desconto) || 0) + Math.max(0, parseMoney(rodapeResumo.impostos) || 0) + Math.max(0, parseMoney(rodapeResumo.frete) || 0) + Math.max(0, parseMoney(rodapeResumo.outros) || 0); // FIX: protege contra valor negativo digitado por engano, que inverteria a conta
  };
  // FIX 5: usar "fornecedores" (lista completa) na TELA, não "fornecedoresVisiveis" (filtrada).
  // Antes, ocultar um fornecedor (clicando no "olho") o removia por completo das colunas
  // renderizadas — junto com o próprio botão de reverter, sem nenhuma forma de trazê-lo de volta
  // a não ser saindo e voltando ao mapa. Agora a coluna nunca desaparece, só fica esmaecida
  // (opacity já tratada mais abaixo) — clicar de novo no mesmo botão reverte normalmente.
  // O PDF gerado a partir desta tela (mapaVis, mais abaixo) continua usando fornecedoresVisiveis
  // e por isso continua excluindo corretamente os fornecedores ocultos do relatório — sem mudança.
  var chunks = [];
  for (var i = 0; i < fornecedores.length; i += CHUNK_SIZE) chunks.push(fornecedores.slice(i, i + CHUNK_SIZE));
  if (chunks.length === 0) chunks.push([]);
  var RODAPE_ROWS = [{
    key: "desconto",
    label: "DESCONTO",
    money: true
  }, {
    key: "impostos",
    label: "IMPOSTOS",
    money: true
  }, {
    key: "frete",
    label: "FRETE",
    money: true
  }, {
    key: "outros",
    label: "OUTROS",
    money: true
  }, {
    key: "valorLiquido",
    label: "VALOR LÍQUIDO",
    computed: true
  }, {
    key: "contato",
    label: "CONTATO",
    maxLen: 1000
  }, {
    key: "observacao",
    label: "OBSERVAÇÕES",
    maxLen: 2000
  }];
  var thC = _objectSpread(_objectSpread({}, SC.th), {}, {
    background: T.hdr,
    color: "#fff"
  });
  var thS = _objectSpread(_objectSpread({}, SC.th), {}, {
    background: T.sub,
    color: "#333"
  });
   var calcResMulti = function(item, aes, orcItens) {
     if (!aes || aes.length === 0) return null;
     var orcList = orcItens || obraOrcItens;
     var res = calcResumo(item, fornecedoresVisiveis, mapa.precos);
     if (res.vlUnit === null) return null;
     var qtItem = parseFloat(String(item.qt).replace(",","."))||0;
     if (qtItem <= 0) return null;
     // CORRECAO: usa qtItem x fator (igual ao PDF)
     // CORRECAO 2: busca por CODIGO (igual ao PDF) — mais confiavel que indice
     // quando o orcamento e reimportado, o indice fica desatualizado mas o codigo nao
     // FIX: faltava aqui o mesmo ajuste que o PDF (gerarRelatorioOrcamento) já fazia —
     // usar o MENOR valor entre a quantidade de compra salva no momento da associação
     // e a quantidade ATUAL do item no mapa (que pode ter mudado depois), e multiplicar
     // pelo fator de conversão de unidade. Sem isso, editar a quantidade do item DEPOIS
     // de associar ao orçamento fazia a tela mostrar um resultado bem diferente do PDF
     // (a mesma raiz do bug histórico documentado de "lucro várias vezes maior").
     var vlOrcTotal = aes.reduce(function(ac,a){
       // Lookup robusto para todos os casos:
       // 1) index válido E código confere → usa index (distingue itens com mesmo código)
       // 2) código não confere no index → busca por código (orçamento reimportado)
       var oi = null;
       var idx = a.orcItemIndex;
       if (idx != null && idx >= 0 && idx < orcList.length) {
         var byIdx = orcList[idx];
         if (byIdx && byIdx.codigo === a.orcItemCodigo) oi = byIdx;
       }
       if (!oi) oi = orcList.find(function(it){ return it.codigo===a.orcItemCodigo; });
       if (!oi) return ac;
       var qtSalva = parseFloat(String(a.qtCompra).replace(",",".")) || 0;
       var fator = parseFloat(a.fator) || 1;
       var qtAtual = (qtSalva > 0 && qtSalva < qtItem) ? qtSalva : (qtItem || qtSalva);
       return ac + (parseFloat(oi.valorUnitario||oi.vl_unitario)||0) * qtAtual * fator;
     }, 0);
     if (vlOrcTotal <= 0) return null;
     var vlCotadoTotal = (res.vlUnit||0) * qtItem;
     var resultado = vlOrcTotal - vlCotadoTotal;
     var vloMedio = vlOrcTotal / qtItem;
     var diff = vloMedio - res.vlUnit;
     return { diff: diff, pct: (diff/vloMedio)*100, lucro: resultado>=0, total: resultado, vloMedio: vloMedio };
   };
  var renderChunk = function renderChunk(chunk, ci) {
    var hiddenCols = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var isFirst = ci === 0,
      isLast = ci === chunks.length - 1;
    var showResumo = isFirst && !hiddenCols.resumo;
    var showOrcamento = temOrcamento && isFirst && !hiddenCols.orcamento;
    var visibleChunk = chunk.filter(function (f) {
      return !hiddenCols[f.id];
    });
    var emptyChunk = visibleChunk.length === 0;
    return /*#__PURE__*/React.createElement("div", {
      key: ci,
      "data-chunk": ci,
      style: {
        marginBottom: 24
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: T.hdr,
        padding: "8px 14px",
        borderRadius: "6px 6px 0 0",
        display: "flex",
        alignItems: "center",
        gap: 16,
        flexWrap: "wrap"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'Syne',sans-serif",
        fontWeight: 800,
        fontSize: 14,
        color: "#fff",
        whiteSpace: "nowrap"
      }
    }, "MAPA DE COTA\xC7\xC3O"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: "rgba(255,255,255,0.9)",
        fontWeight: 700,
        whiteSpace: "nowrap",
        borderLeft: "1px solid rgba(255,255,255,0.3)",
        paddingLeft: 14
      }
    }, "MP N\xBA: ", mapa.numero || 1), mapa.obra && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: "rgba(255,255,255,0.9)",
        fontWeight: 600,
        flex: 1,
        borderLeft: "1px solid rgba(255,255,255,0.3)",
        paddingLeft: 14,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, "OBRA: ", mapa.obra), mapa.responsavel && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: "rgba(255,255,255,0.75)",
        borderLeft: "1px solid rgba(255,255,255,0.3)",
        paddingLeft: 14,
        whiteSpace: "nowrap"
      }
    }, "RESP.: ", mapa.responsavel), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 1,
        alignItems: "flex-end",
        marginLeft: "auto",
        borderLeft: "1px solid rgba(255,255,255,0.3)",
        paddingLeft: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 9.5, color: "rgba(255,255,255,0.65)", whiteSpace: "nowrap" }
    }, "CRIADO EM ", /*#__PURE__*/React.createElement("span", { style: { color: "#fff", fontWeight: 600 } },
      fmtDate(dataCriacaoMapaValida), " ", fmtHora(dataCriacaoMapaValida))
    ), /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 9.5, color: "rgba(255,255,255,0.65)", whiteSpace: "nowrap" }
    }, "VISUALIZADO EM ", /*#__PURE__*/React.createElement("span", { style: { color: "#fff", fontWeight: 600 } },
      fmtDate(clock), " ", fmtHora(clock))
    ))),
    /*#__PURE__*/React.createElement("div", {
      className: "scroll-mirror"
    }, /*#__PURE__*/React.createElement("div", {className:"scroll-mirror-inner"})),
    /*#__PURE__*/React.createElement("div", {
      style: SC.tableScroll
    }, /*#__PURE__*/(function() {
      // FIX: colunas com largura travada (colgroup + table-layout:fixed) para que a largura de
      // cada fornecedor seja sempre a mesma, independente do bloco (com ou sem ORÇAMENTO/RESUMO),
      // de quantos fornecedores tem naquele bloco, ou de texto longo em qualquer célula (ex: uma
      // observação grande não deve mais esticar a coluna — só aumenta a altura da linha).
      // FIX 2: a coluna DESCRIÇÃO fica SEM largura fixa no colgroup — ela absorve sozinha o espaço
      // que sobra, para a tabela continuar preenchendo 100% da tela como sempre preencheu, em vez
      // de ficar mais estreita e "flutuar" à esquerda quando o bloco tem menos colunas (bug visto
      // nas páginas sem RESUMO/ORÇAMENTO, onde sobrava um vão vazio à direita).
      // FIX 3: ícones de excluir/ocultar do fornecedor movidos para ACIMA do nome (não do lado),
      // permitindo reduzir a largura da coluna de fornecedor. Ficam ACIMA (não abaixo) de propósito:
      // o dropdown de sugestões do AutocompleteInput sempre abre para BAIXO do campo — colocando os
      // ícones abaixo, o dropdown ficaria sobrepondo eles sempre que alguém buscasse um fornecedor.
      // Testado e confirmado com Puppeteer que colocá-los acima elimina esse risco por completo.
      //
      // FIX 4: TODAS as colunas (incluindo DESCRIÇÃO) têm largura FIXA e explícita — nenhuma fica
      // "auto"/sem valor. Isso impede DESCRIÇÃO de colapsar a zero em zoom alto, e impede que ela
      // (ou o FORNECEDOR) fiquem desproporcionalmente largos quando sobra espaço.
      //
      // FIX 5 (revertido): tentei forçar TODOS os blocos a terem a MESMA largura total (usando uma
      // coluna extra sem conteúdo para "completar" a diferença nos blocos com menos colunas). Isso
      // resolvia a inconsistência de largura total entre blocos, mas criava um problema pior: um
      // vão vazio enorme e visível depois do último fornecedor — relatado como "fica um pedaço
      // enorme após o quarto fornecedor". Tentei então dar a largura NATURAL a cada bloco (sem
      // nada artificial), mas isso trouxe um problema pior: como cada página passou a ter uma
      // largura TOTAL diferente, a coluna de fornecedor da página 2 ficava visualmente alinhada
      // embaixo da coluna RESUMO da página 1 (colunas de páginas diferentes não bateam mais entre
      // si) — relatado como "a última coluna de fornecedor da segunda página está pegando embaixo
      // da coluna resumo da primeira página".
      //
      // Correção final: a largura TOTAL de todas as páginas volta a ser igual (calculada como o
      // maior valor entre todos os blocos do mapa) — isso resolve o alinhamento entre páginas. Mas,
      // em vez de uma coluna vazia separada (fantasma) para completar a diferença nos blocos com
      // menos colunas, é a própria coluna DESCRIÇÃO — que já tem conteúdo real — quem absorve essa
      // diferença. Como ela nunca fica "vazia" (sempre tem a descrição do item dentro), não parece
      // uma caixa quebrada/sobrando — só uma coluna de descrição um pouco mais larga nas páginas
      // com menos colunas de orçamento/resumo. A tabela usa width:"100%" (não um valor fixo
      // calculado) para que TODAS as páginas terminem exatamente na mesma posição horizontal —
      // resolvendo o desalinhamento relatado ("a última coluna da página 2 fica embaixo da coluna
      // RESUMO da página 1"). FORNECEDOR é SEMPRE 140px, em QUALQUER página, sem exceção — isso já
      // foi testado e confirmado repetidamente hoje e não deve variar entre páginas nunca mais.
      var LARG_FORN_COL = 140;
      var qtdFornAtual = emptyChunk ? 1 : visibleChunk.length;
      var colsFornecedor = emptyChunk
        ? [/*#__PURE__*/React.createElement("col", { key: "colForn_empty", style: { width: LARG_FORN_COL } })]
        : visibleChunk.map(function (f) {
            return /*#__PURE__*/React.createElement("col", { key: "colForn_" + f.id, style: { width: LARG_FORN_COL } });
          });
      var colgroupEl = /*#__PURE__*/React.createElement("colgroup", null,
        /*#__PURE__*/React.createElement("col", { style: { width: 55 } }),
        /*#__PURE__*/React.createElement("col", { style: { width: 46 } }),
        /*#__PURE__*/React.createElement("col", { style: { width: 56 } }),
        /*#__PURE__*/React.createElement("col", { style: { width: 58 } }),
        /*#__PURE__*/React.createElement("col", { style: { minWidth: 200 } }),
        showOrcamento && /*#__PURE__*/React.createElement("col", { key: "colOrc1", style: { width: 125 } }),
        showOrcamento && /*#__PURE__*/React.createElement("col", { key: "colOrc2", style: { width: 125 } }),
        showResumo && /*#__PURE__*/React.createElement("col", { key: "colRes1", style: { width: 95 } }),
        showResumo && /*#__PURE__*/React.createElement("col", { key: "colRes2", style: { width: 95 } }),
        showResumo && /*#__PURE__*/React.createElement("col", { key: "colRes3", style: { width: 115 } }),
        colsFornecedor,
        /*#__PURE__*/React.createElement("col", { style: { width: 30 } })
      );
      return /*#__PURE__*/React.createElement("table", {
      style: _objectSpread(_objectSpread({}, SC.table), {}, { tableLayout: "fixed", width: "100%" })
    }, colgroupEl, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
      rowSpan: 3,
      style: _objectSpread(_objectSpread({}, thC), {}, {
        width: 55, textAlign: "center", fontSize: 9, padding: "4px 2px"
      })
    }, "COMPRA"), /*#__PURE__*/React.createElement("th", {
      rowSpan: 3,
      style: _objectSpread(_objectSpread({}, thC), {}, {
        width: 46,
        textAlign: "center"
      })
    }, "ITEM"), /*#__PURE__*/React.createElement("th", {
      rowSpan: 3,
      style: _objectSpread(_objectSpread({}, thC), {}, {
        width: 56,
        textAlign: "center"
      })
    }, "QT."), /*#__PURE__*/React.createElement("th", {
      rowSpan: 3,
      style: _objectSpread(_objectSpread({}, thC), {}, {
        width: 58,
        textAlign: "center"
      })
    }, "UNID."), /*#__PURE__*/React.createElement("th", {
      style: _objectSpread(_objectSpread({}, thC), {}, {
        minWidth: 180,
        textAlign: "left",
        paddingLeft: 10
      })
    }, "DESCRI\xC7\xC3O"),
    showOrcamento && /*#__PURE__*/React.createElement("th", {
      colSpan: 2,
      style: _objectSpread(_objectSpread({}, thC), {}, { textAlign:"center", background: orcOculto ? "#999" : "#b87800", borderLeft:"2px solid rgba(255,255,255,0.3)", borderRight:"2px solid rgba(255,255,255,0.3)", opacity: orcOculto ? 0.45 : 1 })
    }, /*#__PURE__*/React.createElement("div", {
      style: { display:"flex", alignItems:"center", justifyContent:"center", gap:6 }
    }, "OR\xC7AMENTO",
      /*#__PURE__*/React.createElement("span", {
        onClick: function(e){ e.stopPropagation(); setOrcOculto(function(v){ return !v; }); },
        title: orcOculto ? "Mostrar coluna OR\u00c7AMENTO" : "Ocultar coluna OR\u00c7AMENTO",
        style: { cursor:"pointer", fontSize:13, userSelect:"none", marginLeft:2, display:"inline-flex", alignItems:"center" }
      }, orcOculto ? "\uD83D\uDEAB" : "\uD83D\uDC41")
    )),
    showResumo && /*#__PURE__*/React.createElement("th", {
      colSpan: 3,
      style: _objectSpread(_objectSpread({}, thC), {}, {
        textAlign: "center",
        borderLeft: "2px solid rgba(255,255,255,0.25)",
        borderRight: "2px solid rgba(255,255,255,0.25)"
      })
    }, "RESUMO"), /*#__PURE__*/React.createElement("th", {
      colSpan: emptyChunk ? 1 : visibleChunk.length,
      style: _objectSpread(_objectSpread({}, thC), {}, {
        textAlign: "center",
        borderLeft: "2px solid rgba(255,255,255,0.25)"
      })
    }, "FORNECEDORES"), /*#__PURE__*/React.createElement("th", {
      style: _objectSpread(_objectSpread({}, SC.th), {}, {
        background: "#d0d4e0",
        width: 30
      })
    })), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
      style: _objectSpread(_objectSpread({}, thS), {}, {
        padding: "3px 7px"
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 4
      }
    }, /*#__PURE__*/React.createElement(IcoSearch, null), /*#__PURE__*/React.createElement("input", {
      value: filter,
      onChange: function onChange(e) {
        return setFilter(e.target.value);
      },
      placeholder: "FILTRO...",
      style: {
        border: "none",
        background: "transparent",
        fontSize: 11,
        fontFamily: "inherit",
        textTransform: "uppercase",
        outline: "none",
        width: "100%",
        color: "#444"
      }
    }))),
    showOrcamento && /*#__PURE__*/React.createElement("th", { style:{background:orcOculto?"#aaa":"#d48800",color:"#fff",padding:"5px 8px",fontSize:10,fontWeight:600,textAlign:"center",borderLeft:"2px solid rgba(255,255,255,0.2)",opacity:orcOculto?0.45:1,textDecoration:orcOculto?"line-through":"none"} }, "VL. OR\xC7ADO"),
    showOrcamento && /*#__PURE__*/React.createElement("th", { style:{background:orcOculto?"#aaa":"#d48800",color:"#fff",padding:"5px 8px",fontSize:10,fontWeight:600,textAlign:"center",borderRight:"2px solid rgba(255,255,255,0.2)",opacity:orcOculto?0.45:1,textDecoration:orcOculto?"line-through":"none"} }, "RESULTADO"),
    showResumo && /*#__PURE__*/React.createElement("th", {
      colSpan: 3,
      style: _objectSpread(_objectSpread({}, thS), {}, {
        textAlign: "center",
        fontWeight: 700,
        borderLeft: "2px solid rgba(0,0,0,0.08)",
        borderRight: "2px solid rgba(0,0,0,0.08)"
      })
    }, "FORNECEDOR SELECIONADO"), visibleChunk.map(function (f) {
      return /*#__PURE__*/React.createElement("th", {
        key: f.id,
        style: _objectSpread(_objectSpread({}, thC), {}, {
          padding: "4px 6px",
          borderLeft: "1px solid rgba(255,255,255,0.2)",
          opacity: fornOcultos.has(f.id) ? 0.45 : 1
        })
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4
        }
      },
      // FIX 6 (definitivo): nome do fornecedor vem PRIMEIRO (fica em cima, visualmente), e os
      // ícones de excluir/ocultar vêm DEPOIS (ficam embaixo) — exatamente como combinado
      // originalmente. A tentativa anterior de colocar os ícones acima (para evitar que o
      // dropdown de sugestões os cobrisse) foi uma decisão unilateral errada: o combinado sempre
      // foi nome em cima, ícones embaixo, e é isso que fica agora.
      /*#__PURE__*/React.createElement(AutocompleteInput, {
        value: f.nome,
        onChange: function onChange(v) {
          return updForn(f.id, "nome", v, true);
        },
        onCommit: function onCommit(v) {
          // FIX: segunda camada de validação (redundante com a de dentro do AutocompleteInput)
          // que causava o mesmo problema real de dados perdidos — se a lista de fornecedores
          // cadastrados ainda não carregou (array vazio), aceita o valor digitado em vez de
          // rejeitar como se fosse inválido.
          var _fornAindaCarregando = !(cadastros.fornecedores || []).length;
          var fn = _fornAindaCarregando ? v : (v && cadastros.fornecedores.find(function (x) {
            return x.toUpperCase() === v.toUpperCase();
          }));
          updForn(f.id, "nome", fn || "");
          // FIX: se o fornecedor escolhido tiver observação salva, mostra num popup que só
          // fecha quando o usuário clicar em outro lugar da tela.
          if (fn) {
            var obsSalva = (cadastros.fornecedorObs || {})[normalize(fn)];
            if (obsSalva) setObsPopupFornecedor({ nome: fn, texto: obsSalva });
          }
        },
        suggestions: cadastros.fornecedores || [],
        strictMatch: true,
        placeholder: "NOME DO FORNECEDOR",
        inputStyle: {
          width: "100%",
          boxSizing: "border-box",
          textAlign: "center",
          textOverflow: "ellipsis",
          border: "1px solid rgba(255,255,255,0.3)",
          borderRadius: 3,
          background: "rgba(255,255,255,0.15)",
          padding: "3px 4px",
          fontSize: 11,
          fontWeight: 700,
          color: "#fff",
          outline: "none"
        },
        xStyle: {
          width: "100%"
        }
      }),
      /*#__PURE__*/React.createElement("div", {
        style: { display: "flex", gap: 10, alignItems: "center", justifyContent: "center", position: "relative", zIndex: 60 }
      }, /*#__PURE__*/React.createElement("button", {
        onClick: function onClick() {
          if (window.confirm("EXCLUIR FORNECEDOR \"" + f.nome + "\"?")) removeForn(f.id);
        },
        style: {
          background: "rgba(255,80,80,0.25)",
          border: "none",
          borderRadius: 3,
          padding: "3px 4px",
          cursor: "pointer",
          color: "#ffaaaa",
          display: "flex",
          flexShrink: 0
        }
      }, /*#__PURE__*/React.createElement(IcoClose, null)),
      /*#__PURE__*/React.createElement("span", {
        onClick: function(){ return toggleFornOculto(f.id); },
        title: fornOcultos.has(f.id) ? "Mostrar fornecedor" : "Ocultar fornecedor",
        style: { cursor:"pointer", fontSize:13, userSelect:"none", display:"inline-flex", alignItems:"center" }
      }, fornOcultos.has(f.id) ? "\uD83D\uDEAB" : "\uD83D\uDC41"))));
    }), emptyChunk && /*#__PURE__*/React.createElement("th", {
      style: _objectSpread(_objectSpread({}, thC), {}, {
        borderLeft: "2px solid rgba(255,255,255,0.2)",
        color: "rgba(255,255,255,0.4)",
        textAlign: "center",
        fontSize: 11
      })
    }, "\u2014"), /*#__PURE__*/React.createElement("th", {
      style: _objectSpread(_objectSpread({}, SC.th), {}, {
        background: "#d0d4e0"
      })
    }, /*#__PURE__*/React.createElement("button", {
      onClick: addForn,
      style: {
        background: T.hdr,
        border: "none",
        borderRadius: 5,
        padding: "5px 7px",
        cursor: "pointer",
        color: "#fff",
        display: "flex"
      }
    }, /*#__PURE__*/React.createElement(IcoPlus, {
      w: 14
    })))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
      style: _objectSpread({}, thS)
    }),
    showOrcamento && /*#__PURE__*/React.createElement("th", { style:{background:orcOculto?"#ccc":"#eca820",color:orcOculto?"#999":"#6a3800",padding:"4px 8px",fontSize:10,textAlign:"center",borderLeft:"2px solid rgba(0,0,0,0.1)",opacity:orcOculto?0.45:1,textDecoration:orcOculto?"line-through":"none"} }, "por UNID. compra"),
    showOrcamento && /*#__PURE__*/React.createElement("th", { style:{background:orcOculto?"#ccc":"#eca820",color:orcOculto?"#999":"#6a3800",padding:"4px 8px",fontSize:10,textAlign:"center",borderRight:"2px solid rgba(0,0,0,0.1)",opacity:orcOculto?0.45:1,textDecoration:orcOculto?"line-through":"none"} }, "vs. melhor pre\xe7o"),
    showResumo && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("th", {
      style: _objectSpread(_objectSpread({}, thS), {}, {
        textAlign: "right",
        borderLeft: "2px solid rgba(0,0,0,0.08)",
        fontSize: 10
      })
    }, "VL. UNIT."), /*#__PURE__*/React.createElement("th", {
      style: _objectSpread(_objectSpread({}, thS), {}, {
        textAlign: "right",
        fontSize: 10
      })
    }, "VL. TOTAL"), /*#__PURE__*/React.createElement("th", {
      style: _objectSpread(_objectSpread({}, thS), {}, {
        fontSize: 10
      })
    }, "FORNECEDOR")), visibleChunk.map(function (f, fi) {
      return /*#__PURE__*/React.createElement("th", {
        key: "".concat(f.id, "l"),
        style: _objectSpread(_objectSpread({}, thS), {}, {
          textAlign: "center",
          borderLeft: fi === 0 ? "2px solid rgba(255,255,255,0.2)" : "1px solid rgba(0,0,0,0.1)",
          fontSize: 10,
          padding: "4px 6px"
        })
      }, /*#__PURE__*/React.createElement("div", {style:{display:"flex",flexDirection:"column",alignItems:"center",gap:3}},
        /*#__PURE__*/React.createElement("span", {style:{fontSize:10}}, "VL. UNIT.")
      ));
    }), emptyChunk && /*#__PURE__*/React.createElement("th", {
      style: _objectSpread(_objectSpread({}, thS), {}, {
        borderLeft: "2px solid rgba(0,0,0,0.1)"
      })
    }), /*#__PURE__*/React.createElement("th", {
      style: _objectSpread(_objectSpread({}, SC.th), {}, {
        background: "#d0d4e0"
      })
    }))), /*#__PURE__*/React.createElement("tbody", null, filteredItens.length === 0 && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
      colSpan: 5 + (showOrcamento ? 2 : 0) + (showResumo ? 3 : 0) + (emptyChunk ? 1 : visibleChunk.length) + 1 + 1,
      style: {
        textAlign: "center",
        padding: 28,
        color: "#aaa",
        fontSize: 12
      }
    }, "NENHUM ITEM \u2014 CLIQUE EM \"+ ADICIONAR ITEM\"")), filteredItens.map(function (item, idx) {
      var resumo = calcResumo(item, fornecedoresVisiveis, precos);
      var _allPrices = [];
      fornecedoresVisiveis.forEach(function(f) { var _v = parseMoney(precos[item.id + "_" + f.id]); if (_v !== null && _v > 0) _allPrices.push(_v); });
      var _sortedUniq = _allPrices.filter(function(v, i, arr) { return arr.indexOf(v) === i; }).sort(function(a, b) { return a - b; });
      var _rank2Price = _sortedUniq.length > 1 ? _sortedUniq[1] : null;
      var _rank3Price = _sortedUniq.length > 2 ? _sortedUniq[2] : null;
      var bg = idx % 2 === 0 ? "#fff" : "#f7f9fc";
      var _isOculto = ocultos.has(item.id);
      var _isExcluido = !!item.excluido;
      var _dadosAtend = itensAtendidosMap[item.id]||{};
      var _isAtendido = !!_dadosAtend.atendido;
      var _tooltipTitle = _isAtendido
        ? '\uD83D\uDD12 TOTALMENTE ATENDIDO\n' + (_dadosAtend.pedidos||[]).map(function(p){ return p.num+' \u00B7 '+p.forn+' \u00B7 '+p.qt+' un ('+p.status+')'; }).join('\n')
        : '';
      // Handlers para células estáticas (long press tablet + hover desktop)
      var _cellProps = _isAtendido ? {
        title: _tooltipTitle,
        onTouchStart: function(e){
          clearTimeout(window._poLockTimer);
          window._poLockStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
          window._poLockTimer = setTimeout(function(){ setTooltipItemId(item.id); }, 800);
        },
        onTouchEnd: function(){ clearTimeout(window._poLockTimer); },
        onTouchMove: function(e){
          // Tolerar micro-movimentos (< 10px) sem cancelar
          if (!window._poLockStart) return;
          var dx = e.touches[0].clientX - window._poLockStart.x;
          var dy = e.touches[0].clientY - window._poLockStart.y;
          if (Math.sqrt(dx*dx+dy*dy) > 10) clearTimeout(window._poLockTimer);
        },
        style: { padding:'6px 8px', background:'#d4edda', color:'#555', cursor:'help', userSelect:'none', fontSize:11, textAlign:'center' }
      } : null;
      return /*#__PURE__*/React.createElement("tr", {
        key: item.id,
        style: {
          background: _isAtendido ? '#e8f5e9' : (_isExcluido ? "#fff5f5" : bg),
          opacity: _isOculto ? 0.35 : (_isExcluido ? 0.55 : 1),
          textDecoration: (_isOculto || _isExcluido) ? "line-through" : "none",
          position: 'relative'
        }
      }, /*#__PURE__*/React.createElement("td", {
        style: _objectSpread(_objectSpread({}, SC.td), {}, {
          textAlign: "center", padding: "4px 2px",
          borderLeft: item.comprado ? "3px solid #186818" : "3px solid transparent",
          background: item.comprado ? "#f0fff4" : "transparent"
        })
      }, /*#__PURE__*/React.createElement("input", {
        type: "checkbox", checked: !!item.comprado,
        onChange: function(e){ return updItem(item.id, "comprado", e.target.checked); },
        style: { width:15, height:15, cursor:"pointer", accentColor:"#2a5298" },
        title: item.comprado ? "Compra efetivada" : "Marcar como compra"
      }), /*#__PURE__*/React.createElement("span", {
        onClick: function(){ return toggleOculto(item.id); },
        title: _isOculto ? "Clique para mostrar este item" : "Clique para ocultar este item",
        style: { cursor:"pointer", fontSize:13, marginLeft:4, userSelect:"none", display:"block" }
      }, _isOculto ? "\uD83D\uDEAB" : "\uD83D\uDC41"),
      /*#__PURE__*/React.createElement("span", {
        onClick: function(){ return toggleExcluido(item.id); },
        title: _isExcluido ? "Restaurar item ao mapa" : "Excluir permanentemente do mapa",
        style: { cursor:"pointer", fontSize:13, marginLeft:2, userSelect:"none", display:"block", color: _isExcluido ? "#c0392b" : "#bbb" }
      }, _isExcluido ? "\uD83D\uDD12" : "\u2702")), /*#__PURE__*/React.createElement("td", {
        style: _objectSpread(_objectSpread({}, SC.td), {}, {
          textAlign: "center",
          color: "#666",
          fontSize: 11
        })
      }, item.num), _isAtendido
        ? /*#__PURE__*/React.createElement("td", Object.assign({}, _cellProps, { style: Object.assign({}, _cellProps.style, {textAlign:'center'}) }), item.qt)
        : /*#__PURE__*/React.createElement(EC, {
        value: item.qt,
        onChange: function onChange(v) {
          return updItem(item.id, "qt", v.replace(/[^0-9.,]/g, ""));
        },
        placeholder: "0",
        align: "center",
        tdSt: SC.td,
        numericOnly: true,
        guardEdit: true
      }), _isAtendido
        ? /*#__PURE__*/React.createElement("td", Object.assign({}, _cellProps, { style: Object.assign({}, _cellProps.style, {textAlign:'center'}) }), item.unid)
        : /*#__PURE__*/React.createElement(EC, {
        value: item.unid,
        onChange: function onChange(v) {
          // FIX: mesma proteção contra cadastros ainda carregando - ver comentário completo
          // junto ao campo Fornecedor, acima.
          var _unidAindaCarregando = !(cadastros.unidades || []).length;
          var u = _unidAindaCarregando ? v : (cadastros.unidades.find(function (x) {
            return x.toUpperCase() === v.toUpperCase();
          }));
          updItem(item.id, "unid", u || "");
        },
        strictMatch: true,
        placeholder: "UN",
        align: "center",
        guardEdit: true,
        tdSt: _objectSpread(_objectSpread({}, SC.td), {}, {
          width: 58
        }),
        maxLen: 8,
        suggestions: cadastros.unidades || []
      }), _isAtendido
        ? /*#__PURE__*/React.createElement("td", Object.assign({}, _cellProps, { style: Object.assign({}, _cellProps.style, {textAlign:'left', minWidth:120}) }),
            /*#__PURE__*/React.createElement("div", {style:{fontWeight:'bold',fontSize:11}}, item.descricao||''),
            item.detalhe && /*#__PURE__*/React.createElement("div", {style:{fontSize:9,color:'#777'}}, item.detalhe)
          )
        : /*#__PURE__*/React.createElement(EC, {
        value: item.descricao,
        onChange: function onChange(v) {
          // FIX: mesma proteção contra cadastros ainda carregando - ver comentário completo
          // junto ao campo Fornecedor, acima. Esta é a causa raiz real confirmada do problema
          // de descrições salvas vazias mesmo com o texto certo digitado.
          var _descAindaCarregando = !(cadastros.insumos || []).length;
          var d = _descAindaCarregando ? v : (cadastros.insumos.find(function (x) {
            return x.toUpperCase() === v.toUpperCase();
          }));
          updItem(item.id, "descricao", d || "");
        },
        onBlur: function() {},
        strictMatch: true,
        placeholder: "DESCRI\xC7\xC3O DO INSUMO...",
        guardEdit: true,
        tdSt: SC.td,
        suggestions: cadastros.insumos || [],
        detailValue: item.detalhe !== undefined ? item.detalhe : "",
        onDetailChange: function onDetailChange(v) {
          updItem(item.id, "detalhe", v);
        },
        guardEdit: true
      }),
      showOrcamento && (function() {
                var aesR = getAssocItens(item.id);
        var assocR = aesR.length > 0 ? aesR[0] : null;
        var res = aesR.length > 0 ? calcResMulti(item, aesR, obraOrcItens) : null;
        var vloExib = res ? res.vloMedio : (aesR.length > 0 ? (function(){ var tot=0,qtTot=0; aesR.forEach(function(a){ var oi=obraOrcItens[a.orcItemIndex]; if(!oi)return; var fator=parseFloat(a.fator)||1; var qt=parseFloat(String(a.qtCompra).replace(",","."))||0; tot+=(parseFloat(oi.valorUnitario)||0)*fator*qt; qtTot+=qt; }); return qtTot>0?tot/qtTot:null; })() : null);
        return /*#__PURE__*/React.createElement(React.Fragment, null,
          /*#__PURE__*/React.createElement("td", {
            onClick: function(){ abrirAssoc(item); },
            style:{background:"#fffbee",borderLeft:"2px solid #e0bf30",padding:"5px 8px",textAlign:"right",cursor:"pointer",minWidth:110,verticalAlign:"middle",opacity:orcOculto?0.35:1,textDecoration:orcOculto?"line-through":"none"}
          }, aesR.length > 0 ? /*#__PURE__*/React.createElement(React.Fragment, null,
            /*#__PURE__*/React.createElement("div", {style:{fontSize:12,fontWeight:700,color:"#7a4400"}}, vloExib!==null?fmtMoney(vloExib):"\u2014"),
            /*#__PURE__*/React.createElement("div", {style:{fontSize:9,color:"#aaa",marginTop:1}}, aesR.length>1?(aesR.length+" fontes"):(assocR&&assocR.fator&&assocR.fator!=1?"1 "+(assocR.unidMapa||"UN")+"="+assocR.fator+" "+(assocR.unidOrc||""):"mesma unidade"))
          ) : /*#__PURE__*/React.createElement("span", {style:{fontSize:10,color:"#bbb",fontStyle:"italic"}}, "Toque para associar")),
          /*#__PURE__*/React.createElement("td", {
            onClick: function(){ abrirAssoc(item); },
            style:{background:"#fffbee",borderRight:"2px solid #e0bf30",padding:"5px 8px",textAlign:"center",cursor:"pointer",minWidth:120,verticalAlign:"middle",opacity:orcOculto?0.35:1,textDecoration:orcOculto?"line-through":"none"}
          }, res ? /*#__PURE__*/React.createElement(React.Fragment, null,
            /*#__PURE__*/React.createElement("div", {style:{fontSize:11,fontWeight:700,color:res.lucro?"#186818":"#aa1c1c"}}, res.lucro?"\u25cf LUCRO":"\u25cf PREJU\xcdZO"),
            /*#__PURE__*/React.createElement("div", {style:{fontSize:9,color:res.lucro?"#186818":"#aa1c1c"}}, (res.lucro?"+":"\u2212")+Math.abs(res.pct).toFixed(1)+"% \u00b7 "+fmtMoney(Math.abs(res.diff))+"/UN"),
            /*#__PURE__*/React.createElement("div", {style:{fontSize:10,fontWeight:700,color:res.lucro?"#186818":"#aa1c1c",marginTop:2,borderTop:"1px dotted "+(res.lucro?"#8ecba8":"#e8a0a0"),paddingTop:2}}, (res.lucro?"+ ":"\u2212 ")+fmtMoney(Math.abs(res.total))+" TOTAL")
          ) : /*#__PURE__*/React.createElement("span", {style:{fontSize:10,color:"#bbb"}}, "\u2014"))
        );
      })(),
      showResumo && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("td", {
        style: _objectSpread(_objectSpread({}, SC.td), {}, {
          textAlign: "right",
          background: "#f0f4ff",
          borderLeft: "2px solid #b8c8e8"
        })
      }, resumo.vlUnit !== null ? fmtMoney(resumo.vlUnit) : "",
      resumo.minFornId && (detalhes || {})[item.id + "_" + resumo.minFornId] ?
        /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 9,
            color: "#4a6888",
            borderTop: "1px dotted #c0cce0",
            marginTop: 2,
            paddingTop: 2,
            textAlign: "left",
            fontWeight: 400
          }
        }, "\u21b3 " + (detalhes || {})[item.id + "_" + resumo.minFornId]) : null
      ), /*#__PURE__*/React.createElement("td", {
        style: _objectSpread(_objectSpread({}, SC.td), {}, {
          textAlign: "right",
          fontWeight: 600,
          background: "#f0f4ff"
        })
      }, resumo.vlTotal !== null ? fmtMoney(resumo.vlTotal) : ""), /*#__PURE__*/React.createElement("td", {
        style: _objectSpread(_objectSpread({}, SC.td), {}, {
          fontSize: 11,
          background: "#f0f4ff",
          borderRight: "2px solid #b8c8e8",
          maxWidth: 130,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        })
      }, resumo.forn || "")), visibleChunk.map(function (f) {
        var _precos$key;
        var key = "".concat(item.id, "_").concat(f.id);
        var unit = parseMoney(precos[key]);
        var isMin = resumo.vlUnit !== null && unit !== null && unit > 0 && unit === resumo.vlUnit;
        var isRank2 = !isMin && _rank2Price !== null && unit !== null && unit > 0 && unit === _rank2Price;
        var isRank3 = !isMin && !isRank2 && _rank3Price !== null && unit !== null && unit > 0 && unit === _rank3Price;
        return _isAtendido
          ? /*#__PURE__*/React.createElement("td", Object.assign({}, _cellProps, { key: key, style: Object.assign({}, _cellProps.style, {textAlign:'right'}) }), (_precos$key = precos[key]) ? _precos$key : '—')
          : /*#__PURE__*/React.createElement(EC, {
          key: key,
          value: (_precos$key = precos[key]) !== null && _precos$key !== void 0 ? _precos$key : "",
          onChange: function onChange(v) {
            return setPreco(item.id, f.id, v.replace(/[^0-9.,]/g, ""));
          },
          placeholder: "0,00",
          align: "right",
          numericOnly: true,
          moneyDisplay: true,
          tdSt: _objectSpread(_objectSpread({}, SC.td), {}, {
            borderLeft: "1px solid #e4e8f4",
            background: fornOcultos.has(f.id) ? bg : (isMin ? T.best : isRank2 ? "#ffe4b0" : isRank3 ? "#ffcece" : bg),
            color: fornOcultos.has(f.id) ? "#bbb" : (isMin ? "#1a6a1a" : isRank2 ? "#a05000" : isRank3 ? "#a01010" : undefined),
            fontWeight: fornOcultos.has(f.id) ? 400 : (isMin ? 700 : isRank2 ? 600 : isRank3 ? 600 : 400),
            opacity: fornOcultos.has(f.id) ? 0.35 : 1,
            textDecoration: fornOcultos.has(f.id) ? "line-through" : "none"
          }),
          detailValue: (detalhes || {})[item.id + "_" + f.id] !== undefined ? (detalhes || {})[item.id + "_" + f.id] : "",
          onDetailChange: function onDetailChange(v) {
            return setDetalheForn(item.id, f.id, v);
          }
        });
      }), emptyChunk && /*#__PURE__*/React.createElement("td", {
        style: _objectSpread(_objectSpread({}, SC.td), {}, {
          background: bg,
          borderLeft: "2px solid #e4e8f4"
        })
      }), /*#__PURE__*/React.createElement("td", {
        style: _objectSpread(_objectSpread({}, SC.td), {}, {
          background: "#f0f2f6",
          textAlign: "center",
          padding: "2px 4px"
        })
      }, /*#__PURE__*/React.createElement("button", {
        onClick: function onClick() {
          if (window.confirm("EXCLUIR ITEM \"" + item.descricao + "\"?")) removeItem(item.id);
        },
        style: {
          background: "none",
          border: "none",
          color: "#e57373",
          cursor: "pointer",
          padding: 2,
          display: "flex"
        }
      }, /*#__PURE__*/React.createElement(IcoTrash, null))));
    }), /*#__PURE__*/React.createElement("tr", {
      style: {
        background: T.sub,
        borderTop: "2px solid rgba(0,0,0,0.1)"
      }
    }, /*#__PURE__*/React.createElement("td", {
      colSpan: 5,
      style: _objectSpread(_objectSpread({}, SC.td), {}, {
        fontWeight: 700,
        paddingLeft: 10,
        fontSize: 12
      })
    }, "TOTAL"),
    showOrcamento && (function(){
      var somaOrcList = obraOrcItens;
      var soma = itensAtivos.reduce(function(ac,it){
        var aes=getAssocItens(it.id); var r=aes.length>0?calcResMulti(it,aes,somaOrcList):null;
        return ac+(r?r.total:0);
      },0);
      var temR = itensAtivos.some(function(it){ return getAssocItens(it.id).length>0&&calcResMulti(it,getAssocItens(it.id),somaOrcList); });
      return /*#__PURE__*/React.createElement(React.Fragment, null,
        /*#__PURE__*/React.createElement("td", {style:{background:"#fffbee",borderLeft:"2px solid #e0bf30",textAlign:"center",color:"#ccc",padding:"6px 8px"}}, "\u2014"),
        /*#__PURE__*/React.createElement("td", {style:{background:"#fffbee",borderRight:"2px solid #e0bf30",textAlign:"center",fontWeight:700,padding:"6px 8px",color:temR?(soma>=0?"#186818":"#aa1c1c"):"#ccc"}},
          temR ? /*#__PURE__*/React.createElement(React.Fragment, null,
            /*#__PURE__*/React.createElement("div", {style:{fontSize:10}}, soma>=0?"\u25cf LUCRO":"\u25cf PREJU\xcdZO"),
            /*#__PURE__*/React.createElement("div", {style:{fontSize:11,fontWeight:800}}, (soma>=0?"+ ":"\u2212 ")+fmtMoney(Math.abs(soma)))
          ) : "\u2014")
      );
    })(),
    showResumo && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("td", {
      style: _objectSpread(_objectSpread({}, SC.td), {}, {
        background: "#e8eeff",
        borderLeft: "2px solid #b8c8e8",
        borderRight: "none"
      })
    }), /*#__PURE__*/React.createElement("td", {
      style: _objectSpread(_objectSpread({}, SC.td), {}, {
        textAlign: "right",
        fontWeight: 700,
        background: "#e8eeff",
        borderLeft: "none",
        borderRight: "none"
      })
    }, resumoTotal > 0 ? fmtMoney(resumoTotal) : "—"), /*#__PURE__*/React.createElement("td", {
      style: _objectSpread(_objectSpread({}, SC.td), {}, {
        background: "#e8eeff",
        borderLeft: "none",
        borderRight: "2px solid #b8c8e8"
      })
    })), visibleChunk.map(function (f) {
      var t = totalBruto(f.id);
      return /*#__PURE__*/React.createElement("td", {
        key: "t_".concat(f.id),
        style: _objectSpread(_objectSpread({}, SC.td), {}, {
          textAlign: "right",
          fontWeight: 700,
          borderLeft: "1px solid #e4e8f4"
        })
      }, t > 0 ? fmtMoney(t) : "—");
    }), emptyChunk && /*#__PURE__*/React.createElement("td", {
      style: _objectSpread(_objectSpread({}, SC.td), {}, {
        borderLeft: "2px solid #e4e8f4"
      })
    }), /*#__PURE__*/React.createElement("td", {
      style: _objectSpread(_objectSpread({}, SC.td), {}, {
        background: "#f0f2f6"
      })
    })), RODAPE_ROWS.map(function (row, ri) {
      return /*#__PURE__*/React.createElement("tr", {
        key: row.key,
        style: {
          background: ri % 2 === 0 ? "#fff" : "#fafafa",
          borderTop: ri === 0 ? "1px solid #d8dce8" : undefined
        }
      }, /*#__PURE__*/React.createElement("td", {
        colSpan: 5,
        style: _objectSpread(_objectSpread({}, SC.td), {}, {
          fontWeight: 600,
          fontSize: 11,
          paddingLeft: 10,
          letterSpacing: 0.3
        })
      }, row.label),
      showOrcamento && /*#__PURE__*/React.createElement("td", {style:{background:"#fffbee",borderLeft:"2px solid #e0bf30",textAlign:"center",color:"#ccc",padding:"6px 8px",opacity:orcOculto?0.35:1,textDecoration:orcOculto?"line-through":"none"}}, "\u2014"),
      showOrcamento && /*#__PURE__*/React.createElement("td", {style:{background:"#fffbee",borderRight:"2px solid #e0bf30",textAlign:"center",color:"#ccc",padding:"6px 8px",opacity:orcOculto?0.35:1,textDecoration:orcOculto?"line-through":"none"}}, "\u2014"),
      showResumo && function (_rodapeResumo$row$key2) {
        var bg = "#e8eeff",
          bl = "2px solid #b8c8e8",
          br = "2px solid #b8c8e8";
        if (row.computed) {
          var vl = calcVLResumo();
          return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("td", {
            style: _objectSpread(_objectSpread({}, SC.td), {}, {
              background: bg,
              borderLeft: bl,
              borderRight: "none"
            })
          }), /*#__PURE__*/React.createElement("td", {
            style: _objectSpread(_objectSpread({}, SC.td), {}, {
              textAlign: "right",
              fontWeight: 700,
              color: "#1a56b0",
              background: bg,
              borderLeft: "none",
              borderRight: "none"
            })
          }, vl > 0 ? fmtMoney(vl) : "—"), /*#__PURE__*/React.createElement("td", {
            style: _objectSpread(_objectSpread({}, SC.td), {}, {
              background: bg,
              borderLeft: "none",
              borderRight: br
            })
          }));
        }
        // CONTATO e OBSERVAÇÕES: célula larga colspan=3
        if (!row.money) {
          var _rodapeResumo$row$key;
          return /*#__PURE__*/React.createElement(EC, {
            value: (_rodapeResumo$row$key = rodapeResumo[row.key]) !== null && _rodapeResumo$row$key !== void 0 ? _rodapeResumo$row$key : "",
            onChange: function onChange(v) {
              return setRodapeResumo(row.key, v);
            },
            placeholder: "\u2014",
            align: "left",
            colSpan: 3,
            maxLen: row.maxLen,
            wrapText: true,
            guardEdit: true,
            tdSt: _objectSpread(_objectSpread({}, SC.td), {}, {
              background: bg,
              borderLeft: bl,
              borderRight: br
            })
          });
        }
        return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("td", {
          style: _objectSpread(_objectSpread({}, SC.td), {}, {
            background: bg,
            borderLeft: bl,
            borderRight: "none"
          })
        }), /*#__PURE__*/React.createElement(EC, {
          value: (_rodapeResumo$row$key2 = rodapeResumo[row.key]) !== null && _rodapeResumo$row$key2 !== void 0 ? _rodapeResumo$row$key2 : "",
          onChange: function onChange(v) {
            return setRodapeResumo(row.key, v.replace(/[^0-9.,]/g, ""));
          },
          placeholder: "0,00",
          align: "right",
          maxLen: row.maxLen,
          numericOnly: true,
          moneyDisplay: true,
          guardEdit: true,
          tdSt: _objectSpread(_objectSpread({}, SC.td), {}, {
            background: bg,
            borderLeft: "none",
            borderRight: "none"
          })
        }), /*#__PURE__*/React.createElement("td", {
          style: _objectSpread(_objectSpread({}, SC.td), {}, {
            background: bg,
            borderLeft: "none",
            borderRight: br
          })
        }));
      }(), visibleChunk.map(function (f) {
        var _r2$row$key;
        var r2 = rodape[f.id] || {};
        if (row.computed) {
          var vl = calcVL(f.id);
          return /*#__PURE__*/React.createElement("td", {
            key: "vl_".concat(f.id),
            style: _objectSpread(_objectSpread({}, SC.td), {}, {
              textAlign: "right",
              fontWeight: 700,
              color: "#1a56b0",
              borderLeft: "1px solid #e4e8f4"
            })
          }, vl > 0 ? fmtMoney(vl) : "—");
        }
        return /*#__PURE__*/React.createElement(EC, {
          key: "r_".concat(f.id, "_").concat(row.key),
          value: (_r2$row$key = r2[row.key]) !== null && _r2$row$key !== void 0 ? _r2$row$key : "",
          onChange: function onChange(v) {
            return setRodape(f.id, row.key, row.money ? v.replace(/[^0-9.,]/g, "") : v);
          },
          placeholder: row.money ? "0,00" : "—",
          align: row.money ? "right" : "left",
          maxLen: row.maxLen,
          numericOnly: row.money,
          moneyDisplay: row.money,
          wrapText: row.money ? false : true,
          tdSt: _objectSpread(_objectSpread({}, SC.td), {}, {
            borderLeft: "1px solid #e4e8f4"
          })
        });
      }), emptyChunk && /*#__PURE__*/React.createElement("td", {
        style: _objectSpread(_objectSpread({}, SC.td), {}, {
          borderLeft: "2px solid #e4e8f4"
        })
      }), /*#__PURE__*/React.createElement("td", {
        style: _objectSpread(_objectSpread({}, SC.td), {}, {
          background: "#f0f2f6"
        })
      }));
    }))); })()), isLast && function () {
      var totalQt = itens.reduce(function (acc, it) {
        var v = parseFloat(String(it.qt).replace(",", "."));
        return acc + (isNaN(v) ? 0 : v);
      }, 0);
      return /*#__PURE__*/React.createElement("div", {
        style: {
          marginTop: 10,
          display: "flex",
          alignItems: "center",
          gap: 12
        }
      }, /*#__PURE__*/React.createElement("button", {
        onClick: addItem,
        style: SC.btnAddItem
      }, /*#__PURE__*/React.createElement(IcoPlus, {
        w: 14
      }), " ADICIONAR ITEM"), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 13,
          fontWeight: 700,
          color: "#2a5298",
          background: "#e8eeff",
          borderRadius: 20,
          padding: "4px 14px",
          letterSpacing: 0.5
        }
      }, "QT. TOTAL: ", totalQt % 1 === 0 ? totalQt : totalQt.toLocaleString("pt-BR", {
        maximumFractionDigits: 3
      })));
    }(), isLast && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 14,
        background: "#fff",
        borderRadius: 8,
        border: "1.5px solid #c8ccd8",
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: T.hdr,
        color: "#fff",
        padding: "8px 14px",
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: 0.4
      }
    }, "OBSERVA\xC7\xC3O GERAL DO MAPA"), /*#__PURE__*/React.createElement("textarea", {
      value: mapa.obsGeral || "",
      onChange: function onChange(e) {
        var el=e.target, ss=el.selectionStart, se=el.selectionEnd;
        setObsGeral(el.value.toUpperCase());
        requestAnimationFrame(function(){ el.selectionStart=ss; el.selectionEnd=se; });
      },
      maxLength: 5000,
      placeholder: "OBSERVA\xC7\xD5ES GERAIS SOBRE ESTE MAPA DE COTA\xC7\xC3O...",
      style: {
        width: "100%",
        minHeight: 100,
        border: "none",
        padding: "10px 14px",
        fontSize: 13,
        fontFamily: "'DM Sans',sans-serif",
        textTransform: "uppercase",
        resize: "vertical",
        outline: "none",
        color: "#1a1a2e",
        background: "#fff"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "right",
        padding: "4px 14px 6px",
        fontSize: 11,
        color: "#aaa"
      }
    }, (mapa.obsGeral || "").length, "/5000")), !isLast && /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "center",
        padding: "6px 0",
        fontSize: 11,
        color: "#999",
        letterSpacing: 1
      }
    }, "\u2500\u2500 CONTINUA NA PR\xD3XIMA FOLHA \u2500\u2500"));
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100vh",
      background: "#dde0e8",
      fontFamily: "'DM Sans',sans-serif"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: SC.appBar,
    className: "rsp-appbar"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function(){
      // FIX: em telas de toque, tocar em "voltar" enquanto um campo ainda está em edição pode
      // processar o clique antes do campo confirmar seu valor — uma corrida entre "sair" e
      // "confirmar" mais comum em touch do que em clique de mouse. Forçamos o blur do campo
      // (para ele tentar confirmar) e usamos flushSalvar() para GARANTIR que o salvamento real
      // aconteça e seja CONCLUÍDO (aguardando a promise, não só esperando um tempo fixo) antes
      // de navegar para fora do mapa — usando sempre mapaRef.current (o valor mais recente).
      var elementoAtivo = document.activeElement;
      if (elementoAtivo && typeof elementoAtivo.blur === 'function') {
        elementoAtivo.blur();
      }
      setTimeout(function(){
        flushSalvar().then(function(){ onBack(mapaRef.current); }).catch(function(){ onBack(mapaRef.current); });
      }, 200); // pequena espera para o blur (e o commit assíncrono de campos com sugestões) completar antes do flush
    },
    style: SC.backBtn
  }, /*#__PURE__*/React.createElement(IcoBack, null), " MAPAS"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Syne',sans-serif",
      fontWeight: 700,
      fontSize: 15,
      color: "#fff",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    },
    className: "title-wrap"
  }, mapa.obra || mapa.nome || "SEM OBRA"), mapa.responsavel && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#7a9cc8"
    }
  }, mapa.responsavel)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "center"
    }
  },
  /*#__PURE__*/React.createElement("div", { style:{ position:"relative" } },
    /*#__PURE__*/React.createElement("button", {
      ref: configBtnRef,
      onClick: function(){
        if (!showConfigMenu && configBtnRef.current) {
          var r = configBtnRef.current.getBoundingClientRect();
          setConfigMenuPos({ top: r.bottom + 4, left: r.left });
        }
        setShowConfigMenu(function(p){ return !p; });
      },
      title: "Mais opções do mapa",
      style: _objectSpread(_objectSpread({}, SC.backBtn), {}, { background:"#3a4a63", color:"#fff", gap:5 })
    }, "\u2699\uFE0F CONFIGURA\u00c7\u00d5ES"),
    showConfigMenu && configMenuPos && ReactDOM.createPortal(
    /*#__PURE__*/React.createElement("div", {
      ref: configPortalRef,
      style: { position:"fixed", top: configMenuPos.top, left: configMenuPos.left, background:"#fff", borderRadius:8, boxShadow:"0 8px 28px rgba(0,0,0,.28)", padding:8, zIndex:99999, minWidth:220, maxHeight:"70vh", overflowY:"auto" }
    },
      /*#__PURE__*/React.createElement("div", {
        onClick: function(){ logEventoDiag((!inclAnalise ? "ATIVOU" : "DESATIVOU") + " An\u00e1lise no PDF (mapa " + (mapa.numero != null ? mapa.numero : "?") + ")"); setInclAnalise(!inclAnalise); setShowConfigMenu(false); },
        style: { display:"flex", alignItems:"center", gap:8, padding:"8px 10px", borderRadius:6, fontSize:12, color:"#333", cursor:"pointer" }
      }, "\uD83D\uDCCA", inclAnalise ? " \u2713 An\u00e1lise no PDF" : " An\u00e1lise no PDF"),
      /*#__PURE__*/React.createElement("div", {
        onClick: function(){ logEventoDiag((!showDashboard ? "ATIVOU" : "DESATIVOU") + " Dashboard Global (mapa " + (mapa.numero != null ? mapa.numero : "?") + ")"); setShowDashboard(!showDashboard); setShowConfigMenu(false); },
        style: { display:"flex", alignItems:"center", gap:8, padding:"8px 10px", borderRadius:6, fontSize:12, color:"#333", cursor:"pointer" }
      }, "\uD83C\uDF10", showDashboard ? " \u2713 Dashboard Global" : " Dashboard Global"),
      /*#__PURE__*/React.createElement("div", { style:{ borderTop:"1px solid #eee", margin:"6px 0" } }),
      /*#__PURE__*/React.createElement("div", {
        onClick: function(){ setItensSelecionadosPO([]); setPedidoConfig({}); setPoFinanceiro({}); setShowPedidoModal(true); setShowConfigMenu(false); },
        style: { display:"flex", alignItems:"center", gap:8, padding:"8px 10px", borderRadius:6, fontSize:12, color:"#333", cursor:"pointer" }
      }, "\uD83D\uDED2 Criar Pedido"),
      /*#__PURE__*/React.createElement("div", {
        onClick: function(){ sbGetPedidos().then(function(d){ setPedidos(d||[]); }); setShowPedidos(true); setShowConfigMenu(false); },
        style: { display:"flex", alignItems:"center", gap:8, padding:"8px 10px", borderRadius:6, fontSize:12, color:"#333", cursor:"pointer" }
      }, "\uD83D\uDCCB Ver Pedidos"),
      /*#__PURE__*/React.createElement("div", {
        onClick: function(){ logEventoDiag("PDF de Insumos gerado: mapa " + (mapa.numero != null ? mapa.numero : "?")); abrirPDF(buildInsumosHTML(mapa.obra, clock, itensAtivos)); setShowConfigMenu(false); },
        style: { display:"flex", alignItems:"center", gap:8, padding:"8px 10px", borderRadius:6, fontSize:12, color:"#333", cursor:"pointer" }
      }, "\uD83D\uDCCB PDF de Insumos"),
      /*#__PURE__*/React.createElement("div", { style:{ borderTop:"1px solid #eee", margin:"6px 0" } }),
      /*#__PURE__*/React.createElement("div", {
        onClick: function(){ setShowCadEditor(true); setShowConfigMenu(false); },
        style: { display:"flex", alignItems:"center", gap:8, padding:"8px 10px", borderRadius:6, fontSize:12, color:"#333", cursor:"pointer" }
      }, "\uD83D\uDCC2 Cadastros"),
      /*#__PURE__*/React.createElement("div", {
        onClick: function(){ setShowColPanel(function(p){ return !p; }); setShowConfigMenu(false); },
        style: { display:"flex", alignItems:"center", gap:8, padding:"8px 10px", borderRadius:6, fontSize:12, color:"#333", cursor:"pointer" }
      }, "\uD83D\uDC41 Ocultar Colunas"),
      /*#__PURE__*/React.createElement("div", {
        onClick: function(){ setShowTheme(function(s){ return !s; }); setShowConfigMenu(false); },
        style: { display:"flex", alignItems:"center", gap:8, padding:"8px 10px", borderRadius:6, fontSize:12, color:"#333", cursor:"pointer" }
      }, "\uD83C\uDFA8 Cor do Tema"),
      /*#__PURE__*/React.createElement("div", { style:{ borderTop:"1px solid #eee", margin:"6px 0" } }),
      /*#__PURE__*/React.createElement("div", {
        onClick: function(){ setShowImportExcel(true); setShowConfigMenu(false); },
        style: { display:"flex", alignItems:"center", gap:8, padding:"8px 10px", borderRadius:6, fontSize:12, color:"#333", cursor:"pointer" }
      }, "\uD83D\uDCE5 Importar Excel"),
      /*#__PURE__*/React.createElement("div", {
        onClick: function(){ setShowEnsinarSistema(true); setShowConfigMenu(false); },
        style: { display:"flex", alignItems:"center", gap:8, padding:"8px 10px", borderRadius:6, fontSize:12, color:"#333", cursor:"pointer" }
      }, "\uD83E\uDDE0 Ensinar Sistema"),
      /*#__PURE__*/React.createElement("div", {
        onClick: function(){ setShowLerIA(true); setShowConfigMenu(false); },
        style: { display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, padding:"8px 10px", borderRadius:6, fontSize:12, color:"#333", cursor:"pointer" }
      },
        /*#__PURE__*/React.createElement("span",null,"\uD83E\uDD16 Ler com IA"),
        iaUsoDia.leituras > 0 && /*#__PURE__*/React.createElement("span", { style:{ fontSize:10, color:"#7c3aed" } }, "R$\u00A0" + iaUsoDia.custo.toFixed(3).replace(".",","))
      )
    ), document.body)
  ),
  showColPanel && /*#__PURE__*/React.createElement(React.Fragment, null,
    /*#__PURE__*/React.createElement("div", {
      onClick: function(){ setShowColPanel(false); },
      onKeyDown: function(e){ e.stopPropagation(); },
      style: { position:"fixed", top:0, left:0, right:0, bottom:0, zIndex:9998 }
    }),
    /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      top: "108px",
      right: "8px",
      background: "#fff",
      borderRadius: 10,
      boxShadow: "0 4px 24px rgba(0,0,0,0.28)",
      padding: "14px 18px",
      zIndex: 9999,
      minWidth: 240,
      maxHeight: "70vh",
      overflowY: "auto",
      overscrollBehavior: "contain",
      animation: "fadeInDown 0.15s ease"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 12,
      color: "#1a1a2e",
      marginBottom: 10,
      letterSpacing: 0.5
    }
  }, "OCULTAR COLUNAS"), /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "6px 0",
      borderBottom: "1px solid #f0f2f5",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: !hiddenCols.resumo,
    onChange: function onChange() {
      return toggleCol("resumo");
    },
    style: {
      width: 16,
      height: 16
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: "#2a5298",
      fontWeight: 600
    }
  }, "RESUMO")), temOrcamento && /*#__PURE__*/React.createElement("label", {
    style: { display:"flex", alignItems:"center", gap:8, padding:"6px 0", borderBottom:"1px solid #f0f2f5", cursor:"pointer" }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: !hiddenCols.orcamento,
    onChange: function(){ return toggleCol("orcamento"); },
    style: { width:16, height:16 }
  }), /*#__PURE__*/React.createElement("span", {
    style: { fontSize:13, color:"#b87800", fontWeight:600 }
  }, "OR\xc7AMENTO")), fornecedores.map(function (f) {
    return /*#__PURE__*/React.createElement("label", {
      key: f.id,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 0",
        borderBottom: "1px solid #f0f2f5",
        cursor: "pointer"
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      checked: !hiddenCols[f.id],
      onChange: function onChange() {
        return toggleCol(f.id);
      },
      style: {
        width: 16,
        height: 16
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: "#333",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        maxWidth: 180
      }
    }, f.nome || "FORNECEDOR"));
  }))
  ),
  /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      color: saved ? "#7fc97f" : "#f0c060",
      minWidth: 72,
      textAlign: "right"
    }
  }, saved ? "✓ SALVO" : "SALVANDO…"),
  /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      logEventoDiag("PDF gerado: mapa " + (mapa.numero != null ? mapa.numero : "?") + (showDashboard ? " + Dashboard" : "") + (inclAnalise ? " + An\u00e1lise" : ""));
      var mapaVis = Object.assign({}, mapa, { itens: itensAtivos, fornecedores: fornecedoresVisiveis, orcOculto: orcOculto });
      var htmlMapa = buildMapaHTML(mapaVis, clock, orcamentos, associacoes);
      var extraParts = '';
      if (showDashboard) extraParts += '<div style="page-break-before:always;">' + buildDashboardHTML(mapaVis, clock, orcamentos, associacoes) + '</div>';
      if (inclAnalise) extraParts += '<div style="page-break-before:always;">' + buildAnaliseHTML(mapaVis, clock, orcamentos, associacoes) + '</div>';
      if (!extraParts) return abrirPDF(htmlMapa);
      return abrirPDF(htmlMapa.replace('</body></html>', extraParts + '</body></html>'));
    },
    title: "Gerar PDF do mapa de cotação",
    style: _objectSpread(_objectSpread({}, SC.backBtn), {}, {
      background: "#c0392b",
      color: "#fff",
      gap: 5
    })
  }, /*#__PURE__*/React.createElement(IcoPDF, null), " PDF")
  )), showTheme && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#162840",
      padding: "10px 20px",
      display: "flex",
      gap: 8,
      alignItems: "center",
      flexWrap: "wrap",
      borderBottom: "2px solid #f0a500"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#8aabce",
      fontSize: 11,
      fontWeight: 700
    }
  }, "COR:"), THEMES.map(function (t) {
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      onClick: function onClick() {
        logEventoDiag("COR DE TEMA alterada: mapa " + (mapa.numero != null ? mapa.numero : "?") + " \u2192 " + t.name);
        update(function (m) {
          return _objectSpread(_objectSpread({}, m), {}, {
            corTema: t.id
          });
        });
        setShowTheme(false);
      },
      style: {
        background: t.hdr,
        border: mapa.corTema === t.id ? "3px solid #f0a500" : "2px solid transparent",
        borderRadius: 7,
        padding: "6px 14px",
        fontSize: 11,
        fontWeight: 700,
        cursor: "pointer",
        color: "#fff"
      }
    }, t.name);
  })), /*#__PURE__*/React.createElement("div", {
    ref: mapContainerRef,
    style: {
      padding: "14px 12px 60px"
    }
  }, chunks.map(function (chunk, ci) {
    return renderChunk(chunk, ci, hiddenCols);
  }), showDashboard && /*#__PURE__*/React.createElement("div", {
    key: "dashboard-screen",
    style: { marginTop: 20 },
    dangerouslySetInnerHTML: { __html: buildDashboardHTML(Object.assign({}, mapa, { itens: itensAtivos, fornecedores: fornecedoresVisiveis }), clock, orcamentos, associacoes) }
  }),
  inclAnalise && /*#__PURE__*/React.createElement("div", {
    key: "analise-screen",
    style: { marginTop: 20 },
    dangerouslySetInnerHTML: { __html: buildAnaliseHTML(Object.assign({}, mapa, { itens: itensAtivos, fornecedores: fornecedoresVisiveis }), clock, orcamentos, associacoes) }
  }))),
  // Modal de associação de orçamento
  itemAssociando && /*#__PURE__*/React.createElement(Modal, { open: true, onClose: function(){ setItemAssociando(null); }, maxWidth: 600 },
    /*#__PURE__*/React.createElement("div", {style:SC.mHdr},
      /*#__PURE__*/React.createElement("span", {style:SC.mTitle}, "\ud83d\udd17 ASSOCIAR AO OR\xc7AMENTO"),
      /*#__PURE__*/React.createElement("button", {style:{background:"none",border:"none",color:"#999",cursor:"pointer"},onClick:function(){setItemAssociando(null);}}, /*#__PURE__*/React.createElement(IcoClose, null))),
    /*#__PURE__*/React.createElement("div", {style:{padding:"16px 22px 20px",display:"flex",flexDirection:"column",gap:12}},
      /*#__PURE__*/React.createElement("div", {style:{background:"#f0f4ff",borderRadius:7,padding:"8px 12px",fontSize:12}},
        "Insumo: ", /*#__PURE__*/React.createElement("strong", null, itemAssociando.descricao), " | Qt: ", /*#__PURE__*/React.createElement("strong", null, itemAssociando.qt, " ", itemAssociando.unid)),
      /*#__PURE__*/React.createElement(React.Fragment, null,
        /*#__PURE__*/React.createElement("input", {value:assocBusca, onChange:function(e){setAssocBusca(e.target.value.toUpperCase());}, placeholder:"BUSCAR NO OR\xc7AMENTO...", style:{border:"1.5px solid #dde1e9",borderRadius:8,padding:"9px 12px",fontSize:12,outline:"none",width:"100%",fontFamily:"inherit",textTransform:"uppercase"}}),
        /*#__PURE__*/React.createElement("div", {style:{maxHeight:200,overflowY:"auto",border:"1px solid #e4e8f0",borderRadius:8}},
          obraOrcItens.map(function(it,idxIt){ return {it:it,idxIt:idxIt}; }).filter(function(x){ return !assocBusca||x.it.descricao.toUpperCase().includes(assocBusca); }).slice(0,30).map(function(x){ var it=x.it; var idxIt=x.idxIt;
            var saldo=orcSaldoDisponivel(it, associacoes, obraOrcItens);
            var isMarcado = assocSelecionados.hasOwnProperty(idxIt);
            var selData = assocSelecionados[idxIt] || {};
            return /*#__PURE__*/React.createElement("div", {key:idxIt, style:{padding:"8px 10px",borderBottom:"1px solid #f0f2f6",fontSize:11,background:isMarcado?"#e8f0ff":"transparent",borderLeft:isMarcado?"3px solid #2a5298":"3px solid transparent"}},
              /*#__PURE__*/React.createElement("div", {style:{display:"flex",alignItems:"flex-start",gap:8,cursor:"pointer"}, onClick:function(){
                var novo = Object.assign({}, assocSelecionados);
                if (isMarcado) { delete novo[idxIt]; } else { novo[idxIt] = { qt: "", fator: "1" }; }
                setAssocSelecionados(novo);
              }},
                /*#__PURE__*/React.createElement("input", {type:"checkbox",readOnly:true,checked:!!isMarcado,onChange:function(){},style:{marginTop:2,accentColor:"#2a5298",cursor:"pointer",flexShrink:0}}),
                /*#__PURE__*/React.createElement("div", {style:{flex:1}},
                  /*#__PURE__*/React.createElement("div", {style:{fontWeight:isMarcado?700:400}}, it.descricao),
                  /*#__PURE__*/React.createElement("div", {style:{fontSize:10,color:"#888",marginTop:2}}, it.unidade, " \u2022 Qtd: ", it.quantidade, " \u2022 Saldo: ", /*#__PURE__*/React.createElement("strong", {style:{color:saldo>0?"#186818":"#aa1c1c"}}, saldo.toLocaleString("pt-BR",{maximumFractionDigits:3})), " \u2022 R$ ", (it.valorUnitario||0).toLocaleString("pt-BR",{minimumFractionDigits:2}), "/", it.unidade))),
              isMarcado && /*#__PURE__*/React.createElement("div", {style:{marginTop:6,paddingLeft:24,display:"flex",alignItems:"center",gap:8}},
                /*#__PURE__*/React.createElement("span", {style:{fontSize:11,color:"#2a5298",fontWeight:700}}, "QT:"),
                /*#__PURE__*/React.createElement("input", {type:"number",value:selData.qt||"",min:"0.001",step:"0.001",placeholder:String(saldo.toLocaleString("pt-BR",{maximumFractionDigits:3})),onChange:function(e){
                  var novo = Object.assign({}, assocSelecionados);
                  novo[idxIt] = Object.assign({}, selData, { qt: e.target.value });
                  setAssocSelecionados(novo);
                },style:{width:100,border:"1.5px solid #2a5298",borderRadius:6,padding:"4px 8px",fontSize:12,textAlign:"right",outline:"none"}}),
                /*#__PURE__*/React.createElement("span", {style:{fontSize:11}}, it.unidade),
                it.unidade !== itemAssociando.unid && /*#__PURE__*/React.createElement(React.Fragment, null,
                  /*#__PURE__*/React.createElement("span", {style:{fontSize:10,color:"#856404",marginLeft:4}}, "Fator:"),
                  /*#__PURE__*/React.createElement("input", {type:"number",value:selData.fator||"1",min:"0.001",step:"0.001",onChange:function(e){
                    var novo = Object.assign({}, assocSelecionados);
                    novo[idxIt] = Object.assign({}, selData, { fator: e.target.value });
                    setAssocSelecionados(novo);
                  },style:{width:60,border:"1.5px solid #e0c060",borderRadius:6,padding:"4px 6px",fontSize:12,textAlign:"right",outline:"none"}})),
                /*#__PURE__*/React.createElement("span", {style:{fontSize:10,color:"#888",marginLeft:"auto"}}, "Saldo: ", saldo.toLocaleString("pt-BR",{maximumFractionDigits:3}))));
          })),
        /*#__PURE__*/React.createElement("div", {style:{display:"flex",gap:8,marginTop:4}},
          /*#__PURE__*/React.createElement("button", {onClick:confirmarAssoc, disabled:Object.keys(assocSelecionados).length===0, style:Object.assign({},SC.btnPri,{opacity:Object.keys(assocSelecionados).length>0?1:0.4})}, "\u2705 CONFIRMAR"),
          /*#__PURE__*/React.createElement("button", {onClick:function(){setItemAssociando(null);}, style:{background:"#f0f4ff",border:"1.5px solid #2a5298",borderRadius:7,padding:"8px 16px",fontSize:12,fontWeight:700,color:"#2a5298",cursor:"pointer"}}, "\u23ed PULAR"),
          associacoes.filter(function(a){return a.itemMapaId===itemAssociando.id;}).length > 0 && /*#__PURE__*/React.createElement("button", {onClick:function(){ var ids=associacoes.filter(function(a){return a.itemMapaId===itemAssociando.id;}).map(function(a){return a.id;}); if(onSubstituirAssociacoes) onSubstituirAssociacoes(ids,[]); setAssocSelecionados({}); setItemAssociando(null);},style:{background:"#fdeaea",border:"none",borderRadius:7,padding:"8px 12px",fontSize:12,fontWeight:700,color:"#c0392b",cursor:"pointer",marginLeft:"auto"}}, "\ud83d\uddd1 REMOVER TUDO"))
      )
    )
  ),
  // Modal importação dentro do editor
  showGerEd && /*#__PURE__*/React.createElement(ModalGerenciarOrcamento, {
    open: showGerEd,
    onClose: function(){ setShowGerEd(false); setObraGerEd(null); },
    obra: obraGerEd,
    orcamentoAtual: obraGerEd ? calcOrcComConsumo(orcamentos[obraGerEd]||null, obraGerEd, associacoes, mapas) : null,
    associacoes: associacoes,
    mapas: mapas,
    onSalvar: function(dados){ if(onSaveOrcamento) onSaveOrcamento(obraGerEd,dados); }
  }),
  showImpEd && /*#__PURE__*/React.createElement(ModalImportarOrcamento, {
    open: showImpEd,
    onClose: function(){ setShowImpEd(false); setObraImpEd(null); },
    obra: obraImpEd,
    orcamentoAtual: obraImpEd?(orcamentos[obraImpEd]||null):null,
    onSalvar: function(dados){ if(onSaveOrcamento) onSaveOrcamento(obraImpEd,zerarConsumido(dados)); setShowImpEd(false); }
  }),
  obsPopupFornecedor && /*#__PURE__*/React.createElement("div", {
    onClick: function(e){ e.stopPropagation(); }, // clique DENTRO do popup não deve fechá-lo
    style: {
      position: "fixed", top: 70, left: "50%", transform: "translateX(-50%)",
      zIndex: 9500, background: "#fff", border: "2px solid #f0a500", borderRadius: 10,
      boxShadow: "0 8px 28px rgba(0,0,0,0.25)", maxWidth: 480, width: "90%",
      padding: "14px 18px", maxHeight: "60vh", display: "flex", flexDirection: "column", gap: 8
    }
  },
    /*#__PURE__*/React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 } },
      /*#__PURE__*/React.createElement("div", { style: { fontWeight: 800, fontSize: 13, color: "#b87800" } },
        "\ud83d\udcdd OBSERVA\xc7\xd5ES \u2014 ", obsPopupFornecedor.nome),
      /*#__PURE__*/React.createElement("span", {
        onClick: function(){ setObsPopupFornecedor(null); },
        style: { cursor: "pointer", color: "#999", fontSize: 16, lineHeight: "16px" }
      }, "\u2715")
    ),
    /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 12.5, color: "#333", whiteSpace: "pre-wrap", overflowY: "auto", textTransform: "none", lineHeight: 1.5 }
    }, obsPopupFornecedor.texto)
  ),
  showCadEditor && /*#__PURE__*/React.createElement(CadastrosModal, {
    open: showCadEditor,
    onClose: function onClose() { setShowCadEditor(false); },
    cadastros: cadastros,
    onAdd: addCadastro,
    onRemove: removeCadastro || function(){},
    onEdit: editCadastro || function(){},
    onSetObs: setObsFornecedor,
    mapas: mapas,
    orcamentos: orcamentos,
    onImportarOrcamento: function(obra){ setShowCadEditor(false); setTimeout(function(){ setObraImpEd(obra); setShowImpEd(true); }, 200); },
    onLimparOrcamento: onLimparOrcamento,
    onGerenciarOrcamento: function(obra){ setShowCadEditor(false); setTimeout(function(){ setObraGerEd(obra); setShowGerEd(true); }, 200); }
  }),
  showCasar && /*#__PURE__*/React.createElement(ModalCasarInsumos, {
    mapa: mapa, itens: itens,
    onClose: function(){ setShowCasar(false); },
    onAprendizadoSalvo: registrarAprendizado,
    onConfirm: function(ligs) {
      Object.keys(ligs).forEach(function(itemMapaId) {
        var lig=ligs[itemMapaId];
        setPreco(itemMapaId, lig.fornId, fmtBRL(lig.preco));
      });
      setShowCasar(false);
    }
  }),
  showLerIA && /*#__PURE__*/React.createElement(ModalLerComIA, {
    mapa: mapa, itens: itens,
    aprendizados: aprendizados,
    insumoSinonimos: cadastros.insumoSinonimos || {},
    onClose: function(){ setShowLerIA(false); },
    onAprendizadoSalvo: registrarAprendizado,
    onConfirm: function(ligs) {
      var qtdLigs = Object.keys(ligs).length;
      logEventoDiag("LER COM IA: " + qtdLigs + " pre\u00e7o(s) importado(s) para o mapa " + (mapa.numero != null ? mapa.numero : "?"));
      Object.keys(ligs).forEach(function(itemMapaId) {
        var lig=ligs[itemMapaId];
        setPreco(itemMapaId, lig.fornId, fmtBRL(lig.preco));
      });
      setShowLerIA(false);
    },
    onIaUso: function(d){ setIaUsoDia(function(prev){ return { leituras: prev.leituras+1, custo: prev.custo+(d.custo||0) }; }); }
  }),
  // ── TOOLTIP ITEM ATENDIDO ─────────────────────────────────────────────────
  tooltipItemId && /*#__PURE__*/React.createElement('div', {
    onClick: function(){ setTooltipItemId(null); },
    style:{ position:'fixed',top:0,left:0,right:0,bottom:0,zIndex:9999,background:'rgba(0,0,0,0.4)',display:'flex',alignItems:'center',justifyContent:'center',overscrollBehavior:'none' }
  },
    /*#__PURE__*/React.createElement('div', {
      style:{ background:'#fff',borderRadius:8,padding:'16px 20px',maxWidth:340,boxShadow:'0 8px 24px rgba(0,0,0,0.3)',border:'2px solid #3B6D11' }
    },
      /*#__PURE__*/React.createElement('div', { style:{fontWeight:'bold',fontSize:12,color:'#3B6D11',marginBottom:10} }, '\uD83D\uDD12 ITEM TOTALMENTE ATENDIDO'),
      (itensAtendidosMap[tooltipItemId]&&itensAtendidosMap[tooltipItemId].pedidos||[]).map(function(p, i){
        return /*#__PURE__*/React.createElement('div', { key:i, style:{fontSize:11,color:'#333',padding:'4px 0',borderBottom:'1px solid #eee'} },
          /*#__PURE__*/React.createElement('strong', { style:{color:'#7c3aed'} }, p.num),
          ' \u00B7 ' + p.forn + ' \u00B7 ' + p.qt + ' un',
          /*#__PURE__*/React.createElement('span', { style:{background:'#EAF3DE',color:'#3B6D11',padding:'1px 6px',borderRadius:99,fontSize:9,marginLeft:6} }, p.status)
        );
      }),
      /*#__PURE__*/React.createElement('div', { style:{marginTop:10,fontSize:10,color:'#888',textAlign:'center'} }, 'Toque fora para fechar')
    )
  ),
  // ── MODAL STEP 1 — Seleção de Itens para Pedido ──────────────────────────
  showPedidoModal && /*#__PURE__*/React.createElement(ModalPedidoStep1, {
    mapa: mapa,
    itens: itensCombinadosPO,
    mapasDaMesmaObra: mapasDaMesmaObra,
    mapasAdicionaisPO: mapasAdicionaisPO,
    onAdicionarMapa: function(mapaId){ setMapasAdicionaisPO(function(prev){ return prev.indexOf(mapaId)>=0 ? prev : prev.concat([mapaId]); }); },
    onRemoverMapa: function(mapaId){
      setMapasAdicionaisPO(function(prev){ return prev.filter(function(id){ return id!==mapaId; }); });
      // FIX: ao remover um mapa da seleção, também desmarca (se estiverem marcados) os itens
      // que vieram dele — evita ficar com itens "fantasmas" selecionados de um mapa que o
      // usuário decidiu não incluir mais.
      var m = (mapas||[]).find(function(mm){ return mm && mm.id === mapaId; });
      var idsDoMapa = m ? (m.itens||[]).map(function(it){ return it.id; }) : [];
      setItensSelecionadosPO(function(prev){ return prev.filter(function(id){ return idsDoMapa.indexOf(id)<0; }); });
    },
    pedidos: pedidos,
    itensSelecionados: itensSelecionadosPO,
    onToggle: function(id){ setItensSelecionadosPO(function(prev){ var n=prev.slice(); var i=n.indexOf(id); if(i>=0) n.splice(i,1); else n.push(id); return n; }); },
    onToggleAll: function(ids){ setItensSelecionadosPO(ids); },
    onClose: function(){ setShowPedidoModal(false); setMapasAdicionaisPO([]); },
    onContinuar: function(){
      var cfg = {};
      itensSelecionadosPO.forEach(function(id){
        cfg[id] = [{ fornId:'', fornNome:'', vlUnit:0, qt:'', obs:'' }];
      });
      setPedidoConfig(cfg);
      setShowPedidoModal(false);
      setShowPedidoConfig(true);
    }
  }),
  // ── MODAL STEP 2 — Configurar Fornecedor e Quantidade ──────────────────
  showPedidoConfig && /*#__PURE__*/React.createElement(ModalPedidoStep2, {
    mapa: mapa,
    itens: itensCombinadosPO,
    mapas: mapas,
    pedidos: pedidos,
    config: pedidoConfig,
    onConfig: setPedidoConfig,
    poFinanceiro: poFinanceiro,
    onFinanceiro: setPoFinanceiro,
    observacaoInicial: '',
    onVoltar: function(){ setShowPedidoConfig(false); setShowPedidoModal(true); },
    onClose: function(){ setShowPedidoConfig(false); setMapasAdicionaisPO([]); },
    onGerar: function(config, finConfig, onDone, formaPagamento, obsPedido){
      // Agrupar por fornecedor
      var grupos = {};
      Object.keys(config).forEach(function(itemId){
        var item = itensCombinadosPO.find(function(i){ return i.id === itemId; });
        if (!item) return;
        (config[itemId]||[]).forEach(function(linha){
          if (!linha.fornId || !linha.qt || Number(linha.qt)<=0) return;
          var k = linha.fornId;
          if (!grupos[k]) grupos[k] = { fornId: linha.fornId, fornNome: linha.fornNome, itens: [] };
          var vlUnit = Number(linha.vlUnit)||0;
          var qtN = Number(linha.qt)||0;
          var existingItem = grupos[k].itens.find(function(i){ return i.item_id === item.id; });
          if (existingItem) {
            existingItem.qt_pedida += qtN;
            existingItem.vl_total  += vlUnit * qtN;
          } else {
            grupos[k].itens.push({
              item_id: item.id,
              descricao: item.descricao||'',
              detalhe: item.detalhe||'',
              unid: item.unid||'',
              qt_pedida: qtN,
              qt_total: Number(item.qt)||0,
              vl_unit: vlUnit,
              vl_total: vlUnit * qtN,
              // FIX (implementação alinhada com layout aprovado): grava de qual mapa este item
              // específico veio — necessário porque itens de um mesmo pedido agora podem vir de
              // mapas diferentes. Usa o mapa aberto como reserva de segurança (nunca fica sem
              // valor), mas na prática sempre vem de "_mapaOrigemId/_mapaOrigemNumero", que a
              // lista combinada preenche para TODO item, seja do mapa aberto ou de outro incluído.
              mapa_id: item._mapaOrigemId || mapa.id,
              mapa_numero: item._mapaOrigemNumero != null ? item._mapaOrigemNumero : mapa.numero
            });
          }
        });
      });
      var fornLista = Object.values(grupos);
      if (!fornLista.length) { alert('Nenhum item com fornecedor e quantidade preenchidos.'); if(onDone) onDone(); return; }
      // Verificar itens com preço zero
      var itensPrecoZero = [];
      fornLista.forEach(function(g){
        g.itens.forEach(function(it){
          if((it.vl_unit===0||!it.vl_unit) && it.qt_pedida>0){
            itensPrecoZero.push('• '+it.descricao+(it.detalhe?' ('+it.detalhe+')':'')+' — '+g.fornNome);
          }
        });
      });
      if(itensPrecoZero.length>0){
        if(!confirm('⚠️ Atenção! Os itens abaixo estão com preço unitário ZERO:\n\n'+itensPrecoZero.join('\n')+'\n\nIsso pode indicar que o preço não está cadastrado para este fornecedor.\n\nDeseja gerar o pedido assim mesmo?')){
          if(onDone) onDone(); return;
        }
      }
      sbGetNextNumeroPO().then(function(nextNum){
        // Garantir que o número é maior que qualquer PO local existente
        var maxLocal = (pedidos||[]).reduce(function(max,p){ return Math.max(max, Number(p.numero)||0); }, 0);
        var safeNext = Math.max(nextNum, maxLocal + 1);
        var promises = fornLista.map(function(g, idx){
          var num = safeNext + idx;
          var subtotal = g.itens.reduce(function(s,i){ return s + i.vl_total; }, 0);
          var fin = (finConfig||{})[g.fornId] || {};
          var descVal  = parsePOVal(fin.desconto),  descMode  = fin.desconto_mode||'%';
          var acrVal   = parsePOVal(fin.acrescimo), acrMode   = fin.acrescimo_mode||'%';
          var freteVal = parsePOVal(fin.frete),     freteMode = fin.frete_mode||'R$';
          var impVal   = parsePOVal(fin.impostos),  impMode   = fin.impostos_mode||'%';
          // FIX: mesma proteção das outras 2 instâncias — este é o cálculo que realmente vai para
          // o banco como valor final do pedido, então é o ponto mais crítico dos três.
          var vlDesc   = Math.max(0, descMode==='%'  ? subtotal*descVal/100  : descVal);
          var vlAcr    = Math.max(0, acrMode==='%'   ? subtotal*acrVal/100   : acrVal);
          var baseImp  = Math.max(0, subtotal - vlDesc + vlAcr);
          var vlFrete  = Math.max(0, freteMode==='%' ? subtotal*freteVal/100 : freteVal);
          var vlImp    = Math.max(0, impMode==='%'   ? baseImp*impVal/100    : impVal);
          var total    = baseImp + vlImp + vlFrete;
          var po = {
            id: uid(),
            numero: num,
            mapa_id: mapa.id,
            // FIX (implementação alinhada com layout aprovado): lista única dos números de mapa
            // que contribuíram itens para ESTE pedido específico (um por fornecedor/grupo) —
            // usada na exibição e no PDF. "mapa_id" acima continua existindo e apontando pro mapa
            // que estava aberto quando o pedido foi criado (o "âncora") — nada que já dependia
            // dele foi alterado; isto é só um campo novo, adicional.
            mapas_numeros: Array.from(new Set(g.itens.map(function(it){ return it.mapa_numero; }).filter(function(n){ return n!=null; }))),
            obra: mapa.obra||'',
            fornecedor_id: g.fornId,
            fornecedor_nome: g.fornNome,
            itens: g.itens,
            observacao: obsPedido||'',
            financeiro: { 
              desconto:descVal, desconto_mode:descMode,
              acrescimo:acrVal, acrescimo_mode:acrMode,
              frete:freteVal,   frete_mode:freteMode,
              impostos:impVal,  impostos_mode:impMode
            },
            total: total,
            status: 'rascunho',
            forma_pagamento: formaPagamento||'',
            data_emissao: null,
            criado_em: new Date().toISOString()
          };
          return sbSavePedido(po).then(function(){
            logEventoDiag("PEDIDO criado: PO-" + String(po.numero).padStart(3,'0') + " — " + po.fornecedor_nome + " (" + (po.itens||[]).length + " itens, R$ " + total.toFixed(2) + ")");
            return po;
          });
        });
        Promise.all(promises).then(function(novos){
          sbGetPedidos().then(function(d){ setPedidos(d||[]); });
          setShowPedidoConfig(false);
          setMapasAdicionaisPO([]);
          if(onDone) onDone();
          alert('✅ ' + novos.length + ' pedido(s) gerado(s) com sucesso!\n' + novos.map(function(p){ return 'PO-'+String(p.numero).padStart(3,'0')+' \u2192 '+p.fornecedor_nome; }).join('\n'));
          setShowPedidos(true);
        }).catch(function(e){
          if(onDone) onDone();
          logEventoDiag("\u2716 ERRO ao gerar pedido(s): " + (e && e.message ? e.message : "falha de conex\u00e3o"));
          alert('❌ Erro ao gerar pedidos:\n' + (e.message||'Verifique sua conexão com a internet e tente novamente.'));
        });
      });
    }
  }),
  // ── TELA PEDIDOS ─────────────────────────────────────────────────────────
  // ── Modal Edição de Pedido Existente ──────────────────────────────────────
  showImportExcel && /*#__PURE__*/React.createElement(ModalImportarExcelMapa, {
    cadastrosInsumos: cadastros.insumos||[],
    aprendizados: aprendizados,
    onAprendizadoSalvo: registrarAprendizado,
    onClose: function(){ setShowImportExcel(false); },
    onConfirmar: function(itensParaImportar){
      logEventoDiag("IMPORTAR EXCEL: " + (itensParaImportar||[]).length + " item(ns) importado(s) para o mapa " + (mapa && mapa.numero != null ? mapa.numero : "?"));
      update(function (m) {
        var proximoNum = m.itens.length;
        var novos = itensParaImportar.map(function(it, i){
          return {
            id: uid(),
            num: proximoNum + i + 1,
            descricao: it.descricaoFinal,
            detalhe: "",
            qt: it.qt,
            unid: it.unid
          };
        });
        return _objectSpread(_objectSpread({}, m), {}, {
          itens: [].concat(_toConsumableArray(m.itens), novos)
        });
      });
      setShowImportExcel(false);
    }
  }),
  showEnsinarSistema && /*#__PURE__*/React.createElement(ModalEnsinarSistema, {
    cadastrosInsumos: cadastros.insumos||[],
    aprendizados: aprendizados,
    onAprendizadoSalvo: registrarAprendizado,
    onAprendizadoRemovido: desfazerAprendizado,
    onClose: function(){ setShowEnsinarSistema(false); }
  }),
  showPedidoEdicao && poEmEdicao && /*#__PURE__*/React.createElement(ModalPedidoStep2, {
    mapa: mapa,
    itens: (mapa && mapa.itens)||[],
    itensPedidoOriginal: poEmEdicao.itens||[],
    mapas: mapas,
    // FIX CRÍTICO: excluir o próprio pedido do cálculo de "já pedido" — senão o sistema
    // conta a quantidade que está sendo editada como se já tivesse sido processada,
    // fazendo o "pendente" aparecer 0 e gerando avisos incorretos.
    pedidos: (pedidos||[]).filter(function(p){ return p.id !== poEmEdicao.id; }),
    modoEdicao: true,
    formaPagamentoInicial: poEmEdicao.forma_pagamento||'',
    observacaoInicial: poEmEdicao.observacao||'',
    config: configEdicao,
    onConfig: setConfigEdicao,
    poFinanceiro: poFinanceiro,
    onFinanceiro: setPoFinanceiro,
    onVoltar: function(){},
    onClose: function(){ setShowPedidoEdicao(false); setPoEmEdicao(null); setPoFinanceiro({}); setConfigEdicao({}); },
    onGerar: function(config, finConfig, onDone, formaPagamento, obsPedido){
      // Modo edição: recalcula itens e total a partir do config atual (igual ao fluxo novo)
      var itensEditados = [];
      var sub = 0;
      Object.keys(config).forEach(function(itemId){
        var item = ((mapa && mapa.itens)||[]).find(function(i){ return i.id===itemId; });
        if(!item) {
          // FIX (2ª parte do mesmo bug — achado ao testar a correção anterior): item de outro
          // mapa — antes disso, o código usava os dados ORIGINAIS do pedido sem olhar pra
          // "config" (o estado que a tela edita), ou seja, mudar a quantidade na tela parecia
          // funcionar (aparecia o número novo), mas ao salvar, a mudança era descartada
          // silenciosamente e o valor antigo voltava. Agora usa a MESMA lógica do bloco de baixo
          // (que já funcionava certo pra itens do mapa aberto): pega a quantidade/valor que estão
          // de fato em "config" agora — só usa a descrição/detalhe/unidade originais do pedido,
          // que não são editáveis nesse fluxo mesmo (não mudam, só a quantidade muda aqui).
          var itOrig = (poEmEdicao.itens||[]).find(function(i){ return i.item_id===itemId; });
          if (!itOrig) return;
          (config[itemId]||[]).forEach(function(linha){
            if(!linha.qt || Number(linha.qt)<=0) return;
            var vlUnit = Number(linha.vlUnit)||Number(itOrig.vl_unit)||0;
            var qtN = Number(linha.qt)||0;
            var vlTot = vlUnit * qtN;
            sub += vlTot;
            var existente = itensEditados.find(function(i){ return i.item_id === itemId; });
            if (existente) {
              existente.qt_pedida += qtN;
              existente.vl_total += vlTot;
            } else {
              itensEditados.push({
                item_id: itemId,
                descricao: itOrig.descricao||'',
                detalhe: itOrig.detalhe||'',
                unid: itOrig.unid||'',
                qt_pedida: qtN,
                qt_total: Number(itOrig.qt_total)||0,
                vl_unit: vlUnit,
                vl_total: vlTot,
                // FIX (achado ao testar "editar um pedido que já nasceu com itens de vários
                // mapas" — a origem estava se perdendo ao salvar uma edição): usa a origem já
                // salva no próprio pedido (itOrig.mapa_id/numero) — reserva de segurança pro
                // mapa aberto agora, caso o pedido seja de antes dessa informação existir.
                mapa_id: itOrig.mapa_id || mapa.id,
                mapa_numero: itOrig.mapa_numero != null ? itOrig.mapa_numero : mapa.numero
              });
            }
          });
          return;
        }
        (config[itemId]||[]).forEach(function(linha){
          if(!linha.fornId || !linha.qt || Number(linha.qt)<=0) return;
          var vlUnit = Number(linha.vlUnit)||0;
          var qtN = Number(linha.qt)||0;
          var vlTot = vlUnit * qtN;
          sub += vlTot;
          // FIX 3: mesclar se já existir entrada para este item (igual ao fluxo de criação)
          var existente = itensEditados.find(function(i){ return i.item_id === item.id; });
          if (existente) {
            existente.qt_pedida += qtN;
            existente.vl_total += vlTot;
          } else {
            itensEditados.push({
              item_id: item.id,
              descricao: item.descricao||'',
              detalhe: item.detalhe||'',
              unid: item.unid||'',
              qt_pedida: qtN,
              qt_total: Number(item.qt)||0,
              vl_unit: vlUnit,
              vl_total: vlTot,
              // FIX (mesma correção do bloco acima): este item foi encontrado dentro de
              // "mapa.itens" (o mapa aberto agora), então pertence a ele com certeza.
              mapa_id: mapa.id,
              mapa_numero: mapa.numero
            });
          }
        });
      });
        if(itensEditados.length === 0){
          if(onDone) onDone();
          alert('\u274C O pedido deve ter pelo menos um insumo. Adicione itens antes de salvar.');
          return;
        }
      // FIX 4 (Claudio, 05/08): a observação virou um campo único do pedido inteiro (não mais
      // uma caixa por item que precisava ser sincronizada/agregada) — resolve de vez a série
      // de bugs anteriores, porque não existe mais cópia nenhuma para gerenciar.
      var observacaoFinal = obsPedido||'';
      var fin = (finConfig||{})[poEmEdicao.fornecedor_id]||{};
      var dV=parsePOVal(fin.desconto), dM=fin.desconto_mode||'%';
      var aV=parsePOVal(fin.acrescimo), aM=fin.acrescimo_mode||'%';
      var fV=parsePOVal(fin.frete), fM=fin.frete_mode||'R$';
      var iV=parsePOVal(fin.impostos), iM=fin.impostos_mode||'%';
      // FIX: mesma proteção já aplicada nas outras 3 instâncias deste cálculo (tela de criar, PDF
      // oficial, salvamento ao criar) — esta é a 4ª instância, no fluxo de EDITAR um pedido já
      // existente, que tinha escapado da correção anterior por ser um caminho de código separado.
      var vlD=Math.max(0, dM==='%'?sub*dV/100:dV), vlA=Math.max(0, aM==='%'?sub*aV/100:aV);
      var base=Math.max(0, sub-vlD+vlA);
      var vlF=Math.max(0, fM==='%'?sub*fV/100:fV), vlI=Math.max(0, iM==='%'?base*iV/100:iV);
      var total=base+vlI+vlF;
      var campos = {
        itens: itensEditados,
        // FIX (mesma verificação extra que achou os 2 problemas acima): recalcula a lista de
        // mapas envolvidos a partir dos itens já editados (agora que cada um tem mapa_numero
        // corretamente) — sem isso, um pedido editado ficaria com a informação de mapas
        // desatualizada, mesmo que os itens individuais estivessem corretos.
        mapas_numeros: Array.from(new Set(itensEditados.map(function(it){ return it.mapa_numero; }).filter(function(n){ return n!=null; }))),
        financeiro: {desconto:dV,desconto_mode:dM,acrescimo:aV,acrescimo_mode:aM,frete:fV,frete_mode:fM,impostos:iV,impostos_mode:iM},
        total: total,
        forma_pagamento: formaPagamento||'',
        observacao: observacaoFinal
      };
      logEventoDiag("PEDIDO editado: PO-" + String(poEmEdicao.numero).padStart(3,'0'));
      sbUpdatePedido(poEmEdicao.id, campos).then(function(){
        sbGetPedidos().then(function(d){ setPedidos(d||[]); });
        setShowPedidoEdicao(false);
        setPoEmEdicao(null);
        setPoFinanceiro({});
        setConfigEdicao({});
        if(onDone) onDone();
        alert('\u2705 Pedido PO-'+String(poEmEdicao.numero).padStart(3,'0')+' atualizado com sucesso!');
      }).catch(function(e){
        if(onDone) onDone();
        logEventoDiag("\u2716 ERRO ao editar pedido PO-" + String(poEmEdicao.numero).padStart(3,'0') + ": " + (e && e.message ? e.message : "falha de conex\u00e3o"));
        alert('\u274C Erro ao salvar edi\u00e7\u00e3o do pedido. Verifique sua conex\u00e3o e tente novamente.');
      });
    }
  }),
  showPedidos && /*#__PURE__*/React.createElement(TelaPedidos, {
    pedidos: pedidos,
    mapa: mapa,
    itensDoMapa: (mapa && mapa.itens)||[],
    itensAtendidosMap: itensAtendidosMap,
    obras: (function(){
      var fromCad = cadastros.obras||[];
      var fromPed = (pedidos||[]).map(function(p){ return p.obra||''; }).filter(Boolean);
      var todas = fromCad.concat(fromPed);
      return todas.filter(function(o,i){ return o && todas.indexOf(o)===i; }).sort();
    })(),
    onClose: function(){ setShowPedidos(false); },
    onRefresh: function(){ sbGetPedidos().then(function(d){ setPedidos(d||[]); }); },
    onEditarPedido: function(po){
      // Abrir Step2 em modo edição com dados do PO existente
      setPoEmEdicao(po);
      setPoFinanceiro(_defineProperty({}, po.fornecedor_id, po.financeiro||{}));
      // Inicializar configEdicao com os itens do PO
      var cfgEd = {};
      (po.itens||[]).forEach(function(it){
        cfgEd[it.item_id] = [{ fornId: po.fornecedor_id, fornNome: po.fornecedor_nome, qt: String(it.qt_pedida||''), vlUnit: it.vl_unit||0 }];
      });
      setConfigEdicao(cfgEd);
      setShowPedidos(false);
      setShowPedidoEdicao(true);
    },
    onUpdateStatus: function(id, status, statusAnterior){
      // FIX: registra data de emissão real APENAS quando é emissão de verdade (rascunho→emitido)
      // Ao desfazer recebimento (recebido→emitido), a data original NÃO é sobrescrita.
      var campos = { status: status };
      if(status === 'emitido' && statusAnterior === 'rascunho') campos.data_emissao = new Date().toISOString();
      logEventoDiag("PEDIDO status alterado: id " + id + " (" + (statusAnterior||"?") + " \u2192 " + status + ")");
      sbUpdatePedido(id, campos).then(function(){
        sbGetPedidos().then(function(d){ setPedidos(d||[]); });
      }).catch(function(e){
        logEventoDiag("\u2716 ERRO ao alterar status do pedido id " + id + ": " + (e && e.message ? e.message : "falha de conex\u00e3o"));
        window.avisarErroSalvamento('Não foi possível atualizar o status do pedido. Verifique sua conexão e tente novamente.');
      });
    },
    onPDF: function(po){ logEventoDiag("PDF pedido gerado: PO-" + String(po.numero).padStart(3,'0')); abrirPDF(buildPedidoPDF(po)); }
  })
  );
}

// ─── V4 CSS — Modal Pedido Step 1 ───────────────────────────────────────────
