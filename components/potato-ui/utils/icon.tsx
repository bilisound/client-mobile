import { Icon } from "@expo/vector-icons/build/createIconSet";
import React, { ComponentProps } from "react";

export function createIcon<G extends string, FN extends string>(IconComponent: Icon<G, FN>, name: G) {
    return (iconProps: Omit<ComponentProps<typeof IconComponent>, "name">): React.ReactElement => {
        return <IconComponent {...iconProps} name={name} />;
    };
}

export type IconComponent = ReturnType<typeof createIcon<any, any>>;
