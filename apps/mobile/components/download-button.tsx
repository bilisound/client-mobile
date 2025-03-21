import { Button, ButtonMonIcon, ButtonOuter, ButtonText } from "~/components/ui/button";
import { isCacheExists } from "~/storage/cache-status";
import { addDownloadTask } from "~/business/download";
import Toast from "react-native-toast-message";
import React, { memo } from "react";
import useDownloadStore from "~/store/download";

export interface DownloadButtonProps {
    items: { id: string; episode: number; title: string }[];
}

function DownloadButtonRaw({ items }: DownloadButtonProps) {
    return (
        <ButtonOuter className={"rounded-full"}>
            <Button
                className={"rounded-full"}
                onPress={() => {
                    for (let i = 0; i < items.length; i++) {
                        const e = items[i];
                        if (!isCacheExists(e.id, e.episode)) {
                            addDownloadTask(e.id, e.episode, e.title);
                        }
                        useDownloadStore.getState().pickTask();
                        Toast.show({
                            type: "success",
                            text1: "下载任务已添加",
                        });
                    }
                }}
            >
                <ButtonMonIcon name={"fa6-solid:download"} size={16} />
                <ButtonText>下载</ButtonText>
            </Button>
        </ButtonOuter>
    );
}

export const DownloadButton = memo(DownloadButtonRaw);
