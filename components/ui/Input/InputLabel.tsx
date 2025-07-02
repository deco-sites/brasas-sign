interface InputLabelProps {
  htmlFor?: string;
  children: preact.ComponentChildren;
}

export function InputLabel({ htmlFor, children }: InputLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-black-800 uppercase text-sm font-semibold"
    >
      {children}
    </label>
  );
}
