/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 * https://github.com/SanjibBayen/cf-analytics-pro
 */

import type { Problem } from '@/types';
import { getRatingClass } from '@/utils/chart-colors';

export function renderUnsolvedTab(container: HTMLElement, problems: Problem[], isOwnProfile: boolean): void {
  const unsolvedList = problems.filter((p) => !p.solved && p.attempts > 0);
  const stuck = unsolvedList.filter((p) => p.attempts >= 5).sort((a, b) => (a.rating || 0) - (b.rating || 0));
  const close = unsolvedList.filter((p) => p.attempts >= 3 && p.attempts < 5).sort((a, b) => (a.rating || 0) - (b.rating || 0));
  const fresh = unsolvedList.filter((p) => p.attempts < 3).sort((a, b) => (a.rating || 0) - (b.rating || 0));
  
  let html = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">';
  html += '<div class="title-small" style="margin:0;">Unsolved</div>';
  html += '<span style="font-size:11px;color:#888;">' + unsolvedList.length + ' problems</span>';
  html += '</div>';

  if (isOwnProfile) {
    const bookmarks: string[] = JSON.parse(localStorage.getItem('cf_bookmarks') || '[]');
    if (bookmarks.length > 0) {
      const bookmarkedProblems = problems.filter((p) => bookmarks.includes(p.id));
      const notFoundBookmarks = bookmarks.filter((b) => !problems.some((p) => p.id === b));
      
      if (bookmarkedProblems.length > 0 || notFoundBookmarks.length > 0) {
        html += '<div style="margin-bottom:16px;">';
        html += '<div style="font-weight:600;font-size:11px;color:#3f51b5;margin-bottom:6px;">Bookmarked (' + bookmarks.length + ')</div>';
        html += '<div style="display:flex;flex-wrap:wrap;gap:3px;">';
        for (const p of bookmarkedProblems) html += renderProblemLink(p);
        for (const bid of notFoundBookmarks) html += renderUnknownBookmark(bid);
        html += '</div></div>';
      }
    }
  }

  if (stuck.length > 0) {
    html += '<div style="margin-bottom:16px;">';
    html += '<div style="font-weight:600;font-size:11px;color:#c0392b;margin-bottom:4px;">Stuck (' + stuck.length + ')</div>';
    html += '<div style="display:flex;flex-wrap:wrap;gap:3px;">';
    for (const p of stuck) html += renderProblemLink(p);
    html += '</div></div>';
  }

  if (close.length > 0) {
    html += '<div style="margin-bottom:16px;">';
    html += '<div style="font-weight:600;font-size:11px;color:#e67e22;margin-bottom:4px;">Close (' + close.length + ')</div>';
    html += '<div style="display:flex;flex-wrap:wrap;gap:3px;">';
    for (const p of close) html += renderProblemLink(p);
    html += '</div></div>';
  }

  if (fresh.length > 0) {
    html += '<div>';
    html += '<div style="font-weight:600;font-size:11px;color:#888;margin-bottom:4px;">Fresh (' + fresh.length + ')</div>';
    html += '<div style="display:flex;flex-wrap:wrap;gap:3px;">';
    for (const p of fresh) html += renderProblemLink(p);
    html += '</div></div>';
  }

  if (unsolvedList.length === 0) {
    html += '<div style="text-align:center;padding:20px;color:#27ae60;">All problems solved.</div>';
  }

  container.innerHTML = html;
}

function renderProblemLink(p: Problem): string {
  const cid = p.contestId || 0;
  const idx = p.index || '';
  const url = cid.toString().length <= 4
    ? 'https://codeforces.com/problemset/problem/' + cid + '/' + idx
    : 'https://codeforces.com/problemset/gymProblem/' + cid + '/' + idx;
  const cls = p.rating > 0 ? getRatingClass(p.rating) : '';

  return '<a href="' + url + '" target="_blank" class="unsolved_problem ' + cls + '" style="text-decoration:none;font-size:12px;padding:3px 7px;background:#fafafa;border-radius:3px;display:inline-block;" title="' + p.attempts + ' attempt' + (p.attempts > 1 ? 's' : '') + '">' + cid + idx + '</a>';
}

function renderUnknownBookmark(problemId: string): string {
  const match = problemId.match(/^(\d+)([A-Z]\d*)$/);
  if (!match) return '';
  const cid = match[1];
  const idx = match[2];
  const url = cid.length <= 4
    ? 'https://codeforces.com/problemset/problem/' + cid + '/' + idx
    : 'https://codeforces.com/problemset/gymProblem/' + cid + '/' + idx;
  return '<a href="' + url + '" target="_blank" style="text-decoration:none;font-size:12px;padding:3px 7px;background:#fafafa;border-radius:3px;display:inline-block;color:#1565c0;" title="Bookmarked">' + problemId + '</a>';
}

