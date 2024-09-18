import { UserListMode } from "~/api/bilisound";
import { Numberish } from "~/typings/common";

export type PlaylistSource =
    | {
          type: "video";
          bvid: string;
      }
    | {
          type: "playlist";
          subType: UserListMode;
          userId: Numberish;
          listId: Numberish;
      };
