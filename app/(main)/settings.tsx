import { Entypo, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Platform, ScrollView } from "react-native";

import { SettingMenuItem } from "~/components/setting-menu";
import { createIcon } from "~/components/icon";
import { Switch } from "~/components/ui/switch";
import { VERSION } from "~/constants/releasing";
import useSettingsStore from "~/store/settings";
import log from "~/utils/logger";
import { Layout } from "~/components/layout";

const LinkIcon = createIcon(Entypo, "link");
const DownloadNextIcon = createIcon(MaterialIcons, "downloading");
const CDNIcon = createIcon(Entypo, "cloud");
const InfoIcon = createIcon(FontAwesome5, "info-circle");
// const ReadmeIcon = createIcon(Entypo, "help-with-circle");
const DeveloperIcon = createIcon(Entypo, "code");
const BugIcon = createIcon(FontAwesome5, "bug");
const PaintBrushIcon = createIcon(FontAwesome5, "paint-brush");
const DatabaseIcon = createIcon(Entypo, "database");
// const LabIcon = createIcon(Entypo, "lab-flask");

const Settings: React.FC = () => {
    const { useLegacyID, downloadNextTrack, filterResourceURL, debugMode, toggle } = useSettingsStore(state => ({
        useLegacyID: state.useLegacyID,
        downloadNextTrack: state.downloadNextTrack,
        filterResourceURL: state.filterResourceURL,
        debugMode: state.debugMode,
        // update: state.update,
        toggle: state.toggle,
    }));

    const developerOptions = (
        <>
            {process.env.NODE_ENV !== "production" ? (
                <SettingMenuItem
                    key="settings_20010"
                    icon={DeveloperIcon}
                    title="组件测试页面"
                    onPress={() => {
                        router.push("/test");
                    }}
                />
            ) : null}
            {/*<SettingMenuItem
                key="settings_20020"
                icon={LabIcon}
                title="实验性功能"
                onPress={() => {
                    router.push("/settings/lab");
                }}
            />*/}
            {Platform.OS === "web" ? null : (
                <>
                    <SettingMenuItem
                        key="settings_20030"
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
                        key="settings_20040"
                        icon={BugIcon}
                        title="导出日志"
                        subTitle="对开发者真的太有用了"
                        onPress={async () => {
                            router.push("/settings/log-show");
                        }}
                    />
                </>
            )}
        </>
    );

    return (
        <Layout title="设置">
            <ScrollView>
                <SettingMenuItem
                    key="settings_10010"
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
                {Platform.OS === "web" ? null : (
                    <SettingMenuItem
                        key="settings_10020"
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
                )}
                <SettingMenuItem
                    key="settings_10030"
                    icon={PaintBrushIcon}
                    iconSize={20}
                    title="外观设置"
                    subTitle="切换应用主题和看板娘显示"
                    onPress={async () => {
                        router.push("/settings/theme");
                    }}
                />
                {Platform.OS === "web" ? null : (
                    <SettingMenuItem
                        key="settings_10040"
                        icon={DatabaseIcon}
                        title="数据管理"
                        subTitle="管理离线缓存和数据备份"
                        onPress={async () => {
                            router.push("/settings/data");
                        }}
                    />
                )}
                <SettingMenuItem
                    key="settings_10050"
                    icon={InfoIcon}
                    title="关于 Bilisound"
                    subTitle={`版本 ${VERSION}`}
                    onPress={async () => {
                        router.push("/settings/about");
                    }}
                />
                <SettingMenuItem
                    key="settings_10060"
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
        </Layout>
    );
};

export default Settings;
