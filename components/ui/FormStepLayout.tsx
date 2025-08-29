import Image from "apps/website/components/Image.tsx";
import StepDisplay from "../../components/ui/StepDisplay.tsx";
import { Button } from "../../components/ui/Button/index.tsx";
import IconArrowLeft from "https://deno.land/x/tabler_icons_tsx@0.0.7/tsx/arrow-left.tsx";
import IconArrowRight from "https://deno.land/x/tabler_icons_tsx@0.0.7/tsx/arrow-right.tsx";
import { useFormContext } from "react-hook-form";
import { saveCustomer } from "../../services/saveCustomers.ts";
import { useState } from "preact/hooks";
import { invoke } from "../../runtime.ts";
import { getBranch } from "../../services/getBranch.ts";
import { useFinishForm } from "../../sdk/useFinishForm.ts";

interface StepItem {
  step: number;
  title: string;
  subtitle: string;
}

interface Props {
  children: preact.ComponentChildren;
  steps: StepItem[];
  currentStep: number;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (step: number) => void;
  isSubmitDisabled?: boolean;
}

export default function FormStepLayout({
  children,
  steps,
  currentStep,
  goToNextStep,
  goToPreviousStep,
  goToStep,
  isSubmitDisabled = false,
}: Props) {
  const { handleSubmit, getValues } = useFormContext();
  const { isFormFinished } = useFinishForm();

  const getPdfAsBase64 = async (fileName: string) => {
    const response = await fetch(`/${fileName}`);
    const blob = await response.blob();

    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = (reader.result as string).split(",")[1];
        resolve(base64data);
      };
      reader.onerror = reject;
    });
  };

  const handleSendEmailtoUser = async () => {
    const fileName = getValues().module === "online"
      ? "BOL.pdf"
      : "PRESENCIAL.pdf";

    const base64File = await getPdfAsBase64(fileName);

    const emailSent = await invoke.site.actions.sendEmail({
      RecipientsEmailArr: [{ email: getValues().email }],
      subject: "Welcome to BRASAS!",
      attachments: {
        content: base64File,
        filename: fileName,
        type: "application/pdf",
      },

      data: `
  <p>Olá, <strong>${getValues().fullName}</strong>, bem-vindo(a) ao BRASAS.</p>
  <p>Detalhes do cadastro:</p>
  <p>-----------------------------</p>
  <p>
    <strong>E-mail:</strong> ${getValues().email}<br />
    <strong>Telefone:</strong> ${getValues().phone}
  </p>
`,
    });
  };

  const handleSendEmailtoUnity = async () => {
    const selectedBranch = getValues().branches;

    // 1. Obter token de uso único
    const loginRes = await fetch(
      "https://apitest.brasas.com/users/login/651f0350e5085e6250f6b366?exp_secs=20",
      {
        method: "GET",
        headers: {
          "community_id": "sophia-4375-44",
        },
      },
    );

    if (!loginRes.ok) {
      throw new Error(`Erro ao obter token: ${loginRes.statusText}`);
    }

    const loginData = await loginRes.json();
    const token = loginData.access_token;

    const branch = await getBranch(selectedBranch.id, token);

    const emailSent = await invoke.site.actions.sendEmail({
      RecipientsEmailArr: [{ email: branch.email }],
      //RecipientsEmailArr: [{ email: getValues().email }],
      subject: "Cadastro Realizado",
      data: `
<p>Olá, ${branch.name || "Unidade BRASAS"}</p>
<p>O(A) aluno(a) ${getValues().fullName} completou o cadastro no formulário de matrícula.</p>
<p>Detalhes do cadastro:</p>
<p>-----------------------------</p>
<p>
  <strong>E-mail:</strong> ${getValues().email}<br />
  <strong>Telefone:</strong> ${getValues().phone}
</p>
`,
    });
  };

  const onSubmit = async () => {
    const body = getValues();
    handleSendEmailtoUser();
    handleSendEmailtoUnity();
    isFormFinished.value = true;
    const response = await saveCustomer(body);
  };

  return (
    <div className="flex flex-col w-full lg:flex-row lg:h-4/5 lg:w-4/5 rounded-lg">
      {/* Lado esquerdo */}
      <div className="flex flex-col items-center gap-14 lg:bg-blue-500 w-screen lg:w-fit lg:min-w-72 pt-8 lg:p-8 lg:rounded-l-lg">
        <Image
          src="brasas-logo.svg"
          className="object-cover w-36"
        />
        <div className="flex lg:flex-col gap-8 w-full lg:w-fit overflow-x-scroll scrollbar-none px-8">
          {steps.map((s) => (
            <StepDisplay
              key={s.step}
              stepNumber={s.step}
              isActive={s.step === currentStep}
              title={s.title}
              subtitle={s.subtitle}
              goToStep={goToStep}
            />
          ))}
        </div>
      </div>

      {/* Lado direito */}
      <div className="p-4 lg:p-0 w-full">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-gray-400 rounded-lg lg:rounded-l-none lg:rounded-r-lg w-full h-full p-4 lg:p-8 flex flex-col justify-between"
        >
          <div>
            <h1 className="py-4 text-center text-xl">
              Formulário de Matrícula
            </h1>
            <div className="flex flex-col gap-2">{children}</div>
          </div>

          <div className="flex justify-between mt-8">
            <Button.Root color="blue" onClickAction={goToPreviousStep}>
              <Button.Icon icon={IconArrowLeft} />
              <span>Passo anterior</span>
            </Button.Root>

            {currentStep === steps.length
              ? (
                <Button.Root
                  color="green"
                  type="submit"
                  disabled={isSubmitDisabled}
                >
                  <span>Enviar</span>
                  <Button.Icon icon={IconArrowRight} />
                </Button.Root>
              )
              : (
                <Button.Root
                  type="button"
                  color="red"
                  onClickAction={goToNextStep}
                >
                  <span>Próximo passo</span>
                  <Button.Icon icon={IconArrowRight} />
                </Button.Root>
              )}
          </div>
        </form>
      </div>
    </div>
  );
}
