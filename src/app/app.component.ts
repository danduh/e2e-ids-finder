import {Component, OnInit} from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import {MatTab, MatTabContent, MatTabGroup, MatTabLink, MatTabNav, MatTabNavPanel} from "@angular/material/tabs";


@Component({
  standalone: true,
  selector: "app-root",
  templateUrl: "./app.component.html",
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatTab,
    MatTabGroup,
    MatTabContent,
    MatTabNav,
    MatTabNavPanel,
    MatTabLink,
  ],
  styleUrls: [ "./app.component.scss" ]
})
export class AppComponent implements OnInit {
  title = "@danduh/e2e-test-helper";
  navLinks = [
    {link:"/allElements", label:"Use AI (beta)"},
    // {link:"/actions", label:"Actions"},
    {link:"/prompts", label:"Prompts"},
    {link:"/settings", label:"Settings"}
  ]

  activeLink = this.navLinks[0].link;

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
