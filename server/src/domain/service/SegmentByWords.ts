export class SegmentByWords {
  static split(summary: string, words = 1000, overlapWords = 20): string[] {
    const summaryWords = summary.split(" ");
    const chunks: string[] = [];

    for (let i = 0; i < summaryWords.length; i += words - overlapWords) {
      const chunk = summaryWords.slice(i, i + words).join(" ");
      chunks.push(chunk);
    }

    return chunks;
  }
}
