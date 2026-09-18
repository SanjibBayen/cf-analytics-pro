/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 * https://github.com/SanjibBayen/cf-analytics-pro
 */

import { defineContentScript } from 'wxt/sandbox';
import { rememberLastProblem } from '@/core/storage';
import { createStarButton, createSidebarWidget } from '@/features/bookmarks';
import type { ProblemContext, ProblemSite } from '@/core/types';

function detectProblem(): ProblemContext | null {
  const path = window.location.pathname;

  let m = path.match(/\/problemset\/problem\/(\d+)\/(\w+)/);
  if (m) return { id: m[1] + m[2], contestId: +m[1], index: m[2], type: 'problemset' };

  m = path.match(/\/contest\/(\d+)\/problem\/(\w+)/);
  if (m) return { id: m[1] + m[2], contestId: +m[1], index: m[2], type: 'contest' };

  m = path.match(/\/problemset\/gymProblem\/(\d+)\/(\w+)/);
  if (m) return { id: m[1] + m[2], contestId: +m[1], index: m[2], type: 'gym' };

  m = path.match(/\/gym\/(\d+)\/problem\/(\w+)/);
  if (m) return { id: m[1] + m[2], contestId: +m[1], index: m[2], type: 'gym' };

  return null;
}

function findSidebar(): Element | null {
  const boxes = document.querySelectorAll('.roundbox.sidebox');
  for (const box of Array.from(boxes)) {
    const txt = box.textContent || '';
    if (txt.includes('Submit?') || txt.includes('Problem tags')) {
      return (box.parentElement as Element) || null;
    }
  }
  return document.getElementById('sidebar');
}

function injectSidebar(problemId: string): boolean {
  if (document.querySelector('.cf-bookmark-widget')) return true;

  const sidebar = findSidebar();
  if (!sidebar) return false;

  sidebar.insertBefore(createSidebarWidget(problemId), sidebar.firstChild);
  return true;
}

function injectNextToTitle(problemId: string): boolean {
  if (document.querySelector('.cf-bookmark-star')) return true;

  let titleEl: Element | null = document.querySelector('.problem-statement .header .title');
  if (!titleEl) titleEl = document.querySelector('.header .title');
  if (!titleEl) titleEl = document.querySelector('.title');
  if (!titleEl) return false;

  const star = createStarButton(problemId, 'small');
  star.style.marginLeft = '8px';
  titleEl.appendChild(star);
  return true;
}

export default defineContentScript({
  matches: [
    'https://codeforces.com/problemset/problem/*',
    'https://codeforces.com/problemset/gymProblem/*',
    'https://codeforces.com/contest/*/problem/*',
    'https://codeforces.com/gym/*/problem/*',
  ],
  runAt: 'document_idle',
  main() {
    const ctx = detectProblem();
    if (!ctx) return;

    rememberLastProblem(ctx);

    let attempts = 0;
    const MAX = 40;
    const INTERVAL = 500;

    const tryInject = () => {
      if (document.querySelector('.cf-bookmark-star')) return;
      if (attempts++ > MAX) {
        console.log('[CF Analytics] Bookmark injection gave up');
        return;
      }
      if (injectSidebar(ctx.id)) {
        console.log('[CF Analytics] Bookmark widget injected into sidebar');
        return;
      }
      if (injectNextToTitle(ctx.id)) {
        console.log('[CF Analytics] Bookmark star injected next to title');
        return;
      }
      setTimeout(tryInject, INTERVAL);
    };

    setTimeout(tryInject, 300);
  },
});
