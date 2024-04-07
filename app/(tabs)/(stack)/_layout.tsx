import { Stack } from "expo-router";

export default function StackLayout() {
    return (
        <Stack>
            <Stack.Screen name="playlist" options={{ title: "Screen 1", headerShown: false }} />
            <Stack.Screen name="detail/[id]" options={{ title: "Screen 2", headerShown: false }} />
        </Stack>
    );
}
