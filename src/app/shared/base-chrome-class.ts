export const getTabId = async () => {
  return await chrome.tabs
    .query({currentWindow: true, active: true})
    .then((tabs) => {
      return tabs[0].id || 0;
    })
}

