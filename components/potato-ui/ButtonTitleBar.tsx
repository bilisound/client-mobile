import React, { PropsWithChildren } from "react";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import Pressable from "~/components/potato-ui/Pressable";
import { IconComponent } from "~/components/potato-ui/utils/icon";

export interface ButtonTitleBarProps {
    label: string;
    /**
     * @deprecated
     */
    solid?: boolean;
    theme?: "transparent" | "transparentAlt" | "solid";
    Icon?: IconComponent;
    iconColor?: string;
    iconSize?: number;
    onPress?: () => void;
}

export default function ButtonTitleBar({
    label,
    theme: colorTheme = "solid",
    onPress,
    Icon,
    iconColor,
    iconSize = 24,
    children,
}: PropsWithChildren<ButtonTitleBarProps>) {
    const { styles, theme } = useStyles(styleSheet);
    let textColor = theme.colorTokens.topBarSolidForeground;
    if (colorTheme === "transparent") {
        textColor = theme.colorTokens.topBarTransparentForeground;
    }
    if (colorTheme === "transparentAlt") {
        textColor = theme.colorTokens.topBarTransparentAltForeground;
    }

    return (
        <Pressable
            outerStyle={styles.buttonOuter}
            style={styles.button}
            pressedBackgroundColor={colorTheme === "solid" ? "rgba(255,255,255,0.15)" : undefined}
            aria-label={label}
            onPress={onPress}
        >
            {Icon ? <Icon size={iconSize} color={iconColor || textColor} /> : children}
        </Pressable>
    );
}

const styleSheet = createStyleSheet(theme => ({
    button: {
        alignItems: "center",
        justifyContent: "center",
        width: 40,
        height: 40,
    },
    buttonOuter: {
        borderRadius: 6,
        overflow: "hidden",
    },
}));
