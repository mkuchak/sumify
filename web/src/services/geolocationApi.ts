import axios from "axios";

export const geolocationApi = axios.create({
  baseURL: import.meta.env.VITE_GEOLOCATION_API_URL,
});
