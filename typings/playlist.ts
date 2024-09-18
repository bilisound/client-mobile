import { UserListMode } from "~/api/bilisound";

export type PlaylistSource = {
    type: "video";
    bvid: string;
} & {
    type: "playlist";
    subType: UserListMode;
    userId: string;
    listId: string;
};
