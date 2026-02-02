import MyLinks from "@/views/cards/MyLinks";
import NewLink from "@/views/cards/NewLink";

export default function Home() {
  return (
    <div className="flex items-center justify-center font-sans">
      <main className="flex w-full max-w-3xl flex-col gap-4 items-center justify-between sm:items-start">
        <NewLink />
        <MyLinks />
      </main>
    </div>
  );
}
