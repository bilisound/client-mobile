import React from "react";
import { router } from "expo-router";
import { Image } from "expo-image";
import { Linking, ScrollView } from "react-native";
import { Box, Text, Pressable } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { BILISOUND_OFFICIAL_WEBSITE } from "../constants/branding";
import CommonFrameNew from "../components/CommonFrameNew";
import { COMMON_FRAME_SOLID_BUTTON_STYLE } from "../constants/style";

const History: React.FC = () => (
    <CommonFrameNew
        title="关于"
        extendToBottom
        leftAccessories={
            <Pressable sx={COMMON_FRAME_SOLID_BUTTON_STYLE} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
            </Pressable>
        }
    >
        <ScrollView>
            <Box
                sx={{
                    alignItems: "center",
                    padding: 24,
                }}
            >
                <Image
                    style={{
                        width: 72,
                        height: 72,
                        borderRadius: 12,
                    }}
                    source={require("../assets/images/icon.png")}
                />
                <Text
                    sx={{
                        fontSize: 24,
                        lineHeight: 24 * 1.5,
                        fontWeight: "700",
                        marginTop: "$2",
                        marginBottom: "$1",
                    }}
                >
                    Bilisound
                </Text>
                <Text
                    sx={{
                        fontSize: 14,
                        lineHeight: 14 * 1.5,
                        opacity: 0.7,
                    }}
                >
                    {`版本 ${require("../package.json").version}`}
                </Text>
                <Box
                    sx={{
                        flexDirection: "row",
                    }}
                >
                    <Pressable onPress={() => Linking.openURL(BILISOUND_OFFICIAL_WEBSITE)}>
                        <Text
                            sx={{
                                marginTop: "$6",
                                color: "$accent500",
                                textDecorationLine: "underline",
                            }}
                        >
                            访问官网
                        </Text>
                    </Pressable>
                </Box>
            </Box>
        </ScrollView>
    </CommonFrameNew>
);

export default History;
