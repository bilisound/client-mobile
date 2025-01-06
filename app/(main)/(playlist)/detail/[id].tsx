import { Text } from "~/components/ui/text";
import { useTabSafeAreaInsets } from "~/hooks/useTabSafeAreaInsets";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { PLAYLIST_ON_QUEUE, playlistStorage, usePlaylistOnQueue } from "~/storage/playlist";
import {
    deletePlaylistDetail,
    getPlaylistDetail,
    getPlaylistMeta,
    syncPlaylistAmount,
} from "~/storage/sqlite/playlist";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Layout, LayoutButton } from "~/components/layout";
import { FlashList } from "@shopify/flash-list";
import { SongItem } from "~/components/song-item";
import { DualScrollView } from "~/components/dual-scroll-view";
import { PlaylistDetail, PlaylistMeta } from "~/storage/sqlite/schema";
import React, { useEffect, useRef, useState } from "react";
import Animated, { useAnimatedProps, useSharedValue, withTiming } from "react-native-reanimated";
import { convertToRelativeTime } from "~/utils/datetime";
import { updatePlaylist } from "~/business/playlist/update";
import { getImageProxyUrl } from "~/utils/constant-helper";
import { Circle as OrigCircle, Svg } from "react-native-svg";
import { useWindowDimensions, Vibration, View } from "react-native";
import { Image } from "expo-image";
import { cssInterop } from "nativewind";
import Toast from "react-native-toast-message";
import { twMerge } from "tailwind-merge";
import log from "~/utils/logger";
import { Button, ButtonMonIcon, ButtonOuter, ButtonText } from "~/components/ui/button";
import { Modal, ModalBackdrop, ModalContent, ModalBody } from "~/components/ui/modal";
import { replaceQueueWithPlaylist } from "~/business/playlist/handler";
import { useConfirm } from "~/hooks/useConfirm";
import {
    AlertDialog,
    AlertDialogBackdrop,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
} from "~/components/ui/alert-dialog";
import { Heading } from "~/components/ui/heading";
import * as Player from "@bilisound/player";
import { QUEUE_IS_RANDOMIZED, QUEUE_PLAYING_MODE, queueStorage } from "~/storage/queue";
import useMultiSelect from "~/hooks/useMultiSelect";
import { useBreakpointValue } from "~/components/ui/utils/use-break-point-value";

cssInterop(OrigCircle, {
    className: {
        // @ts-ignore workaround
        target: "style",
        nativeStyleToProp: {
            stroke: true,
            fill: true,
        },
    },
});

const Circle = Animated.createAnimatedComponent(OrigCircle);

function extractAndProcessImgUrls(playlistDetails: PlaylistDetail[]) {
    const imgUrls = playlistDetails.map(detail => detail.imgUrl);
    return Array.from(new Set(imgUrls));
}

