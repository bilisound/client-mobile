import { Layout } from "~/components/layout";
import { Text } from "~/components/ui/text";
import useDownloadStore, { DownloadItem } from "~/store/download";
import { View } from "react-native";
import { FlashList } from "@shopify/flash-list";
// import { mockDownloadData } from "~/store/mockDownloadData";
import { Pressable } from "~/components/ui/pressable";
import { filesize } from "filesize";

interface DownloadEntryProps {
    item: DownloadItem;
}

function DownloadEntry({ item }: DownloadEntryProps) {
    // const { colorValue } = useRawThemeValues();

    return (
        <Pressable className={"flex-row px-4 items-center"}>
            <View className={"h-[4rem] flex-1 gap-3 justify-center"}>
                <View className={"flex-row gap-4"}>
                    <Text className={"text-sm flex-1"} isTruncated>
                        {item.title}
                    </Text>
                    <Text className={"flex-0 basis-auto text-sm text-typography-500"}>
                        {(() => {
                            if (!item.started) {
                                return "排队中";
                            }
                            const bytesDiff = item.progress.totalBytesWritten - item.progressOld.totalBytesWritten;
                            const timeDiff = (item.updateTime - item.updateTimeOld) / 1000;

                            // Handle cases where timeDiff is 0 or negative
                            const speed = timeDiff > 0 ? bytesDiff / timeDiff : 0;

                            return filesize(speed) + "/s";
                        })()}
                    </Text>
                </View>
                <View className={"w-full h-1 bg-secondary-100"}>
                    {item.started && (
                        <View
                            className={"h-full bg-secondary-300"}
                            style={{
                                width:
                                    item.progress.totalBytesExpectedToWrite === 0
                                        ? 0
                                        : `${(item.progress.totalBytesWritten / item.progress.totalBytesExpectedToWrite) * 100}%`,
                            }}
                        ></View>
                    )}
                </View>
            </View>
        </Pressable>
    );
}

export default function Page() {
    const { downloadList } = useDownloadStore(state => ({ downloadList: state.downloadList }));

    const builtList: DownloadItem[] = Array.from(downloadList.values()).sort((a, b) => a.startTime - b.startTime);

    return (
        <Layout leftAccessories={"BACK_BUTTON"} title={"下载管理"}>
            <FlashList estimatedItemSize={64} data={builtList} renderItem={e => <DownloadEntry item={e.item} />} />
        </Layout>
    );
}
