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
  value?: string | Option | null;
  placeholder: string;
  setValue?: (name: string, value: any) => void;
  register?: UseFormRegisterReturn;
  name?: string;
  error?: boolean;
}

export default function Select(
  {
    label,
    options,
    value,
    placeholder,
    register,
    setValue,
    name,
    error,
  }: InputProps,
) {
  const [isOpen, setIsOpen] = useState(false);
  const avatarRef = useRef(null);
  const dropdownRef = useRef(null);

  useClickOutsideListener(dropdownRef, avatarRef, setIsOpen);

  const handleClickInside = (event: MouseEvent) => {
    event.stopPropagation();
  };

  const displayLabel = typeof value === "string"
    ? value
    : value && typeof value === "object"
    ? (value as Option).value
    : placeholder;

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: Option) => {
    if (setValue && name) setValue(name, option);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-black-800 uppercase text-sm font-semibold">
        {label}
      </label>

      {/* Hidden input to integrate with react-hook-form */}
      <input
        type="hidden"
        name={name}
        value={value
          ? (typeof value === "string" ? value : JSON.stringify(value))
          : ""}
        {...(register ?? {})}
      />

      <div className="relative w-full">
        {/* Select box */}
        <div
          tabIndex={0}
          role="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className={`flex items-center bg-white border outline-none text-sm placeholder:text-sm placeholder:text-gray-500 text-gray-500 rounded-lg p-2 w-full ${
            error ? "border-red-300" : "border-gray-500"
          }`}
          ref={avatarRef}
          onClick={toggleDropdown}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggleDropdown();
            }
          }}
        >
          <span>{displayLabel || placeholder}</span>
          <svg
            className={`transform transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            } ml-auto`}
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
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div
            ref={dropdownRef}
            onClick={handleClickInside}
            className={`absolute z-50 max-h-80 overflow-y-scroll left-0 mt-[14px] bg-white text-black text-opacity-25 rounded-xl py-[30px] w-full animate-[dropdown-bounce_0.3s_ease-out]`}
          >
            {options.map((option, index) => (
              <div
                key={index}
                className="flex gap-4 items-center px-4 text-center cursor-pointer mb-[33px] last:mb-0"
                onClick={() => handleOptionClick(option)}
              >
                {option.image && (
                  <img
                    src={option.image}
                    alt={option.value}
                    className="w-5 h-5 object-cover rounded-sm"
                  />
                )}
                {option.value}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
