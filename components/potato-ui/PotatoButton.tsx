import { tva } from "@gluestack-ui/nativewind-utils/tva";
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
import { twMerge } from "tailwind-merge";

import { IconComponent } from "~/components/potato-ui/utils/icon";
import { ColorTypes } from "~/components/ui/gluestack-ui-provider/config";
import { useRawThemeValues } from "~/components/ui/gluestack-ui-provider/theme";

const isAndroid = Platform.OS === "android";

function handleTextEffect(input: string) {
    const texts = Array.from(input);
    if (texts.length > 2) {
        return input;
    }
    return texts.join(" ");
}

const buttonOuterStyles = tva({
    base: "overflow-hidden",
    variants: {
        variant: {
            solid: "",
            outline: "border",
            ghost: "",
        },
        disabled: {
            true: "opacity-50",
            false: "",
        },
        rounded: {
            true: "rounded-full",
            false: "rounded-lg",
        },
    },
});

const buttonStyles = tva({
    base: "flex-row justify-center items-center gap-2",
    variants: {
        variant: {
            solid: "",
            outline: "",
            ghost: "",
        },
        iconOnly: {
            true: "",
            false: "",
        },
        size: {
            sm: "h-[36px] px-[18px]",
            md: "h-[40px] px-[20px]",
        },
    },
    compoundVariants: [
        {
            size: "sm",
            iconOnly: true,
            className: "h-[36px] w-[36px] px-[unset]",
        },
        {
            size: "md",
            iconOnly: true,
            className: "h-[40px] w-[40px] px-[unset]",
        },
        {
            variant: "outline",
            size: "sm",
            className: "h-[35px] px-[17px]",
        },
        {
            variant: "outline",
            size: "md",
            className: "h-[39px] px-[19px]",
        },
        {
            variant: "outline",
            size: "sm",
            iconOnly: true,
            className: "h-[35px] w-[35px] px-[unset]",
        },
        {
            variant: "outline",
            size: "md",
            iconOnly: true,
            className: "h-[39px] w-[39px] px-[unset]",
        },
    ],
});

export interface ButtonProps extends NativePressableProps {
    color?: ColorTypes;
    size?: "sm" | "md";
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

    const [isHover, setIsHover] = useState(false);
    const [isActive, setIsActive] = useState(false);
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

    return (
        <View
            className={buttonOuterStyles({
                variant,
                disabled,
                rounded,
            })}
            style={[
                {
                    backgroundColor,
                    borderColor: variant === "outline" ? borderColor : undefined,
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
                {...omit(props, ["color", "rounded", "variant", "Icon", "iconSize", "children", "style", "outerStyle"])}
                className={twMerge(
                    buttonStyles({
                        size,
                        variant,
                        iconOnly,
                    }),
                    props.className,
                )}
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
