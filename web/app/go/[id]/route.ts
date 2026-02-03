import { redirect } from "next/navigation";
 
export async function GET(
  _req: Request,
  ctx: {params: Promise<{ id: string }>}
) {
  const { id } = await ctx.params;

  const response = await fetch(`http://localhost:3333/uploads/${id}`, {
    cache: "no-store",
  });
 
  if (!response.ok) {
    redirect("/");
  }
 
  const upload = await response.json();
 
  fetch(`http://localhost:3333/uploads/${id}/access`, {
    method: "PATCH",
  }).catch(() => {});
 
  const url = String(upload.url || "");
  const urlSanitized =
    url.startsWith("http://") || url.startsWith("https://")
      ? url
      : `https://${url}`;
 
  redirect(urlSanitized);
}