import { useForm } from "react-hook-form";
import FormStepLayout from "../../components/ui/FormStepLayout.tsx";
import TextInput from "../../components/ui/TextInput.tsx";
import RadioInput from "../../components/ui/RadioInput.tsx";
import SelectInput from "../../components/ui/SelectInput.tsx";
import { useEffect, useState } from "preact/hooks";
import { getCep } from "../../services/cep.ts";
import { cepMask } from "../../helpers/cepMask.ts";
import { useWatch } from "react-hook-form";
import { useUnits } from "../../contexts/UnitsContext.tsx";
import { useTranslations } from "../../sdk/useTranslations.ts";
import { Step2Data } from "../../data/Step2/Step2Data.ts";

export default function Step2(
  { step, stepList, goToNextStep, goToPreviousStep, goToStep, form },
) {
  const { units } = useUnits();
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    setBranches(
      units?.map((unit, index) => ({
        id: unit.id,
        value: unit.internal_name,
      })),
    );
  }, [units]);

  const { register, watch, setValue, formState: { errors } } = form;
  const residence = watch("residence");
  const courseType = watch("courseType");

  useEffect(() => {
    if (courseType === "pff") {
      setValue("module", "online");
    }
  }, [courseType, setValue]);

  const cep = useWatch({ control: form.control, name: "cep" });
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

      setValue("address", "");
      setValue("neighborhood", "");
      setValue("city", "");
      setValue("uf", "");
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

        setValue("address", "");
        setValue("neighborhood", "");
        setValue("city", "");
        setValue("uf", "");
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

    setValue("address", viaCepReturn.logradouro || "");
    setValue("neighborhood", viaCepReturn.bairro || "");
    setValue("city", viaCepReturn.localidade || "");
    setValue("uf", viaCepReturn.uf || "");
  }, [viaCepReturn, viaCepLoaded, setValue]);

  const data = useTranslations(Step2Data);

  return (
    <FormStepLayout
      steps={stepList}
      currentStep={step}
      goToNextStep={goToNextStep}
      goToPreviousStep={goToPreviousStep}
      goToStep={goToStep}
    >
      {residence === "brasil" && (
        <>
          <TextInput
            htmlFor="cep"
            label={data.cep.label}
            placeholder={data.cep.placeholder}
            maxLength={10}
            error={errors.cep}
            mask={cepMask}
            {...register("cep", { required: data.cep.requiredError })}
          />
          {errors.cep && (
            <span className="text-red-300 text-xs">
              {errors.cep.message}
            </span>
          )}
        </>
      )}

      <TextInput
        htmlFor="address"
        label={data.address.label}
        disabled={disabledFields.address}
        placeholder={data.address.placeholder}
        {...register("address")}
      />

      {residence === "brasil" && (
        <>
          <TextInput
            htmlFor="number"
            label={data.number.label}
            placeholder={data.number.placeholder}
            {...register("number")}
          />

          <TextInput
            htmlFor="complement"
            label={data.complement.label}
            placeholder={data.complement.placeholder}
            {...register("complement")}
          />

          <TextInput
            htmlFor="neighborhood"
            label={data.neighborhood.label}
            placeholder={data.neighborhood.placeholder}
            error={errors.neighborhood}
            disabled={disabledFields.neighborhood}
            {...register("neighborhood", {
              required: data.neighborhood.requiredError,
            })}
          />
          {errors.neighborhood && (
            <span className="text-red-300 text-xs">
              {errors.neighborhood.message}
            </span>
          )}

          <TextInput
            htmlFor="city"
            label={data.city.label}
            disabled={disabledFields.city}
            error={errors.city}
            placeholder={data.city.placeholder}
            {...register("city", { required: data.city.requiredError })}
          />
          {errors.city && (
            <span className="text-red-300 text-xs">
              {errors.city.message}
            </span>
          )}

          <TextInput
            htmlFor="uf"
            label={data.uf.label}
            disabled={disabledFields.uf}
            error={errors.uf}
            placeholder={data.uf.placeholder}
            {...register("uf", { required: data.uf.requiredError })}
          />
          {errors.uf && (
            <span className="text-red-300 text-xs">
              {errors.uf.message}
            </span>
          )}
        </>
      )}

      {courseType !== "pff" && (
        <>
          <SelectInput
            name="branches"
            label={data.branches.label}
            options={branches}
            value={watch("branches")}
            error={errors.branches}
            placeholder={data.branches.placeholder}
            register={register("branches", {
              required: data.branches.requiredError,
            })}
            setValue={setValue}
          />
          {errors.branches && (
            <span className="text-red-300 text-xs">
              {errors.branches.message}
            </span>
          )}
        </>
      )}

      <RadioInput
        label={data.module.label}
        name="module"
        value={watch("module")}
        options={[
          {
            id: "presencial",
            value: "presencial",
            label: data.module.options[0],
          },
          { id: "online", value: "online", label: data.module.options[1] },
        ]}
        register={register("module", { required: data.module.requiredError })}
        disabledOptions={courseType === "pff" ? ["presencial"] : []}
      />
      {errors.module && (
        <span className="text-red-300 text-xs">
          {errors.module.message}
        </span>
      )}
    </FormStepLayout>
  );
}
