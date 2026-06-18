import { SmallNavbar } from '../../components/smallNavbar';
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <section className="min-h-screen w-screen">
        {children}
        <SmallNavbar />
      </section>
    </>
  );
}
