import Header from "@/components/layouts/Header";
import { Upload } from "@/types/Upload";
import MyLinks from "@/views/cards/MyLinks";
import NewLink from "@/views/cards/NewLink";

async function getUploads(): Promise<Upload[]> {
  const response = await fetch("http://localhost:3333/uploads", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch uploads");
  }

  return response.json();
}

export default async function Home() {
  const uploads = await getUploads();

  return (
    <div className="flex items-center justify-center font-sans">
      <main className="flex w-full max-w-5xl flex-col gap-4 items-center justify-between sm:items-start">
        <Header className="flex justify-center md:justify-start" />
        <div className="w-full flex flex-col md:grid md:grid-cols-5">
          <NewLink className="md:col-span-2" />
          <MyLinks uploads={uploads} className="md:col-span-3" />
        </div>
      </main>
    </div>
  );
}
