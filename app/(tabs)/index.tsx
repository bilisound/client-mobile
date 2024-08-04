import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { Poppins_700Bold } from "@expo-google-fonts/poppins";
import { Pressable } from "@gluestack-ui/themed";
import { useFonts } from "expo-font";
import { router } from "expo-router";
import React, { useState } from "react";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Input, Text, useTheme } from "tamagui";

import FormErrorMessage from "~/components/FormErrorMessage";
import { COMMON_FRAME_BUTTON_STYLE } from "~/constants/style";
import useCommonColors from "~/hooks/useCommonColors";
import { resolveVideoAndJump } from "~/utils/format";
import log from "~/utils/logger";

const TabIndexScreen: React.FC = () => {
    const [value, setValue] = useState("");
    const [inputError, setInputError] = useState(false);

    const { primaryColor } = useCommonColors();
    const insets = useSafeAreaInsets();
    const [fontsLoaded] = useFonts({
        Poppins_700Bold,
    });

    async function handleSubmitEditing() {
        log.info("用户执行查询操作");
        log.debug(`查询关键词: ${value}`);
        try {
            setInputError(false);
            await resolveVideoAndJump(value);
        } catch (error) {
            setInputError(true);
            log.info(`无法执行搜索操作，因此不响应用户提交。原因：${error}`);
        }
    }

    const theme = useTheme();

    return (
        <View
            alignItems="stretch"
            height="100%"
            style={{
                paddingLeft: insets.left,
                paddingRight: insets.right,
                paddingTop: insets.top,
            }}
        >
            <View
                style={{
                    paddingTop: 96,
                    paddingBottom: 48,
                    alignItems: "center",
                }}
            >
                {fontsLoaded ? (
                    <Text color={theme["brand"]} fontSize={32} height={48} lineHeight={48} fontFamily="Poppins_700Bold">
                        BILISOUND
                    </Text>
                ) : null}
            </View>
            <View px={16} alignItems="stretch" w="100%">
                <Input
                    flex={0}
                    size="$5"
                    w="100%"
                    placeholder="粘贴完整链接或带前缀 ID 至此"
                    value={value}
                    onChangeText={nextValue => {
                        setInputError(false);
                        setValue(nextValue);
                    }}
                    onSubmitEditing={handleSubmitEditing}
                />
                <FormErrorMessage isError={inputError}>请输入合法的地址或 ID</FormErrorMessage>
            </View>
            <View
                position="absolute"
                padding={8}
                right={0}
                flexDirection="row"
                alignItems="center"
                gap={4}
                style={{
                    top: insets.top,
                }}
            >
                {Platform.OS === "web" ? null : (
                    <Pressable sx={COMMON_FRAME_BUTTON_STYLE} onPress={() => router.push("/barcode")}>
                        <MaterialCommunityIcons name="qrcode-scan" size={20} color={primaryColor} />
                    </Pressable>
                )}
                <Pressable sx={COMMON_FRAME_BUTTON_STYLE} onPress={() => router.push("/history")}>
                    <FontAwesome5 name="history" size={20} color={primaryColor} />
                </Pressable>
            </View>
            <View flex={1} />
        </View>
    );
};

export default TabIndexScreen;
