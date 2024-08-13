import { Portal } from "@gorhom/portal";
import { useNavigation } from "expo-router";
import { PropsWithChildren, useEffect } from "react";
import Animated, { ReduceMotion, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export interface ModalProps {
    open: boolean;
    onOpenChange: (value: boolean) => void;
}

export default function ModalBackdrop({ open, onOpenChange }: PropsWithChildren<ModalProps>) {
    const { styles } = useStyles(styleSheet);
    const backdropOpacity = useSharedValue(0);
    const backdropDisplay = useSharedValue(false);
    const navigation = useNavigation();

    const backdropStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(
                backdropOpacity.value,
                {
                    duration: 200,
                    reduceMotion: ReduceMotion.System,
                },
                done => {
                    if (done && backdropOpacity.value === 0) {
                        backdropDisplay.value = false;
                    }
                },
            ),
            display: backdropDisplay.value ? "flex" : "none",
        };
    });

    useEffect(() => {
        if (open) {
            backdropOpacity.value = 1;
            backdropDisplay.value = true;
        } else {
            backdropOpacity.value = 0;
        }
    }, [backdropDisplay, backdropOpacity, open]);

    useEffect(() => {
        const handler = (e: any) => {
            if (!open) {
                return;
            }
            e.preventDefault();
            onOpenChange?.(false);
        };
        navigation.addListener("beforeRemove", handler);
        return () => {
            navigation.removeListener("beforeRemove", handler);
        };
    }, [navigation, onOpenChange, open]);

    return (
        <Portal>
            <Animated.View style={[styles.backdrop, backdropStyle]} />
        </Portal>
    );
}

const styleSheet = createStyleSheet(theme => ({
    backdrop: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
    },
}));
