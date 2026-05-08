# Inbox Blinders

A Chrome extension that hides your inbox so you can compose email without getting distracted by everything else sitting there.

Think of it as [News Feed Eradicator](https://west.io/news-feed-eradicator/), but for email. Supports Gmail and Superhuman.

![Icon](icons/icon128.png)

## What it does

When enabled (default), Inbox Blinders hides every email row on the **Inbox** view of Gmail or Superhuman. Compose, search, Sent, Drafts, and individual threads still work — only the inbox list is blanked out. On Gmail, the unread count next to "Inbox" in the sidebar is also hidden so the number doesn't pull you in.

Click the toolbar icon (or hit ⌘⇧B) to peek when you actually need to see email.

## Install

1. Clone or download this repo.
2. Open `chrome://extensions` in Chrome.
3. Toggle **Developer mode** on (top right).
4. Click **Load unpacked** and pick the `inbox-blinders` folder.
5. Pin the extension from the puzzle-piece menu.

## Usage

- **Default:** ON (inbox hidden).
- **Toggle:** click the toolbar icon, or ⌘⇧B on Mac (Ctrl+Shift+B on Windows/Linux).
- **Badge:** shows `ON` when blinders are active.
- The toggle persists across reloads and across Gmail tabs.

## Roadmap

- [x] Superhuman support
- [ ] Optional thread allowlist (always show specific senders)
- [ ] Per-label control (hide Inbox but show a chosen label)

## How it works

A content script sets `body.blinders-on` plus a per-host folder attribute:

- **Gmail** → `data-gmail-view` (read from `location.hash`).
- **Superhuman** → `data-sh-folder` (read from `document.title`, since Superhuman doesn't change the URL between folders; a `MutationObserver` keeps it in sync).

CSS scoped to those attributes hides only the inbox list:

- Gmail thread rows: `tr.zA`
- Superhuman thread rows: `.ThreadListItem`

The service worker handles the toolbar click and keyboard command, persists state in `chrome.storage.local`, and broadcasts toggles to every open mail tab.

If a provider's class names shift and rows stop hiding, inspect a row in DevTools, grab the new class, and update one line in `hide.css`.

## License

[MIT](LICENSE).
