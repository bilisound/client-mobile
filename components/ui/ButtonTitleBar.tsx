import React, { PropsWithChildren } from "react";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import Pressable from "~/components/ui/Pressable";
import { IconComponent } from "~/components/ui/utils/icon";

export interface ButtonTitleBarProps {
    label: string;
    solid?: boolean;
    Icon?: IconComponent;
    iconColor?: string;
    iconSize?: number;
    onPress?: () => void;
}

export default function ButtonTitleBar({
    label,
    solid,
    onPress,
    Icon,
    iconColor,
    iconSize = 24,
    children,
}: PropsWithChildren<ButtonTitleBarProps>) {
    const { styles, theme } = useStyles(styleSheet);
    return (
        <Pressable
            outerStyle={styles.buttonOuter}
            style={styles.button}
            pressedBackgroundColor={solid ? "rgba(255,255,255,0.15)" : undefined}
            aria-label={label}
            onPress={onPress}
        >
            {Icon ? (
                <Icon size={iconSize} color={iconColor || (solid ? "#fff" : theme.colorTokens.foreground)} />
            ) : (
                children
            )}
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
