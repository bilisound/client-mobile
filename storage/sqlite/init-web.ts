import { openDB, DBSchema, IDBPDatabase } from "idb";

import { PlaylistMeta } from "~/storage/sqlite/schema";

interface MyDB extends DBSchema {
    playlistMeta: {
        key: number;
        value: PlaylistMeta;
    };
}

export let idb: IDBPDatabase<MyDB>;

export async function init() {
    idb = await openDB<MyDB>("bilisound-playlist", 1, {
        upgrade(db) {
            db.createObjectStore("playlistMeta", {
                keyPath: "id",
                autoIncrement: true,
            });
        },
    });

    await idb.put("playlistMeta", {
        amount: 1,
        color: "#66ccff",
        description: "",
        extendedData: null,
        id: 1,
        imgUrl: "",
        source: null,
        title: "111111",
    });
}
