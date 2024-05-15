import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "OPENAI`S_API_KEY",
  organization: "org-CAxyg9oPmeR29Idm23ZaqDDP",
  dangerouslyAllowBrowser: true,
});

export const askGpt = async (elemsString: string) => {
  debugger;
  const stream = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "user",
        content: `Create a PAge Object based on provided elements in string. Not that we using 'ke2e' data attribute for selecting elements. \n
          ${elemsString} \n
           no natural language, code only`,
      },
    ],
    stream: true,
  });

  let t = "";

  for await (const chunk of stream) {
    debugger;
    if (chunk.object === "chat.completion.chunk") {
      // Display data from the chunk
      console.log("Received chunk:", chunk.choices[0].delta.content);
    }
  }

  // console.log(chatCompletion); // {id: "…", choices: […], …}

  // for await (const chunk of stream) {
  //   const responseMessage = chunk.choices[0].delta;

  //   console.log(responseMessage);
  // }
};

askGpt("d");
