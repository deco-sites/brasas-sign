import { useForm } from "react-hook-form";
import FormStepLayout from "../../components/ui/FormStepLayout.tsx";
import TextInput from "../../components/ui/TextInput.tsx";
import RadioInput from "../../components/ui/RadioInput.tsx";
import SelectInput from "../../components/ui/SelectInput.tsx";
import { useEffect, useState } from "preact/hooks";
import { getCep } from "../../services/cep.ts";
import { cepMask } from "../../helpers/cepMask.ts";
import { useWatch } from "react-hook-form";

export default function Step2(
  { step, stepList, goToNextStep, goToPreviousStep, goToStep, form },
) {
  const { register, watch, setValue } = form;
  const options = [
    { id: 1, value: "Option 1" },
    { id: 2, value: "Option 2" },
  ];

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
        console.log("entrou aqui ó", response);
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
      <TextInput
        htmlFor="cep"
        label="Cep"
        placeholder="XX.XXX-XX"
        maxLength={10}
        mask={cepMask}
        {...register("cep")}
      />

      <TextInput
        htmlFor="address"
        label="Endereço"
        disabled={disabledFields.address}
        placeholder="Informe o nome da rua"
        {...register("address")}
      />

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
        label="Bairro"
        placeholder="Bairro"
        disabled={disabledFields.neighborhood}
        {...register("neighborhood")}
      />

      <TextInput
        htmlFor="city"
        label="Cidade"
        disabled={disabledFields.city}
        placeholder="Cidade"
        {...register("city")}
      />

      <TextInput
        htmlFor="uf"
        label="Uf"
        disabled={disabledFields.uf}
        placeholder="Estado"
        {...register("uf")}
      />

      <SelectInput
        name="branches"
        label="Unidades"
        options={options}
        value={watch("branches")}
        placeholder="Selecione uma opção"
        register={register("branches")}
        setValue={setValue}
      />

      <RadioInput
        label="Qual o módulo desejado?"
        name="module"
        value={watch("module")}
        options={[
          { id: "presencial", value: "presencial", label: "Presencial" },
          { id: "online", value: "online", label: "Online" },
        ]}
        register={register("module")}
      />
    </FormStepLayout>
  );
}
