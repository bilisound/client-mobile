import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { Poppins_700Bold } from "@expo-google-fonts/poppins";
import { useFonts } from "expo-font";
import { router } from "expo-router";
import React, { useState } from "react";
import { Platform, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ButtonTitleBar from "~/components/potato-ui/ButtonTitleBar";
import { createIcon } from "~/components/potato-ui/utils/icon";
import { Box } from "~/components/ui/box";
import {
    FormControl,
    FormControlError,
    FormControlErrorIcon,
    FormControlErrorText,
} from "~/components/ui/form-control";
import { AlertCircleIcon } from "~/components/ui/icon";
import { Input, InputField } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { resolveVideoAndJump } from "~/utils/format";
import log from "~/utils/logger";

const IconQrcodeScan = createIcon(MaterialCommunityIcons, "qrcode-scan");
const IconHistory = createIcon(FontAwesome5, "history");

const TabIndexScreen: React.FC = () => {
    const [value, setValue] = useState("");
    const [inputError, setInputError] = useState(false);

    const { width } = useWindowDimensions();
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

    console.log({ width });

    return (
        <Box
            style={{
                alignItems: "stretch",
                height: "100%",
                paddingLeft: insets.left,
                paddingRight: insets.right,
                paddingTop: insets.top,
            }}
        >
            <Box
                style={{
                    paddingTop: 96,
                    paddingBottom: 48,
                    alignItems: "center",
                }}
            >
                {fontsLoaded ? (
                    <Text
                        style={{
                            fontSize: 32,
                            fontFamily: "Poppins_700Bold",
                            color: "$primary500",
                            height: 48,
                            lineHeight: 48,
                        }}
                    >
                        BILISOUND
                    </Text>
                ) : null}
            </Box>
            <Box style={{ paddingHorizontal: 16, alignItems: "center" }}>
                <FormControl
                    isDisabled={false}
                    isInvalid={inputError}
                    isReadOnly={false}
                    isRequired={false}
                    size="md"
                    style={{
                        width: width >= 592 ? 560 : "100%",
                        backgroundColor: "transparent",
                    }}
                >
                    <Input
                        variant="outline"
                        size="md"
                        style={{
                            width: "100%",
                            height: 48,
                            borderRadius: 8,
                        }}
                    >
                        <InputField
                            placeholder="粘贴完整链接或带前缀 ID 至此"
                            style={{
                                fontSize: 16,
                            }}
                            value={value}
                            onChangeText={nextValue => {
                                setInputError(false);
                                setValue(nextValue);
                            }}
                            onSubmitEditing={handleSubmitEditing}
                        />
                    </Input>
                    <FormControlError>
                        <FormControlErrorIcon as={AlertCircleIcon} />
                        <FormControlErrorText>请输入合法的地址或 ID</FormControlErrorText>
                    </FormControlError>
                </FormControl>
            </Box>
            <Box
                style={{
                    position: "absolute",
                    padding: 8,
                    right: 0,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    top: insets.top,
                }}
            >
                {Platform.OS === "web" ? null : (
                    <ButtonTitleBar
                        label="扫描二维码"
                        Icon={IconQrcodeScan}
                        iconSize={20}
                        theme="transparent"
                        onPress={() => router.push("/barcode")}
                    />
                )}
                <ButtonTitleBar
                    label="历史记录"
                    Icon={IconHistory}
                    iconSize={20}
                    theme="transparent"
                    onPress={() => router.push("/history")}
                />
            </Box>
            <View style={{ flex: 1 }} />
        </Box>
    );
};

export default TabIndexScreen;
