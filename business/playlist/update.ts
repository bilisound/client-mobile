import { getBilisoundMetadata, getUserListFull } from "~/api/bilisound";
import { PlaylistSource } from "~/typings/playlist";

export async function updatePlaylist(id: number, source: PlaylistSource, progressCallback: (progress: number) => void) {
    switch (source.type) {
        case "playlist": {
            const list = await getUserListFull(source.subType, source.userId, source.listId, progress => {
                progressCallback?.(progress);
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
