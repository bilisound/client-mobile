import omit from "lodash/omit";
import React, { PropsWithChildren, forwardRef } from "react";
import { View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import PotatoPressable, { PressableProps } from "~/components/potato-ui/PotatoPressable";
import { IconComponent } from "~/components/potato-ui/utils/icon";

export interface ButtonTitleBarProps extends PressableProps {
    label: string;
    theme?: "transparent" | "transparentAlt" | "solid";
    Icon?: IconComponent;
    iconColor?: string;
    iconSize?: number;
}

const PotatoButtonTitleBar = forwardRef<View, PropsWithChildren<ButtonTitleBarProps>>(
    ({ label, theme: colorTheme = "solid", Icon, iconColor, iconSize = 24, children, ...rest }, ref) => {
        const { styles, theme } = useStyles(styleSheet);
        let textColor = theme.colorTokens.topBarSolidForeground;
        if (colorTheme === "transparent") {
            textColor = theme.colorTokens.topBarTransparentForeground;
        }
        if (colorTheme === "transparentAlt") {
            textColor = theme.colorTokens.topBarTransparentAltForeground;
        }

        return (
            <PotatoPressable
                ref={ref}
                outerStyle={styles.buttonOuter}
                style={styles.button}
                pressedBackgroundColor={colorTheme === "solid" ? "rgba(255,255,255,0.15)" : undefined}
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

const styleSheet = createStyleSheet(theme => ({
    button: {
        alignItems: "center",
        justifyContent: "center",
        width: 44,
        height: 44,
    },
    buttonOuter: {
        borderRadius: 6,
        overflow: "hidden",
    },
}));
