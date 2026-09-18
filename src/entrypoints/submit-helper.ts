/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 * https://github.com/SanjibBayen/cf-analytics-pro
 */

import { defineContentScript } from 'wxt/sandbox';
import { runSmartSubmit } from '@/features/smart-submit';
import { loadSettings } from '@/core/storage';

export default defineContentScript({
  matches: [
    'https://codeforces.com/problemset/submit*',
    'https://codeforces.com/contest/*/submit*',
    'https://codeforces.com/gym/*/submit*',
  ],
  runAt: 'document_idle',
  async main() {
    const settings = await loadSettings();
    if (!settings.smartSubmit) return;

    console.log('[CF Analytics] Submit helper loaded');

    setTimeout(runSmartSubmit, 300);

    let debounceTimer: number | null = null;
    const observer = new MutationObserver(() => {
      if (debounceTimer !== null) return;
      debounceTimer = window.setTimeout(() => {
        debounceTimer = null;
        runSmartSubmit();
      }, 200);
    });
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => observer.disconnect(), 30000);
  },
});
