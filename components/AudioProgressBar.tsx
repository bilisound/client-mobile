import React, { useEffect, useState } from "react";
import TrackPlayer, { usePlaybackState, useProgress } from "react-native-track-player";
import { Slider } from "@miblanchard/react-native-slider";
import { Box } from "@gluestack-ui/themed";
import useCommonColors from "../hooks/useCommonColors";

const AudioProgressBar: React.FC = () => {
    const { primaryColor } = useCommonColors();

    const [value, setValue] = useState(0);
    const [holding, setHolding] = useState(false);

    // 播放状态
    const { position, buffered, duration } = useProgress();

    useEffect(() => {
        if (!holding) {
            setValue(position);
        }
    }, [position]);

    return (
        <Box
            sx={{
                height: 16,
                justifyContent: "center",
                flex: 1,
                position: "relative",
            }}
        >
            <Box
                sx={{
                    left: 10,
                    right: 10,
                    top: 6.5,
                    height: 3,
                    borderRadius: 2,
                    backgroundColor: "$primary200",
                    _dark: {
                        backgroundColor: "$primary900",
                    },
                    position: "absolute",
                    overflow: "hidden",
                }}
            >
                <Box
                    sx={{
                        height: "100%",
                        backgroundColor: "$primary200",
                        _dark: {
                            backgroundColor: "$primary900",
                        },
                        position: "absolute",
                        width: `${(buffered / duration) * 100}%`,
                    }}
                />
                <Box
                    sx={{
                        height: "100%",
                        backgroundColor: "$primary500",
                        position: "absolute",
                        width: `${(value / duration) * 100}%`,
                    }}
                />
            </Box>
            <Slider
                value={value}
                onValueChange={([v]) => setValue(v)}
                onSlidingStart={() => {
                    setValue(position);
                    setHolding(true);
                }}
                onSlidingComplete={async (val) => {
                    await TrackPlayer.seekTo(val[0]);
                    setHolding(false);
                }}
                minimumValue={0}
                maximumValue={duration}
                containerStyle={{
                    position: "absolute",
                    width: "100%",
                }}
                trackStyle={{
                    backgroundColor: "transparent",
                }}
                minimumTrackStyle={{
                    backgroundColor: "transparent",
                }}
                thumbStyle={{
                    width: 16,
                    height: 16,
                    backgroundColor: primaryColor,
                }}
                thumbTouchSize={{ width: 16, height: 16 }}
            />
        </Box>
    );
};

export default AudioProgressBar;
