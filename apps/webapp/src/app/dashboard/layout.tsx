import { SmallNavbar } from '../components/smallNavbar';
import { AppHeader } from '../components/appHeader';
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <section className="min-h-screen w-screen">
        <div className="mx-auto max-w-5xl"><AppHeader />
        {children}</div>
        <SmallNavbar />
      </section>
    </>
  );
}
