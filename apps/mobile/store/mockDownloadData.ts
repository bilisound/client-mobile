import { DownloadItem } from "~/store/download";

export const mockDownloadData: DownloadItem[] = [
    {
        title: "Feelin’ Go(o)d",
        id: "1",
        episode: 1,
        path: "/downloads/1",
        progress: {
            totalBytesWritten: 5000000,
            totalBytesExpectedToWrite: 10000000,
        },
        progressOld: {
            totalBytesWritten: 0,
            totalBytesExpectedToWrite: 10000000,
        },
        updateTime: Date.now(),
        updateTimeOld: Date.now() - 3600000,
        startTime: Date.now() - 3600000,
        started: true,
    },
    {
        title: "花",
        id: "2",
        episode: 2,
        path: "/downloads/2",
        progress: {
            totalBytesWritten: 7500000,
            totalBytesExpectedToWrite: 10000000,
        },
        progressOld: {
            totalBytesWritten: 0,
            totalBytesExpectedToWrite: 10000000,
        },
        updateTime: Date.now(),
        updateTimeOld: Date.now() - 1800000,
        startTime: Date.now() - 1800000,
        started: false,
    },
    {
        title: "何なんw（什么啊）",
        id: "3",
        episode: 3,
        path: "/downloads/3",
        progress: {
            totalBytesWritten: 2500000,
            totalBytesExpectedToWrite: 10000000,
        },
        progressOld: {
            totalBytesWritten: 0,
            totalBytesExpectedToWrite: 10000000,
        },
        updateTime: Date.now(),
        updateTimeOld: Date.now() - 7200000,
        startTime: Date.now() - 7200000,
        started: true,
    },
    {
        title: "Grace",
        id: "4",
        episode: 4,
        path: "/downloads/4",
        progress: {
            totalBytesWritten: 9000000,
            totalBytesExpectedToWrite: 10000000,
        },
        progressOld: {
            totalBytesWritten: 0,
            totalBytesExpectedToWrite: 10000000,
        },
        updateTime: Date.now(),
        updateTimeOld: Date.now() - 900000,
        startTime: Date.now() - 900000,
        started: true,
    },
    {
        title: "青春病",
        id: "5",
        episode: 5,
        path: "/downloads/5",
        progress: {
            totalBytesWritten: 1000000,
            totalBytesExpectedToWrite: 10000000,
        },
        progressOld: {
            totalBytesWritten: 0,
            totalBytesExpectedToWrite: 10000000,
        },
        updateTime: Date.now(),
        updateTimeOld: Date.now() - 10800000,
        startTime: Date.now() - 10800000,
        started: true,
    },
];
