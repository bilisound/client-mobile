import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Asset } from "expo-asset";

import CommonLayout from "~/components/CommonLayout";
import LogViewer from "~/components/dom/LogViewer";

const App: React.FC = () => {
    const edgeInsets = useSafeAreaInsets();
    const { data } = useQuery({
        queryKey: ["license"],
        queryFn: async () => {
            const asset = Asset.fromModule(require("../../third-party-licenses.txt"));
            await asset.downloadAsync();
            const response = await fetch(asset.localUri!);
            return response.text();
        },
    });

    return (
        <CommonLayout title="开源软件使用声明" leftAccessories="backButton" overrideEdgeInsets={{ bottom: 0 }}>
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
