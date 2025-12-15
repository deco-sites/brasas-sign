import { AppContext } from "site/apps/site.ts";

interface FinanceAdministrator {
  same_student_address: boolean;
  relationship: string;
  name: string;
  tax_number: string;
  national_id: string;
  birth_date: string;
  address: string;
  address_number: number;
  address_complement: string;
  address_neighborhood: string;
  address_city: string;
  address_state: string;
  address_zip_code: string;
  phone_number: string;
  email: string;
}

interface EducationalAdministrator {
  same_student_address: boolean;
  same_educational_financial_administrator: boolean;
  relationship: string;
  name: string;
  tax_number: string;
  national_id: string;
  birth_date: string;
  address: string;
  address_number: number;
  address_complement: string;
  address_neighborhood: string;
  address_city: string;
  address_state: string;
  address_zip_code: string;
  phone_number: string;
  email: string;
}

interface MarketingData {
  brasas_preference: string[];
  brasas_preference_others_details: string;
  brasas_find: string[];
  brasas_find_others_details: string;
  brasas_language_interest: string[];
  brasas_language_interest_details: string;
  spoken_languages: string[];
  school_company_origin: string;
}

interface CustomerPayload {
  unit_id: number | string;
  unit_name: string;
  is_online_module: boolean;
  data_authorization: boolean;
  name: string;
  gender: string;
  tax_number: string;
  national_id: string;
  birth_date: string;
  origin_country: string;
  address: string;
  address_number: number;
  address_complement?: string;
  address_neighborhood?: string;
  address_city?: string;
  address_state?: string;
  address_zip_code?: string;
  phone_number?: string;
  email?: string;
  signature?: string;
  finance_administrator?: FinanceAdministrator;
  educational_administrator?: EducationalAdministrator;
  marketing: MarketingData;
}

interface FormValues {
  // 👇 você pode manter aqui tudo que já tinha
  [key: string]: any;
}

const saveCustomer = async (
  body: FormValues,
  _req: Request,
  ctx: AppContext,
) => {
  const API_URL = ctx.apiBaseUrl;
  try {
    // Obter token temporário
    const loginRes = await fetch(
      `${API_URL}/users/login/651f0350e5085e6250f6b366?exp_secs=1200`,
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

    // Montar payload conforme o schema
    const payload: CustomerPayload = {
      unit_id: body.branches.id,
      unit_name: body.branches.value,
      is_online_module: body.module === "online",
      data_authorization: body.agree,
      name: body.fullName.trim(),
      gender: body.gender.value,
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

    console.log("Payload enviado:", JSON.stringify(payload));
    // Enviar o payload para a API
    const response = await fetch(`${API_URL}/sophia/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Erro na API Sophia:", text);
      throw new Error(`Erro na requisição: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao salvar cliente:", error);
    throw error;
  }
};

export default saveCustomer;
