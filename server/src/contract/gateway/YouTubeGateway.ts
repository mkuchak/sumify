export interface Subtitle {
  text: string;
  duration: number;
  offset: number;
}

export interface VideoData {
  title?: string;
  thumbnail?: string;
  url?: string;
  dialogs: Subtitle[];
}

export interface YouTubeGateway {
  getVideo?(videoId: string): Promise<VideoData>;
}
