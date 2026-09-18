/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 * https://github.com/SanjibBayen/cf-analytics-pro
 */

import type { ProblemSite } from '@/core/types';
import { getLastProblem } from '@/core/storage';
import { LAST_PROBLEM_TTL_MS } from '@/core/constants';

interface SubmitContext {
  kind: ProblemSite;
  contestId?: number;
}

const TEXT_INPUT_SELECTORS = [
  'input[name="submittedProblemCode"]',
  'input[name="submittedProblemIndex"]',
];

const SELECT_INPUT_SELECTORS = [
  'select[name="submittedProblemIndex"]',
  'select[name="submittedProblemCode"]',
];

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
}

function fillText(input: HTMLInputElement, value: string): boolean {
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

export function runSmartSubmit(): void {
  const last = getLastProblem(LAST_PROBLEM_TTL_MS);
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
    if (input && fillText(input, value)) {
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
