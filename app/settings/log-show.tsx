import { FontAwesome6, Octicons } from "@expo/vector-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CommonLayout from "~/components/CommonLayout";
import LogViewer from "~/components/dom/LogViewer";
import PotatoButtonTitleBar from "~/components/potato-ui/PotatoButtonTitleBar";
import { createIcon } from "~/components/potato-ui/utils/icon";
import { deleteLogContent, getLogContentForDisplay, shareLogContent } from "~/utils/logger";

const IconShare = createIcon(Octicons, "share");
const IconTrash = createIcon(FontAwesome6, "trash");

const App: React.FC = () => {
    const edgeInsets = useSafeAreaInsets();
    const { data, refetch } = useQuery({
        queryKey: ["log-show"],
        queryFn: getLogContentForDisplay,
        staleTime: 5000,
    });
    const queryClient = useQueryClient();

    const handleShare = async () => {
        await shareLogContent(data ?? "");
    };

    const handleDelete = async () => {
        await deleteLogContent();
        await queryClient.invalidateQueries({ queryKey: ["log-show"] });
        await refetch();
    };

    return (
        <CommonLayout
            title="导出日志"
            leftAccessories="backButton"
            rightAccessories={
                <>
                    {process.env.NODE_ENV === "development" ? (
                        <PotatoButtonTitleBar
                            label="删除日志"
                            Icon={IconTrash}
                            iconSize={20}
                            theme="solid"
                            onPress={() => handleDelete()}
                        />
                    ) : null}
                    <PotatoButtonTitleBar
                        label="分享日志文件"
                        Icon={IconShare}
                        iconSize={22}
                        theme="solid"
                        onPress={() => handleShare()}
                    />
                </>
            }
            overrideEdgeInsets={{ bottom: 0 }}
        >
            {data ? (
                <LogViewer
                    text={data}
                    className="text-typography-700 p-4 m-0 w-full"
                    style={{
                        paddingLeft: edgeInsets.left + 16,
                        paddingRight: edgeInsets.right + 16,
                        paddingBottom: edgeInsets.bottom + 16,
                    }}
                />
            ) : null}
        </CommonLayout>
    );
};

export default App;
