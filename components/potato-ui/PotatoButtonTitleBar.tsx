import React, { PropsWithChildren, forwardRef } from "react";
import { View } from "react-native";

import PotatoPressable, { PressableProps } from "~/components/potato-ui/PotatoPressable";
import { IconComponent } from "~/components/potato-ui/utils/icon";
import { useRawThemeValues } from "~/components/ui/gluestack-ui-provider/theme";

export interface ButtonTitleBarProps extends PressableProps {
    label: string;
    theme?: "transparent" | "solid";
    Icon?: IconComponent;
    iconColor?: string;
    iconSize?: number;
}

const PotatoButtonTitleBar = forwardRef<View, PropsWithChildren<ButtonTitleBarProps>>(
    ({ label, theme: colorTheme = "solid", Icon, iconColor, iconSize = 24, children, ...rest }, ref) => {
        const { colorValueMode, colorValue } = useRawThemeValues();
        let textColor = "#ffffff";
        if (colorTheme === "transparent") {
            textColor = colorValueMode({
                dark: {
                    color: "--color-primary-400",
                },
                light: {
                    color: "--color-primary-500",
                },
            });
        }

        return (
            <PotatoPressable
                ref={ref}
                outerClassName="rounded-[6px] overflow-hidden"
                className="items-center justify-center w-[44px] h-[44px]"
                rippleColor={
                    colorTheme === "solid"
                        ? colorValueMode({
                              dark: {
                                  color: "--color-primary-300",
                              },
                              light: {
                                  color: "--color-primary-700",
                              },
                          })
                        : colorValue("--color-background-100")
                }
                hoverClassName={colorTheme === "solid" ? "bg-primary-600 dark:bg-primary-200" : "bg-background-50"}
                pressedClassName={colorTheme === "solid" ? "bg-primary-700 dark:bg-primary-300" : "bg-background-100"}
                aria-label={label}
                {...rest}
            >
                {Icon ? <Icon size={iconSize} color={iconColor || textColor} /> : children}
            </PotatoPressable>
        );
    },
);

PotatoButtonTitleBar.displayName = "PotatoButtonTitleBar";

export default PotatoButtonTitleBar;
