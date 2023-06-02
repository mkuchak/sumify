export class CalculateWords {
  static calculateFromTokens(tokens: number): number {
    // return Math.ceil((tokens * 3000) / 4000);
    return Math.ceil(tokens / 2);
  }

  static calculateFromText(text: string): number {
    return text.split(" ").length;
  }
}
