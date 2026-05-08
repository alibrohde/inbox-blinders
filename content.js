const STORAGE_KEY = 'blindersEnabled';

function applyState(enabled) {
  document.body.classList.toggle('blinders-on', enabled);
}

function detectView() {
  const hash = location.hash || '#inbox';
  const view = hash.match(/^#([^/?]+)/)?.[1] ?? 'inbox';
  document.body.dataset.gmailView = view;
}

async function init() {
  if (!document.body) {
    await new Promise((r) =>
      document.addEventListener('DOMContentLoaded', r, { once: true })
    );
  }

  const stored = await chrome.storage.local.get(STORAGE_KEY);
  const enabled = stored[STORAGE_KEY] ?? true;
  applyState(enabled);
  detectView();

  window.addEventListener('hashchange', detectView);

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg?.type === 'TOGGLE') applyState(msg.enabled);
  });
}

init();
