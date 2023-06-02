export class LanguageName {
  static fromCode(code: string): string {
    return new Intl.DisplayNames(["en"], {
      type: "language",
    }).of(code);
  }
}
