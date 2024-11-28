import { Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Box } from "~/components/ui/box";

export default function Page() {
    const edgeInsets = useSafeAreaInsets();

    return (
        <Box
            className={"flex-1 bg-amber-300 dark:bg-background-0"}
            style={{
                paddingLeft: edgeInsets.left,
                paddingRight: edgeInsets.right,
                paddingTop: edgeInsets.top,
                paddingBottom: edgeInsets.bottom,
            }}
        >
            <Box className={"flex-1 bg-blue-500"}>
                <Text>测试页面</Text>
            </Box>
        </Box>
    );
}
