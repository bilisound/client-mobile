import { create } from "zustand";

import { PlaylistDetailRow } from "../storage/playlist";

export interface AddPlaylistProps {
    playlistDetail: PlaylistDetailRow[] | null;
    name: string;
}

export interface AddPlaylistMethods {
    setPlaylistDetail: (playlistDetail: AddPlaylistProps["playlistDetail"]) => void;
    setName: (name: string) => void;
}

const useAddPlaylistStore = create<AddPlaylistProps & AddPlaylistMethods>()(setState => ({
    playlistDetail: [],
    setPlaylistDetail: playlistDetail => setState(() => ({ playlistDetail })),
    name: "",
    setName: name => setState(() => ({ name })),
}));

export default useAddPlaylistStore;
