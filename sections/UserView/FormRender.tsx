import FormController from "../../islands/UserView/FormController.tsx";
import { type FnContext } from "@deco/deco";
import type { ApiBaseUrl } from "../../loaders/apiBaseUrl.ts";

interface Branch {
  id: string;
  name: string;
  nickname: string;
  internal_name: string;
}

interface Props {
  units: Branch[];
  apiBaseUrl: ApiBaseUrl;
}

export default function FormRender({ units }: Props) {
  return <FormController units={units} />;
}

export const loader = async (props: Props, _req: Request, ctx: FnContext) => {
  const API_URL = ctx.apiBaseUrl;

  const loginRes = await fetch(
    `${API_URL}/users/login/651f0350e5085e6250f6b366?exp_secs=1200`,
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
    `${API_URL}/sophia/brasas/units`,
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
    apiBaseUrl: API_URL,
  };
};
