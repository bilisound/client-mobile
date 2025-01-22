import { create } from "zustand";
import { setSpeed } from "@bilisound/player";

interface PlaybackSpeedState {
    speedValue: number;
    retainPitch: boolean;
    setSpeedValue: (value: number) => void;
    setRetainPitch: (value: boolean) => void;
    applySpeed: (value: number, retainPitch: boolean) => void;
}

export const usePlaybackSpeedStore = create<PlaybackSpeedState>((set, get) => ({
    speedValue: 1,
    retainPitch: false,
    setSpeedValue: (value: number) => set({ speedValue: value }),
    setRetainPitch: (value: boolean) => set({ retainPitch: value }),
    applySpeed: (value: number, retainPitch: boolean) => {
        set({ speedValue: value, retainPitch });
        setSpeed(value, retainPitch);
    },
}));
