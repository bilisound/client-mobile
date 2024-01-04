export default class ExpiringMap<K, V> {
    private map: Map<K, { value: V; expirationTime: number; creationTime: number }> = new Map();

    private readonly defaultExpirationTime: number;

    constructor(defaultExpirationTime: number) {
        this.defaultExpirationTime = defaultExpirationTime;
    }

    set(key: K, value: V, expirationTime?: number): void {
        const creationTime = Date.now();
        const expiration = expirationTime !== undefined ? expirationTime : this.defaultExpirationTime;
        const expirationTimeInMillis = creationTime + expiration;

        this.map.set(key, {
            value,
            creationTime,
            expirationTime: expirationTimeInMillis,
        });
    }

    get(key: K): V | undefined {
        const entry = this.map.get(key);

        if (entry && entry.expirationTime > Date.now()) {
            return entry.value;
        }
        this.map.delete(key);
        return undefined;
    }

    has(key: K): boolean {
        return this.map.has(key) && this.map.get(key)!.expirationTime > Date.now();
    }

    delete(key: K): boolean {
        return this.map.delete(key);
    }

    clear(): void {
        this.map.clear();
    }

    cleanInvalid(): void {
        const now = Date.now();
        this.map.forEach((value, key) => {
            if (value.expirationTime <= now) {
                this.map.delete(key);
            }
        });
    }
}

// 示例用法
/*
const expiringMap = new ExpiringMap<string, number>(5000); // 过期时间设置为5秒

expiringMap.set("key1", 1);
expiringMap.set("key2", 2, 10000); // 自定义过期时间为10秒

console.log(expiringMap.get("key1")); // 输出: 1
console.log(expiringMap.get("key2")); // 输出: 2

setTimeout(() => {
    console.log(expiringMap.get("key1")); // 输出: undefined (已过期)
    console.log(expiringMap.get("key2")); // 输出: 2 (未过期)
}, 6000);
*/
