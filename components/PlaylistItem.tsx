import React from "react";
import { View, Text } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import Pressable from "./potato-ui/Pressable";

import { PlaylistMeta } from "~/storage/playlist";

export interface PlaylistItemProps {
    item: PlaylistMeta;
    onPress?: () => void;
    onLongPress?: () => void;
}

/**
 * 歌单列表项
 */
export default function PlaylistItem({ item, onPress, onLongPress }: PlaylistItemProps) {
    const { styles } = useStyles(stylesheet);

    return (
        <Pressable style={styles.container} onPress={onPress} onLongPress={onLongPress}>
            <View style={styles.row}>
                <View style={styles.colorBox}>
                    <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                </View>
                <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                    {item.title}
                </Text>
            </View>
            <Text style={styles.subtitle}>{`${item.amount} 首歌曲`}</Text>
        </Pressable>
    );
}

const stylesheet = createStyleSheet(theme => ({
    container: {
        gap: 4,
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    colorBox: {
        width: 24,
        height: 24,
        justifyContent: "center",
        alignItems: "center",
        flexBasis: "auto",
    },
    colorDot: {
        width: 14,
        height: 14,
        borderRadius: 9999,
    },
    title: {
        fontSize: 16,
        lineHeight: 24,
        flex: 1,
        color: theme.colorTokens.foreground,
    },
    subtitle: {
        marginLeft: 36,
        fontSize: 14,
        opacity: 0.6,
        lineHeight: 21,
        color: theme.colorTokens.foreground,
    },
}));
