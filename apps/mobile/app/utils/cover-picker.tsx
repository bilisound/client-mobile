import { useLocalSearchParams } from "expo-router";
import { Layout } from "~/components/layout";
import { useWindowDimensions, View } from "react-native";
import { Button, ButtonMonIcon, ButtonOuter, ButtonText } from "~/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getPlaylistDetail } from "~/storage/sqlite/playlist";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { convertToHTTPS } from "~/utils/string";
import { Pressable } from "~/components/ui/pressable";

export default function CoverPicker() {
    const { listId } = useLocalSearchParams<{ listId: string }>();

    const { data, refetch } = useQuery({
        queryKey: [`playlist_detail_${listId}`],
        queryFn: async () => {
            const rawResult = await getPlaylistDetail(Number(listId));
            return rawResult.filter((item, index, self) => index === self.findIndex(t => t.imgUrl === item.imgUrl));
        },
    });

    // 布局管理
    const windowDimensions = useWindowDimensions();
    let windowWidth = windowDimensions.width;
    const columns = Math.floor(windowWidth / 200);
    const columnHeight = windowWidth / columns;

    return (
        <Layout title="选择歌单封面" leftAccessories="BACK_BUTTON">
            <View className={"flex-1"}>
                <FlashList
                    renderItem={e => (
                        <View className={"p-0.5"}>
                            <Pressable onPress={() => {}} className={"w-full"} androidRipple={false}>
                                <Image source={convertToHTTPS(e.item.imgUrl)} className={"w-full aspect-square"} />
                            </Pressable>
                        </View>
                    )}
                    contentContainerStyle={{
                        paddingHorizontal: 6,
                    }}
                    data={data ?? []}
                    numColumns={columns}
                    estimatedItemSize={columnHeight}
                ></FlashList>
            </View>
            <View className={"p-2 gap-2"}>
                <View className={"flex-row gap-2"}>
                    <ButtonOuter className={"flex-1"}>
                        <Button className={"gap-3"}>
                            <ButtonMonIcon name={"fa6-solid:dice"} />
                            <ButtonText>随机选择</ButtonText>
                        </Button>
                    </ButtonOuter>
                    <ButtonOuter className={"flex-1"}>
                        <Button>
                            <ButtonMonIcon name={"fa6-solid:xmark"} size={20} />
                            <ButtonText>取消</ButtonText>
                        </Button>
                    </ButtonOuter>
                </View>
            </View>
        </Layout>
    );
}
