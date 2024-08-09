import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { ShadowedView } from "react-native-fast-shadow";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export interface ToastProps {
    type: "success" | "info" | "warning" | "error";
    title: string;
    description?: string;
}

export default function Toast({ type, title, description }: ToastProps) {
    const { styles, theme } = useStyles(styleSheet);
    return (
        <ShadowedView style={[styles.toast, vanillaStyles.toast]}>
            {type === "success" && (
                <Ionicons name="checkmark-circle" style={styles.toastIcon} size={24} color={theme.colors.green[500]} />
            )}
            {type === "info" && (
                <Ionicons
                    name="information-circle"
                    style={styles.toastIcon}
                    size={24}
                    color={theme.colors.neutral[500]}
                />
            )}
            {type === "warning" && (
                <Ionicons name="alert-circle" style={styles.toastIcon} size={24} color={theme.colors.orange[500]} />
            )}
            {type === "error" && (
                <Ionicons name="close-circle" style={styles.toastIcon} size={24} color={theme.colors.red[500]} />
            )}
            <View style={styles.toastText}>
                <Text style={styles.toastTitle}>{title}</Text>
                {description ? <Text style={styles.toastDescription}>{description}</Text> : null}
            </View>
        </ShadowedView>
    );
}

const vanillaStyles = StyleSheet.create({
    toast: {
        shadowOpacity: 0.1,
        shadowRadius: 25,
        shadowOffset: {
            width: 0,
            height: 20,
        },
    },
});

const styleSheet = createStyleSheet(theme => ({
    toast: {
        backgroundColor: theme.colorTokens.dialogBackground,
        borderColor: theme.colorTokens.dialogBorder,
        borderWidth: 1,
        minHeight: 50,
        borderRadius: 25,
        padding: 12,
        flexDirection: "row",
        gap: 12,
        marginHorizontal: 32,
        marginVertical: 8,
        maxWidth: 400,
    },
    toastIcon: {
        flex: 0,
        flexBasis: "auto",
    },
    toastText: {
        gap: 4,
        flex: 1,
    },
    toastTitle: {
        fontSize: 16,
        fontWeight: "bold",
        lineHeight: 26,
        color: theme.colorTokens.foreground,
    },
    toastDescription: {
        fontSize: 14,
        lineHeight: 14 * 1.5,
        color: theme.colorTokens.foreground,
    },
}));
