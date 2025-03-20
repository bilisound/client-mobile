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
    instance?: FileSystem.DownloadResumable;
    /**
     * 0 - 等待中，1 - 下载中，2 - 本地处理中
     */
    status: 0 | 1 | 2;
}

export interface DownloadProps {
    downloadList: Map<string, DownloadItem>;
    abortController: AbortController;
}

export interface DownloadMethods {
    updateDownloadItem: (key: string, downloadItem: DownloadItem) => void;
    updateDownloadItemPartial: (key: string, downloadItem: Partial<DownloadItem>) => void;
    removeDownloadItem: (key: string) => void;
    clearDownloadItem: () => void;
    cancelAll: () => Promise<void>;
    resetAbortController: () => void;
}

const useDownloadStore = createWithEqualityFn<DownloadProps & DownloadMethods>()((set, get) => ({
    downloadList: new Map(),
    abortController: new AbortController(),
    updateDownloadItem: (key, downloadItem) => {
        const downloadList = new Map(get().downloadList);
        downloadList.set(key, downloadItem);
        set(() => ({ downloadList }));
    },
    updateDownloadItemPartial: (key, downloadItem) => {
        const downloadList = new Map(get().downloadList);
        const got = downloadList.get(key);
        if (got) {
            downloadList.set(key, { ...got, ...downloadItem });
            set(() => ({ downloadList }));
        }
    },
    removeDownloadItem: key => {
        const downloadList = new Map(get().downloadList);
        downloadList.delete(key);
        set(() => ({ downloadList }));
    },
    clearDownloadItem: () => {
        set(() => ({ downloadList: new Map() }));
    },
    cancelAll: async () => {
        const downloadList = new Map(get().downloadList);
        for (let [key, value] of downloadList) {
            if (value.instance) {
                await value.instance.cancelAsync();
            }
            downloadList.delete(key);
        }
        get().abortController.abort();
        set(() => ({ downloadList }));
    },
    resetAbortController: () => {
        set(() => ({ abortController: new AbortController() }));
    },
}));

export default useDownloadStore;
