import FormController from "../../islands/UserView/FormController.tsx";
import { type FnContext } from "@deco/deco";

interface Props {}

export default function FormRender({}: Props) {
  return <FormController />;
}

export const loader = (props: Props, req: Request, ctx: FnContext) => {
  fetch("https://apitest.brasas.com/sophia/brasas/units", {
    method: "GET",
    headers: {
      "community_id": "sophia-4375-44",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erro: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Resposta da API:", data);
    })
    .catch((error) => {
      console.error("Erro na requisição:", error);
    });

  return {
    ...props,
    device: ctx.device,
  };
};
