import { styled } from "@gluestack-style/react";
import { createImage } from "@gluestack-ui/image";
import { Image as RNImage } from "react-native";

const StyledRoot = styled(
    RNImage,
    {
        maxWidth: "$full",
        variants: {
            size: {
                "2xs": {
                    w: "$6",
                    h: "$6",
                },

                xs: {
                    w: "$10",
                    h: "$10",
                },

                sm: {
                    w: "$16",
                    h: "$16",
                },

                md: {
                    w: "$20",
                    h: "$20",
                },

                lg: {
                    w: "$24",
                    h: "$24",
                },

                xl: {
                    w: "$32",
                    h: "$32",
                },

                "2xl": {
                    w: "$64",
                    h: "$64",
                },
                full: {
                    w: "$full",
                    h: "$full",
                },
            },
        },
        defaultProps: {
            size: "md",
        },
    },
    {},
);
export const Image = createImage({ Root: StyledRoot });
