/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 * https://github.com/SanjibBayen/cf-analytics-pro
 */

export function getRatingBg(rating: number): string {
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

export function getRatingClass(rating: number): string {
  if (rating >= 2400) return 'user-red';
  if (rating >= 2100) return 'user-orange';
  if (rating >= 1900) return 'user-violet';
  if (rating >= 1600) return 'user-blue';
  if (rating >= 1400) return 'user-cyan';
  if (rating >= 1200) return 'user-green';
  return 'user-gray';
}

export function getRatingName(rating: number): string {
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

export const DONUT_COLORS: string[] = [
  '#ff867c','#ff77a9','#df78ef','#b085f5','#8e99f3',
  '#80d6ff','#73e8ff','#6ff9ff','#64d8cb','#98ee99',
  '#cfff95','#ffff89','#ffff8b','#fffd61','#ffd95b','#ffa270'
];

