import { Component } from "@angular/core";

@Component({
  standalone: true,
  selector: "app-actions",
  templateUrl: "./actions.component.html",
  styleUrls: [ "./actions.component.scss" ]
})
export class ActionsComponent {
  async getTabId(){
    return await chrome.tabs.query({currentWindow: true, active: true})
      .then((tabs) => {
        return tabs[0].id || 0
      });
  }

  async showElements(){
    chrome.scripting.executeScript({
      target: {
        tabId: await this.getTabId()
      },
      func: () => {
        // @ts-ignore
        showE2Areas()
      },
      // files: [ "/assets/scripts/e2e-searcher.js" ]
    });
  }

  async hideElements(){
    chrome.scripting.executeScript({
      target: {
        tabId: await this.getTabId()
      },
      func: () => {
        // @ts-ignore
        clearE2Areas()
      },
      // files: [ "/assets/scripts/e2e-cleaner.js" ]
    });
  }
}
