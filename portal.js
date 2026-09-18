(() => {
  'use strict';

  const fallbackPractiques = {
    versio: 1,
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

  const configs = {
    practiques: fallbackPractiques,
    apunts: fallbackApunts
  };

  const qs = new URLSearchParams(location.search);
  let area = qs.get('area') === 'estadistica' ? 'estadistica' : 'economia';
  let mode = qs.get('mode') === 'apunts' ? 'apunts' : 'practiques';

  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));

  function saveState(){
    const u = new URL(location.href);
    u.searchParams.set('area', area);
    u.searchParams.set('mode', mode);
    history.replaceState(null, '', u);
  }

  function render(){
    const isApunts = mode === 'apunts';
    const config = configs[mode] || (isApunts ? fallbackApunts : fallbackPractiques);
    const a = config.arees?.[area] || config.arees?.economia;
    if(!a) return;

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
    const list = source.filter(p => p.visible !== false).sort((x,y) => (x.ordre || 0) - (y.ordre || 0));
    const grid = $('practice-grid');

    if(!list.length){
      grid.innerHTML = `<div class="portal-empty">${isApunts ? 'Encara no hi ha apunts publicats en aquesta àrea.' : 'No hi ha pràctiques visibles en aquesta àrea.'}</div>`;
      return;
    }

    grid.innerHTML = list.map(p => {
      const available = p.disponible === true;
      const status = available ? 'Disponible' : 'Properament';

      let buttons = '';
      if(isApunts){
        buttons = available
          ? `<a class="open-btn portal-link" href="${esc(p.fitxer)}" target="_blank" rel="noopener">Obrir apunts</a>`
          : `<button class="open-btn" disabled>Obrir apunts</button>`;
      } else {
        const pdfBtn = p.pdf
          ? (available
              ? `<a class="pdf-btn portal-link" href="${esc(p.pdf)}" target="_blank" rel="noopener">Veure PDF</a>`
              : `<button class="pdf-btn" disabled>Veure PDF</button>`)
          : '';
        const openBtn = available
          ? `<a class="open-btn portal-link" href="${esc(p.fitxer)}">Obrir pràctica</a>`
          : `<button class="open-btn" disabled>Obrir pràctica</button>`;
        buttons = `${pdfBtn}${openBtn}`;
      }

      return `<article class="practice-card ${available ? 'active' : 'disabled'}">
        <div>
          <div class="card-kicker">${esc(p.codi)} · ${status}</div>
          <div class="card-title">${esc(p.titol)}</div>
          <div class="card-desc">${esc(p.descripcio)}</div>
        </div>
        <div class="card-action">
          <span class="status-pill ${available ? 'available' : ''}">${status}</span>
          <div class="action-buttons">${buttons}</div>
        </div>
      </article>`;
    }).join('');
  }

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
    .then(r => { if(!r.ok) throw new Error('practiques'); return r.json(); })
    .then(c => { if(c?.arees) configs.practiques = c; render(); })
    .catch(() => render());

  fetch('apunts.json', {cache:'no-store'})
    .then(r => { if(!r.ok) throw new Error('apunts'); return r.json(); })
    .then(c => { if(c?.arees) configs.apunts = c; render(); })
    .catch(() => render());

  render();
})();
