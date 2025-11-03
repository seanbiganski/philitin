// Background service worker (kept minimal for Manifest V3)
chrome.runtime.onInstalled.addListener(() => {
  console.log('Form Filler extension installed');
});

