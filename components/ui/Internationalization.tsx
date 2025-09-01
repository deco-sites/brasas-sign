import Image from "apps/website/components/Image.tsx";
import { useLanguage } from "../../sdk/useLanguage.ts";

export default function Internationalization() {
  const { language } = useLanguage();

  return (
    <div className="absolute flex gap-4 items-center justify-center top-0 right-0 p-4 z-50">
      <Image
        src="/usa-flag.svg"
        alt=""
        height=""
        width=""
        className="cursor-pointer"
        onClick={() => {
          language.value = "en-us";
          localStorage.setItem("@brasas-sign:form-language", "en-us");
        }}
      />
      <Image
        src="/brazilian-flag.svg"
        alt=""
        height=""
        width=""
        className="cursor-pointer"
        onClick={() => {
          language.value = "pt-br";
          localStorage.setItem("@brasas-sign:form-language", "pt-br");
        }}
      />
    </div>
  );
}
