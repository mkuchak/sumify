import { OpenAIGateway } from "@/contract/gateway/OpenAIGateway";
import { YouTubeGateway } from "@/contract/gateway/YouTubeGateway";
import { Prompt } from "@/domain/entity/Prompt";
import { Video } from "@/domain/entity/Video";
import { CalculateWords } from "@/domain/service/CalculateWords";
import { LanguageName } from "@/domain/service/LanguageName";

export interface GenerateSummariesInput {
  videoId: string;
  language?: string; // on browser: navigator.language
}

export interface GenerateSummariesOutput {
  title: string;
  timedSummaries?: {
    text: string;
    start: number;
    end: number;
    startFormatted?: string;
    endFormatted?: string;
  }[];
  joinedSummaries?: string;
  price?: string;
  fullPrice?: string;
}

export class GenerateSummaries {
  MODEL_MAX_TOKENS = 4096; // gpt-3.5-turbo
  TOKENS_DECREASE_RATIO = 0.85; // percentage of less tokens for each segment (e.g. 0.9 is 10% less)
  WORDS_DECREASE_RATIO = 0.55; // percentage of less words for each segment (e.g. 0.5 is 50% less)

  constructor(private readonly youTubeGateway: YouTubeGateway, private readonly openAIGateway: OpenAIGateway) {}

  async execute(input: GenerateSummariesInput): Promise<GenerateSummariesOutput> {
    const { videoId, language = "pt-BR" } = input;

    const youTubeData = await this.youTubeGateway.getVideo(videoId);
    const video = new Video(youTubeData);
    video.segmentByTime(300); // 5 minutes

    const maxTokens = Math.ceil((this.MODEL_MAX_TOKENS * this.TOKENS_DECREASE_RATIO) / 2 / video.segments.length);
    const words = String(Math.ceil(CalculateWords.calculateFromTokens(maxTokens) * this.WORDS_DECREASE_RATIO));
    const languageName = LanguageName.fromCode(language);
    // const promptMask = `Write a concise portrait of at least {words} words of this excerpt in the {language} language: "{text}"`;

    let promises: Promise<string>[] = [];
    let summaries: string[] = [];

    if (video.segments.length > 1) {
      promises = video.segments.map((segment) => {
        const prompt = new Prompt(
          // promptMask.replace("{words}", words).replace("{language}", language).replace("{text}", segment.text),
          [
            {
              role: "system",
              content:
                `This is an excerpt from a transcribed YouTube video. Write a concise summary with title of up to {words} words of this section in the {language} language. Deliver the response in JSON format following this example:
                {
                  "title": "The title of the excerpt in {language} language",
                  "summary": "The summary of the excerpt in {language} language"
                }
                `
                  .replace("{words}", words)
                  .replace("{language}", languageName),
            },
            {
              role: "user",
              content: `Video context: ${video.title}. Excerpt: ${segment.text}.`,
            },
            {
              role: "system",
              content: `Don't forget that the summary need to be in {language} language.`.replace(
                "{language}",
                languageName
              ),
              // content: `Ensure that the summary is in {language} language.`.replace("{language}", languageName),
            },
          ],
          "gpt-3.5-turbo"
        );
        // return this.openAIGateway.call(prompt, { maxTokens, temperature: 0.4 });
        return this.openAIGateway.call(prompt, { temperature: 0.4 });
      });
      summaries = await Promise.all(promises);
    }

    const timedSummaries = video.segments.map((segment, index) => {
      const { title, summary } = JSON.parse(summaries[index]);
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

    let joinedSummaries = `[${video.title}]: `;
    timedSummaries.forEach((segment) => (joinedSummaries += `${segment.text} `));

    return {
      title: video.title,
      timedSummaries,
      joinedSummaries,
    };
  }
}
