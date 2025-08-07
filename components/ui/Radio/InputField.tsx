import { JSX } from "preact";

interface RadioInputFieldProps extends JSX.HTMLAttributes<HTMLInputElement> {}

export function RadioInputField(props: RadioInputFieldProps) {
  return (
    <input
      {...props}
      type="radio"
      className={`accent-blue-600 w-5 h-5 cursor-pointer ${props.class ?? ""}`}
    />
  );
}
