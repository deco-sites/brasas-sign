import { JSX } from "preact";
import { ComponentType } from "preact";
import { useState } from "preact/hooks";
import IconPlus from "https://deno.land/x/tabler_icons_tsx@0.0.7/tsx/plus.tsx";
import IconTrash from "https://deno.land/x/tabler_icons_tsx@0.0.7/tsx/trash.tsx";

interface InputFieldProps extends JSX.HTMLAttributes<HTMLInputElement> {}

interface MultiInputProps {
  htmlFor: string;
  label: string;
  icon?: ComponentType<{ class?: string }>;
  onChangeValues?: (values: string[]) => void;
  setValue: (name: string, value: any) => void;
  getValues: (name: string) => any;
}

type Props = MultiInputProps & InputFieldProps;

export default function MultiInput(props: Props) {
  const {
    htmlFor,
    label,
    icon: Icon,
    class: className,
    onChangeValues,
    setValue,
    getValues,
    ...rest
  } = props;

  const createItem = (value = "") => ({
    id: crypto.randomUUID(),
    value,
  });

  const initialValues: string[] = getValues(htmlFor) || [];
  const [multiStepItems, setMultiStepItems] = useState(
    initialValues.length > 0
      ? initialValues.map((v) => createItem(v))
      : [createItem()]
  );

  const updateFormValue = (updatedItems: typeof multiStepItems) => {
    const values = updatedItems.map((item) => item.value);
    setValue(htmlFor, values);
    onChangeValues?.(values);
  };

  const handleChange = (id: string, value: string) => {
    setMultiStepItems((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, value } : item
      );
      updateFormValue(updated);
      return updated;
    });
  };

  const handleAddInput = () => {
    setMultiStepItems((prev) => {
      const updated = [...prev, createItem()];
      updateFormValue(updated);
      return updated;
    });
  };

  const handleRemoveInput = (id: string) => {
    setMultiStepItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      updateFormValue(updated);
      return updated;
    });
  };

  return (
    <div className="relative flex flex-col gap-1">
      <label
        htmlFor={htmlFor}
        className="text-black-800 uppercase text-sm font-semibold"
      >
        {label}
      </label>

      <div className="flex flex-col gap-2">
        {multiStepItems.map((item) => (
          <div key={item.id} className="flex gap-4 items-center relative">
            <input
              {...rest}
              value={item.value}
              onInput={(e) =>
                handleChange(item.id, (e.target as HTMLInputElement).value)}
              class={`border border-gray-500 outline-none text-sm placeholder:text-sm placeholder:text-gray-500 text-gray-700 rounded-lg p-2 w-64 ${
                className ?? ""
              }`}
            />

            {Icon && (
              <Icon class="absolute right-3 top-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
            )}

            {multiStepItems.length > 1 && (
              <button
                type="button"
                className="bg-blue-500 rounded-full shrink-0 w-6 h-6 flex items-center justify-center"
                onClick={() => handleRemoveInput(item.id)}
              >
                <IconTrash class="w-4 h-4 text-white" />
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          className="bg-blue-500 rounded-full shrink-0 w-9 h-9 flex items-center justify-center"
          onClick={handleAddInput}
        >
          <IconPlus class="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
}
