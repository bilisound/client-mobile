import { FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Poppins_700Bold } from "@expo-google-fonts/poppins";
import { useFonts } from "expo-font";
import { router } from "expo-router";
import React, { useState } from "react";
import { Platform, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStyles } from "react-native-unistyles";

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
import { Input, InputField, InputSlot } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { resolveVideoAndJump } from "~/utils/format";
import log from "~/utils/logger";

const IconQrcodeScan = createIcon(MaterialCommunityIcons, "qrcode-scan");
const IconHistory = createIcon(FontAwesome5, "history");
const IconClear = createIcon(Ionicons, "close");

const TabIndexScreen: React.FC = () => {
    const [value, setValue] = useState("");
    const [inputError, setInputError] = useState(false);

    const { width } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const { theme } = useStyles();

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

    return (
        <Box
            className="items-stretch h-full"
            style={{
                paddingLeft: insets.left,
                paddingRight: insets.right,
                paddingTop: insets.top,
            }}
        >
            <Box className="pt-24 pb-12 items-center">
                {fontsLoaded ? (
                    <Text
                        className="text-3xl text-primary-500 h-12 leading-12"
                        style={{
                            fontFamily: "Poppins_700Bold",
                        }}
                    >
                        BILISOUND
                    </Text>
                ) : null}
            </Box>
            <Box className="px-4 items-center">
                <FormControl
                    isDisabled={false}
                    isInvalid={inputError}
                    isReadOnly={false}
                    isRequired={false}
                    size="md"
                    className={`${width >= 592 ? "w-[560px]" : "w-full"} bg-transparent`}
                >
                    <Input variant="outline" size="md" className="w-full h-12 rounded-lg">
                        <InputField
                            placeholder="粘贴完整链接或带前缀 ID 至此"
                            className="text-base"
                            value={value}
                            onChangeText={nextValue => {
                                setInputError(false);
                                setValue(nextValue);
                            }}
                            onSubmitEditing={handleSubmitEditing}
                        />
                        {value && (
                            <InputSlot
                                className="mr-3 items-center justify-center"
                                onPress={() => {
                                    setInputError(false);
                                    setValue("");
                                }}
                            >
                                <IconClear
                                    size={24}
                                    color={theme.colorTokens.buttonOutlineForeground("primary", "default")}
                                />
                            </InputSlot>
                        )}
                    </Input>
                    <FormControlError>
                        <FormControlErrorIcon as={AlertCircleIcon} />
                        <FormControlErrorText size="sm">请输入合法的地址或 ID</FormControlErrorText>
                    </FormControlError>
                </FormControl>
            </Box>
            <Box
                className="absolute p-2 right-0 flex-row items-center gap-1"
                style={{
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
            <View className="flex-1" />
        </Box>
    );
};

export default TabIndexScreen;
