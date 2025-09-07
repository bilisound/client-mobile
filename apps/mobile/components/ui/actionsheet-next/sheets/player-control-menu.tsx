"use client";
import React, { useContext } from "react";
import ActionSheet from "react-native-actions-sheet";
import { registerSheet, SheetManager, useSheetPayload } from "react-native-actions-sheet";
import { View } from "react-native";
import {
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "~/components/ui/actionsheet-next";
import { ActionSheetCurrent } from "~/components/action-sheet-current";
import { formatSecond } from "~/utils/datetime";
import { useCurrentTrack } from "@bilisound/player";
import { useDownloadMenuItem } from "~/hooks/useDownloadMenuItem";
import { ActionMenuNext, type ActionMenuItem } from "~/components/ui/actionsheet-next/menu";

type Payload = {
  // placeholder for future needs
};

const SHEET_ID = "player-control-menu";

function PlayerControlMenuSheet() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const payload = useSheetPayload() as Payload | undefined;
  const currentTrack = useCurrentTrack();

  const menuItems: ActionMenuItem[] = [
    {
      show: true,
      disabled: false,
      icon: "fa6-solid:eye",
      iconSize: 16,
      text: "查看详情",
      action: () => SheetManager.hide(SHEET_ID, { payload: "view" }),
    },
    {
      show: true,
      disabled: false,
      icon: "fa6-solid:plus",
      iconSize: 18,
      text: "添加到歌单",
      action: () => SheetManager.hide(SHEET_ID, { payload: "addPlaylist" }),
    },
    ...useDownloadMenuItem(currentTrack, () => SheetManager.hide(SHEET_ID)),
    {
      show: true,
      disabled: false,
      icon: "material-symbols:speed-rounded",
      iconSize: 20,
      text: "调节播放速度",
      action: () => SheetManager.hide(SHEET_ID, { payload: "speed" }),
    },
    {
      show: process.env.NODE_ENV === "development",
      disabled: false,
      icon: "fa6-solid:bug",
      iconSize: 18,
      text: "打印 currentTrack 到控制台",
      action: () => {
        // don't close for debug; but keep consistent and close
        console.log(JSON.stringify(currentTrack, null, 4));
        SheetManager.hide(SHEET_ID, { payload: "close" });
      },
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
      containerStyle={{ backgroundColor: "transparent", borderColor: "transparent", borderWidth: 0, shadowColor: "transparent", shadowOpacity: 0, elevation: 0 }}
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
        {!!currentTrack && (
          <ActionSheetCurrent
            line1={currentTrack.title ?? ""}
            line2={formatSecond(currentTrack.duration ?? 0)}
            image={currentTrack.artworkUri}
          />
        )}
        <ActionMenuNext menuItems={menuItems} />
      </ActionsheetContent>
    </ActionSheet>
  );
}

registerSheet(SHEET_ID, PlayerControlMenuSheet);

export {};

