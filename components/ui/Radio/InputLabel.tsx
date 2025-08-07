interface RadioInputLabelProps {
  htmlFor?: string;
  children: preact.ComponentChildren;
}

export function RadioInputLabel({ htmlFor, children }: RadioInputLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-black-800 uppercase text-sm font-semibold"
    >
      {children}
    </label>
  );
}
