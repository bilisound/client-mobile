import { useColorScheme } from "nativewind";
import { Box } from "~/components/ui/box";
import { Text } from "~/components/ui/text";
import { useState } from "react";
import { SystemBars, SystemBarStyle } from "react-native-edge-to-edge";
import { Button, useColorScheme as useColorSchemeRN } from "react-native";
import { shadow } from "~/constants/styles";

export default function Test() {
    const colorScheme = useColorScheme();
    const [theme, setTheme] = useState<SystemBarStyle>("auto");
    const [nativeWindShadow, setNativeWindShadow] = useState(1);

    return (
        <Box
            className={`flex-1 justify-center items-center gap-2 ${theme === "auto" ? "bg-background-0" : ""} ${theme === "dark" ? "bg-blue-300" : ""} ${theme === "light" ? "bg-red-950" : ""}`}
        >
            <SystemBars style={theme} />
            <Text>{`color scheme: ${colorScheme.colorScheme} / ${useColorSchemeRN()}`}</Text>
            <Text>{`theme: ${theme}`}</Text>
            <Box className={"flex-row gap-4"}>
                <Button title={"auto"} onPress={() => setTheme("auto")} />
                <Button title={"light"} onPress={() => setTheme("light")} />
                <Button title={"dark"} onPress={() => setTheme("dark")} />
            </Box>
            <Box className={"flex-row gap-4"}>
                <Button title={"RN Shadow"} onPress={() => setNativeWindShadow(0)} />
                <Button title={"NW Shadow"} onPress={() => setNativeWindShadow(1)} />
                <Button title={"Off"} onPress={() => setNativeWindShadow(2)} />
            </Box>
            {nativeWindShadow === 0 && (
                <Box className={"gap-12 mt-8"} key={"test-0"}>
                    <Box className={"bg-blue-500 w-48 h-16 rounded-lg"} style={{ boxShadow: shadow.sm }} />
                    <Box className={"bg-blue-500 w-48 h-16 rounded-lg"} style={{ boxShadow: shadow.DEFAULT }} />
                    <Box className={"bg-blue-500 w-48 h-16 rounded-lg"} style={{ boxShadow: shadow.md }} />
                    <Box className={"bg-blue-500 w-48 h-16 rounded-lg"} style={{ boxShadow: shadow.lg }} />
                    <Box className={"bg-blue-500 w-48 h-16 rounded-lg"} style={{ boxShadow: shadow.xl }} />
                    <Box className={"bg-blue-500 w-48 h-16 rounded-lg"} style={{ boxShadow: shadow["2xl"] }} />
                </Box>
            )}
            {nativeWindShadow === 1 && (
                <Box className={"gap-12 mt-8"} key={"test-1"}>
                    <Box className={"bg-blue-500 w-48 h-16 rounded-lg shadow-sm"} />
                    <Box className={"bg-blue-500 w-48 h-16 rounded-lg shadow"} />
                    <Box className={"bg-blue-500 w-48 h-16 rounded-lg shadow-md"} />
                    <Box className={"bg-blue-500 w-48 h-16 rounded-lg shadow-lg"} />
                    <Box className={"bg-blue-500 w-48 h-16 rounded-lg shadow-xl"} />
                    <Box className={"bg-blue-500 w-48 h-16 rounded-lg shadow-2xl"} />
                </Box>
            )}
            {nativeWindShadow === 2 && (
                <Box className={"gap-12 mt-8"} key={"test-2"}>
                    <Box className={"bg-blue-500 w-48 h-16 rounded-lg shadow-test"} />
                    <Box className={"bg-blue-500 w-48 h-16 rounded-lg shadow-test2"} />
                    <Box
                        className={"bg-blue-500 w-48 h-16 rounded-lg"}
                        style={{ boxShadow: "0px 0px 40px rgba(157, 66, 200, 1)" }}
                    />
                    <Box
                        className={"bg-blue-500 w-48 h-16 rounded-lg"}
                        style={{
                            boxShadow: "0px 0px 40px rgba(157, 200, 8, 1), 10px -10px 20px rgba(221, 32, 21, 1)",
                        }}
                    />
                    <Box className={"bg-blue-500 w-48 h-16 rounded-lg"} />
                    <Box className={"bg-blue-500 w-48 h-16 rounded-lg"} />
                </Box>
            )}
        </Box>
    );
}
