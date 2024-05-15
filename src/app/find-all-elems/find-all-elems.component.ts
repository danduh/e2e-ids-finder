import { ChangeDetectorRef, Component } from "@angular/core";
import { BaseChromeClass } from "../shared/base-chrome-class";
import { FormsModule } from "@angular/forms";
import { OpenAiService } from "../openai.service";
import { CodeHolderComponent } from "../code-holder/code-holder.component";
import { CommonModule } from "@angular/common";
import {ButtonModule, DDSAngularModule} from "@dds/angular";

const content =
    "```typescript\n FAKE CONTENT```";


const getContent = (): Promise<string>=>{
  return new Promise((resolve) => {
    setTimeout(() => {
    resolve(content);
    }, 2500)
  })
}

@Component({
  selector: "app-find-all-elems",
  standalone: true,
  imports: [FormsModule, CodeHolderComponent, CommonModule, ButtonModule, DDSAngularModule],

  templateUrl: "./find-all-elems.component.html",
  styleUrl: "./find-all-elems.component.scss",
  providers: [OpenAiService],
})
export class FindAllElemsComponent extends BaseChromeClass {
  allElements!: string;
  allElementsArray: string[] = [];
  pageObject: string = '';
  showHtml = false;
  customPrompt!: string;
  poClassName: string = "";
  modelAsked = false;

  constructor(
    private ref: ChangeDetectorRef,
    private openAiService: OpenAiService
  ) {
    super();
  }

  async findAllElements() {
    const e2eAttr = await this.loadE2eId();
    const tabId = await this.getTabId();

    chrome.tabs.sendMessage(
      tabId,
      { action: "findAllActionElements", e2eAttr },
      (response) => {
        if (response.html) {
          // Display the HTML in your extension's UI
          this.allElements = response.html.join("||");
          this.allElementsArray = response.html;
          this.ref.detectChanges();
        } else {
          console.error(response.error);
        }
      }
    );
  }

  async askWithCustomProm() {
    const e2eAttr = await this.loadE2eId();

    this.pageObject = await this.openAiService.askAI()(
      this.allElements,
      e2eAttr,
      this.customPrompt,
      this.poClassName
    );
  }

  toggleHtml() {
    this.showHtml = !this.showHtml;
  }
}
