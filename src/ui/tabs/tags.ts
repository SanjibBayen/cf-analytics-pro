/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 * https://github.com/SanjibBayen/cf-analytics-pro
 */

import type { TagStat } from '@/core/types';
import { ratingClass } from '@/core/constants';
import { problemUrl } from '@/core/url';

export function renderTagsTab(container: HTMLElement, tagStats: TagStat[]): void {
  let html =
    '<div class="title-small" style="margin-bottom:4px;">Tags Solved</div>' +
    '<div style="font-size:11px;color:#888;margin-bottom:14px;">Click a tag to see problems</div>';

  for (const stat of tagStats) {
    const pct = stat.rate.toFixed(0);

    html +=
      '<div class="cf-tag-row" style="cursor:pointer;padding:12px 14px;margin-bottom:6px;background:#fff;border:1px solid #e8e8e8;border-radius:8px;">' +
      '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px;">' +
      '<span style="font-weight:600;font-size:13px;color:#2c3e50;">' +
      stat.tag +
      '</span>' +
      '<span style="font-size:12px;">' +
      '<span style="color:#27ae60;">' +
      stat.solved +
      ' solved</span>' +
      '<span style="color:#ccc;"> &middot; </span>' +
      '<span style="color:#e74c3c;">' +
      stat.unsolved +
      ' unsolved</span>' +
      '<span style="color:#999;margin-left:4px;">(' +
      pct +
      '%)</span>' +
      '</span>' +
      '</div>' +
      '<div style="height:3px;background:#f0f0f0;border-radius:2px;">' +
      '<div style="height:100%;width:' +
      pct +
      '%;background:#27ae60;border-radius:2px;"></div>' +
      '</div>' +
      '<div class="cf-tag-detail" style="display:none;margin-top:12px;padding-top:10px;border-top:1px solid #f0f0f0;">';

    const solved = stat.problems.filter((p) => p.solved);
    const unsolved = stat.problems.filter((p) => !p.solved);

    if (solved.length > 0) {
      html +=
        '<div style="font-weight:600;font-size:11px;color:#27ae60;margin-bottom:4px;">Solved</div>';
      html += '<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px;">';
      for (const p of solved) {
        const cls = p.rating > 0 ? ratingClass(p.rating) : '';
        html +=
          '<a href="' +
          problemUrl(p.contestId, p.index) +
          '" target="_blank" class="' +
          cls +
          '" ' +
          'style="text-decoration:none;font-size:11px;padding:2px 6px;background:#e8f5e9;border-radius:3px;">' +
          p.contestId +
          p.index +
          '</a>';
      }
      html += '</div>';
    }

    if (unsolved.length > 0) {
      html +=
        '<div style="font-weight:600;font-size:11px;color:#e74c3c;margin-bottom:4px;">Unsolved</div>';
      html += '<div style="display:flex;flex-wrap:wrap;gap:4px;">';
      for (const p of unsolved) {
        html +=
          '<a href="' +
          problemUrl(p.contestId, p.index) +
          '" target="_blank" ' +
          'style="text-decoration:none;font-size:11px;padding:2px 6px;background:#ffebee;color:#c62828;border-radius:3px;">' +
          p.contestId +
          p.index +
          '</a>';
      }
      html += '</div>';
    }

    html += '</div></div>';
  }

  container.innerHTML = html;

  container.querySelectorAll<HTMLElement>('.cf-tag-row').forEach((row) => {
    row.addEventListener('click', function () {
      const d = this.querySelector('.cf-tag-detail') as HTMLElement;
      if (d) d.style.display = d.style.display === 'none' ? 'block' : 'none';
    });
  });
}
