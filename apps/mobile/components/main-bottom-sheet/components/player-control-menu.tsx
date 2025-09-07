import React, { useContext, useEffect } from "react";
import { InsidePageContext } from "~/components/main-bottom-sheet/utils";
import { useCurrentTrack } from "@bilisound/player";
import { useActionSheetStore } from "~/components/main-bottom-sheet/stores";
import { useBottomSheetStore } from "~/store/bottom-sheet";
import { router } from "expo-router";
import { openAddPlaylistPage } from "~/business/playlist/misc";
import { SheetManager } from "react-native-actions-sheet";

export function PlayerControlMenu() {
  const isInsidePage = useContext(InsidePageContext);
  const currentTrack = useCurrentTrack();
  const { showActionSheet, showSpeedActionSheet, handleClose, handleSpeedClose } = useActionSheetStore(state => ({
    showActionSheet: state.showActionSheet,
    showSpeedActionSheet: state.showSpeedActionSheet,
    handleClose: state.handleClose,
    handleSpeedClose: state.handleSpeedClose,
  }));
  const { close } = useBottomSheetStore(state => ({ close: state.close }));

  useEffect(() => {
    if (!showActionSheet) return;
    handleClose();
    SheetManager.show<string>("player-control-menu").then(action => {
      if (!currentTrack?.extendedData) return;
      switch (action) {
        case "view":
          if (isInsidePage) {
            router.replace(`/video/${currentTrack.extendedData.id}`);
          } else {
            close();
            setTimeout(() => router.navigate(`/video/${currentTrack.extendedData?.id}`), 250);
          }
          break;
        case "addPlaylist":
          openAddPlaylistPage({
            name: currentTrack.title ?? "",
            description: "",
            playlistDetail: [
              {
                author: currentTrack.artist ?? "",
                bvid: currentTrack.extendedData?.id ?? "",
                duration: currentTrack.duration ?? 0,
                episode: currentTrack.extendedData?.episode ?? 1,
                title: currentTrack.title ?? "",
                imgUrl: currentTrack.extendedData?.artworkUrl ?? "",
                id: 0,
                playlistId: 0,
                extendedData: null,
              },
            ],
            cover: currentTrack.artworkUri ?? "",
          });
          break;
        case "speed":
          SheetManager.show("player-speed-menu");
          break;
        default:
          break;
      }
    });
  }, [showActionSheet, handleClose, currentTrack, isInsidePage, close]);

  useEffect(() => {
    if (!showSpeedActionSheet) return;
    handleSpeedClose();
    SheetManager.show("player-speed-menu");
  }, [showSpeedActionSheet, handleSpeedClose]);

  return null;
}
