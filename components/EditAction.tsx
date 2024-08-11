import React from "react";
import { View, Text } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import Button from "./ui/Button";

interface EditActionProps {
    onAll: () => void;
    onReverse: () => void;
    onDelete: () => void;
    amount: number;
}

export default function EditAction({ onAll, onReverse, onDelete, amount }: EditActionProps) {
    const { theme, styles } = useStyles(styleSheet);
    const bgColor = theme.colorTokens.background;

    return (
        <View style={[styles.container, { backgroundColor: bgColor }]}>
            <Text style={styles.text}>{`已选择 ${amount} 项`}</Text>
            <View style={styles.buttonContainer}>
                <Button size="sm" variant="outline" onPress={onAll}>
                    全选
                </Button>
                <Button size="sm" variant="outline" onPress={onReverse}>
                    反选
                </Button>
                <Button size="sm" variant="solid" color="red" onPress={onDelete} disabled={amount <= 0}>
                    删除
                </Button>
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
        height: 52,
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
