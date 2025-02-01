import React from "react";

import {
    AlertDialog,
    AlertDialogBackdrop,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
} from "~/components/ui/alert-dialog";
import { Heading } from "~/components/ui/heading";
import { Text } from "~/components/ui/text";
import { CheckLatestVersionReturns } from "~/business/check-release";
import { Button, ButtonOuter, ButtonText } from "~/components/ui/button";

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
                    <ButtonText>
                        <Button variant="ghost" onPress={() => onClose(false)}>
                            <ButtonText>取消</ButtonText>
                        </Button>
                    </ButtonText>
                    <ButtonOuter>
                        <Button onPress={() => onClose(true)}>
                            <ButtonText>确定</ButtonText>
                        </Button>
                    </ButtonOuter>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
