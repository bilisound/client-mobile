import { Ionicons } from "@expo/vector-icons";
import { Box, ButtonText, Pressable, Text, Button } from "@gluestack-ui/themed";
import { CameraView, Camera, PermissionStatus } from "expo-camera";
import { BarcodeScanningResult } from "expo-camera/build/Camera.types";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import log from "~/utils/logger";
import { handleQrCode } from "~/utils/qrcode";

const ScannerPage: React.FC = () => {
    const [hasPermission, setHasPermission] = useState<PermissionStatus | null>(null);
    // const [scanned, setScanned] = useState(false);
    const scanned = useRef(false);
    const safeAreaInsets = useSafeAreaInsets();

    const getBarCodeScannerPermissions = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status);
    };

    const showUnsupportedWarning = (
        message = "Bilisound 不支持您扫描的这个二维码，请确保您扫描的是视频网站地址的二维码。",
    ) => {
        Alert.alert(
            "坏耶！",
            message,
            [
                {
                    text: "确定",
                    isPreferred: true,
                    onPress() {
                        scanned.current = false;
                    },
                },
            ],
            {
                onDismiss() {
                    scanned.current = false;
                },
            },
        );
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
        <Box
            sx={{
                flex: 1,
                backgroundColor: "#000",
                position: "relative",
            }}
        >
            <StatusBar barStyle="light-content" showHideTransition="none" />
            <Box
                sx={{
                    width: "100%",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    height: safeAreaInsets.top + 56,
                    paddingTop: safeAreaInsets.top,
                }}
            >
                <Pressable
                    onPress={() => {
                        router.back();
                    }}
                    style={{
                        position: "absolute",
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        left: 8,
                        top: 8 + safeAreaInsets.top,
                    }}
                >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </Pressable>
                <Text
                    style={{
                        color: "#fff",
                        fontWeight: "700",
                        fontSize: 14,
                    }}
                >
                    扫描二维码
                </Text>
            </Box>
            {(() => {
                if (hasPermission === null || hasPermission === "undetermined") {
                    return (
                        <Box
                            sx={{
                                flex: 1,
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 16,
                            }}
                        >
                            {/* <Text style={styles.noCameraContainerText}>Requesting for camera permission</Text> */}
                        </Box>
                    );
                }
                if (hasPermission === "denied") {
                    return (
                        <Box
                            sx={{
                                flex: 1,
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 16,
                            }}
                        >
                            <Text
                                style={{
                                    color: "#fff",
                                }}
                            >
                                扫码功能需要摄像头权限喵
                            </Text>
                            <Button action="primary" onPress={() => getBarCodeScannerPermissions()}>
                                <ButtonText>给予权限</ButtonText>
                            </Button>
                        </Box>
                    );
                }
                /* if (scanned) {
                    return (
                        <View style={styles.noCameraContainer}>
                            <Text style={styles.noCameraContainerText}>已经扫描过了</Text>
                            <Button onPress={() => setScanned(false)}>
                                <Text>再来一次</Text>
                            </Button>
                        </View>
                    );
                } */
                return (
                    <CameraView
                        onBarcodeScanned={handleBarCodeScanned}
                        barcodeScannerSettings={{
                            barcodeTypes: ["qr"],
                        }}
                        style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            width: "100%",
                            height: "100%",
                            zIndex: -1,
                        }}
                    />
                );
            })()}
        </Box>
    );
};

export default ScannerPage;
