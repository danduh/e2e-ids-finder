export const getTabId = async () => {
  return await chrome.tabs
    .query({currentWindow: true, active: true})
    .then((tabs) => {
      return tabs[0].id || 0;
    })
}

export class BaseChromeClass {
  async getTabId() {
    return await chrome.tabs
      .query({currentWindow: true, active: true})
      .then((tabs) => {
        return tabs[0].id || 0;
      })
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

export interface LocalData {
  attributeId?: string;
  openAIKey?: string;
  includeShadowDom?: boolean;
  instanceType?: string;
  modelName?: string;
  apiEndPoint?: string;
}
