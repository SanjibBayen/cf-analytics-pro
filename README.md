<div align="center">

[![Chrome Web Store](https://img.shields.io/badge/Chrome-Web%20Store-4285F4?logo=googlechrome&logoColor=white)](#installation)
[![Firefox Add-ons](https://img.shields.io/badge/Firefox-Add--ons-FF7139?logo=firefox&logoColor=white)](#installation)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE.md)
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](https://github.com/SanjibBayen/cf-analytics-pro/releases)

</div>

# CF Analytics Pro

Advanced analytics for Codeforces profiles, built for competitive programmers. Interactive charts, weak topic detection, bookmarks, and Smart Submit running fully in your browser with no external servers.

## Features

**Overview Dashboard**
- Problem Ratings bar chart with official Codeforces rating colors, clickable bars to filter by rating
- Tags Solved donut chart with scrollable legend, clickable slices to filter by tag
- Weak Topics detection with direct practice links filtered by optimal difficulty range

**Tags Analysis**
- Complete tag breakdown with solved and unsolved counts
- Expand any tag to view individual problem links with rating-based coloring

**Unsolved Problems**
- Smart grouping by attempt count: Stuck (5+), Close (3-4), Fresh (1-2)
- Bookmark any problem with one click using native Codeforces star icons
- Bookmarks stored locally, invisible to other users

**Smart Submit**
- Remembers the last problem you visited
- Auto-fills the problem code when you land on the submit page
- Works for problemset, contest, and gym submissions
- Respects the correct format for each page (full ID like 2264E2 for problemset, letter like E2 for contests)

**Customization**
- Toggle any section on or off from the extension popup
- Settings persist across sessions


## Installation

### Install from Source

Download the latest release: [cf-analytics-pro-v1.0.0](https://github.com/SanjibBayen/cf-analytics-pro/releases/latest)

Then follow the manual installation steps below.

### Chrome Web Store
> **Coming soon** - pending review.

### Firefox Add-ons
> **Coming soon** - pending review.

### Build from Source
```
git clone https://github.com/SanjibBayen/cf-analytics-pro.git
cd cf-analytics-pro
npm install
npm run build
```

## Contributing

Contributions are welcome. Please read the [Contributing Guide](CONTRIBUTING.md) before opening a pull request.

## Privacy & Security

All data is processed locally in your browser. No tracking, no telemetry, no external servers.

- **Storage** - Bookmarks and settings stay in your browser only
- **Network** - Only communicates with the official Codeforces API
- **Permissions** - Minimal: `storage` and access to `codeforces.com` only

For details, see the full [Security Policy](SECURITY.md).

## Tech Stack

TypeScript · WXT · Chart.js · Vite

## License

Licensed under the [Apache License 2.0](LICENSE.md) - Copyright 2026 Sanjib Bayen


## Author

Sanjib Bayen - [GitHub](https://github.com/SanjibBayen)



---


<div align="center">

*Built by a competitive programmer, for competitive programmers.*

**[Sanjib Bayen](https://codeforces.com/profile/devdaas)**

</div>
