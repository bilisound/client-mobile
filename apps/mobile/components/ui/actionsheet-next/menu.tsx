import React from "react";
import { Platform, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Monicon } from "@monicon/native";
import { useRawThemeValues } from "~/components/ui/gluestack-ui-provider/theme";
import { useWindowSize } from "~/hooks/useWindowSize";
import { breakpoints } from "~/constants/styles";
import { Text } from "~/components/ui/text";

export interface ActionMenuItem {
  show?: boolean;
  disabled?: boolean;
  icon: string;
  iconSize?: number;
  text: string;
  action: () => void;
}

export function ActionMenuNext({ menuItems }: { menuItems: ActionMenuItem[] }) {
  const { colorValue } = useRawThemeValues();
  const { width } = useWindowSize();

  const elements = menuItems
    .filter(e => e.show)
    .map((item, index) => (
      <TouchableOpacity
        key={index}
        onPress={item.action}
        disabled={item.disabled}
        activeOpacity={0.6}
        style={{ width: "100%" }}
        className="flex-row items-center p-3 rounded-lg opacity-100 disabled:opacity-40 gap-2"
      >
        <View className="size-6 items-center justify-center">
          <Monicon name={item.icon} size={item.iconSize ?? 18} color={colorValue("--color-typography-700")} />
        </View>
        <Text>{item.text}</Text>
      </TouchableOpacity>
    ));

  if (Platform.OS === "web") {
    return <View className="w-full grid grid-cols-1 sm:grid-cols-2">{elements}</View>;
  }

  if (width >= breakpoints.sm) {
    const grouped: React.ReactNode[][] = [];
    for (let i = 0; i < elements.length; i += 2) grouped.push(elements.slice(i, i + 2));
    return (
      <View className="w-full">
        {grouped.map((row, i) => (
          <View key={i} className="flex-row">
            {row.map((el, j) => (
              <View key={j} className="flex-1">
                {el}
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  }

  return <View className="w-full">{elements}</View>;
}
