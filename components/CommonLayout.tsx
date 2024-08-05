import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { PropsWithChildren } from "react";
import { Pressable, StatusBar, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text } from "tamagui";

import { COMMON_FRAME_BUTTON_STYLE, COMMON_FRAME_SOLID_BUTTON_STYLE } from "~/constants/style";
import useCommonColors from "~/hooks/useCommonColors";

export interface CommonFrameNewProps {
    title?: string;
    titleBarTheme?: "transparent" | "solid";
    solidColor?: string;
    solidScheme?: "dark" | "light";
    bgColor?: string;
    extendToBottom?: boolean;
    leftAccessories?: React.ReactNode | "backButton";
    rightAccessories?: React.ReactNode;
}

const CommonLayout: React.FC<PropsWithChildren<CommonFrameNewProps>> = ({
    children,
    title,
    titleBarTheme = "solid",
    solidColor,
    solidScheme = "dark",
    bgColor = "transparent",
    extendToBottom,
    leftAccessories,
    rightAccessories,
}) => {
    const edgeInsets = useSafeAreaInsets();
    const { textBasicColor } = useCommonColors();
    const colorMode = useColorScheme();

    const computedSolidColor = solidColor || (colorMode === "dark" ? "#0c554d" : "#00ba9d");
    const textSolidColorDark = "#fff";
    const textSolidColorLight = "#525252";
    const textSolidColor = solidScheme === "dark" ? textSolidColorDark : textSolidColorLight;

    return (
        <View height="100%" backgroundColor={bgColor}>
            {titleBarTheme === "solid" && solidScheme === "dark" ? (
                <StatusBar barStyle="light-content" showHideTransition="none" />
            ) : null}
            <View
                paddingTop={edgeInsets.top}
                flex={0}
                flexBasis="auto"
                backgroundColor={titleBarTheme === "solid" ? computedSolidColor : "transparent"}
            >
                <View height={56} padding={8} alignItems="center" justifyContent="center">
                    <Text
                        fontSize={16}
                        fontWeight="700"
                        color={titleBarTheme === "solid" ? textSolidColor : textBasicColor}
                    >
                        {title}
                    </Text>
                    {leftAccessories ? (
                        <View position="absolute" padding={8} left={0} flexDirection="row" alignItems="center" gap={4}>
                            {leftAccessories === "backButton" ? (
                                <Pressable
                                    aria-label="返回"
                                    style={
                                        titleBarTheme === "solid"
                                            ? COMMON_FRAME_SOLID_BUTTON_STYLE
                                            : COMMON_FRAME_BUTTON_STYLE
                                    }
                                    onPress={() => router.back()}
                                >
                                    <Ionicons
                                        name="arrow-back"
                                        size={24}
                                        color={titleBarTheme === "solid" ? textSolidColor : textBasicColor}
                                    />
                                </Pressable>
                            ) : (
                                leftAccessories
                            )}
                        </View>
                    ) : null}
                    {rightAccessories ? (
                        <View position="absolute" padding={8} right={0} flexDirection="row" alignItems="center" gap={4}>
                            {rightAccessories}
                        </View>
                    ) : null}
                </View>
            </View>
            <View
                paddingLeft={edgeInsets.left}
                paddingRight={edgeInsets.right}
                paddingBottom={extendToBottom ? 0 : edgeInsets.bottom}
                flex={1}
            >
                {children}
            </View>
        </View>
    );
};

export default CommonLayout;
