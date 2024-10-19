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
    pressedBackgroundColor?: string;
}

const isAndroid = Platform.OS === "android";

const PotatoPressable = forwardRef<View, PressableProps>((props, ref) => {
    const [pressed, setPressed] = useState(false);
    const colorMode = useColorScheme();
    const pressedBackgroundColor = colorMode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
    const pressedBackgroundColorUser = props.pressedBackgroundColor;

    return (
        <View
            ref={ref}
            style={[
                props.outerStyle,
                {
                    backgroundColor: pressed ? pressedBackgroundColorUser || pressedBackgroundColor : undefined,
                },
            ]}
            className={props.outerClassName}
        >
            <NativePressable
                onPressIn={event => {
                    if (!isAndroid) {
                        setPressed(true);
                    }
                    props.onPressIn?.(event);
                }}
                onPressOut={event => {
                    if (!isAndroid) {
                        setPressed(false);
                    }
                    props.onPressOut?.(event);
                }}
                android_ripple={{
                    color: pressedBackgroundColorUser || pressedBackgroundColor,
                }}
                {...omit(props, ["onPressIn", "onPressOut", "outerStyle", "outerClassName"])}
            >
                {props.children}
            </NativePressable>
        </View>
    );
});

export default PotatoPressable;
