/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 * https://github.com/SanjibBayen/cf-analytics-pro
 */

import type { Problem, TagStat } from '@/types';
import { getRatingClass } from '@/utils/chart-colors';

export function renderWeakTopics(container: HTMLElement, tagStats: TagStat[], problems: Problem[]): void {
  const totalSolved = problems.filter((p) => p.solved).length;
  const weak = tagStats.filter((t) => t.unsolved > 0).sort((a, b) => a.rate - b.rate);

  let html = '<div style="margin-top:28px;padding-top:24px;border-top:1px solid #e8e8e8;">';

  if (weak.length === 0) {
    html += '<div class="title-small" style="margin-bottom:12px;">Weak Topics</div>';
    if (totalSolved < 20) {
      html += '<div style="text-align:center;padding:20px;background:#f0f7ff;border:1px solid #d0e4f7;border-radius:8px;">';
      html += '<div style="font-size:24px;margin-bottom:8px;">&#127775;</div>';
      html += '<div style="font-size:13px;color:#333;font-weight:600;">You are just getting started!</div>';
      html += '<div style="font-size:11px;color:#888;margin-top:4px;">Solve more problems to discover your weak areas.</div>';
      html += '</div>';
    } else {
      html += '<div style="text-align:center;padding:20px;background:#f0fff0;border:1px solid #c8e6c9;border-radius:8px;">';
      html += '<div style="font-size:24px;margin-bottom:8px;">&#127942;</div>';
      html += '<div style="font-size:13px;color:#27ae60;font-weight:600;">No weak topics!</div>';
      html += '<div style="font-size:11px;color:#888;margin-top:4px;">Excellent consistency across all topics.</div>';
      html += '</div>';
    }
    html += '</div>';
    container.innerHTML = html;
    return;
  }

  // Only show collapse button when there are topics
  html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">';
  html += '<div class="title-small" style="margin:0;">Weak Topics</div>';
  html += '<span class="cf-weak-collapse-btn" style="cursor:pointer;font-size:11px;color:#3f51b5;text-decoration:underline;">expand all</span>';
  html += '</div>';

  for (const stat of weak) {
    const unsolvedProblems = stat.problems.filter((p) => !p.solved && p.attempts > 0);
    const avgRating = unsolvedProblems.filter((p) => p.rating > 0).reduce((s, p) => s + p.rating, 0) / Math.max(1, unsolvedProblems.filter((p) => p.rating > 0).length);
    const minR = Math.round(avgRating * 0.8);
    const maxR = Math.round(avgRating * 1.1);

    html += '<div class="cf-weak-row" style="margin-bottom:4px;background:#fff;border:1px solid #eee;border-radius:6px;">';
    html += '<div class="cf-weak-header" style="cursor:pointer;padding:10px 12px;display:flex;justify-content:space-between;align-items:center;">';
    html += '<div style="display:flex;align-items:center;gap:16px;">';
    html += '<span style="font-weight:600;font-size:13px;">' + stat.tag + '</span>';
    html += '<span style="font-size:11px;color:#e74c3c;">' + unsolvedProblems.length + ' unsolved</span>';
    html += '<span style="font-size:11px;color:#999;">' + stat.rate.toFixed(0) + '% solved</span>';
    html += '</div>';
    html += '<a href="https://codeforces.com/problemset?tags=' + stat.tag + ',' + minR + '-' + maxR + '" target="_blank" style="font-size:10px;color:#3f51b5;text-decoration:underline;" onclick="event.stopPropagation()">practice</a>';
    html += '</div>';
    html += '<div class="cf-weak-detail" style="padding:0 12px 10px;display:none;">';
    html += '<div style="font-size:10px;color:#aaa;margin-bottom:6px;">' + minR + ' - ' + maxR + ' rating</div>';
    html += '<div style="display:flex;flex-wrap:wrap;gap:4px;">';
    for (const p of unsolvedProblems) {
      const url = 'https://codeforces.com/problemset/problem/' + p.contestId + '/' + p.index;
      const cls = p.rating > 0 ? getRatingClass(p.rating) : '';
      html += '<a href="' + url + '" target="_blank" class="' + cls + '" style="text-decoration:none;font-size:11px;padding:2px 6px;background:#ffebee;color:#c62828;border-radius:3px;">' + p.contestId + p.index + '</a>';
    }
    html += '</div>';
    html += '</div>';
    html += '</div>';
  }
  html += '</div>';

  container.innerHTML = html;

  container.querySelectorAll('.cf-weak-row').forEach((row) => {
    (row as HTMLElement).addEventListener('click', function(e) {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A') return;
      const detail = this.querySelector('.cf-weak-detail') as HTMLElement;
      detail.style.display = detail.style.display === 'none' ? 'block' : 'none';
    });
  });

  const collapseBtn = container.querySelector('.cf-weak-collapse-btn') as HTMLElement;
  let allExpanded = false;
  collapseBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    const details = container.querySelectorAll('.cf-weak-detail');
    if (allExpanded) {
      details.forEach((d) => ((d as HTMLElement).style.display = 'none'));
      collapseBtn.textContent = 'expand all';
    } else {
      details.forEach((d) => ((d as HTMLElement).style.display = 'block'));
      collapseBtn.textContent = 'collapse all';
    }
    allExpanded = !allExpanded;
  });
}

