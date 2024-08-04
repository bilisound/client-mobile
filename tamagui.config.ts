import { config } from "@tamagui/config/v3";
import merge from "lodash/merge";
import { createTamagui } from "tamagui";

export const tamaguiConfig = createTamagui(
    merge(config, {
        themes: {
            light: {
                // 新增的颜色
                brand: "#00ba9d",
                success: "#4CAF50",
                warning: "#FFC107",
                error: "#F44336",
            },
            dark: {
                // 暗色主题的颜色
                brand: "#028373",
                success: "#45a049",
                warning: "#e6ac00",
                error: "#d32f2f",
            },
        },
    }),
);
export default tamaguiConfig;

export type Conf = typeof tamaguiConfig;
declare module "tamagui" {
    interface TamaguiCustomConfig extends Conf {}
}
