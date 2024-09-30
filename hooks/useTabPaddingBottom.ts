import useFeaturesStore from "~/store/features";
import { useStyleParamStore } from "~/store/styleParam";

export function useTabPaddingBottom() {
    const { enableNavbar2 } = useFeaturesStore(state => ({
        enableNavbar2: state.enableNavbar2,
    }));
    const { bottomBarHeight } = useStyleParamStore(state => ({
        bottomBarHeight: state.bottomBarHeight,
    }));

    return enableNavbar2 ? bottomBarHeight : 0;
}
