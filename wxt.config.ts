import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: 'src',
  outDir: '.output',
  
  manifest: {
    name: 'CF Analytics Pro',
    description: 'Advanced Codeforces Profile Analytics',
    version: '1.0.0',
    permissions: ['storage'],
    host_permissions: ['https://codeforces.com/*'],
    icons: {
      16: 'icons/icon16.png',
      48: 'icons/icon48.png',
      128: 'icons/icon128.png'
    },
    action: {
      default_popup: 'popup.html',
      default_icon: {
        16: 'icons/icon16.png',
        48: 'icons/icon48.png',
        128: 'icons/icon128.png'
      }
    },
    content_scripts: [
      {
        matches: ['https://codeforces.com/profile/*'],
        js: ['content-scripts/content.js'],
        run_at: 'document_idle'
      },
      {
        matches: ['https://codeforces.com/problemset/problem/*', 'https://codeforces.com/contest/*/problem/*', 'https://codeforces.com/gym/*/problem/*'],
        js: ['problem-page.js'],
        run_at: 'document_idle'
      }
    ]
  }
});
