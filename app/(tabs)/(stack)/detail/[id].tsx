import { Text } from "@gluestack-ui/themed";
import { useLocalSearchParams } from "expo-router";

import CommonLayout from "../../../../components/CommonLayout";

export default function Page() {
    const { id } = useLocalSearchParams<{ id: string }>();

    return (
        <CommonLayout title="查看详情" titleBarTheme="transparent">
            <Text>你正在查看 {id}</Text>
        </CommonLayout>
    );
}
