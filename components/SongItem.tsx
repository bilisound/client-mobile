import { Entypo, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { tva } from "@gluestack-ui/nativewind-utils/tva";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { useMMKVBoolean } from "react-native-mmkv";
import { State, useActiveTrack, usePlaybackState } from "react-native-track-player";

import ProgressBar from "./ProgressBar";

import PotatoPressable from "~/components/potato-ui/PotatoPressable";
import { useRawThemeValues } from "~/components/ui/gluestack-ui-provider/theme";
import { Text } from "~/components/ui/text";
import { cacheStatusStorage } from "~/storage/cache-status";
import { PlaylistDetail } from "~/storage/sqlite/schema";
import { formatSecond } from "~/utils/datetime";
import { handleTogglePlay } from "~/utils/player-control";

// 播放状态图标
function PlayingIcon() {
    const playingState = usePlaybackState().state;
    const activeTrack = useActiveTrack();
    const isPlaying = playingState === State.Playing;
    const { colorValue } = useRawThemeValues();
    const accentColor = colorValue("--color-accent-500");

    if (!activeTrack?.bilisoundIsLoaded) {
        return <ActivityIndicator color={accentColor} />;
    }

    return (
        <View className="items-center justify-center">
            <FontAwesome5 name={isPlaying ? "pause" : "play"} size={20} color={accentColor} />
        </View>
    );
}

const trackNumberStyle = tva({
    base: "items-center justify-center px-1.5 h-[1.375rem] rounded-md",
    variants: {
        isActiveTrack: {
            true: "bg-accent-500 shadow-md ios:shadow-hard-2",
            // shadow-none 很重要！！详见 https://github.com/nativewind/nativewind/issues/873
            false: "shadow-none bg-primary-500 dark:bg-primary-400",
        },
    },
});

const trackTitleStyle = tva({
    base: "leading-[1.375rem] text-sm",
    variants: {
        isActiveTrack: {
            true: "font-semibold text-accent-500",
            false: "font-normal",
        },
    },
});

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
        <PotatoPressable
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
                <View className={trackNumberStyle({ isActiveTrack })}>
                    <Text
                        className="text-sm text-white tabular-nums"
                        style={{ fontFamily: isActiveTrack ? "Roboto_700Bold" : "Roboto_400Regular" }}
                    >
                        {typeof index === "number" ? index : data.episode}
                    </Text>
                </View>
                <View className="flex-1">
                    <Text className={trackTitleStyle({ isActiveTrack })} isTruncated>
                        {data.title}
                    </Text>
                    <View className="mt-1 flex-row items-center gap-1">
                        {exists ? (
                            <Ionicons name="checkmark-circle" size={16} className="color-typography-700 opacity-50" />
                        ) : null}
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
        </PotatoPressable>
    );
}
