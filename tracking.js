(() => {
  'use strict';

  if (window.PracticeTracker?.version === 'v2') return;

  const ENDPOINT = 'https://script.google.com/macros/s/AKfycbzwnq5YjykYa80K1RtK6aTWyc5iLqQJD0KEAcPvhHEKOE-pHxGKj_be-bXfCqs7R8R_/exec';
  const SESSION_KEY = 'aula-interactiva-session-v2';
  let jsonpSeq = 0;
  let practiceStartedAt = Date.now();
  let leaveLogged = false;

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
    input.value = session.id;
    input.readOnly = true;
    setTimeout(() => {
      button.click();
      setTimeout(() => {
        input.readOnly = true;
        button.hidden = true;
        const wrap = input.closest('label');
        if (wrap) wrap.firstChild && (wrap.firstChild.textContent = session.role === 'teacher' ? 'Professor ' : 'ID alumne ');
      }, 120);
    }, 40);
  }

  function guardPractice() {
    if (!location.pathname.includes('/practiques/')) return;
    const session = getSession();
    if (!session) {
      redirectToPortal();
      return;
    }

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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', guardPractice);
  } else {
    setTimeout(guardPractice, 0);
  }

  window.PracticeTracker = Object.freeze({
    version: 'v2',
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
