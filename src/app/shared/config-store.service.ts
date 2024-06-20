import { Injectable } from '@angular/core';

export interface LocalConfiguration {
  attributeId: string | null;
  openAIKey: string | null;
  includeShadowDom: boolean;
  instanceType: string | null;
  modelName: string;
  apiEndPoint: string | null;
}


@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  private readonly CONFIGURATION_KEY = 'localConfiguration';

  constructor() {}

  // Fetch the configuration data
  getConfiguration(): Promise<LocalConfiguration> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([this.CONFIGURATION_KEY], (result) => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve(result[this.CONFIGURATION_KEY] || {});
      });
    });
  }

  // Save the configuration data
  saveConfiguration(config: LocalConfiguration): Promise<void> {
    return new Promise((resolve, reject) => {
      const data = { [this.CONFIGURATION_KEY]: config };
      chrome.storage.local.set(data, () => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve();
      });
    });
  }

  // Clear the configuration data
  clearConfiguration(): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.remove([this.CONFIGURATION_KEY], () => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve();
      });
    });
  }
}
