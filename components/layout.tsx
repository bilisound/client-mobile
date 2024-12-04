import { PropsWithChildren, ReactNode } from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
import { YuruChara } from "~/components/yuru-chara";

export interface LayoutProps {
    leftAccessories?: ReactNode;
    rightAccessories?: ReactNode;
    title?: string | ReactNode;
    edgeInsets?: EdgeInsets;
}

export function Layout({
    children,
    leftAccessories,
    rightAccessories,
    title,
    edgeInsets,
}: PropsWithChildren<LayoutProps>) {
    let resultEdgeInsets = useSafeAreaInsets();
    if (edgeInsets) {
        resultEdgeInsets = edgeInsets;
    }
    return (
        <View className={"flex-1"}>
            <View
                style={{
                    paddingTop: resultEdgeInsets.top,
                    paddingLeft: resultEdgeInsets.left,
                    paddingRight: resultEdgeInsets.right,
                }}
            >
                <View className={"h-14 relative items-center justify-center"}>
                    {leftAccessories ? (
                        <View className={"absolute left-0 top-0 h-full flex-row items-center px-2 gap-1"}>
                            {leftAccessories}
                        </View>
                    ) : null}
                    <View>
                        {typeof title === "string" ? (
                            <Text className={"text-center font-semibold"}>{title}</Text>
                        ) : (
                            title
                        )}
                    </View>
                    {rightAccessories ? (
                        <View className={"absolute right-0 top-0 h-full flex-row items-center px-2 gap-1"}>
                            {rightAccessories}
                        </View>
                    ) : null}
                </View>
            </View>
            <View
                className={"flex-1"}
                style={{
                    paddingLeft: resultEdgeInsets.left,
                    paddingRight: resultEdgeInsets.right,
                    paddingBottom: resultEdgeInsets.bottom,
                }}
            >
                <YuruChara />
                <View className={"flex-1"}>{children}</View>
            </View>
        </View>
    );
}
