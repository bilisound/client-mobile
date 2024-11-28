import { View } from "react-native";
import { Text } from "~/components/ui/text";

export default function MainScreen() {
    return (
        <View className="flex-1 items-center justify-center bg-blue-300 dark:bg-blue-900">
            <Text className="text-base">主页</Text>
        </View>
    );
}
