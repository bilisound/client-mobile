import { Image } from "expo-image";
import React from "react";
import { Linking, ScrollView, View, Text, Pressable } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import CommonLayout from "~/components/CommonLayout";
import { BILISOUND_OFFICIAL_WEBSITE } from "~/constants/branding";

export default function Page() {
    const { styles } = useStyles(stylesheet);

    return (
        <CommonLayout title="关于" extendToBottom leftAccessories="backButton">
            <ScrollView>
                <View style={styles.container}>
                    <Image style={styles.logoImage} source={require("../assets/images/icon.png")} />
                    <Text style={styles.logoTitle}>Bilisound</Text>
                    <Text style={styles.version}>{`版本 ${require("../package.json").version}`}</Text>
                    <View style={styles.action}>
                        <Pressable onPress={() => Linking.openURL(BILISOUND_OFFICIAL_WEBSITE)}>
                            <Text style={styles.link}>访问官网</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </CommonLayout>
    );
}

const stylesheet = createStyleSheet(theme => ({
    container: {
        alignItems: "center",
        padding: 24,
    },
    logoImage: {
        width: 72,
        height: 72,
        borderRadius: 12,
    },
    logoTitle: {
        fontSize: 24,
        lineHeight: 24 * 1.5,
        fontWeight: "700",
        marginTop: 8,
        marginBottom: 4,
        color: theme.colorTokens.foreground,
    },
    version: {
        fontSize: 14,
        lineHeight: 14 * 1.5,
        opacity: 0.5,
        color: theme.colorTokens.foreground,
    },
    action: {
        flexDirection: "row",
    },
    link: {
        marginTop: 24,
        color: theme.colors.accent[700],
        textDecorationLine: "underline",
    },
}));
