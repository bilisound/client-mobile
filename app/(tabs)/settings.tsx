import { Entypo, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { filesize } from "filesize";
import path from "path-browserify";
import React, { useEffect, useState } from "react";
import { ScrollView, Switch } from "react-native";
import TrackPlayer from "react-native-track-player";

import { getUserSeason } from "~/api/external/json";
import CommonLayout from "~/components/CommonLayout";
import SettingMenuItem, { SettingMenuItemIcon } from "~/components/SettingMenuItem";
import { BILISOUND_OFFLINE_PATH } from "~/constants/file";
import useDownloadStore from "~/store/download";
import useSettingsStore from "~/store/settings";
import log from "~/utils/logger";
import { checkDirectorySize, cleanAudioCache } from "~/utils/misc";

const LinkIcon: SettingMenuItemIcon = iconProps => <Entypo name="link" {...iconProps} />;
const DownloadNextIcon: SettingMenuItemIcon = iconProps => <MaterialIcons name="downloading" {...iconProps} />;
const CDNIcon: SettingMenuItemIcon = iconProps => <Entypo name="cloud" {...iconProps} />;
const DeleteIcon: SettingMenuItemIcon = iconProps => <MaterialIcons name="delete" {...iconProps} />;
const InfoIcon: SettingMenuItemIcon = iconProps => <FontAwesome5 name="info-circle" {...iconProps} />;
// const ReadmeIcon: SettingMenuItemIcon = iconProps => <Entypo name="help-with-circle" {...iconProps} />;
const DeveloperIcon: SettingMenuItemIcon = iconProps => <Entypo name="code" {...iconProps} />;
const BugIcon: SettingMenuItemIcon = iconProps => <FontAwesome5 name="bug" {...iconProps} />;

const Settings: React.FC = () => {
    const { useLegacyID, downloadNextTrack, filterResourceURL, debugMode, toggle } = useSettingsStore(state => ({
        useLegacyID: state.useLegacyID,
        downloadNextTrack: state.downloadNextTrack,
        filterResourceURL: state.filterResourceURL,
        debugMode: state.debugMode,
        // update: state.update,
        toggle: state.toggle,
    }));

    // 离线缓存大小
    const [cacheSize, setCacheSize] = useState(-1);
    const [cacheSizeFree, setCacheSizeFree] = useState(-1);
    const [cacheRefreshFlag, setCacheRefreshFlag] = useState(false);

    useEffect(() => {
        let died = false;
        (async () => {
            const tracks = await TrackPlayer.getQueue();
            const cacheSizeRaw = await checkDirectorySize(BILISOUND_OFFLINE_PATH);
            const cacheFreeSizeRaw = await checkDirectorySize(BILISOUND_OFFLINE_PATH, {
                fileFilter(fileName) {
                    const name = path.parse(fileName).name;
                    return !tracks.find(e => `${e.bilisoundId}_${e.bilisoundEpisode}` === name);
                },
            });
            if (died) {
                return;
            }
            setCacheSize(cacheSizeRaw);
            setCacheSizeFree(cacheFreeSizeRaw);
        })();
        return () => {
            died = true;
        };
    }, [cacheRefreshFlag]);

    const developerOptions = (
        <>
            <SettingMenuItem
                icon={CDNIcon}
                title="只从云服务商 CDN 节点获取音频"
                subTitle="开启后可能会显著改善连接速度"
                rightAccessories={
                    <Switch
                        value={filterResourceURL}
                        onChange={() => {
                            toggle("filterResourceURL");
                        }}
                    />
                }
                onPress={() => toggle("filterResourceURL")}
            />
            <SettingMenuItem
                icon={BugIcon}
                title="导出日志"
                subTitle="对开发者真的太有用了"
                onPress={async () => {
                    router.push("/log-show");
                }}
            />
            {process.env.NODE_ENV === "development" ? (
                <>
                    <SettingMenuItem
                        icon={BugIcon}
                        title="[useDownloadStore] clearDownloadItem"
                        subTitle="……"
                        onPress={async () => {
                            useDownloadStore.getState().clearDownloadItem();
                        }}
                    />
                    <SettingMenuItem
                        icon={BugIcon}
                        title="getUserSeason"
                        subTitle="……"
                        onPress={async () => {
                            console.log(JSON.stringify(await getUserSeason(1741301, 905374), null, 4));
                        }}
                    />
                </>
            ) : null}
        </>
    );

    return (
        <CommonLayout title="设置" extendToBottom titleBarTheme="transparent">
            <ScrollView>
                <SettingMenuItem
                    icon={LinkIcon}
                    title="使用 av 号而非 bv 号"
                    subTitle="开启该选项后，在保存的音频文件中，文件名前缀将以 av 号开头"
                    rightAccessories={
                        <Switch
                            value={useLegacyID}
                            onChange={() => {
                                toggle("useLegacyID");
                            }}
                        />
                    }
                    onPress={() => toggle("useLegacyID")}
                />
                <SettingMenuItem
                    icon={DownloadNextIcon}
                    title="自动下载队列中即将播放的曲目"
                    subTitle="可以显著改善持续听歌的体验"
                    rightAccessories={
                        <Switch
                            value={downloadNextTrack}
                            onChange={() => {
                                toggle("downloadNextTrack");
                            }}
                        />
                    }
                    onPress={() => toggle("downloadNextTrack")}
                />
                <SettingMenuItem
                    icon={DeleteIcon}
                    title="清除离线缓存"
                    subTitle={
                        cacheSize < 0 || cacheSizeFree < 0
                            ? "占用空间统计中……"
                            : `共占用 ${filesize(cacheSize)} (${filesize(cacheSizeFree)} 可清除)`
                    }
                    onPress={async () => {
                        await cleanAudioCache();
                        setCacheRefreshFlag(prevState => !prevState);
                    }}
                    disabled={cacheSizeFree <= 0}
                />
                <SettingMenuItem
                    icon={InfoIcon}
                    title="关于 Bilisound"
                    subTitle={`版本 ${require("~/app.json").expo.version}`}
                    onPress={async () => {
                        router.push("/about");
                    }}
                />
                <SettingMenuItem
                    icon={DeveloperIcon}
                    title="开发者模式"
                    rightAccessories={
                        <Switch
                            value={debugMode}
                            onChange={() => {
                                const result = toggle("debugMode");
                                log.setSeverity(result ? "debug" : "info");
                            }}
                        />
                    }
                    onPress={() => {
                        const result = toggle("debugMode");
                        log.setSeverity(result ? "debug" : "info");
                    }}
                />
                {debugMode ? developerOptions : null}
            </ScrollView>
        </CommonLayout>
    );
};

export default Settings;
