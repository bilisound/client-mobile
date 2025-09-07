export interface ActionMenuItem {
  show?: boolean;
  disabled?: boolean;
  icon: string;
  iconSize?: number;
  text: string;
  action: () => void;
}
