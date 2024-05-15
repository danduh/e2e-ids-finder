export interface PromptData {
  elemsString: string;
  e2eAttr: string;
  customPrompt: string;
  poClassName: string;
}

const systemMsg = (e2eAttr: string)=>`You are an expert in creating a Page Object for Cypress UI Tests (TypeScript), based on provided elements in string.
You know that the best option to find elements (to create selectors) is to use the attribute, "${e2eAttr}".
If you see actionable elements such as buttons, links, inputs, without "${e2eAttr}" attribute you will add this elements as well.
When you see multiple elements with the same value in "${e2eAttr}" attribute, you will create selector that return list of all elements, and method that will allow select specific element by text.
Your responses are in TypeScript only, without natural language.`

export const promptV1 = ({
  elemsString,
  e2eAttr,
  customPrompt,
  poClassName,
}: PromptData): any[] => {
  console.log({
    elemsString,
    e2eAttr,
    customPrompt,
    poClassName,
  })
  return [
    {
      role: "system",
      content: systemMsg(e2eAttr)
    },
    {
      role: "user",
      content: `${elemsString} \n ${customPrompt}`,
    },
  ];
};
