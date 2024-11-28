import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: colorScheme === "dark" ? "#fff" : "#000",
            }}
        >
            <Tabs.Screen
                name="main"
                options={{
                    title: "首页",
                    tabBarIcon: ({ color }) => <MaterialIcons name="home" color={color} size={24} />,
                }}
            />
            <Tabs.Screen
                name="playlist"
                options={{
                    title: "播放列表",
                    tabBarIcon: ({ color }) => <MaterialIcons name="queue-music" color={color} size={24} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: "设置",
                    tabBarIcon: ({ color }) => <MaterialIcons name="settings" color={color} size={24} />,
                }}
            />
        </Tabs>
    );
}
