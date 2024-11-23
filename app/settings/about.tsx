import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Linking, ScrollView, View } from "react-native";
import Toast from "react-native-toast-message";

import CommonLayout from "~/components/CommonLayout";
import SettingMenuItem from "~/components/SettingMenuItem";
import { createIcon } from "~/components/potato-ui/utils/icon";
import { Text } from "~/components/ui/text";
import { BILISOUND_OFFICIAL_WEBSITE } from "~/constants/branding";
import { RELEASE_CHANNEL, VERSION } from "~/constants/releasing";
import { checkLatestVersion } from "~/utils/check-release";
import log from "~/utils/logger";

const UpdateIcon = createIcon(MaterialIcons, "update");
const HomeIcon = createIcon(MaterialIcons, "home");
const LicenseIcon = createIcon(MaterialCommunityIcons, "license");

export default function Page() {
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
                <View className="items-center p-6">
                    <Image
                        className="w-[4.5rem] h-[4.5rem] rounded-xl"
                        source={require("../../assets/images/icon.png")}
                    />
                    <Text className="text-2xl leading-normal font-semibold mt-2 mb-1">Bilisound</Text>
                    <Text className="text-sm leading-normal opacity-50">{`版本 ${VERSION}`}</Text>
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
                <SettingMenuItem
                    icon={LicenseIcon}
                    title="开源软件使用声明"
                    onPress={() => router.push("/settings/license")}
                />
            </ScrollView>
        </CommonLayout>
    );
}
