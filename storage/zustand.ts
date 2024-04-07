import { MMKVLoader } from "react-native-mmkv-storage";
import superJson from "superjson";
import { PersistStorage } from "zustand/middleware";

export const zustandStorage = new MMKVLoader().withInstanceID("storage-zustand").initialize();

export function createStorage<T>() {
    const storage: PersistStorage<T> = {
        getItem: name => {
            const str = zustandStorage.getString(name);
            if (!str) return null;
            return superJson.parse(str);
        },
        setItem: (name, value) => {
            zustandStorage.setString(name, superJson.stringify(value));
        },
        removeItem: name => {
            zustandStorage.removeItem(name);
        },
    };
    return storage;
}
