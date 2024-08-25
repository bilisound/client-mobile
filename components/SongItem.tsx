import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, View, Text } from "react-native";
import { State, useActiveTrack, usePlaybackState } from "react-native-track-player";
import { useStyles, createStyleSheet } from "react-native-unistyles";

import ProgressBar from "./ProgressBar";

import Pressable from "~/components/potato-ui/Pressable";
import { PlaylistDetail } from "~/storage/sqlite/schema";
import { formatSecond } from "~/utils/misc";
import { handleTogglePlay } from "~/utils/player-control";

// 播放状态图标
function PlayingIcon() {
    const playingState = usePlaybackState().state;
    const activeTrack = useActiveTrack();
    const isPlaying = playingState === State.Playing;
    const { theme } = useStyles(styleSheet);
    const accentColor = theme.colors.accent[500];

    if (!activeTrack?.bilisoundIsLoaded) {
        return <ActivityIndicator color={accentColor} />;
    }

    return <FontAwesome5 name={isPlaying ? "pause" : "play"} size={20} color={accentColor} />;
}

export interface SongItemProps {
    onRequestPlay?: () => void;
    onLongPress?: () => void;
    onToggle?: () => void;
    data: PlaylistDetail;
    index?: number;
    isChecking?: boolean;
    isChecked?: boolean;
}

export default function SongItem({
    onRequestPlay = () => {},
    onLongPress = () => {},
    onToggle = () => {},
    data,
    index,
    isChecking,
    isChecked,
}: SongItemProps) {
    const activeTrack = useActiveTrack();
    const isActiveTrack = data.bvid === activeTrack?.bilisoundId && data.episode === activeTrack?.bilisoundEpisode;
    const { theme, styles } = useStyles(styleSheet);
    const textBasicColor = theme.colorTokens.foreground;

    return (
        <Pressable
            onPress={async () => {
                if (isChecking) {
                    onToggle();
                    return;
                }
                if (isActiveTrack) {
                    await handleTogglePlay();
                    return;
                }
                onRequestPlay();
            }}
            onLongPress={onLongPress}
            style={styles.container}
        >
            <View style={styles.rowContainer}>
                <View
                    style={[
                        styles.episodeContainer,
                        { backgroundColor: isActiveTrack ? theme.colors.accent[500] : theme.colors.primary[500] },
                    ]}
                >
                    <Text style={styles.episodeText}>{typeof index === "number" ? index : data.episode}</Text>
                </View>
                <View style={styles.titleContainer}>
                    <Text
                        style={[
                            styles.titleText,
                            {
                                fontWeight: isActiveTrack ? "600" : "400",
                                color: isActiveTrack ? theme.colors.accent[500] : textBasicColor,
                            },
                        ]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {data.title}
                    </Text>
                    <Text style={styles.durationText}>{formatSecond(data.duration)}</Text>
                </View>
            </View>
            {isChecking ? (
                <View style={styles.checkContainer}>
                    <View
                        style={[
                            styles.checkCircle,
                            { backgroundColor: isChecked ? theme.colors.primary[500] : "transparent" },
                        ]}
                    >
                        <Entypo name="check" size={18} color={isChecked ? "white" : "transparent"} />
                    </View>
                </View>
            ) : isActiveTrack ? (
                <>
                    <View style={styles.playingIconContainer}>
                        <PlayingIcon />
                    </View>
                    <ProgressBar item={`${data.bvid}_${data.episode}`} />
                </>
            ) : null}
        </Pressable>
    );
}

const styleSheet = createStyleSheet(theme => ({
    container: {
        paddingHorizontal: 16,
        height: 64,
        flexDirection: "row",
        gap: 12,
        position: "relative",
        alignItems: "center",
    },
    rowContainer: {
        flexDirection: "row",
        flex: 1,
        gap: 12,
        justifyContent: "flex-start",
    },
    episodeContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 6,
        height: 22,
        borderRadius: 6,
        flexBasis: "auto",
    },
    episodeText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "white",
    },
    titleContainer: {
        flex: 1,
    },
    titleText: {
        lineHeight: 22,
        fontSize: 14,
    },
    durationText: {
        marginTop: 4,
        fontSize: 14,
        color: theme.colorTokens.foreground,
        opacity: 0.5,
    },
    checkContainer: {
        flexBasis: "auto",
    },
    checkCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: theme.colors.primary[500],
        alignItems: "center",
        justifyContent: "center",
    },
    playingIconContainer: {
        flex: 0,
        flexBasis: "auto",
        alignItems: "center",
        justifyContent: "center",
        width: 32,
    },
}));
