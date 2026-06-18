import { SmallNavbar } from '../../components/smallNavbar';
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <section className="min-h-screen w-screen flex flex-col items-center">
        <div className="w-full max-w-lg">{children}</div>
        <SmallNavbar />
      </section>
    </>
  );
}
