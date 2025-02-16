import { usePlaybackSpeedStore } from "~/store/playback-speed";
import { Text } from "~/components/ui/text";
import { View } from "react-native";
import { Slider as GSSlider, SliderFilledTrack, SliderThumb, SliderTrack } from "~/components/ui/slider";
import React from "react";

export function SpeedControlPanel() {
    const { speedValue, retainPitch, applySpeed } = usePlaybackSpeedStore(state => ({
        speedValue: state.speedValue,
        retainPitch: state.retainPitch,
        applySpeed: state.applySpeed,
    }));

    return (
        <>
            <Text className={"font-semibold text-base text-center"}>{speedValue.toFixed(2) + "x"}</Text>
            <View className={"h-6 flex-row items-center gap-4 mt-4"}>
                <GSSlider
                    className={"flex-1"}
                    value={speedValue}
                    step={0.01}
                    minValue={0.5}
                    maxValue={2}
                    size="md"
                    orientation="horizontal"
                    isDisabled={false}
                    isReversed={false}
                    onChange={e => {
                        applySpeed(e, retainPitch);
                    }}
                >
                    <SliderTrack>
                        <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                </GSSlider>
            </View>
        </>
    );
}
