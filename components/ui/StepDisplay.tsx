interface StepDisplayProps {
  stepNumber: number;
  isActive: boolean;
  title: string;
  subtitle: string;
  goToStep: (step: number) => void;
}

export default function StepDisplay(
  { stepNumber, isActive, title, subtitle, goToStep }: StepDisplayProps,
) {
  return (
    <div className="flex items-center gap-4 uppercase  text-xs">
      <span
        className={`rounded-full w-9 h-9 shrink-0 flex justify-center items-center cursor-pointer ${
          isActive ? "bg-gray-400 text-black" : "border border-white text-white"
        }`}
        onClick={() => goToStep(stepNumber)}
      >
        {stepNumber}
      </span>
      <div className="flex flex-col text-white">
        <span className="">{title}</span>
        <span className="whitespace-nowrap">{subtitle}</span>
      </div>
    </div>
  );
}
