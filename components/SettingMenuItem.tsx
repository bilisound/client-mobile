import React from "react";
import { View, Text, GestureResponderEvent } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import PotatoPressable from "~/components/potato-ui/PotatoPressable";
import { IconComponent } from "~/components/potato-ui/utils/icon";

export interface SettingMenuItemProps {
    title: string;
    subTitle?: string;
    icon: IconComponent;
    iconSize?: number;
    rightAccessories?: React.ReactNode;
    onPress?: (event: GestureResponderEvent) => void;
    disabled?: boolean;
}

const SettingMenuItem: React.FC<SettingMenuItemProps> = ({
    title,
    subTitle,
    icon,
    iconSize = 24,
    rightAccessories,
    onPress,
    disabled,
}) => {
    const { styles, theme } = useStyles(stylesheet);
    const textBasicColor = theme.colorTokens.foreground;
    const Icon = icon;

    const inner = (
        <View style={[styles.container, disabled && styles.disabled]}>
            <View style={styles.flex}>
                <View style={styles.titleContainer}>
                    <View style={styles.iconContainer}>
                        <Icon size={iconSize} color={textBasicColor} />
                    </View>
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

    return <PotatoPressable onPress={onPress}>{inner}</PotatoPressable>;
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
    iconContainer: {
        width: 24,
        height: 24,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontWeight: "600",
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
