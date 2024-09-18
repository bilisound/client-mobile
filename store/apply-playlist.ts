import { create } from "zustand";

import { PlaylistDetail } from "~/storage/sqlite/schema";
import { PlaylistSource } from "~/typings/playlist";

export interface ApplyPlaylistProps {
    playlistDetail: PlaylistDetail[] | null;
    name: string;
    description: string;
    source?: PlaylistSource;
}

export interface ApplyPlaylistMethods {
    setPlaylistDetail: (playlistDetail: ApplyPlaylistProps["playlistDetail"]) => void;
    setName: (name: string) => void;
    setDescription: (description: string) => void;
    setSource: (source?: PlaylistSource) => void;
}

const useApplyPlaylistStore = create<ApplyPlaylistProps & ApplyPlaylistMethods>()(setState => ({
    playlistDetail: [],
    setPlaylistDetail: playlistDetail => setState(() => ({ playlistDetail })),
    name: "",
    setName: name => setState(() => ({ name })),
    description: "",
    setDescription: description => setState(() => ({ description })),
    source: undefined,
    setSource: (source?: PlaylistSource) => setState(() => ({ source })),
}));

export default useApplyPlaylistStore;
