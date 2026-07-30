/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 * https://github.com/SanjibBayen/cf-analytics-pro
 */

import { defineContentScript } from 'wxt/sandbox';

export default defineContentScript({
  matches: [
    'https://codeforces.com/problemset/problem/*',
    'https://codeforces.com/problemset/gymProblem/*',
    'https://codeforces.com/contest/*/problem/*',
    'https://codeforces.com/gym/*/problem/*'
  ],
  runAt: 'document_idle',
  main() {
    const path = window.location.pathname;
    let match = path.match(/\/problem\/(\d+)\/(\w+)/);
    if (!match) match = path.match(/\/gymProblem\/(\d+)\/(\w+)/);
    if (!match) match = path.match(/\/contest\/\d+\/problem\/(\w+)/);
    if (!match) match = path.match(/\/gym\/\d+\/problem\/(\w+)/);
    if (!match) return;
    
    const problemId = match[1] + match[2];
    const isGym = path.includes('gymProblem') || path.includes('/gym/');

    const tryInject = (attempts: number) => {
      if (document.querySelector('.cf-bookmark-star')) return;
      if (attempts > 15) return;

      // Find the problem title
      let titleEl: Element | null = null;
      
      if (isGym) {
        // Gym: title is in .problem-statement .header .title or just .title
        titleEl = document.querySelector('.problem-statement .header .title');
        if (!titleEl) titleEl = document.querySelector('.ttypography h3');
        if (!titleEl) titleEl = document.querySelector('.title');
      } else {
        // Standard: sidebar approach
        const sidebar = document.querySelector('.probleminfo') || document.querySelector('.roundbox.sidebox');
        if (sidebar && sidebar.parentElement && !document.querySelector('.cf-bookmark-widget')) {
          injectSidebarWidget(sidebar, problemId);
          return;
        }
        titleEl = document.querySelector('.problem-statement .header .title');
      }

      if (!titleEl) {
        setTimeout(() => tryInject(attempts + 1), 400);
        return;
      }

      // Inject star next to title
      const bookmarks: string[] = JSON.parse(localStorage.getItem('cf_bookmarks') || '[]');
      const isBookmarked = bookmarks.includes(problemId);
      const starUrl = isBookmarked 
        ? 'https://codeforces.com/codeforces.org/s/95083/images/icons/star_yellow_24.png'
        : 'https://codeforces.com/codeforces.org/s/95083/images/icons/star_gray_24.png';

      const star = document.createElement('img');
      star.className = 'cf-bookmark-star';
      star.src = starUrl;
      star.style.cssText = 'cursor:pointer;width:20px;height:20px;margin-left:8px;vertical-align:middle;transition:transform 0.15s;';
      star.title = isBookmarked ? 'Bookmarked' : 'Bookmark this problem';

      star.addEventListener('mouseenter', () => { star.style.transform = 'scale(1.3)'; });
      star.addEventListener('mouseleave', () => { star.style.transform = 'scale(1)'; });
      
      star.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const bm: string[] = JSON.parse(localStorage.getItem('cf_bookmarks') || '[]');
        const idx = bm.indexOf(problemId);
        if (idx >= 0) {
          bm.splice(idx, 1);
          star.src = 'https://codeforces.com/codeforces.org/s/95083/images/icons/star_gray_24.png';
          star.title = 'Bookmark this problem';
        } else {
          bm.push(problemId);
          star.src = 'https://codeforces.com/codeforces.org/s/95083/images/icons/star_yellow_24.png';
          star.title = 'Bookmarked';
        }
        localStorage.setItem('cf_bookmarks', JSON.stringify(bm));
      });

      titleEl.appendChild(star);
    };

    setTimeout(() => tryInject(0), 500);
  },
});

function injectSidebarWidget(sidebar: Element, problemId: string): void {
  const bookmarks: string[] = JSON.parse(localStorage.getItem('cf_bookmarks') || '[]');
  const isBookmarked = bookmarks.includes(problemId);
  const starUrl = isBookmarked 
    ? 'https://codeforces.com/codeforces.org/s/95083/images/icons/star_yellow_24.png'
    : 'https://codeforces.com/codeforces.org/s/95083/images/icons/star_gray_24.png';

  const widget = document.createElement('div');
  widget.className = 'cf-bookmark-widget';
  widget.style.cssText = 'margin-top:6px;';
  widget.innerHTML = 
    '<div class="roundbox sidebox" style="border:1px solid #e0e0e0;">' +
    '<div style="padding:7px 10px;background:#f8f9fa;border-bottom:1px solid #e0e0e0;color:#3B5998;font-size:1.5rem;font-weight:bold;"> → CF Analytics Pro</div>' +
    '<div style="padding:10px;text-align:center;">' +
    '<img class="cf-bm-star" src="' + starUrl + '" style="cursor:pointer;width:24px;height:24px;transition:transform 0.15s;" title="' + (isBookmarked ? 'Bookmarked' : 'Bookmark this problem') + '" />' +
    '<span class="cf-bm-text" style="font-size:10px;color:#666;display:block;margin-top:4px;">' + (isBookmarked ? 'Bookmarked' : 'Bookmark this problem') + '</span>' +
    '</div>' +
    '</div>';

  sidebar.parentElement!.insertBefore(widget, sidebar.nextSibling);

  const star = widget.querySelector('.cf-bm-star')! as HTMLImageElement;
  const text = widget.querySelector('.cf-bm-text')!;
  
  star.addEventListener('mouseenter', () => { star.style.transform = 'scale(1.2)'; });
  star.addEventListener('mouseleave', () => { star.style.transform = 'scale(1)'; });
  
  star.addEventListener('click', () => {
    const bm: string[] = JSON.parse(localStorage.getItem('cf_bookmarks') || '[]');
    const idx = bm.indexOf(problemId);
    if (idx >= 0) {
      bm.splice(idx, 1);
      star.src = 'https://codeforces.com/codeforces.org/s/95083/images/icons/star_gray_24.png';
      text.textContent = 'Bookmark this problem';
      star.title = 'Bookmark this problem';
    } else {
      bm.push(problemId);
      star.src = 'https://codeforces.com/codeforces.org/s/95083/images/icons/star_yellow_24.png';
      text.textContent = 'Bookmarked';
      star.title = 'Bookmarked';
    }
    localStorage.setItem('cf_bookmarks', JSON.stringify(bm));
  });
}

