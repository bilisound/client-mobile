import { MMKV } from "react-native-mmkv";

export const QUEUE_LIST = "queue_list";

export const QUEUE_CURRENT_INDEX = "queue_current_index";

export const queueStorage = new MMKV({ id: "storage-queue" });
