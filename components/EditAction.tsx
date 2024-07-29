import { Box, Button, ButtonText, Text } from "@gluestack-ui/themed";
import React from "react";

import useCommonColors from "../hooks/useCommonColors";

interface EditActionProps {
    onAll: () => void;
    onReverse: () => void;
    onDelete: () => void;
    amount: number;
}

export default function EditAction({ onAll, onReverse, onDelete, amount }: EditActionProps) {
    const { bgColor } = useCommonColors();

    return (
        <Box
            sx={{
                borderWidth: 1,
                borderColor: "$backgroundLight100",
                _dark: {
                    borderColor: "$backgroundDark900",
                },
                borderLeftWidth: 0,
                borderRightWidth: 0,
                borderBottomWidth: 0,
                flex: 0,
                flexBasis: "auto",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                height: 52,
                px: 12,
                bg: bgColor,
            }}
        >
            <Text>{`已选择 ${amount} 项`}</Text>
            <Box flexDirection="row" gap="$2">
                <Button size="sm" variant="outline" action="primary" onPress={onAll}>
                    <ButtonText>全选</ButtonText>
                </Button>
                <Button size="sm" variant="outline" action="primary" onPress={onReverse}>
                    <ButtonText>反选</ButtonText>
                </Button>
                <Button size="sm" action="negative" isDisabled={amount <= 0} onPress={onDelete}>
                    <ButtonText>删除</ButtonText>
                </Button>
            </Box>
        </Box>
    );
}
