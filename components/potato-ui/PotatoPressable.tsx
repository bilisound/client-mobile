import omit from "lodash/omit";
import { useState, forwardRef } from "react";
import {
    Pressable as NativePressable,
    StyleProp,
    ViewStyle,
    PressableProps as NativePressableProps,
    Platform,
    View,
} from "react-native";
import { twMerge } from "tailwind-merge";

import { useRawThemeValues } from "~/components/ui/gluestack-ui-provider/theme";

export interface PressableProps extends NativePressableProps {
    style?: StyleProp<ViewStyle>;
    outerStyle?: StyleProp<ViewStyle>;
    className?: string;
    outerClassName?: string;
    hoverClassName?: string;
    pressedClassName?: string;
    rippleColor?: string;
}

const isAndroid = Platform.OS === "android";

const PotatoPressable = forwardRef<View, PressableProps>((props, ref) => {
    const { colorValue } = useRawThemeValues();

    const [isHover, setIsHover] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    let className = props.className;
    if (isHover) {
        className = twMerge(className, props.hoverClassName || "bg-background-50");
    }
    if (isPressed) {
        className = twMerge(className, props.pressedClassName || "bg-background-100");
    }

    return (
        <View ref={ref} className={props.outerClassName} style={props.outerStyle}>
            <NativePressable
                onPressIn={event => {
                    if (!isAndroid) {
                        setIsPressed(true);
                    }
                    props.onPressIn?.(event);
                }}
                onPressOut={event => {
                    if (!isAndroid) {
                        setIsPressed(false);
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
                android_ripple={{
                    color: props.rippleColor || colorValue("--color-background-100"),
                }}
                {...omit(props, ["onPressIn", "onPressOut", "outerStyle", "outerClassName"])}
                className={className}
            >
                {props.children}
            </NativePressable>
        </View>
    );
});

export default PotatoPressable;
