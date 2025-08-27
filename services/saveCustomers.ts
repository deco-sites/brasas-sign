interface FormValues {
  address: string;
  agree: boolean;
  birthDate: string;
  branches: string;
  cep: string;
  city: string;
  complement: string;
  country: string;
  courseType: string;
  cpf: string;
  email: string;
  financialResponsibleAddress: string;
  financialResponsibleAddressEqualsStudent: "yes" | "no";
  financialResponsibleBirthDate: string;
  financialResponsibleCep: string;
  financialResponsibleCity: string;
  financialResponsibleCpf: string;
  financialResponsibleKinship: string;
  financialResponsibleName: string;
  financialResponsiblePersonType: string;
  financialResponsiblePhone: string;
  financialResponsibleEmail: string;
  financialResponsibleResidence: string;
  financialResponsibleResidenceComplement: string;
  financialResponsibleResidenceNeighborhood: string;
  financialResponsibleResidenceNumber: string;
  financialResponsibleUf: string;
  fullName: string;
  howFind: string[];
  imageAuth: "yes" | "no";
  interest: string[];
  isStudentFinancialResponsible: "yes" | "no";
  isStudentPedagogicalResponsible: "yes" | "no";
  languages: string[];
  module: string;
  neighborhood: string;
  number: string;
  pedagogicalResponsibleAddress: string;
  pedagogicalResponsibleAddressEqualsStudent: "yes" | "no";
  pedagogicalResponsibleBirthDate: string;
  pedagogicalResponsibleCep: string;
  pedagogicalResponsibleCity: string;
  pedagogicalResponsibleCpf: string;
  pedagogicalResponsibleKinship: string;
  pedagogicalResponsibleName: string;
  pedagogicalResponsiblePersonType: string;
  pedagogicalResponsiblePhone: string;
  pedagogicalResponsibleEmail: string;
  pedagogicalResponsibleResidence: string;
  pedagogicalResponsibleResidenceComplement: string;
  pedagogicalResponsibleResidenceNeighborhood: string;
  pedagogicalResponsibleResidenceNumber: string;
  pedagogicalResponsibleUf: string;
  phone: string;
  preference: string[];
  residence: string;
  schoolOrCompany: string;
  signature: string;
  uf: string;
  whichOthersHowFind: string;
  whichOthersInterest: string;
  whichOthersPreferences: string;
}

export const saveCustomer = async (body: FormValues) => {
  try {
    // 1. Obter token de uso único
    const loginRes = await fetch(
      "https://apitest.brasas.com/users/login/651f0350e5085e6250f6b366?exp_secs=1200",
      {
        method: "GET",
        headers: {
          "community_id": "sophia-4375-44",
        },
      },
    );

    if (!loginRes.ok) {
      throw new Error(`Erro ao obter token: ${loginRes.statusText}`);
    }

    const loginData = await loginRes.json();
    const token = loginData.access_token;

    // 2. Mapear os dados do form para o formato esperado pela API
    const payload: any = {
      unit_id: body.branches.id,
      unit_name: body.branches.value,
      is_online_module: body.module === "online",
      data_authorization: body.agree,
      name: body.fullName,
      gender: "M",
      tax_number: body.cpf,
      national_id: "",
      birth_date: body.birthDate || "0001-01-01",
      origin_country: body.country.value,
      address: body.address,
      address_number: Number(body.number) || 0,
      address_complement: body.complement,
      address_neighborhood: body.neighborhood,
      address_city: body.city,
      address_state: body.uf,
      address_zip_code: body.residence === "fora-do-brasil"
        ? "22775090"
        : body?.cep?.replace(/\D/g, ""),
      phone_number: body.phone,
      email: body.email,
      signature: body.signature,

      // Adiciona finance_administrator somente se isStudentFinancialResponsible === "no"
      ...(body.isStudentFinancialResponsible === "no" && {
        finance_administrator: {
          same_student_address:
            body.financialResponsibleAddressEqualsStudent === "yes",
          relationship: body.financialResponsibleKinship,
          name: body.financialResponsibleName,
          tax_number: body.financialResponsibleCpf,
          national_id: "",
          birth_date: body.financialResponsibleBirthDate || "0001-01-01",
          address: body.financialResponsibleAddress,
          address_number: Number(body.financialResponsibleResidenceNumber) || 0,
          address_complement: body.financialResponsibleResidenceComplement,
          address_neighborhood: body.financialResponsibleResidenceNeighborhood,
          address_city: body.financialResponsibleCity,
          address_state: body.financialResponsibleUf,
          address_zip_code:
            body.financialResponsibleResidence === "fora-do-brasil"
              ? "22775090"
              : body?.financialResponsibleCep?.replace(/\D/g, "") || "",
          phone_number: body.financialResponsiblePhone || "",
          email: body.financialResponsibleEmail,
        },
      }),

      // Adiciona educational_administrator somente se isStudentPedagogicalResponsible === "no"
      ...(body.isStudentPedagogicalResponsible === "no" && {
        educational_administrator: {
          same_student_address:
            body.pedagogicalResponsibleAddressEqualsStudent === "yes",
          same_educational_financial_administrator:
            body.isStudentPedagogicalResponsible === "yes",
          relationship: body.pedagogicalResponsibleKinship,
          name: body.pedagogicalResponsibleName,
          tax_number: body.pedagogicalResponsibleCpf,
          national_id: "",
          birth_date: body.pedagogicalResponsibleBirthDate || "0001-01-01",
          address: body.pedagogicalResponsibleAddress,
          address_number: Number(body.pedagogicalResponsibleResidenceNumber) ||
            0,
          address_complement: body.pedagogicalResponsibleResidenceComplement,
          address_neighborhood:
            body.pedagogicalResponsibleResidenceNeighborhood,
          address_city: body.pedagogicalResponsibleCity,
          address_state: body.pedagogicalResponsibleUf,
          address_zip_code:
            body.pedagogicalResponsibleResidence === "fora-do-brasil"
              ? "22775090"
              : body?.pedagogicalResponsibleCep?.replace(/\D/g, "") || "",
          phone_number: body.pedagogicalResponsiblePhone || "",
          email: body.pedagogicalResponsibleEmail,
        },
      }),

      marketing: {
        brasas_preference: body.preference,
        brasas_preference_others_details: body.whichOthersPreferences,
        brasas_find: body.howFind,
        brasas_find_others_details: body.whichOthersHowFind,
        brasas_language_interest: body.interest,
        brasas_language_interest_details: body.whichOthersInterest,
        spoken_languages: body.languages,
        school_company_origin: body.schoolOrCompany,
      },
    };

    // 3. Enviar payload para a API principal
    const response = await fetch(
      "https://apitest.brasas.com/sophia/customers",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("retorno do save", data);
    return data;
  } catch (error) {
    console.error("Erro ao salvar cliente:", error);
    throw error;
  }
};
