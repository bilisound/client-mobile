import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import omit from "lodash/omit";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import Toast from "react-native-toast-message";
import TrackPlayer from "react-native-track-player";

import CommonLayout from "~/components/CommonLayout";
import PotatoButton from "~/components/potato-ui/PotatoButton";
import { Box } from "~/components/ui/box";
import { Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from "~/components/ui/checkbox";
import {
    FormControl,
    FormControlError,
    FormControlErrorIcon,
    FormControlErrorText,
    FormControlLabel,
    FormControlLabelText,
} from "~/components/ui/form-control";
import { AlertCircleIcon, CheckIcon } from "~/components/ui/icon";
import { Input, InputField } from "~/components/ui/input";
import { Textarea, TextareaInput } from "~/components/ui/textarea";
import {
    addToPlaylist,
    getPlaylistMeta,
    insertPlaylistMeta,
    setPlaylistMeta,
    syncPlaylistAmount,
} from "~/storage/sqlite/playlist";
import { PlaylistMeta } from "~/storage/sqlite/schema";
import log from "~/utils/logger";
import { tracksToPlaylist } from "~/utils/track-data";

const MAGIC_ID_NEW_ENTRY = "new";

type PlaylistMetaFrom = PlaylistMeta & { createFromQueue: boolean };

export default function Page() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const queryClient = useQueryClient();
    const { data } = useQuery({
        queryKey: [`playlist_meta_${id}`],
        queryFn: () => getPlaylistMeta(Number(id)),
    });
    const defaultValues = data?.[0]
        ? data[0]
        : {
              title: "",
              color:
                  "#" +
                  Math.floor(Math.random() * 16777216)
                      .toString(16)
                      .padStart(6, "0"),
              amount: 0,
          };
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<PlaylistMetaFrom>({
        defaultValues,
    });

    async function onSubmit(value: PlaylistMetaFrom) {
        const isCreate = !value.id;
        let id = value.id;

        if (isCreate) {
            log.info("用户创建新的歌单");
            const result = await insertPlaylistMeta(omit(value, "createFromQueue"));
            id = result.lastInsertRowId;
        } else {
            log.info("用户编辑已有歌单");
            await setPlaylistMeta(omit(value, "createFromQueue"));
        }
        log.debug(`歌单详情：${JSON.stringify(value)}, id: ${id}`);

        if (value.createFromQueue) {
            const fromTracks = tracksToPlaylist(await TrackPlayer.getQueue()).map(
                ({ title, imgUrl, duration, episode, bvid, author }) => ({
                    title,
                    imgUrl,
                    duration,
                    episode,
                    bvid,
                    author,
                    playlistId: id,
                }),
            );
            await addToPlaylist(id, fromTracks);
            await syncPlaylistAmount(id);
        }
        await queryClient.invalidateQueries({ queryKey: ["playlist_meta"] });
        await queryClient.invalidateQueries({ queryKey: [`playlist_meta_${id}`] });

        if (isCreate) {
            Toast.show({
                type: "success",
                text1: "歌单创建成功",
                text2: "新歌单的名称：" + value.title,
            });
        } else {
            Toast.show({
                type: "success",
                text1: "歌单修改成功",
            });
        }
        router.back();
    }

    return (
        <CommonLayout title={id === MAGIC_ID_NEW_ENTRY ? "创建歌单" : "修改歌单信息"} titleBarTheme="transparent">
            <Box className="p-4 gap-4">
                <FormControl isRequired isInvalid={"title" in errors}>
                    <FormControlLabel>
                        <FormControlLabelText className="text-sm">歌单名称</FormControlLabelText>
                    </FormControlLabel>
                    <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input>
                                <InputField
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    placeholder="请输入名称"
                                    className="text-sm"
                                />
                            </Input>
                        )}
                        name="title"
                        rules={{ required: "请输入名称" }}
                    />
                    <FormControlError>
                        <FormControlErrorIcon as={AlertCircleIcon} />
                        <FormControlErrorText size="sm">{errors.title?.message}</FormControlErrorText>
                    </FormControlError>
                </FormControl>

                <FormControl isInvalid={"description" in errors}>
                    <FormControlLabel>
                        <FormControlLabelText className="text-sm">备注</FormControlLabelText>
                    </FormControlLabel>
                    <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Textarea
                                size="md"
                                isReadOnly={false}
                                isInvalid={false}
                                isDisabled={false}
                                className="h-64"
                            >
                                {/* todo 解决文本垂直居中的问题 */}
                                <TextareaInput
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value ?? ""}
                                    placeholder="可以在这里设置歌单的备注"
                                    className="text-sm"
                                />
                            </Textarea>
                        )}
                        name="description"
                    />
                    <FormControlError>
                        <FormControlErrorIcon as={AlertCircleIcon} />
                        <FormControlErrorText size="sm">{errors.title?.message}</FormControlErrorText>
                    </FormControlError>
                </FormControl>

                {id === MAGIC_ID_NEW_ENTRY && (
                    <FormControl>
                        <Controller
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <Checkbox
                                    onChange={onChange}
                                    isChecked={!!value}
                                    value={String(value)}
                                    aria-label="从当前队列创建歌单"
                                >
                                    <CheckboxIndicator>
                                        <CheckboxIcon as={CheckIcon} />
                                    </CheckboxIndicator>
                                    <CheckboxLabel className="text-sm">从当前队列创建歌单</CheckboxLabel>
                                </Checkbox>
                            )}
                            name="createFromQueue"
                            defaultValue={false}
                        />
                    </FormControl>
                )}
                <PotatoButton
                    variant="solid"
                    color="primary"
                    onPress={handleSubmit(onSubmit)}
                    disabled={!!errors.title}
                >
                    保存
                </PotatoButton>
            </Box>
        </CommonLayout>
    );
}
