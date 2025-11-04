import { AppContext } from "site/apps/site.ts";

export interface Props {
  branchId: number;
  token: string;
}

export interface BranchDetails {
  id: number;
  name: string;
  email: string;
  sophia_code: number;
}

const getBranch = async (
  props: Props,
  _req: Request,
  ctx: AppContext,
): Promise<BranchDetails> => {
  const API_URL = ctx.apiBaseUrl;

  try {
    const response = await fetch(
      `${API_URL}/sophia/brasas/units/${props.branchId}/details`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Erro ao buscar unidade: ${response.statusText}`);
    }

    const data: BranchDetails = await response.json();
    return data;
  } catch (error) {
    console.error("Erro no getBranch:", error);
    throw error;
  }
};

export default getBranch;
