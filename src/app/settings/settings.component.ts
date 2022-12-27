import { Component, OnInit } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";

@Component({
  standalone: true,
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  styleUrls: [ "./settings.component.scss" ]
})
export class SettingsComponent implements OnInit {
  public e2eIdInput!: FormControl;

  async ngOnInit(){
    this.e2eIdInput = new FormControl(await this.loadE2eId());
  }

  async saveE2e(){
    const e2eAttr = this.e2eIdInput.getRawValue()
    await chrome.storage.sync.set({
      attributeId: e2eAttr
    })
      .then((res) => {
        console.log(res)
      })
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
