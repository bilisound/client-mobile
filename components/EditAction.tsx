import React from "react";
import { View, Text } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import PotatoButton from "~/components/potato-ui/PotatoButton";
import { useTabPaddingBottom } from "~/hooks/useTabPaddingBottom";

interface EditActionProps {
    onAll: () => void;
    onReverse: () => void;
    onDelete: () => void;
    amount: number;
}

export default function EditAction({ onAll, onReverse, onDelete, amount }: EditActionProps) {
    const { theme, styles } = useStyles(styleSheet);
    const bgColor = theme.colorTokens.background;
    const paddingBottom = useTabPaddingBottom();

    return (
        <View style={[styles.container, { backgroundColor: bgColor, paddingBottom, height: paddingBottom + 52 }]}>
            <Text style={styles.text}>{`已选择 ${amount} 项`}</Text>
            <View style={styles.buttonContainer}>
                <PotatoButton size="sm" variant="outline" onPress={onAll}>
                    全选
                </PotatoButton>
                <PotatoButton size="sm" variant="outline" onPress={onReverse}>
                    反选
                </PotatoButton>
                <PotatoButton size="sm" variant="solid" color="red" onPress={onDelete} disabled={amount <= 0}>
                    删除
                </PotatoButton>
            </View>
        </View>
    );
}

const styleSheet = createStyleSheet(theme => ({
    container: {
        borderTopWidth: 1,
        borderColor: theme.colorTokens.border,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 12,
    },
    text: {
        fontSize: 14,
        color: theme.colorTokens.foreground,
    },
    buttonContainer: {
        flexDirection: "row",
        gap: 8,
    },
}));
