import RNFS from "react-native-fs";

import { BILISOUND_LEGACY_PERSIST_QUEUE_PATH } from "~/constants/file";
import { QUEUE_CURRENT_INDEX, QUEUE_LIST, queueStorage } from "~/storage/queue";
import log from "~/utils/logger";

export async function handleLegacyQueue() {
    if (await RNFS.exists(BILISOUND_LEGACY_PERSIST_QUEUE_PATH)) {
        log.info("发现旧版播放队列缓存数据，正在升级……");
        const raw = await RNFS.readFile(BILISOUND_LEGACY_PERSIST_QUEUE_PATH, "utf8");
        const data = JSON.parse(raw);
        const tracks = data?.tracks ?? [];
        const current = data.current;

        log.info("正在转存数据……");
        queueStorage.set(QUEUE_LIST, JSON.stringify(tracks));
        queueStorage.set(QUEUE_CURRENT_INDEX, current || 0);

        log.info("数据升级完毕，修改旧版数据文件名");
        await RNFS.moveFile(BILISOUND_LEGACY_PERSIST_QUEUE_PATH, BILISOUND_LEGACY_PERSIST_QUEUE_PATH + ".bak");

        return { tracks, current };
    }
    return null;
}
