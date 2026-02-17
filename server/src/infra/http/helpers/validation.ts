import { z } from "zod";

export const urlSchema = z.string().refine((value) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}, {
  message: "A URL deve ser válida e começar com http:// ou https://",
});