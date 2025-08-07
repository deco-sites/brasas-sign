import { createContext } from "preact";

export const InputSelectContext = createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onChange?: (value: string) => void;
  value?: string;
  triggerRef: preact.RefObject<HTMLDivElement>;
  dropdownRef: preact.RefObject<HTMLDivElement>;
}>(null as any);
