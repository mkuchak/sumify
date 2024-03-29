import { OpenAIGateway } from "@/contract/gateway/OpenAIGateway";
import { YouTubeGateway } from "@/contract/gateway/YouTubeGateway";
import { Prompt } from "@/domain/entity/Prompt";
import { Video } from "@/domain/entity/Video";
import { CalculateWords } from "@/domain/service/CalculateWords";
import { LanguageName } from "@/domain/service/LanguageName";
import pRetry from "p-retry";

export interface GenerateSummaryInput {
  videoId: string;
  language?: string;
}

export interface GenerateSummaryOutput {
  summary: {
    title: string;
    text: string;
    start: number;
    end: number;
    startFormatted?: string;
    endFormatted?: string;
  }[];
}

export class GenerateSummary {
  WORDS_DECREASE_RATIO = 0.6; // percentage of less words for each segment (e.g. 0.6 is 60% less)
  SEGMENT_TIME_IN_SECONDS = 300; // 5 minutes

  constructor(private readonly youTubeGateway: YouTubeGateway, private readonly openAIGateway: OpenAIGateway) {}

  async execute(input: GenerateSummaryInput): Promise<GenerateSummaryOutput> {
    const { videoId, language = "pt-BR" } = input;

    const languageName = LanguageName.fromCode(language);

    const youTubeData = await this.youTubeGateway.getVideo(videoId);
    const video = new Video(youTubeData);
    video.segmentByTime(this.SEGMENT_TIME_IN_SECONDS);

    let promises: Promise<string>[] = [];
    let response: string[] = [];

    if (video.segments.length) {
      promises = video.segments.map((segment) => {
        const retries = 3;
        const minTimeout = 30000;
        const words = String(Math.ceil(CalculateWords.calculateFromText(segment.text) * this.WORDS_DECREASE_RATIO));
        const prompt = new Prompt(
          [
            {
              role: "system",
              content: `This is an excerpt from a transcribed YouTube video. Write a concise summary with title of up to {words} words of this section in the {language} language.`,
            },
            {
              role: "user",
              content: `Video context: {context}. Excerpt: {text}.`,
            },
            {
              role: "system",
              content: `Deliver the response in JSON format following this example:
              {
                "title": "The title of the excerpt in {language} language",
                "summary": "The summary of the excerpt in {language} language"
              }`,
            },
            {
              role: "system",
              content: `Don't name presenters or commentators if you are not sure who spoke. Don't make up information. Don't talk about ads, promotions, or like and subscribe requests. Don't use video context in the title.`,
            },
            {
              role: "system",
              content: `Don't forget that the summary need to be in {language} language.`,
            },
          ],
          "gpt-3.5-turbo-1106"
        );
        prompt.replaceKeys({
          "{words}": words,
          "{language}": languageName,
          "{context}": video.title,
          "{text}": segment.text,
        });

        const promise = this.openAIGateway.call(prompt, { temperature: 0.4 });

        return pRetry(() => promise, { retries, minTimeout });
      });
      response = await Promise.all(promises);
    }

    const summary = video.segments.map((segment, index) => {
      const { title, summary } = JSON.parse(response[index]);
      const { start, end, startFormatted, endFormatted } = segment;

      return {
        title: title || video.title,
        text: summary || video.transcript,
        start,
        end,
        startFormatted,
        endFormatted,
      };
    });

    return { summary };
  }
}
