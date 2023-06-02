import { useGetSummary } from "@/hooks/useGetSummary";
import { useGetVideo } from "@/hooks/useGetVideo";
import { useSplat } from "@/hooks/useSplat";
import { Item } from "@/pages/Video/components/Item";
import { Timeline } from "@/pages/Video/components/Timeline";
import { settingsAtom } from "@/stores/settings";
import { getYouTubeId, isYouTubeUrl } from "@/utils/youtube";
import { useAtom } from "jotai";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useNavigate } from "react-router-dom";

export function Video() {
  const navigate = useNavigate();
  const videoId = useSplat();
  const player = useRef<ReactPlayer>();
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const [settings, setSettings] = useAtom(settingsAtom);
  const { data: video, error: videoError } = useGetVideo(videoId);
  const { data: summary, error: summaryError } = useGetSummary(videoId, settings.chosenLanguage);

  useLayoutEffect(() => {
    window.scroll({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isYouTubeUrl(videoId)) {
      return navigate(`/${getYouTubeId(videoId)}`);
    }
    if (videoError || summaryError) {
      return navigate("/404");
    }
  }, [videoId, navigate, videoError, summaryError]);

  const handleProgress = ({ playedSeconds }: { playedSeconds: number }) => {
    const instance = player.current?.getInternalPlayer();
    setSettings({
      ...settings,
      isMuted: instance.isMuted(),
      playbackRate: instance.getPlaybackRate(),
    });
    setCurrentSeconds(playedSeconds);
  };

  const handleSeekTo = (seconds: number) => {
    setCurrentSeconds(seconds);
    player.current?.seekTo(seconds);
  };

  return (
    <main className="flex-auto w-full min-w-0 lg:static lg:max-h-full lg:overflow-visible">
      <section
        className="bg-white dark:bg-gray-900 bg-cover relative"
        style={{
          backgroundImage: `url(${video?.thumbnail})`,
        }}
      >
        <div className="py-8 px-4 md:px-12 lg:px-16 mx-auto max-w-screen-xl lg:py-16 grid lg:grid-cols-2 gap-8 lg:gap-16 relative z-10">
          <div className="flex flex-col text-start lg:text-end justify-end ">
            <h1 className="mt-4 text-xl font-extrabold tracking-tight leading-tight text-gray-900 md:text-2xl lg:text-3xl dark:text-white">
              {video?.title}
            </h1>
          </div>
          <div className="relative pt-[56.25%] mx-auto w-full lg:max-w-xl h-64 rounded-xl overflow-hidden sm:h-96 shadow-xl">
            <ReactPlayer
              id="player"
              ref={player}
              className="absolute top-0 left-0"
              url={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`}
              playing={true}
              controls={true}
              muted={settings.isMuted}
              playbackRate={settings.playbackRate}
              onProgress={handleProgress}
              width="100%"
              height="100%"
            />
          </div>
        </div>
        <div className="bg-gradient-to-t from-blue-50 from-0% to-transparent dark:from-slate-950 w-full h-full absolute top-0 left-0 z-0"></div>
        <div className="bg-gradient-to-b from-blue-50 to-transparent to-50% lg:to-30% dark:from-slate-900 w-full h-full absolute top-0 left-0 z-0"></div>
      </section>

      <section className="bg-white dark:bg-slate-950">
        <div className="sm:hidden pt-1 mx-2">
          <label htmlFor="tabs" className="sr-only">
            Select your country
          </label>
          <select
            id="tabs"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option>Timeline Summary</option>
            <option disabled>Blog Post</option>
            <option disabled>Twitter Thread</option>
            <option disabled>Journalistic Article</option>
          </select>
        </div>

        <div className="pt-4 px-4 sm:pb-6 lg:pb-0">
          <ul className="hidden max-w-screen-xl mx-auto text-sm font-medium text-center text-gray-500 divide-x divide-gray-200 rounded-lg shadow sm:flex dark:divide-gray-700 dark:text-gray-400">
            <li className="w-full">
              <a
                href="#"
                className="whitespace-nowrap inline-block w-full p-4 text-gray-900 bg-gray-100 rounded-l-lg active focus:outline-none dark:bg-gray-700 dark:text-white"
                aria-current="page"
              >
                Timeline Summary
              </a>
            </li>
            <li className="w-full">
              <a
                href="#"
                // className="whitespace-nowrap inline-block w-full p-4 bg-white hover:text-gray-700 hover:bg-gray-50 focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                className="whitespace-nowrap inline-block w-full p-4 bg-white dark:bg-gray-800 cursor-not-allowed"
              >
                Blog Post
              </a>
            </li>
            <li className="w-full">
              <a
                href="#"
                className="whitespace-nowrap inline-block w-full p-4 bg-white dark:bg-gray-800 cursor-not-allowed"
              >
                Twitter Thread
              </a>
            </li>
            <li className="w-full">
              <a
                href="#"
                className="whitespace-nowrap inline-block w-full p-4 bg-white rounded-r-lg dark:bg-gray-800 cursor-not-allowed"
              >
                Journalistic Article
              </a>
            </li>
          </ul>
        </div>

        <Timeline isLoading={!summary?.length}>
          {summary?.map(
            ({
              title,
              text,
              start,
              startFormatted,
              end,
            }: {
              start: number;
              end: number;
              startFormatted: string;
              title: string;
              text: string;
            }) => (
              <Item
                key={start}
                isCurrent={currentSeconds >= Math.ceil(start / 1000) && currentSeconds < Math.ceil(end / 1000)}
                seekTo={() => handleSeekTo(Math.ceil(start / 1000))}
                time={startFormatted}
                title={title}
                text={text}
              />
            )
          )}
        </Timeline>
      </section>
    </main>
  );
}
