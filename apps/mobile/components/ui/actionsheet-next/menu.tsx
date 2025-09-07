import React from "react";
import { Platform, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { Monicon } from "@monicon/native";
import { useRawThemeValues } from "~/components/ui/gluestack-ui-provider/theme";
import { useWindowSize } from "~/hooks/useWindowSize";
import { breakpoints } from "~/constants/styles";
import { Text } from "~/components/ui/text";
import { cssInterop } from "nativewind";

cssInterop(Pressable, { className: "style" });

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
      <View key={index} className="overflow-hidden rounded-lg">
        <Pressable
          onPress={item.action}
          disabled={item.disabled}
          style={{ width: "100%" }}
          android_ripple={{ color: "red" }}
          className={
            "w-full flex-row items-center p-3 disabled:opacity-40 disabled:web:pointer-events-auto disabled:web:cursor-not-allowed hover:bg-background-50 web:focus-visible:bg-background-100 web:data-focus-visible:outline-indicator-primary gap-2 " +
            (Platform.OS === "android"
              ? "{}-[android_ripple.color]/color:color-background-100"
              : "active:bg-background-100 focus:bg-background-100")
          }
        >
          <View className="size-6 items-center justify-center">
            <Monicon name={item.icon} size={item.iconSize ?? 18} color={colorValue("--color-typography-700")} />
          </View>
          <Text className="text-typography-700 font-normal font-body">{item.text}</Text>
        </Pressable>
      </View>
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
