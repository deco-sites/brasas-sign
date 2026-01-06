import { useRef, useState } from "preact/hooks";
import { useClickOutsideListener } from "../../helpers/useClickOutsideListener.ts";
import { UseFormRegisterReturn } from "react-hook-form";

interface Option {
  id: number;
  value: string;
  image?: string;
}

export interface InputProps {
  label: string;
  options: Option[];
  value?: Option | null;
  placeholder: string;
  setValue?: (name: string, value: unknown) => void;
  register?: UseFormRegisterReturn;
  name?: string;
  error?: boolean;
  notFoundText?: string;
}

export default function TypeableInput({
  label,
  options,
  value,
  placeholder,
  register,
  setValue,
  name,
  error,
  notFoundText
}: InputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>(value?.value ?? "");
  const avatarRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useClickOutsideListener(dropdownRef, avatarRef, setIsOpen);

  const toggleDropdown = () => setIsOpen((s) => !s);

  const filteredOptions = options.filter((option) =>
    option.value.toLowerCase().includes(inputValue.toLowerCase()),
  );

  const handleOptionSelect = (option: Option) => {
    if (setValue && name) {
      setValue(name, option);
    }
    setInputValue(option.value);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-1" translate="no" data-notranslate>
      <label className="text-black-800 uppercase text-sm font-semibold">
        {label}
      </label>

      {/* input hidden para compatibilidade com react-hook-form */}
      <input
        type="hidden"
        name={name}
        value={value ? JSON.stringify(value) : ""}
        {...(register ?? {})}
      />

      <div className="relative w-full">
        {/* Caixa que imita o select, mas permite digitação */}
        <div
          ref={avatarRef}
          className={`flex items-center bg-white border outline-none text-sm text-gray-500 rounded-lg p-2 w-full ${
            error ? "border-red-300" : "border-gray-500"
          }`}
        >
          <input
            type="text"
            className="w-full bg-transparent outline-none text-gray-800 placeholder:text-sm placeholder:text-gray-500"
            value={inputValue}
            placeholder={placeholder}
            onFocus={() => setIsOpen(true)}
            onClick={() => setIsOpen(true)}
            onInput={(e) => {
              const target = e.currentTarget as HTMLInputElement;
              setInputValue(target.value);
              setIsOpen(true);
            }}
            translate="no"
          />

          <button
            type="button"
            tabIndex={-1}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            onClick={toggleDropdown}
            className="ml-2 flex items-center justify-center"
          >
            <svg
              className={`transform transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
              width="14"
              height="7"
              viewBox="0 0 16 9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.292893 0.292893C0.683417 -0.0976311 1.31658 -0.0976311 1.70711 0.292893L8 6.58579L14.2929 0.292893C14.6834 -0.0976311 15.3166 -0.0976311 15.7071 0.292893C16.0976 0.683417 16.0976 1.31658 15.7071 1.70711L8.70711 8.70711C8.31658 9.09763 7.68342 9.09763 7.29289 8.70711L0.292893 1.70711C-0.0976311 1.31658 -0.0976311 0.683417 0.292893 0.292893Z"
                fill="black"
                fillOpacity="0.25"
              />
            </svg>
          </button>
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div
            ref={dropdownRef}
            translate="no"
            className={`absolute z-50 max-h-80 overflow-y-auto left-0 mt-[14px] bg-white text-black rounded-xl py-[10px] w-full animate-[dropdown-bounce_0.3s_ease-out] notranslate`}
            role="listbox"
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.id}
                  role="option"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleOptionSelect(option);
                  }}
                  className="flex gap-4 items-center px-4 py-2 text-left cursor-pointer hover:bg-gray-50"
                >
                  {option.image && (
                    <img
                      src={option.image}
                      alt={option.value}
                      className="w-5 h-5 object-cover rounded-sm"
                      draggable={false}
                    />
                  )}
                  <span>{option.value}</span>
                </div>
              ))
            ) : (
              notFoundText && (
                <div className="px-4 py-2 text-left text-gray-500">
                  {notFoundText}
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
