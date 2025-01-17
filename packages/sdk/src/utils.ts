export function filterHostname(list: string[]) {
    return list.map(e => {
        try {
            const { hostname } = new URL(e);
            return hostname;
        } catch (er) {
            // 日志用的工具函数，错误在这里不重要
            return e;
        }
    });
}
