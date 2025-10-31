export interface BranchDetails {
  id: number;
  name: string;
  email: string;
  sophia_code: number;
}

export const getBranch = async (
  branchId: number,
  token: string,
): Promise<BranchDetails> => {
  const API_URL = Deno.env.get("DECO_API_BASE_URL");
  try {
    const response = await fetch(
      `${API_URL}/sophia/brasas/units/${branchId}/details`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
