(() => {
  'use strict';

  const ENDPOINT = 'https://script.google.com/macros/s/AKfycbzwnq5YjykYa80K1RtK6aTWyc5iLqQJD0KEAcPvhHEKOE-pHxGKj_be-bXfCqs7R8R_/exec';
  let jsonpSeq = 0;

  function normalizeId(value) {
    return String(value ?? '').replace(/\D/g, '').slice(0, 6);
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
    try {
      const result = await jsonp({action: 'validate', id});
      return {ok: result && result.ok === true, id, reason: result && result.ok ? '' : 'not-found'};
    } catch (error) {
      return {ok: false, id, reason: 'network', error};
    }
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

  async function submit(payload) {
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

  window.PracticeTracker = Object.freeze({
    endpoint: ENDPOINT,
    normalizeId,
    validateId,
    makeSubmissionId,
    submit
  });
})();
