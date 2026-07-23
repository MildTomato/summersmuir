import { Header } from '@/app/components/header';

export default function PRsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="pt-16">{children}</div>
    </>
  );
}
