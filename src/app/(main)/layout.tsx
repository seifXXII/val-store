import { Footer } from "@/components/layout/Footer";
import { ServerAnnouncementBar } from "@/components/layout/ServerAnnouncementBar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ServerAnnouncementBar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
