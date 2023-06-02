import { youtubeApi } from "@/services/youtubeApi";
import { useQuery } from "@tanstack/react-query";

const fetchVideo = async (videoId: string) => {
  const { data } = await youtubeApi.get("oembed", {
    params: {
      url: `https://www.youtube.com/watch?v=${videoId}`,
      format: "json",
    },
  });

  return {
    title: data.title,
    thumbnail: data.thumbnail_url.replace("hqdefault", "maxresdefault"),
  };
};

export const useGetVideo = (videoId: string) => {
  const video = useQuery({
    queryKey: ["video", videoId],
    queryFn: async () => {
      if (videoId.length !== 11) {
        return Promise.reject("Invalid video ID");
      }
      const data = await fetchVideo(videoId);
      if (!data.title) {
        return Promise.reject("Invalid video ID");
      }

      return data;
    },
    cacheTime: Infinity,
    staleTime: Infinity,
  });

  return video;
};
