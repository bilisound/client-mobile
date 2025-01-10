import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { tva } from "@gluestack-ui/nativewind-utils/tva";
import { ActivityIndicator, View } from "react-native";
import { useMMKVBoolean } from "react-native-mmkv";

import { useRawThemeValues } from "~/components/ui/gluestack-ui-provider/theme";
import { Text } from "~/components/ui/text";
import { cacheStatusStorage } from "~/storage/cache-status";
import { PlaylistDetail } from "~/storage/sqlite/schema";
import { formatSecond } from "~/utils/datetime";

import * as Player from "@bilisound/player";

import React from "react";
import { Pressable } from "~/components/ui/pressable";
import { useCurrentTrack, useIsPlaying, usePlaybackState } from "@bilisound/player";
import { shadow } from "~/constants/styles";
import { Monicon } from "@monicon/native";
import { PLACEHOLDER_AUDIO } from "~/constants/playback";

// 播放状态图标
function PlayingIcon() {
    const activeTrack = useCurrentTrack();
    const playbackState = usePlaybackState();
    const isPlaying = useIsPlaying();
    const { colorValue } = useRawThemeValues();
    const accentColor = colorValue("--color-accent-500");

    // 解决 placeholder 音频还没替换时不恰当的状态显示
    const isPlaceholderTrack = activeTrack?.uri === PLACEHOLDER_AUDIO;

    if (playbackState === "STATE_BUFFERING" || isPlaceholderTrack) {
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
            true: "bg-accent-500",
            false: "bg-primary-500 dark:bg-primary-400",
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

export function SongItem({
    onRequestPlay = () => {},
    onLongPress = () => {},
    onToggle = () => {},
    data,
    index,
    isChecking,
    isChecked,
}: SongItemProps) {
    const activeTrack = useCurrentTrack();
    const isActiveTrack =
        data.bvid === activeTrack?.extendedData?.id && data.episode === activeTrack?.extendedData?.episode;
    const [exists] = useMMKVBoolean(data.bvid + "_" + data.episode, cacheStatusStorage);

    return (
        <Pressable
            onPress={async () => {
                if (isChecking) {
                    onToggle();
                    return;
                }
                if (isActiveTrack) {
                    await Player.toggle();
                    return;
                }
                onRequestPlay();
            }}
            onLongPress={onLongPress}
            className="px-4 h-16 flex-row gap-3 items-center"
        >
            <View className="flex-row flex-1 gap-3 justify-start">
                <View
                    className={trackNumberStyle({ isActiveTrack })}
                    style={{ boxShadow: isActiveTrack ? shadow.lg : undefined }}
                >
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
                        className={`w-7 h-7 rounded-full border-2 border-primary-500 dark:border-primary-400 items-center justify-center ${
                            isChecked ? "bg-primary-500 dark:bg-primary-400" : "bg-transparent"
                        }`}
                    >
                        {/*<Entypo name="check" size={18} color={isChecked ? "white" : "transparent"} />*/}
                        <Monicon name={"fa6-solid:check"} size={16} color={isChecked ? "white" : "transparent"} />
                    </View>
                </View>
            ) : isActiveTrack ? (
                <>
                    <View className="flex-0 flex-basis-auto items-center justify-center w-8">
                        <PlayingIcon />
                    </View>
                    {/*<ProgressBar item={`${data.bvid}_${data.episode}`} />*/}
                </>
            ) : null}
        </Pressable>
    );
}
