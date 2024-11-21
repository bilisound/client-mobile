import { useStyleParamStore } from "~/store/styleParam";

export function useTabPaddingBottom() {
    const { bottomBarHeight } = useStyleParamStore(state => ({
        bottomBarHeight: state.bottomBarHeight,
    }));

    return bottomBarHeight;
}
