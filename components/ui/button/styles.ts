import { tva } from "@gluestack-ui/nativewind-utils/tva";

export const buttonStyle = tva({
    base: "group/button rounded-lg bg-primary-500 flex-row items-center justify-center data-[focus-visible=true]:web:outline-none data-[focus-visible=true]:web:ring-2 data-[disabled=true]:opacity-40 gap-2",
    variants: {
        action: {
            primary:
                "bg-primary-500 data-[hover=true]:bg-primary-600 data-[active=true]:bg-primary-700 border-primary-300 data-[hover=true]:border-primary-400 data-[active=true]:border-primary-500 data-[focus-visible=true]:web:ring-indicator-info",
            secondary:
                "bg-secondary-500 border-secondary-300 data-[hover=true]:bg-secondary-600 data-[hover=true]:border-secondary-400 data-[active=true]:bg-secondary-700 data-[active=true]:border-secondary-700 data-[focus-visible=true]:web:ring-indicator-info",
            positive:
                "bg-success-500 border-success-300 data-[hover=true]:bg-success-600 data-[hover=true]:border-success-400 data-[active=true]:bg-success-700 data-[active=true]:border-success-500 data-[focus-visible=true]:web:ring-indicator-info",
            negative:
                "bg-error-500 border-error-300 data-[hover=true]:bg-error-600 data-[hover=true]:border-error-400 data-[active=true]:bg-error-700 data-[active=true]:border-error-500 data-[focus-visible=true]:web:ring-indicator-info",
            default: "bg-transparent data-[hover=true]:bg-background-50 data-[active=true]:bg-transparent",
        },
        variant: {
            link: "px-0",
            outline: "bg-transparent border data-[hover=true]:bg-background-50 data-[active=true]:bg-transparent",
            solid: "",
            ghost: "bg-transparent data-[hover=true]:bg-background-50 data-[active=true]:bg-transparent",
        },
        size: {
            xs: "px-3.5 h-8",
            sm: "px-4 h-9",
            md: "px-5 h-10",
            lg: "px-6 h-11",
            xl: "px-7 h-12",
        },
        icon: {
            false: "",
            true: "px-0",
        },
    },
    compoundVariants: [
        {
            size: "xs",
            icon: true,
            class: "w-8",
        },
        {
            size: "sm",
            icon: true,
            class: "w-9",
        },
        {
            size: "md",
            icon: true,
            class: "w-10",
        },
        {
            size: "lg",
            icon: true,
            class: "w-11",
        },
        {
            size: "xl",
            icon: true,
            class: "w-12",
        },
        {
            action: "primary",
            variant: "link",
            class: "px-0 bg-transparent data-[hover=true]:bg-transparent data-[active=true]:bg-transparent",
        },
        {
            action: "secondary",
            variant: "link",
            class: "px-0 bg-transparent data-[hover=true]:bg-transparent data-[active=true]:bg-transparent",
        },
        {
            action: "positive",
            variant: "link",
            class: "px-0 bg-transparent data-[hover=true]:bg-transparent data-[active=true]:bg-transparent",
        },
        {
            action: "negative",
            variant: "link",
            class: "px-0 bg-transparent data-[hover=true]:bg-transparent data-[active=true]:bg-transparent",
        },
        {
            action: "primary",
            variant: "outline",
            class: "bg-transparent data-[hover=true]:bg-background-50 data-[active=true]:bg-transparent",
        },
        {
            action: "secondary",
            variant: "outline",
            class: "bg-transparent data-[hover=true]:bg-background-50 data-[active=true]:bg-transparent",
        },
        {
            action: "positive",
            variant: "outline",
            class: "bg-transparent data-[hover=true]:bg-background-50 data-[active=true]:bg-transparent",
        },
        {
            action: "negative",
            variant: "outline",
            class: "bg-transparent data-[hover=true]:bg-background-50 data-[active=true]:bg-transparent",
        },
        {
            action: "primary",
            variant: "ghost",
            class: "bg-transparent data-[hover=true]:bg-background-50 data-[active=true]:bg-background-100",
        },
        {
            action: "secondary",
            variant: "ghost",
            class: "bg-transparent data-[hover=true]:bg-background-50 data-[active=true]:bg-background-100",
        },
        {
            action: "positive",
            variant: "ghost",
            class: "bg-transparent data-[hover=true]:bg-background-50 data-[active=true]:bg-background-100",
        },
        {
            action: "negative",
            variant: "ghost",
            class: "bg-transparent data-[hover=true]:bg-background-50 data-[active=true]:bg-background-100",
        },
    ],
});

