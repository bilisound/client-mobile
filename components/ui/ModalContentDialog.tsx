import { useContext } from "react";
import { View, Text } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { ModalContext } from "~/components/ui/ModalContext";

export default function ModalContentDialog() {
    const { show } = useContext(ModalContext);
    const { styles } = useStyles(styleSheet);

    console.log({ show });

    return (
        <View style={[styles.container, { display: show ? "flex" : "none" }]}>
            <View style={styles.content}>
                <Text>Hello world</Text>
            </View>
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
    },
}));
