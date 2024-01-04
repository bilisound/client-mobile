import { useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useState } from "react";
import { useFonts } from "expo-font";
import { Poppins_700Bold } from "@expo-google-fonts/poppins";
import { router } from "expo-router";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import {
    AlertCircleIcon,
    Box,
    FormControl,
    FormControlError,
    FormControlErrorIcon,
    FormControlErrorText,
    Pressable,
    InputField,
    Text,
    Input,
} from "@gluestack-ui/themed";
import { resolveVideo } from "../../utils/format";
import useCommonColors from "../../hooks/useCommonColors";
import { COMMON_FRAME_BUTTON_STYLE } from "../../constants/style";
import log from "../../utils/logger";

const TabIndexScreen: React.FC = () => {
    const [value, setValue] = useState("");
    const [inputError, setInputError] = useState(false);

    const { width } = useWindowDimensions();
    const { primaryColor } = useCommonColors();
    const insets = useSafeAreaInsets();
    const [fontsLoaded] = useFonts({
        Poppins_700Bold,
    });

    return (
        <Box
            sx={{
                alignItems: "center",
                backgroundColor: "$backgroundLight",
                _dark: {
                    backgroundColor: "$backgroundDark",
                },
                height: "100%",
                paddingLeft: insets.left,
                paddingRight: insets.right,
                paddingTop: insets.top,
            }}
        >
            <Box
                sx={{
                    paddingTop: 96,
                    paddingBottom: 48,
                }}
            >
                {fontsLoaded ? (
                    <Text
                        sx={{
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
            <Box px={16}>
                <FormControl
                    isDisabled={false}
                    isInvalid={inputError}
                    isReadOnly={false}
                    isRequired={false}
                    size="md"
                    sx={{
                        width: width >= 592 ? 560 : "100%",
                        backgroundColor: "transparent",
                    }}
                >
                    <Input
                        variant="outline"
                        size="md"
                        w="100%"
                        h="$12"
                        sx={{
                            borderRadius: 8,
                        }}
                    >
                        <InputField
                            defaultValue=""
                            placeholder="粘贴完整链接或带前缀 ID 至此"
                            sx={{
                                fontSize: 16,
                            }}
                            value={value}
                            onChangeText={(nextValue) => {
                                setInputError(false);
                                setValue(nextValue);
                            }}
                            onSubmitEditing={async (e) => {
                                log.info("用户执行查询操作");
                                log.debug(`查询关键词: ${value}`);
                                try {
                                    const parseResult = await resolveVideo(value);
                                    log.debug(`关键词解析结果: ${parseResult}`);
                                    router.push(`/query/${parseResult}`);
                                } catch (error) {
                                    setInputError(true);
                                    log.info(`无法执行搜索操作，因此不响应用户提交。原因：${error}`);
                                }
                            }}
                        />
                    </Input>
                    <FormControlError>
                        <FormControlErrorIcon as={AlertCircleIcon} />
                        <FormControlErrorText>请输入合法的地址或 ID</FormControlErrorText>
                    </FormControlError>
                </FormControl>
            </Box>
            <Box
                sx={{
                    position: "absolute",
                    padding: 8,
                    right: 0,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    top: insets.top,
                }}
            >
                <Pressable sx={COMMON_FRAME_BUTTON_STYLE} onPress={() => router.push("/barcode")}>
                    <MaterialCommunityIcons name="qrcode-scan" size={20} color={primaryColor} />
                </Pressable>
                <Pressable sx={COMMON_FRAME_BUTTON_STYLE} onPress={() => router.push("/history")}>
                    <FontAwesome5 name="history" size={20} color={primaryColor} />
                </Pressable>
            </Box>
            <View style={{ flex: 1 }} />
        </Box>
    );
};

export default TabIndexScreen;
