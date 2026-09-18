/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 * https://github.com/SanjibBayen/cf-analytics-pro
 */

import { defineBackground } from 'wxt/sandbox';
import { CACHE_TTL_MS } from '@/core/constants';

interface CacheEntry {
  data: unknown;
  timestamp: number;
}

export default defineBackground(() => {
  const cache = new Map<string, CacheEntry>();

  chrome.runtime.onMessage.addListener((message: any, _sender, sendResponse) => {
    if (message?.type !== 'FETCH_API') return false;

    const url: string = message.url + '&from=1&count=10000';
    const cached = cache.get(url);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      sendResponse({ ok: true, data: cached.data, cached: true });
      return true;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        cache.set(url, { data, timestamp: Date.now() });
        sendResponse({ ok: true, data, cached: false });
      })
      .catch((err: Error) => {
        sendResponse({ ok: false, error: err.message });
      });

    return true;
  });
});
