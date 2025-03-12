export interface MenuItem {
    show?: boolean;
    disabled?: boolean;
    icon: string;
    iconSize: number;
    text: string;
    action: () => void;
}
