/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 * https://github.com/SanjibBayen/cf-analytics-pro
 */

import { Chart, DoughnutController, ArcElement, Tooltip } from 'chart.js';

import type { TagStat } from '@/core/types';
import { DONUT_COLORS } from '@/core/constants';
import { problemsetByTag } from '@/core/url';
import { escHtml } from '@/ui/shared/styles';

Chart.register(DoughnutController, ArcElement, Tooltip);

export function drawDonutChart(
  canvasId: string,
  legendId: string,
  tagStats: TagStat[],
  totalSolved: number
): void {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
  const legend = document.getElementById(legendId);
  if (!canvas || !legend) return;

  const stats = tagStats.filter((t) => t.solved > 0);
  if (stats.length === 0) {
    legend.innerHTML = '<div style="color:#888;">No data</div>';
    return;
  }

  const labels = stats.map((s) => s.tag);
  const data = stats.map((s) => s.solved);
  const colors = stats.map((_, i) => DONUT_COLORS[i % DONUT_COLORS.length]);

  canvas.width = 300;
  canvas.height = 300;
  canvas.style.width = '300px';
  canvas.style.height = '300px';

  const existing = Chart.getChart(canvas);
  if (existing) existing.destroy();

  new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors,
          borderColor: '#fff',
          borderWidth: 1,
          hoverBorderWidth: 2,
          hoverBorderColor: '#333',
        },
      ],
    },
    options: {
      responsive: false,
      cutout: '55%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(30,30,30,0.95)',
          padding: 10,
          cornerRadius: 6,
          callbacks: {
            label: (ctx: any) => {
              const pct = ((ctx.parsed / totalSolved) * 100).toFixed(1);
              return ctx.label + ': ' + ctx.parsed + ' (' + pct + '%)';
            },
          },
        },
      },
      onClick: (_e: any, elements: any[]) => {
        if (elements.length > 0) {
          window.open(problemsetByTag(labels[elements[0].index]), '_blank');
        }
      },
    },
    plugins: [
      {
        id: 'centerText',
        afterDraw: (chart: any) => {
          const ctx = chart.ctx;
          const cx = (chart.chartArea.left + chart.chartArea.right) / 2;
          const cy = (chart.chartArea.top + chart.chartArea.bottom) / 2;
          ctx.save();
          ctx.fillStyle = '#2c3e50';
          ctx.font = 'bold 28px -apple-system,BlinkMacSystemFont,sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(String(totalSolved), cx, cy - 6);
          ctx.fillStyle = '#999';
          ctx.font = '11px -apple-system,BlinkMacSystemFont,sans-serif';
          ctx.fillText('solved', cx, cy + 16);
          ctx.restore();
        },
      },
    ],
  });

  let html = '';
  for (let i = 0; i < stats.length; i++) {
    const s = stats[i];
    const c = colors[i];
    const pct = ((s.solved / totalSolved) * 100).toFixed(1);
    const tagEsc = escHtml(s.tag);
    html +=
      '<div style="display:flex;align-items:center;padding:4px 4px;cursor:pointer;" ' +
      'onmouseenter="this.style.background=\'#f8f9fa\'" onmouseleave="this.style.background=\'transparent\'" ' +
      'onclick="window.open(\'https://codeforces.com/problemset?tags=' +
      encodeURIComponent(s.tag) +
      "','_blank')\">" +
      '<span style="width:8px;height:8px;border-radius:2px;background:' +
      c +
      ';margin-right:8px;flex-shrink:0;"></span>' +
      '<span style="flex:1;font-size:11px;color:#444;">' +
      tagEsc +
      '</span>' +
      '<span style="font-weight:600;font-size:11px;color:#333;margin-left:16px;min-width:36px;text-align:right;">' +
      s.solved +
      '</span>' +
      '<span style="color:#aaa;font-size:9px;margin-left:8px;min-width:32px;text-align:right;">' +
      pct +
      '%</span>' +
      '</div>';
  }
  legend.innerHTML = html;
  legend.style.cssText =
    'max-height:300px;overflow-y:auto;scrollbar-width:thin;scrollbar-color:#ddd transparent;';
}
