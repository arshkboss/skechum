export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl flex flex-col gap-12 items-center mx-auto w-full px-4 md:px-6 lg:px-8 justify-center py-24">{children}</div>
  );
}
