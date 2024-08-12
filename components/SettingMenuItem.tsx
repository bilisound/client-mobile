import { IconProps } from "@expo/vector-icons/build/createIconSet";
import React from "react";
import { View, Text, GestureResponderEvent } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import Pressable from "~/components/ui/Pressable";

export interface SettingMenuItemProps {
    title: string;
    subTitle?: string;
    icon: (iconProps: Partial<IconProps<any>>) => React.ReactNode;
    rightAccessories?: React.ReactNode;
    onPress?: (event: GestureResponderEvent) => void;
    disabled?: boolean;
}

export type SettingMenuItemIcon = (iconProps: Partial<IconProps<any>>) => React.ReactNode;

const SettingMenuItem: React.FC<SettingMenuItemProps> = ({
    title,
    subTitle,
    icon,
    rightAccessories,
    onPress,
    disabled,
}) => {
    const { styles, theme } = useStyles(stylesheet);
    const textBasicColor = theme.colorTokens.foreground;

    const inner = (
        <View style={[styles.container, disabled && styles.disabled]}>
            <View style={styles.flex}>
                <View style={styles.titleContainer}>
                    {icon({
                        size: 24,
                        color: textBasicColor,
                        style: styles.icon,
                    })}
                    <Text style={styles.title}>{title}</Text>
                </View>
                {subTitle ? <Text style={styles.subtitle}>{subTitle}</Text> : null}
            </View>
            {rightAccessories ? <View style={styles.accessoriesContainer}>{rightAccessories}</View> : null}
        </View>
    );

    if (!onPress || disabled) {
        return inner;
    }

    return <Pressable onPress={onPress}>{inner}</Pressable>;
};

const stylesheet = createStyleSheet(theme => ({
    container: {
        flexDirection: "row",
        padding: 16,
        gap: 12,
        alignItems: "flex-start",
    },
    disabled: {
        opacity: 0.6,
    },
    flex: {
        flex: 1,
    },
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    icon: {
        width: 26,
    },
    title: {
        fontWeight: "700",
        fontSize: 15,
        color: theme.colorTokens.foreground,
    },
    subtitle: {
        marginTop: 4,
        marginLeft: 38,
        opacity: 0.6,
        fontSize: 15,
        lineHeight: 15 * 1.5,
        color: theme.colorTokens.foreground,
    },
    accessoriesContainer: {
        flex: 0,
        flexBasis: "auto",
    },
}));

export default SettingMenuItem;
