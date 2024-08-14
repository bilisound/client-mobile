import * as Device from "expo-device";
import * as Sharing from "expo-sharing";
import path from "path-browserify";
import { Platform } from "react-native";
import RNFS from "react-native-fs";
import { logger, fileAsyncTransport, consoleTransport, configLoggerType } from "react-native-logs";

import { BILISOUND_LOG_PATH } from "~/constants/file";

const transport: Partial<configLoggerType> = {
    transport: [fileAsyncTransport, consoleTransport],
    transportOptions: {
        FS: RNFS,
        fileName: "bilisound_log_{date-today}.log",
        filePath: BILISOUND_LOG_PATH,
    },
};

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

const osMap: Record<typeof Platform.OS, string> = {
    ios: "iOS",
    android: "Android",
    macos: "macOS",
    windows: "Windows",
    web: "Web",
};

export async function getLogContentForDisplay() {
    // 获取设备信息
    let deviceInfo = `=============================
设备信息
=============================
`;
    deviceInfo += `系统: ${osMap[Platform.OS]} ${Device.osVersion}`;
    if (Platform.OS === "android") {
        deviceInfo += ` (API ${Device.platformApiLevel})`;
    }
    deviceInfo += "\n";
    deviceInfo += `设备类型: ${Device.deviceType}\n`;
    deviceInfo += `厂商: ${Device.brand}\n`;
    deviceInfo += `设备名称: ${Device.designName} (${Device.modelName})\n\n`;

    // 获取日志信息
    const fileList = await RNFS.readDir(BILISOUND_LOG_PATH);
    if (fileList.length <= 0) {
        return `${deviceInfo}还没有日志呢~使用一段时间再来看看吧！`;
    }
    // desc
    fileList.sort((a, b) => (+(a.mtime ?? 0) < +(b.mtime ?? 0) ? 1 : -1));
    const filePath = fileList.map(e => e.path).filter(e => e.endsWith(".log"));
    let combined = "";
    for (let i = 0; i < Math.min(filePath.length, 3); i++) {
        const header = `=============================
${filePath[i]} 文件内容
=============================
`;
        combined = `${header + (await RNFS.readFile(filePath[i], "utf8"))}\n${combined}`;
    }
    return deviceInfo + combined;
}

export async function shareLogContent(content: string) {
    const targetLocation = `${
        RNFS.CachesDirectoryPath
    }/sharing-${new Date().getTime()}/bilisound-log-export-${new Date().getTime()}.log`;
    await RNFS.mkdir(path.parse(targetLocation).dir);
    await RNFS.writeFile(targetLocation, content, "utf8");
    await Sharing.shareAsync(`file://${encodeURI(targetLocation)}`, {
        mimeType: "text/plain",
    });
}
