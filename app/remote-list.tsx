import { Layout } from "~/components/layout";
import { Text } from "~/components/ui/text";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getUserList, UserListMode } from "~/api/bilisound";

export default function Page() {
    const { userId, listId, mode } = useLocalSearchParams<{ userId: string; listId: string; mode: UserListMode }>();

    const edgeInsets = useSafeAreaInsets();

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        initialPageParam: 1,
        queryKey: [`getEpisodeUser_${mode}_${userId}_${listId}`],
        queryFn: ({ pageParam = 1 }) => getUserList(mode!, userId!, listId!, pageParam),
        getNextPageParam: lastPage => {
            if (lastPage.pageNum < Math.ceil(lastPage.total / lastPage.pageSize)) {
                return lastPage.pageNum + 1;
            }
            return undefined;
        },
    });

    return (
        <Layout title={"查看合集详情"} leftAccessories={"BACK_BUTTON"}>
            <Text>合集详情</Text>
        </Layout>
    );
}
