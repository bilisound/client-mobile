import { DownloadProgressData } from "expo-file-system";
import { createWithEqualityFn } from "zustand/traditional";
import * as FileSystem from "expo-file-system";

export interface DownloadItem {
    title: string;
    id: string;
    episode: number;
    path: string;
    progress: DownloadProgressData;
    progressOld: DownloadProgressData;
    updateTime: number;
    updateTimeOld: number;
    startTime: number;
    started: boolean;
    instance?: FileSystem.DownloadResumable;
    cancelFlag?: boolean;
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
