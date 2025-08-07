import { JSX } from "preact";

interface RadioOptionProps {
  id: string;
  name: string;
  value: string;
  label: string;
  checked?: boolean;
  onChange?: JSX.GenericEventHandler<HTMLInputElement>;
}

export function RadioInputOption({
  id,
  name,
  value,
  label,
  checked,
  onChange,
}: RadioOptionProps) {
  return (
    <label htmlFor={id} className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="accent-blue-600 w-5 h-5 cursor-pointer"
      />
      <span className="text-sm text-gray-800">{label}</span>
    </label>
  );
}
