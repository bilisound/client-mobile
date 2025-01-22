import { setSpeed } from "@bilisound/player";
import { createWithEqualityFn } from "zustand/traditional";

interface PlaybackSpeedState {
    speedValue: number;
    retainPitch: boolean;
    setSpeedValue: (value: number) => void;
    setRetainPitch: (value: boolean) => void;
    applySpeed: (value: number, retainPitch: boolean) => void;
}

export const usePlaybackSpeedStore = createWithEqualityFn<PlaybackSpeedState>((set, get) => ({
    speedValue: 1,
    retainPitch: false,
    setSpeedValue: (value: number) => set(() => ({ speedValue: value })),
    setRetainPitch: (value: boolean) => set(() => ({ retainPitch: value })),
    applySpeed: (value: number, retainPitch: boolean) => {
        const got = get();
        if (got.speedValue === value && got.retainPitch === retainPitch) {
            // console.log("阻挡重复渲染");
            return;
        }
        set(() => ({ speedValue: value, retainPitch }));
        setSpeed(value, retainPitch);
    },
}));
