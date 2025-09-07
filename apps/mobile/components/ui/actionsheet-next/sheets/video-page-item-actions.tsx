"use client";
import React from "react";
import ActionSheet, { registerSheet, SheetManager, useSheetPayload } from "react-native-actions-sheet";
import { View } from "react-native";
import {
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "~/components/ui/actionsheet-next";
import { ActionSheetCurrent } from "~/components/action-sheet-current";
import { ActionMenuNext, type ActionMenuItem } from "~/components/ui/actionsheet-next/menu";
import { getImageProxyUrl } from "~/business/constant-helper";
import type { GetMetadataResponse } from "@bilisound/sdk";
import { formatSecond } from "~/utils/datetime";
import { useDownloadMenuItem } from "~/hooks/useDownloadMenuItem";

type PageItem = GetMetadataResponse["pages"][number];

type Payload = {
  displayTrack: PageItem;
  data: GetMetadataResponse;
  onAction: (action: "addPlaylist" | "addPlaylistRecent" | "close") => void;
};

const SHEET_ID = "video-page-item-actions";

function VideoPageItemActionsSheet() {
  const payload = useSheetPayload() as Payload | undefined;
  const displayTrack = payload?.displayTrack;
  const data = payload?.data;

  const menuItems: ActionMenuItem[] = [
    ...(displayTrack && data
      ? useDownloadMenuItem(
          {
            title: displayTrack.part,
            artist: data.owner.name ?? "",
            artworkUri: data.pic ?? "",
            duration: displayTrack.duration ?? 0,
            extendedData: {
              id: data.bvid,
              episode: displayTrack.page,
              isLoaded: false,
              expireAt: 0,
              artworkUrl: data.pic ?? "",
            },
            headers: {},
            id: "",
            mimeType: "",
            uri: "",
          },
          () => SheetManager.hide(SHEET_ID),
        )
      : []),
    {
      text: "添加到歌单",
      icon: "fa6-solid:plus",
      iconSize: 16,
      show: true,
      action() {
        SheetManager.hide(SHEET_ID, { payload: "addPlaylist" });
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

  if (!displayTrack || !data) return null;

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
        <ActionSheetCurrent
          line1={displayTrack.part}
          line2={formatSecond(displayTrack.duration)}
          image={getImageProxyUrl(data.pic, "https://www.bilibili.com/video/" + data.bvid)}
        />
        <ActionMenuNext menuItems={menuItems} />
      </ActionsheetContent>
    </ActionSheet>
  );
}

registerSheet(SHEET_ID, VideoPageItemActionsSheet);

export {};
