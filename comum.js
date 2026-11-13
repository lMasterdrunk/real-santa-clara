/* Funções comuns às páginas (index.html e bolao.html). Requer data.js carregado antes. */
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const jog = id => jogadores[id] || { nome: id };
const iniciais = n => n.split(/\s+/).filter(p => p.length > 2 || /^[A-Z]{2,}$/.test(p))
                       .slice(0, 2).map(p => p[0]).join('').toUpperCase() || n.slice(0, 2).toUpperCase();

const tip = id => jog(id).frase ? ` data-tip="${esc(jog(id).frase)}"` : '';

function avatar(id) {
  const j = jog(id), foto = j.foto || `fotos/${id}.jpg`;
  return `<span class="av"${tip(id)}><img src="${esc(foto)}" alt=""
            onerror="this.replaceWith(document.createTextNode('${esc(iniciais(j.nome))}'))"></span>`;
}

/* tooltip: aparece 2 s depois de parar o mouse sobre nome ou foto */
const caixaTip = document.createElement('div');
caixaTip.className = 'tip';
caixaTip.setAttribute('role', 'tooltip');
document.body.appendChild(caixaTip);
let alvoTip = null, timerTip = null;

function esconderTip() {
  clearTimeout(timerTip); alvoTip = null;
  caixaTip.classList.remove('on');
}
function mostrarTip(el) {
  caixaTip.textContent = el.dataset.tip;
  const r = el.getBoundingClientRect(), t = caixaTip.getBoundingClientRect();
  const x = Math.min(Math.max(8, r.left + r.width / 2 - t.width / 2), innerWidth - t.width - 8);
  const y = r.top - t.height - 10 >= 8 ? r.top - t.height - 10 : r.bottom + 10;
  caixaTip.style.left = x + 'px'; caixaTip.style.top = y + 'px';
  caixaTip.classList.add('on');
}
document.addEventListener('mouseover', e => {
  const el = e.target.closest('[data-tip]');
  if (el === alvoTip) return;
  esconderTip();
  if (!el) return;
  alvoTip = el;
  timerTip = setTimeout(() => mostrarTip(el), 2000);
});
addEventListener('scroll', esconderTip, { passive: true });
