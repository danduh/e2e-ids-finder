import { Component, OnInit, ViewChild, inject } from "@angular/core";
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { AsyncPipe, CommonModule } from "@angular/common";
import { ConfigurationService, LocalConfiguration } from "../shared/config-store.service";
import { RouterLink } from "@angular/router";
import { PromptsListComponent } from "../prompts/prompts-list/prompts-list.component";
import { OpenAiService } from "../openai.service";
import {MatDialog} from "@angular/material/dialog";
import {MatError, MatFormField, MatHint, MatInput, MatInputModule, MatLabel} from "@angular/material/input";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatButton} from "@angular/material/button";
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatIcon, MatIconModule} from "@angular/material/icon";

const DEFAULT_E2E_ATTR = 'e2e-id';

@Component({
  standalone: true,
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule, AsyncPipe, MatFormField, MatOption, MatProgressBarModule,
    RouterLink, PromptsListComponent, MatInputModule, MatLabel, MatHint, MatError, MatCheckbox, MatSelect, MatButton, MatIconModule],
  providers: [ ConfigurationService, OpenAiService ],
  styleUrls: [ "./settings.component.scss" ],
})
export class SettingsComponent implements OnInit {
  private _snackBar = inject(MatSnackBar);
  public loaderVisible = false;
  public hideApi = true;
  public configForm = this.fb.group({
    attributeId: [ DEFAULT_E2E_ATTR, Validators.required ],
    openAIKey: [ '' ],
    includeShadowDom: [ false ],
    instanceType: [ '' ],
    modelName: [ 'gpt-4-turbo', Validators.required ],
    apiEndPoint: [ '' ],
  });
  public testResponse: string = '';

  @ViewChild('modal') modal!: MatDialog

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
    this._snackBar.open(this.testResponse, "Done");
  }
}
