export const step3DataPT = {
  "isStudentFinancialResponsible": {
    "label": "*O próprio aluno é responsável financeiro?",
    "options": ["Sim", "Não"],
    "requiredError": "Selecione uma opção",
  },
  "financialResponsiblePersonType": {
    "label": "Tipo de pessoa do responsável financeiro?",
    "options": ["Pessoa Fìsica", "Pessoa Jurídica"],
    "requiredError": "Selecione uma opção",
  },
  "financialResponsibleName": {
    "labelPf": "*Nome completo do responsável financeiro",
    "labelPj": "*Razão social do responsável financeiro",
    "placeholderPf": "Informe o nome completo do responsável financeiro",
    "placeholderPj": "Informe a razão social do responsável financeiro",
    "requiredError": "Campo obrigatório",
  },
  "financialResponsibleFantasyName": {
    "label": "*Nome fantasia do responsável financeiro",
    "placeholder": "Informe o nome fantasia do responsável financeiro",
    "requiredError": "Campo obrigatório",
  },
  "financialResponsibleKinship": {
    "label": "*Parentesco",
    "placeholder": "Informe qual o parentesco com o responsável financeiro",
    "requiredError": "Campo obrigatório",
  },
  "financialResponsibleBirthDate": {
    "label": "Data de nascimento",
    "placeholder": "DD/MM/YYYY",
    "requiredError": "Campo obrigatório",
    "deadlineExceeded": "A data não pode ser maior que a atual.",
    "tooOld": "A data não pode ser menor que 1900"
  },
  "financialResponsibleCpf": {
    "labelPf": "CPF",
    "labelPj": "CNPJ",
    "note":
      "O CPF é um documento brasileiro e não é obrigatório para o preenchimento do formulário",
    "placeholderPf": "Informe o CPF do responsável financeiro",
    "placeholderPj": "Informe o CNPJ do responsável financeiro",
    "lengthErrorPf": "O CPF deve ter 11 dígitos",
    "lengthErrorPj": "O CNPJ deve ter 14 dígitos",
    "requiredError": "Campo obrigatório",
  },
  "financialResponsiblePhone": {
    "label": "Telefone",
    "placeholder": "(XX) XXXXX-XXXX",
    "requiredError": "Campo obrigatório",
  },
  "financialResponsibleEmail": {
    "label": "*E-mail",
    "placeholder": "Insira seu e-mail",
    "requiredError": "Campo obrigatório",
  },
  "financialResponsibleAddressEqualsStudent": {
    "label": "*Endereço igual do aluno?",
    "options": ["Sim", "Não"],
    "requiredError": "Selecione uma opção",
  },
  "financialResponsibleResidence": {
    "label": "*Onde você mora?",
    "options": ["Brasil", "Fora do Brasil"],
    "requiredError": "Campo obrigatório",
  },
  "financialResponsibleCep": {
    "label": "*Cep",
    "placeholder": "XX.XXX-XX",
    "requiredError": "Campo obrigatório",
    "error": "CEP deve ter pelo menos 8 digitos",
  },
  "financialResponsibleAddress": {
    "label": "Endereço completo do responsável financeiro",
    "placeholder": "Informe o nome da rua",
  },
  "financialResponsibleResidenceNumber": {
    "label": "Número",
    "placeholder": "Informe o número da residência",
  },
  "financialResponsibleResidenceComplement": {
    "label": "Complemento",
    "placeholder": "Possui complemento?",
  },
  "financialResponsibleResidenceNeighborhood": {
    "label": "*Bairro",
    "placeholder": "Bairro",
    "requiredError": "Campo obrigatório",
  },
  "financialResponsibleCity": {
    "label": "*Cidade",
    "placeholder": "Cidade",
    "requiredError": "Campo obrigatório",
  },
  "financialResponsibleUf": {
    "label": "*Uf",
    "placeholder": "Estado",
    "requiredError": "Campo obrigatório",
  },
};
