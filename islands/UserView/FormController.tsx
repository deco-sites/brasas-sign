import { useState } from "preact/hooks";
import InitialStep from "./InitialStep.tsx";
import { useForm } from "react-hook-form";
import Step1 from "./Step1.tsx";
import Step2 from "./Step2.tsx";
import Step3 from "./Step3.tsx";
import Step4 from "./Step4.tsx";
import Step5 from "./Step5.tsx";
import Step6 from "./Step6.tsx";

type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export default function FormController() {
  const [step, setStep] = useState<Step>(0);
  const form = useForm();
  const { handleSubmit } = form;

  const steps = {
    0: InitialStep,
    1: Step1,
    2: Step2,
    3: Step3,
    4: Step4,
    5: Step5,
    6: Step6,
  };

  const stepList = [
    { step: 1, title: "Step 1", subtitle: "Informações pessoais" },
    { step: 2, title: "Step 2", subtitle: "Endereço" },
    { step: 3, title: "Step 3", subtitle: "Financeiro" },
    { step: 4, title: "Step 4", subtitle: "Pedagógico" },
    { step: 5, title: "Step 5", subtitle: "Interesses" },
    { step: 6, title: "Step 6", subtitle: "Autorizações" },
  ];

  const CurrentStepComponent = steps[step];

  const nextStep = (data) => {
    console.log("Foi pro próximo passo", data);

    setStep((prev) => (prev + 1) as Step);
  };

  return (
    <div className="relative min-h-screen overflow-y-auto max-w-screen bg-blue-900 flex justify-center lg:items-center">
      <CurrentStepComponent
        step={step}
        goToNextStep={() => handleSubmit(nextStep)()}
        goToPreviousStep={() => {
          if (step === 0) {
            setStep(0);
          } else {
            setStep((prev) => (prev - 1) as Step);
          }
        }}
        resetForm={() => {
          setStep(0);
        }}
        stepList={stepList}
        goToStep={(step: number) => {
          console.log("Setando step para", step);
          setStep(step as Step);
        }}
        form={form}
      />
    </div>
  );
}
