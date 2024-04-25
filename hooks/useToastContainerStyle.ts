import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function useToastContainerStyle() {
    const { top } = useSafeAreaInsets();

    // https://github.com/gluestack/gluestack-ui/issues/1334 的 workaround
    return {
        top: Platform.OS === "android" ? top : 0,
    };
}
