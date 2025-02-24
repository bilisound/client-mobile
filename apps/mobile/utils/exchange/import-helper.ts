import { parse } from "smol-toml";
import {
    playlistDetail,
    PlaylistDetailInsert,
    playlistImportSchema,
    playlistMeta,
    PlaylistMetaInsert,
} from "~/storage/sqlite/schema";
import { db } from "~/storage/sqlite/main";
import Toast from "react-native-toast-message";

interface MigratePlan {
    meta: PlaylistMetaInsert;
    detail: PlaylistDetailInsert[];
}

export function importHelper(content: string) {
    const parsed = parse(content);
    const validationResult = playlistImportSchema.parse(parsed);
    const migratePlan: MigratePlan[] = [];
    for (let i = 0; i < validationResult.meta.length; i++) {
        const meta = validationResult.meta[i];
        const detail = validationResult.detail
            .filter(e => String(e.playlistId) === String(meta.id)) // 存量数据兼容处理
            .map(e => ({ ...e, playlistId: -1 }));
        if (!meta.imgUrl && detail.length > 0) {
            meta.imgUrl = detail[0].imgUrl;
        }
        migratePlan.push({
            meta,
            detail,
        });
    }
    db.transaction(tx => {
        for (let i = 0; i < migratePlan.length; i++) {
            const e = migratePlan[i];
            const { lastInsertRowId } = tx
                .insert(playlistMeta)
                .values({ ...e.meta, amount: e.detail.length, id: undefined })
                .run();
            for (let j = 0; j < e.detail.length; j++) {
                const f = e.detail[j];
                tx.insert(playlistDetail)
                    .values({ ...f, id: undefined, playlistId: lastInsertRowId })
                    .run();
            }
        }
    });
    Toast.show({
        type: "success",
        text1: "歌单导入成功",
        text2: `导入了 ${migratePlan.length} 个歌单`,
    });
}
