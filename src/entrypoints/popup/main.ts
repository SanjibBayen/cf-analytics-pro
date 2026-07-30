/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 * https://github.com/SanjibBayen/cf-analytics-pro
 */

document.addEventListener('DOMContentLoaded', () => {
  const defaults: Record<string, boolean> = { ratings: true, tags: true, weak: true, unsolved: true };
  const ids = ['ratings', 'tags', 'weak', 'unsolved'];

  chrome.storage.local.get('cf_settings', (result) => {
    const merged = { ...defaults, ...(result.cf_settings || {}) };
    ids.forEach((id) => {
      const el = document.getElementById('toggle-' + id) as HTMLInputElement;
      if (el) el.checked = merged[id];
    });
  });

  function save() {
    const data: Record<string, boolean> = {};
    ids.forEach((id) => {
      const el = document.getElementById('toggle-' + id) as HTMLInputElement;
      data[id] = el ? el.checked : true;
    });
    chrome.storage.local.set({ cf_settings: data }, () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id && tabs[0]?.url?.includes('codeforces.com/profile')) {
          chrome.tabs.reload(tabs[0].id);
        }
      });
    });
  }

  ids.forEach((id) => {
    document.getElementById('toggle-' + id)?.addEventListener('change', save);
  });
});

