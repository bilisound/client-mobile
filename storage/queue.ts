import { MMKV } from "react-native-mmkv";

// 当前队列
export const QUEUE_LIST = "queue_list";

// 当前队列备份（用于退出随机播放模式）
export const QUEUE_LIST_BACKUP = "queue_list_backup";

// 当前播放的曲目在队列中的 index
export const QUEUE_CURRENT_INDEX = "queue_current_index";

// 当前队列是否已经随机化
export const QUEUE_IS_RANDOMIZED = "queue_is_randomized";

export const queueStorage = new MMKV({ id: "storage-queue" });
