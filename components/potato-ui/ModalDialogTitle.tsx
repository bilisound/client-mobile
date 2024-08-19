import { Text, TextProps } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export function ModalDialogTitle({ style, ...props }: TextProps) {
    const { styles } = useStyles(styleSheet);

    return <Text style={[styles.contentTitle, style]} {...props} />;
}

const styleSheet = createStyleSheet(theme => ({
    contentTitle: {
        fontSize: 20,
        lineHeight: 20 * 1.5,
        fontWeight: "600",
        color: theme.colorTokens.foreground,
    },
}));
