/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 * https://github.com/SanjibBayen/cf-analytics-pro
 */

import { defineContentScript } from 'wxt/sandbox';
import { processSubmissions, buildTagStats, getSolvedCount } from '@/utils/data-processor';
import { drawBarChart } from '@/utils/bar-chart';
import { drawDonutChart } from '@/utils/donut-chart';
import { renderTagsTab } from '@/utils/tags-tab';
import { renderUnsolvedTab } from '@/utils/unsolved-tab';
import { renderWeakTopics } from '@/utils/weak-topics';
import type { Problem, TagStat } from '@/types';

const defaults = { ratings: true, tags: true, weak: true, unsolved: true };
type Settings = typeof defaults;

export default defineContentScript({
  matches: ['https://codeforces.com/profile/*'],
  runAt: 'document_idle',
  main() { init(); },
});


function getCFSolvedCount(): number {
  const el = document.querySelector('._UserActivityFrame_counterValue');
  if (el) {
    const text = el.textContent || '';
    const match = text.match(/^\d+/);
    if (match) return parseInt(match[0]);
  }
  return 0;
}
function init(): void {
  const handle = window.location.pathname.split('/').pop()?.split('?')[0] || '';
  if (!handle) return;

  chrome.storage.local.get('cf_settings', (result) => {
    const settings: Settings = { ...defaults, ...(result.cf_settings || {}) };

    const check = window.setInterval(() => {
      const pageContent = document.getElementById('pageContent');
      if (!pageContent) return;
      window.clearInterval(check);

      const existing = document.getElementById('cf-analytics-pro');
      existing?.remove();

      const container = document.createElement('div');
      container.id = 'cf-analytics-pro';
      container.innerHTML = buildHTML(settings);
      pageContent.appendChild(container);

      chrome.runtime.sendMessage(
        { type: 'FETCH_API', url: 'https://codeforces.com/api/user.status?handle=' + handle },
        (response: any) => {
          const content = document.getElementById('cf-content');
          if (!content) return;
          if (!response?.ok) {
            content.innerHTML = '<div style="text-align:center;padding:30px;color:#c0392b;">Failed to load data</div>';
            return;
          }
          const allProblems = processSubmissions(response.data?.result ?? []);
          const problems = allProblems.filter((p) => p.attempts > 0);
          const tagStats = buildTagStats(problems);
          const totalSolved = getCFSolvedCount() || getSolvedCount(problems);

          const loggedInUser = getLoggedInUser();
          const isOwnProfile = loggedInUser !== null && loggedInUser.toLowerCase() === handle.toLowerCase();

          renderOverview(content, problems, tagStats, totalSolved, settings);
          setupTabs(content, problems, tagStats, totalSolved, isOwnProfile, settings);
        }
      );
    }, 500);
  });
}

function getLoggedInUser(): string | null {
  const headerLinks = document.querySelectorAll('#header a');
  for (const link of headerLinks) {
    const href = link.getAttribute('href') || '';
    if (href.includes('/profile/')) return href.split('/profile/').pop() || null;
  }
  return null;
}

function buildHTML(settings: Settings): string {
  const tabs: string[] = [];
  tabs.push('<button class="cf-tab active" data-tab="overview" style="background:none;border:none;padding:8px 16px;cursor:pointer;color:#3f51b5;font-weight:bold;border-bottom:2px solid #3f51b5;margin-bottom:-1px;font-size:13px;">Overview</button>');
  if (settings.tags !== false) tabs.push('<button class="cf-tab" data-tab="tags" style="background:none;border:none;padding:8px 16px;cursor:pointer;color:#666;font-size:13px;">Tags</button>');
  if (settings.unsolved !== false) tabs.push('<button class="cf-tab" data-tab="unsolved" style="background:none;border:none;padding:8px 16px;cursor:pointer;color:#666;font-size:13px;">Unsolved</button>');

  return '<div class="roundbox borderTopRound borderBottomRound" style="margin-top:1em;padding:1.5em;">' +
    '<div style="display:flex;gap:0;margin-bottom:1.5em;border-bottom:1px solid #e0e0e0;">' +
    tabs.join('') +
    '</div><div id="cf-content"><div style="text-align:center;padding:40px;color:#888;">Loading...</div></div></div>';
}

function setupTabs(content: HTMLElement, problems: Problem[], tagStats: TagStat[], totalSolved: number, isOwnProfile: boolean, settings: Settings): void {
  const views: Record<string, () => void> = {
    overview: () => renderOverview(content, problems, tagStats, totalSolved, settings),
  };
  if (settings.tags !== false) views['tags'] = () => renderTagsTab(content, tagStats);
  if (settings.unsolved !== false) views['unsolved'] = () => renderUnsolvedTab(content, problems, isOwnProfile);

  const parent = content.parentElement;
  if (!parent) return;
  parent.querySelectorAll('.cf-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      const name = tab.getAttribute('data-tab');
      if (!name || !views[name]) return;
      parent.querySelectorAll('.cf-tab').forEach((t) => {
        t.classList.remove('active');
        (t as HTMLElement).style.cssText = 'background:none;border:none;padding:8px 16px;cursor:pointer;color:#666;font-size:13px;';
      });
      tab.classList.add('active');
      (tab as HTMLElement).style.cssText = 'background:none;border:none;padding:8px 16px;cursor:pointer;color:#3f51b5;font-weight:bold;border-bottom:2px solid #3f51b5;margin-bottom:-1px;font-size:13px;';
      views[name]();
    });
  });
}

function renderOverview(container: HTMLElement, problems: Problem[], tagStats: TagStat[], totalSolved: number, settings: Settings): void {
  let html = '';

  if (settings.ratings !== false) {
    html += '<div style="margin-bottom:32px;padding-bottom:28px;border-bottom:1px solid #e8e8e8;">' +
      '<div class="title-small" style="margin-bottom:16px;">Problem Ratings</div>' +
      '<div id="cf-bar-chart" style="width:100%;min-height:320px;"></div>' +
      '</div>';
  }

  if (settings.tags !== false) {
    const border = settings.weak !== false ? 'border-bottom:1px solid #e8e8e8;' : '';
    html += '<div style="margin-bottom:32px;padding-bottom:28px;' + border + '">' +
      '<div class="title-small" style="margin-bottom:16px;">Tags Solved</div>' +
      '<div style="display:flex;align-items:flex-start;gap:260px;">' +
      '<canvas id="cf-donut-canvas" width="300" height="300" style="flex-shrink:0;"></canvas>' +
      '<div id="cf-donut-legend" style="flex:1;min-width:200px;font-size:12px;"></div>' +
      '</div>' +
      '</div>';
  }

  if (settings.weak !== false) {
    html += '<div id="cf-weak-topics"></div>';
  }

  container.innerHTML = html;

  setTimeout(() => {
    if (settings.ratings !== false) drawBarChart('cf-bar-chart', problems);
    if (settings.tags !== false) drawDonutChart('cf-donut-canvas', 'cf-donut-legend', tagStats, totalSolved);
    if (settings.weak !== false) {
      const weakDiv = document.getElementById('cf-weak-topics');
      if (weakDiv) renderWeakTopics(weakDiv, tagStats, problems);
    }
  }, 80);
}



