import { Upload } from "@/types/Upload";
import Image from "next/image";
import Link from "next/link";

type Props = {
  uploads?: Upload[];
  className?: string;
};

export default function MyLinks({ uploads, className }: Readonly<Props>) {
  return (
    <div
      className={`w-[calc(100%-24px)] flex flex-col gap-5 p-6 bg-white rounded ${className}`}
    >
      <div className="flex justify-between">
        <h2 className="text-lg font-bold">Meus links</h2>
        <button className="flex px-4 py-2 gap-2 text-gray-700 bg-gray-100 opacity-70 rounded-lg">
          <Image
            src="/download.svg"
            alt="símbolo de download"
            width={16}
            height={16}
          />
          <p>Baixar CSV</p>
        </button>
      </div>
      {uploads && uploads.length > 0 ? (
        <div>
          {uploads.map((upload: Upload) => {
            const urlSanitized =
              upload?.url?.startsWith("http") ||
              upload?.url?.startsWith("https")
                ? upload?.url
                : `https://${upload?.url}`;

            return (
              <div
                key={upload?.id}
                className="grid grid-cols-4 gap-2 items-center border-t border-gray-200 pt-2 md:grid-cols-6"
              >
                <Link
                  href={urlSanitized}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col col-span-2 md:col-span-4"
                >
                  <p className="text-primary">{upload?.name}</p>
                  <p className="opacity-70">{urlSanitized}</p>
                </Link>
                <p className="opacity-70 text-sm">{upload?.access} acessos</p>
                <div className="flex justify-center gap-1">
                  <button className="p-2 bg-gray-300 opacity-70 rounded">
                    <Image
                      src="/copy.svg"
                      alt="ícone de lixeira"
                      width={16}
                      height={16}
                    />
                  </button>
                  <button className="p-2 bg-gray-300 opacity-70 rounded">
                    <Image
                      src="/trash.svg"
                      alt="ícone de lixeira"
                      width={16}
                      height={16}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div>Nenhum link criado ainda.</div>
      )}
    </div>
  );
}
