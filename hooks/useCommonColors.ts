import { useToken } from "@gluestack-ui/themed";
import { useColorScheme } from "react-native";

const useCommonColors = () => {
    const colorScheme = useColorScheme();

    const primaryColor = useToken("colors", "primary500");
    const accentColor = useToken("colors", "accent500");

    const textBasicColorLight = useToken("colors", "textLight700");
    const textBasicColorDark = useToken("colors", "textDark200");
    const textBasicColor = colorScheme === "dark" ? textBasicColorDark : textBasicColorLight;
    return {
        primaryColor,
        accentColor,
        textBasicColor,
    };
};

export default useCommonColors;
