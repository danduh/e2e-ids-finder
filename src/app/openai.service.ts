import { Injectable } from "@angular/core";
import OpenAI from "openai";

import { OpenAIClient, AzureKeyCredential } from "@azure/openai";
import { promptV1 } from "./prompts";
import { ChatCompletionMessageParam } from "openai/resources";
import {LocalData} from "./shared/base-chrome-class";

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
