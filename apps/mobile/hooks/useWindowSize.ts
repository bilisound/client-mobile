import { Platform, useWindowDimensions } from "react-native";
import { useSafeAreaFrame } from "react-native-safe-area-context";

// 不直接使用 useWindowDimensions 的原因：https://github.com/facebook/react-native/issues/41918
// 不在 Web 使用 useSafeAreaFrame 的原因：https://github.com/AppAndFlow/react-native-safe-area-context/issues/184
export const useWindowSize = Platform.OS === "web" ? useWindowDimensions : useSafeAreaFrame;
