/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 * https://github.com/SanjibBayen/cf-analytics-pro
 */

import { loadSettings, saveSettings, DEFAULT_SETTINGS } from '@/core/storage';
import type { Settings } from '@/core/types';

const IDS: (keyof Settings)[] = ['ratings', 'tags', 'weak', 'unsolved', 'smartSubmit'];

document.addEventListener('DOMContentLoaded', async () => {
  const settings = await loadSettings();

  for (const id of IDS) {
    const el = document.getElementById('toggle-' + id) as HTMLInputElement | null;
    if (el) el.checked = settings[id];
  }

  const save = async () => {
    const data: Settings = { ...DEFAULT_SETTINGS };
    for (const id of IDS) {
      const el = document.getElementById('toggle-' + id) as HTMLInputElement | null;
      data[id] = el ? el.checked : true;
    }
    await saveSettings(data);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0]?.url || '';
      if (tabs[0]?.id && /codeforces\.com\/(profile|problemset|contest|gym)/.test(url)) {
        chrome.tabs.reload(tabs[0].id);
      }
    });
  };

  for (const id of IDS) {
    document.getElementById('toggle-' + id)?.addEventListener('change', save);
  }
});
