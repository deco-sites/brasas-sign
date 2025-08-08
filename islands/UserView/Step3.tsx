import { useForm } from "react-hook-form";
import { Input } from "../../components/ui/Input/index.tsx";
import FormStepLayout from "../../components/ui/FormStepLayout.tsx";
import RadioInput from "../../components/ui/RadioInput.tsx";
import { useEffect } from "preact/hooks";
import TextInput from "../../components/ui/TextInput.tsx";
import { phoneMask } from "../../helpers/phoneMask.ts";
import { cepMask } from "../../helpers/cepMask.ts";

export default function Step3(
  { step, stepList, goToNextStep, goToPreviousStep, goToStep, form },
) {
  const { register, watch, setValue, formState: { errors } } = form;
  const isStudentFinancialResponsible = watch("isStudentFinancialResponsible");
  const financialResponsibleAddressEqualsStudent = watch(
    "financialResponsibleAddressEqualsStudent",
  );

  return (
    <FormStepLayout
      steps={stepList}
      currentStep={step}
      goToNextStep={goToNextStep}
      goToPreviousStep={goToPreviousStep}
      goToStep={goToStep}
    >
      <RadioInput
        label="O próprio aluno é responsável financeiro?"
        name="isStudentFinancialResponsible"
        value={watch("isStudentFinancialResponsible")}
        options={[
          { id: "yes", value: "yes", label: "Sim" },
          { id: "no", value: "no", label: "Não" },
        ]}
        register={register("isStudentFinancialResponsible", {
          required: "Selecione uma opção",
        })}
      />
      {errors.isStudentFinancialResponsible && (
        <span className="text-red-300 text-xs">
          {errors.isStudentFinancialResponsible.message}
        </span>
      )}

      {isStudentFinancialResponsible === "no" && (
        <>
          <RadioInput
            label="Tipo de pessoa do responsável financeiro?"
            name="financialResponsiblePersonType"
            value={watch("financialResponsiblePersonType")}
            options={[
              { id: "pf", value: "pf", label: "Pessoa Fìsica" },
              { id: "pj", value: "pj", label: "Pessoa Jurídica" },
            ]}
            register={register("financialResponsiblePersonType")}
          />

          <TextInput
            htmlFor="financialResponsibleName"
            label="Nome completo do responsável financeiro"
            placeholder="Informe o nome completo do responsável financeiro"
            {...register("financialResponsibleName")}
          />

          <TextInput
            htmlFor="financialResponsibleKinship"
            label="Parentesco"
            placeholder="Informe qual o parentesco com o responsável financeiro"
            {...register("financialResponsibleKinship")}
          />

          <TextInput
            type="date"
            htmlFor="financialResponsibleBirthDate"
            label="Data de nascimento"
            placeholder="DD/MM/YYYY"
            {...register("financialResponsibleBirthDate")}
          />

          <TextInput
            htmlFor="financialResponsibleCpf"
            label="CPF"
            note="O CPF é um documento brasileiro e não é obrigatório para o preenchimento do formulário"
            placeholder="Insira seu CPF"
            {...register("financialResponsibleCpf")}
          />

          <TextInput
            htmlFor="financialResponsiblePhone"
            label="Telefone"
            placeholder="(XX) XXXXX-XXXX"
            mask={phoneMask}
            {...register("financialResponsiblePhone")}
          />
        </>
      )}

      <RadioInput
        label="Endereço igual do aluno?"
        name="financialResponsibleAddressEqualsStudent"
        value={watch("financialResponsibleAddressEqualsStudent")}
        options={[
          { id: "yes", value: "yes", label: "Sim" },
          { id: "no", value: "no", label: "Não" },
        ]}
        register={register("financialResponsibleAddressEqualsStudent", {
          required: "Selecione uma opção",
        })}
      />
      {errors.financialResponsibleAddressEqualsStudent && (
        <span className="text-red-300 text-xs">
          {errors.financialResponsibleAddressEqualsStudent.message}
        </span>
      )}

      {financialResponsibleAddressEqualsStudent === "no" && (
        <>
          <RadioInput
            label="Onde você mora?"
            name="financialResponsibleResidence"
            value={watch("financialResponsibleResidence")}
            options={[
              { id: "br", value: "br", label: "Brasil" },
              { id: "fora", value: "fora", label: "Fora do Brasil" },
            ]}
            register={register("financialResponsibleResidence")}
          />

          <TextInput
            htmlFor="financialResponsibleCep"
            label="Cep"
            placeholder="XX.XXX-XX"
            maxLength={10}
            mask={cepMask}
            {...register("financialResponsibleCep")}
          />

          <TextInput
            htmlFor="financialResponsibleAddress"
            label="Endereço completo do responsável financeiro"
            placeholder="Informe o nome da rua"
            {...register("financialResponsibleAddress")}
          />

          <TextInput
            htmlFor="financialResponsibleResidenceNumber"
            label="Número"
            placeholder="Informe o número da residência"
            {...register("financialResponsibleResidenceNumber")}
          />

          <TextInput
            htmlFor="financialResponsibleResidenceComplement"
            label="Complemento"
            placeholder="Possui complemento?"
            {...register("financialResponsibleResidenceComplement")}
          />

          <TextInput
            htmlFor="financialResponsibleResidenceNeighborhood"
            label="Bairro"
            placeholder="Bairro"
            {...register("financialResponsibleResidenceNeighborhood")}
          />

          <TextInput
            htmlFor="financialResponsibleCity"
            label="Cidade"
            placeholder="Cidade"
            {...register("financialResponsibleCity")}
          />

          <TextInput
            htmlFor="financialResponsibleUf"
            label="Uf"
            placeholder="Estado"
            {...register("financialResponsibleUf")}
          />
        </>
      )}
    </FormStepLayout>
  );
}
