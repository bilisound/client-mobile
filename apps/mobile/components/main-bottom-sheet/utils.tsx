import { createContext } from "react";
import { TrackData } from "@bilisound/player/build/types";
import { PLACEHOLDER_AUDIO } from "~/constants/playback";

export const InsidePageContext = createContext(false);

export function isLoading(activeTrack: TrackData | null | undefined, duration: number) {
    return activeTrack?.uri === PLACEHOLDER_AUDIO || duration <= 0;
}
