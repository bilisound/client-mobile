import { Icon } from "@expo/vector-icons/build/createIconSet";
import { cssInterop } from "nativewind";
import React, { ComponentProps } from "react";

export function createIcon<G extends string, FN extends string>(IconComponent: Icon<G, FN>, name: G) {
    const IconWind = cssInterop(IconComponent, {
        className: {
            target: "style",
            nativeStyleToProp: {
                color: true,
            },
        },
    });

    return (iconProps: Omit<ComponentProps<typeof IconWind>, "name">): React.ReactElement => {
        return <IconWind {...iconProps} name={name} />;
    };
}

export type IconComponent = ReturnType<typeof createIcon<any, any>>;
