
(() => {
  'use strict';
  const fallback = {"versio":1,"ajuda":"Canvia visible a false per amagar una targeta. Canvia disponible a true/false per activar o desactivar l'accés. ordre controla la posició.","arees":{"economia":{"nom":"Economia","simbol":"E","eyebrow":"Introducció a l'economia","titol":"Pràctiques interactives","subtitol":"Activitats del curs en un únic espai. Les noves pràctiques s’aniran incorporant aquí.","practiques":[{"id":"fpp","ordre":1,"visible":true,"disponible":true,"codi":"Pràctica 1","titol":"Frontera de possibilitats de producció","descripcio":"Escassetat, eficiència, moviments i desplaçaments de la FPP i cost d'oportunitat.","fitxer":"practiques/economia/fpp.html","pdf":"assets/pdf/fpp.pdf"},{"id":"oferta","ordre":2,"visible":true,"disponible":true,"codi":"Pràctica 2a","titol":"Funció i corba d’oferta","descripcio":"Moviments i desplaçaments de l’oferta, costos de producció, impostos i subvencions.","fitxer":"practiques/economia/oferta.html","pdf":"assets/pdf/oferta.pdf"},{"id":"demanda","ordre":3,"visible":true,"disponible":true,"codi":"Pràctica 2b","titol":"Funció i corba de demanda","descripcio":"Moviments i desplaçaments de la demanda, renda i preus de béns substitutius i complements.","fitxer":"practiques/economia/demanda.html","pdf":"assets/pdf/demanda.pdf"},{"id":"equilibri","ordre":4,"visible":true,"disponible":false,"codi":"Pràctica 2c","titol":"Equilibri de mercat","descripcio":"Oferta, demanda, equilibri, canvis en les condicions del mercat, impostos i subvencions.","fitxer":"practiques/economia/equilibri.html","pdf":"assets/pdf/equilibri.pdf"},{"id":"elasticitat","ordre":5,"visible":true,"disponible":false,"codi":"Pràctica 3","titol":"Elasticitat-preu de la demanda","descripcio":"Mètode del punt mig, demanda elàstica i inelàstica, i relació entre preu i despesa total.","fitxer":"practiques/economia/elasticitat.html","pdf":"assets/pdf/elasticitat.pdf"}]},"estadistica":{"nom":"Estadística","simbol":"Σ","eyebrow":"Estadística","titol":"Pràctiques interactives","subtitol":"Laboratoris de dades per calcular, visualitzar i interpretar estadístics amb suport d’Excel.","practiques":[{"id":"descriptiva-1d","ordre":1,"visible":true,"disponible":true,"codi":"Pràctica 1","titol":"Estadística descriptiva unidimensional","descripcio":"Dades, distribucions, mesures de centre i dispersió, quartils, valors extrems i interpretació amb Excel.","fitxer":"practiques/estadistica/descriptiva-1d.html","pdf":null}]}}};
  let config = fallback;
  const qs = new URLSearchParams(location.search);
  let area = qs.get('area') === 'estadistica' ? 'estadistica' : 'economia';

  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function render(){
    const a = config.arees[area] || config.arees.economia;
    $('hub-eyebrow').textContent = a.eyebrow;
    $('hub-title').textContent = a.titol;
    $('hub-sub').textContent = a.subtitol;
    $('area-mark').textContent = a.simbol;
    const other = area === 'economia' ? 'Estadística' : 'Economia';
    $('area-mark').title = `Canvia a ${other}`;
    $('area-mark').setAttribute('aria-label', `Canvia a ${other}`);
    $('area-note').textContent = `${a.nom} · prem ${a.simbol} per canviar d’àrea`;

    const list = (a.practiques || []).filter(p => p.visible !== false).sort((x,y)=>(x.ordre||0)-(y.ordre||0));
    const grid = $('practice-grid');
    if(!list.length){ grid.innerHTML = '<div class="portal-empty">No hi ha pràctiques visibles en aquesta àrea.</div>'; return; }
    grid.innerHTML = list.map(p => {
      const available = p.disponible === true;
      const status = available ? 'Disponible' : 'Properament';
      const pdfBtn = p.pdf
        ? (available ? `<a class="pdf-btn portal-link" href="${esc(p.pdf)}" target="_blank" rel="noopener">Veure PDF</a>` : `<button class="pdf-btn" disabled>Veure PDF</button>`)
        : '';
      const openBtn = available
        ? `<a class="open-btn portal-link" href="${esc(p.fitxer)}">Obrir pràctica</a>`
        : `<button class="open-btn" disabled>Obrir pràctica</button>`;
      return `<article class="practice-card ${available?'active':'disabled'}">
        <div><div class="card-kicker">${esc(p.codi)} · ${status}</div><div class="card-title">${esc(p.titol)}</div><div class="card-desc">${esc(p.descripcio)}</div></div>
        <div class="card-action"><span class="status-pill ${available?'available':''}">${status}</span><div class="action-buttons">${pdfBtn}${openBtn}</div></div>
      </article>`;
    }).join('');
  }

  $('area-mark').addEventListener('click', () => {
    area = area === 'economia' ? 'estadistica' : 'economia';
    const u = new URL(location.href); u.searchParams.set('area', area); history.replaceState(null,'',u);
    render();
  });

  fetch('practiques.json', {cache:'no-store'})
    .then(r => { if(!r.ok) throw new Error('config'); return r.json(); })
    .then(c => { if(c && c.arees) config = c; render(); })
    .catch(() => render());
  render();
})();
