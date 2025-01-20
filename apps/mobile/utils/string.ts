export function convertToHTTPS(url: string) {
    return url.replace(/^http:\/\//, "https://");
}
