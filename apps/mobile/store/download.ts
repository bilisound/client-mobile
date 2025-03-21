import { DownloadProgressData } from "expo-file-system";
import { createWithEqualityFn } from "zustand/traditional";
import * as FileSystem from "expo-file-system";
import { downloadResource } from "~/business/download";
import log from "~/utils/logger";

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
    count: number;
}

export interface DownloadProps {
    downloadList: Map<string, DownloadItem>;
}

export interface DownloadMethods {
    updateDownloadItem: (key: string, downloadItem: Omit<DownloadItem, "count">) => void;
    updateDownloadItemPartial: (key: string, downloadItem: Partial<DownloadItem>) => void;
    removeDownloadItem: (key: string) => void;
    clearDownloadItem: () => void;
    cancelAll: () => Promise<void>;
    pickTask: () => void;
}

const max = 3;
let count = 0;
let processTasks: string[] = [];

const useDownloadStore = createWithEqualityFn<DownloadProps & DownloadMethods>()((set, get) => ({
    downloadList: new Map(),
    abortController: new AbortController(),
    updateDownloadItem: (key, downloadItem) => {
        const downloadList = new Map(get().downloadList);
        downloadList.set(key, { ...downloadItem, count: count++ });
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
    cancelAll: async () => {},
    pickTask: () => {
        const list = Array.from(get().downloadList.values()).sort((a, b) => b.count - a.count);
        // 如果 processTasks 不够多，逐渐递加
        while (processTasks.length < max) {
            log.info("待处理任务数量：" + processTasks.length);
            const got = list.pop();
            if (!got) {
                break;
            }
            const id = got.id + "_" + got.episode;
            processTasks.push(id);
            log.info("处理任务 " + id);

            downloadResource(got.id, got.episode, got.title)
                .then(() => {
                    log.info(`[${got.id} / ${got.episode}] 下载完毕`);
                })
                .catch(e => {
                    log.error(`[${got.id} / ${got.episode}] 下载失败：${e?.message || e}`);
                })
                .finally(() => {
                    processTasks.splice(
                        processTasks.findIndex(e => e === id),
                        1,
                    );
                });
        }
    },
}));

export default useDownloadStore;
