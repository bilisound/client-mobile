import { useWindowDimensions } from "react-native";

export function useIsNarrowWidth() {
    const windowDimensions = useWindowDimensions();
    return windowDimensions.height < 480;
}
