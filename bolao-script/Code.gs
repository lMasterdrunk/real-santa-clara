/**
 * BOLÃO X1 DO SANTA — script do Google (Apps Script)
 *
 * Cole este código em uma planilha do Google: Extensões > Apps Script.
 * Depois: Implantar > Nova implantação > Tipo "App da Web"
 *   - Executar como: Eu
 *   - Quem tem acesso: Qualquer pessoa
 * Copie o endereço que termina em /exec e coloque em bolao.endpoint no data.js.
 *
 * CHAVE DO ORGANIZADOR (página gerenciamentobolao.html, sem tela de login):
 *   Apps Script > Configurações do projeto (engrenagem) > Propriedades do script
 *   > Adicionar propriedade:  ADMIN_KEY  =  uma chave longa e aleatória (ex.: 24 letras e números).
 *   O organizador abre: https://www.x1dosanta.com/gerenciamentobolao.html#SUA_CHAVE
 *   A chave fica só no script e no link do organizador, nunca no repositório do site.
 *
 * Colunas da aba "Palpites":  Data | Nome | WhatsApp | Pago | Palpites | Número
 * O organizador marca o pagamento pela página de gerenciamento (ou digita SIM na coluna "Pago").
 * O WhatsApp NUNCA é enviado ao site público.
 */

// Tem que ser igual a bolao.prazo do data.js. Depois desse horário ninguém envia mais palpites.
const PRAZO = new Date('2027-02-26T19:00:00-03:00');
const ABA = 'Palpites';
const MAX_DUELOS = 20;

function aba_() {
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  let aba = planilha.getSheetByName(ABA);
  if (!aba) {
    aba = planilha.insertSheet(ABA);
    aba.appendRow(['Data', 'Nome', 'WhatsApp', 'Pago', 'Palpites', 'Número']);
    aba.setFrozenRows(1);
  }
  if (aba.getRange(1, 6).getValue() === '') aba.getRange(1, 6).setValue('Número');
  return aba;
}

