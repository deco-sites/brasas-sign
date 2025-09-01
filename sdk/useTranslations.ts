import { useLanguage } from "./useLanguage.ts";

export function useTranslations<T>(dataset: Record<"en-us" | "pt-br", T>) {
  const { language } = useLanguage();
  return dataset[language.value];
}
