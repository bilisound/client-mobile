"use client";
import React from "react";
import { View } from "react-native";
import ActionSheet, { registerSheet, SheetManager, useSheetPayload } from "react-native-actions-sheet";
import { getImageProxyUrl } from "~/business/constant-helper";
import { ActionSheetCurrent } from "~/components/action-sheet-current";
import {
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "~/components/ui/actionsheet-next";
import { ActionMenuNext, type ActionMenuItem } from "~/components/ui/actionsheet-next/menu";

const SHEET_ID = "playlist-detail-actions" as const;

function PlaylistDetailActionsSheet() {
  const payload = useSheetPayload<typeof SHEET_ID>();
  const current = payload?.current;
  const showEditCover = !current?.source;

  const menuItems: ActionMenuItem[] = [
    {
      show: true,
      disabled: false,
      icon: "fa6-solid:pen",
      iconSize: 18,
      text: "修改信息",
      action: () => SheetManager.hide(SHEET_ID, { payload: "editMeta" }),
    },
    {
      show: !!current && showEditCover && (current?.amount ?? 0) > 0,
      disabled: false,
      icon: "fa6-solid:images",
      iconSize: 18,
      text: "修改封面",
      action: () => SheetManager.hide(SHEET_ID, { payload: "editCover" }),
    },
    {
      show: true,
      disabled: false,
      icon: "fa6-solid:list-check",
      iconSize: 18,
      text: "批量管理",
      action: () => SheetManager.hide(SHEET_ID, { payload: "editMass" }),
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
        {!!current && (
          <ActionSheetCurrent
            line1={current.title}
            line2={`${current.amount} 首歌曲`}
            image={getImageProxyUrl(current.imgUrl!)}
          />
        )}
        <ActionMenuNext menuItems={menuItems} />
      </ActionsheetContent>
    </ActionSheet>
  );
}

registerSheet(SHEET_ID, PlaylistDetailActionsSheet);

export {};