export const buttonTextStyle = tva({
    base: "text-typography-0 font-semibold web:select-none",
    parentVariants: {
        action: {
            primary: "text-primary-600 data-[hover=true]:text-primary-600 data-[active=true]:text-primary-700",
            secondary:
                "text-typography-500 data-[hover=true]:text-typography-600 data-[active=true]:text-typography-700",
            positive: "text-success-600 data-[hover=true]:text-success-600 data-[active=true]:text-success-700",
            negative: "text-error-600 data-[hover=true]:text-error-600 data-[active=true]:text-error-700",
        },
        variant: {
            link: "data-[hover=true]:underline data-[active=true]:underline",
            outline: "",
            solid: "text-typography-0 data-[hover=true]:text-typography-0 data-[active=true]:text-typography-0",
        },
        size: {
            xs: "text-xs",
            sm: "text-xs",
            md: "text-sm",
            lg: "text-base",
            xl: "text-lg",
        },
    },
    parentCompoundVariants: [
        {
            variant: "solid",
            action: "primary",
            class: "text-typography-0 data-[hover=true]:text-typography-0 data-[active=true]:text-typography-0",
        },
        {
            variant: "solid",
            action: "secondary",
            class: "text-typography-800 data-[hover=true]:text-typography-800 data-[active=true]:text-typography-800",
        },
        {
            variant: "solid",
            action: "positive",
            class: "text-typography-0 data-[hover=true]:text-typography-0 data-[active=true]:text-typography-0",
        },
        {
            variant: "solid",
            action: "negative",
            class: "text-typography-0 data-[hover=true]:text-typography-0 data-[active=true]:text-typography-0",
        },
        {
            variant: "outline",
            action: "primary",
            class: "text-primary-500 data-[hover=true]:text-primary-500 data-[active=true]:text-primary-500",
        },
        {
            variant: "outline",
            action: "secondary",
            class: "text-typography-500 data-[hover=true]:text-primary-600 data-[active=true]:text-typography-700",
        },
        {
            variant: "outline",
            action: "positive",
            class: "text-primary-500 data-[hover=true]:text-primary-500 data-[active=true]:text-primary-500",
        },
        {
            variant: "outline",
            action: "negative",
            class: "text-primary-500 data-[hover=true]:text-primary-500 data-[active=true]:text-primary-500",
        },
        {
            variant: "ghost",
            action: "primary",
            class: "text-primary-500 data-[hover=true]:text-primary-500 data-[active=true]:text-primary-500",
        },
        {
            variant: "ghost",
            action: "secondary",
            class: "text-typography-500 data-[hover=true]:text-primary-600 data-[active=true]:text-typography-700",
        },
        {
            variant: "ghost",
            action: "positive",
            class: "text-primary-500 data-[hover=true]:text-primary-500 data-[active=true]:text-primary-500",
        },
        {
            variant: "ghost",
            action: "negative",
            class: "text-primary-500 data-[hover=true]:text-primary-500 data-[active=true]:text-primary-500",
        },
    ],
});

export const buttonIconStyle = tva({
    base: "fill-none flex flex-0 items-center justify-center",
    parentVariants: {
        variant: {
            link: "data-[hover=true]:underline data-[active=true]:underline",
            outline: "",
            solid: "text-typography-0 data-[hover=true]:text-typography-0 data-[active=true]:text-typography-0",
        },
        size: {
            xs: "h-3.5 w-3.5 !text-[14px]",
            sm: "h-4 w-4 !text-[16px]",
            md: "h-[18px] w-[18px] !text-[18px]",
            lg: "h-[18px] w-[18px] !text-[18px]",
            xl: "h-5 w-5 !text-[20px]",
        },
        action: {
            primary: "text-primary-600 data-[hover=true]:text-primary-600 data-[active=true]:text-primary-700",
            secondary: "text-secondary-600 data-[hover=true]:text-secondary-600 data-[active=true]:text-secondary-700",
            positive: "text-success-600 data-[hover=true]:text-success-600 data-[active=true]:text-success-700",
            negative: "text-error-600 data-[hover=true]:text-error-600 data-[active=true]:text-error-700",
        },
    },
    parentCompoundVariants: [
        {
            variant: "solid",
            action: "primary",
            class: "text-typography-0 data-[hover=true]:text-typography-0 data-[active=true]:text-typography-0",
        },
        {
            variant: "solid",
            action: "secondary",
            class: "text-typography-0 data-[hover=true]:text-typography-0 data-[active=true]:text-typography-0",
        },
        {
            variant: "solid",
            action: "positive",
            class: "text-typography-0 data-[hover=true]:text-typography-0 data-[active=true]:text-typography-0",
        },
        {
            variant: "solid",
            action: "negative",
            class: "text-typography-0 data-[hover=true]:text-typography-0 data-[active=true]:text-typography-0",
        },
    ],
});

export const buttonGroupStyle = tva({
    base: "",
    variants: {
        space: {
            xs: "gap-1",
            sm: "gap-2",
            md: "gap-3",
            lg: "gap-4",
            xl: "gap-5",
            "2xl": "gap-6",
            "3xl": "gap-7",
            "4xl": "gap-8",
        },
        isAttached: {
            true: "gap-0",
        },
        flexDirection: {
            row: "flex-row",
            column: "flex-col",
            "row-reverse": "flex-row-reverse",
            "column-reverse": "flex-col-reverse",
        },
    },
});

export const buttonMonIconStyle = tva({
    base: "items-center justify-center",
});

export const buttonMonIconInternalStyle = tva({
    base: "",
    parentVariants: {
        variant: {
            link: "",
            outline: "",
            solid: "text-typography-0",
        },
        action: {
            primary: "text-primary-600 data-[hover=true]:text-primary-600 data-[active=true]:text-primary-700",
            secondary: "text-secondary-600 data-[hover=true]:text-secondary-600 data-[active=true]:text-secondary-700",
            positive: "text-success-600 data-[hover=true]:text-success-600 data-[active=true]:text-success-700",
            negative: "text-error-600 data-[hover=true]:text-error-600 data-[active=true]:text-error-700",
        },
    },
    parentCompoundVariants: [
        {
            variant: "solid",
            action: "primary",
            class: "text-typography-0 data-[hover=true]:text-typography-0 data-[active=true]:text-typography-0",
        },
        {
            variant: "solid",
            action: "secondary",
            class: "text-typography-0 data-[hover=true]:text-typography-0 data-[active=true]:text-typography-0",
        },
        {
            variant: "solid",
            action: "positive",
            class: "text-typography-0 data-[hover=true]:text-typography-0 data-[active=true]:text-typography-0",
        },
        {
            variant: "solid",
            action: "negative",
            class: "text-typography-0 data-[hover=true]:text-typography-0 data-[active=true]:text-typography-0",
        },
    ],
});
