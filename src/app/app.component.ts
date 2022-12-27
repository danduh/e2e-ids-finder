import { Component, OnInit } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";

@Component({
  standalone: true,
  selector: "app-root",
  templateUrl: "./app.component.html",
  imports: [
    RouterOutlet,
    RouterLink,
  ],
  styleUrls: [ "./app.component.scss" ]
})
export class AppComponent implements OnInit {
  title = "@danduh/e2e-test-helper";
  e2eAttr = "ke2e"
  defaultStyle = "2px solid #000";

  async getTabId(){
    return await chrome.tabs.query({currentWindow: true, active: true})
      .then((tabs) => {
        return tabs[0].id || 0
      });
  }

  async ngOnInit(){
    chrome.scripting.executeScript({
      target: {
        tabId: await this.getTabId()
      },
      files: [ "/assets/ui-handler.js" ]
    });

  }
}
