import { Ionicons, FontAwesome5, Entypo } from "@expo/vector-icons";
import { BlurView as OriginalBlurView } from "@react-native-community/blur";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs/src/types";
import BottomTabBar from "@react-navigation/bottom-tabs/src/views/BottomTabBar";
import { CommonActions, NavigationContext, NavigationRouteContext } from "@react-navigation/native";
// import { BlurView as OriginalBlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { cssInterop } from "nativewind";
import React from "react";
import { useColorScheme, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import AudioIndicator from "~/components/AudioIndicator";
import YuruChara from "~/components/YuruChara";
import { createIcon } from "~/components/potato-ui/utils/icon";
import { Box } from "~/components/ui/box";
import { Pressable } from "~/components/ui/pressable";
import { Text } from "~/components/ui/text";
import useFeaturesStore from "~/store/features";
import useSettingsStore from "~/store/settings";

const BlurView = cssInterop(OriginalBlurView, {
    className: "style",
});

const IconSearch = createIcon(FontAwesome5, "search");
const IconSettings = createIcon(Ionicons, "settings-sharp");
const IconList = createIcon(Entypo, "list");

const iconSearch = ({ focused }: { focused: boolean }) => (
    <IconSearch size={17} className={focused ? "color-accent-500" : "color-typography-400"} />
);
const iconSettings = ({ focused }: { focused: boolean }) => (
    <IconSettings size={18} className={focused ? "color-accent-500" : "color-typography-400"} />
);
const iconList = ({ focused }: { focused: boolean }) => (
    <IconList size={22} className={focused ? "color-accent-500" : "color-typography-400"} />
);

const tabBarV1 = (props: BottomTabBarProps) => (
    <Box>
        <AudioIndicator />
        <BottomTabBar {...props} />
    </Box>
);

const tabBarV2 = (props: BottomTabBarProps) => {
    return (
        <View>
            <FloatTabBar {...props} />
        </View>
    );
};

function FloatTabBar(props: BottomTabBarProps) {
    /*const currentActive = props.state.routes[props.state.index];
    const currentActiveOption = props.descriptors[currentActive.key];
    console.log(JSON.stringify({ currentActive, currentActiveOption }));*/

    const colorScheme = useColorScheme();

    return (
        <Box
            className="bg-transparent absolute left-0 bottom-0 w-full"
            style={{
                paddingLeft: props.insets.left,
                paddingRight: props.insets.right,
                paddingBottom: props.insets.bottom,
            }}
        >
            <Box className="m-3 h-16 rounded-full overflow-hidden shadow-lg relative">
                <BlurView
                    className="rounded-full absolute w-full h-full"
                    blurAmount={8}
                    blurType={colorScheme || "light"}
                >
                    <Box className="w-full h-full flex-row bg-background-0/50">
                        {props.state.routes.map((route, i) => {
                            const metadata = props.descriptors[route.key];
                            const focused = props.state.index === i;

                            const onPress = () => {
                                const event = props.navigation.emit({
                                    type: "tabPress",
                                    target: route.key,
                                    canPreventDefault: true,
                                });

                                if (!focused && !event.defaultPrevented) {
                                    props.navigation.dispatch({
                                        ...CommonActions.navigate({ name: route.name, merge: true }),
                                        target: props.state.key,
                                    });
                                }
                            };

                            const onLongPress = () => {
                                props.navigation.emit({
                                    type: "tabLongPress",
                                    target: route.key,
                                });
                            };

                            return (
                                <NavigationContext.Provider
                                    key={route.key}
                                    value={props.descriptors[route.key].navigation}
                                >
                                    <NavigationRouteContext.Provider value={route}>
                                        <Pressable
                                            key={route.key}
                                            className="flex-1 items-center justify-center gap-1.5"
                                            onPress={onPress}
                                            onLongPress={onLongPress}
                                        >
                                            <Box className="w-6 h-6 items-center justify-center">
                                                {metadata.options.tabBarIcon?.({
                                                    focused,
                                                    color: "",
                                                    size: 0,
                                                })}
                                            </Box>
                                            <Text
                                                className={`text-xs ${focused ? "text-accent-500 font-semibold" : "text-typography-700"}`}
                                            >
                                                {metadata.options.title}
                                            </Text>
                                        </Pressable>
                                    </NavigationRouteContext.Provider>
                                </NavigationContext.Provider>
                            );
                        })}
                    </Box>
                </BlurView>
            </Box>
        </Box>
    );
}

export default function TabLayout() {
    const { theme, styles } = useStyles(styleSheet);
    const tabBarActiveTintColor = theme.colors.accent[500];
    const { showYuruChara } = useSettingsStore(state => ({
        showYuruChara: state.showYuruChara,
    }));
    const { enableNavbar2 } = useFeaturesStore(state => ({
        enableNavbar2: state.enableNavbar2,
    }));

    return (
        <View style={styles.container}>
            <Tabs
                tabBar={enableNavbar2 ? tabBarV2 : tabBarV1}
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
                        tabBarIcon: iconList,
                        headerShown: false,
                    }}
                />
                <Tabs.Screen
                    name="index"
                    options={{
                        title: "查询",
                        tabBarIcon: iconSearch,
                        headerShown: false,
                    }}
                />
                <Tabs.Screen
                    name="settings"
                    options={{
                        title: "设置",
                        tabBarIcon: iconSettings,
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
        backgroundColor: theme.colorTokens.background,
        borderTopWidth: 0,
        shadowColor: "transparent",
    },
    tabBarLabelStyle: {},
}));
