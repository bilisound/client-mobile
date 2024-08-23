import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import React, { useState } from "react";
import { Linking, ScrollView, View, Text, Pressable } from "react-native";
import Toast from "react-native-toast-message";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import CheckUpdateDialog from "~/components/CheckUpdateDialog";
import CommonLayout from "~/components/CommonLayout";
import { BILISOUND_OFFICIAL_WEBSITE } from "~/constants/branding";
import { RELEASE_CHANNEL, VERSION } from "~/constants/releasing";
import { checkLatestVersion } from "~/utils/check-release";
import log from "~/utils/logger";

export default function Page() {
    const { styles } = useStyles(stylesheet);

    // 检查更新
    const [modalVisible, setModalVisible] = useState(false);
    const { data, isLoading, isError } = useQuery({
        queryKey: ["check_update"],
        queryFn: () => checkLatestVersion(VERSION),
        staleTime: 10000,
    });

    function handleClose(positive: boolean) {
        setModalVisible(false);
        if (positive) {
            Linking.openURL(data!.downloadUrl);
        }
    }

    function handleCheckUpdate() {
        try {
            log.info(`检查更新结果：${JSON.stringify(data)}`);
            if (data?.isLatest) {
                Toast.show({
                    type: "success",
                    text1: "好耶，您使用的是最新版本！",
                    text2: `版本号：${data.latestVersion}`,
                });
            } else {
                setModalVisible(true);
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
        <CommonLayout title="关于" extendToBottom leftAccessories="backButton">
            <ScrollView>
                <View style={styles.container}>
                    <Image style={styles.logoImage} source={require("../assets/images/icon.png")} />
                    <Text style={styles.logoTitle}>Bilisound</Text>
                    <Text style={styles.version}>{`版本 ${VERSION}`}</Text>
                    <View style={styles.action}>
                        <Pressable onPress={() => Linking.openURL(BILISOUND_OFFICIAL_WEBSITE)}>
                            <Text style={styles.link}>访问官网</Text>
                        </Pressable>
                        {/* 注意区分分发渠道！！ */}
                        {RELEASE_CHANNEL === "android_github" ? (
                            <Pressable onPress={() => handleCheckUpdate()} disabled={isError || isLoading}>
                                <Text style={[styles.link, isError || isLoading ? styles.linkDisabled : null]}>
                                    检查更新
                                </Text>
                            </Pressable>
                        ) : null}
                    </View>
                </View>
            </ScrollView>
            <CheckUpdateDialog open={modalVisible} onClose={handleClose} result={data} />
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
    action: {
        flexDirection: "row",
        gap: 16,
    },
    link: {
        marginTop: 24,
        color: theme.colorTokens.buttonOutlineForeground("accent", "default"),
        textDecorationLine: "underline",
    },
    linkDisabled: {
        color: theme.colorTokens.buttonOutlineForeground("accent", "disabled"),
        opacity: 0.5,
    },
}));
