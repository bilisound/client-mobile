import { omit } from "lodash";
import {
    Pressable as NativePressable,
    StyleProp,
    ViewStyle,
    PressableProps as NativePressableProps,
    useColorScheme,
    View,
    StyleSheet,
} from "react-native";

interface PressableProps extends NativePressableProps {
    style?: StyleProp<ViewStyle>;
    outerStyle?: StyleProp<ViewStyle>;
    pressedBackgroundColor?: string;
}

export default function Pressable(props: PressableProps) {
    const colorMode = useColorScheme();
    const pressedBackgroundColor = colorMode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
    const pressedBackgroundColorUser = props.pressedBackgroundColor;

    return (
        <View style={[props.outerStyle]}>
            <NativePressable
                {...omit(props, ["outerStyle"])}
                android_ripple={{
                    foreground: true,
                    color: pressedBackgroundColorUser || pressedBackgroundColor,
                }}
            >
                {props.children}
            </NativePressable>
        </View>
    );
}
