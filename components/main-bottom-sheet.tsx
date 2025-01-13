import React, { useCallback, useMemo, useRef, useEffect, useLayoutEffect, useState } from "react";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { useBottomSheetStore } from "~/store/bottom-sheet";
import { Text } from "~/components/ui/text";
import { useRawThemeValues } from "~/components/ui/gluestack-ui-provider/theme";
import { useCurrentTrack } from "@bilisound/player";
import { Image } from "expo-image";
import { useWindowDimensions, View } from "react-native";

export function PlayerControl() {
    const currentTrack = useCurrentTrack();
    const windowDimensions = useWindowDimensions();
    const targetRef = useRef<View>(null);
    const [imageSize, setImageSize] = useState(0);

    // todo 需要解决旋转多次以后图片变小的问题
    useLayoutEffect(() => {
        // The measurement and state update for `targetRect` happens in a single commit
        // allowing ToolTip to position itself without intermediate paints
        targetRef.current?.measureInWindow((x, y, width, height) => {
            console.log({ x, y, width, height });
            setImageSize(Math.min(width, height));
        });
    }, [windowDimensions]);

    console.log(imageSize);

    return (
        <View className={"flex-1 flex-col md:flex-row"}>
            <View className={"flex-1 bg-red-500 items-center justify-center overflow-hidden"} ref={targetRef}>
                <Image source={currentTrack?.artworkUri} style={{ width: imageSize, height: imageSize }}></Image>
            </View>
            <View className={"flex-0 basis-auto bg-yellow-500"}>
                <Text>下方</Text>
            </View>
        </View>
    );
}

export function MainBottomSheet() {
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const { isOpen, close } = useBottomSheetStore();
    const windowDimensions = useWindowDimensions();

    // 主题色调用
    const { colorValue } = useRawThemeValues();

    // 设置可用的快照点（0 = 关闭，1 = 全屏）
    const snapPoints = useMemo(() => ["100%"], []);

    const renderBackdrop = useCallback(
        (props: BottomSheetBackdropProps) => (
            <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
        ),
        [],
    );

    useEffect(() => {
        console.log(isOpen);
        if (isOpen) {
            bottomSheetRef.current?.present();
        } else {
            bottomSheetRef.current?.dismiss();
        }
    }, [isOpen]);

    console.log("windowDimensions " + JSON.stringify(windowDimensions));

    return (
        <BottomSheetModal
            ref={bottomSheetRef}
            index={0}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            enablePanDownToClose
            onDismiss={close}
            handleComponent={null}
            enableDynamicSizing={false}
            backgroundStyle={{ backgroundColor: colorValue("--color-background-0") }}
        >
            <BottomSheetView
                className={"p-safe"}
                // 缓解 bottom sheet 无法正确处理横屏的情况
                style={{ width: windowDimensions.width, height: windowDimensions.height }}
            >
                <PlayerControl />
            </BottomSheetView>
        </BottomSheetModal>
    );
}
