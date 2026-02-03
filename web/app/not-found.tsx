import Image from "next/image";

export default function notFound() {
  return (
    <main className="w-full min-h-screen flex items-center justify-between">
      <div className="w-[calc(100%-24px)] max-w-145 flex flex-col py-12 px-5 gap-6 m-auto items-center bg-white rounded-xl md:px-12">
        <Image
          src="/404.svg"
          alt="imagem de erro 404"
          width={164}
          height={72}
        />
        <p className="text-lg font-bold">Link não encontrado</p>
        <p className="text-sm text-center">
          O link que você está tentando acessar não existe, foi removido ou é
          uma URL inválida. Saiba mais em brev.ly.
        </p>
      </div>
    </main>
  );
}
