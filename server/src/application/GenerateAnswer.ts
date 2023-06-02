import { OpenAIStreamGateway } from "@/contract/gateway/OpenAIStreamGateway";
import { Prompt } from "@/domain/entity/Prompt";
import { LanguageName } from "@/domain/service/LanguageName";
import pRetry from "p-retry";

export interface GenerateAnswerInput {
  question: string;
  schoolSubject?: string;
  age?: string;
  words?: string;
  language?: string;
}

export interface GenerateAnswerOutput {
  stream: ReadableStream<Uint8Array>;
}

export class GenerateAnswer {
  constructor(private readonly openAIStreamGateway: OpenAIStreamGateway) {}

  async execute(input: GenerateAnswerInput): Promise<GenerateAnswerOutput> {
    const { question, schoolSubject = "", age = "8", words = "100", language = "pt-BR" } = input;

    const languageName = LanguageName.fromCode(language);

    const prompt = new Prompt(
      [
        {
          role: "system",
          content: `You are a {schoolSubject} teacher teaching a {age} year old kid. Answer this child clearly and concisely in {language} language using a maximum of {words} words. Whenever possible, provide examples.`,
        },
        {
          role: "system",
          content: `Don't make up information. If you don't know the answer, just say you don't know.`,
        },
        {
          role: "system",
          content: `Don't forget that the answer need to be in {language} language.`,
        },
        {
          role: "system",
          content: `Don't forget that you are explaining to an {age} year old with limited knowledge.`,
        },
        {
          role: "system",
          content: `Don't ever apologize.`,
        },
        {
          role: "user",
          content: `Explain to an {age} year old child: "{question}"`,
        },
      ],
      "gpt-3.5-turbo"
    );

    prompt.replaceKeys({
      "{schoolSubject}": schoolSubject,
      "{age}": age,
      "{language}": languageName,
      "{words}": words,
      "{question}": question,
    });

    const stream = await this.openAIStreamGateway.call(prompt, { temperature: 0.4 });

    return { stream };
  }
}