function ImagesGroup({ images: origImages }: { images: string[] }) {
    const images = origImages.map(image => getImageProxyUrl(image));
    if (images.length === 0) {
        return <View className="aspect-video rounded-lg bg-background-100" />;
    }
    if (images.length >= 1 && images.length <= 3) {
        return <Image source={images[0]} className="aspect-video rounded-lg" />;
    }
    return (
        <View className="aspect-video rounded-lg overflow-hidden">
            <View className="flex-row flex-1">
                <Image className="aspect-video flex-1" source={images[0]} />
                <Image className="aspect-video flex-1" source={images[1]} />
            </View>
            <View className="flex-row flex-1">
                <Image className="aspect-video flex-1" source={images[2]} />
                <Image className="aspect-video flex-1" source={images[3]} />
            </View>
        </View>
    );
}
function Header({
    meta,
    images,
    onPlay,
    showPlayButton,
    className,
}: {
    meta: PlaylistMeta;
    images: string[];
    onPlay: () => void;
    showPlayButton: boolean;
    className?: string;
}) {
    const queryClient = useQueryClient();
    const [syncing, setSyncing] = useState(false);

    // 进度条处理
    const [showModal, setShowModal] = useState(false);
    const ref = useRef(null);
    const [progress, setProgress] = useState(0);
    const displayProgress = useSharedValue(0);
    const animatedProps = useAnimatedProps(() => {
        const strokeDashoffset = (1 - displayProgress.value) * 138.16;
        return {
            strokeDashoffset,
        };
    });
    useEffect(() => {
        displayProgress.value = withTiming(progress);
    }, [displayProgress, progress]);

    // 同步时间处理
    const [lastSyncString, setLastSyncString] = useState("");
    useEffect(() => {
        function action() {
            if (!meta.source) {
                return;
            }
            setLastSyncString(convertToRelativeTime(JSON.parse(meta.source).lastSyncAt));
        }
        const handle = setInterval(action, 5000);
        action();
        return () => clearInterval(handle);
    }, [meta]);

    // 同步操作
    async function handleSync() {
        setShowModal(true);
        setSyncing(true);
        setProgress(0);
        try {
            const source = meta.source;
            if (!source) {
                return;
            }
            const total = await updatePlaylist(meta.id, JSON.parse(source), progress => {
                setProgress(progress);
            });
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["playlist_meta"] }),
                queryClient.invalidateQueries({ queryKey: ["playlist_meta_apply"] }),
                queryClient.invalidateQueries({ queryKey: [`playlist_meta_${meta.id}`] }),
                queryClient.invalidateQueries({ queryKey: [`playlist_detail_${meta.id}`] }),
            ]);
            Toast.show({
                type: "success",
                text1: "歌单同步成功",
                text2: `目前歌单中有 ${total} 首歌曲`,
            });
        } catch (e) {
            Toast.show({
                type: "error",
                text1: "歌单同步失败",
                text2: "可能是网络请求异常，请稍后再试",
            });
            log.error("列表同步失败：" + e);
        } finally {
            setShowModal(false);
            setSyncing(false);
        }
    }

    const imgUrl = meta.imgUrl;

    return (
        <View className={twMerge("gap-4", className)}>
            {imgUrl ? (
                <Image source={getImageProxyUrl(imgUrl)} className="aspect-video rounded-lg" />
            ) : (
                <ImagesGroup images={images} />
            )}
            <View className="flex-row gap-4">
                <View className="flex-1">
                    <Text className="text-[1.25rem] font-semibold leading-normal">{meta.title}</Text>
                    <View className="flex-row">
                        <Text className="opacity-60 mt-2 text-sm leading-normal">
                            {`${meta.amount} 首歌曲` + (meta.source ? ` ・ 上次同步：${lastSyncString}` : "")}
                        </Text>
                    </View>
                    {showPlayButton && (
                        <View className="flex-row mt-4 gap-2">
                            <ButtonOuter className={"rounded-full"}>
                                <Button className={"rounded-full"} onPress={onPlay}>
                                    <ButtonMonIcon name={"fa6-solid:play"} size={16} />
                                    <ButtonText>播放</ButtonText>
                                </Button>
                            </ButtonOuter>
                            {meta.source ? (
                                <ButtonOuter className={"rounded-full"}>
                                    <Button
                                        className={"rounded-full"}
                                        onPress={handleSync}
                                        disabled={syncing}
                                        aria-label="同步"
                                        icon={true}
                                    >
                                        <ButtonMonIcon name={"fa6-solid:arrow-rotate-left"} size={16} />
                                    </Button>
                                </ButtonOuter>
                            ) : null}
                        </View>
                    )}
                </View>
            </View>
            {(meta.description ?? "").trim() && (
                <Text className="text-base leading-normal opacity-80 pb-2" selectable>
                    {meta.description}
                </Text>
            )}
            {/* 以后如果有更多的地方需要用这种 modal，考虑封装成一个组件 */}
            <Modal isOpen={showModal} finalFocusRef={ref} size="md">
                <ModalBackdrop />
                <ModalContent className="p-3">
                    <ModalBody>
                        <View className="w-full flex-row gap-3 items-center">
                            <View className="-rotate-90 w-16 h-16">
                                <Svg width={64} height={64} viewBox="0 0 64 64">
                                    <Circle
                                        // @ts-ignore workaround
                                        className="stroke-primary-100"
                                        r={22}
                                        cx={32}
                                        cy={32}
                                        fill="transparent"
                                        strokeWidth={6}
                                        strokeDasharray="138.16px"
                                    />
                                    <Circle
                                        r={22}
                                        cx={32}
                                        cy={32}
                                        // @ts-ignore workaround
                                        className="stroke-primary-400"
                                        strokeWidth={6}
                                        strokeLinecap="round"
                                        // 138.16 is 0%, 0 is 100%
                                        // strokeDashoffset={(1 - progress) * 138.16}
                                        animatedProps={animatedProps}
                                        fill="transparent"
                                        strokeDasharray="138.16px"
                                    />
                                </Svg>
                            </View>
                            <Text className="text-typography-700 text-sm">正在同步在线播放列表……</Text>
                        </View>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </View>
    );
}

