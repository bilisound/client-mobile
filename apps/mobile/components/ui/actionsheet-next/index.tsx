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

// Tailwind's screen-md default is 768px; used to cap width on Web fallback
const WEB_SHEET_MAX_WIDTH = 768;

// Global gate for Web to serialize sheet animations: ensure next open waits
// until the previous sheet has fully closed.
let __webBackdropVisible = false;
const __webBackdropWaiters: (() => void)[] = [];
function __waitBackdropHidden(): Promise<void> {
  if (!__webBackdropVisible) return Promise.resolve();
  return new Promise(resolve => {
    __webBackdropWaiters.push(resolve);
  });
}
function __setBackdropVisible(value: boolean) {
  const changed = __webBackdropVisible !== value;
  __webBackdropVisible = value;
  if (changed && !value) {
    const arr = __webBackdropWaiters.splice(0, __webBackdropWaiters.length);
    arr.forEach(fn => fn());
  }
}

const contentStyle = tva({
  base: "max-w-screen-md w-full mx-auto items-center rounded-3xl rounded-tr-3xl p-2 pt-2 pb-safe bg-background-0 web:pointer-events-auto web:select-none shadow-hard-5 border border-b-0 border-outline-100",
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

  // Web fallback: render real DOM with CSS transitions for perfect control
  if (Platform.OS === "web") {
    const overlayColor = sheetProps.overlayColor ?? "black";
    const overlayOpacity = sheetProps.defaultOverlayOpacity ?? 0.3;

    const [visible, setVisible] = React.useState(isOpen);
    const [active, setActive] = React.useState(isOpen); // whether sheet is in opened state (for transition target)

    const sheetRef = React.useRef<HTMLDivElement | null>(null);
    const overlayRef = React.useRef<HTMLDivElement | null>(null);

    // Track global backdrop state
    React.useEffect(() => {
      if (visible) __setBackdropVisible(true);
    }, [visible]);

    React.useEffect(() => {
      let cancelled = false;
      if (isOpen) {
        if (!visible) {
          __waitBackdropHidden().then(() => {
            if (cancelled) return;
            setVisible(true);
            requestAnimationFrame(() => setActive(true));
          });
        } else {
          requestAnimationFrame(() => setActive(true));
        }
      } else if (visible) {
        setActive(false);
      }
      return () => {
        cancelled = true;
      };
    }, [isOpen, visible]);

    // When closing finishes, hide and release gate, call onClose similar to native
    React.useEffect(() => {
      if (!visible) return;
      const el = sheetRef.current;
      if (!el) return;
      const handler = (e: TransitionEvent) => {
        if (e.propertyName !== "transform") return;
        if (!active) {
          setVisible(false);
          __setBackdropVisible(false);
          stable.call();
        }
      };
      el.addEventListener("transitionend", handler);
      return () => el.removeEventListener("transitionend", handler);
    }, [active, visible, stable]);

    const handleBackdropPress = () => {
      setActive(false);
    };

    if (!visible) return null;

    const transitionTiming = "cubic-bezier(0.22, 1, 0.36, 1)"; // easeOutCubic-like
    const durIn = 220;
    const durOut = 180;

    return (
      <>
        <div
          ref={overlayRef as any}
          onClick={handleBackdropPress}
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: overlayColor,
            opacity: active ? overlayOpacity : 0,
            transition: `opacity ${active ? durIn : durOut}ms ${transitionTiming}`,
            zIndex: 9998,
          }}
        />
        <div
          ref={sheetRef as any}
          style={{
            position: "fixed",
            left: "50%",
            bottom: 0,
            transform: active ? "translate(-50%, 0)" : "translate(-50%, 100%)",
            transition: `transform ${active ? durIn : durOut}ms ${transitionTiming}`,
            zIndex: 9999,
            width: "100%",
            maxWidth: WEB_SHEET_MAX_WIDTH,
          }}
        >
          {/* relay RN content into DOM container; RNW will render fine inside */}
          {children}
        </div>
      </>
    );
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
