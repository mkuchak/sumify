// import { GPTTokens } from "gpt-tokens";

import { Model, Prompt } from "@/domain/entity/Prompt";

export class CalculateTokens {
  static calculate(prompt: string | Prompt, model?: Model): number {
    if (typeof prompt === "string") prompt = new Prompt(prompt, model);

    // const { usedTokens } = new GPTTokens({
    //   model: prompt.model,
    //   messages: prompt.value,
    // });

    // return usedTokens;

    // const text = prompt.value[0].content;
    const textJson = JSON.stringify(prompt.value);

    // const manualTokens = (textJson.split(" ").length / 700) * 1000;
    const manualTokens = (textJson.split(" ").length / 610) * 1000;

    return manualTokens;
  }
}
