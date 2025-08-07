import FormController from "../../islands/UserView/FormController.tsx";
import { type FnContext } from "@deco/deco";

interface Props {}

export default function FormRender({}: Props) {
  return <FormController />;
}

export const loader = (props: Props, req: Request, ctx: FnContext) => {
  fetch("https://apitest.brasas.com/users/login/651f0350e5085e6250f6b366", {
    method: "GET",
    headers: {
      "community_id": "sophia-4375-44",
    },
  })
    .then((response) => {
      return response.json();
    }).then((data) => {
      console.log("Resposta da API:", data);
      const token = data.access_token;

      fetch("https://apitest.brasas.com/sophia/brasas/units", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "community_id": "sophia-4375-44",
        },
      }).then((response) => {
        return response.json();
      }).then((data) => {
        console.log("Responsa final", data);
      });
    });

  return {
    ...props,
    device: ctx.device,
  };
};
