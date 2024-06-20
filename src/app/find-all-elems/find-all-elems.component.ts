import {ChangeDetectorRef, Component, OnInit} from "@angular/core";
import {BaseChromeClass, getTabId} from "../shared/base-chrome-class";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {OpenAiService} from "../openai.service";
import {CodeHolderComponent} from "../code-holder/code-holder.component";
import {CommonModule} from "@angular/common";
import {ButtonModule, DDSAngularModule} from "@dds/angular";
import {PromptMessage, PromptsStoreService} from "../shared/prompts-store.service";
import {ConfigurationService, LocalConfiguration} from "../shared/config-store.service";

function interpolateString(template: string, values: any) {
  return template.replace(/\${(.*?)}/g, (match, p1) => values[p1.trim()]);
};

@Component({
  selector: "app-find-all-elems",
  standalone: true,
  imports: [FormsModule, CodeHolderComponent, CommonModule, ButtonModule, DDSAngularModule, ReactiveFormsModule],
  templateUrl: "./find-all-elems.component.html",
  styleUrl: "./find-all-elems.component.scss",
  providers: [OpenAiService, PromptsStoreService, ConfigurationService],
})
export class FindAllElemsComponent implements OnInit {
  systemMessages!: Promise<PromptMessage[]>;
  userPrompts!: Promise<PromptMessage[]>;
  config!: LocalConfiguration;

  allElements!: string;
  allElementsArray: string[] = [];
  pageObject: string = '';
  showHtml = false;

  modelAsked = false;
  requestForm = this.fb.group({
    pageObjectName: [],
    systemMessage: [],
    userPrompt: [''],
    customPrompt: ['']
  });

  constructor(
    private fb: FormBuilder,
    private ref: ChangeDetectorRef,
    private openAiService: OpenAiService,
    private storageService: PromptsStoreService,
    private configurationService: ConfigurationService
  ) {

  }

  loaderVisible = false;

  async ngOnInit() {
    await this.loadMessages()
    this.config = await this.configurationService.getConfiguration()
  }

  async loadMessages() {
    try {
      this.systemMessages = this.storageService.getSystemMessages();
      this.userPrompts = this.storageService.getUserPrompts();
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }


  async findAllElements() {
    const e2eAttr = this.config.attributeId
    const tabId = await getTabId()

    chrome.tabs.sendMessage(
      tabId,
      {action: "findAllActionElements", e2eAttr},
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

  async sendRequest() {
    const request = this.requestForm.value;
    const e2eAttr = this.config.attributeId || '';
    const values = {e2eAttr: e2eAttr};

    const systemMessage = interpolateString(request.systemMessage || '', values);
    this.loaderVisible = true;
    this.pageObject = await this.openAiService.askAI()(
      this.allElements,
      e2eAttr,
      request.customPrompt || '',
      request.pageObjectName || '',
      systemMessage
    );
    this.loaderVisible = false;
  }

  toggleHtml() {
    this.showHtml = !this.showHtml;
  }
}
