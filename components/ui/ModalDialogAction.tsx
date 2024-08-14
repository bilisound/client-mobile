import { View, ViewProps } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export function ModalDialogAction({ style, ...props }: ViewProps) {
    const { styles } = useStyles(styleSheet);

    return <View style={[styles.contentAction, style]} {...props} />;
}

const styleSheet = createStyleSheet(theme => ({
    contentAction: {
        justifyContent: "flex-end",
        flexDirection: "row",
        marginTop: 24,
        gap: 8,
    },
}));
