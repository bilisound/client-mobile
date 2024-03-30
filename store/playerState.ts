import {create} from "zustand";

export interface PlayingInformation {
    id: string;
    episode: number;
    title: string;
    artist: string;
    artwork: string;
    duration: number;
}

export interface PlayerStateStoreProps {
    playingNow: PlayingInformation | null;
    playingRequest: PlayingInformation | null;
}

export interface PlayerStateStoreMethods {
    setPlayingNow: (playingNow: PlayingInformation) => void;
    setPlayingRequest: (playingRequest: PlayingInformation | null) => void;
}

const usePlayerStateStore = create<PlayerStateStoreProps & PlayerStateStoreMethods>()(
    (set, get) => ({
        playingRequest: null,
        setPlayingRequest: (playingRequest) => set(() => ({ playingRequest })),
        playingNow: null,
        setPlayingNow: (playingNow) => set(() => ({ playingNow })),
    }),
);

export default usePlayerStateStore;
