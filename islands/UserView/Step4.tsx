import { useEffect, useState } from "preact/hooks";
import FormStepLayout from "../../components/ui/FormStepLayout.tsx";
import RadioInput from "../../components/ui/RadioInput.tsx";
import TextInput from "../../components/ui/TextInput.tsx";
import { cepMask } from "../../helpers/cepMask.ts";
import { phoneMask } from "../../helpers/phoneMask.ts";
import { useWatch } from "react-hook-form";
import { getCep } from "../../services/cep.ts";

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
  const pedagogicalResponsibleResidence = watch(
    "pedagogicalResponsibleResidence",
  );
  const pedagogicalResponsiblePersonType = watch(
    "pedagogicalResponsiblePersonType",
  );
  const cep = useWatch({
    control: form.control,
    name: "pedagogicalResponsibleCep",
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

      setValue("pedagogicalResponsibleAddress", "");
      setValue("pedagogicalResponsibleResidenceNeighborhood", "");
      setValue("pedagogicalResponsibleCity", "");
      setValue("pedagogicalResponsibleUf", "");
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

        setValue("pedagogicalResponsibleAddress", "");
        setValue("pedagogicalResponsibleResidenceNeighborhood", "");
        setValue("pedagogicalResponsibleCity", "");
        setValue("pedagogicalResponsibleUf", "");
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

    setValue("pedagogicalResponsibleAddress", viaCepReturn.logradouro || "");
    setValue(
      "pedagogicalResponsibleResidenceNeighborhood",
      viaCepReturn.bairro || "",
    );
    setValue("pedagogicalResponsibleCity", viaCepReturn.localidade || "");
    setValue("pedagogicalResponsibleUf", viaCepReturn.uf || "");
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
        label="*O próprio aluno é responsável pedagógico?"
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
            label="*Tipo de pessoa do responsável pedagógico"
            name="pedagogicalResponsiblePersonType"
            value={watch("pedagogicalResponsiblePersonType")}
            options={[
              { id: "pf", value: "pf", label: "Pessoa Fìsica" },
              { id: "pj", value: "pj", label: "Pessoa Jurídica" },
            ]}
            register={register("pedagogicalResponsiblePersonType", {
              validate: (value) => {
                if (
                  watch("isStudentPedagogicalResponsible") === "no"
                ) {
                  return (value && value.trim() !== "") || "Campo obrigatório";
                }
                return true;
              },
            })}
          />
          {errors.pedagogicalResponsiblePersonType && (
            <span className="text-red-300 text-xs">
              {errors.pedagogicalResponsiblePersonType.message}
            </span>
          )}

          <TextInput
            htmlFor="pedagogicalResponsibleName"
            label={pedagogicalResponsiblePersonType === "pj"
              ? "*Razão social do responsável pedagógico"
              : "*Nome completo do responsável pedagógico"}
            placeholder={pedagogicalResponsiblePersonType === "pj"
              ? "Informe a razão social do responsável pedagógico"
              : "Informe o nome completo do responsável pedagógico"}
            error={!!errors.pedagogicalResponsibleName}
            {...register("pedagogicalResponsibleName", {
              validate: (value) => {
                if (
                  watch("isStudentPedagogicalResponsible") === "no"
                ) {
                  return (value && value.trim() !== "") || "Campo obrigatório";
                }
                return true;
              },
            })}
          />
          {errors.pedagogicalResponsibleName && (
            <span className="text-red-300 text-xs">
              {errors.pedagogicalResponsibleName.message}
            </span>
          )}

          <TextInput
            htmlFor="pedagogicalResponsibleKinship"
            label="*Parentesco"
            placeholder="Informe o parentesco com o responsável pedagógico"
            error={!!errors.pedagogicalResponsibleKinship}
            {...register("pedagogicalResponsibleKinship", {
              validate: (value) => {
                if (
                  watch("isStudentPedagogicalResponsible") === "no"
                ) {
                  return (value && value.trim() !== "") || "Campo obrigatório";
                }
                return true;
              },
            })}
          />
          {errors.pedagogicalResponsibleKinship && (
            <span className="text-red-300 text-xs">
              {errors.pedagogicalResponsibleKinship.message}
            </span>
          )}

          <TextInput
            type="date"
            htmlFor="pedagogicalResponsibleBirthDate"
            label="*Data de nascimento"
            placeholder="DD/MM/YYYY"
            error={!!errors.pedagogicalResponsibleBirthDate}
            {...register("pedagogicalResponsibleBirthDate", {
              validate: (value) => {
                if (
                  watch("isStudentPedagogicalResponsible") === "no"
                ) {
                  return (value && value.trim() !== "") || "Campo obrigatório";
                }
                return true;
              },
            })}
          />
          {errors.pedagogicalResponsibleBirthDate && (
            <span className="text-red-300 text-xs">
              {errors.pedagogicalResponsibleBirthDate.message}
            </span>
          )}

          <TextInput
            htmlFor="pedagogicalResponsibleCpf"
            label={pedagogicalResponsiblePersonType === "pj" ? "CNPJ" : "CPF"}
            note={pedagogicalResponsiblePersonType === "pj"
              ? false
              : "O CPF é um documento brasileiro e não é obrigatório para o preenchimento do formulário"}
            placeholder={pedagogicalResponsiblePersonType === "pj"
              ? "Informe o CNPJ do responsável financeiro"
              : "Informe o CPF do responsável financeiro"}
            error={!!errors.pedagogicalResponsibleCpf}
            {...register("pedagogicalResponsibleCpf", {
              validate: (value) => {
                if (
                  watch("isStudentPedagogicalResponsible") === "no"
                ) {
                  return (value && value.trim() !== "") || "Campo obrigatório";
                }
                return true;
              },
            })}
          />
          {errors.pedagogicalResponsibleCpf && (
            <span className="text-red-300 text-xs">
              {errors.pedagogicalResponsibleCpf.message}
            </span>
          )}

          <TextInput
            htmlFor="pedagogicalResponsiblePhone"
            label="*Telefone"
            placeholder="(XX) XXXXX-XXXX"
            mask={phoneMask}
            error={!!errors.pedagogicalResponsiblePhone}
            {...register("pedagogicalResponsiblePhone", {
              validate: (value) => {
                if (
                  watch("isStudentPedagogicalResponsible") === "no"
                ) {
                  return (value && value.trim() !== "") || "Campo obrigatório";
                }
                return true;
              },
            })}
          />
          {errors.pedagogicalResponsiblePhone && (
            <span className="text-red-300 text-xs">
              {errors.pedagogicalResponsiblePhone.message}
            </span>
          )}

          <TextInput
            htmlFor="pedagogicalResponsibleEmail"
            label="*E-mail"
            error={!!errors.pedagogicalResponsibleEmail}
            placeholder="Insira seu e-mail"
            {...register("pedagogicalResponsibleEmail", {
              validate: (value) => {
                if (
                  watch("isStudentPedagogicalResponsible") === "no"
                ) {
                  return (value && value.trim() !== "") || "Campo obrigatório";
                }
                return true;
              },
            })}
          />
          {errors.pedagogicalResponsibleEmail && (
            <span className="text-red-300 text-xs">
              {errors.pedagogicalResponsibleEmail.message}
            </span>
          )}

          <RadioInput
            label="*Endereço igual do aluno?"
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
        </>
      )}

      {pedagogicalResponsibleAddressEqualsStudent === "no" &&
        isStudentPedagogicalResponsible === "no" && (
        <>
          <RadioInput
            label="*Onde você mora?"
            name="pedagogicalResponsibleResidence"
            value={watch("pedagogicalResponsibleResidence")}
            options={[
              { id: "br", value: "brasil", label: "Brasil" },
              {
                id: "fora",
                value: "fora-do-brasil",
                label: "Fora do Brasil",
              },
            ]}
            register={register("pedagogicalResponsibleResidence", {
              validate: (value) => {
                if (
                  watch("pedagogicalResponsibleAddressEqualsStudent") ===
                    "no"
                ) {
                  return (value && value.trim() !== "") ||
                    "Campo obrigatório";
                }
                return true;
              },
            })}
          />
          {errors.pedagogicalResponsibleResidence && (
            <span className="text-red-300 text-xs">
              {errors.pedagogicalResponsibleResidence.message}
            </span>
          )}

          {pedagogicalResponsibleResidence === "brasil" && (
            <>
              <TextInput
                htmlFor="pedagogicalResponsibleCep"
                label="*Cep"
                placeholder="XX.XXX-XX"
                maxLength={10}
                mask={cepMask}
                error={!!errors.pedagogicalResponsibleCep}
                {...register("pedagogicalResponsibleCep", {
                  validate: (value) => {
                    if (
                      watch(
                        "pedagogicalResponsibleAddressEqualsStudent",
                      ) ===
                        "no"
                    ) {
                      return (value && value.trim() !== "") ||
                        "Campo obrigatório";
                    }
                    return true;
                  },
                })}
              />
              {errors.pedagogicalResponsibleCep && (
                <span className="text-red-300 text-xs">
                  {errors.pedagogicalResponsibleCep.message}
                </span>
              )}
            </>
          )}

          <TextInput
            htmlFor="pedagogicalResponsibleAddress"
            label="Endereço completo do responsável pedagógico"
            placeholder="Informe o nome da rua"
            disabled={disabledFields.address}
            {...register("pedagogicalResponsibleAddress")}
          />

          {pedagogicalResponsibleResidence === "brasil" && (
            <>
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
                label="*Bairro"
                placeholder="Bairro"
                disabled={disabledFields.neighborhood}
                error={!!errors.pedagogicalResponsibleResidenceNeighborhood}
                {...register(
                  "pedagogicalResponsibleResidenceNeighborhood",
                  {
                    validate: (value) => {
                      if (
                        watch(
                          "pedagogicalResponsibleAddressEqualsStudent",
                        ) ===
                          "no"
                      ) {
                        return (value && value.trim() !== "") ||
                          "Campo obrigatório";
                      }
                      return true;
                    },
                  },
                )}
              />
              {errors.pedagogicalResponsibleResidenceNeighborhood && (
                <span className="text-red-300 text-xs">
                  {errors.pedagogicalResponsibleResidenceNeighborhood
                    .message}
                </span>
              )}

              <TextInput
                htmlFor="pedagogicalResponsibleCity"
                label="*Cidade"
                disabled={disabledFields.city}
                error={!!errors.pedagogicalResponsibleCity}
                placeholder="Cidade"
                {...register("pedagogicalResponsibleCity", {
                  validate: (value) => {
                    if (
                      watch(
                        "pedagogicalResponsibleAddressEqualsStudent",
                      ) ===
                        "no"
                    ) {
                      return (value && value.trim() !== "") ||
                        "Campo obrigatório";
                    }
                    return true;
                  },
                })}
              />
              {errors.pedagogicalResponsibleCity && (
                <span className="text-red-300 text-xs">
                  {errors.pedagogicalResponsibleCity.message}
                </span>
              )}

              <TextInput
                htmlFor="pedagogicalResponsibleUf"
                label="*Uf"
                disabled={disabledFields.uf}
                error={!!errors.pedagogicalResponsibleUf}
                placeholder="Estado"
                {...register("pedagogicalResponsibleUf", {
                  validate: (value) => {
                    if (
                      watch(
                        "pedagogicalResponsibleAddressEqualsStudent",
                      ) ===
                        "no"
                    ) {
                      return (value && value.trim() !== "") ||
                        "Campo obrigatório";
                    }
                    return true;
                  },
                })}
              />
              {errors.pedagogicalResponsibleUf && (
                <span className="text-red-300 text-xs">
                  {errors.pedagogicalResponsibleUf.message}
                </span>
              )}
            </>
          )}
        </>
      )}
    </FormStepLayout>
  );
}
