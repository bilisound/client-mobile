import { Entypo, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import { Platform, Text, Pressable, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { GetBilisoundMetadataResponse } from "~/api/bilisound";
import Button from "~/components/potato-ui/Button";
import { createIcon } from "~/components/potato-ui/utils/icon";
import useApplyPlaylistStore from "~/store/apply-playlist";
import { getImageProxyUrl } from "~/utils/constant-helper";
import { formatDate } from "~/utils/misc";

const detailMaxHeight = 192;

const AddIcon = createIcon(Feather, "plus");
const PlaylistIcon = createIcon(MaterialCommunityIcons, "playlist-music");

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
                id: 0,
                playlistId: 0,
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
        <Pressable style={styles.showMoreContainer} onPress={() => setShowMore(true)}>
            {Platform.OS === "web" ? (
                <>
                    <View style={styles.overflowHidden}>
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
                    </View>
                    <LinearGradient
                        colors={[`${bgColor}00`, `${bgColor}ff`]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 0.9 }}
                        style={styles.gradientOverlay}
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
                            <View
                                style={{
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
                            </View>
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
                    <View
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
                        }}
                    >
                        <Text style={styles.showMoreText}>查看更多</Text>
                        <Entypo name="chevron-down" size={20} color={accentColor} />
                    </View>
                </>
            )}
        </Pressable>
    );

    const showMoreComputed = showMore ? showMoreEl : showMoreElHidden;

    return (
        <View style={styles.container}>
            <Image source={getImageProxyUrl(meta.pic, meta.bvid)} style={styles.coverImage} />
            <View style={styles.contentContainer}>
                <Text style={styles.titleText} selectable>
                    {meta.title}
                </Text>

                <View style={styles.authorInfoContainer}>
                    <Image source={getImageProxyUrl(meta.owner.face, meta.bvid)} style={styles.authorAvatar} />
                    <Text style={styles.authorText} numberOfLines={1} ellipsizeMode="tail">
                        {meta.owner.name}
                    </Text>
                    <Text style={styles.dateText}>{formatDate(meta.pubDate, "yyyy-MM-dd")}</Text>
                </View>

                {meta.desc.trim() !== "" && showMoreComputed}

                <View style={styles.actionContainer}>
                    <Button rounded onPress={handleCreatePlaylist} Icon={AddIcon} style={styles.createPlaylistButton}>
                        创建歌单
                    </Button>
                    {meta.seasonId ? (
                        <Button
                            rounded
                            variant="outline"
                            onPress={() => {
                                router.push(
                                    `/remote-list?mode=episode&userId=${meta.owner.mid}&listId=${meta.seasonId}`,
                                );
                            }}
                            Icon={PlaylistIcon}
                        >
                            查看所属合集
                        </Button>
                    ) : null}
                </View>
            </View>
        </View>
    );
};

export default VideoMeta;

const styleSheet = createStyleSheet(theme => ({
    descText: {
        fontSize: 15,
        lineHeight: 15 * 1.5,
        color: theme.colorTokens.foreground,
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
        color: theme.colorTokens.foreground,
    },
    authorText: {
        flexGrow: 1,
        fontSize: 14,
        fontWeight: "bold",
        color: theme.colorTokens.foreground,
    },
    dateText: {
        flexShrink: 0,
        fontSize: 14,
        opacity: 0.5,
        color: theme.colorTokens.foreground,
    },
    container: {
        padding: 16,
        flexDirection: "column",
        gap: 16,
    },
    coverImage: {
        aspectRatio: "16/9",
        borderRadius: 8,
    },
    contentContainer: {
        flex: 1,
    },
    authorInfoContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 16,
    },
    authorAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        aspectRatio: "1/1",
        flexShrink: 0,
    },
    actionContainer: {
        flexDirection: "row",
        gap: 8,
        marginTop: 20,
    },
    createPlaylistButton: {
        paddingLeft: 16,
    },
    showMoreContainer: {
        position: "relative",
    },
    overflowHidden: {
        overflow: "hidden",
        maxHeight: detailMaxHeight,
    },
    gradientOverlay: {
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
    },
}));
