import { ReleaseChannel } from "~/constants/release-channel";

declare module "react-native-get-random-values" {}

declare module "react-native-url-polyfill/auto" {}

declare module "core-js/actual/array/to-spliced" {}

declare const process: {
    env: {
        NODE_ENV: string;
        EXPO_PUBLIC_API_URL: string;
        EXPO_PUBLIC_RELEASE_CHANNEL: ReleaseChannel;
    };
};
