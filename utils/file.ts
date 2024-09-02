import { Platform } from "react-native";
import RNFS from "react-native-fs";
import { createDocument } from "react-native-saf-x";

export async function saveTextFile(name: string, content: string) {
    if (Platform.OS === "android") {
        const response = await createDocument(content, {
            initialName: name,
            encoding: "utf8",
        });
        return !!response;
    }
}
