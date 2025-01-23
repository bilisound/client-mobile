import { DownloadProgressData } from "expo-file-system";
import { createWithEqualityFn } from "zustand/traditional";

export interface DownloadItem {
    id: string;
    episode: number;
    path: string;
    progress: DownloadProgressData;
}

export interface DownloadProps {
    downloadList: Map<string, DownloadItem>;
}

export interface DownloadMethods {
    updateDownloadItem: (key: string, downloadItem: DownloadItem) => void;
    removeDownloadItem: (key: string) => void;
    clearDownloadItem: () => void;
}

const useDownloadStore = createWithEqualityFn<DownloadProps & DownloadMethods>()((set, get) => ({
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
    clearDownloadItem: () => {
        set(() => ({ downloadList: new Map() }));
    },
}));

export default useDownloadStore;
