import { Toast, ToastDescription, ToastTitle, useToast, VStack } from "@gluestack-ui/themed";
import React from "react";
import { Event, useTrackPlayerEvents } from "react-native-track-player";

import { handleReDownload } from "../utils/download-service";
import log from "../utils/logger";

const events = [Event.PlaybackState, Event.PlaybackError, Event.PlaybackActiveTrackChanged];

const AudioManager: React.FC = () => {
    const toast = useToast();

    useTrackPlayerEvents(events, async event => {
        if (event.type === Event.PlaybackError) {
            toast.show({
                placement: "top",
                render: ({ id }) => (
                    <Toast nativeID={`toast-${id}`} action="error" variant="accent">
                        <VStack space="xs">
                            <ToastTitle>操作失败</ToastTitle>
                            <ToastDescription>目前无法播放这个曲目</ToastDescription>
                        </VStack>
                    </Toast>
                ),
            });
            log.error(`无法播放所请求的曲目。原因：${JSON.stringify(event)}`);
        }
        if (event.type === Event.PlaybackActiveTrackChanged) {
            handleReDownload();
        }
    });

    return null;
};

export default AudioManager;
