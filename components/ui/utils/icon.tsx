import { Icon, IconProps } from "@expo/vector-icons/build/createIconSet";
import React from "react";

export function createIcon<G extends string, FN extends string>(IconComponent: Icon<G, FN>, name: G) {
    return (iconProps: Partial<IconProps<any>>) => {
        return <IconComponent name={name} {...iconProps} />;
    };
}
