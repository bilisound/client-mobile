import * as Device from "expo-device";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";
import { logger, fileAsyncTransport, consoleTransport, configLoggerType } from "react-native-logs";

import { BILISOUND_LOG_URI } from "~/constants/file";
import { VERSION } from "~/constants/releasing";

const transport: Partial<configLoggerType> = {
    transport: [fileAsyncTransport, consoleTransport],
    transportOptions: {
        FS: FileSystem,
        fileName: `bilisound_log_${VERSION}_{date-today}.log`,
        filePath: BILISOUND_LOG_URI,
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
    const fileList = await FileSystem.readDirectoryAsync(BILISOUND_LOG_URI);
    if (fileList.length <= 0) {
        return `${deviceInfo}还没有日志呢~使用一段时间再来看看吧！`;
    }

    // 按照修改时间排序
    const metadata: Exclude<
        FileSystem.FileInfo,
        {
            exists: false;
        }
    >[] = [];
    for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const item = await FileSystem.getInfoAsync(BILISOUND_LOG_URI + "/" + file);
        if (item.exists && item.uri.endsWith(".log")) {
            metadata.push(item);
        }
    }

    metadata.sort((a, b) => (+(a.modificationTime ?? 0) < +(b.modificationTime ?? 0) ? 1 : -1));
    let combined = "";
    for (let i = 0; i < Math.min(metadata.length, 3); i++) {
        const header = `=============================
${metadata[i].uri} 文件内容
=============================
`;
        combined = `${header + (await FileSystem.readAsStringAsync(metadata[i].uri))}\n${combined}`;
    }
    return deviceInfo + combined;
}

export async function shareLogContent(content: string) {
    const targetLocationBase = `${FileSystem.cacheDirectory}/sharing-${new Date().getTime()}`;
    const targetLocation = `${targetLocationBase}/bilisound-log-export-${new Date().getTime()}.log`;
    await FileSystem.makeDirectoryAsync(targetLocationBase, { intermediates: true });
    await FileSystem.writeAsStringAsync(targetLocation, content, { encoding: FileSystem.EncodingType.UTF8 });
    await Sharing.shareAsync(targetLocation, {
        mimeType: "text/plain",
    });
}
