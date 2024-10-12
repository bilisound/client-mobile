import React, { useEffect } from "react";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import useDownloadStore from "~/store/download";

// 加载进度条
export default function ProgressBar({ item }: { item: string }) {
    const { downloadList } = useDownloadStore(state => ({
        downloadList: state.downloadList,
    }));
    const downloadEntry = downloadList.get(item);

    const progress = useSharedValue(0);

    useEffect(() => {
        let progressWidth = 0;
        if (downloadEntry) {
            progressWidth =
                (downloadEntry.progress.totalBytesWritten / downloadEntry.progress.totalBytesExpectedToWrite) * 100;
        }
        // NaN 去除操作
        if (!progressWidth) {
            progressWidth = 0;
        }
        progress.value = withTiming(progressWidth, { duration: 200 });
    }, [downloadEntry, progress]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            width: `${progress.value}%`,
        };
    });

    if (!downloadEntry) {
        return null;
    }

    return <Animated.View style={animatedStyle} className="h-[3px] absolute left-0 bottom-0 bg-accent-500" />;
}
