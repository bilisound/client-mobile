"use client";
import React from "react";
import ActionSheet from "react-native-actions-sheet";
import { registerSheet, SheetManager, useSheetPayload } from "react-native-actions-sheet";
import { View } from "react-native";
import {
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "~/components/ui/actionsheet-next";
import { ActionMenu, type ActionMenuItem } from "~/components/action-menu";
import type { PlaylistMeta } from "~/storage/sqlite/schema";

type Payload = {
  current: PlaylistMeta;
  onAction: (action: "editMeta" | "editCover" | "editMass" | "close") => void;
};

const SHEET_ID = "playlist-detail-actions";

function PlaylistDetailActionsSheet() {
  const payload = useSheetPayload() as Payload | undefined;
  const current = payload?.current;
  const showEditCover = !current?.source;

  const menuItems: ActionMenuItem[] = [
    {
      show: true,
      disabled: false,
      icon: "fa6-solid:pen",
      iconSize: 18,
      text: "修改信息",
      action: () => {
        SheetManager.hide(SHEET_ID);
        payload?.onAction("editMeta");
      },
    },
    {
      show: !!current && showEditCover && (current?.amount ?? 0) > 0,
      disabled: false,
      icon: "fa6-solid:images",
      iconSize: 18,
      text: "修改封面",
      action: () => {
        SheetManager.hide(SHEET_ID);
        payload?.onAction("editCover");
      },
    },
    {
      show: true,
      disabled: false,
      icon: "fa6-solid:list-check",
      iconSize: 18,
      text: "批量管理",
      action: () => {
        SheetManager.hide(SHEET_ID);
        payload?.onAction("editMass");
      },
    },
    {
      show: true,
      disabled: false,
      icon: "fa6-solid:xmark",
      iconSize: 20,
      text: "取消",
      action: () => {
        SheetManager.hide(SHEET_ID);
        payload?.onAction("close");
      },
    },
  ];

  return (
    <ActionSheet
      sheetId={SHEET_ID}
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
    >
      <ActionsheetContent>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        <ActionMenu menuItems={menuItems} />
      </ActionsheetContent>
    </ActionSheet>
  );
}

registerSheet(SHEET_ID, PlaylistDetailActionsSheet);

export {};

