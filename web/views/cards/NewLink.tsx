"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function NewLink({
  className,
}: Readonly<{ className?: string }>) {
  const [originalLink, setOriginalLink] = useState("");
  const [shortLink, setShortLink] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const originalLinkSanitized = useMemo(
    () => originalLink.trim(),
    [originalLink],
  );
  const shortLinkSanitized = useMemo(() => shortLink.trim(), [shortLink]);

  const router = useRouter();

  const canSave = useMemo(() => {
    if (!originalLinkSanitized || !shortLinkSanitized) return false;

    const withProtocol =
      originalLinkSanitized.startsWith("http://") ||
      originalLinkSanitized.startsWith("https://")
        ? originalLinkSanitized
        : `https://${originalLinkSanitized}`;

    try {
      new URL(withProtocol);
      return true;
    } catch {
      return false;
    }
  }, [originalLinkSanitized, shortLinkSanitized]);

  async function handleSubmit() {
    setError(null);
    setSuccess(null);

    if (!canSave) {
      setError("Preencha os campos corretamente (URL inválida).");
      return;
    }

    const urlToSend =
      originalLinkSanitized.startsWith("http://") ||
      originalLinkSanitized.startsWith("https://")
        ? originalLinkSanitized
        : `https://${originalLinkSanitized}`;

    setLoading(true);

    try {
      const res = await fetch("http://localhost:3333/uploads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: shortLinkSanitized,
          url: urlToSend,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const message =
          data?.message || `Erro ao salvar (status ${res.status}).`;
        setError(message);
        return;
      }

      setSuccess("Link salvo com sucesso!");
      setOriginalLink("");
      setShortLink("");

      router.refresh();
    } catch (err) {
      setError(`Erro: ${err}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`w-[calc(100%-24px)] flex flex-col gap-5 p-6 bg-white rounded ${className}`}
    >
      <h2 className="text-lg font-bold">Novo link</h2>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <p className="text-sm uppercase">link original</p>
          <input
            type="text"
            value={originalLink}
            onChange={(e) => setOriginalLink(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="www.exemplo.com.br"
          />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm uppercase">link encurtado</p>
          <input
            type="text"
            value={shortLink}
            onChange={(e) => setShortLink(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="brev.ly/"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-600">
          {success}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={originalLink === "" || shortLink === ""}
        className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Salvando..." : "Salvar link"}
      </button>
    </div>
  );
}
