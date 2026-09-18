/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 * https://github.com/SanjibBayen/cf-analytics-pro
 */

import type { Problem, TagStat } from '@/core/types';
import { ratingClass, WEAK_TOPIC_MIN_ATTEMPTS, MIN_SOLVED_FOR_WEAK_TOPICS } from '@/core/constants';
import { problemUrl, problemsetByTag } from '@/core/url';

export function renderWeakTopics(
  container: HTMLElement,
  tagStats: TagStat[],
  problems: Problem[]
): void {
  const totalSolved = problems.filter((p) => p.solved).length;
  const weak = tagStats.filter((t) => t.unsolved > 0).sort((a, b) => a.rate - b.rate);

  let html = '<div style="margin-top:28px;padding-top:24px;border-top:1px solid #e8e8e8;">';

  if (weak.length === 0) {
    html += '<div class="title-small" style="margin-bottom:12px;">Weak Topics</div>';
    if (totalSolved < MIN_SOLVED_FOR_WEAK_TOPICS) {
      html +=
        '<div style="text-align:center;padding:20px;background:#f0f7ff;border:1px solid #d0e4f7;border-radius:8px;">' +
        '<div style="font-size:24px;margin-bottom:8px;">&#127775;</div>' +
        '<div style="font-size:13px;color:#333;font-weight:600;">You are just getting started!</div>' +
        '<div style="font-size:11px;color:#888;margin-top:4px;">Solve more problems to discover your weak areas.</div>' +
        '</div>';
    } else {
      html +=
        '<div style="text-align:center;padding:20px;background:#f0fff0;border:1px solid #c8e6c9;border-radius:8px;">' +
        '<div style="font-size:24px;margin-bottom:8px;">&#127942;</div>' +
        '<div style="font-size:13px;color:#27ae60;font-weight:600;">No weak topics!</div>' +
        '<div style="font-size:11px;color:#888;margin-top:4px;">Excellent consistency across all topics.</div>' +
        '</div>';
    }
    html += '</div>';
    container.innerHTML = html;
    return;
  }

  html +=
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">' +
    '<div class="title-small" style="margin:0;">Weak Topics</div>' +
    '<span class="cf-weak-collapse-btn" style="cursor:pointer;font-size:11px;color:#3f51b5;text-decoration:underline;">expand all</span>' +
    '</div>';

  for (const stat of weak) {
    const unsolved = stat.problems.filter((p) => !p.solved && p.attempts > 0);
    const rated = unsolved.filter((p) => p.rating > 0);
    const avg = rated.length > 0 ? rated.reduce((s, p) => s + p.rating, 0) / rated.length : 0;
    const minR = Math.round(avg * 0.8);
    const maxR = Math.round(avg * 1.1);
    const practiceUrl = problemsetByTag(stat.tag, minR, maxR);

    html +=
      '<div class="cf-weak-row" style="margin-bottom:4px;background:#fff;border:1px solid #eee;border-radius:6px;">' +
      '<div class="cf-weak-header" style="cursor:pointer;padding:10px 12px;display:flex;justify-content:space-between;align-items:center;">' +
      '<div style="display:flex;align-items:center;gap:16px;">' +
      '<span style="font-weight:600;font-size:13px;">' +
      stat.tag +
      '</span>' +
      '<span style="font-size:11px;color:#e74c3c;">' +
      unsolved.length +
      ' unsolved</span>' +
      '<span style="font-size:11px;color:#999;">' +
      stat.rate.toFixed(0) +
      '% solved</span>' +
      '</div>' +
      '<a href="' +
      practiceUrl +
      '" target="_blank" style="font-size:10px;color:#3f51b5;text-decoration:underline;" onclick="event.stopPropagation()">practice</a>' +
      '</div>' +
      '<div class="cf-weak-detail" style="padding:0 12px 10px;display:none;">' +
      '<div style="font-size:10px;color:#aaa;margin-bottom:6px;">' +
      minR +
      ' - ' +
      maxR +
      ' rating</div>' +
      '<div style="display:flex;flex-wrap:wrap;gap:4px;">';

    for (const p of unsolved) {
      const cls = p.rating > 0 ? ratingClass(p.rating) : '';
      html +=
        '<a href="' +
        problemUrl(p.contestId, p.index) +
        '" target="_blank" class="' +
        cls +
        '" ' +
        'style="text-decoration:none;font-size:11px;padding:2px 6px;background:#ffebee;color:#c62828;border-radius:3px;">' +
        p.contestId +
        p.index +
        '</a>';
    }
    html += '</div></div></div>';
  }
  html += '</div>';

  container.innerHTML = html;

  container.querySelectorAll('.cf-weak-row').forEach((row) => {
    (row as HTMLElement).addEventListener('click', function (e) {
      if ((e.target as HTMLElement).tagName === 'A') return;
      const detail = this.querySelector('.cf-weak-detail') as HTMLElement;
      detail.style.display = detail.style.display === 'none' ? 'block' : 'none';
    });
  });

  const btn = container.querySelector('.cf-weak-collapse-btn') as HTMLElement;
  let expanded = false;
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const details = container.querySelectorAll('.cf-weak-detail');
    details.forEach((d) => ((d as HTMLElement).style.display = expanded ? 'none' : 'block'));
    btn.textContent = expanded ? 'expand all' : 'collapse all';
    expanded = !expanded;
  });
}
