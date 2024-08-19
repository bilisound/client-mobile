import { Text, TextProps } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export function ModalDialogDescription({ style, ...props }: TextProps) {
    const { styles } = useStyles(styleSheet);

    return <Text style={[styles.contentDescription, style]} {...props} />;
}

const styleSheet = createStyleSheet(theme => ({
    contentDescription: {
        fontSize: 14,
        lineHeight: 14 * 1.5,
        marginTop: 16,
        color: theme.colorTokens.foreground,
    },
}));
