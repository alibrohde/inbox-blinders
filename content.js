const STORAGE_KEY = 'blindersEnabled';
const HOST = location.hostname;

function applyState(enabled) {
  document.body.classList.toggle('blinders-on', enabled);
}

function detectGmailView() {
  const hash = location.hash || '#inbox';
  const view = hash.match(/^#([^/?]+)/)?.[1] ?? 'inbox';
  document.body.dataset.gmailView = view;
}

function detectSuperhumanFolder() {
  const title = document.title || '';
  const folder = title.split(' • ')[0]?.toLowerCase().trim() || '';
  document.body.dataset.shFolder = folder;
}

async function init() {
  if (!document.body) {
    await new Promise((r) =>
      document.addEventListener('DOMContentLoaded', r, { once: true })
    );
  }

  const stored = await chrome.storage.local.get(STORAGE_KEY);
  applyState(stored[STORAGE_KEY] ?? true);

  if (HOST === 'mail.google.com') {
    detectGmailView();
    window.addEventListener('hashchange', detectGmailView);
  } else if (HOST === 'mail.superhuman.com') {
    detectSuperhumanFolder();
    const titleEl = document.querySelector('title');
    if (titleEl) {
      new MutationObserver(detectSuperhumanFolder).observe(titleEl, {
        childList: true,
        characterData: true,
        subtree: true,
      });
    }
  }

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg?.type === 'TOGGLE') applyState(msg.enabled);
  });
}

init();
