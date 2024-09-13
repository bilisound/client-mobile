import * as FileSystem from "expo-file-system";
import RNFS from "react-native-fs";

/**
 * 日志文件夹路径
 */
export const BILISOUND_LOG_URI = `${FileSystem.cacheDirectory}logs`;

/**
 * 离线缓存文件夹路径
 */
export const BILISOUND_OFFLINE_URI = `${FileSystem.documentDirectory}sounds`;

/**
 * 持久化播放队列路径
 */
export const BILISOUND_LEGACY_PERSIST_QUEUE_PATH = `${RNFS.DocumentDirectoryPath}/playlist.json`;
