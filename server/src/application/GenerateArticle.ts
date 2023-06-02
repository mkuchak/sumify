import { OpenAIGateway } from "@/contract/gateway/OpenAIGateway";
import { Prompt } from "@/domain/entity/Prompt";
import { CalculateTokens } from "@/domain/service/CalculateTokens";
import { CalculateWords } from "@/domain/service/CalculateWords";

export interface GenerateArticleInput {
  title: string;
  timedSummaries: {
    text: string;
    start: number;
    end: number;
    startFormatted?: string;
    endFormatted?: string;
  }[];
  language?: string; // on browser: navigator.language
}

export interface GenerateArticleOutput {
  article: string;
}

export class GenerateArticle {
  MODEL_MAX_TOKENS = 4096; // gpt-3.5-turbo
  BOOST_RATIO = 1.75; // 75% more tokens for not finishing a half-completion

  constructor(private readonly openAIGateway: OpenAIGateway) {}

  async execute(input: GenerateArticleInput): Promise<GenerateArticleOutput> {
    const { title, timedSummaries, language = "pt-BR" } = input;

    let summary = `[${title}]: `;
    timedSummaries.forEach((segment) => (summary += `${segment.text} `));
    const words = String(CalculateWords.calculateFromText(summary));

    const promptMask = `Write a concise and impersonal professional blog post of no more than {words} words based on the following content. Do not write in first person. Do not cite any author, speaker or participant. Create titles, subtitles, paragraphs and bullets by formatting the result in Markdown (.MD). The result must be in the {language} language: "{text}"`;
    const prompt = new Prompt(
      promptMask.replace("{words}", words).replace("{language}", language).replace("{text}", summary)
    );

    const tokens = Math.ceil(CalculateTokens.calculate(summary) * this.BOOST_RATIO);
    const promptTokens = CalculateTokens.calculate(prompt);
    const promptTokensLimit = this.MODEL_MAX_TOKENS - promptTokens;
    const maxTokens = tokens > promptTokensLimit ? promptTokensLimit : tokens;

    const article = await this.openAIGateway.call(prompt, { maxTokens, temperature: 0.8 });

    return { article };
  }
}
