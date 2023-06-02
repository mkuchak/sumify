import getVideoId from "get-video-id";

interface VideoId {
  id: string;
  service: string;
}

export class ExtractVideoId {
  static fromUrl(url: string): VideoId {
    return getVideoId(url);
  }
}
