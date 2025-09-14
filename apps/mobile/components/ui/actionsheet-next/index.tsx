"use client";
import { tva } from "@gluestack-ui/nativewind-utils/tva";
import { cssInterop } from "nativewind";
import React from "react";
import { View, type ViewProps } from "react-native";

const contentStyle = tva({
  base: "max-w-screen-md w-full mx-auto items-center rounded-tl-3xl rounded-tr-3xl p-2 pt-2 pb-safe bg-background-0 web:pointer-events-auto web:select-none shadow-hard-5 border border-b-0 border-outline-100",
});

const dragIndicatorStyle = tva({ base: "w-16 h-1 bg-background-400 rounded-full" });
const dragIndicatorWrapperStyle = tva({ base: "w-full py-1 items-center" });

type ActionsheetContentProps = ViewProps & { className?: string };
const ActionsheetContent = ({ className, ...props }: ActionsheetContentProps) => {
  return <View {...props} className={contentStyle({ class: className })} />;
};

const ActionsheetBackdrop = () => null;

type ActionsheetDragIndicatorProps = ViewProps & { className?: string };
const ActionsheetDragIndicator = ({ className, ...props }: ActionsheetDragIndicatorProps) => {
  return <View {...props} className={dragIndicatorStyle({ class: className })} />;
};

type ActionsheetDragIndicatorWrapperProps = ViewProps & { className?: string };
const ActionsheetDragIndicatorWrapper = ({ className, ...props }: ActionsheetDragIndicatorWrapperProps) => {
  return <View {...props} className={dragIndicatorWrapperStyle({ class: className })} />;
};

cssInterop(View, { className: "style" });

export { ActionsheetBackdrop, ActionsheetContent, ActionsheetDragIndicator, ActionsheetDragIndicatorWrapper };
