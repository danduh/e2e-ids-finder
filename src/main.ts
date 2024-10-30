import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";
import { provideRouter } from "@angular/router";
import { SettingsComponent } from "./app/settings/settings.component";
import { ActionsComponent } from "./app/actions/actions.component";
import { FindAllElemsComponent } from "./app/find-all-elems/find-all-elems.component";
import "prismjs/components/prism-css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-scss";
import { importProvidersFrom } from "@angular/core";
import {PromptsComponent} from "./app/prompts/prompts.component";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";

bootstrapApplication(AppComponent, {
  providers: [
    // importProvidersFrom([DDSAngularModule]),
    provideAnimationsAsync(),
    provideRouter([
      { path: "", redirectTo: "allElements", pathMatch: "full" },
      { path: "prompts", component: PromptsComponent },
      { path: "settings", component: SettingsComponent },
      { path: "develop", component: ActionsComponent },
      { path: "allElements", component: FindAllElemsComponent },
    ]),
  ],
});
