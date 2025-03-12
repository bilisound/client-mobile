import { ActionsheetItem, ActionsheetItemText } from "~/components/ui/actionsheet";
import { View } from "react-native";
import { Monicon } from "@monicon/native";
import React from "react";
import { useRawThemeValues } from "~/components/ui/gluestack-ui-provider/theme";

export interface ActionMenuItem {
    show?: boolean;
    disabled?: boolean;
    icon: string;
    iconSize: number;
    text: string;
    action: () => void;
}

export interface ActionSheetProps {
    menuItems: ActionMenuItem[];
}

export function ActionMenu({ menuItems }: ActionSheetProps) {
    const { colorValue } = useRawThemeValues();

    return menuItems
        .filter(e => e.show)
        .map(item => (
            <ActionsheetItem key={item.text} onPress={item.action} isDisabled={item.disabled}>
                <View className={"size-6 items-center justify-center"}>
                    <Monicon name={item.icon} size={item.iconSize} color={colorValue("--color-typography-700")} />
                </View>
                <ActionsheetItemText>{item.text}</ActionsheetItemText>
            </ActionsheetItem>
        ));
}
