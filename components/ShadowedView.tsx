import { cssInterop } from "nativewind";
import { ShadowedView as OriginalShadowedView } from "react-native-fast-shadow";

export const ShadowedView = cssInterop(OriginalShadowedView, {
    className: "style",
});
