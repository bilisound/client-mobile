import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";

import React from "react";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs/src/types";
import BottomTabBar from "@react-navigation/bottom-tabs/src/views/BottomTabBar";
import { Box } from "@gluestack-ui/themed";
import YuruChara from "../../components/YuruChara";
import AudioPlayerMini from "../../components/AudioPlayerMini";
import useCommonColors from "../../hooks/useCommonColors";

const SearchIcon = ({ color }: { color: string }) => <FontAwesome5 name="search" size={20} color={color} />;
const HistoryIcon = ({ color }: { color: string }) => <Ionicons name="play-circle" size={24} color={color} />;
const SettingsIcon = ({ color }: { color: string }) => <Ionicons name="settings-sharp" size={22} color={color} />;

const TabBar = (props: BottomTabBarProps) => (
    <View>
        <AudioPlayerMini />
        <BottomTabBar {...props} />
    </View>
);

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
const TabLayout = () => {
    const { accentColor: tabBarActiveTintColor } = useCommonColors();

    return (
        <Box h="100%">
            <Tabs
                tabBar={TabBar}
                screenOptions={{
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
                    headerTitleStyle: {
                        // color: colors.fgPrimary,
                    },
                    tabBarLabelStyle: {
                        paddingTop: 1,
                    },
                    tabBarItemStyle: {},
                    tabBarActiveTintColor,
                }}
            >
                <Tabs.Screen
                    name="playing"
                    options={{
                        title: "正在播放",
                        tabBarIcon: HistoryIcon,
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
            <YuruChara />
        </Box>
    );
};

export default TabLayout;
