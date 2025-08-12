import { useForm } from "react-hook-form";
import { Input } from "../../components/ui/Input/index.tsx";
import FormStepLayout from "../../components/ui/FormStepLayout.tsx";
import RadioInput from "../../components/ui/RadioInput.tsx";
import { useEffect, useState } from "preact/hooks";
import TextInput from "../../components/ui/TextInput.tsx";
import { phoneMask } from "../../helpers/phoneMask.ts";
import { cepMask } from "../../helpers/cepMask.ts";
import { useWatch } from "react-hook-form";
import { getCep } from "../../services/cep.ts";

export default function Step3(
  { step, stepList, goToNextStep, goToPreviousStep, goToStep, form },
) {
  const { register, watch, setValue, formState: { errors } } = form;
  const isStudentFinancialResponsible = watch("isStudentFinancialResponsible");
  const financialResponsibleAddressEqualsStudent = watch(
    "financialResponsibleAddressEqualsStudent",
  );
  const financialResponsibleResidence = watch("financialResponsibleResidence");
  const financialResponsiblePersonType = watch(
    "financialResponsiblePersonType",
  );
  const cep = useWatch({
    control: form.control,
    name: "financialResponsibleCep",
  });
  const [viaCepReturn, setViaCepReturn] = useState({});
  const [viaCepLoaded, setViaCepLoaded] = useState(false);

  const [disabledFields, setDisabledFields] = useState<Record<string, boolean>>(
    {
      address: false,
      neighborhood: false,
      city: false,
      uf: false,
    },
  );

  useEffect(() => {
    if (cep?.length < 10) {
      // CEP incompleto: limpa tudo e habilita os campos
      setViaCepReturn({});
      setViaCepLoaded(false);
      setDisabledFields({
        address: false,
        neighborhood: false,
        city: false,
        uf: false,
      });

      setValue("financialResponsibleAddress", "");
      setValue("financialResponsibleResidenceNeighborhood", "");
      setValue("financialResponsibleCity", "");
      setValue("financialResponsibleUf", "");
    }
  }, [cep, setValue]);

  useEffect(() => {
    if (!cep) return;
    const cleanCep = cep?.replace(/\D/g, "");

    if (cep?.length === 10) {
      callViaCep(cleanCep);
    }
  }, [cep]);

  const callViaCep = async (cep: string) => {
    try {
      const response = await getCep(cep);

      if (!response) {
        // CEP inválido: limpa campos e habilita
        setViaCepReturn({});
        setViaCepLoaded(false);
        setDisabledFields({
          address: false,
          neighborhood: false,
          city: false,
          uf: false,
        });

        setValue("financialResponsibleAddress", "");
        setValue("financialResponsibleResidenceNeighborhood", "");
        setValue("financialResponsibleCity", "");
        setValue("financialResponsibleUf", "");
        return;
      }

      // CEP válido: segue normalmente
      setViaCepReturn(response);
      setViaCepLoaded(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!viaCepLoaded) return;

    const newDisabledFields = {
      address: viaCepReturn?.logradouro?.trim() !== "",
      neighborhood: viaCepReturn?.bairro?.trim() !== "",
      city: viaCepReturn?.localidade?.trim() !== "",
      uf: viaCepReturn?.uf?.trim() !== "",
    };

    setDisabledFields(newDisabledFields);

    setValue("financialResponsibleAddress", viaCepReturn.logradouro || "");
    setValue(
      "financialResponsibleResidenceNeighborhood",
      viaCepReturn.bairro || "",
    );
    setValue("financialResponsibleCity", viaCepReturn.localidade || "");
    setValue("financialResponsibleUf", viaCepReturn.uf || "");
  }, [viaCepReturn, viaCepLoaded, setValue]);

  return (
    <FormStepLayout
      steps={stepList}
      currentStep={step}
      goToNextStep={goToNextStep}
      goToPreviousStep={goToPreviousStep}
      goToStep={goToStep}
    >
      <RadioInput
        label="*O próprio aluno é responsável financeiro?"
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
            register={register("financialResponsiblePersonType", {
              validate: (value) => {
                if (watch("isStudentFinancialResponsible") === "no") {
                  return (value && value.trim() !== "") || "Campo obrigatório";
                }
                return true;
              },
            })}
          />
          {errors.financialResponsiblePersonType && (
            <span className="text-red-300 text-xs">
              {errors.financialResponsiblePersonType.message}
            </span>
          )}

          <TextInput
            htmlFor="financialResponsibleName"
            label={financialResponsiblePersonType === "pj"
              ? "*Razão social do responsável financeiro"
              : "*Nome completo do responsável financeiro"}
            placeholder={financialResponsiblePersonType === "pj"
              ? "Informe a razão social do responsável financeiro"
              : "Informe o nome completo do responsável financeiro"}
            error={!!errors.financialResponsibleName}
            {...register("financialResponsibleName", {
              validate: (value) => {
                if (watch("isStudentFinancialResponsible") === "no") {
                  return (value && value.trim() !== "") || "Campo obrigatório";
                }
                return true;
              },
            })}
          />
          {errors.financialResponsibleName && (
            <span className="text-red-300 text-xs">
              {errors.financialResponsibleName.message}
            </span>
          )}

          <TextInput
            htmlFor="financialResponsibleKinship"
            label="*Parentesco"
            error={!!errors.financialResponsibleKinship}
            placeholder="Informe qual o parentesco com o responsável financeiro"
            {...register("financialResponsibleKinship", {
              validate: (value) => {
                if (watch("isStudentFinancialResponsible") === "no") {
                  return (value && value.trim() !== "") || "Campo obrigatório";
                }
                return true;
              },
            })}
          />
          {errors.financialResponsibleKinship && (
            <span className="text-red-300 text-xs">
              {errors.financialResponsibleKinship.message}
            </span>
          )}

          <TextInput
            type="date"
            htmlFor="financialResponsibleBirthDate"
            label="Data de nascimento"
            placeholder="DD/MM/YYYY"
            error={!!errors.financialResponsibleBirthDate}
            {...register("financialResponsibleBirthDate", {
              validate: (value) => {
                if (watch("isStudentFinancialResponsible") === "no") {
                  return (value && value.trim() !== "") || "Campo obrigatório";
                }
                return true;
              },
            })}
          />
          {errors.financialResponsibleBirthDate && (
            <span className="text-red-300 text-xs">
              {errors.financialResponsibleBirthDate.message}
            </span>
          )}

          <TextInput
            htmlFor="financialResponsibleCpf"
            label={financialResponsiblePersonType === "pj" ? "CNPJ" : "CPF"}
            note={financialResponsiblePersonType === "pj"
              ? false
              : "O CPF é um documento brasileiro e não é obrigatório para o preenchimento do formulário"}
            error={!!errors.financialResponsibleCpf}
            placeholder={financialResponsiblePersonType === "pj"
              ? "Informe o CNPJ do responsável financeiro"
              : "Informe o CPF do responsável financeiro"}
            {...register("financialResponsibleCpf", {
              validate: (value) => {
                if (watch("isStudentFinancialResponsible") === "no") {
                  return (value && value.trim() !== "") || "Campo obrigatório";
                }
                return true;
              },
            })}
          />
          {errors.financialResponsibleCpf && (
            <span className="text-red-300 text-xs">
              {errors.financialResponsibleCpf.message}
            </span>
          )}

          <TextInput
            htmlFor="financialResponsiblePhone"
            label="Telefone"
            placeholder="(XX) XXXXX-XXXX"
            error={!!errors.financialResponsiblePhone}
            mask={phoneMask}
            {...register("financialResponsiblePhone", {
              validate: (value) => {
                if (watch("isStudentFinancialResponsible") === "no") {
                  return (value && value.trim() !== "") || "Campo obrigatório";
                }
                return true;
              },
            })}
          />
          {errors.financialResponsiblePhone && (
            <span className="text-red-300 text-xs">
              {errors.financialResponsiblePhone.message}
            </span>
          )}

          <TextInput
            htmlFor="financialResponsibleEmail"
            label="*E-mail"
            error={!!errors.financialResponsibleEmail}
            placeholder="Insira seu e-mail"
            {...register("financialResponsibleEmail", {
              validate: (value) => {
                if (
                  watch("isStudentFinancialResponsible") === "no"
                ) {
                  return (value && value.trim() !== "") || "Campo obrigatório";
                }
                return true;
              },
            })}
          />
          {errors.financialResponsibleEmail && (
            <span className="text-red-300 text-xs">
              {errors.financialResponsibleEmail.message}
            </span>
          )}

          <RadioInput
            label="*Endereço igual do aluno?"
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
        </>
      )}

      {financialResponsibleAddressEqualsStudent === "no" &&
        isStudentFinancialResponsible === "no" && (
        <>
          <RadioInput
            label="*Onde você mora?"
            name="financialResponsibleResidence"
            value={watch("financialResponsibleResidence")}
            options={[
              { id: "br", value: "brasil", label: "Brasil" },
              { id: "fora", value: "fora-do-brasil", label: "Fora do Brasil" },
            ]}
            register={register("financialResponsibleResidence", {
              validate: (value) => {
                if (
                  watch("financialResponsibleAddressEqualsStudent") === "no"
                ) {
                  return (value && value.trim() !== "") || "Campo obrigatório";
                }
                return true;
              },
            })}
          />
          {errors.financialResponsibleResidence && (
            <span className="text-red-300 text-xs">
              {errors.financialResponsibleResidence.message}
            </span>
          )}

          {financialResponsibleResidence === "brasil" && (
            <>
              <TextInput
                htmlFor="financialResponsibleCep"
                label="*Cep"
                placeholder="XX.XXX-XX"
                maxLength={10}
                error={!!errors.financialResponsibleCep}
                mask={cepMask}
                {...register("financialResponsibleCep", {
                  validate: (value) => {
                    if (
                      watch("financialResponsibleAddressEqualsStudent") === "no"
                    ) {
                      return (value && value.trim() !== "") ||
                        "Campo obrigatório";
                    }
                    return true;
                  },
                })}
              />
              {errors.financialResponsibleCep && (
                <span className="text-red-300 text-xs">
                  {errors.financialResponsibleCep.message}
                </span>
              )}
            </>
          )}

          <TextInput
            htmlFor="financialResponsibleAddress"
            label="Endereço completo do responsável financeiro"
            placeholder="Informe o nome da rua"
            disabled={disabledFields.address}
            {...register("financialResponsibleAddress")}
          />

          {financialResponsibleResidence === "brasil" && (
            <>
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
                label="*Bairro"
                disabled={disabledFields.neighborhood}
                error={!!errors.financialResponsibleResidenceNeighborhood}
                placeholder="Bairro"
                {...register("financialResponsibleResidenceNeighborhood", {
                  validate: (value) => {
                    if (
                      watch("financialResponsibleAddressEqualsStudent") === "no"
                    ) {
                      return (value && value.trim() !== "") ||
                        "Campo obrigatório";
                    }
                    return true;
                  },
                })}
              />
              {errors.financialResponsibleResidenceNeighborhood && (
                <span className="text-red-300 text-xs">
                  {errors.financialResponsibleResidenceNeighborhood.message}
                </span>
              )}

              <TextInput
                htmlFor="financialResponsibleCity"
                label="*Cidade"
                disabled={disabledFields.city}
                error={!!errors.financialResponsibleCity}
                placeholder="Cidade"
                {...register("financialResponsibleCity", {
                  validate: (value) => {
                    if (
                      watch("financialResponsibleAddressEqualsStudent") === "no"
                    ) {
                      return (value && value.trim() !== "") ||
                        "Campo obrigatório";
                    }
                    return true;
                  },
                })}
              />
              {errors.financialResponsibleCity && (
                <span className="text-red-300 text-xs">
                  {errors.financialResponsibleCity.message}
                </span>
              )}

              <TextInput
                htmlFor="financialResponsibleUf"
                label="*Uf"
                disabled={disabledFields.uf}
                error={!!errors.financialResponsibleUf}
                placeholder="Estado"
                {...register("financialResponsibleUf", {
                  validate: (value) => {
                    if (
                      watch("financialResponsibleAddressEqualsStudent") === "no"
                    ) {
                      return (value && value.trim() !== "") ||
                        "Campo obrigatório";
                    }
                    return true;
                  },
                })}
              />
              {errors.financialResponsibleUf && (
                <span className="text-red-300 text-xs">
                  {errors.financialResponsibleUf.message}
                </span>
              )}
            </>
          )}
        </>
      )}
    </FormStepLayout>
  );
}
