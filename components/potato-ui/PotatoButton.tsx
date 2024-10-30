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
            sm: "h-[2.25rem] px-[1.125rem]",
            md: "h-[2.5rem] px-[1.25rem]",
        },
    },
    compoundVariants: [
        {
            size: "sm",
            iconOnly: true,
            className: "h-[2.25rem] w-[2.25rem] px-[unset]",
        },
        {
            size: "md",
            iconOnly: true,
            className: "h-[2.5rem] w-[2.5rem] px-[unset]",
        },
        {
            variant: "outline",
            size: "sm",
            className: "h-[2.1875rem] px-[1.0625rem]",
        },
        {
            variant: "outline",
            size: "md",
            className: "h-[2.4375rem] px-[1.1875rem]",
        },
        {
            variant: "outline",
            size: "sm",
            iconOnly: true,
            className: "h-[2.1875rem] w-[2.1875rem] px-[unset]",
        },
        {
            variant: "outline",
            size: "md",
            iconOnly: true,
            className: "h-[2.4375rem] w-[2.4375rem] px-[unset]",
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
