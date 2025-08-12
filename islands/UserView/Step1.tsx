import { useForm } from "react-hook-form";
import { Input } from "../../components/ui/Input/index.tsx";
import FormStepLayout from "../../components/ui/FormStepLayout.tsx";

import SelectInput from "../../components/ui/SelectInput.tsx";
import TextInput from "../../components/ui/TextInput.tsx";
import RadioInput from "../../components/ui/RadioInput.tsx";
import CheckboxInput from "../../components/ui/CheckboxInput.tsx";
import MultiInput from "../../components/ui/MultiInput.tsx";
import { phoneMask } from "../../helpers/phoneMask.ts";
import { useEffect, useState } from "preact/hooks";
import { cpfMask } from "../../helpers/cpfMask.ts";
import { textMask } from "../../helpers/textMask.ts";

export default function Step1(
  { step, stepList, goToNextStep, goToPreviousStep, goToStep, form },
) {
  const {
    register,
    watch,
    setValue,
    getValues,
    trigger,
    formState: { errors },
  } = form;

  const [countries, setCountries] = useState([]);
  const residence = watch("residence");

  useEffect(() => {
    // Revalida o cpf toda vez que residence mudar
    trigger("cpf");
  }, [residence]);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,flags")
      .then((res) => res.json())
      .then((data) => {
        const formattedOptions = data
          .sort((a, b) => a.name.common.localeCompare(b.name.common))
          .map((country, index) => ({
            id: index + 1,
            value: country.name.common,
            image: country.flags.png, // ou country.flags.svg para vetor
          }));
        setCountries(formattedOptions);
      })
      .catch((error) => console.error("Erro ao carregar países:", error));
  }, []);

  return (
    <FormStepLayout
      steps={stepList}
      currentStep={step}
      goToNextStep={goToNextStep}
      goToPreviousStep={goToPreviousStep}
      goToStep={goToStep}
    >
      <RadioInput
        label="*Onde você mora?"
        name="residence"
        value={watch("residence")}
        options={[
          { id: "br", value: "brasil", label: "Brasil" },
          { id: "fora", value: "fora-do-brasil", label: "Fora do Brasil" },
        ]}
        register={register("residence", { required: "Selecione uma opção" })}
      />
      {errors.residence && (
        <span className="text-red-300 text-xs">
          {errors.residence.message}
        </span>
      )}

      <TextInput
        required
        htmlFor="schoolOrCompany"
        label="Escola/Empresa"
        placeholder="Informe o nome da escola em que o aluno estuda ou empresa em que o aluno trabalha"
        {...register("schoolOrCompany")}
      />

      <TextInput
        htmlFor="fullName"
        label="*Nome completo do aluno"
        error={errors.fullName}
        mask={textMask}
        placeholder="Insira o nome completo do aluno"
        {...register("fullName", {
          required: "Informe o nome completo do aluno",
        })}
      />
      {errors.fullName && (
        <span className="text-red-300 text-xs">
          {errors.fullName.message}
        </span>
      )}

      <TextInput
        htmlFor="email"
        label="*E-mail"
        error={errors.email}
        placeholder="Insira seu e-mail"
        {...register("email", {
          required: "Informe seu e-mail",
        })}
      />
      {errors.email && (
        <span className="text-red-300 text-xs">
          {errors.email.message}
        </span>
      )}

      <TextInput
        htmlFor="phone"
        label="*Telefone"
        placeholder="(XX) XXXXX-XXXX"
        minLength={11}
        error={errors.phone}
        mask={phoneMask}
        {...register("phone", { required: "Informe o telefone" })}
      />
      {errors.phone && (
        <span className="text-red-300 text-xs">
          {errors.phone.message}
        </span>
      )}

      <TextInput
        type="date"
        htmlFor="birthDate"
        label="*Data de nascimento"
        error={errors.birthDate}
        placeholder="DD/MM/YYYY"
        {...register("birthDate", { required: "Informe a data de nascimento" })}
      />
      {errors.birthDate && (
        <span className="text-red-300 text-xs">
          {errors.birthDate.message}
        </span>
      )}

      <TextInput
        htmlFor="cpf"
        label={residence === "brasil" ? "*CPF" : "CPF"}
        note={residence === "brasil"
          ? false
          : "O CPF é um documento brasileiro e não é obrigatório para o preenchimento do formulário"}
        mask={cpfMask}
        minLength={14}
        error={errors.cpf}
        placeholder="Insira seu CPF"
        {...register("cpf", {
          required: residence === "brasil" ? "Informe o CPF" : false,
          minLength: {
            value: 14,
            message: "CPF deve ter pelo menos 11 dígitos",
          },
        })}
      />
      {errors.cpf && (
        <span className="text-red-300 text-xs">
          {errors.cpf.message}
        </span>
      )}

      <SelectInput
        name="country"
        label="*País de origem"
        options={countries}
        value={watch("country")}
        error={errors.country}
        placeholder="Selecione uma opção"
        register={register("country", { required: "Selecione uma opção" })}
        setValue={setValue}
      />
      {errors.country && (
        <span className="text-red-300 text-xs">
          {errors.country.message}
        </span>
      )}

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
