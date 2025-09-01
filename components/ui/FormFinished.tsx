import Image from "apps/website/components/Image.tsx";
import Button from "./Button.tsx";
import { useFinishForm } from "../../sdk/useFinishForm.ts";
import { FormFinishedData } from "../../data/FormFinished/FormFinishedData.ts";
import { useTranslations } from "../../sdk/useTranslations.ts";

export default function FormFinished({ form, setStep }) {
  const { isFormFinished } = useFinishForm();
  const { reset } = form;
  const data = useTranslations(FormFinishedData);

  return (
    <div className="relative z-40 px-8 h-screen flex items-center">
      <div className="p-4 lg:py-0 lg:px-52 bg-blue-500 min-h-96 rounded-lg flex flex-col gap-8 justify-center items-center">
        <Image
          src="brasas-logo.svg"
          className="object-cover"
        />
        <span className="text-center text-white">
          {data.finalMessage}
        </span>
        <span className="text-center text-white text-2xl">
          {data.thanks}
        </span>

        <Button
          color="white"
          onClickAction={() => {
            reset();
            setStep(0);
            isFormFinished.value = false;
          }}
        >
          <span>{data.fillAgain}</span>
        </Button>
      </div>
    </div>
  );
}
