import { ToastConfig } from "react-native-toast-message/lib/src/types";

import Toast from "~/components/potato-ui/Toast";

export const toastConfig: ToastConfig = {
    success: ({ text1, text2 }) => <Toast type="success" title={text1 ?? ""} description={text2} />,
    info: ({ text1, text2 }) => <Toast type="info" title={text1 ?? ""} description={text2} />,
    warning: ({ text1, text2 }) => <Toast type="warning" title={text1 ?? ""} description={text2} />,
    error: ({ text1, text2 }) => <Toast type="error" title={text1 ?? ""} description={text2} />,
};
