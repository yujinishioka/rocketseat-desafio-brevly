"use client";

import { Upload } from "@/types/Upload";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Props = {
  uploads?: Upload[];
  className?: string;
};

function sanitizeUrl(url?: string | null) {
  const raw = String(url ?? "").trim();
  if (!raw) return "";
  return raw.startsWith("http://") || raw.startsWith("https://")
    ? raw
    : `https://${raw}`;
}

function formatDate(value: string | number | null | undefined): string {
  if (!value) return "";
  const d =
    typeof value === "number" ? new Date(value) : new Date(String(value));
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("pt-BR");
}

function csvEscape(value: string | number | null | undefined): string {
  const s = String(value ?? "");
  if (/[",\n]/.test(s)) return `"${s.replaceAll('"', '""')}"`;
  return s;
}

export default function MyLinks({ uploads, className }: Readonly<Props>) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const rowsForCsv = useMemo(() => {
    const list = Array.isArray(uploads) ? uploads : [];
    return list.map((u) => {
      const original = sanitizeUrl(u.url);
      const short = String(u.name ?? "");
      const access = u.access ?? 0;
      const created = formatDate(u.createdAt ?? u.createdAt);

      return { original, short, access, created };
    });
  }, [uploads]);

  const handleDownloadCSV = () => {
    if (!rowsForCsv.length) {
      alert("Não há links para exportar.");
      return;
    }

    const header = [
      "URL Original",
      "URL Encurtado",
      "Acessos",
      "Data de criação",
    ];
    const lines = [
      header.map(csvEscape).join(","),
      ...rowsForCsv.map((r) =>
        [r.original, r.short, r.access, r.created].map(csvEscape).join(","),
      ),
    ];

    const csvContent = "\uFEFF" + lines.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const dateStr = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `meus-links_${dateStr}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (id: string) => {
    const ok = globalThis.confirm("Tem certeza que deseja excluir esse link?");
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
      className={`w-[calc(100%-24px)] flex flex-col gap-5 p-6 bg-white rounded ${className ?? ""}`}
    >
      <div className="flex justify-between">
        <h2 className="text-lg font-bold">Meus links</h2>

        <button
          type="button"
          onClick={handleDownloadCSV}
          className="flex gap-2 px-4 py-2 text-gray-700 transition bg-gray-100 rounded-lg opacity-70 hover:opacity-100"
        >
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
            const urlSanitized = sanitizeUrl(upload?.url);
            const idStr = String(upload?.id);

            return (
              <div
                key={idStr}
                className="grid items-center grid-cols-4 gap-3 pt-2 border-t border-gray-200 md:grid-cols-6"
              >
                <Link
                  href={`/go/${idStr}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col min-w-0 col-span-2 md:col-span-4"
                >
                  <p className="truncate text-primary">{upload?.name}</p>
                  <p className="truncate opacity-70">{urlSanitized}</p>
                </Link>

                <p className="text-sm opacity-70">
                  {upload?.access ?? 0} acessos
                </p>

                <div className="flex justify-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigator.clipboard.writeText(urlSanitized);
                    }}
                    className="p-2 bg-gray-300 rounded opacity-70"
                    title="Copiar URL"
                  >
                    <Image
                      src="/copy.svg"
                      alt="ícone de copiar"
                      width={16}
                      height={16}
                    />
                  </button>

                  <button
                    type="button"
                    disabled={deletingId === idStr}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDelete(idStr);
                    }}
                    className="p-2 bg-gray-300 rounded opacity-70 disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Excluir"
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
        <div className="flex flex-col items-center justify-center gap-4 p-12 text-center border-t border-gray-200 opacity-70">
          <Image
            src="/link.svg"
            alt="Ícone de nenhum link"
            width={32}
            height={32}
          />
          <p className="uppercase">ainda não existem links cadastrados</p>
        </div>
      )}
    </div>
  );
}
