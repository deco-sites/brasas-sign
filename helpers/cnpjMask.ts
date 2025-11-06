export const cnpjMask = (cnpj: string): string => {
  // Remove tudo que não for número
  cnpj = cnpj.replace(/\D/g, "");

  // Limita a 14 dígitos
  cnpj = cnpj.slice(0, 14);

  // Aplica a máscara conforme o tamanho digitado
  if (cnpj.length > 12) {
    return cnpj.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})$/,
      "$1.$2.$3/$4-$5",
    );
  } else if (cnpj.length > 8) {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{0,4})$/, "$1.$2.$3/$4");
  } else if (cnpj.length > 5) {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{0,3})$/, "$1.$2.$3");
  } else if (cnpj.length > 2) {
    return cnpj.replace(/^(\d{2})(\d{0,3})$/, "$1.$2");
  } else {
    return cnpj;
  }
};
