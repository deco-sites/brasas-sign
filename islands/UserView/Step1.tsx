import FormStepLayout from "../../components/ui/FormStepLayout.tsx";
import SelectInput from "../../components/ui/SelectInput.tsx";
import TextInput from "../../components/ui/TextInput.tsx";
import RadioInput from "../../components/ui/RadioInput.tsx";
import MultiInput from "../../components/ui/MultiInput.tsx";
import { phoneMask } from "../../helpers/phoneMask.ts";
import { useEffect, useState } from "preact/hooks";
import { cpfMask } from "../../helpers/cpfMask.ts";
import { textMask } from "../../helpers/textMask.ts";
import { useTranslations } from "../../sdk/useTranslations.ts";
import { Step1Data } from "../../data/Step1/Step1Data.ts";

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

  const data = useTranslations(Step1Data);

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
        label={data.whereDoYouLive.label}
        name="residence"
        value={watch("residence")}
        options={[
          { id: "br", value: "brasil", label: data.whereDoYouLive.options[0] },
          {
            id: "fora",
            value: "fora-do-brasil",
            label: data.whereDoYouLive.options[1],
          },
        ]}
        register={register("residence", {
          required: data.whereDoYouLive.requiredError,
        })}
      />
      {errors.residence && (
        <span className="text-red-300 text-xs">
          {errors.residence.message}
        </span>
      )}

      <TextInput
        required
        htmlFor="schoolOrCompany"
        label={data.schoolCompany.label}
        placeholder={data.schoolCompany.placeholder}
        {...register("schoolOrCompany")}
      />

      <TextInput
        htmlFor="fullName"
        label={data.fullName.label}
        error={errors.fullName}
        mask={textMask}
        placeholder={data.fullName.placeholder}
        {...register("fullName", {
          required: data.fullName.requiredError,
        })}
      />
      {errors.fullName && (
        <span className="text-red-300 text-xs">
          {errors.fullName.message}
        </span>
      )}

      <TextInput
        htmlFor="email"
        label={data.email.label}
        error={errors.email}
        placeholder={data.email.placeholder}
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
        label={data.phone.label}
        placeholder={data.phone.placeholder}
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
        label={data.birthDate.label}
        error={errors.birthDate}
        placeholder={data.birthDate.placeholder}
        {...register("birthDate", { required: data.birthDate.error })}
      />
      {errors.birthDate && (
        <span className="text-red-300 text-xs">
          {errors.birthDate.message}
        </span>
      )}

      <TextInput
        htmlFor="cpf"
        label={!residence ? "*CPF" : residence === "brasil" ? "*CPF" : "CPF"}
        note={residence === "brasil" ? false : data.cpf.warning}
        mask={cpfMask}
        minLength={14}
        error={errors.cpf}
        placeholder={data.cpf.placeholder}
        {...register("cpf", {
          required: residence === "brasil" ? "Informe o CPF" : false,
          minLength: {
            value: 14,
            message: data.cpf.error,
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
        label={data.originCountry.label}
        options={countries}
        value={watch("country")}
        error={errors.country}
        placeholder={data.originCountry.placeholder}
        register={register("country", {
          required: data.originCountry.placeholder,
        })}
        setValue={setValue}
      />
      {errors.country && (
        <span className="text-red-300 text-xs">
          {errors.country.message}
        </span>
      )}

      <MultiInput
        htmlFor="languages"
        label={data.languages.label}
        placeholder={data.languages.placeholder}
        //onChangeValues={(values) => {console.log(values)}}
        setValue={setValue}
        getValues={getValues}
      />
    </FormStepLayout>
  );
}
