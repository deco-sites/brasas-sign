import { signal } from "@preact/signals";

const userChoice = localStorage.getItem("@brasas-sign:form-language");
const language = signal(userChoice || "pt-br");

const state = {
  language,
};

export const useLanguage = () => state;
