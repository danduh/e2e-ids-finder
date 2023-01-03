import { Component, OnInit } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";

@Component({
  standalone: true,
  selector: "app-root",
  templateUrl: "./app.component.html",
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  styleUrls: [ "./app.component.scss" ]
})
export class AppComponent implements OnInit {
  title = "@danduh/e2e-test-helper";

  async getTabId(){
    return await chrome.tabs.query({currentWindow: true, active: true})
      .then((tabs) => {
        return tabs[0].id || 0
      });
  }

  async ngOnInit(){
    const tabId = await this.getTabId()
    const resp = await chrome.tabs.sendMessage(tabId, {text: "isUiHandlerInjected"})
      .catch((err) => {
        // For us, it indicates that no script was injected yet.
        // console.warn(err)
        return {}
      });

    if (resp.status !== true) {
      await chrome.scripting.executeScript({
        target: {
          tabId
        },
        files: [ "/assets/ui-handler.js" ]
      });

      await chrome.scripting.insertCSS({
        target: {
          tabId
        },
        files: [ "/assets/ui-handler.css" ]
      });
    }
  }
}
