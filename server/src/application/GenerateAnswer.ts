import { OpenAIGateway } from "@/contract/gateway/OpenAIGateway";
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
  question: string;
  answer: string;
}

export class GenerateAnswer {
  constructor(private readonly openAIGateway: OpenAIGateway) {}

  async execute(input: GenerateAnswerInput): Promise<GenerateAnswerOutput> {
    const { question, schoolSubject, age = "8", words = "100", language = "pt-BR" } = input;

    const languageName = LanguageName.fromCode(language);

    const prompt = new Prompt(
      [
        {
          role: "system",
          content:
            `You are a {schoolSubject} teacher teaching a {age} year old kid. Answer this child clearly and concisely in {language} language using a maximum of {words} words. Whenever possible, provide examples.`
              .replace("{schoolSubject}", schoolSubject || "")
              .replace("{age}", age)
              .replace("{language}", languageName)
              .replace("{words}", words),
        },
        {
          role: "user",
          content: `Explain to an {age} year old child:: "{question}"`
            .replace("{age}", age)
            .replace("{question}", question),
        },
        {
          role: "system",
          content: `Deliver the response in JSON format following this example:
              {
                "question": "The question rewritten with the necessary spelling corrections in {language} language",
                "answer": "The answer of the question in {language} language"
              }`.replaceAll("{language}", languageName),
        },
        {
          role: "system",
          content: `Don't make up information. If you don't know the answer, just say you don't know in the JSON format.`,
        },
        {
          role: "system",
          content: `Don't forget that the answer need to be in {language} language.`.replace(
            "{language}",
            languageName
          ),
        },
        {
          role: "system",
          content: `Don't forget that you are explaining to an {age} year old with limited knowledge.`.replace(
            "{age}",
            age
          ),
        },
        {
          role: "system",
          content: `Do not apologize. ALWAYS return the specified JSON.`,
        },
      ],
      "gpt-3.5-turbo"
    );

    const promise = this.openAIGateway.call(prompt, { temperature: 0.4 });
    const response = await pRetry(() => promise, { retries: 3, minTimeout: 30000 });
    const { question: rewrittenQuestion, answer } = JSON.parse(response);

    return {
      question: rewrittenQuestion,
      answer,
    };
  }
}
