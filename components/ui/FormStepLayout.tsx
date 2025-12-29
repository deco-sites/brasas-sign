import Image from "apps/website/components/Image.tsx";
import StepDisplay from "../../components/ui/StepDisplay.tsx";
import { Button } from "../../components/ui/Button/index.tsx";
import IconArrowLeft from "https://deno.land/x/tabler_icons_tsx@0.0.7/tsx/arrow-left.tsx";
import IconArrowRight from "https://deno.land/x/tabler_icons_tsx@0.0.7/tsx/arrow-right.tsx";
import { useFormContext } from "react-hook-form";
import { saveCustomer } from "../../services/saveCustomers.ts";
import { invoke } from "../../runtime.ts";
import { getBranch } from "../../services/getBranch.ts";
import { useFinishForm } from "../../sdk/useFinishForm.ts";
import { LayoutData } from "../../data/Layout/Layout.ts";
import { useTranslations } from "../../sdk/useTranslations.ts";
import { FnContext } from "@deco/deco";
import { useEffect, useState } from "preact/hooks";
import { useToast } from "../../sdk/useToast.tsx";

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
  apiBaseUrl,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

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
    let fileName = "";

    if (getValues().courseType === "pff") {
      if (getValues().module === "online") {
        fileName = "PFF_ONLINE.pdf";
      } else if (getValues().module === "presencial") {
        fileName = "PFF_PRESENCIAL.pdf";
      }
    }

    if (getValues().courseType === "private") fileName = "PRIVATE.pdf";

    if (getValues().courseType === "regular") {
      if (getValues().module === "online") fileName = "BOL.pdf";
      if (getValues().module === "presencial") fileName = "PRESENCIAL.pdf";
    }

    const base64File = await getPdfAsBase64(fileName);

    await invoke.site.actions.sendEmail({
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
    const module = getValues().module;

    //const API_URL = Deno.env.get("DECO_API_BASE_URL");

    // 1. Obter token de uso único
    const token = await invoke.site.actions.getToken();
    const branch = await invoke.site.actions.getBranch({
      branchId: getValues().branches.id,
      token: token.access_token,
    });
    //const branch = await getBranch(null, selectedBranch.id, token.access_token);

    let bol = {};
    if (module === "online") {
      bol = await invoke.site.actions.getBranch({
        branchId: 45,
        token: token.access_token,
      });
    }

    await invoke.site.actions.sendEmail({
      RecipientsEmailArr: [{
        email: module === "online" ? bol.email : branch.email,
      }],
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

  {
    /*
  const handleSendEmailtoUnity = async () => {
    await invoke.site.actions.sendEmailToUnity({
      fullName: getValues().fullName,
      email: getValues().email,
      phone: getValues().phone,
      branchId: getValues().branches.id,
    });
  };*/
  }

  const onSubmit = async () => {
    if (isSubmitting) return; // proteção extra
    setIsSubmitting(true);

    try {
      const body = getValues();

      const token = await invoke.site.actions.getToken();
      const branch = await invoke.site.actions.getBranch({
        branchId: body.branches.id,
        token: token.access_token,
      });

      const newBody = {
        ...body,
        branches: {
          ...body.branches,
          id: branch.id,
        },
      };

      const result = await invoke.site.actions.saveCustomer(newBody);

      if (result.status < 400) {
        await handleSendEmailtoUser();
        await handleSendEmailtoUnity();
        isFormFinished.value = true;
        addToast({
          title: "Success",
          message: `Form saved successfully.`,
          color: "green",
        });
      } else {
        console.log("Erro ao salvar usuário");
        addToast({
          title: "Error",
          message: `Error to save form.`,
          color: "red",
        });
      }
    } catch (err) {
      console.error(err);
      addToast({
        title: "Error",
        message: err,
        color: "red",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const data = useTranslations(LayoutData);

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
              {data.formTitle}
            </h1>
            <div className="flex flex-col gap-2">{children}</div>
          </div>

          <div className="flex justify-between mt-8">
            <Button.Root color="blue" onClickAction={goToPreviousStep}>
              <Button.Icon icon={IconArrowLeft} />
              <span>{data.previousButtonText}</span>
            </Button.Root>

            {currentStep === steps.length
              ? (
                <Button.Root
                  color="green"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? <span>{data.submitButtonLoadingText}</span>
                    : (
                      <>
                        <span>{data.submitButtonText}</span>
                        <Button.Icon icon={IconArrowRight} />
                      </>
                    )}
                </Button.Root>
              )
              : (
                <Button.Root
                  type="button"
                  color="red"
                  onClickAction={goToNextStep}
                >
                  <span>{data.nextButtonText}</span>
                  <Button.Icon icon={IconArrowRight} />
                </Button.Root>
              )}
          </div>
        </form>
      </div>
    </div>
  );
}

export const loader = async (props: Props, _req: Request, ctx: FnContext) => {
  const API_URL = ctx.apiBaseUrl;

  return {
    ...props,
    apiBaseUrl: API_URL,
  };
};
