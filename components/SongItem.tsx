import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { cssInterop, remapProps } from "nativewind";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { useMMKVBoolean } from "react-native-mmkv";
import { State, useActiveTrack, usePlaybackState } from "react-native-track-player";
import { useStyles } from "react-native-unistyles";

import ProgressBar from "./ProgressBar";

import PotatoPressable from "~/components/potato-ui/PotatoPressable";
import { Text } from "~/components/ui/text";
import { cacheStatusStorage } from "~/storage/cache-status";
import { PlaylistDetail } from "~/storage/sqlite/schema";
import { formatSecond } from "~/utils/datetime";
import { handleTogglePlay } from "~/utils/player-control";

const PotatoPressableWind = remapProps(PotatoPressable, { className: "style" });
const IoniconsWind = cssInterop(Ionicons, {
    className: {
        target: "style",
        nativeStyleToProp: {
            color: true,
        },
    },
});

// 播放状态图标
function PlayingIcon() {
    const playingState = usePlaybackState().state;
    const activeTrack = useActiveTrack();
    const isPlaying = playingState === State.Playing;
    const { theme } = useStyles();
    const accentColor = theme.colors.accent[500];

    if (!activeTrack?.bilisoundIsLoaded) {
        return <ActivityIndicator color={accentColor} />;
    }

    return (
        <View className="items-center justify-center">
            <FontAwesome5 name={isPlaying ? "pause" : "play"} size={20} color={accentColor} />
        </View>
    );
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
    const [exists] = useMMKVBoolean(data.bvid + "_" + data.episode, cacheStatusStorage);

    return (
        <PotatoPressableWind
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
            className="px-4 h-16 flex-row gap-3 items-center"
        >
            <View className="flex-row flex-1 gap-3 justify-start">
                <View
                    className={`items-center justify-center px-1.5 h-[22px] rounded-md ${
                        isActiveTrack
                            ? "bg-accent-500 shadow-md ios:shadow-hard-2"
                            : "bg-primary-500 dark:bg-primary-400"
                    }`}
                >
                    <Text
                        className="text-sm text-white tabular-nums"
                        style={{ fontFamily: isActiveTrack ? "Roboto_700Bold" : "Roboto_400Regular" }}
                    >
                        {typeof index === "number" ? index : data.episode}
                    </Text>
                </View>
                <View className="flex-1">
                    <Text
                        className={`leading-[22px] text-sm ${
                            isActiveTrack ? "font-semibold text-accent-500" : "font-normal"
                        }`}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {data.title}
                    </Text>
                    <View className="mt-1 flex-row items-center gap-1">
                        {exists && (
                            <IoniconsWind
                                name="checkmark-circle"
                                size={16}
                                className="color-typography-700 opacity-50"
                            />
                        )}
                        <Text className="text-sm opacity-50" style={{ fontFamily: "Roboto_400Regular" }}>
                            {formatSecond(data.duration)}
                        </Text>
                    </View>
                </View>
            </View>
            {isChecking ? (
                <View className="flex-basis-auto">
                    <View
                        className={`w-7 h-7 rounded-full border-2 border-primary-500 dark:border-primary-500 items-center justify-center ${
                            isChecked ? "bg-primary-500 dark:bg-primary-400" : "bg-transparent"
                        }`}
                    >
                        <Entypo name="check" size={18} color={isChecked ? "white" : "transparent"} />
                    </View>
                </View>
            ) : isActiveTrack ? (
                <>
                    <View className="flex-0 flex-basis-auto items-center justify-center w-8">
                        <PlayingIcon />
                    </View>
                    <ProgressBar item={`${data.bvid}_${data.episode}`} />
                </>
            ) : null}
        </PotatoPressableWind>
    );
}
