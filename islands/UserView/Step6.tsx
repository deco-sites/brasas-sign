import { useEffect, useRef } from "preact/hooks";
import FormStepLayout from "../../components/ui/FormStepLayout.tsx";
import RadioInput from "../../components/ui/RadioInput.tsx";
import SignatureCanvas from "react-signature-canvas";
import { regulationsPT } from "../../data/regulationsPT.ts";
import { regulationsEN } from "../../data/regulationsEN.ts";
import { Step6Data } from "../../data/Step6/Step6Data.ts";
import { useTranslations } from "../../sdk/useTranslations.ts";
import { useLanguage } from "../../sdk/useLanguage.ts";

export default function Step6(
  { step, stepList, goToNextStep, goToPreviousStep, goToStep, form },
) {
  const { register, watch, setValue } = form;

  useEffect(() => {
    register("signature", { required: true });
    register("signatureData", { required: false });
    register("agree", { required: true });
  }, [register]);

  const sigCanvas = useRef(null);
  const moduleType = watch("module");
  const courseType = watch("courseType");
  const signature = watch("signature");
  const signatureData = watch("signatureData");
  const agree = watch("agree");

  // Salva a assinatura no form
  const handleEndSign = () => {
    const base64 = sigCanvas.current
      .getTrimmedCanvas()
      .toDataURL("image/png");
    const data = sigCanvas.current.toData();

    setValue("signature", base64, { shouldValidate: true });
    setValue("signatureData", data, { shouldValidate: false });
  };

  // Limpa a assinatura
  const handleCleanSign = (e) => {
    e.preventDefault();
    sigCanvas.current.clear();
    setValue("signature", "", { shouldValidate: true });
    setValue("signatureData", null, { shouldValidate: false });
  };

  // Restaura a assinatura se o usuário voltar e avançar o step
  useEffect(() => {
    if (signatureData && sigCanvas.current) {
      sigCanvas.current.fromData(signatureData);
    }
    // executa apenas na montagem
  }, []);

  const data = useTranslations(Step6Data);
  const { language } = useLanguage();

  const getRegulation = () => {
    if (!moduleType) return "";

    if (courseType === "private") {
      if (language.value === "pt-br") {
        return regulationsPT["private"];
      }
      if (language.value === "en-us") {
        return regulationsEN["private"];
      }
    }

    if (courseType === "pff") {
      if (language.value === "pt-br") {
        return regulationsPT["pff"];
      }
      if (language.value === "en-us") {
        return regulationsEN["pff"];
      }
    }

    if (language.value === "pt-br") {
      return regulationsPT[moduleType];
    }

    if (language.value === "en-us") {
      return regulationsEN[moduleType];
    }

    return "";
  };

  return (
    <FormStepLayout
      steps={stepList}
      currentStep={step}
      goToNextStep={goToNextStep}
      goToPreviousStep={goToPreviousStep}
      goToStep={goToStep}
      isSubmitDisabled={!signature || !agree}
    >
      <RadioInput
        label={data.imageAuth.label}
        name="imageAuth"
        value={watch("imageAuth")}
        options={[
          { id: "yes", value: "yes", label: data.imageAuth.options[0] },
          { id: "no", value: "no", label: data.imageAuth.options[1] },
        ]}
        register={register("imageAuth")}
      />

      <hr className="h-[1px] bg-black-500 border-0" />

      <span>
        {data.objectiveText}
      </span>

      <hr className="h-[1px] bg-black-500 border-0" />

      {/*O regulamento só aparece quando o módulo é escolhido (ou presencial ou online) e muda de acordo com a opção escolhida*/}
      <label>{data.regulationTitle}</label>
      <textarea
        className="rounded-sm h-80"
        value={getRegulation()}
        readOnly
      />

      <label
        htmlFor="agree"
        className="flex items-center gap-2 cursor-pointer"
      >
        <input
          type="checkbox"
          id="agree"
          {...register("agree")}
          className="accent-blue-600 w-5 h-5 cursor-pointer"
        />

        <span className="text-sm text-gray-800">
          {data.agreeText}
        </span>
      </label>

      <SignatureCanvas
        ref={sigCanvas}
        penColor="blue"
        onEnd={handleEndSign}
        canvasProps={{
          className:
            "h-[400px] border border-black-500 border-dashed rounded-sm",
          style: { willChange: "transform" },
        }}
      />
      <div className="flex w-full justify-between">
        <span className="text-gray-500 text-xs font-light">
          {data.signAbove}
        </span>
        <button
          onClick={handleCleanSign}
          className="text-gray-500 text-xs font-light cursor-pointer"
        >
          {data.cleanSign}
        </button>
      </div>
    </FormStepLayout>
  );
}
