(() => {
  'use strict';

  const tracker = window.PracticeTracker;
  const fallbackPractiques = {
    versio: 2,
    arees: {
      economia: {
        nom: 'Economia', simbol: 'E', eyebrow: "Introducció a l'economia",
        titol: 'Pràctiques interactives',
        subtitol: 'Activitats del curs. Les noves pràctiques s’aniran incorporant aquí.',
        practiques: []
      },
      estadistica: {
        nom: 'Estadística', simbol: 'Σ', eyebrow: 'Estadística',
        titol: 'Pràctiques interactives',
        subtitol: 'Laboratoris de dades per calcular, visualitzar i interpretar estadístics amb suport d’Excel.',
        practiques: []
      }
    }
  };

  const fallbackApunts = {
    versio: 1,
    arees: {
      economia: {
        nom: 'Economia', simbol: 'E', eyebrow: "Introducció a l'economia",
        titol: 'Apunts',
        subtitol: 'Materials de teoria de l’assignatura. Els temes s’aniran incorporant progressivament.',
        apunts: []
      },
      estadistica: {
        nom: 'Estadística', simbol: 'Σ', eyebrow: 'Estadística',
        titol: 'Apunts',
        subtitol: 'Materials de teoria per preparar les pràctiques i repassar els conceptes del curs.',
        apunts: [{
          id: 'tema-1-descriptiva-unidimensional', ordre: 1, visible: true, disponible: true,
          codi: 'Tema 1', titol: 'Estadística descriptiva unidimensional',
          descripcio: 'Dades i freqüències, mesures de centre, dispersió, quartils, valors atípics, boxplot i interpretació conjunta d’una distribució.',
          fitxer: 'apunts/estadistica/tema-1-descriptiva-unidimensional.pdf'
        }]
      }
    }
  };

  const configs = {practiques: fallbackPractiques, apunts: fallbackApunts};
  const qs = new URLSearchParams(location.search);
  let area = qs.get('area') === 'estadistica' ? 'estadistica' : 'economia';
  let mode = qs.get('mode') === 'apunts' ? 'apunts' : 'practiques';

  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));

  function setLoginStatus(kind, text) {
    const el = $('login-status');
    el.className = 'login-status ' + (kind || '');
    el.textContent = text || '';
  }

  function normalizeLoginInput() {
    const input = $('login-id');
    input.value = tracker.normalizeId(input.value);
    return input.value;
  }

  function saveState() {
    const u = new URL(location.href);
    u.searchParams.set('area', area);
    u.searchParams.set('mode', mode);
    u.searchParams.delete('next');
    history.replaceState(null, '', u);
  }

  function showPortal(session) {
    $('login-view').classList.add('hidden');
    $('hub-view').classList.remove('hidden');
    const teacher = session.role === 'teacher';
    $('session-role').textContent = teacher ? 'Professor' : 'ID';
    $('session-id').textContent = teacher ? '' : session.id;
    $('session-id').hidden = teacher;
    render();
  }

  function showLogin() {
    $('hub-view').classList.add('hidden');
    $('login-view').classList.remove('hidden');
    $('login-id').focus();
  }

  async function handleLogin() {
    const id = normalizeLoginInput();
    $('login-button').disabled = true;
    setLoginStatus('checking', 'Comprovant codi…');

    const result = await tracker.login(id);
    $('login-button').disabled = false;

    if (!result.ok) {
      setLoginStatus(
        'bad',
        result.reason === 'format' ? 'El codi ha de tenir 6 dígits.' :
        result.reason === 'not-found' ? 'Aquest codi no correspon a cap alumne.' :
        'No s’ha pogut validar el codi. Torna-ho a provar.'
      );
      return;
    }

    setLoginStatus('ok', 'Codi correcte · entrant…');
    const next = qs.get('next');
    if (next && next.startsWith('/')) {
      setTimeout(() => { location.href = next; }, 180);
      return;
    }
    setTimeout(() => showPortal(result.session), 120);
  }

  function render() {
    const session = tracker.getSession();
    if (!session) {
      showLogin();
      return;
    }

    const teacher = session.role === 'teacher';
    const isApunts = mode === 'apunts';
    const config = configs[mode] || (isApunts ? fallbackApunts : fallbackPractiques);
    const a = config.arees?.[area] || config.arees?.economia;
    if (!a) return;

    $('hub-eyebrow').textContent = a.eyebrow || a.nom || '';
    $('hub-title').textContent = a.titol || (isApunts ? 'Apunts' : 'Pràctiques interactives');
    $('hub-sub').textContent = a.subtitol || '';

    $('area-mark').textContent = a.simbol || (area === 'economia' ? 'E' : 'Σ');
    const otherArea = area === 'economia' ? 'Estadística' : 'Economia';
    $('area-mark').title = `Canvia a ${otherArea}`;
    $('area-mark').setAttribute('aria-label', `Canvia a ${otherArea}`);

    $('content-mark').textContent = isApunts ? 'A' : 'P';
    const otherMode = isApunts ? 'Pràctiques' : 'Apunts';
    $('content-mark').title = `Canvia a ${otherMode}`;
    $('content-mark').setAttribute('aria-label', `Canvia a ${otherMode}`);

    $('area-note').textContent = `${a.nom} · ${isApunts ? 'Apunts' : 'Pràctiques'} · ${a.simbol} canvia l’àrea · ${isApunts ? 'A' : 'P'} canvia Apunts/Pràctiques`;

    const source = isApunts ? (a.apunts || []) : (a.practiques || []);
    const list = source
      .filter(p => teacher || p.visible !== false)
      .sort((x, y) => (x.ordre || 0) - (y.ordre || 0));
    const grid = $('practice-grid');

    if (!list.length) {
      grid.innerHTML = `<div class="portal-empty">${isApunts ? 'Encara no hi ha apunts publicats en aquesta àrea.' : 'No hi ha pràctiques visibles en aquesta àrea.'}</div>`;
      return;
    }

    function cardHtml(p) {
      const published = p.disponible === true;
      const canOpen = published || teacher;
      const preview = teacher && !published;
      const status = preview ? 'Professor' : published ? 'Disponible' : 'Properament';

      let buttons = '';
      if (isApunts) {
        buttons = canOpen
          ? `<a class="open-btn portal-link material-link" data-title="${esc(p.titol)}" data-area="${esc(a.nom)}" href="${esc(p.fitxer)}" target="_blank" rel="noopener">Obrir apunts</a>`
          : '<button class="open-btn" disabled>Obrir apunts</button>';
      } else {
        const pdfBtn = p.pdf
          ? (canOpen
              ? `<a class="pdf-btn portal-link material-link" data-title="${esc(p.titol)} · PDF" data-area="${esc(a.nom)}" href="${esc(p.pdf)}" target="_blank" rel="noopener">Veure PDF</a>`
              : '<button class="pdf-btn" disabled>Veure PDF</button>')
          : '';
        const openBtn = canOpen
          ? `<a class="open-btn portal-link" href="${esc(p.fitxer)}">Obrir pràctica</a>`
          : '<button class="open-btn" disabled>Obrir pràctica</button>';
        buttons = pdfBtn + openBtn;
      }

      return `<article class="practice-card ${canOpen ? 'active' : 'disabled'} ${preview ? 'teacher-preview' : ''}">
        <div>
          <div class="card-kicker">${esc(p.codi)} · ${status}</div>
          <div class="card-title">${esc(p.titol)}</div>
          <div class="card-desc">${esc(p.descripcio)}</div>
        </div>
        <div class="card-action">
          <span class="status-pill ${published ? 'available' : ''} ${preview ? 'teacher' : ''}">${status}</span>
          <div class="action-buttons">${buttons}</div>
        </div>
      </article>`;
    }

    if (!isApunts && area === 'estadistica') {
      const groups = new Map();
      list.forEach(p => {
        const tema = Number.isFinite(Number(p.tema)) ? Number(p.tema) : 99;
        if (!groups.has(tema)) groups.set(tema, []);
        groups.get(tema).push(p);
      });

      grid.classList.add('topic-layout');
      grid.innerHTML = [...groups.entries()]
        .sort((x, y) => x[0] - y[0])
        .map(([tema, items]) => {
          items.sort((x, y) => (x.ordre || 0) - (y.ordre || 0));
          if (tema === 0) {
            return `<section class="practice-topic intro-topic">
              <div class="topic-cards single-card">${items.map(cardHtml).join('')}</div>
            </section>`;
          }
          const heading = items[0]?.temaTitol || `Tema ${tema}`;
          return `<section class="practice-topic">
            <div class="topic-heading">${esc(heading)}</div>
            <div class="topic-cards">${items.map(cardHtml).join('')}</div>
          </section>`;
        }).join('');
    } else {
      grid.classList.remove('topic-layout');
      grid.innerHTML = list.map(cardHtml).join('');
    }

    grid.querySelectorAll('.material-link').forEach(link => {
      link.addEventListener('click', () => {
        tracker.logActivity('OPEN_MATERIAL', {
          practice: link.dataset.title || 'Material',
          area: link.dataset.area || a.nom,
          title: link.dataset.title || ''
        });
      });
    });
  }

  $('login-id').addEventListener('input', normalizeLoginInput);
  $('login-id').addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleLogin();
    }
  });
  $('login-button').addEventListener('click', handleLogin);

  $('logout-button').addEventListener('click', () => {
    tracker.logout();
    location.href = 'index.html';
  });

  $('area-mark').addEventListener('click', () => {
    area = area === 'economia' ? 'estadistica' : 'economia';
    saveState();
    render();
  });

  $('content-mark').addEventListener('click', () => {
    mode = mode === 'practiques' ? 'apunts' : 'practiques';
    saveState();
    render();
  });

  fetch('practiques.json', {cache:'no-store'})
    .then(r => { if (!r.ok) throw new Error('practiques'); return r.json(); })
    .then(c => { if (c?.arees) configs.practiques = c; render(); })
    .catch(() => render());

  fetch('apunts.json', {cache:'no-store'})
    .then(r => { if (!r.ok) throw new Error('apunts'); return r.json(); })
    .then(c => { if (c?.arees) configs.apunts = c; render(); })
    .catch(() => render());

  const session = tracker.getSession();
  if (session) {
    showPortal(session);
    if (session.role === 'student') {
      tracker.logActivity('OPEN_PORTAL', {practice: 'Portal', area: 'Sistema', title: 'Aula Interactiva'});
    }
  } else {
    showLogin();
  }
})();
