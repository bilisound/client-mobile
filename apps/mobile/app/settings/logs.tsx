import { Layout } from "~/components/layout";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import { Pressable } from "~/components/ui/pressable";
import { useQuery } from "@tanstack/react-query";
import { getLogList } from "~/utils/logger";
import { Text } from "~/components/ui/text";
import { View } from "react-native";
import { Monicon } from "@monicon/native";
import { useRawThemeValues } from "~/components/ui/gluestack-ui-provider/theme";
import { router } from "expo-router";

const matchRegex = /^bilisound_log_(.+)_(\d{1,2})-(\d{1,2})-(\d+).log$/;

export default function Page() {
    const edgeInsets = useSafeAreaInsets();
    const { data } = useQuery({
        queryKey: ["log_list"],
        queryFn: getLogList,
    });
    const { colorValue } = useRawThemeValues();

    console.log(data);

    return (
        <Layout title={"查看日志"} leftAccessories={"BACK_BUTTON"} edgeInsets={{ ...edgeInsets, bottom: 0 }}>
            <FlashList
                key={11111121133}
                contentContainerStyle={{ paddingBottom: edgeInsets.bottom }}
                estimatedItemSize={72}
                renderItem={e => {
                    const info = matchRegex.exec(e.item);
                    return (
                        <Pressable
                            className={"h-[72px] px-4 gap-1.5 justify-center"}
                            onPress={() => router.navigate(`/settings/log/${e.item}`)}
                        >
                            <View className={"flex-row gap-3"}>
                                <View className={"items-center justify-center size-6 flex-0 basis-auto"}>
                                    <Monicon
                                        name={"fa6-solid:file-lines"}
                                        size={20}
                                        color={colorValue("--color-typography-700")}
                                    />
                                </View>
                                <Text className={"font-semibold"} isTruncated>
                                    {info ? `${info[4]} 年 ${info[3]} 月 ${info[2]} 日` : "未知日志"}
                                </Text>
                            </View>
                            <Text className={"text-typography-500 text-sm pl-9"} isTruncated>
                                {e.item}
                            </Text>
                        </Pressable>
                    );
                }}
                data={data}
            />
        </Layout>
    );
}
