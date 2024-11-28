import { Button } from "react-native";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import { Box } from "~/components/ui/box";
import { Text } from "~/components/ui/text";

export default function Test() {
    const colorScheme = useColorScheme();
    return (
        <Box className={"flex-1 justify-center items-center bg-background-0"}>
            <Text>Edit app/index.tsx to edit this screen.</Text>
            <Text>{`color scheme: ${colorScheme.colorScheme}`}</Text>
            <Button title={"测试页面"} onPress={() => router.push("/example-empty")} />
            <Button title={"测试页面2"} onPress={() => router.push("/index2")} />
        </Box>
    );
}
