import { sql } from "drizzle-orm";

import { db } from "~/storage/sqlite/main";

export function initDatabase() {
    db.transaction(tx => {
        tx.run(sql`
            CREATE TABLE IF NOT EXISTS \`playlist_meta\`
            (
                \`id\`                integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                \`title\`             text    NOT NULL,
                \`color\`             text    NOT NULL,
                \`amount\`            integer NOT NULL,
                \`create_from_queue\` integer
            );
        `);
        tx.run(sql`
            CREATE TABLE IF NOT EXISTS \`playlist_detail\`
            (
                \`id\`          integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                \`playlist_id\` text    NOT NULL,
                \`author\`      text    NOT NULL,
                \`bvid\`        text    NOT NULL,
                \`duration\`    integer NOT NULL,
                \`episode\`     integer NOT NULL,
                \`title\`       text    NOT NULL,
                \`img_url\`     text    NOT NULL,
                FOREIGN KEY (\`playlist_id\`) REFERENCES \`playlist_meta\` (\`id\`) ON UPDATE no action ON DELETE no action
            );
        `);
    });
}
