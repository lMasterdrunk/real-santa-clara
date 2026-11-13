/* Página do bolão (bolao.html): formulário de palpites, pontuação e ranking.
   Requer data.js e comum.js carregados antes. */
const duelos = proximo.duelos;
const chave = d => `${d.a}-${d.b}`;
const prazo = new Date(bolao.prazo);
const encerrado = () => Date.now() >= prazo.getTime();
const abertoParaEnvio = () => !!bolao.endpoint && !encerrado();
const brl = n => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const quando = prazo.toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' });

/* ---------- textos ---------- */
document.title = `${bolao.titulo} · Real Santa Clara`;
$('b-chamada').textContent = bolao.chamada;
$('b-valor').textContent = bolao.valor;
$('b-aviso').textContent = bolao.aviso;
$('b-rodape').textContent = bolao.rodape || $('b-rodape').textContent;
if (bolao.pix) { $('b-pix-chave').textContent = bolao.pix; $('b-pix').hidden = false; }
$('b-pontos').innerHTML = bolao.pontuacao.map(p =>
  `<li><span class="pts">${p.pts}</span><span>${esc(p.texto)}</span></li>`).join('');

/* ---------- formulário de palpites ---------- */
$('b-duelos').innerHTML = duelos.map((d, i) => `
  <div class="palpite" data-k="${esc(chave(d))}">
    <div class="duelo"><div class="duelo-in">
      <div class="lado a">${avatar(d.a)}<div><span class="nm"${tip(d.a)}>${esc(jog(d.a).nome)}</span></div></div>
      <div class="gols">
        <input type="number" inputmode="numeric" min="0" max="30" step="1" aria-label="Gols de ${esc(jog(d.a).nome)}" data-lado="a">
        <span class="x">x</span>
        <input type="number" inputmode="numeric" min="0" max="30" step="1" aria-label="Gols de ${esc(jog(d.b).nome)}" data-lado="b">
      </div>
      <div class="lado b">${avatar(d.b)}<div><span class="nm"${tip(d.b)}>${esc(jog(d.b).nome)}</span></div></div>
    </div></div>
    <div class="penaltis" hidden>Empate! Quem vence nos pênaltis?<br>
      <label><input type="radio" name="pen-${i}" value="a"> ${esc(jog(d.a).nome)}</label>
      <label><input type="radio" name="pen-${i}" value="b"> ${esc(jog(d.b).nome)}</label>
    </div>
  </div>`).join('');

const golVal = el => el.value === '' ? null : Number(el.value);
function atualizarPenaltis(cx) {
  const [a, b] = [...cx.querySelectorAll('.gols input')].map(golVal);
  const empate = a !== null && b !== null && a === b;
  cx.querySelector('.penaltis').hidden = !empate;
  if (!empate) cx.querySelectorAll('.penaltis input').forEach(r => r.checked = false);
}
document.querySelectorAll('.palpite').forEach(cx =>
  cx.querySelectorAll('.gols input').forEach(i => i.addEventListener('input', () => atualizarPenaltis(cx))));

function mensagem(texto, erro) {
  const m = $('b-msg'); m.textContent = texto; m.hidden = false; m.classList.toggle('erro', !!erro);
  m.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function lerPalpites() {
  const palpites = {};
  for (const cx of document.querySelectorAll('.palpite')) {
    const [a, b] = [...cx.querySelectorAll('.gols input')].map(golVal);
    const nome = cx.querySelector('.nm').textContent + ' x ' + cx.querySelectorAll('.nm')[1].textContent;
    if (a === null || b === null || !Number.isInteger(a) || !Number.isInteger(b) || a < 0 || b < 0 || a > 30 || b > 30)
      return { erro: `Preencha o placar de ${nome} (números de 0 a 30).` };
    let pen = '';
    if (a === b) {
      const r = cx.querySelector('.penaltis input:checked');
      if (!r) return { erro: `${nome}: no empate, escolha quem vence nos pênaltis.` };
      pen = r.value;
    }
    palpites[cx.dataset.k] = { a, b, pen };
  }
  return { palpites };
}

$('form-bolao').addEventListener('submit', async e => {
  e.preventDefault();
  if (!abertoParaEnvio()) return;
  const nome = $('f-nome').value.trim().replace(/\s+/g, ' ');
  const whatsapp = $('f-zap').value.replace(/\D/g, '');
  if (nome.length < 3) return mensagem('Digite seu nome (mínimo 3 letras).', true);
  if (whatsapp.length < 10 || whatsapp.length > 13) return mensagem('Digite o WhatsApp com DDD.', true);
  const lido = lerPalpites();
  if (lido.erro) return mensagem(lido.erro, true);

  const botao = $('b-enviar'); botao.disabled = true; botao.textContent = 'Enviando...';
  try {
    const resp = await fetch(bolao.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },   /* evita preflight no Apps Script */
      body: JSON.stringify({ nome, whatsapp, palpites: lido.palpites }),
    });
    const dados = await resp.json();
    if (!dados.ok) throw new Error(dados.erro || 'Não foi possível salvar.');
    try { localStorage.setItem('x1-bolao-enviado', nome); } catch (_) {}
    $('form-bolao').reset();
    document.querySelectorAll('.penaltis').forEach(p => p.hidden = true);
    mensagem(`Palpites de ${nome} enviados! Agora faça o Pix de ${bolao.valor} e mande o comprovante no privado ao organizador. Só concorre quem pagou.`);
    carregarRanking();
  } catch (err) {
    mensagem(`${err.message} Se não tiver certeza de que foi salvo, fale com o organizador antes de tentar de novo.`, true);
  } finally {
    botao.disabled = !abertoParaEnvio(); botao.textContent = 'Enviar palpites';
  }
});

