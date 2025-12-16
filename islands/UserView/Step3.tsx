import FormStepLayout from "../../components/ui/FormStepLayout.tsx";
import RadioInput from "../../components/ui/RadioInput.tsx";
import { useEffect, useState } from "preact/hooks";
import TextInput from "../../components/ui/TextInput.tsx";
import { phoneMask } from "../../helpers/phoneMask.ts";
import { cepMask } from "../../helpers/cepMask.ts";
import { useWatch } from "react-hook-form";
import { getCep } from "../../services/cep.ts";
import { Step3Data } from "../../data/Step3/Step3Data.ts";
import { useTranslations } from "../../sdk/useTranslations.ts";
import { cpfMask } from "../../helpers/cpfMask.ts";
import { cnpjMask } from "../../helpers/cnpjMask.ts";

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

  const data = useTranslations(Step3Data);

  return (
    <FormStepLayout
      steps={stepList}
      currentStep={step}
      goToNextStep={goToNextStep}
      goToPreviousStep={goToPreviousStep}
      goToStep={goToStep}
    >
      <RadioInput
        label={data.isStudentFinancialResponsible.label}
        name="isStudentFinancialResponsible"
        value={watch("isStudentFinancialResponsible")}
        options={[
          {
            id: "yes",
            value: "yes",
            label: data.isStudentFinancialResponsible.options[0],
          },
          {
            id: "no",
            value: "no",
            label: data.isStudentFinancialResponsible.options[1],
          },
        ]}
        register={register("isStudentFinancialResponsible", {
          required: data.isStudentFinancialResponsible.requiredError,
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
            label={data.financialResponsiblePersonType.label}
            name="financialResponsiblePersonType"
            value={watch("financialResponsiblePersonType")}
            options={[
              {
                id: "pf",
                value: "pf",
                label: data.financialResponsiblePersonType.options[0],
              },
              {
                id: "pj",
                value: "pj",
                label: data.financialResponsiblePersonType.options[1],
              },
            ]}
            register={register("financialResponsiblePersonType", {
              validate: (value) => {
                if (watch("isStudentFinancialResponsible") === "no") {
                  return (value && value.trim() !== "") ||
                    data.financialResponsiblePersonType.requiredError;
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
              ? data.financialResponsibleName.labelPj
              : data.financialResponsibleName.labelPf}
            placeholder={financialResponsiblePersonType === "pj"
              ? data.financialResponsibleName.placeholderPj
              : data.financialResponsibleName.placeholderPf}
            error={!!errors.financialResponsibleName}
            {...register("financialResponsibleName", {
              validate: (value) => {
                if (watch("isStudentFinancialResponsible") === "no") {
                  return (value && value.trim() !== "") ||
                    data.financialResponsibleName.requiredError;
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

          {financialResponsiblePersonType !== "pj" && (
            <>
              <TextInput
                htmlFor="financialResponsibleKinship"
                label={data.financialResponsibleKinship.label}
                error={!!errors.financialResponsibleKinship}
                placeholder={data.financialResponsibleKinship.placeholder}
                {...register("financialResponsibleKinship", {
                  validate: (value) => {
                    if (watch("isStudentFinancialResponsible") === "no") {
                      return (value && value.trim() !== "") ||
                        data.financialResponsibleKinship.requiredError;
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
                label={data.financialResponsibleBirthDate.label}
                placeholder={data.financialResponsibleBirthDate.placeholder}
                error={!!errors.financialResponsibleBirthDate}
                {...register("financialResponsibleBirthDate", {
                  validate: (value) => {
                    if (watch("isStudentFinancialResponsible") === "no") {
                      return (value && value.trim() !== "") ||
                        data.financialResponsibleBirthDate.requiredError;
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
            </>
          )}

          <TextInput
            htmlFor="financialResponsibleCpf"
            mask={financialResponsiblePersonType === "pj" ? cnpjMask : cpfMask}
            minLength={financialResponsiblePersonType === "pj" ? 18 : 14}
            label={financialResponsiblePersonType === "pj"
              ? data.financialResponsibleCpf.labelPj
              : data.financialResponsibleCpf.labelPf}
            note={financialResponsiblePersonType === "pj"
              ? false
              : data.financialResponsibleCpf.note}
            error={!!errors.financialResponsibleCpf}
            placeholder={financialResponsiblePersonType === "pj"
              ? data.financialResponsibleCpf.placeholderPj
              : data.financialResponsibleCpf.placeholderPf}
            {...register("financialResponsibleCpf", {
              minLength: {
                value: financialResponsiblePersonType === "pf" ? 14 : 18,
                message: financialResponsiblePersonType === "pj"
                  ? data.financialResponsibleCpf.lengthErrorPj
                  : data.financialResponsibleCpf.lengthErrorPf,
              },
              validate: (value) => {
                if (watch("isStudentFinancialResponsible") === "no") {
                  return (value && value.trim() !== "") ||
                    data.financialResponsibleCpf.requiredError;
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

          {financialResponsiblePersonType !== "pj" && (
            <>
              <TextInput
                htmlFor="financialResponsiblePhone"
                label={data.financialResponsiblePhone.label}
                placeholder={data.financialResponsiblePhone.placeholder}
                error={!!errors.financialResponsiblePhone}
                mask={phoneMask}
                {...register("financialResponsiblePhone", {
                  validate: (value) => {
                    if (watch("isStudentFinancialResponsible") === "no") {
                      return (value && value.trim() !== "") ||
                        data.financialResponsiblePhone.requiredError;
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
                label={data.financialResponsibleEmail.label}
                error={!!errors.financialResponsibleEmail}
                placeholder={data.financialResponsibleEmail.placeholder}
                {...register("financialResponsibleEmail", {
                  validate: (value) => {
                    if (
                      watch("isStudentFinancialResponsible") === "no"
                    ) {
                      return (value && value.trim() !== "") ||
                        data.financialResponsibleEmail.requiredError;
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
                label={data.financialResponsibleAddressEqualsStudent.label}
                name="financialResponsibleAddressEqualsStudent"
                value={watch("financialResponsibleAddressEqualsStudent")}
                options={[
                  {
                    id: "yes",
                    value: "yes",
                    label:
                      data.financialResponsibleAddressEqualsStudent.options[0],
                  },
                  {
                    id: "no",
                    value: "no",
                    label:
                      data.financialResponsibleAddressEqualsStudent.options[1],
                  },
                ]}
                register={register("financialResponsibleAddressEqualsStudent", {
                  required:
                    data.financialResponsibleAddressEqualsStudent.requiredError,
                })}
              />
              {errors.financialResponsibleAddressEqualsStudent && (
                <span className="text-red-300 text-xs">
                  {errors.financialResponsibleAddressEqualsStudent.message}
                </span>
              )}
            </>
          )}

          {financialResponsiblePersonType === "pj" && (
            <>
              <TextInput
                htmlFor="financialResponsibleFantasyName"
                label={data.financialResponsibleFantasyName.label}
                placeholder={data.financialResponsibleFantasyName.placeholder}
                error={!!errors.financialResponsibleFantasyName}
                {...register("financialResponsibleFantasyName", {
                  validate: (value) => {
                    if (watch("isStudentFinancialResponsible") === "no") {
                      return (value && value.trim() !== "") ||
                        data.financialResponsibleFantasyName.requiredError;
                    }
                    return true;
                  },
                })}
              />
              {errors.financialResponsibleFantasyName && (
                <span className="text-red-300 text-xs">
                  {errors.financialResponsibleFantasyName.message}
                </span>
              )}
            </>
          )}
        </>
      )}

      {financialResponsibleAddressEqualsStudent === "no" &&
        isStudentFinancialResponsible === "no" && (
        <>
          <RadioInput
            label={data.financialResponsibleResidence.label}
            name="financialResponsibleResidence"
            value={watch("financialResponsibleResidence")}
            options={[
              {
                id: "br",
                value: "brasil",
                label: data.financialResponsibleResidence.options[0],
              },
              {
                id: "fora",
                value: "fora-do-brasil",
                label: data.financialResponsibleResidence.options[1],
              },
            ]}
            register={register("financialResponsibleResidence", {
              validate: (value) => {
                if (
                  watch("financialResponsibleAddressEqualsStudent") === "no"
                ) {
                  return (value && value.trim() !== "") ||
                    data.financialResponsibleResidence.requiredError;
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
                label={data.financialResponsibleCep.label}
                placeholder={data.financialResponsibleCep.placeholder}
                maxLength={10}
                minLength={10}
                error={!!errors.financialResponsibleCep}
                mask={cepMask}
                {...register("financialResponsibleCep", {
                  validate: (value) => {
                    if (
                      watch("financialResponsibleAddressEqualsStudent") === "no"
                    ) {
                      return (value && value.trim() !== "") ||
                        data.financialResponsibleCep.requiredError;
                    }
                    return true;
                  },
                  minLength: {
                    value: 10,
                    message: data.financialResponsibleCep.error,
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
            label={data.financialResponsibleAddress.label}
            placeholder={data.financialResponsibleAddress.placeholder}
            disabled={disabledFields.address}
            {...register("financialResponsibleAddress")}
          />

          {financialResponsibleResidence === "brasil" && (
            <>
              <TextInput
                htmlFor="financialResponsibleResidenceNumber"
                label={data.financialResponsibleResidenceNumber.label}
                placeholder={data.financialResponsibleResidenceNumber
                  .placeholder}
                {...register("financialResponsibleResidenceNumber")}
              />

              <TextInput
                htmlFor="financialResponsibleResidenceComplement"
                label={data.financialResponsibleResidenceComplement.label}
                placeholder={data.financialResponsibleResidenceComplement
                  .placeholder}
                {...register("financialResponsibleResidenceComplement")}
              />

              <TextInput
                htmlFor="financialResponsibleResidenceNeighborhood"
                label={data.financialResponsibleResidenceNeighborhood.label}
                disabled={disabledFields.neighborhood}
                error={!!errors.financialResponsibleResidenceNeighborhood}
                placeholder={data.financialResponsibleResidenceNeighborhood
                  .placeholder}
                {...register("financialResponsibleResidenceNeighborhood", {
                  validate: (value) => {
                    if (
                      watch("financialResponsibleAddressEqualsStudent") === "no"
                    ) {
                      return (value && value.trim() !== "") ||
                        data.financialResponsibleResidenceNeighborhood
                          .requiredError;
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
                label={data.financialResponsibleCity.label}
                disabled={disabledFields.city}
                error={!!errors.financialResponsibleCity}
                placeholder={data.financialResponsibleCity.placeholder}
                {...register("financialResponsibleCity", {
                  validate: (value) => {
                    if (
                      watch("financialResponsibleAddressEqualsStudent") === "no"
                    ) {
                      return (value && value.trim() !== "") ||
                        data.financialResponsibleCity.requiredError;
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
                label={data.financialResponsibleUf.label}
                disabled={disabledFields.uf}
                error={!!errors.financialResponsibleUf}
                placeholder={data.financialResponsibleUf.placeholder}
                {...register("financialResponsibleUf", {
                  validate: (value) => {
                    if (
                      watch("financialResponsibleAddressEqualsStudent") === "no"
                    ) {
                      return (value && value.trim() !== "") ||
                        data.financialResponsibleUf.requiredError;
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
