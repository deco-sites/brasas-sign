import { useEffect, useRef } from "preact/hooks";
import FormStepLayout from "../../components/ui/FormStepLayout.tsx";
import RadioInput from "../../components/ui/RadioInput.tsx";
import SignatureCanvas from "react-signature-canvas";

export default function Step6(
  { step, stepList, goToNextStep, goToPreviousStep, goToStep, form },
) {
  const { register, watch, setValue } = form;
  const sigCanvas = useRef(null);

  return (
    <FormStepLayout
      steps={stepList}
      currentStep={step}
      goToNextStep={goToNextStep}
      goToPreviousStep={goToPreviousStep}
      goToStep={goToStep}
    >
      <RadioInput
        label="Autorizo o BRASAS English Course a utilizar-se, sem quaisquer ônus, da minha imagem para fins exclusivos de sua divulgação e de suas atividades, podendo, para tanto, reproduzi-la ou divulgá-la junto à internet, jornais e todos os meios de comunicação pública ou privada ficando desde já acordado que em nenhuma hipótese poderá a imagem ser utilizada de maneira contrária à moral ou aos bons costumes ou à ordem pública."
        name="residencia"
        value={watch("residencia")}
        options={[
          { id: "yes", value: "yes", label: "Sim" },
          { id: "no", value: "no", label: "Não" },
        ]}
        register={register("residencia")}
      />

      <hr className="h-[1px] bg-black-500 border-0" />

      <span>
        Com o objetivo de viabilizar a educação inclusiva e o aprendizado pleno
        do aluno, convidamos o aluno e/ou responsável, a se assim desejar,
        informar os recursos de acessibilidade necessários para a sua
        participação, conforme previsão legal do artigo 30, inciso II, da Lei
        13.146/2015, em caso de pessoa com deficiência
      </span>

      <hr className="h-[1px] bg-black-500 border-0" />

      {/*O regulamento só aparece quando o módulo é escolhido (ou presencial ou online) e muda de acordo com a opção escolhida*/}
      <label>Regulamento</label>
      <textarea className="rounded-sm" value="teste"></textarea>

      <label
        htmlFor="agree"
        className="flex items-center gap-2 cursor-pointer"
      >
        <input
          type="checkbox"
          id="agree"
          checked
          {...register}
          className="accent-blue-600 w-5 h-5 cursor-pointer"
        />
        <span className="text-sm text-gray-800">
          Concordo com os termos e condições
        </span>
      </label>

      <SignatureCanvas
        ref={sigCanvas}
        penColor="blue"
        canvasProps={{
          className:
            "h-[500px] border border-black-500 border-dashed rounded-sm",
          style: { willChange: "transform" },
        }}
      />
      <div className="flex w-full justify-between">
        <span className="text-gray-500 text-xs font-light">
          Assinatura acima
        </span>
        <span className="text-gray-500 text-xs font-light cursor-pointer">
          Limpar assinatura
        </span>
      </div>
    </FormStepLayout>
  );
}
