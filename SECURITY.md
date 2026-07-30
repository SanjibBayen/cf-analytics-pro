# Security Policy

## Data Privacy

CF Analytics Pro processes all data locally in your browser. No user data is collected, stored externally, or transmitted to third parties.

- **Codeforces API** - The extension communicates only with the official Codeforces API (codeforces.com)
- **Bookmarks** - Stored in browser localStorage, never transmitted
- **Settings** - Stored in chrome.storage.local
- **Analytics** - None. No tracking, no telemetry, no usage statistics

## Permissions

The extension requires minimal permissions:
- `storage` - For saving user preferences
- Host permission: `https://codeforces.com/*` - For API access

No other permissions are requested or required.

## Reporting Issues

If you discover a security concern, please open an issue on GitHub.