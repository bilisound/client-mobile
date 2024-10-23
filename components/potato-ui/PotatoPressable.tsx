import omit from "lodash/omit";
import { useState, forwardRef } from "react";
import {
    Pressable as NativePressable,
    StyleProp,
    ViewStyle,
    PressableProps as NativePressableProps,
    useColorScheme,
    Platform,
    View,
} from "react-native";

export interface PressableProps extends NativePressableProps {
    style?: StyleProp<ViewStyle>;
    outerStyle?: StyleProp<ViewStyle>;
    className?: string;
    outerClassName?: string;
    hoverBackgroundColor?: string;
    pressedBackgroundColor?: string;
}

const isAndroid = Platform.OS === "android";

const PotatoPressable = forwardRef<View, PressableProps>((props, ref) => {
    const [isHover, setIsHover] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const colorMode = useColorScheme();
    let backgroundColor: string | undefined = undefined;
    const pressedBackgroundColor =
        props.pressedBackgroundColor || (colorMode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)");
    if (isHover) {
        backgroundColor =
            props.hoverBackgroundColor || (colorMode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)");
    }
    if (isPressed) {
        backgroundColor = pressedBackgroundColor;
    }

    return (
        <View ref={ref} className={props.outerClassName} style={[props.outerStyle]}>
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
                    color: pressedBackgroundColor,
                }}
                style={{
                    backgroundColor,
                }}
                {...omit(props, ["onPressIn", "onPressOut", "outerStyle", "outerClassName"])}
            >
                {props.children}
            </NativePressable>
        </View>
    );
});

export default PotatoPressable;
