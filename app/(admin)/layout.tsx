import { Noto_Sans_JP } from "next/font/google";
import { getSession } from "@/lib/auth-helpers";
import { AdminShell } from "./_components/AdminShell";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans",
  display: "swap",
});

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // No session: render children only (login page).
  // proxy.ts handles unauthenticated redirects for all other /admin/* routes.
  if (!session) {
    return <div className={notoSansJP.variable}>{children}</div>;
  }

  const userName =
    session.user.name ?? session.user.email ?? "管理者";

  return (
    <div className={`${notoSansJP.variable} flex flex-1 flex-col`}>
      <AdminShell userName={userName}>{children}</AdminShell>
    </div>
  );
}
