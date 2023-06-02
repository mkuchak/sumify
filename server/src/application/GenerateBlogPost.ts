import { OpenAIStreamGateway } from "@/contract/gateway/OpenAIStreamGateway";
import { Prompt } from "@/domain/entity/Prompt";
import { LanguageName } from "@/domain/service/LanguageName";

export interface GenerateBlogPostInput {
  title: string;
  summary: {
    title: string;
    text: string;
    start: number;
    end: number;
    startFormatted?: string;
    endFormatted?: string;
  }[];
  language?: string;
}

export interface GenerateBlogPostOutput {
  stream: ReadableStream<Uint8Array>;
}

export class GenerateBlogPost {
  MAX_WORDS = 1000;

  constructor(private readonly openAIStreamGateway: OpenAIStreamGateway) {}

  async execute(input: GenerateBlogPostInput): Promise<GenerateBlogPostOutput> {
    const { title, summary, language = "pt-BR" } = input;

    const languageName = LanguageName.fromCode(language);

    const text = summary
      .map((segment) => segment.text)
      .join(" ")
      .trim();

    const prompt = new Prompt(
      [
        {
          role: "system",
          content: `Write a blog post in {language} language with a maximum of {words} words, from scratch as if you were the author. Write a headline, a teaser, subtitles and paragraphs. Format everything in Markdown.`,
        },
        {
          role: "user",
          content: `Blog post context: {context}. Text: {text}.`,
        },
        {
          role: "system",
          content: `Don't forget that the blog post need to be in {language} language.`,
        },
        {
          role: "system",
          content: `Don't forget to format everything in Markdown without images and links.`,
        },
        {
          role: "system",
          content: `Don't forget to have of up to {words} words.`,
        },
      ],
      "gpt-3.5-turbo"
    );

    prompt.replaceKeys({
      "{words}": String(this.MAX_WORDS),
      "{language}": languageName,
      "{context}": title,
      "{text}": text,
    });

    const stream = await this.openAIStreamGateway.call(prompt, { temperature: 0.4 });

    return { stream };
  }
}
