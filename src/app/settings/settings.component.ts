import { Component, OnInit } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AsyncPipe } from "@angular/common";

@Component({
  standalone: true,
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe
  ],
  styleUrls: [ "./settings.component.scss" ]
})
export class SettingsComponent implements OnInit {
  public e2eIdInput: FormControl = new FormControl("s");
  public e2eAttrDef = "e2e-id";
  public elemExample = this.buildExample`<button ${ this.e2eAttrDef }="myLoginBtn"> \n Login \n</button>`

  async buildExample(strings: TemplateStringsArray, e2eAttr: string){
    e2eAttr = await this.loadE2eId() || e2eAttr;
    return `${ strings[0] }${ e2eAttr }${ strings[1] }`
  }

  async ngOnInit(){
    this.e2eIdInput.setValue(await this.loadE2eId())
  }

  async saveE2e(){
    const e2eAttr = this.e2eIdInput.getRawValue()
    await chrome.storage.sync.set({
      attributeId: e2eAttr
    })

    this.elemExample = this.buildExample`<button ${ e2eAttr }="myLoginBtn"> \n Login \n</button>`
  }

  async loadE2eId(){
    return await chrome.storage.sync.get({
      attributeId: "e2e-id"
    })
      .then((resp) => {
        return resp["attributeId"]
      });

  }

}