/* estado da abertura */
if (!bolao.endpoint) $('b-estado').textContent = 'Os palpites ainda não foram abertos. Volte em breve!';
else if (encerrado()) $('b-estado').textContent = `Palpites encerrados em ${quando}.`;
else $('b-estado').textContent = `Palpites abertos até ${quando}.`;
$('b-enviar').disabled = !abertoParaEnvio();
try {
  const antes = localStorage.getItem('x1-bolao-enviado');
  if (antes && abertoParaEnvio()) $('b-estado').textContent += ` Neste aparelho já foram enviados palpites como "${antes}".`;
} catch (_) {}

/* ---------- pontuação ---------- */
const vencedor = p => p.a > p.b ? 'a' : p.b > p.a ? 'b' : (p.pen || '');
function pontosDuelo(p, r) {
  if (!p || !r) return 0;
  const exato = p.a === r.a && p.b === r.b;
  const empateReal = r.a === r.b;
  if (exato) return empateReal && p.pen === r.pen ? 4 : 3;
  if (empateReal && p.a === p.b && p.pen === r.pen) return 2;
  return vencedor(p) && vencedor(p) === vencedor(r) ? 1 : 0;
}
const resultados = Object.fromEntries(duelos.filter(d => d.resultado).map(d => [chave(d), d.resultado]));
const totalResultados = Object.keys(resultados).length;
const pontosTotais = palpites =>
  Object.entries(resultados).reduce((s, [k, r]) => s + pontosDuelo(palpites && palpites[k], r), 0);

/* ---------- ranking do bolão (lê as entradas do script do Google) ---------- */
async function carregarRanking() {
  const lista = $('b-rank'), aviso = $('b-rank-aviso');
  if (!bolao.endpoint) { aviso.textContent = 'O ranking aparece assim que os palpites forem abertos.'; lista.innerHTML = ''; return; }
  try {
    const resp = await fetch(bolao.endpoint + '?acao=lista');
    const dados = await resp.json();
    const entradas = dados.entradas || [];
    const pagos = entradas.filter(x => x.pago);
    const aguardando = entradas.length - pagos.length;
    if (bolao.valorNumero && pagos.length) {
      $('b-premio-valor').textContent = brl(pagos.length * bolao.valorNumero); $('b-premio').hidden = false;
    }
    const ordenados = pagos.map(x => ({ nome: x.nome, pts: pontosTotais(x.palpites) }))
      .sort((x, y) => y.pts - x.pts || x.nome.localeCompare(y.nome, 'pt-BR'));
    let pos = 0, anterior = null;
    lista.innerHTML = ordenados.map((x, i) => {
      if (x.pts !== anterior) { pos = i + 1; anterior = x.pts; }
      return `<li><span class="pos">${totalResultados ? pos + 'º' : '–'}</span>
        <div class="info"><div class="nm">${esc(x.nome)}</div></div>
        <div class="pts-total">${x.pts}<small>PONTOS</small></div></li>`;
    }).join('');
    /* fim do bolão: quem empatar em 1º divide o prêmio igualmente */
    const venc = $('b-vencedores');
    const encerradoBolao = totalResultados > 0 && totalResultados === duelos.length;
    if (encerradoBolao && ordenados.length && bolao.valorNumero) {
      const lideres = ordenados.filter(x => x.pts === ordenados[0].pts);
      const cada = (pagos.length * bolao.valorNumero) / lideres.length;
      venc.innerHTML = lideres.length === 1
        ? `Vencedor: <b>${esc(lideres[0].nome)}</b> · leva ${brl(cada)}`
        : `Empate em 1º lugar com ${ordenados[0].pts} pontos: <b>${lideres.map(x => esc(x.nome)).join(', ')}</b><br>` +
          `Prêmio dividido igualmente · ${brl(cada)} para cada`;
      venc.hidden = false;
    } else venc.hidden = true;

    const partes = [`${pagos.length} participante${pagos.length === 1 ? '' : 's'} concorrendo`];
    if (aguardando) partes.push(`${aguardando} aguardando confirmação do pagamento`);
    if (!totalResultados) partes.push('a pontuação aparece depois dos confrontos');
    if (!dados.palpitesVisiveis) partes.push('os palpites ficam escondidos até o prazo acabar');
    aviso.textContent = partes.join(' · ') + '.';
  } catch (_) {
    aviso.textContent = 'Não foi possível carregar o ranking agora. Tente de novo em instantes.';
  }
}
carregarRanking();
