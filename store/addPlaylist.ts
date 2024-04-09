import { create } from "zustand";

import { PlaylistDetailRow } from "../storage/playlist";

export interface AddPlaylistProps {
    playlistDetail: PlaylistDetailRow[] | null;
}

export interface AddPlaylistMethods {
    setPlaylistDetail: (playlistDetail: AddPlaylistProps["playlistDetail"]) => void;
}

const useAddPlaylistStore = create<AddPlaylistProps & AddPlaylistMethods>()(setState => ({
    playlistDetail: [],
    setPlaylistDetail: playlistDetail => setState(() => ({ playlistDetail })),
}));

export default useAddPlaylistStore;
