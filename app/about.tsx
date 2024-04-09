import { Box, Text, Pressable } from "@gluestack-ui/themed";
import { Image } from "expo-image";
import React from "react";
import { Linking, ScrollView } from "react-native";

import CommonLayout from "../components/CommonLayout";
import { BILISOUND_OFFICIAL_WEBSITE } from "../constants/branding";

const History: React.FC = () => (
    <CommonLayout title="关于" extendToBottom leftAccessories="backButton">
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
    </CommonLayout>
);

export default History;
