import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import Toast from "react-native-toast-message";
import TrackPlayer from "react-native-track-player";
import { v4 } from "uuid";

import CommonLayout from "~/components/CommonLayout";
import { Box } from "~/components/ui/box";
import { Button, ButtonText } from "~/components/ui/button";
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
import { addToPlaylist, getNewColor, PlaylistMeta, syncPlaylistAmount, usePlaylistStorage } from "~/storage/playlist";
import log from "~/utils/logger";
import { tracksToPlaylist } from "~/utils/track-data";

const MAGIC_ID_NEW_ENTRY = "new";

export default function Page() {
    // const toast = useToast();
    // const containerStyle = useToastContainerStyle();
    const { id } = useLocalSearchParams<{ id: string }>();
    const [list = [], setList] = usePlaylistStorage();
    const defaultValues = list.find(e => e.id === id) ?? { id: "", title: "", color: "", amount: 0 };
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<PlaylistMeta>({
        defaultValues,
    });

    async function onSubmit(value: PlaylistMeta) {
        const isCreate = !value.id;
        const createFromQueue = !!value.createFromQueue;
        delete value.createFromQueue;

        if (isCreate) {
            value.id = v4();
            value.color = getNewColor();
            log.info("用户创建新的歌单");
        } else {
            log.info("用户编辑已有歌单");
        }
        log.debug(`歌单详情：${JSON.stringify(value)}`);

        setList((prevValue = []) => {
            const newList = prevValue.concat();
            if (isCreate) {
                newList.push(value);
            } else {
                const target = newList.findIndex(e => e.id === id);
                newList[target] = value;
            }
            return newList;
        });

        if (createFromQueue) {
            const fromTracks = tracksToPlaylist(await TrackPlayer.getQueue());
            addToPlaylist(value.id, fromTracks);
            syncPlaylistAmount(value.id);
        }

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
                        <FormControlLabelText className="text-sm">名称</FormControlLabelText>
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

                {id === MAGIC_ID_NEW_ENTRY && (
                    <FormControl>
                        <Controller
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <Checkbox
                                    onChange={onChange}
                                    isChecked={value}
                                    value={String(value)}
                                    aria-label="从当前队列创建歌单"
                                >
                                    <CheckboxIndicator className="mr-2">
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
                <Button
                    size="md"
                    variant="solid"
                    action="primary"
                    onPress={handleSubmit(onSubmit)}
                    isDisabled={!!errors.title}
                    className="bg-primary-600"
                >
                    <ButtonText className="font-medium text-sm">保存</ButtonText>
                </Button>
            </Box>
        </CommonLayout>
    );
}
