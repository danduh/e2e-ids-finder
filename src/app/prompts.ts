import { ChatRequestMessage } from "@azure/openai";

export interface PromptData {
  elemsString: string;
  e2eAttr: string;
  customPrompt: string;
  poClassName: string;
}

export const promptV1 = ({
  elemsString,
  e2eAttr,
  customPrompt,
  poClassName,
}: PromptData): ChatRequestMessage[] => {
  return [
    {
      role: "user",
      content: `Create a Page Object for Cypress UI Tests (Typescript), based on provided elements in string. \n
      Note that we using "${e2eAttr}" attribute for selecting elements. \n
      
      Uset this format as an example \n
      class ${poClassName}{
        stringForAnElement = '[${e2eAttr}="some-id"]';
        systemSettingsTabsNaivation = '[${e2eAttr}="system_settings_tabsNaivation"]';
      
        clickOnTab(tabName: string) {
          cy.get(this.systemSettingsTabsNaivation).contains(tabName).click();
        }
      
        actionForAnElement(){
          cy.get(this.stringForAnElement).click();
        }
      }
      export default ${poClassName}; \n      
      If you see actionable elemnts such as buttons, links, inputs, without ${e2eAttr} attribute, please add them as well. \n
      ${elemsString} \n
      no natural language, code only. \n
      ${customPrompt} \n
      In addition:
      find element data-testid="system_settings_tabsNaivation" there is a three elements with property title, add this three elments to the PageObject to be accessable as other elements. \n
      find element by class modal-actions, there is edf-buttons, use this pattern to create selectors ".modal-actions edf-button:nth-child(x)
      `,
    },
  ];
};

export const promptV2 = ({
  elemsString,
  e2eAttr,
  customPrompt,
  poClassName,
}: PromptData): ChatRequestMessage[] => {
  return [
    {
      role: "user",
      content: `Create a Page Object for Cypress UI Tests (Typescript), based on provided elements in string. \n
        ${elemsString} \n
        no natural language, code only. \n
        ${customPrompt}
        `,
    },
  ];
};
