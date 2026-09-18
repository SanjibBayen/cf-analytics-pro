/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 * https://github.com/SanjibBayen/cf-analytics-pro
 */

import type { Problem } from '@/core/types';
import { ratingClass, STUCK_THRESHOLD, CLOSE_THRESHOLD } from '@/core/constants';
import { problemUrl } from '@/core/url';
import { getBookmarks } from '@/core/storage';

export function renderUnsolvedTab(
  container: HTMLElement,
  problems: Problem[],
  isOwnProfile: boolean
): void {
  const unsolved = problems.filter((p) => !p.solved && p.attempts > 0);
  const stuck = unsolved
    .filter((p) => p.attempts >= STUCK_THRESHOLD)
    .sort((a, b) => (a.rating || 0) - (b.rating || 0));
  const close = unsolved
    .filter((p) => p.attempts >= CLOSE_THRESHOLD && p.attempts < STUCK_THRESHOLD)
    .sort((a, b) => (a.rating || 0) - (b.rating || 0));
  const fresh = unsolved
    .filter((p) => p.attempts < CLOSE_THRESHOLD)
    .sort((a, b) => (a.rating || 0) - (b.rating || 0));

  let html =
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">' +
    '<div class="title-small" style="margin:0;">Unsolved</div>' +
    '<span style="font-size:11px;color:#888;">' +
    unsolved.length +
    ' problems</span>' +
    '</div>';

  if (isOwnProfile) {
    const bookmarks = getBookmarks();
    if (bookmarks.length > 0) {
      const found = problems.filter((p) => bookmarks.includes(p.id));
      const missing = bookmarks.filter((b) => !problems.some((p) => p.id === b));
      if (found.length > 0 || missing.length > 0) {
        html +=
          '<div style="margin-bottom:16px;">' +
          '<div style="font-weight:600;font-size:11px;color:#3f51b5;margin-bottom:6px;">Bookmarked (' +
          bookmarks.length +
          ')</div>' +
          '<div style="display:flex;flex-wrap:wrap;gap:3px;">';
        for (const p of found) html += problemChip(p);
        for (const id of missing) html += unknownChip(id);
        html += '</div></div>';
      }
    }
  }

  if (stuck.length > 0) html += group('Stuck', '#c0392b', stuck);
  if (close.length > 0) html += group('Close', '#e67e22', close);
  if (fresh.length > 0) html += group('Fresh', '#888', fresh);

  if (unsolved.length === 0) {
    html += '<div style="text-align:center;padding:20px;color:#27ae60;">All problems solved.</div>';
  }

  container.innerHTML = html;
}

function group(label: string, color: string, list: Problem[]): string {
  let html =
    '<div style="margin-bottom:16px;">' +
    '<div style="font-weight:600;font-size:11px;color:' +
    color +
    ';margin-bottom:4px;">' +
    label +
    ' (' +
    list.length +
    ')</div>' +
    '<div style="display:flex;flex-wrap:wrap;gap:3px;">';
  for (const p of list) html += problemChip(p);
  html += '</div></div>';
  return html;
}

function problemChip(p: Problem): string {
  const cls = p.rating > 0 ? ratingClass(p.rating) : '';
  const url = problemUrl(p.contestId, p.index);
  const title = p.attempts + ' attempt' + (p.attempts > 1 ? 's' : '');
  return (
    '<a href="' +
    url +
    '" target="_blank" class="unsolved_problem ' +
    cls +
    '" ' +
    'style="text-decoration:none;font-size:12px;padding:3px 7px;background:#fafafa;border-radius:3px;display:inline-block;" ' +
    'title="' +
    title +
    '">' +
    p.contestId +
    p.index +
    '</a>'
  );
}

function unknownChip(problemId: string): string {
  const m = problemId.match(/^(\d+)([A-Z]\d*)$/);
  if (!m) return '';
  const url = problemUrl(+m[1], m[2]);
  return (
    '<a href="' +
    url +
    '" target="_blank" style="text-decoration:none;font-size:12px;padding:3px 7px;background:#fafafa;border-radius:3px;display:inline-block;color:#1565c0;" title="Bookmarked">' +
    problemId +
    '</a>'
  );
}
