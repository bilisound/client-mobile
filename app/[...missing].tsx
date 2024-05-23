import { useRoute } from "@react-navigation/core";
import { Link, Stack } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import log from "~/utils/logger";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    link: {
        marginTop: 15,
        paddingVertical: 15,
    },
    linkText: {
        fontSize: 14,
        color: "#2e78b7",
    },
});

const NotFoundScreen: React.FC = () => {
    const routeInfo = useRoute();
    log.warn(`用户被跳转到不存在的页面。routeInfo: ${JSON.stringify(routeInfo)}`);

    return (
        <>
            <Stack.Screen options={{ title: "Oops!" }} />
            <View style={styles.container}>
                <Text style={styles.title}>{`This screen ${routeInfo.path} doesn't exist.`}</Text>

                <Link href="/" style={styles.link}>
                    <Text style={styles.linkText}>Go to home screen!</Text>
                </Link>
            </View>
        </>
    );
};

export default NotFoundScreen;
