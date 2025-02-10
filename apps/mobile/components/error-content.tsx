import { View } from "react-native";
import { Monicon } from "@monicon/native";
import { Text } from "~/components/ui/text";

export interface ErrorContentProps {
    message: string;
}

export function ErrorContent({ message }: ErrorContentProps) {
    return (
        <View className={"gap-4 items-center p-4"}>
            <Monicon name={"tabler:alert-square-rounded"} className={"color-typography-400"} size={64} />
            <Text className={"color-typography-400 text-base leading-normal"}>{message}</Text>
        </View>
    );
}
