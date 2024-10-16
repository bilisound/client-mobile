import { Ionicons } from "@expo/vector-icons";
import { CameraView, Camera, PermissionStatus } from "expo-camera";
import { BarcodeScanningResult } from "expo-camera/build/Camera.types";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { StatusBar, View, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
import { Text } from "~/components/ui/text";
import { useConfirm } from "~/hooks/useConfirm";
import log from "~/utils/logger";
import { handleQrCode } from "~/utils/qrcode";

const ScannerPage: React.FC = () => {
    const [hasPermission, setHasPermission] = useState<PermissionStatus | null>(null);
    // const [scanned, setScanned] = useState(false);
    const scanned = useRef(false);
    const safeAreaInsets = useSafeAreaInsets();

    // 模态框管理
    const { dialogInfo, setDialogInfo, modalVisible, setModalVisible, handleClose, dialogCallback } = useConfirm();

    const getBarCodeScannerPermissions = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status);
    };

    const showUnsupportedWarning = (errorMessage?: string) => {
        dialogCallback.current = () => {
            router.replace("/");
        };
        setDialogInfo(e => ({
            ...e,
            title: "扫描失败",
            description: errorMessage ?? "Bilisound 无法识别此二维码中的信息，请尝试使用其它的 APP 扫描。",
        }));
        setModalVisible(true);
    };

    useEffect(() => {
        log.info("用户执行扫码操作");
        getBarCodeScannerPermissions();
    }, []);

    const handleBarCodeScanned = async (args: BarcodeScanningResult) => {
        if (scanned.current) {
            return;
        }
        scanned.current = true;
        log.debug(`捕捉到了条形码。type: ${args.type}, data: ${args.data}`);
        // alert(`Bar code with type ${args.type} and data ${args.data} has been scanned!`);
        try {
            const errorMessage = await handleQrCode(args.data);
            if (errorMessage) {
                showUnsupportedWarning(errorMessage);
                log.debug(`扫码操作失败，原因：${errorMessage}`);
            } else {
                log.debug("扫码操作成功");
            }
        } catch (e) {
            log.error(`扫码操作失败，原因：${e}`);
            showUnsupportedWarning();
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" showHideTransition="none" />
            <View style={[styles.header, { height: safeAreaInsets.top + 64, paddingTop: safeAreaInsets.top }]}>
                <Pressable
                    onPress={() => {
                        router.back();
                    }}
                    style={[styles.backButton, { top: 8 + safeAreaInsets.top }]}
                >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </Pressable>
                <Text style={styles.headerText}>扫描二维码</Text>
            </View>
            {(() => {
                if (hasPermission === null || hasPermission === "undetermined") {
                    return <View style={styles.centeredContainer} />;
                }
                if (hasPermission === "denied") {
                    return (
                        <View style={styles.centeredContainer}>
                            <Text style={styles.permissionText}>扫码功能需要摄像头权限喵</Text>
                            <PotatoButton onPress={() => getBarCodeScannerPermissions()}>给予权限</PotatoButton>
                        </View>
                    );
                }
                return (
                    <CameraView
                        onBarcodeScanned={handleBarCodeScanned}
                        barcodeScannerSettings={{
                            barcodeTypes: ["qr"],
                        }}
                        style={styles.cameraView}
                    />
                );
            })()}

            {/* 对话框 */}
            <AlertDialog isOpen={modalVisible} onClose={() => handleClose(true)} size="md">
                <AlertDialogBackdrop />
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <Heading className="text-typography-950 font-semibold" size="lg">
                            {dialogInfo.title}
                        </Heading>
                    </AlertDialogHeader>
                    <AlertDialogBody className="mt-4 mb-6">
                        <Text size="sm" className="leading-normal">
                            {dialogInfo.description}
                        </Text>
                    </AlertDialogBody>
                    <AlertDialogFooter className="gap-2">
                        <PotatoButton onPress={() => handleClose(true)}>{dialogInfo.ok}</PotatoButton>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
        position: "relative",
    },
    header: {
        width: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },
    backButton: {
        position: "absolute",
        width: 44,
        height: 44,
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center",
        left: 10,
    },
    headerText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
    centeredContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
    },
    permissionText: {
        color: "#fff",
        fontSize: 14,
        lineHeight: 14 * 1.5,
    },
    cameraView: {
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
    },
});

export default ScannerPage;
