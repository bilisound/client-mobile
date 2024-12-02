import { createContext, useContext } from "react";
import { EdgeInsets } from "react-native-safe-area-context";

export const TabSafeAreaContext = createContext<EdgeInsets>({ bottom: 0, left: 0, right: 0, top: 0 });

export function useTabSafeArea(styleValue = false) {
    const edgeInsets = useContext(TabSafeAreaContext);
    if (styleValue) {
        return {
            paddingLeft: edgeInsets.left,
            paddingRight: edgeInsets.right,
            paddingTop: edgeInsets.top,
            paddingBottom: edgeInsets.bottom,
        };
    }
    return edgeInsets;
}
