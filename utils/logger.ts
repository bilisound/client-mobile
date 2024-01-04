import { logger, fileAsyncTransport } from "react-native-logs";
import RNFS from "react-native-fs";
import { BILISOUND_LOG_PATH } from "../constants/file";

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
    transport: fileAsyncTransport,
    transportOptions: {
        FS: RNFS,
        fileName: "bilisound_log_{date-today}.log",
        filePath: BILISOUND_LOG_PATH,
    },
};

const log = logger.createLogger<"debug" | "info" | "warn" | "error">(config);

export default log;
