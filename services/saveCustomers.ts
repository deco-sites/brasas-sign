interface FormValues {
  address: string;
  agree: boolean;
  birthDate: string;
  branches: string;
  cep: string;
  city: string;
  complement: string | null;
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
  financialResponsibleResidence: string | null;
  financialResponsibleResidenceComplement: string | null;
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
  pedagogicalResponsibleResidence: string | null;
  pedagogicalResponsibleResidenceComplement: string | null;
  pedagogicalResponsibleResidenceNeighborhood: string;
  pedagogicalResponsibleResidenceNumber: string;
  pedagogicalResponsibleUf: string;
  phone: string;
  preference: string[];
  residence: string;
  ["school/company"]: string;
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
    const payload = {
      unit_id: 45, //Mudar
      unit_name: "Recreio", //Mudar
      is_online_module: true,
      data_authorization: body.agree,
      name: body.fullName,
      gender: "M", //Não tem no form
      tax_number: body.cpf,
      national_id: null, //Mudar
      birth_date: body.birthDate,
      origin_country: body.country,
      address: body.address,
      address_number: Number(body.number),
      address_complement: body.complement,
      address_neighborhood: body.neighborhood,
      address_city: body.city,
      address_state: body.uf,
      address_zip_code: body?.cep?.replace(/\D/g, ""),
      phone_number: body.phone,
      email: body.email,
      signature: body.signature,
      finance_administrator: {
        same_student_address:
          body.financialResponsibleAddressEqualsStudent === "yes",
        relationship: body.financialResponsibleKinship,
        name: body.financialResponsibleName,
        tax_number: body.financialResponsibleCpf,
        national_id: null, //Mudar
        birth_date: body.financialResponsibleBirthDate || null,
        address: body.financialResponsibleAddress,
        address_number: Number(body.financialResponsibleResidenceNumber) ||
          null,
        address_complement: body.financialResponsibleResidenceComplement,
        address_neighborhood: body.financialResponsibleResidenceNeighborhood,
        address_city: body.financialResponsibleCity,
        address_state: body.financialResponsibleUf,
        address_zip_code: body?.financialResponsibleCep?.replace(/\D/g, "") ||
          null,
        phone_number: body.financialResponsiblePhone || null,
        email: "teste.pai@test.com", //Não tem no form
      },
      educational_administrator: {
        same_student_address:
          body.pedagogicalResponsibleAddressEqualsStudent === "yes",
        same_educational_financial_administrator: false,
        relationship: body.pedagogicalResponsibleKinship,
        name: body.pedagogicalResponsibleName,
        tax_number: body.pedagogicalResponsibleCpf,
        national_id: null, //Mudar
        birth_date: body.pedagogicalResponsibleBirthDate || null,
        address: body.pedagogicalResponsibleAddress,
        address_number: Number(body.pedagogicalResponsibleResidenceNumber) ||
          null,
        address_complement: body.pedagogicalResponsibleResidenceComplement,
        address_neighborhood: body.pedagogicalResponsibleResidenceNeighborhood,
        address_city: body.pedagogicalResponsibleCity,
        address_state: body.pedagogicalResponsibleUf,
        address_zip_code: body?.pedagogicalResponsibleCep?.replace(/\D/g, "") ||
          null,
        phone_number: body.pedagogicalResponsiblePhone || null,
        email: "teste.mae@test.com", //Não tem no form
      },
      marketing: {
        brasas_preference: body.preference,
        brasas_preference_others_details: body.whichOthersPreferences,
        brasas_find: body.howFind,
        brasas_find_others_details: body.whichOthersHowFind,
        brasas_language_interest: body.interest,
        brasas_language_interest_details: body.whichOthersInterest,
        spoken_languages: body.languages,
        school_company_origin: body["school/company"],
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
