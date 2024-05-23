import { create } from "zustand";
import { persist } from "zustand/middleware";

import { createStorage } from "~/storage/zustand";

export interface SettingsProps {
    useLegacyID: boolean;
    downloadNextTrack: boolean;
    filterResourceURL: boolean;
    debugMode: boolean;
}

export interface SettingsMethods {
    update: <K extends keyof SettingsProps>(key: K, value: SettingsProps[K]) => void;
    toggle: <K extends keyof SettingsProps>(key: K) => boolean;
}

const initialState: SettingsProps = {
    useLegacyID: false,
    downloadNextTrack: true,
    filterResourceURL: true,
    debugMode: false,
};

const useSettingsStore = create<SettingsProps & SettingsMethods>()(
    persist(
        (set, get) => ({
            ...initialState,
            update: (key, value) => {
                set(() => ({ [key]: value }));
            },
            toggle: key => {
                const old = get()[key];
                if (typeof old !== "boolean") {
                    throw new Error("要切换开关状态的值类型必须是布尔值");
                }
                set(() => ({ [key]: !old }));
                return !old;
            },
        }),
        {
            name: "settings-store",
            storage: createStorage<SettingsProps>(),
        },
    ),
);

export default useSettingsStore;
