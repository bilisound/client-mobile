export function convertToHTTPS(url: string) {
    if (url.startsWith("http://localhost:")) {
        return url;
    }
    return url.replace(/^http:\/\//, "https://");
}
