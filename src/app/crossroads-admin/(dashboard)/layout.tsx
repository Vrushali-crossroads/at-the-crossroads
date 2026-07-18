import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import Sidebar from "../components/Sidebar";
import { logoutAction } from "../actions";

export default async function AdminDashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();
  if (!session) redirect("/crossroads-admin/login");

  return (
    <div className="flex min-h-screen flex-col bg-cream sm:flex-row">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <header className="flex justify-end border-b border-ink/10 bg-white px-4 py-3 sm:px-10">
          <form action={logoutAction}>
            <button
              type="submit"
              className="cursor-pointer rounded-lg px-3 py-1.5 font-sans text-sm font-bold text-ink/60 hover:bg-cream hover:text-ink"
            >
              Log out
            </button>
          </form>
        </header>
        <main className="flex-1 px-4 py-8 sm:px-10 sm:py-10">{children}</main>
      </div>
    </div>
  );
}
