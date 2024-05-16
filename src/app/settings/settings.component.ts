import { Component, OnInit } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AsyncPipe } from "@angular/common";
import {DDSAngularModule} from "@dds/angular";
import {LocalData} from "../shared/base-chrome-class";

@Component({
  standalone: true,
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  imports: [FormsModule, ReactiveFormsModule, AsyncPipe, DDSAngularModule],
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent implements OnInit {
  public e2eIdInput: FormControl = new FormControl("s");
  public includeShadowDom: FormControl = new FormControl(false);
  public openAIKey: FormControl = new FormControl('');
  public instanceType: FormControl = new FormControl('');
  public modelName: FormControl = new FormControl('gpt-4-turbo');
  public apiEndPoint: FormControl = new FormControl('');

  public e2eAttrDef = "e2e-id";
  public elemExample = this
    .buildExample`<button ${this.e2eAttrDef}="myLoginBtn"> \n Login \n</button>`;

  async buildExample(strings: TemplateStringsArray, e2eAttr: string) {
    const localData = await this.loadE2eId();
    e2eAttr = localData.attributeId || '';
    return `${strings[0]}${e2eAttr}${strings[1]}`;
  }

  async ngOnInit() {
    const localData = await this.loadE2eId()
    console.log(localData);
    this.e2eIdInput.setValue(localData.attributeId);
    this.openAIKey.setValue(localData.openAIKey);
    this.includeShadowDom.setValue(localData.includeShadowDom);
    this.instanceType.setValue(localData.instanceType);
    this.modelName.setValue(localData.modelName);
    this.apiEndPoint.setValue(localData.apiEndPoint);
  }

  async saveE2e() {
    const e2eAttr = this.e2eIdInput.getRawValue();
    const includeShadowDom = this.includeShadowDom.getRawValue();
    const openAIKey = this.openAIKey.getRawValue();
    const instanceType = this.instanceType.getRawValue();
    const modelName = this.modelName.getRawValue();
    const apiEndPoint = this.apiEndPoint.getRawValue();
    await chrome.storage.sync.set({
      attributeId: e2eAttr,
      includeShadowDom,
      openAIKey,
      instanceType,
      modelName,
      apiEndPoint
    });

    console.log('saved', {
      attributeId: e2eAttr,
      includeShadowDom,
      openAIKey,
      instanceType,
      modelName
    });

    this.elemExample = this
      .buildExample`<button ${e2eAttr}="myLoginBtn"> \n Login \n</button>`;
  }

  async loadE2eId(): Promise<LocalData> {
    return await chrome.storage.sync
      .get({
        attributeId: "e2e-id",
        openAIKey: "openAIKey",
        includeShadowDom: false,
        instanceType: "",
        modelName: "",
        apiEndPoint:""
      })
      .then((resp) => {
        return resp;
      });
  }

}
