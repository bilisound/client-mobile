import { Text } from "~/components/ui/text";
import { useTabSafeAreaInsets } from "~/hooks/useTabSafeAreaInsets";
import { View } from "react-native";
import { Layout } from "~/components/layout";

export default function MainScreen() {
    const edgeInsets = useTabSafeAreaInsets();

    return (
        <Layout title={"首页"} edgeInsets={edgeInsets}>
            <View className="flex-1 items-center justify-center">
                <Text className="text-base">主页</Text>
            </View>
        </Layout>
    );
}
