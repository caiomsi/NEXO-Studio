/* NEXO STUDIO — vanilla JS */
(function () {
  'use strict';

  /* ⚠️ PLACEHOLDER — trocar pelo número real do estúdio (DDI + DDD + número, só dígitos) */
  var WHATSAPP_NUMBER = '5534999999999';
  var FORMS_ENDPOINT = 'https://forms.caiomsi.com/api/submit';

  /* ── Nav: estado scrolled ── */
  var nav = document.getElementById('nav');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Nav: menu mobile ── */
  var toggle = document.getElementById('nav-toggle');
  var links = document.getElementById('nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── Scroll-spy ── */
  var spyLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  var sections = [];
  spyLinks.forEach(function (a) {
    var sec = document.querySelector(a.getAttribute('href'));
    if (sec) sections.push({ link: a, sec: sec });
  });
  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        sections.forEach(function (s) {
          s.link.classList.toggle('is-active', s.sec === entry.target);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s.sec); });
  }

  /* ── Reveal escalonado ── */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (entries) {
      var delay = 0;
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.style.transitionDelay = delay + 'ms';
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
        delay += 90;
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ══════════ O filamento: a luz que percorre a página ══════════
     Um caminho SVG ancorado nas seções reais, desenhado pelo scroll
     (stroke-dash). A ponta acesa carrega um halo que ilumina o que
     está perto — o nexo é a luz que atravessa a página inteira. */
  (function () {
    var mainEl = document.getElementById('main');
    var svg = document.getElementById('thread');
    var path = document.getElementById('thread-path');
    var nib = document.getElementById('thread-nib');
    var halo = document.getElementById('thread-halo');
    if (!mainEl || !svg || !path) return;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var len = 0;
    var introDone = reduce;

    function rel(el) {
      var r = el.getBoundingClientRect();
      var m = mainEl.getBoundingClientRect();
      return {
        top: r.top - m.top, bottom: r.bottom - m.top,
        left: r.left - m.left, right: r.right - m.left,
        cy: r.top - m.top + r.height / 2
      };
    }
    function q(s) { return document.querySelector(s); }

    /* âncoras: margens laterais (calhas) + travessias nos vãos entre seções */
    function buildPoints() {
      var W = mainEl.clientWidth;
      var L = Math.max(W * .03, 16);
      var R = Math.min(W * .97, W - 16);
      var pts = [];
      /* a luz nasce na palavra-neon do título (em telas largas) */
      var narrow = W < 720;
      var hl = q('.hl');
      var title = q('.hero-title');
      if (!narrow && hl) {
        var h = rel(hl);
        pts.push([Math.min(h.right + 30, R - 200), h.cy]);
        var sub = q('.hero-sub');
        if (sub) { var sb = rel(sub); pts.push([R - 120, sb.cy]); }
      } else if (title) {
        /* no mobile a linha fica na calha, sem cruzar o texto */
        var t = rel(title);
        pts.push([R, t.bottom + 24]);
      }
      var spec = q('.spec');
      if (spec) { var sp = rel(spec); pts.push([R, sp.top - 40]); }
      var cards = document.querySelectorAll('.work-card');
      var work = q('.work-grid');
      if (work) {
        var wk = rel(work);
        pts.push([R, wk.top - 24]);
        if (!narrow && cards.length > 1) {
          /* travessia quase horizontal no vão entre as fileiras (só em telas largas) */
          var c2 = rel(cards[1]);
          pts.push([R, c2.top - 26]);
          pts.push([L, c2.top - 18]);
        } else {
          /* no mobile desce inteira pela calha direita e cruza no vão entre seções */
          pts.push([R, wk.bottom + 10]);
        }
        pts.push([L, wk.bottom + 30]);
      }
      var serv = q('#servicos');
      if (serv) { var sv = rel(serv); pts.push([L, sv.bottom - 70]); }
      var proc = q('#processo');
      if (proc) { var pr = rel(proc); pts.push([R, pr.top + 70]); pts.push([R, pr.bottom - 30]); }
      var priceGrid = q('.price-grid');
      if (priceGrid) { var pg = rel(priceGrid); pts.push([L, pg.top - 34]); pts.push([L, pg.bottom + 10]); }
      var est = q('#estudio');
      if (est) { var es = rel(est); pts.push([R, es.top + 80]); pts.push([R, es.bottom - 50]); }
      var cont = q('#contato');
      if (cont) {
        var ct = rel(cont);
        pts.push([R, ct.top + 90]);
        var wiz = q('.wizard');
        if (wiz) { var wz = rel(wiz); pts.push([R, wz.bottom]); }
      }
      /* aterrissa no centro, apontando para o ✕ do rodapé */
      pts.push([W * .5, mainEl.offsetHeight - 12]);
      return pts;
    }

    /* Catmull-Rom pelas âncoras → béziers cúbicas suaves */
    function toPathD(pts) {
      if (pts.length < 2) return '';
      var d = 'M ' + pts[0][0].toFixed(1) + ' ' + pts[0][1].toFixed(1);
      for (var i = 0; i < pts.length - 1; i++) {
        var p0 = pts[i - 1] || pts[i];
        var p1 = pts[i];
        var p2 = pts[i + 1];
        var p3 = pts[i + 2] || p2;
        d += ' C ' + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + ' ' + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)
          + ', ' + (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + ' ' + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)
          + ', ' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1);
      }
      return d;
    }

    /* o caminho é monotônico em y: busca binária pelo comprimento na altura da ponta */
    function lenAtY(targetY) {
      var lo = 0, hi = len;
      for (var i = 0; i < 18; i++) {
        var mid = (lo + hi) / 2;
        if (path.getPointAtLength(mid).y < targetY) { lo = mid; } else { hi = mid; }
      }
      return (lo + hi) / 2;
    }
    function tipTarget() {
      var tipY = window.innerHeight * 0.75 - mainEl.getBoundingClientRect().top;
      if (tipY <= 0) return 0;
      if (tipY >= mainEl.offsetHeight) return len;
      return lenAtY(tipY);
    }
    function setDrawn(drawn) {
      path.style.strokeDashoffset = String(len - drawn);
      var pt = path.getPointAtLength(drawn);
      if (nib) { nib.setAttribute('cx', pt.x); nib.setAttribute('cy', pt.y); }
      if (halo) { halo.setAttribute('cx', pt.x); halo.setAttribute('cy', pt.y); }
    }

    function build() {
      var d = toPathD(buildPoints());
      if (!d) return;
      svg.setAttribute('viewBox', '0 0 ' + mainEl.clientWidth + ' ' + mainEl.offsetHeight);
      path.setAttribute('d', d);
      len = path.getTotalLength();
      if (halo) halo.setAttribute('r', String(Math.round(Math.min(280, Math.max(140, mainEl.clientWidth * .17)))));
      if (reduce) {
        path.style.strokeDasharray = 'none';
        if (nib) nib.style.display = 'none';
        if (halo) halo.style.display = 'none';
      } else {
        path.style.strokeDasharray = len + ' ' + len;
        setDrawn(introDone ? tipTarget() : 0);
      }
    }

    /* entrada: depois da coreografia do hero, a luz flui do título até a ponta */
    function runIntro() {
      if (introDone || !len) { introDone = true; return; }
      path.style.transition = 'stroke-dashoffset 1.3s cubic-bezier(.3,0,.2,1)';
      path.style.strokeDashoffset = String(len - tipTarget());
      var follow = function () {
        if (introDone) return;
        var off = parseFloat(window.getComputedStyle(path).strokeDashoffset) || len;
        var pt = path.getPointAtLength(Math.max(0, len - off));
        if (nib) { nib.setAttribute('cx', pt.x); nib.setAttribute('cy', pt.y); }
        if (halo) { halo.setAttribute('cx', pt.x); halo.setAttribute('cy', pt.y); }
        window.requestAnimationFrame(follow);
      };
      window.requestAnimationFrame(follow);
      window.setTimeout(function () {
        path.style.transition = 'none';
        introDone = true;
        setDrawn(tipTarget());
      }, 1350);
    }

    build();
    window.addEventListener('load', build);
    if (!reduce) {
      var threadTicking = false;
      window.addEventListener('scroll', function () {
        if (!threadTicking) {
          threadTicking = true;
          window.requestAnimationFrame(function () {
            if (len && introDone) setDrawn(tipTarget());
            threadTicking = false;
          });
        }
      }, { passive: true });
      window.setTimeout(runIntro, 1500);
    }
    var rebuildTimer = null;
    window.addEventListener('resize', function () {
      if (rebuildTimer) window.clearTimeout(rebuildTimer);
      rebuildTimer = window.setTimeout(build, 180);
    });
  })();

  /* ── Ano no rodapé ── */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ── Links diretos de WhatsApp ── */
  var directMsg = 'Olá, NEXO Studio! Vi o site de vocês e quero conversar sobre um projeto.';
  var directUrl = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(directMsg);
  var waDirect = document.getElementById('wa-direct');
  var waFloat = document.getElementById('wa-float');
  if (waDirect) waDirect.href = directUrl;
  if (waFloat) {
    waFloat.href = directUrl;
    var hero = document.querySelector('.hero');
    var floatToggle = function () {
      var past = hero ? window.scrollY > hero.offsetHeight * 0.7 : window.scrollY > 600;
      waFloat.classList.toggle('is-visible', past);
    };
    window.addEventListener('scroll', floatToggle, { passive: true });
    floatToggle();
  }

  /* ══════════ Wizard de brief ══════════ */
  var form = document.getElementById('brief');
  if (!form) return;

  var steps = Array.prototype.slice.call(form.querySelectorAll('.wiz-step'));
  var current = 1;
  var total = steps.length;
  var answers = {};

  var label = document.getElementById('wiz-current');
  var fill = document.getElementById('wiz-fill');
  var btnBack = document.getElementById('wiz-back');
  var btnNext = document.getElementById('wiz-next');
  var btnSend = document.getElementById('wiz-send');
  var status = document.getElementById('form-status');
  var success = form.querySelector('.wiz-success');
  var wizNav = form.querySelector('.wiz-nav');
  var wizHead = form.querySelector('.wiz-head');

  /* chips: seleção única por grupo */
  form.querySelectorAll('.chips').forEach(function (group) {
    group.addEventListener('click', function (e) {
      var chip = e.target.closest('.chip');
      if (!chip) return;
      group.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('is-selected'); });
      chip.classList.add('is-selected');
      answers[group.dataset.field] = chip.dataset.value;
      hideError(group.closest('.wiz-step'));
      /* passo 1 tem uma pergunta só: avança sozinho */
      if (group.dataset.field === 'projectType' && current === 1) {
        window.setTimeout(function () { goTo(2); }, 260);
      }
    });
  });

  function stepEl(n) {
    return steps.filter(function (s) { return Number(s.dataset.step) === n; })[0];
  }
  function hideError(step) {
    if (!step) return;
    var err = step.querySelector('.wiz-error');
    if (err) err.hidden = true;
  }
  function showError(step) {
    var err = step.querySelector('.wiz-error');
    if (err) err.hidden = false;
  }

  function validate(n) {
    var step = stepEl(n);
    if (!step) return true;
    if (n === 3) {
      var name = document.getElementById('bf-name');
      var email = document.getElementById('bf-email');
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      name.classList.toggle('is-invalid', !name.value.trim());
      email.classList.toggle('is-invalid', !emailOk);
      if (!name.value.trim() || !emailOk) { showError(step); return false; }
      return true;
    }
    var groups = step.querySelectorAll('.chips[data-required="true"]');
    var ok = true;
    groups.forEach(function (g) {
      if (!answers[g.dataset.field]) ok = false;
    });
    if (!ok) showError(step);
    return ok;
  }

  function goTo(n) {
    if (n < 1 || n > total) return;
    current = n;
    steps.forEach(function (s) {
      s.classList.toggle('is-active', Number(s.dataset.step) === n);
    });
    if (label) label.textContent = String(n);
    if (fill) fill.style.width = (n / total) * 100 + '%';
    btnBack.hidden = n === 1;
    btnNext.hidden = n === total;
    btnSend.hidden = n !== total;
    var active = stepEl(n);
    var first = active && active.querySelector('input, .chip');
    if (first && window.matchMedia('(min-width: 721px)').matches) first.focus();
  }

  btnNext.addEventListener('click', function () {
    if (validate(current)) goTo(current + 1);
  });
  btnBack.addEventListener('click', function () { goTo(current - 1); });

  /* mensagem de WhatsApp montada a partir do brief */
  function buildMessage(data) {
    var lines = [];
    lines.push('Olá, NEXO Studio! Sou ' + data.name + (data.business ? ', do negócio ' + data.business : '') + '.');
    lines.push('');
    lines.push('— Projeto: ' + (data.projectType || '—'));
    lines.push('— Segmento: ' + (data.segment || '—'));
    lines.push('— Prazo: ' + (data.deadline || '—'));
    lines.push('— Investimento: ' + (data.budget || '—'));
    if (data.note) { lines.push('— Obs: ' + data.note); }
    lines.push('');
    lines.push('Podemos conversar?');
    return lines.join('\n');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate(3)) return;

    var data = {
      projectType: answers.projectType || '',
      segment: answers.segment || '',
      deadline: answers.deadline || '',
      budget: answers.budget || '',
      name: document.getElementById('bf-name').value.trim(),
      business: document.getElementById('bf-business').value.trim(),
      email: document.getElementById('bf-email').value.trim(),
      whatsapp: document.getElementById('bf-whats').value.trim(),
      note: document.getElementById('bf-msg').value.trim()
    };

    var waMessage = buildMessage(data);

    /* o backend exige name + email + message: o brief inteiro vai no message */
    var payload = {
      site: 'nexo-studio',
      name: data.name,
      email: data.email,
      message:
        'Brief do site (wizard NEXO):\n' +
        '- Projeto: ' + data.projectType + '\n' +
        '- Segmento: ' + data.segment + '\n' +
        '- Prazo: ' + data.deadline + '\n' +
        '- Investimento: ' + data.budget + '\n' +
        '- Negócio: ' + (data.business || '—') + '\n' +
        '- WhatsApp: ' + (data.whatsapp || '—') + '\n' +
        '- Obs: ' + (data.note || '—'),
      company: '' /* honeypot sempre vazio */
    };

    btnSend.disabled = true;
    btnSend.textContent = 'Enviando…';
    status.hidden = true;
    status.classList.remove('is-error');

    var showSuccess = function (sentOk) {
      steps.forEach(function (s) { s.classList.remove('is-active'); });
      wizNav.hidden = true;
      wizHead.hidden = true;
      success.hidden = false;
      var preview = document.getElementById('wa-preview');
      var openBtn = document.getElementById('wa-open');
      if (preview) preview.textContent = waMessage;
      if (openBtn) openBtn.href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(waMessage);
      if (!sentOk) {
        status.hidden = false;
        status.classList.add('is-error');
        status.textContent = 'Não conseguimos registrar o brief agora — mas sua mensagem está pronta acima, é só enviar no WhatsApp.';
      }
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    fetch(FORMS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) { return res.json(); })
      .then(function (json) { showSuccess(json && json.ok === true); })
      .catch(function () { showSuccess(false); })
      .finally(function () {
        btnSend.disabled = false;
        btnSend.textContent = 'Enviar & gerar mensagem';
      });
  });

  /* copiar mensagem */
  var copyBtn = document.getElementById('wa-copy');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var preview = document.getElementById('wa-preview');
      if (!preview || !navigator.clipboard) return;
      navigator.clipboard.writeText(preview.textContent).then(function () {
        copyBtn.textContent = 'Copiado ✕';
        window.setTimeout(function () { copyBtn.textContent = 'Copiar mensagem'; }, 2000);
      });
    });
  }
})();
