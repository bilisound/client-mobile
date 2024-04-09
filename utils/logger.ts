import RNFS from "react-native-fs";
import { logger, fileAsyncTransport, consoleTransport, configLoggerType } from "react-native-logs";

import { BILISOUND_LOG_PATH } from "../constants/file";

let transport: Partial<configLoggerType> = {
    transport: fileAsyncTransport,
    transportOptions: {
        FS: RNFS,
        fileName: "bilisound_log_{date-today}.log",
        filePath: BILISOUND_LOG_PATH,
    },
};

if (process.env.NODE_ENV === "development") {
    transport = {
        transport: consoleTransport,
    };
}

const config = {
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
    ...transport,
};

const log = logger.createLogger<"debug" | "info" | "warn" | "error">(config);

export default log;
