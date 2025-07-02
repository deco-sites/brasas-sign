import { ElementType } from "preact/compat";

interface ButtonIconProps {
  icon: ElementType;
}
export function ButtonIcon({ icon: Icon }: ButtonIconProps) {
  return <Icon class="w-6 h-6" />;
}
