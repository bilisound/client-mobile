"use client";
import React from "react";
import ActionSheet, { registerSheet, SheetManager, useSheetPayload } from "react-native-actions-sheet";
import { View, Platform } from "react-native";
import {
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "~/components/ui/actionsheet-next";
import { ActionSheetCurrent } from "~/components/action-sheet-current";
import { ActionMenuNext, type ActionMenuItem } from "~/components/ui/actionsheet-next/menu";
import { getImageProxyUrl } from "~/business/constant-helper";
import type { GetMetadataResponse } from "@bilisound/sdk";
import { pause } from "@bilisound/player";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import useSettingsStore from "~/store/settings";
import { getBilisoundResourceUrlOnline } from "~/api/bilisound";
import { formatSecond } from "~/utils/datetime";

type Payload = {
  data: GetMetadataResponse;
  onAction: (action: "addPlaylist") => void;
};

const SHEET_ID = "video-page-menu-actions";

function VideoPageMenuActionsSheet() {
  const payload = useSheetPayload() as Payload | undefined;
  const data = payload?.data;

  if (!data) return null;

  const menuItems: ActionMenuItem[] = [
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
      show: Platform.OS === "web",
      text: "下载",
      icon: "fa6-solid:download",
      iconSize: 18,
      action() {
        SheetManager.hide(SHEET_ID);
        if (data.pages.length === 1) {
          globalThis.window.open(
            getBilisoundResourceUrlOnline(data.bvid, 1, useSettingsStore.getState().useLegacyID ? "av" : "bv").url,
          );
          return;
        }
        router.navigate(`/download-web?id=${data.bvid}`);
      },
    },
    {
      text: "在浏览器打开",
      icon: "fa6-solid:link",
      iconSize: 16,
      show: true,
      async action() {
        await pause();
        await globalThis.open?.("https://www.bilibili.com/video/" + data.bvid + "/");
        SheetManager.hide(SHEET_ID);
      },
    },
    {
      text: "复制视频链接",
      icon: "fa6-solid:copy",
      show: true,
      async action() {
        await Clipboard.setStringAsync("https://www.bilibili.com/video/" + data.bvid + "/");
        Toast.show({
          type: "success",
          text1: "视频链接已复制到剪贴板",
        });
        SheetManager.hide(SHEET_ID);
      },
    },
    {
      text: "取消",
      icon: "fa6-solid:xmark",
      iconSize: 20,
      show: true,
      action() {
        SheetManager.hide(SHEET_ID);
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
        <ActionSheetCurrent
          line1={data.title}
          line2={data.owner.name}
          image={getImageProxyUrl(data.pic, "https://www.bilibili.com/video/" + data.bvid)}
        />
        <ActionMenuNext menuItems={menuItems} />
      </ActionsheetContent>
    </ActionSheet>
  );
}

registerSheet(SHEET_ID, VideoPageMenuActionsSheet);

export {};
