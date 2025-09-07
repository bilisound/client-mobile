import type { PlaylistMeta } from "~/storage/sqlite/schema";
import type { GetMetadataResponse } from "@bilisound/sdk";

type PageItem = GetMetadataResponse["pages"][number];

declare module "react-native-actions-sheet" {
  interface Sheets {
    "playlist-actions": {
      payload: { displayTrack?: PlaylistMeta } | undefined;
      returnValue: "edit" | "editCover" | "delete" | "export" | "close";
    };

    "playlist-detail-actions": {
      payload: { current: PlaylistMeta } | undefined;
      returnValue: "editMeta" | "editCover" | "editMass" | "close";
    };

    "video-page-item-actions": {
      payload:
        | {
            displayTrack: PageItem;
            data: GetMetadataResponse;
            onAction: (action: "addPlaylist" | "addPlaylistRecent" | "close") => void;
          }
        | undefined;
      returnValue: "addPlaylist" | "close";
    };

    "video-page-menu-actions": {
      payload:
        | {
            data: GetMetadataResponse;
            onAction: (action: "addPlaylist") => void;
          }
        | undefined;
      returnValue: "addPlaylist" | "close" | undefined;
    };

    "player-control-menu": {
      payload: undefined;
      returnValue: "view" | "addPlaylist" | "speed" | "close";
    };

    "player-speed-menu": {
      payload: undefined;
      returnValue: void | undefined;
    };
  }
}
