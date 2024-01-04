import React, { PropsWithChildren } from "react";
import { Box, Text } from "@gluestack-ui/themed";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import useCommonColors from "../hooks/useCommonColors";

export interface CommonFrameNewProps {
    title?: string;
    titleBarTheme?: "transparent" | "solid";
    extendToBottom?: boolean;
    leftAccessories?: React.ReactNode;
    rightAccessories?: React.ReactNode;
}

const CommonFrameNew: React.FC<PropsWithChildren<CommonFrameNewProps>> = ({
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
                backgroundColor: "$backgroundLight",
                _dark: {
                    backgroundColor: "$backgroundDark",
                },
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
                            {leftAccessories}
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

export default CommonFrameNew;
