import Image from "next/image";

export default function Header({
  className,
}: Readonly<{ className?: string }>) {
  return (
    <div className="flex items-center justify-center">
      <div
        className={`flex w-full max-w-5xl py-8 gap-2 text-primary text-lg font-bold font-quicksand ${className}`}
      >
        <Image src="/logo.svg" alt="logo da brev.ly" width={27} height={23} />
        <p>brev.ly</p>
      </div>
    </div>
  );
}
