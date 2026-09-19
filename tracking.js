(() => {
  'use strict';

  if (window.PracticeTracker?.version === 'v3') return;

  const ENDPOINT = 'https://script.google.com/macros/s/AKfycbzwnq5YjykYa80K1RtK6aTWyc5iLqQJD0KEAcPvhHEKOE-pHxGKj_be-bXfCqs7R8R_/exec';
  const SESSION_KEY = 'aula-interactiva-session-v2';
  let jsonpSeq = 0;
  let practiceStartedAt = Date.now();
  let leaveLogged = false;
  let serverTimeOffsetMs = 0;
  let practiceClosesAt = null;
  let accessTimer = null;

  function normalizeId(value) {
    return String(value ?? '').replace(/\D/g, '').slice(0, 6);
  }

  function fnv1a(text) {
    let h = 2166136261;
    for (const ch of String(text)) {
      h ^= ch.charCodeAt(0);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function isTeacherCode(id) {
    return fnv1a('aula-teacher-v3:' + String(id)) === 2813788514;
  }

  function getSession() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const session = JSON.parse(raw);
      if (!session || !/^\d{6}$/.test(String(session.id || ''))) return null;
      if (!['student', 'teacher'].includes(session.role)) return null;
      return session;
    } catch (_) {
      return null;
    }
  }

  function saveSession(id, role) {
    const session = {id: normalizeId(id), role, loggedAt: Date.now()};
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  }

  function clearSession() {
    sessionStorage.removeItem(SESSION_KEY);
  }

  function jsonp(params, timeoutMs = 8000) {
    return new Promise((resolve, reject) => {
      const callback = `__practiceTrackerCb${Date.now()}_${jsonpSeq++}`;
      const script = document.createElement('script');
      const timer = setTimeout(() => cleanup(new Error('Temps d’espera exhaurit')), timeoutMs);

      function cleanup(err, data) {
        clearTimeout(timer);
        try { delete window[callback]; } catch (_) { window[callback] = undefined; }
        if (script.parentNode) script.parentNode.removeChild(script);
        err ? reject(err) : resolve(data);
      }

      window[callback] = data => cleanup(null, data);
      const url = new URL(ENDPOINT);
      Object.entries({...params, callback}).forEach(([k, v]) => url.searchParams.set(k, String(v)));
      script.onerror = () => cleanup(new Error('No s’ha pogut contactar amb el registre'));
      script.src = url.toString();
      document.head.appendChild(script);
    });
  }

  async function validateId(value) {
    const id = normalizeId(value);
    if (!/^\d{6}$/.test(id)) return {ok: false, id, reason: 'format'};

    if (isTeacherCode(id)) {
      return {ok: true, id, role: 'teacher', reason: ''};
    }

    try {
      const result = await jsonp({action: 'validate', id});
      const ok = result && result.ok === true;
      if (!ok) return {ok: false, id, role: '', reason: 'not-found'};
      return {ok: true, id, role: 'student', reason: ''};
    } catch (error) {
      return {ok: false, id, reason: 'network', error};
    }
  }

  async function login(value) {
    const result = await validateId(value);
    if (!result.ok) return result;
    const session = saveSession(result.id, result.role || 'student');
    if (session.role === 'student') {
      logActivity('LOGIN', {practice: 'Portal', area: 'Sistema', title: 'Aula Interactiva'});
    }
    return {...result, session};
  }

  function logout() {
    clearSession();
  }

  function isTeacher() {
    return getSession()?.role === 'teacher';
  }

  function makeSubmissionId(practice, id) {
    const random = (window.crypto && crypto.getRandomValues)
      ? Array.from(crypto.getRandomValues(new Uint32Array(2))).map(n => n.toString(36)).join('')
      : Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    return `${practice}-${id}-${Date.now()}-${random}`;
  }

  async function confirmSubmission(submissionId, attempts = 7) {
    for (let i = 0; i < attempts; i++) {
      await new Promise(r => setTimeout(r, i === 0 ? 700 : 1200));
      try {
        const result = await jsonp({action: 'confirm', submissionId}, 8000);
        if (result && result.ok === true) return true;
      } catch (_) {}
    }
    return false;
  }

  function activityPayload(event, detail = {}) {
    const session = getSession();
    if (!session || session.role !== 'student') return null;

    return {
      submissionId: makeSubmissionId('activity', session.id),
      id: session.id,
      practice: detail.practice || 'Portal',
      area: detail.area || 'Sistema',
      status: 'Activitat',
      total: 0,
      correct: 0,
      attempts: 0,
      progress: Number.isFinite(detail.progress) ? Math.round(detail.progress) : '',
      minutes: Number.isFinite(detail.minutes) ? Math.max(0, Math.round(detail.minutes)) : '',
      version: 'activity-v1',
      detail: {
        event,
        page: detail.page || location.pathname,
        title: detail.title || document.title || '',
        ...(detail.extra || {})
      },
      justifications: []
    };
  }

  async function logActivity(event, detail = {}) {
    const payload = activityPayload(event, detail);
    if (!payload) return {ok: false, skipped: true};
    try {
      await fetch(ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-store',
        body: new URLSearchParams({payload: JSON.stringify(payload)})
      });
      return {ok: true};
    } catch (error) {
      return {ok: false, error};
    }
  }

  function logActivityBeacon(event, detail = {}) {
    const payload = activityPayload(event, detail);
    if (!payload || !navigator.sendBeacon) return false;
    try {
      const data = new URLSearchParams({payload: JSON.stringify(payload)}).toString();
      return navigator.sendBeacon(
        ENDPOINT,
        new Blob([data], {type: 'application/x-www-form-urlencoded;charset=UTF-8'})
      );
    } catch (_) {
      return false;
    }
  }

  async function submit(payload) {
    const session = getSession();
    if (session?.role === 'teacher') {
      return {ok: true, skipped: true, teacher: true};
    }

    const body = new URLSearchParams({payload: JSON.stringify(payload)});
    try {
      await fetch(ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-store',
        body
      });
    } catch (error) {
      return {ok: false, error};
    }
    const confirmed = await confirmSubmission(payload.submissionId);
    return {ok: confirmed};
  }

  function practiceMeta() {
    const path = location.pathname.toLowerCase();
    const area = path.includes('/economia/') ? 'Economia' : path.includes('/estadistica/') ? 'Estadística' : 'Sistema';
    return {
      area,
      title: document.title || 'Pràctica',
      practice: document.title || 'Pràctica'
    };
  }

  function estimateProgress() {
    const fill = document.querySelector('#progress-fill, #progressfill');
    if (fill) {
      const n = parseFloat(fill.style.width || '');
      if (Number.isFinite(n)) return Math.max(0, Math.min(100, n));
    }

    const checks = Array.from(document.querySelectorAll('.q-check'));
    if (checks.length) {
      const done = checks.filter(x => x.classList.contains('correct')).length;
      return done / checks.length * 100;
    }

    const stages = Array.from(document.querySelectorAll('.stage'));
    if (stages.length) {
      const done = stages.filter(x => x.classList.contains('done')).length;
      return done / stages.length * 100;
    }

    const controls = Array.from(document.querySelectorAll('input,select,textarea'))
      .filter(x => !/student-id|login-id/.test(x.id || '') && x.type !== 'file');
    if (controls.length) {
      const done = controls.filter(x => String(x.value || '').trim()).length;
      return done / controls.length * 100;
    }

    return NaN;
  }

  function redirectToPortal() {
    const next = location.pathname + location.search;
    location.replace('../../index.html?next=' + encodeURIComponent(next));
  }

  function findLegacyIdControls() {
    const pairs = [
      ['student-id', 'validate-id'],
      ['student-id', 'market-validate-id'],
      ['ppc-student-id', 'ppc-validate-id'],
      ['supply-student-id', 'supply-validate-id'],
      ['demand-student-id', 'demand-validate-id'],
      ['elas-student-id', 'elas-validate-id']
    ];

    for (const [inputId, buttonId] of pairs) {
      const input = document.getElementById(inputId);
      const button = document.getElementById(buttonId);
      if (input && button) return {input, button};
    }
    return null;
  }

  function hydrateLegacyId(session) {
    const controls = findLegacyIdControls();
    if (!controls) return;
    const {input, button} = controls;
    const teacher = session.role === 'teacher';
    input.value = session.id;
    input.readOnly = true;

    if (teacher) {
      input.style.visibility = 'hidden';
      input.setAttribute('aria-hidden', 'true');
      document.querySelectorAll('#id-status,.idstatus').forEach(el => { el.hidden = true; });
    }

    setTimeout(() => {
      button.click();
      setTimeout(() => {
        input.readOnly = true;
        button.hidden = true;
        const wrap = input.closest('label');
        if (teacher) {
          input.hidden = true;
          input.style.visibility = '';
          if (wrap?.firstChild) wrap.firstChild.textContent = 'Professor ';
          document.querySelectorAll('#id-status,.idstatus').forEach(el => {
            el.textContent = String(el.textContent || '').replaceAll(session.id, 'Professor');
          });
        } else if (wrap?.firstChild) {
          wrap.firstChild.textContent = 'ID alumne ';
        }
      }, 120);
    }, 40);
  }

  function normalizeRepoPath(value) {
    return String(value || '')
      .split('?')[0]
      .split('#')[0]
      .replace(/^\/+/, '')
      .replace(/\/+$/, '');
  }

  function parseAccessTime(value) {
    if (!value) return null;
    const ms = Date.parse(value);
    return Number.isFinite(ms) ? ms : null;
  }

  function currentAccessTime() {
    return Date.now() + serverTimeOffsetMs;
  }

  function accessState(practice, nowMs = currentAccessTime()) {
    if (!practice || practice.disponible !== true) {
      return {open: false, reason: 'unavailable', opensAt: null, closesAt: null};
    }

    const opensAt = parseAccessTime(practice.obertura);
    const closesAt = parseAccessTime(practice.tancament);

    if (opensAt !== null && nowMs < opensAt) {
      return {open: false, reason: 'not-open-yet', opensAt, closesAt};
    }
    if (closesAt !== null && nowMs >= closesAt) {
      return {open: false, reason: 'closed', opensAt, closesAt};
    }
    return {open: true, reason: '', opensAt, closesAt};
  }

  function formatAccessDate(ms) {
    if (!Number.isFinite(ms)) return '';
    return new Intl.DateTimeFormat('ca-ES', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Europe/Madrid'
    }).format(new Date(ms));
  }

  function showBlockedPractice(reason, whenMs = null) {
    if (accessTimer) {
      clearInterval(accessTimer);
      accessTimer = null;
    }

    const heading = reason === 'not-open-yet'
      ? 'Aquesta pràctica encara no està oberta'
      : reason === 'closed'
        ? 'Aquesta pràctica està tancada'
        : reason === 'verification'
          ? 'No s’ha pogut verificar l’accés'
          : 'Aquesta pràctica no està disponible';

    const detail = reason === 'not-open-yet' && whenMs
      ? `S’obrirà el ${formatAccessDate(whenMs)}.`
      : reason === 'closed' && whenMs
        ? `L’accés es va tancar el ${formatAccessDate(whenMs)}.`
        : reason === 'verification'
          ? 'Torna al portal i prova-ho de nou.'
          : 'Consulta el portal de l’assignatura per veure les pràctiques disponibles.';

    document.title = heading;
    document.body.innerHTML = `
      <main style="min-height:100vh;display:grid;place-items:center;padding:24px;background:#f4f1eb;color:#202427;font-family:Inter,Segoe UI,Arial,sans-serif">
        <section style="width:min(560px,100%);background:#fbfaf7;border:1px solid #d8d4cc;border-radius:16px;padding:30px;box-shadow:0 12px 32px rgba(38,40,42,.08)">
          <div style="font-size:11px;letter-spacing:.09em;text-transform:uppercase;font-weight:800;color:#6f7478">Aula Interactiva</div>
          <h1 style="font-size:25px;line-height:1.15;margin:10px 0 10px">${heading}</h1>
          <p style="font-size:14px;line-height:1.55;color:#5b6065;margin:0 0 22px">${detail}</p>
          <a href="../../index.html" style="display:inline-block;background:#44484c;color:#fff;text-decoration:none;border-radius:9px;padding:10px 14px;font-weight:750;font-size:13px">Tornar al portal</a>
        </section>
      </main>`;
  }

  async function loadPracticeAccess() {
    try {
      const response = await fetch('../../practiques.json', {cache: 'no-store'});
      if (!response.ok) throw new Error('config');

      const serverDate = response.headers.get('Date');
      if (serverDate) {
        const serverMs = Date.parse(serverDate);
        if (Number.isFinite(serverMs)) serverTimeOffsetMs = serverMs - Date.now();
      }

      const config = await response.json();
      const current = normalizeRepoPath(location.pathname);
      const areas = Object.values(config?.arees || {});

      for (const area of areas) {
        const found = (area?.practiques || []).find(p => {
          const target = normalizeRepoPath(p.fitxer);
          return target && (current === target || current.endsWith('/' + target));
        });
        if (found) return found;
      }
      return null;
    } catch (_) {
      return undefined;
    }
  }

  function startPractice(session) {
    hydrateLegacyId(session);
    practiceStartedAt = Date.now();
    leaveLogged = false;
    const meta = practiceMeta();

    logActivity('OPEN_PRACTICE', {
      practice: meta.practice,
      area: meta.area,
      title: meta.title
    });

    window.addEventListener('pagehide', () => {
      if (leaveLogged) return;
      leaveLogged = true;
      logActivityBeacon('LEAVE_PRACTICE', {
        practice: meta.practice,
        area: meta.area,
        title: meta.title,
        minutes: (Date.now() - practiceStartedAt) / 60000,
        progress: estimateProgress()
      });
    }, {once: true});

    if (Number.isFinite(practiceClosesAt)) {
      accessTimer = setInterval(() => {
        if (currentAccessTime() >= practiceClosesAt) {
          if (!leaveLogged) {
            leaveLogged = true;
            logActivityBeacon('LEAVE_PRACTICE', {
              practice: meta.practice,
              area: meta.area,
              title: meta.title,
              minutes: (Date.now() - practiceStartedAt) / 60000,
              progress: estimateProgress(),
              extra: {reason: 'access-closed'}
            });
          }
          showBlockedPractice('closed', practiceClosesAt);
        }
      }, 15000);
    }
  }

  async function guardPractice() {
    if (!location.pathname.includes('/practiques/')) return;

    const session = getSession();
    if (!session) {
      redirectToPortal();
      return;
    }

    if (session.role === 'teacher') {
      startPractice(session);
      return;
    }

    const practice = await loadPracticeAccess();
    if (practice === undefined) {
      showBlockedPractice('verification');
      return;
    }
    if (!practice) {
      showBlockedPractice('unavailable');
      return;
    }

    const state = accessState(practice);
    if (!state.open) {
      showBlockedPractice(
        state.reason,
        state.reason === 'not-open-yet' ? state.opensAt : state.closesAt
      );
      return;
    }

    practiceClosesAt = state.closesAt;
    startPractice(session);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', guardPractice);
  } else {
    setTimeout(guardPractice, 0);
  }

  window.PracticeTracker = Object.freeze({
    version: 'v3',
    endpoint: ENDPOINT,
    normalizeId,
    validateId,
    login,
    logout,
    getSession,
    isTeacher,
    makeSubmissionId,
    submit,
    logActivity
  });
})();
