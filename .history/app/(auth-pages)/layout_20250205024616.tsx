export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-w-64 max-w-4xl mx-auto justify-center items-center ">
      {children}
    </div>
  );
}
