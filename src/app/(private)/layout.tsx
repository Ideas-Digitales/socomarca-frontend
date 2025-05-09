import Footer from "../components/global/Footer";
import Navbar from "../components/global/Navbar";

export default function PrivateLayout({
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
        <Footer />
      </div>
    </>
  );
}
