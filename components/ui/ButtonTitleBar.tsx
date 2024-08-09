import { IconProps } from "@expo/vector-icons/build/createIconSet";
import React, { PropsWithChildren } from "react";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import Pressable from "~/components/ui/Pressable";

export interface ButtonTitleBarProps {
    label: string;
    solid?: boolean;
    Icon?: (iconProps: Partial<IconProps<any>>) => React.ReactNode;
    iconColor?: string;
    onPress?: () => void;
}

export default function ButtonTitleBar({
    label,
    solid,
    onPress,
    Icon,
    iconColor,
    children,
}: PropsWithChildren<ButtonTitleBarProps>) {
    const { styles, theme } = useStyles(styleSheet);
    return (
        <Pressable
            outerStyle={styles.buttonOuter}
            style={styles.button}
            pressedBackgroundColor={solid ? "rgba(255,255,255,0.1)" : undefined}
            aria-label={label}
            onPress={onPress}
        >
            {Icon ? <Icon size={24} color={iconColor || (solid ? "#fff" : theme.colorTokens.foreground)} /> : children}
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
    },
}));
