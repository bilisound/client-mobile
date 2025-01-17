import { ScrollView, View } from "react-native";
import { Layout } from "~/components/layout";
import { VERSION } from "~/constants/releasing";
import React from "react";

import { Text } from "~/components/ui/text";
import { Image } from "expo-image";

export default function Page() {
    return (
        <Layout title={"关于"} leftAccessories={"BACK_BUTTON"}>
            <ScrollView>
                <View className="items-center p-6">
                    <Image
                        className="w-[4.5rem] h-[4.5rem] rounded-xl"
                        source={require("../../assets/images/icon.png")}
                    />
                    <Text className="text-2xl leading-normal font-semibold mt-2 mb-1">Bilisound</Text>
                    <Text className="text-sm leading-normal opacity-50">{`版本 ${VERSION}`}</Text>
                </View>
            </ScrollView>
        </Layout>
    );
}
