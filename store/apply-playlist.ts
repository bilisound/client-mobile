import { create } from "zustand";

import { PlaylistDetailRow } from "~/storage/playlist";

export interface ApplyPlaylistProps {
    playlistDetail: PlaylistDetailRow[] | null;
    name: string;
}

export interface ApplyPlaylistMethods {
    setPlaylistDetail: (playlistDetail: ApplyPlaylistProps["playlistDetail"]) => void;
    setName: (name: string) => void;
}

const useApplyPlaylistStore = create<ApplyPlaylistProps & ApplyPlaylistMethods>()(setState => ({
    playlistDetail: [],
    setPlaylistDetail: playlistDetail => setState(() => ({ playlistDetail })),
    name: "",
    setName: name => setState(() => ({ name })),
}));

export default useApplyPlaylistStore;
