import { createContext } from "react";

export interface ModalContextProps {
    show: boolean;
}

export const ModalContext = createContext<ModalContextProps>({
    show: false,
});
