export const textMask = (text: string): string => {
  // Remove tudo que não for letra, espaço ou apóstrofo
  text = text.replace(/[^\p{L}\s']/gu, "");

  // Remove múltiplos espaços
  text = text.replace(/\s{2,}/g, " ");

  // Limita a 50 caracteres
  return text.slice(0, 50);
};
