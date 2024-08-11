import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { PropsWithChildren } from "react";
import { Platform, Pressable, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useStyles } from "react-native-unistyles";

import { ThemeColorPaletteKeys } from "~/config/palettes";

const AnimatedIcon = Animated.createAnimatedComponent(MaterialCommunityIcons);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const isAndroid = Platform.OS === "android";

export interface ButtonProps {
    color?: ThemeColorPaletteKeys;
    disabled?: boolean;
    rounded?: boolean;
}

export default function Button({
    color = "primary",
    disabled = false,
    rounded = false,
}: PropsWithChildren<ButtonProps>) {
    // 0 - default, 1 - hover (unused now), 2 - active
    const pressState = useSharedValue<0 | 1 | 2>(0);
    const { theme } = useStyles();

    const normalBackground = theme.colorTokens.buttonBackground(color, "default");
    const activeBackground = theme.colorTokens.buttonBackground(color, "active");
    const disabledBackground = theme.colorTokens.buttonBackground(color, "disabled");

    const normalForeground = theme.colorTokens.buttonForeground(color, "default");
    const activeForeground = theme.colorTokens.buttonForeground(color, "active");
    const disabledForeground = theme.colorTokens.buttonForeground(color, "disabled");

    const animatedOuterStyle = useAnimatedStyle(() => {
        let bg = disabled ? disabledBackground : normalBackground;
        if (pressState.value === 2) {
            bg = activeBackground;
        }
        console.log(bg);
        return {
            backgroundColor: withTiming(bg, {
                duration: pressState.value === 2 ? 0 : 150,
            }),
        };
    });

    const animatedTextStyle = useAnimatedStyle(() => {
        let fg = disabled ? disabledForeground : normalForeground;
        if (pressState.value === 2) {
            fg = activeForeground;
        }
        return {
            color: withTiming(fg, {
                duration: pressState.value === 2 ? 0 : 150,
            }),
        };
    });

    return (
        <View
            style={{
                borderRadius: rounded ? theme.sizes.radiusButtonFull : theme.sizes.radiusButton,
                overflow: "hidden",
            }}
        >
            <AnimatedPressable
                onPressIn={() => {
                    pressState.value = 2;
                }}
                onPressOut={() => {
                    pressState.value = 0;
                }}
                android_ripple={{
                    color: activeBackground,
                }}
                style={[
                    isAndroid
                        ? {
                              backgroundColor: disabled ? disabledBackground : normalBackground,
                          }
                        : animatedOuterStyle,
                    {
                        height: 40,
                        paddingLeft: 20,
                        paddingRight: 20,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 8,
                    },
                ]}
            >
                <AnimatedIcon name="playlist-music" size={20} style={animatedTextStyle} />
                <Animated.Text style={[animatedTextStyle, { fontWeight: "600" }]}>测试文本</Animated.Text>
            </AnimatedPressable>
        </View>
    );
}
