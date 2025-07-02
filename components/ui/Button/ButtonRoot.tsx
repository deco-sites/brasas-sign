interface ButtonRootProps {
  children: preact.ComponentChildren;
  type?: "button" | "submit" | "reset";
  uppercaseText?: boolean;
  color: "red" | "blue" | "white" | "green";
  onClickAction: () => void;
}

const BG_COLORS = {
  red: "bg-red-400",
  blue: "bg-blue-500",
  white: "bg-white",
  green: "bg-green-300",
};

export function ButtonRoot(
  { children, type = "button", uppercaseText = false, color, onClickAction }:
    ButtonRootProps,
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
    </button>
  );
}
