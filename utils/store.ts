import { PersistStorage } from "zustand/middleware";
import superJson from "superjson";
import { MMKVLoader } from "react-native-mmkv-storage";

const MMKV = new MMKVLoader().withInstanceID("storage-zustand").initialize();

export function createStorage<T>() {
    const storage: PersistStorage<T> = {
        getItem: (name) => {
            const str = MMKV.getString(name);
            if (!str) return null;
            return superJson.parse(str);
        },
        setItem: (name, value) => {
            MMKV.setString(name, superJson.stringify(value));
        },
        removeItem: (name) => {
            MMKV.removeItem(name);
        },
    };
    return storage;
}
