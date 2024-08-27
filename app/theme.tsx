import { Text } from "react-native";

import CommonLayout from "~/components/CommonLayout";

export default function Page() {
    return (
        <CommonLayout titleBarTheme="solid" title="主题选择" leftAccessories="backButton">
            <Text>主题选择页面……</Text>
        </CommonLayout>
    );
}
