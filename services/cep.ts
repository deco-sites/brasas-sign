// services/cep.ts

export interface CepResponse {
  bairro: string;
  cep: string;
  complemento: string;
  ddd: string;
  estado: string;
  gia: string;
  ibge: string;
  localidade: string;
  logradouro: string;
  regiao: string;
  siafi: string;
  uf: string;
  unidade: string;
  erro?: boolean;
}

export const getCep = async (number: string): Promise<CepResponse | null> => {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${number}/json/`);

    if (!response.ok) {
      throw new Error("Erro ao buscar o CEP");
    }

    const data: CepResponse = await response.json();

    if (data.erro) {
      return null; // CEP não encontrado
    }

    return data;
  } catch (error) {
    console.error("Erro ao buscar o CEP:", error);
    return null;
  }
};
