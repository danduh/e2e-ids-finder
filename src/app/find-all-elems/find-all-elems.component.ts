import { ChangeDetectorRef, Component } from "@angular/core";
import { BaseChromeClass } from "../shared/base-chrome-class";
import { FormsModule } from "@angular/forms";
import { OpenAiService } from "../openai.service";
import { CodeHolderComponent } from "../code-holder/code-holder.component";
import { CommonModule } from "@angular/common";

const content = 
    "```typescript\nclass SmtpSettingsPageObject {\n  masthead = '[data-testid=\"masthead\"]';\n  headerTitle = '[data-testid=\"header-title\"]';\n  sidebarDrawerToggle = '[data-testid=\"sidebar-drawer-toggle\"]';\n  editPasswordModal = '[data-testid=\"edit-password-modal\"]';\n  sidebarContainer = '[data-testid=\"sidebar-container\"]';\n  sidebarToggleBtn = '[data-testid=\"sidebar-toggle-btn\"]';\n  asyncJobsStatus = '[data-testid=\"asyncJobsStatus\"]';\n  sidebarDashboard = '[data-testid=\"sidebar-dashboard\"]';\n  sidebarMachines = '[data-testid=\"sidebar-machines\"]';\n  sidebarTemplates = '[data-testid=\"sidebar-templates\"]';\n  sidebarDeployments = '[data-testid=\"sidebar-deployments\"]';\n  sidebarRules = '[data-testid=\"sidebar-rules\"]';\n  sidebarSchedules = '[data-testid=\"sidebar-schedules\"]';\n  sidebarMonitoring = '[data-testid=\"sidebar-monitoring\"]';\n  sidebarSettings = '[data-testid=\"sidebar-settings\"]';\n  sidebarSubitemsOfSettings = '[data-testid=\"sidebar-subitems-of-settings\"]';\n  systemSettingsTabsNavigation = '[data-testid=\"system_settings_tabsNaivation\"]';\n  smtpEditBtn = '[data-testid=\"smtpEditBtn\"]';\n  smtpClearBtn = '[data-testid=\"smtpClearBtn\"]';\n  settingsLabelSenderEmail = '[data-testid=\"settingsLabel_senderEmail\"]';\n  settingsValueSenderEmail = '[data-testid=\"settingsValue_senderEmail\"]';\n  settingsLabelHost = '[data-testid=\"settingsLabel_host\"]';\n  settingsValueHost = '[data-testid=\"settingsValue_host\"]';\n  settingsLabelPort = '[data-testid=\"settingsLabel_port\"]';\n  settingsValuePort = '[data-testid=\"settingsValue_port\"]';\n  settingsLabelTLS = '[data-testid=\"settingsLabel_TLS\"]';\n  settingsValueTLS = '[data-testid=\"settingsValue_TLS\"]';\n  testEmailBtn = '[data-testid=\"testEmailBtn\"]';\n  testEmailInput = '[data-testid=\"testEmail\"]';\n  smtpSettingsModal = '[data-testid=\"smtpSettingsModal\"]';\n  formLabelSenderEmail = '[data-testid=\"form_label_senderEmail\"]';\n  formLabelHost = '[data-testid=\"form_label_host\"]';\n  formLabelPort = '[data-testid=\"form_label_port\"]';\n  formLabelTLS = '[data-testid=\"form_label_TLS\"]';\n  formLabelAuthRequired = '[data-testid=\"form_label_authRequired\"]';\n  formLabelSmtpCertificates = '[data-testid=\"form_label_smtpCertificates\"]';\n  formLabelUsername = '[data-testid=\"form_label_username\"]';\n  formLabelPassword = '[data-testid=\"form_label_password\"]';\n  senderEmailInput = '[data-testid=\"senderEmail\"]';\n  hostInput = '[data-testid=\"host\"]';\n  usernameInput = '[data-testid=\"username\"]';\n  passwordInput = '[data-testid=\"password\"]';\n\n  // Elements with property title within system_settings_tabsNaivation\n  administrationTab = '[title=\"Administration\"]';\n  smtpTab = '[title=\"SMTP\"]';\n  remoteManagementTab = '[title=\"Remote Management\"]';\n\n  // Selectors for buttons within modal-actions\n  ModalApplyButton = '.modal-actions edf-button:nth-child(1)';\n  ModalCancelButton = '.modal-actions edf-button:nth-child(2)';\n\n  clickSidebarItem(itemTestId: string) {\n    cy.get(`[data-testid=\"${itemTestId}\"]`).click();\n  }\n\n  clickSystemSettingsTab(tabTitle: string) {\n    cy.get(this.systemSettingsTabsNavigation).contains(tabTitle).click();\n  }\n\n  clickModalApplyButton() {\n    cy.get(this.ModalApplyButton).click();\n  }\n\n  clickModalCancelButton() {\n    cy.get(this.ModalCancelButton).click();\n  }\n\n  // Additional actions can be added here as needed\n}\n\nexport default SmtpSettingsPageObject;\n```";


const getContent = (): Promise<string>=>{
  return new Promise((resolve) => {
    setTimeout(() => {
    resolve(content);
    }, 2500)
  })
}

@Component({
  selector: "app-find-all-elems",
  standalone: true,
  imports: [FormsModule, CodeHolderComponent, CommonModule],

  templateUrl: "./find-all-elems.component.html",
  styleUrl: "./find-all-elems.component.scss",
  providers: [OpenAiService],
})
export class FindAllElemsComponent extends BaseChromeClass {
  allElements!: string;
  allElementsArray: string[] = [];
  pageObject!: string;
  showHtml = false;
  showCustomProm = false;
  customPrompt!: string;
  poClassName!: string;
  modelAsked = false;

  constructor(
    private ref: ChangeDetectorRef,
    private openAiService: OpenAiService
  ) {
    super();
  }

  async findAllElements() {
    const e2eAttr = await this.loadE2eId();
    const tabId = await this.getTabId();

    chrome.tabs.sendMessage(
      tabId,
      { action: "findAllActionElements", e2eAttr },
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

  async askForPageObject() {
    const e2eAttr = await this.loadE2eId();

    const response = await this.openAiService.askGpt(this.allElements, e2eAttr);
    this.pageObject = response;
  }

  async askWithCustomProm() {
    const e2eAttr = await this.loadE2eId();

    const response = await this.openAiService.askGpt(
      this.allElements,
      e2eAttr,
      this.customPrompt,
      this.poClassName
    );
    this.pageObject = response;
  }

  toggleCustomProm() {
    this.showCustomProm = !this.showCustomProm;
  }

  toggleHtml() {
    this.showHtml = !this.showHtml;
  }


  async fullScan(){
    this.modelAsked = true;
    const response = await getContent()
    this.pageObject = response;
  }
}
