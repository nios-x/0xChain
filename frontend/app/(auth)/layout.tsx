export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background glow effects */}
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="fixed top-[-5%] left-[-5%] w-[30%] h-[30%] bg-secondary-container/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      {children}
    </div>
  );
}
