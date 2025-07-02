import { useState } from "preact/hooks";
import RegularStep1 from "../../islands/UserView/RegularCourse/Step1.tsx";
import RegularStep2 from "../../islands/UserView/RegularCourse/Step2.tsx";
import PFFStep1 from "./PFF/Step1.tsx";
import PFFStep2 from "./PFF/Step2.tsx";
import SelectCourseTypeIsland from "./SelectCourseTypeIsland.tsx";
import InternationalizationController from "../../components/ui/InternationalizationController.tsx";

type Flow = "regular" | "pff";
type Step = 1 | 2 | 3;

export default function FormController() {
  const [flow, setFlow] = useState<Flow | null>(null);
  const [step, setStep] = useState<Step>(1);

  const steps = {
    regular: {
      1: RegularStep1,
      2: RegularStep2,
    },
    pff: {
      1: PFFStep1,
      2: PFFStep2,
    },
  };

  if (!flow) {
    return (
      <div className="relative px-4 h-screen overflow-hidden w-screen bg-blue-900 flex justify-center items-center">
        <InternationalizationController />
        <SelectCourseTypeIsland
          onSelect={(selected: Flow) => setFlow(selected)}
        />
      </div>
    );
  }

  const CurrentStepComponent = steps[flow][step];

  return (
    <div className="relative px-4 h-screen overflow-hidden w-screen bg-blue-900 flex justify-center items-center">
      <CurrentStepComponent
        goToNextStep={() => setStep((prev) => (prev + 1) as Step)}
        goToPreviousStep={() => {
          if (step === 1) {
            setFlow(null);
            setStep(1);
          } else {
            setStep((prev) => (prev - 1) as Step);
          }
        }}
        resetForm={() => {
          setFlow(null);
          setStep(1);
        }}
      />
    </div>
  );
}
