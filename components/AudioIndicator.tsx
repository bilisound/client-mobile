import { FontAwesome5 } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { View } from "react-native";
import { State, useActiveTrack, usePlaybackState } from "react-native-track-player";
import { twMerge } from "tailwind-merge";

import { Pressable } from "./ui/pressable";
import { Text } from "./ui/text";

import PotatoPressable from "~/components/potato-ui/PotatoPressable";
import { createIcon } from "~/components/potato-ui/utils/icon";
import { getImageProxyUrl } from "~/utils/constant-helper";
import { handleTogglePlay } from "~/utils/player-control";

const IconPlay = createIcon(FontAwesome5, "play");
const IconPause = createIcon(FontAwesome5, "pause");

export interface AudioIndicatorProps {
    className?: string;
    imageClassName?: string;
    playButtonOuterClassName?: string;
}

export default function AudioIndicator({ className, imageClassName, playButtonOuterClassName }: AudioIndicatorProps) {
    const activeTrack = useActiveTrack();
    const playbackState = usePlaybackState();

    if (!activeTrack) {
        return null;
    }

    return (
        <View
            className={twMerge("border-t border-b border-outline-50 flex-row items-center gap-3 px-3 py-2", className)}
        >
            <Pressable
                onPress={() => {
                    router.push(
                        `/modal?initialImage=${encodeURIComponent(activeTrack?.artwork ?? "")}&initialTitle=${activeTrack?.title}&initialArtist=${activeTrack?.artist}`,
                    );
                }}
                className="flex-row flex-1 gap-3"
            >
                <Image
                    source={getImageProxyUrl(activeTrack?.artwork ?? "", activeTrack?.bilisoundId ?? "")}
                    className={twMerge("h-10 aspect-[16/9] rounded", imageClassName)}
                />
                <View className="flex-1 h-10 justify-center">
                    <Text className="text-base text-typography-700" isTruncated>
                        {activeTrack?.title}
                    </Text>
                </View>
            </Pressable>
            <PotatoPressable
                outerClassName={twMerge("rounded-[6px] overflow-hidden", playButtonOuterClassName)}
                className="w-10 h-10 items-center justify-center"
                onPressOut={async () => {
                    await handleTogglePlay();
                }}
            >
                {playbackState.state === State.Playing ? (
                    <IconPause size={16} className="color-primary-500" />
                ) : (
                    <IconPlay size={16} className="color-primary-500" />
                )}
            </PotatoPressable>
        </View>
    );
}
