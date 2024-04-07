import { Box, Button, ButtonText, Text } from "@gluestack-ui/themed";
import React from "react";

export interface EmptyProps {
    onPress?: () => void;
    title?: string;
    action?: string;
}

export default function Empty({ onPress = () => {}, title = "这里空空如也", action = "去查询" }: EmptyProps) {
    return (
        <Box
            sx={{
                alignItems: "center",
                justifyContent: "center",
                flexGrow: 1,
                gap: 16,
            }}
        >
            <Text
                sx={{
                    fontSize: 14,
                    opacity: 0.5,
                }}
            >
                {title}
            </Text>
            <Button onPress={onPress}>
                <ButtonText>{action}</ButtonText>
            </Button>
        </Box>
    );
}
