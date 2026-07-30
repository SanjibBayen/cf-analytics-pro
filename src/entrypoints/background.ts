/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 * https://github.com/SanjibBayen/cf-analytics-pro
 */

import { defineBackground } from 'wxt/sandbox';

export default defineBackground(() => {
  const cache = new Map<string, { data: any; timestamp: number }>();
  const CACHE_TTL = 10 * 60 * 1000;

  chrome.runtime.onMessage.addListener((message: any, _sender: any, sendResponse: any) => {
    if (message.type === 'FETCH_API') {
      const url = message.url + '&from=1&count=10000';
      const cached = cache.get(url);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        sendResponse({ ok: true, data: cached.data, cached: true });
        return true;
      }

      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          cache.set(url, { data, timestamp: Date.now() });
          sendResponse({ ok: true, data, cached: false });
        })
        .catch((err: any) => sendResponse({ ok: false, error: err.message }));
      return true;
    }
  });
});

