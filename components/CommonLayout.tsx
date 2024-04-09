import { Ionicons } from "@expo/vector-icons";
import { Box, Pressable, Text } from "@gluestack-ui/themed";
import { router } from "expo-router";
import React, { PropsWithChildren } from "react";
import { StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { COMMON_FRAME_BUTTON_STYLE, COMMON_FRAME_SOLID_BUTTON_STYLE } from "../constants/style";
import useCommonColors from "../hooks/useCommonColors";

export interface CommonFrameNewProps {
    title?: string;
    titleBarTheme?: "transparent" | "solid";
    extendToBottom?: boolean;
    leftAccessories?: React.ReactNode | "backButton";
    rightAccessories?: React.ReactNode;
}

const CommonLayout: React.FC<PropsWithChildren<CommonFrameNewProps>> = ({
    children,
    title,
    titleBarTheme = "solid",
    extendToBottom,
    leftAccessories,
    rightAccessories,
}) => {
    const edgeInsets = useSafeAreaInsets();
    const { textBasicColor } = useCommonColors();
    return (
        <Box
            sx={{
                height: "100%",
            }}
        >
            {titleBarTheme === "solid" ? <StatusBar barStyle="light-content" showHideTransition="none" /> : null}
            <Box
                sx={{
                    paddingTop: edgeInsets.top,
                    flex: 0,
                    backgroundColor: titleBarTheme === "solid" ? "$primary500" : "transparent",
                    _dark: {
                        backgroundColor: titleBarTheme === "solid" ? "$primary900" : "transparent",
                    },
                }}
            >
                <Box
                    style={{
                        height: 56,
                        padding: 8,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Text
                        sx={{
                            fontSize: 16,
                            fontWeight: "700",
                            color: titleBarTheme === "solid" ? "#fff" : textBasicColor,
                        }}
                    >
                        {title}
                    </Text>
                    {leftAccessories ? (
                        <Box
                            sx={{
                                position: "absolute",
                                padding: 8,
                                left: 0,
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 4,
                            }}
                        >
                            {leftAccessories === "backButton" ? (
                                <Pressable
                                    sx={
                                        titleBarTheme === "solid"
                                            ? COMMON_FRAME_SOLID_BUTTON_STYLE
                                            : COMMON_FRAME_BUTTON_STYLE
                                    }
                                    onPress={() => router.back()}
                                >
                                    <Ionicons
                                        name="arrow-back"
                                        size={24}
                                        color={titleBarTheme === "solid" ? "#fff" : textBasicColor}
                                    />
                                </Pressable>
                            ) : (
                                leftAccessories
                            )}
                        </Box>
                    ) : null}
                    {rightAccessories ? (
                        <Box
                            sx={{
                                position: "absolute",
                                padding: 8,
                                right: 0,
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 4,
                            }}
                        >
                            {rightAccessories}
                        </Box>
                    ) : null}
                </Box>
            </Box>
            <Box
                sx={{
                    paddingLeft: edgeInsets.left,
                    paddingRight: edgeInsets.right,
                    paddingBottom: extendToBottom ? 0 : edgeInsets.bottom,
                    flex: 1,
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default CommonLayout;
