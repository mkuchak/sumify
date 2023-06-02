import { settingsAtom } from "@/stores/settings";
import { getCountry, getLanguageAndCountryName } from "@/utils/language";
import clsx from "clsx";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

const DEFAULT_LANGUAGES = ["en-US", "es-ES", "fr-FR", "de-DE", "it-IT", "pt-BR", "ru-RU", "ja-JP", "zh-CN", "ar-SA"];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageSelectorOpen, setIsLanguageSelectorOpen] = useState(false);
  const [settings, setSettings] = useAtom(settingsAtom);

  const defaultLanguageName = getLanguageAndCountryName(settings?.defaultLanguage);
  const chosenLanguageName = getLanguageAndCountryName(settings?.chosenLanguage);

  useEffect(() => {
    const handleExternalClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("#sandwich-menu-button") && !target.closest("#language-menu-button")) {
        setIsMenuOpen(false);
        setIsLanguageSelectorOpen(false);
      }
    };

    document.addEventListener("click", handleExternalClick);

    return () => {
      document.removeEventListener("click", handleExternalClick);
    };
  }, []);

  const handleChangeLanguage = (language: string) => {
    setSettings({ ...settings, chosenLanguage: language });
    setIsLanguageSelectorOpen(false);
  };

  const handleToggleLanguageSelector = () => {
    setIsLanguageSelectorOpen(!isLanguageSelectorOpen);
  };

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-40 flex-none w-full mx-auto bg-white shadow-[-10px_-10px_30px_4px_rgba(0,0,0,0.05),_10px_10px_30px_4px_rgba(0,0,0,0.1)] dark:bg-gray-800">
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto py-4 px-2">
          <a href="/" className="flex items-center">
            <img src="/sumify.svg" className="h-8 mr-1.5" alt="Sumify Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Sumify</span>
          </a>
          <div className="flex items-center md:order-2">
            <button
              id="language-menu-button"
              onClick={handleToggleLanguageSelector}
              type="button"
              data-dropdown-toggle="language-dropdown-menu"
              className="inline-flex items-center font-medium justify-center px-4 py-2 text-sm text-gray-900 dark:text-white rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <img
                className="w-5 h-5 mr-2 rounded-full object-cover"
                src={`https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/${getCountry(
                  settings.chosenLanguage
                )}.svg`}
                width={20}
                height={20}
                alt="Country flag"
              />
              {chosenLanguageName}
            </button>
            <div
              id="language-menu-button"
              className={`absolute ${
                isLanguageSelectorOpen ? "block" : "hidden"
              } top-0 xl:right-auto right-2 z-50 px-2 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700`}
            >
              <ul className="py-2 font-medium" role="none">
                <li className={settings.chosenLanguage === settings.defaultLanguage ? "hidden" : ""}>
                  <button
                    onClick={() => handleChangeLanguage(settings.defaultLanguage)}
                    type="button"
                    className="flex flex-start w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                    role="menuitem"
                  >
                    <div className="inline-flex items-center whitespace-nowrap">
                      <img
                        className="w-5 h-5 mr-2 rounded-full object-cover"
                        src={`https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/${getCountry(
                          settings.defaultLanguage
                        )}.svg`}
                        width={20}
                        height={20}
                        alt="Country flag"
                      />
                      {defaultLanguageName}
                    </div>
                  </button>
                </li>
                {DEFAULT_LANGUAGES.map((language) => (
                  <li
                    key={language}
                    className={
                      settings.chosenLanguage === language || language === settings.defaultLanguage ? "hidden" : ""
                    }
                  >
                    <button
                      onClick={() => handleChangeLanguage(language)}
                      type="button"
                      className="flex flex-start w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                      role="menuitem"
                    >
                      <div className="inline-flex items-center whitespace-nowrap">
                        <img
                          className="w-5 h-5 mr-2 rounded-full object-cover"
                          src={`https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/${getCountry(
                            language
                          )}.svg`}
                          width={20}
                          height={20}
                          alt="Country flag"
                        />
                        {getLanguageAndCountryName(language)}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <button
              id="sandwich-menu-button"
              onClick={handleToggleMenu}
              type="button"
              className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="mobile-menu-language-select"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-6 h-6"
                fill="currentColor"
                aria-hidden="true"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
          <div
            className={clsx(
              "absolute top-16 left-0 px-2 md:relative md:top-auto md:left-auto md:px-0 items-center justify-between w-full md:flex md:w-auto md:order-1",
              isMenuOpen ? "block" : "hidden"
            )}
            id="mobile-menu-language-select"
          >
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <a
                  href="#"
                  className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                  aria-current="page"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
