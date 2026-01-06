import Navbar from "../../components/navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full">
      <Navbar />
      <main className="h-full">
        {children}
      </main>
    </div>
  );
}