import { useSafeAreaInsets } from "react-native-safe-area-context";

import useFeaturesStore from "~/store/features";

export function useTabPaddingBottom() {
    const { enableNavbar2 } = useFeaturesStore(state => ({
        enableNavbar2: state.enableNavbar2,
    }));
    const edgeInsets = useSafeAreaInsets();

    // normal: 47, md: 65

    return enableNavbar2 ? edgeInsets.bottom + 88 : 0;
}
