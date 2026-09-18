/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 * https://github.com/SanjibBayen/cf-analytics-pro
 */

interface LastProblem {
  id: string;
  contestId: number;
  index: string;
  type: 'problemset' | 'contest' | 'gym';
  timestamp: number;
}

const MAX_AGE_MS = 60 * 60 * 1000;

function readLastProblem(): LastProblem | null {
  try {
    const raw = localStorage.getItem('cf_last_problem');
    if (!raw) return null;
    const data = JSON.parse(raw) as LastProblem;
    if (Date.now() - data.timestamp > MAX_AGE_MS) return null;
    return data;
  } catch {
    return null;
  }
}

interface SubmitContext {
  kind: 'problemset' | 'contest' | 'gym';
  contestId?: number;
}

function detectSubmitPage(): SubmitContext | null {
  const path = window.location.pathname;

  if (path.startsWith('/problemset/submit')) return { kind: 'problemset' };

  const contestMatch = path.match(/\/contest\/(\d+)\/submit/);
  if (contestMatch) return { kind: 'contest', contestId: +contestMatch[1] };

  const gymMatch = path.match(/\/gym\/(\d+)\/submit/);
  if (gymMatch) return { kind: 'gym', contestId: +gymMatch[1] };

  return null;
}

function markAutoFilled(el: HTMLElement): void {
  const prevOutline = el.style.outline;
  const prevTransition = el.style.transition;
  const prevOffset = el.style.outlineOffset;

  el.style.transition = 'outline 0.4s ease';
  el.style.outline = '2px solid rgba(63,81,181,0.55)';
  el.style.outlineOffset = '2px';

  setTimeout(() => {
    el.style.outline = prevOutline;
    el.style.outlineOffset = prevOffset;
    el.style.transition = prevTransition;
  }, 900);

  const parent = el.parentElement;
  if (parent && !parent.querySelector('.cf-autofill-note')) {
    const note = document.createElement('span');
    note.className = 'cf-autofill-note';
    note.textContent = 'Auto-filled by CF Analytics Pro';
    note.style.cssText = 'font-size:10px;color:#3f51b5;margin-left:8px;';
    parent.appendChild(note);
    setTimeout(() => note.remove(), 2600);
  }
}

function fillTextInput(input: HTMLInputElement, value: string): boolean {
  if (input.disabled || input.value.trim()) return false;
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
  return true;
}

function fillSelect(select: HTMLSelectElement, value: string): boolean {
  if (select.disabled || select.value) return false;
  const opt = Array.from(select.options).find((o) => o.value === value);
  if (!opt) return false;
  select.value = value;
  select.dispatchEvent(new Event('change', { bubbles: true }));
  return true;
}

const TEXT_INPUT_SELECTORS = [
  'input[name="submittedProblemCode"]',
  'input[name="submittedProblemIndex"]',
];

const SELECT_INPUT_SELECTORS = [
  'select[name="submittedProblemIndex"]',
  'select[name="submittedProblemCode"]',
];

export function runSmartSubmit(): void {
  const last = readLastProblem();
  if (!last) return;

  const submit = detectSubmitPage();
  if (!submit) return;

  if (submit.kind === 'contest') {
    if (last.type !== 'contest' || last.contestId !== submit.contestId) return;
  } else if (submit.kind === 'gym') {
    if (last.type !== 'gym' || last.contestId !== submit.contestId) return;
  } else if (submit.kind === 'problemset') {
    if (last.type !== 'problemset') return;
  }

  const value = submit.kind === 'problemset' ? last.id : last.index;

  for (const sel of TEXT_INPUT_SELECTORS) {
    const input = document.querySelector<HTMLInputElement>(sel);
    if (input && fillTextInput(input, value)) {
      markAutoFilled(input);
      console.log('[CF Analytics] Smart Submit filled', sel, 'with', value);
      return;
    }
  }

  for (const sel of SELECT_INPUT_SELECTORS) {
    const select = document.querySelector<HTMLSelectElement>(sel);
    if (select && fillSelect(select, value)) {
      markAutoFilled(select);
      console.log('[CF Analytics] Smart Submit selected', sel, 'with', value);
      return;
    }
  }
}