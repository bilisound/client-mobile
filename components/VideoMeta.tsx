import { Entypo, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import { Platform, useColorScheme, View } from "react-native";
import { twMerge } from "tailwind-merge";

import { GetBilisoundMetadataResponse } from "~/api/bilisound";
import PotatoButton from "~/components/potato-ui/PotatoButton";
import { createIcon } from "~/components/potato-ui/utils/icon";
import { Pressable } from "~/components/ui/pressable";
import { Skeleton } from "~/components/ui/skeleton";
import { Text } from "~/components/ui/text";
import { VStack } from "~/components/ui/vstack";
import useApplyPlaylistStore from "~/store/apply-playlist";
import { getImageProxyUrl } from "~/utils/constant-helper";
import { formatDate } from "~/utils/datetime";
import log from "~/utils/logger";

const detailMaxHeight = 192;

const AddIcon = createIcon(Feather, "plus");
const PlaylistIcon = createIcon(MaterialCommunityIcons, "playlist-music");

export type VideoMetaProps =
    | {
          meta: GetBilisoundMetadataResponse;
          skeleton?: false;
      }
    | {
          meta?: GetBilisoundMetadataResponse;
          skeleton: true;
      };

export interface VideoMetaBaseProps {
    className?: string;
}

const VideoMeta: React.FC<VideoMetaProps & VideoMetaBaseProps> = ({ meta, skeleton, className }) => {
    const [showMore, setShowMore] = useState(false);
    const colorScheme = useColorScheme();

    const { setPlaylistDetail, setName, setDescription, setSource, setCover } = useApplyPlaylistStore(state => ({
        setPlaylistDetail: state.setPlaylistDetail,
        setName: state.setName,
        setDescription: state.setDescription,
        setSource: state.setSource,
        setCover: state.setCover,
    }));

    function handleCreatePlaylist() {
        if (!meta) {
            log.error("使用 handleCreatePlaylist 函数时，meta 没有准备就绪！");
            return;
        }
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
                extendedData: null,
            })),
        );
        setName(meta.title);
        setDescription(meta.desc);
        setSource({ type: "video", bvid: meta.bvid, originalTitle: meta.title, lastSyncAt: new Date().getTime() });
        setCover(meta.pic);
        router.push(`/apply-playlist`);
    }

    const showMoreEl = skeleton ? null : (
        <Text className="text-[15px] leading-[22.5px] text-typography-700" selectable>
            {meta.desc}
        </Text>
    );

    const showMoreElHidden = skeleton ? null : (
        <Pressable className="relative" onPress={() => setShowMore(true)}>
            {Platform.OS === "web" ? (
                <>
                    <View className="overflow-hidden" style={{ maxHeight: detailMaxHeight }}>
                        <Text
                            onLayout={e => {
                                if (e.nativeEvent.layout.height < detailMaxHeight) {
                                    setShowMore(true);
                                }
                            }}
                            className="text-[15px] leading-normal text-typography-700"
                        >
                            {meta.desc}
                        </Text>
                    </View>
                    <LinearGradient
                        colors={colorScheme === "dark" ? ["#17171700", "#171717"] : ["#ffffff00", "#ffffff"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 0.9 }}
                        className="absolute w-full left-0 bottom-0 justify-center items-center flex-row gap-0.5 p-4 pt-10"
                    >
                        <Text className="text-accent-500 font-bold text-sm">查看更多</Text>
                        <Entypo name="chevron-down" size={20} className="color-accent-500" />
                    </LinearGradient>
                </>
            ) : (
                <>
                    <MaskedView
                        style={{
                            height: detailMaxHeight,
                        }}
                        maskElement={
                            <View className="overflow-hidden" style={{ maxHeight: detailMaxHeight }}>
                                <Text
                                    onLayout={e => {
                                        if (e.nativeEvent.layout.height < detailMaxHeight) {
                                            setShowMore(true);
                                        }
                                    }}
                                    className="text-[15px] leading-normal text-typography-700"
                                >
                                    {meta.desc}
                                </Text>
                            </View>
                        }
                    >
                        <LinearGradient
                            colors={colorScheme === "dark" ? ["#dbdbdc", "#dbdbdc00"] : ["#525252", "#52525200"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 0.9 }}
                            className="w-full h-full"
                            aria-hidden
                        />
                    </MaskedView>
                    <View className="absolute w-full left-0 bottom-0 justify-center items-center flex-row gap-0.5 p-4">
                        <Text className="text-accent-500 font-bold text-sm">查看更多</Text>
                        <Entypo name="chevron-down" size={20} className="color-accent-500" />
                    </View>
                </>
            )}
        </Pressable>
    );

    const showMoreComputed = showMore ? showMoreEl : showMoreElHidden;

    return (
        <View className={twMerge("p-4 gap-4", className)}>
            {skeleton ? (
                <Skeleton className="aspect-[16/9] rounded-lg w-[unset] h-[unset]" />
            ) : (
                <Image source={getImageProxyUrl(meta.pic, meta.bvid)} className="aspect-[16/9] rounded-lg" />
            )}
            <View>
                {skeleton ? (
                    <View className="gap-2 py-1 mb-4">
                        <Skeleton className="rounded-full h-4 w-full" />
                        <Skeleton className="rounded-full h-4 w-1/2" />
                    </View>
                ) : (
                    <Text className="text-base font-bold mb-4 leading-6 text-typography-700" selectable>
                        {meta.title}
                    </Text>
                )}
                <View className="flex-row items-center gap-3 mb-4">
                    {skeleton ? (
                        <>
                            <Skeleton className="w-9 h-9 relative flex-shrink-0 rounded-full" />
                            <View className="flex-grow">
                                <Skeleton className="rounded-full w-20 h-[14px]" />
                            </View>
                            <Skeleton className="rounded-full flex-shrink-0 w-16 h-[14px]" />
                        </>
                    ) : (
                        <>
                            <Image
                                source={getImageProxyUrl(meta.owner.face, meta.bvid)}
                                className="w-9 h-9 rounded-full aspect-square flex-shrink-0"
                            />
                            <Text
                                className="flex-grow text-sm font-bold text-typography-700"
                                numberOfLines={1}
                                ellipsizeMode="tail"
                            >
                                {meta.owner.name}
                            </Text>
                            <Text className="flex-shrink-0 text-sm opacity-50 text-typography-700">
                                {formatDate(meta.pubDate, "yyyy-MM-dd")}
                            </Text>
                        </>
                    )}
                </View>

                {(meta?.desc ?? "").trim() !== "" && showMoreComputed}
                {skeleton && (
                    <VStack className="py-[3.75px] gap-[7.5px]">
                        <Skeleton className="rounded-full h-[15px] w-full" />
                        <Skeleton className="rounded-full h-[15px] w-full" />
                        <Skeleton className="rounded-full h-[15px] w-full" />
                        <Skeleton className="rounded-full h-[15px] w-full" />
                        <Skeleton className="rounded-full h-[15px] w-1/2" />
                    </VStack>
                )}

                {skeleton ? null : (
                    <View className="flex-row gap-2 mt-5">
                        <PotatoButton rounded onPress={handleCreatePlaylist} Icon={AddIcon} className="pl-4">
                            创建歌单
                        </PotatoButton>
                        {meta.seasonId ? (
                            <PotatoButton
                                rounded
                                variant="outline"
                                onPress={() => {
                                    router.push(
                                        `/remote-list?mode=season&userId=${meta.owner.mid}&listId=${meta.seasonId}`,
                                    );
                                }}
                                Icon={PlaylistIcon}
                            >
                                查看所属合集
                            </PotatoButton>
                        ) : null}
                    </View>
                )}
            </View>
        </View>
    );
};

export default VideoMeta;
