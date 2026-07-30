/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 * https://github.com/SanjibBayen/cf-analytics-pro
 */

import type { Problem } from '@/types';
import { getRatingBg, getRatingName } from '@/utils/chart-colors';
import Chart from 'chart.js/auto';

export function drawBarChart(containerId: string, problems: Problem[]): void {
  const div = document.getElementById(containerId);
  if (!div) return;

  const solvedProblems = problems.filter((p) => p.solved && p.rating > 0);
  const ratingMap = new Map<number, number>();
  solvedProblems.forEach((p) => ratingMap.set(p.rating, (ratingMap.get(p.rating) || 0) + 1));
  const ratings = Array.from(ratingMap.keys()).sort((a, b) => a - b);

  if (ratings.length === 0) {
    div.innerHTML = '<div style="color:#888;text-align:center;padding:20px;">No rated problems solved</div>';
    return;
  }

  const labels: string[] = [];
  const data: number[] = [];
  const backgroundColors: string[] = [];

  ratings.forEach((rating) => {
    labels.push(rating.toString());
    data.push(ratingMap.get(rating)!);
    backgroundColors.push(getRatingBg(rating));
  });

  const canvas = document.createElement('canvas');
  div.innerHTML = '';
  div.appendChild(canvas);

  if (Chart.getChart(canvas)) Chart.getChart(canvas)!.destroy();

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: backgroundColors,
        borderColor: 'rgba(0,0,0,0.3)',
        borderWidth: 0.5,
        
        hoverBorderColor: 'rgba(0,0,0,0.6)',
        hoverBorderWidth: 1,
      }],
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
            title: function(context: any) {
              const rating = context[0].label;
              const name = getRatingName(parseInt(rating));
              return rating + ' - ' + name;
            },
            label: function(context: any) {
              return context.parsed.y + ' problem' + (context.parsed.y !== 1 ? 's' : '') + ' solved';
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { size: 10 }, color: '#888' },
        },
        y: {
          beginAtZero: true,
          grid: { color: '#f0f0f0' },
          ticks: { font: { size: 10 }, color: '#888', stepSize: 1 },
        },
      },
      onClick: function(_event: any, elements: any[]) {
        if (elements.length > 0) {
          const rating = labels[elements[0].index];
          window.open('https://codeforces.com/problemset?tags=' + rating + '-' + rating, '_blank');
        }
      },
    },
  });
}

