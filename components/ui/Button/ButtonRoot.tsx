interface ButtonRootProps {
  children: preact.ComponentChildren;
  type?: "button" | "submit" | "reset";
  uppercaseText?: boolean;
  color: "red" | "blue" | "white" | "green";
  onClickAction?: () => void;
  disabled?: boolean;
}

const BG_COLORS = {
  red: "bg-red-400",
  blue: "bg-blue-500",
  white: "bg-white",
  green: "bg-green-300",
};

export function ButtonRoot(
  {
    children,
    type = "submit",
    uppercaseText = false,
    color,
    onClickAction,
    disabled = false,
  }: ButtonRootProps,
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
      } disabled:cursor-not-allowed disabled:bg-gray-100`}
      onClick={onClickAction}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
