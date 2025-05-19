export default function AdministradorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div>
        <main className="">{children}</main>
      </div>
    </>
  );
}
