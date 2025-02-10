import { Stack } from "expo-router";
import { useUpdateTriggerStore } from "~/store/update-trigger";

export default function StackLayout() {
    const { count } = useUpdateTriggerStore();

    return (
        <Stack key={count}>
            <Stack.Screen
                name="playlist"
                options={{
                    title: "歌单",
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="detail/[id]"
                options={{
                    title: "歌单详情",
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="meta/[id]"
                options={{
                    title: "歌单元数据编辑",
                    headerShown: false,
                }}
            />
        </Stack>
    );
}
