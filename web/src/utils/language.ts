export const getBrowserLanguage = () => {
  if (typeof window === "undefined") return;

  if (navigator.languages != undefined) {
    return navigator.languages[0];
  }

  return navigator.language;
};

export const getLanguageName = (languageCode = "en-US") => {
  return new Intl.DisplayNames(["en"], {
    type: "language",
  }).of(languageCode);
};

export const getLanguage = (languageCode = "en-US") => {
  const [language] = languageCode.split("-");

  return getLanguageName(language);
};

export const getCountry = (languageCode = "en-US") => {
  const [, country] = languageCode.split("-");

  return country.toLowerCase();
};

export const getLanguageAndCountryName = (languageCode: string) => {
  const language = getLanguage(languageCode);
  const country = getCountry(languageCode)?.toUpperCase();

  return `${language} (${country})`;
};
