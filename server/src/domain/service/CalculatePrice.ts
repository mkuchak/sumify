// import { GPTTokens } from "gpt-tokens";

import { Model, Prompt } from "@/domain/entity/Prompt";

export class CalculatePrice {
  static calculate(prompt: string | Prompt, model?: Model): number {
    return 0;
    // if (typeof prompt === "string") prompt = new Prompt(prompt, model);

    // const { usedUSD } = new GPTTokens({
    //   model: prompt.model,
    //   messages: prompt.value,
    // });

    // return usedUSD;
  }
}
