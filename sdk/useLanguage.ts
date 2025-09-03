import { signal } from "@preact/signals";

const userChoice = localStorage.getItem("@brasas-sign:form-language");
const navigatorLanguage = navigator.language?.toLowerCase();

// ordem de prioridade: localStorage > navegador > pt-br
const initialLanguage = userChoice || navigatorLanguage || "pt-br";

const language = signal(initialLanguage);

const state = {
  language,
};

export const useLanguage = () => state;
