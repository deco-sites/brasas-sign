export const cepMask = (cep: string): string => {
  cep = cep.replace(/\D/g, "");

  if (cep.length > 8) {
    cep = cep.slice(0, 8);
  }

  cep = cep.replace(/^(\d{2})(\d)/, "$1.$2");
  cep = cep.replace(/(\d{3})(\d{3})$/, "$1-$2");

  return cep;
};
