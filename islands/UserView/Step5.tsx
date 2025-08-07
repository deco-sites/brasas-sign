import { useForm } from "react-hook-form";
import { Input } from "../../components/ui/Input/index.tsx";
import FormStepLayout from "../../components/ui/FormStepLayout.tsx";
import CheckboxInput from "../../components/ui/CheckboxInput.tsx";
import TextInput from "../../components/ui/TextInput.tsx";
import { useEffect } from "preact/hooks";

export default function Step5(
  { step, stepList, goToNextStep, goToPreviousStep, goToStep, form },
) {
  const { register, watch, setValue } = form;

  const preference = watch("preference");
  const howFind = watch("howFind");
  const interest = watch("interest");

  return (
    <FormStepLayout
      steps={stepList}
      currentStep={step}
      goToNextStep={goToNextStep}
      goToPreviousStep={goToPreviousStep}
      goToStep={goToStep}
    >
      <div className="flex flex-col xl:flex-row">
        <CheckboxInput
          label="Por que você deu preferência ao BRASAS?"
          name="preference"
          options={[
            {
              id: "reputation",
              value: "reputation",
              label: "Reputação e tradição do curso",
            },
            { id: "method", value: "method", label: "Método de ensino" },
            {
              id: "indication",
              value: "indication",
              label: "Indicação de amigos ou familiares",
            },
            {
              id: "quality",
              value: "quality",
              label: "Qualidade dos professores",
            },
            {
              id: "flexibility",
              value: "flexibility",
              label: "Flexibilidade de horários",
            },
            {
              id: "experience",
              value: "experience",
              label: "Experiência em aulas demonstrativas",
            },
            {
              id: "results",
              value: "results",
              label: "Resultados comprovados de outros alunos",
            },
            { id: "preferenceOther", value: "preferenceOther", label: "Outro" },
          ]}
          register={register("preference")}
        />

        <CheckboxInput
          label="Como conheceu o curso do BRASAS?"
          name="howFind"
          options={[
            {
              id: "google",
              value: "google",
              label: "Google",
            },
            { id: "facebook", value: "facebook", label: "Facebook" },
            {
              id: "instagram",
              value: "instagram",
              label: "Instagram",
            },
            {
              id: "tiktok",
              value: "tiktok",
              label: "TikTok",
            },
            {
              id: "linkedin",
              value: "linkedin",
              label: "Linkedin",
            },
            {
              id: "indication",
              value: "indication",
              label: "Indicação",
            },
            {
              id: "disclosure",
              value: "disclosure",
              label: "Divulgação feita pela empresa",
            },
            { id: "howFindOther", value: "howFindOther", label: "Outro" },
          ]}
          register={register("howFind")}
        />
      </div>

      <CheckboxInput
        label="Qual o seu interesse em aprender português?"
        name="interest"
        options={[
          {
            id: "work",
            value: "work",
            label: "Trabalho",
          },
          { id: "trip", value: "trip", label: "Viagem" },
          {
            id: "live",
            value: "live",
            label: "Morar no Brasil",
          },
          {
            id: "learn",
            value: "learn",
            label: "Aprender uma nova língua",
          },
          {
            id: "study",
            value: "study",
            label: "Estudo",
          },
          { id: "interestOther", value: "interestOther", label: "Outro" },
        ]}
        register={register("interest")}
      />

      {Array.isArray(preference) && preference.includes("preferenceOther") && (
        <TextInput
          htmlFor="whichOthersPreferences"
          label="Quais outros"
          placeholder="Informe por que você deu preferência ao BRASAS?"
          {...register("whichOthersPreferences")}
        />
      )}

      {Array.isArray(howFind) && howFind.includes("howFindOther") && (
        <TextInput
          htmlFor="whichOthersHowFind"
          label="Quais outros"
          placeholder="Informe por quais outros meios conheceu o curso do BRASAS?"
          {...register("whichOthersHowFind")}
        />
      )}

      {Array.isArray(interest) && interest.includes("interestOther") && (
        <TextInput
          htmlFor="whichOthersInterest"
          label="Quais outros"
          placeholder="Informe outros interesses em aprender português"
          {...register("whichOthersInterest")}
        />
      )}
    </FormStepLayout>
  );
}
