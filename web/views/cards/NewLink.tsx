"use client";

import { useState } from "react";

export default function NewLink() {
  const [originalLink, setOriginalLink] = useState("");
  const [shortLink, setShortLink] = useState("");

  return (
    <div className="w-[calc(100%-24px)] flex flex-col gap-5 p-6 bg-white rounded">
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
      <button
        disabled={originalLink === "" || shortLink === ""}
        className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Criar link
      </button>
    </div>
  );
}
