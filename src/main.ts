import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";
import { provideRouter, withDebugTracing } from "@angular/router";
import { SettingsComponent } from "./app/settings/settings.component";
import { ActionsComponent } from "./app/actions/actions.component";

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([
      {path: "", redirectTo: "actions", pathMatch: "full"},
      {path: "settings", component: SettingsComponent},
      {path: "actions", component: ActionsComponent},

    ]),
  ]
});
