/* Balaio do Cerrado — comportamento do site (JavaScript puro, sem bibliotecas). */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var cfg = window.BALAIO || {};
  cfg.redes = cfg.redes || {};
  var WA_NUM = String(cfg.whatsapp || '5534997690071').replace(/\D/g, '');
  function waLink(text) { return 'https://wa.me/' + WA_NUM + '?text=' + encodeURIComponent(text || cfg.whatsappTexto || 'Olá! Vim pelo site da Balaio do Cerrado.'); }

  /* ---------- Botões de WhatsApp: usam o número e o texto do config.js ---------- */
  $$('a.wa-float, a[href^="https://wa.me/"]').forEach(function (a) {
    var h = a.getAttribute('href') || '';
    if (h.indexOf('text=') === -1) { a.setAttribute('href', waLink()); }
    else { var t = decodeURIComponent(h.split('text=')[1] || ''); a.setAttribute('href', waLink(t)); }
  });

  /* ---------- Rodapé: ano atual e redes sociais ---------- */
  $$('.js-ano').forEach(function (n) { n.textContent = new Date().getFullYear(); });
  var nomes = { instagram: 'Instagram', youtube: 'YouTube', facebook: 'Facebook', linkedin: 'LinkedIn' };
  var haRedes = false;
  var html = Object.keys(nomes).filter(function (k) { return cfg.redes[k]; }).map(function (k) {
    haRedes = true;
    return '<a href="' + String(cfg.redes[k]).replace(/"/g, '&quot;') + '" target="_blank" rel="noopener me">' + nomes[k] + '</a>';
  }).join(' • ');
  $$('[data-social]').forEach(function (p) { p.innerHTML = html; if (!haRedes) { p.style.display = 'none'; } });
  if (!haRedes) { $$('[data-social-wrap]').forEach(function (w) { w.style.display = 'none'; }); }

  /* ---------- Dicas dos espaços de foto ---------- */
  if (cfg.dicasDeFoto === false) { document.documentElement.classList.add('sem-dicas'); }

  /* ---------- Foto de abertura da home (só aparece se a foto existir) ---------- */
  var hero = $('.hero[data-bg]');
  if (hero) {
    var probe = new Image();
    probe.onload = function () {
      var d = document.createElement('div');
      d.className = 'hero-bg';
      d.style.backgroundImage = "url('" + hero.getAttribute('data-bg') + "')";
      d.setAttribute('role', 'img');
      d.setAttribute('aria-label', hero.getAttribute('data-bg-alt') || '');
      hero.insertBefore(d, hero.firstChild);
    };
    probe.src = hero.getAttribute('data-bg');
  }

  /* ---------- Vídeo institucional da home (link no config.js) ---------- */
  function ytId(u) { var m = String(u || '').match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{11})/); return m ? m[1] : ''; }
  var vs = $('[data-video-slot]'), vid = ytId(cfg.videoInstitucional);
  if (vs && vid) {
    vs.innerHTML = '<div class="video-frame js-yt" data-id="' + vid + '" data-title="Vídeo institucional da Balaio do Cerrado"><img src="https://i.ytimg.com/vi/' + vid + '/hqdefault.jpg" alt="Vídeo institucional da Balaio do Cerrado" loading="lazy" style="width:100%;height:100%;object-fit:cover"><button type="button" class="play" aria-label="Assistir: Vídeo institucional da Balaio do Cerrado"></button></div>';
  }

  /* ---------- Logomarcas dos parceiros (lista no config.js) ---------- */
  $$('[data-logos]').forEach(function (box) {
    var lista = (box.getAttribute('data-logos') === 'home' ? cfg.parceirosHome : cfg.parceiros) || [];
    var lim = parseInt(box.getAttribute('data-limit'), 10) || 300;
    if (!lista.length) { return; }
    var base = box.getAttribute('data-base');
    var h = lista.slice(0, lim).map(function (f) {
      var nome = String(f).replace(/\.[^.]+$/, '').replace(/^home-/, '').replace(/[-_]+/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
      return '<div class="logo-box"><img src="' + base + encodeURIComponent(f) + '" alt="Logomarca da ' + nome.replace(/"/g, '') + '" loading="lazy"></div>';
    }).join('');
    box.innerHTML = '<div class="logos" style="margin:20px 0">' + h + '</div>';
  });

  /* ---------- GA4 só com consentimento (LGPD) ---------- */
  var ANALYTICS = !!(cfg.gtm || cfg.ga4), loaded = false;
  function ev(name, params) {
    if (cfg.gtm) { var o = { event: name }; for (var k in (params || {})) { o[k] = params[k]; } window.dataLayer.push(o); }
    else if (window.gtag) { window.gtag('event', name, params || {}); }
  }
  function loadGA() {
    if (!ANALYTICS || loaded) { return; }
    loaded = true;
    if (cfg.gtm) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      var g = document.createElement('script'); g.async = true; g.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(cfg.gtm);
      document.head.appendChild(g); fireQueued(); return;
    }
    var s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(cfg.ga4);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', cfg.ga4, { anonymize_ip: true });
    fireQueued();
  }
  var queued = [];
  function fireQueued() { queued.forEach(function (q) { ev(q[0], q[1]); }); queued = []; }
  function track(name, params) { if (!ANALYTICS) { return; } if (loaded) { ev(name, params); } else { queued.push([name, params]); } }

  var consent = null;
  try { consent = localStorage.getItem('balaio_cookies'); } catch (e) {}
  var bar = $('#cookie');
  if (consent === 'yes') { loadGA(); }
  else if (consent !== 'no' && bar && ANALYTICS) { bar.classList.add('show'); }
  $$('[data-cookie]').forEach(function (b) {
    b.addEventListener('click', function () {
      var v = b.getAttribute('data-cookie');
      try { localStorage.setItem('balaio_cookies', v); } catch (e) {}
      bar.classList.remove('show');
      if (v === 'yes') { loadGA(); }
    });
  });
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-ga]');
    if (t) { track(t.getAttribute('data-ga'), { link_url: t.getAttribute('href') || '' }); }
  });

  /* ---------- Menu móvel ---------- */
  var tg = $('.nav-toggle'), nav = $('#main-nav');
  if (tg && nav) {
    tg.addEventListener('click', function () {
      var o = nav.classList.toggle('open');
      tg.setAttribute('aria-expanded', o ? 'true' : 'false');
      tg.setAttribute('aria-label', o ? 'Fechar menu' : 'Abrir menu');
    });
  }

  /* ---------- Janela "Fale conosco" ---------- */
  var modal = $('#modal-contato'), lastFocus = null;
  function setAssunto(form, a) {
    form.setAttribute('data-assunto', a);
    var r = $('input[name="assunto"][value="' + a + '"]', form);
    if (r) { r.checked = true; }
  }
  function openModal(assunto, servico) {
    if (!modal) { return; }
    lastFocus = document.activeElement;
    var f = $('form', modal);
    setAssunto(f, assunto || 'servico');
    if (servico) { var s = $('select[name="servico"]', f); if (s) { s.value = servico; } }
    modal.hidden = false; modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    var first = $('input[name="nome"]', f); if (first) { first.focus(); }
  }
  function closeModal() {
    if (!modal) { return; }
    modal.classList.remove('open'); modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus) { lastFocus.focus(); }
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.js-open-contact');
    if (b) { e.preventDefault(); openModal(b.getAttribute('data-assunto'), b.getAttribute('data-servico')); return; }
    if (modal && (e.target === modal || e.target.closest('.modal-close'))) { closeModal(); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) { closeModal(); }
  });

  /* ---------- Formulários ----------
     Sem "formspree" no config.js: abre o WhatsApp com a mensagem pronta.
     Com "formspree": envia por e-mail e mostra a confirmação na própria página. */
  var ASSUNTOS = { patrocinar: 'Quero patrocinar', servico: 'Quero contratar um serviço', podcast: 'Quero saber do podcast', arquivo: 'Pedido do arquivo do projeto' };
  function val(f, n) { var el = f.elements[n]; return el && el.value ? String(el.value).trim() : ''; }
  function selText(f, n) { var el = f.elements[n]; return el && el.selectedIndex > 0 ? el.options[el.selectedIndex].text : ''; }
  function coletar(f) {
    var as = f.getAttribute('data-assunto') || 'servico';
    var r = $('input[name="assunto"]:checked', f); if (r) { as = r.value; }
    var h = $('input[type="hidden"][name="assunto"]', f); if (h) { as = h.value; }
    var projeto = f.getAttribute('data-projeto') || val(f, 'projeto_interesse');
    return [
      ['Assunto', ASSUNTOS[as] || as], ['Nome', val(f, 'nome')], ['E-mail', val(f, 'email')],
      ['Empresa/instituição', val(f, 'empresa')], ['Cargo', val(f, 'cargo')], ['Telefone/WhatsApp', val(f, 'telefone')],
      ['Serviço', selText(f, 'servico')], ['Regime tributário', val(f, 'regime')], ['Projeto', projeto],
      ['Interesse (podcast)', val(f, 'interesse')], ['Mensagem', val(f, 'mensagem')], ['Página de origem', location.href.replace(/^file:.*/, '')]
    ].filter(function (p) { return p[1]; });
  }
  function relevantes(f, pares) {
    // ignora campos de outros assuntos (ficam escondidos no formulário)
    return pares.filter(function (p) {
      var map = { 'Serviço': 'servico', 'Regime tributário': 'regime', 'Interesse (podcast)': 'interesse', 'Empresa/instituição': 'empresa', 'Cargo': 'cargo', 'Telefone/WhatsApp': 'telefone' };
      var el = map[p[0]] ? f.elements[map[p[0]]] : null;
      return !el || el.offsetParent !== null || f.getAttribute('data-assunto') === 'arquivo';
    });
  }
  function mostrar(f, tipo, html) {
    var ok = $('.form-ok', f), fail = $('.form-fail', f);
    if (ok) { ok.hidden = true; } if (fail) { fail.hidden = true; }
    var alvo = tipo === 'ok' ? ok : fail;
    if (alvo) { alvo.innerHTML = html; alvo.hidden = false; }
  }
  var FAIL_HTML = 'Algo não funcionou por aqui. <a href="' + waLink() + '" target="_blank" rel="noopener">Chame a gente no WhatsApp</a>.';
  $$('.js-form').forEach(function (f) {
    var nota = $('.form-note', f);
    if (nota && f.getAttribute('data-assunto') !== 'arquivo') {
      nota.textContent = cfg.formspree ? 'Se preferir, chame no WhatsApp.' : 'Ao enviar, abrimos o WhatsApp da Balaio do Cerrado com a sua mensagem pronta; é só apertar enviar.';
    }
    if (nota && f.getAttribute('data-assunto') === 'arquivo' && !cfg.formspree) { nota.textContent = 'Ao enviar, abrimos o WhatsApp da Balaio do Cerrado com o seu pedido; enviamos o arquivo do projeto.'; }
    $$('input[name="assunto"]', f).forEach(function (r) {
      r.addEventListener('change', function () { f.setAttribute('data-assunto', r.value); });
    });
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      $$('input[required], select[required]', f).forEach(function (el) {
        var visible = el.offsetParent !== null;
        if (visible && ((el.type === 'checkbox' && !el.checked) || (el.type !== 'checkbox' && !el.value.trim()))) { ok = false; el.style.borderColor = '#B3371F'; }
        else { el.style.borderColor = ''; }
      });
      var email = $('input[type="email"]', f);
      if (email && email.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)) { ok = false; email.style.borderColor = '#B3371F'; }
      var err = $('.form-error', f);
      if (!ok) { if (err) { err.hidden = false; } return; }
      if (err) { err.hidden = true; }
      if (val(f, '_gotcha')) { return; }                      // robô: ignora
      var pares = relevantes(f, coletar(f));
      var assunto = f.getAttribute('data-assunto') || '';
      var r = $('input[name="assunto"]:checked', f); if (r) { assunto = r.value; }
      if (cfg.formspree) {
        var payload = {}; pares.forEach(function (p) { payload[p[0]] = p[1]; });
        payload['Consentimento LGPD'] = 'Sim, em ' + new Date().toLocaleString('pt-BR');
        payload._subject = '[Site] ' + (ASSUNTOS[assunto] || 'Contato') + ' — ' + val(f, 'nome');
        payload._replyto = val(f, 'email');
        var btn = $('button[type="submit"]', f); if (btn) { btn.disabled = true; }
        fetch(cfg.formspree, { method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
          .then(function (res) {
            if (!res.ok) { throw new Error('http'); }
            mostrar(f, 'ok', '<strong>Recebemos a sua mensagem.</strong> A Marisa ou o Rubem entram em contato em até um dia útil.');
            track(assunto === 'arquivo' ? 'pedido_arquivo' : 'form_submit_assunto', { assunto: assunto, pagina: location.pathname });
            f.reset();
          })
          .catch(function () { mostrar(f, 'fail', FAIL_HTML); })
          .then(function () { if (btn) { btn.disabled = false; } });
      } else {
        var linhas = ['Olá! Vim pelo site da Balaio do Cerrado.', ''].concat(pares.map(function (p) { return p[0] + ': ' + p[1]; }));
        var url = waLink(linhas.join('\n'));
        track(assunto === 'arquivo' ? 'pedido_arquivo' : 'form_submit_assunto', { assunto: assunto, pagina: location.pathname });
        var w = window.open(url, '_blank', 'noopener');
        mostrar(f, 'ok', '<strong>Quase lá!</strong> Abrimos o WhatsApp com a sua mensagem pronta. É só apertar enviar. Se ele não abriu, <a href="' + url + '" target="_blank" rel="noopener">clique aqui</a>.');
        if (!w) { /* bloqueador de pop-up: o link acima resolve */ }
      }
    });
  });

  /* ---------- Vídeo do YouTube sob demanda ---------- */
  document.addEventListener('click', function (e) {
    var v = e.target.closest('.js-yt');
    if (!v) { return; }
    var id = v.getAttribute('data-id');
    var ifr = document.createElement('iframe');
    ifr.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
    ifr.title = v.getAttribute('data-title') || 'Vídeo';
    ifr.allow = 'accelerometer; autoplay; encrypted-media; picture-in-picture';
    ifr.allowFullscreen = true;
    v.innerHTML = ''; v.appendChild(ifr);
    track('video_play', { video_id: id });
  });

  /* ---------- Filtros por categoria (Memórias e Atualidades), sem recarregar ---------- */
  var fl = $('[data-filter-group]');
  if (fl) {
    $$('button[data-cat]', fl).forEach(function (b) {
      b.addEventListener('click', function () {
        var c = b.getAttribute('data-cat');
        $$('button', fl).forEach(function (x) { x.classList.toggle('on', x === b); });
        $$('[data-cats]').forEach(function (card) {
          var show = c === 'all' || card.getAttribute('data-cats').split('|').indexOf(c) > -1;
          card.style.display = show ? '' : 'none';
        });
        var empty = $('#filter-empty');
        if (empty) { empty.hidden = $$('[data-cats]').some(function (x) { return x.style.display !== 'none'; }); }
      });
    });
  }
})();
