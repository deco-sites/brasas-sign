import { UnitsProvider } from "../../contexts/UnitsContext.tsx";
import FormController from "../../islands/UserView/FormController.tsx";
import { type FnContext } from "@deco/deco";

interface Branch {
  id: string;
  name: string;
  nickname: string;
  internal_name: string;
}

interface Props {
  units: Branch[];
}

export default function FormRender({ units }: Props) {
  return <FormController units={units} />;
}

export const loader = async (props: Props, req: Request, ctx: FnContext) => {
  const loginRes = await fetch(
    "https://apitest.brasas.com/users/login/651f0350e5085e6250f6b366",
    {
      method: "GET",
      headers: {
        "community_id": "sophia-4375-44",
      },
    },
  );

  const loginData = await loginRes.json();
  const token = loginData.access_token;

  const unitsRes = await fetch(
    "https://apitest.brasas.com/sophia/brasas/units",
    {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "community_id": "sophia-4375-44",
      },
    },
  );

  const unitsData = await unitsRes.json();

  return {
    ...props,
    device: ctx.device,
    units: unitsData,
  };
};
