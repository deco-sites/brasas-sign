import { JSX } from "preact";
import { UseFormRegisterReturn } from "react-hook-form";

interface RadioOption {
  id: string;
  value: string;
  label: string;
}

interface RadioInputProps {
  label: string;
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: JSX.GenericEventHandler<HTMLInputElement>;
  className?: string;
  labelClassName?: string;
  groupClassName?: string;
  register?: UseFormRegisterReturn;
}

export default function RadioInput({
  label,
  name,
  options,
  value,
  onChange,
  register,
  className = "",
  labelClassName = "",
  groupClassName = "",
}: RadioInputProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label
        className={`text-black-800 uppercase text-sm font-semibold ${labelClassName}`}
      >
        {label}
      </label>

      <div className={`flex gap-4 ${groupClassName}`}>
        {options.map((option) => (
          <label
            key={option.id}
            htmlFor={`${name}-${option.id}`}
            className="flex items-center gap-2 cursor-pointer"
          >
            {/* Radio escondido */}
            <input
              type="radio"
              id={`${name}-${option.id}`}
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              {...register}
              className="hidden peer"
            />
            {/* Círculo customizado */}
            <span
              className={`
              w-5 h-5 rounded-full border-2 border-blue-300 
              peer-checked:bg-blue-300 peer-checked:border-blue-300
              transition-colors duration-150
            `}
            >
            </span>
            <span className="text-sm text-gray-800">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
