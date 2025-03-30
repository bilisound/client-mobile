import { ScrollView, View } from "react-native";
import { Text } from "~/components/ui/text";
import { useLocalSearchParams } from "expo-router";
import { getBilisoundMetadata } from "~/api/bilisound";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaFrame } from "react-native-safe-area-context";

export default function Page() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const { height } = useSafeAreaFrame();

    // 数据请求
    const { data } = useQuery({
        queryKey: [id],
        queryFn: () => {
            if (!id) {
                return undefined;
            }
            return getBilisoundMetadata({ id });
        },
    });

    return (
        <View className={"bg-background-0"} style={{ maxHeight: height * 0.75 }}>
            <ScrollView className={"px-safe pb-safe"}>
                <Text className={"text-sm leading-normal p-4"}>{data?.desc}</Text>
            </ScrollView>
        </View>
    );
}
