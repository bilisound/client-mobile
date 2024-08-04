import React from "react";
import { View, Button, Text } from "tamagui";

export interface EmptyProps {
    onPress?: () => void;
    title?: string;
    action?: string | null;
}

export default function Empty({ onPress = () => {}, title = "这里空空如也", action = "去查询" }: EmptyProps) {
    return (
        <View
            style={{
                alignItems: "center",
                justifyContent: "center",
                flexGrow: 1,
                gap: 16,
            }}
        >
            <Text
                style={{
                    fontSize: 14,
                    opacity: 0.5,
                }}
            >
                {title}
            </Text>
            {action && (
                <Button onPress={onPress} theme="red" size="$4">
                    {action}
                </Button>
            )}
        </View>
    );
}
