import Navbar from "../components/global/Navbar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex flex-col min-h-dvh">
        {/* Navbar */}
        <Navbar />
        <main className="flex-grow relative w-full ">{children}</main>
        {/* Footer */}
        <footer className=" py-4 text-center">
          <p>© 2025 Socomarca. Todos los derechos reservados.</p>
        </footer>
      </div>
    </>
  );
}
