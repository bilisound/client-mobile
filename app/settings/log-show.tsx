import { Octicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { cssInterop } from "nativewind";
import React from "react";

import CommonLayout from "~/components/CommonLayout";
import LogViewer from "~/components/dom/LogViewer";
import PotatoButtonTitleBar from "~/components/potato-ui/PotatoButtonTitleBar";
import { createIcon } from "~/components/potato-ui/utils/icon";
import { getLogContentForDisplay, shareLogContent } from "~/utils/logger";

const IconShare = createIcon(Octicons, "share");

cssInterop(LogViewer, { className: "style" });

const App: React.FC = () => {
    const { data } = useQuery({
        queryKey: ["log-show"],
        queryFn: getLogContentForDisplay,
        staleTime: 5000,
    });

    const handleShare = async () => {
        await shareLogContent(data ?? "");
    };

    return (
        <CommonLayout
            title="导出日志"
            leftAccessories="backButton"
            rightAccessories={
                <PotatoButtonTitleBar
                    label="分享日志文件"
                    Icon={IconShare}
                    iconSize={22}
                    theme="solid"
                    onPress={() => handleShare()}
                />
            }
            overrideEdgeInsets={{ bottom: 0 }}
        >
            {/* todo 需要一个优雅一点的办法来处理设备的 safe area */}
            {data ? <LogViewer text={data} className="text-typography-700 p-4 m-0 w-full" /> : null}
        </CommonLayout>
    );
};

export default App;
