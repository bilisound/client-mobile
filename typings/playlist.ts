import { UserListMode } from "~/api/bilisound";

export type PlaylistSource = {
    type: "video";
    isTainted: boolean;
    bvid: string;
} & {
    type: "playlist";
    isTainted: boolean;
    subType: UserListMode;
    userId: string;
    listId: string;
};
