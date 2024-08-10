import { PropsWithChildren } from "react";

import { ThemeColorPaletteKeys } from "~/config/palettes";
import { ButtonStatus } from "~/config/themes";

export interface ButtonProps {
    variant?: ThemeColorPaletteKeys;
    status?: ButtonStatus;
}

export default function Button({ variant, status }: PropsWithChildren<ButtonProps>) {}
