import { Header, Footer } from "@/components";

interface MainLayoutProps {
  children: React.ReactNode;
}

// With header and footer
const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
