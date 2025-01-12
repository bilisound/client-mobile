import { Tabs, TabList, TabTrigger, TabSlot, TabTriggerSlotProps } from "expo-router/ui";
import { Text } from "~/components/ui/text";
import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import { ActivityIndicator, useWindowDimensions, View, Pressable, Platform } from "react-native";
import { ComponentType, forwardRef, Ref } from "react";
import { twMerge } from "tailwind-merge";
import { TabSafeAreaContext } from "~/hooks/useTabSafeAreaInsets";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { breakpoints } from "~/constants/styles";
import { simpleCopy } from "~/utils/misc";
import { YuruChara } from "~/components/yuru-chara";
import useSettingsStore from "~/store/settings";
import { toggle, useCurrentTrack, useIsPlaying, usePlaybackState } from "@bilisound/player";
import { Image } from "expo-image";
import { useRawThemeValues } from "~/components/ui/gluestack-ui-provider/theme";
import { PLACEHOLDER_AUDIO } from "~/constants/playback";
import { Monicon } from "@monicon/native";
import { ButtonOuter } from "~/components/ui/button";

type TabTriggerChildProps = TabTriggerSlotProps & {
    IconComponent: ComponentType<any>;
    iconName: string;
    title: string;
};

const TabTriggerChild = forwardRef(function TabTriggerChild(
    { isFocused, onPress, IconComponent, iconName, title, style, className, ...props }: TabTriggerChildProps,
    ref: Ref<View>,
) {
    return (
        <Pressable
            onPress={onPress}
            className={
                "{}-[android_ripple.color]/color:color-background-200 max-md:flex-1 md:basis-auto h-16 gap-2 w-full flex-col items-center justify-center " +
                "md:w-16 " +
                "xl:flex-row xl:gap-3 xl:h-12 xl:justify-start xl:px-5 xl:w-56 xl:rounded-full " +
                (isFocused ? "xl:bg-background-0" : "")
            }
            {...props}
            ref={ref}
        >
            <IconComponent
                name={iconName}
                className={twMerge("text-[16px]", isFocused ? "color-accent-500" : "color-typography-700/40")}
                size={-1}
            />
            <Text className={twMerge("text-xs xl:text-sm", isFocused ? "color-accent-500 font-semibold" : "")}>
                {title}
            </Text>
        </Pressable>
    );
});

// 播放状态图标
function PlayingIcon() {
    const activeTrack = useCurrentTrack();
    const playbackState = usePlaybackState();
    const isPlaying = useIsPlaying();
    const { colorValueMode } = useRawThemeValues();
    const accentColor = colorValueMode({
        light: { color: "--color-accent-500" },
        dark: { color: "--color-typography-700" },
    });

    // 解决 placeholder 音频还没替换时不恰当的状态显示
    const isPlaceholderTrack = activeTrack?.uri === PLACEHOLDER_AUDIO;

    if (playbackState === "STATE_BUFFERING" || isPlaceholderTrack) {
        return <ActivityIndicator color={accentColor} />;
    }

    return (
        <View className="items-center justify-center size-6 flex-0">
            <Monicon
                name={isPlaying ? "fa6-solid:pause" : "fa6-solid:play"}
                size={isPlaying ? 24 : 20}
                color={accentColor}
            />
        </View>
    );
}

// todo 平板样式
function CurrentPlaying() {
    const currentTrack = useCurrentTrack();

    if (!currentTrack) {
        return null;
    }

    return (
        <View
            className={"w-full h-16 border-b border-typography-700/10 flex-row items-center px-3 gap-4"}
            onLayout={e => console.log(e.nativeEvent.layout)}
        >
            <Image
                source={currentTrack.artworkUri}
                className={"h-10 aspect-video rounded-lg flex-0 basis-auto"}
            ></Image>
            <Text className={"flex-1"} isTruncated>
                {currentTrack.title}
            </Text>
            <ButtonOuter className={"rounded-lg flex-0 basis-auto"}>
                <Pressable
                    className={
                        (Platform.OS === "android"
                            ? "{}-[android_ripple.color]/color:color-background-200"
                            : "hover:bg-background-100 active:bg-background-200") +
                        " size-10 items-center justify-center"
                    }
                    onPress={() => toggle()}
                >
                    <PlayingIcon />
                </Pressable>
            </ButtonOuter>
        </View>
    );
}

// todo TabLayout 用的 edgeInsets 需要拆分为外圈（ScrollView 之外）和内圈（ScrollView 之内）的
export default function TabLayout() {
    const edgeInsets = useSafeAreaInsets();
    const edgeInsetsTab = simpleCopy(edgeInsets);
    const windowDimensions = useWindowDimensions();
    const { showYuruChara } = useSettingsStore(state => ({
        showYuruChara: state.showYuruChara,
    }));

    if (windowDimensions.width < breakpoints.md) {
        edgeInsetsTab.bottom = 0;
    }
    if (windowDimensions.width >= breakpoints.md) {
        edgeInsetsTab.left = 0;
    }

    return (
        <TabSafeAreaContext.Provider value={edgeInsetsTab}>
            <Tabs className={"md:flex-row-reverse"}>
                <TabSlot />
                <TabList
                    className={
                        "flex-0 basis-auto px-safe pb-safe !flex-row !justify-around bg-background-50 " +
                        "max-md:w-full md:h-full md:!flex-col md:pl-safe md:pr-0 md:pt-safe md:!justify-start " +
                        "xl:w-64 xl:items-center"
                    }
                >
                    {/*<CurrentPlaying />*/}
                    <View className={"hidden md:flex h-3 xl:h-4"} aria-hidden={true} />
                    <TabTrigger asChild name="playlist" href="/(main)/(playlist)/playlist">
                        <TabTriggerChild IconComponent={FontAwesome5} iconName={"list"} title={"歌单"} />
                    </TabTrigger>
                    <TabTrigger asChild name="index" href="/(main)">
                        <TabTriggerChild IconComponent={FontAwesome5} iconName={"search"} title={"查询"} />
                    </TabTrigger>
                    <TabTrigger asChild name="settings" href="/(main)/settings">
                        <TabTriggerChild IconComponent={FontAwesome6} iconName={"gear"} title={"设置"} />
                    </TabTrigger>
                </TabList>
                {showYuruChara && <YuruChara />}
            </Tabs>
        </TabSafeAreaContext.Provider>
    );
}
