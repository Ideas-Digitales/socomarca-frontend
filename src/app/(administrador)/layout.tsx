import Sidebar from '../components/admin/Sidebar';

export default function AdministradorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex w-full">
        <Sidebar />
        <div className="flex flex-col min-h-dvh w-full">
          <main className="flex-grow relative w-full">{children}</main>
        </div>
      </div>
    </>
  );
}
