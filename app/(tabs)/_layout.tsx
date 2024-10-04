import { Ionicons, FontAwesome5, Entypo } from "@expo/vector-icons";
// import { BlurView } from "@react-native-community/blur";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs/src/types";
import BottomTabBar from "@react-navigation/bottom-tabs/src/views/BottomTabBar";
import { CommonActions, NavigationContext, NavigationRouteContext } from "@react-navigation/native";
import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import AudioIndicator from "~/components/AudioIndicator";
import YuruChara from "~/components/YuruChara";
import { createIcon } from "~/components/potato-ui/utils/icon";
import { Box } from "~/components/ui/box";
import { Pressable } from "~/components/ui/pressable";
import { Text } from "~/components/ui/text";
import useFeaturesStore from "~/store/features";
import useSettingsStore from "~/store/settings";
import { useStyleParamStore } from "~/store/styleParam";

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

    // const colorScheme = useColorScheme();

    return (
        <Box
            className="bg-transparent absolute left-3 right-3 bottom-3 pt-3 md:left-4 md:right-4 md:bottom-4 items-center pointer-events-box-none z-50"
            style={{
                paddingLeft: props.insets.left,
                paddingRight: props.insets.right,
                paddingBottom: props.insets.bottom,
            }}
            onLayout={e => {
                console.log(e.nativeEvent.layout);
                useStyleParamStore.getState().setBottomBarHeight(-e.nativeEvent.layout.y);
            }}
        >
            <Box className="w-full md:w-[480px] rounded-[32px] md:rounded-[24px] overflow-hidden border border-typography-50 bg-background-0/95 shadow-xl ios:shadow-soft-2">
                <AudioIndicator
                    className="border-t-0 p-3 md:p-3"
                    imageClassName="rounded-[24px] md:rounded-[12px]"
                    playButtonOuterClassName="rounded-full"
                />
                <Box className="w-full h-16 md:h-12 flex-row" accessibilityRole="tablist">
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
                            <NavigationContext.Provider key={route.key} value={props.descriptors[route.key].navigation}>
                                <NavigationRouteContext.Provider value={route}>
                                    <Pressable
                                        key={route.key}
                                        className="flex-1 items-center justify-center gap-1.5 md:flex-row"
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
                                            className={`text-xs md:text-sm ${focused ? "text-accent-500 font-semibold" : "text-typography-700"}`}
                                        >
                                            {metadata.options.title}
                                        </Text>
                                    </Pressable>
                                </NavigationRouteContext.Provider>
                            </NavigationContext.Provider>
                        );
                    })}
                </Box>
                {/*</BlurView>*/}
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
