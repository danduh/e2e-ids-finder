import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";
import { provideRouter, withDebugTracing } from "@angular/router";
import { SettingsComponent } from "./app/settings/settings.component";
import { ActionsComponent } from "./app/actions/actions.component";
import { FindAllElemsComponent } from "./app/find-all-elems/find-all-elems.component";
import "prismjs/components/prism-css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-scss";
import { importProvidersFrom } from "@angular/core";
import { DDSAngularModule } from "@dds/angular";

bootstrapApplication(AppComponent, {

  providers: [
    importProvidersFrom([DDSAngularModule]),
    provideRouter([
      { path: "", redirectTo: "allElements", pathMatch: "full" },
      { path: "settings", component: SettingsComponent },
      { path: "actions", component: ActionsComponent },
      { path: "allElements", component: FindAllElemsComponent },
    ]),
  ],
});
