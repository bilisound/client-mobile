import { useToken } from "@gluestack-ui/themed";
import { useColorScheme } from "react-native";

const useCommonColors = () => {
    const colorScheme = useColorScheme();

    const primaryColor = useToken("colors", "primary500");
    const accentColor = useToken("colors", "accent500");

    const textBasicColorLight = useToken("colors", "text700");
    const textBasicColorDark = useToken("colors", "text200");
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
