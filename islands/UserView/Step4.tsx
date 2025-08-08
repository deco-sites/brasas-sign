import FormStepLayout from "../../components/ui/FormStepLayout.tsx";
import RadioInput from "../../components/ui/RadioInput.tsx";
import TextInput from "../../components/ui/TextInput.tsx";
import { cepMask } from "../../helpers/cepMask.ts";
import { phoneMask } from "../../helpers/phoneMask.ts";

export default function Step4(
  { step, stepList, goToNextStep, goToPreviousStep, goToStep, form },
) {
  const { register, watch, setValue, formState: { errors } } = form;
  const isStudentPedagogicalResponsible = watch(
    "isStudentPedagogicalResponsible",
  );
  const pedagogicalResponsibleAddressEqualsStudent = watch(
    "pedagogicalResponsibleAddressEqualsStudent",
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
        label="O próprio aluno é responsável pedagógico?"
        name="isStudentPedagogicalResponsible"
        value={watch("isStudentPedagogicalResponsible")}
        options={[
          { id: "yes", value: "yes", label: "Sim" },
          { id: "no", value: "no", label: "Não" },
        ]}
        register={register("isStudentPedagogicalResponsible", {
          required: "Selecione uma opção",
        })}
      />
      {errors.isStudentPedagogicalResponsible && (
        <span className="text-red-300 text-xs">
          {errors.isStudentPedagogicalResponsible.message}
        </span>
      )}

      {isStudentPedagogicalResponsible === "no" && (
        <>
          <RadioInput
            label="Tipo de pessoa do responsável pedagógico"
            name="pedagogicalResponsiblePersonType"
            value={watch("pedagogicalResponsiblePersonType")}
            options={[
              { id: "pf", value: "pf", label: "Pessoa Fìsica" },
              { id: "pj", value: "pj", label: "Pessoa Jurídica" },
            ]}
            register={register("pedagogicalResponsiblePersonType")}
          />

          <TextInput
            htmlFor="pedagogicalResponsibleName"
            label="Nome completo do responsável pedagógico"
            placeholder="Informe o nome completo do responsável pedagógico"
            {...register("pedagogicalResponsibleName")}
          />

          <TextInput
            htmlFor="pedagogicalResponsibleKinship"
            label="Parentesco"
            placeholder="Informe o parentesco com o responsável pedagógico"
            {...register("pedagogicalResponsibleKinship")}
          />

          <TextInput
            type="date"
            htmlFor="pedagogicalResponsibleBirthDate"
            label="Data de nascimento"
            placeholder="DD/MM/YYYY"
            {...register("pedagogicalResponsibleBirthDate")}
          />

          <TextInput
            htmlFor="pedagogicalResponsibleCpf"
            label="CPF"
            note="O CPF é um documento brasileiro e não é obrigatório para o preenchimento do formulário"
            placeholder="Insira seu CPF"
            {...register("pedagogicalResponsibleCpf")}
          />

          <TextInput
            htmlFor="pedagogicalResponsiblePhone"
            label="Telefone"
            placeholder="(XX) XXXXX-XXXX"
            mask={phoneMask}
            {...register("pedagogicalResponsiblePhone")}
          />
        </>
      )}

      <RadioInput
        label="Endereço igual do aluno?"
        name="pedagogicalResponsibleAddressEqualsStudent"
        value={watch("pedagogicalResponsibleAddressEqualsStudent")}
        options={[
          { id: "yes", value: "yes", label: "Sim" },
          { id: "no", value: "no", label: "Não" },
        ]}
        register={register("pedagogicalResponsibleAddressEqualsStudent", {
          required: "Selecione uma opção",
        })}
      />
      {errors.pedagogicalResponsibleAddressEqualsStudent && (
        <span className="text-red-300 text-xs">
          {errors.pedagogicalResponsibleAddressEqualsStudent.message}
        </span>
      )}

      {pedagogicalResponsibleAddressEqualsStudent === "no" && (
        <>
          <RadioInput
            label="Onde você mora?"
            name="pedagogicalResponsibleResidence"
            value={watch("pedagogicalResponsibleResidence")}
            options={[
              { id: "br", value: "br", label: "Brasil" },
              { id: "fora", value: "fora", label: "Fora do Brasil" },
            ]}
            register={register("pedagogicalResponsibleResidence")}
          />

          <TextInput
            htmlFor="pedagogicalResponsibleCep"
            label="Cep"
            placeholder="XX.XXX-XX"
            maxLength={10}
            mask={cepMask}
            {...register("pedagogicalResponsibleCep")}
          />

          <TextInput
            htmlFor="pedagogicalResponsibleAddress"
            label="Endereço completo do responsável pedagógico"
            placeholder="Informe o nome da rua"
            {...register("pedagogicalResponsibleAddress")}
          />

          <TextInput
            htmlFor="pedagogicalResponsibleResidenceNumber"
            label="Número"
            placeholder="Informe o número da residência"
            {...register("pedagogicalResponsibleResidenceNumber")}
          />

          <TextInput
            htmlFor="pedagogicalResponsibleResidenceComplement"
            label="Complemento"
            placeholder="Possui complemento?"
            {...register("pedagogicalResponsibleResidenceComplement")}
          />

          <TextInput
            htmlFor="pedagogicalResponsibleResidenceNeighborhood"
            label="Bairro"
            placeholder="Bairro"
            {...register("pedagogicalResponsibleResidenceNeighborhood")}
          />

          <TextInput
            htmlFor="pedagogicalResponsibleCity"
            label="Cidade"
            placeholder="Cidade"
            {...register("pedagogicalResponsibleCity")}
          />

          <TextInput
            htmlFor="pedagogicalResponsibleUf"
            label="Uf"
            placeholder="Estado"
            {...register("pedagogicalResponsibleUf")}
          />
        </>
      )}
    </FormStepLayout>
  );
}
