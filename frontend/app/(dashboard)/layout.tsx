import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-[240px] relative">
        <TopNav />
        <div className="max-w-[1600px] mx-auto px-8 py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
