import { UnistylesRegistry } from "react-native-unistyles";

import { breakpoints } from "~/config/breakpoints";
import { BilisoundTheme, classicDark, classicLight, redDark, redLight } from "~/config/themes";

type AppBreakpoints = typeof breakpoints;
type AppThemes = Record<string, BilisoundTheme>;

declare module "react-native-unistyles" {
    export interface UnistylesBreakpoints extends AppBreakpoints {}
    export interface UnistylesThemes extends AppThemes {}
}

UnistylesRegistry.addBreakpoints(breakpoints).addThemes({
    classic_light: classicLight,
    classic_dark: classicDark,
    red_light: redLight,
    red_dark: redDark,
});
