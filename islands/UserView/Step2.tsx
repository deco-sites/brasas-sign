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

export default function Step2(
  { step, stepList, goToNextStep, goToPreviousStep, goToStep, form },
) {
  const { units } = useUnits();
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    console.log("unidades", units);
    setBranches(
      units?.map((unit, index) => ({
        id: unit.id,
        value: unit.internal_name,
      })),
    );
  }, [units]);

  const { register, watch, setValue, formState: { errors } } = form;
  const residence = watch("residence");

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
            label="*Cep"
            placeholder="XX.XXX-XX"
            maxLength={10}
            error={errors.cep}
            mask={cepMask}
            {...register("cep", { required: "Informe o cep" })}
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
        label="Endereço"
        disabled={disabledFields.address}
        placeholder="Informe o nome da rua"
        {...register("address")}
      />

      {residence === "brasil" && (
        <>
          <TextInput
            htmlFor="number"
            label="Número"
            placeholder="Informe o número da residência"
            {...register("number")}
          />

          <TextInput
            htmlFor="complement"
            label="Complemento"
            placeholder="Possui complemento?"
            {...register("complement")}
          />

          <TextInput
            htmlFor="neighborhood"
            label="*Bairro"
            placeholder="Bairro"
            error={errors.neighborhood}
            disabled={disabledFields.neighborhood}
            {...register("neighborhood", { required: "Informe o bairro" })}
          />
          {errors.neighborhood && (
            <span className="text-red-300 text-xs">
              {errors.neighborhood.message}
            </span>
          )}

          <TextInput
            htmlFor="city"
            label="*Cidade"
            disabled={disabledFields.city}
            error={errors.city}
            placeholder="Cidade"
            {...register("city", { required: "Informe a cidade" })}
          />
          {errors.city && (
            <span className="text-red-300 text-xs">
              {errors.city.message}
            </span>
          )}

          <TextInput
            htmlFor="uf"
            label="*Uf"
            disabled={disabledFields.uf}
            error={errors.uf}
            placeholder="Estado"
            {...register("uf", { required: "Informe a UF" })}
          />
          {errors.uf && (
            <span className="text-red-300 text-xs">
              {errors.uf.message}
            </span>
          )}
        </>
      )}

      <SelectInput
        name="branches"
        label="*Unidade"
        options={branches}
        value={watch("branches")}
        error={errors.branches}
        placeholder="Selecione uma opção"
        register={register("branches", { required: "Selecione uma opção" })}
        setValue={setValue}
      />
      {errors.branches && (
        <span className="text-red-300 text-xs">
          {errors.branches.message}
        </span>
      )}

      <RadioInput
        label="*Qual o módulo desejado?"
        name="module"
        value={watch("module")}
        options={[
          { id: "presencial", value: "presencial", label: "Presencial" },
          { id: "online", value: "online", label: "Online" },
        ]}
        register={register("module", { required: "Selecione um módulo" })}
      />
      {errors.module && (
        <span className="text-red-300 text-xs">
          {errors.module.message}
        </span>
      )}
    </FormStepLayout>
  );
}
