import { settingsAtom } from "@/stores/settings";
import { getLanguageName } from "@/utils/language";
import { getYouTubeId, isYouTubeUrl } from "@/utils/youtube";
import { useAtom } from "jotai";
import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

export function Home() {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [settings] = useAtom(settingsAtom);

  const handleClick = async () => {
    const clipboard = await navigator.clipboard.readText();
    if (!url && isYouTubeUrl(clipboard)) {
      setUrl(clipboard);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  const handleSubmit = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const videoId = getYouTubeId(url);
    navigate(`/${videoId}`);
  };

  return (
    <main className="flex-auto w-full min-w-0 lg:static lg:max-h-full lg:overflow-visible">
      <section className="bg-white dark:bg-gray-900 bg-[url('/bg-pattern.svg')] dark:bg-[url('/bg-pattern-dark.svg')] h-[calc(100vh-14.8rem)] sm:h-[calc(100vh-12.55rem)] md:h-[calc(100vh-14.55rem)] lg:h-[calc(100vh-15.55rem)]">
        <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 z-10 relative">
          <div className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-sm text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
            <span className="text-xs bg-blue-600 rounded-full text-white px-4 py-1.5 mr-3">New</span>{" "}
            <span className="text-sm font-medium">{getLanguageName(settings.defaultLanguage)} version available</span>
          </div>

          <h1 className="mb-4 text-4xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
            Summarize your favorite{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r to-blue-400 from-blue-600">YouTube</span>{" "}
            videos
          </h1>

          <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-200">
            Just paste the link of the video and we will summarize it for you
          </p>
          <form onSubmit={handleSubmit} className="relative w-full max-w-md mx-auto mb-8">
            <label
              htmlFor="default-youtube-link"
              className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
              Paste YouTube link
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M19.902 4.098a3.75 3.75 0 00-5.304 0l-4.5 4.5a3.75 3.75 0 001.035 6.037.75.75 0 01-.646 1.353 5.25 5.25 0 01-1.449-8.45l4.5-4.5a5.25 5.25 0 117.424 7.424l-1.757 1.757a.75.75 0 11-1.06-1.06l1.757-1.757a3.75 3.75 0 000-5.304zm-7.389 4.267a.75.75 0 011-.353 5.25 5.25 0 011.449 8.45l-4.5 4.5a5.25 5.25 0 11-7.424-7.424l1.757-1.757a.75.75 0 111.06 1.06l-1.757 1.757a3.75 3.75 0 105.304 5.304l4.5-4.5a3.75 3.75 0 00-1.035-6.037.75.75 0 01-.354-1z"
                  />
                </svg>
              </div>
              <input
                type="youtube"
                className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Paste a YouTube link"
                value={url}
                onChange={handleChange}
                onClick={handleClick}
                required
              />
              <button
                type="submit"
                className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Go!
              </button>
            </div>
          </form>
        </div>
        <div className="bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900 w-full h-full absolute top-0 left-0 z-0"></div>
      </section>
    </main>
  );
}
