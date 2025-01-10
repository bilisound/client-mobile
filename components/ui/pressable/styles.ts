import { tva } from "@gluestack-ui/nativewind-utils/tva";

export const pressableStyle = tva({
    base: "bg-transparent data-[hover=true]:bg-background-50 data-[active=true]:bg-background-100 data-[focus-visible=true]:outline-none data-[focus-visible=true]:ring-indicator-info data-[focus-visible=true]:ring-2 data-[disabled=true]:opacity-40",
});
