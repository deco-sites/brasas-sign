import Image from "apps/website/components/Image.tsx";

export default function InternationalizationController() {
  return (
    <div className="absolute top-8 right-8 flex gap-4">
      <Image src="br-flag.png" className="w-9 h-9 cursor-pointer" />
      <Image src="usa-flag.png" className="w-9 h-9 cursor-pointer" />
    </div>
  );
}
