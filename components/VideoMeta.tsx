import React, { useState } from "react";
import { useWindowDimensions } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Pressable, Text, Box } from "@gluestack-ui/themed";
import { GetBilisoundMetadataResponse } from "../api/bilisound";
import { convertToHTTPS } from "../utils/string";
import { formatDate } from "../utils/misc";
import { SCREEN_BREAKPOINTS } from "../constants/style";
import useCommonColors from "../hooks/useCommonColors";

const detailMaxHeight = 192;

export interface VideoMetaProps {
    meta: GetBilisoundMetadataResponse;
}

const VideoMeta: React.FC<VideoMetaProps> = ({ meta }) => {
    const { primaryColor, textBasicColor } = useCommonColors();
    const { width } = useWindowDimensions();

    // 展示更多
    const [showMore, setShowMore] = useState(false);

    const showMoreEl = (
        <Text selectable fontSize={15} lineHeight={15 * 1.5}>
            {meta.desc}
        </Text>
    );

    const showMoreElHidden = (
        <Pressable
            sx={{
                position: "relative",
            }}
            onPress={() => setShowMore(true)}
        >
            <MaskedView
                style={{
                    height: detailMaxHeight,
                }}
                maskElement={
                    <Box
                        sx={{
                            overflow: "scroll",
                            maxHeight: detailMaxHeight,
                        }}
                    >
                        <Text
                            onLayout={(e) => {
                                if (e.nativeEvent.layout.height < detailMaxHeight) {
                                    setShowMore(true);
                                }
                            }}
                            fontSize={15}
                            lineHeight={15 * 1.5}
                        >
                            {meta.desc}
                        </Text>
                    </Box>
                }
            >
                <LinearGradient
                    colors={[`${textBasicColor}ff`, `${textBasicColor}00`]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 0.9 }}
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                    aria-hidden
                />
            </MaskedView>
            <Box
                sx={{
                    position: "absolute",
                    width: "100%",
                    left: 0,
                    bottom: 0,
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    gap: 2,
                    padding: 16,
                }}
            >
                <Text
                    sx={{
                        color: "$primary500",
                        fontWeight: "700",
                        fontSize: 14,
                    }}
                >
                    查看更多
                </Text>
                <Entypo name="chevron-down" size={20} color={primaryColor} />
            </Box>
        </Pressable>
    );

    return (
        <Box
            sx={
                width >= SCREEN_BREAKPOINTS.md
                    ? {
                          padding: 24,
                          flexDirection: "row",
                          gap: 24,
                      }
                    : {
                          padding: 16,
                          flexDirection: "column",
                          gap: 16,
                      }
            }
        >
            {/* 封面图 */}
            <Image
                source={convertToHTTPS(meta.pic)}
                style={{
                    aspectRatio: "16/9",
                    borderRadius: 8,
                    flex: 1,
                }}
            />

            <Box flex={1}>
                {/* 标题 */}
                <Text
                    sx={{
                        fontSize: 16,
                        fontWeight: "bold",
                        marginBottom: 16,
                        lineHeight: 24
                    }}
                    selectable
                >
                    {meta.title}
                </Text>

                {/* UP 主信息 */}
                <Box
                    sx={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 16,
                    }}
                >
                    <Image
                        source={convertToHTTPS(meta.owner.face)}
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 18,
                            aspectRatio: "1/1",
                            flexShrink: 0,
                        }}
                    />
                    <Text
                        sx={{
                            flexGrow: 1,
                            fontSize: 14,
                            fontWeight: "bold",
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {meta.owner.name}
                    </Text>
                    <Text
                        sx={{
                            flexShrink: 0,
                            fontSize: 14,
                            opacity: 0.5,
                        }}
                    >
                        {formatDate(meta.pubDate, "yyyy-MM-dd")}
                    </Text>
                </Box>

                {/* 简介 */}
                {showMore ? showMoreEl : showMoreElHidden}
            </Box>
        </Box>
    );
};

export default VideoMeta;
