const STORAGE_KEY = 'blindersEnabled';

async function getEnabled() {
  const stored = await chrome.storage.local.get(STORAGE_KEY);
  return stored[STORAGE_KEY] ?? true;
}

async function syncBadge(enabled) {
  await chrome.action.setBadgeText({ text: enabled ? 'ON' : '' });
  await chrome.action.setBadgeBackgroundColor({ color: '#0f766e' });
}

async function setEnabled(enabled) {
  await chrome.storage.local.set({ [STORAGE_KEY]: enabled });
  await syncBadge(enabled);

  const tabs = await chrome.tabs.query({
    url: ['https://mail.google.com/*', 'https://mail.superhuman.com/*'],
  });
  for (const tab of tabs) {
    chrome.tabs.sendMessage(tab.id, { type: 'TOGGLE', enabled }).catch(() => {});
  }
}

async function toggle() {
  await setEnabled(!(await getEnabled()));
}

chrome.runtime.onInstalled.addListener(async () => syncBadge(await getEnabled()));
chrome.runtime.onStartup.addListener(async () => syncBadge(await getEnabled()));
chrome.action.onClicked.addListener(toggle);
chrome.commands.onCommand.addListener((cmd) => {
  if (cmd === 'toggle-blinders') toggle();
});
