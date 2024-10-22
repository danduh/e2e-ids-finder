import { Component, OnInit } from "@angular/core";
import { getTabId } from "../shared/base-chrome-class";

import { CommonModule } from "@angular/common";
import { ConfigurationService } from "../shared/config-store.service";
import {MatButton} from "@angular/material/button";


@Component({
  standalone: true,
  selector: "app-actions",
  templateUrl: "./actions.component.html",
  imports: [CommonModule, MatButton],
  styleUrls: [ "./actions.component.scss" ],
  providers: [ ConfigurationService ]
})
export class ActionsComponent implements OnInit {
  attributeId!: string | null

  constructor(private configurationService: ConfigurationService){

  }

  async ngOnInit(){
    const config = await this.configurationService.getConfiguration()
    this.attributeId = config.attributeId
  }

  async showElements(){
    try {
      const tabId = await getTabId() || 0
      chrome.scripting.executeScript({
        target: {
          tabId
        },
        func: () => {
          // @ts-ignore
          showE2Areas();
        },
        // files: [ "/assets/scripts/e2e-searcher.js" ]
      }, (e) => {
        console.warn(e);
      });
    } catch (e) {
      console.error(e)
    }
  }

  async hideElements(){
    chrome.scripting.executeScript({
      target: {
        tabId: await getTabId(),
      },
      func: () => {
        // @ts-ignore
        clearE2Areas();
      },
    });
  }
}
