export interface PromptData {
  elemsString: string;
  e2eAttr: string;
  customPrompt: string;
  poClassName: string;
  systemMessage: string;
  userPrompt?: string;
}

const systemMsg = (e2eAttr: string) => `You are an expert in creating a Page Object for Cypress UI Tests (TypeScript), based on provided elements in INPUT section. \n
You know that the best option to find elements (to create selectors) is to use the attribute, "${e2eAttr}" \n.
If you see actionable elements such as buttons, links, inputs, without "${e2eAttr}" attribute you will create selectors for this elements as well as for the elements with "${e2eAttr}" attribute. \n
If you see elements with tag <dds-button> or <button> you will create selectors for this elements too. \n
When you see multiple elements with the same value in "${e2eAttr}" attribute, you will create selector that return list of all elements, and method that will allow select specific element by text. \n
Your responses are in TypeScript only, without natural language.`

export const SYSTEM_DEFAULT = "You are an expert in creating a Page Object for Cypress UI Tests (TypeScript), based on provided elements in INPUT section. \n" +
  "You know that the best option to find elements (to create selectors) is to use the attribute, \"${e2eAttr}\" \n" +
  "If you see actionable elements such as buttons, links, inputs, without \"${e2eAttr}\" attribute you will create selectors for this elements as well as for the elements with \"${e2eAttr}\" attribute. \n" +
  "If you see elements with tag <dds-button> or <button> you will create selectors for this elements too. \n" +
  "When you see multiple elements with the same value in \"${e2eAttr}\" attribute, you will create selector that return list of all elements, and method that will allow select specific element by text. \n" +
  "Your responses are in TypeScript only, without natural language."

export const promptV1 = ({
                           elemsString,
                           e2eAttr,
                           customPrompt,
                           poClassName,
                           systemMessage,
                           userPrompt
                         }: PromptData): any[] => {
  console.log({
    elemsString,
    e2eAttr,
    customPrompt,
    poClassName,
    systemMessage,
    userPrompt
  })

  return [
    {
      role: "system",
      content: systemMessage
    },
    {
      role: "user",
      content: `Create Page Object class with name ${poClassName}. \n INPUT>>: ${elemsString} <<INPUT  \n ${userPrompt}`,
    },
  ];
};
