/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 * https://github.com/SanjibBayen/cf-analytics-pro
 */

import { defineContentScript } from 'wxt/sandbox';

interface ProblemContext {
  id: string;
  contestId: number;
  index: string;
  type: 'problemset' | 'contest' | 'gym';
}

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

function getBookmarks(): string[] {
  try {
    return JSON.parse(localStorage.getItem('cf_bookmarks') || '[]');
  } catch {
    return [];
  }
}

function setBookmarks(ids: string[]): void {
  localStorage.setItem('cf_bookmarks', JSON.stringify(ids));
}

function rememberLastProblem(ctx: ProblemContext): void {
  localStorage.setItem(
    'cf_last_problem',
    JSON.stringify({ ...ctx, timestamp: Date.now() })
  );
}

function toggleBookmark(problemId: string): boolean {
  const bm = getBookmarks();
  const idx = bm.indexOf(problemId);
  if (idx >= 0) {
    bm.splice(idx, 1);
    setBookmarks(bm);
    return false;
  }
  bm.push(problemId);
  setBookmarks(bm);
  return true;
}

function starSvg(filled: boolean): string {
  const fill = filled ? '#f4c430' : '#c0c0c0';
  const stroke = filled ? '#d4a017' : '#999';
  return (
    '<svg viewBox="0 0 24 24" width="20" height="20" style="display:block;">' +
    '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" ' +
    'fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.2" stroke-linejoin="round"/></svg>'
  );
}

function createStarButton(problemId: string, size: 'small' | 'large'): HTMLElement {
  const isBookmarked = getBookmarks().includes(problemId);
  const wrapper = document.createElement('span');
  wrapper.className = 'cf-bookmark-star';
  wrapper.style.cssText =
    'cursor:pointer;display:inline-flex;align-items:center;justify-content:center;' +
    'width:' + (size === 'large' ? '32px' : '24px') + ';height:' + (size === 'large' ? '32px' : '24px') + ';' +
    'transition:transform 0.15s;user-select:none;vertical-align:middle;';
  wrapper.innerHTML = starSvg(isBookmarked);
  wrapper.title = isBookmarked ? 'Bookmarked' : 'Bookmark this problem';

  wrapper.addEventListener('mouseenter', () => { wrapper.style.transform = 'scale(1.15)'; });
  wrapper.addEventListener('mouseleave', () => { wrapper.style.transform = 'scale(1)'; });

  wrapper.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const now = toggleBookmark(problemId);
    wrapper.innerHTML = starSvg(now);
    wrapper.title = now ? 'Bookmarked' : 'Bookmark this problem';
    const label = wrapper.parentElement?.querySelector('.cf-bm-text');
    if (label) label.textContent = now ? 'Bookmarked' : 'Bookmark this problem';
  });

  return wrapper;
}

function findSidebarColumn(): Element | null {
  const boxes = document.querySelectorAll('.roundbox.sidebox');
  for (const box of Array.from(boxes)) {
    const txt = box.textContent || '';
    if (txt.includes('Submit?') || txt.includes('Problem tags')) {
      return (box.parentElement as Element) || null;
    }
  }
  return document.getElementById('sidebar');
}

function injectSidebarWidget(problemId: string): boolean {
  if (document.querySelector('.cf-bookmark-widget')) return true;

  const sidebar = findSidebarColumn();
  if (!sidebar) return false;

  const widget = document.createElement('div');
  widget.className = 'cf-bookmark-widget';
  widget.style.cssText = 'margin-top:6px;';
  widget.innerHTML =
    '<div class="roundbox sidebox" style="border:1px solid #e0e0e0;">' +
    '<div style="padding:7px 10px;background:#f8f9fa;border-bottom:1px solid #e0e0e0;color:#3B5998;font-size:13px;font-weight:bold;">CF Analytics Pro</div>' +
    '<div style="padding:10px;text-align:center;">' +
    '<span class="cf-bm-star-slot" style="display:inline-flex;"></span>' +
    '<span class="cf-bm-text" style="font-size:10px;color:#666;display:block;margin-top:4px;"></span>' +
    '</div>' +
    '</div>';

  sidebar.insertBefore(widget, sidebar.firstChild);

  const slot = widget.querySelector('.cf-bm-star-slot') as HTMLElement;
  const label = widget.querySelector('.cf-bm-text') as HTMLElement;
  const star = createStarButton(problemId, 'large');
  slot.appendChild(star);

  const isBookmarked = getBookmarks().includes(problemId);
  label.textContent = isBookmarked ? 'Bookmarked' : 'Bookmark this problem';

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

    console.log('[CF Analytics] Problem detected:', ctx.id, 'type:', ctx.type);

    rememberLastProblem(ctx);

    let attempts = 0;
    const MAX_ATTEMPTS = 40;
    const INTERVAL = 500;

    const tryInject = () => {
      if (document.querySelector('.cf-bookmark-star')) return;
      if (attempts++ > MAX_ATTEMPTS) {
        console.log('[CF Analytics] Bookmark injection gave up after', MAX_ATTEMPTS, 'attempts');
        return;
      }

      if (injectSidebarWidget(ctx.id)) {
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