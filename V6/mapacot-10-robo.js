// ============================================================================
// MAPACOT — ROBÔ DE PREENCHIMENTO DO MAPA (v=13)
// ----------------------------------------------------------------------------
// ARQUIVO NOVO. Não altera nenhuma função dos outros arquivos: só LÊ as que já existem
// (normalizeBusca etc.) e entrega ao mapa pelo mesmo caminho de sempre (addVariosItens).
//
// PARTE A — MOTOR (sem tela): lê as linhas em qualquer ordem, confere cada insumo e cada
//           unidade com o cadastro, decide o que está CERTO e o que precisa do Claudio.
// PARTE B — TELA (React): ModalRoboPreenchimento  (substitui o antigo "Adicionar vários").
//
// REGRAS (decididas com o Claudio — não mudar sem avisar):
//  1. Insumo: só entra o que existe no cadastro. Nunca inventa, nunca troca sozinho.
//  2. CERTO somente se a descrição for IGUAL à do cadastro (sem contar acento, plural e
//     maiúscula) ou já ensinada. O resto é sugestão: ele confirma (1 clique) ou escolhe.
//  3. Número/medida/tamanho diferente (ex.: nº 28 pedido, só existe nº 27): nunca aceito
//     sozinho e nunca aprendido.
//  4. Unidade: só vale unidade cadastrada (ou já ensinada). Texto desconhecido nunca é
//     aceito como veio escrito; o sistema só SUGERE e ele escolhe.
//  5. Nunca converte caixa em kg etc. Sem quantidade: nunca presume 1.
//  6. Linha riscada fica de fora (a menos que ele inclua). Nada entra no mapa antes do Aplicar.
// ============================================================================
var MapacotRobo = (function () {
  'use strict';

  // ──────────────────────────────────────────────────────────────────────────
  // 1. UTILIDADES DE TEXTO
  // ──────────────────────────────────────────────────────────────────────────
  var INVISIVEIS = /[⁠​-‍﻿­‪-‮⁦-⁩]/g;
  function limpar(s) {
    return String(s == null ? '' : s).replace(INVISIVEIS, '').replace(/[   ]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function semAcento(s) { return String(s).normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function maiusc(s) { return semAcento(String(s)).toUpperCase(); }
  function extend(a, b) { var o = {}, k; for (k in a) { if (Object.prototype.hasOwnProperty.call(a, k)) o[k] = a[k]; } for (k in b) { if (Object.prototype.hasOwnProperty.call(b, k)) o[k] = b[k]; } return o; }
  function unicos(arr) { var seen = {}, out = []; arr.forEach(function (x) { if (!seen[x]) { seen[x] = 1; out.push(x); } }); return out; }

  // ──────────────────────────────────────────────────────────────────────────
  // 2. PALAVRAS E "RAIZES" (plural → singular, igual dos dois lados da comparação)
  // ──────────────────────────────────────────────────────────────────────────
  var CURTAS_PLURAL = { PAS: 'PA', PES: 'PE', TES: 'TE' };
  function raiz(w) {
    var n = w.length;
    if (CURTAS_PLURAL[w]) return CURTAS_PLURAL[w];
    if (n <= 3) return w;
    if (/(OES|AES)$/.test(w)) return w.slice(0, -3) + 'AO';
    if (n > 4 && /AIS$/.test(w)) return w.slice(0, -2) + 'L';
    if (n > 4 && /EIS$/.test(w)) return w.slice(0, -2) + 'L';
    if (n > 4 && /OIS$/.test(w)) return w.slice(0, -2) + 'L';
    if (/[RZ]ES$/.test(w)) return w.slice(0, -2);
    if (/(SS|US|IS)$/.test(w)) return w;
    if (/S$/.test(w)) return w.slice(0, -1);
    return w;
  }
  var STOP = {};
  ['DE', 'DA', 'DO', 'DAS', 'DOS', 'D', 'PARA', 'PRA', 'PRO', 'P', 'COM', 'C', 'E', 'O', 'A', 'OS', 'AS', 'EM', 'NO', 'NA', 'NOS', 'NAS',
    'UM', 'UMA', 'UNS', 'UMAS', 'AO', 'AOS', 'PELO', 'PELA', 'POR', 'TAM', 'TAMANHO', 'N', 'NR', 'NUM', 'NUMERO']
    .forEach(function (w) { STOP[w] = 1; });
  var TAMANHOS = { P: 1, M: 1, G: 1, PP: 1, GG: 1, XG: 1, XGG: 1, XXG: 1 };

  // Quebra um texto em "peças" comparáveis.
  //  sig  = palavras que carregam sentido (sem "de/da/com…", sem letras soltas)
  //  nums = números/medidas/tamanhos (30CM, 17, 3,25, 220V, tamanho M ...)
  //  seq  = sequência completa (usada para dizer que dois textos são IGUAIS)
  function tokensDe(s) {
    var t = maiusc(s);
    t = t.replace(/[º°ª˚]/g, ' ');
    t = t.replace(/(\d)\s*[X×]\s*(?=\d)/g, '$1 X ');
    t = t.replace(/(\d)[.,](?=\d)/g, '$1\u0001');
    t = t.replace(/[^A-Z0-9\u0001\s]/g, ' ');
    t = t.replace(/\u0001/g, ',');
    t = t.replace(/\b(N|NO|NR|NUM|TAM)(?=\d)/g, '$1 ');
    t = t.replace(/(\d)\s*(POLEGADAS?|POL|IN)\b/g, '$1POL');
    t = t.replace(/(\d)\s+(MM|CM|M2|M3|KGS?|ML|MTS?|LTS?|L|GR|G|W|V|A|KW|HP|M)\b/g, '$1$2');
    var partes = t.split(/\s+/).filter(Boolean);
    var sig = [], nums = [], all = [];
    for (var i = 0; i < partes.length; i++) {
      var p = partes[i];
      if (/^\d/.test(p)) { nums.push(p); all.push(p); continue; }
      if (p === 'X') { all.push('X'); continue; }
      var w = raiz(p);
      all.push(w);
      if (TAMANHOS[p]) { nums.push('T:' + p); continue; }
      if (STOP[p] || STOP[w]) continue;
      if (w.length < 2) continue;
      sig.push(w);
    }
    return { sig: sig, nums: nums, seq: all.join(' ') };
  }

  function numIgual(a, b) {
    if (a === b) return true;
    if (a.charAt(0) === 'T' || b.charAt(0) === 'T') return false;
    var ma = /^([\d,]+)(.*)$/.exec(a), mb = /^([\d,]+)(.*)$/.exec(b);
    if (!ma || !mb) return false;
    var da = ma[1].replace(/^0+(?=\d)/, ''), db = mb[1].replace(/^0+(?=\d)/, '');
    if (da !== db) return false;
    return ma[2] === '' || mb[2] === '' || ma[2] === mb[2];
  }

  function lev(a, b, max) {
    var la = a.length, lb = b.length;
    if (Math.abs(la - lb) > max) return max + 1;
    var prev = [], cur = [], i, j;
    for (j = 0; j <= lb; j++) prev[j] = j;
    for (i = 1; i <= la; i++) {
      cur[0] = i; var menor = cur[0];
      for (j = 1; j <= lb; j++) {
        var c = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1;
        var v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + c);
        cur[j] = v; if (v < menor) menor = v;
      }
      if (menor > max) return max + 1;
      var tmp = prev; prev = cur; cur = tmp;
    }
    return prev[lb];
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 3. ÍNDICE DO CADASTRO DE INSUMOS (montado uma vez; ~19 mil nomes)
  // ──────────────────────────────────────────────────────────────────────────
  var _cacheIdx = { ref: null, n: -1, idx: null };
  function indiceDe(catalogo) {
    catalogo = catalogo || [];
    if (_cacheIdx.ref === catalogo && _cacheIdx.n === catalogo.length && _cacheIdx.idx) return _cacheIdx.idx;
    var idx = { nomes: catalogo, itens: [], post: {}, iguais: {}, setNomes: {}, viz: {}, tamanhos: {}, vocab: null };
    for (var i = 0; i < catalogo.length; i++) {
      var nome = catalogo[i];
      idx.setNomes[nome] = 1;
      var tk = tokensDe(nome);
      tk.sigU = unicos(tk.sig);
      idx.itens.push(tk);
      if (tk.seq) { (idx.iguais[tk.seq] = idx.iguais[tk.seq] || []).push(i); }
      for (var k = 0; k < tk.sigU.length; k++) {
        var tok = tk.sigU[k];
        (idx.post[tok] = idx.post[tok] || []).push(i);
      }
    }
    idx.vocab = Object.keys(idx.post);
    _cacheIdx = { ref: catalogo, n: catalogo.length, idx: idx };
    return idx;
  }

  // Palavras do cadastro "parecidas" com uma palavra do pedido (só para SUGERIR).
  function vizinhos(idx, token) {
    if (idx.viz[token]) return idx.viz[token];
    var exato = idx.post[token] ? [[token, 1]] : [];
    var vocab = idx.vocab, lt = token.length;
    var cand = [];
    if (lt >= 3) {
      for (var i = 0; i < vocab.length; i++) {
        var v = vocab[i], lv = v.length;
        if (v === token || Math.abs(lv - lt) > 3 || lv < 3) continue;
        var cp = 0, mx = Math.min(lt, lv);
        while (cp < mx && token.charCodeAt(cp) === v.charCodeAt(cp)) cp++;
        var sim = 0;
        if (cp >= 3 && cp / mx >= 0.75 && lt >= 4 && lv >= 4) sim = 0.45 + 0.4 * (cp / Math.max(lt, lv));
        if (lt >= 4 && lv >= 4) {
          var mxl = Math.max(lt, lv);
          var perm = mxl <= 5 ? 1 : (mxl <= 10 ? 2 : 3);
          var d = lev(token, v, perm);
          if (d <= perm) { var s2 = 1 - d / Math.max(lt, lv); if (s2 >= 0.7 && s2 > sim) sim = s2; }
        }
        if (sim >= 0.6) cand.push([v, sim]);
      }
    }
    cand.sort(function (a, b) { return b[1] - a[1]; });
    if (cand.length) { var topo = cand[0][1]; cand = cand.filter(function (c) { return c[1] >= topo - 0.15; }).slice(0, 4); }
    var res = exato.concat(cand);
    idx.viz[token] = res;
    return res;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 4. CONFERIR UM INSUMO COM O CADASTRO
  // ──────────────────────────────────────────────────────────────────────────
  // Resultado.status:
  //   'certo'            igual ao cadastro (via 'igual') ou já ensinado (via 'ensinado')
  //   'provavel'         um candidato claramente melhor (forte=true se quase tudo conferiu)
  //   'varios'           vários candidatos parecidos — ele escolhe
  //   'numero_diferente' as palavras conferem mas o número/medida/tamanho não
  //   'nao'              nada parecido
  function montarAprendIdx(aprendizados, idx) {
    var out = {};
    Object.keys(aprendizados || {}).forEach(function (k) {
      var oficial = aprendizados[k];
      if (!idx.setNomes[oficial]) return;
      var seq = tokensDe(k).seq; if (seq) out[seq] = oficial;
    });
    return out;
  }

  function casarInsumo(desc, ctx) {
    var idx = ctx.idx;
    var q = tokensDe(desc);
    var out = { status: 'nao', oficial: null, via: null, forte: false, candidatos: [], possiveis: [], aviso: '', faltam: [], q: q, score: 0 };
    if (!q.seq || (!q.sig.length)) return out;
    var ap = ctx.aprendIdx[q.seq];
    if (ap) { out.status = 'certo'; out.via = 'ensinado'; out.oficial = ap; out.score = 1; return out; }
    var ig = idx.iguais[q.seq];
    if (ig) {
      if (ig.length === 1) { out.status = 'certo'; out.via = 'igual'; out.oficial = idx.nomes[ig[0]]; out.score = 1; return out; }
      out.status = 'varios'; out.score = 1;
      out.candidatos = ig.slice(0, 8).map(function (i) { return { nome: idx.nomes[i], score: 1 }; });
      return out;
    }
    var Qs = unicos(q.sig), nQ = q.nums;
    var pesos = Qs.map(function (t, i) { return i === 0 ? 2 : 1; });
    var wtot = pesos.reduce(function (a, b) { return a + b; }, 0) + 1.5 * nQ.length;
    var acc = {};
    Qs.forEach(function (tok, qi) {
      var vz = vizinhos(idx, tok);
      vz.forEach(function (par) {
        var v = par[0], sim = par[1], lista = idx.post[v];
        for (var k = 0; k < lista.length; k++) {
          var id = lista[k];
          var a = acc[id];
          if (!a) { a = acc[id] = { sq: [], vs: {}, nv: 0 }; }
          if (!a.sq[qi] || a.sq[qi] < sim) a.sq[qi] = sim;
          if (!a.vs[v]) { a.vs[v] = 1; a.nv++; }
        }
      });
    });
    var lista = [];
    Object.keys(acc).forEach(function (id) {
      var a = acc[id], it = idx.itens[id], wsum = 0, i;
      for (i = 0; i < Qs.length; i++) wsum += pesos[i] * (a.sq[i] || 0);
      var casados = 0, faltantes = [], extras = [];
      nQ.forEach(function (n) { var ok = it.nums.some(function (m) { return numIgual(n, m); }); if (ok) casados++; else faltantes.push(n); });
      it.nums.forEach(function (m) { var ok = nQ.some(function (n) { return numIgual(n, m); }); if (!ok) extras.push(m); });
      var qcov = (wsum + 1.5 * casados) / wtot;
      var ccov = it.sigU.length ? Math.min(1, a.nv / it.sigU.length) : 0.5;
      var numScore = nQ.length ? casados / nQ.length : (it.nums.length ? 0.7 : 1);
      var cabecaOk = (a.sq[0] || 0) >= 0.6;
      var score = 0.55 * qcov + 0.30 * ccov + 0.15 * numScore;
      if (!cabecaOk) score *= 0.45;
      var conflito = faltantes.length > 0 && extras.length > 0;
      if (conflito) score *= 0.85;
      lista.push({ i: +id, nome: idx.nomes[id], score: score, qcov: qcov, ccov: ccov, conflito: conflito, faltantes: faltantes, extras: extras, cabecaOk: cabecaOk, semNumeros: nQ.length > 0 && it.nums.length === 0, sq: a.sq });
    });
    // Se existe no cadastro a palavra-cabeça escrita igualzinha, os candidatos que só chegam lá por
    // erro de digitação (ex.: "talha" x TELHA) perdem força: a palavra certa não vira empate com a parecida.
    var haCabecaExata = lista.some(function (c) { return c.cabecaOk && !c.conflito && (c.sq[0] || 0) >= 1; });
    if (haCabecaExata) lista.forEach(function (c) { if ((c.sq[0] || 0) < 1) c.score *= 0.8; });
    lista.sort(function (a, b) { return b.score - a.score || a.nome.length - b.nome.length; });
    var top = lista.slice(0, 12);
    out.possiveis = top.filter(function (c) { return c.score >= 0.25; }).slice(0, 6).map(function (c) { return { nome: c.nome, score: c.score }; });
    var best = top[0];
    if (!best || best.score < 0.38 || best.qcov < 0.40) return out;
    out.score = best.score;
    var naoAchadas = Qs.filter(function (t, i) { return !(best.sq[i] > 0); });
    out.faltam = naoAchadas;
    if (best.conflito && best.qcov < 0.6) { out.score = 0; out.faltam = []; return out; }
    if (best.conflito) {
      out.status = 'numero_diferente';
      out.oficial = best.nome; out.pedido = best.faltantes; out.cadastro = best.extras;
      out.candidatos = top.filter(function (c) { return c.score >= best.score - 0.1; }).slice(0, 6).map(function (c) { return { nome: c.nome, score: c.score }; });
      return out;
    }
    var S = top.filter(function (c) { return !c.conflito && c.score >= best.score - 0.10; });
    if (S.length > 1) {
      out.status = 'varios';
      out.candidatos = S.slice(0, 8).map(function (c) { return { nome: c.nome, score: c.score }; });
      return out;
    }
    out.status = 'provavel'; out.oficial = best.nome;
    out.candidatos = [{ nome: best.nome, score: best.score }];
    out.forte = best.qcov >= 0.8 && best.faltantes.length === 0 && best.cabecaOk && !best.semNumeros;
    if (best.semNumeros) out.aviso = 'O número do pedido (' + nQ.join(', ') + ') não aparece no nome do cadastro.';
    return out;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 5. UNIDADES
  // ──────────────────────────────────────────────────────────────────────────
  function chaveUnid(s) { return maiusc(limpar(s)).replace(/[.\s]/g, '').replace(/²/g, '2').replace(/³/g, '3'); }
  // SÓ SUGESTÃO (nunca aceita sozinho): palavra escrita → possíveis siglas cadastradas.
  var ALIAS_UNID = {
    UNID: ['UN'], UNIDS: ['UN'], UNIDADE: ['UN'], UNIDADES: ['UN'], UND: ['UN'], UNS: ['UN'], UNI: ['UN'], U: ['UN'],
    PC: ['PC', 'PÇ', 'UN'], PCS: ['PC', 'PÇ', 'UN'], PECA: ['PC', 'PÇ', 'UN'], PECAS: ['PC', 'PÇ', 'UN'],
    PARES: ['PAR'], PAR: ['PAR'],
    CAIXA: ['CX'], CAIXAS: ['CX'], CXA: ['CX'], CXS: ['CX'], CX: ['CX'],
    LITRO: ['L', 'LT', 'LTS'], LITROS: ['L', 'LT', 'LTS'], L: ['L', 'LT', 'LTS'], LT: ['L', 'LTS'], LTS: ['L', 'LT'],
    METRO: ['M', 'MT'], METROS: ['M', 'MT'], MT: ['M'], MTS: ['M', 'MT'], M: ['M', 'MT'],
    QUILO: ['KG'], QUILOS: ['KG'], KGS: ['KG'], QUILOGRAMA: ['KG'], QUILOGRAMAS: ['KG'],
    GRAMA: ['G', 'GR'], GRAMAS: ['G', 'GR'], GR: ['G'], G: ['G', 'GR'],
    SACO: ['SC', 'SACO'], SACOS: ['SC', 'SACO'], SC: ['SC', 'SACO'],
    PACOTE: ['PCT', 'PACOTE'], PACOTES: ['PCT', 'PACOTE'], PCT: ['PCT', 'PACOTE'],
    ROLO: ['ROLO', 'RL'], ROLOS: ['ROLO', 'RL'], RL: ['ROLO', 'RL'],
    BALDE: ['BD'], BALDES: ['BD'], BD: ['BD'],
    LATA: ['LATA', 'LT'], LATAS: ['LATA', 'LT'],
    FARDO: ['FARDO', 'FD'], FARDOS: ['FARDO', 'FD'], FD: ['FARDO', 'FD'],
    KIT: ['KIT', 'CJ'], KITS: ['KIT', 'CJ'],
    CONJUNTO: ['CJ'], CONJUNTOS: ['CJ'], CONJ: ['CJ'], CJ: ['CJ'],
    DUZIA: ['DZ'], DUZIAS: ['DZ'], DZ: ['DZ'],
    GALAO: ['GL', 'GALAO'], GALOES: ['GL', 'GALAO'], GL: ['GL', 'GALAO'],
    FOLHA: ['FL', 'FOLHA'], FOLHAS: ['FL', 'FOLHA'], FL: ['FL', 'FOLHA'],
    BARRA: ['BR', 'BARRA'], BARRAS: ['BR', 'BARRA'], BR: ['BR', 'BARRA'],
    TUBO: ['TB', 'TUBO'], TUBOS: ['TB', 'TUBO'], TB: ['TB', 'TUBO'],
    TONELADA: ['T', 'TON'], TONELADAS: ['T', 'TON'], TON: ['T', 'TON'],
    JOGO: ['JG', 'JOGO'], JOGOS: ['JG', 'JOGO'], JG: ['JG', 'JOGO'],
    TAMBOR: ['TAMBOR', 'TB'], TAMBORES: ['TAMBOR', 'TB'],
    M2: ['M2'], M3: ['M3']
  };
  function montarUnidIdx(unidades, aprendUnid) {
    var reg = {}, nomes = [];
    (unidades || []).forEach(function (u) { var k = chaveUnid(u); if (k && !reg[k]) { reg[k] = u; nomes.push(u); } });
    var ens = {};
    Object.keys(aprendUnid || {}).forEach(function (k) { var of = aprendUnid[k]; var kk = chaveUnid(k); if (kk && chaveUnid(of) && reg[chaveUnid(of)]) ens[kk] = reg[chaveUnid(of)]; });
    return { reg: reg, nomes: nomes, ens: ens };
  }
  function casarUnidade(txt, ctx) {
    var t = limpar(txt);
    if (!t) return { status: 'falta', oficial: null, texto: '' };
    var k = chaveUnid(t), U = ctx.unidIdx;
    if (U.reg[k]) return { status: 'ok', oficial: U.reg[k], via: 'cadastro', texto: t };
    if (U.ens[k]) return { status: 'ok', oficial: U.ens[k], via: 'ensinado', texto: t };
    var sug = [];
    (ALIAS_UNID[k] || []).forEach(function (a) { var kk = chaveUnid(a); if (U.reg[kk] && sug.indexOf(U.reg[kk]) < 0) sug.push(U.reg[kk]); });
    if (sug.length) return { status: 'sugerida', oficial: null, sugestoes: sug, texto: t };
    return { status: 'desconhecida', oficial: null, texto: t };
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 6. LEITURA DA LINHA (qualquer ordem: quantidade / unidade / descrição)
  // ──────────────────────────────────────────────────────────────────────────
  // Palavras que o sistema RECONHECE como "isto parece uma unidade" só para saber ONDE a
  // unidade está na linha. Aceitar de verdade é outra coisa (casarUnidade, só cadastradas).
  // valor 1 = também pode ser nome de insumo (balde, caixa, rolo...) → testa as duas leituras.
  var UNID_PALAVRAS = {
    UN: 0, UND: 0, UNID: 0, UNIDS: 0, UNIDADE: 0, UNIDADES: 0, UNS: 0, UNI: 0, PC: 0, PCS: 0, PECA: 1, PECAS: 1,
    PAR: 0, PARES: 0, KG: 0, KGS: 0, QUILO: 0, QUILOS: 0, G: 0, GR: 0, GRAMA: 0, GRAMAS: 0, TON: 0, TONELADA: 0, TONELADAS: 0,
    L: 0, LT: 0, LTS: 0, LITRO: 0, LITROS: 0, ML: 0, M: 0, MT: 0, MTS: 0, METRO: 0, METROS: 0, M2: 0, M3: 0,
    CX: 1, CAIXA: 1, CAIXAS: 1, ROLO: 1, ROLOS: 1, RL: 0, PCT: 0, PACOTE: 1, PACOTES: 1, FARDO: 1, FARDOS: 1,
    SC: 0, SACO: 1, SACOS: 1, BD: 0, BALDE: 1, BALDES: 1, LATA: 1, LATAS: 1, GL: 0, GALAO: 1, GALOES: 1,
    FL: 0, FOLHA: 1, FOLHAS: 1, BR: 0, BARRA: 1, BARRAS: 1, TB: 0, TUBO: 1, TUBOS: 1, KIT: 1, KITS: 1,
    CJ: 0, CONJ: 0, CONJUNTO: 1, CONJUNTOS: 1, JG: 0, JOGO: 1, JOGOS: 1, DZ: 0, DUZIA: 0, DUZIAS: 0,
    TAMBOR: 1, TAMBORES: 1, BOBINA: 1, BOBINAS: 1, CARRETEL: 1, CARTELA: 1, CARTELAS: 1, VB: 0,
    MIL: 0, MILHEIRO: 0, MILHEIROS: 0, MLH: 0, GLB: 0, CENTO: 0, H: 0, HR: 0, HORA: 0, HORAS: 0, DIA: 0, DIAS: 0, MES: 0, MESES: 0
  };
  var PALAVRAS_NUMERO = { UM: 1, UMA: 1, DOIS: 2, DUAS: 2, TRES: 3, QUATRO: 4, CINCO: 5, SEIS: 6, SETE: 7, OITO: 8, NOVE: 9, DEZ: 10, ONZE: 11, DOZE: 12, TREZE: 13, QUATORZE: 14, QUINZE: 15, VINTE: 20 };
  var RE_NUM = '(\\d+(?:[.,]\\d+)?)';
  var RE_QTD = new RegExp('^' + RE_NUM + '$');
  var RE_QTD_COLADA = new RegExp('^' + RE_NUM + '([A-Za-z\\u00C0-\\u00FF\\u00B2\\u00B3]{1,9})\\.?$');
  var RE_QTD_X = new RegExp('^' + RE_NUM + '[xX\\u00D7]$');
  var RE_X_QTD = new RegExp('^[xX\\u00D7]' + RE_NUM + '$');
  var RE_PAREN_QTD = new RegExp('^\\(\\s*' + RE_NUM + '\\s*\\)$');

  function parseQtd(str) {
    var s = String(str).trim();
    if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');          // 1.000 = mil
    s = s.replace(',', '.');
    var n = parseFloat(s);
    if (isNaN(n) || !isFinite(n) || n <= 0) return null;
    return n;
  }
  function fmtQtd(n) { return String(Math.round(n * 1000) / 1000).replace('.', ','); }
  function chaveP(tok) { return maiusc(tok).replace(/[.,;:]+$/, ''); }
  // contexto da leitura em andamento: as unidades CADASTRADAS (e as já ensinadas) também contam como "palavra de unidade"
  var _ctxLeitura = null;
  function unidInfo(tok) {
    var k = chaveP(tok);
    if (Object.prototype.hasOwnProperty.call(UNID_PALAVRAS, k)) return UNID_PALAVRAS[k];
    var U = _ctxLeitura && _ctxLeitura.unidIdx;
    if (U && k.length >= 2) { var kk = chaveUnid(tok); if (U.reg[kk] || U.ens[kk]) return 1; }
    return undefined;
  }

  // a palavra aparece em algum insumo do cadastro? (só vale com cadastro carregado)
  function palavraDeInsumo(tok) {
    if (!_ctxLeitura || !_ctxLeitura.idx) return true;           // sem cadastro: não arrisca separar
    var t = tokensDe(tok).sig;
    if (!t.length) return true;
    return !!_ctxLeitura.idx.post[t[0]];
  }

  // Primeiro token como quantidade: {qtd, unid?}
  function qtdDoToken(tok) {
    var m;
    if ((m = RE_QTD.exec(tok))) { var n = parseQtd(m[1]); return n ? { qtd: n } : null; }
    if ((m = RE_QTD_X.exec(tok))) { var n2 = parseQtd(m[1]); return n2 ? { qtd: n2 } : null; }
    if ((m = RE_QTD_COLADA.exec(tok))) {
      var n3 = parseQtd(m[1]); var suf = chaveP(m[2]);
      if (n3 && unidInfo(suf) !== undefined && suf.length <= 9) return { qtd: n3, unid: m[2] };
      return null;
    }
    var pn = PALAVRAS_NUMERO[chaveP(tok)];
    if (pn) return { qtd: pn, palavra: true };
    return null;
  }

  var PARTICULA_INICIAL = /^(de|da|do|das|dos|d')\s+/i;
  function limparDesc(arrTokens) {
    var s = arrTokens.join(' ');
    s = s.replace(/^[\s,;:\-–—.]+/, '').replace(/[\s,;:\-–—.]+$/, '');
    s = s.replace(PARTICULA_INICIAL, '');
    s = s.replace(/\s+/g, ' ').trim();
    return s.toUpperCase();
  }
  function hip(qtd, unid, tokensDesc, fonte, extra) {
    return extend({ qtd: qtd == null ? null : fmtQtd(qtd), unid: unid ? String(unid).toUpperCase().replace(/[.,;:]+$/, '') : '', desc: limparDesc(tokensDesc), fonte: fonte, pref: 0 }, extra || {});
  }

  // tira "(observação)" do fim/meio, mas NUNCA um tamanho ou medida: "(Tam: P)", "(42)", "(2 m)" ficam
  function tirarObservacao(d) {
    return d.replace(/\s*\(([^)]*)\)/g, function (todo, dentro) {
      if (/\d/.test(dentro) || /\b(tam|tamanho|n[\u00BAo]?)\b/i.test(dentro) || /(^|[\s:.])(P|M|G|PP|GG|XG|XGG)(\s|$|[.)])/.test(dentro.toUpperCase())) return todo;
      return '';
    }).replace(/\s+/g, ' ').trim();
  }
  var RE_SAUDACAO = /^(bom dia|boa tarde|boa noite|ol[aá]|oi|opa|e a[ií]|segue|seguem|favor|por favor|obrigad[oa]|valeu|att|abs|abra[cç]os?|aten[cç][aã]o|lista|pedido|material|materiais|obs|observa[cç][aã]o|total|data|obra|assunto)\b/i;

  // Lê UMA linha livre e devolve as leituras possíveis (hipóteses).
  function lerLinhaLivre(bruto) {
    var info = { original: String(bruto == null ? '' : bruto), riscada: false, ignorada: false, motivo: '', hs: [] };
    var t = limpar(bruto);
    if (/̶/.test(t)) { info.riscada = true; t = t.replace(/̶/g, ''); }
    if (/^~[^~].*[^~]~$/.test(t) || /^~[^~]~$/.test(t)) { info.riscada = true; t = t.slice(1, -1); }
    if (/\(\s*riscad[oa]s?\s*\)/i.test(t)) { info.riscada = true; t = t.replace(/\s*\(\s*riscad[oa]s?\s*\)\s*/ig, ' '); }
    t = t.replace(/^[\s\-–—−•·*▪►▶>✓✔☑✅□■●○◦‣⁃]+/, '');
    t = t.replace(/^\d+\)\s*/, '');
    t = limpar(t);
    t = t.replace(new RegExp('^' + RE_NUM + '\\s*[.\\-\\u2013:]\\s*(?=[A-Za-z\\u00C0-\\u00FF(])'), '$1 ');
    t = t.replace(/^(qtd|qt|quant|quantidade)\.?:?\s*/i, '');
    t = limpar(t).replace(/[\s.;,:]+$/, '');
    info.texto = t;
    if (t.length < 2 || /^[\d\s.,]+$/.test(t)) { info.ignorada = true; info.motivo = 'vazia'; return info; }
    var temDigito = /\d/.test(t);
    if (!temDigito && (RE_SAUDACAO.test(t) || /:\s*$/.test(limpar(bruto)))) { info.ignorada = true; info.motivo = 'saudacao'; }

    var toks = t.split(' ');
    var hs = [];
    var n = toks.length;
    var primeiro = qtdDoToken(toks[0]);
    if (primeiro && n === 1) primeiro = null;

    if (primeiro) {
      var rest = toks.slice(1);
      if (rest.length && /^[xX×]$/.test(rest[0])) rest = rest.slice(1);
      if (primeiro.unid) {
        hs.push(hip(primeiro.qtd, primeiro.unid, rest, 'inicio-colada', { pref: 3 }));
      } else {
        var u0 = rest.length ? unidInfo(rest[0]) : undefined;
        if (u0 !== undefined && rest.length > 1) {
          hs.push(hip(primeiro.qtd, rest[0], rest.slice(1), 'inicio-unid', { pref: 3 }));
          if (u0 === 1) hs.push(hip(primeiro.qtd, '', rest, 'inicio-semunid', { pref: 0 }));
        } else {
          hs.push(hip(primeiro.qtd, '', rest, 'inicio-semunid', { pref: 1 }));
          // "12 tonel martelo tipo unha": palavra que NÃO é insumo de ninguém no cadastro, no lugar da unidade.
          // Só vence se o resto for achado com segurança no cadastro (ver chaveHip); a unidade continua não aceita.
          var p2 = rest.length ? rest[0] : '';
          if (rest.length >= 2 && /^[A-Za-z\u00C0-\u00FF]{2,12}\.?$/.test(p2) && !STOP[maiusc(p2).replace(/\.$/, '')] && !palavraDeInsumo(p2)) {
            hs.push(hip(primeiro.qtd, p2, rest.slice(1), 'inicio-unid-desconhecida', { pref: -1 }));
          }
        }
        // "2 balde de pedreiro un": a unidade escrita DEPOIS da descrição (M/L/G sozinhos seguem a regra de tamanho x unidade, abaixo)
        var ult2 = rest.length >= 2 ? rest[rest.length - 1] : '';
        if (ult2 && !/^\d/.test(ult2) && !/^[MLG]\.?$/i.test(ult2) && unidInfo(ult2) !== undefined) {
          hs.push(hip(primeiro.qtd, ult2, rest.slice(0, -1), 'inicio-desc-unid', { pref: 0.5 }));
        }
        // "caixa 3 prego": unidade antes da quantidade
      }
    } else if (n >= 3 && unidInfo(toks[0]) !== undefined && RE_QTD.test(toks[1]) && parseQtd(toks[1])) {
      hs.push(hip(parseQtd(toks[1]), toks[0], toks.slice(2), 'unid-qtd-inicio', { pref: 2 }));
    } else {
      var last = toks[n - 1], prev = n >= 2 ? toks[n - 2] : '', m;
      var q;
      if (n >= 3 && unidInfo(last) !== undefined && RE_QTD.test(prev) && (q = parseQtd(prev))) {
        hs.push(hip(q, last, toks.slice(0, n - 2), 'fim-qtd-unid', { pref: 3, marcado: true }));
      }
      if (n >= 3 && unidInfo(prev) !== undefined && RE_QTD.test(last) && (q = parseQtd(last))) {
        hs.push(hip(q, prev, toks.slice(0, n - 2), 'fim-unid-qtd', { pref: 2, marcado: true }));
      }
      if (n >= 2 && (m = RE_QTD_COLADA.exec(last)) && unidInfo(m[2]) !== undefined && (q = parseQtd(m[1]))) {
        hs.push(hip(q, m[2], toks.slice(0, n - 1), 'fim-colada', { pref: 3, marcado: true }));
      }
      if (n >= 2 && (m = RE_X_QTD.exec(last)) && (q = parseQtd(m[1]))) {
        hs.push(hip(q, '', toks.slice(0, n - 1), 'fim-x', { pref: 3, marcado: true }));
      }
      if (n >= 3 && /^[xX×]$/.test(prev) && RE_QTD.test(last) && (q = parseQtd(last))) {
        hs.push(hip(q, '', toks.slice(0, n - 2), 'fim-x', { pref: 3, marcado: true }));
      }
      if (n >= 3 && /^(qtd|qt|quant|quantidade)\.?:?$/i.test(prev) && RE_QTD.test(last) && (q = parseQtd(last))) {
        hs.push(hip(q, '', toks.slice(0, n - 2), 'fim-rotulo', { pref: 3, marcado: true }));
      }
      if (n >= 2 && (m = RE_PAREN_QTD.exec(last)) && (q = parseQtd(m[1]))) {
        hs.push(hip(q, '', toks.slice(0, n - 1), 'fim-parenteses', { pref: 3, marcado: true }));
      }
      if (n >= 3 && /^[-–]$/.test(prev) && RE_QTD.test(last) && (q = parseQtd(last))) {
        hs.push(hip(q, '', toks.slice(0, n - 2), 'fim-traco', { pref: 2, marcado: true }));
      }
      // "(5 un)" no fim
      var mp = /\(\s*(\d+(?:[.,]\d+)?)\s*([A-Za-zÀ-ÿ]{1,9})?\s*\)$/.exec(t);
      if (mp && (q = parseQtd(mp[1])) && (!mp[2] || unidInfo(mp[2]) !== undefined)) {
        hs.push(hip(q, mp[2] || '', [t.slice(0, mp.index)], 'fim-parenteses', { pref: 3, marcado: true }));
      }
      if (!hs.length && n >= 2 && RE_QTD.test(last) && (q = parseQtd(last))) {
        hs.push(hip(q, '', toks.slice(0, n - 1), 'fim-solto', { pref: 0, qtdSolta: true }));
      }
      hs.push(hip(null, '', toks, 'sem-qtd', { pref: 0.5 }));
    }

    // tamanho x unidade colada no fim ("camisa M": M é tamanho ou metro?)
    var extras = [];
    hs.forEach(function (h) {
      if (h.qtd && !h.unid && h.fonte === 'inicio-semunid') {
        var dt = h.desc.split(' ');
        var ult = dt[dt.length - 1], penult = dt.length > 1 ? dt[dt.length - 2] : '';
        if (dt.length > 1 && /^[MLG]$/.test(ult) && !/^(TAM|TAMANHO|N|Nº|NO|NUM)$/i.test(penult.replace(/[.:]/g, ''))) {
          extras.push(extend(h, { desc: dt.slice(0, -1).join(' '), unid: ult, fonte: 'cauda-unid', pref: 0.2 }));
          h.cauda = true;
        }
      }
    });
    hs = hs.concat(extras);

    // variantes: sem "(observação)" e sem "que está…/pra…/para…"
    var vars = [];
    hs.forEach(function (h) {
      if (!h.desc) return;
      var d = h.desc;
      var semParen = tirarObservacao(d);
      if (semParen && semParen !== d) vars.push(extend(h, { desc: semParen, descCompleta: h.descCompleta || d, pref: h.pref - 3, variante: 'sem-parenteses' }));
      var m2 = /^(.{3,}?)\s+(QUE|PRA|PARA|P\/|ONDE|QUE EST[AÁ])\s+/i.exec(d);
      if (m2) vars.push(extend(h, { desc: m2[1].trim(), descCompleta: h.descCompleta || d, pref: h.pref - 3, variante: 'corte-clausula' }));
    });
    hs = hs.concat(vars).filter(function (h) { return h.desc; });
    info.hs = hs;
    return info;
  }

  // Linha estruturada (Excel/PDF/foto): {qtd, unid, desc}
  function lerLinhaEstruturada(row) {
    var info = { original: row.original || '', riscada: !!row.riscada, ignorada: false, motivo: '', hs: [], texto: '' };
    var desc = limpar(row.desc);
    desc = desc.replace(/^[\s\-–—•*]+/, '').replace(/[\s.;,:]+$/, '');
    var uni = limpar(row.unid);
    var qn = (row.qtd == null || limpar(row.qtd) === '') ? null : (typeof row.qtd === 'number' ? (row.qtd > 0 ? row.qtd : null) : parseQtd(limpar(row.qtd)));
    info.texto = desc;
    if (!desc && !uni && qn == null) { info.ignorada = true; info.motivo = 'vazia'; return info; }
    if (!desc) { info.ignorada = true; info.motivo = 'sem-descricao'; return info; }
    if (qn == null && !/\d/.test(desc) && (RE_SAUDACAO.test(desc) || /:\s*$/.test(desc))) { info.ignorada = true; info.motivo = 'saudacao'; return info; }
    var toks = desc.split(' ');
    var base = hip(qn, uni, toks, 'planilha', { pref: 3 });
    var hs = [base];
    var d = base.desc;
    var semParen = tirarObservacao(d);
    if (semParen && semParen !== d) hs.push(extend(base, { desc: semParen, descCompleta: d, pref: 0, variante: 'sem-parenteses' }));
    var m2 = /^(.{3,}?)\s+(QUE|PRA|PARA|P\/|ONDE)\s+/i.exec(d);
    if (m2) hs.push(extend(base, { desc: m2[1].trim(), descCompleta: d, pref: 0, variante: 'corte-clausula' }));
    info.hs = hs.filter(function (h) { return h.desc; });
    return info;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 7. ESCOLHER A MELHOR LEITURA E MONTAR A LINHA
  // ──────────────────────────────────────────────────────────────────────────
  function rankInsumo(m) {
    if (m.status === 'certo') return 5;
    if (m.status === 'provavel') return m.forte ? 4 : 3;
    if (m.status === 'varios' || m.status === 'numero_diferente') return 2;
    return 0;
  }
  function chaveHip(e) {
    var r = rankInsumo(e.m);
    var u = e.u.status === 'ok' ? 5 : (e.u.status === 'sugerida' ? 3 : 0);
    var k = r * 100 + (e.m.score || 0) * 50 + u + e.h.pref;
    if (e.h.fonte === 'inicio-unid-desconhecida') {   // só vale se o insumo for achado com muita segurança
      var seguro = r === 5 || (r === 4 && (e.m.score || 0) >= 0.8 && tokensDe(e.h.desc).sig.length >= 2);
      if (!seguro) k -= 1000;
    }
    return k;
  }
  var _seq = 0;
  function avaliarHipoteses(info, ctx) {
    var ev = info.hs.map(function (h) { return { h: h, m: casarInsumo(h.desc, ctx), u: casarUnidade(h.unid, ctx) }; });
    ev.forEach(function (e) { e.k = chaveHip(e); });
    var ordem = ev.map(function (e, i) { return i; }).sort(function (a, b) { return ev[b].k - ev[a].k || a - b; });
    return { ev: ev, melhor: ordem[0], ordem: ordem };
  }

  // linha = estado "bruto" da conferência; as escolhas dele ficam em linha.escolha
  function criarLinha(info, ctx, numLinha) {
    var L = { id: 'L' + (++_seq), n: numLinha, original: info.original, texto: info.texto || '', riscada: !!info.riscada, ignorada: !!info.ignorada, motivoIgnorada: info.motivo || '', escolha: {}, info: info };
    if (info.ignorada && (info.motivo === 'vazia' || !info.hs || !info.hs.length)) { L.hip = []; return L; }
    var av = avaliarHipoteses(info, ctx);
    L.hip = av.ev;
    L.iHip = av.melhor;
    // sem quantidade, sem unidade e sem nada parecido no cadastro: não é um item (saudação, comentário...)
    var eIni = av.ev[av.melhor];
    if (!L.ignorada && eIni && eIni.h.qtd == null && !eIni.h.unid && eIni.m.status === 'nao') { L.ignorada = true; L.motivoIgnorada = 'sem-nada'; }
    // leitura incerta: a letra final (M/L/G) pode ser TAMANHO ou UNIDADE (metro/litro/grama).
    // Só pergunta se o cadastro NÃO confirma o tamanho (ex.: existe "CAMISA - UNIFORME M") e as duas
    // leituras levam a um insumo do cadastro; senão ele seria obrigado a responder à toa.
    L.incerta = null;
    var iC = null, iU = null;
    av.ordem.forEach(function (i) {
      var e = av.ev[i];
      if (iC == null && e.h.cauda) iC = i;
      if (iU == null && e.h.fonte === 'cauda-unid') iU = i;
    });
    if (iC != null && iU != null) {
      var eC = av.ev[iC], eU = av.ev[iU];
      var tamanhoConfirmado = eC.m.status === 'certo' || ((eC.m.status === 'provavel' || eC.m.status === 'varios') && !eC.m.aviso);
      var insumoOk = eU.m.status === 'certo' || eU.m.status === 'provavel' || eU.m.status === 'varios';
      var unidadeViavel = eU.u.status === 'ok' || eU.u.status === 'sugerida';
      if (!tamanhoConfirmado && insumoOk && unidadeViavel) L.incerta = { opcoes: [iC, iU].sort(function (a, b) { return a - b; }) };
    }
    return L;
  }

  function criarContexto(opts) {
    opts = opts || {};
    var idx = indiceDe(opts.insumos || []);
    return {
      idx: idx,
      insumos: opts.insumos || [],
      unidades: opts.unidades || [],
      aprendizados: opts.aprendizados || {},
      aprendizadosUnidade: opts.aprendizadosUnidade || {},
      aprendIdx: montarAprendIdx(opts.aprendizados || {}, idx),
      unidIdx: montarUnidIdx(opts.unidades || [], opts.aprendizadosUnidade || {}),
      mapaItens: opts.mapaItens || [],
      usoAnterior: opts.usoAnterior || {}
    };
  }

  // "usada antes": a última unidade que cada insumo teve em outro mapa
  function construirUsoAnterior(mapas, mapaAtualId) {
    var out = {};
    var lista = (mapas || []).slice().sort(function (a, b) { return (+(a && a.numero) || 0) - (+(b && b.numero) || 0); });
    lista.forEach(function (mp) {
      if (!mp || mp.id === mapaAtualId) return;
      (mp.itens || []).forEach(function (it) {
        if (!it || !it.descricao || !it.unid) return;
        out[tokensDe(it.descricao).seq] = String(it.unid).trim().toUpperCase();
      });
    });
    return out;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 8. LER O TEXTO COLADO (várias linhas)
  // ──────────────────────────────────────────────────────────────────────────
  // Separadores de coluna (vírgula, ponto e vírgula, barra vertical, tab): reconhece os campos
  // e monta a leitura sem adivinhar; se não fechar certo, lê a linha inteira como texto livre.
  function lerComSeparadores(bruto) {
    var t = limpar(bruto).replace(/^[\s\-–—•*]+/, '');
    var temSep = /[;|\t]/.test(String(bruto)) || /,(?!\d)/.test(t) && /(^|,)\s*\d+(?:[.]\d+)?\s*,/.test(t);
    if (!temSep) return null;
    var campos = String(bruto).replace(/^[\s\-–—•*]+/, '').split(/\s*[;|\t]\s*|\s*,\s*(?!\d)/).map(limpar).filter(function (c) { return c !== ''; });
    if (campos.length < 2) return null;
    var qi = -1, ui = -1, di = [];
    campos.forEach(function (c, i) {
      if (qi < 0 && RE_QTD.test(c) && parseQtd(c)) { qi = i; return; }
      if (ui < 0 && unidInfo(c) !== undefined && c.split(' ').length === 1) { ui = i; return; }
      di.push(i);
    });
    // contrato antigo: "quantidade, unidade, descrição" — com 3 campos ou mais, o 2º (uma palavra só) é a unidade
    if (qi === 0 && ui < 0 && campos.length >= 3 && campos[1].split(' ').length === 1 && di.length >= 2 && di[0] === 1) { ui = 1; di.shift(); }
    if (qi < 0 || !di.length) return null;
    var desc = di.map(function (i) { return campos[i]; }).join(' ');
    return lerLinhaEstruturada({ original: bruto, qtd: campos[qi], unid: ui >= 0 ? campos[ui] : '', desc: desc });
  }

  function detectarNumeracao(linhas) {
    var seq = [];
    for (var i = 0; i < linhas.length; i++) {
      var m = /^[\s\-•*]*(\d+)\s*[.\-)]\s+\S/.exec(linhas[i]);
      if (!m) return false;
      seq.push(+m[1]);
    }
    if (seq.length < 3) return false;
    for (var j = 0; j < seq.length; j++) { if (seq[j] !== j + 1) return false; }
    return true;
  }

  function lerTexto(texto, ctx) {
    _ctxLeitura = ctx || null;
    try { return lerTextoInterno(texto, ctx); } finally { _ctxLeitura = null; }
  }
  function lerTextoInterno(texto, ctx) {
    var brutas = String(texto == null ? '' : texto).split(/\r?\n/);
    var linhas = [];
    var naoVazias = brutas.filter(function (l) { return limpar(l) !== ''; });
    var numeracao = detectarNumeracao(naoVazias);
    brutas.forEach(function (b, i) {
      if (limpar(b) === '') return;
      var bruto = numeracao ? b.replace(/^([\s\-•*]*)\d+\s*[.\-)]\s+/, '$1') : b;
      var info = lerComSeparadores(bruto) || lerLinhaLivre(bruto);
      info.original = b;
      linhas.push(criarLinha(info, ctx, i + 1));
    });
    return { linhas: linhas, numeracao: numeracao };
  }

  function lerLinhasEstruturadas(rows, ctx) {
    var linhas = [];
    rows.forEach(function (r, i) {
      var info = lerLinhaEstruturada(r);
      linhas.push(criarLinha(info, ctx, r.n || (i + 1)));
    });
    return { linhas: linhas };
  }

  // Planilha (matriz de células) → linhas estruturadas. Acha o cabeçalho; se não houver, deduz as colunas.
  function lerPlanilha(aoa, ctx) {
    _ctxLeitura = ctx || null;
    try { return lerPlanilhaInterno(aoa); } finally { _ctxLeitura = null; }
  }
  function lerPlanilhaInterno(aoa) {
    var rows = (aoa || []).map(function (r) { return (r || []).map(function (c) { return c == null ? '' : c; }); });
    var out = { rows: [], texto: false, cabecalho: -1, colunas: null };
    var nz = rows.map(function (r, i) { return { r: r, i: i, ne: r.filter(function (c) { return limpar(c) !== ''; }).length }; }).filter(function (o) { return o.ne > 0; });
    if (!nz.length) return out;
    var RQ = /^(qtd|qt|qtde|quant|quantidade|qde)\b/i, RU = /^(un|und|unid|unidade|medida|unid\.)\b/i, RD = /^(desc|descri|item|material|insumo|produto|especifica)/i;
    var cab = -1, cols = null;
    for (var a = 0; a < Math.min(nz.length, 12); a++) {
      var r = nz[a].r, q = -1, u = -1, d = -1;
      r.forEach(function (c, j) { var s = limpar(c); if (q < 0 && RQ.test(s)) q = j; else if (u < 0 && RU.test(s)) u = j; else if (d < 0 && RD.test(s)) d = j; });
      if (d >= 0 && (q >= 0 || u >= 0)) { cab = nz[a].i; cols = { q: q, u: u, d: d }; break; }
    }
    if (!cols) {
      var amostra = nz.slice(0, 15);
      var ncol = 0; amostra.forEach(function (o) { ncol = Math.max(ncol, o.r.length); });
      var st = [];
      for (var j = 0; j < ncol; j++) {
        var tot = 0, num = 0, un = 0, comp = 0;
        amostra.forEach(function (o) { var s = limpar(o.r[j]); if (s === '') return; tot++; if (RE_QTD.test(s) || typeof o.r[j] === 'number') num++; else if (unidInfo(s) !== undefined && s.split(' ').length === 1) un++; comp += s.length; });
        st.push({ j: j, tot: tot, num: tot ? num / tot : 0, un: tot ? un / tot : 0, comp: tot ? comp / tot : 0 });
      }
      var comTexto = st.filter(function (s) { return s.tot > 0; });
      if (comTexto.length <= 1) { out.texto = true; return out; }
      var qc = comTexto.slice().sort(function (x, y) { return y.num - x.num; })[0];
      var q2 = qc && qc.num >= 0.6 ? qc.j : -1;
      var restantes = comTexto.filter(function (s) { return s.j !== q2; });
      var uc = restantes.slice().sort(function (x, y) { return y.un - x.un; })[0];
      var u2 = uc && uc.un >= 0.5 ? uc.j : -1;
      var dc = restantes.filter(function (s) { return s.j !== u2; }).sort(function (x, y) { return y.comp - x.comp; })[0];
      if (!dc) { out.texto = true; return out; }
      cols = { q: q2, u: u2, d: dc.j };
    }
    out.cabecalho = cab; out.colunas = cols;
    nz.forEach(function (o) {
      if (o.i <= cab) return;
      var cel = function (j) { return j >= 0 ? o.r[j] : ''; };
      var desc = limpar(cel(cols.d));
      var qv = cel(cols.q);
      var qtd = typeof qv === 'number' ? qv : limpar(qv);
      var unid = limpar(cel(cols.u));
      if (desc === '' && qtd === '' && unid === '') return;
      out.rows.push({ n: o.i + 1, original: o.r.map(function (c) { return limpar(c); }).join(' | '), qtd: qtd, unid: unid, desc: desc });
    });
    return out;
  }

  // Resposta da leitura de foto/PDF por IA: [{qtd, unidade, descricao, riscada}]
  function linhasDeIA(lista) {
    return (lista || []).map(function (x, i) {
      return { n: i + 1, original: [x.qtd, x.unidade || x.unid, x.descricao || x.desc].join(' ').trim(), qtd: x.qtd == null ? '' : x.qtd, unid: x.unidade || x.unid || '', desc: x.descricao || x.desc || '', riscada: !!x.riscada };
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 9. VISÃO DE CADA LINHA (o que a tela mostra e o que vai para o mapa)
  // ──────────────────────────────────────────────────────────────────────────
  function hipAtual(L) {
    var i = L.escolha.hip != null ? L.escolha.hip : L.iHip;
    return L.hip[i] || null;
  }
  function qtdFinal(L, e) {
    if (L.escolha.qtd != null) {
      var n = parseQtd(L.escolha.qtd);
      return n ? { ok: true, valor: fmtQtd(n), editada: true } : { ok: false, valor: String(L.escolha.qtd), editada: true };
    }
    return e && e.h.qtd ? { ok: true, valor: e.h.qtd } : { ok: false, valor: '' };
  }
  function chaveInsumoUso(nome) { return tokensDe(nome).seq; }

  // calcula a visão de UMA linha (sem olhar as outras)
  function visaoLinha(L, ctx) {
    var V = { id: L.id, n: L.n, original: L.original, estado: 'conferir', rotulo: '', pendencias: [], avisos: [] };
    var e = L.hip && L.hip.length ? L.hip[L.escolha.hip != null ? L.escolha.hip : L.iHip] : null;
    V.hipotese = e ? e.h : null;
    if (L.ignorada && !L.escolha.tratarComoInsumo) { V.estado = 'ignorada'; V.rotulo = L.motivoIgnorada === 'saudacao' ? 'Ignorada' : 'Ignorada'; V.motivo = L.motivoIgnorada; return V; }
    if (L.riscada && !L.escolha.incluirRiscada) { V.estado = 'ignorada'; V.rotulo = 'Riscada'; V.motivo = 'riscada'; return V; }
    if (L.escolha.fora) { V.estado = 'fora'; V.rotulo = 'Deixada de fora'; return V; }
    if (!e) { V.estado = 'ignorada'; V.motivo = 'vazia'; return V; }
    // leitura incerta (tamanho x unidade)
    if (L.incerta && L.escolha.hip == null) { V.pendencias.push('leitura'); V.incerta = L.incerta; }
    // insumo
    var m = e.m, ins = null;
    if (L.escolha.insumo && ctx.idx.setNomes[L.escolha.insumo.nome]) ins = { oficial: L.escolha.insumo.nome, via: 'escolhido', ensinar: !!L.escolha.insumo.ensinar };
    else if (m.status === 'certo') ins = { oficial: m.oficial, via: m.via };
    V.insumo = ins; V.m = m;
    if (!ins) V.pendencias.push(m.status === 'nao' ? 'insumo-nao' : (m.status === 'provavel' ? 'insumo-provavel' : (m.status === 'numero_diferente' ? 'insumo-numero' : 'insumo-varios')));
    // quantidade
    var q = qtdFinal(L, e);
    V.qtd = q;
    if (!q.ok) V.pendencias.push('qtd');
    if (e.h.qtdSolta && L.escolha.qtd == null) { V.avisos.push('qtd-solta'); V.pendencias.push('qtd-confirmar'); }
    // unidade
    var u = e.u, uni = null;
    if (L.escolha.unidade && ctx.unidIdx.reg[chaveUnid(L.escolha.unidade.nome)]) uni = { oficial: ctx.unidIdx.reg[chaveUnid(L.escolha.unidade.nome)], via: 'escolhida', ensinar: !!L.escolha.unidade.ensinar };
    else if (u.status === 'ok') uni = { oficial: u.oficial, via: u.via };
    // conflito com a unidade que o insumo teve em outro mapa (só quando a unidade veio por "ensinada")
    var candidatoUso = ins ? ins.oficial : (m.oficial || null);
    var usada = candidatoUso ? ctx.usoAnterior[chaveInsumoUso(candidatoUso)] : null;
    V.usadaAntes = usada || null;
    if (ins && uni && uni.via === 'ensinado' && usada && chaveUnid(usada) !== chaveUnid(uni.oficial) && !L.escolha.unidadeConfirmada) {
      V.pendencias.push('unidade-diferente'); V.unidadeConflito = uni; uni = null;
    }
    // trocou a unidade pedida (ex.: CAIXA -> KG): nunca converte sozinho, ele digita a quantidade na nova unidade
    if (ins && uni && uni.via === 'escolhida' && L.escolha.qtd == null) {
      var ku2 = chaveUnid(uni.oficial);
      var mudou = (u.status === 'ok' && chaveUnid(u.oficial) !== ku2) ||
        (u.status === 'sugerida' && !(u.sugestoes || []).some(function (x) { return chaveUnid(x) === ku2; }));
      if (mudou) V.pendencias.push('qtd-unidade-mudou');
    }
    V.unidade = uni; V.u = u;
    if (!uni && V.pendencias.indexOf('unidade-diferente') < 0) V.pendencias.push(u.status === 'falta' ? 'unidade-falta' : (u.status === 'sugerida' ? 'unidade-sugerida' : 'unidade-desconhecida'));
    V.completo = !!(ins && uni && q.ok);
    return V;
  }

  // visão de todas as linhas, com as comparações entre linhas (repetida / já está no mapa)
  function calcularTudo(linhas, ctx) {
    var vs = linhas.map(function (L) { return visaoLinha(L, ctx); });
    var jaNoMapa = {};
    (ctx.mapaItens || []).forEach(function (it, i) { if (it && it.descricao) { var k = tokensDe(it.descricao).seq; if (!jaNoMapa[k]) jaNoMapa[k] = { num: it.num != null ? it.num : (i + 1), qt: it.qt, unid: it.unid, nome: it.descricao }; } });
    var vistos = {};
    vs.forEach(function (V, i) {
      var L = linhas[i];
      if (V.estado === 'ignorada' || V.estado === 'fora' || !V.insumo) return;
      var k = tokensDe(V.insumo.oficial).seq;
      if (jaNoMapa[k]) { V.jaNoMapa = jaNoMapa[k]; if (!L.escolha.duplicadoOk) V.pendencias.push('ja-no-mapa'); }
      if (vistos[k] != null) { V.repetidoDe = vistos[k]; if (!L.escolha.duplicadoOk) V.pendencias.push('repetida'); }
      else vistos[k] = L.n;
    });
    vs.forEach(function (V, i) {
      var L = linhas[i];
      if (V.estado === 'ignorada' || V.estado === 'fora') { V.incluir = false; return; }
      V.pendentes = V.pendencias.slice();
      var completo = V.completo && V.pendencias.length === 0;
      if (L.escolha.incluir != null) V.incluir = !!L.escolha.incluir && V.completo && V.pendencias.indexOf('leitura') < 0;
      else V.incluir = completo;
      // rótulo e estado
      if (completo) {
        var direto = V.insumo.via !== 'escolhido' && V.unidade.via !== 'escolhida' && !L.escolha.qtd && !L.escolha.hip;
        V.estado = direto ? 'certo' : 'resolvida';
        V.rotulo = direto ? 'CERTO' : 'CONFERIDA';
        if (direto && V.insumo.via === 'ensinado') V.rotulo = 'CERTO · já ensinado';
      } else if (V.pendencias.indexOf('insumo-nao') >= 0) { V.estado = 'nao'; V.rotulo = 'NÃO ENCONTRADO'; }
      else V.estado = 'conferir', V.rotulo = 'CONFERIR';
    });
    return vs;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 10. AÇÕES DO CLAUDIO (funções puras: devolvem uma linha nova)
  // ──────────────────────────────────────────────────────────────────────────
  function comEscolha(L, patch) { return extend(L, { escolha: extend(L.escolha, patch) }); }
  var Acoes = {
    escolherLeitura: function (L, i) { return comEscolha(L, { hip: i }); },
    // ensinar = true por padrão quando ele escolhe (pedido dele); numero_diferente nunca ensina
    escolherInsumo: function (L, nome, ensinar) { return comEscolha(L, { insumo: { nome: nome, ensinar: ensinar === undefined ? L.escolha.ensinarInsumo !== false : ensinar !== false } }); },
    // a caixinha "Ensinar o sistema" (vale antes e depois de confirmar)
    ensinarInsumo: function (L, sim) { var p = { ensinarInsumo: !!sim }; if (L.escolha.insumo && !L.escolha.insumo.numeroAceito) p.insumo = extend(L.escolha.insumo, { ensinar: !!sim }); return comEscolha(L, p); },
    ensinarUnidade: function (L, sim) { var p = { ensinarUnidade: !!sim }; if (L.escolha.unidade) p.unidade = extend(L.escolha.unidade, { ensinar: !!sim }); return comEscolha(L, p); },
    desfazerInsumo: function (L) { return comEscolha(L, { insumo: null, incluir: null }); },
    desfazerUnidade: function (L) { return comEscolha(L, { unidade: null, unidadeConfirmada: false, incluir: null }); },
    aceitarNumeroDiferente: function (L, nome) { return comEscolha(L, { insumo: { nome: nome, ensinar: false, numeroAceito: true } }); },
    confirmarProvavel: function (L) {
      var e = L.hip[L.escolha.hip != null ? L.escolha.hip : L.iHip];
      if (!e || e.m.status !== 'provavel') return L;
      return comEscolha(L, { insumo: { nome: e.m.oficial, ensinar: L.escolha.ensinarInsumo !== false } });
    },
    escolherUnidade: function (L, nome, ensinar) { return comEscolha(L, { unidade: { nome: nome, ensinar: ensinar === undefined ? L.escolha.ensinarUnidade !== false : ensinar !== false }, unidadeConfirmada: true }); },
    manterUnidade: function (L) { return comEscolha(L, { unidadeConfirmada: true }); },
    definirQtd: function (L, valor) { return comEscolha(L, { qtd: valor }); },
    deixarDeFora: function (L) { return comEscolha(L, { fora: true, incluir: false }); },
    voltarAoSistema: function (L) { return comEscolha(L, { fora: false }); },
    marcar: function (L, sim) { return comEscolha(L, { incluir: !!sim }); },
    tratarComoInsumo: function (L) { return comEscolha(L, { tratarComoInsumo: true }); },
    confirmarQtd: function (L) { var e = L.hip[L.escolha.hip != null ? L.escolha.hip : L.iHip]; return e && e.h.qtd ? comEscolha(L, { qtd: e.h.qtd }) : L; },
    incluirRiscada: function (L) { return comEscolha(L, { incluirRiscada: true }); },
    duplicadoOk: function (L) { return comEscolha(L, { duplicadoOk: true }); },
    pedirCadastro: function (L) { return comEscolha(L, { pedirCadastro: true, incluir: false }); },
    desfazerPedirCadastro: function (L) { return comEscolha(L, { pedirCadastro: false, incluir: null }); },
    // "150" no fim de "lixa 150" não era quantidade: o número volta para a descrição e a quantidade fica em branco
    qtdSoltaNaoEQuantidade: function (L) {
      var atual = L.hip[L.escolha.hip != null ? L.escolha.hip : L.iHip], alvo = -1;
      L.hip.forEach(function (e, i) { if (alvo < 0 && e.h.fonte === 'sem-qtd' && (e.h.variante || '') === (atual.h.variante || '')) alvo = i; });
      if (alvo < 0) L.hip.forEach(function (e, i) { if (alvo < 0 && e.h.fonte === 'sem-qtd') alvo = i; });
      return comEscolha(L, alvo >= 0 ? { hip: alvo, qtd: '' } : { qtd: '' });
    }
  };

  // v14: uma linha "deixada de fora" não calcula pendências (devolve cedo). Para saber se o insumo/medida da marca "pedir cadastro" já existe,
  // olhamos a linha como se não estivesse de fora (a decisão de deixar de fora continua valendo; só não esconde a situação do cadastro).
  function visaoSemFora(L, ctx) {
    return L.escolha.fora ? visaoLinha(extend(L, { escolha: extend(L.escolha, { fora: false }) }), ctx) : visaoLinha(L, ctx);
  }

  // Refaz a conferência das linhas com o cadastro/aprendizado de AGORA (ex.: depois de desfazer um aprendizado),
  // sem perder nenhuma escolha dele.
  function reavaliar(linhas, ctx) {
    return linhas.map(function (L) {
      if (!L.info) return L;
      var N = criarLinha(L.info, ctx, L.n);
      N.id = L.id; N.escolha = L.escolha;
      // v14: se ele tinha marcado "pedir cadastro" (insumo que não existe OU medida que não existe) e isso PASSOU a existir (cadastrou no Banco), a marca perde o sentido:
      // a linha volta a ser conferida normalmente (provável/certo), sem ficar de fora por causa da marca antiga.
      if (N.escolha && N.escolha.pedirCadastro) {
        var V0 = visaoSemFora(N, ctx);
        if (V0.estado !== 'ignorada' && V0.pendencias.indexOf('insumo-nao') < 0 && V0.pendencias.indexOf('insumo-numero') < 0) N = Acoes.desfazerPedirCadastro(N);
      }
      return N;
    });
  }

  // chave(s) já ensinada(s) que valem para esta descrição (para "Desfazer o que foi ensinado")
  function chavesEnsinadas(desc, aprendizados) {
    var seq = tokensDe(desc).seq, out = [];
    Object.keys(aprendizados || {}).forEach(function (k) { if (tokensDe(k).seq === seq) out.push(k); });
    return out;
  }

  // Confirma de uma vez só os insumos "prováveis FORTES" (quase tudo confere e não sobrou palavra sem par).
  // Não mexe em provável fraco ("confere o essencial"), número diferente, vários parecidos ou nada encontrado:
  // esses o usuário confere um a um.
  function provavelForte(V, L) {
    return V.pendencias.indexOf('insumo-provavel') >= 0 && !(L.incerta && L.escolha.hip == null) && !!(V.m && V.m.forte) && !(V.m.faltam && V.m.faltam.length) && !V.m.aviso;
  }
  function confirmarTodosProvaveis(linhas, ctx) {
    var vs = calcularTudo(linhas, ctx), n = 0;
    var novas = linhas.map(function (L, i) {
      if (provavelForte(vs[i], L)) { n++; return Acoes.confirmarProvavel(L); }
      return L;
    });
    return { linhas: novas, n: n };
  }
  function contarProvaveis(linhas, ctx) {
    var vs = calcularTudo(linhas, ctx), n = 0;
    vs.forEach(function (V, i) { if (provavelForte(V, linhas[i])) n++; });
    return n;
  }

  // O que vai para o mapa e o que o sistema aprende — só ao clicar em Aplicar.
  function montarAplicacao(linhas, ctx) {
    var vs = calcularTudo(linhas, ctx);
    var itens = [], aprender = [], aprenderUnidade = [], pedirCadastro = [];
    var jaAprendiI = {}, jaAprendiU = {};
    vs.forEach(function (V, i) {
      var L = linhas[i];
      var Vm = L.escolha.pedirCadastro && V.estado === 'fora' ? visaoSemFora(L, ctx) : V;
      if (L.escolha.pedirCadastro && (V.estado === 'ignorada' || Vm.pendencias.indexOf('insumo-nao') >= 0 || Vm.pendencias.indexOf('insumo-numero') >= 0)) { pedirCadastro.push({ desc: (V.hipotese && V.hipotese.desc) || L.texto, qtd: V.qtd && V.qtd.valor, unid: V.hipotese && V.hipotese.unid }); }
      if (!V.incluir || !V.completo) return;
      itens.push({ qtd: V.qtd.valor, unid: V.unidade.oficial, descricao: V.insumo.oficial });
      var e = L.hip[L.escolha.hip != null ? L.escolha.hip : L.iHip];
      if (V.insumo.via === 'escolhido' && V.insumo.ensinar && !(L.escolha.insumo && L.escolha.insumo.numeroAceito)) {
        var txt = e.h.descCompleta || e.h.desc; var kk = txt.toUpperCase();
        if (txt && !jaAprendiI[kk]) { jaAprendiI[kk] = 1; aprender.push({ texto: txt, oficial: V.insumo.oficial }); }
      }
      if (V.unidade.via === 'escolhida' && V.unidade.ensinar && e.h.unid) {
        var ku = chaveUnid(e.h.unid);
        // só aprende quando o texto escrito era desconhecido, ou quando a escolhida é uma das equivalentes sugeridas
        // (UND = UN). Trocar CAIXA por KG, ou UN por KG numa unidade que já valia, NUNCA é aprendido.
        var kEsc = chaveUnid(V.unidade.oficial);
        var aprendivel = e.u.status === 'desconhecida' || (e.u.status === 'sugerida' && (e.u.sugestoes || []).some(function (x) { return chaveUnid(x) === kEsc; }));
        if (ku && aprendivel && ku !== kEsc && !jaAprendiU[ku]) { jaAprendiU[ku] = 1; aprenderUnidade.push({ texto: e.h.unid, oficial: V.unidade.oficial }); }
      }
    });
    return { itens: itens, aprender: aprender, aprenderUnidade: aprenderUnidade, pedirCadastro: pedirCadastro };
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 11. APOIO DA TELA (busca no cadastro, conferência do que ele escolheu, PDF, foto)
  // ──────────────────────────────────────────────────────────────────────────
  // Busca em todo o cadastro: pedaços de palavras em qualquer ordem, sem acento/maiúscula.
  function buscarCadastro(ctx, termo, max) {
    max = max || 500;
    var idx = ctx.idx;
    if (!idx.buscaNorm) { idx.buscaNorm = idx.nomes.map(function (n) { return maiusc(n); }); }
    var palavras = maiusc(limpar(termo)).split(/[^A-Z0-9,]+/).filter(function (p) { return p.length > 0; });
    var out = { todas: [], parte: [], palavras: palavras, total: 0 };
    if (!palavras.length || limpar(termo).length < 2) return out;
    for (var i = 0; i < idx.buscaNorm.length; i++) {
      var nm = idx.buscaNorm[i], acertos = 0;
      for (var k = 0; k < palavras.length; k++) { if (nm.indexOf(palavras[k]) >= 0) acertos++; }
      if (acertos === palavras.length) { out.todas.push(idx.nomes[i]); }
      else if (palavras.length > 1 && acertos > 0 && acertos >= Math.ceil(palavras.length / 2)) { out.parte.push({ nome: idx.nomes[i], acertos: acertos }); }
    }
    out.parte.sort(function (a, b) { return b.acertos - a.acertos; });
    out.parte = out.parte.map(function (o) { return o.nome; });
    out.total = out.todas.length + out.parte.length;
    out.todas = out.todas.slice(0, max);
    out.parte = out.parte.slice(0, Math.max(0, max - out.todas.length));
    return out;
  }

  // Conferência do que ele escolheu na busca: números/medidas do pedido x do cadastro.
  function conferirEscolha(desc, nome) {
    var q = tokensDe(desc), it = tokensDe(nome), faltantes = [], extras = [];
    q.nums.forEach(function (n) { if (!it.nums.some(function (m) { return numIgual(n, m); })) faltantes.push(n); });
    it.nums.forEach(function (m) { if (!q.nums.some(function (n) { return numIgual(n, m); })) extras.push(m); });
    // conflito = o pedido tem um número/medida e o cadastro tem OUTRO (mesma regra do motor). Pedido com medida e cadastro sem
    // nenhuma medida (ex.: "linha de pesca 100m" x "LINHA - DE PESCA") não é conflito: só não há o que comparar.
    return { pedido: q.nums, cadastro: it.nums, faltantes: faltantes, extras: extras, conflito: faltantes.length > 0 && extras.length > 0, semMedidaNoCadastro: faltantes.length > 0 && extras.length === 0, semNumeroNoPedido: q.nums.length === 0 };
  }
  function numLegivel(n) { return String(n).replace(/^T:/, 'tamanho ').replace(/POL$/, ' pol'); }

  // Texto do PDF (itens do pdf.js: {str, transform:[a,b,c,d,x,y]}) → linhas na ordem de leitura.
  function linhasDoPdf(paginas) {
    var out = [];
    (paginas || []).forEach(function (itens) {
      var its = (itens || []).filter(function (i) { return i && typeof i.str === 'string' && i.str.trim() !== '' && i.transform; })
        .map(function (i) { return { s: i.str, x: i.transform[4], y: i.transform[5], w: i.width || 0 }; });
      its.sort(function (a, b) { return b.y - a.y || a.x - b.x; });
      var linhas = [], atual = null;
      its.forEach(function (i) {
        if (atual && Math.abs(atual.y - i.y) <= 3) { atual.itens.push(i); }
        else { atual = { y: i.y, itens: [i] }; linhas.push(atual); }
      });
      linhas.forEach(function (l) {
        l.itens.sort(function (a, b) { return a.x - b.x; });
        var txt = '', fim = null;
        l.itens.forEach(function (i) {
          if (fim != null) { var gap = i.x - fim; txt += gap > 12 ? '\t' : (gap > 1 ? ' ' : ''); }
          txt += i.s.replace(/\s+$/, '');
          fim = i.x + (i.w || i.s.length * 4);
        });
        out.push(txt.trim());
      });
    });
    return out.filter(function (l) { return l !== ''; });
  }

  // PDF: se achar um cabeçalho de tabela (Quantidade / Unidade / Descrição) lê por colunas; senão lê como texto livre.
  function lerPdf(paginas, ctx) {
    var ls = linhasDoPdf(paginas);
    if (!ls.length) return { linhas: [], vazio: true };
    var aoa = ls.map(function (l) { return l.split('\t'); });
    var pl = lerPlanilha(aoa, ctx);
    if (!pl.texto && pl.cabecalho >= 0 && pl.rows.length) {
      var r = lerLinhasEstruturadas(pl.rows, ctx); r.estruturado = true; r.colunas = pl.colunas; return r;
    }
    var r2 = lerTexto(ls.map(function (l) { return l.replace(/\t+/g, ' '); }).join('\n'), ctx); r2.estruturado = false; return r2;
  }

  // Resposta da leitura por IA (formato Anthropic): extrai [{qtd, unidade, descricao, riscada}]
  function lerRespostaIA(data) {
    if (!data) throw new Error('Resposta vazia da leitura de foto.');
    if (data.error) throw new Error((data.error && data.error.message) || 'Erro na leitura da foto.');
    var txt = (data.content || []).filter(function (b) { return b && b.type === 'text'; }).map(function (b) { return b.text; }).join('');
    var limpo = txt.replace(/```json|```/g, '').trim();
    var i0 = limpo.indexOf('{'), i1 = limpo.lastIndexOf('}'), j0 = limpo.indexOf('['), j1 = limpo.lastIndexOf(']');
    var obj;
    try {
      if (j0 >= 0 && (i0 < 0 || j0 < i0)) obj = JSON.parse(limpo.slice(j0, j1 + 1));
      else obj = JSON.parse(limpo.slice(i0, i1 + 1));
    } catch (e) { throw new Error('Não consegui entender a resposta da leitura de foto.'); }
    var lista = Array.isArray(obj) ? obj : (obj.linhas || obj.itens || []);
    return lista.filter(function (x) { return x && (x.descricao || x.desc); });
  }

  return {
    // leitura
    lerPdf: lerPdf, reavaliar: reavaliar, chavesEnsinadas: chavesEnsinadas, lerRespostaIA: lerRespostaIA, linhasDoPdf: linhasDoPdf, buscarCadastro: buscarCadastro, conferirEscolha: conferirEscolha, numLegivel: numLegivel,
    lerTexto: lerTexto, lerLinhaLivre: lerLinhaLivre, lerLinhasEstruturadas: lerLinhasEstruturadas, lerPlanilha: lerPlanilha, linhasDeIA: linhasDeIA,
    // contexto e conferência
    criarContexto: criarContexto, construirUsoAnterior: construirUsoAnterior, casarInsumo: casarInsumo, casarUnidade: casarUnidade,
    visaoLinha: visaoLinha, calcularTudo: calcularTudo, Acoes: Acoes, confirmarTodosProvaveis: confirmarTodosProvaveis, contarProvaveis: contarProvaveis,
    montarAplicacao: montarAplicacao,
    // apoio (testes)
    tokensDe: tokensDe, parseQtd: parseQtd, fmtQtd: fmtQtd, limpar: limpar, chaveUnid: chaveUnid, indiceDe: indiceDe, UNID_PALAVRAS: UNID_PALAVRAS
  };
})();

// ============================================================================
// PARTE B — TELA DO ROBÔ (React, ES5). Substitui o antigo "ADICIONAR VÁRIOS DE UMA VEZ".
// Nada entra no mapa antes do botão verde "Aplicar" do passo 3.
// ============================================================================
var RB = {
  navy: '#0f2147', ink: '#1b2437', mute: '#5b6579', line: '#e1e6f0', line2: '#d9dfeb', line3: '#b6bfd1', soft: '#eef1f7', soft2: '#f6f8fc',
  verde: '#1e7a3c', verdeBg: '#dff3e3', verdeBd: '#8fd19e', verdeTx: '#14612a', verdeCard: '#f6fbf7', verdeCardBd: '#b9dfc2',
  amarBg: '#fff1cf', amarBd: '#efc15c', amarTx: '#6b3f00', amarCard: '#fffaf0', amarCardBd: '#efd9a0',
  verm: '#8f1d1d', vermBg: '#fde0e0', vermBd: '#ee9a9a', vermCard: '#fff6f5', vermCardBd: '#f0b9b4',
  azulBg: '#eaf0fc', azulBd: '#c3d2f3'
};

var RB_CSS = [
  '.rb-ov{position:fixed;inset:0;background:rgba(10,20,40,0.55);display:flex;align-items:center;justify-content:center;z-index:100;padding:16px;backdrop-filter:blur(2px)}',
  '.rb-ov2{z-index:110}',
  '.rb-modal{background:#fff;border-radius:12px;width:100%;max-width:1080px;max-height:calc(100vh - 32px);display:flex;flex-direction:column;overflow:hidden;box-shadow:0 18px 50px rgba(8,16,40,0.45);color:#1b2437;font-family:"Segoe UI",system-ui,-apple-system,Arial,sans-serif}',
  '.rb-modal.rb-estreito{max-width:780px}',
  '.rb-modal button{font-family:inherit;cursor:pointer}',
  '.rb-hdr{display:flex;align-items:center;gap:14px;padding:18px 24px;border-bottom:1px solid #e1e6f0;flex:none}',
  '.rb-body{padding:18px 24px 8px;overflow-y:auto;flex:1;min-height:0}',
  '.rb-ftr{display:flex;align-items:center;gap:14px;padding:14px 24px;border-top:1px solid #e1e6f0;flex:none;flex-wrap:wrap}',
  '.rb-ftr .rb-ftr-txt{flex:1;min-width:220px;font-size:13px;line-height:1.45;color:#3a4458}',
  '.rb-btn{height:44px;padding:0 18px;border-radius:8px;border:1px solid #b6bfd1;background:#fff;color:#1b2437;font-size:14px;font-weight:700;display:inline-flex;align-items:center;gap:8px;justify-content:center}',
  '.rb-btn:disabled{opacity:.45;cursor:not-allowed}',
  '.rb-btn-p{background:#0f2147;border-color:#0f2147;color:#fff}',
  '.rb-btn-v{background:#1e7a3c;border-color:#1e7a3c;color:#fff}',
  '.rb-btn-s{height:38px;padding:0 14px;font-size:13px}',
  '.rb-chip{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:999px;font-size:12px;font-weight:800;letter-spacing:.03em;border:1px solid}',
  '.rb-grid{display:grid;grid-template-columns:44px 230px 108px minmax(0,1fr) 200px;border:1px solid;border-radius:10px;margin-bottom:10px}',
  '.rb-colhead{display:grid;grid-template-columns:44px 230px 108px minmax(0,1fr) 200px;margin-top:16px;padding:0 0 8px;font-size:11px;font-weight:700;letter-spacing:.05em;color:#5b6579}',
  '.rb-cel{padding:12px;min-width:0}',
  '.rb-tabs{display:flex;gap:2px;border-bottom:1px solid #e1e6f0;margin-bottom:14px;flex-wrap:wrap}',
  '.rb-tab{height:44px;padding:0 18px;border:0;background:transparent;font-size:14px;font-weight:700;color:#5b6579;border-bottom:3px solid transparent;margin-bottom:-1px}',
  '.rb-tab.rb-on{color:#0f2147;border-bottom-color:#0f2147}',
  '.rb-seg{display:flex;gap:4px;padding:4px;background:#eef1f7;border-radius:10px;flex-wrap:wrap}',
  '.rb-seg button{height:40px;padding:0 14px;border:0;border-radius:8px;background:transparent;font-size:13px;font-weight:600;color:#3a4458}',
  '.rb-seg button.rb-on{background:#fff;font-weight:700;color:#0f2147;box-shadow:0 1px 3px rgba(8,16,40,.15)}',
  '.rb-in{height:42px;border:1px solid #b6bfd1;border-radius:8px;padding:0 12px;font-size:15px;color:#1b2437;background:#fff;font-family:inherit}',
  '.rb-in:focus{outline:2px solid #0f2147;outline-offset:0}',
  '.rb-opt{display:flex;align-items:flex-start;gap:10px;padding:10px 12px;border:1px solid #d9dfeb;border-radius:8px;background:#fff;margin-bottom:8px;cursor:pointer;font-size:14px;line-height:1.35;width:100%;text-align:left}',
  '.rb-opt.rb-on{border:2px solid #0f2147;background:#eaf0fc;padding:9px 11px}',
  '.rb-mono{font-family:Consolas,"Courier New",monospace}',
  '.rb-hl{background:#fde68a;border-radius:3px;padding:0 2px}',
  '@media(max-width:760px){',
  '  .rb-ov{padding:0;align-items:stretch}',
  '  .rb-modal,.rb-modal.rb-estreito{max-width:none;max-height:none;height:100%;border-radius:0}',
  '  .rb-hdr{padding:12px 14px}.rb-body{padding:12px 14px 6px}.rb-ftr{padding:10px 14px}',
  '  .rb-grid{grid-template-columns:40px minmax(0,1fr);grid-template-areas:"chk sit" "env env" "qtd qtd" "cad cad"}',
  '  .rb-colhead{display:none}',
  '  .rb-c-chk{grid-area:chk}.rb-c-sit{grid-area:sit}.rb-c-env{grid-area:env}.rb-c-qtd{grid-area:qtd}.rb-c-cad{grid-area:cad}',
  '  .rb-tab{padding:0 10px;font-size:13px}',
  '  .rb-ftr .rb-btn{flex:1}',
  '  .rb-hide-m{display:none!important}',
  '}'
].join('\n');

var RB_ICONES = {
  check: [['path', { d: 'M5 12.5l4.5 4.5L19 7.5' }]],
  aviso: [['path', { d: 'M12 3.5l9.5 16.5h-19L12 3.5z' }], ['path', { d: 'M12 10v4.5' }], ['path', { d: 'M12 17.5v.01' }]],
  xcirc: [['circle', { cx: 12, cy: 12, r: 9 }], ['path', { d: 'M9 9l6 6M15 9l-6 6' }]],
  menos: [['circle', { cx: 12, cy: 12, r: 9 }], ['path', { d: 'M8 12h8' }]],
  fechar: [['path', { d: 'M6 6l12 12M18 6L6 18' }]],
  lupa: [['circle', { cx: 11, cy: 11, r: 6.5 }], ['path', { d: 'M20 20l-4.2-4.2' }]],
  robo: [['rect', { x: 4, y: 8, width: 16, height: 11, rx: 3 }], ['path', { d: 'M12 8V5M9 13.5v.01M15 13.5v.01M10 16.5h4' }]],
  cadeado: [['rect', { x: 5, y: 11, width: 14, height: 9, rx: 2 }], ['path', { d: 'M8 11V8a4 4 0 018 0v3' }]],
  seta: [['path', { d: 'M5 12h14M13 6l6 6-6 6' }]],
  lampada: [['path', { d: 'M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0012 3z' }]],
  pasta: [['path', { d: 'M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z' }]],
  copiar: [['rect', { x: 9, y: 9, width: 11, height: 11, rx: 2 }], ['path', { d: 'M5 15V6a2 2 0 012-2h8' }]],
  mais: [['path', { d: 'M12 5v14M5 12h14' }]]
};
var RB_VAZIO = []; // referência estável (evita recalcular tudo a cada tela quando o mapa não passa cadastro)
function rbIco(nome, tam, cor) {
  var partes = RB_ICONES[nome] || [];
  return React.createElement('svg', { width: tam || 18, height: tam || 18, viewBox: '0 0 24 24', fill: 'none', stroke: cor || 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true', style: { flex: 'none' } },
    partes.map(function (p, i) { return React.createElement(p[0], Object.assign({ key: i }, p[1])); }));
}

function rbChip(estado, rotulo) {
  var e = {
    certo: { bg: RB.verdeBg, bd: RB.verdeBd, tx: RB.verdeTx, ic: 'check' },
    resolvida: { bg: RB.verdeBg, bd: RB.verdeBd, tx: RB.verdeTx, ic: 'check' },
    conferir: { bg: RB.amarBg, bd: RB.amarBd, tx: RB.amarTx, ic: 'aviso' },
    nao: { bg: RB.vermBg, bd: RB.vermBd, tx: RB.verm, ic: 'xcirc' },
    ignorada: { bg: RB.soft, bd: RB.line3, tx: '#3a4458', ic: 'menos' },
    fora: { bg: RB.soft, bd: RB.line3, tx: '#3a4458', ic: 'menos' }
  }[estado] || { bg: RB.soft, bd: RB.line3, tx: '#3a4458', ic: 'menos' };
  return React.createElement('span', { className: 'rb-chip', style: { background: e.bg, borderColor: e.bd, color: e.tx } }, rbIco(e.ic, 15), rotulo);
}

// destaca no nome do cadastro as palavras digitadas (sem acento / maiúscula)
function rbDestacar(nome, palavras) {
  var norm = '', mapa = [], i, k;
  for (i = 0; i < nome.length; i++) {
    var c = String(nome.charAt(i)).normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase();
    for (k = 0; k < c.length; k++) { norm += c.charAt(k); mapa.push(i); }
  }
  var marc = [];
  for (i = 0; i < nome.length; i++) marc[i] = false;
  (palavras || []).forEach(function (p) {
    var pos = 0, ach;
    while (p && (ach = norm.indexOf(p, pos)) >= 0) {
      for (k = ach; k < ach + p.length; k++) marc[mapa[k]] = true;
      pos = ach + p.length;
    }
  });
  var partes = [], atual = '', estado = false;
  for (i = 0; i < nome.length; i++) {
    if (marc[i] !== estado && atual !== '') { partes.push([estado, atual]); atual = ''; }
    estado = marc[i]; atual += nome.charAt(i);
  }
  if (atual !== '') partes.push([estado, atual]);
  return partes.map(function (p, j) { return p[0] ? React.createElement('span', { key: j, className: 'rb-hl' }, p[1]) : p[1]; });
}

function rbCopiar(texto) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) { return navigator.clipboard.writeText(texto); }
  } catch (e) {}
  return new Promise(function (ok, falha) {
    try {
      var ta = document.createElement('textarea'); ta.value = texto; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select(); var r = document.execCommand('copy'); document.body.removeChild(ta);
      r ? ok() : falha(new Error('copy'));
    } catch (e2) { falha(e2); }
  });
}

// motivo (texto) de cada linha que ficou de fora do mapa
function rbMotivoFora(V, L) {
  if (L.escolha.fora) return 'Deixada de fora por você.';
  if (L.escolha.incluir === false) return 'Desmarcada por você.';
  var p = V.pendencias || [];
  if (p.indexOf('leitura') >= 0) return 'A leitura da linha ficou sem resposta.';
  if (p.indexOf('insumo-nao') >= 0) return L.escolha.pedirCadastro ? 'Não existe no cadastro: foi para a lista "para cadastrar".' : 'Não existe no cadastro.';
  if (p.indexOf('insumo-numero') >= 0) return 'Número/medida diferente do cadastro; sem decisão.';
  if (p.indexOf('insumo-varios') >= 0) return 'Vários insumos parecidos; nenhum escolhido.';
  if (p.indexOf('insumo-provavel') >= 0) return 'Insumo provável ainda não confirmado.';
  if (p.indexOf('qtd') >= 0 || p.indexOf('qtd-confirmar') >= 0 || p.indexOf('qtd-unidade-mudou') >= 0) return 'Quantidade sem confirmar.';
  if (p.some(function (x) { return x.indexOf('unidade') === 0; })) return 'Unidade sem definir.';
  if (p.indexOf('ja-no-mapa') >= 0) return 'Já está no mapa.';
  if (p.indexOf('repetida') >= 0) return 'Repetida na relação.';
  return 'Aguardando sua decisão.';
}

// ───────────────────────── uma linha da conferência ─────────────────────────
function rbBtn(rotulo, onClick, tipo, extra) {
  var filhos = Array.isArray(rotulo) ? rotulo : [rotulo];
  return React.createElement.apply(null, ['button', Object.assign({ type: 'button', className: 'rb-btn rb-btn-s' + (tipo === 'p' ? ' rb-btn-p' : ''), onClick: onClick }, extra || {})].concat(filhos));
}
function rbSpan(partes) { return React.createElement.apply(null, ['span', null].concat(partes)); }
function rbNeg(t) { return React.createElement('b', null, t); }
function rbCaixinha(marcado, onChange, rotulo, nota, desabilitado) {
  return React.createElement('div', { style: { marginTop: 10 } },
    React.createElement('label', { style: { display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, fontWeight: 600, cursor: desabilitado ? 'default' : 'pointer', opacity: desabilitado ? 0.6 : 1 } },
      React.createElement('input', { type: 'checkbox', checked: !!marcado, disabled: !!desabilitado, onChange: function (ev) { onChange(ev.target.checked); }, style: { width: 20, height: 20, accentColor: RB.navy, margin: '1px 0 0', flex: 'none' } }),
      React.createElement('span', null, rotulo)),
    nota && React.createElement('div', { style: { fontSize: 12, color: RB.mute, marginTop: 4, marginLeft: 30, lineHeight: 1.45 } }, nota));
}
function rbRotuloSituacao(V, L) {
  var p = V.pendencias || [], t = [];
  if (p.indexOf('leitura') >= 0) return 'Leitura incerta';
  var unidadePend = p.some(function (x) { return x.indexOf('unidade') === 0; });
  if (p.indexOf('insumo-provavel') >= 0) t.push(unidadePend ? 'Provável + unidade' : 'Provável (1 clique)');
  if (p.indexOf('insumo-numero') >= 0) t.push('Número diferente');
  if (p.indexOf('insumo-varios') >= 0) t.push('Vários parecidos');
  if (p.indexOf('insumo-nao') >= 0) t.push(L.escolha.pedirCadastro ? 'Para cadastrar' : 'Nada parecido');
  if (p.indexOf('qtd') >= 0) t.push('Sem quantidade');
  if (p.indexOf('qtd-confirmar') >= 0) t.push('Confirmar a quantidade');
  if (p.indexOf('qtd-unidade-mudou') >= 0) t.push('Digitar a quantidade');
  if (p.indexOf('unidade-diferente') >= 0) t.push('Unidade diferente da usada antes');
  if (p.indexOf('insumo-provavel') < 0) {
    if (p.indexOf('unidade-sugerida') >= 0 || p.indexOf('unidade-desconhecida') >= 0) t.push('Unidade fora do cadastro');
    if (p.indexOf('unidade-falta') >= 0) t.push('Falta a unidade');
  }
  if (p.indexOf('ja-no-mapa') >= 0) t.push('Já está no mapa');
  if (p.indexOf('repetida') >= 0) t.push('Repetida na relação');
  return t.slice(0, 2).join(' + ');
}

function RoboLinha(props) {
  var h = React.createElement, R = MapacotRobo, A = R.Acoes;
  var L = props.L, V = props.V, ctx = props.ctx, set = props.onMudar;
  var estado = V.estado, e = V.hipotese;
  var p = V.pendencias || [];
  var tem = function (k) { return p.indexOf(k) >= 0; };
  var pronto = estado === 'certo' || estado === 'resolvida';
  var cor = pronto ? { bg: RB.verdeCard, bd: RB.verdeCardBd } : estado === 'nao' ? { bg: RB.vermCard, bd: RB.vermCardBd } : estado === 'conferir' ? { bg: RB.amarCard, bd: RB.amarCardBd } : { bg: RB.soft2, bd: RB.line2 };
  var m = V.m;

  // ── coluna "no cadastro do sistema" ──
  var secs = [];
  var add = function (k, el) { secs.push(h('div', { key: k, style: { marginBottom: 12 } }, el)); };
  var descPedido = e ? (e.descCompleta || e.desc) : '';

  if (estado === 'ignorada') {
    add('risc', h('div', null, h('div', { style: { fontWeight: 700 } }, 'Riscada na relação. Fica de fora do mapa.'),
      h('div', { style: { marginTop: 8 } }, rbBtn('Incluir mesmo assim', function () { set(A.incluirRiscada(L)); }))));
  } else if (estado === 'fora') {
    add('fora', h('div', null, h('div', { style: { fontWeight: 700 } }, 'Deixada de fora. Não entra no mapa.'),
      h('div', { style: { marginTop: 8 } }, rbBtn('Voltar para a conferência', function () { set(A.voltarAoSistema(L)); }))));
  } else if (tem('leitura')) {
    var letra = '';
    V.incerta.opcoes.forEach(function (i) { if (L.hip[i].h.fonte === 'cauda-unid') letra = L.hip[i].h.unid; });
    add('leit', h('div', null,
      h('div', { style: { fontWeight: 700, marginBottom: 8, lineHeight: 1.4 } }, 'O sistema não tem certeza do que o "' + letra + '" quer dizer. Escolha como ler esta linha:'),
      V.incerta.opcoes.map(function (i) {
        var ev = L.hip[i], ehUn = !!ev.h.unid;
        return h('button', { key: i, type: 'button', role: 'radio', 'aria-checked': 'false', className: 'rb-opt', onClick: function () { set(A.escolherLeitura(L, i)); } },
          h('span', { style: { width: 18, height: 18, borderRadius: 9, border: '2px solid ' + RB.line3, flex: 'none', marginTop: 1 } }),
          rbSpan(ehUn ? ['"' + ev.h.unid + '" é a ', rbNeg('unidade'), ': insumo ', rbNeg(ev.h.desc), ', unidade ', rbNeg(ev.h.unid)] : ['"' + letra + '" é o ', rbNeg('tamanho'), ': insumo ', rbNeg(ev.h.desc), ', unidade a escolher']));
      }),
      h('div', { style: { fontSize: 12, color: RB.mute } }, 'Só aparece quando a linha pode ser lida de duas formas. O sistema não adivinha.')));
  } else {
    // ---- avisos de repetição ----
    if (tem('ja-no-mapa')) {
      add('jam', h('div', { style: { padding: '10px 12px', borderRadius: 8, background: RB.vermBg, border: '1px solid ' + RB.vermBd, color: RB.verm } },
        h('div', { style: { fontWeight: 800 } }, 'JÁ ESTÁ NO MAPA (item nº ' + V.jaNoMapa.num + ': ' + (V.jaNoMapa.qt || '?') + ' ' + (V.jaNoMapa.unid || '') + ')'),
        h('div', { style: { fontSize: 13, marginTop: 4 } }, 'Adicionar de novo cria um segundo item igual.'),
        h('div', { style: { display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' } },
          rbBtn('Adicionar mesmo assim', function () { set(A.duplicadoOk(L)); }),
          rbBtn('Deixar de fora', function () { set(A.deixarDeFora(L)); }))));
    }
    if (tem('repetida')) {
      add('rep', h('div', { style: { padding: '10px 12px', borderRadius: 8, background: RB.amarBg, border: '1px solid ' + RB.amarBd, color: RB.amarTx } },
        h('div', { style: { fontWeight: 800 } }, 'REPETIDA NA RELAÇÃO (mesmo insumo da linha ' + V.repetidoDe + ')'),
        h('div', { style: { display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' } },
          rbBtn('Adicionar mesmo assim', function () { set(A.duplicadoOk(L)); }),
          rbBtn('Deixar de fora', function () { set(A.deixarDeFora(L)); }))));
    }

    // ---- insumo ----
    if (V.insumo) {
      var via = V.insumo.via;
      var nota = null;
      if (via === 'igual') nota = 'Descrição igual à do cadastro.' + (V.unidade ? ' Unidade ' + V.unidade.oficial + ' cadastrada.' : '');
      else if (via === 'ensinado') nota = 'Você já ensinou: "' + descPedido + '" vale este insumo.';
      else nota = 'Você escolheu este insumo.' + (V.insumo.ensinar ? ' O sistema vai aprender "' + descPedido + '".' : (L.escolha.insumo && L.escolha.insumo.numeroAceito ? ' Número diferente aceito por você: o sistema não aprende.' : ''));
      var chaves = via === 'ensinado' ? R.chavesEnsinadas(descPedido, ctx.aprendizados) : [];
      add('ins', h('div', null,
        h('div', { style: { fontWeight: 800, fontSize: 16 } }, V.insumo.oficial),
        h('div', { style: { fontSize: 13, color: RB.verdeTx, marginTop: 3 } }, nota),
        via === 'ensinado' && chaves.length > 0 && h('div', { style: { marginTop: 8 } }, rbBtn('Desfazer o que foi ensinado', function () { props.onDesfazerEnsinado(chaves); })),
        via === 'escolhido' && h('div', { style: { marginTop: 8 } }, rbBtn('Trocar de insumo', function () { set(A.desfazerInsumo(L)); }))));
    } else if (tem('insumo-provavel')) {
      add('prov', h('div', null,
        h('div', { style: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: RB.amarTx, marginBottom: 6 } }, '1) INSUMO'),
        h('div', { style: { padding: '10px 12px', border: '1px solid ' + RB.line2, borderRadius: 8, background: '#fff' } },
          h('div', { style: { fontWeight: 800, fontSize: 15 } }, m.oficial),
          h('div', { style: { fontSize: 13, color: RB.mute, marginTop: 2, lineHeight: 1.4 } }, (m.forte ? 'Provável: quase tudo confere.' : 'Provável: confere o essencial, falta você confirmar.') + (m.faltam && m.faltam.length ? ' Sem par no cadastro: ' + m.faltam.map(function (x) { return '"' + x.toLowerCase() + '"'; }).join(', ') + '.' : '') + (m.aviso ? ' ' + m.aviso : ''))),
        h('div', { style: { display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' } },
          rbBtn('Confirmar este insumo', function () { set(A.confirmarProvavel(L)); }, 'p'),
          rbBtn([rbIco('lupa', 15), ' Buscar em todo o cadastro'], function () { props.onBuscar(L); })),
        rbCaixinha(L.escolha.ensinarInsumo !== false, function (v) { set(A.ensinarInsumo(L, v)); }, 'Ensinar o sistema: "' + descPedido + '" vale este insumo', null)));
    } else if (tem('insumo-numero')) {
      var outros = (m.candidatos || []).filter(function (c) { return c.nome !== m.oficial; });
      add('num', h('div', null,
        h('div', { style: { padding: '10px 12px', border: '1px solid ' + RB.amarBd, borderRadius: 8, background: '#fff' } },
          h('div', { style: { fontWeight: 800, fontSize: 15 } }, m.oficial),
          h('div', { style: { fontSize: 13, color: RB.amarTx, marginTop: 4, lineHeight: 1.45 } }, 'Você pediu ', rbNeg((m.pedido || []).map(R.numLegivel).join(', ')), '. O cadastro tem ', rbNeg((m.cadastro || []).map(R.numLegivel).join(', ')), '. O sistema não troca sozinho e não aprende essa troca.')),
        h('div', { style: { display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' } },
          rbBtn('Usar o ' + (m.cadastro || []).map(R.numLegivel).join(', ') + ' assim mesmo', function () { set(A.aceitarNumeroDiferente(L, m.oficial)); }),
          rbBtn([rbIco('lupa', 15), ' Buscar em todo o cadastro'], function () { props.onBuscar(L); }),
          rbBtn('Pedir cadastro do ' + (m.pedido || []).map(R.numLegivel).join(', '), function () { set(A.pedirCadastro(L)); }),
          rbBtn('Deixar de fora', function () { set(A.deixarDeFora(L)); })),
        outros.length > 0 && h('div', { style: { marginTop: 10, fontSize: 12, color: RB.mute } }, 'Também parecidos: ', outros.map(function (c, i) { return h('button', { key: i, type: 'button', onClick: function () { set(A.aceitarNumeroDiferente(L, c.nome)); }, style: { display: 'block', marginTop: 4, padding: '6px 10px', border: '1px solid ' + RB.line2, borderRadius: 6, background: '#fff', fontSize: 12, textAlign: 'left' } }, 'Usar assim mesmo: ' + c.nome); }))));
    } else if (tem('insumo-varios')) {
      add('var', h('div', null,
        h('div', { style: { fontWeight: 800, marginBottom: 8, lineHeight: 1.4 } }, 'Vários insumos parecidos. O sistema não escolhe por você:'),
        (m.candidatos || []).map(function (c, i) {
          return h('button', { key: i, type: 'button', role: 'radio', 'aria-checked': 'false', className: 'rb-opt', onClick: function () { set(A.escolherInsumo(L, c.nome)); } },
            h('span', { style: { width: 18, height: 18, borderRadius: 9, border: '2px solid ' + RB.line3, flex: 'none', marginTop: 1 } }), h('span', null, c.nome));
        }),
        h('div', { style: { display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' } },
          rbBtn([rbIco('lupa', 15), ' Buscar em todo o cadastro'], function () { props.onBuscar(L); }),
          rbBtn('Deixar de fora', function () { set(A.deixarDeFora(L)); })),
        rbCaixinha(L.escolha.ensinarInsumo !== false, function (v) { set(A.ensinarInsumo(L, v)); }, 'Ensinar o sistema: "' + descPedido + '" vale o insumo escolhido', 'Vale só para essa frase exata. Na próxima vez ela aparece como CERTO, e dá para desfazer depois.')));
    } else if (tem('insumo-nao')) {
      add('nao', h('div', null,
        h('div', { style: { fontWeight: 800 } }, 'Nada parecido encontrado.'),
        h('div', { style: { fontSize: 13, color: RB.mute, marginTop: 3, lineHeight: 1.45 } }, 'Se você sabe que existe com outro nome, busque em todo o cadastro. Não entra no mapa sozinho.'),
        L.escolha.pedirCadastro
          ? h('div', { style: { marginTop: 8, padding: '8px 10px', borderRadius: 8, background: RB.azulBg, border: '1px solid ' + RB.azulBd, fontSize: 13 } }, 'Marcado para cadastrar (aparece na lista do resumo). ', rbBtn('Desfazer', function () { set(A.desfazerPedirCadastro(L)); }))
          : h('div', { style: { display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' } },
            rbBtn([rbIco('lupa', 15), ' Buscar em todo o cadastro'], function () { props.onBuscar(L); }),
            rbBtn('Pedir cadastro', function () { set(A.pedirCadastro(L)); }),
            rbBtn('Deixar de fora', function () { set(A.deixarDeFora(L)); }))));
    }

    // ---- quantidade ----
    if (tem('qtd')) {
      add('qtd', h('div', null, h('div', { style: { fontWeight: 800 } }, 'A linha não tem quantidade. O sistema não presume 1.'),
        h('div', { style: { fontSize: 13, color: RB.mute, marginTop: 3 } }, 'Digite a quantidade no campo QTD.'),
        h('div', { style: { marginTop: 8 } }, rbBtn('Deixar de fora', function () { set(A.deixarDeFora(L)); }))));
    }
    if (tem('qtd-confirmar')) {
      add('qtdc', h('div', null, h('div', { style: { fontWeight: 800, lineHeight: 1.4 } }, 'Li "' + e.qtd + '" no fim da linha como quantidade, mas pode ser a medida do insumo (ex.: lixa 150). Confirme:'),
        h('div', { style: { display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' } },
          rbBtn('Sim, a quantidade é ' + e.qtd, function () { set(A.confirmarQtd(L)); }, 'p'),
          rbBtn('Não, faz parte do nome', function () { set(A.qtdSoltaNaoEQuantidade(L)); }))));
    }
    if (tem('qtd-unidade-mudou')) {
      add('qtdu', h('div', { style: { padding: '10px 12px', borderRadius: 8, background: '#fff', border: '1px solid ' + RB.amarBd } },
        h('div', { style: { fontWeight: 800, lineHeight: 1.4 } }, 'Você trocou a unidade (' + (e.unid || '?') + ' → ' + V.unidade.oficial + '). O sistema não converte sozinho: digite a quantidade em ' + V.unidade.oficial + ' no campo QTD.'),
        h('div', { style: { marginTop: 8 } }, rbBtn('Manter ' + (V.qtd.valor || '') + ' ' + V.unidade.oficial, function () { set(A.definirQtd(L, V.qtd.valor)); }))));
    }

    // ---- unidade ----
    var uni = ctx.unidades || [];
    var chipUn = function (nome, nota2, aoClicar) {
      return h('button', { key: nome + (nota2 || ''), type: 'button', className: 'rb-btn rb-btn-s', onClick: aoClicar }, nome, nota2 && h('span', { style: { fontSize: 11, fontWeight: 600, color: RB.mute } }, nota2));
    };
    var selUn = function (rotulo, aoEscolher) {
      return h('select', { 'aria-label': rotulo, value: '', onChange: function (ev) { if (ev.target.value) aoEscolher(ev.target.value); }, className: 'rb-in', style: { height: 38, fontSize: 13, fontWeight: 600 } },
        h('option', { value: '' }, rotulo), uni.map(function (u) { return h('option', { key: u, value: u }, u); }));
    };
    var usadaReg = V.usadaAntes && ctx.unidIdx.reg[R.chaveUnid(V.usadaAntes)] ? ctx.unidIdx.reg[R.chaveUnid(V.usadaAntes)] : null;
    var cmnUn = ['UN', 'PAR', 'KG', 'CX', 'M', 'L'].map(function (x) { return ctx.unidIdx.reg[R.chaveUnid(x)]; }).filter(function (x) { return !!x; });
    if (tem('unidade-falta')) {
      var jaU = {}; var chips = [];
      if (usadaReg) { jaU[usadaReg] = 1; chips.push(chipUn(usadaReg, ' usada antes', function () { set(A.escolherUnidade(L, usadaReg)); })); }
      cmnUn.forEach(function (x) { if (!jaU[x] && chips.length < 5) { jaU[x] = 1; chips.push(chipUn(x, '', function () { set(A.escolherUnidade(L, x)); })); } });
      add('unf', h('div', null, h('div', { style: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: RB.amarTx, marginBottom: 6 } }, 'UNIDADE: a linha não trouxe'),
        h('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' } }, chips, selUn('Outra...', function (x) { set(A.escolherUnidade(L, x)); })),
        h('div', { style: { fontSize: 12, color: RB.mute, marginTop: 6, lineHeight: 1.45 } }, 'Só vale unidade cadastrada.' + (usadaReg ? ' "Usada antes" é a última unidade que este insumo teve em outro mapa.' : ''))));
    }
    if (tem('unidade-sugerida') || tem('unidade-desconhecida')) {
      var sug = V.u.sugestoes || [], jaV = {}, chips2 = [];
      sug.forEach(function (x) { jaV[x] = 1; chips2.push(chipUn(x, '', function () { set(A.escolherUnidade(L, x)); })); });
      if (usadaReg && !jaV[usadaReg]) { jaV[usadaReg] = 1; chips2.push(chipUn(usadaReg, ' usada antes', function () { set(A.escolherUnidade(L, usadaReg)); })); }
      add('uns', h('div', null,
        h('div', { style: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: RB.amarTx, marginBottom: 6 } }, 'UNIDADE'),
        h('div', { style: { fontSize: 14, lineHeight: 1.4 } }, 'A unidade ', rbNeg(e.unid), ' não está no cadastro de unidades.'),
        h('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginTop: 8 } }, chips2, selUn('Buscar unidade...', function (x) { set(A.escolherUnidade(L, x)); })),
        rbCaixinha(L.escolha.ensinarUnidade !== false, function (v) { set(A.ensinarUnidade(L, v)); }, 'Ensinar: "' + e.unid + '" vale a unidade escolhida', sug.length === 0 && !(V.u.sugestoes) ? null : 'O sistema só aprende se a unidade escolhida for a mesma coisa que você escreveu (ex.: UND = UN). Trocar caixa por kg nunca é aprendido.')));
    }
    if (tem('unidade-diferente')) {
      var ped = V.unidadeConflito.oficial;
      add('und', h('div', null,
        h('div', { style: { fontWeight: 800, lineHeight: 1.45 } }, 'Você pediu ' + (V.qtd.valor || '?') + ' ' + ped + '. Da última vez este insumo foi lançado em ' + V.usadaAntes + '. O sistema não converte sozinho.'),
        h('div', { style: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: RB.amarTx, margin: '10px 0 6px' } }, 'ESCOLHA A UNIDADE'),
        h('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap' } },
          usadaReg ? chipUn(usadaReg, ' usada antes', function () { set(A.escolherUnidade(L, usadaReg, false)); }) : null,
          chipUn(ped, ' como você pediu', function () { set(A.manterUnidade(L)); }))));
    }
    if (!secs.length && pronto) add('ok', h('div', { style: { fontSize: 13, color: RB.verdeTx } }, 'Pronta para o mapa.'));
  }

  // ── células ──
  var chk = (estado === 'ignorada' || estado === 'fora') ? null : h('input', { type: 'checkbox', checked: !!V.incluir, disabled: !(V.completo && p.length === 0), onChange: function (ev) { set(A.marcar(L, ev.target.checked)); }, 'aria-label': 'Incluir no mapa a linha ' + L.n, style: { width: 22, height: 22, accentColor: RB.navy, margin: 0 } });
  var qtdTxt = L.escolha.qtd != null ? L.escolha.qtd : (V.qtd ? V.qtd.valor : '');
  var qtdOk = V.qtd ? V.qtd.ok : false;
  var unSel = V.unidade ? V.unidade.oficial : '';
  var editavel = !(estado === 'ignorada' || estado === 'fora');
  var celQtd = editavel ? h(React.Fragment, null,
    h('input', { className: 'rb-in', inputMode: 'decimal', value: qtdTxt, placeholder: '?', 'aria-label': 'Quantidade da linha ' + L.n, onChange: function (ev) { set(A.definirQtd(L, ev.target.value)); }, style: { width: '100%', height: 40, textAlign: 'center', fontWeight: 800, fontSize: 18, padding: '0 4px', borderColor: qtdOk ? RB.line3 : RB.amarBd, background: qtdOk ? '#fff' : RB.amarBg } }),
    h('select', { 'aria-label': 'Unidade da linha ' + L.n, value: unSel, onChange: function (ev) { var v = ev.target.value; if (!v) set(A.desfazerUnidade(L)); else set(A.escolherUnidade(L, v)); }, className: 'rb-in', style: { width: '100%', height: 34, marginTop: 6, fontSize: 13, fontWeight: 800, padding: '0 4px', background: unSel ? '#fff' : RB.amarBg, borderColor: unSel ? RB.line3 : RB.amarBd } },
      h('option', { value: '' }, 'unid.'), (ctx.unidades || []).map(function (u) { return h('option', { key: u, value: u }, u); })),
    e && e.unid && !V.unidade && h('div', { style: { fontSize: 11, color: RB.amarTx, marginTop: 4, fontWeight: 700 } }, 'escrito: ' + e.unid)
  ) : h('div', { style: { fontWeight: 800, fontSize: 18, color: RB.mute } }, e && e.qtd ? e.qtd : '—');

  var sitSub = estado === 'ignorada' ? 'Riscada na relação' : estado === 'fora' ? 'Deixada de fora' : (estado === 'certo' && V.insumo && V.insumo.via === 'ensinado') ? 'Já ensinado' : (estado === 'conferir' || estado === 'nao') ? rbRotuloSituacao(V, L) : (estado === 'resolvida' ? 'Você resolveu' : '');
  var rotuloChip = estado === 'ignorada' ? 'IGNORADA' : estado === 'fora' ? 'DE FORA' : V.rotulo;

  return h('div', { className: 'rb-grid', style: { background: cor.bg, borderColor: cor.bd }, 'data-linha': L.n, 'data-estado': estado },
    h('div', { className: 'rb-cel rb-c-chk', style: { padding: '16px 0 0 14px' } }, chk),
    h('div', { className: 'rb-cel rb-c-env' }, h('div', { style: { fontSize: 11, fontWeight: 700, letterSpacing: '.04em', color: RB.mute } }, 'LINHA ' + L.n),
      h('div', { className: 'rb-mono', style: { marginTop: 4, padding: '8px 10px', background: '#eef2fb', borderRadius: 6, fontSize: 13, lineHeight: 1.4, wordBreak: 'break-word', textDecoration: estado === 'ignorada' ? 'line-through' : 'none', color: estado === 'ignorada' ? RB.mute : RB.ink } }, (L.original || '').trim())),
    h('div', { className: 'rb-cel rb-c-qtd' }, celQtd),
    h('div', { className: 'rb-cel rb-c-cad' }, secs),
    h('div', { className: 'rb-cel rb-c-sit' }, rbChip(estado, rotuloChip), sitSub && h('div', { style: { fontSize: 13, color: estado === 'conferir' ? RB.amarTx : estado === 'nao' ? RB.verm : RB.mute, marginTop: 6, lineHeight: 1.35 } }, sitSub)));
}

// ───────────────────────── busca em todo o cadastro de insumos ─────────────────────────
function RoboBusca(props) {
  var h = React.createElement, R = MapacotRobo;
  var L = props.L, ctx = props.ctx, e = props.V.hipotese || {};
  var descPedido = e.descCompleta || e.desc || L.texto || '';
  var inicial = R.tokensDe(e.desc || '').sig.slice(0, 2).join(' ').toLowerCase();
  var _t = useState(inicial), termo = _t[0], setTermo = _t[1];
  var _s = useState(null), sel = _s[0], setSel = _s[1];
  var _en = useState(true), ensinar = _en[0], setEnsinar = _en[1];
  var _co = useState(''), copiado = _co[0], setCopiado = _co[1];
  var res = React.useMemo(function () { return R.buscarCadastro(ctx, termo, 500); }, [ctx, termo]);
  // v14: copia o nome que veio na lista dele (sem quantidade e sem unidade), para colar no insumo novo do Banco
  var copiarNome = function () {
    var nome = String(descPedido || '').replace(/\s+/g, ' ').trim().toUpperCase();
    rbCopiar(nome).then(function () { setCopiado('ok'); setTimeout(function () { setCopiado(''); }, 2500); })
      .catch(function () { setCopiado('erro'); setTimeout(function () { setCopiado(''); }, 3500); });
  };
  var lista = res.todas.concat(res.parte);
  var conf = sel ? R.conferirEscolha(descPedido, sel) : null;

  var usar = function () {
    if (!sel) return;
    props.onUsar(sel, conf && conf.conflito ? 'numero' : (ensinar ? 'ensinar' : 'nao'));
  };
  var teclas = function (ev) {
    if (!lista.length) return;
    var i = sel ? lista.indexOf(sel) : -1;
    if (ev.key === 'ArrowDown') { ev.preventDefault(); setSel(lista[Math.min(lista.length - 1, i + 1)]); }
    else if (ev.key === 'ArrowUp') { ev.preventDefault(); setSel(lista[Math.max(0, i - 1)]); }
    else if (ev.key === 'Enter') { ev.preventDefault(); if (sel) usar(); else setSel(lista[0]); }
  };
  var linhaOpcao = function (nome, i, destaque) {
    var on = nome === sel;
    return h('button', { key: i + nome, type: 'button', role: 'radio', 'aria-checked': on ? 'true' : 'false', className: 'rb-opt' + (on ? ' rb-on' : ''), onClick: function () { setSel(nome); }, style: { alignItems: 'center', marginBottom: 6 } },
      h('span', { style: { width: 18, height: 18, borderRadius: 9, border: '2px solid ' + (on ? RB.navy : RB.line3), flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, on && h('span', { style: { width: 8, height: 8, borderRadius: 4, background: RB.navy } })),
      h('span', { style: { fontWeight: on ? 700 : 500 } }, rbDestacar(nome, res.palavras)));
  };

  return h('div', { className: 'rb-ov rb-ov2' },
    h('div', { className: 'rb-modal rb-estreito', role: 'dialog', 'aria-label': 'Buscar em todo o cadastro de insumos' },
      h('div', { className: 'rb-hdr' },
        h('div', { style: { width: 42, height: 42, borderRadius: 10, background: RB.navy, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' } }, rbIco('lupa', 22)),
        h('div', { style: { flex: 1, minWidth: 0 } },
          h('div', { style: { fontSize: 19, fontWeight: 700 } }, 'Buscar em todo o cadastro de insumos'),
          h('div', { style: { fontSize: 13, color: RB.mute, marginTop: 2 } }, 'Para a linha ' + L.n + ' da relação: ', h('span', { className: 'rb-mono' }, (L.original || '').trim()))),
        h('button', { type: 'button', 'aria-label': 'Fechar a busca', onClick: props.onFechar, style: { width: 44, height: 44, border: 0, background: RB.soft, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' } }, rbIco('fechar', 18))),
      h('div', { className: 'rb-body' },
        h('div', { style: { fontWeight: 700, fontSize: 14, marginBottom: 8 } }, 'Digite pedaços das palavras, em qualquer ordem'),
        h('div', { style: { display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' } },
          h('input', { className: 'rb-in', autoFocus: true, value: termo, placeholder: 'ex.: carrinho mao', 'aria-label': 'Buscar no cadastro', onChange: function (ev) { setTermo(ev.target.value); setSel(null); }, onKeyDown: teclas, style: { flex: 1, minWidth: 200, height: 48, fontSize: 17, border: '2px solid ' + RB.navy } }),
          h('div', { style: { fontWeight: 800, fontSize: 14 }, 'data-total': res.total }, termo.trim().length < 2 ? 'Digite 2 letras ou mais' : (res.total + (res.total === 1 ? ' insumo encontrado' : ' insumos encontrados')))),
        h('div', { style: { fontSize: 12.5, color: RB.mute, margin: '8px 0 12px', lineHeight: 1.5 } }, 'Exemplo: "carrinho 60" acha "CARRINHO DE MÃO - CAÇAMBA METÁLICA 60 L". Acento e maiúscula não importam, e não precisa digitar o nome inteiro. Use as setas do teclado e Enter para escolher.'),
        res.todas.length > 0 && h('div', { style: { fontSize: 11, fontWeight: 800, letterSpacing: '.05em', color: RB.verdeTx, margin: '6px 0 8px' } }, 'CONFEREM TODAS AS PALAVRAS (' + res.todas.length + ')'),
        res.todas.map(function (n, i) { return linhaOpcao(n, i); }),
        res.parte.length > 0 && h('div', { style: { fontSize: 11, fontWeight: 800, letterSpacing: '.05em', color: RB.amarTx, margin: '14px 0 8px' } }, 'CONFEREM SÓ PARTE DAS PALAVRAS (' + res.parte.length + ')'),
        res.parte.map(function (n, i) { return linhaOpcao(n, 'p' + i); }),
        res.total > 500 && h('div', { style: { fontSize: 12.5, color: RB.mute, margin: '6px 0 10px' } }, 'Mostrando os 500 primeiros de ' + res.total + '. Digite mais letras para afinar a busca.'),
        termo.trim().length >= 2 && res.total === 0 && h('div', { style: { padding: 14, borderRadius: 8, background: RB.vermCard, border: '1px solid ' + RB.vermCardBd, fontSize: 14 } }, 'Nada encontrado com esse termo. Tente outra palavra (ou só um pedaço dela). Se o insumo não existe no cadastro, use "Não existe: pedir cadastro".'),
        sel && h('div', { style: { marginTop: 14, padding: '12px 14px', borderRadius: 10, background: RB.verdeCard, border: '1px solid ' + RB.verdeCardBd } },
          h('div', { style: { fontWeight: 800, color: RB.verdeTx, display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 } }, rbIco('check', 18), 'Conferência do que você escolheu'),
          h('div', { style: { display: 'grid', gridTemplateColumns: '130px minmax(0,1fr)', gap: '6px 12px', fontSize: 14 } },
            h('div', { style: { color: RB.mute } }, 'Você pediu'), h('div', { className: 'rb-mono' }, (L.original || '').trim()),
            h('div', { style: { color: RB.mute } }, 'Vai usar'), h('div', { style: { fontWeight: 800 } }, sel),
            h('div', { style: { color: RB.mute } }, 'Números no pedido'),
            h('div', null, conf.pedido.length ? conf.pedido.map(R.numLegivel).join(', ') + (conf.conflito ? '' : conf.semMedidaNoCadastro ? ' (o cadastro não traz medida no nome)' : ' (conferem com o cadastro)') : 'nenhum, então não há medida para comparar'))),
        sel && conf.conflito && h('div', { style: { marginTop: 10, padding: '12px 14px', borderRadius: 10, background: RB.amarBg, border: '1px solid ' + RB.amarBd, color: RB.amarTx, fontSize: 14, lineHeight: 1.5 } },
          h('b', null, 'Medida diferente: '), 'pedido ' + conf.faltantes.map(R.numLegivel).join(', ') + (conf.extras.length ? ', escolhido ' + conf.extras.map(R.numLegivel).join(', ') : ', e o insumo escolhido não tem essa medida') + '. Só use se for isso mesmo que você quer. O sistema não aprende essa troca.'),
        sel && conf.semMedidaNoCadastro && h('div', { style: { marginTop: 10, padding: '10px 14px', borderRadius: 10, background: RB.azulBg, border: '1px solid ' + RB.azulBd, fontSize: 13.5, lineHeight: 1.5 } }, 'O pedido tem ' + conf.faltantes.map(R.numLegivel).join(', ') + ', mas o insumo escolhido não traz medida no nome. Confira se é o que você quer.'),
        sel && rbCaixinha(conf.conflito ? false : ensinar, function (v) { setEnsinar(v); }, 'Ensinar o sistema: "' + descPedido + '" vale este insumo', conf.conflito ? 'Desativado: com número/medida diferente o sistema não aprende.' : 'Vale só para essa frase exata. Dá para desfazer depois em "O que o sistema já aprendeu".', conf.conflito)),
      props.onAbrirCadastros && h('div', { 'data-rb': 'faixa-cadastrar', style: { flex: 'none', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', padding: '10px 24px', background: RB.azulBg, borderTop: '1px solid ' + RB.azulBd } },
        h('div', { style: { flex: '1 1 220px', fontSize: 14, lineHeight: 1.4 } }, h('b', null, 'Não achou o insumo certo na lista?'), ' Cadastre agora, sem sair do robô.'),
        h('button', { type: 'button', className: 'rb-btn rb-btn-s', 'data-rb': 'copiar-nome', onClick: copiarNome }, rbIco('copiar', 16), copiado === 'ok' ? 'Copiado!' : copiado === 'erro' ? 'Não consegui copiar' : 'Copiar nome'),
        h('button', { type: 'button', className: 'rb-btn rb-btn-s rb-btn-p', 'data-rb': 'cadastrar-agora', onClick: props.onAbrirCadastros }, rbIco('mais', 16), 'Cadastrar este insumo agora')),
      h('div', { className: 'rb-ftr' },
        h('button', { type: 'button', className: 'rb-btn', onClick: props.onFechar }, 'Cancelar'),
        h('div', { style: { flex: 1 } }),
        h('button', { type: 'button', className: 'rb-btn', onClick: props.onPedirCadastro }, 'Não existe: pedir cadastro'),
        h('button', { type: 'button', className: 'rb-btn rb-btn-p', disabled: !sel, onClick: usar }, rbIco('check', 17), conf && conf.conflito ? 'Usar mesmo assim' : 'Usar este insumo'))));
}

// ───────────────────────── o que o sistema já aprendeu ─────────────────────────
function RoboAprendidos(props) {
  var h = React.createElement;
  var apI = props.aprendizados || {}, apU = props.aprendizadosUnidade || {};
  var _b = useState(''), busca = _b[0], setBusca = _b[1];
  var _w = useState(null), ocupado = _w[0], setOcupado = _w[1];
  var _m = useState(''), msg = _m[0], setMsg = _m[1];
  var norm = function (s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); };
  var filtra = function (obj) {
    var b = norm(busca).trim();
    return Object.keys(obj).filter(function (k) { return !b || norm(k).indexOf(b) >= 0 || norm(obj[k]).indexOf(b) >= 0; }).sort();
  };
  var ki = filtra(apI), ku = filtra(apU);
  var desfazer = function (tipo, chave) {
    var fn = tipo === 'u' ? props.onDesfazerUnidade : props.onDesfazerInsumo;
    if (!fn) return;
    setOcupado(tipo + chave); setMsg('');
    Promise.resolve(fn(chave)).then(function (ok) { setOcupado(null); if (ok === false) setMsg('Não foi possível desfazer agora. Verifique a conexão e tente de novo.'); })
      .catch(function () { setOcupado(null); setMsg('Não foi possível desfazer agora. Verifique a conexão e tente de novo.'); });
  };
  var linha = function (tipo, k, v) {
    return h('div', { key: tipo + k, style: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', border: '1px solid ' + RB.line2, borderRadius: 8, marginBottom: 8, background: '#fff', flexWrap: 'wrap' } },
      h('div', { style: { flex: 1, minWidth: 220, fontSize: 14, lineHeight: 1.4 } }, tipo === 'u' ? 'Unidade ' : '', h('b', null, '"' + k + '"'), ' vale ', h('b', null, v)),
      (tipo === 'u' ? props.onDesfazerUnidade : props.onDesfazerInsumo) && h('button', { type: 'button', className: 'rb-btn rb-btn-s', disabled: ocupado === tipo + k, onClick: function () { desfazer(tipo, k); } }, ocupado === tipo + k ? 'Desfazendo...' : 'Desfazer'));
  };
  return h('div', { className: 'rb-ov rb-ov2' },
    h('div', { className: 'rb-modal rb-estreito', role: 'dialog', 'aria-label': 'O que o sistema já aprendeu' },
      h('div', { className: 'rb-hdr' },
        h('div', { style: { width: 42, height: 42, borderRadius: 10, background: RB.navy, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' } }, rbIco('lampada', 22)),
        h('div', { style: { flex: 1 } }, h('div', { style: { fontSize: 19, fontWeight: 700 } }, 'O que o sistema já aprendeu'), h('div', { style: { fontSize: 13, color: RB.mute, marginTop: 2 } }, 'Frases e unidades que você ensinou. "Desfazer" faz a frase voltar a pedir conferência.')),
        h('button', { type: 'button', 'aria-label': 'Fechar', onClick: props.onFechar, style: { width: 44, height: 44, border: 0, background: RB.soft, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' } }, rbIco('fechar', 18))),
      h('div', { className: 'rb-body' },
        h('input', { className: 'rb-in', value: busca, placeholder: 'Filtrar o que foi aprendido...', 'aria-label': 'Filtrar aprendizados', onChange: function (ev) { setBusca(ev.target.value); }, style: { width: '100%', marginBottom: 12 } }),
        msg && h('div', { style: { padding: '8px 12px', borderRadius: 8, background: RB.vermBg, color: RB.verm, fontSize: 13, marginBottom: 10 } }, msg),
        h('div', { style: { fontSize: 11, fontWeight: 800, letterSpacing: '.05em', color: RB.mute, margin: '4px 0 8px' } }, 'INSUMOS (' + ki.length + ')'),
        ki.length === 0 ? h('div', { style: { fontSize: 13, color: RB.mute, marginBottom: 12 } }, 'Nada aprendido ainda' + (busca ? ' com esse filtro.' : '.')) : ki.map(function (k) { return linha('i', k, apI[k]); }),
        h('div', { style: { fontSize: 11, fontWeight: 800, letterSpacing: '.05em', color: RB.mute, margin: '14px 0 8px' } }, 'UNIDADES (' + ku.length + ')'),
        ku.length === 0 ? h('div', { style: { fontSize: 13, color: RB.mute } }, 'Nenhuma unidade aprendida' + (busca ? ' com esse filtro.' : '.')) : ku.map(function (k) { return linha('u', k, apU[k]); })),
      h('div', { className: 'rb-ftr' }, h('div', { className: 'rb-ftr-txt' }, 'Desfazer aqui vale para os próximos mapas. O que já está nos mapas fica como está.'), h('button', { type: 'button', className: 'rb-btn rb-btn-p', onClick: props.onFechar }, 'Fechar'))));
}

// ───────────────────────── foto: reduz a imagem antes de enviar ─────────────────────────
function rbReduzirImagem(file, maxLado) {
  return new Promise(function (ok, falha) {
    var url = URL.createObjectURL(file), img = new Image();
    img.onload = function () {
      var w = img.naturalWidth, hh = img.naturalHeight, esc = Math.min(1, maxLado / Math.max(w, hh));
      var cv = document.createElement('canvas'); cv.width = Math.max(1, Math.round(w * esc)); cv.height = Math.max(1, Math.round(hh * esc));
      var c2 = cv.getContext('2d'); c2.fillStyle = '#fff'; c2.fillRect(0, 0, cv.width, cv.height); c2.drawImage(img, 0, 0, cv.width, cv.height);
      URL.revokeObjectURL(url);
      ok(cv.toDataURL('image/jpeg', 0.85).split(',')[1]);
    };
    img.onerror = function () { URL.revokeObjectURL(url); falha(new Error('Não consegui abrir esta imagem. Use um arquivo JPG ou PNG.')); };
    img.src = url;
  });
}
function rbLetraColuna(i) { return i >= 0 && i < 26 ? String.fromCharCode(65 + i) : String(i + 1); }

// ───────────────────────── o robô (3 passos) ─────────────────────────
function ModalRoboPreenchimento(props) {
  var h = React.createElement, R = MapacotRobo, A = R.Acoes;
  var insumosCad = props.cadastrosInsumos || RB_VAZIO;
  var unidadesCad = props.cadastrosUnidades || RB_VAZIO;
  var mapaItens = (props.mapa && props.mapa.itens) || [];

  var _p = useState(1), passo = _p[0], setPasso = _p[1];
  var _a = useState('colar'), aba = _a[0], setAba = _a[1];
  var _t = useState(''), texto = _t[0], setTexto = _t[1];
  var _e = useState(''), erro = _e[0], setErro = _e[1];
  var _pr = useState(''), processando = _pr[0], setProcessando = _pr[1];
  var _l = useState(null), linhas = _l[0], setLinhas = _l[1];
  var _i = useState(null), infoLeitura = _i[0], setInfoLeitura = _i[1];
  var _f = useState('todas'), filtro = _f[0], setFiltro = _f[1];
  var _b = useState(null), buscaId = _b[0], setBuscaId = _b[1];
  var _ap = useState(false), vendoAprendidos = _ap[0], setVendoAprendidos = _ap[1];
  var _cs = useState(false), confirmandoSaida = _cs[0], setConfirmandoSaida = _cs[1];
  var _ne = useState({}), naoEnsinar = _ne[0], setNaoEnsinar = _ne[1];
  var _ao = useState(false), aplicando = _ao[0], setAplicando = _ao[1];
  var _ff = useState(null), fotoArq = _ff[0], setFotoArq = _ff[1];
  var _fp = useState(''), fotoPrev = _fp[0], setFotoPrev = _fp[1];
  var _cp = useState(''), copiado = _cp[0], setCopiado = _cp[1];
  var _ul = useState({}), unidadeLote = _ul[0], setUnidadeLote = _ul[1];

  useEffect(function () {
    var original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return function () { document.body.style.overflow = original; };
  }, []);

  var usoAnterior = React.useMemo(function () { return R.construirUsoAnterior(props.mapas || [], props.mapa && props.mapa.id); }, [props.mapas, props.mapa && props.mapa.id]);
  var ctx = React.useMemo(function () {
    return R.criarContexto({ insumos: insumosCad, unidades: unidadesCad, aprendizados: props.aprendizados || {}, aprendizadosUnidade: props.aprendizadosUnidade || {}, mapaItens: mapaItens, usoAnterior: usoAnterior });
  }, [insumosCad, unidadesCad, props.aprendizados, props.aprendizadosUnidade, mapaItens, usoAnterior]);
  var vs = React.useMemo(function () { return linhas ? R.calcularTudo(linhas, ctx) : []; }, [linhas, ctx]);
  var nProvaveis = React.useMemo(function () { return linhas ? R.contarProvaveis(linhas, ctx) : 0; }, [linhas, ctx]);
  var aplicacao = React.useMemo(function () { return linhas ? R.montarAplicacao(linhas, ctx) : { itens: [], aprender: [], aprenderUnidade: [], pedirCadastro: [] }; }, [linhas, ctx]);

  // v14: o Banco de Cadastros pode abrir POR CIMA do robô (botão no topo e faixa da busca). Quando o cadastro muda
  // (insumo ou unidade novos, editados ou apagados), as linhas são lidas de novo com o cadastro de AGORA,
  // sem perder nenhuma escolha dele.
  var catAnterior = React.useRef({ i: insumosCad, u: unidadesCad });
  useEffect(function () {
    var antes = catAnterior.current;
    catAnterior.current = { i: insumosCad, u: unidadesCad };
    if (antes.i === insumosCad && antes.u === unidadesCad) return;
    setLinhas(function (prev) { return prev ? R.reavaliar(prev, ctx) : prev; });
  }, [insumosCad, unidadesCad]);
  // a janela do Banco devolve a rolagem da página ao fechar; com o robô ainda aberto, trava de novo.
  useEffect(function () { document.body.style.overflow = 'hidden'; }, [props.bancoAberto]);
  var abrirBanco = function () { if (props.onAbrirCadastros) props.onAbrirCadastros(); };

  // ── leitura (texto / Excel / PDF / foto) ──
  var entrar = function (res, info) {
    if (!res || !res.linhas || !res.linhas.length) { setErro('Não encontrei nenhuma linha para conferir. Confira o conteúdo e tente de novo.'); return; }
    setLinhas(res.linhas); setInfoLeitura(info); setFiltro('todas'); setNaoEnsinar({}); setPasso(2); setErro('');
  };
  var rodar = function (msg, fn) {
    setErro(''); setProcessando(msg);
    // o setTimeout deixa o aviso aparecer na tela ANTES da conferência pesada (catálogo grande)
    setTimeout(function () {
      try { fn(); } catch (err) { setErro('Não consegui ler: ' + (err && err.message ? err.message : 'erro desconhecido')); }
      setProcessando('');
    }, 30);
  };
  var lerTextoColado = function () {
    if (!texto.trim()) { setErro('Cole a relação de insumos na caixa de texto.'); return; }
    rodar('Conferindo com o cadastro...', function () {
      var r = R.lerTexto(texto, ctx);
      entrar(r, { fonte: 'Texto colado', numeracao: r.numeracao });
    });
  };
  var lerExcel = function (file) {
    setErro(''); setProcessando('Lendo a planilha...');
    var rd = new FileReader();
    rd.onerror = function () { setProcessando(''); setErro('Não foi possível abrir o arquivo.'); };
    rd.onload = function (ev) {
      setTimeout(function () {
        try {
          var wb = XLSX.read(new Uint8Array(ev.target.result), { type: 'array' });
          var aoa = null, nomePlan = '';
          for (var s = 0; s < wb.SheetNames.length && !aoa; s++) {
            var m = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[s]], { header: 1, defval: '' });
            if (m.some(function (row) { return row.some(function (c) { return String(c).trim() !== ''; }); })) { aoa = m; nomePlan = wb.SheetNames[s]; }
          }
          if (!aoa) { setProcessando(''); setErro('A planilha está vazia.'); return; }
          var pl = R.lerPlanilha(aoa, ctx), res, info;
          if (pl.texto) {
            res = R.lerTexto(aoa.map(function (row) { return row.map(function (c) { return String(c).trim(); }).filter(function (c) { return c !== ''; }).join(' '); }).filter(function (x) { return x !== ''; }).join('\n'), ctx);
            info = { fonte: 'Excel "' + file.name + '" (uma coluna só: lida como texto)' };
          } else {
            res = R.lerLinhasEstruturadas(pl.rows, ctx);
            var c = pl.colunas || {};
            info = { fonte: 'Excel "' + file.name + '" · planilha "' + nomePlan + '"', colunas: 'Quantidade: ' + (c.q >= 0 ? 'coluna ' + rbLetraColuna(c.q) : 'não achei') + ' · Unidade: ' + (c.u >= 0 ? 'coluna ' + rbLetraColuna(c.u) : 'não achei') + ' · Descrição: coluna ' + rbLetraColuna(c.d) + (pl.cabecalho >= 0 ? ' (pelo cabeçalho)' : ' (deduzidas pelo conteúdo)') };
          }
          entrar(res, info);
        } catch (err) { setErro('Não foi possível ler o arquivo. Confirme que é um Excel válido (.xlsx ou .xls).'); }
        setProcessando('');
      }, 30);
    };
    rd.readAsArrayBuffer(file);
  };
  var lerPdf = function (file) {
    if (typeof pdfjsLib === 'undefined') { setErro('O leitor de PDF não carregou. Recarregue a página e tente de novo.'); return; }
    setErro(''); setProcessando('Lendo o PDF...');
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
    var rd = new FileReader();
    rd.onerror = function () { setProcessando(''); setErro('Não foi possível abrir o arquivo.'); };
    rd.onload = function (ev) {
      pdfjsLib.getDocument({ data: new Uint8Array(ev.target.result) }).promise
        .then(function (pdf) {
          var ps = [];
          for (var p = 1; p <= pdf.numPages; p++) ps.push(pdf.getPage(p).then(function (pg) { return pg.getTextContent(); }).then(function (c) { return c.items || []; }));
          return Promise.all(ps);
        })
        .then(function (paginas) {
          var r = R.lerPdf(paginas, ctx);
          if (r.vazio) { setErro('Não encontrei texto neste PDF (pode ser uma imagem escaneada). Use a aba "Foto ou print".'); return; }
          entrar(r, { fonte: 'PDF "' + file.name + '"' + (r.estruturado ? ' (tabela com cabeçalho)' : ' (lido como texto)') });
        })
        .catch(function (err) { setErro('Erro ao ler o PDF: ' + (err && err.message ? err.message : '')); })
        .then(function () { setProcessando(''); });
    };
    rd.readAsArrayBuffer(file);
  };
  var escolherFoto = function (file) {
    if (!file) return;
    setErro(''); setFotoArq(file);
    var rd = new FileReader();
    rd.onload = function (ev) { setFotoPrev(String(ev.target.result)); };
    rd.readAsDataURL(file);
  };
  var lerFoto = function () {
    if (!fotoArq) { setErro('Escolha uma foto ou print primeiro.'); return; }
    setErro(''); setProcessando('A IA está lendo a foto... (pode levar até 45 segundos)');
    var nomeArq = fotoArq.name || 'foto.jpg', alarme = null;
    rbReduzirImagem(fotoArq, 1600).then(function (b64) {
      var ctrl = new AbortController(); alarme = setTimeout(function () { ctrl.abort(); }, 45000);
      return fetch(SUPABASE_URL + '/functions/v1/ler-lista-imagem', { method: 'POST', headers: Object.assign({}, SB, { 'Content-Type': 'application/json' }), body: JSON.stringify({ imagem_base64: b64, media_type: 'image/jpeg', filename: nomeArq }), signal: ctrl.signal });
    }).then(function (r) {
      clearTimeout(alarme);
      if (r.status === 404) throw new Error('FUNCAO_NAO_PUBLICADA');
      if (!r.ok) throw new Error('O servidor respondeu com erro (' + r.status + '). Tente novamente em instantes.');
      return r.json();
    }).then(function (data) {
      var lista = R.lerRespostaIA(data);
      try {
        var u = data.usage || {}, inp = u.input_tokens || 0, out = u.output_tokens || 0;
        buscarCotacaoDolarIA().then(function (cot) {
          return sbSaveIaUso({ fornecedor: '', arquivo: 'FOTO: ' + nomeArq, tokens_input: inp, tokens_output: out, custo_brl: ((inp * 3 + out * 15) / 1e6) * cot, itens_lidos: lista.length, obra_id: (props.mapa && props.mapa.obra) || '' });
        }).catch(function () {});
      } catch (e0) {}
      if (!lista.length) { setErro('A IA não encontrou nenhum item nessa foto. Tente uma foto mais nítida ou use o texto.'); return; }
      var res = R.lerLinhasEstruturadas(R.linhasDeIA(lista), ctx);
      entrar(res, { fonte: 'Foto "' + nomeArq + '" (lida por IA: confira cada linha)' });
    }).catch(function (e) {
      clearTimeout(alarme);
      var msg = e && e.message === 'FUNCAO_NAO_PUBLICADA' ? 'A leitura de foto ainda não foi ativada no servidor (a função "ler-lista-imagem" não está publicada no Supabase). Enquanto isso, cole o texto ou use Excel/PDF.'
        : (e && e.name === 'AbortError') ? 'A IA demorou demais para responder. Tente de novo ou use outra forma de enviar.'
          : (e instanceof TypeError) ? 'Não consegui falar com o servidor. Verifique a internet; se persistir, a função de foto pode não estar publicada no Supabase.'
            : (e && e.message) || 'Erro ao ler a foto.';
      setErro(msg);
    }).then(function () { setProcessando(''); });
  };

  // ── edição das linhas ──
  var mudarLinha = function (nova) { setLinhas(function (prev) { return prev.map(function (x) { return x.id === nova.id ? nova : x; }); }); };
  var reavaliarSem = function (chavesI, chavesU) {
    var aprI = Object.assign({}, ctx.aprendizados), aprU = Object.assign({}, ctx.aprendizadosUnidade);
    (chavesI || []).forEach(function (k) { delete aprI[k]; });
    (chavesU || []).forEach(function (k) { delete aprU[k]; });
    var ctx2 = R.criarContexto({ insumos: insumosCad, unidades: unidadesCad, aprendizados: aprI, aprendizadosUnidade: aprU, mapaItens: mapaItens, usoAnterior: usoAnterior });
    setLinhas(function (prev) { return prev ? R.reavaliar(prev, ctx2) : prev; });
  };
  var desfazerEnsinado = function (chaves) {
    if (!props.onAprendizadoRemovido) return Promise.resolve(false);
    return Promise.all(chaves.map(function (k) { return props.onAprendizadoRemovido(k); })).then(function (oks) {
      if (oks.every(function (o) { return o !== false; })) { reavaliarSem(chaves, []); return true; }
      setErro('Não foi possível desfazer agora. Verifique a conexão e tente de novo.'); return false;
    });
  };
  var confirmarTodos = function () { setLinhas(function (prev) { return R.confirmarTodosProvaveis(prev, ctx).linhas; }); };
  // Mesma unidade para várias linhas (ação do usuário, nunca automática):
  // agrupa as linhas sem unidade e as que trazem a mesma palavra de unidade fora do cadastro (ex.: "UNID").
  var chaveUnidPend = function (V) {
    if (!V || V.estado === 'ignorada' || V.estado === 'fora') return null;
    var p = V.pendencias || [];
    if (p.indexOf('unidade-falta') >= 0) return '#falta';
    if ((p.indexOf('unidade-sugerida') >= 0 || p.indexOf('unidade-desconhecida') >= 0) && V.hipotese && V.hipotese.unid) return R.chaveUnid(V.hipotese.unid);
    return null;
  };
  var gruposUn = [];
  if (linhas) {
    var _gm = {};
    vs.forEach(function (V) {
      var k = chaveUnidPend(V); if (!k) return;
      var g = _gm[k];
      if (!g) { g = _gm[k] = { chave: k, texto: k === '#falta' ? '' : V.hipotese.unid, n: 0, sug: (V.u && V.u.sugestoes) || [] }; gruposUn.push(g); }
      g.n++;
    });
  }
  var unidadeDoGrupo = function (g) {
    var v = unidadeLote[g.chave];
    if (v && ctx.unidIdx.reg[R.chaveUnid(v)]) return ctx.unidIdx.reg[R.chaveUnid(v)];
    if (g.chave === '#falta') return ctx.unidIdx.reg['UN'] || (unidadesCad[0] || '');
    return (g.sug && g.sug[0]) || '';
  };
  var aplicarUnidadeGrupo = function (g) {
    var un = unidadeDoGrupo(g);
    if (!un) return;
    setLinhas(function (prev) {
      var vv = R.calcularTudo(prev, ctx);
      return prev.map(function (L, i) { return chaveUnidPend(vv[i]) === g.chave ? A.escolherUnidade(L, un) : L; });
    });
  };

  // ── saída / aplicar ──
  var tentarFechar = function () {
    if (linhas && passo >= 2 && !aplicando) setConfirmandoSaida(true); else props.onClose();
  };
  var aplicar = function () {
    if (aplicando || !aplicacao.itens.length) return;
    setAplicando(true);
    try {
      aplicacao.aprender.forEach(function (x) { if (!naoEnsinar['i|' + x.texto] && props.onRegistrarAprendizado) props.onRegistrarAprendizado(x.texto, x.oficial); });
      aplicacao.aprenderUnidade.forEach(function (x) { if (!naoEnsinar['u|' + x.texto] && props.onRegistrarAprendizadoUnidade) props.onRegistrarAprendizadoUnidade(x.texto, x.oficial); });
      props.onConfirmar(aplicacao.itens);
    } catch (err) { setAplicando(false); setErro('Não foi possível aplicar: ' + (err && err.message ? err.message : 'erro')); }
  };

  // ── números do passo 2 ──
  var cont = { lidos: 0, certos: 0, conferir: 0, nao: 0, fora: 0, ignoradas: 0, riscadas: 0, marcados: 0 };
  vs.forEach(function (V) {
    if (V.estado === 'ignorada') { if (V.motivo === 'riscada') cont.riscadas++; else cont.ignoradas++; return; }
    cont.lidos++;
    if (V.estado === 'certo' || V.estado === 'resolvida') cont.certos++;
    else if (V.estado === 'nao') cont.nao++;
    else if (V.estado === 'fora') cont.fora++;
    else cont.conferir++;
    if (V.incluir) cont.marcados++;
  });
  var resolvidas = cont.certos + cont.fora;
  var buscaLinha = null;
  if (buscaId && linhas) linhas.forEach(function (L, i) { if (L.id === buscaId) buscaLinha = { L: L, V: vs[i] }; });

  // ── blocos de tela ──
  var cabecalho = function (titulo, sub) {
    return h('div', { className: 'rb-hdr' },
      h('div', { style: { width: 42, height: 42, borderRadius: 10, background: RB.navy, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' } }, rbIco('robo', 24)),
      h('div', { style: { flex: 1, minWidth: 0 } }, h('div', { style: { fontSize: 20, fontWeight: 700 } }, titulo), h('div', { style: { fontSize: 13, color: RB.mute, marginTop: 2, lineHeight: 1.4 } }, sub)),
      props.onAbrirCadastros && h('button', { type: 'button', className: 'rb-btn', 'data-rb': 'abrir-banco', 'aria-label': 'Banco de cadastros', title: 'Abrir o Banco de Cadastros (insumos, fornecedores, unidades e obras) sem sair do robô', onClick: abrirBanco, style: { flex: 'none' } }, rbIco('pasta', 18), h('span', { className: 'rb-hide-m' }, 'Banco de cadastros')),
      h('button', { type: 'button', 'aria-label': 'Fechar', onClick: tentarFechar, style: { width: 44, height: 44, border: 0, background: RB.soft, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' } }, rbIco('fechar', 18)));
  };
  var passos = function () {
    var nomes = ['Enviar a relação', 'Conferir cada insumo', 'Aplicar no mapa'];
    var els = [];
    nomes.forEach(function (n, i) {
      var num = i + 1, feito = passo > num, atual = passo === num;
      if (i > 0) els.push(h('div', { key: 'l' + i, style: { flex: 1, height: 2, background: passo > i ? RB.verde : RB.line3, margin: '0 10px', minWidth: 10 } }));
      els.push(h('div', { key: 'p' + i, style: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, whiteSpace: 'nowrap' } },
        h('div', { style: { width: 26, height: 26, borderRadius: 13, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, background: feito ? RB.verde : atual ? RB.navy : '#fff', color: feito || atual ? '#fff' : RB.mute, border: feito || atual ? 'none' : '2px solid ' + RB.line3 } }, feito ? rbIco('check', 14) : num),
        h('span', { className: atual ? '' : 'rb-hide-m', style: { fontWeight: atual ? 700 : 400, color: atual ? RB.ink : RB.mute } }, n)));
    });
    return h('div', { style: { display: 'flex', alignItems: 'center', padding: '12px 24px', background: RB.soft2, borderBottom: '1px solid ' + RB.line, flex: 'none' } }, els);
  };

  // ---------- PASSO 1 ----------
  var corpoPasso1 = function () {
    var abas = [['colar', 'Colar texto (WhatsApp)'], ['excel', 'Arquivo Excel'], ['pdf', 'Arquivo PDF'], ['foto', 'Foto ou print']];
    var conteudo;
    if (aba === 'colar') {
      conteudo = h(React.Fragment, null,
        h('div', { style: { fontWeight: 700, fontSize: 14, marginBottom: 8 } }, 'Relação enviada (uma linha por insumo, em qualquer ordem: quantidade, unidade e descrição)'),
        h('textarea', { 'aria-label': 'Relação de insumos', value: texto, onChange: function (ev) { setTexto(ev.target.value); }, placeholder: '- 40l de gasolina\n- 8 camisa M\n- 3 par de bota de segurança N41\n- 6.pneu de carro de mao 3.25', className: 'rb-mono', style: { width: '100%', minHeight: 250, border: '1px solid ' + RB.line3, borderRadius: 10, padding: 14, fontSize: 14, lineHeight: 1.7, color: RB.ink, resize: 'vertical' } }),
        h('div', { style: { fontSize: 13, color: RB.mute, lineHeight: 1.6, marginTop: 10 } }, 'Cole do jeito que chegou. Pode vir com "-" na frente, a quantidade no começo ou no fim, a unidade colada ("40l") ou sem unidade. Saudação e linhas sem item aparecem na conferência como ignoradas.'));
    } else if (aba === 'excel') {
      conteudo = h(React.Fragment, null,
        h('label', { style: { display: 'block', border: '2px dashed ' + RB.line3, borderRadius: 12, padding: '44px 20px', textAlign: 'center', fontSize: 15, fontWeight: 700, color: RB.navy, cursor: 'pointer', background: RB.soft2 } }, '📊 Clique aqui para escolher o arquivo Excel',
          h('div', { style: { fontSize: 13, fontWeight: 400, color: RB.mute, marginTop: 8, lineHeight: 1.5 } }, 'As colunas podem estar em qualquer ordem: o sistema acha Quantidade, Unidade e Descrição pelo cabeçalho ou pelo conteúdo.'),
          h('input', { type: 'file', accept: '.xlsx,.xls,.csv', style: { display: 'none' }, onChange: function (ev) { var f = ev.target.files[0]; ev.target.value = ''; if (f) lerExcel(f); } })));
    } else if (aba === 'pdf') {
      conteudo = h(React.Fragment, null,
        h('label', { style: { display: 'block', border: '2px dashed ' + RB.line3, borderRadius: 12, padding: '44px 20px', textAlign: 'center', fontSize: 15, fontWeight: 700, color: RB.navy, cursor: 'pointer', background: RB.soft2 } }, '📄 Clique aqui para escolher o arquivo PDF',
          h('div', { style: { fontSize: 13, fontWeight: 400, color: RB.mute, marginTop: 8, lineHeight: 1.5 } }, 'Lê o texto do PDF (sem IA, sem custo). PDF escaneado (só imagem) não tem texto: use "Foto ou print".'),
          h('input', { type: 'file', accept: '.pdf,application/pdf', style: { display: 'none' }, onChange: function (ev) { var f = ev.target.files[0]; ev.target.value = ''; if (f) lerPdf(f); } })));
    } else {
      conteudo = h(React.Fragment, null,
        h('div', { tabIndex: 0, onPaste: function (ev) { var its = (ev.clipboardData && ev.clipboardData.items) || []; for (var k = 0; k < its.length; k++) { if (its[k].kind === 'file' && /^image\//.test(its[k].type)) { escolherFoto(its[k].getAsFile()); ev.preventDefault(); break; } } }, style: { border: '2px dashed ' + RB.line3, borderRadius: 12, padding: 20, textAlign: 'center', background: RB.soft2 } },
          fotoPrev ? h('img', { src: fotoPrev, alt: 'Foto escolhida', style: { maxWidth: '100%', maxHeight: 260, borderRadius: 8 } }) : h('div', { style: { fontSize: 15, fontWeight: 700, color: RB.navy, padding: '18px 0' } }, '📷 Escolha uma foto ou print, ou cole um print aqui (Ctrl+V)'),
          h('div', { style: { marginTop: 12, display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' } },
            h('label', { className: 'rb-btn', style: { cursor: 'pointer' } }, fotoPrev ? 'Trocar a imagem' : 'Escolher imagem',
              h('input', { type: 'file', accept: 'image/*', style: { display: 'none' }, onChange: function (ev) { var f = ev.target.files[0]; ev.target.value = ''; if (f) escolherFoto(f); } })),
            fotoPrev && h('button', { type: 'button', className: 'rb-btn rb-btn-p', onClick: lerFoto, disabled: !!processando }, 'Ler a imagem com IA'))),
        h('div', { style: { fontSize: 13, color: RB.mute, lineHeight: 1.6, marginTop: 10 } }, 'A IA lê o texto da imagem e você confere cada linha no passo seguinte. O que estiver riscado fica de fora. Esta leitura usa IA e o custo entra no uso diário, como "Ler com IA".'));
    }
    return h('div', { className: 'rb-body' },
      h('div', { style: { display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' } },
        h('div', { style: { flex: '1 1 420px', minWidth: 0 } },
          h('div', { className: 'rb-tabs', role: 'tablist' }, abas.map(function (a) { return h('button', { key: a[0], type: 'button', role: 'tab', 'aria-selected': aba === a[0], className: 'rb-tab' + (aba === a[0] ? ' rb-on' : ''), onClick: function () { setAba(a[0]); setErro(''); } }, a[1]); })),
          conteudo,
          processando && h('div', { role: 'status', style: { marginTop: 12, padding: '12px 14px', borderRadius: 8, background: RB.azulBg, border: '1px solid ' + RB.azulBd, fontWeight: 700, fontSize: 14 } }, '⏳ ' + processando),
          erro && h('div', { role: 'alert', style: { marginTop: 12, padding: '12px 14px', borderRadius: 8, background: RB.vermBg, border: '1px solid ' + RB.vermBd, color: RB.verm, fontSize: 14, lineHeight: 1.45 } }, erro)),
        h('div', { className: 'rb-hide-m', style: { flex: '0 1 340px', border: '1px solid ' + RB.line, borderRadius: 12, padding: '18px 20px', background: RB.soft2 } },
          h('div', { style: { fontWeight: 700, fontSize: 16, marginBottom: 12 } }, 'Como cada linha é conferida'),
          h('div', { style: { marginBottom: 14 } }, rbChip('certo', 'CERTO'), h('div', { style: { fontSize: 13.5, color: '#3a4458', marginTop: 6, lineHeight: 1.5 } }, 'Descrição igual à do cadastro (sem contar acento, plural e maiúscula), ou texto que você já ensinou ao sistema.')),
          h('div', { style: { marginBottom: 14 } }, rbChip('conferir', 'CONFERIR'), h('div', { style: { fontSize: 13.5, color: '#3a4458', marginTop: 6, lineHeight: 1.5 } }, 'Insumo provável (você confirma com 1 clique, ou todos de uma vez), número ou medida diferente, vários candidatos, sem quantidade ou unidade fora do cadastro. Você decide.')),
          h('div', { style: { marginBottom: 14 } }, rbChip('nao', 'NÃO ENCONTRADO'), h('div', { style: { fontSize: 13.5, color: '#3a4458', marginTop: 6, lineHeight: 1.5 } }, 'Nada parecido. Você busca em todo o cadastro ou deixa de fora. Não entra no mapa sozinho.')),
          h('div', { style: { borderTop: '1px solid ' + RB.line, paddingTop: 12 } }, h('div', { style: { fontWeight: 700, fontSize: 14 } }, 'Nada é gravado até o passo 3.'), h('div', { style: { fontSize: 13, color: RB.mute, marginTop: 4, lineHeight: 1.5 } }, 'Os preços continuam entrando pelo upload dos orçamentos, como hoje.')))));
  };
  var rodapePasso1 = function () {
    return h('div', { className: 'rb-ftr' },
      h('div', { className: 'rb-ftr-txt', style: { display: 'flex', alignItems: 'center', gap: 8, color: RB.mute } }, rbIco('cadeado', 17), 'Nesta etapa nada é gravado no mapa.'),
      h('button', { type: 'button', className: 'rb-btn', onClick: tentarFechar }, 'Cancelar'),
      linhas && h('button', { type: 'button', className: 'rb-btn', onClick: function () { setPasso(2); } }, 'Voltar à conferência'),
      aba === 'colar' && h('button', { type: 'button', className: 'rb-btn rb-btn-p', onClick: lerTextoColado, disabled: !!processando || !texto.trim() }, 'Conferir com o cadastro', rbIco('seta', 17)));
  };

  // ---------- PASSO 2 ----------
  var corpoPasso2 = function () {
    var visiveis = [], ignoradas = [];
    linhas.forEach(function (L, i) {
      var V = vs[i];
      if (V.estado === 'ignorada' && V.motivo !== 'riscada') { ignoradas.push({ L: L, V: V }); return; }
      var passa = filtro === 'todas' || (filtro === 'precisam' && (V.estado === 'conferir' || V.estado === 'nao')) || (filtro === 'certas' && (V.estado === 'certo' || V.estado === 'resolvida'));
      if (passa) visiveis.push({ L: L, V: V });
    });
    var nPrecisam = cont.conferir + cont.nao;
    var chipN = function (n, rot, est) { var c = { certo: [RB.verdeBg, RB.verdeBd, RB.verdeTx, 'check'], conferir: [RB.amarBg, RB.amarBd, RB.amarTx, 'aviso'], nao: [RB.vermBg, RB.vermBd, RB.verm, 'xcirc'] }[est]; return h('div', { style: { padding: '10px 18px', borderRadius: 10, background: c[0], border: '1px solid ' + c[1], display: 'flex', alignItems: 'center', gap: 10, color: c[2] } }, rbIco(c[3], 20), h('span', { style: { fontSize: 24, fontWeight: 700 } }, n), h('span', { style: { fontSize: 13, fontWeight: 800, letterSpacing: '.03em' } }, rot)); };
    return h('div', { className: 'rb-body' },
      h('div', { style: { display: 'flex', alignItems: 'stretch', gap: 12, flexWrap: 'wrap' } },
        h('div', { style: { padding: '10px 18px', borderRadius: 10, background: RB.soft, border: '1px solid ' + RB.line2, display: 'flex', alignItems: 'baseline', gap: 8 } }, h('span', { style: { fontSize: 26, fontWeight: 700 } }, cont.lidos), h('span', { style: { fontSize: 13, color: '#3a4458', fontWeight: 600 } }, 'insumos lidos')),
        chipN(cont.certos, 'CERTOS', 'certo'), chipN(cont.conferir, 'PARA CONFERIR', 'conferir'), chipN(cont.nao, 'NÃO ENCONTRADO', 'nao'),
        cont.fora > 0 && h('div', { style: { padding: '10px 18px', borderRadius: 10, background: RB.soft, border: '1px solid ' + RB.line2, display: 'flex', alignItems: 'baseline', gap: 8 } }, h('span', { style: { fontSize: 24, fontWeight: 700 } }, cont.fora), h('span', { style: { fontSize: 13, fontWeight: 800 } }, 'DE FORA')),
        h('div', { style: { flex: 1 } }),
        h('div', { style: { alignSelf: 'center', fontSize: 12, color: RB.mute, textAlign: 'right', lineHeight: 1.5 } }, linhas.length + ' linhas lidas', h('br'), cont.lidos + ' insumos', h('br'), (cont.ignoradas + cont.riscadas) + (cont.ignoradas + cont.riscadas === 1 ? ' ignorada' : ' ignoradas'))),
      infoLeitura && h('div', { style: { marginTop: 10, fontSize: 12.5, color: RB.mute, lineHeight: 1.5 } }, 'Origem: ' + infoLeitura.fonte + (infoLeitura.colunas ? ' — ' + infoLeitura.colunas : '') + '.'),
      infoLeitura && infoLeitura.numeracao && h('div', { style: { marginTop: 8, padding: '10px 14px', borderRadius: 8, background: RB.azulBg, border: '1px solid ' + RB.azulBd, fontSize: 13.5, lineHeight: 1.5 } }, h('b', null, 'A lista está numerada (1, 2, 3...). '), 'Os números do começo foram tomados como numeração, não como quantidade. Digite a quantidade de cada linha.'),
      h('div', { style: { marginTop: 14, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' } },
        h('div', { className: 'rb-seg', role: 'tablist' }, [['todas', 'Todas (' + (linhas.length - cont.ignoradas) + ')'], ['precisam', 'Precisam de você (' + nPrecisam + ')'], ['certas', 'Certas (' + cont.certos + ')']].map(function (f) { return h('button', { key: f[0], type: 'button', role: 'tab', 'aria-selected': filtro === f[0], className: filtro === f[0] ? 'rb-on' : '', onClick: function () { setFiltro(f[0]); } }, f[1]); })),
        h('div', { style: { flex: 1, minWidth: 180 } },
          h('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, color: '#3a4458' } }, h('span', null, 'Resolvidas: ' + resolvidas + ' de ' + cont.lidos), h('span', null, 'faltam ' + Math.max(0, cont.lidos - resolvidas))),
          h('div', { style: { marginTop: 5, height: 8, borderRadius: 4, background: RB.line2 } }, h('div', { style: { width: (cont.lidos ? Math.round(100 * resolvidas / cont.lidos) : 0) + '%', height: 8, borderRadius: 4, background: RB.verde } }))),
        h('button', { type: 'button', className: 'rb-btn rb-btn-s', onClick: function () { setVendoAprendidos(true); } }, rbIco('lampada', 16), 'O que o sistema já aprendeu')),
      nProvaveis > 0 && h('div', { style: { marginTop: 14, padding: '12px 16px', borderRadius: 10, border: '1px dashed ' + RB.amarBd, background: RB.amarCard, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' } },
        h('div', { style: { flex: 1, minWidth: 220, fontSize: 13.5, lineHeight: 1.5, color: '#3a4458' } }, h('b', { style: { color: RB.amarTx } }, nProvaveis + (nProvaveis === 1 ? ' insumo provável forte' : ' insumos prováveis fortes')), (nProvaveis === 1 ? ' pode' : ' podem') + ' ser confirmados de uma vez (quase tudo confere e não sobrou palavra sem par). Confira a sugestão de cada linha antes. Os prováveis fracos ficam para você confirmar um a um. Nada entra no mapa antes do Aplicar.'),
        h('button', { type: 'button', className: 'rb-btn rb-btn-p', onClick: confirmarTodos }, 'Confirmar os prováveis fortes (' + nProvaveis + ')')),
      unidadesCad.length > 0 && gruposUn.filter(function (g) { return g.n >= 2; }).map(function (g) {
        var un = unidadeDoGrupo(g), falta = g.chave === '#falta';
        return h('div', { key: g.chave, 'data-banner': falta ? 'unidade-lote' : 'unidade-lote-' + g.chave, style: { marginTop: 10, padding: '12px 16px', borderRadius: 10, border: '1px dashed ' + RB.line3, background: '#fff', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' } },
          h('div', { style: { flex: 1, minWidth: 220, fontSize: 13.5, lineHeight: 1.5, color: '#3a4458' } },
            falta ? [h('b', { key: 'a' }, g.n + ' linhas vieram sem unidade. '), 'Se for a mesma para todas, escolha ao lado e aplique de uma vez. Você ainda pode trocar linha por linha.']
              : [h('b', { key: 'a' }, '"' + g.texto + '" aparece em ' + g.n + ' linhas '), 'e não está no cadastro de unidades.' + (g.sug.length ? ' Sugestão do sistema: ' + g.sug.join(', ') + '.' : '') + ' Escolha a unidade cadastrada que vale para todas. Você ainda pode trocar linha por linha.']),
          h('select', { 'aria-label': falta ? 'Unidade para as linhas sem unidade' : 'Unidade para as linhas com "' + g.texto + '"', value: un, onChange: function (ev) { var n2 = Object.assign({}, unidadeLote); n2[g.chave] = ev.target.value; setUnidadeLote(n2); }, className: 'rb-in', style: { width: 120, height: 36, fontSize: 13, fontWeight: 800, padding: '0 6px' } },
            !un && h('option', { value: '' }, 'Escolher...'), unidadesCad.map(function (u) { return h('option', { key: u, value: u }, u); })),
          h('button', { type: 'button', className: 'rb-btn', disabled: !un, onClick: function () { aplicarUnidadeGrupo(g); } }, un ? 'Usar ' + un + ' nas ' + g.n + ' linhas' : 'Escolha uma unidade'));
      }),
      erro && h('div', { role: 'alert', style: { marginTop: 12, padding: '10px 14px', borderRadius: 8, background: RB.vermBg, border: '1px solid ' + RB.vermBd, color: RB.verm, fontSize: 13.5 } }, erro),
      h('div', { className: 'rb-colhead' }, h('div'), h('div', { style: { padding: '0 12px' } }, 'VOCÊ ENVIOU'), h('div', { style: { padding: '0 12px' } }, 'QTD · UN'), h('div', { style: { padding: '0 12px' } }, 'NO CADASTRO DO SISTEMA'), h('div', { style: { padding: '0 12px' } }, 'SITUAÇÃO')),
      visiveis.length === 0 && h('div', { style: { padding: 24, textAlign: 'center', color: RB.mute, fontSize: 14 } }, 'Nenhuma linha neste filtro.'),
      visiveis.map(function (o) { return h(RoboLinha, { key: o.L.id, L: o.L, V: o.V, ctx: ctx, onMudar: mudarLinha, onBuscar: function (LL) { setBuscaId(LL.id); }, onDesfazerEnsinado: desfazerEnsinado }); }),
      filtro === 'todas' && ignoradas.length > 0 && h('div', { style: { margin: '6px 0 14px', padding: '12px 14px', border: '1px dashed ' + RB.line3, borderRadius: 10, background: '#fff' } },
        h('div', { style: { fontWeight: 800, fontSize: 13.5, marginBottom: 6 } }, ignoradas.length + (ignoradas.length === 1 ? ' linha ignorada' : ' linhas ignoradas') + ' (sem quantidade, unidade e insumo):'),
        ignoradas.map(function (o) { return h('div', { key: o.L.id, style: { display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', flexWrap: 'wrap', borderTop: '1px solid ' + RB.line } }, h('div', { style: { flex: 1, minWidth: 200, fontSize: 13.5 } }, h('span', { style: { color: RB.mute } }, 'Linha ' + o.L.n + ': '), '"' + ((o.L.original || '').trim()) + '"'), rbBtn('Tratar como insumo', function () { mudarLinha(A.tratarComoInsumo(o.L)); })); })));
  };
  var rodapePasso2 = function () {
    var resto = cont.lidos - cont.marcados;
    return h('div', { className: 'rb-ftr' },
      h('div', { className: 'rb-ftr-txt' }, h('b', null, 'Marcados para o mapa: ' + cont.marcados + ' de ' + cont.lidos + '.'), resto > 0 ? ' Os outros ' + resto + ' aguardam sua decisão e ficam de fora até você resolver.' : ' Tudo resolvido.', h('div', { style: { color: RB.mute } }, 'Nada foi gravado no mapa ainda.')),
      h('button', { type: 'button', className: 'rb-btn', onClick: function () { setPasso(1); } }, 'Voltar'),
      h('button', { type: 'button', className: 'rb-btn rb-btn-p', onClick: function () { setPasso(3); setErro(''); } }, 'Continuar: resumo final', rbIco('seta', 17)));
  };

  // ---------- PASSO 3 ----------
  var corpoPasso3 = function () {
    var entram = [], fora = [];
    linhas.forEach(function (L, i) {
      var V = vs[i];
      if (V.estado === 'ignorada') return;
      if (V.incluir && V.completo) { entram.push({ L: L, V: V }); return; }
      fora.push({ L: L, V: V });
    });
    var nAprender = aplicacao.aprender.filter(function (x) { return !naoEnsinar['i|' + x.texto]; }).length + aplicacao.aprenderUnidade.filter(function (x) { return !naoEnsinar['u|' + x.texto]; }).length;
    var cartao = function (n, rot, bg, bd, cor2) { return h('div', { style: { flex: '1 1 200px', padding: '16px 20px', borderRadius: 10, background: bg, border: '1px solid ' + bd } }, h('div', { style: { fontSize: 32, fontWeight: 700, color: cor2 } }, n), h('div', { style: { fontSize: 14, fontWeight: 800, marginTop: 4 } }, rot)); };
    var titulo = function (t) { return h('div', { style: { fontSize: 12, fontWeight: 800, letterSpacing: '.05em', color: RB.mute, margin: '20px 0 8px', textTransform: 'uppercase' } }, t); };
    var tx = function (it) { return it.qtd + ' ' + (it.unid || '') + ' ' + it.descricao; };
    var textoCadastrar = aplicacao.pedirCadastro.map(function (c) { return (c.qtd || '?') + ' ' + (c.unid || '') + ' ' + c.desc; }).join('\n');
    return h('div', { className: 'rb-body' },
      h('div', { style: { display: 'flex', gap: 14, flexWrap: 'wrap' } },
        cartao(aplicacao.itens.length, aplicacao.itens.length === 1 ? 'insumo entra no mapa' : 'insumos entram no mapa', RB.verdeCard, RB.verdeCardBd, RB.verdeTx),
        cartao(fora.length, fora.length === 1 ? 'fica de fora' : 'ficam de fora', RB.vermCard, RB.vermCardBd, RB.verm),
        cartao(nAprender, nAprender === 1 ? 'coisa que o sistema vai aprender' : 'coisas que o sistema vai aprender', RB.azulBg, RB.azulBd, RB.navy)),
      h('div', { style: { display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' } },
        h('div', { style: { flex: '2 1 460px', minWidth: 0 } },
          titulo('Vai para o mapa (quantidade, unidade e descrição)'),
          aplicacao.itens.length === 0 ? h('div', { style: { padding: 16, border: '1px solid ' + RB.line2, borderRadius: 10, color: RB.mute, fontSize: 14 } }, 'Nenhum insumo marcado. Volte e resolva as linhas, ou marque as que estão prontas.') :
            h('div', { style: { border: '1px solid ' + RB.line2, borderRadius: 10, overflow: 'hidden' } }, entram.map(function (o, i) {
              var e = o.V.hipotese, nota = '';
              if (o.V.unidade.via === 'escolhida' && e.unid && R.chaveUnid(e.unid) !== R.chaveUnid(o.V.unidade.oficial)) nota = 'você escreveu "' + e.unid + '" e escolheu ' + o.V.unidade.oficial;
              else if (o.V.insumo.via === 'escolhido') nota = 'você escreveu "' + (e.descCompleta || e.desc) + '"';
              return h('div', { key: o.L.id, style: { display: 'grid', gridTemplateColumns: '64px 64px minmax(0,1fr)', gap: 8, padding: '10px 14px', borderTop: i ? '1px solid ' + RB.line : 'none', alignItems: 'center', fontSize: 15 } }, h('b', null, o.V.qtd.valor), h('b', null, o.V.unidade.oficial), h('div', null, h('b', null, o.V.insumo.oficial), nota && h('div', { style: { fontSize: 12.5, color: RB.mute, marginTop: 2 } }, nota)));
            })),
          (aplicacao.aprender.length + aplicacao.aprenderUnidade.length) > 0 && h('div', null,
            titulo('O sistema vai aprender (' + (aplicacao.aprender.length + aplicacao.aprenderUnidade.length) + ')'),
            h('div', { style: { border: '1px solid ' + RB.line2, borderRadius: 10, padding: '4px 14px' } },
              aplicacao.aprender.map(function (x) { var k = 'i|' + x.texto; return h('div', { key: k }, rbCaixinha(!naoEnsinar[k], function (v) { var n = Object.assign({}, naoEnsinar); n[k] = !v; setNaoEnsinar(n); }, '"' + x.texto + '" vale ' + x.oficial, null)); }),
              aplicacao.aprenderUnidade.map(function (x) { var k = 'u|' + x.texto; return h('div', { key: k }, rbCaixinha(!naoEnsinar[k], function (v) { var n = Object.assign({}, naoEnsinar); n[k] = !v; setNaoEnsinar(n); }, 'Unidade "' + x.texto + '" vale ' + x.oficial, null)); }),
              h('div', { style: { height: 8 } })),
            h('div', { style: { fontSize: 12.5, color: RB.mute, marginTop: 6 } }, 'Desmarque o que não quiser ensinar. Na próxima relação, as frases marcadas já aparecem como CERTO.'))),
        h('div', { style: { flex: '1 1 280px', minWidth: 0 } },
          titulo('Fica de fora (' + fora.length + ')'),
          fora.length === 0 ? h('div', { style: { padding: 14, border: '1px solid ' + RB.line2, borderRadius: 10, fontSize: 14, color: RB.mute } }, 'Nada ficou de fora.') :
            h('div', { style: { border: '1px solid ' + RB.vermCardBd, borderRadius: 10, background: RB.vermCard, padding: '4px 14px', maxHeight: 360, overflowY: 'auto' } }, fora.map(function (o, i) {
              var e = o.V.hipotese || {};
              return h('div', { key: o.L.id, style: { padding: '10px 0', borderTop: i ? '1px solid ' + RB.vermCardBd : 'none' } }, h('div', { style: { fontWeight: 800, fontSize: 14 } }, ((e.qtd || '?') + ' ' + (e.unid || '') + ' ' + (e.descCompleta || e.desc || o.L.texto)).toUpperCase()), h('div', { style: { fontSize: 13, color: RB.mute, marginTop: 2 } }, rbMotivoFora(o.V, o.L)));
            })),
          h('button', { type: 'button', className: 'rb-btn', style: { width: '100%', marginTop: 10 }, onClick: function () { setPasso(2); setFiltro('precisam'); } }, 'Voltar e decidir os que ficaram de fora'),
          aplicacao.pedirCadastro.length > 0 && h('div', null,
            titulo('Para cadastrar (' + aplicacao.pedirCadastro.length + ')'),
            h('div', { style: { border: '1px solid ' + RB.azulBd, borderRadius: 10, background: RB.azulBg, padding: '10px 14px' } },
              aplicacao.pedirCadastro.map(function (c, i) { return h('div', { key: i, style: { fontSize: 13.5, padding: '3px 0', fontWeight: 700 } }, ((c.qtd || '?') + ' ' + (c.unid || '') + ' ' + c.desc).toUpperCase()); }),
              h('div', { style: { marginTop: 8 } }, rbBtn(copiado ? 'Copiado!' : 'Copiar esta lista', function () { rbCopiar(textoCadastrar).then(function () { setCopiado('ok'); setTimeout(function () { setCopiado(''); }, 2500); }).catch(function () { setErro('Não consegui copiar automaticamente. Selecione e copie o texto à mão.'); }); })))),
          titulo('Próximo passo'),
          h('div', { style: { border: '1px solid ' + RB.azulBd, borderRadius: 10, background: RB.azulBg, padding: '12px 14px', fontSize: 14, lineHeight: 1.55 } }, 'Depois de aplicar, lance os preços ', h('b', null, 'como hoje'), ': carregue os orçamentos dos fornecedores em "Ler com IA" ou "Ler grátis".'))),
      erro && h('div', { role: 'alert', style: { marginTop: 12, padding: '10px 14px', borderRadius: 8, background: RB.vermBg, border: '1px solid ' + RB.vermBd, color: RB.verm, fontSize: 13.5 } }, erro));
  };
  var rodapePasso3 = function () {
    var n = aplicacao.itens.length;
    return h('div', { className: 'rb-ftr' },
      h('div', { className: 'rb-ftr-txt' }, h('b', null, 'O mapa só é alterado ao clicar em Aplicar.'), h('div', { style: { color: RB.mute } }, 'Depois você confere item a item, como sempre.')),
      h('button', { type: 'button', className: 'rb-btn', onClick: function () { setPasso(2); }, disabled: aplicando }, 'Voltar'),
      h('button', { type: 'button', className: 'rb-btn rb-btn-v', onClick: aplicar, disabled: aplicando || n === 0 }, rbIco('check', 17), aplicando ? 'Aplicando...' : (n === 0 ? 'Nada para aplicar' : 'Aplicar ' + n + (n === 1 ? ' insumo' : ' insumos') + ' no mapa')));
  };

  var tit = passo === 1 ? ['Robô de preenchimento do mapa', 'Cole a relação de insumos. O sistema confere cada linha com o cadastro antes de qualquer coisa entrar no mapa.']
    : passo === 2 ? ['Conferir cada insumo com o cadastro', 'Todas as ' + (linhas ? linhas.length : 0) + ' linhas aparecem aqui, inclusive as certas. Nada some da tela.']
      : ['Resumo final: confira antes de aplicar', 'É a última chance de revisar. Só depois do botão verde o mapa é alterado.'];

  return h(React.Fragment, null,
    h('style', null, RB_CSS),
    h('div', { className: 'rb-ov' },
      h('div', { className: 'rb-modal', role: 'dialog', 'aria-label': 'Robô de preenchimento do mapa' },
        cabecalho(tit[0], tit[1]), passos(),
        passo === 1 ? corpoPasso1() : passo === 2 ? corpoPasso2() : corpoPasso3(),
        passo === 1 ? rodapePasso1() : passo === 2 ? rodapePasso2() : rodapePasso3())),
    buscaLinha && h(RoboBusca, {
      L: buscaLinha.L, V: buscaLinha.V, ctx: ctx,
      onAbrirCadastros: props.onAbrirCadastros ? abrirBanco : null,
      onFechar: function () { setBuscaId(null); },
      onPedirCadastro: function () { mudarLinha(A.pedirCadastro(buscaLinha.L)); setBuscaId(null); },
      onUsar: function (nome, modo) {
        var Lb = buscaLinha.L;
        mudarLinha(modo === 'numero' ? A.aceitarNumeroDiferente(Lb, nome) : A.escolherInsumo(Lb, nome, modo === 'ensinar'));
        setBuscaId(null);
      }
    }),
    vendoAprendidos && h(RoboAprendidos, {
      aprendizados: props.aprendizados || {}, aprendizadosUnidade: props.aprendizadosUnidade || {},
      onFechar: function () { setVendoAprendidos(false); },
      onDesfazerInsumo: props.onAprendizadoRemovido ? function (k) { return Promise.resolve(props.onAprendizadoRemovido(k)).then(function (ok) { if (ok !== false) reavaliarSem([k], []); return ok; }); } : null,
      onDesfazerUnidade: props.onAprendizadoUnidadeRemovido ? function (k) { return Promise.resolve(props.onAprendizadoUnidadeRemovido(k)).then(function (ok) { if (ok !== false) reavaliarSem([], [k]); return ok; }); } : null
    }),
    confirmandoSaida && h('div', { className: 'rb-ov', style: { zIndex: 120 } },
      h('div', { className: 'rb-modal', role: 'alertdialog', 'aria-label': 'Sair sem aplicar', style: { maxWidth: 460, padding: 24 } },
        h('div', { style: { fontSize: 18, fontWeight: 700 } }, 'Sair sem aplicar?'),
        h('div', { style: { fontSize: 14, color: '#3a4458', marginTop: 8, lineHeight: 1.5 } }, 'Nada foi gravado no mapa. As escolhas feitas nesta tela serão perdidas.'),
        h('div', { style: { display: 'flex', gap: 10, marginTop: 18, justifyContent: 'flex-end', flexWrap: 'wrap' } },
          h('button', { type: 'button', className: 'rb-btn', onClick: function () { setConfirmandoSaida(false); } }, 'Continuar aqui'),
          h('button', { type: 'button', className: 'rb-btn rb-btn-p', onClick: props.onClose }, 'Sair sem aplicar')))));
}
