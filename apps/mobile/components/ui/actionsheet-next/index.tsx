"use client";
import React, { useEffect, useMemo, useRef } from "react";
import { Platform, View, type ViewProps } from "react-native";
import ActionSheet, { type ActionSheetRef } from "react-native-actions-sheet";
import { tva } from "@gluestack-ui/nativewind-utils/tva";
import { cssInterop } from "nativewind";

type ActionsheetBaseProps = {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
} & React.ComponentPropsWithoutRef<typeof ActionSheet>;

const contentStyle = tva({
  base: "max-w-screen-md w-full mx-auto items-center rounded-tl-3xl rounded-tr-3xl p-2 pt-2 pb-safe bg-background-0 web:pointer-events-auto web:select-none shadow-hard-5 border border-b-0 border-outline-100",
});

const dragIndicatorStyle = tva({ base: "w-16 h-1 bg-background-400 rounded-full" });
const dragIndicatorWrapperStyle = tva({ base: "w-full py-1 items-center" });

function useStable(onClose?: () => void) {
  const fnRef = useRef(onClose);
  useEffect(() => {
    fnRef.current = onClose;
  }, [onClose]);
  return useMemo(
    () => ({
      call: () => fnRef.current?.(),
    }),
    [],
  );
}

const Actionsheet = ({ isOpen, onClose, children, ...sheetProps }: ActionsheetBaseProps) => {
  const ref = useRef<ActionSheetRef>(null);
  const stable = useStable(onClose);

  useEffect(() => {
    if (isOpen) {
      ref.current?.show();
    } else {
      ref.current?.hide();
    }
  }, [isOpen]);

  // Web fallback: render inline content without modal behavior
  if (Platform.OS === "web") {
    return isOpen ? <View>{children}</View> : null;
  }

  return (
    <ActionSheet
      ref={ref}
      onClose={() => stable.call()}
      containerStyle={{
        backgroundColor: "transparent",
        borderColor: "transparent",
        borderWidth: 0,
        shadowColor: "transparent",
        shadowOpacity: 0,
        elevation: 0,
      }}
      indicatorStyle={{ backgroundColor: "transparent" }}
      elevation={0}
      CustomHeaderComponent={<View style={{ height: 0 }} />}
      gestureEnabled
      closeOnTouchBackdrop
      {...sheetProps}
    >
      {children}
    </ActionSheet>
  );
};

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

export {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
};
