import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { ShadowedView } from "react-native-fast-shadow";

import { Text } from "~/components/ui/text";

export interface ToastProps {
    type: "success" | "info" | "warning" | "error";
    title: string;
    description?: string;
}

export default function PotatoToast({ type, title, description }: ToastProps) {
    return (
        <ShadowedView
            style={{
                shadowOpacity: 0.1,
                shadowRadius: 25,
                shadowOffset: {
                    width: 0,
                    height: 20,
                },
                shadowColor: "#000000",
            }}
            className="{}-[shadowColor]:color-black bg-background-0 border-background-100 border min-h-[50px] rounded-[25px] pl-3 pr-[18px] py-[13px] flex-row gap-3 mx-6 my-2 max-w-[400px]"
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
                <Text className="text-base leading-normal font-semibold">{title}</Text>
                {description ? <Text className="text-sm leading-normal">{description}</Text> : null}
            </View>
        </ShadowedView>
    );
}
