import { Component } from "@angular/core";
import { BaseChromeClass } from "../shared/base-chrome-class";

import { CommonModule } from "@angular/common";
import {DDSAngularModule} from "@dds/angular";

function test(e2eAttr: string) {
  const elements = document.querySelectorAll(`[${e2eAttr}]`);
  console.log(elements);
  elements.forEach((elem: any) => {
    elem.style.border = "2px solid #000";
  });
}

@Component({
  standalone: true,
  selector: "app-actions",
  templateUrl: "./actions.component.html",
  imports: [CommonModule, DDSAngularModule],
  styleUrls: ["./actions.component.scss"],
})
export class ActionsComponent extends BaseChromeClass {
  async showElements() {
    chrome.scripting.executeScript({
      target: {
        tabId: await this.getTabId(),
      },
      func: () => {
        // @ts-ignore
        showE2Areas();
      },
      // files: [ "/assets/scripts/e2e-searcher.js" ]
    });
  }

  async hideElements() {
    chrome.scripting.executeScript({
      target: {
        tabId: await this.getTabId(),
      },
      func: () => {
        // @ts-ignore
        clearE2Areas();
      },
    });
  }
}
