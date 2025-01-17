import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

import { Text } from "~/components/ui/text";
import { shadow } from "~/constants/styles";

export interface NotifyToastProps {
    type: "success" | "info" | "warning" | "error";
    title: string;
    description?: string;
}

export function NotifyToast({ type, title, description }: NotifyToastProps) {
    return (
        <View
            style={{ boxShadow: shadow.xl }}
            className="bg-background-0 border-background-100 border min-h-[50px] rounded-[25px] pl-3 pr-[1.125rem] py-[0.8125rem] flex-row gap-3 mx-6 my-2 max-w-[400px]"
        >
            {type === "success" && (
                <Ionicons name="checkmark-circle" size={24} className="flex-0 basis-auto color-green-500" />
            )}
            {type === "info" && (
                <Ionicons name="information-circle" size={24} className="flex-0 basis-auto color-neutral-500" />
            )}
            {type === "warning" && (
                <Ionicons name="alert-circle" size={24} className="flex-0 basis-auto color-orange-500" />
            )}
            {type === "error" && <Ionicons name="close-circle" size={24} className="flex-0 basis-auto color-red-500" />}
            <View className="gap-1 flex-1">
                <Text
                    className="text-base leading-normal font-semibold"
                    aria-live="assertive"
                    aria-atomic="true"
                    role="alert"
                >
                    {title}
                </Text>
                {description ? <Text className="text-sm leading-normal">{description}</Text> : null}
            </View>
        </View>
    );
}
