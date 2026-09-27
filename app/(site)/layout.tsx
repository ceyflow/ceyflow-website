import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { getSettings } from "../../lib/db";

export const dynamic = "force-dynamic";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const s = getSettings();
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter s={s} />
    </>
  );
}
