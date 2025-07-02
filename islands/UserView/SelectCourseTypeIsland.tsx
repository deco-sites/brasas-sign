import Image from "apps/website/components/Image.tsx";
import { Button } from "../../components/ui/Button/index.tsx";

export default function SelectCourseTypeIsland({ onSelect }) {
  return (
    <div className="relative z-50 px-52 bg-blue-500 min-h-96 rounded-lg flex flex-col gap-8 justify-center items-center">
      <Image
        src="brasas-logo.svg"
        className="object-cover"
      />
      <span className="text-center text-white">
        Bem vindo ao formulário de matrícula do <strong>BRASAS</strong>.

        <br />Qual o tipo de curso que tem interesse em se matricular?
      </span>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button.Root
          color="red"
          uppercaseText
          onClickAction={() => onSelect("regular")}
        >
          <span>curso regular</span>
        </Button.Root>
        <Button.Root
          color="white"
          uppercaseText
          onClickAction={() => onSelect("pff")}
        >
          <span>portuguese for foreigners</span>
        </Button.Root>
      </div>
    </div>
  );
}
