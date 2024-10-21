import omit from "lodash/omit";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Platform,
    Pressable,
    PressableProps as NativePressableProps,
    StyleProp,
    View,
    ViewStyle,
    Text,
} from "react-native";
import { useStyles } from "react-native-unistyles";

import { IconComponent } from "~/components/potato-ui/utils/icon";
import { ColorTypes } from "~/components/ui/gluestack-ui-provider/config";
import { useRawThemeValues } from "~/components/ui/gluestack-ui-provider/theme";

const isAndroid = Platform.OS === "android";
// const isAndroid = false;

const sizes = {
    sm: { h: 36, px: 18 },
    md: { h: 40, px: 20 },
};

function handleTextEffect(input: string) {
    const texts = Array.from(input);
    if (texts.length > 2) {
        return input;
    }
    return texts.join(" ");
}

export interface ButtonProps extends NativePressableProps {
    color?: ColorTypes;
    size?: keyof typeof sizes;
    disabled?: boolean;
    rounded?: boolean;
    iconOnly?: boolean;
    variant?: "solid" | "outline" | "ghost";
    Icon?: IconComponent | "loading";
    iconSize?: number;
    children?: string;
    style?: StyleProp<ViewStyle>;
    outerStyle?: StyleProp<ViewStyle>;
    className?: string;
    outerClassName?: string;
}

function PotatoButton(props: ButtonProps) {
    const {
        color = "primary",
        disabled = false,
        rounded = false,
        iconOnly = false,
        variant = "solid",
        Icon,
        children = "",
        size = "md",
    } = props;

    // 0 - default, 1 - hover (unused now), 2 - active
    const [isHover, setIsHover] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const { theme } = useStyles();
    const { colorValue } = useRawThemeValues();

    let normalBackground = colorValue(`--color-${color}-500`);
    let hoverBackground = colorValue(`--color-${color}-600`);
    let activeBackground = colorValue(`--color-${color}-700`);

    let normalForeground = colorValue(`--color-typography-0`);

    let borderColor = colorValue(`--color-${color}-500`);

    if (variant === "outline" || variant === "ghost") {
        normalBackground = "transparent";
        hoverBackground = colorValue(`--color-${color}-50`);
        activeBackground = colorValue(`--color-${color}-100`);

        normalForeground = colorValue(`--color-${color}-500`);

        if (isHover) {
            borderColor = colorValue(`--color-${color}-600`);
            normalForeground = colorValue(`--color-${color}-600`);
        }
        if (isActive && Platform.OS !== "android") {
            borderColor = colorValue(`--color-${color}-700`);
            normalForeground = colorValue(`--color-${color}-700`);
        }
    }

    let backgroundColor = normalBackground;
    if (isHover) {
        backgroundColor = hoverBackground;
    }
    if (isActive && Platform.OS !== "android") {
        backgroundColor = activeBackground;
    }

    // 高度或左右内间距解析
    let width: number | undefined = undefined;
    const height = variant === "outline" ? sizes[size].h - 2 : sizes[size].h;
    let paddingHorizontal: number | undefined = variant === "outline" ? sizes[size].px - 2 : sizes[size].px;

    if (iconOnly) {
        // noinspection JSSuspiciousNameCombination
        width = height;
        paddingHorizontal = undefined;
    }

    return (
        <View
            className="overflow-hidden"
            style={[
                {
                    backgroundColor,
                },
                variant === "outline"
                    ? {
                          borderColor,
                          borderWidth: 1,
                      }
                    : {},
                {
                    borderRadius: rounded ? theme.sizes.radiusButtonFull : theme.sizes.radiusButton,
                    opacity: disabled ? 0.5 : 1,
                },
                props.outerStyle,
            ]}
        >
            <Pressable
                role="button"
                onPressIn={event => {
                    if (!isAndroid) {
                        setIsActive(true);
                    }
                    props.onPressIn?.(event);
                }}
                onPressOut={event => {
                    if (!isAndroid) {
                        setIsActive(false);
                    }
                    props.onPressOut?.(event);
                }}
                onPointerEnter={event => {
                    setIsHover(true);
                    props.onPointerEnter?.(event);
                }}
                onPointerLeave={event => {
                    setIsHover(false);
                    props.onPointerLeave?.(event);
                }}
                android_ripple={
                    disabled || !isAndroid
                        ? undefined
                        : {
                              color: activeBackground,
                          }
                }
                className="flex-row justify-center items-center gap-2"
                style={[
                    {
                        width,
                        height,
                        paddingHorizontal,
                    },
                    props.style,
                ]}
                {...omit(props, ["color", "rounded", "variant", "Icon", "iconSize", "children", "style", "outerStyle"])}
            >
                {typeof Icon === "function" ? (
                    <Icon
                        size={props.iconSize ?? 20}
                        style={{
                            color: normalForeground,
                        }}
                    />
                ) : null}
                {Icon === "loading" ? (
                    <ActivityIndicator
                        style={{ width: props.iconSize ?? 22, height: props.iconSize ?? 22 }}
                        color={normalForeground}
                    />
                ) : null}
                {iconOnly ? null : (
                    <Text
                        className="font-semibold"
                        style={[
                            {
                                color: normalForeground,
                            },
                        ]}
                    >
                        {handleTextEffect(children)}
                    </Text>
                )}
            </Pressable>
        </View>
    );
}

export default PotatoButton;
