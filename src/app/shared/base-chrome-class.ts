export class BaseChromeClass {
  async getTabId() {
    return await chrome.tabs
      .query({ currentWindow: true, active: true })
      .then((tabs) => {
        return tabs[0].id || 0;
      });
  }

  async loadE2eId() {
    return await chrome.storage.sync
      .get({
        attributeId: "e2e-id",
      })
      .then((resp) => {
        return resp["attributeId"];
      });
  }
}
