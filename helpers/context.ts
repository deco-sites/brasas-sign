import { createContext } from "preact";

type InputSelectContextType = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onChange?: (value: string) => void;
  value?: string;
  triggerRef: preact.RefObject<HTMLDivElement>;
  dropdownRef: preact.RefObject<HTMLDivElement>;
};

export const InputSelectContext = createContext<InputSelectContextType>({
  isOpen: false,
  setIsOpen: () => {},
  onChange: undefined,
  value: undefined,
  triggerRef: { current: null },
  dropdownRef: { current: null },
});
