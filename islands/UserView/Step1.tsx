import { useForm } from "react-hook-form";
import { Input } from "../../components/ui/Input/index.tsx";
import FormStepLayout from "../../components/ui/FormStepLayout.tsx";

import SelectInput from "../../components/ui/SelectInput.tsx";
import TextInput from "../../components/ui/TextInput.tsx";
import RadioInput from "../../components/ui/RadioInput.tsx";
import CheckboxInput from "../../components/ui/CheckboxInput.tsx";
import MultiInput from "../../components/ui/MultiInput.tsx";
import { phoneMask } from "../../helpers/phoneMask.ts";

export default function Step1(
  { step, stepList, goToNextStep, goToPreviousStep, goToStep, form },
) {
  const { register, watch, setValue, getValues } = form;

  const options = [
    { id: 1, value: "Option 1" },
    { id: 2, value: "Option 2" },
  ];

  return (
    <FormStepLayout
      steps={stepList}
      currentStep={step}
      goToNextStep={goToNextStep}
      goToPreviousStep={goToPreviousStep}
      goToStep={goToStep}
    >
      <RadioInput
        label="Onde você mora?"
        name="residence"
        value={watch("residence")}
        options={[
          { id: "br", value: "brasil", label: "Brasil" },
          { id: "fora", value: "fora-do-brasil", label: "Fora do Brasil" },
        ]}
        register={register("residence")}
      />

      <TextInput
        required
        htmlFor="school/company"
        label="Escola/Empresa"
        placeholder="Informe o nome da escola em que o aluno estuda ou empresa em que o aluno trabalha"
        {...register("school/company")}
      />

      <TextInput
        htmlFor="fullName"
        label="Nome completo do aluno"
        placeholder="Insira o nome completo do aluno"
        {...register("fullName")}
      />

      <TextInput
        htmlFor="email"
        label="E-mail"
        placeholder="Insira seu e-mail"
        {...register("email")}
      />

      <TextInput
        htmlFor="phone"
        label="Telefone"
        placeholder="(XX) XXXXX-XXXX"
        mask={phoneMask}
        {...register("phone")}
      />

      <TextInput
        type="date"
        htmlFor="birthDate"
        label="Data de nascimento"
        placeholder="DD/MM/YYYY"
        {...register("birthDate")}
      />

      <TextInput
        htmlFor="cpf"
        label="CPF"
        note="O CPF é um documento brasileiro e não é obrigatório para o preenchimento do formulário"
        placeholder="Insira seu CPF"
        {...register("cpf")}
      />

      <SelectInput
        name="country"
        label="País de origem"
        options={options}
        value={watch("country")}
        placeholder="Selecione uma opção"
        register={register("country")}
        setValue={setValue}
      />

      <MultiInput
        htmlFor="languages"
        label="Quais idiomas você fala?"
        placeholder="informe um idioma"
        onChangeValues={(values) => console.log(values)}
        setValue={setValue}
        getValues={getValues}
      />
    </FormStepLayout>
  );
}
