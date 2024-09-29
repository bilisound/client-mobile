import { MaterialIcons } from "@expo/vector-icons";
import React from "react";

import CommonLayout from "~/components/CommonLayout";
import SettingMenuItem from "~/components/SettingMenuItem";
import { createIcon } from "~/components/potato-ui/utils/icon";
import { Switch } from "~/components/ui/switch";
import useFeaturesStore from "~/store/features";

const DeleteIcon = createIcon(MaterialIcons, "delete");

export default function Page() {
    const { enableNavbar2, setEnableNavbar2 } = useFeaturesStore(state => ({
        enableNavbar2: state.enableNavbar2,
        setEnableNavbar2: state.setEnableNavbar2,
    }));

    return (
        <CommonLayout titleBarTheme="solid" title="实验功能" leftAccessories="backButton">
            <SettingMenuItem
                icon={DeleteIcon}
                title="使用新版底部导航栏"
                rightAccessories={
                    <Switch
                        value={enableNavbar2}
                        onChange={() => {
                            setEnableNavbar2(!enableNavbar2);
                        }}
                    />
                }
                onPress={() => setEnableNavbar2(!enableNavbar2)}
            />
        </CommonLayout>
    );
}
