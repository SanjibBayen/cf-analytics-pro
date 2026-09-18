/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 * https://github.com/SanjibBayen/cf-analytics-pro
 */

import type { Settings, LastProblem } from './types';

const BOOKMARKS_KEY = 'cf_bookmarks';
const LAST_PROBLEM_KEY = 'cf_last_problem';
const SETTINGS_KEY = 'cf_settings';

export const DEFAULT_SETTINGS: Settings = {
  ratings: true,
  tags: true,
  weak: true,
  unsolved: true,
  smartSubmit: true,
};

// ============================================================
// Bookmarks (localStorage)
// ============================================================

export function getBookmarks(): string[] {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function setBookmarks(ids: string[]): void {
  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(ids));
  } catch {
    // Storage full or disabled — ignore
  }
}

export function isBookmarked(problemId: string): boolean {
  return getBookmarks().includes(problemId);
}

export function toggleBookmark(problemId: string): boolean {
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

// ============================================================
// Last Problem (localStorage)
// ============================================================

export function rememberLastProblem(problem: Omit<LastProblem, 'timestamp'>): void {
  try {
    localStorage.setItem(LAST_PROBLEM_KEY, JSON.stringify({ ...problem, timestamp: Date.now() }));
  } catch {
    // ignore
  }
}

export function getLastProblem(maxAgeMs: number): LastProblem | null {
  try {
    const raw = localStorage.getItem(LAST_PROBLEM_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as LastProblem;
    if (Date.now() - data.timestamp > maxAgeMs) return null;
    return data;
  } catch {
    return null;
  }
}

// ============================================================
// Settings (chrome.storage.local)
// ============================================================

export function loadSettings(): Promise<Settings> {
  return new Promise((resolve) => {
    chrome.storage.local.get(SETTINGS_KEY, (result) => {
      resolve({ ...DEFAULT_SETTINGS, ...(result[SETTINGS_KEY] || {}) });
    });
  });
}

export function saveSettings(settings: Settings): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [SETTINGS_KEY]: settings }, () => resolve());
  });
}
