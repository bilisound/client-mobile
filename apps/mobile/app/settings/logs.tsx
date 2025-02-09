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

export default function Page() {
    const edgeInsets = useSafeAreaInsets();
    const { data } = useQuery({
        queryKey: ["log_list"],
        queryFn: getLogList,
    });
    const { colorValue } = useRawThemeValues();

    return (
        <Layout title={"查看日志"} leftAccessories={"BACK_BUTTON"} edgeInsets={{ ...edgeInsets, bottom: 0 }}>
            <FlashList
                estimatedItemSize={48}
                renderItem={e => (
                    <Pressable className={"h-12 px-4 flex-row items-center gap-3"}>
                        <View className={"items-center justify-center size-6 flex-0 basis-auto"}>
                            <Monicon
                                name={"fa6-solid:file-lines"}
                                size={20}
                                color={colorValue("--color-typography-700")}
                            />
                        </View>
                        <Text className={"flex-1"} isTruncated>
                            {e.item}
                        </Text>
                    </Pressable>
                )}
                data={data}
            />
        </Layout>
    );
}
