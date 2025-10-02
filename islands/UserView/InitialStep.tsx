import Image from "apps/website/components/Image.tsx";
import { Button } from "../../components/ui/Button/index.tsx";
import { useTranslations } from "../../sdk/useTranslations.ts";
import { initialStepData } from "../../data/InitialStep/InitialStepData.ts";

export default function InitialStep({ form, goToNextStep }) {
  const { setValue } = form;

  const data = useTranslations(initialStepData);

  function renderHTML(text: string) {
    // Divide o texto por <br />, <strong> e </strong>
    const parts = text.split(/(<br\s*\/?>|<\/?strong>)/g);

    const elements: (string | JSX.Element)[] = [];
    let strongOpen = false;

    parts.forEach((part, i) => {
      if (part.match(/<br\s*\/?>/)) {
        elements.push(<br key={i} />);
      } else if (part === "<strong>") {
        strongOpen = true;
      } else if (part === "</strong>") {
        strongOpen = false;
      } else if (part.trim() !== "") {
        elements.push(strongOpen ? <strong key={i}>{part}</strong> : part);
      }
    });

    return elements;
  }

  return (
    <div className="relative z-40 px-8 h-screen flex items-center">
      <div className="p-4 lg:py-0 lg:px-52 bg-blue-500 min-h-96 rounded-lg flex flex-col gap-8 justify-center items-center">
        <Image
          src="brasas-logo.svg"
          className="object-cover"
        />
        <span className="text-center text-white">
          {renderHTML(data.introductoryText)}
        </span>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button.Root
            color="regular"
            uppercaseText
            type="button"
            onClickAction={() => {
              setValue("courseType", "regular");
              goToNextStep();
            }}
          >
            <span>{data.regularCourseButtonText}</span>
          </Button.Root>
          <Button.Root
            color="white"
            uppercaseText
            type="button"
            onClickAction={() => {
              setValue("courseType", "pff");
              goToNextStep();
            }}
          >
            <span>{data.pffCourseButtonText}</span>
          </Button.Root>
          <Button.Root
            color="navy"
            uppercaseText
            type="button"
            onClickAction={() => {
              setValue("courseType", "private");
              goToNextStep();
            }}
          >
            <span>{data.privateClassesButtonText}</span>
          </Button.Root>
        </div>
      </div>
    </div>
  );
}
