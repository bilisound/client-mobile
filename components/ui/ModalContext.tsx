import { createContext } from "react";

export interface ModalContextProps {
    show: boolean;
    open: boolean;
}

export const ModalContext = createContext<ModalContextProps>({
    show: false,
    open: false,
});
