import { Config, OpenAIStreamGateway } from "@/contract/gateway/OpenAIStreamGateway";
import { Prompt } from "@/domain/entity/Prompt";
import { ParsedEvent, ReconnectInterval, createParser } from "eventsource-parser";

export class OpenAIStreamGatewayClient implements OpenAIStreamGateway {
  API_URL = "https://api.openai.com/v1/chat/completions";

  constructor(private readonly apiKey: string) {}

  async call(prompt: Prompt, config?: Config): Promise<ReadableStream<Uint8Array>> {
    if (!prompt) throw new Error("Prompt not defined");

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    let counter = 0;

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
        stream: true,
        n: config?.n,
      }),
    });

    console.log("=================== STARTING STREAM ====================");
    console.log("[SUMMARY]", JSON.stringify(prompt.value, null, 2));

    const stream = new ReadableStream({
      async start(controller) {
        function onParse(event: ParsedEvent | ReconnectInterval) {
          if ("data" in event) {
            const { data } = event;
            if (data === "[DONE]") {
              controller.close();
              return;
            }
            try {
              const json = JSON.parse(data);
              const text = json.choices[0].delta?.content || "";
              if (counter < 2 && (text.match(/\n/) || []).length) return;
              const chunk = encoder.encode(text);
              controller.enqueue(chunk);
              counter++;
            } catch (error) {
              controller.error(error);
            }
          }
        }

        const parser = createParser(onParse);

        for await (const chunk of response.body as any) {
          parser.feed(decoder.decode(chunk));
        }
      },
    });

    return stream;
  }
}
