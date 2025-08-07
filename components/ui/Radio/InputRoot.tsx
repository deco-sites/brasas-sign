interface RadioInputRootProps {
  children: preact.ComponentChildren;
}

export function RadioInputRoot({ children }: RadioInputRootProps) {
  return <div className="flex flex-col gap-2">{children}</div>;
}
