import { View } from "react-native";
import { Text } from "~/components/ui/text";
import useSettingsStore from "~/store/settings";
import { Button, ButtonText } from "~/components/ui/button";

export default function SettingsScreen() {
    const { update } = useSettingsStore(state => ({
        update: state.update,
    }));

    return (
        <View className="flex-1 items-center justify-center gap-4">
            <Button onPress={() => update("theme", "classic")}>
                <ButtonText>Classic Theme</ButtonText>
            </Button>
            <Button onPress={() => update("theme", "red")}>
                <ButtonText>Red Theme</ButtonText>
            </Button>
            <Text className="text-base">设置</Text>
        </View>
    );
}
