"use client";
import type { VariantProps } from "@gluestack-ui/nativewind-utils";
import { tva } from "@gluestack-ui/nativewind-utils/tva";
import { withStyleContext } from "@gluestack-ui/nativewind-utils/withStyleContext";
import { withStyleContextAndStates } from "@gluestack-ui/nativewind-utils/withStyleContextAndStates";
import { createSwitch } from "@gluestack-ui/switch";
import { cssInterop } from "nativewind";
import React from "react";
import { Switch as RNSwitch, Platform, useColorScheme } from "react-native";
import { useStyles } from "react-native-unistyles";

const SwitchWrapper = React.forwardRef<React.ElementRef<typeof RNSwitch>, React.ComponentProps<typeof RNSwitch>>(
    ({ ...props }, ref) => {
        return <RNSwitch {...props} ref={ref} />;
    },
);

const UISwitch = createSwitch({
    Root: Platform.OS === "web" ? withStyleContext(SwitchWrapper) : withStyleContextAndStates(SwitchWrapper),
});

cssInterop(SwitchWrapper, { className: "style" });

const switchStyle = tva({
    base: "data-[focus=true]:outline-0 data-[focus=true]:ring-2 data-[focus=true]:ring-indicator-primary web:cursor-pointer disabled:cursor-not-allowed data-[disabled=true]:opacity-40 data-[invalid=true]:border-error-700 data-[invalid=true]:rounded-xl data-[invalid=true]:border-2",

    variants: {
        size: {
            sm: "scale-75",
            md: "",
            lg: "scale-125",
        },
    },
});

type ISwitchProps = React.ComponentProps<typeof UISwitch> & VariantProps<typeof switchStyle>;
const Switch = React.forwardRef<React.ElementRef<typeof UISwitch>, ISwitchProps>(
    ({ className, size = "md", ...props }, ref) => {
        // 不是很科学的做法，但是 workaround
        const { theme } = useStyles();
        const colorScheme = useColorScheme();
        const dark = colorScheme === "dark";

        return (
            <UISwitch
                ref={ref}
                trackColor={{
                    false: theme.colors.primary[dark ? 950 : 300],
                    true: theme.colors.primary[dark ? 700 : 500],
                }}
                thumbColor={theme.colors.primary[dark ? 500 : 50]}
                ios_backgroundColor={theme.colors.primary[dark ? 950 : 300]}
                {...props}
                className={switchStyle({ size, class: className })}
            />
        );
    },
);

Switch.displayName = "Switch";
export { Switch };
