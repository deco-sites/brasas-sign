import Image from "apps/website/components/Image.tsx";
import StepDisplay from "../../components/ui/StepDisplay.tsx";
import { Button } from "../../components/ui/Button/index.tsx";
import IconArrowLeft from "https://deno.land/x/tabler_icons_tsx@0.0.7/tsx/arrow-left.tsx";
import IconArrowRight from "https://deno.land/x/tabler_icons_tsx@0.0.7/tsx/arrow-right.tsx";
import { useFormContext } from "react-hook-form";

interface StepItem {
  step: number;
  title: string;
  subtitle: string;
}

interface Props {
  children: preact.ComponentChildren;
  steps: StepItem[];
  currentStep: number;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (step: number) => void;
}

export default function FormStepLayout({
  children,
  steps,
  currentStep,
  goToNextStep,
  goToPreviousStep,
  goToStep,
}: Props) {
  const { handleSubmit, getValues } = useFormContext();

  const onSubmit = () => {
    console.log(getValues()); // pega todos os campos atuais
  };

  return (
    <div className="flex flex-col w-full lg:flex-row lg:h-4/5 lg:w-4/5 rounded-lg">
      {/* Lado esquerdo */}
      <div className="flex flex-col items-center gap-14 lg:bg-blue-500 w-screen lg:w-fit lg:min-w-72 pt-8 lg:p-8 lg:rounded-l-lg">
        <Image
          src="brasas-logo.svg"
          className="object-cover w-36"
        />
        <div className="flex lg:flex-col gap-8 w-full lg:w-fit overflow-x-scroll scrollbar-none px-8">
          {steps.map((s) => (
            <StepDisplay
              key={s.step}
              stepNumber={s.step}
              isActive={s.step === currentStep}
              title={s.title}
              subtitle={s.subtitle}
              goToStep={goToStep}
            />
          ))}
        </div>
      </div>

      {/* Lado direito */}
      <div className="p-4 lg:p-0 w-full">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-gray-400 rounded-lg lg:rounded-l-none lg:rounded-r-lg w-full h-full p-4 lg:p-8 flex flex-col justify-between"
        >
          <div>
            <h1 className="py-4 text-center text-xl">
              Formulário de Matrícula
            </h1>
            <div className="flex flex-col gap-2">{children}</div>
          </div>

          <div className="flex justify-between mt-8">
            <Button.Root color="blue" onClickAction={goToPreviousStep}>
              <Button.Icon icon={IconArrowLeft} />
              <span>Passo anterior</span>
            </Button.Root>

            {currentStep === steps.length
              ? (
                <Button.Root
                  color="green"
                  type="submit"
                >
                  <span>Enviar</span>
                  <Button.Icon icon={IconArrowRight} />
                </Button.Root>
              )
              : (
                <Button.Root
                  type="button"
                  color="red"
                  onClickAction={goToNextStep}
                >
                  <span>Próximo passo</span>
                  <Button.Icon icon={IconArrowRight} />
                </Button.Root>
              )}
          </div>
        </form>
      </div>
    </div>
  );
}
