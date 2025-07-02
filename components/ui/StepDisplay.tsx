interface StepDisplayProps {
  step: number;
  isActive: boolean;
  title: string;
  subtitle: string;
}

export default function StepDisplay(
  { step, isActive, title, subtitle }: StepDisplayProps,
) {
  return (
    <div className="flex items-center gap-4 uppercase text-white text-xs">
      <span
        className={`rounded-full w-9 h-9 shrink-0 flex justify-center items-center ${
          isActive ? "bg-gray-400" : "border border-white"
        }`}
      >
        {step}
      </span>
      <div className="flex flex-col">
        <span className="">{title}</span>
        <span className="whitespace-nowrap">{subtitle}</span>
      </div>
    </div>
  );
}
