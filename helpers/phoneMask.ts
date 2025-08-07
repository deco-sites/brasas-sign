export const phoneMask = (phone: string): string => {
  // Remove tudo que não for número
  phone = phone.replace(/\D/g, "");

  // Limita a 11 dígitos (ex: (21) 99999-9999)
  phone = phone.slice(0, 11);

  // Aplica a máscara conforme o tamanho
  if (phone.length >= 11) {
    // Celular com 9 dígitos
    return phone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  } else if (phone.length >= 10) {
    // Telefone fixo com 8 dígitos
    return phone.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
  } else if (phone.length > 6) {
    return phone.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3");
  } else if (phone.length > 2) {
    return phone.replace(/^(\d{2})(\d{0,5})$/, "($1) $2");
  } else {
    return phone.replace(/^(\d*)$/, "($1");
  }
};
