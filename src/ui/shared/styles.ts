/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 * https://github.com/SanjibBayen/cf-analytics-pro
 */

// Common style strings to avoid inline duplication
export const STYLES = {
  sectionTitle: 'font-weight:600;font-size:13px;color:#2c3e50;',
  smallLabel: 'font-size:11px;color:#888;',
  problemChip:
    'text-decoration:none;font-size:11px;padding:2px 6px;border-radius:3px;display:inline-block;',
} as const;

export function escHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
