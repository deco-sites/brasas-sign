import { useEffect, useState } from "preact/hooks";
import FormStepLayout from "../../components/ui/FormStepLayout.tsx";
import RadioInput from "../../components/ui/RadioInput.tsx";
import TextInput from "../../components/ui/TextInput.tsx";
import { cepMask } from "../../helpers/cepMask.ts";
import { phoneMask } from "../../helpers/phoneMask.ts";
import { useWatch } from "react-hook-form";
import { getCep } from "../../services/cep.ts";
import { Step4Data } from "../../data/Step4/Step4Data.ts";
import { useTranslations } from "../../sdk/useTranslations.ts";

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

  const data = useTranslations(Step4Data);

  return (
    <FormStepLayout
      steps={stepList}
      currentStep={step}
      goToNextStep={goToNextStep}
      goToPreviousStep={goToPreviousStep}
      goToStep={goToStep}
    >
      <RadioInput
        label={data.isStudentPedagogicalResponsible.label}
        name="isStudentPedagogicalResponsible"
        value={watch("isStudentPedagogicalResponsible")}
        options={[
          {
            id: "yes",
            value: "yes",
            label: data.isStudentPedagogicalResponsible.options[0],
          },
          {
            id: "no",
            value: "no",
            label: data.isStudentPedagogicalResponsible.options[1],
          },
        ]}
        register={register("isStudentPedagogicalResponsible", {
          required: data.isStudentPedagogicalResponsible.requiredError,
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
            label={data.pedagogicalResponsiblePersonType.label}
            name="pedagogicalResponsiblePersonType"
            value={watch("pedagogicalResponsiblePersonType")}
            options={[
              {
                id: "pf",
                value: "pf",
                label: data.pedagogicalResponsiblePersonType.options[0],
              },
              {
                id: "pj",
                value: "pj",
                label: data.pedagogicalResponsiblePersonType.options[1],
              },
            ]}
            register={register("pedagogicalResponsiblePersonType", {
              validate: (value) => {
                if (
                  watch("isStudentPedagogicalResponsible") === "no"
                ) {
                  return (value && value.trim() !== "") ||
                    data.pedagogicalResponsiblePersonType.requiredError;
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
              ? data.pedagogicalResponsibleName.labelPj
              : data.pedagogicalResponsibleName.labelPf}
            placeholder={pedagogicalResponsiblePersonType === "pj"
              ? data.pedagogicalResponsibleName.placeholderPj
              : data.pedagogicalResponsibleName.placeholderPf}
            error={!!errors.pedagogicalResponsibleName}
            {...register("pedagogicalResponsibleName", {
              validate: (value) => {
                if (
                  watch("isStudentPedagogicalResponsible") === "no"
                ) {
                  return (value && value.trim() !== "") ||
                    data.pedagogicalResponsibleName.requiredError;
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
            label={data.pedagogicalResponsibleKinship.label}
            placeholder={data.pedagogicalResponsibleKinship.placeholder}
            error={!!errors.pedagogicalResponsibleKinship}
            {...register("pedagogicalResponsibleKinship", {
              validate: (value) => {
                if (
                  watch("isStudentPedagogicalResponsible") === "no"
                ) {
                  return (value && value.trim() !== "") ||
                    data.pedagogicalResponsibleKinship.requiredError;
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
            label={data.pedagogicalResponsibleBirthDate.label}
            placeholder={data.pedagogicalResponsibleBirthDate.placeholder}
            error={!!errors.pedagogicalResponsibleBirthDate}
            {...register("pedagogicalResponsibleBirthDate", {
              validate: (value) => {
                if (
                  watch("isStudentPedagogicalResponsible") === "no"
                ) {
                  return (value && value.trim() !== "") ||
                    data.pedagogicalResponsibleBirthDate.requiredError;
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
            label={pedagogicalResponsiblePersonType === "pj"
              ? data.pedagogicalResponsibleCpf.labelPj
              : data.pedagogicalResponsibleCpf.labelPf}
            note={pedagogicalResponsiblePersonType === "pj"
              ? false
              : data.pedagogicalResponsibleCpf.note}
            placeholder={pedagogicalResponsiblePersonType === "pj"
              ? data.pedagogicalResponsibleCpf.placeholderPj
              : data.pedagogicalResponsibleCpf.placeholderPf}
            error={!!errors.pedagogicalResponsibleCpf}
            {...register("pedagogicalResponsibleCpf", {
              validate: (value) => {
                if (
                  watch("isStudentPedagogicalResponsible") === "no"
                ) {
                  return (value && value.trim() !== "") ||
                    data.pedagogicalResponsibleCpf.requiredError;
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
            label={data.pedagogicalResponsiblePhone.label}
            placeholder={data.pedagogicalResponsiblePhone.placeholder}
            mask={phoneMask}
            error={!!errors.pedagogicalResponsiblePhone}
            {...register("pedagogicalResponsiblePhone", {
              validate: (value) => {
                if (
                  watch("isStudentPedagogicalResponsible") === "no"
                ) {
                  return (value && value.trim() !== "") ||
                    data.pedagogicalResponsiblePhone.requiredError;
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
            label={data.pedagogicalResponsibleEmail.label}
            error={!!errors.pedagogicalResponsibleEmail}
            placeholder={data.pedagogicalResponsibleEmail.placeholder}
            {...register("pedagogicalResponsibleEmail", {
              validate: (value) => {
                if (
                  watch("isStudentPedagogicalResponsible") === "no"
                ) {
                  return (value && value.trim() !== "") ||
                    data.pedagogicalResponsibleEmail.requiredError;
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
            label={data.pedagogicalResponsibleAddressEqualsStudent.label}
            name="pedagogicalResponsibleAddressEqualsStudent"
            value={watch("pedagogicalResponsibleAddressEqualsStudent")}
            options={[
              {
                id: "yes",
                value: "yes",
                label:
                  data.pedagogicalResponsibleAddressEqualsStudent.options[0],
              },
              {
                id: "no",
                value: "no",
                label:
                  data.pedagogicalResponsibleAddressEqualsStudent.options[1],
              },
            ]}
            register={register("pedagogicalResponsibleAddressEqualsStudent", {
              required:
                data.pedagogicalResponsibleAddressEqualsStudent.requiredError,
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
            label={data.pedagogicalResponsibleResidence.label}
            name="pedagogicalResponsibleResidence"
            value={watch("pedagogicalResponsibleResidence")}
            options={[
              {
                id: "br",
                value: "brasil",
                label: data.pedagogicalResponsibleResidence.options[0],
              },
              {
                id: "fora",
                value: "fora-do-brasil",
                label: data.pedagogicalResponsibleResidence.options[1],
              },
            ]}
            register={register("pedagogicalResponsibleResidence", {
              validate: (value) => {
                if (
                  watch("pedagogicalResponsibleAddressEqualsStudent") ===
                    "no"
                ) {
                  return (value && value.trim() !== "") ||
                    data.pedagogicalResponsibleResidence.requiredError;
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
                label={data.pedagogicalResponsibleCep.label}
                placeholder={data.pedagogicalResponsibleCep.placeholder}
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
                        data.pedagogicalResponsibleCep.requiredError;
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
            label={data.pedagogicalResponsibleAddress.label}
            placeholder={data.pedagogicalResponsibleAddress.placeholder}
            disabled={disabledFields.address}
            {...register("pedagogicalResponsibleAddress")}
          />

          {pedagogicalResponsibleResidence === "brasil" && (
            <>
              <TextInput
                htmlFor="pedagogicalResponsibleResidenceNumber"
                label={data.pedagogicalResponsibleResidenceNumber.label}
                placeholder={data.pedagogicalResponsibleResidenceNumber
                  .placeholder}
                {...register("pedagogicalResponsibleResidenceNumber")}
              />

              <TextInput
                htmlFor="pedagogicalResponsibleResidenceComplement"
                label={data.pedagogicalResponsibleResidenceComplement.label}
                placeholder={data.pedagogicalResponsibleResidenceComplement
                  .placeholder}
                {...register("pedagogicalResponsibleResidenceComplement")}
              />

              <TextInput
                htmlFor="pedagogicalResponsibleResidenceNeighborhood"
                label={data.pedagogicalResponsibleResidenceNeighborhood.label}
                placeholder={data.pedagogicalResponsibleResidenceNeighborhood
                  .placeholder}
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
                          data.pedagogicalResponsibleResidenceNeighborhood
                            .requiredError;
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
                label={data.pedagogicalResponsibleCity.label}
                disabled={disabledFields.city}
                error={!!errors.pedagogicalResponsibleCity}
                placeholder={data.pedagogicalResponsibleCity.placeholder}
                {...register("pedagogicalResponsibleCity", {
                  validate: (value) => {
                    if (
                      watch(
                        "pedagogicalResponsibleAddressEqualsStudent",
                      ) ===
                        "no"
                    ) {
                      return (value && value.trim() !== "") ||
                        data.pedagogicalResponsibleCity.requiredError;
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
                label={data.pedagogicalResponsibleUf.label}
                disabled={disabledFields.uf}
                error={!!errors.pedagogicalResponsibleUf}
                placeholder={data.pedagogicalResponsibleUf.placeholder}
                {...register("pedagogicalResponsibleUf", {
                  validate: (value) => {
                    if (
                      watch(
                        "pedagogicalResponsibleAddressEqualsStudent",
                      ) ===
                        "no"
                    ) {
                      return (value && value.trim() !== "") ||
                        data.pedagogicalResponsibleUf.requiredError;
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
