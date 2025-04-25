import { Layout } from "~/components/layout";
import { Text } from "~/components/ui/text";
import { useLocalSearchParams } from "expo-router";

export default function Page() {
    const { id } = useLocalSearchParams<{ id: string }>();

    return (
        <Layout leftAccessories={"BACK_BUTTON"} title={"下载音频"}>
            <Text>{`下载音频 ${id}`}</Text>
        </Layout>
    );
}
