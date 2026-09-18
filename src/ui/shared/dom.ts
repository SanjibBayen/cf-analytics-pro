/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 * https://github.com/SanjibBayen/cf-analytics-pro
 */

export function $(selector: string): HTMLElement | null {
  return document.querySelector(selector) as HTMLElement | null;
}

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs?: Partial<Record<string, string>>,
  html?: string
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (attrs) {
    for (const k in attrs) {
      const value = attrs[k];
      if (value !== undefined) node.setAttribute(k, value);
    }
  }
  if (html !== undefined) node.innerHTML = html;
  return node;
}

export function waitFor(
  selector: string,
  maxAttempts = 40,
  intervalMs = 500
): Promise<HTMLElement> {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const tick = () => {
      const found = document.querySelector(selector) as HTMLElement | null;
      if (found) return resolve(found);
      if (++attempts > maxAttempts) return reject(new Error('Timeout: ' + selector));
      setTimeout(tick, intervalMs);
    };
    tick();
  });
}
