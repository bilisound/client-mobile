import {
    Ionicons,
    MaterialCommunityIcons,
    MaterialIcons,
    FontAwesome5,
    FontAwesome6,
    Feather,
    Octicons,
    Entypo,
} from "@expo/vector-icons";
import { cssInterop } from "nativewind";

cssInterop(Ionicons, {
    className: {
        target: "style",
        nativeStyleToProp: {
            color: true,
        },
    },
});
cssInterop(MaterialCommunityIcons, {
    className: {
        target: "style",
        nativeStyleToProp: {
            color: true,
        },
    },
});
cssInterop(MaterialIcons, {
    className: {
        target: "style",
        nativeStyleToProp: {
            color: true,
        },
    },
});
cssInterop(FontAwesome5, {
    className: {
        target: "style",
        nativeStyleToProp: {
            color: true,
        },
    },
});
cssInterop(FontAwesome6, {
    className: {
        target: "style",
        nativeStyleToProp: {
            color: true,
        },
    },
});
cssInterop(Feather, {
    className: {
        target: "style",
        nativeStyleToProp: {
            color: true,
        },
    },
});
cssInterop(Octicons, {
    className: {
        target: "style",
        nativeStyleToProp: {
            color: true,
        },
    },
});
cssInterop(Entypo, {
    className: {
        target: "style",
        nativeStyleToProp: {
            color: true,
        },
    },
});
