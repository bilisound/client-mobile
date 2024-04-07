import { MMKVLoader } from "react-native-mmkv-storage";

export const playlistStorage = new MMKVLoader().withInstanceID("storage-playlist").initialize();
