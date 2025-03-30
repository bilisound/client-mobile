import { useSafeAreaFrame } from "react-native-safe-area-context";

export function useIsNarrowWidth() {
    const windowDimensions = useSafeAreaFrame();
    return windowDimensions.height < 480;
}
