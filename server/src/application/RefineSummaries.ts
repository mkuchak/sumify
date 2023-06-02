import { OpenAIGateway } from "@/contract/gateway/OpenAIGateway";
import { YouTubeGateway } from "@/contract/gateway/YouTubeGateway";
import { Prompt } from "@/domain/entity/Prompt";
import { Video } from "@/domain/entity/Video";
import { CalculateWords } from "@/domain/service/CalculateWords";
import { ExtractVideoId } from "@/domain/service/ExtractVideoId";
import { LanguageName } from "@/domain/service/LanguageName";
import { SegmentByWords } from "@/domain/service/SegmentByWords";

export interface RefineSummariesInput {
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

export interface RefineSummariesOutput {
  title: string;
  timedSummaries?: {
    text: string;
    start: number;
    end: number;
    startFormatted?: string;
    endFormatted?: string;
  }[];
  joinedSummaries?: string;
  refinedSummaries?: string[];
  joinedRefinedSummaries?: string;
}

export class RefineSummaries {
  MODEL_MAX_TOKENS = 4096; // gpt-3.5-turbo
  REFINEMENT_MAX_WORDS = 1000;
  REFINEMENT_OVERLAP_WORDS = 50;

  constructor(private readonly openAIGateway: OpenAIGateway) {}

  async execute(input: RefineSummariesInput): Promise<RefineSummariesOutput> {
    const { title, timedSummaries, joinedSummaries, language: selectedLanguage = "pt-BR" } = input;

    const language = LanguageName.fromCode(selectedLanguage);
    const totalWords = CalculateWords.calculateFromText(joinedSummaries);
    console.log("totalWords", totalWords);
    const totalRefinements = Math.ceil(totalWords / this.REFINEMENT_MAX_WORDS);
    console.log("totalRefinements", totalRefinements);
    const words = Math.ceil(totalWords / totalRefinements);
    console.log("words", words);

    const promptMask = `Write a concise portrait of at least {words} words of this excerpt in the {language} language: "{text}"`;
    const summaries = SegmentByWords.split(
      joinedSummaries,
      words - this.REFINEMENT_OVERLAP_WORDS,
      this.REFINEMENT_OVERLAP_WORDS
    );
    console.log("summaries", JSON.stringify(summaries, null, 2));

    let promises: Promise<string>[] = [];
    let refinedSummaries: string[] = [];

    if (totalRefinements > 1) {
      promises = summaries.map((summary) => {
        const prompt = new Prompt(
          promptMask.replace("{words}", String(words)).replace("{language}", language).replace("{text}", summary)
        );

        return this.openAIGateway.call(prompt, { temperature: 0.8 });
      });

      refinedSummaries = await Promise.all(promises);
    }

    const joinedRefinedSummaries = refinedSummaries.join(" ");

    return {
      title,
      timedSummaries,
      joinedSummaries,
      refinedSummaries,
      joinedRefinedSummaries,
    };
  }
}
