import React from "react";
import { View, Text } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import PotatoButton from "~/components/potato-ui/PotatoButton";

export interface EmptyProps {
    onPress?: () => void;
    title?: string;
    action?: string | null;
}

export default function Empty({ onPress = () => {}, title = "这里空空如也", action = "去查询" }: EmptyProps) {
    const { styles } = useStyles(styleSheet);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            {action && <PotatoButton onPress={onPress}>{action}</PotatoButton>}
        </View>
    );
}

const styleSheet = createStyleSheet(theme => ({
    container: {
        alignItems: "center",
        justifyContent: "center",
        flexGrow: 1,
        gap: 16,
    },
    title: {
        fontSize: 14,
        lineHeight: 14 * 1.5,
        opacity: 0.5,
        color: theme.colorTokens.foreground,
    },
}));
