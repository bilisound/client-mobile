import { UnistylesRegistry } from "react-native-unistyles";

import { breakpoints } from "~/config/breakpoints";
import { BilisoundTheme, classicDark, classicLight } from "~/config/themes";

type AppBreakpoints = typeof breakpoints;
type AppThemes = {
    light: BilisoundTheme;
    dark: BilisoundTheme;
};

declare module "react-native-unistyles" {
    export interface UnistylesBreakpoints extends AppBreakpoints {}
    export interface UnistylesThemes extends AppThemes {}
}

UnistylesRegistry.addBreakpoints(breakpoints).addThemes({
    light: classicLight,
    dark: classicDark,
});
