"use client";

import { Upload } from "@/types/Upload";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  uploads?: Upload[];
  className?: string;
};

export default function MyLinks({ uploads, className }: Readonly<Props>) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    const ok = window.confirm("Tem certeza que deseja excluir esse link?");
    if (!ok) return;

    setDeletingId(id);
    try {
      const res = await fetch(`http://localhost:3333/uploads/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        alert(data?.message ?? "Erro ao excluir link.");
        return;
      }

      router.refresh();
    } catch {
      alert("Falha de rede ao excluir.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div
      className={`w-[calc(100%-24px)] flex flex-col gap-5 p-6 bg-white rounded ${className}`}
    >
      <div className="flex justify-between">
        <h2 className="text-lg font-bold">Meus links</h2>
        <button className="flex gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg opacity-70">
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
                className="grid items-center grid-cols-4 gap-3 pt-2 border-t border-gray-200 md:grid-cols-6"
              >
                <Link
                  href={`/go/${upload?.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col col-span-2 md:col-span-4"
                >
                  <p className="truncate text-primary">{upload?.name}</p>
                  <p className="truncate opacity-70">{urlSanitized}</p>
                </Link>
                <p className="text-sm opacity-70">{upload?.access} acessos</p>
                <div className="flex justify-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigator.clipboard.writeText(urlSanitized);
                    }}
                    className="p-2 bg-gray-300 rounded opacity-70"
                  >
                    <Image
                      src="/copy.svg"
                      alt="ícone de lixeira"
                      width={16}
                      height={16}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDelete(upload.id);
                    }}
                    className="p-2 bg-gray-300 rounded opacity-70"
                  >
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
