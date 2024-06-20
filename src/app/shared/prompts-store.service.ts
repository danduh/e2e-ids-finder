import {Injectable} from "@angular/core";
import {SYSTEM_DEFAULT} from "../prompts";

export type PromptMessage = {
  id: string;
  title: string;
  content: string;
}

@Injectable()
export class PromptsStoreService {

  private readonly SYSTEM_MESSAGES_KEY = 'systemMessages';
  private readonly USER_PROMPTS_KEY = 'userPrompts';
  private readonly MAX_COUNT = 10; // Limit for messages and prompts

  constructor() {
    this.initializeDefaults()
  }

  private async initializeDefaults() {
    const systemMessages = await this.getSystemMessages();
    if (systemMessages.length === 0) {
      await this.saveSystemMessage({title: 'Default System', content: SYSTEM_DEFAULT, id: "SYSTEM_DEFAULT"});
    }
  }

  // Fetch all system messages
  getSystemMessages(): Promise<PromptMessage[]> {
    return this.getStorageData(this.SYSTEM_MESSAGES_KEY);
  }

  // Fetch all user prompts
  getUserPrompts(): Promise<PromptMessage[]> {
    return this.getStorageData(this.USER_PROMPTS_KEY);
  }

  // Add or update a system message
  saveSystemMessage(message: PromptMessage): Promise<void> {
    return this.saveStorageData(this.SYSTEM_MESSAGES_KEY, message);
  }

  // Add or update a user prompt
  saveUserPrompt(message: PromptMessage): Promise<void> {
    return this.saveStorageData(this.USER_PROMPTS_KEY, message);
  }

  // Remove a system message
  deleteSystemMessage(messageId: string): Promise<void> {
    return this.deleteStorageData(this.SYSTEM_MESSAGES_KEY, messageId);
  }

  // Remove a user prompt
  deleteUserPrompt(messageId: string): Promise<void> {
    return this.deleteStorageData(this.USER_PROMPTS_KEY, messageId);
  }

  private async getStorageData(key: string): Promise<PromptMessage[]> {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get([key], (result) => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve(result[key] || []);
      });
    });
  }

  private async saveStorageData(key: string, message: PromptMessage): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const messages = await this.getStorageData(key);
      const index = messages.findIndex((m) => m.id === message.id);
      if (index > -1) {
        messages[index] = message;
      } else {
        if (messages.length >= this.MAX_COUNT) {
          return reject(new Error('Maximum count reached'));
        }
        messages.push(message);
      }
      const data = {[key]: messages};
      chrome.storage.sync.set(data, () => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve();
      });
    });
  }

  private async deleteStorageData(key: string, messageId: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const messages = await this.getStorageData(key);
      const updatedMessages = messages.filter((m) => m.id !== messageId);
      const data = {[key]: updatedMessages};
      chrome.storage.sync.set(data, () => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve();
      });
    });
  }
}
