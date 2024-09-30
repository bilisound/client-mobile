import { create } from "zustand";

export interface StyleParamProps {
    bottomBarHeight: number;
}

export interface StyleParamMethods {
    setBottomBarHeight: (bottomBarHeight: number) => void;
}

export const useStyleParamStore = create<StyleParamMethods & StyleParamProps>()((set, get) => ({
    bottomBarHeight: 0,
    setBottomBarHeight: bottomBarHeight => set(state => ({ bottomBarHeight })),
}));
