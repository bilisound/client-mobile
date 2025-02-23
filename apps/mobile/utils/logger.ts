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
    return (await FileSystem.readDirectoryAsync(BILISOUND_LOG_URI)).sort((a, b) => b.localeCompare(a));
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
    const now = new Date();
    const matchRegex = new RegExp(
        `^bilisound_log_(.+)_${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}.log$`,
    );
    for (let i = 0; i < fileList.length; i++) {
        const e = fileList[i];
        if (!matchRegex.test(e)) {
            await FileSystem.deleteAsync(`${BILISOUND_LOG_URI}/${e}`, { idempotent: true });
        }
    }
}
