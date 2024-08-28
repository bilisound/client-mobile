import { Pressable } from "react-native";
import { twMerge } from "tailwind-merge";

import CommonLayout from "~/components/CommonLayout";
import { Heading } from "~/components/ui/heading";
import { Text } from "~/components/ui/text";
import { VStack } from "~/components/ui/vstack";
import useSettingsStore from "~/store/settings";

interface ThemeButtonProps {
    selected?: boolean;
    name: string;
    onPress?: () => void;
}

function ThemeButton({ selected = false, name, onPress }: ThemeButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            className={twMerge(
                "group flex flex-row items-center justify-start text-left px-5 h-12 rounded-lg gap-3 cursor-pointer focus:ring-0.125rem focus:ring-primary-500 dark:focus:ring-primary-900",
                selected ? "bg-primary-700 shadow-md" : "bg-background-100",
            )}
        >
            <Text className={`truncate flex-1 text-left font-semibold text-sm ${selected ? "text-white" : ""}`}>
                {name}
            </Text>
            {selected && (
                <Text className={`flex-none font-semibold text-sm ${selected ? "text-white" : ""}`}>已启用</Text>
            )}
        </Pressable>
    );
}

export default function Page() {
    const { theme, update } = useSettingsStore(state => ({
        theme: state.theme,
        update: state.update,
    }));

    return (
        <CommonLayout titleBarTheme="solid" title="切换主题" leftAccessories="backButton">
            <VStack space="lg" className="p-4">
                <Heading size="md">App 界面主题</Heading>
                <VStack space="md">
                    <ThemeButton
                        name="默认主题"
                        onPress={() => update("theme", "classic")}
                        selected={theme === "classic"}
                    />
                    <ThemeButton name="红色主题" onPress={() => update("theme", "red")} selected={theme === "red"} />
                </VStack>
            </VStack>
        </CommonLayout>
    );
}
