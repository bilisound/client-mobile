import { logger, consoleTransport, configLoggerType } from "react-native-logs";

let transport: Partial<configLoggerType> = {
    transport: consoleTransport,
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
