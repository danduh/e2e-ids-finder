import {ChangeDetectorRef, Component, OnInit} from "@angular/core";
import {getTabId} from "../shared/base-chrome-class";
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {OpenAiService} from "../openai.service";
import {CodeHolderComponent} from "../code-holder/code-holder.component";
import {CommonModule} from "@angular/common";
import {PromptMessage, PromptsStoreService} from "../shared/prompts-store.service";
import {ConfigurationService, LocalConfiguration} from "../shared/config-store.service";
import {MatButton} from "@angular/material/button";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatInput} from "@angular/material/input";
import {MatProgressBar} from "@angular/material/progress-bar";

function interpolateString(template: string, values: any) {
  return template.replace(/\${(.*?)}/g, (match, p1) => values[p1.trim()]);
};

@Component({
  selector: "app-find-all-elems",
  standalone: true,
  imports: [FormsModule, CodeHolderComponent, CommonModule, MatButton, ReactiveFormsModule, MatProgressSpinner, MatLabel, MatFormField, MatSelect, MatOption, MatInput, MatProgressBar],
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
    debugger
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
    this.pageObject = '';
    const request = this.requestForm.value;
    const e2eAttr = this.config.attributeId || '';
    const values = {e2eAttr: e2eAttr};

    const systemMessage = interpolateString(request.systemMessage || '', values);
    this.loaderVisible = true;
    try {
      this.pageObject = await this.openAiService.askAI()(
        this.allElements,
        e2eAttr,
        request.customPrompt || '',
        request.pageObjectName || '',
        systemMessage
      );
    } catch (error: unknown) {
      if (error instanceof Error)
        this.pageObject = error.message;

    }
    this.loaderVisible = false;
  }

  toggleHtml() {
    this.showHtml = !this.showHtml;
  }
}
