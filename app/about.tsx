import { Image } from "expo-image";
import React, { useState } from "react";
import { Linking, ScrollView, View, Text, Pressable } from "react-native";
import Toast from "react-native-toast-message";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import CommonLayout from "~/components/CommonLayout";
import PotatoButton from "~/components/potato-ui/Button";
import {
    AlertDialog,
    AlertDialogBackdrop,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
} from "~/components/ui/alert-dialog";
import { Heading } from "~/components/ui/heading";
import { BILISOUND_OFFICIAL_WEBSITE } from "~/constants/branding";
import { RELEASE_CHANNEL } from "~/constants/release-channel";
import useLoading from "~/hooks/useLoading";
import { checkLatestVersion, CheckLatestVersionReturns } from "~/utils/check-release";
import log from "~/utils/logger";

const version = require("../app.json").expo.version;
// const version = "1.2.9";

export default function Page() {
    const { styles } = useStyles(stylesheet);

    // 检查更新
    const [modalVisible, setModalVisible] = useState(false);
    const [result, setResult] = useState<CheckLatestVersionReturns>();

    function handleClose() {
        setModalVisible(false);
        Linking.openURL(result!.downloadUrl);
    }

    const { run: handleCheckUpdate, loading: checkingUpdate } = useLoading(async () => {
        try {
            const response = await checkLatestVersion(version);
            log.info(`检查更新结果：${JSON.stringify(result)}`);
            if (response.isLatest) {
                Toast.show({
                    type: "success",
                    text1: "好耶，您使用的是最新版本！",
                    text2: `版本号：${response.latestVersion}`,
                });
            } else {
                setResult(response);
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
    });

    return (
        <CommonLayout title="关于" extendToBottom leftAccessories="backButton">
            <ScrollView>
                <View style={styles.container}>
                    <Image style={styles.logoImage} source={require("../assets/images/icon.png")} />
                    <Text style={styles.logoTitle}>Bilisound</Text>
                    <Text style={styles.version}>{`版本 ${version}`}</Text>
                    <View style={styles.action}>
                        <Pressable onPress={() => Linking.openURL(BILISOUND_OFFICIAL_WEBSITE)}>
                            <Text style={styles.link}>访问官网</Text>
                        </Pressable>
                        {/* 注意区分分发渠道！！ */}
                        {RELEASE_CHANNEL === "android_github" ? (
                            <Pressable onPress={() => handleCheckUpdate()} disabled={checkingUpdate}>
                                <Text style={[styles.link, checkingUpdate ? styles.linkDisabled : null]}>检查更新</Text>
                            </Pressable>
                        ) : null}
                    </View>
                </View>
            </ScrollView>
            <AlertDialog isOpen={modalVisible} onClose={handleClose} size="md">
                <AlertDialogBackdrop />
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <Heading className="text-typography-950 font-semibold" size="lg">
                            发现新版本！
                        </Heading>
                    </AlertDialogHeader>
                    <AlertDialogBody className="mt-4 mb-6">
                        <Text className="leading-normal">
                            {`Bilisound ${result?.latestVersion} 现已发布，而您当前正在使用 ${result?.currentVersion}。${
                                result?.extraInfo ? `\n\n${result?.extraInfo}\n` : ""
                            }\n想要前往最新版本下载页面吗？`}
                        </Text>
                    </AlertDialogBody>
                    <AlertDialogFooter className="gap-2">
                        <PotatoButton variant="ghost" onPress={handleClose}>
                            取消
                        </PotatoButton>
                        <PotatoButton onPress={handleClose}>确定</PotatoButton>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
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
