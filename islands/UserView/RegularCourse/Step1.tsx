import Image from "apps/website/components/Image.tsx";
import StepDisplay from "../../../components/ui/StepDisplay.tsx";
import IconArrowRight from "https://deno.land/x/tabler_icons_tsx@0.0.7/tsx/arrow-right.tsx";
import IconArrowLeft from "https://deno.land/x/tabler_icons_tsx@0.0.7/tsx/arrow-left.tsx";
import { useForm } from "react-hook-form";
import { Button } from "../../../components/ui/Button/index.tsx";
import { Input } from "../../../components/ui/Input/index.tsx";

export default function RegularStep1({ goToNextStep, goToPreviousStep }) {
  const { register } = useForm();
  console.log("register", register);
  return (
    <>
      <div className="flex h-4/5 w-4/5 rounded-lg overflow-hidden">
        <div className="flex flex-col items-center gap-14 bg-blue-500 min-w-72 p-8">
          <Image
            src="brasas-logo.svg"
            className="object-cover w-36"
          />

          <div className="flex flex-col gap-8">
            <StepDisplay
              step={1}
              isActive={true}
              title={"step 1"}
              subtitle={"Informações pessoais"}
            />
            <StepDisplay
              step={1}
              isActive={false}
              title={"step 1"}
              subtitle={"Informações pessoais"}
            />
          </div>
        </div>
        <div className="bg-gray-400 w-full h-full p-8 flex flex-col justify-between">
          <div>
            <h1 className="py-4 text-center text-xl">
              Formulário de Matrícula
            </h1>

            <div className="flex flex-col gap-8">
              <Input.Root>
                <Input.Label htmlFor="name">nome completo do aluno</Input.Label>

                <Input.Field
                  id="name"
                  type="text"
                  placeholder="Insira o nome completo do aluno"
                  {...register("name")}
                />
              </Input.Root>

              <Input.Root>
                <Input.Label htmlFor="email">E-mail</Input.Label>

                <Input.Field
                  id="email"
                  type="email"
                  placeholder="Insira seu e-mail"
                  {...register("email")}
                />
              </Input.Root>

              <Input.Root>
                <Input.Label htmlFor="name">nome completo do aluno</Input.Label>

                <Input.Field
                  id="name"
                  type="text"
                  placeholder="Insira o nome completo do aluno"
                  {...register("name")}
                />
              </Input.Root>
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <Button.Root
              color="blue"
              onClickAction={goToPreviousStep}
            >
              <Button.Icon icon={IconArrowLeft} />
              <span>Passo anterior</span>
            </Button.Root>

            <Button.Root
              color="red"
              onClickAction={goToNextStep}
            >
              <span>Próximo passo</span>
              <Button.Icon icon={IconArrowRight} />
            </Button.Root>
          </div>
        </div>
      </div>
    </>
  );
}
