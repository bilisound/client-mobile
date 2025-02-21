import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { consoleTransport, fileAsyncTransport, logger } from "react-native-logs";

import { BILISOUND_LOG_URI } from "~/constants/file";
import { VERSION } from "~/constants/releasing";

const log = logger.createLogger({
    levels: {
        debug: 0,
        info: 1,
        warn: 2,
        error: 3,
    },
    severity: "info",
    async: true,
    dateFormat: "time",
    printLevel: true,
    printDate: true,
    enabled: true,
    transport: [fileAsyncTransport, consoleTransport],
    transportOptions: {
        // @ts-ignore
        FS: FileSystem,
        fileName: `bilisound_log_${VERSION}_{date-today}.log`,
        filePath: BILISOUND_LOG_URI,
    },
});

export default log;

export async function getLogList() {
    return FileSystem.readDirectoryAsync(BILISOUND_LOG_URI);
}

export async function getLog(name: string) {
    return FileSystem.readAsStringAsync(BILISOUND_LOG_URI + "/" + name);
}

export async function shareLog(name: string) {
    await Sharing.shareAsync(BILISOUND_LOG_URI + "/" + name, {
        mimeType: "text/plain",
    });
}

export async function deleteLogContent() {
    const fileList = await FileSystem.readDirectoryAsync(BILISOUND_LOG_URI);
    for (let i = 0; i < fileList.length; i++) {
        const e = fileList[i];
        await FileSystem.deleteAsync(`${BILISOUND_LOG_URI}/${e}`, { idempotent: true });
    }
}
