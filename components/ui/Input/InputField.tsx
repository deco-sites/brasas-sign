import { JSX } from "preact";

interface InputFieldProps extends JSX.HTMLAttributes<HTMLInputElement> {}

export function InputField(props: InputFieldProps) {
  return (
    <input
      {...props}
      class={`border border-gray-500 outline-none text-sm placeholder:text-sm placeholder:text-gray-500 text-gray-500 rounded-lg p-2 w-full ${
        props.class ?? ""
      }`}
    />
  );
}
