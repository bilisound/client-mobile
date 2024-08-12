import React from "react";
import { View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import useDownloadStore from "~/store/download";

// 加载进度条
export default function ProgressBar({ item }: { item: string }) {
    const { downloadList } = useDownloadStore(state => ({
        downloadList: state.downloadList,
    }));
    const downloadEntry = downloadList.get(item);
    const { styles } = useStyles(stylesheet);

    if (!downloadEntry) {
        return null;
    }

    const progressWidth = (downloadEntry.progress.bytesWritten / downloadEntry.progress.contentLength) * 100;

    return <View style={[styles.progressBar, { width: `${progressWidth}%` }]} />;
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
