// Dashboard has its own sidebar — skip the global NavBar, Footer, and ChatbotButton
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
