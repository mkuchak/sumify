import axios from "axios";

export const youtubeApi = axios.create({
  baseURL: import.meta.env.VITE_YOUTUBE_API_URL,
});
