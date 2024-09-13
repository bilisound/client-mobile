import React, { useEffect } from "react";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import useDownloadStore from "~/store/download";

// 加载进度条
export default function ProgressBar({ item }: { item: string }) {
    const { downloadList } = useDownloadStore(state => ({
        downloadList: state.downloadList,
    }));
    const downloadEntry = downloadList.get(item);
    const { styles } = useStyles(stylesheet);

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

    return <Animated.View style={[styles.progressBar, animatedStyle]} />;
}

const stylesheet = createStyleSheet(theme => ({
    progressBar: {
        height: 3,
        position: "absolute",
        left: 0,
        bottom: 0,
        backgroundColor: theme.colors.accent[500],
    },
}));
