import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { Pressable } from "react-native";
import { useStyles } from "react-native-unistyles";
import { twMerge } from "tailwind-merge";

import CommonLayout from "~/components/CommonLayout";
import SettingMenuItem from "~/components/SettingMenuItem";
import YuruChara from "~/components/YuruChara";
import { createIcon } from "~/components/potato-ui/utils/icon";
import { Center } from "~/components/ui/center";
import { HStack } from "~/components/ui/hstack";
import { Switch } from "~/components/ui/switch";
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

const PaintBrushIcon = createIcon(FontAwesome5, "paint-brush");
const BackgroundIcon = createIcon(FontAwesome6, "image");

export default function Page() {
    const { theme, update, showYuruChara, toggle } = useSettingsStore(state => ({
        theme: state.theme,
        update: state.update,
        showYuruChara: state.showYuruChara,
        toggle: state.toggle,
    }));

    const { theme: themeData } = useStyles();

    return (
        <CommonLayout titleBarTheme="solid" title="外观设置" leftAccessories="backButton">
            <VStack space="xl" className="p-4">
                <HStack space="md" className="items-center">
                    <Center className="size-[24px]">
                        <PaintBrushIcon size={20} color={themeData.colorTokens.foreground} />
                    </Center>
                    <Text className="text-[15px] font-semibold">App 界面主题</Text>
                </HStack>
                <VStack space="md">
                    <ThemeButton
                        name="默认主题"
                        onPress={() => update("theme", "classic")}
                        selected={theme === "classic"}
                    />
                    <ThemeButton name="红色主题" onPress={() => update("theme", "red")} selected={theme === "red"} />
                </VStack>
            </VStack>
            <SettingMenuItem
                icon={BackgroundIcon}
                iconSize={20}
                title="在右下角展示看板娘"
                rightAccessories={
                    <Switch
                        value={showYuruChara}
                        onChange={() => {
                            toggle("showYuruChara");
                        }}
                    />
                }
                onPress={() => toggle("showYuruChara")}
            />
            {showYuruChara && <YuruChara />}
        </CommonLayout>
    );
}
