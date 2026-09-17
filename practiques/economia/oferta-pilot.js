(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  const idInput = $('supply-student-id');
  const validateBtn = $('supply-validate-id');
  const idStatus = $('supply-id-status');
  const submitBtn = $('supply-submit');
  const submitStatus = $('supply-submit-status');
  const tracker = window.PracticeTracker;

  if (!idInput || !validateBtn || !submitBtn || !tracker) return;

  const NQ = 13;
  const attempts = Array(NQ).fill(0);
  const lastChecked = Array(NQ).fill(null);
  let validatedId = '';
  let startedAt = null;
  let submitted = false;

  const justifications = [
    {id:'supply-just-1', question:'Moviment o desplaçament de l’oferta'},
    {id:'supply-just-2', question:'Efecte del preu de la salsa sobre l’oferta'},
    {id:'supply-just-3', question:'Efecte d’un impost sobre el productor i la quantitat ofertada'},
    {id:'supply-just-4', question:'Diferència entre impost i subvenció sobre l’oferta'}
  ];

  function answerControls() {
    return Array.from({length:NQ}, (_,i) => $(`supply-answer-${i+1}`)).filter(Boolean);
  }

  function setAnswersEnabled(enabled) {
    answerControls().forEach(el => el.disabled = !enabled);
    justifications.forEach(j => {
      const el = $(j.id);
      if (el) el.disabled = !enabled;
    });
    submitBtn.disabled = !enabled || submitted;
  }

  function setIdState(kind, text) {
    idStatus.className = `pilot-status ${kind || ''}`.trim();
    idStatus.textContent = text;
  }

  function resetWork() {
    answerControls().forEach((el, i) => {
      el.value = '';
      attempts[i] = 0;
      lastChecked[i] = null;
      const box = $(`supply-check-${i+1}`);
      if (box) {
        box.className = 'q-check blank';
        box.textContent = '·';
      }
    });
    justifications.forEach(j => {
      const el = $(j.id);
      if (el) el.value = '';
    });
    submitted = false;
    submitBtn.textContent = 'Entrega la pràctica';
    submitStatus.textContent = '';
  }

  function invalidateId() {
    if (!validatedId && !startedAt) {
      setAnswersEnabled(false);
      return;
    }
    validatedId = '';
    startedAt = null;
    resetWork();
    setAnswersEnabled(false);
    setIdState('', 'Valida el teu ID de 6 dígits per començar.');
  }

  async function validateStudent() {
    const id = tracker.normalizeId(idInput.value);
    idInput.value = id;
    validateBtn.disabled = true;
    setIdState('checking', 'Comprovant ID…');

    const result = await tracker.validateId(id);
    validateBtn.disabled = false;

    if (result.ok) {
      validatedId = result.id;
      startedAt = Date.now();
      resetWork();
      setAnswersEnabled(true);
      setIdState('ok', 'ID correcte · ja pots començar.');
      answerControls()[0]?.focus();
      return;
    }

    validatedId = '';
    startedAt = null;
    setAnswersEnabled(false);
    if (result.reason === 'format') setIdState('bad', 'L’ID ha de tenir 6 dígits.');
    else if (result.reason === 'not-found') setIdState('bad', 'Aquest ID no és a la llista d’alumnes.');
    else setIdState('bad', 'No s’ha pogut validar l’ID. Torna-ho a provar.');
  }

  function recordAttempt(i) {
    if (!validatedId) return;
    const control = $(`supply-answer-${i+1}`);
    if (!control) return;
    const value = String(control.value ?? '').trim();
    if (!value || value === lastChecked[i]) return;
    lastChecked[i] = value;
    attempts[i] += 1;
  }

  function currentResults() {
    const detail = [];
    let answered = 0, correct = 0;
    for (let i = 0; i < NQ; i++) {
      const control = $(`supply-answer-${i+1}`);
      const box = $(`supply-check-${i+1}`);
      const value = String(control?.value ?? '').trim();
      const isCorrect = !!box?.classList.contains('correct');
      if (value) answered += 1;
      if (isCorrect) correct += 1;
      detail.push({
        question: i + 1,
        answer: value,
        correct: isCorrect,
        attempts: attempts[i]
      });
    }
    return {detail, answered, correct};
  }

  function getJustifications() {
    return justifications.map(j => ({
      question: j.question,
      text: String($(j.id)?.value ?? '').trim()
    }));
  }

  async function submitPractice() {
    if (!validatedId) {
      setIdState('bad', 'Primer has de validar l’ID.');
      return;
    }

    const results = currentResults();
    if (results.answered < NQ) {
      submitStatus.className = 'pilot-submit-status bad';
      submitStatus.textContent = `Encara falten ${NQ - results.answered} respostes numèriques/conceptuals.`;
      return;
    }
    if (results.correct < NQ) {
      submitStatus.className = 'pilot-submit-status bad';
      submitStatus.textContent = `Revisa les respostes: n’hi ha ${NQ - results.correct} que encara no són correctes.`;
      return;
    }

    const justs = getJustifications();
    const short = justs.filter(j => j.text.length < 40);
    if (short.length) {
      submitStatus.className = 'pilot-submit-status bad';
      submitStatus.textContent = 'Completa les 4 justificacions (mínim orientatiu: 40 caràcters cadascuna).';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviant…';
    submitStatus.className = 'pilot-submit-status';
    submitStatus.textContent = 'Guardant l’entrega al registre…';

    const submissionId = tracker.makeSubmissionId('oferta', validatedId);
    const totalAttempts = attempts.reduce((a,b) => a+b, 0);
    const minutes = startedAt ? Math.max(1, Math.round((Date.now() - startedAt) / 60000)) : '';

    const payload = {
      submissionId,
      id: validatedId,
      practice: 'Pràctica 2a · Oferta',
      area: 'Economia',
      status: 'Entregada',
      total: NQ,
      correct: results.correct,
      attempts: totalAttempts,
      progress: Math.round(results.correct / NQ * 100),
      minutes,
      version: 'pilot-1',
      detail: {questions: results.detail},
      justifications: justs
    };

    const result = await tracker.submit(payload);
    if (result.ok) {
      submitted = true;
      submitBtn.textContent = 'Pràctica entregada';
      submitBtn.disabled = true;
      submitStatus.className = 'pilot-submit-status ok';
      submitStatus.textContent = 'Entrega registrada correctament.';
      answerControls().forEach(el => el.disabled = true);
      justifications.forEach(j => { const el = $(j.id); if (el) el.disabled = true; });
    } else {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Entrega la pràctica';
      submitStatus.className = 'pilot-submit-status bad';
      submitStatus.textContent = 'No s’ha pogut confirmar l’entrega. No es donarà per entregada; torna-ho a provar.';
    }
  }

  function wireAttempts() {
    for (let i = 0; i < NQ; i++) {
      const c = $(`supply-answer-${i+1}`);
      if (!c) continue;
      const handler = () => setTimeout(() => recordAttempt(i), 0);
      c.addEventListener('change', handler);
      if (c.tagName !== 'SELECT') c.addEventListener('blur', handler);
    }
  }

  idInput.maxLength = 6;
  idInput.value = '';
  idInput.placeholder = '6 dígits';
  idInput.addEventListener('input', () => {
    const normalized = tracker.normalizeId(idInput.value);
    if (idInput.value !== normalized) idInput.value = normalized;
    invalidateId();
  });
  idInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      validateStudent();
    }
  });
  validateBtn.addEventListener('click', validateStudent);
  submitBtn.addEventListener('click', submitPractice);

  wireAttempts();
  resetWork();
  setAnswersEnabled(false);
  setIdState('', 'Valida el teu ID de 6 dígits per començar.');
})();
