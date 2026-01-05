export const numberMask = (text: string): string => {
    // Remove tudo que não for número
    text = text.replace(/[^\d]/g, "");
  
    // Limita a 50 caracteres
    return text.slice(0, 50);
  };
  