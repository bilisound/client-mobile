import { Entypo } from "@expo/vector-icons";
import { useState } from "react";
import { View, Text, Switch } from "react-native";

import Button from "~/components/ui/Button";
import { createIcon } from "~/components/ui/utils/icon";

const LinkIcon = createIcon(Entypo, "link");

export default function Page() {
    const [disabled, setDisabled] = useState(true);

    return (
        <View style={{ padding: 16, gap: 16 }}>
            <Text>Hello World!</Text>
            <Switch value={disabled} onValueChange={setDisabled} />
            <View style={{ flexDirection: "row", gap: 8 }}>
                <Button disabled={disabled} />
                <Button disabled={disabled} variant="outline" />
                <Button disabled={disabled} variant="ghost" />
            </View>
            <View style={{ flexDirection: "row", gap: 8 }}>
                <Button disabled={disabled} rounded />
                <Button disabled={disabled} rounded variant="outline" />
                <Button disabled={disabled} rounded variant="ghost" />
            </View>
            <View style={{ flexDirection: "row", gap: 8 }}>
                <Button disabled={disabled} color="red" rounded />
                <Button disabled={disabled} color="red" rounded variant="outline" />
                <Button disabled={disabled} color="red" rounded variant="ghost" />
            </View>
            <View style={{ flexDirection: "row", gap: 8 }}>
                <Button disabled={disabled} color="blue" rounded Icon={LinkIcon} />
                <Button disabled={disabled} color="blue" rounded Icon={LinkIcon} variant="outline" />
                <Button disabled={disabled} color="blue" rounded Icon={LinkIcon} variant="ghost" />
            </View>
            <Button disabled={disabled} color="blue" rounded Icon={LinkIcon} />
        </View>
    );
}
