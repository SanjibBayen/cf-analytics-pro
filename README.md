# CF Analytics Pro

Advanced Codeforces profile analytics extension. Gain deeper insights into your competitive programming journey with beautiful charts, weak topic detection, bookmark management, and more.

## Features

### Overview Dashboard
- **Problem Ratings** - Bar chart with official Codeforces rating colors showing your solved problem distribution. Click any bar to filter problems by rating.
- **Tags Solved** - Interactive donut chart with scrollable legend showing problem count per tag. Click any slice or legend item to filter by tag.
- **Weak Topics** - Automatically identifies topics where you have unsolved problems. Each topic includes a direct practice link filtered by your optimal difficulty range.

### Tags Analysis
- Complete breakdown of all attempted tags with solved and unsolved counts
- Expand any tag to see individual problem links with rating-based coloring
- Clean progress indicators showing solve rate per topic

### Unsolved Problems
- **Smart Grouping** - Problems organized by attempt count: Stuck (5+), Close (3-4), Fresh (1-2)
- **Bookmarks** - Save any problem for later with one click using native Codeforces star icons
- **Private** - Bookmarks stored locally in your browser, invisible to other users
- Hover to see attempt count and last attempt timestamp

### Customization
- Toggle any section on or off from the extension popup
- Settings persist across sessions
- Minimal, clean interface matching Codeforces design language

## Installation

### Chrome Web Store
Coming soon.

### Manual Installation
1. Download the latest release from the Releases page
2. Open Chrome and navigate to `chrome://extensions`
3. Enable Developer mode in the top right corner
4. Click Load unpacked and select the extension folder
5. Visit any Codeforces profile page to see analytics

### Build from Source
```
git clone https://github.com/SanjibBayen/cf-analytics-pro.git
cd cf-analytics-pro
npm install
npm run build
```
The built extension will be in the `.output/chrome-mv3` directory.

## Privacy

CF Analytics Pro respects your privacy:
- All data processing happens locally in your browser
- No analytics, tracking, or telemetry
- Bookmarks are stored in your browser localStorage
- Only communicates with the official Codeforces API
- No user data is ever sent to external servers

## Technical Stack

| Layer | Technology |
|-------|-----------|
| Framework | WXT (Web Extension Tools) |
| Language | TypeScript |
| Charts | Chart.js |
| Storage | chrome.storage.local, localStorage |
| Build | Vite |

## License

Apache-2.0 Copyright 2026 Sanjib Bayen

## Author

Sanjib Bayen
- GitHub: https://github.com/SanjibBayen
