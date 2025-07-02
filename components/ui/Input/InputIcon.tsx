import { ElementType } from "preact/compat";

interface InputIconProps {
  icon: ElementType;
}

export function InputIcon({ icon: Icon }: InputIconProps) {
  return (
    <Icon class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
  );
}
