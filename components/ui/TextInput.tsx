import { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { ComponentType } from "preact";

interface InputFieldProps extends JSX.HTMLAttributes<HTMLInputElement> {}

interface TextInputProps {
  htmlFor: string;
  label: string;
  icon?: ComponentType<{ class?: string }>;
  note?: string;
  mask?: (value: string) => string;
  error?: boolean;
}

type Props = TextInputProps & InputFieldProps;

const TextInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const {
    htmlFor,
    label,
    icon: Icon,
    note,
    className,
    mask,
    error,
    onChange,
    ...rest
  } = props;

  // Função customizada de onChange que aplica a máscara
  const handleChange = (e: JSX.TargetedEvent<HTMLInputElement, Event>) => {
    const raw = e.currentTarget.value;
    const masked = mask ? mask(raw) : raw;

    // Atualiza o valor visível do input
    e.currentTarget.value = masked;

    // Chama o onChange original (do register)
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className="relative flex flex-col gap-1">
      <label
        htmlFor={htmlFor}
        className="text-black-800 uppercase text-sm font-semibold"
      >
        {label}
      </label>
      {note && <span className="text-xs font-light">{note}</span>}
      <input
        ref={ref}
        {...rest}
        onChange={handleChange}
        className={`border outline-none text-sm placeholder:text-sm placeholder:text-gray-500 text-gray-500 rounded-lg p-2 w-full ${
          error ? "border-red-300" : "border-gray-500"
        } ${className ?? ""}`}
      />
      {Icon && (
        <Icon class="absolute right-3 top-1/2  w-5 h-5 text-gray-500 pointer-events-none" />
      )}
    </div>
  );
});

export default TextInput;
