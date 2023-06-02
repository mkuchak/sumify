import { Prompt } from "@/domain/entity/Prompt";

export interface Config {
  temperature?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  maxTokens?: number;
  n?: number;
}

export interface OpenAIGateway {
  call(prompt: Prompt, config?: Config): Promise<string>;
}
