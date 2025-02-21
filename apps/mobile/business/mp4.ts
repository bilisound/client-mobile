import { File } from "expo-file-system/next";
import { Mp4 } from "mp4.js/dist";

export function extractAudioFile(input: File, output: File) {
    const from = new Date().getTime();

    const stream = input.bytes();
    const m4aBytes = Mp4.extractAudio(stream);

    output.write(m4aBytes);

    console.log(`操作用时 ${(new Date().getTime() - from) / 1000}s`);
}

export const fibonacci = (num: number): number => {
    "worklet";
    if (num <= 1) return num;
    let prev = 0,
        curr = 1;
    for (let i = 2; i <= num; i++) {
        let next = prev + curr;
        prev = curr;
        curr = next;
    }
    return curr;
};
