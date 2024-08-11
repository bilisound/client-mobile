import { Entypo, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Pressable, Box, ButtonText, Button, ButtonIcon } from "@gluestack-ui/themed";
import MaskedView from "@react-native-masked-view/masked-view";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import { Platform, View, Text } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { GetBilisoundMetadataResponse } from "~/api/bilisound";
import useApplyPlaylistStore from "~/store/apply-playlist";
import { getImageProxyUrl } from "~/utils/constant-helper";
import { formatDate } from "~/utils/misc";

const detailMaxHeight = 192;

export interface VideoMetaProps {
    meta: GetBilisoundMetadataResponse;
}

const VideoMeta: React.FC<VideoMetaProps> = ({ meta }) => {
    const { theme, styles } = useStyles(styleSheet);
    const textBasicColor = theme.colorTokens.foreground;
    const accentColor = theme.colors.accent[500];
    const bgColor = theme.colorTokens.background;

    // 展示更多
    const [showMore, setShowMore] = useState(false);

    // 添加歌单
    const { setPlaylistDetail, setName } = useApplyPlaylistStore(state => ({
        setPlaylistDetail: state.setPlaylistDetail,
        setName: state.setName,
    }));

    // 批量添加操作
    function handleCreatePlaylist() {
        setPlaylistDetail(
            meta.pages.map(e => ({
                author: meta.owner.name ?? "",
                bvid: meta.bvid ?? "",
                duration: e.duration,
                episode: e.page,
                title: e.part,
                imgUrl: meta.pic ?? "",
            })),
        );
        setName(meta.title);
        router.push(`/apply-playlist`);
    }

    const showMoreEl = (
        <Text selectable style={styles.descText}>
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
            {Platform.OS === "web" ? (
                <>
                    <Box
                        sx={{
                            overflow: "hidden",
                            maxHeight: detailMaxHeight,
                        }}
                    >
                        <Text
                            onLayout={e => {
                                if (e.nativeEvent.layout.height < detailMaxHeight) {
                                    setShowMore(true);
                                }
                            }}
                            style={styles.descText}
                        >
                            {meta.desc}
                        </Text>
                    </Box>
                    <LinearGradient
                        colors={[`${bgColor}00`, `${bgColor}ff`]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 0.9 }}
                        style={{
                            position: "absolute",
                            width: "100%",
                            left: 0,
                            bottom: 0,
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "row",
                            gap: 2,
                            padding: 16,
                            paddingTop: 40,
                        }}
                    >
                        <Text style={styles.showMoreText}>查看更多</Text>
                        <Entypo name="chevron-down" size={20} color={accentColor} />
                    </LinearGradient>
                </>
            ) : (
                <>
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
                                    onLayout={e => {
                                        if (e.nativeEvent.layout.height < detailMaxHeight) {
                                            setShowMore(true);
                                        }
                                    }}
                                    style={styles.descText}
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
                        <Text style={styles.showMoreText}>查看更多</Text>
                        <Entypo name="chevron-down" size={20} color={accentColor} />
                    </Box>
                </>
            )}
        </Pressable>
    );

    const showMoreComputed = showMore ? showMoreEl : showMoreElHidden;

    return (
        <Box
            sx={{
                padding: 16,
                flexDirection: "column",
                gap: 16,
            }}
        >
            {/* 封面图 */}
            <Image
                source={getImageProxyUrl(meta.pic, meta.bvid)}
                style={{
                    aspectRatio: "16/9",
                    borderRadius: 8,
                    // flex: width >= SCREEN_BREAKPOINTS.md ? 1 : undefined,
                }}
            />

            <Box flex={1}>
                {/* 标题 */}
                <Text style={styles.titleText} selectable>
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
                        source={getImageProxyUrl(meta.owner.face, meta.bvid)}
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 18,
                            aspectRatio: "1/1",
                            flexShrink: 0,
                        }}
                    />
                    <Text style={styles.authorText} numberOfLines={1} ellipsizeMode="tail">
                        {meta.owner.name}
                    </Text>
                    <Text style={styles.dateText}>{formatDate(meta.pubDate, "yyyy-MM-dd")}</Text>
                </Box>

                {/* 简介 */}
                {meta.desc.trim() !== "" && showMoreComputed}

                {/* 操作 */}
                <Box flexDirection="row" gap={8}>
                    <Button
                        mt="$5"
                        rounded="$full"
                        size="md"
                        variant="solid"
                        action="primary"
                        isDisabled={false}
                        isFocusVisible={false}
                        onPress={handleCreatePlaylist}
                    >
                        <ButtonIcon
                            as={MaterialIcons}
                            // @ts-ignore
                            name="add"
                        />
                        <ButtonText fontSize="$sm"> 创建歌单</ButtonText>
                    </Button>
                    {meta.seasonId ? (
                        <Button
                            mt="$5"
                            rounded="$full"
                            size="md"
                            variant="outline"
                            action="primary"
                            isDisabled={false}
                            isFocusVisible={false}
                            onPress={() => {
                                router.push(
                                    `/remote-list?mode=episode&userId=${meta.owner.mid}&listId=${meta.seasonId}`,
                                );
                            }}
                        >
                            <ButtonIcon
                                as={MaterialCommunityIcons}
                                // @ts-ignore
                                name="playlist-music"
                            />
                            <ButtonText fontSize="$sm"> 查看所属合集</ButtonText>
                        </Button>
                    ) : null}
                    <View
                        style={{
                            height: 40,
                            backgroundColor: "blue",
                            marginTop: 20,
                            borderRadius: 99999,
                            paddingLeft: 20,
                            paddingRight: 20,
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 8,
                        }}
                    >
                        <MaterialCommunityIcons name="playlist-music" size={20} color="white" />
                        <Text style={{ fontWeight: "600", color: "white" }}>测试文本</Text>
                    </View>
                </Box>
            </Box>
        </Box>
    );
};

export default VideoMeta;

const styleSheet = createStyleSheet(theme => ({
    descText: {
        fontSize: 15,
        lineHeight: 15 * 1.5,
    },
    showMoreText: {
        color: theme.colors.accent[500],
        fontWeight: "700",
        fontSize: 14,
    },
    titleText: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 16,
        lineHeight: 24,
    },
    authorText: { flexGrow: 1, fontSize: 14, fontWeight: "bold" },
    dateText: {
        flexShrink: 0,
        fontSize: 14,
        opacity: 0.5,
    },
}));
