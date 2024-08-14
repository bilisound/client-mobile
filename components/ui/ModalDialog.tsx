import { PropsWithChildren, useContext, useEffect } from "react";
import { View } from "react-native";
import { ShadowedView } from "react-native-fast-shadow";
import Animated, { ReduceMotion, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { ModalContext } from "~/components/ui/ModalContext";

const AnimatedShadowedView = Animated.createAnimatedComponent(ShadowedView);

export interface ModalDialogProps {}

export function ModalDialog({ children }: PropsWithChildren<ModalDialogProps>) {
    const { show, open } = useContext(ModalContext);
    const { styles } = useStyles(styleSheet);
    const openProgress = useSharedValue(0);
    const safeAreaInsets = useSafeAreaInsets();

    const dialogContentStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(openProgress.value, {
                duration: 200,
                reduceMotion: ReduceMotion.System,
            }),
            transform: [
                {
                    scale: withTiming(openProgress.value * 0.05 + 0.95, {
                        duration: 200,
                        reduceMotion: ReduceMotion.System,
                    }),
                },
            ],
        };
    });

    useEffect(() => {
        openProgress.value = open ? 1 : 0;
    }, [open, openProgress]);

    return (
        <View
            style={[
                styles.container,
                {
                    display: show ? "flex" : "none",
                    paddingLeft: safeAreaInsets.left + 16,
                    paddingRight: safeAreaInsets.right + 16,
                    paddingTop: safeAreaInsets.top + 16,
                    paddingBottom: safeAreaInsets.bottom + 16,
                },
            ]}
        >
            <AnimatedShadowedView style={[styles.content, dialogContentStyle]}>{children}</AnimatedShadowedView>
        </View>
    );
}

const styleSheet = createStyleSheet(theme => ({
    container: {
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
    },
    content: {
        backgroundColor: theme.colorTokens.dialogBackground,
        padding: 24,
        borderRadius: 24,
        shadowOpacity: 0.1,
        shadowRadius: 25,
        shadowOffset: {
            width: 0,
            height: 20,
        },
        shadowColor: "#000000",
        alignItems: "stretch",
    },
}));
