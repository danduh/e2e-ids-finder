import { Injectable } from "@angular/core";
import OpenAI from "openai";

import { OpenAIClient, AzureKeyCredential } from "@azure/openai";
import { promptV1 } from "./prompts";
import { ChatCompletionMessageParam } from "openai/resources";
import {LocalData} from "./shared/base-chrome-class";

const OpenAIUrlDell = "https://openai.aiaccel.dell.com";
const OpenAIUrlOriginal = "https://api.openai.com/v1/chat/completions";
const KEY_Or = "OPEN_AI_KEY";
const KEY_Dell = "DELL_KEY";

const client = new OpenAIClient(
  OpenAIUrlDell,
  new AzureKeyCredential(KEY_Dell)
);




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
      OpenAIUrlDell,
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
    const deploymentId = "gpt-4-turbo";
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
        model: "gpt-4-turbo",
        messages: promptV1({
          e2eAttr,
          elemsString,
          customPrompt,
          poClassName: "SomePageObject",
        }) as unknown as Array<ChatCompletionMessageParam>,
      })
      .asResponse()
      .then((r) => r.json());

    console.warn(t.choices[0].message.content);
    return t.choices[0].message.content;
  }
}
