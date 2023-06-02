import { Config, OpenAIGateway } from "@/contract/gateway/OpenAIGateway";
import { Prompt } from "@/domain/entity/Prompt";

interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
    index: number;
  }[];
  error?: {
    message: string;
    type: string;
    param: string;
    code: number;
  };
}

export class OpenAIGatewayClient implements OpenAIGateway {
  API_URL = "https://api.openai.com/v1/chat/completions";

  constructor(private readonly apiKey: string) {}

  async call(prompt: Prompt, config?: Config): Promise<string> {
    if (!prompt) throw new Error("Prompt not defined");

    const response = await fetch(this.API_URL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      method: "POST",
      body: JSON.stringify({
        model: prompt.model,
        messages: prompt.value,
        temperature: config?.temperature,
        top_p: config?.topP,
        frequency_penalty: config?.frequencyPenalty,
        presence_penalty: config?.presencePenalty,
        max_tokens: config?.maxTokens,
        n: config?.n,
      }),
    });

    const data: OpenAIResponse = await response.json();

    // console.log("=====================================================");
    console.log("[PROMPT]", JSON.stringify(prompt.value, null, 2));
    console.log("[CONTENT]", data?.choices?.[0]?.message?.content);
    console.log("[ERROR]",data?.error?.message);

    return data?.choices?.[0]?.message?.content.trim();
  }
}
