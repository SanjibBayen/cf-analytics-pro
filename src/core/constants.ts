/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 * https://github.com/SanjibBayen/cf-analytics-pro
 */

// Codeforces rating color thresholds → background color (for charts)
export function ratingBg(rating: number): string {
  if (rating >= 3000) return 'rgba(170,0,0,0.9)';
  if (rating >= 2600) return 'rgba(255,51,51,0.9)';
  if (rating >= 2400) return 'rgba(255,119,119,0.9)';
  if (rating >= 2300) return 'rgba(255,187,85,0.9)';
  if (rating >= 2100) return 'rgba(255,204,136,0.9)';
  if (rating >= 1900) return 'rgba(255,136,255,0.9)';
  if (rating >= 1600) return 'rgba(170,170,255,0.9)';
  if (rating >= 1400) return 'rgba(119,221,187,0.9)';
  if (rating >= 1200) return 'rgba(119,255,119,0.9)';
  return 'rgba(204,204,204,0.9)';
}

// Codeforces rating color thresholds → CSS class name (for text)
export function ratingClass(rating: number): string {
  if (rating >= 2400) return 'user-red';
  if (rating >= 2100) return 'user-orange';
  if (rating >= 1900) return 'user-violet';
  if (rating >= 1600) return 'user-blue';
  if (rating >= 1400) return 'user-cyan';
  if (rating >= 1200) return 'user-green';
  return 'user-gray';
}

// Codeforces rating → display name
export function ratingName(rating: number): string {
  if (rating >= 3000) return 'Legendary Grandmaster';
  if (rating >= 2600) return 'International Grandmaster';
  if (rating >= 2400) return 'Grandmaster';
  if (rating >= 2300) return 'International Master';
  if (rating >= 2100) return 'Master';
  if (rating >= 1900) return 'Candidate Master';
  if (rating >= 1600) return 'Expert';
  if (rating >= 1400) return 'Specialist';
  if (rating >= 1200) return 'Pupil';
  return 'Newbie';
}

// Chart color palette (Material Design 400 light)
export const DONUT_COLORS = [
  '#ff867c',
  '#ff77a9',
  '#df78ef',
  '#b085f5',
  '#8e99f3',
  '#80d6ff',
  '#73e8ff',
  '#6ff9ff',
  '#64d8cb',
  '#98ee99',
  '#cfff95',
  '#ffff89',
  '#ffff8b',
  '#fffd61',
  '#ffd95b',
  '#ffa270',
] as const;

// Feature thresholds
export const STUCK_THRESHOLD = 5;
export const CLOSE_THRESHOLD = 3;
export const WEAK_TOPIC_MIN_ATTEMPTS = 3;
export const MIN_SOLVED_FOR_WEAK_TOPICS = 20;

// API cache TTL (10 minutes)
export const CACHE_TTL_MS = 10 * 60 * 1000;

// Smart Submit: how long a stored "last problem" stays valid (1 hour)
export const LAST_PROBLEM_TTL_MS = 60 * 60 * 1000;
