import React from "react";
import { View, Text, Button, Theme } from "tamagui";

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
        <View
            borderColor="$borderColor"
            borderWidth={1}
            borderLeftWidth={0}
            borderRightWidth={0}
            borderBottomWidth={0}
            flex={0}
            flexBasis="auto"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            height={64}
            paddingLeft={12}
            paddingRight={12}
            backgroundColor={bgColor}
        >
            <Text fontSize={16}>{`已选择 ${amount} 项`}</Text>
            <View flexDirection="row" gap="$2">
                <Button size="$4" onPress={onAll}>
                    全选
                </Button>
                <Button size="$4" onPress={onReverse}>
                    反选
                </Button>
                <Theme name="red">
                    <Button size="$4" disabled={amount <= 0} onPress={onDelete}>
                        删除
                    </Button>
                </Theme>
            </View>
        </View>
    );
}
