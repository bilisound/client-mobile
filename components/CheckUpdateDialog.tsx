import React from "react";
import { Text } from "react-native";

import PotatoButton from "~/components/potato-ui/PotatoButton";
import {
    AlertDialog,
    AlertDialogBackdrop,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
} from "~/components/ui/alert-dialog";
import { Heading } from "~/components/ui/heading";
import { CheckLatestVersionReturns } from "~/utils/check-release";

export interface CheckUpdateDialogProps {
    open: boolean;
    onClose: (positive: boolean) => void;
    result?: CheckLatestVersionReturns;
}

export default function CheckUpdateDialog({ open, onClose, result }: CheckUpdateDialogProps) {
    return (
        <AlertDialog isOpen={open} onClose={() => onClose(false)} size="md">
            <AlertDialogBackdrop />
            <AlertDialogContent>
                <AlertDialogHeader>
                    <Heading className="text-typography-950 font-semibold" size="lg">
                        发现新版本！
                    </Heading>
                </AlertDialogHeader>
                <AlertDialogBody className="mt-4 mb-6">
                    <Text className="leading-normal">
                        {`Bilisound ${result?.latestVersion} 现已发布，而您当前正在使用 ${result?.currentVersion}。${
                            result?.extraInfo ? `\n\n${result?.extraInfo}\n` : ""
                        }\n想要前往最新版本下载页面吗？`}
                    </Text>
                </AlertDialogBody>
                <AlertDialogFooter className="gap-2">
                    <PotatoButton variant="ghost" onPress={() => onClose(false)}>
                        取消
                    </PotatoButton>
                    <PotatoButton onPress={() => onClose(true)}>确定</PotatoButton>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
