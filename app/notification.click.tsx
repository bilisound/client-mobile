import { router } from "expo-router";
import React, { useEffect } from "react";

const NotificationClick: React.FC = () => {
    useEffect(() => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace("/");
        }
        router.push("/modal");
    }, []);

    return null;
};

export default NotificationClick;
