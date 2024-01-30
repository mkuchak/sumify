import { VideoData, YouTubeGateway } from "@/contract/gateway/YouTubeGateway";
import { fetchTranscript } from "youtube-fetch-transcript";

export class YouTubeGatewayClient implements YouTubeGateway {
  static async getVideo(videoId: string): Promise<VideoData> {
    const videoTranscript = await fetchTranscript(videoId);
    const videoData = (await (
      await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
      )
    ).json()) as any;

    return {
      title: videoData.title,
      thumbnail: videoData.thumbnail_url.replace("hqdefault", "maxresdefault"),
      url: `https://www.youtube.com/watch?v=${videoId}`,
      dialogs: videoTranscript,
    };
  }
}