export default function Page() {
    const queryClient = useQueryClient();
    const tabSafeAreaEdgeInsets = useTabSafeAreaInsets();
    const { id } = useLocalSearchParams<{ id: string }>();

    const [, setPlaylistOnQueue] = usePlaylistOnQueue();

    const { data: metaRaw } = useQuery({
        queryKey: [`playlist_meta_${id}`],
        queryFn: () => getPlaylistMeta(Number(id)),
    });

    const meta = metaRaw?.[0];

    const { data: playlistDetail } = useQuery({
        queryKey: [`playlist_detail_${id}`],
        queryFn: () => getPlaylistDetail(Number(id)),
    });

    // 模态框管理
    const { dialogInfo, setDialogInfo, modalVisible, setModalVisible, handleClose, dialogCallback } = useConfirm();

    // 播放请求
    async function handlePlay(index = 0) {
        const from = (await Player.getTracks())[index];
        const to = playlistDetail?.[index];
        const activeTrack = await Player.getCurrentTrack();
        const onQueue = JSON.parse(playlistStorage.getString(PLAYLIST_ON_QUEUE) ?? "{}")?.value;
        // 前提条件：
        // playlistOnQueue 的 id 是这个歌单的 id
        // 有 activeTrack
        // 当前 queue 对应 index 的 bvid 和 episode 与请求播放的一致
        if (
            onQueue?.id === Number(id) &&
            activeTrack &&
            from?.extendedData?.id === to?.bvid &&
            from?.extendedData?.episode === to?.episode
        ) {
            log.debug("当前队列中的内容来自本歌单，就地跳转");
            await Player.jump(index);
            return;
        }
        if (onQueue || (await Player.getTracks()).length <= 0) {
            return handlePlayConfirm(index);
        }
        dialogCallback.current = () => {
            return handlePlayConfirm(index);
        };

        // 播放列表可能是脏的，需要进行替换操作
        setDialogInfo(prevState => ({
            ...prevState,
            title: "替换播放队列确认",
            description: "播放本歌单中的歌曲，将会把当前播放队列替换为本歌单。确定要继续吗？",
        }));
        setModalVisible(true);
        dialogCallback.current = async () => {
            return handlePlayConfirm(index);
        };
    }

    // 播放请求确认
    async function handlePlayConfirm(index: number) {
        log.debug("将队列中的内容设置为本歌单");
        await replaceQueueWithPlaylist(Number(id), index);
        queueStorage.set(QUEUE_IS_RANDOMIZED, false);
        queueStorage.set(QUEUE_PLAYING_MODE, "normal");
        setPlaylistOnQueue({ value: meta });
    }

    // 多选管理
    const isEditLocked = !meta || !!meta?.source;
    const { clear, toggle, selected, setAll, reverse } = useMultiSelect<number>();
    const [editing, setEditing] = useState(false);
    const editingHeight = 56;

    // 多选按动操作
    function handleLongPress(index: number) {
        if (isEditLocked) {
            Toast.show({
                type: "info",
                text1: "当前歌单已绑定在线播放列表",
                text2: "如需进行本地编辑，请先进入「修改信息」页面进行解绑操作",
            });
            return;
        }
        if (!editing) {
            Vibration.vibrate(25);
            setEditing(true);
            toggle(index);
        }
    }

    // 删除项目操作
    function handleDelete() {
        dialogCallback.current = async () => {
            if (!playlistDetail) {
                return;
            }
            const onQueue = JSON.parse(playlistStorage.getString(PLAYLIST_ON_QUEUE) ?? "{}")?.value;

            // 注意，这里的 selected 是数组的 index，不是项目在数据库中的 id！！
            for (const e of selected) {
                await deletePlaylistDetail(playlistDetail[e].id);
            }
            await syncPlaylistAmount(Number(id));
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["playlist_meta"] }),
                queryClient.invalidateQueries({ queryKey: ["playlist_meta_apply"] }),
                queryClient.invalidateQueries({ queryKey: [`playlist_meta_${id}`] }),
                queryClient.invalidateQueries({ queryKey: [`playlist_detail_${id}`] }),
            ]);
            if (onQueue?.id === Number(id)) {
                setPlaylistOnQueue(undefined);
            }
            clear();
        };
        setDialogInfo(prevState => ({
            ...prevState,
            title: "删除曲目确认",
            description: `确定要从本歌单中删除 ${selected.size} 首曲目吗？`,
        }));
        setModalVisible(true);
    }

    // 返回时先关闭编辑模式
    const navigation = useNavigation();
    useEffect(() => {
        const handler = (e: any) => {
            if (!editing) {
                return;
            }
            e.preventDefault();
            setEditing(false);
            clear();
            navigation.removeListener("beforeRemove", handler);
        };
        if (editing) {
            navigation.addListener("beforeRemove", handler);
        }
        return () => {
            navigation.removeListener("beforeRemove", handler);
        };
    }, [clear, editing, navigation]);

    // 全部数据是否已经完成加载
    const loaded = meta && playlistDetail;

    return (
        <Layout
            title={"查看详情"}
            leftAccessories={"BACK_BUTTON"}
            rightAccessories={
                editing ? (
                    <LayoutButton
                        iconName={"fa6-solid:check"}
                        aria-label={"完成"}
                        onPress={() => {
                            setEditing(false);
                            clear();
                        }}
                    />
                ) : null
            }
            edgeInsets={{ ...tabSafeAreaEdgeInsets, bottom: 0 }}
        >
            {/* 内容区 */}
            {loaded ? (
                <DualScrollView
                    edgeInsets={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    header={
                        <Header
                            meta={meta}
                            images={extractAndProcessImgUrls(playlistDetail)}
                            showPlayButton={playlistDetail.length > 0}
                            onPlay={() => handlePlay()}
                        />
                    }
                    headerContainerStyle={{
                        paddingBottom: tabSafeAreaEdgeInsets.bottom + 16,
                    }}
                    list={({ contentContainerStyle }) => (
                        <FlashList
                            contentContainerStyle={{
                                ...contentContainerStyle,
                                paddingBottom: tabSafeAreaEdgeInsets.bottom + (editing ? editingHeight : 0),
                            }}
                            data={playlistDetail}
                            extraData={[editing, selected.size]}
                            renderItem={({ item, index }) => (
                                <SongItem
                                    data={item}
                                    index={index + 1}
                                    onRequestPlay={() => handlePlay(index)}
                                    onToggle={() => toggle(index)}
                                    onLongPress={() => handleLongPress(index)}
                                    isChecking={editing}
                                    isChecked={selected.has(index)}
                                />
                            )}
                            estimatedItemSize={64}
                            ListHeaderComponent={
                                <Header
                                    className={"flex md:hidden px-4 pb-4"}
                                    meta={meta}
                                    images={extractAndProcessImgUrls(playlistDetail)}
                                    showPlayButton={playlistDetail.length > 0}
                                    onPlay={() => handlePlay()}
                                />
                            }
                        />
                    )}
                />
            ) : null}

            {loaded ? (
                <View
                    className={`${editing ? "flex" : "hidden"} absolute left-0 bottom-0 w-full bg-blue-300`}
                    style={{ height: tabSafeAreaEdgeInsets.bottom + editingHeight }}
                >
                    <View
                        className={
                            "bg-background-0 border-t border-background-50 flex-row items-center justify-between gap-2 px-2"
                        }
                        style={{ height: editingHeight }}
                    >
                        {/* todo 移动端布局！！ */}
                        <View className={"flex-row items-center gap-2"}>
                            <ButtonOuter>
                                <Button
                                    variant={"ghost"}
                                    onPress={() =>
                                        setAll(Array.from({ length: playlistDetail.length }).map((_, i) => i))
                                    }
                                    className={"px-4"}
                                >
                                    <ButtonMonIcon name={"fa6-solid:check-double"} />
                                    <ButtonText>全选</ButtonText>
                                </Button>
                            </ButtonOuter>
                            <ButtonOuter>
                                <Button
                                    variant={"ghost"}
                                    onPress={() =>
                                        reverse(Array.from({ length: playlistDetail.length }).map((_, i) => i))
                                    }
                                    className={"px-4"}
                                >
                                    <ButtonMonIcon name={"fa6-solid:circle-half-stroke"} />
                                    <ButtonText>反选</ButtonText>
                                </Button>
                            </ButtonOuter>
                            <ButtonOuter>
                                <Button variant={"ghost"} onPress={() => {}} className={"px-4"}>
                                    <ButtonMonIcon name={"fa6-solid:trash"} />
                                    <ButtonText>删除</ButtonText>
                                </Button>
                            </ButtonOuter>
                        </View>
                        {/* todo 增加菜单，放置删除和创建新歌单功能 */}
                        <ButtonOuter>
                            <Button
                                variant={"ghost"}
                                icon={true}
                                onPress={() => setEditing(false)}
                                aria-label={"更多操作"}
                            >
                                <ButtonMonIcon name={"fa6-solid:ellipsis-vertical"} size={18} />
                            </Button>
                        </ButtonOuter>
                    </View>
                </View>
            ) : null}

            {/* 用户警告框 */}
            <AlertDialog isOpen={modalVisible} onClose={() => handleClose(false)} size="md">
                <AlertDialogBackdrop />
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <Heading className="text-typography-950 font-semibold" size="lg">
                            {dialogInfo.title}
                        </Heading>
                    </AlertDialogHeader>
                    <AlertDialogBody className="mt-4 mb-6">
                        <Text size="sm" className="leading-normal">
                            {dialogInfo.description}
                        </Text>
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <ButtonOuter>
                            <Button variant="ghost" onPress={() => handleClose(false)}>
                                <ButtonText>{dialogInfo.cancel}</ButtonText>
                            </Button>
                        </ButtonOuter>
                        <ButtonOuter>
                            <Button onPress={() => handleClose(true)}>
                                <ButtonText>{dialogInfo.ok}</ButtonText>
                            </Button>
                        </ButtonOuter>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Layout>
    );
}
