import React from "react";
import { useWindowDimensions } from "react-native";
import { Box } from "@gluestack-ui/themed";
import { SCREEN_BREAKPOINTS } from "../../../constants/style";
import useCommonColors from "../../../hooks/useCommonColors";

function generateRandomNumbers(amount: number, max = 1, min = 0) {
    const arr: number[] = [];
    for (let i = 0; i < amount; i++) {
        arr.push(Math.random() * (max - min) + min);
    }
    return arr;
}

const descriptionWidth = generateRandomNumbers(9, 100, 40);

const QuerySkeleton: React.FC = () => {
    const { width } = useWindowDimensions();
    const { textBasicColor } = useCommonColors();

    const skeletonBlock = {
        backgroundColor: textBasicColor,
        borderRadius: 8,
        opacity: 0.1,
    };

    return (
        <>
            <Box
                sx={
                    width >= SCREEN_BREAKPOINTS.md
                        ? {
                              padding: 24,
                              gap: 24,
                              flexDirection: "row",
                          }
                        : {
                              padding: 16,
                              gap: 16,
                          }
                }
            >
                <Box
                    flex={width >= SCREEN_BREAKPOINTS.md ? 1 : undefined}
                    sx={{
                        ...skeletonBlock,
                        width: "100%",
                        aspectRatio: "16/9",
                    }}
                />
                <Box flex={width >= SCREEN_BREAKPOINTS.md ? 1 : undefined}>
                    <Box
                        sx={{
                            ...skeletonBlock,
                            height: 22,
                            marginBottom: 16,
                            width: "75%",
                            backgroundColor: textBasicColor,
                        }}
                    />
                    <Box
                        sx={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 12,
                            marginBottom: 16,
                        }}
                    >
                        <Box
                            sx={{
                                ...skeletonBlock,
                                width: 36,
                                height: 36,
                                borderRadius: 9999,
                                backgroundColor: textBasicColor,
                                flex: 0,
                            }}
                        />
                        <Box
                            sx={{
                                ...skeletonBlock,
                                width: "40%",
                                height: 19,
                                flex: 0,
                            }}
                        />
                        <Box flex={1} />
                        <Box
                            sx={{
                                ...skeletonBlock,
                                width: 72,
                                height: 19,
                                flex: 0,
                            }}
                        />
                    </Box>
                    <Box
                        sx={{
                            alignItems: "flex-start",
                            gap: 5,
                        }}
                    >
                        {descriptionWidth.map((e) => (
                            <Box sx={{ ...skeletonBlock, height: 16, width: `${e}%` }} key={e} />
                        ))}
                    </Box>
                </Box>
            </Box>
            <Box>
                {/* list item */}
                <Box
                    sx={{
                        paddingHorizontal: width >= SCREEN_BREAKPOINTS.md ? 24 : 16,
                        gap: 10,
                        height: 64,
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <Box
                        sx={{
                            flex: 1,
                            flexDirection: "row",
                            gap: 10,
                        }}
                    >
                        <Box
                            sx={{
                                ...skeletonBlock,
                                width: 20,
                                height: 22,
                                flex: 0,
                            }}
                        />
                        <Box sx={{ flex: 1 }}>
                            <Box
                                sx={{
                                    ...skeletonBlock,
                                    width: "90%",
                                    height: 16,
                                    marginTop: 3,
                                }}
                            />
                            <Box
                                sx={{
                                    ...skeletonBlock,
                                    width: 40,
                                    height: 16,
                                    marginTop: 8.5,
                                }}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default QuerySkeleton;
