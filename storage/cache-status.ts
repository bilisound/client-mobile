import { MMKV } from "react-native-mmkv";

export const CACHE_STATUS_VERSION = "cache_status_version";

// 键格式：[BV 号]_[分 P 编号]
export const cacheStatusStorage = new MMKV({ id: "cache-status" });
