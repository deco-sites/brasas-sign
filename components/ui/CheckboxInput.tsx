import { JSX } from "preact";
import { UseFormRegisterReturn } from "react-hook-form";

interface CheckboxOption {
  id: string;
  value: string;
  label: string;
}

interface CheckboxInputProps {
  label?: string;
  name: string;
  options: CheckboxOption[];
  values?: string[]; // para controle externo (opcional)
  onChange?: (event: JSX.TargetedEvent<HTMLInputElement, Event>) => void;
  className?: string;
  labelClassName?: string;
  groupClassName?: string;
  register?: UseFormRegisterReturn;
}

export default function CheckboxInput({
  label,
  name,
  options,
  values,
  onChange,
  register,
  className = "",
  labelClassName = "",
  groupClassName = "",
}: CheckboxInputProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label
          className={`text-black-800 uppercase text-sm font-semibold ${labelClassName}`}
        >
          {label}
        </label>
      )}

      <div className={`flex flex-col gap-2 ${groupClassName}`}>
        {options.map((option) => {
          const inputId = `${name}-${option.value}`;

          return (
            <label
              key={inputId}
              htmlFor={inputId}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                id={inputId}
                name={name}
                value={option.value}
                checked={values?.includes(option.value)}
                onChange={onChange}
                {...register}
                className="accent-blue-600 w-5 h-5 cursor-pointer"
              />
              <span className="text-sm text-gray-800">{option.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
