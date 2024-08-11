import omit from "lodash/omit";
import React from "react";
import { Platform, Pressable, PressableProps as NativePressableProps, StyleProp, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useStyles } from "react-native-unistyles";

import { IconComponent } from "~/components/ui/utils/icon";
import { ThemeColorPaletteKeys } from "~/config/palettes";

// const AnimatedIcon = Animated.createAnimatedComponent(MaterialCommunityIcons);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const isAndroid = Platform.OS === "android";
// const isAndroid = false;

export interface ButtonProps extends NativePressableProps {
    color?: ThemeColorPaletteKeys;
    disabled?: boolean;
    rounded?: boolean;
    variant?: "solid" | "outline" | "ghost";
    Icon?: IconComponent;
    children?: string;
    style?: StyleProp<ViewStyle>;
    outerStyle?: StyleProp<ViewStyle>;
}

export default function Button(props: ButtonProps) {
    const { color = "primary", disabled = false, rounded = false, variant = "solid", Icon, children = "按钮" } = props;

    // 0 - default, 1 - hover (unused now), 2 - active
    const pressState = useSharedValue<0 | 1 | 2>(0);
    const { theme } = useStyles();

    let normalBackground = theme.colorTokens.buttonBackground(color, "default");
    let activeBackground = theme.colorTokens.buttonBackground(color, "active");
    let disabledBackground = theme.colorTokens.buttonBackground(color, "disabled");

    let normalForeground = theme.colorTokens.buttonForeground(color, "default");
    // let activeForeground = theme.colorTokens.buttonForeground(color, "active");
    let disabledForeground = theme.colorTokens.buttonForeground(color, "disabled");

    const normalBorder = theme.colorTokens.buttonOutlineBorder(color, "default");
    // const activeBorder = theme.colorTokens.buttonOutlineBorder(color, "active");
    const disabledBorder = theme.colorTokens.buttonOutlineBorder(color, "disabled");

    if (variant === "outline" || variant === "ghost") {
        normalBackground = theme.colorTokens.buttonOutlineBackground(color, "default");
        activeBackground = theme.colorTokens.buttonOutlineBackground(color, "active");
        disabledBackground = theme.colorTokens.buttonOutlineBackground(color, "disabled");

        normalForeground = theme.colorTokens.buttonOutlineForeground(color, "default");
        // activeForeground = theme.colorTokens.buttonOutlineForeground(color, "active");
        disabledForeground = theme.colorTokens.buttonOutlineForeground(color, "disabled");
    }

    const animatedOuterBackgroundStyle = useAnimatedStyle(() => {
        let bg = disabled ? disabledBackground : normalBackground;
        if (pressState.value === 2) {
            bg = activeBackground;
        }
        return {
            backgroundColor: withTiming(bg, {
                duration: pressState.value === 2 ? 0 : 150,
            }),
        };
    });

    const animatedOuterBorderStyle = {
        borderColor: disabled ? disabledBorder : normalBorder,
        borderWidth: 1,
    };

    const animatedTextStyle = {
        color: disabled ? disabledForeground : normalForeground,
    };

    // 因为目前主题定义的 border 颜色始终是一致的，所以这里暂时没必要做动画处理
    /*const animatedOuterBorderStyle = useAnimatedStyle(() => {
        let bg = disabled ? disabledBorder : normalBorder;
        if (pressState.value === 2) {
            bg = activeBorder;
        }
        return {
            borderWidth: 1,
            borderColor: withTiming(bg, {
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
    });*/

    console.log(disabled ? disabledBackground : normalBackground);

    return (
        <Animated.View
            style={[
                isAndroid
                    ? {
                          backgroundColor: disabled ? disabledBackground : normalBackground,
                      }
                    : animatedOuterBackgroundStyle,
                variant === "outline" ? animatedOuterBorderStyle : {},
                {
                    borderRadius: rounded ? theme.sizes.radiusButtonFull : theme.sizes.radiusButton,
                    overflow: "hidden",
                    opacity: disabled ? 0.5 : 1,
                },
                props.outerStyle,
            ]}
        >
            <AnimatedPressable
                onPressIn={event => {
                    if (!isAndroid && !disabled) {
                        pressState.value = 2;
                    }
                    props.onPressIn?.(event);
                }}
                onPressOut={event => {
                    if (!isAndroid && !disabled) {
                        pressState.value = 0;
                    }
                    props.onPressOut?.(event);
                }}
                android_ripple={
                    disabled || !isAndroid
                        ? undefined
                        : {
                              color: activeBackground,
                          }
                }
                style={[
                    {
                        height: variant === "outline" ? 38 : 40,
                        // paddingLeft: variant === "outline" ? 18 : 20,
                        // paddingRight: variant === "outline" ? 18 : 20,
                        paddingHorizontal: variant === "outline" ? 18 : 20,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 8,
                    },
                    props.style,
                ]}
                {...omit(props, ["color", "disabled", "rounded", "variant", "Icon", "children", "style", "outerStyle"])}
            >
                {Icon ? <Icon size={20} style={animatedTextStyle} /> : null}
                <Animated.Text style={[animatedTextStyle, { fontWeight: "600" }]}>{children}</Animated.Text>
            </AnimatedPressable>
        </Animated.View>
    );
}
