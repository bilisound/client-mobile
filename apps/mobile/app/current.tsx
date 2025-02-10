import { View } from "react-native";
import { InsidePageContext, PlayerControl } from "~/components/main-bottom-sheet";

export default function Page() {
    return (
        <View className={"p-safe flex-1"}>
            <InsidePageContext.Provider value={true}>
                <PlayerControl />
            </InsidePageContext.Provider>
        </View>
    );
}
