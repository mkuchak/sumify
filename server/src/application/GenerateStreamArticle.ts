import { OpenAIStreamGateway } from "@/contract/gateway/OpenAIStreamGateway";
import { Prompt } from "@/domain/entity/Prompt";
import { CalculateTokens } from "@/domain/service/CalculateTokens";
import { CalculateWords } from "@/domain/service/CalculateWords";
import { LanguageName } from "@/domain/service/LanguageName";

export interface GenerateStreamArticleInput {
  title: string;
  timedSummaries: {
    text: string;
    start: number;
    end: number;
    startFormatted?: string;
    endFormatted?: string;
  }[];
  joinedSummaries: string;
  language?: string; // on browser: navigator.language
}

export interface GenerateStreamArticleOutput {
  stream: ReadableStream<Uint8Array>;
}

export class GenerateStreamArticle {
  MODEL_MAX_TOKENS = 4096; // gpt-3.5-turbo
  TOKENS_BOOST_RATIO = 1.75; // percentage of more tokens for not finishing a half-completion (e.g. 1.75 is 75% more)

  constructor(private readonly openAIStreamGateway: OpenAIStreamGateway) {}

  async execute(input: GenerateStreamArticleInput): Promise<GenerateStreamArticleOutput> {
    const { title, timedSummaries, joinedSummaries, language: selectedLanguage = "pt-BR" } = input;

    const words = String(CalculateWords.calculateFromText(joinedSummaries));
    const language = LanguageName.fromCode(selectedLanguage);

    // const promptMask = `Write a concise and impersonal professional blog post of no more than {words} words based on the following content. Do not write in first person. Do not cite any author, speaker or participant. Create titles, subtitles, paragraphs and bullets by formatting the result in Markdown (.MD). The result must be in the {language} language: "{text}"`;
    // const prompt = new Prompt(
    //   promptMask.replace("{words}", words).replace("{language}", language).replace("{text}", joinedSummaries),
    //   "gpt-3.5-turbo"
    // );
    const prompt = new Prompt(
      // [
      //   {
      //     role: "system",
      //     content:
      //       `Write a concise and professional blog post of no more than {words} words based on this content.`.replace(
      //         "{words}",
      //         words
      //       ),
      //   },
      //   { role: "system", content: `Use the content and write from scratch, as if you were the author yourself.` },
      //   {
      //     role: "system",
      //     content: `Create a mandatory title, subtitles, paragraphs and lists or bullets by formatting in Markdown (.MD).`,
      //   },
      //   {
      //     role: "system",
      //     content: `The result must be obligatorily in the "{language}" language.`.replace("{language}", language),
      //   },
      //   { role: "user", content: joinedSummaries },
      // ],
      [
        // {
        //   role: "system",
        //   content:
        //     `Write a concise and professional blog post required in Argentina Spanish!!!! language!!! REALLY MUST BE IN ARGENTINA SPANISH!! with a maximum of {words} words based on this content. Use the content and write from scratch, as if you were the author yourself. Create a mandatory title, subtitles, paragraphs and bullets by formatting the result in Markdown (.MD).`
        //       .replace("{words}", words)
        //       .replace("{language}", language),
        // },
        // {
        //   role: "system",
        //   content: `Translate the text to {language}.`.replace("{language}", language),
        //   // content: `You only know how to write in {language} language.`.replace("{language}", language),
        // },
        // --------------------------------------------
        // {
        //   role: "system",
        //   content:
        //     `Write a professional blog post with a maximum of {words} words. Write from scratch as if you were the author. Format in Markdown (.MD) with a mandatory title, subtitles and paragraphs. The result must be the {language} of {country}.`
        //       .replace("{words}", words)
        //       .replace("{language}", "Spanish")
        //       .replace("{country}", "Argentina"),
        // },
        {
          role: "system",
          content:
            `Write a blog post in {language} language with a maximum of {words} words, from scratch as if you were the author. Write a headline, a teaser, subtitles and paragraphs. Format everything in Markdown.`
              .replace("{words}", words)
              .replace("{language}", language),
        },
        { role: "user", content: joinedSummaries },
        {
          role: "system",
          content: `Don't forget that the blog post need to be in {language} language.`.replace("{language}", language),
        },
        {
          role: "system",
          content: `Don't forget to format everything in Markdown without images and links.`,
        },
        {
          role: "system",
          content: `Don't forget to have of up to {words} words.`.replace("{words}", words),
        },
      ],
      "gpt-3.5-turbo"
    );

    const tokens = Math.ceil(CalculateTokens.calculate(joinedSummaries) * this.TOKENS_BOOST_RATIO);
    const promptTokens = CalculateTokens.calculate(prompt);
    const promptTokensLimit = this.MODEL_MAX_TOKENS - promptTokens;
    const maxTokens = tokens > promptTokensLimit ? promptTokensLimit : tokens;

    // const stream = await this.openAIStreamGateway.call(prompt, { maxTokens, temperature: 0.8 });
    const stream = await this.openAIStreamGateway.call(prompt, { temperature: 0.4 });

    return { stream };
  }
}
