/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 * https://github.com/SanjibBayen/cf-analytics-pro
 */

import { defineContentScript } from 'wxt/sandbox';
import { runSmartSubmit } from '@/utils/submit-helper';

const defaults = { smartSubmit: true };

export default defineContentScript({
  matches: [
    'https://codeforces.com/problemset/submit*',
    'https://codeforces.com/contest/*/submit*',
    'https://codeforces.com/gym/*/submit*',
  ],
  runAt: 'document_idle',
  main() {
    console.log('[CF Analytics] Submit helper loaded');

    chrome.storage.local.get('cf_settings', (result) => {
      const settings = { ...defaults, ...(result.cf_settings || {}) };
      if (!settings.smartSubmit) {
        console.log('[CF Analytics] Smart Submit disabled');
        return;
      }

      setTimeout(runSmartSubmit, 300);

      const observer = new MutationObserver(() => {
        const el = document.querySelector(
          'input[name="submittedProblemCode"], input[name="submittedProblemIndex"], select[name="submittedProblemIndex"], select[name="submittedProblemCode"]'
        );
        if (el) runSmartSubmit();
      });
      observer.observe(document.body, { childList: true, subtree: true });
      setTimeout(() => observer.disconnect(), 30000);
    });
  },
});