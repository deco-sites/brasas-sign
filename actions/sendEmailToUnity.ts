import { AppContext } from "site/apps/site.ts";
import { invoke } from "../runtime.ts";
import { getBranch } from "../services/getBranch.ts";
import getToken from "./getToken.ts";

export interface Props {
  fullName: string;
  email: string;
  phone: string;
  branchId: string;
}

const sendEmailToUnity = async (
  props: Props,
  _req: Request,
  ctx: AppContext,
) => {
  const API_URL = ctx.apiBaseUrl; // vem do loader ou das secrets do Deco
  //const { invoke } = ctx.runtime; // útil se quiser chamar outras actions/funcs do Deco internamente

  // 1️⃣ Obter token temporário
  const { access_token: token } = await getToken(null, _req, ctx);

  // 2️⃣ Buscar informações da unidade
  //const branch = await getBranch(props.branchId, token);

  const branch = await getBranch(ctx, props.branchId, token);

  // 3️⃣ Montar e enviar e-mail
  await ctx.invoke.site.actions.sendEmail({
    RecipientsEmailArr: [{ email: branch.email }],
    subject: "Cadastro Realizado",
    data: `
        <p>Olá, ${branch.name || "Unidade BRASAS"}</p>
        <p>O(A) aluno(a) ${props.fullName} completou o cadastro no formulário de matrícula.</p>
        <p>Detalhes do cadastro:</p>
        <p>-----------------------------</p>
        <p>
          <strong>E-mail:</strong> ${props.email}<br />
          <strong>Telefone:</strong> ${props.phone}
        </p>
      `,
  });

  return { success: true };
};

export default sendEmailToUnity;
