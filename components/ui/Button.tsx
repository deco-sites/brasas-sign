import { ComponentType } from "preact";

interface ButtonProps {
  children: preact.ComponentChildren;
  type?: "button" | "submit" | "reset";
  uppercaseText?: boolean;
  color: "red" | "blue" | "white" | "green";
  onClickAction: () => void;
  icon?: ComponentType<{ class?: string }>;
}

const BG_COLORS = {
  red: "bg-red-400",
  blue: "bg-blue-500",
  white: "bg-white",
  green: "bg-green-300",
};

export default function Button(
  {
    children,
    type = "button",
    uppercaseText = false,
    color,
    onClickAction,
    icon: Icon,
  }: ButtonProps,
) {
  return (
    <button
      type={type}
      className={`flex items-center justify-center gap-4 ${
        color === "white" ? "text-red-400" : "text-white"
      } ${
        BG_COLORS[color]
      } rounded-lg py-2 px-4 text-sm font-semibold cursor-pointer whitespace-nowrap ${
        uppercaseText ? "uppercase" : ""
      }`}
      onClick={onClickAction}
    >
      {children}
      {Icon && (
        <Icon class="absolute right-3 top-1/2  w-5 h-5 text-gray-500 pointer-events-none" />
      )}
    </button>
  );
}
