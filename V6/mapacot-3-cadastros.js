// FIX (pedido do Claudio — Vendedor agora é uma LISTA, escolhida no mapa como as formas de
// pagamento): dados salvos ANTES desta mudança guardam um texto único (ex: "FRANCISCO"), não uma
// lista. Esta função lê os dois formatos sem diferença — nada do que já foi cadastrado se perde.
function normalizeVendedorLista(valor) {
  if (Array.isArray(valor)) return valor;
  if (valor) return [valor];
  return [];
}
// FIX (pedido do Claudio — cadastro em lote de vendedor/pagamento, depois da perda de dados pelo
// bug da condição de corrida): cola uma lista (fornecedor, vendedor(es), forma(s) de pagamento)
// e cadastra vários fornecedores de uma vez. O fornecedor precisa JÁ EXISTIR no cadastro — este
// modal casa o nome digitado com a lista existente (sem diferenciar maiúscula/acento), nunca
// cria fornecedor novo por engano a partir de um nome digitado errado.
function ModalLoteVendedorPagamento(_ref_lote) {
  var fornecedoresExistentes = _ref_lote.fornecedoresExistentes || [],
    onClose = _ref_lote.onClose,
    onConfirmar = _ref_lote.onConfirmar;
  var _sT = useState(""), textoColado = _slicedToArray(_sT, 2)[0], setTextoColado = _slicedToArray(_sT, 2)[1];
  var _sR = useState(null), resultados = _slicedToArray(_sR, 2)[0], setResultados = _slicedToArray(_sR, 2)[1];

  // FIX: match exato (via normalize, igual ao resto do sistema) primeiro; nomes de fornecedor
  // reais variam muito em pontuação ("LTDA" vs "LTDA.", vírgulas, espaços duplos) — alguém
  // recadastrando de memória (como o Claudio, depois da perda de dados) facilmente digita sem
  // essas pequenas diferenças. Por isso, se o match exato falhar, tenta uma comparação mais
  // tolerante (sem pontuação/espaços extras) antes de desistir — só usa o resultado se houver
  // EXATAMENTE UM candidato, nunca escolhe entre vários por conta própria.
  var mapaNormalizado = {}; // normalize(nome digitado) -> nome oficial já cadastrado
  // FIX (pedido do Claudio — nomes reais têm parênteses, barra, "&", e MUITO acento em
  // português): a versão anterior só tolerava ponto/vírgula/ponto-e-vírgula/hífen, e usava
  // "normalize" (só maiúscula) — vulnerável a diferenças de como o texto foi colado (às vezes
  // o MESMO texto visualmente pode ter uma codificação Unicode ligeiramente diferente depois
  // de passar por outro app/teclado, mesmo copiado e colado sem querer mudar nada). Agora usa
  // "normalizeBusca" (já usada em buscas no resto do sistema — remove acento de forma robusta,
  // não depende de como o acento foi codificado) e tolera parênteses, barra e "&" como ruído.
  var chaveTolerante = function(s) { return normalizeBusca(s).replace(/[.,;\-()/&]/g, "").replace(/\s+/g, " ").trim(); };
  var mapaTolerante = {}; // versão sem pontuação -> lista de nomes oficiais que batem
  fornecedoresExistentes.forEach(function(f) {
    mapaNormalizado[normalize(f)] = f;
    var chave = chaveTolerante(f);
    if (!mapaTolerante[chave]) mapaTolerante[chave] = [];
    mapaTolerante[chave].push(f);
  });

  var handleVerificar = function() {
    var linhas = textoColado.split("\n").map(function(l) { return l.trim(); }).filter(function(l) { return l.length > 0; });
    var processados = linhas.map(function(linha) {
      // Aceita TAB (colar do Excel) ou ; (digitar manualmente) como separador de coluna.
      var colunas = linha.indexOf("\t") >= 0 ? linha.split("\t") : linha.split(";");
      var nomeDigitado = (colunas[0] || "").trim();
      // FIX: mesma regra de caixa alta já aplicada em TODO o resto do sistema para vendedor e
      // forma de pagamento (campo de dado, não texto livre) — sem isso, o cadastro em lote
      // ficaria inconsistente com o cadastro individual, que já força maiúscula.
      var vendedores = (colunas[1] || "").split(",").map(function(s) { return s.trim().toUpperCase(); }).filter(function(s) { return s.length > 0; });
      var formasPagamento = (colunas[2] || "").split(",").map(function(s) { return s.trim().toUpperCase(); }).filter(function(s) { return s.length > 0; });
      var nomeOficial = mapaNormalizado[normalize(nomeDigitado)] || null;
      var matchAproximado = false;
      if (!nomeOficial) {
        var candidatos = mapaTolerante[chaveTolerante(nomeDigitado)] || [];
        if (candidatos.length === 1) { nomeOficial = candidatos[0]; matchAproximado = true; }
      }
      return { linhaOriginal: linha, nomeDigitado: nomeDigitado, nomeOficial: nomeOficial, matchAproximado: matchAproximado, vendedores: vendedores, formasPagamento: formasPagamento };
    });
    setResultados(processados);
  };

  var reconhecidos = (resultados || []).filter(function(r) { return r.nomeOficial; });
  var naoReconhecidos = (resultados || []).filter(function(r) { return !r.nomeOficial; });

  var handleConfirmar = function() {
    var itens = reconhecidos.map(function(r) { return { nomeFornecedor: r.nomeOficial, vendedores: r.vendedores, formasPagamento: r.formasPagamento }; });
    onConfirmar(itens);
  };

  return /*#__PURE__*/React.createElement(Modal, { open: true, onClose: onClose, maxWidth: 620 },
    /*#__PURE__*/React.createElement("div", { style: { background: "#e65100", color: "#fff", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" } },
      /*#__PURE__*/React.createElement("span", { style: { fontWeight: 700, fontSize: 13 } }, "\ud83d\udccb CADASTRAR VENDEDOR/PAGAMENTO EM LOTE"),
      /*#__PURE__*/React.createElement("button", { onClick: onClose, style: { background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: 16 } }, "\u2715")
    ),
    /*#__PURE__*/React.createElement("div", { style: { padding: 14, maxHeight: "70vh", overflowY: "auto" } },

      !resultados && /*#__PURE__*/React.createElement(React.Fragment, null,
        /*#__PURE__*/React.createElement("div", { style: { fontSize: 10.5, color: "#666", marginBottom: 8 } },
          "Um fornecedor por linha: ", /*#__PURE__*/React.createElement("b", null, "nome do fornecedor"), " ; ", /*#__PURE__*/React.createElement("b", null, "vendedor(es)"), " ; ", /*#__PURE__*/React.createElement("b", null, "forma(s) de pagamento"),
          ". Vários vendedores ou formas na mesma coluna? Separe por vírgula. O fornecedor já precisa estar cadastrado — isto não cria fornecedor novo."
        ),
        /*#__PURE__*/React.createElement("textarea", {
          value: textoColado,
          onChange: function(e) { setTextoColado(e.target.value); },
          placeholder: "REMOLO JARUDE E CIA LTDA; Marcelo Jarude; Pix, Boleto 30 dias\nAGRO BOI; Ana Paula; Depósito\nCOSTA REPRESENTAÇÕES E COMERCIO LTDA.; Roberto Costa; Pix",
          style: { width: "100%", minHeight: 140, border: "2px dashed #ffb74d", borderRadius: 8, padding: 10, fontSize: 11.5, fontFamily: "monospace", color: "#444" }
        }),
        /*#__PURE__*/React.createElement("button", {
          onClick: handleVerificar,
          disabled: !textoColado.trim(),
          style: { background: "#e65100", color: "#fff", border: "none", borderRadius: 6, padding: "9px 16px", fontSize: 11.5, fontWeight: 700, marginTop: 10, cursor: textoColado.trim() ? "pointer" : "default", width: "100%", opacity: textoColado.trim() ? 1 : 0.5 }
        }, "VERIFICAR \u27a4")
      ),

      resultados && /*#__PURE__*/React.createElement(React.Fragment, null,
        /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 12 } },
          /*#__PURE__*/React.createElement("div", { style: { flex: 1, textAlign: "center", padding: "8px 12px", borderRadius: 8, fontSize: 11, fontWeight: 700, background: "#eafaf0", color: "#0e7a3f" } }, "\ud83d\udfe2 " + reconhecidos.length + " reconhecidos"),
          /*#__PURE__*/React.createElement("div", { style: { flex: 1, textAlign: "center", padding: "8px 12px", borderRadius: 8, fontSize: 11, fontWeight: 700, background: "#fff0e0", color: "#b35c00" } }, "\ud83d\udfe0 " + naoReconhecidos.length + " não encontrados")
        ),

        naoReconhecidos.length > 0 && /*#__PURE__*/React.createElement("div", { style: { background: "#fffaf3", border: "1px solid #f0c090", borderRadius: 8, padding: 10, marginBottom: 12 } },
          /*#__PURE__*/React.createElement("div", { style: { fontSize: 10.5, color: "#b35c00", marginBottom: 6, fontWeight: 700 } }, "Estes nomes não bateram com nenhum fornecedor já cadastrado — confira a grafia e cole de novo:"),
          naoReconhecidos.map(function(r, i) {
            return /*#__PURE__*/React.createElement("div", { key: i, style: { fontSize: 10.5, color: "#914d00", padding: "2px 0" } }, "\u2022 \"" + r.nomeDigitado + "\"");
          })
        ),

        reconhecidos.length > 0 && /*#__PURE__*/React.createElement("div", { style: { marginBottom: 12 } },
          reconhecidos.map(function(r, i) {
            return /*#__PURE__*/React.createElement("div", { key: i, style: { border: "1px solid #c8e6c9", background: "#f4fbf5", borderRadius: 8, padding: "8px 10px", marginBottom: 6, fontSize: 11 } },
              /*#__PURE__*/React.createElement("div", { style: { fontWeight: 700, color: "#1b5e20" } }, r.nomeOficial),
              r.matchAproximado && /*#__PURE__*/React.createElement("div", { style: { fontSize: 9.5, color: "#b35c00", fontStyle: "italic" } }, "\u26a0 nome parecido — voc\xea digitou \"" + r.nomeDigitado + "\", confira se \xe9 o fornecedor certo"),
              /*#__PURE__*/React.createElement("div", { style: { color: "#555", fontSize: 10 } }, "\ud83e\uddd1 " + (r.vendedores.join(", ") || "(nenhum)") + "  \u00b7  \ud83d\udcb3 " + (r.formasPagamento.join(", ") || "(nenhuma)"))
            );
          })
        ),

        /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 8 } },
          /*#__PURE__*/React.createElement("button", {
            onClick: function() { setResultados(null); },
            style: { flex: 1, background: "#f5f5f5", border: "none", borderRadius: 6, padding: "9px 12px", color: "#666", cursor: "pointer", fontWeight: 700, fontSize: 11 }
          }, "\u2190 VOLTAR E CORRIGIR"),
          /*#__PURE__*/React.createElement("button", {
            onClick: handleConfirmar,
            disabled: reconhecidos.length === 0,
            style: { flex: 2, background: "#2e7d32", border: "none", borderRadius: 6, padding: "9px 12px", color: "#fff", cursor: reconhecidos.length ? "pointer" : "default", fontWeight: 700, fontSize: 11, opacity: reconhecidos.length ? 1 : 0.5 }
          }, "CADASTRAR " + reconhecidos.length + " FORNECEDOR(ES)")
        )
      )
    )
  );
}
function CadastrosModal(_ref11) {
  var _tabs$find;
  var open = _ref11.open,
    onClose = _ref11.onClose,
    cadastros = _ref11.cadastros,
    onAdd = _ref11.onAdd,
    onRemove = _ref11.onRemove,
    onEdit = _ref11.onEdit,
    onSetObs = _ref11.onSetObs || function(){},
    onSetVendedor = _ref11.onSetVendedor || function(){},
    onSetVendedorEFormasPagamentoEmLote = _ref11.onSetVendedorEFormasPagamentoEmLote || function(){},
    onListarBackups = _ref11.onListarBackups || function(){ return Promise.resolve([]); },
    onRestaurarBackup = _ref11.onRestaurarBackup || function(){ return Promise.resolve({ ok: false, motivo: 'Indisponível.' }); },
    onListarBackupsInsumos = _ref11.onListarBackupsInsumos || function(){ return Promise.resolve([]); },
    onRestaurarBackupInsumos = _ref11.onRestaurarBackupInsumos || function(){ return Promise.resolve({ ok: false, motivo: 'Indisponível.' }); },
    onSetFormasPagamento = _ref11.onSetFormasPagamento || function(){},
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
  // FIX (pedido do Claudio — cadastro em lote de vendedor/pagamento, depois da perda de dados
  // pelo bug da condição de corrida): controla se o modal de "colar lista" está aberto.
  var _useStateLote = useState(false), showLoteVendPag = _slicedToArray(_useStateLote, 2)[0], setShowLoteVendPag = _slicedToArray(_useStateLote, 2)[1];
  // FIX (pedido do Claudio — "não tem uma forma de acompanhar se está funcionando?"): estado do
  // botão "VERIFICAR TUDO", que relê o servidor sob demanda e compara com o que está na tela,
  // sem precisar editar nada primeiro. "verificando" controla o texto do botão enquanto checa;
  // "resultadoVerificacao" guarda o relatório pra mostrar (null = nenhuma verificação feita ainda).
  var _useStateVerif = useState(false), verificando = _slicedToArray(_useStateVerif, 2)[0], setVerificando = _slicedToArray(_useStateVerif, 2)[1];
  var _useStateResVerif = useState(null), resultadoVerificacao = _slicedToArray(_useStateResVerif, 2)[0], setResultadoVerificacao = _slicedToArray(_useStateResVerif, 2)[1];
  // FIX (pedido do Claudio — poder restaurar um backup): estados do painel de backups.
  // "showBackups" controla se o painel está aberto; "listaBackups" guarda os 5 backups (ou
  // menos, se ainda não completou 5) já carregados; "restaurando" trava os botões enquanto uma
  // restauração está em andamento (evita clique duplo); "resultadoRestauracao" guarda a última
  // mensagem de resultado, para mostrar embaixo da lista.
  var _useStateShowBk = useState(false), showBackups = _slicedToArray(_useStateShowBk, 2)[0], setShowBackups = _slicedToArray(_useStateShowBk, 2)[1];
  var _useStateListaBk = useState(null), listaBackups = _slicedToArray(_useStateListaBk, 2)[0], setListaBackups = _slicedToArray(_useStateListaBk, 2)[1];
  var _useStateCarregBk = useState(false), carregandoBackups = _slicedToArray(_useStateCarregBk, 2)[0], setCarregandoBackups = _slicedToArray(_useStateCarregBk, 2)[1];
  var _useStateRestBk = useState(false), restaurando = _slicedToArray(_useStateRestBk, 2)[0], setRestaurando = _slicedToArray(_useStateRestBk, 2)[1];
  var _useStateResRestBk = useState(null), resultadoRestauracao = _slicedToArray(_useStateResRestBk, 2)[0], setResultadoRestauracao = _slicedToArray(_useStateResRestBk, 2)[1];
  // FIX (pedido do Claudio — estender backup para insumos também): o mesmo painel agora serve
  // para os dois tipos — "tipoBackupAtual" guarda qual foi aberto ('cadastros' ou 'insumos'),
  // para saber que funções chamar e como mostrar o resumo de cada cópia.
  var _useStateTipoBk = useState('cadastros'), tipoBackupAtual = _slicedToArray(_useStateTipoBk, 2)[0], setTipoBackupAtual = _slicedToArray(_useStateTipoBk, 2)[1];
  var handleAbrirBackups = function(tipo) {
    setTipoBackupAtual(tipo);
    setShowBackups(true);
    setResultadoRestauracao(null);
    setCarregandoBackups(true);
    var listarFn = tipo === 'insumos' ? onListarBackupsInsumos : onListarBackups;
    listarFn().then(function(lista){
      setListaBackups(lista);
      setCarregandoBackups(false);
    });
  };
  var handleRestaurar = function(idBackup) {
    var mensagem = tipoBackupAtual === 'insumos'
      ? "Isso vai trazer de volta os insumos e sinônimos salvos nesse backup, adicionando os que estiverem faltando na lista atual (sem duplicar os que já existem).\n\nUma cópia do que está na tela AGORA também é guardada antes, então dá para desfazer se precisar.\n\nConfirma a restauração?"
      : "Isso vai trazer de volta o vendedor/forma de pagamento salvos nesse backup, para os fornecedores que ainda existem hoje. O que está preenchido agora para esses fornecedores será substituído.\n\nUma cópia do que está na tela AGORA também é guardada antes, então dá para desfazer se precisar.\n\nConfirma a restauração?";
    var confirmou = window.confirm(mensagem);
    if (!confirmou) return;
    setRestaurando(true);
    setResultadoRestauracao(null);
    var restaurarFn = tipoBackupAtual === 'insumos' ? onRestaurarBackupInsumos : onRestaurarBackup;
    var listarFn = tipoBackupAtual === 'insumos' ? onListarBackupsInsumos : onListarBackups;
    restaurarFn(idBackup).then(function(resultado){
      setRestaurando(false);
      setResultadoRestauracao(resultado);
      if (resultado && resultado.ok) {
        listarFn().then(function(lista){ setListaBackups(lista); });
      }
    });
  };
  // FIX (pedido do Claudio — acompanhar se está funcionando certo): relê o servidor AGORA (sem
  // precisar editar nada primeiro) e compara vendedor/forma de pagamento de CADA fornecedor com
  // o que está na tela. Mostra um relatório claro: quantos conferem, e — se algum não conferir —
  // exatamente quais, para investigar pontualmente em vez de reconferir tudo um por um.
  var handleVerificarTudo = function() {
    setVerificando(true);
    setResultadoVerificacao(null);
    fetch("".concat(SUPABASE_URL, "/rest/v1/cadastros?id=eq.global&select=dados"), { headers: SB, cache: "no-store" })
      .then(function(r){ return r.ok ? r.json() : []; })
      .then(function(rows){
        var gravado = (rows[0] && rows[0].dados) || {};
        var vendGravado = gravado.fornecedorVendedor || {};
        var pagGravado = gravado.fornecedorFormasPagamento || {};
        var vendTela = cadastros.fornecedorVendedor || {};
        var pagTela = cadastros.fornecedorFormasPagamento || {};
        var todosNomes = Array.from(new Set([].concat(Object.keys(vendTela), Object.keys(pagTela), Object.keys(vendGravado), Object.keys(pagGravado))));
        var divergentes = [];
        todosNomes.forEach(function(nome) {
          var vendOk = mesmoConteudoMapaDeListas({ x: vendTela[nome] || [] }, { x: vendGravado[nome] || [] });
          var pagOk = mesmoConteudoMapaDeListas({ x: pagTela[nome] || [] }, { x: pagGravado[nome] || [] });
          if (!vendOk || !pagOk) divergentes.push(nome);
        });
        setResultadoVerificacao({
          horario: new Date().toLocaleTimeString('pt-BR'),
          totalComVendedorOuPagamento: todosNomes.length,
          divergentes: divergentes
        });
        setVerificando(false);
      })
      .catch(function(){
        setResultadoVerificacao({ erro: true, horario: new Date().toLocaleTimeString('pt-BR') });
        setVerificando(false);
      });
  };
  // FIX: estado local para o campo livre de observação por fornecedor (até 5000 caracteres)
  var _useStateObs = useState(null), obsAbertaPara = _slicedToArray(_useStateObs, 2)[0], setObsAbertaPara = _slicedToArray(_useStateObs, 2)[1];
  var _useStateObsTxt = useState(""), obsTextoEditando = _slicedToArray(_useStateObsTxt, 2)[0], setObsTextoEditando = _slicedToArray(_useStateObsTxt, 2)[1];
  // Vendedor cadastrado por fornecedor — MESMO padrão (buffer local) da observação acima.
  // Vendedor cadastrado por fornecedor — AGORA uma LISTA (pedido do Claudio: pode ter vários
  // vendedores por fornecedor, escolhidos no mapa), mesmo padrão (buffer local em tags) das
  // formas de pagamento abaixo. Antes era um texto único; ver normalizeVendedorLista em
  // mapacot-9-app.js para a compatibilidade com dados antigos já salvos como texto único.
  var _useStateVend = useState(null), vendAbertoPara = _slicedToArray(_useStateVend, 2)[0], setVendAbertoPara = _slicedToArray(_useStateVend, 2)[1];
  var _useStateVendLista = useState([]), vendListaEditando = _slicedToArray(_useStateVendLista, 2)[0], setVendListaEditando = _slicedToArray(_useStateVendLista, 2)[1];
  var _useStateVendNovo = useState(""), vendNovoTexto = _slicedToArray(_useStateVendNovo, 2)[0], setVendNovoTexto = _slicedToArray(_useStateVendNovo, 2)[1];
  // Formas de pagamento por fornecedor — MESMO padrão (tags + buffer local) dos sinônimos abaixo.
  var _useStatePag = useState(null), pagAbertoPara = _slicedToArray(_useStatePag, 2)[0], setPagAbertoPara = _slicedToArray(_useStatePag, 2)[1];
  var _useStatePagLista = useState([]), pagListaEditando = _slicedToArray(_useStatePagLista, 2)[0], setPagListaEditando = _slicedToArray(_useStatePagLista, 2)[1];
  var _useStatePagNovo = useState(""), pagNovoTexto = _slicedToArray(_useStatePagNovo, 2)[0], setPagNovoTexto = _slicedToArray(_useStatePagNovo, 2)[1];
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
    var b = normalizeBusca(buscaDelay);
    if (tab === "insumos" && !b) return [];
    return (cadastros[tab] || []).filter(function (x) {
      return normalizeBusca(x).includes(b);
    }).slice(0, 500);
  }, [cadastros, tab, buscaDelay]);
  var handleAdd = function handleAdd() {
    var v = normalize(novo);
    if (!v) return;
    onAdd(tab, v);
    setNovo("");
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null,
  /*#__PURE__*/React.createElement(Modal, {
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
  })),
  // FIX (pedido do Claudio — cadastro em lote de vendedor/pagamento, depois da perda de dados
  // pelo bug da condição de corrida): botão só na aba Fornecedores, abre o modal de "colar lista".
  tab === "fornecedores" && /*#__PURE__*/React.createElement("button", {
    onClick: function(){ setShowLoteVendPag(true); },
    title: "Cadastrar vendedor e forma de pagamento de vários fornecedores de uma vez, colando uma lista",
    style: { background: "#fff3e0", border: "1px solid #ffcc80", borderRadius: 8, padding: "0 12px", fontSize: 11, fontWeight: 700, color: "#e65100", cursor: "pointer", whiteSpace: "nowrap" }
  }, "\ud83d\udccb EM LOTE"),
  // FIX (pedido do Claudio — "não tem uma forma de acompanhar se está funcionando?"): botão que
  // relê o servidor AGORA e compara com a tela, sem precisar editar nada primeiro — dá uma
  // resposta objetiva a qualquer momento, em vez de precisar confiar ou testar manualmente.
  tab === "fornecedores" && /*#__PURE__*/React.createElement("button", {
    onClick: handleVerificarTudo,
    disabled: verificando,
    title: "Reler o servidor agora e conferir se todo vendedor/forma de pagamento cadastrado bate com o que está salvo",
    style: { background: "#e3f2fd", border: "1px solid #90caf9", borderRadius: 8, padding: "0 12px", fontSize: 11, fontWeight: 700, color: "#1565c0", cursor: verificando ? "default" : "pointer", whiteSpace: "nowrap", opacity: verificando ? 0.6 : 1 }
  }, verificando ? "\u23f3 VERIFICANDO..." : "\ud83d\udd0d VERIFICAR TUDO"),
  // FIX (pedido do Claudio — backup automático e poder restaurar, sem precisar de mim): botão
  // que abre a lista das cópias de segurança guardadas automaticamente (a cada salvamento, ao
  // sair da aba, e a cada 10 minutos), com opção de restaurar qualquer uma delas.
  tab === "fornecedores" && /*#__PURE__*/React.createElement("button", {
    onClick: function(){ handleAbrirBackups('cadastros'); },
    title: "Ver as cópias de segurança guardadas automaticamente e restaurar alguma se precisar",
    style: { background: "#f3e8ff", border: "1px solid #c9a6f5", borderRadius: 8, padding: "0 12px", fontSize: 11, fontWeight: 700, color: "#6b21a8", cursor: "pointer", whiteSpace: "nowrap" }
  }, "\ud83d\udd52 BACKUPS"),
  // FIX (pedido do Claudio — estender o backup automático para insumos): mesmo botão, mesmo
  // painel, agora também na aba Insumos — protege a lista de descrições padronizadas e os
  // sinônimos que o "Ler com IA" usa para casar preços automaticamente.
  tab === "insumos" && /*#__PURE__*/React.createElement("button", {
    onClick: function(){ handleAbrirBackups('insumos'); },
    title: "Ver as cópias de segurança dos insumos guardadas automaticamente e restaurar alguma se precisar",
    style: { background: "#f3e8ff", border: "1px solid #c9a6f5", borderRadius: 8, padding: "0 12px", fontSize: 11, fontWeight: 700, color: "#6b21a8", cursor: "pointer", whiteSpace: "nowrap" }
  }, "\ud83d\udd52 BACKUPS")), /*#__PURE__*/React.createElement("div", {
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
  }, /*#__PURE__*/React.createElement(IcoClose, null))),
  // FIX (pedido do Claudio): mostra o relatório da última verificação, só na aba Fornecedores.
  tab === "fornecedores" && resultadoVerificacao && /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "10px 0",
      padding: "10px 12px",
      borderRadius: 8,
      fontSize: 11.5,
      background: resultadoVerificacao.erro ? "#fff3e0" : (resultadoVerificacao.divergentes && resultadoVerificacao.divergentes.length ? "#fff3e0" : "#eafaf0"),
      border: "1px solid " + (resultadoVerificacao.erro ? "#ffcc80" : (resultadoVerificacao.divergentes && resultadoVerificacao.divergentes.length ? "#ffcc80" : "#a5d6a7")),
      color: resultadoVerificacao.erro ? "#b35c00" : (resultadoVerificacao.divergentes && resultadoVerificacao.divergentes.length ? "#b35c00" : "#0e7a3f")
    }
  },
    resultadoVerificacao.erro
      ? "\u26a0 Não foi possível verificar agora (sem conexão?). Tente de novo em instantes. (" + resultadoVerificacao.horario + ")"
      : (resultadoVerificacao.divergentes.length === 0
          ? "\u2714 Verificado às " + resultadoVerificacao.horario + " — " + resultadoVerificacao.totalComVendedorOuPagamento + " fornecedor(es) com vendedor/pagamento, todos conferem com o servidor."
          : "\u26a0 Verificado às " + resultadoVerificacao.horario + " — " + resultadoVerificacao.divergentes.length + " de " + resultadoVerificacao.totalComVendedorOuPagamento + " NÃO conferem: " + resultadoVerificacao.divergentes.join(", "))
  ), /*#__PURE__*/React.createElement("div", {
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
    tab === "fornecedores" && (function() {
      var listaVend = normalizeVendedorLista((cadastros.fornecedorVendedor || {})[normalize(item)]);
      return /*#__PURE__*/React.createElement("button", {
        onClick: function() {
          if (vendAbertoPara === item) { setVendAbertoPara(null); return; }
          setVendAbertoPara(item);
          setVendListaEditando(listaVend.slice());
          setVendNovoTexto("");
        },
        title: listaVend.length ? "TEM " + listaVend.length + " VENDEDOR(ES) — CLIQUE PARA VER/EDITAR" : "CADASTRAR VENDEDOR(ES)",
        style: {
          background: listaVend.length ? "#e6f0ff" : "#f5f5f5",
          border: "none", borderRadius: 5, padding: "4px 7px",
          color: listaVend.length ? "#1a56db" : "#999",
          cursor: "pointer", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 3, whiteSpace: "nowrap"
        }
      }, "\ud83e\uddd1", listaVend.length ? " " + listaVend.length : "");
    })(),
    tab === "fornecedores" && (function() {
      var qtdPag = ((cadastros.fornecedorFormasPagamento || {})[normalize(item)] || []).length;
      return /*#__PURE__*/React.createElement("button", {
        onClick: function() {
          if (pagAbertoPara === item) { setPagAbertoPara(null); return; }
          setPagAbertoPara(item);
          setPagListaEditando(((cadastros.fornecedorFormasPagamento || {})[normalize(item)] || []).slice());
          setPagNovoTexto("");
        },
        title: qtdPag ? "TEM " + qtdPag + " FORMA(S) DE PAGAMENTO — CLIQUE PARA VER/EDITAR" : "CADASTRAR FORMAS DE PAGAMENTO",
        style: {
          background: qtdPag ? "#e6f4ea" : "#f5f5f5",
          border: "none", borderRadius: 5, padding: "4px 7px",
          color: qtdPag ? "#186818" : "#999",
          cursor: "pointer", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 3, whiteSpace: "nowrap"
        }
      }, "\ud83d\udcb3", qtdPag ? " " + qtdPag : "");
    })(),
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
    vendAbertoPara === item && /*#__PURE__*/React.createElement("div", {
      style: { padding: "10px 14px 14px", background: "#f0f6ff", borderBottom: i < lista.length - 1 ? "1px solid #f0f2f6" : undefined, display: "flex", flexDirection: "column", gap: 8 }
    },
      /*#__PURE__*/React.createElement("div", { style: { fontSize: 10.5, color: "#888" } },
        "Vendedores deste fornecedor. Com 1 cadastrado, o \"Contato\" do mapa preenche sozinho; com mais de 1, voc\xea escolhe no mapa — n\xe3o altera mapas j\xe1 existentes."
      ),
      /*#__PURE__*/React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 } },
        vendListaEditando.length === 0
          ? /*#__PURE__*/React.createElement("span", { style: { fontSize: 11, color: "#bbb" } }, "Nenhum vendedor cadastrado ainda.")
          : vendListaEditando.map(function(vd, vi) {
              return /*#__PURE__*/React.createElement("span", {
                key: vi,
                style: { background: "#fff", border: "1px solid #b0c8f0", borderRadius: 20, padding: "5px 8px 5px 12px", fontSize: 11.5, display: "flex", alignItems: "center", gap: 6 }
              },
                vd,
                /*#__PURE__*/React.createElement("button", {
                  onClick: function() { setVendListaEditando(vendListaEditando.filter(function(_, k) { return k !== vi; })); },
                  style: { border: "none", background: "#eee", borderRadius: "50%", width: 16, height: 16, fontSize: 9, cursor: "pointer", lineHeight: 1, color: "#888" }
                }, "\u2715")
              );
            })
      ),
      /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 6 } },
        /*#__PURE__*/React.createElement("input", {
          value: vendNovoTexto,
          // FIX (mesma correção de caixa alta já aplicada em todo o sistema): dado curto
          // (nome de pessoa), não texto livre — segue a regra de caixa alta.
          onChange: function(e) { setVendNovoTexto(e.target.value.toUpperCase()); },
          onKeyDown: function(e) {
            if (e.key === "Enter" && vendNovoTexto.trim()) {
              setVendListaEditando(vendListaEditando.concat([vendNovoTexto.trim()]));
              setVendNovoTexto("");
            }
          },
          placeholder: "EX: FRANCISCO, PAULO...",
          style: { flex: 1, border: "1px solid #ccc", borderRadius: 6, padding: "6px 9px", fontSize: 12, fontFamily: "inherit", textTransform: "uppercase", outline: "none" }
        }),
        /*#__PURE__*/React.createElement("button", {
          onClick: function() {
            if (!vendNovoTexto.trim()) return;
            setVendListaEditando(vendListaEditando.concat([vendNovoTexto.trim()]));
            setVendNovoTexto("");
          },
          style: { background: "#3b82f6", border: "none", borderRadius: 6, padding: "6px 12px", color: "#fff", fontWeight: 700, fontSize: 11, cursor: "pointer", whiteSpace: "nowrap" }
        }, "+ ADICIONAR")
      ),
      /*#__PURE__*/React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", gap: 6 } },
        /*#__PURE__*/React.createElement("button", {
          onClick: function(){ setVendAbertoPara(null); },
          style: { background: "#f5f5f5", border: "none", borderRadius: 5, padding: "5px 12px", color: "#888", cursor: "pointer", fontWeight: 700, fontSize: 11 }
        }, "CANCELAR"),
        /*#__PURE__*/React.createElement("button", {
          onClick: function(){ onSetVendedor(item, vendListaEditando); setVendAbertoPara(null); },
          style: { background: "#e8f5e9", border: "none", borderRadius: 5, padding: "5px 12px", color: "#2e7d32", cursor: "pointer", fontWeight: 700, fontSize: 11 }
        }, "SALVAR VENDEDOR(ES)")
      )
    ),
    pagAbertoPara === item && /*#__PURE__*/React.createElement("div", {
      style: { padding: "10px 14px 14px", background: "#f0faf3", borderBottom: i < lista.length - 1 ? "1px solid #f0f2f6" : undefined, display: "flex", flexDirection: "column", gap: 8 }
    },
      /*#__PURE__*/React.createElement("div", { style: { fontSize: 10.5, color: "#888" } },
        "Formas de pagamento que este fornecedor aceita. Aparecem para escolher no rodap\xe9 do mapa de cota\xe7\xe3o."
      ),
      /*#__PURE__*/React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 } },
        pagListaEditando.length === 0
          ? /*#__PURE__*/React.createElement("span", { style: { fontSize: 11, color: "#bbb" } }, "Nenhuma forma de pagamento cadastrada ainda.")
          : pagListaEditando.map(function(pg, pi) {
              return /*#__PURE__*/React.createElement("span", {
                key: pi,
                style: { background: "#fff", border: "1px solid #d0e0d0", borderRadius: 20, padding: "5px 8px 5px 12px", fontSize: 11.5, display: "flex", alignItems: "center", gap: 6 }
              },
                pg,
                /*#__PURE__*/React.createElement("button", {
                  onClick: function() { setPagListaEditando(pagListaEditando.filter(function(_, k) { return k !== pi; })); },
                  style: { border: "none", background: "#eee", borderRadius: "50%", width: 16, height: 16, fontSize: 9, cursor: "pointer", lineHeight: 1, color: "#888" }
                }, "\u2715")
              );
            })
      ),
      /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 6 } },
        /*#__PURE__*/React.createElement("input", {
          value: pagNovoTexto,
          // FIX (mesma correção do campo Vendedor — consistência com o resto do sistema):
          // formas de pagamento são um DADO curto (Pix, Boleto, 30 dias...), não texto livre —
          // seguem a mesma regra de caixa alta já aplicada em todo o sistema.
          onChange: function(e) { setPagNovoTexto(e.target.value.toUpperCase()); },
          onKeyDown: function(e) {
            if (e.key === "Enter" && pagNovoTexto.trim()) {
              setPagListaEditando(pagListaEditando.concat([pagNovoTexto.trim()]));
              setPagNovoTexto("");
            }
          },
          placeholder: "EX: PIX, BOLETO, CHEQUE PR\xc9...",
          style: { flex: 1, border: "1px solid #ccc", borderRadius: 6, padding: "6px 9px", fontSize: 12, fontFamily: "inherit", textTransform: "uppercase", outline: "none" }
        }),
        /*#__PURE__*/React.createElement("button", {
          onClick: function() {
            if (!pagNovoTexto.trim()) return;
            setPagListaEditando(pagListaEditando.concat([pagNovoTexto.trim()]));
            setPagNovoTexto("");
          },
          style: { background: "#f5a623", border: "none", borderRadius: 6, padding: "6px 12px", color: "#fff", fontWeight: 700, fontSize: 11, cursor: "pointer", whiteSpace: "nowrap" }
        }, "+ ADICIONAR")
      ),
      /*#__PURE__*/React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", gap: 6 } },
        /*#__PURE__*/React.createElement("button", {
          onClick: function(){ setPagAbertoPara(null); },
          style: { background: "#f5f5f5", border: "none", borderRadius: 5, padding: "5px 12px", color: "#888", cursor: "pointer", fontWeight: 700, fontSize: 11 }
        }, "CANCELAR"),
        /*#__PURE__*/React.createElement("button", {
          onClick: function(){ onSetFormasPagamento(item, pagListaEditando); setPagAbertoPara(null); },
          style: { background: "#e8f5e9", border: "none", borderRadius: 5, padding: "5px 12px", color: "#2e7d32", cursor: "pointer", fontWeight: 700, fontSize: 11 }
        }, "SALVAR FORMAS DE PAGAMENTO")
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
  }, (cadastros[tab] || []).length, " CADASTRO(S) NO TOTAL"))),
  showLoteVendPag && /*#__PURE__*/React.createElement(ModalLoteVendedorPagamento, {
    fornecedoresExistentes: cadastros.fornecedores || [],
    onClose: function(){ setShowLoteVendPag(false); },
    onConfirmar: function(itens){ onSetVendedorEFormasPagamentoEmLote(itens); setShowLoteVendPag(false); }
  }),
  // FIX (pedido do Claudio — poder restaurar um backup, sem precisar de mim): painel simples
  // com a lista das cópias guardadas automaticamente, cada uma com um botão de restaurar.
  showBackups && /*#__PURE__*/React.createElement("div", {
    style: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.45)", zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 },
    onClick: function(e){ if (e.target === e.currentTarget) setShowBackups(false); }
  }, /*#__PURE__*/React.createElement("div", {
    style: { background: "#fff", borderRadius: 12, maxWidth: 560, width: "100%", maxHeight: "80vh", overflowY: "auto", boxShadow: "0 12px 40px rgba(0,0,0,0.3)" }
  },
    /*#__PURE__*/React.createElement("div", {
      style: { background: "#6b21a8", color: "#fff", padding: "14px 18px", borderRadius: "12px 12px 0 0", display: "flex", justifyContent: "space-between", alignItems: "center" }
    },
      /*#__PURE__*/React.createElement("span", { style: { fontWeight: 700, fontSize: 14 } }, "\ud83d\udd52 C\u00d3PIAS DE SEGURAN\u00c7A" + (tipoBackupAtual === 'insumos' ? " \u2014 INSUMOS" : " \u2014 FORNECEDORES")),
      /*#__PURE__*/React.createElement("span", { onClick: function(){ setShowBackups(false); }, style: { cursor: "pointer", fontSize: 18 } }, "\u2715")
    ),
    /*#__PURE__*/React.createElement("div", { style: { padding: 18 } },
      /*#__PURE__*/React.createElement("div", { style: { fontSize: 11.5, color: "#666", marginBottom: 14 } },
        "Guardadas automaticamente a cada salvamento, ao sair da aba, e a cada 10 minutos. Sempre as 5 mais recentes."
      ),
      carregandoBackups && /*#__PURE__*/React.createElement("div", { style: { textAlign: "center", padding: 20, color: "#999", fontSize: 12 } }, "Carregando..."),
      !carregandoBackups && listaBackups && listaBackups.length === 0 && /*#__PURE__*/React.createElement("div", { style: { textAlign: "center", padding: 20, color: "#999", fontSize: 12 } }, "Nenhuma c\u00f3pia ainda \u2014 ser\u00e1 criada automaticamente conforme voc\u00ea usa o sistema."),
      !carregandoBackups && listaBackups && listaBackups.map(function(bk){
        var dataFormatada = new Date(bk.atualizado_em).toLocaleString('pt-BR');
        var resumo = tipoBackupAtual === 'insumos'
          ? ("\ud83d\udce6 " + bk.qtdInsumos + " insumo(s) \u00b7 \ud83d\udd17 " + bk.qtdSinonimos + " com sin\u00f4nimo(s)")
          : ("\ud83e\uddd1 " + bk.qtdVendedor + " com vendedor \u00b7 \ud83d\udcb3 " + bk.qtdPagamento + " com pagamento");
        return /*#__PURE__*/React.createElement("div", {
          key: bk.id,
          style: { border: "1px solid #e4d5f7", borderRadius: 8, padding: "10px 12px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }
        },
          /*#__PURE__*/React.createElement("div", { style: { fontSize: 12 } },
            /*#__PURE__*/React.createElement("div", { style: { fontWeight: 700, color: "#333" } }, dataFormatada),
            /*#__PURE__*/React.createElement("div", { style: { color: "#777", marginTop: 2 } }, resumo)
          ),
          /*#__PURE__*/React.createElement("button", {
            onClick: function(){ handleRestaurar(bk.id); },
            disabled: restaurando,
            style: { background: "#6b21a8", color: "#fff", border: "none", borderRadius: 6, padding: "7px 12px", fontSize: 11, fontWeight: 700, cursor: restaurando ? "default" : "pointer", opacity: restaurando ? 0.6 : 1, whiteSpace: "nowrap" }
          }, restaurando ? "\u23f3..." : "RESTAURAR")
        );
      }),
      resultadoRestauracao && /*#__PURE__*/React.createElement("div", {
        style: { marginTop: 12, padding: "10px 12px", borderRadius: 8, fontSize: 11.5,
          background: resultadoRestauracao.ok ? "#eafaf0" : "#fff3e0",
          border: "1px solid " + (resultadoRestauracao.ok ? "#a5d6a7" : "#ffcc80"),
          color: resultadoRestauracao.ok ? "#0e7a3f" : "#b35c00" }
      }, resultadoRestauracao.ok
          ? (tipoBackupAtual === 'insumos'
              ? ("\u2714 Restaurado: " + resultadoRestauracao.adicionados + " insumo(s) trazido(s) de volta, " + resultadoRestauracao.sinonimosRestaurados + " com sin\u00f4nimo(s) restaurado(s).")
              : ("\u2714 Restaurado: " + resultadoRestauracao.restaurados + " fornecedor(es) trazido(s) de volta" + (resultadoRestauracao.ignorados ? " (" + resultadoRestauracao.ignorados + " ignorado(s), n\u00e3o existem mais na lista atual)" : "") + "."))
          : ("\u26a0 " + (resultadoRestauracao.motivo || "N\u00e3o foi poss\u00edvel restaurar."))
      )
    )
  ))
  );
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
    var _qS=parseNumBR(_a.qtCompra)||0;
    var _qM=parseNumBR(_it.qt)||0;
    var _qA=(_qS>0&&_qS<_qM)?_qS:(_qM||_qS);
    total+=_qA*(parseFloat(_a.fator)||1);
  }
  return total;
};
