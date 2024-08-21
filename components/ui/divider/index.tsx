"use client";
import { createDivider } from "@gluestack-ui/divider";
import type { VariantProps } from "@gluestack-ui/nativewind-utils";
import { tva } from "@gluestack-ui/nativewind-utils/tva";
import { cssInterop } from "nativewind";
import React from "react";
import { View } from "react-native";

const dividerStyle = tva({
    base: "bg-background-200",
    variants: {
        orientation: {
            vertical: "w-px h-full",
            horizontal: "h-px w-full",
        },
    },
});

const UIDivider = createDivider({ Root: View });

cssInterop(UIDivider, { className: "style" });

type IUIDividerProps = React.ComponentPropsWithoutRef<typeof UIDivider> & VariantProps<typeof dividerStyle>;

const Divider = React.forwardRef<React.ElementRef<typeof UIDivider>, IUIDividerProps>(
    ({ className, orientation = "horizontal", ...props }, ref) => {
        return (
            <UIDivider
                ref={ref}
                {...props}
                className={dividerStyle({
                    orientation,
                    class: className,
                })}
            />
        );
    },
);

Divider.displayName = "Divider";

export { Divider };
