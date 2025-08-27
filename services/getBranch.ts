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
  try {
    const response = await fetch(
      `https://apitest.brasas.com/sophia/brasas/units/${branchId}/details`,
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
    console.log("Branch details:", data);
    return data;
  } catch (error) {
    console.error("Erro no getBranch:", error);
    throw error;
  }
};
