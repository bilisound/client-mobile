import { useSafeAreaInsets } from "react-native-safe-area-context";

import useFeaturesStore from "~/store/features";

export function useTabPaddingBottom() {
    const { enableNavbar2 } = useFeaturesStore(state => ({
        enableNavbar2: state.enableNavbar2,
    }));
    const edgeInsets = useSafeAreaInsets();

    return enableNavbar2 ? edgeInsets.bottom + 88 : 0;
}
