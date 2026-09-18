# Contributing to CF Analytics Pro

Thank you for your interest in contributing. This document outlines the process for contributing to the project.

## Development Setup

1. Fork the repository
2. Clone your fork:

```
git clone https://github.com/SanjibBayen/cf-analytics-pro.git
cd cf-analytics-pro
```

3. Install dependencies:

```
npm install
```

4. Start development server:

```
npm run dev
```

5. Load the extension in Chrome from `.output/chrome-mv3`

## Project Structure

```
src/
  core/              Pure logic, no DOM. Types, storage, data processing, URL builders.
    constants.ts       CF rating colors, thresholds, TTLs
    processor.ts       Submission deduplication, tag stats
    storage.ts         localStorage + chrome.storage wrappers
    types.ts           All TypeScript interfaces
    url.ts             Codeforces URL builders

  entrypoints/       Extension entry points (auto-discovered by WXT)
    background.ts      Service worker — API fetch + 10-min cache
    content.ts         Profile page orchestrator — tabs, fetch, overview render
    problem-page.ts    Bookmark star injection on problem pages
    submit-helper.ts   Smart Submit auto-fill on submit pages
    popup/
      index.html       Popup markup
      main.ts          Popup toggle logic

  features/          Self-contained user-facing features
    bookmarks.ts       Star button + sidebar widget
    smart-submit.ts    Problem code auto-fill logic

  ui/                Rendering layer (DOM manipulation)
    charts/
      bar.ts           Problem Ratings bar chart
      donut.ts         Tags Solved donut chart
    tabs/
      tags.ts          Tags tab renderer
      unsolved.ts      Unsolved tab renderer
      weak-topics.ts   Weak Topics list (in Overview)
    shared/
      dom.ts           DOM helpers (waitFor, element creation)
      styles.ts        HTML escaping, shared style strings

  env.d.ts           WXT environment types
```

## Code Style

- TypeScript strict mode enabled
- No unused variables or parameters
- Consistent 2-space indentation
- Prettier for formatting

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes following the existing code style
3. Test your changes on multiple Codeforces profiles
4. Submit a pull request with a clear description

## Questions

Open an issue on GitHub for any questions or concerns.
