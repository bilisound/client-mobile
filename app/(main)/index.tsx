import { Text } from "~/components/ui/text";
import { TabSafeAreaView } from "~/hooks/useTabSafeArea";

export default function MainScreen() {
    return (
        <TabSafeAreaView className="flex-1 items-center justify-center">
            <Text className="text-base">主页</Text>
        </TabSafeAreaView>
    );
}
