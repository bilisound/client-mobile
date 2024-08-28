import { Ionicons, FontAwesome5, Entypo } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs/src/types";
import BottomTabBar from "@react-navigation/bottom-tabs/src/views/BottomTabBar";
import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import AudioIndicator from "~/components/AudioIndicator";
import YuruChara from "~/components/YuruChara";
import useSettingsStore from "~/store/settings";

const SearchIcon = ({ color }: { color: string }) => <FontAwesome5 name="search" size={20} color={color} />;
const SettingsIcon = ({ color }: { color: string }) => <Ionicons name="settings-sharp" size={22} color={color} />;
const ListIcon = ({ color }: { color: string }) => <Entypo name="list" size={22} color={color} />;

const TabBar = (props: BottomTabBarProps) => (
    <View>
        <AudioIndicator />
        <BottomTabBar {...props} />
    </View>
);

export default function TabLayout() {
    const { theme, styles } = useStyles(styleSheet);
    const tabBarActiveTintColor = theme.colors.accent[500];
    const { showYuruChara } = useSettingsStore(state => ({
        showYuruChara: state.showYuruChara,
    }));

    return (
        <View style={styles.container}>
            <Tabs
                tabBar={TabBar}
                screenOptions={{
                    headerStyle: styles.headerStyle,
                    tabBarStyle: styles.tabBarStyle,
                    tabBarLabelStyle: styles.tabBarLabelStyle,
                    tabBarActiveTintColor,
                }}
            >
                <Tabs.Screen
                    name="(playlist)"
                    options={{
                        title: "歌单",
                        tabBarIcon: ListIcon,
                        headerShown: false,
                    }}
                />
                <Tabs.Screen
                    name="index"
                    options={{
                        title: "查询",
                        tabBarIcon: SearchIcon,
                        headerShown: false,
                    }}
                />
                <Tabs.Screen
                    name="settings"
                    options={{
                        title: "设置",
                        tabBarIcon: SettingsIcon,
                        headerShown: false,
                    }}
                />
            </Tabs>
            {showYuruChara && <YuruChara />}
        </View>
    );
}

const styleSheet = createStyleSheet(theme => ({
    container: {
        height: "100%",
    },
    headerStyle: {
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderBottomWidth: 0,
        shadowColor: "transparent",
    },
    tabBarStyle: {
        backgroundColor: "transparent",
        borderTopWidth: 0,
        shadowColor: "transparent",
    },
    tabBarLabelStyle: {},
}));
