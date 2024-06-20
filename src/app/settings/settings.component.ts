import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AsyncPipe, CommonModule} from "@angular/common";
import {CheckboxModule, DDSAngularModule, HelperModule, IconModule, InputModule, LabelModule} from "@dds/angular";
import {ConfigurationService, LocalConfiguration} from "../shared/config-store.service";
import {RouterLink} from "@angular/router";
import {PromptsListComponent} from "../prompts/prompts-list/prompts-list.component";

const DEFAULT_E2E_ATTR = 'e2e-id';

@Component({
  standalone: true,
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  imports: [FormsModule, ReactiveFormsModule, AsyncPipe, DDSAngularModule, CheckboxModule,
    HelperModule,
    InputModule,
    LabelModule,
    CommonModule,
    FormsModule, ReactiveFormsModule, AsyncPipe, DDSAngularModule, IconModule,
    RouterLink, PromptsListComponent],
  providers: [ConfigurationService],
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent implements OnInit {
  configForm = this.fb.group({
    attributeId: [DEFAULT_E2E_ATTR, Validators.required],
    openAIKey: [''],
    includeShadowDom: [false],
    instanceType: [''],
    modelName: ['gpt-4-turbo', Validators.required],
    apiEndPoint: [''],
  });

  constructor(
    private fb: FormBuilder,
    private configurationService: ConfigurationService
  ) {
  }

  public elemExample = this
    .buildExample`<button ${DEFAULT_E2E_ATTR}="myLoginBtn"> \n Login \n</button>`;

  async buildExample(strings: TemplateStringsArray, e2eAttr: string) {
    return `${strings[0]}${e2eAttr}${strings[1]}`;
  }

  async ngOnInit() {
    const config = await this.configurationService.getConfiguration()
    this.elemExample = this
      .buildExample`<button ${config.attributeId as string}="myLoginBtn"> \n Login \n</button>`;

    this.configForm.setValue(config as LocalConfiguration)
  }

  async saveConfig() {
    await this.configurationService.saveConfiguration(this.configForm.value as LocalConfiguration)
      .catch(console.error)

    this.elemExample = this
      .buildExample`<button ${this.configForm.value.attributeId as string}="myLoginBtn"> \n Login \n</button>`;
  }
}
