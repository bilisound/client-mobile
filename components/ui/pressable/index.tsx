"use client";
import type { VariantProps } from "@gluestack-ui/nativewind-utils";
import { tva } from "@gluestack-ui/nativewind-utils/tva";
import { withStyleContext } from "@gluestack-ui/nativewind-utils/withStyleContext";
import { withStyleContextAndStates } from "@gluestack-ui/nativewind-utils/withStyleContextAndStates";
import { createPressable } from "@gluestack-ui/pressable";
import { cssInterop } from "nativewind";
import React from "react";
import { Pressable as RNPressable, Platform } from "react-native";

const UIPressable = createPressable({
    Root: Platform.OS === "web" ? withStyleContext(RNPressable) : withStyleContextAndStates(RNPressable),
});

const pressableStyle = tva({
    base: "data-[focus-visible=true]:outline-none data-[focus-visible=true]:ring-indicator-info data-[focus-visible=true]:ring-2 data-[disabled=true]:opacity-40",
});

cssInterop(UIPressable, { className: "style" });

type IPressableProps = Omit<React.ComponentProps<typeof UIPressable>, "context"> & VariantProps<typeof pressableStyle>;
const Pressable = React.forwardRef<React.ElementRef<typeof UIPressable>, IPressableProps>(
    ({ className, ...props }, ref) => {
        return (
            <UIPressable
                {...props}
                ref={ref}
                className={pressableStyle({
                    class: className,
                })}
            />
        );
    },
);

Pressable.displayName = "Pressable";
export { Pressable };
