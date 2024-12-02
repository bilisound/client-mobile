import { Text } from "~/components/ui/text";
import useSettingsStore from "~/store/settings";
import { Button, ButtonOuter, ButtonText } from "~/components/ui/button";
import { TabSafeAreaView } from "~/hooks/useTabSafeArea";

export default function SettingsScreen() {
    const { update } = useSettingsStore(state => ({
        update: state.update,
    }));

    return (
        <TabSafeAreaView className="flex-1 items-center justify-center gap-4">
            <ButtonOuter>
                <Button onPress={() => update("theme", "classic")}>
                    <ButtonText>Classic Theme</ButtonText>
                </Button>
            </ButtonOuter>
            <ButtonOuter>
                <Button onPress={() => update("theme", "red")}>
                    <ButtonText>Red Theme</ButtonText>
                </Button>
            </ButtonOuter>
            <Text className="text-base">设置</Text>
        </TabSafeAreaView>
    );
}
