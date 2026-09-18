/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 * https://github.com/SanjibBayen/cf-analytics-pro
 */

import { isBookmarked, toggleBookmark } from '@/core/storage';

const STAR_GRAY = 'https://codeforces.com/codeforces.org/s/13758/images/icons/star_gray_24.png';
const STAR_YELLOW = 'https://codeforces.com/codeforces.org/s/13758/images/icons/star_yellow_24.png';

export function createStarButton(problemId: string, size: 'small' | 'large'): HTMLElement {
  const wrapper = document.createElement('span');
  wrapper.className = 'cf-bookmark-star';

  const px = size === 'large' ? 24 : 18;
  wrapper.style.cssText =
    'cursor:pointer;display:inline-flex;align-items:center;justify-content:center;' +
    'width:' +
    px +
    'px;height:' +
    px +
    'px;' +
    'transition:transform 0.15s;user-select:none;vertical-align:middle;';

  const initial = isBookmarked(problemId);
  wrapper.innerHTML =
    '<img src="' +
    (initial ? STAR_YELLOW : STAR_GRAY) +
    '" ' +
    'style="width:' +
    px +
    'px;height:' +
    px +
    'px;display:block;" />';

  wrapper.title = initial ? 'Bookmarked' : 'Bookmark this problem';

  wrapper.addEventListener('mouseenter', () => {
    wrapper.style.transform = 'scale(1.15)';
  });
  wrapper.addEventListener('mouseleave', () => {
    wrapper.style.transform = 'scale(1)';
  });

  wrapper.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const now = toggleBookmark(problemId);
    const img = wrapper.querySelector('img');
    if (img) img.src = now ? STAR_YELLOW : STAR_GRAY;
    wrapper.title = now ? 'Bookmarked' : 'Bookmark this problem';
    const label = wrapper.parentElement?.querySelector('.cf-bm-text');
    if (label) label.textContent = now ? 'Bookmarked' : 'Bookmark this problem';
  });

  return wrapper;
}

export function createSidebarWidget(problemId: string): HTMLElement {
  const widget = document.createElement('div');
  widget.className = 'cf-bookmark-widget roundbox sidebox';
  widget.style.cssText = 'margin-top:1em;';

  const caption = document.createElement('div');
  caption.className = 'caption titled';
  caption.textContent = '→ CF Analytics Pro';

  const content = document.createElement('div');
  content.className = 'content';
  content.style.cssText = 'padding:8px;text-align:center;';

  const starSlot = document.createElement('span');
  starSlot.className = 'cf-bm-star-slot';
  starSlot.style.cssText = 'display:inline-flex;';

  const label = document.createElement('span');
  label.className = 'cf-bm-text';
  label.style.cssText = 'font-size:11px;color:#666;display:block;margin-top:4px;';

  const bookmarked = isBookmarked(problemId);
  label.textContent = bookmarked ? 'Bookmarked' : 'Bookmark this problem';

  content.appendChild(starSlot);
  content.appendChild(label);
  starSlot.appendChild(createStarButton(problemId, 'large'));

  widget.appendChild(caption);
  widget.appendChild(content);

  return widget;
}
