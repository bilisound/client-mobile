import { router } from "expo-router";

import { resolveVideoAndJump } from "./format";

import { getTransferList } from "~/api/bilisound";
import useApplyPlaylistStore from "~/store/apply-playlist";

export async function handleQrCode(input: string) {
    switch (true) {
        case input.startsWith("bilisound:pe:"): {
            const transferList = await getTransferList(input.slice(13));
            if (!transferList.data) {
                return "这个二维码已经过期了，重新获取一下吧。";
            }
            useApplyPlaylistStore.getState().setPlaylistDetail(transferList.data);
            useApplyPlaylistStore
                .getState()
                .setName(`从 PC 端导入的播放队列 (${new Date().toLocaleString("zh-Hans-CN")})`);
            router.replace(`/apply-playlist`);
            return "";
        }
        default: {
            await resolveVideoAndJump(input);
            return "";
        }
    }
}
