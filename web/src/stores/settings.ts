import { geolocationApi } from "@/services/geolocationApi";
import { clearStorageKeys } from "@/utils/storage";
import { atomWithStorage } from "jotai/utils";

const SETTINGS_KEY = "settings-0.1.0";

interface Settings {
  theme: "dark" | "light";
  defaultLanguage: string;
  chosenLanguage: string;
  isMuted: boolean;
  playbackRate: number;
}

clearStorageKeys("settings", SETTINGS_KEY);

const fetchLanguage = async () => {
  const { data } = await geolocationApi.get("client-info");
  // console.log("geolocationApi:", data);
  return data.userLanguages[0];
};

const language = await fetchLanguage();

const initialState: Settings = {
  theme: "dark",
  defaultLanguage: language,
  chosenLanguage: language,
  isMuted: false,
  playbackRate: 1,
};

export const settingsAtom = atomWithStorage(SETTINGS_KEY, initialState);

// Fixing unnecessary API calls will be possible when #1958 lands: https://github.com/pmndrs/jotai/pull/1958
// const internalSettingsAtom = atomWithStorage(SETTINGS_KEY, {} as Settings);
// export const settingsAtom = atom(async (get) => get(internalSettingsAtom) || initialState);
