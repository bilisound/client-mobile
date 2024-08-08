import { omit } from "lodash";
import {
    Pressable as NativePressable,
    StyleProp,
    ViewStyle,
    PressableProps as NativePressableProps,
    useColorScheme,
} from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

interface PressableProps extends NativePressableProps {
    style?: StyleProp<ViewStyle>;
    pressedBackgroundColor?: string;
}

export default function Pressable(props: PressableProps) {
    const pressed = useSharedValue(false);
    const colorMode = useColorScheme();
    const pressedBackgroundColor = colorMode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
    const pressedBackgroundColorUser = props.pressedBackgroundColor;

    const animatedStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: withTiming(
                pressed.value ? pressedBackgroundColorUser ?? pressedBackgroundColor : "transparent",
                {
                    duration: pressed.value ? 0 : 150,
                },
            ),
        };
    });

    return (
        <Animated.View style={[animatedStyle]}>
            <NativePressable
                onPressIn={event => {
                    pressed.value = true;
                    props.onPressIn?.(event);
                }}
                onPressOut={event => {
                    pressed.value = false;
                    props.onPressOut?.(event);
                }}
                {...omit(props, ["onPressIn", "onPressOut"])}
            >
                {props.children}
            </NativePressable>
        </Animated.View>
    );
}
