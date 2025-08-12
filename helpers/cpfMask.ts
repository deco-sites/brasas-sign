export const cpfMask = (cpf: string): string => {
  // Remove tudo que não for número
  cpf = cpf.replace(/\D/g, "");

  // Limita a 11 dígitos
  cpf = cpf.slice(0, 11);

  // Aplica a máscara conforme o tamanho digitado
  if (cpf.length > 9) {
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{0,2})$/, "$1.$2.$3-$4");
  } else if (cpf.length > 6) {
    return cpf.replace(/^(\d{3})(\d{3})(\d{0,3})$/, "$1.$2.$3");
  } else if (cpf.length > 3) {
    return cpf.replace(/^(\d{3})(\d{0,3})$/, "$1.$2");
  } else {
    return cpf;
  }
};
