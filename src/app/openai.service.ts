import { Injectable } from "@angular/core";
import OpenAI from "openai";

import { OpenAIClient, AzureKeyCredential } from "@azure/openai";
import { promptV1 } from "./prompts";
import { ChatCompletionMessageParam } from "openai/resources";
import {LocalData} from "./shared/base-chrome-class";

const CONTEXT = {
  role: "assistant",
  content:
    "```typescript\nclass SmtpSettingsPageObject {\n  masthead = '[data-testid=\"masthead\"]';\n  headerTitle = '[data-testid=\"header-title\"]';\n  sidebarDrawerToggle = '[data-testid=\"sidebar-drawer-toggle\"]';\n  editPasswordModal = '[data-testid=\"edit-password-modal\"]';\n  sidebarContainer = '[data-testid=\"sidebar-container\"]';\n  sidebarToggleBtn = '[data-testid=\"sidebar-toggle-btn\"]';\n  asyncJobsStatus = '[data-testid=\"asyncJobsStatus\"]';\n  sidebarDashboard = '[data-testid=\"sidebar-dashboard\"]';\n  sidebarMachines = '[data-testid=\"sidebar-machines\"]';\n  sidebarTemplates = '[data-testid=\"sidebar-templates\"]';\n  sidebarDeployments = '[data-testid=\"sidebar-deployments\"]';\n  sidebarRules = '[data-testid=\"sidebar-rules\"]';\n  sidebarSchedules = '[data-testid=\"sidebar-schedules\"]';\n  sidebarMonitoring = '[data-testid=\"sidebar-monitoring\"]';\n  sidebarSettings = '[data-testid=\"sidebar-settings\"]';\n  sidebarSubitemsOfSettings = '[data-testid=\"sidebar-subitems-of-settings\"]';\n  systemSettingsTabsNavigation = '[data-testid=\"system_settings_tabsNaivation\"]';\n  smtpEditBtn = '[data-testid=\"smtpEditBtn\"]';\n  smtpClearBtn = '[data-testid=\"smtpClearBtn\"]';\n  settingsLabelSenderEmail = '[data-testid=\"settingsLabel_senderEmail\"]';\n  settingsValueSenderEmail = '[data-testid=\"settingsValue_senderEmail\"]';\n  settingsLabelHost = '[data-testid=\"settingsLabel_host\"]';\n  settingsValueHost = '[data-testid=\"settingsValue_host\"]';\n  settingsLabelPort = '[data-testid=\"settingsLabel_port\"]';\n  settingsValuePort = '[data-testid=\"settingsValue_port\"]';\n  settingsLabelTLS = '[data-testid=\"settingsLabel_TLS\"]';\n  settingsValueTLS = '[data-testid=\"settingsValue_TLS\"]';\n  testEmailBtn = '[data-testid=\"testEmailBtn\"]';\n  testEmailInput = '[data-testid=\"testEmail\"]';\n  smtpSettingsModal = '[data-testid=\"smtpSettingsModal\"]';\n  formLabelSenderEmail = '[data-testid=\"form_label_senderEmail\"]';\n  formLabelHost = '[data-testid=\"form_label_host\"]';\n  formLabelPort = '[data-testid=\"form_label_port\"]';\n  formLabelTLS = '[data-testid=\"form_label_TLS\"]';\n  formLabelAuthRequired = '[data-testid=\"form_label_authRequired\"]';\n  formLabelSmtpCertificates = '[data-testid=\"form_label_smtpCertificates\"]';\n  formLabelUsername = '[data-testid=\"form_label_username\"]';\n  formLabelPassword = '[data-testid=\"form_label_password\"]';\n  senderEmailInput = '[data-testid=\"senderEmail\"]';\n  hostInput = '[data-testid=\"host\"]';\n  usernameInput = '[data-testid=\"username\"]';\n  passwordInput = '[data-testid=\"password\"]';\n\n  // Elements with property title within system_settings_tabsNaivation\n  administrationTab = '[title=\"Administration\"]';\n  smtpTab = '[title=\"SMTP\"]';\n  remoteManagementTab = '[title=\"Remote Management\"]';\n\n  // Selectors for buttons within modal-actions\n  ModalApplyButton = '.modal-actions edf-button:nth-child(1)';\n  ModalCancelButton = '.modal-actions edf-button:nth-child(2)';\n\n  clickSidebarItem(itemTestId: string) {\n    cy.get(`[data-testid=\"${itemTestId}\"]`).click();\n  }\n\n  clickSystemSettingsTab(tabTitle: string) {\n    cy.get(this.systemSettingsTabsNavigation).contains(tabTitle).click();\n  }\n\n  clickModalApplyButton() {\n    cy.get(this.ModalApplyButton).click();\n  }\n\n  clickModalCancelButton() {\n    cy.get(this.ModalCancelButton).click();\n  }\n\n  // Additional actions can be added here as needed\n}\n\nexport default SmtpSettingsPageObject;\n```",
};


@Injectable()
export class OpenAiService {
  openai!: OpenAI;
  azureAI! : OpenAIClient;


  localData!: LocalData;
  constructor() {
    this.initService()
  }

  async initService() {
    this.localData = await chrome.storage.sync.get()

    this.openai = new OpenAI({
      apiKey: this.localData.openAIKey,
      dangerouslyAllowBrowser: true,
    });

    this.azureAI = new OpenAIClient(
      this.localData.apiEndPoint as string,
      new AzureKeyCredential(this.localData.openAIKey as string)
    );
  }

  askAI = ()=>{
    switch (this.localData.instanceType){
      case "AzureAI":
        return this.askAzureAI.bind(this)
      case "OpenAI":
        return this.askGpt.bind(this)
      default:
        return this.askGpt.bind(this)

    }
  }

   askAzureAI = async (
    elemsString: string,
    e2eAttr: string,
    customPrompt = "",
    poClassName = "SomePageObject"    
  ) => {
    const deploymentId = this.localData.modelName as string;
    const messages = promptV1({
      e2eAttr,
      elemsString,
      customPrompt,
      poClassName,
    });

    const response = await this.azureAI.getChatCompletions(deploymentId, messages, {
      temperature: 0.1,
    });

    console.warn(response);
    return CONTEXT.content;
    return response.choices[0].message?.content || "";
  }

  askGpt = async (
    elemsString: string,
    e2eAttr: string,
    customPrompt = "",
    poClassName = "SomePageObject"
  ) => {
    const t = await this.openai.chat.completions
      .create({
        model: this.localData.modelName as string,
        temperature: 0.1,
        messages: promptV1({
          e2eAttr,
          elemsString,
          customPrompt,
          poClassName,
        }) as unknown as Array<ChatCompletionMessageParam>,
      })
      .asResponse()
      .then((r) => r.json());

    return t.choices[0].message.content;
  }
}
