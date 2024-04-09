import { Box } from "@gluestack-ui/themed";

import useCommonColors from "../hooks/useCommonColors";
import useDownloadStore from "../store/download";

// 加载进度条
export default function ProgressBar({ item }: { item: string }) {
    const { downloadList } = useDownloadStore(state => ({
        downloadList: state.downloadList,
    }));
    const downloadEntry = downloadList.get(item);
    const { accentColor } = useCommonColors();

    if (!downloadEntry) {
        return null;
    }

    return (
        <Box
            sx={{
                height: 3,
                position: "absolute",
                backgroundColor: accentColor,
                left: 0,
                bottom: 0,
                width: `${(downloadEntry.progress.bytesWritten / downloadEntry.progress.contentLength) * 100}%`,
            }}
        />
    );
}
