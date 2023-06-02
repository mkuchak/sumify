import getVideoId from "get-video-id";

export const isYouTubeUrl = (url: string): boolean => {
  const { id, service } = getVideoId(url);
  const isLive = url.includes("youtube.com/live");
  let isUrl: boolean;
  let liveId: string | undefined;

  try {
    new URL(url);
    isUrl = true;
  } catch {
    isUrl = false;
  }

  if (isLive) {
    liveId = url.split("/live/")[1].split("?")[0];
  }

  const isYoutubeService = service === "youtube";
  const isValidId = id && id.length === 11;
  const isValidLiveId = liveId && liveId.length === 11;

  return isUrl && ((isYoutubeService && isValidId) || isValidLiveId);
};

export const getYouTubeId = (url: string): string => {
  const { id } = getVideoId(url);
  const isLive = url.includes("youtube.com/live");
  let liveId: string | undefined;

  if (isLive) {
    liveId = url.split("/live/")[1].split("?")[0];
    return liveId;
  }

  return id;
};
