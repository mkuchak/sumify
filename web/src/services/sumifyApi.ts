import axios from "axios";

export const sumifyApi = axios.create({
  baseURL: import.meta.env.VITE_SUMIFY_API_URL,
});
