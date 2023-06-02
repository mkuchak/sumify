import { sumifyApi } from "@/services/sumifyApi";
import { useQuery } from "@tanstack/react-query";

const fetchSummary = async (videoId: string, language: string) => {
  const { data } = await sumifyApi.post("v1/generate-summary", {
    videoId,
    language,
  });

  return data;
};

export const useGetSummary = (videoId: string, language: string) => {
  const summary = useQuery({
    queryKey: ["summary", videoId, language],
    queryFn: async () => {
      if (videoId.length !== 11) {
        return Promise.reject("Invalid video ID");
      }
      const data = await fetchSummary(videoId, language);

      return data.summary;
    },
    cacheTime: Infinity,
    staleTime: Infinity,
  });

  return summary;
};
