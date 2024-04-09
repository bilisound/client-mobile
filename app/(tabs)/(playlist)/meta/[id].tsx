import {
    Box,
    Button,
    ButtonText,
    FormControl,
    FormControlLabel,
    FormControlLabelText,
    Input,
    InputField,
    Toast,
    ToastDescription,
    ToastTitle,
    useToast,
    VStack,
} from "@gluestack-ui/themed";
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { v4 } from "uuid";

import CommonLayout from "../../../../components/CommonLayout";
import { PlaylistMeta, usePlaylistStorage } from "../../../../storage/playlist";
import log from "../../../../utils/logger";

const MAGIC_ID_NEW_ENTRY = "new";

export default function Page() {
    const toast = useToast();
    const { top } = useSafeAreaInsets();
    const { id } = useLocalSearchParams<{ id: string }>();
    const [list, setList] = usePlaylistStorage();
    const initialValues = list.find(e => e.id === id) ?? { id: "", title: "", color: "", amount: 0 };

    function handleSubmit(value: PlaylistMeta) {
        value.id = v4();
        value.color = `hsl(${Math.random() * 360}, 80%, 50%)`;
        log.info("用户创建新的歌单");
        log.debug(`歌单详情：${JSON.stringify(value)}`);
        setList(prevValue => {
            const newList = prevValue.concat();
            newList.push(value);
            return newList;
        });
        toast.show({
            placement: "top",
            // https://github.com/gluestack/gluestack-ui/issues/1334 的 workaround
            containerStyle: {
                top,
            },
            render: ({ id }) => (
                <Toast nativeID={`toast-${id}`} action="success" variant="accent">
                    <VStack space="xs">
                        <ToastTitle>歌单创建成功</ToastTitle>
                        <ToastDescription>{"新歌单的名称：" + value.title}</ToastDescription>
                    </VStack>
                </Toast>
            ),
        });
        router.back();
    }

    return (
        <CommonLayout title={id === MAGIC_ID_NEW_ENTRY ? "创建歌单" : "修改歌单信息"} titleBarTheme="transparent">
            <Formik<PlaylistMeta> enableReinitialize initialValues={initialValues} onSubmit={handleSubmit}>
                {({ handleChange, handleBlur, handleSubmit, values }) => (
                    <Box gap="$4" px="$4" py="$2">
                        <FormControl>
                            <FormControlLabel>
                                <FormControlLabelText fontSize="$sm">名称</FormControlLabelText>
                            </FormControlLabel>
                            <Input>
                                <InputField
                                    onChangeText={handleChange("title")}
                                    onBlur={handleBlur("title")}
                                    value={values.title}
                                    fontSize="$sm"
                                    placeholder="请输入播放列表的名称"
                                />
                            </Input>
                        </FormControl>
                        {/*<FormControl>
                            <FormControlLabel>
                                <FormControlLabelText fontSize="$sm">标签色</FormControlLabelText>
                            </FormControlLabel>
                            <Text>Placeholder</Text>
                        </FormControl>*/}
                        <FormControl>
                            <Button
                                bg="$primary600"
                                size="md"
                                variant="solid"
                                action="primary"
                                onPress={() => handleSubmit()}
                            >
                                <ButtonText fontWeight="$medium" fontSize="$sm">
                                    保存
                                </ButtonText>
                            </Button>
                        </FormControl>
                    </Box>
                )}
            </Formik>
        </CommonLayout>
    );
}