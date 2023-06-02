import { VideoData, YouTubeGateway } from "@/contract/gateway/YouTubeGateway";
import Api from "youtube-browser-api";

interface VideoBrowserData {
  videoDetails: {
    title: string;
    shortDescription: string;
  };
  thumbnails: Array<{
    url: string;
    height: number;
    width: number;
  } | null>;
  formats: Array<{
    url: string;
  }>;
}

export class YouTubeGatewayClient implements YouTubeGateway {
  static async getVideo(videoId: string): Promise<VideoData> {
    const { videoId: dialogs } = await Api.transcript({ videoId });
    const info = (await Api.query({
      id: videoId,
      schema: {
        playerResponse: {
          videoDetails: {
            title: true,
            thumbnail: {
              thumbnails: {
                4: {
                  url: true,
                  height: true,
                  width: true,
                },
              },
            },
          },
        },
      },
      paths: "playerResponse.streamingData.formats.0.url",
    })) as unknown as VideoBrowserData;

    return {
      title: info?.videoDetails?.title,
      thumbnail: info?.thumbnails?.[4]?.url,
      url: info?.formats?.[0]?.url,
      dialogs: dialogs || [],
    };
  }
}
