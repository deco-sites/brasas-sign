interface InputRootProps {
  children: preact.ComponentChildren;
}

export function InputRoot({ children }: InputRootProps) {
  return (
    <div className="flex flex-col gap-1">
      {children}
    </div>
  );
}
