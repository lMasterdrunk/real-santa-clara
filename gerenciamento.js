/* Gerenciamento do bolão (gerenciamentobolao.html): o organizador vê quem enviou palpites
   e confirma o pagamento. Não há tela de login: o acesso é o próprio link do organizador,
   que traz a chave depois do "#" (ex.: gerenciamentobolao.html#CHAVE).
   O que vem depois do "#" não é enviado ao servidor do site nem fica no repositório;
   quem confere a chave é o script do Google.
   Requer data.js e comum.js carregados antes. */

const chave = decodeURIComponent(location.hash.slice(1));
let entradas = [];

const brl = n => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function mensagem(texto, erro) {
  const m = $('g-msg'); m.textContent = texto; m.hidden = !texto; m.classList.toggle('erro', !!erro);
}

/* envia uma ação ao script do Google (POST em text/plain evita preflight) */
async function chamar(acao, extra) {
  const resp = await fetch(bolao.endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(Object.assign({ acao, chave }, extra)),
  });
  return resp.json();
}

function formatarZap(d) {
  if (d.length >= 12 && d.startsWith('55')) d = d.slice(2);
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return d;
}
const linkZap = d => 'https://wa.me/' + (d.length <= 11 ? '55' + d : d);

/* "ivan-nene" -> "Ivan x Nenê" (usa os duelos do próximo X1; se não achar, mostra a chave) */
function nomeDuelo(k) {
  const d = proximo.duelos.find(x => `${x.a}-${x.b}` === k);
  return d ? `${jog(d.a).nome} x ${jog(d.b).nome}` : k;
}
function textoPalpite(k, p) {
  const d = proximo.duelos.find(x => `${x.a}-${x.b}` === k);
  const pen = p.a === p.b && d ? ` (pênaltis: ${jog(p.pen === 'a' ? d.a : d.b).nome})` : '';
  return `${esc(nomeDuelo(k))}: <b>${p.a} x ${p.b}</b>${esc(pen)}`;
}

function resumo() {
  const pagos = entradas.filter(x => x.pago).length;
  $('g-resumo').innerHTML = `
    <div><b>${entradas.length}</b><small>Participantes</small></div>
    <div><b>${pagos}</b><small>Pagos</small></div>
    <div><b>${entradas.length - pagos}</b><small>Aguardando</small></div>
    <div><b>${brl(pagos * (bolao.valorNumero || 0))}</b><small>Arrecadado</small></div>`;
}

function desenharLista() {
  const termo = $('g-busca').value.trim().toLowerCase();
  const so = $('g-filtro').value;
  const visiveis = entradas.filter(x =>
    (so === 'todos' || (so === 'pagos') === x.pago) &&
    (!termo || x.nome.toLowerCase().includes(termo) || x.whatsapp.includes(termo.replace(/\D/g, '') || '\0')));
  $('g-lista').innerHTML = visiveis.length ? visiveis.map(x => `
    <li class="ger-item${x.pago ? ' pago' : ''}" data-linha="${x.linha}">
      <label class="ger-pago"><input type="checkbox" ${x.pago ? 'checked' : ''} aria-label="Pagamento de ${esc(x.nome)} confirmado">
        <span>${x.pago ? 'PAGO' : 'PAGO?'}</span></label>
      <div class="info">
        <div class="nm">${esc(x.nome)}</div>
        <div class="sub"><a href="${esc(linkZap(x.whatsapp))}" target="_blank" rel="noopener">${esc(formatarZap(x.whatsapp))}</a>
          · enviado em ${esc(x.data)}</div>
        <details><summary>Ver palpites</summary>
          <ul class="ger-palpites">${x.palpites
            ? Object.entries(x.palpites).map(([k, p]) => `<li>${textoPalpite(k, p)}</li>`).join('')
            : '<li>Sem palpites legíveis.</li>'}</ul></details>
      </div>
    </li>`).join('') : '<li class="ger-vazio">Nenhum participante encontrado.</li>';
}

async function carregar() {
  mensagem('');
  const dados = await chamar('listar', {});
  if (!dados.ok) throw new Error(dados.erro || 'Não foi possível carregar.');
  entradas = dados.entradas;
  $('secao-lista').hidden = false;
  resumo(); desenharLista();
}

/* marcar / desmarcar pagamento */
$('g-lista').addEventListener('change', async e => {
  const caixa = e.target.closest('.ger-pago input');
  if (!caixa) return;
  const item = caixa.closest('.ger-item');
  const x = entradas.find(y => y.linha === Number(item.dataset.linha));
  const novo = caixa.checked;
  caixa.disabled = true;
  try {
    const dados = await chamar('pagar', { linha: x.linha, nome: x.nome, pago: novo });
    if (!dados.ok) throw new Error(dados.erro || 'Não foi possível salvar.');
    x.pago = novo;
    mensagem('');
  } catch (err) {
    caixa.checked = !novo;
    mensagem(`${err.message} A marcação não foi salva.`, true);
  }
  resumo(); desenharLista();
});

$('g-busca').addEventListener('input', desenharLista);
$('g-filtro').addEventListener('change', desenharLista);
const atualizar = () => carregar().catch(err => mensagem(err.message, true));
$('g-atualizar').addEventListener('click', atualizar);
$('g-atualizar').addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); atualizar(); } });

/* abre direto: a chave vem no link */
if (!bolao.endpoint) mensagem('O endereço do script (endpoint) ainda não foi configurado no data.js.', true);
else if (!chave) mensagem('Link incompleto. Use o endereço completo que o administrador do site enviou ao organizador.', true);
else atualizar();
