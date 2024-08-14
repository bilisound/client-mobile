import { useContext, useEffect } from "react";
import { Text, View } from "react-native";
import { ShadowedView } from "react-native-fast-shadow";
import Animated, { ReduceMotion, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import Button from "~/components/ui/Button";
import { ModalContext } from "~/components/ui/ModalContext";

const AnimatedShadowedView = Animated.createAnimatedComponent(ShadowedView);

export default function ModalContentDialog() {
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
            <AnimatedShadowedView style={[styles.content, dialogContentStyle]}>
                <View style={{ gap: 16, alignItems: "stretch" }}>
                    <Text style={{ fontSize: 20, lineHeight: 20 * 1.5, fontWeight: "600" }}>测试标题</Text>
                    <Text style={{ fontSize: 14, lineHeight: 14 * 1.5 }}>
                        测试消息内容！！测试消息内容！！测试消息内容！！测试消息内容！！测试消息内容！！测试消息内容！！
                    </Text>
                    <View style={{ justifyContent: "flex-end", flexDirection: "row", gap: 8 }}>
                        <Button variant="ghost">取消</Button>
                        <Button>确定</Button>
                    </View>
                </View>
            </AnimatedShadowedView>
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
    },
}));
