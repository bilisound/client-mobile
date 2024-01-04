import { persist } from "zustand/middleware";
import { create } from "zustand";
import { createStorage } from "../utils/store";

export interface SettingsProps {
    useLegacyID: boolean;
    filterResourceURL: boolean;
    debugMode: boolean;
}

export interface SettingsMethods {
    update: <K extends keyof SettingsProps>(key: K, value: SettingsProps[K]) => void;
    toggle: <K extends keyof SettingsProps>(key: K) => boolean;
}

const initialState: SettingsProps = {
    useLegacyID: false,
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
            toggle: (key) => {
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
