import { useColorScheme } from "react-native";

/**
 * @deprecated 请直接调用 unistyles 主题系统的颜色
 */
const useCommonColors = () => {
    const colorScheme = useColorScheme();

    const primaryColor = "#00ba9d";
    const accentColor = "#09a5ee";

    const textBasicColorLight = "#525252";
    const textBasicColorDark = "#DBDBDB";
    const textBasicColor = colorScheme === "dark" ? textBasicColorDark : textBasicColorLight;

    const bgColor = colorScheme === "dark" ? "#171717" : "#ffffff";

    return {
        primaryColor,
        accentColor,
        textBasicColor,
        bgColor,
    };
};

export default useCommonColors;
