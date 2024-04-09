import { Text } from "@gluestack-ui/themed";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";

import { getBilisoundMetadata } from "../../../api/bilisound";
import CommonLayout from "../../../components/CommonLayout";

export default function Page() {
    const { id: rawId } = useLocalSearchParams<{ id: string }>();
    const [id, episode] = rawId.split("_");

    // 数据请求
    const { data, error } = useQuery({
        queryKey: [id],
        queryFn: () => getBilisoundMetadata({ id }),
    });

    return (
        <CommonLayout title="添加到歌单" leftAccessories="backButton">
            <Text>{`你正在查看 ${id}, ${episode}`}</Text>
            <Text>{JSON.stringify(data, null, 2)}</Text>
        </CommonLayout>
    );
}
