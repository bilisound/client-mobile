import omit from "lodash/omit";
import { remapProps } from "nativewind";
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
import { ThemeColorPaletteKeys } from "~/config/palettes";

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
    color?: ThemeColorPaletteKeys;
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
    // const pressState = useSharedValue<0 | 1 | 2>(0);
    const [pressState, setPressState] = useState<0 | 1 | 2>(0);
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

    const bg = disabled ? disabledBackground : normalBackground;
    const animatedOuterBackgroundStyle = {
        backgroundColor: pressState === 2 ? activeBackground : bg,
    };

    const animatedOuterBorderStyle = {
        borderColor: disabled ? disabledBorder : normalBorder,
        borderWidth: 1,
    };

    const animatedTextStyle = {
        color: disabled ? disabledForeground : normalForeground,
    };

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
            <Pressable
                onPressIn={event => {
                    if (!isAndroid) {
                        setPressState(2);
                    }
                    props.onPressIn?.(event);
                }}
                onPressOut={event => {
                    if (!isAndroid) {
                        setPressState(0);
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
                        width,
                        height,
                        paddingHorizontal,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 8,
                        // backgroundColor: status.pressed && !isAndroid ? activeBackground : bg,
                    },
                    props.style,
                ]}
                {...omit(props, ["color", "rounded", "variant", "Icon", "iconSize", "children", "style", "outerStyle"])}
            >
                {typeof Icon === "function" ? <Icon size={props.iconSize ?? 20} style={animatedTextStyle} /> : null}
                {Icon === "loading" ? (
                    <ActivityIndicator
                        style={{ width: props.iconSize ?? 22, height: props.iconSize ?? 22 }}
                        color={disabled ? disabledForeground : normalForeground}
                    />
                ) : null}
                {iconOnly ? null : (
                    <Text style={[animatedTextStyle, { fontWeight: "600" }]}>{handleTextEffect(children)}</Text>
                )}
            </Pressable>
        </View>
    );
}

remapProps(PotatoButton, {
    className: "style",
    outerClassName: "outerStyle",
});

export default PotatoButton;
