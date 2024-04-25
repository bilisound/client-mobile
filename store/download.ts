import RNFS from "react-native-fs";
import { create } from "zustand";

export interface DownloadItem {
    id: string;
    episode: number;
    path: string;
    progress: RNFS.DownloadProgressCallbackResult;
}

export interface DownloadProps {
    downloadList: Map<string, DownloadItem>;
}

export interface DownloadMethods {
    updateDownloadItem: (key: string, downloadItem: DownloadItem) => void;
    removeDownloadItem: (key: string) => void;
}

const useDownloadStore = create<DownloadProps & DownloadMethods>()((set, get) => ({
    downloadList: new Map(),
    updateDownloadItem: (key, downloadItem) => {
        const downloadList = new Map(get().downloadList);
        downloadList.set(key, downloadItem);
        set(() => ({ downloadList }));
    },
    removeDownloadItem: key => {
        const downloadList = new Map(get().downloadList);
        downloadList.delete(key);
        set(() => ({ downloadList }));
    },
}));

export default useDownloadStore;
