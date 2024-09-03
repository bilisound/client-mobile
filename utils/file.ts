import * as Sharing from "expo-sharing";
import { Platform } from "react-native";
import RNFS from "react-native-fs";
import { createDocument } from "react-native-saf-x";

import log from "~/utils/logger";

export async function saveTextFile(name: string, content: string, mimeType = "text/plain") {
    if (Platform.OS === "android") {
        const response = await createDocument(content, {
            initialName: name,
            encoding: "utf8",
        });
        return !!response;
    }
    const filePath = RNFS.CachesDirectoryPath + `/shared_text_file_${new Date().getTime()}`;
    const fileFullPath = `${filePath}/${name}`;
    await RNFS.mkdir(filePath);
    await RNFS.writeFile(fileFullPath, content, "utf8");
    log.debug("分享文件：" + fileFullPath);
    await Sharing.shareAsync("file://" + encodeURI(fileFullPath), {
        mimeType,
    });
}
