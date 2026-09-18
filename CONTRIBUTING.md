# Contributing to CF Analytics Pro

Thank you for your interest in contributing. This document outlines the process for contributing to the project.

## Development Setup

1. Fork the repository
2. Clone your fork:

```
git clone https://github.com/YOUR_USERNAME/cf-analytics-pro.git
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
  entrypoints/       Extension entry points (content scripts, background, popup)
  utils/             Shared utility modules (charts, data processing, UI)
  types/             TypeScript type definitions
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
