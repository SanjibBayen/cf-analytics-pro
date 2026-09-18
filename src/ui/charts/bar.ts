/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 * https://github.com/SanjibBayen/cf-analytics-pro
 */

import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js';

import type { Problem } from '@/core/types';
import { ratingBg, ratingName } from '@/core/constants';
import { problemsetByRating } from '@/core/url';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);

export function drawBarChart(containerId: string, problems: Problem[]): void {
  const div = document.getElementById(containerId);
  if (!div) return;

  const ratingMap = new Map<number, number>();
  for (const p of problems) {
    if (p.solved && p.rating > 0) {
      ratingMap.set(p.rating, (ratingMap.get(p.rating) || 0) + 1);
    }
  }

  const ratings = Array.from(ratingMap.keys()).sort((a, b) => a - b);
  if (ratings.length === 0) {
    div.innerHTML =
      '<div style="color:#888;text-align:center;padding:20px;">No rated problems solved</div>';
    return;
  }

  const labels = ratings.map(String);
  const data = ratings.map((r) => ratingMap.get(r)!);
  const colors = ratings.map(ratingBg);

  const canvas = document.createElement('canvas');
  div.innerHTML = '';
  div.appendChild(canvas);

  const existing = Chart.getChart(canvas);
  if (existing) existing.destroy();

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors,
          borderColor: 'rgba(0,0,0,0.3)',
          borderWidth: 0.5,
          hoverBorderColor: 'rgba(0,0,0,0.6)',
          hoverBorderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(30,30,30,0.95)',
          padding: 10,
          cornerRadius: 4,
          callbacks: {
            title: (ctx: any) => {
              const r = parseInt(ctx[0].label);
              return r + ' - ' + ratingName(r);
            },
            label: (ctx: any) =>
              ctx.parsed.y + ' problem' + (ctx.parsed.y !== 1 ? 's' : '') + ' solved',
          },
        },
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#888' } },
        y: {
          beginAtZero: true,
          grid: { color: '#f0f0f0' },
          ticks: { font: { size: 10 }, color: '#888', stepSize: 1 },
        },
      },
      onClick: (_e: any, elements: any[]) => {
        if (elements.length > 0) {
          const rating = parseInt(labels[elements[0].index]);
          window.open(problemsetByRating(rating), '_blank');
        }
      },
    },
  });
}
