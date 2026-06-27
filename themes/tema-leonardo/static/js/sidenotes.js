/* ==============================================
   SIDENOTES
   Converte footnotes do Hugo em notas marginais
   (desktop) ou inline clicável (mobile).

   Breakpoint em `em` para responder ao zoom
   óptico do browser (igual ao CSS: 48.75em).
   ============================================== */

(function () {
  const wrap = document.querySelector('.conteudo-wrap');
  if (!wrap) return;

  const refs = wrap.querySelectorAll('sup[id^="fnref:"]');
  if (!refs.length) return;

  // Mesmo breakpoint do CSS: 780px / 16px = 48.75em
  const MQ = window.matchMedia('(max-width: 48.75em)');

  const items = [];

  /* --------------------------------------------------
     Processa cada footnote ref
  -------------------------------------------------- */
  refs.forEach(function (sup) {
    const key = sup.id.replace('fnref:', '');
    const a   = sup.querySelector('a');
    if (!a) return;
    const num = a.textContent.trim();

    const fnLi = document.getElementById('fn:' + key);
    if (!fnLi) return;

    // Clona o <li> e remove o link de retorno ↩
    const clone = fnLi.cloneNode(true);
    const back  = clone.querySelector('a.footnote-backref');
    if (back) back.remove();
    const txt = clone.innerHTML.trim();

    // Substitui <sup> por link fn-ref
    const link = document.createElement('a');
    link.className   = 'fn-ref';
    link.id          = 'ref-' + key;
    link.href        = '#';
    link.textContent = num;
    link.addEventListener('click', function (e) {
      abrirNota(e, key);
    });
    sup.replaceWith(link);

    // Cria sidenote marginal
    const side = document.createElement('div');
    side.className = 'sidenote';
    side.id        = 'nota-' + key;
    side.innerHTML = '<span class="fn-num">' + num + '.</span> ' + txt;
    wrap.appendChild(side);

    // Cria nota inline (para mobile)
    const refEl = document.getElementById('ref-' + key);
    let inl = null;
    if (refEl) {
      const para = refEl.closest('p, li, blockquote');
      if (para) {
        inl = document.createElement('div');
        inl.className = 'nota-inline';
        inl.id        = 'inline-' + key;
        inl.innerHTML = '<span class="fn-num">' + num + '.</span> ' + txt;
        para.after(inl);
      }
    }

    items.push({ key, side, inl });
  });

  /* --------------------------------------------------
     Posicionamento vertical das sidenotes

     Usa offsetTop acumulado em vez de
     getBoundingClientRect(), que depende do scroll
     e dá posição errada ao recarregar a página
     numa posição rolada.
  -------------------------------------------------- */
  function offsetRelativo(el, ancestor) {
    let top = 0;
    while (el && el !== ancestor) {
      top += el.offsetTop;
      el = el.offsetParent;
    }
    return top;
  }

  function posicionarTodas() {
    items.forEach(function ({ key, side }) {
      const refEl = document.getElementById('ref-' + key);
      if (!refEl) return;
      const top = offsetRelativo(refEl, wrap);
      side.style.top = top + 'px';
    });
  }

  /* --------------------------------------------------
     Aplica modo desktop ou mobile
     Chamado sempre que o breakpoint muda
  -------------------------------------------------- */
  function aplicarModo() {
    const isMobile = MQ.matches;
    items.forEach(function ({ inl }) {
      // Ao voltar para desktop, fecha todas as inline abertas
      if (!isMobile && inl) {
        inl.style.display = 'none';
      }
    });
    if (!isMobile) {
      posicionarTodas();
    }
  }

  // Escuta mudança de breakpoint (resize real + zoom em `em`)
  MQ.addEventListener('change', aplicarModo);

  // ResizeObserver: reposiciona ao redimensionar o wrapper
  if (window.ResizeObserver) {
    new ResizeObserver(function () {
      posicionarTodas();
      aplicarModo();
    }).observe(document.body);
  }

  window.addEventListener('resize', posicionarTodas);
  document.fonts && document.fonts.ready.then(posicionarTodas);

  posicionarTodas();
  aplicarModo();

})();

/* --------------------------------------------------
   Abre/fecha nota inline no mobile
-------------------------------------------------- */
function abrirNota(e, k) {
  e.preventDefault();
  if (!window.matchMedia('(max-width: 48.75em)').matches) return;
  const el = document.getElementById('inline-' + k);
  if (!el) return;
  el.style.display = el.style.display === 'block' ? 'none' : 'block';
}
