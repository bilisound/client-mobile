import { ToastConfig } from "react-native-toast-message/lib/src/types";

import PotatoToast from "~/components/potato-ui/PotatoToast";

export const toastConfig: ToastConfig = {
    success: ({ text1, text2 }) => <PotatoToast type="success" title={text1 ?? ""} description={text2} />,
    info: ({ text1, text2 }) => <PotatoToast type="info" title={text1 ?? ""} description={text2} />,
    warning: ({ text1, text2 }) => <PotatoToast type="warning" title={text1 ?? ""} description={text2} />,
    error: ({ text1, text2 }) => <PotatoToast type="error" title={text1 ?? ""} description={text2} />,
};
