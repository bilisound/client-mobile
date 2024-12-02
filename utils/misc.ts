export function simpleCopy<T>(input: T): T {
    return JSON.parse(JSON.stringify(input));
}
