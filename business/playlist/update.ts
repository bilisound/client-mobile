import { eq } from "drizzle-orm";

import { getBilisoundMetadata, getUserListFull } from "~/api/bilisound";
import { db } from "~/storage/sqlite/main";
import { playlistDetail, PlaylistDetailInsert } from "~/storage/sqlite/schema";
import { PlaylistSource } from "~/typings/playlist";

export async function updatePlaylist(id: number, source: PlaylistSource, progressCallback: (progress: number) => void) {
    switch (source.type) {
        case "playlist": {
            const list = await getUserListFull(source.subType, source.userId, source.listId, progress => {
                progressCallback?.(progress);
            });
            const firstEpisode = await getBilisoundMetadata({ id: list[0].bvid });
            const builtList: PlaylistDetailInsert[] = list.map(e => ({
                author: firstEpisode.data.owner.name,
                bvid: e.bvid ?? "",
                duration: e.duration,
                episode: 1,
                title: e.title,
                imgUrl: e.cover ?? "",
                playlistId: id,
                extendedData: null,
            }));
            db.transaction(tx => {
                tx.delete(playlistDetail).where(eq(playlistDetail.playlistId, id)).run();
                tx.insert(playlistDetail).values(builtList).run();
            });
            break;
        }
        case "video": {
            const data = await getBilisoundMetadata({ id: source.bvid });
            break;
        }
        default: {
            break;
        }
    }
}
