import useDownloadStore from "~/store/download";
import { getCacheAudioPath } from "~/utils/file";
import * as FileSystem from "expo-file-system";
import { FFmpegKit, FFprobeKit } from "ffmpeg-kit-react-native";
import { filesize } from "filesize";
import { getBilisoundResourceUrl } from "~/api/bilisound";
import log from "~/utils/logger";
import useSettingsStore from "~/store/settings";
import { getVideoUrl } from "~/business/constant-helper";
import { USER_AGENT_BILIBILI } from "~/constants/network";
import { cacheStatusStorage } from "~/storage/cache-status";

export async function downloadResource(bvid: string, episode: number) {
    const prefix = `[${bvid} / ${episode}] `;
    const { updateDownloadItem, removeDownloadItem, downloadList } = useDownloadStore.getState();

    const playingRequest = {
        id: bvid,
        episode,
    };
    const id = `${playingRequest.id}_${playingRequest.episode}`;

    // 避免重复操作
    if (downloadList.has(id)) {
        log.debug(prefix + "已经有相同任务在处理");
        return;
    }
    // 待检查的本地音频路径（包括从视频提取的音频）
    const checkUrl = getCacheAudioPath(playingRequest.id, playingRequest.episode, false);

    if (cacheStatusStorage.getBoolean(playingRequest.id + "_" + playingRequest.episode)) {
        log.debug(prefix + "本地缓存有对应内容记录，不需要下载");
        return;
    }

    log.debug(prefix + "本地缓存无对应内容，开始请求网络资源");
    // 在状态管理器创建下载任务
    updateDownloadItem(id, {
        id: playingRequest.id,
        episode: playingRequest.episode,
        path: checkUrl,
        progress: {
            totalBytesExpectedToWrite: 0,
            totalBytesWritten: 0,
        },
    });

    // 获取源地址
    const { url, isAudio } = await getBilisoundResourceUrl(
        playingRequest.id,
        playingRequest.episode,
        useSettingsStore.getState().filterResourceURL,
    );

    // 待下载资源地址（可能是音频或视频）
    const downloadTargetFileUrl = getCacheAudioPath(playingRequest.id, playingRequest.episode, true);

    // 下载处理
    const beginTime = global.performance.now();
    const downloadResumable = FileSystem.createDownloadResumable(
        url,
        downloadTargetFileUrl,
        {
            headers: {
                referer: getVideoUrl(playingRequest.id, playingRequest.episode),
                "user-agent": USER_AGENT_BILIBILI,
            },
            cache: true,
        },
        cb => {
            // console.log(JSON.stringify(downloadResumable, null, 4));
            // 更新状态管理器中的内容
            updateDownloadItem(id, {
                id: playingRequest.id,
                episode: playingRequest.episode,
                path: downloadTargetFileUrl,
                progress: cb,
            });
        },
    );
    await downloadResumable.downloadAsync();
    const endTime = global.performance.now();
    const info = await FileSystem.getInfoAsync(downloadTargetFileUrl);
    const fileSize = info?.exists ? info.size : 0;
    const runTime = (endTime - beginTime) / 1000;
    log.debug(prefix + `下载任务结束，用时: ${runTime.toFixed(3)}s, 平均下载速度: ${filesize(fileSize / runTime)}/s`);

    if (isAudio) {
        await FileSystem.moveAsync({
            from: getCacheAudioPath(playingRequest.id, playingRequest.episode, true),
            to: checkUrl,
        });
        cacheStatusStorage.set(playingRequest.id + "_" + playingRequest.episode, true);
        removeDownloadItem(id);
        return;
    }

    // 如果不是音频流，进行音视频分离操作
    log.info(prefix + "非音频流，进行音视频分离操作");

    // 格式判断
    const probeSession = await FFprobeKit.execute(
        `-v error -select_streams a:0 -show_entries stream=codec_name -of default=noprint_wrappers=1:nokey=1 ${JSON.stringify(downloadTargetFileUrl)}`,
    );
    let returnCode = await probeSession.getReturnCode();
    let result = await probeSession.getOutput();
    if (!returnCode.isValueSuccess()) {
        log.error(prefix + "视频编码识别失败！");
        log.error(`returnCode: ${returnCode}`);
        log.error(`result：${result}`);
        throw new Error("视频处理失败");
    }

    // 进行转码或直接提取操作
    let mpegSession;
    if (result.trim() === "aac") {
        log.debug(prefix + "进行提取音频流操作");
        mpegSession = await FFmpegKit.execute(
            `-i ${JSON.stringify(downloadTargetFileUrl)} -vn -acodec copy ${JSON.stringify(checkUrl)}`,
        );
    } else {
        log.debug(prefix + `进行转码音频流操作。原因：音频编码是 ${result}`);
        mpegSession = await FFmpegKit.execute(
            // 别的编码（比如 mp3）通常音质不会特别好，所以先设置 256kbps 的动态码率了
            // （叔叔会有上 opus 的一天吗？）
            `-i ${JSON.stringify(downloadTargetFileUrl)} -vn -acodec aac -b:a 256k ${JSON.stringify(checkUrl)}`,
        );
    }
    returnCode = await mpegSession.getReturnCode();
    result = await mpegSession.getOutput();
    if (!returnCode.isValueSuccess()) {
        log.error(prefix + "视频转码失败！");
        log.error(`returnCode: ${returnCode}`);
        log.error(`result：${result}`);
        throw new Error("视频处理失败");
    }

    // 收尾
    log.debug(prefix + "删除不再需要的视频文件");
    await FileSystem.deleteAsync(downloadTargetFileUrl);
    cacheStatusStorage.set(playingRequest.id + "_" + playingRequest.episode, true);
    removeDownloadItem(id);
}
