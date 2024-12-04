import { Text } from "~/components/ui/text";
import { TabSafeAreaView } from "~/hooks/useTabSafeAreaInsets";

export default function Page() {
    return (
        <TabSafeAreaView className="flex-1 items-center justify-center">
            <Text className="text-base">歌单元数据</Text>
        </TabSafeAreaView>
    );
}