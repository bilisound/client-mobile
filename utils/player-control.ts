import TrackPlayer, { Event, State } from "react-native-track-player";
import { getPlaybackState, getProgress } from "react-native-track-player/lib/trackPlayer";

export async function handleTogglePlay() {
    if ((await TrackPlayer.getPlaybackState()).state === State.Playing) {
        await TrackPlayer.pause();
    } else {
        if ((await TrackPlayer.getPlaybackState()).state === State.Ended) {
            await TrackPlayer.seekTo(0);
        }
        await TrackPlayer.play();
    }
}

export async function handlePrev() {
    if ((await getProgress()).position > 5 && (await getPlaybackState()).state === State.Playing) {
        await TrackPlayer.seekTo(0);
        return;
    }
    await TrackPlayer.skipToPrevious();
}

export async function handleNext() {}

export function initPlaybackService() {
    TrackPlayer.registerPlaybackService(() => async () => {
        // This service needs to be registered for the module to work
        // but it will be used later in the "Receiving Events" section
        TrackPlayer.addEventListener(Event.RemotePlay, () => {
            TrackPlayer.play();
        });
        TrackPlayer.addEventListener(Event.RemotePause, () => {
            TrackPlayer.pause();
        });
        TrackPlayer.addEventListener(Event.RemotePrevious, () => {
            handlePrev();
        });
        TrackPlayer.addEventListener(Event.RemoteNext, () => {
            TrackPlayer.skipToNext();
        });
        TrackPlayer.addEventListener(Event.RemoteSeek, (event) => {
            TrackPlayer.seekTo(event.position);
        });
    });
}
