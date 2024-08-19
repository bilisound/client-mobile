import omit from "lodash/omit";
import {
    Pressable as NativePressable,
    StyleProp,
    ViewStyle,
    PressableProps as NativePressableProps,
    useColorScheme,
    Platform,
} from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

interface PressableProps extends NativePressableProps {
    style?: StyleProp<ViewStyle>;
    outerStyle?: StyleProp<ViewStyle>;
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
        <Animated.View style={[props.outerStyle, animatedStyle]}>
            <NativePressable
                onPressIn={event => {
                    if (Platform.OS !== "android") {
                        pressed.value = true;
                    }
                    props.onPressIn?.(event);
                }}
                onPressOut={event => {
                    if (Platform.OS !== "android") {
                        pressed.value = false;
                    }
                    props.onPressOut?.(event);
                }}
                android_ripple={{
                    color: pressedBackgroundColorUser || pressedBackgroundColor,
                }}
                {...omit(props, ["onPressIn", "onPressOut", "outerStyle"])}
            >
                {props.children}
            </NativePressable>
        </Animated.View>
    );
}
