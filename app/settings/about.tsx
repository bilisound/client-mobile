import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import React from "react";
import { Linking, ScrollView, View, Text } from "react-native";
import Toast from "react-native-toast-message";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import CommonLayout from "~/components/CommonLayout";
import SettingMenuItem from "~/components/SettingMenuItem";
import { createIcon } from "~/components/potato-ui/utils/icon";
import { BILISOUND_OFFICIAL_WEBSITE } from "~/constants/branding";
import { RELEASE_CHANNEL, VERSION } from "~/constants/releasing";
import { checkLatestVersion } from "~/utils/check-release";
import log from "~/utils/logger";

const UpdateIcon = createIcon(MaterialIcons, "update");
const HomeIcon = createIcon(MaterialIcons, "home");

export default function Page() {
    const { styles } = useStyles(stylesheet);

    // 检查更新
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["check_update"],
        queryFn: () => checkLatestVersion(VERSION),
        staleTime: 86400_000,
    });

    async function handleCheckUpdate() {
        try {
            await refetch();
            log.info(`检查更新结果：${JSON.stringify(data)}`);
            if (data?.isLatest) {
                Toast.show({
                    type: "success",
                    text1: "好耶，您使用的是最新版本！",
                    text2: `版本号：${data.latestVersion}`,
                });
            }
        } catch (e) {
            log.error(`检查更新失败，原因：${e}`);
            Toast.show({
                type: "error",
                text1: "检查更新失败",
                text2: `可能是网络连接开小差了，稍后再试试吧`,
            });
        }
    }

    return (
        <CommonLayout title="关于" overrideEdgeInsets={{ bottom: 0 }} leftAccessories="backButton">
            <ScrollView>
                <View style={styles.container}>
                    <Image style={styles.logoImage} source={require("../../assets/images/icon.png")} />
                    <Text style={styles.logoTitle}>Bilisound</Text>
                    <Text style={styles.version}>{`版本 ${VERSION}`}</Text>
                </View>
                <SettingMenuItem
                    icon={HomeIcon}
                    title="访问官网"
                    onPress={() => Linking.openURL(BILISOUND_OFFICIAL_WEBSITE)}
                />
                {/* 注意区分分发渠道！！ */}
                {RELEASE_CHANNEL === "android_github" ? (
                    <SettingMenuItem
                        icon={UpdateIcon}
                        title="检查更新"
                        disabled={isError || isLoading}
                        onPress={() => handleCheckUpdate()}
                    />
                ) : null}
            </ScrollView>
        </CommonLayout>
    );
}

const stylesheet = createStyleSheet(theme => ({
    container: {
        alignItems: "center",
        padding: 24,
    },
    logoImage: {
        width: 72,
        height: 72,
        borderRadius: 12,
    },
    logoTitle: {
        fontSize: 24,
        lineHeight: 24 * 1.5,
        fontWeight: "700",
        marginTop: 8,
        marginBottom: 4,
        color: theme.colorTokens.foreground,
    },
    version: {
        fontSize: 14,
        lineHeight: 14 * 1.5,
        opacity: 0.5,
        color: theme.colorTokens.foreground,
    },
}));
