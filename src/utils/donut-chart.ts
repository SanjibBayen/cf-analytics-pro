/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 * https://github.com/SanjibBayen/cf-analytics-pro
 */

import type { TagStat } from '@/types';
import { DONUT_COLORS } from '@/utils/chart-colors';
import Chart from 'chart.js/auto';

export function drawDonutChart(canvasId: string, legendId: string, tagStats: TagStat[], totalSolved: number): void {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
  const legendDiv = document.getElementById(legendId);
  if (!canvas || !legendDiv) return;

  const stats = tagStats.filter((t) => t.solved > 0);
  if (stats.length === 0) {
    legendDiv.innerHTML = '<div style="color:#888;">No data</div>';
    return;
  }

  const labels: string[] = [];
  const data: number[] = [];
  const colors: string[] = [];

  stats.forEach((stat, i) => {
    labels.push(stat.tag);
    data.push(stat.solved);
    colors.push(DONUT_COLORS[i % DONUT_COLORS.length]);
  });

  canvas.width = 300;
  canvas.height = 300;
  canvas.style.width = '300px';
  canvas.style.height = '300px';

  if (Chart.getChart(canvas)) Chart.getChart(canvas)!.destroy();

  new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        label: 'Tags Solved',
        data: data,
        backgroundColor: colors,
        borderColor: '#fff',
        borderWidth: 1,
        hoverBorderWidth: 2,
        hoverBorderColor: '#333',
      }],
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
            label: function(context: any) {
              const pct = ((context.parsed / totalSolved) * 100).toFixed(1);
              return context.label + ': ' + context.parsed + ' (' + pct + '%)';
            },
          },
        },
      },
      onClick: function(_event: any, elements: any[]) {
        if (elements.length > 0) {
          window.open('https://codeforces.com/problemset?tags=' + labels[elements[0].index], '_blank');
        }
      },
    },
    plugins: [{
      id: 'centerText',
      afterDraw: function(chart: any) {
        const ctx = chart.ctx;
        const cx = (chart.chartArea.left + chart.chartArea.right) / 2;
        const cy = (chart.chartArea.top + chart.chartArea.bottom) / 2;
        ctx.save();
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 28px -apple-system,BlinkMacSystemFont,sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(totalSolved.toString(), cx, cy - 6);
        ctx.fillStyle = '#999';
        ctx.font = '11px -apple-system,BlinkMacSystemFont,sans-serif';
        ctx.fillText('solved', cx, cy + 16);
        ctx.restore();
      },
    }],
  });

  let legendHtml = '';
  stats.forEach((stat, i) => {
    const c = DONUT_COLORS[i % DONUT_COLORS.length];
    const pct = ((stat.solved / totalSolved) * 100).toFixed(1);
    legendHtml +=
      '<div style="display:flex;align-items:center;padding:4px 4px;cursor:pointer;" ' +
      'onmouseenter="this.style.background=\'#f8f9fa\'" onmouseleave="this.style.background=\'transparent\'" ' +
      'onclick="window.open(\'https://codeforces.com/problemset?tags=' + stat.tag + '\',\'_blank\')">' +
      '<span style="width:8px;height:8px;border-radius:2px;background:' + c + ';margin-right:8px;flex-shrink:0;"></span>' +
      '<span style="flex:1;font-size:11px;color:#444;">' + stat.tag + '</span>' +
      '<span style="font-weight:600;font-size:11px;color:#333;margin-left:16px;min-width:36px;text-align:right;">' + stat.solved + '</span>' +
      '<span style="color:#aaa;font-size:9px;margin-left:8px;min-width:32px;text-align:right;">' + pct + '%</span>' +
      '</div>';
  });
  legendDiv.innerHTML = legendHtml;
  legendDiv.style.cssText = 'max-height:300px;overflow-y:auto;scrollbar-width:thin;scrollbar-color:#ddd transparent;';
}

