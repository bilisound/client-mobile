import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

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
                {/* todo 按钮状态变更动画 */}
                <TouchableOpacity style={styles.outlineButton} onPress={onAll}>
                    <Text style={styles.outlineButtonText}>全选</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.outlineButton} onPress={onReverse}>
                    <Text style={styles.outlineButtonText}>反选</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.deleteButton, amount <= 0 && styles.disabledButton]}
                    onPress={onDelete}
                    disabled={amount <= 0}
                >
                    <Text style={styles.deleteButtonText}>删除</Text>
                </TouchableOpacity>
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
    },
    buttonContainer: {
        flexDirection: "row",
        gap: 8,
    },
    outlineButton: {
        borderWidth: 1,
        borderColor: theme.colorTokens.buttonOutlineBorder("primary", "default"),
        borderRadius: 4,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    outlineButtonText: {
        color: theme.colorTokens.buttonOutlineForeground("primary", "default"),
        fontSize: 14,
    },
    deleteButton: {
        backgroundColor: theme.colorTokens.buttonBackground("red", "default"),
        borderRadius: 4,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    disabledButton: {
        opacity: 0.5,
    },
    deleteButtonText: {
        color: theme.colorTokens.buttonForeground("red", "default"),
        fontSize: 14,
    },
}));
