import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import { Image as ExpoImage } from "expo-image";
import { cssInterop } from "nativewind";
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

const Image = cssInterop(ExpoImage, {
    className: {
        target: "style",
        nativeStyleToProp: {
            height: true,
            width: true,
        },
    },
});

interface ThemeButtonProps {
    selected?: boolean;
    name: string;
    onPress?: () => void;
    yuruChara?: any;
}

function ThemeButton({ selected = false, name, onPress, yuruChara }: ThemeButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            className={twMerge(
                "md:flex-1 flex px-5 py-5 h-24 justify-between rounded-lg cursor-pointer overflow-hidden focus:ring-0.125rem focus:ring-primary-500 dark:focus:ring-primary-900",
                selected ? "bg-primary-700 dark:bg-primary-200 shadow-md" : "bg-background-50",
            )}
        >
            <Text className={`font-semibold text-lg ${selected ? "text-white" : ""}`}>{name}</Text>
            {selected && <Text className={`font-semibold text-sm ${selected ? "text-white" : ""}`}>已启用</Text>}
            <Image source={yuruChara} className="absolute right-0 -top-16 w-64 h-64 opacity-30" />
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
                <VStack space="lg" className="md:flex-row">
                    <ThemeButton
                        name="默认主题"
                        yuruChara={require("../../assets/images/bg-corner-classic.svg")}
                        onPress={() => update("theme", "classic")}
                        selected={theme === "classic"}
                    />
                    <ThemeButton
                        name="红色主题"
                        yuruChara={require("../../assets/images/bg-corner-red.webp")}
                        onPress={() => update("theme", "red")}
                        selected={theme === "red"}
                    />
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