/** Próximo número de palpite (1, 2, 3...). Fica guardado à parte, então apagar linhas de teste não repete números. */
function proximoNumero_() {
  const props = PropertiesService.getScriptProperties();
  const numero = Number(props.getProperty('ULTIMO_NUMERO') || 0) + 1;
  props.setProperty('ULTIMO_NUMERO', String(numero));
  return numero;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function inteiro_(v) {
  return typeof v === 'number' && isFinite(v) && Math.floor(v) === v && v >= 0 && v <= 30;
}

/** Confere a chave do organizador. Chave errada demora a responder, para dificultar tentativas em sequência. */
function chaveOk_(chave) {
  const certa = PropertiesService.getScriptProperties().getProperty('ADMIN_KEY');
  if (!certa || String(chave || '') !== certa) {
    Utilities.sleep(1500);
    return false;
  }
  return true;
}

/** Ações do organizador: listar todos os palpites e marcar/desmarcar pagamento. */
function admin_(dados) {
  if (!chaveOk_(dados.chave)) return json_({ ok: false, erro: 'Acesso negado. Confira se o link está completo.' });
  const aba = aba_();

  if (dados.acao === 'listar') {
    const n = aba.getLastRow() - 1;
    const linhas = n > 0 ? aba.getRange(2, 1, n, 6).getValues() : [];
    const entradas = [];
    linhas.forEach(function (l, i) {
      if (String(l[1]).trim() === '') return;
      let palpites = null;
      try { palpites = JSON.parse(l[4]); } catch (_) {}
      // Linhas antigas, sem número, ganham um agora.
      let numero = Number(l[5]);
      if (!numero) { numero = proximoNumero_(); aba.getRange(i + 2, 6).setValue(numero); }
      entradas.push({
        numero: numero,
        linha: i + 2,
        data: l[0] instanceof Date ? Utilities.formatDate(l[0], 'America/Sao_Paulo', 'dd/MM/yyyy HH:mm') : String(l[0]),
        nome: String(l[1]),
        whatsapp: String(l[2]).replace(/\D/g, ''),
        pago: String(l[3]).trim().toUpperCase() === 'SIM',
        palpites: palpites
      });
    });
    return json_({ ok: true, entradas: entradas });
  }

  if (dados.acao === 'pagar') {
    const linha = Number(dados.linha);
    if (!Number.isInteger(linha) || linha < 2 || linha > aba.getLastRow()) return json_({ ok: false, erro: 'Linha inválida. Atualize a lista.' });
    // Confere o nome para não marcar a pessoa errada se a planilha foi reordenada.
    if (String(aba.getRange(linha, 2).getValue()).trim() !== String(dados.nome || '').trim())
      return json_({ ok: false, erro: 'A planilha mudou. Atualize a lista.' });
    aba.getRange(linha, 4).setValue(dados.pago ? 'SIM' : 'NÃO');
    return json_({ ok: true });
  }

  return json_({ ok: false, erro: 'Ação desconhecida.' });
}

/** Recebe os palpites enviados pelo site (e as ações do organizador). */
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    const dados = JSON.parse(e.postData.contents);
    if (dados.acao) return admin_(dados);

    if (new Date() >= PRAZO) return json_({ ok: false, erro: 'Os palpites já foram encerrados.' });

    const nome = String(dados.nome || '').trim().replace(/\s+/g, ' ');
    const whatsapp = String(dados.whatsapp || '').replace(/\D/g, '');
    if (nome.length < 3 || nome.length > 60) return json_({ ok: false, erro: 'Nome inválido.' });
    if (whatsapp.length < 10 || whatsapp.length > 13) return json_({ ok: false, erro: 'WhatsApp inválido.' });

    const palpites = dados.palpites;
    const chaves = palpites && typeof palpites === 'object' ? Object.keys(palpites) : [];
    if (!chaves.length || chaves.length > MAX_DUELOS) return json_({ ok: false, erro: 'Palpites inválidos.' });
    const limpos = {};
    for (const k of chaves) {
      const p = palpites[k];
      if (!/^[a-z0-9_]{1,30}-[a-z0-9_]{1,30}$/.test(k) || !p || !inteiro_(p.a) || !inteiro_(p.b))
        return json_({ ok: false, erro: 'Palpites inválidos.' });
      const pen = p.a === p.b ? String(p.pen || '') : '';
      if (p.a === p.b && pen !== 'a' && pen !== 'b') return json_({ ok: false, erro: 'Escolha quem vence nos pênaltis nos empates.' });
      limpos[k] = { a: p.a, b: p.b, pen: pen };
    }

    const aba = aba_();
    const linhas = aba.getLastRow() > 1 ? aba.getRange(2, 2, aba.getLastRow() - 1, 2).getValues() : [];
    // O WhatsApp pode ser salvo como número pela planilha; compara só os dígitos.
    if (linhas.some(function (l) { return String(l[1]).replace(/\D/g, '') === whatsapp; }))
      return json_({ ok: false, erro: 'Este WhatsApp já enviou palpites.' });
    // Homônimos são permitidos (vários "Lucas"), desde que o nome informado seja diferente.
    // Só bloqueia se o nome completo digitado for igual (sem acento/maiúscula) ao de alguém que já enviou.
    const normaliza = function (s) {
      return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
    };
    if (linhas.some(function (l) { return normaliza(l[0]) === normaliza(nome); }))
      return json_({ ok: false, erro: 'Já existe um palpite com o nome "' + nome + '". Se for outra pessoa, informe também o sobrenome (ou segundo nome).' });

    const numero = proximoNumero_();
    aba.appendRow([new Date(), nome, "'" + whatsapp, 'NÃO', JSON.stringify(limpos), numero]);
    return json_({ ok: true, numero: numero });
  } catch (err) {
    return json_({ ok: false, erro: 'Erro ao salvar. Tente novamente.' });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Devolve ao site público quem participa e se pagou.
 * Os palpites só são enviados DEPOIS do prazo, para ninguém copiar o palpite dos outros.
 */
function doGet(e) {
  const visiveis = new Date() >= PRAZO;
  const aba = aba_();
  const n = aba.getLastRow() - 1;
  const linhas = n > 0 ? aba.getRange(2, 1, n, 5).getValues() : [];
  const entradas = linhas
    .filter(function (l) { return String(l[1]).trim() !== ''; })
    .map(function (l) {
      let palpites = null;
      if (visiveis) { try { palpites = JSON.parse(l[4]); } catch (_) {} }
      return { nome: String(l[1]), pago: String(l[3]).trim().toUpperCase() === 'SIM', palpites: palpites };
    });
  return json_({ palpitesVisiveis: visiveis, entradas: entradas });
}
