import { Layout } from "~/components/layout";
import { Text } from "~/components/ui/text";
import { useLocalSearchParams } from "expo-router";

export default function Page() {
    const { mode } = useLocalSearchParams<{ mode: string }>();

    return (
        <Layout>
            <Text>{`Remote list ${mode}`}</Text>
        </Layout>
    );
}
