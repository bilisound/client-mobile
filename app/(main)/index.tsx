import { Text } from "~/components/ui/text";
import { useTabSafeAreaInsets } from "~/hooks/useTabSafeAreaInsets";
import { View } from "react-native";
import { Layout, LayoutButton } from "~/components/layout";
import { useIsNarrowWidth } from "~/hooks/useIsNarrowWidth";
import { useState } from "react";
import { resolveVideoAndJump } from "~/utils/format";
import {
    FormControl,
    FormControlError,
    FormControlErrorIcon,
    FormControlErrorText,
} from "~/components/ui/form-control";
import { Input, InputField, InputSlot } from "~/components/ui/input";
import log from "~/utils/logger";
import { AlertCircleIcon } from "~/components/ui/icon";
import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { router } from "expo-router";

export default function MainScreen() {
    const edgeInsets = useTabSafeAreaInsets();
    const isNarrowWidth = useIsNarrowWidth();

    const [value, setValue] = useState("");
    const [inputError, setInputError] = useState(false);

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
        <Layout
            edgeInsets={edgeInsets}
            rightAccessories={
                <>
                    <LayoutButton iconName={"uil:qrcode-scan"} aria-label={"扫描二维码"} iconSize={22} />
                    <LayoutButton
                        iconName={"fa6-solid:clock-rotate-left"}
                        aria-label={"历史记录"}
                        onPress={() => {
                            router.navigate("/history");
                        }}
                    />
                </>
            }
        >
            <View className={`${isNarrowWidth ? "pt-6 pb-8" : "pt-10 pb-12"} items-center`}>
                <Text
                    className="text-3xl text-primary-500 dark:text-primary-400 h-12 leading-12"
                    style={{
                        fontFamily: "Poppins_700Bold",
                    }}
                >
                    BILISOUND
                </Text>
            </View>
            <View className="px-4 items-center">
                <FormControl
                    isDisabled={false}
                    isInvalid={inputError}
                    isReadOnly={false}
                    isRequired={false}
                    size="md"
                    className="w-full sm:w-[560px] bg-transparent"
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
                            <View className={"flex-row items-center"}>
                                <InputSlot
                                    className="h-12 px-3 items-center justify-center"
                                    onPress={() => {
                                        setInputError(false);
                                        setValue("");
                                    }}
                                >
                                    <FontAwesome6 name="xmark" size={20} className="color-typography-700" />
                                </InputSlot>
                                <View className={"w-[1px] h-6 bg-background-100"}></View>
                                <InputSlot
                                    className="h-12 px-3 items-center justify-center"
                                    onPress={() => {
                                        handleSubmitEditing();
                                    }}
                                >
                                    <Text className={"text-accent-500"}>查询</Text>
                                </InputSlot>
                            </View>
                        )}
                    </Input>
                    <FormControlError>
                        <FormControlErrorIcon as={AlertCircleIcon} />
                        <FormControlErrorText size="sm">请输入合法的地址或 ID</FormControlErrorText>
                    </FormControlError>
                </FormControl>
            </View>
        </Layout>
    );
}
