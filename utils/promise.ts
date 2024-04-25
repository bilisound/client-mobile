import chunk from "lodash/chunk";

export async function runTasksLimit(tasks: (() => Promise<void>)[], limit = 10) {
    const grouped = chunk(tasks, limit);
    for (let i = 0; i < grouped.length; i++) {
        const e = grouped[i];
        const promises = e.map(e => e());
        await Promise.all(promises);
    }
}
