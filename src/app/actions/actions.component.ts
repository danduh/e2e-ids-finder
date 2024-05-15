import { Component, OnInit } from "@angular/core";
import { BaseChromeClass } from "../shared/base-chrome-class";

import { CommonModule } from "@angular/common";
import {DDSAngularModule} from "@dds/angular";


@Component({
  standalone: true,
  selector: "app-actions",
  templateUrl: "./actions.component.html",
  imports: [CommonModule, DDSAngularModule],
  styleUrls: ["./actions.component.scss"],
})
export class ActionsComponent extends BaseChromeClass implements OnInit {
  attributeId!: string
  async ngOnInit(){
      this.attributeId = await this.loadE2eId()
  }
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
