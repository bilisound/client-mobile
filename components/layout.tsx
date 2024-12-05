import React, { PropsWithChildren, ReactNode, forwardRef } from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
import { YuruChara } from "~/components/yuru-chara";
import { Monicon } from "@monicon/native";
import { Button } from "~/components/ui/button";
import { useRawThemeValues } from "~/components/ui/gluestack-ui-provider/theme";
import { twMerge } from "tailwind-merge";
import { router } from "expo-router";

export interface LayoutProps {
    leftAccessories?: ReactNode | "BACK_BUTTON";
    rightAccessories?: ReactNode;
    title?: string | ReactNode;
    edgeInsets?: EdgeInsets;
    disableContentPadding?: boolean;
}

export function Layout({
    children,
    leftAccessories,
    rightAccessories,
    title,
    edgeInsets,
    disableContentPadding,
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
                <View className={"h-16 relative items-center justify-center"}>
                    {leftAccessories ? (
                        <View className={"absolute left-0 top-0 h-full flex-row items-center px-2 gap-1"}>
                            {leftAccessories === "BACK_BUTTON" ? (
                                <LayoutButton
                                    iconName={"fa6-solid:arrow-left"}
                                    aria-label={"返回"}
                                    onPress={() => {
                                        if (router.canGoBack()) {
                                            router.back();
                                        } else {
                                            router.navigate("/");
                                        }
                                    }}
                                />
                            ) : (
                                leftAccessories
                            )}
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
                style={
                    disableContentPadding
                        ? {}
                        : {
                              paddingLeft: resultEdgeInsets.left,
                              paddingRight: resultEdgeInsets.right,
                              paddingBottom: resultEdgeInsets.bottom,
                          }
                }
            >
                <View className={"flex-1"}>{children}</View>
            </View>
            <YuruChara />
        </View>
    );
}

export interface LayoutButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
    iconSize?: number;
    iconName: string;
    className?: string;
}

export const LayoutButton = forwardRef<React.ElementRef<typeof Button>, LayoutButtonProps>(
    ({ iconSize = 20, iconName, className, ...props }, ref) => {
        const { colorValue } = useRawThemeValues();

        return (
            <Button
                variant={"ghost"}
                {...props}
                className={twMerge("w-[2.75rem] h-[2.75rem] px-0", className)}
                ref={ref}
            >
                <Monicon size={iconSize} color={colorValue("--color-primary-500")} name={iconName} />
            </Button>
        );
    },
);

LayoutButton.displayName = "LayoutButton";
