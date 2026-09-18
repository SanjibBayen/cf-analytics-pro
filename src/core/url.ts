/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 * https://github.com/SanjibBayen/cf-analytics-pro
 */

export function problemUrl(contestId: number, index: string): string {
  const cid = contestId || 0;
  const idx = index || '';
  const isGym = cid.toString().length > 4;
  const base = isGym
    ? 'https://codeforces.com/problemset/gymProblem/'
    : 'https://codeforces.com/problemset/problem/';
  return base + cid + '/' + idx;
}

export function problemsetByTag(tag: string, minRating?: number, maxRating?: number): string {
  if (minRating !== undefined && maxRating !== undefined) {
    return 'https://codeforces.com/problemset?tags=' + tag + ',' + minRating + '-' + maxRating;
  }
  return 'https://codeforces.com/problemset?tags=' + tag;
}

export function problemsetByRating(rating: number): string {
  return 'https://codeforces.com/problemset?tags=' + rating + '-' + rating;
}
