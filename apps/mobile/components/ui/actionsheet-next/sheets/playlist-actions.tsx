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
import { ActionSheetCurrent } from "~/components/action-sheet-current";
import { ActionMenuNext, type ActionMenuItem } from "~/components/ui/actionsheet-next/menu";
import { getImageProxyUrl } from "~/business/constant-helper";
import type { PlaylistMeta } from "~/storage/sqlite/schema";

type Payload = {
  displayTrack?: PlaylistMeta;
};

const SHEET_ID = "playlist-actions";

function PlaylistActionsSheet() {
  const payload = useSheetPayload() as Payload | undefined;
  const displayTrack = payload?.displayTrack;

  const showEditCover = !displayTrack?.source;

  const menuItems: ActionMenuItem[] = [
    {
      show: true,
      disabled: false,
      icon: "fa6-solid:pen",
      iconSize: 18,
      text: "修改信息",
      action: () => SheetManager.hide(SHEET_ID, { payload: "edit" }),
    },
    {
      show: !!displayTrack && showEditCover && (displayTrack?.amount ?? 0) > 0,
      disabled: false,
      icon: "fa6-solid:images",
      iconSize: 18,
      text: "修改封面",
      action: () => SheetManager.hide(SHEET_ID, { payload: "editCover" }),
    },
    {
      show: true,
      disabled: false,
      icon: "fa6-solid:trash",
      iconSize: 18,
      text: "删除",
      action: () => SheetManager.hide(SHEET_ID, { payload: "delete" }),
    },
    {
      show: true,
      disabled: false,
      icon: "fa6-solid:file-export",
      iconSize: 18,
      text: "导出",
      action: () => SheetManager.hide(SHEET_ID, { payload: "export" }),
    },
    {
      show: true,
      disabled: false,
      icon: "fa6-solid:xmark",
      iconSize: 20,
      text: "取消",
      action: () => SheetManager.hide(SHEET_ID, { payload: "close" }),
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
        {!!displayTrack && (
          <ActionSheetCurrent
            line1={displayTrack.title}
            line2={`${displayTrack.amount} 首歌曲`}
            image={getImageProxyUrl(displayTrack.imgUrl!)}
          />
        )}
        <ActionMenuNext menuItems={menuItems} />
      </ActionsheetContent>
    </ActionSheet>
  );
}

registerSheet(SHEET_ID, PlaylistActionsSheet);

export {};
