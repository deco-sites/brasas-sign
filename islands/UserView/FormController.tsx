import { useState } from "preact/hooks";
import InitialStep from "./InitialStep.tsx";
import { FormProvider, useForm } from "react-hook-form";
import Step1 from "./Step1.tsx";
import Step2 from "./Step2.tsx";
import Step3 from "./Step3.tsx";
import Step4 from "./Step4.tsx";
import Step5 from "./Step5.tsx";
import Step6 from "./Step6.tsx";
import { UnitsProvider } from "../../contexts/UnitsContext.tsx";

type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export default function FormController({ units }) {
  const [step, setStep] = useState<Step>(0);

  const requiredFieldsByStep: Record<number, string[]> = {
    1: ["residence", "fullName", "email", "phone", "birthDate", "country", "cpf"],
    2: ["cep", "neighborhood", "city", "uf", "branches", "module"],
    3: [
      "isStudentFinancialResponsible",
      "financialResponsibleAddressEqualsStudent",

      //Campos dependentes do isStudentFinancialResponsible
      "financialResponsiblePersonType",
      "financialResponsibleName",
      "financialResponsibleKinship",
      "financialResponsibleBirthDate",
      "financialResponsibleCpf",
      "financialResponsiblePhone",
      "financialResponsibleEmail",

      //Campos dependentes do financialResponsibleAddressEqualsStudent
      "financialResponsibleResidence",
      "financialResponsibleCep",
      "financialResponsibleResidenceNeighborhood",
      "financialResponsibleCity",
      "financialResponsibleUf",
    ],
    4: [
      "isStudentPedagogicalResponsible",
      "pedagogicalResponsibleAddressEqualsStudent",

      //Campos dependentes do isStudentPedagogicalResponsible
      "pedagogicalResponsiblePersonType",
      "pedagogicalResponsibleName",
      "pedagogicalResponsibleKinship",
      "pedagogicalResponsibleBirthDate",
      "pedagogicalResponsibleCpf",
      "pedagogicalResponsiblePhone",
      "pedagogicalResponsibleEmail",

      //Campos dependentes do pedagogicalResponsibleAddressEqualsStudent
      "pedagogicalResponsibleResidence",
      "pedagogicalResponsibleCep",
      "pedagogicalResponsibleResidenceNeighborhood",
      "pedagogicalResponsibleCity",
      "pedagogicalResponsibleUf",
    ],
    5: ["preference", "howFind", "interest"],
  };

  const form = useForm({
    defaultValues: {
      ...Object.fromEntries(
        Object.values(requiredFieldsByStep)
          .flat()
          .map((field) => [field, ""]),
      ),
      courseType: "",
      preference: [],
      howFind: [],
      interest: [],
      imageAuth: "yes",
      agree: true,
    },
    mode: "onTouched",
  });

  // Função para ir para um step específico
  const goToStepWithValidation = async (targetStep: number) => {
    const fieldsToValidate = requiredFieldsByStep[step] || [];

    if (fieldsToValidate.length > 0) {
      const isValid = await trigger(fieldsToValidate);
      if (!isValid) return; // bloqueia avanço
    }

    setStep(targetStep as Step);
  };

  // Função para próximo passo
  const goToNextStepWithValidation = async () => {
    const fieldsToValidate = requiredFieldsByStep[step] || [];

    if (fieldsToValidate.length > 0) {
      const isValid = await trigger(fieldsToValidate);
      if (!isValid) return; // bloqueia avanço
    }

    setStep((prev) => (prev + 1) as Step);
  };

  const { handleSubmit, trigger } = form;

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
      <UnitsProvider units={units}>
        <FormProvider {...form}>
          <CurrentStepComponent
            step={step}
            goToNextStep={goToNextStepWithValidation}
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
            goToStep={goToStepWithValidation}
            form={form}
          />
        </FormProvider>
      </UnitsProvider>
    </div>
  );
}
