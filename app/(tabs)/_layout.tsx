import { Ionicons, FontAwesome5, Entypo } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs/src/types";
import BottomTabBar from "@react-navigation/bottom-tabs/src/views/BottomTabBar";
import { CommonActions, NavigationContext, NavigationRouteContext } from "@react-navigation/native";
import { router, Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import AudioIndicator from "~/components/AudioIndicator";
import YuruChara from "~/components/YuruChara";
import { createIcon } from "~/components/potato-ui/utils/icon";
import { Pressable } from "~/components/ui/pressable";
import { Text } from "~/components/ui/text";
import { useIsNarrowWidth } from "~/hooks/useIsNarrowWidth";
import useFeaturesStore from "~/store/features";
import useSettingsStore from "~/store/settings";
import { useStyleParamStore } from "~/store/styleParam";

const IconSearch = createIcon(FontAwesome5, "search");
const IconSettings = createIcon(Ionicons, "settings-sharp");
const IconList = createIcon(Entypo, "list");
const IconDisc = createIcon(FontAwesome5, "compact-disc");

const iconSearch = ({ focused }: { focused: boolean }) => (
    <IconSearch size={17} className={focused ? "color-accent-500" : "color-typography-400"} />
);
const iconSettings = ({ focused }: { focused: boolean }) => (
    <IconSettings size={18} className={focused ? "color-accent-500" : "color-typography-400"} />
);
const iconList = ({ focused }: { focused: boolean }) => (
    <IconList size={22} className={focused ? "color-accent-500" : "color-typography-400"} />
);
const iconDisc = ({ focused }: { focused: boolean }) => (
    <IconDisc size={18} className={focused ? "color-accent-500" : "color-typography-400"} />
);

const tabBarV1 = (props: BottomTabBarProps) => (
    <View>
        <AudioIndicator />
        <BottomTabBar {...props} />
    </View>
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

    const isNarrowWidth = useIsNarrowWidth();

    return (
        <View
            className="bg-transparent absolute left-3 right-3 bottom-3 pt-3 sm:left-4 sm:right-4 sm:bottom-4 items-center pointer-events-box-none z-50"
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
            <View className="w-full sm:w-[480px] rounded-[32px] sm:rounded-[24px] overflow-hidden border border-typography-50 bg-background-0/95 android:shadow-xl ios:shadow-soft-2 web:shadow-[0_20px_25px_-5px_rgb(0_0_0_/_0.1),_0_8px_10px_-6px_rgb(0_0_0_/_0.1)]">
                {isNarrowWidth ? null : (
                    <AudioIndicator
                        className="border-t-0 p-3 sm:p-3"
                        imageClassName="rounded-[24px] sm:rounded-[12px]"
                        playButtonOuterClassName="rounded-full"
                    />
                )}
                <View className="w-full h-16 sm:h-12 flex-row" accessibilityRole="tablist">
                    {isNarrowWidth ? (
                        <Pressable
                            className="flex-1 items-center justify-center gap-1.5 sm:flex-row"
                            onPress={() => {
                                router.push("/modal");
                            }}
                        >
                            <View className="w-6 h-6 items-center justify-center">{iconDisc({ focused: false })}</View>
                            <Text className="text-xs sm:text-sm text-typography-700">正在播放</Text>
                        </Pressable>
                    ) : null}
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
                                        className="flex-1 items-center justify-center gap-1.5 sm:flex-row"
                                        onPress={onPress}
                                        onLongPress={onLongPress}
                                    >
                                        <View className="w-6 h-6 items-center justify-center">
                                            {metadata.options.tabBarIcon?.({
                                                focused,
                                                color: "",
                                                size: 0,
                                            })}
                                        </View>
                                        <Text
                                            className={`text-xs sm:text-sm ${focused ? "text-accent-500 font-semibold" : "text-typography-700"}`}
                                        >
                                            {metadata.options.title}
                                        </Text>
                                    </Pressable>
                                </NavigationRouteContext.Provider>
                            </NavigationContext.Provider>
                        );
                    })}
                </View>
                {/*</BlurView>*/}
            </View>
        </View>
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
