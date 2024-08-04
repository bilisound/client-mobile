import React, { useEffect } from "react";
import Animated, { ReduceMotion, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useTheme, View } from "tamagui";

export interface FormErrorMessageProps {
    isError?: boolean;
    children?: string;
}

export default function FormErrorMessage({ isError, children }: FormErrorMessageProps) {
    const offset = useSharedValue<number>(0);
    const theme = useTheme();

    const animatedStyles = useAnimatedStyle(() => ({
        transform: [{ scaleY: offset.value }],
    }));

    useEffect(() => {
        offset.value = withSpring(isError ? 1 : 0, {
            mass: 1,
            damping: 100,
            stiffness: 750,
            overshootClamping: false,
            restDisplacementThreshold: 0.01,
            restSpeedThreshold: 2,
            reduceMotion: ReduceMotion.System,
        });
    }, [isError, offset]);

    return (
        <View paddingTop={4} paddingBottom={4} justifyContent="center">
            <Animated.Text
                style={[
                    {
                        lineHeight: 20,
                        fontSize: 14,
                        color: theme["error"]?.val,
                        transformOrigin: "top center",
                    },
                    animatedStyles,
                ]}
            >
                {children}
            </Animated.Text>
        </View>
    );
}
