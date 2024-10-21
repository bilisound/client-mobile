import React from "react";
import { View } from "react-native";

import PotatoButton from "~/components/potato-ui/PotatoButton";
import { Text } from "~/components/ui/text";
import { useTabPaddingBottom } from "~/hooks/useTabPaddingBottom";

interface EditActionProps {
    onAll: () => void;
    onReverse: () => void;
    onDelete: () => void;
    amount: number;
}

export default function EditAction({ onAll, onReverse, onDelete, amount }: EditActionProps) {
    const paddingBottom = useTabPaddingBottom();

    return (
        <View
            className="border-t border-background-100 flex-row justify-between items-center px-3 bg-background-0"
            style={{ paddingBottom, height: paddingBottom + 52 }}
        >
            <Text className="text-sm">{`已选择 ${amount} 项`}</Text>
            <View className="flex-row gap-2">
                <PotatoButton size="sm" variant="outline" onPress={onAll}>
                    全选
                </PotatoButton>
                <PotatoButton size="sm" variant="outline" onPress={onReverse}>
                    反选
                </PotatoButton>
                <PotatoButton size="sm" variant="solid" color="error" onPress={onDelete} disabled={amount <= 0}>
                    删除
                </PotatoButton>
            </View>
        </View>
    );
}
