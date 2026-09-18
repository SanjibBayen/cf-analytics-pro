/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 * https://github.com/SanjibBayen/cf-analytics-pro
 */

import { defineContentScript } from 'wxt/sandbox';
import type { Problem, TagStat, Settings } from '@/core/types';
import { loadSettings } from '@/core/storage';
import { processSubmissions, buildTagStats, countSolved } from '@/core/processor';
import { drawBarChart } from '@/ui/charts/bar';
import { drawDonutChart } from '@/ui/charts/donut';
import { renderTagsTab } from '@/ui/tabs/tags';
import { renderUnsolvedTab } from '@/ui/tabs/unsolved';
import { renderWeakTopics } from '@/ui/tabs/weak-topics';
import { waitFor } from '@/ui/shared/dom';

type TabName = 'overview' | 'tags' | 'unsolved';

interface ApiResult {
  ok: boolean;
  data?: any;
  error?: string;
}

export default defineContentScript({
  matches: ['https://codeforces.com/profile/*'],
  runAt: 'document_idle',
  async main() {
    const handle = window.location.pathname.split('/').pop()?.split('?')[0];
    if (!handle) return;

    const settings = await loadSettings();

    try {
      await waitFor('#pageContent');
    } catch {
      return;
    }

    const pageContent = document.getElementById('pageContent');
    if (!pageContent) return;

    document.getElementById('cf-analytics-pro')?.remove();

    const container = document.createElement('div');
    container.id = 'cf-analytics-pro';
    container.innerHTML = buildShell(settings);
    pageContent.appendChild(container);

    fetchApi('https://codeforces.com/api/user.status?handle=' + handle).then((statusRes) => {
      const content = document.getElementById('cf-content');
      if (!content) return;

      if (!statusRes.ok || statusRes.data?.status !== 'OK') {
        content.innerHTML =
          '<div style="text-align:center;padding:30px;color:#c0392b;">Failed to load data</div>';
        return;
      }

      const all = processSubmissions(statusRes.data.result || []);
      const problems = all.filter((p) => p.attempts > 0);
      const tagStats = buildTagStats(problems);

      // Codeforces renders the "solved for all time" count in the profile DOM.
      // The API does not expose this number, so we read it from the page.
      const solvedEl = document.querySelectorAll('._UserActivityFrame_counterValue');
      let totalSolved = 0;
      if (solvedEl.length > 0) {
        const txt = solvedEl[0].textContent || '';
        const match = txt.match(/\d+/);
        if (match) totalSolved = parseInt(match[0], 10);
      }
      if (!totalSolved) totalSolved = countSolved(problems);

      const loggedInUser = getLoggedInUser();
      const isOwnProfile =
        loggedInUser !== null && loggedInUser.toLowerCase() === handle.toLowerCase();

      const views: Record<TabName, () => void> = {
        overview: () => renderOverview(content, problems, tagStats, totalSolved, settings),
        tags: () => renderTagsTab(content, tagStats),
        unsolved: () => renderUnsolvedTab(content, problems, isOwnProfile),
      };

      views.overview();
      setupTabs(content, views);
    });
  },
});

function fetchApi(url: string): Promise<ApiResult> {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: 'FETCH_API', url }, (response) => {
      resolve(response || { ok: false, error: 'No response' });
    });
  });
}

function getLoggedInUser(): string | null {
  const links = document.querySelectorAll('#header a');
  for (const link of links) {
    const href = link.getAttribute('href') || '';
    if (href.includes('/profile/')) return href.split('/profile/').pop() || null;
  }
  return null;
}

function buildShell(settings: Settings): string {
  const tabs: string[] = [];
  tabs.push(activeTab('overview', 'Overview'));
  if (settings.tags) tabs.push(inactiveTab('tags', 'Tags'));
  if (settings.unsolved) tabs.push(inactiveTab('unsolved', 'Unsolved'));

  return (
    '<div class="roundbox borderTopRound borderBottomRound" style="margin-top:1em;padding:1.5em;">' +
    '<div style="display:flex;gap:0;margin-bottom:1.5em;border-bottom:1px solid #e0e0e0;">' +
    tabs.join('') +
    '</div><div id="cf-content"><div style="text-align:center;padding:40px;color:#888;">Loading...</div></div></div>'
  );
}

function activeTab(name: string, label: string): string {
  return (
    '<button class="cf-tab active" data-tab="' +
    name +
    '" ' +
    'style="background:none;border:none;padding:8px 16px;cursor:pointer;color:#3f51b5;font-weight:bold;border-bottom:2px solid #3f51b5;margin-bottom:-1px;font-size:13px;">' +
    label +
    '</button>'
  );
}

function inactiveTab(name: string, label: string): string {
  return (
    '<button class="cf-tab" data-tab="' +
    name +
    '" ' +
    'style="background:none;border:none;padding:8px 16px;cursor:pointer;color:#666;font-size:13px;">' +
    label +
    '</button>'
  );
}

function setupTabs(content: HTMLElement, views: Record<TabName, () => void>): void {
  const parent = content.parentElement;
  if (!parent) return;

  parent.querySelectorAll<HTMLElement>('.cf-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      const name = tab.getAttribute('data-tab') as TabName | null;
      if (!name || !views[name]) return;

      parent.querySelectorAll<HTMLElement>('.cf-tab').forEach((t) => {
        t.classList.remove('active');
        t.style.cssText =
          'background:none;border:none;padding:8px 16px;cursor:pointer;color:#666;font-size:13px;';
      });
      tab.classList.add('active');
      tab.style.cssText =
        'background:none;border:none;padding:8px 16px;cursor:pointer;color:#3f51b5;font-weight:bold;border-bottom:2px solid #3f51b5;margin-bottom:-1px;font-size:13px;';
      views[name]();
    });
  });
}

function renderOverview(
  container: HTMLElement,
  problems: Problem[],
  tagStats: TagStat[],
  totalSolved: number,
  settings: Settings
): void {
  let html = '';

  if (settings.ratings) {
    html +=
      '<div style="margin-bottom:32px;padding-bottom:28px;border-bottom:1px solid #e8e8e8;">' +
      '<div class="title-small" style="margin-bottom:16px;">Problem Ratings</div>' +
      '<div id="cf-bar-chart" style="width:100%;min-height:320px;"></div>' +
      '</div>';
  }

  if (settings.tags) {
    const border = settings.weak ? 'border-bottom:1px solid #e8e8e8;' : '';
    html +=
      '<div style="margin-bottom:32px;padding-bottom:28px;' +
      border +
      '">' +
      '<div class="title-small" style="margin-bottom:16px;">Tags Solved</div>' +
      '<div style="display:flex;align-items:flex-start;gap:260px;">' +
      '<canvas id="cf-donut-canvas" width="300" height="300" style="flex-shrink:0;"></canvas>' +
      '<div id="cf-donut-legend" style="flex:1;min-width:200px;font-size:12px;"></div>' +
      '</div></div>';
  }

  if (settings.weak) {
    html += '<div id="cf-weak-topics"></div>';
  }

  container.innerHTML = html;

  requestAnimationFrame(() => {
    if (settings.ratings) drawBarChart('cf-bar-chart', problems);
    if (settings.tags) drawDonutChart('cf-donut-canvas', 'cf-donut-legend', tagStats, totalSolved);
    if (settings.weak) {
      const weakDiv = document.getElementById('cf-weak-topics');
      if (weakDiv) renderWeakTopics(weakDiv, tagStats, problems);
    }
  });
}
