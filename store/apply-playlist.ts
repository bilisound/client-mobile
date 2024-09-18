import { create } from "zustand";

import { PlaylistDetail } from "~/storage/sqlite/schema";

export interface ApplyPlaylistProps {
    playlistDetail: PlaylistDetail[] | null;
    name: string;
    description: string;
    source: string;
}

export interface ApplyPlaylistMethods {
    setPlaylistDetail: (playlistDetail: ApplyPlaylistProps["playlistDetail"]) => void;
    setName: (name: string) => void;
    setDescription: (description: string) => void;
    setSource: (source: string) => void;
}

const useApplyPlaylistStore = create<ApplyPlaylistProps & ApplyPlaylistMethods>()(setState => ({
    playlistDetail: [],
    setPlaylistDetail: playlistDetail => setState(() => ({ playlistDetail })),
    name: "",
    setName: name => setState(() => ({ name })),
    description: "",
    setDescription: description => setState(() => ({ description })),
    source: "",
    setSource: (source: string) => setState(() => ({ source })),
}));

export default useApplyPlaylistStore;
