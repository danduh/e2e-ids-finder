import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { AsyncPipe, CommonModule } from "@angular/common";
import { CheckboxModule, DDSAngularModule, HelperModule, IconModule, InputModule, LabelModule } from "@dds/angular";
import { ConfigurationService, LocalConfiguration } from "../shared/config-store.service";
import { RouterLink } from "@angular/router";
import { PromptsListComponent } from "../prompts/prompts-list/prompts-list.component";
import { OpenAiService } from "../openai.service";
import { ModalComponent } from "@dds/angular/lib/modal/modal.component";

const DEFAULT_E2E_ATTR = 'e2e-id';

@Component({
  standalone: true,
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  imports: [  CheckboxModule,
    HelperModule,
    InputModule,
    LabelModule,
    CommonModule,
    FormsModule, ReactiveFormsModule, AsyncPipe, DDSAngularModule, IconModule,
    RouterLink, PromptsListComponent ],
  providers: [ ConfigurationService, OpenAiService ],
  styleUrls: [ "./settings.component.scss" ],
})
export class SettingsComponent implements OnInit {
  public loaderVisible = false;
  public configForm = this.fb.group({
    attributeId: [ DEFAULT_E2E_ATTR, Validators.required ],
    openAIKey: [ '' ],
    includeShadowDom: [ false ],
    instanceType: [ '' ],
    modelName: [ 'gpt-4-turbo', Validators.required ],
    apiEndPoint: [ '' ],
  });
  public testResponse: string = '';

  @ViewChild('modal') modal!: ModalComponent

  constructor(
    private fb: FormBuilder,
    private configurationService: ConfigurationService,
    private openAiService: OpenAiService,
  ){
  }

  public elemExample = this
    .buildExample`<button ${DEFAULT_E2E_ATTR}="myLoginBtn"> \n Login \n</button>`;

  async buildExample(strings: TemplateStringsArray, e2eAttr: string){
    return `${strings[0]}${e2eAttr}${strings[1]}`;
  }

  async ngOnInit(){
    const config = await this.configurationService.getConfiguration()
    this.elemExample = this
      .buildExample`<button ${config.attributeId as string}="myLoginBtn"> \n Login \n</button>`;

    this.configForm.setValue(config as LocalConfiguration)
  }

  async saveConfig(){
    await this.configurationService.saveConfiguration(this.configForm.value as LocalConfiguration)
      .catch(console.error)

    this.elemExample = this
      .buildExample`<button ${this.configForm.value.attributeId as string}="myLoginBtn"> \n Login \n</button>`;
  }

  async testSettings(){
    await this.saveConfig()
    const e2eAttr = this.configForm.value.attributeId || '';
    this.loaderVisible = true;
    try {
      this.testResponse = await this.openAiService.askAI()(
        "",
        e2eAttr,
        'TEST_CONNECTION',
        '',
        ""
      );
    } catch (e: unknown){
      if(e instanceof  Error)
        this.testResponse = e.message;
      else
        console.error(e)
    }
    this.loaderVisible = false;
    this.modal.open()
  }
}
