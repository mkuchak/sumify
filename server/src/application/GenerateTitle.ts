import { OpenAIGateway } from "@/contract/gateway/OpenAIGateway";
import { Prompt } from "@/domain/entity/Prompt";
import { LanguageName } from "@/domain/service/LanguageName";

export interface GenerateTitleInput {
  title: string;
  language?: string; // on browser: navigator.language
}

export interface GenerateTitleOutput {
  title: string;
}

export class GenerateTitle {
  constructor(private readonly openAIGateway: OpenAIGateway) {}

  async execute(input: GenerateTitleInput): Promise<GenerateTitleOutput> {
    const { title, language = "pt-BR" } = input;

    const languageName = LanguageName.fromCode(language);
    const promptMask = `Recreate the title in a funny way in {language} language: "{title}"`;

    const prompt = new Prompt(promptMask.replace("{language}", languageName).replace("{title}", title));
    const newTitle = await this.openAIGateway.call(prompt, { temperature: 0.8 });

    return {
      title: newTitle,
    };
  }
}
