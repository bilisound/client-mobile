import { Text } from "~/components/ui/text";
import { TabSafeAreaView } from "~/hooks/useTabSafeArea";

export default function Page() {
    return (
        <TabSafeAreaView className="flex-1 items-center justify-center">
            <Text className="text-base">歌单详情</Text>
        </TabSafeAreaView>
    );
}
