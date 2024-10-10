import React from "react";
import { View, useWindowDimensions } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { SCREEN_BREAKPOINTS } from "~/constants/style";

function generateRandomNumbers(amount: number, max = 1, min = 0) {
    const arr: number[] = [];
    for (let i = 0; i < amount; i++) {
        arr.push(Math.random() * (max - min) + min);
    }
    return arr;
}

const descriptionWidth = generateRandomNumbers(9, 100, 40);

const VideoSkeleton: React.FC = () => {
    const { width } = useWindowDimensions();
    const { styles } = useStyles(stylesheet);

    return (
        <View style={[styles.container, width >= SCREEN_BREAKPOINTS.md ? styles.rowDirection : styles.columnDirection]}>
            {/* Left */}
            <View
                style={[
                    styles.leftContainer,
                    width >= SCREEN_BREAKPOINTS.md && styles.leftContainerMd,
                    width >= SCREEN_BREAKPOINTS.lg && styles.leftContainerLg,
                ]}
            >
                <View style={[styles.skeletonBlock, styles.videoPlaceholder]} />
                <View>
                    <View style={[styles.skeletonBlock, styles.titlePlaceholder]} />
                    <View style={styles.infoContainer}>
                        <View style={[styles.skeletonBlock, styles.avatarPlaceholder]} />
                        <View style={[styles.skeletonBlock, styles.channelNamePlaceholder]} />
                        <View style={styles.flex1} />
                        <View style={[styles.skeletonBlock, styles.viewsPlaceholder]} />
                    </View>
                    <View style={styles.descriptionContainer}>
                        {descriptionWidth.map(e => (
                            <View style={[styles.skeletonBlock, { width: `${e}%` }, styles.descriptionLine]} key={e} />
                        ))}
                    </View>
                </View>
            </View>
            {/* Right */}
            <View style={[styles.rightContainer, width >= SCREEN_BREAKPOINTS.md && styles.rightContainerMd]}>
                {/* list item */}
                <View style={styles.listItem}>
                    <View style={styles.listItemContent}>
                        <View style={[styles.skeletonBlock, styles.listItemNumber]} />
                        <View style={styles.flex1}>
                            <View style={[styles.skeletonBlock, styles.listItemTitle]} />
                            <View style={[styles.skeletonBlock, styles.listItemSubtitle]} />
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

const stylesheet = createStyleSheet(theme => ({
    container: {
        flex: 1,
    },
    rowDirection: {
        flexDirection: "row",
    },
    columnDirection: {
        flexDirection: "column",
    },
    leftContainer: {
        flex: 0,
        flexBasis: "auto",
        gap: 16,
        padding: 16,
    },
    leftContainerMd: {
        flex: 1,
    },
    leftContainerLg: {
        flex: 0,
        width: 384,
    },
    skeletonBlock: {
        backgroundColor: theme.colorTokens.foreground,
        borderRadius: 8,
        opacity: 0.1,
    },
    videoPlaceholder: {
        width: "100%",
        aspectRatio: 16 / 9,
    },
    titlePlaceholder: {
        height: 22,
        marginBottom: 16,
        width: "75%",
    },
    infoContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 16,
    },
    avatarPlaceholder: {
        width: 36,
        height: 36,
        borderRadius: 9999,
        flex: 0,
        flexBasis: "auto",
    },
    channelNamePlaceholder: {
        width: "40%",
        height: 19,
        flex: 0,
        flexBasis: "auto",
    },
    flex1: {
        flex: 1,
    },
    viewsPlaceholder: {
        width: 72,
        height: 19,
        flex: 0,
        flexBasis: "auto",
    },
    descriptionContainer: {
        alignItems: "flex-start",
        gap: 5,
    },
    descriptionLine: {
        height: 16,
    },
    rightContainer: {
        flex: 1,
    },
    rightContainerMd: {
        paddingTop: 12,
    },
    listItem: {
        paddingHorizontal: 16,
        gap: 12,
        height: 64,
        flexDirection: "row",
        alignItems: "center",
    },
    listItemContent: {
        flex: 1,
        flexDirection: "row",
        gap: 12,
    },
    listItemNumber: {
        width: 20,
        height: 22,
        flex: 0,
        flexBasis: "auto",
    },
    listItemTitle: {
        width: "90%",
        height: 16,
        marginTop: 3,
    },
    listItemSubtitle: {
        width: 40,
        height: 16,
        marginTop: 8.5,
    },
}));

export default VideoSkeleton;
