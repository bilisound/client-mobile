import { IconProps } from "@expo/vector-icons/build/createIconSet";
import { Text, Pressable, Box } from "@gluestack-ui/themed";
import React from "react";
import { GestureResponderEvent } from "react-native/Libraries/Types/CoreEventTypes";

import { COMMON_TOUCH_COLOR } from "~/constants/style";
import useCommonColors from "~/hooks/useCommonColors";

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
    const { textBasicColor } = useCommonColors();
    const inner = (
        <Box
            sx={{
                flexDirection: "row",
                padding: 16,
                gap: 12,
                alignItems: subTitle ? "flex-start" : "center",
                opacity: disabled ? 0.6 : 1,
            }}
        >
            <Box flex={1}>
                <Box
                    sx={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 12,
                    }}
                >
                    {icon({
                        size: 24,
                        color: textBasicColor,
                        style: {
                            width: 26,
                        },
                    })}
                    <Text
                        sx={{
                            fontWeight: "700",
                            fontSize: 15,
                        }}
                    >
                        {title}
                    </Text>
                </Box>
                {subTitle ? (
                    <Text
                        sx={{
                            marginTop: 4,
                            marginLeft: 38,
                            opacity: 0.6,
                            fontSize: 15,
                            lineHeight: 15 * 1.5,
                        }}
                    >
                        {subTitle}
                    </Text>
                ) : null}
            </Box>
            {rightAccessories ? (
                <Box flex={0} flexBasis="auto">
                    {rightAccessories}
                </Box>
            ) : null}
        </Box>
    );

    if (!onPress || disabled) {
        return inner;
    }

    return (
        <Pressable sx={COMMON_TOUCH_COLOR} onPress={onPress}>
            {inner}
        </Pressable>
    );
};

export default SettingMenuItem;
